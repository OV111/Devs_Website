import { useRef, useCallback } from "react";
import useAiAgentStore from "@/stores/useAiAgentStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export default function useAgentStream() {
  const abortRef = useRef(null);

  const sendMessage = useCallback(async ({ sessionId, content, token }) => {
    // Cancel any in-flight stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const {
      appendMessage: append,
      setStreaming,
      appendStreamChunk,
      clearStream,
      setError,
    } = useAiAgentStore.getState();

    // Optimistically add user message
    append({ role: "user", content });

    setStreaming(true);
    clearStream();
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/ai-agent/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, message: content }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setError({ type: "rate_limit", resetAt: data.resetAt ?? null });
        setStreaming(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep incomplete last line in buffer
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === "[DONE]") continue;

          let event;
          try {
            event = JSON.parse(raw);
          } catch {
            continue;
          }

          if (event.type === "delta") {
            appendStreamChunk(event.content);
            assistantContent += event.content;
          } else if (event.type === "tool_call") {
            // Tool call events are surfaced for F7; store updated separately
            useAiAgentStore.getState().appendMessage({
              role: "tool_call",
              id: event.id,
              name: event.name,
              input: event.input,
              status: "running",
            });
          } else if (event.type === "tool_result") {
            // Find matching tool_call and mark done
            const { messages, setMessages } = useAiAgentStore.getState();
            const updated = messages.map((m) =>
              m.role === "tool_call" && m.id === event.id
                ? { ...m, status: "done", result: event.result }
                : m,
            );
            setMessages(updated);
          } else if (event.type === "done") {
            break;
          } else if (event.type === "error") {
            throw new Error(event.message ?? "stream error");
          }
        }
      }

      // Commit completed assistant message
      if (assistantContent) {
        useAiAgentStore.getState().appendMessage({
          role: "assistant",
          content: assistantContent,
        });
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      useAiAgentStore
        .getState()
        .setError({ type: "network", message: err.message });
    } finally {
      useAiAgentStore.getState().setStreaming(false);
      useAiAgentStore.getState().clearStream();
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, cancel };
}
