export default {
    slug: "debounce-with-cancel-and-flush",
    trackId: "mern",
    layerId: "mern-2",
    type: "CODE",
    difficulty: "easy",
    title: "debounce() with cancel and flush",
    summary:
      "Implement debounce with the two methods every real implementation needs beyond the basic delay.",
    description:
      "Every debounce tutorial stops at the delay. Real ones — Lodash included — also let the caller cancel a pending call outright, or force it to run immediately. Build both.",
    task:
      "Write <code>debounce(fn, wait)</code>, returning a wrapped function. Calling the wrapped function resets a <code>wait</code>-ms timer; when it finally fires, call <code>fn</code> with the most recent arguments. The wrapped function must also expose <code>.cancel()</code>, which discards any pending call with no invocation, and <code>.flush()</code>, which invokes immediately with the most recent pending arguments (and does nothing if nothing is pending).",
    constraints: [
      "Only the most recent set of arguments before the timer fires is ever used.",
      "cancel() must prevent the pending call from ever running.",
      "flush() invokes immediately and cancels the pending timer — fn must not also fire later on its own.",
      "flush() with nothing pending must not call fn at all.",
    ],
    example: `const save = debounce((text) => api.save(text), 300);
input.addEventListener('input', (e) => save(e.target.value));
window.addEventListener('beforeunload', () => save.flush());`,
    tags: ["timers", "closures", "async"],
    estimatedMins: 20,
    xp: 35,
    starterFiles: [
      {
        name: "debounce.js",
        lang: "js",
        code: `// debounce.js
function debounce(fn, wait) {
  // your code here — the returned function needs .cancel() and .flush() too
}

module.exports = debounce;`,
      },
    ],
    testFile: {
      name: "debounce_test.js",
      lang: "test",
      code: `// debounce_test.js
const debounce = require('./debounce');

test('delays_the_call', (done) => {
  let called = false;
  const fn = debounce(() => { called = true; }, 20);
  fn();
  expect(called).toBe(false);
  setTimeout(() => { expect(called).toBe(true); done(); }, 30);
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "Keep a single <code>timeoutId</code> and the last-seen <code>args</code> in the closure. Every call clears the previous timeout before setting a new one — that reset is the entire 'debounce' behavior.",
      },
      {
        order: 2,
        cost: 5,
        text: "<code>cancel()</code> is just <code>clearTimeout(timeoutId)</code> plus clearing your stored args so a later flush() has nothing to act on.",
      },
      {
        order: 3,
        cost: 10,
        text: "<code>flush()</code> needs to check whether a call is actually pending (e.g. a boolean flag or checking your stored args aren't empty) before invoking — otherwise flushing an idle debounce would call fn with stale or undefined arguments.",
      },
    ],
    hiddenTests: [
      {
        name: "delays_and_uses_latest_args",
        code: `let received = null;
const fn = debounce((v) => { received = v; }, 15);
fn('first');
fn('second');
assert(received === null, 'fn must not run before the wait elapses');
await new Promise((r) => setTimeout(r, 30));
assert(received === 'second', 'only the most recent call\\'s arguments should be used, got ' + received);`,
      },
      {
        name: "cancel_prevents_invocation",
        code: `let calls = 0;
const fn = debounce(() => { calls++; }, 15);
fn();
fn.cancel();
await new Promise((r) => setTimeout(r, 30));
assert(calls === 0, 'a cancelled call must never invoke fn, got ' + calls + ' calls');`,
      },
      {
        name: "flush_invokes_immediately_with_latest_args",
        code: `let received = null, calls = 0;
const fn = debounce((v) => { received = v; calls++; }, 1000);
fn('a');
fn('b');
fn.flush();
assert(received === 'b', 'flush must invoke synchronously with the latest pending arguments');
await new Promise((r) => setTimeout(r, 20));
assert(calls === 1, 'after flush, the original timer must not also fire — fn was called ' + calls + ' times total');`,
      },
      {
        name: "flush_with_nothing_pending_is_a_no_op",
        code: `let calls = 0;
const fn = debounce(() => { calls++; }, 15);
fn.flush();
assert(calls === 0, 'flushing an idle debounce (nothing pending) must not call fn');`,
      },
      {
        name: "calling_again_after_flush_starts_a_fresh_cycle",
        code: `let received = [];
const fn = debounce((v) => { received.push(v); }, 15);
fn('a');
fn.flush();
fn('b');
await new Promise((r) => setTimeout(r, 30));
assert(received.join(',') === 'a,b', 'a call after flush must start a normal new debounce cycle, got ' + received.join(','));`,
      },
    ],
    solution: {
      code: `function debounce(fn, wait) {
  let timeoutId = null;
  let pendingArgs = null;
  let hasPending = false;

  const invoke = () => {
    const args = pendingArgs;
    hasPending = false;
    pendingArgs = null;
    timeoutId = null;
    fn(...args);
  };

  function wrapped(...args) {
    pendingArgs = args;
    hasPending = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(invoke, wait);
  }

  wrapped.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
    pendingArgs = null;
    hasPending = false;
  };

  wrapped.flush = () => {
    if (!hasPending) return;
    if (timeoutId) clearTimeout(timeoutId);
    invoke();
  };

  return wrapped;
}

module.exports = debounce;`,
      explanation:
        "The closure holds exactly one pending timer and one set of pending arguments at a time — every call clears whatever timeout is currently scheduled and starts a fresh one, which is the reset behavior debounce is named for, and means only the most recent arguments ever get used. hasPending exists specifically so flush() can distinguish 'nothing is scheduled' from 'something is scheduled with these arguments' — without it, flushing an idle debounce would either throw on undefined args or silently invoke with stale data from a previous cycle. Both cancel() and flush() clear the pending timeout before doing anything else, which is what stops the original setTimeout from also firing fn a second time after a flush.",
    },
};
