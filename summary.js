const express = require('express');
const router  = express.Router();
const { getDb } = require('../db/database');

/**
 * GET /api/summary
 * Returns top-level KPIs:
 *   - total_net_revenue, total_units, gross_profit_margin
 *   - top_region, top_channel, top_product
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();

    const overall = db.prepare(`
      SELECT
        ROUND(SUM(net_revenue),  2)                           AS total_net_revenue,
        SUM(units_sold)                                       AS total_units,
        ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS gross_profit_margin,
        ROUND(SUM(gross_revenue), 2)                          AS total_gross_revenue,
        ROUND(SUM(discount_amount), 2)                        AS total_discounts
      FROM sales
    `).get();

    const topRegion = db.prepare(`
      SELECT region, ROUND(SUM(net_revenue), 2) AS revenue
      FROM   sales
      GROUP  BY region
      ORDER  BY revenue DESC
      LIMIT  1
    `).get();

    const topChannel = db.prepare(`
      SELECT channel, ROUND(SUM(net_revenue), 2) AS revenue
      FROM   sales
      GROUP  BY channel
      ORDER  BY revenue DESC
      LIMIT  1
    `).get();

    const topProduct = db.prepare(`
      SELECT product, ROUND(SUM(net_revenue), 2) AS revenue
      FROM   sales
      GROUP  BY product
      ORDER  BY revenue DESC
      LIMIT  1
    `).get();

    const topCategory = db.prepare(`
      SELECT category, ROUND(SUM(net_revenue), 2) AS revenue
      FROM   sales
      GROUP  BY category
      ORDER  BY revenue DESC
      LIMIT  1
    `).get();

    const topRep = db.prepare(`
      SELECT sales_rep, SUM(units_sold) AS units
      FROM   sales
      GROUP  BY sales_rep
      ORDER  BY units DESC
      LIMIT  1
    `).get();

    res.json({
      success: true,
      data: {
        total_net_revenue:    overall.total_net_revenue,
        total_gross_revenue:  overall.total_gross_revenue,
        total_discounts:      overall.total_discounts,
        total_units:          overall.total_units,
        gross_profit_margin:  overall.gross_profit_margin,
        top_region:           topRegion.region,
        top_region_revenue:   topRegion.revenue,
        top_channel:          topChannel.channel,
        top_channel_revenue:  topChannel.revenue,
        top_product:          topProduct.product,
        top_product_revenue:  topProduct.revenue,
        top_category:         topCategory.category,
        top_sales_rep:        topRep.sales_rep,
        top_sales_rep_units:  topRep.units,
      },
    });
  } catch (err) {
    console.error('[GET /api/summary]', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
