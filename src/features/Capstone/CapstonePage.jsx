import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, BadgeCheck, ChevronRight, Clock,
  Github, ExternalLink, GitBranch, RotateCcw, Send, Check, X,
} from "lucide-react";
import GradientText from "@/components/effects/GradientText";
import EyebrowBadge from "@/components/ui/EyebrowBadge";


const REVIEW_FILES = [
  "src/middleware/rate-limit.js",
  "src/routes/notes.js",
  "src/db/migrations/001_init.sql",
  "src/controllers/auth.js",
  "src/utils/validator.js",
];

const STEPS = [
  { num: "01", label: "path\ncomplete", done: true },
  { num: "02", label: "assigned",       done: true },
  { num: "03", label: "submitted",      done: true },
  { num: "04", label: "in\nreview",     done: false, active: true },
  { num: "5",  label: "approved",       done: false },
  { num: "6",  label: "on\nprofile",    done: false },
];

const APPROVAL_ITEMS = [
  "Backend developer certificate",
  "Verified portfolio piece on profile",
  '"Shipped it" badge on your account',
];

const REQUIREMENTS = [
  { label: "Repository is public",              done: true },
  { label: "README with setup instructions",    done: true },
  { label: "Live demo deployed",                done: true },
  { label: "CI pipeline passing",               done: true },
  { label: "Integration tests present",         done: true },
  { label: "No hardcoded secrets in repo",      done: false },
];

const REVISIONS = [
  {
    date: "14 days ago",
    action: "Assigned",
    detail: "Agent assigned capstone based on backend path · 91/100",
    type: "assign",
  },
  {
    date: "9 days ago",
    action: "Submitted",
    detail: "First submission — github.com/you/notes-api · v1.0.0",
    type: "submit",
  },
  {
    date: "7 days ago",
    action: "Sent back",
    detail: "Rate-limit middleware missing circuit breaker. Auth tests not isolated.",
    type: "reject",
  },
  {
    date: "5 days ago",
    action: "Resubmitted",
    detail: "Added circuit breaker, fixed test isolation — github.com/you/notes-api · v1.2.0",
    type: "submit",
  },
  {
    date: "Now",
    action: "In review",
    detail: "Agent running structured review · 3 of 8 checks complete",
    type: "active",
  },
];

const ACTIVITY_LOG = [
  { time: "10:42", msg: "opened", file: "src/routes/notes.js", status: "done" },
  { time: "10:44", msg: "flagged missing input validation in", file: "POST /notes", status: "warn" },
  { time: "10:46", msg: "opened", file: "src/middleware/rate-limit.js", status: "done" },
  { time: "10:49", msg: "reviewing", file: "src/middleware/rate-limit.js", status: "active" },
];

const RUBRIC = [
  { label: "Architecture",         score: 9.0, color: "bg-purple-500" },
  { label: "Code quality",         score: 8.5, color: "bg-purple-500" },
  { label: "Security",             score: 7.2, color: "bg-yellow-400" },
  { label: "Testing",              score: 8.8, color: "bg-purple-500" },
  { label: "Documentation",        score: null },
  { label: "Production-readiness", score: null },
];

const FEEDBACK = [
  {
    type: "strong",
    category: "Architecture",
    body: "Clean layering — your routes → controllers → services → repos split is exactly right for a service that will grow. No fat controllers, no business logic leaking into middleware.",
  },
  {
    type: "suggestion",
    category: "Testing",
    body: "Your integration tests use a real Mongo container — great. But every test creates a fresh user; consider a shared seed + transaction rollback. Cuts CI time roughly in half. Not blocking.",
  },
];

const QUESTIONS = [
  {
    q: "Why did you choose MongoDB over Postgres for a notes service with sharing relations?",
    answered: true,
    answer: "Notes are document-shaped (title + markdown + tags + share list). The sharing graph is shallow — at most one denormalised array. Postgres would force a join table I'd never use. I picked the model that matches the data.",
  },
  {
    q: "Walk me through what happens if your Redis instance for rate-limiting goes down. Does the API stay up?",
    answered: true,
    answer: (
      <>
        Yes.{" "}
        <code className="text-[12px] bg-neutral-700/60 px-1.5 py-0.5 rounded text-neutral-200">rateLimit.middleware.js</code>{" "}
        wraps Redis calls in a circuit breaker. If Redis fails, requests pass through with a header{" "}
        <code className="text-[12px] bg-neutral-700/60 px-1.5 py-0.5 rounded text-neutral-200">X-RateLimit: degraded</code>.
        We chose availability over strict enforcement — documented in DECISIONS.md §4.
      </>
    ),
  },
  {
    q: "If your service hit 10x traffic tomorrow, what's the first thing that breaks?",
    answered: false,
    daysLeft: 2,
  },
];


