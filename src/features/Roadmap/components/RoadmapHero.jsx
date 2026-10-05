import { motion as Motion, useReducedMotion } from "framer-motion";
import { CATEGORY_OPTIONS2 } from "../../../../constants/Categories";
import { TRACKS } from "../../../../constants/roadmapPaths.js";

// Counts come from the same constants the page renders, so the meta strip
// can't drift from what the user will actually see.
const ALL_TRACKS = Object.values(TRACKS).flat();
const META = [
  `${CATEGORY_OPTIONS2.length} domains`,
  `${ALL_TRACKS.length} tracks`,
  `${ALL_TRACKS.filter((t) => t.available).length} available`,
];

/** Presentational only: static intro, no store access. */
export default function RoadmapHero() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mb-16 pt-16 text-center">
      <Motion.div
        className="relative"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="rm-mono text-[11px] font-medium uppercase tracking-[0.8px] text-neutral-600 dark:text-neutral-500">
          Roadmaps
        </p>

        <h1 className="mt-4 text-5xl lg:text-[56px] font-normal leading-[1.17] tracking-[0.22px] bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
          Pick your path.
        </h1>

        <p className="mx-auto mt-4 max-w-[480px] text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          Choose a domain, follow a track, and unlock each layer by passing its exam.
        </p>

        <p className="rm-mono mt-6 text-xs text-neutral-500">
          {META.map((item, i) => (
            <span key={item}>
              {i > 0 && <span className="mx-2 text-neutral-700">|</span>}
              {item}
            </span>
          ))}
        </p>
      </Motion.div>
    </div>
  );
}
