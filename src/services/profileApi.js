import { API_BASE_URL, authHeaders } from "../../constants/api";

export const updateLastActive = async (userId) => {
  if (!userId) return;
  const now = new Date().toLocaleString();
  try {
    const res = await fetch(`${API_BASE_URL}/my-profile`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: userId, lastActive: now }),
    });
    return res.ok ? now : null;
  } catch {
    return null;
  }
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
