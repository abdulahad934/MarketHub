import React, { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import Pagination from '../components/Pagination'
import { toast } from 'react-toastify'
import '../styles/allbrands.css'  // Reuse similar styles

const AllCategories = () => {
  const {
    data, loading, error, selected, setSelected, filters, updateFilters,
    refetch, deleteCategory, bulkDelete, hasSelected
  } = useCategories()

  const [searchTerm, setSearchTerm] = useState('')

  const toggleAll = () => {
    if (selected.length === data.results.length) {
      setSelected([])
    } else {
      setSelected(data.results.map(c => c.id))
    }
  }

  const toggleOne = (id) => {
    setSelected(s => s.includes(id) ? s.filter(sid => sid !== id) : [...s, id])
  }

  const isSelected = (id) => selected.includes(id)

  const handleSearch = () => {
    updateFilters({ search: searchTerm, page: 1 })
  }

  const newCategory = () => {
    toast.info('Navigate to /add-category to create new category')
  }

  if (error) return <div className="table-error">Error: {error}</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Categories</h1>
        <p className="page-subtitle">{data.count} categories total</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn" disabled={loading}>
              {loading ? '...' : 'Search'}
            </button>
          </div>
          <button onClick={refetch} className="btn-secondary" disabled={loading}>
            Refresh
          </button>
        </div>

        <div className="toolbar-right">
          {hasSelected && (
            <>
              <button className="btn-danger" onClick={bulkDelete} disabled={loading}>
                Delete Selected ({selected.length})
              </button>
              <button className="btn-secondary" onClick={() => setSelected([])}>
                Clear Selection
              </button>
            </>
          )}
          <button className="btn-primary" onClick={newCategory}>
            + New Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading">Loading categories...</div>
        ) : data.results.length === 0 ? (
          <div className="table-empty">
            {filters.search ? 'No matching categories' : 'No categories found. Create one to get started!'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length === data.results.length && data.results.length > 0} onChange={toggleAll} /></th>
                <th>Name</th>
                <th>Products Count</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((category) => (
                <tr key={category.id} className={isSelected(category.id) ? 'selected' : ''}>
                  <td><input type="checkbox" checked={isSelected(category.id)} onChange={() => toggleOne(category.id)} /></td>
<td>{category.name || 'N/A'}</td>
<td>{category.products_count || 'N/A'}</td>
<td>{category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      className="btn-danger btn-sm" 
                      onClick={() => deleteCategory(category.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

{!loading && data.count > 0 && (
        <Pagination
          page={filters.page}
          totalPages={Math.ceil(data.count / filters.pageSize)}
          from={((filters.page - 1) * filters.pageSize) + 1}
          to={Math.min(filters.page * filters.pageSize, data.count)}
          totalCount={data.count}
          onPageChange={(page) => updateFilters({ page })}
          label="categories"
        />
      )}
    </div>
  )
}

export default AllCategories

