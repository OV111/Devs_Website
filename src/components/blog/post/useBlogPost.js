import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../constants/api";
import { decodePostId } from "./postModel.js";

/**
 * Loads one post. Aborts if the id changes or the page unmounts, so a slow
 * response for a previous post can never overwrite the current one. The page is
 * keyed by id, so state starts fresh for every post and needs no reset here.
 *
 * @returns {{ post: object|null, loading: boolean, error: string|null, retry: () => void }}
 */
export default function useBlogPost(id) {
  const [state, setState] = useState({ post: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const decoded = decodePostId(id);
    if (!decoded) {
      setState({ post: null, loading: false, error: "That post link isn't valid." });
      return;
    }

    const controller = new AbortController();
    const endpoint =
      decoded.type === "blog"
        ? `${API_BASE_URL}/blogs/id/${decoded.rawId}`
        : `${API_BASE_URL}/posts/${decoded.rawId}`;

    (async () => {
      try {
        const res = await fetch(endpoint, { signal: controller.signal });
        if (res.status === 404) {
          throw new Error("This post doesn't exist or was removed.");
        }
        if (!res.ok) throw new Error("Couldn't load this post. Please try again.");
        const json = await res.json();
        setState({ post: json.data ?? json, loading: false, error: null });
      } catch (err) {
        if (err.name === "AbortError") return;
        setState({ post: null, loading: false, error: err.message });
      }
    })();

    return () => controller.abort();
  }, [id, attempt]);

  const retry = () => {
    setState({ post: null, loading: true, error: null });
    setAttempt((n) => n + 1);
  };

  return { ...state, retry };
}
