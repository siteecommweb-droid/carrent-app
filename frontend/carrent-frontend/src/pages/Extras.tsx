import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Baby, MapPin, Wifi, UserPlus, Smartphone, Coffee, Heart, Gift, ArrowLeft, ArrowRight, ShieldCheck, Calendar, ChevronDown, ChevronUp, Fuel, Users as UsersIcon, Shield, Clock, Check, Key, Wind } from "lucide-react";
import toast from "react-hot-toast";
import { fmtMUR, fmtUSD, murToUsd, useLiveRate } from "@/lib/dualCurrency";

type Extra = { id: string; name: string; desc: string; price: number; mode: "per-day" | "per-rental"; icon: any; max: number };

export const EXTRAS_CATALOG: Extra[] = [
  { id: "infant_seat", name: "Infant Seat (0–15 months)", desc: "Rear-facing, up to 13kg", price: 250, mode: "per-rental", icon: Baby, max: 3 },
  { id: "child_seat", name: "Child Seat (9 months–4 yrs)", desc: "9–18kg, 5-point harness", price: 250, mode: "per-rental", icon: Baby, max: 3 },
  { id: "booster_seat", name: "Booster Seat (4–11 yrs)", desc: "15–36kg", price: 200, mode: "per-rental", icon: Baby, max: 3 },
  { id: "gps", name: "GPS Navigation", desc: "Turn-by-turn Mauritius maps", price: 150, mode: "per-day", icon: MapPin, max: 1 },
  { id: "wifi", name: "WiFi Hotspot", desc: "Unlimited 4G in-car internet", price: 200, mode: "per-day", icon: Wifi, max: 1 },
  { id: "extra_driver", name: "Additional Driver", desc: "Registered second driver", price: 6, mode: "per-day", icon: UserPlus, max: 2, isUSD: true } as any,
  { id: "sim", name: "Tourist SIM Card", desc: "30GB data + local calls", price: 300, mode: "per-rental", icon: Smartphone, max: 4 },
  { id: "welcome_drinks", name: "Welcome Drinks Pack", desc: "Cold local juices & water on arrival", price: 350, mode: "per-rental", icon: Coffee, max: 2 },
  { id: "honeymoon", name: "Honeymoon Welcome 💐", desc: "Flowers, sparkling drink & island gift", price: 1500, mode: "per-rental", icon: Heart, max: 1 },
  { id: "snack_box", name: "Mauritian Snack Box", desc: "Local treats for your first drive", price: 450, mode: "per-rental", icon: Gift, max: 3 },
];

const INCLUDED_ALWAYS = [
  "Low deposit",
  "Collision damage waiver",
  "Unlimited mileage",
  "Third-party liability",
];

const FULL_COVERAGE_LINES = [
  "Damage to the rental vehicle",
  "Lost or damaged car key",
  "Windows, mirrors and wheels",
];

