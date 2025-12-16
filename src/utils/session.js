// src/utils/session.js
// Single source of truth for auth/session storage

const USER_KEY = "medflowUser";
const TOKEN_KEY = "medflowToken"; // optional (your backend currently returns a demo token)

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
  } catch {
    // ignore
  }
}

export function setSessionToken(token) {
  try {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, String(token));
  } catch {
    // ignore
  }
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
  } catch {
    // ignore
  }
}

export function isLoggedIn() {
  const u = getSessionUser();
  return !!u?.id;
}
