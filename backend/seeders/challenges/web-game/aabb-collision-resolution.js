export default {
  slug: "aabb-collision-resolution",
  trackId: "web-game",
  layerId: "web-game-1",
  type: "CODE",
  difficulty: "easy",
  title: "AABB collision detection + minimum push-out vector",
  summary:
    "Detect whether two axis-aligned rectangles overlap, and if they do, compute the smallest vector that separates them.",
  description:
    "Every 2D game — Canvas, Phaser, anything — needs this at its core. Detecting overlap is the easy half; computing how to un-overlap two boxes cleanly is the part that actually matters for gameplay feel.",
  task:
    "Write <code>resolveCollision(a, b)</code>. Each box is <code>{x, y, width, height}</code> where <code>(x, y)</code> is the top-left corner. Return <code>null</code> if the boxes don't overlap. If they do overlap, return <code>{x, y}</code> — the minimum translation vector to move box <code>a</code> by so it no longer overlaps <code>b</code> (moving along whichever single axis requires the smallest push).",
  constraints: [
    "Boxes that merely touch at an edge (zero-area overlap) count as not overlapping — return null.",
    "The returned vector must represent the smallest possible separation, not just any valid one — push along whichever axis (x or y) has the smaller overlap.",
    "Only one axis of the returned vector may be non-zero.",
  ],
  example: `resolveCollision({x:0,y:0,width:10,height:10}, {x:5,y:0,width:10,height:10});
// x-overlap is 5 (from x=5 to x=10), y-overlap is 10 (full height) — x is smaller
// => { x: -5, y: 0 }  (push box a left by 5 to separate)`,
  tags: ["collision", "vectors", "game-math"],
  estimatedMins: 25,
  xp: 40,
  starterFiles: [
    {
      name: "resolveCollision.js",
      lang: "js",
      code: `// resolveCollision.js
function resolveCollision(a, b) {
  // your code here
}

module.exports = resolveCollision;`,
    },
  ],
  testFile: {
    name: "resolveCollision_test.js",
    lang: "test",
    code: `// resolveCollision_test.js
const resolveCollision = require('./resolveCollision');

test('returns_null_when_not_overlapping', () => {
  const a = { x: 0, y: 0, width: 5, height: 5 };
  const b = { x: 10, y: 10, width: 5, height: 5 };
  expect(resolveCollision(a, b)).toBe(null);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Two boxes overlap when their ranges intersect on BOTH axes: <code>a.x < b.x + b.width && a.x + a.width > b.x</code>, and the same shape for y.",
    },
    {
      order: 2,
      cost: 5,
      text: "The overlap AMOUNT on each axis is <code>Math.min(a.x+a.width, b.x+b.width) - Math.max(a.x, b.x)</code> (and the analogous formula for y). Whichever axis has the smaller positive overlap is the one to push along.",
    },
    {
      order: 3,
      cost: 10,
      text: "Direction matters, not just magnitude: push box a AWAY from b's center — if a's center is to the left of b's center, the x push should be negative, not positive.",
    },
  ],
  hiddenTests: [
    {
      name: "no_overlap_returns_null",
      code: `const a = { x: 0, y: 0, width: 5, height: 5 };
const b = { x: 10, y: 10, width: 5, height: 5 };
assert(resolveCollision(a, b) === null, 'non-overlapping boxes must return null');`,
    },
    {
      name: "touching_edges_is_not_overlapping",
      code: `const a = { x: 0, y: 0, width: 5, height: 5 };
const b = { x: 5, y: 0, width: 5, height: 5 };
assert(resolveCollision(a, b) === null, 'boxes that only touch at an edge (zero-area overlap) must count as not overlapping');`,
    },
    {
      name: "pushes_along_the_smaller_overlap_axis",
      code: `const a = { x: 0, y: 0, width: 10, height: 10 };
const b = { x: 5, y: 0, width: 10, height: 10 };
const result = resolveCollision(a, b);
assert(result !== null, 'these boxes overlap and must not return null');
assert(result.y === 0, 'y-overlap is the full height here, so only x should be pushed: ' + JSON.stringify(result));
assert(Math.abs(result.x) === 5, 'x-overlap is 5, so the push magnitude on x must be 5, got ' + JSON.stringify(result));
assert(result.x < 0, 'a is to the left of b, so a must be pushed further left (negative x), got ' + JSON.stringify(result));`,
    },
    {
      name: "pushes_along_y_when_y_overlap_is_smaller",
      code: `const a = { x: 0, y: 0, width: 10, height: 10 };
const b = { x: 0, y: 5, width: 10, height: 10 };
const result = resolveCollision(a, b);
assert(result.x === 0, 'x-overlap is full width here, so only y should be pushed: ' + JSON.stringify(result));
assert(Math.abs(result.y) === 5 && result.y < 0, 'a is above b, so a must be pushed further up (negative y) by 5, got ' + JSON.stringify(result));`,
    },
    {
      name: "fully_contained_box_still_resolves",
      code: `const a = { x: 4, y: 4, width: 2, height: 2 };
const b = { x: 0, y: 0, width: 10, height: 10 };
const result = resolveCollision(a, b);
assert(result !== null, 'a fully-contained box still overlaps and must return a push vector, not null');
assert((result.x !== 0) !== (result.y !== 0), 'exactly one axis of the push vector must be non-zero, got ' + JSON.stringify(result));`,
    },
  ],
  solution: {
    code: `function resolveCollision(a, b) {
  const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

  if (overlapX <= 0 || overlapY <= 0) {
    return null;
  }

  const aCenterX = a.x + a.width / 2;
  const bCenterX = b.x + b.width / 2;
  const aCenterY = a.y + a.height / 2;
  const bCenterY = b.y + b.height / 2;

  if (overlapX < overlapY) {
    const direction = aCenterX < bCenterX ? -1 : 1;
    return { x: overlapX * direction, y: 0 };
  }

  const direction = aCenterY < bCenterY ? -1 : 1;
  return { y: overlapY * direction, x: 0 };
}

module.exports = resolveCollision;`,
    explanation:
      "The overlap amount on each axis is the width of the intersection of the two boxes' ranges on that axis — the smaller of the two right edges minus the larger of the two left edges (and the same shape for top/bottom on y). A positive value on both axes is what overlap actually means; either being zero or negative means the boxes don't overlap (and zero specifically catches the edge-touching case, since ≤0 is excluded rather than <0). Whichever axis has the smaller overlap magnitude is the cheapest way to separate the boxes — that's the axis that gets pushed, with the other left at zero. The direction (positive or negative) is decided by comparing box centers on that axis, so box a always gets pushed away from box b rather than potentially deeper into it.",
  },
};
