// src/utils/monitoring.js
// Option A (Share code) – monitoring network helpers.

import { apiGet, apiPost } from "./apiClient";
import { cacheMonitoringPatients, getCachedMonitoringPatients } from "./patientContext";

const normalizePatient = (p = {}) => {
  return {
    id: Number(p.id ?? p.patient_user_id ?? p.patientUserId ?? 0) || null,
    fullName: String(p.fullName ?? p.full_name ?? p.patient_name ?? p.name ?? "").trim(),
    email: String(p.email ?? p.patient_email ?? "").trim(),
    lastRecordAt: p.lastRecordAt ?? p.last_record_at ?? null,
    lastEncounterAt: p.lastEncounterAt ?? p.last_encounter_at ?? null,
  };
};

export async function createShareInvite({ patientUserId, allowedRole = "clinician", expiresInDays = 7 }) {
  const data = await apiPost("create_share_invite.php", {
    patientUserId,
    allowedRole,
    expiresInDays,
  });

  if (!data?.success) throw new Error(data?.error || "Failed to create share code");
  return {
    code: String(data.code || data.inviteCode || "").trim(),
    expiresAt: data.expiresAt || data.expires_at || null,
  };
}

export async function acceptShareInvite({ code, viewerUserId }) {
  const data = await apiPost("accept_share_invite.php", {
    code: String(code || "").trim(),
    viewerUserId,
  });
  if (!data?.success) throw new Error(data?.error || "Invalid or expired code");
  return data;
}

// Returns list of patients that viewer can monitor.
// Falls back to cached list if API isn't ready yet.
export async function listMonitoringPatients(viewerUserId) {
  try {
    const data = await apiGet(`list_monitoring_patients.php?userId=${encodeURIComponent(viewerUserId)}`);
    if (!data?.success) throw new Error(data?.error || "Failed to load patients");
    const raw = Array.isArray(data.patients) ? data.patients : Array.isArray(data.data) ? data.data : [];
    const normalized = raw.map(normalizePatient).filter((x) => x.id);
    cacheMonitoringPatients(viewerUserId, normalized);
    return normalized;
  } catch {
    return getCachedMonitoringPatients(viewerUserId);
  }
}

export async function revokeAccess({ patientUserId, viewerUserId, code }) {
  const data = await apiPost("revoke_access.php", {
    patientUserId,
    viewerUserId,
    code,
  });
  if (!data?.success) throw new Error(data?.error || "Failed to revoke access");
  return data;
}
