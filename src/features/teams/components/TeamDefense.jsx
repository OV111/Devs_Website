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
      <p className="text-[15px] font-semibold leading-snug text-white">
        <span className="mr-2 font-bold text-purple-500">?</span>
        {question.text}
      </p>
      <span
        className={`flex items-center gap-2 text-xs ${urgent ? "text-red-400" : "text-yellow-400"}`}
        role="timer"
      >
        <Clock size={10} aria-hidden="true" />
        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} left ·
        question {question.number} of {total} · no going back
      </span>
      <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
        <FileCode2 size={10} aria-hidden="true" />
        PR #{question.prNumber} · {question.codeRef.path}
      </span>
      <pre className="max-h-64 overflow-auto rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-[11px] leading-relaxed text-neutral-300">
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
        className="w-full max-w-2xl resize-y rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-2.5 text-sm text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 focus:border-purple-500/50"
      />
      <button
        type="button"
        onClick={send}
        disabled={busy}
        className="w-fit rounded-lg border border-neutral-700 px-4 py-2.5 text-xs font-semibold text-neutral-300 transition-colors hover:border-purple-500/50 hover:text-white disabled:opacity-50"
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
      <p className="text-sm text-red-400">{error}</p>
    ) : (
      <p className="text-sm text-neutral-500">Loading…</p>
    );
  }

  const { session } = state;
  const answeredNotGraded = session?.status === "answered";

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {state.gradingError && (
        <p className="text-sm text-yellow-400">{state.gradingError}</p>
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
        <p className="text-sm text-neutral-400">Preparing your questions…</p>
      )}

      {(answeredNotGraded || session?.status === "grading") && (
        <button
          type="button"
          onClick={() => run(() => teamsApi.gradeDefense(teamId))}
          disabled={busy}
          className="w-fit rounded-lg border border-neutral-700 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:border-purple-500/50 hover:text-white disabled:opacity-50"
        >
          {busy ? "grading…" : "grade my defense"}
        </button>
      )}

      {session?.status === "graded" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white">
            Result: {session.result.score}% ·{" "}
            <span
              className={
                session.result.passed ? "text-green-400" : "text-red-400"
              }
            >
              {session.result.passed ? "passed" : "not passed"}
            </span>
          </p>
          <ul className="flex flex-col gap-2">
            {session.answered.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-neutral-800 p-3 text-[13px] text-neutral-300"
              >
                <p className="font-semibold text-white">{q.text}</p>
                <p className="mt-1 text-neutral-400">
                  {q.expired ? "(no answer in time)" : q.answer}
                </p>
                <p className="mt-1 text-purple-300">
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
          className="w-fit rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
        >
          {busy
            ? "preparing…"
            : session
              ? "try the defense again"
              : "start my defense"}
        </button>
      )}
      <p className="text-xs text-neutral-500">
        Sessions used: {state.sessionsUsed}/{state.maxSessions}
      </p>
    </div>
  );
}
