import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar'
import Topbar  from './TopBar'
import '../styles/adminlayout.css'

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed(p => !p)

  return (
    <div className="layout-root">
      <Sidebar collapsed={collapsed} onCollapse={toggle} />
      <div className={`layout-main ${collapsed ? 'layout-collapsed' : ''}`}>
        <Topbar collapsed={collapsed} onCollapse={toggle} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
