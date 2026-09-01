import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Plane,
  Phone,
  MessageCircle,
  Star,
  ShieldCheck,
  MapPin,
  HelpCircle,
  X,
  Compass,
  Crown,
  Trophy,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  Landmark,
  Banknote,
  Mail,
  Clock,
  CheckCircle2,
  Menu,
} from "lucide-react";

/* ==========================================================================
   ASSETS — change these here if a file is renamed
   ========================================================================== */
const HERO_BG = "/Landbookgo.JPG"; // centred landing poster (USE THE FIXED FILE I PROVIDED)

/* The corrected Landbookgo.JPG I provided is already upright — keep 0.
   Only change this if you use a different photo that needs rotating. */
const HERO_BG_ROTATION = 0;

const VIDEO_POSTER = "/arrival_hall.jpeg"; // video start image
const LOGO_BOARD_IMG = "/am38-airport.jpg"; // Step 3 popup: logo board at airport
const DISCOVER_BADGE = "/discovercars_badge.png"; // DiscoverCars award badge

/* ==========================================================================
   MAP ROUTE PATH — the car drives along these points, synced with the video.
   Points are % positions over the Google Map (x = left→right, y = top→bottom).
   Point [0] = SSR Airport (right side of map). Last point = AM38 Office.
   If Google renders the map slightly differently on your screen, nudge these
   numbers a few % until the car follows the blue road perfectly.
   ========================================================================== */
const ROUTE_PATH = [
  { x: 82, y: 56 }, // SSR Airport (start — pinned)
  { x: 74, y: 62 },
  { x: 64, y: 66 },
  { x: 54, y: 66 },
  { x: 48, y: 60 },
  { x: 46, y: 50 },
  { x: 40, y: 42 },
  { x: 31, y: 39 },
  { x: 23, y: 41 }, // AM38 Office (destination)
];

/* Interpolate the car position along ROUTE_PATH for a progress of 0 → 1 */
function carPositionAt(progress: number) {
  const p = Math.min(Math.max(progress, 0), 1);
  const segCount = ROUTE_PATH.length - 1;
  const seg = p * segCount;
  const i = Math.min(Math.floor(seg), segCount - 1);
  const t = seg - i;
  const a = ROUTE_PATH[i];
  const b = ROUTE_PATH[i + 1];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const MAURITIUS_LOCATIONS = [
  { id: "ssr-airport", name: "SSR International Airport", type: "airport", region: "Plaine Magnien" },
  { id: "grand-baie", name: "Grand Baie", type: "tourist", region: "Rivière du Rempart" },
  { id: "flic-en-flac", name: "Flic en Flac", type: "beach", region: "Black River" },
  { id: "port-louis", name: "Port Louis", type: "city", region: "Port Louis" },
  { id: "curepipe", name: "Curepipe", type: "city", region: "Plaines Wilhems" },
  { id: "tamarin", name: "Tamarin", type: "beach", region: "Black River" },
  { id: "belle-mare", name: "Belle Mare", type: "beach", region: "Flacq" },
  { id: "le-morne", name: "Le Morne", type: "mountain", region: "Black River" },
  { id: "mahebourg", name: "Mahebourg", type: "town", region: "Grand Port" },
  { id: "blue-bay", name: "Blue Bay", type: "beach", region: "Grand Port" },
];

const AWARDS = [
  { name: "Discover Cars Excellence Award", year: "2023", icon: Trophy, desc: "Top Car Rental Partner" },
  { name: "Discover Cars Excellence Award", year: "2024", icon: Trophy, desc: "Outstanding Service" },
  { name: "Discover Cars Excellence Award", year: "2025", icon: Crown, desc: "Premium Partner" },
];

const FEATURED_PARTNER = {
  name: "DiscoverCars.com",
  url: "https://www.discovercars.com",
  logo: "/partners/discovercars.png",
  badge: DISCOVER_BADGE,
  tagline: "AM38 Choice | AM38 Recommended Partner",
};

const OTHER_PARTNERS = [
  { name: "Carjet", url: "https://www.carjet.com", logo: "/partners/carjet.png" },
  { name: "Rentilles", url: "https://www.rentilles.com", logo: "/partners/rentiles.png" },
];

const DRIVER_COUNTRIES = [
  "Mauritius", "France", "United Kingdom", "Germany", "Italy",
  "Réunion", "India", "South Africa", "China", "Other",
];

const DRIVER_AGES = ["18-20", "21-24", "25-29", "30-65", "66-75", "76+"];

const REVIEWS = [
  { id: 1, name: "Emma Richardson", country: "UK", flag: "🇬🇧", rating: 5, text: "Booked before landing. The AM38 handover was ready at SSR Airport. Smooth process!", date: "March 2026" },
  { id: 2, name: "Daniel Schmidt", country: "Germany", flag: "🇩🇪", rating: 5, text: "Clear pricing, no hidden fees, fast WhatsApp support.", date: "February 2026" },
  { id: 3, name: "Naveen Kumar", country: "India", flag: "🇮🇳", rating: 5, text: "I booked while waiting for luggage. Delivery was instant.", date: "January 2026" },
  { id: 4, name: "Sophie Laurent", country: "France", flag: "🇫🇷", rating: 5, text: "Service impeccable! Voiture propre, personnel charmant.", date: "December 2025" },
  { id: 5, name: "Michael Chen", country: "China", flag: "🇨🇳", rating: 5, text: "Best rental experience. Car was spotless, pickup instant.", date: "November 2025" },
  { id: 6, name: "Isabella Rossi", country: "Italy", flag: "🇮🇹", rating: 5, text: "Servizio eccellente! L'auto era perfetta.", date: "October 2025" },
];

const PICKUP_STEPS = [
  { step: 1, title: "Choose Your Vehicle", desc: "150+ premium cars", icon: Car, action: "booking" as const },
  { step: 2, title: "Share Arrival Details", desc: "Flight number & time", icon: Plane, action: "booking" as const },
  { step: 3, title: "Meet & Service at Airport/Hotel", desc: "SSR Arrival Hall or your hotel", icon: MapPin, action: "logoboard" as const },
  { step: 4, title: "Drive Anywhere", desc: "Explore Mauritius freely", icon: Compass, action: "explore" as const },
];

const FAQS = [
  { q: "What documents do I need?", a: "Valid driving license, passport/ID, credit card for deposit." },
  { q: "Is insurance included?", a: "Basic insurance included, excess reduction Rs 300/day." },
  { q: "Free cancellation?", a: "Free up to 24h before pickup." },
  { q: "Airport delivery?", a: "Yes, free delivery at SSR Airport arrival hall." },
  { q: "Anywhere delivery?", a: "Yes – hotels, villas, any location in Mauritius." },
  { q: "Payment methods?", a: "Visa, Mastercard, Amex, Bank Transfer, Cash, MCB Juice." },
  { q: "Minimum age?", a: "21 years with license held for 2+ years." },
  { q: "Fuel policy?", a: "Full-to-full – return with same fuel level." },
];

const worldCities = [
  { code: "MU", city: "Mauritius", tz: "Indian/Mauritius" },
  { code: "GB", city: "London", tz: "Europe/London" },
  { code: "US", city: "New York", tz: "America/New_York" },
  { code: "AE", city: "Dubai", tz: "Asia/Dubai" },
  { code: "JP", city: "Tokyo", tz: "Asia/Tokyo" },
  { code: "FR", city: "Paris", tz: "Europe/Paris" },
  { code: "AU", city: "Sydney", tz: "Australia/Sydney" },
];

/* ==========================================================================
   SECURE PAYMENTS — brand-accurate logos. Hover = highlight, out = normal.
   ========================================================================== */
function PaymentChip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="group bg-white rounded-xl px-5 py-3 flex items-center gap-3 shadow-md border border-slate-200 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-blue-400/60 hover:border-blue-400"
      aria-label={label}
    >
      {children}
    </div>
  );
}

