import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, RotateCcw, Eye, Lock, CheckCircle2, XCircle, Clock } from "lucide-react";

// ── Mock data ───────────────────────────────────────────────────
const MOCK_CHALLENGE = {
  id: "P_03_09",
  type: "CODE",
  difficulty: "MEDIUM",
  xp: 45,
  weakTopic: true,
  title: "Async error wrapper for Express",
  breadcrumb: ["arena", "backend", "layer 3"],
  description: `You're building an Express API where every route handler is <code>async</code>. Right now, any error thrown inside an async handler escapes the framework's error pipeline and crashes silently.`,
  task: `Write a function <code>asyncHandler(fn)</code> that takes an async route handler and returns a wrapped handler that catches any rejection and forwards it to Express's <code>next()</code>.`,
  constraints: [
    "Must work with both async functions and functions returning Promises.",
    "Must not change the original function's signature.",
    "Synchronous handlers should still work if accidentally wrapped.",
    "No external libraries (the standard library is fine).",
  ],
  example: `const safeGet = asyncHandler(async (req, res) => {
  const data = await fetchData(req.params.id);
  res.json(data);
});
app.get('/data/:id', safeGet);`,
  files: [
    {
      name: "asyncHandler.js",
      lang: "js",
      code: `// asyncHandler.js
// Wrap an async express handler so rejections reach next()

function asyncHandler(fn) {
  return function (req, res, next) {
    try {
      const result = fn(req, res, next);
      if (result && typeof result.catch === 'function') {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncHandler;`,
    },
    {
      name: "asyncHandler_test.js",
      lang: "test",
      code: `// asyncHandler_test.js
const asyncHandler = require('./asyncHandler');

test('resolved_promise_passes', async () => {
  // ...
});`,
    },
  ],
  hints: [
    {
      id: 1,
      revealed: true,
      cost: 0,
      text: `You're close — 4/5 tests pass. The failing one is <code>preserves_arity</code>. Re-read what Express decides with <code>fn.length</code> to decide if a function is an error handler vs a normal handler.`,
    },
    {
      id: 2,
      revealed: false,
      cost: 5,
      text: `Use <code>Object.defineProperty</code> on the wrapper to set its <code>length</code> to match <code>fn.length</code> before returning it.`,
    },
    {
      id: 3,
      revealed: false,
      cost: 15,
      text: `Here's the key line: <code>Object.defineProperty(wrapper, 'length', { value: fn.length });</code>`,
    },
  ],
  testResults: [
    { name: "resolved_promise_passes", passed: true, ms: 3 },
    { name: "rejection_calls_next", passed: true, ms: 2 },
    { name: "sync_throw_calls_next", passed: true, ms: 1 },
    { name: "does_not_mutate_fn", passed: true, ms: 1 },
    { name: "preserves_arity", passed: false, ms: 4 },
  ],
};

const FILE_COLORS = { js: "#f0db4f", test: "#a78bfa" };
const FILE_BG = { js: "#1c1c00", test: "#1a0f2e" };

// ── Sub-components ───────────────────────────────────────────────

function Breadcrumb({ items, onBack }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-neutral-500 font-mono">
      <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer">
        <ChevronLeft size={14} />
      </button>
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-2">
          <span className={i === items.length - 1 ? "text-white font-semibold" : ""}>{item}</span>
          {i < items.length - 1 && <span className="text-neutral-700">/</span>}
        </span>
      ))}
    </div>
  );
}

function TagBadge({ children, color = "#e5e5e5", bg = "#1a1a1a", border = "#333" }) {
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider"
      style={{ color, background: bg, border: `1px solid ${border}` }}>
      {children}
    </span>
  );
}

function ProblemPanel({ challenge }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto text-[#ccc] px-6 py-5 gap-5">
      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <TagBadge>{challenge.id}</TagBadge>
        <TagBadge color="#4ade80" bg="#0a1f0a" border="#166534">{challenge.type}</TagBadge>
        <TagBadge>{challenge.difficulty}</TagBadge>
        <TagBadge color="#a855f7" bg="#1a0a2e" border="#6d28d9">+{challenge.xp} XP</TagBadge>
        {challenge.weakTopic && (
          <TagBadge color="#fbbf24" bg="#1c1000" border="#92400e">YOUR WEAK TOPIC</TagBadge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-[22px] font-bold text-white leading-tight">{challenge.title}</h1>

      {/* Description */}
      <p className="text-[13px] leading-relaxed text-neutral-400"
        dangerouslySetInnerHTML={{ __html: challenge.description }} />

      {/* Task */}
      <div>
        <h2 className="text-[14px] font-bold text-white mb-2">The task</h2>
        <p className="text-[13px] leading-relaxed text-neutral-400"
          dangerouslySetInnerHTML={{ __html: challenge.task }} />
      </div>

      {/* Constraints */}
      <div>
        <h2 className="text-[14px] font-bold text-white mb-2">Constraints</h2>
        <ul className="flex flex-col gap-1.5">
          {challenge.constraints.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-neutral-400">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: c }} />
            </li>
          ))}
        </ul>
      </div>

      {/* Example */}
      <div>
        <h2 className="text-[14px] font-bold text-white mb-2">Example usage</h2>
        <pre className="text-[12px] leading-relaxed text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto font-mono">
          {challenge.example}
        </pre>
      </div>
    </div>
  );
}

