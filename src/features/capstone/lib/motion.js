/**
 * Entrance animations play once per session. After the first capstone render,
 * revisits (and re-renders after actions) start at the final state, so the
 * page doesn't replay its intro every time the learner comes back.
 *
 * A module flag (not storage) is enough: it survives client-side navigation
 * and resets on a full reload, which is when an intro is welcome again.
 */
let introPlayed = false;

export const markIntroPlayed = () => {
  introPlayed = true;
};

export const hasIntroPlayed = () => introPlayed;

/** Fade up, staggered by `delay`. `animate` is always set so a re-render mid-flight still lands. */
export const fadeUp = (delay = 0) => ({
  initial: introPlayed ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

/** Scroll a page section into view (instant for reduced motion), optionally focusing a field in it. */
export const scrollToSection = (id, focusId) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
};
