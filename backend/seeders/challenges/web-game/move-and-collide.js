export default {
  slug: "move-and-collide",
  trackId: "web-game",
  layerId: "web-game-2",
  type: "CODE",
  difficulty: "hard",
  title: "Move a box through a tile grid",
  summary: "Tilemap collision for platformers: move on one axis at a time, stop flush against solid tiles, never tunnel, and report which axis hit.",
  description:
    "Arcade-style tilemap collision is just 'move, then push back out'. Doing X and Y as separate steps (and sweeping tile by tile instead of teleporting) is what makes characters slide along walls, land on floors and never fall through thin tiles at high speed.",
  task:
    "Write <code>moveAndCollide(map, box, dx, dy)</code>. <code>map</code> is <code>{ tileSize, solid }</code> where <code>solid[row][col]</code> is truthy for solid tiles. <code>box</code> is <code>{ x, y, w, h }</code> in pixels (top-left origin). Return <code>{ x, y, hitX, hitY }</code>, the new top-left position and whether movement was blocked on each axis.",
  constraints: [
    "Resolve the X move completely first, then the Y move from the corrected X. Don't mutate <code>box</code>.",
    "Tiles outside the grid are empty. A box occupies the half-open pixel range <code>[x, x + w)</code>, so a box whose right edge is exactly on a tile's left edge is touching, not overlapping.",
    "A blocked move leaves the box FLUSH against the first solid tile in its path (for example moving right into column 3 with <code>tileSize 16</code> ends at <code>x = 48 - w</code>). It must check every tile column/row it crosses, so a huge <code>dx</code> can't jump over a one-tile wall.",
    "The box may be larger or smaller than a tile and need not be aligned to the grid: every row (for an X move) or column (for a Y move) that the box overlaps must be checked.",
    "<code>hitX</code> / <code>hitY</code> are true only if that move was actually shortened by a tile; a move of 0, or one that ends exactly flush with no further travel needed, is not a hit.",
  ],
  example: `moveAndCollide({ tileSize: 16, solid: [[0,0,0,1]] }, { x: 0, y: 0, w: 10, h: 10 }, 100, 0) // { x: 38, y: 0, hitX: true, hitY: false }`,
  tags: ["tilemap", "collision", "platformer", "physics"],
  estimatedMins: 50,
  xp: 85,
  starterFiles: [
    {
      name: "moveAndCollide.js",
      lang: "js",
      code: `// moveAndCollide.js
function moveAndCollide(map, box, dx, dy) {
  // your code here
}

module.exports = moveAndCollide;`,
    },
  ],
  testFile: {
    name: "moveAndCollide_test.js",
    lang: "test",
    code: `const moveAndCollide = require('./moveAndCollide');
const map = { tileSize: 16, solid: [[0, 0, 0, 1], [0, 0, 0, 1]] };

test('stops flush against a wall', () => {
  const r = moveAndCollide(map, { x: 0, y: 0, w: 10, h: 10 }, 100, 0);
  expect(r).toEqual({ x: 38, y: 0, hitX: true, hitY: false });
});

test('free movement', () => {
  const r = moveAndCollide(map, { x: 0, y: 0, w: 10, h: 10 }, 5, 3);
  expect(r).toEqual({ x: 5, y: 3, hitX: false, hitY: false });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write <code>isSolid(col, row)</code> that returns false outside the grid. Then write the X move and Y move as two near-mirror-image functions." },
    { order: 2, cost: 5, text: "Moving right: the box currently occupies up to column <code>ceil(right / ts) - 1</code>, so the first NEW column is <code>ceil(right / ts)</code>. Loop columns while <code>col * ts &lt; targetRight</code>, checking all rows from <code>floor(y / ts)</code> to <code>ceil((y + h) / ts) - 1</code>." },
    { order: 3, cost: 15, text: "When a solid tile is found: <code>x = col * ts - w</code> (moving right) or <code>(col + 1) * ts</code> (moving left), set <code>hit</code> and stop. Moving left walks columns downward starting at <code>ceil(left / ts) - 1</code>." },
  ],
  hiddenTests: [
    { name: "free_movement", code: `const map = { tileSize: 16, solid: [[0, 0, 0, 0], [0, 0, 0, 0]] };
const r = moveAndCollide(map, { x: 1, y: 2, w: 10, h: 10 }, 5, 3);
assert(r.x === 6 && r.y === 5 && r.hitX === false && r.hitY === false, 'got ' + JSON.stringify(r));` },
    { name: "stops_flush_against_a_wall_on_the_right", code: `const map = { tileSize: 16, solid: [[0, 0, 0, 1], [0, 0, 0, 1]] };
const r = moveAndCollide(map, { x: 0, y: 0, w: 10, h: 10 }, 100, 0);
assert(r.x === 38 && r.hitX === true && r.y === 0 && r.hitY === false, 'got ' + JSON.stringify(r));` },
    { name: "stops_flush_against_a_wall_on_the_left", code: `const map = { tileSize: 16, solid: [[1, 0, 0, 0], [1, 0, 0, 0]] };
const r = moveAndCollide(map, { x: 40, y: 0, w: 10, h: 10 }, -100, 0);
assert(r.x === 16 && r.hitX === true, 'got ' + JSON.stringify(r));` },
    { name: "lands_on_a_floor_and_hits_a_ceiling", code: `const floor = { tileSize: 16, solid: [[0, 0], [0, 0], [1, 1]] };
const down = moveAndCollide(floor, { x: 0, y: 0, w: 10, h: 10 }, 0, 100);
assert(down.y === 22 && down.hitY === true && down.hitX === false, 'floor at row 2 (y=32): ' + JSON.stringify(down));
const ceil = { tileSize: 16, solid: [[1, 1], [0, 0], [0, 0]] };
const up = moveAndCollide(ceil, { x: 0, y: 40, w: 10, h: 10 }, 0, -100);
assert(up.y === 16 && up.hitY === true, 'ceiling: ' + JSON.stringify(up));` },
    { name: "already_flush_is_not_a_hit_when_not_moving_into_it", code: `const map = { tileSize: 16, solid: [[0, 0, 0, 1]] };
const away = moveAndCollide(map, { x: 38, y: 0, w: 10, h: 10 }, -5, 0);
assert(away.x === 33 && away.hitX === false, 'moving away from the wall: ' + JSON.stringify(away));
const still = moveAndCollide(map, { x: 38, y: 0, w: 10, h: 10 }, 0, 0);
assert(still.x === 38 && still.hitX === false && still.hitY === false, 'standing still');
const into = moveAndCollide(map, { x: 38, y: 0, w: 10, h: 10 }, 5, 0);
assert(into.x === 38 && into.hitX === true, 'pushing into a wall you already touch: ' + JSON.stringify(into));` },
    { name: "never_tunnels_through_a_thin_wall", code: `const map = { tileSize: 16, solid: [[0, 0, 1, 0, 0, 0, 0, 0]] };
const r = moveAndCollide(map, { x: 0, y: 0, w: 8, h: 8 }, 120, 0);
assert(r.x === 24 && r.hitX === true, 'blocked by the single wall tile at col 2: ' + JSON.stringify(r));` },
    { name: "slides_along_a_wall", code: `const map = { tileSize: 16, solid: [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]] };
const r = moveAndCollide(map, { x: 16, y: 0, w: 10, h: 10 }, 30, 20);
assert(r.x === 22 && r.hitX === true, 'x blocked: ' + JSON.stringify(r));
assert(r.y === 20 && r.hitY === false, 'y still moves: ' + JSON.stringify(r));` },
    { name: "checks_every_row_the_box_overlaps", code: `const map = { tileSize: 16, solid: [[0, 0, 0], [0, 0, 1], [0, 0, 0]] };
const tall = moveAndCollide(map, { x: 0, y: 8, w: 10, h: 24 }, 100, 0);
assert(tall.hitX === true && tall.x === 22, 'a 24px-tall box spans rows 0-2 and hits row 1: ' + JSON.stringify(tall));
const above = moveAndCollide(map, { x: 0, y: 0, w: 10, h: 10 }, 100, 0);
assert(above.hitX === false && above.x === 100, 'a box that only occupies row 0 passes: ' + JSON.stringify(above));` },
    { name: "unaligned_positions_and_y_resolves_after_x", code: `const map = { tileSize: 16, solid: [[0, 0, 0], [0, 0, 0], [1, 1, 1]] };
const r = moveAndCollide(map, { x: 3, y: 5, w: 9, h: 9 }, 7, 40);
assert(r.x === 10 && r.hitX === false, 'x free');
assert(r.y === 23 && r.hitY === true, 'floor at y=32: ' + JSON.stringify(r));` },
    { name: "outside_the_grid_is_empty_and_input_is_not_mutated", code: `const map = { tileSize: 16, solid: [[1]] };
const box = { x: 100, y: 100, w: 10, h: 10 };
const r = moveAndCollide(map, box, 50, -300);
assert(r.x === 150 && r.y === -200 && !r.hitX && !r.hitY, 'free outside the map: ' + JSON.stringify(r));
assert(box.x === 100 && box.y === 100, 'input untouched');` },
    { name: "diagonal_into_a_corner_hits_both_axes", code: `const map = { tileSize: 16, solid: [[0, 0, 0, 1], [0, 0, 0, 1], [1, 1, 1, 1]] };
const r = moveAndCollide(map, { x: 20, y: 10, w: 10, h: 10 }, 100, 100);
assert(r.hitX === true && r.hitY === true, 'both hit: ' + JSON.stringify(r));
assert(r.x === 38 && r.y === 22, 'tucked into the corner: ' + JSON.stringify(r));` },
  ],
  solution: {
    code: `function moveAndCollide(map, box, dx, dy) {
  const ts = map.tileSize;
  const solid = map.solid;
  const isSolid = (col, row) => row >= 0 && row < solid.length && col >= 0 && col < solid[row].length && !!solid[row][col];
  const anyInRows = (col, top, bottom) => {
    for (let row = Math.floor(top / ts); row <= Math.ceil(bottom / ts) - 1; row++) {
      if (isSolid(col, row)) return true;
    }
    return false;
  };
  const anyInCols = (row, left, right) => {
    for (let col = Math.floor(left / ts); col <= Math.ceil(right / ts) - 1; col++) {
      if (isSolid(col, row)) return true;
    }
    return false;
  };

  let { x, y } = box;
  const { w, h } = box;
  let hitX = false;
  let hitY = false;

  if (dx > 0) {
    const target = x + w + dx;
    for (let col = Math.ceil((x + w) / ts); col * ts < target; col++) {
      if (anyInRows(col, y, y + h)) {
        x = col * ts - w;
        hitX = true;
        break;
      }
    }
    if (!hitX) x += dx;
  } else if (dx < 0) {
    const target = x + dx;
    for (let col = Math.ceil(x / ts) - 1; (col + 1) * ts > target; col--) {
      if (anyInRows(col, y, y + h)) {
        x = (col + 1) * ts;
        hitX = true;
        break;
      }
    }
    if (!hitX) x += dx;
  }

  if (dy > 0) {
    const target = y + h + dy;
    for (let row = Math.ceil((y + h) / ts); row * ts < target; row++) {
      if (anyInCols(row, x, x + w)) {
        y = row * ts - h;
        hitY = true;
        break;
      }
    }
    if (!hitY) y += dy;
  } else if (dy < 0) {
    const target = y + dy;
    for (let row = Math.ceil(y / ts) - 1; (row + 1) * ts > target; row--) {
      if (anyInCols(row, x, x + w)) {
        y = (row + 1) * ts;
        hitY = true;
        break;
      }
    }
    if (!hitY) y += dy;
  }

  return { x, y, hitX, hitY };
}

module.exports = moveAndCollide;`,
    explanation:
      "Instead of moving first and untangling overlaps afterwards, the box is swept one tile column (or row) at a time and stops at the first solid tile, so speed can never make it skip over a wall. Moving X before Y is what lets the character slide along a wall: the blocked axis is clamped while the other still advances. Using half-open pixel ranges makes 'standing flush against a tile' unambiguous.",
  },
};
