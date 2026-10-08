export default {
  slug: "n-plus-one-detector",
  trackId: "node-dev",
  layerId: "node-dev-9",
  type: "CODE",
  difficulty: "med",
  title: "Detect N+1 queries in a query log",
  summary: "Normalize SQL, find runs of the same SELECT repeated back to back, and separate real N+1 patterns from plain duplicates.",
  description:
    "The N+1 problem is the most common ORM performance bug: one query loads 100 posts, then 100 more queries load each author. Each query is fast, so nothing looks wrong, but the request does 101 round trips. Spotting it means recognizing that those queries are the same statement with different parameters.",
  task:
    "Write <code>detectNPlusOne(queries, { threshold = 5 })</code>. <code>queries</code> is an ordered array of <code>{ sql, params?, durationMs? }</code>. Return an array of findings sorted by <code>firstIndex</code>.",
  constraints: [
    "Normalize each SQL text into a <em>template</em>: trim, drop trailing semicolons, collapse whitespace, replace quoted strings (<code>'...'</code>, with <code>''</code> escapes), <code>$1</code>-style placeholders and numbers (not parts of identifiers like <code>t1</code>) with <code>?</code>, collapse <code>IN (?, ?, ?)</code> lists to <code>(?)</code>, then lowercase.",
    "Only statements whose template starts with <code>select</code> are considered. A <em>run</em> is a maximal sequence of CONSECUTIVE queries with the same template; runs shorter than <code>threshold</code> are ignored.",
    "A finding is <code>{ template, count, type, firstIndex, parentIndex, totalMs, suggestion }</code>. <code>type</code> is <code>'duplicate'</code> if every query in the run has the same SQL text AND params (identical queries), else <code>'n_plus_one'</code>. <code>parentIndex</code> is the index of the query just before the run if it exists, else <code>null</code>. <code>totalMs</code> sums <code>durationMs</code> (missing counts as 0).",
    "<code>suggestion</code> for <code>n_plus_one</code> mentions batching with <code>WHERE ... IN (...)</code> or a <code>JOIN</code>; for <code>duplicate</code> it mentions caching or reusing the result.",
    "Interleaved patterns (the same template with other queries in between) are NOT merged.",
  ],
  example: `detectNPlusOne([{ sql: 'SELECT * FROM posts' }, ...100 x { sql: 'SELECT * FROM users WHERE id = $1', params: [i] }])[0].type // 'n_plus_one'`,
  tags: ["performance","orm","sql","profiling"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "detectNPlusOne.js",
      lang: "js",
      code: `// detectNPlusOne.js
function detectNPlusOne(queries, options = {}) {
  // your code here
}

module.exports = detectNPlusOne;`,
    },
  ],
  testFile: {
    name: "detectNPlusOne_test.js",
    lang: "test",
    code: `const detectNPlusOne = require('./detectNPlusOne');

test('detects', () => {
  const q = [{ sql: 'SELECT * FROM posts' }, ...[1, 2, 3, 4, 5].map((i) => ({ sql: 'SELECT * FROM users WHERE id = $1', params: [i] }))]; const r = detectNPlusOne(q); expect(r.length).toBe(1); expect(r[0].type).toBe('n_plus_one'); expect(r[0].count).toBe(5);
});

test('below_threshold', () => {
  expect(detectNPlusOne([{ sql: 'SELECT 1' }, { sql: 'SELECT 1' }])).toEqual([]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write <code>normalize(sql)</code> as a chain of <code>replace</code> calls in a careful order: quoted strings first, then <code>$n</code>, then numbers with <code>\\b\\d+(\\.\\d+)?\\b</code>, then <code>IN</code> lists, then lowercase." },
    { order: 2, cost: 5, text: "Loop over the queries once, extending the current run while the template matches, and flush the run into a finding when it ends." },
    { order: 3, cost: 15, text: "For the type, compare <code>JSON.stringify([sql.trim(), params])</code> of every query in the run with the first one." },
  ],
  hiddenTests: [
    { name: "normalization_treats_parameters_as_the_same_statement", code: `const mk = (sqls) => sqls.map((sql) => ({ sql }));
const r = detectNPlusOne(mk([
  "SELECT * FROM users WHERE id = 1", "select  *  from users where id = 22;", "SELECT * FROM users WHERE id = $1", "SELECT * FROM users WHERE id = '7'", "SELECT * FROM users WHERE id = 4.5",
]));
assert(r.length === 1 && r[0].count === 5, 'one run of five: ' + JSON.stringify(r));
assert(r[0].template === 'select * from users where id = ?', 'template: ' + r[0].template);` },
    { name: "identifiers_with_digits_and_strings_with_numbers", code: `const t = (sql) => detectNPlusOne(Array.from({ length: 5 }, () => ({ sql })))[0].template;
assert(t('SELECT t1.id FROM table2 t1 WHERE t1.x = 5') === 'select t1.id from table2 t1 where t1.x = ?', 'digits inside identifiers survive: ' + t('SELECT t1.id FROM table2 t1 WHERE t1.x = 5'));
assert(t("SELECT * FROM a WHERE name = 'bob 42, it''s'") === 'select * from a where name = ?', 'a quoted string with digits, commas and an escaped quote becomes one placeholder: ' + t("SELECT * FROM a WHERE name = 'bob 42, it''s'"));
assert(t('SELECT * FROM a LIMIT 10') === 'select * from a limit ?', 'LIMIT numbers');` },
    { name: "in_lists_collapse", code: `const qs = [[1, 2], [3], [4, 5, 6, 7], [8, 9], [10, 11, 12]].map((ids) => ({ sql: 'SELECT * FROM users WHERE id IN (' + ids.join(', ') + ')' }));
const r = detectNPlusOne(qs);
assert(r.length === 1 && r[0].count === 5 && r[0].template === 'select * from users where id in (?)', JSON.stringify(r));
const ph = detectNPlusOne(Array.from({ length: 5 }, () => ({ sql: 'SELECT * FROM u WHERE id IN ($1, $2, $3)' })));
assert(ph[0].template === 'select * from u where id in (?)', 'placeholder lists too: ' + ph[0].template);` },
    { name: "threshold", code: `const q = (n) => Array.from({ length: n }, (_, i) => ({ sql: 'SELECT * FROM a WHERE id = ' + i, params: [i] }));
assert(detectNPlusOne(q(4)).length === 0, 'default threshold is 5');
assert(detectNPlusOne(q(5)).length === 1, 'five is enough');
assert(detectNPlusOne(q(3), { threshold: 3 }).length === 1, 'custom threshold');
assert(detectNPlusOne(q(10), { threshold: 11 }).length === 0, 'higher threshold');` },
    { name: "n_plus_one_finding_shape_parent_and_timing", code: `const queries = [
  { sql: 'SELECT * FROM posts LIMIT 5', durationMs: 4 },
  ...[1, 2, 3, 4, 5].map((i) => ({ sql: 'SELECT * FROM authors WHERE id = $1', params: [i], durationMs: 2 })),
  { sql: 'SELECT 1', durationMs: 1 },
];
const r = detectNPlusOne(queries);
assert(r.length === 1, 'one finding');
const f = r[0];
assert(f.type === 'n_plus_one' && f.count === 5 && f.firstIndex === 1 && f.parentIndex === 0 && f.totalMs === 10, JSON.stringify(f));
assert(f.suggestion.indexOf('IN') !== -1 && f.suggestion.indexOf('JOIN') !== -1, 'suggestion: ' + f.suggestion);
assert(Object.keys(f).sort().join() === 'count,firstIndex,parentIndex,suggestion,template,totalMs,type', 'keys: ' + Object.keys(f));` },
    { name: "duplicate_queries_are_a_different_problem", code: `const same = Array.from({ length: 6 }, () => ({ sql: 'SELECT * FROM settings WHERE key = $1', params: ['theme'], durationMs: 1 }));
const r = detectNPlusOne(same);
assert(r.length === 1 && r[0].type === 'duplicate' && r[0].count === 6 && r[0].totalMs === 6, JSON.stringify(r));
assert(/cach|reus/i.test(r[0].suggestion), 'suggestion: ' + r[0].suggestion);
const mixed = Array.from({ length: 5 }, (_, i) => ({ sql: 'SELECT * FROM settings WHERE key = $1', params: [i % 2 ? 'a' : 'b'] }));
assert(detectNPlusOne(mixed)[0].type === 'n_plus_one', 'different params make it an N+1');
const literalDup = Array.from({ length: 5 }, () => ({ sql: 'SELECT * FROM t WHERE id = 7' }));
assert(detectNPlusOne(literalDup)[0].type === 'duplicate', 'identical literal SQL is a duplicate');
const literalDiff = Array.from({ length: 5 }, (_, i) => ({ sql: 'SELECT * FROM t WHERE id = ' + i }));
assert(detectNPlusOne(literalDiff)[0].type === 'n_plus_one', 'different literals are an N+1');` },
    { name: "parent_index_is_null_at_the_start", code: `const r = detectNPlusOne(Array.from({ length: 5 }, (_, i) => ({ sql: 'SELECT * FROM a WHERE id = ' + i })));
assert(r[0].firstIndex === 0 && r[0].parentIndex === null, JSON.stringify(r[0]));` },
    { name: "only_selects_count", code: `const writes = Array.from({ length: 8 }, (_, i) => ({ sql: 'INSERT INTO logs (n) VALUES (' + i + ')' }));
assert(detectNPlusOne(writes).length === 0, 'bulk inserts are a different problem');
const upd = Array.from({ length: 8 }, (_, i) => ({ sql: 'UPDATE t SET a = ' + i + ' WHERE id = ' + i }));
assert(detectNPlusOne(upd).length === 0, 'updates too');` },
    { name: "runs_must_be_consecutive", code: `const a = (i) => ({ sql: 'SELECT * FROM a WHERE id = ' + i });
const b = { sql: 'SELECT * FROM other' };
const interleaved = [a(1), a(2), b, a(3), a(4), b, a(5)];
assert(detectNPlusOne(interleaved).length === 0, 'interleaved queries are not merged');
const split = [a(1), a(2), a(3), a(4), a(5), b, a(6), a(7)];
const r = detectNPlusOne(split);
assert(r.length === 1 && r[0].count === 5, 'only the long consecutive run counts: ' + JSON.stringify(r));` },
    { name: "multiple_findings_sorted_by_position", code: `const mkRun = (table, n) => Array.from({ length: n }, (_, i) => ({ sql: 'SELECT * FROM ' + table + ' WHERE id = ' + i }));
const queries = [{ sql: 'SELECT * FROM root' }, ...mkRun('users', 5), { sql: 'SELECT * FROM mid' }, ...mkRun('orders', 6)];
const r = detectNPlusOne(queries);
assert(r.length === 2, 'two findings');
assert(r[0].template.indexOf('users') !== -1 && r[0].firstIndex === 1 && r[0].parentIndex === 0, 'first: ' + JSON.stringify(r[0]));
assert(r[1].template.indexOf('orders') !== -1 && r[1].firstIndex === 7 && r[1].parentIndex === 6 && r[1].count === 6, 'second: ' + JSON.stringify(r[1]));` },
    { name: "adjacent_runs_of_different_templates_do_not_merge", code: `const queries = [
  ...Array.from({ length: 5 }, (_, i) => ({ sql: 'SELECT * FROM users WHERE id = ' + i })),
  ...Array.from({ length: 5 }, (_, i) => ({ sql: 'SELECT * FROM posts WHERE id = ' + i })),
];
const r = detectNPlusOne(queries);
assert(r.length === 2 && r[0].count === 5 && r[1].count === 5, JSON.stringify(r.map((x) => x.count)));
assert(r[1].parentIndex === 4, 'the parent of the second run is the last query of the first');` },
    { name: "missing_durations_and_empty_input", code: `assert(detectNPlusOne([]).length === 0, 'empty log');
const r = detectNPlusOne(Array.from({ length: 5 }, (_, i) => ({ sql: 'SELECT * FROM a WHERE id = ' + i })));
assert(r[0].totalMs === 0, 'no durations means 0');
const part = detectNPlusOne([{ sql: 'SELECT 1 FROM a WHERE x = 1', durationMs: 5 }, ...Array.from({ length: 4 }, (_, i) => ({ sql: 'SELECT 1 FROM a WHERE x = ' + (i + 2) }))]);
assert(part[0].totalMs === 5, 'partially missing durations: ' + part[0].totalMs);` },
    { name: "with_and_other_statements_are_not_selects", code: `const q = Array.from({ length: 6 }, (_, i) => ({ sql: 'WITH x AS (SELECT ' + i + ') SELECT * FROM x' }));
assert(detectNPlusOne(q).length === 0, 'only templates beginning with select are reported');` },
  ],
  solution: {
    code: `function detectNPlusOne(queries, { threshold = 5 } = {}) {
  const normalize = (sql) =>
    sql
      .trim()
      .replace(/;+\\s*$/, '')
      .replace(/\\s+/g, ' ')
      .replace(/'(?:[^']|'')*'/g, '?')
      .replace(/\\$\\d+/g, '?')
      .replace(/\\b\\d+(?:\\.\\d+)?\\b/g, '?')
      .replace(/\\(\\s*\\?(?:\\s*,\\s*\\?)*\\s*\\)/g, '(?)')
      .toLowerCase();

  const identity = (q) => JSON.stringify([q.sql.trim(), q.params]);
  const findings = [];

  function flush(start, end, template) {
    const count = end - start;
    if (count < threshold || !template.startsWith('select')) return;
    const run = queries.slice(start, end);
    const first = identity(run[0]);
    const identical = run.every((q) => identity(q) === first);
    findings.push({
      template,
      count,
      type: identical ? 'duplicate' : 'n_plus_one',
      firstIndex: start,
      parentIndex: start > 0 ? start - 1 : null,
      totalMs: run.reduce((sum, q) => sum + (q.durationMs || 0), 0),
      suggestion: identical
        ? 'This identical query runs repeatedly: cache or reuse its result.'
        : 'Load all rows in one query with WHERE ... IN (...) or a JOIN (for example Prisma include, or a DataLoader).',
    });
  }

  let start = 0;
  let current = null;
  queries.forEach((query, i) => {
    const template = normalize(query.sql);
    if (current === null) {
      current = template;
      start = i;
    } else if (template !== current) {
      flush(start, i, current);
      current = template;
      start = i;
    }
  });
  if (current !== null) flush(start, queries.length, current);
  return findings;
}

module.exports = detectNPlusOne;`,
    explanation:
      "N+1 queries are invisible individually, so detection works on the normalized template: replace every literal with a placeholder and identical statements collapse to one string. A run of the same template back to back, after a parent query, is the signature of a loop that queries per row.",
  },
};
