// src/utils/admin.js

// Prefer server truth (`user.isAdmin`) and fall back to role/email checks.
// Optional frontend allowlist (dev only): VITE_ADMIN_EMAILS="a@b.com,c@d.com"
const RAW = import.meta.env.VITE_ADMIN_EMAILS || "";
const ADMIN_EMAILS = new Set(
  RAW.split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

export function isAdmin(user) {
  if (!user) return false;

  // Server-provided truth (recommended)
  if (user.isAdmin === true) return true;

  const role = String(user.role || "").toLowerCase();
  if (role === "admin" || role === "super_admin") return true;

  const email = String(user.email || "").toLowerCase();
  return ADMIN_EMAILS.has(email);
}
