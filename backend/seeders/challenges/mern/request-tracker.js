export default {
  slug: "request-tracker",
  trackId: "mern",
  layerId: "mern-4",
  type: "CODE",
  difficulty: "hard",
  title: "useFetch core: ignore stale responses",
  summary: "The state machine inside a custom data-fetching hook: loading/success/error, request ids to drop out-of-order responses, and a stable snapshot for useSyncExternalStore.",
  description:
    "A search box fires a request per keystroke and responses come back in any order. Without protection the slow response for 'ab' overwrites the fast one for 'abc'. Every serious <code>useFetch</code> hook (and React Query) tracks which request is current. Build that core as a plain store so it can plug into <code>useSyncExternalStore</code>.",
  task:
    "Write <code>createRequestTracker()</code> returning <code>{ start, succeed, fail, cancel, getState, subscribe }</code>.",
  constraints: [
    "State is <code>{ status, data, error }</code> with <code>status</code> one of <code>'idle' | 'loading' | 'success' | 'error'</code>. Initially <code>{ status: 'idle', data: null, error: null }</code>.",
    "<code>start()</code> returns a new numeric request id (increasing) and makes the latest request current. It sets <code>status: 'loading'</code> and <code>error: null</code> but KEEPS the previous <code>data</code>. If the status is already <code>'loading'</code>, it still returns a new id but changes nothing and notifies nobody.",
    "<code>succeed(id, data)</code> and <code>fail(id, error)</code> only apply when <code>id</code> is the current request; otherwise they return <code>false</code> and change nothing. On success: <code>{ status: 'success', data, error: null }</code>. On failure: <code>{ status: 'error', data: previousData, error }</code>. Applied calls return <code>true</code>.",
    "<code>cancel()</code> makes any in-flight request stale. If the status was <code>'loading'</code> it goes back to <code>'success'</code> when there is data, else <code>'idle'</code>; in any other status it does nothing.",
    "<code>getState()</code> returns the SAME object until the state really changes (a new object per change, never mutated). <code>subscribe(listener)</code> returns an unsubscribe function; listeners are called with no arguments once per real change.",
  ],
  example: `const t = createRequestTracker(); const a = t.start(); const b = t.start(); t.succeed(b, 'new'); t.succeed(a, 'old'); // false: stale`,
  tags: ["custom-hooks", "race-conditions", "usesyncexternalstore", "state-machine"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "createRequestTracker.js",
      lang: "js",
      code: `// createRequestTracker.js
function createRequestTracker() {
  // your code here
}

module.exports = createRequestTracker;`,
    },
  ],
  testFile: {
    name: "createRequestTracker_test.js",
    lang: "test",
    code: `const createRequestTracker = require('./createRequestTracker');

test('stale responses are ignored', () => {
  const t = createRequestTracker();
  const a = t.start();
  const b = t.start();
  expect(t.succeed(a, 'old')).toBe(false);
  expect(t.succeed(b, 'new')).toBe(true);
  expect(t.getState().data).toBe('new');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a counter <code>latest</code> and a single <code>state</code> object. A tiny <code>set(next)</code> helper replaces <code>state</code> and notifies listeners." },
    { order: 2, cost: 5, text: "Never mutate: always <code>set({ ...state, status: ... })</code>, and have the 'nothing changed' paths return before calling <code>set</code> so the reference stays stable." },
    { order: 3, cost: 15, text: "<code>cancel()</code> just bumps <code>latest</code> so no outstanding id equals it any more; then fix up the status if it was loading." },
  ],
  hiddenTests: [
    { name: "initial_state", code: `const t = createRequestTracker();
const s = t.getState();
assert(s.status === 'idle' && s.data === null && s.error === null, 'got ' + JSON.stringify(s));` },
    { name: "start_and_succeed", code: `const t = createRequestTracker();
const id = t.start();
assert(typeof id === 'number' && t.getState().status === 'loading', 'loading');
assert(t.succeed(id, { n: 1 }) === true, 'applied');
const s = t.getState();
assert(s.status === 'success' && s.data.n === 1 && s.error === null, 'got ' + JSON.stringify(s));` },
    { name: "ids_increase", code: `const t = createRequestTracker();
const a = t.start(); const b = t.start(); const c = t.start();
assert(a < b && b < c, 'increasing ids');` },
    { name: "stale_response_is_ignored", code: `const t = createRequestTracker();
const a = t.start();
const b = t.start();
assert(t.succeed(a, 'old') === false, 'stale returns false');
assert(t.getState().status === 'loading' && t.getState().data === null, 'state untouched by stale');
assert(t.succeed(b, 'new') === true, 'current applies');
assert(t.getState().data === 'new', 'data');` },
    { name: "out_of_order_arrival", code: `const t = createRequestTracker();
const a = t.start(); const b = t.start();
t.succeed(b, 'abc');
t.succeed(a, 'ab');
assert(t.getState().data === 'abc', 'the late slow response must not overwrite: ' + t.getState().data);` },
    { name: "data_is_kept_while_reloading_and_after_errors", code: `const t = createRequestTracker();
t.succeed(t.start(), 'v1');
const id = t.start();
assert(t.getState().status === 'loading' && t.getState().data === 'v1', 'stale-while-revalidate keeps data');
const err = new Error('boom');
assert(t.fail(id, err) === true, 'applied');
const s = t.getState();
assert(s.status === 'error' && s.error === err && s.data === 'v1', 'got ' + JSON.stringify(s));
t.start();
assert(t.getState().error === null, 'error cleared by a new request');` },
    { name: "stale_failures_are_ignored_too", code: `const t = createRequestTracker();
const a = t.start(); const b = t.start();
assert(t.fail(a, new Error('old')) === false, 'stale fail');
assert(t.getState().status === 'loading', 'still loading');
t.succeed(b, 1);
assert(t.getState().status === 'success', 'ok');` },
    { name: "cancel_invalidates_in_flight_requests", code: `const t = createRequestTracker();
const id = t.start();
t.cancel();
assert(t.getState().status === 'idle', 'back to idle with no data');
assert(t.succeed(id, 'late') === false && t.getState().data === null, 'late response dropped');
t.succeed(t.start(), 'v1');
t.start(); t.cancel();
assert(t.getState().status === 'success' && t.getState().data === 'v1', 'back to success when there is data');
const before = t.getState();
t.cancel();
assert(t.getState() === before, 'cancel outside loading is a no-op');` },
    { name: "reference_stability", code: `const t = createRequestTracker();
const s0 = t.getState();
assert(t.getState() === s0, 'same ref between calls');
const a = t.start();
const s1 = t.getState();
assert(s1 !== s0, 'new object after a change');
const b = t.start();
assert(t.getState() === s1 && b > a, 'start while loading changes nothing');
t.succeed(a, 'stale');
assert(t.getState() === s1, 'ignored responses keep the ref');
t.succeed(b, 'x');
assert(t.getState() !== s1, 'real change');
assert(s1.status === 'loading', 'old snapshots are never mutated');` },
    { name: "subscribe_notifies_once_per_real_change", code: `const t = createRequestTracker();
let calls = 0;
const off = t.subscribe(() => { calls++; });
const a = t.start();
assert(calls === 1, 'start notifies');
const b = t.start();
assert(calls === 1, 'second start while loading does not');
t.succeed(a, 'stale');
assert(calls === 1, 'stale does not');
t.succeed(b, 'ok');
assert(calls === 2, 'success notifies');
off();
t.start();
assert(calls === 2, 'unsubscribed');
off();` },
  ],
  solution: {
    code: `function createRequestTracker() {
  let state = { status: 'idle', data: null, error: null };
  let latest = 0;
  const listeners = new Set();

  const set = (next) => {
    state = next;
    for (const listener of [...listeners]) listener();
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start() {
      const id = ++latest;
      if (state.status !== 'loading') set({ ...state, status: 'loading', error: null });
      return id;
    },
    succeed(id, data) {
      if (id !== latest) return false;
      set({ status: 'success', data, error: null });
      return true;
    },
    fail(id, error) {
      if (id !== latest) return false;
      set({ status: 'error', data: state.data, error });
      return true;
    },
    cancel() {
      latest++;
      if (state.status === 'loading') {
        set({ ...state, status: state.data !== null ? 'success' : 'idle' });
      }
    },
  };
}

module.exports = createRequestTracker;`,
    explanation:
      "A request id is a ticket: only the holder of the newest ticket may write the result, which turns the out-of-order race into a one-line comparison. Returning early without calling set keeps getState() referentially stable, which is exactly the contract useSyncExternalStore needs to avoid infinite re-renders. Keeping the previous data while loading is what makes lists not flash empty on refetch.",
  },
};
