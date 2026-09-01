import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, RefreshCw, Globe } from "lucide-react";
import { fetchAPI } from "@/lib/api";

const currencies = ["MUR", "USD", "EUR", "GBP", "INR", "ZAR", "AED", "CNY", "JPY", "CAD", "AUD", "CHF", "SEK", "NOK", "DKK"];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("MUR");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  async function fetchExchangeRates() {
    setLoading(true);
    try {
      const data = await fetchAPI("/exchange-rates");
      setRates(data.rates || {});
      setLastUpdate(data.lastUpdate || new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch rates", err);
    } finally {
      setLoading(false);
    }
  }

  const convert = (value: number, from: string, to: string): number => {
    if (!rates[from] || !rates[to]) return 0;
    const inUSD = value / rates[from];
    return inUSD * rates[to];
  };

  const convertedAmount = convert(amount, fromCurrency, toCurrency);
  const rate = rates[toCurrency] && rates[fromCurrency] ? (1 / rates[fromCurrency] * rates[toCurrency]).toFixed(4) : "...";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><DollarSign size={20} /><h3 className="font-bold">Currency Converter</h3></div><button onClick={fetchExchangeRates} disabled={loading} className="p-1 hover:bg-white/20 rounded-full transition"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button></div>
      <div className="space-y-3">
        <div><label className="text-xs opacity-80">Amount</label><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white" /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="text-xs opacity-80">From</label><select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full p-2 rounded-lg bg-white/20 border border-white/30">{currencies.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="text-xs opacity-80">To</label><select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full p-2 rounded-lg bg-white/20 border border-white/30">{currencies.map(c => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center"><p className="text-3xl font-black">{convertedAmount.toFixed(2)} {toCurrency}</p><p className="text-xs opacity-80">1 {fromCurrency} = {rate} {toCurrency}</p></div>
        <p className="text-[10px] opacity-60 text-center flex items-center justify-center gap-1"><Globe size={10} />Live rates updated {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : "daily"}</p>
      </div>
    </motion.div>
  );
}