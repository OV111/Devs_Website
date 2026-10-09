export default {
  slug: "value-noise",
  trackId: "web-game",
  layerId: "web-game-7",
  type: "CODE",
  difficulty: "hard",
  title: "Value noise and fractal noise",
  summary: "Build the procedural-texture workhorse: a deterministic integer hash, smoothly interpolated 2D value noise, and fractal (fBm) layering.",
  description:
    "Clouds, terrain, fire and marble in shaders all start from noise: random values on an integer grid, smoothly blended in between. Stacking several scaled copies (octaves) gives the natural, detailed look called fractal Brownian motion. Everything must be deterministic: the same coordinates always give the same value, with no <code>Math.random</code>.",
  task:
    "Write <code>hash(ix, iy)</code>, <code>noise(x, y)</code> and <code>fbm(x, y, options)</code>.",
  constraints: [
    "<code>hash(ix, iy)</code> takes integers and returns a float in <code>[0, 1)</code> using exactly this integer algorithm: <code>h = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263)) | 0; h = Math.imul(h ^ (h &gt;&gt;&gt; 13), 1274126177); h = h ^ (h &gt;&gt;&gt; 16); return (h &gt;&gt;&gt; 0) / 4294967296;</code>",
    "<code>noise(x, y)</code> is value noise: take <code>x0 = floor(x)</code>, <code>y0 = floor(y)</code>, the fractions <code>fx = x - x0</code>, <code>fy = y - y0</code>, fade them with <code>f(t) = t * t * (3 - 2 * t)</code>, read the four corner hashes <code>hash(x0, y0)</code>, <code>hash(x0 + 1, y0)</code>, <code>hash(x0, y0 + 1)</code>, <code>hash(x0 + 1, y0 + 1)</code>, interpolate linearly along x with the faded <code>fx</code> on both rows, then along y with the faded <code>fy</code>. At integer coordinates it equals <code>hash</code>. Works for negative coordinates.",
    "<code>fbm(x, y, { octaves = 4, lacunarity = 2, gain = 0.5 })</code> sums <code>amplitude * noise(x * frequency, y * frequency)</code> over the octaves, starting at amplitude 1 and frequency 1, multiplying amplitude by <code>gain</code> and frequency by <code>lacunarity</code> after each octave, and divides by the sum of the amplitudes so the result stays in <code>[0, 1]</code>.",
    "<code>octaves</code> must be an integer &gt;= 1, otherwise throw a <code>RangeError</code>.",
  ],
  example: `noise(0.5, 0.5) // the average of the four surrounding corner hashes`,
  tags: ["glsl", "procedural", "noise", "fbm"],
  estimatedMins: 40,
  xp: 75,
  starterFiles: [
    {
      name: "valueNoise.js",
      lang: "js",
      code: `// valueNoise.js
function hash(ix, iy) {
  // your code here
}

function noise(x, y) {
  // your code here
}

function fbm(x, y, options = {}) {
  // your code here
}

module.exports = { hash, noise, fbm };`,
    },
  ],
  testFile: {
    name: "valueNoise_test.js",
    lang: "test",
    code: `const { hash, noise } = require('./valueNoise');

test('noise equals the hash on the lattice', () => {
  expect(noise(3, 4)).toBe(hash(3, 4));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Copy the hash recipe exactly: <code>Math.imul</code> is 32-bit integer multiplication, and <code>&gt;&gt;&gt; 0</code> turns the final signed result into an unsigned number before dividing." },
    { order: 2, cost: 5, text: "Write a tiny <code>lerp(a, b, t)</code> and a <code>fade(t)</code>. The 2D interpolation is <code>lerp(lerp(h00, h10, u), lerp(h01, h11, u), v)</code>." },
    { order: 3, cost: 15, text: "For <code>fbm</code> keep a running <code>sum</code> and <code>norm</code>, and update <code>amp</code> and <code>freq</code> at the end of each loop iteration." },
  ],
  hiddenTests: [
    { name: "hash_known_values", code: `const near = (a, b) => Math.abs(a - b) < 1e-12;
assert(hash(0, 0) === 0, 'origin: ' + hash(0, 0));
assert(near(hash(1, 0), 0.5081244609318674), 'hash(1, 0) = ' + hash(1, 0));
assert(near(hash(0, 1), 0.7682745542842895), 'hash(0, 1) = ' + hash(0, 1));
assert(near(hash(-3, 7), 0.031008727615699172), 'hash(-3, 7) = ' + hash(-3, 7));
assert(near(hash(12, -5), 0.2735213874839246), 'hash(12, -5) = ' + hash(12, -5));` },
    { name: "hash_is_deterministic_in_range_and_spread_out", code: `let min = 1, max = 0, sum = 0, n = 0;
for (let x = -20; x < 20; x++) for (let y = -20; y < 20; y++) {
  const h = hash(x, y);
  assert(h >= 0 && h < 1, 'range at ' + x + ',' + y + ': ' + h);
  assert(h === hash(x, y), 'deterministic');
  min = Math.min(min, h); max = Math.max(max, h); sum += h; n++;
}
assert(min < 0.05 && max > 0.95, 'uses the whole range: ' + min + ' .. ' + max);
assert(Math.abs(sum / n - 0.5) < 0.05, 'average near 0.5: ' + sum / n);
assert(hash(3, 5) !== hash(5, 3), 'x and y are not interchangeable');` },
    { name: "noise_equals_hash_at_integer_points", code: `for (const [x, y] of [[0, 0], [1, 0], [0, 1], [-3, 7], [12, -5], [2, 2]]) {
  assert(Math.abs(noise(x, y) - hash(x, y)) < 1e-12, 'at ' + x + ',' + y);
}` },
    { name: "noise_midpoints_average_the_corners", code: `const avg4 = (x, y) => (hash(x, y) + hash(x + 1, y) + hash(x, y + 1) + hash(x + 1, y + 1)) / 4;
assert(Math.abs(noise(0.5, 0.5) - avg4(0, 0)) < 1e-12, 'cell (0,0)');
assert(Math.abs(noise(4.5, -2.5) - avg4(4, -3)) < 1e-12, 'a cell with a negative y: ' + noise(4.5, -2.5));
assert(Math.abs(noise(-0.5, -0.5) - avg4(-1, -1)) < 1e-12, 'negative cell uses floor, not truncation');
assert(Math.abs(noise(0.5, 0) - (hash(0, 0) + hash(1, 0)) / 2) < 1e-12, 'midpoint of an edge');` },
    { name: "noise_uses_the_smooth_fade_curve", code: `const h0 = hash(0, 0), h1 = hash(1, 0);
const u = 0.25 * 0.25 * (3 - 2 * 0.25);
assert(Math.abs(noise(0.25, 0) - (h0 + (h1 - h0) * u)) < 1e-12, 'fade(0.25) = 0.15625, not 0.25: ' + noise(0.25, 0));` },
    { name: "noise_is_continuous_and_bounded", code: `const e = 1e-6;
for (let i = 0; i < 200; i++) {
  const x = -10 + i * 0.1337, y = 5 - i * 0.0771;
  const v = noise(x, y);
  assert(v >= 0 && v <= 1, 'bounded at ' + x + ',' + y + ': ' + v);
  assert(Math.abs(noise(x + e, y) - v) < 1e-4 && Math.abs(noise(x, y + e) - v) < 1e-4, 'continuous at ' + x + ',' + y);
}
assert(Math.abs(noise(0.9999999, 0.3) - noise(1.0000001, 0.3)) < 1e-4, 'continuous across a cell border');` },
    { name: "fbm_single_octave_is_plain_noise", code: `assert(Math.abs(fbm(1.3, 2.7, { octaves: 1 }) - noise(1.3, 2.7)) < 1e-12, 'octaves = 1');` },
    { name: "fbm_combines_octaves_with_normalisation", code: `const x = 1.3, y = 2.7;
const two = (noise(x, y) + 0.5 * noise(2 * x, 2 * y)) / 1.5;
assert(Math.abs(fbm(x, y, { octaves: 2 }) - two) < 1e-12, 'two octaves with default gain and lacunarity: ' + fbm(x, y, { octaves: 2 }));
const custom = (noise(x, y) + 0.25 * noise(3 * x, 3 * y)) / 1.25;
assert(Math.abs(fbm(x, y, { octaves: 2, lacunarity: 3, gain: 0.25 }) - custom) < 1e-12, 'custom parameters');
let sum = 0, amp = 1, freq = 1, norm = 0;
for (let i = 0; i < 4; i++) { sum += amp * noise(x * freq, y * freq); norm += amp; amp *= 0.5; freq *= 2; }
assert(Math.abs(fbm(x, y) - sum / norm) < 1e-12, 'defaults are 4 octaves, lacunarity 2, gain 0.5');` },
    { name: "fbm_stays_in_range_and_validates_octaves", code: `for (let i = 0; i < 100; i++) {
  const v = fbm(i * 0.37 - 20, i * 0.91 + 3, { octaves: 6 });
  assert(v >= 0 && v <= 1, 'range ' + v);
}
const bad = (o) => { try { fbm(0, 0, { octaves: o }); return null; } catch (e) { return e; } };
assert(bad(0) instanceof RangeError && bad(-2) instanceof RangeError && bad(2.5) instanceof RangeError && bad(NaN) instanceof RangeError, 'octaves must be an integer >= 1');` },
  ],
  solution: {
    code: `function hash(ix, iy) {
  let h = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}

const fade = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

function noise(x, y) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const u = fade(x - x0);
  const v = fade(y - y0);
  const bottom = lerp(hash(x0, y0), hash(x0 + 1, y0), u);
  const top = lerp(hash(x0, y0 + 1), hash(x0 + 1, y0 + 1), u);
  return lerp(bottom, top, v);
}

function fbm(x, y, options = {}) {
  const { octaves = 4, lacunarity = 2, gain = 0.5 } = options;
  if (!Number.isInteger(octaves) || octaves < 1) throw new RangeError('octaves must be an integer >= 1');
  let sum = 0;
  let norm = 0;
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

module.exports = { hash, noise, fbm };`,
    explanation:
      "The hash gives every integer grid point a repeatable pseudo-random value, so there is no state and no Math.random; shaders use the same idea because every pixel must compute its own value independently. Interpolating the four corners with a smoothstep fade removes the visible grid seams of plain bilinear blending. fBm adds finer, fainter copies of the noise, and dividing by the amplitude sum keeps the result in range regardless of the octave count.",
  },
};
