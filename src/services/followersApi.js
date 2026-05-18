const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("JWT")}`,
});

export const fetchFollowers = async (page = 1, limit = 20) => {
  const res = await fetch(
    `${API_BASE_URL}/my-profile/followers?page=${page}&limit=${limit}`,
    { headers: authHeaders() },
  );
  if (!res.ok) throw new Error("Failed to fetch followers");
  return res.json();
};

export const fetchFollowing = async (page = 1, limit = 20) => {
  const res = await fetch(
    `${API_BASE_URL}/my-profile/following?page=${page}&limit=${limit}`,
    { headers: authHeaders() },
  );
  if (!res.ok) throw new Error("Failed to fetch following");
  return res.json();
};

export const toggleFollow = async (username, isFollowing) => {
  const res = await fetch(`${API_BASE_URL}/users/${username}/follow`, {
    method: isFollowing ? "DELETE" : "POST",
    headers: authHeaders(),
  });
  return res;
};
