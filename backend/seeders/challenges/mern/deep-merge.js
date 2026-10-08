export default {
  slug: "deep-merge",
  trackId: "mern",
  layerId: "mern-2",
  type: "CODE",
  difficulty: "med",
  title: "Deep merge without prototype pollution",
  summary: "Merge nested config objects immutably, replacing arrays, skipping undefined, and refusing the keys that enable prototype pollution.",
  description:
    "Object spread is shallow: <code>{ ...a, ...b }</code> replaces a whole nested object instead of merging it. A naive recursive merge fixes that, and then becomes a classic security hole when the input contains <code>__proto__</code>. Write the safe version.",
  task:
    "Write <code>deepMerge(...sources)</code> returning a NEW object built by merging the sources left to right (later sources win).",
  constraints: [
    "Plain objects merge recursively. Everything else (arrays, primitives, <code>null</code>, functions, dates) simply replaces the earlier value. Arrays are replaced, never concatenated.",
    "A source value of <code>undefined</code> is skipped (it does not erase an earlier value); <code>null</code> does overwrite. Sources that are not plain objects are ignored.",
    "Inputs are never mutated and the result shares no nested objects or arrays with them: changing the result afterwards must not change any input.",
    "The keys <code>__proto__</code>, <code>constructor</code> and <code>prototype</code> are ignored at every depth, so merging <code>JSON.parse('{\"__proto__\":{\"admin\":true}}')</code> never pollutes <code>Object.prototype</code>.",
  ],
  example: `deepMerge({ db: { host: 'a', port: 1 } }, { db: { port: 2 } }) // { db: { host: 'a', port: 2 } }`,
  tags: ["objects", "immutability", "security", "recursion"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "deepMerge.js",
      lang: "js",
      code: `// deepMerge.js
function deepMerge(...sources) {
  // your code here
}

module.exports = deepMerge;`,
    },
  ],
  testFile: {
    name: "deepMerge_test.js",
    lang: "test",
    code: `const deepMerge = require('./deepMerge');

test('merges nested objects', () => {
  expect(deepMerge({ db: { host: 'a', port: 1 } }, { db: { port: 2 } })).toEqual({ db: { host: 'a', port: 2 } });
});

test('arrays are replaced', () => {
  expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Start from an empty object and fold each source into it with a recursive helper, so the inputs are never touched." },
    { order: 2, cost: 5, text: "'Plain object' check: <code>Object.prototype.toString.call(v) === '[object Object]'</code>. Anything else is copied as-is (clone arrays with <code>map</code>, recursing for nested arrays/objects)." },
    { order: 3, cost: 15, text: "Iterate with <code>Object.keys</code> (own, enumerable) and <code>continue</code> on the three dangerous keys before you ever assign." },
  ],
  hiddenTests: [
    { name: "merges_nested_objects", code: `const r = deepMerge({ db: { host: 'a', port: 1 }, name: 'x' }, { db: { port: 2 } });
assert(JSON.stringify(r) === '{"db":{"host":"a","port":2},"name":"x"}', 'got ' + JSON.stringify(r));` },
    { name: "arrays_and_primitives_replace", code: `const r = deepMerge({ a: [1, 2], b: 1, c: { x: 1 } }, { a: [3], b: 'two', c: 5 });
assert(JSON.stringify(r) === '{"a":[3],"b":"two","c":5}', 'got ' + JSON.stringify(r));
const s = deepMerge({ c: 5 }, { c: { x: 1 } });
assert(JSON.stringify(s) === '{"c":{"x":1}}', 'primitive replaced by object: ' + JSON.stringify(s));` },
    { name: "later_sources_win_and_many_sources", code: `const r = deepMerge({ a: 1, b: 1 }, { b: 2, c: 2 }, { c: 3 });
assert(JSON.stringify(r) === '{"a":1,"b":2,"c":3}', 'got ' + JSON.stringify(r));` },
    { name: "undefined_skipped_null_overwrites", code: `const r = deepMerge({ a: 1, b: 2 }, { a: undefined, b: null });
assert(r.a === 1, 'undefined does not erase');
assert(r.b === null, 'null overwrites');` },
    { name: "inputs_are_not_mutated", code: `const a = { n: { v: 1 }, list: [1] };
const b = { n: { w: 2 } };
const before = JSON.stringify([a, b]);
const r = deepMerge(a, b);
assert(JSON.stringify([a, b]) === before, 'inputs unchanged');
assert(r !== a && r.n !== a.n, 'new objects');` },
    { name: "result_shares_no_references", code: `const a = { n: { v: 1 }, list: [{ k: 1 }] };
const r = deepMerge(a);
r.n.v = 99;
r.list[0].k = 99;
assert(a.n.v === 1 && a.list[0].k === 1, 'mutating the result must not touch the input');
const b = { deep: { arr: [1] } };
const merged = deepMerge({}, b);
merged.deep.arr.push(2);
assert(b.deep.arr.length === 1, 'nested arrays are copied too');` },
    { name: "prototype_pollution_is_blocked", code: `const evil = JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted2":true}},"ok":1}');
const r = deepMerge({}, evil);
assert(({}).polluted === undefined, 'Object.prototype untouched');
assert(({}).polluted2 === undefined, 'constructor.prototype untouched');
assert(r.polluted === undefined && r.ok === 1, 'safe key kept, unsafe dropped');
const nested = JSON.parse('{"a":{"__proto__":{"deep":true}}}');
deepMerge({}, nested);
assert(({}).deep === undefined, 'also at depth');` },
    { name: "non_object_sources_ignored", code: `const r = deepMerge({ a: 1 }, null, undefined, 5, 'str', [1, 2], { b: 2 });
assert(JSON.stringify(r) === '{"a":1,"b":2}', 'got ' + JSON.stringify(r));
const e = deepMerge();
assert(JSON.stringify(e) === '{}', 'no sources gives an empty object');` },
  ],
  solution: {
    code: `const UNSAFE = new Set(['__proto__', 'constructor', 'prototype']);
const isPlain = (v) => Object.prototype.toString.call(v) === '[object Object]';

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isPlain(value)) return assign({}, value);
  return value;
}

function assign(target, source) {
  for (const key of Object.keys(source)) {
    if (UNSAFE.has(key)) continue;
    const value = source[key];
    if (value === undefined) continue;
    if (isPlain(value)) {
      target[key] = assign(isPlain(target[key]) ? target[key] : {}, value);
    } else {
      target[key] = clone(value);
    }
  }
  return target;
}

function deepMerge(...sources) {
  const result = {};
  for (const source of sources) {
    if (isPlain(source)) assign(result, source);
  }
  return result;
}

module.exports = deepMerge;`,
    explanation:
      "Everything is written into a fresh result, and any value copied in goes through clone, so no reference to an input survives. Skipping __proto__, constructor and prototype before assignment is the whole fix for prototype pollution: those keys are how an attacker's JSON reaches Object.prototype through target[key][...] chains.",
  },
};
