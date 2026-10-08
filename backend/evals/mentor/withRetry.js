/**
 * Retry a Groq call on 429. The free/on-demand tier caps tokens per minute, and
 * the error message says how long to wait ("try again in 7.2s"), so use that
 * instead of guessing a backoff.
 */
const MAX_ATTEMPTS = 6;

const waitMs = (err, attempt) => {
  const m = /try again in ([\d.]+)(ms|s)/i.exec(err?.message ?? "");
  if (m) return Math.ceil(parseFloat(m[1]) * (m[2] === "ms" ? 1 : 1000)) + 500;
  return 2000 * attempt;
};

export const withRetry = async (fn) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status !== 429 || attempt >= MAX_ATTEMPTS) throw err;
      await new Promise((r) => setTimeout(r, waitMs(err, attempt)));
    }
  }
};
