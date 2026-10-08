export default {
  slug: "atlas-frames",
  trackId: "web-game",
  layerId: "web-game-3",
  type: "CODE",
  difficulty: "med",
  title: "Texture atlas frames and trimmed sprites",
  summary: "Generate numbered frame names and work out where to draw a trimmed, possibly rotated atlas frame so it lines up with the untrimmed sprite.",
  description:
    "Packers like TexturePacker squeeze many sprites into one atlas image, cropping transparent borders ('trimmed') and sometimes rotating frames 90 degrees to save space. Drawing such a frame at the character's position without compensating makes the sprite jump around between animation frames.",
  task:
    "Write <code>generateFrameNames(options)</code>, <code>drawInfo(atlas, name)</code> and <code>drawPosition(info, x, y, originX = 0.5, originY = 0.5)</code>.",
  constraints: [
    "<code>generateFrameNames({ prefix = '', start = 0, end = 0, zeroPad = 0, suffix = '' })</code> returns names <code>prefix + number + suffix</code> for each integer from <code>start</code> to <code>end</code> inclusive (counting DOWN when <code>end &lt; start</code>), the number left-padded with zeros to <code>zeroPad</code> digits: <code>run_01.png</code>.",
    "<code>atlas.frames[name]</code> looks like <code>{ frame: {x,y,w,h}, rotated, trimmed, spriteSourceSize: {x,y,w,h}, sourceSize: {w,h} }</code>. <code>frame</code> is the rectangle on the sheet as packed. An unknown name throws an <code>Error</code> containing the name.",
    "<code>drawInfo</code> returns <code>{ sheetRect, size, offset, original, rotated }</code>: <code>sheetRect</code> is <code>frame</code>; <code>size</code> is the on-screen size of the cropped image (for a rotated frame the packed <code>w</code> and <code>h</code> are swapped back); <code>offset</code> is <code>spriteSourceSize.x/y</code> when trimmed, else <code>{x: 0, y: 0}</code>; <code>original</code> is <code>sourceSize</code> (or <code>size</code> if absent).",
    "<code>drawPosition</code> returns the top-left <code>{ x, y }</code> at which to draw the cropped image so the ORIGINAL sprite's origin point (fractions <code>originX/originY</code> of its untrimmed size) sits on <code>(x, y)</code>: <code>x - original.w * originX + offset.x</code>.",
  ],
  example: `drawPosition(drawInfo(atlas, 'idle'), 100, 100) // top-left to draw the trimmed idle frame`,
  tags: ["sprites", "texture-atlas", "phaser", "rendering"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "atlasFrames.js",
      lang: "js",
      code: `// atlasFrames.js
function generateFrameNames(options) {
  // your code here
}

function drawInfo(atlas, name) {
  // your code here
}

function drawPosition(info, x, y, originX = 0.5, originY = 0.5) {
  // your code here
}

module.exports = { generateFrameNames, drawInfo, drawPosition };`,
    },
  ],
  testFile: {
    name: "atlasFrames_test.js",
    lang: "test",
    code: `const { generateFrameNames } = require('./atlasFrames');

test('padded names', () => {
  expect(generateFrameNames({ prefix: 'run_', start: 1, end: 3, zeroPad: 2, suffix: '.png' })).toEqual(['run_01.png', 'run_02.png', 'run_03.png']);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "<code>String(n).padStart(zeroPad, '0')</code> does the padding. Loop with a step of <code>start &lt;= end ? 1 : -1</code>." },
    { order: 2, cost: 5, text: "For a rotated frame the sheet stores width and height swapped, so the drawn size is <code>{ w: frame.h, h: frame.w }</code>." },
    { order: 3, cost: 15, text: "The trimmed image starts <code>offset</code> pixels inside the original sprite, so add the offset after positioning the original's top-left." },
  ],
  hiddenTests: [
    { name: "frame_names_with_padding", code: `const n = generateFrameNames({ prefix: 'run_', start: 1, end: 4, zeroPad: 2, suffix: '.png' });
assert(JSON.stringify(n) === '["run_01.png","run_02.png","run_03.png","run_04.png"]', 'got ' + JSON.stringify(n));` },
    { name: "frame_names_defaults_and_wide_numbers", code: `assert(JSON.stringify(generateFrameNames({ start: 8, end: 11 })) === '["8","9","10","11"]', 'no padding');
assert(JSON.stringify(generateFrameNames({ prefix: 'f', start: 98, end: 101, zeroPad: 2 })) === '["f98","f99","f100","f101"]', 'padding never truncates');
assert(JSON.stringify(generateFrameNames({})) === '["0"]', 'defaults give a single frame');` },
    { name: "frame_names_count_down", code: `const n = generateFrameNames({ prefix: 'a', start: 3, end: 1 });
assert(JSON.stringify(n) === '["a3","a2","a1"]', 'got ' + JSON.stringify(n));` },
    { name: "untrimmed_frame", code: `const atlas = { frames: { hero: { frame: { x: 10, y: 20, w: 32, h: 48 }, rotated: false, trimmed: false, sourceSize: { w: 32, h: 48 } } } };
const info = drawInfo(atlas, 'hero');
assert(JSON.stringify(info.sheetRect) === '{"x":10,"y":20,"w":32,"h":48}', 'sheet rect');
assert(info.size.w === 32 && info.size.h === 48, 'size');
assert(info.offset.x === 0 && info.offset.y === 0, 'no offset');
assert(info.original.w === 32 && info.original.h === 48 && info.rotated === false, 'original');` },
    { name: "trimmed_frame_keeps_the_offset", code: `const atlas = { frames: { idle: { frame: { x: 0, y: 0, w: 20, h: 30 }, rotated: false, trimmed: true, spriteSourceSize: { x: 6, y: 4, w: 20, h: 30 }, sourceSize: { w: 32, h: 40 } } } };
const info = drawInfo(atlas, 'idle');
assert(info.offset.x === 6 && info.offset.y === 4, 'offset ' + JSON.stringify(info.offset));
assert(info.original.w === 32 && info.original.h === 40, 'original size');
assert(info.size.w === 20 && info.size.h === 30, 'cropped size');` },
    { name: "rotated_frames_swap_width_and_height", code: `const atlas = { frames: { jump: { frame: { x: 5, y: 5, w: 30, h: 20 }, rotated: true, trimmed: false, sourceSize: { w: 20, h: 30 } } } };
const info = drawInfo(atlas, 'jump');
assert(info.rotated === true, 'flag');
assert(info.size.w === 20 && info.size.h === 30, 'size is un-rotated: ' + JSON.stringify(info.size));
assert(info.sheetRect.w === 30 && info.sheetRect.h === 20, 'sheet rect is as packed');` },
    { name: "missing_source_size_falls_back_to_the_cropped_size", code: `const atlas = { frames: { a: { frame: { x: 0, y: 0, w: 8, h: 9 }, rotated: false, trimmed: false } } };
const info = drawInfo(atlas, 'a');
assert(info.original.w === 8 && info.original.h === 9, 'got ' + JSON.stringify(info.original));` },
    { name: "unknown_frame_throws_with_the_name", code: `let err = null;
try { drawInfo({ frames: {} }, 'ghost'); } catch (e) { err = e; }
assert(err instanceof Error && /ghost/.test(err.message), 'got ' + (err && err.message));
let err2 = null;
try { drawInfo({ frames: {} }, 'toString'); } catch (e) { err2 = e; }
assert(err2 instanceof Error, 'inherited keys are not frames');` },
    { name: "draw_position_centres_the_original_sprite", code: `const atlas = { frames: {
  full: { frame: { x: 0, y: 0, w: 32, h: 40 }, rotated: false, trimmed: false, sourceSize: { w: 32, h: 40 } },
  trim: { frame: { x: 0, y: 0, w: 20, h: 30 }, rotated: false, trimmed: true, spriteSourceSize: { x: 6, y: 4, w: 20, h: 30 }, sourceSize: { w: 32, h: 40 } } } };
const full = drawPosition(drawInfo(atlas, 'full'), 100, 100);
assert(full.x === 84 && full.y === 80, 'default origin 0.5: ' + JSON.stringify(full));
const trimmed = drawPosition(drawInfo(atlas, 'trim'), 100, 100);
assert(trimmed.x === 90 && trimmed.y === 84, 'trim offset added: ' + JSON.stringify(trimmed));` },
    { name: "draw_position_with_custom_origin", code: `const atlas = { frames: { t: { frame: { x: 0, y: 0, w: 20, h: 30 }, rotated: false, trimmed: true, spriteSourceSize: { x: 6, y: 4, w: 20, h: 30 }, sourceSize: { w: 32, h: 40 } } } };
const info = drawInfo(atlas, 't');
const feet = drawPosition(info, 100, 200, 0.5, 1);
assert(feet.x === 90 && feet.y === 164, 'bottom-centre origin: ' + JSON.stringify(feet));
const topLeft = drawPosition(info, 100, 200, 0, 0);
assert(topLeft.x === 106 && topLeft.y === 204, 'top-left origin: ' + JSON.stringify(topLeft));` },
  ],
  solution: {
    code: `function generateFrameNames({ prefix = '', start = 0, end = 0, zeroPad = 0, suffix = '' } = {}) {
  const names = [];
  const step = start <= end ? 1 : -1;
  for (let n = start; step > 0 ? n <= end : n >= end; n += step) {
    names.push(prefix + String(n).padStart(zeroPad, '0') + suffix);
  }
  return names;
}

function drawInfo(atlas, name) {
  if (!Object.prototype.hasOwnProperty.call(atlas.frames, name)) {
    throw new Error('Frame not found: ' + name);
  }
  const f = atlas.frames[name];
  const size = f.rotated ? { w: f.frame.h, h: f.frame.w } : { w: f.frame.w, h: f.frame.h };
  const offset = f.trimmed && f.spriteSourceSize
    ? { x: f.spriteSourceSize.x, y: f.spriteSourceSize.y }
    : { x: 0, y: 0 };
  return {
    sheetRect: { ...f.frame },
    size,
    offset,
    original: f.sourceSize ? { w: f.sourceSize.w, h: f.sourceSize.h } : { ...size },
    rotated: !!f.rotated,
  };
}

function drawPosition(info, x, y, originX = 0.5, originY = 0.5) {
  return {
    x: x - info.original.w * originX + info.offset.x,
    y: y - info.original.h * originY + info.offset.y,
  };
}

module.exports = { generateFrameNames, drawInfo, drawPosition };`,
    explanation:
      "Trimming removes transparent borders, so the cropped image is smaller than the sprite artists drew and its position inside it is stored as an offset. Anchoring to the ORIGINAL size and then adding the offset keeps every animation frame aligned even though each one is cropped differently. Rotation only changes how the pixels are stored on the sheet, which is why the size is swapped back for rendering.",
  },
};