function SecurePayments() {
  return (
    <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_20px_70px_rgba(0,0,0,0.35)] px-6 py-6">
      <div className="flex items-center justify-center gap-3 mb-5">
        <ShieldCheck className="w-8 h-8 text-green-600" />
        <h3 className="text-2xl md:text-3xl font-black text-slate-900">Secure Payments</h3>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <PaymentChip label="Visa">
          <span className="italic font-black text-2xl tracking-tighter text-[#1A1F71]">VISA</span>
        </PaymentChip>

        <PaymentChip label="Mastercard">
          <span className="relative flex items-center">
            <span className="w-7 h-7 rounded-full bg-[#EB001B]" />
            <span className="w-7 h-7 rounded-full bg-[#F79E1B] -ml-3 mix-blend-multiply" />
          </span>
          <span className="font-bold text-slate-800">Mastercard</span>
        </PaymentChip>

        <PaymentChip label="American Express">
          <span className="bg-[#016FD0] text-white font-black text-xs px-3 py-2 rounded leading-tight text-center">
            AMERICAN
            <br />
            EXPRESS
          </span>
        </PaymentChip>

        <PaymentChip label="MCB Juice">
          <span className="font-black text-2xl text-[#ED1B2F]">MCB</span>
          <span className="font-black text-2xl text-[#F7941D] -ml-1">Juice</span>
        </PaymentChip>

        <PaymentChip label="Bank Transfer">
          <Landmark className="w-7 h-7 text-slate-700" />
          <span className="font-bold text-slate-800">Bank Transfer</span>
        </PaymentChip>

        <PaymentChip label="Cash">
          <Banknote className="w-7 h-7 text-green-600" />
          <span className="font-bold text-slate-800">Cash</span>
        </PaymentChip>
      </div>
    </div>
  );
}

/* ========================================================================== */

