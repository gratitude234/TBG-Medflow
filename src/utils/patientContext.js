// src/utils/patientContext.js
// Patient context helper for "Monitoring" (Option A)
//
// Goal:
// - Patients act on themselves.
// - Clinician/Student can act on a selected patient they monitor.
// - Selection is stored per-viewer so navigation stays consistent.

const ACTIVE_PATIENT_PREFIX = "medflowActivePatient:"; // medflowActivePatient:<viewerId>
const MONITORING_CACHE_PREFIX = "medflowMonitoringPatients:"; // medflowMonitoringPatients:<viewerId>

const keyActive = (viewerId) => `${ACTIVE_PATIENT_PREFIX}${viewerId}`;
const keyMonitoring = (viewerId) => `${MONITORING_CACHE_PREFIX}${viewerId}`;

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const normalizeRole = (role) => {
  const r = String(role || "patient").toLowerCase();
  return ["patient", "student", "clinician", "other"].includes(r) ? r : "patient";
};

export function getActivePatient(viewerId) {
  try {
    if (!viewerId) return null;
    return safeParse(localStorage.getItem(keyActive(viewerId)));
  } catch {
    return null;
  }
}

export function setActivePatient(viewerId, patient) {
  try {
    if (!viewerId || !patient?.id) return;
    const payload = {
      id: Number(patient.id),
      fullName: patient.fullName || patient.full_name || patient.name || "",
      email: patient.email || "",
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(keyActive(viewerId), JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function clearActivePatient(viewerId) {
  try {
    if (!viewerId) return;
    localStorage.removeItem(keyActive(viewerId));
  } catch {
    // ignore
  }
}

export function getCachedMonitoringPatients(viewerId) {
  try {
    if (!viewerId) return [];
    const raw = localStorage.getItem(keyMonitoring(viewerId));
    const list = safeParse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function cacheMonitoringPatients(viewerId, patients) {
  try {
    if (!viewerId) return;
    const list = Array.isArray(patients) ? patients : [];
    localStorage.setItem(keyMonitoring(viewerId), JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function patientQuery(patientId) {
  const id = Number(patientId);
  return id > 0 ? { patientUserId: String(id) } : {};
}

export function getTargetPatientId({ user, route, allowFallbackToActive = true }) {
  const u = user || {};
  const role = normalizeRole(u.role);
  const viewerId = Number(u.id || 0);

  // Patients always operate on themselves
  if (role === "patient") return viewerId || null;

  // If route includes patientUserId, use it
  const qId = Number(route?.query?.patientUserId || 0);
  if (qId > 0) return qId;

  // Otherwise, fallback to stored active patient for this viewer
  if (allowFallbackToActive) {
    const active = getActivePatient(viewerId);
    const aId = Number(active?.id || 0);
    if (aId > 0) return aId;
  }

  return null;
}

export function getTargetPatientMeta({ user, route }) {
  const u = user || {};
  const role = normalizeRole(u.role);

  if (role === "patient") {
    return {
      id: Number(u.id || 0) || null,
      fullName: u.fullName || "",
      email: u.email || "",
      source: "self",
    };
  }

  const qId = Number(route?.query?.patientUserId || 0);
  if (qId > 0) {
    return {
      id: qId,
      fullName: String(route?.query?.patientName || "").trim(),
      email: "",
      source: "query",
    };
  }

  const active = getActivePatient(Number(u.id || 0));
  if (active?.id) {
    return {
      id: Number(active.id),
      fullName: active.fullName || "",
      email: active.email || "",
      source: "active",
    };
  }

  return { id: null, fullName: "", email: "", source: "none" };
}
