import { create } from "zustand";

const useAiAgentStore = create((set) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isStreaming: false,
  streamingContent: "",
  error: null,
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
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
      streamingContent: "",
      error: null,
    }),
}));

export default useAiAgentStore;
