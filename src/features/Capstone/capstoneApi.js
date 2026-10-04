import { API_BASE_URL, authHeaders } from "../../../constants/api";

/**
 * Thin client for /api/capstone. Every call resolves to the response's `data`
 * or throws an Error carrying the server's message plus `status` and any
 * extra fields the server sent (e.g. `retryAt`, `missing`), so the UI can
 * explain WHY something was refused instead of showing a generic error.
 */
const request = async (path, { method = "GET", body } = {}) => {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/capstone${path}`, {
      method,
      headers: {
        ...authHeaders(),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(
      new Error("Couldn't reach the server. Check your connection."),
      { status: 0 },
    );
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    const { message, success: _success, ...details } = json ?? {};
    throw Object.assign(
      new Error(message ?? "Something went wrong. Try again."),
      { status: res.status, ...details },
    );
  }
  return json.data;
};

const track = (trackId) => `/${encodeURIComponent(trackId)}`;

export const capstoneApi = {
  // Public: tracks that have a published capstone (the roadmap node uses it).
  catalog: () => request("/catalog"),
  // Every capstone plus where this learner stands (the /capstone picker).
  overview: () => request(""),
  // The learner's own issued certificates, newest first.
  certificates: () => request("/certificates"),
  status: (trackId) => request(track(trackId)),
  start: (trackId) => request(`${track(trackId)}/start`, { method: "POST" }),
  submit: (trackId, repoUrl) =>
    request(`${track(trackId)}/submit`, { method: "POST", body: { repoUrl } }),
  review: (trackId) => request(`${track(trackId)}/review`, { method: "POST" }),
  defense: (trackId) => request(`${track(trackId)}/defense`),
  startDefense: (trackId) =>
    request(`${track(trackId)}/defense/start`, { method: "POST" }),
  answer: (trackId, body) =>
    request(`${track(trackId)}/defense/answer`, { method: "POST", body }),
  gradeDefense: (trackId) =>
    request(`${track(trackId)}/defense/grade`, { method: "POST" }),
};
