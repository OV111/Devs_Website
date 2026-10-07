import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, X, GraduationCap, PanelLeft } from "lucide-react";
import useAiAgentStore from "@/stores/useAiAgentStore";
import useAgentStream from "@/hooks/useAgentStream";
import SessionsSidebar from "./components/SessionsSidebar";
import ChatTopBar from "./components/ChatTopBar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import AgentHero from "./components/AgentHero";
import PromptChips from "./components/PromptChips";
import { getAccessToken, API_BASE_URL, authHeaders } from "../../../constants/api";

/**
 * Placeholder title shown for the second or so before the generated one arrives.
 * Breaks on a word boundary so the sidebar never shows a chopped-off word.
 */
const placeholderTitle = (text) => {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= 48) return clean;
  const cut = clean.slice(0, 48);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 20 ? cut.slice(0, lastSpace) : cut}…`;
};

export default function AiAgent() {
  // The composer draft lives here because the hero's prompt chips sit outside
  // ChatInput and need to write into it.
  const [draft, setDraft] = useState("");
  // Phones have no sidebar, so the sessions list opens as a drawer from here.
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [focusToken, setFocusToken] = useState(0);
  const [teachBackContext, setTeachBackContext] = useState(null);
  // Where the learner came from, sent with every message so the mentor can
  // resolve "this" and "why did it fail". Kept SEPARATE from teachBackContext,
  // which is cleared as soon as teach-back mode is used or dismissed — the origin
  // is still useful context for an ordinary question afterwards.
  const [originContext, setOriginContext] = useState({ surface: "chat" });

  const location = useLocation();
  const navigate = useNavigate();

  // Arriving from the exam results "Teach it back" nudge: capture the topic
  // context once, then clear router state so a refresh/back doesn't re-trigger it.
  useEffect(() => {
    if (location.state?.teachBack) {
      const { path, layer, topic } = location.state.teachBack;
      setTeachBackContext({ mode: "initial", path, layer, topic });
      setOriginContext({ surface: "exam-results", path, layer, topic });
      setFocusToken((n) => n + 1);
      navigate(".", { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);


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
    // Opening another conversation ends the connection to wherever they arrived
    // from — otherwise an old chat still claims they are on that exam page.
    setOriginContext({ surface: "chat" });

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
      // A deliberately fresh conversation carries no arrival context.
      setOriginContext({ surface: "chat" });
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

    // Teach-Back mode: the answer is graded against a rubric, not sent to the
    // general agent — same "never touch the daily message cap" reasoning /context uses.
    if (teachBackContext) {
      const ctx = teachBackContext;
      appendMessage({ role: "user", content: text });
      appendMessage({ role: "teach_back", loading: true });
      setTeachBackContext(null);

      const isFollowUp = ctx.mode === "followup";
      const url = isFollowUp
        ? `${API_BASE_URL}/api/exams/submit-teach-back-followup`
        : `${API_BASE_URL}/api/exams/submit-teach-back`;
      const body = isFollowUp
        ? { sessionId: ctx.sessionId, answerText: text }
        : { path: ctx.path, layer: ctx.layer, topic: ctx.topic, answerText: text };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        replaceLastTeachBack({ role: "teach_back", data });
      } catch (err) {
        replaceLastTeachBack({ role: "teach_back", error: err.message || "Couldn't grade this explanation." });
      }
      return;
    }

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
          body: JSON.stringify({ title: placeholderTitle(text) }),
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

    sendMessage({ sessionId, content: text, token, attachments, activity: originContext });
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

  // Same swap-the-placeholder pattern as /context, for teach-back grading.
  const replaceLastTeachBack = (msg) => {
    const store = useAiAgentStore.getState();
    const next = [...store.messages];
    const i = next.findLastIndex((m) => m.role === "teach_back" && m.loading);
    if (i === -1) return;
    next[i] = msg;
    store.setMessages(next);
  };

  // "Answer" on a TeachBackCard's follow-up re-arms teach-back mode, scoped to
  // just that one weak criterion via sessionId — no path/layer/topic needed.
  const handleAnswerFollowUp = (resultData) => {
    if (!resultData.followUp) return;
    setTeachBackContext({
      mode: "followup",
      sessionId: resultData.sessionId,
      topic: resultData.followUp.question,
    });
    setFocusToken((n) => n + 1);
  };

  // Prompt chips and menu shortcuts fill the composer; the token bump tells
  // ChatInput to focus and park the caret at the end.
  const insertPrompt = (prompt) => {
    setDraft(prompt);
    setFocusToken((n) => n + 1);
  };

  return (
    <div
      className="flex h-[calc(100dvh-var(--navbar-h,44px))] bg-black text-[#e5e5e5] md:h-[calc(100vh-44px)]"
    >
      <SessionsSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onTogglePinSession={handleTogglePinSession}
        mobileOpen={sessionsOpen}
        onMobileClose={() => setSessionsOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <button
          type="button"
          onClick={() => setSessionsOpen(true)}
          aria-label="Open sessions"
          className="absolute top-2 left-2 z-30 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 after:absolute after:-inset-1 hover:bg-white/10 hover:text-white md:hidden"
        >
          <PanelLeft size={18} strokeWidth={2} />
        </button>
        {activeTitle && (
          <div className="absolute top-0 inset-x-0 z-20">
            <ChatTopBar title={activeTitle} messages={messages} />
          </div>
        )}

        {error && (
          <div
            className="mx-4 mt-12 md:mt-2 px-4 py-3 rounded-xl flex items-start gap-3 text-[13px] shrink-0"
            style={{ backgroundColor: "#1a0e0e", border: "1px solid #4a1a1a", color: "#f87171" }}
          >
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span className="flex-1">
              {error.type === "rate_limit"
                ? `Daily limit reached (30 messages/day).${error.resetAt ? ` Resets at ${new Date(error.resetAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.` : ""}`
                : error.type === "session_load" || error.type === "paused"
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
            <button onClick={() => setError(null)} aria-label="Dismiss error" className="shrink-0 hover:opacity-60 -m-3 p-3">
              <X size={14} />
            </button>
          </div>
        )}

        {/* One flex column holds transcript-or-hero AND the composer, so the
            SAME ChatInput instance serves both states — mounting a second copy
            inside the hero would reset its attachment state on the first send.

            Empty state: justify-center centres [greeting → composer → chips]
            as one block. Conversation: MessageList takes flex-1 and pushes the
            composer to the bottom. */}
        <div
          className={`flex-1 flex flex-col min-h-0 ${
            isEmptyChat ? "justify-center overflow-y-auto py-8 gap-5 sm:gap-7" : ""
          }`}
        >
          {isEmptyChat ? (
            <AgentHero />
          ) : (
            <MessageList
              messages={messages}
              isLoadingSession={isLoadingSession}
              isStreaming={isStreaming}
              streamingContent={streamingContent}
              onAnswerFollowUp={handleAnswerFollowUp}
              topInset={Boolean(activeTitle)}
            />
          )}

          {teachBackContext && (
            <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 mb-2 flex items-center justify-between gap-3 text-[12px] rounded-lg border border-purple-700/40 bg-purple-950/20 px-3 py-2">
              <span className="flex items-center gap-1.5 text-purple-300">
                <GraduationCap size={13} />
                {teachBackContext.mode === "followup" ? (
                  <>Follow-up: <strong>{teachBackContext.topic}</strong></>
                ) : (
                  <>Teach-Back: explain <strong>{teachBackContext.topic}</strong> in your own words</>
                )}
              </span>
              <button onClick={() => setTeachBackContext(null)} aria-label="Cancel teach-back" className="text-purple-400/60 hover:text-purple-300 -m-3 p-3">
                <X size={13} />
              </button>
            </div>
          )}

          <ChatInput
            isStreaming={isStreaming}
            onSend={handleSend}
            value={draft}
            onValueChange={setDraft}
            focusToken={focusToken}
            spacious={isEmptyChat}
            />
            {isEmptyChat && <PromptChips onSelectPrompt={insertPrompt} />}

        </div>
      </div>
    </div>
  );
}
