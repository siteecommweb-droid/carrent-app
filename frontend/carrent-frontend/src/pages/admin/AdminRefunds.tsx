import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, DollarSign, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import toast from "react-hot-toast";

type Refund = {
  id: number;
  booking_id: number;
  user_id: number;
  reason: string;
  amount: number;
  status: "requested" | "approved" | "rejected" | "paid";
  bank_reference: string | null;
  created_at: string;
  reference: string;
  car_name: string;
  first_name: string;
  surname: string;
  email: string;
};

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRefunds() {
    setLoading(true);
    try {
      const data = await fetchAPI("/admin/refunds");
      setRefunds(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await fetchAPI(`/admin/refunds/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success("Refund updated");
      loadRefunds();
    } catch (err) {
      toast.error("Update failed");
    }
  }

  useEffect(() => { loadRefunds(); }, []);

  const statusColors = {
    requested: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
                <DollarSign className="text-red-500" size={28} />
                Refunds Management
              </h1>
              <p className="text-gray-500 mt-1">Process deposit refunds and payment reversals</p>
            </div>
            <button onClick={loadRefunds} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Booking</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-mono">#{r.id}</td>
                  <td className="px-6 py-4 text-sm">{r.reference || `BK-${r.booking_id}`}</td>
                  <td className="px-6 py-4 text-sm">{r.first_name} {r.surname}</td>
                  <td className="px-6 py-4 text-sm font-bold">Rs {Number(r.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[150px] truncate">{r.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {r.status === "requested" && (
                      <>
                        <button onClick={() => updateStatus(r.id, "approved")} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">Approve</button>
                        <button onClick={() => updateStatus(r.id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">Reject</button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <button onClick={() => updateStatus(r.id, "paid")} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
              {refunds.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No refunds found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}