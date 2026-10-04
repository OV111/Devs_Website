import { useId, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronDown, FileCode2 } from "lucide-react";
import { TONE, evidenceRef, levelOf } from "../lib/review";

/** Four segments, one per rubric point — honest about the 0–4 scale. */
function Meter({ score, max, tone }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-full sm:w-6 ${i < score ? TONE[tone].seg : "bg-neutral-800"}`}
        />
      ))}
    </span>
  );
}

/**
 * One rubric criterion: name, meter and level always visible; the agent's
 * feedback and the exact files/lines it cited open below. This replaces the
 * separate "activity log" — evidence now sits next to the verdict it backs.
 */
export default function ReviewCriterion({ criterion, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const level = levelOf(criterion.score);
  const tone = TONE[level.tone];
  const max = criterion.maxScore ?? 4;
  const evidence = criterion.evidence ?? [];

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-400 sm:px-7"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium text-white">
            {criterion.name}
          </span>
          {evidence.length > 0 && (
            <span className="mt-0.5 block text-xs text-neutral-500">
              {evidence.length} {evidence.length === 1 ? "reference" : "references"} in your code
            </span>
          )}
        </span>
        <span className="hidden sm:block">
          <Meter score={criterion.score} max={max} tone={level.tone} />
        </span>
        <span
          className={`w-[96px] shrink-0 rounded-full border px-2.5 py-0.5 text-center text-xs font-semibold ${tone.chip}`}
        >
          {level.label}
          <span className="sr-only">
            , {criterion.score} of {max}
          </span>
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6 sm:px-7">
              <p className="max-w-3xl text-sm leading-relaxed text-neutral-300">
                {criterion.feedback}
              </p>

              {evidence.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    What the agent looked at
                  </p>
                  <ul className="flex flex-col divide-y divide-white/[0.05] rounded-xl border border-white/[0.06] bg-white/[0.015]">
                    {evidence.map((e, i) => (
                      <li
                        key={`${evidenceRef(e)}-${i}`}
                        className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                      >
                        <code className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-purple-200 sm:w-44">
                          <FileCode2 size={14} className="shrink-0 text-neutral-500" aria-hidden="true" />
                          <span className="truncate">{evidenceRef(e)}</span>
                        </code>
                        {e.note && (
                          <span className="text-[13px] leading-relaxed text-neutral-400">
                            {e.note}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
