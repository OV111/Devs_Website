export default {
  slug: "canvas-scale",
  trackId: "web-game",
  layerId: "web-game-1",
  type: "CODE",
  difficulty: "med",
  title: "Letterbox scaling and pointer mapping",
  summary: "Fit a fixed-size game canvas into any window with letterboxing (optionally integer scaling) and convert mouse positions back to game coordinates.",
  description:
    "A game is designed at a fixed logical size (say 320x180) but the window can be any shape. You scale the canvas to fit, leave bars on the unused sides, and every mouse click must be converted from window pixels back to game coordinates, or the player clicks the wrong thing. Pixel-art games also prefer whole-number scales so pixels stay crisp.",
  task:
    "Write <code>fitLetterbox(containerW, containerH, logicalW, logicalH, integer = false)</code> and <code>toLogical(point, fit)</code>.",
  constraints: [
    "<code>fitLetterbox</code> returns <code>{ scale, offsetX, offsetY, logicalW, logicalH }</code>. <code>scale = min(containerW / logicalW, containerH / logicalH)</code>. With <code>integer = true</code> use <code>max(1, floor(scale))</code> instead (it may overflow a tiny container).",
    "The scaled game is centred: <code>offsetX = (containerW - logicalW * scale) / 2</code>, same for Y (offsets may be negative when it overflows).",
    "If any container or logical dimension is <code>&lt;= 0</code>, return <code>scale: 0</code> and both offsets <code>0</code>.",
    "<code>toLogical(point, fit)</code> takes a point relative to the container's top-left, <code>{ x, y }</code>, and returns <code>{ x, y, inside }</code> in game coordinates: <code>(point.x - offsetX) / scale</code>. <code>inside</code> is true only when <code>0 &lt;= x &lt; logicalW</code> and <code>0 &lt;= y &lt; logicalH</code> (the far edge is outside). If <code>fit.scale</code> is 0 return <code>{ x: 0, y: 0, inside: false }</code>.",
  ],
  example: `const fit = fitLetterbox(1000, 600, 320, 180, true); // scale 3, offsets 20 / 30`,
  tags: ["canvas", "responsive", "pixel-art", "input"],
  estimatedMins: 25,
  xp: 40,
  starterFiles: [
    {
      name: "canvasScale.js",
      lang: "js",
      code: `// canvasScale.js
function fitLetterbox(containerW, containerH, logicalW, logicalH, integer = false) {
  // your code here
}

function toLogical(point, fit) {
  // your code here
}

module.exports = { fitLetterbox, toLogical };`,
    },
  ],
  testFile: {
    name: "canvasScale_test.js",
    lang: "test",
    code: `const { fitLetterbox, toLogical } = require('./canvasScale');

test('letterboxes a wide window', () => {
  const fit = fitLetterbox(800, 300, 400, 300);
  expect(fit.scale).toBe(1);
  expect(fit.offsetX).toBe(200);
});

test('maps the pointer', () => {
  const fit = fitLetterbox(800, 300, 400, 300);
  expect(toLogical({ x: 200, y: 0 }, fit)).toEqual({ x: 0, y: 0, inside: true });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Compute the float scale first, then optionally replace it with the integer scale. Offsets are derived from the FINAL scale." },
    { order: 2, cost: 5, text: "Store <code>logicalW/H</code> in the returned object so <code>toLogical</code> can do the inside test without extra arguments." },
    { order: 3, cost: 15, text: "Guard zero or negative sizes up front: dividing by zero would give <code>Infinity</code>/<code>NaN</code> scales." },
  ],
  hiddenTests: [
    { name: "exact_fit", code: `const fit = fitLetterbox(800, 600, 400, 300);
assert(fit.scale === 2 && fit.offsetX === 0 && fit.offsetY === 0, 'got ' + JSON.stringify(fit));
assert(fit.logicalW === 400 && fit.logicalH === 300, 'keeps the logical size');` },
    { name: "wide_window_gets_side_bars", code: `const fit = fitLetterbox(1000, 500, 400, 300);
assert(Math.abs(fit.scale - 500 / 300) < 1e-9, 'height limits: ' + fit.scale);
assert(Math.abs(fit.offsetX - (1000 - 400 * (500 / 300)) / 2) < 1e-9, 'centred horizontally: ' + fit.offsetX);
assert(Math.abs(fit.offsetY) < 1e-9, 'no vertical bars');` },
    { name: "tall_window_gets_top_and_bottom_bars", code: `const fit = fitLetterbox(400, 1000, 400, 300);
assert(fit.scale === 1, 'width limits');
assert(fit.offsetX === 0 && fit.offsetY === 350, 'centred vertically: ' + fit.offsetY);` },
    { name: "integer_scaling", code: `const fit = fitLetterbox(1000, 600, 320, 180, true);
assert(fit.scale === 3, 'floor(3.125) = 3, got ' + fit.scale);
assert(fit.offsetX === 20 && fit.offsetY === 30, 'offsets ' + fit.offsetX + ',' + fit.offsetY);
const small = fitLetterbox(200, 100, 320, 180, true);
assert(small.scale === 1, 'never below 1x');
assert(small.offsetX === -60 && small.offsetY === -40, 'overflow gives negative offsets: ' + small.offsetX + ',' + small.offsetY);` },
    { name: "degenerate_sizes", code: `const a = fitLetterbox(0, 600, 320, 180);
const b = fitLetterbox(800, 600, 0, 180);
const c = fitLetterbox(-5, 600, 320, 180, true);
for (const f of [a, b, c]) assert(f.scale === 0 && f.offsetX === 0 && f.offsetY === 0, 'got ' + JSON.stringify(f));` },
    { name: "pointer_maps_to_logical_coordinates", code: `const fit = fitLetterbox(1000, 600, 320, 180, true);
const p = toLogical({ x: 20 + 3 * 100, y: 30 + 3 * 50 }, fit);
assert(p.x === 100 && p.y === 50 && p.inside === true, 'got ' + JSON.stringify(p));
const origin = toLogical({ x: 20, y: 30 }, fit);
assert(origin.x === 0 && origin.y === 0 && origin.inside === true, 'top-left corner');` },
    { name: "bars_are_outside", code: `const fit = fitLetterbox(1000, 600, 320, 180, true);
assert(toLogical({ x: 5, y: 300 }, fit).inside === false, 'left bar');
assert(toLogical({ x: 500, y: 10 }, fit).inside === false, 'top bar');
const left = toLogical({ x: 5, y: 300 }, fit);
assert(left.x < 0, 'x is negative in the left bar: ' + left.x);` },
    { name: "far_edge_is_exclusive", code: `const fit = fitLetterbox(640, 360, 320, 180);
assert(toLogical({ x: 639, y: 359 }, fit).inside === true, 'last pixel');
assert(toLogical({ x: 640, y: 100 }, fit).inside === false, 'right edge is outside');
assert(toLogical({ x: 100, y: 360 }, fit).inside === false, 'bottom edge is outside');` },
    { name: "zero_scale_maps_nowhere", code: `const fit = fitLetterbox(0, 0, 320, 180);
const p = toLogical({ x: 10, y: 10 }, fit);
assert(p.x === 0 && p.y === 0 && p.inside === false, 'got ' + JSON.stringify(p));` },
  ],
  solution: {
    code: `function fitLetterbox(containerW, containerH, logicalW, logicalH, integer = false) {
  if (containerW <= 0 || containerH <= 0 || logicalW <= 0 || logicalH <= 0) {
    return { scale: 0, offsetX: 0, offsetY: 0, logicalW, logicalH };
  }
  let scale = Math.min(containerW / logicalW, containerH / logicalH);
  if (integer) scale = Math.max(1, Math.floor(scale));
  return {
    scale,
    offsetX: (containerW - logicalW * scale) / 2,
    offsetY: (containerH - logicalH * scale) / 2,
    logicalW,
    logicalH,
  };
}

function toLogical(point, fit) {
  if (!fit.scale) return { x: 0, y: 0, inside: false };
  const x = (point.x - fit.offsetX) / fit.scale;
  const y = (point.y - fit.offsetY) / fit.scale;
  return { x, y, inside: x >= 0 && x < fit.logicalW && y >= 0 && y < fit.logicalH };
}

module.exports = { fitLetterbox, toLogical };`,
    explanation:
      "The scale is whichever axis runs out of room first; the other axis gets bars, which is why centring uses half of the leftover space. Pointer mapping is simply the inverse transform (subtract the offset, divide by the scale), and doing it with the same fit object guarantees drawing and clicking can never disagree. Integer scaling trades a little unused screen for perfectly crisp pixels.",
  },
};
