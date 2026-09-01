import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, Plane, Calendar, MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fmtMUR, fmtUSD, murToUsd, useLiveRate } from "@/lib/dualCurrency";

function safeParse<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function Confirmation() {
  const navigate = useNavigate();
  const rate = useLiveRate();
  const [resv, setResv] = useState<any>(null);
  const [extras, setExtras] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const r = safeParse<any>("am38_reservation");
    const e = safeParse<any>("am38_extras");
    const c = safeParse<any>("am38_selected_car");
    if (!r || !e || !c) {
      toast.error("We could not find your booking details. Please book again.");
      navigate("/cars");
      return;
    }
    setResv(r); setExtras(e); setCar(c); setChecked(true);
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  const dates = safeParse<any>("am38_search") || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-black">
          {["Search results ✓", "Options ✓", "Driver details ✓", "Payment ✓", "Confirmation"].map((s, i) => (
            <span key={s} className={`rounded-full px-4 py-2 ${i === 4 ? "bg-blue-600 text-white" : "bg-green-500 text-white"}`}>{s}</span>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-8 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
          <h1 className="mt-4 text-4xl font-black text-black">Booking Confirmed! 🎉</h1>
          <p className="mt-2 text-lg font-bold text-slate-500">Reference</p>
          <p className="text-3xl font-black text-red-600">{resv.reference}</p>

          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 p-5 text-left">
            <img src={car.image} alt={car.name} className="h-32 w-full rounded-xl bg-white object-contain p-2" onError={(ev) => ((ev.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg")} />
            <h2 className="mt-3 text-2xl font-black text-black">{car.name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-600"><Calendar className="h-4 w-4 text-blue-600" /> {dates.pickupDate} {dates.pickupTime} → {dates.dropoffDate} {dates.dropoffTime} ({extras.days} days)</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin className="h-4 w-4 text-red-600" /> SSR International Airport — Meet & Greet</p>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg font-black text-black">
              <span>Total Paid</span>
              <span className="text-green-600">{fmtMUR(extras.grandTotal)} ≈ {fmtUSD(murToUsd(extras.grandTotal, rate))}</span>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
            <Plane className="mx-auto mb-1 h-5 w-5" />
            Your driver will wait at SSR Airport arrivals with the AM38 logo board. A confirmation email is on the way.
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={`https://wa.me/23058357166?text=Hello AM38, my booking ${resv.reference} is confirmed!`} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-green-500 px-8 font-black text-white shadow-xl transition hover:bg-green-600">
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
            <Link to="/my-reservations" className="inline-flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-8 font-black text-white shadow-xl transition hover:bg-blue-700">My Trips</Link>
            <Link to="/cars" className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 font-black text-black transition hover:bg-slate-50">Book Another Car</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
