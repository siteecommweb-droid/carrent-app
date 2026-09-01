export type InvoiceStatus = "draft" | "open" | "paid" | "void";

export interface BookingInvoice {
  id: string;
  bookingId: string;
  status: InvoiceStatus;
  currency: string;
  totalAmount: number;
  createdAt?: string;
}

export interface InvoiceListResponse {
  items: BookingInvoice[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateInvoicePayload {
  bookingId: string;
  currency?: string;
}

export interface BookingPaymentSummary {
  bookingId: string;
  status: string;
  amountPaid?: number;
  currency: string;
}







