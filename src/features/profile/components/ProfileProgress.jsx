import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ArrowUpRight, Github } from "lucide-react";
import { SURFACE } from "@/components/ui/surface";

/**
 * Presentational pieces for the learning sections of a profile (own + public).
 * They render real server shapes only — no mock data lives here.
 */

const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

// Full class strings so Tailwind can see them.
const TONES = {
  neutral: "border-white/10 bg-white/[0.04] text-neutral-300",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-200",
  green: "border-green-500/30 bg-green-500/10 text-green-300",
  red: "border-red-500/30 bg-red-500/10 text-red-300",
};

function Chip({ tone = "neutral", children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/* ── states ─────────────────────────────────────────────── */

export function EmptyState({ title, body, to, cta }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-white/10 px-5 py-6">
      <p className="text-sm font-semibold text-neutral-200">{title}</p>
      {body && <p className="max-w-md text-sm text-neutral-400">{body}</p>}
      {to && (
        <Link
          to={to}
          className="mt-1 text-sm font-medium dark:text-purple-600 hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

function SectionError({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4"
    >
      <p className="text-sm text-amber-200">
        {error?.message ?? "Couldn't load this section."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-amber-100 underline hover:text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function RowsSkeleton({ rows }) {
  return (
    <SkeletonTheme baseColor="#171717" highlightColor="#262626">
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading"
        className="space-y-3"
      >
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={`${SURFACE} p-5`}>
            <Skeleton width="45%" height={16} />
            <Skeleton width="30%" height={12} className="mt-2" />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

/**
 * One section's loading / error / empty / content switch, so every section
 * handles all four states the same way.
 */
export function AsyncSection({
  status,
  error,
  onRetry,
  isEmpty,
  empty,
  rows = 2,
  children,
}) {
  if (status === "loading") return <RowsSkeleton rows={rows} />;
  if (status === "error")
    return <SectionError error={error} onRetry={onRetry} />;
  if (isEmpty) return empty;
  return children;
}

/* ── rows / cards ───────────────────────────────────────── */

const TRACK_STATE = {
  locked: { label: "Working through layer exams", tone: "neutral" },
  ready: { label: "Capstone ready", tone: "purple" },
  in_progress: { label: "Capstone in progress", tone: "purple" },
  passed: { label: "Capstone approved", tone: "green" },
  failed: { label: "Capstone sent back", tone: "red" },
};

/** A roadmap track and how far through its layer exams the learner is. */
export function TrackRow({ track, linkTo }) {
  const { passed, total } = track.eligibility;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  const state = TRACK_STATE[track.state] ?? TRACK_STATE.locked;

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-white">
            {track.trackTitle}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {passed} of {total} layer exams passed
          </p>
        </div>
        <Chip tone={state.tone}>{state.label}</Chip>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-800"
        role="progressbar"
        aria-label={`${track.trackTitle} layer exams`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={passed}
      >
        <div
          className="h-full rounded-full bg-purple-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </>
  );

  const classes = `${SURFACE} block p-5`;
  return linkTo ? (
    <Link
      to={linkTo}
      className={`${classes} transition-colors hover:border-purple-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
    >
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}

/** An approved capstone = an issued certificate anyone can open and check. */
export function CertificateCard({ cert }) {
  const { review, defense } = cert.scores;
  return (
    <article className={`${SURFACE} flex flex-col gap-4 p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium dark:text-purple-600">
          {cert.track.title} capstone
        </span>
        <div className="flex items-center gap-2">
          {cert.testData && <Chip tone="neutral">Test data</Chip>}
          <Chip tone="green">AI-reviewed</Chip>
        </div>
      </div>

      <div>
        <h3 className="text-[17px] font-semibold leading-snug text-white">
          {cert.project.title}
        </h3>
        <p className="mt-1.5 text-[13px] text-neutral-400">
          Review <span className="font-mono text-neutral-200">{review}%</span>
          {" · "}
          Defense{" "}
          <span className="font-mono text-neutral-200">
            {defense == null ? "—" : `${defense}%`}
          </span>
          {" · "}
          Issued {shortDate(cert.issuedAt)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to={cert.verifyPath}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-[13px] font-medium text-neutral-100 transition-colors hover:border-purple-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          View certificate <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <a
          href={cert.repo.commitUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-[13px] font-medium text-neutral-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Github size={14} aria-hidden="true" />
          <span className="truncate font-mono">{cert.repo.fullName}</span>
        </a>
      </div>
    </article>
  );
}

/** One exam attempt. `layerTitle` is joined by the API; the raw id is the fallback. */
export function ExamRow({ exam }) {
  const title = exam.layerTitle ?? exam.layer;
  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-neutral-950 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-100">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          {exam.path} · {shortDate(exam.takenAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-mono text-[13px] text-neutral-300">
          {exam.correctAnswers}/{exam.totalQuestions}
        </span>
        <Chip tone={exam.passed ? "green" : "red"}>
          {exam.passed ? "Passed" : "Not passed"}
        </Chip>
      </div>
    </li>
  );
}

/* ── coding challenges ──────────────────────────────────── */

// The API's difficulty values are "easy" | "med" | "hard".
const DIFFICULTY = {
  easy: { label: "Easy", tone: "green" },
  med: { label: "Medium", tone: "purple" },
  hard: { label: "Hard", tone: "red" },
};

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-neutral-950 px-4 py-3">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

/** Solved / streak / accuracy tiles plus the last few solves, from /stats/me. */
export function ChallengeStats({ stats }) {
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Solved"
          value={stats.solved}
          hint={`${stats.attempted} attempted`}
        />
        <Stat label="This week" value={stats.solvedThisWeek} />
        <Stat
          label="Streak"
          value={stats.streakDays}
          hint={stats.streakDays === 1 ? "day" : "days"}
        />
        <Stat label="Accuracy" value={`${stats.accuracy}%`} />
      </dl>

      {stats.recentSolved?.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Recently solved
          </h3>
          <ul className="space-y-2">
            {stats.recentSolved.map((c) => (
              <li key={`${c.slug}-${c.solvedAt}`}>
                <Link
                  to={`/coding-challenges/${c.slug}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-neutral-950 px-4 py-3 transition-colors hover:border-purple-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-neutral-100">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Solved {shortDate(c.solvedAt)}
                    </span>
                  </span>
                  {DIFFICULTY[c.difficulty] && (
                    <Chip tone={DIFFICULTY[c.difficulty].tone}>
                      {DIFFICULTY[c.difficulty].label}
                    </Chip>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
