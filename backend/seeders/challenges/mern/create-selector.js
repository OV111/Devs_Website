export default {
  slug: "create-selector",
  trackId: "mern",
  layerId: "mern-4",
  type: "CODE",
  difficulty: "med",
  title: "Memoized selectors (reselect)",
  summary: "Build createSelector: recompute a derived value only when its inputs change, and return the same reference otherwise.",
  description:
    "With <code>useContext</code>, <code>useReducer</code> or Redux, components derive data from state (filtered lists, totals). A derived array built on every render is a new reference each time and defeats <code>React.memo</code>. <code>reselect</code>'s <code>createSelector</code> fixes that by memoizing on its inputs.",
  task:
    "Write <code>createSelector(inputSelectors, resultFn)</code> and <code>createStructuredSelector(selectorMap)</code>.",
  constraints: [
    "<code>createSelector</code> returns <code>selector(state, ...args)</code>. It runs every input selector with <code>(state, ...args)</code>; if every input result is <code>Object.is</code>-equal to the previous call's, return the previous result WITHOUT calling <code>resultFn</code>. Otherwise call <code>resultFn(...inputResults)</code>, remember and return it. Cache size is 1.",
    "The returned selector has <code>recomputations()</code> (how many times <code>resultFn</code> has run) and <code>resetRecomputations()</code>.",
    "Throw a <code>TypeError</code> if <code>resultFn</code> or any input selector is not a function.",
    "The very first call always computes, even if every input returns <code>undefined</code>.",
    "<code>createStructuredSelector({ a: selA, b: selB })</code> returns a selector producing <code>{ a, b }</code> from the results of each selector. It must return the SAME object while every value is unchanged (it can be built from <code>createSelector</code>).",
  ],
  example: `const visible = createSelector([(s) => s.todos, (s) => s.filter], (todos, f) => todos.filter((t) => t.status === f));`,
  tags: ["reselect", "memoization", "performance", "redux", "react"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "selectors.js",
      lang: "js",
      code: `// selectors.js
function createSelector(inputSelectors, resultFn) {
  // your code here
}

function createStructuredSelector(selectorMap) {
  // your code here
}

module.exports = { createSelector, createStructuredSelector };`,
    },
  ],
  testFile: {
    name: "selectors_test.js",
    lang: "test",
    code: `const { createSelector } = require('./selectors');

test('does not recompute when inputs are unchanged', () => {
  const sel = createSelector([(s) => s.items], (items) => items.length);
  const items = [1, 2];
  sel({ items, other: 1 });
  sel({ items, other: 2 });
  expect(sel.recomputations()).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Remember two things between calls: the array of last input results and the last output. Compare input results one by one with <code>Object.is</code>." },
    { order: 2, cost: 5, text: "Use a <code>hasRun</code> flag (or <code>lastInputs === null</code>) so the first call always computes." },
    { order: 3, cost: 15, text: "<code>createStructuredSelector</code>: <code>createSelector(Object.values(map), (...values) =&gt; Object.fromEntries(keys.map((k, i) =&gt; [k, values[i]])))</code>." },
  ],
  hiddenTests: [
    { name: "computes_from_input_results", code: `const sel = createSelector([(s) => s.a, (s) => s.b], (a, b) => a + b);
assert(sel({ a: 1, b: 2 }) === 3, 'sum');` },
    { name: "memoizes_on_input_results_not_state", code: `const sel = createSelector([(s) => s.items], (items) => items.length);
const items = [1, 2, 3];
sel({ items, other: 1 });
sel({ items, other: 2 });
sel({ items, other: 3 });
assert(sel.recomputations() === 1, 'recomputed ' + sel.recomputations() + ' times');` },
    { name: "recomputes_when_an_input_changes", code: `const sel = createSelector([(s) => s.items, (s) => s.min], (items, min) => items.filter((x) => x >= min));
const items = [1, 5, 9];
const r1 = sel({ items, min: 5 });
const r2 = sel({ items, min: 6 });
assert(JSON.stringify(r1) === '[5,9]' && JSON.stringify(r2) === '[9]', 'values');
assert(sel.recomputations() === 2, 'two computations');` },
    { name: "returns_the_same_reference_when_memoized", code: `const sel = createSelector([(s) => s.items], (items) => items.filter(Boolean));
const items = [1, 0, 2];
const a = sel({ items });
const b = sel({ items, extra: true });
assert(a === b, 'same output reference');
const c = sel({ items: [1, 0, 2] });
assert(c !== a, 'a new input array (even with equal contents) recomputes');` },
    { name: "cache_size_is_one", code: `const sel = createSelector([(s) => s.x], (x) => ({ x }));
sel({ x: 1 }); sel({ x: 2 }); sel({ x: 1 });
assert(sel.recomputations() === 3, 'going back to an old input still recomputes: ' + sel.recomputations());` },
    { name: "forwards_extra_arguments_to_input_selectors", code: `const byId = createSelector([(s) => s.users, (s, id) => id], (users, id) => users[id]);
const users = { 1: 'ann', 2: 'bob' };
assert(byId({ users }, 1) === 'ann', 'id 1');
assert(byId({ users }, 2) === 'bob', 'id 2');
assert(byId({ users }, 2) === 'bob' && byId.recomputations() === 2, 'memoized per input set');` },
    { name: "result_fn_receives_inputs_in_order", code: `let got;
const sel = createSelector([(s) => s.a, (s) => s.b, (s) => s.c], (...args) => { got = args; return 0; });
sel({ a: 1, b: 2, c: 3 });
assert(JSON.stringify(got) === '[1,2,3]', 'got ' + JSON.stringify(got));` },
    { name: "first_call_always_computes", code: `const sel = createSelector([(s) => s.missing], (v) => v === undefined ? 'was undefined' : v);
assert(sel({}) === 'was undefined', 'computed once');
assert(sel.recomputations() === 1, 'count');
sel({});
assert(sel.recomputations() === 1, 'and then memoized');` },
    { name: "reset_recomputations", code: `const sel = createSelector([(s) => s.x], (x) => x * 2);
sel({ x: 1 }); sel({ x: 2 });
assert(sel.recomputations() === 2, 'two');
sel.resetRecomputations();
assert(sel.recomputations() === 0, 'reset');
sel({ x: 2 });
assert(sel.recomputations() === 0, 'still memoized after reset');` },
    { name: "validates_arguments", code: `let e1 = null, e2 = null;
try { createSelector([(s) => s], 5); } catch (e) { e1 = e; }
try { createSelector([(s) => s, 'nope'], () => 0); } catch (e) { e2 = e; }
assert(e1 instanceof TypeError, 'resultFn must be a function');
assert(e2 instanceof TypeError, 'input selectors must be functions');` },
    { name: "selectors_compose", code: `const items = createSelector([(s) => s.todos], (t) => t.filter((x) => !x.done));
const count = createSelector([items], (list) => list.length);
const todos = [{ done: false }, { done: true }];
assert(count({ todos }) === 1, 'composed');
count({ todos, noise: 1 });
assert(items.recomputations() === 1 && count.recomputations() === 1, 'inner memoization carries through');` },
    { name: "structured_selector", code: `const sel = createStructuredSelector({ a: (s) => s.a, double: (s) => s.a * 2 });
const r1 = sel({ a: 2 });
assert(JSON.stringify(r1) === '{"a":2,"double":4}', 'got ' + JSON.stringify(r1));
const r2 = sel({ a: 2, other: 1 });
assert(r1 === r2, 'same object while values are unchanged');
const r3 = sel({ a: 3 });
assert(r3 !== r1 && r3.double === 6, 'new object when a value changes');` },
  ],
  solution: {
    code: `function createSelector(inputSelectors, resultFn) {
  if (typeof resultFn !== 'function') throw new TypeError('resultFn must be a function');
  for (const s of inputSelectors) {
    if (typeof s !== 'function') throw new TypeError('input selectors must be functions');
  }

  let lastInputs = null;
  let lastResult;
  let recomputations = 0;

  function selector(state, ...args) {
    const inputs = inputSelectors.map((s) => s(state, ...args));
    const unchanged =
      lastInputs !== null &&
      inputs.length === lastInputs.length &&
      inputs.every((value, i) => Object.is(value, lastInputs[i]));
    if (unchanged) return lastResult;
    lastInputs = inputs;
    lastResult = resultFn(...inputs);
    recomputations++;
    return lastResult;
  }

  selector.recomputations = () => recomputations;
  selector.resetRecomputations = () => { recomputations = 0; };
  return selector;
}

function createStructuredSelector(selectorMap) {
  const keys = Object.keys(selectorMap);
  return createSelector(
    keys.map((k) => selectorMap[k]),
    (...values) => Object.fromEntries(keys.map((k, i) => [k, values[i]]))
  );
}

module.exports = { createSelector, createStructuredSelector };`,
    explanation:
      "The selector compares what the inputs return rather than the whole state, so a change to an unrelated part of state costs only the cheap input selectors. Returning the cached result object is the real prize in React: the same reference means memoized children skip re-rendering. A cache of size 1 is intentional, since it's enough for one component and avoids unbounded memory.",
  },
};
