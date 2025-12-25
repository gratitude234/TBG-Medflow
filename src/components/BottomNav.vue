<!-- src/components/BottomNav.vue -->
<template>
  <nav class="bottom-nav sm:hidden" aria-label="Bottom navigation">
    <div class="bottom-nav-inner">
      <RouterLink
        :to="links.dashboard"
        class="bottom-nav-item"
        :class="{ active: isActive('/dashboard') }"
        :aria-current="isActive('/dashboard') ? 'page' : undefined"
      >
        <svg class="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11l9-7 9 7v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V14H11v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V11z" />
        </svg>
        <span>{{ dashboardLabel }}</span>
      </RouterLink>

      <RouterLink
        :to="links.records"
        class="bottom-nav-item"
        :class="{ active: isActive('/records') }"
        :aria-current="isActive('/records') ? 'page' : undefined"
      >
        <svg class="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
        <span>{{ recordsLabel }}</span>
      </RouterLink>

      <div class="bottom-nav-fab" aria-hidden="false">
        <RouterLink :to="center.to" class="bottom-nav-fab-btn" :aria-label="center.aria" :title="center.aria">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14" />
          </svg>
        </RouterLink>
      </div>

      <RouterLink
        :to="links.encounters"
        class="bottom-nav-item"
        :class="{ active: isActive('/encounters') }"
        :aria-current="isActive('/encounters') ? 'page' : undefined"
      >
        <svg class="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 6H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2z" />
        </svg>
        <span>Notes</span>
      </RouterLink>

      <RouterLink
        :to="links.inbox"
        class="bottom-nav-item"
        :class="{ active: isActive('/inbox') }"
        :aria-current="isActive('/inbox') ? 'page' : undefined"
      >
        <svg class="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
        </svg>
        <span>Inbox</span>
      </RouterLink>

      <RouterLink
        :to="links.profile"
        class="bottom-nav-item"
        :class="{ active: isActive('/profile') }"
        :aria-current="isActive('/profile') ? 'page' : undefined"
      >
        <svg class="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
        </svg>
        <span>Profile</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { getSessionUser } from "../utils/session";
import { getActivePatient, normalizeRole, patientQuery } from "../utils/patientContext";

const props = defineProps({
  // Optional: allow parent to override role
  role: { type: String, default: "" },
});

const route = useRoute();

const sessionUser = computed(() => getSessionUser());
const role = computed(() => normalizeRole(props.role || sessionUser.value?.role || "patient"));
const isViewer = computed(() => role.value !== "patient");

const activePatientId = computed(() => {
  // Priority: explicit route query
  const q = Number(route.query.patientUserId || 0);
  if (q > 0) return q;

  // Fallback: stored active patient (per viewer)
  const uid = Number(sessionUser.value?.id || 0);
  if (!uid) return 0;
  const ap = getActivePatient(uid);
  return Number(ap?.id || 0);
});

const withPatient = (path) => {
  if (isViewer.value && activePatientId.value > 0) {
    return { path, query: patientQuery(activePatientId.value) };
  }
  return path;
};

const links = computed(() => {
  return {
    dashboard: "/dashboard",
    records: withPatient("/records"),
    encounters: withPatient("/encounters"),
    inbox: "/inbox",
    profile: "/profile",
  };
});

const center = computed(() => {
  // Patient: add vitals
  if (role.value === "patient") return { to: "/add", aria: "Add vitals" };

  // Student/clinician: add encounter for selected patient (or route to dashboard)
  if (role.value === "student" || role.value === "clinician") {
    if (activePatientId.value > 0) {
      return { to: { path: "/encounters/new", query: patientQuery(activePatientId.value) }, aria: "Add note" };
    }
    return { to: "/dashboard", aria: "Select patient" };
  }

  // Other: safe default
  return { to: "/dashboard", aria: "Patients" };
});

const dashboardLabel = computed(() => (isViewer.value ? "Patients" : "Dashboard"));
const recordsLabel = computed(() => (isViewer.value ? "Vitals" : "Records"));

const isActive = (prefix) => route.path === prefix || route.path.startsWith(prefix + "/");
</script>
