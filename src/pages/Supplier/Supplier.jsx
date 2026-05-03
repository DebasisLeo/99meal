import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import useSupplier from '../../hooks/useSupplier'
import useInventory from '../../hooks/useInventory'

const Supplier = () => {
  useEffect(() => {
    document.title = 'Rassporium | Suppliers'
  }, [])

  const { suppliers, loading: suppliersLoading, error: suppliersError } = useSupplier()
  const { items, lowStock, loading: inventoryLoading, error: inventoryError } = useInventory()

  const getSupplierItems = (supplier) => {
    const suppliedIds = new Set((supplier.ingredients || []).map((ingredient) => ingredient.id))
    return items.filter((item) => suppliedIds.has(item.ingredientId))
  }

  const getSupplierLowStock = (supplier) => {
    const suppliedIds = new Set((supplier.ingredients || []).map((ingredient) => ingredient.id))
    return lowStock.filter((item) => suppliedIds.has(item.ingredientId))
  }

  const handleNotifySupplier = (supplier, reorderItems) => {
    const itemLines = reorderItems
      .map((item) => `- ${item.name}: current ${item.stock} ${item.unit}, minimum ${item.min} ${item.unit}`)
      .join('\n')
    const subject = encodeURIComponent('Low stock reorder request')
    const body = encodeURIComponent(
      `Hello ${supplier.name},\n\nPlease arrange supply for the following low-stock ingredients:\n\n${itemLines}\n\nThank you.`
    )

    window.location.href = `mailto:${supplier.email}?subject=${subject}&body=${body}`

    Swal.fire({
      title: 'Supplier notification ready',
      text: `Email draft opened for ${supplier.name}.`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    })
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <p className="text-sm text-gray-400">Notify suppliers when raw ingredients drop below minimum stock</p>
      </header>

      {(suppliersLoading || inventoryLoading) && (
        <div className="alert alert-info mb-4">
          <span>Loading supplier stock data...</span>
        </div>
      )}

      {!suppliersLoading && suppliersError && (
        <div className="alert alert-error mb-4">
          <span>{suppliersError}</span>
        </div>
      )}

      {!inventoryLoading && inventoryError && (
        <div className="alert alert-error mb-4">
          <span>{inventoryError}</span>
        </div>
      )}

      {!inventoryLoading && !inventoryError && lowStock.length > 0 && (
        <div className="mb-4 rounded border border-yellow-700 bg-yellow-950 p-4 text-yellow-100">
          <h3 className="font-semibold">Low-stock ingredients need supplier follow-up</h3>
          <p className="text-sm">
            {lowStock.map((item) => `${item.name} (${item.stock}/${item.min} ${item.unit})`).join(', ')}
          </p>
        </div>
      )}

      <div className="overflow-auto rounded border">
        <table className="min-w-full text-left">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Lead Time</th>
              <th className="px-4 py-2">Supplied Items</th>
              <th className="px-4 py-2">Items To Reorder</th>
              <th className="px-4 py-2">Notify</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => {
              const suppliedItems = getSupplierItems(supplier)
              const reorderItems = getSupplierLowStock(supplier)

              return (
                <tr key={supplier.supplierSku} className="odd:bg-slate-900 even:bg-slate-800/40 text-slate-100">
                  <td className="px-4 py-3 font-semibold">{supplier.name}</td>
                  <td className="px-4 py-3 text-sm">{supplier.email}</td>
                  <td className="px-4 py-3 text-sm">{supplier.phone}</td>
                  <td className="px-4 py-3 text-sm">{supplier.leadTime}</td>
                  <td className="px-4 py-3">
                    {suppliedItems.length > 0 ? (
                      <div className="text-sm">
                        {suppliedItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <span className="badge badge-sm">#{item.ingredientId}</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No items</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {reorderItems.length > 0 ? (
                      <div className="space-y-1 text-sm">
                        {reorderItems.map((item) => (
                          <div key={item.id} className="rounded bg-yellow-900 px-2 py-1 text-yellow-100">
                            {item.name}: {item.stock}/{item.min} {item.unit}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      disabled={reorderItems.length === 0}
                      onClick={() => handleNotifySupplier(supplier, reorderItems)}
                    >
                      Notify
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {suppliers.length === 0 && (
        <div className="alert alert-info mt-4">
          <span>No suppliers configured yet.</span>
        </div>
      )}
    </div>
  )
}

export default Supplier
