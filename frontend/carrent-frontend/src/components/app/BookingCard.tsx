import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock,
  Copy,
  ExternalLink,
  CalendarDays,
  Car,
  MapPin,
  Wallet,
  Share2,
  ShieldCheck,
  Plane,
  Star,
  MessageCircle,
  Fuel,
  CloudSun,
  QrCode,
  TimerReset,
  Sparkles,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

export type BookingCardData = {
  id: number;
  car_id: number;
  make?: string;
  model?: string;
  daily_price?: number;
  start_datetime: string;
  end_datetime: string;
  total_price: number;
  status: string;

  car_image?: string;

  pickup_location?: string;
  dropoff_location?: string;

  reward_points?: number;

  payment_status?: string;

  weather?: string;

  tourist_tip?: string;
};

function formatDate(d: string) {
  const dt = new Date(d);

  if (Number.isNaN(dt.getTime())) return d;

  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysBetween(a: string, b: string) {
  const A = new Date(a).getTime();
  const B = new Date(b).getTime();

  if (Number.isNaN(A) || Number.isNaN(B)) return 0;

  const ms = Math.max(0, B - A);

  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function getCountdown(date: string) {
  const now = new Date().getTime();
  const future = new Date(date).getTime();

  const diff = future - now;

  if (diff <= 0) return "Trip started";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  return `${days}d ${hours}h remaining`;
}

function StatusPill({ status }: { status: string }) {
  const s = (status || "").toLowerCase();

  const cls =
    s === "confirmed"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/30"
      : s === "pending"
      ? "bg-yellow-500/10 text-yellow-700 border-yellow-400/30"
      : "bg-slate-500/10 text-slate-600 border-slate-400/30";

  const Icon = s === "confirmed" ? BadgeCheck : Clock;

  return (
    <motion.div
      animate={{
        scale: [1, 1.03, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
      }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border backdrop-blur-md ${cls}`}
    >
      <Icon className="h-4 w-4" />

      {s ? s.toUpperCase() : "UNKNOWN"}
    </motion.div>
  );
}

export function BookingCard({
  booking,
  onViewCar,
}: {
  booking: BookingCardData;
  onViewCar?: (carId: number) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const i = setInterval(() => {
      setCountdown(getCountdown(booking.start_datetime));
    }, 1000);

    return () => clearInterval(i);
  }, [booking.start_datetime]);

  if (!booking) return null;

  const days = daysBetween(
    booking.start_datetime,
    booking.end_datetime
  );

  const carLabel =
    booking.make && booking.model
      ? `${booking.make} ${booking.model}`
      : `Car #${booking.car_id}`;

  const dailyLabel =
    typeof booking.daily_price === "number"
      ? `${Number(booking.daily_price).toLocaleString()} MUR/day`
      : null;

  const touristTip = useMemo(() => {
    return (
      booking.tourist_tip ||
      "Drive through Le Morne & Chamarel for the best sunset route in Mauritius."
    );
  }, [booking.tourist_tip]);

  const copy = async (txt: string, type: string) => {
    try {
      await navigator.clipboard.writeText(txt);

      setCopied(type);

      setTimeout(() => setCopied(null), 2000);
    } catch {
      //
    }
  };

  const shareBooking = () => {
    const text = `My AM38 booking #${booking.id} for ${carLabel}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-[32px] border border-white/20 bg-white/80 backdrop-blur-2xl shadow-2xl"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand.blue/10 via-white to-brand.red/10 pointer-events-none" />

      {/* TOP GLOW */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand.blue via-white to-brand.red" />

      {/* HERO IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={
            booking.car_image ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600"
          }
          alt={carLabel}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* STATUS */}
        <div className="absolute top-5 right-5">
          <StatusPill status={booking.status} />
        </div>

        {/* COUNTDOWN */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="absolute bottom-5 left-5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-2 text-white"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
            <TimerReset className="h-4 w-4" />
            Trip Countdown
          </div>

          <div className="font-black text-lg">
            {countdown}
          </div>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative p-6">
        {/* TITLE */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-2xl font-black text-black">
                {carLabel}
              </div>

              <motion.div
                animate={{
                  rotate: [0, 12, -12, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              >
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </motion.div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-black/60">
              <span className="inline-flex items-center gap-1">
                <Car className="h-4 w-4" />
                Car ID #{booking.car_id}
              </span>

              <span>•</span>

              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {days} day(s)
              </span>

              {dailyLabel && (
                <>
                  <span>•</span>

                  <span>{dailyLabel}</span>
                </>
              )}
            </div>
          </div>

          {/* PRICE */}
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-black/40">
              Total
            </div>

            <div className="text-3xl font-black text-emerald-600">
              {Number(
                booking.total_price || 0
              ).toLocaleString()}{" "}
              MUR
            </div>

            <div className="mt-1 text-xs text-black/50">
              {booking.payment_status || "Deposit secured"}
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4">
            <div className="text-xs text-black/50 uppercase">
              Pickup
            </div>

            <div className="mt-1 font-bold text-black">
              {formatDate(booking.start_datetime)}
            </div>

            <div className="mt-2 text-sm text-black/60 flex items-center gap-2">
              <MapPin className="h-4 w-4" />

              {booking.pickup_location || "SSR Airport"}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4">
            <div className="text-xs text-black/50 uppercase">
              Dropoff
            </div>

            <div className="mt-1 font-bold text-black">
              {formatDate(booking.end_datetime)}
            </div>

            <div className="mt-2 text-sm text-black/60 flex items-center gap-2">
              <MapPin className="h-4 w-4" />

              {booking.dropoff_location || "Grand Baie"}
            </div>
          </div>
        </div>

        {/* TOURIST SMART BLOCK */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mt-6 rounded-3xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-5"
        >
          <div className="flex items-start gap-3">
            <Plane className="h-6 w-6 text-orange-500 mt-1" />

            <div>
              <div className="font-black text-black">
                Mauritius Smart Travel Tip
              </div>

              <div className="mt-1 text-sm text-black/70">
                {touristTip}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-black/60">
                <span className="inline-flex items-center gap-1">
                  <CloudSun className="h-4 w-4" />

                  {booking.weather || "26°C Sunny"}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Fuel className="h-4 w-4" />

                  Fuel stations nearby
                </span>

                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />

                  Tourist protected
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* REWARD */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3 rounded-2xl border border-brand.blue/10 bg-brand.blue/5 p-4">
          <div>
            <div className="text-xs uppercase text-black/40">
              Loyalty Rewards
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />

              <span className="font-black text-lg">
                {booking.reward_points || 1250} pts
              </span>
            </div>
          </div>

          <div className="text-sm text-black/60">
            Earn more by extending your trip.
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-5 py-3 text-sm font-bold hover:scale-[1.02] transition"
            onClick={() => onViewCar?.(booking.car_id)}
          >
            <ExternalLink className="h-4 w-4" />
            View Vehicle
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/5 transition"
            onClick={() => shareBooking()}
          >
            <Share2 className="h-4 w-4" />
            WhatsApp Share
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/5 transition"
            onClick={() => copy(String(booking.id), "booking")}
          >
            <Copy className="h-4 w-4" />

            {copied === "booking"
              ? "Copied!"
              : "Copy Booking"}
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/5 transition"
          >
            <QrCode className="h-4 w-4" />
            QR Ticket
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/5 transition"
          >
            <Wallet className="h-4 w-4" />
            Invoice
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
          >
            <MessageCircle className="h-4 w-4" />
            Live Support
          </button>
        </div>
      </div>
    </motion.div>
  );
}