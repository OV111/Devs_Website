export default {
  slug: "validate-against-schema",
  trackId: "api-dev",
  layerId: "api-dev-8",
  type: "CODE",
  difficulty: "hard",
  title: "Validate data against a JSON Schema subset",
  summary: "Check a request body against an OpenAPI/JSON-Schema style schema and report each error with its path.",
  description:
    "The same schema that documents your API in OpenAPI can validate incoming requests. This is what libraries like Ajv do, reduced to the essentials.",
  task:
    "Write <code>validateAgainstSchema(schema, value, path = '$')</code> returning an array of <code>{ path, message }</code> (empty if valid).",
  constraints: [
    "<code>type</code>: 'string', 'number' (finite), 'integer', 'boolean', 'array', 'object'. A wrong type reports <code>'expected &lt;type&gt;'</code> at that path and stops checking that value. <code>null</code> is not an 'object'.",
    "<code>enum</code>: value must be one of the listed values (<code>'not in enum'</code>).",
    "Numbers: <code>minimum</code> (<code>'below minimum'</code>), <code>maximum</code> (<code>'above maximum'</code>). Strings: <code>minLength</code> (<code>'too short'</code>), <code>maxLength</code> (<code>'too long'</code>).",
    "Arrays: validate each item against <code>items</code> at path <code>$[0]</code>, <code>$[1]</code>...",
    "Objects: every name in <code>required</code> that is missing gives <code>{ path: '$.name', message: 'required' }</code>; every present key in <code>properties</code> is validated at <code>$.name</code>.",
  ],
  example: `validateAgainstSchema({ type: 'object', required: ['a'] }, {}) // [{ path: '$.a', message: 'required' }]`,
  tags: ["validation","openapi","json-schema","recursion"],
  estimatedMins: 45,
  xp: 70,
  starterFiles: [
    {
      name: "validateAgainstSchema.js",
      lang: "js",
      code: `// validateAgainstSchema.js
function validateAgainstSchema(schema, value, path = '$') {
  // your code here
}

module.exports = validateAgainstSchema;`,
    },
  ],
  testFile: {
    name: "validateAgainstSchema_test.js",
    lang: "test",
    code: `const validateAgainstSchema = require('./validateAgainstSchema');

test('valid', () => {
  expect(validateAgainstSchema({ type: 'string' }, 'x')).toEqual([]);
});

test('wrong_type', () => {
  expect(validateAgainstSchema({ type: 'number' }, 'x')[0].message).toBe('expected number');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Compute the value's kind once: arrays and null need special handling because <code>typeof</code> reports 'object' for both." },
    { order: 2, cost: 5, text: "Write the function recursively and spread the child results into your errors array, passing an extended <code>path</code>." },
    { order: 3, cost: 15, text: "After a type mismatch, <code>return</code> immediately so you don't pile up confusing follow-up errors." },
  ],
  hiddenTests: [
    { name: "valid_returns_empty", code: `const schema = { type: 'object', required: ['a'], properties: { a: { type: 'integer' } } };
assert(validateAgainstSchema(schema, { a: 1 }).length === 0, 'valid');` },
    { name: "type_errors", code: `const e = validateAgainstSchema({ type: 'string' }, 5);
assert(e.length === 1 && e[0].path === '$' && e[0].message === 'expected string', 'string');
assert(validateAgainstSchema({ type: 'integer' }, 1.5).length === 1, 'integer');
assert(validateAgainstSchema({ type: 'number' }, NaN).length === 1, 'NaN is not a number');
assert(validateAgainstSchema({ type: 'object' }, null).length === 1, 'null is not an object');
assert(validateAgainstSchema({ type: 'object' }, []).length === 1, 'array is not an object');
assert(validateAgainstSchema({ type: 'array' }, {}).length === 1, 'object is not an array');` },
    { name: "integer_accepts_whole_floats", code: `assert(validateAgainstSchema({ type: 'integer' }, 3).length === 0, 'integer');` },
    { name: "enum", code: `const s = { enum: ['a', 'b'] };
assert(validateAgainstSchema(s, 'a').length === 0, 'in enum');
assert(validateAgainstSchema(s, 'c')[0].message === 'not in enum', 'not in enum');` },
    { name: "number_bounds", code: `const s = { type: 'number', minimum: 1, maximum: 5 };
assert(validateAgainstSchema(s, 0)[0].message === 'below minimum', 'min');
assert(validateAgainstSchema(s, 6)[0].message === 'above maximum', 'max');
assert(validateAgainstSchema(s, 1).length === 0 && validateAgainstSchema(s, 5).length === 0, 'inclusive');` },
    { name: "string_bounds", code: `const s = { type: 'string', minLength: 2, maxLength: 3 };
assert(validateAgainstSchema(s, 'a')[0].message === 'too short', 'short');
assert(validateAgainstSchema(s, 'abcd')[0].message === 'too long', 'long');` },
    { name: "required_and_nested_paths", code: `const schema = { type: 'object', required: ['name', 'address'], properties: { name: { type: 'string' }, address: { type: 'object', required: ['zip'], properties: { zip: { type: 'string' } } } } };
const e = validateAgainstSchema(schema, { address: {} });
const paths = e.map((x) => x.path).sort().join(',');
assert(paths === '$.address.zip,$.name', 'paths: ' + paths);
assert(e.every((x) => x.message === 'required'), 'messages');` },
    { name: "array_items_with_index_paths", code: `const schema = { type: 'array', items: { type: 'number' } };
const e = validateAgainstSchema(schema, [1, 'x', 3, 'y']);
assert(e.length === 2 && e[0].path === '$[1]' && e[1].path === '$[3]', 'indexes: ' + JSON.stringify(e));` },
    { name: "optional_property_absent_is_fine", code: `const schema = { type: 'object', properties: { a: { type: 'string' } } };
assert(validateAgainstSchema(schema, {}).length === 0, 'absent optional');
assert(validateAgainstSchema(schema, { a: 5 })[0].path === '$.a', 'present and wrong');` },
    { name: "reports_all_errors", code: `const schema = { type: 'object', properties: { a: { type: 'string' }, b: { type: 'number' } } };
assert(validateAgainstSchema(schema, { a: 1, b: 'x' }).length === 2, 'both reported');` },
  ],
  solution: {
    code: `function validateAgainstSchema(schema, value, path = '$') {
  const errors = [];
  const add = (message) => errors.push({ path, message });
  const kind = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (schema.type) {
    let ok;
    if (schema.type === 'integer') ok = Number.isInteger(value);
    else if (schema.type === 'number') ok = typeof value === 'number' && Number.isFinite(value);
    else ok = kind === schema.type;
    if (!ok) {
      add('expected ' + schema.type);
      return errors;
    }
  }
  if (schema.enum && !schema.enum.includes(value)) add('not in enum');
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) add('below minimum');
    if (schema.maximum !== undefined && value > schema.maximum) add('above maximum');
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) add('too short');
    if (schema.maxLength !== undefined && value.length > schema.maxLength) add('too long');
  }
  if (kind === 'array' && schema.items) {
    value.forEach((item, i) => errors.push(...validateAgainstSchema(schema.items, item, path + '[' + i + ']')));
  }
  if (kind === 'object') {
    for (const key of schema.required || []) {
      if (!(key in value)) errors.push({ path: path + '.' + key, message: 'required' });
    }
    for (const [key, sub] of Object.entries(schema.properties || {})) {
      if (key in value) errors.push(...validateAgainstSchema(sub, value[key], path + '.' + key));
    }
  }
  return errors;
}

module.exports = validateAgainstSchema;`,
    explanation:
      "A recursive walk: each level checks its own keywords, then recurses into items or properties with an extended path. Returning early on a type mismatch avoids meaningless follow-up errors.",
  },
};
