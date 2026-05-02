import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: payments = [] } = useQuery({
        queryKey: ["payments", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosPublic.get(`/payments/${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Payment History
                </h2>

                <p className="text-slate-600 mb-6">
                    Total Payments:{" "}
                    <span className="font-semibold text-slate-900">
                        {payments.length}
                    </span>
                </p>

                <div className="overflow-x-auto">
                    <table className="table w-full">

                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th>#</th>
                                <th>Price</th>
                                <th>Transaction ID</th>
                                <th>Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody className="text-slate-700">

                            {payments.map((payment, index) => (
                                <tr key={payment.id} className="border-b hover:bg-slate-50">

                                    <td>{index + 1}</td>

                                    <td className="font-semibold text-emerald-600">
                                        ${payment.price}
                                    </td>

                                    <td className="text-xs break-all">
                                        {payment.transactionId}
                                    </td>

                                    {/* ITEMS FIX */}
                                    <td>
  {Array.isArray(payment.items) && payment.items.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {payment.items.map((item, idx) => (
        <span key={idx} className="px-2 py-1 bg-slate-100 rounded text-xs">
          {typeof item === "string" ? item : item?.name}
        </span>
      ))}
    </div>
  ) : (
    <span className="text-slate-400 text-xs">No items</span>
  )}
</td>

                                    <td>
                                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                            {payment.status}
                                        </span>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
};

export default PaymentHistory;