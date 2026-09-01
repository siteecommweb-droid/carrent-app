import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useMemo } from "react";
import { AlertTriangle, CreditCard, Loader2, Lock, ShieldCheck, Sparkles, Zap, BadgeCheck, CheckCircle } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type StripePaymentBlockProps = {
  amount: number;
  bookingId?: number;
  disabled?: boolean;
  onSuccess: (paymentIntentId: string) => Promise<void> | void;
};

function getText(key: string): string {
  const lang = localStorage.getItem("preferredLanguage") || "en";
  const texts: any = {
    en: { securePayment: "Secure Payment", instantConfirm: "Instant confirmation", stripeSecured: "Stripe secured. No card data stored.", priorityFleet: "Priority fleet allocation", processing: "Processing...", pay: "Pay", bankLevel: "Bank-level encryption", paymentSuccess: "Payment successful!" },
    fr: { securePayment: "Paiement sécurisé", instantConfirm: "Confirmation instantanée", stripeSecured: "Sécurisé par Stripe", priorityFleet: "Allocation prioritaire", processing: "Traitement...", pay: "Payer", bankLevel: "Chiffrement bancaire", paymentSuccess: "Paiement réussi !" },
  };
  return texts[lang]?.[key] || texts.en[key];
}

export default function StripePaymentBlock({ amount, bookingId, disabled = false, onSuccess }: StripePaymentBlockProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const formattedAmount = useMemo(() => Number(amount || 0).toLocaleString("en-MU", { minimumFractionDigits: 2 }), [amount]);

  async function handlePay() {
    if (!stripe || !elements) { setError("Stripe not ready"); return; }
    if (!bookingId) { setError("Booking not ready. Please create booking first."); return; }
    const card = elements.getElement(CardElement);
    if (!card) { setError("Card input not ready"); return; }
    setLoading(true); setError("");
    try {
      const data = await fetchAPI("/stripe/create-payment-intent", { method: "POST", body: JSON.stringify({ amount: Number(amount), bookingId }) });
      const result = await stripe.confirmCardPayment(data.clientSecret, { payment_method: { card } });
      if (result.error) throw new Error(result.error.message);
      if (result.paymentIntent?.status !== "succeeded") throw new Error("Payment not completed");
      setSuccess(true);
      if (navigator.vibrate) navigator.vibrate(200);
      toast.success(getText("paymentSuccess"));
      await onSuccess(result.paymentIntent.id);
    } catch (e: any) { setError(e?.message || "Payment failed"); toast.error(e?.message); }
    finally { setLoading(false); }
  }

  if (success) return (<div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /><p className="font-bold text-green-700">{getText("paymentSuccess")}</p></div>);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative space-y-5 rounded-[30px] border border-white/10 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl">
      <div className="flex items-center gap-4"><div className="rounded-2xl bg-blue-100 p-3 text-blue-600"><CreditCard size={24} /></div><div><div className="text-xl font-black text-slate-900 flex items-center gap-2">{getText("securePayment")} <Sparkles size={16} /></div><div className="text-sm text-slate-500">{getText("instantConfirm")}</div></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><CardElement options={{ hidePostalCode: true, style: { base: { fontSize: "16px", color: "#0f172a", "::placeholder": { color: "#94a3b8" } } } }} /></div>
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 flex gap-2"><ShieldCheck size={16} /><span>{getText("stripeSecured")}</span></div>
      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3 text-sm flex gap-2"><Zap size={16} /><span>{getText("priorityFleet")}</span></div>
      {error && (<div className="flex gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm"><AlertTriangle size={16} />{error}</div>)}
      <button onClick={handlePay} disabled={loading || disabled || !bookingId} className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 font-black text-white transition hover:scale-[1.02] disabled:opacity-50">{loading ? (<div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20} />{getText("processing")}</div>) : (<div className="flex items-center justify-center gap-2"><Lock size={16} />{getText("pay")} MUR {formattedAmount}</div>)}</button>
      <div className="text-xs text-slate-400 text-center flex justify-center items-center gap-2"><BadgeCheck size={14} />{getText("bankLevel")}</div>
    </motion.div>
  );
}