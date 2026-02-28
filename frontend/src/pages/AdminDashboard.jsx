import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/admindashboard.css'

// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', strokeWidth = 1.8, paths, cx, cy, r, points, x1, y1, x2, y2, rx, ry, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d && <path d={d} />}
    {paths && paths.map((p, i) => <path key={i} d={p} />)}
    {cx !== undefined && <circle cx={cx} cy={cy} r={r} />}
    {points && <polyline points={points} />}
    {x1 !== undefined && <line x1={x1} y1={y1} x2={x2} y2={y2} />}
    {rx !== undefined && <rect x={rest.x} y={rest.y} width={rest.width} height={rest.height} rx={rx} ry={ry} />}
  </svg>
)

// ── Sidebar nav data (with route paths) ──────────────────────────────────────
const NAV = [
  {
    section: 'Main',
    items: [
      {
        id: 'dashboard', label: 'Dashboard', badge: null, path: '/admin-dashboard',
        icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
        sub: [
          { label: 'Overview / Analytics', path: '/admin-dashboard' },
          { label: 'Key Metrics', path: '/admin-dashboard' },
        ],
      },
    ],
  },
  {
    section: 'Management',
    items: [
      {
        id: 'users', label: 'Users', badge: null, path: '/all-users',
        icon: <Icon paths={['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2']} cx="9" cy="7" r="4" />,
        sub: [
          { label: 'All Users', path: '/all-users' },
          { label: 'Add New User', path: '/add-user' },
          { label: 'User Roles / Permissions', path: '/user-roles' },
          { label: 'Activity Logs', path: '/activity-logs' },
        ],
      },
      {
        id: 'products', label: 'Products / Inventory', badge: null,
        icon: <Icon d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />,
        sub: [
          { label: 'All Products', path: '/all-products' },
          { label: 'Add Product', path: '/add-product' },
          {
            label: 'Categories', nested: [
              { label: 'All Categories', path: '/all-categories' },
              { label: 'Add Category', path: '/add-category' },
            ]
          },
          {
            label: 'Brands', nested: [
              { label: 'All Brands', path: '/all-brands' },
              { label: 'Add Brand', path: '/add-brand' },
            ]
          },
          { label: 'Stock Management', path: '/stock-management' },
        ],
      },
      {
        id: 'orders', label: 'Orders / Sales', badge: '12', path: '/all-orders',
        icon: <Icon paths={['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11']} />,
        sub: [
          { label: 'All Orders', path: '/all-orders' },
          { label: 'Pending Orders', path: '/pending-orders' },
          { label: 'Completed Orders', path: '/completed-orders' },
          { label: 'Returns / Refunds', path: '/returns-refunds' },
        ],
      },
    ],
  },
  {
    section: 'Growth',
    items: [
      {
        id: 'reports', label: 'Reports & Analytics', badge: null, path: '/sales-report',
        icon: <Icon paths={['M18 20V10', 'M12 20V4', 'M6 20v-6']} />,
        sub: [
          { label: 'Sales Report', path: '/sales-report' },
          { label: 'User Activity Report', path: '/user-activity-report' },
          { label: 'Product Performance', path: '/product-performance' },
          { label: 'Revenue Analytics', path: '/revenue-analytics' },
        ],
      },
      {
        id: 'marketing', label: 'Marketing', badge: null, path: '/coupons',
        icon: <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
        sub: [
          { label: 'Coupons / Discounts', path: '/coupons' },
          { label: 'Newsletter / Email Campaigns', path: '/email-campaigns' },
          { label: 'Ads / Promotions', path: '/ads-promotions' },
        ],
      },
      {
        id: 'content', label: 'Content Management', badge: null, path: '/blogs',
        icon: <Icon paths={['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7']} d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
        sub: [
          { label: 'Blogs / Articles', path: '/blogs' },
          { label: 'Pages (About, Contact)', path: '/pages' },
          { label: 'Banners / Hero Images', path: '/banners' },
        ],
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        id: 'settings', label: 'Settings', badge: null, path: '/general-settings',
        icon: <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" paths={['M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z']} />,
        sub: [
          { label: 'General Settings', path: '/general-settings' },
          { label: 'Payment Settings', path: '/payment-settings' },
          { label: 'Shipping Settings', path: '/shipping-settings' },
          { label: 'Notification Settings', path: '/notification-settings' },
        ],
      },
      {
        id: 'support', label: 'Support / Feedback', badge: '5', path: '/customer-queries',
        icon: <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
        sub: [
          { label: 'Customer Queries', path: '/customer-queries' },
          { label: 'Tickets / Support Requests', path: '/support-tickets' },
          { label: 'Feedback / Reviews', path: '/feedback-reviews' },
        ],
      },
    ],
  },
]

// ── Metric cards data ────────────────────────────────────────────────────────
const METRICS = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', up: true, color: '#ff6b35', bg: 'rgba(255,107,53,0.15)', icon: '💰' },
  { label: 'Total Orders', value: '3,842', change: '+8.2%', up: true, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '📦' },
  { label: 'Total Users', value: '12,490', change: '+4.1%', up: true, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', icon: '👥' },
  { label: 'Returns', value: '128', change: '-2.3%', up: false, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '↩️' },
]

