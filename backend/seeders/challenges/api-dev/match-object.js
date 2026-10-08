export default {
  slug: "match-object",
  trackId: "api-dev",
  layerId: "api-dev-8",
  type: "CODE",
  difficulty: "med",
  title: "Implement toMatchObject",
  summary: "Check that an actual value contains everything in an expected shape, ignoring extra properties.",
  description:
    "API responses often carry extra fields (ids, timestamps) you don't want to assert on. <code>toMatchObject</code> checks only the parts you care about.",
  task:
    "Write <code>matchesObject(actual, expected)</code> returning a boolean.",
  constraints: [
    "Primitives must be <code>===</code> (and <code>NaN</code> matches <code>NaN</code>).",
    "For objects, every key in <code>expected</code> must exist in <code>actual</code> and match recursively; extra keys in <code>actual</code> are fine.",
    "Arrays must have the SAME length, and each element is compared with this same partial rule.",
    "An array never matches an object, and a primitive never matches an object.",
  ],
  example: `matchesObject({ id: 7, user: { name: 'a', age: 3 } }, { user: { name: 'a' } }) // true`,
  tags: ["testing","recursion","jest"],
  estimatedMins: 20,
  xp: 45,
  starterFiles: [
    {
      name: "matchesObject.js",
      lang: "js",
      code: `// matchesObject.js
function matchesObject(actual, expected) {
  // your code here
}

module.exports = matchesObject;`,
    },
  ],
  testFile: {
    name: "matchesObject_test.js",
    lang: "test",
    code: `const matchesObject = require('./matchesObject');

test('extra_keys_ok', () => {
  expect(matchesObject({ a: 1, b: 2 }, { a: 1 })).toBe(true);
});

test('missing_key', () => {
  expect(matchesObject({ a: 1 }, { b: 1 })).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Handle the primitive <code>expected</code> case first and return early." },
    { order: 2, cost: 5, text: "Arrays: check <code>Array.isArray</code> on both sides and equal length before comparing elements." },
    { order: 3, cost: 15, text: "Objects: <code>Object.keys(expected).every(k =&gt; k in actual &amp;&amp; matchesObject(actual[k], expected[k]))</code>." },
  ],
  hiddenTests: [
    { name: "primitives", code: `assert(matchesObject(1, 1) && !matchesObject(1, 2) && !matchesObject('1', 1), 'primitives');
assert(matchesObject(NaN, NaN) === true, 'NaN');` },
    { name: "extra_keys_ignored", code: `assert(matchesObject({ id: 1, name: 'a', createdAt: 'x' }, { name: 'a' }) === true, 'subset');` },
    { name: "missing_key_fails", code: `assert(matchesObject({ a: 1 }, { a: 1, b: 2 }) === false, 'missing b');
assert(matchesObject({ a: 1 }, { b: undefined }) === false, 'missing key even if expected undefined');` },
    { name: "nested_partial", code: `assert(matchesObject({ u: { name: 'a', age: 3 }, x: 1 }, { u: { name: 'a' } }) === true, 'nested subset');
assert(matchesObject({ u: { name: 'a' } }, { u: { name: 'b' } }) === false, 'nested mismatch');` },
    { name: "arrays_same_length", code: `assert(matchesObject([1, 2, 3], [1, 2, 3]) === true, 'equal');
assert(matchesObject([1, 2, 3], [1, 2]) === false, 'longer actual fails');
assert(matchesObject([1], [1, 2]) === false, 'shorter actual fails');` },
    { name: "array_elements_partial", code: `assert(matchesObject([{ id: 1, n: 'a' }, { id: 2, n: 'b' }], [{ id: 1 }, { id: 2 }]) === true, 'objects in arrays are partial');` },
    { name: "kind_mismatch", code: `assert(matchesObject([], {}) === false && matchesObject({}, []) === false, 'array vs object');
assert(matchesObject(5, { a: 1 }) === false && matchesObject(null, { a: 1 }) === false, 'primitive vs object');` },
    { name: "empty_expected", code: `assert(matchesObject({ a: 1 }, {}) === true, 'empty object matches any object');` },
  ],
  solution: {
    code: `function matchesObject(actual, expected) {
  if (expected === null || typeof expected !== 'object') {
    return actual === expected || (Number.isNaN(actual) && Number.isNaN(expected));
  }
  if (actual === null || typeof actual !== 'object') return false;
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && actual.length === expected.length &&
      expected.every((e, i) => matchesObject(actual[i], e));
  }
  if (Array.isArray(actual)) return false;
  return Object.keys(expected).every((k) => k in actual && matchesObject(actual[k], expected[k]));
}

module.exports = matchesObject;`,
    explanation:
      "Only the keys named in expected are checked, so extra fields are ignored. Arrays are stricter: length must match, but each element is still compared partially.",
  },
};
