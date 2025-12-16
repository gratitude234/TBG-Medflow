// src/utils/session.js

const USER_KEY = "medflowUser";
const TOKEN_KEY = "medflowToken";

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getSessionToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setSession({ user, token }) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(TOKEN_KEY, token);
  notifySessionChanged();
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("medflowRememberMe");
  notifySessionChanged();
}

export function notifySessionChanged() {
  // lets App.vue react immediately (without reload)
  window.dispatchEvent(new Event("medflow:session"));
}
