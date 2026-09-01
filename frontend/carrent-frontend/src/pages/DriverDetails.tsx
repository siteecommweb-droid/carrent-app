import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Upload, Hotel, Home, Building2, Plane, Users, Luggage, CheckCircle2, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { fmtMUR, fmtUSD, murToUsd, useLiveRate, getRate } from "@/lib/dualCurrency";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const COUNTRIES = ["Mauritius","France","United Kingdom","Germany","Italy","Réunion","India","South Africa","China","Switzerland","Belgium","Netherlands","Spain","UAE","USA","Australia","Other"];
const PURPOSES = ["Holiday / Tourism","Honeymoon","Business","Family Visit","Medical","Wedding / Event","Other"];

export default function DriverDetails() {
  const navigate = useNavigate();
  const rate = useLiveRate();
  const [car, setCar] = useState<any>(null);
  const [dates, setDates] = useState<any>(null);
  const [extras, setExtras] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [f, setF] = useState({
    title: "Mr", first_name: "", surname: "", email: "", phone: "",
    date_of_birth: "", nationality: "France", country_of_residence: "France", home_address: "",
    passport_number: "", id_number: "", licence_number: "", licence_country: "France",
    flight_number: "",
    accommodation_type: "hotel", accommodation_name: "", accommodation_address: "", accommodation_ref: "",
    stay_from: "", stay_to: "",
    adults: 2, children: 0, infants: 0, luggage_large: 2, luggage_small: 2,
    purpose_of_visit: "Holiday / Tourism",
  });
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [licenceFile, setLicenceFile] = useState<File | null>(null);

  // Phone OTP verification
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState("");

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("am38_selected_car") || "null");
    const d = JSON.parse(localStorage.getItem("am38_search") || "null");
    const e = JSON.parse(localStorage.getItem("am38_extras") || "null");
    if (!c || !d?.pickupDate || !e) { toast.error("Please select car, dates and options first"); navigate("/cars"); return; }
    setCar(c); setDates(d); setExtras(e);
    setF((p) => ({ ...p, stay_from: d.pickupDate, stay_to: d.dropoffDate }));
  }, [navigate]);

  const stayDays = useMemo(() => {
    if (!f.stay_from || !f.stay_to) return 0;
    return Math.max(1, Math.ceil((new Date(f.stay_to).getTime() - new Date(f.stay_from).getTime()) / 86400000));
  }, [f.stay_from, f.stay_to]);

  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  async function sendPhoneOtp() {
    if (!f.phone || f.phone.trim().length < 6) return toast.error("Enter a valid phone number first");
    try {
      setSendingOtp(true);
      const res = await fetch(`${API_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: f.phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not send code");
      setOtpSent(true);
      setDevOtpHint(data.devCode ? String(data.devCode) : "");
      toast.success(data.devCode ? `Dev mode — your code is ${data.devCode}` : "Code sent by SMS");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send verification code");
    } finally {
      setSendingOtp(false);
    }
  }

  async function verifyPhoneOtp() {
    if (!otpCode || otpCode.length < 4) return toast.error("Enter the code you received");
    try {
      setVerifyingOtp(true);
      const res = await fetch(`${API_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: f.phone, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Invalid code");
      setPhoneVerified(true);
      toast.success("Phone number verified!");
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function handleSubmit() {
    const required: [string, string][] = [
      [f.first_name, "First name"], [f.surname, "Surname"], [f.email, "Email"], [f.phone, "Phone"],
      [f.date_of_birth, "Date of birth"], [f.home_address, "Address of origin"],
      [f.licence_number, "Driving licence number"], [f.accommodation_name, "Place of stay in Mauritius"],
    ];
    for (const [v, label] of required) if (!String(v).trim()) return toast.error(`${label} is required`);
    if (!phoneVerified) return toast.error("Please verify your phone number before continuing");
    if (!passportFile) return toast.error("Passport photo upload is required");
    if (!licenceFile) return toast.error("Driving licence upload is required");
    const age = (Date.now() - new Date(f.date_of_birth).getTime()) / (365.25 * 86400000);
    if (age < 21) return toast.error("Driver must be at least 21 years old");

    try {
      setSubmitting(true);
      toast.loading("Saving your reservation...", { id: "resv" });
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("car_id", String(car.id));
      fd.append("car_name", car.name);
      fd.append("av_group", car.av_group || "");
      fd.append("model_guaranteed", String(car.model_guaranteed !== false));
      fd.append("pickup_location", dates.pickupLocation || "SSR International Airport");
      fd.append("dropoff_location", dates.dropoffLocation || "SSR International Airport");
      fd.append("pickup_date", `${dates.pickupDate} ${dates.pickupTime || "10:00"}`);
      fd.append("return_date", `${dates.dropoffDate} ${dates.dropoffTime || "10:00"}`);
      fd.append("days", String(extras.days));
      fd.append("stay_length_days", String(stayDays));
      fd.append("special_request", extras.specialRequest || "");
      fd.append("extras_json", JSON.stringify(extras.chosen || []));
      fd.append("base_total_mur", String(extras.baseTotal));
      fd.append("extras_total_mur", String(extras.extrasTotal));
      fd.append("grand_total_mur", String(extras.grandTotal));
      fd.append("grand_total_usd", murToUsd(extras.grandTotal, getRate()).toFixed(2));
      fd.append("passport", passportFile);
      if (idFile) fd.append("id_doc", idFile);
      fd.append("licence", licenceFile);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save reservation");

      localStorage.setItem("am38_reservation", JSON.stringify(data));
      toast.success(`Reservation ${data.reference} saved!`, { id: "resv" });
      navigate("/payment");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Could not save reservation", { id: "resv" });
    } finally {
      setSubmitting(false);
    }
  }

  if (!car || !extras) return null;

  const inp = "h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-black outline-none focus:border-blue-500";
  const lab = "mb-1 block text-xs font-black text-slate-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center gap-2 text-xs font-black">
          {["Search results ✓", "Options ✓", "Driver details", "Payment", "Confirmation"].map((s, i) => (
            <span key={s} className={`rounded-full px-4 py-2 ${i === 2 ? "bg-blue-600 text-white" : i < 2 ? "bg-green-500 text-white" : "bg-white text-slate-500"}`}>{s}</span>
          ))}
        </div>
        <button onClick={() => navigate("/extras")} className="mb-4 inline-flex items-center gap-2 font-black text-red-600 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Options</button>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* MAIN DRIVER */}
            <section className="rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-black">👤 Main Driver — Legal Details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div><label className={lab}>Title</label><select value={f.title} onChange={(e) => set("title", e.target.value)} className={inp}><option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option></select></div>
                <div><label className={lab}>First Name *</label><input value={f.first_name} onChange={(e) => set("first_name", e.target.value)} className={inp} /></div>
                <div><label className={lab}>Surname *</label><input value={f.surname} onChange={(e) => set("surname", e.target.value)} className={inp} /></div>
                <div><label className={lab}>Email *</label><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={inp} /></div>

                <div>
                  <label className={lab}>Phone / WhatsApp *</label>
                  <div className="flex gap-2">
                    <input value={f.phone} onChange={(e) => { set("phone", e.target.value); setPhoneVerified(false); setOtpSent(false); }} className={inp} placeholder="+230..." />
                    <button type="button" onClick={sendPhoneOtp} disabled={sendingOtp || phoneVerified} className="shrink-0 flex items-center gap-1 rounded-xl bg-blue-600 px-4 text-xs font-black text-white disabled:opacity-50">
                      {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {phoneVerified ? "Verified" : "Send Code"}
                    </button>
                  </div>
                </div>

                <div><label className={lab}>Date of Birth * (min 21)</label><input type="date" value={f.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} className={inp} /></div>

                {otpSent && !phoneVerified && (
                  <div className="md:col-span-3 rounded-2xl bg-blue-50 border border-blue-200 p-4">
                    <p className="mb-2 text-xs font-black text-blue-800">📱 Enter the 6-digit code sent to {f.phone}</p>
                    {devOtpHint && <p className="mb-2 text-xs font-bold text-orange-600">Dev mode (no real Twilio yet) — your code is <span className="font-black">{devOtpHint}</span></p>}
                    <div className="flex gap-2">
                      <input value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))} className={`${inp} max-w-[160px]`} placeholder="123456" />
                      <button type="button" onClick={verifyPhoneOtp} disabled={verifyingOtp} className="flex items-center gap-1 rounded-xl bg-green-600 px-4 text-sm font-black text-white disabled:opacity-50">
                        {verifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Verify
                      </button>
                      <button type="button" onClick={sendPhoneOtp} disabled={sendingOtp} className="text-xs font-bold text-blue-600 underline">Resend</button>
                    </div>
                  </div>
                )}
                {phoneVerified && (
                  <div className="md:col-span-3 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-black text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> Phone number verified
                  </div>
                )}

                <div><label className={lab}>Nationality</label><select value={f.nationality} onChange={(e) => set("nationality", e.target.value)} className={inp}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label className={lab}>Country of Residence</label><select value={f.country_of_residence} onChange={(e) => set("country_of_residence", e.target.value)} className={inp}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label className={lab}>Flight Number</label><input value={f.flight_number} onChange={(e) => set("flight_number", e.target.value)} className={inp} placeholder="MK015" /></div>
                <div className="md:col-span-3"><label className={lab}>Address of Origin (home country) *</label><input value={f.home_address} onChange={(e) => set("home_address", e.target.value)} className={inp} /></div>
              </div>
            </section>

            {/* DOCUMENTS */}
            <section className="rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-black">🛂 Identity & Licence Documents</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div><label className={lab}>Passport Number</label><input value={f.passport_number} onChange={(e) => set("passport_number", e.target.value)} className={inp} /></div>
                <div><label className={lab}>National ID Number</label><input value={f.id_number} onChange={(e) => set("id_number", e.target.value)} className={inp} /></div>
                <div><label className={lab}>Driving Licence Number *</label><input value={f.licence_number} onChange={(e) => set("licence_number", e.target.value)} className={inp} /></div>
                <div><label className={lab}>Licence Issued In</label><select value={f.licence_country} onChange={(e) => set("licence_country", e.target.value)} className={inp}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                <FileBox label="Passport Photo Upload *" file={passportFile} onFile={setPassportFile} />
                <FileBox label="ID Upload (optional)" file={idFile} onFile={setIdFile} />
                <FileBox label="Driving Licence Upload *" file={licenceFile} onFile={setLicenceFile} />
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-400">🔒 Documents are stored securely and used only for your rental contract, as required by Mauritius law.</p>
            </section>

            {/* STAY IN MAURITIUS */}
            <section className="rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-black">🏝 Your Stay in Mauritius</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[{ v: "hotel", l: "Hotel", I: Hotel }, { v: "bnb", l: "BnB / Airbnb", I: Home }, { v: "villa", l: "Villa / Rental", I: Building2 }, { v: "private", l: "Family / Private", I: Users }].map(({ v, l, I }) => (
                  <button key={v} onClick={() => set("accommodation_type", v)} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 font-black transition ${f.accommodation_type === v ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}><I className="h-6 w-6" />{l}</button>
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div><label className={lab}>{f.accommodation_type === "hotel" ? "Hotel Name *" : f.accommodation_type === "bnb" ? "BnB / Airbnb Name *" : f.accommodation_type === "villa" ? "Villa / Residence Name *" : "Host Family Name *"}</label><input value={f.accommodation_name} onChange={(e) => set("accommodation_name", e.target.value)} className={inp} /></div>
                <div><label className={lab}>{f.accommodation_type === "hotel" ? "Hotel Booking Reference" : "Booking / Contact Reference"}</label><input value={f.accommodation_ref} onChange={(e) => set("accommodation_ref", e.target.value)} className={inp} /></div>
                <div className="md:col-span-2"><label className={lab}>Address in Mauritius</label><input value={f.accommodation_address} onChange={(e) => set("accommodation_address", e.target.value)} className={inp} /></div>
                <div><label className={lab}>Stay From</label><input type="date" value={f.stay_from} onChange={(e) => set("stay_from", e.target.value)} className={inp} /></div>
                <div><label className={lab}>Stay To</label><input type="date" value={f.stay_to} onChange={(e) => set("stay_to", e.target.value)} className={inp} /></div>
              </div>
              {stayDays > 0 && <p className="mt-2 text-sm font-black text-green-700">✅ Duration of stay: {stayDays} days</p>}
            </section>

            {/* PASSENGERS & LUGGAGE */}
            <section className="rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="flex items-center gap-2 text-2xl font-black text-black"><Users className="h-6 w-6 text-blue-600" /> Passengers & Luggage</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                <Counter label="Adults" value={f.adults} min={1} onChange={(v) => set("adults", v)} />
                <Counter label="Children (2–11)" value={f.children} min={0} onChange={(v) => set("children", v)} />
                <Counter label="Infants (0–2)" value={f.infants} min={0} onChange={(v) => set("infants", v)} />
                <Counter label="Large Luggage" value={f.luggage_large} min={0} onChange={(v) => set("luggage_large", v)} />
                <Counter label="Small Luggage" value={f.luggage_small} min={0} onChange={(v) => set("luggage_small", v)} />
              </div>
              {car.seats && f.adults + f.children > car.seats && <p className="mt-3 text-sm font-black text-orange-600">⚠ Your group ({f.adults + f.children}) exceeds this car's {car.seats} seats — consider our 7 Seater (MVAR) fleet.</p>}
              <div className="mt-4"><label className={lab}>Purpose of Visit</label><select value={f.purpose_of_visit} onChange={(e) => set("purpose_of_visit", e.target.value)} className={inp}>{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select></div>
            </section>
          </div>

          {/* SUMMARY */}
          <div className="h-fit rounded-3xl bg-white p-6 shadow-2xl lg:sticky lg:top-24">
            <img src={car.image} alt={car.name} className="h-36 w-full rounded-2xl bg-slate-100 object-contain p-3" onError={(ev) => ((ev.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg")} />
            <h2 className="mt-3 text-xl font-black text-black">{car.name}</h2>
            <p className="text-xs font-bold text-slate-500">{dates.pickupDate} → {dates.dropoffDate} • {extras.days} days</p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between font-bold text-slate-700"><span>Car total</span><span>{fmtMUR(extras.baseTotal)}</span></div>
              <div className="flex justify-between font-bold text-slate-700"><span>Extras</span><span>{fmtMUR(extras.extrasTotal)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-black text-black"><span>TOTAL</span><span className="text-red-600">{fmtMUR(extras.grandTotal)}</span></div>
              <div className="text-right text-sm font-black text-blue-700">≈ {fmtUSD(murToUsd(extras.grandTotal, rate))}</div>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-lg font-black text-white shadow-xl transition hover:scale-[1.02] disabled:opacity-50">
              {submitting ? "Saving..." : <>Continue to Payment <ArrowRight className="h-5 w-5" /></>}
            </button>
            <p className="mt-3 text-center text-xs font-semibold text-slate-400"><ShieldCheck className="inline h-3 w-3" /> Saved securely to AM38 • <Plane className="inline h-3 w-3" /> Airport meet & greet included</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileBox({ label, file, onFile }: { label: string; file: File | null; onFile: (f: File | null) => void }) {
  return (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition ${file ? "border-green-500 bg-green-50" : "border-slate-300 bg-slate-50 hover:border-blue-400"}`}>
      <Upload className={`h-6 w-6 ${file ? "text-green-600" : "text-slate-400"}`} />
      <span className="text-xs font-black text-slate-700">{label}</span>
      <span className={`text-[11px] font-bold ${file ? "text-green-700" : "text-slate-400"}`}>{file ? `✅ ${file.name}` : "JPG, PNG or PDF (max 8MB)"}</span>
      <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
    </label>
  );
}

function Counter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <p className="text-xs font-black text-slate-600">{label}</p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="h-8 w-8 rounded-full border-2 border-slate-300 font-black text-black">−</button>
        <span className="w-5 text-lg font-black text-black">{value}</span>
        <button onClick={() => onChange(value + 1)} className="h-8 w-8 rounded-full bg-blue-600 font-black text-white">+</button>
      </div>
    </div>
  );
}