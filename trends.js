const express = require('express');
const router  = express.Router();
const { getDb } = require('../db/database');

/**
 * GET /api/trends
 * Returns monthly net revenue aggregated by YYYY-MM, sorted chronologically.
 * Optionally accepts ?region=West or ?channel=E-Commerce query params to filter.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { region, channel } = req.query;

    let query = `
      SELECT
        strftime('%Y-%m', date)       AS month,
        ROUND(SUM(net_revenue),   2)  AS net_revenue,
        ROUND(SUM(gross_profit),  2)  AS gross_profit,
        SUM(units_sold)               AS units_sold,
        ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS gross_profit_margin
      FROM  sales
      WHERE 1=1
    `;
    const params = [];

    if (region) {
      query += ` AND region = ?`;
      params.push(region);
    }
    if (channel) {
      query += ` AND channel = ?`;
      params.push(channel);
    }

    query += ` GROUP BY month ORDER BY month ASC`;

    const trends = db.prepare(query).all(...params);

    res.json({ success: true, count: trends.length, data: trends });
  } catch (err) {
    console.error('[GET /api/trends]', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