const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

function SectionLabel({ children }) {
  return (
    <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-purple-400 font-mono">
      {children}
    </p>
  );
}

function scoreColor(s) {
  if (s >= 8.5) return "text-green-400";
  if (s >= 7.0) return "text-yellow-400";
  return "text-red-400";
}


function AgentReviewingCard() {
  const [fileIndex, setFileIndex] = useState(0);
  const [progress, setProgress]   = useState(38);
  const [lines, setLines]         = useState(412);
  const [mins, setMins]           = useState(8);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.floor(Math.random() * 5 + 2);
        if (next >= 100) { setMins(8); return 18; }
        setMins((m) => Math.max(1, m - 1));
        return next;
      });
      setLines((l) => l + Math.floor(Math.random() * 14 + 4));
      setFileIndex((i) => (i + 1) % REVIEW_FILES.length);
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  return (
    <Motion.div {...FadeUp(0.12)} className="rounded-2xl border border-neutral-700/60 bg-[#0c0c0e] p-6 font-mono flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shrink-0" />
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400">Agent Reviewing</span>
      </div>
      <div>
        <p className="text-white text-xl font-bold leading-snug">
          structured review · 03 / <span className="text-neutral-600">08</span>
        </p>
        <AnimatePresence mode="wait">
          <Motion.p
            key={fileIndex}
            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.25 }}
            className="text-neutral-500 text-[11px] mt-1.5"
          >
            reading <span className="text-neutral-200 font-semibold">{REVIEW_FILES[fileIndex]}</span>
          </Motion.p>
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-[3px] w-full rounded-full bg-neutral-800 overflow-hidden">
          <Motion.div className="h-full bg-purple-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeInOut" }} />
        </div>
        <p className="text-[10px] text-neutral-600">est. {mins} min remaining · {lines} lines analysed</p>
      </div>
    </Motion.div>
  );
}


