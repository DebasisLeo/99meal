import { createSharedStore } from './sharedStore'

const orderStore = createSharedStore([])

function makeOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export default function useKitchenOrders() {
  const orders = orderStore.useStore()

  const createOrder = (payload = {}) => {
    const newOrder = {
      orderId: makeOrderId(),
      customerEmail: payload.customerEmail || 'guest',
      items: payload.items || [],
      totalPrice: Number(payload.totalPrice || 0),
      paymentStatus: 'paid',
      kitchenStatus: 'pending',
      createdAt: new Date().toISOString(),
      acceptedAt: null,
      rejectedAt: null,
      deduction: null,
    }

    orderStore.setState((prev) => [newOrder, ...prev])
    return newOrder
  }

  const acceptOrder = (orderId, deduction) => {
    orderStore.setState((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              kitchenStatus: 'accepted',
              acceptedAt: new Date().toISOString(),
              deduction,
            }
          : order
      )
    )
  }

  const rejectOrder = (orderId) => {
    orderStore.setState((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, kitchenStatus: 'rejected', rejectedAt: new Date().toISOString() }
          : order
      )
    )
  }

  return { orders, createOrder, acceptOrder, rejectOrder }
}
