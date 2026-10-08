export default {
  slug: "fixture-factory",
  trackId: "node-dev",
  layerId: "node-dev-8",
  type: "CODE",
  difficulty: "med",
  title: "Test data factories with sequences and traits",
  summary: "Build test objects from defaults with unique sequence numbers, dependent attributes, traits and overrides.",
  description:
    "Hand-written test objects are noisy and brittle. Factories (like FactoryBot or fishery) give each test a valid object with unique values by default, so a test only states the fields it cares about: <code>userFactory.build({ role: 'admin' })</code>.",
  task:
    "Write <code>defineFactory({ defaults, traits })</code> returning <code>{ build, buildList, reset, extend }</code>.",
  constraints: [
    "<code>build(overrides?, ...traitNames)</code> creates a fresh object each time; if the first argument is a string, all arguments are trait names and there are no overrides. <code>buildList(count, ...sameArgs)</code> returns an array of <code>count</code> builds.",
    "Every <code>build</code> increments the factory's sequence (1, 2, 3...). A default (or trait) value that is a FUNCTION is called with <code>ctx = { n, attrs }</code>: <code>n</code> is the sequence number and <code>attrs</code> holds the attributes computed so far (including overrides), so values can depend on earlier keys. Other values are used as-is, deep-cloned (arrays, plain objects, Dates) so builds never share state.",
    "Precedence: defaults, then traits in the order given (later traits win), then overrides. Overrides are literal values (a function override is kept as a function, not called), and are also deep-cloned. Key order: default keys first, then new keys from traits, then new keys from overrides.",
    "An unknown trait throws <code>Error('Unknown trait: name')</code> and does not consume a sequence number. <code>reset()</code> restarts the sequence at 1.",
    "<code>extend({ defaults, traits })</code> returns a NEW factory (own sequence starting at 1) whose defaults and traits are the parent's merged with the given ones (new values win).",
  ],
  example: `const user = defineFactory({ defaults: { id: (c) => c.n, email: (c) => 'user' + c.n + '@test.io' }, traits: { admin: { role: 'admin' } } }); user.build('admin');`,
  tags: ["testing","fixtures","factories","test-data"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "defineFactory.js",
      lang: "js",
      code: `// defineFactory.js
function defineFactory(options) {
  // your code here
}

module.exports = defineFactory;`,
    },
  ],
  testFile: {
    name: "defineFactory_test.js",
    lang: "test",
    code: `const defineFactory = require('./defineFactory');

test('sequence', () => {
  const f = defineFactory({ defaults: { id: (c) => c.n } }); expect(f.build().id).toBe(1); expect(f.build().id).toBe(2);
});

test('override', () => {
  const f = defineFactory({ defaults: { name: 'x' } }); expect(f.build({ name: 'y' }).name).toBe('y');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>sequence</code> counter in the closure and compute the list of keys in order (defaults, traits, overrides) without duplicates." },
    { order: 2, cost: 5, text: "For each key: if it is in <code>overrides</code> use that (cloned), otherwise take the value from the LAST layer (defaults or trait) that defines it and call it if it's a function, passing <code>ctx</code>." },
    { order: 3, cost: 15, text: "Because <code>ctx.attrs</code> is the same object you are filling in, later functions can read earlier results; that's how <code>slug</code> can be derived from <code>name</code>." },
  ],
  hiddenTests: [
    { name: "builds_plain_defaults_without_sharing_state", code: `const f = defineFactory({ defaults: { name: 'Ann', tags: ['a'], address: { city: 'X' }, born: new Date(0) } });
const a = f.build(); const b = f.build();
assert(a.name === 'Ann' && a.tags[0] === 'a' && a.address.city === 'X', 'values');
assert(a !== b && a.tags !== b.tags && a.address !== b.address, 'fresh nested objects each build');
a.tags.push('z'); a.address.city = 'Y';
assert(b.tags.length === 1 && b.address.city === 'X' && f.build().tags.length === 1, 'mutating one build does not leak');
assert(a.born instanceof Date && a.born !== b.born && a.born.getTime() === 0, 'dates are copied, not shared');` },
    { name: "sequence_and_functions", code: `const f = defineFactory({ defaults: { id: (c) => c.n, email: (c) => 'user' + c.n + '@test.io' } });
const a = f.build(); const b = f.build(); const c = f.build();
assert(a.id === 1 && b.id === 2 && c.id === 3, 'ids');
assert(a.email === 'user1@test.io' && c.email === 'user3@test.io', 'emails are unique per build');` },
    { name: "attributes_can_depend_on_earlier_ones", code: `const f = defineFactory({ defaults: { name: (c) => 'User ' + c.n, slug: (c) => c.attrs.name.toLowerCase().replace(/ /g, '-') } });
assert(f.build().slug === 'user-1', 'derived from name');
assert(f.build({ name: 'Big Boss' }).slug === 'big-boss', 'derived from an OVERRIDDEN name: ' + f.build({ name: 'Big Boss' }).slug);` },
    { name: "overrides_beat_defaults", code: `const f = defineFactory({ defaults: { name: 'x', role: 'user', id: (c) => c.n } });
const u = f.build({ role: 'admin', id: 99, extra: 'e' });
assert(u.role === 'admin' && u.id === 99 && u.name === 'x', 'override values');
assert(u.extra === 'e', 'new keys are allowed');
assert(f.build().id === 2, 'an overridden function default still consumed a sequence number');` },
    { name: "overrides_are_literal_not_called", code: `const f = defineFactory({ defaults: { onClick: () => 'default' } });
const handler = () => 'mine';
const u = f.build({ onClick: handler });
assert(u.onClick === handler, 'a function override is a value, not a lazy attribute');` },
    { name: "falsy_overrides_are_respected", code: `const f = defineFactory({ defaults: { count: 5, label: 'x', flag: true, parent: { id: 1 } } });
const u = f.build({ count: 0, label: '', flag: false, parent: null });
assert(u.count === 0 && u.label === '' && u.flag === false && u.parent === null, JSON.stringify(u));
assert(f.build({ count: undefined }).count === undefined, 'explicit undefined overrides too');` },
    { name: "traits", code: `const f = defineFactory({
  defaults: { role: 'user', verified: false, name: (c) => 'U' + c.n },
  traits: { admin: { role: 'admin' }, verified: { verified: true }, shouty: { name: (c) => 'USER ' + c.n } },
});
const u = f.build('admin', 'verified');
assert(u.role === 'admin' && u.verified === true && u.name === 'U1', JSON.stringify(u));
assert(f.build('shouty').name === 'USER 2', 'trait functions get the context too');
assert(f.build().role === 'user', 'no traits means defaults');` },
    { name: "trait_precedence_and_overrides", code: `const f = defineFactory({ defaults: { role: 'user' }, traits: { admin: { role: 'admin' }, mod: { role: 'mod' } } });
assert(f.build('admin', 'mod').role === 'mod' && f.build('mod', 'admin').role === 'admin', 'later trait wins');
assert(f.build({ role: 'guest' }, 'admin').role === 'guest', 'overrides beat traits');` },
    { name: "build_with_overrides_and_traits_together", code: `const f = defineFactory({ defaults: { a: 1 }, traits: { t: { b: 2 } } });
const u = f.build({ c: 3 }, 't');
assert(JSON.stringify(u) === '{"a":1,"b":2,"c":3}', 'key order: defaults, trait keys, override keys: ' + JSON.stringify(u));
assert(JSON.stringify(f.build('t')) === '{"a":1,"b":2}', 'string-first form');` },
    { name: "unknown_trait_throws_without_consuming_a_number", code: `const f = defineFactory({ defaults: { id: (c) => c.n }, traits: { ok: {} } });
let msg = null;
try { f.build('nope'); } catch (e) { msg = e.message; }
assert(msg === 'Unknown trait: nope', 'message: ' + msg);
assert(f.build('ok').id === 1, 'the failed build did not use up a sequence number');` },
    { name: "build_list", code: `const f = defineFactory({ defaults: { id: (c) => c.n, role: 'user' }, traits: { admin: { role: 'admin' } } });
const list = f.buildList(3);
assert(list.length === 3 && list.map((x) => x.id).join() === '1,2,3', 'sequence advances per item');
const admins = f.buildList(2, { name: 'A' }, 'admin');
assert(admins.every((x) => x.role === 'admin' && x.name === 'A'), 'overrides and traits apply to every item');
assert(admins[0] !== admins[1], 'distinct objects');
assert(f.buildList(0).length === 0, 'empty list');` },
    { name: "reset_restarts_the_sequence", code: `const f = defineFactory({ defaults: { id: (c) => c.n } });
f.build(); f.build();
f.reset();
assert(f.build().id === 1, 'back to 1');` },
    { name: "extend_creates_an_independent_child_factory", code: `const base = defineFactory({ defaults: { id: (c) => c.n, role: 'user', plan: 'free' }, traits: { admin: { role: 'admin' } } });
base.build(); base.build();
const child = base.extend({ defaults: { plan: 'pro', company: 'ACME' }, traits: { owner: { role: 'owner' } } });
const u = child.build('owner');
assert(u.id === 1, 'own sequence starting at 1: ' + u.id);
assert(u.role === 'owner' && u.plan === 'pro' && u.company === 'ACME', 'parent defaults merged with child values: ' + JSON.stringify(u));
assert(child.build('admin').role === 'admin', 'parent traits are inherited');
assert(base.build().id === 3 && !('company' in base.build()), 'the parent is unchanged');
let msg = null;
try { base.build('owner'); } catch (e) { msg = e.message; }
assert(msg === 'Unknown trait: owner', 'child traits do not leak to the parent');` },
    { name: "no_arguments", code: `const f = defineFactory();
assert(JSON.stringify(f.build()) === '{}' && JSON.stringify(f.build({ a: 1 })) === '{"a":1}', 'empty factory works');` },
  ],
  solution: {
    code: `function defineFactory({ defaults = {}, traits = {} } = {}) {
  let sequence = 0;

  const cloneDeep = (value) => {
    if (Array.isArray(value)) return value.map(cloneDeep);
    if (value instanceof Date) return new Date(value.getTime());
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, cloneDeep(v)]));
    }
    return value;
  };

  function build(...args) {
    let overrides = {};
    if (args.length > 0 && typeof args[0] !== 'string') overrides = args.shift() || {};
    const layers = args.map((name) => {
      if (!Object.prototype.hasOwnProperty.call(traits, name)) throw new Error('Unknown trait: ' + name);
      return traits[name];
    });

    const n = ++sequence;
    const attrs = {};
    const ctx = { n, attrs };
    const sources = [defaults, ...layers];

    const keys = [];
    for (const source of [...sources, overrides]) {
      for (const key of Object.keys(source)) {
        if (!keys.includes(key)) keys.push(key);
      }
    }

    for (const key of keys) {
      if (key in overrides) {
        attrs[key] = cloneDeep(overrides[key]);
        continue;
      }
      let value;
      for (const source of sources) {
        if (key in source) value = source[key];
      }
      attrs[key] = typeof value === 'function' ? value(ctx) : cloneDeep(value);
    }
    return attrs;
  }

  return {
    build,
    buildList: (count, ...args) => Array.from({ length: count }, () => build(...args.map((a) => (typeof a === 'object' && a !== null ? { ...a } : a)))),
    reset() {
      sequence = 0;
    },
    extend(extra = {}) {
      return defineFactory({
        defaults: { ...defaults, ...(extra.defaults || {}) },
        traits: { ...traits, ...(extra.traits || {}) },
      });
    },
  };
}

module.exports = defineFactory;`,
    explanation:
      "Each build computes the final key list once, then resolves keys in order, which lets a later default read an earlier attribute from ctx.attrs. Because overrides are written into attrs first, a derived field like slug automatically follows an overridden name.",
  },
};
