export default {
  slug: "once-event",
  trackId: "node-dev",
  layerId: "node-dev-3",
  type: "CODE",
  difficulty: "med",
  title: "Await an event (events.once)",
  summary: "Turn the next emission of an event into a promise, rejecting on 'error' and cleaning up listeners.",
  description:
    "EventEmitters are callback-shaped, but sometimes you just want to <code>await</code> one event: 'wait until the server is listening'. <code>events.once</code> does this; its subtle parts are error handling and removing listeners so nothing leaks.",
  task:
    "Write <code>onceEvent(emitter, name)</code> returning a promise. The <code>emitter</code> has <code>on(event, fn)</code> and <code>off(event, fn)</code>.",
  constraints: [
    "Resolve with the ARRAY of arguments of the first emission of <code>name</code>.",
    "If an <code>'error'</code> event is emitted first, reject with its first argument (unless <code>name</code> is itself <code>'error'</code>, in which case it resolves normally).",
    "After the promise settles, either way, both listeners are removed with <code>off</code>.",
    "Listeners must be registered synchronously, so an emit right after the call is not missed.",
    "Later emissions are ignored; events with other names are ignored.",
  ],
  example: `await onceEvent(server, 'listening'); // resolves with [] when the server starts`,
  tags: ["events","eventemitter","promises","cleanup"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "onceEvent.js",
      lang: "js",
      code: `// onceEvent.js
function onceEvent(emitter, name) {
  // your code here
}

module.exports = onceEvent;`,
    },
  ],
  testFile: {
    name: "onceEvent_test.js",
    lang: "test",
    code: `const onceEvent = require('./onceEvent');

test('resolves_args', () => {
  const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter(); const p = onceEvent(e, 'x'); e.emit('x', 1, 2); return p.then((a) => expect(a).toEqual([1, 2]));
});

test('rejects_on_error', () => {
  const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter(); const p = onceEvent(e, 'x'); e.emit('error', new Error('no')); return p.then(() => expect(true).toBe(false), (err) => expect(err.message).toBe('no'));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Wrap everything in <code>new Promise((resolve, reject) =&gt; ...)</code>, which runs synchronously, so listeners are attached immediately." },
    { order: 2, cost: 5, text: "Define the two handler functions first, plus a <code>cleanup()</code> that calls <code>emitter.off</code> for each; call <code>cleanup()</code> inside both handlers before resolving or rejecting." },
    { order: 3, cost: 15, text: "Only register the 'error' listener when <code>name !== 'error'</code>, otherwise an error event would be both the awaited event and a rejection." },
  ],
  hiddenTests: [
    { name: "resolves_with_argument_array", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'data');
e.emit('data', 'a', { b: 2 });
const args = await p;
assert(Array.isArray(args) && args.length === 2 && args[0] === 'a' && args[1].b === 2, 'args: ' + JSON.stringify(args));` },
    { name: "no_arguments_gives_empty_array", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'ready');
e.emit('ready');
const args = await p;
assert(Array.isArray(args) && args.length === 0, 'empty array');` },
    { name: "listeners_registered_synchronously", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'x');
assert(e.count('x') === 1, 'listener present immediately');
assert(e.count('error') === 1, 'error listener present immediately');
e.emit('x', 1);
assert((await p)[0] === 1, 'emit in the same tick is caught');` },
    { name: "only_first_emission_counts", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'x');
e.emit('x', 'first'); e.emit('x', 'second');
assert((await p)[0] === 'first', 'first one');` },
    { name: "other_events_are_ignored", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'x');
let settled = false; p.then(() => { settled = true; });
e.emit('y', 1); e.emit('z', 2);
await new Promise((r) => setTimeout(r, 5));
assert(settled === false, 'still waiting');
e.emit('x', 3);
assert((await p)[0] === 3, 'then resolves');` },
    { name: "error_event_rejects_with_the_error", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter(); const err = new Error('boom');
const p = onceEvent(e, 'x');
e.emit('error', err);
let got = null;
try { await p; } catch (x) { got = x; }
assert(got === err, 'same error object');` },
    { name: "cleans_up_after_success", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'x');
e.emit('x');
await p;
assert(e.count('x') === 0 && e.count('error') === 0, 'both listeners removed: ' + e.count('x') + '/' + e.count('error'));` },
    { name: "cleans_up_after_error", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p = onceEvent(e, 'x');
e.emit('error', new Error('x'));
try { await p; } catch (x) {}
assert(e.count('x') === 0 && e.count('error') === 0, 'both listeners removed');` },
    { name: "waiting_for_error_itself_resolves", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter(); const err = new Error('e');
const p = onceEvent(e, 'error');
assert(e.count('error') === 1, 'exactly one listener when name is error');
e.emit('error', err);
const args = await p;
assert(args[0] === err, 'resolved with the error as data, not rejected');
assert(e.count('error') === 0, 'cleaned up');` },
    { name: "independent_awaiters", code: `const makeEmitter = () => {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter((x) => x !== f); },
    emit(e, ...a) { (m[e] || []).slice().forEach((f) => f(...a)); },
    count(e) { return (m[e] || []).length; },
  };
};
const e = makeEmitter();
const p1 = onceEvent(e, 'x'); const p2 = onceEvent(e, 'x');
e.emit('x', 'v');
assert((await p1)[0] === 'v' && (await p2)[0] === 'v', 'both resolve');
assert(e.count('x') === 0, 'no leaks');` },
  ],
  solution: {
    code: `function onceEvent(emitter, name) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      emitter.off(name, onEvent);
      if (name !== 'error') emitter.off('error', onError);
    };
    const onEvent = (...args) => {
      cleanup();
      resolve(args);
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    emitter.on(name, onEvent);
    if (name !== 'error') emitter.on('error', onError);
  });
}

module.exports = onceEvent;`,
    explanation:
      "Two listeners race to settle one promise, and whichever fires first removes both, so nothing stays subscribed. The executor runs synchronously, which is why an emit in the same tick is never missed.",
  },
};
