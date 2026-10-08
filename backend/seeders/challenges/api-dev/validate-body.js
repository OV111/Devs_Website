export default {
  slug: "validate-body",
  trackId: "api-dev",
  layerId: "api-dev-4",
  type: "CODE",
  difficulty: "med",
  title: "Validate a request body against a schema",
  summary: "A tiny Zod-style validator: types, required fields, min/max, and unknown-key stripping.",
  description:
    "Never trust a request body. Libraries like Zod or Joi check the shape at the route boundary; this is the core idea in miniature.",
  task:
    "Write <code>validate(schema, data)</code>. <code>schema</code> maps a field name to <code>{ type, required, min, max }</code>. Return <code>{ ok: true, data }</code> or <code>{ ok: false, errors }</code> where <code>errors</code> maps field name to a message string.",
  constraints: [
    "<code>type</code> is 'string', 'number' or 'boolean'; a number must be finite.",
    "A missing field (undefined or null) is an error only if <code>required</code> is true; otherwise it is skipped.",
    "For strings <code>min</code>/<code>max</code> limit the length; for numbers they limit the value (inclusive).",
    "On success <code>data</code> contains only schema fields; unknown keys are dropped.",
    "Report every failing field, not just the first.",
  ],
  example: `validate({ name: { type: 'string', required: true, min: 2 } }, { name: 'A' }) // { ok: false, errors: { name: '...' } }`,
  tags: ["validation","express","zod"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "validate.js",
      lang: "js",
      code: `// validate.js
function validate(schema, data) {
  // your code here
}

module.exports = validate;`,
    },
  ],
  testFile: {
    name: "validate_test.js",
    lang: "test",
    code: `const validate = require('./validate');

test('valid', () => {
  expect(validate({ a: { type: 'string' } }, { a: 'x' })).toEqual({ ok: true, data: { a: 'x' } });
});

test('required_missing', () => {
  expect(validate({ a: { type: 'string', required: true } }, {}).ok).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Loop over the schema's keys, not over the data's keys; that is what makes unknown fields disappear." },
    { order: 2, cost: 5, text: "Collect errors in an object and decide <code>ok</code> from whether it is empty at the end." },
    { order: 3, cost: 15, text: "Check type first; only then apply min/max, using length for strings and value for numbers." },
  ],
  hiddenTests: [
    { name: "valid_returns_clean_data", code: `const r = validate({ name: { type: 'string', required: true }, age: { type: 'number' } }, { name: 'Ann', age: 30 });
assert(r.ok === true && r.data.name === 'Ann' && r.data.age === 30, 'ok and data');` },
    { name: "strips_unknown_keys", code: `const r = validate({ a: { type: 'string' } }, { a: 'x', isAdmin: true });
assert(r.ok && !('isAdmin' in r.data), 'unknown key must be dropped');` },
    { name: "required_missing_and_null", code: `const s = { a: { type: 'string', required: true } };
assert(validate(s, {}).errors.a, 'undefined');
assert(validate(s, { a: null }).errors.a, 'null');` },
    { name: "optional_missing_is_skipped", code: `const r = validate({ a: { type: 'number' } }, {});
assert(r.ok === true && !('a' in r.data), 'optional field absent');` },
    { name: "wrong_type", code: `const r = validate({ a: { type: 'number' }, b: { type: 'boolean' } }, { a: '5', b: 'true' });
assert(r.ok === false && r.errors.a && r.errors.b, 'both wrong type');
assert(validate({ a: { type: 'number' } }, { a: NaN }).ok === false, 'NaN is not a valid number');` },
    { name: "string_length_bounds", code: `const s = { n: { type: 'string', min: 2, max: 4 } };
assert(validate(s, { n: 'a' }).errors.n, 'too short');
assert(validate(s, { n: 'abcde' }).errors.n, 'too long');
assert(validate(s, { n: 'ab' }).ok && validate(s, { n: 'abcd' }).ok, 'inclusive');` },
    { name: "number_value_bounds", code: `const s = { n: { type: 'number', min: 0, max: 10 } };
assert(validate(s, { n: -1 }).errors.n, 'below min');
assert(validate(s, { n: 11 }).errors.n, 'above max');
assert(validate(s, { n: 0 }).ok && validate(s, { n: 10 }).ok, 'inclusive');` },
    { name: "reports_all_errors", code: `const r = validate({ a: { type: 'string', required: true }, b: { type: 'number', required: true } }, {});
assert(r.errors.a && r.errors.b, 'every failing field is reported');` },
  ],
  solution: {
    code: `function validate(schema, data) {
  const errors = {};
  const out = {};
  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key];
    if (value === undefined || value === null) {
      if (rule.required) errors[key] = key + ' is required';
      continue;
    }
    if (typeof value !== rule.type || (rule.type === 'number' && !Number.isFinite(value))) {
      errors[key] = key + ' must be a ' + rule.type;
      continue;
    }
    const size = rule.type === 'string' ? value.length : value;
    if (rule.type !== 'boolean') {
      if (rule.min !== undefined && size < rule.min) { errors[key] = key + ' is below the minimum ' + rule.min; continue; }
      if (rule.max !== undefined && size > rule.max) { errors[key] = key + ' is above the maximum ' + rule.max; continue; }
    }
    out[key] = value;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: out };
}

module.exports = validate;`,
    explanation:
      "Iterating over the schema (not the data) strips unknown keys by construction. Each field is checked for presence, then type, then bounds, and every error is collected.",
  },
};
