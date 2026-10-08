export default {
  slug: "sql-where-builder",
  trackId: "api-dev",
  layerId: "api-dev-5",
  type: "CODE",
  difficulty: "med",
  title: "Build a parameterized SQL WHERE clause",
  summary: "Turn a filter object into 'WHERE ...' text plus a values array, safe from SQL injection.",
  description:
    "Never concatenate user input into SQL. Drivers like node-postgres take <code>$1, $2</code> placeholders and a separate values array. Query builders do exactly this.",
  task:
    "Write <code>buildWhere(filters)</code> returning <code>{ text, values }</code>.",
  constraints: [
    "Scalar: <code>col = $n</code>. <code>null</code>: <code>col IS NULL</code>. Array: <code>col = ANY($n)</code> with the whole array as one value.",
    "Object with operators <code>gt gte lt lte ne</code>: <code>&gt; &gt;= &lt; &lt;= &lt;&gt;</code>, one condition per operator.",
    "Conditions are joined with <code> AND </code>; <code>text</code> starts with <code>WHERE </code>, or is <code>''</code> if there are none.",
    "Placeholders are numbered in the order values are pushed.",
    "Skip <code>undefined</code> values. Throw on a column name that isn't <code>[A-Za-z_][A-Za-z0-9_]*</code> or on an unknown operator.",
  ],
  example: `buildWhere({ name: 'ann', age: { gte: 18 } }) // { text: 'WHERE name = $1 AND age >= $2', values: ['ann', 18] }`,
  tags: ["sql","security","postgres"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "buildWhere.js",
      lang: "js",
      code: `// buildWhere.js
function buildWhere(filters) {
  // your code here
}

module.exports = buildWhere;`,
    },
  ],
  testFile: {
    name: "buildWhere_test.js",
    lang: "test",
    code: `const buildWhere = require('./buildWhere');

test('scalar', () => {
  expect(buildWhere({ a: 1 })).toEqual({ text: 'WHERE a = $1', values: [1] });
});

test('empty', () => {
  expect(buildWhere({})).toEqual({ text: '', values: [] });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>values</code> array and a tiny helper that pushes a value and returns <code>'$' + values.length</code>." },
    { order: 2, cost: 5, text: "Column names can't be parameters, so validate them with a regular expression instead; that is your injection guard there." },
    { order: 3, cost: 15, text: "Check <code>null</code> before <code>typeof === 'object'</code>, because <code>typeof null</code> is 'object'." },
  ],
  hiddenTests: [
    { name: "scalar_and_order", code: `const r = buildWhere({ name: 'ann', active: true });
assert(r.text === 'WHERE name = $1 AND active = $2', r.text);
assert(r.values.length === 2 && r.values[0] === 'ann' && r.values[1] === true, 'values');` },
    { name: "empty_filters", code: `const r = buildWhere({});
assert(r.text === '' && r.values.length === 0, 'no where');` },
    { name: "null_is_is_null", code: `const r = buildWhere({ deletedAt: null, a: 1 });
assert(r.text === 'WHERE deletedAt IS NULL AND a = $1', r.text);
assert(r.values.length === 1, 'null adds no value');` },
    { name: "array_is_any", code: `const r = buildWhere({ role: ['a', 'b'] });
assert(r.text === 'WHERE role = ANY($1)', r.text);
assert(Array.isArray(r.values[0]) && r.values[0].length === 2, 'array is one value');` },
    { name: "operators", code: `const r = buildWhere({ age: { gte: 18, lt: 65 }, n: { ne: 3 } });
assert(r.text === 'WHERE age >= $1 AND age < $2 AND n <> $3', r.text);
assert(r.values.join(',') === '18,65,3', 'values');` },
    { name: "skips_undefined", code: `const r = buildWhere({ a: undefined, b: 2 });
assert(r.text === 'WHERE b = $1' && r.values[0] === 2, 'undefined skipped');` },
    { name: "rejects_bad_column", code: `let threw = false;
try { buildWhere({ 'a; DROP TABLE users': 1 }); } catch (e) { threw = true; }
assert(threw, 'injection via column name must throw');` },
    { name: "rejects_bad_operator", code: `let threw = false;
try { buildWhere({ a: { like: 'x' } }); } catch (e) { threw = true; }
assert(threw, 'unknown operator must throw');` },
  ],
  solution: {
    code: `function buildWhere(filters) {
  const parts = [];
  const values = [];
  const ops = { gt: '>', gte: '>=', lt: '<', lte: '<=', ne: '<>' };
  const ph = (v) => { values.push(v); return '$' + values.length; };
  for (const [col, cond] of Object.entries(filters)) {
    if (cond === undefined) continue;
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(col)) throw new Error('Invalid column: ' + col);
    if (cond === null) {
      parts.push(col + ' IS NULL');
    } else if (Array.isArray(cond)) {
      parts.push(col + ' = ANY(' + ph(cond) + ')');
    } else if (typeof cond === 'object') {
      for (const [op, v] of Object.entries(cond)) {
        if (!ops[op]) throw new Error('Invalid operator: ' + op);
        parts.push(col + ' ' + ops[op] + ' ' + ph(v));
      }
    } else {
      parts.push(col + ' = ' + ph(cond));
    }
  }
  return { text: parts.length ? 'WHERE ' + parts.join(' AND ') : '', values };
}

module.exports = buildWhere;`,
    explanation:
      "Values never touch the SQL text; they go into the values array and a numbered placeholder takes their place. Column names and operators can't be parameters, so they are checked against an allow-list pattern.",
  },
};
