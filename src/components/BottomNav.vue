<!-- src/components/BottomNav.vue -->
<template>
  <nav
    v-if="!hideNav"
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    aria-label="Bottom navigation"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
      <!-- Dashboard -->
      <RouterLink
        :to="nav.dashboard.to"
        class="nav-item"
        :class="{ active: isActive(nav.dashboard.match) }"
        :aria-current="isActive(nav.dashboard.match) ? 'page' : null"
      >
        <span class="icon">{{ nav.dashboard.icon }}</span>
        <span class="label">{{ nav.dashboard.label }}</span>
      </RouterLink>

      <!-- Records / Review (role-aware label/icon) -->
      <RouterLink
        :to="nav.records.to"
        class="nav-item"
        :class="{ active: isActive(nav.records.match) }"
        :aria-current="isActive(nav.records.match) ? 'page' : null"
      >
        <span class="icon">{{ nav.records.icon }}</span>
        <span class="label">{{ nav.records.label }}</span>
      </RouterLink>

      <!-- Center action (role-based) -->
      <RouterLink
        :to="nav.center.to"
        class="mx-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md active:scale-[0.98]"
        :class="[centerColorClass, { 'ring-2 ring-offset-2 ring-offset-white ring-slate-200': isCenterActive }]"
        :aria-label="nav.center.aria"
        :title="nav.center.aria"
      >
        <span class="text-xl leading-none">＋</span>
      </RouterLink>

      <!-- Encounters -->
      <RouterLink
        :to="nav.encounters.to"
        class="nav-item"
        :class="{ active: isActive(nav.encounters.match) }"
        :aria-current="isActive(nav.encounters.match) ? 'page' : null"
      >
        <span class="icon">{{ nav.encounters.icon }}</span>
        <span class="label">{{ nav.encounters.label }}</span>
      </RouterLink>

      <!-- Profile -->
      <RouterLink
        :to="nav.profile.to"
        class="nav-item"
        :class="{ active: isActive(nav.profile.match) }"
        :aria-current="isActive(nav.profile.match) ? 'page' : null"
      >
        <span class="icon">{{ nav.profile.icon }}</span>
        <span class="label">{{ nav.profile.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { getSessionUser } from "../utils/session";
import { normalizeRole } from "../utils/profile";

/**
 * Optional: you can pass role from MainShell/App.
 * If not passed, BottomNav will read it from session user.
 */
const props = defineProps({
  role: { type: String, default: "" },
});

const route = useRoute();

const effectiveRole = computed(() => {
  const sessionRole = getSessionUser()?.role;
  return normalizeRole(props.role || sessionRole || "patient");
});

/**
 * “Permissions service” idea (kept inline for now to avoid extra file).
 * If you later create src/services/permissions.js, move this mapping there.
 */
function getNavForRole(role) {
  const base = {
    dashboard: { to: "/dashboard", match: "/dashboard", icon: "🏠", label: "Dashboard" },
    records: { to: "/records", match: "/records", icon: "🗂️", label: "Records" },
    encounters: { to: "/encounters", match: "/encounters", icon: "📝", label: "Encounters" },
    profile: { to: "/profile", match: "/profile", icon: "👤", label: "Profile" },
    center: { to: "/add", match: ["/add", "/add-record", "/records/new"], aria: "Add vitals" },
  };

  if (role === "student") {
    return {
      ...base,
      records: { ...base.records, icon: "🗂️", label: "Records" },
      encounters: { ...base.encounters, icon: "📝", label: "Encounters" },
      center: { to: "/encounters/new", match: ["/encounters/new", "/visit/new"], aria: "New encounter note" },
    };
  }

  if (role === "clinician") {
    return {
      ...base,
      records: { ...base.records, icon: "✅", label: "Review" },
      encounters: { ...base.encounters, icon: "🗂️", label: "Notes" },
      center: { to: "/encounters/new", match: ["/encounters/new", "/visit/new"], aria: "New clinical note" },
    };
  }

  if (role === "other") {
    return {
      ...base,
      records: { ...base.records, icon: "🗂️", label: "Records" },
      encounters: { ...base.encounters, icon: "📝", label: "Encounters" },
      center: { to: "/add", match: ["/add", "/add-record", "/records/new"], aria: "Add entry" },
    };
  }

  // patient / family (default)
  return base;
}

const nav = computed(() => getNavForRole(effectiveRole.value));

const hideNav = computed(() => {
  // Keep the app focused: hide bottom nav on auth + onboarding screens
  const p = route.path || "";
  return (
    p === "/" ||
    p.startsWith("/login") ||
    p.startsWith("/register") ||
    p.startsWith("/get-started") ||
    p.startsWith("/onboarding")
  );
});

const isActive = (match) => {
  const p = route.path || "";
  if (Array.isArray(match)) return match.some((m) => p === m || p.startsWith(m + "/"));
  return p === match || p.startsWith(match + "/");
};

const isCenterActive = computed(() => isActive(nav.value.center.match));

const centerColorClass = computed(() => {
  const r = effectiveRole.value;
  if (r === "student") return "bg-emerald-600 shadow-emerald-500/25";
  if (r === "clinician") return "bg-indigo-600 shadow-indigo-500/25";
  if (r === "other") return "bg-amber-600 shadow-amber-500/25";
  return "bg-sky-600 shadow-sky-500/25";
});
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
