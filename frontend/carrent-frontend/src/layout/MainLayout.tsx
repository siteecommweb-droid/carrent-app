import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next"; // ✅ ADDED

import {
  Menu,
  X,
  Car,
  User,
  LogOut,
  Calendar,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useAuth } from "../context/AuthContext";

import Footer from "./Footer";

const SPECIAL_DAYS: Record<string, string> = {
  "01-01": "🎉 Happy New Year",
  "02-14": "💝 Happy Valentine's Day",
  "03-08": "🌸 Happy Women's Day",
  "03-12": "🇲🇺 Happy Independence Day",
  "12-24": "🎄 Happy Christmas Eve",
  "12-25": "🎄 Merry Christmas",
  "12-31": "🎆 Happy New Year's Eve",
  "10-31": "🎃 Happy Halloween",
  "11-02": "🪔 Happy Diwali",
};

function getGreeting(name: string) {
  const now = new Date();
  const hour = now.getHours();
  const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const special = SPECIAL_DAYS[mmdd];

  const timeGreeting =
    hour < 5 ? "Still up" :
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    hour < 21 ? "Good evening" : "Good night";

  return special ? `${special}, ${name}!` : `${timeGreeting}, ${name}`;
}

function getGoodbye(name: string) {
  const hour = new Date().getHours();
  const lines = hour < 12
    ? [`Bye ${name}, enjoy your day!`, `See you soon, ${name} 👋`]
    : hour < 18
    ? [`Bye ${name}, have a great afternoon!`, `See you soon, ${name} 👋`]
    : [`Bye ${name}, sleep well 🌙`, `See you soon, ${name} 👋`];
  return lines[Math.floor(Math.random() * lines.length)];
}

export default function MainLayout() {

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const location = useLocation();

  // ✅ Translation hook
  const { t, i18n } = useTranslation();

  const displayName = useMemo(() => {
    if (!user) return "";
    const full = user.full_name || user.name || user.email || "";
    return full.split(" ")[0] || full;
  }, [user]);

  // ✅ Updated navItems with translations
  const navItems = [
    { path: "/", label: t("nav.home", "Home") },
    { path: "/cars", label: t("nav.fleet") },
    { path: "/explore", label: t("nav.explore") },
    { path: "/partners", label: t("nav.partners") },
    { path: "/faq", label: t("nav.faq") },
    { path: "/about", label: t("nav.about") },
    { path: "/support", label: t("nav.support") },
  ];

  function handleLogout() {
    if (user) {
      const bye = getGoodbye(displayName);
      logout();
      setTimeout(() => {
        try {
          const { default: toast } = require("react-hot-toast");
          toast.success(bye);
        } catch {}
      }, 50);
    } else {
      logout();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative bg-black">

      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        <img
          src="/vitara_image.jpg"
          alt="AM38 Vitara"
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-[0.45]"
        />

        {/* FRENCH FLAG CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-black/50 to-red-950/85" />

        {/* DARK DEPTH */}
        <div className="absolute inset-0 bg-black/25" />

        {/* ANIMATED LIGHT PASS */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[9999] backdrop-blur-2xl bg-black/45 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-4 group"
          >

            <motion.div
              whileHover={{
                rotate: 4,
                scale: 1.08,
              }}
              className="relative"
            >

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-cyan-400 to-red-500 blur-xl opacity-70 group-hover:opacity-100 transition" />

              <div className="relative h-14 w-14 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-red-500 flex items-center justify-center border border-white/30 shadow-[0_20px_60px_rgba(37,99,235,0.45)]">
                <Car className="w-7 h-7 text-white" />
              </div>

            </motion.div>

            <div className="leading-none">

              <div className="text-4xl font-black tracking-[0.12em] bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.75)]">
                AM38
              </div>

              <div className="text-[11px] uppercase tracking-[0.45em] text-white/60 mt-1">
                Mauritius Mobility
              </div>

            </div>

          </Link>

          {/* CENTER MENU */}
          <div className="hidden lg:flex items-center gap-3 relative">

            {navItems.map((item) => (

              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-3 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-[0_18px_70px_rgba(37,99,235,0.45)]"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>

            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-4">

            {/* ✅ LANGUAGE SWITCHER – inserted here */}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/20 outline-none"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
              <option value="it">🇮🇹 IT</option>
              <option value="hi">🇮🇳 HI</option>
            </select>

            <Link
              to={user ? "/cars" : "/login"}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-[0_18px_70px_rgba(37,99,235,0.55)] hover:scale-105 transition-all"
            >
              <Car className="w-5 h-5" />
              Book Now
            </Link>

            {user ? (
              <>

                <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center gap-3">

                  <User className="w-4 h-4 text-cyan-300 flex-shrink-0" />

                  <span className="font-bold text-sm whitespace-nowrap">
                    {getGreeting(displayName)}
                  </span>

                </div>

                {/* 👇 MY TRIPS BUTTON */}
                <Link
                  to="/my-reservations"
                  className="px-5 py-3 rounded-2xl bg-blue-600 font-black flex items-center gap-2 hover:bg-blue-500 transition text-white"
                >
                  <Calendar className="w-4 h-4" />
                  My Trips
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-5 py-3 rounded-2xl bg-red-600 font-black flex items-center gap-2 hover:bg-red-500 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>

              </>
            ) : (
              <>

                <Link
                  to="/login"
                  className="px-5 py-3 rounded-2xl font-black hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:scale-105 transition"
                >
                  Register
                </Link>

              </>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>

          {open && (

            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              className="lg:hidden overflow-hidden bg-black/95 border-t border-white/10"
            >

              <div className="px-6 py-6 flex flex-col gap-4">

                {user && (
                  <>
                    <div className="px-4 py-3 rounded-xl bg-white/10 font-bold text-sm">
                      {getGreeting(displayName)}
                    </div>
                    {/* 👇 MY TRIPS - MOBILE */}
                    <Link
                      to="/my-reservations"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl bg-blue-600 font-black text-center text-white"
                    >
                      🚗 My Trips
                    </Link>
                  </>
                )}

                {navItems.map((item) => (

                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="font-bold"
                  >
                    {item.label}
                  </Link>

                ))}

                <Link
                  to={user ? "/cars" : "/login"}
                  className="px-6 py-4 rounded-2xl font-black text-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"
                >
                  🚗 Book Now
                </Link>

                {!user ? (
                  <>
                    <Link to="/login">
                      Login
                    </Link>

                    <Link to="/register">
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="px-6 py-4 rounded-2xl font-black text-center bg-red-600"
                  >
                    Logout
                  </button>
                )}

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </nav>

      {/* MAIN */}
      <main className="relative z-10 pt-28">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}