import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  CalendarDays,
  MapPin,
  CarFront,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Clock3,
  Plane,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LOCATION_SUGGESTIONS = [
  "SSR International Airport",
  "Grand Baie",
  "Port Louis",
  "Flic en Flac",
  "Le Morne",
  "Trou aux Biches",
  "Belle Mare",
  "Hotel delivery",
  "Curepipe",
  "Ebene",
  "Tamarin",
];

const VEHICLE_OPTIONS = [
  "All vehicles",
  "Economy",
  "SUV",
  "Hybrid",
  "Luxury",
  "Family",
  "7 Seater",
  "Convertible",
];

function todayString(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);

  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function PersistentBookingBar() {
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState(
    "SSR International Airport"
  );

  const [pickupDate, setPickupDate] = useState(todayString());

  const [returnDate, setReturnDate] = useState(
    addDays(todayString(), 3)
  );

  const [vehicleType, setVehicleType] =
    useState("All vehicles");

  const [showLocationMenu, setShowLocationMenu] =
    useState(false);

  const [showVehicleMenu, setShowVehicleMenu] =
    useState(false);

  const [isExpanded, setIsExpanded] = useState(true);

  const locationBoxRef = useRef<HTMLDivElement>(null);

  const vehicleBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        locationBoxRef.current &&
        !locationBoxRef.current.contains(
          event.target as Node
        )
      ) {
        setShowLocationMenu(false);
      }

      if (
        vehicleBoxRef.current &&
        !vehicleBoxRef.current.contains(
          event.target as Node
        )
      ) {
        setShowVehicleMenu(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const filteredLocations = useMemo(() => {
    const query = pickupLocation.trim().toLowerCase();

    if (!query) {
      return LOCATION_SUGGESTIONS;
    }

    return LOCATION_SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(query)
    );
  }, [pickupLocation]);

  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate);

    const end = new Date(returnDate);

    const diffTime = Math.abs(
      end.getTime() - start.getTime()
    );

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    return diffDays || 1;
  }, [pickupDate, returnDate]);

  const savings =
    rentalDays >= 7
      ? "🎉 Weekly booking discount unlocked!"
      : rentalDays >= 3
      ? "💡 Extended rental savings active!"
      : null;

  const estimatedPrice = useMemo(() => {
    const base = 1400;

    return base * rentalDays;
  }, [rentalDays]);

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const params = new URLSearchParams({
      pickup: pickupLocation,
      pickupDate,
      returnDate,
      vehicleType,
    });

    navigate(`/cars?${params.toString()}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-3 flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-xl lg:hidden"
      >
        <div className="flex items-center gap-2">
          <CarFront className="h-5 w-5 text-red-500" />

          <span className="font-black text-black">
            Smart Booking
          </span>
        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {(isExpanded ||
          typeof window === "undefined" ||
          window.innerWidth >= 1024) && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="grid gap-3 rounded-[32px] border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.8fr_1fr_1fr_1fr_auto]"
          >
            {/* LOCATION */}
            <div
              ref={locationBoxRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setShowLocationMenu(
                    !showLocationMenu
                  )
                }
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-red-300 hover:shadow-md"
              >
                <MapPin className="h-5 w-5 text-red-500" />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Pick-up location
                  </p>

                  <input
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(
                        e.target.value
                      );

                      setShowLocationMenu(true);
                    }}
                    onFocus={() =>
                      setShowLocationMenu(true)
                    }
                    placeholder="Airport or hotel"
                    className="w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                  />
                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {showLocationMenu && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-72 overflow-auto rounded-2xl border bg-white p-2 shadow-2xl"
                  >
                    {filteredLocations.map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setPickupLocation(
                              item
                            );

                            setShowLocationMenu(
                              false
                            );
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          <MapPin className="h-4 w-4 text-red-500" />

                          {item}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PICKUP */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <CalendarDays className="h-5 w-5 text-red-500" />

              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Pick-up
                </p>

                <input
                  type="date"
                  value={pickupDate}
                  min={todayString()}
                  onChange={(e) =>
                    setPickupDate(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-sm font-black outline-none"
                />
              </div>
            </div>

            {/* RETURN */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <CalendarDays className="h-5 w-5 text-red-500" />

              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Return
                </p>

                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) =>
                    setReturnDate(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-sm font-black outline-none"
                />
              </div>
            </div>

            {/* VEHICLE */}
            <div
              ref={vehicleBoxRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setShowVehicleMenu(
                    !showVehicleMenu
                  )
                }
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-red-300 hover:shadow-md"
              >
                <CarFront className="h-5 w-5 text-red-500" />

                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Vehicle
                  </p>

                  <p className="truncate text-sm font-black text-slate-900">
                    {vehicleType}
                  </p>
                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {showVehicleMenu && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-2xl border bg-white p-2 shadow-2xl"
                  >
                    {VEHICLE_OPTIONS.map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setVehicleType(
                              item
                            );

                            setShowVehicleMenu(
                              false
                            );
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                            vehicleType === item
                              ? "bg-red-50 font-black text-red-600"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <CarFront className="h-4 w-4" />

                          {item}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-6 py-4 text-base font-black text-white transition hover:scale-[1.03] hover:shadow-2xl"
            >
              <Search className="h-5 w-5" />

              Search Cars
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FOOTER STATS */}
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
          <Plane className="h-4 w-4 text-cyan-300" />
          <span className="text-sm font-semibold">
            Airport Delivery
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
          <ShieldCheck className="h-4 w-4 text-green-300" />
          <span className="text-sm font-semibold">
            Secure Payments
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
          <Clock3 className="h-4 w-4 text-yellow-300" />
          <span className="text-sm font-semibold">
            Instant Booking
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
          <TrendingUp className="h-4 w-4 text-pink-300" />
          <span className="text-sm font-semibold">
            Est. MUR{" "}
            {estimatedPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* SAVINGS */}
      {savings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-white shadow-lg"
        >
          <Sparkles className="h-5 w-5" />

          <span className="font-bold">
            {savings}
          </span>

          <TrendingUp className="h-5 w-5" />
        </motion.div>
      )}
    </motion.div>
  );
}