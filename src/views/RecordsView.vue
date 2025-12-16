<!-- src/views/RecordsView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:space-y-8 sm:pt-6 lg:pt-8">
    <!-- Toast -->
    <div
      v-if="toast.visible"
      class="rounded-2xl px-3 py-2 text-[11px] shadow-sm ring-1"
      :class="{
        'bg-sky-50 text-sky-800 ring-sky-100': toast.type === 'info',
        'bg-emerald-50 text-emerald-700 ring-emerald-100': toast.type === 'success',
        'bg-rose-50 text-rose-700 ring-rose-100': toast.type === 'error',
      }"
    >
      {{ toast.message }}
    </div>

    <!-- Page header -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <h1 class="text-2xl font-semibold text-slate-900 sm:text-2xl">Records</h1>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
            >
              📋 Vitals history
            </span>
          </div>
          <p class="text-sm text-slate-600">Browse and review your previous vitals in one place.</p>
        </div>
      </div>

      <!-- Right -->
      <div class="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
        <p class="text-[11px] text-slate-400">
          Total records:
          <span class="font-medium text-slate-600">{{ isLoading ? "…" : totalCount }}</span>
        </p>

        <RouterLink
          to="/add"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
        >
          <span class="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[11px]">＋</span>
          <span>Add vitals</span>
        </RouterLink>
      </div>
    </header>

    <!-- Filters & summary -->
    <section
      class="space-y-3 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:space-y-0"
    >
      <!-- Search -->
      <div class="w-full sm:flex-1">
        <p class="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">Search &amp; filter</p>
        <label class="sr-only" for="records-search">Search records</label>

        <div
          class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100"
        >
          <span class="text-slate-400">🔍</span>
          <input
            id="records-search"
            v-model="searchQuery"
            type="text"
            placeholder="Search by note, symptom, session or date…"
            class="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            :disabled="isLoading"
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
              class="appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 pr-7 py-1.5 text-[11px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
              :disabled="isLoading"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[9px] text-slate-400">▾</span>
          </div>

          <!-- Session -->
          <div class="relative">
            <select
              v-model="filterSession"
              class="appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 pr-7 py-1.5 text-[11px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
              :disabled="isLoading"
            >
              <option value="all">All sessions</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
            <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[9px] text-slate-400">▾</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <p class="text-[11px] text-slate-500">
            Showing
            <span class="font-medium text-slate-700">{{ isLoading ? "…" : filteredCount }}</span>
            of
            <span class="font-medium text-slate-700">{{ isLoading ? "…" : totalCount }}</span>
            records
          </p>

          <button
            v-if="filtersActive"
            type="button"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-60"
            @click="resetFilters"
            :disabled="isLoading"
          >
            ✕ Clear
          </button>
        </div>
      </div>
    </section>

    <!-- Main grid -->
    <section class="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)]">
      <!-- Left -->
      <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Records</h2>
            <p class="mt-1 text-xs text-slate-500">Tap a row to see full details on the right.</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700 disabled:opacity-60"
              @click="fetchRecords"
              :disabled="isLoading"
              title="Refresh"
            >
              🔄 <span>Refresh</span>
            </button>

            <div
              v-if="filtersActive"
              class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Filters active
            </div>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="loadError"
          class="mt-6 space-y-3 rounded-2xl bg-rose-50 px-4 py-6 text-center text-xs text-rose-700 ring-1 ring-rose-100"
        >
          <p class="font-semibold">Couldn’t load records.</p>
          <p class="text-[11px] opacity-90">{{ loadError }}</p>
          <div class="flex justify-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-rose-700 px-4 py-2 text-[11px] font-semibold text-white hover:bg-rose-800"
              @click="fetchRecords"
            >
              Retry
            </button>
            <RouterLink
              to="/add"
              class="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
            >
              Add vitals
            </RouterLink>
          </div>
        </div>

        <!-- Loading -->
        <div v-else-if="isLoading" class="mt-4 space-y-2">
          <div class="hidden md:block">
            <div
              class="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] border-b border-slate-100 pb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500"
            >
              <div>Date &amp; time</div>
              <div>Vitals</div>
              <div>Notes</div>
            </div>

            <div
              v-for="i in 6"
              :key="i"
              class="mt-2 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100 animate-pulse"
            >
              <div class="space-y-2">
                <div class="h-3 w-40 rounded bg-slate-200" />
                <div class="h-3 w-28 rounded bg-slate-200" />
              </div>
              <div class="space-y-2">
                <div class="h-3 w-44 rounded bg-slate-200" />
              </div>
              <div class="space-y-2">
                <div class="h-3 w-full rounded bg-slate-200" />
                <div class="h-3 w-3/4 rounded bg-slate-200" />
              </div>
            </div>
          </div>

          <div class="space-y-2 md:hidden">
            <div
              v-for="i in 6"
              :key="i"
              class="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 ring-1 ring-slate-100 animate-pulse"
            >
              <div class="flex items-center justify-between">
                <div class="h-3 w-40 rounded bg-slate-200" />
                <div class="h-3 w-6 rounded bg-slate-200" />
              </div>
              <div class="mt-2 h-3 w-32 rounded bg-slate-200" />
              <div class="mt-2 h-3 w-52 rounded bg-slate-200" />
              <div class="mt-2 h-3 w-full rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-else-if="!totalCount"
          class="mt-6 rounded-2xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500"
        >
          <p>No records yet.</p>
          <RouterLink
            to="/add"
            class="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <span>＋</span>
            <span>Add your first vitals</span>
          </RouterLink>
        </div>

        <!-- No matches -->
        <div
          v-else-if="!filteredCount"
          class="mt-6 space-y-3 rounded-2xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500"
        >
          <p class="font-medium text-slate-700">No records match your filters.</p>
          <p class="text-[11px] text-slate-500">Try adjusting your search, session filter or date range.</p>

          <div class="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-sky-500 hover:text-sky-600"
              @click="resetFilters"
            >
              Clear filters
            </button>
            <RouterLink
              to="/add"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              <span>＋</span>
              <span>Add vitals</span>
            </RouterLink>
          </div>
        </div>

        <!-- Records -->
        <div v-else class="mt-4">
          <!-- Desktop -->
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
                selectedId === record.id ? 'bg-sky-50 ring-1 ring-sky-100 shadow-sm' : 'hover:bg-slate-50',
              ]"
            >
              <div class="space-y-0.5">
                <p class="text-xs font-medium text-slate-800">
                  {{ record.displayDate }} · {{ record.time }}
                </p>
                <p class="flex flex-wrap items-center gap-2 text-[11px]">
                  <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {{ prettySession(record.session) }}
                  </span>
                  <span class="text-slate-400">{{ record.date }}</span>
                </p>
              </div>

              <div class="text-[11px] text-slate-700">
                <p class="truncate">
                  <span v-if="record.bpSystolic && record.bpDiastolic">BP {{ record.bpSystolic }}/{{ record.bpDiastolic }} mmHg</span>
                  <span v-if="record.heartRate"> · HR {{ record.heartRate }} bpm</span>
                  <span v-if="record.temperature != null"> · Temp {{ record.temperature }} °C</span>
                  <span v-if="record.bloodSugar"> · Sugar {{ record.bloodSugar }} mg/dL</span>
                  <span v-if="!hasAnyVitals(record)" class="text-slate-400">No vitals</span>
                </p>
              </div>

              <div class="space-y-1 text-[11px] text-slate-700">
                <p class="line-clamp-2">{{ previewText(record.symptoms || record.notes) }}</p>
                <div class="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  <span v-if="record.flags?.takenMedication">💊</span>
                  <span v-if="record.flags?.fasting">🌙</span>
                  <span v-if="record.flags?.shareWithClinician">📤</span>
                  <span v-if="!hasAnyFlags(record)">—</span>
                </div>
              </div>
            </button>
          </div>

          <!-- Mobile -->
          <div class="space-y-2 md:hidden">
            <button
              v-for="record in filteredRecords"
              :key="record.id"
              type="button"
              @click="selectedId = record.id"
              :class="[
                'w-full rounded-2xl border px-3 py-2 text-left text-[11px] transition',
                selectedId === record.id ? 'border-sky-200 bg-sky-50 shadow-sm' : 'border-slate-100 bg-white hover:bg-slate-50',
              ]"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-medium text-slate-800">{{ record.displayDate }} · {{ record.time }}</p>
                <span class="text-slate-300">›</span>
              </div>
              <p class="mt-0.5 text-[10px] text-slate-500">{{ prettySession(record.session) }} • {{ record.date }}</p>

              <p class="mt-1 text-[11px] text-slate-700">
                <span v-if="record.bpSystolic && record.bpDiastolic">BP {{ record.bpSystolic }}/{{ record.bpDiastolic }} mmHg</span>
                <span v-if="record.heartRate"> · HR {{ record.heartRate }} bpm</span>
                <span v-if="record.temperature != null"> · Temp {{ record.temperature }} °C</span>
                <span v-if="record.bloodSugar"> · Sugar {{ record.bloodSugar }} mg/dL</span>
                <span v-if="!hasAnyVitals(record)" class="text-slate-400">No vitals</span>
              </p>

              <p class="mt-1 line-clamp-2 text-[11px] text-slate-600">{{ previewText(record.symptoms || record.notes) }}</p>
            </button>
          </div>
        </div>
      </article>

      <!-- Right -->
      <aside class="space-y-4">
        <article class="min-h-[220px] rounded-2xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm ring-1 ring-sky-100 sm:p-5">
          <div v-if="isLoading" class="space-y-3 animate-pulse">
            <div class="h-3 w-28 rounded bg-slate-200" />
            <div class="h-5 w-56 rounded bg-slate-200" />
            <div class="h-3 w-48 rounded bg-slate-200" />
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="h-16 rounded-xl bg-white/80 ring-1 ring-slate-100" />
              <div class="h-16 rounded-xl bg-white/80 ring-1 ring-slate-100" />
              <div class="h-16 rounded-xl bg-white/80 ring-1 ring-slate-100" />
              <div class="h-16 rounded-xl bg-white/80 ring-1 ring-slate-100" />
            </div>
          </div>

          <div v-else-if="!selectedRecord" class="flex h-full items-center">
            <p class="text-xs text-slate-500">Select a record on the left to see full details here.</p>
          </div>

          <div v-else class="space-y-4 text-[11px] text-slate-700">
            <div>
              <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Record detail</p>
              <h2 class="mt-1 text-lg font-semibold text-slate-900">{{ selectedRecord.displayDate }} · {{ selectedRecord.time }}</h2>
              <p class="mt-1 text-[11px] text-slate-500">
                Session: {{ prettySession(selectedRecord.session) }} • {{ selectedRecord.date }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div v-if="selectedRecord.bpSystolic && selectedRecord.bpDiastolic" class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100">
                <p class="text-[10px] font-medium text-slate-500">Blood pressure</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.bpSystolic }}/{{ selectedRecord.bpDiastolic }}
                  <span class="text-[10px] font-normal text-slate-500">mmHg</span>
                </p>
              </div>

              <div v-if="selectedRecord.heartRate" class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100">
                <p class="text-[10px] font-medium text-slate-500">Heart rate</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.heartRate }}
                  <span class="text-[10px] font-normal text-slate-500">bpm</span>
                </p>
              </div>

              <div v-if="selectedRecord.temperature != null" class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100">
                <p class="text-[10px] font-medium text-slate-500">Temperature</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.temperature }}
                  <span class="text-[10px] font-normal text-slate-500">°C</span>
                </p>
              </div>

              <div v-if="selectedRecord.bloodSugar" class="rounded-xl bg-white/80 p-3 ring-1 ring-slate-100">
                <p class="text-[10px] font-medium text-slate-500">Blood sugar</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.bloodSugar }}
                  <span class="text-[10px] font-normal text-slate-500">mg/dL</span>
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Symptoms</p>
                <p class="mt-1 text-[11px] text-slate-700">{{ selectedRecord.symptoms ? selectedRecord.symptoms : "No symptoms recorded." }}</p>
              </div>
              <div>
                <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Notes</p>
                <p class="mt-1 text-[11px] text-slate-700">{{ selectedRecord.notes ? selectedRecord.notes : "No additional notes for this record." }}</p>
              </div>
            </div>

            <div class="space-y-1">
              <p class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Flags</p>
              <div class="flex flex-wrap gap-2">
                <span v-if="!hasAnyFlags(selectedRecord)" class="text-[11px] text-slate-400">No extra flags for this record.</span>

                <span v-if="selectedRecord.flags?.takenMedication" class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50">
                  💊 Medication taken
                </span>
                <span v-if="selectedRecord.flags?.fasting" class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50">
                  🌙 Fasting
                </span>
                <span v-if="selectedRecord.flags?.shareWithClinician" class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-50">
                  📤 Marked to share with clinician
                </span>
              </div>
            </div>

            <p class="pt-1 text-[10px] text-slate-400">For record-keeping only · Not medical advice.</p>
          </div>
        </article>

        <article class="rounded-2xl bg-slate-900 p-4 text-xs text-slate-100 shadow-sm sm:p-5">
          <h2 class="text-sm font-semibold">Actions</h2>
          <p class="mt-1 text-[11px] text-slate-300">Export or work with your records.</p>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-medium hover:bg-slate-700 disabled:opacity-60"
              :disabled="!selectedRecord || isLoading"
              @click="downloadSelectedAsPdf"
            >
              🖨️ Print / Save PDF
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-medium hover:bg-slate-700 disabled:opacity-60"
              :disabled="!selectedRecord || isLoading"
              @click="copySelectedSummary"
            >
              📋 Copy summary
            </button>

            <RouterLink to="/add" class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-600">
              ＋ Add vitals
            </RouterLink>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";

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

