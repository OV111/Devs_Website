import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TABS } from "../../../constants/LibsPage";
import { LIBS_DATA } from "../../../constants/libs";
import {
  fetchLibraryResourceCounts,
  fetchSavedResourceIds,
  toggleSaveResource,
} from "../../services/libraryApi";
import FilterSidebar from "./FilterSidebar";
import ActiveFilters from "./ActiveFilters";
import LibCard from "./LibCard";
import ResourceSection from "./ResourceSection";
import ResourceSkeleton from "./ResourceSkeleton";
import SectionHeader from "./SectionHeader";
import { CARD_GRID, SECTION_ORDER } from "./grids";
import { useLibraryResources } from "./useLibraryResources";

// LibsPage tab key → API `type` value (null = every type)
const TAB_TO_TYPE = { all: null, books: "book", docs: "documentation", guides: "guide", sheets: "cheatsheet" };
const TAB_TO_COUNT_KEY = { all: "total", books: "book", docs: "documentation", guides: "guide", sheets: "cheatsheet" };
const NO_FILTERS = { path: null, difficulty: null, is_free: null };

export default function LibsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer only
  const [filters, setFilters] = useState(NO_FILTERS);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [counts, setCounts] = useState(null);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const searchInputRef = useRef(null);
  const tabRefs = useRef({});

  const isLibrariesTab = activeTab === "libraries";

  const { resources, total, loading, error, retry } = useLibraryResources({
    type: TAB_TO_TYPE[activeTab],
    path: filters.path,
    difficulty: filters.difficulty,
    isFree: filters.is_free,
    q: debouncedSearch,
    enabled: !isLibrariesTab,
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchLibraryResourceCounts().then(setCounts).catch(() => {});
    fetchSavedResourceIds().then(setSavedIds);
  }, []);

  // "/" focuses search (unless you're already typing somewhere); Esc closes the drawer.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFiltersOpen(false);
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleToggleSave = useCallback(async (resourceId) => {
    try {
      const nowSaved = await toggleSaveResource(resourceId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (nowSaved) next.add(String(resourceId));
        else next.delete(String(resourceId));
        return next;
      });
    } catch {
      toast.error("Couldn't update your saved list. Make sure you're signed in.");
    }
  }, []);

  const visibleLibs = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return LIBS_DATA.filter((l) => activeCategory === "all" || l.category === activeCategory).filter(
      (l) =>
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [activeCategory, debouncedSearch]);

  const grouped = useMemo(
    () => Object.fromEntries(SECTION_ORDER.map((type) => [type, resources.filter((r) => r.type === type)])),
    [resources],
  );

  const activeFiltersCount = [filters.path, filters.difficulty, filters.is_free].filter((v) => v !== null).length;
  const clearFilters = () => setFilters(NO_FILTERS);
  const clearAll = () => {
    clearFilters();
    setSearch("");
  };

  const countFor = (tab) => {
    if (tab.key === "libraries") return LIBS_DATA.length;
    return counts?.[TAB_TO_COUNT_KEY[tab.key]] ?? null;
  };

  // Roving tabindex + arrow keys, per the WAI-ARIA tabs pattern.
  const onTabKeyDown = (e, index) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = TABS[(index + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
    setActiveTab(next.key);
    tabRefs.current[next.key]?.focus();
  };

  const resultCount = isLibrariesTab ? visibleLibs.length : resources.length;
  const hasQuery = Boolean(debouncedSearch) || activeFiltersCount > 0;
  const sidebarProps = { activeTab, activeCategory, setActiveCategory, filters, setFilters };

  return (
    <div className="flex bg-black text-neutral-200">
      <Toaster position="top-center" />

      {/* Desktop: always-visible filter rail */}
      <aside
        aria-label="Filters"
        className="no-scrollbar hidden w-56 shrink-0 border-r border-neutral-800 lg:sticky lg:top-0 lg:block lg:max-h-screen lg:min-h-screen lg:overflow-y-auto"
      >
        <FilterSidebar {...sidebarProps} />
      </aside>

      {/* Mobile / tablet: filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/70"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] overflow-y-auto border-r border-neutral-800 bg-black">
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
              <span className="text-sm font-semibold text-neutral-100">Filters</span>
              <button
                type="button"
                autoFocus
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-md p-2 text-neutral-400 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-purple-400"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <FilterSidebar {...sidebarProps} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">Coding Library</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
            Books, docs, guides, cheat sheets and packages. Filter by learning path and difficulty.
          </p>
        </header>

        {/* Toolbar: search is always visible; Filters button only where the rail is hidden */}
        <div className="mb-5 flex gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isLibrariesTab ? "Search packages…" : "Search books, docs, guides…"}
              aria-label="Search the library"
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 py-2 pl-9 pr-12 text-base sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-700 px-1.5 text-[11px] text-neutral-400 sm:block"
            >
              /
            </kbd>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-purple-400 lg:hidden"
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-purple-600 px-1.5 text-xs text-white">{activeFiltersCount}</span>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Resource type"
          className="no-scrollbar mb-6 flex gap-6 overflow-x-auto whitespace-nowrap border-b border-neutral-800"
        >
          {TABS.map((tab, i) => {
            const selected = activeTab === tab.key;
            const count = countFor(tab);
            return (
              <button
                key={tab.key}
                ref={(el) => (tabRefs.current[tab.key] = el)}
                role="tab"
                id={`tab-${tab.key}`}
                aria-selected={selected}
                aria-controls="libs-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 pb-2 text-sm capitalize transition-colors focus-visible:outline-2 focus-visible:outline-purple-400 ${
                  selected
                    ? "border-purple-500 text-neutral-50"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {tab.label}
                {count !== null && (
                  <span
                    className={`rounded-sm bg-neutral-900 px-1.5 py-0.5 text-xs ${
                      selected ? "text-purple-300" : "text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isLibrariesTab && (
          <ActiveFilters filters={filters} setFilters={setFilters} onClearAll={clearFilters} />
        )}

        <div id="libs-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} tabIndex={-1}>
          <p role="status" className="sr-only">
            {loading ? "Loading resources" : `${resultCount} results`}
          </p>

          {/* Packages tab: static data from constants/libs.js */}
          {isLibrariesTab &&
            (visibleLibs.length > 0 ? (
              <section aria-label="Packages">
                <SectionHeader title="Packages" count={visibleLibs.length} />
                <div className={CARD_GRID}>
                  {visibleLibs.map((lib) => (
                    <LibCard key={lib.id} lib={lib} />
                  ))}
                </div>
              </section>
            ) : (
              <EmptyState
                message={debouncedSearch ? `No packages match "${debouncedSearch}".` : "No packages in this category."}
                onClear={debouncedSearch ? () => setSearch("") : () => setActiveCategory("all")}
                clearLabel={debouncedSearch ? "Clear search" : "Show all categories"}
              />
            ))}

          {/* API tabs */}
          {!isLibrariesTab && loading && <ResourceSkeleton variant={activeTab === "books" ? "book" : "card"} />}

          {!isLibrariesTab && !loading && error && (
            <div role="alert" className="rounded-md border border-red-500/30 bg-red-500/5 p-5">
              <p className="text-sm text-neutral-200">Couldn't load the library. Check your connection and try again.</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
              >
                Try again
              </button>
            </div>
          )}

          {!isLibrariesTab && !loading && !error && resources.length === 0 && (
            <EmptyState
              message={hasQuery ? "No resources match your search and filters." : "Nothing here yet."}
              onClear={hasQuery ? clearAll : undefined}
              clearLabel="Clear search and filters"
            />
          )}

          {!isLibrariesTab && !loading && !error && resources.length > 0 && (
            <>
              {activeTab === "all" ? (
                SECTION_ORDER.map((type) => (
                  <ResourceSection
                    key={type}
                    type={type}
                    items={grouped[type]}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                  />
                ))
              ) : (
                <ResourceSection
                  type={TAB_TO_TYPE[activeTab]}
                  items={resources}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  showHeader={false}
                />
              )}
              {total > resources.length && (
                <p className="text-sm text-neutral-400">
                  Showing {resources.length} of {total}. Narrow it down with search or filters.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ message, onClear, clearLabel }) {
  return (
    <div className="rounded-md border border-dashed border-neutral-700 p-8 text-center">
      <p className="text-sm text-neutral-300">{message}</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-sm font-medium text-purple-400 underline hover:text-purple-300 focus-visible:outline-2 focus-visible:outline-purple-400"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}
