import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddRecordView from "../views/AddRecordView.vue";
import RecordsView from "../views/RecordsView.vue";
import AboutView from "../views/AboutView.vue";
import SupportView from "../views/SupportView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },

  { path: "/login", name: "login", component: LoginView },

  // "Get started" CTA – points to the register page
  {
    path: "/get-started",
    name: "get-started",
    component: RegisterView,
    alias: "/register", // you can keep /register working too
  },

  { path: "/dashboard", name: "dashboard", component: DashboardView },

  // Add health record page – matches RouterLink to="/add-record"
  {
    path: "/add-record",
    name: "add-record",
    component: AddRecordView,
    alias: "/records/new", // optional: old path still works
  },

  { path: "/records", name: "records", component: RecordsView },
  { path: "/about", name: "about", component: AboutView },
  { path: "/support", name: "support", component: SupportView },
];

const router = createRouter({
  history: createWebHistory(), // or createWebHistory(import.meta.env.BASE_URL)
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
