import { useState, useRef, useEffect, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { TRACKS } from "../../../../constants/roadmapPaths";
import { CATEGORY_OPTIONS2 } from "../../../../constants/Categories";
import useRoadmapStore from "../../../stores/useRoadmapStore";

const CATEGORY_MAP = Object.fromEntries(
  CATEGORY_OPTIONS2.map((c) => [c.id, c])
);

const ALL_RESULTS = Object.entries(TRACKS).flatMap(([categoryId, tracks]) =>
  tracks.map((track) => ({
    ...track,
    categoryId,
    categoryTitle: CATEGORY_MAP[categoryId]?.title ?? categoryId,
  }))
);

export default function RoadmapSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const { setCategory, setTrack } = useRoadmapStore();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_RESULTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.categoryTitle.toLowerCase().includes(q) ||
        r.techs.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (result) => {
    const category = CATEGORY_MAP[result.categoryId];
    if (!category) return;
    setCategory(category);
    setTrack(result);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto mb-8">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Search specializations, techs, categories..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <Motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-[#0f0a1e] border border-purple-500/20 rounded-xl overflow-hidden shadow-xl shadow-purple-900/30"
          >
            {results.map((r) => (
              <li key={`${r.categoryId}-${r.id}`}>
                <button
                  onMouseDown={() => handleSelect(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-500/10 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 shrink-0">
                        {r.categoryTitle}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {r.techs.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] text-purple-400/70 group-hover:text-purple-300/80 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg
                    className="w-3.5 h-3.5 text-purple-500/40 group-hover:text-purple-400 transition-colors shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </Motion.ul>
        )}
        {open && query.trim() && results.length === 0 && (
          <Motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-[#0f0a1e] border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-purple-300/50 shadow-xl shadow-purple-900/30"
          >
            No specializations found for &ldquo;{query}&rdquo;
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
