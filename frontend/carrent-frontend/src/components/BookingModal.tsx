import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Loader2,
  CalendarDays,
  CarFront,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

import { createBooking } from "../lib/api";

export default function BookingModal({
  car,
  onClose,
}: {
  car: any;
  onClose: () => void;
}) {
  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const total = useMemo(() => {
    if (!startDate || !endDate)
      return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const days = Math.max(
      1,
      Math.ceil(
        (end.getTime() -
          start.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    return (
      days *
      Number(car?.daily_price || 0)
    );
  }, [
    startDate,
    endDate,
    car?.daily_price,
  ]);

  const handleConfirm = async () => {
    if (!startDate || !endDate) {
      setError(
        "Please select both dates."
      );

      return;
    }

    try {
      setLoading(true);

      setError("");

      await createBooking({
        car_id: car.id,
        start_datetime:
          new Date(
            startDate
          ).toISOString(),
        end_datetime:
          new Date(
            endDate
          ).toISOString(),
      });

      alert(
        "Booking created successfully!"
      );

      onClose();
    } catch (err: any) {
      if (
        err?.message?.includes(
          "already booked"
        )
      ) {
        setError(
          "This vehicle is unavailable for the selected dates."
        );
      } else {
        setError(
          err?.message ||
            "Booking failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="w-full max-w-[500px] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"
      >
        <div className="relative bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-6 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />

          <div className="relative z-10 flex items-center gap-4">
            <img
              src={`/cars/${
                car?.image ||
                "swift.jpg"
              }`}
              alt={car?.name}
              className="h-20 w-28 rounded-2xl object-cover shadow-xl"
            />

            <div>
              <div className="flex items-center gap-2">
                <CarFront
                  size={18}
                />

                <h2 className="text-2xl font-black">
                  {car?.make}{" "}
                  {car?.model}
                </h2>
              </div>

              <p className="mt-1 text-sm text-white/80">
                Premium Mauritius
                rental experience
              </p>

              <div className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                Rs{" "}
                {Number(
                  car?.daily_price || 0
                ).toLocaleString()}
                /day
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                <CalendarDays
                  size={14}
                />
                Pickup Date
              </label>

              <input
                type="date"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                <CalendarDays
                  size={14}
                />
                Return Date
              </label>

              <input
                type="date"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                  Estimated Total
                </div>

                <div className="mt-1 text-3xl font-black text-black">
                  Rs{" "}
                  {Number(
                    total
                  ).toLocaleString()}
                </div>
              </div>

              <ShieldCheck className="h-10 w-10 text-cyan-500" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle
                className="h-5 w-5"
              />

              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-black text-white transition hover:bg-cyan-500 hover:text-black disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>

          <button
            onClick={onClose}
            className="h-12 w-full rounded-2xl border border-black/10 text-sm font-bold transition hover:bg-black/5"
          >
            Cancel
          </button>

          <p className="text-center text-xs text-black/40">
            Secure booking • Invoice
            generation • QR verification
          </p>
        </div>
      </motion.div>
    </div>
  );
}