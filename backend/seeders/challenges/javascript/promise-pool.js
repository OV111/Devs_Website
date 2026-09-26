export default {
  slug: "promise-pool",
  trackId: "javascript",
  layerId: "javascript-4",
  type: "CODE",
  difficulty: "med",
  title: "asyncPool() — run promises with a concurrency limit",
  summary:
    "Run many async tasks over a list, never more than N at a time, results back in the original order.",
  description:
    "Promise.all fires everything at once — fine for 5 requests, a great way to get rate-limited or crash a downstream service at 5,000. Build the version with a concurrency cap.",
  task:
    "Write <code>asyncPool(concurrency, items, iteratorFn)</code>. It must call <code>iteratorFn(item)</code> for every item in <code>items</code>, running at most <code>concurrency</code> calls at the same time, and resolve to an array of the results in the same order as the input <code>items</code> — regardless of which tasks happen to finish first.",
  constraints: [
    "At no point should more than concurrency calls to iteratorFn be in flight simultaneously.",
    "Results must be ordered to match items, not the order tasks completed in.",
    "If any task rejects, asyncPool must reject with that error (don't need to cancel in-flight tasks, but don't hang forever either).",
    "concurrency may be larger than items.length — that's just an unconstrained run.",
  ],
  example: `const urls = ['/a', '/b', '/c', '/d', '/e'];
const results = await asyncPool(2, urls, (url) => fetch(url).then(r => r.json()));
// at most 2 fetches in flight at once; results[i] corresponds to urls[i]`,
  tags: ["async", "promises", "concurrency"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "asyncPool.js",
      lang: "js",
      code: `// asyncPool.js
async function asyncPool(concurrency, items, iteratorFn) {
  // your code here
}

module.exports = asyncPool;`,
    },
  ],
  testFile: {
    name: "asyncPool_test.js",
    lang: "test",
    code: `// asyncPool_test.js
const asyncPool = require('./asyncPool');

test('resolves_in_input_order', async () => {
  const results = await asyncPool(2, [1, 2, 3], async (n) => n * 10);
  expect(results).toEqual([10, 20, 30]);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Pre-allocate a results array the same length as items, and write into <code>results[i]</code> by index — that's what keeps output order independent of completion order.",
    },
    {
      order: 2,
      cost: 5,
      text: "A worker pattern: start <code>concurrency</code> loops running concurrently (not <code>concurrency</code> promises up front). Each loop pulls the next unclaimed index and processes it, then loops again — that naturally caps how many are in flight.",
    },
    {
      order: 3,
      cost: 15,
      text: "A shared mutable <code>nextIndex</code> counter, incremented by each worker loop as it claims work, is enough to coordinate — <code>Promise.all</code> over the <code>concurrency</code> worker loops themselves (not over the items) is what you await at the end.",
    },
  ],
  hiddenTests: [
    {
      name: "resolves_all_items_in_input_order",
      code: `const results = await asyncPool(2, [1, 2, 3, 4], async (n) => n * 10);
assert(JSON.stringify(results) === JSON.stringify([10, 20, 30, 40]), 'expected [10,20,30,40] in input order, got ' + JSON.stringify(results));`,
      },
    {
      name: "never_exceeds_the_concurrency_limit",
      code: `let inFlight = 0;
let maxInFlight = 0;
const items = [1, 2, 3, 4, 5, 6];
await asyncPool(2, items, async (n) => {
  inFlight++;
  maxInFlight = Math.max(maxInFlight, inFlight);
  await new Promise((r) => setTimeout(r, 15));
  inFlight--;
  return n;
});
assert(maxInFlight <= 2, 'never more than 2 tasks should run at once, observed max ' + maxInFlight);
assert(maxInFlight >= 2, 'with 6 items and concurrency 2, at least 2 should run simultaneously at some point (max observed was ' + maxInFlight + ') — a fully sequential implementation is too slow');`,
    },
    {
      name: "order_is_preserved_even_when_earlier_items_finish_later",
      code: `const delays = { 1: 30, 2: 5, 3: 20 };
const results = await asyncPool(3, [1, 2, 3], async (n) => {
  await new Promise((r) => setTimeout(r, delays[n]));
  return n * 100;
});
assert(JSON.stringify(results) === JSON.stringify([100, 200, 300]), 'result order must match input order even though item 2 finishes before item 1 — got ' + JSON.stringify(results));`,
    },
    {
      name: "rejects_when_a_task_rejects",
      code: `let threw = false;
let message = '';
try {
  await asyncPool(2, [1, 2, 3], async (n) => {
    if (n === 2) throw new Error('boom on 2');
    return n;
  });
} catch (err) {
  threw = true;
  message = err.message;
}
assert(threw === true, 'asyncPool must reject if any task rejects');
assert(message === 'boom on 2', 'the rejection reason should be the original error, got: ' + message);`,
    },
    {
      name: "handles_concurrency_larger_than_item_count",
      code: `const results = await asyncPool(10, [1, 2], async (n) => n + 1);
assert(JSON.stringify(results) === JSON.stringify([2, 3]), 'concurrency larger than the item count should just run everything, got ' + JSON.stringify(results));`,
    },
    {
      name: "handles_an_empty_item_list",
      code: `const results = await asyncPool(3, [], async (n) => n);
assert(Array.isArray(results) && results.length === 0, 'an empty item list must resolve to an empty array, not hang or throw');`,
    },
  ],
  solution: {
    code: `async function asyncPool(concurrency, items, iteratorFn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await iteratorFn(items[currentIndex]);
    }
  }

  const workerCount = Math.min(concurrency, items.length) || 0;
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  return results;
}

module.exports = asyncPool;`,
    explanation:
      "Rather than launching one promise per item and limiting the batch size, this launches exactly `concurrency` long-lived worker loops that run alongside each other, each pulling the next unclaimed index from a shared counter and moving on once its own task resolves. That's what keeps at most `concurrency` tasks in flight at any instant, however unevenly individual tasks take to finish. Writing into results[currentIndex] rather than pushing onto an array is what keeps output order tied to input order — a slow item at index 0 still lands at results[0] even if faster items at higher indices finish first. Promise.all(workers) waits for every worker loop to drain the whole list, and rejects as soon as any iteratorFn call throws, since that rejection propagates up out of its worker's while loop.",
  },
};
