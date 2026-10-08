export default {
  slug: "mongo-filter-from-query",
  trackId: "api-dev",
  layerId: "api-dev-5",
  type: "CODE",
  difficulty: "med",
  title: "Safe Mongo filter from a query string",
  summary: "Turn ?age[gte]=18&status=active into a Mongo filter, with a field whitelist and NoSQL-injection guard.",
  description:
    "Passing <code>req.query</code> straight into <code>find()</code> lets an attacker send <code>?password[$ne]=x</code>. A whitelist and strict parsing prevent it.",
  task:
    "Write <code>toMongoFilter(query, allowed)</code>. <code>query</code> maps keys like <code>'age[gte]'</code> to strings. Return a Mongo filter object.",
  constraints: [
    "Only fields in <code>allowed</code> are used; everything else is ignored.",
    "Plain key: equality. Bracket key with <code>gt gte lt lte ne in</code>: becomes <code>{ $op: value }</code>; other operators are ignored.",
    "<code>in</code> splits on commas.",
    "Values must be strings (a non-string value is ignored). Convert <code>'true'/'false'</code> to booleans and numeric strings to numbers.",
    "Several operators on one field merge into one object.",
  ],
  example: `toMongoFilter({ 'age[gte]': '18', 'age[lt]': '65', status: 'active' }, ['age', 'status']) // { age: { $gte: 18, $lt: 65 }, status: 'active' }`,
  tags: ["mongodb","security","nosql-injection"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "toMongoFilter.js",
      lang: "js",
      code: `// toMongoFilter.js
function toMongoFilter(query, allowed) {
  // your code here
}

module.exports = toMongoFilter;`,
    },
  ],
  testFile: {
    name: "toMongoFilter_test.js",
    lang: "test",
    code: `const toMongoFilter = require('./toMongoFilter');

test('equality', () => {
  expect(toMongoFilter({ status: 'active' }, ['status'])).toEqual({ status: 'active' });
});

test('not_allowed', () => {
  expect(toMongoFilter({ role: 'admin' }, ['status'])).toEqual({});
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Match each key with a regular expression: a field name, then an optional <code>[op]</code>." },
    { order: 2, cost: 5, text: "Skip the entry unless the field is in <code>allowed</code> and the raw value is a string." },
    { order: 3, cost: 15, text: "Write one small <code>convert()</code> that maps 'true'/'false' and numeric strings; reuse it for each item of an <code>in</code> list." },
  ],
  hiddenTests: [
    { name: "equality_and_conversion", code: `const r = toMongoFilter({ status: 'active', n: '5', ok: 'true' }, ['status', 'n', 'ok']);
assert(r.status === 'active' && r.n === 5 && r.ok === true, 'conversion');` },
    { name: "operators_merge", code: `const r = toMongoFilter({ 'age[gte]': '18', 'age[lt]': '65' }, ['age']);
assert(r.age.$gte === 18 && r.age.$lt === 65, 'merged operators');` },
    { name: "in_operator", code: `const r = toMongoFilter({ 'tag[in]': 'a,b,3' }, ['tag']);
assert(Array.isArray(r.tag.$in) && r.tag.$in.length === 3 && r.tag.$in[2] === 3, '$in list');` },
    { name: "whitelist", code: `const r = toMongoFilter({ role: 'admin', status: 'x' }, ['status']);
assert(!('role' in r) && r.status === 'x', 'non-allowed fields dropped');` },
    { name: "unknown_operator_ignored", code: `const r = toMongoFilter({ 'age[where]': '1', 'age[regex]': 'x' }, ['age']);
assert(Object.keys(r).length === 0, 'only known operators');` },
    { name: "injection_objects_ignored", code: `const r = toMongoFilter({ password: { $ne: null }, name: ['a'] }, ['password', 'name']);
assert(Object.keys(r).length === 0, 'non-string values must be ignored');` },
    { name: "dollar_keys_ignored", code: `const r = toMongoFilter({ '$where': '1', 'a[$ne]': '1' }, ['a', '$where']);
assert(Object.keys(r).length === 0, 'keys with $ never match');` },
    { name: "empty_string_stays_string", code: `const r = toMongoFilter({ q: '' }, ['q']);
assert(r.q === '', 'empty string is not 0');` },
  ],
  solution: {
    code: `function toMongoFilter(query, allowed) {
  const convert = (v) => {
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (v !== '' && !isNaN(Number(v))) return Number(v);
    return v;
  };
  const ops = ['gt', 'gte', 'lt', 'lte', 'ne', 'in'];
  const out = {};
  for (const [key, raw] of Object.entries(query)) {
    if (typeof raw !== 'string') continue;
    const m = /^([A-Za-z_][A-Za-z0-9_]*)(?:\\[(\\w+)\\])?$/.exec(key);
    if (!m || !allowed.includes(m[1])) continue;
    const field = m[1];
    const op = m[2];
    if (!op) {
      out[field] = convert(raw);
    } else if (ops.includes(op)) {
      if (typeof out[field] !== 'object') out[field] = {};
      out[field]['$' + op] = op === 'in' ? raw.split(',').map(convert) : convert(raw);
    }
  }
  return out;
}

module.exports = toMongoFilter;`,
    explanation:
      "Three guards stop NoSQL injection: a field whitelist, a strict key pattern, and strings only. Operators are looked up in a fixed list, never taken from the input.",
  },
};
