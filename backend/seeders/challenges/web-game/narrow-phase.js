export default {
  slug: "narrow-phase",
  trackId: "web-game",
  layerId: "web-game-6",
  type: "CODE",
  difficulty: "hard",
  title: "3D narrow-phase: sphere and box collisions",
  summary: "Detect collisions between spheres and axis-aligned boxes and report the contact normal and penetration depth.",
  description:
    "After the broad phase says two objects might touch, the narrow phase answers precisely: do they overlap, along which direction should they be pushed apart, and by how much? That normal and depth are exactly what the collision response (impulses, position correction) needs.",
  task:
    "Write <code>sphereVsSphere(a, b)</code>, <code>sphereVsAabb(sphere, box)</code> and <code>aabbVsAabb(a, b)</code>. Spheres are <code>{ center: [x, y, z], radius }</code>, boxes are <code>{ min: [x, y, z], max: [x, y, z] }</code>. Each returns <code>{ normal, depth }</code> or <code>null</code> when the shapes do not overlap.",
  constraints: [
    "<code>normal</code> is a unit vector pointing from the FIRST shape toward the SECOND; <code>depth</code> is the penetration distance, so moving the first shape by <code>-normal * depth</code> separates them. Shapes that merely touch (depth 0) do NOT collide: return <code>null</code>.",
    "<code>sphereVsSphere</code>: compare the centre distance with the sum of radii. If the centres coincide use the normal <code>[0, 1, 0]</code> and depth <code>ra + rb</code>.",
    "<code>sphereVsAabb</code>: find the point on the box closest to the sphere centre. If the centre is outside the box, <code>normal</code> points from the sphere toward that point and <code>depth = radius - distance</code> (null if distance &gt;= radius). If the centre is inside or on the surface of the box, find the nearest of the six faces; the normal is the direction pointing from the sphere to the box on that axis, i.e. OPPOSITE the direction you would exit through, and <code>depth = distanceToThatFace + radius</code>. Ties pick the lowest axis (x, then y, then z), min face before max face.",
    "<code>aabbVsAabb</code>: boxes overlap only if they overlap strictly on all three axes. Compute the penetration on each axis as <code>min(a.max - b.min, b.max - a.min)</code>, use the axis with the smallest value (ties: lowest axis), and give the normal the sign that points from the centre of <code>a</code> toward the centre of <code>b</code> (<code>+</code> if equal).",
  ],
  example: `sphereVsSphere({ center: [0, 0, 0], radius: 1 }, { center: [1.5, 0, 0], radius: 1 }) // { normal: [1, 0, 0], depth: 0.5 }`,
  tags: ["collision", "narrow-phase", "physics", "geometry"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "narrowPhase.js",
      lang: "js",
      code: `// narrowPhase.js
function sphereVsSphere(a, b) {
  // your code here
}

function sphereVsAabb(sphere, box) {
  // your code here
}

function aabbVsAabb(a, b) {
  // your code here
}

module.exports = { sphereVsSphere, sphereVsAabb, aabbVsAabb };`,
    },
  ],
  testFile: {
    name: "narrowPhase_test.js",
    lang: "test",
    code: `const { sphereVsSphere } = require('./narrowPhase');

test('overlapping spheres', () => {
  const hit = sphereVsSphere({ center: [0, 0, 0], radius: 1 }, { center: [1.5, 0, 0], radius: 1 });
  expect(hit.normal).toEqual([1, 0, 0]);
  expect(hit.depth).toBeCloseTo(0.5);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Clamp the sphere centre into the box per axis to get the closest point: <code>q[i] = Math.min(max[i], Math.max(min[i], c[i]))</code>. If <code>q</code> equals the centre, the centre is inside the box." },
    { order: 2, cost: 5, text: "Inside case: for every axis compute <code>c - min</code> and <code>max - c</code>, keep the smallest (strictly smaller wins, so earlier axes win ties). The normal is <code>+axis</code> if that smallest distance was to the MIN face, <code>-axis</code> if to the MAX face." },
    { order: 3, cost: 15, text: "Box vs box: depth per axis is the overlap length. Reject if any is <= 0 before choosing the minimum." },
  ],
  hiddenTests: [
    { name: "sphere_sphere_overlap", code: `const hit = sphereVsSphere({ center: [0, 0, 0], radius: 1 }, { center: [1.5, 0, 0], radius: 1 });
assert(hit && Math.abs(hit.depth - 0.5) < 1e-9, 'depth ' + (hit && hit.depth));
assert(hit.normal[0] === 1 && hit.normal[1] === 0 && hit.normal[2] === 0, 'normal points from a to b: ' + hit.normal);
const diag = sphereVsSphere({ center: [0, 0, 0], radius: 2 }, { center: [0, 1.5, 2], radius: 1 });
assert(Math.abs(diag.depth - 0.5) < 1e-9 && Math.abs(diag.normal[1] - 0.6) < 1e-9 && Math.abs(diag.normal[2] - 0.8) < 1e-9, 'unit normal along (0,1.5,2): ' + JSON.stringify(diag));` },
    { name: "sphere_sphere_no_collision_touching_and_coincident", code: `assert(sphereVsSphere({ center: [0, 0, 0], radius: 1 }, { center: [3, 0, 0], radius: 1 }) === null, 'apart');
assert(sphereVsSphere({ center: [0, 0, 0], radius: 1 }, { center: [2, 0, 0], radius: 1 }) === null, 'just touching is not a collision');
const same = sphereVsSphere({ center: [1, 1, 1], radius: 1 }, { center: [1, 1, 1], radius: 2 });
assert(same && same.normal[1] === 1 && same.normal[0] === 0 && same.depth === 3, 'coincident centres: ' + JSON.stringify(same));` },
    { name: "sphere_aabb_centre_outside", code: `const box = { min: [0, 0, 0], max: [10, 10, 10] };
const hit = sphereVsAabb({ center: [-1, 5, 5], radius: 2 }, box);
assert(hit && Math.abs(hit.depth - 1) < 1e-9, 'depth ' + (hit && hit.depth));
assert(hit.normal[0] === 1 && hit.normal[1] === 0 && hit.normal[2] === 0, 'normal points from the sphere toward the box: ' + hit.normal);
const top = sphereVsAabb({ center: [5, 11, 5], radius: 2 }, box);
assert(top && top.normal[1] === -1 && Math.abs(top.depth - 1) < 1e-9, 'resting on top: ' + JSON.stringify(top));` },
    { name: "sphere_aabb_corner_contact", code: `const box = { min: [0, 0, 0], max: [1, 1, 1] };
const hit = sphereVsAabb({ center: [2, 2, 1], radius: 1.5 }, box);
const dist = Math.hypot(1, 1);
assert(hit && Math.abs(hit.depth - (1.5 - dist)) < 1e-9, 'depth ' + (hit && hit.depth));
assert(Math.abs(hit.normal[0] + Math.SQRT1_2) < 1e-9 && Math.abs(hit.normal[1] + Math.SQRT1_2) < 1e-9 && hit.normal[2] === 0, 'diagonal normal toward the corner: ' + hit.normal);
assert(sphereVsAabb({ center: [2, 2, 1], radius: 1.4 }, box) === null, 'distance 1.414 is beyond radius 1.4');` },
    { name: "sphere_aabb_no_collision_and_touching", code: `const box = { min: [0, 0, 0], max: [10, 10, 10] };
assert(sphereVsAabb({ center: [-5, 5, 5], radius: 1 }, box) === null, 'far away');
assert(sphereVsAabb({ center: [-1, 5, 5], radius: 1 }, box) === null, 'touching the face is not a collision');` },
    { name: "sphere_aabb_centre_inside_the_box", code: `const box = { min: [0, 0, 0], max: [10, 10, 10] };
const hit = sphereVsAabb({ center: [1, 5, 5], radius: 2 }, box);
assert(hit && Math.abs(hit.depth - 3) < 1e-9, 'distance to nearest face 1 + radius 2: ' + (hit && hit.depth));
assert(hit.normal[0] === 1 && hit.normal[1] === 0 && hit.normal[2] === 0, 'the sphere would exit through -x, so the normal toward the box is +x: ' + hit.normal);
const high = sphereVsAabb({ center: [5, 9.5, 5], radius: 1 }, box);
assert(high && high.normal[1] === -1 && Math.abs(high.depth - 1.5) < 1e-9, 'nearest face is max y: ' + JSON.stringify(high));
const tie = sphereVsAabb({ center: [5, 5, 5], radius: 1 }, box);
assert(tie && tie.normal[0] === 1 && Math.abs(tie.depth - 6) < 1e-9, 'all faces tie: x min wins: ' + JSON.stringify(tie));
const onFace = sphereVsAabb({ center: [0, 5, 5], radius: 1 }, box);
assert(onFace && onFace.normal[0] === 1 && Math.abs(onFace.depth - 1) < 1e-9, 'centre on the surface counts as inside: ' + JSON.stringify(onFace));` },
    { name: "aabb_aabb_minimum_penetration_axis", code: `const a = { min: [0, 0, 0], max: [4, 4, 4] };
const b = { min: [3, 1, 1], max: [7, 3, 3] };
const hit = aabbVsAabb(a, b);
assert(hit && Math.abs(hit.depth - 1) < 1e-9, 'x overlap is the smallest: ' + JSON.stringify(hit));
assert(hit.normal[0] === 1 && hit.normal[1] === 0 && hit.normal[2] === 0, 'a to b is +x: ' + hit.normal);
const below = aabbVsAabb({ min: [0, 3, 0], max: [4, 7, 4] }, { min: [1, 0, 1], max: [3, 4, 3] });
assert(below && below.normal[1] === -1 && Math.abs(below.depth - 1) < 1e-9, 'b is below a, so the normal points down: ' + JSON.stringify(below));` },
    { name: "aabb_aabb_no_collision_touching_and_ties", code: `const a = { min: [0, 0, 0], max: [1, 1, 1] };
assert(aabbVsAabb(a, { min: [2, 0, 0], max: [3, 1, 1] }) === null, 'apart on x');
assert(aabbVsAabb(a, { min: [1, 0, 0], max: [2, 1, 1] }) === null, 'touching faces');
assert(aabbVsAabb(a, { min: [0.5, 5, 0.5], max: [1.5, 6, 1.5] }) === null, 'overlap on two axes is not enough');
const tie = aabbVsAabb({ min: [0, 0, 0], max: [2, 2, 2] }, { min: [1, 1, 1], max: [3, 3, 3] });
assert(tie && tie.depth === 1 && tie.normal[0] === 1 && tie.normal[1] === 0, 'ties pick x: ' + JSON.stringify(tie));
const concentric = aabbVsAabb({ min: [0, 0, 0], max: [2, 2, 2] }, { min: [0, 0, 0], max: [2, 2, 2] });
assert(concentric && concentric.normal[0] === 1 && concentric.depth === 2, 'identical boxes: ' + JSON.stringify(concentric));` },
  ],
  solution: {
    code: `function sphereVsSphere(a, b) {
  const d = [b.center[0] - a.center[0], b.center[1] - a.center[1], b.center[2] - a.center[2]];
  const dist = Math.hypot(d[0], d[1], d[2]);
  const sum = a.radius + b.radius;
  if (dist >= sum) return null;
  if (dist === 0) return { normal: [0, 1, 0], depth: sum };
  return { normal: [d[0] / dist, d[1] / dist, d[2] / dist], depth: sum - dist };
}

function sphereVsAabb(sphere, box) {
  const c = sphere.center;
  const q = [0, 1, 2].map((i) => Math.min(box.max[i], Math.max(box.min[i], c[i])));
  const d = [q[0] - c[0], q[1] - c[1], q[2] - c[2]];
  const dist = Math.hypot(d[0], d[1], d[2]);

  if (dist > 0) {
    if (dist >= sphere.radius) return null;
    return { normal: [d[0] / dist, d[1] / dist, d[2] / dist], depth: sphere.radius - dist };
  }

  let best = Infinity;
  let axis = 0;
  let sign = 1;
  for (let i = 0; i < 3; i++) {
    const toMin = c[i] - box.min[i];
    const toMax = box.max[i] - c[i];
    if (toMin < best) { best = toMin; axis = i; sign = 1; }
    if (toMax < best) { best = toMax; axis = i; sign = -1; }
  }
  const normal = [0, 0, 0];
  normal[axis] = sign;
  return { normal, depth: best + sphere.radius };
}

function aabbVsAabb(a, b) {
  let depth = Infinity;
  let axis = 0;
  for (let i = 0; i < 3; i++) {
    const pen = Math.min(a.max[i] - b.min[i], b.max[i] - a.min[i]);
    if (a.max[i] <= b.min[i] || b.max[i] <= a.min[i]) return null;
    if (pen < depth) { depth = pen; axis = i; }
  }
  const ca = (a.min[axis] + a.max[axis]) / 2;
  const cb = (b.min[axis] + b.max[axis]) / 2;
  const normal = [0, 0, 0];
  normal[axis] = cb >= ca ? 1 : -1;
  return { normal, depth };
}

module.exports = { sphereVsSphere, sphereVsAabb, aabbVsAabb };`,
    explanation:
      "Every test reduces to the same output, a unit normal and a depth, which is the contract the solver wants. Sphere-vs-box works by clamping the centre into the box: the clamped point is the closest point on the box, so the distance to it is compared with the radius. When the centre is inside the box that distance is zero and the normal is undefined, so the nearest face decides it. Box-vs-box uses the 'minimum translation' idea: push apart along the axis of least overlap.",
  },
};
