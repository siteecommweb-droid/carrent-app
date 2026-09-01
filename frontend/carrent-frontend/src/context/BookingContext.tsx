import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import {
  Car,
  BookingDraft,
  BookingRecord,
  BookingStatus,
} from "@/types/booking";

import { buildBookingRecord, getDefaultDraft } from "@/utils/booking";
import {
  fetchBookings,
  createBooking as apiCreateBooking,
} from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export type InvoiceStatus = "draft" | "issued" | "paid" | "cancelled";

export type Invoice = {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  customerName: string;
  totalMUR: number;
  status: InvoiceStatus;
  createdAt: string;
};

type BookingContextType = {
  selectedCar: Car | null;
  bookingDraft: BookingDraft;
  bookings: BookingRecord[];
  invoices: Invoice[];
  loadingBookings: boolean;
  bookingError: string;

  selectCar: (car: Car) => void;
  clearSelectedCar: () => void;
  resetDraft: () => void;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  updateExtraQuantity: (id: string, qty: number) => void;

  createBooking: () => Promise<BookingRecord | null>;
  reloadBookings: () => Promise<void>;

  markInvoicePaid: (bookingId: string | number) => void;
  markInvoiceIssued: (bookingId: string | number) => void;
  markInvoiceCancelled: (bookingId: string | number) => void;

  getFleetAvailability: (carId: string | number) => string;
  updateBookingStatus: (
    bookingId: string | number,
    status: BookingStatus
  ) => void;

  sendWhatsAppNotification: (bookingId: string | number, message: string) => Promise<void>;
  sendEmailNotification: (bookingId: string | number, subject: string, body: string) => Promise<void>;
};

const BookingContext = createContext<BookingContextType>(
  {} as BookingContextType
);

function normalizeBookingStatus(status: unknown): BookingStatus {
  const s = String(status || "").toLowerCase();

  if (s.includes("confirm")) return "confirmed";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("complete")) return "completed";
  if (s.includes("reserve")) return "reserved";

  return "pending";
}

function isActiveBooking(status: unknown) {
  const s = normalizeBookingStatus(status);
  return s !== "cancelled" && s !== "completed";
}

function normalizeRemoteBooking(raw: any): BookingRecord {
  const draftDefaults = getDefaultDraft();

  return {
    id: String(raw?.id ?? Date.now()),
    reference: String(
      raw?.reference ||
        raw?.booking_reference ||
        `AM38-${raw?.id ?? Date.now()}`
    ),
    createdAt: String(
      raw?.createdAt || raw?.created_at || new Date().toISOString()
    ),
    status: normalizeBookingStatus(raw?.status),
    paymentStatus: raw?.paymentStatus || raw?.payment_status || "Unpaid",
    paymentMethod: raw?.paymentMethod || raw?.payment_method || "pay-later",
    car: raw?.car || {
      id: raw?.carId || raw?.car_id || "",
      name: raw?.car_name || raw?.vehicle_name || "Selected Vehicle",
      image: raw?.image || raw?.car_image || "",
      category: raw?.category || "",
      fuel: raw?.fuel || "",
      seats: raw?.seats || 0,
      price: raw?.price || raw?.total_price || raw?.final_price || 0,
      luggage: raw?.luggage || 0,
      transmission: raw?.transmission || "",
    },
    pickupLocation:
      raw?.pickupLocation ||
      raw?.pickup_location ||
      draftDefaults.pickupLocation,
    dropoffLocation:
      raw?.dropoffLocation ||
      raw?.dropoff_location ||
      draftDefaults.dropoffLocation,
    pickupDate: raw?.pickupDate || raw?.pickup_date || "",
    pickupTime: raw?.pickupTime || raw?.pickup_time || "",
    dropoffDate: raw?.dropoffDate || raw?.dropoff_date || "",
    dropoffTime: raw?.dropoffTime || raw?.dropoff_time || "",
    flightNumber: raw?.flightNumber || raw?.flight_number || "",
    fullName: raw?.fullName || raw?.full_name || "",
    email: raw?.email || "",
    phone: raw?.phone || "",
    notes: raw?.notes || raw?.internal_notes || "",
    extras: Array.isArray(raw?.extras) ? raw.extras : [],
    price: raw?.price || {
      currency: "MUR",
      exchangeRate: 1,
      days: Number(raw?.days || 1),
      dailyRateMUR: Number(
        raw?.dailyRateMUR || raw?.daily_rate || raw?.base_price || 0
      ),
      vehicleTotalMUR: Number(
        raw?.vehicleTotalMUR || raw?.base_price || 0
      ),
      extrasTotalMUR: Number(raw?.extrasTotalMUR || 0),
      grandTotalMUR: Number(
        raw?.grandTotalMUR ||
          raw?.final_price ||
          raw?.total_price ||
          0
      ),
      extras: [],
    },
  };
}

