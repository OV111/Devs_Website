export default {
  slug: "flex-row-layout",
  trackId: "mern",
  layerId: "mern-1",
  type: "CODE",
  difficulty: "hard",
  title: "Flexbox: resolve flexible lengths",
  summary: "Compute the final widths of items in a single flex row: grow, shrink, min/max clamping and gaps.",
  description:
    "Flexbox looks like magic until you see the algorithm: start from each item's <code>flex-basis</code>, share out the free (or negative) space by <code>flex-grow</code> / <code>flex-shrink</code>, and when an item hits its <code>min-width</code> or <code>max-width</code> freeze it and share the rest again. Implement it.",
  task:
    "Write <code>layoutRow(containerWidth, items, gap = 0)</code>. Each item is <code>{ basis, grow = 0, shrink = 1, min = 0, max = Infinity }</code>. Return an array of final widths, one per item (empty array for no items).",
  constraints: [
    "Usable space is <code>containerWidth - gap * (items - 1)</code>. Each item's starting size is its <code>basis</code> clamped to <code>[min, max]</code>. If the starting sizes add up to LESS than the usable space the row GROWS, otherwise it SHRINKS.",
    "Growing: free space is shared in proportion to <code>grow</code>. If the grow factors add up to less than 1, only that fraction of the free space is handed out. Shrinking: negative space is shared in proportion to <code>shrink * basis</code> (bigger items give up more).",
    "Items whose relevant factor is 0 are frozen at their clamped basis from the start.",
    "Repeat: compute each unfrozen item's tentative size, clamp it to <code>[min, max]</code>, add up how far the clamps moved the sizes. If the total is 0 freeze everything; if positive freeze the items that hit a MIN; if negative freeze the ones that hit a MAX. Then redistribute among the rest until all are frozen.",
    "Widths may be fractional; the tests compare with a tiny tolerance.",
  ],
  example: `layoutRow(600, [{ basis: 100, grow: 1 }, { basis: 100, grow: 3 }]) // [200, 400]`,
  tags: ["css", "flexbox", "layout", "algorithms"],
  estimatedMins: 50,
  xp: 80,
  starterFiles: [
    {
      name: "layoutRow.js",
      lang: "js",
      code: `// layoutRow.js
function layoutRow(containerWidth, items, gap = 0) {
  // your code here
}

module.exports = layoutRow;`,
    },
  ],
  testFile: {
    name: "layoutRow_test.js",
    lang: "test",
    code: `const layoutRow = require('./layoutRow');

test('proportional grow', () => {
  expect(layoutRow(600, [{ basis: 100, grow: 1 }, { basis: 100, grow: 3 }])).toEqual([200, 400]);
});

test('no grow keeps the basis', () => {
  expect(layoutRow(500, [{ basis: 100 }, { basis: 100 }])).toEqual([100, 100]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Decide grow vs shrink once, up front, from the clamped base sizes. Keep two parallel arrays: <code>size[]</code> and <code>frozen[]</code>." },
    { order: 2, cost: 5, text: "Each loop: free = usable - (frozen sizes) - (unfrozen BASES). Tentative size = basis + free * factor / totalFactor, where factor is <code>grow</code> or <code>shrink * basis</code>." },
    { order: 3, cost: 15, text: "Violation = clamped - tentative per item; sum them. Freeze min-violators when the sum is positive, max-violators when negative, everyone when it is ~0. Guard totalFactor === 0." },
  ],
  hiddenTests: [
    { name: "no_grow_keeps_basis", code: `const r = layoutRow(500, [{ basis: 100 }, { basis: 100 }]);
assert(r.length === 2 && r[0] === 100 && r[1] === 100, 'got ' + JSON.stringify(r));` },
    { name: "equal_grow_splits_free_space", code: `const r = layoutRow(500, [{ basis: 100, grow: 1 }, { basis: 100, grow: 1 }]);
assert(Math.abs(r[0] - 250) < 1e-9 && Math.abs(r[1] - 250) < 1e-9, 'got ' + JSON.stringify(r));` },
    { name: "proportional_grow", code: `const r = layoutRow(600, [{ basis: 100, grow: 1 }, { basis: 100, grow: 3 }]);
assert(Math.abs(r[0] - 200) < 1e-9 && Math.abs(r[1] - 400) < 1e-9, 'got ' + JSON.stringify(r));` },
    { name: "gap_reduces_usable_space", code: `const r = layoutRow(500, [{ basis: 100, grow: 1 }, { basis: 100, grow: 1 }], 20);
assert(Math.abs(r[0] - 240) < 1e-9 && Math.abs(r[1] - 240) < 1e-9, 'free = 500 - 20 - 200 = 280; got ' + JSON.stringify(r));` },
    { name: "shrink_is_weighted_by_basis", code: `const r = layoutRow(200, [{ basis: 300 }, { basis: 100 }]);
assert(Math.abs(r[0] - 150) < 1e-9 && Math.abs(r[1] - 50) < 1e-9, 'overflow 200 split 3:1; got ' + JSON.stringify(r));` },
    { name: "shrink_zero_items_are_frozen", code: `const r = layoutRow(250, [{ basis: 100, shrink: 0 }, { basis: 300, shrink: 1 }]);
assert(Math.abs(r[0] - 100) < 1e-9 && Math.abs(r[1] - 150) < 1e-9, 'got ' + JSON.stringify(r));` },
    { name: "max_clamp_redistributes", code: `const r = layoutRow(500, [{ basis: 0, grow: 1, max: 100 }, { basis: 0, grow: 1 }]);
assert(Math.abs(r[0] - 100) < 1e-9 && Math.abs(r[1] - 400) < 1e-9, 'second item takes the rest; got ' + JSON.stringify(r));` },
    { name: "min_clamp_redistributes_when_shrinking", code: `const r = layoutRow(300, [{ basis: 200, min: 180 }, { basis: 200 }]);
assert(Math.abs(r[0] - 180) < 1e-9 && Math.abs(r[1] - 120) < 1e-9, 'got ' + JSON.stringify(r));` },
    { name: "grow_factors_below_one_take_a_fraction", code: `const r = layoutRow(300, [{ basis: 100, grow: 0.5 }]);
assert(Math.abs(r[0] - 200) < 1e-9, 'half of the 200 free: got ' + JSON.stringify(r));
const s = layoutRow(300, [{ basis: 100, grow: 0.25 }, { basis: 100, grow: 0.25 }]);
assert(Math.abs(s[0] - 125) < 1e-9 && Math.abs(s[1] - 125) < 1e-9, 'sum 0.5 hands out half of the 100 free: got ' + JSON.stringify(s));` },
    { name: "cannot_shrink_below_min", code: `const r = layoutRow(100, [{ basis: 200, min: 200 }, { basis: 200, min: 200 }]);
assert(r[0] === 200 && r[1] === 200, 'overflow is allowed when everything is at min; got ' + JSON.stringify(r));` },
    { name: "edge_cases", code: `assert(layoutRow(100, []).length === 0, 'no items');
const one = layoutRow(400, [{ basis: 50, grow: 1 }]);
assert(Math.abs(one[0] - 400) < 1e-9, 'single item fills the row');
const none = layoutRow(400, [{ basis: 50 }, { basis: 70 }]);
assert(none[0] === 50 && none[1] === 70, 'leftover space stays unused without grow');` },
    { name: "basis_larger_than_max_is_capped", code: `const r = layoutRow(1000, [{ basis: 500, grow: 1, max: 300 }, { basis: 100, grow: 1 }]);
assert(Math.abs(r[0] - 300) < 1e-9 && Math.abs(r[1] - 700) < 1e-9, 'got ' + JSON.stringify(r));` },
  ],
  solution: {
    code: `function layoutRow(containerWidth, items, gap = 0) {
  const n = items.length;
  if (n === 0) return [];
  const spec = items.map((it) => ({
    basis: it.basis ?? 0,
    grow: it.grow ?? 0,
    shrink: it.shrink ?? 1,
    min: it.min ?? 0,
    max: it.max ?? Infinity,
  }));
  const clamp = (it, v) => Math.min(it.max, Math.max(it.min, v));
  const hypothetical = spec.map((it) => clamp(it, it.basis));
  const avail = containerWidth - gap * (n - 1);
  const growing = hypothetical.reduce((a, b) => a + b, 0) < avail;

  const size = new Array(n).fill(0);
  const frozen = new Array(n).fill(false);
  spec.forEach((it, i) => {
    const factor = growing ? it.grow : it.shrink;
    if (factor === 0 || (growing && it.basis > hypothetical[i]) || (!growing && it.basis < hypothetical[i])) {
      frozen[i] = true;
      size[i] = hypothetical[i];
    }
  });

  const factorOf = (it) => (growing ? it.grow : it.shrink * it.basis);

  while (frozen.some((f) => !f)) {
    let free = avail;
    let total = 0;
    spec.forEach((it, i) => {
      if (frozen[i]) free -= size[i];
      else { free -= it.basis; total += factorOf(it); }
    });
    if (growing && total < 1) free *= total;

    let violation = 0;
    const viol = new Array(n).fill(0);
    spec.forEach((it, i) => {
      if (frozen[i]) return;
      const tentative = total > 0 ? it.basis + (free * factorOf(it)) / total : it.basis;
      const clamped = clamp(it, tentative);
      viol[i] = clamped - tentative;
      violation += viol[i];
      size[i] = clamped;
    });

    spec.forEach((it, i) => {
      if (frozen[i]) return;
      if (Math.abs(violation) < 1e-9) frozen[i] = true;
      else if (violation > 0 && viol[i] > 1e-9) frozen[i] = true;
      else if (violation < 0 && viol[i] < -1e-9) frozen[i] = true;
    });
  }
  return size;
}

module.exports = layoutRow;`,
    explanation:
      "This is the CSS 'resolve flexible lengths' loop. Clamping one item breaks the proportional split, so its violation is measured and the offenders are frozen at their limit; the next pass then shares what is left among the items still free. Shrinking weights by shrink * basis because a large item has more to give up, which is why two items with the same shrink factor don't lose equal pixels.",
  },
};
