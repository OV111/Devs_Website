export default {
    slug: "async-error-wrapper",
    trackId: "api-dev",
    layerId: "api-dev-3",
    type: "CODE",
    difficulty: "med",
    title: "Async error wrapper for Express",
    summary:
      "Wrap async route handlers so rejected promises reach Express's error pipeline instead of crashing silently.",
    description:
      "You're building an Express API where every route handler is <code>async</code>. Right now, any error thrown inside an async handler escapes the framework's error pipeline and crashes silently.",
    task:
      "Write a function <code>asyncHandler(fn)</code> that takes an async route handler and returns a wrapped handler that catches any rejection and forwards it to Express's <code>next()</code>.",
    constraints: [
      "Must work with both async functions and functions returning Promises.",
      "Must not change the original function's signature.",
      "Synchronous handlers should still work if accidentally wrapped.",
      "No external libraries (the standard library is fine).",
    ],
    example: `const safeGet = asyncHandler(async (req, res) => {
  const data = await fetchData(req.params.id);
  res.json(data);
});
app.get('/data/:id', safeGet);`,
    tags: ["async", "errors", "middleware"],
    estimatedMins: 25,
    xp: 45,
    starterFiles: [
      {
        name: "asyncHandler.js",
        lang: "js",
        code: `// asyncHandler.js
// Wrap an async express handler so rejections reach next()

function asyncHandler(fn) {
  // your code here
}

module.exports = asyncHandler;`,
      },
    ],
    testFile: {
      name: "asyncHandler_test.js",
      lang: "test",
      code: `// asyncHandler_test.js
const asyncHandler = require('./asyncHandler');

test('resolved_promise_passes', async () => {
  const fn = jest.fn().mockResolvedValue(undefined);
  const handler = asyncHandler(fn);
  const req = {}, res = {}, next = jest.fn();
  await handler(req, res, next);
  expect(next).not.toHaveBeenCalled();
});

test('rejection_calls_next', async () => {
  const err = new Error('boom');
  const fn = jest.fn().mockRejectedValue(err);
  const handler = asyncHandler(fn);
  const next = jest.fn();
  await handler({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});

test('sync_throw_calls_next', () => {
  const err = new Error('sync');
  const fn = () => { throw err; };
  const handler = asyncHandler(fn);
  const next = jest.fn();
  handler({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});

test('does_not_mutate_fn', () => {
  const fn = async () => {};
  asyncHandler(fn);
  expect(fn.length).toBe(0);
});

test('preserves_arity', () => {
  const errorHandler = async (err, req, res, next) => {};
  const wrapped = asyncHandler(errorHandler);
  expect(wrapped.length).toBe(4);
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "Express decides whether a function is an error handler by reading <code>fn.length</code>. A plain wrapper always reports its own arity, not the wrapped function's.",
      },
      {
        order: 2,
        cost: 5,
        text: "Use <code>Object.defineProperty</code> on the wrapper to set its <code>length</code> to match <code>fn.length</code> before returning it.",
      },
      {
        order: 3,
        cost: 15,
        text: "Here's the key line: <code>Object.defineProperty(wrapper, 'length', { value: fn.length });</code>",
      },
    ],
    // Hidden tests decide a pass. They are never sent to the client, so a
    // student editing the visible test file cannot fake a green run. These
    // cover the same contract plus the edge cases the visible set leaves open.
    hiddenTests: [
      {
        name: "forwards_rejection_to_next",
        code: `const err = new Error('x');
const handler = asyncHandler(async () => { throw err; });
let got = null;
await handler({}, {}, (e) => { got = e; });
assert(got === err, 'next() should receive the thrown error');`,
      },
      {
        name: "sync_throw_forwarded",
        code: `const err = new Error('sync');
const handler = asyncHandler(() => { throw err; });
let got = null;
handler({}, {}, (e) => { got = e; });
assert(got === err, 'a synchronous throw must also reach next()');`,
      },
      {
        name: "success_path_does_not_call_next",
        code: `let called = false;
const handler = asyncHandler(async (req, res) => { res.ok = true; });
const res = {};
await handler({}, res, () => { called = true; });
assert(res.ok === true, 'the handler should still run');
assert(called === false, 'next() must not be called on success');`,
      },
      {
        name: "preserves_arity_for_error_handlers",
        code: `const wrapped = asyncHandler(async (err, req, res, next) => {});
assert(wrapped.length === 4, 'Express reads fn.length — a 4-arg handler must stay 4-arg');`,
      },
      {
        name: "preserves_arity_for_normal_handlers",
        code: `const wrapped = asyncHandler(async (req, res, next) => {});
assert(wrapped.length === 3, 'a 3-arg handler must stay 3-arg');`,
      },
      {
        name: "does_not_mutate_the_original",
        code: `const fn = async (req, res) => {};
const before = fn.length;
asyncHandler(fn);
assert(fn.length === before, 'the original function must not be modified');`,
      },
      {
        name: "works_with_plain_promise_returning_fn",
        code: `const err = new Error('p');
const handler = asyncHandler(() => Promise.reject(err));
let got = null;
await handler({}, {}, (e) => { got = e; });
assert(got === err, 'a non-async function returning a Promise must work too');`,
      },
    ],
    solution: {
      code: `function asyncHandler(fn) {
  const wrapper = function (req, res, next) {
    try {
      const result = fn.apply(this, arguments);
      if (result && typeof result.catch === 'function') result.catch(next);
    } catch (err) {
      next(err);
    }
  };
  Object.defineProperty(wrapper, 'length', { value: fn.length });
  return wrapper;
}

module.exports = asyncHandler;`,
      explanation:
        "The wrapper calls the handler, and if the return value is thenable it attaches next as the rejection handler. Synchronous throws are caught by the try/catch. The arity is copied onto the wrapper because Express inspects fn.length to distinguish a four-argument error handler from a normal three-argument one — without it, wrapped error handlers are silently treated as regular middleware.",
    },
};
