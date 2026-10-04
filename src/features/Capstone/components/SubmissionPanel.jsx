import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Check, Github, X } from "lucide-react";
import { PrimaryButton, SURFACE, SectionLabel } from "./ui";
import { fadeUp } from "../lib/motion";
import { formatRelative } from "../lib/format";

/** One automated check result from the last submission. */
function CheckRow({ check }) {
  return (
    <li className="flex items-start gap-3" title={check.detail ?? undefined}>
      <span
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
          check.passed
            ? "border-green-500/40 bg-green-500/15 text-green-300"
            : "border-red-500/40 bg-red-500/10 text-red-300"
        }`}
      >
        {check.passed ? (
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        ) : (
          <X size={12} strokeWidth={3} aria-hidden="true" />
        )}
        <span className="sr-only">{check.passed ? "Passed:" : "Failed:"}</span>
      </span>
      <span className="text-sm leading-relaxed text-neutral-200">
        {check.label}
        {check.detail && !check.passed && (
          <span className="mt-0.5 block text-[13px] text-red-300">
            {check.detail}
          </span>
        )}
      </span>
    </li>
  );
}

/**
 * The repository the learner submits, plus the automated check results of
 * the last submission. The input is editable only while the attempt can take
 * a submission; the requirements themselves are listed in the brief, so the
 * checklist appears only once there are real results to show.
 */
export default function SubmissionPanel({ status, onSubmit, busy }) {
  const { attempt, lastSubmission } = status;
  const [repoUrl, setRepoUrl] = useState(lastSubmission?.repo?.url ?? "");
  const canSubmit = attempt.status === "started";
  const working =
    busy === "submit" || busy === "review" || attempt.status === "checking";

  const checks = lastSubmission?.checks ?? [];
  const passedCount = checks.filter((c) => c.passed).length;
  const allPassed = checks.length > 0 && passedCount === checks.length;

  const submit = (e) => {
    e.preventDefault();
    if (repoUrl.trim() && !working) onSubmit(repoUrl.trim());
  };

  return (
    <Motion.section
      {...fadeUp(0.06)}
      aria-labelledby="capstone-submission-title"
      className={`${SURFACE} flex flex-col divide-y divide-white/[0.06]`}
    >
      {/* header */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-6 sm:px-7">
        <h2
          id="capstone-submission-title"
          className="text-lg font-semibold text-white"
        >
          Your submission
        </h2>
        <p className="text-xs text-neutral-500">
          {lastSubmission ? (
            <>
              {lastSubmission.commitSha && (
                <span className="font-mono text-neutral-300">
                  {lastSubmission.commitSha.slice(0, 7)}
                </span>
              )}
              {lastSubmission.commitSha && " · "}
              submitted {formatRelative(lastSubmission.submittedAt)}
            </>
          ) : (
            "Not submitted yet"
          )}
        </p>
      </div>

      {/* repository + action */}
      <form onSubmit={submit} className="flex flex-col gap-3 p-6 sm:px-7">
        <label
          htmlFor="capstone-repo"
          className="text-sm font-medium text-neutral-200"
        >
          GitHub repository
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 transition-colors focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/30">
            <Github
              size={16}
              className="shrink-0 text-neutral-400"
              aria-hidden="true"
            />
            <input
              id="capstone-repo"
              type="text"
              inputMode="url"
              value={
                canSubmit ? repoUrl : (lastSubmission?.repo?.url ?? repoUrl)
              }
              onChange={(e) => setRepoUrl(e.target.value)}
              readOnly={!canSubmit}
              aria-describedby="capstone-repo-hint"
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-neutral-100 outline-none placeholder:text-neutral-500 read-only:text-neutral-400"
              placeholder="https://github.com/you/project"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {canSubmit && (
            <PrimaryButton
              type="submit"
              busy={working}
              disabled={!repoUrl.trim()}
              className="shrink-0"
            >
              {working
                ? "Checking…"
                : lastSubmission
                  ? "Resubmit"
                  : "Submit for review"}
            </PrimaryButton>
          )}
        </div>
        <p id="capstone-repo-hint" className="text-[13px] text-neutral-400">
          {lastSubmission && !allPassed && canSubmit
            ? "Fix the failing checks, push, then resubmit — this doesn't use an attempt."
            : "The agent reviews the latest commit at the moment you submit. Later pushes are ignored."}
        </p>
      </form>

      {/* automated check results */}
      {checks.length > 0 && (
        <div className="flex flex-col gap-4 p-6 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Automated checks</SectionLabel>
            <span
              className={`font-mono text-xs font-semibold ${
                allPassed ? "text-green-300" : "text-amber-300"
              }`}
            >
              {passedCount}/{checks.length} passed
            </span>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {checks.map((c) => (
              <CheckRow key={c.id} check={c} />
            ))}
          </ul>
        </div>
      )}
    </Motion.section>
  );
}
