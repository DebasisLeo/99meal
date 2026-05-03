import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import useInventoryDeduction from '../../hooks/useInventoryDeduction'
import useMenuIngredients from '../../hooks/useMenuIngredients'

function groupRecipesByMenu(recipes = []) {
  return recipes.reduce((groups, recipe) => {
    const keys = [recipe.menuId, recipe.menuName].filter(Boolean).map((key) => String(key).toLowerCase())

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
      const menuIdKey = item?.id ? String(item.id).toLowerCase() : ''
      const menuNameKey = item?.name ? String(item.name).toLowerCase() : ''

      return {
        id: item?.id,
        name: item?.name || 'Unknown item',
        price: Number(item?.price || 0),
        quantity: Number(item?.quantity || 1),
        ingredients: recipeGroups[menuIdKey] || recipeGroups[menuNameKey] || [],
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
        .map((payment) => paymentToKitchenOrder(payment, recipeGroups, orderStatuses[payment.id])),
    [payments, recipeGroups, orderStatuses]
  )

  const { data: orderStats = [], isLoading: isStatsLoading } = useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const response = await axiosPublic.get('/order-stats')
      return response.data
    },
  })

  const statsSummary = useMemo(
    () => ({
      categories: orderStats.length,
      quantity: orderStats.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      revenue: orderStats.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
    }),
    [orderStats]
  )

  const handleAccept = (order) => {
    const result = deductForOrder(order.items)

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
        <p>Kitchen inventory has been reduced for ${order.orderId}.</p>
        ${
          result.triggeredPOs?.length
            ? `<p class="mt-2 text-sm"><strong>Reorder created:</strong> ${result.triggeredPOs
                .map((po) => po.itemName)
                .join(', ')}</p>`
            : ''
        }
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

  const pendingOrders = orders.filter((order) => order.kitchenStatus === 'pending')
  const completedOrders = orders.filter((order) => order.kitchenStatus !== 'pending')

  const renderOrder = (order) => {
    const requiredItems = previewForOrder(order.items)

    return (
      <div key={order.orderId} className="card bg-base-200">
        <div className="card-body">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="card-title text-lg">{order.orderId}</h3>
              <p className="text-sm text-gray-400">{order.customerEmail}</p>
              <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-left md:text-right">
              <div className={`badge ${order.kitchenStatus === 'accepted' ? 'badge-success' : 'badge-warning'}`}>
                {order.kitchenStatus.toUpperCase()}
              </div>
              <p className="mt-2 text-xl font-bold">${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">Ordered items</h4>
              <div className="space-y-2 text-sm">
                {order.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex justify-between gap-3 rounded bg-base-100 px-3 py-2">
                    <span>{item.name}</span>
                    <span>${Number(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Ingredient inventory</h4>
              {requiredItems.length === 0 ? (
                <p className="text-sm text-warning">No recipe ingredients mapped for this order.</p>
              ) : (
                <div className="overflow-x-auto rounded border border-base-300">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Ingredient</th>
                        <th>Need</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredItems.map((item) => (
                        <tr key={item.sku} className={item.available < item.requiredQty ? 'text-error' : ''}>
                          <td>{item.name}</td>
                          <td>{item.requiredQty}</td>
                          <td>{item.available}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {order.kitchenStatus === 'pending' && (
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-ghost btn-sm" onClick={() => handleReject(order)}>
                Reject
              </button>
              <button className="btn btn-success btn-sm" onClick={() => handleAccept(order)}>
                Accept Order
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Kitchen Orders</h2>
        <p className="text-sm text-gray-400">Accept paid orders, deduct mapped ingredient inventory, and review paid-item stats</p>
      </header>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="card bg-base-200">
          <div className="card-body">
            <span className="text-sm text-gray-400">Paid categories</span>
            <span className="text-2xl font-bold">{isStatsLoading ? '...' : statsSummary.categories}</span>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body">
            <span className="text-sm text-gray-400">Paid item count</span>
            <span className="text-2xl font-bold">{isStatsLoading ? '...' : statsSummary.quantity}</span>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body">
            <span className="text-sm text-gray-400">Estimated revenue</span>
            <span className="text-2xl font-bold">{isStatsLoading ? '...' : `$${statsSummary.revenue.toFixed(2)}`}</span>
          </div>
        </div>
      </section>

      <section className="mb-8 card bg-base-200">
        <div className="card-body">
          <h3 className="card-title">Paid Orders by Category</h3>
          {orderStats.length === 0 ? (
            <p className="text-sm text-gray-400">No paid order stats available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {orderStats.map((item) => (
                    <tr key={item.category}>
                      <td>{item.category}</td>
                      <td>{Number(item.quantity || 0)}</td>
                      <td>${Number(item.revenue || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {isPaymentsLoading ? (
        <div className="alert alert-info">
          <span>Loading paid orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">
          <span>No paid orders waiting for the kitchen yet.</span>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingOrders.length > 0 && <section className="grid gap-4">{pendingOrders.map(renderOrder)}</section>}
          {completedOrders.length > 0 && (
            <section className="grid gap-4">
              <h3 className="text-lg font-semibold">Processed orders</h3>
              {completedOrders.map(renderOrder)}
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default Kitchen
