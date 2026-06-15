import { useEffect, useState } from 'react'
import KPICard from '../components/KPICard'
import RevenueChart from '../components/RevenueChart'
import { getSummary, getTrends, getProducts } from '../api/api'

/* ── Helpers ──────────────────────────────────────────────── */
function fmt(n, prefix = '') {
  if (n === null || n === undefined) return '—'
  const num = Number(n)
  if (num >= 1_000_000) return `${prefix}${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000)     return `${prefix}${(num / 1_000).toFixed(1)}K`
  return `${prefix}${num.toLocaleString()}`
}

const categoryClass = {
  Snacks:    'cat-snacks',
  Beverages: 'cat-beverages',
  Dairy:     'cat-dairy',
  Bakery:    'cat-bakery',
}

/* ── Mini bar ─────────────────────────────────────────────── */
function MarginBar({ value, max = 45 }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="margin-bar-wrap">
      <div
        className="margin-bar"
        style={{ width: `${pct}%`, maxWidth: 80 }}
      />
      <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>
        {value}%
      </span>
    </div>
  )
}

/* ── Channel card ─────────────────────────────────────────── */
function ChannelStat({ label, revenue, units, color }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color, marginBottom: 6, boxShadow: `0 0 12px ${color}88`
      }} />
      <div style={{ fontSize: '0.72rem', color: '#4a5275', textTransform: 'uppercase',
                    letterSpacing: '0.08em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f0f4ff' }}>
        {fmt(revenue, '$')}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#8892b0' }}>
        {Number(units).toLocaleString()} units
      </div>
    </div>
  )
}

/* ── Main Dashboard Page ──────────────────────────────────── */
export default function Dashboard() {
  const [summary,  setSummary]  = useState(null)
  const [trends,   setTrends]   = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getSummary(), getTrends(), getProducts()])
      .then(([s, t, p]) => {
        setSummary(s.data)
        setTrends(t.data)
        setProducts(p.data)
      })
      .catch(err => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const kpi = summary || {}

  /* Channel colours */
  const channelColors = {
    'Modern Trade':  '#3b82f6',
    'E-Commerce':    '#7c3aed',
    'General Trade': '#059669',
    'HoReCa':        '#f59e0b',
  }

  return (
    <main className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title gradient-text">Sales Dashboard</h1>
        <p>Real-time analytics · Jan 2023 – Dec 2025 · All regions</p>
      </div>

      {error && (
        <div className="error-banner" style={{ marginBottom: 24 }}>
          ⚠️ {error} — Is the backend running on port 5000?
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="kpi-grid">
        <KPICard
          loading={loading}
          icon="💰"
          label="Total Net Revenue"
          value={fmt(kpi.total_net_revenue, '$')}
          sub={`Gross: ${fmt(kpi.total_gross_revenue, '$')} · Discounts: ${fmt(kpi.total_discounts, '$')}`}
          gradient="linear-gradient(135deg,#2563eb,#06b6d4)"
          glow="0 0 40px rgba(37,99,235,0.3)"
          badge="vs last period"
        />

        <KPICard
          loading={loading}
          icon="📈"
          label="Gross Profit Margin"
          value={kpi.gross_profit_margin ? `${kpi.gross_profit_margin}%` : '—'}
          sub={`Top category: ${kpi.top_category || '…'}`}
          gradient="linear-gradient(135deg,#059669,#06b6d4)"
          glow="0 0 40px rgba(5,150,105,0.3)"
        />

        <KPICard
          loading={loading}
          icon="🌍"
          label="Top Region"
          value={kpi.top_region || '—'}
          sub={`Revenue: ${fmt(kpi.top_region_revenue, '$')}`}
          gradient="linear-gradient(135deg,#7c3aed,#db2777)"
          glow="0 0 40px rgba(124,58,237,0.3)"
          badge={kpi.top_region}
        />
      </div>

      {/* ── Quick Stats Row ── */}
      {!loading && summary && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Units Sold', value: Number(kpi.total_units).toLocaleString(), icon: '📦' },
            { label: 'Top Channel',      value: kpi.top_channel, icon: '🏪' },
            { label: 'Top Product',      value: kpi.top_product, icon: '⭐' },
            { label: 'Top Sales Rep',    value: kpi.top_sales_rep, icon: '🏆' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 180px',
              padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: '0.68rem', color: '#4a5275', textTransform: 'uppercase',
                            letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f0f4ff',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stat.value || '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Revenue Trend Chart ── */}
      <div className="glass-card chart-section" style={{ marginBottom: 28 }}>
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Monthly Net Revenue Trend</h2>
            <p className="chart-subtitle">Net revenue + gross profit · Jan 2023 – Dec 2025</p>
          </div>
          {trends.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="chart-stat-pill">
                <div className="chart-stat-dot" style={{ background: '#3b82f6' }} />
                Net Revenue
              </div>
              <div className="chart-stat-pill">
                <div className="chart-stat-dot" style={{ background: '#059669' }} />
                Gross Profit
              </div>
            </div>
          )}
        </div>
        <RevenueChart data={trends} loading={loading} />
      </div>

      {/* ── Top 5 Products Table ── */}
      <div className="glass-card products-section" style={{ marginBottom: 28 }}>
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Top Products by Revenue</h2>
            <p className="chart-subtitle">All-time net revenue, units, and gross profit margin</p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Net Revenue</th>
                  <th>Units Sold</th>
                  <th>Gross Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map((p, i) => (
                  <tr key={p.product}>
                    <td style={{ color: '#4a5275', fontWeight: 700, width: 36 }}>{i + 1}</td>
                    <td className="product-name">{p.product}</td>
                    <td>
                      <span className={`category-pill ${categoryClass[p.category] || ''}`}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#60a5fa' }}>
                      {fmt(p.total_net_revenue, '$')}
                    </td>
                    <td>{Number(p.total_units).toLocaleString()}</td>
                    <td style={{ color: '#34d399' }}>
                      {fmt(p.total_gross_profit, '$')}
                    </td>
                    <td>
                      <MarginBar value={p.gross_profit_margin} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Channel Breakdown ── */}
      {!loading && summary && (
        <div className="glass-card" style={{ padding: '28px 32px' }}>
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Channel Overview</h2>
              <p className="chart-subtitle">Revenue performance by sales channel</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {['Modern Trade', 'E-Commerce', 'General Trade', 'HoReCa'].map(ch => {
              const rev  = trends.reduce((s, t) => s + (t.net_revenue || 0), 0)
              return (
                <ChannelStat
                  key={ch}
                  label={ch}
                  revenue={ch === kpi.top_channel ? kpi.top_channel_revenue : null}
                  units={null}
                  color={channelColors[ch]}
                />
              )
            })}
          </div>
          <p style={{ marginTop: 14, fontSize: '0.78rem', color: '#4a5275' }}>
            💡 Top channel: <strong style={{ color: '#f0f4ff' }}>{kpi.top_channel}</strong>
            {' · '}Revenue: <strong style={{ color: '#60a5fa' }}>{fmt(kpi.top_channel_revenue, '$')}</strong>
          </p>
        </div>
      )}
    </main>
  )
}
