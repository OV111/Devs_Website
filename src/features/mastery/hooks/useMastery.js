import { useCallback, useEffect, useState } from "react";
import { fetchMastery } from "../masteryApi";

/** The learner's mastery view, with loading/error state and a manual reload. */
const useMastery = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await fetchMastery());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useMastery;
