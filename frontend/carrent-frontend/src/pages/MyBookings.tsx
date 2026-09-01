import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CarFront,
  BadgeCheck,
  CreditCard,
  MapPin,
  Download,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";

interface Booking {
  id: number;
  reference: string;
  car_id: number;
  car_name?: string;
  car_make?: string;
  car_model?: string;
  status: string;
  payment_status: string;
  start_datetime: string;
  end_datetime: string;
  total_amount: number;
  created_at: string;
  pickup_location?: string;
  dropoff_location?: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const { formatPrice } = useCurrency();

  const loadBookings = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAPI("/bookings");
      setBookings(Array.isArray(data) ? data : data?.data || []);
      setError(null);
    } catch (err: any) {
      console.error("Failed to load bookings:", err);
      setError(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "confirmed") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s === "pending") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (s === "cancelled") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (s === "completed") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getPaymentIcon = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "paid") return <CheckCircle size={14} className="text-green-400" />;
    if (s === "partial") return <AlertCircle size={14} className="text-yellow-400" />;
    if (s === "unpaid") return <XCircle size={14} className="text-red-400" />;
    return <CreditCard size={14} className="text-gray-400" />;
  };

  const getCarDisplayName = (booking: Booking) => {
    if (booking.car_name) return booking.car_name;
    if (booking.car_make && booking.car_model) return `${booking.car_make} ${booking.car_model}`;
    return `Car #${booking.car_id}`;
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-white/70 mt-4">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                <CalendarDays className="text-red-500" size={32} />
                My Bookings
              </h1>
              <p className="text-white/60 mt-1">Track and manage all your rental reservations</p>
            </div>
            <button
              onClick={loadBookings}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-black text-white">{bookings.length}</div>
            <div className="text-xs text-white/50">Total Bookings</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-black text-green-400">
              {bookings.filter(b => b.status === "confirmed").length}
            </div>
            <div className="text-xs text-white/50">Confirmed</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-black text-yellow-400">
              {bookings.filter(b => b.status === "pending").length}
            </div>
            <div className="text-xs text-white/50">Pending</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-black text-blue-400">
              {bookings.filter(b => b.status === "completed").length}
            </div>
            <div className="text-xs text-white/50">Completed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
            <CalendarDays size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/50 text-lg">No bookings found</p>
            <Link
              to="/cars"
              className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Book Your First Car →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CarFront size={18} className="text-red-500" />
                      <span className="text-white/50 text-sm">Booking #{booking.reference || booking.id}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{getCarDisplayName(booking)}</h3>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status || "pending"}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80">
                      {getPaymentIcon(booking.payment_status)}
                      {booking.payment_status || "unpaid"}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="text-xs text-white/50 flex items-center gap-1"><MapPin size={12} /> Pickup</div>
                    <div className="text-white text-sm font-medium">{booking.start_datetime || "Not set"}</div>
                    <div className="text-white/60 text-xs">{booking.pickup_location || "SSR Airport"}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="text-xs text-white/50 flex items-center gap-1"><Clock size={12} /> Return</div>
                    <div className="text-white text-sm font-medium">{booking.end_datetime || "Not set"}</div>
                    <div className="text-white/60 text-xs">{booking.dropoff_location || "SSR Airport"}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="text-xs text-white/50">Total Amount</div>
                    <div className="text-xl font-black text-red-400">{formatPrice(booking.total_amount)}</div>
                    <div className="text-white/40 text-xs">Created: {new Date(booking.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}/invoices/${booking.id}/pdf`, "_blank")}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition text-sm"
                  >
                    <Download size={16} /> Invoice
                  </button>
                  <Link
                    to={`/cars?rebook=${booking.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-xl text-white hover:bg-red-700 transition text-sm"
                  >
                    <ArrowRight size={16} /> Rebook
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}