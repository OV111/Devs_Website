export default {
  slug: "use-state-runtime",
  trackId: "mern",
  layerId: "mern-3",
  type: "CODE",
  difficulty: "hard",
  title: "Build a mini hooks runtime (useState + useEffect)",
  summary: "Implement the machinery behind useState and useEffect: hook slots by call order, re-rendering, effect deps and cleanup.",
  description:
    "Hooks look like magic but follow simple rules: React stores each hook's data in a list and finds it again by call order, which is exactly why hooks can't be called conditionally. Build the runtime and the rules explain themselves.",
  task:
    "Write <code>mount(Component, initialProps)</code>. <code>Component(props, hooks)</code> receives <code>hooks = { useState, useEffect }</code> and returns its output. <code>mount</code> renders once immediately and returns <code>{ output, renders, update(newProps), unmount() }</code> (<code>output</code> and <code>renders</code> are getters for the latest values).",
  constraints: [
    "<code>useState(initial)</code> returns <code>[value, setValue]</code>. A function <code>initial</code> is called once (first render only). <code>setValue</code> takes a value or an updater <code>(old) =&gt; new</code>, keeps the same identity across renders, and re-renders synchronously, unless the new value is <code>Object.is</code>-equal to the current one (then nothing happens).",
    "<code>useEffect(effect, deps)</code> is queued during render and RUN AFTER the render finishes (commit). It runs on the first render, then: always if <code>deps</code> is undefined; only if some dep changed (<code>Object.is</code>) otherwise; <code>[]</code> means once.",
    "If an effect returns a function it is its cleanup. When effects re-run in one commit, first call the cleanups of ALL effects that will re-run (in hook order), then run all their new effects (in hook order). <code>unmount()</code> calls every remaining cleanup in hook order and makes setters no-ops.",
    "State updates made while effects are running do not re-render immediately: finish the commit, then re-render once. If re-rendering keeps going for more than 25 passes in a row, throw <code>Error('Too many re-renders')</code>.",
    "Hooks are identified by call order. Calling more hooks than the previous render throws <code>Error('Rendered more hooks than during the previous render')</code>, fewer throws <code>Error('Rendered fewer hooks than expected')</code>, and a different kind of hook in the same slot throws <code>Error('Hooks called in a different order')</code>. <code>update(newProps)</code> re-renders with new props and keeps state.",
  ],
  example: `const app = mount((props, { useState }) => { const [n, setN] = useState(0); return n; }, {}); app.output // 0`,
  tags: ["react","hooks","useState","useEffect"],
  estimatedMins: 70,
  xp: 70,
  starterFiles: [
    {
      name: "mount.js",
      lang: "js",
      code: `// mount.js
function mount(Component, initialProps) {
  // your code here
}

module.exports = mount;`,
    },
  ],
  testFile: {
    name: "mount_test.js",
    lang: "test",
    code: `const mount = require('./mount');

test('initial_output', () => {
  const app = mount((p, { useState }) => { const [n] = useState(5); return 'n=' + n; }, {}); expect(app.output).toBe('n=5');
});

test('setter_rerenders', () => {
  let set; const app = mount((p, { useState }) => { const [n, setN] = useState(0); set = setN; return n; }, {}); set(3); expect(app.output).toBe(3); expect(app.renders).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>slots</code> array and a <code>cursor</code> reset to 0 before each render; each <code>useState</code>/<code>useEffect</code> call takes <code>slots[cursor++]</code>, creating it on the first render only." },
    { order: 2, cost: 5, text: "Split a render into two phases: <strong>render</strong> (call the component, collecting effect requests in a list) and <strong>commit</strong> (run effects). Use a <code>committing</code> flag so a setter called during commit only sets <code>dirty = true</code>; after the commit, loop again while dirty (with a pass counter)." },
    { order: 3, cost: 15, text: "For effects: compute which requests have changed deps, call ALL their cleanups, then run ALL their effects, storing each returned cleanup and the deps on its slot." },
  ],
  hiddenTests: [
    { name: "first_render_output_and_count", code: `let calls = 0;
const app = mount((p, { useState }) => { calls++; const [n] = useState(p.start); return 'v' + n; }, { start: 7 });
assert(app.output === 'v7' && app.renders === 1 && calls === 1, 'rendered once on mount');` },
    { name: "setter_updates_state_and_rerenders", code: `let set;
const app = mount((p, { useState }) => { const [n, setN] = useState(0); set = setN; return n; }, {});
set(5);
assert(app.output === 5 && app.renders === 2, 'output ' + app.output + ' renders ' + app.renders);` },
    { name: "same_value_does_not_rerender", code: `let set;
const app = mount((p, { useState }) => { const [n, setN] = useState(1); set = setN; return n; }, {});
set(1); set(() => 1);
assert(app.renders === 1, 'Object.is equal values are ignored: ' + app.renders);
let setNaN; const b = mount((p, { useState }) => { const [n, s] = useState(NaN); setNaN = s; return 'x'; }, {});
setNaN(NaN);
assert(b.renders === 1, 'NaN equals NaN');` },
    { name: "updater_functions", code: `let set;
const app = mount((p, { useState }) => { const [n, setN] = useState(0); set = setN; return n; }, {});
set((c) => c + 1); set((c) => c + 1); set((c) => c * 10);
assert(app.output === 20, 'each updater sees the latest value: ' + app.output);
assert(app.renders === 4, 'one render per effective update (no batching outside effects): ' + app.renders);` },
    { name: "lazy_initial_state_runs_once", code: `let inits = 0; let set;
const app = mount((p, { useState }) => { const [n, setN] = useState(() => { inits++; return 42; }); set = setN; return n; }, {});
set(1); set(2);
assert(inits === 1 && app.output === 2, 'initializer ran ' + inits + ' times');` },
    { name: "setter_identity_is_stable", code: `const setters = [];
const app = mount((p, { useState }) => { const [n, setN] = useState(0); setters.push(setN); return n; }, {});
setters[0](1); setters[0](2);
assert(setters.length === 3 && setters[0] === setters[1] && setters[1] === setters[2], 'same function every render');` },
    { name: "multiple_states_are_independent", code: `let setA; let setB;
const app = mount((p, { useState }) => { const [a, sa] = useState('a'); const [b, sb] = useState('b'); setA = sa; setB = sb; return a + b; }, {});
setA('A'); assert(app.output === 'Ab', 'first');
setB('B'); assert(app.output === 'AB', 'second');` },
    { name: "props_update_keeps_state", code: `let set;
const app = mount((p, { useState }) => { const [n, setN] = useState(0); set = setN; return p.label + n; }, { label: 'x' });
set(5);
app.update({ label: 'y' });
assert(app.output === 'y5' && app.renders === 3, 'new props, same state: ' + app.output);` },
    { name: "effect_runs_after_render_on_mount_and_every_render_without_deps", code: `const log = []; let set;
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  log.push('render ' + n);
  useEffect(() => { log.push('effect ' + n); });
  return n;
}, {});
set(1);
assert(log.join(',') === 'render 0,effect 0,render 1,effect 1', 'order: ' + log);` },
    { name: "empty_deps_run_once_and_cleanup_on_unmount", code: `const log = []; let set;
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  useEffect(() => { log.push('mount'); return () => log.push('cleanup'); }, []);
  return n;
}, {});
set(1); set(2);
assert(log.join(',') === 'mount', 'ran once: ' + log);
app.unmount();
assert(log.join(',') === 'mount,cleanup', 'cleanup on unmount: ' + log);` },
    { name: "effect_reruns_only_when_deps_change", code: `const log = []; let setA; let setB;
