// src/utils/monitoring.js
// Option A (Share code) – monitoring network helpers.

import { apiGet, apiPost } from "./apiClient";
import { cacheMonitoringPatients, getCachedMonitoringPatients } from "./patientContext";

const normalizePatient = (p = {}) => {
  // Backend: list_monitoring_patients.php returns patientUserId, fullName, email, lastRecordDate, lastEncounterAt
  return {
    id: Number(p.patientUserId ?? p.patient_user_id ?? p.id ?? 0) || null,
    fullName: String(p.fullName ?? p.full_name ?? p.patient_name ?? p.name ?? "").trim(),
    email: String(p.email ?? p.patient_email ?? "").trim(),
    // Keep naming used by ShareView.vue and DashboardView.vue
    lastRecordAt: p.lastRecordAt ?? p.lastRecordDate ?? p.last_record_at ?? p.last_record_date ?? null,
    lastEncounterAt: p.lastEncounterAt ?? p.last_encounter_at ?? p.last_encounterAt ?? null,
  };
};

export async function createShareInvite({ allowedRole = "clinician", expiresInDays = 7 } = {}) {
  const days = Number(expiresInDays || 0) || 3;
  const expiresInHours = Math.max(1, Math.min(24 * 30, Math.round(days * 24)));

  const data = await apiPost("create_share_invite.php", {
    allowedRole,
    expiresInHours,
  });

  if (!data?.success) throw new Error(data?.error || "Failed to create share code");
  return {
    code: String(data.code || data.inviteCode || "").trim(),
    expiresAt: data.expiresAt || data.expires_at || null,
    allowedRole: String(data.allowedRole || data.allowed_role || allowedRole || "").toLowerCase(),
  };
}

export async function acceptShareInvite({ code } = {}) {
  const data = await apiPost("accept_share_invite.php", {
    code: String(code || "").trim(),
  });
  if (!data?.success) throw new Error(data?.error || "Invalid or expired code");
  return data;
}

// Returns list of patients that viewer can monitor.
// Falls back to cached list if API isn't reachable.
export async function listMonitoringPatients(viewerUserId) {
  try {
    const data = await apiGet("list_monitoring_patients.php");
    if (!data?.success) throw new Error(data?.error || "Failed to load patients");
    const raw = Array.isArray(data.patients) ? data.patients : Array.isArray(data.data) ? data.data : [];
    const normalized = raw.map(normalizePatient).filter((x) => x.id);
    cacheMonitoringPatients(viewerUserId, normalized);
    return normalized;
  } catch {
    return getCachedMonitoringPatients(viewerUserId);
  }
}

export async function revokeAccess({ viewerUserId, code } = {}) {
  const data = await apiPost("revoke_access.php", {
    viewerUserId,
    code,
  });
  if (!data?.success) throw new Error(data?.error || "Failed to revoke access");
  return data;
}
