<!-- src/App.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-b from-sky-50/70 via-slate-50 to-slate-100 text-slate-900"
  >
    <!-- Skip link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-40 focus:rounded-full focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg"
    >
      Skip to main content
    </a>

    <!-- Sticky header -->
    <header
      :class="[
        'sticky top-0 z-30 border-b bg-white/80 backdrop-blur transition-shadow',
        isScrolled ? 'shadow-sm border-slate-200' : 'border-slate-100/70'
      ]"
    >
      <nav
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4"
      >
        <!-- Brand -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <!-- Logo mark on very small screens -->
          <img
            :src="logoMark"
            alt="TBG Medflow logo"
            class="h-8 w-auto sm:hidden"
          />
          <!-- Full logo on small+ screens -->
          <img
            :src="logoFull"
            alt="TBG Medflow full logo"
            class="hidden h-8 w-auto sm:block"
          />

          <div class="ml-1 hidden flex-col sm:flex">
            <span class="text-xs font-semibold tracking-wide text-slate-900">
              TBG Medflow
            </span>
            <span class="text-[11px] leading-tight text-slate-500">
              Smarter records, better care
            </span>
          </div>
        </RouterLink>

        <!-- Desktop navigation -->
        <div class="hidden items-center gap-6 md:flex">
          <!-- Main links -->
          <div
            class="flex items-center gap-1 rounded-full bg-slate-50/80 px-1.5 py-0.5 text-xs font-medium"
          >
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :aria-current="isActive(link.to) ? 'page' : undefined"
              :class="[
                'rounded-full px-3 py-1 transition-colors',
                isActive(link.to)
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-sky-700'
              ]"
            >
              {{ link.label }}
            </RouterLink>
          </div>

          <!-- Auth actions -->
          <div class="flex items-center gap-3">
            <RouterLink
              to="/login"
              class="rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/get-started"
              class="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Get started
            </RouterLink>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
          @click="mobileNavOpen = !mobileNavOpen"
          :aria-expanded="mobileNavOpen"
          aria-label="Toggle navigation"
        >
          <span v-if="!mobileNavOpen" class="flex flex-col gap-0.5">
            <span class="block h-0.5 w-4 rounded bg-slate-700"></span>
            <span class="block h-0.5 w-4 rounded bg-slate-700"></span>
            <span class="block h-0.5 w-4 rounded bg-slate-700"></span>
          </span>
          <span v-else class="relative h-4 w-4">
            <span
              class="absolute left-1/2 top-1/2 block h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-slate-700"
            ></span>
            <span
              class="absolute left-1/2 top-1/2 block h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-slate-700"
            ></span>
          </span>
        </button>
      </nav>

      <!-- Mobile navigation panel -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="mobileNavOpen" class="md:hidden">
          <div
            class="mx-4 mb-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg ring-1 ring-slate-900/5"
          >
            <div class="mb-3 flex flex-col space-y-1 text-sm font-medium">
              <RouterLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                @click="closeMobileMenu"
                :class="[
                  'rounded-lg px-3 py-2 transition-colors',
                  isActive(link.to)
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-sky-700'
                ]"
              >
                {{ link.label }}
              </RouterLink>
            </div>

            <div class="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <RouterLink
                to="/login"
                class="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-center text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-700"
                @click="closeMobileMenu"
              >
                Log in
              </RouterLink>
              <RouterLink
                to="/get-started"
                class="w-full rounded-full bg-sky-600 px-4 py-1.5 text-center text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700"
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
      class="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pt-8 lg:pt-10"
    >
      <!-- Page transition -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

import logoFull from "./assets/tbg-medflow-logo-compressed.png";
import logoMark from "./assets/tbg-medflow-logo-mark.svg";

const mobileNavOpen = ref(false);
const isScrolled = ref(false);
const route = useRoute();

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Records", to: "/records" },
  { label: "Support", to: "/support" },
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

const closeMobileMenu = () => {
  mobileNavOpen.value = false;
};

const isActive = (to) => {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(to);
};

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
