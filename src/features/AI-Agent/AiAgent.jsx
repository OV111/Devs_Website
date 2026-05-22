import React, { useState } from "react";

const ACCENT = "#9333ea";

const SESSIONS = {
  TODAY: [
    { id: 1, title: "async error handling in express", time: "12:04", msgs: 23, active: true },
    { id: 2, title: "why my middleware order broke auth", time: "09:32", msgs: 8 },
  ],
  YESTERDAY: [
    { id: 3, title: "walk me through the event loop", time: "18:14", msgs: 14 },
    { id: 4, title: "layer 3 exam — explain my fails", time: "17:01", msgs: 31 },
  ],
  "THIS WEEK": [
    { id: 5, title: "REST API design for a blog", time: "TUE", msgs: 19 },
    { id: 6, title: "help me pick a problem to solve", time: "MON", msgs: 6 },
    { id: 7, title: "why does node use libuv?", time: "MON", msgs: 11 },
  ],
  EARLIER: [
    { id: 8, title: "layer 2 exam prep", time: "8 APR", msgs: 20 },
    { id: 9, title: "callbacks → promises → async", time: "5 APR", msgs: 22 },
  ],
};

const TOPICS_MASTERED = ["EVENT_LOOP", "HTTP_BASICS", "MODULES", "NPM", "ROUTING", "REST", "CORS"];
const WEAK_SPOTS = ["ASYNC_ERRORS", "STREAMS"];
const TOOLS = [
  { name: "get_user_progress", used: true },
  { name: "get_layer_content", used: false },
  { name: "search_platform_posts", used: true },
  { name: "get_exam_history", used: false },
  { name: "log_weak_spot", used: false },
];

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] font-bold tracking-widest shrink-0 uppercase" style={{ color: ACCENT }}>
        // {title}
      </span>
      <div className="flex-1 h-px rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.2 }} />
    </div>
  );
}

function SessionItem({ session, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-sm transition-colors cursor-pointer"
      style={{
        backgroundColor: session.active ? "#1a0f2e" : "transparent",
        borderLeft: session.active ? `2px solid ${ACCENT}` : "2px solid transparent",
      }}
    >
      <p
        className="text-[13px] truncate"
        style={{ color: session.active ? "#e5e5e5" : "#666" }}
      >
        {session.title}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: "#444" }}>
        {session.time} · {session.msgs} MSGS
      </p>
    </button>
  );
}

function ToolUseBlock({ fn, args, result }) {
  return (
    <div className="rounded-sm overflow-hidden text-[12px] font-mono mb-2" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f" }}>
      <div className="px-3 py-2" style={{ color: "#9333ea" }}>
        {fn}
      </div>
      <div className="px-3 pb-2" style={{ color: "#555" }}>
        {args}
      </div>
      {result && (
        <div className="px-3 py-1.5 border-t" style={{ borderColor: "#1f1f1f", color: "#666" }}>
          {result}
        </div>
      )}
    </div>
  );
}

function SocraticBox({ text }) {
  return (
    <div
      className="px-4 py-3 my-3 rounded-sm text-sm"
      style={{ borderLeft: `3px solid ${ACCENT}`, backgroundColor: "#0f0b1a" }}
    >
      <p className="text-[10px] font-bold tracking-widest mb-1.5" style={{ color: ACCENT }}>
        SOCRATIC PROMPT
      </p>
      <p style={{ color: "#ccc" }}>{text}</p>
    </div>
  );
}

function InlineCode({ children }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded text-[12px] font-mono"
      style={{ backgroundColor: "#1a1a1a", color: "#a78bfa" }}
    >
      {children}
    </code>
  );
}

