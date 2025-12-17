<!-- src/views/DashboardView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:space-y-8 sm:pt-6 lg:pt-8">
    <!-- Page header -->
    <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">Dashboard</h1>

          <!-- Role badge -->
          <span
            class="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1"
            :class="roleBadgeClass"
            title="Your role is set at signup and used across the app"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {{ roleText }}
          </span>

          <!-- Small status pill -->
          <span
            class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Today
          </span>
        </div>

        <p class="text-sm text-slate-600">
          {{ dashboardSubtitle }}
        </p>

        <!-- MVP clarity (prevents role confusion) -->
        <div
          v-if="showMvpCallout"
          class="mt-2 inline-flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-[11px] text-amber-900 ring-1 ring-amber-100"
        >
          <span aria-hidden="true">ℹ️</span>
          <p class="leading-snug">
            MVP note: records are tied to your account for now. Patient assignment/review workflows come next.
          </p>
        </div>
      </div>

      <div class="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
        <p class="text-[11px] text-slate-400">{{ lastRecordLabel }}</p>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Primary CTA (role-based) -->
          <RouterLink
            :to="primaryCta.to"
            class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
            :class="primaryCta.className"
          >
            <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-full text-[11px]" :class="primaryCta.pill">
              {{ primaryCta.pillText }}
            </span>
            {{ primaryCta.label }}
          </RouterLink>

          <!-- Secondary CTA -->
          <RouterLink
            :to="secondaryCta.to"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700"
          >
            <span aria-hidden="true">{{ secondaryCta.icon }}</span>
            {{ secondaryCta.label }}
          </RouterLink>

          <!-- Optional third CTA (only if meaningful) -->
          <RouterLink
            v-if="tertiaryCta"
            :to="tertiaryCta.to"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700"
          >
            <span aria-hidden="true">{{ tertiaryCta.icon }}</span>
            {{ tertiaryCta.label }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Top stats -->
    <section class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ vitalsHeader }}</h2>
        <p class="text-[11px] text-slate-400">{{ vitalsHelper }}</p>
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
            <p
              class="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-700"
            >
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
              <h2 class="text-sm font-semibold text-slate-900">{{ recentHeader }}</h2>
              <p class="mt-1 text-xs text-slate-500">{{ recentHelper }}</p>
            </div>

            <RouterLink
              to="/records"
              class="text-[11px] font-medium text-sky-600 underline-offset-4 hover:text-sky-700 hover:underline"
            >
              View all
            </RouterLink>
          </div>

          <div
            v-if="isLoading && !hasRecords"
            class="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500"
          >
            Loading your records…
          </div>

          <div v-else-if="!hasRecords" class="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
            <p>{{ emptyStateTitle }}</p>

            <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
              <RouterLink
                :to="primaryCta.to"
                class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                {{ emptyStateCta }}
              </RouterLink>

              <RouterLink
                v-if="secondaryEmptyCta"
                :to="secondaryEmptyCta.to"
                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                {{ secondaryEmptyCta.label }}
              </RouterLink>
            </div>
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
          <p class="mt-1 text-xs text-slate-500">Shortcuts based on your role.</p>

          <div class="mt-4 space-y-2">
            <RouterLink
              v-for="action in quickActions"
              :key="action.key"
              :to="action.to"
              class="inline-flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-xs shadow-sm transition"
              :class="action.className"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">{{ action.icon }}</span> {{ action.label }}
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

import { fetchUserRecords } from "../utils/records";
import { getSessionUser } from "../utils/session";

const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");
const records = ref([]);
const sessionUser = ref(null);

// ---- Role helpers ----
function normalizeRole(input) {
  const v = String(input || "").toLowerCase().trim();
  if (v === "student") return "student";
  if (v === "clinician") return "clinician";
  if (v === "other") return "other";
  return "patient";
}

const role = computed(() => normalizeRole(sessionUser.value?.role));

const roleText = computed(() => {
  if (role.value === "student") return "Student nurse";
  if (role.value === "clinician") return "Clinician / mentor";
  if (role.value === "other") return "Other";
  return "Patient / family";
});

const roleBadgeClass = computed(() => {
  if (role.value === "clinician") return "bg-indigo-50 text-indigo-800 ring-indigo-100";
  if (role.value === "student") return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  if (role.value === "other") return "bg-amber-50 text-amber-900 ring-amber-100";
  return "bg-sky-50 text-sky-800 ring-sky-100";
});

const showMvpCallout = computed(() => role.value === "student" || role.value === "clinician" || role.value === "other");

const dashboardSubtitle = computed(() => {
  if (role.value === "student") return "Document vitals and simple visit notes quickly during placement.";
  if (role.value === "clinician") return "Review visit notes and stay on top of changes at a glance.";
  if (role.value === "other") return "Stay organised with a clear summary of records in this workspace.";
  return "Track your vitals and review your recent health records at a glance.";
});

