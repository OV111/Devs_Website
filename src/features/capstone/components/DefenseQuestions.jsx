import QuestionCard from "./QuestionCard";
import { PrimaryButton } from "./ui";
import { formatDateTime } from "../lib/format";
import { TONE, levelOf } from "../lib/review";

const SECONDARY =
  "inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-neutral-200 transition-colors hover:border-purple-400/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50";

/** Answered questions, with the same level chip as the rubric once graded. */
function AnsweredList({ answered }) {
  return answered.map((q, i) => {
    const level = q.score != null ? levelOf(q.score) : null;
    return (
      <li key={q.id} className="flex flex-col gap-3 py-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] font-semibold leading-snug text-white">
            <span className="mr-2 font-mono text-sm text-neutral-500">Q{i + 1}</span>
            {q.text}
          </p>
          {level && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE[level.tone].chip}`}
            >
              {level.label}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3">
          <p className="text-xs font-medium text-neutral-500">Your answer</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
            {q.expired ? (
              <em className="text-red-300">No answer in time</em>
            ) : (
              q.answer || <em className="text-neutral-500">Skipped</em>
            )}
          </p>
        </div>
        {q.feedback && (
          <p className="text-[13px] leading-relaxed text-neutral-400">{q.feedback}</p>
        )}
      </li>
    );
  });
}

/**
 * The defense: questions about the learner's own code, in whatever state the
 * server reports. Never offers an action the server would refuse.
 */
export default function DefenseQuestions({ defense, busy, actions }) {
  const session = defense.session;

  const startBlock = defense.canStart && (
    <div className="flex flex-col items-start gap-4 py-5">
      <p className="max-w-2xl text-sm leading-relaxed text-neutral-300">
        Your code passed the review. Now defend it: 5 questions about your own
        repository, 3 minutes each, one at a time, no going back. Session{" "}
        {defense.sessionsUsed + 1} of {defense.maxSessions}.
      </p>
      <PrimaryButton
        onClick={actions.startDefense}
        busy={busy === "startDefense"}
      >
        {busy === "startDefense"
          ? "Writing your questions…"
          : defense.sessionsUsed
            ? "Retake the defense"
            : "Start the defense"}
      </PrimaryButton>
    </div>
  );

  if (!session) return startBlock || null;

  return (
    <ol className="flex flex-col divide-y divide-white/[0.06]">
      <AnsweredList answered={session.answered} />

      {session.status === "generating" && (
        <li className="py-5 text-sm text-neutral-400">
          Writing questions about your code…
        </li>
      )}

      {session.status === "active" && (
        <li className="py-5">
          {session.current ? (
            <QuestionCard
              key={session.current.id}
              question={session.current}
              total={session.total}
              onAnswer={actions.answer}
              busy={busy === "answer"}
            />
          ) : (
            <button type="button" onClick={actions.reload} className={SECONDARY}>
              Continue to the next question
            </button>
          )}
        </li>
      )}

      {(session.status === "answered" || session.status === "grading") && (
        <li className="flex flex-col items-start gap-3 py-5">
          <p className="text-sm text-neutral-300">
            All answers are saved. Grading didn't finish — run it again.
          </p>
          <button
            type="button"
            onClick={actions.gradeDefense}
            disabled={busy === "gradeDefense"}
            className={SECONDARY}
          >
            Grade my answers
          </button>
        </li>
      )}

      {session.status === "graded" && (
        <li className="flex flex-col gap-1.5 py-5">
          <p
            className={`text-[15px] font-semibold ${session.result.passed ? "text-green-300" : "text-red-300"}`}
          >
            Defense {session.result.score}% —{" "}
            {session.result.passed ? "passed" : "not passed"}
          </p>
          {!session.result.passed && defense.retryAt && (
            <p className="text-sm text-neutral-400">
              Retake with new questions {formatDateTime(defense.retryAt)} — same
              code.
            </p>
          )}
        </li>
      )}

      {session.status === "graded" && startBlock && <li>{startBlock}</li>}
    </ol>
  );
}
