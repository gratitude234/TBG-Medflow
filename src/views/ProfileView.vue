<!-- src/views/ProfileView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-lg font-bold text-slate-900">Profile</h1>
          <p class="mt-1 text-[11px] text-slate-600">Account, role, onboarding, and quick actions.</p>
        </div>

        <RouterLink
          to="/dashboard"
          class="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </RouterLink>
      </div>

      <!-- Logged in -->
      <div v-if="user" class="mt-4 space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-[10px] font-semibold text-slate-500">FULL NAME</p>
            <p class="mt-1 text-sm font-bold text-slate-900">{{ user.fullName || "—" }}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-[10px] font-semibold text-slate-500">EMAIL</p>
            <p class="mt-1 text-sm font-bold text-slate-900">{{ user.email || "—" }}</p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-[10px] font-semibold text-slate-500">ROLE</p>
            <p class="mt-1 text-sm font-bold text-slate-900">
              {{ roleLabel }}
            </p>
            <p class="mt-1 text-[11px] text-slate-600">
              Your access and navigation are based on your account role.
            </p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-[10px] font-semibold text-slate-500">ONBOARDING</p>
            <div class="mt-1 flex items-center gap-2">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ring-1"
                :class="
                  onboardingComplete
                    ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                    : 'bg-amber-50 text-amber-900 ring-amber-100'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="onboardingComplete ? 'bg-emerald-500' : 'bg-amber-500'"
                />
                {{ onboardingComplete ? "Complete" : "Incomplete" }}
              </span>
            </div>

            <p class="mt-2 text-[11px] text-slate-600">
              If incomplete, you’ll be redirected to onboarding when navigating the app.
            </p>

            <RouterLink
              v-if="!onboardingComplete"
              :to="{ name: 'onboarding', query: { redirect: '/profile' } }"
              class="mt-3 inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
            >
              Complete setup
            </RouterLink>
          </div>
        </div>

        <!-- Role profile (optional display) -->
        <div class="rounded-2xl border border-slate-200 p-4">
          <h2 class="text-sm font-semibold text-slate-900">Role details</h2>

          <div v-if="roleProfileSummary.length" class="mt-3 grid gap-2 sm:grid-cols-2">
            <div
              v-for="row in roleProfileSummary"
              :key="row.label"
              class="rounded-xl bg-slate-50 px-3 py-2"
            >
              <p class="text-[10px] font-semibold text-slate-500">{{ row.label }}</p>
              <p class="mt-1 text-[11px] font-semibold text-slate-900">{{ row.value }}</p>
            </div>
          </div>

          <p v-else class="mt-2 text-[11px] text-slate-600">
            No extra role details saved yet. Complete onboarding to store your role profile.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            @click="logout"
          >
            Log out
          </button>

          <RouterLink
            to="/records"
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            View records
          </RouterLink>

          <RouterLink
            to="/encounters"
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            View encounters
          </RouterLink>

          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="comingSoon"
          >
            Export my data
          </button>
        </div>

        <div class="rounded-2xl border border-slate-200 p-4">
          <h2 class="text-sm font-semibold text-slate-900">Safety & access</h2>
          <ul class="mt-2 space-y-1 text-[11px] text-slate-700">
            <li>• If you share this device, always log out after use.</li>
            <li>• Don’t store sensitive notes you wouldn’t want exposed on a shared phone/laptop.</li>
            <li>• Next upgrades: device verification, role permissions, export controls.</li>
          </ul>
        </div>
      </div>

      <!-- Logged out -->
      <div v-else class="mt-4 rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-900">
        You’re not logged in. Please log in to view your profile.
      </div>

      <div v-if="!user" class="mt-5 flex flex-wrap gap-2">
        <RouterLink
          to="/login"
          class="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
        >
          Log in
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { clearSession, getSessionUser } from "../utils/session";

const router = useRouter();
const user = ref(null);
const roleProfile = ref(null);

const refreshSession = () => {
  user.value = getSessionUser();
  loadRoleProfile();
};

function isOnboardingComplete(u) {
  if (!u?.id) return false;
  if (u.onboardingComplete === true) return true;

  try {
    const raw = localStorage.getItem(`medflowOnboardingComplete:${u.id}`);
    return raw === "1" || raw === "true";
  } catch {
    return false;
  }
}

const onboardingComplete = computed(() => isOnboardingComplete(user.value));

const roleLabel = computed(() => {
  const r = (user.value?.role || "patient").toLowerCase();
  if (r === "student") return "Student nurse";
  if (r === "clinician") return "Clinician / mentor";
  if (r === "other") return "Other";
  return "Patient / family";
});

function loadRoleProfile() {
  roleProfile.value = null;
  if (!user.value?.id) return;

  try {
    const raw =
      localStorage.getItem(`medflowRoleProfile:${user.value.id}`) ||
      localStorage.getItem(`medflowProfile:${user.value.id}`) ||
      "";
    roleProfile.value = raw ? JSON.parse(raw) : null;
  } catch {
    roleProfile.value = null;
  }
}

const roleProfileSummary = computed(() => {
  const p = roleProfile.value;
  if (!p || typeof p !== "object") return [];

  const pick = (label, key) => (p[key] ? { label, value: String(p[key]) } : null);

  const rows = [
    // Student
    pick("Institution", "institution"),
    pick("Department / Program", "department"), // ✅ NEW
    pick("Level", "level"),
    pick("Posting", "posting"),
    pick("Mentor email", "mentorEmail"),

    // Clinician
    pick("Facility", "facility"),
    pick("Specialty", "specialty"),
    pick("Work email", "workEmail"), // ✅ NEW

    // Other
    pick("Organisation", "organisation"), // ✅ NEW
    pick("Purpose", "purpose"),
  ].filter(Boolean);

  return rows;
});

const logout = () => {
  clearSession();
  user.value = null;
  roleProfile.value = null;
  router.replace("/login");
};

const comingSoon = () => {
  alert("Next: export to PDF + share via WhatsApp/email.");
};

onMounted(() => {
  refreshSession();
  window.addEventListener("medflow:session", refreshSession);
  window.addEventListener("storage", refreshSession);
});

onBeforeUnmount(() => {
  window.removeEventListener("medflow:session", refreshSession);
  window.removeEventListener("storage", refreshSession);
});
</script>
