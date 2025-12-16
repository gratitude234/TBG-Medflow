<!-- src/views/ShareView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-lg font-bold text-slate-900">Share</h1>
          <p class="mt-1 text-[11px] text-slate-600">
            Copy a clean vitals summary and send it to a clinician/mentor on WhatsApp or SMS.
          </p>
        </div>

        <RouterLink
          to="/records"
          class="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Open Records
        </RouterLink>
      </div>

      <div v-if="!user" class="mt-4 rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-900">
        You’re not logged in. Log in first so your records can be included in the share summary.
        <div class="mt-3">
          <RouterLink
            to="/login"
            class="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Log in
          </RouterLink>
        </div>
      </div>

      <div v-else class="mt-4 rounded-2xl bg-slate-50 p-4">
        <p class="text-[11px] text-slate-700">
          Tip: When adding vitals, tick <span class="font-semibold">“Share with clinician”</span>
          so you can quickly filter later.
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
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-sm font-semibold">Recommended message (copy/paste)</h2>

          <button
            type="button"
            class="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700 disabled:opacity-60"
            :disabled="!user"
            @click="copyMessage"
          >
            📋 Copy
          </button>
        </div>

        <p class="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-[11px] text-slate-700">
{{ shareMessage }}
        </p>

        <p v-if="copied" class="mt-2 text-[11px] font-medium text-emerald-700">
          Copied. Paste into WhatsApp/SMS.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getSessionUser } from "../utils/session";

const user = ref(null);
const copied = ref(false);

onMounted(() => {
  user.value = getSessionUser();
});

const shareMessage = computed(() => {
  const name = user.value?.fullName ? user.value.fullName : "—";

  return `Hello, please find my vitals summary from TBG Medflow.

Patient: ${name}

- Date: (insert)
- BP: (insert)
- HR: (insert)
- Temp: (insert)
- Sugar: (insert)
- Symptoms/Notes: (insert)

Kindly review and advise next steps. Thank you.`;
});

const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(shareMessage.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch {
    alert("Could not copy. Please select the text and copy manually.");
  }
};
</script>
