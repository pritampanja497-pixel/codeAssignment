import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

/* ── Custom tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(10,11,30,0.96)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 12,
      padding: '12px 16px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      minWidth: 160,
    }}>
      <p style={{ fontSize: '0.72rem', color: '#8892b0', marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ fontSize: '0.95rem', fontWeight: 700, color: p.color, margin: '2px 0' }}>
          {p.name}: {p.dataKey === 'net_revenue'
            ? `$${Number(p.value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
            : `${Number(p.value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        </p>
      ))}
    </div>
  )
}

/* ── Format month label "2024-03" → "Mar '24" ────────────── */
function fmtMonth(m) {
  if (!m) return ''
  const [y, mo] = m.split('-')
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${names[parseInt(mo, 10) - 1]} '${y.slice(2)}`
}

/* ── Y-axis formatter ─────────────────────────────────────── */
function fmtY(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

/* ── Main Chart Component ─────────────────────────────────── */
export default function RevenueChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-dots" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <span /><span /><span />
          </div>
          <p style={{ color: '#4a5275', fontSize: '0.85rem' }}>Loading chart data…</p>
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#4a5275' }}>No trend data available.</p>
      </div>
    )
  }

  const chartData = data.map(d => ({
    ...d,
    month_label: fmtMonth(d.month),
    net_revenue: Number(d.net_revenue),
    gross_profit: Number(d.gross_profit),
  }))

  return (
    <div style={{ height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 10 }}>
          <defs>
            {/* Revenue gradient */}
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.03} />
            </linearGradient>
            {/* Profit gradient */}
            <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#059669" stopOpacity={0.40} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="month_label"
            tick={{ fill: '#4a5275', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tickFormatter={fmtY}
            tick={{ fill: '#4a5275', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            width={62}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: '0.8rem', color: '#8892b0' }}
            formatter={(value) => value === 'net_revenue' ? 'Net Revenue' : 'Gross Profit'}
          />

          <Area
            type="monotone"
            dataKey="net_revenue"
            name="net_revenue"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#gradRevenue)"
            dot={false}
            activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
          />

          <Area
            type="monotone"
            dataKey="gross_profit"
            name="gross_profit"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#gradProfit)"
            dot={false}
            activeDot={{ r: 5, fill: '#059669', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
