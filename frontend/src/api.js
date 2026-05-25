function getProxyBaseOnPort(port) {
  if (typeof window === "undefined") return "";
  return `${window.location.protocol}//${window.location.hostname}:${port}`;
}

function isTunnelBase(base) {
  if (!base) return false;

  try {
    const url = new URL(base);
    return url.hostname.endsWith(".ts.net");
  } catch {
    return false;
  }
}

const defaultCandidates = import.meta.env.DEV
  ? [""]
  : [
      getProxyBaseOnPort(8010),
      (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, ""),
    ];

const rawCandidates = defaultCandidates
  .filter((base) => typeof base === "string")
  .map((base) => base.trim())
  .filter((base) => base.length > 0)
  .filter((base) => !isTunnelBase(base))
  .filter((base, index, arr) => arr.indexOf(base) === index);

const baseCandidates = rawCandidates;

let activeBase = baseCandidates[0] || "";

export const API_BASE_URL = activeBase;

function buildApiUrl(path, base = activeBase) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function apiUrl(path) {
  return buildApiUrl(path);
}

export async function apiFetch(path, options) {
  const responses = [];
  const networkErrors = [];
  const retryableStatus = new Set([404, 405, 502, 503, 504]);

  for (const base of baseCandidates) {
    try {
      const response = await fetch(buildApiUrl(path, base), options);

      if (response.ok) {
        activeBase = base;
        return response;
      }

      // Retry another base only for likely routing/proxy misses.
      if (retryableStatus.has(response.status)) {
        responses.push(response);
        continue;
      }

      activeBase = base;
      return response;
    } catch (error) {
      networkErrors.push(error?.message || "Network error");
    }
  }

  if (responses.length > 0) {
    return responses[0];
  }

  throw new Error(networkErrors.join(" | ") || "API request failed.");
}
