// src/utils/inbox.js

import { apiGet, apiPost } from "./apiClient";
import { getSessionUser } from "./session";

const THREADS_CACHE_PREFIX = "medflowThreadsCache:"; // per-user

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const cacheKey = () => {
  const me = getSessionUser();
  const id = Number(me?.id || 0);
  return `${THREADS_CACHE_PREFIX}${id || "anon"}`;
};

const cacheThreads = (threads) => {
  try {
    sessionStorage.setItem(cacheKey(), JSON.stringify(Array.isArray(threads) ? threads : []));
  } catch {
    // ignore
  }
};

const readCachedThreads = () => {
  try {
    const raw = sessionStorage.getItem(cacheKey());
    const list = safeParse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const normalizeThread = (t = {}) => {
  const id = Number(t.id || 0) || null;
  const otherUser = {
    fullName: String(t.otherFullName ?? t.other_full_name ?? "").trim(),
    email: String(t.otherEmail ?? t.other_email ?? "").trim(),
    role: String(t.otherRole ?? t.other_role ?? "").toLowerCase(),
  };

  return {
    id,
    patientUserId: Number(t.patient_user_id ?? t.patientUserId ?? 0) || null,
    viewerUserId: Number(t.viewer_user_id ?? t.viewerUserId ?? 0) || null,
    otherUser,
    unreadCount: Number(t.unreadCount ?? t.unread_count ?? 0) || 0,
    lastMessageAt: t.last_message_at ?? t.lastMessageAt ?? null,
    lastMessagePreview: t.last_message_preview ?? t.lastMessagePreview ?? "",
    createdAt: t.created_at ?? t.createdAt ?? null,
  };
};

export async function listThreads() {
  const data = await apiGet("list_threads.php");
  if (!data?.success) throw new Error(data?.error || "Failed to load inbox");
  const threads = (Array.isArray(data.threads) ? data.threads : []).map(normalizeThread).filter((t) => t.id);
  cacheThreads(threads);
  return threads;
}

export function getCachedThread(threadId) {
  const id = Number(threadId || 0);
  if (!id) return null;
  const threads = readCachedThreads();
  return threads.find((t) => Number(t.id) === id) || null;
}

export async function getMessages(threadId) {
  const id = Number(threadId || 0);
  if (!id) throw new Error("Invalid thread");

  const data = await apiGet(`get_messages.php?threadId=${encodeURIComponent(id)}`);
  if (!data?.success) throw new Error(data?.error || "Failed to load messages");

  const cached = getCachedThread(id);
  const headerTitle = cached?.otherUser?.fullName || "Conversation";

  return {
    thread: data.thread || null,
    messages: Array.isArray(data.messages) ? data.messages : [],
    headerTitle,
  };
}

export async function sendMessage({ threadId, body }) {
  const id = Number(threadId || 0);
  const text = String(body || "").trim();
  if (!id) throw new Error("Invalid thread");
  if (!text) throw new Error("Message cannot be empty");

  const data = await apiPost("send_message.php", { threadId: id, body: text });
  if (!data?.success) throw new Error(data?.error || "Failed to send message");
  return data;
}

export async function markThreadRead(threadId) {
  const id = Number(threadId || 0);
  if (!id) return;
  try {
    await apiPost("mark_thread_read.php", { threadId: id });
  } catch {
    // ignore
  }
}
