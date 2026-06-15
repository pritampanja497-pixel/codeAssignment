/**
 * generateData.js
 * ---------------
 * Generates a realistic NovaBite sales CSV dataset covering Jan 2023 – Dec 2025.
 * Embeds specific patterns so the /api/chat endpoint can answer demo questions:
 *
 *   ✔  North region has highest net revenue in Q1 2024
 *   ✔  Snacks category gross profit margin ≈ 35–40%
 *   ✔  Alex Johnson closes the most units in 2025
 *   ✔  Modern Trade > E-Commerce total net revenue
 *   ✔  NovaCrunch Chips is the best performing product in the West region
 */

function generateData() {
  const products = [
    { name: 'NovaCrunch Chips',    category: 'Snacks',    unitPrice: 2.50, margin: 0.40 },
    { name: 'NovaBite Granola Bar',category: 'Snacks',    unitPrice: 1.80, margin: 0.35 },
    { name: 'NovaCookie Oat',      category: 'Snacks',    unitPrice: 3.20, margin: 0.33 },
    { name: 'NovaFizz Cola',       category: 'Beverages', unitPrice: 1.50, margin: 0.30 },
    { name: 'NovaRefresh Juice',   category: 'Beverages', unitPrice: 2.20, margin: 0.25 },
    { name: 'NovaEnergy Drink',    category: 'Beverages', unitPrice: 3.50, margin: 0.28 },
    { name: 'NovaMilk Full Cream', category: 'Dairy',     unitPrice: 1.20, margin: 0.20 },
    { name: 'NovaYogurt Greek',    category: 'Dairy',     unitPrice: 2.80, margin: 0.22 },
    { name: 'NovaBread Multigrain',category: 'Bakery',    unitPrice: 2.00, margin: 0.28 },
    { name: 'NovaCake Chocolate',  category: 'Bakery',    unitPrice: 4.50, margin: 0.32 },
  ];

  const regions  = ['North', 'South', 'East', 'West'];
  const channels = ['E-Commerce', 'Modern Trade', 'General Trade', 'HoReCa'];

  const salesReps = {
    North: ['Alex Johnson', 'Priya Kumar'],
    South: ['Sarah Chen',   'Carlos Rodriguez'],
    East:  ['Mike Patel',   'Anna Schmidt'],
    West:  ['Emily Davis',  'Tom Brown'],
  };

  // Which product indices appear in each channel
  const channelProducts = {
    'E-Commerce':    [0, 1, 2, 3, 4, 5],
    'Modern Trade':  [0, 1, 3, 4, 6, 7, 8, 9],
    'General Trade': [0, 1, 3, 6, 8],
    'HoReCa':        [3, 5, 7, 9],
  };

  // Channel multipliers for base units
  const channelUnitMult = {
    'Modern Trade':  1.45,
    'E-Commerce':    1.00,
    'General Trade': 1.15,
    'HoReCa':        0.65,
  };

  // Channel discount rates
  const channelDiscount = {
    'Modern Trade':  0.08,
    'E-Commerce':    0.12,
    'General Trade': 0.05,
    'HoReCa':        0.03,
  };

  // Seasonal index (Jan–Dec)
  const seasonal = [0.85, 0.80, 0.90, 0.95, 1.00, 1.10, 1.20, 1.15, 1.05, 1.00, 1.15, 1.35];

  // Deterministic LCG for reproducibility
  let seed = 42;
  const rand = () => {
    seed = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 0xffffffff;
  };

  const rows = ['date,region,channel,product,category,sales_rep,units_sold,gross_revenue,discount_amount,net_revenue,cogs,gross_profit'];

  for (let year = 2023; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      for (const region of regions) {
        for (const channel of channels) {
          const pidxList = channelProducts[channel];
          // 1–3 product records per region-channel-month
          const numRec = Math.floor(rand() * 3) + 1;

          for (let r = 0; r < numRec; r++) {
            const pidx    = pidxList[Math.floor(rand() * pidxList.length)];
            const product = products[pidx];
            const reps    = salesReps[region];
            const rep     = reps[Math.floor(rand() * reps.length)];

            // Base units 100–600
            let units = Math.floor(rand() * 500) + 100;

            // Apply channel multiplier
            units = Math.floor(units * channelUnitMult[channel]);

            // ── Specific patterns ──────────────────────────────────────────
            // 1. North Q1 2024 → highest net revenue
            if (region === 'North' && year === 2024 && month <= 3) {
              units = Math.floor(units * 2.4);
            }

            // 2. Alex Johnson → most units sold in 2025
            if (rep === 'Alex Johnson' && year === 2025) {
              units = Math.floor(units * 3.0);
            }

            // 3. West + NovaCrunch Chips → best product in West
            if (region === 'West' && product.name === 'NovaCrunch Chips') {
              units = Math.floor(units * 2.2);
            }
            // ──────────────────────────────────────────────────────────────

            // Seasonal adjustment
            units = Math.floor(units * seasonal[month - 1]);
            if (units < 10) units = 10;

            // Financial calculations
            const grossRevenue  = parseFloat((units * product.unitPrice).toFixed(2));
            const discountAmt   = parseFloat((grossRevenue * channelDiscount[channel]).toFixed(2));
            const netRevenue    = parseFloat((grossRevenue - discountAmt).toFixed(2));
            const cogs          = parseFloat((netRevenue * (1 - product.margin)).toFixed(2));
            const grossProfit   = parseFloat((netRevenue - cogs).toFixed(2));

            const day = String(Math.floor(rand() * 28) + 1).padStart(2, '0');
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${day}`;

            rows.push(
              `${dateStr},${region},${channel},"${product.name}",${product.category},"${rep}",${units},${grossRevenue},${discountAmt},${netRevenue},${cogs},${grossProfit}`
            );
          }
        }
      }
    }
  }

  return rows.join('\n');
}

// Direct execution: node scripts/generateData.js
if (require.main === module) {
  const path = require('path');
  const fs   = require('fs');

  const csvContent = generateData();
  const outPath    = path.join(__dirname, '../data/novabite_sales_data.csv');
  const outDir     = path.dirname(outPath);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outPath, csvContent, 'utf-8');
  const lines = csvContent.split('\n').length - 1; // exclude header
  console.log(`✅ Generated ${lines} records → ${outPath}`);
}

module.exports = { generateData };
