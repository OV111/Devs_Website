export default {
  slug: "promisify",
  trackId: "node-dev",
  layerId: "node-dev-3",
  type: "CODE",
  difficulty: "easy",
  title: "Write util.promisify",
  summary: "Convert a Node-style callback function (err, value) into one that returns a promise.",
  description:
    "Older Node APIs take a callback as the last argument: <code>fs.readFile(path, (err, data) =&gt; ...)</code>. <code>util.promisify</code> wraps them so you can use <code>await</code>. It is the bridge between callbacks and async/await.",
  task:
    "Write <code>promisify(fn)</code> returning a function that calls <code>fn</code> with the same arguments plus a callback, and returns a promise.",
  constraints: [
    "The callback has the signature <code>(err, value)</code>: a truthy <code>err</code> rejects with that exact error; otherwise the promise resolves with the FIRST value (<code>undefined</code> if there is none).",
    "Arguments are passed in order, with the callback appended last.",
    "<code>this</code> is preserved, so a promisified method still works when called as <code>obj.method()</code>.",
    "If <code>fn</code> throws synchronously, the returned promise rejects (it must not throw).",
    "A callback invoked more than once only counts the first time.",
  ],
  example: `const readP = promisify(fs.readFile); const data = await readP('a.txt', 'utf8');`,
  tags: ["callbacks","promises","async-await","util"],
  estimatedMins: 20,
  xp: 25,
  starterFiles: [
    {
      name: "promisify.js",
      lang: "js",
      code: `// promisify.js
function promisify(fn) {
  // your code here
}

module.exports = promisify;`,
    },
  ],
  testFile: {
    name: "promisify_test.js",
    lang: "test",
    code: `const promisify = require('./promisify');

test('resolves', () => {
  const f = promisify((a, cb) => cb(null, a * 2)); return f(4).then((v) => expect(v).toBe(8));
});

test('rejects', () => {
  const f = promisify((cb) => cb(new Error('x'))); return f().then(() => expect(true).toBe(false), (e) => expect(e.message).toBe('x'));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Return a function that returns <code>new Promise((resolve, reject) =&gt; ...)</code>; inside, call the original with your own callback appended." },
    { order: 2, cost: 5, text: "Use a regular <code>function</code> (not an arrow) for the wrapper so it gets its own <code>this</code>, then <code>fn.call(this, ...args, callback)</code>." },
    { order: 3, cost: 15, text: "A throw inside the Promise executor is automatically turned into a rejection, which covers the synchronous-throw case." },
  ],
  hiddenTests: [
    { name: "resolves_with_value", code: `const f = promisify((a, b, cb) => cb(null, a + b));
assert(await f(2, 3) === 5, 'value');` },
    { name: "rejects_with_the_same_error", code: `const err = new Error('boom'); let got = null;
try { await promisify((cb) => cb(err))(); } catch (e) { got = e; }
assert(got === err, 'exact error object');` },
    { name: "returns_a_promise_immediately", code: `const p = promisify((cb) => setTimeout(() => cb(null, 1), 5))();
assert(p instanceof Promise, 'promise');
assert(await p === 1, 'async callback');` },
    { name: "arguments_in_order_callback_last", code: `let seen;
await promisify((a, b, c, cb) => { seen = [a, b, c, typeof cb]; cb(null); })(1, 'two', { x: 3 });
assert(seen[0] === 1 && seen[1] === 'two' && seen[2].x === 3 && seen[3] === 'function', 'args: ' + JSON.stringify(seen));` },
    { name: "no_value_and_extra_values", code: `assert(await promisify((cb) => cb(null))() === undefined, 'no value');
assert(await promisify((cb) => cb(null, 'first', 'second'))() === 'first', 'only the first value');` },
    { name: "falsy_error_means_success", code: `assert(await promisify((cb) => cb(undefined, 'a'))() === 'a', 'undefined');
assert(await promisify((cb) => cb(0, 'b'))() === 'b', '0');
assert(await promisify((cb) => cb(null, 'c'))() === 'c', 'null');` },
    { name: "preserves_this", code: `const obj = { n: 7, get(cb) { cb(null, this.n); } };
obj.get = promisify(obj.get);
assert(await obj.get() === 7, 'this is the object');` },
    { name: "sync_throw_becomes_rejection", code: `const f = promisify(() => { throw new Error('sync'); });
let p; let thrown = false;
try { p = f(); } catch (e) { thrown = true; }
assert(!thrown, 'must not throw synchronously');
let got = null;
try { await p; } catch (e) { got = e; }
assert(got && got.message === 'sync', 'rejects instead');` },
    { name: "callback_called_twice_counts_once", code: `const f = promisify((cb) => { cb(null, 'first'); cb(null, 'second'); cb(new Error('late')); });
assert(await f() === 'first', 'first call wins');` },
  ],
  solution: {
    code: `function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  };
}

module.exports = promisify;`,
    explanation:
      "The promise executor gives you resolve and reject, and you hand fn a callback that maps (err, value) onto them. A promise can only settle once, so duplicate callbacks are harmless, and an exception inside the executor becomes a rejection automatically.",
  },
};
