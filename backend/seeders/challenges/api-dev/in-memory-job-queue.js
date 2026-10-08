export default {
  slug: "in-memory-job-queue",
  trackId: "api-dev",
  layerId: "api-dev-9",
  type: "CODE",
  difficulty: "hard",
  title: "Job queue with retries and a dead-letter list",
  summary: "Process jobs with limited concurrency, retry failures, and park jobs that keep failing.",
  description:
    "BullMQ and other queue libraries all provide the same three guarantees: bounded concurrency, retries, and a dead-letter store for jobs that can't succeed. Build a small one to see how they fit together.",
  task:
    "Write <code>createQueue({ handler, concurrency = 1, maxAttempts = 3 })</code> returning <code>{ add(job), drain(), deadLetter, stats() }</code>.",
  constraints: [
    "<code>add(job)</code> queues a job; jobs start in FIFO order, never more than <code>concurrency</code> at a time.",
    "<code>handler(job, attempt)</code> is async; <code>attempt</code> starts at 1. If it throws, retry immediately until <code>maxAttempts</code> attempts have been made.",
    "A job that fails every attempt goes to <code>deadLetter</code> as <code>{ job, error, attempts }</code> (the last error).",
    "<code>drain()</code> returns a promise that resolves when nothing is queued or running (immediately if already idle).",
    "<code>stats()</code> returns <code>{ completed, failed, pending, active }</code>; <code>failed</code> is the dead-letter count. One failing job must not block the others.",
  ],
  example: `const q = createQueue({ handler: async (job) => send(job), concurrency: 2 }); q.add({ to: 'a' }); await q.drain();`,
  tags: ["queues","bullmq","async","resilience"],
  estimatedMins: 45,
  xp: 70,
  starterFiles: [
    {
      name: "createQueue.js",
      lang: "js",
      code: `// createQueue.js
function createQueue(options) {
  // your code here
}

module.exports = createQueue;`,
    },
  ],
  testFile: {
    name: "createQueue_test.js",
    lang: "test",
    code: `const createQueue = require('./createQueue');

test('processes_all', () => {
  const done = []; const q = createQueue({ handler: async (j) => { done.push(j); } }); q.add(1); q.add(2); return q.drain().then(() => expect(done).toEqual([1, 2]));
});

test('dead_letter', () => {
  const q = createQueue({ handler: async () => { throw new Error('x'); }, maxAttempts: 2 }); q.add('j'); return q.drain().then(() => expect(q.deadLetter.length).toBe(1));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>pending</code> array, an <code>active</code> counter, and a <code>pump()</code> function that starts jobs while <code>active &lt; concurrency</code>." },
    { order: 2, cost: 5, text: "Run each job in an async function with a retry loop; when it finishes (either way) decrement <code>active</code> and call <code>pump()</code> again." },
    { order: 3, cost: 15, text: "<code>drain()</code> should register a waiter that is resolved whenever <code>active === 0</code> and <code>pending</code> is empty." },
  ],
  hiddenTests: [
    { name: "processes_in_order", code: `const done = []; const q = createQueue({ handler: async (j) => { done.push(j); } });
q.add('a'); q.add('b'); q.add('c');
await q.drain();
assert(done.join('') === 'abc', 'FIFO: ' + done);` },
    { name: "drain_when_idle", code: `const q = createQueue({ handler: async () => {} });
await q.drain();
assert(true, 'resolves immediately');` },
    { name: "retries_then_succeeds", code: `const attempts = []; const q = createQueue({ maxAttempts: 3, handler: async (job, attempt) => { attempts.push(attempt); if (attempt < 3) throw new Error('flaky'); } });
q.add('j');
await q.drain();
assert(attempts.join(',') === '1,2,3', 'attempt numbers: ' + attempts);
assert(q.stats().completed === 1 && q.deadLetter.length === 0, 'succeeded');` },
    { name: "dead_letter_after_max_attempts", code: `let calls = 0; const q = createQueue({ maxAttempts: 3, handler: async () => { calls++; throw new Error('e' + calls); } });
q.add({ id: 1 });
await q.drain();
assert(calls === 3, 'three attempts');
assert(q.deadLetter.length === 1, 'one dead letter');
const d = q.deadLetter[0];
assert(d.job.id === 1 && d.attempts === 3 && d.error.message === 'e3', 'entry shape and last error');` },
    { name: "failure_does_not_block_others", code: `const done = []; const q = createQueue({ maxAttempts: 1, handler: async (j) => { if (j === 'bad') throw new Error('x'); done.push(j); } });
q.add('a'); q.add('bad'); q.add('c');
await q.drain();
assert(done.join('') === 'ac', 'others complete');
assert(q.stats().failed === 1 && q.stats().completed === 2, 'stats');` },
    { name: "respects_concurrency", code: `let running = 0; let max = 0;
const q = createQueue({ concurrency: 2, handler: async () => { running++; max = Math.max(max, running); await new Promise((r) => setTimeout(r, 5)); running--; } });
for (let i = 0; i < 6; i++) q.add(i);
await q.drain();
assert(max === 2, 'max concurrent was ' + max);
assert(q.stats().completed === 6, 'all done');` },
    { name: "default_concurrency_is_one", code: `let running = 0; let max = 0;
const q = createQueue({ handler: async () => { running++; max = Math.max(max, running); await new Promise((r) => setTimeout(r, 2)); running--; } });
q.add(1); q.add(2); q.add(3);
await q.drain();
assert(max === 1, 'serial by default: ' + max);` },
    { name: "stats_midway", code: `let release; const gate = new Promise((r) => { release = r; });
const q = createQueue({ concurrency: 1, handler: async () => { await gate; } });
q.add(1); q.add(2); q.add(3);
const s = q.stats();
assert(s.active === 1 && s.pending === 2 && s.completed === 0, 'one running, two waiting: ' + JSON.stringify(s));
release(); await q.drain();
assert(q.stats().completed === 3 && q.stats().pending === 0 && q.stats().active === 0, 'finished');` },
  ],
  solution: {
    code: `function createQueue({ handler, concurrency = 1, maxAttempts = 3 }) {
  const pending = [];
  const deadLetter = [];
  let active = 0;
  let completed = 0;
  let waiters = [];

  function checkIdle() {
    if (active === 0 && pending.length === 0) {
      waiters.forEach((resolve) => resolve());
      waiters = [];
    }
  }

  async function run(item) {
    active++;
    try {
      for (;;) {
        item.attempts++;
        try {
          await handler(item.job, item.attempts);
          completed++;
          break;
        } catch (error) {
          if (item.attempts >= maxAttempts) {
            deadLetter.push({ job: item.job, error, attempts: item.attempts });
            break;
          }
        }
      }
    } finally {
      active--;
      pump();
      checkIdle();
    }
  }

  function pump() {
    while (active < concurrency && pending.length > 0) run(pending.shift());
  }

  return {
    add(job) {
      pending.push({ job, attempts: 0 });
      pump();
    },
    drain() {
      return new Promise((resolve) => {
        waiters.push(resolve);
        checkIdle();
      });
    },
    deadLetter,
    stats() {
      return { completed, failed: deadLetter.length, pending: pending.length, active };
    },
  };
}

module.exports = createQueue;`,
    explanation:
      "pump() starts jobs while there is capacity; each finished job frees a slot and pumps again. The retry loop gives each job its attempts, and exhausting them moves it to the dead-letter list instead of losing it.",
  },
};
