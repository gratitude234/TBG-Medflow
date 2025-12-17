// src/utils/profile.js
// Lightweight localStorage role profile + onboarding helpers (frontend MVP)
// Optional refactor: centralized keys + role hint helpers

export const STORAGE_KEYS = Object.freeze({
  PROFILE_PREFIX: "medflowRoleProfile:",
  COMPLETE_PREFIX: "medflowOnboardingComplete:",
  ROLE_HINT_KEY: "medflowRoleHint", // optional: last-selected role on this device
});

function safeJsonParse(raw, fallback = null) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function keyProfile(userId) {
  return `${STORAGE_KEYS.PROFILE_PREFIX}${userId}`;
}

function keyComplete(userId) {
  return `${STORAGE_KEYS.COMPLETE_PREFIX}${userId}`;
}

export function normalizeRole(role) {
  const r = String(role || "patient").toLowerCase().trim();
  if (["patient", "student", "clinician", "other"].includes(r)) return r;
  return "patient";
}

export function roleLabel(role) {
  const r = normalizeRole(role);
  if (r === "student") return "Student nurse";
  if (r === "clinician") return "Clinician / mentor";
  if (r === "other") return "Other";
  return "Patient / family";
}

/**
 * Optional: role “hint” is NOT used for auth.
 * It’s only for preselecting UI defaults (e.g., register screen).
 */
export function setRoleHint(role) {
  try {
    const normalized = normalizeRole(role);
    localStorage.setItem(
      STORAGE_KEYS.ROLE_HINT_KEY,
      JSON.stringify({ role: normalized, updatedAt: new Date().toISOString() })
    );
  } catch {
    // ignore
  }
}

export function getRoleHint() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROLE_HINT_KEY);
    const parsed = safeJsonParse(raw, null);
    const role = normalizeRole(parsed?.role || "patient");
    return role;
  } catch {
    return "patient";
  }
}

export function clearRoleHint() {
  try {
    localStorage.removeItem(STORAGE_KEYS.ROLE_HINT_KEY);
  } catch {
    // ignore
  }
}

export function getProfile(userId) {
  try {
    if (!userId) return null;
    const raw = localStorage.getItem(keyProfile(userId));
    return safeJsonParse(raw, null);
  } catch {
    return null;
  }
}

export function saveProfile(userId, data) {
  try {
    if (!userId) return;
    const payload = {
      ...(data || {}),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(keyProfile(userId), JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function clearProfile(userId) {
  try {
    if (!userId) return;
    localStorage.removeItem(keyProfile(userId));
    localStorage.removeItem(keyComplete(userId));
  } catch {
    // ignore
  }
}

export function setOnboardingComplete(userId, value = true) {
  try {
    if (!userId) return;
    localStorage.setItem(keyComplete(userId), value ? "1" : "0");
  } catch {
    // ignore
  }
}

export function isOnboardingComplete(userId) {
  try {
    if (!userId) return false;
    const raw = localStorage.getItem(keyComplete(userId));
    return raw === "1" || raw === "true";
  } catch {
    return false;
  }
}
