export default {
  slug: "create-tween",
  trackId: "web-game",
  layerId: "web-game-1",
  type: "CODE",
  difficulty: "easy",
  title: "Tween with easing and delay",
  summary: "Animate a number from A to B over time with a delay and named easing curves, driven by per-frame delta time.",
  description:
    "Menus that slide in, health bars that drain smoothly, screen shakes that fade out: all of them are tweens. A tween turns elapsed time into a progress value from 0 to 1, bends it through an easing curve, and linearly interpolates between two numbers.",
  task:
    "Write <code>createTween(options)</code> where <code>options</code> is <code>{ from, to, duration, delay = 0, easing = 'linear' }</code> (times in ms). Return <code>{ update, isDone, progress, reset }</code>.",
  constraints: [
    "<code>update(dt)</code> advances the tween by <code>dt</code> ms (negative <code>dt</code> is treated as 0) and returns the current value. Time spent inside <code>delay</code> keeps the value at <code>from</code>.",
    "Once the elapsed time reaches <code>delay + duration</code> the value is exactly <code>to</code> and <code>isDone()</code> is true; further updates keep returning <code>to</code>. With <code>duration: 0</code> the first <code>update</code> finishes it (even <code>update(0)</code>).",
    "<code>progress()</code> returns the raw 0..1 time progress (before easing) of the active part, 0 during the delay, 1 when done.",
    "Easing names: <code>linear</code> <code>t</code>, <code>easeInQuad</code> <code>t*t</code>, <code>easeOutQuad</code> <code>t*(2-t)</code>, <code>easeInOutCubic</code> <code>t &lt; 0.5 ? 4t^3 : 1 - (-2t+2)^3 / 2</code>. <code>easing</code> may also be a function <code>t =&gt; t'</code>. An unknown name throws a <code>RangeError</code> when the tween is created.",
    "Value = <code>from + (to - from) * eased(t)</code>; it works when <code>to &lt; from</code>. <code>reset()</code> rewinds to the start.",
  ],
  example: `const t = createTween({ from: 0, to: 100, duration: 1000, easing: 'easeOutQuad' }); t.update(500) // 75`,
  tags: ["animation", "tween", "easing", "interpolation"],
  estimatedMins: 20,
  xp: 30,
  starterFiles: [
    {
      name: "createTween.js",
      lang: "js",
      code: `// createTween.js
function createTween(options) {
  // your code here
}

module.exports = createTween;`,
    },
  ],
  testFile: {
    name: "createTween_test.js",
    lang: "test",
    code: `const createTween = require('./createTween');

test('linear midpoint', () => {
  const t = createTween({ from: 0, to: 100, duration: 1000 });
  expect(t.update(500)).toBe(50);
});

test('finishes exactly on the target', () => {
  const t = createTween({ from: 0, to: 10, duration: 100 });
  expect(t.update(5000)).toBe(10);
  expect(t.isDone()).toBe(true);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep one number: <code>elapsed</code>. Everything else is derived from it: <code>t = clamp((elapsed - delay) / duration, 0, 1)</code>." },
    { order: 2, cost: 5, text: "Handle <code>duration === 0</code> separately to avoid dividing by zero: after the first <code>update</code> call it is done." },
    { order: 3, cost: 15, text: "Return <code>to</code> literally when done rather than computing <code>from + (to-from)*1</code>, which can drift by floating-point error." },
  ],
  hiddenTests: [
    { name: "linear_interpolation", code: `const t = createTween({ from: 0, to: 100, duration: 1000 });
assert(t.update(250) === 25, 'quarter');
assert(t.update(250) === 50, 'half, dt accumulates');
assert(t.progress() === 0.5, 'progress ' + t.progress());` },
    { name: "finishes_exactly_and_stays", code: `const t = createTween({ from: 5, to: 10, duration: 100 });
assert(t.isDone() === false, 'not done yet');
assert(t.update(40) < 10 && t.isDone() === false, 'running');
assert(t.update(1000) === 10 && t.isDone() === true, 'done at target');
assert(t.update(10) === 10, 'stays at target');
assert(t.progress() === 1, 'progress 1');` },
    { name: "delay_holds_the_start_value", code: `const t = createTween({ from: 10, to: 20, duration: 100, delay: 50 });
assert(t.update(30) === 10 && t.progress() === 0, 'still waiting');
assert(t.update(20) === 10, 'delay just ended');
assert(t.update(50) === 15, 'halfway through the active part: ' + t.update(0));` },
    { name: "counts_down_when_to_is_smaller", code: `const t = createTween({ from: 100, to: 0, duration: 200 });
assert(t.update(50) === 75, 'got ' + t.update(0));
assert(t.update(1000) === 0, 'ends at 0');` },
    { name: "built_in_easings", code: `const at = (easing, ms) => createTween({ from: 0, to: 100, duration: 1000, easing }).update(ms);
assert(Math.abs(at('easeInQuad', 500) - 25) < 1e-9, 'easeInQuad ' + at('easeInQuad', 500));
assert(Math.abs(at('easeOutQuad', 500) - 75) < 1e-9, 'easeOutQuad ' + at('easeOutQuad', 500));
assert(Math.abs(at('easeInOutCubic', 500) - 50) < 1e-9, 'easeInOutCubic mid ' + at('easeInOutCubic', 500));
assert(Math.abs(at('easeInOutCubic', 250) - 6.25) < 1e-9, 'easeInOutCubic quarter ' + at('easeInOutCubic', 250));
assert(Math.abs(at('easeInOutCubic', 750) - 93.75) < 1e-9, 'easeInOutCubic three quarters ' + at('easeInOutCubic', 750));` },
    { name: "custom_easing_function", code: `const t = createTween({ from: 0, to: 10, duration: 100, easing: (x) => 1 - x });
assert(Math.abs(t.update(25) - 7.5) < 1e-9, 'custom curve: ' + t.update(0));` },
    { name: "unknown_easing_throws_at_creation", code: `let err = null;
try { createTween({ from: 0, to: 1, duration: 1, easing: 'bouncy' }); } catch (e) { err = e; }
assert(err instanceof RangeError, 'RangeError');` },
    { name: "zero_duration", code: `const t = createTween({ from: 1, to: 9, duration: 0 });
assert(t.isDone() === false, 'not done before the first update');
assert(t.update(0) === 9 && t.isDone() === true, 'first update completes it');` },
    { name: "negative_dt_is_ignored_and_reset_rewinds", code: `const t = createTween({ from: 0, to: 100, duration: 100 });
t.update(50);
assert(t.update(-30) === 50, 'time never runs backwards');
t.update(100);
t.reset();
assert(t.isDone() === false && t.progress() === 0, 'rewound');
assert(t.update(10) === 10, 'plays again from the start');` },
  ],
  solution: {
    code: `const EASINGS = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

function createTween(options) {
  const { from, to, duration, delay = 0, easing = 'linear' } = options;
  let ease;
  if (typeof easing === 'function') ease = easing;
  else if (Object.prototype.hasOwnProperty.call(EASINGS, easing)) ease = EASINGS[easing];
  else throw new RangeError('Unknown easing: ' + easing);

  let elapsed = 0;
  let started = false;

  const raw = () => {
    if (elapsed < delay) return 0;
    if (duration <= 0) return started ? 1 : 0;
    return Math.min((elapsed - delay) / duration, 1);
  };
  const done = () => raw() >= 1 && started && elapsed >= delay;

  return {
    update(dt) {
      started = true;
      elapsed += Math.max(dt, 0);
      if (done()) return to;
      return from + (to - from) * ease(raw());
    },
    isDone: () => done(),
    progress: () => raw(),
    reset() {
      elapsed = 0;
      started = false;
    },
  };
}

module.exports = createTween;`,
    explanation:
      "Only the elapsed time is stored; progress, easing and the output value are recomputed from it each frame, so there is no accumulated drift. Easing functions all map 0..1 to 0..1, which is why they compose with any from/to pair. Returning the exact target at the end avoids ending at 99.99999 because of floating-point error.",
  },
};
