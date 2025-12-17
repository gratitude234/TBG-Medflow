<!-- src/views/ProfileView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:pt-6 lg:pt-8">
    <section class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">Profile</h1>
          <p class="mt-1 text-[11px] text-slate-600 sm:text-xs">
            Account details, role access, and your setup status.
          </p>
        </div>

        <!-- Quick CTA -->
        <div v-if="user && !onboardingComplete" class="flex items-center gap-2">
          <RouterLink
            :to="{ name: 'onboarding', query: { redirect: '/profile' } }"
            class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
          >
            Finish setup
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>

      <!-- Logged in -->
      <div v-if="user" class="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <!-- Left: identity + role + onboarding -->
        <div class="space-y-4">
          <!-- Identity -->
          <div class="rounded-2xl border border-slate-200 bg-white p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-[10px] font-semibold text-slate-500">ACCOUNT</p>
                <p class="mt-1 text-base font-bold text-slate-900">
                  {{ user?.fullName || "—" }}
                </p>
                <p class="mt-1 text-[11px] text-slate-600">
                  {{ user?.email || "—" }}
                </p>

                <div class="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                  <span class="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                    ID: {{ user?.id ?? "—" }}
                  </span>
                  <span v-if="user?.createdAt" class="rounded-full bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
                    Created: {{ user.createdAt }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1"
                  :class="roleBadgeClass"
                  title="Your access is determined by your account role"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="roleDotClass" />
                  {{ roleLabelText }}
                </span>
              </div>
            </div>

            <div
              v-if="!onboardingComplete"
              class="mt-4 rounded-2xl bg-amber-50 p-3 text-[11px] text-amber-900 ring-1 ring-amber-100"
            >
              <p class="font-semibold">Finish your setup</p>
              <p class="mt-1 text-amber-900/90">
                Some parts of Medflow may redirect you to onboarding until setup is complete.
              </p>

              <div class="mt-3 flex flex-wrap gap-2">
                <RouterLink
                  :to="{ name: 'onboarding', query: { redirect: '/profile' } }"
                  class="inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
                >
                  Finish setup
                </RouterLink>

                <RouterLink
                  to="/support"
                  class="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Get help
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Setup status -->
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p class="text-[10px] font-semibold text-slate-500">ROLE</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ roleLabelText }}</p>
              <p class="mt-1 text-[11px] text-slate-600">
                Navigation and access are tailored using your account role (not a login selector).
              </p>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
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
                  <span class="h-1.5 w-1.5 rounded-full" :class="onboardingComplete ? 'bg-emerald-500' : 'bg-amber-500'" />
                  {{ onboardingComplete ? "Complete" : "Incomplete" }}
                </span>
              </div>

              <p class="mt-2 text-[11px] text-slate-600">
                Setup stores a small role profile on this device for now (MVP).
              </p>

              <RouterLink
                v-if="!onboardingComplete"
                :to="{ name: 'onboarding', query: { redirect: '/profile' } }"
                class="mt-3 inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
              >
                Finish setup
              </RouterLink>
            </div>
          </div>

          <!-- Safety -->
          <div class="rounded-2xl border border-slate-200 p-4">
            <h2 class="text-sm font-semibold text-slate-900">Safety & access</h2>
            <ul class="mt-2 space-y-1 text-[11px] text-slate-700">
              <li>• If you share this device, always log out after use.</li>
              <li>• Don’t store sensitive notes you wouldn’t want exposed on a shared phone/laptop.</li>
              <li>• Next upgrades: proper tokens, session expiry, and server-side role enforcement.</li>
            </ul>
          </div>
        </div>

        <!-- Right: onboarding profile summary -->
        <div class="space-y-4">
          <div class="rounded-2xl border border-slate-200 p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-sm font-semibold text-slate-900">Role details</h2>
                <p class="mt-1 text-[11px] text-slate-600">
                  A quick summary of what you entered during onboarding.
                </p>
              </div>

              <RouterLink
                v-if="!onboardingComplete"
                :to="{ name: 'onboarding', query: { redirect: '/profile' } }"
                class="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit
              </RouterLink>
            </div>

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

            <p v-else class="mt-3 text-[11px] text-slate-600">
              No extra role details saved yet. Finish setup to store your role profile.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
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

            <button
              type="button"
              class="ml-auto rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              @click="logout"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <!-- Logged out -->
      <div v-else class="rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-900 ring-1 ring-amber-100">
        You’re not logged in. Please log in to view your profile.
        <div class="mt-3">
          <RouterLink
            to="/login"
            class="inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
          >
            Log in
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

// ✅ FIX: your file currently imports from "./utils/session" (wrong path in /views) :contentReference[oaicite:2]{index=2}
import { clearSession, getSessionUser } from "../utils/session";

// ✅ Use shared onboarding/profile helpers (same style as OnboardingView) :contentReference[oaicite:3]{index=3}
import { getProfile, isOnboardingComplete, normalizeRole, roleLabel as roleLabelFn } from "../utils/profile";

const router = useRouter();
const user = ref(null);
const roleProfile = ref(null);

function loadRoleProfile() {
  roleProfile.value = null;
  if (!user.value?.id) return;
  roleProfile.value = getProfile(user.value.id);
}

const refreshSession = () => {
  user.value = getSessionUser();
  loadRoleProfile();
};

const onboardingComplete = computed(() => {
  if (!user.value?.id) return false;
  // helper expects userId (matches your OnboardingView usage)
  return isOnboardingComplete(user.value.id) || user.value.onboardingComplete === true;
});

const roleKey = computed(() => normalizeRole(user.value?.role || "patient"));
const roleLabelText = computed(() => roleLabelFn(roleKey.value));

const roleBadgeClass = computed(() => {
  const r = roleKey.value;
  if (r === "student") return "bg-indigo-50 text-indigo-800 ring-indigo-100";
  if (r === "clinician") return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  if (r === "other") return "bg-amber-50 text-amber-900 ring-amber-100";
  return "bg-sky-50 text-sky-800 ring-sky-100";
});

const roleDotClass = computed(() => {
  const r = roleKey.value;
  if (r === "student") return "bg-indigo-500";
  if (r === "clinician") return "bg-emerald-500";
  if (r === "other") return "bg-amber-500";
  return "bg-sky-500";
});

const roleProfileSummary = computed(() => {
  const p = roleProfile.value;
  if (!p || typeof p !== "object") return [];

  const pick = (label, key) => (p[key] ? { label, value: String(p[key]) } : null);

  return [
    // Student
    pick("Institution", "institution"),
    pick("Department / Program", "department"),
    pick("Level", "level"),
    pick("Posting", "posting"),
    pick("Mentor email", "mentorEmail"),

    // Clinician
    pick("Facility", "facility"),
    pick("Specialty", "specialty"),
    pick("Work email", "workEmail"),

    // Other
    pick("Organisation", "organisation"),
    pick("Purpose", "purpose"),
    pick("Category", "category"),

    // Patient
    pick("Patient context", "patientContext"),
  ].filter(Boolean);
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
