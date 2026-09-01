export type Car = {
  fuelType: string | undefined;
  id: number | string;
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  fuel?: string;
  seats?: number;
  price?: number;
  luggage?: number;
  door?: number;
  transmission?: string;
  rating?: number;
  popular?: boolean;
  description?: string;
  image?: string;
};

export type ExtraChargeMode = "per-day" | "per-rental";

export type ExtraDefinition = {
  id: string;
  name: string;
  price: number;
  mode: ExtraChargeMode;
  description: string;
  icon?: "Baby" | "MapPinned" | "HeartHandshake" | "ShieldCheck";
};

export type BookingDraftExtras = Record<string, number>;

export type BookingDraft = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  flightNumber: string;
  fullName: string;
  email: string;
  phone: string;
  paymentMethod: "pay-now" | "pay-later";
  extras: BookingDraftExtras;
  notes: string;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "reserved"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Partial"
  | "Unpaid"
  | "Failed"
  | "Pay on Arrival";

export type BookingPriceBreakdown = {
  currency: "MUR";
  exchangeRate: number;
  days: number;
  dailyRateMUR: number;
  vehicleTotalMUR: number;
  extrasTotalMUR: number;
  grandTotalMUR: number;
  extras: Array<{
    id: string;
    name: string;
    mode: ExtraChargeMode;
    unitPriceMUR: number;
    quantity: number;
    daysApplied: number;
    totalMUR: number;
  }>;
};

export type BookingRecord = {
  id: string;
  reference: string;
  createdAt: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "pay-now" | "pay-later";
  car: Car;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  flightNumber: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  extras: Array<{
    id: string;
    name: string;
    mode: ExtraChargeMode;
    priceMUR: number;
    quantity: number;
    totalMUR: number;
  }>;
  price: BookingPriceBreakdown;
};







