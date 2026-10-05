import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, FileCode2 } from "lucide-react";
import { teamsApi } from "../teamsApi";
import useCountdown from "../../capstone/hooks/useCountdown";

/**
 * A member's defense: questions about their OWN merged pull requests, one at a
 * time, on a server-side timer. The server decides pass/fail; this component
 * only shows state and sends answers.
 */

function Question({ question, total, onAnswer, busy }) {
  const [text, setText] = useState("");
  const sent = useRef(false);

  const send = async () => {
    if (sent.current) return; // timer expiry and a click must not both submit
    sent.current = true;
    const ok = await onAnswer({ questionId: question.id, answer: text });
    if (!ok) sent.current = false; // request failed: allow a retry
  };

  const left = useCountdown(question.secondsLeft, question.id, send);
  const urgent = left <= 30;

  return (
    <div className="flex flex-col gap-3 py-4">
      <p className="t-h2">
        <span className="mr-2 text-[var(--t-accent-text)]">?</span>
        {question.text}
      </p>
      <span
        className={`t-mono flex items-center gap-2 ${urgent ? "text-[var(--t-red)]" : "text-[var(--t-fog)]"}`}
        role="timer"
      >
        <Clock size={10} aria-hidden="true" />
        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} left ·
        question {question.number} of {total} · no going back
      </span>
      <span className="t-caption t-mono inline-flex items-center gap-1">
        <FileCode2 size={10} aria-hidden="true" />
        PR #{question.prNumber} · {question.codeRef.path}
      </span>
      <pre className="t-code max-h-64 overflow-auto">
        {question.excerpt}
      </pre>
      <label className="sr-only" htmlFor={`answer-${question.id}`}>
        Your answer
      </label>
      <textarea
        id={`answer-${question.id}`}
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={3000}
        autoFocus
        placeholder="Type your answer… specific to your change"
        className="t-input max-w-2xl resize-y"
      />
      <button
        type="button"
        onClick={send}
        disabled={busy}
        className="t-btn t-btn-primary w-fit"
      >
        {busy
          ? "sending…"
          : question.number === total
            ? "submit final answer"
            : "submit answer"}
      </button>
    </div>
  );
}

export default function TeamDefense({ teamId }) {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // One wrapper for every call: busy flag, error message, and the new state.
  // Resolves true on success so Question can allow a retry after a failure.
  const run = useCallback(async (call) => {
    setBusy(true);
    setError(null);
    try {
      setState(await call());
      return true;
    } catch (err) {
      setError(err.message);
      // 409 = the server moved on (e.g. the question expired while the answer was
      // in flight). Reload the real state instead of leaving a stale question on screen.
      if (err.status === 409) {
        teamsApi.defense(teamId).then(setState).catch(() => {});
      }
      return false;
    } finally {
      setBusy(false);
    }
  }, [teamId]);

  useEffect(() => {
    run(() => teamsApi.defense(teamId));
  }, [teamId, run]);

  if (!state) {
    return error ? (
      <p className="text-sm text-[var(--t-red)]">{error}</p>
    ) : (
      <p className="t-caption">Loading…</p>
    );
  }

  const { session } = state;
  const answeredNotGraded = session?.status === "answered";

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-[var(--t-red)]">{error}</p>}
      {state.gradingError && (
        <p className="text-sm text-[var(--t-fog)]">{state.gradingError}</p>
      )}

      {session?.status === "active" && session.current && (
        <Question
          key={session.current.id}
          question={session.current}
          total={session.total}
          busy={busy}
          onAnswer={(body) => run(() => teamsApi.answerDefense(teamId, body))}
        />
      )}

      {session?.status === "generating" && (
        <p className="t-muted">Preparing your questions…</p>
      )}

      {(answeredNotGraded || session?.status === "grading") && (
        <button
          type="button"
          onClick={() => run(() => teamsApi.gradeDefense(teamId))}
          disabled={busy}
          className="t-btn t-btn-ghost w-fit"
        >
          {busy ? "grading…" : "grade my defense"}
        </button>
      )}

      {session?.status === "graded" && (
        <div className="flex flex-col gap-3">
          <p className="t-h2">
            Result: {session.result.score}% ·{" "}
            <span
              className={
                session.result.passed ? "text-[var(--t-green)]" : "text-[var(--t-red)]"
              }
            >
              {session.result.passed ? "passed" : "not passed"}
            </span>
          </p>
          <ul className="flex flex-col gap-2">
            {session.answered.map((q) => (
              <li key={q.id} className="t-card-subtle text-[13px]">
                <p className="text-[var(--t-paper)]">{q.text}</p>
                <p className="t-muted mt-1">
                  {q.expired ? "(no answer in time)" : q.answer}
                </p>
                <p className="mt-1 text-[var(--t-accent-text)]">
                  {q.score}/{q.maxScore} · {q.feedback}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.canStart && (
        <button
          type="button"
          onClick={() => run(() => teamsApi.startDefense(teamId))}
          disabled={busy}
          className="t-btn t-btn-primary w-fit"
        >
          {busy
            ? "preparing…"
            : session
              ? "try the defense again"
              : "start my defense"}
        </button>
      )}
      <p className="t-caption">
        Sessions used: {state.sessionsUsed}/{state.maxSessions}
      </p>
    </div>
  );
}
