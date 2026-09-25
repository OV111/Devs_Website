import { create } from "zustand";
import { API_BASE_URL, authHeaders } from "../../../../constants/api";

/**
 * Challenge data layer.
 *
 * The API is the vocabulary: components read `slug`, `summary`, `difficulty`,
 * `estimatedMins` and `stats.solves` directly. Nothing is renamed on the way
 * in — one set of field names across the stack.
 *
 * Filtering stays client-side for now. The published set is small, and the
 * filter UI speaks in layer *numbers* ("3", "4+") while the API speaks in
 * layer *ids* ("api-dev-3"). Pushing filters server-side is worth doing once
 * the bank is large enough to paginate for real.
 */

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/api/challenges${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
};

const useChallengeStore = create((set, get) => ({
  challenges: [],
  topics: [],
  daily: null,
  challenge: null,

  // The live attempt session: the user's saved draft, the hints they've paid
  // for, and what it cost them.
  attempt: null,

  loading: false,
  error: null,

  loadList: async () => {
    set({ loading: true, error: null });
    try {
      const [list, topics, daily] = await Promise.all([
        request("?limit=100"),
        request("/topics"),
        request("/daily"),
      ]);
      set({
        challenges: list.items ?? [],
        topics: topics.tags ?? [],
        daily: daily.data ?? null,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  loadChallenge: async (slug) => {
    // Avoid a refetch flash when navigating back to a challenge already open.
    if (get().challenge?.slug === slug) return;

    set({ loading: true, error: null, challenge: null });
    try {
      const { data } = await request(`/${slug}`);
      set({ challenge: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  /**
   * Open (or resume) the attempt session for a challenge. The server is
   * idempotent here, so calling it again on a revisit returns the same
   * document with the saved draft intact.
   */
  startAttempt: async (slug) => {
    try {
      const { data } = await request("/attempts", {
        method: "POST",
        body: JSON.stringify({ slug }),
      });
      set({ attempt: data });
      return data;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  /**
   * Persist the editor draft. Fire-and-forget by design: an autosave that
   * interrupts typing to report a transient network blip is worse than one
   * that silently retries on the next keystroke batch.
   */
  saveDraft: async (code) => {
    const { attempt } = get();
    if (!attempt) return;
    try {
      await request(`/attempts/${attempt._id}`, {
        method: "PATCH",
        body: JSON.stringify({ code }),
      });
    } catch {
      /* non-fatal — the next autosave carries the same content */
    }
  },

  /** Buy and reveal a hint. Charges XP server-side; idempotent on replay. */
  revealHint: async (order) => {
    const { attempt } = get();
    if (!attempt) return null;
    // This endpoint spreads its payload rather than nesting it under `data`.
    const result = await request(`/attempts/${attempt._id}/hints/${order}`, {
      method: "POST",
    });
    set((state) => ({
      attempt: {
        ...state.attempt,
        hintsRevealed: result.hintsRevealed,
        xpSpent: result.xpSpent,
      },
    }));
    return result;
  },

  /**
   * Grade the attempt server-side against the hidden tests. This is the only
   * result that pays XP — the in-browser Run is advisory.
   */
  submitAttempt: async () => {
    const { attempt } = get();
    if (!attempt) return null;
    return request(`/submissions/${attempt._id}`, { method: "POST" });
  },

  clearChallenge: () => set({ challenge: null, attempt: null }),
}));

export default useChallengeStore;
