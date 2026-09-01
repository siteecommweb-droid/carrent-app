import {
  CalendarDays,
  CarFront,
  BadgeCheck,
} from "lucide-react";

import { motion } from "framer-motion";

export default function BookingCard({
  booking,
}: {
  booking: any;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border bg-white p-5 shadow-sm transition-all hover:shadow-xl"
    >
      <div className="flex items-center gap-3 text-lg font-black text-slate-900">
        <div className="rounded-xl bg-blue-50 p-2 text-[#165db8]">
          <CarFront className="h-5 w-5" />
        </div>

        <div>
          {booking.make} {booking.model}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-black/70">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {booking.start_datetime}
        </div>

        <div>
          Return: {booking.end_datetime}
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-green-600" />
          {booking.status}
        </div>
      </div>

      <div className="mt-5 text-2xl font-black text-slate-900">
        MUR{" "}
        {Number(
          booking.final_price || 0
        ).toLocaleString()}
      </div>
    </motion.div>
  );
}