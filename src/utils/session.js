// src/utils/session.js
// Single source of truth for auth/session storage
// Optional refactor: schema versioning + safer parsing + backward-compatible migration

const SESSION_KEY_V1 = "medflowSession:v1";

// Legacy keys (keep for backward compatibility)
const USER_KEY_LEGACY = "medflowUser";
const TOKEN_KEY_LEGACY = "medflowToken";

function safeJsonParse(raw, fallback = null) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

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

function readSessionV1() {
  try {
    const raw = localStorage.getItem(SESSION_KEY_V1);
    const s = safeJsonParse(raw, null);
    if (!s || typeof s !== "object") return null;
    return {
      user: s.user || null,
      token: s.token || "",
      updatedAt: s.updatedAt || "",
      version: 1,
    };
  } catch {
    return null;
  }
}

function writeSessionV1(next) {
  try {
    const payload = {
      version: 1,
      user: next?.user ?? null,
      token: next?.token ?? "",
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY_V1, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function migrateLegacyIfNeeded() {
  // If v1 exists, no migration needed
  const v1 = readSessionV1();
  if (v1) return v1;

  // Otherwise attempt to read legacy keys and migrate
  try {
    const rawUser = localStorage.getItem(USER_KEY_LEGACY);
    const user = safeJsonParse(rawUser, null);
    const token = localStorage.getItem(TOKEN_KEY_LEGACY) || "";

    if (user || token) {
      writeSessionV1({ user, token });
      return readSessionV1();
    }
  } catch {
    // ignore
  }

  return null;
}

export function getSessionUser() {
  const s = migrateLegacyIfNeeded();
  return s?.user ?? null;
}

export function getSessionToken() {
  const s = migrateLegacyIfNeeded();
  return s?.token ?? "";
}

export function setSessionUser(user) {
  if (!user) return;

  // v1
  const current = migrateLegacyIfNeeded();
  writeSessionV1({ user, token: current?.token || "" });

  // legacy (optional compatibility)
  try {
    localStorage.setItem(USER_KEY_LEGACY, JSON.stringify(user));
  } catch {
    // ignore
  }

  emitSessionChange("login");
}

export function setSessionToken(token) {
  if (!token) return;

  // v1
  const current = migrateLegacyIfNeeded();
  writeSessionV1({ user: current?.user || null, token: String(token) });

  // legacy (optional compatibility)
  try {
    localStorage.setItem(TOKEN_KEY_LEGACY, String(token));
  } catch {
    // ignore
  }

  emitSessionChange("token");
}

export function setSession({ user, token } = {}) {
  const current = migrateLegacyIfNeeded();
  const nextUser = user !== undefined ? user : current?.user || null;
  const nextToken = token !== undefined ? String(token || "") : current?.token || "";

  writeSessionV1({ user: nextUser, token: nextToken });

  // legacy compatibility (optional)
  try {
    if (nextUser) localStorage.setItem(USER_KEY_LEGACY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY_LEGACY);

    if (nextToken) localStorage.setItem(TOKEN_KEY_LEGACY, nextToken);
    else localStorage.removeItem(TOKEN_KEY_LEGACY);
  } catch {
    // ignore
  }

  emitSessionChange("change");
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY_V1);
    localStorage.removeItem(USER_KEY_LEGACY);
    localStorage.removeItem(TOKEN_KEY_LEGACY);
    emitSessionChange("logout");
  } catch {
    // ignore
  }
}

export function isLoggedIn() {
  const u = getSessionUser();
  return !!u?.id;
}
