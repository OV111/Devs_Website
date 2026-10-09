export default {
  slug: "image-filter",
  trackId: "web-game",
  layerId: "web-game-7",
  type: "CODE",
  difficulty: "med",
  title: "Post-processing: blur and edge kernels",
  summary: "Apply a convolution kernel to an image with clamped edges and generate a normalised Gaussian kernel, the core of blur, bloom and edge-detect passes.",
  description:
    "Post-processing effects such as blur, bloom, sharpen and outline are all the same operation: for every pixel, take a weighted sum of its neighbours using a small grid of weights called a kernel. Where the kernel hangs off the image edge you need a rule; GPUs usually clamp to the nearest edge pixel.",
  task:
    "Write <code>gaussianKernel(radius, sigma)</code> and <code>convolve(image, kernel)</code>. An image is <code>{ width, height, data }</code> with <code>data</code> a flat row-major array of numbers (one channel); a kernel is a 2D array of rows.",
  constraints: [
    "<code>gaussianKernel(radius, sigma)</code> returns a square kernel of size <code>2 * radius + 1</code> where the weight at offset <code>(dx, dy)</code> from the centre is <code>exp(-(dx*dx + dy*dy) / (2 * sigma * sigma))</code>, then every weight is divided by the total so the kernel sums to 1. <code>radius</code> must be an integer &gt;= 0 and <code>sigma</code> a number &gt; 0 (default <code>Math.max(radius / 2, 0.5)</code>), otherwise throw a <code>RangeError</code>. Radius 0 gives <code>[[1]]</code>.",
    "<code>convolve</code> returns a NEW image <code>{ width, height, data }</code> where each output pixel is the sum over the kernel of <code>kernel[ky][kx] * pixel(x + kx - r, y + ky - r)</code> with <code>r = (kernelSize - 1) / 2</code>. The kernel is NOT flipped (this is correlation, which is what image filters use).",
    "Pixels outside the image are replaced by the nearest edge pixel (clamp-to-edge), horizontally and vertically.",
    "The kernel must be square with an odd size, and <code>data.length</code> must equal <code>width * height</code>; otherwise throw a <code>RangeError</code>. Never modify the input image.",
  ],
  example: `convolve({ width: 3, height: 1, data: [1, 2, 3] }, [[0,0,0],[0,0,1],[0,0,0]]).data // [2, 3, 3]`,
  tags: ["post-processing", "convolution", "blur", "gaussian"],
  estimatedMins: 35,
  xp: 55,
  starterFiles: [
    {
      name: "imageFilter.js",
      lang: "js",
      code: `// imageFilter.js
function gaussianKernel(radius, sigma) {
  // your code here
}

function convolve(image, kernel) {
  // your code here
}

module.exports = { gaussianKernel, convolve };`,
    },
  ],
  testFile: {
    name: "imageFilter_test.js",
    lang: "test",
    code: `const { convolve } = require('./imageFilter');

test('identity kernel keeps the image', () => {
  const img = { width: 2, height: 2, data: [1, 2, 3, 4] };
  expect(convolve(img, [[1]]).data).toEqual([1, 2, 3, 4]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "A tiny helper <code>at(x, y)</code> that clamps both coordinates with <code>Math.min(Math.max(v, 0), size - 1)</code> removes all edge special-casing." },
    { order: 2, cost: 5, text: "Four nested loops are fine: output y, output x, kernel row, kernel column. Accumulate into a number and push it to the output array." },
    { order: 3, cost: 15, text: "For the Gaussian, compute raw weights first, remember their total, then divide each weight by it (do not forget the centre)." },
  ],
  hiddenTests: [
    { name: "identity_kernels", code: `const img = { width: 3, height: 2, data: [1, 2, 3, 4, 5, 6] };
assert(JSON.stringify(convolve(img, [[1]]).data) === '[1,2,3,4,5,6]', '1x1 kernel');
assert(JSON.stringify(convolve(img, [[0, 0, 0], [0, 1, 0], [0, 0, 0]]).data) === '[1,2,3,4,5,6]', '3x3 identity');
const out = convolve(img, [[1]]);
assert(out.width === 3 && out.height === 2, 'size is kept');` },
    { name: "kernel_is_not_flipped", code: `const out = convolve({ width: 3, height: 1, data: [1, 2, 3] }, [[0, 0, 0], [0, 0, 1], [0, 0, 0]]);
assert(JSON.stringify(out.data) === '[2,3,3]', 'a kernel that picks the right neighbour shifts the image left; the edge clamps: ' + JSON.stringify(out.data));
const down = convolve({ width: 1, height: 3, data: [1, 2, 3] }, [[0, 0, 0], [0, 0, 0], [0, 1, 0]]);
assert(JSON.stringify(down.data) === '[2,3,3]', 'and the same vertically: ' + JSON.stringify(down.data));` },
    { name: "horizontal_box_blur_with_clamped_edges", code: `const k = [[0, 0, 0], [1 / 3, 1 / 3, 1 / 3], [0, 0, 0]];
const out = convolve({ width: 3, height: 1, data: [0, 0, 9] }, k).data;
assert(Math.abs(out[0]) < 1e-12 && Math.abs(out[1] - 3) < 1e-12 && Math.abs(out[2] - 6) < 1e-12, 'got ' + JSON.stringify(out));` },
    { name: "constant_images_are_unchanged_by_normalised_kernels", code: `const img = { width: 5, height: 4, data: new Array(20).fill(7) };
const box = [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]];
for (const v of convolve(img, box).data) assert(Math.abs(v - 7) < 1e-9, 'box blur keeps a flat image flat: ' + v);
const g = gaussianKernel(2, 1);
for (const v of convolve(img, g).data) assert(Math.abs(v - 7) < 1e-9, 'gaussian too: ' + v);` },
    { name: "sobel_edge_detection", code: `const sobel = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
const img = { width: 3, height: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1] };
const out = convolve(img, sobel).data;
assert(out[4] === 4, 'strong response at the edge: ' + out[4]);
assert(out[3] === 0, 'no response on the flat left side: ' + out[3]);
assert(out[5] === 4, 'clamping keeps the response at the right edge: ' + out[5]);
const flat = convolve({ width: 3, height: 3, data: new Array(9).fill(5) }, sobel).data;
assert(flat.every((v) => v === 0), 'a flat image has no edges');` },
    { name: "gaussian_kernel_shape", code: `const k = gaussianKernel(1, 1);
