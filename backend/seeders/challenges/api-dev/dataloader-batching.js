export default {
  slug: "dataloader-batching",
  trackId: "api-dev",
  layerId: "api-dev-7",
  type: "CODE",
  difficulty: "hard",
  title: "Batch and cache lookups (DataLoader)",
  summary: "Collect load(key) calls made in the same tick into one batch call, with dedupe and caching.",
  description:
    "The N+1 query problem: loading 100 posts and then each author with its own query makes 101 queries. DataLoader solves it by batching all the loads from one tick into a single call.",
  task:
    "Write <code>createLoader(batchFn)</code> returning <code>{ load(key) }</code>. <code>batchFn(keys)</code> returns (a promise of) an array of values in the same order as <code>keys</code>.",
  constraints: [
    "All <code>load</code> calls made synchronously in the same tick result in ONE <code>batchFn</code> call.",
    "Each key is passed once: duplicate keys are deduplicated.",
    "Results are cached per loader: loading a key again never calls <code>batchFn</code> again for it.",
    "If <code>batchFn</code> rejects, every promise in that batch rejects with the same error.",
    "<code>load</code> returns a promise for that key's value.",
  ],
  example: `const l = createLoader(async (ids) => ids.map(id => users[id])); await Promise.all([l.load(1), l.load(2), l.load(1)]); // batchFn called once with [1, 2]`,
  tags: ["performance","n+1","graphql","async"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "createLoader.js",
      lang: "js",
      code: `// createLoader.js
function createLoader(batchFn) {
  // your code here
}

module.exports = createLoader;`,
    },
  ],
  testFile: {
    name: "createLoader_test.js",
    lang: "test",
    code: `const createLoader = require('./createLoader');

test('batches', () => {
  let calls = 0; const l = createLoader(async (k) => { calls++; return k; }); return Promise.all([l.load(1), l.load(2)]).then(() => expect(calls).toBe(1));
});

test('maps_values', () => {
  const l = createLoader(async (k) => k.map((x) => x * 2)); return l.load(3).then((v) => expect(v).toBe(6));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>queue</code> of pending <code>{ key, resolve, reject }</code> items and a <code>cache</code> Map from key to promise." },
    { order: 2, cost: 5, text: "Schedule the flush when the FIRST item enters the queue, using <code>Promise.resolve().then(flush)</code> (a microtask runs after the current synchronous code, so every load of this tick is already queued)." },
    { order: 3, cost: 15, text: "In <code>flush</code>, take the queue, call <code>batchFn(keys)</code>, and resolve item <code>i</code> with <code>values[i]</code>." },
  ],
  hiddenTests: [
    { name: "same_tick_one_batch", code: `const calls = [];
const l = createLoader(async (keys) => { calls.push(keys.slice()); return keys.map((k) => k * 10); });
const r = await Promise.all([l.load(1), l.load(2), l.load(3)]);
assert(calls.length === 1, 'one batch call, got ' + calls.length);
assert(calls[0].join(',') === '1,2,3', 'keys in order');
assert(r.join(',') === '10,20,30', 'values mapped by position');` },
    { name: "duplicates_deduped", code: `const calls = [];
const l = createLoader(async (keys) => { calls.push(keys.slice()); return keys.map((k) => k + 1); });
const [a, b] = await Promise.all([l.load(5), l.load(5)]);
assert(calls.length === 1 && calls[0].length === 1, 'key sent once');
assert(a === 6 && b === 6, 'both resolve');` },
    { name: "cached_across_ticks", code: `let calls = 0;
const l = createLoader(async (keys) => { calls++; return keys; });
await l.load(1);
await l.load(1);
assert(calls === 1, 'second load of the same key is cached, calls=' + calls);` },
    { name: "new_tick_new_batch", code: `const calls = [];
const l = createLoader(async (keys) => { calls.push(keys.slice()); return keys; });
await l.load(1);
await l.load(2);
assert(calls.length === 2 && calls[1].join(',') === '2', 'a later tick makes a new batch');` },
    { name: "sync_batchFn_works", code: `const l = createLoader((keys) => keys.map((k) => k.toUpperCase()));
const r = await Promise.all([l.load('a'), l.load('b')]);
assert(r.join('') === 'AB', 'non-async batchFn');` },
    { name: "error_rejects_all", code: `const l = createLoader(async () => { throw new Error('db down'); });
const results = await Promise.allSettled([l.load(1), l.load(2)]);
assert(results.every((x) => x.status === 'rejected' && x.reason.message === 'db down'), 'both reject with the error');` },
    { name: "mixed_cached_and_new_keys", code: `const calls = [];
const l = createLoader(async (keys) => { calls.push(keys.slice()); return keys.map((k) => k * 2); });
await l.load(1);
const r = await Promise.all([l.load(1), l.load(2)]);
assert(calls.length === 2 && calls[1].join(',') === '2', 'only the new key is requested');
assert(r[0] === 2 && r[1] === 4, 'values');` },
    { name: "call_count_is_the_point", code: `let calls = 0; const l = createLoader(async (k) => { calls++; return k; });
await Promise.all(Array.from({ length: 50 }, (_, i) => l.load(i % 10)));
assert(calls === 1, '50 loads, 10 distinct keys, 1 batch (instead of 50 queries)');` },
  ],
  solution: {
    code: `function createLoader(batchFn) {
  const cache = new Map();
  let queue = [];
  function flush() {
    const batch = queue;
    queue = [];
    Promise.resolve(batchFn(batch.map((b) => b.key))).then(
      (values) => batch.forEach((b, i) => b.resolve(values[i])),
      (err) => batch.forEach((b) => b.reject(err)),
    );
  }
  return {
    load(key) {
      if (cache.has(key)) return cache.get(key);
      const promise = new Promise((resolve, reject) => {
        queue.push({ key, resolve, reject });
        if (queue.length === 1) Promise.resolve().then(flush);
      });
      cache.set(key, promise);
      return promise;
    },
  };
}

module.exports = createLoader;`,
    explanation:
      "A microtask scheduled by the first load runs after all synchronous loads of the tick are queued, so one batch call serves them all. Caching the promise by key gives dedupe and caching in one step.",
  },
};
