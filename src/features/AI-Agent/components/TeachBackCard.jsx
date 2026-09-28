import { useEffect, useRef } from "react";
import { GraduationCap, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import { speak, isSpeechSupported } from "../lib/speech";

/**
 * Rendered inline after a teach-back explanation is graded via
 * POST /api/exams/submit-teach-back. Only displays what the server computed —
 * no client-side scoring, same rule ContextCard follows.
 */
export default function TeachBackCard({ data, error, onAnswerFollowUp }) {
  // Speak the follow-up once when it first appears — this is the piece that
  // makes it feel like the mentor is actually asking, not just printing text.
  const spokenRef = useRef(false);
  useEffect(() => {
    if (data?.followUp && !spokenRef.current) {
      spokenRef.current = true;
      speak(data.followUp.question);
    }
  }, [data?.followUp]);

  return (
    <div className="max-w-2xl rounded-xl border border-purple-700/40 bg-purple-950/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap size={13} className="text-purple-400" />
        <span className="text-[11px] font-bold tracking-widest uppercase text-purple-400">
          teach-back result
        </span>
      </div>

      {error ? (
        <p className="text-[12px] text-amber-400/90">{error}</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            {data.passed ? (
              <CheckCircle2 size={15} className="text-green-400" />
            ) : (
              <XCircle size={15} className="text-red-400" />
            )}
            <span className={`text-sm font-semibold ${data.passed ? "text-green-400" : "text-red-400"}`}>
              {data.score}% — {data.passed ? "Solid understanding" : "Needs more work"}
            </span>
          </div>

          <div className="space-y-2">
            {data.criteria.map((c) => (
              <div key={c.id} className="text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">{c.label}</span>
                  <span className="font-mono text-white/50">{c.score}/{c.maxScore}</span>
                </div>
                {c.feedback && <p className="text-white/40 mt-0.5">{c.feedback}</p>}
              </div>
            ))}
          </div>

          {data.misconceptionsDetected?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[11px] text-amber-400/80 mb-1">Misconceptions detected</p>
              <ul className="text-[12px] text-white/50 list-disc list-inside">
                {data.misconceptionsDetected.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {data.followUp && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <p className="text-[11px] text-purple-400/80">Follow-up</p>
                {isSpeechSupported() && (
                  <button
                    onClick={() => speak(data.followUp.question)}
                    title="Listen"
                    aria-label="Listen to follow-up question"
                    className="text-purple-400/60 hover:text-purple-300"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
              <p className="text-[13px] text-white/80 mb-2">{data.followUp.question}</p>
              <button
                onClick={() => onAnswerFollowUp?.(data)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-purple-700/50 text-purple-400 hover:bg-purple-950/30 transition-colors"
              >
                Answer
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
