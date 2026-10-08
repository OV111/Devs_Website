export default {
  slug: "fixed-timestep-loop",
  trackId: "web-game",
  layerId: "web-game-1",
  type: "CODE",
  difficulty: "med",
  title: "Fixed-timestep game loop",
  summary: "Drive game logic at a fixed rate from a variable-rate requestAnimationFrame: accumulator, spiral-of-death clamp and render interpolation.",
  description:
    "<code>requestAnimationFrame</code> fires at the monitor's rate (60, 120, 144 Hz) with jittery gaps. If game logic uses those raw gaps, physics behaves differently on every machine. The standard fix is a fixed timestep: simulate in constant slices, however long the frame took, and give the renderer the leftover fraction to interpolate.",
  task:
    "Write <code>createLoop(update, options)</code> returning <code>{ tick, reset }</code>. <code>options</code> is <code>{ step = 1000 / 60, maxFrame = 250 }</code> in milliseconds. <code>tick(now)</code> is called once per animation frame with a timestamp and returns <code>{ updates, alpha }</code>.",
  constraints: [
    "The first <code>tick</code> after creation (or after <code>reset()</code>) only records the time: it runs no updates and returns <code>{ updates: 0, alpha: 0 }</code>.",
    "Later ticks add the elapsed time since the previous tick to an accumulator, then call <code>update(step)</code> once for each full <code>step</code> in the accumulator, subtracting it each time. Leftover time carries over to the next tick.",
    "The elapsed time of one tick is clamped to <code>maxFrame</code> (a tab that was in the background must not trigger thousands of catch-up updates: the 'spiral of death'). A timestamp that goes backwards counts as 0 elapsed time.",
    "Return <code>updates</code> (how many times <code>update</code> ran this tick) and <code>alpha = accumulator / step</code>, always in <code>[0, 1)</code>.",
  ],
  example: `const loop = createLoop((dt) => world.step(dt), { step: 10 }); loop.tick(0); loop.tick(16) // { updates: 1, alpha: 0.6 }`,
  tags: ["game-loop", "requestanimationframe", "timestep", "physics"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "createLoop.js",
      lang: "js",
      code: `// createLoop.js
function createLoop(update, options = {}) {
  // your code here
}

module.exports = createLoop;`,
    },
  ],
  testFile: {
    name: "createLoop_test.js",
    lang: "test",
    code: `const createLoop = require('./createLoop');

test('first tick only records the time', () => {
  const loop = createLoop(() => {}, { step: 10 });
  expect(loop.tick(1000)).toEqual({ updates: 0, alpha: 0 });
});

test('runs whole steps and keeps the remainder', () => {
  let n = 0;
  const loop = createLoop(() => { n++; }, { step: 10 });
  loop.tick(0);
  const r = loop.tick(25);
  expect(r.updates).toBe(2);
  expect(n).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "State: <code>last</code> (null until the first tick) and <code>acc</code>. Compute <code>frame = Math.min(Math.max(now - last, 0), maxFrame)</code>." },
    { order: 2, cost: 5, text: "<code>while (acc &gt;= step) { update(step); acc -= step; updates++; }</code>, then <code>alpha = acc / step</code>." },
    { order: 3, cost: 15, text: "Don't use <code>Math.floor(acc / step)</code> with float division for the count: subtract in the loop so <code>acc</code> stays exact." },
  ],
  hiddenTests: [
    { name: "first_tick_only_records_time", code: `let n = 0;
const loop = createLoop(() => { n++; }, { step: 10 });
const r = loop.tick(5000);
assert(r.updates === 0 && r.alpha === 0 && n === 0, 'got ' + JSON.stringify(r));` },
    { name: "runs_whole_steps_and_returns_alpha", code: `let n = 0;
const loop = createLoop(() => { n++; }, { step: 10 });
loop.tick(0);
const r = loop.tick(16);
assert(r.updates === 1 && n === 1, 'updates ' + r.updates);
assert(Math.abs(r.alpha - 0.6) < 1e-9, 'alpha ' + r.alpha);` },
    { name: "remainder_carries_over", code: `let n = 0;
const loop = createLoop(() => { n++; }, { step: 10 });
loop.tick(0);
loop.tick(4); loop.tick(8);
assert(n === 0, 'nothing yet');
const r = loop.tick(12);
assert(r.updates === 1 && n === 1, 'one step now');
assert(Math.abs(r.alpha - 0.2) < 1e-9, 'alpha ' + r.alpha);` },
    { name: "update_receives_the_fixed_step", code: `const seen = [];
const loop = createLoop((dt) => { seen.push(dt); }, { step: 20 });
loop.tick(0); loop.tick(65);
assert(JSON.stringify(seen) === '[20,20,20]', 'got ' + JSON.stringify(seen));` },
    { name: "same_total_time_same_update_count_at_any_frame_rate", code: `const run = (frame, frames) => {
  let n = 0;
  const loop = createLoop(() => { n++; }, { step: 10 });
  loop.tick(0);
  for (let i = 1; i <= frames; i++) loop.tick(i * frame);
  return n;
};
assert(run(10, 10) === 10, '100 fps for 100 ms');
assert(run(20, 5) === 10, '50 fps');
assert(run(25, 4) === 10, '40 fps');
assert(run(100, 1) === 10, 'one big frame');` },
    { name: "long_frames_are_clamped", code: `let n = 0;
const loop = createLoop(() => { n++; }, { step: 10, maxFrame: 100 });
loop.tick(0);
const r = loop.tick(60000);
assert(r.updates === 10 && n === 10, 'clamped to maxFrame / step, got ' + r.updates);
const r2 = loop.tick(60010);
assert(r2.updates === 1, 'back to normal after the pause: ' + r2.updates);` },
    { name: "time_going_backwards_is_ignored", code: `let n = 0;
const loop = createLoop(() => { n++; }, { step: 10 });
loop.tick(100);
const r = loop.tick(50);
assert(r.updates === 0 && r.alpha === 0, 'no negative accumulation: ' + JSON.stringify(r));
const r2 = loop.tick(60);
assert(r2.updates === 1, 'time resumes from the new timestamp: ' + r2.updates);` },
    { name: "alpha_stays_in_range", code: `const loop = createLoop(() => {}, { step: 10 });
loop.tick(0);
for (let t = 7; t < 500; t += 7) {
  const { alpha } = loop.tick(t);
  assert(alpha >= 0 && alpha < 1, 'alpha ' + alpha + ' at ' + t);
}` },
    { name: "reset_starts_over", code: `let n = 0;
const loop = createLoop(() => { n++; }, { step: 10 });
loop.tick(0); loop.tick(25);
loop.reset();
const r = loop.tick(100000);
assert(r.updates === 0 && r.alpha === 0, 'first tick after reset only records time');
const r2 = loop.tick(100010);
assert(r2.updates === 1, 'then counts normally and the old remainder is gone: ' + JSON.stringify(r2));` },
    { name: "default_options", code: `let n = 0;
const loop = createLoop(() => { n++; });
loop.tick(0);
loop.tick(1000);
assert(n > 0 && n <= 15, 'default maxFrame (250 ms at ~16.67 ms steps) caps at 15, got ' + n);` },
  ],
  solution: {
    code: `function createLoop(update, options = {}) {
  const step = options.step ?? 1000 / 60;
  const maxFrame = options.maxFrame ?? 250;
  let last = null;
  let acc = 0;

  return {
    tick(now) {
      if (last === null) {
        last = now;
        return { updates: 0, alpha: 0 };
      }
      const frame = Math.min(Math.max(now - last, 0), maxFrame);
      last = now;
      acc += frame;
      let updates = 0;
      while (acc >= step) {
        update(step);
        acc -= step;
        updates++;
      }
      return { updates, alpha: acc / step };
    },
    reset() {
      last = null;
      acc = 0;
    },
  };
}

module.exports = createLoop;`,
    explanation:
      "Frames can be any length, but the simulation only ever advances in identical slices, so physics is deterministic across 60 Hz and 144 Hz screens. Clamping the frame stops a returning background tab from running thousands of updates in one go. The leftover fraction (alpha) is handed to the renderer so it can draw between the previous and current state instead of stuttering.",
  },
};
