import { useEffect, useMemo, useState } from "react";

export interface Booking {
  id: number;

  bookingRef: string;

  partnerCode: string;

  ticketStatus: string;

  status: string;

  paymentStatus: string;

  car: {
    name: string;
    group: string;
    image?: string;
    transmission?: string;
    seats?: number;
    fuel?: string;
  };

  pickupDate: string;

  pickupTime: string;

  dropoffDate: string;

  dropoffTime: string;

  pickupLocation: string;

  dropoffLocation: string;

  price: {
    grandTotalMUR: number;
    depositAmountMUR?: number;
    remainingAmountMUR?: number;
    extrasTotalMUR?: number;
  };

  fullName: string;

  email: string;

  phone: string;

  paymentMethod: string;

  extras: any[];

  createdAt: string;

  loyaltyPoints?: number;

  weatherSummary?: string;

  supportPriority?: string;

  tripStatus?: string;

  touristTips?: string[];

  estimatedFuelCost?: number;

  qrCode?: string;
}

interface UseMyBookingsReturn {
  data: Booking[];

  isLoading: boolean;

  isError: boolean;

  error: any;

  stats: {
    totalBookings: number;

    confirmedBookings: number;

    totalRevenue: number;

    activeTrips: number;

    loyaltyPoints: number;
  };

  refreshBookings: () => void;

  upcomingTrips: Booking[];

  activeBookings: Booking[];
}

function normalizeBooking(
  b: any,
  index: number
): Booking {
  const total =
    Number(b?.price?.grandTotalMUR || 0);

  return {
    ...b,

    bookingRef:
      b.bookingRef ||
      `AM38-WEB-${String(index + 1).padStart(
        3,
        "0"
      )}`,

    partnerCode: b.partnerCode || "WEB",

    ticketStatus:
      b.ticketStatus || "created",

    createdAt:
      b.createdAt || new Date().toISOString(),

    loyaltyPoints:
      b.loyaltyPoints ||
      Math.round(total / 10),

    weatherSummary:
      b.weatherSummary ||
      "Sunny tropical weather expected.",

    supportPriority:
      b.supportPriority || "standard",

    tripStatus:
      b.tripStatus || "upcoming",

    touristTips:
      b.touristTips || [
        "Visit Le Morne during sunset.",
        "Avoid heavy traffic near Port Louis at 17:00.",
        "Carry sunscreen for west coast beaches.",
      ],

    estimatedFuelCost:
      b.estimatedFuelCost ||
      Math.round(total * 0.12),

    qrCode:
      b.qrCode ||
      `AM38-BOOKING-${b.id || index + 1}`,

    car: {
      ...b.car,

      image:
        b?.car?.image ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600",

      transmission:
        b?.car?.transmission || "Automatic",

      seats:
        b?.car?.seats || 5,

      fuel:
        b?.car?.fuel || "Hybrid",
    },

    price: {
      ...b.price,

      depositAmountMUR:
        b?.price?.depositAmountMUR ||
        Math.round(total * 0.3),

      remainingAmountMUR:
        b?.price?.remainingAmountMUR ||
        Math.round(total * 0.7),

      extrasTotalMUR:
        b?.price?.extrasTotalMUR || 0,
    },
  };
}

export function useMyBookings(): UseMyBookingsReturn {
  const [data, setData] = useState<Booking[]>([]);

  const [isLoading, setLoading] =
    useState(true);

  const [isError, setError] =
    useState(false);

  const [error, setErrorObj] =
    useState<any>(null);

  const loadBookings = () => {
    try {
      setLoading(true);

      const stored = JSON.parse(
        localStorage.getItem("bookings") ||
          "[]"
      );

      if (stored.length === 0) {
        const demo: Booking[] = [
          {
            id: 1,

            bookingRef: "AM38-WEB-001",

            partnerCode: "WEB",

            ticketStatus: "created",

            status: "confirmed",

            paymentStatus: "paid",

            car: {
              name:
                "Toyota Vitz Hybrid 2019",

              group: "EDAV",

              image:
                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600",

              transmission: "Automatic",

              seats: 5,

              fuel: "Hybrid",
            },

            pickupDate: "2026-04-02",

            pickupTime: "10:00",

            dropoffDate: "2026-04-05",

            dropoffTime: "10:00",

            pickupLocation:
              "SSR International Airport",

            dropoffLocation:
              "Grand Baie Hotel",

            price: {
              grandTotalMUR: 4500,

              depositAmountMUR: 1500,

              remainingAmountMUR: 3000,

              extrasTotalMUR: 500,
            },

            fullName: "Demo Client",

            email: "client@email.com",

            phone: "+2300000000",

            paymentMethod: "pay-now",

            extras: [],

            createdAt:
              new Date().toISOString(),

            loyaltyPoints: 450,

            weatherSummary:
              "Perfect sunny conditions.",

            supportPriority: "vip",

            tripStatus: "upcoming",

            touristTips: [
              "Drive the Chamarel route at sunrise.",
              "Best seafood nearby: Flic-en-Flac.",
            ],

            estimatedFuelCost: 1200,

            qrCode: "AM38-BOOKING-001",
          },
        ];

        localStorage.setItem(
          "bookings",
          JSON.stringify(demo)
        );

        setData(demo);
      } else {
        const normalized =
          stored.map(
            (
              b: any,
              index: number
            ) =>
              normalizeBooking(
                b,
                index
              )
          );

        setData(normalized);
      }

      setError(false);

      setErrorObj(null);
    } catch (e) {
      console.error(
        "useMyBookings ERROR:",
        e
      );

      setError(true);

      setErrorObj(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 1000 * 60 * 2);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const totalBookings = data.length;

    const confirmedBookings = data.filter(
      (b) =>
        b.status === "confirmed"
    ).length;

    const totalRevenue = data.reduce(
      (acc, b) =>
        acc +
        Number(
          b?.price?.grandTotalMUR || 0
        ),
      0
    );

    const activeTrips = data.filter(
      (b) =>
        b.tripStatus === "active"
    ).length;

    const loyaltyPoints = data.reduce(
      (acc, b) =>
        acc +
        Number(
          b.loyaltyPoints || 0
        ),
      0
    );

    return {
      totalBookings,

      confirmedBookings,

      totalRevenue,

      activeTrips,

      loyaltyPoints,
    };
  }, [data]);

  const upcomingTrips = useMemo(() => {
    return data.filter(
      (b) =>
        b.tripStatus ===
        "upcoming"
    );
  }, [data]);

  const activeBookings = useMemo(() => {
    return data.filter(
      (b) =>
        b.status === "confirmed"
    );
  }, [data]);

  return {
    data,

    isLoading,

    isError,

    error,

    stats,

    refreshBookings: loadBookings,

    upcomingTrips,

    activeBookings,
  };
}