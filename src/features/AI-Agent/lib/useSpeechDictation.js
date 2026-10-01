import { useEffect, useRef, useState } from "react";
import { stopSpeaking } from "./speech";

/**
 * Web Speech API dictation — client-side STT, no backend call, no API key.
 * Chrome/Edge only (no Firefox/Safari support as of writing); callers should
 * only render a mic control when `isSupported` is true rather than showing a
 * dead button.
 *
 * Extracted out of ChatInput.jsx so the inline exam-page Teach-Back widget
 * can dictate too without duplicating the recognition wiring.
 */
export const useSpeechDictation = (value, setValue) => {
  const recognitionRef = useRef(null);
  const baseTextRef = useRef(""); // text already in the box before this recording started
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognitionCtor =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleListening = () => {
    if (!SpeechRecognitionCtor) return;

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    stopSpeaking(); // don't talk over the user while they're dictating

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    baseTextRef.current = value;

    recognition.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      const sep = baseTextRef.current.trim() ? " " : "";
      setValue(baseTextRef.current + sep + finalText + interimText);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // Stop any in-flight recognition on unmount so it doesn't keep the mic hot.
  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { isSupported: Boolean(SpeechRecognitionCtor), isListening, toggleListening };
};
