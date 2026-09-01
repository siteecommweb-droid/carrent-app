import * as React from "react";
import { addDays, format, isWithinInterval, startOfDay, endOfDay, differenceInDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/lib/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Car, AlertCircle, CheckCircle, Loader2, ChevronLeft, ChevronRight, CreditCard, Shield, Sparkles, Gift, Zap, MapPin, Users, Fuel, Gauge, Snowflake } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  car: any | null;
  onBooked?: () => void;
};

type Range = { from?: Date; to?: Date };
type TimeSlot = { hour: number; available: boolean };

function toDate(d: any): Date | null {
  const x = new Date(d);
  return isNaN(x.getTime()) ? null : x;
}

export default function BookingCalendarModal({ open, onOpenChange, car, onBooked }: Props) {
  const queryClient = useQueryClient();
  const carId = car?.id ? Number(car.id) : null;
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [range, setRange] = React.useState<Range>({});
  const [pickupTime, setPickupTime] = React.useState<string>("10:00");
  const [dropoffTime, setDropoffTime] = React.useState<string>("10:00");
  const [selectedExtras, setSelectedExtras] = React.useState<Record<string, number>>({});
  const [showExtras, setShowExtras] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [altCars, setAltCars] = React.useState<any[]>([]);

  const { data: bookedRanges = [], isLoading: rangesLoading } = useQuery({
    queryKey: ["booked-ranges", carId, currentMonth],
    queryFn: async () => {
      if (!carId) return [];
      const startMonth = startOfDay(currentMonth);
      const endMonth = endOfDay(addDays(currentMonth, 30));
      const res = await fetchAPI(`/bookings/ranges?carId=${carId}&start=${startMonth.toISOString()}&end=${endMonth.toISOString()}`);
      return res || [];
    },
    enabled: !!carId && open,
  });

  const { data: addons = [] } = useQuery({
    queryKey: ["addons", carId],
    queryFn: async () => {
      const res = await fetchAPI(`/addons?carId=${carId}`);
      return res || [];
    },
    enabled: open,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      return fetchAPI("/bookings", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      toast.success("Booking confirmed! 🎉");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booked-ranges"] });
      onOpenChange(false);
      onBooked?.();
    },
    onError: (e: any) => {
      const msg = e?.message || "Booking failed";
      if (msg.toLowerCase().includes("already booked")) {
        setErrorMsg("Selected dates are no longer available. Please choose different dates.");
        findAlternativeCars();
      } else {
        setErrorMsg(msg);
        toast.error(msg);
      }
    },
  });

  const intervals = React.useMemo(() => {
    return bookedRanges.map((r: any) => ({
      start: startOfDay(toDate(r.start_datetime)!),
      end: endOfDay(toDate(r.end_datetime)!)
    })).filter(Boolean);
  }, [bookedRanges]);

  const disabled = React.useCallback((date: Date) => {
    const today = startOfDay(new Date());
    if (date < today) return true;
    return intervals.some((iv: { start: Date; end: Date }) => isWithinInterval(date, iv));
  }, [intervals]);

  const pricePreview = React.useMemo(() => {
    if (!range.from || !range.to || !car) return null;
    const days = Math.max(1, differenceInDays(range.to, range.from) + 1);
    const baseTotal = days * (car.daily_price || 0);
    const extrasTotal = Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
      const addon = addons.find((a: any) => a.id === id);
      return sum + (addon?.price || 0) * qty;
    }, 0);
    const grandTotal = baseTotal + extrasTotal;
    const weeklyDiscount = days >= 7 ? grandTotal * 0.1 : 0;
    const finalTotal = grandTotal - weeklyDiscount;
    return { days, baseTotal, extrasTotal, weeklyDiscount, grandTotal, finalTotal };
  }, [range, car, selectedExtras, addons]);

  const availableTimeSlots = React.useMemo((): TimeSlot[] => {
    if (!range.from) return [];
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push({ hour, available: true });
    }
    return slots;
  }, [range.from]);

  const findAlternativeCars = async () => {
    try {
      const res = await fetchAPI(`/cars?category=${car?.category}&exclude=${carId}&available=true`);
      setAltCars(res?.slice(0, 3) || []);
    } catch (e) { console.error(e); }
  };

  const handleExtrasChange = (addonId: string, quantity: number) => {
    if (quantity <= 0) {
      const { [addonId]: _, ...rest } = selectedExtras;
      setSelectedExtras(rest);
    } else {
      setSelectedExtras({ ...selectedExtras, [addonId]: quantity });
    }
  };

  const handleConfirm = async () => {
    setErrorMsg(null);
    if (!carId || !range.from || !range.to) return;
    if (step === 1) { setStep(2); return; }
    if (step === 2) { setStep(3); return; }
    createBookingMutation.mutate({
      car_id: carId,
      start_datetime: new Date(`${format(range.from, "yyyy-MM-dd")}T${pickupTime}:00`).toISOString(),
      end_datetime: new Date(`${format(range.to, "yyyy-MM-dd")}T${dropoffTime}:00`).toISOString(),
      extras: selectedExtras,
    });
  };

  const isLoading = rangesLoading || createBookingMutation.isPending;

  const extrasTotal = pricePreview?.extrasTotal || 0;
  const weeklyDiscount = pricePreview?.weeklyDiscount || 0;
  const finalTotal = pricePreview?.finalTotal || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Book {car?.make} {car?.model}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <CalendarDays size={14} /> Select your dates • Choose extras • Confirm payment
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"}`}>{s}</div>
              <span className={`text-sm ${step >= s ? "text-red-600 font-semibold" : "text-gray-400"}`}>
                {s === 1 ? "Dates" : s === 2 ? "Extras" : "Confirm"}
              </span>
              {s < 3 && <ChevronRight size={14} className="text-gray-300 ml-2" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid gap-6 md:grid-cols-[1fr_320px]">
              <div className="border rounded-2xl p-5 bg-white shadow-sm">
                <div className="mb-3 flex justify-between items-center">
                  <h3 className="font-bold">Select your rental period</h3>
                  <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={18} /></button>
                  <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={18} /></button>
                </div>
                <Calendar mode="range" selected={range as any} onSelect={(v: any) => setRange(v || {})} month={currentMonth} onMonthChange={setCurrentMonth} numberOfMonths={2} disabled={disabled} className="rounded-xl pointer-events-auto" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Pickup Time</label><select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 border rounded-lg text-sm">{availableTimeSlots.map(slot => (<option key={slot.hour} value={`${slot.hour}:00`}>{slot.hour}:00 {slot.hour < 12 ? "AM" : "PM"}</option>))}</select></div>
                  <div><label className="text-xs text-gray-500">Dropoff Time</label><select value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} className="w-full p-2 border rounded-lg text-sm">{availableTimeSlots.map(slot => (<option key={slot.hour} value={`${slot.hour}:00`}>{slot.hour}:00 {slot.hour < 12 ? "AM" : "PM"}</option>))}</select></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3"><Car size={18} className="text-blue-600" /><h3 className="font-bold">{car?.make} {car?.model}</h3></div>
                  <div className="grid grid-cols-2 gap-2 text-sm"><div className="flex items-center gap-1 text-gray-600"><Users size={12} />{car?.seats} seats</div><div className="flex items-center gap-1 text-gray-600"><Fuel size={12} />{car?.fuel_type || "Petrol"}</div><div className="flex items-center gap-1 text-gray-600"><Gauge size={12} />Auto</div><div className="flex items-center gap-1 text-gray-600"><Snowflake size={12} />AC</div></div>
                </div>
                <div className="border rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500">Selected Dates</span><span className="font-semibold">{range.from ? format(range.from, "dd MMM") : "—"} — {range.to ? format(range.to, "dd MMM yyyy") : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-semibold">{pricePreview?.days || 0} day{pricePreview?.days !== 1 ? "s" : ""}</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Daily Rate</span><span className="font-bold text-red-600">MUR {car?.daily_price?.toLocaleString() || 0}</span></div>
                  {pricePreview && (<div className="flex justify-between text-lg"><span className="font-bold">Base Total</span><span className="font-black text-red-600">MUR {pricePreview.baseTotal.toLocaleString()}</span></div>)}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {addons.map((addon: any) => (
                  <div key={addon.id} className="border rounded-2xl p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start"><div><h4 className="font-bold">{addon.name}</h4><p className="text-xs text-gray-500">{addon.description}</p><p className="text-sm font-bold text-red-600 mt-1">MUR {addon.price}/day</p></div>
                    <div className="flex items-center gap-2"><button onClick={() => handleExtrasChange(addon.id, (selectedExtras[addon.id] || 0) - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">-</button><span className="w-8 text-center font-bold">{selectedExtras[addon.id] || 0}</span><button onClick={() => handleExtrasChange(addon.id, (selectedExtras[addon.id] || 0) + 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">+</button></div></div>
                  </div>
                ))}
              </div>
              {pricePreview && extrasTotal > 0 && (<div className="bg-green-50 rounded-2xl p-4 text-center"><span className="text-sm">Extras total: </span><span className="font-bold text-green-700">MUR {extrasTotal.toLocaleString()}</span></div>)}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-lg flex items-center gap-2"><CheckCircle size={18} className="text-green-600" />Booking Summary</h3>
                  <div className="space-y-2"><div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-semibold">{car?.make} {car?.model}</span></div><div className="flex justify-between"><span className="text-gray-500">Pickup</span><span className="font-semibold">{range.from ? format(range.from, "dd MMM yyyy") : "—"} at {pickupTime}</span></div><div className="flex justify-between"><span className="text-gray-500">Dropoff</span><span className="font-semibold">{range.to ? format(range.to, "dd MMM yyyy") : "—"} at {dropoffTime}</span></div><div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-semibold">{pricePreview?.days} days</span></div></div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={18} className="text-red-600" />Price Breakdown</h3>
                  <div className="space-y-2"><div className="flex justify-between"><span>Base rental</span><span>MUR {pricePreview?.baseTotal?.toLocaleString() || 0}</span></div><div className="flex justify-between"><span>Extras</span><span>MUR {extrasTotal.toLocaleString()}</span></div>{weeklyDiscount > 0 && (<div className="flex justify-between text-green-600"><span>Weekly discount (10%)</span><span>- MUR {weeklyDiscount.toLocaleString()}</span></div>)}<div className="flex justify-between border-t pt-2 text-xl"><span className="font-black">Total</span><span className="font-black text-red-600">MUR {finalTotal.toLocaleString()}</span></div></div>
                </div>
              </div>
              {errorMsg && (<div className="bg-red-50 rounded-2xl p-4 flex items-start gap-3 text-red-700"><AlertCircle size={18} className="shrink-0 mt-0.5" /><span className="text-sm">{errorMsg}</span></div>)}
              {altCars.length > 0 && (<div className="border rounded-2xl p-4"><p className="text-sm font-bold mb-2">🚗 Alternative cars available</p><div className="flex gap-3 overflow-x-auto">{altCars.map(c => (<div key={c.id} className="min-w-[180px] p-3 border rounded-xl"><p className="font-bold">{c.make} {c.model}</p><p className="text-sm text-green-600">MUR {c.daily_price}/day</p><button onClick={() => window.location.href = `/cars?car=${c.id}`} className="mt-2 text-xs text-red-600">View →</button></div>))}</div></div>)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between gap-3 mt-6 pt-4 border-t">
          {step > 1 && (<Button variant="outline" onClick={() => setStep((step - 1) as 1 | 2)} disabled={isLoading}>Back</Button>)}
          <Button onClick={handleConfirm} disabled={!range.from || !range.to || isLoading || (step === 3 && !carId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-6">
            {isLoading ? (<Loader2 className="animate-spin" size={20} />) : (step === 3 ? <span>Confirm & Pay MUR {finalTotal.toLocaleString()}</span> : step === 2 ? <span>Review & Confirm →</span> : <span>Continue to Extras →</span>)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}