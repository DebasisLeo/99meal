import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddItems = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const imgRes = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            });

            if (imgRes.data.success) {
                const menuItem = {
                    name: data.name,
                    category: data.category,
                    price: parseFloat(data.price),
                    recipe: data.recipe,
                    image: imgRes.data.data.display_url,
                };

                const menuRes = await axiosPublic.post(
                    "http://localhost:8000/menu",
                    menuItem
                );

                if (menuRes.data.insertedId) {
                    reset();

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${data.name} added successfully`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <SectionTitle heading="Add Item" subHeading="Create new menu item" />

            <div className="max-w-4xl mx-auto mt-8">

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white border shadow-md rounded-2xl p-8 space-y-6"
                >

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Add New Food Item
                    </h2>

                    {/* NAME */}
                    <div>
                        <label className="text-gray-700 font-medium">
                            Recipe Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Enter recipe name"
                            className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* CATEGORY + PRICE */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="text-gray-700 font-medium">
                                Category
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Select category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-700 font-medium">
                                Price
                            </label>
                            <input
                                type="number"
                                {...register("price", { required: true })}
                                placeholder="Enter price"
                                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                    </div>

                    {/* DETAILS */}
                    <div>
                        <label className="text-gray-700 font-medium">
                            Recipe Details
                        </label>
                        <textarea
                            {...register("recipe")}
                            placeholder="Write description..."
                            className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 h-28"
                        />
                    </div>

                    {/* IMAGE */}
                    <div>
                        <label className="text-gray-700 font-medium">
                            Image Upload
                        </label>
                        <input
                            type="file"
                            {...register("image", { required: true })}
                            className="w-full mt-2 border rounded-lg p-2 text-gray-700 file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow hover:scale-[1.02] transition"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Add Item <FaUtensils />
                        </span>
                    </button>

                </form>

            </div>
        </div>
    );
};

export default AddItems;