function OnApprovalCard() {
  return (
    <Motion.div {...FadeUp(0.2)} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col gap-4">
      <SectionLabel>// ON APPROVAL</SectionLabel>
      <p className="text-[13px] text-neutral-300 leading-relaxed">
        When the agent approves, all of this gets attached to your public profile permanently.
      </p>
      <ul className="flex flex-col gap-3">
        {APPROVAL_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[13px] text-neutral-300">
            <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center">
              <CheckCircle2 size={8} className="text-green-400" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Motion.div>
  );
}


function SubmitPanel() {
  const [repo, setRepo]   = useState("github.com/you/notes-api");
  const [live, setLive]   = useState("notes-api.railway.app");
  const [note, setNote]   = useState("");
  const done = REQUIREMENTS.filter((r) => r.done).length;
  const allDone = done === REQUIREMENTS.length;

  return (
    <Motion.div {...FadeUp(0.06)} className="rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col divide-y  divide-neutral-800">

      {/* header */}
      <div className="p-6 flex items-center justify-between gap-4  flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-neutral-700 bg-neutral-800 flex items-center justify-center shrink-0">
            <Send size={15} className="text-purple-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">Your submission</p>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">v1.2.0 · submitted 5 days ago</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-600/10 text-purple-300 font-mono">
          in review
        </span>
      </div>

      {/* links */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Repository</label>
          <div className="flex items-center gap-2 bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2.5">
            <Github size={13} className="text-neutral-500 shrink-0" />
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-neutral-200 font-mono outline-none placeholder:text-neutral-600"
              placeholder="github.com/you/project"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Live URL</label>
          <div className="flex items-center gap-2 bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2.5">
            <ExternalLink size={13} className="text-neutral-500 shrink-0" />
            <input
              value={live}
              onChange={(e) => setLive(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-neutral-200 font-mono outline-none placeholder:text-neutral-600"
              placeholder="yourapp.railway.app"
            />
          </div>
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Notes to reviewer (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Anything the agent should know about this submission…"
            className="bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2.5 text-[12px] text-neutral-200 font-mono outline-none resize-none placeholder:text-neutral-600 focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* requirements */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SectionLabel>// REQUIREMENTS CHECKLIST</SectionLabel>
          <span className={`text-[10px] font-mono font-bold ${allDone ? "text-green-400" : "text-yellow-400"}`}>
            {done}/{REQUIREMENTS.length} complete
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {REQUIREMENTS.map((r) => (
            <div key={r.label} className="flex items-center gap-2.5">
              <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${r.done ? "bg-green-500/15 border-green-500/40" : "bg-red-500/10 border-red-500/30"}`}>
                {r.done
                  ? <Check size={9} className="text-green-400" />
                  : <X size={9} className="text-red-400" />}
              </span>
              <span className={`text-[12px] ${r.done ? "text-neutral-300" : "text-neutral-500"}`}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* action */}
      <div className="p-6 flex items-center gap-4 flex-wrap">
        <button
          disabled={!allDone}
          className={`flex items-center gap-2 text-[12px] font-semibold px-5 py-2.5 rounded-lg border font-mono transition-colors
            ${allDone
              ? "border-purple-500/60 bg-purple-600/15 text-purple-300 hover:bg-purple-600/25"
              : "border-neutral-800 bg-neutral-900 text-neutral-600 cursor-not-allowed"}`}
        >
          <RotateCcw size={13} />
          resubmit with changes
        </button>
        {!allDone && (
          <p className="text-[11px] text-red-400/70 font-mono">fix failing requirements to resubmit</p>
        )}
      </div>
    </Motion.div>
  );
}


function RevisionHistory() {
  const typeStyles = {
    assign: { dot: "bg-purple-500", text: "text-purple-400" },
    submit: { dot: "bg-green-500",  text: "text-green-400"  },
    reject: { dot: "bg-red-500",    text: "text-red-400"    },
    active: { dot: "bg-yellow-400 animate-pulse", text: "text-yellow-400" },
  };

  return (
    <Motion.div {...FadeUp(0.1)} className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 flex flex-col gap-5">
      <SectionLabel>// REVISION HISTORY</SectionLabel>
      <div className="flex flex-col gap-0">
        {REVISIONS.map((rev, i) => {
          const s = typeStyles[rev.type];
          return (
            <div key={i} className="flex gap-4">
              {/* timeline line */}
              <div className="flex flex-col items-center">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${s.dot}`} />
                {i < REVISIONS.length - 1 && <div className="w-px flex-1 bg-neutral-800 my-1" />}
              </div>
              {/* content */}
              <div className={`pb-5 flex flex-col gap-0.5 ${i === REVISIONS.length - 1 ? "" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold font-mono ${s.text}`}>{rev.action}</span>
                  <span className="text-[10px] text-neutral-600 font-mono">· {rev.date}</span>
                </div>
                <p className="text-[12px] text-neutral-400 leading-relaxed">{rev.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Motion.div>
  );
}


function AgentActivityLog() {
  const [log, setLog] = useState(ACTIVITY_LOG);

  const LIVE_EVENTS = [
    { msg: "checked error handling in", file: "src/controllers/auth.js", status: "done" },
    { msg: "flagged N+1 query in", file: "src/services/notes.js", status: "warn" },
    { msg: "opened", file: "src/utils/validator.js", status: "done" },
    { msg: "reviewing", file: "src/utils/validator.js", status: "active" },
    { msg: "passed schema validation check in", file: "src/db/schema.js", status: "done" },
  ];

  const [evIdx, setEvIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
      const ev = LIVE_EVENTS[evIdx % LIVE_EVENTS.length];
      setLog((l) => [...l.slice(-11), { time, ...ev }]);
      setEvIdx((i) => i + 1);
    }, 3000);
    return () => clearInterval(iv);
  }, [evIdx]);


  const statusColor = { done: "text-green-400", warn: "text-yellow-400", active: "text-purple-400" };
  const statusIcon  = { done: "✓", warn: "!", active: "›" };

  return (
    <Motion.div {...FadeUp(0.14)} className="rounded-2xl border border-neutral-700/60 bg-[#0c0c0e] p-6 font-mono flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <SectionLabel>// AGENT ACTIVITY LOG</SectionLabel>
        </div>
        <span className="text-[9px] text-neutral-600">live · updating</span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-none">
        <AnimatePresence initial={false}>
          {log.map((entry, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2.5 text-[11px]"
            >
              <span className="text-neutral-700 shrink-0 w-10">{entry.time}</span>
              <span className={`shrink-0 w-3 ${statusColor[entry.status]}`}>{statusIcon[entry.status]}</span>
              <span className="text-neutral-400">
                {entry.msg}{" "}
                <span className="text-neutral-200">{entry.file}</span>
              </span>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
}


function AgentReviewFullCard() {
  return (
    <Motion.div {...FadeUp(0.08)} className="rounded-2xl border border-neutral-700/60 bg-[#0d0d10] font-mono flex flex-col divide-y divide-neutral-800/80">

      {/* header */}
      <div className="p-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl border-2 border-purple-500/60 bg-purple-600/10 flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-md border-2 border-purple-400" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-white">Agent review · partial</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">in progress · 3 of 8 checks complete</p>
          </div>
        </div>
        <div className="border border-purple-500/40 bg-purple-600/10 rounded-xl px-5 py-2.5 flex items-center gap-2">
          <span className="text-[11px] text-neutral-500">interim ·</span>
          <span className="text-2xl font-bold text-purple-300">8.4</span>
          <span className="text-[12px] text-neutral-600">/10</span>
        </div>
      </div>

      {/* rubric */}
      <div className="p-6 flex flex-col gap-5">
        <SectionLabel>// RUBRIC · PARTIAL</SectionLabel>
        {RUBRIC.map(({ label, score, color }) => (
          <div key={label} className="grid grid-cols-[160px_1fr_72px] items-center gap-4">
            <span className="text-[13px] text-white">{label}</span>
            <div className="h-[5px] rounded-full bg-neutral-800 overflow-hidden">
              {score !== null && (
                <Motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / 10) * 100}%` }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              )}
            </div>
            <div className="text-right">
              {score !== null ? (
                <span className="text-[12px] font-bold">
                  <span className={scoreColor(score)}>{score.toFixed(1)}</span>
                  <span className="text-neutral-600">/10</span>
                </span>
              ) : (
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-neutral-700 text-[11px]">—</span>
                  <span className="text-[9px] text-neutral-600">pending</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* feedback */}
      <div className="p-6 flex flex-col gap-4">
        <SectionLabel>// FEEDBACK SO FAR</SectionLabel>
        {FEEDBACK.map((fb) => (
          <div key={fb.category} className="border-l-2 border-green-500/50 pl-4 flex flex-col gap-1.5">
            <p className="text-[9px] font-bold tracking-[0.13em] uppercase">
              <span className={fb.type === "strong" ? "text-green-400" : "text-purple-400"}>
                {fb.type === "strong" ? "✓ STRONG" : "→ SUGGESTION"}
              </span>
              <span className="text-neutral-600"> · {fb.category.toUpperCase()}</span>
            </p>
            <p className="text-[12px] text-neutral-300 leading-relaxed">{fb.body}</p>
          </div>
        ))}
      </div>

      {/* questions */}
      <div className="p-6 flex flex-col gap-2">
        <SectionLabel>// QUESTIONS AGENT ASKED YOU</SectionLabel>
        <div className="flex flex-col divide-y divide-neutral-800/60 mt-2">
          {QUESTIONS.map((item, i) => (
            <div key={i} className="py-6 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg leading-none mt-0.5 shrink-0">?</span>
                <p className="text-[15px] font-semibold text-white leading-snug" style={{ fontFamily: "inherit" }}>{item.q}</p>
              </div>
              {item.answered ? (
                <p className="text-[12px] text-neutral-400 leading-relaxed ml-6">
                  <span className="font-bold text-neutral-200">your answer: </span>
                  {item.answer}
                </p>
              ) : (
                <div className="ml-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-yellow-400">
                    <Clock size={10} />
                    awaiting your answer · {item.daysLeft} days left
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Type your answer…"
                    className="bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2.5 text-[12px] text-neutral-200 outline-none resize-none placeholder:text-neutral-600 focus:border-purple-500/50 transition-colors w-full max-w-2xl"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-800 pt-5 flex items-center gap-6 flex-wrap">
          <button className="text-[11px] font-semibold text-neutral-300 border border-neutral-700 rounded-lg px-4 py-2.5 hover:border-purple-500/50 hover:text-white transition-colors">
            submit answer
          </button>
          <p className="text-[10px] text-neutral-600">
            final review when agent finishes &amp; you've answered all
          </p>
        </div>
      </div>
    </Motion.div>
  );
}


export default function CapstonePage() {
  return (
    <div className="min-h-screen text-white">

      {/* ── Top: hero + reviewing card ── */}
      <div className="max-w-7xl mx-auto px-6  lg:px-12 pt-14 pb-0">
        <Motion.div {...FadeUp(0)} className="flex items-center gap-1.5 text-[11px] text-neutral-600 mb-8 font-mono">
          <span>capstone</span><ChevronRight size={11} /><span>backend</span><ChevronRight size={11} />
          <span className="text-neutral-300 font-semibold">submission</span>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-12 items-start">
          {/* left */}
          <div className="flex flex-col gap-7">
            <Motion.div {...FadeUp(0.04)}>
              <EyebrowBadge dot text="ship it · backend developer · capstone" color="purple" />
            </Motion.div>

            <Motion.h1 {...FadeUp(0.08)} className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.08] tracking-tight">
              You finished the path.
              <br />
              Now <GradientText className="font-bold">build something real.</GradientText>
            </Motion.h1>

            <Motion.p {...FadeUp(0.14)} className="text-neutral-400 text-[15px] leading-relaxed max-w-lg">
              The agent assigned a capstone scoped to what you learned. Build it, ship it, submit.
              The agent reviews like a senior dev — asks hard questions, then approves or sends it back.
            </Motion.p>

            <Motion.div {...FadeUp(0.2)} className="flex flex-wrap gap-2">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] font-semibold leading-tight whitespace-pre-line
                    ${step.active ? "border-purple-500/60 bg-purple-600/15 text-purple-300"
                    : step.done  ? "border-green-600/40 bg-green-600/10 text-green-400"
                    :               "border-neutral-800 bg-neutral-900/40 text-neutral-600"}`}
                >
                  {step.done   && <CheckCircle2 size={12} className="text-green-400 shrink-0" />}
                  {step.active && <Circle size={12} className="text-purple-400 shrink-0" />}
                  <span>
                    <span className={step.done || step.active ? "mr-1" : "mr-1 text-neutral-700"}>{step.num}</span>
                    {step.label}
                  </span>
                </div>
              ))}
            </Motion.div>
          </div>

          <AgentReviewingCard />
        </div>
      </div>

      <div className="border-t  border-neutral-800/60 mt-30" />

      {/* ── Assignment + On Approval ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <Motion.div {...FadeUp(0.06)} className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-7 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg border border-neutral-700 bg-neutral-800 flex items-center justify-center shrink-0">
                <BadgeCheck size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">your agent · assigned 14 days ago</p>
                <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">based on backend path · final exam · 91/100</p>
              </div>
            </div>
            <div className="border-t border-neutral-800" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Capstone: Production-ready REST API for a notes service
              </h2>
              <p className="text-neutral-400 text-[13px] leading-relaxed mt-3">
                You've cleared every layer of the backend path. The capstone is a complete production service — not a tutorial project. You'll design the schema, write the auth layer, handle rate limiting, write integration tests, and deploy it with a working CI pipeline.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Node.js", "PostgreSQL", "Redis", "Docker", "GitHub Actions"].map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700/60 text-neutral-400">{s}</span>
              ))}
            </div>
          </Motion.div>
          <OnApprovalCard />
        </div>
      </div>

      <div className="border-t border-neutral-800/60" />

      {/* ── Submit + Revision history (side by side) ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <SubmitPanel />
          <RevisionHistory />
        </div>
      </div>

      <div className="border-t border-neutral-800/60" />

      {/* ── Agent activity log ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <AgentActivityLog />
      </div>

      <div className="border-t border-neutral-800/60" />

      {/* ── Full agent review (rubric + feedback + Q&A) ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <AgentReviewFullCard />
      </div>

    </div>
  );
}
