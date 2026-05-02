import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { FaSmile, FaUserCircle } from "react-icons/fa";

const UserHome = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: dbUser } = useQuery({
        queryKey: ["db-user", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user.email}`);
            return res.data;
        }
    });

    const isValidImage =
        dbUser?.photoURL && dbUser.photoURL.startsWith("http");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">

            {/* Avatar */}
            <div className="bg-white p-2 rounded-full shadow-lg mb-4">
                {isValidImage ? (
                    <img
                        src={dbUser.photoURL}
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <FaUserCircle className="text-gray-500 w-20 h-20" />
                )}
            </div>

            {/* Greeting Card */}
            <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 bg-white/90 text-gray-800 p-4 rounded-lg shadow-md">

                <FaSmile className="text-yellow-500" />

                Hi, Welcome{" "}
                <span className="text-indigo-600 font-bold">
                    {dbUser?.name || user?.displayName || "Back"}
                </span>
                !
            </h2>

            {/* Role */}
            <p className="mt-3 text-sm bg-white/80 text-gray-700 px-4 py-1 rounded-full shadow">
                Role: <span className="font-semibold text-gray-900">
                    {dbUser?.role || "user"}
                </span>
            </p>

            {/* Email */}
            <p className="mt-2 text-xs text-white/80 bg-black/20 px-3 py-1 rounded">
                {dbUser?.email}
            </p>

            {/* Subtext */}
            <p className="mt-5 text-base text-white bg-white/10 px-4 py-2 rounded-lg text-center max-w-md">
                We're glad to have you here. Let's make something awesome today!
            </p>

        </div>
    );
};

export default UserHome;