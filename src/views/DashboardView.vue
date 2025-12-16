<!-- src/views/DashboardView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:space-y-8 sm:pt-6 lg:pt-8">
    <!-- Page header -->
    <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">Dashboard</h1>
          <span
            class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Today&apos;s overview
          </span>
        </div>
        <p class="text-sm text-slate-600">
          Track your vitals and review your recent health records at a glance.
        </p>
      </div>

      <div class="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
        <p class="text-[11px] text-slate-400">{{ lastRecordLabel }}</p>

        <div class="flex flex-wrap items-center gap-2">
          <RouterLink
            to="/add"
            class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
          >
            <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[11px]">＋</span>
            Add vitals
          </RouterLink>

          <RouterLink
            to="/share"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700"
          >
            <span aria-hidden="true">📤</span>
            Share summary
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Top stats -->
    <section class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Today&apos;s vitals</h2>
        <p class="text-[11px] text-slate-400">Pulled from your latest saved record</p>
      </div>

      <div v-if="isLoading" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="i in 4" :key="i" class="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
          <div class="animate-pulse space-y-2">
            <div class="h-4 w-24 rounded bg-slate-100"></div>
            <div class="h-6 w-16 rounded bg-slate-100"></div>
            <div class="h-3 w-28 rounded bg-slate-100"></div>
          </div>
        </article>
      </div>

      <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in todayVitals"
          :key="item.key"
          class="group rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-sky-100"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-50 text-base">
                <span aria-hidden="true">{{ item.icon }}</span>
              </div>
              <p class="text-[11px] font-medium text-slate-500">{{ item.label }}</p>
            </div>
            <span class="mt-0.5 h-2.5 w-2.5 rounded-full" :class="item.accent" />
          </div>

          <p class="mt-3 text-lg font-semibold text-slate-900">{{ item.value }}</p>

          <div class="mt-2 flex items-center justify-between gap-2">
            <p class="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-700">
              {{ item.status }}
            </p>
            <p class="text-[10px] text-slate-400">{{ item.helper }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- Error -->
    <section v-if="errorMessage" class="rounded-2xl bg-rose-50 px-4 py-3">
      <p class="text-[11px] text-rose-700">{{ errorMessage }}</p>
    </section>

    <!-- Recent records + sidebar -->
    <section class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div class="space-y-6">
        <!-- Recent records -->
        <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Recent records</h2>
              <p class="mt-1 text-xs text-slate-500">Your last few logged vitals.</p>
            </div>

            <RouterLink
              to="/records"
              class="text-[11px] font-medium text-sky-600 underline-offset-4 hover:text-sky-700 hover:underline"
            >
              View all
            </RouterLink>
          </div>

          <div v-if="isLoading && !hasRecords" class="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
            Loading your records…
          </div>

          <div v-else-if="!hasRecords" class="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
            <p>You haven&apos;t logged any vitals yet.</p>
            <RouterLink
              to="/add"
              class="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Add your first vitals
            </RouterLink>
          </div>

          <div v-else class="mt-4">
            <div class="hidden overflow-x-auto sm:block">
              <table class="min-w-full border-separate border-spacing-y-1 text-xs text-slate-700">
                <thead>
                  <tr class="text-[11px] text-slate-500">
                    <th class="px-3 py-2 text-left font-medium">Date</th>
                    <th class="px-3 py-2 text-left font-medium">Time</th>
                    <th class="px-3 py-2 text-left font-medium">BP</th>
                    <th class="px-3 py-2 text-left font-medium">HR</th>
                    <th class="px-3 py-2 text-left font-medium">Temp</th>
                    <th class="px-3 py-2 text-left font-medium">Sugar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="record in recentRecords"
                    :key="record.id"
                    class="rounded-xl bg-slate-50/80 align-middle transition hover:bg-sky-50/70"
                  >
                    <td class="px-3 py-2 text-[11px] font-medium text-slate-700">{{ record.date }}</td>
                    <td class="px-3 py-2 text-[11px] text-slate-500">{{ record.time }}</td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">{{ record.bp }}</td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">{{ record.hr }}</td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">{{ record.temp }}</td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">{{ record.sugar }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="space-y-3 sm:hidden">
              <article
                v-for="record in recentRecords"
                :key="record.id"
                class="rounded-xl bg-slate-50/90 p-3 ring-1 ring-slate-100"
              >
                <div class="flex items-center justify-between gap-2">
                  <p class="text-[11px] font-medium text-slate-700">{{ record.date }}</p>
                  <p class="text-[11px] text-slate-500">{{ record.time }}</p>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700">
                  <p><span class="text-slate-500">BP:</span> {{ record.bp }}</p>
                  <p><span class="text-slate-500">HR:</span> {{ record.hr }}</p>
                  <p><span class="text-slate-500">Temp:</span> {{ record.temp }}</p>
                  <p><span class="text-slate-500">Sugar:</span> {{ record.sugar }}</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
          <h2 class="text-sm font-semibold text-slate-900">Quick actions</h2>
          <p class="mt-1 text-xs text-slate-500">Jump straight into the tasks you do most often.</p>

          <div class="mt-4 space-y-2">
            <RouterLink
              to="/add"
              class="inline-flex w-full items-center justify-between rounded-2xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">🩺</span> Add vitals
              </span>
              <span aria-hidden="true">↗</span>
            </RouterLink>

            <RouterLink
              to="/records"
              class="inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">📋</span> View all records
              </span>
              <span aria-hidden="true">↗</span>
            </RouterLink>

            <RouterLink
              to="/share"
              class="inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">📤</span> Share a summary
              </span>
              <span aria-hidden="true">↗</span>
            </RouterLink>

            <button
              type="button"
              class="inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600 disabled:opacity-60"
              :disabled="isLoading"
              @click="fetchDashboard"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">🔄</span> Refresh dashboard
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

// Uses your existing utilities (so we don't break existing API usage)
import { fetchUserRecords, getLoggedInUser } from "../utils/records";

const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");
const records = ref([]);

// ---- Fetch ----
const fetchDashboard = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const user = getLoggedInUser();
    if (!user?.id) {
      router.push("/login");
      return;
    }

    const list = await fetchUserRecords(user.id);
    records.value = Array.isArray(list) ? list : [];
  } catch (e) {
    errorMessage.value = e?.message || "Failed to load dashboard records.";
  } finally {
    isLoading.value = false;
  }
};

