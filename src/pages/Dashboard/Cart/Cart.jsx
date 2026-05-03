import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useCart from "../../../hooks/useCart";
import { useEffect } from "react";

const Cart = () => {
    useEffect(() => {
        document.title = "Rassporium | Cart";
    }, []);

    const [cart, refetch] = useCart();

    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.price),
        0
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Remove item?",
            text: "This item will be removed from your cart.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6366f1",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes, remove",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8000/carts/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire("Removed!", "Item deleted.", "success");
                        }
                    });
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 via-white to-indigo-50 min-h-screen">

            {/* HEADER */}
            <div className="bg-white border shadow-lg rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-5">

                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <FaShoppingCart className="text-2xl" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Your Cart ({cart.length})
                    </h2>
                </div>

                <div className="text-lg font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700">
                    Total:
                    <span className="ml-2 font-bold text-emerald-600">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>

                {cart.length > 0 ? (
                    <Link to="/dashboard/checkout">
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow hover:scale-105 transition">
                            Checkout →
                        </button>
                    </Link>
                ) : (
                    <button disabled className="bg-gray-200 px-6 py-2 rounded-xl text-gray-500 cursor-not-allowed">
                        Checkout
                    </button>
                )}
            </div>

            {/* EMPTY STATE */}
            {cart.length === 0 && (
                <div className="bg-white p-10 rounded-2xl shadow text-center border">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Your cart is empty 🛒
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Add something tasty to get started
                    </p>
                    <Link to="/menu">
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition">
                            Browse Menu
                        </button>
                    </Link>
                </div>
            )}

            {/* TABLE */}
            {cart.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-gray-700 text-sm uppercase">
                            <tr>
                                <th className="p-4">#</th>
                                <th className="p-4">Item</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-indigo-50 transition"
                                >
                                    <td className="p-4 text-center text-gray-600">
                                        {index + 1}
                                    </td>

                                    <td className="p-4 flex justify-center">
                                        <div className="p-1 rounded-lg bg-indigo-50">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                        </div>
                                    </td>

                                    <td className="p-4 text-center font-semibold text-gray-800">
                                        {item.name}
                                    </td>

                                    <td className="p-4 text-center font-bold text-emerald-600">
                                        ${parseFloat(item.price).toFixed(2)}
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 hover:scale-105 transition"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}
        </div>
    );
};

export default Cart;