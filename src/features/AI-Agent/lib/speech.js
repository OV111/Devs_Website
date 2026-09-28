// Browser TTS — same "free, built-in, no backend" reasoning as the mic's
// SpeechRecognition in ChatInput.jsx. Best support in Chrome/Edge.
export const isSpeechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export const speak = (text) => {
  if (!isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel(); // don't stack multiple utterances
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
};