// ---- Derived ----
const latest = computed(() => (records.value.length ? records.value[0] : null));
const hasRecords = computed(() => records.value.length > 0);

const lastRecordLabel = computed(() => {
  const r = latest.value;
  if (!r) return "No records yet";
  const date = r.displayDate || r.date || "—";
  const time = r.time || "—";
  return `Last record: ${date} • ${time}`;
});

const todayVitals = computed(() => {
  const r = latest.value;

  const bpVal = r?.bpSystolic && r?.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic}` : "—";
  const hrVal = r?.heartRate ? `${r.heartRate}` : "—";
  const tempVal = r?.temperature != null && r?.temperature !== "" ? `${r.temperature}` : "—";
  const sugarVal = r?.bloodSugar ? `${r.bloodSugar}` : "—";

  return [
    {
      key: "bp",
      icon: "🩺",
      label: "Blood pressure",
      value: bpVal,
      status: bpVal === "—" ? "Missing" : "Logged",
      helper: "mmHg",
      accent: bpVal === "—" ? "bg-slate-200" : "bg-sky-500",
    },
    {
      key: "hr",
      icon: "❤️",
      label: "Heart rate",
      value: hrVal,
      status: hrVal === "—" ? "Missing" : "Logged",
      helper: "bpm",
      accent: hrVal === "—" ? "bg-slate-200" : "bg-rose-500",
    },
    {
      key: "temp",
      icon: "🌡️",
      label: "Temperature",
      value: tempVal,
      status: tempVal === "—" ? "Missing" : "Logged",
      helper: "°C",
      accent: tempVal === "—" ? "bg-slate-200" : "bg-amber-500",
    },
    {
      key: "sugar",
      icon: "🧪",
      label: "Blood sugar",
      value: sugarVal,
      status: sugarVal === "—" ? "Missing" : "Logged",
      helper: "mg/dL",
      accent: sugarVal === "—" ? "bg-slate-200" : "bg-indigo-500",
    },
  ];
});

const recentRecords = computed(() => {
  return records.value.slice(0, 6).map((r) => ({
    id: r.id,
    date: r.displayDate || r.date || "—",
    time: r.time || "—",
    bp: r.bpSystolic && r.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic}` : "—",
    hr: r.heartRate ? `${r.heartRate}` : "—",
    temp: r.temperature != null && r.temperature !== "" ? `${r.temperature}` : "—",
    sugar: r.bloodSugar ? `${r.bloodSugar}` : "—",
  }));
});

onMounted(fetchDashboard);
</script>
