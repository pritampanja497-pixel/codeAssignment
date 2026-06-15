/**
 * seed.js
 * -------
 * Creates the `sales` table in SQLite and populates it from
 * novabite_sales_data.csv (auto-generated if the file is missing).
 *
 * Exported as a module so index.js can call it at startup.
 * Also runnable standalone: node scripts/seed.js
 */

const path    = require('path');
const fs      = require('fs');
const { parse }  = require('csv-parse/sync');
const { getDb }  = require('../db/database');
const { generateData } = require('./generateData');

const CSV_PATH = path.join(__dirname, '../data/novabite_sales_data.csv');

function seedDatabase() {
  const db = getDb();

  // ── 1. Create table ────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      date           TEXT    NOT NULL,
      region         TEXT    NOT NULL,
      channel        TEXT    NOT NULL,
      product        TEXT    NOT NULL,
      category       TEXT    NOT NULL,
      sales_rep      TEXT    NOT NULL,
      units_sold     INTEGER NOT NULL,
      gross_revenue  REAL    NOT NULL,
      discount_amount REAL   NOT NULL,
      net_revenue    REAL    NOT NULL,
      cogs           REAL    NOT NULL,
      gross_profit   REAL    NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sales_date     ON sales (date);
    CREATE INDEX IF NOT EXISTS idx_sales_region   ON sales (region);
    CREATE INDEX IF NOT EXISTS idx_sales_channel  ON sales (channel);
    CREATE INDEX IF NOT EXISTS idx_sales_product  ON sales (product);
    CREATE INDEX IF NOT EXISTS idx_sales_category ON sales (category);
    CREATE INDEX IF NOT EXISTS idx_sales_rep      ON sales (sales_rep);
  `);

  // ── 2. Skip if already seeded ──────────────────────────────────────
  const { cnt } = db.prepare('SELECT COUNT(*) AS cnt FROM sales').get();
  if (cnt > 0) {
    console.log(`📊 Database already contains ${cnt} sales records — skipping seed.`);
    return;
  }

  // ── 3. Load or generate CSV ────────────────────────────────────────
  let csvContent;
  if (fs.existsSync(CSV_PATH)) {
    csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    console.log(`📁 Loading data from ${CSV_PATH}`);
  } else {
    console.log('📝 novabite_sales_data.csv not found — generating sample data...');
    csvContent = generateData();
    const dataDir = path.dirname(CSV_PATH);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(CSV_PATH, csvContent, 'utf-8');
    console.log(`💾 Sample CSV written to ${CSV_PATH}`);
  }

  // ── 4. Parse CSV ───────────────────────────────────────────────────
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // ── 5. Bulk-insert inside a transaction ───────────────────────────
  const insert = db.prepare(`
    INSERT INTO sales
      (date, region, channel, product, category, sales_rep,
       units_sold, gross_revenue, discount_amount, net_revenue, cogs, gross_profit)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec('BEGIN TRANSACTION');
  try {
    for (const row of records) {
      insert.run(
        row.date,
        row.region,
        row.channel,
        row.product,
        row.category,
        row.sales_rep,
        parseInt(row.units_sold, 10),
        parseFloat(row.gross_revenue),
        parseFloat(row.discount_amount),
        parseFloat(row.net_revenue),
        parseFloat(row.cogs),
        parseFloat(row.gross_profit)
      );
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log(`✅ Seeded ${records.length} records into SQLite.`);
}

// Standalone execution
if (require.main === module) {
  seedDatabase();
  console.log('Done.');
}

module.exports = { seedDatabase };
