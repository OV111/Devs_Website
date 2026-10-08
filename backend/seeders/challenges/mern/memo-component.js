export default {
  slug: "memo-component",
  trackId: "mern",
  layerId: "mern-3",
  type: "CODE",
  difficulty: "easy",
  title: "Write React.memo",
  summary: "Skip re-rendering a component when its props are shallow-equal to last time.",
  description:
    "<code>React.memo</code> wraps a component so it only re-runs when its props change. 'Changed' means a shallow comparison: each prop compared with <code>Object.is</code>. That explains the classic gotcha: a new <code>{}</code>, array or function created on every render always counts as changed.",
  task:
    "Write <code>memo(Component, areEqual)</code> returning a function <code>Memoized(props)</code> that returns the cached output of the last render when the props are equal.",
  constraints: [
    "The first call always calls <code>Component(props)</code>.",
    "Default equality is a shallow compare: the same number of keys, and every key present in both with <code>Object.is</code>-equal values.",
    "If you pass <code>areEqual(prevProps, nextProps)</code> it replaces the default; returning <code>true</code> means 'equal, skip rendering'.",
    "When equal, return the exact same cached output (same reference) and do not call <code>Component</code>.",
    "Each <code>memo(...)</code> result keeps its own cache. If <code>Component</code> throws, the previous cache stays.",
  ],
  example: `const Row = memo(({ id }) => render(id)); Row({ id: 1 }); Row({ id: 1 }); // second call is skipped`,
  tags: ["react","memo","performance","composition"],
  estimatedMins: 20,
  xp: 25,
  starterFiles: [
    {
      name: "memo.js",
      lang: "js",
      code: `// memo.js
function memo(Component, areEqual) {
  // your code here
}

module.exports = memo;`,
    },
  ],
  testFile: {
    name: "memo_test.js",
    lang: "test",
    code: `const memo = require('./memo');

test('skips_when_equal', () => {
  let n = 0; const M = memo((p) => { n++; return p.a; }); M({ a: 1 }); M({ a: 1 }); expect(n).toBe(1);
});

test('rerenders_on_change', () => {
  let n = 0; const M = memo((p) => { n++; return p.a; }); M({ a: 1 }); M({ a: 2 }); expect(n).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>hasCache</code>, <code>lastProps</code> and <code>lastOutput</code> in the closure of <code>memo</code>." },
    { order: 2, cost: 5, text: "Write <code>shallowEqual(a, b)</code> comparing <code>Object.keys</code> lengths, then each key with <code>Object.is</code> (and <code>hasOwnProperty</code> on <code>b</code>)." },
    { order: 3, cost: 15, text: "Only update the cache AFTER <code>Component</code> returned successfully." },
  ],
  hiddenTests: [
    { name: "first_call_always_renders", code: `let calls = 0; const M = memo((p) => { calls++; return 'out'; });
assert(M({}) === 'out' && calls === 1, 'rendered');` },
    { name: "equal_props_skip_and_return_same_output", code: `let calls = 0; const M = memo((p) => { calls++; return { v: p.a }; });
const first = M({ a: 1, b: 'x' });
const second = M({ a: 1, b: 'x' });
assert(calls === 1, 'rendered once');
assert(first === second, 'same cached output reference');` },
    { name: "changed_prop_rerenders_and_updates_cache", code: `let calls = 0; const M = memo((p) => { calls++; return p.a; });
M({ a: 1 });
assert(M({ a: 2 }) === 2 && calls === 2, 'rerendered');
assert(M({ a: 2 }) === 2 && calls === 2, 'and the new props are now the cached ones');
assert(M({ a: 1 }) === 1 && calls === 3, 'going back is another change');` },
    { name: "extra_missing_or_renamed_keys_count_as_changes", code: `let calls = 0; const M = memo(() => ++calls);
M({ a: 1 }); M({ a: 1, b: 2 }); M({ a: 1 }); M({ b: 1 });
assert(calls === 4, 'every call differed in its key set: ' + calls);
let c2 = 0; const N = memo(() => ++c2);
N({ a: undefined }); N({ b: undefined });
assert(c2 === 2, 'same key count but different keys: ' + c2);` },
    { name: "comparison_is_object_is", code: `let calls = 0; const M = memo(() => ++calls);
M({ n: NaN }); M({ n: NaN });
assert(calls === 1, 'NaN equals NaN');
M({ n: 0 }); M({ n: -0 });
assert(calls === 3, '0 and -0 differ under Object.is: ' + calls);` },
    { name: "new_object_array_and_function_props_always_rerender", code: `let calls = 0; const M = memo(() => ++calls);
M({ style: { a: 1 } }); M({ style: { a: 1 } });
M({ items: [1] }); M({ items: [1] });
M({ onClick: () => {} }); M({ onClick: () => {} });
assert(calls === 6, 'equal-looking but new references are changes: ' + calls);
const shared = { a: 1 }; const fn = () => {}; let c2 = 0;
const N = memo(() => ++c2);
N({ style: shared, onClick: fn }); N({ style: shared, onClick: fn });
assert(c2 === 1, 'same references are skipped');` },
    { name: "children_arrays_break_memoization", code: `let calls = 0; const M = memo((p) => { calls++; return p.children.length; });
M({ children: ['a'] }); M({ children: ['a'] });
assert(calls === 2, 'a freshly created children array is a different reference');` },
    { name: "custom_comparator_replaces_the_default", code: `let calls = 0;
const M = memo((p) => { calls++; return p.id; }, (prev, next) => prev.id === next.id);
M({ id: 1, noise: 'a' }); M({ id: 1, noise: 'b' });
assert(calls === 1, 'only id matters');
M({ id: 2, noise: 'b' });
assert(calls === 2, 'id changed');` },
    { name: "comparator_receives_previous_and_next_props", code: `const seen = [];
const M = memo((p) => p.n, (prev, next) => { seen.push([prev.n, next.n]); return false; });
M({ n: 1 }); M({ n: 2 }); M({ n: 3 });
assert(JSON.stringify(seen) === '[[1,2],[2,3]]', 'not called on the first render: ' + JSON.stringify(seen));` },
    { name: "instances_have_separate_caches", code: `let a = 0; let b = 0;
const A = memo(() => ++a); const B = memo(() => ++b);
A({ x: 1 }); B({ x: 1 }); A({ x: 1 }); B({ x: 1 });
assert(a === 1 && b === 1, 'each wrapper caches its own');
const A2 = memo(() => ++a);
A2({ x: 1 });
assert(a === 2, 'a second memo of anything starts empty');` },
    { name: "throwing_component_keeps_the_old_cache", code: `let shouldThrow = false; let calls = 0;
const M = memo((p) => { calls++; if (shouldThrow) throw new Error('boom'); return p.a; });
M({ a: 1 });
shouldThrow = true;
let err = null;
try { M({ a: 2 }); } catch (e) { err = e; }
assert(err && err.message === 'boom', 'error propagates');
shouldThrow = false;
assert(M({ a: 1 }) === 1 && calls === 2, 'old props are still cached, so this is a hit');` },
    { name: "undefined_output_is_still_cached", code: `let calls = 0; const M = memo(() => { calls++; });
M({}); M({});
assert(calls === 1, 'a component returning undefined is cached too');` },
  ],
  solution: {
    code: `function memo(Component, areEqual) {
  const shallowEqual = (a, b) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return (
      keysA.length === keysB.length &&
      keysA.every((key) => Object.prototype.hasOwnProperty.call(b, key) && Object.is(a[key], b[key]))
    );
  };
  const equal = areEqual || shallowEqual;

  let hasCache = false;
  let lastProps;
  let lastOutput;

  return function Memoized(props) {
    if (hasCache && equal(lastProps, props)) return lastOutput;
    const output = Component(props);
    lastProps = props;
    lastOutput = output;
    hasCache = true;
    return output;
  };
}

module.exports = memo;`,
    explanation:
      "The wrapper remembers the last props and output and compares new props to the old ones with Object.is per key. Anything created fresh each render (objects, arrays, inline functions, children) fails that comparison, which is why memo alone often does nothing until you stabilize those props.",
  },
};
