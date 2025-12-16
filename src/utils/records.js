// src/utils/records.js
import { apiGet, apiPost } from "./apiClient";

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
  if (/[AP]M/i.test(t)) return t;

  const parts = String(t).split(":");
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

// ✅ one normalizer for every view (Records/Dashboard/AddRecord)
export const normalizeRecord = (r = {}) => {
  const id = r.id ?? r.record_id ?? r.recordId ?? null;

  const date = r.date ?? r.record_date ?? r.recordDate ?? "";
  const time = formatTime12h(r.time ?? r.record_time ?? r.recordTime ?? "");
  const session = String(r.session ?? "").toLowerCase();

  const bpSystolic = Number(r.bpSystolic ?? r.bp_systolic ?? 0) || null;
  const bpDiastolic = Number(r.bpDiastolic ?? r.bp_diastolic ?? 0) || null;
  const heartRate = Number(r.heartRate ?? r.heart_rate ?? 0) || null;

  const temperature =
    r.temperature === null || r.temperature === undefined || r.temperature === ""
      ? null
      : Number(r.temperature);

  const bloodSugar = Number(r.bloodSugar ?? r.blood_sugar ?? 0) || null;

  const takenMedicationRaw = r.takenMedication ?? r.taken_medication ?? 0;
  const fastingRaw = r.fasting ?? 0;
  const shareRaw = r.shareWithClinician ?? r.share_with_clinician ?? 0;

  return {
    id,
    date,
    displayDate: formatDisplayDate(date),
    time,
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

export const getLoggedInUser = () => {
  try {
    const raw = localStorage.getItem("medflowUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ✅ single “source of truth” fetch (POST with GET fallback)
export const fetchUserRecords = async (userId) => {
  let data;
  try {
    data = await apiPost("list_records.php", { userId, user_id: userId });
  } catch (e) {
    const msg = String(e?.message || "").toLowerCase();
    if (msg.includes("method not allowed") || msg.includes("405")) {
      data = await apiGet(`list_records.php?user_id=${encodeURIComponent(userId)}`);
    } else {
      throw e;
    }
  }

  const raw = Array.isArray(data?.records) ? data.records : [];
  return raw.map(normalizeRecord).filter((x) => x?.id != null && x?.date);
};
