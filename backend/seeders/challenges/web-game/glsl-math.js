export default {
  slug: "glsl-math",
  trackId: "web-game",
  layerId: "web-game-7",
  type: "CODE",
  difficulty: "easy",
  title: "GLSL built-ins: mix, step, smoothstep, fract, mod",
  summary: "Re-implement the shader math functions every GLSL programmer uses, on single numbers and componentwise on vectors.",
  description:
    "Shaders are built from a handful of tiny functions: <code>mix</code> blends colours, <code>step</code> and <code>smoothstep</code> make masks and soft edges, <code>fract</code> and <code>mod</code> tile patterns. Some behave differently from their JavaScript cousins (GLSL <code>mod</code> is not <code>%</code>), which is exactly where shader bugs come from.",
  task:
    "Write <code>mix(a, b, t)</code>, <code>step(edge, x)</code>, <code>smoothstep(edge0, edge1, x)</code>, <code>fract(x)</code>, <code>mod(x, y)</code>, <code>clamp(x, lo, hi)</code> and <code>sign(x)</code>. Arguments are numbers or arrays of numbers (vectors).",
  constraints: [
    "Functions work componentwise. If any argument is an array, the result is an array of that length. A scalar argument is broadcast to every component (for example <code>mix([0,0], [10,20], 0.5)</code> or <code>clamp([5,-5], 0, 1)</code>). Two arrays of different lengths throw a <code>RangeError</code>.",
    "<code>mix = a * (1 - t) + b * t</code> (no clamping of <code>t</code>). <code>step = x &lt; edge ? 0 : 1</code>. <code>clamp = min(max(x, lo), hi)</code>. <code>sign</code> is -1, 0 or 1 (and 0 for 0).",
    "<code>smoothstep</code>: <code>t = clamp((x - edge0) / (edge1 - edge0), 0, 1)</code>, result <code>t * t * (3 - 2 * t)</code>. If <code>edge0 === edge1</code> it behaves like <code>step(edge0, x)</code> instead of dividing by zero.",
    "<code>fract(x) = x - floor(x)</code> (so <code>fract(-0.25)</code> is <code>0.75</code>). <code>mod(x, y) = x - y * floor(x / y)</code>: the result takes the sign of <code>y</code>, unlike JavaScript's <code>%</code>.",
    "Never mutate the input arrays; always return new ones.",
  ],
  example: `smoothstep(0, 1, 0.5) // 0.5;  mod(-1, 3) // 2 (JavaScript's -1 % 3 is -1)`,
  tags: ["glsl", "shaders", "math", "vectors"],
  estimatedMins: 25,
  xp: 35,
  starterFiles: [
    {
      name: "glslMath.js",
      lang: "js",
      code: `// glslMath.js
function mix(a, b, t) {
  // your code here
}

function step(edge, x) {
  // your code here
}

function smoothstep(edge0, edge1, x) {
  // your code here
}

function fract(x) {
  // your code here
}

function mod(x, y) {
  // your code here
}

function clamp(x, lo, hi) {
  // your code here
}

function sign(x) {
  // your code here
}

module.exports = { mix, step, smoothstep, fract, mod, clamp, sign };`,
    },
  ],
  testFile: {
    name: "glslMath_test.js",
    lang: "test",
    code: `const { mix, mod } = require('./glslMath');

test('mix blends', () => {
  expect(mix(0, 10, 0.25)).toBe(2.5);
});

test('mod follows the divisor sign', () => {
  expect(mod(-1, 3)).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write one helper, <code>map(fn, ...args)</code>, that finds the vector length (if any), checks the arrays agree, and calls <code>fn</code> once per component with broadcast scalars." },
    { order: 2, cost: 5, text: "Then every function is a one-line scalar formula passed to <code>map</code>. <code>smoothstep</code> needs its edge case handled inside the scalar function." },
    { order: 3, cost: 15, text: "<code>Math.sign</code> returns <code>-0</code> for <code>-0</code>; add <code>+ 0</code> or compare with <code>0</code> so <code>sign(-0)</code> is exactly 0." },
  ],
  hiddenTests: [
    { name: "mix_scalars_and_extrapolation", code: `assert(mix(0, 10, 0.25) === 2.5, 'quarter');
assert(mix(2, 4, 0) === 2 && mix(2, 4, 1) === 4, 'endpoints');
assert(mix(0, 10, 2) === 20, 't is not clamped: ' + mix(0, 10, 2));
assert(mix(5, 5, 0.7) === 5, 'equal endpoints');` },
    { name: "mix_vectors_and_broadcast", code: `const r = mix([0, 0, 0], [10, 20, 30], 0.5);
assert(JSON.stringify(r) === '[5,10,15]', 'scalar t: ' + JSON.stringify(r));
const s = mix([0, 0], [10, 100], [0, 0.5]);
assert(JSON.stringify(s) === '[0,50]', 'vector t: ' + JSON.stringify(s));
const t = mix(0, [10, 20], 0.5);
assert(JSON.stringify(t) === '[5,10]', 'scalar a broadcast: ' + JSON.stringify(t));` },
    { name: "step", code: `assert(step(0.5, 0.4) === 0 && step(0.5, 0.5) === 1 && step(0.5, 0.9) === 1, 'edge is inclusive on the high side');
assert(JSON.stringify(step(0.5, [0.1, 0.5, 0.9])) === '[0,1,1]', 'vector x');
assert(JSON.stringify(step([1, 2], [1.5, 1.5])) === '[1,0]', 'vector edge');` },
    { name: "smoothstep_curve", code: `const near = (a, b) => Math.abs(a - b) < 1e-12;
assert(smoothstep(0, 1, 0) === 0 && smoothstep(0, 1, 1) === 1, 'endpoints');
assert(near(smoothstep(0, 1, 0.5), 0.5), 'midpoint');
assert(near(smoothstep(0, 1, 0.25), 0.15625), 'quarter: ' + smoothstep(0, 1, 0.25));
assert(smoothstep(0, 1, -3) === 0 && smoothstep(0, 1, 7) === 1, 'clamped outside');
assert(near(smoothstep(10, 20, 15), 0.5), 'shifted edges');` },
    { name: "smoothstep_degenerate_edges_and_vectors", code: `assert(smoothstep(1, 1, 0.5) === 0 && smoothstep(1, 1, 1) === 1 && smoothstep(1, 1, 2) === 1, 'equal edges act like step, never NaN');
const r = smoothstep(0, 1, [0, 0.5, 1]);
assert(JSON.stringify(r) === '[0,0.5,1]', 'vector x: ' + JSON.stringify(r));` },
    { name: "fract", code: `const near = (a, b) => Math.abs(a - b) < 1e-12;
assert(near(fract(1.75), 0.75) && fract(3) === 0, 'positive');
assert(near(fract(-0.25), 0.75) && near(fract(-2.5), 0.5), 'negative numbers wrap upward: ' + fract(-0.25));
const r = fract([0.5, -0.5, 2]);
assert(JSON.stringify(r) === '[0.5,0.5,0]', 'vector: ' + JSON.stringify(r));` },
    { name: "mod_is_not_the_remainder_operator", code: `assert(mod(7, 3) === 1 && mod(6, 3) === 0, 'positive');
assert(mod(-1, 3) === 2, 'JavaScript gives -1, GLSL gives 2: ' + mod(-1, 3));
assert(mod(1, -3) === -2, 'the result takes the divisor sign: ' + mod(1, -3));
assert(Math.abs(mod(5.5, 2) - 1.5) < 1e-12, 'fractions');
assert(JSON.stringify(mod([5, -5, 0], 4)) === '[1,3,0]', 'vector with scalar divisor: ' + JSON.stringify(mod([5, -5, 0], 4)));` },
    { name: "clamp_and_sign", code: `assert(clamp(5, 0, 1) === 1 && clamp(-5, 0, 1) === 0 && clamp(0.3, 0, 1) === 0.3, 'scalar clamp');
assert(JSON.stringify(clamp([5, -5, 0.5], 0, 1)) === '[1,0,0.5]', 'vector with scalar bounds');
assert(JSON.stringify(clamp([5, -5], [0, 0], [3, 3])) === '[3,0]', 'vector bounds');
assert(sign(-4) === -1 && sign(9) === 1, 'signs');
assert(Object.is(sign(0), 0) && Object.is(sign(-0), 0), 'zero is plain 0: ' + Object.is(sign(-0), 0));
assert(JSON.stringify(sign([-2, 0, 3])) === '[-1,0,1]', 'vector sign');` },
    { name: "length_mismatch_and_purity", code: `let err = null;
try { mix([1, 2], [1, 2, 3], 0.5); } catch (e) { err = e; }
assert(err instanceof RangeError, 'different lengths throw RangeError');
const a = [0, 0], b = [10, 10];
const r = mix(a, b, 0.5);
assert(r !== a && r !== b && a[0] === 0 && b[0] === 10, 'new array, inputs untouched');` },
  ],
  solution: {
    code: `function map(fn, ...args) {
  let length = null;
  for (const arg of args) {
    if (Array.isArray(arg)) {
      if (length !== null && arg.length !== length) throw new RangeError('vector length mismatch');
      length = arg.length;
    }
  }
  if (length === null) return fn(...args);
  const out = [];
  for (let i = 0; i < length; i++) {
    out.push(fn(...args.map((arg) => (Array.isArray(arg) ? arg[i] : arg))));
  }
  return out;
}

const clamp1 = (x, lo, hi) => Math.min(Math.max(x, lo), hi);

const mix = (a, b, t) => map((x, y, k) => x * (1 - k) + y * k, a, b, t);
const step = (edge, x) => map((e, v) => (v < e ? 0 : 1), edge, x);
const smoothstep = (edge0, edge1, x) =>
  map((e0, e1, v) => {
    if (e0 === e1) return v < e0 ? 0 : 1;
    const t = clamp1((v - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  }, edge0, edge1, x);
const fract = (x) => map((v) => v - Math.floor(v), x);
const mod = (x, y) => map((v, d) => v - d * Math.floor(v / d), x, y);
const clamp = (x, lo, hi) => map(clamp1, x, lo, hi);
const sign = (x) => map((v) => (v > 0 ? 1 : v < 0 ? -1 : 0), x);

module.exports = { mix, step, smoothstep, fract, mod, clamp, sign };`,
    explanation:
      "GLSL functions are componentwise with scalar broadcast, so one map helper that lines up the vector arguments gives every function that behaviour for free. mod is defined through floor, which is why the sign follows the divisor and why it tiles correctly for negative coordinates, where JavaScript's % does not. smoothstep is the clamped cubic Hermite curve; guarding equal edges avoids a divide by zero.",
  },
};