assert(k.length === 3 && k.every((row) => row.length === 3), '3x3');
const total = k.flat().reduce((a, b) => a + b, 0);
assert(Math.abs(total - 1) < 1e-12, 'sums to 1: ' + total);
const raw = 1 + 4 * Math.exp(-0.5) + 4 * Math.exp(-1);
assert(Math.abs(k[1][1] - 1 / raw) < 1e-12, 'centre weight: ' + k[1][1]);
assert(Math.abs(k[0][1] - Math.exp(-0.5) / raw) < 1e-12 && Math.abs(k[0][0] - Math.exp(-1) / raw) < 1e-12, 'edge and corner weights');
assert(k[1][1] > k[0][1] && k[0][1] > k[0][0], 'falls off with distance');
assert(k[0][1] === k[1][0] && k[0][1] === k[2][1] && k[0][1] === k[1][2] && k[0][0] === k[2][2], 'symmetric');` },
    { name: "gaussian_sigma_and_radius", code: `assert(JSON.stringify(gaussianKernel(0, 1)) === '[[1]]', 'radius 0');
const narrow = gaussianKernel(2, 0.5), wide = gaussianKernel(2, 3);
assert(narrow[2][2] > wide[2][2], 'a small sigma concentrates weight in the centre');
assert(gaussianKernel(3).length === 7, 'default sigma works and size is 2r + 1');
const d = gaussianKernel(3).flat().reduce((a, b) => a + b, 0);
assert(Math.abs(d - 1) < 1e-12, 'default sigma still normalised');
const r0 = gaussianKernel(0);
assert(r0[0][0] === 1, 'default sigma with radius 0');` },
    { name: "validation", code: `const bad = (fn) => { try { fn(); return null; } catch (e) { return e; } };
const img = { width: 2, height: 2, data: [1, 2, 3, 4] };
assert(bad(() => gaussianKernel(-1, 1)) instanceof RangeError, 'negative radius');
assert(bad(() => gaussianKernel(1.5, 1)) instanceof RangeError, 'fractional radius');
assert(bad(() => gaussianKernel(1, 0)) instanceof RangeError && bad(() => gaussianKernel(1, -2)) instanceof RangeError, 'sigma must be > 0');
assert(bad(() => convolve(img, [[1, 0], [0, 1]])) instanceof RangeError, 'even kernel');
assert(bad(() => convolve(img, [[1, 0, 0], [0, 1, 0]])) instanceof RangeError, 'not square');
assert(bad(() => convolve({ width: 2, height: 2, data: [1, 2, 3] }, [[1]])) instanceof RangeError, 'data length mismatch');` },
    { name: "input_is_not_mutated_and_output_is_new", code: `const img = { width: 2, height: 2, data: [1, 2, 3, 4] };
const k = [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]];
const out = convolve(img, k);
assert(JSON.stringify(img.data) === '[1,2,3,4]' && img.width === 2, 'input untouched');
assert(out !== img && out.data !== img.data && Array.isArray(out.data) && out.data.length === 4, 'new image');
assert(JSON.stringify(k[0]) === JSON.stringify([1 / 9, 1 / 9, 1 / 9]), 'kernel untouched');` },
  ],
  solution: {
    code: `function gaussianKernel(radius, sigma = Math.max(radius / 2, 0.5)) {
  if (!Number.isInteger(radius) || radius < 0) throw new RangeError('radius must be an integer >= 0');
  if (!(sigma > 0)) throw new RangeError('sigma must be > 0');
  const size = 2 * radius + 1;
  const kernel = [];
  let total = 0;
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const dx = x - radius;
      const dy = y - radius;
      const w = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
      row.push(w);
      total += w;
    }
    kernel.push(row);
  }
  return kernel.map((row) => row.map((w) => w / total));
}

function convolve(image, kernel) {
  const { width, height, data } = image;
  const size = kernel.length;
  if (size % 2 === 0 || kernel.some((row) => row.length !== size)) {
    throw new RangeError('kernel must be square with an odd size');
  }
  if (data.length !== width * height) throw new RangeError('data length must equal width * height');
  const r = (size - 1) / 2;
  const clampTo = (v, max) => Math.min(Math.max(v, 0), max);
  const out = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          const sx = clampTo(x + kx - r, width - 1);
          const sy = clampTo(y + ky - r, height - 1);
          sum += kernel[ky][kx] * data[sy * width + sx];
        }
      }
      out.push(sum);
    }
  }
  return { width, height, data: out };
}

module.exports = { gaussianKernel, convolve };`,
    explanation:
      "A convolution slides a small grid of weights over the image; clamping the sample coordinates is the same as the GPU's clamp-to-edge sampler, so no special edge code is needed. A kernel that sums to 1 preserves overall brightness, which is why the Gaussian is normalised. Because the filter is correlation (not flipped) a kernel that is 1 on its right neighbour shifts the picture left, and symmetric kernels such as blurs do not care.",
  },
};
