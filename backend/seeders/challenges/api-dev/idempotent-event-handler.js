export default {
  slug: "idempotent-event-handler",
  trackId: "api-dev",
  layerId: "api-dev-9",
  type: "CODE",
  difficulty: "med",
  title: "Idempotent webhook handler",
  summary: "Process each event id only once, even if the sender retries or delivers it twice at the same time.",
  description:
    "Webhooks and queues deliver 'at least once', so the same event can arrive twice. A handler that charges a card or sends an email twice is a bug; deduplicating by event id makes it idempotent.",
  task:
    "Write <code>createIdempotentHandler(handler, { ttlMs, now })</code> returning <code>handle(event)</code>. Events have a unique <code>id</code>.",
  constraints: [
    "The first call for an id runs <code>handler(event)</code> and returns its promise.",
    "Later calls with the same id (while in flight OR after success) return the same result without calling <code>handler</code> again.",
    "If the handler fails, forget the id so a retry runs the handler again.",
    "Remembered ids expire after <code>ttlMs</code> (default 24 hours): once <code>now() &gt;= expiresAt</code> the event may be processed again.",
    "Different ids are independent.",
  ],
  example: `const handle = createIdempotentHandler(async (e) => charge(e)); await Promise.all([handle({ id: 'evt_1' }), handle({ id: 'evt_1' })]); // charged once`,
  tags: ["webhooks","idempotency","queues"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createIdempotentHandler.js",
      lang: "js",
      code: `// createIdempotentHandler.js
function createIdempotentHandler(handler, options = {}) {
  // your code here
}

module.exports = createIdempotentHandler;`,
    },
  ],
  testFile: {
    name: "createIdempotentHandler_test.js",
    lang: "test",
    code: `const createIdempotentHandler = require('./createIdempotentHandler');

test('runs_once', () => {
  let n = 0; const h = createIdempotentHandler(async () => { n++; return 'ok'; }); return Promise.all([h({ id: 1 }), h({ id: 1 })]).then(() => expect(n).toBe(1));
});

test('different_ids', () => {
  let n = 0; const h = createIdempotentHandler(async () => { n++; }); return Promise.all([h({ id: 1 }), h({ id: 2 })]).then(() => expect(n).toBe(2));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Store the promise (not the result) in a Map keyed by event id; that covers both the in-flight and the already-finished case." },
    { order: 2, cost: 5, text: "Attach a <code>.catch</code> that deletes the entry, but only if the stored promise is still the one that failed." },
    { order: 3, cost: 15, text: "Store <code>expiresAt: now() + ttlMs</code> next to the promise and ignore entries that have expired." },
  ],
  hiddenTests: [
    { name: "first_call_runs_handler", code: `let n = 0; const h = createIdempotentHandler(async (e) => { n++; return 'done:' + e.id; });
const r = await h({ id: 'a' });
assert(n === 1 && r === 'done:a', 'ran and returned');` },
    { name: "duplicate_after_success_is_skipped", code: `let n = 0; const h = createIdempotentHandler(async () => { n++; return 'result'; });
await h({ id: 'a' });
const r = await h({ id: 'a' });
assert(n === 1, 'handler ran once, ran ' + n);
assert(r === 'result', 'duplicate gets the original result');` },
    { name: "concurrent_duplicates_share_one_run", code: `let n = 0; const h = createIdempotentHandler(() => new Promise((r) => setTimeout(() => { n++; r('x'); }, 10)));
const results = await Promise.all([h({ id: 'a' }), h({ id: 'a' }), h({ id: 'a' })]);
assert(n === 1, 'one run for three simultaneous deliveries, ran ' + n);
assert(results.join('') === 'xxx', 'all get the result');` },
    { name: "different_ids_independent", code: `let n = 0; const h = createIdempotentHandler(async () => { n++; });
await h({ id: 'a' }); await h({ id: 'b' });
assert(n === 2, 'two ids, two runs');` },
    { name: "failure_allows_retry", code: `let n = 0; const h = createIdempotentHandler(async () => { n++; if (n === 1) throw new Error('boom'); return 'ok'; });
let err = null;
try { await h({ id: 'a' }); } catch (e) { err = e; }
assert(err && err.message === 'boom', 'first call rejects');
const r = await h({ id: 'a' });
assert(r === 'ok' && n === 2, 'retry runs the handler again');` },
    { name: "concurrent_failure_shared_then_retry", code: `let n = 0; const h = createIdempotentHandler(() => new Promise((_, rej) => setTimeout(() => { n++; rej(new Error('x')); }, 5)));
const results = await Promise.allSettled([h({ id: 'a' }), h({ id: 'a' })]);
assert(n === 1 && results.every((r) => r.status === 'rejected'), 'both callers see one failure');` },
    { name: "expires_after_ttl", code: `let t = 0; let n = 0; const h = createIdempotentHandler(async () => { n++; }, { ttlMs: 1000, now: () => t });
await h({ id: 'a' });
t = 999; await h({ id: 'a' });
assert(n === 1, 'still remembered');
t = 1000; await h({ id: 'a' });
assert(n === 2, 'expired, processed again');` },
  ],
  solution: {
    code: `function createIdempotentHandler(handler, { ttlMs = 24 * 60 * 60 * 1000, now = () => Date.now() } = {}) {
  const seen = new Map();
  return function handle(event) {
    const hit = seen.get(event.id);
    if (hit && hit.expiresAt > now()) return hit.promise;
    const promise = Promise.resolve().then(() => handler(event));
    seen.set(event.id, { promise, expiresAt: now() + ttlMs });
    promise.catch(() => {
      const current = seen.get(event.id);
      if (current && current.promise === promise) seen.delete(event.id);
    });
    return promise;
  };
}

module.exports = createIdempotentHandler;`,
    explanation:
      "Caching the promise rather than the result handles simultaneous duplicates for free. Failures are removed so the sender's retry can succeed, but only if a newer attempt hasn't replaced the entry.",
  },
};