// ── Chart data ───────────────────────────────────────────────────────────────
const CHART = [
  { label: 'Mon', h: 55 }, { label: 'Tue', h: 72 }, { label: 'Wed', h: 60 },
  { label: 'Thu', h: 85, hi: true }, { label: 'Fri', h: 78 }, { label: 'Sat', h: 92, hi: true },
  { label: 'Sun', h: 45 },
]

// ── Recent orders ─────────────────────────────────────────────────────────────
const ORDERS = [
  { id: '#ORD-7821', customer: 'Rahim Uddin', product: 'Nike Air Max', amount: '$129.00', status: 'completed' },
  { id: '#ORD-7820', customer: 'Sara Islam', product: 'iPhone Case', amount: '$24.99', status: 'pending' },
  { id: '#ORD-7819', customer: 'Karim Khan', product: 'Wireless Earbuds', amount: '$89.00', status: 'processing' },
  { id: '#ORD-7818', customer: 'Nadia Hossain', product: 'Leather Wallet', amount: '$45.00', status: 'completed' },
  { id: '#ORD-7817', customer: 'Arif Mahmud', product: 'Smart Watch', amount: '$199.00', status: 'cancelled' },
]

// ── Top products ──────────────────────────────────────────────────────────────
const TOP_PRODUCTS = [
  { name: 'Nike Air Max 270', emoji: '👟', sales: '1,204 sold', rev: '$18,940' },
  { name: 'Wireless Earbuds Pro', emoji: '🎧', sales: '842 sold', rev: '$9,680' },
  { name: 'Smart Watch Series X', emoji: '⌚', sales: '631 sold', rev: '$8,450' },
  { name: 'Leather Tote Bag', emoji: '👜', sales: '524 sold', rev: '$5,240' },
]

