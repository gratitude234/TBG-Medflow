<!-- src/views/DashboardView.vue -->
<template>
  <main
    class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:space-y-8 sm:pt-6 lg:pt-8"
  >
    <!-- Page header -->
    <section
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <!-- Left: title & subtitle -->
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">
            Dashboard
          </h1>
          <span
            class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Today&apos;s overview
          </span>
        </div>
        <p class="text-sm text-slate-600">
          Track today&apos;s vitals and review your recent health records at a
          glance.
        </p>
      </div>

      <!-- Right: last record + primary action -->
      <div
        class="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right"
      >
        <p class="text-[11px] text-slate-400">
          Last record: Today at 09:24 AM
        </p>
        <RouterLink
          to="/add-record"
          class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
        >
          <span
            aria-hidden="true"
            class="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[11px]"
          >
            ＋
          </span>
          Add health record
        </RouterLink>
      </div>
    </section>

    <!-- Top stats: Today's vitals -->
    <section class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <h2
          class="text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Today&apos;s vitals
        </h2>
        <p class="text-[11px] text-slate-400">
          Demo values · Not real medical data
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in todayVitals"
          :key="item.key"
          class="group rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-sky-100"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <div
                class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-50 text-base"
              >
                <span aria-hidden="true">{{ item.icon }}</span>
              </div>
              <p class="text-[11px] font-medium text-slate-500">
                {{ item.label }}
              </p>
            </div>
            <span
              class="mt-0.5 h-2.5 w-2.5 rounded-full"
              :class="item.accent"
            />
          </div>

          <p class="mt-3 text-lg font-semibold text-slate-900">
            {{ item.value }}
          </p>

          <div class="mt-2 flex items-center justify-between gap-2">
            <p
              class="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-700"
            >
              {{ item.status }}
            </p>
            <p class="text-[10px] text-slate-400">
              {{ item.helper }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Main grid: left content + right sidebar -->
    <section
      class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
      <!-- Left column -->
      <div class="space-y-6">
        <!-- Recent records -->
        <section
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Recent records
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Your last few logged vitals.
              </p>
            </div>
            <RouterLink
              to="/records"
              class="text-[11px] font-medium text-sky-600 underline-offset-4 hover:text-sky-700 hover:underline"
            >
              View all
            </RouterLink>
          </div>

          <!-- Empty state -->
          <div
            v-if="!hasRecords"
            class="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500"
          >
            <p>You haven&apos;t logged any health records yet.</p>
            <RouterLink
              to="/add-record"
              class="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Add your first record
            </RouterLink>
          </div>

          <!-- Records list -->
          <div v-else class="mt-4">
            <!-- Table for sm+ -->
            <div class="hidden overflow-x-auto sm:block">
              <table
                class="min-w-full border-separate border-spacing-y-1 text-xs text-slate-700"
              >
                <thead>
                  <tr class="text-[11px] text-slate-500">
                    <th class="px-3 py-2 text-left font-medium">
                      Date
                    </th>
                    <th class="px-3 py-2 text-left font-medium">
                      Time
                    </th>
                    <th class="px-3 py-2 text-left font-medium">
                      BP
                    </th>
                    <th class="px-3 py-2 text-left font-medium">
                      HR
                    </th>
                    <th class="px-3 py-2 text-left font-medium">
                      Temp
                    </th>
                    <th class="px-3 py-2 text-left font-medium">
                      Sugar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="record in recentRecords"
                    :key="record.id"
                    class="rounded-xl bg-slate-50/80 align-middle transition hover:bg-sky-50/70"
                  >
                    <td
                      class="px-3 py-2 text-[11px] font-medium text-slate-700"
                    >
                      {{ record.date }}
                    </td>
                    <td class="px-3 py-2 text-[11px] text-slate-500">
                      {{ record.time }}
                    </td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">
                      {{ record.bp }}
                    </td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">
                      {{ record.hr }}
                    </td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">
                      {{ record.temp }}
                    </td>
                    <td class="px-3 py-2 text-[11px] text-slate-700">
                      {{ record.sugar }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Stacked cards for mobile -->
            <div class="space-y-3 sm:hidden">
              <article
                v-for="record in recentRecords"
                :key="record.id"
                class="rounded-xl bg-slate-50/90 p-3 ring-1 ring-slate-100"
              >
                <div class="flex items-center justify-between gap-2">
                  <p
                    class="text-[11px] font-medium text-slate-700"
                  >
                    {{ record.date }}
                  </p>
                  <p class="text-[11px] text-slate-500">
                    {{ record.time }}
                  </p>
                </div>
                <div
                  class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700"
                >
                  <p><span class="text-slate-500">BP:</span> {{ record.bp }}</p>
                  <p><span class="text-slate-500">HR:</span> {{ record.hr }}</p>
                  <p>
                    <span class="text-slate-500">Temp:</span>
                    {{ record.temp }}
                  </p>
                  <p>
                    <span class="text-slate-500">Sugar:</span>
                    {{ record.sugar }}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- Trends snapshot -->
        <section
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Trends snapshot
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                7–14 day overview (mock data).
              </p>
            </div>
          </div>

          <!-- Fake chart -->
          <div
            class="mt-4 rounded-xl bg-slate-50 px-3 py-3"
          >
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-medium text-slate-600">
                Vitals trend
              </span>
              <span class="text-slate-400">
                BP · HR (mock)
              </span>
            </div>

            <div
              class="mt-3 flex h-24 items-end gap-1.5 rounded-lg bg-gradient-to-t from-slate-50 via-slate-50 to-slate-100/80 px-1 py-1"
            >
              <div
                class="w-1.5 rounded-full bg-sky-300/80"
                style="height: 30%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-sky-400/80"
                style="height: 55%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-emerald-300/80"
                style="height: 45%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-sky-500/80"
                style="height: 75%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-emerald-400/80"
                style="height: 65%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-sky-300/80"
                style="height: 40%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-emerald-300/80"
                style="height: 50%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-sky-400/80"
                style="height: 60%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-emerald-400/80"
                style="height: 70%"
              ></div>
              <div
                class="w-1.5 rounded-full bg-sky-300/80"
                style="height: 45%"
              ></div>
            </div>
          </div>

          <!-- Legend -->
          <div
            class="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500"
          >
            <div class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-sky-400"></span>
              <span>Blood pressure</span>
            </div>
            <div class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Heart rate</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Right column: sidebar -->
      <div class="space-y-6">
        <!-- Quick actions -->
        <section
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
        >
          <h2 class="text-sm font-semibold text-slate-900">
            Quick actions
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            Jump straight into the tasks you do most often.
          </p>

          <div class="mt-4 space-y-2">
            <RouterLink
              to="/add-record"
              class="inline-flex w-full items-center justify-between rounded-2xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">🩺</span>
                Add health record
              </span>
              <span aria-hidden="true">↗</span>
            </RouterLink>

            <RouterLink
              to="/records"
              class="inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-500 hover:text-sky-600"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">📋</span>
                View all records
              </span>
              <span aria-hidden="true">↗</span>
            </RouterLink>

            <button
              type="button"
              class="inline-flex w-full items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
            >
              <span class="inline-flex items-center gap-2">
                <span aria-hidden="true">📄</span>
                Download sample report
              </span>
              <span class="text-[10px] text-slate-400">
                Coming soon
              </span>
            </button>
          </div>
        </section>

        <!-- Tips / education -->
        <section
          class="rounded-2xl bg-sky-50 p-4 shadow-sm ring-1 ring-sky-100/80 sm:p-5"
        >
          <h2 class="text-sm font-semibold text-slate-900">
            Better tracking tips
          </h2>
          <p class="mt-1 text-xs text-slate-600">
            Small habits can make your vitals more reliable and easier to
            interpret.
          </p>

          <ul class="mt-3 space-y-2 text-[11px] text-slate-700">
            <li class="flex gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              <span>
                Log at roughly the same time each day so trends are easier to
                compare.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              <span>
                Sit and rest for 3–5 minutes before checking your blood
                pressure or heart rate.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              <span>
                Note anything unusual (stress, illness, missed medication)
                alongside your readings.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              <span>
                Bring your dashboard or printed report to appointments to guide
                the conversation.
              </span>
            </li>
          </ul>

          <div class="mt-4 flex items-center justify-between">
            <p class="text-[11px] text-slate-500">
              Need more guidance?
            </p>
            <RouterLink
              to="/support"
              class="text-[11px] font-medium text-sky-700 underline-offset-4 hover:text-sky-800 hover:underline"
            >
              Visit Support
            </RouterLink>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const todayVitals = [
  {
    key: "bp",
    label: "Blood pressure",
    value: "118 / 76",
    status: "In range",
    helper: "mmHg · seated",
    accent: "bg-sky-500",
    icon: "🩺",
  },
  {
    key: "hr",
    label: "Heart rate",
    value: "78 bpm",
    status: "Calm",
    helper: "Resting",
    accent: "bg-emerald-500",
    icon: "❤️",
  },
  {
    key: "temp",
    label: "Temperature",
    value: "36.8 °C",
    status: "Normal",
    helper: "No fever",
    accent: "bg-teal-500",
    icon: "🌡️",
  },
  {
    key: "sugar",
    label: "Blood sugar",
    value: "95 mg/dL",
    status: "Stable",
    helper: "Fasting",
    accent: "bg-indigo-500",
    icon: "🩸",
  },
];

const recentRecords = [
  {
    id: 1,
    date: "Today",
    time: "09:24 AM",
    bp: "118 / 76",
    hr: "78 bpm",
    temp: "36.8 °C",
    sugar: "95 mg/dL",
  },
  {
    id: 2,
    date: "Yesterday",
    time: "08:51 PM",
    bp: "124 / 80",
    hr: "82 bpm",
    temp: "37.0 °C",
    sugar: "103 mg/dL",
  },
  {
    id: 3,
    date: "2 days ago",
    time: "07:10 AM",
    bp: "122 / 79",
    hr: "76 bpm",
    temp: "36.7 °C",
    sugar: "92 mg/dL",
  },
];

const hasRecords = computed(() => recentRecords.length > 0);
</script>
