import { MotionConfig, motion as Motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { STEPS } from "../lib/steps";
import { hasIntroPlayed } from "../lib/motion";

const LAST = STEPS.length - 1;
const EASE = [0.22, 1, 0.36, 1];

/**
 * The single source of "where am I" on the page.
 *  - sm and up: six nodes on a rail whose fill grows to the active step.
 *  - mobile: a compact "Step 3 of 6 · Build & submit" line + thin bar, because
 *    six labelled columns don't fit in 360px. The full list stays available
 *    to screen readers on every size.
 * No looping animation: the current step is marked by a static ring, so the
 * page's only motion is the agent actually working.
 */
export default function CapstoneStepper({ active, failed }) {
  const intro = !hasIntroPlayed();
  const allDone = active > LAST;
  const current = STEPS[Math.min(active, LAST)];
  const railFill = Math.min(active, LAST) / LAST;
  const barFill = allDone ? 1 : (active + 0.5) / STEPS.length;
  const gradient = failed
    ? "from-purple-500 to-red-500"
    : "from-purple-500 to-fuchsia-400";

  return (
    <MotionConfig reducedMotion="user">
      {/* ── mobile: compact ── */}
      <div className="sm:hidden" aria-hidden="true">
        <p className="text-sm">
          <span className="font-mono text-neutral-400">
            {allDone ? "Complete" : `Step ${active + 1} of 6`}
          </span>
          {!allDone && (
            <>
              <span className="text-neutral-500"> · </span>
              <span className={failed ? "text-red-300" : "text-white"}>
                {failed ? "Sent back" : current.label}
              </span>
            </>
          )}
        </p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-neutral-800">
          <Motion.div
            className={`h-full origin-left rounded-full bg-gradient-to-r ${gradient}`}
            initial={intro ? { scaleX: 0 } : false}
            animate={{ scaleX: barFill }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          />
        </div>
      </div>

      {/* ── sm+: full rail ── */}
      <div className="sr-only sm:not-sr-only sm:relative sm:w-full sm:max-w-xl">
        <div
          aria-hidden="true"
          className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[15px] h-[2px] rounded-full bg-neutral-800"
        >
          <Motion.div
            className={`h-full origin-left rounded-full bg-gradient-to-r ${gradient}`}
            initial={intro ? { scaleX: 0 } : false}
            animate={{ scaleX: railFill }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          />
        </div>

        <ol
          aria-label="Capstone progress"
          className="relative grid grid-cols-6"
        >
          {STEPS.map((step, i) => {
            const done = i < active;
            const isCurrent = i === active;
            const isFailed = isCurrent && failed;
            // Each node lights up as the fill passes it.
            const delay = 0.3 + (i / LAST) * 0.9;

            return (
              <li
                key={step.num}
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-col items-center gap-2 text-center"
              >
                <Motion.span
                  className={`grid size-8 place-items-center rounded-full border font-mono text-xs font-bold transition-colors ${
                    done
                      ? "border-purple-400 bg-purple-500 text-white"
                      : isFailed
                        ? "border-red-500 bg-red-950 text-red-200 ring-4 ring-red-500/15"
                        : isCurrent
                          ? "border-purple-400 bg-neutral-950 text-purple-100 ring-4 ring-purple-500/20"
                          : "border-neutral-700 bg-neutral-950 text-neutral-400"
                  }`}
                  initial={intro ? { scale: 0.6, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 22,
                    delay,
                  }}
                >
                  {done ? (
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  ) : isFailed ? (
                    <X size={14} strokeWidth={3} aria-hidden="true" />
                  ) : (
                    step.num
                  )}
                </Motion.span>

                <span
                  className={`text-xs font-medium leading-tight ${
                    isFailed
                      ? "text-red-300"
                      : isCurrent
                        ? "text-white"
                        : done
                          ? "text-neutral-300"
                          : "text-neutral-500"
                  }`}
                >
                  {step.label}
                  <span className="sr-only">
                    {done
                      ? " (done)"
                      : isFailed
                        ? " (sent back)"
                        : isCurrent
                          ? " (current)"
                          : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </MotionConfig>
  );
}
