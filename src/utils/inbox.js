// src/utils/inbox.js

import { apiGet, apiPost } from "./apiClient";

export async function listThreads() {
  const data = await apiGet("list_threads.php");
  if (!data?.success) throw new Error(data?.error || "Failed to load inbox");
  return Array.isArray(data.threads) ? data.threads : [];
}

export async function getMessages(threadId) {
  const id = Number(threadId || 0);
  if (!id) throw new Error("Invalid thread");
  const data = await apiGet(`get_messages.php?threadId=${encodeURIComponent(id)}`);
  if (!data?.success) throw new Error(data?.error || "Failed to load messages");
  return {
    thread: data.thread || null,
    messages: Array.isArray(data.messages) ? data.messages : [],
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
