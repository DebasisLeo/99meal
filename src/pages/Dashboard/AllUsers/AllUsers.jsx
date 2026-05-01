import { useEffect, useState } from "react";

const AllUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:8000/users");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex  justify-between items-center my-4">
                <h2 className="text-3xl font-bold text-gray-800">All Users</h2>
                <h2 className="text-xl text-gray-600">Total Users: {users.length}</h2>
            </div>

            <div className="overflow-x-auto ">
                <table className="table w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-4">#</th>
                            <th className="p-4">Photo</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id || index} className="border-b hover:bg-gray-100 transition-all duration-200">
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                                        <img
                                            src={user.photoURL}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;
