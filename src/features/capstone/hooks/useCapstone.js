import { useCallback, useEffect, useRef, useState } from "react";
import { capstoneApi } from "../capstoneApi";

// While the server holds one of these locks (possibly from another tab), poll
// so the page moves on by itself when it finishes.
const IN_PROGRESS = ["checking", "reviewing"];
const POLL_MS = 5000;

// A defense exists once the review passed; after that the attempt can be in
// defense, passed, or failed (a failed defense also ends there).
const HAS_DEFENSE = ["defense", "passed", "failed"];

/**
 * All capstone state for one track, straight from the server. The page never
 * decides what is allowed — it renders `status` and calls actions; after every
 * action the server's answer replaces local state.
 */
export default function useCapstone(trackId) {
  const [status, setStatus] = useState(null);
  const [defense, setDefense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(null); // name of the running action, or null
  const [actionError, setActionError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const next = await capstoneApi.status(trackId);
      const withDefense =
        next.attempt &&
        HAS_DEFENSE.includes(next.attempt.status) &&
        next.review?.passed
          ? await capstoneApi.defense(trackId).catch(() => null)
          : null;
      if (!mounted.current) return;
      setStatus(next);
      setDefense(withDefense);
      setLoadError(null);
    } catch (err) {
      if (mounted.current) setLoadError(err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [trackId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  // Poll only while the server is mid-way through something we did not start here.
  const attemptStatus = status?.attempt?.status;
  useEffect(() => {
    if (busy || !IN_PROGRESS.includes(attemptStatus)) return undefined;
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [attemptStatus, busy, load]);

  /**
   * Run one action: one at a time, errors surfaced, state reloaded after.
   * reload: true = always; "onError" = only if the server refused (it may have
   * moved on, e.g. a question expired), because success already set state.
   */
  const run = useCallback(
    async (name, fn, { reload = true } = {}) => {
      setBusy(name);
      setActionError(null);
      try {
        const result = await fn();
        if (reload === true) await load();
        return result;
      } catch (err) {
        if (mounted.current) setActionError(err);
        if (reload) await load(); // the server may have moved on anyway
        return null;
      } finally {
        if (mounted.current) setBusy(null);
      }
    },
    [load],
  );

  const actions = {
    start: () => run("start", () => capstoneApi.start(trackId)),

    // A submission that passes the automated checks goes straight to review,
    // so the learner does not have to press a second button.
    submit: (repoUrl) =>
      run("submit", async () => {
        const result = await capstoneApi.submit(trackId, repoUrl);
        if (result.submission.passed) {
          setBusy("review");
          await capstoneApi.review(trackId);
        }
        return result;
      }),

    review: () => run("review", () => capstoneApi.review(trackId)),
    startDefense: () =>
      run("startDefense", () => capstoneApi.startDefense(trackId)),

    // Answers update the defense in place (fast, keeps the next question's
    // clock honest); only a graded result needs the full status reload.
    answer: (body) =>
      run(
        "answer",
        async () => {
          const next = await capstoneApi.answer(trackId, body);
          if (!mounted.current) return next;
          setDefense(next);
          if (next.session?.status === "graded") await load();
          if (next.gradingError) setActionError(new Error(next.gradingError));
          return next;
        },
        { reload: "onError" },
      ),

    gradeDefense: () =>
      run("gradeDefense", () => capstoneApi.gradeDefense(trackId)),
    reload: load,
  };

  return {
    status,
    defense,
    loading,
    loadError,
    busy,
    actionError,
    clearError: () => setActionError(null),
    actions,
  };
}
