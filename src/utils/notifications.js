// src/utils/notifications.js

import { apiGet, apiPost } from "./apiClient";

export async function listNotifications({ limit = 30, unreadOnly = false } = {}) {
  const qs = new URLSearchParams();
  if (limit) qs.set("limit", String(limit));
  if (unreadOnly) qs.set("unreadOnly", "1");

  const data = await apiGet(`list_notifications.php?${qs.toString()}`);
  if (!data?.success) throw new Error(data?.error || "Failed to load notifications");
  return Array.isArray(data.notifications) ? data.notifications : [];
}

export async function markNotificationsRead({ ids, all } = {}) {
  const data = await apiPost("mark_notifications_read.php", {
    ids: Array.isArray(ids) ? ids : undefined,
    all: all ? 1 : 0,
  });
  if (!data?.success) throw new Error(data?.error || "Failed to mark as read");
  return data;
}
