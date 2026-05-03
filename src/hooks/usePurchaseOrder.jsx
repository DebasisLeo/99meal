import { createSharedStore } from './sharedStore'

const initialPOs = []
const purchaseOrderStore = createSharedStore(initialPOs)

export function getPurchaseOrders() {
  return purchaseOrderStore.getState()
}

export function createPurchaseOrder(payload = {}) {
  const poId = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  const newPO = {
    poId,
    supplierSku: payload.supplierSku || 'UNKNOWN',
    items: payload.items || [],
    totalAmount: (payload.items || []).reduce((sum, item) => sum + (item.qty * (item.unitPrice || 0)), 0),
    status: 'pending',
    sourceOrderId: payload.sourceOrderId || null,
    createdAt: new Date().toISOString(),
    receivedAt: null,
  }

  purchaseOrderStore.setState((prev) => [newPO, ...prev])
  return newPO
}

export default function usePurchaseOrder() {
  const pos = purchaseOrderStore.useStore()

  const createPO = (payload = {}) => {
    return createPurchaseOrder(payload)
  }

  const receivePO = (poId) => {
    purchaseOrderStore.setState((prev) =>
      prev.map((po) =>
        po.poId === poId ? { ...po, status: 'received', receivedAt: new Date().toISOString() } : po
      )
    )
  }

  const getPO = (poId) => {
    return pos.find((po) => po.poId === poId)
  }

  const getPendingPOs = () => {
    return pos.filter((po) => po.status === 'pending')
  }

  return { pos, createPO, receivePO, getPO, getPendingPOs }
}
