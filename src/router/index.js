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

// ✅ NEW (you will create this file next)
import OnboardingView from "../views/auth/OnboardingView.vue";

import { getSessionUser, isLoggedIn } from "../utils/session";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView },

  {
    path: "/get-started",
    name: "get-started",
    component: RegisterView,
    alias: "/register",
  },

  // ✅ NEW: Role onboarding (Protected)
  { path: "/onboarding", name: "onboarding", component: OnboardingView },

  // Protected
  { path: "/dashboard", name: "dashboard", component: DashboardView },

  {
    path: "/add",
    name: "add",
    component: AddRecordView,
    alias: ["/add-record", "/records/new"],
  },

  { path: "/records", name: "records", component: RecordsView },

  // ✅ Encounters
  { path: "/encounters", name: "encounters", component: EncountersView },
  {
    path: "/encounters/new",
    name: "add-encounter",
    component: AddEncounterView,
    alias: "/visit/new",
  },

  { path: "/share", name: "share", component: ShareView },
  { path: "/profile", name: "profile", component: ProfileView },

  // Public
  { path: "/about", name: "about", component: AboutView },
  { path: "/support", name: "support", component: SupportView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const PUBLIC_NAMES = new Set(["home", "login", "get-started", "about", "support"]);

// While onboarding is incomplete, allow only these (still logged-in)
const ALLOW_WHILE_ONBOARDING = new Set(["onboarding", "profile", "support", "about"]);

/**
 * MVP onboarding completion check:
 * - If your onboarding flow later saves `user.onboardingComplete = true`, we respect that
 * - Otherwise we check localStorage flag: `medflowOnboardingComplete:<userId>`
 */
function isOnboardingComplete(user) {
  if (!user?.id) return false;
  if (user.onboardingComplete === true) return true;

  try {
    const raw = localStorage.getItem(`medflowOnboardingComplete:${user.id}`);
    return raw === "1" || raw === "true";
  } catch {
    return false;
  }
}

router.beforeEach((to) => {
  const loggedIn = isLoggedIn();
  const user = getSessionUser();
  const onboarded = isOnboardingComplete(user);

  // 1) If NOT logged in: public pages ok; protected -> login
  if (!loggedIn) {
    if (PUBLIC_NAMES.has(to.name)) return true;
    return { name: "login", query: { redirect: to.fullPath } };
  }

  // 2) If logged in and trying to access login/register -> send to right place
  if (to.name === "login" || to.name === "get-started") {
    return { name: onboarded ? "dashboard" : "onboarding" };
  }

  // 3) If logged in but NOT onboarded: force to onboarding (except allowed pages)
  if (!onboarded && !ALLOW_WHILE_ONBOARDING.has(to.name)) {
    return { name: "onboarding", query: { redirect: to.fullPath } };
  }

  return true;
});

export default router;
