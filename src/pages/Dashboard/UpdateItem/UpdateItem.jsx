import { useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { FaUtensils, FaUpload, FaSave } from "react-icons/fa";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItem = () => {
    const { name, category, recipe, price, id } = useLoaderData();
    const { register, handleSubmit } = useForm();
    const axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const imgRes = await axiosPublic.post(image_hosting_api, formData, {
                headers: { "content-type": "multipart/form-data" }
            });

            if (imgRes.data.success) {
                const menuItem = {
                    name: data.name,
                    category: data.category,
                    price: parseFloat(data.price),
                    recipe: data.recipe,
                    image: imgRes.data.data.display_url
                };

                const menuRes = await axiosPublic.patch(
                    `http://localhost:8000/menu/${id}`,
                    menuItem
                );

                if (menuRes.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${data.name} updated successfully`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">

            {/* Card */}
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-6 flex flex-col sm:flex-row justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaUtensils />
                        Update Menu Item
                    </h2>
                    <p className="text-slate-200 text-sm">
                        Edit and refresh your item details
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 text-slate-700">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">
                            Recipe Name*
                        </label>
                        <input
                            type="text"
                            defaultValue={name}
                            {...register("name", { required: true })}
                            className="mt-1 w-full input input-bordered bg-white border-slate-300 focus:border-slate-500"
                        />
                    </div>

                    {/* Category + Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div>
                            <label className="text-sm font-semibold text-slate-600">
                                Category*
                            </label>
                            <select
                                defaultValue={category}
                                {...register("category", { required: true })}
                                className="mt-1 w-full select select-bordered bg-white border-slate-300"
                            >
                                <option disabled value="default">Select category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600">
                                Price*
                            </label>
                            <input
                                type="number"
                                defaultValue={price}
                                {...register("price", { required: true })}
                                className="mt-1 w-full input input-bordered bg-white border-slate-300"
                            />
                        </div>

                    </div>

                    {/* Recipe */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">
                            Recipe Details
                        </label>
                        <textarea
                            defaultValue={recipe}
                            {...register("recipe")}
                            className="mt-1 w-full textarea textarea-bordered bg-white border-slate-300 h-28"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">
                            Upload Image*
                        </label>

                        <div className="relative mt-1">
                            <input
                                type="file"
                                {...register("image", { required: true })}
                                className="file-input file-input-bordered w-full bg-white border-slate-300"
                            />
                            <FaUpload className="absolute right-4 top-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                    >
                        <FaSave />
                        Update Item
                    </button>

                </form>
            </div>
        </div>
    );
};

export default UpdateItem;