function CodePanel({ files }) {
  const [activeFile, setActiveFile] = useState(0);
  const file = files[activeFile];

  return (
    <div className="flex flex-col h-full">
      {/* File tabs */}
      <div className="flex items-center border-b border-neutral-800 shrink-0">
        {files.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActiveFile(i)}
            className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium transition-colors cursor-pointer border-b-2"
            style={{
              borderBottomColor: activeFile === i ? FILE_COLORS[f.lang] : "transparent",
              color: activeFile === i ? "#e5e5e5" : "#555",
              background: activeFile === i ? FILE_BG[f.lang] : "transparent",
            }}
          >
            <span className="w-3 h-3 rounded-sm"
              style={{ background: FILE_COLORS[f.lang] }} />
            {f.name}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[13px] font-mono">
          <tbody>
            {file.code.split("\n").map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="select-none text-right pr-4 pl-4 text-neutral-700 w-8 text-[11px]">
                  {i + 1}
                </td>
                <td className="pr-4 text-neutral-300 whitespace-pre">{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Test runner bar */}
      <TestRunner />
    </div>
  );
}

function TestRunner() {
  const results = MOCK_CHALLENGE.testResults;
  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  return (
    <div className="shrink-0 border-t border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
          <span>// TEST RUNNER</span>
          <span className="text-[#4ade80] font-bold">LAST RUN</span>
          <span>NODE V20.12 · JEST</span>
          <span className="text-[#4ade80] font-bold">4S AGO</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded border border-neutral-800 hover:border-neutral-600">
            <RotateCcw size={11} /> Re-run
          </button>
          <button className="flex items-center gap-1.5 text-[11px] bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer px-3 py-1 rounded font-semibold">
            <Play size={11} /> Run
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col divide-y divide-neutral-900 max-h-40 overflow-y-auto">
        {results.map((r) => (
          <div key={r.name} className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              {r.passed
                ? <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                : <XCircle size={13} className="text-red-400 shrink-0" />}
              <span className="text-[12px] font-mono text-neutral-300">{r.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
              <Clock size={10} />
              {r.ms}ms
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 py-2 border-t border-neutral-800 flex items-center gap-3 text-[11px]">
        <span className="text-green-400 font-bold">{passed} passed</span>
        <span className="text-neutral-700">·</span>
        <span className="text-red-400 font-bold">{total - passed} failed</span>
        <span className="text-neutral-700">·</span>
        <span className="text-neutral-500">{total} total</span>
      </div>
    </div>
  );
}

function HintsPanel({ hints: initialHints }) {
  const [hints, setHints] = useState(initialHints);

  const revealHint = (id) => {
    setHints(prev => prev.map(h => h.id === id ? { ...h, revealed: true } : h));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800 shrink-0">
        <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-1">
          Agent Hints
        </p>
        <p className="text-[12px] text-neutral-500 leading-relaxed">
          Socratic — guides, never gives the answer. Hints unlock progressively.
        </p>
      </div>

      {/* Hints list */}
      <div className="flex flex-col divide-y divide-neutral-900 flex-1 overflow-y-auto">
        {hints.map((hint) => (
          <div key={hint.id} className="px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: hint.revealed ? "#4ade80" : "#444" }}
              />
              <span className="text-[11px] font-bold tracking-widest text-neutral-400">
                HINT {String(hint.id).padStart(2, "0")} ·{" "}
                <span style={{ color: hint.revealed ? "#4ade80" : "#555" }}>
                  {hint.revealed ? "REVEALED" : "LOCKED"}
                </span>
              </span>
            </div>

            {hint.revealed ? (
              <p className="text-[13px] text-neutral-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: hint.text }} />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="h-2.5 rounded-sm bg-neutral-800 w-full" />
                <div className="h-2.5 rounded-sm bg-neutral-800 w-4/5" />
                <div className="h-2.5 rounded-sm bg-neutral-800 w-3/5" />
              </div>
            )}

            {/* Cost + reveal */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono"
                style={{ color: hint.revealed ? "#555" : "#e5e5e5" }}>
                cost:{" "}
                <span style={{ color: hint.cost === 0 ? "#4ade80" : hint.revealed ? "#555" : "#f87171" }}>
                  {hint.cost === 0 ? "0 xp" : `-${hint.cost} xp`}
                </span>
                {" · "}
                <span className="text-neutral-600">
                  {hint.revealed ? "unlocked free" : hint.cost === 0 ? "free" : "still passable"}
                </span>
              </span>
              {!hint.revealed && (
                <button
                  onClick={() => revealHint(hint.id)}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded border border-neutral-700 text-neutral-300 hover:border-purple-500 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <Eye size={11} />
                  reveal {hint.cost > 0 ? `– ${hint.cost} xp` : "free"}
                </button>
              )}
              {hint.revealed && (
                <span className="flex items-center gap-1 text-[11px] text-neutral-700">
                  <Lock size={10} /> revealed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function ChallengeArena() {
  const { id: _id } = useParams();
  const navigate = useNavigate();

  // In production: fetch challenge by id. For now use mock.
  const challenge = MOCK_CHALLENGE;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gray-950 text-[#e5e5e5]" style={{ fontFamily: "inherit" }}>
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 py-3 border-b border-neutral-800 shrink-0">
        <Breadcrumb
          items={[...challenge.breadcrumb, challenge.id]}
          onBack={() => navigate("/coding-challenges")}
        />
      </header>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — problem description */}
        <div className="w-[340px] shrink-0 border-r border-neutral-800 overflow-hidden flex flex-col">
          <ProblemPanel challenge={challenge} />
        </div>

        {/* Center — code editor + test runner */}
        <div className="flex-1 overflow-hidden flex flex-col border-r border-neutral-800">
          <CodePanel files={challenge.files} />
        </div>

        {/* Right — AI hints */}
        <div className="w-[300px] shrink-0 overflow-hidden flex flex-col">
          <HintsPanel hints={challenge.hints} />
        </div>

      </div>
    </div>
  );
}
