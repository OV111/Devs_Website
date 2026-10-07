import { useReducedMotion } from "motion/react";

// Shared numbers for every scroll reveal: fade in and rise 24px, 0.6s ease-out,
// once, when 20% of the element is visible. Only opacity and transform move.
export const REVEAL_DURATION = 0.6;
export const REVEAL_DISTANCE = 24;
export const REVEAL_AMOUNT = 0.2;
export const REVEAL_EASE = "easeOut";

/**
 * The reveal as plain motion props, for an element that is already a motion.*
 * with other props (e.g. a card with layout + exit). Returns {} when the user
 * prefers reduced motion, so spreading it is always safe.
 */
export function useReveal({
  delay = 0,
  amount = REVEAL_AMOUNT,
  onLoad = false,
} = {}) {
  const reduce = useReducedMotion();
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: REVEAL_DISTANCE },
    ...(onLoad
      ? { animate: { opacity: 1, y: 0 } }
      : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount } }),
    transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE, delay },
  };
}
