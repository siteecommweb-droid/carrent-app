import {
  BadgeCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Plane,
  Star,
  CarFront,
  Globe,
  Fuel,
  CloudSun,
  Navigation,
  Shield,
  Zap,
  HeartHandshake,
  ChevronRight,
} from "lucide-react";

import PersistentBookingBar from "../common/PersistentBookingBar";

import { motion } from "framer-motion";

const heroBadges = [
  "Airport delivery",
  "Luxury fleet",
  "24/7 support",
  "Free cancellation",
  "Instant confirmation",
  "Mauritius island-wide coverage",
];

const quickStats = [
  {
    title: "Airport Pickup",
    text: "SSR Airport fast handover",
    icon: Plane,
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "Trusted & Secure",
    text: "Fully verified vehicles",
    icon: Shield,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Luxury Experience",
    text: "Premium Mauritius travel",
    icon: Sparkles,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Smart Booking",
    text: "AI-powered reservation flow",
    icon: Zap,
    color: "from-purple-500 to-pink-600",
  },
];

const floatingDestinations = [
  "Le Morne",
  "Chamarel",
  "Grand Baie",
  "Flic-en-Flac",
  "Belle Mare",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND VIDEO/IMAGE */}
      <div className="absolute inset-0">
        <img
          src="/about-beach.avif"
          alt="Mauritius coastal road"
          className="h-full w-full object-cover scale-105"
        />

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00112c]/90 via-black/55 to-[#8b0000]/75" />

        <div className="absolute inset-0 bg-black/25" />

        {/* GLOW EFFECTS */}
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-red-500/20 blur-3xl" />
      </div>

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i,
            }}
            className="absolute h-2 w-2 rounded-full bg-white/30"
            style={{
              left: `${i * 5}%`,
              top: `${(i % 5) * 20}%`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-xl">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="h-3 w-3 rounded-full bg-green-400"
            />

            LIVE • Mauritius Smart Rental Platform
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              4.9/5 reviews
            </div>

            <div className="flex items-center gap-2">
              <CarFront className="h-4 w-4" />
              50+ vehicles
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Multilingual support
            </div>
          </div>
        </motion.div>

        {/* HERO */}
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-xl">
              ✨ Premium Mauritius Booking Experience
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] text-white md:text-7xl">
              Explore Mauritius
              <span className="bg-gradient-to-r from-blue-300 via-white to-red-300 bg-clip-text text-transparent">
                {" "}
                in luxury.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              AM38 transforms your island journey into a premium smart travel
              experience with airport delivery, AI booking, luxury fleet
              management, live support, and transparent pricing.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-black text-black shadow-2xl transition"
              >
                Book Your Car

                <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-xl"
              >
                <Navigation className="h-5 w-5" />
                Explore Mauritius
              </motion.button>
            </div>

            {/* BADGES */}
            <div className="mt-8 flex flex-wrap gap-3">
              {heroBadges.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl"
                >
                  {item}
                </motion.div>
              ))}
            </div>

            {/* LIVE DESTINATIONS */}
            <div className="mt-10 flex flex-wrap gap-3">
              {floatingDestinations.map((place) => (
                <motion.div
                  key={place}
                  whileHover={{
                    y: -2,
                  }}
                  className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/85 backdrop-blur-xl"
                >
                  📍 {place}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* FLOATING CARD */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-red-500/10" />

              {/* BOOKING BAR */}
              <div className="relative z-10">
                <PersistentBookingBar />
              </div>

              {/* STATS */}
              <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2">
                {quickStats.map((item, idx) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.4 + idx * 0.1,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className="rounded-3xl border border-white/15 bg-black/20 p-5 text-white backdrop-blur-xl"
                    >
                      <div
                        className={`inline-flex rounded-2xl bg-gradient-to-r ${item.color} p-3`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="mt-4">
                        <div className="font-black">
                          {item.title}
                        </div>

                        <div className="mt-1 text-sm text-white/75">
                          {item.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* LIVE INFO */}
              <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-black/20 p-5 text-white backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <CloudSun className="h-6 w-6 text-yellow-300" />

                  <div>
                    <div className="text-sm text-white/70">
                      Mauritius Weather
                    </div>

                    <div className="font-black">
                      27°C • Perfect beach weather
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Fuel className="h-6 w-6 text-emerald-300" />

                  <div>
                    <div className="text-sm text-white/70">
                      Fuel Tracker
                    </div>

                    <div className="font-black">
                      Nearby stations available
                    </div>
                  </div>
                </div>
              </div>

              {/* TRUST */}
              <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-6 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  5+ island locations
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Flexible booking
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  24/7 support
                </div>

                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4" />
                  Trusted local service
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}