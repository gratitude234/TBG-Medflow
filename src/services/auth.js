// src/services/auth.js
import { apiPost } from "../utils/apiClient";

const ACCOUNTS_KEY = "medflowAccounts:v1";

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function uid() {
  // Prefer crypto.randomUUID when available
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `u_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

/**
 * Toggle remote/local auth:
 * - If VITE_USE_REMOTE_AUTH === "1" => uses your existing PHP endpoints.
 * - Otherwise => localStorage mock users.
 */
function useRemote() {
  return String(import.meta.env.VITE_USE_REMOTE_AUTH || "") === "1";
}

function getAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  return safeJsonParse(raw, []);
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function registerAccount({ fullName, email, password, role }) {
  if (useRemote()) {
    return apiPost("register.php", { fullName, email, password, role });
  }

  const e = normalizeEmail(email);
  if (!e) throw new Error("Email is required.");

  const accounts = getAccounts();
  const existing = accounts.find((a) => normalizeEmail(a.email) === e);
  if (existing) throw new Error("An account with this email already exists.");

  const account = {
    id: uid(),
    fullName: String(fullName || "").trim(),
    email: e,
    role: String(role || "patient"),
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
    // NOTE: localStorage is not secure; this is mock-only.
    password,
  };

  accounts.push(account);
  saveAccounts(accounts);

  return {
    user: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      role: account.role,
      onboardingComplete: account.onboardingComplete,
    },
    token: `local-${account.id}-${Date.now()}`,
  };
}

export async function loginAccount({ email, password }) {
  if (useRemote()) {
    return apiPost("login.php", { email, password });
  }

  const e = normalizeEmail(email);
  const accounts = getAccounts();
  const account = accounts.find((a) => normalizeEmail(a.email) === e);

  if (!account) throw new Error("No account found with that email.");
  if (String(account.password || "") !== String(password || "")) throw new Error("Incorrect password.");

  return {
    user: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      role: account.role,
      onboardingComplete: account.onboardingComplete === true,
    },
    token: `local-${account.id}-${Date.now()}`,
  };
}

export async function patchAccount(userId, patch) {
  // For MVP, we only patch local mode.
  // Later: call a backend endpoint (e.g., update_profile.php) when you’re ready.
  if (useRemote()) return null;

  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => String(a.id) === String(userId));
  if (idx === -1) return null;

  accounts[idx] = {
    ...accounts[idx],
    ...patch,
  };

  saveAccounts(accounts);

  return {
    id: accounts[idx].id,
    fullName: accounts[idx].fullName,
    email: accounts[idx].email,
    role: accounts[idx].role,
    onboardingComplete: accounts[idx].onboardingComplete === true,
  };
}
