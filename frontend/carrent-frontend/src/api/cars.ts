const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
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
      typeof data === "object" && data?.message
        ? data.message
        : "Something went wrong while calling the API.";
    throw new Error(message);
  }

  return data;
}

function normalizecarsListResponse(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function normalizeCarDetailsResponse(payload: any): any {
  if (payload?.data && typeof payload.data === "object") return payload.data;
  return payload;
}

export async function getcars(params: Record<string, any> = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all" &&
      value !== false
    ) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/cars?${queryString}` : "/cars";

  const payload = await apiRequest(endpoint);
  return normalizecarsListResponse(payload);
}

export async function getCarById(id: string) {
  if (!id) {
    throw new Error("Car ID is required.");
  }

  const payload = await apiRequest(`/cars/${id}`);
  return normalizeCarDetailsResponse(payload);
}