const app = mount((p, { useState, useEffect }) => {
  const [a, sa] = useState(0); const [b, sb] = useState(0); setA = sa; setB = sb;
  useEffect(() => { log.push('a=' + a); return () => log.push('clean a=' + a); }, [a]);
  return a + b;
}, {});
setB(1);
assert(log.join(',') === 'a=0', 'b changed, effect did not re-run: ' + log);
setA(1);
assert(log.join(',') === 'a=0,clean a=0,a=1', 'cleanup of the OLD run happens first: ' + log);` },
    { name: "all_cleanups_run_before_all_effects", code: `const log = []; let set;
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  useEffect(() => { log.push('run A' + n); return () => log.push('clean A' + n); }, [n]);
  useEffect(() => { log.push('run B' + n); return () => log.push('clean B' + n); }, [n]);
  return n;
}, {});
log.length = 0;
set(1);
assert(log.join(',') === 'clean A0,clean B0,run A1,run B1', 'order: ' + log);` },
    { name: "unmount_runs_cleanups_in_order_and_disables_setters", code: `const log = []; let set;
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  useEffect(() => () => log.push('first'), []);
  useEffect(() => () => log.push('second'), []);
  return n;
}, {});
app.unmount();
assert(log.join(',') === 'first,second', 'hook order: ' + log);
const rendersAfter = app.renders;
set(9);
assert(app.renders === rendersAfter, 'setter does nothing after unmount');
app.unmount();
assert(log.length === 2, 'unmount twice is harmless');` },
    { name: "effects_see_the_values_of_their_own_render", code: `const seen = []; let set;
mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  useEffect(() => { seen.push(n); }, [n]);
  return n;
}, {});
set(1); set(2);
assert(seen.join(',') === '0,1,2', 'each effect closes over its own render: ' + seen);` },
    { name: "non_function_effect_results_are_ignored", code: `let set;
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  useEffect(() => 42, [n]);
  return n;
}, {});
set(1);
app.unmount();
assert(app.output === 1, 'no crash trying to call 42 as a cleanup');` },
    { name: "state_set_in_effect_rerenders_after_the_commit", code: `const log = [];
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0);
  log.push('render ' + n);
  useEffect(() => { log.push('effect1'); if (n === 0) setN(1); }, [n]);
  useEffect(() => { log.push('effect2'); }, [n]);
  return n;
}, {});
assert(log.join(',') === 'render 0,effect1,effect2,render 1,effect1,effect2', 'both effects finish before the re-render: ' + log);
assert(app.output === 1 && app.renders === 2, 'one extra render');` },
    { name: "batched_updates_inside_effects_cause_one_render", code: `const app = mount((p, { useState, useEffect }) => {
  const [a, setA] = useState(0); const [b, setB] = useState(0);
  useEffect(() => { setA(1); setB(2); }, []);
  return a + ',' + b;
}, {});
assert(app.output === '1,2' && app.renders === 2, 'two updates, one re-render: ' + app.renders);` },
    { name: "infinite_update_loops_throw", code: `let err = null;
