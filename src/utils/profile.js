// src/utils/profile.js
// Lightweight localStorage profile + onboarding helper (frontend MVP)

const PROFILE_PREFIX = "medflowRoleProfile:";
const COMPLETE_PREFIX = "medflowOnboardingComplete:";

function keyProfile(userId) {
  return `${PROFILE_PREFIX}${userId}`;
}
function keyComplete(userId) {
  return `${COMPLETE_PREFIX}${userId}`;
}

export function getProfile(userId) {
  try {
    if (!userId) return null;
    const raw = localStorage.getItem(keyProfile(userId));
    return raw ? JSON.parse(raw) : null;
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

export function clearProfile(userId) {
  try {
    if (!userId) return;
    localStorage.removeItem(keyProfile(userId));
    localStorage.removeItem(keyComplete(userId));
  } catch {
    // ignore
  }
}

export function normalizeRole(role) {
  const r = String(role || "patient").toLowerCase();
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
