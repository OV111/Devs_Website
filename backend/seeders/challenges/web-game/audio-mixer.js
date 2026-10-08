export default {
  slug: "audio-mixer",
  trackId: "web-game",
  layerId: "web-game-3",
  type: "CODE",
  difficulty: "med",
  title: "Audio mixer: master, buses, ducking",
  summary: "Compute the effective volume of each sound from master, bus and voice gains, with mute, ducking and decibel conversion.",
  description:
    "Games route sounds through buses (music, sfx, voice) into a master output, the same graph Web Audio builds out of <code>GainNode</code>s. A sound's final loudness is the product of every gain on its path. Settings screens, a mute button and 'lower the music while someone talks' (ducking) are all just changes to one link in that chain.",
  task:
    "Write <code>createMixer(buses)</code> (where <code>buses</code> is an array of bus names), plus <code>toDecibels(gain)</code> and <code>fromDecibels(db)</code>. The mixer returns <code>{ setMaster, setBus, setVoice, addVoice, removeVoice, mute, unmute, duck, unduck, getEffectiveVolume, getAll }</code>.",
  constraints: [
    "Every volume is clamped to <code>[0, 1]</code>. Master and every bus start at <code>1</code>. <code>addVoice(id, bus, volume = 1)</code> registers a voice on a bus; an unknown bus or an already-used id throws an <code>Error</code>. <code>setBus</code> with an unknown bus throws; <code>setVoice</code> / <code>removeVoice</code> with an unknown id throw.",
    "<code>getEffectiveVolume(id)</code> is <code>master * bus * duckFactor(bus) * voice</code>, or <code>0</code> when the master or that voice's bus is muted. It returns <code>null</code> for an unknown id. <code>getAll()</code> returns <code>{ id: effectiveVolume }</code> for every voice.",
    "<code>mute()</code> / <code>unmute()</code> with no argument act on the master; <code>mute(bus)</code> / <code>unmute(bus)</code> on a bus. Muting never changes the stored volumes, so unmuting restores exactly what was set.",
    "<code>duck(bus, factor)</code> multiplies that bus by <code>factor</code> (clamped to [0, 1]) until <code>unduck(bus)</code>; ducking an already-ducked bus replaces the factor.",
    "<code>toDecibels(gain) = 20 * log10(gain)</code> (<code>-Infinity</code> for 0; a negative gain throws <code>RangeError</code>). <code>fromDecibels(db) = 10 ** (db / 20)</code> (<code>0</code> for <code>-Infinity</code>).",
  ],
  example: `mixer.addVoice('theme', 'music', 0.8); mixer.setBus('music', 0.5); mixer.getEffectiveVolume('theme') // 0.4`,
  tags: ["audio", "web-audio", "gain", "mixing"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "mixer.js",
      lang: "js",
      code: `// mixer.js
function createMixer(buses) {
  // your code here
}

function toDecibels(gain) {
  // your code here
}

function fromDecibels(db) {
  // your code here
}

module.exports = { createMixer, toDecibels, fromDecibels };`,
    },
  ],
  testFile: {
    name: "mixer_test.js",
    lang: "test",
    code: `const { createMixer } = require('./mixer');

test('gains multiply', () => {
  const m = createMixer(['music', 'sfx']);
  m.addVoice('theme', 'music', 0.8);
  m.setBus('music', 0.5);
  m.setMaster(0.5);
  expect(m.getEffectiveVolume('theme')).toBeCloseTo(0.2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>master</code>, a <code>Map</code> of bus state <code>{ volume, muted, duck }</code>, and a <code>Map</code> of voices. A <code>clamp01</code> helper handles every setter." },
    { order: 2, cost: 5, text: "Compute the effective volume on demand (don't cache it): then every change is instantly reflected and mute/unmute can't desync." },
    { order: 3, cost: 15, text: "For decibels use <code>Math.log10</code>. <code>gain &lt; 0</code> throws; <code>gain === 0</code> gives <code>-Infinity</code> naturally." },
  ],
  hiddenTests: [
    { name: "defaults_to_full_volume", code: `const m = createMixer(['music', 'sfx']);
m.addVoice('jump', 'sfx');
assert(m.getEffectiveVolume('jump') === 1, 'got ' + m.getEffectiveVolume('jump'));` },
    { name: "gains_multiply_along_the_path", code: `const m = createMixer(['music', 'sfx']);
m.addVoice('theme', 'music', 0.8);
m.setBus('music', 0.5);
m.setMaster(0.5);
assert(Math.abs(m.getEffectiveVolume('theme') - 0.2) < 1e-9, 'got ' + m.getEffectiveVolume('theme'));` },
    { name: "values_are_clamped", code: `const m = createMixer(['sfx']);
m.addVoice('a', 'sfx', 5);
assert(m.getEffectiveVolume('a') === 1, 'voice clamped high');
m.setVoice('a', -3);
assert(m.getEffectiveVolume('a') === 0, 'voice clamped low');
m.setVoice('a', 1); m.setMaster(2);
assert(m.getEffectiveVolume('a') === 1, 'master clamped');` },
    { name: "mute_master_and_bus_keep_the_stored_volumes", code: `const m = createMixer(['music', 'sfx']);
m.addVoice('theme', 'music', 0.5); m.addVoice('jump', 'sfx', 0.5);
m.setMaster(0.8);
m.mute('music');
assert(m.getEffectiveVolume('theme') === 0, 'music muted');
assert(Math.abs(m.getEffectiveVolume('jump') - 0.4) < 1e-9, 'sfx unaffected');
m.unmute('music');
assert(Math.abs(m.getEffectiveVolume('theme') - 0.4) < 1e-9, 'restored exactly');
m.mute();
assert(m.getEffectiveVolume('theme') === 0 && m.getEffectiveVolume('jump') === 0, 'master mute silences all');
m.unmute();
assert(Math.abs(m.getEffectiveVolume('jump') - 0.4) < 1e-9, 'master restored');` },
    { name: "ducking", code: `const m = createMixer(['music', 'voice']);
m.addVoice('theme', 'music', 1);
m.duck('music', 0.25);
assert(m.getEffectiveVolume('theme') === 0.25, 'ducked');
m.duck('music', 0.5);
assert(m.getEffectiveVolume('theme') === 0.5, 'replaces the factor, does not stack');
m.setBus('music', 0.5);
assert(m.getEffectiveVolume('theme') === 0.25, 'ducking multiplies with the bus volume');
m.unduck('music');
assert(m.getEffectiveVolume('theme') === 0.5, 'back to normal');` },
    { name: "get_all_and_unknown_voices", code: `const m = createMixer(['sfx']);
m.addVoice('a', 'sfx', 0.5); m.addVoice('b', 'sfx', 1);
const all = m.getAll();
assert(JSON.stringify(all) === '{"a":0.5,"b":1}', 'got ' + JSON.stringify(all));
assert(m.getEffectiveVolume('missing') === null, 'unknown id');
m.removeVoice('a');
assert(m.getEffectiveVolume('a') === null && Object.keys(m.getAll()).length === 1, 'removed');` },
    { name: "invalid_operations_throw", code: `const m = createMixer(['sfx']);
m.addVoice('a', 'sfx');
const fails = (fn) => { try { fn(); return false; } catch (e) { return e instanceof Error; } };
assert(fails(() => m.addVoice('a', 'sfx')), 'duplicate id');
assert(fails(() => m.addVoice('b', 'nope')), 'unknown bus on addVoice');
assert(fails(() => m.setBus('nope', 1)), 'unknown bus on setBus');
assert(fails(() => m.setVoice('ghost', 1)), 'unknown voice');
assert(fails(() => m.removeVoice('ghost')), 'unknown voice on remove');
assert(fails(() => m.duck('nope', 0.5)), 'unknown bus on duck');
assert(fails(() => m.mute('nope')), 'unknown bus on mute');` },
    { name: "decibel_conversion", code: `assert(toDecibels(1) === 0, '1 is 0 dB');
assert(Math.abs(toDecibels(0.5) - -6.0206) < 1e-3, 'half is about -6 dB: ' + toDecibels(0.5));
assert(toDecibels(0) === -Infinity, 'silence');
let err = null;
try { toDecibels(-1); } catch (e) { err = e; }
assert(err instanceof RangeError, 'negative gain');
assert(Math.abs(fromDecibels(-6.0206) - 0.5) < 1e-4, 'round trip');
assert(fromDecibels(0) === 1 && fromDecibels(-Infinity) === 0, 'edges');
assert(Math.abs(fromDecibels(toDecibels(0.3)) - 0.3) < 1e-12, 'inverse');` },
  ],
  solution: {
    code: `const clamp01 = (v) => Math.min(1, Math.max(0, v));

function createMixer(busNames) {
  let master = 1;
  let masterMuted = false;
  const buses = new Map(busNames.map((name) => [name, { volume: 1, muted: false, duck: 1 }]));
  const voices = new Map();

  const bus = (name) => {
    if (!buses.has(name)) throw new Error('Unknown bus: ' + name);
    return buses.get(name);
  };
  const voice = (id) => {
    if (!voices.has(id)) throw new Error('Unknown voice: ' + id);
    return voices.get(id);
  };
  const effective = (v) => {
    const b = buses.get(v.bus);
    if (masterMuted || b.muted) return 0;
    return master * b.volume * b.duck * v.volume;
  };

  return {
    setMaster: (v) => { master = clamp01(v); },
    setBus: (name, v) => { bus(name).volume = clamp01(v); },
    setVoice: (id, v) => { voice(id).volume = clamp01(v); },
    addVoice(id, busName, volume = 1) {
      bus(busName);
      if (voices.has(id)) throw new Error('Duplicate voice: ' + id);
      voices.set(id, { bus: busName, volume: clamp01(volume) });
    },
    removeVoice(id) {
      voice(id);
      voices.delete(id);
    },
    mute(name) { if (name === undefined) masterMuted = true; else bus(name).muted = true; },
    unmute(name) { if (name === undefined) masterMuted = false; else bus(name).muted = false; },
    duck: (name, factor) => { bus(name).duck = clamp01(factor); },
    unduck: (name) => { bus(name).duck = 1; },
    getEffectiveVolume: (id) => (voices.has(id) ? effective(voices.get(id)) : null),
    getAll() {
      const out = {};
      for (const [id, v] of voices) out[id] = effective(v);
      return out;
    },
  };
}

function toDecibels(gain) {
  if (gain < 0) throw new RangeError('gain must be >= 0');
  return 20 * Math.log10(gain);
}

function fromDecibels(db) {
  return Math.pow(10, db / 20);
}

module.exports = { createMixer, toDecibels, fromDecibels };`,
    explanation:
      "Volume is multiplicative, so loudness is just the product of the gains on the path, exactly what a chain of Web Audio GainNodes does. Computing the result on demand instead of storing it means mute/duck are plain flags that cannot get out of sync with the real settings. Decibels are the logarithmic scale humans perceive: halving the gain is about -6 dB, not -50.",
  },
};
