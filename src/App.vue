<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur"
      :class="{ 'shadow-sm': isScrolled }"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="flex items-center gap-2">
          <img :src="logoMark" alt="TBG Medflow" class="h-8 w-8" />
          <img :src="logoFull" alt="TBG Medflow" class="hidden h-6 sm:block" />
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-2 sm:flex" aria-label="Primary">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-1.5 text-xs font-semibold transition"
            :class="isActive(link.to) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
          >
            {{ link.label }}
          </RouterLink>

          <div v-if="sessionUser" class="ml-2 flex items-center gap-2">
            <span class="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
              {{ sessionUser.fullName || "Account" }}
            </span>
            <button
              type="button"
              class="rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
              @click="logout"
            >
              Log out
            </button>
          </div>

          <div v-else class="ml-2 flex items-center gap-2">
            <RouterLink to="/login" class="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Log in
            </RouterLink>
            <RouterLink to="/register" class="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700">
              Get started
            </RouterLink>
          </div>
        </nav>

        <!-- Mobile menu button -->
        <button
          class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:hidden"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          {{ mobileNavOpen ? "Close" : "Menu" }}
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
        <div v-if="mobileNavOpen" class="border-t border-slate-200 bg-white sm:hidden">
          <div class="mx-auto max-w-6xl space-y-2 px-4 py-3">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block rounded-xl px-3 py-2 text-sm font-semibold"
              :class="isActive(link.to) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </RouterLink>

            <div v-if="sessionUser" class="flex items-center justify-between gap-2 pt-2">
              <span class="text-[11px] font-semibold text-slate-600">
                Signed in as {{ sessionUser.fullName || sessionUser.email }}
              </span>
              <button
                type="button"
                class="rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                @click="logout"
              >
                Log out
              </button>
            </div>

            <div v-else class="flex gap-2 pt-2">
              <RouterLink
                to="/login"
                class="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                @click="closeMobileMenu"
              >
                Log in
              </RouterLink>
              <RouterLink
                to="/register"
                class="flex-1 rounded-full bg-sky-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700"
                @click="closeMobileMenu"
              >
                Get started
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main
      id="main-content"
      class="mx-auto max-w-6xl px-4 pt-6 sm:pt-8 lg:pt-10"
      :class="showBottomNav ? 'pb-24' : 'pb-10'"
    >
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

    <!-- Patient bottom nav (mobile-first IA) -->
    <BottomNav v-if="showBottomNav" :role="sessionUser?.role || 'patient'" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

import logoFull from "./assets/tbg-medflow-logo-compressed.png";
import logoMark from "./assets/tbg-medflow-logo-mark.svg";

import BottomNav from "./components/BottomNav.vue";
import { clearSession, getSessionUser } from "./utils/session";

const mobileNavOpen = ref(false);
const isScrolled = ref(false);
const route = useRoute();

const sessionUser = ref(null);

const refreshSession = () => {
  sessionUser.value = getSessionUser();
};

const showBottomNav = computed(() => {
  // show when logged in (patient-first IA). Later you can restrict: sessionUser.value?.role === 'patient'
  return !!sessionUser.value;
});

const navLinks = computed(() => {
  if (!sessionUser.value) {
    return [
      { label: "Home", to: "/" },
      { label: "Support", to: "/support" },
    ];
  }

  return [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Add Vitals", to: "/add" },
    { label: "Records", to: "/records" },
    { label: "Share", to: "/share" },
    { label: "Profile", to: "/profile" },
  ];
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
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
  // optional: route to login, but don’t force it here (some screens can be public)
  // router.push("/login");
};

onMounted(() => {
  handleScroll();
  refreshSession();

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("medflow:session", refreshSession);
  window.addEventListener("storage", refreshSession); // cross-tab sync
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("medflow:session", refreshSession);
  window.removeEventListener("storage", refreshSession);
});
</script>
