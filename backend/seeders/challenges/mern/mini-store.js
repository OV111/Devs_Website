export default {
  slug: "mini-store",
  trackId: "mern",
  layerId: "mern-8",
  type: "CODE",
  difficulty: "med",
  title: "Zustand-style store with selectors",
  summary: "A tiny global store: state plus actions, subscribe with a selector, and notify only when the selected slice changes.",
  description:
    "Zustand's whole API is small: <code>create((set, get) =&gt; ({ ...state, ...actions }))</code>. Its power is selectors: a component subscribes to just the slice it needs and re-renders only when that slice changes.",
  task:
    "Write <code>createStore(initializer)</code> returning <code>{ getState, setState, subscribe }</code>. <code>initializer(set, get)</code> returns the initial state (including action functions).",
  constraints: [
    "<code>set(partial)</code> accepts an object or a function <code>(state) =&gt; partial</code> and MERGES it into a NEW state object (the old state object is never mutated). <code>setState</code> is the same function.",
    "<code>get()</code> / <code>getState()</code> always return the latest state.",
    "<code>subscribe(listener, selector = (s) =&gt; s)</code> returns an unsubscribe function. After each <code>set</code>, call <code>listener(selected, previousSelected)</code> only if <code>Object.is(selected, previousSelected)</code> is false.",
    "A listener removed during a notification (or one that unsubscribes itself) must not break the others; listeners run in subscription order.",
    "Actions defined in the initializer use <code>set</code> and <code>get</code> and can be called detached (<code>const { inc } = store.getState(); inc()</code>).",
  ],
  example: `const useStore = createStore((set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }));`,
  tags: ["zustand","state-management","react","pub-sub"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createStore.js",
      lang: "js",
      code: `// createStore.js
function createStore(initializer) {
  // your code here
}

module.exports = createStore;`,
    },
  ],
  testFile: {
    name: "createStore_test.js",
    lang: "test",
    code: `const createStore = require('./createStore');

test('actions', () => {
  const s = createStore((set) => ({ n: 0, inc: () => set((st) => ({ n: st.n + 1 })) })); s.getState().inc(); expect(s.getState().n).toBe(1);
});

test('selector', () => {
  const s = createStore((set) => ({ a: 0, b: 0 })); let calls = 0; s.subscribe(() => calls++, (st) => st.a); s.setState({ b: 1 }); expect(calls).toBe(0);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>state</code> and a <code>Set</code> of <code>{ fn, selector }</code> listeners. <code>set</code> computes the patch (calling it if it's a function), builds <code>next = { ...state, ...patch }</code> and swaps it in." },
    { order: 2, cost: 5, text: "Notify by looping over a COPY of the listeners (<code>[...listeners]</code>) and comparing <code>selector(next)</code> with <code>selector(prev)</code> using <code>Object.is</code>." },
    { order: 3, cost: 15, text: "Create the store's <code>set</code>/<code>get</code> first, then call <code>initializer(set, get)</code> to produce the state." },
  ],
  hiddenTests: [
    { name: "initial_state_and_actions", code: `const s = createStore((set, get) => ({ count: 5, inc: () => set({ count: get().count + 1 }) }));
assert(s.getState().count === 5, 'initial');
s.getState().inc();
assert(s.getState().count === 6, 'action via get/set');` },
    { name: "set_merges_objects_and_functions", code: `const s = createStore(() => ({ a: 1, b: 2 }));
s.setState({ b: 3 });
assert(s.getState().a === 1 && s.getState().b === 3, 'merge keeps a');
s.setState((st) => ({ a: st.a + 10 }));
assert(s.getState().a === 11 && s.getState().b === 3, 'function form');` },
    { name: "state_objects_are_replaced_not_mutated", code: `const s = createStore(() => ({ a: 1 }));
const before = s.getState();
s.setState({ a: 2 });
assert(before.a === 1 && s.getState() !== before, 'old state object untouched');` },
    { name: "detached_actions_work", code: `const s = createStore((set) => ({ n: 0, inc: () => set((st) => ({ n: st.n + 1 })) }));
const { inc } = s.getState();
inc(); inc();
assert(s.getState().n === 2, 'no this needed');` },
    { name: "subscribe_without_selector_fires_on_every_set", code: `const s = createStore(() => ({ a: 1 })); const seen = [];
s.subscribe((state, prev) => seen.push([state.a, prev.a]));
s.setState({ a: 2 }); s.setState({ a: 2 });
assert(seen.length === 2 && seen[0][0] === 2 && seen[0][1] === 1, 'whole-state selector sees a new object each time: ' + JSON.stringify(seen));` },
    { name: "selector_limits_notifications", code: `const s = createStore(() => ({ user: 'ann', count: 0 })); const calls = [];
s.subscribe((user, prev) => calls.push([user, prev]), (st) => st.user);
s.setState({ count: 1 });
s.setState({ count: 2 });
assert(calls.length === 0, 'unrelated changes are silent');
s.setState({ user: 'bob' });
assert(calls.length === 1 && calls[0][0] === 'bob' && calls[0][1] === 'ann', 'changes notify with new and previous: ' + JSON.stringify(calls));
s.setState({ user: 'bob' });
assert(calls.length === 1, 'same value again is silent');` },
    { name: "selectors_compare_with_object_is", code: `const s = createStore(() => ({ items: [1] })); let n = 0;
s.subscribe(() => n++, (st) => st.items);
s.setState({ items: [1] });
assert(n === 1, 'a new array with equal contents is a different reference');
const same = s.getState().items;
s.setState({ items: same });
assert(n === 1, 'same reference is silent');
const t = createStore(() => ({ x: NaN })); let m = 0;
t.subscribe(() => m++, (st) => st.x);
t.setState({ x: NaN });
assert(m === 0, 'NaN equals NaN under Object.is');` },
    { name: "unsubscribe", code: `const s = createStore(() => ({ a: 0 })); let n = 0;
const off = s.subscribe(() => n++);
s.setState({ a: 1 });
off(); off();
s.setState({ a: 2 });
assert(n === 1, 'no calls after unsubscribe');` },
    { name: "listeners_run_in_order_and_may_unsubscribe_during_notification", code: `const s = createStore(() => ({ a: 0 })); const log = [];
let offFirst;
offFirst = s.subscribe(() => { log.push('first'); offFirst(); });
s.subscribe(() => log.push('second'));
s.subscribe(() => log.push('third'));
s.setState({ a: 1 });
s.setState({ a: 2 });
assert(log.join(',') === 'first,second,third,second,third', 'log: ' + log);` },
    { name: "listener_sees_latest_state_via_get", code: `const s = createStore(() => ({ a: 0 })); let seen;
s.subscribe(() => { seen = s.getState().a; });
s.setState({ a: 7 });
assert(seen === 7, 'state is already updated when listeners run');` },
    { name: "independent_stores", code: `const mkc = () => createStore((set) => ({ n: 0, inc: () => set((st) => ({ n: st.n + 1 })) }));
const a = mkc(); const b = mkc();
a.getState().inc();
assert(a.getState().n === 1 && b.getState().n === 0, 'separate state');` },
  ],
  solution: {
    code: `function createStore(initializer) {
  let state;
  const listeners = new Set();

  const get = () => state;

  const set = (partial) => {
    const patch = typeof partial === 'function' ? partial(state) : partial;
    const prev = state;
    state = { ...state, ...patch };
    for (const listener of [...listeners]) {
      const next = listener.selector(state);
      const before = listener.selector(prev);
      if (!Object.is(next, before)) listener.fn(next, before);
    }
  };

  state = initializer(set, get);

  return {
    getState: get,
    setState: set,
    subscribe(fn, selector = (s) => s) {
      const listener = { fn, selector };
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

module.exports = createStore;`,
    explanation:
      "State is replaced with a new object on every set, so 'did my slice change' is just Object.is on the selector's output before and after. Iterating over a copy of the listener set makes unsubscribing during a notification safe.",
  },
};
