import { useEffect, useState } from "react";
import { fetchLibraryResources } from "../../services/libraryApi";

const LIMIT = 50;

/**
 * Fetches library resources for the current filters.
 * Each run owns an AbortController: when filters change mid-flight the old
 * request is cancelled, so a slow stale response can never overwrite a newer one.
 */
export function useLibraryResources({ type, path, difficulty, isFree, q, enabled = true }) {
  const [state, setState] = useState({ resources: [], total: null, loading: enabled, error: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: false }));

    const params = { limit: LIMIT };
    if (type) params.type = type;
    if (path) params.path = path;
    if (difficulty) params.difficulty = difficulty;
    if (isFree !== null) params.is_free = isFree;
    if (q) params.q = q;

    fetchLibraryResources(params, controller.signal)
      .then(({ resources, pagination }) =>
        setState({ resources, total: pagination?.total ?? resources.length, loading: false, error: false }),
      )
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, error: true }));
      });

    return () => controller.abort();
  }, [type, path, difficulty, isFree, q, enabled, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
