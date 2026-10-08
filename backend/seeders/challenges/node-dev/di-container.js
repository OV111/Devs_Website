export default {
  slug: "di-container",
  trackId: "node-dev",
  layerId: "node-dev-4",
  type: "CODE",
  difficulty: "med",
  title: "Dependency injection container",
  summary: "Register factories, resolve them lazily with their dependencies, support singletons, and detect cycles.",
  description:
    "Fastify's decorators and plugins are a form of dependency injection: services receive what they need instead of importing it. A small container shows the mechanics (lazy creation, singleton vs transient, and the circular dependency trap) and makes services trivially testable.",
  task:
    "Write <code>createContainer()</code> returning <code>{ register, has, resolve }</code>.",
  constraints: [
    "<code>register(name, factory, { singleton = true })</code> stores the factory and returns the container (chainable). Registering a name twice throws <code>Error('Already registered: name')</code>.",
    "<code>resolve(name)</code> calls <code>factory(container)</code> so a factory can resolve its own dependencies. Nothing is created until it's resolved (lazy).",
    "Singletons are created once and cached; <code>singleton: false</code> creates a new value on every resolve.",
    "Unknown names throw <code>Error('Unknown dependency: name')</code>.",
    "A circular dependency throws <code>Error('Circular dependency: a -&gt; b -&gt; a')</code> (the cycle only, starting from where it repeats). A failed resolve must not break later resolves, and a factory that throws is not cached.",
  ],
  example: `c.register('db', () => connect()).register('users', (c) => new UserRepo(c.resolve('db'))); c.resolve('users');`,
  tags: ["dependency-injection","architecture","fastify","testing"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createContainer.js",
      lang: "js",
      code: `// createContainer.js
function createContainer() {
  // your code here
}

module.exports = createContainer;`,
    },
  ],
  testFile: {
    name: "createContainer_test.js",
    lang: "test",
    code: `const createContainer = require('./createContainer');

test('lazy_singleton', () => {
  const c = createContainer(); let n = 0; c.register('a', () => ({ id: ++n })); expect(n).toBe(0); c.resolve('a'); c.resolve('a'); expect(n).toBe(1);
});

test('unknown', () => {
  expect(() => createContainer().resolve('x')).toThrow();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>defs</code> Map (name to factory and singleton flag), a <code>cache</code> Map, and a <code>stack</code> array of names currently being resolved." },
    { order: 2, cost: 5, text: "On <code>resolve</code>: return the cache hit if there is one; if the name is already in <code>stack</code>, build the cycle message from <code>stack.slice(stack.indexOf(name))</code> plus the name; otherwise push, call the factory inside <code>try</code>, and <code>pop</code> in <code>finally</code>." },
    { order: 3, cost: 15, text: "Only write to the cache after the factory returned successfully." },
  ],
  hiddenTests: [
    { name: "resolves_values", code: `const c = createContainer();
c.register('config', () => ({ url: 'db://x' }));
assert(c.resolve('config').url === 'db://x', 'value');
assert(c.has('config') === true && c.has('nope') === false, 'has');` },
    { name: "register_is_chainable_and_duplicates_throw", code: `const c = createContainer();
assert(c.register('a', () => 1) === c, 'chainable');
let err = null;
try { c.register('a', () => 2); } catch (e) { err = e; }
assert(err && err.message === 'Already registered: a', 'message: ' + (err && err.message));` },
    { name: "factories_are_lazy", code: `const c = createContainer(); let created = 0;
c.register('a', () => { created++; return 1; });
c.register('b', () => { created++; return 2; });
assert(created === 0, 'nothing created at registration');
c.resolve('a');
assert(created === 1, 'only a');` },
    { name: "singleton_by_default_transient_on_request", code: `const c = createContainer();
c.register('single', () => ({}));
c.register('fresh', () => ({}), { singleton: false });
assert(c.resolve('single') === c.resolve('single'), 'same instance');
assert(c.resolve('fresh') !== c.resolve('fresh'), 'new instance each time');` },
    { name: "dependencies_are_resolved_through_the_container", code: `const c = createContainer(); let dbCreated = 0;
c.register('db', () => { dbCreated++; return { name: 'db' }; });
c.register('repo', (k) => ({ db: k.resolve('db') }));
c.register('service', (k) => ({ repo: k.resolve('repo'), db: k.resolve('db') }));
const s = c.resolve('service');
assert(s.repo.db === s.db && s.db.name === 'db', 'shared singleton dependency');
assert(dbCreated === 1, 'db created once, not ' + dbCreated);` },
    { name: "unknown_dependency_throws_with_name", code: `const c = createContainer(); let err = null;
try { c.resolve('ghost'); } catch (e) { err = e; }
assert(err && err.message === 'Unknown dependency: ghost', 'message: ' + (err && err.message));
c.register('a', (k) => k.resolve('missing'));
let err2 = null;
try { c.resolve('a'); } catch (e) { err2 = e; }
assert(err2 && err2.message === 'Unknown dependency: missing', 'nested unknown');` },
    { name: "circular_dependencies_are_detected", code: `const c = createContainer();
c.register('a', (k) => k.resolve('b')); c.register('b', (k) => k.resolve('a'));
let err = null;
try { c.resolve('a'); } catch (e) { err = e; }
assert(err && err.message === 'Circular dependency: a -> b -> a', 'message: ' + (err && err.message));
const d = createContainer(); d.register('self', (k) => k.resolve('self'));
let err2 = null;
try { d.resolve('self'); } catch (e) { err2 = e; }
assert(err2 && err2.message === 'Circular dependency: self -> self', 'self cycle: ' + (err2 && err2.message));` },
    { name: "cycle_message_shows_only_the_cycle", code: `const c = createContainer();
c.register('entry', (k) => k.resolve('a')); c.register('a', (k) => k.resolve('b')); c.register('b', (k) => k.resolve('c')); c.register('c', (k) => k.resolve('a'));
let err = null;
try { c.resolve('entry'); } catch (e) { err = e; }
assert(err && err.message === 'Circular dependency: a -> b -> c -> a', 'message: ' + (err && err.message));` },
    { name: "container_recovers_after_errors", code: `const c = createContainer(); let attempts = 0;
c.register('flaky', () => { attempts++; if (attempts === 1) throw new Error('first try fails'); return 'ok'; });
let threw = false;
try { c.resolve('flaky'); } catch (e) { threw = true; }
assert(threw, 'first resolve throws');
assert(c.resolve('flaky') === 'ok', 'second resolve works: the failure was not cached and the stack was cleaned');
c.register('a', (k) => k.resolve('b')); c.register('b', (k) => k.resolve('a'));
try { c.resolve('a'); } catch (e) {}
let again = null;
try { c.resolve('a'); } catch (e) { again = e; }
assert(again && again.message === 'Circular dependency: a -> b -> a', 'cycle detected again, so the stack was cleaned up: ' + (again && again.message));` },
    { name: "swapping_in_a_test_double", code: `const real = createContainer(); real.register('mailer', () => ({ send: () => 'sent' })); real.register('signup', (k) => ({ run: () => k.resolve('mailer').send() }));
const fake = createContainer(); const calls = []; fake.register('mailer', () => ({ send: () => { calls.push(1); return 'fake'; } })); fake.register('signup', (k) => ({ run: () => k.resolve('mailer').send() }));
assert(real.resolve('signup').run() === 'sent', 'real');
assert(fake.resolve('signup').run() === 'fake' && calls.length === 1, 'the service works unchanged with a fake dependency');` },
  ],
  solution: {
    code: `function createContainer() {
  const defs = new Map();
  const cache = new Map();
  const stack = [];
  const container = {
    register(name, factory, { singleton = true } = {}) {
      if (defs.has(name)) throw new Error('Already registered: ' + name);
      defs.set(name, { factory, singleton });
      return container;
    },
    has(name) {
      return defs.has(name);
    },
    resolve(name) {
      if (!defs.has(name)) throw new Error('Unknown dependency: ' + name);
      if (cache.has(name)) return cache.get(name);
      if (stack.includes(name)) {
        throw new Error('Circular dependency: ' + [...stack.slice(stack.indexOf(name)), name].join(' -> '));
      }
      stack.push(name);
      try {
        const { factory, singleton } = defs.get(name);
        const value = factory(container);
        if (singleton) cache.set(name, value);
        return value;
      } finally {
        stack.pop();
      }
    },
  };
  return container;
}

module.exports = createContainer;`,
    explanation:
      "The stack records what is currently being built; meeting a name already on it means a cycle. Pop in finally keeps the stack clean after errors, and caching only after success means a failed factory can be retried.",
  },
};
