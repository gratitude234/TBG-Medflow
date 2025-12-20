<!-- src/views/ShareView.vue -->
<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 space-y-6 sm:pt-6 lg:pt-8">
    <!-- Header -->
    <section class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Share &amp; Monitoring</h1>
        <p class="mt-1 text-[11px] text-slate-600">
          Option A: Patients generate a share code. A clinician/student enters the code to monitor the patient.
        </p>
      </div>

      <RouterLink
        to="/dashboard"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        ← Back to dashboard
      </RouterLink>
    </section>

    <!-- ✅ Option B: Secure Share (Care Team) -->
    <section v-if="role === 'patient'" class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900">Secure share (Verified care team)</h2>
          <p class="mt-1 text-[11px] text-slate-600">
            Select a verified clinician/student nurse. They get notified and can reply in your Inbox.
          </p>
        </div>

        <RouterLink
          to="/inbox"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Open Inbox →
        </RouterLink>
      </div>

      <div class="mt-4 grid gap-3 lg:grid-cols-2">
        <!-- Search & add -->
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-[11px] font-semibold text-slate-700">Find verified staff</p>
          <div class="mt-2 flex gap-2">
            <input
              v-model="staffQuery"
              @input="runStaffSearch"
              type="search"
              class="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Search by name or email…"
            />
            <button
              class="rounded-2xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              :disabled="staffLoading || !staffQuery.trim()"
              @click="runStaffSearch"
            >
              {{ staffLoading ? "…" : "Search" }}
            </button>
          </div>

          <div class="mt-3 space-y-2">
            <div v-if="staffResults.length === 0" class="text-[11px] text-slate-600">
              Type to search verified clinicians/student nurses.
            </div>

            <div
              v-for="s in staffResults"
              :key="s.id"
              class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3"
            >
              <div class="min-w-0">
                <p class="truncate text-[12px] font-semibold text-slate-900">{{ s.fullName || "Staff" }}</p>
                <p class="truncate text-[11px] text-slate-600">{{ s.email }}</p>
              </div>
              <button
                class="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                :disabled="staffLoading"
                @click="addToCareTeam(s.id)"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <!-- Care team -->
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-[11px] font-semibold text-slate-700">Your care team</p>

          <p v-if="careError" class="mt-2 text-[11px] text-red-600">{{ careError }}</p>
          <p v-if="careToast" class="mt-2 text-[11px] text-emerald-700">{{ careToast }}</p>

          <div v-if="careLoading" class="mt-3 text-[11px] text-slate-600">Loading…</div>

          <div v-else class="mt-3 space-y-2">
            <div v-if="careTeam.length === 0" class="text-[11px] text-slate-600">
              No care team yet. Add a verified staff member above.
            </div>

            <div
              v-for="m in careTeam"
              :key="m.viewerUserId"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-[12px] font-semibold text-slate-900">{{ m.staff?.fullName || "Staff" }}</p>
                  <p class="truncate text-[11px] text-slate-600">{{ m.staff?.email }}</p>
                </div>

                <div class="flex flex-wrap justify-end gap-2">
                  <button
                    class="rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                    :disabled="sharingTo === m.viewerUserId"
                    @click="shareLatestTo(m.viewerUserId)"
                  >
                    {{ sharingTo === m.viewerUserId ? "Sharing…" : "Share latest" }}
                  </button>

                  <button
                    class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    :disabled="!m.threadId"
                    @click="openChat(m.threadId)"
                  >
                    Chat
                  </button>

                  <button
                    class="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    :disabled="revokingTo === m.viewerUserId"
                    @click="revokeMember(m.viewerUserId)"
                  >
                    {{ revokingTo === m.viewerUserId ? "…" : "Revoke" }}
                  </button>
                </div>
              </div>

              <p v-if="m.threadId && m.lastMessagePreview" class="mt-2 line-clamp-2 text-[11px] text-slate-600">
                {{ m.lastMessagePreview }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Option A (legacy): Share code monitoring -->


    <!-- Not logged in -->
    <section v-if="!user" class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="rounded-2xl bg-amber-50 p-4 text-[11px] text-amber-900">
        You’re not logged in. Log in to create a share code or accept one.
        <div class="mt-3">
          <RouterLink
            to="/login"
            class="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Log in
          </RouterLink>
        </div>
      </div>
    </section>

    <section v-else class="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <!-- Left: Patient generates code OR Clinician/Student accepts code -->
      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">
              {{ role === 'patient' ? 'Generate a share code' : 'Enter a share code' }}
            </h2>
            <p class="mt-1 text-[11px] text-slate-600">
              {{
                role === 'patient'
                  ? 'Send the code to a trusted clinician/mentor or student nurse. They can view your records and add encounter notes.'
                  : 'Paste the code from a patient. You’ll get access to monitor that patient in your dashboard.'
              }}
            </p>
          </div>
          <span
            class="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-100"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="roleDot" />
            {{ roleLabel }}
          </span>
        </div>

        <!-- PATIENT: generate -->
        <div v-if="role === 'patient'" class="mt-5 space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="text-xs font-medium text-slate-700">Who can use this code?</label>
              <select
                v-model="invite.allowedRole"
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              >
                <option value="clinician">Clinician / mentor</option>
                <option value="student">Student nurse</option>
              </select>
              <p class="mt-1 text-[11px] text-slate-500">You can revoke access later from your Profile.</p>
            </div>

            <div>
              <label class="text-xs font-medium text-slate-700">Expires in</label>
              <select
                v-model.number="invite.expiresInDays"
                class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              >
                <option :value="1">24 hours</option>
                <option :value="3">3 days</option>
                <option :value="7">7 days</option>
                <option :value="14">14 days</option>
              </select>
              <p class="mt-1 text-[11px] text-slate-500">Shorter expiry is safer.</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/20 hover:bg-sky-700 disabled:opacity-60"
              :disabled="busy"
              @click="handleCreateInvite"
            >
              {{ busy ? 'Generating…' : 'Generate code' }}
            </button>

            <RouterLink
              to="/records"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              View my records
            </RouterLink>
          </div>

          <div v-if="inviteResult.code" class="mt-4 rounded-2xl border border-slate-200 p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold text-slate-900">Your share code</p>
                <p class="mt-1 text-[11px] text-slate-600">
                  Expires: <span class="font-medium text-slate-700">{{ inviteResult.expiresAt || '—' }}</span>
                </p>
              </div>
              <button
                type="button"
                class="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                @click="copy(inviteResult.code)"
              >
                📋 Copy
              </button>
            </div>
            <p class="mt-3 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm tracking-widest text-slate-900">
              {{ inviteResult.code }}
            </p>

            <div class="mt-3 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-900">
              Only share this code with someone you trust. Anyone with the code can request access while it’s valid.
            </div>
          </div>
        </div>

        <!-- CLINICIAN/STUDENT/OTHER: accept -->
        <div v-else class="mt-5 space-y-4">
          <div>
            <label class="text-xs font-medium text-slate-700">Share code</label>
            <input
              v-model="accept.code"
              placeholder="e.g., 7A3F-19BD-2C0E"
              class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold tracking-wider outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
            <p class="mt-1 text-[11px] text-slate-500">
              After you accept, you’ll see the patient under <span class="font-semibold">Monitoring</span> on your dashboard.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-sky-500/20 hover:bg-sky-700 disabled:opacity-60"
              :disabled="busy || !accept.code.trim()"
              @click="handleAcceptInvite"
            >
              {{ busy ? 'Saving…' : 'Accept & add patient' }}
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              :disabled="busy"
              @click="refreshPatients"
            >
              🔄 Refresh list
            </button>
          </div>

          <div v-if="acceptResult" class="rounded-2xl bg-emerald-50 p-3 text-[11px] text-emerald-800">
            Access granted. Select the patient from the list on the right to start monitoring.
          </div>
        </div>

        <div v-if="toast.visible" class="mt-4 rounded-2xl px-3 py-2 text-[11px] shadow-sm ring-1"
          :class="toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' :
                  toast.type === 'error' ? 'bg-rose-50 text-rose-700 ring-rose-100' :
                  'bg-slate-50 text-slate-700 ring-slate-100'">
          {{ toast.message }}
        </div>
      </section>

      <!-- Right: Monitoring list (clinician/student), or guidance (patient) -->
      <aside class="space-y-4">
        <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-sm font-semibold text-slate-900">
              {{ role === 'patient' ? 'How monitoring works' : 'My monitoring patients' }}
            </h2>
            <span class="text-[11px] text-slate-500">{{ role === 'patient' ? 'Privacy first' : patients.length + ' total' }}</span>
          </div>

          <div v-if="role === 'patient'" class="mt-4 space-y-3 text-[11px] text-slate-700">
            <p>
              <span class="font-semibold">You</span> control access.
              Generate a code, share it with a trusted clinician/mentor or student nurse, and they’ll be able to monitor you.
            </p>
            <ul class="list-disc pl-5 text-slate-600 space-y-1">
              <li>They can view your vitals records and encounter notes.</li>
              <li>They can add visit notes (SOAP) for clinical documentation.</li>
              <li>You can revoke access anytime.</li>
            </ul>

            <RouterLink
              to="/profile"
              class="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Go to Profile (manage access)
            </RouterLink>
          </div>

          <div v-else class="mt-4">
            <div v-if="patientsLoading" class="space-y-2">
              <div class="h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
              <div class="h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
              <div class="h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
            </div>

            <div v-else-if="patients.length === 0" class="rounded-2xl bg-slate-50 p-4 text-[11px] text-slate-600">
              No patients yet.
              <div class="mt-2 text-slate-500">
                Ask a patient to generate a share code, then paste it on the left.
              </div>
            </div>

            <div v-else class="space-y-2">
              <button
                v-for="p in patients"
                :key="p.id"
                type="button"
                class="w-full rounded-2xl border px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50/40"
                :class="activePatientId === p.id ? 'border-sky-300 bg-sky-50/40' : 'border-slate-200 bg-white'"
                @click="selectPatient(p)"
              >
                <p class="truncate text-xs font-semibold text-slate-900">{{ p.fullName || ('Patient #' + p.id) }}</p>
                <p class="mt-1 text-[11px] text-slate-600">
                  <span v-if="p.lastRecordAt">Last record: {{ p.lastRecordAt }}</span>
                  <span v-else class="text-slate-500">No record metadata yet</span>
                </p>
              </button>
            </div>

            <div v-if="activePatientId" class="mt-4 flex flex-wrap gap-2">
              <RouterLink
                :to="{ path: '/dashboard', query: { patientUserId: String(activePatientId) } }"
                class="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Open dashboard
              </RouterLink>

              <RouterLink
                :to="{ path: '/records', query: { patientUserId: String(activePatientId) } }"
                class="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View records
              </RouterLink>

              <RouterLink
                :to="{ path: '/encounters/new', query: { patientUserId: String(activePatientId) } }"
                class="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                New note
              </RouterLink>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { searchVerifiedStaff, addCareMember, listCareTeam, shareRecord, revokeCareMember } from "../utils/careTeam";
import { getSessionUser } from "../utils/session";
import { createShareInvite, acceptShareInvite, listMonitoringPatients } from "../utils/monitoring";
import { getActivePatient, setActivePatient, normalizeRole } from "../utils/patientContext";

const router = useRouter();

const user = ref(null);
const role = computed(() => normalizeRole(user.value?.role));
const roleLabel = computed(() => {
  if (role.value === "student") return "Student nurse";
  if (role.value === "clinician") return "Clinician / mentor";
  if (role.value === "other") return "Other";
  return "Patient / family";
});
const roleDot = computed(() => {
  if (role.value === "patient") return "bg-emerald-500";
  if (role.value === "clinician") return "bg-sky-500";
  if (role.value === "student") return "bg-violet-500";
  return "bg-slate-400";
});

const toast = reactive({ visible: false, type: "info", message: "", _t: null });
const showToast = (message, type = "info", ms = 2600) => {
  toast.type = type;
  toast.message = message;
  toast.visible = true;
  if (toast._t) clearTimeout(toast._t);
  toast._t = setTimeout(() => (toast.visible = false), ms);
};

const busy = ref(false);

// Patient invite state
const invite = reactive({ allowedRole: "clinician", expiresInDays: 7 });
const inviteResult = reactive({ code: "", expiresAt: null });

// Viewer accept state
const accept = reactive({ code: "" });
const acceptResult = ref(null);

// Monitoring list
const patients = ref([]);
const patientsLoading = ref(false);
const activePatientId = ref(null);

onMounted(async () => {
  user.value = getSessionUser();
  if (!user.value?.id) return;

  const active = getActivePatient(user.value.id);
  activePatientId.value = active?.id ? Number(active.id) : null;

  await refreshPatients();
  await loadCareTeam();
});

const refreshPatients = async () => {
  if (!user.value?.id) return;
  const r = role.value;
  if (r === "patient") return;

  patientsLoading.value = true;
  try {
    patients.value = await listMonitoringPatients(user.value.id);
    // If active selection is missing, set first
    if (!activePatientId.value && patients.value?.[0]?.id) {
      selectPatient(patients.value[0]);
    }
  } catch (e) {
    showToast(e?.message || "Could not load monitoring patients.", "error");
  } finally {
    patientsLoading.value = false;
  }
};

const handleCreateInvite = async () => {
  if (!user.value?.id) return;
  busy.value = true;
  inviteResult.code = "";
  inviteResult.expiresAt = null;

  try {
    const res = await createShareInvite({
      patientUserId: user.value.id,
      allowedRole: invite.allowedRole,
      expiresInDays: invite.expiresInDays,
    });
    inviteResult.code = res.code;
    inviteResult.expiresAt = res.expiresAt;
    showToast("Share code generated.", "success");
  } catch (e) {
    showToast(e?.message || "Failed to generate share code.", "error");
  } finally {
    busy.value = false;
  }
};

const handleAcceptInvite = async () => {
  if (!user.value?.id) return;
  const code = accept.code.trim();
  if (!code) return;

  busy.value = true;
  acceptResult.value = null;
  try {
    acceptResult.value = await acceptShareInvite({ code, viewerUserId: user.value.id });
    accept.code = "";
    showToast("Access added. Loading your monitoring list…", "success");
    await refreshPatients();
  await loadCareTeam();
  } catch (e) {
    showToast(e?.message || "Could not accept code.", "error");
  } finally {
    busy.value = false;
  }
};

const selectPatient = (p) => {
  if (!user.value?.id || !p?.id) return;
  activePatientId.value = Number(p.id);
  setActivePatient(user.value.id, p);
  showToast("Patient selected.", "success", 1200);
};

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(String(text || ""));
    showToast("Copied.", "success", 1400);
  } catch {
    showToast("Could not copy. Select the text and copy manually.", "error");
  }
};
</script>
