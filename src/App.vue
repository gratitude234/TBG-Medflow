<template>
  <div class="page-shell">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow"
    >
      Skip to content
    </a>

    <!-- Header -->
    <header class="app-header" :class="{ 'shadow-sm': isScrolled }">
      <div class="header-inner">
        <RouterLink to="/" class="flex items-center gap-2" aria-label="Medflow home">
          <img :src="logoMark" alt="" class="h-8 w-8" />
          <img :src="logoFull" alt="TBG Medflow" class="hidden h-6 sm:block" />
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 sm:flex" aria-label="Primary">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="isActive(link.to) ? 'nav-link-active' : 'nav-link-idle'"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </RouterLink>

          <div v-if="sessionUser" class="ml-2 flex items-center gap-2">
            <span class="nav-pill max-w-[220px] truncate">
              {{ sessionUser.fullName || 'Account' }}
            </span>
            <button type="button" class="btn-outline btn-sm" @click="logout">Log out</button>
          </div>

          <div v-else class="ml-2 flex items-center gap-2">
            <RouterLink to="/login" class="btn-ghost btn-sm">Log in</RouterLink>
            <RouterLink to="/register" class="btn-primary btn-sm">Get started</RouterLink>
          </div>
        </nav>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="btn-ghost btn-icon sm:hidden"
          aria-label="Toggle menu"
          :aria-expanded="mobileNavOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <svg v-if="!mobileNavOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="mobileNavOpen" id="mobile-menu" class="sm:hidden">
          <div class="mx-auto max-w-6xl px-4 pb-4">
            <div class="panel p-4">
              <nav class="flex flex-col gap-1" aria-label="Mobile primary">
                <RouterLink
                  v-for="link in navLinks"
                  :key="link.to"
                  :to="link.to"
                  class="nav-link"
                  :class="isActive(link.to) ? 'nav-link-active' : 'nav-link-idle'"
                  :aria-current="isActive(link.to) ? 'page' : undefined"
                  @click="closeMobileMenu"
                >
                  {{ link.label }}
                </RouterLink>
              </nav>

              <div v-if="sessionUser" class="mt-3 flex items-center justify-between gap-2">
                <span class="nav-pill max-w-[60%] truncate">
                  {{ sessionUser.fullName || sessionUser.email || 'Account' }}
                </span>
                <button type="button" class="btn-outline btn-sm" @click="logout">Log out</button>
              </div>

              <div v-else class="mt-3 grid grid-cols-2 gap-2">
                <RouterLink to="/login" class="btn-outline btn-sm" @click="closeMobileMenu">Log in</RouterLink>
                <RouterLink to="/register" class="btn-primary btn-sm" @click="closeMobileMenu">Get started</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main id="main-content" :class="showBottomNav ? 'pb-24' : 'pb-10'">
      <RouterView v-slot="{ Component }">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Bottom nav (mobile) -->
    <BottomNav v-if="showBottomNav" :role="sessionUser?.role || 'patient'" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

import logoFull from "./assets/tbg-medflow-logo-compressed.png";
import logoMark from "./assets/tbg-medflow-logo-mark.svg";

import BottomNav from "./components/BottomNav.vue";
import { clearSession, getSessionUser } from "./utils/session";
import { isAdmin } from "./utils/admin";

const router = useRouter();
const route = useRoute();

const mobileNavOpen = ref(false);
const isScrolled = ref(false);

const sessionUser = ref(null);

const refreshSession = () => {
  sessionUser.value = getSessionUser();
};

const showBottomNav = computed(() => {
  // show when logged in (patient-first IA)
  return !!sessionUser.value;
});

const navLinks = computed(() => {
  if (!sessionUser.value) {
    return [
      { label: "Home", to: "/" },
      { label: "Support", to: "/support" },
    ];
  }

  // Logged-in nav
  const links = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Add Vitals", to: "/add" },
    { label: "Records", to: "/records" },
    { label: "Encounters", to: "/encounters" },
    { label: "Share", to: "/share" },
    { label: "Inbox", to: "/inbox" },
    { label: "Profile", to: "/profile" },
  ];

  if (isAdmin(sessionUser.value)) {
    links.splice(links.length - 1, 0, { label: "Verify Staff", to: "/admin/verification" });
  }

  return links;
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 2;
};

const closeMobileMenu = () => {
  mobileNavOpen.value = false;
};

const isActive = (to) => {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(to + "/");
};

const logout = () => {
  clearSession();
  closeMobileMenu();
  router.push("/login");
};

onMounted(() => {
  handleScroll();
  refreshSession();

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("medflow:session", refreshSession);
  window.addEventListener("storage", refreshSession);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("medflow:session", refreshSession);
  window.removeEventListener("storage", refreshSession);
});
</script>
