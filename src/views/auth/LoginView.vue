<!-- src/views/auth/LoginView.vue -->
<template>
  <main
    class="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-4 pb-10 pt-4 sm:pt-6 lg:pt-10"
  >
    <section
      class="grid w-full max-w-4xl gap-6 rounded-3xl bg-white/80 p-4 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100/80 backdrop-blur-sm sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:p-8"
    >
      <!-- Left: brand / intro -->
      <section
        class="flex flex-col justify-between border-b border-slate-100 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6"
      >
        <div>
          <RouterLink
            to="/"
            class="inline-flex items-center gap-2 text-[11px] font-medium text-slate-600 hover:text-slate-900"
          >
            <span class="text-sm">←</span>
            <span>Back to home</span>
          </RouterLink>

          <!-- Logo + label -->
          <div class="mt-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
              <img :src="logoMark" alt="TBG Medflow icon" class="h-6 w-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <img :src="logoFull" alt="TBG Medflow logo" class="h-6 w-auto sm:h-7" />
                <span class="hidden text-xs font-semibold tracking-tight text-slate-900 sm:inline-block">
                  TBG Medflow
                </span>
              </div>
              <p class="mt-1 text-[10px] text-slate-500">Smart health record tracker</p>
            </div>
          </div>

          <h1 class="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back.
          </h1>
          <p class="mt-2 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            Log in to view your workspace and continue documentation — whether you&apos;re a patient, student nurse
            or clinician.
          </p>

          <ul class="mt-4 space-y-1.5 text-[11px] text-slate-600">
            <li class="flex items-start gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>See today&apos;s vitals at a glance.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Review previous readings and simple trends.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Stay organised in a focused workspace.</span>
            </li>
          </ul>
        </div>

        <p class="mt-6 text-[11px] text-slate-500">
          Need help? Visit
          <RouterLink to="/support" class="font-medium text-sky-700 hover:text-sky-800">
            Support &amp; help
          </RouterLink>
          .
        </p>
      </section>

      <!-- Right: login form -->
      <section class="pt-2 lg:pt-0">
        <div class="rounded-2xl bg-slate-50/90 p-4 shadow-inner ring-1 ring-slate-100 sm:p-5 lg:p-6">
          <!-- Toast -->
          <div
            v-if="toast.visible"
            class="mb-3 flex items-start gap-2 rounded-xl px-3 py-2 text-[11px]"
            :class="{
              'bg-sky-50 text-sky-800 ring-1 ring-sky-100': toast.type === 'info',
              'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100': toast.type === 'success',
              'bg-red-50 text-red-800 ring-1 ring-red-100': toast.type === 'error',
            }"
          >
            <span v-if="toast.type === 'info'">💬</span>
            <span v-else-if="toast.type === 'success'">✅</span>
            <span v-else>⚠️</span>
            <p class="leading-snug">{{ toast.message }}</p>
          </div>

          <header class="space-y-1.5">
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">Sign in to continue</p>
            <h2 class="text-lg font-semibold text-slate-900">Log in to your workspace</h2>
            <p class="text-[11px] text-slate-600">
              Use your registered email and password to access your TBG Medflow workspace.
            </p>
          </header>

          <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
            <!-- Role (UI preference only) -->
            <div class="space-y-1">
              <label class="text-[11px] font-medium text-slate-700">
                I&apos;m signing in as <span class="text-slate-400">(optional)</span>
              </label>
              <select
                v-model="form.roleHint"
                class="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="patient">Patient / family</option>
                <option value="student">Student nurse</option>
                <option value="clinician">Clinician / mentor</option>
                <option value="other">Other</option>
              </select>
              <p class="mt-1 text-[10px] text-slate-500">
                This only tailors the UI — your actual access is based on your account after sign-in.
              </p>
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label for="email" class="text-[11px] font-medium text-slate-700">
                Email address <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="you@example.com"
              />
              <p v-if="errors.email" class="mt-1 text-[10px] text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label for="password" class="text-[11px] font-medium text-slate-700">
                Password <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-0.5 flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
              >
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  class="w-full border-none bg-transparent py-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  class="ml-2 text-[10px] font-medium text-slate-500 hover:text-slate-700"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? "Hide" : "Show" }}
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-[10px] text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Remember + forgot -->
            <div class="flex items-center justify-between gap-3 pt-1">
              <label class="inline-flex items-center gap-2 text-[11px] text-slate-700">
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  class="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Remember this device</span>
              </label>

              <RouterLink to="/support" class="text-[11px] font-medium text-sky-700 hover:text-sky-800">
                Forgot password?
              </RouterLink>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/30 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="!isSubmitting">Log in</span>
              <span v-else>Signing in…</span>
            </button>

            <p class="mt-3 text-center text-[11px] text-slate-600">
              Don&apos;t have an account yet?
              <RouterLink to="/register" class="font-medium text-sky-700 hover:text-sky-800">
                Create an account
              </RouterLink>
              .
            </p>

            <p class="mt-1 text-center text-[10px] text-slate-500">
              TBG Medflow does not replace emergency medical care. Always follow your facility&apos;s
              protocols and privacy policies.
            </p>
          </form>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

