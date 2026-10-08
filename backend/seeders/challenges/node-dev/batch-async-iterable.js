export default {
  slug: "batch-async-iterable",
  trackId: "node-dev",
  layerId: "node-dev-3",
  type: "CODE",
  difficulty: "med",
  title: "Batch an async iterable (for await)",
  summary: "An async generator that groups items from any (async) iterable into arrays of a given size.",
  description:
    "Readable streams are async iterables: <code>for await (const chunk of stream)</code>. Batching items before a database insert is a very common use. Writing it as an async generator also shows how cleanup and errors flow through a pipeline.",
  task:
    "Write <code>batchAsync(source, size)</code> as an async generator function yielding arrays of up to <code>size</code> items.",
  constraints: [
    "Every yielded batch has exactly <code>size</code> items, except the last one, which may be smaller (never yield an empty batch).",
    "<code>source</code> can be a sync or an async iterable.",
    "It must be lazy: pull from <code>source</code> only as the consumer asks for batches.",
    "If <code>source</code> throws, the error propagates to the consumer.",
    "If the consumer stops early (<code>break</code>), the source's <code>return()</code> must be called so it can clean up.",
    "An invalid <code>size</code> (not an integer &gt;= 1) throws a <code>RangeError</code> when iteration starts.",
  ],
  example: `for await (const batch of batchAsync(rows, 100)) await db.insertMany(batch);`,
  tags: ["streams","async-iterators","generators","for-await"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "batchAsync.js",
      lang: "js",
      code: `// batchAsync.js
function batchAsync(source, size) {
  // your code here
}

module.exports = batchAsync;`,
    },
  ],
  testFile: {
    name: "batchAsync_test.js",
    lang: "test",
    code: `const batchAsync = require('./batchAsync');

test('groups', () => {
  return (async () => { const out = []; for await (const b of batchAsync([1, 2, 3, 4, 5], 2)) out.push(b); expect(out).toEqual([[1, 2], [3, 4], [5]]); })();
});

test('empty', () => {
  return (async () => { const out = []; for await (const b of batchAsync([], 3)) out.push(b); expect(out).toEqual([]); })();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "<code>async function* batchAsync(source, size)</code>: collect items with <code>for await (const item of source)</code> into a <code>batch</code> array and <code>yield</code> it when it reaches <code>size</code>." },
    { order: 2, cost: 5, text: "After the loop, yield the leftover batch only if it's non-empty." },
    { order: 3, cost: 15, text: "You don't need extra code for cleanup: when the consumer breaks, JavaScript calls <code>return()</code> on your generator, which leaves the inner <code>for await</code> and in turn calls the source's <code>return()</code>." },
  ],
  hiddenTests: [
    { name: "exact_multiple_and_remainder", code: `const collect = async (it) => { const out = []; for await (const x of it) out.push(x); return out; };
assert(JSON.stringify(await collect(batchAsync([1, 2, 3, 4], 2))) === '[[1,2],[3,4]]', 'exact multiple');
assert(JSON.stringify(await collect(batchAsync([1, 2, 3, 4, 5], 2))) === '[[1,2],[3,4],[5]]', 'remainder');
assert(JSON.stringify(await collect(batchAsync([1, 2, 3], 10))) === '[[1,2,3]]', 'size larger than the input');` },
    { name: "empty_and_size_one", code: `const collect = async (it) => { const out = []; for await (const x of it) out.push(x); return out; };
assert((await collect(batchAsync([], 3))).length === 0, 'empty source yields nothing');
assert(JSON.stringify(await collect(batchAsync(['a', 'b'], 1))) === '[["a"],["b"]]', 'size 1');` },
    { name: "works_with_async_sources", code: `const collect = async (it) => { const out = []; for await (const x of it) out.push(x); return out; };
async function* numbers() { for (let i = 1; i <= 5; i++) { await new Promise((r) => setTimeout(r, 1)); yield i; } }
assert(JSON.stringify(await collect(batchAsync(numbers(), 2))) === '[[1,2],[3,4],[5]]', 'async generator source');` },
    { name: "works_with_any_iterable", code: `const collect = async (it) => { const out = []; for await (const x of it) out.push(x); return out; };
assert(JSON.stringify(await collect(batchAsync(new Set([1, 2, 3]), 2))) === '[[1,2],[3]]', 'Set');
assert(JSON.stringify(await collect(batchAsync('abcde', 2))) === '[["a","b"],["c","d"],["e"]]', 'string');` },
    { name: "is_lazy", code: `let pulled = 0;
async function* source() { for (let i = 1; i <= 100; i++) { pulled++; yield i; } }
const it = batchAsync(source(), 3);
const first = await it.next();
assert(JSON.stringify(first.value) === '[1,2,3]', 'first batch');
assert(pulled === 3, 'only the 3 needed items were pulled, got ' + pulled);
await it.return();` },
    { name: "source_error_propagates", code: `async function* bad() { yield 1; yield 2; yield 3; throw new Error('read failed'); }
const got = []; let err = null;
try { for await (const b of batchAsync(bad(), 2)) got.push(b); } catch (e) { err = e; }
assert(err && err.message === 'read failed', 'error reaches the consumer');
assert(JSON.stringify(got) === '[[1,2]]', 'complete batches before the failure were delivered: ' + JSON.stringify(got));` },
    { name: "early_break_closes_the_source", code: `let closed = false;
const source = {
  [Symbol.asyncIterator]() {
    let i = 0;
    return { next: async () => ({ value: ++i, done: false }), return: async () => { closed = true; return { done: true }; } };
  },
};
for await (const b of batchAsync(source, 2)) { break; }
assert(closed === true, 'the source return() must be called so it can release resources');` },
    { name: "invalid_size_throws_range_error", code: `for (const bad of [0, -1, 1.5, '2', undefined, NaN]) {
  let err = null;
  try { for await (const b of batchAsync([1, 2], bad)) {} } catch (e) { err = e; }
  assert(err instanceof RangeError, 'should throw RangeError for ' + String(bad));
}` },
  ],
  solution: {
    code: `async function* batchAsync(source, size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError('size must be a positive integer');
  }
  let batch = [];
  for await (const item of source) {
    batch.push(item);
    if (batch.length === size) {
      yield batch;
      batch = [];
    }
  }
  if (batch.length > 0) yield batch;
}

module.exports = batchAsync;`,
    explanation:
      "An async generator is a pull-based pipeline stage: it only runs when the consumer asks for the next value, which gives laziness for free. Because the inner for await owns the source iterator, breaking out of the outer loop closes the source automatically.",
  },
};
