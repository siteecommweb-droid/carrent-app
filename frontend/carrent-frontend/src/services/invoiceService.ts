import { apiClient } from "@/lib/apiClient";
import type { Invoice } from "@/types/invoice";

export async function createInvoice(booking: any) {
  return apiClient<Invoice>("/payments/invoices", {
    method: "POST",
    body: JSON.stringify({
      bookingId: booking.id,
      amount: booking.price.grandTotalMUR,
      email: booking.email,
    }),
  });
}

export async function getMyInvoices() {
  return apiClient<Invoice[]>("/payments/invoices/me", {
    method: "GET",
  });
}

export async function getAdminInvoices() {
  return apiClient<Invoice[]>("/payments/invoices/admin", {
    method: "GET",
  });
}







