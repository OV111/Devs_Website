import { useState } from "react";
import { motion as Motion } from "framer-motion";
import GradientText from "@/components/effects/GradientText";

const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

const ACCENT = "#9333ea";

// ── Mock data ──────────────────────────────────────────────────

const MOCK_STATS = [
  {
    value: "47",
    unit: "solved",
    label: "TOTAL PROBLEMS",
    sub: "↑ 6 this week",
  },
  { value: "73", unit: "%", label: "ACCURACY", sub: "↑ 4 pts" },
  { value: "12", unit: "d", label: "SOLVE STREAK", sub: "longest yet" },
  { value: "#142", unit: "", label: "GLOBAL RANK", sub: "↑ 23 places" },
];

const DAILY = {
  id: "DC_142",
  date: "14 may",
  title: "Build a sliding-window rate limiter with Redis",
  desc: "Implement an Express middleware that enforces a 100 req/min sliding window per API key, backed by Redis. Pass all 6 test cases including the edge cases at window boundaries.",
  tags: ["BACKEND", "CACHING", "MIDDLEWARE", "MEDIUM"],
  countdown: "09:42:18",
};

const CHALLENGES = [
  {
    id: "P_03_09",
    type: "CODE",
    title: "Implement an async error wrapper for Express",
    desc: "Build a helper that wraps async route handlers so rejections reach Express's error middleware. Five tests including arity preservation.",
    tags: ["async", "errors", "middleware"],
    time: "24m",
    solves: "612",
    xp: 45,
    hot: true,
    done: false,
  },
  {
    id: "P_03_07",
    type: "CODE",
    title: "Token-bucket rate-limit middleware",
    desc: "Implement an in-memory token bucket that allows N requests per minute per IP. Handle the refill arithmetic correctly under burst load.",
    tags: ["middleware", "concurrency"],
    time: "26m",
    solves: "2.4k",
    xp: 40,
    hot: false,
    done: true,
  },
  {
    id: "P_03_08",
    type: "DEBUG",
    title: "Why is my middleware order breaking auth?",
    desc: "A broken Express app crashes on protected routes. Find the off-by-one bug in middleware ordering. Subtle — don't trust the comments.",
    tags: ["middleware", "debug"],
    time: "33m",
    solves: "1.1k",
    xp: 50,
    hot: false,
    done: false,
  },
  {
    id: "P_03_10",
    type: "DESIGN",
    title: "Design a versioned REST API for a blog",
    desc: "Write the resource model, URL scheme, and versioning strategy. AI-graded for clarity, consistency, and how you handle breaking changes.",
    tags: ["rest", "design", "ai-graded"],
    time: "45m",
    solves: "612",
    xp: 60,
    hot: false,
    done: false,
  },
  {
    id: "P_03_11",
    type: "BUILD",
    title: "Streaming file-upload endpoint",
    desc: "Build a real upload endpoint that streams large files to disk without buffering them in memory. Handle disconnects and partial writes.",
    tags: ["streams", "upload"],
    time: "30m",
    solves: "487",
    xp: 55,
    hot: false,
    done: false,
  },
  {
    id: "P_03_12",
    type: "CODE",
    title: "LRU cache for Express responses",
    desc: "Implement a least-recently-used cache as middleware. Bound memory, expire on TTL, key on URL + query, invalidate cleanly.",
    tags: ["caching", "perf", "data-structures"],
    time: "29m",
    solves: "891",
    xp: 45,
    hot: false,
    done: false,
  },
  {
    id: "P_03_05",
    type: "DEBUG",
    title: "Fix a memory leak in a long-running service",
    desc: "A node service slowly bloats from 80MB to 2GB over 6 hours. You get heap snapshots. Find the closure-trap leak.",
    tags: ["memory", "debug"],
    time: "38m",
    solves: "334",
    xp: 65,
    hot: false,
    done: false,
  },
  {
    id: "P_03_03",
    type: "CODE",
    title: "Parse multipart form-data without a library",
    desc: "Read the boundary, parse headers and binary content. No busboy, no multipart.",
    tags: ["streams", "parsing"],
    time: "42m",
    solves: "201",
    xp: 70,
    hot: false,
    done: false,
  },
];

const TOPICS = [
  { label: "all topics", count: 12 },
  { label: "middleware", count: 4 },
  { label: "routing", count: 2 },
  { label: "async / errors", count: 3 },
  { label: "streams", count: 2 },
  { label: "caching", count: 1 },
];

