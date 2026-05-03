import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const Payment = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Secure Payment
                </h2>

                <p className="text-center text-gray-500 mb-6">
                    Complete your order securely using your card
                </p>

                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>

            </div>
        </div>
    );
};

export default Payment;