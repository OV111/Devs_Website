import { useRef, useEffect } from "react";
import { FileText } from "lucide-react";
import ToolUseBlock from "./ToolUseBlock";
import MarkdownMessage from "./MarkdownMessage";
import MessageSkeleton from "./MessageSkeleton";
import MessageActions from "./MessageActions";
import ContextCard from "./ContextCard";

// How close to the bottom (px) still counts as "following along". If the user
// has scrolled further up than this, we leave their scroll position alone.
const STICK_THRESHOLD = 120;

function AttachmentChips({ attachments, align = "left" }) {
  if (!attachments?.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 mb-2 ${align === "right" ? "justify-end" : ""}`}>
      {attachments.map((a) => (
        <span
          key={a.name}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[12px] text-white/70 max-w-[220px]"
        >
          <FileText size={12} className="shrink-0 text-purple-400" />
          <span className="truncate">{a.name}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * The user's own turn: a right-aligned bubble.
 *
 * Rendered as plain text with `whitespace-pre-wrap`, never as Markdown — the
 * user's literal input should never be reinterpreted as formatting.
 */
function UserMessage({ msg }) {
  return (
    <div className="flex flex-col items-end">
      <AttachmentChips attachments={msg.attachments} align="right" />
      <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 bg-white/8">
        <p className="text-[14px] whitespace-pre-wrap break-words text-white">{msg.content}</p>
      </div>
    </div>
  );
}

/**
 * The agent's turn: full width on the left, no bubble.
 *
 * Answers contain code blocks, tables and lists — boxing them in a bubble would
 * fight the Markdown rendering, which is why no serious chat product does it.
 */
function AssistantMessage({ content }) {
  return (
    <div className="group">
      <MarkdownMessage content={content} />
      <MessageActions content={content} />
    </div>
  );
}

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
      className="flex-1 overflow-y-auto px-4 sm:px-8 py-6"
      style={{ scrollbarWidth: "none" }}
    >
      {/* A centred, width-capped column. Full-bleed text on a wide monitor is
          unreadable — this is the same reason every chat product caps it. */}
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {isLoadingSession && <MessageSkeleton />}

        {/* Only claim the session is empty once we've actually finished loading it. */}
        {!isLoadingSession && messages.length === 0 && !isStreaming && (
          <p className="text-[13px] text-center mt-16" style={{ color: "#333" }}>
            start a conversation
          </p>
        )}

        {messages.map((msg, i) => {
          if (msg.role === "context") {
            return msg.loading ? (
              <div key={i} className="max-w-2xl rounded-xl border border-white/10 bg-white/3 p-4">
                <div className="h-3 w-24 rounded bg-white/8 animate-pulse" />
              </div>
            ) : (
              <ContextCard key={i} data={msg.data} error={msg.error} />
            );
          }

          if (msg.role === "tool_call") {
            return (
              <div key={msg.id ?? i}>
                <ToolUseBlock name={msg.name} status={msg.status} />
              </div>
            );
          }

          if (msg.role === "user") return <UserMessage key={i} msg={msg} />;

          return <AssistantMessage key={i} content={msg.content} />;
        })}

        {isStreaming && (
          <div>
            {streamingContent ? (
              <>
                <MarkdownMessage content={streamingContent} />
                <span className="animate-pulse text-[14px] text-white">▊</span>
              </>
            ) : (
              // Before the first token arrives, show a thinking indicator rather
              // than a bare cursor, so the wait reads as progress.
              <div className="flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-purple-500/70 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
