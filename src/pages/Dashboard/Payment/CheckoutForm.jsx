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

    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.price),
        0
    );

    // items for DB
    const items = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price
    }));

    // create payment intent
    useEffect(() => {
        if (totalPrice > 0) {
            axiosPublic.post("/create-payment-intent", { price: totalPrice })
                .then(res => setClientSecret(res.data.clientSecret));
        }
    }, [totalPrice, axiosPublic]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error: methodError } = await stripe.createPaymentMethod({
            type: "card",
            card
        });

        if (methodError) {
            setError(methodError.message);
            return;
        } else {
            setError("");
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
            return;
        }

        // ✅ PAYMENT SUCCESS
        if (paymentIntent.status === "succeeded") {

            setTransactionId(paymentIntent.id);

            const payment = {
                email: user.email,
                price: totalPrice,
                transactionId: paymentIntent.id,
                status: "success",
                items
            };

            const res = await axiosPublic.post("/payments", payment);

            // ✅ FIXED RESPONSE CHECK
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
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/dashboard/paymentHistory");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />

            <button
                className="btn btn-primary mt-4"
                type="submit"
                disabled={!stripe || !clientSecret}
            >
                Pay
            </button>

            <p className="text-red-600">{error}</p>

            {transactionId && (
                <p className="text-green-600">
                    Transaction ID: {transactionId}
                </p>
            )}
        </form>
    );
};

export default CheckoutForm;