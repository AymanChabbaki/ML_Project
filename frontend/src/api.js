const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
const isBrowser = typeof window !== "undefined";
const isSecurePage = isBrowser && window.location.protocol === "https:";

export const API_BASE_URL = configuredApiBaseUrl && !(isSecurePage && configuredApiBaseUrl.startsWith("http://"))
  ? configuredApiBaseUrl
  : "";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

export function apiFetch(path, options) {
  const headers = new Headers(options?.headers || {});
  headers.set("bypass-tunnel-reminder", "1");

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
}
