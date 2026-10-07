import { createElement } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  REVEAL_AMOUNT,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  REVEAL_EASE,
  useReveal,
} from "./useReveal.js";

/**
 * Scroll-reveal wrapper. With "reduce motion" on, it renders a plain element
 * (no animation at all).
 *
 *   <Reveal>…</Reveal>                       one block fades in and rises
 *   <Reveal stagger={0.08}>                  children enter 80ms apart
 *     <Reveal.Item>…</Reveal.Item>
 *   </Reveal>
 *   <Reveal onLoad stagger={0.1}>            plays on mount, not on scroll
 *
 * For an element that is already a motion.* with other props, spread
 * useReveal() instead (see useReveal.js).
 */

const itemVariants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE },
  },
};

export function Reveal({
  as = "div",
  stagger,
  delay = 0,
  amount = REVEAL_AMOUNT,
  onLoad = false,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const single = useReveal({ delay, amount, onLoad });

  if (reduce) return createElement(as, rest, children);

  // A staggering parent has no motion of its own: it only sequences its
  // <Reveal.Item> children through the shared "hidden" / "show" variants.
  const props =
    stagger != null
      ? {
          variants: {
            hidden: {},
            show: { transition: { staggerChildren: stagger, delayChildren: delay } },
          },
          initial: "hidden",
          ...(onLoad
            ? { animate: "show" }
            : { whileInView: "show", viewport: { once: true, amount } }),
        }
      : single;

  return createElement(motion[as], { ...rest, ...props }, children);
}

function Item({ as = "div", children, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, rest, children);
  return createElement(motion[as], { ...rest, variants: itemVariants }, children);
}

Reveal.Item = Item;
