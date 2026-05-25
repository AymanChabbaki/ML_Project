// Default directly to the /api proxy if no environment variable is set
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").trim().replace(/\/$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

export function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  
  // The bypass-tunnel-reminder header is completely deleted. 
  // We no longer need it for Azure Container Instances!

  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
}