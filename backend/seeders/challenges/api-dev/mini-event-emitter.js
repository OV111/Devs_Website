export default {
  slug: "mini-event-emitter",
  trackId: "api-dev",
  layerId: "api-dev-3",
  type: "CODE",
  difficulty: "med",
  title: "Build a mini EventEmitter",
  summary: "Implement on, once, off and emit, including Node's special 'error' event rule.",
  description:
    "Streams, servers and sockets in Node are all EventEmitters. Writing a small one shows how the pattern works.",
  task:
    "Write <code>createEmitter()</code> returning an object with <code>on, once, off, emit, listenerCount</code>.",
  constraints: [
    "Listeners run in registration order with the emitted arguments.",
    "<code>emit</code> returns <code>true</code> if any listener ran, else <code>false</code>.",
    "<code>once</code> listeners run at most one time.",
    "<code>emit('error', err)</code> with no listener throws <code>err</code>.",
    "<code>on</code>, <code>once</code> and <code>off</code> return the emitter so calls can chain.",
  ],
  example: `const e = createEmitter(); e.on('hi', (n) => console.log(n)); e.emit('hi', 1); // logs 1`,
  tags: ["events","node","patterns"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "createEmitter.js",
      lang: "js",
      code: `// createEmitter.js
function createEmitter() {
  // your code here
}

module.exports = createEmitter;`,
    },
  ],
  testFile: {
    name: "createEmitter_test.js",
    lang: "test",
    code: `const createEmitter = require('./createEmitter');

test('emits_args', () => {
  const e = createEmitter(); let got; e.on('a', (x) => { got = x; }); e.emit('a', 7); expect(got).toBe(7);
});

test('once_runs_once', () => {
  const e = createEmitter(); let n = 0; e.once('a', () => n++); e.emit('a'); e.emit('a'); expect(n).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>Map</code> from event name to an array of listeners." },
    { order: 2, cost: 5, text: "For <code>once</code>, register a wrapper that calls <code>off</code> then the real function; store the original on the wrapper so <code>off(evt, original)</code> still works." },
    { order: 3, cost: 15, text: "Iterate over a copy of the array in <code>emit</code>, so removing a listener mid-emit doesn't skip another." },
  ],
  hiddenTests: [
    { name: "args_and_order", code: `const e = createEmitter(); const log = [];
e.on('x', (a, b) => log.push('1:' + a + b)); e.on('x', () => log.push('2'));
e.emit('x', 'p', 'q');
assert(log.join('|') === '1:pq|2', 'order and args: ' + log);` },
    { name: "emit_return_value", code: `const e = createEmitter(); e.on('a', () => {});
assert(e.emit('a') === true, 'true with listener');
assert(e.emit('none') === false, 'false without');` },
    { name: "once_only_once", code: `const e = createEmitter(); let n = 0; e.once('a', () => n++);
e.emit('a'); e.emit('a');
assert(n === 1, 'ran once');
assert(e.listenerCount('a') === 0, 'removed');` },
    { name: "off_removes", code: `const e = createEmitter(); let n = 0; const f = () => n++;
e.on('a', f); e.off('a', f); e.emit('a');
assert(n === 0, 'removed listener must not run');` },
    { name: "off_works_for_once_original", code: `const e = createEmitter(); let n = 0; const f = () => n++;
e.once('a', f); e.off('a', f); e.emit('a');
assert(n === 0, 'off(original) cancels once');` },
    { name: "error_without_listener_throws", code: `const e = createEmitter(); const err = new Error('boom'); let got = null;
try { e.emit('error', err); } catch (x) { got = x; }
assert(got === err, 'unhandled error event throws');
e.on('error', () => {});
assert(e.emit('error', err) === true, 'handled error does not throw');` },
    { name: "removal_during_emit_does_not_skip", code: `const e = createEmitter(); const log = [];
const a = () => { log.push('a'); e.off('x', a); };
e.on('x', a); e.on('x', () => log.push('b'));
e.emit('x');
assert(log.join('') === 'ab', 'second listener must still run: ' + log);` },
    { name: "chaining", code: `const e = createEmitter();
assert(e.on('a', () => {}) === e && e.once('a', () => {}) === e, 'returns emitter');` },
  ],
  solution: {
    code: `function createEmitter() {
  const map = new Map();
  const add = (evt, fn) => {
    if (!map.has(evt)) map.set(evt, []);
    map.get(evt).push(fn);
  };
  const api = {
    on(evt, fn) { add(evt, fn); return api; },
    once(evt, fn) {
      const wrapper = (...args) => { api.off(evt, wrapper); fn(...args); };
      wrapper.orig = fn;
      add(evt, wrapper);
      return api;
    },
    off(evt, fn) {
      const list = map.get(evt);
      if (!list) return api;
      const i = list.findIndex((x) => x === fn || x.orig === fn);
      if (i !== -1) list.splice(i, 1);
      return api;
    },
    emit(evt, ...args) {
      const list = map.get(evt);
      if (!list || list.length === 0) {
        if (evt === 'error') throw args[0];
        return false;
      }
      for (const fn of [...list]) fn(...args);
      return true;
    },
    listenerCount(evt) { return (map.get(evt) || []).length; },
  };
  return api;
}

module.exports = createEmitter;`,
    explanation:
      "A Map of arrays holds listeners. once wraps the listener so it can remove itself; emit loops over a copy so removals during emit are safe.",
  },
};
