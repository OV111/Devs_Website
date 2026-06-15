export default function ChatTopBar({ activeSessionId, isStreaming }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b border-white/5">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold tracking-tight" style={{ color: "#e5e5e5" }}>
            DevsFlow Agent
          </span>
          {activeSessionId && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/5 bg-white/3"
              style={{ color: "#444" }}
            >
              {activeSessionId.slice(-6)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
          <span className="text-[11px]" style={{ color: "#555" }}>
            socratic mode · 5 tools
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isStreaming && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-purple-600" />
            <span className="text-[11px] text-purple-600">STREAMING</span>
          </div>
        )}
        <button
          aria-label="Export conversation"
          className="text-[12px] px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 border border-white/5"
          style={{ color: "#555" }}
        >
          export
        </button>
      </div>
    </div>
  );
}
