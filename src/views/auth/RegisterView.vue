<!-- src/views/auth/RegisterView.vue -->
<template>
  <main
    class="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-4 pb-10 pt-4 sm:pt-6 lg:pt-10"
  >
    <section
      class="grid w-full max-w-4xl gap-6 rounded-3xl bg-white/85 p-4 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100/80 backdrop-blur-sm sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:p-8"
    >
      <!-- Left: brand / story -->
      <section
        class="flex flex-col justify-between border-b border-slate-100 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6"
      >
        <div>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-2 text-[11px] font-medium text-slate-600 hover:text-slate-900"
          >
            <span class="text-sm">←</span>
            <span>Back to login</span>
          </RouterLink>

          <!-- Logo + label -->
          <div class="mt-5 flex items-center gap-3">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-100"
            >
              <img
                :src="logoMark"
                alt="TBG Medflow icon"
                class="h-6 w-6"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <img
                  :src="logoFull"
                  alt="TBG Medflow logo"
                  class="h-6 w-auto sm:h-7"
                />
                <span
                  class="hidden text-xs font-semibold tracking-tight text-slate-900 sm:inline-block"
                >
                  TBG Medflow
                </span>
              </div>
              <p class="mt-1 text-[10px] text-slate-500">
                Smart health record tracker
              </p>
            </div>
          </div>

          <!-- Copy -->
          <h1
            class="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Create your demo workspace.
          </h1>
          <p
            class="mt-2 text-[11px] leading-relaxed text-slate-600 sm:text-xs"
          >
            Set up a simple account so you can log vitals, review your records
            and practise calm documentation — without touching real hospital
            systems.
          </p>

          <ul class="mt-4 space-y-1.5 text-[11px] text-slate-600">
            <li class="flex items-start gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>A demo dashboard with today&apos;s vitals overview.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                A place to practise recording blood pressure, heart rate,
                temperature and blood sugar.
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>
                Support pages built for patients, student nurses and clinicians.
              </span>
            </li>
          </ul>

          <div
            class="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 ring-1 ring-emerald-100"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Practice mode · No real patient data</span>
          </div>
        </div>

        <p class="mt-6 text-[11px] text-slate-500">
          Curious about how it works? Read more on the
          <RouterLink
            to="/about"
            class="font-medium text-sky-700 hover:text-sky-800"
          >
            About
          </RouterLink>
          page or visit
          <RouterLink
            to="/support"
            class="font-medium text-sky-700 hover:text-sky-800"
          >
            Support &amp; help
          </RouterLink>
          .
        </p>
      </section>

      <!-- Right: register form -->
      <section class="pt-2 lg:pt-0">
        <div
          class="rounded-2xl bg-slate-50/90 p-4 shadow-inner ring-1 ring-slate-100 sm:p-5 lg:p-6"
        >
          <!-- Toast -->
          <div
            v-if="toast.visible"
            class="mb-3 flex items-start gap-2 rounded-xl px-3 py-2 text-[11px]"
            :class="{
              'bg-sky-50 text-sky-800 ring-1 ring-sky-100':
                toast.type === 'info',
              'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100':
                toast.type === 'success',
              'bg-red-50 text-red-800 ring-1 ring-red-100':
                toast.type === 'error',
            }"
          >
            <span v-if="toast.type === 'info'">💬</span>
            <span v-else-if="toast.type === 'success'">✅</span>
            <span v-else>⚠️</span>
            <p class="leading-snug">
              {{ toast.message }}
            </p>
          </div>

          <!-- Heading -->
          <header class="space-y-1.5">
            <p
              class="text-[11px] font-medium uppercase tracking-wide text-slate-500"
            >
              Create your account
            </p>
            <h2 class="text-lg font-semibold text-slate-900">
              Sign up for TBG Medflow
            </h2>
            <p class="text-[11px] text-slate-600">
              Just a few details to get started. This is a demo, not a real
              hospital login.
            </p>
          </header>

          <!-- Form -->
          <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
            <!-- Full name + role -->
            <div class="grid gap-3 sm:grid-cols-2">
              <!-- Full name -->
              <div class="space-y-1">
                <label
                  for="fullName"
                  class="text-[11px] font-medium text-slate-700"
                >
                  Full name
                  <span class="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  autocomplete="name"
                  class="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="E.g. Adeola B. Thomas"
                />
                <p
                  v-if="errors.fullName"
                  class="mt-1 text-[10px] text-red-500"
                >
                  {{ errors.fullName }}
                </p>
              </div>

              <!-- Role -->
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-slate-700">
                  I&apos;m signing up as
                </label>
                <select
                  v-model="form.role"
                  class="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="patient">Patient / family</option>
                  <option value="student">Student nurse</option>
                  <option value="clinician">Clinician / mentor</option>
                  <option value="other">Other</option>
                </select>
                <p class="mt-1 text-[10px] text-slate-500">
                  This helps tailor the experience in a full version.
                </p>
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label
                for="email"
                class="text-[11px] font-medium text-slate-700"
              >
                Email address
                <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="you@example.com"
              />
              <p
                v-if="errors.email"
                class="mt-1 text-[10px] text-red-500"
              >
                {{ errors.email }}
              </p>
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label
                for="password"
                class="text-[11px] font-medium text-slate-700"
              >
                Password
                <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-0.5 flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
              >
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full border-none bg-transparent py-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  class="ml-2 text-[10px] font-medium text-slate-500 hover:text-slate-700"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? "Hide" : "Show" }}
                </button>
              </div>
              <p
                v-if="errors.password"
                class="mt-1 text-[10px] text-red-500"
              >
                {{ errors.password }}
              </p>

              <!-- Password strength -->
              <p
                class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                :class="{
                  'bg-red-50 text-red-600': passwordStrength === 'weak',
                  'bg-amber-50 text-amber-700': passwordStrength === 'medium',
                  'bg-emerald-50 text-emerald-700': passwordStrength === 'strong',
                }"
              >
                <span class="font-medium">Password strength:</span>
                <span class="capitalize">{{ passwordStrength }}</span>
              </p>
            </div>

            <!-- Confirm password -->
            <div class="space-y-1">
              <label
                for="confirmPassword"
                class="text-[11px] font-medium text-slate-700"
              >
                Confirm password
                <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-0.5 flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
              >
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  class="w-full border-none bg-transparent py-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  class="ml-2 text-[10px] font-medium text-slate-500 hover:text-slate-700"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? "Hide" : "Show" }}
                </button>
              </div>
              <p
                v-if="errors.confirmPassword"
                class="mt-1 text-[10px] text-red-500"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Terms / demo acknowledgement -->
            <div class="space-y-1 pt-1">
              <label
                class="flex items-start gap-2 text-[11px] text-slate-700"
              >
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>
                  I understand this is a
                  <span class="font-medium">demo environment</span> and should
                  not replace emergency medical care or real hospital systems.
                </span>
              </label>
              <p
                v-if="errors.acceptTerms"
                class="mt-1 text-[10px] text-red-500"
              >
                {{ errors.acceptTerms }}
              </p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/30 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="!isSubmitting">Create account</span>
              <span v-else>Creating your workspace…</span>
            </button>

            <!-- Guest / demo shortcut -->
            <button
              type="button"
              @click="continueAsGuest"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-700 hover:border-sky-400 hover:bg-white hover:text-sky-700"
            >
              <span>Skip for now · Continue as guest (demo)</span>
            </button>

            <!-- Secondary text -->
            <p class="mt-3 text-center text-[11px] text-slate-600">
              Already have an account?
              <RouterLink
                to="/login"
                class="font-medium text-sky-700 hover:text-sky-800"
              >
                Log in
              </RouterLink>
              .
            </p>

            <p class="mt-1 text-center text-[10px] text-slate-500">
              Please avoid using real patient names, IDs or sensitive
              information in this demo.
            </p>
          </form>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
