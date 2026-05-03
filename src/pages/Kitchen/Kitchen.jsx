import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import useInventoryDeduction from '../../hooks/useInventoryDeduction'
import useMenuIngredients from '../../hooks/useMenuIngredients'

function normalizeLookupKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function groupRecipesByMenu(recipes = []) {
  return recipes.reduce((groups, recipe) => {
    const keys = [recipe.menuId, recipe.menuName]
      .filter(Boolean)
      .map(normalizeLookupKey)

    keys.forEach((key) => {
      groups[key] = [
        ...(groups[key] || []),
        {
          ingredientSku: String(recipe.ingredientId),
          ingredientId: recipe.ingredientId,
          qty: Number(recipe.quantityRequired) || 0,
          unit: recipe.unit,
          name: recipe.ingredientName,
        },
      ]
    })

    return groups
  }, {})
}

function paymentToKitchenOrder(payment, recipeGroups, statusOverride) {
  return {
    orderId: `PAY-${payment.id}`,
    paymentId: payment.id,
    customerEmail: payment.email || 'guest',
    totalPrice: Number(payment.price || 0),
    transactionId: payment.transactionId,
    paymentStatus: payment.status,
    kitchenStatus: statusOverride?.kitchenStatus || 'pending',
    createdAt: payment.created_at || new Date().toISOString(),
    acceptedAt: statusOverride?.acceptedAt || null,
    rejectedAt: statusOverride?.rejectedAt || null,
    deduction: statusOverride?.deduction || null,
    items: (Array.isArray(payment.items) ? payment.items : []).map((item) => {
      const itemKeys = [item?.id, item?._id, item?.menuId, item?.menu_id, item?.name]
        .filter(Boolean)
        .map(normalizeLookupKey)
      const ingredients = itemKeys.reduce(
        (matchedIngredients, key) => matchedIngredients || recipeGroups[key],
        null
      )

      return {
        id: item?.id || item?._id || item?.menuId,
        name: item?.name || 'Unknown item',
        price: Number(item?.price || 0),
        quantity: Number(item?.quantity || 1),
        ingredients: ingredients || [],
      }
    }),
  }
}

const Kitchen = () => {
  const axiosPublic = useAxiosPublic()

  useEffect(() => {
    document.title = 'Rassporium | Kitchen'
  }, [])

  const { recipes } = useMenuIngredients()
  const { deductForOrder, previewForOrder } = useInventoryDeduction()
  const [orderStatuses, setOrderStatuses] = useState({})
  const recipeGroups = useMemo(() => groupRecipesByMenu(recipes), [recipes])

  const { data: payments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['kitchen-payments'],
    queryFn: async () => {
      const response = await axiosPublic.get('/payments')
      return Array.isArray(response.data) ? response.data : []
    },
  })

  const orders = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === 'success')
        .map((payment) =>
          paymentToKitchenOrder(payment, recipeGroups, orderStatuses[payment.id])
        ),
    [payments, recipeGroups, orderStatuses]
  )

  const { data: orderStats = [] } = useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const response = await axiosPublic.get('/order-stats')
      return response.data
    },
  })

  const statsSummary = useMemo(
    () => ({
      categories: orderStats.length,
      quantity: orderStats.reduce((s, i) => s + Number(i.quantity || 0), 0),
      revenue: orderStats.reduce((s, i) => s + Number(i.revenue || 0), 0),
    }),
    [orderStats]
  )

  const handleAccept = async (order) => {
    const result = await deductForOrder(order.items)

    if (!result.success) {
      Swal.fire({
        title: 'Cannot accept order',
        text: result.message,
        icon: 'warning',
      })
      return
    }

    setOrderStatuses((prev) => ({
      ...prev,
      [order.paymentId]: {
        kitchenStatus: 'accepted',
        acceptedAt: new Date().toISOString(),
        rejectedAt: null,
        deduction: result,
      },
    }))

    Swal.fire({
      title: 'Order accepted',
      html: `<div class="text-left">
        <p>Inventory updated for ${order.orderId}</p>
      </div>`,
      icon: 'success',
    })
  }

  const handleReject = (order) => {
    setOrderStatuses((prev) => ({
      ...prev,
      [order.paymentId]: {
        kitchenStatus: 'rejected',
        acceptedAt: null,
        rejectedAt: new Date().toISOString(),
        deduction: null,
      },
    }))
  }

  const pendingOrders = orders.filter((o) => o.kitchenStatus === 'pending')
  const completedOrders = orders.filter((o) => o.kitchenStatus !== 'pending')

  const renderOrder = (order) => {
    const requiredItems = previewForOrder(order.items)

    return (
      <div
        key={order.orderId}
        className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition rounded-2xl"
      >
        <div className="p-5">

          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {order.orderId}
              </h3>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.kitchenStatus === 'accepted'
                    ? 'bg-green-100 text-green-700'
                    : order.kitchenStatus === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {order.kitchenStatus.toUpperCase()}
              </span>

              <p className="text-xl font-bold text-indigo-600 mt-2">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-5">

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Items
              </h4>

              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                  >
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-indigo-600 font-semibold">
                      ${item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Ingredients
              </h4>

              {requiredItems.length === 0 ? (
                <p className="text-xs text-orange-500">
                  No mapping found
                </p>
              ) : (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-2 text-left">Ingredient</th>
                        <th className="p-2">Need</th>
                        <th className="p-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredItems.map((item, i) => (
                        <tr
                          key={i}
                          className="border-t text-gray-700"
                        >
                          <td className="p-2">{item.name}</td>
                          <td className="p-2 text-center">
                            {item.requiredQty}
                          </td>
                          <td
                            className={`p-2 text-center font-semibold ${
                              item.available < item.requiredQty
                                ? 'text-red-500'
                                : 'text-green-600'
                            }`}
                          >
                            {item.available}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {order.kitchenStatus === 'pending' && (
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleReject(order)}
                className="px-4 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                Reject
              </button>
              <button
                onClick={() => handleAccept(order)}
                className="px-4 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Accept
              </button>
            </div>
          )}

        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Kitchen Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Manage paid orders & inventory
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Categories</p>
          <p className="text-2xl font-bold text-indigo-600">
            {statsSummary.categories}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Items</p>
          <p className="text-2xl font-bold text-green-600">
            {statsSummary.quantity}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-pink-600">
            ${statsSummary.revenue.toFixed(2)}
          </p>
        </div>
      </div>

      {isPaymentsLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map(renderOrder)}
          {completedOrders.map(renderOrder)}
        </div>
      )}

    </div>
  )
}

export default Kitchen
