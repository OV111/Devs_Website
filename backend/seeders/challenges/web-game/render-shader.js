export default {
  slug: "render-shader",
  trackId: "web-game",
  layerId: "web-game-7",
  type: "CODE",
  difficulty: "med",
  title: "Run a fragment shader on the CPU",
  summary: "Call a fragment function for every pixel with GLSL-style coordinates, uniforms and discard, and convert float colours to bytes.",
  description:
    "A fragment shader is a function the GPU runs once per pixel: it receives the pixel's position and some uniforms, and returns a colour. Running the same idea on the CPU is the best way to understand the conventions that trip everyone up: the origin is at the BOTTOM-left, pixel centres sit at +0.5, and colours are floats that get clamped and quantised to bytes.",
  task:
    "Write <code>renderShader(width, height, fragment, uniforms = {})</code> returning a flat array of <code>width * height * 4</code> bytes (RGBA), rows ordered from the TOP of the image to the bottom, left to right.",
  constraints: [
    "Throw a <code>RangeError</code> unless <code>width</code> and <code>height</code> are positive integers.",
    "For the pixel in column <code>px</code> and output row <code>py</code> (row 0 is the top of the image) call <code>fragment({ fragCoord, resolution, uv, uniforms })</code> where <code>fragCoord = [px + 0.5, height - py - 0.5]</code> (GLSL has its origin at the bottom-left and addresses pixel centres), <code>resolution = [width, height]</code>, <code>uv = [fragCoord[0] / width, fragCoord[1] / height]</code>, and <code>uniforms</code> is the SAME object you were given.",
    "The fragment returns <code>[r, g, b]</code> or <code>[r, g, b, a]</code> as floats (alpha defaults to 1). Each channel becomes <code>Math.round(clamp(value, 0, 1) * 255)</code>; a <code>NaN</code> channel becomes 0.",
    "A fragment that returns <code>null</code> has <code>discard</code>ed the pixel: write <code>[0, 0, 0, 0]</code>. Any other return value that is not an array of 3 or 4 numbers throws a <code>TypeError</code>.",
  ],
  example: `renderShader(2, 1, ({ uv }) => [uv[0], 0, 0]) // [64, 0, 0, 255, 191, 0, 0, 255]`,
  tags: ["glsl", "fragment-shader", "canvas", "rendering"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "renderShader.js",
      lang: "js",
      code: `// renderShader.js
function renderShader(width, height, fragment, uniforms = {}) {
  // your code here
}

module.exports = renderShader;`,
    },
  ],
  testFile: {
    name: "renderShader_test.js",
    lang: "test",
    code: `const renderShader = require('./renderShader');

test('uv gradient', () => {
  const out = renderShader(2, 1, ({ uv }) => [uv[0], 0, 0]);
  expect(out).toEqual([64, 0, 0, 255, 191, 0, 0, 255]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Two nested loops, rows outer: <code>for (py = 0; py &lt; height; py++) for (px = 0; px &lt; width; px++)</code>, pushing four bytes per pixel." },
    { order: 2, cost: 5, text: "The vertical flip is only in <code>fragCoord[1] = height - py - 0.5</code>; everything else (uv, resolution) is derived from it." },
    { order: 3, cost: 15, text: "Validate the fragment's return value before converting: <code>null</code> means discard, an array of length 3 or 4 is a colour, anything else throws." },
  ],
  hiddenTests: [
    { name: "output_size_and_row_order", code: `const out = renderShader(3, 2, ({ fragCoord }) => [fragCoord[0] / 4, fragCoord[1] / 4, 0]);
assert(out.length === 24, 'width * height * 4, got ' + out.length);
assert(out[0] === Math.round(0.5 / 4 * 255) && out[1] === Math.round(1.5 / 4 * 255), 'top-left pixel is the TOP row, which has the larger y: ' + out.slice(0, 4));
assert(out[12 + 1] === Math.round(0.5 / 4 * 255), 'the second row has y = 0.5');` },
    { name: "frag_coord_uses_pixel_centres_and_bottom_left_origin", code: `const seen = [];
renderShader(2, 2, ({ fragCoord }) => { seen.push(fragCoord.join(',')); return [0, 0, 0]; });
assert(seen.join(' ') === '0.5,1.5 1.5,1.5 0.5,0.5 1.5,0.5', 'got ' + seen.join(' '));` },
    { name: "uv_and_resolution", code: `const calls = [];
renderShader(4, 2, ({ uv, resolution }) => { calls.push([uv[0], uv[1], resolution[0], resolution[1]]); return [0, 0, 0]; });
assert(calls.length === 8, 'one call per pixel');
assert(calls[0][0] === 0.125 && calls[0][1] === 0.75, 'first pixel uv: ' + calls[0]);
assert(calls[7][0] === 0.875 && calls[7][1] === 0.25, 'last pixel uv: ' + calls[7]);
assert(calls.every((c) => c[2] === 4 && c[3] === 2), 'resolution is [width, height]');` },
    { name: "gradient_shader_bytes", code: `const out = renderShader(2, 1, ({ uv }) => [uv[0], 0, 0]);
assert(JSON.stringify(out) === '[64,0,0,255,191,0,0,255]', 'got ' + JSON.stringify(out));` },
    { name: "clamping_rounding_and_nan", code: `const out = renderShader(1, 1, () => [2, -1, 0.5]);
assert(out[0] === 255 && out[1] === 0, 'clamped: ' + out);
assert(out[2] === 128, '0.5 * 255 = 127.5 rounds to 128: ' + out[2]);
const nan = renderShader(1, 1, () => [NaN, 1, 1]);
assert(nan[0] === 0 && nan[1] === 255, 'NaN channel becomes 0: ' + nan);` },
    { name: "alpha_defaults_and_is_used", code: `const a = renderShader(1, 1, () => [1, 1, 1]);
assert(a[3] === 255, 'default alpha');
const b = renderShader(1, 1, () => [1, 1, 1, 0.5]);
assert(b[3] === 128, 'explicit alpha: ' + b[3]);
const c = renderShader(1, 1, () => [1, 1, 1, 7]);
assert(c[3] === 255, 'alpha is clamped too');` },
    { name: "discard_writes_transparent_black", code: `const out = renderShader(2, 1, ({ uv }) => (uv[0] < 0.5 ? null : [1, 1, 1]));
assert(JSON.stringify(out) === '[0,0,0,0,255,255,255,255]', 'got ' + JSON.stringify(out));` },
    { name: "uniforms_are_passed_through_unchanged", code: `const uniforms = { time: 0.5, color: [0, 1, 0] };
let seen = null;
const out = renderShader(1, 1, (ctx) => { seen = ctx.uniforms; return ctx.uniforms.color; }, uniforms);
assert(seen === uniforms, 'same object');
assert(JSON.stringify(out) === '[0,255,0,255]', 'got ' + JSON.stringify(out));
let defaulted = null;
renderShader(1, 1, (ctx) => { defaulted = ctx.uniforms; return [0, 0, 0]; });
assert(defaulted && typeof defaulted === 'object', 'uniforms default to an object');` },
    { name: "an_animated_shader_changes_with_a_time_uniform", code: `const shader = ({ uv, uniforms }) => { const v = (uv[0] + uniforms.time) % 1; return [v, v, v]; };
const t0 = renderShader(4, 1, shader, { time: 0 });
const t1 = renderShader(4, 1, shader, { time: 0.25 });
assert(t0[0] === Math.round(0.125 * 255), 'frame 0: ' + t0[0]);
assert(t1[0] === Math.round(0.375 * 255), 'frame 1: ' + t1[0]);` },
    { name: "invalid_sizes_and_return_values", code: `const bad = (fn) => { try { fn(); return null; } catch (e) { return e; } };
assert(bad(() => renderShader(0, 4, () => [0, 0, 0])) instanceof RangeError, 'zero width');
assert(bad(() => renderShader(2.5, 4, () => [0, 0, 0])) instanceof RangeError, 'non-integer width');
assert(bad(() => renderShader(2, -1, () => [0, 0, 0])) instanceof RangeError, 'negative height');
assert(bad(() => renderShader(1, 1, () => 'red')) instanceof TypeError, 'string');
assert(bad(() => renderShader(1, 1, () => [1, 2])) instanceof TypeError, 'two channels');
assert(bad(() => renderShader(1, 1, () => undefined)) instanceof TypeError, 'undefined is not a discard, only null is');` },
  ],
  solution: {
    code: `function renderShader(width, height, fragment, uniforms = {}) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new RangeError('width and height must be positive integers');
  }
  const toByte = (v) => (Number.isNaN(v) ? 0 : Math.round(Math.min(1, Math.max(0, v)) * 255));
  const out = [];
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const fragCoord = [px + 0.5, height - py - 0.5];
      const color = fragment({
        fragCoord,
        resolution: [width, height],
        uv: [fragCoord[0] / width, fragCoord[1] / height],
        uniforms,
      });
      if (color === null) {
        out.push(0, 0, 0, 0);
        continue;
      }
      if (!Array.isArray(color) || (color.length !== 3 && color.length !== 4) || color.some((c) => typeof c !== 'number')) {
        throw new TypeError('fragment must return null or an array of 3 or 4 numbers');
      }
      const alpha = color.length === 4 ? color[3] : 1;
      out.push(toByte(color[0]), toByte(color[1]), toByte(color[2]), toByte(alpha));
    }
  }
  return out;
}

module.exports = renderShader;`,
    explanation:
      "The GPU runs the fragment function for each pixel, and so does this loop. The two conventions to remember are baked into fragCoord: GLSL's y axis starts at the bottom (so the first output row gets the largest y), and a pixel's coordinate is its centre (+0.5). Float colours are clamped to [0,1] before scaling, which is what the GPU's framebuffer does, so out-of-range values saturate instead of wrapping.",
  },
};