// NOTE: RegisterView.vue is in src/views/auth, so we need ../../ to reach src
import logoFull from "../../assets/tbg-medflow-logo-compressed.png";
import logoMark from "../../assets/tbg-medflow-logo-mark.svg";

const router = useRouter();

const form = reactive({
  fullName: "",
  email: "",
  role: "patient", // 'patient' | 'student' | 'clinician' | 'other'
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const errors = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: "",
});

const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const toast = reactive({
  visible: true,
  type: "info",
  message:
    "Create a demo account with any email. Please don’t use real patient identifiers.",
});

const passwordStrength = computed(() => {
  const value = form.password || "";
  if (!value) return "weak";

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score >= 3) return "strong";
  if (score >= 2) return "medium";
  return "weak";
});

const showToast = (type, message) => {
  toast.visible = true;
  toast.type = type;
  toast.message = message;
  setTimeout(() => {
    toast.visible = false;
  }, 4000);
};

const validate = () => {
  errors.fullName = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";
  errors.acceptTerms = "";

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!form.email) {
    errors.email = "Email is required.";
  } else if (!form.email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password should be at least 6 characters.";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!form.acceptTerms) {
    errors.acceptTerms =
      "Please confirm you understand the demo disclaimer.";
  }

  return (
    !errors.fullName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.acceptTerms
  );
};

const handleSubmit = () => {
  if (!validate()) {
    showToast("error", "Please fix the highlighted fields and try again.");
    return;
  }

  isSubmitting.value = true;
  showToast("info", "Creating your demo workspace…");

  // Simulate async signup
  setTimeout(() => {
    isSubmitting.value = false;
    showToast(
      "success",
      "Account created (demo). Redirecting to your dashboard…",
    );

    // In a real app you would persist tokens/session here
    router.push("/dashboard");
  }, 1000);
};

const continueAsGuest = () => {
  showToast("info", "Continuing as guest (demo only)...");
  router.push("/dashboard");
};
</script>