export default function AiAgent() {
  const [activeSession, setActiveSession] = useState(1);

  return (
    <div className="flex bg-gray-950 text-[#e5e5e5]" style={{ height: "calc(100vh - 44px)" }}>

      {/* ── LEFT SIDEBAR: Sessions ── */}
      <aside
        className="w-56 shrink-0 flex-col hidden md:flex"
        style={{ borderRight: "1px solid #1a1a1a" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <span className="text-[13px] font-semibold" style={{ color: "#e5e5e5" }}>sessions</span>
          <button
            className="text-[11px] font-bold px-2.5 py-1 rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: ACCENT, color: "#fff" }}
          >
            + new
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <input
            type="text"
            placeholder="search sessions..."
            className="w-full text-[12px] bg-transparent outline-none placeholder:text-[#333]"
            style={{ color: "#888" }}
          />
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {Object.entries(SESSIONS).map(([group, sessions]) => (
            <div key={group}>
              <p className="text-[10px] font-bold tracking-widest px-1 mb-1.5" style={{ color: "#333" }}>
                {group}
              </p>
              <div className="space-y-0.5">
                {sessions.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={{ ...s, active: s.id === activeSession }}
                    onClick={() => setActiveSession(s.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-2.5 shrink-0"
          style={{ borderBottom: "1px solid #1a1a1a" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-[11px] font-bold"
              style={{ backgroundColor: "#1a0f2e", border: `1px solid ${ACCENT}`, color: ACCENT }}
            >
              ▣
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold">your agent</span>
                <span className="text-[11px]" style={{ color: "#444" }}>· session_4f3a</span>
              </div>
              <p className="text-[10px]" style={{ color: "#444" }}>
                claude-sonnet · socratic mode · 4 tools available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[11px]" style={{ color: ACCENT }}>STREAMING</span>
            </div>
            {/* fix: aria-labels on icon-only/ambiguous buttons for screen readers */}
            <button
              aria-label="Export conversation"
              className="text-[11px] px-3 py-1 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
              style={{ border: "1px solid #2a2a2a", color: "#888" }}
            >
              export
            </button>
            <button
              aria-label="Minimize agent panel"
              className="text-[#555] hover:text-[#888] transition-colors text-lg leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
            >—</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* YOU */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#555" }} />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: "#555" }}>YOU</span>
            </div>
            <p className="text-[14px] max-w-2xl" style={{ color: "#ccc" }}>
              i keep getting tripped up on async error handling in express. when i throw inside an async route,
              my error middleware never fires. why?
            </p>
          </div>

          {/* AGENT · TOOL USE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: ACCENT }}>AGENT</span>
              <span
                className="text-[9px] font-bold tracking-widest px-1.5 py-0.5"
                style={{ color: "#555", border: "1px solid #222" }}
              >
                TOOL_USE
              </span>
            </div>
            <div className="max-w-2xl space-y-2">
              <ToolUseBlock
                fn="get_user_progress()"
                args="→ path=backend · layer=3 · weak_spots=[async_errors, streams]"
              />
              <ToolUseBlock
                fn='search_platform_posts(query="async error express", layer=3)'
                args='→ 3 results · top: "async error handling patterns" by @maria.s'
              />
            </div>
          </div>

          {/* AGENT response */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: ACCENT }}>AGENT</span>
            </div>
            <div className="max-w-2xl text-[14px] space-y-3" style={{ color: "#ccc" }}>
              <p>
                Good catch — this is one of the most common Express gotchas, and the framework's docs barely
                flag it. Before I answer directly, let me see if you've got the building block. Quick question:
              </p>
              <SocraticBox text="When an async function throws, what does it actually return from the caller's perspective?" />
              <p style={{ color: "#888" }}>
                Take a guess. If you nail it, the express behaviour will click in 30 seconds. If you blank,
                I'll walk you through it.
              </p>
            </div>
          </div>

          {/* YOU */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#555" }} />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: "#555" }}>YOU</span>
            </div>
            <p className="text-[14px]" style={{ color: "#ccc" }}>
              a promise? a rejected one i guess.
            </p>
          </div>

          {/* AGENT final */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: ACCENT }}>AGENT</span>
            </div>
            <div className="max-w-2xl text-[14px] space-y-3" style={{ color: "#ccc" }}>
              <p>
                Exactly. Now connect the dots: Express's default error pipeline only sees errors that are
                passed to <InlineCode>next(err)</InlineCode> — synchronously, or that bubble up through
                synchronous <InlineCode>throw</InlineCode>. Your <InlineCode>async</InlineCode> handler
                returns a <em>rejected promise</em>, which Express (≤ v4) never inspects. So the rejection
                vanishes into the void.
              </p>
              <p>Two fixes, in order of how much you should learn from each:</p>
              <p>
                1. <strong style={{ color: "#e5e5e5" }}>Wrap manually</strong> — call{" "}
                <InlineCode>next(err)</InlineCode> in a <InlineCode>catch</InlineCode>. Painful but
                you'll feel the mechanism.
              </p>
              <p>
                2. <strong style={{ color: "#e5e5e5" }}>Use an asyncHandler wrapper</strong> — one helper,
                applied to every route.
              </p>
              <p style={{ color: "#888" }}>
                Try the manual version first. Want me to set up a sandbox problem so you can fail-and-fix
                it live?{" "}
                <span
                  className="text-[11px] px-2 py-0.5 rounded-sm font-mono"
                  style={{ backgroundColor: "#1a0f2e", color: ACCENT, border: `1px solid #2d1b4e` }}
                >
                  ✦ P_03_09
                </span>
              </p>
            </div>
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "yes, drop me in the problem",
              "show me the asyncHandler trick",
              "how does express 5 fix this?",
            ].map((r) => (
              <button
                key={r}
                className="text-[12px] px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                style={{ border: "1px solid #2a2a2a", color: "#888", backgroundColor: "transparent" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="px-6 py-4 shrink-0" style={{ borderTop: "1px solid #1a1a1a" }}>
          <div
            className="flex items-end gap-3 px-4 py-3 rounded-sm"
            style={{ border: "1px solid #2a2a2a", backgroundColor: "#0d0d0d" }}
          >
            <textarea
              rows={1}
              placeholder="ask your agent..."
              className="flex-1 bg-transparent outline-none resize-none text-[13px] placeholder:text-[#333]"
              style={{ color: "#ccc" }}
            />
            <button
              className="shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: ACCENT, color: "#fff" }}
            >
              send
            </button>
          </div>
          <p className="text-[10px] mt-1.5 text-center" style={{ color: "#333" }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR: Agent Context ── */}
      <aside
        className="w-56 shrink-0 px-4 py-5 overflow-y-auto hidden lg:block space-y-5"
        style={{ borderLeft: "1px solid #1a1a1a" }}
      >
        <div>
          <p className="text-[11px] font-bold tracking-widest mb-0.5" style={{ color: "#e5e5e5" }}>
            // AGENT CONTEXT
          </p>
          <p className="text-[11px]" style={{ color: "#444" }}>
            live — what the agent knows about you right now.
          </p>
        </div>

        {/* YOU */}
        <div>
          <SectionHeader title="you" />
          <div className="space-y-1.5">
            {[
              { label: "active path", value: "backend_dev" },
              { label: "current layer", value: "layer_03" },
              { label: "skill level", value: "intermediate" },
              { label: "streak", value: "12 d" },
              { label: "last exam", value: "84 / 100" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-[11px]">
                <span style={{ color: "#555" }}>{label}</span>
                <span className="font-semibold" style={{ color: ACCENT }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Mastered */}
        <div>
          <SectionHeader title={`topics mastered ${TOPICS_MASTERED.length}`} />
          <div className="flex flex-wrap gap-1">
            {TOPICS_MASTERED.map((t) => (
              <span
                key={t}
                className="text-[9px] font-bold px-1.5 py-0.5"
                style={{ border: `1px solid #2d1b4e`, color: ACCENT, backgroundColor: "#0f0b1a" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Weak Spots */}
        <div>
          <SectionHeader title={`weak spots ${WEAK_SPOTS.length}`} />
          <div className="flex flex-wrap gap-1 mb-2">
            {WEAK_SPOTS.map((w) => (
              <span
                key={w}
                className="text-[9px] font-bold px-1.5 py-0.5"
                style={{ border: "1px solid #3d2a00", color: "#f59e0b", backgroundColor: "#0f0a00" }}
              >
                {w}
              </span>
            ))}
          </div>
          <p className="text-[10px]" style={{ color: "#444" }}>
            surfaced from 3 failed problems · 1 exam miss
          </p>
        </div>

        {/* Tools Available */}
        <div>
          <SectionHeader title="tools available" />
          <div className="space-y-1.5">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="flex items-center justify-between text-[11px]">
                <span
                  className="font-mono"
                  style={{ color: tool.used ? "#ccc" : "#444" }}
                >
                  {tool.name}
                </span>
                {tool.used && (
                  <span className="text-[9px]" style={{ color: "#444" }}>used 1×</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Session */}
        <div>
          <SectionHeader title="session" />
          <div className="space-y-1.5">
            {[
              { label: "turns", value: "5 / 20" },
              { label: "tokens", value: "2,184" },
              { label: "cached", value: "87%" },
              { label: "latency", value: "412 ms" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-[11px]">
                <span style={{ color: "#555" }}>{label}</span>
                <span style={{ color: "#888" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
