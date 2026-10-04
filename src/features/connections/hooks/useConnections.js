import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchFollowers,
  fetchFollowing,
  toggleFollow,
} from "@/services/followersApi";

const PAGE_SIZE = 20;
const FETCH = { followers: fetchFollowers, following: fetchFollowing };

const initial = () => ({
  items: [],
  page: 0,
  hasMore: false,
  status: "loading", // "loading" | "ready" | "error"
  error: null,
  loadingMore: false,
  loadMoreError: false,
  counts: { followers: null, following: null },
  pending: new Set(), // ids with a follow request in flight
});

const idOf = (u) => String(u._id ?? u.id ?? u.username);

/**
 * One list (followers or following), paginated, with optimistic follow /
 * unfollow. The server decides who is mutual (`youFollow` / `followsYou` on
 * every row), so this never guesses from the pages it happens to have loaded.
 *
 * Unfollowing keeps the row and flips its button, so a mis-click is one click
 * to undo; the row is gone on the next load.
 */
export default function useConnections(kind) {
  const [state, setState] = useState(initial);
  const request = useRef(0); // ignore answers that arrive after the tab changed

  const load = useCallback(
    async (page) => {
      const mine = ++request.current;
      const first = page === 1;
      setState((s) =>
        first
          ? { ...initial(), counts: s.counts }
          : { ...s, loadingMore: true, loadMoreError: false },
      );
      try {
        const res = await FETCH[kind](page, PAGE_SIZE);
        if (mine !== request.current) return;
        const rows = res[kind] ?? [];
        setState((s) => ({
          ...s,
          items: first ? rows : [...s.items, ...rows],
          page,
          hasMore: Boolean(res.hasMore),
          status: "ready",
          loadingMore: false,
          counts: { followers: res.followersCount ?? 0, following: res.followingCount ?? 0 },
        }));
      } catch (error) {
        if (mine !== request.current) return;
        setState((s) =>
          first
            ? { ...s, status: "error", error, loadingMore: false }
            : { ...s, loadingMore: false, loadMoreError: true },
        );
      }
    },
    [kind],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const loadMore = useCallback(() => load(state.page + 1), [load, state.page]);

  const toggle = useCallback(async (user) => {
    const id = idOf(user);
    const was = user.youFollow;
    const flip = (value, delta) =>
      setState((s) => ({
        ...s,
        items: s.items.map((u) => (idOf(u) === id ? { ...u, youFollow: value } : u)),
        counts: { ...s.counts, following: Math.max((s.counts.following ?? 0) + delta, 0) },
      }));
    const setPending = (on) =>
      setState((s) => {
        const pending = new Set(s.pending);
        on ? pending.add(id) : pending.delete(id);
        return { ...s, pending };
      });

    setPending(true);
    flip(!was, was ? -1 : 1); // optimistic
    try {
      const res = await toggleFollow(user.username, was);
      if (!res.ok) throw new Error("request failed");
    } catch {
      flip(was, was ? 1 : -1); // roll back
      toast.error(`Couldn't ${was ? "unfollow" : "follow"} @${user.username}. Try again.`);
    } finally {
      setPending(false);
    }
  }, []);

  return { ...state, loadMore, retry: () => load(1), toggle, isPending: (u) => state.pending.has(idOf(u)) };
}