export default function Extras() {
  const navigate = useNavigate();
  const rate = useLiveRate();
  const [car, setCar] = useState<any>(null);
  const [dates, setDates] = useState<any>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [specialRequest, setSpecialRequest] = useState("");
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [openInfo, setOpenInfo] = useState<string | null>(null);

  // Protection toggles (default ON)
  const [lastMinuteCancel, setLastMinuteCancel] = useState(true);
  const [roadsideAssist, setRoadsideAssist] = useState(true);
  const [fullCoverage, setFullCoverage] = useState(false);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("am38_selected_car") || "null");
    const d = JSON.parse(localStorage.getItem("am38_search") || "null");
    if (!c || !d?.pickupDate || !d?.dropoffDate) {
      toast.error("Please choose your car and dates first");
      navigate("/cars");
      return;
    }
    setCar(c); setDates(d);
    const savedExtras = JSON.parse(localStorage.getItem("am38_extras") || "null");
    if (savedExtras?.qty) setQty(savedExtras.qty);
    if (savedExtras?.specialRequest) setSpecialRequest(savedExtras.specialRequest);
    if (typeof savedExtras?.lastMinuteCancel === "boolean") setLastMinuteCancel(savedExtras.lastMinuteCancel);
    if (typeof savedExtras?.roadsideAssist === "boolean") setRoadsideAssist(savedExtras.roadsideAssist);
    if (typeof savedExtras?.fullCoverage === "boolean") setFullCoverage(savedExtras.fullCoverage);
  }, [navigate]);

  const days = useMemo(() => {
    if (!dates) return 1;
    const diff = new Date(`${dates.dropoffDate}T${dates.dropoffTime || "10:00"}`).getTime() - new Date(`${dates.pickupDate}T${dates.pickupTime || "10:00"}`).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  }, [dates]);

  const usdToMur = (usd: number) => usd * (rate ? (1 / murToUsd(1, rate)) : 45);

  const extrasTotal = useMemo(() =>
    EXTRAS_CATALOG.reduce((sum, e: any) => {
      const q = qty[e.id] || 0;
      if (q === 0) return sum;
      const unit = e.isUSD ? usdToMur(e.price) : e.price;
      return sum + q * unit * (e.mode === "per-day" ? days : 1);
    }, 0), [qty, days, rate]);

  const lastMinuteCancelTotal = lastMinuteCancel ? usdToMur(10) * days : 0;
  const roadsideAssistTotal = roadsideAssist ? usdToMur(10) * days : 0;
  const fullCoverageTotal = fullCoverage ? usdToMur(20) * days : 0;

  const baseTotal = car ? Number(car.daily_price || car.price || 0) * days : 0;
  const grandTotal = baseTotal + extrasTotal + lastMinuteCancelTotal + roadsideAssistTotal + fullCoverageTotal;

  function setQuantity(id: string, next: number, max: number) {
    setQty((p) => ({ ...p, [id]: Math.max(0, Math.min(max, next)) }));
  }

  function handleContinue() {
    const chosen = EXTRAS_CATALOG.filter((e) => (qty[e.id] || 0) > 0).map((e: any) => {
      const unit = e.isUSD ? usdToMur(e.price) : e.price;
      return {
        id: e.id, name: e.name, price: unit, mode: e.mode, quantity: qty[e.id],
        total: qty[e.id] * unit * (e.mode === "per-day" ? days : 1),
      };
    });
    localStorage.setItem("am38_extras", JSON.stringify({
      qty, chosen, specialRequest, extrasTotal, baseTotal, grandTotal, days,
      lastMinuteCancel, roadsideAssist, fullCoverage,
      lastMinuteCancelTotal, roadsideAssistTotal, fullCoverageTotal,
    }));
    navigate("/driver-details");
  }

  if (!car || !dates) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Step bar */}
        <div className="mb-6 flex items-center gap-2 text-xs font-black">
          {["Search results ✓", "Options", "Driver details", "Payment", "Confirmation"].map((s, i) => (
            <span key={s} className={`rounded-full px-4 py-2 ${i === 1 ? "bg-blue-600 text-white" : i === 0 ? "bg-green-500 text-white" : "bg-white text-slate-500"}`}>{s}</span>
          ))}
        </div>

        <button onClick={() => navigate("/cars")} className="mb-4 inline-flex items-center gap-2 font-black text-red-600 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Fleet</button>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* LEFT — main content */}
          <div className="space-y-6">

            {/* Rental terms row — clickable, matches EconomyBookings layout */}
            <div className="rounded-3xl bg-white p-5 shadow-2xl">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: "rental_conditions", label: "Rental Conditions", icon: ShieldCheck,
                    body: "Minimum age 21, valid driving license held for 1+ year, security deposit required at pickup, vehicle must be returned in the same condition as collected." },
                  { id: "fuel_policy", label: "Fuel to Fuel", icon: Fuel,
                    body: "Your car is delivered with a full tank. Return it with the same fuel level — refuel to full before drop-off, or a refuelling charge plus service fee applies." },
                  { id: "meet_greet", label: "Meet & Greet", icon: UsersIcon,
                    body: "Our team meets you at SSR International Airport arrivals with a personalised welcome sign, walks you to your vehicle, and completes handover on the spot." },
                ].map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => setOpenInfo(openInfo === item.id ? null : item.id)}
                      className="flex w-full items-center gap-2 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 transition"
                    >
                      <item.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-bold text-blue-700 underline">{item.label}</span>
                      {openInfo === item.id ? <ChevronUp className="ml-auto h-4 w-4 text-slate-400" /> : <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />}
                    </button>
                    {openInfo === item.id && (
                      <div className="mt-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">{item.body}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-2xl">
              <h1 className="text-3xl font-black text-black">✨ Extra Options</h1>
              <p className="mt-1 text-slate-500 font-semibold">All prices shown transparently in MUR and USD. Pay once — no surprises.</p>

              {/* PROTECTION — EconomyBookings style: title, desc, price, toggle button */}
              <div className="mt-6 space-y-4">
                <h2 className="text-lg font-black text-black flex items-center gap-2"><Shield className="h-5 w-5 text-blue-600" /> Protection & Coverage</h2>

                {/* Last Minute Cancellation */}
                <div className={`rounded-2xl border-2 p-4 transition ${lastMinuteCancel ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-black text-black flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" />Last Minute Cancellation</p>
                      <p className="mt-1 text-sm text-slate-600">Cancel your booking up to 48 hours before pick-up time and get a full refund.</p>
                      <p className="mt-1 text-sm font-black text-red-600">$10/day <span className="text-slate-400 font-bold">≈ {fmtMUR(usdToMur(10))}/day</span></p>
                    </div>
                    <button onClick={() => setLastMinuteCancel(!lastMinuteCancel)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black transition ${lastMinuteCancel ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                      {lastMinuteCancel ? "Remove" : "Add"}
                    </button>
                  </div>
                  {lastMinuteCancel && <div className="mt-2 text-right text-sm font-black text-green-700">+ {fmtMUR(usdToMur(10) * days)} for {days} days</div>}
                </div>
                {!lastMinuteCancel && (
                  <p className="text-xs font-bold text-amber-600 -mt-2">⚠ Without this, cancellations within 48h of pickup are non-refundable.</p>
                )}

                {/* Roadside Assistance */}
                <div className={`rounded-2xl border-2 p-4 transition ${roadsideAssist ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-black text-black flex items-center gap-2"><Wind className="h-4 w-4 text-blue-600" />Roadside Assistance</p>
                      <p className="mt-1 text-sm text-slate-600">Enjoy 24/7 roadside assistance anywhere on the island for the full length of your rental.</p>
                      <p className="mt-1 text-sm font-black text-red-600">$10/day <span className="text-slate-400 font-bold">≈ {fmtMUR(usdToMur(10))}/day</span></p>
                    </div>
                    <button onClick={() => setRoadsideAssist(!roadsideAssist)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black transition ${roadsideAssist ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                      {roadsideAssist ? "Remove" : "Add"}
                    </button>
                  </div>
                  {roadsideAssist && <div className="mt-2 text-right text-sm font-black text-green-700">+ {fmtMUR(usdToMur(10) * days)} for {days} days</div>}
                </div>

                {/* Full Coverage — clickable expandable, EconomyBookings style */}
                <div className={`rounded-2xl border-2 transition ${fullCoverage ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                  <button onClick={() => setOpenInfo(openInfo === "full_coverage" ? null : "full_coverage")} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                    <div className="flex-1">
                      <p className="font-black text-black flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-red-600" />Full Coverage</p>
                      <p className="mt-1 text-sm text-slate-600">Zero-worry protection for damage, theft, and key loss — pay at the counter.</p>
                      <p className="mt-1 text-sm font-black text-red-600">$20/day <span className="text-slate-400 font-bold">≈ {fmtMUR(usdToMur(20))}/day</span></p>
                    </div>
                    {openInfo === "full_coverage" ? <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                  </button>
                  {openInfo === "full_coverage" && (
                    <div className="border-t border-slate-200 bg-white p-4">
                      <p className="mb-2 text-xs font-black text-slate-500 uppercase">What's covered</p>
                      <div className="space-y-1.5">
                        {FULL_COVERAGE_LINES.map((line) => (
                          <div key={line} className="flex items-center gap-2 text-sm text-slate-700"><Check className="h-4 w-4 text-green-600 flex-shrink-0" />{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 p-4">
                    {fullCoverage && <span className="text-sm font-black text-green-700">+ {fmtMUR(usdToMur(20) * days)} for {days} days</span>}
                    <button onClick={() => setFullCoverage(!fullCoverage)} className={`ml-auto rounded-xl px-4 py-2 text-xs font-black transition ${fullCoverage ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-red-600 text-white hover:bg-red-700"}`}>
                      {fullCoverage ? "Remove" : "Select Full Coverage — Pay at Counter"}
                    </button>
                  </div>
                </div>
              </div>

              {/* SHOW ALL OPTIONS toggle */}
              <div className="mt-6">
                <button
                  onClick={() => setShowAllOptions(!showAllOptions)}
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 font-black text-white hover:bg-black transition"
                >
                  <span>{showAllOptions ? "Hide" : "Show"} all extra options</span>
                  {showAllOptions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {showAllOptions && (
                <div className="mt-4 space-y-3">
                  {EXTRAS_CATALOG.map((e: any) => {
                    const q = qty[e.id] || 0;
                    const unit = e.isUSD ? usdToMur(e.price) : e.price;
                    const lineTotal = q * unit * (e.mode === "per-day" ? days : 1);
                    return (
                      <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition ${q > 0 ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow"><e.icon className="h-6 w-6 text-blue-600" /></div>
                        <div className="min-w-[200px] flex-1">
                          <p className="font-black text-black">{e.name}</p>
                          <p className="text-sm text-slate-500">{e.desc}</p>
                          <p className="mt-1 text-sm font-black text-red-600">
                            {e.isUSD ? `$${e.price}` : fmtMUR(e.price)} <span className="text-blue-700">≈ {e.isUSD ? fmtMUR(usdToMur(e.price)) : fmtUSD(murToUsd(e.price, rate))}</span> <span className="text-slate-400 font-bold">/ {e.mode === "per-day" ? "day" : "rental"}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setQuantity(e.id, q - 1, e.max)} className="h-10 w-10 rounded-full border-2 border-slate-300 font-black text-black hover:bg-white">−</button>
                          <span className="w-6 text-center text-xl font-black text-black">{q}</span>
                          <button onClick={() => setQuantity(e.id, q + 1, e.max)} className="h-10 w-10 rounded-full bg-blue-600 font-black text-white hover:bg-blue-700">+</button>
                        </div>
                        {q > 0 && <div className="w-full text-right text-sm font-black text-green-700 md:w-auto">+ {fmtMUR(lineTotal)} ≈ {fmtUSD(murToUsd(lineTotal, rate))}</div>}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6">
                <label className="mb-1 block text-sm font-black text-black">💬 Special Request / Message</label>
                <textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} rows={3} placeholder="Accessibility needs, surprise for someone, flight delay concerns, anything special..." className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-black focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* RIGHT — car card with "Your rental includes" underneath, then sticky summary */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl bg-white p-6 shadow-2xl">
              <img src={car.image} alt={car.name} className="h-40 w-full rounded-2xl bg-slate-100 object-contain p-3" onError={(ev) => ((ev.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg")} />
              <h2 className="mt-3 text-2xl font-black text-black">{car.name}</h2>
              <p className="text-sm font-bold text-slate-500">{car.av_group} • {car.stock_number} • {car.transmission}</p>
              {car.model_guaranteed !== false && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">✅ Car model guaranteed</span>}
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700"><Calendar className="h-4 w-4 text-blue-600" />{dates.pickupDate} {dates.pickupTime} → {dates.dropoffDate} {dates.dropoffTime} ({days} days)</div>

              {/* YOUR RENTAL INCLUDES — placed directly under the car, well explained */}
              <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4">
                <h3 className="mb-2 text-sm font-black text-green-800 uppercase tracking-wide">Your rental includes</h3>
                <div className="space-y-1.5">
                  {INCLUDED_ALWAYS.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />{f}
                    </div>
                  ))}
                  {lastMinuteCancel && <div className="flex items-center gap-2 text-sm font-semibold text-green-900"><Check className="h-4 w-4 text-green-600 flex-shrink-0" />Last Minute Cancellation</div>}
                  {roadsideAssist && <div className="flex items-center gap-2 text-sm font-semibold text-green-900"><Check className="h-4 w-4 text-green-600 flex-shrink-0" />Roadside Assistance</div>}
                  {fullCoverage && <div className="flex items-center gap-2 text-sm font-semibold text-green-900"><Check className="h-4 w-4 text-green-600 flex-shrink-0" />Full Coverage</div>}
                </div>
              </div>
            </div>

            {/* Sticky price summary */}
            <div className="rounded-3xl bg-white p-6 shadow-2xl">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-bold text-slate-700"><span>Car ({days} days)</span><span>{fmtMUR(baseTotal)}</span></div>
                {extrasTotal > 0 && <div className="flex justify-between font-bold text-slate-700"><span>Extras</span><span>{fmtMUR(extrasTotal)}</span></div>}
                {lastMinuteCancelTotal > 0 && <div className="flex justify-between font-bold text-slate-700"><span>Last Minute Cancellation</span><span>{fmtMUR(lastMinuteCancelTotal)}</span></div>}
                {roadsideAssistTotal > 0 && <div className="flex justify-between font-bold text-slate-700"><span>Roadside Assistance</span><span>{fmtMUR(roadsideAssistTotal)}</span></div>}
                {fullCoverageTotal > 0 && <div className="flex justify-between font-bold text-slate-700"><span>Full Coverage</span><span>{fmtMUR(fullCoverageTotal)}</span></div>}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-black text-black"><span>TOTAL</span><span className="text-red-600">{fmtMUR(grandTotal)}</span></div>
                <div className="text-right text-sm font-black text-blue-700">≈ {fmtUSD(murToUsd(grandTotal, rate))} <span className="text-[10px] text-blue-400">live rate</span></div>
                <p className="pt-1 text-center text-xs font-semibold text-slate-400"><ShieldCheck className="inline h-3 w-3" /> Taxes included • Same-to-same fuel</p>
              </div>
              <button onClick={handleContinue} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-lg font-black text-white shadow-xl transition hover:scale-[1.02]">Continue to book <ArrowRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}