import { API_BASE_URL } from "../../../constants/api";

/**
 * Public certificate lookup — no auth header: anyone with the link (a
 * recruiter, a hiring manager) must be able to verify it.
 * Throws an Error with `status` so the page can tell "not found" from "offline".
 */
export const fetchCertificate = async (publicId) => {
  let res;
  try {
    res = await fetch(
      `${API_BASE_URL}/api/capstone/certificates/${encodeURIComponent(publicId)}`,
    );
  } catch {
    throw Object.assign(
      new Error("Couldn't reach the server. Check your connection."),
      { status: 0 },
    );
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw Object.assign(
      new Error(json?.message ?? "Couldn't load this certificate."),
      { status: res.status },
    );
  }
  return json.data;
};
