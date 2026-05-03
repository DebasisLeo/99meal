import React, { useMemo, useState } from 'react'
import InventoryList from '../../Components/Inventory/InventoryList'
import useInventory from '../../hooks/useInventory'
import useMenuIngredients from '../../hooks/useMenuIngredients'

const Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { items, lowStock, loading, error, adjustStock, addItem, removeItem } = useInventory()
  const { recipes, loading: recipesLoading, error: recipesError } = useMenuIngredients()

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
    () => [...new Set(menuRecipes.map((menuItem) => menuItem.category).filter(Boolean))].sort(),
    [menuRecipes]
  )
  const visibleMenuRecipes =
    selectedCategory === 'all'
      ? menuRecipes
      : menuRecipes.filter((menuItem) => menuItem.category === selectedCategory)

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

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">Menu ingredient requirements</h3>
          <select
            className="select select-bordered select-sm w-full md:w-56"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {recipesLoading && <p className="text-sm text-slate-500">Loading menu ingredients...</p>}
        {!recipesLoading && recipesError && <p className="text-sm text-red-500">{recipesError}</p>}
        {!recipesLoading && !recipesError && menuRecipes.length === 0 && (
          <p className="text-sm text-slate-500">No menu ingredient requirements found.</p>
        )}
        {!recipesLoading && !recipesError && menuRecipes.length > 0 && visibleMenuRecipes.length === 0 && (
          <p className="text-sm text-slate-500">No menu items found for this category.</p>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleMenuRecipes.map((menuItem) => (
            <div key={menuItem.menuId} className="rounded border bg-slate-900 p-4 text-slate-100">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{menuItem.menuName}</h4>
                  <p className="text-sm capitalize text-slate-400">{menuItem.category}</p>
                </div>
                <span className="text-sm font-semibold">{menuItem.ingredients.length} ingredients</span>
              </div>

              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-300">
                    <tr>
                      <th className="py-2">Ingredient</th>
                      <th className="py-2">Required</th>
                      <th className="py-2">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItem.ingredients.map((ingredient) => {
                      const stockItem = items.find((item) => item.ingredientId === ingredient.ingredientId)
                      const availableStock = stockItem?.stock ?? ingredient.stock
                      const availableUnit = stockItem?.unit ?? ingredient.unit

                      return (
                        <tr key={ingredient.id} className="border-t border-slate-700">
                          <td className="py-2">{ingredient.ingredientName}</td>
                          <td className="py-2">
                            {ingredient.quantityRequired} {ingredient.unit}
                          </td>
                          <td className="py-2">
                            {availableStock} {availableUnit}
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
