import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/addbrand.css'

const generateSlug = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const AddBrand = () => {
  const [form, setForm] = useState({ name: '', slug: '', is_active: true, logo: null })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(prev => ({ ...prev, logo: file }))
    setLogoPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Brand name is required"
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
    if (!token) {
      toast.error("Please login first")
      navigate("/admin-login")
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('slug', form.slug)
      formData.append('is_active', form.is_active)
      if (form.logo) {
        formData.append('logo', form.logo)
      }
      const response = await fetch("http://127.0.0.1:8080/api/products/add-brand/", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || "Something went wrong")
      } else {
        toast.success("Brand added successfully!")
        setTimeout(() => navigate("/all-brands"), 2000)
      }
    } catch (error) {
      toast.error(error.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ab-page">

      {/* Header */}
      <div className="ab-header">
        <div>
          <h1 className="ab-title">Add Brand</h1>
          <p className="ab-sub">Create a new product brand</p>
        </div>
        <Link to="/all-brands" className="ab-link-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          All Brands
        </Link>
      </div>

      {/* Form Card */}
      <div className="ab-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* Brand Name */}
          <div className={`ab-field ${errors.name ? 'ab-field--err' : ''}`}>
            <label className="ab-label">Brand Name <span>*</span></label>
            <input
              type="text"
              name="name"
              className="ab-input"
              placeholder="e.g. Nike"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            {errors.name && <p className="ab-err">⚠ {errors.name}</p>}
          </div>

          {/* Slug */}
          <div className={`ab-field ${errors.slug ? 'ab-field--err' : ''}`}>
            <label className="ab-label">Slug <span>*</span> <em>auto-generated</em></label>
            <div className="ab-slug-wrap">
              <span className="ab-slug-prefix">/brands/</span>
              <input
                type="text"
                name="slug"
                className="ab-input ab-input--slug"
                placeholder="nike"
                value={form.slug}
                onChange={handleSlugChange}
              />
              {slugLocked && (
                <button
                  type="button"
                  className="ab-reset-slug"
                  title="Reset to auto-generated"
                  onClick={() => {
                    setSlugLocked(false)
                    setForm(prev => ({ ...prev, slug: generateSlug(prev.name) }))
                  }}
                >↺</button>
              )}
            </div>
            {errors.slug && <p className="ab-err">⚠ {errors.slug}</p>}
          </div>

          {/* Logo Upload */}
          <div className="ab-field">
            <label className="ab-label">Brand Logo <em>optional</em></label>
            <div className={`ab-upload-area ${logoPreview ? 'has-file' : ''}`}>
              <input
                type="file"
                accept="image/*"
                className="ab-upload-input"
                onChange={handleLogoChange}
              />
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="Logo preview" className="ab-logo-preview" />
                  <p className="ab-upload-text">{form.logo?.name}</p>
                  <p className="ab-upload-hint">Click to change</p>
                </>
              ) : (
                <>
                  <div className="ab-upload-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <p className="ab-upload-text"><strong>Click to upload</strong> or drag & drop</p>
                  <p className="ab-upload-hint">PNG, JPG, SVG · Max 2MB</p>
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="ab-field">
            <label className="ab-label">Status</label>
            <label className="ab-toggle">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span className="ab-track"><span className="ab-thumb" /></span>
              <span className={`ab-status-text ${form.is_active ? 'active' : 'inactive'}`}>
                {form.is_active ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          <div className="ab-divider" />

          {/* Actions */}
          <div className="ab-actions">
            <Link to="/all-brands" className="ab-btn ab-btn--ghost">Cancel</Link>
            <button type="submit" className="ab-btn ab-btn--primary" disabled={loading}>
              {loading ? (
                <><span className="ab-spinner" />Saving...</>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Brand
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

export default AddBrand