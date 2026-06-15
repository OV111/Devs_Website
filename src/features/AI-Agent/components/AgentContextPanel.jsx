import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] font-bold tracking-widest shrink-0 uppercase text-purple-600">
        // {title}
      </span>
      <div className="flex-1 h-px rounded-full bg-purple-600/20" />
    </div>
  );
}

export default function AgentContextPanel({ topicsMastered, weakSpots, tools }) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <aside className="w-10 shrink-0 hidden lg:flex flex-col items-center border-l border-white/5">
        <div className="flex-1" />
        <button
          onClick={() => setOpen(true)}
          className="mb-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: "#444" }}
          title="Open context"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-56 shrink-0 px-4 py-5 overflow-y-auto hidden lg:flex flex-col space-y-5 border-l border-white/5" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-widest mb-0.5" style={{ color: "#e5e5e5" }}>
            // AGENT CONTEXT
          </p>
          <p className="text-[11px]" style={{ color: "#444" }}>
            live — what the agent knows about you right now.
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          style={{ color: "#555" }}
          title="Collapse"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

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
              <span className="font-semibold text-purple-600">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title={`topics mastered ${topicsMastered.length}`} />
        <div className="flex flex-wrap gap-1">
          {topicsMastered.map((t) => (
            <span
              key={t}
              className="text-[9px] font-bold px-1.5 py-0.5"
              style={{ border: "1px solid #2d1b4e", color: "#9333ea", backgroundColor: "#0f0b1a" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title={`weak spots ${weakSpots.length}`} />
        <div className="flex flex-wrap gap-1 mb-2">
          {weakSpots.map((w) => (
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

      <div>
        <SectionHeader title="tools available" />
        <div className="space-y-1.5">
          {tools.map((tool) => (
            <div key={tool.name} className="flex items-center justify-between text-[11px]">
              <span className="font-mono" style={{ color: tool.used ? "#ccc" : "#444" }}>
                {tool.name}
              </span>
              {tool.used && (
                <span className="text-[9px]" style={{ color: "#444" }}>used 1×</span>
              )}
            </div>
          ))}
        </div>
      </div>

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
  );
}
