import { useEffect, useRef, useState } from "react";

/**
 * Owns the editor's local file state: seeds it from the saved draft (or the
 * starter files on a first visit), and autosaves 1.5s after typing stops.
 * Local so typing stays instant — the store round-trip only happens on save.
 */
export default function useArenaFiles({ challenge, attempt, saveDraft }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!challenge) return;
    const draft = attempt?.code?.length ? attempt.code : challenge.starterFiles;
    const byName = new Map((draft ?? []).map((f) => [f.name, f.code]));
    setFiles(
      [
        ...(challenge.starterFiles ?? []).map((f) => ({
          ...f,
          code: byName.get(f.name) ?? f.code,
        })),
        challenge.testFile,
      ].filter(Boolean),
    );
  }, [challenge, attempt]);

  const updateFile = (name, code) => {
    setFiles((prev) => prev.map((f) => (f.name === name ? { ...f, code } : f)));
  };

  // Debounced rather than per-keystroke so a fast typist doesn't generate a
  // save request per character.
  const savedRef = useRef("");
  useEffect(() => {
    const editable = files.filter((f) => f.lang !== "test");
    if (!attempt || editable.length === 0) return;

    const payload = JSON.stringify(editable.map(({ name, code }) => ({ name, code })));
    if (payload === savedRef.current) return;

    const id = setTimeout(() => {
      savedRef.current = payload;
      saveDraft(JSON.parse(payload));
    }, 1500);
    return () => clearTimeout(id);
  }, [files, attempt, saveDraft]);

  return { files, updateFile };
}
