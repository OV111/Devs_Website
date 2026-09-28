import { API_BASE_URL, authHeaders } from "../../../../constants/api";

const jsonHeaders = { "Content-Type": "application/json" };

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/my-profile/chats/groups${path}`, {
    ...options,
    headers: { ...jsonHeaders, ...authHeaders(), ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const createGroupChat = (name, memberIds) =>
  request("", { method: "POST", body: JSON.stringify({ name, memberIds }) });

export const getGroupChatDetails = (roomId) => request(`/${roomId}`);

export const addGroupMember = (roomId, memberId) =>
  request(`/${roomId}/members`, {
    method: "POST",
    body: JSON.stringify({ memberId }),
  });

export const removeGroupMember = (roomId, memberId) =>
  request(`/${roomId}/members/${memberId}`, { method: "DELETE" });

export const leaveGroupChat = (roomId) =>
  request(`/${roomId}/leave`, { method: "POST" });

export const setGroupMemberAdmin = (roomId, memberId, promote) =>
  request(`/${roomId}/admins/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify({ promote }),
  });

export const updateGroupChat = (roomId, updates) =>
  request(`/${roomId}`, { method: "PATCH", body: JSON.stringify(updates) });
