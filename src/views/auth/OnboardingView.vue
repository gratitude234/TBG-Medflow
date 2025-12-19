<!-- src/views/auth/OnboardingView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-16 pt-4 space-y-6 sm:pt-6 lg:pt-8">
    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Setup</p>
          <h1 class="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Complete your workspace</h1>
          <p class="mt-1 text-[11px] text-slate-600">
            We tailor Medflow to your role so the interface fits how you work.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1"
            :class="
              role === 'clinician'
                ? 'bg-indigo-50 text-indigo-800 ring-indigo-100'
                : role === 'student'
                  ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                  : role === 'other'
                    ? 'bg-amber-50 text-amber-900 ring-amber-100'
                    : 'bg-sky-50 text-sky-800 ring-sky-100'
            "
          >
            <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {{ roleText }}
          </span>

          <RouterLink
            to="/profile"
            class="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Profile
          </RouterLink>
        </div>
      </div>

      <!-- Toast -->
      <div
        v-if="toast.visible"
        class="mt-4 flex items-start gap-2 rounded-2xl px-3 py-2 text-[11px] ring-1"
        :class="{
          'bg-sky-50 text-sky-800 ring-sky-100': toast.type === 'info',
          'bg-emerald-50 text-emerald-800 ring-emerald-100': toast.type === 'success',
          'bg-red-50 text-red-800 ring-red-100': toast.type === 'error',
        }"
      >
        <span v-if="toast.type === 'info'">💬</span>
        <span v-else-if="toast.type === 'success'">✅</span>
        <span v-else>⚠️</span>
        <p class="leading-snug">{{ toast.message }}</p>
      </div>

      <!-- If not logged in -->
      <div v-if="!user" class="mt-5 rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-900">
        You’re not logged in. Redirecting to login…
      </div>

      <!-- Form -->
      <form v-else class="mt-5 space-y-5" @submit.prevent="submit">
        <!-- Common header card -->
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-[10px] font-semibold text-slate-500">ACCOUNT</p>
          <div class="mt-2 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
              <p class="text-[10px] font-semibold text-slate-500">Name</p>
              <p class="mt-1 text-[11px] font-semibold text-slate-900">{{ user.fullName || "—" }}</p>
            </div>
            <div class="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
              <p class="text-[10px] font-semibold text-slate-500">Email</p>
              <p class="mt-1 text-[11px] font-semibold text-slate-900">{{ user.email || "—" }}</p>
            </div>
          </div>
        </div>

        <!-- Student nurse -->
        <section v-if="role === 'student'" class="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 class="text-sm font-semibold text-slate-900">Student nurse setup</h2>
          <p class="mt-1 text-[11px] text-slate-600">Add your school context so Medflow fits your training flow.</p>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-[11px] font-medium text-slate-700">
                Institution <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.institution"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., JABU"
              />
              <p v-if="errors.institution" class="text-[10px] text-red-500">{{ errors.institution }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] font-medium text-slate-700">
                Level <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.level"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., 200L"
              />
              <p v-if="errors.level" class="text-[10px] text-red-500">{{ errors.level }}</p>
            </div>

            <!-- ✅ NEW: Department/Program -->
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">
                Department / Program <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.department"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., Nursing Science"
              />
              <p v-if="errors.department" class="text-[10px] text-red-500">{{ errors.department }}</p>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Clinical posting location (optional)</label>
              <input
                v-model="form.posting"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., Teaching hospital - ward / unit"
              />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Supervisor / Mentor email (optional)</label>
              <input
                v-model="form.mentorEmail"
                type="email"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="mentor@example.com"
              />
            </div>
          </div>
        </section>

        <!-- Clinician / mentor -->
        <section v-else-if="role === 'clinician'" class="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 class="text-sm font-semibold text-slate-900">Clinician / mentor setup</h2>
          <p class="mt-1 text-[11px] text-slate-600">
            Add your facility context. Verification can be invite-based (MVP).
          </p>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-[11px] font-medium text-slate-700">
                Facility <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.facility"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., OAUTHC / private clinic"
              />
              <p v-if="errors.facility" class="text-[10px] text-red-500">{{ errors.facility }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] font-medium text-slate-700">
                Specialty / role <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.specialty"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., RN, Doctor, Preceptor"
              />
              <p v-if="errors.specialty" class="text-[10px] text-red-500">{{ errors.specialty }}</p>
            </div>

            <!-- ✅ NEW: Work email (optional) -->
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Work email (optional)</label>
              <input
                v-model="form.workEmail"
                type="email"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., firstname.lastname@hospital.org"
              />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Verification method</label>
              <select
                v-model="form.verification"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="request">Request access (pending)</option>
                <option value="invite">I have an invite code</option>
              </select>
              <p class="mt-1 text-[10px] text-slate-500">
                MVP: invite code can unlock “verified” later when backend is added.
              </p>
            </div>

            <div v-if="form.verification === 'invite'" class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">
                Invite code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.inviteCode"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., MEDFLOW-CLIN-1234"
              />
              <p v-if="errors.inviteCode" class="text-[10px] text-red-500">{{ errors.inviteCode }}</p>
            </div>
          </div>
        </section>

        <!-- Other -->
        <section v-else-if="role === 'other'" class="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 class="text-sm font-semibold text-slate-900">Other setup</h2>
          <p class="mt-1 text-[11px] text-slate-600">Tell us what you’re using Medflow for.</p>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="caregiver">Caregiver</option>
                <option value="admin">Admin</option>
                <option value="research">Research</option>
                <option value="personal">Personal tracking</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">
                Purpose <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.purpose"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., Helping a relative track BP"
              />
              <p v-if="errors.purpose" class="text-[10px] text-red-500">{{ errors.purpose }}</p>
            </div>

            <!-- ✅ NEW: Organisation (optional) -->
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Organisation (optional)</label>
              <input
                v-model="form.organisation"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., NGO / School / Clinic / Company"
              />
            </div>
          </div>
        </section>

        <!-- Patient minimal -->
        <section v-else class="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 class="text-sm font-semibold text-slate-900">Patient / family setup</h2>
          <p class="mt-1 text-[11px] text-slate-600">
            This is optional for now. You can skip and start using the app immediately.
          </p>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-medium text-slate-700">Who are you tracking for? (optional)</label>
              <select
                v-model="form.patientContext"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="self">Myself</option>
                <option value="family">A family member</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="!submitting">Save & continue</span>
            <span v-else>Saving…</span>
          </button>

          <button
            v-if="role === 'patient'"
            type="button"
            class="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="skip"
          >
            Skip for now
          </button>

          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="reset"
          >
            Reset
          </button>

          <span class="ml-auto text-[10px] text-slate-500">
            We store this on your device for now (MVP).
          </span>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import { getSessionUser, setSessionUser } from "../../utils/session";
