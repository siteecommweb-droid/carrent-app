import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray" | "sky" | "rose" | "emerald";
  trend?: string | number;
  trendUp?: boolean;
  description?: string;
  compact?: boolean;
}

const gradientColors: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-emerald-600",
  red: "from-red-500 to-rose-600",
  yellow: "from-yellow-500 to-orange-500",
  purple: "from-purple-500 to-pink-500",
  orange: "from-orange-500 to-orange-600",
  gray: "from-gray-400 to-gray-500",
  sky: "from-sky-500 to-sky-600",
  rose: "from-rose-500 to-rose-600",
  emerald: "from-emerald-500 to-emerald-600",
};

const softColors: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  gray: "bg-gray-50 text-gray-600",
  sky: "bg-sky-50 text-sky-600",
  rose: "bg-rose-50 text-rose-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export default function StatCard({
  title,
  value,
  icon,
  color = "blue",
  trend,
  trendUp,
  description,
  compact = false,
}: StatCardProps) {
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  if (compact) {
    return (
      <div className={`rounded-xl p-4 ${softColors[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black">{displayValue}</div>
            <div className="text-xs uppercase tracking-wide mt-1">{title}</div>
            {description && <div className="text-xs mt-1 opacity-70">{description}</div>}
          </div>
          <div className="opacity-60">{icon}</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ y: -2 }} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{displayValue}</div>
          {trend !== undefined && (
            <div className={`text-xs font-semibold mt-2 ${trendUp ? "text-green-600" : "text-red-600"}`}>
              {trend}
            </div>
          )}
          {description && <div className="text-xs text-gray-400 mt-1">{description}</div>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColors[color]} text-white shadow-sm`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}