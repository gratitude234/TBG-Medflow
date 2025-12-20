// src/utils/careTeam.js

import { apiGet, apiPost } from "./apiClient";

const normalizeUser = (u = {}) => ({
  id: Number(u.id ?? u.userId ?? 0) || null,
  fullName: String(u.fullName ?? u.full_name ?? "").trim(),
  email: String(u.email ?? "").trim(),
  role: String(u.role ?? "").toLowerCase(),
  verificationStatus: String(u.verificationStatus ?? u.verification_status ?? "").toLowerCase(),
});

export async function searchVerifiedStaff(q) {
  const qq = String(q || "").trim();
  const data = await apiGet(`search_verified_staff.php?q=${encodeURIComponent(qq)}`);
  if (!data?.success) throw new Error(data?.error || "Search failed");
  return (Array.isArray(data.results) ? data.results : []).map(normalizeUser).filter((x) => x.id);
}

export async function addCareMember(viewerUserId) {
  const data = await apiPost("add_care_member.php", { viewerUserId });
  if (!data?.success) throw new Error(data?.error || "Failed to add care member");
  return {
    threadId: Number(data.threadId ?? 0) || null,
  };
}

export async function listCareTeam() {
  const data = await apiGet("list_care_team.php");
  if (!data?.success) throw new Error(data?.error || "Failed to load care team");
  const raw = Array.isArray(data.members) ? data.members : Array.isArray(data.careTeam) ? data.careTeam : [];

  return raw
    .map((m) => {
      const staff = normalizeUser(m.staff || m);
      return {
        grantId: Number(m.grantId ?? m.grant_id ?? 0) || null,
        viewerUserId: Number(m.viewerUserId ?? m.viewer_user_id ?? 0) || null,
        viewerRole: String(m.viewerRole ?? m.viewer_role ?? staff.role ?? "").toLowerCase(),
        status: String(m.status ?? "active").toLowerCase(),

        threadId: Number(m.threadId ?? m.thread_id ?? 0) || null,
        lastMessageAt: m.lastMessageAt ?? m.last_message_at ?? null,
        lastMessagePreview: String(m.lastMessagePreview ?? m.last_message_preview ?? ""),

        staff,
      };
    })
    .filter((x) => x.viewerUserId && x.staff?.id);
}

export async function shareRecord({ viewerUserId, recordId = null, note = "" }) {
  const data = await apiPost("share_record.php", {
    viewerUserId,
    recordId,
    note,
  });
  if (!data?.success) throw new Error(data?.error || "Failed to share record");
  return {
    recordId: Number(data.recordId ?? 0) || null,
    threadId: Number(data.threadId ?? 0) || null,
  };
}

export async function revokeCareMember(viewerUserId) {
  const id = Number(viewerUserId || 0);
  if (!id) throw new Error("Invalid staff member");
  const data = await apiPost("revoke_care_member.php", { viewerUserId: id });
  if (!data?.success) throw new Error(data?.error || "Failed to revoke access");
  return data;
}
