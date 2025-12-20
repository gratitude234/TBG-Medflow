// src/utils/apiClient.js

const RAW_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://jabumarket.com.ng/HealthTrack_api/";

// Ensure trailing slash
const API_BASE = RAW_BASE.endsWith("/") ? RAW_BASE : RAW_BASE + "/";

function getToken() {
  try {
    return localStorage.getItem("medflowToken") || "";
  } catch {
    return "";
  }
}

async function request(path, options = {}) {
  const url = API_BASE + String(path || "").replace(/^\/+/, "");

  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  // Attach Authorization if token exists
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    mode: "cors",
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { success: false, error: text || "Non-JSON response from server" };
  }

  // ✅ NEW: Treat API-level failures as errors even if HTTP status is 200
  if (data && typeof data === "object" && "success" in data && data.success === false) {
    throw new Error(data.error || "Request failed");
  }

  // HTTP-level failure
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
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
