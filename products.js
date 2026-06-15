const express = require('express');
const router  = express.Router();
const { getDb } = require('../db/database');

/**
 * GET /api/products
 * Returns distinct products with total net revenue, units sold,
 * gross profit, and gross profit margin — sorted by revenue desc.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();

    const products = db.prepare(`
      SELECT
        product,
        category,
        SUM(units_sold)                                   AS total_units,
        ROUND(SUM(net_revenue),   2)                      AS total_net_revenue,
        ROUND(SUM(gross_profit),  2)                      AS total_gross_profit,
        ROUND(SUM(gross_profit) / SUM(net_revenue) * 100, 1) AS gross_profit_margin
      FROM  sales
      GROUP BY product, category
      ORDER BY total_net_revenue DESC
    `).all();

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('[GET /api/products]', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
