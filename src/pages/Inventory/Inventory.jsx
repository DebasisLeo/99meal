import React, { useMemo, useState } from 'react'
import InventoryList from '../../Components/Inventory/InventoryList'
import useInventory from '../../hooks/useInventory'
import useMenuIngredients from '../../hooks/useMenuIngredients'

const emptyIngredientRow = { ingredientId: '', quantityRequired: '1' }
const categoryOptions = [
  { label: 'Salad', value: 'salad' },
  { label: 'Pizza', value: 'pizza' },
  { label: 'Soup', value: 'soup' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Drinks', value: 'drinks' },
  { label: 'Appetizers', value: 'appetizers' },
  { label: 'Deep Fried', value: 'deep fried' },
  { label: 'Wings', value: 'wings' },
  { label: 'Biriyani', value: 'biriyani' },
  { label: 'Vat & Dal', value: 'vat & dal' },
  { label: 'Curry Vuna', value: 'curry vuna' },
  { label: 'Vat Package', value: 'vat package' },
]

const Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showRequirementForm, setShowRequirementForm] = useState(false)
  const [newRequirement, setNewRequirement] = useState({
    menuName: '',
    category: '',
    ingredients: [{ ...emptyIngredientRow }],
  })
  const [savingRequirement, setSavingRequirement] = useState(false)
  const [requirementError, setRequirementError] = useState('')
  const { items, lowStock, loading, error, adjustStock, addItem, removeItem } = useInventory()
  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    addMenuRequirement,
  } = useMenuIngredients()

  const menuRecipes = useMemo(() => {
    const recipesByMenu = recipes.reduce((groups, recipe) => {
      const key = recipe.menuId
      const current = groups[key] || {
        menuId: recipe.menuId,
        menuName: recipe.menuName,
        category: recipe.category,
        ingredients: [],
      }

      return {
        ...groups,
        [key]: {
          ...current,
          ingredients: [...current.ingredients, recipe],
        },
      }
    }, {})

    return Object.values(recipesByMenu).sort((a, b) => {
      const categoryCompare = String(a.category || '').localeCompare(String(b.category || ''))
      if (categoryCompare !== 0) return categoryCompare
      return String(a.menuName || '').localeCompare(String(b.menuName || ''))
    })
  }, [recipes])

  const categories = useMemo(
    () => [
      ...new Set([
        ...categoryOptions.map((category) => category.value),
        ...menuRecipes.map((menuItem) => menuItem.category).filter(Boolean),
      ]),
    ].sort(),
    [menuRecipes]
  )
  const visibleMenuRecipes =
    selectedCategory === 'all'
      ? menuRecipes
      : menuRecipes.filter((menuItem) => menuItem.category === selectedCategory)

  const updateRequirementField = (field) => (event) => {
    setNewRequirement((current) => ({ ...current, [field]: event.target.value }))
  }

  const updateIngredientRow = (index, field) => (event) => {
    setNewRequirement((current) => ({
      ...current,
      ingredients: current.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? { ...ingredient, [field]: event.target.value } : ingredient
      ),
    }))
  }

  const addIngredientRow = () => {
    setNewRequirement((current) => ({
      ...current,
      ingredients: [...current.ingredients, { ...emptyIngredientRow }],
    }))
  }

  const removeIngredientRow = (index) => {
    setNewRequirement((current) => ({
      ...current,
      ingredients:
        current.ingredients.length === 1
          ? [{ ...emptyIngredientRow }]
          : current.ingredients.filter((_, ingredientIndex) => ingredientIndex !== index),
    }))
  }

  const handleRequirementSubmit = async (event) => {
    event.preventDefault()
    setRequirementError('')

    const menuName = newRequirement.menuName.trim()
    const category = newRequirement.category.trim()
    const selectedIngredients = newRequirement.ingredients
      .map((ingredient) => {
        const stockItem = items.find((item) => String(item.ingredientId) === String(ingredient.ingredientId))
        if (!stockItem) return null

        return {
          stockItem,
          quantityRequired: Number(ingredient.quantityRequired) || 0,
        }
      })
      .filter((ingredient) => ingredient && ingredient.quantityRequired > 0)

    if (!menuName || !category || selectedIngredients.length === 0) return

    try {
      setSavingRequirement(true)
      await addMenuRequirement({
        menuName,
        category,
        ingredients: selectedIngredients.map(({ stockItem, quantityRequired }) => ({
          ingredientId: stockItem.ingredientId,
          quantityRequired,
        })),
      })
      setSelectedCategory(category)
      setNewRequirement({
        menuName: '',
        category: '',
        ingredients: [{ ...emptyIngredientRow }],
      })
      setShowRequirementForm(false)
    } catch (err) {
      setRequirementError(err.message || 'Could not add menu ingredient requirement')
    } finally {
      setSavingRequirement(false)
    }
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Ingredient Inventory</h2>
        <p className="text-sm text-gray-400">Track raw items and the ingredients required by each menu item</p>
      </header>

      <InventoryList
        items={items}
        lowStock={lowStock}
        loading={loading}
        error={error}
        onAdjust={adjustStock}
        onAdd={addItem}
        onDelete={removeItem}
      />

      {/* FORM WRAPPER */}
<div className="mt-4 flex justify-end">
  <button
    type="button"
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
    onClick={() => setShowRequirementForm((v) => !v)}
  >
    {showRequirementForm ? 'Close Form' : 'Add Requirement'}
  </button>
</div>

{showRequirementForm && (
  <form className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    
    {/* TOP FIELDS */}
    <div className="grid gap-4 md:grid-cols-2">
      
      <div>
        <label className="text-sm font-medium text-gray-700">
          Menu Name
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          value={newRequirement.menuName}
          onChange={updateRequirementField('menuName')}
          placeholder="e.g. Chicken Burger"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          value={newRequirement.category}
          onChange={updateRequirementField('category')}
          required
        >
          <option value="">Select category</option>
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* INGREDIENTS */}
    <div className="mt-5 space-y-3">
      {newRequirement.ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="grid gap-3 md:grid-cols-[1fr_140px_auto] items-end"
        >
          
          <div>
            <label className="text-sm text-gray-600">Ingredient</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-900"
              value={ingredient.ingredientId}
              onChange={updateIngredientRow(index, 'ingredientId')}
              required
            >
              <option value="">Select ingredient</option>
              {items.map((item) => (
                <option key={item.id} value={item.ingredientId}>
                  {item.name} ({item.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Required</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-900"
              value={ingredient.quantityRequired}
              onChange={updateIngredientRow(index, 'quantityRequired')}
              required
            />
          </div>

          <button
            type="button"
            className="h-9 rounded-lg bg-red-50 px-3 text-sm text-red-600 hover:bg-red-100 transition"
            onClick={() => removeIngredientRow(index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    {/* ACTIONS */}
    <div className="mt-5 flex flex-wrap gap-2">
      <button
        type="button"
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        onClick={addIngredientRow}
      >
        + Add Ingredient
      </button>

      <button
        type="submit"
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        disabled={savingRequirement}
      >
        {savingRequirement ? 'Saving...' : 'Save Requirement'}
      </button>
    </div>

    {requirementError && (
      <p className="mt-3 text-sm text-red-500">{requirementError}</p>
    )}
  </form>
)}

{/* LIST SECTION */}
<section className="mt-10">
  
  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <h3 className="text-lg font-semibold text-gray-800">
      Menu Ingredient Requirements
    </h3>

    <select
      className="w-full md:w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="all">All Categories</option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {categoryOptions.find((o) => o.value === c)?.label || c}
        </option>
      ))}
    </select>
  </div>

  {recipesLoading && (
    <p className="text-sm text-gray-500">Loading...</p>
  )}

  {recipesError && (
    <p className="text-sm text-red-500">{recipesError}</p>
  )}

  {/* CARDS */}
  <div className="grid gap-5 lg:grid-cols-2">
    {visibleMenuRecipes.map((menuItem) => (
      <div
        key={menuItem.menuId}
        className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h4 className="font-semibold text-gray-900">
              {menuItem.menuName}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {menuItem.category}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {menuItem.ingredients.length} items
          </span>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-2">Ingredient</th>
                <th className="px-4 py-2">Required</th>
                <th className="px-4 py-2">Available</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {menuItem.ingredients.map((ingredient) => {
                const stockItem = items.find(
                  (i) => i.ingredientId === ingredient.ingredientId
                )

                const availableStock =
                  stockItem?.stock ?? ingredient.stock

                const isLow =
                  availableStock < ingredient.quantityRequired

                return (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    
                    <td className="px-4 py-2 text-gray-800">
                      {ingredient.ingredientName}
                    </td>

                    <td className="px-4 py-2 text-gray-700">
                      {ingredient.quantityRequired} {ingredient.unit}
                    </td>

                    <td
                      className={`px-4 py-2 font-medium ${
                        isLow ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {availableStock} {ingredient.unit}
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
</section>
    </div>
  )
}

export default Inventory