import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, XCircle, CheckCircle2, ReceiptText, Download,
  RefreshCw, Search, AlertTriangle, Eye, Mail, DollarSign, Clock,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";
import StatCard from "@/components/admin/StatCard";

type InvoiceRow = {
  id: number;
  booking_id: number;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number | string;
  status: "pending" | "confirmed" | "paid" | "cancelled";
  created_at: string;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function money(value: any) {
  return Number(value || 0).toLocaleString("en-MU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " MUR";
}

function invoiceTone(status: string) {
  const s = status.toLowerCase();
  if (s === "paid") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "confirmed") return "bg-sky-100 text-sky-800 border-sky-200";
  if (s === "cancelled") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function pdfUrl(id: number) {
  const token = localStorage.getItem("token");
  return `${API_BASE}/invoices/${id}/pdf${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => { loadInvoices(); }, []);

  async function loadInvoices() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAPI("/invoices");
      setInvoices(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateInvoiceStatus(id: number, nextStatus: string) {
    try {
      await fetchAPI(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      await loadInvoices();
    } catch (err: any) {
      alert(err?.message || "Update failed");
    }
  }

  async function sendInvoiceEmail(id: number) {
    try {
      await fetchAPI(`/invoices/${id}/email`, { method: "POST" });
      alert("Invoice email sent!");
    } catch (err: any) {
      alert("Failed to send invoice");
    }
  }

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const hay = [inv.invoice_number, inv.customer_name, inv.customer_email, inv.status, inv.booking_id].join(" ").toLowerCase();
      const matchSearch = hay.includes(query.toLowerCase());
      const matchStatus = status === "all" || inv.status === status;
      return matchSearch && matchStatus;
    });
  }, [invoices, query, status]);

  const summary = useMemo(() => ({
    total: invoices.length,
    pending: invoices.filter((i) => i.status === "pending").length,
    confirmed: invoices.filter((i) => i.status === "confirmed").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    cancelled: invoices.filter((i) => i.status === "cancelled").length,
    value: invoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0),
  }), [invoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading invoices...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Admin finance</p>
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Invoices</h1>
              <p className="text-gray-500 mt-1">Every reservation is its own invoice — status, PDF, and email in one place.</p>
            </div>
            <button onClick={loadInvoices} className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total" value={summary.total} icon={<ReceiptText size={20} />} color="blue" compact />
          <StatCard title="Pending" value={summary.pending} icon={<Clock size={20} />} color="yellow" compact />
          <StatCard title="Confirmed" value={summary.confirmed} icon={<FileText size={20} />} color="sky" compact />
          <StatCard title="Paid" value={summary.paid} icon={<CheckCircle2 size={20} />} color="green" compact />
          <StatCard title="Cancelled" value={summary.cancelled} icon={<XCircle size={20} />} color="rose" compact />
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <DollarSign size={24} className="text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-600 font-medium">Portfolio Value</p>
                <p className="text-2xl font-black text-emerald-700">{money(summary.value)}</p>
              </div>
            </div>
            <div className="text-sm text-emerald-600">Based on {summary.total} invoices</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search invoice, customer, email, booking..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" /><p>{error}</p>
          </div>
        )}

        {!error && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <ReceiptText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No invoices found</p>
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((inv, idx) => (
              <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: idx * 0.03 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wider font-bold text-red-600">{inv.invoice_number}</p>
                    <h2 className="mt-2 text-2xl font-black text-gray-900">{inv.customer_name}</h2>
                    <div className="mt-1 text-sm text-gray-500">{inv.customer_email}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${invoiceTone(inv.status)}`}>{inv.status}</span>
                      <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">Booking #{inv.booking_id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total due</div>
                    <div className="mt-1 text-3xl font-black text-gray-900">{money(inv.total_amount)}</div>
                    <div className="mt-1 text-xs text-gray-400">Created: {new Date(inv.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => { setSelectedInvoice(inv); setShowDetailsModal(true); }} className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition"><Eye className="h-4 w-4" /> Details</button>
                  <button onClick={() => updateInvoiceStatus(inv.id, "confirmed")} className="flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700 transition"><FileText className="h-4 w-4" /> Confirm</button>
                  <button onClick={() => updateInvoiceStatus(inv.id, "paid")} className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition"><CheckCircle2 className="h-4 w-4" /> Mark Paid</button>
                  <button onClick={() => sendInvoiceEmail(inv.id)} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"><Mail className="h-4 w-4" /> Send Email</button>
                  <button onClick={() => updateInvoiceStatus(inv.id, "cancelled")} className="flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 transition"><XCircle className="h-4 w-4" /> Cancel</button>
                  <a href={pdfUrl(inv.id)} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition"><Download className="h-4 w-4" /> PDF</a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showDetailsModal && selectedInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-black">Invoice Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500">Invoice Number</label><p className="font-medium">{selectedInvoice.invoice_number}</p></div>
                <div><label className="text-xs text-gray-500">Status</label><p className="font-medium">{selectedInvoice.status}</p></div>
                <div><label className="text-xs text-gray-500">Customer</label><p className="font-medium">{selectedInvoice.customer_name}</p></div>
                <div><label className="text-xs text-gray-500">Email</label><p className="font-medium">{selectedInvoice.customer_email}</p></div>
                <div><label className="text-xs text-gray-500">Booking ID</label><p className="font-medium">#{selectedInvoice.booking_id}</p></div>
                <div><label className="text-xs text-gray-500">Total</label><p className="font-medium text-red-600">{money(selectedInvoice.total_amount)}</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}