function TermsPreview() {
  return (
    <section className="py-20 bg-black/45 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-950/90 backdrop-blur-2xl rounded-[32px] border border-white/20 p-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.8)]">
              Terms & Conditions
            </h2>
            <p className="mt-4 text-cyan-200 text-lg font-black drop-shadow-[0_4px_16px_rgba(0,0,0,0.75)]">
              AM38 Mauritius Rental Policies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-white leading-relaxed">
            <div className="bg-black/60 rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="font-black text-xl mb-3 text-white">Rental Conditions</h3>
              <ul className="space-y-2 text-slate-100 font-semibold">
                <li>• Driver must hold valid driving license.</li>
                <li>• Vehicle must be returned with same fuel level.</li>
                <li>• Vehicle must be returned in same condition.</li>
                <li>• Rental extension must be informed.</li>
                <li>• Vehicle abandonment is prohibited.</li>
              </ul>
            </div>

            <div className="bg-black/60 rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="font-black text-xl mb-3 text-white">Driver Responsibility</h3>
              <ul className="space-y-2 text-slate-100 font-semibold">
                <li>• Driver is responsible under alcohol influence.</li>
                <li>• No reckless or illegal driving permitted.</li>
                <li>• Accident must be reported within 4 hours.</li>
                <li>• Damage responsibility applies where necessary.</li>
                <li>• Passenger transport restrictions apply.</li>
              </ul>
            </div>

            <div className="bg-black/60 rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="font-black text-xl mb-3 text-white">Airport & Insurance</h3>
              <ul className="space-y-2 text-slate-100 font-semibold">
                <li>• Free SSR airport handover.</li>
                <li>• Driver waits during flight delays.</li>
                <li>• Insurance conditions apply.</li>
                <li>• Cyclone and Mauritius weather policies apply.</li>
                <li>• Jurisdiction: Republic of Mauritius.</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/pdfs/Legal.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-red-500 text-white font-black shadow-2xl hover:scale-105 transition"
            >
              📄 View Full Legal Documents
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   EMBEDDED WHITE NAVBAR — lives INSIDE the landing page so it works no
   matter which old navbar file the app renders. The <style> block below
   FORCE-HIDES the old dark "MAURITIUS MOBILITY" navbar and the old footer.
   ========================================================================== */
function Am38Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [lang, setLangState] = useState<string>(
    () => localStorage.getItem("preferredLanguage") || "en"
  );

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Fleet", path: "/cars" },
    { label: "Explore", path: "/explore" },
    { label: "Partners", path: "/partners" },
    { label: "FAQ", path: "/faq" },
    { label: "About", path: "/about" },
    { label: "Support", path: "/support" },
  ];

  const LANGS: { code: "en" | "fr"; label: string; flag: string }[] = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
  ];

  const pickLang = (code: "en" | "fr") => {
    setLangState(code);
    localStorage.setItem("preferredLanguage", code);
  };

  const goBooking = () => {
    setOpen(false);
    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* KILL-SWITCH: hides the app's old dark navbar + old footer on this page */}
      <style>{`
        header.fixed:not(#am38-navbar),
        nav.fixed:not(#am38-navbar) { display: none !important; }
        footer:not(#am38-footer) { display: none !important; }
      `}</style>

      <header id="am38-navbar" className="fixed top-0 left-0 right-0 z-[9999]">
        {/* WHITE background bar */}
        <div className="absolute inset-0 bg-white border-b border-slate-200 shadow-md" />

        <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* STENCILISED AM38 LOGO — recreated like the poster emblem
              (swoosh above, AM38, — CAR RENTAL — below), in blue on white */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              viewBox="0 0 220 88"
              className="h-14 w-auto"
              aria-label="AM38 Car Rental"
              role="img"
            >
              {/* top swoosh */}
              <path
                d="M25 22 Q110 -6 195 22"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* AM38 stencil wordmark */}
              <text
                x="110"
                y="54"
                textAnchor="middle"
                fontFamily="Arial Black, Arial, sans-serif"
                fontWeight="900"
                fontSize="36"
                letterSpacing="4"
                fill="#1d4ed8"
              >
                AM38
              </text>
              {/* — CAR RENTAL — */}
              <text
                x="110"
                y="74"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontWeight="700"
                fontSize="12"
                letterSpacing="6"
                fill="#dc2626"
              >
                — CAR RENTAL —
              </text>
              {/* bottom swoosh */}
              <path
                d="M35 82 Q110 96 185 82"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          {/* Page titles — BLUE on WHITE, hover = zoom + darker blue + highlight */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-block px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-110 whitespace-nowrap ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={goBooking}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-black text-sm shadow-lg hover:scale-105 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <Car className="w-4 h-4" /> Book Now
            </button>

            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:scale-105 font-bold text-sm transition-all whitespace-nowrap"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-red-500 text-white font-black text-sm shadow-lg hover:scale-105 transition-all whitespace-nowrap"
            >
              Register
            </Link>

            {/* EN 🇬🇧 / FR 🇫🇷 — professional segmented switch, right after Register */}
            <div className="flex items-center rounded-xl border-2 border-blue-600 overflow-hidden shadow-md shrink-0">
              {LANGS.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => pickLang(opt.code)}
                  title={opt.code === "en" ? "English" : "Français"}
                  className={`px-3 py-2 text-sm font-black flex items-center gap-1 transition-colors whitespace-nowrap ${
                    lang === opt.code
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-base leading-none">{opt.flag}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-blue-700 p-2 rounded-lg bg-blue-50"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu — white theme */}
        {open && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl">
            <div className="p-6 flex flex-col gap-3">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-2 rounded-xl font-bold ${
                      active ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="flex items-center rounded-2xl border-2 border-blue-200 overflow-hidden shadow-md w-fit">
                {LANGS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      pickLang(opt.code);
                      setOpen(false);
                    }}
                    className={`px-5 py-2.5 text-sm font-black flex items-center gap-1.5 ${
                      lang === opt.code
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    <span className="text-base leading-none">{opt.flag}</span>
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={goBooking}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl text-white font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <Car className="w-4 h-4" /> Book Now
              </button>

              <div className="flex gap-3 pt-3 border-t border-slate-200">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-3 border-2 border-blue-300 rounded-xl text-blue-700 font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-red-500 rounded-xl text-white font-black"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/* ==========================================================================
   EMBEDDED NEW FOOTER — solid dark background, every word bold and clear.
   Replaces the old faded footer (which is force-hidden by the CSS above).
   ========================================================================== */
function Am38Footer() {
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Fleet", path: "/cars" },
    { label: "Explore Mauritius", path: "/explore" },
    { label: "Partners", path: "/partners" },
    { label: "FAQ", path: "/faq" },
    { label: "About Us", path: "/about" },
    { label: "Support", path: "/support" },
  ];

  const whyChoose = [
    "No hidden fees",
    "Airport delivery",
    "Fast booking confirmation",
    "Premium maintained fleet",
    "24/7 WhatsApp support",
    "Tourism assistance",
    "Flexible pickup & dropoff",
  ];

  return (
    <footer id="am38-footer" className="relative bg-slate-950 border-t-2 border-blue-500/40">
      {/* Live strip */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
            <span className="text-green-300 font-black text-base tracking-wide">
              LIVE Mauritius Car Rental Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 text-white font-bold text-sm">
              <Plane className="w-4 h-4 text-cyan-300" /> SSR Airport Delivery
            </span>
            <span className="flex items-center gap-2 text-white font-bold text-sm">
              <Clock className="w-4 h-4 text-cyan-300" /> 24/7 Support
            </span>
            <span className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-green-300" /> Secure Booking
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/am38-logo.png"
              alt="AM38"
              className="h-14 w-auto object-contain bg-white rounded-xl p-1 shadow-lg"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div>
              <p className="text-white font-black text-2xl tracking-wide">AM38</p>
              <p className="text-cyan-300 text-[10px] font-black uppercase tracking-[0.2em] leading-tight">
                Your Virtual Car Rental
                <br />
                in Mauritius
              </p>
            </div>
          </div>

          <p className="text-slate-200 font-medium leading-relaxed">
            Premium Mauritius vehicle rental experience with airport delivery, smart booking
            technology, a modern fleet and trusted island support — at your service since 2013.
          </p>

          <p className="text-cyan-300 font-black text-xs uppercase tracking-[0.2em] mt-6 mb-3">
            Secure Payments
          </p>
          <div className="flex flex-wrap gap-2">
            {["Visa", "Mastercard", "Amex", "MCB Juice", "Bank Transfer", "Cash"].map((m) => (
              <span
                key={m}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-black text-xs shadow-md hover:scale-105 transition"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-black text-xl mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
            Navigation
          </h3>
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className="text-slate-200 font-bold hover:text-cyan-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Why choose */}
        <div>
          <h3 className="text-white font-black text-xl mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-orange-400 rounded-full" />
            Why Choose AM38
          </h3>
          <ul className="space-y-3">
            {whyChoose.map((item) => (
              <li key={item} className="flex items-center gap-2 text-slate-200 font-bold">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/50 rounded-2xl p-4">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-yellow-300 font-black">Google Rated Excellence</p>
            <p className="text-yellow-100 text-xs font-bold">2024 • 2025 Trusted Service Award</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-black text-xl mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
            Contact
          </h3>

          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-cyan-300 font-black text-sm">Phone</p>
                <a href="tel:+23058357166" className="text-white font-bold hover:text-cyan-300 transition">
                  +230 5835 7166
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-cyan-300 font-black text-sm">Email</p>
                <a
                  href="mailto:support@am38.com"
                  className="text-white font-bold hover:text-cyan-300 transition"
                >
                  support@am38.com
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-cyan-300 font-black text-sm">Office</p>
                <p className="text-white font-bold">Plaine Magnien, Mauritius</p>
                <p className="text-slate-300 text-xs font-bold">2 minutes from SSR Airport ✈</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-cyan-300 font-black text-sm">WhatsApp</p>
                <a
                  href="https://wa.me/23058357166"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-bold hover:text-green-300 transition"
                >
                  Available 24/7
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-slate-200 font-bold text-sm">
            © 2026 <span className="text-white font-black">AM38 Rent A Car</span> • Mauritius
          </p>

          <div className="flex flex-wrap gap-6">
            <a
              href="/pdfs/condition.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 font-bold text-sm hover:text-cyan-300 transition"
            >
              Terms
            </a>
            <Link to="/faq" className="text-slate-200 font-bold text-sm hover:text-cyan-300 transition">
              FAQ
            </Link>
            <Link to="/support" className="text-slate-200 font-bold text-sm hover:text-cyan-300 transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  /* ---- Yellow booking engine state ---- */
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupLocationSearch, setPickupLocationSearch] = useState("");
  const [dropoffLocationSearch, setDropoffLocationSearch] = useState("");
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [sameLocation, setSameLocation] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("11:00");
  const [dropoffTime, setDropoffTime] = useState("11:00");
  const [driverCountry, setDriverCountry] = useState("Mauritius");
  const [driverAge, setDriverAge] = useState("30-65");
  const [isSearching, setIsSearching] = useState(false);

  /* ---- Video + synced map ---- */
  const [videoMuted, setVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [routeArrived, setRouteArrived] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoBoardModal, setShowLogoBoardModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 24-hour time options in 30-minute intervals
  const timeOptions: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeOptions.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* VIDEO ↔ MAP SYNC — updates on play AND on seeking forward/backward,
     so the car on the map always shows the real position of the video. */
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const syncFromVideo = () => {
      if (!video.duration) return;
      const progress = video.currentTime / video.duration;
      setVideoProgress(progress);

      if (progress >= 0.99) {
        setVideoProgress(1);
        setRouteArrived(true);
      } else {
        setRouteArrived(false);
      }
    };

    const onPlay = () => setIsVideoPlaying(true);
    const onPause = () => setIsVideoPlaying(false);
    const onEnded = () => {
      setVideoProgress(1);
      setRouteArrived(true);
      setIsVideoPlaying(false);
    };

    video.addEventListener("timeupdate", syncFromVideo);
    video.addEventListener("seeking", syncFromVideo);
    video.addEventListener("seeked", syncFromVideo);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", syncFromVideo);
      video.removeEventListener("seeking", syncFromVideo);
      video.removeEventListener("seeked", syncFromVideo);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const locationSuggestions = (search: string) =>
    MAURITIUS_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        loc.region.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 6);

  const scrollToBooking = () =>
    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });

  const handleSearch = () => {
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);

      window.location.href = `/cars?search=${encodeURIComponent(
        JSON.stringify({
          pickupLocation,
          dropoffLocation: sameLocation ? pickupLocation : dropoffLocation,
          pickupDate,
          dropoffDate,
          pickupTime,
          dropoffTime,
          driverCountry,
          driverAge,
        })
      )}`;
    }, 800);
  };

  const selectLocation = (
    loc: { id: string; name: string; type: string; region: string },
    type: "pickup" | "dropoff"
  ) => {
    if (type === "pickup") {
      setPickupLocation(loc.name);
      setPickupLocationSearch(loc.name);
      setShowPickupSuggestions(false);
    } else {
      setDropoffLocation(loc.name);
      setDropoffLocationSearch(loc.name);
      setShowDropoffSuggestions(false);
    }
  };

  const openDriverTracking = () => {
    const token = localStorage.getItem("token");
    if (!token) setShowAuthModal(true);
    else setShowDriverModal(true);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthModal(false);
    setShowDriverModal(true);
  };

  const startVideoAndRoute = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    setRouteArrived(false);
    await video.play();
  };

  const pauseVideoAndRoute = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
  };

  const toggleVideoPlay = () => (isVideoPlaying ? pauseVideoAndRoute() : startVideoAndRoute());

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoMuted;
    setVideoMuted(!videoMuted);
  };

  const handleStepClick = (action: "booking" | "logoboard" | "explore") => {
    if (action === "booking") scrollToBooking();
    if (action === "logoboard") setShowLogoBoardModal(true);
  };

  const mauritiusTime = currentTime.toLocaleTimeString("en-MU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  /* Live car position on the map, driven by the video timeline */
  const carPos = carPositionAt(videoProgress);
  const startPin = ROUTE_PATH[0];
  const endPin = ROUTE_PATH[ROUTE_PATH.length - 1];
  const remainingKm = Math.max(0, 1.8 * (1 - videoProgress));
  const remainingMin = Math.max(0, Math.ceil(4 * (1 - videoProgress)));

  return (
    /* IMPORTANT: bg-transparent (NOT bg-white) — otherwise the page paints
       white OVER the fixed background photo and hides it + all white text. */
    <div className="min-h-screen relative overflow-hidden bg-transparent pt-20">
      {/* EMBEDDED WHITE NAVBAR — also force-hides the old dark navbar/footer */}
      <Am38Navbar />

      {/* CLEAN DARK GRADIENT BACKGROUND — the Landbookgo poster is NOT
          stretched over the page anymore; it appears as a clear centred
          image in the middle of the hero (below). White strip stays behind
          the white navbar (top-20). */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-20 bottom-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.14),transparent_60%)]" />
        </div>
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative pt-10 overflow-hidden">
        <div className="relative z-20 max-w-[1600px] mx-auto px-6">
          {/* Stacked tagline — LEFT side of the page, under the AM38 title area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:block absolute left-6 top-6 z-30"
          >
            <div className="bg-black/50 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/25 shadow-2xl">
              {["YOUR", "VIRTUAL", "CAR RENTAL", "IN MAURITIUS"].map((line, i) => (
                <p
                  key={i}
                  className="text-white font-black text-sm md:text-base tracking-[0.25em] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-[-0.04em] text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]">
              Drive Mauritius <br />
              <span className="bg-gradient-to-r from-cyan-200 via-white to-red-200 bg-clip-text text-transparent drop-shadow-[0_6px_28px_rgba(0,0,0,0.6)]">
                with AM38
              </span>
            </h1>

            {/* INSTANT AIRPORT BOOKING = INSTANT CAR DELIVERY — fully bold,
                on its own dark pill so it always appears clearly */}
            <div className="mt-8 flex justify-center">
              <div className="bg-black/55 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/25 shadow-2xl">
                <p className="text-2xl md:text-4xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Instant Airport Booking
                  </span>
                  <span className="mx-3 text-white">=</span>
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Instant Car Delivery
                  </span>
                </p>
              </div>
            </div>

            <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed mt-6 bg-black/55 backdrop-blur-md p-5 rounded-2xl border border-white/25 shadow-xl font-bold">
              Our office & fleet proximity from the Airport makes us a reliable & trusted
              alternative to traditional car rental airport counters.
              <span className="block mt-2 font-black text-xl bg-gradient-to-r from-cyan-300 via-white to-red-300 bg-clip-text text-transparent">
                Pay less, enjoy better, modern cars with a great service.
              </span>
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={scrollToBooking}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-black shadow-[0_10px_40px_rgba(37,99,235,0.55)] flex items-center gap-2"
              >
                <Car className="w-5 h-5" /> Book Your Car Now
              </motion.button>

              <Link
                to="/explore"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-black shadow-[0_10px_40px_rgba(37,99,235,0.55)] flex items-center gap-2 hover:scale-105 transition"
              >
                <Compass className="w-5 h-5" /> Explore Mauritius
              </Link>
            </div>

            {/* THE LANDBOOKGO POSTER — placed HERE, centre of the landing
                page, per the A4 sketch ("Put Land, Book, Go photo here —
                centre"). Fully visible (nothing cropped), every person and
                detail clear, framed like a premium billboard. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-10 flex justify-center"
            >
              <div
                className="relative rounded-[32px] overflow-hidden border-4 border-white/40 shadow-[0_40px_140px_rgba(0,0,0,0.7)] bg-slate-900"
                style={{ height: "72vh", width: "calc(72vh * 1113 / 1253)", maxWidth: "100%" }}
              >
                <img
                  src={HERO_BG}
                  alt="Land. Book. Go. — AM38 Car Rental at SSR Airport Mauritius"
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: "72vh",
                    height: "calc(72vh * 1113 / 1253)",
                    transform: "translate(-50%, -50%) rotate(270deg)",
                    objectFit: "cover",
                  }}
                />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-white/20 rounded-[28px]" />
              </div>
            </motion.div>

            <div className="mt-10 flex justify-center">
              <div className="px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-xl">
                <p className="text-slate-900 font-black">🔥 27 Vehicles Booked Today</p>
              </div>
            </div>
          </motion.div>

          {/* SEARCH ENGINE BOOKING — yellow, Discover Cars style */}
          <div id="booking-section" className="relative mt-10 z-30 max-w-5xl mx-auto px-2">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={openDriverTracking}
                  className="flex items-center gap-2 bg-green-500 border border-green-300/60 px-3 py-1.5 rounded-full hover:bg-green-600 text-xs font-black text-white shadow-lg"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE SSR AIRPORT ARRIVALS
                </button>

                <button
                  onClick={openDriverTracking}
                  className="flex items-center gap-2 bg-blue-600 border border-blue-300/60 px-3 py-1.5 rounded-full hover:bg-blue-700 text-xs font-black text-white shadow-lg"
                >
                  <Plane className="w-4 h-4" /> TRACK YOUR DRIVER
                </button>
              </div>

              <div className="bg-white border border-white px-3 py-1.5 rounded-full shadow-md">
                <span className="text-slate-900 font-bold text-sm">🇲🇺 {mauritiusTime}</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-xl bg-[#ffd42d] p-3 sm:p-4 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
            >
              <div className={`grid gap-2 ${sameLocation ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                <YellowLocationInput
                  label="Pick-up location"
                  value={pickupLocationSearch}
                  setValue={setPickupLocationSearch}
                  show={showPickupSuggestions}
                  setShow={setShowPickupSuggestions}
                  suggestions={locationSuggestions(pickupLocationSearch)}
                  onSelect={(loc) => selectLocation(loc, "pickup")}
                />

                {!sameLocation && (
                  <YellowLocationInput
                    label="Drop-off location"
                    value={dropoffLocationSearch}
                    setValue={setDropoffLocationSearch}
                    show={showDropoffSuggestions}
                    setShow={setShowDropoffSuggestions}
                    suggestions={locationSuggestions(dropoffLocationSearch)}
                    onSelect={(loc) => selectLocation(loc, "dropoff")}
                  />
                )}
              </div>

              <label className="flex items-center gap-2 mt-3 mb-3 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={sameLocation}
                  onChange={(e) => setSameLocation(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-800 accent-slate-900 bg-white"
                />
                <span className="text-slate-900 font-semibold">Return car in same location</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-white rounded-md flex">
                  <div className="flex-1 px-4 py-2 border-r border-slate-200">
                    <span className="block text-[13px] text-slate-500">Pick-up date</span>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div className="w-32 px-4 py-2">
                    <span className="block text-[13px] text-slate-500">Time</span>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 font-medium cursor-pointer"
                    >
                      {timeOptions.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-md flex">
                  <div className="flex-1 px-4 py-2 border-r border-slate-200">
                    <span className="block text-[13px] text-slate-500">Drop-off date</span>
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div className="w-32 px-4 py-2">
                    <span className="block text-[13px] text-slate-500">Time</span>
                    <select
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-900 font-medium cursor-pointer"
                    >
                      {timeOptions.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-1 pb-1">
                <p className="text-slate-900 font-semibold flex flex-wrap items-center gap-1">
                  Driver's country of residence is
                  <select
                    value={driverCountry}
                    onChange={(e) => setDriverCountry(e.target.value)}
                    className="bg-transparent font-bold underline underline-offset-2 cursor-pointer outline-none"
                  >
                    {DRIVER_COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  and age is
                  <select
                    value={driverAge}
                    onChange={(e) => setDriverAge(e.target.value)}
                    className="bg-transparent font-bold underline underline-offset-2 cursor-pointer outline-none"
                  >
                    {DRIVER_AGES.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </p>

                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-3 rounded-full bg-[#2eaa4a] hover:bg-[#279441] text-white font-bold text-lg shadow-lg transition-all disabled:opacity-70 min-w-[160px]"
                >
                  {isSearching ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto" />
                  ) : (
                    "Search now"
                  )}
                </button>
              </div>
            </motion.div>

            {/* SECURE PAYMENTS — just under the search engine booking */}
            <SecurePayments />
          </div>
        </div>

        {/* AM38 AT YOUR SERVICE SINCE 2013 — on its own dark banner so it is
            fully bold, highlighted and never mixes with the background photo */}
        <div className="mt-16 flex justify-center pb-8 relative px-6">
          <div className="bg-black/60 backdrop-blur-xl rounded-full px-8 md:px-14 py-5 border border-white/25 shadow-2xl">
            <h2 className="text-center text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.12em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              AM38 AT YOUR SERVICE{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-red-300 bg-clip-text text-transparent">
                SINCE 2013
              </span>
            </h2>
          </div>
        </div>
      </section>

      {/* PICKUP PROCESS — right after Secure Payments; bold, highlighted,
          dark cards so every word appears clearly over the background */}
      <Section title="Your Pick-Up Process" subtitle="See how quick it is!">
        <div className="grid md:grid-cols-4 gap-6">
          {PICKUP_STEPS.map((step, idx) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="h-full bg-slate-950/90 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-6 text-center hover:bg-slate-900 hover:border-cyan-400/60 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.55)] cursor-pointer"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-red-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-10 h-10 text-cyan-300" />
                </div>

                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-black">
                  {step.step}
                </div>

                <h3 className="font-black text-2xl text-white mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {step.title}
                </h3>
                <p className="text-cyan-100 text-base font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {step.desc}
                </p>
              </motion.div>
            );

            return step.action === "explore" ? (
              <Link key={idx} to="/explore" className="block h-full">
                {card}
              </Link>
            ) : (
              <button
                key={idx}
                type="button"
                onClick={() => handleStepClick(step.action)}
                className="block h-full text-left w-full"
              >
                {card}
              </button>
            );
          })}
        </div>
      </Section>

      {/* VIDEO + REAL GOOGLE MAP with LIVE CAR SYNCED TO THE VIDEO */}
      <section className="py-24 bg-black/25 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-[36px] overflow-hidden border border-white/25 shadow-[0_35px_120px_rgba(0,0,0,0.45)] bg-black/45 backdrop-blur-md">
              <video
                ref={videoRef}
                muted={videoMuted}
                playsInline
                controls
                className="w-full h-[500px] object-cover"
                poster={VIDEO_POSTER}
              >
                <source src="/am38-drive.mp4" type="video/mp4" />
              </video>

              {!isVideoPlaying && videoProgress === 0 && (
                <button
                  onClick={startVideoAndRoute}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="w-24 h-24 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl hover:scale-110 transition">
                    <Play className="w-12 h-12 text-white ml-1" />
                  </div>
                </button>
              )}

              <div className="absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-xl flex items-center gap-2 z-30">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE DELIVERY PROCESS
              </div>

              <div className="absolute top-5 right-5 flex gap-3 z-30">
                <button onClick={toggleVideoPlay} className="bg-white/90 backdrop-blur p-3 rounded-full shadow-xl">
                  {isVideoPlaying ? (
                    <Pause className="w-5 h-5 text-slate-800" />
                  ) : (
                    <Play className="w-5 h-5 text-slate-800" />
                  )}
                </button>

                <button onClick={toggleVideoMute} className="bg-white/90 backdrop-blur p-3 rounded-full shadow-xl">
                  {videoMuted ? (
                    <VolumeX className="w-5 h-5 text-slate-800" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-slate-800" />
                  )}
                </button>
              </div>

              {routeArrived && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-16 right-6 bg-green-500 text-white px-5 py-4 rounded-2xl shadow-2xl z-30"
                >
                  <p className="font-black text-lg">✅ Driver Arrived</p>
                  <p className="text-sm text-white/90">Welcome to AM38 Mauritius</p>
                </motion.div>
              )}
            </div>

            {/* REAL GOOGLE MAP — real road route, real pins from Google, PLUS a
                live car that starts pinned at SSR Airport and drives along the
                route in perfect sync with the video (play / pause / seek). */}
            <div className="relative rounded-[36px] overflow-hidden border border-white/25 shadow-[0_35px_120px_rgba(37,99,235,0.28)] bg-black/45 backdrop-blur-xl p-5">
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-black text-xs shadow-lg">
                  ● LIVE ROUTE
                </div>

                <div className="bg-white text-slate-800 px-4 py-2 rounded-full font-black text-xs shadow-lg">
                  SSR Airport → AM38 Office
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full font-black text-xs shadow-lg">
                  GOOGLE MAP
                </div>
              </div>

              <div className="relative h-[500px] rounded-[28px] overflow-hidden border border-white/25 shadow-inner">
                <iframe
                  title="AM38 Route"
                  src="https://maps.google.com/maps?saddr=Sir%20Seewoosagur%20Ramgoolam%20International%20Airport%2C%20Mauritius&daddr=AM38%20Bookings%20(Mauritius)%20Ltd%2C%20Plaine%20Magnien%2C%20Mauritius&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />

                {/* START PIN — SSR Airport (car begins here, pinned) */}
                <div
                  className="absolute z-20 pointer-events-none"
                  style={{ left: `${startPin.x}%`, top: `${startPin.y}%`, transform: "translate(-50%,-50%)" }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-xl" />
                    <p className="mt-1 font-black text-white text-[10px] bg-blue-600 px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                      ✈ SSR Airport
                    </p>
                  </div>
                </div>

                {/* DESTINATION PIN — AM38 Office */}
                <div
                  className="absolute z-20 pointer-events-none"
                  style={{ left: `${endPin.x}%`, top: `${endPin.y}%`, transform: "translate(-50%,-50%)" }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-xl" />
                    <p className="mt-1 font-black text-white text-[10px] bg-red-500 px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                      🏁 AM38 Office
                    </p>
                  </div>
                </div>

                {/* THE LIVE CAR — position driven by the video timeline.
                    Play → it drives. Pause → it stops. Seek forward/back →
                    it jumps to the exact matching point on the route. */}
                <div
                  className="absolute z-30 pointer-events-none transition-all duration-300 ease-linear"
                  style={{ left: `${carPos.x}%`, top: `${carPos.y}%`, transform: "translate(-50%,-50%)" }}
                >
                  <div className="relative">
                    <div
                      className={`absolute -inset-4 rounded-full blur-lg ${
                        routeArrived ? "bg-green-400/60" : "bg-cyan-400/60"
                      } ${isVideoPlaying ? "animate-pulse" : ""}`}
                    />
                    <div className="relative text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">🚗</div>
                  </div>
                </div>

                {/* ARRIVED AT DESTINATION — success message pinned at the office */}
                {routeArrived && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute z-40 pointer-events-none"
                    style={{
                      left: `${endPin.x}%`,
                      top: `${Math.max(4, endPin.y - 14)}%`,
                      transform: "translate(-50%,-100%)",
                    }}
                  >
                    <div className="bg-green-500 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-white text-center">
                      <p className="font-black text-sm">🎉 Arrived at Destination!</p>
                      <p className="text-[11px] font-bold text-white/95">AM38 Office — Welcome to Mauritius</p>
                    </div>
                  </motion.div>
                )}

                {/* Status card — live distance & ETA synced with the video */}
                <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl max-w-[220px] z-40">
                  <p className="font-black text-slate-900 text-sm">
                    {routeArrived
                      ? "✅ Destination Reached"
                      : isVideoPlaying
                      ? "🚗 Driving to AM38 Office"
                      : videoProgress > 0
                      ? "⏸ Paused En Route"
                      : "📍 Pinned at SSR Airport"}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold">SSR Airport → AM38 Office</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-blue-50 rounded-xl p-2">
                      <p className="text-[10px] text-slate-500 font-bold">Distance left</p>
                      <p className="font-black text-blue-700 text-sm">
                        {routeArrived ? "0 km" : `${remainingKm.toFixed(1)} km`}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-2">
                      <p className="text-[10px] text-slate-500 font-bold">ETA</p>
                      <p className="font-black text-green-700 text-sm">
                        {routeArrived ? "Arrived" : `${remainingMin} min`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AWARDS with Google Rating 4.9/5 */}
      <Section title="🏆 Award-Winning Excellence" subtitle="Recognized for outstanding service in Mauritius 2023–2025">
        <div className="grid md:grid-cols-3 gap-8">
          {AWARDS.map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-slate-950/90 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <award.icon className="w-10 h-10 text-cyan-300" />
              </div>

              <p className="font-black text-2xl text-white">{award.name}</p>
              <p className="text-3xl font-black text-cyan-300 mt-1">{award.year}</p>
              <p className="text-base text-cyan-100 mt-2 font-bold">{award.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-slate-950/85 backdrop-blur-xl border-2 border-yellow-400/50 rounded-3xl p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png"
              alt="Google"
              className="h-8 w-8"
            />
            <span className="text-white font-black text-2xl">Google Rating</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-5xl font-black text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">4.9/5</span>
          </div>
          <p className="text-yellow-300 font-bold text-lg mt-2">⭐ Based on 10,000+ reviews</p>
        </motion.div>
      </Section>

      {/* TRUSTED PARTNERS — DiscoverCars.com featured first with award badge */}
      <section className="py-20 bg-gradient-to-b from-blue-950/70 via-blue-900/60 to-cyan-950/60 backdrop-blur-sm border-y border-white/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl font-black text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)] mb-4">
              🤝 Our Trusted Partners
            </h2>

            <p className="text-cyan-200 font-black text-xl mb-12 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Book with confidence
            </p>

            <motion.a
              href={FEATURED_PARTNER.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="block max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400/90 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <img src={FEATURED_PARTNER.logo} alt="DiscoverCars.com" className="h-14 w-auto object-contain" />
                <img
                  src={FEATURED_PARTNER.badge}
                  alt="Discover Cars Award Badge"
                  className="h-28 w-auto object-contain drop-shadow-xl"
                />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-black shadow-xl">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                {FEATURED_PARTNER.tagline}
              </div>
            </motion.a>

            <div className="mt-10 flex flex-wrap justify-center gap-8">
              {OTHER_PARTNERS.map((p, idx) => (
                <motion.a
                  key={idx}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="bg-white rounded-2xl px-10 py-8 min-w-[220px] shadow-lg hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-4"
                >
                  <img src={p.logo} alt={p.name} className="h-12 w-auto object-contain" />
                  <p className="font-black text-xl text-slate-900">{p.name}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live World Clock */}
      <Section title="Live World Clock" subtitle="We serve customers worldwide, 24/7">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
          {worldCities.map((city, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white backdrop-blur border border-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all"
            >
              <p className="text-slate-500 text-sm font-black">{city.code}</p>
              <p className="text-slate-900 font-black text-xl">{city.city}</p>

              <p className="text-blue-700 font-black text-2xl mt-3 tracking-wide">
                {new Intl.DateTimeFormat("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: city.tz,
                }).format(currentTime)}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* REVIEWS */}
      <section className="py-20 bg-black/35 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <h2 className="text-5xl font-black text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
              What Our Customers Say
            </h2>

            <p className="text-cyan-200 font-black text-xl mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              4.9/5 from 10k+ reviews on Google
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-slate-950/90 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-red-500 rounded-full flex items-center justify-center text-white font-black text-2xl">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-black text-white text-lg">{review.name}</p>
                    <p className="text-slate-200 text-base font-semibold">
                      {review.flag} {review.country}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-white text-base leading-relaxed font-semibold">"{review.text}"</p>
                <p className="text-slate-300 text-sm mt-3 font-medium">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section title="Frequently Asked Questions" subtitle="Find answers to common questions about renting with AM38">
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {FAQS.map((faq, idx) => (
            <Link key={idx} to="/faq" className="block">
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.6)" }}
                className="bg-slate-950/90 backdrop-blur-xl border-2 border-white/20 rounded-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] cursor-pointer transition-all"
              >
                <p className="font-black text-white text-lg mb-2 flex items-start gap-2">
                  <HelpCircle className="w-6 h-6 text-cyan-300 flex-shrink-0" /> {faq.q}
                </p>

                <p className="text-cyan-50 text-base pl-8 font-semibold">{faq.a}</p>

                <div className="mt-3 text-right">
                  <span className="text-cyan-300 text-sm font-bold inline-flex items-center gap-1">
                    View Answer <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-red-500 text-white font-black text-lg rounded-2xl shadow-2xl hover:scale-105 transition-all"
          >
            ❓ Visit Full FAQ Page <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>

      <TermsPreview />

      {/* ================= REDESIGNED BOTTOM SECTION =================
          Solid dark gradient panel, big bold pills, crystal-clear legal
          links — everything readable, nothing fading into the photo. */}
      <section className="bg-gradient-to-b from-slate-950/90 via-blue-950/95 to-slate-950 backdrop-blur-xl border-t-2 border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* The 3 pills — bottom of the page, same colour effect, bold */}
          <div className="flex flex-wrap justify-center gap-5 mb-12">
            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-lg shadow-[0_12px_40px_rgba(34,211,238,0.45)] border-2 border-white/40"
            >
              🌍 Anywhere Around The Island
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-red-500 text-white font-black text-lg shadow-[0_12px_40px_rgba(239,68,68,0.45)] border-2 border-white/40"
            >
              ⚡ Online Booking Available 24/7
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-lg shadow-[0_12px_40px_rgba(34,211,238,0.45)] border-2 border-white/40"
            >
              ✈ SSR Airport Delivery
            </motion.div>
          </div>

          {/* Legal links — clear white pill buttons, impossible to miss */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Terms & Conditions", href: "/pdfs/condition.pdf" },
              { label: "Privacy Policy", href: "/pdfs/Legal.pdf" },
              { label: "Refund Policy", href: "/pdfs/refund.pdf" },
              { label: "GDPR", href: "/pdfs/Amendments.pdf" },
              { label: "Legal Information", href: "/pdfs/Legal.pdf" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-white/10 border-2 border-white/30 text-white font-black text-sm hover:bg-white hover:text-blue-800 hover:scale-105 transition-all shadow-lg"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EMBEDDED NEW FOOTER — replaces the old faded one */}
      <Am38Footer />

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="https://wa.me/23058357166" className="bg-green-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
          <MessageCircle className="w-6 h-6" />
        </a>

        <a href="tel:+23058357166" className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* MOBILE BOOK BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-3 lg:hidden">
        <button
          onClick={scrollToBooking}
          className="w-full bg-gradient-to-r from-blue-600 to-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Car className="w-5 h-5" /> Book Now
        </button>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showLogoBoardModal && (
          <Modal onClose={() => setShowLogoBoardModal(false)} title="Meet & Service at Airport/Hotel">
            <img
              src={LOGO_BOARD_IMG}
              alt="AM38 driver holding logo board at SSR Airport arrival hall"
              className="w-full rounded-2xl border border-slate-200 shadow-lg"
            />
            <p className="text-slate-600 text-center mt-4 font-medium">
              Look for the <span className="font-black text-blue-700">AM38 logo board</span> at the SSR
              Airport arrival hall or your hotel lobby — your driver will be waiting for you.
            </p>
          </Modal>
        )}

        {showDriverModal && (
          <Modal onClose={() => setShowDriverModal(false)} title="Live Driver Tracking">
            <div className="h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200 flex items-center justify-center">
              <p className="text-slate-500">Live map preview</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-100 rounded-xl p-3">
                <p className="text-slate-600">Driver</p>
                <p className="text-slate-800 font-bold">Rajesh Kumar</p>
              </div>

              <div className="bg-slate-100 rounded-xl p-3">
                <p className="text-slate-600">Vehicle</p>
                <p className="text-slate-800 font-bold">Suzuki Vitara (Blue)</p>
              </div>

              <div className="bg-slate-100 rounded-xl p-3">
                <p className="text-slate-600">ETA to Airport</p>
                <p className="text-blue-600 font-bold text-xl">5 min</p>
              </div>

              <div className="bg-slate-100 rounded-xl p-3">
                <p className="text-slate-600">Status</p>
                <p className="text-green-600 font-bold">Approaching</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 text-xs text-slate-500 justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live GPS • Updated 2s ago
            </div>
          </Modal>
        )}

        {showAuthModal && (
          <Modal onClose={() => setShowAuthModal(false)} title="Login Required">
            <p className="text-slate-600 text-center mb-6">
              Please login to track your driver or book a vehicle.
            </p>

            <form onSubmit={handleAuth} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-bold shadow-md"
              >
                Login / Register
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/register" className="text-blue-600 text-sm">
                Create new account
              </Link>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Yellow-engine location input */
function YellowLocationInput({
  label,
  value,
  setValue,
  show,
  setShow,
  suggestions,
  onSelect,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  suggestions: { id: string; name: string; type: string; region: string }[];
  onSelect: (loc: { id: string; name: string; type: string; region: string }) => void;
}) {
  return (
    <div className="relative bg-white rounded-md px-4 py-2">
      <label className="block text-[13px] text-slate-500">{label}</label>

      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShow(true);
        }}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder="Enter airport or city"
        className="w-full bg-transparent outline-none text-slate-900 text-base font-medium placeholder:text-slate-400"
      />

      <AnimatePresence>
        {show && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 z-[200] max-h-60 overflow-auto shadow-xl"
          >
            {suggestions.map((loc) => (
              <button
                key={loc.id}
                onMouseDown={() => onSelect(loc)}
                className="w-full px-3 py-2.5 text-left hover:bg-blue-50 text-slate-800 flex items-center gap-2 text-sm"
              >
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" /> {loc.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Section wrapper — dark strip + strong white titles so nothing mixes
   with the background photo */
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20 bg-black/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]">
            {title}
          </h2>

          <p className="text-cyan-200 font-black text-xl mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-blue-200 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-black text-slate-800">{title}</h3>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}
