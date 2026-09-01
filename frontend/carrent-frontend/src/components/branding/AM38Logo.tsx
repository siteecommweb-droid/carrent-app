import { motion } from "framer-motion";

export default function AM38Logo() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="relative"
    >
      {/* glow */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-blue-500/40 via-white/20 to-red-500/40 blur-2xl" />

      {/* badge */}
      <div className="relative w-[72px] h-[72px] rounded-[26px] overflow-hidden border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.25)] bg-gradient-to-br from-blue-600 via-white to-red-500 flex items-center justify-center">

        {/* metallic shine */}
        <motion.div
          animate={{ x: ["-140%", "140%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        {/* stencil text */}
        <div className="relative z-10 flex flex-col items-center leading-none">
          <span className="text-[28px] font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            AM
          </span>

          <span className="text-[18px] font-black text-slate-900 tracking-[0.18em]">
            38
          </span>
        </div>

        {/* floating reflections */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/70 blur-sm" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-white/60 blur-sm" />
      </div>
    </motion.div>
  );
}