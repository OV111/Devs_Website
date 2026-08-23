import { useCallback, useEffect, useRef } from "react";
import { Mic, Square, RotateCcw, AlertTriangle } from "lucide-react";
import useVoiceReviewStore from "@/stores/useVoiceReviewStore";

// Voice AI Progress Review — frontend capture only, for now.
// Uses the browser's built-in Web Speech API (free, client-side) per VISION.md's
// free-tier decision. Nothing here is sent to the backend yet — voiceReviewService.js
// and the /api/voice-review routes are still unimplemented stubs.

const getSpeechRecognition = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const VoiceReviewPage = () => {
  const { isRecording, transcript, error, setRecording, setTranscript, setError, reset } =
    useVoiceReviewStore();

  const recognitionRef = useRef(null);
  const SpeechRecognitionImpl = getSpeechRecognition();
  const isSupported = Boolean(SpeechRecognitionImpl);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleStart = useCallback(() => {
    if (!isSupported) return;

    setError(null);

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = transcript ? `${transcript} ` : "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += `${result[0].transcript} `;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript((finalTranscript + interim).trim());
    };

    recognition.onerror = (event) => {
      setError(event.error === "not-allowed" ? "Microphone access was denied." : `Speech recognition error: ${event.error}`);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }, [SpeechRecognitionImpl, isSupported, transcript, setError, setRecording, setTranscript]);

  const handleStop = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, [setRecording]);

  const handleReset = useCallback(() => {
    recognitionRef.current?.stop();
    reset();
  }, [reset]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#1a1f36] dark:text-white mb-1">
        Voice Progress Review
      </h1>
      <p className="text-[13.5px] text-[#697386] dark:text-zinc-400 mb-7">
        Explain what you learned out loud. This is a preview — nothing is graded yet.
      </p>

      {!isSupported && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm px-4 py-3 mb-5">
          <AlertTriangle size={16} className="shrink-0" />
          Your browser doesn't support the Web Speech API. Try Chrome or Edge.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 mb-5">
          <AlertTriangle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800/60 dark:backdrop-blur-sm rounded-xl px-8 py-10">
        <div className="flex items-center justify-center gap-4 mb-8">
          {!isRecording ? (
            <button
              onClick={handleStart}
              disabled={!isSupported}
              className="flex items-center gap-2 rounded-full bg-[#1a1f36] dark:bg-white text-white dark:text-[#1a1f36] px-6 py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mic size={16} />
              Start speaking
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 rounded-full bg-red-600 text-white px-6 py-3 text-sm font-medium animate-pulse"
            >
              <Square size={16} />
              Stop
            </button>
          )}

          {transcript && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-600 text-[#697386] dark:text-zinc-400 px-4 py-3 text-sm"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>

        <div className="min-h-[160px] rounded-lg bg-neutral-50 dark:bg-neutral-900/60 px-5 py-4 text-[14px] leading-relaxed text-[#1a1f36] dark:text-zinc-200 whitespace-pre-wrap">
          {transcript || (
            <span className="text-neutral-400 dark:text-neutral-500">
              Your transcript will appear here as you speak.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceReviewPage;
