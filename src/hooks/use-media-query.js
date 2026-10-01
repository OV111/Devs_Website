import { useEffect, useState } from "react";

// Generic version of use-mobile.js's pattern for an arbitrary query, so the
// roadmap tree's 1280px desktop/mobile split doesn't need its own one-off
// matchMedia wiring.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
