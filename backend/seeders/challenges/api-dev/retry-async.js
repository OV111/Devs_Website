export default {
  slug: "retry-async",
  trackId: "api-dev",
  layerId: "api-dev-3",
  type: "CODE",
  difficulty: "med",
  title: "Retry an async call with backoff",
  summary: "Retry a failing promise-returning function, doubling the wait between attempts.",
  description:
    "Network calls fail for transient reasons. A retry wrapper with exponential backoff is one of the most reused helpers in any Node service.",
  task:
    "Write <code>retryAsync(fn, { retries = 3, delayMs = 100, sleep })</code>. Call <code>fn(attempt)</code>; if it rejects, wait <code>delayMs * 2 ** attempt</code> using <code>sleep(ms)</code> and try again. After <code>retries</code> retries, throw the last error.",
  constraints: [
    "Total calls are at most <code>retries + 1</code>.",
    "<code>attempt</code> starts at 0.",
    "Do not sleep after the final failure.",
    "<code>sleep</code> defaults to a <code>setTimeout</code> promise; tests inject a fake.",
  ],
  example: `await retryAsync(() => fetchUser(), { retries: 2, delayMs: 100 }); // waits 100ms, then 200ms`,
  tags: ["async","errors","resilience"],
  estimatedMins: 20,
  xp: 45,
  starterFiles: [
    {
      name: "retryAsync.js",
      lang: "js",
      code: `// retryAsync.js
function retryAsync(fn, options = {}) {
  // your code here
}

module.exports = retryAsync;`,
    },
  ],
  testFile: {
    name: "retryAsync_test.js",
    lang: "test",
    code: `const retryAsync = require('./retryAsync');

test('returns_value', () => {
  return retryAsync(async () => 5).then((v) => expect(v).toBe(5));
});

test('retries_then_succeeds', () => {
  let n = 0; return retryAsync(async () => { if (++n < 2) throw new Error('x'); return 'ok'; }, { sleep: async () => {} }).then((v) => expect(v).toBe('ok'));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "A <code>for</code> loop from 0 to <code>retries</code> inclusive, with <code>try/catch</code> inside, is enough." },
    { order: 2, cost: 5, text: "Remember the last error in a variable, and only sleep when <code>attempt &lt; retries</code>." },
    { order: 3, cost: 15, text: "The wait is <code>delayMs * 2 ** attempt</code>." },
  ],
  hiddenTests: [
    { name: "first_try_success_no_sleep", code: `const sleeps = []; const v = await retryAsync(async () => 'a', { sleep: async (ms) => { sleeps.push(ms); } });
assert(v === 'a' && sleeps.length === 0, 'no sleep when it works');` },
    { name: "succeeds_after_failures_with_backoff", code: `const sleeps = []; let n = 0;
const v = await retryAsync(async () => { if (n++ < 2) throw new Error('t'); return 'done'; }, { delayMs: 100, sleep: async (ms) => { sleeps.push(ms); } });
assert(v === 'done', 'result');
assert(sleeps.length === 2 && sleeps[0] === 100 && sleeps[1] === 200, 'delays double: ' + sleeps);` },
    { name: "throws_last_error_after_exhausting", code: `let calls = 0; let err = null;
try { await retryAsync(async () => { calls++; throw new Error('e' + calls); }, { retries: 2, sleep: async () => {} }); } catch (e) { err = e; }
assert(calls === 3, 'retries + 1 calls, got ' + calls);
assert(err && err.message === 'e3', 'last error is thrown');` },
    { name: "no_sleep_after_final_failure", code: `const sleeps = [];
try { await retryAsync(async () => { throw new Error('x'); }, { retries: 2, delayMs: 10, sleep: async (ms) => { sleeps.push(ms); } }); } catch (e) {}
assert(sleeps.length === 2, 'two sleeps for three attempts, got ' + sleeps.length);` },
    { name: "retries_zero", code: `let calls = 0;
try { await retryAsync(async () => { calls++; throw new Error('x'); }, { retries: 0, sleep: async () => {} }); } catch (e) {}
assert(calls === 1, 'one call only');` },
    { name: "passes_attempt_index", code: `const seen = [];
try { await retryAsync(async (a) => { seen.push(a); throw new Error('x'); }, { retries: 2, sleep: async () => {} }); } catch (e) {}
assert(seen.join(',') === '0,1,2', 'attempt numbers: ' + seen);` },
  ],
  solution: {
    code: `async function retryAsync(fn, { retries = 3, delayMs = 100, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await sleep(delayMs * 2 ** attempt);
    }
  }
  throw lastErr;
}

module.exports = retryAsync;`,
    explanation:
      "A bounded loop with try/catch; the wait doubles with the attempt number, and the last error is rethrown once attempts run out.",
  },
};
