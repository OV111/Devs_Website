export default {
  slug: "find-overlaps",
  trackId: "web-game",
  layerId: "web-game-2",
  type: "CODE",
  difficulty: "hard",
  title: "Uniform-grid broad phase",
  summary: "Find every pair of overlapping rectangles without comparing everything to everything, using a spatial hash grid.",
  description:
    "A bullet-hell with 1,000 sprites has half a million possible pairs; checking them all every frame kills the frame rate. Games first ask a cheap question, 'which objects are even near each other?', using a grid, and only then run the exact overlap test. That cheap first pass is the broad phase.",
  task:
    "Write <code>findOverlaps(rects, cellSize)</code> where each rect is <code>{ x, y, w, h }</code>. Return an array of index pairs <code>[i, j]</code> with <code>i &lt; j</code> for every two rects that overlap, sorted by <code>i</code> then <code>j</code>, each pair exactly once.",
  constraints: [
    "Two rects overlap only if they share area: <code>a.x &lt; b.x + b.w &amp;&amp; b.x &lt; a.x + a.w</code> and the same on y. Rects that merely touch along an edge do NOT overlap. A rect with zero or negative width/height overlaps nothing.",
    "Use a grid: put each rect's index into every cell it covers (cells are <code>cellSize</code> squares, found with <code>Math.floor</code> so negative coordinates work; a rect ending exactly on a cell border does not cover the next cell), then only compare rects that share a cell.",
    "A pair that shares several cells must still be reported once.",
    "<code>cellSize</code> must be a positive finite number, otherwise throw a <code>RangeError</code>.",
    "The result must equal what comparing every pair would give, and it must stay fast when thousands of rects are spread far apart.",
  ],
  example: `findOverlaps([{x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10},{x:100,y:100,w:5,h:5}], 16) // [[0, 1]]`,
  tags: ["collision", "broad-phase", "spatial-hash", "performance"],
  estimatedMins: 45,
  xp: 80,
  starterFiles: [
    {
      name: "findOverlaps.js",
      lang: "js",
      code: `// findOverlaps.js
function findOverlaps(rects, cellSize) {
  // your code here
}

module.exports = findOverlaps;`,
    },
  ],
  testFile: {
    name: "findOverlaps_test.js",
    lang: "test",
    code: `const findOverlaps = require('./findOverlaps');

test('finds the overlapping pair', () => {
  const rects = [{ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }, { x: 100, y: 100, w: 5, h: 5 }];
  expect(findOverlaps(rects, 16)).toEqual([[0, 1]]);
});

test('touching edges do not overlap', () => {
  expect(findOverlaps([{ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 }], 16)).toEqual([]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Cell key: <code>cx + ',' + cy</code> in a <code>Map</code> from key to array of indices. A rect covers columns <code>floor(x / s)</code> to <code>ceil((x + w) / s) - 1</code> (same for rows)." },
    { order: 2, cost: 5, text: "For each cell with 2+ indices, test every pair inside it. Store found pairs in a <code>Set</code> of numeric keys (like <code>i * n + j</code>) so pairs from several shared cells collapse." },
    { order: 3, cost: 15, text: "Skip degenerate rects (<code>w &lt;= 0 || h &lt;= 0</code>) before inserting. Sort the final pairs at the end." },
  ],
  hiddenTests: [
    { name: "reports_overlapping_pairs", code: `const rects = [{ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }, { x: 100, y: 100, w: 5, h: 5 }];
const r = findOverlaps(rects, 16);
assert(JSON.stringify(r) === '[[0,1]]', 'got ' + JSON.stringify(r));` },
    { name: "touching_edges_and_corners_do_not_overlap", code: `const r = findOverlaps([{ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 }, { x: 0, y: 10, w: 10, h: 10 }, { x: 10, y: 10, w: 10, h: 10 }], 16);
assert(r.length === 0, 'got ' + JSON.stringify(r));` },
    { name: "containment_counts", code: `const r = findOverlaps([{ x: 0, y: 0, w: 100, h: 100 }, { x: 40, y: 40, w: 5, h: 5 }], 16);
assert(JSON.stringify(r) === '[[0,1]]', 'got ' + JSON.stringify(r));` },
    { name: "pairs_sharing_many_cells_are_reported_once", code: `const r = findOverlaps([{ x: 0, y: 0, w: 100, h: 100 }, { x: 10, y: 10, w: 80, h: 80 }], 8);
assert(JSON.stringify(r) === '[[0,1]]', 'got ' + JSON.stringify(r));` },
    { name: "zero_sized_rects_overlap_nothing", code: `const r = findOverlaps([{ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 0, h: 5 }, { x: 5, y: 5, w: 5, h: -1 }], 16);
assert(r.length === 0, 'got ' + JSON.stringify(r));` },
    { name: "negative_coordinates", code: `const r = findOverlaps([{ x: -20, y: -20, w: 15, h: 15 }, { x: -10, y: -10, w: 15, h: 15 }, { x: 6, y: 6, w: 5, h: 5 }], 16);
assert(JSON.stringify(r) === '[[0,1]]', 'got ' + JSON.stringify(r));` },
    { name: "rect_ending_on_a_cell_border_does_not_leak_into_the_next_cell", code: `const r = findOverlaps([{ x: 0, y: 0, w: 16, h: 16 }, { x: 16, y: 0, w: 16, h: 16 }], 16);
assert(r.length === 0, 'got ' + JSON.stringify(r));
const s = findOverlaps([{ x: 0, y: 0, w: 17, h: 16 }, { x: 16, y: 0, w: 16, h: 16 }], 16);
assert(JSON.stringify(s) === '[[0,1]]', 'one pixel of overlap across the border: ' + JSON.stringify(s));` },
    { name: "results_are_sorted", code: `const rects = [{ x: 0, y: 0, w: 10, h: 10 }, { x: 50, y: 50, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }, { x: 52, y: 52, w: 10, h: 10 }, { x: 6, y: 6, w: 3, h: 3 }];
const r = findOverlaps(rects, 16);
assert(JSON.stringify(r) === '[[0,2],[0,4],[1,3],[2,4]]', 'got ' + JSON.stringify(r));` },
    { name: "matches_brute_force_on_random_input", code: `let seed = 12345;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const rects = [];
for (let i = 0; i < 150; i++) rects.push({ x: Math.floor(rnd() * 400) - 100, y: Math.floor(rnd() * 400) - 100, w: Math.floor(rnd() * 40), h: Math.floor(rnd() * 40) });
const expected = [];
for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
  const a = rects[i], b = rects[j];
  if (a.w > 0 && a.h > 0 && b.w > 0 && b.h > 0 && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) expected.push([i, j]);
}
const got = findOverlaps(rects, 32);
assert(expected.length > 20, 'the random scene should contain overlaps');
assert(JSON.stringify(got) === JSON.stringify(expected), 'expected ' + expected.length + ' pairs, got ' + got.length);` },
    { name: "many_distant_rects_stay_cheap", code: `const rects = [];
for (let i = 0; i < 3000; i++) rects.push({ x: i * 1000, y: 0, w: 10, h: 10 });
const r = findOverlaps(rects, 64);
assert(r.length === 0, 'no overlaps');` },
    { name: "bad_cell_size", code: `const bad = (v) => { try { findOverlaps([], v); return false; } catch (e) { return e instanceof RangeError; } };
assert(bad(0) && bad(-4) && bad(NaN) && bad(Infinity), 'invalid sizes throw RangeError');` },
  ],
  solution: {
    code: `function findOverlaps(rects, cellSize) {
  if (!(cellSize > 0) || !Number.isFinite(cellSize)) {
    throw new RangeError('cellSize must be a positive finite number');
  }
  const cells = new Map();
  rects.forEach((r, i) => {
    if (!(r.w > 0 && r.h > 0)) return;
    const c0 = Math.floor(r.x / cellSize);
    const c1 = Math.ceil((r.x + r.w) / cellSize) - 1;
    const r0 = Math.floor(r.y / cellSize);
    const r1 = Math.ceil((r.y + r.h) / cellSize) - 1;
    for (let cx = c0; cx <= c1; cx++) {
      for (let cy = r0; cy <= r1; cy++) {
        const key = cx + ',' + cy;
        let list = cells.get(key);
        if (!list) cells.set(key, (list = []));
        list.push(i);
      }
    }
  });

  const n = rects.length;
  const seen = new Set();
  const pairs = [];
  for (const list of cells.values()) {
    for (let a = 0; a < list.length; a++) {
      for (let b = a + 1; b < list.length; b++) {
        const i = list[a];
        const j = list[b];
        const id = i * n + j;
        if (seen.has(id)) continue;
        const p = rects[i];
        const q = rects[j];
        if (p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h) {
          seen.add(id);
          pairs.push([i, j]);
        }
      }
    }
  }
  return pairs.sort((u, v) => u[0] - v[0] || u[1] - v[1]);
}

module.exports = findOverlaps;`,
    explanation:
      "A rect can only touch rects that share one of its grid cells, so instead of n-squared comparisons you only compare small groups per cell. Because indices are inserted in ascending order every cell list is already ascending, so each pair comes out as (smaller, larger). The Set handles a pair showing up in several cells, and the exact AABB test still runs afterwards because sharing a cell doesn't guarantee overlap.",
  },
};
