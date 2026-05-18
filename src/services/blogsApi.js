import { API_BASE_URL, authHeaders } from "../../constants/api";

export const fetchBlogs = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE_URL}/blogs?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch blogs");
  return { blogs: data.data, pagination: data.pagination };
};

export const fetchSavedIds = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/saved-ids`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    return data.success ? new Set(data.ids) : new Set();
  } catch {
    return new Set();
  }
};

export const fetchLikedIds = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/liked-ids`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    return data.success ? new Set(data.ids) : new Set();
  } catch {
    return new Set();
  }
};

export const fetchUserBlogs = async (userId, limit) => {
  const url = limit
    ? `${API_BASE_URL}/blogs/user/${userId}?limit=${limit}`
    : `${API_BASE_URL}/blogs/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch user blogs");
  const data = await res.json();
  return data.data ?? [];
};

export const fetchFavourites = async () => {
  const res = await fetch(`${API_BASE_URL}/blogs/favourites`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch favourites");
  return data.data;
};
