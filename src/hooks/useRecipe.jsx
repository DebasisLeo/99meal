/**
 * Hook to provide recipe/ingredient mappings for menu items.
 * Maps each menu item to its required ingredients and quantities.
 */
export default function useRecipe() {
  /**
   * Recipe database: maps menu item name to ingredients array
   * Each ingredient: { ingredientSku, qty, unit }
   */
  const recipeDB = {
    // Salads
    Haddock: [
      { ingredientSku: 'ING-FISH', qty: 1, unit: 'pcs', name: 'Fish' },
      { ingredientSku: 'ING-BEANS', qty: 100, unit: 'gm', name: 'Beans' },
      { ingredientSku: 'ING-VEGETABLES', qty: 200, unit: 'gm', name: 'Vegetables' },
    ],
    'Chicken and Walnut Salad': [
      { ingredientSku: 'ING-CHICKEN', qty: 300, unit: 'gm', name: 'Chicken' },
      { ingredientSku: 'ING-WALNUT', qty: 50, unit: 'gm', name: 'Walnut' },
      { ingredientSku: 'ING-LETTUCE', qty: 100, unit: 'gm', name: 'Lettuce' },
    ],
    'Escalope de Veau': [
      { ingredientSku: 'ING-VEAL', qty: 350, unit: 'gm', name: 'Veal' },
      { ingredientSku: 'ING-FLOUR', qty: 80, unit: 'gm', name: 'Flour' },
      { ingredientSku: 'ING-OIL', qty: 50, unit: 'ml', name: 'Cooking Oil' },
    ],
    'Roast Duck Breast': [
      { ingredientSku: 'ING-DUCK', qty: 1, unit: 'pcs', name: 'Duck Breast' },
      { ingredientSku: 'ING-HERBS', qty: 20, unit: 'gm', name: 'Herbs' },
      { ingredientSku: 'ING-OIL', qty: 40, unit: 'ml', name: 'Cooking Oil' },
    ],
    'Breton Fish Stew': [
      { ingredientSku: 'ING-FISH', qty: 2, unit: 'pcs', name: 'Fish' },
      { ingredientSku: 'ING-POTATO', qty: 300, unit: 'gm', name: 'Potato' },
      { ingredientSku: 'ING-VEGETABLES', qty: 150, unit: 'gm', name: 'Vegetables' },
    ],
  }

  /**
   * Enrich a menu item with ingredients based on its name.
   * @param {Object} menuItem - Menu item from backend
   * @returns {Object} Item with `ingredients` array added
   */
  const enrichMenuItem = (menuItem) => {
    if (!menuItem) return menuItem

    const ingredients = recipeDB[menuItem.name] || []
    return { ...menuItem, ingredients }
  }

  /**
   * Enrich an array of menu items.
   * @param {Array} menuItems - Array of menu items
   * @returns {Array} Enriched items
   */
  const enrichMenuItems = (menuItems = []) => {
    return menuItems.map(enrichMenuItem)
  }

  return { enrichMenuItem, enrichMenuItems, recipeDB }
}
