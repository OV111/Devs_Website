import { motion as Motion, useReducedMotion } from "framer-motion";

// Empty state: a pointer to the domain pills above; the arrow bobs gently
// (disabled for users who prefer reduced motion).
const FloatingLoad = () => {
  const reduce = useReducedMotion();

  return (
    <Motion.div
      key="idle"
      className="mt-24 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="rm-mono rounded-lg border border-white/10 px-4 py-2 text-xs tracking-[0.2px] text-neutral-600 dark:text-neutral-400">
        <Motion.span
          aria-hidden="true"
          className="mr-1 inline-block text-purple-400"
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ↑
        </Motion.span>{" "}
        select a domain above to start
      </p>
    </Motion.div>
  );
};

export default FloatingLoad;
