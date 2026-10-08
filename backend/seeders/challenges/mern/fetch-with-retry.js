export default {
  slug: "fetch-with-retry",
  trackId: "mern",
  layerId: "mern-2",
  type: "CODE",
  difficulty: "hard",
  title: "fetch with retries, backoff and abort",
  summary: "Wrap a fetch-like function: retry network errors and 5xx/429 with exponential backoff, honour Retry-After, and stop on abort.",
  description:
    "<code>fetch</code> only rejects on network failure; a 503 comes back as a normal response. Production clients wrap it: retry what is worth retrying, wait longer each time, respect the server's <code>Retry-After</code>, and stop immediately when the user cancels.",
  task:
    "Write <code>async fetchWithRetry(fetchFn, url, options)</code>. <code>options</code> is <code>{ retries = 3, baseDelay = 100, maxDelay = 2000, sleep, signal }</code>, where <code>sleep(ms)</code> returns a promise (injected so it can be tested; if missing, don't wait) and <code>signal</code> is an AbortSignal-like <code>{ aborted }</code>.",
  constraints: [
    "Call <code>fetchFn(url, { signal })</code>. A response with <code>ok: true</code> is returned immediately.",
    "Retry when <code>fetchFn</code> throws, or when the response status is <code>429</code> or <code>&gt;= 500</code>. Any other non-ok response (404, 401...) is returned as-is without retrying. At most <code>retries + 1</code> attempts in total.",
    "Before retry number <code>k</code> (0-based) wait <code>min(maxDelay, baseDelay * 2 ** k)</code> ms via <code>sleep</code>. If the failed response has a numeric <code>Retry-After</code> header (seconds, read with <code>response.headers.get</code>), wait that many seconds instead. Never sleep after the final attempt.",
    "When attempts run out, throw an <code>Error</code> with <code>attempts</code> set, plus <code>response</code> (last bad response) or <code>cause</code> (last thrown error).",
    "If <code>signal.aborted</code> is true before an attempt, or after a sleep, or <code>fetchFn</code> throws while it is aborted, throw an error named <code>'AbortError'</code> immediately, without further calls.",
  ],
  example: `const res = await fetchWithRetry(fetch, '/api/items', { retries: 4, sleep: (ms) => new Promise((r) => setTimeout(r, ms)) });`,
  tags: ["fetch", "retry", "backoff", "abort", "async"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "fetchWithRetry.js",
      lang: "js",
      code: `// fetchWithRetry.js
async function fetchWithRetry(fetchFn, url, options = {}) {
  // your code here
}

module.exports = fetchWithRetry;`,
    },
  ],
  testFile: {
    name: "fetchWithRetry_test.js",
    lang: "test",
    code: `const fetchWithRetry = require('./fetchWithRetry');
const res = (status) => ({ ok: status < 400, status, headers: { get: () => null } });

test('returns ok responses', async () => {
  const r = await fetchWithRetry(async () => res(200), '/x');
  expect(r.status).toBe(200);
});

test('does not retry a 404', async () => {
  let calls = 0;
  const r = await fetchWithRetry(async () => { calls++; return res(404); }, '/x');
  expect(calls).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "A plain <code>for (attempt = 0; attempt &lt;= retries; attempt++)</code> loop reads better than recursion. Check <code>signal.aborted</code> at the top of every iteration; that also covers 'aborted during sleep'." },
    { order: 2, cost: 5, text: "Wrap only the <code>fetchFn</code> call in try/catch; a response (even a 503) isn't an exception. Decide 'retryable' from <code>status === 429 || status &gt;= 500</code>." },
    { order: 3, cost: 15, text: "Compute the delay after a failed attempt but only if <code>attempt &lt; retries</code>. Prefer the numeric <code>Retry-After</code> over the backoff formula. Remember headers may be absent on fakes: <code>res.headers?.get?.('retry-after')</code>." },
  ],
  hiddenTests: [
    { name: "returns_ok_response_without_sleeping", code: `const sleeps = [];
const ok = { ok: true, status: 200, headers: { get: () => null } };
const r = await fetchWithRetry(async () => ok, '/a', { sleep: async (ms) => { sleeps.push(ms); } });
assert(r === ok, 'same response object');
assert(sleeps.length === 0, 'no sleeping on success');` },
    { name: "retries_5xx_with_exponential_backoff", code: `const sleeps = []; let calls = 0;
const bad = { ok: false, status: 503, headers: { get: () => null } };
const good = { ok: true, status: 200, headers: { get: () => null } };
const r = await fetchWithRetry(async () => (++calls < 3 ? bad : good), '/a', { baseDelay: 100, sleep: async (ms) => { sleeps.push(ms); } });
assert(r === good && calls === 3, 'succeeds on third try, calls=' + calls);
assert(JSON.stringify(sleeps) === '[100,200]', 'sleeps ' + JSON.stringify(sleeps));` },
    { name: "retries_network_errors_and_429", code: `let calls = 0; const sleeps = [];
const r = await fetchWithRetry(async () => {
  calls++;
  if (calls === 1) throw new Error('offline');
  if (calls === 2) return { ok: false, status: 429, headers: { get: () => null } };
  return { ok: true, status: 200, headers: { get: () => null } };
}, '/a', { sleep: async (ms) => { sleeps.push(ms); } });
assert(r.status === 200 && calls === 3, 'calls=' + calls);` },
    { name: "does_not_retry_other_client_errors", code: `let calls = 0;
const notFound = { ok: false, status: 404, headers: { get: () => null } };
const r = await fetchWithRetry(async () => { calls++; return notFound; }, '/a', { sleep: async () => {} });
assert(r === notFound && calls === 1, '404 returned after ' + calls + ' call(s)');` },
    { name: "throws_when_retries_exhausted_with_response", code: `let calls = 0;
const bad = { ok: false, status: 500, headers: { get: () => null } };
let err = null;
try { await fetchWithRetry(async () => { calls++; return bad; }, '/a', { retries: 2, sleep: async () => {} }); } catch (e) { err = e; }
assert(calls === 3, 'retries + 1 attempts, got ' + calls);
assert(err && err.attempts === 3 && err.response === bad, 'error carries attempts and the last response');` },
    { name: "throws_with_cause_after_network_failures", code: `const boom = new Error('offline');
let err = null; let calls = 0;
try { await fetchWithRetry(async () => { calls++; throw boom; }, '/a', { retries: 1, sleep: async () => {} }); } catch (e) { err = e; }
assert(calls === 2 && err && err.cause === boom && err.attempts === 2, 'cause kept');` },
    { name: "delay_is_capped_by_max_delay", code: `const sleeps = [];
const bad = { ok: false, status: 502, headers: { get: () => null } };
try { await fetchWithRetry(async () => bad, '/a', { retries: 3, baseDelay: 1000, maxDelay: 1500, sleep: async (ms) => { sleeps.push(ms); } }); } catch (e) {}
assert(JSON.stringify(sleeps) === '[1000,1500,1500]', 'got ' + JSON.stringify(sleeps));` },
    { name: "retry_after_header_wins", code: `const sleeps = []; let calls = 0;
const limited = { ok: false, status: 429, headers: { get: (k) => (k.toLowerCase() === 'retry-after' ? '2' : null) } };
const good = { ok: true, status: 200, headers: { get: () => null } };
await fetchWithRetry(async () => (++calls === 1 ? limited : good), '/a', { baseDelay: 100, sleep: async (ms) => { sleeps.push(ms); } });
assert(JSON.stringify(sleeps) === '[2000]', 'got ' + JSON.stringify(sleeps));` },
    { name: "retries_zero_means_one_attempt", code: `let calls = 0;
let err = null;
try { await fetchWithRetry(async () => { calls++; return { ok: false, status: 500, headers: { get: () => null } }; }, '/a', { retries: 0, sleep: async () => {} }); } catch (e) { err = e; }
assert(calls === 1 && err, 'single attempt then throw');` },
    { name: "passes_the_signal_to_fetch", code: `const signal = { aborted: false }; let seen;
await fetchWithRetry(async (url, init) => { seen = init; return { ok: true, status: 200, headers: { get: () => null } }; }, '/a', { signal });
assert(seen && seen.signal === signal, 'signal forwarded');` },
    { name: "abort_before_first_attempt", code: `let calls = 0; let err = null;
try { await fetchWithRetry(async () => { calls++; return {}; }, '/a', { signal: { aborted: true } }); } catch (e) { err = e; }
assert(calls === 0, 'fetch never called');
assert(err && err.name === 'AbortError', 'AbortError');` },
    { name: "abort_during_backoff_stops_retrying", code: `const signal = { aborted: false }; let calls = 0; let err = null;
const bad = { ok: false, status: 500, headers: { get: () => null } };
try {
  await fetchWithRetry(async () => { calls++; return bad; }, '/a', { signal, retries: 5, sleep: async () => { signal.aborted = true; } });
} catch (e) { err = e; }
assert(calls === 1, 'no attempt after the abort, calls=' + calls);
assert(err && err.name === 'AbortError', 'AbortError, got ' + (err && err.name));` },
    { name: "abort_while_fetch_is_in_flight", code: `const signal = { aborted: false }; let calls = 0; let err = null;
try {
  await fetchWithRetry(async () => { calls++; signal.aborted = true; throw new Error('network aborted'); }, '/a', { signal, retries: 5, sleep: async () => {} });
} catch (e) { err = e; }
assert(calls === 1 && err && err.name === 'AbortError', 'aborted fetch is not retried; calls=' + calls);` },
  ],
  solution: {
    code: `async function fetchWithRetry(fetchFn, url, options = {}) {
  const { retries = 3, baseDelay = 100, maxDelay = 2000, signal } = options;
  const sleep = options.sleep ?? (() => Promise.resolve());
  const abortError = () => {
    const e = new Error('Aborted');
    e.name = 'AbortError';
    return e;
  };

  let lastResponse = null;
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (signal && signal.aborted) throw abortError();

    let res = null;
    try {
      res = await fetchFn(url, { signal });
      lastError = null;
    } catch (err) {
      if (signal && signal.aborted) throw abortError();
      lastError = err;
      lastResponse = null;
    }

    if (res) {
      if (res.ok) return res;
      if (!(res.status === 429 || res.status >= 500)) return res;
      lastResponse = res;
    }

    if (attempt === retries) break;
    let delay = Math.min(maxDelay, baseDelay * 2 ** attempt);
    const retryAfter = res && res.headers && res.headers.get && res.headers.get('retry-after');
    if (retryAfter != null && retryAfter !== '' && !Number.isNaN(Number(retryAfter))) {
      delay = Number(retryAfter) * 1000;
    }
    await sleep(delay);
  }

  const error = new Error('Request failed after ' + (retries + 1) + ' attempts');
  error.attempts = retries + 1;
  if (lastResponse) error.response = lastResponse;
  else error.cause = lastError;
  throw error;
}

module.exports = fetchWithRetry;`,
    explanation:
      "Fetch distinguishes 'could not talk to the server' (a throw) from 'the server answered badly' (a normal response), so the loop handles both and decides retryability from the status. Checking the abort flag at the top of every iteration covers both 'cancelled before starting' and 'cancelled while sleeping' with one line. Exponential backoff spreads load on a struggling server, and Retry-After lets the server override the guess.",
  },
};
