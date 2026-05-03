import { useCallback } from 'react'
import useInventory, { adjustInventoryStock, getInventoryItems } from './useInventory'
import { createPurchaseOrder, getPurchaseOrders } from './usePurchaseOrder'

function resolveInventoryItem(items, identifier) {
  const normalizedIdentifier = String(identifier).toLowerCase()
  return items.find((item) => {
    const candidates = [item.id, item.ingredientId, item.ingredientSku, item.name]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())

    return candidates.includes(normalizedIdentifier)
  })
}

/**
 * Hook to handle inventory deduction when orders are placed.
 * When stock drops below min, auto-generates purchase orders.
 */
export default function useInventoryDeduction() {
  const { items } = useInventory()

  /**
   * Deduct ingredients from inventory based on cart items.
   * Each cart item has an `ingredients` array: [{ ingredientSku, qty }, ...]
   * 
   * @param {Array} cartItems - Items in the cart, each with `ingredients` field
   * @returns {Object} { success: bool, deducted: bool, message: string, triggeredPOs: Array }
   */
  const deductForOrder = useCallback((cartItems = []) => {
    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: 'No items in cart' }
    }

    const ingredientMap = {}
    cartItems.forEach((item) => {
      const itemQty = Number(item.quantity || item.qty || 1)
      if (item.ingredients && Array.isArray(item.ingredients)) {
        item.ingredients.forEach(({ ingredientSku, qty }) => {
          ingredientMap[ingredientSku] = (ingredientMap[ingredientSku] || 0) + (Number(qty) || 0) * itemQty
        })
      }
    })

    if (Object.keys(ingredientMap).length === 0) {
      return { success: false, message: 'No recipe ingredients mapped for this order' }
    }

    const insufficientStock = []
    const inventoryBefore = getInventoryItems()
    Object.entries(ingredientMap).forEach(([sku, requiredQty]) => {
      const invItem = resolveInventoryItem(inventoryBefore, sku)
      if (!invItem || invItem.stock < requiredQty) {
        insufficientStock.push({ sku, required: requiredQty, available: invItem?.stock || 0 })
      }
    })

    if (insufficientStock.length > 0) {
      return {
        success: false,
        message: `Insufficient stock: ${insufficientStock.map((s) => `${s.sku} (need ${s.required}, have ${s.available})`).join(', ')}`,
        insufficientStock,
      }
    }

    Object.entries(ingredientMap).forEach(([sku, qty]) => {
      adjustInventoryStock(sku, -qty)
    })

    const inventoryAfter = getInventoryItems()
    const pendingPOs = getPurchaseOrders().filter((po) => po.status === 'pending')
    const triggeredPOs = []

    Object.keys(ingredientMap).forEach((sku) => {
      const invItem = resolveInventoryItem(inventoryAfter, sku)
      if (!invItem || invItem.stock > invItem.min) return

      const hasPendingPO = pendingPOs.some((po) => po.items?.some((item) => item.sku === sku))
      if (hasPendingPO) return

      const reorderQty = Math.max(invItem.min * 2 - invItem.stock, invItem.min)
      const po = createPurchaseOrder({
        supplierSku: invItem.supplierSku || 'UNKNOWN',
        sourceOrderId: cartItems.orderId,
        items: [{ sku, name: invItem.name, qty: reorderQty, unitPrice: invItem.unitPrice || 0 }],
      })

      triggeredPOs.push({
        poId: po.poId,
        supplierSku: invItem.supplierSku || 'UNKNOWN',
        itemSku: sku,
        itemName: invItem.name,
        reorderQty,
      })
    })

    return {
      success: true,
      deducted: true,
      ingredientMap,
      message: `Inventory deducted for order. ${triggeredPOs.length} purchase order(s) triggered.`,
      triggeredPOs,
    }
  }, [items])

  const previewForOrder = useCallback((cartItems = []) => {
    const ingredientMap = {}
    cartItems.forEach((item) => {
      const itemQty = Number(item.quantity || item.qty || 1)
      item.ingredients?.forEach(({ ingredientSku, qty }) => {
        ingredientMap[ingredientSku] = (ingredientMap[ingredientSku] || 0) + (Number(qty) || 0) * itemQty
      })
    })

    return Object.entries(ingredientMap).map(([sku, requiredQty]) => {
      const invItem = resolveInventoryItem(items, sku)
      return {
        sku,
        name: invItem?.name || sku,
        requiredQty,
        available: invItem?.stock || 0,
        min: invItem?.min || 0,
        supplierSku: invItem?.supplierSku || 'UNKNOWN',
      }
    })
  }, [items])

  return { deductForOrder, previewForOrder }
}
