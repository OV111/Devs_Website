export default {
  slug: "suggest-compound-index",
  trackId: "api-dev",
  layerId: "api-dev-5",
  type: "CODE",
  difficulty: "med",
  title: "Suggest a compound index (ESR rule)",
  summary: "Order index fields as Equality, Sort, Range, the rule MongoDB recommends.",
  description:
    "A compound index only helps if its fields are in the right order. The ESR rule puts equality fields first, then sort fields, then range fields.",
  task:
    "Write <code>suggestIndex({ equality = [], sort = [], range = [] })</code> returning an object <code>{ field: direction }</code> whose key order is the index order. <code>sort</code> is a list of <code>[field, direction]</code> pairs (1 or -1).",
  constraints: [
    "Order is equality fields, then sort fields, then range fields.",
    "Equality and range fields use direction 1; sort fields keep their direction.",
    "A field can appear only once; the first (highest priority) occurrence wins.",
    "An empty query returns <code>{}</code>.",
  ],
  example: `suggestIndex({ equality: ['status'], sort: [['createdAt', -1]], range: ['price'] }) // { status: 1, createdAt: -1, price: 1 }`,
  tags: ["mongodb","indexes","performance"],
  estimatedMins: 20,
  xp: 45,
  starterFiles: [
    {
      name: "suggestIndex.js",
      lang: "js",
      code: `// suggestIndex.js
function suggestIndex(query) {
  // your code here
}

module.exports = suggestIndex;`,
    },
  ],
  testFile: {
    name: "suggestIndex_test.js",
    lang: "test",
    code: `const suggestIndex = require('./suggestIndex');

test('esr', () => {
  const r = suggestIndex({ equality: ['a'], sort: [['b', -1]], range: ['c'] }); expect(Object.keys(r)).toEqual(['a', 'b', 'c']);
});

test('empty', () => {
  expect(suggestIndex({})).toEqual({});
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Build the result object by adding keys in three loops: equality, sort, range." },
    { order: 2, cost: 5, text: "Skip a field if it is already a key (<code>f in index</code>)." },
    { order: 3, cost: 15, text: "JavaScript objects keep string keys in insertion order, which is what makes this work." },
  ],
  hiddenTests: [
    { name: "esr_order", code: `const r = suggestIndex({ equality: ['status'], sort: [['createdAt', -1]], range: ['price'] });
assert(Object.keys(r).join(',') === 'status,createdAt,price', 'key order');
assert(r.status === 1 && r.createdAt === -1 && r.price === 1, 'directions');` },
    { name: "multiple_of_each", code: `const r = suggestIndex({ equality: ['a', 'b'], sort: [['c', 1], ['d', -1]], range: ['e', 'f'] });
assert(Object.keys(r).join('') === 'abcdef', 'order within groups preserved');
assert(r.d === -1, 'direction kept');` },
    { name: "no_sort", code: `const r = suggestIndex({ equality: ['a'], range: ['b'] });
assert(Object.keys(r).join('') === 'ab', 'sort optional');` },
    { name: "only_range", code: `const r = suggestIndex({ range: ['x'] });
assert(r.x === 1 && Object.keys(r).length === 1, 'range only');` },
    { name: "dedupe_prefers_equality", code: `const r = suggestIndex({ equality: ['a'], sort: [['a', -1]], range: ['a', 'b'] });
assert(Object.keys(r).join('') === 'ab', 'a once');
assert(r.a === 1, 'equality direction wins');` },
    { name: "dedupe_prefers_sort_over_range", code: `const r = suggestIndex({ sort: [['t', -1]], range: ['t'] });
assert(r.t === -1, 'sort beats range');` },
    { name: "empty_query", code: `assert(Object.keys(suggestIndex({})).length === 0, 'empty');` },
  ],
  solution: {
    code: `function suggestIndex({ equality = [], sort = [], range = [] }) {
  const index = {};
  for (const f of equality) if (!(f in index)) index[f] = 1;
  for (const [f, dir] of sort) if (!(f in index)) index[f] = dir;
  for (const f of range) if (!(f in index)) index[f] = 1;
  return index;
}

module.exports = suggestIndex;`,
    explanation:
      "Equality first narrows to a few index entries, sort next lets the index return results already ordered, and range last stops the scan from breaking that order.",
  },
};
