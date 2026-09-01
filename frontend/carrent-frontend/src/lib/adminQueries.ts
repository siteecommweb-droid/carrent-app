import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchAdminAvailability,
  fetchAdminBookings,
  fetchAdminDashboard,
  fetchAdminTicker,
  fetchAdminTickets,
  fetchAdminTicket,
  sendAdminTicketMessage,
  updateAdminBooking,
  updateAdminBookingPayment,
  updateAdminTicket,
} from "@/lib/api";

/* ================= TYPES ================= */

export interface AdminBookingFilters {
  status?: string;

  payment_status?: string;

  q?: string;

  assigned_staff_id?: number;

  car_id?: number;

  pickup_location?: string;

  dropoff_location?: string;

  start_date?: string;

  end_date?: string;
}

export interface BookingPaymentPayload {
  id: number;

  payment_status:
    | "unpaid"
    | "partial"
    | "paid"
    | "pay_on_pickup";

  deposit_amount?: number;

  paid_amount?: number;

  payment_method?: string;

  note?: string;

  invoice_reference?: string;

  transaction_reference?: string;
}

export interface BookingUpdatePayload {
  id: number;

  status?:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";

  internal_notes?: string | null;

  assigned_staff_id?: number | null;

  priority?: "normal" | "vip" | "urgent";

  driver_id?: number;

  fleet_status?: string;
}

/* ================= DASHBOARD ================= */

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ["admin-dashboard"],

    queryFn: fetchAdminDashboard,

    refetchInterval: 15000,

    staleTime: 1000 * 30,

    retry: 2,
  });
}

/* ================= LIVE TICKER ================= */

export function useAdminTickerQuery() {
  return useQuery({
    queryKey: ["admin-ticker"],

    queryFn: fetchAdminTicker,

    refetchInterval: 5000,

    staleTime: 5000,
  });
}

/* ================= BOOKINGS ================= */

export function useAdminBookingsQuery(
  params?: AdminBookingFilters
) {
  return useQuery({
    queryKey: ["admin-bookings", params],

    queryFn: () =>
      fetchAdminBookings(params),

    refetchInterval: 15000,

    staleTime: 1000 * 10,

    retry: 2,
  });
}

/* ================= UPDATE BOOKING ================= */

export function useAdminUpdateBookingMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      internal_notes,
      assigned_staff_id,
      priority,
      driver_id,
      fleet_status,
    }: BookingUpdatePayload) =>
      updateAdminBooking(id, {
        status,

        internal_notes,

        assigned_staff_id,

        priority,

        driver_id,

        fleet_status,
      }),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["admin-bookings"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-ticker"],
      });

      qc.invalidateQueries({
        queryKey: [
          "admin-booking",
          vars.id,
        ],
      });

      /* ===== ADMIN AUDIT ===== */
      try {
        const logs = JSON.parse(
          localStorage.getItem(
            "admin_audit_logs"
          ) || "[]"
        );

        logs.push({
          action:
            "BOOKING_UPDATED",

          bookingId: vars.id,

          status:
            vars.status,

          timestamp:
            new Date().toISOString(),
        });

        localStorage.setItem(
          "admin_audit_logs",
          JSON.stringify(logs)
        );
      } catch {}
    },
  });
}

/* ================= UPDATE PAYMENT ================= */

export function useAdminUpdateBookingPaymentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payment_status,
      deposit_amount,
      paid_amount,
      payment_method,
      note,
      invoice_reference,
      transaction_reference,
    }: BookingPaymentPayload) =>
      updateAdminBookingPayment(id, {
        payment_status,

        deposit_amount,

        paid_amount,

        payment_method,

        note,

        invoice_reference,

        transaction_reference,
      }),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["admin-bookings"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-ticker"],
      });

      /* ===== PAYMENT AUDIT ===== */
      try {
        const payments =
          JSON.parse(
            localStorage.getItem(
              "payment_audit_logs"
            ) || "[]"
          );

        payments.push({
          bookingId: vars.id,

          payment_status:
            vars.payment_status,

          amount:
            vars.paid_amount,

          payment_method:
            vars.payment_method,

          timestamp:
            new Date().toISOString(),
        });

        localStorage.setItem(
          "payment_audit_logs",
          JSON.stringify(payments)
        );
      } catch {}
    },
  });
}

/* ================= AVAILABILITY ================= */

export function useAdminAvailabilityQuery(
  start?: string,
  end?: string
) {
  return useQuery({
    queryKey: [
      "admin-availability",
      start,
      end,
    ],

    queryFn: () =>
      fetchAdminAvailability(
        start!,
        end!
      ),

    enabled:
      !!start && !!end,

    staleTime:
      1000 * 60 * 5,
  });
}

/* ================= TICKETS ================= */

export function useAdminTicketsQuery(
  params?: {
    status?: string;

    q?: string;

    priority?: string;
  }
) {
  return useQuery({
    queryKey: [
      "admin-tickets",
      params,
    ],

    queryFn: () =>
      fetchAdminTickets(params),

    refetchInterval: 15000,

    staleTime:
      1000 * 15,
  });
}

/* ================= SINGLE TICKET ================= */

export function useAdminTicketQuery(
  id?: number
) {
  return useQuery({
    queryKey: [
      "admin-ticket",
      id,
    ],

    queryFn: () =>
      fetchAdminTicket(id!),

    enabled: !!id,

    staleTime:
      1000 * 15,
  });
}

/* ================= REPLY ================= */

export function useAdminReplyTicketMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      message,
      attachment,
    }: {
      id: number;

      message: string;

      attachment?: File | null;
    }) =>
      sendAdminTicketMessage(
        id,
        message,
        attachment
      ),

    onSuccess: (
      _data,
      vars
    ) => {
      qc.invalidateQueries({
        queryKey: [
          "admin-ticket",
          vars.id,
        ],
      });

      qc.invalidateQueries({
        queryKey: [
          "admin-tickets",
        ],
      });
    },
  });
}

/* ================= UPDATE TICKET ================= */

export function useAdminUpdateTicketMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      priority,
    }: {
      id: number;

      status?:
        | "open"
        | "resolved"
        | "closed";

      priority?:
        | "low"
        | "normal"
        | "high"
        | "urgent";
    }) =>
      updateAdminTicket(id, {
        status,
        priority,
      }),

    onSuccess: (
      _data,
      vars
    ) => {
      qc.invalidateQueries({
        queryKey: [
          "admin-ticket",
          vars.id,
        ],
      });

      qc.invalidateQueries({
        queryKey: [
          "admin-tickets",
        ],
      });
    },
  });
}

/* ================= SMART ADMIN STATS ================= */

export function useAdminRealtimeStats() {
  const dashboard =
    useAdminDashboardQuery();

  const bookings =
    useAdminBookingsQuery();

  const tickets =
    useAdminTicketsQuery();

  return {
    totalRevenue:
      (dashboard.data as any)
        ?.totalRevenue || 0,

    totalBookings:
      bookings.data
        ?.length || 0,

    activeTickets:
      tickets.data?.length || 0,

    occupancyRate:
      (dashboard.data as any)
        ?.occupancyRate || 0,

    fleetAvailable:
      (dashboard.data as any)
        ?.fleetAvailable || 0,
  };
}