import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import useAiAgentStore from "@/stores/useAiAgentStore";
import useAgentStream from "@/hooks/useAgentStream";
import SessionsSidebar from "./components/SessionsSidebar";
import ChatTopBar from "./components/ChatTopBar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import AgentContextPanel from "./components/AgentContextPanel";
import { JWT_KEY, API_BASE_URL, authHeaders } from "../../../constants/api";

const AGENT_TOOLS = [
  { name: "search_posts", description: "Search platform posts" },
  { name: "search_library", description: "Search learning library" },
  { name: "get_user_profile", description: "Look up a user profile" },
  { name: "get_user_progress", description: "Fetch your roadmap progress" },
  { name: "get_exam_history", description: "Fetch your exam results" },
  { name: "get_weak_spots", description: "Fetch your weak spots" },
  { name: "log_weak_spot", description: "Record a topic you're struggling with" },
];

export default function AiAgent() {
  const location = useLocation();
  const navigate = useNavigate();
  const firedRef = useRef(false);

  const [weakSpots, setWeakSpots] = useState([]);
  const [topicsMastered, setTopicsMastered] = useState([]);

  const {
    sessions: storeSessions,
    activeSessionId: storeActiveSessionId,
    messages: storeMessages,
    isStreaming,
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

  // load weak spots + progress for context panel
  useEffect(() => {
    const loadContext = async () => {
      try {
        const [wsRes, progRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/exams/weak-spots`, { headers: authHeaders() }),
          fetch(`${API_BASE_URL}/api/roadmaps/progress`, { headers: authHeaders() }),
        ]);
        if (wsRes.ok) {
          const { weakSpots: ws } = await wsRes.json();
          setWeakSpots(ws ?? []);
        }
        if (progRes.ok) {
          const { progress } = await progRes.json();
          setTopicsMastered(progress?.completedLayers ?? []);
        }
      } catch { /* non-fatal */ }
    };
    loadContext();
  }, [setSessions]);

  // auto-fire initial message from landing page
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (!initialMessage || firedRef.current) return;
    firedRef.current = true;

    navigate(location.pathname, { replace: true, state: {} });

    const token = localStorage.getItem(JWT_KEY);

    async function bootstrap() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: initialMessage.slice(0, 60) }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const session = await res.json();
        setActiveSession(session._id);
        setSessions([session, ...useAiAgentStore.getState().sessions]);
        sendMessage({ sessionId: session._id, content: initialMessage, token });
      } catch {
        sendMessage({ sessionId: null, content: initialMessage, token });
      }
    }

    bootstrap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectSession = async (sessionId) => {
    setActiveSession(sessionId);
    useAiAgentStore.getState().setMessages([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-agent/sessions/${sessionId}`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const session = await res.json();
      useAiAgentStore.getState().setMessages(
        (session.messages ?? []).map((m) => ({ role: m.role, content: m.content }))
      );
    } catch { /* non-fatal */ }
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

  const handleSend = (text) => {
    sendMessage({
      sessionId: storeActiveSessionId,
      content: text,
      token: localStorage.getItem(JWT_KEY),
    });
  };

  return (
    <div
      className="flex bg-gray-950 text-[#e5e5e5]"
      style={{ height: "calc(100vh - 44px)" }}
    >
      <SessionsSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatTopBar activeSessionId={activeSessionId} isStreaming={isStreaming} />

        {error && (
          <div
            className="mx-4 mt-2 px-4 py-3 rounded-xl flex items-start gap-3 text-[13px] shrink-0"
            style={{ backgroundColor: "#1a0e0e", border: "1px solid #4a1a1a", color: "#f87171" }}
          >
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span className="flex-1">
              {error.type === "rate_limit"
                ? `Daily limit reached (30 messages/day).${error.resetAt ? ` Resets at ${new Date(error.resetAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.` : ""}`
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

        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
        />
        <ChatInput isStreaming={isStreaming} onSend={handleSend} />
      </div>

      <AgentContextPanel
        topicsMastered={topicsMastered}
        weakSpots={weakSpots}
        tools={AGENT_TOOLS}
      />
    </div>
  );
}
