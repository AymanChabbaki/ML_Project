export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://api-tox.loca.lt").trim().replace(/\/$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
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
