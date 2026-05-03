import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import usePurchaseOrder from '../../hooks/usePurchaseOrder'
import useSupplier from '../../hooks/useSupplier'
import useInventory from '../../hooks/useInventory'

const PurchaseOrder = () => {
  useEffect(() => {
    document.title = 'Rassporium | Purchase Orders'
  }, [])

  const { pos, receivePO } = usePurchaseOrder()
  const { suppliers } = useSupplier()
  const { adjustStock } = useInventory()

  const handleReceivePO = (poId) => {
    const po = pos.find((p) => p.poId === poId)
    if (!po) return

    Swal.fire({
      title: 'Receive PO?',
      text: `Mark ${po.poId} as received and restock inventory?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Receive',
    }).then((result) => {
      if (result.isConfirmed) {
        // Mark PO as received
        receivePO(poId)

        // Restock inventory
        po.items.forEach(({ sku, qty }) => {
          adjustStock(sku, qty)
        })

        Swal.fire({
          title: 'PO Received!',
          text: `Inventory has been restocked.`,
          icon: 'success',
        })
      }
    })
  }

  const getSupplierName = (supplierSku) => {
    const supplier = suppliers.find((s) => s.supplierSku === supplierSku)
    return supplier ? supplier.name : supplierSku
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Purchase Orders</h2>
        <p className="text-sm text-gray-400">Track and receive inventory purchase orders</p>
      </header>

      {pos.length === 0 ? (
        <div className="alert alert-info">
          <span>No purchase orders yet. They will be auto-generated when inventory drops below minimum.</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {pos.map((po) => {
            const supplier = suppliers.find((s) => s.supplierSku === po.supplierSku)
            return (
              <div key={po.poId} className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="card-title text-lg">{po.poId}</h3>
                      <p className="text-sm text-gray-400">
                        Supplier: <strong>{getSupplierName(po.supplierSku)}</strong>
                      </p>
                      <p className="text-sm text-gray-400">
                        Created: {new Date(po.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`badge ${po.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                        {po.status.toUpperCase()}
                      </div>
                      <p className="text-xl font-bold mt-2">${po.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item SKU</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {po.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.sku}</td>
                          <td>{item.qty}</td>
                          <td>${(item.unitPrice || 0).toFixed(2)}</td>
                          <td>${(item.qty * (item.unitPrice || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {po.status === 'pending' && (
                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleReceivePO(po.poId)}
                      >
                        Mark as Received
                      </button>
                    </div>
                  )}
                  {po.status === 'received' && (
                    <p className="text-sm text-gray-400 mt-4">
                      Received on {new Date(po.receivedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PurchaseOrder
