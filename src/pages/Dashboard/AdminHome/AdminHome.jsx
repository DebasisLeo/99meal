import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { FaBook, FaDollarSign, FaUsers } from "react-icons/fa";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Legend,
    Tooltip
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6B6B"];

const AdminHome = () => {
    const { user } = useAuth();

    // ================= ADMIN STATS =================
    const { data: stats = {} } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:8000/admin-stats");
            return res.data;
        }
    });

    // ================= ORDER STATS =================
    const { data: chartData = [] } = useQuery({
        queryKey: ["order-stats"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:8000/order-stats");
            return res.data;
        }
    });

    // ================= PIE DATA =================
    const pieChartData = chartData.map(item => ({
        name: item.category,
        value: Number(item.revenue) || 0
    }));

    return (
        <div className="container mx-auto p-6">

            {/* HEADER */}
            <h2 className="text-3xl font-semibold text-center mb-8">
                Hi, Welcome {user?.displayName || "Back"}
            </h2>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <div className="bg-indigo-600 text-white p-6 rounded shadow">
                    <FaDollarSign className="text-3xl mb-2" />
                    <div>Revenue</div>
                    <div className="text-2xl font-bold">
                        ${stats.revenue || 0}
                    </div>
                </div>

                <div className="bg-green-500 text-white p-6 rounded shadow">
                    <FaUsers className="text-3xl mb-2" />
                    <div>Users</div>
                    <div className="text-2xl font-bold">
                        {stats.users || 0}
                    </div>
                </div>

                <div className="bg-yellow-500 text-white p-6 rounded shadow">
                    <FaBook className="text-3xl mb-2" />
                    <div>Menu Items</div>
                    <div className="text-2xl font-bold">
                        {stats.menuItems || 0}
                    </div>
                </div>

                <div className="bg-pink-500 text-white p-6 rounded shadow">
                    <div className="text-3xl mb-2">🛒</div>
                    <div>Orders</div>
                    <div className="text-2xl font-bold">
                        {stats.orders || 0}
                    </div>
                </div>

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* BAR CHART */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Order Quantity by Category
                    </h3>

                    <BarChart width={500} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />

                        <Bar dataKey="quantity">
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>

                {/* PIE CHART */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Revenue Distribution
                    </h3>

                    <PieChart width={400} height={350}>
                        <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >
                            {pieChartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

            </div>
        </div>
    );
};

export default AdminHome;