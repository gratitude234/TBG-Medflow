<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:pt-6 lg:pt-8">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Encounters</h1>
        <p class="mt-1 text-[11px] text-slate-600">
          Visit notes (SOAP) for documentation and review.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <RouterLink
          to="/encounters/new"
          class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          ＋ New visit note
        </RouterLink>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          :disabled="loading"
          @click="load"
        >
          🔄 Refresh
        </button>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <!-- List -->
      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex gap-2">
            <input
              v-model="q"
              placeholder="Search complaint/assessment/plan…"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 sm:w-72"
            />
            <select
              v-model="status"
              class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <p class="text-[11px] text-slate-500">
            {{ filtered.length }} note{{ filtered.length === 1 ? "" : "s" }}
          </p>
        </div>

        <div v-if="error" class="mt-4 rounded-2xl bg-rose-50 p-3 text-[11px] text-rose-700">
          {{ error }}
        </div>

        <div v-if="loading" class="mt-4 space-y-2">
          <div class="h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
          <div class="h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
          <div class="h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
        </div>

        <div v-else class="mt-4 space-y-2">
          <button
            v-for="e in filtered"
            :key="e.id"
            type="button"
            class="w-full rounded-2xl border px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50/40"
            :class="selected?.id === e.id ? 'border-sky-300 bg-sky-50/40' : 'border-slate-200 bg-white'"
            @click="select(e)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-xs font-semibold text-slate-900">
                  {{ e.chiefComplaint || "Untitled visit note" }}
                </p>
                <p class="mt-1 text-[11px] text-slate-600">
                  {{ e.displayDate }} • {{ e.time }} • {{ prettySession(e.session) }}
                </p>
              </div>

              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ring-1"
                :class="badgeClass(e.status)"
              >
                {{ e.status }}
              </span>
            </div>
          </button>

          <div v-if="!filtered.length" class="mt-3 rounded-2xl bg-slate-50 p-4 text-[11px] text-slate-600">
            No encounter notes yet. Create your first visit note.
          </div>
        </div>
      </section>

      <!-- Detail -->
      <aside class="space-y-4">
        <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-900">Preview</h2>

          <div v-if="!selected" class="mt-3 text-[11px] text-slate-600">
            Select an encounter note to view details.
          </div>

          <div v-else class="mt-3 space-y-3 text-[11px] text-slate-700">
            <p class="text-xs font-semibold text-slate-900">{{ selected.chiefComplaint }}</p>
            <p>{{ selected.displayDate }} • {{ selected.time }} • {{ prettySession(selected.session) }}</p>

            <div class="rounded-2xl bg-slate-50 p-3 space-y-2">
              <p><span class="font-semibold">S:</span> {{ selected.subjective || "—" }}</p>
              <p><span class="font-semibold">O:</span> {{ selected.objective || "—" }}</p>
              <p><span class="font-semibold">A:</span> {{ selected.assessment || "—" }}</p>
              <p><span class="font-semibold">P:</span> {{ selected.plan || "—" }}</p>
            </div>

            <p v-if="selected.followUpDate">
              <span class="font-semibold">Follow-up:</span> {{ selected.followUpDate }}
            </p>

            <div class="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                class="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                :disabled="!selected"
                @click="copySummary"
              >
                📋 Copy summary
              </button>

              <button
                type="button"
                class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                :disabled="!selected"
                @click="printPdf"
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>
        </section>

        <section v-if="toast.visible" class="rounded-2xl px-3 py-2 text-[11px] shadow-sm ring-1"
          :class="toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' :
                  toast.type === 'error' ? 'bg-rose-50 text-rose-700 ring-rose-100' :
                  'bg-slate-50 text-slate-700 ring-slate-100'">
          {{ toast.message }}
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getSessionUser } from "../utils/session";
import { fetchUserEncounters } from "../utils/encounters";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const encounters = ref([]);
const selected = ref(null);

