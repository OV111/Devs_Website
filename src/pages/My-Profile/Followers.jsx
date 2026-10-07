import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import PageShell from "./components/PageShell";
import { SURFACE } from "@/components/ui/surface";
import useConnections from "@/features/connections/hooks/useConnections";
import ConnectionRow from "@/features/connections/components/ConnectionRow";
import ConnectionsSkeleton from "@/features/connections/components/ConnectionsSkeleton";
import { FILTERS, matchesQuery } from "@/features/connections/lib/connections";

const COPY = {
  followers: {
    subtitle: "People who follow you",
    empty: {
      title: "No followers yet",
      body: "Publish a post or share your profile — the people who follow you will show up here.",
      to: "/my-profile/add-blog",
      cta: "Write a post",
    },
  },
  following: {
    subtitle: "People you follow",
    empty: {
      title: "You're not following anyone yet",
      body: "Follow writers whose posts you like and they'll show up here.",
      to: "/blogs",
      cta: "Browse posts",
    },
  },
};

const tabClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
    isActive
      ? "bg-purple-600 text-white"
      : "text-neutral-300 hover:bg-white/[0.06] hover:text-white"
  }`;

const LINK_BUTTON =
  "mt-1 text-sm font-medium text-purple-300 underline hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400";

function Notice({ title, body, to, cta, action }) {
  return (
    <div className="flex flex-col items-start gap-2 px-5 py-10">
      <p className="text-base font-semibold text-neutral-100">{title}</p>
      {body && <p className="max-w-md text-sm text-neutral-400">{body}</p>}
      {to && (
        <Link
          to={to}
          className="mt-1 text-sm font-medium text-purple-300 hover:text-purple-200"
        >
          {cta} →
        </Link>
      )}
      {action}
    </div>
  );
}

function ConnectionsList({ kind }) {
  const copy = COPY[kind];
  const list = useConnections(kind);
  const [query, setQuery] = useState("");
  const [filterId, setFilterId] = useState("all");

  const filters = FILTERS[kind];
  const active = filters.find((f) => f.id === filterId) ?? filters[0];
  const visible = useMemo(
    () => list.items.filter((u) => active.test(u) && matchesQuery(u, query)),
    [list.items, active, query],
  );
  const narrowed = query.trim() !== "" || active.id !== "all";
  const total = list.counts[kind];

  const clearNarrowing = () => {
    setQuery("");
    setFilterId("all");
  };

  return (
    <PageShell title="Your network" subtitle={copy.subtitle}>
      <nav
        aria-label="Network"
        className="mt-6 flex w-fit gap-1 rounded-xl border border-white/[0.08] bg-neutral-950 p-1"
      >
        <NavLink to="/my-profile/followers" className={tabClass}>
          Followers
          <span className="font-mono text-xs opacity-80">
            {list.counts.followers ?? "–"}
          </span>
        </NavLink>
        <NavLink to="/my-profile/following" className={tabClass}>
          Following
          <span className="font-mono text-xs opacity-80">
            {list.counts.following ?? "–"}
          </span>
        </NavLink>
      </nav>

      <section className={`${SURFACE} mt-5 overflow-hidden`}>
        {/* search + filters */}
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search people</span>
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or @username"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-base md:text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
            />
          </label>

          <div
            role="group"
            aria-label="Filter"
            className="flex flex-wrap gap-2"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={f.id === active.id}
                onClick={() => setFilterId(f.id)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  f.id === active.id
                    ? "border-purple-400 bg-purple-500/15 text-purple-100"
                    : "border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* list states */}
        {list.status === "loading" && <ConnectionsSkeleton />}

        {list.status === "error" && (
          <div role="alert">
            <Notice
              title="Couldn't load this list"
              body={list.error?.message}
              action={
                <button
                  type="button"
                  onClick={list.retry}
                  className={LINK_BUTTON}
                >
                  Try again
                </button>
              }
            />
          </div>
        )}

        {list.status === "ready" && list.items.length === 0 && (
          <Notice {...copy.empty} />
        )}

        {list.status === "ready" &&
          list.items.length > 0 &&
          visible.length === 0 && (
            <Notice
              title="No one matches"
              body={
                list.hasMore
                  ? "Only the people loaded so far are searched — load more to look further."
                  : undefined
              }
              action={
                <button
                  type="button"
                  onClick={clearNarrowing}
                  className={LINK_BUTTON}
                >
                  Clear search and filters
                </button>
              }
            />
          )}

        {list.status === "ready" && visible.length > 0 && (
          <ul className="divide-y divide-white/[0.06]">
            {visible.map((user) => (
              <ConnectionRow
                key={String(user._id)}
                user={user}
                kind={kind}
                pending={list.isPending(user)}
                onToggle={list.toggle}
              />
            ))}
          </ul>
        )}

        {/* footer: count + load more */}
        {list.status === "ready" && list.items.length > 0 && (
          <div className="flex flex-col items-center gap-3 border-t border-white/[0.06] p-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-neutral-400" aria-live="polite">
              {narrowed
                ? `${visible.length} of ${list.items.length} loaded`
                : `Showing ${list.items.length}${total != null ? ` of ${total}` : ""}`}
            </p>
            {list.loadMoreError && (
              <p role="alert" className="text-sm text-amber-300">
                Couldn't load more.
              </p>
            )}
            {list.hasMore && (
              <button
                type="button"
                disabled={list.loadingMore}
                onClick={list.loadMore}
                className="rounded-lg border border-white/10 px-5 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-purple-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-wait disabled:opacity-60"
              >
                {list.loadingMore
                  ? "Loading…"
                  : list.loadMoreError
                    ? "Try again"
                    : "Load more"}
              </button>
            )}
          </div>
        )}
      </section>
    </PageShell>
  );
}

/** /my-profile/followers and /my-profile/following — one page, two lists. */
const Followers = () => {
  const { pathname } = useLocation();
  const kind = pathname.endsWith("/following") ? "following" : "followers";
  // Keyed by tab so search and filter reset instead of leaking between lists.
  return <ConnectionsList key={kind} kind={kind} />;
};

export default Followers;