try {
  mount((p, { useState, useEffect }) => {
    const [n, setN] = useState(0);
    useEffect(() => { setN(n + 1); });
    return n;
  }, {});
} catch (e) { err = e; }
assert(err && err.message === 'Too many re-renders', 'message: ' + (err && err.message));` },
    { name: "more_hooks_than_before_throws", code: `let show = false; let set;
const app = mount((p, { useState }) => {
  const [n, setN] = useState(0); set = setN;
  if (show) useState('extra');
  return n;
}, {});
show = true;
let err = null;
try { set(1); } catch (e) { err = e; }
assert(err && err.message === 'Rendered more hooks than during the previous render', 'message: ' + (err && err.message));` },
    { name: "fewer_hooks_than_before_throws", code: `let skip = false; let set;
const app = mount((p, { useState }) => {
  const [n, setN] = useState(0); set = setN;
  if (!skip) useState('second');
  return n;
}, {});
skip = true;
let err = null;
try { set(1); } catch (e) { err = e; }
assert(err && err.message === 'Rendered fewer hooks than expected', 'message: ' + (err && err.message));` },
    { name: "different_hook_kind_in_a_slot_throws", code: `let flip = false; let set;
const app = mount((p, { useState, useEffect }) => {
  const [n, setN] = useState(0); set = setN;
  if (flip) useEffect(() => {}, []); else useState('x');
  return n;
}, {});
flip = true;
let err = null;
try { set(1); } catch (e) { err = e; }
assert(err && err.message === 'Hooks called in a different order', 'message: ' + (err && err.message));` },
  ],
  solution: {
    code: `function mount(Component, initialProps) {
  let props = initialProps;
  const slots = [];
  let cursor = 0;
  let output;
  let renders = 0;
  let mounted = true;
  let firstRender = true;
  let committing = false;
  let dirty = false;
  let queued = [];

  function sameDeps(a, b) {
    return a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  }

  function commit() {
    committing = true;
    try {
      const changed = queued.filter(({ slot, deps }) => deps === undefined || slot.deps === undefined || !sameDeps(deps, slot.deps));
      for (const { slot } of changed) {
        if (typeof slot.cleanup === 'function') slot.cleanup();
        slot.cleanup = undefined;
      }
      for (const { slot, effect, deps } of changed) {
        slot.deps = deps;
        slot.cleanup = effect();
      }
    } finally {
      committing = false;
    }
  }

  function rerender() {
    if (!mounted) return;
    if (committing) {
      dirty = true;
      return;
    }
    let passes = 0;
    do {
      if (++passes > 25) throw new Error('Too many re-renders');
      dirty = false;
      cursor = 0;
      queued = [];
      output = Component(props, hooks);
      if (!firstRender && cursor !== slots.length) throw new Error('Rendered fewer hooks than expected');
      firstRender = false;
      renders++;
      commit();
    } while (dirty);
  }

  function takeSlot(kind, create) {
    const i = cursor++;
    if (i >= slots.length) {
      if (!firstRender) throw new Error('Rendered more hooks than during the previous render');
      const created = create();
      created.kind = kind;
      slots.push(created);
    }
    const slot = slots[i];
    if (slot.kind !== kind) throw new Error('Hooks called in a different order');
    return slot;
  }

  const hooks = {
    useState(initial) {
      const slot = takeSlot('state', () => {
        const s = { value: typeof initial === 'function' ? initial() : initial };
        s.set = (next) => {
          if (!mounted) return;
          const value = typeof next === 'function' ? next(s.value) : next;
          if (Object.is(value, s.value)) return;
          s.value = value;
          rerender();
        };
        return s;
      });
      return [slot.value, slot.set];
    },
    useEffect(effect, deps) {
      const slot = takeSlot('effect', () => ({}));
      queued.push({ slot, effect, deps });
    },
  };

  rerender();

  return {
    get output() {
      return output;
    },
    get renders() {
      return renders;
    },
    update(nextProps) {
      props = nextProps;
      rerender();
    },
    unmount() {
      if (!mounted) return;
      mounted = false;
      for (const slot of slots) {
        if (slot.kind === 'effect' && typeof slot.cleanup === 'function') slot.cleanup();
      }
    },
  };
}

module.exports = mount;`,
    explanation:
      "A hook is just 'the next slot in an array', which is why call order must never change. Rendering and committing are separate phases: effects only run after the render, in two passes (all cleanups, then all effects), and state set during a commit is deferred and applied in one extra render.",
  },
};