function deriveInvoicesFromBookings(
  bookings: BookingRecord[]
): Invoice[] {
  return bookings.map((booking, index) => ({
    id: `INV-${booking.id}`,
    bookingId: String(booking.id),
    invoiceNumber: `AM38-INV-${String(index + 1).padStart(5, "0")}`,
    customerName: booking.fullName || booking.email || "Customer",
    totalMUR: booking.price?.grandTotalMUR || 0,
    status:
      booking.paymentStatus === "Paid"
        ? "paid"
        : booking.status === "cancelled"
        ? "cancelled"
        : "issued",
    createdAt: booking.createdAt,
  }));
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingDraft, setBookingDraft] =
    useState<BookingDraft>(getDefaultDraft());
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const reloadBookings = async () => {
    try {
      setLoadingBookings(true);
      setBookingError("");

      const data = await fetchBookings();
      const source = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      const normalized = source.map((b: any) =>
        normalizeRemoteBooking(b)
      );
      setBookings(normalized);
      setInvoices(deriveInvoicesFromBookings(normalized));
    } catch {
      setBookingError("Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    reloadBookings();
  }, []);

  const sendWhatsAppNotification = async (
    bookingId: string | number,
    message: string
  ) => {
    console.log("WhatsApp Notification:", { bookingId, message });

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/notifications/whatsapp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          message,
        }),
      });
    } catch (error) {
      console.error("WhatsApp notification failed:", error);
    }
  };

  const sendEmailNotification = async (
    bookingId: string | number,
    subject: string,
    body: string
  ) => {
    console.log("Email Notification:", { bookingId, subject });

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/notifications/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          subject,
          body,
        }),
      });
    } catch (error) {
      console.error("Email notification failed:", error);
    }
  };

  const createBooking = async (): Promise<BookingRecord | null> => {
    try {
      if (!selectedCar) {
        console.error("No vehicle selected");
        return null;
      }

      // Calculate total amount safely
      let totalAmount = 0;
      if ((bookingDraft as any).price?.grandTotalMUR) {
        totalAmount = (bookingDraft as any).price.grandTotalMUR;
      } else if (selectedCar.price) {
        // Fallback to car price if no grand total available
        totalAmount = selectedCar.price;
      }

      const payload = {
        car_id: selectedCar.id,
        customer_name: bookingDraft.fullName,
        customer_email: bookingDraft.email,
        customer_phone: bookingDraft.phone,
        pickup_location: bookingDraft.pickupLocation,
        dropoff_location: bookingDraft.dropoffLocation,
        pickup_date: `${bookingDraft.pickupDate} ${bookingDraft.pickupTime}`,
        return_date: `${bookingDraft.dropoffDate} ${bookingDraft.dropoffTime}`,
        total_amount: totalAmount,
      };

      const response = await apiCreateBooking(payload);
      await reloadBookings();

      return normalizeRemoteBooking({
        id: response.bookingId,
        reference: response.reference,
        ...payload,
        status: "pending",
        payment_status: "unpaid",
      });
    } catch (err) {
      console.error("Create booking failed:", err);
      return null;
    }
  };

  const markInvoicePaid = (bookingId: string | number) => {
    console.log("Mark invoice paid:", bookingId);
    // TODO: Implement API call when backend is ready
  };

  const markInvoiceIssued = (bookingId: string | number) => {
    console.log("Mark invoice issued:", bookingId);
    // TODO: Implement API call when backend is ready
  };

  const markInvoiceCancelled = (bookingId: string | number) => {
    console.log("Mark invoice cancelled:", bookingId);
    // TODO: Implement API call when backend is ready
  };

  const getFleetAvailability = (carId: string | number): string => {
    console.log("Check fleet availability:", carId);
    // TODO: Implement actual availability check when backend is ready
    return "Available";
  };

  const updateBookingStatus = (bookingId: string | number, status: BookingStatus) => {
    console.log("Update booking status:", bookingId, status);
    // TODO: Implement API call when backend is ready
  };

  const value = useMemo(
    () => ({
      selectedCar,
      bookingDraft,
      bookings,
      invoices,
      loadingBookings,
      bookingError,
      selectCar: (car: Car) => setSelectedCar(car),
      clearSelectedCar: () => setSelectedCar(null),
      resetDraft: () => setBookingDraft(getDefaultDraft()),
      updateDraft: (patch: Partial<BookingDraft>) =>
        setBookingDraft((prev) => ({ ...prev, ...patch })),
      updateExtraQuantity: (id: string, qty: number) =>
        setBookingDraft((prev) => ({
          ...prev,
          extras: { ...prev.extras, [id]: Math.max(0, qty) },
        })),
      createBooking,
      reloadBookings,
      markInvoicePaid,
      markInvoiceIssued,
      markInvoiceCancelled,
      getFleetAvailability,
      updateBookingStatus,
      sendWhatsAppNotification,
      sendEmailNotification,
    }),
    [selectedCar, bookingDraft, bookings, invoices, loadingBookings, bookingError]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}