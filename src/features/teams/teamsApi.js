import { API_BASE_URL, authHeaders } from "../../../constants/api";

/**
 * Thin client for /api/teams. Every call resolves to the response's `data` or
 * throws an Error carrying the server's message plus `status`, so the UI can
 * tell "not found" from "offline".
 */
const request = async (path, { method = "GET", body, auth = true } = {}) => {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/teams${path}`, {
      method,
      headers: {
        ...(auth ? authHeaders() : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      credentials: auth ? "include" : "omit",
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
    throw Object.assign(
      new Error(json?.message ?? "Something went wrong. Try again."),
      { status: res.status },
    );
  }
  return json.data;
};

const team = (teamId) => `/${encodeURIComponent(teamId)}`;

export const teamsApi = {
  mine: () => request("/mine"),
  get: (teamId) => request(team(teamId)),
  contributions: (teamId) => request(`${team(teamId)}/contributions`),

  defense: (teamId) => request(`${team(teamId)}/defense`),
  startDefense: (teamId) =>
    request(`${team(teamId)}/defense/start`, { method: "POST" }),
  answerDefense: (teamId, body) =>
    request(`${team(teamId)}/defense/answer`, { method: "POST", body }),
  gradeDefense: (teamId) =>
    request(`${team(teamId)}/defense/grade`, { method: "POST" }),

  myRatings: (teamId) => request(`${team(teamId)}/ratings/mine`),
  rate: (teamId, userId, body) =>
    request(`${team(teamId)}/ratings/${encodeURIComponent(userId)}`, {
      method: "PUT",
      body,
    }),

  // Public: anyone with the link (a recruiter) can open it, so no auth header.
  evidence: (publicId) =>
    request(`/evidence/${encodeURIComponent(publicId)}`, { auth: false }),
};
