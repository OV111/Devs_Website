export default {
  slug: "semaphore",
  trackId: "node-dev",
  layerId: "node-dev-9",
  type: "CODE",
  difficulty: "med",
  title: "Semaphore and mutex",
  summary: "Limit concurrency with a FIFO semaphore: acquire, tryAcquire, weighted permits, run() with automatic release, and a mutex as max = 1.",
  description:
    "A semaphore caps how many tasks use a resource at once: database connections, outbound requests, CPU-heavy jobs. With <code>max = 1</code> it's a mutex, which prevents two async read-modify-write sequences from interleaving. Fairness (FIFO) and always releasing in <code>finally</code> are what make it safe.",
  task:
    "Write <code>createSemaphore(max)</code> returning <code>{ acquire, tryAcquire, run, stats }</code>. A non-integer or <code>max &lt; 1</code> throws <code>RangeError('max must be a positive integer')</code>.",
  constraints: [
    "<code>acquire(weight = 1)</code> returns a promise of a <code>release</code> function once <code>weight</code> permits are free. A weight that isn't an integer between 1 and <code>max</code> throws <code>RangeError('weight must be an integer between 1 and ' + max)</code> synchronously.",
    "Waiters are served strictly in FIFO order: a large request at the head of the queue blocks smaller ones behind it until it can run (this prevents starvation).",
    "<code>release()</code> returns the permits and serves waiters; calling it again does nothing.",
    "<code>tryAcquire(weight = 1)</code> returns a release function immediately if the permits are free AND nobody is waiting, otherwise <code>null</code> (it never queues).",
    "<code>run(fn, weight = 1)</code> acquires, awaits <code>fn()</code>, releases in a <code>finally</code> (even if <code>fn</code> throws) and returns its result. <code>stats()</code> returns <code>{ max, available, inUse, waiting }</code>.",
  ],
  example: `const sem = createSemaphore(5); await sem.run(() => fetch(url)); // never more than 5 at once`,
  tags: ["concurrency","async","semaphore","mutex"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "createSemaphore.js",
      lang: "js",
      code: `// createSemaphore.js
function createSemaphore(max) {
  // your code here
}

module.exports = createSemaphore;`,
    },
  ],
  testFile: {
    name: "createSemaphore_test.js",
    lang: "test",
    code: `const createSemaphore = require('./createSemaphore');

test('mutex', () => {
  const m = createSemaphore(1); return m.acquire().then((release) => { expect(m.tryAcquire()).toBe(null); release(); expect(typeof m.tryAcquire()).toBe('function'); });
});

test('invalid', () => {
  expect(() => createSemaphore(0)).toThrow();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>available</code> (starts at <code>max</code>) and a <code>queue</code> of <code>{ weight, resolve }</code>; a <code>pump()</code> function serves the head of the queue while <code>queue[0].weight &lt;= available</code>." },
    { order: 2, cost: 5, text: "<code>makeRelease(weight)</code> returns a function with its own <code>released</code> flag, so a second call is a no-op." },
    { order: 3, cost: 15, text: "<code>run</code> must refer to the returned object's <code>acquire</code> via a variable (not <code>this</code>), so destructured methods keep working." },
  ],
  hiddenTests: [
    { name: "constructor_validation", code: `for (const bad of [0, -1, 1.5, '2', undefined, NaN, Infinity]) {
  let err = null;
  try { createSemaphore(bad); } catch (e) { err = e; }
  assert(err instanceof RangeError && err.message === 'max must be a positive integer', String(bad) + ' -> ' + (err && err.message));
}
assert(createSemaphore(1) && createSemaphore(100), 'valid sizes');` },
    { name: "acquire_and_release_basics", code: `const s = createSemaphore(2);
const r1 = await s.acquire(); const r2 = await s.acquire();
assert(typeof r1 === 'function' && s.stats().available === 0 && s.stats().inUse === 2, 'both permits taken: ' + JSON.stringify(s.stats()));
r1();
assert(s.stats().available === 1, 'released');
r2();
assert(s.stats().available === 2 && s.stats().inUse === 0, 'all back');` },
    { name: "waiters_are_served_fifo", code: `const s = createSemaphore(1);
const first = await s.acquire();
const order = [];
const a = s.acquire().then((r) => { order.push('a'); return r; });
const b = s.acquire().then((r) => { order.push('b'); return r; });
const c = s.acquire().then((r) => { order.push('c'); return r; });
assert(s.stats().waiting === 3, 'three queued');
first();
(await a)();
(await b)();
(await c)();
assert(order.join('') === 'abc', 'order: ' + order.join(''));` },
    { name: "limits_concurrency", code: `const s = createSemaphore(3);
let running = 0; let max = 0;
await Promise.all(Array.from({ length: 10 }, () => s.run(async () => {
  running++; max = Math.max(max, running);
  await new Promise((r) => setTimeout(r, 3));
  running--;
})));
assert(max === 3, 'never more than 3 at once, saw ' + max);
assert(s.stats().available === 3 && s.stats().waiting === 0, 'all done');` },
    { name: "mutex_prevents_interleaved_read_modify_write", code: `const mutex = createSemaphore(1);
let balance = 100;
const withdraw = (n) => mutex.run(async () => {
  const current = balance;
  await new Promise((r) => setTimeout(r, 2));
  balance = current - n;
});
await Promise.all([withdraw(10), withdraw(20), withdraw(30)]);
assert(balance === 40, 'no lost updates, got ' + balance);
let racy = 100;
const racyWithdraw = async (n) => { const c = racy; await new Promise((r) => setTimeout(r, 2)); racy = c - n; };
await Promise.all([racyWithdraw(10), racyWithdraw(20), racyWithdraw(30)]);
assert(racy !== 40, 'without the lock the updates are lost (that is the bug)');` },
    { name: "release_is_idempotent", code: `const s = createSemaphore(1);
const release = await s.acquire();
const waiting = s.acquire();
release(); release(); release();
const r2 = await waiting;
assert(s.stats().inUse === 1, 'a repeated release must not hand out extra permits: ' + JSON.stringify(s.stats()));
assert(s.tryAcquire() === null, 'still held by the second holder');
r2();
assert(s.stats().available === 1, 'back to one');` },
    { name: "run_returns_results_and_releases_on_errors", code: `const s = createSemaphore(1);
assert(await s.run(async () => 'value') === 'value' && await s.run(() => 5) === 5, 'results (sync and async functions)');
let err = null;
try { await s.run(async () => { throw new Error('task failed'); }); } catch (e) { err = e; }
assert(err && err.message === 'task failed', 'the error propagates');
assert(s.stats().available === 1, 'the permit was released');
let syncErr = null;
try { await s.run(() => { throw new Error('sync'); }); } catch (e) { syncErr = e; }
assert(syncErr && syncErr.message === 'sync' && s.stats().available === 1, 'sync throws too');` },
    { name: "try_acquire", code: `const s = createSemaphore(2);
const a = s.tryAcquire(); const b = s.tryAcquire();
assert(typeof a === 'function' && typeof b === 'function', 'two permits');
assert(s.tryAcquire() === null, 'none left, and it never queues: ' + s.stats().waiting);
a();
assert(typeof s.tryAcquire() === 'function', 'available again');
b();` },
    { name: "try_acquire_does_not_jump_the_queue", code: `const s = createSemaphore(2);
const hold = await s.acquire(2);
const waiter = s.acquire(1);
hold();
const r = await waiter;
assert(s.stats().inUse === 1, 'waiter holds one permit');
const small = createSemaphore(2);
const h = await small.acquire(2);
const big = small.acquire(2);
h();
assert(small.tryAcquire() === null, 'a queued waiter already owns the freed permits');
(await big)();` },
    { name: "weighted_permits", code: `const s = createSemaphore(5);
const r3 = await s.acquire(3);
assert(s.stats().available === 2, 'weight 3 uses three');
assert(typeof s.tryAcquire(2) === 'function', 'two more fit');
assert(s.tryAcquire(1) === null, 'full now');
r3();
assert(s.stats().available === 3, 'weight returned');` },
    { name: "head_of_line_blocking_prevents_starvation", code: `const s = createSemaphore(3);
const hold = await s.acquire(2);
const order = [];
const big = s.acquire(3).then((r) => { order.push('big'); return r; });
const small = s.acquire(1).then((r) => { order.push('small'); return r; });
await new Promise((r) => setTimeout(r, 5));
assert(order.length === 0, 'the small one must NOT overtake the big waiter even though a permit is free: ' + order);
assert(s.stats().waiting === 2 && s.stats().available === 1, JSON.stringify(s.stats()));
hold();
const bigRelease = await big;
assert(order.join() === 'big', 'big first');
bigRelease();
(await small)();
assert(order.join() === 'big,small', 'then small');` },
    { name: "invalid_weights_throw_synchronously", code: `const s = createSemaphore(3);
for (const bad of [0, -1, 1.5, 4, '1', NaN]) {
  let err = null;
  try { s.acquire(bad); } catch (e) { err = e; }
  assert(err instanceof RangeError && err.message === 'weight must be an integer between 1 and 3', 'acquire(' + String(bad) + ') -> ' + (err && err.message));
}
let err2 = null;
try { s.tryAcquire(4); } catch (e) { err2 = e; }
assert(err2 instanceof RangeError, 'tryAcquire validates too');
assert(s.stats().available === 3, 'nothing was consumed');` },
    { name: "stats_shape", code: `const s = createSemaphore(2);
assert(JSON.stringify(s.stats()) === '{"max":2,"available":2,"inUse":0,"waiting":0}', JSON.stringify(s.stats()));
const a = await s.acquire(); await s.acquire();
const w = s.acquire();
assert(JSON.stringify(s.stats()) === '{"max":2,"available":0,"inUse":2,"waiting":1}', JSON.stringify(s.stats()));
a();
await w;
assert(s.stats().waiting === 0, 'served');` },
    { name: "methods_work_when_destructured", code: `const { acquire, run, stats } = createSemaphore(1);
const release = await acquire();
release();
assert(await run(async () => 'ok') === 'ok' && stats().available === 1, 'no this binding is needed');` },
  ],
  solution: {
    code: `function createSemaphore(max) {
  if (!Number.isInteger(max) || max < 1) throw new RangeError('max must be a positive integer');
  let available = max;
  const queue = [];

  function check(weight) {
    if (!Number.isInteger(weight) || weight < 1 || weight > max) {
      throw new RangeError('weight must be an integer between 1 and ' + max);
    }
  }

  function makeRelease(weight) {
    let released = false;
    return () => {
      if (released) return;
      released = true;
      available += weight;
      pump();
    };
  }

  function pump() {
    while (queue.length > 0 && queue[0].weight <= available) {
      const { weight, resolve } = queue.shift();
      available -= weight;
      resolve(makeRelease(weight));
    }
  }

  const semaphore = {
    acquire(weight = 1) {
      check(weight);
      return new Promise((resolve) => {
        queue.push({ weight, resolve });
        pump();
      });
    },
    tryAcquire(weight = 1) {
      check(weight);
      if (queue.length === 0 && weight <= available) {
        available -= weight;
        return makeRelease(weight);
      }
      return null;
    },
    async run(fn, weight = 1) {
      const release = await semaphore.acquire(weight);
      try {
        return await fn();
      } finally {
        release();
      }
    },
    stats() {
      return { max, available, inUse: max - available, waiting: queue.length };
    },
  };
  return semaphore;
}

module.exports = createSemaphore;`,
    explanation:
      "Permits are just a counter and a FIFO queue. Serving only the head of the queue gives fairness (a big request can't be starved by a stream of small ones), and the once-only release function is what keeps a double release from creating permits out of thin air.",
  },
};
