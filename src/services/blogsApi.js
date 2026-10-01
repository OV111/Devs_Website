import { API_BASE_URL, authHeaders } from "../../constants/api";

export const fetchDefaultPostsByCategory = async (categoryName) => {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryName}/default`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// `signal` lets the caller cancel a request that's no longer wanted (the user
// changed a filter mid-flight), so a slow old response can't overwrite a newer one.
export const fetchBlogs = async (page = 1, limit = 10, params = {}, { signal } = {}) => {
  const url = new URL(`${API_BASE_URL}/blogs`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  const { filter, sort, difficulty, readTime, category, q } = params;
  if (filter && filter !== "All" && filter !== "Latest")
    url.searchParams.set("filter", filter);
  if (sort && sort !== "Newest") url.searchParams.set("sort", sort);
  if (difficulty) url.searchParams.set("difficulty", difficulty);
  if (readTime) url.searchParams.set("readTime", readTime);
  if (category) url.searchParams.set("category", category);
  if (q) url.searchParams.set("q", q);
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error("Failed to fetch blogs");
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
  const res = await fetch(`${API_BASE_URL}/blogs/favourites`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch favourites");
  return data.data;
};

export const fetchMyBlogs = async () => {
  const res = await fetch(`${API_BASE_URL}/blogs/my-blogs`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch your blogs");
  return data.data;
};

export const updateBlog = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to update blog");
  return data.data;
};

export const deleteBlog = async (id) => {
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to delete blog");
  return data;
};
