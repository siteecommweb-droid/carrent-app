// frontend/src/components/hero/Hero.tsx

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  Clock3,
  Plane,
  ChevronRight,
  Hotel,
  Headphones,
  Globe,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import PersistentBookingBar from "../common/PersistentBookingBar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* DYNAMIC BACKGROUND WITH PARALLAX */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="/about-beach.avif"
          alt="Mauritius Beach"
          className="h-full w-full object-cover"
        />

        {/* MULTI-LAYER OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-blue-900/45 to-cyan-700/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
        
        {/* ANIMATED GRID OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-24">
        <div className="max-w-4xl">
          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-xl"
          >
            <Star className="h-4 w-4 text-yellow-400" />
            Mauritius Premium Car Rental Platform
          </motion.div>

          {/* TITLE - REPLACED WITH NEW TEXT */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl"
          >
            AM38 Rent a Car
            <span className="block text-red-300">
              Your Virtual Car Rental Counter
            </span>
            <span className="block text-white">
              In Mauritius
            </span>
          </motion.h1>

          {/* SUBTITLE - REPLACED WITH NEW TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl"
          >
            AM38 at your service since 2013.
            <br />
            Airport Delivery. Hotel Delivery. Islandwide Service.
            <br />
            Fast. Simple. Reliable.
          </motion.p>

          {/* CTA BUTTONS - REPLACED */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cars"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-7 py-4 font-black text-white shadow-2xl transition-all hover:shadow-red-600/25"
              >
                <span className="relative z-10">Browse Fleet</span>
                <ChevronRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-red-500 to-orange-500 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-black text-white backdrop-blur-xl transition-all hover:bg-white/20 hover:border-white/40"
              >
                Book Now
                <Sparkles className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* BOOKING BAR */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-8"
          >
            <PersistentBookingBar />
          </motion.div>

          {/* TRUST CARDS - REPLACED WITH NEW CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {[
              { icon: Plane, title: "Airport Delivery", desc: "SSR Airport meet & greet", color: "text-cyan-300" },
              { icon: Hotel, title: "Hotel Delivery", desc: "Direct to your accommodation", color: "text-cyan-300" },
              { icon: Globe, title: "Islandwide Service", desc: "Full coverage across Mauritius", color: "text-cyan-300" },
              { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock assistance", color: "text-green-400" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group rounded-2xl border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl transition-all hover:bg-white/15 hover:border-white/20"
              >
                <item.icon className={`mb-3 h-6 w-6 ${item.color} group-hover:scale-110 transition`} />
                <div className="text-sm font-bold">{item.title}</div>
                <div className="mt-1 text-xs text-white/70">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FLOATING GLOW EFFECTS */}
      <div className="absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      <div className="absolute -top-32 right-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/15 blur-3xl animate-pulse delay-1000" />
      
      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/50">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-4 rounded-full border border-white/30"
          >
            <div className="mx-auto mt-1 h-1 w-1 rounded-full bg-white/50" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}