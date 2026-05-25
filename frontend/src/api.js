const configuredBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
const defaultCandidates = import.meta.env.DEV ? [""] : ["/tox", ""];

function isIOSBrowser() {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad|od)/i.test(navigator.userAgent);
}

function isPrivateOrTunnelBase(base) {
  if (!base || base.startsWith("/")) return false;

  try {
    const url = new URL(base);
    const host = url.hostname.toLowerCase();

    if (host.endsWith(".ts.net")) return true;
    if (host === "localhost") return true;
    if (/^127\./.test(host)) return true;
    if (/^10\./.test(host)) return true;
    if (/^192\.168\./.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
    if (/^100\./.test(host)) return true;
  } catch {
    return false;
  }

  return false;
}

const rawCandidates = [configuredBase, ...defaultCandidates]
  .filter((base) => typeof base === "string")
  .map((base) => base.trim())
  .filter((base, index, arr) => arr.indexOf(base) === index);

const baseCandidates = isIOSBrowser()
  ? rawCandidates.filter((base) => !isPrivateOrTunnelBase(base))
  : rawCandidates;

let activeBase = baseCandidates[0] || "";

export const API_BASE_URL = configuredBase;

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
