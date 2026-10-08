export default {
  slug: "project-point",
  trackId: "web-game",
  layerId: "web-game-5",
  type: "CODE",
  difficulty: "hard",
  title: "Camera: lookAt, perspective and screen projection",
  summary: "Build the view and projection matrices a Three.js camera uses, then project a 3D world point to pixel coordinates.",
  description:
    "To draw a 3D point the GPU runs it through the view matrix (world to camera space), the projection matrix (camera space to clip space), a divide by <code>w</code>, and finally a viewport mapping to pixels. Knowing this pipeline is how you place a name tag over a character, or detect that something is off-screen.",
  task:
    "Write <code>perspective(fovY, aspect, near, far)</code>, <code>lookAt(eye, target, up)</code> and <code>project(point, viewProj, width, height)</code>. Matrices are 16-number arrays in COLUMN-MAJOR order (<code>m[col * 4 + row]</code>), right-handed, camera looking down -Z, clip space depth in <code>[-1, 1]</code> (OpenGL / Three.js convention).",
  constraints: [
    "<code>perspective</code> takes <code>fovY</code> in radians and returns the standard matrix with <code>f = 1 / tan(fovY / 2)</code>: <code>[f / aspect, 0, 0, 0,  0, f, 0, 0,  0, 0, (far + near) / (near - far), -1,  0, 0, 2 * far * near / (near - far), 0]</code>.",
    "<code>lookAt</code> returns the VIEW matrix. With <code>z = normalize(eye - target)</code>, <code>x = normalize(cross(up, z))</code>, <code>y = cross(z, x)</code> its columns are <code>[x.x, y.x, z.x, 0,  x.y, y.y, z.y, 0,  x.z, y.z, z.z, 0,  -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]</code>.",
    "<code>project(point, viewProj, width, height)</code> multiplies <code>[x, y, z, 1]</code> by <code>viewProj</code> to get clip coordinates. If clip <code>w &lt;= 0</code> the point is behind the camera: return <code>{ x: null, y: null, depth: null, visible: false }</code>.",
    "Otherwise divide by <code>w</code> to get NDC, then <code>x = (ndcX * 0.5 + 0.5) * width</code> and <code>y = (1 - (ndcY * 0.5 + 0.5)) * height</code> (screen Y grows downward) and <code>depth = ndcZ</code>. <code>visible</code> is true when ndcX, ndcY and ndcZ are all within <code>[-1, 1]</code> inclusive.",
  ],
  example: `project([0, 0, 0], viewProj, 800, 600) // { x: 400, y: 300, depth: ..., visible: true } for a camera looking at the origin`,
  tags: ["three.js", "camera", "projection", "webgl"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "camera.js",
      lang: "js",
      code: `// camera.js
function perspective(fovY, aspect, near, far) {
  // your code here
}

function lookAt(eye, target, up) {
  // your code here
}

function project(point, viewProj, width, height) {
  // your code here
}

module.exports = { perspective, lookAt, project };`,
    },
  ],
  testFile: {
    name: "camera_test.js",
    lang: "test",
    code: `const { perspective } = require('./camera');

test('perspective for a 90 degree fov', () => {
  const m = perspective(Math.PI / 2, 1, 1, 3);
  expect(m[11]).toBe(-1);
  expect(Math.abs(m[10] - -2)).toBeLessThan(1e-9);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write small vector helpers (<code>sub</code>, <code>cross</code>, <code>dot</code>, <code>normalize</code>) first; both <code>lookAt</code> and the projection use them." },
    { order: 2, cost: 5, text: "<code>project</code> multiplies by <code>viewProj</code> manually: <code>clip.x = m[0]*x + m[4]*y + m[8]*z + m[12]</code>, <code>clip.w = m[3]*x + m[7]*y + m[11]*z + m[15]</code>." },
    { order: 3, cost: 15, text: "The viewProj matrix is built as <code>projection * view</code> (view is applied first). The tests multiply them for you, so only the three functions are yours." },
  ],
  hiddenTests: [
    { name: "perspective_matrix_values", code: `const m = perspective(Math.PI / 2, 2, 1, 3);
const near = (a, b) => Math.abs(a - b) < 1e-9;
assert(near(m[0], 0.5) && near(m[5], 1), 'f / aspect and f: ' + m[0] + ',' + m[5]);
assert(near(m[10], -2) && near(m[11], -1) && near(m[14], -3), 'depth terms: ' + m[10] + ',' + m[11] + ',' + m[14]);
assert(m[15] === 0 && m[1] === 0 && m[4] === 0 && m[12] === 0, 'zeros elsewhere');` },
    { name: "narrower_fov_zooms_in", code: `const wide = perspective(Math.PI / 2, 1, 0.1, 100);
const narrow = perspective(Math.PI / 4, 1, 0.1, 100);
assert(narrow[5] > wide[5], 'a smaller fov gives a larger focal factor');
assert(Math.abs(narrow[5] - 1 / Math.tan(Math.PI / 8)) < 1e-9, 'f = 1 / tan(fov / 2)');` },
    { name: "look_at_from_the_front", code: `const v = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
const near = (a, b) => Math.abs(a - b) < 1e-9;
const id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -5, 1];
for (let i = 0; i < 16; i++) assert(near(v[i], id[i]), 'element ' + i + ' = ' + v[i]);` },
    { name: "look_at_from_the_side", code: `const v = lookAt([5, 0, 0], [0, 0, 0], [0, 1, 0]);
