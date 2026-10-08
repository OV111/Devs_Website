import React, { useEffect, useState } from "react";
import { fetchCategoryData, fetchUserData } from "../../services/SearchApi";
import useAuthStore from "@/stores/useAuthStore";

function TagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 select-none">
      {children}
    </p>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
      <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-3/5 rounded-full bg-white/10 animate-pulse" />
        <div className="h-2 w-2/5 rounded-full bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

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
      const userResults = auth ? await fetchUserData(normalizedQuery, auth) : [];
      const categoryResults = await fetchCategoryData(normalizedQuery);

      if (!ignore) {
        const users = auth && Array.isArray(userResults) ? userResults : [];
        const categories = Array.isArray(categoryResults) ? categoryResults : [];
        setItems([...categories, ...users]);
        setIsLoading(false);
      }
    };

    loadResults();
    return () => { ignore = true; };
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
    return () => { document.removeEventListener("mousedown", handlePointerDown); };
  }, [boundaryRef, normalizedQuery]);

  const users = items.filter((item) => item.type === "user");
  const categories = items.filter((item) => item.type === "category");

  if (!open) return null;

  const select = (item) => {
    setOpen(false);
    onSelect?.(item);
  };

  // Anchored to the right edge of the search wrapper and 360px wide on desktop, so it is
  // never as narrow as the 220px animated input it hangs under (full width inside the mobile menu).
  return (
    <div
      id="search-results"
      className="absolute right-0 top-[calc(100%+8px)] z-50 w-full md:w-[360px] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
    >
      <div
        className="max-h-80 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="space-y-0.5 p-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : (
          <div className="p-1.5">
            {users.length > 0 && (
              <div>
                <SectionLabel>Users</SectionLabel>
                {users.map((user) => (
                  <ResultRow
                    key={`${user.type}-${user.id || user.username}`}
                    onClick={() => select(user)}
                    icon={
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/40 to-blue-600/25 text-xs font-bold uppercase text-violet-300 ring-1 ring-violet-400/25">
                        {user.title?.[0] ?? "?"}
                      </span>
                    }
                    title={user.title}
                    subtitle={`@${user.username}`}
                  />
                ))}
              </div>
            )}

            {users.length > 0 && categories.length > 0 && <div className="mx-2 my-1.5 h-px bg-neutral-800" />}

            {categories.length > 0 && (
              <div>
                <SectionLabel>Categories</SectionLabel>
                {categories.map((category) => (
                  <ResultRow
                    key={`${category.type}-${category.id || category.title}`}
                    onClick={() => select(category)}
                    icon={
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 ring-1 ring-violet-400/20 transition-colors duration-150 group-hover:bg-purple-500/25 group-hover:ring-violet-400/40">
                        <TagIcon />
                      </span>
                    }
                    title={category.title}
                  />
                ))}
              </div>
            )}

            {items.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span className="text-xl text-neutral-500" aria-hidden="true">⌕</span>
                <p className="text-sm text-neutral-400">
                  No results for <span className="font-medium text-neutral-200">"{query}"</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-100">{title}</span>
        {subtitle && <span className="block truncate text-xs text-neutral-400">{subtitle}</span>}
      </span>
      <svg
        className="shrink-0 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}
