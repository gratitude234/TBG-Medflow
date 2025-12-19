<!-- src/components/BottomNav.vue -->
<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    aria-label="Bottom navigation"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
      <RouterLink :to="links.dashboard" class="nav-item" :class="{ active: isActive('/dashboard') }">
        <span class="icon">🏠</span>
        <span class="label">{{ dashboardLabel }}</span>
      </RouterLink>

      <RouterLink :to="links.records" class="nav-item" :class="{ active: isActive('/records') }">
        <span class="icon">{{ recordsIcon }}</span>
        <span class="label">{{ recordsLabel }}</span>
      </RouterLink>

      <!-- Center action (role-based) -->
      <RouterLink
        :to="center.to"
        class="mx-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-md shadow-sky-500/25 active:scale-[0.98]"
        :aria-label="center.aria"
        :title="center.aria"
      >
        <span class="text-xl leading-none">＋</span>
      </RouterLink>

      <RouterLink :to="links.encounters" class="nav-item" :class="{ active: isActive('/encounters') }">
        <span class="icon">📝</span>
        <span class="label">Notes</span>
      </RouterLink>

      <RouterLink :to="links.profile" class="nav-item" :class="{ active: isActive('/profile') }">
        <span class="icon">👤</span>
        <span class="label">Profile</span>
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
    profile: "/profile",
  };
});

const center = computed(() => {
  // Patient: add vitals
  if (role.value === "patient") return { to: "/add", aria: "Add vitals" };

  // Student/clinician: add encounter for selected patient (or route to Share to pick)
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
const recordsIcon = computed(() => (isViewer.value ? "🩺" : "🗂️"));

const isActive = (prefix) => route.path === prefix || route.path.startsWith(prefix + "/");
</script>

<style scoped>
.nav-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-radius: 12px;
  color: #334155; /* slate-700 */
  min-width: 64px;
}
.nav-item:hover {
  background: rgba(15, 23, 42, 0.04);
}
.nav-item.active {
  color: #0369a1; /* sky-700 */
  background: rgba(2, 132, 199, 0.08);
}
.icon {
  font-size: 16px;
  line-height: 1;
}
.label {
  font-size: 10px;
  font-weight: 600;
}
</style>
