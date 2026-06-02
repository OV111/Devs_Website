import { API_BASE_URL, authHeaders } from "../../constants/api";

export const fetchLibraryResources = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/library`);

  const { type, path, difficulty, topic, is_free, layer_id, q, page, limit } = params;

  if (type) {
    const types = Array.isArray(type) ? type : [type];
    types.forEach((t) => url.searchParams.append("type", t));
  }
  if (path) url.searchParams.set("path", path);
  if (difficulty) url.searchParams.set("difficulty", difficulty);
  if (topic) url.searchParams.set("topic", topic);
  if (is_free !== undefined && is_free !== null) url.searchParams.set("is_free", String(is_free));
  if (layer_id) url.searchParams.set("layer_id", layer_id);
  if (q) url.searchParams.set("q", q);
  if (page) url.searchParams.set("page", String(page));
  if (limit) url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch library resources");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch library resources");
  return { resources: data.data, pagination: data.pagination };
};

export const fetchLibraryResourceById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/library/${id}`);
  if (!res.ok) throw new Error("Failed to fetch resource");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch resource");
  return data.data;
};

export const fetchLibraryResourcesByLayer = async (layerId) => {
  const res = await fetch(`${API_BASE_URL}/library/layer/${layerId}`);
  if (!res.ok) throw new Error("Failed to fetch layer resources");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch layer resources");
  return data.data;
};

export const fetchLibraryResourceCounts = async () => {
  const res = await fetch(`${API_BASE_URL}/library/counts`);
  if (!res.ok) throw new Error("Failed to fetch resource counts");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch resource counts");
  return data.data;
};

export const fetchSavedResourceIds = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/library/saved-ids`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    return data.success ? new Set(data.ids) : new Set();
  } catch {
    return new Set();
  }
};

export const toggleSaveResource = async (id) => {
  const res = await fetch(`${API_BASE_URL}/library/${id}/save`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle save");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to toggle save");
  return data.saved;
};
