import { API_BASE_URL, authHeaders } from "../../../constants/api";

/** Client for /api/capstone/admin. Non-admins get a 404 from the server. */
const request = async (path, { method = "GET", body } = {}) => {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/capstone/admin${path}`, {
      method,
      headers: {
        ...authHeaders(),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error("Couldn't reach the server."), { status: 0 });
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw Object.assign(new Error(json?.message ?? "Request failed."), {
      status: res.status,
    });
  }
  return json.data;
};

export const adminApi = {
  list: ({ status, page = 1 } = {}) =>
    request(
      `/attempts?${new URLSearchParams({ page: String(page), ...(status ? { status } : {}) })}`,
    ),
  detail: (attemptId) => request(`/attempts/${attemptId}`),
  override: (attemptId, outcome, reason) =>
    request(`/attempts/${attemptId}/override`, {
      method: "POST",
      body: { outcome, reason },
    }),
  setRevoked: (publicId, revoked, reason) =>
    request(`/certificates/${publicId}/revocation`, {
      method: "POST",
      body: { revoked, reason },
    }),
};
