import { API_BASE_URL, authHeaders } from "../../constants/api";

export const fetchUserProfile = async (username) => {
  const res = await fetch(`${API_BASE_URL}/users/${username}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("User not found");
  return res.json();
};

export const toggleFollow = async (username, isFollowing) => {
  const res = await fetch(`${API_BASE_URL}/users/${username}/follow`, {
    method: isFollowing ? "DELETE" : "POST",
    headers: authHeaders(),
  });
  return res;
};
