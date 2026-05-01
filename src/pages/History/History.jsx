import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`http://localhost:8000/history/${user.email}`);
            const data = await res.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching history:", error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm("Are you sure you want to clear your history?")) return;

        try {
            await fetch(`http://localhost:8000/history/${user.email}`, { method: "DELETE" });
            setHistory([]);
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    if (loading) return <p className="text-center text-lg font-semibold">Loading history...</p>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Activity History</h2>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                    >
                        Clear History
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <p className="text-gray-500">You have no history yet.</p>
            ) : (
                <ul className="bg-white shadow rounded-lg p-5 space-y-4">
                    {history.map(item => (
                        <li key={item.id} className="border-b pb-3 last:border-none flex flex-col">
                            <p className="font-semibold text-gray-700">
                                {item.action_type} — {item.item_name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                            </p>
                            {item.details && <p className="text-sm text-gray-400">Details: {item.details}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
