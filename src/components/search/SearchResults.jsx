import React, { useEffect, useState } from "react";
import { fetchCategoryData, fetchUserData } from "../../services/SearchApi";
import useAuthStore from "@/stores/useAuthStore";

export default function SearchResults({ query = "", onSelect, boundaryRef }) {
  const { auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    let ignore = false;

    const loadResults = async () => {
      if (!normalizedQuery) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const userResults = auth
        ? await fetchUserData(normalizedQuery, auth)
        : [];
      const categoryResults = await fetchCategoryData(normalizedQuery);

      if (!ignore) {
        const users = auth && Array.isArray(userResults) ? userResults : [];
        const categories = Array.isArray(categoryResults)
          ? categoryResults
          : [];
        setItems([...categories, ...users]);
        setIsLoading(false);
      }
    };

    loadResults();
    return () => {
      ignore = true;
    };
  }, [auth, normalizedQuery]);

  useEffect(() => {
    setOpen(Boolean(normalizedQuery));
  }, [normalizedQuery]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const boundary = boundaryRef?.current;
      if (!boundary) return;

      if (boundary.contains(event.target)) {
        if (normalizedQuery) setOpen(true);
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [boundaryRef, normalizedQuery]);

  const users = items.filter((item) => item.type === "user");
  const categories = items.filter((item) => item.type === "category");

  if (!open) return null;
  return (
    <div className="absolute top-[calc(100%+6px)] w-full max-w-[400px] z-4 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-r from-dark-800 to-dark-900 shadow-2xl backdrop-blur-3xl ">
      <div className="max-h-80 overflow-auto p-2">
        {isLoading && (
          <div className="px-3 py-2 text-sm text-white/70">Searching...</div>
        )}

        {users.map((user) => (
          <button
            key={`${user.type}-${user.id || user.username}`}
            type="button"
            onClick={() => {
              setOpen(false);
              onSelect?.(user);
            }}
            className="cursor-pointer block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
          >
            <span className="font-medium">{user.title}</span>
            <span className="ml-2 text-white/60">~{user.username}</span>
          </button>
        ))}

        {categories.map((category) => (
          <button
            key={`${category.type}-${category.id || category.title}`}
            type="button"
            onClick={() => {
              setOpen(false);
              onSelect?.(category);
            }}
            className="cursor-pointer block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
          >
            <span className="font-medium">{category.title}</span>
          </button>
        ))}
        {!isLoading && items.length === 0 && (
          <div className="px-3 py-2 text-sm text-white/70">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
}