const q = ref("");
const status = ref("all");

const toast = reactive({ visible: false, type: "info", message: "", _t: null });
const showToast = (message, type = "info", ms = 2600) => {
  toast.type = type;
  toast.message = message;
  toast.visible = true;
  if (toast._t) clearTimeout(toast._t);
  toast._t = setTimeout(() => (toast.visible = false), ms);
};

const prettySession = (s) => {
  const v = String(s || "").toLowerCase();
  if (!v) return "Unknown";
  if (v === "morning") return "Morning";
  if (v === "afternoon") return "Afternoon";
  if (v === "evening") return "Evening";
  if (v === "night") return "Night";
  return String(s);
};

const badgeClass = (s) => {
  if (s === "approved") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (s === "submitted") return "bg-amber-50 text-amber-800 ring-amber-100";
  return "bg-slate-50 text-slate-700 ring-slate-100";
};

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase();
  return encounters.value.filter((e) => {
    const statusOk = status.value === "all" ? true : e.status === status.value;
    if (!statusOk) return false;
    if (!needle) return true;
    const blob = `${e.chiefComplaint} ${e.subjective} ${e.objective} ${e.assessment} ${e.plan}`.toLowerCase();
    return blob.includes(needle);
  });
});

const select = (e) => (selected.value = e);

const load = async () => {
  const user = getSessionUser();
  if (!user?.id) {
    router.push("/login");
    return;
  }

  loading.value = true;
  error.value = "";
  try {
    const list = await fetchUserEncounters(user.id);
    encounters.value = Array.isArray(list) ? list : [];
    selected.value = encounters.value[0] || null;
  } catch (e) {
    error.value = e?.message || "Failed to load encounters.";
  } finally {
    loading.value = false;
  }
};

const buildSummary = () => {
  const e = selected.value;
  if (!e) return "";
  return `TBG Medflow — Visit Note (SOAP)

- Date: ${e.date} (${e.time})
- Session: ${prettySession(e.session)}
- Status: ${e.status}

Chief complaint: ${e.chiefComplaint}

S: ${e.subjective || "—"}
O: ${e.objective || "—"}
A: ${e.assessment || "—"}
P: ${e.plan || "—"}

Follow-up: ${e.followUpDate || "—"}
`;
};

const copySummary = async () => {
  try {
    await navigator.clipboard.writeText(buildSummary());
    showToast("Copied to clipboard.", "success");
  } catch {
    showToast("Copy failed. Your browser may block clipboard.", "error");
  }
};

const printPdf = () => {
  const e = selected.value;
  if (!e) return;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Visit Note ${e.date}</title>
<style>
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px; }
  h1 { margin: 0 0 8px; font-size: 18px; }
  .meta { color: #334155; font-size: 12px; margin-bottom: 14px; }
  .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-top: 12px; }
  .row { margin: 8px 0; font-size: 12px; line-height: 1.4; }
  .label { color: #64748b; font-weight: 600; }
</style>
</head>
<body>
  <h1>Visit Note (SOAP)</h1>
  <div class="meta">${e.date} • ${e.time} • ${prettySession(e.session)} • ${e.status}</div>

  <div class="box">
    <div class="row"><span class="label">Chief complaint:</span> ${e.chiefComplaint || "—"}</div>
  </div>

  <div class="box">
    <div class="row"><span class="label">S:</span> ${e.subjective || "—"}</div>
    <div class="row"><span class="label">O:</span> ${e.objective || "—"}</div>
    <div class="row"><span class="label">A:</span> ${e.assessment || "—"}</div>
    <div class="row"><span class="label">P:</span> ${e.plan || "—"}</div>
    <div class="row"><span class="label">Follow-up:</span> ${e.followUpDate || "—"}</div>
  </div>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) {
    showToast("Popup blocked. Allow popups to print/save as PDF.", "error");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
};

onMounted(load);
</script>
