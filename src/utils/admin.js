// src/utils/admin.js

// MVP: allowlist admin emails so you can access admin screens
// even if your DB role isn't "admin" yet.
//
// IMPORTANT:
// - Change this to your own email(s)
// - Or better: set your DB role to "admin" / "super_admin" and you can leave this empty.
export const ADMIN_EMAILS = new Set([
  "gratitudeolanibi2020@gmail.com",
]);

export function isAdmin(user) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  if (role === "admin" || role === "super_admin") return true;
  const email = String(user.email || "").toLowerCase();
  return ADMIN_EMAILS.has(email);
}
