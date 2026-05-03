import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../utils/api'

function normalizeMenuIngredient(row) {
  return {
    id: row.id,
    menuId: row.menu_id,
    menuName: row.menu_name,
    category: row.category,
    ingredientId: row.ingredient_id,
    ingredientName: row.ingredient_name || row.name,
    unit: row.unit,
    quantityRequired: Number(row.quantity_required) || 0,
    stock: Number(row.stock) || 0,
    minStock: Number(row.min_stock) || 0,
  }
}

export default function useMenuIngredients() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/menu-ingredients')
      setRecipes((Array.isArray(data) ? data : []).map(normalizeMenuIngredient))
    } catch (err) {
      setError(err.message || 'Could not load menu ingredients')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const addMenuRequirement = async (payload) => {
    await apiRequest('/menu-ingredients', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    fetchRecipes()
  }

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    addMenuRequirement,
  }
}