const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      (typeof data === "object" && (data?.message || data?.error)) ||
      "Request failed.";
    throw new Error(message);
  }

  return data;
}

function normalizeBookingsList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  return [];
}

function normalizeBooking(payload: any): any {
  if (payload?.data && typeof payload.data === "object") return payload.data;
  return payload;
}

export async function getMyBookings() {
  const payload = await apiRequest("/bookings/my", {
    method: "GET",
    auth: true,
  });

  return normalizeBookingsList(payload);
}

export async function createBooking(bookingData: Record<string, any>) {
  const payload = await apiRequest("/bookings", {
    method: "POST",
    auth: true,
    body: JSON.stringify(bookingData),
  });

  return normalizeBooking(payload);
}




