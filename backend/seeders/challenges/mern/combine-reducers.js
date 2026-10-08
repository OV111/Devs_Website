export default {
  slug: "combine-reducers",
  trackId: "mern",
  layerId: "mern-4",
  type: "CODE",
  difficulty: "med",
  title: "Write combineReducers",
  summary: "Combine slice reducers into one root reducer that keeps state references stable when nothing changed.",
  description:
    "With <code>useReducer</code> or Redux, big state is split into slice reducers, one per key. <code>combineReducers</code> glues them back together. The detail that matters for React is reference stability: if no slice changed, return the SAME state object so nothing re-renders.",
  task:
    "Write <code>combineReducers(reducers)</code> where <code>reducers</code> maps state keys to <code>(sliceState, action) =&gt; newSliceState</code>. Return a root reducer <code>(state = {}, action) =&gt; nextState</code>.",
  constraints: [
    "The root reducer calls every slice reducer with that slice's previous state (<code>state[key]</code>) and the action, and builds an object with the results.",
    "If every slice returns exactly what it was given AND the state has no keys outside <code>reducers</code>, return the previous <code>state</code> object itself (same reference). Otherwise return a new object containing only the keys in <code>reducers</code>.",
    "An action must be an object with a string <code>type</code>; otherwise throw an <code>Error</code> whose message mentions <code>type</code>.",
    "No slice may ever return <code>undefined</code>. Check this at creation time by calling each reducer with <code>(undefined, { type: '@@INIT' })</code> and throw an <code>Error</code> naming the key. Also throw, naming the key, if a reducer returns <code>undefined</code> for a real action. <code>null</code> is a valid state.",
    "Entries in <code>reducers</code> that are not functions are ignored.",
  ],
  example: `const root = combineReducers({ count: counterReducer, todos: todosReducer }); root(undefined, { type: '@@INIT' }) // { count: 0, todos: [] }`,
  tags: ["redux", "usereducer", "state", "immutability"],
  estimatedMins: 25,
  xp: 40,
  starterFiles: [
    {
      name: "combineReducers.js",
      lang: "js",
      code: `// combineReducers.js
function combineReducers(reducers) {
  // your code here
}

module.exports = combineReducers;`,
    },
  ],
  testFile: {
    name: "combineReducers_test.js",
    lang: "test",
    code: `const combineReducers = require('./combineReducers');
const count = (s = 0, a) => (a.type === 'inc' ? s + 1 : s);
const names = (s = [], a) => (a.type === 'add' ? [...s, a.name] : s);

test('builds initial state', () => {
  const root = combineReducers({ count, names });
  expect(root(undefined, { type: 'x' })).toEqual({ count: 0, names: [] });
});

test('keeps the reference when nothing changes', () => {
  const root = combineReducers({ count, names });
  const s = root(undefined, { type: 'x' });
  expect(root(s, { type: 'unknown' })).toBe(s);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Filter <code>reducers</code> down to function entries once, up front, and run the <code>@@INIT</code> check there." },
    { order: 2, cost: 5, text: "In the root reducer track a boolean <code>changed</code>: set it when <code>next !== prev</code> for any key." },
    { order: 3, cost: 15, text: "Also set <code>changed</code> when <code>Object.keys(state).length !== keys.length</code>: that is how stray keys in old state get dropped." },
  ],
  hiddenTests: [
    { name: "builds_initial_state_from_slice_defaults", code: `const count = (s = 0, a) => (a.type === 'inc' ? s + 1 : s);
const names = (s = [], a) => (a.type === 'add' ? [...s, a.name] : s);
const root = combineReducers({ count, names });
const s = root(undefined, { type: 'x' });
assert(JSON.stringify(s) === '{"count":0,"names":[]}', 'got ' + JSON.stringify(s));` },
    { name: "routes_actions_and_keeps_untouched_slices_by_reference", code: `const count = (s = 0, a) => (a.type === 'inc' ? s + 1 : s);
const names = (s = [], a) => (a.type === 'add' ? [...s, a.name] : s);
const root = combineReducers({ count, names });
const s0 = root(undefined, { type: 'x' });
const s1 = root(s0, { type: 'inc' });
assert(s1 !== s0 && s1.count === 1, 'new state object with updated slice');
assert(s1.names === s0.names, 'untouched slice keeps its reference');` },
    { name: "same_state_when_nothing_changed", code: `const count = (s = 0, a) => (a.type === 'inc' ? s + 1 : s);
const root = combineReducers({ count });
const s = root(undefined, { type: 'x' });
assert(root(s, { type: 'nobody-handles-this' }) === s, 'same reference');` },
    { name: "extra_keys_are_dropped", code: `const count = (s = 0) => s;
const root = combineReducers({ count });
const old = { count: 5, legacy: true };
const next = root(old, { type: 'x' });
assert(next !== old, 'a stray key forces a new object');
assert(JSON.stringify(next) === '{"count":5}', 'got ' + JSON.stringify(next));` },
    { name: "slice_reducers_only_see_their_slice", code: `const seen = [];
const a = (s = 'A', act) => { seen.push(['a', s]); return s; };
const b = (s = 'B', act) => { seen.push(['b', s]); return s; };
const root = combineReducers({ a, b });
seen.length = 0;
root({ a: 'x', b: 'y' }, { type: 't' });
assert(JSON.stringify(seen) === '[["a","x"],["b","y"]]', 'got ' + JSON.stringify(seen));` },
    { name: "rejects_invalid_actions", code: `const root = combineReducers({ n: (s = 0) => s });
let e1 = null, e2 = null, e3 = null;
try { root({}, null); } catch (e) { e1 = e; }
try { root({}, { kind: 'x' }); } catch (e) { e2 = e; }
try { root({}, { type: 5 }); } catch (e) { e3 = e; }
assert(e1 && e2 && e3, 'all three invalid actions throw');
assert(/type/.test(e2.message), 'message mentions type: ' + e2.message);` },
    { name: "undefined_initial_state_throws_at_creation_naming_the_key", code: `let err = null;
try { combineReducers({ good: (s = 1) => s, broken: () => undefined }); } catch (e) { err = e; }
assert(err && /broken/.test(err.message), 'names the key: ' + (err && err.message));` },
    { name: "undefined_for_a_real_action_throws_naming_the_key", code: `const flaky = (s = 0, a) => (a.type === 'oops' ? undefined : s);
const root = combineReducers({ flaky });
let err = null;
try { root(undefined, { type: 'oops' }); } catch (e) { err = e; }
assert(err && /flaky/.test(err.message), 'names the key: ' + (err && err.message));` },
    { name: "null_is_a_valid_slice_state", code: `const user = (s = null, a) => (a.type === 'login' ? { id: 1 } : s);
const root = combineReducers({ user });
const s = root(undefined, { type: 'x' });
assert(s.user === null, 'null kept');
assert(root(s, { type: 'login' }).user.id === 1, 'works after');` },
    { name: "non_function_entries_ignored_and_nesting_works", code: `const inner = combineReducers({ x: (s = 1) => s, y: (s = 2) => s });
const root = combineReducers({ inner, junk: 42, n: (s = 0) => s });
const s = root(undefined, { type: 'init' });
assert(JSON.stringify(s) === '{"inner":{"x":1,"y":2},"n":0}', 'got ' + JSON.stringify(s));
assert(root(s, { type: 'noop' }) === s, 'nested stability');` },
  ],
  solution: {
    code: `function combineReducers(reducers) {
  const entries = Object.entries(reducers).filter(([, fn]) => typeof fn === 'function');
  const keys = entries.map(([key]) => key);

  for (const [key, fn] of entries) {
    if (fn(undefined, { type: '@@INIT' }) === undefined) {
      throw new Error('Reducer "' + key + '" returned undefined during initialization');
    }
  }

  return function root(state = {}, action) {
    if (!action || typeof action !== 'object' || typeof action.type !== 'string') {
      throw new Error('Actions must be plain objects with a string "type"');
    }
    const next = {};
    let changed = Object.keys(state).length !== keys.length;
    for (const [key, fn] of entries) {
      const prevSlice = state[key];
      const nextSlice = fn(prevSlice, action);
      if (nextSlice === undefined) {
        throw new Error('Reducer "' + key + '" returned undefined for action "' + action.type + '"');
      }
      next[key] = nextSlice;
      if (nextSlice !== prevSlice) changed = true;
    }
    return changed ? next : state;
  };
}

module.exports = combineReducers;`,
    explanation:
      "The root reducer builds a candidate next object but only returns it if some slice actually changed or a stray key had to be dropped; otherwise it returns the old state. Returning the same reference is what lets React.memo, useSelector and useSyncExternalStore skip work. Probing every reducer with an init action up front surfaces a missing default at startup instead of on the first unlucky render.",
  },
};