// ---- CTA mapping ----
const primaryCta = computed(() => {
  // default: patient/other
  const base = {
    to: "/add",
    label: "Add vitals",
    className:
      "bg-sky-600 text-white shadow-sky-500/25 hover:bg-sky-700 focus-visible:ring-sky-500",
    pill: "bg-sky-500",
    pillText: "＋",
  };

  if (role.value === "student") {
    return {
      to: "/encounters/new",
      label: "New visit note",
      className:
        "bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700 focus-visible:ring-emerald-500",
      pill: "bg-emerald-500",
      pillText: "📝",
    };
  }

  if (role.value === "clinician") {
    return {
      to: "/encounters",
      label: "Review visit notes",
      className:
        "bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700 focus-visible:ring-indigo-500",
      pill: "bg-indigo-500",
      pillText: "🗂️",
    };
  }

  return base;
});

const secondaryCta = computed(() => {
  if (role.value === "student") return { to: "/add", label: "Add vitals", icon: "🩺" };
  if (role.value === "clinician") return { to: "/share", label: "Share summary", icon: "📤" };
  return { to: "/share", label: "Share summary", icon: "📤" };
});

const tertiaryCta = computed(() => {
  // only show a third action when it adds clarity
  if (role.value === "patient") return { to: "/encounters/new", label: "New visit note", icon: "📝" };
  if (role.value === "student") return { to: "/records", label: "View records", icon: "📋" };
  if (role.value === "clinician") return { to: "/records", label: "View records", icon: "📋" };
  return null;
});

// ---- Text tailoring ----
const vitalsHeader = computed(() => (role.value === "clinician" ? "Latest vitals snapshot" : "Today's vitals"));
const vitalsHelper = computed(() =>
  role.value === "clinician" ? "Pulled from the latest saved record in this workspace" : "Pulled from your latest saved record"
);

const recentHeader = computed(() => (role.value === "clinician" ? "Recent workspace records" : "Recent records"));
const recentHelper = computed(() =>
  role.value === "clinician" ? "Latest entries saved to this workspace." : "Your last few logged vitals."
);

const emptyStateTitle = computed(() => {
  if (role.value === "clinician") return "No records yet in this workspace.";
  if (role.value === "student") return "No records yet. Start a visit note or log vitals.";
  if (role.value === "other") return "No records yet. Create your first entry to get started.";
  return "You haven't logged any vitals yet.";
});

const emptyStateCta = computed(() => primaryCta.value.label);

const secondaryEmptyCta = computed(() => {
  if (role.value === "clinician") return { to: "/encounters/new", label: "Create a visit note" };
  if (role.value === "student") return { to: "/add", label: "Log vitals" };
  return null;
});

// ---- Quick actions (role-based, clinic-friendly) ----
const quickActions = computed(() => {
  const base = [];

  if (role.value === "student") {
    base.push(
      {
        key: "enc-new",
        to: "/encounters/new",
        icon: "📝",
        label: "New visit note (SOAP)",
        className: "bg-emerald-600 text-white hover:bg-emerald-700",
      },
      {
        key: "add",
        to: "/add",
        icon: "🩺",
        label: "Add vitals",
        className: "border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700",
      },
      {
        key: "enc",
        to: "/encounters",
        icon: "🗂️",
        label: "View encounter notes",
        className: "border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700",
      },
      {
        key: "records",
        to: "/records",
        icon: "📋",
        label: "View all records",
        className: "border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700",
      }
    );
    return base;
  }

  if (role.value === "clinician") {
    base.push(
      {
        key: "enc",
        to: "/encounters",
        icon: "🗂️",
        label: "Review visit notes",
        className: "bg-indigo-600 text-white hover:bg-indigo-700",
      },
      {
        key: "share",
        to: "/share",
        icon: "📤",
        label: "Share a summary",
        className: "border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700",
      },
      {
        key: "records",
        to: "/records",
        icon: "📋",
        label: "View all records",
        className: "border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700",
      }
    );
    return base;
  }

  // patient / other (safe defaults)
  base.push(
    {
      key: "add",
      to: "/add",
      icon: "🩺",
      label: "Add vitals",
      className: "bg-sky-600 text-white hover:bg-sky-700",
    },
    {
      key: "enc-new",
      to: "/encounters/new",
      icon: "📝",
      label: "New visit note (SOAP)",
      className: "border border-slate-200 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-600",
    },
    {
      key: "records",
      to: "/records",
      icon: "📋",
      label: "View all records",
      className: "border border-slate-200 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-600",
    },
    {
      key: "share",
      to: "/share",
      icon: "📤",
      label: "Share a summary",
      className: "border border-slate-200 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-600",
    }
  );

  return base;
});

// ---- Fetch ----
const fetchDashboard = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const user = getSessionUser();
    sessionUser.value = user;

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
