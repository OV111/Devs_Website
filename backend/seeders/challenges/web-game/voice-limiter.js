export default {
  slug: "voice-limiter",
  trackId: "web-game",
  layerId: "web-game-3",
  type: "CODE",
  difficulty: "hard",
  title: "Sound-effect voice limiter",
  summary: "Cap how many sounds play at once: per-sound limits, retrigger cooldown and priority-based voice stealing.",
  description:
    "A boss fight can ask for 200 sound effects in one second. Browsers and phones only mix a limited number of voices, and 40 identical gunshots just sound like noise. Audio engines apply rules: don't retrigger the same sound too fast, don't stack too many copies, and when everything is busy let important sounds steal the voice of unimportant ones.",
  task:
    "Write <code>createVoiceLimiter({ maxVoices, maxPerSound = Infinity, minInterval = 0 })</code> returning <code>{ play, update, release, active }</code>. <code>play({ sound, priority = 0, duration }, now)</code> returns <code>{ played: true, id, stolen? }</code> or <code>{ played: false, reason }</code>. Times are ms.",
  constraints: [
    "Each accepted voice gets an increasing numeric <code>id</code> starting at 1 and remembers its start time. A voice expires when <code>now &gt;= start + duration</code>; <code>play</code> and <code>update(now)</code> first remove all expired voices.",
    "Cooldown: if the same <code>sound</code> was last ACCEPTED less than <code>minInterval</code> ms ago, reject with <code>reason: 'cooldown'</code> (rejected requests do not reset the timer).",
    "Per-sound limit: if <code>maxPerSound</code> copies of this sound are already playing, the OLDEST copy of that sound is stolen for the new one (<code>stolen</code> is the old id; priority is ignored for this rule).",
    "Global limit: if <code>maxVoices</code> are playing, the victim is the voice with the lowest priority, ties broken by the oldest start (then lowest id). If the new priority is greater than or equal to the victim's, steal it; otherwise reject with <code>reason: 'priority'</code>. (A per-sound steal may already have freed a slot.)",
    "<code>release(id)</code> removes a voice early and returns whether it existed. <code>active()</code> returns the ids of playing voices in start order.",
  ],
  example: `const v = createVoiceLimiter({ maxVoices: 2 }); v.play({ sound: 'a', duration: 500 }, 0); v.play({ sound: 'b', duration: 500 }, 0);`,
  tags: ["audio", "voice-stealing", "game-audio", "limits"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "createVoiceLimiter.js",
      lang: "js",
      code: `// createVoiceLimiter.js
function createVoiceLimiter(options) {
  // your code here
}

module.exports = createVoiceLimiter;`,
    },
  ],
  testFile: {
    name: "createVoiceLimiter_test.js",
    lang: "test",
    code: `const createVoiceLimiter = require('./createVoiceLimiter');

test('fills up then rejects low priority', () => {
  const v = createVoiceLimiter({ maxVoices: 1 });
  expect(v.play({ sound: 'a', priority: 5, duration: 1000 }, 0).played).toBe(true);
  expect(v.play({ sound: 'b', priority: 1, duration: 1000 }, 10)).toEqual({ played: false, reason: 'priority' });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep an array of voices <code>{ id, sound, priority, start, end }</code> in start order and a <code>lastAccepted</code> map from sound to time." },
    { order: 2, cost: 5, text: "Order of checks in <code>play</code>: expire, cooldown, per-sound steal, global limit. Removing the stolen voice from the array before the global check handles 'slot already freed'." },
    { order: 3, cost: 15, text: "Victim choice: sort a copy by <code>priority</code> asc, then <code>start</code> asc, then <code>id</code> asc and take the first. A new voice goes at the END of the array." },
  ],
  hiddenTests: [
    { name: "plays_and_numbers_voices", code: `const v = createVoiceLimiter({ maxVoices: 3 });
const a = v.play({ sound: 'a', duration: 100 }, 0);
const b = v.play({ sound: 'b', duration: 100 }, 0);
assert(a.played && a.id === 1 && b.played && b.id === 2, 'ids ' + JSON.stringify([a, b]));
assert(a.stolen === undefined, 'nothing stolen');
assert(v.active().join(',') === '1,2', 'active ' + v.active());` },
    { name: "voices_expire_after_their_duration", code: `const v = createVoiceLimiter({ maxVoices: 1 });
v.play({ sound: 'a', priority: 5, duration: 100 }, 0);
assert(v.play({ sound: 'b', duration: 100 }, 99).played === false, 'still busy at 99 (and b has lower priority)');
const r = v.play({ sound: 'b', duration: 100 }, 100);
assert(r.played === true && r.stolen === undefined, 'expired exactly at 100, so no stealing needed: ' + JSON.stringify(r));
v.update(300);
assert(v.active().length === 0, 'update expires too');` },
    { name: "higher_or_equal_priority_steals_the_lowest", code: `const v = createVoiceLimiter({ maxVoices: 2 });
v.play({ sound: 'a', priority: 5, duration: 1000 }, 0);
v.play({ sound: 'b', priority: 1, duration: 1000 }, 0);
const r = v.play({ sound: 'c', priority: 3, duration: 1000 }, 10);
assert(r.played === true && r.stolen === 2, 'stole the low priority voice 2: ' + JSON.stringify(r));
assert(v.active().join(',') === '1,3', 'active ' + v.active());
const eq = v.play({ sound: 'd', priority: 3, duration: 1000 }, 20);
assert(eq.played === true && eq.stolen === 3, 'equal priority steals: ' + JSON.stringify(eq));` },
    { name: "lower_priority_is_rejected", code: `const v = createVoiceLimiter({ maxVoices: 1 });
v.play({ sound: 'a', priority: 5, duration: 1000 }, 0);
const r = v.play({ sound: 'b', priority: 4, duration: 1000 }, 1);
assert(r.played === false && r.reason === 'priority', 'got ' + JSON.stringify(r));
assert(v.active().join(',') === '1', 'unchanged');` },
    { name: "ties_steal_the_oldest_voice", code: `const v = createVoiceLimiter({ maxVoices: 2 });
v.play({ sound: 'a', priority: 1, duration: 1000 }, 0);
v.play({ sound: 'b', priority: 1, duration: 1000 }, 5);
const r = v.play({ sound: 'c', priority: 1, duration: 1000 }, 10);
assert(r.stolen === 1, 'oldest of the equals: ' + JSON.stringify(r));` },
    { name: "cooldown_between_triggers_of_the_same_sound", code: `const v = createVoiceLimiter({ maxVoices: 10, minInterval: 50 });
assert(v.play({ sound: 'step', duration: 500 }, 0).played === true, 'first');
const r = v.play({ sound: 'step', duration: 500 }, 30);
assert(r.played === false && r.reason === 'cooldown', 'too soon: ' + JSON.stringify(r));
assert(v.play({ sound: 'other', duration: 500 }, 30).played === true, 'other sounds are unaffected');
assert(v.play({ sound: 'step', duration: 500 }, 50).played === true, 'allowed at exactly minInterval, rejected requests did not reset the timer');` },
    { name: "per_sound_limit_steals_the_oldest_copy", code: `const v = createVoiceLimiter({ maxVoices: 10, maxPerSound: 2 });
v.play({ sound: 'shot', duration: 1000 }, 0);
v.play({ sound: 'shot', duration: 1000 }, 10);
v.play({ sound: 'boom', duration: 1000 }, 15);
const r = v.play({ sound: 'shot', duration: 1000 }, 20);
assert(r.played === true && r.stolen === 1, 'oldest shot replaced: ' + JSON.stringify(r));
assert(v.active().join(',') === '2,3,4', 'active ' + v.active());` },
    { name: "per_sound_steal_frees_a_global_slot", code: `const v = createVoiceLimiter({ maxVoices: 2, maxPerSound: 2 });
v.play({ sound: 'shot', priority: 0, duration: 1000 }, 0);
v.play({ sound: 'shot', priority: 0, duration: 1000 }, 1);
const r = v.play({ sound: 'shot', priority: 0, duration: 1000 }, 2);
assert(r.played === true && r.stolen === 1, 'per-sound steal wins, no global rejection: ' + JSON.stringify(r));` },
    { name: "release_removes_a_voice_early", code: `const v = createVoiceLimiter({ maxVoices: 1 });
const a = v.play({ sound: 'a', duration: 1000 }, 0);
assert(v.release(a.id) === true && v.release(a.id) === false, 'release once');
const r = v.play({ sound: 'b', duration: 1000 }, 1);
assert(r.played === true && r.stolen === undefined, 'slot is free: ' + JSON.stringify(r));` },
    { name: "cooldown_uses_the_last_accepted_time_even_after_the_voice_ended", code: `const v = createVoiceLimiter({ maxVoices: 4, minInterval: 100 });
v.play({ sound: 'ping', duration: 10 }, 0);
const r = v.play({ sound: 'ping', duration: 10 }, 50);
assert(r.played === false && r.reason === 'cooldown', 'the voice ended at 10 but the cooldown runs to 100: ' + JSON.stringify(r));` },
  ],
  solution: {
    code: `function createVoiceLimiter({ maxVoices, maxPerSound = Infinity, minInterval = 0 }) {
  let voices = [];
  let nextId = 1;
  const lastAccepted = new Map();

  const expire = (now) => {
    voices = voices.filter((v) => now < v.end);
  };

  return {
    play({ sound, priority = 0, duration }, now) {
      expire(now);

      if (lastAccepted.has(sound) && now - lastAccepted.get(sound) < minInterval) {
        return { played: false, reason: 'cooldown' };
      }

      let stolen;
      const sameSound = voices.filter((v) => v.sound === sound);
      if (sameSound.length >= maxPerSound) {
        const oldest = sameSound[0];
        voices = voices.filter((v) => v !== oldest);
        stolen = oldest.id;
      }

      if (voices.length >= maxVoices) {
        const victim = [...voices].sort(
          (a, b) => a.priority - b.priority || a.start - b.start || a.id - b.id
        )[0];
        if (priority < victim.priority) return { played: false, reason: 'priority' };
        voices = voices.filter((v) => v !== victim);
        stolen = victim.id;
      }

      const id = nextId++;
      voices.push({ id, sound, priority, start: now, end: now + duration });
      lastAccepted.set(sound, now);
      const result = { played: true, id };
      if (stolen !== undefined) result.stolen = stolen;
      return result;
    },
    update(now) {
      expire(now);
    },
    release(id) {
      const before = voices.length;
      voices = voices.filter((v) => v.id !== id);
      return voices.length !== before;
    },
    active: () => voices.map((v) => v.id),
  };
}

module.exports = createVoiceLimiter;`,
    explanation:
      "The rules run from cheapest and most specific to the global fallback: cooldown stops machine-gun retriggers, the per-sound cap recycles that sound's own oldest copy, and only then does the global voice budget decide, using priority so a boss roar can cut off a footstep but not the reverse. Rejected requests deliberately leave state untouched, which keeps the cooldown timer honest. Real engines (FMOD, Wwise) expose exactly these knobs.",
  },
};
