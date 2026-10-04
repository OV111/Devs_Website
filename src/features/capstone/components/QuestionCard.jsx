import { useEffect, useRef, useState } from "react";
import { Clock, FileCode2 } from "lucide-react";
import useCountdown from "../hooks/useCountdown";

/**
 * The open defense question, in the original "? question / your answer" style.
 * Mounted with key={question.id}, so each question starts fresh.
 *
 * - Timer from the server (useCountdown); at 0 whatever is typed is submitted
 *   automatically — the server still accepts it within its short grace.
 * - Paste and tab-switch counts go with the answer: admin-only signals,
 *   never part of the score.
 */
export default function QuestionCard({ question, total, onAnswer, busy }) {
  const [text, setText] = useState("");
  const [pasteEvents, setPasteEvents] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const sent = useRef(false);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") setTabSwitches((n) => n + 1);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const send = async () => {
    if (sent.current) return; // timer expiry and a click must not both submit
    sent.current = true;
    const result = await onAnswer({
      questionId: question.id,
      answer: text,
      integrity: { tabSwitches, pasteEvents },
    });
    // The action resolves to null when the request failed: allow a retry.
    if (!result) sent.current = false;
  };

  const left = useCountdown(question.secondsLeft, question.id, send);
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");
  const urgent = left <= 30;

  return (
    <div className="py-6 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-purple-500 font-bold text-lg leading-none mt-0.5 shrink-0">
          ?
        </span>
        <p
          className="text-[15px] font-semibold text-white leading-snug"
          style={{ fontFamily: "inherit" }}
        >
          {question.text}
        </p>
      </div>
      <div className="ml-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`flex items-center gap-2 text-xs ${urgent ? "text-red-400" : "text-yellow-400"}`}
            role="timer"
            aria-live={urgent ? "assertive" : "off"}
          >
            <Clock size={10} />
            awaiting your answer · {mm}:{ss} left · question {question.number}{" "}
            of {total} · no going back
          </span>
          {question.codeRef && (
            <a
              href={question.codeUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300"
            >
              <FileCode2 size={10} />
              {question.codeRef.path}
              {question.codeRef.line ? `:${question.codeRef.line}` : ""}
            </a>
          )}
        </div>
        <label className="sr-only" htmlFor={`answer-${question.id}`}>
          Your answer
        </label>
        <textarea
          id={`answer-${question.id}`}
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={() => setPasteEvents((n) => n + 1)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send();
          }}
          maxLength={3000}
          autoFocus
          placeholder="Type your answer… specific to your code"
          className="bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 outline-none resize-y placeholder:text-neutral-500 focus:border-purple-500/50 transition-colors w-full max-w-2xl"
        />
        <div className="flex items-center gap-6 flex-wrap">
          <button
            type="button"
            onClick={send}
            disabled={busy}
            className="text-xs font-semibold text-neutral-300 border border-neutral-700 rounded-lg px-4 py-2.5 hover:border-purple-500/50 hover:text-white transition-colors disabled:opacity-50"
          >
            {busy
              ? "sending…"
              : question.number === total
                ? "submit final answer"
                : "submit answer"}
          </button>
          <p className="text-xs text-neutral-500">
            {text.length}/3000 · Ctrl+Enter to submit
          </p>
        </div>
      </div>
    </div>
  );
}
