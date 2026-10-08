export default {
  slug: "diff-keyed-list",
  trackId: "mern",
  layerId: "mern-3",
  type: "CODE",
  difficulty: "med",
  title: "Why list keys matter: reconcile a keyed list",
  summary: "Compute the insert, move and remove operations React needs to turn one keyed list into another.",
  description:
    "When you render a list, React uses each item's <code>key</code> to decide which DOM nodes to reuse, move, create or delete. With stable keys, inserting at the front is one operation; with index keys, everything changes. This is React's actual last-placed-index algorithm.",
  task:
    "Write <code>diffKeyed(oldKeys, newKeys)</code> returning an array of operations: <code>{ type: 'remove', key }</code>, <code>{ type: 'insert', key, index }</code> and <code>{ type: 'move', key, index }</code> (<code>index</code> is the position in the NEW list).",
  constraints: [
    "First, one <code>remove</code> per old key missing from the new list, in old order.",
    "Then walk the new list in order, keeping <code>lastPlaced = 0</code> (the highest old index seen so far). A key not in the old list is an <code>insert</code> at its new index. For an existing key with old index <code>old</code>: if <code>old &lt; lastPlaced</code> it must <code>move</code> to its new index; otherwise it stays and <code>lastPlaced = old</code>.",
    "Keys that stay put produce no operation.",
    "A duplicate key in either list throws <code>Error('Duplicate key: &lt;key&gt;')</code>.",
    "Keys can be strings or numbers.",
  ],
  example: `diffKeyed(['a','b','c'], ['x','a','b','c']) // [{ type: 'insert', key: 'x', index: 0 }]`,
  tags: ["react","keys","reconciliation","lists"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "diffKeyed.js",
      lang: "js",
      code: `// diffKeyed.js
function diffKeyed(oldKeys, newKeys) {
  // your code here
}

module.exports = diffKeyed;`,
    },
  ],
  testFile: {
    name: "diffKeyed_test.js",
    lang: "test",
    code: `const diffKeyed = require('./diffKeyed');

test('prepend_is_one_insert', () => {
  expect(diffKeyed(['a', 'b'], ['x', 'a', 'b'])).toEqual([{ type: 'insert', key: 'x', index: 0 }]);
});

test('identical', () => {
  expect(diffKeyed(['a'], ['a'])).toEqual([]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Build a <code>Map</code> from each old key to its old index; use a <code>Set</code> to detect duplicates while you build it (and one for the new keys)." },
    { order: 2, cost: 5, text: "Emit the removals first by scanning the old list for keys that are not in the new key set." },
    { order: 3, cost: 15, text: "Then loop over the new list with <code>forEach((key, index) =&gt; ...)</code> keeping <code>lastPlaced</code>; that single number is the whole algorithm." },
  ],
  hiddenTests: [
    { name: "no_change_and_empty", code: `assert(diffKeyed(['a', 'b'], ['a', 'b']).length === 0, 'same');
assert(diffKeyed([], []).length === 0, 'both empty');` },
    { name: "append_and_prepend_are_single_inserts", code: `const a = diffKeyed(['a', 'b', 'c'], ['a', 'b', 'c', 'd']);
assert(a.length === 1 && a[0].type === 'insert' && a[0].key === 'd' && a[0].index === 3, 'append');
const p = diffKeyed(['a', 'b', 'c'], ['x', 'a', 'b', 'c']);
assert(p.length === 1 && p[0].type === 'insert' && p[0].key === 'x' && p[0].index === 0, 'prepend does not touch the others');` },
    { name: "insert_in_the_middle", code: `const r = diffKeyed(['a', 'c'], ['a', 'b', 'c']);
assert(r.length === 1 && r[0].type === 'insert' && r[0].key === 'b' && r[0].index === 1, JSON.stringify(r));` },
    { name: "remove_leaves_others_in_place", code: `const r = diffKeyed(['a', 'b', 'c'], ['a', 'c']);
assert(r.length === 1 && r[0].type === 'remove' && r[0].key === 'b', JSON.stringify(r));
const all = diffKeyed(['a', 'b'], []);
assert(all.map((o) => o.type + o.key).join() === 'removea,removeb', 'removals follow old order');
const fill = diffKeyed([], ['x', 'y']);
assert(fill.map((o) => o.type + o.key + o.index).join() === 'insertx0,inserty1', 'inserts into an empty list');` },
    { name: "moving_the_last_item_to_the_front_costs_n_minus_one_moves", code: `const r = diffKeyed(['a', 'b', 'c', 'd'], ['d', 'a', 'b', 'c']);
assert(r.length === 3 && r.every((o) => o.type === 'move'), 'three moves: ' + JSON.stringify(r));
assert(r.map((o) => o.key + '@' + o.index).join() === 'a@1,b@2,c@3', 'which ones: ' + JSON.stringify(r));` },
    { name: "moving_the_first_item_to_the_end_is_one_move", code: `const r = diffKeyed(['a', 'b', 'c', 'd'], ['b', 'c', 'd', 'a']);
assert(r.length === 1 && r[0].type === 'move' && r[0].key === 'a' && r[0].index === 3, JSON.stringify(r));` },
    { name: "reverse", code: `const r = diffKeyed(['a', 'b', 'c', 'd'], ['d', 'c', 'b', 'a']);
assert(r.map((o) => o.key + '@' + o.index).join() === 'c@1,b@2,a@3' && r.every((o) => o.type === 'move'), JSON.stringify(r));` },
    { name: "swap_two_neighbours", code: `const r = diffKeyed(['a', 'b', 'c'], ['b', 'a', 'c']);
assert(r.length === 1 && r[0].type === 'move' && r[0].key === 'a' && r[0].index === 1, JSON.stringify(r));` },
    { name: "mixed_operations_in_order", code: `const r = diffKeyed(['a', 'b', 'c', 'd', 'e'], ['b', 'e', 'x', 'a']);
assert(r.map((o) => o.type + ':' + o.key + (o.index === undefined ? '' : '@' + o.index)).join(' ') === 'remove:c remove:d insert:x@2 move:a@3', 'ops: ' + r.map((o) => o.type + ':' + o.key).join(' '));` },
    { name: "complete_replacement", code: `const r = diffKeyed(['a', 'b'], ['c', 'd']);
assert(r.map((o) => o.type + o.key).join() === 'removea,removeb,insertc,insertd', JSON.stringify(r));` },
    { name: "numbers_as_keys_and_no_coercion", code: `const r = diffKeyed([1, 2, 3], [3, 1]);
assert(r.map((o) => o.type + ':' + o.key).join(' ') === 'remove:2 move:1', 'numeric keys: ' + JSON.stringify(r));
const t = diffKeyed(['1'], [1]);
assert(t.length === 2 && t[0].type === 'remove' && t[1].type === 'insert', 'string "1" and number 1 are different keys');` },
    { name: "duplicate_keys_throw", code: `let e1 = null; let e2 = null;
try { diffKeyed(['a', 'a'], ['a']); } catch (e) { e1 = e; }
try { diffKeyed(['a'], ['b', 'b']); } catch (e) { e2 = e; }
assert(e1 && e1.message === 'Duplicate key: a', 'old list: ' + (e1 && e1.message));
assert(e2 && e2.message === 'Duplicate key: b', 'new list: ' + (e2 && e2.message));` },
  ],
  solution: {
    code: `function diffKeyed(oldKeys, newKeys) {
  const oldIndex = new Map();
  oldKeys.forEach((key, i) => {
    if (oldIndex.has(key)) throw new Error('Duplicate key: ' + key);
    oldIndex.set(key, i);
  });
  const newSet = new Set();
  for (const key of newKeys) {
    if (newSet.has(key)) throw new Error('Duplicate key: ' + key);
    newSet.add(key);
  }

  const ops = [];
  for (const key of oldKeys) {
    if (!newSet.has(key)) ops.push({ type: 'remove', key });
  }

  let lastPlaced = 0;
  newKeys.forEach((key, index) => {
    if (!oldIndex.has(key)) {
      ops.push({ type: 'insert', key, index });
      return;
    }
    const old = oldIndex.get(key);
    if (old < lastPlaced) ops.push({ type: 'move', key, index });
    else lastPlaced = old;
  });
  return ops;
}

module.exports = diffKeyed;`,
    explanation:
      "lastPlaced is the rightmost old position already settled. An item whose old position is to the left of it would end up in the wrong order unless it moves; everything else can stay, which is why moving the first item to the end is cheap and the reverse is expensive.",
  },
};
