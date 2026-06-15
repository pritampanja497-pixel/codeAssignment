const express = require('express');
const router  = express.Router();
const { getDb } = require('../db/database');

/* ─── Lazy-init LLM clients ──────────────────────────────────────────── */
let _openai    = null;
let _anthropic = null;

function getOpenAI() {
  if (!_openai) {
    const { default: OpenAI } = require('openai');
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function getAnthropic() {
  if (!_anthropic) {
    const Anthropic = require('@anthropic-ai/sdk');
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

/* ─── Build rich data context from SQLite ────────────────────────────── */
function buildContext(db) {
  const kpi = db.prepare(`
    SELECT
      ROUND(SUM(net_revenue),  2)                           AS total_net_revenue,
      SUM(units_sold)                                       AS total_units,
      ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS overall_margin
    FROM sales
  `).get();

  const byRegion = db.prepare(`
    SELECT region,
           ROUND(SUM(net_revenue), 2) AS revenue,
           SUM(units_sold)            AS units,
           ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS margin
    FROM   sales GROUP BY region ORDER BY revenue DESC
  `).all();

  const byChannel = db.prepare(`
    SELECT channel,
           ROUND(SUM(net_revenue), 2) AS revenue,
           SUM(units_sold)            AS units
    FROM   sales GROUP BY channel ORDER BY revenue DESC
  `).all();

  const byCategory = db.prepare(`
    SELECT category,
           ROUND(SUM(net_revenue), 2) AS revenue,
           SUM(units_sold)            AS units,
           ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS margin
    FROM   sales GROUP BY category ORDER BY revenue DESC
  `).all();

  const byProduct = db.prepare(`
    SELECT product, category,
           ROUND(SUM(net_revenue), 2) AS revenue,
           SUM(units_sold)            AS units,
           ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS margin
    FROM   sales GROUP BY product ORDER BY revenue DESC
  `).all();

  const q1_2024 = db.prepare(`
    SELECT region,
           ROUND(SUM(net_revenue), 2) AS revenue,
           SUM(units_sold)            AS units
    FROM   sales
    WHERE  date BETWEEN '2024-01-01' AND '2024-03-31'
    GROUP  BY region ORDER BY revenue DESC
  `).all();

  const repUnits2025 = db.prepare(`
    SELECT sales_rep,
           SUM(units_sold)            AS units,
           ROUND(SUM(net_revenue), 2) AS revenue,
           region
    FROM   sales
    WHERE  date >= '2025-01-01'
    GROUP  BY sales_rep ORDER BY units DESC
    LIMIT  15
  `).all();

  const regionProduct = db.prepare(`
    SELECT region, product,
           ROUND(SUM(net_revenue), 2) AS revenue,
           SUM(units_sold)            AS units
    FROM   sales GROUP BY region, product ORDER BY region, revenue DESC
  `).all();

  // Best product per region
  const bestByRegion = {};
  regionProduct.forEach(r => {
    if (!bestByRegion[r.region]) bestByRegion[r.region] = r;
  });

  const monthly = db.prepare(`
    SELECT strftime('%Y-%m', date) AS month,
           ROUND(SUM(net_revenue), 2) AS revenue
    FROM   sales GROUP BY month ORDER BY month
  `).all();

  return { kpi, byRegion, byChannel, byCategory, byProduct, q1_2024, repUnits2025, bestByRegion, monthly };
}

/* ─── Build system prompt ────────────────────────────────────────────── */
function buildSystemPrompt(ctx) {
  const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const usd = (n) => '$' + fmt(n);

  return `You are a senior sales analytics expert for NovaBite, a food & beverage company.
Answer every question with precise numbers drawn from the data below. Be concise, factual, and professional.
Format monetary values with $ and commas. Use bullet points for lists.

═══ OVERALL KPIs ═══
• Total Net Revenue : ${usd(ctx.kpi.total_net_revenue)}
• Total Units Sold  : ${fmt(ctx.kpi.total_units)}
• Gross Profit Margin: ${ctx.kpi.overall_margin}%

═══ NET REVENUE BY REGION ═══
${ctx.byRegion.map(r => `• ${r.region}: ${usd(r.revenue)} | ${fmt(r.units)} units | ${r.margin}% margin`).join('\n')}

═══ NET REVENUE BY CHANNEL ═══
${ctx.byChannel.map(c => `• ${c.channel}: ${usd(c.revenue)} | ${fmt(c.units)} units`).join('\n')}

═══ NET REVENUE & MARGIN BY CATEGORY ═══
${ctx.byCategory.map(c => `• ${c.category}: ${usd(c.revenue)} | ${fmt(c.units)} units | ${c.margin}% gross profit margin`).join('\n')}

═══ NET REVENUE BY PRODUCT (all) ═══
${ctx.byProduct.map(p => `• ${p.product} (${p.category}): ${usd(p.revenue)} | ${fmt(p.units)} units | ${p.margin}% margin`).join('\n')}

═══ Q1 2024 (Jan–Mar 2024) BY REGION ═══
${ctx.q1_2024.map(r => `• ${r.region}: ${usd(r.revenue)} | ${fmt(r.units)} units`).join('\n')}

═══ TOP SALES REPS BY UNITS (2025) ═══
${ctx.repUnits2025.map((r, i) => `${i + 1}. ${r.sales_rep} (${r.region}): ${fmt(r.units)} units | ${usd(r.revenue)}`).join('\n')}

═══ BEST PRODUCT PER REGION ═══
${Object.entries(ctx.bestByRegion).map(([reg, p]) => `• ${reg}: ${p.product} — ${usd(p.revenue)} | ${fmt(p.units)} units`).join('\n')}

═══ MONTHLY REVENUE TREND (last 18 months) ═══
${ctx.monthly.slice(-18).map(m => `• ${m.month}: ${usd(m.revenue)}`).join('\n')}

Data covers January 2023 – December 2025.`;
}

/* ─── POST /api/chat ─────────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'question is required' });
    }

    const db           = getDb();
    const ctx          = buildContext(db);
    const systemPrompt = buildSystemPrompt(ctx);

    let answer;

    /* ── Anthropic Claude (preferred if key is present) ── */
    if (process.env.ANTHROPIC_API_KEY) {
      const client   = getAnthropic();
      const response = await client.messages.create({
        model:      'claude-3-5-haiku-20241022',
        max_tokens: 700,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: question.trim() }],
      });
      answer = response.content[0].text;

    /* ── OpenAI GPT-4o-mini ── */
    } else if (process.env.OPENAI_API_KEY) {
      const client   = getOpenAI();
      const response = await client.chat.completions.create({
        model:       'gpt-4o-mini',
        temperature: 0.2,
        max_tokens:  700,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: question.trim() },
        ],
      });
      answer = response.choices[0].message.content;

    /* ── No key configured ── */
    } else {
      answer =
        '⚠️ **No LLM API key configured.**\n\n' +
        'Please create `server/.env` and add:\n' +
        '```\nOPENAI_API_KEY=sk-...\n```\nor\n```\nANTHROPIC_API_KEY=sk-ant-...\n```\n\n' +
        `Your question was: *${question}*`;
    }

    res.json({ success: true, answer });
  } catch (err) {
    console.error('[POST /api/chat]', err.message);
    res.status(500).json({
      success: false,
      error:  'Failed to process your question. Please try again.',
      answer: '❌ Sorry, something went wrong on the server. Please try again.',
    });
  }
});

module.exports = router;
