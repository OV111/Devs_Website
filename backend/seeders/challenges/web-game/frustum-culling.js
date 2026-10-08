export default {
  slug: "frustum-culling",
  trackId: "web-game",
  layerId: "web-game-5",
  type: "CODE",
  difficulty: "hard",
  title: "Frustum culling",
  summary: "Extract the six frustum planes from a view-projection matrix and test spheres and boxes against them to skip drawing what the camera can't see.",
  description:
    "Three.js (and every engine) skips drawing objects outside the camera's view: <code>frustumCulled</code>. The view volume is a truncated pyramid bounded by six planes, and all six can be read straight out of the combined view-projection matrix. Testing an object's bounding sphere or box against them is far cheaper than sending it to the GPU.",
  task:
    "Write <code>planesFromMatrix(viewProj)</code>, <code>sphereVsFrustum(planes, center, radius)</code> and <code>aabbVsFrustum(planes, min, max)</code>. Matrices are 16 numbers in column-major order (<code>m[col * 4 + row]</code>).",
  constraints: [
    "<code>planesFromMatrix</code> returns six planes <code>[a, b, c, d]</code> in the order <code>[left, right, bottom, top, near, far]</code>. With the matrix rows <code>row_i = [m[i], m[4 + i], m[8 + i], m[12 + i]]</code>: <code>left = row3 + row0</code>, <code>right = row3 - row0</code>, <code>bottom = row3 + row1</code>, <code>top = row3 - row1</code>, <code>near = row3 + row2</code>, <code>far = row3 - row2</code>. Normalise each plane by dividing all four numbers by <code>sqrt(a*a + b*b + c*c)</code>.",
    "A point <code>p</code> is on the inside of a plane when <code>a*x + b*y + c*z + d &gt;= 0</code> (that value is its signed distance, because the planes are normalised).",
    "<code>sphereVsFrustum</code> returns <code>'outside'</code> if the sphere is entirely behind ANY plane (distance &lt; <code>-radius</code>), <code>'inside'</code> if it is entirely in front of ALL planes (distance &gt;= <code>radius</code> for every plane), otherwise <code>'intersecting'</code>.",
    "<code>aabbVsFrustum(planes, min, max)</code> returns the same three words for an axis-aligned box. For each plane test the box corner furthest along the plane normal (the 'positive vertex'): if even that corner is behind the plane, the box is <code>'outside'</code>. If the corner furthest AGAINST the normal (the 'negative vertex') is behind any plane, the box is at least <code>'intersecting'</code>; otherwise <code>'inside'</code>.",
  ],
  example: `sphereVsFrustum(planesFromMatrix(viewProj), [0, 0, -5], 1) // 'inside' for a camera at the origin looking down -Z`,
  tags: ["three.js", "culling", "frustum", "performance"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "frustumCulling.js",
      lang: "js",
      code: `// frustumCulling.js
function planesFromMatrix(m) {
  // your code here
}

function sphereVsFrustum(planes, center, radius) {
  // your code here
}

function aabbVsFrustum(planes, min, max) {
  // your code here
}

module.exports = { planesFromMatrix, sphereVsFrustum, aabbVsFrustum };`,
    },
  ],
  testFile: {
    name: "frustumCulling_test.js",
    lang: "test",
    code: `const { planesFromMatrix, sphereVsFrustum } = require('./frustumCulling');
const perspective = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };

test('a sphere in front of the camera is inside', () => {
  const planes = planesFromMatrix(perspective(Math.PI / 2, 1, 1, 10));
  expect(sphereVsFrustum(planes, [0, 0, -5], 1)).toBe('inside');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Build the four rows of the matrix first, then each plane is a simple add or subtract of two rows (component-wise)." },
    { order: 2, cost: 5, text: "Signed distance of a sphere centre to a plane: <code>a*cx + b*cy + c*cz + d</code>. Track two booleans while looping: <code>anyOutside</code> (distance &lt; -r) and <code>allInside</code> (distance &gt;= r)." },
    { order: 3, cost: 15, text: "For the box, the positive vertex per axis is <code>normal &gt;= 0 ? max : min</code>; the negative vertex is the opposite choice." },
  ],
  hiddenTests: [
    { name: "plane_order_and_normalisation", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(planes.length === 6 && planes.every((p) => p.length === 4), 'six planes of four numbers');
for (const p of planes) assert(Math.abs(Math.hypot(p[0], p[1], p[2]) - 1) < 1e-9, 'normalised: ' + p);
const near = (p, q) => p.every((v, i) => Math.abs(v - q[i]) < 1e-9);
assert(near(planes[4], [0, 0, -1, -1]), 'near plane: ' + planes[4]);
assert(near(planes[5], [0, 0, 1, 10]), 'far plane: ' + planes[5]);
const s = Math.SQRT1_2;
assert(near(planes[0], [s, 0, -s, 0]), 'left plane: ' + planes[0]);
assert(near(planes[1], [-s, 0, -s, 0]), 'right plane: ' + planes[1]);
assert(near(planes[2], [0, s, -s, 0]), 'bottom plane: ' + planes[2]);
assert(near(planes[3], [0, -s, -s, 0]), 'top plane: ' + planes[3]);` },
    { name: "planes_follow_the_camera_transform", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const view = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -20, 1];
