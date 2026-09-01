const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

export async function fetchMauritiusNews() {
  const response = await fetch(
    `${API_URL}/news/mauritius`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
}