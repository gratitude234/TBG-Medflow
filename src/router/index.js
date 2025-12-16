// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddRecordView from "../views/AddRecordView.vue";
import RecordsView from "../views/RecordsView.vue";
import ShareView from "../views/ShareView.vue";
import ProfileView from "../views/ProfileView.vue";
import AboutView from "../views/AboutView.vue";
import SupportView from "../views/SupportView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";

import { isLoggedIn } from "../utils/session";

const routes = [
  { path: "/", name: "home", component: HomeView },

  { path: "/login", name: "login", component: LoginView },

  // "Get started" CTA – points to register
  {
    path: "/get-started",
    name: "get-started",
    component: RegisterView,
    alias: "/register",
  },

  // Protected
  { path: "/dashboard", name: "dashboard", component: DashboardView },

  // ✅ Canonical "Add" path is /add (keeps old links working)
  {
    path: "/add",
    name: "add",
    component: AddRecordView,
    alias: ["/add-record", "/records/new"],
  },

  { path: "/records", name: "records", component: RecordsView },
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

// ---- Simple Auth Guard ----
const PUBLIC_NAMES = new Set(["home", "login", "get-started", "about", "support"]);

router.beforeEach((to) => {
  const loggedIn = isLoggedIn();

  // If already logged in, keep auth pages out of the way
  if (loggedIn && (to.name === "login" || to.name === "get-started")) {
    return { name: "dashboard" };
  }

  // Allow public routes
  if (PUBLIC_NAMES.has(to.name)) return true;

  // Protect everything else
  if (!loggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  return true;
});

export default router;