import logoFull from "../../assets/tbg-medflow-logo-compressed.png";
import logoMark from "../../assets/tbg-medflow-logo-mark.svg";

import { apiPost } from "../../utils/apiClient";
import { setSessionUser, setSessionToken } from "../../utils/session";

const router = useRouter();
const route = useRoute();

const form = reactive({
  email: "",
  password: "",
  roleHint: "patient", // UI only (never used for auth/role assignment)
  rememberMe: false,
});

const errors = reactive({ email: "", password: "" });
const isSubmitting = ref(false);
const showPassword = ref(false);

const toast = reactive({
  visible: true,
  type: "info",
  message: "Use the email and password you registered with to sign in.",
});

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

const validate = () => {
  errors.email = "";
  errors.password = "";

  if (!form.email) errors.email = "Email is required.";
  else if (!form.email.includes("@")) errors.email = "Please enter a valid email address.";

  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 6) errors.password = "Password should be at least 6 characters long.";

  return !errors.email && !errors.password;
};

const showToast = (type, message) => {
  toast.visible = true;
  toast.type = type;
  toast.message = message;
  setTimeout(() => (toast.visible = false), 3500);
};

const handleSubmit = async () => {
  if (!validate()) {
    showToast("error", "Please fix the highlighted fields and try again.");
    return;
  }

  isSubmitting.value = true;
  showToast("info", "Checking your details…");

  try {
    // ✅ Do NOT send role to backend for auth (prevents role mismatch/spoofing)
    const data = await apiPost("login.php", {
      email: form.email,
      password: form.password,
    });

    if (!data?.user?.id) throw new Error("Login succeeded but user data is missing.");

    // ✅ Session source of truth (router guard relies on this)
    const user = { ...data.user };

    // ✅ IMPORTANT: role must come from account/backend
    // If backend does not return a role yet, default to "patient" (safe) and warn.
    if (!user.role) {
      user.role = "patient";
      showToast(
        "info",
        "Signed in, but your account role wasn’t returned by the server. Defaulting to Patient. (Fix: include role in login response.)"
      );
    }

    setSessionUser(user);
    if (data.token) setSessionToken(data.token, data.expiresAt);

    // Save UI hint (optional; UI-only preference)
    try {
      localStorage.setItem("medflowRoleHint", String(form.roleHint || "patient"));
    } catch {
      // ignore
    }

    // Remember me preference (optional)
    if (form.rememberMe) localStorage.setItem("medflowRememberMe", "1");
    else localStorage.removeItem("medflowRememberMe");

    // If we already showed a warning toast above, don't overwrite instantly.
    // Otherwise, show success toast.
    if (toast.type !== "info" || !toast.message.includes("Defaulting to Patient")) {
      showToast("success", "Signed in successfully. Redirecting…");
    }

    const intended = typeof route.query.redirect === "string" ? route.query.redirect : "/dashboard";

    // If not onboarded yet, go onboarding first and preserve the intended destination
    if (!isOnboardingComplete(user)) {
      router.replace({ name: "onboarding", query: { redirect: intended } });
      return;
    }

    router.replace(intended);
  } catch (err) {
    showToast("error", err?.message || "Login failed. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
