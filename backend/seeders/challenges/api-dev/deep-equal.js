export default {
  slug: "deep-equal",
  trackId: "api-dev",
  layerId: "api-dev-8",
  type: "CODE",
  difficulty: "med",
  title: "Implement deepEqual (toEqual)",
  summary: "Compare two values structurally, the way expect(a).toEqual(b) does.",
  description:
    "<code>===</code> compares objects by identity, so <code>{a:1} === {a:1}</code> is false. Test assertions need structural equality.",
  task:
    "Write <code>deepEqual(a, b)</code> returning a boolean.",
  constraints: [
    "Primitives use <code>===</code>, except <code>NaN</code> equals <code>NaN</code>.",
    "Arrays are equal if same length and every item is equal; an array never equals a plain object.",
    "Plain objects are equal if they have the same own keys and equal values (key order does not matter).",
    "<code>Date</code> objects compare by time value.",
    "<code>null</code> only equals <code>null</code>. You may assume no circular references.",
  ],
  example: `deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }) // true`,
  tags: ["testing","recursion","objects"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "deepEqual.js",
      lang: "js",
      code: `// deepEqual.js
function deepEqual(a, b) {
  // your code here
}

module.exports = deepEqual;`,
    },
  ],
  testFile: {
    name: "deepEqual_test.js",
    lang: "test",
    code: `const deepEqual = require('./deepEqual');

test('objects', () => {
  expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
});

test('different', () => {
  expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Short-circuit with <code>a === b</code>, then handle NaN, then bail out unless both are non-null objects." },
    { order: 2, cost: 5, text: "Compare <code>Object.keys</code> lengths first, then check each key exists in <code>b</code> and recurse." },
    { order: 3, cost: 15, text: "Check <code>Array.isArray(a) !== Array.isArray(b)</code> early so <code>[]</code> never equals <code>{}</code>." },
  ],
  hiddenTests: [
    { name: "primitives", code: `assert(deepEqual(1, 1) && deepEqual('a', 'a') && !deepEqual(1, 2) && !deepEqual(1, '1'), 'primitives');` },
    { name: "nan_and_zero", code: `assert(deepEqual(NaN, NaN) === true, 'NaN equals NaN');
assert(deepEqual(0, -0) === true, 'zeros');` },
    { name: "null_and_undefined", code: `assert(deepEqual(null, null) && !deepEqual(null, undefined) && !deepEqual(null, {}) && !deepEqual({}, null), 'null handling');` },
    { name: "nested_objects", code: `assert(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }) === true, 'equal');
assert(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } }) === false, 'differs deep');` },
    { name: "key_order_irrelevant", code: `assert(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }) === true, 'order');` },
    { name: "extra_or_missing_keys", code: `assert(deepEqual({ a: 1 }, { a: 1, b: 2 }) === false && deepEqual({ a: 1, b: 2 }, { a: 1 }) === false, 'key counts');
assert(deepEqual({ a: undefined }, { b: undefined }) === false, 'same count, different keys');` },
    { name: "arrays", code: `assert(deepEqual([1, [2, 3]], [1, [2, 3]]) === true, 'equal arrays');
assert(deepEqual([1, 2], [2, 1]) === false, 'order matters in arrays');
assert(deepEqual([1], [1, 2]) === false, 'length');` },
    { name: "array_vs_object", code: `assert(deepEqual([], {}) === false && deepEqual({ 0: 1 }, [1]) === false, 'different kinds');` },
    { name: "dates", code: `assert(deepEqual(new Date(5), new Date(5)) === true, 'same time');
assert(deepEqual(new Date(5), new Date(6)) === false, 'different time');` },
  ],
  solution: {
    code: `function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return Number.isNaN(a) && Number.isNaN(b);
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}

module.exports = deepEqual;`,
    explanation:
      "Cheap identity and primitive checks first, then a structural walk: same kind, same key set, equal values. The hasOwnProperty check stops {a: undefined} from matching {b: undefined}.",
  },
};
