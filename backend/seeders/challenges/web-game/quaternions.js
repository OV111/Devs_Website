export default {
  slug: "quaternions",
  trackId: "web-game",
  layerId: "web-game-5",
  type: "CODE",
  difficulty: "hard",
  title: "Quaternions: rotate and slerp",
  summary: "Represent 3D rotations as quaternions: build from axis and angle, combine, rotate vectors and interpolate smoothly with slerp.",
  description:
    "Three.js stores object rotation as a quaternion because Euler angles gimbal-lock and can't be blended smoothly. A unit quaternion <code>[x, y, z, w]</code> encodes an axis and angle; multiplying them combines rotations, and <code>slerp</code> interpolates at constant angular speed along the shortest path. It's what makes camera and character turns look natural.",
  task:
    "Write <code>fromAxisAngle(axis, angle)</code>, <code>multiply(a, b)</code>, <code>conjugate(q)</code>, <code>normalize(q)</code>, <code>rotateVector(q, v)</code> and <code>slerp(a, b, t)</code>. Quaternions are <code>[x, y, z, w]</code> arrays, vectors are <code>[x, y, z]</code>.",
  constraints: [
    "<code>fromAxisAngle</code> normalises the axis and returns <code>[sin(angle/2) * ax, sin(angle/2) * ay, sin(angle/2) * az, cos(angle/2)]</code>. A zero-length axis throws a <code>RangeError</code>. Rotations are right-handed: 90 degrees about +Y turns <code>[0, 0, 1]</code> into <code>[1, 0, 0]</code>.",
    "<code>multiply(a, b)</code> is the Hamilton product with <code>x = aw*bx + ax*bw + ay*bz - az*by</code>, <code>y = aw*by - ax*bz + ay*bw + az*bx</code>, <code>z = aw*bz + ax*by - ay*bx + az*bw</code>, <code>w = aw*bw - ax*bx - ay*by - az*bz</code>. The result applies <code>b</code> FIRST, then <code>a</code>.",
    "<code>conjugate</code> negates x, y, z (the inverse rotation for a unit quaternion). <code>normalize</code> scales to length 1 and throws <code>RangeError</code> for a zero quaternion.",
    "<code>rotateVector(q, v)</code> rotates <code>v</code> by the unit quaternion <code>q</code> (use <code>t = 2 * cross(q.xyz, v)</code>, <code>v' = v + w * t + cross(q.xyz, t)</code>).",
    "<code>slerp(a, b, t)</code> interpolates along the shortest arc: if <code>dot(a, b) &lt; 0</code> negate <code>b</code> (q and -q are the same rotation). If the quaternions are nearly identical (dot &gt; 0.9995) use normalised linear interpolation instead. Otherwise weights are <code>sin((1 - t) * theta) / sin(theta)</code> and <code>sin(t * theta) / sin(theta)</code> with <code>theta = acos(dot)</code>. The result has length 1.",
  ],
  example: `rotateVector(fromAxisAngle([0, 1, 0], Math.PI / 2), [0, 0, 1]) // [1, 0, 0]`,
  tags: ["three.js", "quaternion", "rotation", "interpolation"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "quat.js",
      lang: "js",
      code: `// quat.js  (quaternion = [x, y, z, w])
function fromAxisAngle(axis, angle) {
  // your code here
}

function multiply(a, b) {
  // your code here
}

function conjugate(q) {
  // your code here
}

function normalize(q) {
  // your code here
}

function rotateVector(q, v) {
  // your code here
}

function slerp(a, b, t) {
  // your code here
}

module.exports = { fromAxisAngle, multiply, conjugate, normalize, rotateVector, slerp };`,
    },
  ],
  testFile: {
    name: "quat_test.js",
    lang: "test",
    code: `const { fromAxisAngle, rotateVector } = require('./quat');

test('90 degrees about Y', () => {
  const q = fromAxisAngle([0, 1, 0], Math.PI / 2);
  const v = rotateVector(q, [0, 0, 1]);
  expect(Math.abs(v[0] - 1)).toBeLessThan(1e-9);
  expect(Math.abs(v[2])).toBeLessThan(1e-9);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Half-angle everywhere: a quaternion for rotation <code>angle</code> stores <code>sin(angle/2)</code> and <code>cos(angle/2)</code>." },
    { order: 2, cost: 5, text: "Implement <code>rotateVector</code> with the two cross-product formula from the constraints rather than building a matrix: it avoids a lot of arithmetic." },
    { order: 3, cost: 15, text: "In <code>slerp</code>, clamp <code>dot</code> to at most 1 before <code>Math.acos</code>, and handle the 'almost the same' case first so you never divide by a tiny <code>sin(theta)</code>." },
  ],
  hiddenTests: [
    { name: "from_axis_angle_values", code: `const q = fromAxisAngle([0, 0, 2], Math.PI);
const near = (a, b) => Math.abs(a - b) < 1e-9;
assert(near(q[0], 0) && near(q[1], 0) && near(q[2], 1) && near(q[3], 0), 'half turn about a non-unit axis: ' + q);
const id = fromAxisAngle([1, 0, 0], 0);
assert(near(id[0], 0) && near(id[3], 1), 'zero angle is the identity');
let err = null;
try { fromAxisAngle([0, 0, 0], 1); } catch (e) { err = e; }
assert(err instanceof RangeError, 'zero axis throws');` },
    { name: "rotate_vector_is_right_handed", code: `const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9 && Math.abs(p[2] - q[2]) < 1e-9;
const h = Math.PI / 2;
assert(near(rotateVector(fromAxisAngle([0, 1, 0], h), [0, 0, 1]), [1, 0, 0]), 'Y: z -> x');
assert(near(rotateVector(fromAxisAngle([0, 0, 1], h), [1, 0, 0]), [0, 1, 0]), 'Z: x -> y');
assert(near(rotateVector(fromAxisAngle([1, 0, 0], h), [0, 1, 0]), [0, 0, 1]), 'X: y -> z');
const axis = [1, 2, 3];
assert(near(rotateVector(fromAxisAngle(axis, 1.234), axis), axis), 'the axis itself does not move');` },
    { name: "rotation_preserves_length", code: `const q = normalize([0.3, -0.5, 0.2, 0.9]);
const v = rotateVector(q, [3, 4, 12]);
assert(Math.abs(Math.hypot(v[0], v[1], v[2]) - 13) < 1e-9, 'length ' + Math.hypot(v[0], v[1], v[2]));` },
    { name: "multiply_applies_the_right_operand_first", code: `const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9 && Math.abs(p[2] - q[2]) < 1e-9;
const rx = fromAxisAngle([1, 0, 0], Math.PI / 2);
const rz = fromAxisAngle([0, 0, 1], Math.PI / 2);
const both = multiply(rz, rx);
const v = rotateVector(both, [0, 1, 0]);
assert(near(v, rotateVector(rz, rotateVector(rx, [0, 1, 0]))), 'same as rotating by rx and then rz: ' + v);
assert(near(v, [0, 0, 1]), 'rx sends y to z, then rz leaves z alone: ' + v);
const other = rotateVector(multiply(rx, rz), [0, 1, 0]);
assert(!near(v, other), 'order matters');` },
    { name: "conjugate_inverts", code: `const q = normalize([0.1, 0.7, -0.3, 0.6]);
const id = multiply(q, conjugate(q));
assert(Math.abs(id[0]) < 1e-9 && Math.abs(id[1]) < 1e-9 && Math.abs(id[2]) < 1e-9 && Math.abs(id[3] - 1) < 1e-9, 'q * q^-1 = identity: ' + id);
const v = rotateVector(conjugate(q), rotateVector(q, [1, 2, 3]));
assert(Math.abs(v[0] - 1) < 1e-9 && Math.abs(v[1] - 2) < 1e-9 && Math.abs(v[2] - 3) < 1e-9, 'undoes the rotation: ' + v);` },
    { name: "normalize", code: `const n = normalize([0, 0, 3, 4]);
assert(Math.abs(n[2] - 0.6) < 1e-12 && Math.abs(n[3] - 0.8) < 1e-12, 'got ' + n);
let err = null;
try { normalize([0, 0, 0, 0]); } catch (e) { err = e; }
assert(err instanceof RangeError, 'zero quaternion');` },
    { name: "slerp_endpoints_and_midpoint", code: `const a = fromAxisAngle([0, 0, 1], 0);
const b = fromAxisAngle([0, 0, 1], Math.PI / 2);
const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9 && Math.abs(p[2] - q[2]) < 1e-9 && Math.abs(p[3] - q[3]) < 1e-9;
assert(near(slerp(a, b, 0), a), 't = 0');
assert(near(slerp(a, b, 1), b), 't = 1');
assert(near(slerp(a, b, 0.5), fromAxisAngle([0, 0, 1], Math.PI / 4)), 'half way is a 45 degree turn: ' + slerp(a, b, 0.5));` },
    { name: "slerp_has_constant_angular_speed", code: `const a = fromAxisAngle([0, 0, 1], 0);
const b = fromAxisAngle([0, 0, 1], Math.PI);
const v = rotateVector(slerp(a, b, 0.25), [1, 0, 0]);
assert(Math.abs(v[0] - Math.cos(Math.PI / 4)) < 1e-9 && Math.abs(v[1] - Math.sin(Math.PI / 4)) < 1e-9, 'a quarter of a half turn is 45 degrees (nlerp would give about 37): ' + v);` },
    { name: "slerp_takes_the_shortest_path", code: `const a = fromAxisAngle([0, 0, 1], 0);
const b = fromAxisAngle([0, 0, 1], Math.PI / 2);
const flipped = b.map((x) => -x);
const mid = slerp(a, flipped, 0.5);
const v = rotateVector(mid, [1, 0, 0]);
assert(Math.abs(v[0] - Math.cos(Math.PI / 4)) < 1e-9 && Math.abs(v[1] - Math.sin(Math.PI / 4)) < 1e-9, 'same 45 degree result even though b is given with the opposite sign: ' + v);` },
    { name: "slerp_nearly_equal_quaternions_and_unit_length", code: `const a = fromAxisAngle([0, 1, 0], 1);
const b = fromAxisAngle([0, 1, 0], 1.0000001);
const m = slerp(a, b, 0.5);
assert(m.every((x) => Number.isFinite(x)), 'no NaN from a tiny sin(theta)');
const len = Math.hypot(m[0], m[1], m[2], m[3]);
assert(Math.abs(len - 1) < 1e-9, 'unit length ' + len);
const same = slerp(a, a, 0.3);
assert(Math.abs(same[1] - a[1]) < 1e-9, 'slerp of a quaternion with itself');` },
  ],
  solution: {
    code: `function fromAxisAngle(axis, angle) {
  const len = Math.hypot(axis[0], axis[1], axis[2]);
  if (len === 0) throw new RangeError('axis must not be zero');
  const s = Math.sin(angle / 2) / len;
  return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle / 2)];
}

