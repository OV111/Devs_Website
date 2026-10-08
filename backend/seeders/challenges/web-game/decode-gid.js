export default {
  slug: "decode-gid",
  trackId: "web-game",
  layerId: "web-game-2",
  type: "CODE",
  difficulty: "med",
  title: "Decode Tiled tile IDs (gid + flip flags)",
  summary: "Turn a raw Tiled map gid into a tileset, local tile index, flip flags and the source rectangle to draw from the tileset image.",
  description:
    "Phaser tilemaps are usually authored in the Tiled editor. Its JSON stores each cell as one 32-bit number (a 'gid') that packs three things: which tileset, which tile inside it, and three flip flags in the top bits. Reading those correctly is the difference between a map that renders and one full of mirrored garbage.",
  task:
    "Write <code>decodeGid(gid, tilesets)</code>. Each tileset is <code>{ name, firstgid, tilecount, columns, tilewidth, tileheight, margin = 0, spacing = 0 }</code> (not necessarily sorted).",
  constraints: [
    "The top bits are flags: <code>0x80000000</code> horizontal flip, <code>0x40000000</code> vertical flip, <code>0x20000000</code> diagonal flip, and <code>0x10000000</code> (hex rotation) which must simply be stripped. JavaScript bit-ops are signed 32-bit, so use <code>&gt;&gt;&gt; 0</code> to read the number as unsigned.",
    "The remaining bits are the global id. A global id of <code>0</code> (even with flags set) is an empty cell: return <code>null</code>.",
    "Find the tileset with the largest <code>firstgid</code> that is <code>&lt;= id</code>; <code>localId = id - firstgid</code>. If no tileset contains it (before every <code>firstgid</code>, or <code>localId &gt;= tilecount</code>) throw a <code>RangeError</code>.",
    "Return <code>{ tileset: name, localId, flipH, flipV, flipD, rect }</code> where <code>rect = { x, y, w, h }</code> is the tile's source rectangle in the tileset image: column <code>localId % columns</code>, row <code>floor(localId / columns)</code>, <code>x = margin + col * (tilewidth + spacing)</code>, same for <code>y</code>.",
  ],
  example: `decodeGid(0x80000005, [{ name: 'ground', firstgid: 1, tilecount: 16, columns: 4, tilewidth: 16, tileheight: 16 }]) // flipH: true, localId: 4, rect: { x: 0, y: 16, w: 16, h: 16 }`,
  tags: ["tiled", "tilemap", "bitwise", "phaser"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "decodeGid.js",
      lang: "js",
      code: `// decodeGid.js
function decodeGid(gid, tilesets) {
  // your code here
}

module.exports = decodeGid;`,
    },
  ],
  testFile: {
    name: "decodeGid_test.js",
    lang: "test",
    code: `const decodeGid = require('./decodeGid');
const ground = { name: 'ground', firstgid: 1, tilecount: 16, columns: 4, tilewidth: 16, tileheight: 16 };

test('plain tile', () => {
  const t = decodeGid(6, [ground]);
  expect(t.localId).toBe(5);
  expect(t.rect).toEqual({ x: 16, y: 16, w: 16, h: 16 });
});

test('empty cell', () => {
  expect(decodeGid(0, [ground])).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "<code>const raw = gid &gt;&gt;&gt; 0;</code> then <code>flipH = (raw &amp; 0x80000000) !== 0</code>. Mask the flags off with <code>raw &amp; 0x0fffffff</code> (that also strips the hex-rotation bit)." },
    { order: 2, cost: 5, text: "Sort a copy of the tilesets by <code>firstgid</code> descending and take the first with <code>firstgid &lt;= id</code>." },
    { order: 3, cost: 15, text: "Don't forget to check <code>localId &lt; tilecount</code> after picking the tileset: ids past the end belong to nothing." },
  ],
  hiddenTests: [
    { name: "plain_tile_and_source_rect", code: `const ground = { name: 'ground', firstgid: 1, tilecount: 16, columns: 4, tilewidth: 16, tileheight: 16 };
const t = decodeGid(6, [ground]);
assert(t.tileset === 'ground' && t.localId === 5, 'got ' + JSON.stringify(t));
assert(JSON.stringify(t.rect) === '{"x":16,"y":16,"w":16,"h":16}', 'rect ' + JSON.stringify(t.rect));
assert(t.flipH === false && t.flipV === false && t.flipD === false, 'no flips');` },
    { name: "empty_cells_are_null", code: `const ground = { name: 'ground', firstgid: 1, tilecount: 4, columns: 2, tilewidth: 8, tileheight: 8 };
assert(decodeGid(0, [ground]) === null, 'zero');
assert(decodeGid(0x80000000, [ground]) === null, 'zero with a flip flag');` },
    { name: "each_flip_flag_is_read_separately", code: `const ts = [{ name: 't', firstgid: 1, tilecount: 16, columns: 4, tilewidth: 16, tileheight: 16 }];
const h = decodeGid(0x80000005, ts);
assert(h.flipH && !h.flipV && !h.flipD && h.localId === 4, 'H ' + JSON.stringify(h));
const v = decodeGid(0x40000005, ts);
assert(!v.flipH && v.flipV && !v.flipD && v.localId === 4, 'V ' + JSON.stringify(v));
const d = decodeGid(0x20000005, ts);
assert(!d.flipH && !d.flipV && d.flipD && d.localId === 4, 'D ' + JSON.stringify(d));` },
    { name: "combined_flags_and_signed_numbers", code: `const ts = [{ name: 't', firstgid: 1, tilecount: 16, columns: 4, tilewidth: 16, tileheight: 16 }];
const all = decodeGid(0xe0000003, ts);
assert(all.flipH && all.flipV && all.flipD && all.localId === 2, 'all three: ' + JSON.stringify(all));
const negative = decodeGid(0xc0000003 | 0, ts);
assert(negative.flipH && negative.flipV && !negative.flipD && negative.localId === 2, 'a signed 32-bit input still decodes: ' + JSON.stringify(negative));` },
    { name: "hex_rotation_bit_is_stripped", code: `const ts = [{ name: 't', firstgid: 1, tilecount: 16, columns: 4, tilewidth: 16, tileheight: 16 }];
const t = decodeGid(0x10000005, ts);
assert(t.localId === 4 && !t.flipH && !t.flipV && !t.flipD, 'got ' + JSON.stringify(t));` },
    { name: "margin_and_spacing", code: `const ts = [{ name: 'sheet', firstgid: 1, tilecount: 12, columns: 4, tilewidth: 16, tileheight: 16, margin: 1, spacing: 2 }];
const t = decodeGid(6, ts);
assert(t.rect.x === 1 + 1 * 18 && t.rect.y === 1 + 1 * 18, 'rect ' + JSON.stringify(t.rect));
const first = decodeGid(1, ts);
assert(first.rect.x === 1 && first.rect.y === 1, 'first tile starts at the margin');` },
    { name: "picks_the_right_tileset_even_when_unsorted", code: `const a = { name: 'a', firstgid: 1, tilecount: 10, columns: 5, tilewidth: 8, tileheight: 8 };
const b = { name: 'b', firstgid: 11, tilecount: 6, columns: 3, tilewidth: 8, tileheight: 8 };
const list = [b, a];
assert(decodeGid(10, list).tileset === 'a' && decodeGid(10, list).localId === 9, 'last tile of a');
assert(decodeGid(11, list).tileset === 'b' && decodeGid(11, list).localId === 0, 'first tile of b');
assert(decodeGid(16, list).localId === 5 && decodeGid(16, list).rect.x === 16 && decodeGid(16, list).rect.y === 8, 'b rect ' + JSON.stringify(decodeGid(16, list).rect));` },
    { name: "unknown_ids_throw_range_error", code: `const b = { name: 'b', firstgid: 5, tilecount: 6, columns: 3, tilewidth: 8, tileheight: 8 };
let e1 = null, e2 = null;
try { decodeGid(3, [b]); } catch (e) { e1 = e; }
try { decodeGid(11, [b]); } catch (e) { e2 = e; }
assert(e1 instanceof RangeError, 'before the first tileset');
assert(e2 instanceof RangeError, 'past tilecount (5 + 6 = 11 is the first id that does not exist)');
assert(decodeGid(10, [b]).localId === 5, 'the last valid id still works');` },
    { name: "does_not_mutate_the_tileset_list", code: `const a = { name: 'a', firstgid: 1, tilecount: 4, columns: 2, tilewidth: 8, tileheight: 8 };
const b = { name: 'b', firstgid: 5, tilecount: 4, columns: 2, tilewidth: 8, tileheight: 8 };
const list = [a, b];
decodeGid(6, list);
assert(list[0] === a && list[1] === b, 'order preserved');` },
  ],
  solution: {
    code: `function decodeGid(gid, tilesets) {
  const raw = gid >>> 0;
  const flipH = (raw & 0x80000000) !== 0;
  const flipV = (raw & 0x40000000) !== 0;
  const flipD = (raw & 0x20000000) !== 0;
  const id = raw & 0x0fffffff;
  if (id === 0) return null;

  const ordered = [...tilesets].sort((a, b) => b.firstgid - a.firstgid);
  const tileset = ordered.find((t) => t.firstgid <= id);
  if (!tileset || id - tileset.firstgid >= tileset.tilecount) {
    throw new RangeError('gid ' + id + ' does not belong to any tileset');
  }

  const localId = id - tileset.firstgid;
  const margin = tileset.margin ?? 0;
  const spacing = tileset.spacing ?? 0;
  const col = localId % tileset.columns;
  const row = Math.floor(localId / tileset.columns);
  return {
    tileset: tileset.name,
    localId,
    flipH,
    flipV,
    flipD,
    rect: {
      x: margin + col * (tileset.tilewidth + spacing),
      y: margin + row * (tileset.tileheight + spacing),
      w: tileset.tilewidth,
      h: tileset.tileheight,
    },
  };
}

module.exports = decodeGid;`,
    explanation:
      "One number carries three kinds of information, so the decoder is mostly bit masks: peel the flags off the top, keep the low 28 bits as the id. The >>> 0 matters because a gid with the top bit set arrives as a large positive number but turns negative as soon as you apply a signed bit-op. Searching tilesets from the highest firstgid downwards is how Tiled itself resolves which tileset a gid belongs to.",
  },
};
