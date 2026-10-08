export default {
  slug: "input-state-tracker",
  trackId: "web-game",
  layerId: "web-game-1",
  type: "CODE",
  difficulty: "med",
  title: "Keyboard input state with press/release edges",
  summary: "Track which keys are held, which were pressed or released this frame, ignore key-repeat, and release everything when focus is lost.",
  description:
    "Games poll input every frame instead of reacting to events: 'is Space down?', 'was Space just pressed (jump once)?'. Browser <code>keydown</code> events also auto-repeat while a key is held, and keys get stuck if the window loses focus mid-press. A small input tracker turns the raw event stream into clean per-frame state.",
  task:
    "Write <code>createInput()</code> returning <code>{ keyDown, keyUp, blur, isDown, wasPressed, wasReleased, axis, endFrame }</code>. Keys are identified by <code>KeyboardEvent.code</code> strings such as <code>'Space'</code> or <code>'ArrowLeft'</code>.",
  constraints: [
    "<code>keyDown(code)</code> marks the key held. Only a key that was NOT already held counts as 'pressed' this frame, so auto-repeat events change nothing. <code>keyUp(code)</code> releases a held key and records a 'released' edge; releasing a key that isn't held is ignored.",
    "<code>isDown(code)</code> is true while held. <code>wasPressed(code)</code> / <code>wasReleased(code)</code> are true if that edge happened since the last <code>endFrame()</code>. A quick tap inside one frame makes both true.",
    "<code>endFrame()</code> clears the pressed and released edges but keeps the held keys.",
    "<code>blur()</code> (window lost focus) releases every held key, recording a released edge for each.",
    "<code>axis(negative, positive)</code> returns <code>-1</code>, <code>0</code> or <code>1</code> from two codes: only the positive held gives 1, only the negative gives -1, both or neither give 0.",
  ],
  example: `input.keyDown('Space'); input.wasPressed('Space') // true; input.endFrame(); input.wasPressed('Space') // false; input.isDown('Space') // true`,
  tags: ["input", "keyboard", "game-loop", "state"],
  estimatedMins: 25,
  xp: 40,
  starterFiles: [
    {
      name: "createInput.js",
      lang: "js",
      code: `// createInput.js
function createInput() {
  // your code here
}

module.exports = createInput;`,
    },
  ],
  testFile: {
    name: "createInput_test.js",
    lang: "test",
    code: `const createInput = require('./createInput');

test('press edge lasts one frame', () => {
  const input = createInput();
  input.keyDown('Space');
  expect(input.wasPressed('Space')).toBe(true);
  input.endFrame();
  expect(input.wasPressed('Space')).toBe(false);
  expect(input.isDown('Space')).toBe(true);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Use three <code>Set</code>s: <code>held</code>, <code>pressed</code>, <code>released</code>." },
    { order: 2, cost: 5, text: "In <code>keyDown</code>: <code>if (!held.has(code)) { held.add(code); pressed.add(code); }</code>. <code>keyUp</code> is the mirror image." },
    { order: 3, cost: 15, text: "<code>blur</code> can just call <code>keyUp</code> for a copy of the held set (<code>[...held]</code>) so you don't mutate while iterating." },
  ],
  hiddenTests: [
    { name: "press_sets_held_and_edge", code: `const input = createInput();
assert(input.isDown('Space') === false && input.wasPressed('Space') === false, 'nothing yet');
input.keyDown('Space');
assert(input.isDown('Space') === true && input.wasPressed('Space') === true, 'held and pressed');` },
    { name: "edges_clear_on_end_frame_but_held_stays", code: `const input = createInput();
input.keyDown('Space');
input.endFrame();
assert(input.wasPressed('Space') === false, 'edge gone');
assert(input.isDown('Space') === true, 'still held');` },
    { name: "auto_repeat_is_ignored", code: `const input = createInput();
input.keyDown('Space');
input.endFrame();
input.keyDown('Space');
input.keyDown('Space');
assert(input.wasPressed('Space') === false, 'repeat events are not new presses');
assert(input.isDown('Space') === true, 'still down');` },
    { name: "release_edge", code: `const input = createInput();
input.keyDown('KeyA');
input.endFrame();
input.keyUp('KeyA');
assert(input.isDown('KeyA') === false, 'no longer held');
assert(input.wasReleased('KeyA') === true, 'released this frame');
input.endFrame();
assert(input.wasReleased('KeyA') === false, 'edge cleared');` },
    { name: "releasing_an_unheld_key_is_ignored", code: `const input = createInput();
input.keyUp('KeyZ');
assert(input.wasReleased('KeyZ') === false, 'no phantom release');` },
    { name: "tap_within_one_frame_sets_both_edges", code: `const input = createInput();
input.keyDown('Enter'); input.keyUp('Enter');
assert(input.wasPressed('Enter') === true && input.wasReleased('Enter') === true, 'both');
assert(input.isDown('Enter') === false, 'not held');` },
    { name: "keys_are_independent", code: `const input = createInput();
input.keyDown('KeyA');
assert(input.isDown('KeyB') === false && input.wasPressed('KeyB') === false, 'B untouched');
input.keyDown('KeyB');
input.keyUp('KeyA');
assert(input.isDown('KeyA') === false && input.isDown('KeyB') === true, 'independent');` },
    { name: "blur_releases_everything", code: `const input = createInput();
input.keyDown('KeyA'); input.keyDown('KeyD');
input.endFrame();
input.blur();
assert(!input.isDown('KeyA') && !input.isDown('KeyD'), 'nothing held');
assert(input.wasReleased('KeyA') && input.wasReleased('KeyD'), 'release edges recorded');
input.keyDown('KeyA');
assert(input.wasPressed('KeyA') === true, 'a fresh press after blur counts');` },
    { name: "axis", code: `const input = createInput();
assert(input.axis('ArrowLeft', 'ArrowRight') === 0, 'neither');
input.keyDown('ArrowRight');
assert(input.axis('ArrowLeft', 'ArrowRight') === 1, 'right');
input.keyDown('ArrowLeft');
assert(input.axis('ArrowLeft', 'ArrowRight') === 0, 'both cancel');
input.keyUp('ArrowRight');
assert(input.axis('ArrowLeft', 'ArrowRight') === -1, 'left');` },
  ],
  solution: {
    code: `function createInput() {
  const held = new Set();
  const pressed = new Set();
  const released = new Set();

  const input = {
    keyDown(code) {
      if (!held.has(code)) {
        held.add(code);
        pressed.add(code);
      }
    },
    keyUp(code) {
      if (held.has(code)) {
        held.delete(code);
        released.add(code);
      }
    },
    blur() {
      for (const code of [...held]) input.keyUp(code);
    },
    isDown: (code) => held.has(code),
    wasPressed: (code) => pressed.has(code),
    wasReleased: (code) => released.has(code),
    axis: (negative, positive) => (held.has(positive) ? 1 : 0) - (held.has(negative) ? 1 : 0),
    endFrame() {
      pressed.clear();
      released.clear();
    },
  };
  return input;
}

module.exports = createInput;`,
    explanation:
      "Events are converted into state: a held set that persists, and two edge sets that live for exactly one frame. Checking held.has before recording a press is what makes auto-repeat harmless. Releasing all keys on blur prevents the classic bug where the player keeps running forever because the keyup went to another window.",
  },
};
