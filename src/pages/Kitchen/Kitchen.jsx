import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import useInventoryDeduction from '../../hooks/useInventoryDeduction'
import useKitchenOrders from '../../hooks/useKitchenOrders'
import useSupplier from '../../hooks/useSupplier'

const Kitchen = () => {
  useEffect(() => {
    document.title = 'Rassporium | Kitchen'
  }, [])

  const { orders, acceptOrder, rejectOrder } = useKitchenOrders()
  const { deductForOrder, previewForOrder } = useInventoryDeduction()
  const { suppliers } = useSupplier()

  const supplierName = (supplierSku) =>
    suppliers.find((supplier) => supplier.supplierSku === supplierSku)?.name || supplierSku

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

    acceptOrder(order.orderId, result)
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
                        <th>Supplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredItems.map((item) => (
                        <tr key={item.sku} className={item.available < item.requiredQty ? 'text-error' : ''}>
                          <td>{item.name}</td>
                          <td>{item.requiredQty}</td>
                          <td>{item.available}</td>
                          <td>{supplierName(item.supplierSku)}</td>
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
              <button className="btn btn-ghost btn-sm" onClick={() => rejectOrder(order.orderId)}>
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
        <p className="text-sm text-gray-400">Accept paid orders and deduct mapped ingredient inventory</p>
      </header>

      {orders.length === 0 ? (
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
