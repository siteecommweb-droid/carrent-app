const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

export type ApiClientOptions = RequestInit & {
  authToken?: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || payload?.error || "Request failed";

    throw new Error(message);
  }

  return payload as T;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { authToken, headers, ...rest } = options;

  const finalheaders = new Headers(headers || {});

  if (!finalheaders.has("Content-Type") && !(rest.body instanceof FormData)) {
    finalheaders.set("Content-Type", "application/json");
  }

  if (authToken) {
    finalheaders.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...rest,
    headers: finalheaders,
  });

  return parseResponse<T>(response);
}

export { API_BASE_URL };




