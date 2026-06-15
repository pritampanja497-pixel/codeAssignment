import { useEffect, useRef, useState } from 'react'

/**
 * KPICard
 * Props:
 *   icon        – emoji or SVG string
 *   label       – small uppercase label
 *   value       – formatted string (e.g. "$4.2M")
 *   sub         – subtitle line
 *   gradient    – CSS gradient string for the card accent & icon
 *   glow        – CSS box-shadow string
 *   badge       – optional badge text
 *   loading     – show skeleton state
 */
export default function KPICard({ icon, label, value, sub, gradient, glow, badge, loading = false }) {
  const [displayed, setDisplayed] = useState('0')
  const prevValue = useRef(null)

  // Animate number on value change (simple count-up for numeric values)
  useEffect(() => {
    if (!value || loading) return
    if (prevValue.current === value) return
    prevValue.current = value

    // Extract numeric portion and prefix/suffix
    const match = String(value).match(/^([^0-9]*)([0-9,.]+)(.*)$/)
    if (!match) { setDisplayed(value); return }

    const prefix = match[1]
    const raw    = parseFloat(match[2].replace(/,/g, ''))
    const suffix = match[3]
    const start  = 0
    const dur    = 900
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / dur, 1)
      const eased    = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current  = start + (raw - start) * eased

      // Format similar to the original
      let formatted
      if (raw >= 1_000_000) {
        formatted = (current / 1_000_000).toFixed(1) + 'M'
      } else if (raw >= 1_000) {
        formatted = (current / 1_000).toFixed(1) + 'K'
      } else {
        formatted = current.toFixed(raw % 1 !== 0 ? 1 : 0)
      }

      setDisplayed(`${prefix}${formatted}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplayed(value) // snap to exact final value
    }

    requestAnimationFrame(tick)
  }, [value, loading])

  if (loading) {
    return (
      <div className="glass-card kpi-card">
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 18 }} />
        <div className="skeleton" style={{ width: '50%', height: 12, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: '80%', height: 32, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: '60%', height: 12 }} />
      </div>
    )
  }

  return (
    <div
      className="glass-card kpi-card"
      style={{ '--card-gradient': gradient, '--icon-gradient': gradient, '--icon-glow': glow }}
    >
      <div className="kpi-icon-wrap" style={{ background: gradient, boxShadow: glow }}>
        {icon}
      </div>

      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{displayed}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {badge && <div className="kpi-badge positive">↑ {badge}</div>}
    </div>
  )
}
