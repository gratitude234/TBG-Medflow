<!-- src/views/InboxView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-24 pt-4 space-y-6">
    <section v-if="blocked" class="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 class="text-sm font-bold text-amber-900">Verification required</h2>
      <p class="mt-1 text-[11px] text-amber-800">
        Your account must be verified before you can view or reply to patient shares. Go to Profile → Verification.
      </p>
      <div class="mt-3">
        <RouterLink to="/profile" class="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700">Open Profile</RouterLink>
      </div>
    </section>

    <section v-else class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-lg font-bold text-slate-900">Inbox</h1>
          <p class="mt-1 text-[11px] text-slate-600">
            Messages and share notifications.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="reload"
            :disabled="loading"
          >
            {{ loading ? "Refreshing…" : "Refresh" }}
          </button>
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <!-- Threads -->
        <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[11px] font-semibold text-slate-700">Threads</p>
            <p class="text-[10px] text-slate-500">{{ threads.length }} total</p>
          </div>

          <div class="mt-2">
            <input
              v-model="q"
              type="text"
              placeholder="Search by name…"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div v-if="toast" class="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11px] text-red-800 ring-1 ring-red-100">
            {{ toast }}
          </div>

          <div class="mt-3 space-y-2">
            <RouterLink
              v-for="t in filteredThreads"
              :key="t.id"
              :to="{ name: 'thread', params: { threadId: t.id } }"
              class="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm hover:bg-slate-50"
            >
              <div class="min-w-0">
                <p class="truncate text-[12px] font-semibold text-slate-900">
                  {{ t.otherUser?.fullName || "Conversation" }}
                </p>
                <p class="mt-0.5 line-clamp-2 text-[11px] text-slate-600">
                  {{ t.lastMessagePreview || "No messages yet" }}
                </p>
                <p class="mt-1 text-[10px] text-slate-500">
                  Last: {{ formatTime(t.lastMessageAt || t.createdAt) }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span
                  v-if="Number(t.unreadCount || 0) > 0"
                  class="inline-flex min-w-[22px] items-center justify-center rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white"
                >
                  {{ t.unreadCount }}
                </span>
                <span class="text-[10px] text-slate-400 group-hover:text-slate-500">Open →</span>
              </div>
            </RouterLink>

            <div v-if="!loading && filteredThreads.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-white p-4">
              <p class="text-[11px] font-semibold text-slate-700">No threads yet</p>
              <p class="mt-1 text-[11px] text-slate-600">
                Share your record to a verified clinician/student from the Share page to start a thread.
              </p>
              <RouterLink
                to="/share"
                class="mt-3 inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Go to Share
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[11px] font-semibold text-slate-700">Notifications</p>
            <button
              class="text-[11px] font-semibold text-sky-700 hover:text-sky-800"
              @click="markAllRead"
              :disabled="notifLoading"
            >
              Mark all read
            </button>
          </div>

          <div class="mt-3 space-y-2">
            <div
              v-for="n in notifications"
              :key="n.id"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-[12px] font-semibold text-slate-900">
                    {{ n.title || n.type }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-slate-600">
                    {{ n.body || "" }}
                  </p>
                  <p class="mt-1 text-[10px] text-slate-500">
                    {{ formatTime(n.createdAt) }}
                  </p>
                </div>
                <span
                  v-if="!n.readAt"
                  class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800"
                >
                  NEW
                </span>
              </div>

              <div v-if="n.link" class="mt-2">
                <RouterLink :to="n.link" class="text-[11px] font-semibold text-sky-700 hover:text-sky-800">
                  Open
                </RouterLink>
              </div>
            </div>

            <div v-if="!notifLoading && notifications.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-white p-4">
              <p class="text-[11px] text-slate-600">No notifications yet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { listThreads } from "../utils/inbox";
import { getSessionUser } from "../utils/session";
import { listNotifications, markAllNotificationsRead } from "../utils/notifications";

const loading = ref(false);

const sessionUser = ref(getSessionUser());
const role = computed(() => String(sessionUser.value?.role || 'patient').toLowerCase());
const verificationStatus = computed(() => String(sessionUser.value?.verificationStatus || sessionUser.value?.verification_status || '').toLowerCase());
const blocked = computed(() => role.value !== 'patient' && verificationStatus.value !== 'verified');

const notifLoading = ref(false);
const toast = ref("");

const threads = ref([]);
const notifications = ref([]);

const q = ref("");

const filteredThreads = computed(() => {
  const query = String(q.value || "").trim().toLowerCase();
  if (!query) return threads.value;
  return threads.value.filter((t) => String(t?.otherUser?.fullName || "").toLowerCase().includes(query));
});

const formatTime = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
};

const reload = async () => {
  sessionUser.value = getSessionUser();
  if (blocked.value) { threads.value = []; notifications.value = []; return; }

  toast.value = "";
  loading.value = true;
  try {
    threads.value = await listThreads();
  } catch (e) {
    toast.value = e?.message || "Failed to load inbox";
  } finally {
    loading.value = false;
  }

  notifLoading.value = true;
  try {
    notifications.value = await listNotifications({ limit: 10 });
  } catch {
    // don't block inbox if notif fails
    notifications.value = [];
  } finally {
    notifLoading.value = false;
  }
};

const markAllRead = async () => {
  notifLoading.value = true;
  try {
    await markAllNotificationsRead();
    notifications.value = notifications.value.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }));
  } catch {
    // ignore
  } finally {
    notifLoading.value = false;
  }
};

onMounted(reload);
</script>