const records = ref([]);
const isLoading = ref(false);
const loadError = ref("");

const searchQuery = ref("");
const filterSession = ref("all");
const filterRange = ref("7d");
const selectedId = ref(null);

const totalCount = computed(() => records.value.length);

const filtersActive = computed(() => {
  return !!searchQuery.value.trim() || filterSession.value !== "all" || filterRange.value !== "7d";
});

const sessionKey = (v) => String(v || "").trim().toLowerCase();

const prettySession = (session) => {
  const s = sessionKey(session);
  if (!s) return "Unknown";
  if (s === "morning") return "Morning";
  if (s === "afternoon") return "Afternoon";
  if (s === "evening") return "Evening";
  if (s === "night") return "Night";
  // fallback: keep whatever came from backend
  return String(session);
};

const previewText = (value) => {
  if (!value) return "No notes or symptoms.";
  const trimmed = String(value).trim();
  return trimmed.length <= 80 ? trimmed : trimmed.slice(0, 77) + "…";
};

const hasAnyFlags = (record) => {
  const f = record?.flags;
  return !!(f?.takenMedication || f?.fasting || f?.shareWithClinician);
};

const hasAnyVitals = (record) => {
  return !!(
    (record?.bpSystolic && record?.bpDiastolic) ||
    record?.heartRate ||
    record?.temperature != null ||
    record?.bloodSugar
  );
};

