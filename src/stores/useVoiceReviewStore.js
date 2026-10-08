import { create } from "zustand";

// Voice AI Progress Review — scaffold only, not implemented. See docs/strategy/VISION.md.

const useVoiceReviewStore = create((set) => ({
  isRecording: false,
  transcript: "",
  result: null,
  error: null,
  setRecording: (isRecording) => set({ isRecording }),
  setTranscript: (transcript) => set({ transcript }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  reset: () => set({ isRecording: false, transcript: "", result: null, error: null }),
}));

export default useVoiceReviewStore;
