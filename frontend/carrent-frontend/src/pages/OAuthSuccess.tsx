import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Car, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    async function finishOAuth() {
      if (!token) {
        toast.error("OAuth login failed");
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data?.success && data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success(`Welcome ${data.user.full_name || data.user.email}!`);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    finishOAuth();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          window.location.reload();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-white to-red-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-2 right-24"
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Login Successful! 🎉
        </h1>

        <p className="text-slate-600 mb-6">
          You have successfully logged in with your account.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <Car className="w-5 h-5" />
            <span className="font-medium">Redirecting in</span>
            <span className="text-2xl font-black text-red-600">
              {countdown}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
        >
          Go to Homepage →
        </button>
      </div>
    </div>
  );
}