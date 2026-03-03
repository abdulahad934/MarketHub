import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV = [
  {
    section: 'Main',
    items: [
      {
        id: 'dashboard', label: 'Dashboard', path: '/admin-dashboard',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>),
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
        id: 'users', label: 'Users', path: '/all-users',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
        sub: [
          { label: 'All Users', path: '/all-users' },
          { label: 'Add New User', path: '/add-user' },
          { label: 'User Roles / Permissions', path: '/user-roles' },
          { label: 'Activity Logs', path: '/activity-logs' },
        ],
      },
      {
        id: 'products', label: 'Products / Inventory',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>),
        sub: [
          { label: 'All Products', path: '/all-products' },
          { label: 'Add Product', path: '/add-product' },
          { label: 'Categories', nested: [{ label: 'All Categories', path: '/all-categories' }, { label: 'Add Category', path: '/add-category' }] },
          { label: 'Brands', nested: [{ label: 'All Brands', path: '/all-brands' }, { label: 'Add Brand', path: '/add-brand' }] },
          { label: 'Stock Management', path: '/stock-management' },
        ],
      },
      {
        id: 'orders', label: 'Orders / Sales', badge: '12', path: '/all-orders',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>),
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
        id: 'reports', label: 'Reports & Analytics', path: '/sales-report',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>),
        sub: [
          { label: 'Sales Report', path: '/sales-report' },
          { label: 'User Activity Report', path: '/user-activity-report' },
          { label: 'Product Performance', path: '/product-performance' },
          { label: 'Revenue Analytics', path: '/revenue-analytics' },
        ],
      },
      {
        id: 'marketing', label: 'Marketing', path: '/coupons',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>),
        sub: [
          { label: 'Coupons / Discounts', path: '/coupons' },
          { label: 'Email Campaigns', path: '/email-campaigns' },
          { label: 'Ads / Promotions', path: '/ads-promotions' },
        ],
      },
      {
        id: 'content', label: 'Content Management', path: '/blogs',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
        sub: [
          { label: 'Blogs / Articles', path: '/blogs' },
          { label: 'Pages', path: '/pages' },
          { label: 'Banners / Hero Images', path: '/banners' },
        ],
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        id: 'settings', label: 'Settings', path: '/general-settings',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
        sub: [
          { label: 'General Settings', path: '/general-settings' },
          { label: 'Payment Settings', path: '/payment-settings' },
          { label: 'Shipping Settings', path: '/shipping-settings' },
          { label: 'Notification Settings', path: '/notification-settings' },
        ],
      },
      {
        id: 'support', label: 'Support / Feedback', badge: '5', path: '/customer-queries',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
        sub: [
          { label: 'Customer Queries', path: '/customer-queries' },
          { label: 'Support Tickets', path: '/support-tickets' },
          { label: 'Feedback / Reviews', path: '/feedback-reviews' },
        ],
      },
    ],
  },
]

const NestedSubItem = ({ item, activePath }) => {
  const [open, setOpen] = useState(() =>
    !!(item.nested && item.nested.some(n => n.path === activePath))
  )
  if (item.nested) {
    return (
      <div>
        <div className="sb-sub-item sb-has-nested" onClick={() => setOpen(p => !p)}>
          <span className="sb-sub-dot" />
          <span className="sb-sub-text">{item.label}</span>
          <span className={`sb-nested-chevron ${open ? 'open' : ''}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        </div>
        <div className={`sb-nested-list ${open ? 'open' : ''}`}>
          {item.nested.map(n => (
            <Link key={n.path} to={n.path} className={`sb-nested-item ${activePath === n.path ? 'active' : ''}`}>
              <span className="sb-nested-line" />{n.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }
  return (
    <Link to={item.path} className={`sb-sub-item ${activePath === item.path ? 'active' : ''}`}>
      <span className="sb-sub-dot" />
      <span className="sb-sub-text">{item.label}</span>
    </Link>
  )
}

const SideBar = ({ collapsed, onCollapse }) => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const activePath = location.pathname

  const activeId = (() => {
    for (const sec of NAV) {
      for (const item of sec.items) {
        if (item.path === activePath) return item.id
        if (item.sub && item.sub.some(s =>
          s.path === activePath || (s.nested && s.nested.some(n => n.path === activePath))
        )) return item.id
      }
    }
    return 'dashboard'
  })()

  const [openSubs, setOpenSubs] = useState(() => {
    const init = {}
    NAV.forEach(sec => sec.items.forEach(item => {
      if (item.sub) {
        const active = item.path === activePath ||
          item.sub.some(s => s.path === activePath || (s.nested && s.nested.some(n => n.path === activePath)))
        if (active) init[item.id] = true
      }
    }))
    return init
  })
  const [showProfile, setShowProfile] = useState(false)

  return (
    <aside className={`sb-root ${collapsed ? 'sb-collapsed' : ''}`}>
      {/* Header */}
      <div className="sb-header">
        <button className="sb-logo-btn" onClick={onCollapse} title="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
        <Link to="/admin-dashboard" className="sb-brand">Shop<span>Nest</span></Link>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {NAV.map(sec => (
          <div key={sec.section} className="sb-section">
            <div className="sb-section-label">{sec.section}</div>
            {sec.items.map(item => (
              <div key={item.id}>
                <div
                  className={`sb-item ${activeId === item.id ? 'sb-item-active' : ''}`}
                  data-tip={item.label}
                  onClick={() => setOpenSubs(p => ({ ...p, [item.id]: !p[item.id] }))}
                >
                  <Link to={item.path || '#'} className="sb-item-link" onClick={e => e.stopPropagation()}>
                    <span className="sb-icon">{item.icon}</span>
                    <span className="sb-label">{item.label}</span>
                  </Link>
                  {item.badge && <span className="sb-badge">{item.badge}</span>}
                  {item.sub && (
                    <span className={`sb-chevron ${openSubs[item.id] ? 'open' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  )}
                </div>
                {item.sub && (
                  <div className={`sb-sub-list ${openSubs[item.id] ? 'open' : ''}`}>
                    {item.sub.map(sub => (
                      <NestedSubItem key={sub.label} item={sub} activePath={activePath} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sb-footer">
        <div className="sb-section-label">Account</div>
        <div className="sb-item" data-tip="Admin Profile" onClick={e => { e.stopPropagation(); setShowProfile(p => !p) }}>
          <span className="sb-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span className="sb-label">Admin Profile</span>
          <span className={`sb-chevron ${showProfile ? 'open' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        </div>
        <div className={`sb-sub-list ${showProfile ? 'open' : ''}`}>
          <Link to="/admin-profile" className="sb-sub-item"><span className="sb-sub-dot"/><span className="sb-sub-text">View Profile</span></Link>
          <Link to="/change-password" className="sb-sub-item"><span className="sb-sub-dot"/><span className="sb-sub-text">Change Password</span></Link>
        </div>
        <div className="sb-item sb-logout" data-tip="Logout" onClick={() => { localStorage.clear(); navigate('/admin-login') }}>
          <span className="sb-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          <span className="sb-label">Logout</span>
        </div>
      </div>
    </aside>
  )
}

export default SideBar