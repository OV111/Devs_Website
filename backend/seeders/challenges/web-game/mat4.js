export default {
  slug: "mat4",
  trackId: "web-game",
  layerId: "web-game-5",
  type: "CODE",
  difficulty: "hard",
  title: "4x4 matrix toolkit",
  summary: "Build the matrix functions every 3D engine rests on: multiply, translate, scale, rotate, transform a point, transpose and invert.",
  description:
    "Three.js, WebGL and every engine move vertices with 4x4 matrices. Position, rotation and scale all become one matrix, and combining them is multiplication, where ORDER matters. Matrices are stored as 16 numbers in column-major order (the layout WebGL expects), so element <code>m[col * 4 + row]</code>.",
  task:
    "Write <code>identity()</code>, <code>multiply(a, b)</code>, <code>translation(x, y, z)</code>, <code>scaling(x, y, z)</code>, <code>rotationX(rad)</code>, <code>rotationY(rad)</code>, <code>rotationZ(rad)</code>, <code>transformPoint(m, [x, y, z])</code>, <code>transpose(m)</code> and <code>invert(m)</code>. Matrices are plain arrays of 16 numbers.",
  constraints: [
    "Column-major: the translation lives in elements 12, 13, 14. Every function returns a NEW array and never modifies its inputs.",
    "<code>multiply(a, b)</code> is the matrix product <code>a * b</code>: applying the result to a point applies <code>b</code> FIRST, then <code>a</code>. (<code>multiply(translation, scaling)</code> scales, then moves.)",
    "Rotations are right-handed: <code>rotationZ(Math.PI / 2)</code> maps <code>[1, 0, 0]</code> to <code>[0, 1, 0]</code>; <code>rotationY</code> maps <code>[0, 0, 1]</code> to <code>[1, 0, 0]</code>; <code>rotationX</code> maps <code>[0, 1, 0]</code> to <code>[0, 0, 1]</code>.",
    "<code>transformPoint</code> treats the point as <code>[x, y, z, 1]</code>, multiplies, and divides by the resulting <code>w</code> (perspective divide). If <code>w</code> is exactly 0 throw a <code>RangeError</code>.",
    "<code>invert</code> returns the inverse matrix, or <code>null</code> when the matrix is singular (determinant with absolute value below <code>1e-12</code>).",
  ],
  example: `transformPoint(multiply(translation(10, 0, 0), scaling(2, 2, 2)), [1, 0, 0]) // [12, 0, 0]`,
  tags: ["webgl", "three.js", "matrices", "linear-algebra"],
  estimatedMins: 50,
  xp: 85,
  starterFiles: [
    {
      name: "mat4.js",
      lang: "js",
      code: `// mat4.js  (column-major: m[col * 4 + row])
function identity() {
  // your code here
}

function multiply(a, b) {
  // your code here
}

function translation(x, y, z) {
  // your code here
}

function scaling(x, y, z) {
  // your code here
}

function rotationX(rad) {
  // your code here
}

function rotationY(rad) {
  // your code here
}

function rotationZ(rad) {
  // your code here
}

function transformPoint(m, p) {
  // your code here
}

function transpose(m) {
  // your code here
}

function invert(m) {
  // your code here
}

module.exports = { identity, multiply, translation, scaling, rotationX, rotationY, rotationZ, transformPoint, transpose, invert };`,
    },
  ],
  testFile: {
    name: "mat4_test.js",
    lang: "test",
    code: `const { identity, multiply, translation, scaling, transformPoint } = require('./mat4');

test('multiply applies the right matrix first', () => {
  const m = multiply(translation(10, 0, 0), scaling(2, 2, 2));
  expect(transformPoint(m, [1, 0, 0])).toEqual([12, 0, 0]);
});

test('identity does nothing', () => {
  expect(transformPoint(identity(), [3, 4, 5])).toEqual([3, 4, 5]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Product of column-major matrices: <code>out[col * 4 + row] = sum over k of a[k * 4 + row] * b[col * 4 + k]</code>." },
    { order: 2, cost: 5, text: "Rotation about Z: columns are <code>(c, s, 0)</code> and <code>(-s, c, 0)</code>, i.e. <code>[c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]</code>. Y and X are the same pattern on other axes (Y has the sign flip on the opposite element)." },
    { order: 3, cost: 15, text: "Inverse: use the cofactor expansion with the twelve 2x2 sub-determinants of the top and bottom halves (the gl-matrix approach), compute <code>det</code> from them, and return <code>null</code> if it is ~0." },
  ],
  hiddenTests: [
    { name: "identity_and_immutability", code: `const id = identity();
assert(id.length === 16 && id[0] === 1 && id[5] === 1 && id[10] === 1 && id[15] === 1 && id[12] === 0, 'identity');
assert(identity() !== id, 'a new array each time');
const t = translation(1, 2, 3);
const copy = t.slice();
multiply(t, t); transpose(t); invert(t); transformPoint(t, [0, 0, 0]);
assert(JSON.stringify(t) === JSON.stringify(copy), 'inputs are not modified');` },
    { name: "translation_and_scaling", code: `const t = translation(5, -3, 2);
assert(t[12] === 5 && t[13] === -3 && t[14] === 2, 'translation lives in 12..14');
const p = transformPoint(t, [1, 1, 1]);
assert(p[0] === 6 && p[1] === -2 && p[2] === 3, 'moved: ' + p);
const q = transformPoint(scaling(2, 3, 4), [1, 1, 1]);
assert(q[0] === 2 && q[1] === 3 && q[2] === 4, 'scaled: ' + q);` },
    { name: "multiply_order_matters", code: `const a = transformPoint(multiply(translation(10, 0, 0), scaling(2, 2, 2)), [1, 0, 0]);
assert(a[0] === 12, 'scale first then translate: ' + a);
const b = transformPoint(multiply(scaling(2, 2, 2), translation(10, 0, 0)), [1, 0, 0]);
assert(b[0] === 22, 'translate first then scale: ' + b);
const id = multiply(identity(), translation(1, 2, 3));
assert(JSON.stringify(id) === JSON.stringify(translation(1, 2, 3)), 'identity is neutral');` },
    { name: "multiply_is_associative_for_a_chain", code: `const A = multiply(translation(1, 2, 3), rotationZ(0.3));
const B = multiply(scaling(2, 1, 0.5), rotationX(1.1));
const C = rotationY(-0.7);
const left = multiply(multiply(A, B), C);
const right = multiply(A, multiply(B, C));
for (let i = 0; i < 16; i++) assert(Math.abs(left[i] - right[i]) < 1e-9, 'element ' + i);` },
    { name: "rotations_are_right_handed", code: `const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9 && Math.abs(p[2] - q[2]) < 1e-9;
const h = Math.PI / 2;
assert(near(transformPoint(rotationZ(h), [1, 0, 0]), [0, 1, 0]), 'Z: x -> y: ' + transformPoint(rotationZ(h), [1, 0, 0]));
assert(near(transformPoint(rotationY(h), [0, 0, 1]), [1, 0, 0]), 'Y: z -> x: ' + transformPoint(rotationY(h), [0, 0, 1]));
assert(near(transformPoint(rotationX(h), [0, 1, 0]), [0, 0, 1]), 'X: y -> z: ' + transformPoint(rotationX(h), [0, 1, 0]));
assert(near(transformPoint(rotationZ(Math.PI), [1, 2, 3]), [-1, -2, 3]), 'half turn');` },
    { name: "rotation_then_translation_composes", code: `const m = multiply(translation(0, 0, 5), rotationY(Math.PI / 2));
const p = transformPoint(m, [0, 0, 1]);
assert(Math.abs(p[0] - 1) < 1e-9 && Math.abs(p[1]) < 1e-9 && Math.abs(p[2] - 5) < 1e-9, 'got ' + p);` },
    { name: "perspective_divide_and_zero_w", code: `const m = identity();
m[11] = -1;
m[15] = 0;
const p = transformPoint(m, [2, 4, -2]);
assert(Math.abs(p[0] - 1) < 1e-9 && Math.abs(p[1] - 2) < 1e-9 && Math.abs(p[2] + 1) < 1e-9, 'divided by w = -z: ' + p);
let err = null;
try { transformPoint(m, [1, 1, 0]); } catch (e) { err = e; }
assert(err instanceof RangeError, 'w = 0 throws RangeError');` },
    { name: "transpose", code: `const m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const t = transpose(m);
assert(JSON.stringify(t) === JSON.stringify([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]), 'got ' + JSON.stringify(t));
assert(JSON.stringify(transpose(t)) === JSON.stringify(m), 'twice is the original');` },
    { name: "invert_composites", code: `const m = multiply(multiply(translation(3, -2, 7), rotationY(0.8)), scaling(2, 3, 0.5));
const inv = invert(m);
assert(inv !== null, 'invertible');
const prod = multiply(m, inv);
const id = identity();
for (let i = 0; i < 16; i++) assert(Math.abs(prod[i] - id[i]) < 1e-9, 'm * inverse(m) element ' + i + ' = ' + prod[i]);
const back = transformPoint(inv, transformPoint(m, [1, 2, 3]));
assert(Math.abs(back[0] - 1) < 1e-9 && Math.abs(back[1] - 2) < 1e-9 && Math.abs(back[2] - 3) < 1e-9, 'round trip: ' + back);` },
    { name: "invert_known_cases_and_singular_matrices", code: `const inv = invert(translation(4, 5, 6));
assert(Math.abs(inv[12] + 4) < 1e-12 && Math.abs(inv[13] + 5) < 1e-12 && Math.abs(inv[14] + 6) < 1e-12, 'inverse translation');
const s = invert(scaling(2, 4, 8));
assert(Math.abs(s[0] - 0.5) < 1e-12 && Math.abs(s[5] - 0.25) < 1e-12 && Math.abs(s[10] - 0.125) < 1e-12, 'inverse scale');
assert(invert(scaling(0, 1, 1)) === null, 'flattening matrix is singular');
assert(invert(new Array(16).fill(0)) === null, 'zero matrix');
const proj = identity(); proj[11] = -1; proj[15] = 0;
assert(invert(proj) === null || Array.isArray(invert(proj)), 'does not crash on a projection-like matrix');` },
  ],
  solution: {
    code: `function identity() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

function translation(x, y, z) {
  const m = identity();
  m[12] = x; m[13] = y; m[14] = z;
  return m;
}

function scaling(x, y, z) {
  const m = identity();
  m[0] = x; m[5] = y; m[10] = z;
  return m;
}

function rotationX(rad) {
  const c = Math.cos(rad), s = Math.sin(rad);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

function rotationY(rad) {
  const c = Math.cos(rad), s = Math.sin(rad);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

function rotationZ(rad) {
  const c = Math.cos(rad), s = Math.sin(rad);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function transformPoint(m, p) {
  const [x, y, z] = p;
  const w = m[3] * x + m[7] * y + m[11] * z + m[15];
  if (w === 0) throw new RangeError('w is 0: point is at infinity');
  return [
    (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
    (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
    (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
  ];
}

function transpose(m) {
  const out = new Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) out[row * 4 + col] = m[col * 4 + row];
  }
  return out;
}

function invert(a) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  const b00 = a00 * a11 - a01 * a10;
  const b01 = a00 * a12 - a02 * a10;
  const b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11;
  const b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30;
  const b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31;
  const b10 = a21 * a33 - a23 * a31;
  const b11 = a22 * a33 - a23 * a32;

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det || Math.abs(det) < 1e-12) return null;
  det = 1 / det;

  return [
    (a11 * b11 - a12 * b10 + a13 * b09) * det,
    (a02 * b10 - a01 * b11 - a03 * b09) * det,
    (a31 * b05 - a32 * b04 + a33 * b03) * det,
    (a22 * b04 - a21 * b05 - a23 * b03) * det,
    (a12 * b08 - a10 * b11 - a13 * b07) * det,
    (a00 * b11 - a02 * b08 + a03 * b07) * det,
    (a32 * b02 - a30 * b05 - a33 * b01) * det,
    (a20 * b05 - a22 * b02 + a23 * b01) * det,
    (a10 * b10 - a11 * b08 + a13 * b06) * det,
    (a01 * b08 - a00 * b10 - a03 * b06) * det,
    (a30 * b04 - a31 * b02 + a33 * b00) * det,
    (a21 * b02 - a20 * b04 - a23 * b00) * det,
    (a11 * b07 - a10 * b09 - a12 * b06) * det,
    (a00 * b09 - a01 * b07 + a02 * b06) * det,
    (a31 * b01 - a30 * b03 - a32 * b00) * det,
    (a20 * b03 - a21 * b01 + a22 * b00) * det,
  ];
}

module.exports = { identity, multiply, translation, scaling, rotationX, rotationY, rotationZ, transformPoint, transpose, invert };`,
    explanation:
      "Multiplying matrices composes transforms, and because each point is multiplied by the right-hand matrix first, 'translate after scale' is written translation * scale. Column-major storage matches what WebGL's uniformMatrix4fv expects, which is why the translation sits at the end. Dividing by w after the multiply is the 'perspective divide' that makes distant things smaller; for plain affine matrices w is simply 1.",
  },
};
