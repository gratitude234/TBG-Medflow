<!-- src/views/admin/AdminVerificationView.vue -->
<template>
  <main class="page">
    <section class="panel">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="h1">Staff verification</h1>
          <p class="mt-1 text-[11px] text-slate-600">
            Review and approve student nurses / clinicians before they can receive shares and reply.
          </p>
        </div>

        <RouterLink
          to="/dashboard"
          class="inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </RouterLink>
      </div>

      <!-- Controls -->
      <div class="mt-5 grid gap-3 sm:grid-cols-[160px_1fr_auto]">
        <div class="space-y-1">
          <label class="text-[10px] font-semibold text-slate-500">FILTER</label>
          <select
            v-model="filterStatus"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-semibold text-slate-500">SEARCH</label>
          <input
            v-model="search"
            type="text"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Search name / email / role"
          />
        </div>

        <button
          type="button"
          class="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 sm:mt-6"
          :disabled="loading"
          @click="load"
        >
          {{ loading ? "Refreshing…" : "Refresh" }}
        </button>
      </div>

      <!-- Toast -->
      <div
        v-if="toast.visible"
        class="mt-4 flex items-start gap-2 rounded-2xl px-3 py-2 text-[11px]"
        :class="toast.type === 'success'
          ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
          : toast.type === 'error'
            ? 'bg-red-50 text-red-800 ring-1 ring-red-100'
            : 'bg-sky-50 text-sky-800 ring-1 ring-sky-100'"
      >
        <span v-if="toast.type === 'success'">✅</span>
        <span v-else-if="toast.type === 'error'">⚠️</span>
        <span v-else>💬</span>
        <p class="leading-snug">{{ toast.message }}</p>
      </div>

      <!-- Content -->
      <div class="mt-5">
        <div v-if="loading" class="rounded-2xl bg-slate-50 p-4 text-[11px] text-slate-600">
          Loading verification requests…
        </div>

        <div v-else-if="filtered.length === 0" class="rounded-2xl bg-slate-50 p-4 text-[11px] text-slate-600">
          No requests found for this filter.
        </div>

        <div v-else class="grid gap-3 sm:grid-cols-2">
          <article
            v-for="item in filtered"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-bold text-slate-900">{{ item.user.fullName || '—' }}</p>
                <p class="mt-0.5 text-[11px] text-slate-600">{{ item.user.email }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
                    {{ prettyRole(item.requestedRole || item.user.role) }}
                  </span>
                  <span
                    class="rounded-full px-2 py-1 text-[10px] font-semibold ring-1"
                    :class="badgeClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </div>
              </div>

              <p class="text-[10px] text-slate-500" :title="item.createdAt">
                {{ fmtDate(item.createdAt) }}
              </p>
            </div>

            <div class="mt-3 rounded-2xl bg-slate-50 p-3">
              <p class="text-[10px] font-semibold text-slate-500">DETAILS</p>
              <p class="mt-1 text-[11px] text-slate-700">
                {{ (item.details?.note || item.details?.extra?.note || '').trim() || '—' }}
              </p>

              <div v-if="item.details?.documentUrl" class="mt-2">
                <a
                  :href="item.details.documentUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="text-[11px] font-semibold text-sky-700 hover:text-sky-800"
                >
                  View document
                </a>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-if="item.status === 'pending'"
                type="button"
                class="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-700"
                :disabled="actingId === item.id"
                @click="review(item, 'approve')"
              >
                {{ actingId === item.id ? 'Working…' : 'Approve' }}
              </button>

              <button
                v-if="item.status === 'pending'"
                type="button"
                class="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 hover:bg-rose-700"
                :disabled="actingId === item.id"
                @click="review(item, 'reject')"
              >
                {{ actingId === item.id ? 'Working…' : 'Reject' }}
              </button>

              <button
                type="button"
                class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="openDetails(item)"
              >
                Full details
              </button>
            </div>

            <p v-if="item.reviewNote" class="mt-3 text-[11px] text-slate-600">
              <span class="font-semibold">Review note:</span> {{ item.reviewNote }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Details modal -->
    <div v-if="detailsOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div class="w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-slate-900">{{ detailsItem?.user?.fullName || '—' }}</p>
            <p class="mt-0.5 text-[11px] text-slate-600">{{ detailsItem?.user?.email }}</p>
          </div>
          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="detailsOpen = false"
          >
            Close
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-[10px] font-semibold text-slate-500">REQUEST</p>
            <pre class="mt-2 whitespace-pre-wrap break-words rounded-xl bg-white p-3 text-[11px] text-slate-800 ring-1 ring-slate-200">{{ prettyJson(detailsItem) }}</pre>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-if="detailsItem?.status === 'pending'"
            type="button"
            class="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-700"
            :disabled="actingId === detailsItem?.id"
            @click="review(detailsItem, 'approve')"
          >
            Approve
          </button>
          <button
            v-if="detailsItem?.status === 'pending'"
            type="button"
            class="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 hover:bg-rose-700"
            :disabled="actingId === detailsItem?.id"
            @click="review(detailsItem, 'reject')"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import { apiGet, apiPost } from "../../utils/apiClient";

const loading = ref(false);
const actingId = ref(0);

const filterStatus = ref("pending");
const search = ref("");

const items = ref([]);

const toast = reactive({
  visible: false,
  type: "info",
  message: "",
});

const detailsOpen = ref(false);
const detailsItem = ref(null);

function showToast(type, message) {
  toast.visible = true;
  toast.type = type;
  toast.message = message;
  window.setTimeout(() => (toast.visible = false), 3500);
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
}

function prettyRole(r) {
  const x = String(r || "").toLowerCase();
  if (x === "student") return "Student nurse";
  if (x === "clinician") return "Clinician";
  if (x === "admin") return "Admin";
  if (x === "super_admin") return "Super admin";
  return x ? x[0].toUpperCase() + x.slice(1) : "—";
}

function badgeClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "approved") return "bg-emerald-50 text-emerald-800 ring-emerald-100";
  if (s === "rejected") return "bg-rose-50 text-rose-800 ring-rose-100";
  return "bg-amber-50 text-amber-900 ring-amber-100";
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((it) => {
    const hay = [
      it.user?.fullName,
      it.user?.email,
      it.user?.role,
      it.requestedRole,
      it.status,
      it.details?.note,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
});

function openDetails(item) {
  detailsItem.value = item;
  detailsOpen.value = true;
}

function prettyJson(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

async function load() {
  loading.value = true;
  try {
    const qs = filterStatus.value === "all" ? "" : `?status=${encodeURIComponent(filterStatus.value)}`;
    const data = await apiGet(`list_verification_requests.php${qs}`);
    items.value = Array.isArray(data?.items) ? data.items : [];
    showToast("info", `Loaded ${items.value.length} request(s).`);
  } catch (e) {
    showToast("error", e?.message || "Failed to load requests.");
  } finally {
    loading.value = false;
  }
}

async function review(item, action) {
  if (!item?.id) return;
  const verb = action === "approve" ? "Approve" : "Reject";

  const note = window.prompt(`${verb} request #${item.id}\n\nOptional note:`) || "";

  actingId.value = item.id;
  try {
    await apiPost("review_verification_request.php", {
      requestId: item.id,
      action,
      reviewNote: note,
    });

    // Remove from list if we’re viewing pending
    if (filterStatus.value === "pending") {
      items.value = items.value.filter((x) => x.id !== item.id);
    } else {
      // Update local status
      items.value = items.value.map((x) => (x.id === item.id ? { ...x, status: action === "approve" ? "approved" : "rejected", reviewNote: note } : x));
    }

    showToast("success", `${verb}d successfully.`);
    detailsOpen.value = false;
  } catch (e) {
    showToast("error", e?.message || "Action failed.");
  } finally {
    actingId.value = 0;
  }
}

onMounted(() => {
  load();
});
</script>
