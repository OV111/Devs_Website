export default {
  slug: "create-animator",
  trackId: "web-game",
  layerId: "web-game-3",
  type: "CODE",
  difficulty: "hard",
  title: "Frame animation player",
  summary: "Play named frame animations at a frame rate with repeat, yoyo, pause and a completion callback, driven by delta time.",
  description:
    "Walk cycles, explosions and coin spins are all lists of frames shown at a fixed rate. Phaser's animation system hides the arithmetic; underneath, it turns elapsed time into a frame index, handles looping and ping-pong, and fires an event exactly once when a non-looping animation ends.",
  task:
    "Write <code>createAnimator(animations)</code> where <code>animations</code> maps a key to <code>{ frames: [...], frameRate = 10, repeat = 0, yoyo = false }</code>. Return <code>{ play, update, getFrame, isPlaying, pause, resume, stop, onComplete }</code>.",
  constraints: [
    "Each frame lasts <code>1000 / frameRate</code> ms. <code>update(dt)</code> adds <code>dt</code> ms (negative counts as 0) to the elapsed time of the current animation; the frame index is <code>floor(elapsed / frameDuration)</code> so one large <code>dt</code> can skip several frames.",
    "One pass of the animation is <code>frames</code>, or with <code>yoyo</code> <code>frames</code> followed by the frames reversed without the last one repeated (<code>a b c</code> becomes <code>a b c b a</code>). <code>repeat</code> is the number of EXTRA passes (<code>0</code> = play once, <code>2</code> = three passes, <code>-1</code> = loop forever). Passes are simply concatenated.",
    "<code>play(key, { ignoreIfPlaying = false } = {})</code> starts the animation from its first frame. If <code>ignoreIfPlaying</code> is true and that same key is already playing (not paused-then-stopped or finished), do nothing. An unknown key throws an <code>Error</code>.",
    "<code>getFrame()</code> returns the current frame value (<code>null</code> before any <code>play</code>). When a finite animation runs out, it holds its last frame, <code>isPlaying()</code> becomes false and every <code>onComplete</code> listener is called exactly once with the animation key. Infinite animations never complete.",
    "<code>pause()</code> / <code>resume()</code> freeze and unfreeze time (updates while paused do nothing). <code>stop()</code> halts without firing complete and keeps the current frame. <code>onComplete(fn)</code> returns an unsubscribe function.",
  ],
  example: `anim.play('run'); anim.update(250); anim.getFrame() // third frame at 10 fps`,
  tags: ["animation", "phaser", "sprites", "time"],
  estimatedMins: 45,
  xp: 75,
  starterFiles: [
    {
      name: "createAnimator.js",
      lang: "js",
      code: `// createAnimator.js
function createAnimator(animations) {
  // your code here
}

module.exports = createAnimator;`,
    },
  ],
  testFile: {
    name: "createAnimator_test.js",
    lang: "test",
    code: `const createAnimator = require('./createAnimator');

test('advances with time', () => {
  const a = createAnimator({ run: { frames: ['a', 'b', 'c'], frameRate: 10 } });
  a.play('run');
  expect(a.getFrame()).toBe('a');
  a.update(100);
  expect(a.getFrame()).toBe('b');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Store the current key, <code>elapsed</code>, and flags <code>playing</code> / <code>paused</code>. Everything else (the sequence, index, frame) can be recomputed from those." },
    { order: 2, cost: 5, text: "Build the pass sequence with <code>yoyo ? [...frames, ...frames.slice(0, -1).reverse()] : frames</code>. Total length for finite animations is <code>sequence.length * (repeat + 1)</code>." },
    { order: 3, cost: 15, text: "In <code>update</code>: if index &gt;= total (finite), clamp to the last frame, set <code>playing = false</code> and call the listeners once. For infinite loops use <code>index % sequence.length</code>." },
  ],
  hiddenTests: [
    { name: "frames_advance_with_time", code: `const a = createAnimator({ run: { frames: ['a', 'b', 'c', 'd'], frameRate: 10 } });
assert(a.getFrame() === null && a.isPlaying() === false, 'idle before play');
a.play('run');
assert(a.getFrame() === 'a' && a.isPlaying() === true, 'starts on the first frame');
a.update(99);
assert(a.getFrame() === 'a', 'still first at 99ms');
a.update(1);
assert(a.getFrame() === 'b', 'second at 100ms');
a.update(200);
assert(a.getFrame() === 'd', 'elapsed time accumulates: ' + a.getFrame());` },
    { name: "one_big_update_can_skip_frames", code: `const a = createAnimator({ run: { frames: [0, 1, 2, 3, 4], frameRate: 10, repeat: -1 } });
a.play('run');
a.update(350);
assert(a.getFrame() === 3, 'got ' + a.getFrame());` },
    { name: "plays_once_then_holds_the_last_frame_and_completes", code: `const done = [];
const a = createAnimator({ boom: { frames: ['x', 'y', 'z'], frameRate: 10 } });
a.onComplete((key) => done.push(key));
a.play('boom');
a.update(250);
assert(a.isPlaying() === true && a.getFrame() === 'z' && done.length === 0, 'last frame is shown for its full duration');
a.update(50);
assert(a.isPlaying() === false && a.getFrame() === 'z', 'finished, holds last frame');
assert(done.join(',') === 'boom', 'complete fired with the key: ' + done);
a.update(1000);
assert(done.length === 1, 'only once');` },
    { name: "repeat_counts_extra_passes", code: `const done = [];
const a = createAnimator({ blink: { frames: ['a', 'b'], frameRate: 10, repeat: 2 } });
a.onComplete(() => done.push(1));
a.play('blink');
a.update(450);
assert(a.isPlaying() === true && a.getFrame() === 'a', 'fifth frame of six is a: ' + a.getFrame());
a.update(150);
assert(a.isPlaying() === false && a.getFrame() === 'b' && done.length === 1, 'three passes of two frames = 600ms');` },
    { name: "infinite_loops_never_complete", code: `const done = [];
const a = createAnimator({ spin: { frames: ['a', 'b', 'c'], frameRate: 10, repeat: -1 } });
a.onComplete(() => done.push(1));
a.play('spin');
a.update(100000);
assert(a.isPlaying() === true && done.length === 0, 'keeps playing');
assert(a.getFrame() === 'b', 'frame index 1000 mod 3 = 1: ' + a.getFrame());` },
    { name: "yoyo_plays_there_and_back", code: `const a = createAnimator({ bounce: { frames: ['a', 'b', 'c'], frameRate: 10, yoyo: true } });
a.play('bounce');
const seen = [a.getFrame()];
for (let i = 0; i < 4; i++) { a.update(100); seen.push(a.getFrame()); }
assert(seen.join('') === 'abcba', 'got ' + seen.join(''));
assert(a.isPlaying() === false || a.getFrame() === 'a', 'ends on the first frame');` },
    { name: "yoyo_with_repeat_concatenates_passes", code: `const a = createAnimator({ b: { frames: [1, 2, 3], frameRate: 10, yoyo: true, repeat: 1 } });
a.play('b');
const seen = [a.getFrame()];
for (let i = 0; i < 9; i++) { a.update(100); seen.push(a.getFrame()); }
assert(seen.join('') === '1232112321', 'got ' + seen.join(''));` },
    { name: "play_restarts_unless_ignore_if_playing", code: `const a = createAnimator({ run: { frames: ['a', 'b', 'c'], frameRate: 10, repeat: -1 }, idle: { frames: ['i'], frameRate: 1, repeat: -1 } });
a.play('run'); a.update(150);
a.play('run', { ignoreIfPlaying: true });
assert(a.getFrame() === 'b', 'not restarted');
a.play('run');
assert(a.getFrame() === 'a', 'restarted');
a.update(150); a.play('idle', { ignoreIfPlaying: true });
assert(a.getFrame() === 'i', 'a different key always switches');` },
    { name: "pause_resume_and_stop", code: `const done = [];
const a = createAnimator({ run: { frames: ['a', 'b', 'c'], frameRate: 10 } });
a.onComplete(() => done.push(1));
a.play('run'); a.update(100);
a.pause();
a.update(1000);
assert(a.getFrame() === 'b', 'time is frozen while paused');
a.resume(); a.update(100);
assert(a.getFrame() === 'c', 'continues from where it left off');
a.play('run'); a.update(100);
a.stop();
assert(a.isPlaying() === false && a.getFrame() === 'b', 'stop keeps the frame');
a.update(1000);
assert(a.getFrame() === 'b' && done.length === 0, 'stopped animations do not advance or complete');` },
    { name: "unsubscribe_and_negative_dt", code: `const calls = [];
const a = createAnimator({ x: { frames: [1, 2], frameRate: 10 } });
const off = a.onComplete(() => calls.push('first'));
a.onComplete(() => calls.push('second'));
off();
a.play('x');
a.update(-500);
assert(a.getFrame() === 1, 'negative dt is ignored');
a.update(500);
assert(calls.join(',') === 'second', 'only the remaining listener: ' + calls);` },
    { name: "unknown_key_throws_and_single_frame_animations_work", code: `const a = createAnimator({ one: { frames: ['solo'], frameRate: 5 } });
let err = null;
try { a.play('nope'); } catch (e) { err = e; }
assert(err instanceof Error, 'unknown key');
a.play('one');
assert(a.getFrame() === 'solo', 'frame shown');
a.update(199);
assert(a.isPlaying() === true, 'still within its 200ms');
a.update(1);
assert(a.isPlaying() === false && a.getFrame() === 'solo', 'finished');` },
  ],
  solution: {
    code: `function createAnimator(animations) {
  let key = null;
  let elapsed = 0;
  let playing = false;
  let paused = false;
  let frame = null;
  const listeners = new Set();

  const info = () => {
    const def = animations[key];
    const frames = def.frames;
    const seq = def.yoyo ? [...frames, ...frames.slice(0, -1).reverse()] : frames;
    const repeat = def.repeat ?? 0;
    return {
      seq,
      duration: 1000 / (def.frameRate ?? 10),
      total: repeat < 0 ? Infinity : seq.length * (repeat + 1),
    };
  };

  return {
    play(k, { ignoreIfPlaying = false } = {}) {
      if (!Object.prototype.hasOwnProperty.call(animations, k)) throw new Error('Unknown animation: ' + k);
      if (ignoreIfPlaying && playing && key === k) return;
      key = k;
      elapsed = 0;
      playing = true;
      paused = false;
      frame = animations[k].frames[0];
    },
    update(dt) {
      if (!playing || paused) return;
      elapsed += Math.max(dt, 0);
      const { seq, duration, total } = info();
      const index = Math.floor(elapsed / duration);
      if (index >= total) {
        frame = seq[seq.length - 1];
        playing = false;
        for (const fn of [...listeners]) fn(key);
        return;
      }
      frame = seq[index % seq.length];
    },
    getFrame: () => frame,
    isPlaying: () => playing,
    pause() { paused = true; },
    resume() { paused = false; },
    stop() { playing = false; },
    onComplete(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

module.exports = createAnimator;`,
    explanation:
      "The animator stores only elapsed time and recomputes the frame from it, so a laggy frame with a huge delta lands on the right picture instead of drifting. A yoyo pass is the frames plus the reverse run without the turning point, and repeats are just those passes laid end to end, so one modulo handles every looping case. Completion is detected by index >= total, which makes 'fire exactly once' natural because playing flips to false at that moment.",
  },
};
