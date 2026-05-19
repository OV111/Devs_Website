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
