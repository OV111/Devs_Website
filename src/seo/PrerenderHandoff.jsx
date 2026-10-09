import { useEffect } from "react";

// Rendered inside the same <Suspense> boundary as the page, so this effect
// runs only once the live page (including its lazy chunk) has committed.
// Then the static prerendered copy is removed and #root becomes visible.
const PrerenderHandoff = () => {
  useEffect(() => {
    document.getElementById("prerender")?.remove();
  }, []);
  return null;
};

export default PrerenderHandoff;
