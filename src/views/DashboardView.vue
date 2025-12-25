<!-- src/views/DashboardView.vue -->
<template>
  <main class="page">
    <!-- Top header -->
    <section class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="h1">Dashboard</h1>
        <p class="mt-1 text-[11px] text-slate-600">
          {{ headerSubtitle }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <RouterLink
          v-if="role === 'patient'"
          to="/share"
          class="btn-outline"
        >
          Share
        </RouterLink>

        <RouterLink
          v-else
          to="/share"
          class="btn-dark"
        >
          Add a patient
        </RouterLink>

        <button
          type="button"
          class="btn-outline"
          :disabled="loading"
          @click="refresh"
        >
          Refresh
        </button>
      </div>
    </section>

    <!-- Not logged in -->
    <section
      v-if="!user"
      class="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-[11px] text-amber-900"
    >
      You’re not logged in. Please log in to continue.
      <div class="mt-3">
        <RouterLink
          to="/login"
          class="btn-dark"
        >
          Log in
        </RouterLink>
      </div>
    </section>

    <!-- Patient dashboard -->
    <template v-else-if="role === 'patient'">
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="panel">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900">Latest vitals</h2>
            <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
              Vitals
            </span>
          </div>

          <p class="mt-2 text-[11px] text-slate-600">{{ lastRecordLabel }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
              to="/add"
              class="btn-primary"
            >
              Add vitals
            </RouterLink>
            <RouterLink
              to="/records"
              class="btn-outline"
            >
              View records
            </RouterLink>
          </div>
        </div>

        <div class="panel">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900">Latest encounter</h2>
            <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
              SOAP
            </span>
          </div>
          <p class="mt-2 text-[11px] text-slate-600">{{ lastEncounterLabel }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
              to="/encounters"
              class="btn-dark"
            >
              View notes
            </RouterLink>
            <RouterLink
              to="/encounters/new"
              class="btn-outline"
            >
              Add note
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2 class="text-sm font-semibold text-slate-900">Today’s next step</h2>
        <p class="mt-1 text-[11px] text-slate-600">
          If you’re monitoring with a clinician/mentor, generate a share code under <span class="font-semibold">Share &amp; Monitoring</span>.
        </p>
        <div class="mt-4">
          <RouterLink
            to="/share"
            class="btn-dark"
          >
            Open Share &amp; Monitoring
          </RouterLink>
        </div>
      </section>
    </template>

    <!-- Clinician / student / other -->
    <template v-else>
      <!-- Active patient banner -->
      <section class="panel">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Active patient</h2>
            <p class="mt-1 text-[11px] text-slate-600">
              {{ activePatientLabel }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <RouterLink
              :to="activePatient ? { path: '/records', query: patientQuery(activePatient.id) } : '/share'"
              class="btn-primary"
            >
              Open vitals
            </RouterLink>
            <RouterLink
              :to="activePatient ? { path: '/encounters/new', query: patientQuery(activePatient.id) } : '/share'"
              class="btn-dark"
            >
              New note
            </RouterLink>
            <RouterLink
              :to="activePatient ? { path: '/encounters', query: patientQuery(activePatient.id) } : '/share'"
              class="btn-outline"
            >
              View notes
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Monitoring list -->
      <section class="panel">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Monitoring patients</h2>
            <p class="mt-1 text-[11px] text-slate-600">
              Select a patient to view vitals and write notes. (Patients must share a code first.)
            </p>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="search"
              type="text"
              placeholder="Search name/email"
              class="input max-w-xs"
            />
          </div>
        </div>

        <div v-if="monitoringLoading" class="mt-4 text-[11px] text-slate-500">Loading…</div>

        <div v-else class="mt-4">
          <div v-if="filteredPatients.length === 0" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-[11px] text-slate-700">
              No patients yet.
              <span class="font-medium">Ask your patient to generate a share code</span> and accept it in <span class="font-medium">Share &amp; Monitoring</span>.
            </p>
            <div class="mt-3">
              <RouterLink
                to="/share"
                class="btn-dark"
              >
                Open Share &amp; Monitoring
              </RouterLink>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="p in filteredPatients"
              :key="p.id"
              type="button"
              class="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-200 hover:bg-slate-50"
              @click="selectPatient(p)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ p.fullName || ('Patient #' + p.id) }}</p>
                  <p class="mt-1 text-[11px] text-slate-600">{{ p.email || '—' }}</p>
                </div>
                <span
                  class="rounded-full px-2 py-1 text-[10px] font-semibold"
                  :class="activePatient?.id === p.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'"
                >
                  {{ activePatient?.id === p.id ? 'Active' : 'Select' }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getSessionUser } from "../utils/session";
import { fetchUserRecords } from "../utils/records";
import { fetchUserNotes } from "../utils/encounters";
import { normalizeRole, patientQuery, getActivePatient, setActivePatient } from "../utils/patientContext";
import { listMonitoringPatients } from "../utils/monitoring";

const router = useRouter();

const user = ref(getSessionUser());
const syncUser = () => (user.value = getSessionUser());

const role = computed(() => normalizeRole(user.value?.role));

const loading = ref(false);
const monitoringLoading = ref(false);

const lastRecordLabel = ref("No vitals yet.");
const lastEncounterLabel = ref("No encounters yet.");

const monitoringPatients = ref([]);
const search = ref("");

const activePatient = ref(null);

const headerSubtitle = computed(() => {
  if (!user.value?.id) return "";
  if (role.value === "patient") return "Track vitals, share with your care team, and keep your history organized.";
  if (role.value === "student") return "Monitor assigned patients and document visit notes (SOAP).";
  if (role.value === "clinician") return "Review patient vitals and mentor students through documented notes.";
  return "Monitor patients and review records as permitted.";
});

const activePatientLabel = computed(() => {
  if (!activePatient.value?.id) return "No active patient selected.";
  const n = activePatient.value.fullName || `Patient #${activePatient.value.id}`;
  return `${n} • ${activePatient.value.email || "—"}`;
});

const filteredPatients = computed(() => {
  const q = String(search.value || "").trim().toLowerCase();
  if (!q) return monitoringPatients.value;
  return monitoringPatients.value.filter((p) => {
    return (
      String(p.fullName || "").toLowerCase().includes(q) ||
      String(p.email || "").toLowerCase().includes(q) ||
      String(p.id || "").includes(q)
    );
  });
});

const refreshPatientSummary = async () => {
  if (!user.value?.id) return;
  loading.value = true;
  try {
    // Patient-only: show their latest vitals/encounter
    if (role.value === "patient") {
      const list = await fetchUserRecords(user.value.id, { limit: 1 });
      const r = Array.isArray(list) ? list[0] : null;
      if (!r) {
        lastRecordLabel.value = "No vitals yet. Add your first vitals to start tracking.";
      } else {
        lastRecordLabel.value = `Last vitals: ${r.date || "—"} • BP ${r.bpSystolic ?? "—"}/${r.bpDiastolic ?? "—"} • HR ${r.heartRate ?? "—"}`;
      }

      const encounters = await fetchUserNotes(user.value.id);
      const e = Array.isArray(encounters) ? encounters[0] : null;
      lastEncounterLabel.value = e
        ? `Last note: ${e.date || "—"} • ${e.chiefComplaint || "—"}`
        : "No encounters yet. Create a visit note when needed.";
    }
  } catch {
    // silent on dashboard
  } finally {
    loading.value = false;
  }
};

const refreshMonitoring = async () => {
  if (!user.value?.id) return;
  monitoringLoading.value = true;
  try {
    const list = await listMonitoringPatients(user.value.id);
    monitoringPatients.value = Array.isArray(list) ? list : [];
  } catch {
    monitoringPatients.value = [];
  } finally {
    monitoringLoading.value = false;
  }
};

const hydrateActivePatient = () => {
  if (!user.value?.id) return;
  activePatient.value = getActivePatient(user.value.id);
};

const selectPatient = (p) => {
  if (!user.value?.id || !p?.id) return;
  activePatient.value = { ...p };
  setActivePatient(user.value.id, p);
  // optional: route to records with query
  router.push({ path: "/records", query: patientQuery(p.id) });
};

const refresh = async () => {
  syncUser();
  hydrateActivePatient();
  if (!user.value?.id) return;

  await refreshPatientSummary();
  if (role.value !== "patient") {
    await refreshMonitoring();
  }
};

onMounted(() => {
  syncUser();
  window.addEventListener("medflow:session", syncUser);

  // If not logged in, the router guard should handle it; still, keep it safe
  if (!user.value?.id) {
    router.push("/login");
    return;
  }

  hydrateActivePatient();
  refreshPatientSummary();
  if (role.value !== "patient") refreshMonitoring();
});

onUnmounted(() => {
  window.removeEventListener("medflow:session", syncUser);
});
</script>