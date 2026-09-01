import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BrandLogo() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/")}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      whileHover={{
        scale: 1.03,
      }}
      className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:bg-white/10"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="relative"
      >
        <img
          src="/logo38.png"
          alt="AM Thirty Eight"
          className="h-12 w-auto rounded-xl border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 md:h-14"
        />

        <div className="absolute -right-1 -top-1 rounded-full bg-cyan-400 p-1 text-black shadow-lg">
          <Sparkles className="h-3 w-3" />
        </div>
      </motion.div>

      <div className="relative text-left leading-tight">
        <div className="bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-lg font-black text-transparent md:text-xl">
          AM Thirty Eight
        </div>

        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Luxury Rent A Car
        </div>

        <div className="mt-1 hidden text-[10px] text-white/50 md:block">
          Mauritius • Airport • Tourism • Premium Fleet
        </div>
      </div>
    </motion.button>
  );
}