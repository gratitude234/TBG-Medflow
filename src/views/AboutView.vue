<!-- src/views/AboutView.vue -->
<template>
  <main
    class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-8 sm:pt-6 sm:space-y-10 lg:pt-8 lg:space-y-12"
  >
    <!-- Back link + hero -->
    <section>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        <span>←</span>
        <span>Back to home</span>
      </RouterLink>

      <section
        class="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.3fr)] lg:items-center"
      >
        <!-- Left: text -->
        <div>
          <p
            class="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
            About TBG Medflow
          </p>

          <h1
            class="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            A calm place for your health records.
          </h1>

          <p class="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            TBG Medflow is a simple health-record tracker for patients, student
            nurses and clinicians. It’s built to make logging vitals feel less
            stressful and more useful — so you can see patterns over time, not
            just one-off numbers.
          </p>

          <ul class="mt-4 space-y-1.5 text-xs text-slate-600">
            <li>
              • Log blood pressure, heart rate, temperature and blood sugar in
              one place.
            </li>
            <li>• Review trends instead of scrolling through scattered notes.</li>
            <li>
              • Use it as a learning tool during clinical training and
              simulations.
            </li>
          </ul>

          <div class="mt-5 flex flex-wrap gap-3 text-xs">
            <RouterLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              View dashboard
            </RouterLink>
            <RouterLink
              to="/add-record"
              class="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 px-4 py-2 font-medium text-sky-700 hover:border-sky-300 hover:bg-white"
            >
              Add a health record
            </RouterLink>
          </div>
        </div>

        <!-- Right: highlight card -->
        <aside
          class="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm ring-1 ring-sky-100 sm:p-5"
        >
          <p class="text-xs font-semibold text-slate-900">
            Built for learning, not emergencies
          </p>
          <p
            class="mt-2 text-[11px] leading-relaxed text-slate-700 sm:text-xs"
          >
            TBG Medflow is a demo and learning tool. It&apos;s great for
            practising documentation, exploring health trends and preparing for
            clinical conversations — but it&apos;s
            <span class="font-semibold">not</span> designed for emergency
            decision-making or urgent care.
          </p>
          <p class="mt-3 text-[11px] text-slate-500">
            Always contact a qualified healthcare professional or local
            emergency service if you&apos;re worried about your health.
          </p>
        </aside>
      </section>
    </section>

    <!-- Pillars / principles -->
    <section class="space-y-3">
      <header class="space-y-1">
        <h2 class="text-sm font-semibold text-slate-900">
          Design principles
        </h2>
        <p class="text-[11px] text-slate-600">
          TBG Medflow is built around a few simple ideas to keep your
          experience calm and clear.
        </p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in pillars"
          :key="item.title"
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
        >
          <h3 class="text-xs font-semibold text-slate-900">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-[11px] leading-relaxed text-slate-600">
            {{ item.text }}
          </p>
        </article>
      </div>
    </section>

    <!-- Who it's for -->
    <section class="space-y-3">
      <header class="space-y-1">
        <h2 class="text-sm font-semibold text-slate-900">
          Who TBG Medflow is for
        </h2>
        <p class="text-[11px] text-slate-600">
          Different people use the same workspace in different ways. Here&apos;s
          how it can help.
        </p>
      </header>

      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="item in audiences"
          :key="item.title"
          class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
        >
          <h3 class="text-xs font-semibold text-slate-900">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-[11px] leading-relaxed text-slate-600">
            {{ item.text }}
          </p>
        </article>
      </div>
    </section>

    <!-- Story / timeline -->
    <section class="space-y-4">
      <header class="space-y-1">
        <h2 class="text-sm font-semibold text-slate-900">
          The story behind the app
        </h2>
        <p class="text-[11px] text-slate-600">
          TBG Medflow started as a simple way to keep daily vitals in one place
          and grew into a calm practice tool for health documentation.
        </p>
      </header>

      <ol class="space-y-3 text-[11px] text-slate-700">
        <li
          v-for="step in timeline"
          :key="step.label"
          class="flex gap-3"
        >
          <div
            class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-[10px] font-semibold text-sky-700"
          >
            {{ step.label }}
          </div>
          <div class="space-y-0.5">
            <p class="text-xs font-semibold text-slate-900">
              {{ step.period }}
            </p>
            <p class="leading-relaxed">
              {{ step.text }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <!-- Values & safety note -->
    <section
      class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]"
    >
      <!-- Left: values -->
      <article
        class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
      >
        <h2 class="text-sm font-semibold text-slate-900">
          How we think about good tools
        </h2>
        <p class="mt-2 text-[11px] text-slate-600">
          Behind the screens and charts, TBG Medflow is guided by a few core
          values.
        </p>
        <ul class="mt-3 space-y-1.5 text-[11px] text-slate-700">
          <li
            v-for="item in values"
            :key="item"
            class="flex gap-2"
          >
            <span
              class="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500"
            ></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </article>

      <!-- Right: safety card -->
      <article
        class="rounded-2xl bg-slate-900 p-4 text-slate-50 shadow-sm sm:p-5"
      >
        <h2 class="text-sm font-semibold">
          Important safety note
        </h2>
        <p class="mt-2 text-[11px] leading-relaxed text-slate-100/80">
          TBG Medflow does not give medical advice, diagnose conditions or
          replace your healthcare provider. It&apos;s a learning and
          record-keeping tool only.
        </p>
        <p class="mt-2 text-[11px] leading-relaxed text-slate-100/80">
          If you ever feel unwell, notice worrying changes in your vitals, or
          think you might be in an emergency, contact a qualified healthcare
          professional or local emergency number immediately.
        </p>
        <p class="mt-3 text-[11px] text-slate-400">
          When used alongside professional care, calm record-keeping can make
          those conversations clearer and more productive.
        </p>
      </article>
    </section>

    <!-- Bottom CTA -->
    <section
      class="rounded-2xl bg-sky-50 px-4 py-4 shadow-sm ring-1 ring-sky-100 sm:px-5"
    >
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-sm font-semibold text-slate-900">
            Ready to explore TBG Medflow?
          </h2>
          <p class="mt-1 text-[11px] text-slate-600">
            Head back to your dashboard to view demo vitals, or add a new
            record to see how everything fits together.
          </p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs">
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-sky-700"
          >
            Go to dashboard
          </RouterLink>
          <RouterLink
            to="/add-record"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 px-4 py-2 font-medium text-sky-700 hover:border-sky-300 hover:bg-white"
          >
            Add a health record
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";

