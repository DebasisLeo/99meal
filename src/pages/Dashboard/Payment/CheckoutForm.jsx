import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();
    const [cart, refetch] = useCart();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);

    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.price),
        0
    );

    const items = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price
    }));

    useEffect(() => {
        if (totalPrice > 0) {
            axiosPublic
                .post("/create-payment-intent", { price: totalPrice })
                .then(res => setClientSecret(res.data.clientSecret));
        }
    }, [totalPrice, axiosPublic]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error: methodError } = await stripe.createPaymentMethod({
            type: "card",
            card
        });

        if (methodError) {
            setError(methodError.message);
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } =
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: {
                        email: user?.email,
                        name: user?.displayName
                    }
                }
            });

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            const payment = {
                email: user.email,
                price: totalPrice,
                transactionId: paymentIntent.id,
                status: "success",
                items
            };

            const res = await axiosPublic.post("/payments", payment);

            if (res.data?.insertedId) {

                await Promise.all(
                    cart.map(item =>
                        axiosPublic.delete(`/carts/${item.id}`)
                    )
                );

                refetch();

                Swal.fire({
                    icon: "success",
                    title: "Payment Successful 🎉",
                    text: "Your order has been placed successfully",
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/dashboard/paymentHistory");
            }
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* CARD BOX */}
            <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#374151",
                                "::placeholder": {
                                    color: "#9CA3AF"
                                }
                            }
                        }
                    }}
                />
            </div>

            {/* TOTAL */}
            <div className="flex justify-between text-gray-700 font-medium">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
            </div>

            {/* BUTTON */}
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className={`w-full py-2 rounded-md text-white font-semibold transition 
                ${processing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {processing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </button>

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-sm text-center">
                    {error}
                </p>
            )}
        </form>
    );
};

export default CheckoutForm;