<!-- src/views/ThreadView.vue -->
<template>
  <main class="mx-auto max-w-3xl px-4 pb-28 pt-4">
    <section v-if="blocked" class="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 class="text-sm font-bold text-amber-900">Verification required</h2>
      <p class="mt-1 text-[11px] text-amber-800">Your account must be verified before you can view or reply to patient messages.</p>
      <div class="mt-3">
        <RouterLink to="/profile" class="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700">Open Profile</RouterLink>
      </div>
    </section>

    <section v-else class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <header class="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div class="min-w-0">
          <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Thread</p>
          <h1 class="truncate text-base font-semibold text-slate-900">
            {{ headerTitle || "Conversation" }}
          </h1>
        </div>

        <RouterLink
          to="/inbox"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Inbox
        </RouterLink>
      </header>

      <div ref="scroller" class="h-[calc(100vh-260px)] overflow-y-auto bg-slate-50 p-4">
        <div v-if="loading" class="text-[11px] text-slate-500">Loading…</div>

        <div v-else class="space-y-3">
          <div
            v-for="m in messages"
            :key="m.id"
            class="flex"
            :class="m.senderUserId === me?.id ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm"
              :class="m.senderUserId === me?.id ? 'bg-sky-600 text-white' : 'bg-white text-slate-800 border border-slate-200'"
            >
              <p class="whitespace-pre-wrap">{{ m.body }}</p>
              <p class="mt-1 text-[10px] opacity-75">{{ formatWhen(m.createdAt) }}</p>
            </div>
          </div>

          <div v-if="!messages.length" class="text-[11px] text-slate-500">No messages yet. Say hi 👋</div>
        </div>
      </div>

      <form class="border-t border-slate-100 bg-white p-3" @submit.prevent="send">
        <div class="flex items-end gap-2">
          <textarea
            v-model="draft"
            rows="1"
            class="min-h-[42px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Type a message…"
          />
          <button
            type="submit"
            :disabled="sending || !draft.trim()"
            class="inline-flex h-[42px] items-center justify-center rounded-2xl bg-sky-600 px-4 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="!sending">Send</span>
            <span v-else>…</span>
          </button>
        </div>
        <p v-if="error" class="mt-2 text-[11px] text-red-600">{{ error }}</p>
        <p v-if="hint" class="mt-2 text-[11px] text-slate-500">{{ hint }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useRoute, RouterLink } from "vue-router";

import { getSessionUser } from "../utils/session";
import { normalizeRole } from "../utils/patientContext";
import { getMessages, sendMessage, markThreadRead } from "../utils/inbox";

const route = useRoute();

const me = computed(() => getSessionUser());
const role = computed(() => normalizeRole(me.value?.role));
const verificationStatus = computed(() => String(me.value?.verification_status || me.value?.verificationStatus || "").toLowerCase());

// Staff must be verified before messaging patients
const blocked = computed(() => {
  if (role.value === "clinician" || role.value === "student") {
    return verificationStatus.value !== "verified";
  }
  return false;
});

const threadId = computed(() => Number(route.params.threadId || 0));

const loading = ref(true);
const sending = ref(false);
const error = ref("");
const hint = ref("");

const messages = ref([]);
const headerTitle = ref("");

const draft = ref("");
const scroller = ref(null);

const formatWhen = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "";
  }
};

const scrollToBottom = async () => {
  await nextTick();
  try {
    const el = scroller.value;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  } catch {
    // ignore
  }
};

const load = async () => {
  if (!threadId.value) {
    messages.value = [];
    headerTitle.value = "Conversation";
    loading.value = false;
    return;
  }

  if (blocked.value) {
    messages.value = [];
    headerTitle.value = "Conversation";
    loading.value = false;
    return;
  }

  error.value = "";
  hint.value = "";
  loading.value = true;

  try {
    const data = await getMessages(threadId.value);
    headerTitle.value = data?.headerTitle || "Conversation";
    messages.value = Array.isArray(data?.messages) ? data.messages : [];

    // best-effort mark as read
    await markThreadRead(threadId.value);

    await scrollToBottom();
  } catch (e) {
    error.value = e?.message || "Failed to load messages";
  } finally {
    loading.value = false;
  }
};

const send = async () => {
  const body = draft.value.trim();
  if (!body) return;

  sending.value = true;
  error.value = "";
  hint.value = "";

  try {
    await sendMessage({ threadId: threadId.value, body });
    draft.value = "";
    await load();
  } catch (e) {
    error.value = e?.message || "Failed to send";
    hint.value = "If you're a clinician/student, your account must be verified before messaging.";
  } finally {
    sending.value = false;
  }
};

onMounted(load);
watch(threadId, load);
</script>
