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
    const ids = new Set((supplier.ingredients || []).map((i) => i.id))
    return items.filter((item) => ids.has(item.ingredientId))
  }

  const getSupplierLowStock = (supplier) => {
    const ids = new Set((supplier.ingredients || []).map((i) => i.id))
    return lowStock.filter((item) => ids.has(item.ingredientId))
  }

  const handleNotifySupplier = (supplier, reorderItems) => {
    const itemLines = reorderItems
      .map((item) => `• ${item.name}: ${item.stock}/${item.min} ${item.unit}`)
      .join('\n')

    const subject = encodeURIComponent('Low Stock Reorder Request')
    const body = encodeURIComponent(
      `Hello ${supplier.name},\n\nPlease restock the following items:\n\n${itemLines}\n\nRegards,\nInventory System`
    )

    window.location.href = `mailto:${supplier.email}?subject=${subject}&body=${body}`

    Swal.fire({
      title: 'Email Prepared',
      text: `Supplier ${supplier.name} notified`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">
          Supplier Management
        </h2>
        <p className="text-slate-500 mt-1">
          Monitor inventory dependencies and manage supplier restocking
        </p>
      </div>

      {/* ================= STATES ================= */}
      {(suppliersLoading || inventoryLoading) && (
        <div className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-lg mb-4">
          Loading supplier data...
        </div>
      )}

      {suppliersError && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-4">
          {suppliersError}
        </div>
      )}

      {inventoryError && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-4">
          {inventoryError}
        </div>
      )}

      {/* ================= LOW STOCK ALERT ================= */}
      {!inventoryLoading && lowStock.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
          <h3 className="font-semibold">⚠ Low Stock Alert</h3>
          <p className="text-sm mt-1">
            {lowStock.map((i) => `${i.name} (${i.stock}/${i.min})`).join(', ')}
          </p>
        </div>
      )}

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            {/* HEADER */}
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 text-left">Supplier</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Lead Time</th>
                <th className="p-4 text-left">Supplied Items</th>
                <th className="p-4 text-left">Low Stock</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {suppliers.map((supplier) => {
                const suppliedItems = getSupplierItems(supplier)
                const reorderItems = getSupplierLowStock(supplier)

                return (
                  <tr
                    key={supplier.supplierSku}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* SUPPLIER */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">
                        {supplier.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        SKU: {supplier.supplierSku}
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="p-4 text-slate-600">
                      <div>{supplier.email}</div>
                      <div className="text-xs text-slate-400">{supplier.phone}</div>
                    </td>

                    {/* LEAD TIME */}
                    <td className="p-4 text-slate-700 font-medium">
                      {supplier.leadTime} days
                    </td>

                    {/* SUPPLIED ITEMS */}
                    <td className="p-4">
                      {suppliedItems.length ? (
                        <div className="flex flex-wrap gap-1">
                          {suppliedItems.map((item) => (
                            <span
                              key={item.id}
                              className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md"
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">None</span>
                      )}
                    </td>

                    {/* LOW STOCK */}
                    <td className="p-4">
                      {reorderItems.length ? (
                        <div className="space-y-1">
                          {reorderItems.map((item) => (
                            <div
                              key={item.id}
                              className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-100"
                            >
                              {item.name}: {item.stock}/{item.min}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-600 text-xs font-medium">
                          OK
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-center">
                      <button
                        disabled={reorderItems.length === 0}
                        onClick={() =>
                          handleNotifySupplier(supplier, reorderItems)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          reorderItems.length === 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        }`}
                      >
                        Notify Supplier
                      </button>
                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>
      </div>

      {/* EMPTY STATE */}
      {!suppliersLoading && suppliers.length === 0 && (
        <div className="mt-6 bg-slate-100 text-slate-600 p-4 rounded-xl border">
          No suppliers configured yet.
        </div>
      )}

    </div>
  )
}

export default Supplier