const apply = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
const near = (a, b) => Math.abs(a - b) < 1e-9;
const o = apply(v, [0, 0, 0]);
assert(near(o[0], 0) && near(o[1], 0) && near(o[2], -5), 'the target is 5 units straight ahead: ' + o);
const side = apply(v, [0, 0, -1]);
assert(near(side[0], 1) && near(side[2], -5), 'world -z is to the camera right: ' + side);
const up = apply(v, [0, 2, 0]);
assert(near(up[1], 2), 'up stays up: ' + up);` },
    { name: "look_at_rotation_is_orthonormal", code: `const v = lookAt([3, 4, 5], [-1, 0.5, 2], [0, 1, 0]);
const col = (c) => [v[c * 4], v[c * 4 + 1], v[c * 4 + 2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const rows = [[v[0], v[4], v[8]], [v[1], v[5], v[9]], [v[2], v[6], v[10]]];
for (let i = 0; i < 3; i++) {
  assert(Math.abs(dot(rows[i], rows[i]) - 1) < 1e-9, 'unit length axis ' + i);
  for (let j = i + 1; j < 3; j++) assert(Math.abs(dot(rows[i], rows[j])) < 1e-9, 'axes ' + i + ',' + j + ' are perpendicular');
}
assert(v[3] === 0 && v[7] === 0 && v[11] === 0 && v[15] === 1, 'affine bottom row');` },
    { name: "project_centre_of_the_screen", code: `const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const vp = mul(perspective(Math.PI / 2, 1, 0.1, 100), lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]));
const p = project([0, 0, 0], vp, 100, 100);
assert(p.visible === true, 'visible');
assert(Math.abs(p.x - 50) < 1e-9 && Math.abs(p.y - 50) < 1e-9, 'centre: ' + p.x + ',' + p.y);
assert(p.depth > -1 && p.depth < 1, 'depth inside clip range: ' + p.depth);` },
    { name: "project_axes_and_screen_y_direction", code: `const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const vp = mul(perspective(Math.PI / 2, 1, 0.1, 100), lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]));
const right = project([2.5, 0, 0], vp, 100, 100);
assert(Math.abs(right.x - 75) < 1e-9 && Math.abs(right.y - 50) < 1e-9, 'half way to the right edge: ' + right.x);
const up = project([0, 2.5, 0], vp, 100, 100);
assert(Math.abs(up.y - 25) < 1e-9, 'up in the world is a SMALLER screen y: ' + up.y);
const wide = project([2.5, 0, 0], vp, 200, 100);
assert(Math.abs(wide.x - 150) < 1e-9, 'x scales with the viewport width: ' + wide.x);` },
    { name: "project_visibility", code: `const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const vp = mul(perspective(Math.PI / 2, 1, 0.1, 100), lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]));
assert(project([4.99, 0, 0], vp, 100, 100).visible === true, 'just inside the right edge');
assert(project([5.01, 0, 0], vp, 100, 100).visible === false, 'just outside the right edge');
assert(project([6, 0, 0], vp, 100, 100).visible === false, 'off to the right');
assert(project([0, -6, 0], vp, 100, 100).visible === false, 'below');
assert(project([0, 0, -100], vp, 100, 100).visible === false, 'beyond the far plane');
const off = project([6, 0, 0], vp, 100, 100);
assert(off.x > 100 && typeof off.y === 'number', 'off-screen points still report where they would land: ' + off.x);` },
    { name: "points_behind_the_camera", code: `const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const vp = mul(perspective(Math.PI / 2, 1, 0.1, 100), lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]));
const behind = project([0, 0, 10], vp, 100, 100);
assert(behind.visible === false && behind.x === null && behind.y === null && behind.depth === null, 'got ' + JSON.stringify(behind));
const atEye = project([0, 0, 5], vp, 100, 100);
assert(atEye.visible === false && atEye.x === null, 'w = 0 at the eye is not projectable');` },
    { name: "aspect_ratio_changes_horizontal_extent", code: `const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const vp = mul(perspective(Math.PI / 2, 2, 0.1, 100), lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]));
assert(project([8, 0, 0], vp, 200, 100).visible === true, 'a 2:1 camera sees twice as far sideways (half-width 10 at distance 5)');
assert(project([11, 0, 0], vp, 200, 100).visible === false, 'but not unlimited');
assert(project([0, 6, 0], vp, 200, 100).visible === false, 'vertical extent unchanged (5 units)');` },
  ],
  solution: {
    code: `function perspective(fovY, aspect, near, far) {
  const f = 1 / Math.tan(fovY / 2);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ];
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (v) => {
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
};

function lookAt(eye, target, up) {
  const z = normalize(sub(eye, target));
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  return [
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
  ];
}

function project(point, m, width, height) {
  const [x, y, z] = point;
  const cx = m[0] * x + m[4] * y + m[8] * z + m[12];
  const cy = m[1] * x + m[5] * y + m[9] * z + m[13];
  const cz = m[2] * x + m[6] * y + m[10] * z + m[14];
  const cw = m[3] * x + m[7] * y + m[11] * z + m[15];
  if (cw <= 0) return { x: null, y: null, depth: null, visible: false };
  const nx = cx / cw;
  const ny = cy / cw;
  const nz = cz / cw;
  return {
    x: (nx * 0.5 + 0.5) * width,
    y: (1 - (ny * 0.5 + 0.5)) * height,
    depth: nz,
    visible: Math.abs(nx) <= 1 && Math.abs(ny) <= 1 && Math.abs(nz) <= 1,
  };
}

module.exports = { perspective, lookAt, project };`,
    explanation:
      "lookAt builds an orthonormal camera basis (right, up, back) and expresses the world relative to it; because the camera looks down -Z, the 'back' axis is eye minus target. The projection matrix copies -z into w, so the later divide by w is what shrinks distant objects. A negative w means the point is behind the camera: the divide would flip it onto the screen, which is why that case must be rejected before projecting.",
  },
};
