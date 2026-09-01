import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock3,
  BellRing,
  CarFront,
  UserRound,
  Radio,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

interface BookingItem {
  id: number;
  customer_name?: string;
  make?: string;
  model?: string;
  plate_number?: string;
  status?: string;
  total_price?: number;
  created_at?: string;
}

export default function BookingTicker({
  items,
}: {
  items: BookingItem[];
}) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white shadow-xl overflow-hidden">
      {/* HEADER */}
      <div className="px-5 py-4 border-b bg-gradient-to-r from-brand.blue via-black to-brand.red text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="w-3 h-3 rounded-full bg-green-400 shadow-lg"
            />

            <div>
              <div className="font-black text-sm uppercase tracking-wide">
                Live Booking Ticker
              </div>

              <div className="text-xs text-white/70 flex items-center gap-2">
                <Radio size={12} />
                Real-time reservations feed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
            <BellRing size={14} />
            Auto-updating
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-h-[420px] overflow-auto bg-gradient-to-b from-white to-slate-50">
        <AnimatePresence>
          {items?.length ? (
            items.map((x, idx) => (
              <motion.div
                key={`${x.id}-${idx}`}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.04,
                }}
                className="group px-5 py-4 border-b hover:bg-white transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* LIVE ICON */}
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="absolute inset-0 rounded-full bg-green-400 blur-md"
                    />

                    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-brand.blue to-brand.red flex items-center justify-center text-white shadow-lg">
                      <CarFront size={20} />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-black">
                            #{x.id}
                          </span>

                          <span className="text-sm font-semibold text-black/80 flex items-center gap-1">
                            <UserRound size={14} />
                            {x.customer_name || "Guest"}
                          </span>
                        </div>

                        <div className="mt-1 text-sm text-black/70">
                          {x.make || "Vehicle"} {x.model || ""}
                        </div>

                        <div className="mt-1 text-xs text-black/50">
                          Plate: {x.plate_number || "AM38"}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={x.status || "pending"} />

                        {x.total_price ? (
                          <div className="text-sm font-black text-emerald-600">
                            Rs {Number(x.total_price).toLocaleString()}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-3 flex items-center justify-between text-xs text-black/40">
                      <div className="flex items-center gap-1">
                        <Clock3 size={12} />

                        {x.created_at
                          ? new Date(x.created_at).toLocaleString()
                          : "Just now"}
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition">
                        LIVE UPDATE
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center">
              <div className="text-lg font-bold text-black/60">
                No live bookings yet
              </div>

              <div className="mt-2 text-sm text-black/40">
                Incoming reservations will appear here automatically.
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}