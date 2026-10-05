import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import TrackCard from "./TrackCard";
import { buildCatalog, countByDomain, filterCatalog } from "../lib/catalog";
import { CATEGORY_OPTIONS2 } from "../../../../constants/Categories";

const CATALOG = buildCatalog();
const COUNTS = countByDomain(CATALOG);

const chipClass = (active) =>
  `inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
    active
      ? "border-white bg-white text-black"
      : "border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
  }`;

/**
 * Search + domain filter + card grid for every track. Replaces the two rows of
 * pills: with ~170 tracks, finding one by scanning buttons doesn't scale.
 */
export default function TrackCatalog({ onSelect }) {
  // Filters live in the URL (?domain=fullstack&q=react), not component state:
  // the catalog unmounts when a track is opened, and this way "All tracks"
  // brings the same search back, and a filtered view is a shareable link.
  const [params, setParams] = useSearchParams();
  const requested = params.get("domain");
  const domainId = COUNTS[requested] ? requested : "all";
  const query = params.get("q") ?? "";
  const searchRef = useRef(null);

  const updateParams = (next) => {
    const merged = { domain: domainId, q: query, ...next };
    const clean = {};
    if (merged.domain !== "all") clean.domain = merged.domain;
    if (merged.q !== "") clean.q = merged.q;
    setParams(clean, { replace: true });
  };
  const setDomainId = (id) => updateParams({ domain: id });
  const setQuery = (q) => updateParams({ q });

  const visible = useMemo(
    () => filterCatalog(CATALOG, { domainId, query }),
    [domainId, query],
  );
  const narrowed = domainId !== "all" || query.trim() !== "";

  // Ctrl/Cmd+K jumps to search, the shortcut people expect from catalog pages.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clearAll = () => {
    setDomainId("all");
    setQuery("");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <label className="relative mx-auto block max-w-xl">
        <span className="sr-only">Search tracks</span>
        <Search
          size={18}
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
        />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${CATALOG.length} tracks, e.g. react or python`}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-16 text-sm text-neutral-100 outline-none transition-colors placeholder:text-[#8A8A93] hover:border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
        />
        {query === "" && (
          <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-neutral-400 sm:block">
            Ctrl K
          </kbd>
        )}
      </label>

      <div
        role="group"
        aria-label="Filter by domain"
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        <button
          type="button"
          aria-pressed={domainId === "all"}
          onClick={() => setDomainId("all")}
          className={chipClass(domainId === "all")}
        >
          All <span className="font-mono text-xs opacity-70">{CATALOG.length}</span>
        </button>
        {CATEGORY_OPTIONS2.map((domain) => (
          <button
            key={domain.id}
            type="button"
            aria-pressed={domainId === domain.id}
            onClick={() => setDomainId(domain.id)}
            className={chipClass(domainId === domain.id)}
          >
            {domain.title}
            <span className="font-mono text-xs opacity-70">{COUNTS[domain.id] ?? 0}</span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-neutral-400" aria-live="polite">
        {narrowed
          ? `${visible.length} of ${CATALOG.length} tracks`
          : `${CATALOG.length} tracks`}
        {narrowed && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-3 inline-flex items-center gap-1 text-purple-300 hover:text-purple-200"
          >
            <X size={13} aria-hidden="true" /> Clear
          </button>
        )}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((track) => (
            <li key={`${track.domain.id}-${track.id}`}>
              <TrackCard track={track} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/[0.08] px-6 py-14 text-center">
          <p className="text-base font-medium text-neutral-100">
            No tracks match &ldquo;{query.trim()}&rdquo;
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Try a technology name, or clear the filters.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 text-sm font-medium text-purple-300 hover:text-purple-200"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
