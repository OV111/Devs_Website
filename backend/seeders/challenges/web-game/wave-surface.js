export default {
  slug: "wave-surface",
  trackId: "web-game",
  layerId: "web-game-7",
  type: "CODE",
  difficulty: "hard",
  title: "Animated water surface (vertex shader math)",
  summary: "Sum directional sine waves to displace a grid over time and compute exact surface normals with calculus instead of guessing.",
  description:
    "Water, flags and grass in games are flat grids whose vertices are moved in a <em>vertex shader</em>: the height of every vertex is computed from its position and a <code>time</code> uniform. For lighting you also need the surface normal, and the clean way is to differentiate the height function analytically rather than sample neighbours.",
  task:
    "Write <code>waveHeight(x, z, t, waves)</code>, <code>waveNormal(x, z, t, waves)</code> and <code>buildGrid(size, divisions, t, waves)</code>. A wave is <code>{ amplitude, wavelength, speed, direction: [dx, dz] }</code>.",
  constraints: [
    "For each wave: <code>k = 2 * PI / wavelength</code>, the direction is normalised to unit length, and <code>phase = k * (dot(direction, [x, z]) - speed * t)</code>. <code>waveHeight</code> is the sum of <code>amplitude * sin(phase)</code> over all waves (0 for an empty list).",
    "A <code>wavelength &lt;= 0</code> or a zero-length <code>direction</code> throws a <code>RangeError</code> (from every function that reads the waves).",
    "<code>waveNormal</code> uses the exact partial derivatives <code>dh/dx = sum(amplitude * k * dirX * cos(phase))</code> and <code>dh/dz = sum(amplitude * k * dirZ * cos(phase))</code> and returns the unit vector <code>normalize([-dh/dx, 1, -dh/dz])</code>.",
    "<code>buildGrid</code> returns <code>{ positions, normals }</code>, two arrays of <code>(divisions + 1) ** 2</code> entries of <code>[x, y, z]</code>. The grid is centred on the origin and spans <code>[-size / 2, size / 2]</code> on x and z; vertices are ordered row by row with z as the outer loop and x as the inner loop. <code>y</code> is <code>waveHeight</code> and the normal is <code>waveNormal</code> at that vertex. <code>size</code> must be &gt; 0 and <code>divisions</code> an integer &gt;= 1, otherwise throw <code>RangeError</code>.",
  ],
  example: `waveHeight(1, 0, 0, [{ amplitude: 2, wavelength: 4, speed: 0, direction: [1, 0] }]) // 2`,
  tags: ["glsl", "vertex-shader", "water", "calculus"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "waveSurface.js",
      lang: "js",
      code: `// waveSurface.js
function waveHeight(x, z, t, waves) {
  // your code here
}

function waveNormal(x, z, t, waves) {
  // your code here
}

function buildGrid(size, divisions, t, waves) {
  // your code here
}

module.exports = { waveHeight, waveNormal, buildGrid };`,
    },
  ],
  testFile: {
    name: "waveSurface_test.js",
    lang: "test",
    code: `const { waveHeight } = require('./waveSurface');
const wave = { amplitude: 2, wavelength: 4, speed: 0, direction: [1, 0] };

test('crest of a single wave', () => {
  expect(waveHeight(1, 0, 0, [wave])).toBeCloseTo(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write one helper that turns a wave into <code>{ A, k, dx, dz, speed }</code> (validating and normalising the direction). Reuse it in both <code>waveHeight</code> and <code>waveNormal</code>." },
    { order: 2, cost: 5, text: "The derivative of <code>A * sin(phase)</code> with respect to x is <code>A * cos(phase) * dphase/dx</code>, and <code>dphase/dx = k * dirX</code>." },
    { order: 3, cost: 15, text: "In <code>buildGrid</code> compute the coordinate as <code>-size / 2 + (size * i) / divisions</code> for i in 0..divisions." },
  ],
  hiddenTests: [
    { name: "flat_water_without_waves", code: `assert(waveHeight(3, 4, 5, []) === 0, 'height');
const n = waveNormal(3, 4, 5, []);
assert(JSON.stringify(n) === '[0,1,0]' || (Math.abs(n[0]) < 1e-12 && n[1] === 1 && Math.abs(n[2]) < 1e-12), 'normal points straight up: ' + n);` },
    { name: "single_wave_height", code: `const w = [{ amplitude: 2, wavelength: 4, speed: 0, direction: [1, 0] }];
assert(Math.abs(waveHeight(1, 0, 0, w) - 2) < 1e-9, 'crest at a quarter wavelength');
assert(Math.abs(waveHeight(0, 0, 0, w)) < 1e-9, 'zero at the origin');
assert(Math.abs(waveHeight(3, 0, 0, w) + 2) < 1e-9, 'trough');
assert(Math.abs(waveHeight(1, 123, 0, w) - 2) < 1e-9, 'a wave travelling along x does not depend on z');` },
    { name: "waves_travel_over_time", code: `const w = [{ amplitude: 2, wavelength: 4, speed: 2, direction: [1, 0] }];
assert(Math.abs(waveHeight(2, 0, 1, w)) < 1e-9, 'the crest that was at x = 1 moved to x = 3 after t = 1 at speed 2; at x = 2 the phase is 0: ' + waveHeight(2, 0, 1, w));
assert(Math.abs(waveHeight(3, 0, 1, w) - 2) < 1e-9, 'crest now at x = 3: ' + waveHeight(3, 0, 1, w));
assert(Math.abs(waveHeight(1, 0, 0, w) - 2) < 1e-9, 'and it was at x = 1 at t = 0');` },
    { name: "direction_is_normalised_and_waves_add_up", code: `const a = [{ amplitude: 1, wavelength: 5, speed: 0, direction: [3, 4] }];
const b = [{ amplitude: 1, wavelength: 5, speed: 0, direction: [0.6, 0.8] }];
assert(Math.abs(waveHeight(2, 3, 0, a) - waveHeight(2, 3, 0, b)) < 1e-12, 'only the direction matters, not its length');
const w1 = { amplitude: 1, wavelength: 6, speed: 1, direction: [1, 0] };
const w2 = { amplitude: 0.5, wavelength: 3, speed: 2, direction: [0, 1] };
const sum = waveHeight(1.3, 2.1, 0.7, [w1]) + waveHeight(1.3, 2.1, 0.7, [w2]);
assert(Math.abs(waveHeight(1.3, 2.1, 0.7, [w1, w2]) - sum) < 1e-12, 'superposition');` },
    { name: "analytic_normal_on_a_known_wave", code: `const w = [{ amplitude: 1, wavelength: 2 * Math.PI, speed: 0, direction: [1, 0] }];
const n0 = waveNormal(0, 0, 0, w);
assert(Math.abs(n0[0] + Math.SQRT1_2) < 1e-9 && Math.abs(n0[1] - Math.SQRT1_2) < 1e-9 && Math.abs(n0[2]) < 1e-9, 'slope 1 at the zero crossing: ' + n0);
const crest = waveNormal(Math.PI / 2, 0, 0, w);
assert(Math.abs(crest[0]) < 1e-9 && Math.abs(crest[1] - 1) < 1e-9, 'flat on the crest: ' + crest);
const down = waveNormal(Math.PI, 0, 0, w);
assert(down[0] > 0.7, 'on the falling side the normal leans toward +x: ' + down);` },
    { name: "normal_matches_finite_differences", code: `const waves = [
  { amplitude: 0.8, wavelength: 7, speed: 1.5, direction: [1, 1] },
  { amplitude: 0.3, wavelength: 2.5, speed: 3, direction: [-1, 0.5] },
];
const e = 1e-5;
for (const [x, z, t] of [[0.3, 1.7, 0.4], [-2.2, 4.1, 1.9], [5, -3, 0]]) {
  const dx = (waveHeight(x + e, z, t, waves) - waveHeight(x - e, z, t, waves)) / (2 * e);
  const dz = (waveHeight(x, z + e, t, waves) - waveHeight(x, z - e, t, waves)) / (2 * e);
  const len = Math.hypot(dx, 1, dz);
  const n = waveNormal(x, z, t, waves);
  assert(Math.abs(n[0] - -dx / len) < 1e-6 && Math.abs(n[1] - 1 / len) < 1e-6 && Math.abs(n[2] - -dz / len) < 1e-6, 'at ' + [x, z, t] + ' got ' + n);
  assert(Math.abs(Math.hypot(n[0], n[1], n[2]) - 1) < 1e-12 && n[1] > 0, 'unit length and upward');
}` },
    { name: "grid_layout", code: `const flat = buildGrid(4, 2, 0, []);
assert(flat.positions.length === 9 && flat.normals.length === 9, 'three by three vertices');
assert(JSON.stringify(flat.positions[0]) === '[-2,0,-2]' && JSON.stringify(flat.positions[1]) === '[0,0,-2]' && JSON.stringify(flat.positions[2]) === '[2,0,-2]', 'first row has z = -2: ' + JSON.stringify(flat.positions.slice(0, 3)));
assert(JSON.stringify(flat.positions[3]) === '[-2,0,0]' && JSON.stringify(flat.positions[8]) === '[2,0,2]', 'x is the inner loop: ' + JSON.stringify([flat.positions[3], flat.positions[8]]));
assert(flat.normals.every((n) => Math.abs(n[0]) < 1e-12 && Math.abs(n[1] - 1) < 1e-12 && Math.abs(n[2]) < 1e-12), 'flat normals');
const big = buildGrid(10, 4, 0, []);
assert(big.positions.length === 25, '(divisions + 1) squared');` },
    { name: "grid_uses_the_wave_functions", code: `const waves = [{ amplitude: 1, wavelength: 4, speed: 1, direction: [1, 0] }];
const g = buildGrid(8, 4, 0.5, waves);
for (let i = 0; i < g.positions.length; i++) {
  const [x, y, z] = g.positions[i];
  assert(Math.abs(y - waveHeight(x, z, 0.5, waves)) < 1e-12, 'height at vertex ' + i);
  const n = waveNormal(x, z, 0.5, waves);
  assert(Math.abs(g.normals[i][0] - n[0]) < 1e-12 && Math.abs(g.normals[i][1] - n[1]) < 1e-12, 'normal at vertex ' + i);
}
assert(g.positions.some((p) => Math.abs(p[1]) > 0.5), 'the surface is actually displaced');` },
    { name: "validation", code: `const bad = (fn) => { try { fn(); return null; } catch (e) { return e; } };
const okWave = { amplitude: 1, wavelength: 2, speed: 0, direction: [1, 0] };
assert(bad(() => waveHeight(0, 0, 0, [{ ...okWave, wavelength: 0 }])) instanceof RangeError, 'zero wavelength');
assert(bad(() => waveHeight(0, 0, 0, [{ ...okWave, wavelength: -3 }])) instanceof RangeError, 'negative wavelength');
assert(bad(() => waveNormal(0, 0, 0, [{ ...okWave, direction: [0, 0] }])) instanceof RangeError, 'zero direction');
assert(bad(() => buildGrid(0, 4, 0, [])) instanceof RangeError, 'size');
assert(bad(() => buildGrid(4, 0, 0, [])) instanceof RangeError, 'divisions');
assert(bad(() => buildGrid(4, 2.5, 0, [])) instanceof RangeError, 'non-integer divisions');
assert(bad(() => buildGrid(4, 2, 0, [{ ...okWave, wavelength: 0 }])) instanceof RangeError, 'invalid waves reach buildGrid too');` },
  ],
  solution: {
    code: `function prepare(wave) {
  if (!(wave.wavelength > 0)) throw new RangeError('wavelength must be > 0');
  const len = Math.hypot(wave.direction[0], wave.direction[1]);
  if (len === 0) throw new RangeError('direction must not be zero');
  return {
    A: wave.amplitude,
    k: (2 * Math.PI) / wave.wavelength,
    dx: wave.direction[0] / len,
    dz: wave.direction[1] / len,
    speed: wave.speed,
  };
}

const phaseOf = (w, x, z, t) => w.k * (w.dx * x + w.dz * z - w.speed * t);

function waveHeight(x, z, t, waves) {
  let h = 0;
  for (const wave of waves) {
    const w = prepare(wave);
    h += w.A * Math.sin(phaseOf(w, x, z, t));
  }
  return h;
}

function waveNormal(x, z, t, waves) {
  let dhdx = 0;
  let dhdz = 0;
  for (const wave of waves) {
    const w = prepare(wave);
    const c = w.A * w.k * Math.cos(phaseOf(w, x, z, t));
    dhdx += c * w.dx;
    dhdz += c * w.dz;
  }
  const len = Math.hypot(dhdx, 1, dhdz);
  return [-dhdx / len, 1 / len, -dhdz / len];
}

function buildGrid(size, divisions, t, waves) {
  if (!(size > 0)) throw new RangeError('size must be > 0');
  if (!Number.isInteger(divisions) || divisions < 1) throw new RangeError('divisions must be an integer >= 1');
  waves.forEach(prepare);
  const positions = [];
  const normals = [];
  for (let iz = 0; iz <= divisions; iz++) {
    for (let ix = 0; ix <= divisions; ix++) {
      const x = -size / 2 + (size * ix) / divisions;
      const z = -size / 2 + (size * iz) / divisions;
      positions.push([x, waveHeight(x, z, t, waves), z]);
      normals.push(waveNormal(x, z, t, waves));
    }
  }
  return { positions, normals };
}

module.exports = { waveHeight, waveNormal, buildGrid };`,
    explanation:
      "Each wave is a sine of a phase that grows along its direction and shrinks with time, so the crest moves at 'speed'. Summing waves is just superposition. Differentiating the sum by hand gives the exact slope in x and z, and a surface with slope (a, b) has the normal (-a, 1, -b) normalised, which is cheaper and more accurate than sampling extra vertices in the shader. The grid loops z outside and x inside so the vertex order matches how index buffers are usually built.",
  },
};
