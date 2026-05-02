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
            console.log(data);

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
                        title: `${data.name} is added to the menu.`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    throw new Error("Insert failed");
                }
            }
        } catch (error) {
            console.log("Add item error:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to add item",
                text: error.message,
            });
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <SectionTitle heading="Add an Item" subHeading="What's new?" />

           
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Recipe Name*</span>
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Recipe Name"
                        />
                    </div>

                    <div className="flex gap-6 sm:flex-col md:flex-row">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Category*</span>
                            </label>
                            <select
                                defaultValue="default"
                                {...register("category", { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option disabled value="default">Select a category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">Dessert</option>
                                <option value="drinks">Drinks</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Price*</span>
                            </label>
                            <input
                                type="number"
                                {...register("price", { required: true })}
                                className="input input-bordered w-full"
                                placeholder="Price"
                            />
                        </div>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Recipe Details</span>
                        </label>
                        <textarea
                            {...register("recipe")}
                            className="textarea textarea-bordered w-full"
                            placeholder="Recipe Details"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Image*</span>
                        </label>
                        <input
                            type="file"
                            {...register("image", { required: true })}
                            className="file-input w-full"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Add Item <FaUtensils />
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddItems;