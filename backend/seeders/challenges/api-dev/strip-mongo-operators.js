export default {
  slug: "strip-mongo-operators",
  trackId: "api-dev",
  layerId: "api-dev-6",
  type: "CODE",
  difficulty: "easy",
  title: "Strip Mongo operators from user input",
  summary: "Deep-clean an object of $-keys and dotted keys to block NoSQL injection.",
  description:
    "A login body like <code>{ \"email\": \"a\", \"password\": { \"$ne\": null } }</code> matches any user in Mongo. Removing operator keys from user input is a basic defense, the idea behind express-mongo-sanitize.",
  task:
    "Write <code>sanitize(value)</code> returning a cleaned deep copy.",
  constraints: [
    "Remove keys that start with <code>$</code>, contain <code>.</code>, or are <code>__proto__</code>.",
    "Recurse into nested objects and arrays.",
    "Primitives and null are returned unchanged.",
    "Never mutate the input.",
  ],
  example: `sanitize({ email: 'a', password: { $ne: null } }) // { email: 'a', password: {} }`,
  tags: ["security","mongodb","nosql-injection"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "sanitize.js",
      lang: "js",
      code: `// sanitize.js
function sanitize(value) {
  // your code here
}

module.exports = sanitize;`,
    },
  ],
  testFile: {
    name: "sanitize_test.js",
    lang: "test",
    code: `const sanitize = require('./sanitize');

test('removes_operator', () => {
  expect(sanitize({ a: { $ne: 1 } })).toEqual({ a: {} });
});

test('primitive', () => {
  expect(sanitize(5)).toBe(5);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Handle arrays first (<code>map(sanitize)</code>), then plain objects, then return everything else as is." },
    { order: 2, cost: 5, text: "Build a new object with <code>Object.entries</code> and skip bad keys; that also avoids mutating the input." },
    { order: 3, cost: 15, text: "<code>JSON.parse</code> can create an own <code>__proto__</code> key; skip it explicitly." },
  ],
  hiddenTests: [
    { name: "removes_dollar_keys", code: `const r = sanitize({ email: 'a', password: { $ne: null } });
assert(r.email === 'a' && Object.keys(r.password).length === 0, 'operator removed');` },
    { name: "removes_dotted_keys", code: `const r = sanitize({ 'a.b': 1, ok: 2 });
assert(!('a.b' in r) && r.ok === 2, 'dotted key removed');` },
    { name: "recurses_arrays", code: `const r = sanitize({ list: [{ $gt: 1, x: 2 }, 5, 'a'] });
assert(r.list.length === 3 && r.list[0].x === 2 && !('$gt' in r.list[0]) && r.list[1] === 5, 'arrays');` },
    { name: "deep_nesting", code: `const r = sanitize({ a: { b: { $where: 'x', c: 1 } } });
assert(r.a.b.c === 1 && !('$where' in r.a.b), 'deep');` },
    { name: "does_not_mutate", code: `const input = { a: { $ne: 1 } };
sanitize(input);
assert('$ne' in input.a, 'input must stay unchanged');` },
    { name: "primitives_and_null", code: `assert(sanitize(null) === null && sanitize('s') === 's' && sanitize(0) === 0 && sanitize(true) === true, 'primitives');` },
    { name: "proto_key_dropped", code: `const r = sanitize(JSON.parse('{"__proto__":{"admin":true},"a":1}'));
assert(r.a === 1, 'kept');
assert(r.admin === undefined && Object.getPrototypeOf(r) === Object.prototype, 'no prototype pollution');` },
  ],
  solution: {
    code: `function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('$') || k.includes('.') || k === '__proto__') continue;
      out[k] = sanitize(v);
    }
    return out;
  }
  return value;
}

module.exports = sanitize;`,
    explanation:
      "Build a new object, skipping any key that could act as a Mongo operator or touch the prototype, and recurse into children so nesting can't hide an operator.",
  },
};