import {
  getProfile,
  isOnboardingComplete,
  normalizeRole,
  roleLabel,
  saveProfile,
  setOnboardingComplete,
} from "../../utils/profile";

const router = useRouter();
const route = useRoute();

const user = ref(null);
const role = ref("patient");
const submitting = ref(false);

const toast = reactive({ visible: true, type: "info", message: "Complete setup to tailor your workspace." });

const form = reactive({
  // Student
  institution: "",
  department: "", // ✅ NEW
  level: "",
  posting: "",
  mentorEmail: "",

  // Clinician
  facility: "",
  specialty: "",
  workEmail: "", // ✅ NEW
  verification: "request",
  inviteCode: "",

  // Other
  category: "caregiver",
  purpose: "",
  organisation: "", // ✅ NEW

  // Patient minimal
  patientContext: "self",
});

const errors = reactive({
  institution: "",
  department: "", // ✅ NEW
  level: "",
  facility: "",
  specialty: "",
  inviteCode: "",
  purpose: "",
});

const roleText = computed(() => roleLabel(role.value));

function showToast(type, message) {
  toast.visible = true;
  toast.type = type;
  toast.message = message;
  setTimeout(() => (toast.visible = false), 3500);
}

function clearErrors() {
  errors.institution = "";
  errors.department = "";
  errors.level = "";
  errors.facility = "";
  errors.specialty = "";
  errors.inviteCode = "";
  errors.purpose = "";
}

