import { Download } from "lucide-react";
import { exportConversation } from "../lib/exportConversation";

/**
 * Minimal chat header: the conversation title, and one working action.
 *
 * What was removed and why:
 * - "DevsWebs Agent" — a constant. The app chrome already says where you are;
 *   the useful thing here is WHICH conversation you're in.
 * - The session-id badge (`slice(-6)`) — debug output, not user information.
 * - "socratic mode · 5 tools" — it was also factually wrong (there are 7 tools),
 *   and a header is the worst place to keep a hardcoded count in sync.
 * - The streaming indicator — MessageList already renders a live cursor while
 *   the answer streams, so this was a second indicator for the same state.
 */
export default function ChatTopBar({ title, messages = [] }) {
  // Nothing to label and nothing to export on a fresh chat, so the bar isn't
  // rendered at all — same as Claude, where the header stays empty until a
  // conversation exists. No placeholder title, no disabled button.
  if (!title) return null;

  const canExport = messages.some((m) => m.role === "user" || m.role === "assistant");

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 shrink-0 border-b border-white/5">
      <h1
        className="text-[15px] tracking-tight truncate min-w-0"
        style={{ color: "#e5e5e5" }}
        title={title}
      >
        {title}
      </h1>

      <button
        onClick={() => exportConversation(title, messages)}
        disabled={!canExport}
        aria-label="Export conversation as Markdown"
        title={canExport ? "Export as Markdown" : "Nothing to export yet"}
        className={`flex items-center gap-1.5 text-[13px] px-2.5 py-1.5 rounded-lg shrink-0 transition-colors ${
          canExport
            ? "text-white/50 hover:text-white hover:bg-white/8 cursor-pointer"
            : "text-white/20 cursor-not-allowed"
        }`}
      >
        <Download size={14} strokeWidth={1.5} />
        Export
      </button>
    </div>
  );
}
