<!-- src/views/RecordsView.vue -->
<template>
  <main
    class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:space-y-8 sm:pt-6 lg:pt-8"
  >
    <!-- Page header -->
    <header
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <!-- Left -->
      <div>
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <span class="text-sm">←</span>
          <span>Back to dashboard</span>
        </RouterLink>

        <div class="mt-3 space-y-1">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-semibold text-slate-900 sm:text-2xl">
              Health records
            </h1>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
            >
              📋 Log history
            </span>
          </div>
          <p class="text-sm text-slate-600">
            Browse and review your previous vitals in one place.
          </p>
        </div>
      </div>

      <!-- Right -->
      <div
        class="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right"
      >
        <p class="text-[11px] text-slate-400">
          Total records (demo):
          <span class="font-medium text-slate-600">{{ totalCount }}</span>
        </p>
        <RouterLink
          to="/add-record"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
        >
          <span
            class="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[11px]"
          >
            ＋
          </span>
          <span>Add record</span>
        </RouterLink>
      </div>
    </header>

    <!-- Filters & summary -->
    <section
      class="space-y-3 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:space-y-0"
    >
      <!-- Search -->
      <div class="w-full sm:flex-1">
        <p class="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Search &amp; filter
        </p>
        <label class="sr-only" for="records-search">
          Search records
        </label>
        <div
          class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100"
        >
          <span class="text-slate-400">🔍</span>
          <input
            id="records-search"
            v-model="searchQuery"
            type="text"
            placeholder="Search by note, symptom or date…"
            class="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <!-- Filters -->
      <div class="w-full space-y-2 text-[11px] sm:w-auto sm:text-xs">
        <div class="flex flex-wrap items-center gap-2 sm:justify-end">
          <!-- Range -->
          <div class="relative">
            <select
              v-model="filterRange"
              class="appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 pr-7 py-1.5 text-[11px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            <span
              class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[9px] text-slate-400"
            >
              ▾
            </span>
          </div>

          <!-- Session -->
          <div class="relative">
            <select
              v-model="filterSession"
              class="appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 pr-7 py-1.5 text-[11px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">All sessions</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
            <span
              class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[9px] text-slate-400"
            >
              ▾
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <p class="text-[11px] text-slate-500">
            Showing
            <span class="font-medium text-slate-700">{{ filteredCount }}</span>
            of
            <span class="font-medium text-slate-700">{{ totalCount }}</span>
            records
          </p>
          <button
            v-if="searchQuery || filterSession !== 'all' || filterRange !== '7d'"
            type="button"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-200"
            @click="resetFilters"
          >
            ✕ Clear
          </button>
        </div>
      </div>
    </section>

    <!-- Main grid: list + detail -->
    <section
      class="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)]"
    >
      <!-- Left: table/list -->
      <article
        class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">
              Records
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              Tap a row to see full details on the right.
            </p>
          </div>
          <div
            v-if="searchQuery || filterSession !== 'all' || filterRange !== '7d'"
            class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Filters active
          </div>
        </div>

        <!-- Empty state: no records at all -->
        <div
          v-if="!totalCount"
          class="mt-6 rounded-2xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500"
        >
          <p>No records yet.</p>
          <RouterLink
            to="/add-record"
            class="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <span>＋</span>
            <span>Add your first record</span>
          </RouterLink>
        </div>

        <!-- Empty state: no matches for filters -->
        <div
          v-else-if="!filteredCount"
          class="mt-6 space-y-3 rounded-2xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500"
        >
          <p class="font-medium text-slate-700">
            No records match your filters.
          </p>
          <p class="text-[11px] text-slate-500">
            Try adjusting your search, session filter or date range.
          </p>
          <div class="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-sky-500 hover:text-sky-600"
              @click="resetFilters"
            >
              Clear filters
            </button>
            <RouterLink
              to="/add-record"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              <span>＋</span>
              <span>Add record</span>
            </RouterLink>
          </div>
        </div>

        <!-- Records table/list -->
        <div v-else class="mt-4">
          <!-- Desktop table -->
          <div class="hidden md:block">
            <div
              class="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] border-b border-slate-100 pb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500"
            >
              <div>Date &amp; time</div>
              <div>Vitals</div>
              <div>Notes</div>
            </div>

            <button
              v-for="record in filteredRecords"
              :key="record.id"
              type="button"
              @click="selectedId = record.id"
              :class="[
                'mt-1 grid w-full grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] items-start gap-3 rounded-2xl px-3 py-2 text-left text-xs transition',
                selectedId === record.id
                  ? 'bg-sky-50 ring-1 ring-sky-100 shadow-sm'
                  : 'hover:bg-slate-50'
              ]"
            >
              <!-- Date & time -->
              <div class="space-y-0.5">
                <p class="text-xs font-medium text-slate-800">
                  {{ record.displayDate }} · {{ record.time }}
                </p>
                <p class="flex flex-wrap items-center gap-2 text-[11px]">
                  <span
                    class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                  >
                    {{ prettySession(record.session) }}
                  </span>
                  <span class="text-slate-400">
                    {{ record.date }}
                  </span>
                </p>
              </div>

              <!-- Vitals -->
              <div class="text-[11px] text-slate-700">
                <p class="truncate">
                  <span v-if="record.bpSystolic && record.bpDiastolic">
                    BP {{ record.bpSystolic }}/{{ record.bpDiastolic }}
                    mmHg
                  </span>
                  <span v-if="record.heartRate">
                    · HR {{ record.heartRate }}
                    bpm
                  </span>
                  <span v-if="record.temperature">
                    · Temp {{ record.temperature }} °C
                  </span>
                  <span v-if="record.bloodSugar">
                    · Sugar {{ record.bloodSugar }} mg/dL
                  </span>
                </p>
              </div>

              <!-- Notes preview -->
              <div class="space-y-1 text-[11px] text-slate-700">
                <p class="line-clamp-2">
                  {{ previewText(record.symptoms || record.notes) }}
                </p>
                <div class="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  <span v-if="record.flags.takenMedication">💊</span>
                  <span v-if="record.flags.fasting">🌙</span>
                  <span v-if="record.flags.shareWithClinician">📤</span>
                  <span
                    v-if="!record.flags.takenMedication && !record.flags.fasting && !record.flags.shareWithClinician"
                  >
                    —
                  </span>
                </div>
              </div>
            </button>
          </div>

          <!-- Mobile list -->
          <div class="space-y-2 md:hidden">
            <button
              v-for="record in filteredRecords"
              :key="record.id"
              type="button"
              @click="selectedId = record.id"
              :class="[

                'w-full rounded-2xl border px-3 py-2 text-left text-[11px] transition',
                selectedId === record.id
                  ? 'border-sky-200 bg-sky-50 shadow-sm'
                  : 'border-slate-100 bg-white hover:bg-slate-50'
              ]"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-medium text-slate-800">
                  {{ record.displayDate }} · {{ record.time }}
                </p>
                <span class="text-slate-300">›</span>
              </div>
              <p class="mt-0.5 text-[10px] text-slate-500">
                {{ prettySession(record.session) }} • {{ record.date }}
              </p>
              <p class="mt-1 text-[11px] text-slate-700">
                <span v-if="record.bpSystolic && record.bpDiastolic">
                  BP {{ record.bpSystolic }}/{{ record.bpDiastolic }} mmHg
                </span>
                <span v-if="record.heartRate">
                  · HR {{ record.heartRate }} bpm
                </span>
                <span v-if="record.temperature">
                  · Temp {{ record.temperature }} °C
                </span>
                <span v-if="record.bloodSugar">
                  · Sugar {{ record.bloodSugar }} mg/dL
                </span>
              </p>
              <p class="mt-1 line-clamp-2 text-[11px] text-slate-600">
                {{ previewText(record.symptoms || record.notes) }}
              </p>
            </button>
          </div>
        </div>
      </article>

      <!-- Right: detail sidebar -->
      <aside class="space-y-4">
        <!-- Detail card -->
        <article
          class="min-h-[220px] rounded-2xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm ring-1 ring-sky-100 sm:p-5"
        >
          <div v-if="!selectedRecord" class="flex h-full items-center">
            <p class="text-xs text-slate-500">
              Select a record on the left to see full details here.
            </p>
          </div>

          <div v-else class="space-y-4 text-[11px] text-slate-700">
            <!-- Header -->
            <div>
              <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Record detail
              </p>
              <h2 class="mt-1 text-lg font-semibold text-slate-900">
                {{ selectedRecord.displayDate }} ·
                {{ selectedRecord.time }}
              </h2>
              <p class="mt-1 text-[11px] text-slate-500">
                Session:
                {{ prettySession(selectedRecord.session) }} •
                {{ selectedRecord.date }}
              </p>
            </div>

            <!-- Vitals grid -->
            <div class="grid gap-3 sm:grid-cols-2">
              <div
                v-if="selectedRecord.bpSystolic && selectedRecord.bpDiastolic"
                class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100"
              >
                <p class="text-[10px] font-medium text-slate-500">
                  Blood pressure
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.bpSystolic }}/{{ selectedRecord.bpDiastolic }}
                  <span class="text-[10px] font-normal text-slate-500">
                    mmHg
                  </span>
                </p>
              </div>

              <div
                v-if="selectedRecord.heartRate"
                class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100"
              >
                <p class="text-[10px] font-medium text-slate-500">
                  Heart rate
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.heartRate }}
                  <span class="text-[10px] font-normal text-slate-500">
                    bpm
                  </span>
                </p>
              </div>

              <div
                v-if="selectedRecord.temperature"
                class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100"
              >
                <p class="text-[10px] font-medium text-slate-500">
                  Temperature
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.temperature }}
                  <span class="text-[10px] font-normal text-slate-500">
                    °C
                  </span>
                </p>
              </div>

              <div
                v-if="selectedRecord.bloodSugar"
                class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100"
              >
                <p class="text-[10px] font-medium text-slate-500">
                  Blood sugar
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.bloodSugar }}
                  <span class="text-[10px] font-normal text-slate-500">
                    mg/dL
                  </span>
                </p>
              </div>
            </div>

            <!-- Symptoms & notes -->
            <div class="space-y-2">
              <div>
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Symptoms
                </p>
                <p class="mt-1 text-[11px] text-slate-700">
                  {{
                    selectedRecord.symptoms
                      ? selectedRecord.symptoms
                      : "No symptoms recorded."
                  }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Notes
                </p>
                <p class="mt-1 text-[11px] text-slate-700">
                  {{
                    selectedRecord.notes
                      ? selectedRecord.notes
                      : "No additional notes for this record."
                  }}
                </p>
              </div>
            </div>

            <!-- Flags -->
            <div class="space-y-1">
              <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Flags
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="!hasAnyFlags(selectedRecord)"
                  class="text-[11px] text-slate-400"
                >
                  No extra flags for this record.
                </span>

                <span
                  v-if="selectedRecord.flags.takenMedication"
                  class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50"
                >
                  💊 Medication taken
                </span>
                <span
                  v-if="selectedRecord.flags.fasting"
                  class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50"
                >
                  🌙 Fasting
                </span>
                <span
                  v-if="selectedRecord.flags.shareWithClinician"
                  class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50"
                >
                  📤 Marked to share with clinician
                </span>
              </div>
            </div>

            <p class="pt-1 text-[10px] text-slate-400">
              Demo data only · Not medical advice.
            </p>
          </div>
        </article>

        <!-- Actions card -->
        <article
          class="rounded-2xl bg-slate-900 p-4 text-xs text-slate-100 shadow-sm sm:p-5"
        >
          <h2 class="text-sm font-semibold">
            Actions
          </h2>
          <p class="mt-1 text-[11px] text-slate-300">
            Export or work with your records (demo actions).
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-medium hover:bg-slate-700"
            >
              📄 Download as PDF
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-medium hover:bg-slate-700"
            >
              📋 Copy summary
            </button>
            <RouterLink
              to="/add-record"
              class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-600"
            >
              ＋ Add record
            </RouterLink>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

const records = ref([
  {
    id: 1,
    date: "2025-12-05",
    displayDate: "Today",
    time: "09:24 AM",
    session: "morning",
    bpSystolic: 118,
    bpDiastolic: 76,
    heartRate: 78,
    temperature: 36.8,
    bloodSugar: 95,
    symptoms: "Mild headache earlier, feels better now.",
    notes: "Took usual morning medication before reading.",
    flags: {
      takenMedication: true,
      fasting: false,
      shareWithClinician: true,
    },
  },
  {
    id: 2,
    date: "2025-12-04",
    displayDate: "Yesterday",
    time: "08:51 PM",
    session: "evening",
    bpSystolic: 124,
    bpDiastolic: 80,
    heartRate: 82,
    temperature: 37.0,
    bloodSugar: 103,
    symptoms: "No major symptoms.",
    notes: "",
    flags: {
      takenMedication: false,
      fasting: false,
      shareWithClinician: false,
    },
  },
  {
    id: 3,
    date: "2025-12-03",
    displayDate: "2 days ago",
    time: "07:10 AM",
    session: "morning",
    bpSystolic: 122,
    bpDiastolic: 79,
    heartRate: 76,
    temperature: 36.7,
    bloodSugar: 92,
    symptoms: "Slept poorly, a bit tired.",
    notes: "Did not eat breakfast before measurement.",
    flags: {
      takenMedication: false,
      fasting: true,
      shareWithClinician: false,
    },
  },
  {
    id: 4,
    date: "2025-11-30",
    displayDate: "5 days ago",
    time: "01:32 PM",
    session: "afternoon",
    bpSystolic: 130,
    bpDiastolic: 84,
    heartRate: 88,
    temperature: 37.3,
    bloodSugar: 110,
    symptoms: "Light dizziness after walking.",
    notes: "Took medication 30 mins before.",
    flags: {
      takenMedication: true,
      fasting: false,
      shareWithClinician: true,
    },
  },
  {
    id: 5,
    date: "2025-11-25",
    displayDate: "10 days ago",
    time: "10:05 PM",
    session: "night",
    bpSystolic: 116,
    bpDiastolic: 74,
    heartRate: 72,
    temperature: 36.6,
    bloodSugar: 90,
    symptoms: "",
    notes: "Felt calm, normal day.",
    flags: {
      takenMedication: false,
      fasting: false,
      shareWithClinician: false,
    },
  },
]);

const searchQuery = ref("");
const filterSession = ref("all"); // all | morning | afternoon | evening | night
const filterRange = ref("7d"); // 7d | 30d | all

const selectedId = ref(records.value.length ? records.value[0].id : null);

const totalCount = computed(() => records.value.length);

const filteredRecords = computed(() => {
  let list = [...records.value];

  // Sort by date descending (newest first)
  list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  // Date range filter (simple demo logic using real dates)
  const now = new Date();
  list = list.filter((record) => {
    if (filterRange.value === "all") return true;

    const recDate = new Date(record.date);
    const diffMs = now - recDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (filterRange.value === "7d") {
      return diffDays <= 7;
    }
    if (filterRange.value === "30d") {
      return diffDays <= 30;
    }
    return true;
  });

  // Session filter
  if (filterSession.value !== "all") {
    list = list.filter(
      (record) => record.session === filterSession.value
    );
  }

  // Search filter (date, displayDate, time, symptoms, notes)
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((record) => {
      const haystack = [
        record.displayDate,
        record.date,
        record.time,
        record.symptoms,
        record.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  return list;
});

const filteredCount = computed(() => filteredRecords.value.length);

const selectedRecord = computed(() => {
  if (!filteredRecords.value.length) return null;
  const match = filteredRecords.value.find(
    (r) => r.id === selectedId.value
  );
  return match || filteredRecords.value[0] || null;
});

const prettySession = (session) => {
  if (!session) return "Unknown";
  const map = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };
  return map[session] || session;
};

const previewText = (value) => {
  if (!value) return "No notes or symptoms.";
  const trimmed = value.trim();
  if (trimmed.length <= 80) return trimmed;
  return trimmed.slice(0, 77) + "…";
};

const hasAnyFlags = (record) => {
  if (!record || !record.flags) return false;
  return (
    record.flags.takenMedication ||
    record.flags.fasting ||
    record.flags.shareWithClinician
  );
};

const resetFilters = () => {
  searchQuery.value = "";
  filterSession.value = "all";
  filterRange.value = "7d";
};
</script>
