<!-- src/views/ProfileView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 class="text-lg font-bold text-slate-900">Profile</h1>
      <p class="mt-1 text-[11px] text-slate-600">Account, role, and quick actions.</p>

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
          <p class="text-[10px] font-semibold text-slate-500">STATUS</p>
          <p class="mt-1 text-sm font-bold text-slate-900">Active</p>
          <p class="mt-1 text-[11px] text-slate-600">MVP account (no device verification yet).</p>
        </div>
      </div>

      <div v-else class="mt-4 rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-800">
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

        <button
          type="button"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          @click="comingSoon"
        >
          Export my data (Next)
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
  router.push("/login");
};

const comingSoon = () => {
  alert("Coming next: export to PDF + share via WhatsApp/email.");
};
</script>
