import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { GraduationCap, Mic, MicOff, Sparkles } from "lucide-react";
import { API_BASE_URL, authHeaders } from "../../../../constants/api";
import { useSpeechDictation } from "../../AI-Agent/lib/useSpeechDictation";
import TeachBackCard from "../../AI-Agent/components/TeachBackCard";

/**
 * Teach-Back, inline on the exam results screen — no navigation to /ai-agent.
 * Reuses TeachBackCard for the graded breakdown (same rendering the chat
 * surface uses) and the shared dictation hook for the mic button, so this and
 * the general chat's Teach-Back mode can never drift into two different
 * grading UIs.
 *
 * `hasRubric` gates whether this even renders — see examEngineService.js:
 * submitAttempt now tells the client which missed topics have a rubric
 * authored, so we never show a composer that's guaranteed to 404.
 */

// Auto-growing textarea, same behavior as ChatInput.jsx's composer — a fixed
// row count meant typed answers outgrew the box while the mic dictation
// (which can produce a full paragraph in one go) made this worse.
const AutoTextarea = ({ value, onChange, placeholder, autoFocus }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      rows={3}
      className="w-full bg-neutral-900 border border-neutral-700/50 rounded-lg px-3 py-2.5 text-[14px] leading-relaxed text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/50 focus:border-purple-600/50 resize-none transition-colors"
    />
  );
};

const DictationButton = ({ speechSupported, isListening, toggleListening }) => {
  if (!speechSupported) return <span />;
  return (
    <button
      onClick={toggleListening}
      aria-pressed={isListening}
      title={isListening ? "Stop dictation" : "Dictate"}
      aria-label={isListening ? "Stop dictation" : "Dictate your answer"}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
        isListening ? "text-red-400 bg-red-950/40 animate-pulse" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
      }`}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
};

// Shown in place of the composer while the server grades the answer — a
// multi-second Groq call with only a tiny in-button spinner reads as stalled
// rather than working.
const GradingState = () => (
  <div className="mt-2 rounded-xl border border-purple-700/30 bg-purple-950/10 p-4 flex items-center gap-3">
    <div className="relative shrink-0">
      <Sparkles size={16} className="text-purple-400 animate-pulse" />
    </div>
    <div className="flex-1">
      <p className="text-[13px] font-medium text-purple-200">Grading your explanation...</p>
      <p className="text-[11px] text-neutral-500 mt-0.5">Checking it against the rubric — a few seconds.</p>
    </div>
  </div>
);

const InlineTeachBack = ({ path, layer, topic }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { data } | { error }
  const [followUpMode, setFollowUpMode] = useState(false);

  const { isSupported: speechSupported, isListening, toggleListening } = useSpeechDictation(draft, setDraft);

  const submit = async () => {
    if (!draft.trim() || submitting) return;
    setSubmitting(true);

    const isFollowUp = followUpMode && result?.data?.followUp;
    const url = isFollowUp
      ? `${API_BASE_URL}/api/exams/submit-teach-back-followup`
      : `${API_BASE_URL}/api/exams/submit-teach-back`;
    const body = isFollowUp
      ? { sessionId: result.data.sessionId, answerText: draft }
      : { path, layer, topic, answerText: draft };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      // A follow-up grades only the targeted criterion — carry sessionId
      // forward so a second follow-up round (if ever added) still has it.
      setResult({ data: { ...data, sessionId: data.sessionId ?? result?.data?.sessionId } });
    } catch (err) {
      setResult({ error: err.message || "Couldn't grade this explanation." });
    } finally {
      setSubmitting(false);
      setDraft("");
      setFollowUpMode(false);
    }
  };

  return (
    <div className="mt-2">
      {!open && !result && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg bg-purple-600/10 border border-purple-600/40 text-purple-300 hover:bg-purple-600/20 hover:border-purple-500/60 transition-colors"
        >
          <GraduationCap size={14} />
          Teach it back
        </button>
      )}

      <AnimatePresence mode="wait">
        {submitting && (
          <motion.div key="grading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GradingState />
          </motion.div>
        )}

        {open && !result && !submitting && (
          <motion.div
            key="composer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-purple-700/30 bg-purple-950/10 p-3.5">
              <p className="text-[12px] font-medium text-purple-300 mb-2">
                Explain <strong className="text-purple-100">{topic}</strong> in your own words — type or dictate.
              </p>
              <AutoTextarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Start explaining..." autoFocus />
              <div className="flex items-center justify-between mt-2.5">
                <DictationButton speechSupported={speechSupported} isListening={isListening} toggleListening={toggleListening} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="h-9 text-[12px] text-neutral-500 hover:text-neutral-300 px-3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={!draft.trim()}
                    className="h-9 flex items-center gap-1.5 text-[12px] px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {result && !submitting && (
        <div className="mt-2">
          <TeachBackCard
            data={result.data}
            error={result.error}
            onAnswerFollowUp={() => {
              setFollowUpMode(true);
              setOpen(true);
            }}
          />
          {followUpMode && (
            <div className="mt-2 rounded-xl border border-purple-700/30 bg-purple-950/10 p-3.5">
              <p className="text-[12px] font-medium text-purple-300 mb-2">Answer the follow-up above.</p>
              <AutoTextarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Answer the follow-up..." autoFocus />
              <div className="flex items-center justify-between mt-2.5">
                <DictationButton speechSupported={speechSupported} isListening={isListening} toggleListening={toggleListening} />
                <button
                  onClick={submit}
                  disabled={!draft.trim()}
                  className="h-9 flex items-center gap-1.5 text-[12px] px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InlineTeachBack;
