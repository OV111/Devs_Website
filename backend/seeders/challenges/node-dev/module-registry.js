export default {
  slug: "module-registry",
  trackId: "node-dev",
  layerId: "node-dev-8",
  type: "CODE",
  difficulty: "hard",
  title: "A module registry with mocking (jest.mock)",
  summary: "Build a require() with a cache, circular dependencies, mock/unmock, resetModules, isolateModules and automock.",
  description:
    "To test code in isolation you replace its dependencies. <code>jest.mock('./db')</code> works because Node modules are cached by name and test tools control that cache. Building a tiny registry explains why you must mock BEFORE the module under test is loaded, and what <code>resetModules</code> is for.",
  task:
    "Write <code>createRegistry(definitions)</code>. <code>definitions</code> maps a module name to a factory <code>(require, module) =&gt; ...</code> that sets <code>module.exports</code> (initially <code>{}</code>). Return <code>{ require, mock, unmock, resetModules, isolateModules, automock }</code>.",
  constraints: [
    "<code>require(name)</code> runs a module's factory once and caches <code>module.exports</code>; unknown names throw <code>Error(\"Cannot find module 'name'\")</code>. Factories receive the registry's own <code>require</code>. Circular requires return the partially filled <code>module.exports</code> of the module still loading (CommonJS behavior). If a factory throws, nothing is cached and the error propagates.",
    "<code>mock(name, factory)</code> makes later <code>require(name)</code> calls return <code>factory()</code> instead of the real module (the factory runs lazily, once per cache). It only affects FUTURE requires: modules that already loaded keep what they got. A mocked name need not exist in <code>definitions</code>.",
    "<code>unmock(name)</code> removes the mock. <code>resetModules()</code> empties the module cache and the cache of mock results (mocks stay registered, so mock factories run again on next require).",
    "<code>isolateModules(fn)</code> runs <code>fn</code> with temporary empty caches, restores the previous caches afterwards (even if <code>fn</code> throws) and returns <code>fn</code>'s result.",
    "<code>automock(name)</code> loads the REAL module in isolation (bypassing any existing mock for that name), registers and returns a mock whose exports are the real exports with every function replaced by a spy: a function with <code>calls</code> (array of argument arrays), <code>mockReturnValue(v)</code> (chainable) and a default return of <code>undefined</code>. Plain objects are mocked recursively; other values are kept.",
  ],
  example: `reg.mock('./db', () => ({ find: () => ({ id: 1 }) })); reg.require('./userService'); // sees the fake db`,
  tags: ["testing","jest","mocking","modules"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "createRegistry.js",
      lang: "js",
      code: `// createRegistry.js
function createRegistry(definitions) {
  // your code here
}

module.exports = createRegistry;`,
    },
  ],
  testFile: {
    name: "createRegistry_test.js",
    lang: "test",
    code: `const createRegistry = require('./createRegistry');

test('caches', () => {
  let runs = 0; const r = createRegistry({ a: (req, m) => { runs++; m.exports = { n: 1 }; } }); r.require('a'); r.require('a'); expect(runs).toBe(1);
});

test('mock', () => {
  const r = createRegistry({ db: (req, m) => { m.exports = { real: true }; } }); r.mock('db', () => ({ real: false })); expect(r.require('db').real).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>cache</code> (name to module object) and <code>mockCache</code> as <code>let</code> variables, a <code>mocks</code> Map of factories, and put the module object in the cache BEFORE running its factory; that is what makes circular requires return the partial exports." },
    { order: 2, cost: 5, text: "Write <code>loadReal(name)</code> and <code>load(name)</code> (checks mocks first, then calls <code>loadReal</code>); factories get <code>load</code> as their <code>require</code>." },
    { order: 3, cost: 15, text: "<code>isolateModules</code>: save the two caches, assign fresh Maps, run <code>fn</code> inside <code>try</code>, restore in <code>finally</code>. <code>automock</code> can use it with <code>loadReal</code> so it never sees an existing mock." },
  ],
  hiddenTests: [
    { name: "require_runs_factory_once_and_caches", code: `let runs = 0;
const r = createRegistry({ a: (req, m) => { runs++; m.exports = { n: 42 }; } });
const x = r.require('a'); const y = r.require('a');
assert(x === y && x.n === 42 && runs === 1, 'cached: ' + runs);` },
    { name: "modules_can_require_each_other", code: `const r = createRegistry({
  a: (req, m) => { m.exports = { value: req('b').value + 1 }; },
  b: (req, m) => { m.exports = { value: 10 }; },
});
assert(r.require('a').value === 11, 'dependency resolved');` },
    { name: "unknown_module_error", code: `const r = createRegistry({});
let msg = null;
try { r.require('./nope'); } catch (e) { msg = e.message; }
assert(msg === "Cannot find module './nope'", 'message: ' + msg);` },
    { name: "exports_can_be_assigned_or_extended", code: `const r = createRegistry({
  fn: (req, m) => { m.exports = function hello() { return 'hi'; }; },
  obj: (req, m) => { m.exports.a = 1; m.exports.b = 2; },
});
assert(r.require('fn')() === 'hi', 'module.exports replaced');
assert(r.require('obj').a === 1 && r.require('obj').b === 2, 'module.exports extended');` },
    { name: "circular_requires_see_partial_exports", code: `const seen = {};
const r = createRegistry({
  a: (req, m) => { m.exports.early = 'a-early'; const b = req('b'); seen.bSawA = b.sawA; m.exports.late = 'a-late'; },
  b: (req, m) => { const a = req('a'); m.exports.sawA = JSON.stringify(a); },
});
r.require('a');
assert(seen.bSawA === '{"early":"a-early"}', 'b saw only what a had exported so far: ' + seen.bSawA);
assert(r.require('a').late === 'a-late', 'a finished loading');` },
    { name: "failed_factories_are_not_cached", code: `let attempts = 0;
const r = createRegistry({ flaky: (req, m) => { attempts++; if (attempts === 1) throw new Error('first load fails'); m.exports = { ok: true }; } });
let msg = null;
try { r.require('flaky'); } catch (e) { msg = e.message; }
assert(msg === 'first load fails', 'error propagates');
assert(r.require('flaky').ok === true && attempts === 2, 'the next require retries instead of returning a broken module');` },
    { name: "mock_replaces_future_requires", code: `const r = createRegistry({
  db: (req, m) => { m.exports = { find: () => 'real' }; },
  service: (req, m) => { m.exports = { run: () => req('db').find() }; },
});
r.mock('db', () => ({ find: () => 'fake' }));
assert(r.require('service').run() === 'fake', 'the service got the mock');
assert(r.require('db').find() === 'fake', 'direct require too');` },
    { name: "mock_factory_is_lazy_and_runs_once", code: `let calls = 0;
const r = createRegistry({ db: (req, m) => { m.exports = {}; } });
r.mock('db', () => { calls++; return { x: 1 }; });
assert(calls === 0, 'not called by mock()');
const a = r.require('db'); const b = r.require('db');
assert(calls === 1 && a === b, 'once per cache');` },
    { name: "mocking_works_for_modules_that_do_not_exist", code: `const r = createRegistry({ svc: (req, m) => { m.exports = { name: req('external-api').name }; } });
r.mock('external-api', () => ({ name: 'stub' }));
assert(r.require('svc').name === 'stub', 'no real implementation needed');` },
    { name: "mock_after_load_does_not_affect_loaded_modules_until_reset", code: `const r = createRegistry({
  db: (req, m) => { m.exports = { find: () => 'real' }; },
  service: (req, m) => { m.exports = { run: () => req('db').find(), dbAtLoad: req('db') }; },
});
const service = r.require('service');
r.mock('db', () => ({ find: () => 'fake' }));
assert(service.run() === 'fake', 'a require made at CALL time sees the mock');
assert(service.dbAtLoad.find() === 'real', 'but a reference captured at load time stays real');
r.resetModules();
const fresh = r.require('service');
assert(fresh !== service && fresh.dbAtLoad.find() === 'fake', 'after resetModules a re-required service gets the mock');` },
    { name: "unmock_restores_the_real_module", code: `const r = createRegistry({ db: (req, m) => { m.exports = { find: () => 'real' }; } });
r.mock('db', () => ({ find: () => 'fake' }));
assert(r.require('db').find() === 'fake', 'mocked');
r.unmock('db');
assert(r.require('db').find() === 'real', 'real again');` },
    { name: "resetModules_reruns_factories_but_keeps_mocks", code: `let realRuns = 0; let mockRuns = 0;
const r = createRegistry({ a: (req, m) => { realRuns++; m.exports = {}; }, b: (req, m) => { m.exports = {}; } });
r.mock('b', () => { mockRuns++; return { fake: true }; });
const a1 = r.require('a'); r.require('b');
r.resetModules();
const a2 = r.require('a'); const b2 = r.require('b');
assert(a1 !== a2 && realRuns === 2, 'real module re-evaluated');
assert(b2.fake === true && mockRuns === 2, 'the mock is still registered, and its factory runs again');` },
    { name: "isolateModules_uses_temporary_caches", code: `let runs = 0;
const r = createRegistry({ counter: (req, m) => { runs++; m.exports = { id: runs }; } });
const outer = r.require('counter');
const inner = r.isolateModules(() => r.require('counter'));
assert(inner.id === 2 && runs === 2 && inner !== outer, 'isolated load made its own copy');
assert(r.require('counter') === outer && runs === 2, 'the outer cache is back untouched');
const ret = r.isolateModules(() => 'result');
assert(ret === 'result', 'returns the callbacks value');` },
    { name: "isolateModules_restores_caches_even_on_error", code: `let runs = 0;
const r = createRegistry({ a: (req, m) => { runs++; m.exports = {}; } });
const outer = r.require('a');
let threw = false;
try { r.isolateModules(() => { r.require('a'); throw new Error('boom'); }); } catch (e) { threw = true; }
assert(threw, 'error propagates');
assert(r.require('a') === outer, 'outer cache restored');` },
    { name: "isolateModules_still_applies_registered_mocks", code: `const r = createRegistry({ db: (req, m) => { m.exports = { v: 'real' }; } });
r.mock('db', () => ({ v: 'fake' }));
assert(r.isolateModules(() => r.require('db').v) === 'fake', 'mocks are not part of the isolated cache');` },
    { name: "automock_replaces_functions_with_spies", code: `const r = createRegistry({ mailer: (req, m) => { m.exports = { send: (to) => 'real-send', VERSION: 3, nested: { ping: () => 'pong', n: 1 } }; } });
const mock = r.automock('mailer');
assert(typeof mock.send === 'function' && mock.send('a@b.c') === undefined, 'returns undefined by default');
assert(mock.send.calls.length === 1 && mock.send.calls[0][0] === 'a@b.c', 'records calls: ' + JSON.stringify(mock.send.calls));
assert(mock.VERSION === 3 && mock.nested.n === 1, 'non-functions are kept');
assert(mock.nested.ping() === undefined && mock.nested.ping.calls.length === 1, 'nested functions are mocked too');
assert(r.require('mailer') === mock, 'registered as the mock');` },
    { name: "spy_return_values_and_chaining", code: `const r = createRegistry({ api: (req, m) => { m.exports = { get: () => 'real' }; } });
const mock = r.automock('api');
assert(mock.get.mockReturnValue(7) === mock.get, 'chainable');
assert(mock.get() === 7 && mock.get() === 7, 'returns the configured value');` },
    { name: "automock_works_for_function_exports_and_ignores_existing_mocks", code: `const r = createRegistry({ fn: (req, m) => { m.exports = () => 'real'; }, other: (req, m) => { m.exports = { ok: 1 }; } });
r.mock('other', () => ({ ok: 'fake' }));
const f = r.automock('fn');
assert(typeof f === 'function' && f() === undefined && f.calls.length === 1, 'function export becomes a spy');
const o = r.automock('other');
assert(o.ok === 1, 'automock inspects the REAL module, not an existing mock: ' + o.ok);` },
    { name: "automock_does_not_pollute_the_module_cache", code: `let runs = 0;
const r = createRegistry({ a: (req, m) => { runs++; m.exports = { f: () => 1 }; } });
r.automock('a');
r.unmock('a');
assert(r.require('a').f() === 1 && runs === 2, 'the real module loads fresh after unmock: runs=' + runs);` },
  ],
  solution: {
    code: `function createRegistry(definitions) {
  let cache = new Map();
  let mockCache = new Map();
  const mocks = new Map();

  function loadReal(name) {
    if (cache.has(name)) return cache.get(name).exports;
    if (!Object.prototype.hasOwnProperty.call(definitions, name)) {
      throw new Error("Cannot find module '" + name + "'");
    }
    const module = { exports: {} };
    cache.set(name, module);
    try {
      definitions[name](load, module);
    } catch (err) {
      cache.delete(name);
      throw err;
    }
    return module.exports;
  }

  function load(name) {
    if (mocks.has(name)) {
      if (!mockCache.has(name)) mockCache.set(name, mocks.get(name)());
      return mockCache.get(name);
    }
    return loadReal(name);
  }

  function spy() {
    const fn = (...args) => {
      fn.calls.push(args);
      return fn.returnValue;
    };
    fn.calls = [];
    fn.returnValue = undefined;
    fn.mockReturnValue = (value) => {
      fn.returnValue = value;
      return fn;
    };
    return fn;
  }

  function autoMockOf(value) {
    if (typeof value === 'function') return spy();
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, autoMockOf(v)]));
    }
    return value;
  }

  function isolateModules(fn) {
    const savedCache = cache;
    const savedMockCache = mockCache;
    cache = new Map();
    mockCache = new Map();
    try {
      return fn();
    } finally {
      cache = savedCache;
      mockCache = savedMockCache;
    }
  }

  return {
    require: load,
    mock(name, factory) {
      mocks.set(name, factory);
      mockCache.delete(name);
    },
    unmock(name) {
      mocks.delete(name);
      mockCache.delete(name);
    },
    resetModules() {
      cache = new Map();
      mockCache = new Map();
    },
    isolateModules,
    automock(name) {
      const real = isolateModules(() => loadReal(name));
      const mocked = autoMockOf(real);
      mocks.set(name, () => mocked);
      mockCache.delete(name);
      return mocked;
    },
  };
}

module.exports = createRegistry;`,
    explanation:
      "Everything hinges on one cache keyed by module name. Putting the module object in the cache before its factory runs gives CommonJS's circular-dependency behavior, and since a module captures its dependencies when it loads, a mock only helps modules loaded after it, which is why jest hoists jest.mock calls and why resetModules exists.",
  },
};
