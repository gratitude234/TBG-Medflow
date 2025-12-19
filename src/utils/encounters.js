// src/utils/encounters.js
import { apiGet, apiPost } from "./apiClient";
import { formatDisplayDate, formatTime12h } from "./records";

export const normalizeEncounter = (e = {}) => {
  const id = e.id ?? e.encounter_id ?? e.encounterId ?? null;

  const date = e.date ?? e.encounter_date ?? e.encounterDate ?? "";
  const time = formatTime12h(e.time ?? e.encounter_time ?? e.encounterTime ?? "");
  const session = String(e.session ?? "").toLowerCase();

  return {
    id,
    patientUserId: Number(e.patientUserId ?? e.patient_user_id ?? 0) || null,
    authorUserId: Number(e.authorUserId ?? e.author_user_id ?? 0) || null,
    authorRole: e.authorRole ?? e.author_role ?? "patient",

    date,
    displayDate: formatDisplayDate(date),
    time,
    session,

    chiefComplaint: e.chiefComplaint ?? e.chief_complaint ?? "",
    subjective: e.subjective ?? "",
    objective: e.objective ?? "",
    assessment: e.assessment ?? "",
    plan: e.plan ?? "",
    followUpDate: e.followUpDate ?? e.follow_up_date ?? "",

    status: e.status ?? "draft",
    createdAt: e.createdAt ?? e.created_at ?? null,
  };
};

// Fetch (POST with GET fallback)
export const fetchUserEncounters = async (userId) => {
  let data;
  try {
    data = await apiPost("list_encounters.php", { userId });
  } catch (e) {
    const msg = String(e?.message || "").toLowerCase();
    if (msg.includes("method not allowed") || msg.includes("405")) {
      data = await apiGet(`list_encounters.php?userId=${encodeURIComponent(userId)}`);
    } else {
      throw e;
    }
  }

  const raw = Array.isArray(data?.encounters) ? data.encounters : [];
  return raw.map(normalizeEncounter).filter((x) => x?.id != null && x?.date);
};

/**
 * ✅ FIX: DashboardView expects fetchUserNotes from this module.
 * We'll alias notes to encounters (lightweight layer).
 */
export const fetchUserNotes = async (userId) => {
  return fetchUserEncounters(userId);
};

export const createEncounter = async (payload) => {
  const data = await apiPost("add_encounter.php", payload);
  if (!data?.success) throw new Error(data?.error || "Failed to save encounter");
  return data;
};
