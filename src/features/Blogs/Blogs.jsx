import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BlogCard from "@/components/blog/BlogCard";
import { BlogCardSkeletonGrid } from "@/components/blog/BlogCardSkeleton";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { fetchBlogs } from "@/services/blogsApi";
import FilterMenu from "./components/FilterMenu";
import {
  BLOG_TOPICS,
  SORT_OPTIONS,
  DIFFICULTIES,
  READ_TIMES,
} from "../../../constants/Blogs";

const PAGE_SIZE = 12; // divisible by 2 and 3, so the grid never ends on a gap
const DEFAULTS = { sort: "Newest", page: "1" };
const toOptions = (list) => list.map((v) => ({ label: v, value: v }));

const chipClass = (active) =>
  `shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "border-white bg-white text-black"
      : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
  }`;

const Blogs = () => {
  // Filters live in the URL, not useState: a filtered view can be shared or
  // bookmarked, and Back/Forward step through filter changes.
  const [params, setParams] = useSearchParams();
  const topic = params.get("topic") ?? "";
  const sort = params.get("sort") ?? DEFAULTS.sort;
  const level = params.get("level") ?? "";
  const time = params.get("time") ?? "";
  const q = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  // One status instead of loading/error booleans that could disagree.
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [retryKey, setRetryKey] = useState(0);

  // Any filter change goes back to page 1 — page 3 of the old results means
  // nothing for the new ones. Defaults are removed to keep URLs short.
  const updateParams = (patch, { replace = false } = {}) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (!value || value === DEFAULTS[key]) next.delete(key);
          else next.set(key, value);
        }
        if (!("page" in patch)) next.delete("page");
        return next;
      },
      { replace },
    );
  };

  // Typing updates the URL once the user pauses. `replace` so each keystroke
  // pause doesn't add a Back-button step.
  useEffect(() => {
    setParams(
      (prev) => {
        if ((prev.get("q") ?? "") === debouncedSearch) return prev;
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set("q", debouncedSearch);
        else next.delete("q");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setParams]);

  useEffect(() => {
    // Abort the previous request when filters change, so a slow stale response
    // can never overwrite the results of a newer one.
    const controller = new AbortController();
    setStatus("loading");

    fetchBlogs(
      page,
      PAGE_SIZE,
      { category: topic, sort, difficulty: level, readTime: time, q },
      { signal: controller.signal },
    )
      .then(({ blogs, pagination }) => {
        setBlogs(blogs);
        setPagination(pagination);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [topic, sort, level, time, q, page, retryKey]);

  const goToPage = (n) => {
    updateParams({ page: String(n) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = Boolean(topic || level || time || q);
  const clearFilters = () => {
    setSearchInput("");
    setParams(sort === DEFAULTS.sort ? {} : { sort });
  };

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1
          className="text-4xl font-[450] tracking-tight text-white"
          style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
        >
          Blog
        </h1>
        <p className="mt-2 text-neutral-400">
          Articles from the community, organised by topic.
        </p>
      </header>

      {/* Search + menus */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex items-center sm:w-80">
          <Search size={15} className="pointer-events-none absolute left-3 text-neutral-500" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title…"
            aria-label="Search posts by title"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2 pr-9 pl-9 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-neutral-600"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-2.5 cursor-pointer text-neutral-500 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <div className="flex items-center gap-2">
          <FilterMenu
            label="Level"
            allLabel="All levels"
            value={level}
            options={toOptions(DIFFICULTIES)}
            onChange={(v) => updateParams({ level: v })}
          />
          <FilterMenu
            label="Read time"
            allLabel="Any length"
            value={time}
            options={toOptions(READ_TIMES)}
            onChange={(v) => updateParams({ time: v })}
          />
          <FilterMenu
            label={sort}
            value={sort}
            options={toOptions(SORT_OPTIONS)}
            onChange={(v) => updateParams({ sort: v })}
          />
        </div>
      </div>

      {/* Topics — scrolls sideways on small screens instead of wrapping into
          several rows that push the posts down. */}
      <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          <button type="button" onClick={() => updateParams({ topic: "" })} className={chipClass(!topic)}>
            All topics
          </button>
          {BLOG_TOPICS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateParams({ topic: value })}
              className={chipClass(topic === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Result summary */}
      <div className="mt-6 mb-5 flex h-6 items-center justify-between text-sm text-neutral-500">
        <span>
          {status === "ready" && pagination
            ? `${pagination.total} ${pagination.total === 1 ? "post" : "posts"}`
            : ""}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-neutral-400 transition-colors hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      <SkeletonTheme baseColor="#171717" highlightColor="#262626">
        {status === "loading" && <BlogCardSkeletonGrid count={6} />}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-800 py-20 text-center">
            <p className="font-medium text-neutral-200">Couldn&apos;t load posts</p>
            <p className="text-sm text-neutral-500">Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="mt-2 cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Retry
            </button>
          </div>
        )}

        {status === "ready" && blogs.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-800 py-20 text-center">
            <p className="font-medium text-neutral-200">No posts found</p>
            <p className="text-sm text-neutral-500">
              {hasFilters ? "Try a different topic or search." : "Nothing has been published yet."}
            </p>
          </div>
        )}

        {status === "ready" && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} card={blog} />
            ))}
          </div>
        )}
      </SkeletonTheme>

      {status === "ready" && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      )}
    </div>
  );
};

const pageNumbers = (page, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 4, "…", total];
  if (page >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", page - 1, page, page + 1, "…", total];
};

const pageBtn =
  "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30";

const Pagination = ({ page, totalPages, onChange }) => (
  <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={() => onChange(page - 1)}
      disabled={page === 1}
      aria-label="Previous page"
      className={`${pageBtn} text-neutral-400 hover:bg-neutral-900 hover:text-white`}
    >
      <ChevronLeft size={16} />
    </button>
    {pageNumbers(page, totalPages).map((n, i) =>
      n === "…" ? (
        <span key={`gap-${i}`} className="px-1 text-neutral-600">
          …
        </span>
      ) : (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`${pageBtn} ${
            n === page
              ? "bg-white font-medium text-black"
              : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
          }`}
        >
          {n}
        </button>
      ),
    )}
    <button
      type="button"
      onClick={() => onChange(page + 1)}
      disabled={page === totalPages}
      aria-label="Next page"
      className={`${pageBtn} text-neutral-400 hover:bg-neutral-900 hover:text-white`}
    >
      <ChevronRight size={16} />
    </button>
  </nav>
);

export default Blogs;
