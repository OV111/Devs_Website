export default {
  slug: "raycast",
  trackId: "web-game",
  layerId: "web-game-6",
  type: "CODE",
  difficulty: "hard",
  title: "Raycasting for object picking",
  summary: "Intersect a ray with spheres, boxes and triangles, and pick the nearest object, the way Three.js Raycaster handles mouse clicks.",
  description:
    "Clicking on a 3D scene means firing a ray from the camera through the mouse position and asking what it hits first. <code>THREE.Raycaster</code> does this against meshes; underneath are three small tests: ray vs sphere, ray vs box (the slab method) and ray vs triangle (Moller-Trumbore).",
  task:
    "Write <code>raySphere(ray, center, radius)</code>, <code>rayAabb(ray, min, max)</code>, <code>rayTriangle(ray, a, b, c)</code> and <code>pickNearest(ray, objects)</code>. A ray is <code>{ origin: [x, y, z], direction: [x, y, z] }</code>. The test functions return the hit distance <code>t</code> or <code>null</code>.",
  constraints: [
    "Normalise the direction before testing so <code>t</code> is a true distance in world units (a direction of <code>[2, 0, 0]</code> gives the same distances as <code>[1, 0, 0]</code>). A zero-length direction throws a <code>RangeError</code>.",
    "Only hits in FRONT of the origin count (<code>t &gt;= 0</code>). When the origin is INSIDE a sphere or box, return the distance to the point where the ray leaves it. A ray that only grazes a sphere (tangent) counts as a hit.",
    "<code>rayAabb</code> uses the slab method: intersect the three axis intervals. A direction component of 0 means the ray is parallel to that slab: it misses unless the origin lies within the slab.",
    "<code>rayTriangle</code> is two-sided (back faces are hit too). Return <code>null</code> for rays parallel to the triangle's plane, hits outside the triangle, or <code>t &lt;= 1e-9</code>.",
    "<code>pickNearest(ray, objects)</code> takes objects <code>{ id, type: 'sphere', center, radius }</code>, <code>{ id, type: 'aabb', min, max }</code> or <code>{ id, type: 'triangle', a, b, c }</code> and returns <code>{ id, distance, point }</code> for the closest hit (the first one on ties), or <code>null</code>. An unknown <code>type</code> throws an <code>Error</code>.",
  ],
  example: `pickNearest({ origin: [0, 0, 10], direction: [0, 0, -1] }, [{ id: 'ball', type: 'sphere', center: [0, 0, 0], radius: 1 }]) // { id: 'ball', distance: 9, point: [0, 0, 1] }`,
  tags: ["three.js", "raycaster", "picking", "geometry"],
  estimatedMins: 50,
  xp: 85,
  starterFiles: [
    {
      name: "raycast.js",
      lang: "js",
      code: `// raycast.js
function raySphere(ray, center, radius) {
  // your code here
}

function rayAabb(ray, min, max) {
  // your code here
}

function rayTriangle(ray, a, b, c) {
  // your code here
}

function pickNearest(ray, objects) {
  // your code here
}

module.exports = { raySphere, rayAabb, rayTriangle, pickNearest };`,
    },
  ],
  testFile: {
    name: "raycast_test.js",
    lang: "test",
    code: `const { raySphere } = require('./raycast');

test('hits a sphere head on', () => {
  const t = raySphere({ origin: [0, 0, 10], direction: [0, 0, -1] }, [0, 0, 0], 1);
  expect(t).toBeCloseTo(9);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a <code>unit(direction)</code> helper that throws on zero length. Every function starts with <code>const d = unit(ray.direction)</code>." },
    { order: 2, cost: 5, text: "Sphere: with <code>oc = origin - center</code>, solve <code>t^2 + 2*b*t + c = 0</code> where <code>b = dot(oc, d)</code>, <code>c = dot(oc, oc) - r^2</code>. Take the smaller root if it is &gt;= 0, otherwise the larger." },
    { order: 3, cost: 15, text: "Moller-Trumbore: <code>e1 = b - a</code>, <code>e2 = c - a</code>, <code>p = cross(d, e2)</code>, <code>det = dot(e1, p)</code>; if <code>|det| &lt; 1e-12</code> it is parallel. Then <code>u</code> and <code>v</code> barycentrics must satisfy <code>u &gt;= 0, v &gt;= 0, u + v &lt;= 1</code>." },
  ],
  hiddenTests: [
    { name: "ray_sphere_basic_hits_and_misses", code: `const ray = { origin: [0, 0, 10], direction: [0, 0, -1] };
assert(Math.abs(raySphere(ray, [0, 0, 0], 1) - 9) < 1e-9, 'front face at distance 9');
assert(raySphere(ray, [5, 0, 0], 1) === null, 'misses to the side');
assert(raySphere({ origin: [0, 0, 10], direction: [0, 0, 1] }, [0, 0, 0], 1) === null, 'sphere is behind the ray');` },
    { name: "ray_sphere_direction_need_not_be_unit_length", code: `const t = raySphere({ origin: [0, 0, 10], direction: [0, 0, -7] }, [0, 0, 0], 1);
assert(Math.abs(t - 9) < 1e-9, 'distance in world units: ' + t);
let err = null;
try { raySphere({ origin: [0, 0, 0], direction: [0, 0, 0] }, [0, 0, 5], 1); } catch (e) { err = e; }
assert(err instanceof RangeError, 'zero direction');` },
    { name: "ray_sphere_inside_and_tangent", code: `const inside = raySphere({ origin: [0, 0, 0], direction: [1, 0, 0] }, [0, 0, 0], 3);
assert(Math.abs(inside - 3) < 1e-9, 'from inside the hit is the exit point: ' + inside);
const tangent = raySphere({ origin: [-5, 1, 0], direction: [1, 0, 0] }, [0, 0, 0], 1);
assert(tangent !== null && Math.abs(tangent - 5) < 1e-9, 'grazing counts as a hit: ' + tangent);
const justMissed = raySphere({ origin: [-5, 1.01, 0], direction: [1, 0, 0] }, [0, 0, 0], 1);
assert(justMissed === null, 'slightly higher misses');` },
    { name: "ray_aabb_entry_distance", code: `const box = [[-1, -1, -1], [1, 1, 1]];
const t = rayAabb({ origin: [0, 0, 10], direction: [0, 0, -1] }, box[0], box[1]);
assert(Math.abs(t - 9) < 1e-9, 'front face: ' + t);
const diag = rayAabb({ origin: [-10, -10, -10], direction: [1, 1, 1] }, box[0], box[1]);
assert(Math.abs(diag - Math.sqrt(3) * 9) < 1e-9, 'corner approach: ' + diag);
assert(rayAabb({ origin: [3, 0, 10], direction: [0, 0, -1] }, box[0], box[1]) === null, 'passes beside the box');
assert(rayAabb({ origin: [0, 0, 10], direction: [0, 0, 1] }, box[0], box[1]) === null, 'box is behind');` },
    { name: "ray_aabb_parallel_rays_and_inside", code: `const min = [-1, -1, -1], max = [1, 1, 1];
const along = rayAabb({ origin: [-5, 0.5, 0], direction: [1, 0, 0] }, min, max);
assert(along !== null && Math.abs(along - 4) < 1e-9, 'parallel to two slabs but inside them: ' + along);
assert(rayAabb({ origin: [-5, 2, 0], direction: [1, 0, 0] }, min, max) === null, 'parallel and outside the y slab');
const out = rayAabb({ origin: [0, 0, 0], direction: [0, 1, 0] }, min, max);
assert(Math.abs(out - 1) < 1e-9, 'from inside, the exit distance: ' + out);` },
    { name: "ray_triangle_hit_and_edges", code: `const a = [0, 0, 0], b = [4, 0, 0], c = [0, 4, 0];
const down = { origin: [1, 1, 5], direction: [0, 0, -1] };
assert(Math.abs(rayTriangle(down, a, b, c) - 5) < 1e-9, 'inside the triangle');
assert(rayTriangle({ origin: [3, 3, 5], direction: [0, 0, -1] }, a, b, c) === null, 'outside, past the hypotenuse');
assert(rayTriangle({ origin: [-1, 1, 5], direction: [0, 0, -1] }, a, b, c) === null, 'outside, left of the triangle');
assert(rayTriangle({ origin: [2, 2, 5], direction: [0, 0, -1] }, a, b, c) !== null, 'on the hypotenuse edge');` },
    { name: "ray_triangle_two_sided_parallel_and_behind", code: `const a = [0, 0, 0], b = [4, 0, 0], c = [0, 4, 0];
assert(Math.abs(rayTriangle({ origin: [1, 1, -5], direction: [0, 0, 1] }, a, b, c) - 5) < 1e-9, 'back face is hit too');
assert(rayTriangle({ origin: [1, 1, 5], direction: [1, 0, 0] }, a, b, c) === null, 'parallel to the plane');
assert(rayTriangle({ origin: [1, 1, 5], direction: [0, 0, 1] }, a, b, c) === null, 'triangle is behind the ray');
const t = rayTriangle({ origin: [0, 0, 3], direction: [1, 1, -3] }, [-5, -5, 0], [10, -5, 0], [-5, 10, 0]);
assert(t !== null && Math.abs(t - Math.sqrt(11)) < 1e-9, 'oblique ray (direction length sqrt(11)): ' + t);` },
    { name: "pick_nearest_chooses_the_closest_object", code: `const ray = { origin: [0, 0, 20], direction: [0, 0, -1] };
const objects = [
  { id: 'far-ball', type: 'sphere', center: [0, 0, -5], radius: 1 },
  { id: 'near-box', type: 'aabb', min: [-1, -1, 4], max: [1, 1, 6] },
  { id: 'tri', type: 'triangle', a: [-5, -5, 10], b: [5, -5, 10], c: [0, 5, 10] },
];
const hit = pickNearest(ray, objects);
assert(hit.id === 'tri' && Math.abs(hit.distance - 10) < 1e-9, 'the triangle at z = 10 is closest: ' + JSON.stringify(hit));
assert(Math.abs(hit.point[0]) < 1e-9 && Math.abs(hit.point[1]) < 1e-9 && Math.abs(hit.point[2] - 10) < 1e-9, 'hit point: ' + hit.point);
const without = pickNearest(ray, [objects[0], objects[1]]);
assert(without.id === 'near-box' && Math.abs(without.distance - 14) < 1e-9 && Math.abs(without.point[2] - 6) < 1e-9, 'next closest is the top of the box at z = 6: ' + JSON.stringify(without));` },
    { name: "pick_nearest_edge_cases", code: `const ray = { origin: [0, 0, 5], direction: [0, 0, -1] };
assert(pickNearest(ray, []) === null, 'nothing to hit');
assert(pickNearest(ray, [{ id: 'x', type: 'sphere', center: [10, 0, 0], radius: 1 }]) === null, 'miss');
const tie = pickNearest(ray, [
  { id: 'first', type: 'sphere', center: [0, 0, 0], radius: 1 },
  { id: 'second', type: 'sphere', center: [0, 0, 0], radius: 1 },
]);
assert(tie.id === 'first', 'ties go to the first object');
let err = null;
try { pickNearest(ray, [{ id: 'bad', type: 'cone' }]); } catch (e) { err = e; }
assert(err instanceof Error, 'unknown type throws');
const scaled = pickNearest({ origin: [0, 0, 5], direction: [0, 0, -3] }, [{ id: 's', type: 'sphere', center: [0, 0, 0], radius: 1 }]);
assert(Math.abs(scaled.distance - 4) < 1e-9 && Math.abs(scaled.point[2] - 1) < 1e-9, 'distance and point use a normalised direction: ' + JSON.stringify(scaled));` },
  ],
  solution: {
    code: `const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function unit(direction) {
  const len = Math.hypot(direction[0], direction[1], direction[2]);
  if (len === 0) throw new RangeError('direction must not be zero');
  return [direction[0] / len, direction[1] / len, direction[2] / len];
}

function raySphere(ray, center, radius) {
  const d = unit(ray.direction);
  const oc = sub(ray.origin, center);
  const b = dot(oc, d);
  const c = dot(oc, oc) - radius * radius;
  const disc = b * b - c;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const t1 = -b - sq;
  const t2 = -b + sq;
  if (t1 >= 0) return t1;
  if (t2 >= 0) return t2;
  return null;
}

function rayAabb(ray, min, max) {
  const d = unit(ray.direction);
  let tmin = -Infinity;
  let tmax = Infinity;
  for (let i = 0; i < 3; i++) {
    if (d[i] === 0) {
      if (ray.origin[i] < min[i] || ray.origin[i] > max[i]) return null;
      continue;
    }
    let t1 = (min[i] - ray.origin[i]) / d[i];
    let t2 = (max[i] - ray.origin[i]) / d[i];
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (tmax < 0) return null;
  return tmin >= 0 ? tmin : tmax;
}

function rayTriangle(ray, a, b, c) {
  const d = unit(ray.direction);
  const e1 = sub(b, a);
  const e2 = sub(c, a);
  const p = cross(d, e2);
  const det = dot(e1, p);
  if (Math.abs(det) < 1e-12) return null;
  const inv = 1 / det;
  const s = sub(ray.origin, a);
  const u = dot(s, p) * inv;
  if (u < 0 || u > 1) return null;
  const q = cross(s, e1);
  const v = dot(d, q) * inv;
  if (v < 0 || u + v > 1) return null;
  const t = dot(e2, q) * inv;
  return t > 1e-9 ? t : null;
}

function pickNearest(ray, objects) {
  const d = unit(ray.direction);
  let best = null;
  for (const obj of objects) {
    let t;
    if (obj.type === 'sphere') t = raySphere(ray, obj.center, obj.radius);
    else if (obj.type === 'aabb') t = rayAabb(ray, obj.min, obj.max);
    else if (obj.type === 'triangle') t = rayTriangle(ray, obj.a, obj.b, obj.c);
    else throw new Error('Unknown object type: ' + obj.type);
    if (t !== null && (best === null || t < best.distance)) {
      best = {
        id: obj.id,
        distance: t,
        point: [ray.origin[0] + d[0] * t, ray.origin[1] + d[1] * t, ray.origin[2] + d[2] * t],
      };
    }
  }
  return best;
}

module.exports = { raySphere, rayAabb, rayTriangle, pickNearest };`,
    explanation:
      "All three shape tests reduce to solving for the distance t along the ray. The sphere test is a quadratic whose discriminant says miss, graze or hit; the box test intersects the three per-axis intervals (slabs) where the ray is inside; Moller-Trumbore finds the barycentric coordinates u and v of the hit directly without computing the plane. pickNearest just runs the right test per object and keeps the smallest t, which is the essence of Raycaster.intersectObjects.",
  },
};
