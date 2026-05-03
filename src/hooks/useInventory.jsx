import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../utils/api'

let inventorySnapshot = []

function toNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function computeInventoryStatus(stock, min) {
  const safeMin = Math.max(0, min)
  if (stock <= Math.max(1, Math.floor(safeMin * 0.5))) return 'Critical'
  if (stock <= safeMin) return 'Reorder'
  return 'Healthy'
}

export function getInventoryItems() {
  return inventorySnapshot
}

export function adjustInventoryStock(sku, delta) {
  inventorySnapshot = inventorySnapshot.map((it) => {
    if (it.id !== sku && it.ingredientId !== sku) return it
    const nextStock = Math.max(0, it.stock + delta)
    return { ...it, stock: nextStock, status: computeInventoryStatus(nextStock, it.min) }
  })
}

function normalizeInventoryItem(item) {
  const id = item.id ?? item.ingredient_id ?? item._id
  const ingredientId = item.ingredient_id ?? id
  const stock = Math.max(0, toNumber(item.stock, 0))
  const min = Math.max(0, toNumber(item.min_stock ?? item.min, 5))

  return {
    ...item,
    id,
    ingredientId,
    unit: item.unit || 'pcs',
    stock,
    min,
    status: computeInventoryStatus(stock, min),
  }
}

export default function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const lowStock = useMemo(() => items.filter((it) => it.stock <= it.min), [items])

  const fetchInventory = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/ingredients')

      const normalizedItems = (Array.isArray(data) ? data : []).map(normalizeInventoryItem)
      inventorySnapshot = normalizedItems
      setItems(normalizedItems)
    } catch (err) {
      setError(err.message || 'Could not load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  async function adjustStock(id, delta) {
    const current = items.find((it) => it.id === id)
    if (!current) return

    const nextStock = Math.max(0, current.stock + delta)

    setItems((prev) => {
      const nextItems = prev.map((it) =>
        it.id === id ? { ...it, stock: nextStock, status: computeInventoryStatus(nextStock, it.min) } : it
      )
      inventorySnapshot = nextItems
      return nextItems
    })

    try {
      await apiRequest(`/ingredients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: nextStock }),
      })
    } catch (err) {
      setError(err.message || 'Could not update stock')
      fetchInventory()
    }
  }

  async function addItem(payload = {}) {
    const min = Math.max(0, toNumber(payload.min, 5))
    const stock = Math.max(0, toNumber(payload.stock, 0))
    const name = String(payload.name ?? '').trim()

    if (!name) {
      setError('Item name is required')
      return
    }

    try {
      await apiRequest('/ingredients', {
        method: 'POST',
        body: JSON.stringify({
          name,
          unit: payload.unit || 'pcs',
          stock,
          min_stock: min,
        }),
      })
      fetchInventory()
    } catch (err) {
      setError(err.message || 'Could not add item')
    }
  }

  async function removeItem(id) {
    try {
      await apiRequest(`/ingredients/${id}`, { method: 'DELETE' })
      setItems((prev) => {
        const nextItems = prev.filter((it) => it.id !== id)
        inventorySnapshot = nextItems
        return nextItems
      })
    } catch (err) {
      setError(err.message || 'Could not delete item')
    }
  }

  return { items, lowStock, loading, error, refetch: fetchInventory, adjustStock, addItem, removeItem }
}
