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
    <div className="min-h-screen bg-slate-50 px-6 py-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all registered users and their roles
          </p>
        </div>

        <div className="bg-white border shadow-sm rounded-xl px-4 py-2">
          <span className="text-sm text-slate-500">Total Users</span>
          <div className="text-xl font-bold text-slate-800">
            {users.length}
          </div>
        </div>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-6 py-4 border-b bg-slate-50">
          <p className="text-sm font-medium text-slate-600">
            Registered Users List
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            {/* HEAD */}
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100">

              {users.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="hover:bg-slate-50 transition"
                >

                  {/* INDEX */}
                  <td className="px-5 py-4 text-slate-500">
                    {index + 1}
                  </td>

                  {/* USER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full overflow-hidden border bg-slate-100">
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          ID: {user.id || "N/A"}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-5 py-4 text-slate-600">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : user.role === "staff"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY STATE */}
        {users.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-slate-500 font-medium">
              No users found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add new users to see them here
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default AllUsers;