export default {
  slug: "asset-loader",
  trackId: "web-game",
  layerId: "web-game-2",
  type: "CODE",
  difficulty: "med",
  title: "Preloader with concurrency, retries and progress",
  summary: "Load a manifest of game assets with a concurrency limit, de-duplication, per-asset retries and a progress callback for the loading bar.",
  description:
    "Every Phaser game starts with a preload scene: fetch sprites, audio and maps while a progress bar fills. Firing 300 requests at once starves the browser, one failed texture shouldn't abort the whole game, and a loading bar needs a trustworthy 'done of total'.",
  task:
    "Write <code>async loadAll(manifest, loadFn, options)</code>. <code>manifest</code> is an array of <code>{ key, ... }</code> items, <code>loadFn(item, attempt)</code> returns a promise of the loaded asset (<code>attempt</code> counts from 0), and <code>options</code> is <code>{ concurrency = 4, retries = 0, onProgress }</code>.",
  constraints: [
    "Never run more than <code>concurrency</code> calls to <code>loadFn</code> at once; start items in manifest order and begin the next one as soon as a slot frees up.",
    "Items with a duplicate <code>key</code> are loaded only once (the first wins) and count once in the total.",
    "A failing item is retried up to <code>retries</code> more times (calling <code>loadFn(item, attempt)</code> with 1, 2, ...). If it still fails, record <code>{ key, error }</code> in <code>failed</code> and carry on with the rest: one broken asset must not reject the whole load.",
    "After each item finishes for good (success or final failure) call <code>onProgress({ done, total, key, ok })</code> where <code>done</code> counts finished items, so it goes 1, 2, ... total.",
    "Resolve with <code>{ assets, failed }</code> once every item is finished; <code>assets</code> maps key to the loaded value. An empty manifest resolves immediately with empty results.",
  ],
  example: `const { assets, failed } = await loadAll([{ key: 'hero', url: 'hero.png' }], (it) => loadImage(it.url), { concurrency: 3, retries: 1 });`,
  tags: ["phaser", "preload", "async", "concurrency"],
  estimatedMins: 35,
  xp: 60,
  starterFiles: [
    {
      name: "loadAll.js",
      lang: "js",
      code: `// loadAll.js
async function loadAll(manifest, loadFn, options = {}) {
  // your code here
}

module.exports = loadAll;`,
    },
  ],
  testFile: {
    name: "loadAll_test.js",
    lang: "test",
    code: `const loadAll = require('./loadAll');

test('loads everything', async () => {
  const r = await loadAll([{ key: 'a' }, { key: 'b' }], async (it) => it.key.toUpperCase());
  expect(r.assets).toEqual({ a: 'A', b: 'B' });
  expect(r.failed).toEqual([]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "The simplest correct pool: start <code>concurrency</code> async 'workers' that each loop <code>while (next &lt; items.length)</code> and take <code>items[next++]</code>. Await them all with <code>Promise.all</code>." },
    { order: 2, cost: 5, text: "De-duplicate first with a <code>Set</code> of seen keys, so <code>total</code> is the number of unique items." },
    { order: 3, cost: 15, text: "Per item: a <code>for (attempt = 0; attempt &lt;= retries; attempt++)</code> loop with try/catch around <code>await loadFn(item, attempt)</code>. Remember the last error." },
  ],
  hiddenTests: [
    { name: "loads_everything_into_a_key_map", code: `const r = await loadAll([{ key: 'a' }, { key: 'b' }, { key: 'c' }], async (it) => it.key.toUpperCase());
assert(JSON.stringify(r.assets) === '{"a":"A","b":"B","c":"C"}', 'got ' + JSON.stringify(r.assets));
assert(r.failed.length === 0, 'no failures');` },
    { name: "empty_manifest", code: `const r = await loadAll([], async () => 1);
assert(Object.keys(r.assets).length === 0 && r.failed.length === 0, 'empty results');` },
    { name: "duplicate_keys_are_loaded_once", code: `let calls = 0;
const r = await loadAll([{ key: 'a', v: 1 }, { key: 'a', v: 2 }, { key: 'b', v: 3 }], async (it) => { calls++; return it.v; });
assert(calls === 2, 'two unique keys, got ' + calls);
assert(r.assets.a === 1, 'the first duplicate wins');` },
    { name: "respects_the_concurrency_limit", code: `const pending = [];
let inFlight = 0, peak = 0;
const loadFn = (it) => new Promise((resolve) => {
  inFlight++; peak = Math.max(peak, inFlight);
  pending.push(() => { inFlight--; resolve(it.key); });
});
const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
const keys = ['a', 'b', 'c', 'd', 'e'].map((key) => ({ key }));
const done = loadAll(keys, loadFn, { concurrency: 2 });
await flush();
assert(pending.length === 2 && inFlight === 2, 'only two started, got ' + pending.length);
pending.shift()();
await flush();
assert(inFlight === 2 && pending.length === 2, 'a slot freed so the next one started: inFlight ' + inFlight);
while (pending.length) { pending.shift()(); await flush(); }
const r = await done;
assert(peak === 2, 'peak concurrency ' + peak);
assert(Object.keys(r.assets).length === 5, 'all loaded');` },
    { name: "starts_in_manifest_order", code: `const started = [];
const pending = [];
const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
const done = loadAll(['a', 'b', 'c', 'd'].map((key) => ({ key })), (it) => new Promise((res) => { started.push(it.key); pending.push(res); }), { concurrency: 2 });
await flush();
pending[1](1);
await flush();
assert(started.join('') === 'abc', 'c starts after b finishes first: ' + started.join(''));
pending[0](1); await flush(); pending[2](1); await flush(); pending[3](1);
await done;
assert(started.join('') === 'abcd', 'order ' + started.join(''));` },
    { name: "retries_then_succeeds", code: `const attempts = [];
const r = await loadAll([{ key: 'flaky' }], async (it, attempt) => {
  attempts.push(attempt);
  if (attempt < 2) throw new Error('nope');
  return 'ok';
}, { retries: 3 });
assert(attempts.join(',') === '0,1,2', 'attempt numbers ' + attempts);
assert(r.assets.flaky === 'ok' && r.failed.length === 0, 'succeeded in the end');` },
    { name: "failures_are_recorded_and_do_not_stop_the_rest", code: `const boom = new Error('404');
let calls = 0;
const r = await loadAll([{ key: 'good1' }, { key: 'bad' }, { key: 'good2' }], async (it) => {
  if (it.key === 'bad') { calls++; throw boom; }
  return it.key;
}, { retries: 2 });
assert(calls === 3, 'initial try + 2 retries, got ' + calls);
assert(r.failed.length === 1 && r.failed[0].key === 'bad' && r.failed[0].error === boom, 'failure recorded');
assert(r.assets.good1 === 'good1' && r.assets.good2 === 'good2' && !('bad' in r.assets), 'others loaded');` },
    { name: "progress_counts_finished_items", code: `const events = [];
await loadAll([{ key: 'a' }, { key: 'b' }, { key: 'c' }], async (it) => { if (it.key === 'b') throw new Error('x'); return 1; },
  { concurrency: 1, onProgress: (e) => events.push(e) });
assert(events.length === 3, 'one event per item');
assert(events.map((e) => e.done).join(',') === '1,2,3' && events.every((e) => e.total === 3), 'done climbs to total');
assert(events.map((e) => e.key + ':' + e.ok).join(',') === 'a:true,b:false,c:true', 'ok flags ' + events.map((e) => e.key + ':' + e.ok));` },
    { name: "total_ignores_duplicates", code: `const events = [];
await loadAll([{ key: 'a' }, { key: 'a' }, { key: 'b' }], async () => 1, { onProgress: (e) => events.push(e) });
assert(events.length === 2 && events[1].total === 2 && events[1].done === 2, 'got ' + JSON.stringify(events));` },
    { name: "concurrency_larger_than_the_manifest", code: `const r = await loadAll([{ key: 'a' }], async () => 'x', { concurrency: 50 });
assert(r.assets.a === 'x', 'works');` },
  ],
  solution: {
    code: `async function loadAll(manifest, loadFn, options = {}) {
  const { concurrency = 4, retries = 0, onProgress } = options;
  const seen = new Set();
  const items = manifest.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });

  const assets = {};
  const failed = [];
  let done = 0;
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const item = items[next++];
      let ok = false;
      let lastError;
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          assets[item.key] = await loadFn(item, attempt);
          ok = true;
          break;
        } catch (err) {
          lastError = err;
        }
      }
      if (!ok) failed.push({ key: item.key, error: lastError });
      done++;
      if (onProgress) onProgress({ done, total: items.length, key: item.key, ok });
    }
  }

  const workers = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workers }, worker));
  return { assets, failed };
}

module.exports = loadAll;`,
    explanation:
      "A fixed set of workers pulling from a shared index is the simplest concurrency limiter: there can never be more in flight than workers, and a freed worker immediately takes the next item. Since JavaScript is single-threaded, next++ is safe without locks. Catching errors per item (rather than letting them reject Promise.all) is what lets one missing texture degrade the game instead of killing it.",
  },
};
