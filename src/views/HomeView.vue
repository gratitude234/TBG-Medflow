<!-- src/views/HomeView.vue -->
<template>
  <div
    class="mx-auto max-w-6xl px-4 space-y-12 pb-10 pt-4 sm:space-y-14 sm:pt-6 lg:space-y-16 lg:pt-8"
  >
    <!-- Hero -->
    <section
      aria-labelledby="hero-heading"
      class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center"
    >
      <!-- Left column: text -->
      <div class="space-y-5 sm:space-y-6">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
        >
          <span class="flex h-1.5 w-1.5 items-center justify-center">
            <span
              class="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
            ></span>
          </span>
          Smart health record tracker
          <span
            class="hidden rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 sm:inline-flex"
          >
            Live demo
          </span>
        </p>

        <div>
          <h1
            id="hero-heading"
            class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Smarter records,
            <span class="text-sky-700">better care.</span>
          </h1>
          <p
            class="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base"
          >
            Track blood pressure, heart rate, temperature and blood sugar in one
            simple workspace — made for patients, student nurses and clinicians.
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <RouterLink
              to="/register"
              class="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
            >
              Start tracking
              <span aria-hidden="true" class="ml-1.5 text-[13px]">→</span>
            </RouterLink>
            <RouterLink
              to="/login"
              class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500/80 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
            >
              Log in
            </RouterLink>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span class="inline-flex items-center gap-1">
              <span class="h-1 w-1 rounded-full bg-emerald-500"></span>
              Secure by design
            </span>
            <span class="hidden h-0.5 w-4 rounded-full bg-slate-200 sm:inline" />
            <span>Easy to use</span>
            <span class="hidden h-0.5 w-4 rounded-full bg-slate-200 sm:inline" />
            <span>Works on any device</span>
          </div>
        </div>
      </div>

      <!-- Right column: dashboard preview card -->
      <div class="relative lg:justify-self-end">
        <!-- floating badge -->
        <div
          class="pointer-events-none absolute -top-4 right-2 hidden items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-100 sm:flex"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Sample dashboard
        </div>

        <div
          class="relative mx-auto w-full max-w-md rounded-2xl bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50 p-4 shadow-lg shadow-sky-100/70 ring-1 ring-sky-100/80"
        >
          <!-- Window controls -->
          <div class="mb-3 flex items-center justify-between gap-2 text-[10px]">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-rose-300"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-300"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
            </div>
            <p class="rounded-full bg-white/70 px-2 py-0.5 text-[10px] text-slate-500">
              TBG Medflow · Demo
            </p>
          </div>

          <!-- Top bar -->
          <div class="mb-4 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-100"
              >
                Today’s vitals
              </span>
              <span
                class="hidden items-center gap-1 rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:inline-flex"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Stable · ✓
              </span>
            </div>
            <p class="text-[10px] text-slate-500">
              08:30 · Auto-synced
            </p>
          </div>

          <!-- Vitals cards -->
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              class="flex flex-col rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100"
            >
              <p class="text-[11px] font-medium text-slate-500">
                Blood pressure
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                120/80
                <span class="text-[11px] font-normal text-slate-500">
                  mmHg
                </span>
              </p>
              <p class="mt-1 text-[10px] text-emerald-600">
                • Within target range
              </p>
            </div>

            <div
              class="flex flex-col rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100"
            >
              <p class="text-[11px] font-medium text-slate-500">
                Heart rate
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                76
                <span class="text-[11px] font-normal text-slate-500">
                  bpm
                </span>
              </p>
              <p class="mt-1 text-[10px] text-emerald-600">
                • Calm & resting
              </p>
            </div>

            <div
              class="flex flex-col rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100"
            >
              <p class="text-[11px] font-medium text-slate-500">
                Temperature
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                36.8
                <span class="text-[11px] font-normal text-slate-500">
                  °C
                </span>
              </p>
              <p class="mt-1 text-[10px] text-slate-500">
                • No fever detected
              </p>
            </div>

            <div
              class="flex flex-col rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100"
            >
              <p class="text-[11px] font-medium text-slate-500">
                Blood sugar
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                98
                <span class="text-[11px] font-normal text-slate-500">
                  mg/dL
                </span>
              </p>
              <p class="mt-1 text-[10px] text-emerald-600">
                • Fasting level
              </p>
            </div>
          </div>

          <!-- Trend chart placeholder -->
          <div
            class="mt-4 h-24 rounded-xl bg-white/70 p-3 ring-1 ring-dashed ring-slate-200"
          >
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-medium text-slate-600">
                7-day trend
              </span>
              <span class="text-slate-400">
                BP · HR · Temp
              </span>
            </div>
            <div class="mt-2 flex h-12 items-end gap-1.5">
              <span class="flex-1 rounded-t bg-sky-200/80" style="height: 35%"></span>
              <span class="flex-1 rounded-t bg-sky-300/90" style="height: 65%"></span>
              <span class="flex-1 rounded-t bg-emerald-200/90" style="height: 45%"></span>
              <span class="flex-1 rounded-t bg-sky-200/80" style="height: 55%"></span>
              <span class="flex-1 rounded-t bg-emerald-300/90" style="height: 75%"></span>
              <span class="flex-1 rounded-t bg-sky-200/80" style="height: 50%"></span>
              <span class="flex-1 rounded-t bg-emerald-200/90" style="height: 60%"></span>
            </div>
          </div>

          <p class="mt-3 text-center text-[10px] text-slate-500">
            Demo preview · Not real medical data
          </p>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <section aria-label="Usage highlights">
      <div
        class="flex gap-3 overflow-x-auto rounded-2xl bg-white/80 px-3 py-3 text-[11px] text-slate-600 shadow-sm ring-1 ring-slate-100 sm:justify-between sm:px-4"
      >
        <div
          v-for="item in metrics"
          :key="item.label"
          class="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 shadow-sm ring-1 ring-slate-100"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span class="whitespace-nowrap font-medium">
            {{ item.label }}
          </span>
        </div>
      </div>
    </section>

    <!-- Features: Why TBG Medflow? -->
    <section aria-labelledby="why-heading" class="space-y-4">
      <div class="max-w-xl space-y-1.5">
        <h2
          id="why-heading"
          class="text-lg font-semibold text-slate-900 sm:text-xl"
        >
          Why TBG Medflow?
        </h2>
        <p class="text-sm text-slate-600">
          A calm workspace for keeping your health records in one place.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="feature in featureCards"
          :key="feature.title"
          class="flex h-full flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-sky-100 sm:p-5"
        >
          <div
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-base"
          >
            <span aria-hidden="true">{{ feature.icon }}</span>
          </div>
          <h3 class="mt-3 text-sm font-semibold text-slate-900">
            {{ feature.title }}
          </h3>
          <p
            class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]"
          >
            {{ feature.text }}
          </p>
        </article>
      </div>
    </section>

    <!-- How it works -->
    <section aria-labelledby="how-heading" class="space-y-4">
      <div class="max-w-xl space-y-1.5">
        <h2
          id="how-heading"
          class="text-lg font-semibold text-slate-900 sm:text-xl"
        >
          How it works
        </h2>
        <p class="text-sm text-slate-600">
          Get up and running in a few simple steps — no technical skills
          required.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="item in steps"
          :key="item.step"
          class="flex h-full flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-sky-100 sm:p-5"
        >
          <p
            class="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-50"
          >
            {{ item.step }}
          </p>
          <h3 class="mt-3 text-sm font-semibold text-slate-900">
            {{ item.title }}
          </h3>
          <p
            class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]"
          >
            {{ item.text }}
          </p>
        </article>
      </div>
    </section>

    <!-- Who it's for -->
    <section aria-labelledby="who-heading" class="space-y-4">
      <div class="max-w-xl space-y-1.5">
        <h2
          id="who-heading"
          class="text-lg font-semibold text-slate-900 sm:text-xl"
        >
          Built for real people
        </h2>
        <p class="text-sm text-slate-600">
          TBG Medflow is designed to support everyday patients, learners and
          clinicians working together.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="audience in audiences"
          :key="audience.title"
          class="h-full rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-sky-100 hover:bg-white hover:shadow-md sm:p-5"
        >
          <div class="flex items-center gap-2">
            <span aria-hidden="true" class="text-lg">
              {{ audience.icon }}
            </span>
            <h3 class="text-sm font-semibold text-slate-900">
              {{ audience.title }}
            </h3>
          </div>
          <p
            class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]"
          >
            {{ audience.text }}
          </p>
        </article>
      </div>
    </section>

    <!-- Support / CTA -->
    <section aria-labelledby="support-heading">
      <div
        class="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-900 px-5 py-6 text-white shadow-md sm:px-6 sm:py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-8"
      >
        <div class="max-w-xl space-y-2">
          <p
            class="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-slate-700/80"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Support when you need it
          </p>
          <h2
            id="support-heading"
            class="text-lg font-semibold sm:text-xl"
          >
            Need help getting started?
          </h2>
          <p
            class="mt-1 text-xs leading-relaxed text-slate-200 sm:text-[13px]"
          >
            Our support guides can walk you through setting up your first
            records, inviting your clinician and making the most of TBG Medflow.
          </p>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <RouterLink
            to="/support"
            class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span class="text-[13px]" aria-hidden="true">💬</span>
            Visit Support
            <span aria-hidden="true">↗</span>
          </RouterLink>

          <RouterLink
            to="/dashboard"
            class="text-center text-[11px] font-medium text-slate-200 underline-offset-4 hover:text-white hover:underline"
          >
            Log in to dashboard
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

