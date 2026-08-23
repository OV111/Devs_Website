// Voice AI Progress Review — scaffold only, not implemented.
// See VISION.md > "Voice AI Progress Review" for the full spec.
//
// Planned responsibilities:
// - transcribeSession(db, userId, path, layer, audio)   -> sends recorded audio to STT (see agent/transcriptionService.js), stores raw transcript
// - reviewTranscript(db, userId, path, layer, transcript) -> reuses the exam engine's grading approach (examEngineService) but scores
//   free-form explanation instead of MCQ answers: correctness, completeness, weak topics
// - getVoiceReviewHistory(db, userId, path, layer)       -> mirrors examHistoryService for past voice review attempts
//
// Async v1 only (record -> review after). Live/sync follow-up questioning is a later iteration.

export const transcribeSession = async () => {
  throw new Error("Not implemented — see VISION.md > Voice AI Progress Review");
};

export const reviewTranscript = async () => {
  throw new Error("Not implemented — see VISION.md > Voice AI Progress Review");
};

export const getVoiceReviewHistory = async () => {
  throw new Error("Not implemented — see VISION.md > Voice AI Progress Review");
};
