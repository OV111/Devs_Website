export default {
  slug: "join-arrays",
  trackId: "api-dev",
  layerId: "api-dev-5",
  type: "CODE",
  difficulty: "med",
  title: "Join two arrays like SQL",
  summary: "Implement inner and left joins on two arrays of rows, using a hash index.",
  description:
    "A JOIN matches rows from two tables on a key. Doing it by hand in application code is common, and the naive nested loop is O(n*m).",
  task:
    "Write <code>joinTables(left, right, { leftKey, rightKey, type = 'inner' })</code> returning an array of merged rows <code>{ ...leftRow, ...rightRow }</code>.",
  constraints: [
    "Matches use strict equality of <code>left[leftKey]</code> and <code>right[rightKey]</code>.",
    "Several right rows can match one left row: produce one output row per match.",
    "<code>type: 'left'</code> keeps unmatched left rows (just the left fields); <code>'inner'</code> drops them.",
    "Output follows left order, and within one left row, right order.",
    "Do not mutate the inputs. Build a <code>Map</code> from the right side so the work is O(n + m).",
  ],
  example: `joinTables([{ id: 1 }], [{ uid: 1, plan: 'pro' }], { leftKey: 'id', rightKey: 'uid' }) // [{ id: 1, uid: 1, plan: 'pro' }]`,
  tags: ["sql","joins","algorithms"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "joinTables.js",
      lang: "js",
      code: `// joinTables.js
function joinTables(left, right, options) {
  // your code here
}

module.exports = joinTables;`,
    },
  ],
  testFile: {
    name: "joinTables_test.js",
    lang: "test",
    code: `const joinTables = require('./joinTables');

test('inner', () => {
  const r = joinTables([{ id: 1 }, { id: 2 }], [{ uid: 1, p: 'x' }], { leftKey: 'id', rightKey: 'uid' }); expect(r.length).toBe(1);
});

test('left_keeps', () => {
  const r = joinTables([{ id: 2 }], [], { leftKey: 'id', rightKey: 'uid', type: 'left' }); expect(r).toEqual([{ id: 2 }]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "First loop over <code>right</code> once, grouping rows into a <code>Map</code> from key to array of rows." },
    { order: 2, cost: 5, text: "Then loop over <code>left</code> and look up its key in the map: O(1) per lookup." },
    { order: 3, cost: 15, text: "For a left join, push <code>{ ...l }</code> when the lookup finds nothing." },
  ],
  hiddenTests: [
    { name: "inner_drops_unmatched", code: `const r = joinTables([{ id: 1 }, { id: 2 }], [{ uid: 1, p: 'x' }], { leftKey: 'id', rightKey: 'uid' });
assert(r.length === 1 && r[0].id === 1 && r[0].p === 'x', 'only the match');` },
    { name: "left_keeps_unmatched", code: `const r = joinTables([{ id: 1 }, { id: 2 }], [{ uid: 1, p: 'x' }], { leftKey: 'id', rightKey: 'uid', type: 'left' });
assert(r.length === 2 && r[1].id === 2 && !('p' in r[1]), 'unmatched left row stays');` },
    { name: "one_to_many", code: `const r = joinTables([{ id: 1 }], [{ uid: 1, n: 'a' }, { uid: 1, n: 'b' }], { leftKey: 'id', rightKey: 'uid' });
assert(r.length === 2 && r[0].n === 'a' && r[1].n === 'b', 'one row per match, right order');` },
    { name: "left_order_preserved", code: `const r = joinTables([{ id: 3 }, { id: 1 }], [{ uid: 1 }, { uid: 3 }], { leftKey: 'id', rightKey: 'uid' });
assert(r[0].id === 3 && r[1].id === 1, 'left order');` },
    { name: "strict_equality", code: `const r = joinTables([{ id: 1 }], [{ uid: '1' }], { leftKey: 'id', rightKey: 'uid' });
assert(r.length === 0, '1 !== "1"');` },
    { name: "does_not_mutate", code: `const l = [{ id: 1 }]; const rr = [{ uid: 1, p: 'x' }];
joinTables(l, rr, { leftKey: 'id', rightKey: 'uid' });
assert(!('p' in l[0]) && Object.keys(rr[0]).length === 2, 'inputs untouched');` },
    { name: "empty_inputs", code: `assert(joinTables([], [{ uid: 1 }], { leftKey: 'id', rightKey: 'uid' }).length === 0, 'empty left');
assert(joinTables([{ id: 1 }], [], { leftKey: 'id', rightKey: 'uid' }).length === 0, 'inner with empty right');` },
  ],
  solution: {
    code: `function joinTables(left, right, { leftKey, rightKey, type = 'inner' }) {
  const index = new Map();
  for (const r of right) {
    const k = r[rightKey];
    if (!index.has(k)) index.set(k, []);
    index.get(k).push(r);
  }
  const out = [];
  for (const l of left) {
    const matches = index.get(l[leftKey]);
    if (matches) {
      for (const r of matches) out.push({ ...l, ...r });
    } else if (type === 'left') {
      out.push({ ...l });
    }
  }
  return out;
}

module.exports = joinTables;`,
    explanation:
      "Index the right side once in a Map, then each left row is a single O(1) lookup. This is how hash joins work inside databases.",
  },
};
