<!-- src/views/AddRecordView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:pt-6 lg:pt-8">
    <section class="space-y-6 sm:space-y-8">
      <!-- Page header -->
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Left -->
        <div>
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span class="text-sm">←</span>
            <span>Back to dashboard</span>
          </RouterLink>

          <div class="mt-3 space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">Add Vitals</h1>
              <span
                class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                New entry
              </span>
            </div>

            <p class="text-sm text-slate-600">
              Log vitals in calm steps. You can leave fields blank if you didn’t measure them.
              <span class="font-medium">At least one vital is required</span>.
            </p>
          </div>
        </div>

        <!-- Right -->
        <div class="flex flex-col items-stretch gap-2 sm:w-64 sm:items-end">
          <div
            class="rounded-2xl bg-white/90 px-3 py-2 text-[11px] text-slate-500 shadow-sm ring-1 ring-slate-100"
          >
            <p class="font-medium text-slate-700">
              Last record
              <span class="text-[10px] font-normal text-slate-400">(from backend)</span>
            </p>
            <p>{{ lastRecordLabel }}</p>
          </div>

          <RouterLink
            to="/records"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600"
          >
            <span>📋</span>
            <span>View all records</span>
          </RouterLink>
        </div>
      </header>

      <!-- Main layout -->
      <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <!-- Left: form -->
        <section
          class="rounded-3xl bg-white/95 p-4 shadow-md ring-1 ring-slate-100 backdrop-blur-sm sm:p-5 lg:p-6"
        >
          <!-- Toast -->
          <div
            v-if="toast.visible"
            class="mb-4 rounded-xl px-3 py-2 text-[11px]"
            :class="{
              'border border-sky-100 bg-sky-50 text-sky-800': toast.type === 'info',
              'border border-emerald-100 bg-emerald-50 text-emerald-700': toast.type === 'success',
              'border border-rose-100 bg-rose-50 text-rose-700': toast.type === 'error',
            }"
          >
            {{ toast.message }}
          </div>

          <!-- Stepper -->
          <div
            class="mb-5 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600 ring-1 ring-slate-100"
          >
            <div class="inline-flex items-center gap-1.5">
              <span
                class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-semibold text-white"
              >
                1
              </span>
              <span class="font-medium text-slate-800">Visit details</span>
            </div>
            <span class="h-px w-6 bg-slate-200" />
            <div class="inline-flex items-center gap-1.5">
              <span
                class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700"
              >
                2
              </span>
              <span>Vitals</span>
            </div>
            <span class="h-px w-6 bg-slate-200" />
            <div class="inline-flex items-center gap-1.5">
              <span
                class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700"
              >
                3
              </span>
              <span>Symptoms &amp; context</span>
            </div>
          </div>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Visit details -->
            <section class="space-y-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Visit details
                  </h2>
                  <p class="mt-1 text-xs text-slate-500">When was this reading taken?</p>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 shadow-sm hover:bg-slate-800"
                  @click="setNow"
                >
                  <span>Use today &amp; now</span>
                </button>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <!-- Date -->
                <div>
                  <label class="flex items-center gap-1 text-xs font-medium text-slate-700">
                    <span>Date</span>
                    <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="form.date"
                    type="date"
                    class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-sky-100 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2"
                  />
                  <p v-if="errors.date" class="mt-1 text-[11px] text-rose-600">{{ errors.date }}</p>
                </div>

                <!-- Time -->
                <div>
                  <label class="text-xs font-medium text-slate-700">Time</label>
                  <input
                    v-model="form.time"
                    type="time"
                    class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-sky-100 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2"
                  />
                </div>
              </div>

              <!-- Session -->
              <div class="mt-2">
                <label class="text-xs font-medium text-slate-700">Session</label>
                <select
                  v-model="form.session"
                  class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-sky-100 focus:border-sky-400 focus:bg-white focus:ring-2"
                >
                  <option value="">Select session (optional)</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
                <p class="mt-1 text-[11px] text-slate-500">
                  This makes it easier to spot patterns across the day.
                </p>
              </div>
            </section>

            <!-- Vitals -->
            <section class="space-y-4">
              <div>
                <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Vitals</h2>
                <p class="mt-1 text-xs text-slate-500">
                  Enter what you measured. Leave blank if not measured.
                </p>
              </div>

              <p v-if="errors.vitals" class="text-[11px] text-rose-600">{{ errors.vitals }}</p>

              <!-- Blood pressure -->
              <div class="rounded-2xl bg-slate-50/80 p-3.5 ring-1 ring-slate-100">
                <p class="text-[11px] font-medium text-slate-600">
                  Blood pressure <span class="text-[10px] text-slate-400">(mmHg)</span>
                </p>
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label class="text-[11px] text-slate-500">Systolic</label>
                    <input
                      v-model="form.bpSystolic"
                      type="number"
                      inputmode="decimal"
                      placeholder="118"
                      class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div>
                    <label class="text-[11px] text-slate-500">Diastolic</label>
                    <input
                      v-model="form.bpDiastolic"
                      type="number"
                      inputmode="decimal"
                      placeholder="76"
                      class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
              </div>

              <!-- HR + Temp + Sugar -->
              <div class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- Heart rate -->
                  <div>
                    <label class="text-xs font-medium text-slate-700">
                      Heart rate <span class="text-[11px] font-normal text-slate-400">(bpm)</span>
                    </label>
                    <input
                      v-model="form.heartRate"
                      type="number"
                      inputmode="decimal"
                      placeholder="78"
                      class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                    />
                  </div>

                  <!-- Temperature -->
                  <div>
                    <label class="text-xs font-medium text-slate-700">
                      Temperature <span class="text-[11px] font-normal text-slate-400">(°C)</span>
                    </label>
                    <input
                      v-model="form.temperature"
                      type="number"
                      inputmode="decimal"
                      placeholder="36.8"
                      step="0.1"
                      class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <!-- Blood sugar -->
                <div>
                  <label class="text-xs font-medium text-slate-700">
                    Blood sugar <span class="text-[11px] font-normal text-slate-400">(mg/dL)</span>
                  </label>
                  <input
                    v-model="form.bloodSugar"
                    type="number"
                    inputmode="decimal"
                    placeholder="95"
                    class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </section>

            <!-- Symptoms & notes -->
            <section class="space-y-4">
              <div>
                <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Symptoms &amp; notes
                </h2>
                <p class="mt-1 text-xs text-slate-500">Capture how you felt at the time.</p>
              </div>

              <div>
                <label class="text-xs font-medium text-slate-700">How are you feeling?</label>
                <textarea
                  v-model="form.symptoms"
                  rows="3"
                  placeholder="E.g. mild headache, felt dizzy standing up, no symptoms…"
                  class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-sky-100 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2"
                ></textarea>
              </div>

              <div>
                <label class="text-xs font-medium text-slate-700">
                  Extra notes <span class="text-[11px] font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Anything else you want to remember about this reading."
                  class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-sky-100 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2"
                ></textarea>
              </div>
            </section>

            <!-- Flags -->
            <section class="space-y-3">
              <div>
                <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Extra context</h2>
                <p class="mt-1 text-xs text-slate-500">Quick flags that can explain your numbers.</p>
              </div>

              <div class="space-y-2">
                <label class="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    v-model="form.takenMedication"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Taken medication before this reading</span>
                </label>

                <label class="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    v-model="form.fasting"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Fasting at time of check</span>
                </label>

                <label class="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    v-model="form.shareWithClinician"
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Share this record with my clinician</span>
                </label>
              </div>
            </section>

            <!-- Actions & disclaimer -->
            <section
              class="flex flex-col gap-3 border-t border-slate-100 pt-4 text-[11px] sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="max-w-md text-slate-500">
                This is not a diagnosis. Always talk to a qualified healthcare professional about your results.
              </p>

              <div class="flex flex-wrap items-center gap-3 sm:justify-end">
                <RouterLink
                  to="/dashboard"
                  class="text-xs font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
                >
                  Cancel
                </RouterLink>

                <button
                  type="submit"
                  :disabled="saving"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/30 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span v-if="!saving">Save vitals</span>
                  <span v-else>Saving…</span>
                </button>
              </div>
            </section>
          </form>
        </section>

        <!-- Right: Preview + tips -->
        <section class="space-y-4 lg:space-y-5">
          <!-- Preview / summary -->
          <article
            class="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm ring-1 ring-sky-100 sm:p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-sm font-semibold text-slate-900">Preview</h2>
                <p class="mt-1 text-[11px] text-slate-500">How this record will look in your dashboard.</p>
              </div>
              <span
                class="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700"
              >
                Updates as you type
              </span>
            </div>

            <div class="mt-4 space-y-4 text-[11px] text-slate-700">
              <div class="space-y-1">
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">When</p>
                <p>{{ previewDateLabel }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Vitals</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-if="hasBp"
                    class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                    <span>
                      BP:
                      <span v-if="form.bpSystolic">{{ form.bpSystolic }}</span>
                      <span v-if="form.bpSystolic || form.bpDiastolic">/</span>
                      <span v-if="form.bpDiastolic">{{ form.bpDiastolic }}</span>
                      mmHg
                    </span>
                  </span>

                  <span
                    v-if="form.heartRate"
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>HR: {{ form.heartRate }} bpm</span>
                  </span>

                  <span
                    v-if="form.temperature"
                    class="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-teal-700"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                    <span>Temp: {{ form.temperature }} °C</span>
                  </span>

                  <span
                    v-if="form.bloodSugar"
                    class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                    <span>Sugar: {{ form.bloodSugar }} mg/dL</span>
                  </span>

                  <span v-if="!hasAnyVitals" class="text-[11px] text-slate-400">
                    No vitals added yet.
                  </span>
                </div>
              </div>

              <div class="space-y-1">
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Feeling</p>
                <p class="text-[11px] text-slate-700">{{ previewFeeling }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Flags</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-if="!form.takenMedication && !form.fasting && !form.shareWithClinician"
                    class="text-[11px] text-slate-400"
                  >
                    No extra flags selected.
                  </span>

                  <span
                    v-if="form.takenMedication"
                    class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50"
                  >
                    💊 Medication taken
                  </span>
                  <span
                    v-if="form.fasting"
                    class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50"
                  >
                    🌙 Fasting
                  </span>
                  <span
                    v-if="form.shareWithClinician"
                    class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50"
                  >
                    👩‍⚕️ To share with clinician
                  </span>
                </div>
              </div>
            </div>
          </article>

          <!-- Quick tips -->
          <article class="rounded-2xl bg-slate-900 p-4 text-xs text-slate-100 shadow-sm sm:p-5">
            <h2 class="flex items-center gap-2 text-sm font-semibold">
              <span>💡</span>
              <span>Quick tips for better readings</span>
            </h2>
            <ul class="mt-3 space-y-2 leading-snug">
              <li>• Log at roughly the same time each day.</li>
              <li>• Rest quietly for 5 minutes before measuring BP or heart rate.</li>
              <li>• Avoid caffeine, smoking, or heavy exercise right before checking vitals.</li>
              <li>• Bring a summary of readings to your next appointment.</li>
            </ul>
            <div class="mt-3 text-[11px] text-slate-400">
              Need more guidance?
              <RouterLink
                to="/support"
                class="font-medium text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline"
              >
                Visit Support
              </RouterLink>
            </div>
          </article>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

import { apiPost } from "../utils/apiClient";
import { fetchUserRecords, getLoggedInUser } from "../utils/records";

const router = useRouter();

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
  bpSystolic: "",
  bpDiastolic: "",
  heartRate: "",
  temperature: "",
  bloodSugar: "",
  symptoms: "",
  notes: "",
  takenMedication: false,
  fasting: false,
  shareWithClinician: false,
});

