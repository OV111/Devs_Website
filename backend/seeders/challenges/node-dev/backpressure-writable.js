export default {
  slug: "backpressure-writable",
  trackId: "node-dev",
  layerId: "node-dev-3",
  type: "CODE",
  difficulty: "hard",
  title: "Backpressure: a writable with highWaterMark",
  summary: "Build a writable that processes chunks one at a time, tells the producer to pause, and signals 'drain'.",
  description:
    "If a fast producer writes into a slow consumer without limits, memory grows until the process crashes. Node streams solve this with backpressure: <code>write()</code> returns <code>false</code> when the internal buffer is full, the producer must wait for the <code>'drain'</code> event, then continue.",
  task:
    "Write <code>createWritable({ highWaterMark = 3, write })</code> returning <code>{ write(chunk), onDrain(fn), buffered(), end() }</code>. The option <code>write(chunk)</code> is an async function that actually consumes one chunk.",
  constraints: [
    "Chunks are processed strictly one at a time, in the order written; a chunk counts as buffered until its <code>write</code> promise finishes.",
    "<code>write(chunk)</code> queues the chunk and returns <code>true</code> while <code>buffered() &lt; highWaterMark</code> after queuing, otherwise <code>false</code>.",
    "Drain handlers (<code>onDrain</code>) are called once the buffer is completely empty, but only if some earlier <code>write()</code> returned <code>false</code>; after that the flag resets.",
    "<code>end()</code> returns a promise that resolves when everything queued has been processed. Calling <code>write</code> after <code>end</code> throws <code>Error('write after end')</code>.",
    "If the consumer's <code>write</code> rejects, the failed and remaining chunks are dropped, <code>end()</code> rejects with that error (also if called later), and further <code>write()</code> calls return <code>false</code>.",
  ],
  example: `const w = createWritable({ highWaterMark: 2, write: async (c) => save(c) }); w.write('a'); // true
w.write('b'); // false: wait for drain`,
  tags: ["streams","backpressure","async","node-core"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "createWritable.js",
      lang: "js",
      code: `// createWritable.js
function createWritable(options) {
  // your code here
}

module.exports = createWritable;`,
    },
  ],
  testFile: {
    name: "createWritable_test.js",
    lang: "test",
    code: `const createWritable = require('./createWritable');

test('returns_false_at_hwm', () => {
  const w = createWritable({ highWaterMark: 2, write: async () => {} }); expect(w.write(1)).toBe(true); expect(w.write(2)).toBe(false);
});

test('buffered', () => {
  const w = createWritable({ write: async () => {} }); w.write(1); w.write(2); expect(w.buffered()).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>queue</code> array and a <code>running</code> flag. A <code>pump()</code> loop: while the queue isn't empty, <code>await write(queue[0])</code> then <code>shift()</code>. Shift only AFTER the await, so an in-flight chunk still counts as buffered." },
    { order: 2, cost: 5, text: "Remember <code>needDrain = true</code> whenever <code>write()</code> returns false; when the pump finishes with an empty queue and <code>needDrain</code> is set, reset it and call the drain handlers." },
    { order: 3, cost: 15, text: "<code>end()</code>: if already idle (or failed) settle immediately, otherwise push a callback onto a waiters list that the pump runs when it stops." },
  ],
  hiddenTests: [
    { name: "write_return_values", code: `const w = createWritable({ highWaterMark: 2, write: async () => {} });
assert(w.write('a') === true, 'first fits');
assert(w.write('b') === false, 'second reaches the mark');
assert(w.write('c') === false, 'still over');` },
    { name: "default_high_water_mark_is_3", code: `const w = createWritable({ write: async () => {} });
assert(w.write(1) === true && w.write(2) === true && w.write(3) === false, 'default mark 3');` },
    { name: "processes_one_at_a_time_in_order", code: `const log = []; let running = 0; let max = 0;
const w = createWritable({ highWaterMark: 10, write: async (c) => { running++; max = Math.max(max, running); await new Promise((r) => setTimeout(r, 3)); log.push(c); running--; } });
w.write('a'); w.write('b'); w.write('c');
await w.end();
assert(log.join('') === 'abc', 'order: ' + log);
assert(max === 1, 'never concurrent, saw ' + max);` },
    { name: "buffered_counts_in_flight_chunks", code: `const w = createWritable({ highWaterMark: 5, write: async () => { await new Promise((r) => setTimeout(r, 3)); } });
w.write(1); w.write(2); w.write(3);
assert(w.buffered() === 3, 'three buffered, including the one being written');
await w.end();
assert(w.buffered() === 0, 'empty at the end');` },
    { name: "drain_fires_when_buffer_empties", code: `const written = [];
const w = createWritable({ highWaterMark: 2, write: async (c) => { await new Promise((r) => setTimeout(r, 3)); written.push(c); } });
let drains = 0; let writtenAtDrain = -1;
w.onDrain(() => { drains++; writtenAtDrain = written.length; });
w.write('a');
assert(w.write('b') === false, 'now full');
await new Promise((r) => setTimeout(r, 30));
assert(drains === 1, 'drain exactly once, got ' + drains);
assert(writtenAtDrain === 2, 'only after everything was written, saw ' + writtenAtDrain);` },
    { name: "no_drain_if_never_full", code: `const w = createWritable({ highWaterMark: 5, write: async () => {} });
let drains = 0; w.onDrain(() => drains++);
w.write(1); w.write(2);
await w.end();
await new Promise((r) => setTimeout(r, 5));
assert(drains === 0, 'drain is only for producers that were told to stop');` },
    { name: "can_write_again_after_drain", code: `const w = createWritable({ highWaterMark: 1, write: async () => {} });
assert(w.write('a') === false, 'full immediately with mark 1');
await new Promise((r) => w.onDrain(r));
assert(w.buffered() === 0, 'empty at drain');
assert(w.write('b') === false, 'a single chunk fills mark 1 again');
let drains = 0; w.onDrain(() => drains++);
await w.end();
await new Promise((r) => setTimeout(r, 5));
assert(drains === 1, 'second drain after second fill');` },
    { name: "end_waits_for_all_chunks", code: `const written = [];
const w = createWritable({ highWaterMark: 10, write: async (c) => { await new Promise((r) => setTimeout(r, 5)); written.push(c); } });
w.write(1); w.write(2); w.write(3);
await w.end();
assert(written.length === 3, 'end resolves only after all are written');` },
    { name: "end_on_idle_resolves_and_blocks_writes", code: `const w = createWritable({ write: async () => {} });
await w.end();
let err = null;
try { w.write('x'); } catch (e) { err = e; }
assert(err && err.message === 'write after end', 'write after end throws');` },
    { name: "sink_failure_rejects_end_and_drops_rest", code: `const attempted = [];
const w = createWritable({ highWaterMark: 10, write: async (c) => { attempted.push(c); if (c === 'b') throw new Error('disk full'); } });
w.write('a'); w.write('b'); w.write('c');
let err = null;
try { await w.end(); } catch (e) { err = e; }
assert(err && err.message === 'disk full', 'end rejects with the sink error');
assert(attempted.join('') === 'ab', 'c was never attempted: ' + attempted);
assert(w.buffered() === 0, 'buffer cleared');` },
    { name: "after_failure_writes_return_false_and_end_rejects", code: `const w = createWritable({ write: async () => { throw new Error('bad'); } });
w.write(1);
await new Promise((r) => setTimeout(r, 5));
assert(w.write(2) === false, 'writes are refused after failure');
let err = null;
try { await w.end(); } catch (e) { err = e; }
assert(err && err.message === 'bad', 'late end() still rejects');` },
  ],
  solution: {
    code: `function createWritable({ highWaterMark = 3, write }) {
  const queue = [];
  const drainHandlers = [];
  let waiters = [];
  let running = false;
  let ended = false;
  let failed = null;
  let needDrain = false;

  async function pump() {
    if (running) return;
    running = true;
    while (queue.length > 0 && failed === null) {
      try {
        await write(queue[0]);
        queue.shift();
      } catch (err) {
        failed = err;
      }
    }
    running = false;
    if (failed !== null) queue.length = 0;
    else if (needDrain && queue.length === 0) {
      needDrain = false;
      drainHandlers.forEach((handler) => handler());
    }
    if (queue.length === 0 || failed !== null) {
      const pending = waiters;
      waiters = [];
      pending.forEach((settle) => settle());
    }
  }

  function settleEnd(resolve, reject) {
    if (failed !== null) reject(failed);
    else resolve();
  }

  return {
    write(chunk) {
      if (ended) throw new Error('write after end');
      if (failed !== null) return false;
      queue.push(chunk);
      const ok = queue.length < highWaterMark;
      if (!ok) needDrain = true;
      pump();
      return ok;
    },
    onDrain(fn) {
      drainHandlers.push(fn);
    },
    buffered() {
      return queue.length;
    },
    end() {
      ended = true;
      return new Promise((resolve, reject) => {
        if (failed !== null || (!running && queue.length === 0)) settleEnd(resolve, reject);
        else waiters.push(() => settleEnd(resolve, reject));
      });
    },
  };
}

module.exports = createWritable;`,
    explanation:
      "The returned boolean from write() is the whole backpressure protocol: false means 'stop sending until drain'. The pump loop keeps a single consumer running, counts a chunk as buffered until it is actually finished, and fires drain only when the buffer is truly empty.",
  },
};
