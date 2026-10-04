import { API_BASE_URL, authHeaders } from "../../constants/api";

export const updateLastActive = async (userId) => {
  if (!userId) return;
  const now = new Date().toISOString();
  try {
    const res = await fetch(`${API_BASE_URL}/my-profile`, {
      method: "PUT",
      headers: { "content-type": "application/json", ...authHeaders() },
      body: JSON.stringify({ id: userId, lastActive: now }),
    });
    return res.ok ? now : null;
  } catch {
    return null;
  }
};

export const deleteAccount = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/deleteAccount`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete account");
  return data;
};

export const checkUsernameAvailable = async (username) => {
  const res = await fetch(
    `${API_BASE_URL}/my-profile/username-available?username=${encodeURIComponent(username)}`,
    { headers: authHeaders() },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to check username");
  return data;
};

export const saveSettings = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/my-profile/settings`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save changes");
  return data;
};

/** The learner's own recent exam attempts (newest first), with `layerTitle` joined in. */
export const fetchExamHistory = async (limit = 10) => {
  const res = await fetch(`${API_BASE_URL}/api/exams/history?limit=${limit}`, {
    headers: authHeaders(),
    credentials: "include",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Couldn't load your exam history.");
  return data.history ?? [];
};

/** The learner's coding-challenge stats + their most recent solves. */
export const fetchChallengeStats = async () => {
  const res = await fetch(`${API_BASE_URL}/api/challenges/stats/me`, {
    headers: authHeaders(),
    credentials: "include",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message || "Couldn't load your challenge stats.");
  }
  return body.data;
};
