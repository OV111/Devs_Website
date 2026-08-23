// Speech-to-text wrapper — scaffold only, not implemented.
// See VISION.md > "Voice AI Progress Review" prerequisites: pick an STT vendor and
// prototype cost-per-session before committing (determines pricing tier feasibility).
//
// Candidate vendors to evaluate: OpenAI Whisper API, Deepgram, AssemblyAI.
// Planned shape: transcribeAudio(audioBuffer, mimeType) -> { text, durationSeconds }
//
// FREE-TIER NOTE: for free-tier / MVP users, don't route through a paid STT API at all —
// use the browser's built-in Web Speech API (SpeechRecognition) on the frontend to transcribe
// client-side, for $0 marginal cost. Send the resulting text transcript to the backend, so
// this service only ever receives text, never raw audio, for free users.
// Reserve paid server-side STT (Whisper/Deepgram/AssemblyAI) for a Pro-tier "higher accuracy /
// non-Chrome browser support" fallback, if it's worth the added AI-cost-model risk at all —
// this keeps the free version viable without adding a new per-user cost the free tier can't absorb.

export const transcribeAudio = async () => {
  throw new Error("Not implemented — see VISION.md > Voice AI Progress Review");
};
