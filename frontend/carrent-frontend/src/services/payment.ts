import { apiClient } from "@/lib/apiClient";
import type {
  CreateInvoicePayload,
  BookingInvoice,
  InvoiceListResponse,
  BookingPaymentSummary,
} from "@/types/payments";

export async function createInvoice(
  payload: CreateInvoicePayload,
  authToken?: string | null,
) {
  return apiClient<BookingInvoice>("/payments/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
    authToken,
  });
}

export async function getInvoiceByBookingId(
  bookingId: string,
  authToken?: string | null,
) {
  return apiClient<BookingInvoice>(`/payments/invoices/booking/${bookingId}`, {
    method: "GET",
    authToken,
  });
}

export async function getInvoiceById(
  invoiceId: string,
  authToken?: string | null,
) {
  return apiClient<BookingInvoice>(`/payments/invoices/${invoiceId}`, {
    method: "GET",
    authToken,
  });
}

export async function getMyInvoices(
  params: { page?: number; pageSize?: number; status?: string } = {},
  authToken?: string | null,
) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.status) query.set("status", params.status);

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return apiClient<InvoiceListResponse>(`/payments/invoices/me${suffix}`, {
    method: "GET",
    authToken,
  });
}

export async function getAdminInvoices(
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  } = {},
  authToken?: string | null,
) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return apiClient<InvoiceListResponse>(`/payments/invoices/admin${suffix}`, {
    method: "GET",
    authToken,
  });
}

export async function sendInvoice(
  invoiceId: string,
  authToken?: string | null,
) {
  return apiClient<{ success: boolean; invoice: BookingInvoice }>(
    `/payments/invoices/${invoiceId}/send`,
    {
      method: "POST",
      authToken,
    },
  );
}

export async function refundPayment(
  bookingId: string,
  payload: { amount?: number; reason?: string },
  authToken?: string | null,
) {
  return apiClient<{ success: boolean; summary: BookingPaymentSummary }>(
    `/payments/refund`,
    {
      method: "POST",
      body: JSON.stringify({ bookingId, ...payload }),
      authToken,
    },
  );
}

export async function getBookingPaymentSummary(
  bookingId: string,
  authToken?: string | null,
) {
  return apiClient<BookingPaymentSummary>(`/payments/bookings/${bookingId}`, {
    method: "GET",
    authToken,
  });
}







