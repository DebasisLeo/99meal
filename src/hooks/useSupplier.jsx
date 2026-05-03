import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../utils/api'

function normalizeSupplier(supplier) {
  const ingredients = Array.isArray(supplier.ingredients)
    ? supplier.ingredients
    : Array.isArray(supplier.supplies)
      ? supplier.supplies
      : []

  return {
    ...supplier,
    id: supplier.id ?? supplier.supplier_id,
    supplierSku: supplier.supplierSku || supplier.supplier_sku || `SUP-${supplier.id ?? supplier.supplier_id}`,
    leadTime: supplier.leadTime || supplier.lead_time || '',
    ingredients: ingredients.map((ingredient) =>
      typeof ingredient === 'object'
        ? {
            id: ingredient.id ?? ingredient.ingredient_id,
            name: ingredient.name ?? ingredient.ingredient_name,
            unit: ingredient.unit,
          }
        : ingredient
    ),
  }
}

export default function useSupplier() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/suppliers')
      setSuppliers((Array.isArray(data) ? data : []).map(normalizeSupplier))
    } catch (err) {
      setError(err.message || 'Could not load suppliers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const addSupplier = async (payload = {}) => {
    const newSupplier = await apiRequest('/suppliers', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name || 'New Supplier',
        email: payload.email || '',
        phone: payload.phone || '',
        lead_time: payload.leadTime || payload.lead_time || '5 days',
      }),
    })

    await fetchSuppliers()
    return normalizeSupplier(newSupplier)
  }

  const updateSupplier = async (id, updates) => {
    await apiRequest(`/suppliers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        lead_time: updates.leadTime || updates.lead_time,
      }),
    })
    fetchSuppliers()
  }

  const removeSupplier = async (id) => {
    await apiRequest(`/suppliers/${id}`, { method: 'DELETE' })
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
  }

  const getSupplier = (id) => {
    return suppliers.find((supplier) => supplier.id === id || supplier.supplierSku === id)
  }

  return { suppliers, loading, error, refetch: fetchSuppliers, addSupplier, updateSupplier, removeSupplier, getSupplier }
}
