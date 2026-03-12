import { useState, useEffect, useCallback } from 'react'
import { categoryService } from '../services/categoryService'
import { toast } from 'react-toastify'

export const useCategories = () => {
  const [data, setData] = useState({ results: [], count: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState([])
  const [filters, setFilters] = useState({ page: 1, pageSize: 10, sortBy: 'id', sortDir: 'desc', search: '' })

  const fetchCategories = useCallback(async (opts = {}) => {
    try {
      setLoading(true)
      setError(null)
      const params = { ...filters, ...opts }
      const result = await categoryService.getAll(params)
      setData(result)
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to fetch categories: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoryService.delete(id)
      toast.success('Category deleted')
      fetchCategories()
      setSelected(s => s.filter(sid => sid !== id))
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`)
    }
  }, [fetchCategories])

  const bulkDelete = useCallback(async () => {
    try {
      await categoryService.bulkDelete(selected)
      toast.success(`Deleted ${selected.length} categories`)
      fetchCategories()
      setSelected([])
    } catch (err) {
      toast.error(`Bulk delete failed: ${err.message}`)
    }
  }, [selected, fetchCategories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const refetch = () => fetchCategories()
  const updateFilters = (newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))

  return {
    data,
    loading,
    error,
    selected,
    setSelected,
    filters,
    updateFilters,
    refetch,
    deleteCategory,
    bulkDelete,
    hasSelected: selected.length > 0,
  }
}

