// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddRecordView from "../views/AddRecordView.vue";
import RecordsView from "../views/RecordsView.vue";
import EncountersView from "../views/EncountersView.vue";
import AddEncounterView from "../views/AddEncounterView.vue";
import ShareView from "../views/ShareView.vue";
import ProfileView from "../views/ProfileView.vue";
import AboutView from "../views/AboutView.vue";
import SupportView from "../views/SupportView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import OnboardingView from "../views/auth/OnboardingView.vue";

import { getSessionUser, isLoggedIn } from "../utils/session";
import { isOnboardingComplete as isOnboardingCompleteForUser } from "../utils/profile";

/**
 * Optional refactor: route meta flags instead of scattered Sets.
 * Behavior remains the same as your current guard.
 */
const routes = [
  // Public
  { path: "/", name: "home", component: HomeView, meta: { public: true } },
  { path: "/about", name: "about", component: AboutView, meta: { public: true } },
  { path: "/support", name: "support", component: SupportView, meta: { public: true } },

  // Auth
  { path: "/login", name: "login", component: LoginView, meta: { public: true } },
  {
    path: "/get-started",
    name: "get-started",
    component: RegisterView,
    alias: "/register",
    meta: { public: true },
  },

  // Onboarding (requires auth, allowed while not onboarded)
  { path: "/onboarding", name: "onboarding", component: OnboardingView, meta: { allowWhileOnboarding: true } },

  // Protected
  { path: "/dashboard", name: "dashboard", component: DashboardView },
  {
    path: "/add",
    name: "add",
    component: AddRecordView,
    alias: ["/add-record", "/records/new"],
  },
  { path: "/records", name: "records", component: RecordsView },
  { path: "/encounters", name: "encounters", component: EncountersView },
  {
    path: "/encounters/new",
    name: "add-encounter",
    component: AddEncounterView,
    alias: "/visit/new",
  },
  { path: "/share", name: "share", component: ShareView },
  { path: "/profile", name: "profile", component: ProfileView, meta: { allowWhileOnboarding: true } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

function isPublicRoute(to) {
  return to?.meta?.public === true;
}

function allowWhileOnboarding(to) {
  return to?.meta?.allowWhileOnboarding === true || to?.name === "onboarding";
}

function isOnboardingComplete(user) {
  if (!user?.id) return false;
  if (user.onboardingComplete === true) return true;

  try {
    return isOnboardingCompleteForUser(user.id) === true;
  } catch {
    return false;
  }
}

router.beforeEach((to) => {
  const loggedIn = isLoggedIn();
  const user = getSessionUser();
  const onboarded = isOnboardingComplete(user);

  // 1) Not logged in: allow public; otherwise go login
  if (!loggedIn) {
    if (isPublicRoute(to)) return true;
    return { name: "login", query: { redirect: to.fullPath } };
  }

  // 2) Logged in: block auth pages (send to correct place)
  if (to.name === "login" || to.name === "get-started") {
    return { name: onboarded ? "dashboard" : "onboarding" };
  }

  // 3) Logged in but not onboarded: force onboarding except allowed pages
  if (!onboarded && !allowWhileOnboarding(to)) {
    return { name: "onboarding", query: { redirect: to.fullPath } };
  }

  return true;
});

export default router;
