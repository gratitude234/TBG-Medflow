<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur"
      :class="{ 'shadow-sm': isScrolled }"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="flex items-center gap-2" @click="closeMobileMenu">
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
            <!-- Role badge (global) -->
            <span
              class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1"
              :class="roleBadgeClass"
              title="Your role is set at signup and used across the app"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="roleDotClass" />
              {{ roleText }}
            </span>

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
            <RouterLink
              to="/login"
              class="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
            >
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

      <!-- Global banner: first-time visitor (logged out) -->
      <div v-if="showWelcomeBanner" class="border-t border-slate-200 bg-white">
        <div class="mx-auto flex max-w-6xl items-start justify-between gap-3 px-4 py-3">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold text-slate-900">Welcome to TBG Medflow</p>
            <p class="text-[11px] text-slate-600">
              Track vitals + visit notes faster. Pick your role at signup — Medflow tailors the experience automatically.
            </p>
            <div class="mt-2 flex flex-wrap gap-2">
              <RouterLink
                to="/register"
                class="inline-flex rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
                @click="closeMobileMenu"
              >
                Get started
              </RouterLink>
              <RouterLink
                to="/support"
                class="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                @click="closeMobileMenu"
              >
                Privacy & help
              </RouterLink>
            </div>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            @click="dismissWelcomeBanner"
            aria-label="Dismiss welcome message"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Global banner: onboarding incomplete (logged in) -->
      <div v-if="showOnboardingBanner" class="border-t border-amber-200 bg-amber-50">
        <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <p class="text-[11px] font-semibold text-amber-900">Finish setup</p>
            <p class="text-[11px] text-amber-900/90">
              Complete your onboarding so Medflow can tailor your dashboard and keep your flow consistent.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <RouterLink
              :to="{ name: 'onboarding', query: { redirect: route.fullPath } }"
              class="inline-flex rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
              @click="closeMobileMenu"
            >
              Finish setup →
            </RouterLink>
            <RouterLink
              to="/support"
              class="inline-flex rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/50"
              @click="closeMobileMenu"
            >
              Get help
            </RouterLink>
          </div>
        </div>
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

            <div v-if="sessionUser" class="flex flex-col gap-2 pt-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-[11px] font-semibold text-slate-600">
                  Signed in as {{ sessionUser.fullName || sessionUser.email }}
                </span>

                <!-- Role badge (mobile) -->
                <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1"
                  :class="roleBadgeClass"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="roleDotClass" />
                  {{ roleText }}
                </span>
              </div>

              <button
                type="button"
                class="self-start rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
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

    <!-- Bottom nav -->
    <BottomNav v-if="showBottomNav" :role="sessionUser?.role || 'patient'" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

import logoFull from "./assets/tbg-medflow-logo-compressed.png";
import logoMark from "./assets/tbg-medflow-logo-mark.svg";

import BottomNav from "./components/BottomNav.vue";
import { clearSession, getSessionUser } from "./utils/session";
import { isOnboardingComplete, normalizeRole, roleLabel as roleLabelFn } from "./utils/profile";

const router = useRouter();
const route = useRoute();

const mobileNavOpen = ref(false);
const isScrolled = ref(false);

const sessionUser = ref(null);

const refreshSession = () => {
  sessionUser.value = getSessionUser();
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

const closeMobileMenu = () => {
  mobileNavOpen.value = false;
};

watch(
  () => route.fullPath,
  () => {
    // close menu on navigation
    closeMobileMenu();
  }
);

// ---- Role + onboarding state ----
const roleKey = computed(() => normalizeRole(sessionUser.value?.role || "patient"));
const roleText = computed(() => roleLabelFn(roleKey.value));

const roleBadgeClass = computed(() => {
  const r = roleKey.value;
  if (r === "student") return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  if (r === "clinician") return "bg-indigo-50 text-indigo-800 ring-indigo-100";
  if (r === "other") return "bg-amber-50 text-amber-900 ring-amber-100";
  return "bg-sky-50 text-sky-800 ring-sky-100";
});

const roleDotClass = computed(() => {
  const r = roleKey.value;
  if (r === "student") return "bg-emerald-500";
  if (r === "clinician") return "bg-indigo-500";
  if (r === "other") return "bg-amber-500";
  return "bg-sky-500";
});

const onboarded = computed(() => {
  const u = sessionUser.value;
  if (!u?.id) return false;
  // supports either backend boolean or local onboarding flag
  return u.onboardingComplete === true || isOnboardingComplete(u.id);
});

const isAuthOrOnboardingRoute = computed(() => {
  const p = route.path || "";
  return (
    p.startsWith("/login") ||
    p.startsWith("/register") ||
    p.startsWith("/get-started") ||
    p.startsWith("/onboarding")
  );
});

const showOnboardingBanner = computed(() => {
  return !!sessionUser.value && !onboarded.value && !isAuthOrOnboardingRoute.value;
});

// ---- First-time visitor banner ----
const welcomeDismissed = ref(false);

const showWelcomeBanner = computed(() => {
  return !sessionUser.value && !welcomeDismissed.value && route.path === "/";
});

const dismissWelcomeBanner = () => {
  welcomeDismissed.value = true;
  try {
    localStorage.setItem("medflowWelcomeDismissed", "1");
  } catch {
    // ignore
  }
};

// ---- Navigation links ----
const navLinks = computed(() => {
  if (!sessionUser.value) {
    return [
      { label: "Home", to: "/" },
      { label: "Support", to: "/support" },
    ];
  }

  // Logged-in nav (role-neutral labels, bottom nav handles more role-specific UI)
  return [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Add", to: "/add" },
    { label: "Records", to: "/records" },
    { label: "Encounters", to: "/encounters" },
    { label: "Share", to: "/share" },
    { label: "Profile", to: "/profile" },
  ];
});

const showBottomNav = computed(() => {
  // show only when logged in and not on auth/onboarding routes
  return !!sessionUser.value && !isAuthOrOnboardingRoute.value;
});

const isActive = (to) => {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(to + "/");
};

const logout = () => {
  clearSession();
  closeMobileMenu();
  // keep UX simple: after logout, go to login
  router.push("/login");
};

onMounted(() => {
  handleScroll();
  refreshSession();

  try {
    welcomeDismissed.value = localStorage.getItem("medflowWelcomeDismissed") === "1";
  } catch {
    welcomeDismissed.value = false;
  }

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
