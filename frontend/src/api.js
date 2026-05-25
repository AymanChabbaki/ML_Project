export const API_BASE_URL = "";

function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function apiUrl(path) {
  return buildApiUrl(path);
}

export async function apiFetch(path, options) {
  return fetch(buildApiUrl(path), options);
}
