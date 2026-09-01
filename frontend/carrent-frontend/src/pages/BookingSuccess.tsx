// src/pages/BookingSuccess.tsx
// 🔥 ELITE VERSION — FULLY FIXED — NO SYNTAX ERRORS

import { useParams, Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { useMemo, useEffect, useState } from "react";
import { generateInvoice } from "@/utils/generateInvoice";
import type { BookingRecord } from "@/types/booking";
import { motion } from "framer-motion";

import {
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  Clock3,
  CarFront,
  Share2,
  Calendar,
  Phone,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function BookingSuccess() {
  const { id } = useParams();
  const { bookings, invoices, markInvoicePaid } = useBooking();
  const [isDownloading, setIsDownloading] = useState(false);

  const booking = useMemo(
    () => bookings.find((b: BookingRecord) => String(b.id) === String(id)),
    [bookings, id]
  );

  const invoice = useMemo(
    () => invoices.find((inv) => String(inv.bookingId) === String(id)),
    [invoices, id]
  );

  useEffect(() => {
    if (!booking || !invoice) return;

    if (booking.paymentMethod === "pay-now" && invoice.status !== "paid") {
      markInvoicePaid(booking.id);
    }
  }, [booking, invoice, markInvoicePaid]);

  const handleDownloadInvoice = async () => {
    if (!booking) return;
    setIsDownloading(true);
    try {
      await generateInvoice(booking);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!booking || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900">Booking Not Found</h2>
          <p className="text-gray-500 mt-2">We couldn't find your booking details.</p>
          <Link to="/cars" className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ✅ SUCCESS HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Booking Confirmed!
          </h1>

          <p className="text-gray-600 max-w-md mx-auto">
            Your reservation is secured. A confirmation email has been sent to your inbox.
          </p>
        </motion.div>

        {/* 🔥 MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT — BOOKING DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-4">
              <CarFront className="text-red-500" size={20} />
              Booking Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono font-bold">{booking.reference}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium">{booking.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Vehicle:</span>
                <span className="font-medium">{booking.car?.name || "Car"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-bold text-red-600">MUR {booking.price?.grandTotalMUR?.toLocaleString() || 0}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 bg-green-50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-green-800 flex items-center gap-2">✓ Free cancellation available</p>
              <p className="text-sm text-green-800 flex items-center gap-2">✓ No hidden fees</p>
              <p className="text-sm text-green-800 flex items-center gap-2">✓ Instant confirmation</p>
            </div>
          </motion.div>

          {/* RIGHT — INVOICE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-4">
              <ShieldCheck className="text-green-500" size={20} />
              Invoice
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Invoice Number:</span>
                <span className="font-mono">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Status:</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                  invoice.status === "paid" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              {isDownloading ? "Generating..." : "Download Invoice"}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secure document generated instantly
            </p>
          </motion.div>
        </div>

        {/* 🚀 ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Link
            to="/cars"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition"
          >
            Browse More Cars <ArrowRight size={18} />
          </Link>

          <Link
            to="/my-bookings"
            className="flex items-center justify-center gap-2 border-2 border-gray-200 bg-white py-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            View My Bookings
          </Link>
        </motion.div>

        {/* 🔥 SUPPORT & SHARE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Phone size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Need help?</p>
                <p className="font-semibold">24/7 Support</p>
              </div>
            </div>
            <a
              href="https://wa.me/23058357166"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>

          <div className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Add to calendar</p>
                <p className="font-semibold">Reminder</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm">
              <Calendar size={16} /> Add
            </button>
          </div>
        </motion.div>

        {/* 🔥 CONFIDENCE BLOCK */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white border rounded-2xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <ShieldCheck size={24} className="mx-auto text-green-500 mb-2" />
              <p className="text-xs text-gray-600">Secure payment system</p>
            </div>
            <div>
              <Clock3 size={24} className="mx-auto text-blue-500 mb-2" />
              <p className="text-xs text-gray-600">24/7 support available</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Share2 size={24} className="mx-auto text-purple-500 mb-2" />
              <p className="text-xs text-gray-600">Share your trip</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}