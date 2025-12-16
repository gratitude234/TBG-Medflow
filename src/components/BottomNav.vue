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
        <span class="icon">🗂️</span>
        <span class="label">Records</span>
      </RouterLink>

      <!-- Center action -->
      <RouterLink
        :to="links.add"
        class="mx-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-md shadow-sky-500/25 active:scale-[0.98]"
        aria-label="Add vitals"
      >
        <span class="text-xl leading-none">＋</span>
      </RouterLink>

      <RouterLink :to="links.share" class="nav-item" :class="{ active: isActive('/share') }">
        <span class="icon">📤</span>
        <span class="label">Share</span>
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

const links = computed(() => {
  // For now: same links for all roles.
  // Later you can branch by role (clinician/student) with different tabs.
  return {
    dashboard: "/dashboard",
    add: "/add",
    records: "/records",
    share: "/share",
    profile: "/profile",
  };
});

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
