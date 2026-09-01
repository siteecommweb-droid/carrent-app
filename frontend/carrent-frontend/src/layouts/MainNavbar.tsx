import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Globe, Menu, X } from "lucide-react";
import { useState } from "react";

export default function MainNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Fleet", path: "/cars" },
    { name: "Explore", path: "/explore" },
    { name: "Partners", path: "/partners" },
    { name: "FAQ", path: "/faq" },
    { name: "About", path: "/about" },
    { name: "Support", path: "/support" },
  ];

  const scrollToBooking = () => {
    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LEFT LOGO - 3D AM38 */}
        <Link to="/" className="flex items-center gap-4 group">
          <motion.div
            whileHover={{ rotateY: 12, rotateX: 8, scale: 1.04 }}
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-red-500 to-blue-700 flex items-center justify-center shadow-2xl overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-white font-black text-3xl">A</span>
              <span className="text-[9px] text-white/80 font-bold -mt-1">38</span>
            </div>
            <Car className="absolute bottom-1 right-1 w-3 h-3 text-white/40" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
              AM38
            </h1>
            <p className="text-[10px] tracking-[0.3em] text-white/40 font-bold">PREMIUM MAURITIUS</p>
          </div>
        </Link>

        {/* CENTER NAVIGATION - DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative text-sm font-semibold transition-all duration-300"
              >
                <span className={active ? "text-white" : "text-white/60 hover:text-white"}>
                  {item.name}
                </span>
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-amber-400 via-red-500 to-blue-500"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE - DESKTOP */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition flex items-center gap-2">
            <Globe className="w-4 h-4" />
            English
          </button>
          <Link to="/login" className="px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/10 transition">
            Login
          </Link>
          <Link to="/register" className="px-7 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 shadow-2xl hover:scale-105 transition-all">
            Register
          </Link>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(59,130,246,0.8)" }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToBooking}
            className="relative overflow-hidden px-8 py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 shadow-2xl border border-cyan-300/30 flex items-center gap-3"
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <Car className="w-5 h-5 relative z-10" />
            <span className="relative z-10">BOOK NOW</span>
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }} className="relative z-10">
              →
            </motion.span>
          </motion.button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white p-2 rounded-lg bg-white/10">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-20 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 p-5"
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-white/10">
              <Link to="/login" className="flex-1 text-center px-4 py-3 border border-white/20 rounded-xl text-white">Login</Link>
              <Link to="/register" className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl text-white font-bold">Register</Link>
            </div>
            <button
              onClick={scrollToBooking}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" /> BOOK NOW
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}