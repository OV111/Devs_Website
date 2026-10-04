import { API_BASE_URL, authHeaders } from "../../../../constants/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/my-profile/chats${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const setRoomMuted = (roomId, muted) =>
  request(`/rooms/${roomId}/mute`, {
    method: "PATCH",
    body: JSON.stringify({ muted }),
  });

export const clearRoom = (roomId) =>
  request(`/rooms/${roomId}/clear`, { method: "POST" });

export const getBlockedIds = () => request("/blocks");

export const blockUser = (userId) =>
  request(`/blocks/${userId}`, { method: "PUT" });

export const unblockUser = (userId) =>
  request(`/blocks/${userId}`, { method: "DELETE" });

// Blocked people with name / username / avatar, for the Blocked users page.
export const getBlockedUserList = async () => {
  const res = await fetch(`${API_BASE_URL}/my-profile/blocked-users`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load blocked users");
  return data.users;
};
