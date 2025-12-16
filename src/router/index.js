import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddRecordView from "../views/AddRecordView.vue";
import RecordsView from "../views/RecordsView.vue";
import AboutView from "../views/AboutView.vue";
import SupportView from "../views/SupportView.vue";

import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";

// ✅ NEW (create these two views)
import ShareView from "../views/ShareView.vue";
import ProfileView from "../views/ProfileView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },

  // Auth
  { path: "/login", name: "login", component: LoginView },

  // Keep your CTA route + keep /register
  {
    path: "/get-started",
    name: "get-started",
    component: RegisterView,
    alias: "/register",
  },

  // Core app
  { path: "/dashboard", name: "dashboard", component: DashboardView },

  // ✅ Canonical Add route (patient-first IA)
  {
    path: "/add",
    name: "add",
    component: AddRecordView,
    // keep old paths working:
    alias: ["/add-record", "/records/new"],
  },

  { path: "/records", name: "records", component: RecordsView },

  // ✅ New sections for MVP tabs
  { path: "/share", name: "share", component: ShareView },
  { path: "/profile", name: "profile", component: ProfileView },

  // Existing
  { path: "/about", name: "about", component: AboutView },
  { path: "/support", name: "support", component: SupportView },

  // ✅ 404 fallback
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(), // or createWebHistory(import.meta.env.BASE_URL)
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
