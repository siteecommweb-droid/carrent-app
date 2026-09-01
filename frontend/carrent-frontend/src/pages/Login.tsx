import { motion } from "framer-motion";
import { Chrome, Loader2, Car, Shield, Sparkles, Eye, EyeOff, Zap, Award, CreditCard, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

function getOauthBase() {
  const raw =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api";

  return raw.replace(/\/api\/?$/, "");
}

const OAUTH_BASE = getOauthBase();

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.role === "admin") {
        navigate("/admin/reservations");
      } else {
        navigate("/cars");
      }
    }
  }, [navigate]);

  // ========== FIXED handleLogin (timestamp check) ==========
  async function handleLogin() {
    setError("");
    if (!email || !password) {
      return setError("Enter email and password");
    }
    try {
      setLoading(true);
      const res = await login(email, password);

      // ----- only honor a pending car if it was set in the last 30 minutes -----
      const pendingCar = localStorage.getItem("selectedCar");
      const pendingCarTime = Number(localStorage.getItem("selectedCarTimestamp") || 0);
      const isFresh = pendingCarTime && (Date.now() - pendingCarTime) < 30 * 60 * 1000;

      if (pendingCar && isFresh) {
        navigate("/checkout");
        return;
      }
      // Stale flag from an old session — clear it so it never hijacks login again
      if (pendingCar && !isFresh) {
        localStorage.removeItem("selectedCar");
        localStorage.removeItem("selectedCarTimestamp");
      }

      if (res?.user?.role === "admin") {
        navigate("/admin/reservations");
      } else {
        navigate("/cars");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  // =========================================================

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">

      <div className="absolute inset-0 bg-gradient-to-r from-[#11265f]/20 via-transparent to-[#8b2638]/20 pointer-events-none" />

      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -100, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: -20, opacity: 0 }}
            animate={{ y: window.innerHeight + 20, opacity: [0, 0.5, 0] }}
            transition={{ duration: Math.random() * 8 + 4, repeat: Infinity, delay: Math.random() * 5 }}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <motion.div
        animate={{ x: [-30, 30, -30], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-20 opacity-30 hidden lg:block pointer-events-none"
      >
        <div className="relative">
          <Car size={100} className="text-blue-400" />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -right-8 top-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"
          />
        </div>
      </motion.div>
      <motion.div
        animate={{ x: [30, -30, 30], y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-20 opacity-30 hidden lg:block pointer-events-none"
      >
        <div className="relative">
          <Car size={80} className="text-red-400" />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -left-8 top-1/2 w-16 h-0.5 bg-gradient-to-l from-red-400 to-transparent"
          />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotateZ: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-40 right-32 hidden xl:block pointer-events-none"
      >
        <div className="w-20 h-28 bg-gradient-to-br from-blue-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 shadow-xl" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0], rotateZ: [0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-40 left-32 hidden xl:block pointer-events-none"
      >
        <div className="w-24 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md rounded-2xl px-5 py-2.5 hidden lg:flex items-center gap-3 border border-white/30 pointer-events-none"
      >
        <Shield size={18} className="text-blue-600" />
        <span className="text-xs text-black/80 font-medium">🔒 256-bit SSL Secure</span>
        <div className="w-px h-4 bg-white/30" />
        <Award size={18} className="text-yellow-500" />
        <span className="text-xs text-black/80 font-medium">🏆 Trusted Partner 2024</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-2xl px-5 py-2.5 hidden lg:flex items-center gap-3 border border-white/30 pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-black/80 font-medium">👥 128 people viewing now</span>
        </div>
        <div className="w-px h-4 bg-white/30" />
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-500" />
          <span className="text-xs text-black/80 font-medium">⚡ Instant booking</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-[480px] rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/50"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-white to-red-500 opacity-20 blur-xl pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl overflow-hidden flex pointer-events-none">
          <motion.div className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" />
          <motion.div className="flex-1 bg-gradient-to-r from-white to-gray-100" />
          <motion.div className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
        </div>

        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center shadow-xl pointer-events-none"
        >
          <Sparkles size={18} className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-red-500/10 rounded-full px-3 py-1.5 mb-4"
        >
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-gray-700">⭐ 4.98/5 Trust Score • 2,500+ Bookings</span>
        </motion.div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent font-black">
            AM38 Secure Access
          </div>
          <h1 className="mt-3 text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Access your premium bookings, invoices and fleet dashboard.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div className="group">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="hello@am38.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-red-600 hover:text-red-800 transition font-medium">
              Forgot password?
            </Link>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login →"
            )}
          </motion.button>
        </div>

        <div className="my-8 text-center text-sm text-gray-500 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative px-4 bg-white text-gray-600 font-medium">OR CONTINUE WITH</span>
        </div>

        <div className="space-y-3">
          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`${OAUTH_BASE}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-800 py-3.5 rounded-xl font-bold hover:border-red-500 hover:shadow-lg transition-all duration-300 group"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              alt="Google"
            />
            <span className="group-hover:text-red-600 transition">Continue with Google</span>
          </motion.a>
        </div>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-red-600 hover:text-red-800 font-bold transition inline-flex items-center gap-1 group">
            Don't have an account? Register →
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <CreditCard size={14} className="text-red-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Headphones size={14} className="text-blue-500" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Zap size={14} className="text-yellow-500" />
            <span>Instant Booking</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Shield size={12} />
            <span>GDPR Compliant • PCI DSS Certified • ISO 27001</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}