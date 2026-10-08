export default {
  slug: "event-loop-order",
  trackId: "node-dev",
  layerId: "node-dev-2",
  type: "CODE",
  difficulty: "hard",
  title: "Predict the Node.js event loop order",
  summary: "Given sync code, nextTick, promises, timers and setImmediate, return the order Node runs them.",
  description:
    "'What does this print?' is the classic Node interview question. The answer is a fixed set of rules: the main script, then the nextTick queue, then the promise microtask queue, then timers, then immediates, with microtasks drained after every callback.",
  task:
    "Write <code>eventLoopOrder(tasks)</code> returning the array of task ids in execution order. A task is <code>{ id, type, delay?, spawns? }</code> where <code>type</code> is <code>'sync'</code>, <code>'nextTick'</code>, <code>'promise'</code>, <code>'timeout'</code> or <code>'immediate'</code>. <code>spawns</code> is an optional list of <code>nextTick</code>/<code>promise</code> tasks that this task schedules when it runs.",
  constraints: [
    "The list describes the main script in order: <code>sync</code> tasks run immediately in that order; the others are only scheduled.",
    "After the main script, repeat until both are empty: run ALL queued nextTick tasks (including ones added meanwhile), then ALL promise tasks (including ones added meanwhile).",
    "Then the timer phase: assume every timer is due. Run timeouts ordered by <code>max(1, delay)</code> ascending (<code>delay</code> defaults to 0), ties in listing order. After EACH timer callback, drain nextTicks and promises again.",
    "Then the immediate phase: run <code>immediate</code> tasks in listing order, draining nextTicks and promises after each one.",
    "A task's <code>spawns</code> are scheduled right after the task itself runs.",
  ],
  example: `eventLoopOrder([{ id: 'T', type: 'timeout' }, { id: 'P', type: 'promise' }, { id: 'N', type: 'nextTick' }, { id: 'S', type: 'sync' }]) // ['S', 'N', 'P', 'T']`,
  tags: ["event-loop","libuv","microtasks","interview"],
  estimatedMins: 45,
  xp: 70,
  starterFiles: [
    {
      name: "eventLoopOrder.js",
      lang: "js",
      code: `// eventLoopOrder.js
function eventLoopOrder(tasks) {
  // your code here
}

module.exports = eventLoopOrder;`,
    },
  ],
  testFile: {
    name: "eventLoopOrder_test.js",
    lang: "test",
    code: `const eventLoopOrder = require('./eventLoopOrder');

test('basic_order', () => {
  const r = eventLoopOrder([{ id: 'T', type: 'timeout' }, { id: 'P', type: 'promise' }, { id: 'N', type: 'nextTick' }, { id: 'S', type: 'sync' }]); expect(r).toEqual(['S', 'N', 'P', 'T']);
});

test('immediate_last', () => {
  expect(eventLoopOrder([{ id: 'I', type: 'immediate' }, { id: 'T', type: 'timeout' }])).toEqual(['T', 'I']);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep separate arrays for the nextTick queue, promise queue, timers and immediates, plus an output array." },
    { order: 2, cost: 5, text: "Write a <code>drainMicrotasks()</code> helper: loop while either queue has items; inside, empty the whole tick queue first, then the whole promise queue (each run may add more)." },
    { order: 3, cost: 15, text: "Call <code>drainMicrotasks()</code> after the main script and again after every single timer and immediate callback. Sort the timers once, by <code>[Math.max(1, delay), index]</code>." },
  ],
  hiddenTests: [
    { name: "sync_runs_first_in_order", code: `const r = eventLoopOrder([{ id: 'a', type: 'sync' }, { id: 'x', type: 'timeout' }, { id: 'b', type: 'sync' }]);
assert(r.join(',') === 'a,b,x', 'order: ' + r);` },
    { name: "nexttick_before_promise_before_timer_before_immediate", code: `const r = eventLoopOrder([
  { id: 'imm', type: 'immediate' }, { id: 'tim', type: 'timeout' }, { id: 'pro', type: 'promise' }, { id: 'tick', type: 'nextTick' }, { id: 'syn', type: 'sync' },
]);
assert(r.join(',') === 'syn,tick,pro,tim,imm', 'order: ' + r);` },
    { name: "queues_are_fifo", code: `const r = eventLoopOrder([{ id: 't1', type: 'nextTick' }, { id: 'p1', type: 'promise' }, { id: 't2', type: 'nextTick' }, { id: 'p2', type: 'promise' }]);
assert(r.join(',') === 't1,t2,p1,p2', 'order: ' + r);` },
    { name: "timers_ordered_by_delay_then_listing", code: `const r = eventLoopOrder([{ id: 'slow', type: 'timeout', delay: 100 }, { id: 'a', type: 'timeout', delay: 10 }, { id: 'b', type: 'timeout', delay: 10 }, { id: 'zero', type: 'timeout' }]);
assert(r.join(',') === 'zero,a,b,slow', 'order: ' + r);` },
    { name: "zero_delay_equals_one", code: `const r = eventLoopOrder([{ id: 'one', type: 'timeout', delay: 1 }, { id: 'zero', type: 'timeout', delay: 0 }]);
assert(r.join(',') === 'one,zero', 'setTimeout 0 is clamped to 1, so listing order decides: ' + r);` },
    { name: "tick_spawned_by_promise_waits_for_all_promises", code: `const r = eventLoopOrder([
  { id: 'p1', type: 'promise', spawns: [{ id: 'tickFromP1', type: 'nextTick' }] },
  { id: 'p2', type: 'promise' },
]);
assert(r.join(',') === 'p1,p2,tickFromP1', 'V8 drains all promises before ticks run again: ' + r);` },
    { name: "promise_spawned_by_tick_waits_for_all_ticks", code: `const r = eventLoopOrder([
  { id: 't1', type: 'nextTick', spawns: [{ id: 'promFromT1', type: 'promise' }] },
  { id: 't2', type: 'nextTick' },
]);
assert(r.join(',') === 't1,t2,promFromT1', 'ticks drain first: ' + r);` },
    { name: "tick_spawned_by_tick_runs_before_promises", code: `const r = eventLoopOrder([
  { id: 't1', type: 'nextTick', spawns: [{ id: 't1b', type: 'nextTick' }] },
  { id: 'p', type: 'promise' },
]);
assert(r.join(',') === 't1,t1b,p', 'order: ' + r);` },
    { name: "microtasks_drain_between_timers", code: `const r = eventLoopOrder([
  { id: 'timerA', type: 'timeout', delay: 1, spawns: [{ id: 'promFromA', type: 'promise' }, { id: 'tickFromA', type: 'nextTick' }] },
  { id: 'timerB', type: 'timeout', delay: 1 },
]);
assert(r.join(',') === 'timerA,tickFromA,promFromA,timerB', 'microtasks run after each timer callback: ' + r);` },
    { name: "microtasks_drain_between_immediates", code: `const r = eventLoopOrder([
  { id: 'immA', type: 'immediate', spawns: [{ id: 'pA', type: 'promise' }] },
  { id: 'immB', type: 'immediate' },
]);
assert(r.join(',') === 'immA,pA,immB', 'order: ' + r);` },
    { name: "sync_task_can_spawn", code: `const r = eventLoopOrder([{ id: 'main', type: 'sync', spawns: [{ id: 'later', type: 'promise' }] }, { id: 'main2', type: 'sync' }]);
assert(r.join(',') === 'main,main2,later', 'spawned promise waits for the rest of the script: ' + r);` },
    { name: "empty", code: `assert(eventLoopOrder([]).length === 0, 'empty');` },
  ],
  solution: {
    code: `function eventLoopOrder(tasks) {
  const out = [];
  const ticks = [];
  const promises = [];
  const timers = [];
  const immediates = [];

  function schedule(task) {
    if (task.type === 'nextTick') ticks.push(task);
    else if (task.type === 'promise') promises.push(task);
    else if (task.type === 'timeout') timers.push({ task, index: timers.length });
    else if (task.type === 'immediate') immediates.push(task);
  }

  function run(task) {
    out.push(task.id);
    (task.spawns || []).forEach(schedule);
  }

  function drainMicrotasks() {
    while (ticks.length > 0 || promises.length > 0) {
      while (ticks.length > 0) run(ticks.shift());
      while (promises.length > 0) run(promises.shift());
    }
  }

  for (const task of tasks) {
    if (task.type === 'sync') run(task);
    else schedule(task);
  }
  drainMicrotasks();

  timers.sort((a, b) => Math.max(1, a.task.delay || 0) - Math.max(1, b.task.delay || 0) || a.index - b.index);
  for (const { task } of timers) {
    run(task);
    drainMicrotasks();
  }

  for (const task of immediates) {
    run(task);
    drainMicrotasks();
  }
  return out;
}

module.exports = eventLoopOrder;`,
    explanation:
      "Two queues sit above the loop phases: nextTick, then promises, and both are drained completely before anything else runs. Timers and immediates are separate phases, and microtasks drain after every single callback, which is the Node 11+ behavior.",
  },
};
