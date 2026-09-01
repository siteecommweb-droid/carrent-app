import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, X, Percent, Gift } from "lucide-react";
import { fetchAPI } from "@/lib/api";

export default function CouponInput({ onApply, onRemove, appliedCode, discount }: { onApply: (code: string, discount: number) => void; onRemove?: () => void; appliedCode?: string; discount?: number }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setValidating(true);
    try {
      const res = await fetchAPI(`/coupons/validate?code=${code.toUpperCase()}`);
      if (res.valid) {
        onApply(code.toUpperCase(), res.discount);
        setCode("");
        setValidating(false);
      } else {
        setError(res.message || "Invalid coupon code");
      }
    } catch (err) {
      setError("Failed to validate coupon");
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    onRemove?.();
    setError(null);
  }

  if (appliedCode) {
    return (<motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-center justify-between"><div className="flex items-center gap-2"><Tag size={16} className="text-green-600" /><div><div className="font-bold text-green-800">{appliedCode}</div><div className="text-xs text-green-600">{discount}% discount applied</div></div></div><button onClick={handleRemove} className="p-1 hover:bg-green-200 rounded-full transition"><X size={14} className="text-green-700" /></button></motion.div>);
  }

  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-2"><Gift size={16} className="text-red-500" /><span className="font-semibold text-sm">Have a coupon?</span></div>
      <div className="flex gap-2">
        <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }} placeholder="Enter code" className="flex-1 rounded-lg border px-3 py-2 text-sm uppercase bg-white" />
        <button onClick={handleApply} disabled={loading || !code.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition disabled:opacity-50">{loading ? "..." : "Apply"}</button>
      </div>
      <AnimatePresence>{error && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-red-500 mt-2 flex items-center gap-1"><X size={10} />{error}</motion.p>)}</AnimatePresence>
      {validating && !error && <div className="text-xs text-green-600 mt-2 animate-pulse">✅ Validating...</div>}
    </div>
  );
}