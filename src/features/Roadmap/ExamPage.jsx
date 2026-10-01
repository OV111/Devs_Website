import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  RotateCcw, ArrowLeft, Loader2, AlertTriangle, Timer,
} from "lucide-react";
import { API_BASE_URL, authHeaders } from "../../../constants/api";
import useRoadmapStore from "../../stores/useRoadmapStore";
import InlineTeachBack from "./components/InlineTeachBack";

// ── Exam timer (only mounts when exam is ready) ───────────────
const ExamTimer = ({ timeLimitSecs, onExpire }) => {
  const [remaining, setRemaining] = useState(timeLimitSecs);
  // Ref keeps the latest onExpire closure; the interval below is created once,
  // so calling the prop directly would submit the first render's (empty) answers.
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Side effect lives outside the state updater (updaters must stay pure).
  useEffect(() => {
    if (remaining === 0) onExpireRef.current();
  }, [remaining]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const urgent = remaining < 60;

  return (
    <div
      role="timer"
      aria-label={`Time remaining ${mins} minutes ${secs} seconds`}
      className={`flex items-center gap-1.5 text-sm font-mono px-3 py-1.5 rounded-lg border transition-colors ${urgent ? "border-red-800/60 bg-red-950/30 text-red-400" : "border-neutral-800 bg-neutral-900 text-neutral-400"}`}
    >
      <Clock size={13} className={urgent ? "animate-pulse" : ""} /> {mins}:{secs}
      <span className="sr-only" aria-live="polite">
        {remaining === 60 ? "One minute remaining" : remaining === 10 ? "Ten seconds remaining" : ""}
      </span>
    </div>
  );
};

// ── Cooldown screen ───────────────────────────────────────────
const CooldownScreen = ({ message, onBack }) => {
  // parse "Retry in X minutes" from message
  const match = message.match(/(\d+)\s*minute/);
  const initMins = match ? parseInt(match[1], 10) : 0;
  const [secsLeft, setSecsLeft] = useState(initMins * 60);

  useEffect(() => {
    if (secsLeft <= 0) return;
    const t = setInterval(() => setSecsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const secs = String(secsLeft % 60).padStart(2, "0");

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full border border-amber-800/50 bg-amber-950/20 flex items-center justify-center mx-auto mb-5">
          <Timer size={28} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-200 mb-2">Cooldown Active</h2>
        <p className="text-sm text-neutral-500 mb-4">{message}</p>
        {secsLeft > 0 && (
          <div className="text-3xl font-mono font-bold text-amber-400 mb-6">
            {mins}:{secs}
          </div>
        )}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 text-sm transition-colors mx-auto"
        >
          <ArrowLeft size={14} /> Back to Roadmap
        </button>
      </div>
    </motion.div>
  );
};

// ── Result screen ─────────────────────────────────────────────
const ResultScreen = ({ result, passThreshold, onRetry, onBack, path, layer }) => {
  const { score, passed, correctCount, total, missedResults } = result;

  // auto-navigate to roadmap after pass
  useEffect(() => {
    if (!passed) return;
    const t = setTimeout(onBack, 3000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start px-6 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full max-w-2xl">
        <div className={`rounded-2xl border p-8 mb-8 text-center ${passed ? "border-purple-700/50 bg-purple-950/20" : "border-neutral-800 bg-neutral-900/40"}`}>
          <motion.div
            className={`text-7xl font-bold mb-2 ${passed ? "text-purple-400" : "text-neutral-400"}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            {score}%
          </motion.div>
          <div className={`text-lg font-semibold mb-1 ${passed ? "text-purple-300" : "text-neutral-300"}`}>
            {passed ? "Layer Passed!" : "Not Yet"}
          </div>
          <p className="text-sm text-neutral-500">
            {correctCount} / {total} correct · pass threshold {passThreshold}%
          </p>

          {passed ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                <CheckCircle2 size={16} /> Next layer unlocked
              </div>
              <p className="text-xs text-neutral-600">Returning to roadmap in 3 seconds...</p>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2 text-neutral-500 text-sm">
              <XCircle size={16} /> Review your weak spots and retry
            </div>
          )}
        </div>

        {missedResults?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">Topics to review</h3>
            <div className="space-y-3">
              {missedResults.map((r) => (
                <div key={r.id} className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                  <p className="text-sm text-neutral-300 mb-2">{r.stem}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-800/40">
                      Your answer: {r.yourAnswer}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/40">
                      Correct: {r.correctAnswer}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-wider">{r.topic}</span>
                  </div>
                  {r.hasRubric && (
                    <InlineTeachBack path={path} layer={layer} topic={r.topic} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 text-sm transition-colors"
          >
            <ArrowLeft size={14} /> Back to Roadmap
          </button>
          {!passed && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
            >
              <RotateCcw size={14} /> Retry Exam
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main exam page ────────────────────────────────────────────
export default function ExamPage() {
  const { layerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLayerStatus } = useRoadmapStore();

  // path comes from URL param — safe for direct navigation
  const path = searchParams.get("path") ?? "backend";

  const [loadState, setLoadState] = useState("loading"); // loading | cooldown | error | ready
  const [errorMsg, setErrorMsg] = useState("");
  const [examData, setExamData] = useState(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Integrity flags sent with the submission (review only, never graded).
  // A ref, not state: counting a tab switch must not re-render the exam.
  const integrityRef = useRef({ tabSwitches: 0, pasteEvents: 0 });

  const fetchExam = useCallback(async () => {
    integrityRef.current = { tabSwitches: 0, pasteEvents: 0 };
    setLoadState("loading");
    setErrorMsg("");
    setAnswers({});
    setCurrent(0);
    setSelected(null);
    setResult(null);
    setExamData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/exams/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ path, layer: layerId }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setErrorMsg(data.message ?? "Cooldown active. Please wait.");
        setLoadState("cooldown");
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.message ?? "Failed to load exam.");
        setLoadState("error");
        return;
      }

      setExamData(data);
      setLoadState("ready");
    } catch {
      setErrorMsg("Network error — please try again.");
      setLoadState("error");
    }
  }, [layerId, path]);

  useEffect(() => { fetchExam(); }, [fetchExam]);

  // React Router keeps the previous page's scroll position on navigation,
  // so jump to the top whenever an exam is entered.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [layerId]);

  // warn before leaving mid-exam
  useEffect(() => {
    if (loadState !== "ready" || result) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [loadState, result]);

  // count tab switches and pastes while an attempt is in progress
  useEffect(() => {
    if (loadState !== "ready" || result) return;
    const onVisibility = () => { if (document.hidden) integrityRef.current.tabSwitches++; };
    const onPaste = () => { integrityRef.current.pasteEvents++; };
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("paste", onPaste);
    };
  }, [loadState, result]);

  const handleSubmit = useCallback(async (finalAnswers) => {
    if (submitting || !examData) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/exams/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ attemptId: examData.attemptId, answers: finalAnswers, integrity: integrityRef.current }),
      });
      const data = await res.json();
      // Stay on the exam page on failure: the "error" screen's retry would
      // refetch a new exam and throw the learner's answers away.
      if (!res.ok) {
        setSubmitError(data.message ?? "Failed to submit exam.");
        return;
      }
      if (data.passed) setLayerStatus(layerId, "done");
      setResult(data);
    } catch {
      setSubmitError("Network error while submitting. Please retry.");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, examData, layerId, setLayerStatus]);

  const goBack = useCallback(() => navigate("/roadmaps"), [navigate]);

  const confirmLeave = () => {
    if (loadState === "ready" && !result) {
      if (!window.confirm("Leave the exam? Your progress will be lost.")) return;
    }
    goBack();
  };

  // ── Render states ──────────────────────────────────────────

  if (loadState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 size={24} className="animate-spin text-purple-500" />
          <p className="text-sm">Loading your exam...</p>
        </div>
      </div>
    );
  }

  if (loadState === "cooldown") {
    return <CooldownScreen message={errorMsg} onBack={goBack} />;
  }

  if (loadState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full border border-neutral-800 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-neutral-500" />
          </div>
          <p className="text-sm text-neutral-400 mb-6">{errorMsg}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={goBack} className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-400 text-sm hover:text-neutral-200 transition-colors">
              Back
            </button>
            <button onClick={fetchExam} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm transition-colors">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <ResultScreen
        result={result}
        passThreshold={examData.passThreshold}
        onRetry={fetchExam}
        onBack={goBack}
        path={path}
        layer={layerId}
      />
    );
  }

  // ── Exam in progress ───────────────────────────────────────

  const { questions, passThreshold, timeLimitSecs } = examData;
  const q = questions[current];
  const total = questions.length;
  const isLast = current === total - 1;

  const handleNext = () => {
    if (selected == null) return;
    const updated = { ...answers, [q.id]: selected };
    setAnswers(updated);
    setSelected(null);
    if (isLast) {
      handleSubmit(updated);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setSelected(answers[questions[current - 1].id] ?? null);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={confirmLeave}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
        >
          <ArrowLeft size={14} /> Roadmaps
        </button>
        {/* Timer only mounts when exam is ready — no wasted seconds */}
        <ExamTimer
          key={examData.attemptId}
          timeLimitSecs={timeLimitSecs}
          onExpire={() => {
            if (result) return;
            // include the choice made on the current, not-yet-saved question
            handleSubmit(selected == null ? answers : { ...answers, [q.id]: selected });
          }}
        />
      </div>

      {/* Progress header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-1">
          Layer Exam · pass threshold {passThreshold}%
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-300">Question {current + 1} of {total}</span>
          <span className="text-xs text-neutral-400">{Object.keys(answers).length} answered</span>
        </div>
        <div
          role="progressbar"
          aria-label="Exam progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current + 1}
          className="h-2 rounded-full bg-neutral-800 overflow-hidden"
        >
          <motion.div
            className="h-full bg-linear-to-r from-purple-600 to-violet-500 rounded-full"
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-widest text-purple-500/70 mb-2 block">{q.topic}</span>
            <h2 className="text-lg font-semibold text-neutral-100 leading-snug">{q.stem}</h2>
          </div>

          <div role="radiogroup" aria-label={q.stem} className="space-y-3">
            {q.choices.map((choice, idx) => (
              <button
                key={idx}
                role="radio"
                aria-checked={selected === idx}
                onClick={() => setSelected(idx)}
                className={`w-full min-h-11 text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  selected === idx
                    ? "border-purple-500 bg-purple-900/30 text-purple-200"
                    : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/60"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold mr-3 shrink-0 ${selected === idx ? "bg-purple-600 text-white" : "bg-neutral-800 text-neutral-500"}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {choice}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <div role="alert" className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          <span>{submitError}</span>
          <button
            onClick={() => handleSubmit(answers)}
            disabled={submitting}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-red-700/60 hover:bg-red-600/60 text-white text-xs font-medium disabled:opacity-50"
          >
            Retry submit
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-800">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        <button
          onClick={handleNext}
          disabled={selected == null || submitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {isLast ? "Submit Exam" : "Next"}
          {!isLast && !submitting && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}
