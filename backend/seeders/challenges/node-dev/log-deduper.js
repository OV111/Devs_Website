export default {
  slug: "log-deduper",
  trackId: "node-dev",
  layerId: "node-dev-7",
  type: "CODE",
  difficulty: "med",
  title: "De-duplicate repeated error logs",
  summary: "Fingerprint errors so a failing dependency logs once per window with a count, instead of flooding the logs.",
  description:
    "When a database goes down, thousands of requests throw the same error. Logging every one costs money, hides other problems and can overload the log pipeline. A de-duper groups errors by fingerprint (their message with ids and numbers masked) and logs the first, then a summary.",
  task:
    "Write <code>createLogDeduper({ windowMs = 60000, maxKeys = 1000, now })</code> returning <code>{ fingerprint, check, stats }</code>.",
  constraints: [
    "<code>fingerprint(err)</code> is <code>name + ':' + message</code> with UUIDs replaced by <code>&lt;uuid&gt;</code>, then <code>0x...</code> hex numbers by <code>&lt;hex&gt;</code>, then runs of digits by <code>&lt;n&gt;</code>. For non-Errors the name is <code>typeof</code> the value and the message is <code>String(value)</code>.",
    "<code>check(err)</code> returns <code>{ log, suppressed, fingerprint }</code>. The first time a fingerprint is seen, or once <code>windowMs</code> has passed since its window started, <code>log</code> is true, <code>suppressed</code> is how many occurrences were swallowed during the PREVIOUS window (0 for a new fingerprint), and a new window starts now.",
    "Occurrences inside the window return <code>log: false</code> with <code>suppressed</code> being the running count of swallowed ones so far (including this one). A window starts at the moment its error was logged; a window is over when <code>now - windowStart &gt;= windowMs</code>.",
    "At most <code>maxKeys</code> fingerprints are remembered: when a new one pushes the count over the limit, the fingerprint whose window started earliest is forgotten.",
    "<code>stats()</code> returns <code>{ keys }</code>, the number of remembered fingerprints.",
  ],
  example: `dedupe.check(new Error('timeout after 30 ms')) // { log: true, suppressed: 0, fingerprint: 'Error:timeout after <n> ms' }`,
  tags: ["logging","observability","operations","errors"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createLogDeduper.js",
      lang: "js",
      code: `// createLogDeduper.js
function createLogDeduper(options = {}) {
  // your code here
}

module.exports = createLogDeduper;`,
    },
  ],
  testFile: {
    name: "createLogDeduper_test.js",
    lang: "test",
    code: `const createLogDeduper = require('./createLogDeduper');

test('first_logs', () => {
  const d = createLogDeduper({ now: () => 0 }); expect(d.check(new Error('x')).log).toBe(true); expect(d.check(new Error('x')).log).toBe(false);
});

test('fingerprint', () => {
  expect(createLogDeduper().fingerprint(new Error('user 42 not found'))).toBe('Error:user <n> not found');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>Map</code> from fingerprint to <code>{ windowStart, suppressed }</code>. A Map iterates in insertion order, so deleting and re-inserting a key when its window restarts keeps the oldest window first." },
    { order: 2, cost: 5, text: "Apply the three <code>replace</code> calls in the order uuid, hex, digits; otherwise the digit rule would chew up the other two." },
    { order: 3, cost: 15, text: "Evict with <code>seen.delete(seen.keys().next().value)</code> after inserting when the size exceeds <code>maxKeys</code>." },
  ],
  hiddenTests: [
    { name: "fingerprint_masks_ids_hex_and_numbers", code: `const d = createLogDeduper();
assert(d.fingerprint(new Error('User 42 not found')) === 'Error:User <n> not found', 'numbers');
assert(d.fingerprint(new Error('timeout after 30 ms on port 5432')) === 'Error:timeout after <n> ms on port <n>', 'several numbers');
assert(d.fingerprint(new Error('order 3f2504e0-4f89-11d3-9a0c-0305e82c3301 failed')) === 'Error:order <uuid> failed', 'uuid');
assert(d.fingerprint(new Error('bad pointer 0xDEADbeef')) === 'Error:bad pointer <hex>', 'hex');
assert(d.fingerprint(new TypeError('x is undefined')) === 'TypeError:x is undefined', 'uses the error name');
assert(d.fingerprint(new Error('same')) === d.fingerprint(new Error('same')), 'stable');` },
    { name: "fingerprint_of_non_errors", code: `const d = createLogDeduper();
assert(d.fingerprint('boom 5') === 'string:boom <n>', 'string: ' + d.fingerprint('boom 5'));
assert(d.fingerprint(42) === 'number:<n>', 'number');
assert(d.fingerprint(null) === 'object:null', 'null: ' + d.fingerprint(null));
assert(d.fingerprint(undefined) === 'undefined:undefined', 'undefined');` },
    { name: "first_occurrence_is_logged_with_zero_suppressed", code: `const d = createLogDeduper({ now: () => 0 });
const r = d.check(new Error('db down'));
assert(r.log === true && r.suppressed === 0 && r.fingerprint === 'Error:db down', JSON.stringify(r));` },
    { name: "repeats_inside_the_window_are_suppressed_and_counted", code: `let t = 0; const d = createLogDeduper({ windowMs: 1000, now: () => t });
d.check(new Error('db down'));
t = 100; const a = d.check(new Error('db down'));
t = 500; const b = d.check(new Error('db down'));
t = 999; const c = d.check(new Error('db down'));
assert(a.log === false && a.suppressed === 1 && b.suppressed === 2 && c.suppressed === 3 && c.log === false, 'running count: ' + [a.suppressed, b.suppressed, c.suppressed]);` },
    { name: "window_end_logs_again_with_the_suppressed_count", code: `let t = 0; const d = createLogDeduper({ windowMs: 1000, now: () => t });
d.check(new Error('db down'));
t = 300; d.check(new Error('db down')); t = 600; d.check(new Error('db down'));
t = 1000;
const r = d.check(new Error('db down'));
assert(r.log === true && r.suppressed === 2, 'summary of the previous window: ' + JSON.stringify(r));
t = 1500;
const next = d.check(new Error('db down'));
assert(next.log === false && next.suppressed === 1, 'a fresh window starts at the moment of logging');
t = 2000;
assert(d.check(new Error('db down')).log === true, 'and ends windowMs later');` },
    { name: "a_quiet_period_resets_counting", code: `let t = 0; const d = createLogDeduper({ windowMs: 1000, now: () => t });
d.check(new Error('x'));
t = 5000;
const r = d.check(new Error('x'));
assert(r.log === true && r.suppressed === 0, 'nothing was swallowed, so nothing to report');` },
    { name: "errors_that_differ_only_in_numbers_are_grouped", code: `let t = 0; const d = createLogDeduper({ windowMs: 1000, now: () => t });
assert(d.check(new Error('user 1 not found')).log === true, 'first');
assert(d.check(new Error('user 2 not found')).log === false, 'same fingerprint');
assert(d.check(new Error('user 3 not found')).suppressed === 2, 'counted together');
assert(d.check(new Error('order 3 not found')).log === true, 'different message is a different fingerprint');` },
    { name: "same_message_different_class_is_separate", code: `const d = createLogDeduper({ now: () => 0 });
assert(d.check(new Error('x')).log === true, 'Error');
assert(d.check(new TypeError('x')).log === true, 'TypeError is another fingerprint');
assert(d.check('x').log === true, 'a string too');` },
    { name: "independent_windows_per_fingerprint", code: `let t = 0; const d = createLogDeduper({ windowMs: 1000, now: () => t });
d.check(new Error('a'));
t = 600; d.check(new Error('b'));
t = 1000;
assert(d.check(new Error('a')).log === true, 'a window over');
assert(d.check(new Error('b')).log === false, 'b window still open (started at 600)');` },
    { name: "max_keys_forgets_the_oldest_window", code: `let t = 0; const d = createLogDeduper({ windowMs: 1e9, maxKeys: 2, now: () => t });
d.check(new Error('a')); t = 1; d.check(new Error('b')); t = 2; d.check(new Error('c'));
assert(d.stats().keys === 2, 'capped: ' + d.stats().keys);
assert(d.check(new Error('a')).log === true, 'a was forgotten, so it logs as new');
assert(d.check(new Error('c')).log === false, 'c is still remembered');` },
    { name: "stats", code: `const d = createLogDeduper({ now: () => 0 });
assert(d.stats().keys === 0, 'empty');
d.check(new Error('a')); d.check(new Error('a')); d.check(new Error('b 1')); d.check(new Error('b 2'));
assert(d.stats().keys === 2, 'two fingerprints: ' + d.stats().keys);` },
    { name: "handles_errors_without_messages", code: `const d = createLogDeduper({ now: () => 0 });
const r = d.check(new Error());
assert(r.log === true && r.fingerprint === 'Error:', 'empty message: ' + JSON.stringify(r.fingerprint));
assert(d.check({ message: 'obj 7' }).fingerprint === 'object:obj <n>', 'object with message: ' + d.check({ message: 'obj 7' }).fingerprint);` },
  ],
  solution: {
    code: `function createLogDeduper({ windowMs = 60000, maxKeys = 1000, now = () => Date.now() } = {}) {
  const seen = new Map();

  function fingerprint(err) {
    const isErrorLike = err !== null && typeof err === 'object';
    const name = isErrorLike && err.name ? err.name : typeof err;
    const message = isErrorLike && err.message !== undefined ? String(err.message) : String(err);
    return (
      name +
      ':' +
      message
        .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<uuid>')
        .replace(/0x[0-9a-f]+/gi, '<hex>')
        .replace(/\\d+/g, '<n>')
    );
  }

  return {
    fingerprint,
    check(err) {
      const key = fingerprint(err);
      const t = now();
      const entry = seen.get(key);
      if (entry && t - entry.windowStart < windowMs) {
        entry.suppressed++;
        return { log: false, suppressed: entry.suppressed, fingerprint: key };
      }
      const suppressed = entry ? entry.suppressed : 0;
      seen.delete(key);
      seen.set(key, { windowStart: t, suppressed: 0 });
      if (seen.size > maxKeys) seen.delete(seen.keys().next().value);
      return { log: true, suppressed, fingerprint: key };
    },
    stats() {
      return { keys: seen.size };
    },
  };
}

module.exports = createLogDeduper;`,
    explanation:
      "Masking the variable parts of a message turns thousands of distinct strings into one fingerprint. Deleting and re-inserting a key when its window restarts keeps the Map ordered by window start, so evicting the first key always forgets the stalest fingerprint.",
  },
};