function hydrateFromSavedProfile() {
  if (!user.value?.id) return;
  const saved = getProfile(user.value.id);
  if (!saved) return;

  for (const k of Object.keys(form)) {
    if (saved[k] !== undefined && saved[k] !== null) form[k] = saved[k];
  }
}

function validate() {
  clearErrors();

  const r = role.value;

  if (r === "student") {
    if (!String(form.institution).trim()) errors.institution = "Institution is required.";
    if (!String(form.level).trim()) errors.level = "Level is required.";
    if (!String(form.department).trim()) errors.department = "Department / Program is required.";
  }

  if (r === "clinician") {
    if (!String(form.facility).trim()) errors.facility = "Facility is required.";
    if (!String(form.specialty).trim()) errors.specialty = "Specialty is required.";
    if (form.verification === "invite" && !String(form.inviteCode).trim()) {
      errors.inviteCode = "Invite code is required.";
    }
  }

  if (r === "other") {
    if (!String(form.purpose).trim()) errors.purpose = "Purpose is required.";
  }

  const hasErrors = Object.values(errors).some(Boolean);
  return !hasErrors;
}

function nextPath() {
  const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/dashboard";
  return redirect || "/dashboard";
}

async function submit() {
  if (!user.value?.id) return;

  if (!validate()) {
    showToast("error", "Please fix the highlighted fields and try again.");
    return;
  }

  submitting.value = true;
  showToast("info", "Saving your setup…");

  try {
    const payload = {
      role: role.value,
      ...(role.value === "student"
        ? {
            institution: form.institution.trim(),
            department: form.department.trim(), // ✅ NEW
            level: form.level.trim(),
            posting: form.posting.trim(),
            mentorEmail: form.mentorEmail.trim(),
          }
        : role.value === "clinician"
          ? {
              facility: form.facility.trim(),
              specialty: form.specialty.trim(),
              workEmail: form.workEmail.trim(), // ✅ NEW
              verification: form.verification,
              inviteCode: form.verification === "invite" ? form.inviteCode.trim() : "",
              status: form.verification === "invite" ? "verified-mock" : "pending-mock",
            }
          : role.value === "other"
            ? {
                category: form.category,
                purpose: form.purpose.trim(),
                organisation: form.organisation.trim(), // ✅ NEW
              }
            : {
                patientContext: form.patientContext,
              }),
    };

    saveProfile(user.value.id, payload);
    setOnboardingComplete(user.value.id, true);

    setSessionUser({ ...user.value, role: role.value, onboardingComplete: true });

    showToast("success", "Setup complete. Redirecting…");
    router.replace(nextPath());
  } catch (e) {
    showToast("error", e?.message || "Could not save setup. Please try again.");
  } finally {
    submitting.value = false;
  }
}

function skip() {
  if (!user.value?.id) return;

  setOnboardingComplete(user.value.id, true);
  saveProfile(user.value.id, { role: role.value, patientContext: form.patientContext });

  setSessionUser({ ...user.value, role: role.value, onboardingComplete: true });
  router.replace(nextPath());
}

function reset() {
  for (const k of Object.keys(form)) {
    if (k === "verification") form[k] = "request";
    else if (k === "category") form[k] = "caregiver";
    else if (k === "patientContext") form[k] = "self";
    else form[k] = "";
  }
  clearErrors();
  showToast("info", "Form reset.");
}

onMounted(() => {
  user.value = getSessionUser();

  if (!user.value?.id) {
    router.replace({ name: "login", query: { redirect: "/onboarding" } });
    return;
  }

  role.value = normalizeRole(user.value.role);

  if (isOnboardingComplete(user.value.id) || user.value.onboardingComplete === true) {
    router.replace(nextPath());
    return;
  }

  hydrateFromSavedProfile();
});
</script>
