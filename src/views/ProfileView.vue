<!-- src/views/ProfileView.vue -->
<template>
  <main class="page">
    <section class="panel">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="h1">Profile</h1>
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

        <!-- Verification (student/clinician) -->
        <div v-if="isStaff" class="rounded-2xl border border-slate-200 p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Staff verification</h2>
              <p class="mt-1 text-[11px] text-slate-600">
                Student nurses and clinicians must be verified before they can receive shares and reply to patients.
              </p>
            </div>

            <span
              class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ring-1"
              :class="verificationBadgeClass"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="verificationDotClass" />
              {{ verificationLabel }}
            </span>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Short note (optional)</label>
              <input
                v-model="verifyForm.note"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., JABU student nurse, posting at OAUTHC"
              />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Proof link (optional)</label>
              <input
                v-model="verifyForm.documentUrl"
                type="url"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Google Drive / PDF link (optional)"
              />
              <p class="mt-1 text-[10px] text-slate-500">
                You can paste a link to your hospital ID card photo, posting letter, or school ID.
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="verificationStatus === 'verified' || submittingVerification"
              @click="submitVerification"
            >
              <span v-if="verificationStatus === 'verified'">Verified</span>
              <span v-else-if="submittingVerification">Sending…</span>
              <span v-else>Request verification</span>
            </button>

            <button
              type="button"
              class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              :disabled="refreshingMe"
              @click="refreshMe"
            >
              {{ refreshingMe ? "Refreshing…" : "Refresh status" }}
            </button>
          </div>

          <p v-if="verifyMessage" class="mt-3 text-[11px]" :class="verifyMessageType === 'error' ? 'text-red-600' : 'text-emerald-700'">
            {{ verifyMessage }}
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
import { apiGet, apiPost } from "../utils/apiClient";
import { clearSession, getSessionUser, setSessionUser } from "../utils/session";

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

// --------------------------------------------------
// Verification (staff)
// --------------------------------------------------
const isStaff = computed(() => {
  const r = String(user.value?.role || "").toLowerCase();
  return r === "student" || r === "clinician";
});

const verificationStatus = computed(() => {
  return String(user.value?.verificationStatus || "unverified").toLowerCase();
});

const verificationLabel = computed(() => {
  const s = verificationStatus.value;
  if (s === "verified") return "Verified";
  if (s === "pending") return "Pending";
  if (s === "rejected") return "Rejected";
  return "Unverified";
});

const verificationBadgeClass = computed(() => {
  const s = verificationStatus.value;
  if (s === "verified") return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  if (s === "pending") return "bg-amber-50 text-amber-800 ring-amber-100";
  if (s === "rejected") return "bg-rose-50 text-rose-800 ring-rose-100";
  return "bg-slate-50 text-slate-700 ring-slate-200";
});

const verificationDotClass = computed(() => {
  const s = verificationStatus.value;
  if (s === "verified") return "bg-emerald-500";
  if (s === "pending") return "bg-amber-500";
  if (s === "rejected") return "bg-rose-500";
  return "bg-slate-400";
});

const verifyForm = ref({ note: "", documentUrl: "" });
const submittingVerification = ref(false);
const refreshingMe = ref(false);
const verifyMessage = ref("");
const verifyMessageType = ref("success");

const refreshMe = async () => {
  if (!user.value?.id) return;
  refreshingMe.value = true;
  verifyMessage.value = "";
  try {
    const data = await apiGet("me.php");
    if (data?.user?.id) {
      // merge to keep any local flags intact
      const merged = { ...user.value, ...data.user };
      user.value = merged;
      setSessionUser(merged);
    }
  } catch (e) {
    verifyMessageType.value = "error";
    verifyMessage.value = e?.message || "Could not refresh.";
  } finally {
    refreshingMe.value = false;
  }
};

const submitVerification = async () => {
  if (!user.value?.id) return;
  if (!isStaff.value) return;

  submittingVerification.value = true;
  verifyMessage.value = "";

  try {
    const payload = {
      note: verifyForm.value.note,
      documentUrl: verifyForm.value.documentUrl,
      details: roleProfile.value || null,
    };

    await apiPost("submit_verification_request.php", payload);

    verifyMessageType.value = "success";
    verifyMessage.value = "Verification request sent. We'll update your status after review.";

    // optimistic update
    const merged = { ...user.value, verificationStatus: "pending" };
    user.value = merged;
    setSessionUser(merged);

    // fetch canonical status
    await refreshMe();
  } catch (e) {
    verifyMessageType.value = "error";
    verifyMessage.value = e?.message || "Could not submit request.";
  } finally {
    submittingVerification.value = false;
  }
};

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