function multiply(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

function conjugate(q) {
  return [-q[0], -q[1], -q[2], q[3]];
}

function normalize(q) {
  const len = Math.hypot(q[0], q[1], q[2], q[3]);
  if (len === 0) throw new RangeError('cannot normalize a zero quaternion');
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function rotateVector(q, v) {
  const u = [q[0], q[1], q[2]];
  const t = cross(u, v).map((c) => 2 * c);
  const ut = cross(u, t);
  return [v[0] + q[3] * t[0] + ut[0], v[1] + q[3] * t[1] + ut[1], v[2] + q[3] * t[2] + ut[2]];
}

function slerp(a, b, t) {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  let target = b;
  if (dot < 0) {
    target = b.map((x) => -x);
    dot = -dot;
  }
  if (dot > 0.9995) {
    return normalize(a.map((x, i) => x + t * (target[i] - x)));
  }
  const theta = Math.acos(Math.min(1, dot));
  const sin = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sin;
  const wb = Math.sin(t * theta) / sin;
  return normalize(a.map((x, i) => wa * x + wb * target[i]));
}

module.exports = { fromAxisAngle, multiply, conjugate, normalize, rotateVector, slerp };`,
    explanation:
      "A quaternion stores half the rotation angle, which is why q and -q are the same rotation and why slerp must flip one of them to take the short way round. Multiplication composes rotations without gimbal lock, and rotating a vector needs just two cross products. Slerp moves at constant angular speed; plain linear interpolation of the four numbers (followed by normalising) is faster but speeds up through the middle, so it is only used when the two rotations are nearly identical.",
  },
};
