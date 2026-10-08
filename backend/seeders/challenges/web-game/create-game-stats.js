export default {
  slug: "create-game-stats",
  trackId: "web-game",
  layerId: "web-game-4",
  type: "CODE",
  difficulty: "easy",
  title: "Score, combo and lives",
  summary: "Track score with a combo multiplier, lives with extra-life thresholds and a game-over state, without double-awarding or ignoring edge cases.",
  description:
    "Score and lives look trivial until the rules pile up: combos multiply points, an extra life every 10,000 points (even when one big pickup crosses two thresholds), a cap on lives, and nothing should count after game over. Keeping this logic in one small module, separate from rendering, makes it easy to test and to show in a HUD.",
  task:
    "Write <code>createGameStats(options)</code> with <code>options</code> <code>{ lives = 3, maxLives = 5, extraLifeEvery = 10000, comboStep = 5, maxMultiplier = 4 }</code>. Return <code>{ addScore, hit, miss, loseLife, getState, reset }</code>.",
  constraints: [
    "State: <code>{ score, lives, combo, multiplier, gameOver }</code>, starting at <code>0, lives, 0, 1, false</code>. <code>multiplier = min(1 + floor(combo / comboStep), maxMultiplier)</code>. <code>getState()</code> returns a NEW snapshot object each call (changing it must not affect the stats).",
    "<code>hit()</code> raises the combo by 1; <code>miss()</code> resets it to 0.",
    "<code>addScore(base)</code> adds <code>base * multiplier</code> and returns the points actually awarded. Non-positive or non-finite <code>base</code> awards <code>0</code>. Each time the score crosses a multiple of <code>extraLifeEvery</code> grant one life (a single award may grant several), never above <code>maxLives</code>.",
    "<code>loseLife()</code> removes a life, resets the combo, and returns the lives left. At 0 lives <code>gameOver</code> becomes true.",
    "After game over, <code>addScore</code> returns 0, <code>hit</code> does nothing and <code>loseLife</code> returns 0, until <code>reset()</code> restores the initial state.",
  ],
  example: `stats.hit(); stats.hit(); stats.hit(); stats.hit(); stats.hit(); stats.addScore(100) // 200 (x2 at combo 5)`,
  tags: ["game-state", "scoring", "hud", "rules"],
  estimatedMins: 20,
  xp: 30,
  starterFiles: [
    {
      name: "createGameStats.js",
      lang: "js",
      code: `// createGameStats.js
function createGameStats(options = {}) {
  // your code here
}

module.exports = createGameStats;`,
    },
  ],
  testFile: {
    name: "createGameStats_test.js",
    lang: "test",
    code: `const createGameStats = require('./createGameStats');

test('combo multiplies points', () => {
  const s = createGameStats();
  for (let i = 0; i < 5; i++) s.hit();
  expect(s.addScore(100)).toBe(200);
  expect(s.getState().score).toBe(200);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep private variables for score, lives, combo and over; derive <code>multiplier</code> in a small function instead of storing it." },
    { order: 2, cost: 5, text: "Extra lives: <code>Math.floor(score / every) - Math.floor(previous / every)</code> is how many thresholds this award crossed." },
    { order: 3, cost: 15, text: "Guard every mutator with <code>if (over) return</code> so game over is truly final until <code>reset()</code>." },
  ],
  hiddenTests: [
    { name: "initial_state", code: `const s = createGameStats();
const st = s.getState();
assert(st.score === 0 && st.lives === 3 && st.combo === 0 && st.multiplier === 1 && st.gameOver === false, 'got ' + JSON.stringify(st));` },
    { name: "multiplier_steps_with_combo_and_caps", code: `const s = createGameStats();
const mult = () => s.getState().multiplier;
for (let i = 0; i < 4; i++) s.hit();
assert(mult() === 1, 'combo 4 is still x1');
s.hit();
assert(mult() === 2, 'combo 5 is x2');
for (let i = 0; i < 5; i++) s.hit();
assert(mult() === 3, 'combo 10 is x3');
for (let i = 0; i < 5; i++) s.hit();
assert(mult() === 4, 'combo 15 is x4');
for (let i = 0; i < 100; i++) s.hit();
assert(mult() === 4, 'capped at maxMultiplier');` },
    { name: "add_score_applies_the_current_multiplier", code: `const s = createGameStats();
assert(s.addScore(100) === 100, 'x1');
for (let i = 0; i < 10; i++) s.hit();
assert(s.addScore(100) === 300, 'x3');
assert(s.getState().score === 400, 'total ' + s.getState().score);` },
    { name: "miss_resets_the_combo", code: `const s = createGameStats();
for (let i = 0; i < 7; i++) s.hit();
s.miss();
const st = s.getState();
assert(st.combo === 0 && st.multiplier === 1, 'got ' + JSON.stringify(st));` },
    { name: "invalid_points_award_nothing", code: `const s = createGameStats();
assert(s.addScore(0) === 0 && s.addScore(-50) === 0 && s.addScore(NaN) === 0 && s.addScore(Infinity) === 0, 'rejected');
assert(s.getState().score === 0, 'score untouched');` },
    { name: "extra_life_at_each_threshold", code: `const s = createGameStats();
s.addScore(9999);
assert(s.getState().lives === 3, 'not yet');
s.addScore(1);
assert(s.getState().lives === 4, 'crossed 10000');
s.addScore(5000);
assert(s.getState().lives === 4, 'no double award');
s.addScore(5000);
assert(s.getState().lives === 5, 'crossed 20000');` },
    { name: "one_big_award_can_grant_several_lives_up_to_the_cap", code: `const s = createGameStats({ lives: 1 });
s.addScore(25000);
assert(s.getState().lives === 3, 'two thresholds crossed: ' + s.getState().lives);
s.addScore(100000);
assert(s.getState().lives === 5, 'capped at maxLives');` },
    { name: "lose_life_resets_combo_and_ends_the_game", code: `const s = createGameStats({ lives: 2 });
for (let i = 0; i < 6; i++) s.hit();
assert(s.loseLife() === 1, 'one left');
assert(s.getState().combo === 0, 'combo reset');
assert(s.getState().gameOver === false, 'still alive');
assert(s.loseLife() === 0, 'none left');
assert(s.getState().gameOver === true, 'game over');` },
    { name: "everything_is_frozen_after_game_over_until_reset", code: `const s = createGameStats({ lives: 1 });
s.addScore(50);
s.loseLife();
assert(s.addScore(100) === 0, 'no points');
s.hit();
assert(s.getState().combo === 0 && s.getState().score === 50, 'frozen');
assert(s.loseLife() === 0 && s.getState().lives === 0, 'cannot go negative');
s.reset();
const st = s.getState();
assert(st.score === 0 && st.lives === 1 && st.gameOver === false, 'reset restores the initial state: ' + JSON.stringify(st));` },
    { name: "snapshots_are_independent", code: `const s = createGameStats();
const snap = s.getState();
snap.score = 999;
snap.lives = 99;
assert(s.getState().score === 0 && s.getState().lives === 3, 'mutating a snapshot changes nothing');
const before = s.getState();
s.addScore(10);
assert(before.score === 0, 'old snapshots do not update');` },
  ],
  solution: {
    code: `function createGameStats(options = {}) {
  const {
    lives: startLives = 3,
    maxLives = 5,
    extraLifeEvery = 10000,
    comboStep = 5,
    maxMultiplier = 4,
  } = options;

  let score = 0;
  let lives = startLives;
  let combo = 0;
  let over = false;

  const multiplier = () => Math.min(1 + Math.floor(combo / comboStep), maxMultiplier);

  return {
    addScore(base) {
      if (over || !Number.isFinite(base) || base <= 0) return 0;
      const points = base * multiplier();
      const previous = score;
      score += points;
      const gained = Math.floor(score / extraLifeEvery) - Math.floor(previous / extraLifeEvery);
      if (gained > 0) lives = Math.min(maxLives, lives + gained);
      return points;
    },
    hit() {
      if (!over) combo++;
    },
    miss() {
      combo = 0;
    },
    loseLife() {
      if (over) return 0;
      lives = Math.max(0, lives - 1);
      combo = 0;
      if (lives === 0) over = true;
      return lives;
    },
    getState: () => ({ score, lives, combo, multiplier: multiplier(), gameOver: over }),
    reset() {
      score = 0;
      lives = startLives;
      combo = 0;
      over = false;
    },
  };
}

module.exports = createGameStats;`,
    explanation:
      "The multiplier is derived from the combo rather than stored, so the two can never disagree. Extra lives compare floor(score / N) before and after an award; that handles awards that cross several thresholds and never awards the same threshold twice. Returning a fresh snapshot from getState keeps the HUD from accidentally editing the game's real state.",
  },
};
