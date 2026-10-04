import { useCallback, useEffect, useRef, useState } from "react";
import { capstoneApi } from "@/features/capstone/capstoneApi";
import { fetchChallengeStats, fetchExamHistory } from "@/services/profileApi";

/**
 * Real learning data for the signed-in user's own profile, one section per
 * source. Each section loads and fails on its own:
 *   - a slow endpoint doesn't hold back the others (they render as they land);
 *   - one failure shows an error + retry in THAT section only.
 *
 * section = { status: "loading" | "ready" | "error", data, error }
 */
const LOADERS = {
  tracks: () => capstoneApi.overview(),
  challenges: () => fetchChallengeStats(),
  certificates: () => capstoneApi.certificates(),
  exams: () => fetchExamHistory(10),
};

const LOADING = { status: "loading", data: null, error: null };
const initial = () =>
  Object.fromEntries(Object.keys(LOADERS).map((key) => [key, LOADING]));

export default function useProfileProgress() {
  const [sections, setSections] = useState(initial);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const set = (key, value) =>
    mounted.current && setSections((prev) => ({ ...prev, [key]: value }));

  const loadSection = useCallback(async (key) => {
    set(key, LOADING);
    try {
      set(key, { status: "ready", data: await LOADERS[key](), error: null });
    } catch (error) {
      set(key, { status: "error", data: null, error });
    }
  }, []);

  useEffect(() => {
    Object.keys(LOADERS).forEach(loadSection);
  }, [loadSection]);

  return { ...sections, reload: loadSection };
}
