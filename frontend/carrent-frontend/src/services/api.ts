const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// ==================== NEWS & WEATHER ====================

export async function fetchMauritiusNews() {
  const response = await fetch(`${API_BASE}/news/mauritius`);
  if (!response.ok) throw new Error("Failed to fetch Mauritius news");
  return response.json();
}

export async function fetchWeather(lat?: number, lon?: number) {
  const response = await fetch(`${API_BASE}/weather/current?lat=${lat || -20.2}&lon=${lon || 57.5}`);
  if (!response.ok) throw new Error("Failed to fetch weather");
  return response.json();
}

export async function fetchWeatherForecast(lat?: number, lon?: number) {
  const response = await fetch(`${API_BASE}/weather/forecast?lat=${lat || -20.2}&lon=${lon || 57.5}`);
  if (!response.ok) throw new Error("Failed to fetch forecast");
  return response.json();
}

export async function fetchWeatherAlerts() {
  const response = await fetch(`${API_BASE}/weather/alerts`);
  if (!response.ok) throw new Error("Failed to fetch weather alerts");
  return response.json();
}

// ==================== EXCHANGE & FUEL ====================

export async function fetchExchangeRates() {
  const response = await fetch(`${API_BASE}/system/exchange-rates`);
  if (!response.ok) throw new Error("Failed to fetch exchange rates");
  return response.json();
}

export async function fetchFuelPrices() {
  const response = await fetch(`${API_BASE}/system/fuel-prices`);
  if (!response.ok) throw new Error("Failed to fetch fuel prices");
  return response.json();
}

// ==================== EMAIL INBOX ====================

export async function getInboxAPI() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/email/inbox`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) throw new Error("Failed to fetch inbox");
  return response.json();
}

export async function ingestEmailAPI(payload: any) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/email/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to ingest email");
  return response.json();
}

export async function parseEmailAPI(id: string | number) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/email/parse/${id}`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) throw new Error("Failed to parse email");
  return response.json();
}

export async function createTicketFromEmailAPI(id: string | number) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/email/create-ticket/${id}`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) throw new Error("Failed to create ticket");
  return response.json();
}

export async function createBookingFromEmailAPI(id: string | number, carId?: number) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/email/create-booking/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ car_id: carId }),
  });
  if (!response.ok) throw new Error("Failed to create booking");
  return response.json();
}

// ==================== TRAFFIC ====================

export async function fetchTrafficStatus() {
  const response = await fetch(`${API_BASE}/traffic/status`);
  if (!response.ok) throw new Error("Failed to fetch traffic");
  return response.json();
}

// ==================== HEALTH ====================

export async function fetchServerHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}

export async function fetchSystemStatus() {
  const response = await fetch(`${API_BASE}/system/status`);
  return response.json();
}

export default {
  fetchMauritiusNews,
  fetchWeather,
  fetchWeatherForecast,
  fetchWeatherAlerts,
  fetchExchangeRates,
  fetchFuelPrices,
  getInboxAPI,
  ingestEmailAPI,
  parseEmailAPI,
  createTicketFromEmailAPI,
  createBookingFromEmailAPI,
  fetchTrafficStatus,
  fetchServerHealth,
  fetchSystemStatus,
};