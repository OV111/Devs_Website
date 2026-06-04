import React, { useState, useEffect, useCallback, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import LoadingSuspense from "../../components/feedback/LoadingSuspense";
import { TABS } from "../../../constants/LibsPage";
import { LIBS_DATA } from "../../../constants/libs";
import { PanelLeft, Search, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import LibCard from "./LibCard";
import ResourceCard from "./ResourceCard";
import BookCard from "./BookCard";
import SectionHeader from "./SectionHeader";
import EyebrowBadge from "@/components/ui/EyebrowBadge";
import {
  fetchLibraryResources,
  fetchLibraryResourceCounts,
  fetchSavedResourceIds,
  toggleSaveResource,
} from "../../services/libraryApi";

// Map LibsPage tab keys → API type values
const TAB_TO_TYPE = {
  all: null,
  books: "book",
  docs: "documentation",
  guides: "guide",
  sheets: "cheatsheet",
};

export default function LibsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live API filters
  const [filters, setFilters] = useState({
    path: null,
    difficulty: null,
    is_free: null,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [resources, setResources] = useState([]);
  const [counts, setCounts] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch type counts once
  useEffect(() => {
    fetchLibraryResourceCounts()
      .then(setCounts)
      .catch(() => {});
  }, []);

  // Fetch saved IDs once (silently fails if not logged in)
  useEffect(() => {
    fetchSavedResourceIds().then(setSavedIds);
  }, []);

  const handleToggleSave = async (resourceId) => {
    const nextSaved = await toggleSaveResource(resourceId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nextSaved) next.add(resourceId);
      else next.delete(resourceId);
      return next;
    });
    return nextSaved;
  };

  // Determine whether the active tab maps to the live API or the static libs list
  const isStaticTab = activeTab === "libraries";

  // Filtered static libs (for the "libraries" tab — uses constants/libs.js)
  const filteredLibs =
    activeCategory === "all"
      ? LIBS_DATA
      : LIBS_DATA.filter((l) => l.category === activeCategory);

  // Fetch from API whenever filters / tab / search change (skip for static "libraries" tab)
  const fetchResources = useCallback(async () => {
    if (isStaticTab) return;
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 50 };
      const type = TAB_TO_TYPE[activeTab];
      if (type) params.type = type;
      if (filters.path) params.path = filters.path;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.is_free !== null) params.is_free = filters.is_free;
      if (debouncedSearch) params.q = debouncedSearch;

      const { resources: data } = await fetchLibraryResources(params);
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters, debouncedSearch, isStaticTab]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const activeFiltersCount = [
    filters.path,
    filters.difficulty,
    filters.is_free,
  ].filter((v) => v !== null).length;

  const countFor = (tab) => {
    if (!counts) return null;
    if (tab.key === "all") return counts.total;
    if (tab.key === "books") return counts.book;
    if (tab.key === "docs") return counts.documentation;
    if (tab.key === "guides") return counts.guide;
    if (tab.key === "sheets") return counts.cheatsheet;
    return tab.count; // "libraries" uses the static count from constants
  };

  return (
    <div className="flex bg-gray-950 text-[#e5e5e5]">
      <div
        className={`shrink-0 overflow-y-auto transition-[width] duration-200 ease-linear ${sidebarOpen ? "border-r border-gray-800" : ""}`}
        style={{
          width: sidebarOpen ? 220 : 0,
          overflow: sidebarOpen ? "auto" : "hidden",
        }}
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen ? "" : undefined}
      >
        <FilterSidebar
          activeTab={activeTab}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <main className="flex-1 px-8 py-7 overflow-y-auto min-w-0">
        <div className="grid items-start justify-between gap-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                title={sidebarOpen ? "Collapse filters" : "Expand filters"}
                className={`relative cursor-pointer flex items-center justify-center p-1 rounded-md transition-colors hover:text-purple-600 hover:bg-purple-600/10 ${
                  sidebarOpen ? "text-[#e5e5e5]" : "text-[#555]"
                }`}
              >
                <PanelLeft size={18} />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[8px] flex items-center justify-center rounded-full bg-purple-600 text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <EyebrowBadge dot text="ai-powered · curated · roadmap-linked" color="purple" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              The Coding Library.{" "}
              <span className="bg-linear-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                Everything you need,
              </span>
              <br />
            </h1>
            <p className="text-sm mt-3 max-w-lg leading-relaxed text-[#555]">
              Curated libraries, books, docs, and guides — organized by path and
              layer so the agent points you to exactly the right resource at the
              right time.
            </p>
          </div>
        </div>

        {!isStaticTab && activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.path && (
              <button
                onClick={() => setFilters((f) => ({ ...f, path: null }))}
                className="text-[10px] px-2 py-1 text-purple-600 border border-purple-600/30 bg-purple-600/[0.07]"
              >
                {filters.path} ×
              </button>
            )}
            {filters.difficulty && (
              <button
                onClick={() => setFilters((f) => ({ ...f, difficulty: null }))}
                className="text-[10px] px-2 py-1 text-purple-600 border border-purple-600/30 bg-purple-600/[0.07]"
              >
                {filters.difficulty} ×
              </button>
            )}
            {filters.is_free !== null && (
              <button
                onClick={() => setFilters((f) => ({ ...f, is_free: null }))}
                className="text-[10px] px-2 py-1 text-purple-600 border border-purple-600/30 bg-purple-600/[0.07]"
              >
                {filters.is_free ? "free only" : "paid"} ×
              </button>
            )}
            <button
              onClick={() =>
                setFilters({ path: null, difficulty: null, is_free: null })
              }
              className="text-[10px] px-2 py-1 text-[#555] border border-[#222]"
            >
              clear all
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-between mb-6 border-b border-[#1a1a1a]">
          <div className="flex justify-between gap-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-[14px] flex items-center gap-1.5 cursor-pointer transition-colors -mb-px border-b-2 ${
                  activeTab === tab.key
                    ? "text-[#e5e5e5] border-purple-600"
                    : "text-[#444] border-transparent"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-sm bg-[#1a1a1a] ${
                    activeTab === tab.key ? "text-purple-600" : "text-[#444]"
                  }`}
                >
                  {countFor(tab) ?? tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex position-end mb-2">
            {!isStaticTab && (
              <div
                className="flex items-center gap-2"
                onMouseEnter={() => setSearchOpen(true)}
                onMouseLeave={() => {
                  if (!search && document.activeElement !== searchInputRef.current) setSearchOpen(false);
                }}
              >
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 300 }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 rounded-md bg-[#111] border border-[#222] px-3 py-0.5">
                        <Search className="h-3 w-3 shrink-0 text-[#555]" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search resources..."
                          className="min-w-0 flex-1 bg-transparent text-sm text-[#e5e5e5] placeholder-[#444] outline-none"
                        />
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="shrink-0 text-[#555] hover:text-[#e5e5e5] transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 transition-all duration-200 ${
                    searchOpen
                      ? "bg-purple-600 text-white"
                      : "bg-[#1a1a1a] text-[#555] hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Agent Banner */}
        <div className="flex items-start justify-between gap-4 p-4 mb-8 rounded-sm border border-[#2d1b4e] bg-[#0f0b1a]">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 border border-[#3b2060]">
              <span className="text-purple-600 text-xs">▣</span>
            </div>
            <div>
              <p className="text-xs font-bold mb-1 text-purple-600">
                // AGENT PICKED 3 RESOURCES FOR YOUR WEAK SPOT
              </p>
              <p className="text-xs text-[#666]">
                "async error handling" — start here, then move to streams.
              </p>
            </div>
          </div>
          <button className="text-xs px-3 py-1.5 shrink-0 transition-opacity hover:opacity-80 text-purple-600 border border-[#3b2060] bg-transparent">
            view picks →
          </button>
        </div>

        {/* ── Static: npm libraries (constants/libs.js) ─────────────────────── */}
        {(activeTab === "libraries" || activeTab === "all") && (
          <div className="mb-10">
            <SectionHeader
              title={`libraries · ${filteredLibs.length} packages`}
            />
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {filteredLibs.map((lib) => (
                <LibCard key={lib.id} lib={lib} />
              ))}
            </div>
          </div>
        )}

        {/* ── Live API: books / docs / guides / cheatsheets ─────────────────── */}
        {activeTab !== "libraries" && (
          <>
            {loading && (
              <p className="text-sm py-8" style={{ color: "#555" }}>
                Loading resources...
              </p>
            )}
            {error && (
              <div className="py-8">
                <p className="text-sm" style={{ color: "#f87171" }}>
                  Failed to load: {error}
                </p>
                <button
                  onClick={fetchResources}
                  className="mt-2 text-xs underline text-purple-600"
                >
                  retry
                </button>
              </div>
            )}
            {!loading && !error && resources.length === 0 && activeTab !== "all" && (
              <div className="py-8 text-[#555]">
                <p className="text-sm">No resources match your filters.</p>
                <button
                  onClick={() => setFilters({ path: null, difficulty: null, is_free: null })}
                  className="mt-2 text-xs underline text-purple-600"
                >
                  clear filters
                </button>
              </div>
            )}

            {/* ── "all" tab — one section per type ── */}
            {!loading && !error && activeTab === "all" && (() => {
              const books = resources.filter((r) => r.type === "book");
              const docs  = resources.filter((r) => r.type === "documentation");
              const guides = resources.filter((r) => r.type === "guide");
              const sheets = resources.filter((r) => r.type === "cheatsheet");

              return (
                <>
                  {books.length > 0 && (
                    <div className="mb-12">
                      <SectionHeader title={`books · ${books.length}`} />
                      <div
                        className="grid gap-6"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}
                      >
                        {books.map((r) => (
                          <BookCard
                            key={r._id}
                            resource={r}
                            isSaved={savedIds.has(r._id.toString())}
                            onToggleSave={handleToggleSave}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {docs.length > 0 && (
                    <div className="mb-12">
                      <SectionHeader title={`documentation · ${docs.length}`} />
                      <div
                        className="grid gap-4"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
                      >
                        {docs.map((r) => (
                          <ResourceCard
                            key={r._id}
                            resource={r}
                            isSaved={savedIds.has(r._id.toString())}
                            onToggleSave={handleToggleSave}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {guides.length > 0 && (
                    <div className="mb-12">
                      <SectionHeader title={`guides · ${guides.length}`} />
                      <div
                        className="grid gap-4"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
                      >
                        {guides.map((r) => (
                          <ResourceCard
                            key={r._id}
                            resource={r}
                            isSaved={savedIds.has(r._id.toString())}
                            onToggleSave={handleToggleSave}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {sheets.length > 0 && (
                    <div className="mb-12">
                      <SectionHeader title={`cheatsheets · ${sheets.length}`} />
                      <div
                        className="grid gap-4"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
                      >
                        {sheets.map((r) => (
                          <ResourceCard
                            key={r._id}
                            resource={r}
                            isSaved={savedIds.has(r._id.toString())}
                            onToggleSave={handleToggleSave}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* ── single-type tabs (books / docs / guides / sheets) ── */}
            {!loading && !error && resources.length > 0 && activeTab !== "all" && (
              <div className="mb-10">
                <SectionHeader title={`${activeTab} · ${resources.length}`} />
                {activeTab === "books" ? (
                  <div
                    className="grid gap-6"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}
                  >
                    {resources.map((r) => (
                      <BookCard
                        key={r._id}
                        resource={r}
                        isSaved={savedIds.has(r._id.toString())}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
                  >
                    {resources.map((r) => (
                      <ResourceCard
                        key={r._id}
                        resource={r}
                        isSaved={savedIds.has(r._id.toString())}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
