<!-- src/views/SupportView.vue -->
<template>
  <main
    class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:space-y-8 sm:pt-6 lg:pt-8"
  >
    <!-- Page header -->
    <header class="space-y-3">
      <RouterLink
        to="/dashboard"
        class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <span class="text-sm">←</span>
        <span>Back to dashboard</span>
      </RouterLink>

      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Support &amp; help
          </h1>
          <span
            class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Support centre · demo
          </span>
        </div>
        <p class="max-w-2xl text-sm text-slate-600">
          Find quick answers, check app status, or send us a support request.
          We’ll guide you step by step.
        </p>
      </div>
    </header>

    <!-- Status banner -->
    <section
      class="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-sky-50 px-4 py-3 shadow-sm ring-1 ring-emerald-100"
    >
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700 shadow-sm"
          >
            ✓
          </div>
          <div class="space-y-1">
            <p class="text-xs font-semibold text-emerald-800">
              All systems operational (demo)
            </p>
            <p class="text-[11px] text-slate-600">
              TBG Medflow is running normally. If something feels off, describe
              it below and we&apos;ll help you troubleshoot.
            </p>
          </div>
        </div>
        <div class="space-y-1 text-right text-[11px] text-slate-500">
          <p>Support hours: Mon–Fri · 9:00–17:00 (demo)</p>
          <p>Typical reply time: within 1 business day</p>
        </div>
      </div>
    </section>

    <!-- Main content grid -->
    <section
      class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]"
    >
      <!-- Left column: quick help + FAQ -->
      <section class="space-y-5">
        <!-- Quick help -->
        <article
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                How can we help today?
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Pick a topic to see where people most often need support.
              </p>
            </div>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="topic in supportTopics"
              :key="topic.key"
              class="flex h-full flex-col rounded-2xl bg-slate-50/80 p-3 text-xs ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-sky-50/60 hover:ring-sky-100"
            >
              <div
                class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-sm"
              >
                <span aria-hidden="true">
                  {{ topic.icon }}
                </span>
              </div>
              <h3 class="mt-2 text-xs font-semibold text-slate-900">
                {{ topic.title }}
              </h3>
              <p class="mt-1 text-[11px] leading-relaxed text-slate-600">
                {{ topic.description }}
              </p>
              <button
                type="button"
                class="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 underline-offset-4 hover:text-sky-800 hover:underline"
              >
                <span>{{ topic.linkLabel }}</span>
                <span aria-hidden="true">↗</span>
              </button>
            </article>
          </div>
        </article>

        <!-- FAQ accordion -->
        <article
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
        >
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Frequently asked questions
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Quick answers to common questions about TBG Medflow.
              </p>
            </div>
            <span class="hidden rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-500 sm:inline-flex">
              💡 Tip: Start here before sending a message.
            </span>
          </div>

          <div class="divide-y divide-slate-100">
            <div
              v-for="item in faqs"
              :key="item.id"
              class="py-1.5"
            >
              <button
                type="button"
                @click="toggleFaq(item.id)"
                :class="[
                  'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition',
                  openFaqId === item.id ? 'bg-sky-50 ring-1 ring-sky-100' : 'hover:bg-slate-50'
                ]"
              >
                <span class="flex items-center gap-2 font-medium text-slate-800">
                  <span
                    class="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500"
                  >
                    ?
                  </span>
                  {{ item.question }}
                </span>
                <span class="text-[11px] text-slate-500">
                  {{ openFaqId === item.id ? "−" : "+" }}
                </span>
              </button>
              <div
                v-if="openFaqId === item.id"
                class="px-3 pb-3 text-[11px] leading-relaxed text-slate-600"
              >
                {{ item.answer }}
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Right column: contact form -->
      <aside class="space-y-4">
        <article
          class="rounded-2xl bg-slate-900 p-4 text-slate-50 shadow-sm sm:p-5"
        >
          <!-- Toast -->
          <div
            v-if="toast.visible"
            class="mb-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100 ring-1 ring-emerald-400/60"
          >
            {{ toast.message }}
          </div>

          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold">
                Send us a support request
              </h2>
              <p class="mt-1 text-[11px] text-slate-200">
                Tell us what&apos;s happening and we&apos;ll get back to you
                (demo only).
              </p>
            </div>
            <span
              class="hidden rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-200 sm:inline-flex"
            >
              🔒 Demo form – no real data
            </span>
          </div>

          <form class="mt-3 space-y-3" @submit.prevent="handleSubmit">
            <!-- Name -->
            <div>
              <label class="text-[11px] font-medium" for="support-name">
                Name
                <span class="text-red-400">*</span>
              </label>
              <input
                id="support-name"
                v-model="form.name"
                type="text"
                class="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none ring-slate-700 placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                placeholder="Your full name"
              />
              <p
                v-if="formErrors.name"
                class="mt-1 text-[10px] text-red-400"
              >
                {{ formErrors.name }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="text-[11px] font-medium" for="support-email">
                Email
                <span class="text-red-400">*</span>
              </label>
              <input
                id="support-email"
                v-model="form.email"
                type="email"
                class="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none ring-slate-700 placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                placeholder="you@example.com"
              />
              <p
                v-if="formErrors.email"
                class="mt-1 text-[10px] text-red-400"
              >
                {{ formErrors.email }}
              </p>
            </div>

            <!-- Role + Topic -->
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label class="text-[11px] font-medium" for="support-role">
                  Your role
                </label>
                <select
                  id="support-role"
                  v-model="form.role"
                  class="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none ring-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                >
                  <option value="patient">Patient / family</option>
                  <option value="student">Student nurse</option>
                  <option value="clinician">Clinician</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="text-[11px] font-medium" for="support-topic">
                  Topic
                </label>
                <select
                  id="support-topic"
                  v-model="form.topic"
                  class="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none ring-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                >
                  <option value="">Select a topic (optional)</option>
                  <option
                    v-for="t in topics"
                    :key="t"
                    :value="t"
                  >
                    {{ t }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Message -->
            <div>
              <label class="text-[11px] font-medium" for="support-message">
                Message
                <span class="text-red-400">*</span>
              </label>
              <textarea
                id="support-message"
                v-model="form.message"
                rows="4"
                class="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none ring-slate-700 placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/60"
                placeholder="Tell us what you were trying to do, what went wrong, and anything that might help us understand."
              ></textarea>
              <p
                v-if="formErrors.message"
                class="mt-1 text-[10px] text-red-400"
              >
                {{ formErrors.message }}
              </p>
            </div>

            <!-- Agree checkbox -->
            <div>
              <label
                class="flex items-start gap-2 text-[11px] text-slate-200"
              >
                <input
                  v-model="form.agree"
                  type="checkbox"
                  class="mt-[2px] h-3.5 w-3.5 rounded border-slate-500 text-sky-500 focus:ring-sky-500"
                />
                <span>
                  I understand this demo is not a replacement for emergency
                  medical services.
                </span>
              </label>
              <p
                v-if="formErrors.agree"
                class="mt-1 text-[10px] text-red-400"
              >
                {{ formErrors.agree }}
              </p>
            </div>

            <!-- Submit -->
            <div class="pt-1">
              <button
                type="submit"
                :disabled="sending"
                class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/30 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="!sending">Send message</span>
                <span v-else>Sending…</span>
              </button>
              <p class="mt-2 text-[10px] text-slate-400">
                Or email us at
                <span class="font-medium">
                  support@tbg-medflow.test
                </span>
                (demo).
              </p>
            </div>
          </form>
        </article>
      </aside>
    </section>

    <!-- Extra resources -->
    <section class="space-y-3">
      <div>
        <h2 class="text-sm font-semibold text-slate-900">
          Resources for you
        </h2>
        <p class="mt-1 text-xs text-slate-600">
          Short guides for different types of users (concept only in this demo).
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <article
          v-for="item in resources"
          :key="item.title"
          class="rounded-2xl bg-white p-4 text-[11px] shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          <h3 class="text-xs font-semibold text-slate-900">
            {{ item.title }}
          </h3>
          <p class="mt-1 leading-relaxed text-slate-600">
            {{ item.text }}
          </p>
          <p class="mt-2 text-[10px] text-slate-400">
            View guide (coming soon)
          </p>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from "vue";
import { RouterLink } from "vue-router";

const supportTopics = [
  {
    key: "getting-started",
    icon: "🌱",
    title: "Getting started",
    description:
      "Learn how to log vitals, review your records and understand the basics.",
    linkLabel: "View quick start tips",
  },
  {
    key: "account-access",
    icon: "🔐",
    title: "Account & access",
    description:
      "Problems signing in, switching devices or resetting your account?",
    linkLabel: "Check account help",
  },
  {
    key: "technical-issues",
    icon: "🛠️",
    title: "Technical issues",
    description:
      "Something not loading, values not saving, or the app feels slow?",
    linkLabel: "Troubleshoot issues",
  },
];

const faqs = [
  {
    id: 1,
    question: "How do I add a new health record?",
    answer:
      "Go to the Dashboard and click 'Add health record'. Fill in your date, time and any vitals you measured, then save. You can always come back to edit later (in a full version).",
  },
  {
    id: 2,
    question: "Is my health data stored securely?",
    answer:
      "In a real deployment, your data would be encrypted in transit and at rest. This demo does not store real patient data and should not be used for urgent care decisions.",
  },
  {
    id: 3,
    question: "Can student nurses use TBG Medflow for practice?",
    answer:
      "Yes. TBG Medflow is designed with students in mind, so you can practice logging vitals and reviewing trends as part of your learning.",
  },
  {
    id: 4,
    question: "What should I do if the app feels slow or broken?",
    answer:
      "First, refresh the page and check your internet connection. If it keeps happening, send us a support request with a screenshot and what you were trying to do.",
  },
];

const openFaqId = ref(faqs[0]?.id ?? null);

const toggleFaq = (id) => {
  openFaqId.value = openFaqId.value === id ? null : id;
};

const form = reactive({
  name: "",
  email: "",
  role: "patient",
  topic: "",
  message: "",
  agree: false,
});

const sending = ref(false);

const formErrors = reactive({
  name: "",
  email: "",
  message: "",
  agree: "",
});

const toast = reactive({
  visible: false,
  type: "success",
  message: "",
});

const topics = [
  "Getting started",
  "Account / login issue",
  "Can’t see my records",
  "Something is not working",
  "Feature idea",
  "Other",
];

const resources = [
  {
    title: "For patients & families",
    text: "Tips on logging your vitals, understanding trends and bringing them to appointments.",
  },
  {
    title: "For student nurses",
    text: "Use TBG Medflow as a practice tool to document vitals and reflect on case studies.",
  },
  {
    title: "For clinicians",
    text: "See how a structured health record tracker can support better, data-informed decisions.",
  },
];

const clearFormErrors = () => {
  formErrors.name = "";
  formErrors.email = "";
  formErrors.message = "";
  formErrors.agree = "";
};

const handleSubmit = () => {
  clearFormErrors();
  toast.visible = false;

  let hasError = false;

  if (!form.name.trim()) {
    formErrors.name = "Please enter your name.";
    hasError = true;
  }

  if (!form.email.trim()) {
    formErrors.email = "Please enter your email.";
    hasError = true;
  } else if (!form.email.includes("@")) {
    formErrors.email = "Please enter a valid email address.";
    hasError = true;
  }

  if (!form.message.trim()) {
    formErrors.message = "Please tell us a bit about what you need help with.";
    hasError = true;
  } else if (form.message.trim().length < 10) {
    formErrors.message =
      "Your message is a bit short. Add a few more details so we can help.";
    hasError = true;
  }

  if (!form.agree) {
    formErrors.agree =
      "Please confirm that you understand this is not emergency medical support.";
    hasError = true;
  }

  if (hasError) return;

  sending.value = true;

  setTimeout(() => {
    sending.value = false;
    toast.type = "success";
    toast.message =
      "Message sent (demo only). We’ll respond as soon as we can.";
    toast.visible = true;

    // Partial reset (keep name & email for convenience)
    form.topic = "";
    form.message = "";
    form.agree = false;

    setTimeout(() => {
      toast.visible = false;
    }, 4000);
  }, 800);
};
</script>