const LEADERBOARD = [
  { rank: 1, initial: "D", name: "@daniel.k", score: "2,340", you: false },
  { rank: 2, initial: "M", name: "@maria.s", score: "2,180", you: false },
  { rank: 3, initial: "R", name: "@ravi.p", score: "1,920", you: false },
  { rank: 4, initial: "N", name: "@nina.c", score: "1,640", you: false },
  { rank: 23, initial: "V", name: "you", score: "420", you: true },
];

const TYPE_STYLE = {
  CODE: { border: "#7c3aed", color: "#a78bfa" },
  DEBUG: { border: "#b45309", color: "#fb923c" },
  BUILD: { border: "#166534", color: "#4ade80" },
  DESIGN: { border: "#1e40af", color: "#60a5fa" },
};

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] px-2.5 py-0.5 rounded-sm transition-all cursor-pointer"
      style={{
        backgroundColor: active ? ACCENT : "transparent",
        border: `1px solid ${active ? ACCENT : "#2a2a2a"}`,
        color: active ? "#fff" : "#666",
      }}
    >
      {label}
    </button>
  );
}

function FilterGroup({ label, options, active, onSelect }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: "#333" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-1">
        {options.map((opt) => (
          <Pill
            key={opt}
            label={opt}
            active={active === opt}
            onClick={() => onSelect(opt)}
          />
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ c }) {
  const ts = TYPE_STYLE[c.type] || TYPE_STYLE.CODE;
  const diffLevel = c.xp >= 60 ? 3 : c.xp >= 50 ? 2 : 1;
  return (
    <div
      className="relative overflow-hidden rounded-sm p-4 flex flex-col gap-2.5"
      style={{ border: "1px solid #1a1a1a", backgroundColor: "#0d0d0d" }}
    >
      {c.hot && (
        <div
          className="absolute top-4 right-[-28px] rotate-45 text-[8px] font-bold px-10 py-0.5 tracking-widest z-10"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
        >
          HOT SPOT MATCH
        </div>
      )}
      {c.done && (
        <div
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
        >
          ✓
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono" style={{ color: "#333" }}>
          {c.id}
        </span>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5"
          style={{ border: `1px solid ${ts.border}`, color: ts.color }}
        >
          {c.type}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-[14px] font-semibold leading-snug"
        style={{ color: "#e5e5e5" }}
      >
        {c.title}
      </p>

      {/* Description */}
      <p className="text-[12px] leading-relaxed" style={{ color: "#555" }}>
        {c.desc}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {c.tags.map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5"
            style={{ border: "1px solid #1f1f1f", color: "#444" }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-1 pt-2"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div
          className="flex items-center gap-3 text-[11px]"
          style={{ color: "#444" }}
        >
          <span>{c.time}</span>
          <span>{c.solves} solves</span>
          {/* difficulty bars */}
          <span className="flex items-end gap-0.5">
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className="w-[3px] rounded-sm"
                style={{
                  height: `${level * 4}px`,
                  backgroundColor: level <= diffLevel ? "#f87171" : "#1f1f1f",
                  display: "inline-block",
                }}
              />
            ))}
          </span>
        </div>
        <span
          className="text-[11px] font-semibold px-2 py-0.5"
          style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
        >
          +{c.xp} xp
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function CodingChallenges() {
  const [activePath, setActivePath] = useState("backend");
  const [activeLayer, setActiveLayer] = useState("3");
  const [activeType, setActiveType] = useState("all");
  const [activeLevel, setActiveLevel] = useState("med");
  const [recommended, setRecommended] = useState(true);
  const [activeTopic, setActiveTopic] = useState("all topics");

  return (
    <div className="min-h-screen bg-gray-950 text-[#e5e5e5] relative">
      <div
        className="pointer-events-none fixed top-20 left-0 right-0 h-[400px] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* ── HERO ── */}
      <div className="px-6 sm:px-10 lg:px-14 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          {/* Left: badge + heading + stats */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <Motion.div
              {...FadeUp(0)}
              className="inline-flex items-center gap-2 text-[11px] mb-6 p-2 px-3 rounded-2xl"
              style={{
                border: "1px solid #2d1b4e",
                backgroundColor: "#0f0b1a",
                color: "#888",
              }}
            >
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                v0.1
              </span>
              <span>312 problems · path-specific · agent-guided</span>
            </Motion.div>

            {/* Heading */}
            <Motion.div {...FadeUp(0.08)} className="mb-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
                Coding
                <br />
                <span style={{ color: ACCENT }}>challenges</span> that
                <br />
                actually teach.
              </h1>
            </Motion.div>

            <Motion.p
              {...FadeUp(0.16)}
              className="text-[14px] max-w-lg mb-8"
              style={{ color: "#666" }}
            >
              Not random DSA grinding. Every challenge is tied to your current
              roadmap layer. Solve them to raise your exam readiness, and the AI
              agent steps in with progressive hints — never the answer.
            </Motion.p>

            {/* Stats row */}
            <Motion.div
              {...FadeUp(0.24)}
              style={{ border: "1px solid #1a1a1a" }}
              className="grid grid-cols-2 sm:grid-cols-4"
            >
              {MOCK_STATS.map(({ value, unit, label, sub }, i) => (
                <div
                  key={label}
                  className="px-4 py-4 flex flex-col gap-1"
                  style={{ borderRight: i < 3 ? "1px solid #1a1a1a" : "none" }}
                >
                  <p
                    className="text-2xl font-bold leading-none"
                    style={{ color: "#e5e5e5" }}
                  >
                    {value}
                    {unit && (
                      <span
                        className="text-base ml-0.5"
                        style={{ color: ACCENT }}
                      >
                        {unit}
                      </span>
                    )}
                  </p>
                  <p
                    className="text-[9px] font-bold tracking-widest uppercase mt-1"
                    style={{ color: "#444" }}
                  >
                    {label}
                  </p>
                  <p className="text-[11px]" style={{ color: "#4ade80" }}>
                    {sub}
                  </p>
                </div>
              ))}
            </Motion.div>
          </div>

          {/* Right: daily challenge card */}
          <Motion.div
            {...FadeUp(0.1)}
            className="w-full lg:w-[340px] shrink-0 rounded-sm p-5 flex flex-col gap-4"
            style={{ backgroundColor: ACCENT, border: `1px solid ${ACCENT}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                  Daily Challenge
                </span>
              </div>
              <span
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {DAILY.id} · {DAILY.date}
              </span>
            </div>

            <p className="text-[16px] font-bold text-white leading-snug">
              {DAILY.title}
            </p>

            <p
              className="text-[12px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              {DAILY.desc}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {DAILY.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-1">
              <button
                className="flex-1 py-2 text-[13px] font-bold rounded-sm transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#fff", color: ACCENT }}
              >
                $ start solving →
              </button>
              <div className="text-right shrink-0">
                <p className="text-[15px] font-bold font-mono text-white">
                  {DAILY.countdown}
                </p>
                <p
                  className="text-[9px] tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  // resets in
                </p>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div
        className="px-6 sm:px-10 lg:px-14 py-3 flex flex-wrap items-center gap-3 lg:gap-4"
        style={{
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          backgroundColor: "#090909",
        }}
      >
        <FilterGroup
          label="PATH"
          options={["backend", "frontend", "ai/ml", "devops", "all"]}
          active={activePath}
          onSelect={setActivePath}
        />
        <div
          className="hidden sm:block w-px h-4"
          style={{ backgroundColor: "#1f1f1f" }}
        />
        <FilterGroup
          label="LAYER"
          options={["1", "2", "3", "4+"]}
          active={activeLayer}
          onSelect={setActiveLayer}
        />
        <div
          className="hidden sm:block w-px h-4"
          style={{ backgroundColor: "#1f1f1f" }}
        />
        <FilterGroup
          label="TYPE"
          options={["all", "code", "debug", "build", "design"]}
          active={activeType}
          onSelect={setActiveType}
        />
        <div
          className="hidden sm:block w-px h-4"
          style={{ backgroundColor: "#1f1f1f" }}
        />
        <FilterGroup
          label="LEVEL"
          options={["easy", "med", "hard"]}
          active={activeLevel}
          onSelect={setActiveLevel}
        />
        <div
          className="hidden sm:block w-px h-4"
          style={{ backgroundColor: "#1f1f1f" }}
        />
        <button
          onClick={() => setRecommended(!recommended)}
          className="text-[11px] px-3 py-0.5 rounded-sm transition-all cursor-pointer"
          style={{
            border: `1px solid ${recommended ? ACCENT : "#2a2a2a"}`,
            color: recommended ? "#fff" : "#666",
            backgroundColor: recommended
              ? "rgba(147,51,234,0.15)"
              : "transparent",
          }}
        >
          + recommended
        </button>

        {/* Search */}
        <div
          className="ml-auto flex items-center gap-2 px-3 py-1 rounded-sm"
          style={{ border: "1px solid #1f1f1f", backgroundColor: "#111" }}
        >
          <svg
            className="w-3 h-3 shrink-0"
            fill="none"
            stroke="#555"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-[11px]" style={{ color: "#444" }}>
            search 312 challenges...
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex gap-6 px-6 sm:px-10 lg:px-14 py-6">
        {/* Challenge grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono" style={{ color: "#444" }}>
              // 12 CHALLENGES · LAYER 3 · SORTED BY RECOMMENDED
            </span>
            <button
              className="text-[11px] flex items-center gap-1 cursor-pointer"
              style={{ color: "#555" }}
            >
              recommended <span>↓</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHALLENGES.map((c) => (
              <ChallengeCard key={c.id} c={c} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-52 shrink-0 hidden lg:flex flex-col gap-6">
          {/* EXAM READINESS */}
          <div>
            <p className="text-[10px] font-mono mb-3" style={{ color: "#444" }}>
              // EXAM READINESS · LAYER 3
            </p>
            <div
              className="flex flex-col items-center gap-3 py-5 px-4"
              style={{
                border: "1px solid #1a1a1a",
                backgroundColor: "#0d0d0d",
              }}
            >
              {/* Circular progress */}
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="2.5"
                    strokeDasharray="68 32"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#e5e5e5" }}
                  >
                    68
                  </span>
                  <span className="text-[9px]" style={{ color: "#444" }}>
                    22 TO GO
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-center" style={{ color: "#555" }}>
                Solve 3 more on async errors and you're exam-ready.
              </p>
              <button
                className="w-full py-2 text-[12px] font-bold transition-opacity hover:opacity-80 cursor-pointer"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                $ take_exam
              </button>
            </div>
          </div>

          {/* TOPICS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono" style={{ color: "#444" }}>
                // TOPICS
              </p>
              <span className="text-[10px]" style={{ color: "#2a2a2a" }}>
                layer 3
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {TOPICS.map(({ label, count }) => (
                <button
                  key={label}
                  onClick={() => setActiveTopic(label)}
                  className="flex items-center justify-between px-3 py-1.5 text-[12px] transition-all cursor-pointer rounded-sm"
                  style={{
                    backgroundColor:
                      activeTopic === label ? "#1a0f2e" : "transparent",
                    color: activeTopic === label ? "#fff" : "#555",
                    border:
                      activeTopic === label
                        ? "1px solid #2d1b4e"
                        : "1px solid transparent",
                  }}
                >
                  <span>{label}</span>
                  <span
                    style={{ color: activeTopic === label ? ACCENT : "#333" }}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* LEADERBOARD */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono" style={{ color: "#444" }}>
                // LEADERBOARD
              </p>
              <span className="text-[10px]" style={{ color: "#2a2a2a" }}>
                layer 3 · 7d
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {LEADERBOARD.map(({ rank, initial, name, score, you }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm"
                  style={{
                    backgroundColor: you ? "#0f0b1a" : "transparent",
                    border: you ? "1px solid #2d1b4e" : "1px solid transparent",
                  }}
                >
                  <span
                    className="text-[10px] w-5 shrink-0 tabular-nums text-right"
                    style={{ color: rank <= 3 ? ACCENT : "#333" }}
                  >
                    {rank <= 3 ? `0${rank}` : `#${rank}`}
                  </span>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      backgroundColor: you ? ACCENT : "#1a1a1a",
                      color: you ? "#fff" : "#666",
                    }}
                  >
                    {initial}
                  </div>
                  <span
                    className="flex-1 text-[11px] truncate"
                    style={{ color: you ? "#e5e5e5" : "#555" }}
                  >
                    {name}
                  </span>
                  <span
                    className="text-[11px] font-semibold tabular-nums shrink-0"
                    style={{ color: you ? ACCENT : "#444" }}
                  >
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
