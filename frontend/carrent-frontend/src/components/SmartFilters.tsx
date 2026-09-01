import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Calendar,
  Wallet,
  Sun,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";

interface SmartFiltersProps {
  onFilterChange: (filter: any) => void;
  onRecommendation: (type: string) => void;
}

export default function SmartFilters({
  onFilterChange,
  onRecommendation,
}: SmartFiltersProps) {
  const [budget, setBudget] = useState<"low" | "medium" | "high">("medium");
  const [season, setSeason] = useState<"summer" | "winter" | "any">("any");
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy" | "any">("any");
  const [duration, setDuration] = useState(3);
  const [interests, setInterests] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const interestOptions = [
    { id: "beach", label: "🏖️ Beaches", popular: true },
    { id: "nature", label: "🌿 Nature", popular: true },
    { id: "culture", label: "🏛️ Culture" },
    { id: "adventure", label: "🧗 Adventure", popular: true },
    { id: "food", label: "🍽️ Food" },
    { id: "shopping", label: "🛍️ Shopping" },
    { id: "nightlife", label: "🌙 Nightlife" },
    { id: "family", label: "👨‍👩‍👧 Family", popular: true },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    onFilterChange({ interests: [...interests, id] });
  };

  const getRecommendation = () => {
    if (interests.includes("beach") && interests.includes("adventure")) {
      return "🌊 Based on your Beach + Adventure interests, try Le Morne for hiking and lagoon views!";
    }
    if (interests.includes("nature") && interests.includes("family")) {
      return "🌿 Nature + Family = Perfect for Black River Gorges and Botanical Garden visits!";
    }
    if (interests.includes("nightlife")) {
      return "🎉 Nightlife lover? Grand Baie is your spot for clubs, bars, and restaurants!";
    }
    if (interests.length === 0) {
      return "✨ Select your interests to get personalized recommendations!";
    }
    return "🎯 Check out Chamarel, Flic en Flac, and Port Louis based on your interests!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-yellow-400" />
          <h3 className="font-bold text-white">Smart Trip Planner</h3>
          <span className="text-xs bg-yellow-500/30 px-2 py-0.5 rounded-full text-yellow-300">
            AI Powered
          </span>
        </div>
        <Sparkles
          size={16}
          className={`text-yellow-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Budget */}
            <div>
              <label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Wallet size={12} /> Budget per day
              </label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBudget(b as any);
                      onFilterChange({ budget: b });
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                      budget === b
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {b === "low" && "💰 Economy"}
                    {b === "medium" && "💎 Comfort"}
                    {b === "high" && "👑 Luxury"}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Calendar size={12} /> Season
              </label>
              <div className="flex gap-2">
                {["summer", "winter"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSeason(s as any);
                      onFilterChange({ season: s });
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm transition ${
                      season === s
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {s === "summer" ? "☀️ Summer (Nov-Apr)" : "❄️ Winter (May-Oct)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather preference */}
            <div>
              <label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Sun size={12} /> Preferred weather
              </label>
              <div className="flex gap-2">
                {["sunny", "cloudy", "rainy", "any"].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWeather(w as any);
                      onFilterChange({ weather: w });
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs transition ${
                      weather === w
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {w === "sunny" && "☀️ Sunny"}
                    {w === "cloudy" && "☁️ Cloudy"}
                    {w === "rainy" && "🌧️ Rainy"}
                    {w === "any" && "🎲 Any"}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">
                Trip duration (days)
              </label>
              <input
                type="range"
                min="1"
                max="14"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value));
                  onFilterChange({ duration: Number(e.target.value) });
                }}
                className="w-full accent-red-500"
              />
              <div className="text-center text-sm font-bold mt-1 text-white">
                {duration} day{duration > 1 ? "s" : ""}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Heart size={12} /> I'm interested in
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1 ${
                      interests.includes(opt.id)
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {opt.label}
                    {opt.popular && <Star size={10} className="text-yellow-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-3 border border-purple-500/30">
              <p className="text-xs text-purple-300 flex items-center gap-1 mb-1">
                <Sparkles size={12} /> AI Suggestion
              </p>
              <p className="text-sm text-white">{getRecommendation()}</p>
            </div>

            {/* Recommendation Button */}
            <button
              onClick={() => onRecommendation("ai")}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-black text-white flex items-center justify-center gap-2 hover:shadow-xl transition"
            >
              <Sparkles size={16} /> Get AI Recommendation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}