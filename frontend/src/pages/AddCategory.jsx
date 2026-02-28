import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/addcategory.css'

const generateSlug = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const AddCategory = () => {
  const [form, setForm] = useState({ name: '', slug: '', is_active: true })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)
  const navigate = useNavigate()

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugLocked) {
      setForm(prev => ({ ...prev, slug: generateSlug(prev.name) }))
    }
  }, [form.name, slugLocked])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSlugChange = (e) => {
    setSlugLocked(true)
    setForm(prev => ({ ...prev, slug: e.target.value }))
    if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Product name is required"
    if (!form.slug.trim()) e.slug = "slug is required"
    return e
  }

  // ── handleSubmit unchanged ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    const token = localStorage.getItem("accessToken")
    console.log(localStorage.getItem("accessToken"))
    if (!token) {
      toast.error("Please login first")
      navigate("/admin-login")
      return
    }
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8080/api/products/add-category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error("Somthing went wrong")
      }
      toast.success(data.message || "Category added Successfully!")
      setForm({ name: '', slug: '', is_active: true })
      setSlugLocked(false)

    } catch (error) {
      toast.error(error.message || "Server Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ac-page">

      {/* Header */}
      <div className="ac-header">
        <div>
          <h1 className="ac-title">Add Category</h1>
          <p className="ac-sub">Create a new product category</p>
        </div>
        <Link to="/all-categories" className="ac-link-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          All Categories
        </Link>
      </div>

      {/* Form Card */}
      <div className="ac-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className={`ac-field ${errors.name ? 'ac-field--err' : ''}`}>
            <label className="ac-label">Category Name <span>*</span></label>
            <input
              type="text"
              name="name"
              className="ac-input"
              placeholder="e.g. Electronics"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            {errors.name && <p className="ac-err">⚠ {errors.name}</p>}
          </div>

          {/* Slug */}
          <div className={`ac-field ${errors.slug ? 'ac-field--err' : ''}`}>
            <label className="ac-label">Slug <span>*</span> <em>auto-generated</em></label>
            <div className="ac-slug-wrap">
              <span className="ac-slug-prefix">/categories/</span>
              <input
                type="text"
                name="slug"
                className="ac-input ac-input--slug"
                placeholder="electronics"
                value={form.slug}
                onChange={handleSlugChange}
              />
              {slugLocked && (
                <button
                  type="button"
                  className="ac-reset-slug"
                  title="Reset to auto-generated"
                  onClick={() => {
                    setSlugLocked(false)
                    setForm(prev => ({ ...prev, slug: generateSlug(prev.name) }))
                  }}
                >↺</button>
              )}
            </div>
            {errors.slug && <p className="ac-err">⚠ {errors.slug}</p>}
          </div>

          {/* Status */}
          <div className="ac-field">
            <label className="ac-label">Status</label>
            <label className="ac-toggle">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span className="ac-track"><span className="ac-thumb" /></span>
              <span className={`ac-status-text ${form.is_active ? 'active' : 'inactive'}`}>
                {form.is_active ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          <div className="ac-divider" />

          {/* Actions */}
          <div className="ac-actions">
            <Link to="/all-categories" className="ac-btn ac-btn--ghost">Cancel</Link>
            <button type="submit" className="ac-btn ac-btn--primary" disabled={loading}>
              {loading ? (
                <><span className="ac-spinner" />Saving...</>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Category
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  )
}

export default AddCategory