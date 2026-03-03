import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/addproduct.css'
import AdminLayout from '../components/AdminLayout';

const generateSlug = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const emptyVariant = () => ({ sku: '', unit: '', price: '', discount_price: '', stock: '' })

const AddProduct = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [form, setForm] = useState({
    name: '', slug: '', description: '', brand: '', category: '', is_active: true,
    variants: [emptyVariant()],
    images: []
  })

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    console.log(localStorage.getItem('accessToken'))
    if (!token) {
      toast.error('Please Login first')
      navigate('/admin-login')
    }
  }, [navigate])

  // Load categories & brands
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const headers = { Authorization: `Bearer ${token}` }
    fetch('http://127.0.0.1:8080/api/products/categories/', { headers })
      .then(r => r.json()).then(setCategories).catch(() => {})
    fetch('http://127.0.0.1:8080/api/products/brands/', { headers })
      .then(r => r.json()).then(setBrands).catch(() => {})
  }, []) 

  // Auto slug
  useEffect(() => {
    if (!slugLocked) setForm(prev => ({ ...prev, slug: generateSlug(prev.name) }))
  }, [form.name, slugLocked])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSlugChange = (e) => {
    setSlugLocked(true)
    setForm(prev => ({ ...prev, slug: e.target.value }))
  }

  // Variants
  const handleVariantChange = (i, e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, idx) => idx === i ? { ...v, [name]: value } : v)
    }))
  }
  const addVariant = () => setForm(prev => ({ ...prev, variants: [...prev.variants, emptyVariant()] }))
  const removeVariant = (i) => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }))

  // Images
  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }))
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
  }
  const removeImage = (i) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!form.category) e.category = 'Category is required'
    form.variants.forEach((v, i) => {
      if (!v.price) e[`variant_${i}_price`] = 'Price is required'
    })
    return e
  }

  // ── handleSubmit
  const handleSubmit = async (e) => {
  e.preventDefault()
  const errs = validate()
  if (Object.keys(errs).length) { setErrors(errs); return }

  // ── convert variant price / discount / stock to numbers
  const variants = form.variants.map(v => ({
    ...v,
    price: v.price ? parseFloat(v.price) : null,
    discount_price: v.discount_price ? parseFloat(v.discount_price) : null,
    stock: v.stock ? parseInt(v.stock) : 0
  }))

  setLoading(true)
  try {
    const token = localStorage.getItem('accessToken')
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('slug', form.slug)
    formData.append('description', form.description)
    formData.append('category', form.category)
    formData.append('brand', form.brand)
    formData.append('is_active', form.is_active)

    formData.append('variants', JSON.stringify(variants))

    form.images.forEach((image) => formData.append('images', image))

    const response = await fetch('http://127.0.0.1:8080/api/products/add-product/', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) throw new Error('Something went wrong')
    toast.success(data.message || 'Product added Successfully!')
    setTimeout(() => navigate('/all-products'), 2000)
  } catch (error) {
    toast.error(error.message || 'Server Error')
  } finally {
    setLoading(false)
  }
}

  return (
    <AdminLayout>
    <div className="ap-page">

      {/* Header */}
      <div className="ap-header">
        <div>
          <h1 className="ap-title">Add Product</h1>
          <p className="ap-sub">Create a new product with variants</p>
        </div>
        <Link to="/all-products" className="ap-link-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
          </svg>
          All Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="ap-grid">

          {/* Left */}
          <div>

            {/* Basic Info */}
            <div className="ap-card">
              <div className="ap-card-title">
                <span className="ap-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </span>
                Basic Information
              </div>

              <div className={`ap-field ${errors.name ? 'ap-field--err' : ''}`}>
                <label className="ap-label">Product Name <span>*</span></label>
                <input type="text" name="name" className="ap-input"
                  placeholder="e.g. Nike Air Max 270"
                  value={form.name} onChange={handleChange} autoFocus />
                {errors.name && <p className="ap-err">⚠ {errors.name}</p>}
              </div>

              <div className={`ap-field ${errors.slug ? 'ap-field--err' : ''}`}>
                <label className="ap-label">Slug <span>*</span> <em>auto-generated</em></label>
                <div className="ap-slug-wrap">
                  <span className="ap-slug-prefix">/products/</span>
                  <input type="text" name="slug" className="ap-input ap-input--slug"
                    placeholder="nike-air-max-270"
                    value={form.slug} onChange={handleSlugChange} />
                  {slugLocked && (
                    <button type="button" className="ap-reset-slug"
                      onClick={() => { setSlugLocked(false); setForm(p => ({ ...p, slug: generateSlug(p.name) })) }}>↺</button>
                  )}
                </div>
                {errors.slug && <p className="ap-err">⚠ {errors.slug}</p>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Description <em>optional</em></label>
                <textarea name="description" className="ap-textarea"
                  placeholder="Write a short product description..."
                  value={form.description} onChange={handleChange} />
              </div>

              <div className="ap-row">
                <div className={`ap-field ${errors.category ? 'ap-field--err' : ''}`}>
                  <label className="ap-label">Category <span>*</span></label>
                  <select name="category" className="ap-select" value={form.category} onChange={handleChange}>
                    <option value="">— Select Category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.category && <p className="ap-err">⚠ {errors.category}</p>}
                </div>
                <div className="ap-field">
                  <label className="ap-label">Brand <em>optional</em></label>
                  <select name="brand" className="ap-select" value={form.brand} onChange={handleChange}>
                    <option value="">— Select Brand —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="ap-card">
              <div className="ap-card-title">
                <span className="ap-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                  </svg>
                </span>
                Variants ({form.variants.length})
              </div>

              {form.variants.map((v, i) => (
                <div className="ap-variant-card" key={i}>
                  <div className="ap-variant-header">
                    <span className="ap-variant-label">Variant {i + 1}</span>
                    {form.variants.length > 1 && (
                      <button type="button" className="ap-variant-remove" onClick={() => removeVariant(i)}>Remove</button>
                    )}
                  </div>
                  <div className="ap-row">
                    <div className="ap-field">
                      <label className="ap-label">SKU</label>
                      <input type="text" name="sku" className="ap-input"
                        placeholder="e.g. NK-AM-42" value={v.sku}
                        onChange={e => handleVariantChange(i, e)} />
                    </div>
                    <div className="ap-field">
                      <label className="ap-label">Unit</label>
                      <input type="text" name="unit" className="ap-input"
                        placeholder="e.g. Size 42, 1kg" value={v.unit}
                        onChange={e => handleVariantChange(i, e)} />
                    </div>
                  </div>
                  <div className="ap-row-3">
                    <div className={`ap-field ${errors[`variant_${i}_price`] ? 'ap-field--err' : ''}`}>
                      <label className="ap-label">Price <span>*</span></label>
                      <input type="number" name="price" className="ap-input"
                        placeholder="0.00" value={v.price}
                        onChange={e => handleVariantChange(i, e)} />
                      {errors[`variant_${i}_price`] && <p className="ap-err">⚠ Required</p>}
                    </div>
                    <div className="ap-field">
                      <label className="ap-label">Discount Price</label>
                      <input type="number" name="discount_price" className="ap-input"
                        placeholder="0.00" value={v.discount_price}
                        onChange={e => handleVariantChange(i, e)} />
                    </div>
                    <div className="ap-field">
                      <label className="ap-label">Stock</label>
                      <input type="number" name="stock" className="ap-input"
                        placeholder="0" value={v.stock}
                        onChange={e => handleVariantChange(i, e)} />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="ap-add-variant" onClick={addVariant}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Variant
              </button>
            </div>

          </div>

          {/* Right */}
          <div>

            {/* Images */}
            <div className="ap-card">
              <div className="ap-card-title">
                <span className="ap-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </span>
                Product Images
              </div>
              <div className="ap-upload-area">
                <input type="file" accept="image/*" multiple className="ap-upload-input" onChange={handleImages} />
                <div className="ap-upload-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                </div>
                <p className="ap-upload-text"><strong>Click to upload</strong> images</p>
                <p className="ap-upload-hint">PNG, JPG · Multiple allowed</p>
              </div>
              {imagePreviews.length > 0 && (
                <div className="ap-image-previews">
                  {imagePreviews.map((src, i) => (
                    <div className="ap-img-thumb" key={i}>
                      <img src={src} alt="" />
                      <button type="button" className="ap-img-remove" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="ap-card">
              <div className="ap-card-title">
                <span className="ap-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </span>
                Product Status
              </div>
              <label className="ap-toggle">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                <span className="ap-track"><span className="ap-thumb" /></span>
                <span className={`ap-status-text ${form.is_active ? 'active' : 'inactive'}`}>
                  {form.is_active ? 'Active — visible to customers' : 'Inactive — hidden'}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="ap-card">
              <div className="ap-actions" style={{ marginTop: 0 }}>
                <Link to="/all-products" className="ap-btn ap-btn--ghost">Cancel</Link>
                <button type="submit" className="ap-btn ap-btn--primary" disabled={loading}>
                  {loading
                    ? <><span className="ap-spinner" />Saving...</>
                    : <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Product
                      </>
                  }
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    <ToastContainer
  position="top-center"
  style={{ top: '50%', transform: 'translateY(-50%)' }}
/>
    </div>
    </AdminLayout>
  )
}

export default AddProduct