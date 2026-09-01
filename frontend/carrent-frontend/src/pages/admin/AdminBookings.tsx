import { useMemo, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import {
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  User,
  CreditCard,
  CalendarDays,
  MapPin,
  Download,
  Filter,
  Eye,
  MessageSquare,
  Bell,
  Clock,
  AlertTriangle,
  RefreshCw,
  FileText,
  Star,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { formatDateTime, formatMUR } from "@/utils/booking";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  id: string | number;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  paymentStatus: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  price: { grandTotalMUR: number };
  car?: { name: string; avGroup?: string };
  paymentMethod?: string;
  createdAt: string;
  notes?: string;
}

function statusPill(status: string): string {
  const s = String(status || "").toLowerCase();
  if (s === "confirmed") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "completed") return "bg-sky-100 text-sky-800 border-sky-200";
  if (s === "cancelled") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function getStatusIcon(status: string) {
  const s = String(status || "").toLowerCase();
  if (s === "confirmed") return <CheckCircle2 className="h-3 w-3" />;
  if (s === "completed") return <Star className="h-3 w-3" />;
  if (s === "cancelled") return <XCircle className="h-3 w-3" />;
  return <Clock className="h-3 w-3" />;
}

function MiniCard({ title, value, icon: Icon, color, trend }: { title: string; value: string | number; icon?: any; color?: string; trend?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
    >
      {Icon && <Icon className={`h-8 w-8 mb-3 ${color || "text-blue-600"}`} />}
      <div className="text-2xl font-black">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-sm text-slate-500 mt-1">{title}</div>
      {trend !== undefined && (
        <div className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
          <TrendingUp className="h-3 w-3" />
          {trend}% from last month
        </div>
      )}
    </motion.div>
  );
}

function InfoCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-semibold text-slate-900">{value || "-"}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function ActionButton({ tone, icon, label, onClick, disabled }: { tone: "emerald" | "sky" | "rose" | "amber"; icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  const tones = {
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    sky: "bg-sky-600 hover:bg-sky-700",
    rose: "bg-rose-600 hover:bg-rose-700",
    amber: "bg-amber-600 hover:bg-amber-700",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white transition-all ${tones[tone]} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function AdminBookings() {
  const { bookings, invoices, updateBookingStatus, sendWhatsAppNotification, sendEmailNotification } = useBooking();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [notificationSent, setNotificationSent] = useState<{ id: string | number; type: string } | null>(null);

  const rows = useMemo(() => {
    return (bookings as Booking[])
      .filter((b: Booking) => {
        const haystack = [
          b.reference,
          b.fullName,
          b.email,
          b.phone,
          b?.car?.name,
          b?.pickupLocation,
          b?.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const statusOk = status === "all" || String(b.status || "").toLowerCase() === status.toLowerCase();
        const paymentOk = paymentStatus === "all" || String(b.paymentStatus || "").toLowerCase() === paymentStatus.toLowerCase();

        return haystack.includes(q.toLowerCase()) && statusOk && paymentOk;
      })
      .sort((a: Booking, b: Booking) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [bookings, q, status, paymentStatus]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((b: Booking) => String(b.status).toLowerCase() === "pending").length;
    const confirmed = rows.filter((b: Booking) => String(b.status).toLowerCase() === "confirmed").length;
    const completed = rows.filter((b: Booking) => String(b.status).toLowerCase() === "completed").length;
    const cancelled = rows.filter((b: Booking) => String(b.status).toLowerCase() === "cancelled").length;
    const revenue = rows.reduce((sum: number, b: Booking) => sum + Number(b?.price?.grandTotalMUR || 0), 0);
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    return { total, pending, confirmed, completed, cancelled, revenue, conversionRate };
  }, [rows]);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const csv = [
      ["ID", "Reference", "Customer", "Email", "Phone", "Car", "Status", "Payment", "Total", "Pickup Date", "Dropoff Date", "Pickup Location", "Created At"],
      ...rows.map((b: Booking) => [
        b.id, b.reference, b.fullName, b.email, b.phone, b.car?.name, b.status, b.paymentStatus,
        b.price?.grandTotalMUR, b.pickupDate, b.dropoffDate, b.pickupLocation, new Date(b.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleSendNotification = async (booking: Booking, type: "whatsapp" | "email") => {
    const bookingId = String(booking.id);
    try {
      if (type === "whatsapp") {
        await sendWhatsAppNotification(bookingId, `Your booking ${booking.reference} is ${booking.status}. Thank you for choosing AM38 Rent a Car!`);
      } else {
        await sendEmailNotification(
          bookingId,
          `Booking ${booking.reference} Status Update`,
          `Dear ${booking.fullName},\n\nYour booking status is now ${booking.status}.\n\nBooking Details:\n- Reference: ${booking.reference}\n- Car: ${booking.car?.name}\n- Pickup: ${formatDateTime(booking.pickupDate, booking.pickupTime)}\n- Dropoff: ${formatDateTime(booking.dropoffDate, booking.dropoffTime)}\n- Total: ${formatMUR(booking.price?.grandTotalMUR || 0)}\n\nThank you for choosing AM38 Rent a Car!\n\nBest regards,\nAM38 Team`
        );
      }
      setNotificationSent({ id: booking.id, type });
      setTimeout(() => setNotificationSent(null), 3000);
    } catch (error) {
      console.error("Notification failed:", error);
      alert(`Failed to send ${type} notification`);
    }
  };

  const handleStatusUpdate = async (bookingId: string | number, newStatus: string) => {
    await updateBookingStatus(String(bookingId), newStatus as any);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Header Section with Animation */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Admin Control Panel</p>
            </div>
            <h1 className="mt-2 text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Reservations Control Board
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Manage, confirm, cancel, and monitor every booking with real-time updates and analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-blue-600" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, car..."
                className="bg-transparent outline-none min-w-[220px] text-sm"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">📋 All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="completed">🏁 Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">💰 All Payments</option>
              <option value="paid">✅ Paid</option>
              <option value="unpaid">❌ Unpaid</option>
              <option value="partial">🔄 Partial</option>
            </select>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-slate-50 transition disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid with Animations */}
      <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
        <MiniCard title="Total Bookings" value={stats.total} icon={FileText} color="text-blue-600" trend={12} />
        <MiniCard title="Pending" value={stats.pending} icon={Clock} color="text-amber-600" trend={-5} />
        <MiniCard title="Confirmed" value={stats.confirmed} icon={CheckCircle2} color="text-emerald-600" trend={8} />
        <MiniCard title="Completed" value={stats.completed} icon={Star} color="text-sky-600" trend={15} />
        <MiniCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="text-rose-600" trend={-3} />
        <MiniCard title="Revenue" value={formatMUR(stats.revenue)} icon={CreditCard} color="text-green-600" trend={10} />
        <MiniCard title="Conversion" value={`${stats.conversionRate}%`} icon={Zap} color="text-purple-600" trend={5} />
      </section>

      {/* Bookings List */}
      <section className="grid gap-5">
        <AnimatePresence>
          {rows.map((b: Booking) => {
            const inv = invoices?.find((i: any) => String(i.bookingId) === String(b.id));
            const isOverdue = new Date(b.pickupDate) < new Date() && b.status?.toLowerCase() !== "completed" && b.status?.toLowerCase() !== "cancelled";
            const showNotificationSent = notificationSent?.id === b.id;
            
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`rounded-[28px] border p-6 shadow-md hover:shadow-xl transition-all ${
                  isOverdue ? "border-amber-300 bg-amber-50/40" : "border-slate-200 bg-white"
                }`}
              >
                {/* Notification Toast */}
                {showNotificationSent && (
                  <div className="mb-3 rounded-xl bg-green-100 p-2 text-center text-sm text-green-800 animate-pulse">
                    ✅ Notification sent successfully!
                  </div>
                )}

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                        #{b.reference || `BK-${b.id}`}
                      </p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusPill(b.status)}`}>
                        {getStatusIcon(b.status)}
                        {b.status || "Pending"}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        b.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {b.paymentStatus === "paid" ? "✅ Paid" : "💰 Unpaid"}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold">
                          <AlertTriangle className="h-3 w-3" /> Overdue
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-xl font-black text-slate-950">{b?.car?.name || "Booked car"}</h2>
                    <p className="text-sm text-slate-500 mt-1">{b.fullName} • {b.email} • {b.phone}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <ActionButton
                      tone="emerald"
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      label="Confirm"
                      onClick={() => handleStatusUpdate(b.id, "confirmed")}
                      disabled={b.status?.toLowerCase() === "confirmed"}
                    />
                    <ActionButton
                      tone="sky"
                      icon={<Star className="h-4 w-4" />}
                      label="Complete"
                      onClick={() => handleStatusUpdate(b.id, "completed")}
                      disabled={b.status?.toLowerCase() === "completed"}
                    />
                    <ActionButton
                      tone="rose"
                      icon={<XCircle className="h-4 w-4" />}
                      label="Cancel"
                      onClick={() => handleStatusUpdate(b.id, "cancelled")}
                      disabled={b.status?.toLowerCase() === "cancelled"}
                    />
                    <ActionButton
                      tone="amber"
                      icon={<RotateCcw className="h-4 w-4" />}
                      label="Reopen"
                      onClick={() => handleStatusUpdate(b.id, "pending")}
                      disabled={b.status?.toLowerCase() === "pending"}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <InfoCard
                    icon={<User className="h-4 w-4 text-blue-600" />}
                    label="Customer Details"
                    value={b.fullName || "-"}
                    sub={`${b.email} | ${b.phone}`}
                  />
                  <InfoCard
                    icon={<CalendarDays className="h-4 w-4 text-blue-600" />}
                    label="Rental Period"
                    value={formatDateTime(b.pickupDate, b.pickupTime)}
                    sub={`→ ${formatDateTime(b.dropoffDate, b.dropoffTime)}`}
                  />
                  <InfoCard
                    icon={<MapPin className="h-4 w-4 text-blue-600" />}
                    label="Location"
                    value={b.pickupLocation || "SSR Airport"}
                    sub={b?.car?.avGroup || "Standard Fleet"}
                  />
                  <InfoCard
                    icon={<CreditCard className="h-4 w-4 text-blue-600" />}
                    label="Payment"
                    value={formatMUR(b?.price?.grandTotalMUR || 0)}
                    sub={`Method: ${b.paymentMethod || "pay-later"} | Inv: ${inv?.status || "pending"}`}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleSendNotification(b, "whatsapp")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-all hover:scale-105"
                  >
                    <MessageSquare className="h-4 w-4" /> WhatsApp
                  </button>
                  <button
                    onClick={() => handleSendNotification(b, "email")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-all hover:scale-105"
                  >
                    <Bell className="h-4 w-4" /> Email
                  </button>
                  <button
                    onClick={() => { setSelectedBooking(b); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-all"
                  >
                    <FileText className="h-4 w-4" /> Add Note
                  </button>
                  <button
                    onClick={() => { setSelectedBooking(b); setShowDetailsModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition-all"
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500 bg-white rounded-2xl border"
          >
            <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </section>

      {/* Add Note Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <h3 className="text-xl font-black mb-2">Add Internal Note</h3>
            <p className="text-sm text-slate-500 mb-4">Booking: {selectedBooking.reference}</p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Write internal notes here..."
              className="w-full border rounded-xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-xl hover:bg-slate-50 transition">Cancel</button>
              <button
                onClick={() => {
                  if (adminNote.trim()) {
                    alert(`Note saved for ${selectedBooking.reference}`);
                    setShowModal(false);
                    setAdminNote("");
                  } else {
                    alert("Please enter a note");
                  }
                }}
                className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-slate-800 transition"
              >
                Save Note
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[80vh] overflow-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-black">Booking Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Reference</p><p className="font-semibold">{selectedBooking.reference}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusPill(selectedBooking.status)}`}>{selectedBooking.status}</span></div>
                <div><p className="text-xs text-slate-500">Customer</p><p className="font-semibold">{selectedBooking.fullName}</p></div>
                <div><p className="text-xs text-slate-500">Contact</p><p className="font-semibold">{selectedBooking.email}<br/>{selectedBooking.phone}</p></div>
                <div><p className="text-xs text-slate-500">Car</p><p className="font-semibold">{selectedBooking.car?.name}</p></div>
                <div><p className="text-xs text-slate-500">Total Amount</p><p className="font-semibold text-emerald-600">{formatMUR(selectedBooking.price?.grandTotalMUR || 0)}</p></div>
                <div><p className="text-xs text-slate-500">Pickup</p><p>{formatDateTime(selectedBooking.pickupDate, selectedBooking.pickupTime)}<br/>{selectedBooking.pickupLocation}</p></div>
                <div><p className="text-xs text-slate-500">Dropoff</p><p>{formatDateTime(selectedBooking.dropoffDate, selectedBooking.dropoffTime)}<br/>{selectedBooking.dropoffLocation}</p></div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowDetailsModal(false)} className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-slate-800 transition">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}