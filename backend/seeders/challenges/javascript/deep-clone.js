export default {
  slug: "deep-clone",
  trackId: "javascript",
  layerId: "javascript-3",
  type: "CODE",
  difficulty: "med",
  title: "deepClone() that survives circular references",
  summary:
    "Deep-clone a nested object or array without recursing forever on a self-reference.",
  description:
    "JSON.parse(JSON.stringify(x)) is the deep clone everyone reaches for first — until the object has a Date, or references itself, and it either corrupts the data or blows the stack.",
  task:
    "Write <code>deepClone(value)</code>. Plain objects and arrays must be cloned recursively (nested structures get their own new objects/arrays, not shared references). <code>Date</code> instances must be cloned as new <code>Date</code> objects with the same time value, not plain objects. Primitives (numbers, strings, booleans, null, undefined) pass through unchanged. If the input contains a circular reference — directly or nested — cloning it must not exceed the call stack, and the clone must preserve the same circular structure (the clone's self-reference points back to the clone, not the original).",
  constraints: [
    "No JSON.parse(JSON.stringify(...)) — it can't represent Dates correctly or handle cycles at all.",
    "Mutating the clone must never affect the original, at any depth.",
    "The same object referenced twice in the input (not necessarily circular, just aliased) should ideally point to the same cloned object in the output, not two separate clones.",
  ],
  example: `const original = { name: 'a', tags: ['x', 'y'], created: new Date() };
original.self = original; // circular
const clone = deepClone(original);
clone.tags.push('z');
console.log(original.tags); // ['x', 'y'] — unaffected
console.log(clone.self === clone); // true — the cycle is preserved in the clone`,
  tags: ["recursion", "objects", "edge-cases"],
  estimatedMins: 25,
  xp: 40,
  starterFiles: [
    {
      name: "deepClone.js",
      lang: "js",
      code: `// deepClone.js
function deepClone(value) {
  // your code here
}

module.exports = deepClone;`,
    },
  ],
  testFile: {
    name: "deepClone_test.js",
    lang: "test",
    code: `// deepClone_test.js
const deepClone = require('./deepClone');

test('clones_nested_objects', () => {
  const original = { a: { b: 1 } };
  const clone = deepClone(original);
  clone.a.b = 2;
  expect(original.a.b).toBe(1);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Recurse: for each value, check its type. Arrays and plain objects recurse into their own entries; everything else (numbers, strings, null, functions) can usually just be returned as-is.",
    },
    {
      order: 2,
      cost: 5,
      text: "Circular references need a lookup of 'have I already cloned this exact object?' — a <code>Map</code> from original object to its clone, checked and populated as you go, before recursing into that object's children.",
    },
    {
      order: 3,
      cost: 15,
      text: "Order matters: create the empty clone object/array and register it in the Map <strong>before</strong> recursing into its properties — otherwise a self-reference inside those properties will recurse infinitely because the Map won't have an entry for the in-progress object yet.",
    },
  ],
  hiddenTests: [
    {
      name: "clones_nested_objects_without_shared_references",
      code: `const original = { a: { b: 1 } };
const clone = deepClone(original);
clone.a.b = 2;
assert(original.a.b === 1, 'mutating the clone must not affect the original');
assert(clone !== original && clone.a !== original.a, 'nested objects must be new objects, not the same reference');`,
    },
    {
      name: "clones_arrays_and_nested_arrays",
      code: `const original = [1, [2, 3], { x: 4 }];
const clone = deepClone(original);
clone[1].push(99);
clone[2].x = 100;
assert(original[1].length === 2, 'the original array must be unaffected by mutating the clone');
assert(original[2].x === 4, 'the original nested object must be unaffected');
assert(Array.isArray(clone) && Array.isArray(clone[1]), 'arrays must remain arrays after cloning');`,
    },
    {
      name: "clones_dates_as_real_date_instances",
      code: `const original = { created: new Date(2024, 0, 1) };
const clone = deepClone(original);
assert(clone.created instanceof Date, 'a Date must be cloned as a real Date instance, not a plain object');
assert(clone.created.getTime() === original.created.getTime(), 'the cloned Date must have the same time value');
assert(clone.created !== original.created, 'the cloned Date must be a different instance');`,
    },
    {
      name: "handles_direct_circular_reference",
      code: `const original = { name: 'a' };
original.self = original;
let clone;
let threw = false;
try { clone = deepClone(original); } catch (e) { threw = true; }
assert(threw === false, 'cloning a self-referencing object must not throw or exceed the call stack');
assert(clone.self === clone, 'the circular reference in the clone must point back to the clone itself, not the original');
assert(clone !== original, 'the clone must still be a distinct object from the original');`,
    },
    {
      name: "handles_circular_reference_nested_inside_an_array",
      code: `const node = { value: 1 };
node.children = [node];
let clone;
let threw = false;
try { clone = deepClone(node); } catch (e) { threw = true; }
assert(threw === false, 'a cycle reached through a nested array must not throw or overflow the stack');
assert(clone.children[0] === clone, 'the cycle must be preserved: children[0] in the clone must be the clone itself');`,
    },
    {
      name: "primitives_pass_through_unchanged",
      code: `const original = { n: 42, s: 'hello', b: true, u: undefined, z: null };
const clone = deepClone(original);
assert(clone.n === 42 && clone.s === 'hello' && clone.b === true, 'primitive values must be preserved exactly');
assert(clone.u === undefined && clone.z === null, 'undefined and null must be preserved as-is');`,
    },
  ],
  solution: {
    code: `function deepClone(value, seen = new Map()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (Array.isArray(value)) {
    const clonedArray = [];
    seen.set(value, clonedArray);
    for (const item of value) {
      clonedArray.push(deepClone(item, seen));
    }
    return clonedArray;
  }

  const clonedObj = {};
  seen.set(value, clonedObj);
  for (const key of Object.keys(value)) {
    clonedObj[key] = deepClone(value[key], seen);
  }
  return clonedObj;
}

module.exports = deepClone;`,
    explanation:
      "The seen Map is the whole trick for cycles: it's keyed by original object identity and populated with the new (still-empty) clone BEFORE recursing into that object's own properties. So when the recursion eventually reaches the same original object again through a cycle, seen.has(value) is already true, and the existing (in-progress) clone is returned immediately instead of recursing again — that's what turns an infinite loop into a single pass. Date is checked before the generic object branch because typeof (new Date()) is 'object', but its own enumerable keys are empty — recursing into it generically would silently produce {} instead of a working Date. Primitives are returned as-is since they're copied by value in JavaScript already; there's nothing to clone.",
  },
};
