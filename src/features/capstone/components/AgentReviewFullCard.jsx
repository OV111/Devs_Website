import { motion as Motion } from "framer-motion";
import ReviewCriterion from "./ReviewCriterion";
import DefenseQuestions from "./DefenseQuestions";
import { PrimaryButton, SURFACE, SectionLabel } from "./ui";
import { fadeUp, hasIntroPlayed } from "../lib/motion";
import { formatRelative } from "../lib/format";
import { summarize } from "../lib/review";

const RING = { size: 96, stroke: 8 };

/** Total score as a ring, in % — the same unit the agent card and history use. */
function ScoreRing({ score, passed }) {
  const r = (RING.size - RING.stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = passed ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: RING.size, height: RING.size }}
      role="img"
      aria-label={`Score ${Math.round(score)} percent`}
    >
      <svg width={RING.size} height={RING.size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={RING.size / 2}
          cy={RING.size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={RING.stroke}
        />
        <Motion.circle
          cx={RING.size / 2}
          cy={RING.size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={RING.stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: hasIntroPlayed() ? c * (1 - score / 100) : c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <span className="absolute text-center" aria-hidden="true">
        <span className="block text-2xl font-bold leading-none text-white">
          {Math.round(score)}
          <span className="text-sm font-semibold text-neutral-400">%</span>
        </span>
      </span>
    </div>
  );
}

/** Placeholder rows while the agent is reviewing. */
function ReviewingRows({ count = 6 }) {
  return (
    <ul className="divide-y divide-white/[0.06]" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex items-center gap-4 px-6 py-4 sm:px-7">
          <span className="h-4 flex-1 animate-pulse rounded bg-neutral-800/80 motion-reduce:animate-none" style={{ maxWidth: `${40 + ((i * 17) % 35)}%` }} />
          <span className="h-5 w-24 animate-pulse rounded-full bg-neutral-800/80 motion-reduce:animate-none" />
        </li>
      ))}
    </ul>
  );
}

/**
 * The agent's review in one card: verdict + score, the summary, then each
 * rubric criterion with its feedback and cited code, then the defense.
 * When the review sends the work back, the criteria that need work start
 * open — that's the to-do list for the next attempt.
 */
export default function AgentReviewFullCard({
  review,
  attemptStatus,
  defense,
  busy,
  actions,
}) {
  const running = busy === "review" || attemptStatus === "reviewing";
  const counts = review ? summarize(review.criteria) : null;
  const verdict = review
    ? review.passed
      ? { text: "Passed", tone: "text-green-300" }
      : { text: "Sent back", tone: "text-red-300" }
    : running
      ? { text: "Reviewing your code…", tone: "text-white" }
      : { text: "Ready for review", tone: "text-white" };

  return (
    <Motion.section
      {...fadeUp(0.08)}
      aria-labelledby="agent-review-title"
      className={`${SURFACE} overflow-hidden`}
    >
      {/* ── header: verdict + score ── */}
      <div className="flex flex-col-reverse gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="min-w-0">
          <SectionLabel>Agent review</SectionLabel>
          <h2
            id="agent-review-title"
            className={`mt-2 text-2xl font-bold ${verdict.tone}`}
          >
            {verdict.text}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-400">
            {review ? (
              <>
                <span className="text-green-300">{counts.strong} strong</span>
                {" · "}
                <span className={counts.needsWork ? "text-amber-300" : ""}>
                  {counts.needsWork} need{counts.needsWork === 1 ? "s" : ""} work
                </span>
                {review.createdAt && ` · reviewed ${formatRelative(review.createdAt)}`}
              </>
            ) : running ? (
              "Reading your code against the rubric — usually 10–40 seconds."
            ) : (
              "Your submission passed the automated checks."
            )}
          </p>
        </div>
        {review && <ScoreRing score={review.totalScore} passed={review.passed} />}
      </div>

      {/* ── not reviewed yet ── */}
      {!review && !running && (
        <div className="border-t border-white/[0.06] p-6 sm:p-7">
          <PrimaryButton onClick={actions.review}>Run the agent review</PrimaryButton>
        </div>
      )}
      {running && !review && (
        <div className="border-t border-white/[0.06]">
          <ReviewingRows />
        </div>
      )}

      {review && (
        <>
          {review.summary && (
            <p className="max-w-3xl border-t border-white/[0.06] px-6 py-5 text-[15px] leading-relaxed text-neutral-300 sm:px-7">
              {review.summary}
            </p>
          )}

          {/* ── rubric criteria ── */}
          <div className="border-t border-white/[0.06]">
            <div className="flex items-baseline justify-between px-6 pt-5 sm:px-7">
              <SectionLabel>Rubric</SectionLabel>
              {!review.passed && counts.needsWork > 0 && (
                <span className="text-xs text-neutral-500">
                  Items that need work are open
                </span>
              )}
            </div>
            <ul className="mt-2 divide-y divide-white/[0.06]">
              {review.criteria.map((c) => (
                <ReviewCriterion
                  key={c.id}
                  criterion={c}
                  defaultOpen={!review.passed && c.score < 3}
                />
              ))}
            </ul>
          </div>

          {/* ── defense — only once the review passed ── */}
          {review.passed && defense && (
            <div className="border-t border-white/[0.06] p-6 sm:p-7">
              <SectionLabel>Your defense</SectionLabel>
              <div className="mt-2">
                <DefenseQuestions defense={defense} busy={busy} actions={actions} />
              </div>
            </div>
          )}

          {!review.passed && (
            <p className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-4 text-[13px] text-neutral-400 sm:px-7">
              The agent asks its defense questions once a review passes. Fix the
              items marked <span className="text-amber-300">Needs work</span>,
              then start a new attempt.
            </p>
          )}
        </>
      )}
    </Motion.section>
  );
}
