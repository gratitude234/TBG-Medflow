// src/utils/session.js
// Single source of truth for auth/session storage

const USER_KEY = "medflowUser";
const TOKEN_KEY = "medflowToken";
const TOKEN_EXPIRES_KEY = "medflowTokenExpiresAt"; // ISO string from backend (expiresAt)

/**
 * Emit a global event so App/Header/Nav can react immediately
 * without requiring a hard refresh.
 */
function emitSessionChange(type = "change") {
  try {
    window.dispatchEvent(
      new CustomEvent("medflow:session", {
        detail: { type, user: getSessionUser() },
      })
    );
  } catch {
    // ignore
  }
}

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSessionUser(user) {
  try {
    if (!user) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emitSessionChange("login");
  } catch {
    // ignore
  }
}

export function setSessionToken(token, expiresAt) {
  try {
    localStorage.setItem(TOKEN_KEY, String(token || ""));
    if (expiresAt) {
      localStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt));
    } else {
      localStorage.removeItem(TOKEN_EXPIRES_KEY);
    }
    emitSessionChange("token");
  } catch {
    // ignore
  }
}

export function getTokenExpiresAt() {
  try {
    const v = localStorage.getItem(TOKEN_EXPIRES_KEY);
    return v ? String(v) : "";
  } catch {
    return "";
  }
}

export function isTokenExpired() {
  const exp = getTokenExpiresAt();
  if (!exp) return false;
  const t = Date.parse(exp);
  if (Number.isNaN(t)) return false;
  return Date.now() > t;
}

export function getSessionToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
    emitSessionChange("logout");
  } catch {
    // ignore
  }
}

export function isLoggedIn() {
  const u = getSessionUser();
  return !!u?.id;
}
