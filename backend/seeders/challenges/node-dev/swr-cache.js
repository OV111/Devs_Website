export default {
  slug: "swr-cache",
  trackId: "node-dev",
  layerId: "node-dev-9",
  type: "CODE",
  difficulty: "hard",
  title: "Stale-while-revalidate cache",
  summary: "Serve fresh data from cache, serve slightly stale data instantly while refreshing in the background, and block only when truly expired.",
  description:
    "Waiting for a slow backend on every expiry makes some unlucky user slow. Stale-while-revalidate (an HTTP Cache-Control directive, and the idea behind SWR and React Query) serves the old value immediately during a grace window and refreshes behind the scenes, with at most one refresh in flight.",
  task:
    "Write <code>createSwrCache({ ttlMs, staleMs = 0, load, now, onError })</code> returning <code>{ get, peek, invalidate }</code>. <code>load(key)</code> returns a promise (or value) for fresh data.",
  constraints: [
    "An entry stored at time <code>storedAt</code> has age <code>now() - storedAt</code>: <b>fresh</b> if <code>age &lt; ttlMs</code>, <b>stale</b> if <code>age &lt; ttlMs + staleMs</code>, otherwise <b>expired</b>; a key without an entry is <b>missing</b>.",
    "<code>get(key)</code> (async): fresh returns the value without calling <code>load</code>. Stale returns the OLD value immediately and starts a background <code>load(key)</code> (only if none is in flight for that key); when it succeeds the entry is replaced with <code>storedAt = now()</code>. Missing or expired awaits <code>load(key)</code>, stores the result and returns it.",
    "Concurrent loads for the same key are shared (one <code>load</code> call). A new load can start after the previous one settled.",
    "If a background refresh fails, the stale entry is kept untouched, <code>onError(err, key)</code> is called once for that failure, and nothing is thrown to the caller. If a foreground load fails, <code>get</code> rejects with that error and nothing is stored.",
    "<code>peek(key)</code> returns <code>{ state, value }</code> (<code>value</code> is <code>undefined</code> when missing) without loading. <code>invalidate(key)</code> deletes the entry and returns whether one existed.",
  ],
  example: `const cache = createSwrCache({ ttlMs: 60000, staleMs: 300000, load: (id) => db.getUser(id) }); await cache.get(7);`,
  tags: ["caching","swr","performance","async"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "createSwrCache.js",
      lang: "js",
      code: `// createSwrCache.js
function createSwrCache(options) {
  // your code here
}

module.exports = createSwrCache;`,
    },
  ],
  testFile: {
    name: "createSwrCache_test.js",
    lang: "test",
    code: `const createSwrCache = require('./createSwrCache');

test('loads_once', () => {
  let n = 0; const c = createSwrCache({ ttlMs: 100, now: () => 0, load: async () => ++n }); return c.get('a').then(() => c.get('a')).then((v) => { expect(v).toBe(1); expect(n).toBe(1); });
});

test('peek', () => {
  const c = createSwrCache({ ttlMs: 100, now: () => 0, load: async () => 1 }); expect(c.peek('a').state).toBe('missing');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>store</code> Map of <code>{ value, storedAt }</code> and an <code>inflight</code> Map of promises; one <code>stateOf(entry)</code> helper turns an entry plus <code>now()</code> into <code>'fresh' | 'stale' | 'expired' | 'missing'</code>." },
    { order: 2, cost: 5, text: "Write <code>refresh(key, background)</code>: return the in-flight promise if there is one; otherwise create it with <code>Promise.resolve().then(() =&gt; load(key))</code>, store on success, delete from <code>inflight</code> in <code>finally</code>, and attach the <code>onError</code> catch only when it is a background refresh you just created." },
    { order: 3, cost: 15, text: "In <code>get</code> return <code>entry.value</code> straight away for stale entries; don't await the refresh." },
  ],
  hiddenTests: [
    { name: "first_get_loads_and_caches", code: `let calls = []; const c = createSwrCache({ ttlMs: 1000, now: () => 0, load: async (k) => { calls.push(k); return 'v:' + k; } });
assert(await c.get('a') === 'v:a', 'loaded value');
assert(await c.get('a') === 'v:a' && calls.length === 1, 'second get is served from cache; load received the key: ' + calls);` },
    { name: "fresh_entries_never_call_load", code: `let t = 0; let calls = 0; const c = createSwrCache({ ttlMs: 1000, staleMs: 5000, now: () => t, load: async () => ++calls });
await c.get('a');
t = 999;
assert(await c.get('a') === 1 && calls === 1, 'fresh up to ttl');` },
    { name: "state_boundaries_via_peek", code: `let t = 0; const c = createSwrCache({ ttlMs: 1000, staleMs: 4000, now: () => t, load: async () => 'v' });
assert(c.peek('a').state === 'missing' && c.peek('a').value === undefined, 'missing');
await c.get('a');
assert(c.peek('a').state === 'fresh' && c.peek('a').value === 'v', 'fresh');
t = 999; assert(c.peek('a').state === 'fresh', '999 is fresh');
t = 1000; assert(c.peek('a').state === 'stale', 'stale from ttl');
t = 4999; assert(c.peek('a').state === 'stale', 'stale until ttl + staleMs');
t = 5000; assert(c.peek('a').state === 'expired', 'expired from ttl + staleMs');
assert(c.peek('a').value === 'v', 'peek still shows the old value');` },
    { name: "stale_returns_old_value_immediately_and_refreshes_in_background", code: `let t = 0; let n = 0; let release;
const c = createSwrCache({ ttlMs: 1000, staleMs: 5000, now: () => t, load: () => { n++; return n === 1 ? Promise.resolve('old') : new Promise((r) => { release = () => r('new'); }); } });
await c.get('a');
t = 2000;
const v = await c.get('a');
assert(v === 'old', 'the stale value is returned without waiting for the slow refresh');
assert(n === 2, 'a refresh was started');
assert(c.peek('a').value === 'old', 'not replaced yet');
release();
await new Promise((r) => setTimeout(r, 5));
assert(c.peek('a').value === 'new' && c.peek('a').state === 'fresh', 'replaced and fresh again: ' + JSON.stringify(c.peek('a')));
assert(await c.get('a') === 'new' && n === 2, 'later gets serve the new value');` },
    { name: "only_one_background_refresh_at_a_time", code: `let t = 0; let n = 0; let release;
const c = createSwrCache({ ttlMs: 1000, staleMs: 5000, now: () => t, load: () => { n++; return n === 1 ? Promise.resolve('v1') : new Promise((r) => { release = () => r('v2'); }); } });
await c.get('a');
t = 2000;
await Promise.all([c.get('a'), c.get('a'), c.get('a')]);
await c.get('a');
assert(n === 2, 'four stale gets, one refresh: ' + n);
release();
await new Promise((r) => setTimeout(r, 5));
t = 4000;
await c.get('a');
assert(n === 3, 'a new refresh may start after the previous settled (the entry went stale again)');` },
    { name: "stale_refresh_failure_keeps_the_entry_and_reports_once", code: `let t = 0; let fail = false; const errors = [];
const c = createSwrCache({ ttlMs: 1000, staleMs: 5000, now: () => t, onError: (e, k) => errors.push(k + ':' + e.message), load: async () => { if (fail) throw new Error('origin down'); return 'good'; } });
await c.get('a');
t = 2000; fail = true;
assert(await c.get('a') === 'good', 'still serves the stale value');
await new Promise((r) => setTimeout(r, 5));
assert(errors.join() === 'a:origin down', 'reported once: ' + errors);
assert(c.peek('a').value === 'good' && c.peek('a').state === 'stale', 'entry untouched, still stale');
fail = false;
await c.get('a');
await new Promise((r) => setTimeout(r, 5));
assert(c.peek('a').state === 'fresh', 'the next stale get retried and recovered');` },
    { name: "background_failures_never_reach_the_caller_even_without_onError", code: `let t = 0; let fail = false;
const c = createSwrCache({ ttlMs: 10, staleMs: 1000, now: () => t, load: async () => { if (fail) throw new Error('x'); return 1; } });
await c.get('a'); t = 20; fail = true;
const v = await c.get('a');
await new Promise((r) => setTimeout(r, 20));
assert(v === 1, 'the stale value is returned and nothing throws');
assert(c.peek('a').value === 1 && c.peek('a').state === 'stale', 'the entry survives the failed refresh');` },
    { name: "expired_entries_block_on_a_fresh_load", code: `let t = 0; let n = 0;
const c = createSwrCache({ ttlMs: 1000, staleMs: 1000, now: () => t, load: async () => { await new Promise((r) => setTimeout(r, 5)); return ++n; } });
await c.get('a');
t = 2000;
const v = await c.get('a');
assert(v === 2 && n === 2, 'past the grace window the caller waits for the new value: ' + v);
assert(c.peek('a').state === 'fresh', 'stored');` },
    { name: "no_stale_window_by_default", code: `let t = 0; let n = 0;
const c = createSwrCache({ ttlMs: 1000, now: () => t, load: async () => ++n });
await c.get('a');
t = 1000;
assert(await c.get('a') === 2, 'right after ttl the entry is expired, so we wait for the load');` },
    { name: "concurrent_cold_gets_share_one_load", code: `let n = 0;
const c = createSwrCache({ ttlMs: 1000, now: () => 0, load: () => new Promise((r) => setTimeout(() => { n++; r('x'); }, 10)) });
const results = await Promise.all([c.get('a'), c.get('a'), c.get('a')]);
assert(n === 1 && results.join('') === 'xxx', 'one load for three callers: ' + n);` },
    { name: "foreground_failure_rejects_and_stores_nothing", code: `let fail = true; let n = 0;
const c = createSwrCache({ ttlMs: 1000, now: () => 0, load: async () => { n++; if (fail) throw new Error('boom'); return 'ok'; } });
let err = null;
try { await c.get('a'); } catch (e) { err = e; }
assert(err && err.message === 'boom', 'rejects with the load error');
assert(c.peek('a').state === 'missing', 'nothing stored');
fail = false;
assert(await c.get('a') === 'ok' && n === 2, 'the next call retries');` },
    { name: "expired_entry_with_failing_load_rejects", code: `let t = 0; let fail = false;
const c = createSwrCache({ ttlMs: 10, staleMs: 10, now: () => t, load: async () => { if (fail) throw new Error('down'); return 'v'; } });
await c.get('a'); t = 100; fail = true;
let err = null;
try { await c.get('a'); } catch (e) { err = e; }
assert(err && err.message === 'down', 'expired data is not served');` },
    { name: "keys_are_independent", code: `let t = 0; const calls = [];
const c = createSwrCache({ ttlMs: 1000, now: () => t, load: async (k) => { calls.push(k); return k.toUpperCase(); } });
assert(await c.get('a') === 'A' && await c.get('b') === 'B', 'two keys');
await c.get('a'); await c.get('b');
assert(calls.join() === 'a,b', 'each loaded once');` },
    { name: "invalidate", code: `let n = 0; const c = createSwrCache({ ttlMs: 1000, now: () => 0, load: async () => ++n });
await c.get('a');
assert(c.invalidate('a') === true && c.invalidate('a') === false && c.invalidate('nope') === false, 'return values');
assert(c.peek('a').state === 'missing', 'gone');
assert(await c.get('a') === 2, 'reloaded');` },
    { name: "load_may_return_plain_values", code: `const c = createSwrCache({ ttlMs: 1000, now: () => 0, load: (k) => 'sync:' + k });
assert(await c.get('x') === 'sync:x', 'non-promise results work');` },
    { name: "falsy_values_are_cached", code: `let n = 0; const c = createSwrCache({ ttlMs: 1000, now: () => 0, load: async () => { n++; return 0; } });
assert(await c.get('a') === 0 && await c.get('a') === 0 && n === 1, 'a cached 0 is a hit');
let m = 0; const d = createSwrCache({ ttlMs: 1000, now: () => 0, load: async () => { m++; return null; } });
await d.get('a'); await d.get('a');
assert(m === 1, 'null too');` },
  ],
  solution: {
    code: `function createSwrCache({ ttlMs, staleMs = 0, load, now = () => Date.now(), onError = () => {} }) {
  const store = new Map();
  const inflight = new Map();

  function stateOf(entry) {
    if (!entry) return 'missing';
    const age = now() - entry.storedAt;
    if (age < ttlMs) return 'fresh';
    if (age < ttlMs + staleMs) return 'stale';
    return 'expired';
  }

  function refresh(key, background) {
    if (inflight.has(key)) return inflight.get(key);
    const promise = Promise.resolve()
      .then(() => load(key))
      .then((value) => {
        store.set(key, { value, storedAt: now() });
        return value;
      })
      .finally(() => inflight.delete(key));
    inflight.set(key, promise);
    if (background) promise.catch((err) => onError(err, key));
    return promise;
  }

  return {
    async get(key) {
      const entry = store.get(key);
      const state = stateOf(entry);
      if (state === 'fresh') return entry.value;
      if (state === 'stale') {
        refresh(key, true);
        return entry.value;
      }
      return refresh(key, false);
    },
    peek(key) {
      const entry = store.get(key);
      return { state: stateOf(entry), value: entry ? entry.value : undefined };
    },
    invalidate(key) {
      return store.delete(key);
    },
  };
}

module.exports = createSwrCache;`,
    explanation:
      "The three states decide the behavior: fresh serves, stale serves AND refreshes, expired waits. The in-flight Map guarantees one origin call per key, and attaching the error handler only to a background refresh that you started yourself keeps failures from becoming unhandled rejections.",
  },
};
