export default {
  slug: "mini-spy",
  trackId: "api-dev",
  layerId: "api-dev-8",
  type: "CODE",
  difficulty: "med",
  title: "Build a mini jest.fn() spy",
  summary: "A function that records its calls and can have its return value or implementation swapped.",
  description:
    "<code>jest.fn()</code> and <code>jest.spyOn()</code> are how you test code that calls external services without calling them. Writing one shows there is no magic.",
  task:
    "Write <code>createSpy(impl)</code> returning a function <code>spy</code> with extra members: <code>calls</code> (array of argument arrays), <code>callCount</code>, <code>mockReturnValue(v)</code>, <code>mockResolvedValue(v)</code>, <code>mockImplementation(fn)</code>, <code>calledWith(...args)</code>, <code>reset()</code>.",
  constraints: [
    "Calling <code>spy(...args)</code> records <code>args</code> and returns whatever the current implementation returns; <code>this</code> is passed through.",
    "With no <code>impl</code> the spy returns <code>undefined</code>.",
    "<code>mockReturnValue</code>, <code>mockResolvedValue</code> and <code>mockImplementation</code> replace the implementation and return the spy for chaining.",
    "<code>calledWith</code> is true if any call had exactly those arguments (compare with <code>JSON.stringify</code>).",
    "<code>reset()</code> clears the recorded calls but keeps the implementation.",
  ],
  example: `const send = createSpy().mockReturnValue(true); send('a@b.c'); send.calls; // [['a@b.c']]`,
  tags: ["testing","jest","mocking"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "createSpy.js",
      lang: "js",
      code: `// createSpy.js
function createSpy(impl) {
  // your code here
}

module.exports = createSpy;`,
    },
  ],
  testFile: {
    name: "createSpy_test.js",
    lang: "test",
    code: `const createSpy = require('./createSpy');

test('records_calls', () => {
  const s = createSpy(); s(1, 2); expect(s.calls).toEqual([[1, 2]]); expect(s.callCount).toBe(1);
});

test('return_value', () => {
  const s = createSpy().mockReturnValue(7); expect(s()).toBe(7);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "The returned function must itself be a normal function (so it can be called), with properties attached to it." },
    { order: 2, cost: 5, text: "Keep the implementation in a variable that the mock methods reassign." },
    { order: 3, cost: 15, text: "<code>callCount</code> can be a getter via <code>Object.defineProperty</code> so it always reflects <code>calls.length</code>." },
  ],
  hiddenTests: [
    { name: "records_args_in_order", code: `const s = createSpy(); s(1, 2); s('a');
assert(s.calls.length === 2 && s.calls[0].join(',') === '1,2' && s.calls[1][0] === 'a', 'calls');
assert(s.callCount === 2, 'callCount');` },
    { name: "default_returns_undefined", code: `assert(createSpy()(1) === undefined, 'undefined');` },
    { name: "wraps_impl", code: `const s = createSpy((a, b) => a + b);
assert(s(2, 3) === 5, 'real implementation runs');
assert(s.callCount === 1, 'and is recorded');` },
    { name: "mockReturnValue_chains", code: `const s = createSpy();
assert(s.mockReturnValue(42) === s, 'returns the spy');
assert(s() === 42, 'returns the value');` },
    { name: "mockResolvedValue", code: `const s = createSpy().mockResolvedValue('db-row');
const v = await s();
assert(v === 'db-row', 'resolves');` },
    { name: "mockImplementation", code: `const s = createSpy(() => 1);
s.mockImplementation((x) => x * 10);
assert(s(4) === 40, 'replaced implementation');` },
    { name: "calledWith", code: `const s = createSpy(); s('a', { b: 1 });
assert(s.calledWith('a', { b: 1 }) === true, 'deep arguments');
assert(s.calledWith('a') === false, 'different arity');` },
    { name: "reset_keeps_implementation", code: `const s = createSpy().mockReturnValue(9); s(); s();
s.reset();
assert(s.callCount === 0 && s.calls.length === 0, 'calls cleared');
assert(s() === 9, 'implementation kept');` },
    { name: "passes_this", code: `const s = createSpy(function () { return this.x; });
const o = { x: 5, f: s };
assert(o.f() === 5, 'this is forwarded');` },
  ],
  solution: {
    code: `function createSpy(impl) {
  let current = impl || (() => undefined);
  function spy(...args) {
    spy.calls.push(args);
    return current.apply(this, args);
  }
  spy.calls = [];
  Object.defineProperty(spy, 'callCount', { get: () => spy.calls.length });
  spy.mockReturnValue = (v) => { current = () => v; return spy; };
  spy.mockResolvedValue = (v) => { current = () => Promise.resolve(v); return spy; };
  spy.mockImplementation = (fn) => { current = fn; return spy; };
  spy.calledWith = (...args) => spy.calls.some((c) => JSON.stringify(c) === JSON.stringify(args));
  spy.reset = () => { spy.calls.length = 0; };
  return spy;
}

module.exports = createSpy;`,
    explanation:
      "Functions are objects, so the spy is a normal function with extra properties. A swappable 'current' implementation variable is all the mock methods change.",
  },
};
