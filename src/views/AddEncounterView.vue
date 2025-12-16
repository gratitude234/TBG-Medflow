<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:pt-6 lg:pt-8">
    <!-- Header -->
    <section class="flex items-start justify-between gap-4">
      <div>
        <RouterLink
          to="/encounters"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Back to encounters
        </RouterLink>

        <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          New visit note (SOAP)
        </h1>
        <p class="mt-1 text-[11px] text-slate-600">
          Quick documentation for clinic visits, ward rounds, or supervisor review.
        </p>
      </div>

      <div class="hidden sm:block rounded-2xl bg-slate-900 px-4 py-3 text-[11px] text-slate-100">
        Tip: Keep it short. Clear &amp; consistent beats long essays.
      </div>
    </section>

    <!-- Form -->
    <section class="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <form
        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-6"
        @submit.prevent="submit"
      >
        <!-- Visit details -->
        <section class="space-y-3">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Visit details
          </h2>

          <div class="grid gap-3 sm:grid-cols-3">
            <div>
              <label class="text-xs font-medium text-slate-700">Date *</label>
              <input
                v-model="form.date"
                type="date"
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
              <p v-if="errors.date" class="mt-1 text-[11px] text-rose-600">{{ errors.date }}</p>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-700">Time</label>
              <input
                v-model="form.time"
                type="time"
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-700">Session</label>
              <select
                v-model="form.session"
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              >
                <option value="">Auto</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
              <p class="mt-1 text-[11px] text-slate-500">
                Auto uses time-of-day if you leave this blank.
              </p>
            </div>
          </div>
        </section>

        <!-- SOAP -->
        <section class="space-y-3">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">SOAP</h2>

          <div>
            <label class="text-xs font-medium text-slate-700">Chief complaint *</label>
            <input
              v-model="form.chiefComplaint"
              placeholder="e.g., Headache for 2 days, worse at night"
              class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
            <p v-if="errors.chiefComplaint" class="mt-1 text-[11px] text-rose-600">
              {{ errors.chiefComplaint }}
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="text-xs font-medium text-slate-700">Subjective</label>
              <textarea
                v-model="form.subjective"
                rows="4"
                placeholder="Patient reports..."
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-700">Objective</label>
              <textarea
                v-model="form.objective"
                rows="4"
                placeholder="Vitals/exam findings..."
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="text-xs font-medium text-slate-700">Assessment</label>
              <textarea
                v-model="form.assessment"
                rows="4"
                placeholder="Clinical impression..."
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-slate-700">Plan</label>
              <textarea
                v-model="form.plan"
                rows="4"
                placeholder="Medications, advice, follow-up..."
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        <!-- Follow-up + status -->
        <section class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="text-xs font-medium text-slate-700">Follow-up date</label>
            <input
              v-model="form.followUpDate"
              type="date"
              class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label class="text-xs font-medium text-slate-700">Status</label>
            <select
              v-model="form.status"
              class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
            <p class="mt-1 text-[11px] text-slate-500">
              MVP meaning: “Draft” = personal note. “Submitted” = ready for review.
            </p>
          </div>
        </section>

        <section class="flex flex-col gap-3 border-t border-slate-100 pt-4 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p class="max-w-md text-slate-500">
            Documentation tool only. Always follow clinical supervision and local protocols.
          </p>

          <div class="flex flex-wrap items-center gap-3 sm:justify-end">
            <button
              type="button"
              class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="setNow"
            >
              Use today &amp; now
            </button>

            <button
              type="submit"
              class="rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/20 hover:bg-sky-700 disabled:opacity-60"
              :disabled="saving"
            >
              {{ saving ? "Saving…" : "Save note" }}
            </button>
          </div>
        </section>
      </form>

      <!-- Preview -->
      <aside class="space-y-4">
        <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-sm font-semibold text-slate-900">Preview</h2>
            <span class="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-100">
              Updates as you type
            </span>
          </div>

          <div class="mt-4 space-y-3 text-[11px] text-slate-700">
            <p><span class="font-semibold text-slate-900">When:</span> {{ previewWhen }}</p>
            <p><span class="font-semibold text-slate-900">Chief complaint:</span> {{ form.chiefComplaint || "—" }}</p>
            <p><span class="font-semibold text-slate-900">Assessment:</span> {{ brief(form.assessment) }}</p>
            <p><span class="font-semibold text-slate-900">Plan:</span> {{ brief(form.plan) }}</p>
            <p v-if="form.followUpDate">
              <span class="font-semibold text-slate-900">Follow-up:</span> {{ form.followUpDate }}
            </p>
            <p>
              <span class="font-semibold text-slate-900">Status:</span>
              <span class="capitalize">{{ form.status }}</span>
            </p>
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
import { createEncounter } from "../utils/encounters";

const router = useRouter();

const saving = ref(false);
const toast = reactive({ visible: false, type: "info", message: "", _t: null });
const showToast = (message, type = "info", ms = 2600) => {
  toast.type = type;
  toast.message = message;
  toast.visible = true;
  if (toast._t) clearTimeout(toast._t);
  toast._t = setTimeout(() => (toast.visible = false), ms);
};

const form = reactive({
  date: "",
  time: "",
  session: "",

  chiefComplaint: "",
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",

  followUpDate: "",
  status: "draft",
});

const errors = reactive({ date: "", chiefComplaint: "" });

const autoSessionFromTime = (timeStr) => {
  if (!timeStr) return "";
  const [hh] = String(timeStr).split(":");
  const h = Number(hh || 0);
  if (h >= 5 && h <= 11) return "morning";
  if (h >= 12 && h <= 16) return "afternoon";
  if (h >= 17 && h <= 20) return "evening";
  return "night";
};

const setNow = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");

  form.date = `${yyyy}-${mm}-${dd}`;
  form.time = `${hh}:${mi}`;
  if (!form.session) form.session = autoSessionFromTime(form.time);
};

const validate = () => {
  errors.date = "";
  errors.chiefComplaint = "";

  if (!form.date) errors.date = "Date is required";
  if (!String(form.chiefComplaint || "").trim()) errors.chiefComplaint = "Chief complaint is required";

  return !errors.date && !errors.chiefComplaint;
};

const brief = (v) => {
  const t = String(v || "").trim();
  if (!t) return "—";
  return t.length > 90 ? `${t.slice(0, 90)}…` : t;
};

const previewWhen = computed(() => {
  const session = form.session || autoSessionFromTime(form.time);
  const niceSession = session ? session[0].toUpperCase() + session.slice(1) : "—";
  return `${form.date || "—"} • ${form.time || "—"} • ${niceSession}`;
});

const submit = async () => {
  if (!validate()) return;

  const user = getSessionUser();
  if (!user?.id) {
    router.push("/login");
    return;
  }

  saving.value = true;
  try {
    const payload = {
      userId: user.id,
      authorUserId: user.id,
      authorRole: user.role || "patient",

      date: form.date,
      time: form.time || null,
      session: form.session || autoSessionFromTime(form.time) || null,

      chiefComplaint: form.chiefComplaint,
      subjective: form.subjective,
      objective: form.objective,
      assessment: form.assessment,
      plan: form.plan,
      followUpDate: form.followUpDate || null,

      status: form.status,
    };

    await createEncounter(payload);
    showToast("Saved. Your visit note is now in Encounters.", "success");
    setTimeout(() => router.push("/encounters"), 500);
  } catch (e) {
    showToast(e?.message || "Failed to save encounter.", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(() => setNow());
</script>
