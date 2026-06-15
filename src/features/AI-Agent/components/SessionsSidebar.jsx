import { useState } from "react";
import { Search, SquarePen, ChevronLeft, ChevronRight } from "lucide-react";

function SessionItem({ session, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-sm transition-colors cursor-pointer"
      style={{
        backgroundColor: session.active ? "#1a0f2e" : "transparent",
        borderLeft: session.active ? "2px solid #9333ea" : "2px solid transparent",
      }}
    >
      <p className="text-[13px] truncate" style={{ color: session.active ? "#e5e5e5" : "#666" }}>
        {session.title}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: "#444" }}>
        {session.createdAt}
      </p>
    </button>
  );
}

export default function SessionsSidebar({ sessions, activeSessionId, onSelectSession, onNewSession }) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <aside className="w-10 shrink-0 hidden md:flex flex-col items-center border-r border-white/5">
        <div className="flex-1" />
        <button
          onClick={() => setOpen(true)}
          className="mb-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: "#444" }}
          title="Open sessions"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 flex-col hidden md:flex border-r border-white/5">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#444" }}>
          Sessions
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewSession}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
            style={{ color: "#555" }}
            title="New session"
          >
            <SquarePen size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
            style={{ color: "#555" }}
            title="Collapse"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-white/3">
          <Search size={13} strokeWidth={1.5} style={{ color: "#444" }} />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-[#333]"
            style={{ color: "#888" }}
          />
        </div>
      </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5" style={{ scrollbarWidth: "thin", scrollbarColor: "#3a3a3a transparent" }}>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-12 px-4 text-center">
            <span className="text-[11px]" style={{ color: "#2a2a2a" }}>No sessions yet</span>
            <span className="text-[10px]" style={{ color: "#222" }}>Start a conversation to create one</span>
          </div>
        ) : (
          sessions.map((s) => (
            <SessionItem
              key={s._id}
              session={{ ...s, active: s._id === activeSessionId }}
              onClick={() => onSelectSession(s._id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
