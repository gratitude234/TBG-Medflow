<!-- src/views/ProfileView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-lg font-bold text-slate-900">Profile</h1>
          <p class="mt-1 text-[11px] text-slate-600">Account, role, and quick actions.</p>
        </div>

        <RouterLink
          to="/dashboard"
          class="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </RouterLink>
      </div>

      <div v-if="user" class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-[10px] font-semibold text-slate-500">FULL NAME</p>
          <p class="mt-1 text-sm font-bold text-slate-900">{{ user.fullName || "—" }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-[10px] font-semibold text-slate-500">EMAIL</p>
          <p class="mt-1 text-sm font-bold text-slate-900">{{ user.email || "—" }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-[10px] font-semibold text-slate-500">ROLE</p>
          <p class="mt-1 text-sm font-bold text-slate-900">{{ user.role || "patient" }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-[10px] font-semibold text-slate-500">ACCOUNT</p>
          <p class="mt-1 text-sm font-bold text-slate-900">Active</p>
          <p class="mt-1 text-[11px] text-slate-600">
            Access is tied to this device for now. More security controls come next.
          </p>
        </div>
      </div>

      <div v-else class="mt-4 rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-900">
        You’re not logged in. Please log in to view your profile.
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <RouterLink
          v-if="!user"
          to="/login"
          class="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/25 hover:bg-sky-700"
        >
          Log in
        </RouterLink>

        <button
          v-if="user"
          type="button"
          class="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
          @click="logout"
        >
          Log out
        </button>

        <RouterLink
          v-if="user"
          to="/records"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          View my records
        </RouterLink>

        <button
          type="button"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          @click="comingSoon"
        >
          Export my data
        </button>
      </div>

      <div class="mt-6 rounded-2xl border border-slate-200 p-4">
        <h2 class="text-sm font-semibold text-slate-900">Safety & access</h2>
        <ul class="mt-2 space-y-1 text-[11px] text-slate-700">
          <li>• If you share this device, always log out after use.</li>
          <li>• Don’t store sensitive notes you wouldn’t want exposed on a shared phone/laptop.</li>
          <li>• Next upgrades: device verification, role permissions, export controls.</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { clearSession, getSessionUser } from "../utils/session";

const router = useRouter();
const user = ref(null);

onMounted(() => {
  user.value = getSessionUser();
});

const logout = () => {
  clearSession();
  user.value = null;
  router.replace("/login");
};

const comingSoon = () => {
  alert("Next: export to PDF + share via WhatsApp/email.");
};
</script>
