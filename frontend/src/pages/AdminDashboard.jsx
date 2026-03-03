import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/admindashboard.css'

const METRICS = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', up: true,  color: '#ff6b35', bg: 'rgba(255,107,53,0.15)',  icon: '💰' },
  { label: 'Total Orders',  value: '3,842',   change: '+8.2%',  up: true,  color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  icon: '📦' },
  { label: 'Total Users',   value: '12,490',  change: '+4.1%',  up: true,  color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   icon: '👥' },
  { label: 'Returns',       value: '128',     change: '-2.3%',  up: false, color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   icon: '↩️' },
]

const CHART = [
  { label: 'Mon', h: 55 }, { label: 'Tue', h: 72 }, { label: 'Wed', h: 60 },
  { label: 'Thu', h: 85, hi: true }, { label: 'Fri', h: 78 },
  { label: 'Sat', h: 92, hi: true }, { label: 'Sun', h: 45 },
]

const ORDERS = [
  { id: '#ORD-7821', customer: 'Rahim Uddin',  product: 'Nike Air Max',     amount: '$129.00', status: 'completed'  },
  { id: '#ORD-7820', customer: 'Sara Islam',    product: 'iPhone Case',      amount: '$24.99',  status: 'pending'    },
  { id: '#ORD-7819', customer: 'Karim Khan',    product: 'Wireless Earbuds', amount: '$89.00',  status: 'processing' },
  { id: '#ORD-7818', customer: 'Nadia Hossain', product: 'Leather Wallet',   amount: '$45.00',  status: 'completed'  },
  { id: '#ORD-7817', customer: 'Arif Mahmud',   product: 'Smart Watch',      amount: '$199.00', status: 'cancelled'  },
]

const TOP_PRODUCTS = [
  { name: 'Nike Air Max 270',     emoji: '👟', sales: '1,204 sold', rev: '$18,940' },
  { name: 'Wireless Earbuds Pro', emoji: '🎧', sales: '842 sold',   rev: '$9,680'  },
  { name: 'Smart Watch Series X', emoji: '⌚', sales: '631 sold',   rev: '$8,450'  },
  { name: 'Leather Tote Bag',     emoji: '👜', sales: '524 sold',   rev: '$5,240'  },
]

const statusClass = s => ({ completed:'status-completed', pending:'status-pending', cancelled:'status-cancelled', processing:'status-processing' }[s] || 'status-processing')

const AdminDashboard = () => (
  <div className="dash-wrap">

    <div className="dash-page-header">
      <h1 className="dash-title">Dashboard Overview</h1>
      <p className="dash-sub">Welcome back, Admin! Here's what's happening in your store.</p>
    </div>

    <div className="dash-metrics">
      {METRICS.map((m, i) => (
        <div className="dash-metric-card" key={i} style={{ '--delay': `${i * 0.06}s` }}>
          <div className="dash-metric-glow" style={{ background: m.color }}/>
          <div className="dash-metric-icon" style={{ background: m.bg }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
          </div>
          <div className="dash-metric-value">{m.value}</div>
          <div className="dash-metric-label">{m.label}</div>
          <span className={`dash-metric-change ${m.up ? 'up' : 'down'}`}>{m.up ? '↑' : '↓'} {m.change}</span>
        </div>
      ))}
    </div>

    <div className="dash-grid">
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Weekly Sales</span>
          <Link to="/sales-report" className="dash-card-action">View Report →</Link>
        </div>
        <div className="dash-chart-bars">
          {CHART.map((bar, i) => (
            <div className="dash-bar-wrap" key={i}>
              <div className={`dash-bar ${bar.hi ? 'highlight' : ''}`} style={{ height: `${bar.h}%` }}/>
              <span className="dash-bar-label">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Top Products</span>
          <Link to="/all-products" className="dash-card-action">See All →</Link>
        </div>
        <div className="dash-product-list">
          {TOP_PRODUCTS.map((p, i) => (
            <div className="dash-product-item" key={i}>
              <div className="dash-product-thumb">{p.emoji}</div>
              <div><div className="dash-product-name">{p.name}</div><div className="dash-product-sales">{p.sales}</div></div>
              <div className="dash-product-rev">{p.rev}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">Recent Orders</span>
        <Link to="/all-orders" className="dash-card-action">View All Orders →</Link>
      </div>
      <table className="dash-table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {ORDERS.map((o, i) => (
            <tr key={i}>
              <td><span className="dash-order-id">{o.id}</span></td>
              <td>{o.customer}</td>
              <td>{o.product}</td>
              <td className="dash-amount">{o.amount}</td>
              <td>
                <span className={`dash-status ${statusClass(o.status)}`}>
                  <span className="dash-status-dot"/>
                  {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
)

export default AdminDashboard