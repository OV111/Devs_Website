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
    <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none">
      {children}
    </p>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
      <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse shrink-0" />
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
  
  return (
    <div className="absolute top-[calc(100%+8px)] w-full max-w-[400px] z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d18]/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl ring-1 ring-white/5">
      <div className="max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin">
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
                  <button
                    key={`${user.type}-${user.id || user.username}`}
                    type="button"
                    onClick={() => { setOpen(false); onSelect?.(user); }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-150 hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus:outline-none"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/40 to-blue-600/25 text-[11px] font-bold uppercase text-violet-300 ring-1 ring-violet-400/25">
                      {user.title?.[0] ?? "?"}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                        {user.title}
                      </span>
                      <span className="block truncate text-xs text-white/35 transition-colors group-hover:text-white/55">
                        @{user.username}
                      </span>
                    </span>
                    <svg className="shrink-0 text-white/20 opacity-0 transition-opacity group-hover:opacity-100" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                ))}
                {categories.length > 0 && (
                  <div>
                    <SectionLabel>Categories</SectionLabel>
                    {categories.map((category) => (
                      <button
                      key={`${category.type}-${category.id || category.title}`}
                      type="button"
                      onClick={() => { setOpen(false); onSelect?.(category); }}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-150 hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus:outline-none"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 ring-1 ring-violet-400/20 transition-colors duration-150 group-hover:bg-violet-500/25 group-hover:ring-violet-400/40">
                          <TagIcon />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block truncate text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                            {category.title}
                          </span>
                        </span>
                        <svg className="shrink-0 text-white/20 opacity-0 transition-opacity group-hover:opacity-100" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {categories.length > 0 && users.length > 0 && (
              <div className="my-1.5 mx-2 h-px bg-white/[0.06]" />
            )}


            {items.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <span className="text-xl text-white/20">⌕</span>
                <p className="text-sm text-white/35">
                  No results for{" "}
                  <span className="font-medium text-white/55">"{query}"</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
