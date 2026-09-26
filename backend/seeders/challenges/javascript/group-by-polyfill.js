export default {
  slug: "group-by-polyfill",
  trackId: "javascript",
  layerId: "javascript-6",
  type: "CODE",
  difficulty: "easy",
  title: "groupBy() — an Object.groupBy polyfill",
  summary:
    "Group an array's items into buckets by a computed key, matching the behavior of the new Object.groupBy.",
  description:
    "Object.groupBy just landed in modern JS engines, but plenty of runtimes and older Node versions don't have it yet. Build the polyfill.",
  task:
    "Write <code>groupBy(items, keyFn)</code>. Call <code>keyFn(item)</code> for each item in <code>items</code> to compute its group key, and return a plain object whose keys are the string form of those computed keys, and whose values are arrays of the items that produced that key — in the same relative order they appeared in the input.",
  constraints: [
    "An item's position within its group's array must match its relative order in the input array.",
    "Groups themselves appear in the output in the order their key was first seen.",
    "keyFn's return value may not already be a string (e.g. a number or boolean) — it must still work as an object key.",
    "An empty input array returns an empty object, not undefined or an error.",
  ],
  example: `const people = [
  { name: 'Ann', age: 28 },
  { name: 'Bo', age: 34 },
  { name: 'Cy', age: 28 },
];
groupBy(people, (p) => p.age);
// { 28: [{name:'Ann',age:28}, {name:'Cy',age:28}], 34: [{name:'Bo',age:34}] }`,
  tags: ["arrays", "functional-programming", "es2022"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "groupBy.js",
      lang: "js",
      code: `// groupBy.js
function groupBy(items, keyFn) {
  // your code here
}

module.exports = groupBy;`,
    },
  ],
  testFile: {
    name: "groupBy_test.js",
    lang: "test",
    code: `// groupBy_test.js
const groupBy = require('./groupBy');

test('groups_by_computed_key', () => {
  const result = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'));
  expect(result.odd).toEqual([1, 3]);
  expect(result.even).toEqual([2, 4]);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Start with an empty <code>{}</code>. For each item, compute its key, and if that key doesn't have an array yet, create one before pushing.",
    },
    {
      order: 2,
      cost: 5,
      text: "Plain object keys are always coerced to strings automatically — <code>obj[42]</code> and <code>obj['42']</code> are the same property, so you don't need to manually stringify keyFn's return value.",
    },
  ],
  hiddenTests: [
    {
      name: "groups_items_by_computed_key",
      code: `const result = groupBy([1, 2, 3, 4, 5, 6], (n) => (n % 2 === 0 ? 'even' : 'odd'));
assert(JSON.stringify(result.odd) === JSON.stringify([1, 3, 5]), 'expected odd group [1,3,5], got ' + JSON.stringify(result.odd));
assert(JSON.stringify(result.even) === JSON.stringify([2, 4, 6]), 'expected even group [2,4,6], got ' + JSON.stringify(result.even));`,
    },
    {
      name: "preserves_relative_order_within_a_group",
      code: `const items = [{ id: 1, g: 'a' }, { id: 2, g: 'b' }, { id: 3, g: 'a' }, { id: 4, g: 'a' }];
const result = groupBy(items, (i) => i.g);
const ids = result.a.map((i) => i.id);
assert(JSON.stringify(ids) === JSON.stringify([1, 3, 4]), 'items within group a must appear in their original relative order, got ' + JSON.stringify(ids));`,
    },
    {
      name: "non_string_keys_still_work",
      code: `const result = groupBy([{ age: 28 }, { age: 34 }, { age: 28 }], (p) => p.age);
assert(Array.isArray(result[28]) && result[28].length === 2, 'a numeric key from keyFn must still produce a usable group, got ' + JSON.stringify(result));
assert(Array.isArray(result[34]) && result[34].length === 1, 'expected one item in the 34 group');`,
    },
    {
      name: "empty_input_returns_empty_object",
      code: `const result = groupBy([], (x) => x);
assert(typeof result === 'object' && result !== null, 'must return an object, not null/undefined');
assert(Object.keys(result).length === 0, 'an empty input array must produce an object with no groups');`,
    },
    {
      name: "single_group_when_keyFn_is_constant",
      code: `const result = groupBy([1, 2, 3], () => 'all');
assert(Object.keys(result).length === 1, 'a constant keyFn must produce exactly one group');
assert(JSON.stringify(result.all) === JSON.stringify([1, 2, 3]), 'the single group must contain every item in order');`,
    },
  ],
  solution: {
    code: `function groupBy(items, keyFn) {
  const result = {};

  for (const item of items) {
    const key = keyFn(item);
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

module.exports = groupBy;`,
    explanation:
      "A single forward pass over items is enough: for each one, keyFn computes which bucket it belongs to, and if that bucket's array doesn't exist yet it's created on first sight — which is also what makes groups appear in the output in first-seen order, since object key insertion order is preserved by the JS engine. hasOwnProperty is used for the existence check rather than a plain `if (!result[key])`, because a falsy-but-valid key (like the empty string, or the literal key 'hasOwnProperty' itself) would otherwise be misread as 'group not created yet' on some inputs. Numeric or other non-string keys work without any manual conversion because plain object property access always coerces the key to a string — result[28] and result['28'] are already the same property.",
  },
};
