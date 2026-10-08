export default {
  slug: "serialize-by-schema",
  trackId: "node-dev",
  layerId: "node-dev-4",
  type: "CODE",
  difficulty: "med",
  title: "Serialize a response by its schema",
  summary: "Build a JSON string from a value using a response schema: strip unknown fields, coerce types, enforce required.",
  description:
    "Fastify serializes responses with a schema (fast-json-stringify). Besides speed, this is a security feature: only fields in the schema leave the server, so a <code>passwordHash</code> that slipped into the object is never sent.",
  task:
    "Write <code>serialize(schema, value)</code> returning a JSON string. Supported schema types: <code>string, number, integer, boolean, array</code> (with <code>items</code>) and <code>object</code> (with <code>properties</code> and <code>required</code>).",
  constraints: [
    "Objects: output only the schema's <code>properties</code>, in the schema's order; extra keys in the value are dropped.",
    "A missing, <code>undefined</code> or <code>null</code> property is omitted if optional; if it is in <code>required</code>, throw an <code>Error</code> whose message is <code>'&lt;path&gt; is required'</code> with paths like <code>$.user.name</code>.",
    "<code>string</code> accepts strings and converts numbers and booleans with <code>String()</code>. <code>integer</code>/<code>number</code> accept numbers and numeric strings (integer truncates toward zero); non-finite or non-numeric values throw. <code>boolean</code> accepts booleans and the strings <code>'true'</code>/<code>'false'</code>.",
    "Arrays must be arrays (each item is serialized with <code>items</code>); objects must be plain non-array objects. Any other mismatch throws an <code>Error</code> mentioning the path.",
    "An unknown schema type throws.",
  ],
  example: `serialize({ type: 'object', properties: { id: { type: 'integer' } } }, { id: '7', password: 'x' }) // '{"id":7}'`,
  tags: ["fastify","serialization","json-schema","security"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "serialize.js",
      lang: "js",
      code: `// serialize.js
function serialize(schema, value) {
  // your code here
}

module.exports = serialize;`,
    },
  ],
  testFile: {
    name: "serialize_test.js",
    lang: "test",
    code: `const serialize = require('./serialize');

test('strips_extra', () => {
  const s = { type: 'object', properties: { id: { type: 'integer' } } }; expect(serialize(s, { id: 1, secret: 'x' })).toBe('{"id":1}');
});

test('array', () => {
  expect(serialize({ type: 'array', items: { type: 'number' } }, [1, 2])).toBe('[1,2]');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write an inner <code>build(schema, value, path)</code> that returns a plain JS value, and finish with <code>JSON.stringify(build(...))</code>; <code>JSON.stringify</code> then handles all escaping for you." },
    { order: 2, cost: 5, text: "For objects, loop over <code>Object.keys(schema.properties)</code> (that gives you schema order and drops unknown keys), recurse for each present property, and check <code>required</code> for the missing ones." },
    { order: 3, cost: 15, text: "Pass an extended path string into each recursive call so error messages can say exactly where the problem is." },
  ],
  hiddenTests: [
    { name: "only_schema_properties_in_schema_order", code: `const schema = { type: 'object', properties: { name: { type: 'string' }, id: { type: 'integer' } } };
const out = serialize(schema, { id: 1, passwordHash: 'abc', name: 'Ann', isAdmin: true });
assert(out === '{"name":"Ann","id":1}', 'got ' + out);` },
    { name: "nested_objects_and_arrays", code: `const schema = { type: 'object', properties: { user: { type: 'object', properties: { id: { type: 'integer' } } }, tags: { type: 'array', items: { type: 'string' } } } };
const out = JSON.parse(serialize(schema, { user: { id: 3, secret: 1 }, tags: ['a', 'b'], extra: 1 }));
assert(out.user.id === 3 && !('secret' in out.user), 'nested strip');
assert(out.tags.join(',') === 'a,b' && !('extra' in out), 'array and top-level strip');` },
    { name: "array_of_objects_strips_each_item", code: `const schema = { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' } } } };
assert(serialize(schema, [{ id: 1, pw: 'x' }, { id: 2, pw: 'y' }]) === '[{"id":1},{"id":2}]', 'each item');` },
    { name: "optional_missing_undefined_and_null_are_omitted", code: `const schema = { type: 'object', properties: { a: { type: 'string' }, b: { type: 'string' }, c: { type: 'string' } } };
assert(serialize(schema, { a: 'x', b: undefined, c: null }) === '{"a":"x"}', 'omitted');` },
    { name: "required_missing_throws_with_path", code: `const schema = { type: 'object', required: ['name'], properties: { name: { type: 'string' } } };
let err = null;
try { serialize(schema, {}); } catch (e) { err = e; }
assert(err && err.message === '$.name is required', 'message: ' + (err && err.message));
let err2 = null;
try { serialize(schema, { name: null }); } catch (e) { err2 = e; }
assert(err2, 'null is missing too');
const nested = { type: 'object', properties: { user: { type: 'object', required: ['id'], properties: { id: { type: 'integer' } } } } };
let err3 = null;
try { serialize(nested, { user: {} }); } catch (e) { err3 = e; }
assert(err3 && err3.message === '$.user.id is required', 'nested path: ' + (err3 && err3.message));` },
    { name: "string_coercion", code: `const s = { type: 'string' };
assert(serialize(s, 'x') === '"x"' && serialize(s, 12) === '"12"' && serialize(s, true) === '"true"', 'coerces number and boolean');
let threw = false;
try { serialize(s, { a: 1 }); } catch (e) { threw = true; }
assert(threw, 'objects are not strings');` },
    { name: "number_and_integer_coercion", code: `assert(serialize({ type: 'integer' }, '7') === '7', 'numeric string');
assert(serialize({ type: 'integer' }, 7.9) === '7' && serialize({ type: 'integer' }, -7.9) === '-7', 'truncates toward zero');
assert(serialize({ type: 'number' }, '1.5') === '1.5', 'number from string');
for (const bad of ['abc', NaN, Infinity, '', null]) {
  let threw = false;
  try { serialize({ type: 'number' }, bad); } catch (e) { threw = true; }
  assert(threw, JSON.stringify(bad) + ' must throw');
}` },
    { name: "boolean_coercion", code: `assert(serialize({ type: 'boolean' }, 'true') === 'true' && serialize({ type: 'boolean' }, false) === 'false', 'ok');
let threw = false;
try { serialize({ type: 'boolean' }, 'yes'); } catch (e) { threw = true; }
assert(threw, 'only true/false strings');` },
    { name: "structure_mismatches_throw", code: `let n = 0;
for (const [schema, value] of [[{ type: 'array', items: { type: 'string' } }, 'abc'], [{ type: 'object', properties: {} }, []], [{ type: 'object', properties: {} }, null], [{ type: 'object', properties: {} }, 'x']]) {
  try { serialize(schema, value); } catch (e) { n++; }
}
assert(n === 4, 'all four mismatches throw, got ' + n);` },
    { name: "unknown_type_throws", code: `let threw = false;
try { serialize({ type: 'date' }, 'x'); } catch (e) { threw = true; }
assert(threw, 'unsupported type');` },
    { name: "strings_are_escaped", code: `const out = serialize({ type: 'object', properties: { t: { type: 'string' } } }, { t: 'a"b\\\\n' });
assert(JSON.parse(out).t === 'a"b\\\\n', 'round trips: ' + out);` },
  ],
  solution: {
    code: `function serialize(schema, value) {
  function build(s, v, path) {
    switch (s.type) {
      case 'string':
        if (typeof v === 'string') return v;
        if (typeof v === 'number' || typeof v === 'boolean') return String(v);
        throw new Error(path + ' must be a string');
      case 'integer':
      case 'number': {
        const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
        if (typeof n !== 'number' || !Number.isFinite(n)) throw new Error(path + ' must be a ' + s.type);
        return s.type === 'integer' ? Math.trunc(n) : n;
      }
      case 'boolean':
        if (typeof v === 'boolean') return v;
        if (v === 'true') return true;
        if (v === 'false') return false;
        throw new Error(path + ' must be a boolean');
      case 'array':
        if (!Array.isArray(v)) throw new Error(path + ' must be an array');
        return v.map((item, i) => build(s.items, item, path + '[' + i + ']'));
      case 'object': {
        if (v === null || typeof v !== 'object' || Array.isArray(v)) throw new Error(path + ' must be an object');
        const required = s.required || [];
        const out = {};
        for (const key of Object.keys(s.properties || {})) {
          const item = v[key];
          if (item === undefined || item === null) {
            if (required.includes(key)) throw new Error(path + '.' + key + ' is required');
            continue;
          }
          out[key] = build(s.properties[key], item, path + '.' + key);
        }
        return out;
      }
      default:
        throw new Error('Unsupported type: ' + s.type);
    }
  }
  return JSON.stringify(build(schema, value, '$'));
}

module.exports = serialize;`,
    explanation:
      "Building a new object from the schema (instead of copying the value) is what makes leaks impossible: a field that isn't in the schema is never read. JSON.stringify at the end takes care of quoting and escaping.",
  },
};
