import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Search,
  Heart,
  Sun,
  Car,
  Home,
  Info,
  Phone,
  HelpCircle,
  Users,
  Settings,
  Shield,
  ShieldCheck,
  Award,
  Map,
  Calendar,
  Bell,
  Globe,
  Sparkles,
  Plane,
  Navigation,
  Zap,
  Clock3,
  ChevronRight,
  MessageCircle,
  Crown,
} from "lucide-react";

import CurrencySelect from "@/layout/CurrencySelect";

import { useAuth } from "@/lib/auth-context";

import NProgress from "nprogress";

import "nprogress/nprogress.css";

/* ================= UTILS ================= */
NProgress.configure({
  showSpinner: false,
  easing: "ease",
  speed: 500,
  minimum: 0.15,
  trickleSpeed: 180,
});

function cx(
  ...cls: Array<
    string | false | null | undefined
  >
) {
  return cls.filter(Boolean).join(" ");
}

/* ================= NAVBAR ================= */

export default function Navbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const { user, logout } = useAuth();

  const [open, setOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [wishlist, setWishlist] =
    useState(2);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [liveVisitors] =
    useState(124);

  const [weather] =
    useState("26°C Sunny");

  const [notifications] =
    useState(3);

  const [currentTime, setCurrentTime] =
    useState("");
    const [worldTimes, setWorldTimes] = useState({
  mauritius: "",
  london: "",
  dubai: "",
  paris: "",
});
  const searchRef =
    useRef<HTMLInputElement>(null);

  const role = user?.role;

  const displayName =
    user?.email || "Guest";

  /* ===== SCROLL ===== */
  useEffect(() => {
    const onScroll = () =>
      setScrolled(
        window.scrollY > 40
      );

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  /* ===== PROGRESS ===== */
  useEffect(() => {
    NProgress.start();

    setTimeout(
      () => NProgress.done(),
      400
    );
  }, [location.pathname]);

  /* ===== AUTO SEARCH FOCUS ===== */
 useEffect(() => {
  const updateTime = () => {
    setCurrentTime(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    setWorldTimes({
      mauritius: new Date().toLocaleTimeString("en-MU", {
        timeZone: "Indian/Mauritius",
        hour: "2-digit",
        minute: "2-digit",
      }),

      london: new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
      }),

      dubai: new Date().toLocaleTimeString("en-AE", {
        timeZone: "Asia/Dubai",
        hour: "2-digit",
        minute: "2-digit",
      }),

      paris: new Date().toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  updateTime();

  const interval = setInterval(updateTime, 1000);

  return () => clearInterval(interval);
}, []);

  const navItems = useMemo(
    () => [
      {
        to: "/",
        label: "Home",
        icon: Home,
      },

      {
        to: "/cars",
        label: "Fleet",
        icon: Car,
      },

      {
        to: "/explore",
        label: "Explore",
        icon: Map,
      },

      {
        to: "/tourism",
        label: "Tourism",
        icon: Plane,
      },

      {
        to: "/partners",
        label: "Partners",
        icon: Users,
      },

      {
        to: "/faq",
        label: "FAQ",
        icon: HelpCircle,
      },

      {
        to: "/about",
        label: "About",
        icon: Info,
      },

      {
        to: "/support",
        label: "Support",
        icon: Phone,
      },
    ],
    []
  );

  const adminItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: Settings,
    },

    {
      to: "/admin/reservations",
      label: "CRM",
      icon: Calendar,
    },

    {
      to: "/admin/calendar",
      label: "Planner",
      icon: Calendar,
    },

    {
      to: "/admin/email",
      label: "Inbox",
      icon: MessageCircle,
    },
  ];

  return (
    <>
      {/* GLOBAL TOP BAR */}
      <div className="relative z-[60] border-b border-white/10 bg-gradient-to-r from-[#071226] via-[#0d1835] to-[#4d0f18] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-emerald-300">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="h-2 w-2 rounded-full bg-emerald-400"
              />

              LIVE Mauritius Platform
              <div className="hidden lg:flex items-center gap-2 text-emerald-300/70">
  <ShieldCheck className="h-3 w-3" />
  Secure Booking Active
</div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-white/70">
              <Plane className="h-3 w-3" />

              Airport Delivery Active
            </div>

            <div className="hidden lg:flex items-center gap-2 text-white/70">
              <Clock3 className="h-3 w-3" />

              Mauritius Time:
              <div className="hidden xl:flex items-center gap-4 text-[11px] text-white/50">
  <span>🇲🇺 MU {worldTimes.mauritius}</span>
  <span>🇬🇧 UK {worldTimes.london}</span>
  <span>🇦🇪 UAE {worldTimes.dubai}</span>
  <span>🇫🇷 FR {worldTimes.paris}</span>
</div>
              {currentTime}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 text-white/70">
              <Globe className="h-3 w-3" />

              {liveVisitors} visitors
              online
            </div>

<div className="flex items-center gap-2 rounded-full border border-yellow-400/10 bg-yellow-400/10 px-3 py-1 text-yellow-300">
  <Sun className="h-3 w-3" />

  {weather}
</div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header
        className={cx(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-black/85 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
            : "bg-black/45 backdrop-blur-xl"
        )}
      >
        {/* GLOW */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-red-500/10" />

<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* LOGO */}
          <Link
            to="/"
            className="group flex items-center gap-4"
          >
            <motion.div
              whileHover={{
                scale: 1.04,
              }}
              className="relative"
            >
              <motion.img
                src="/logo38.png"
                alt="AM38 Logo"
                className="h-14 rounded-2xl border border-white/15 shadow-2xl"
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-black text-white">
                  AM38
                </div>

                <Crown className="h-4 w-4 text-yellow-300" />
              </div>

              <div className="text-[11px] tracking-[0.2em] text-white/50 uppercase">
                Smart Mauritius Mobility
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-2xl">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={
                  item.icon
                }
              >
                {item.label}
              </NavItem>
            ))}

            {(role === "admin" ||
              role === "staff") && (
              <>
                <div className="mx-2 h-6 w-px bg-white/10" />

                {adminItems.map(
                  (item) => (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={
                        item.icon
                      }
                    >
                      {
                        item.label
                      }
                    </NavItem>
                  )
                )}
              </>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                setSearchOpen(
                  !searchOpen
                )
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-xl transition hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* NOTIFICATIONS */}
            <button className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-xl">
              <Bell className="h-5 w-5" />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black">
                {notifications}
              </span>
            </button>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-xl"
            >
              <Heart className="h-5 w-5" />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-black">
                {wishlist}
              </span>
            </Link>

            {/* USER */}
            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-xl">
              <div className="rounded-xl bg-blue-500/20 p-2">
                <UserIcon className="h-4 w-4" />
              </div>

              <div>
                <div className="text-sm font-black">
                  {
                    displayName.split(
                      "@"
                    )[0]
                  }
                </div>

                <div className="text-[10px] uppercase tracking-wide text-white/50">
                  {role ||
                    "Guest"}
                </div>
              </div>
            </div>

            {/* AUTH */}
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate(
                      "/login"
                    )
                  }
                  className="rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Login
                </button>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    navigate(
                      "/register"
                    )
                  }
                  className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#165db8] to-[#3c88ff] px-5 py-3 text-sm font-black text-white shadow-2xl"
                >
                  <Sparkles className="h-4 w-4" />

                  Register

                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </motion.button>
              </div>
            ) : (
              <>
                {/* 👇 ADDED "My Trips" FOR DESKTOP */}
                <Link
                  to="/my-bookings"
                  className="hidden md:flex items-center gap-2 rounded-2xl bg-blue-600/20 px-5 py-3 text-sm font-bold text-blue-300 transition hover:bg-blue-600/30"
                >
                  🚗 My Trips
                </Link>
                <button
                  onClick={() =>
                    logout()
                  }
                  className="hidden md:flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
                >
                  <LogOut className="h-4 w-4" />

                  Logout
                </button>
              </>
            )}

            {/* CURRENCY */}
            <CurrencySelect />

            {/* MOBILE MENU */}
            <button
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-xl lg:hidden"
              onClick={() =>
                setOpen(!open)
              }
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* SEARCH PANEL */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              className="border-t border-white/10 bg-black/95 p-5 backdrop-blur-2xl"
            >
              <div className="mx-auto max-w-4xl">
                <div className="relative">
                  <Search className="absolute left-5 top-5 h-5 w-5 text-white/40" />

                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search luxury cars, beaches, airport transfers, tourism routes, invoices, support..."
                    className="w-full rounded-3xl border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-lg text-white outline-none placeholder:text-white/40 focus:border-blue-400/30"
                  />
                </div>

                {/* QUICK SEARCH */}
                <div className="mt-6 grid gap-3 md:grid-cols-3">
  <button className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-5 text-left backdrop-blur-xl transition hover:scale-[1.02]">
    <div className="font-black text-white">
      ✈ Airport Transfer
    </div>

    <div className="mt-2 text-sm text-white/60">
      Book direct airport pickup instantly.
    </div>
  </button>

  <button className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-5 text-left backdrop-blur-xl transition hover:scale-[1.02]">
    <div className="font-black text-white">
      🏝 Explore Mauritius
    </div>

    <div className="mt-2 text-sm text-white/60">
      AI tourism routes & hidden gems.
    </div>
  </button>

  <button className="rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-5 text-left backdrop-blur-xl transition hover:scale-[1.02]">
    <div className="font-black text-white">
      🚗 Luxury Fleet
    </div>

    <div className="mt-2 text-sm text-white/60">
      Discover premium hybrid & SUV vehicles.
    </div>
  </button>
