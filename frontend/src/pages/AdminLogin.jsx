import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/adminlogin.css'


const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error("username and password must required!")
    }

    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8080/api/users/admin-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      const data = response.json()
      if (!response.ok) {
        throw new toast.error(data.message || "Login Failed")
      }
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)
      toast.success(data.message || "Login successful!")
      navigate("/admin-dashboard")

    } catch (error) {
      toast.error(error.message || "Server error")
    }
  }

  return (
    <div className="al-root">
       <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      {/* Left Branding Panel */}
      <div className="al-left">
        <div className="al-deco-circle al-deco-circle-1" />
        <div className="al-deco-circle al-deco-circle-2" />
        <div className="al-deco-circle al-deco-circle-3" />
        <div className="al-left-glow" />

        <div className="al-logo">
          <div className="al-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div className="al-logo-name">Zyra<span>Mart</span></div>
        </div>

        <div className="al-hero">
          <div className="al-hero-tag"><span className="al-hero-tag-dot" />Admin Control Center</div>
          <h1 className="al-hero-title">Manage your<br /><em>store</em> with<br />confidence.</h1>
          <p className="al-hero-sub">Access orders, products, customers, and analytics — all from one dashboard.</p>
        </div>

        <div className="al-stats">
          <div><div className="al-stat-num">12K<sup>+</sup></div><div className="al-stat-label">Products Listed</div></div>
          <div className="al-stat-divider" />
          <div><div className="al-stat-num">98<sup>%</sup></div><div className="al-stat-label">Uptime</div></div>
          <div className="al-stat-divider" />
          <div><div className="al-stat-num">4.8<sup>★</sup></div><div className="al-stat-label">Avg. Rating</div></div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="al-right">
        <div className="al-form-wrap">
          <p className="al-form-eyebrow">Admin Portal</p>
          <h2 className="al-form-title">Welcome back</h2>
          <p className="al-form-sub">Sign in to manage your store</p>

          <div className="al-divider">
            <div className="al-divider-line" />
            <span className="al-divider-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </span>
            <div className="al-divider-line" />
          </div>

          <form onSubmit={handleLogin} noValidate>

            <div className="al-field">
              <label className="al-label">Username</label>
              <div className={`al-input-wrap ${focused === 'username' ? 'focused' : ''}`}>
                <span className="al-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  name="username"
                  className="al-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className={`al-input-wrap ${focused === 'password' ? 'focused' : ''}`}>
                <span className="al-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  className="al-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="al-btn" disabled={loading}>
              <div className="al-btn-shine" />
              {loading
                ? <><span className="al-spinner" />Authenticating...</>
                : <>Sign In to Dashboard</>
              }
            </button>

          </form>

          <div className="al-form-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Secured &amp; encrypted · Admin access only
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  )
}

export default AdminLogin