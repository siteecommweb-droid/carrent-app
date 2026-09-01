import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  User,
  Car,
  Sparkles,
  Award,
  Zap,
  CreditCard,
  Headphones,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const { register, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  const handleRegister = async () => {
    setErr("");
    if (!email || !password || !fullName) {
      return setErr("Please complete all fields");
    }
    if (password !== confirm) {
      return setErr("Passwords do not match");
    }
    if (password.length < 6) {
      return setErr("Password must be at least 6 characters");
    }
    try {
      setLoading(true);
      await register({
        email,
        password,
        full_name: fullName,
        phone,
      });
      toast.success("Account created successfully");
      window.location.href = "/cars";
    } catch (e: any) {
      setErr(e?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">

      {/* Premium Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#11265f]/20 via-transparent to-[#8b2638]/20 pointer-events-none" />

      {/* Animated Gradient Orbs */}
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

      {/* Floating particles effect */}
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

      {/* Animated Car Icons */}
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

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md rounded-2xl px-5 py-2.5 hidden lg:flex items-center gap-3 border border-white/30 pointer-events-none"
      >
        <ShieldCheck size={18} className="text-blue-600" />
        <span className="text-xs text-black/80 font-medium">🔒 Free Signup • No Credit Card</span>
        <div className="w-px h-4 bg-white/30" />
        <Award size={18} className="text-yellow-500" />
        <span className="text-xs text-black/80 font-medium">🏆 Verified Member</span>
      </motion.div>

      {/* Live Counter */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-2xl px-5 py-2.5 hidden lg:flex items-center gap-3 border border-white/30 pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-black/80 font-medium">🎉 Join 10,000+ Members</span>
        </div>
        <div className="w-px h-4 bg-white/30" />
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-500" />
          <span className="text-xs text-black/80 font-medium">⚡ Instant Access</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-[500px] rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/50"
      >
        {/* Premium Gradient Border Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-white to-red-500 opacity-20 blur-xl pointer-events-none" />

        {/* French Flag accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl overflow-hidden flex pointer-events-none">
          <motion.div className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" />
          <motion.div className="flex-1 bg-gradient-to-r from-white to-gray-100" />
          <motion.div className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
        </div>

        {/* Animated Sparkle Icon */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center shadow-xl pointer-events-none"
        >
          <Sparkles size={18} className="text-white" />
        </motion.div>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-red-500/10 rounded-full px-3 py-1.5 mb-4">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-gray-700">⭐ Free Registration • Instant Access</span>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent font-black">
            Join AM38
          </div>
          <h1 className="mt-3 text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign up for free and start exploring Mauritius.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Full name"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pl-10 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pl-10 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Phone number (optional)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pl-10 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pl-10 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pl-10 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400 transition-all duration-300"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {err && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
            >
              ⚠️ {err}
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 py-3.5 rounded-xl font-bold text-white hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin inline mr-2" size={18} />
                Creating account...
              </>
            ) : (
              "Create Account →"
            )}
          </motion.button>

          <div className="text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-red-600 hover:underline">Terms</Link> and{" "}
            <Link to="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="text-red-600 hover:text-red-800 font-bold transition inline-flex items-center gap-1">
            Already have an account? Login →
          </Link>
        </div>

        {/* Premium Features Row */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <CreditCard size={14} className="text-red-500" />
            <span>No Fees</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Headphones size={14} className="text-blue-500" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Zap size={14} className="text-yellow-500" />
            <span>Instant Access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}