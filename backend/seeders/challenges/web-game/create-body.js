export default {
  slug: "create-body",
  trackId: "web-game",
  layerId: "web-game-6",
  type: "CODE",
  difficulty: "med",
  title: "Rigid body: forces, impulses and damping",
  summary: "A 3D point-mass body like Cannon-es: accumulate forces, apply instant impulses, integrate with gravity and damping, and support static bodies.",
  description:
    "Every physics engine body does the same few things per step: turn the forces added this frame into acceleration (F = ma), add gravity, update velocity, bleed off energy with damping, then move. Impulses are the instant version of a force: a jump or an explosion changes velocity right now instead of over a step.",
  task:
    "Write <code>createBody(options)</code> with <code>options</code> <code>{ mass, position = [0, 0, 0], velocity = [0, 0, 0], linearDamping = 0, gravityScale = 1 }</code>. Return <code>{ applyForce, applyImpulse, step, getState }</code>. Vectors are <code>[x, y, z]</code> arrays.",
  constraints: [
    "<code>mass: 0</code> (or any mass &lt;= 0) makes a STATIC body: <code>applyForce</code>, <code>applyImpulse</code> and <code>step</code> never change it. Otherwise the body is dynamic.",
    "<code>applyForce(f)</code> ADDS to a force accumulator that is consumed (and cleared) by the next <code>step</code>. <code>applyImpulse(j)</code> changes velocity immediately: <code>velocity += j / mass</code>.",
    "<code>step(dt, gravity = [0, -9.8, 0])</code> (dt in seconds; a negative or non-finite <code>dt</code> throws <code>RangeError</code>): acceleration = <code>force / mass + gravity * gravityScale</code>; <code>velocity += acceleration * dt</code>; then damping <code>velocity *= (1 - linearDamping) ** dt</code>; then <code>position += velocity * dt</code> (semi-implicit Euler: the NEW velocity moves the body). Gravity does not depend on mass.",
    "<code>getState()</code> returns <code>{ position, velocity }</code> as COPIES: modifying them must not affect the body, and the arrays passed in <code>options</code> must be copied too.",
  ],
  example: `const b = createBody({ mass: 2, position: [0, 10, 0] }); b.applyForce([4, 0, 0]); b.step(1 / 60);`,
  tags: ["physics", "cannon-es", "forces", "integration"],
  estimatedMins: 35,
  xp: 55,
  starterFiles: [
    {
      name: "createBody.js",
      lang: "js",
      code: `// createBody.js
function createBody(options) {
  // your code here
}

module.exports = createBody;`,
    },
  ],
  testFile: {
    name: "createBody_test.js",
    lang: "test",
    code: `const createBody = require('./createBody');

test('free fall for one second', () => {
  const b = createBody({ mass: 1 });
  b.step(1);
  expect(b.getState().velocity[1]).toBeCloseTo(-9.8);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>position</code>, <code>velocity</code> and <code>force</code> as three-element arrays you own (copy the inputs). Static means <code>mass &lt;= 0</code>: return early from the mutating methods." },
    { order: 2, cost: 5, text: "Inside <code>step</code>: for each axis <code>v[i] += (force[i] / mass + gravity[i] * gravityScale) * dt</code>, then multiply by the damping factor, then <code>p[i] += v[i] * dt</code>. Finally zero the force." },
    { order: 3, cost: 15, text: "Validate <code>dt</code> with <code>Number.isFinite(dt) &amp;&amp; dt &gt;= 0</code> before doing anything, including for static bodies." },
  ],
  hiddenTests: [
    { name: "free_fall_uses_semi_implicit_euler", code: `const b = createBody({ mass: 3, position: [0, 100, 0] });
b.step(1);
const s = b.getState();
assert(Math.abs(s.velocity[1] + 9.8) < 1e-9, 'velocity ' + s.velocity);
assert(Math.abs(s.position[1] - (100 - 9.8)) < 1e-9, 'the NEW velocity moves the body: ' + s.position);
assert(s.position[0] === 0 && s.velocity[0] === 0, 'no sideways motion');` },
    { name: "force_over_mass_is_acceleration", code: `const b = createBody({ mass: 2, gravityScale: 0 });
b.applyForce([4, 0, 0]);
b.step(1);
const s = b.getState();
assert(Math.abs(s.velocity[0] - 2) < 1e-9 && Math.abs(s.position[0] - 2) < 1e-9, 'F = ma, a = 2: ' + JSON.stringify(s));` },
    { name: "forces_accumulate_and_are_consumed_by_one_step", code: `const b = createBody({ mass: 1, gravityScale: 0 });
b.applyForce([1, 0, 0]); b.applyForce([2, 3, 0]);
b.step(1);
assert(JSON.stringify(b.getState().velocity) === '[3,3,0]', 'summed: ' + JSON.stringify(b.getState().velocity));
b.step(1);
assert(JSON.stringify(b.getState().velocity) === '[3,3,0]', 'cleared: the second step adds nothing');` },
    { name: "impulse_changes_velocity_immediately", code: `const b = createBody({ mass: 4, gravityScale: 0 });
b.applyImpulse([8, 0, -4]);
const s = b.getState();
assert(s.velocity[0] === 2 && s.velocity[2] === -1, 'velocity += j / m: ' + s.velocity);
assert(s.position[0] === 0, 'position has not moved yet');` },
    { name: "gravity_is_independent_of_mass_and_scalable", code: `const heavy = createBody({ mass: 1000 }), light = createBody({ mass: 0.1 }), floaty = createBody({ mass: 1, gravityScale: 0.5 });
for (const b of [heavy, light, floaty]) b.step(1);
assert(heavy.getState().velocity[1] === light.getState().velocity[1], 'same fall speed');
assert(Math.abs(floaty.getState().velocity[1] + 4.9) < 1e-9, 'gravityScale: ' + floaty.getState().velocity[1]);
const moon = createBody({ mass: 1 });
moon.step(1, [0, -1.6, 0]);
assert(Math.abs(moon.getState().velocity[1] + 1.6) < 1e-9, 'custom gravity');` },
    { name: "linear_damping", code: `const b = createBody({ mass: 1, velocity: [10, 0, 0], linearDamping: 0.5, gravityScale: 0 });
b.step(1);
const s = b.getState();
assert(Math.abs(s.velocity[0] - 5) < 1e-9, 'v * (1 - 0.5)^1: ' + s.velocity[0]);
assert(Math.abs(s.position[0] - 5) < 1e-9, 'moves with the damped velocity: ' + s.position[0]);
const c = createBody({ mass: 1, velocity: [8, 0, 0], linearDamping: 0.5, gravityScale: 0 });
c.step(0.5); c.step(0.5);
assert(Math.abs(c.getState().velocity[0] - 4) < 1e-9, 'damping is frame-rate independent: two half steps equal one full step');` },
    { name: "static_bodies_never_move", code: `const wall = createBody({ mass: 0, position: [1, 2, 3], velocity: [5, 5, 5] });
wall.applyForce([100, 0, 0]); wall.applyImpulse([100, 0, 0]);
wall.step(1);
const s = wall.getState();
assert(JSON.stringify(s.position) === '[1,2,3]', 'position fixed: ' + s.position);
assert(JSON.stringify(s.velocity) === '[5,5,5]', 'a static body ignores forces, impulses and gravity (its velocity is left as given): ' + s.velocity);` },
    { name: "state_and_options_are_copied", code: `const pos = [0, 0, 0];
const b = createBody({ mass: 1, position: pos, gravityScale: 0 });
pos[0] = 99;
assert(b.getState().position[0] === 0, 'options array copied');
const s = b.getState();
s.position[1] = 42; s.velocity[1] = 42;
assert(b.getState().position[1] === 0 && b.getState().velocity[1] === 0, 'getState returns copies');
const f = [1, 0, 0];
b.applyForce(f);
f[0] = 1000;
b.step(1);
assert(b.getState().velocity[0] === 1, 'applied force vector is copied too');` },
    { name: "invalid_dt_throws", code: `const b = createBody({ mass: 1 });
const bad = (v) => { try { b.step(v); return false; } catch (e) { return e instanceof RangeError; } };
assert(bad(-1) && bad(NaN) && bad(Infinity), 'RangeError for bad dt');
b.step(0);
assert(b.getState().position[1] === 0, 'dt = 0 changes nothing');` },
  ],
  solution: {
    code: `function createBody(options) {
  const { mass, linearDamping = 0, gravityScale = 1 } = options;
  const position = [...(options.position ?? [0, 0, 0])];
  const velocity = [...(options.velocity ?? [0, 0, 0])];
  const force = [0, 0, 0];
  const isStatic = !(mass > 0);

  return {
    applyForce(f) {
      if (isStatic) return;
      for (let i = 0; i < 3; i++) force[i] += f[i];
    },
    applyImpulse(j) {
      if (isStatic) return;
      for (let i = 0; i < 3; i++) velocity[i] += j[i] / mass;
    },
    step(dt, gravity = [0, -9.8, 0]) {
      if (!Number.isFinite(dt) || dt < 0) throw new RangeError('dt must be a finite number >= 0');
      if (isStatic) return;
      const damping = Math.pow(1 - linearDamping, dt);
      for (let i = 0; i < 3; i++) {
        velocity[i] += (force[i] / mass + gravity[i] * gravityScale) * dt;
        velocity[i] *= damping;
        position[i] += velocity[i] * dt;
        force[i] = 0;
      }
    },
    getState: () => ({ position: [...position], velocity: [...velocity] }),
  };
}

module.exports = createBody;`,
    explanation:
      "Forces are only meaningful for one step, so they sit in an accumulator that step() consumes and clears; impulses skip the accumulator and edit velocity directly. Updating velocity before position (semi-implicit Euler) is the cheap choice that keeps simulations stable. Raising (1 - damping) to the power dt makes drag independent of the frame rate, which is how Cannon-es does it.",
  },
};
