const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("JWT")}`,
});

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

export const fetchFavourites = async () => {
  const res = await fetch(`${API_BASE_URL}/blogs/favourites`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch favourites");
  return data.data;
};
