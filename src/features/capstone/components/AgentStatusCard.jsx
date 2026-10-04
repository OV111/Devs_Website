import { AnimatePresence, MotionConfig, motion as Motion } from "framer-motion";
import { fadeUp } from "../lib/motion";
import { SURFACE } from "./ui";

/**
 * The agent card beside the hero: what the agent is doing right now, plus
 * facts the hero doesn't show (attempt, commit). Progress lives only in the
 * stepper; the bar and ping appear only while the server is actually working.
 */

// Tells the learner what the agent will look at, without repeating the hero.
const checksLine = (status) => {
  const checks = (status.brief?.requirements ?? []).filter(
    (r) => r.checked,
  ).length;
  const criteria = status.brief?.rubric?.length ?? 0;
  return checks || criteria
    ? `on submit: ${checks} automated checks, then ${criteria} rubric criteria`
    : "on submit: automated checks, then a rubric review";
};

const describe = (status, busy) => {
  const s = status.attempt?.status;
  const review = status.review;
  const commit = status.lastSubmission?.commitSha?.slice(0, 7);

  if (!status.eligibility?.complete) {
    return {
      label: "Locked",
      title: `${status.eligibility.passed} / ${status.eligibility.total} layer exams passed`,
      line: "pass every layer exam to unlock your capstone",
    };
  }
  if (!s)
    return {
      label: "Ready",
      title: "capstone ready to assign",
      line: "start to receive your brief and your twist",
    };
  if (s === "started")
    return {
      label: "Waiting",
      title: "waiting for your repository",
      line: checksLine(status),
    };
  if (s === "checking" || busy === "submit")
    return {
      label: "Agent checking",
      title: "automated checks",
      line: "reading your repository tree",
      working: true,
    };
  if (s === "submitted" || s === "reviewing" || busy === "review") {
    return {
      label: "Agent reviewing",
      title: "structured review",
      line: commit
        ? `reading your code at commit ${commit}`
        : "reading your code",
      working: s === "reviewing" || busy === "review",
    };
  }
  if (s === "defense") {
    return {
      label: "Agent questioning",
      title: `structured review · ${review?.criteria.length ?? 0} / ${review?.criteria.length ?? 0}`,
      line: "defend your code — answer the agent's questions",
    };
  }
  if (s === "passed")
    return {
      label: "Approved",
      title: `review ${review?.totalScore ?? "—"}%`,
      line: "capstone approved — certificate issued",
    };
  return {
    label: "Sent back",
    title: review ? `review ${review.totalScore}%` : "attempt closed",
    line: "read the feedback below and try again",
  };
};

// Accent per agent state.
const THEMES = {
  Locked: "neutral",
  Ready: "purple",
  Waiting: "purple",
  "Agent checking": "purple",
  "Agent reviewing": "purple",
  "Agent questioning": "amber",
  Approved: "green",
  "Sent back": "red",
};

// Full class strings (not built dynamically) so Tailwind can see them.
const ACCENTS = {
  neutral: {
    badge: "border-neutral-700 bg-neutral-800/60 text-neutral-300",
    dot: "bg-neutral-400",
  },
  purple: {
    badge: "border-purple-500/30 bg-purple-500/10 text-purple-200",
    dot: "bg-purple-400",
  },
  amber: {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    dot: "bg-amber-400",
  },
  green: {
    badge: "border-green-500/30 bg-green-500/10 text-green-200",
    dot: "bg-green-400",
  },
  red: {
    badge: "border-red-500/30 bg-red-500/10 text-red-200",
    dot: "bg-red-400",
  },
};

export default function AgentStatusCard({ status, busy }) {
  const { label, title, line, working } = describe(status, busy);
  const a = ACCENTS[THEMES[label] ?? "purple"];
  const { attempt, lastSubmission } = status;
  // The badge dot pulses while the agent is live: working, or waiting on the learner.
  const live = working || label === "Waiting" || label === "Ready";
  const commit = lastSubmission?.commitSha?.slice(0, 7);

  return (
    <MotionConfig reducedMotion="user">
      <Motion.div
        {...fadeUp(0.12)}
        className={`${SURFACE} overflow-hidden`}
        aria-live="polite"
      >
        {/* header: who + current state */}
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3">
          <span className="text-xs font-medium text-neutral-400">
            Capstone agent
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${a.badge}`}
          >
            <span className="relative flex size-1.5">
              {/* pulses while live (working or waiting on you) */}
              {live && (
                <span
                  className={`absolute inset-0 animate-ping rounded-full motion-reduce:animate-none ${a.dot}`}
                />
              )}
              <span className={`relative size-1.5 rounded-full ${a.dot}`} />
            </span>
            {label}
          </span>
        </div>

        {/* body: what the agent is doing, cross-fades when the state changes */}
        <div className="px-5 py-6">
          <AnimatePresence mode="wait" initial={false}>
            <Motion.div
              key={`${label}-${title}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-lg font-semibold leading-snug text-white first-letter:uppercase">
                {title}
              </p>
              <p className="mt-1.5 font-mono text-[13px] leading-relaxed text-neutral-400">
                {line}
              </p>
            </Motion.div>
          </AnimatePresence>

          {/* indeterminate bar, only while working */}
          {working && (
            <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-neutral-800">
              <Motion.div
                aria-hidden="true"
                className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "300%" }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
        </div>

        {/* footer: facts the hero doesn't show */}
        {attempt && (
          <dl className="flex items-center justify-between gap-4 border-t border-white/5 px-5 py-3.5 text-xs">
            <div className="flex gap-1.5">
              <dt className="text-neutral-500">Attempt</dt>
              <dd className="font-mono text-neutral-200">
                {attempt.attemptNumber} of {status.maxAttempts}
              </dd>
            </div>
            {commit && (
              <div className="flex gap-1.5">
                <dt className="text-neutral-500">Commit</dt>
                <dd className="font-mono text-neutral-200">{commit}</dd>
              </div>
            )}
          </dl>
        )}
      </Motion.div>
    </MotionConfig>
  );
}