const pillars = [
  {
    title: "Clarity over clutter",
    text: "We strip away noise so patients, students and clinicians can see the story behind the numbers.",
  },
  {
    title: "Made for learning",
    text: "Student nurses and early-career clinicians can use TBG Medflow as a safe space to practice documentation.",
  },
  {
    title: "Care, not just data",
    text: "Every screen is designed to support real conversations between people, not just charts on a dashboard.",
  },
];

const timeline = [
  {
    label: "Idea",
    period: "Concept phase",
    text: "TBG Medflow began as a simple idea: keep daily vitals in one clean view for busy people and their care teams.",
  },
  {
    label: "Prototype",
    period: "Design & demo",
    text: "We sketched dashboards, tested forms and refined the flows to feel calm and intuitive on any device.",
  },
  {
    label: "Today",
    period: "Student-friendly demo",
    text: "What you see now is a demo built for learning, practice and exploration — not for real emergency care decisions.",
  },
];

const audiences = [
  {
    title: "Patients & families",
    text: "Keep track of vitals over days or weeks, so appointments feel clearer and less stressful.",
  },
  {
    title: "Student nurses",
    text: "Practice logging blood pressure, heart rate, temperature and blood sugar as part of your training.",
  },
  {
    title: "Clinicians & mentors",
    text: "Use structured, trend-based views to discuss cases, explain patterns and teach clinical reasoning.",
  },
];

const values = [
  "Respect for your time and attention.",
  "Simple language wherever possible.",
  "Design that stays calm, even when numbers change.",
  "Interfaces that work on phones, tablets and laptops.",
];
</script>
