import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { ShieldCheck, Lock, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fmtMUR, fmtUSD, murToUsd, useLiveRate } from "@/lib/dualCurrency";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function safeParse<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function CardForm({ grandTotal }: { grandTotal: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    toast.loading("Processing secure payment...", { id: "pay" });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/confirmation` },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed", { id: "pay" });
      setPaying(false);
      return;
    }

    toast.success("Payment accepted!", { id: "pay" });
    localStorage.setItem("am38_paid", JSON.stringify({ paidAt: new Date().toISOString(), method: "stripe" }));
    navigate("/confirmation");
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement />
      <button type="submit" disabled={!stripe || paying} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-lg font-black text-white shadow-xl transition hover:scale-[1.01] disabled:opacity-50">
        {paying ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
        {paying ? "Processing..." : `Pay Now • ${fmtMUR(grandTotal)}`}
      </button>
      <p className="text-center text-xs font-semibold text-slate-400">🔒 Secured by Stripe • PCI-DSS compliant</p>
    </form>
  );
}

export default function Payment() {
  const navigate = useNavigate();
  const rate = useLiveRate();
  const [resv, setResv] = useState<any>(null);
  const [extras, setExtras] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const r = safeParse<any>("am38_reservation");
    const e = safeParse<any>("am38_extras");
    const c = safeParse<any>("am38_selected_car");
    if (!r || !e || !c) {
      toast.error("Please complete your reservation first");
      navigate("/cars");
      return;
    }
    setResv(r); setExtras(e); setCar(c);

    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/payments/create-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ amount: e.grandTotal, bookingId: r.id, currency: "mur" }),
        });
        const data = await res.json();
        if (!res.ok || !data.clientSecret) throw new Error(data.message || "Could not start payment");
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "Could not start secure payment. Check STRIPE_SECRET_KEY in backend/.env");
      }
    })();
  }, [navigate]);

  if (!resv || !extras || !car) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-black">
          {["Search results ✓", "Options ✓", "Driver details ✓", "Payment", "Confirmation"].map((s, i) => (
            <span key={s} className={`rounded-full px-4 py-2 ${i === 3 ? "bg-blue-600 text-white" : i < 3 ? "bg-green-500 text-white" : "bg-white text-slate-500"}`}>{s}</span>
          ))}
        </div>
        <button onClick={() => navigate("/driver-details")} className="mb-4 inline-flex items-center gap-2 font-black text-red-600 hover:underline"><ArrowLeft className="h-4 w-4" /> Back</button>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl bg-white p-6 shadow-2xl">
            <h1 className="flex items-center gap-2 text-3xl font-black text-black"><Lock className="h-7 w-7 text-green-600" /> Secure Payment</h1>
            <p className="mt-1 font-semibold text-slate-500">Visa / Mastercard / Amex — powered by Stripe</p>
            <div className="mt-6">
              {error && <p className="rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
              {!error && !clientSecret && <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CardForm grandTotal={extras.grandTotal} />
                </Elements>
              )}
            </div>
          </div>

          <div className="h-fit rounded-3xl bg-white p-6 shadow-2xl lg:sticky lg:top-24">
            <img src={car.image} alt={car.name} className="h-32 w-full rounded-2xl bg-slate-100 object-contain p-3" onError={(ev) => ((ev.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg")} />
            <h2 className="mt-3 text-xl font-black text-black">{car.name}</h2>
            <p className="text-xs font-bold text-slate-500">Reservation: {resv.reference}</p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between font-bold text-slate-700"><span>Car ({extras.days} days)</span><span>{fmtMUR(extras.baseTotal)}</span></div>
              <div className="flex justify-between font-bold text-slate-700"><span>Extras</span><span>{fmtMUR(extras.extrasTotal)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-black text-black"><span>TOTAL</span><span className="text-red-600">{fmtMUR(extras.grandTotal)}</span></div>
              <div className="text-right text-sm font-black text-blue-700">≈ {fmtUSD(murToUsd(extras.grandTotal, rate))}</div>
              <p className="pt-1 text-center text-xs font-semibold text-slate-400"><ShieldCheck className="inline h-3 w-3" /> Insurance & taxes included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}