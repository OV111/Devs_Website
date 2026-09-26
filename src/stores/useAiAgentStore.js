import { create } from "zustand";

const useAiAgentStore = create((set) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isStreaming: false,
  // True while an existing session's history is being fetched. Without this the
  // transcript is cleared first and the empty-state ("start a conversation")
  // flashes, making a conversation with history look empty while it loads.
  isLoadingSession: false,
  streamingContent: "",
  error: null,
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
  setLoadingSession: (isLoadingSession) => set({ isLoadingSession }),
  setSessions: (sessions) => set({ sessions }),
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  appendStreamChunk: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),
  clearStream: () => set({ streamingContent: "" }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      sessions: [],
      activeSessionId: null,
      messages: [],
      isStreaming: false,
      isLoadingSession: false,
      streamingContent: "",
      error: null,
    }),
}));

export default useAiAgentStore;
