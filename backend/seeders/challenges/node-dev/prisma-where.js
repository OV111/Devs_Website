export default {
  slug: "prisma-where",
  trackId: "node-dev",
  layerId: "node-dev-5",
  type: "CODE",
  difficulty: "hard",
  title: "Evaluate a Prisma where filter",
  summary: "Implement scalar operators, AND/OR/NOT, case-insensitive mode and relation filters (some, every, none, is).",
  description:
    "Prisma's <code>where</code> object is a small query language. Understanding how <code>contains</code>, <code>OR</code>, <code>not</code> and relation filters compose helps you write correct queries, and shows why <code>OR: []</code> returns nothing.",
  task:
    "Write <code>matchesWhere(record, filter)</code> returning whether the record satisfies the filter.",
  constraints: [
    "Every key of the filter must hold (implicit AND). A plain value means equality; <code>null</code> means the field is null or undefined.",
    "Operator objects: <code>equals, not, in, notIn, lt, lte, gt, gte, contains, startsWith, endsWith</code>, all of which must hold; <code>mode: 'insensitive'</code> makes string comparison (including <code>in/notIn</code>) case-insensitive. <code>not</code> may be a value (inequality) or a nested operator object (negated). Unknown operators throw <code>Error('Unknown operator: x')</code>. Dates compare by time value.",
    "<code>AND</code> (object or array): all must match, <code>[]</code> is true. <code>OR</code> (array): at least one, <code>[]</code> is false. <code>NOT</code> (object or array): none may match, <code>[]</code> is true. They nest.",
    "Relation filters apply when the field value is related data: <code>some</code>, <code>every</code>, <code>none</code> for arrays (a missing array counts as empty), <code>is</code> and <code>isNot</code> for a single related object (<code>is: null</code> means no related object). The nested value is itself a filter.",
  ],
  example: `matchesWhere({ name: 'Ann', age: 30 }, { OR: [{ name: { startsWith: 'B' } }, { age: { gte: 18 } }] }) // true`,
  tags: ["prisma","queries","filters","recursion"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "matchesWhere.js",
      lang: "js",
      code: `// matchesWhere.js
function matchesWhere(record, filter) {
  // your code here
}

module.exports = matchesWhere;`,
    },
  ],
  testFile: {
    name: "matchesWhere_test.js",
    lang: "test",
    code: `const matchesWhere = require('./matchesWhere');

test('equals', () => {
  expect(matchesWhere({ a: 1 }, { a: 1 })).toBe(true); expect(matchesWhere({ a: 1 }, { a: 2 })).toBe(false);
});

test('contains', () => {
  expect(matchesWhere({ n: 'hello' }, { n: { contains: 'ell' } })).toBe(true);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write three mutually recursive helpers: <code>matchFilter(record, filter)</code> (handles AND/OR/NOT and field keys), <code>matchField(value, cond)</code> (relation filters vs scalar), and <code>matchScalar(value, cond)</code> (operators)." },
    { order: 2, cost: 5, text: "Wrap a plain condition as equality (or null check) and otherwise loop over the operator object with a <code>switch</code>; <code>mode</code> is not an operator, only a flag." },
    { order: 3, cost: 15, text: "Treat a condition as a relation filter when it contains any of <code>some every none is isNot</code>. <code>[].concat(x)</code> normalizes 'object or array' to an array." },
  ],
  hiddenTests: [
    { name: "empty_filter_and_equality", code: `assert(matchesWhere({ a: 1 }, {}) === true, 'empty matches');
assert(matchesWhere({ a: 1, b: 'x' }, { a: 1, b: 'x' }) === true, 'all fields');
assert(matchesWhere({ a: 1, b: 'x' }, { a: 1, b: 'y' }) === false, 'one differs');` },
    { name: "null_means_null_or_missing", code: `assert(matchesWhere({ a: null }, { a: null }) === true && matchesWhere({}, { a: null }) === true, 'null or missing');
assert(matchesWhere({ a: 0 }, { a: null }) === false && matchesWhere({ a: '' }, { a: null }) === false, 'falsy values are not null');
assert(matchesWhere({ a: null }, { a: { equals: null } }) === true && matchesWhere({ a: 1 }, { a: { not: null } }) === true, 'equals/not null');` },
    { name: "comparison_operators", code: `const r = { n: 5 };
assert(matchesWhere(r, { n: { gt: 4 } }) && !matchesWhere(r, { n: { gt: 5 } }), 'gt');
assert(matchesWhere(r, { n: { gte: 5 } }) && !matchesWhere(r, { n: { gte: 6 } }), 'gte');
assert(matchesWhere(r, { n: { lt: 6 } }) && !matchesWhere(r, { n: { lt: 5 } }), 'lt');
assert(matchesWhere(r, { n: { lte: 5 } }) && !matchesWhere(r, { n: { lte: 4 } }), 'lte');
assert(matchesWhere(r, { n: { gt: 1, lt: 10 } }) && !matchesWhere(r, { n: { gt: 1, lt: 3 } }), 'range: all operators must hold');
assert(matchesWhere({ n: null }, { n: { gt: 1 } }) === false, 'null never satisfies a comparison');` },
    { name: "in_notIn_equals_not", code: `assert(matchesWhere({ r: 'a' }, { r: { in: ['a', 'b'] } }) && !matchesWhere({ r: 'c' }, { r: { in: ['a', 'b'] } }), 'in');
assert(matchesWhere({ r: 'c' }, { r: { notIn: ['a', 'b'] } }) && !matchesWhere({ r: 'a' }, { r: { notIn: ['a', 'b'] } }), 'notIn');
assert(matchesWhere({ r: 'a' }, { r: { equals: 'a' } }) && matchesWhere({ r: 'a' }, { r: { not: 'b' } }) && !matchesWhere({ r: 'a' }, { r: { not: 'a' } }), 'equals and not');` },
    { name: "string_operators_and_insensitive_mode", code: `const r = { name: 'Alice Smith' };
assert(matchesWhere(r, { name: { contains: 'ce S' } }) && matchesWhere(r, { name: { startsWith: 'Ali' } }) && matchesWhere(r, { name: { endsWith: 'Smith' } }), 'basic');
assert(!matchesWhere(r, { name: { contains: 'alice' } }), 'case-sensitive by default');
assert(matchesWhere(r, { name: { contains: 'alice', mode: 'insensitive' } }), 'insensitive contains');
assert(matchesWhere(r, { name: { startsWith: 'ALI', mode: 'insensitive' } }) && matchesWhere(r, { name: { endsWith: 'SMITH', mode: 'insensitive' } }), 'starts/ends');
assert(matchesWhere(r, { name: { equals: 'alice smith', mode: 'insensitive' } }), 'equals');
assert(matchesWhere(r, { name: { in: ['ALICE SMITH'], mode: 'insensitive' } }), 'in');
assert(matchesWhere({ name: null }, { name: { contains: 'a' } }) === false, 'null does not contain');` },
    { name: "not_with_nested_operators", code: `assert(matchesWhere({ n: 5 }, { n: { not: { gt: 10 } } }) === true, 'not (gt 10)');
assert(matchesWhere({ n: 15 }, { n: { not: { gt: 10 } } }) === false, 'negated');
assert(matchesWhere({ s: 'abc' }, { s: { not: { contains: 'b' } } }) === false, 'not contains');` },
    { name: "dates_compare_by_time", code: `const d = new Date('2024-05-01T00:00:00Z');
assert(matchesWhere({ at: d }, { at: new Date('2024-05-01T00:00:00Z') }) === true, 'equal dates');
assert(matchesWhere({ at: d }, { at: { gt: new Date('2024-01-01') } }) === true && matchesWhere({ at: d }, { at: { lt: new Date('2024-01-01') } }) === false, 'ordering');
assert(matchesWhere({ at: d }, { at: { in: [new Date('2024-05-01T00:00:00Z')] } }) === true, 'in with dates');` },
    { name: "AND_OR_NOT", code: `const r = { a: 1, b: 2 };
assert(matchesWhere(r, { AND: [{ a: 1 }, { b: 2 }] }) && !matchesWhere(r, { AND: [{ a: 1 }, { b: 3 }] }), 'AND array');
assert(matchesWhere(r, { AND: { a: 1 } }) === true, 'AND object');
assert(matchesWhere(r, { OR: [{ a: 9 }, { b: 2 }] }) && !matchesWhere(r, { OR: [{ a: 9 }, { b: 9 }] }), 'OR');
assert(matchesWhere(r, { NOT: { a: 9 } }) && !matchesWhere(r, { NOT: { a: 1 } }), 'NOT object');
assert(matchesWhere(r, { NOT: [{ a: 9 }, { b: 9 }] }) && !matchesWhere(r, { NOT: [{ a: 9 }, { b: 2 }] }), 'NOT array: none may match');` },
    { name: "empty_logical_arrays", code: `const r = { a: 1 };
assert(matchesWhere(r, { AND: [] }) === true, 'AND [] is true');
assert(matchesWhere(r, { OR: [] }) === false, 'OR [] is false');
assert(matchesWhere(r, { NOT: [] }) === true, 'NOT [] is true');` },
    { name: "logical_operators_combine_with_fields_and_nest", code: `const r = { role: 'admin', age: 30, name: 'Ann' };
assert(matchesWhere(r, { role: 'admin', OR: [{ age: { lt: 18 } }, { name: { startsWith: 'A' } }] }) === true, 'field plus OR');
assert(matchesWhere(r, { role: 'user', OR: [{ name: 'Ann' }] }) === false, 'field fails');
assert(matchesWhere(r, { AND: [{ OR: [{ age: 1 }, { age: 30 }] }, { NOT: { name: 'Bob' } }] }) === true, 'nested');` },
    { name: "relation_some_every_none", code: `const user = { posts: [{ title: 'a', views: 1 }, { title: 'b', views: 10 }] };
assert(matchesWhere(user, { posts: { some: { views: { gt: 5 } } } }) && !matchesWhere(user, { posts: { some: { views: { gt: 50 } } } }), 'some');
assert(matchesWhere(user, { posts: { every: { views: { gt: 0 } } } }) && !matchesWhere(user, { posts: { every: { views: { gt: 5 } } } }), 'every');
assert(matchesWhere(user, { posts: { none: { title: 'z' } } }) && !matchesWhere(user, { posts: { none: { title: 'a' } } }), 'none');
assert(matchesWhere(user, { posts: { some: {} } }) === true && matchesWhere({ posts: [] }, { posts: { some: {} } }) === false, 'some: {} means at least one related record');
assert(matchesWhere({ posts: [] }, { posts: { every: { views: 1 } } }) === true, 'every on an empty list is true');
assert(matchesWhere({ posts: [] }, { posts: { none: {} } }) === true && matchesWhere({}, { posts: { none: {} } }) === true, 'none: {} means no related records, missing counts as empty');` },
    { name: "relation_is_and_isNot", code: `const post = { author: { name: 'Ann' } };
assert(matchesWhere(post, { author: { is: { name: 'Ann' } } }) && !matchesWhere(post, { author: { is: { name: 'Bob' } } }), 'is');
assert(matchesWhere(post, { author: { isNot: { name: 'Bob' } } }) && !matchesWhere(post, { author: { isNot: { name: 'Ann' } } }), 'isNot');
assert(matchesWhere({ author: null }, { author: { is: null } }) === true && matchesWhere(post, { author: { is: null } }) === false, 'is null');
assert(matchesWhere(post, { author: { isNot: null } }) === true && matchesWhere({}, { author: { isNot: null } }) === false, 'isNot null');` },
    { name: "nested_relations", code: `const u = { posts: [{ comments: [{ text: 'hi' }, { text: 'bye' }] }] };
assert(matchesWhere(u, { posts: { some: { comments: { some: { text: { contains: 'by' } } } } } }) === true, 'relation inside relation');
assert(matchesWhere(u, { posts: { every: { comments: { none: { text: 'x' } } } } }) === true, 'every with none');` },
    { name: "unknown_operator_throws", code: `let err = null;
try { matchesWhere({ a: 1 }, { a: { regex: '.' } }); } catch (e) { err = e; }
assert(err && err.message === 'Unknown operator: regex', 'message: ' + (err && err.message));` },
  ],
  solution: {
    code: `function matchesWhere(record, filter) {
  const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);
  const eq = (a, b) => (a instanceof Date && b instanceof Date ? a.getTime() === b.getTime() : a === b);
  const fold = (v, insensitive) => (insensitive && typeof v === 'string' ? v.toLowerCase() : v);
  const RELATION_KEYS = ['some', 'every', 'none', 'is', 'isNot'];

  function matchScalar(value, cond) {
    if (!isPlain(cond)) return cond === null ? value === null || value === undefined : eq(value, cond);
    const insensitive = cond.mode === 'insensitive';
    for (const [op, arg] of Object.entries(cond)) {
      if (op === 'mode') continue;
      const v = fold(value, insensitive);
      const a = Array.isArray(arg) ? arg.map((x) => fold(x, insensitive)) : fold(arg, insensitive);
      let ok;
      switch (op) {
        case 'equals':
          ok = a === null ? value === null || value === undefined : eq(v, a);
          break;
        case 'not':
          if (isPlain(arg)) ok = !matchScalar(value, arg);
          else if (arg === null) ok = value !== null && value !== undefined;
          else ok = !eq(v, a);
          break;
        case 'in':
          ok = a.some((x) => eq(v, x));
          break;
        case 'notIn':
          ok = !a.some((x) => eq(v, x));
          break;
        case 'lt':
          ok = value !== null && value !== undefined && value < arg;
          break;
        case 'lte':
          ok = value !== null && value !== undefined && value <= arg;
          break;
        case 'gt':
          ok = value !== null && value !== undefined && value > arg;
          break;
        case 'gte':
          ok = value !== null && value !== undefined && value >= arg;
          break;
        case 'contains':
          ok = typeof v === 'string' && v.includes(a);
          break;
        case 'startsWith':
          ok = typeof v === 'string' && v.startsWith(a);
          break;
        case 'endsWith':
          ok = typeof v === 'string' && v.endsWith(a);
          break;
        default:
          throw new Error('Unknown operator: ' + op);
      }
      if (!ok) return false;
    }
    return true;
  }

  function matchRelation(value, cond) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    if ('some' in cond && !list.some((item) => matchFilter(item, cond.some))) return false;
    if ('every' in cond && !list.every((item) => matchFilter(item, cond.every))) return false;
    if ('none' in cond && list.some((item) => matchFilter(item, cond.none))) return false;
    const has = value !== null && value !== undefined;
    if ('is' in cond && !(cond.is === null ? !has : has && matchFilter(value, cond.is))) return false;
    if ('isNot' in cond && !(cond.isNot === null ? has : !has || !matchFilter(value, cond.isNot))) return false;
    return true;
  }

  function matchField(value, cond) {
    if (isPlain(cond) && RELATION_KEYS.some((k) => k in cond)) return matchRelation(value, cond);
    return matchScalar(value, cond);
  }

  function matchFilter(rec, f) {
    for (const [key, cond] of Object.entries(f)) {
      if (key === 'AND') {
        if (![].concat(cond).every((c) => matchFilter(rec, c))) return false;
      } else if (key === 'OR') {
        if (!cond.some((c) => matchFilter(rec, c))) return false;
      } else if (key === 'NOT') {
        if ([].concat(cond).some((c) => matchFilter(rec, c))) return false;
      } else if (!matchField(rec[key], cond)) {
        return false;
      }
    }
    return true;
  }

  return matchFilter(record, filter);
}

module.exports = matchesWhere;`,
    explanation:
      "A filter is evaluated by three small recursive layers: logical keys (AND/OR/NOT) call back into the filter matcher, field keys go to either the relation matcher or the operator matcher. Keeping the empty-array identities (AND [] true, OR [] false) falls out of every/some automatically.",
  },
};
