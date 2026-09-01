import { motion } from "framer-motion";
import { Fuel, TrendingUp, TrendingDown } from "lucide-react";
import { useFuelPrice } from "../hooks/useFuelPrice";

export default function FuelPriceWidget() {
  const { prices, loading, error, calculateCost } = useFuelPrice();

  if (loading) return <div className="bg-gradient-to-br from-amber-700 to-orange-800 rounded-2xl p-5 animate-pulse h-48" />;
  if (error) return <div className="bg-red-600/20 rounded-2xl p-5 text-center text-red-300">{error}</div>;
  if (!prices) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-amber-700 to-orange-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4"><Fuel size={20} /><h3 className="font-bold">Live Fuel Prices</h3></div>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg"><span>⛽ Petrol (95)</span><span className="text-2xl font-black">{prices.petrol}</span><span className="text-xs">/litre</span></div>
        <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg"><span>⛽ Diesel</span><span className="text-2xl font-black">{prices.diesel}</span><span className="text-xs">/litre</span></div>
        <div className="mt-3 p-2 bg-white/10 rounded-lg text-xs"><p className="font-bold mb-1">💡 Fuel cost calculator</p><div className="grid grid-cols-2 gap-2 text-[11px]"><div>Economy (6L/100km): {Math.round(calculateCost(100, 6))}/100km</div><div>SUV (10L/100km): {Math.round(calculateCost(100, 10))}/100km</div></div></div>
        <p className="text-[10px] opacity-60 text-center">Updated: {new Date(prices.lastUpdate).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
}