const planes = planesFromMatrix(mul(persp(Math.PI / 2, 1, 1, 10), view));
assert(sphereVsFrustum(planes, [0, 0, 15], 1) === 'inside', 'camera moved to z = 20, so the world point z = 15 is 5 units ahead');
assert(sphereVsFrustum(planes, [0, 0, -5], 1) === 'outside', 'the old position is now far behind the far plane');` },
    { name: "sphere_inside", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(sphereVsFrustum(planes, [0, 0, -5], 1) === 'inside', 'centre of the view');
assert(sphereVsFrustum(planes, [1, -1, -5], 0.5) === 'inside', 'off centre but well inside');` },
    { name: "sphere_outside_each_plane", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(sphereVsFrustum(planes, [0, 0, -20], 1) === 'outside', 'beyond far');
assert(sphereVsFrustum(planes, [0, 0, 5], 1) === 'outside', 'behind the camera');
assert(sphereVsFrustum(planes, [-20, 0, -5], 1) === 'outside', 'far left');
assert(sphereVsFrustum(planes, [20, 0, -5], 1) === 'outside', 'far right');
assert(sphereVsFrustum(planes, [0, 20, -5], 1) === 'outside', 'far above');
assert(sphereVsFrustum(planes, [0, -20, -5], 1) === 'outside', 'far below');
assert(sphereVsFrustum(planes, [0, 0, -0.2], 0.5) !== 'inside', 'poking through the near plane is not inside');` },
    { name: "sphere_intersecting", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(sphereVsFrustum(planes, [0, 0, -10], 1) === 'intersecting', 'straddling the far plane');
assert(sphereVsFrustum(planes, [0, 0, -1], 0.5) === 'intersecting', 'straddling the near plane');
assert(sphereVsFrustum(planes, [5, 0, -5], 1) === 'intersecting', 'straddling the right plane');
assert(sphereVsFrustum(planes, [0, 0, -1], 100) === 'intersecting', 'a huge sphere that swallows the frustum is not culled');` },
    { name: "sphere_touching_boundaries", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(sphereVsFrustum(planes, [0, 0, -12], 2.01) !== 'outside', 'a sphere that reaches just past the far plane is not culled');
assert(sphereVsFrustum(planes, [0, 0, -5], 0) === 'inside', 'a point inside');
assert(sphereVsFrustum(planes, [0, 0, -50], 0) === 'outside', 'a point outside');` },
    { name: "aabb_inside_outside_and_intersecting", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(aabbVsFrustum(planes, [-1, -1, -6], [1, 1, -4]) === 'inside', 'a box in the middle');
assert(aabbVsFrustum(planes, [-1, -1, -30], [1, 1, -20]) === 'outside', 'beyond far');
assert(aabbVsFrustum(planes, [10, -1, -6], [12, 1, -4]) === 'outside', 'off to the side');
assert(aabbVsFrustum(planes, [-1, -1, -12], [1, 1, -8]) === 'intersecting', 'crossing the far plane');
assert(aabbVsFrustum(planes, [-100, -100, -100], [100, 100, 100]) === 'intersecting', 'a huge box around everything is not outside');` },
    { name: "aabb_corner_tests_matter", code: `const persp = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]; };
const planes = planesFromMatrix(persp(Math.PI / 2, 1, 1, 10));
assert(aabbVsFrustum(planes, [-6, -1, -3], [-4, 1, -2]) === 'outside', 'between near and far but entirely left of the left plane');
assert(aabbVsFrustum(planes, [-3, -3, -3], [-2.5, -2.5, -2.4]) === 'intersecting', 'this one is partly inside: at z = -3 the view reaches x = -3');
assert(aabbVsFrustum(planes, [4, -0.5, -5.5], [6, 0.5, -4.5]) === 'intersecting', 'a box poking out of the right side');
assert(aabbVsFrustum(planes, [-0.1, -0.1, -5.1], [0.1, 0.1, -4.9]) === 'inside', 'a tiny box');` },
  ],
  solution: {
    code: `function planesFromMatrix(m) {
  const row = (i) => [m[i], m[4 + i], m[8 + i], m[12 + i]];
  const r0 = row(0), r1 = row(1), r2 = row(2), r3 = row(3);
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const sub = (a, b) => a.map((v, i) => v - b[i]);
  const raw = [add(r3, r0), sub(r3, r0), add(r3, r1), sub(r3, r1), add(r3, r2), sub(r3, r2)];
  return raw.map((p) => {
    const len = Math.hypot(p[0], p[1], p[2]);
    return p.map((v) => v / len);
  });
}

const distance = (p, x, y, z) => p[0] * x + p[1] * y + p[2] * z + p[3];

function sphereVsFrustum(planes, center, radius) {
  let allInside = true;
  for (const p of planes) {
    const d = distance(p, center[0], center[1], center[2]);
    if (d < -radius) return 'outside';
    if (d < radius) allInside = false;
  }
  return allInside ? 'inside' : 'intersecting';
}

function aabbVsFrustum(planes, min, max) {
  let intersecting = false;
  for (const p of planes) {
    const px = p[0] >= 0 ? max[0] : min[0];
    const py = p[1] >= 0 ? max[1] : min[1];
    const pz = p[2] >= 0 ? max[2] : min[2];
    if (distance(p, px, py, pz) < 0) return 'outside';
    const nx = p[0] >= 0 ? min[0] : max[0];
    const ny = p[1] >= 0 ? min[1] : max[1];
    const nz = p[2] >= 0 ? min[2] : max[2];
    if (distance(p, nx, ny, nz) < 0) intersecting = true;
  }
  return intersecting ? 'intersecting' : 'inside';
}

module.exports = { planesFromMatrix, sphereVsFrustum, aabbVsFrustum };`,
    explanation:
      "A clip-space point is inside the view when -w <= x, y, z <= w, and each of those six inequalities is a plane whose coefficients are just a sum or difference of two rows of the view-projection matrix (the Gribb-Hartmann trick). Normalising makes the plane equation return true distances, so a sphere can be tested with a single comparison per plane. For boxes only two corners per plane matter: if even the most-inside corner is behind, the box is gone; if the most-outside corner is behind, it straddles the plane.",
  },
};
