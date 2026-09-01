import { fetchAPI } from "./api";

export async function createStripeIntent(data: {
  bookingId: number;
  amount: number;
  currency?: string;
}) {
  return fetchAPI("/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refundStripePayment(data: {
  paymentIntentId: string;
  amount?: number;
}) {
  return fetchAPI("/payments/refund", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function confirmStripePayment(paymentIntentId: string) {
  return fetchAPI("/payments/confirm", {
    method: "POST",
    body: JSON.stringify({
      paymentIntentId,
    }),
  });
}