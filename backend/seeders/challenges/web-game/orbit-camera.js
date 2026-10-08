export default {
  slug: "orbit-camera",
  trackId: "web-game",
  layerId: "web-game-5",
  type: "CODE",
  difficulty: "med",
  title: "Orbit camera controls",
  summary: "The math behind Three.js OrbitControls: spherical coordinates around a target with yaw wrapping, pitch clamping, zoom limits and panning.",
  description:
    "Drag to rotate around the model, scroll to zoom, right-drag to pan: <code>OrbitControls</code> is a camera described by three numbers (yaw, pitch, radius) around a target point. Converting those spherical coordinates to a position, and clamping them so the camera never flips over the poles, is the whole trick.",
  task:
    "Write <code>position(state)</code>, <code>orbit(state, dYaw, dPitch)</code>, <code>zoom(state, factor, limits)</code> and <code>pan(state, dx, dy)</code> over a state <code>{ target: [x, y, z], yaw, pitch, radius }</code> (angles in radians). Never mutate the input state; return a new one.",
  constraints: [
    "<code>position</code> returns <code>[tx + r * cos(pitch) * sin(yaw), ty + r * sin(pitch), tz + r * cos(pitch) * cos(yaw)]</code>. With yaw 0 and pitch 0 the camera sits on the +Z side of the target looking at it.",
    "<code>orbit</code> adds <code>dYaw</code> and <code>dPitch</code>. Yaw is wrapped into <code>[-PI, PI)</code> (so it never grows without bound); pitch is clamped to <code>[-(PI / 2 - 0.01), PI / 2 - 0.01]</code> so the camera cannot flip over the poles.",
    "<code>zoom(state, factor, { min = 0.1, max = 1000 })</code> multiplies the radius by <code>factor</code> (scroll wheel zoom is multiplicative: <code>0.9</code> zooms in, <code>1.1</code> out) and clamps it to <code>[min, max]</code>.",
    "<code>pan(state, dx, dy)</code> moves the TARGET along the camera's screen axes: right vector <code>[cos(yaw), 0, -sin(yaw)]</code> and up vector <code>[-sin(pitch) * sin(yaw), cos(pitch), -sin(pitch) * cos(yaw)]</code>, so <code>target += right * dx + up * dy</code>. Radius, yaw and pitch stay unchanged.",
  ],
  example: `position({ target: [1, 2, 3], yaw: 0, pitch: 0, radius: 5 }) // [1, 2, 8]`,
  tags: ["three.js", "orbitcontrols", "camera", "spherical-coordinates"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "orbitCamera.js",
      lang: "js",
      code: `// orbitCamera.js
function position(state) {
  // your code here
}

function orbit(state, dYaw, dPitch) {
  // your code here
}

function zoom(state, factor, limits = {}) {
  // your code here
}

function pan(state, dx, dy) {
  // your code here
}

module.exports = { position, orbit, zoom, pan };`,
    },
  ],
  testFile: {
    name: "orbitCamera_test.js",
    lang: "test",
    code: `const { position } = require('./orbitCamera');

test('camera behind the target', () => {
  expect(position({ target: [1, 2, 3], yaw: 0, pitch: 0, radius: 5 })).toEqual([1, 2, 8]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Wrap an angle into [-PI, PI) with <code>((a + PI) % (2 * PI) + 2 * PI) % (2 * PI) - PI</code>: the double modulo handles negative numbers correctly." },
    { order: 2, cost: 5, text: "Return new objects (<code>{ ...state, yaw, pitch }</code>) and copy the <code>target</code> array too so callers can't mutate it through the state." },
    { order: 3, cost: 15, text: "The pan 'up' vector is the derivative of the position with respect to pitch: that's why it has the <code>-sin(pitch)</code> factors and is perpendicular to the view direction." },
  ],
  hiddenTests: [
    { name: "position_on_the_axes", code: `const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9 && Math.abs(p[2] - q[2]) < 1e-9;
const base = { target: [1, 2, 3], yaw: 0, pitch: 0, radius: 5 };
assert(near(position(base), [1, 2, 8]), 'front: ' + position(base));
assert(near(position({ ...base, yaw: Math.PI / 2 }), [6, 2, 3]), 'quarter turn: ' + position({ ...base, yaw: Math.PI / 2 }));
assert(near(position({ ...base, pitch: Math.PI / 2 - 0.0001, radius: 5 }), [1, 7, 3.0005]) || position({ ...base, pitch: Math.PI / 3 })[1] > 6, 'looking from above raises y');
assert(near(position({ ...base, pitch: Math.PI / 6 }), [1, 4.5, 3 + 5 * Math.cos(Math.PI / 6)]), 'pitch 30 degrees');` },
    { name: "distance_to_the_target_is_the_radius", code: `const s = { target: [2, -1, 4], yaw: 1.3, pitch: 0.7, radius: 9 };
const p = position(s);
const d = Math.hypot(p[0] - 2, p[1] + 1, p[2] - 4);
assert(Math.abs(d - 9) < 1e-9, 'distance ' + d);` },
    { name: "orbit_adds_angles_and_does_not_mutate", code: `const s = { target: [0, 0, 0], yaw: 0.5, pitch: 0.2, radius: 3 };
const copy = JSON.stringify(s);
const n = orbit(s, 0.25, 0.1);
assert(Math.abs(n.yaw - 0.75) < 1e-12 && Math.abs(n.pitch - 0.3) < 1e-12 && n.radius === 3, 'got ' + JSON.stringify(n));
assert(JSON.stringify(s) === copy, 'input unchanged');
assert(n !== s && n.target !== s.target, 'new state and a copied target');` },
    { name: "yaw_wraps_into_minus_pi_to_pi", code: `const s = { target: [0, 0, 0], yaw: 3, pitch: 0, radius: 1 };
const a = orbit(s, 1, 0);
assert(Math.abs(a.yaw - (4 - 2 * Math.PI)) < 1e-9, 'wrapped forward: ' + a.yaw);
const b = orbit({ ...s, yaw: -3 }, -1, 0);
assert(Math.abs(b.yaw - (-4 + 2 * Math.PI)) < 1e-9, 'wrapped backward: ' + b.yaw);
const c = orbit({ ...s, yaw: 0 }, 10 * Math.PI, 0);
assert(c.yaw >= -Math.PI && c.yaw < Math.PI && Math.abs(c.yaw) < 1e-9, 'many turns: ' + c.yaw);
const d = orbit({ ...s, yaw: 0 }, Math.PI, 0);
assert(Math.abs(d.yaw - -Math.PI) < 1e-9, 'PI itself wraps to -PI (half-open range): ' + d.yaw);` },
    { name: "pitch_is_clamped_below_the_poles", code: `const max = Math.PI / 2 - 0.01;
const s = { target: [0, 0, 0], yaw: 0, pitch: 0, radius: 1 };
assert(Math.abs(orbit(s, 0, 5).pitch - max) < 1e-12, 'upper clamp');
assert(Math.abs(orbit(s, 0, -5).pitch + max) < 1e-12, 'lower clamp');
assert(Math.abs(orbit(s, 0, 0.5).pitch - 0.5) < 1e-12, 'unclamped values pass through');` },
    { name: "zoom_is_multiplicative_and_clamped", code: `const s = { target: [0, 0, 0], yaw: 0, pitch: 0, radius: 10 };
assert(Math.abs(zoom(s, 0.9).radius - 9) < 1e-12 && Math.abs(zoom(s, 1.1).radius - 11) < 1e-12, 'scroll zoom');
assert(zoom(s, 0.0001).radius === 0.1, 'default min');
assert(zoom(s, 1e9).radius === 1000, 'default max');
assert(zoom(s, 0.1, { min: 2, max: 20 }).radius === 2, 'custom min');
assert(zoom(s, 5, { min: 2, max: 20 }).radius === 20, 'custom max');
assert(s.radius === 10, 'input unchanged');` },
    { name: "pan_moves_the_target_in_screen_space", code: `const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9 && Math.abs(p[2] - q[2]) < 1e-9;
const front = { target: [0, 0, 0], yaw: 0, pitch: 0, radius: 5 };
assert(near(pan(front, 2, 3).target, [2, 3, 0]), 'facing the front: ' + pan(front, 2, 3).target);
const side = { target: [0, 0, 0], yaw: Math.PI / 2, pitch: 0, radius: 5 };
assert(near(pan(side, 1, 0).target, [0, 0, -1]), 'camera on the +X side: right is -Z: ' + pan(side, 1, 0).target);
const tilted = { target: [0, 0, 0], yaw: 0, pitch: Math.PI / 4, radius: 5 };
const t = pan(tilted, 0, 1).target;
assert(near(t, [0, Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4)]), 'screen-up tilts with the pitch: ' + t);` },
    { name: "pan_keeps_everything_else_and_does_not_mutate", code: `const s = { target: [1, 1, 1], yaw: 0.4, pitch: 0.3, radius: 7 };
