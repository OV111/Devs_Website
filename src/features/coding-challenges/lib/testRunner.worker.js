/**
 * testRunner.worker — the Web Worker entry point for the challenge runner.
 *
 * Student code runs off the main thread so a slow (or hostile) solution can't
 * freeze the Arena UI. All the real logic lives in `testRunnerCore`, which is
 * deliberately worker-free so it can also be exercised from plain Node.
 *
 * Protocol:
 *   in  → { files: [{ name, lang, code }] }
 *   out → { results: [{ name, passed, ms, message }] }
 *
 * Note: a genuine infinite loop in student code blocks this thread and no
 * in-worker timer can fire. The consumer (`useCodeRunner`) owns the hard kill
 * via `worker.terminate()`.
 */

import { runTests } from "./testRunnerCore.js";

self.addEventListener("message", async (event) => {
  const files = event.data?.files ?? [];
  try {
    const results = await runTests(files);
    self.postMessage({ results });
  } catch (err) {
    self.postMessage({
      results: [
        {
          name: "runner",
          passed: false,
          ms: 0,
          message: err?.message ?? String(err),
        },
      ],
    });
  }
});
