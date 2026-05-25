const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");

const DEFAULT_BASE_CANDIDATES = import.meta.env.DEV ? [""] : ["", "/tox"];
const BASE_CANDIDATES = [configuredBase, ...DEFAULT_BASE_CANDIDATES]
  .filter((base) => typeof base === "string")
  .map((base) => base.trim())
  .filter((base, index, arr) => arr.indexOf(base) === index);

let activeBase = BASE_CANDIDATES[0];

export const API_BASE_URL = activeBase;

export function getApiDebugState() {
  return {
    configuredBase,
    activeBase,
    baseCandidates: [...BASE_CANDIDATES],
  };
}

function buildApiUrl(base, path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function apiUrl(path) {
  return buildApiUrl(activeBase, path);
}

export async function apiFetch(path, options) {
  const failures = [];
  const networkErrors = [];

  for (const base of BASE_CANDIDATES) {
    const url = buildApiUrl(base, path);
    let response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      networkErrors.push({
        url,
        message: error?.message || "Network error",
      });
      continue;
    }

    if (response.status !== 404) {
      activeBase = base;
      return response;
    }

    failures.push(response);
  }

  if (networkErrors.length > 0) {
    const details = networkErrors.map((err) => `${err.url} -> ${err.message}`).join(" | ");
    throw new Error(`All API candidates failed with network error: ${details}`);
  }

  return failures[0];
}