const metrics = [
  { label: "5k+ records tracked" },
  { label: "Made for patients & students" },
  { label: "Secure cloud storage" },
  { label: "Works on any device" },
];

const featureCards = [
  {
    title: "Log daily vitals",
    icon: "📝",
    text: "Capture blood pressure, heart rate, temperature and blood sugar in seconds.",
  },
  {
    title: "See trends at a glance",
    icon: "📈",
    text: "Spot patterns over days or weeks so you can act early and share with your care team.",
  },
  {
    title: "Access anywhere",
    icon: "🌐",
    text: "Cloud-based, mobile-friendly, and always synced across your devices.",
  },
  {
    title: "Designed for learning",
    icon: "🎓",
    text: "Built with student nurses and clinicians in mind for case reviews and practice.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your account",
    text: "Sign up in a few clicks and set up your basic profile.",
  },
  {
    step: "02",
    title: "Add your health records",
    text: "Log vitals like blood pressure, heart rate, temperature and blood sugar.",
  },
  {
    step: "03",
    title: "Review your progress",
    text: "See trends over time and share reports with your clinician if you wish.",
  },
];

const audiences = [
  {
    title: "Patients & families",
    icon: "👨‍👩‍👧",
    text: "Keep an eye on day-to-day vitals and bring a clear history to appointments.",
  },
  {
    title: "Student nurses",
    icon: "🩺",
    text: "Practice documentation, case reviews and learn to think in trends, not snapshots.",
  },
  {
    title: "Clinicians",
    icon: "📋",
    text: "Quick overview of patient vitals over time to support better clinical decisions.",
  },
];
</script>
