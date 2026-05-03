import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Review = () => {
    const axiosPublic = useAxiosPublic();

    const [form, setForm] = useState({
        name: "",
        details: "",
        rating: 5
    });

    const { data: reviews = [], refetch } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await axiosPublic.get("/reviews");
            return res.data;
        }
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.details) {
            return Swal.fire({
                icon: "warning",
                title: "All fields required!"
            });
        }

        const res = await axiosPublic.post("/reviews", form);

        if (res.data.insertedId) {
            Swal.fire({
                icon: "success",
                title: "Review Added 🎉",
                timer: 1500,
                showConfirmButton: false
            });

            setForm({ name: "", details: "", rating: 5 });
            refetch();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">

            {/* FORM */}
            <form className="bg-white p-6 rounded-lg shadow-md mb-8 border" onSubmit={handleSubmit}>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Add Review
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-400"
                />

                <textarea
                    name="details"
                    placeholder="Write your review..."
                    value={form.details}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-400"
                />

                <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-gray-800"
                >
                    <option value={5}>5 ⭐</option>
                    <option value={4}>4 ⭐</option>
                    <option value={3}>3 ⭐</option>
                    <option value={2}>2 ⭐</option>
                    <option value={1}>1 ⭐</option>
                </select>

                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    Submit Review
                </button>
            </form>

            {/* REVIEW LIST */}
            <div className="grid gap-5">

                {reviews.map(review => (
                    <div
                        key={review.id}
                        className="bg-white p-5 rounded-lg shadow border hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">
                            {review.name}
                        </h3>

                        <p className="text-gray-600 mt-1 mb-2">
                            {review.details}
                        </p>

                        <p className="text-yellow-500 font-medium">
                            {"⭐".repeat(review.rating)}
                        </p>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Review;