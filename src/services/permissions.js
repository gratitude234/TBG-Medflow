// src/services/permissions.js

export const ROLES = Object.freeze({
  PATIENT: "patient",
  STUDENT: "student",
  CLINICIAN: "clinician",
  OTHER: "other",
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.PATIENT]: "Patient / family",
  [ROLES.STUDENT]: "Student nurse",
  [ROLES.CLINICIAN]: "Clinician / mentor",
  [ROLES.OTHER]: "Other",
});

export function normalizeRole(role) {
  const r = String(role || "").toLowerCase();
  if (r === ROLES.STUDENT) return ROLES.STUDENT;
  if (r === ROLES.CLINICIAN) return ROLES.CLINICIAN;
  if (r === ROLES.OTHER) return ROLES.OTHER;
  return ROLES.PATIENT;
}

export function roleLabel(role) {
  return ROLE_LABELS[normalizeRole(role)] || ROLE_LABELS[ROLES.PATIENT];
}

/**
 * Permissions are **UI capabilities** for MVP (not security).
 * Real security must be enforced in backend later.
 */
export function permissionsFor(role) {
  const r = normalizeRole(role);

  return {
    role: r,

    // Core actions
    canAddVitals: true,
    canAddRecord: true,
    canViewRecords: true,
    canShare: true,

    // Encounters workflow
    canUseEncounters: r === ROLES.STUDENT || r === ROLES.CLINICIAN,

    // Review/mentor workflow (future)
    canReview: r === ROLES.CLINICIAN,

    // Admin/research (future)
    canManageWorkspace: r === ROLES.OTHER,
  };
}
