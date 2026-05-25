// Default to the new /api proxy path we just set up in vercel.json
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").trim().replace(/\/$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function apiFetch(path, options) {
  // We deleted the bypass-tunnel-reminder header because your API is real now!
  const headers = new Headers(options?.headers || {});

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
}