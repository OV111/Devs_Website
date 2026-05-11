import { CATEGORY_OPTIONS } from "../../constants/Categories";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizeCategoryValue = (value = "") =>
  value.toLowerCase().replace(/[\s&]+/g, "");

const filterLocalCategories = (query = "") => {
  const normalizedQuery = normalizeCategoryValue(query);
  if (!normalizedQuery) return [];

  return CATEGORY_OPTIONS.filter((category) => {
    const normalizedTitle = normalizeCategoryValue(category.title);
    const normalizedSlug = normalizeCategoryValue(category.slug);

    return (
      normalizedTitle.includes(normalizedQuery) ||
      normalizedSlug.includes(normalizedQuery)
    );
  }).map((category) => ({
    ...category,
    type: "category",
  }));
};

export const fetchUserData = async (query, isAuthenticated = false) => {
  const trimmedQuery = query?.trim() || "";
  if (!trimmedQuery || !isAuthenticated) return [];

  try {
    const request = await fetch(
      `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmedQuery)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const response = await request.json();
    if (!request.ok) {
      console.log("Search API error:", response);
      return [];
    }

    return response.results ?? [];
  } catch (err) {
    console.log("Search API error:", err);
    return [];
  }
};

export const fetchCategoryData = async (query) => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return [];

  try {
    const res = await fetch(
      `${API_BASE_URL}/search/categories?q=${encodeURIComponent(trimmedQuery)}`,
    );

    const data = await res.json();

    if (!res.ok) return [];

    return data.results ?? [];
  } catch (err) {
    console.log("Search API error:", err);
    return [];
  }
};
