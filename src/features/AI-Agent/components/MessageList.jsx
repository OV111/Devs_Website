import { useRef, useEffect } from "react";
import { FileText } from "lucide-react";
import ToolUseBlock from "./ToolUseBlock";
import MarkdownMessage from "./MarkdownMessage";
import MessageSkeleton from "./MessageSkeleton";
import ContextCard from "./ContextCard";

// How close to the bottom (px) still counts as "following along". If the user
// has scrolled further up than this, we leave their scroll position alone.
const STICK_THRESHOLD = 120;

export default function MessageList({
  messages,
  isStreaming,
  streamingContent,
  isLoadingSession = false,
}) {
  const containerRef = useRef(null);
  const prevLengthRef = useRef(messages.length);

  // Scroll the CONTAINER, never scrollIntoView(). scrollIntoView walks up and
  // scrolls every scrollable ancestor — including the document — which yanked
  // the whole page down when arriving from the landing page with a first message.
  const scrollToBottom = (smooth) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < STICK_THRESHOLD;
  };

  // Jump to the bottom on mount without animation, so a session opened with
  // existing history starts at the newest message instead of scrolling through it.
  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    if (messages.length <= prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      return;
    }
    prevLengthRef.current = messages.length;
    scrollToBottom(true);
  }, [messages.length]);

  // Follow the answer as it streams in, but only while the user is already at
  // the bottom — otherwise we'd fight them every time they scroll up to re-read.
  useEffect(() => {
    if (!isStreaming || !streamingContent) return;
    if (isNearBottom()) scrollToBottom(false);
  }, [streamingContent, isStreaming]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
      style={{ scrollbarWidth: "none" }}
    >
      {isLoadingSession && <MessageSkeleton />}

      {/* Only claim the session is empty once we've actually finished loading it. */}
      {!isLoadingSession && messages.length === 0 && !isStreaming && (
        <p className="text-[13px] text-center mt-16" style={{ color: "#333" }}>
          start a conversation
        </p>
      )}

      {messages.map((msg, i) => {
        if (msg.role === "context") {
          return (
            <div key={i}>
              {msg.loading ? (
                <div className="max-w-2xl rounded-xl border border-white/10 bg-white/3 p-4">
                  <div className="h-3 w-24 rounded bg-white/8 animate-pulse" />
                </div>
              ) : (
                <ContextCard data={msg.data} error={msg.error} />
              )}
            </div>
          );
        }

        if (msg.role === "tool_call") {
          return (
            <div key={msg.id ?? i}>
              <ToolUseBlock name={msg.name} status={msg.status} />
            </div>
          );
        }

        return (
          <div key={i}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: msg.role === "user" ? "#555" : "#9333ea" }}
              />
              <span
                className="text-[10px] font-bold tracking-widest"
                style={{ color: msg.role === "user" ? "#555" : "#9333ea" }}
              >
                {msg.role === "user" ? "YOU" : "AGENT"}
              </span>
            </div>
            {msg.attachments?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {msg.attachments.map((a) => (
                  <span
                    key={a.name}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[12px] text-white/70 max-w-[220px]"
                  >
                    <FileText size={12} className="shrink-0 text-purple-400" />
                    <span className="truncate">{a.name}</span>
                  </span>
                ))}
              </div>
            )}
            {/* Agent output is markdown; the user's own text is rendered as
                plain text so their literal input is never reinterpreted. */}
            {msg.role === "assistant" ? (
              <MarkdownMessage content={msg.content} />
            ) : (
              <p className="text-[14px] max-w-2xl whitespace-pre-wrap" style={{ color: "#ccc" }}>
                {msg.content}
              </p>
            )}
          </div>
        );
      })}

      {isStreaming && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#9333ea" }} />
            <span className="text-[10px] font-bold tracking-widest" style={{ color: "#9333ea" }}>
              AGENT
            </span>
          </div>
          {streamingContent ? (
            <>
              <MarkdownMessage content={streamingContent} />
              <span className="animate-pulse text-[14px]" style={{ color: "#ccc" }}>▊</span>
            </>
          ) : (
            <p className="text-[14px]" style={{ color: "#ccc" }}>
              <span className="animate-pulse">▊</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
