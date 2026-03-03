import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const SECTION_MAP = [
  { id: 'dashboard', label: 'Dashboard',            paths: ['/admin-dashboard'] },
  { id: 'users',     label: 'Users',                paths: ['/all-users','/add-user','/user-roles','/activity-logs'] },
  { id: 'products',  label: 'Products / Inventory', paths: ['/all-products','/add-product','/all-categories','/add-category','/all-brands','/add-brand','/stock-management'] },
  { id: 'orders',    label: 'Orders / Sales',       paths: ['/all-orders','/pending-orders','/completed-orders','/returns-refunds'] },
  { id: 'reports',   label: 'Reports & Analytics',  paths: ['/sales-report','/user-activity-report','/product-performance','/revenue-analytics'] },
  { id: 'marketing', label: 'Marketing',            paths: ['/coupons','/email-campaigns','/ads-promotions'] },
  { id: 'content',   label: 'Content Management',   paths: ['/blogs','/pages','/banners'] },
  { id: 'settings',  label: 'Settings',             paths: ['/general-settings','/payment-settings','/shipping-settings','/notification-settings'] },
  { id: 'support',   label: 'Support / Feedback',   paths: ['/customer-queries','/support-tickets','/feedback-reviews'] },
]

const PAGE_LABEL = {
  '/admin-dashboard':'Overview', '/all-users':'All Users', '/add-user':'Add User',
  '/user-roles':'User Roles', '/activity-logs':'Activity Logs',
  '/all-products':'All Products', '/add-product':'Add Product',
  '/all-categories':'All Categories', '/add-category':'Add Category',
  '/all-brands':'All Brands', '/add-brand':'Add Brand',
  '/stock-management':'Stock Management', '/all-orders':'All Orders',
  '/pending-orders':'Pending', '/completed-orders':'Completed',
  '/returns-refunds':'Returns', '/sales-report':'Sales Report',
  '/general-settings':'General', '/customer-queries':'Customer Queries',
}

const NOTIFS = [
  { icon: '📦', text: 'New order #ORD-7825 received',    time: '2m ago',  unread: true },
  { icon: '👤', text: 'New user registration: Sara K.',  time: '14m ago', unread: true },
  { icon: '↩️', text: 'Return request for #ORD-7801',    time: '1h ago',  unread: true },
  { icon: '⚠️', text: 'Low stock: Nike Air Max 270',     time: '3h ago',  unread: false },
  { icon: '✅', text: 'Payment confirmed for #ORD-7820', time: '5h ago',  unread: false },
]

const TopBar = ({ collapsed, onCollapse }) => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [showNotifs,  setShowNotifs]  = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [search, setSearch] = useState('')
  const notifRef   = useRef()
  const profileRef = useRef()

  useEffect(() => {
    const fn = e => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotifs(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const section    = SECTION_MAP.find(s => s.paths.includes(location.pathname))
  const pageLabel  = PAGE_LABEL[location.pathname] || ''
  const unread     = NOTIFS.filter(n => n.unread).length
  const adminName  = localStorage.getItem('userName') || 'Admin'

  return (
    <header className="tb-root">
      {/* Left */}
      <div className="tb-left">
        <button className="tb-hamburger" onClick={onCollapse}>
          <span className={`tb-hb-line ${collapsed ? 'short' : ''}`}/>
          <span className="tb-hb-line"/>
          <span className={`tb-hb-line ${collapsed ? 'short' : ''}`}/>
        </button>
        <nav className="tb-breadcrumb">
          <Link to="/admin-dashboard" className="tb-bc-home">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
          <span className="tb-bc-sep">/</span>
          <span className="tb-bc-section">{section?.label || 'Dashboard'}</span>
          {pageLabel && (
            <><span className="tb-bc-sep">/</span><span className="tb-bc-page">{pageLabel}</span></>
          )}
        </nav>
      </div>

      {/* Search */}
      <div className="tb-search-wrap">
        <span className="tb-search-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input className="tb-search" placeholder="Search anything…" value={search} onChange={e => setSearch(e.target.value)}/>
        {search && (
          <button className="tb-search-clear" onClick={() => setSearch('')}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
        <kbd className="tb-kbd">⌘K</kbd>
      </div>

      {/* Right */}
      <div className="tb-right">
        {/* Notifications */}
        <div className="tb-dd-wrap" ref={notifRef}>
          <button className={`tb-icon-btn ${showNotifs ? 'active' : ''}`} onClick={() => { setShowNotifs(p => !p); setShowProfile(false) }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unread > 0 && <span className="tb-notif-badge">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="tb-dropdown tb-notif-dd">
              <div className="tb-dd-head"><span className="tb-dd-title">Notifications</span><span className="tb-dd-sub">{unread} new</span></div>
              <ul className="tb-notif-list">
                {NOTIFS.map((n, i) => (
                  <li key={i} className={`tb-notif-item ${n.unread ? 'unread' : ''}`}>
                    <span className="tb-notif-emoji">{n.icon}</span>
                    <div className="tb-notif-body"><p className="tb-notif-text">{n.text}</p><span className="tb-notif-time">{n.time}</span></div>
                    {n.unread && <span className="tb-notif-dot"/>}
                  </li>
                ))}
              </ul>
              <div className="tb-dd-footer"><Link to="/notifications" className="tb-dd-link" onClick={() => setShowNotifs(false)}>View all →</Link></div>
            </div>
          )}
        </div>

        <div className="tb-divider"/>

        {/* Profile */}
        <div className="tb-dd-wrap" ref={profileRef}>
          <button className={`tb-profile-btn ${showProfile ? 'active' : ''}`} onClick={() => { setShowProfile(p => !p); setShowNotifs(false) }}>
            <div className="tb-avatar">{adminName.charAt(0).toUpperCase()}</div>
            <div className="tb-profile-info">
              <span className="tb-profile-name">{adminName}</span>
              <span className="tb-profile-role">Administrator</span>
            </div>
            <svg className="tb-profile-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {showProfile && (
            <div className="tb-dropdown tb-profile-dd">
              <div className="tb-dd-profile-head">
                <div className="tb-dd-avatar">{adminName.charAt(0).toUpperCase()}</div>
                <div><div className="tb-dd-name">{adminName}</div><div className="tb-dd-email">{localStorage.getItem('userEmail') || 'admin@shopnest.com'}</div></div>
              </div>
              <div className="tb-dd-divider"/>
              <ul className="tb-profile-menu">
                {[
                  { to: '/admin-profile',    label: 'View Profile' },
                  { to: '/general-settings', label: 'Settings' },
                  { to: '/change-password',  label: 'Change Password' },
                ].map(item => (
                  <li key={item.to}><Link to={item.to} className="tb-pm-item" onClick={() => setShowProfile(false)}>{item.label}</Link></li>
                ))}
              </ul>
              <div className="tb-dd-divider"/>
              <button className="tb-pm-item tb-pm-logout" onClick={() => { localStorage.clear(); navigate('/admin-login') }}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar