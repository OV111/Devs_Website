export default {
  slug: "compose-middleware",
  trackId: "api-dev",
  layerId: "api-dev-4",
  type: "CODE",
  difficulty: "hard",
  title: "Compose Express-style middleware",
  summary: "Chain middleware functions so each can run code before and after the next one.",
  description:
    "Express and Koa are pipelines of functions that each receive a next() callback. Compose is the heart of Koa, in about 15 lines.",
  task:
    "Write <code>compose(middlewares)</code> returning <code>run(ctx)</code>. Each middleware is <code>(ctx, next) =&gt; ...</code> and may be async. <code>run</code> returns a promise.",
  constraints: [
    "<code>next()</code> runs the following middleware and returns a promise that resolves when it (and everything after it) is done.",
    "If a middleware doesn't call <code>next</code>, the rest are skipped.",
    "A thrown or rejected error makes <code>run</code>'s promise reject.",
    "Calling <code>next()</code> twice in one middleware rejects with an Error.",
    "An empty list resolves immediately.",
  ],
  example: `compose([async (c, next) => { c.log.push('a'); await next(); c.log.push('c'); }, async (c) => c.log.push('b')])`,
  tags: ["express","middleware","async"],
  estimatedMins: 35,
  xp: 70,
  starterFiles: [
    {
      name: "compose.js",
      lang: "js",
      code: `// compose.js
function compose(middlewares) {
  // your code here
}

module.exports = compose;`,
    },
  ],
  testFile: {
    name: "compose_test.js",
    lang: "test",
    code: `const compose = require('./compose');

test('runs_in_order', () => {
  const c = { log: [] }; return compose([async (x, n) => { x.log.push(1); await n(); }, async (x) => { x.log.push(2); }])(c).then(() => expect(c.log).toEqual([1, 2]));
});

test('empty_resolves', () => {
  return compose([])({}).then(() => expect(true).toBe(true));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write an inner <code>dispatch(i)</code> that calls <code>middlewares[i](ctx, () =&gt; dispatch(i + 1))</code>." },
    { order: 2, cost: 5, text: "Wrap the result in <code>Promise.resolve</code> so sync and async middleware behave the same." },
    { order: 3, cost: 15, text: "Remember the highest index dispatched so far; if <code>dispatch(i)</code> is called with <code>i &lt;= last</code>, next() was called twice." },
  ],
  hiddenTests: [
    { name: "onion_order", code: `const c = { log: [] };
await compose([
  async (x, next) => { x.log.push('a1'); await next(); x.log.push('a2'); },
  async (x, next) => { x.log.push('b1'); await next(); x.log.push('b2'); },
  async (x) => { x.log.push('c'); },
])(c);
assert(c.log.join(',') === 'a1,b1,c,b2,a2', 'onion order: ' + c.log);` },
    { name: "stops_when_next_not_called", code: `const c = { log: [] };
await compose([async (x) => { x.log.push('a'); }, async (x) => { x.log.push('b'); }])(c);
assert(c.log.join('') === 'a', 'second must not run');` },
    { name: "sync_middleware_works", code: `const c = { log: [] };
await compose([(x, next) => { x.log.push(1); return next(); }, (x) => { x.log.push(2); }])(c);
assert(c.log.join('') === '12', 'sync functions');` },
    { name: "awaits_async_downstream", code: `const c = { log: [] };
await compose([
  async (x, next) => { await next(); x.log.push('after'); },
  async (x) => { await new Promise((r) => setTimeout(r, 5)); x.log.push('slow'); },
])(c);
assert(c.log.join(',') === 'slow,after', 'next() must wait for downstream: ' + c.log);` },
    { name: "error_rejects", code: `let err = null;
try { await compose([async (x, next) => { await next(); }, async () => { throw new Error('bad'); }])({}); } catch (e) { err = e; }
assert(err && err.message === 'bad', 'rejects with the error');` },
    { name: "sync_throw_rejects", code: `let err = null;
try { await compose([() => { throw new Error('sync'); }])({}); } catch (e) { err = e; }
assert(err && err.message === 'sync', 'sync throw becomes rejection');` },
    { name: "next_twice_rejects", code: `let err = null;
try { await compose([async (x, next) => { await next(); await next(); }, async () => {}])({}); } catch (e) { err = e; }
assert(err instanceof Error, 'second next() must reject');` },
    { name: "empty_list", code: `await compose([])({});
assert(true, 'resolves');` },
  ],
  solution: {
    code: `function compose(middlewares) {
  return function run(ctx) {
    let last = -1;
    function dispatch(i) {
      if (i <= last) return Promise.reject(new Error('next() called multiple times'));
      last = i;
      const fn = middlewares[i];
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}

module.exports = compose;`,
    explanation:
      "dispatch(i) runs middleware i and hands it a next that dispatches i+1, which creates the before/after onion. Tracking the last index detects a double next().",
  },
};
