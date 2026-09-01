export type InvoiceStatus = "draft" | "issued" | "paid";

export type Invoice = {
  id: string;
  bookingId: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  amountMUR: number;
  status: InvoiceStatus;
  createdAt: string;
};