const resetFilters = () => {
  searchQuery.value = "";
  filterSession.value = "all";
  filterRange.value = "7d";
};

const parseTimeToMinutes = (timeStr) => {
  const t = String(timeStr || "").trim();
  if (!t) return 0;

  // "HH:MM"
  const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const hh = Math.max(0, Math.min(23, Number(m24[1])));
    const mm = Math.max(0, Math.min(59, Number(m24[2])));
    return hh * 60 + mm;
  }

  // "H:MM AM/PM" or "HH:MM AM/PM"
  const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let hh = Number(m12[1]);
    const mm = Number(m12[2]);
    const ap = m12[3].toUpperCase();
    if (hh === 12) hh = 0;
    if (ap === "PM") hh += 12;
    return hh * 60 + mm;
  }

  return 0;
};

const toSortKey = (r) => {
  // date is usually YYYY-MM-DD; safe numeric key for sorting
  const d = String(r?.date || "");
  const y = Number(d.slice(0, 4)) || 0;
  const m = Number(d.slice(5, 7)) || 0;
  const day = Number(d.slice(8, 10)) || 0;
  const minutes = parseTimeToMinutes(r?.time);
  return y * 100000000 + m * 1000000 + day * 10000 + minutes;
};

const fetchRecords = async () => {
  loadError.value = "";
  isLoading.value = true;

  try {
    const user = getLoggedInUser();
    if (!user?.id) {
      loadError.value = "You’re not logged in. Please log in again.";
      showToast(loadError.value, "error");
      router.push("/login");
      return;
    }

    const list = await fetchUserRecords(user.id);
    records.value = Array.isArray(list) ? list : [];

    if (!records.value.length) selectedId.value = null;
    else if (!selectedId.value) selectedId.value = records.value[0].id;
    else if (!records.value.some((r) => r.id === selectedId.value)) selectedId.value = records.value[0].id;
  } catch (err) {
    const msg = err?.message || "Something went wrong while loading records. Check your API and try again.";
    loadError.value = msg;
    showToast(msg, "error", 4200);
  } finally {
    isLoading.value = false;
  }
};

