import * as React from "react";
import {
  User,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  ShieldCheck,
  Loader2,
  Calendar,
  IdCard,
  Smartphone,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import * as api from "@/lib/api";
import { useMeQuery } from "@/lib/queries";

interface UserProfile {
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  passport_no: string;
  license_no: string;
  country: string;
  address_line1: string;
  city: string;
  email: string;
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCompleted?: () => void;
};

const defaultForm: UserProfile = {
  first_name: "",
  last_name: "",
  phone: "",
  dob: "",
  passport_no: "",
  license_no: "",
  country: "",
  address_line1: "",
  city: "",
  email: "",
};

export default function ProfileRequiredModal({
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const { data: meRaw, refetch } = useMeQuery(open);
  const me = (meRaw || {}) as UserProfile;

  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState<UserProfile>(defaultForm);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (me) {
      setForm({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        phone: me.phone || "",
        dob: me.dob ? String(me.dob).slice(0, 10) : "",
        passport_no: me.passport_no || "",
        license_no: me.license_no || "",
        country: me.country || "",
        address_line1: me.address_line1 || "",
        city: me.city || "",
        email: me.email || "",
      });
    }
  }, [me]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.first_name?.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name?.trim()) newErrors.last_name = "Last name is required";
    if (!form.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.passport_no?.trim()) newErrors.passport_no = "Passport number is required";
    if (!form.license_no?.trim()) newErrors.license_no = "Driver license is required";
    if (!form.country?.trim()) newErrors.country = "Country is required";
    if (!form.city?.trim()) newErrors.city = "City is required";
    if (!form.address_line1?.trim()) newErrors.address_line1 = "Address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const set = (key: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const save = async () => {
    if (!validateForm()) return;
    
    setBusy(true);
    try {
      // Use api.get for fetching profile
      const res = await api.get("/me");
      
      // Update profile with form data
      setForm(res);
      
      await refetch();

      if (res?.profile_completed) {
        onOpenChange(false);
        onCompleted?.();
      } else {
        alert("Please complete all required fields.");
      }
    } catch (e: any) {
      alert(e?.message || "Failed to save profile");
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[950px] overflow-hidden rounded-3xl border border-white/10 bg-white p-0 shadow-2xl">
        <div className="grid md:grid-cols-[320px_1fr]">
          {/* Left Panel - Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative z-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black">Verification Required</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Complete your traveler profile to unlock bookings, airport pickup,
                digital invoices, QR passes, and premium tourism features.
              </p>
              <div className="mt-8 space-y-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-black font-bold">✓</div>
                  Driver verification
                </div>
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-black font-bold">✓</div>
                  Faster checkout
                </div>
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-black font-bold">✓</div>
                  Secure rentals
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-8 max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">Complete Your Profile</DialogTitle>
              <p className="text-sm text-black/50 mt-1">All fields are required for verification</p>
            </DialogHeader>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <User size={15} /> First Name *
                </label>
                <input className={inputClass} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
                {errors.first_name && <div className={errorClass}>{errors.first_name}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <User size={15} /> Last Name *
                </label>
                <input className={inputClass} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
                {errors.last_name && <div className={errorClass}>{errors.last_name}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <Smartphone size={15} /> Phone *
                </label>
                <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+230 1234 5678" />
                {errors.phone && <div className={errorClass}>{errors.phone}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <Calendar size={15} /> Date of Birth *
                </label>
                <input type="date" className={inputClass} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                {errors.dob && <div className={errorClass}>{errors.dob}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <IdCard size={15} /> Passport Number *
                </label>
                <input className={inputClass} value={form.passport_no} onChange={(e) => set("passport_no", e.target.value)} />
                {errors.passport_no && <div className={errorClass}>{errors.passport_no}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <CreditCard size={15} /> Driving Licence *
                </label>
                <input className={inputClass} value={form.license_no} onChange={(e) => set("license_no", e.target.value)} />
                {errors.license_no && <div className={errorClass}>{errors.license_no}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <Globe size={15} /> Country *
                </label>
                <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g., Mauritius, France, UK" />
                {errors.country && <div className={errorClass}>{errors.country}</div>}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <MapPin size={15} /> City *
                </label>
                <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
                {errors.city && <div className={errorClass}>{errors.city}</div>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <MapPin size={15} /> Full Address *
                </label>
                <input className={inputClass} value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} placeholder="Street address, apartment, building" />
                {errors.address_line1 && <div className={errorClass}>{errors.address_line1}</div>}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button className="h-12 flex-1 rounded-2xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all" disabled={busy} onClick={save}>
                {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save & Continue"}
              </Button>
              <Button className="h-12 flex-1 rounded-2xl" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            </div>

            <p className="mt-4 text-xs text-black/40 flex items-center gap-1">
              <ShieldCheck size={12} /> Your details remain securely encrypted and are only used for booking verification.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}