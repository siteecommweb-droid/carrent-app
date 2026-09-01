import { extrasCatalog } from "@/data/extras";
import type {
  BookingDraft,
  BookingPriceBreakdown,
  BookingRecord,
  Car,
  ExtraDefinition,
} from "@/types/booking";

export const MUR_EXCHANGE_RATE = 50;

export function toMUR(amount: number) {
  return Math.round(amount * MUR_EXCHANGE_RATE);
}

export function formatMUR(amount: number) {
  return `MUR ${amount.toLocaleString("en-MU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatShortDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateValue?: string, timeValue?: string) {
  if (!dateValue) return "N/A";
  return `${formatShortDate(dateValue)}${timeValue ? ` • ${timeValue}` : ""}`;
}

export function getCarDailyRate(car?: Partial<Car> | null) {
  return Number(car?.price || 0);
}

export function computeRentalDays(
  pickupDate?: string,
  pickupTime?: string,
  dropoffDate?: string,
  dropoffTime?: string,
) {
  if (!pickupDate || !dropoffDate) return 1;

  const pickup = new Date(`${pickupDate}T${pickupTime || "10:00"}`);
  const dropoff = new Date(`${dropoffDate}T${dropoffTime || "10:00"}`);

  if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime()))
    return 1;

  const diff = dropoff.getTime() - pickup.getTime();
  if (diff <= 0) return 1;

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getDefaultDraft(): BookingDraft {
  const today = new Date();

  const pickup = new Date(today);
  pickup.setDate(today.getDate() + 1);

  const dropoff = new Date(today);
  dropoff.setDate(today.getDate() + 4);

  const asInputDate = (d: Date) => d.toISOString().split("T")[0];

  return {
    pickupLocation: "SSR International Airport",
    dropoffLocation: "SSR International Airport",
    pickupDate: asInputDate(pickup),
    pickupTime: "10:00",
    dropoffDate: asInputDate(dropoff),
    dropoffTime: "10:00",
    flightNumber: "",
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "pay-later",
    extras: {},
    notes: "",
  };
}

export function getExtraDefinition(
  extraId: string,
): ExtraDefinition | undefined {
  return extrasCatalog.find((item) => item.id === extraId);
}

export function buildPriceBreakdown(
  car: Car,
  draft: BookingDraft,
): BookingPriceBreakdown {
  const days = computeRentalDays(
    draft.pickupDate,
    draft.pickupTime,
    draft.dropoffDate,
    draft.dropoffTime,
  );

  const dailyRateMUR = toMUR(getCarDailyRate(car));
  const vehicleTotalMUR = dailyRateMUR * days;

  const extras = Object.entries(draft.extras)
    .map(([id, quantity]) => {
      const def = getExtraDefinition(id);
      if (!def || quantity <= 0) return null;

      const unitPriceMUR = def.price;
      const daysApplied = def.mode === "per-day" ? days : 1;
      const totalMUR = unitPriceMUR * quantity * daysApplied;

      return {
        id: def.id,
        name: def.name,
        mode: def.mode,
        unitPriceMUR,
        quantity,
        daysApplied,
        totalMUR,
      };
    })
    .filter(Boolean) as BookingPriceBreakdown["extras"];

  const extrasTotalMUR = extras.reduce((sum, item) => sum + item.totalMUR, 0);

  return {
    currency: "MUR",
    exchangeRate: MUR_EXCHANGE_RATE,
    days,
    dailyRateMUR,
    vehicleTotalMUR,
    extrasTotalMUR,
    grandTotalMUR: vehicleTotalMUR + extrasTotalMUR,
    extras,
  };
}

export function buildBookingRecord(
  car: Car,
  draft: BookingDraft,
): BookingRecord {
  const now = new Date();

  const id = `bk_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
  // Fixed: .slice() on string, not on number
  const reference = `AM38-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

  const price = buildPriceBreakdown(car, draft);

  return {
    id,
    reference,
    createdAt: now.toISOString(),
    // ✅ FIXED: status must be "confirmed" or "reserved" (lowercase)
    status: draft.paymentMethod === "pay-now" ? "confirmed" : "reserved",
    paymentStatus:
      draft.paymentMethod === "pay-now" ? "Paid" : "Pay on Arrival",
    paymentMethod: draft.paymentMethod,
    car,
    pickupLocation: draft.pickupLocation,
    dropoffLocation: draft.dropoffLocation,
    pickupDate: draft.pickupDate,
    pickupTime: draft.pickupTime,
    dropoffDate: draft.dropoffDate,
    dropoffTime: draft.dropoffTime,
    flightNumber: draft.flightNumber,
    fullName: draft.fullName,
    email: draft.email,
    phone: draft.phone,
    notes: draft.notes,
    extras: price.extras.map((item) => ({
      id: item.id,
      name: item.name,
      mode: item.mode,
      priceMUR: item.unitPriceMUR,
      quantity: item.quantity,
      totalMUR: item.totalMUR,
    })),
    price,
  };
}
