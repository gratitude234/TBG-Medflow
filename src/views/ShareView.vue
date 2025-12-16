<!-- src/views/ShareView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 class="text-lg font-bold text-slate-900">Share</h1>
      <p class="mt-1 text-[11px] text-slate-600">
        Quickly share a summary with a clinician/mentor. (MVP: copy text. Next: PDF + WhatsApp.)
      </p>

      <div class="mt-4 rounded-2xl bg-slate-50 p-4">
        <p class="text-[11px] text-slate-600">
          Tip: Mark a record as <span class="font-semibold">“share with clinician”</span> when adding vitals.
        </p>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <RouterLink
          to="/records"
          class="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Pick from Records
        </RouterLink>

        <RouterLink
          to="/add"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Add vitals
        </RouterLink>
      </div>

      <div class="mt-6 rounded-2xl border border-slate-200 p-4">
        <h2 class="text-sm font-semibold">Recommended message (copy/paste)</h2>
        <p class="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-[11px] text-slate-700">
Hi, please find my vitals summary from TBG Medflow.

- Date: (insert)
- BP: (insert)
- HR: (insert)
- Temp: (insert)
- Sugar: (insert)
- Symptoms/Notes: (insert)

Kindly review and advise next steps. Thank you.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
