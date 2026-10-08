export default {
  slug: "resolve-sphere-collision",
  trackId: "web-game",
  layerId: "web-game-6",
  type: "CODE",
  difficulty: "hard",
  title: "Collision response with impulses",
  summary: "Resolve a sphere-sphere collision: push the bodies apart by inverse mass and exchange an impulse along the contact normal with restitution.",
  description:
    "Detecting a collision is only half the job. The response step fixes two things: the bodies overlap (so move them apart, the lighter one more) and they are moving into each other (so change their velocities with an impulse along the contact normal). The same two steps run inside Cannon-es, Box2D and every rigid-body engine.",
  task:
    "Write <code>resolveSphereCollision(a, b, restitution = 1)</code>. Each body is <code>{ position: [x, y, z], velocity: [x, y, z], mass, radius }</code>; a <code>mass</code> of 0 means an immovable body. Return <code>{ a: { position, velocity }, b: { position, velocity } }</code> with new arrays, or <code>null</code> if the spheres do not overlap (or both are immovable). Never mutate the inputs.",
  constraints: [
    "The contact normal <code>n</code> is the unit vector from <code>a</code> to <code>b</code>; <code>depth = a.radius + b.radius - distance</code>. Touching spheres (depth 0) do not collide. If the centres coincide use <code>n = [0, 1, 0]</code>.",
    "Inverse masses: <code>invA = mass &gt; 0 ? 1 / mass : 0</code>, same for <code>b</code>. Position correction: move <code>a</code> by <code>-n * depth * invA / (invA + invB)</code> and <code>b</code> by <code>+n * depth * invB / (invA + invB)</code>. Immovable bodies do not move.",
    "Approach speed along the normal: <code>rv = dot(vB - vA, n)</code>. If <code>rv &gt; 0</code> they are already separating: leave both velocities unchanged (positions are still corrected). Otherwise the impulse magnitude is <code>j = -(1 + restitution) * rv / (invA + invB)</code>, with <code>vA -= j * invA * n</code> and <code>vB += j * invB * n</code>.",
    "Only the normal component changes; the sliding (tangential) part of each velocity is kept. Total momentum along the normal is conserved between movable bodies.",
  ],
  example: `// equal masses, head-on, restitution 1: the velocities swap
resolveSphereCollision({ position: [0,0,0], velocity: [1,0,0], mass: 1, radius: 1 }, { position: [1.5,0,0], velocity: [-1,0,0], mass: 1, radius: 1 })`,
  tags: ["physics", "collision-response", "impulse", "restitution"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "resolveSphereCollision.js",
      lang: "js",
      code: `// resolveSphereCollision.js
function resolveSphereCollision(a, b, restitution = 1) {
  // your code here
}

module.exports = resolveSphereCollision;`,
    },
  ],
  testFile: {
    name: "resolveSphereCollision_test.js",
    lang: "test",
    code: `const resolveSphereCollision = require('./resolveSphereCollision');
const ball = (x, vx, mass = 1) => ({ position: [x, 0, 0], velocity: [vx, 0, 0], mass, radius: 1 });

test('equal masses swap velocities', () => {
  const r = resolveSphereCollision(ball(0, 1), ball(1.5, -1), 1);
  expect(r.a.velocity[0]).toBeCloseTo(-1);
  expect(r.b.velocity[0]).toBeCloseTo(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Check for overlap first and return null early. Compute <code>n</code> and <code>depth</code> once; both steps use them." },
    { order: 2, cost: 5, text: "If <code>invA + invB === 0</code> both bodies are immovable: return null (nothing can change)." },
    { order: 3, cost: 15, text: "Tangential velocity is preserved automatically because you only add or subtract multiples of <code>n</code>. Build new arrays with <code>map</code> instead of editing the inputs." },
  ],
  hiddenTests: [
    { name: "equal_masses_swap_velocities", code: `const ball = (x, vx, mass = 1) => ({ position: [x, 0, 0], velocity: [vx, 0, 0], mass, radius: 1 });
const r = resolveSphereCollision(ball(0, 1), ball(1.5, -1), 1);
assert(r && Math.abs(r.a.velocity[0] + 1) < 1e-9 && Math.abs(r.b.velocity[0] - 1) < 1e-9, 'got ' + JSON.stringify(r));` },
    { name: "positions_are_separated_by_inverse_mass", code: `const ball = (x, mass) => ({ position: [x, 0, 0], velocity: [0, 0, 0], mass, radius: 1 });
const equal = resolveSphereCollision(ball(0, 1), ball(1.5, 1), 1);
assert(Math.abs(equal.a.position[0] + 0.25) < 1e-9 && Math.abs(equal.b.position[0] - 1.75) < 1e-9, 'depth 0.5 split evenly: ' + JSON.stringify(equal));
const uneven = resolveSphereCollision(ball(0, 3), ball(1.5, 1), 1);
assert(Math.abs(uneven.a.position[0] + 0.125) < 1e-9 && Math.abs(uneven.b.position[0] - 1.875) < 1e-9, 'the lighter body moves three times as far: ' + JSON.stringify(uneven));
assert(Math.abs((equal.b.position[0] - equal.a.position[0]) - 2) < 1e-9, 'they end up exactly touching');` },
    { name: "restitution_zero_makes_a_perfectly_inelastic_hit", code: `const ball = (x, vx) => ({ position: [x, 0, 0], velocity: [vx, 0, 0], mass: 1, radius: 1 });
const r = resolveSphereCollision(ball(0, 2), ball(1.5, 0), 0);
assert(Math.abs(r.a.velocity[0] - 1) < 1e-9 && Math.abs(r.b.velocity[0] - 1) < 1e-9, 'they move together at the average: ' + JSON.stringify(r));` },
    { name: "heavy_hits_light", code: `const a = { position: [0, 0, 0], velocity: [1, 0, 0], mass: 10, radius: 1 };
const b = { position: [1.5, 0, 0], velocity: [0, 0, 0], mass: 1, radius: 1 };
const r = resolveSphereCollision(a, b, 1);
assert(Math.abs(r.a.velocity[0] - 9 / 11) < 1e-9, 'a keeps going: ' + r.a.velocity[0]);
assert(Math.abs(r.b.velocity[0] - 20 / 11) < 1e-9, 'b is launched faster than a was: ' + r.b.velocity[0]);
const p0 = 10 * 1, p1 = 10 * r.a.velocity[0] + 1 * r.b.velocity[0];
assert(Math.abs(p0 - p1) < 1e-9, 'momentum conserved');` },
    { name: "immovable_wall_reflects_with_restitution", code: `const ball = { position: [0, 0, 0], velocity: [2, 0, 0], mass: 1, radius: 1 };
const wall = { position: [1.5, 0, 0], velocity: [0, 0, 0], mass: 0, radius: 1 };
const r = resolveSphereCollision(ball, wall, 0.5);
assert(Math.abs(r.a.velocity[0] + 1) < 1e-9, 'bounces back at half speed: ' + r.a.velocity[0]);
assert(r.b.velocity[0] === 0 && r.b.position[0] === 1.5, 'the wall does not move');
assert(Math.abs(r.a.position[0] + 0.5) < 1e-9, 'the whole overlap is taken by the movable body: ' + r.a.position[0]);` },
    { name: "tangential_velocity_is_kept", code: `const a = { position: [0, 0, 0], velocity: [1, 5, 0], mass: 1, radius: 1 };
const b = { position: [1.5, 0, 0], velocity: [-1, -3, 0], mass: 1, radius: 1 };
const r = resolveSphereCollision(a, b, 1);
assert(r.a.velocity[1] === 5 && r.b.velocity[1] === -3, 'sliding components untouched: ' + JSON.stringify(r));
assert(Math.abs(r.a.velocity[0] + 1) < 1e-9 && Math.abs(r.b.velocity[0] - 1) < 1e-9, 'normal components exchanged');` },
    { name: "oblique_collision_with_overlap", code: `const a = { position: [0, 0, 0], velocity: [2, 0, 0], mass: 1, radius: 1 };
const b = { position: [0.9, 1.2, 0], velocity: [0, 0, 0], mass: 1, radius: 1 };
const r = resolveSphereCollision(a, b, 1);
assert(r, 'distance 1.5 overlaps');
const nx = 0.6, ny = 0.8;
assert(Math.abs(r.b.velocity[0] - 1.2 * nx) < 1e-9 && Math.abs(r.b.velocity[1] - 1.2 * ny) < 1e-9, 'b gets the normal component 2 * 0.6 = 1.2 along n: ' + r.b.velocity);
assert(Math.abs(r.a.velocity[0] - (2 - 1.2 * nx)) < 1e-9 && Math.abs(r.a.velocity[1] + 1.2 * ny) < 1e-9, 'a loses it: ' + r.a.velocity);` },
    { name: "separating_bodies_keep_their_velocities", code: `const a = { position: [0, 0, 0], velocity: [-1, 0, 0], mass: 1, radius: 1 };
const b = { position: [1.5, 0, 0], velocity: [1, 0, 0], mass: 1, radius: 1 };
const r = resolveSphereCollision(a, b, 1);
assert(r.a.velocity[0] === -1 && r.b.velocity[0] === 1, 'no impulse when already moving apart');
assert(Math.abs(r.b.position[0] - r.a.position[0] - 2) < 1e-9, 'but the overlap is still fixed');` },
    { name: "no_collision_cases_and_purity", code: `const a = { position: [0, 0, 0], velocity: [1, 0, 0], mass: 1, radius: 1 };
const far = { position: [5, 0, 0], velocity: [0, 0, 0], mass: 1, radius: 1 };
const touching = { position: [2, 0, 0], velocity: [0, 0, 0], mass: 1, radius: 1 };
assert(resolveSphereCollision(a, far) === null && resolveSphereCollision(a, touching) === null, 'apart or touching: null');
const w1 = { position: [0, 0, 0], velocity: [0, 0, 0], mass: 0, radius: 1 };
const w2 = { position: [1, 0, 0], velocity: [0, 0, 0], mass: 0, radius: 1 };
assert(resolveSphereCollision(w1, w2) === null, 'two immovable bodies: null');
const copy = JSON.stringify([a, far]);
const near = { position: [1.5, 0, 0], velocity: [0, 0, 0], mass: 1, radius: 1 };
const nearCopy = JSON.stringify(near);
resolveSphereCollision(a, near);
assert(JSON.stringify(a) === JSON.stringify(JSON.parse(copy)[0]) && JSON.stringify(near) === nearCopy, 'inputs are not mutated');
const coincident = resolveSphereCollision({ position: [0, 0, 0], velocity: [0, -1, 0], mass: 1, radius: 1 }, { position: [0, 0, 0], velocity: [0, 0, 0], mass: 1, radius: 1 }, 1);
assert(coincident && coincident.b.position[1] > coincident.a.position[1], 'coincident centres separate along +y: ' + JSON.stringify(coincident));` },
  ],
  solution: {
    code: `function resolveSphereCollision(a, b, restitution = 1) {
  const d = [b.position[0] - a.position[0], b.position[1] - a.position[1], b.position[2] - a.position[2]];
  const dist = Math.hypot(d[0], d[1], d[2]);
  const sum = a.radius + b.radius;
  if (dist >= sum) return null;

  const invA = a.mass > 0 ? 1 / a.mass : 0;
  const invB = b.mass > 0 ? 1 / b.mass : 0;
  const invSum = invA + invB;
  if (invSum === 0) return null;

  const n = dist === 0 ? [0, 1, 0] : d.map((v) => v / dist);
  const depth = dist === 0 ? sum : sum - dist;

  const posA = a.position.map((v, i) => v - (n[i] * depth * invA) / invSum);
  const posB = b.position.map((v, i) => v + (n[i] * depth * invB) / invSum);

  let velA = [...a.velocity];
  let velB = [...b.velocity];
  const rv = (b.velocity[0] - a.velocity[0]) * n[0] + (b.velocity[1] - a.velocity[1]) * n[1] + (b.velocity[2] - a.velocity[2]) * n[2];
  if (rv <= 0) {
    const j = (-(1 + restitution) * rv) / invSum;
    velA = a.velocity.map((v, i) => v - j * invA * n[i]);
    velB = b.velocity.map((v, i) => v + j * invB * n[i]);
  }

  return { a: { position: posA, velocity: velA }, b: { position: posB, velocity: velB } };
}

module.exports = resolveSphereCollision;`,
    explanation:
      "Two independent fixes happen at a contact: positional correction removes the overlap (split by inverse mass so a heavy body barely moves), and the impulse changes velocities. The impulse formula j = -(1+e)*rv/(invA+invB) comes from asking for the post-collision approach speed to be -e times the pre-collision one. Skipping the impulse when rv > 0 prevents bodies that are already separating from being pulled back together.",
  },
};
