import { useCallback, useEffect, useRef, useState } from "react";

/** Hard kill for the worker — must be longer than the worker's own run budget. */
const RUN_TIMEOUT_MS = 5000;

const timeoutResult = () => [
  {
    name: "run",
    passed: false,
    ms: RUN_TIMEOUT_MS,
    message: `Execution timed out after ${RUN_TIMEOUT_MS / 1000}s — check for an infinite loop.`,
  },
];

/**
 * Runs a challenge's files against its test file in a throwaway Web Worker.
 *
 * One worker per run: spawning is cheap next to the safety it buys, and a
 * terminate-on-every-path lifecycle means a runaway loop in student code can
 * never leak a live thread. The worker is the only thing that can be killed
 * mid-infinite-loop, which is why the timeout lives out here and not inside it.
 *
 * @returns {{ run: (files: any[]) => Promise<any[]>, running: boolean, results: any[] }}
 */
export default function useCodeRunner() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const workerRef = useRef(null);

  // Kill any in-flight run if the Arena unmounts mid-execution.
  useEffect(
    () => () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    },
    [],
  );

  const run = useCallback(async (files) => {
    workerRef.current?.terminate();

    const worker = new Worker(
      new URL("../lib/testRunner.worker.js", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;
    setRunning(true);

    const next = await new Promise((resolve) => {
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
        resolve(value);
      };

      const timer = setTimeout(() => finish(timeoutResult()), RUN_TIMEOUT_MS);

      worker.onmessage = (event) => finish(event.data?.results ?? []);
      worker.onerror = (event) =>
        finish([
          {
            name: "run",
            passed: false,
            ms: 0,
            message: event?.message ?? "The test runner crashed.",
          },
        ]);

      worker.postMessage({ files });
    });

    setResults(next);
    setRunning(false);
    return next;
  }, []);

  return { run, running, results };
}
