const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");

const BASE_CANDIDATES = configuredBase
  ? [configuredBase]
  : (import.meta.env.DEV ? [""] : ["", "/tox"]);

let activeBase = BASE_CANDIDATES[0];

export const API_BASE_URL = activeBase;

function buildApiUrl(base, path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function apiUrl(path) {
  return buildApiUrl(activeBase, path);
}

export async function apiFetch(path, options) {
  const failures = [];

  for (const base of BASE_CANDIDATES) {
    const url = buildApiUrl(base, path);
    const response = await fetch(url, options);

    if (response.status !== 404) {
      activeBase = base;
      return response;
    }

    failures.push(response);
  }

  return failures[0];
}
