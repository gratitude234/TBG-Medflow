<!-- src/components/BottomNav.vue -->
<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    aria-label="Bottom navigation"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
      <RouterLink :to="links.dashboard" class="nav-item" :class="{ active: isActive('/dashboard') }">
        <span class="icon">🏠</span>
        <span class="label">Dashboard</span>
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
        <span class="label">Encounters</span>
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

const props = defineProps({
  role: { type: String, default: "patient" },
});

const route = useRoute();

const normalizedRole = computed(() => String(props.role || "patient").toLowerCase());

const links = computed(() => {
  return {
    dashboard: "/dashboard",
    records: "/records",
    encounters: "/encounters",
    profile: "/profile",
  };
});

const center = computed(() => {
  const r = normalizedRole.value;

  // Patient: add vitals
  if (r === "patient") return { to: "/add", aria: "Add vitals" };

  // Student/clinician: default to add encounter (documentation)
  if (r === "student") return { to: "/encounters/new", aria: "New encounter" };
  if (r === "clinician") return { to: "/encounters/new", aria: "New note" };

  // Other: keep it safe/simple
  return { to: "/add", aria: "Add entry" };
});

const recordsLabel = computed(() => (normalizedRole.value === "clinician" ? "Review" : "Records"));
const recordsIcon = computed(() => (normalizedRole.value === "clinician" ? "✅" : "🗂️"));

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
