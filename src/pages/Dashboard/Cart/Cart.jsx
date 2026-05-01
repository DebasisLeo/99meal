
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
    const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8000/carts/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Item has been removed from your cart.",
                                icon: "success",
                            });
                        }
                    })
                    .catch(err => console.log(err));
            }
        });
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <FaShoppingCart />
                    Items: {cart.length}
                </h2>
                <h2 className="text-2xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
                {cart.length ? (
                    <Link to="/dashboard/payment">
                        <button className="btn bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-all duration-300">
                            Proceed to Pay
                        </button>
                    </Link>
                ) : (
                    <button disabled className="btn bg-gray-400 text-white px-5 py-2 rounded-lg cursor-not-allowed">
                        Proceed to Pay
                    </button>
                )}
            </div>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="table w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="p-4">#</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={item.id} className="border-b hover:bg-gray-100 transition-all duration-300">
                                <td className="p-4 text-center">{index + 1}</td>
                                <td className="p-4 flex justify-center">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden">
                                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold">{item.name}</td>
                                <td className="p-4 text-center text-green-600 font-bold">${parseFloat(item.price).toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cart;
