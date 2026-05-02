import { FaEdit, FaTrashAlt, FaListAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useMenu from "../../../hooks/useMenu";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const ManageItems = () => {
    const [menu, , refetch] = useMenu();
    const axiosPublic = useAxiosPublic();

    const handleDeleteItem = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This item will be permanently removed",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosPublic.delete(
                        `http://localhost:8000/menu/${item.id}`
                    );

                    if (res.data.deletedCount > 0) {
                        refetch();

                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: `${item.name} deleted`,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Delete Failed",
                        text: error.message,
                    });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-slate-800 to-slate-600 text-white p-6 rounded-xl shadow-md mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaListAlt />
                    Manage Menu Items
                </h2>
                <p className="text-slate-200 text-sm">
                    Keep everything updated & clean
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
                <table className="table w-full">

                    {/* Header */}
                    <thead className="bg-slate-900 text-slate-100">
                        <tr>
                            <th className="p-4 text-left">#</th>
                            <th className="p-4 text-left">Image</th>
                            <th className="p-4 text-left">Item Name</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-center">Update</th>
                            <th className="p-4 text-center">Delete</th>
                        </tr>
                    </thead>

                    <tbody className="text-slate-700">

                        {menu.map((item, index) => (
                            <tr
                                key={item.id}
                                className="border-b border-slate-100 hover:bg-slate-50 transition"
                            >

                                {/* index */}
                                <td className="p-4 font-medium text-slate-500">
                                    {index + 1}
                                </td>

                                {/* image */}
                                <td className="p-4">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </td>

                                {/* name */}
                                <td className="p-4 font-semibold text-slate-800">
                                    {item.name}
                                </td>

                                {/* price */}
                                <td className="p-4 font-bold text-emerald-600">
                                    ${parseFloat(item.price).toFixed(2)}
                                </td>

                                {/* update */}
                                <td className="p-4 text-center">
                                    <Link to={`/dashboard/updateItem/${item.id}`}>
                                        <button className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md shadow-sm transition">
                                            <FaEdit />
                                        </button>
                                    </Link>
                                </td>

                                {/* delete */}
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleDeleteItem(item)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-sm transition"
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

export default ManageItems;