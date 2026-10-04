import { motion as Motion } from "framer-motion";
import { ChevronDown, Shuffle } from "lucide-react";
import { SURFACE, SectionLabel } from "./ui";
import { fadeUp } from "../lib/motion";
import { formatRelative } from "../lib/format";

function RequirementList({ requirements }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {requirements.map((r, i) => (
        <li
          key={r.id}
          className="flex gap-3 text-sm leading-relaxed text-neutral-300"
        >
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-neutral-700 font-mono text-xs text-neutral-400">
            {i + 1}
          </span>
          {r.text}
        </li>
      ))}
    </ul>
  );
}

/**
 * The capstone brief: what to build. While the learner can still build
 * (before starting, or during an open attempt) the requirements are shown
 * expanded — it's the list they keep coming back to. Rubric and rules stay
 * one click away. Gating and the start action live in the hero.
 */
export default function AssignmentCard({ status }) {
  const { brief, attempt, track } = status;
  const building = !attempt || ["started", "checking"].includes(attempt.status);

  if (!brief) {
    return (
      <Motion.section {...fadeUp(0.06)} className={`${SURFACE} p-6 sm:p-7`}>
        <SectionLabel>The brief</SectionLabel>
        <p className="mt-3 text-sm text-neutral-300">
          There is no capstone brief for {track.title} yet. Keep passing layer
          exams — it will appear here.
        </p>
      </Motion.section>
    );
  }

  return (
    <Motion.section
      {...fadeUp(0.06)}
      aria-labelledby="capstone-brief-title"
      className={`${SURFACE} flex flex-col gap-6 p-6 sm:p-7`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <SectionLabel>The brief</SectionLabel>
          {attempt && (
            <span className="text-xs text-neutral-500">
              Assigned {formatRelative(attempt.startedAt)}
            </span>
          )}
        </div>
        <h2
          id="capstone-brief-title"
          className="text-2xl font-bold leading-snug text-white"
        >
          {brief.title}
        </h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-neutral-300">
          {brief.summary}
        </p>
        {brief.stack?.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Stack">
            {brief.stack.map((s) => (
              <li
                key={s}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-neutral-300"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {attempt?.twist && (
        <div className="flex gap-3 rounded-xl border border-purple-500/30 bg-purple-500/[0.07] p-4">
          <Shuffle
            size={16}
            className="mt-0.5 shrink-0 text-purple-300"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-neutral-200">
            <span className="font-semibold text-purple-200">Your twist: </span>
            {attempt.twist.text}
          </p>
        </div>
      )}

      {building && (
        <div className="flex flex-col gap-3">
          <SectionLabel>Requirements</SectionLabel>
          <RequirementList requirements={brief.requirements} />
        </div>
      )}

      <details className="group rounded-xl border border-white/[0.06]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-200 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 [&::-webkit-details-marker]:hidden">
          {building ? "Rubric and rules" : "Requirements, rubric and rules"}
          <ChevronDown
            size={16}
            className="text-neutral-400 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="flex flex-col gap-5 border-t border-white/[0.06] p-4">
          {!building && <RequirementList requirements={brief.requirements} />}
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {brief.rubric.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-white/[0.06] p-3"
              >
                <dt className="text-sm font-semibold text-neutral-200">
                  {c.name}
                </dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-neutral-400">
                  {c.description}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[13px] text-neutral-400 marker:text-neutral-600">
            {brief.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </details>
    </Motion.section>
  );
}
