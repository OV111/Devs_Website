export default {
  slug: "promise-combinators",
  trackId: "mern",
  layerId: "mern-2",
  type: "CODE",
  difficulty: "med",
  title: "Build Promise.all, race and any",
  summary: "Re-implement the three promise combinators on top of a bare Promise constructor: result order, early rejection and AggregateError.",
  description:
    "<code>Promise.all</code>, <code>Promise.race</code> and <code>Promise.any</code> look like three versions of one idea, but their rules differ: who wins, what happens on rejection, and in what order results come back. Writing them yourself is the fastest way to stop mixing them up.",
  task:
    "Write <code>all(iterable)</code>, <code>race(iterable)</code> and <code>any(iterable)</code>, each returning a promise. Do NOT call the built-in <code>Promise.all</code>, <code>race</code>, <code>any</code> or <code>allSettled</code>; the tests make them throw.",
  constraints: [
    "All three accept any iterable (array, Set, generator) whose items may be promises, thenables or plain values.",
    "<code>all</code> resolves with an array of results in INPUT order (not completion order), rejects with the first rejection, and resolves <code>[]</code> for an empty input.",
    "<code>race</code> settles exactly like the first input to settle, fulfilled or rejected.",
    "<code>any</code> resolves with the first FULFILLED value and ignores rejections until nothing is left; if every input rejects (or the input is empty) it rejects with an <code>AggregateError</code> whose <code>errors</code> array holds the reasons in input order.",
  ],
  example: `await all([1, Promise.resolve(2), fetchThing()]) // [1, 2, thing]`,
  tags: ["promises", "async", "polyfill"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "combinators.js",
      lang: "js",
      code: `// combinators.js
function all(iterable) {
  // your code here
}

function race(iterable) {
  // your code here
}

function any(iterable) {
  // your code here
}

module.exports = { all, race, any };`,
    },
  ],
  testFile: {
    name: "combinators_test.js",
    lang: "test",
    code: `const { all, race, any } = require('./combinators');

test('all keeps input order', async () => {
  expect(await all([1, Promise.resolve(2)])).toEqual([1, 2]);
});

test('any ignores early rejections', async () => {
  expect(await any([Promise.reject(new Error('x')), 7])).toBe(7);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Wrap each item with <code>Promise.resolve(item)</code> (that's allowed: it's what turns thenables and plain values into promises), then attach <code>.then(onOk, onFail)</code>." },
    { order: 2, cost: 5, text: "For <code>all</code>, write each result into <code>results[i]</code> using the loop index and count down a <code>remaining</code> counter; resolve when it hits 0." },
    { order: 3, cost: 15, text: "<code>any</code> is the mirror image of <code>all</code>: collect rejection reasons by index, reject with <code>new AggregateError(errors)</code> when the counter reaches 0, and resolve on the first fulfilment." },
  ],
  hiddenTests: [
    { name: "all_keeps_input_order", code: `let r1, r2;
const p1 = new Promise((r) => { r1 = r; });
const p2 = new Promise((r) => { r2 = r; });
const result = all([p1, p2, 3]);
r2('second'); r1('first');
const v = await result;
assert(JSON.stringify(v) === '["first","second",3]', 'got ' + JSON.stringify(v));` },
    { name: "all_empty_resolves_empty_array", code: `const v = await all([]);
assert(Array.isArray(v) && v.length === 0, 'got ' + JSON.stringify(v));` },
    { name: "all_rejects_with_first_rejection", code: `let rej, res;
const slow = new Promise((r) => { res = r; });
const failing = new Promise((_, r) => { rej = r; });
const result = all([slow, failing]);
rej(new Error('boom'));
let err = null;
try { await result; } catch (e) { err = e; }
assert(err && err.message === 'boom', 'rejected with the failure');
res('late');` },
    { name: "accepts_any_iterable_and_thenables", code: `const fromSet = await all(new Set([1, 2]));
assert(JSON.stringify(fromSet) === '[1,2]', 'set');
function* gen() { yield 1; yield Promise.resolve(2); }
const fromGen = await all(gen());
assert(JSON.stringify(fromGen) === '[1,2]', 'generator');
const thenable = { then(resolve) { resolve('t'); } };
const fromThenable = await all([thenable]);
assert(fromThenable[0] === 't', 'thenable');` },
    { name: "race_settles_like_the_first", code: `let a, b;
const pa = new Promise((r) => { a = r; });
const pb = new Promise((r) => { b = r; });
const result = race([pa, pb]);
b('b-first');
a('a-late');
assert((await result) === 'b-first', 'first fulfilment wins');
let rej;
const slow = new Promise(() => {});
const fail = new Promise((_, r) => { rej = r; });
const lost = race([slow, fail]);
rej(new Error('nope'));
let err = null;
try { await lost; } catch (e) { err = e; }
assert(err && err.message === 'nope', 'first rejection also wins a race');` },
    { name: "any_resolves_first_fulfilment_ignoring_rejections", code: `const v = await any([Promise.reject(new Error('a')), Promise.reject(new Error('b')), 'ok']);
assert(v === 'ok', 'got ' + v);` },
    { name: "any_rejects_with_aggregate_error_in_input_order", code: `let r1, r2;
const p1 = new Promise((_, r) => { r1 = r; });
const p2 = new Promise((_, r) => { r2 = r; });
const result = any([p1, p2]);
r2(new Error('two')); r1(new Error('one'));
let err = null;
try { await result; } catch (e) { err = e; }
assert(err instanceof AggregateError, 'AggregateError');
assert(err.errors.length === 2 && err.errors[0].message === 'one' && err.errors[1].message === 'two', 'reasons in input order');` },
    { name: "any_with_empty_input_rejects", code: `let err = null;
try { await any([]); } catch (e) { err = e; }
assert(err instanceof AggregateError && err.errors.length === 0, 'empty -> AggregateError with no errors');` },
    { name: "builtins_are_not_used", code: `const saved = { all: Promise.all, race: Promise.race, any: Promise.any, allSettled: Promise.allSettled };
const trap = () => { throw new Error('used a built-in combinator'); };
Promise.all = trap; Promise.race = trap; Promise.any = trap; Promise.allSettled = trap;
try {
  assert((await all([1, 2])).length === 2, 'all works');
  assert((await race([1, 2])) === 1, 'race works');
  assert((await any([Promise.reject(1), 2])) === 2, 'any works');
} finally {
  Promise.all = saved.all; Promise.race = saved.race; Promise.any = saved.any; Promise.allSettled = saved.allSettled;
}` },
  ],
  solution: {
    code: `function all(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}

function race(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) Promise.resolve(item).then(resolve, reject);
  });
}

function any(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const errors = new Array(items.length);
    let remaining = items.length;
    const fail = () => reject(new AggregateError(errors, 'All promises were rejected'));
    if (remaining === 0) return fail();
    items.forEach((item, i) => {
      Promise.resolve(item).then(resolve, (reason) => {
        errors[i] = reason;
        if (--remaining === 0) fail();
      });
    });
  });
}

module.exports = { all, race, any };`,
    explanation:
      "A promise can only settle once, so race is just 'hand resolve and reject to everyone'. all and any are mirror images: each counts down to zero, and writes into an array by index so completion order never matters. Promise.resolve(item) is the normaliser that makes thenables and plain values work without special cases.",
  },
};
