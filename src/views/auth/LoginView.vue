<!-- src/views/auth/LoginView.vue -->
<template>
  <main
    class="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-4 pb-10 pt-4 sm:pt-6 lg:pt-10"
  >
    <section
      class="grid w-full max-w-4xl gap-6 rounded-3xl bg-white/80 p-4 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100/80 backdrop-blur-sm sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:p-8"
    >
      <!-- Left: brand / intro -->
      <section class="flex flex-col justify-between border-b border-slate-100 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
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

          <!-- Hero text -->
          <h1
            class="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Welcome back.
          </h1>
          <p
            class="mt-2 text-[11px] leading-relaxed text-slate-600 sm:text-xs"
          >
            Log in to view your demo dashboard, review recent health records and
            keep practising calm documentation — whether you&apos;re a patient,
            student nurse or clinician.
          </p>

          <!-- Benefits -->
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
              <span>Practise logging records in a safe demo space.</span>
            </li>
          </ul>

          <!-- Demo badge -->
          <div
            class="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] text-sky-700 ring-1 ring-sky-100"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Demo environment · Not real medical login</span>
          </div>
        </div>

        <p class="mt-6 text-[11px] text-slate-500">
          Need help? Visit
          <RouterLink
            to="/support"
            class="font-medium text-sky-700 hover:text-sky-800"
          >
            Support &amp; help
          </RouterLink>
          .
        </p>
      </section>

      <!-- Right: login form -->
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
              Sign in to continue
            </p>
            <h2 class="text-lg font-semibold text-slate-900">
              Log in to your workspace
            </h2>
            <p class="text-[11px] text-slate-600">
              This is a demo login — please don&apos;t use real patient
              information.
            </p>
          </header>

          <!-- Form -->
          <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
            <!-- Role -->
            <div class="space-y-1">
              <label class="text-[11px] font-medium text-slate-700">
                I&apos;m signing in as
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
              <p
                v-if="errors.password"
                class="mt-1 text-[10px] text-red-500"
              >
                {{ errors.password }}
              </p>
            </div>

            <!-- Remember + forgot -->
            <div class="flex items-center justify-between gap-3 pt-1">
              <label
                class="inline-flex items-center gap-2 text-[11px] text-slate-700"
              >
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  class="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Remember this device</span>
              </label>

              <RouterLink
                to="/support"
                class="text-[11px] font-medium text-sky-700 hover:text-sky-800"
              >
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

            <!-- Guest/demo shortcut -->
            <button
              type="button"
              @click="continueAsGuest"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-700 hover:border-sky-400 hover:bg-white hover:text-sky-700"
            >
              <span>Continue as guest (demo)</span>
            </button>

            <!-- Extra links -->
            <p class="mt-3 text-center text-[11px] text-slate-600">
              Don&apos;t have an account yet?
              <RouterLink
                to="/register"
                class="font-medium text-sky-700 hover:text-sky-800"
              >
                Create a demo account
              </RouterLink>
              .
            </p>

            <p class="mt-1 text-center text-[10px] text-slate-500">
              This is a demo environment — please do not store real patient
              identifiers.
            </p>
          </form>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
// LoginView.vue is in src/views/auth, so we need ../../ to reach src
import logoFull from "../../assets/tbg-medflow-logo-compressed.png";
import logoMark from "../../assets/tbg-medflow-logo-mark.svg";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
  role: "patient", // 'patient' | 'student' | 'clinician' | 'other'
  rememberMe: false,
});

const errors = reactive({
  email: "",
  password: "",
});

const isSubmitting = ref(false);
const showPassword = ref(false);

const toast = reactive({
  visible: true,
  type: "info",
  message:
    "Use any email and password to explore the demo. This does not sign you in to real medical systems.",
});

const validate = () => {
  errors.email = "";
  errors.password = "";

  if (!form.email) {
    errors.email = "Email is required.";
  } else if (!form.email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password should be at least 6 characters long.";
  }

  return !errors.email && !errors.password;
};

const showToast = (type, message) => {
  toast.visible = true;
  toast.type = type;
  toast.message = message;
  setTimeout(() => {
    toast.visible = false;
  }, 4000);
};

const handleSubmit = () => {
  if (!validate()) {
    showToast("error", "Please fix the highlighted fields and try again.");
    return;
  }

  isSubmitting.value = true;
  showToast("info", "Checking your details (demo only)…");

  // Simulate async login
  setTimeout(() => {
    isSubmitting.value = false;
    showToast(
      "success",
      "Signed in successfully (demo). Redirecting to dashboard…",
    );

    // In a real app, tokens / session would be persisted here.
    router.push("/dashboard");
  }, 900);
};

const continueAsGuest = () => {
  showToast("info", "Continuing as guest (demo only)...");
  router.push("/dashboard");
};
</script>
