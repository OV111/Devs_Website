export default {
  slug: "ttl-cache",
  trackId: "api-dev",
  layerId: "api-dev-7",
  type: "CODE",
  difficulty: "hard",
  title: "TTL cache that survives a cache stampede",
  summary: "A cache with expiry, plus getOrLoad that makes concurrent misses share one load.",
  description:
    "When a popular cache entry expires, hundreds of requests can miss at once and all hit the database: a cache stampede. Sharing one in-flight load per key prevents it.",
  task:
    "Write <code>createTtlCache({ ttlMs, now })</code> returning <code>{ set, get, size, getOrLoad }</code>.",
  constraints: [
    "<code>set(key, value, ttl = ttlMs)</code> stores a value that expires <code>ttl</code> ms later; an entry is expired when <code>now() &gt;= expiresAt</code>.",
    "<code>get(key)</code> returns the value, or <code>undefined</code> if missing or expired (and removes it).",
    "<code>size()</code> counts live entries only.",
    "<code>getOrLoad(key, loader)</code>: return the cached value if live; otherwise call <code>loader()</code>, cache its result and return it.",
    "While a load for a key is in flight, further <code>getOrLoad</code> calls for that key share it (the loader runs once). A rejected load is not cached.",
  ],
  example: `await cache.getOrLoad('user:1', () => db.getUser(1)); // concurrent callers share one db call`,
  tags: ["caching","performance","async"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "createTtlCache.js",
      lang: "js",
      code: `// createTtlCache.js
function createTtlCache(options = {}) {
  // your code here
}

module.exports = createTtlCache;`,
    },
  ],
  testFile: {
    name: "createTtlCache_test.js",
    lang: "test",
    code: `const createTtlCache = require('./createTtlCache');

test('set_get', () => {
  const c = createTtlCache({ now: () => 0 }); c.set('a', 1); expect(c.get('a')).toBe(1);
});

test('expires', () => {
  let t = 0; const c = createTtlCache({ ttlMs: 10, now: () => t }); c.set('a', 1); t = 10; expect(c.get('a')).toBe(undefined);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Store <code>{ value, expiresAt }</code> in a Map and write a small <code>isLive(entry)</code> helper." },
    { order: 2, cost: 5, text: "Keep a second Map <code>inflight</code> from key to the loading promise; delete the entry when the promise settles." },
    { order: 3, cost: 15, text: "Cache only on success: do <code>set</code> in the <code>.then</code>, so a rejection never reaches the cache." },
  ],
  hiddenTests: [
    { name: "set_and_get", code: `const c = createTtlCache({ ttlMs: 1000, now: () => 0 });
c.set('a', 1);
assert(c.get('a') === 1 && c.get('missing') === undefined, 'basic');` },
    { name: "expires_at_boundary", code: `let t = 0; const c = createTtlCache({ ttlMs: 1000, now: () => t });
c.set('a', 1);
t = 999; assert(c.get('a') === 1, 'still live');
t = 1000; assert(c.get('a') === undefined, 'expired at exactly ttl');` },
    { name: "per_key_ttl", code: `let t = 0; const c = createTtlCache({ ttlMs: 1000, now: () => t });
c.set('short', 1, 10); c.set('long', 2);
t = 20;
assert(c.get('short') === undefined && c.get('long') === 2, 'custom ttl');` },
    { name: "size_counts_live_only", code: `let t = 0; const c = createTtlCache({ ttlMs: 100, now: () => t });
c.set('a', 1); c.set('b', 2, 500);
t = 200;
assert(c.size() === 1, 'one live entry, got ' + c.size());` },
    { name: "getOrLoad_loads_then_caches", code: `let calls = 0; const c = createTtlCache({ ttlMs: 1000, now: () => 0 });
const loader = async () => { calls++; return 'v'; };
const a = await c.getOrLoad('k', loader);
const b = await c.getOrLoad('k', loader);
assert(a === 'v' && b === 'v' && calls === 1, 'second call served from cache, calls=' + calls);` },
    { name: "stampede_protection", code: `let calls = 0; const c = createTtlCache({ ttlMs: 1000, now: () => 0 });
const loader = () => new Promise((r) => setTimeout(() => { calls++; r('x'); }, 10));
const results = await Promise.all([c.getOrLoad('k', loader), c.getOrLoad('k', loader), c.getOrLoad('k', loader)]);
assert(calls === 1, 'three concurrent misses, one load; calls=' + calls);
assert(results.join('') === 'xxx', 'everyone gets the value');` },
    { name: "reloads_after_expiry", code: `let t = 0; let calls = 0; const c = createTtlCache({ ttlMs: 100, now: () => t });
const loader = async () => ++calls;
await c.getOrLoad('k', loader);
t = 100;
const v = await c.getOrLoad('k', loader);
assert(v === 2 && calls === 2, 'expired entry is reloaded');` },
    { name: "failed_load_not_cached", code: `let calls = 0; const c = createTtlCache({ ttlMs: 1000, now: () => 0 });
let err = null;
try { await c.getOrLoad('k', async () => { calls++; throw new Error('boom'); }); } catch (e) { err = e; }
assert(err && err.message === 'boom', 'rejection propagates');
const v = await c.getOrLoad('k', async () => { calls++; return 'ok'; });
assert(v === 'ok' && calls === 2, 'next call tries again');` },
  ],
  solution: {
    code: `function createTtlCache({ ttlMs = 60000, now = () => Date.now() } = {}) {
  const store = new Map();
  const inflight = new Map();
  const isLive = (e) => e !== undefined && e.expiresAt > now();
  const api = {
    set(key, value, ttl = ttlMs) {
      store.set(key, { value, expiresAt: now() + ttl });
    },
    get(key) {
      const e = store.get(key);
      if (isLive(e)) return e.value;
      store.delete(key);
      return undefined;
    },
    size() {
      for (const [k, e] of store) if (!isLive(e)) store.delete(k);
      return store.size;
    },
    async getOrLoad(key, loader) {
      const hit = api.get(key);
      if (hit !== undefined) return hit;
      if (inflight.has(key)) return inflight.get(key);
      const promise = Promise.resolve()
        .then(loader)
        .then((value) => {
          api.set(key, value);
          return value;
        })
        .finally(() => inflight.delete(key));
      inflight.set(key, promise);
      return promise;
    },
  };
  return api;
}

module.exports = createTtlCache;`,
    explanation:
      "Expiry is checked lazily on read. The inflight Map is the stampede guard: the first miss starts the load and everyone else awaits the same promise. Caching happens only in the success branch.",
  },
};
