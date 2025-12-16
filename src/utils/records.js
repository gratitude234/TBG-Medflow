// src/utils/records.js
import { apiGet, apiPost } from "./apiClient";
import { getSessionUser } from "./session";

// -------------------------
// Date + time helpers
// -------------------------
export const parseYMDLocal = (ymd) => (ymd ? new Date(`${ymd}T00:00:00`) : null);

export const formatDisplayDate = (ymd) => {
  const d = parseYMDLocal(ymd);
  if (!d) return "—";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today - that) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 6) return `${diffDays} days ago`;

  try {
    return that.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return ymd;
  }
};

export const formatTime12h = (t) => {
  if (!t) return "—";
  const s = String(t).trim();
  if (!s) return "—";

  // If already AM/PM-ish, keep it
  if (/[AP]M/i.test(s)) return s;

  // Expect "HH:MM" (24h) or "HH:MM:SS"
  const parts = s.split(":");
  const hh = Number(parts[0] ?? 0);
  const mm = Number(parts[1] ?? 0);

  const date = new Date();
  date.setHours(hh, mm, 0, 0);

  try {
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch {
    const ampm = hh >= 12 ? "PM" : "AM";
    const h12 = ((hh + 11) % 12) + 1;
    return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
  }
};

export const parseTimeToMinutes = (timeStr) => {
  const t = String(timeStr || "").trim();
  if (!t || t === "—") return 0;

  // "HH:MM"
  const m24 = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (m24) {
    const hh = Math.max(0, Math.min(23, Number(m24[1])));
    const mm = Math.max(0, Math.min(59, Number(m24[2])));
    return hh * 60 + mm;
  }

  // "H:MM AM/PM"
  const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let hh = Number(m12[1]);
    const mm = Number(m12[2]);
    const ap = m12[3].toUpperCase();
    if (hh === 12) hh = 0;
    if (ap === "PM") hh += 12;
    return hh * 60 + mm;
  }

  return 0;
};

const dateKey = (ymd) => {
  // Convert YYYY-MM-DD -> yyyymmdd int for sorting
  const s = String(ymd || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return 0;
  const y = Number(s.slice(0, 4)) || 0;
  const m = Number(s.slice(5, 7)) || 0;
  const d = Number(s.slice(8, 10)) || 0;
  return y * 10000 + m * 100 + d;
};

const recordSortKey = (r) => {
  // Bigger = newer
  return dateKey(r?.date) * 10000 + (r?.timeMinutes || 0);
};

// -------------------------
// Normalizer (single source of truth)
// -------------------------
export const normalizeRecord = (r = {}) => {
  const id = r.id ?? r.record_id ?? r.recordId ?? null;

  // Date from backend (preferred) or already-normalized field
  const date = (r.date ?? r.record_date ?? r.recordDate ?? "").trim();

  // Raw time from backend (can be null)
  const rawTime = (r.record_time ?? r.recordTime ?? r.time ?? "").trim();

  const time = formatTime12h(rawTime);
  const timeMinutes = parseTimeToMinutes(rawTime || time);

  const sessionRaw = r.session ?? "";
  const session = String(sessionRaw || "").trim().toLowerCase();

  const bpSystolic = Number(r.bpSystolic ?? r.bp_systolic ?? 0) || null;
  const bpDiastolic = Number(r.bpDiastolic ?? r.bp_diastolic ?? 0) || null;
  const heartRate = Number(r.heartRate ?? r.heart_rate ?? 0) || null;

  const temperature =
    r.temperature === null || r.temperature === undefined || r.temperature === ""
      ? null
      : Number(r.temperature);

  const bloodSugar = Number(r.bloodSugar ?? r.blood_sugar ?? 0) || null;

  const takenMedicationRaw = r.takenMedication ?? r.taken_medication ?? 0;
  const fastingRaw = r.fasting ?? r.fasting ?? 0;
  const shareRaw = r.shareWithClinician ?? r.share_with_clinician ?? 0;

  return {
    id,
    date,
    displayDate: formatDisplayDate(date),

    // Display time
    time,

    // Sorting helpers (won’t break UI; just extra fields)
    timeRaw: rawTime || "",
    timeMinutes,

    session,

    bpSystolic,
    bpDiastolic,
    heartRate,
    temperature,
    bloodSugar,

    symptoms: r.symptoms ?? "",
    notes: r.notes ?? "",

    flags: {
      takenMedication: !!Number(takenMedicationRaw),
      fasting: !!Number(fastingRaw),
      shareWithClinician: !!Number(shareRaw),
    },
  };
};

// Backward-compatible helper (your views already import this)
export const getLoggedInUser = () => {
  return getSessionUser();
};

// -------------------------
// Fetch (POST with GET fallback) + sort newest-first
// -------------------------
export const fetchUserRecords = async (userId) => {
  let data;

  try {
    // Backend accepts POST JSON
    data = await apiPost("list_records.php", { userId, user_id: userId });
  } catch (e) {
    const msg = String(e?.message || "").toLowerCase();
    // If server blocks POST, fallback to GET
    if (msg.includes("method not allowed") || msg.includes("405")) {
      data = await apiGet(`list_records.php?user_id=${encodeURIComponent(userId)}`);
    } else {
      throw e;
    }
  }

  const raw = Array.isArray(data?.records) ? data.records : [];

  const normalized = raw
    .map(normalizeRecord)
    .filter((x) => x?.id != null && x?.date);

  // ✅ newest-first so Dashboard can safely use records[0]
  normalized.sort((a, b) => recordSortKey(b) - recordSortKey(a));

  return normalized;
};
