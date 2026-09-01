const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function api(path: string, options: RequestInit = {}, auth = false) {
  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error("API error");

  return res.json();
}

/* ================= FLEET ================= */

export function fetchFleetStats() {
  return api("/admin/fleet", {}, true);
}

export function fetchFleetCalendar() {
  return api("/admin/fleet/calendar", {}, true);
}

export function assignFleetCar(data: any) {
  return api("/admin/fleet/assign", {
    method: "POST",
    body: JSON.stringify(data),
  }, true);
}




