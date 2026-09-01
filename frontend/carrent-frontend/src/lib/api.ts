const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

async function handleResponse(res: Response) {
  let data: any = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
      "Request failed"
    );
  }

  return data;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export async function fetchAPI(
  path: string,
  options: RequestInit = {},
  authRequired = true
) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token && authRequired) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(
      headers,
      options.headers as any
    );
  }

  const res = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  return handleResponse(res);
}

// ============================================================
// AUTH API
// ============================================================
export const loginUser = (data: any) =>
  fetchAPI(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );

export const registerUser = (data: any) =>
  fetchAPI(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );

export const fetchMe = () =>
  fetchAPI("/auth/me");

// ============================================================
// CARS API
// ============================================================
export const fetchCars = () =>
  fetchAPI("/cars", {}, false);

export const fetchCarById = (
  id: string | number
) =>
  fetchAPI(
    `/cars/${id}`,
    {},
    false
  );

// ============================================================
// BOOKINGS API
// ============================================================
export const fetchBookings = () =>
  fetchAPI("/bookings");

export const fetchBookingById = (id: string | number) =>
  fetchAPI(`/bookings/${id}`);

export const createBooking = (
  data: any
) =>
  fetchAPI("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const cancelBooking = (id: string | number) =>
  fetchAPI(`/bookings/${id}/cancel`, {
    method: "PUT",
  });

// ============================================================
// ADMIN API
// ============================================================
export const fetchAdminBookings = (
  params?: any
) => {
  const query = new URLSearchParams();

  Object.entries(
    params || {}
  ).forEach(
    ([k, v]) => {
      if (
        v !== undefined &&
        v !== null
      ) {
        query.append(
          k,
          String(v)
        );
      }
    }
  );

  return fetchAPI(
    `/admin/bookings?${query}`
  );
};

export const fetchAdminDashboard = () =>
  fetchAPI("/admin/dashboard");

export const fetchAdminTicker = () =>
  fetchAPI("/admin/ticker");

export const fetchAdminAvailability = (
  start: string,
  end: string
) =>
  fetchAPI(
    `/admin/availability?start=${start}&end=${end}`
  );

export const fetchAdminTickets = (
  params?: any
) => {
  const query = new URLSearchParams();

  if (params?.status)
    query.append(
      "status",
      params.status
    );

  if (params?.priority)
    query.append(
      "priority",
      params.priority
    );

  if (params?.q)
    query.append(
      "q",
      params.q
    );

  return fetchAPI(
    `/admin/tickets?${query}`
  );
};

export const fetchAdminTicket = (
  id: number
) =>
  fetchAPI(
    `/admin/tickets/${id}`
  );

export const sendAdminTicketMessage = (
    id: number,
    message: string,
    attachment?: File | null
  ) => {
    const fd = new FormData();
    fd.append("message", message);

    if (attachment) {
      fd.append("attachment", attachment);
    }

    return fetchAPI(
      `/admin/tickets/${id}/messages`,
      {
        method: "POST",
        body: fd,
      }
    );
  };

export const updateAdminBooking = (
    id: number,
    payload: any
  ) =>
    fetchAPI(
      `/admin/bookings/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

export const updateAdminBookingPayment = (
    id: number,
    payload: any
  ) =>
    fetchAPI(
      `/admin/bookings/${id}/payment`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

export const updateAdminTicket = (
    id: number,
    payload: any
  ) =>
    fetchAPI(
      `/admin/tickets/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

export const updateBookingStatus = (
  id: string | number,
  status: string
) =>
  fetchAPI(
    `/admin/bookings/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        status,
      }),
    }
  );

export const fetchAdminUsers = () =>
  fetchAPI("/admin/users");

export const updateUserRole = (
  id: string | number,
  role: string
) =>
  fetchAPI(
    `/admin/users/${id}/role`,
    {
      method: "PUT",
      body: JSON.stringify({ role }),
    }
  );

// ============================================================
// PAYMENTS API
// ============================================================
export const createPaymentIntent = (data: any) =>
  fetchAPI("/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const confirmPayment = (data: any) =>
  fetchAPI("/payments/confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ============================================================
// INVOICES API
// ============================================================
export const fetchInvoices = () =>
  fetchAPI("/invoices");

export const fetchInvoiceById = (id: string | number) =>
  fetchAPI(`/invoices/${id}`);

export const fetchInvoicePdf = (id: string | number) =>
  `${API_URL}/invoices/${id}/pdf`;

// ============================================================
// SUPPORT / TICKETS API
// ============================================================
export const fetchTickets = () =>
  fetchAPI("/tickets/my");

export const fetchTicketById = (id: string | number) =>
  fetchAPI(`/tickets/${id}`);

export const createTicket = (data: any) =>
  fetchAPI("/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addTicketMessage = (id: string | number, message: string) =>
  fetchAPI(`/tickets/${id}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

export const updateTicketStatus = (id: string | number, status: string) =>
  fetchAPI(`/admin/tickets/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

// ============================================================
// EXPLORE / LOCATIONS API
// ============================================================
export const fetchLocations = () =>
  fetchAPI("/locations", {}, false);

export const fetchWeather = (location: string) =>
  fetchAPI(`/weather/${encodeURIComponent(location)}`, {}, false);

// ============================================================
// WISHLIST API (Local Storage based - kept for consistency)
// ============================================================
export const getWishlist = (): number[] => {
  const saved = localStorage.getItem("wishlist");
  return saved ? JSON.parse(saved) : [];
};

export const saveWishlist = (wishlist: number[]) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

export const addToWishlist = (carId: number) => {
  const wishlist = getWishlist();
  if (!wishlist.includes(carId)) {
    wishlist.push(carId);
    saveWishlist(wishlist);
  }
  return wishlist;
};

export const removeFromWishlist = (carId: number) => {
  const wishlist = getWishlist();
  const newWishlist = wishlist.filter(id => id !== carId);
  saveWishlist(newWishlist);
  return newWishlist;
};

export const isInWishlist = (carId: number): boolean => {
  return getWishlist().includes(carId);
};

// ============================================================
// PERSONALIZATION API (Local Storage based)
// ============================================================
export interface PersonalizationData {
  carId: number;
  carName: string;
  personalNote: string;
  occasion: string;
  extraRequests: {
    childSeat: boolean;
    gps: boolean;
    wifi: boolean;
    cooler: boolean;
    driver: boolean;
  };
  date: string;
}

export const getPersonalization = (carId: number): PersonalizationData | null => {
  const saved = localStorage.getItem(`personalization_${carId}`);
  return saved ? JSON.parse(saved) : null;
};

export const savePersonalization = (carId: number, data: PersonalizationData) => {
  localStorage.setItem(`personalization_${carId}`, JSON.stringify(data));
};

export const removePersonalization = (carId: number) => {
  localStorage.removeItem(`personalization_${carId}`);
};

/* ==========================================================
   VERIFICATION API
========================================================== */

export async function fetchMyVerification() {
  return handleResponse(
    await fetch(`${API_URL}/verification/me`, {
      credentials: "include",
      headers: getAuthHeaders(),
    })
  );
}

export async function fetchAdminVerifications(params?: any) {
  const query = new URLSearchParams();

  if (params?.status) query.append("status", params.status);
  if (params?.q) query.append("q", params.q);
  if (params?.country) query.append("country", params.country);
  if (params?.riskLevel) query.append("riskLevel", params.riskLevel);

  return handleResponse(
    await fetch(
      `${API_URL}/admin/verifications?${query.toString()}`,
      {
        credentials: "include",
        headers: getAuthHeaders(),
      }
    )
  );
}

export async function fetchAdminVerification(id: number) {
  return handleResponse(
    await fetch(
      `${API_URL}/admin/verifications/${id}`,
      {
        credentials: "include",
        headers: getAuthHeaders(),
      }
    )
  );
}

export async function updateAdminVerification(
  id: number,
  payload: any
) {
  return handleResponse(
    await fetch(
      `${API_URL}/admin/verifications/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
  );
}

export async function uploadVerificationDocuments(
  type: string,
  file: File
) {
  const formData = new FormData();

  formData.append("type", type);
  formData.append("file", file);

  return handleResponse(
    await fetch(
      `${API_URL}/verification/upload`,
      {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: formData,
      }
    )
  );
}

export async function approveVerification(
  verificationId: number
) {
  return handleResponse(
    await fetch(
      `${API_URL}/admin/verifications/${verificationId}/approve`,
      {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
      }
    )
  );
}

export async function rejectVerification(
  verificationId: number,
  reason: string
) {
  return handleResponse(
    await fetch(
      `${API_URL}/admin/verifications/${verificationId}/reject`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      }
    )
  );
}

export async function resendVerificationRequest(
  verificationId: number
) {
  return handleResponse(
    await fetch(
      `${API_URL}/admin/verifications/${verificationId}/resend`,
      {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
      }
    )
  );
}

// GET helper for ProfileRequiredModal
export const get = async (path: string) => {
  return fetchAPI(path, {}, true);
};

// Default export for convenience
const api = {
  get,
  post: (path: string, data: any) => fetchAPI(path, { method: "POST", body: JSON.stringify(data) }),
  put: (path: string, data: any) => fetchAPI(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: (path: string) => fetchAPI(path, { method: "DELETE" }),
};

export { api };