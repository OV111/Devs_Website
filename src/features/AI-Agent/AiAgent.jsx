import React, { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import useAiAgentStore from "@/stores/useAiAgentStore";
import useAgentStream from "@/hooks/useAgentStream";
import SessionsSidebar from "./components/SessionsSidebar";
import ChatTopBar from "./components/ChatTopBar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import AgentHero from "./components/AgentHero";
import { getAccessToken, API_BASE_URL, authHeaders } from "../../../constants/api";

export default function AiAgent() {
  // The composer draft lives here because the hero's prompt chips sit outside
  // ChatInput and need to write into it.
  const [draft, setDraft] = useState("");
  const [focusToken, setFocusToken] = useState(0);

  const {
    sessions: storeSessions,
    activeSessionId: storeActiveSessionId,
    messages: storeMessages,
    isStreaming,
    isLoadingSession,
    streamingContent,
    error,
    setActiveSession,
    setSessions,
    setError,
  } = useAiAgentStore();

  const { sendMessage } = useAgentStream();

  const sessions = storeSessions;
  const activeSessionId = storeActiveSessionId;
  const messages = storeMessages;

  // "New chat" is a state, not a page: no messages, nothing streaming, and no
  // session being loaded.
  const isEmptyChat =
    messages.length === 0 && !isStreaming && !isLoadingSession && !streamingContent;

  // null (not a placeholder) when there's no conversation yet — ChatTopBar
  // renders nothing at all in that case.
  const activeTitle = activeSessionId
    ? (sessions.find((s) => s._id === activeSessionId)?.title ?? null)
    : null;

  // React Router keeps the window scroll position across navigations, so arriving
  // from the scrolled landing page would drop you into this full-height chat view
  // already scrolled down. Same fix ChallengeArena.jsx uses.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // load sessions list on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions`, { headers: authHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        setSessions(data.sessions ?? []);
      } catch { /* non-fatal */ }
    };
    loadSessions();
  }, [setSessions]);

  const handleSelectSession = async (sessionId) => {
    // Ignore a click on the session that's already open — it would clear a
    // loaded transcript and re-fetch it for nothing.
    if (sessionId === storeActiveSessionId) return;

    const store = useAiAgentStore.getState();
    setActiveSession(sessionId);
    store.setMessages([]);
    store.setLoadingSession(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions/${sessionId}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const session = await res.json();
      useAiAgentStore.getState().setMessages(
        (session.messages ?? []).map((m) => ({ role: m.role, content: m.content }))
      );
    } catch {
      // Previously this returned silently, leaving an empty transcript that
      // was indistinguishable from a genuinely empty conversation.
      // Distinct from "network" so the banner doesn't offer a Retry that would
      // try to RE-SEND a message instead of re-loading the conversation.
      setError({ type: "session_load", message: "Couldn't load this conversation." });
    } finally {
      useAiAgentStore.getState().setLoadingSession(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ title: "New conversation" }),
      });
      if (!res.ok) return;
      const session = await res.json();
      setSessions([session, ...useAiAgentStore.getState().sessions]);
      setActiveSession(session._id);
      useAiAgentStore.getState().setMessages([]);
    } catch { /* non-fatal */ }
  };

  /**
   * Send a message, creating a session first if this is a fresh chat.
   *
   * This replaces the old landing-page handoff: previously the hero lived on a
   * separate route and had to navigate here with the message in router state,
   * where a bootstrap effect re-created it. Now "new chat" is just the state
   * where activeSessionId is null, and no navigation happens at all.
   */
  const handleSend = async (text, attachments = []) => {
    const token = getAccessToken();
    setDraft("");

    // Slash commands are handled entirely client-side — they never reach the
    // model, so they cost nothing and don't consume the daily message cap.
    if (text.trim() === "/context") {
      appendMessage({ role: "context", loading: true });
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-agent/context`, {
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        replaceLastContext({ role: "context", data });
      } catch {
        replaceLastContext({ role: "context", error: "Couldn't load context." });
      }
      return;
    }

    let sessionId = storeActiveSessionId;

    if (!sessionId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ title: text.slice(0, 60) }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const session = await res.json();
        sessionId = session._id;
        setActiveSession(sessionId);
        setSessions([session, ...useAiAgentStore.getState().sessions]);
      } catch {
        // Session creation failed — the stream route creates one server-side
        // when sessionId is null, so the message still goes through.
        sessionId = null;
      }
    }

    sendMessage({ sessionId, content: text, token, attachments });
  };

  const handleRenameSession = async (sessionId, title) => {
    // Optimistic: the rename is trivially reversible and the list should feel
    // instant. On failure we restore the previous title rather than leave a lie.
    const previous = useAiAgentStore.getState().sessions;
    setSessions(previous.map((s) => (s._id === sessionId ? { ...s, title } : s)));

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setSessions(previous);
      setError({ type: "session_load", message: "Couldn't rename this chat." });
    }
  };

  const handleTogglePinSession = async (sessionId, pinned) => {
    const previous = useAiAgentStore.getState().sessions;

    // Re-sort locally to match the server's `pinned desc, updatedAt desc`, so the
    // row jumps to its new group immediately instead of after the next reload.
    const next = previous
      .map((s) => (s._id === sessionId ? { ...s, pinned } : s))
      .sort(
        (a, b) =>
          Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
          new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0),
      );
    setSessions(next);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ pinned }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setSessions(previous);
      setError({ type: "session_load", message: "Couldn't update this chat." });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const previous = useAiAgentStore.getState().sessions;
    setSessions(previous.filter((s) => s._id !== sessionId));

    // Deleting the conversation you're reading has to reset the view too,
    // otherwise the transcript stays on screen with no session behind it.
    if (sessionId === useAiAgentStore.getState().activeSessionId) {
      setActiveSession(null);
      useAiAgentStore.getState().setMessages([]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions/${sessionId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setSessions(previous);
      setError({ type: "session_load", message: "Couldn't delete this chat." });
    }
  };

  const appendMessage = (msg) =>
    useAiAgentStore.getState().appendMessage(msg);

  // /context appends a placeholder, then swaps it for the loaded result.
  const replaceLastContext = (msg) => {
    const store = useAiAgentStore.getState();
    const next = [...store.messages];
    const i = next.findLastIndex((m) => m.role === "context" && m.loading);
    if (i === -1) return;
    next[i] = msg;
    store.setMessages(next);
  };

  // Prompt chips and menu shortcuts fill the composer; the token bump tells
  // ChatInput to focus and park the caret at the end.
  const insertPrompt = (prompt) => {
    setDraft(prompt);
    setFocusToken((n) => n + 1);
  };

  return (
    <div
      className="flex bg-black text-[#e5e5e5]"
      style={{ height: "calc(100vh - 44px)" }}
    >
      <SessionsSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onTogglePinSession={handleTogglePinSession}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatTopBar title={activeTitle} messages={messages} />

        {error && (
          <div
            className="mx-4 mt-2 px-4 py-3 rounded-xl flex items-start gap-3 text-[13px] shrink-0"
            style={{ backgroundColor: "#1a0e0e", border: "1px solid #4a1a1a", color: "#f87171" }}
          >
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span className="flex-1">
              {error.type === "rate_limit"
                ? `Daily limit reached (30 messages/day).${error.resetAt ? ` Resets at ${new Date(error.resetAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.` : ""}`
                : error.type === "session_load"
                  ? error.message
                  : "Connection error. Your message was not sent."}
            </span>
            {error.type === "network" && (
              <button
                onClick={() => {
                  setError(null);
                  handleSend(messages.findLast?.((m) => m.role === "user")?.content ?? "");
                }}
                className="flex items-center gap-1 text-[12px] underline underline-offset-2 shrink-0 hover:opacity-80"
              >
                <RefreshCw size={12} /> Retry
              </button>
            )}
            <button onClick={() => setError(null)} className="shrink-0 hover:opacity-60">
              <X size={14} />
            </button>
          </div>
        )}

        {/* The hero IS the empty state now, not a separate route. Once there's
            anything to show — history, a live stream, or a loading session —
            it gives way to the transcript. */}
        {isEmptyChat ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto py-8">
            <AgentHero onSelectPrompt={insertPrompt} />
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoadingSession={isLoadingSession}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
          />
        )}
        <ChatInput
          isStreaming={isStreaming}
          onSend={handleSend}
          value={draft}
          onValueChange={setDraft}
          focusToken={focusToken}
        />
      </div>
    </div>
  );
}
