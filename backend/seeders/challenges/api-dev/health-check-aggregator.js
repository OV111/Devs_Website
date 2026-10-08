export default {
  slug: "health-check-aggregator",
  trackId: "api-dev",
  layerId: "api-dev-10",
  type: "CODE",
  difficulty: "hard",
  title: "Health check endpoint logic",
  summary: "Run dependency checks in parallel with a timeout and decide ok, degraded or down.",
  description:
    "Load balancers and Kubernetes call <code>/health</code> to decide whether to send traffic. A good health check runs the checks in parallel, never hangs, and distinguishes 'down' from 'degraded'.",
  task:
    "Write <code>runHealthChecks(checks, { timeoutMs = 1000 })</code> (async). <code>checks</code> maps a name to <code>{ fn, critical }</code>, where <code>fn</code> is an async function (resolve = healthy, reject = unhealthy) and <code>critical</code> defaults to true. Return <code>{ status, httpStatus, checks }</code>.",
  constraints: [
    "All checks start at the same time (in parallel).",
    "A check that takes longer than <code>timeoutMs</code> counts as down with <code>error: 'timeout'</code>; a rejection is down with <code>error</code> set to the error's message.",
    "<code>checks[name]</code> is <code>{ status: 'up' }</code> or <code>{ status: 'down', error }</code>.",
    "Overall <code>status</code>: <code>'down'</code> if any critical check is down; else <code>'degraded'</code> if any non-critical check is down; else <code>'ok'</code>.",
    "<code>httpStatus</code> is 503 for 'down' and 200 otherwise. No checks means 'ok'. Clear the timeout timers when a check finishes.",
  ],
  example: `await runHealthChecks({ db: { fn: pingDb }, cache: { fn: pingRedis, critical: false } }) // { status: 'degraded', httpStatus: 200, ... }`,
  tags: ["production","kubernetes","observability","async"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "runHealthChecks.js",
      lang: "js",
      code: `// runHealthChecks.js
function runHealthChecks(checks, options = {}) {
  // your code here
}

module.exports = runHealthChecks;`,
    },
  ],
  testFile: {
    name: "runHealthChecks_test.js",
    lang: "test",
    code: `const runHealthChecks = require('./runHealthChecks');

test('all_up', () => {
  return runHealthChecks({ db: { fn: async () => {} } }).then((r) => { expect(r.status).toBe('ok'); expect(r.httpStatus).toBe(200); });
});

test('critical_down', () => {
  return runHealthChecks({ db: { fn: async () => { throw new Error('x'); } } }).then((r) => expect(r.httpStatus).toBe(503));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Wrap each check in <code>Promise.race([check, timeoutPromise])</code> and run them all with <code>Promise.all</code> over <code>Object.entries(checks)</code>." },
    { order: 2, cost: 5, text: "Make each wrapper catch its own error and return a result object, so one failure never rejects the whole <code>Promise.all</code>." },
    { order: 3, cost: 15, text: "Clear the timer in a <code>finally</code> block so a fast check doesn't leave a timer keeping the process alive." },
  ],
  hiddenTests: [
    { name: "all_healthy", code: `const r = await runHealthChecks({ db: { fn: async () => {} }, redis: { fn: async () => {} } });
assert(r.status === 'ok' && r.httpStatus === 200, 'ok');
assert(r.checks.db.status === 'up' && r.checks.redis.status === 'up', 'both up');` },
    { name: "no_checks", code: `const r = await runHealthChecks({});
assert(r.status === 'ok' && r.httpStatus === 200, 'nothing to fail');` },
    { name: "critical_failure_is_down", code: `const r = await runHealthChecks({ db: { fn: async () => { throw new Error('conn refused'); } }, redis: { fn: async () => {} } });
assert(r.status === 'down' && r.httpStatus === 503, 'down and 503');
assert(r.checks.db.status === 'down' && r.checks.db.error === 'conn refused', 'error message');
assert(r.checks.redis.status === 'up', 'others still reported');` },
    { name: "non_critical_failure_is_degraded", code: `const r = await runHealthChecks({ db: { fn: async () => {} }, cache: { fn: async () => { throw new Error('x'); }, critical: false } });
assert(r.status === 'degraded' && r.httpStatus === 200, 'degraded but still serving');` },
    { name: "critical_beats_noncritical", code: `const r = await runHealthChecks({ a: { fn: async () => { throw new Error('a'); } }, b: { fn: async () => { throw new Error('b'); }, critical: false } });
assert(r.status === 'down', 'any critical failure means down');` },
    { name: "timeout", code: `const r = await runHealthChecks({ slow: { fn: () => new Promise(() => {}) } }, { timeoutMs: 20 });
assert(r.status === 'down', 'hung check is down');
assert(r.checks.slow.error === 'timeout', 'timeout error, got ' + r.checks.slow.error);` },
    { name: "checks_run_in_parallel", code: `let startedB; const bStarted = new Promise((r) => { startedB = r; });
const r = await runHealthChecks({
  a: { fn: async () => { await bStarted; } },
  b: { fn: async () => { startedB(); } },
}, { timeoutMs: 500 });
assert(r.status === 'ok', 'check a can only finish if b started while a was still running');` },
    { name: "sync_throw_is_handled", code: `const r = await runHealthChecks({ x: { fn: () => { throw new Error('sync boom'); } } });
assert(r.checks.x.status === 'down' && r.checks.x.error === 'sync boom', 'sync throw becomes down');` },
  ],
  solution: {
    code: `async function runHealthChecks(checks, { timeoutMs = 1000 } = {}) {
  const entries = await Promise.all(
    Object.entries(checks).map(async ([name, check]) => {
      let timer;
      try {
        await Promise.race([
          Promise.resolve().then(check.fn),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
          }),
        ]);
        return [name, { status: 'up' }];
      } catch (err) {
        return [name, { status: 'down', error: (err && err.message) || String(err) }];
      } finally {
        clearTimeout(timer);
      }
    }),
  );
  const down = entries.filter(([, r]) => r.status === 'down');
  const criticalDown = down.some(([name]) => checks[name].critical !== false);
  const status = criticalDown ? 'down' : down.length > 0 ? 'degraded' : 'ok';
  return {
    status,
    httpStatus: status === 'down' ? 503 : 200,
    checks: Object.fromEntries(entries),
  };
}

module.exports = runHealthChecks;`,
    explanation:
      "Each check catches its own failure, so Promise.all never rejects, and the race against a timer means one hung dependency can't hang the endpoint. Degraded vs down lets you keep serving when only a cache is unhealthy.",
  },
};
