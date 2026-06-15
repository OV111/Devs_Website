import { useRef, useEffect } from "react";
import ToolUseBlock from "./ToolUseBlock";

export default function MessageList({ messages, isStreaming, streamingContent }) {
  const messagesEndRef = useRef(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length <= prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      return;
    }
    prevLengthRef.current = messages.length;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" style={{ scrollbarWidth: "none" }}>
      {messages.length === 0 && !isStreaming && (
        <p className="text-[13px] text-center mt-16" style={{ color: "#333" }}>
          start a conversation
        </p>
      )}

      {messages.map((msg, i) => {
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
            <p className="text-[14px] max-w-2xl whitespace-pre-wrap" style={{ color: "#ccc" }}>
              {msg.content}
            </p>
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
          <p className="text-[14px] max-w-2xl whitespace-pre-wrap" style={{ color: "#ccc" }}>
            {streamingContent}
            <span className="animate-pulse">▊</span>
          </p>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
