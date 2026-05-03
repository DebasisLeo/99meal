import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useCart from '../../../hooks/useCart'
import useRecipe from '../../../hooks/useRecipe'
import useAuth from '../../../hooks/useAuth'
import useKitchenOrders from '../../../hooks/useKitchenOrders'

const Checkout = () => {
  useEffect(() => {
    document.title = 'Rassporium | Checkout'
  }, [])

  const navigate = useNavigate()
  const { user } = useAuth()
  const [cart, , clearCart] = useCart()
  const { enrichMenuItems } = useRecipe()
  const { createOrder } = useKitchenOrders()
  const [isProcessing, setIsProcessing] = useState(false)
  const [enrichedCart, setEnrichedCart] = useState([])

  useEffect(() => {
    // Enrich cart items with ingredient data
    setEnrichedCart(enrichMenuItems(cart))
  }, [cart, enrichMenuItems])

  const totalPrice = enrichedCart.reduce((total, item) => total + parseFloat(item.price || 0), 0)

  const handleConfirmPayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing (in real app, integrate Stripe/payment API here)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const order = createOrder({
      customerEmail: user?.email,
      items: enrichedCart,
      totalPrice,
    })

    Swal.fire({
      title: 'Payment Successful!',
      html: `<div class="text-left">
        <p>${order.orderId} is paid and waiting for kitchen acceptance.</p>
        <p class="mt-2 text-sm">Inventory will decrease when the kitchen accepts the order.</p>
      </div>`,
      icon: 'success',
      confirmButtonText: 'View Kitchen',
    }).then(() => {
      clearCart()
      navigate('/dashboard/kitchen')
    })

    setIsProcessing(false)
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {enrichedCart.length === 0 ? (
        <div className="alert alert-info">
          <span>Your cart is empty. Add items before checkout.</span>
        </div>
      ) : (
        <>
          {/* Order Summary */}
          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h3 className="card-title">Order Summary</h3>
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Ingredients Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedCart.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold">{item.name}</td>
                        <td>${parseFloat(item.price || 0).toFixed(2)}</td>
                        <td className="text-xs">
                          {item.ingredients && item.ingredients.length > 0
                            ? item.ingredients.map((ing) => `${ing.qty}${ing.unit} ${ing.name}`).join(', ')
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h3 className="card-title">Payment Method</h3>
              <p className="text-sm text-gray-500">Mock payment: Click "Confirm Payment" to proceed (no actual charges)</p>
              <label className="label cursor-pointer">
                <span className="label-text">Credit/Debit Card (Mock)</span>
                <input type="radio" name="payment" className="radio radio-primary" defaultChecked />
              </label>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/cart')}
              className="btn btn-outline"
              disabled={isProcessing}
            >
              Back to Cart
            </button>
            <button
              onClick={handleConfirmPayment}
              className="btn btn-primary"
              disabled={isProcessing}
              loading={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Confirm Payment - $${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Checkout
