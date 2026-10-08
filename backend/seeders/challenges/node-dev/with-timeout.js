export default {
  slug: "with-timeout",
  trackId: "node-dev",
  layerId: "node-dev-1",
  type: "CODE",
  difficulty: "med",
  title: "Add a timeout to any promise",
  summary: "Race a promise against a timer and clean the timer up afterwards.",
  description:
    "A promise can hang forever: a slow database, a dead network. Production code wraps risky calls in a timeout. Done wrong, it also leaves a timer running that keeps Node alive.",
  task:
    "Write <code>withTimeout(promise, ms)</code> returning a promise that settles like <code>promise</code> if it finishes within <code>ms</code> milliseconds, otherwise rejects with an <code>Error</code> whose message is <code>'Timed out after &lt;ms&gt;ms'</code>.",
  constraints: [
    "If the promise fulfils or rejects first, pass that result through unchanged.",
    "The timer must be cleared with <code>clearTimeout</code> as soon as the promise settles.",
    "Plain (non-promise) values are accepted and resolve immediately.",
    "A late result after the timeout is ignored (the returned promise has already rejected).",
  ],
  example: `await withTimeout(fetchUser(), 2000); // rejects with 'Timed out after 2000ms' if fetchUser takes longer`,
  tags: ["promises","async","event-loop","timers"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "withTimeout.js",
      lang: "js",
      code: `// withTimeout.js
function withTimeout(promise, ms) {
  // your code here
}

module.exports = withTimeout;`,
    },
  ],
  testFile: {
    name: "withTimeout_test.js",
    lang: "test",
    code: `const withTimeout = require('./withTimeout');

test('passes_value', () => {
  return withTimeout(Promise.resolve(5), 100).then((v) => expect(v).toBe(5));
});

test('times_out', () => {
  return withTimeout(new Promise(() => {}), 10).then(() => expect(true).toBe(false), (e) => expect(e.message).toBe('Timed out after 10ms'));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Create a second promise that rejects inside a <code>setTimeout</code>, and store the timer id in a variable declared outside it." },
    { order: 2, cost: 5, text: "<code>Promise.race([promise, timeoutPromise])</code> settles with whichever is first." },
    { order: 3, cost: 15, text: "Add <code>.finally(() =&gt; clearTimeout(timer))</code> to the race so the timer is always cleaned up." },
  ],
  hiddenTests: [
    { name: "resolves_with_the_value", code: `const v = await withTimeout(new Promise((r) => setTimeout(() => r('ok'), 5)), 200);
assert(v === 'ok', 'value passes through');` },
    { name: "rejects_with_the_original_error", code: `const err = new Error('db down'); let got = null;
try { await withTimeout(Promise.reject(err), 200); } catch (e) { got = e; }
assert(got === err, 'same error object');` },
    { name: "times_out_with_message", code: `let got = null;
try { await withTimeout(new Promise(() => {}), 15); } catch (e) { got = e; }
assert(got instanceof Error, 'rejects with an Error');
assert(got.message === 'Timed out after 15ms', 'message: ' + (got && got.message));` },
    { name: "timeout_actually_waits_ms", code: `const t0 = Date.now();
try { await withTimeout(new Promise(() => {}), 40); } catch (e) {}
assert(Date.now() - t0 >= 35, 'should wait about 40ms');` },
    { name: "plain_values", code: `assert(await withTimeout(42, 50) === 42, 'plain value');` },
    { name: "late_result_is_ignored", code: `let got = null;
try { await withTimeout(new Promise((r) => setTimeout(() => r('late'), 60)), 10); } catch (e) { got = e; }
assert(got && got.message === 'Timed out after 10ms', 'timeout wins');
await new Promise((r) => setTimeout(r, 70));` },
    { name: "clears_the_timer_on_success", code: `const orig = globalThis.clearTimeout; let cleared = 0;
globalThis.clearTimeout = (id) => { cleared++; return orig(id); };
try { await withTimeout(Promise.resolve(1), 1000); } finally { globalThis.clearTimeout = orig; }
assert(cleared >= 1, 'clearTimeout must be called when the promise wins');` },
    { name: "clears_the_timer_on_failure", code: `const orig = globalThis.clearTimeout; let cleared = 0;
globalThis.clearTimeout = (id) => { cleared++; return orig(id); };
try { await withTimeout(Promise.reject(new Error('x')), 1000); } catch (e) {} finally { globalThis.clearTimeout = orig; }
assert(cleared >= 1, 'also on rejection');` },
  ],
  solution: {
    code: `function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timed out after ' + ms + 'ms')), ms);
  });
  return Promise.race([Promise.resolve(promise), timeout]).finally(() => clearTimeout(timer));
}

module.exports = withTimeout;`,
    explanation:
      "Promise.race settles with the first of the two. finally runs either way, so the timer never outlives the call. The event loop would otherwise stay alive until the timer fires.",
  },
};