const errors = reactive({ date: "", vitals: "" });
const saving = ref(false);
const lastRecordLabel = ref("Loading…");

const setNow = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");

  form.date = `${yyyy}-${mm}-${dd}`;
  form.time = `${hh}:${mi}`;
};

const numOrNull = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const validate = () => {
  errors.date = "";
  errors.vitals = "";

  if (!form.date) errors.date = "Date is required.";

  const hasVitals =
    String(form.bpSystolic).trim() ||
    String(form.bpDiastolic).trim() ||
    String(form.heartRate).trim() ||
    String(form.temperature).trim() ||
    String(form.bloodSugar).trim();

  if (!hasVitals) errors.vitals = "Add at least one vital.";

  return !errors.date && !errors.vitals;
};

const loadLastRecord = async () => {
  try {
    const user = getLoggedInUser();
    if (!user?.id) {
      lastRecordLabel.value = "Not logged in";
      return;
    }
    const list = await fetchUserRecords(user.id);
    const r = list[0];
    lastRecordLabel.value = r ? `${r.displayDate} • ${r.time}` : "No records yet";
  } catch {
    lastRecordLabel.value = "Couldn’t load last record";
  }
};

const handleSubmit = async () => {
  if (!validate()) {
    showToast("Please fix the highlighted fields.", "error");
    return;
  }

  const user = getLoggedInUser();
  if (!user?.id) {
    showToast("You’re not logged in. Please log in again.", "error");
    router.push("/login");
    return;
  }

  saving.value = true;
  showToast("Saving vitals…", "info");

  try {
    await apiPost("add_record.php", {
      userId: user.id,
      date: form.date,
      time: form.time || null,
      session: form.session || null,

      bpSystolic: numOrNull(form.bpSystolic),
      bpDiastolic: numOrNull(form.bpDiastolic),
      heartRate: numOrNull(form.heartRate),
      temperature: numOrNull(form.temperature),
      bloodSugar: numOrNull(form.bloodSugar),

      symptoms: (form.symptoms || "").trim(),
      notes: (form.notes || "").trim(),

      takenMedication: !!form.takenMedication,
      fasting: !!form.fasting,
      shareWithClinician: !!form.shareWithClinician,
    });

    showToast("Vitals saved successfully.", "success", 1600);
    router.push("/records");
  } catch (e) {
    showToast(e?.message || "Failed to save vitals.", "error");
  } finally {
    saving.value = false;
  }
};

// Preview helpers
const hasBp = computed(() => !!(String(form.bpSystolic).trim() || String(form.bpDiastolic).trim()));
const hasAnyVitals = computed(
  () =>
    hasBp.value ||
    !!String(form.heartRate).trim() ||
    !!String(form.temperature).trim() ||
    !!String(form.bloodSugar).trim()
);

const previewFeeling = computed(() => {
  const v = (form.symptoms || "").trim();
  return v ? v : "No symptoms added.";
});

const previewDateLabel = computed(() => {
  const parts = [];
  if (form.date) parts.push(form.date);
  if (form.time) parts.push(form.time);
  if (form.session) parts.push(form.session);
  return parts.length ? parts.join(" • ") : "Not set yet";
});

onMounted(() => {
  setNow();
  loadLastRecord();
});
</script>
