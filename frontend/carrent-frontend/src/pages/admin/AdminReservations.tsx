import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, XCircle, Clock, RefreshCw, Eye, Calendar, Car, User, Mail, Phone, MapPin, TrendingUp, AlertCircle, FileText } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const FILES_BASE = API_URL.replace(/\/api\/?$/, "");

interface Reservation {
  id: number; reference: string; user_id: number | null;
  car_name: string; av_group: string; status: string;
  first_name: string; surname: string; email: string; phone: string;
  pickup_date: string; return_date: string; days: number;
  accommodation_type: string; accommodation_name: string;
  adults: number; children: number; luggage_large: number; luggage_small: number;
  passport_file: string | null; licence_file: string | null;
  grand_total_mur: number; grand_total_usd: number;
  special_request: string; created_at: string;
}

function money(n: any) {
  return `Rs ${Number(n || 0).toLocaleString()}`;
}

export default function AdminReservations() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const token = localStorage.getItem("token");

  async function load() {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/reservations`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    await fetch(`${API_URL}/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const hay = [r.reference, r.first_name, r.surname, r.email, r.phone, r.car_name, r.status].join(" ").toLowerCase();
      const matchSearch = hay.includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || r.status?.toLowerCase() === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [rows, search, filterStatus]);

  const totalRevenue = filtered.reduce((sum, r) => sum + Number(r.grand_total_mur || 0), 0);

  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
    paid: rows.filter((r) => r.status === "paid").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
    guests: rows.filter((r) => !r.user_id).length,
  };

  function badge(status: string) {
    const s = status?.toLowerCase() || "";
    if (s === "confirmed") return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "paid") return "bg-green-100 text-green-700 border-green-200";
    if (s === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading reservations...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Reservations Command Center</h1>
              <p className="text-gray-500 mt-1">Live data from your AM38 reservations table — guest and logged-in bookings both appear here</p>
            </div>
            <button onClick={load} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50">
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { title: "Total", value: stats.total, color: "blue" },
            { title: "Pending", value: stats.pending, color: "yellow" },
            { title: "Confirmed", value: stats.confirmed, color: "blue" },
            { title: "Paid", value: stats.paid, color: "green" },
            { title: "Cancelled", value: stats.cancelled, color: "red" },
            { title: "Guest bookings", value: stats.guests, color: "purple" },
          ].map((s) => (
            <div key={s.title} className={`rounded-xl p-4 text-center bg-${s.color}-50 text-${s.color}-600`}>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs uppercase tracking-wide">{s.title}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3"><TrendingUp size={24} className="text-emerald-600" /><div><p className="text-sm text-emerald-600 font-medium">Total Revenue (filtered)</p><p className="text-2xl font-black text-emerald-700">{money(totalRevenue)}</p></div></div>
          <span className="text-sm text-emerald-600">Based on {filtered.length} reservations</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input placeholder="Search reference, name, email, car..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((r, idx) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: idx * 0.02 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm uppercase tracking-wider font-bold text-red-600">{r.reference}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badge(r.status)}`}>{r.status || "pending"}</span>
                      {!r.user_id && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">Guest</span>}
                    </div>
                    <div className="flex items-center gap-2"><Car size={18} className="text-gray-400" /><span className="text-xl font-black text-gray-900">{r.car_name}</span><span className="text-sm text-gray-500">• {r.av_group}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><User size={16} className="text-gray-400" /><span>{r.first_name} {r.surname}</span></div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      {r.email && <div className="flex items-center gap-1"><Mail size={14} />{r.email}</div>}
                      {r.phone && <div className="flex items-center gap-1"><Phone size={14} />{r.phone}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-600">{money(r.grand_total_mur)}</div>
                    <div className="text-xs text-gray-400 mt-1">Created: {new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> Pickup</div><div className="font-semibold text-gray-900">{r.pickup_date}</div></div>
                  <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> Return</div><div className="font-semibold text-gray-900">{r.return_date}</div></div>
                  <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Stay</div><div className="font-semibold text-gray-900">{r.accommodation_type || "-"}: {r.accommodation_name || "-"}</div></div>
                  <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-500">Passengers</div><div className="font-semibold text-gray-900">{r.adults} adults, {r.children} children</div></div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {r.passport_file && <a href={`${FILES_BASE}${r.passport_file}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200"><FileText size={14} /> Passport</a>}
                  {r.licence_file && <a href={`${FILES_BASE}${r.licence_file}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200"><FileText size={14} /> Licence</a>}
                  <button onClick={() => setSelected(r)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition text-sm font-medium"><Eye size={16} /> Details</button>
                  <button onClick={() => setStatus(r.id, "confirmed")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition text-sm font-medium"><CheckCircle size={16} /> Confirm</button>
                  <button onClick={() => setStatus(r.id, "paid")} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-xl text-white hover:bg-emerald-700 transition text-sm font-medium"><CheckCircle size={16} /> Mark Paid</button>
                  <button onClick={() => setStatus(r.id, "cancelled")} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-xl text-white hover:bg-red-700 transition text-sm font-medium"><XCircle size={16} /> Cancel</button>
                  <button onClick={() => setStatus(r.id, "pending")} className="flex items-center gap-2 px-4 py-2 bg-amber-600 rounded-xl text-white hover:bg-amber-700 transition text-sm font-medium"><Clock size={16} /> Reopen</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200"><AlertCircle size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-400">No reservations found</p></div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center"><h2 className="text-xl font-black">Reservation Details</h2><button onClick={() => setSelected(null)}><XCircle size={24} /></button></div>
              <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                <div><label className="text-xs text-gray-500">Reference</label><p className="font-medium">{selected.reference}</p></div>
                <div><label className="text-xs text-gray-500">Status</label><p className="font-medium">{selected.status}</p></div>
                <div><label className="text-xs text-gray-500">Name</label><p className="font-medium">{selected.first_name} {selected.surname}</p></div>
                <div><label className="text-xs text-gray-500">Email / Phone</label><p className="font-medium">{selected.email}<br/>{selected.phone}</p></div>
                <div><label className="text-xs text-gray-500">Car</label><p className="font-medium">{selected.car_name}</p></div>
                <div><label className="text-xs text-gray-500">Total</label><p className="font-medium text-red-600">{money(selected.grand_total_mur)} (${selected.grand_total_usd})</p></div>
                <div className="col-span-2"><label className="text-xs text-gray-500">Special Request</label><p className="font-medium">{selected.special_request || "None"}</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}