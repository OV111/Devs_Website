const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("JWT")}`,
});

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