const filteredRecords = computed(() => {
  let list = [...records.value];

  // newest first (date + time)
  list.sort((a, b) => toSortKey(b) - toSortKey(a));

  // date range filter (based on date only)
  if (filterRange.value !== "all") {
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    list = list.filter((record) => {
      const d = String(record.date || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;

      const y = Number(d.slice(0, 4));
      const m = Number(d.slice(5, 7)) - 1;
      const day = Number(d.slice(8, 10));
      const recLocal = new Date(y, m, day);
      const diffDays = (todayLocal - recLocal) / (1000 * 60 * 60 * 24);

      if (filterRange.value === "7d") return diffDays <= 7;
      if (filterRange.value === "30d") return diffDays <= 30;
      return true;
    });
  }

  // session filter (case-safe)
  if (filterSession.value !== "all") {
    const want = sessionKey(filterSession.value);
    list = list.filter((r) => sessionKey(r.session) === want);
  }

  // search filter
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((record) => {
      const haystack = [
        record.displayDate,
        record.date,
        record.time,
        record.session,
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
  if (!selectedId.value) return null;
  return records.value.find((r) => r.id === selectedId.value) || null;
});

watch(
  () => filteredRecords.value,
  (list) => {
    if (!list.length) return (selectedId.value = null);
    if (!list.some((r) => r.id === selectedId.value)) selectedId.value = list[0].id;
  },
  { immediate: true }
);

// ---- actions ----
const copySelectedSummary = async () => {
  if (!selectedRecord.value) return;

  const r = selectedRecord.value;
  const summary = [
    `Vitals Summary (TBG Medflow)`,
    `Date: ${r.date} (${r.displayDate})`,
    `Time: ${r.time}`,
    `Session: ${prettySession(r.session)}`,
    ``,
    `Vitals:`,
    r.bpSystolic && r.bpDiastolic ? `- BP: ${r.bpSystolic}/${r.bpDiastolic} mmHg` : null,
    r.heartRate ? `- HR: ${r.heartRate} bpm` : null,
    r.temperature != null ? `- Temp: ${r.temperature} °C` : null,
    r.bloodSugar ? `- Blood Sugar: ${r.bloodSugar} mg/dL` : null,
    ``,
    `Symptoms: ${r.symptoms || "—"}`,
    `Notes: ${r.notes || "—"}`,
    ``,
    `Flags: ${
      hasAnyFlags(r)
        ? [
            r.flags?.takenMedication ? "Medication taken" : null,
            r.flags?.fasting ? "Fasting" : null,
            r.flags?.shareWithClinician ? "Share with clinician" : null,
          ]
            .filter(Boolean)
            .join(", ")
        : "None"
    }`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await navigator.clipboard.writeText(summary);
    showToast("Summary copied to clipboard.", "success");
  } catch {
    showToast("Couldn’t copy. Your browser may block clipboard access.", "error");
  }
};

const downloadSelectedAsPdf = () => {
  if (!selectedRecord.value) return;

  const r = selectedRecord.value;
  const flags = hasAnyFlags(r)
    ? [
        r.flags?.takenMedication ? "Medication taken" : null,
        r.flags?.fasting ? "Fasting" : null,
        r.flags?.shareWithClinician ? "Share with clinician" : null,
      ]
        .filter(Boolean)
        .join(", ")
    : "None";

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Vitals Record - ${r.date}</title>
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px; }
        h1 { margin: 0 0 8px; font-size: 18px; }
        .meta { color: #334155; font-size: 12px; margin-bottom: 14px; }
        .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-top: 12px; }
        .row { display: flex; justify-content: space-between; gap: 12px; margin: 6px 0; font-size: 12px; }
        .label { color: #64748b; }
      </style>
    </head>
    <body>
      <h1>Vitals Record</h1>
      <div class="meta">${r.date} • ${r.time} • ${prettySession(r.session)}</div>

      <div class="box">
        <div class="row"><span class="label">BP</span><span>${r.bpSystolic && r.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic} mmHg` : "—"}</span></div>
        <div class="row"><span class="label">Heart rate</span><span>${r.heartRate ? `${r.heartRate} bpm` : "—"}</span></div>
        <div class="row"><span class="label">Temperature</span><span>${r.temperature != null ? `${r.temperature} °C` : "—"}</span></div>
        <div class="row"><span class="label">Blood sugar</span><span>${r.bloodSugar ? `${r.bloodSugar} mg/dL` : "—"}</span></div>
      </div>

      <div class="box">
        <div class="row"><span class="label">Symptoms</span><span>${r.symptoms || "—"}</span></div>
        <div class="row"><span class="label">Notes</span><span>${r.notes || "—"}</span></div>
        <div class="row"><span class="label">Flags</span><span>${flags}</span></div>
      </div>
    </body>
  </html>
  `;

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

onMounted(fetchRecords);
</script>
