// src/utils/apiClient.js
// Optional refactor: unified error handling + easy remote/local switch

import { getSessionToken } from "./session";

const RAW_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://jabumarket.com.ng/HealthTrack_api/";

// Ensure trailing slash
const API_BASE = RAW_BASE.endsWith("/") ? RAW_BASE : RAW_BASE + "/";

/**
 * If you want a pure local/dev mode (no network), set:
 *   VITE_USE_REMOTE_API=0
 * or reuse:
 *   VITE_USE_REMOTE_AUTH=0
 */
const USE_REMOTE_API = String(
  import.meta.env.VITE_USE_REMOTE_API ??
    import.meta.env.VITE_USE_REMOTE_AUTH ??
    "1"
).trim() !== "0";

function buildUrl(path) {
  return API_BASE + String(path || "").replace(/^\/+/, "");
}

function normalizeErrorMessage(data, res) {
  const serverMsg =
    (data && (data.error || data.message)) ||
    (typeof data === "string" ? data : "");
  if (serverMsg) return String(serverMsg);

  if (res) return `Request failed (${res.status})`;
  return "Request failed";
}

async function parseResponse(res) {
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();

  // Try JSON first if content-type hints it, otherwise attempt anyway
  if (contentType.includes("application/json")) {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return { success: false, error: "Invalid JSON from server" };
    }
  }

  // Non-JSON: attempt JSON parse; fallback to text
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text ? { success: false, error: text } : null;
  }
}

async function request(path, options = {}, { throwOnSuccessFalse = true } = {}) {
  if (!USE_REMOTE_API) {
    throw new Error("Remote API is disabled (set VITE_USE_REMOTE_API=1 to enable).");
  }

  const url = buildUrl(path);

  const token = getSessionToken();
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Auto attach JSON header if body is object and content-type is missing
  const hasBody = options.body !== undefined && options.body !== null;
  const hasContentType = Object.keys(headers).some(
    (k) => k.toLowerCase() === "content-type"
  );
  if (hasBody && !hasContentType && typeof options.body === "string") {
    // caller set string body; do nothing
  }

  // Attach Authorization if token exists
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, {
      mode: "cors",
      ...options,
      headers,
    });
  } catch (e) {
    throw new Error(e?.message || "Network error. Check your connection / API URL.");
  }

  const data = await parseResponse(res);

  // Non-2xx
  if (!res.ok) {
    throw new Error(normalizeErrorMessage(data, res));
  }

  // 2xx but backend says success:false (common PHP style)
  if (throwOnSuccessFalse && data && typeof data === "object" && data.success === false) {
    throw new Error(normalizeErrorMessage(data, res));
  }

  return data;
}

export async function apiGet(path) {
  return request(path, { method: "GET" });
}

export async function apiPost(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}

export async function apiDelete(path) {
  return request(path, { method: "DELETE" });
}
