const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").trim();

export const API_BASE_URL = configuredBase.replace(/\/$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