// ── Nested Sub-Item Component ─────────────────────────────────────────────────
const NestedSubItem = ({ item, activeSubItem, onSubClick }) => {
  const [openNested, setOpenNested] = useState(false)
  const hasNested = item.nested && item.nested.length > 0

  if (hasNested) {
    return (
      <div>
        <div
          className="ad-subnav-item has-nested"
          onClick={() => setOpenNested(p => !p)}
        >
          <span className="ad-subnav-dot" />
          <span className="ad-subnav-text">{item.label}</span>
          <span className={`ad-nested-chevron ${openNested ? 'open' : ''}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
        <div className={`ad-nested-subnav ${openNested ? 'open' : ''}`}>
          {item.nested.map(nested => (
            <Link
              key={nested.label}
              to={nested.path}
              className={`ad-nested-item ${activeSubItem === nested.label ? 'active' : ''}`}
              onClick={() => onSubClick(nested.label)}
            >
              <span className="ad-nested-line" />
              {nested.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Link
      to={item.path}
      className={`ad-subnav-item ${activeSubItem === item.label ? 'active' : ''}`}
      onClick={() => onSubClick(item.label)}
    >
      <span className="ad-subnav-dot" />
      <span className="ad-subnav-text">{item.label}</span>
    </Link>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [openSubs, setOpenSubs] = useState({ dashboard: true })
  const [activeSubItem, setActiveSubItem] = useState('Overview / Analytics')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const toggleSub = (id) => {
    setOpenSubs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNavClick = (id) => {
    setActiveNav(id)
    toggleSub(id)
  }

  const handleSubClick = (label) => {
    setActiveSubItem(label)
  }

  const getStatusClass = (s) => {
    if (s === 'completed') return 'status-completed'
    if (s === 'pending') return 'status-pending'
    if (s === 'cancelled') return 'status-cancelled'
    return 'status-processing'
  }

  const getPageTitle = () => {
    const all = NAV.flatMap(s => s.items)
    const item = all.find(i => i.id === activeNav)
    return item ? item.label : 'Dashboard'
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/admin-login')
  }

  return (
    <div className="ad-layout" onClick={() => showProfileMenu && setShowProfileMenu(false)}>

      {/* ── SIDEBAR ── */}
      <aside className={`ad-sidebar ${collapsed ? 'collapsed' : ''}`}>

        {/* Header */}
        <div className="ad-sidebar-header">
          <div className="ad-logo-icon" onClick={() => setCollapsed(!collapsed)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <Link to="/admin-dashboard" className="ad-logo-text">Shop<span>Nest</span></Link>
        </div>

        {/* Nav */}
        <nav className="ad-nav">
          {NAV.map(section => (
            <div key={section.section}>
              <div className="ad-section-label">{section.section}</div>
              {section.items.map(item => (
                <div key={item.id}>
                  {/* Parent row — left side is a Link, right side toggles sub */}
                  <div
                    className={`ad-nav-item ${activeNav === item.id ? 'active' : ''}`}
                    data-tip={item.label}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <Link
                      to={item.path}
                      className="ad-nav-item-link"
                      onClick={e => e.stopPropagation()}
                    >
                      <span className="ad-nav-icon">{item.icon}</span>
                      <span className="ad-nav-label">{item.label}</span>
                    </Link>
                    {item.badge && <span className="ad-nav-badge">{item.badge}</span>}
                    {item.sub && (
                      <span className={`ad-chevron ${openSubs[item.id] ? 'open' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {/* Sub-items */}
                  {item.sub && (
                    <div className={`ad-subnav ${openSubs[item.id] ? 'open' : ''}`}>
                      {item.sub.map(sub => (
                        <NestedSubItem
                          key={sub.label}
                          item={sub}
                          activeSubItem={activeSubItem}
                          onSubClick={handleSubClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer — Profile & Logout */}
        <div className="ad-sidebar-footer">
          <div className="ad-footer-section-label">Profile & Account</div>

          <div
            className={`ad-nav-item ${activeNav === 'profile' ? 'active' : ''}`}
            data-tip="Admin Profile"
            onClick={(e) => { e.stopPropagation(); setShowProfileMenu(p => !p); setActiveNav('profile') }}
          >
            <span className="ad-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <span className="ad-nav-label">Admin Profile</span>
            <span className={`ad-chevron ${showProfileMenu ? 'open' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </div>

          <div className={`ad-subnav ${showProfileMenu ? 'open' : ''}`}>
            <Link
              to="/admin-profile"
              className={`ad-subnav-item ${activeSubItem === 'view-profile' ? 'active' : ''}`}
              onClick={() => handleSubClick('view-profile')}
            >
              <span className="ad-subnav-dot" />
              <span className="ad-subnav-text">View Profile</span>
            </Link>
            <Link
              to="/change-password"
              className={`ad-subnav-item ${activeSubItem === 'change-password' ? 'active' : ''}`}
              onClick={() => handleSubClick('change-password')}
            >
              <span className="ad-subnav-dot" />
              <span className="ad-subnav-text">Change Password</span>
            </Link>
          </div>

          <div
            className="ad-nav-item ad-logout-btn"
            data-tip="Logout"
            onClick={handleLogout}
          >
            <span className="ad-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span className="ad-nav-label">Logout</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={`ad-main ${collapsed ? 'collapsed' : ''}`}>

        {/* Topbar */}
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button className="ad-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="ad-breadcrumb">
              <span>Admin</span>
              <span className="ad-breadcrumb-sep">/</span>
              <span className="ad-breadcrumb-current">{getPageTitle()}</span>
              {activeSubItem && (
                <>
                  <span className="ad-breadcrumb-sep">/</span>
                  <span className="ad-breadcrumb-sub">{activeSubItem}</span>
                </>
              )}
            </div>
          </div>
          <div className="ad-topbar-right">
            <button className="ad-topbar-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button className="ad-topbar-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="ad-notif-dot" />
            </button>
            <div className="ad-avatar">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="ad-content">

          <div className="ad-page-header">
            <h1 className="ad-page-title">Dashboard Overview</h1>
            <p className="ad-page-sub">Welcome back, Admin! Here's what's happening in your store.</p>
          </div>

          <div className="ad-metrics">
            {METRICS.map((m, i) => (
              <div className="ad-metric-card" key={i}>
                <div className="ad-metric-glow" style={{ background: m.color }} />
                <div className="ad-metric-icon" style={{ background: m.bg }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>
                </div>
                <div className="ad-metric-value">{m.value}</div>
                <div className="ad-metric-label">{m.label}</div>
                <span className={`ad-metric-change ${m.up ? 'up' : 'down'}`}>
                  {m.up ? '↑' : '↓'} {m.change}
                </span>
              </div>
            ))}
          </div>

          <div className="ad-grid">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Weekly Sales</span>
                <Link to="/sales-report" className="ad-card-action">View Report →</Link>
              </div>
              <div className="ad-chart-bars">
                {CHART.map((bar, i) => (
                  <div className="ad-bar-wrap" key={i}>
                    <div className={`ad-bar ${bar.hi ? 'highlight' : ''}`} style={{ height: `${bar.h}%` }} />
                    <span className="ad-bar-label">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Top Products</span>
                <Link to="/all-products" className="ad-card-action">See All →</Link>
              </div>
              <div className="ad-product-list">
                {TOP_PRODUCTS.map((p, i) => (
                  <div className="ad-product-item" key={i}>
                    <div className="ad-product-thumb">{p.emoji}</div>
                    <div>
                      <div className="ad-product-name">{p.name}</div>
                      <div className="ad-product-sales">{p.sales}</div>
                    </div>
                    <div className="ad-product-rev">{p.rev}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-header">
              <span className="ad-card-title">Recent Orders</span>
              <Link to="/all-orders" className="ad-card-action">View All Orders →</Link>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o, i) => (
                  <tr key={i}>
                    <td><span className="ad-order-id">{o.id}</span></td>
                    <td>{o.customer}</td>
                    <td>{o.product}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{o.amount}</td>
                    <td>
                      <span className={`ad-status ${getStatusClass(o.status)}`}>
                        <span className="ad-status-dot" />
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  )
}

export default AdminDashboard