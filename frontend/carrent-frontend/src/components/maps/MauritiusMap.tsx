import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Clock,
  Navigation,
  Fuel,
  MapPin,
  Timer,
} from "lucide-react";

type Point = {
  x: number;
  y: number;
  label: string;
  type: "airport" | "office" | "city";
};

export default function MauritiusMap() {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("05:00");
  const [speed, setSpeed] = useState(62);
  const [distance, setDistance] = useState(14);
  const [lapTime, setLapTime] = useState("00:00:00");

  const requestRef = useRef<number | null>(null);

  const points: Point[] = [
    {
      x: 130,
      y: 345,
      label: "SSR Airport",
      type: "airport",
    },
    {
      x: 350,
      y: 260,
      label: "AM38 Office",
      type: "office",
    },
    {
      x: 600,
      y: 170,
      label: "Grand Baie",
      type: "city",
    },
  ];

  const fullPath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `${acc} L ${p.x} ${p.y}`;
  }, "");

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 15000;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const newProgress = (elapsed % duration) / duration;

      setProgress(newProgress);

      const remaining = Math.max(
        1,
        Math.ceil((1 - newProgress) * 5)
      );

      setEta(`0${remaining}:00`);

      setSpeed(
        60 + Math.floor(Math.sin(elapsed / 1200) * 15)
      );

      setDistance(
        Math.max(
          1,
          Math.floor((1 - newProgress) * 14)
        )
      );

      const totalSeconds = Math.floor(elapsed / 1000);

      const hrs = String(
        Math.floor(totalSeconds / 3600)
      ).padStart(2, "0");

      const mins = String(
        Math.floor((totalSeconds % 3600) / 60)
      ).padStart(2, "0");

      const secs = String(
        totalSeconds % 60
      ).padStart(2, "0");

      setLapTime(`${hrs}:${mins}:${secs}`);

      requestRef.current =
        requestAnimationFrame(animate);
    };

    requestRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(
          requestRef.current
        );
      }
    };
  }, []);

  const numSegments = points.length - 1;

  const segProgress =
    progress * numSegments;

  const segIndex = Math.min(
    Math.floor(segProgress),
    numSegments - 1
  );

  const segT =
    segProgress - segIndex;

  const p1 = points[segIndex];
  const p2 = points[segIndex + 1];

  const carX =
    p1.x + (p2.x - p1.x) * segT;

  const carY =
    p1.y + (p2.y - p1.y) * segT;

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-[36px] border border-white/70 bg-white/35 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl">

      {/* REAL MAP */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45 scale-110"
        style={{
          backgroundImage:
            "url('/mauritius-map.png')",
        }}
      />

      {/* FRENCH FADE */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-white/20 to-red-500/15" />

      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white/10 backdrop-brightness-125" />

      {/* GLOW */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* TOP BAR */}
      <div className="absolute left-5 top-5 z-30 flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white shadow-xl">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          LIVE TRACKING
        </div>

        <div className="rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-slate-800 shadow-lg backdrop-blur-xl">
          🇲🇺 Mauritius Route Engine
        </div>

        <div className="rounded-full bg-blue-500/90 px-4 py-2 text-xs font-black text-white shadow-lg">
          F1 TELEMETRY
        </div>
      </div>

      {/* SVG */}
      <svg
        viewBox="0 0 900 500"
        className="relative z-10 h-full w-full"
      >
        <defs>
          <linearGradient
            id="routeGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#2563eb"
            />

            <stop
              offset="50%"
              stopColor="#ffffff"
            />

            <stop
              offset="100%"
              stopColor="#ef4444"
            />
          </linearGradient>

          <filter id="mapGlow">
            <feGaussianBlur
              stdDeviation="6"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* MAP ISLAND */}
        <path
          d="M55 105 Q185 35 350 70 Q520 105 665 85 Q810 65 855 150 Q890 245 805 355 Q705 465 550 425 Q410 390 255 415 Q105 440 60 350 Q25 235 55 105Z"
          fill="#dff4ff"
          stroke="#93c5fd"
          strokeWidth="3"
          opacity="0.45"
        />

        {/* FULL ROUTE */}
        <path
          d={fullPath}
          stroke="url(#routeGrad)"
          strokeWidth="10"
          strokeDasharray="18 16"
          fill="none"
          opacity="0.85"
          filter="url(#mapGlow)"
        />

        {/* ACTIVE ROUTE */}
        <path
          d={`M ${p1.x} ${p1.y} L ${
            p1.x + (p2.x - p1.x) * segT
          } ${
            p1.y + (p2.y - p1.y) * segT
          }`}
          stroke="#22d3ee"
          strokeWidth="12"
          fill="none"
          filter="url(#mapGlow)"
        />

        {/* MARKERS */}
        {points.map((p) => (
          <g key={p.label}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="16"
              fill={
                p.type === "airport"
                  ? "#2563eb"
                  : p.type === "office"
                  ? "#ef4444"
                  : "#16a34a"
              }
              stroke="#ffffff"
              strokeWidth="5"
              filter="url(#mapGlow)"
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            <text
              x={p.x + 22}
              y={p.y + 5}
              className="fill-slate-900 text-[16px] font-black"
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* CAR */}
        <g
          transform={`translate(${carX - 22}, ${
            carY - 22
          })`}
        >
          <motion.circle
            r="26"
            cx="22"
            cy="22"
            fill="#22d3ee"
            opacity="0.25"
            animate={{
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />

          <circle
            cx="22"
            cy="22"
            r="18"
            fill="#0ea5e9"
            stroke="#ffffff"
            strokeWidth="4"
          />

          <foreignObject
            x="10"
            y="10"
            width="24"
            height="24"
          >
            <Car className="h-6 w-6 text-white" />
          </foreignObject>
        </g>
      </svg>

      {/* BOTTOM TELEMETRY */}
      <div className="absolute bottom-5 left-5 right-5 z-30 grid grid-cols-2 md:grid-cols-4 gap-3">

        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-blue-700 font-black text-sm">
            <Navigation className="h-4 w-4" />
            Route
          </div>

          <p className="mt-2 text-slate-800 font-bold">
            SSR → AM38
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-green-700 font-black text-sm">
            <Clock className="h-4 w-4" />
            ETA
          </div>

          <p className="mt-2 text-slate-900 text-2xl font-black">
            {eta}
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-red-700 font-black text-sm">
            <Fuel className="h-4 w-4" />
            Speed
          </div>

          <p className="mt-2 text-slate-900 text-2xl font-black">
            {speed} km/h
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-700 font-black text-sm">
            <Timer className="h-4 w-4" />
            Lap Time
          </div>

          <p className="mt-2 text-slate-900 text-xl font-black">
            {lapTime}
          </p>
        </div>
      </div>

      {/* DRIVER CARD */}
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute right-5 top-20 z-30 w-[260px] rounded-3xl border border-white/80 bg-white/80 p-5 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
            <Car className="h-7 w-7" />
          </div>

          <div>
            <p className="text-slate-900 font-black">
              Driver Assigned
            </p>

            <p className="text-sm text-slate-600">
              AM38 Airport Delivery
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

          <div className="rounded-2xl bg-blue-50 p-3">
            <p className="text-slate-500">
              Distance
            </p>

            <p className="font-black text-blue-700">
              {distance} km
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-3">
            <p className="text-slate-500">
              Status
            </p>

            <p className="font-black text-red-500">
              En Route
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          LIVE GPS ACTIVE
        </div>
      </motion.div>
    </div>
  );
}