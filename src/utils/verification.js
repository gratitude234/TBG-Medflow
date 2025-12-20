// src/utils/verification.js

import { apiPost } from "./apiClient";

export async function requestVerification({ details = {}, note = "" } = {}) {
  const data = await apiPost("request_verification.php", {
    details,
    note,
  });
  if (!data?.success) throw new Error(data?.error || "Failed to submit verification request");
  return data;
}
