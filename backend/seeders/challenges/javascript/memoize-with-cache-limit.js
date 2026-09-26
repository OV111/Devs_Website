export default {
  slug: "memoize-with-cache-limit",
  trackId: "javascript",
  layerId: "javascript-2",
  type: "CODE",
  difficulty: "easy",
  title: "memoize() with a cache size limit",
  summary:
    "Cache a function's results by its arguments, evicting the oldest entry once the cache is full.",
  description:
    "Basic memoization tutorials cache forever, which is a memory leak for any function called with unbounded input. Build one with a real limit.",
  task:
    "Write <code>memoize(fn, maxSize)</code>, returning a wrapped function. Calling it with the same arguments as a previous call returns the cached result without calling <code>fn</code> again. Once the cache holds <code>maxSize</code> entries, adding a new one evicts the oldest entry first (FIFO).",
  constraints: [
    "Arguments are compared by deep equality, not by reference — treat two calls with structurally identical arguments as the same cache key.",
    "A cache hit must not call fn again.",
    "Exceeding maxSize evicts the oldest entry, not a random one.",
    "maxSize is fixed for the lifetime of the memoized function.",
  ],
  example: `const slowSquare = (n) => { /* expensive */ return n * n; };
const fastSquare = memoize(slowSquare, 2);
fastSquare(4); // computes, caches
fastSquare(4); // cache hit — slowSquare not called again
fastSquare(5); // computes, caches — cache now has 4 and 5
fastSquare(6); // computes — evicts 4 (the oldest), cache now has 5 and 6`,
  tags: ["closures", "caching", "memoization"],
  estimatedMins: 20,
  xp: 30,
  starterFiles: [
    {
      name: "memoize.js",
      lang: "js",
      code: `// memoize.js
function memoize(fn, maxSize) {
  // your code here
}

module.exports = memoize;`,
    },
  ],
  testFile: {
    name: "memoize_test.js",
    lang: "test",
    code: `// memoize_test.js
const memoize = require('./memoize');

test('caches_repeated_calls', () => {
  let calls = 0;
  const add = memoize((a, b) => { calls++; return a + b; }, 3);
  expect(add(1, 2)).toBe(3);
  expect(add(1, 2)).toBe(3);
  expect(calls).toBe(1);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "A <code>Map</code> keyed on <code>JSON.stringify(args)</code> gives you deep-equality-by-value for free, without writing your own comparison.",
    },
    {
      order: 2,
      cost: 5,
      text: "Like an LRU, a <code>Map</code> preserves insertion order — the first key its iterator yields is the oldest one, which is exactly what FIFO eviction needs.",
    },
    {
      order: 3,
      cost: 10,
      text: "On a cache miss: compute the result, then if <code>cache.size >= maxSize</code>, delete <code>cache.keys().next().value</code> before setting the new entry.",
    },
  ],
  hiddenTests: [
    {
      name: "cache_hit_does_not_recompute",
      code: `let calls = 0;
const fn = memoize((a, b) => { calls++; return a + b; }, 5);
assert(fn(2, 3) === 5, 'expected 2+3=5');
assert(fn(2, 3) === 5, 'second call with same args should hit the cache');
assert(calls === 1, 'fn must only be called once for identical arguments, got ' + calls + ' calls');`,
    },
    {
      name: "different_args_are_different_entries",
      code: `let calls = 0;
const fn = memoize((a, b) => { calls++; return a + b; }, 5);
fn(1, 2);
fn(3, 4);
assert(calls === 2, 'two structurally different calls must both compute, got ' + calls + ' calls');`,
    },
    {
      name: "evicts_oldest_entry_first",
      code: `let calls = 0;
const fn = memoize((n) => { calls++; return n * n; }, 2);
fn(1); // cache: [1]
fn(2); // cache: [1, 2]
fn(3); // over capacity — evicts 1. cache: [2, 3]
calls = 0;
fn(2); // should still be cached
assert(calls === 0, 'entry 2 should not have been evicted');
fn(1); // was evicted — must recompute
assert(calls === 1, 'entry 1 was the oldest and should have been evicted, forcing a recompute');`,
    },
    {
      name: "deep_equality_not_reference_equality",
      code: `let calls = 0;
const fn = memoize((obj) => { calls++; return obj.x; }, 5);
fn({ x: 1 });
fn({ x: 1 }); // a different object reference, same structure
assert(calls === 1, 'structurally identical arguments (different object references) must be treated as the same cache key, got ' + calls + ' calls');`,
    },
    {
      name: "respects_maxSize_of_one",
      code: `let calls = 0;
const fn = memoize((n) => { calls++; return n; }, 1);
fn(1);
fn(2); // evicts 1 immediately, cache holds only 2
calls = 0;
fn(1);
assert(calls === 1, 'with maxSize 1, calling anything other than the most recent argument must recompute');`,
    },
  ],
  solution: {
    code: `function memoize(fn, maxSize) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(key, result);

    return result;
  };
}

module.exports = memoize;`,
    explanation:
      "JSON.stringify(args) turns 'deep equality of the argument list' into a single string comparison, which a Map can key on directly — no custom equality function needed, and it naturally handles nested objects the same way JSON.stringify always does. A Map's keys() iterator yields entries in insertion order, so the very first key it produces is always the oldest surviving entry — that's what makes FIFO eviction a one-liner instead of a separate tracked queue. Eviction happens before the new entry is set, and only when the cache is already at capacity, so the cache never holds more than maxSize entries at once.",
  },
};
