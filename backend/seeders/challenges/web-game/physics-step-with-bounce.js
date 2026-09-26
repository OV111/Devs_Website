export default {
  slug: "physics-step-with-bounce",
  trackId: "web-game",
  layerId: "web-game-6",
  type: "CODE",
  difficulty: "med",
  title: "One physics step — gravity, integration, and a floor bounce",
  summary:
    "Advance a falling body by one timestep under gravity, and make it bounce off a floor with energy loss.",
  description:
    "This is the core loop underneath every physics engine, Cannon-es included, run once per frame at a much smaller scale. Get this loop wrong and objects either pass through the floor or bounce forever.",
  task:
    "Write <code>step(body, gravity, floorY, restitution, dt)</code>. <code>body</code> is <code>{ y, vy }</code> (vertical position and velocity; y increases downward, as in most 2D engines). Apply gravity to velocity, then integrate position by velocity over <code>dt</code>. If the new position would go below <code>floorY</code>, clamp it to <code>floorY</code> and reflect the velocity, scaled by <code>restitution</code> (0 = no bounce, 1 = perfectly elastic). Return the updated <code>{ y, vy }</code> — do not mutate the input.",
  constraints: [
    "Velocity is updated from gravity BEFORE position is integrated from velocity (semi-implicit Euler, not explicit Euler) — this is what keeps energy roughly stable over many steps.",
    "A body resting exactly on the floor with near-zero bounce should settle, not jitter forever — restitution scales the bounce velocity, it doesn't add energy.",
    "The input object must not be mutated — return a new object.",
  ],
  example: `let body = { y: 0, vy: 0 };
for (let i = 0; i < 60; i++) {
  body = step(body, 9.8, 10, 0.5, 1 / 60);
}
// after ~1 second of falling toward floorY=10 with gravity, body has bounced
// at least once and lost energy each bounce (restitution 0.5)`,
  tags: ["physics", "simulation", "game-math"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "step.js",
      lang: "js",
      code: `// step.js
function step(body, gravity, floorY, restitution, dt) {
  // your code here
}

module.exports = step;`,
    },
  ],
  testFile: {
    name: "step_test.js",
    lang: "test",
    code: `// step_test.js
const step = require('./step');

test('gravity_increases_downward_velocity', () => {
  const body = { y: 0, vy: 0 };
  const next = step(body, 10, 100, 0.5, 1);
  expect(next.vy).toBe(10);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Order matters: <code>vy += gravity * dt</code> first, THEN <code>y += vy * dt</code> using the just-updated velocity — that's 'semi-implicit', and it's what real engines use because it's more stable than updating position with the OLD velocity.",
    },
    {
      order: 2,
      cost: 5,
      text: "After integrating position, check if <code>y > floorY</code> (remember y grows downward). If so, that's a penetration — you have to correct it, not just leave the body below the floor.",
    },
    {
      order: 3,
      cost: 10,
      text: "On a floor hit: set <code>y = floorY</code> (clamp, don't leave it penetrating) and set <code>vy = -vy * restitution</code> (reflect the direction, scale the magnitude down).",
    },
  ],
  hiddenTests: [
    {
      name: "gravity_accelerates_velocity_downward",
      code: `const body = { y: 0, vy: 0 };
const next = step(body, 10, 100, 0.5, 1);
assert(next.vy === 10, 'after 1 second under gravity 10 with no floor hit, vy should be 10, got ' + next.vy);`,
    },
    {
      name: "position_integrates_using_the_updated_velocity",
      code: `const body = { y: 0, vy: 0 };
const next = step(body, 10, 1000, 0.5, 1);
assert(next.y === 10, 'semi-implicit Euler: y should advance by the NEW velocity (10) times dt (1) = 10, got ' + next.y);`,
    },
    {
      name: "does_not_mutate_the_input",
      code: `const body = { y: 0, vy: 0 };
const before = JSON.stringify(body);
step(body, 10, 100, 0.5, 1);
assert(JSON.stringify(body) === before, 'the input body object must not be mutated');`,
    },
    {
      name: "clamps_to_the_floor_on_penetration",
      code: `const body = { y: 9, vy: 5 };
const next = step(body, 0, 10, 0.5, 1);
assert(next.y === 10, 'a body that would penetrate the floor must be clamped exactly to floorY, got ' + next.y);`,
    },
    {
      name: "bounce_reflects_and_scales_velocity_by_restitution",
      code: `const body = { y: 9, vy: 5 };
const next = step(body, 0, 10, 0.5, 1);
assert(next.vy === -2.5, 'hitting the floor moving down at 5 with restitution 0.5 should reflect to vy=-2.5 (upward), got ' + next.vy);`,
    },
    {
      name: "zero_restitution_stops_dead_at_the_floor",
      code: `const body = { y: 9, vy: 5 };
const next = step(body, 0, 10, 0, 1);
assert(next.vy === 0, 'restitution 0 must fully absorb the bounce — vy should be 0, got ' + next.vy);
assert(next.y === 10, 'the body should still be resting exactly on the floor, got ' + next.y);`,
    },
    {
      name: "no_floor_hit_leaves_velocity_unreflected",
      code: `const body = { y: 0, vy: 1 };
const next = step(body, 0, 100, 0.5, 1);
assert(next.vy === 1, 'without a floor hit, velocity must be unaffected by restitution, got ' + next.vy);
assert(next.y === 1, 'position should just integrate normally, got ' + next.y);`,
    },
  ],
  solution: {
    code: `function step(body, gravity, floorY, restitution, dt) {
  let vy = body.vy + gravity * dt;
  let y = body.y + vy * dt;

  if (y > floorY) {
    y = floorY;
    vy = -vy * restitution;
  }

  return { y, vy };
}

module.exports = step;`,
    explanation:
      "Velocity is updated from gravity before position is integrated from that same updated velocity — that ordering (semi-implicit / symplectic Euler) is what real physics engines use instead of the naive version, because it conserves energy much more closely over many steps; using the old velocity to move position and only updating velocity afterward drifts and gains energy over time. After moving, y > floorY means the straight-line motion this step would have tunneled the body below the floor — clamping y back to floorY corrects the position, and reflecting vy (flipping its sign) with a restitution multiplier is what turns the impact into a bounce instead of the body just stopping or passing through. Restitution scales the existing velocity rather than adding to it, which is why 0 fully absorbs the impact (vy becomes exactly 0) instead of leaving residual energy.",
  },
};
