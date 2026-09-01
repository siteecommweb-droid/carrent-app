import { apiClient } from "@/lib/apiClient";

export interface CreatePaymentIntentPayload {
  bookingId: string;
  amount: number;
  currency: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload,
  authToken?: string | null,
) {
  return apiClient<PaymentIntentResponse>("/payments/intent", {
    method: "POST",
    body: JSON.stringify(payload),
    authToken,
  });
}







