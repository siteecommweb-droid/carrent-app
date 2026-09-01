import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Calendar, MapPin, FileText, ArrowRight, LogIn, UserPlus, Loader2, Users, Luggage } from "lucide-react";
import { fmtMUR, fmtUSD, murToUsd, useLiveRate } from "@/lib/dualCurrency";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const FILES_BASE = API_URL.replace(/\/api\/?$/, "");

type ReservationRow = {
  id: number; reference: string; car_name: string; av_group: string; status: string;
  pickup_date: string; return_date: string; days: number;
  grand_total_mur: number; grand_total_usd: number;
  accommodation_type: string; accommodation_name: string;
  adults: number; children: number; luggage_large: number; luggage_small: number;
  passport_file: string | null; licence_file: string | null; created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    completed: "bg-slate-200 text-slate-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const cls = map[status?.toLowerCase()] || "bg-slate-100 text-slate-600";
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${cls}`}>{status || "pending"}</span>;
}

export default function MyReservations() {
  const rate = useLiveRate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/reservations/mine`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to load your bookings");
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || "Failed to load your bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <Car className="mx-auto h-14 w-14 text-blue-600" />
          <h1 className="mt-4 text-2xl font-black text-black">Sign in to see your trips</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Bookings made while logged in appear here automatically. Guest bookings are saved by AM38 but are not linked to any account.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/login" className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 font-black text-white shadow-lg"><LogIn className="h-4 w-4" /> Login</Link>
            <Link to="/register" className="flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 font-black text-black"><UserPlus className="h-4 w-4" /> Create an account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-black text-white drop-shadow">My Trips & Bookings</h1>
        <p className="mt-1 font-semibold text-white/80">Every AM38 reservation linked to your account.</p>

        {loading && <div className="mt-10 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-white" /></div>}
        {!loading && error && <div className="mt-6 rounded-2xl bg-red-100 p-4 font-bold text-red-700">{error}</div>}

        {!loading && !error && rows.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-2xl">
            <Car className="mx-auto h-14 w-14 text-slate-300" />
            <p className="mt-4 text-xl font-black text-black">No bookings yet</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Your next Mauritius trip starts here.</p>
            <Link to="/cars" className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 font-black text-white shadow-lg">Browse Fleet <ArrowRight className="h-4 w-4" /></Link>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {rows.map((r) => (
            <div key={r.id} className="rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-2xl font-black text-black">{r.car_name}</p>
                  <p className="text-xs font-bold text-slate-400">Ref: {r.reference} • {r.av_group}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Calendar className="h-4 w-4 text-blue-600" /> {r.pickup_date} → {r.return_date} ({r.days} days)</div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin className="h-4 w-4 text-red-600" /> {r.accommodation_type || "N/A"} — {r.accommodation_name || "—"}</div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Users className="h-4 w-4 text-cyan-600" /> {r.adults} adults, {r.children} children</div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Luggage className="h-4 w-4 text-yellow-600" /> {r.luggage_large} large + {r.luggage_small} small</div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex gap-3">
                  {r.passport_file && <a href={`${FILES_BASE}${r.passport_file}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-black text-blue-700 hover:underline"><FileText className="h-4 w-4" /> Passport</a>}
                  {r.licence_file && <a href={`${FILES_BASE}${r.licence_file}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-black text-blue-700 hover:underline"><FileText className="h-4 w-4" /> Licence</a>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-red-600">{fmtMUR(r.grand_total_mur)}</p>
                  <p className="text-xs font-black text-blue-700">≈ {fmtUSD(murToUsd(r.grand_total_mur, rate))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
