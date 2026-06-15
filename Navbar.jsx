import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Brand */}
      <NavLink to="/" className="navbar-brand">
        <div className="navbar-logo">🍔</div>
        <span className="navbar-brand-text">
          Nova<span>Bite</span> Analytics
        </span>
      </NavLink>

      {/* Navigation */}
      <div className="navbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <span>📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <span>🤖</span> AI Chat
          <span className="nav-badge">Beta</span>
        </NavLink>
      </div>
    </nav>
  )
}
