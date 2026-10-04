import { AlertTriangle, Loader2 } from "lucide-react";
import { SURFACE } from "@/components/ui/surface";
import { formatDateTime } from "../lib/format";

/** Small shared building blocks for the capstone screens. */

// The card surface lives in components/ui (shared with the profile page);
// re-exported so the capstone files keep importing it from here.
export { SURFACE };

export function SectionLabel({ children, className = "" }) {
  return (
    <h3
      className={`text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 ${className}`}
    >
      {children}
    </h3>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <section className={`${SURFACE} p-6 sm:p-7 ${className}`} {...props}>
      {children}
    </section>
  );
}

/** Solid primary action — one per screen state. */
export function PrimaryButton({
  children,
  busy,
  disabled,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(147,51,234,0.7)] transition-colors hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-400 disabled:shadow-none ${className}`}
      {...props}
    >
      {busy && (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

/**
 * An action the server refused or that failed. Uses the server's own message
 * plus the structured details it sent, so the learner learns what to do next.
 */
export function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-[13px] text-amber-200"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p>{error.message}</p>
        {error.retryAt && (
          <p className="mt-1 text-amber-200/70">
            You can try again {formatDateTime(error.retryAt)}.
          </p>
        )}
        {Array.isArray(error.missing) && error.missing.length > 0 && (
          <p className="mt-1 text-amber-200/70">
            Still to pass: {error.missing.join(", ")}
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-amber-200/70 hover:text-amber-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

/** 0–4 score as a labelled meter. */
export function ScoreBar({ label, score, maxScore = 4 }) {
  const tone =
    score >= 3 ? "bg-green-500" : score === 2 ? "bg-yellow-400" : "bg-red-500";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px_40px] items-center gap-3">
      <span className="truncate text-[13px] text-zinc-200">{label}</span>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-zinc-800"
        role="meter"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-valuenow={score}
      >
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>
      <span className="text-right font-mono text-[12px] text-zinc-400">
        {score}/{maxScore}
      </span>
    </div>
  );
}