const n = pan(s, 1, 1);
assert(n.yaw === 0.4 && n.pitch === 0.3 && n.radius === 7, 'angles and radius untouched');
assert(JSON.stringify(s.target) === '[1,1,1]', 'input target untouched');
const p0 = position(s), p1 = position(n);
assert(Math.abs(Math.hypot(p1[0] - n.target[0], p1[1] - n.target[1], p1[2] - n.target[2]) - 7) < 1e-9, 'still orbiting at the same radius around the new target');
const dir = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
const move = [n.target[0] - 1, n.target[1] - 1, n.target[2] - 1];
assert(Math.abs(dir[0] - move[0]) < 1e-9 && Math.abs(dir[1] - move[1]) < 1e-9 && Math.abs(dir[2] - move[2]) < 1e-9, 'the camera moves by exactly the same offset as the target');` },
  ],
  solution: {
    code: `const MAX_PITCH = Math.PI / 2 - 0.01;
const TWO_PI = Math.PI * 2;

const wrap = (a) => ((((a + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function position(s) {
  const { target, yaw, pitch, radius } = s;
  return [
    target[0] + radius * Math.cos(pitch) * Math.sin(yaw),
    target[1] + radius * Math.sin(pitch),
    target[2] + radius * Math.cos(pitch) * Math.cos(yaw),
  ];
}

function orbit(s, dYaw, dPitch) {
  return {
    ...s,
    target: [...s.target],
    yaw: wrap(s.yaw + dYaw),
    pitch: clamp(s.pitch + dPitch, -MAX_PITCH, MAX_PITCH),
  };
}

function zoom(s, factor, limits = {}) {
  const { min = 0.1, max = 1000 } = limits;
  return { ...s, target: [...s.target], radius: clamp(s.radius * factor, min, max) };
}

function pan(s, dx, dy) {
  const { yaw, pitch } = s;
  const right = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const up = [-Math.sin(pitch) * Math.sin(yaw), Math.cos(pitch), -Math.sin(pitch) * Math.cos(yaw)];
  return {
    ...s,
    target: [
      s.target[0] + right[0] * dx + up[0] * dy,
      s.target[1] + right[1] * dx + up[1] * dy,
      s.target[2] + right[2] * dx + up[2] * dy,
    ],
  };
}

module.exports = { position, orbit, zoom, pan };`,
    explanation:
      "The camera is stored as spherical coordinates around a target, which makes rotate, zoom and pan three independent one-line operations; the position is derived only when needed. Clamping the pitch just short of 90 degrees avoids the singularity where 'up' becomes undefined and the view flips. Panning moves the target (not the camera) along the camera's own right and up axes, so the camera follows and the orbit radius is preserved.",
  },
};
