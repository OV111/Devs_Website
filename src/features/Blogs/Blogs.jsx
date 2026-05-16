import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "@/stores/useThemeStore";

const BlogCard = lazy(() => import("@/components/blog/BlogCard"));
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FILTER_TABS = [
  "All",
  "Latest",
  "Popular",
  "Frontend",
  "Backend",
  "DevOps",
  "AI / ML",
];
const SORT_OPTIONS = ["Newest", "Oldest", "Most Viewed"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const READ_TIMES = ["< 5 min", "5–10 min", "10+ min"];

const BlogCardSkeleton = () => (
  <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <Skeleton height={224} borderRadius={0} />
    <div className="space-y-3 px-6 py-4">
      <div className="flex justify-between">
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={12} />
      </div>
      <Skeleton height={20} width="85%" />
      <Skeleton height={14} count={2} />
    </div>
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Skeleton circle width={40} height={40} />
        <div>
          <Skeleton width={90} height={13} />
          <Skeleton width={60} height={11} style={{ marginTop: 4 }} />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton circle width={28} height={28} />
        <Skeleton circle width={28} height={28} />
        <Skeleton circle width={28} height={28} />
      </div>
    </div>
  </div>
);

const BlogCardSkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <BlogCardSkeleton key={i} />
    ))}
  </div>
);

const Blogs = () => {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const skeletonBaseColor = isDarkMode ? "#1f2937" : "#ebebeb";
  const skeletonHighlightColor = isDarkMode ? "#374151" : "#f5f5f5";

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [difficulty, setDifficulty] = useState("");
  const [readTime, setReadTime] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(null);

  const openMenu = (name) => setOpenDropdown(name);
  const closeMenu = () => setOpenDropdown(null);

  // Auto-focus search input when it opens
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const request = await fetch(
        `${VITE_API_BASE_URL}/blogs?page=${page}&limit=10`,
      );
      const data = await request.json();
      if (data.success) {
        setBlogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const filteredBlogs = searchQuery
    ? blogs.filter((b) =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : blogs;

  const totalPages = pagination?.totalPages ?? 1;

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-6">
      {/* ── Filter Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-3 flex flex-col gap-3"
      >
        {/* Row 1: tabs + actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="overflow-x-auto pb-1 sm:pb-0">
            <ul className="flex w-max gap-1 sm:w-auto sm:flex-wrap sm:gap-2">
              {FILTER_TABS.map((tab) => (
                <li key={tab}>
                  <button
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 ${
                      activeFilter === tab
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right actions: search expands left + search icon + sort dropdown */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Animated search input — expands to the left of the button */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 300 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 rounded-md bg-white px-3 py-1 dark:border-gray-700 dark:bg-gray-900">
                    <Search className="h-3 w-3 shrink-0 text-gray-400 dark:text-gray-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search blogs..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-gray-100 dark:placeholder-gray-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search icon button */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Toggle search"
              className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 transition-all duration-200 ${
                searchOpen
                  ? " bg-purple-600 text-white dark:border-purple-500"
                  : " bg-gray-100 text-gray-500  hover:bg-purple-50 hover:text-purple-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Level dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("level")}
              onMouseLeave={closeMenu}
            >
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 sm:px-3"
              >
                <span>{difficulty || "Level"}</span>
                <motion.span
                  animate={{ rotate: openDropdown === "level" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {openDropdown === "level" && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-md bg-white dark:border-gray-700 dark:bg-gray-900"
                  >
                    {["All", ...DIFFICULTIES].map((d) => (
                      <li key={d}>
                        <button
                          type="button"
                          onClick={() => {
                            setDifficulty(d === "All" ? "" : d);
                            closeMenu();
                          }}
                          className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
                        >
                          {d}
                          {(difficulty === d ||
                            (d === "All" && !difficulty)) && (
                            <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Time dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("time")}
              onMouseLeave={closeMenu}
            >
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 sm:px-3"
              >
                <span>{readTime || "Time"}</span>
                <motion.span
                  animate={{ rotate: openDropdown === "time" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {openDropdown === "time" && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-md  bg-white shadow-lg shadow-black/5 dark:bg-gray-900 dark:shadow-black/30"
                  >
                    {["All", ...READ_TIMES].map((t) => (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => {
                            setReadTime(t === "All" ? "" : t);
                            closeMenu();
                          }}
                          className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
                        >
                          {t}
                          {(readTime === t || (t === "All" && !readTime)) && (
                            <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("sort")}
              onMouseLeave={closeMenu}
            >
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 sm:px-3"
              >
                <span>{sortBy}</span>
                <motion.span
                  animate={{ rotate: openDropdown === "sort" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {openDropdown === "sort" && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-md  bg-white shadow-lg shadow-black/5  dark:bg-gray-900 "
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt}>
                        <button
                          type="button"
                          onClick={() => {
                            setSortBy(opt);
                            closeMenu();
                          }}
                          className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
                        >
                          {opt}
                          {sortBy === opt && (
                            <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Blog Posts Grid ── */}
      <div className="mt-5">
        <SkeletonTheme
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        >
          <Suspense fallback={<BlogCardSkeletonGrid />}>
            {loading ? (
              <BlogCardSkeletonGrid />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeFilter}-${sortBy}-${difficulty}-${readTime}-${page}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredBlogs.map((blog, i) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <BlogCard card={blog} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </Suspense>
        </SkeletonTheme>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded-md  bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:h-9 sm:w-9"
          >
            ‹
          </button>

          {getPageNumbers().map((num, i) =>
            num === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-8 w-8 items-center justify-center text-[13px] text-slate-400 sm:h-9 sm:w-9"
              >
                …
              </span>
            ) : (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[13px] font-medium transition sm:h-9 sm:w-9 ${
                  page === num
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                {num}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:h-9 sm:w-9"
          >
            ›
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Blogs;
