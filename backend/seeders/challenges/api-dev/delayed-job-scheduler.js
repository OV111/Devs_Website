export default {
  slug: "delayed-job-scheduler",
  trackId: "api-dev",
  layerId: "api-dev-9",
  type: "CODE",
  difficulty: "med",
  title: "Delayed job scheduler",
  summary: "Hold jobs until their run time, hand back the due ones in order, and report how long to sleep.",
  description:
    "Delayed jobs ('send this email in 10 minutes') are stored with a run-at time. A worker repeatedly asks 'what's due now?' and 'how long until the next one?'. BullMQ does this with a sorted set in Redis.",
  task:
    "Write <code>createScheduler({ now })</code> returning <code>{ schedule(runAt, payload), cancel(id), popDue(), nextDelay(), size() }</code>.",
  constraints: [
    "<code>schedule</code> returns a unique numeric id.",
    "<code>popDue()</code> removes and returns the payloads of all jobs with <code>runAt &lt;= now()</code>, ordered by <code>runAt</code>, ties by scheduling order.",
    "<code>nextDelay()</code> returns the milliseconds until the earliest job (never negative), or <code>null</code> if empty.",
    "<code>cancel(id)</code> returns true if a job was removed, false otherwise.",
    "<code>size()</code> is the number of scheduled jobs.",
  ],
  example: `const s = createScheduler(); s.schedule(Date.now() + 5000, { to: 'a' }); s.nextDelay(); // ~5000`,
  tags: ["queues","scheduling","bullmq"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createScheduler.js",
      lang: "js",
      code: `// createScheduler.js
function createScheduler(options = {}) {
  // your code here
}

module.exports = createScheduler;`,
    },
  ],
  testFile: {
    name: "createScheduler_test.js",
    lang: "test",
    code: `const createScheduler = require('./createScheduler');

test('pops_due', () => {
  let t = 0; const s = createScheduler({ now: () => t }); s.schedule(10, 'a'); t = 10; expect(s.popDue()).toEqual(['a']);
});

test('empty_delay', () => {
  expect(createScheduler().nextDelay()).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep an array of <code>{ id, runAt, payload }</code> and re-sort it on insert by <code>runAt</code>, then by <code>id</code>." },
    { order: 2, cost: 5, text: "<code>popDue</code>: split the array into due and not-due with <code>filter</code>." },
    { order: 3, cost: 15, text: "A min-heap makes inserts O(log n); a sorted array is fine to start with, and you should know why real systems use a sorted set or heap." },
  ],
  hiddenTests: [
    { name: "ids_are_unique", code: `const s = createScheduler({ now: () => 0 });
const a = s.schedule(10, 'a'); const b = s.schedule(10, 'b');
assert(typeof a === 'number' && a !== b, 'unique numeric ids');` },
    { name: "pop_due_returns_only_due", code: `let t = 0; const s = createScheduler({ now: () => t });
s.schedule(100, 'later'); s.schedule(10, 'soon');
t = 50;
const due = s.popDue();
assert(due.length === 1 && due[0] === 'soon', 'only the due job');
assert(s.size() === 1, 'later one remains');` },
    { name: "due_is_inclusive", code: `let t = 10; const s = createScheduler({ now: () => t });
s.schedule(10, 'a');
assert(s.popDue().length === 1, 'runAt equal to now is due');` },
    { name: "ordered_by_run_time_then_insertion", code: `let t = 0; const s = createScheduler({ now: () => t });
s.schedule(30, 'c'); s.schedule(10, 'a'); s.schedule(20, 'b1'); s.schedule(20, 'b2');
t = 100;
assert(s.popDue().join(',') === 'a,b1,b2,c', 'order');` },
    { name: "pop_removes_jobs", code: `let t = 10; const s = createScheduler({ now: () => t });
s.schedule(5, 'a');
s.popDue();
assert(s.popDue().length === 0 && s.size() === 0, 'second pop is empty');` },
    { name: "nextDelay", code: `let t = 0; const s = createScheduler({ now: () => t });
assert(s.nextDelay() === null, 'empty');
s.schedule(500, 'a'); s.schedule(200, 'b');
assert(s.nextDelay() === 200, 'earliest');
t = 300;
assert(s.nextDelay() === 0, 'overdue is 0, never negative');` },
    { name: "cancel", code: `let t = 0; const s = createScheduler({ now: () => t });
const id = s.schedule(10, 'a'); s.schedule(10, 'b');
assert(s.cancel(id) === true, 'removed');
assert(s.cancel(id) === false && s.cancel(999) === false, 'unknown ids');
t = 10;
assert(s.popDue().join('') === 'b', 'cancelled job does not run');` },
    { name: "jobs_scheduled_in_the_past_are_due_at_once", code: `const s = createScheduler({ now: () => 1000 });
s.schedule(5, 'old');
assert(s.popDue()[0] === 'old', 'past runAt');` },
  ],
  solution: {
    code: `function createScheduler({ now = () => Date.now() } = {}) {
  let seq = 0;
  let jobs = [];
  return {
    schedule(runAt, payload) {
      const id = ++seq;
      jobs.push({ id, runAt, payload });
      jobs.sort((a, b) => a.runAt - b.runAt || a.id - b.id);
      return id;
    },
    cancel(id) {
      const before = jobs.length;
      jobs = jobs.filter((j) => j.id !== id);
      return jobs.length !== before;
    },
    popDue() {
      const t = now();
      const due = jobs.filter((j) => j.runAt <= t);
      jobs = jobs.filter((j) => j.runAt > t);
      return due.map((j) => j.payload);
    },
    nextDelay() {
      return jobs.length ? Math.max(0, jobs[0].runAt - now()) : null;
    },
    size() {
      return jobs.length;
    },
  };
}

module.exports = createScheduler;`,
    explanation:
      "Jobs stay sorted by run time, so the earliest is always first and 'due' is a prefix. The nextDelay value is what a worker passes to setTimeout instead of polling.",
  },
};
