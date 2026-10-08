export default {
  slug: "scene-manager",
  trackId: "web-game",
  layerId: "web-game-2",
  type: "CODE",
  difficulty: "med",
  title: "Phaser-style scene manager",
  summary: "Manage scene lifecycles: start, stop, launch in parallel, pause and resume, with init/create/update/shutdown hooks and data passing.",
  description:
    "Phaser organises a game into scenes (boot, menu, level, HUD). The scene manager decides which scenes are alive, calls their lifecycle hooks in the right order, and passes data between them. Getting the order of <code>shutdown</code> and <code>init</code> right is what stops one scene's leftovers leaking into the next.",
  task:
    "Write <code>createSceneManager()</code> returning <code>{ add, start, launch, stop, pause, resume, update, isActive, isPaused, getActive }</code>. A scene is a plain object whose hooks (<code>init(data)</code>, <code>create(data)</code>, <code>update(time, delta)</code>, <code>shutdown()</code>, <code>pause()</code>, <code>resume()</code>) are all optional and are called with <code>this</code> set to the scene.",
  constraints: [
    "<code>add(key, scene)</code> registers a scene; a duplicate key throws an <code>Error</code>. <code>start</code>, <code>launch</code>, <code>stop</code>, <code>pause</code>, <code>resume</code> with an unknown key throw an <code>Error</code> (except <code>stop</code>, which ignores keys that are registered but not active).",
    "<code>start(key, data = {})</code> first stops EVERY active scene (calling each <code>shutdown</code>, in the order they were started), then calls <code>init(data)</code> and <code>create(data)</code> on the new one and makes it active. Starting an already-active key restarts it the same way.",
    "<code>launch(key, data = {})</code> does the same init/create but leaves the other active scenes running. Launching an already-active key does nothing.",
    "<code>stop(key)</code> calls <code>shutdown</code> and deactivates the scene (also clears its paused flag). <code>pause(key)</code> / <code>resume(key)</code> call the matching hook only on an active scene that isn't already in that state, and a paused scene's <code>update</code> is skipped.",
    "<code>update(time, delta)</code> calls <code>update</code> on active, un-paused scenes in start order. Work from a snapshot: a scene started during this update waits until the next one, and a scene stopped by an earlier scene in the same update is skipped. <code>getActive()</code> returns the active keys in start order.",
  ],
  example: `scenes.add('menu', { create() { log.push('menu') } }); scenes.start('menu', { level: 1 });`,
  tags: ["phaser", "scenes", "lifecycle", "game-architecture"],
  estimatedMins: 40,
  xp: 65,
  starterFiles: [
    {
      name: "createSceneManager.js",
      lang: "js",
      code: `// createSceneManager.js
function createSceneManager() {
  // your code here
}

module.exports = createSceneManager;`,
    },
  ],
  testFile: {
    name: "createSceneManager_test.js",
    lang: "test",
    code: `const createSceneManager = require('./createSceneManager');

test('start passes data to init and create', () => {
  const seen = [];
  const sm = createSceneManager();
  sm.add('level', { init(d) { seen.push(['init', d.n]); }, create(d) { seen.push(['create', d.n]); } });
  sm.start('level', { n: 2 });
  expect(seen).toEqual([['init', 2], ['create', 2]]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>Map</code> of key to scene and an array <code>active</code> of keys in start order. A tiny <code>call(scene, hook, ...args)</code> helper that checks <code>typeof scene[hook] === 'function'</code> keeps everything else short." },
    { order: 2, cost: 5, text: "Implement <code>stop</code> first (call shutdown, remove from <code>active</code> and from a <code>paused</code> Set). Then <code>start</code> = stop everything (copy of the array!) + <code>launch</code>-like activation." },
    { order: 3, cost: 15, text: "In <code>update</code> loop over <code>[...active]</code> and re-check <code>active.includes(key)</code> before calling each scene, so stops during the frame are honoured." },
  ],
  hiddenTests: [
    { name: "start_runs_init_then_create_with_data", code: `const log = [];
const sm = createSceneManager();
sm.add('level', { init(d) { log.push('init:' + d.n); }, create(d) { log.push('create:' + d.n); } });
sm.start('level', { n: 2 });
assert(log.join(',') === 'init:2,create:2', 'got ' + log);
assert(sm.isActive('level') === true, 'active');` },
    { name: "hooks_are_optional_and_data_defaults", code: `const log = [];
const sm = createSceneManager();
sm.add('bare', {});
sm.add('data', { create(d) { log.push(typeof d + ':' + Object.keys(d).length); } });
sm.start('bare');
sm.start('data');
assert(log.join(',') === 'object:0', 'default data is an empty object: ' + log);` },
    { name: "hooks_run_with_the_scene_as_this", code: `const sm = createSceneManager();
const scene = { hp: 3, create() { this.ready = this.hp; } };
sm.add('s', scene);
sm.start('s');
assert(scene.ready === 3, 'this is the scene object');` },
    { name: "start_shuts_down_the_others_first", code: `const log = [];
const mk = (n) => ({ create() { log.push('create:' + n); }, shutdown() { log.push('shutdown:' + n); } });
const sm = createSceneManager();
sm.add('a', mk('a')); sm.add('b', mk('b')); sm.add('c', mk('c'));
sm.start('a'); sm.launch('b');
log.length = 0;
sm.start('c');
assert(log.join(',') === 'shutdown:a,shutdown:b,create:c', 'got ' + log);
assert(sm.getActive().join(',') === 'c', 'only c is active');` },
    { name: "restarting_the_active_scene", code: `const log = [];
const sm = createSceneManager();
sm.add('a', { init() { log.push('init'); }, create() { log.push('create'); }, shutdown() { log.push('shutdown'); } });
sm.start('a'); log.length = 0;
sm.start('a');
assert(log.join(',') === 'shutdown,init,create', 'got ' + log);` },
    { name: "launch_runs_in_parallel_and_is_idempotent", code: `const log = [];
const sm = createSceneManager();
sm.add('game', {}); sm.add('hud', { create() { log.push('hud'); } });
sm.start('game');
sm.launch('hud'); sm.launch('hud');
assert(log.join(',') === 'hud', 'created once');
assert(sm.getActive().join(',') === 'game,hud', 'both active in start order');` },
    { name: "stop_calls_shutdown_once_and_ignores_inactive_scenes", code: `const log = [];
const sm = createSceneManager();
sm.add('a', { shutdown() { log.push('down'); } });
sm.add('idle', { shutdown() { log.push('idle-down'); } });
sm.start('a');
sm.stop('a'); sm.stop('a'); sm.stop('idle');
assert(log.join(',') === 'down', 'got ' + log);
assert(sm.isActive('a') === false, 'inactive');` },
    { name: "update_runs_active_unpaused_scenes_in_start_order", code: `const log = [];
const mk = (n) => ({ update(t, d) { log.push(n + ':' + t + ':' + d); } });
const sm = createSceneManager();
sm.add('a', mk('a')); sm.add('b', mk('b'));
sm.start('a'); sm.launch('b');
sm.update(100, 16);
sm.pause('a');
sm.update(116, 16);
assert(log.join(',') === 'a:100:16,b:100:16,b:116:16', 'got ' + log);` },
    { name: "pause_and_resume_hooks_fire_only_on_real_transitions", code: `const log = [];
const sm = createSceneManager();
sm.add('a', { pause() { log.push('pause'); }, resume() { log.push('resume'); } });
sm.add('off', { pause() { log.push('bad'); } });
sm.start('a');
sm.resume('a'); sm.pause('a'); sm.pause('a'); sm.resume('a'); sm.resume('a'); sm.pause('off');
assert(log.join(',') === 'pause,resume', 'got ' + log);
assert(sm.isPaused('a') === false, 'resumed');` },
    { name: "stopping_clears_the_paused_flag", code: `const log = [];
const sm = createSceneManager();
sm.add('a', { update() { log.push('u'); } });
sm.start('a'); sm.pause('a'); sm.stop('a');
sm.start('a');
sm.update(0, 1);
assert(log.join('') === 'u', 'a restarted scene is not paused');` },
    { name: "scene_started_during_update_waits_a_frame", code: `const log = [];
const sm = createSceneManager();
sm.add('a', { update() { log.push('a'); sm.launch('late'); } });
sm.add('late', { update() { log.push('late'); } });
sm.start('a');
sm.update(0, 1);
assert(log.join(',') === 'a', 'late not updated this frame: ' + log);
sm.update(1, 1);
assert(log.join(',') === 'a,a,late', 'updated on the next: ' + log);` },
    { name: "scene_stopped_during_update_is_skipped", code: `const log = [];
const sm = createSceneManager();
sm.add('a', { update() { log.push('a'); sm.stop('b'); } });
sm.add('b', { update() { log.push('b'); } });
sm.start('a'); sm.launch('b');
sm.update(0, 1);
assert(log.join(',') === 'a', 'b was stopped before its turn: ' + log);` },
    { name: "errors", code: `const sm = createSceneManager();
sm.add('a', {});
const fails = (fn) => { try { fn(); return false; } catch (e) { return e instanceof Error; } };
assert(fails(() => sm.add('a', {})), 'duplicate key');
assert(fails(() => sm.start('nope')), 'unknown start');
assert(fails(() => sm.launch('nope')), 'unknown launch');
assert(fails(() => sm.pause('nope')), 'unknown pause');
assert(fails(() => sm.resume('nope')), 'unknown resume');` },
  ],
  solution: {
    code: `function createSceneManager() {
  const scenes = new Map();
  let active = [];
  const paused = new Set();

  const call = (scene, hook, ...args) => {
    if (typeof scene[hook] === 'function') scene[hook](...args);
  };
  const get = (key) => {
    if (!scenes.has(key)) throw new Error('Unknown scene: ' + key);
    return scenes.get(key);
  };

  const manager = {
    add(key, scene) {
      if (scenes.has(key)) throw new Error('Duplicate scene key: ' + key);
      scenes.set(key, scene);
    },
    launch(key, data = {}) {
      const scene = get(key);
      if (active.includes(key)) return;
      active.push(key);
      call(scene, 'init', data);
      call(scene, 'create', data);
    },
    stop(key) {
      const scene = get(key);
      if (!active.includes(key)) return;
      active = active.filter((k) => k !== key);
      paused.delete(key);
      call(scene, 'shutdown');
    },
    start(key, data = {}) {
      get(key);
      for (const k of [...active]) manager.stop(k);
      manager.launch(key, data);
    },
    pause(key) {
      const scene = get(key);
      if (!active.includes(key) || paused.has(key)) return;
      paused.add(key);
      call(scene, 'pause');
    },
    resume(key) {
      const scene = get(key);
      if (!active.includes(key) || !paused.has(key)) return;
      paused.delete(key);
      call(scene, 'resume');
    },
    update(time, delta) {
      for (const key of [...active]) {
        if (!active.includes(key) || paused.has(key)) continue;
        call(scenes.get(key), 'update', time, delta);
      }
    },
    isActive: (key) => active.includes(key),
    isPaused: (key) => paused.has(key),
    getActive: () => [...active],
  };
  return manager;
}

module.exports = createSceneManager;`,
    explanation:
      "Everything hangs off one array of active keys, kept in start order. start() is stop-everything-then-launch, so the old scene's shutdown always runs before the new scene's init, which is the guarantee that stops leaked listeners and timers. Iterating a snapshot in update() and re-checking membership gives the safe semantics for scenes that start or stop other scenes mid-frame.",
  },
};