</div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="mt-6 grid gap-3 md:grid-cols-3"></div>
                  {[
                    "SUV",
                    "Airport",
                    "Le Morne",
                    "Luxury",
                    "Hybrid",
                    "Tourism",
                  ].map((x) => (
                    <button
                      key={x}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl"
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="border-t border-white/10 bg-black/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="space-y-2 p-6">
                {user && (
                  <>
                    <div className="px-4 py-3 rounded-xl bg-white/10 font-bold text-sm">
                      {displayName.split("@")[0]}
                    </div>
                    {/* 👇 ADDED "My Trips" FOR MOBILE */}
                    <Link
                      to="/my-bookings"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-xl bg-blue-600/20 text-center font-bold text-blue-300"
                    >
                      🚗 My Trips
                    </Link>
                  </>
                )}
                {navItems.map(
                  (item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                      className="flex items-center gap-4 rounded-2xl px-4 py-4 text-white transition hover:bg-white/10"
                    >
                      <item.icon className="h-5 w-5 opacity-70" />

                      <span className="font-semibold">
                        {
                          item.label
                        }
                      </span>
                    </Link>
                  )
                )}

                {(role === "admin" ||
                  role === "staff") && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="mb-3 px-4 text-xs font-black uppercase tracking-wide text-white/40">
                      Admin
                    </div>

                    {adminItems.map(
                      (item) => (
                        <Link
                          key={
                            item.to
                          }
                          to={
                            item.to
                          }
                          onClick={() =>
                            setOpen(
                              false
                            )
                          }
                          className="flex items-center gap-4 rounded-2xl px-4 py-4 text-white transition hover:bg-white/10"
                        >
                          <item.icon className="h-5 w-5 opacity-70" />

                          <span className="font-semibold">
                            {
                              item.label
                            }
                          </span>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({
  to,
  children,
  icon: Icon,
}: {
  to: string;

  children: React.ReactNode;

  icon?: any;
}) {
  return (
    <NavLink
      to={to}
      className={({
        isActive,
      }) =>
        cx(
          "group relative flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-black transition",
          isActive
            ? "bg-white text-black shadow-2xl"
            : "text-white hover:bg-white/10"
        )
      }
    >
      {Icon && (
        <Icon className="h-4 w-4" />
      )}

      {children}
    </NavLink>
  );
}