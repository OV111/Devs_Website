export default {
  slug: "query-cache",
  trackId: "mern",
  layerId: "mern-8",
  type: "CODE",
  difficulty: "hard",
  title: "Query cache like React Query",
  summary: "Cache server data by key with staleTime, request de-duplication, invalidation and optimistic updates.",
  description:
    "React Query's value is its cache: components asking for the same data share one request, fresh data isn't refetched, and mutations invalidate what they changed. The core is a Map plus a few rules.",
  task:
    "Write <code>createQueryCache({ now })</code> returning <code>{ fetchQuery, getQueryData, setQueryData, invalidateQueries }</code>. Query keys are arrays such as <code>['todos', 1]</code>.",
  constraints: [
    "<code>fetchQuery(key, fetcher, { staleTime = 0 })</code> returns a promise of the data. If an entry exists, is not invalidated, and is younger than <code>staleTime</code> ms (<code>now() - updatedAt &lt; staleTime</code>) return it without calling <code>fetcher</code>. Otherwise call <code>fetcher()</code> and store the result with <code>updatedAt = now()</code>.",
    "Concurrent <code>fetchQuery</code> calls for the same key share ONE in-flight fetch. After it settles, a new call fetches again (subject to staleness).",
    "If a fetch fails the promise rejects and any previously cached data stays untouched.",
    "<code>getQueryData(key)</code> returns the cached data or <code>undefined</code>. <code>setQueryData(key, updaterOrValue)</code> stores a value (or <code>updater(oldData)</code>), marks it fresh, and returns it, which is how optimistic updates work.",
    "<code>invalidateQueries(prefixKey)</code> marks every entry whose key STARTS WITH <code>prefixKey</code> (element-wise, compared with <code>JSON.stringify</code>) as invalid, so the next <code>fetchQuery</code> refetches regardless of <code>staleTime</code>. It returns the number of entries marked. Keys are identified by <code>JSON.stringify(key)</code>.",
  ],
  example: `await cache.fetchQuery(['todos'], () => api.get('/todos'), { staleTime: 30000 }); cache.invalidateQueries(['todos']);`,
  tags: ["react-query","caching","server-state","async"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "createQueryCache.js",
      lang: "js",
      code: `// createQueryCache.js
function createQueryCache(options = {}) {
  // your code here
}

module.exports = createQueryCache;`,
    },
  ],
  testFile: {
    name: "createQueryCache_test.js",
    lang: "test",
    code: `const createQueryCache = require('./createQueryCache');

test('caches', () => {
  let n = 0; const c = createQueryCache({ now: () => 0 }); return c.fetchQuery(['a'], async () => ++n, { staleTime: 1000 }).then(() => c.fetchQuery(['a'], async () => ++n, { staleTime: 1000 })).then((v) => { expect(v).toBe(1); expect(n).toBe(1); });
});

test('get_unknown', () => {
  expect(createQueryCache().getQueryData(['x'])).toBe(undefined);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>entries</code> (hash to <code>{ key, data, updatedAt, invalidated }</code>) and <code>inflight</code> (hash to promise) Maps, with <code>hash = JSON.stringify(key)</code>." },
    { order: 2, cost: 5, text: "In <code>fetchQuery</code>, check freshness first, then the inflight Map, then start the fetch. Store the promise in <code>inflight</code> synchronously (the function can be <code>async</code>: its body runs synchronously up to the first await) and remove it in <code>finally</code>." },
    { order: 3, cost: 15, text: "For invalidation compare each prefix element with the same position of the entry's key using <code>JSON.stringify</code>, and require <code>prefix.length &lt;= key.length</code>." },
  ],
  hiddenTests: [
    { name: "fetches_and_returns_data", code: `const c = createQueryCache({ now: () => 0 });
const data = await c.fetchQuery(['todos'], async () => [1, 2]);
assert(data.length === 2, 'data returned');
assert(c.getQueryData(['todos']).length === 2, 'and cached');` },
    { name: "fresh_data_is_served_from_cache", code: `let t = 0; let calls = 0; const c = createQueryCache({ now: () => t });
const f = async () => ++calls;
await c.fetchQuery(['a'], f, { staleTime: 1000 });
t = 999;
const v = await c.fetchQuery(['a'], f, { staleTime: 1000 });
assert(v === 1 && calls === 1, 'still fresh at 999ms, calls=' + calls);` },
    { name: "stale_data_is_refetched_at_the_boundary", code: `let t = 0; let calls = 0; const c = createQueryCache({ now: () => t });
const f = async () => ++calls;
await c.fetchQuery(['a'], f, { staleTime: 1000 });
t = 1000;
const v = await c.fetchQuery(['a'], f, { staleTime: 1000 });
assert(v === 2 && calls === 2, 'stale at exactly staleTime');` },
    { name: "default_stale_time_is_zero", code: `let calls = 0; const c = createQueryCache({ now: () => 0 });
const f = async () => ++calls;
await c.fetchQuery(['a'], f); await c.fetchQuery(['a'], f);
assert(calls === 2, 'always refetch when staleTime is 0');` },
    { name: "concurrent_calls_share_one_fetch", code: `let calls = 0; const c = createQueryCache({ now: () => 0 });
const f = () => new Promise((r) => setTimeout(() => { calls++; r('x'); }, 10));
const results = await Promise.all([c.fetchQuery(['a'], f), c.fetchQuery(['a'], f), c.fetchQuery(['a'], f)]);
assert(calls === 1, 'one request for three callers, got ' + calls);
assert(results.join('') === 'xxx', 'all receive the data');` },
    { name: "different_keys_are_independent", code: `let calls = 0; const c = createQueryCache({ now: () => 0 });
const f = async () => ++calls;
await Promise.all([c.fetchQuery(['todos', 1], f, { staleTime: 99 }), c.fetchQuery(['todos', 2], f, { staleTime: 99 }), c.fetchQuery(['todos', { done: true }], f, { staleTime: 99 })]);
assert(calls === 3, 'three keys, three fetches');
await c.fetchQuery(['todos', { done: true }], f, { staleTime: 99 });
assert(calls === 3, 'object parts of a key are compared by value');` },
    { name: "failed_fetch_rejects_and_keeps_old_data", code: `let t = 0; let fail = false; const c = createQueryCache({ now: () => t });
const f = async () => { if (fail) throw new Error('network'); return 'good'; };
await c.fetchQuery(['a'], f, { staleTime: 10 });
fail = true; t = 100;
let err = null;
try { await c.fetchQuery(['a'], f, { staleTime: 10 }); } catch (e) { err = e; }
assert(err && err.message === 'network', 'rejects');
assert(c.getQueryData(['a']) === 'good', 'old data survives');
fail = false;
assert(await c.fetchQuery(['a'], f, { staleTime: 10 }) === 'good', 'next call retries because the failed fetch left nothing in flight');` },
    { name: "sync_throwing_fetcher_rejects", code: `const c = createQueryCache({ now: () => 0 });
let err = null;
try { await c.fetchQuery(['a'], () => { throw new Error('sync'); }); } catch (e) { err = e; }
assert(err && err.message === 'sync', 'rejects instead of throwing synchronously');` },
    { name: "invalidate_forces_refetch_despite_fresh", code: `let calls = 0; const c = createQueryCache({ now: () => 0 });
const f = async () => ++calls;
await c.fetchQuery(['todos'], f, { staleTime: 100000 });
const n = c.invalidateQueries(['todos']);
assert(n === 1, 'one entry marked, got ' + n);
const v = await c.fetchQuery(['todos'], f, { staleTime: 100000 });
assert(v === 2 && calls === 2, 'refetched');
await c.fetchQuery(['todos'], f, { staleTime: 100000 });
assert(calls === 2, 'fresh again after the refetch');` },
    { name: "invalidate_by_prefix_only", code: `let calls = 0; const c = createQueryCache({ now: () => 0 });
const f = async () => ++calls;
for (const key of [['todos'], ['todos', 1], ['todos', 2, 'comments'], ['users', 1], ['todo']]) await c.fetchQuery(key, f, { staleTime: 1e9 });
assert(c.invalidateQueries(['todos']) === 3, 'matches todos, todos/1 and todos/2/comments only');
assert(c.invalidateQueries(['todos', 2]) === 1, 'longer prefix');
assert(c.invalidateQueries(['nothing']) === 0, 'no match');
assert(c.invalidateQueries(['users', 1, 'deeper']) === 0, 'prefix longer than the key never matches');
const before = calls;
await c.fetchQuery(['users', 1], f, { staleTime: 1e9 });
assert(calls === before, 'unrelated entry untouched');` },
    { name: "set_query_data_value_and_updater", code: `const c = createQueryCache({ now: () => 0 });
assert(c.setQueryData(['a'], [1]).length === 1 && c.getQueryData(['a'])[0] === 1, 'value');
const next = c.setQueryData(['a'], (old) => [...old, 2]);
assert(next.join(',') === '1,2' && c.getQueryData(['a']).join(',') === '1,2', 'updater gets the old data');
assert(c.setQueryData(['fresh'], (old) => (old === undefined ? 'was-empty' : old)) === 'was-empty', 'updater with no data yet receives undefined');` },
    { name: "set_query_data_marks_entry_fresh", code: `let calls = 0; let t = 0; const c = createQueryCache({ now: () => t });
c.setQueryData(['a'], 'optimistic');
const v = await c.fetchQuery(['a'], async () => { calls++; return 'server'; }, { staleTime: 1000 });
assert(v === 'optimistic' && calls === 0, 'fresh, no fetch');
c.invalidateQueries(['a']);
assert(await c.fetchQuery(['a'], async () => { calls++; return 'server'; }, { staleTime: 1000 }) === 'server', 'invalidate then fetch replaces the optimistic value');
assert(c.getQueryData(['a']) === 'server', 'cache updated');` },
    { name: "optimistic_update_with_rollback", code: `const c = createQueryCache({ now: () => 0 });
await c.fetchQuery(['todos'], async () => [{ id: 1, done: false }], { staleTime: 1e9 });
const snapshot = c.getQueryData(['todos']);
c.setQueryData(['todos'], (old) => old.map((t) => ({ ...t, done: true })));
assert(c.getQueryData(['todos'])[0].done === true, 'optimistic');
c.setQueryData(['todos'], snapshot);
assert(c.getQueryData(['todos'])[0].done === false, 'rolled back: the old array object was not mutated');` },
  ],
  solution: {
    code: `function createQueryCache({ now = () => Date.now() } = {}) {
  const entries = new Map();
  const inflight = new Map();
  const hash = (key) => JSON.stringify(key);

  return {
    async fetchQuery(key, fetcher, { staleTime = 0 } = {}) {
      const h = hash(key);
      const entry = entries.get(h);
      if (entry && !entry.invalidated && now() - entry.updatedAt < staleTime) return entry.data;
      if (inflight.has(h)) return inflight.get(h);
      const promise = Promise.resolve()
        .then(fetcher)
        .then((data) => {
          entries.set(h, { key, data, updatedAt: now(), invalidated: false });
          return data;
        })
        .finally(() => inflight.delete(h));
      inflight.set(h, promise);
      return promise;
    },
    getQueryData(key) {
      const entry = entries.get(hash(key));
      return entry ? entry.data : undefined;
    },
    setQueryData(key, updater) {
      const h = hash(key);
      const old = entries.get(h);
      const data = typeof updater === 'function' ? updater(old ? old.data : undefined) : updater;
      entries.set(h, { key, data, updatedAt: now(), invalidated: false });
      return data;
    },
    invalidateQueries(prefix) {
      let count = 0;
      for (const entry of entries.values()) {
        const matches =
          prefix.length <= entry.key.length &&
          prefix.every((part, i) => JSON.stringify(part) === JSON.stringify(entry.key[i]));
        if (matches) {
          entry.invalidated = true;
          count++;
        }
      }
      return count;
    },
  };
}

module.exports = createQueryCache;`,
    explanation:
      "The cache is two Maps. The inflight Map is what lets ten components asking for the same key share one request, and the invalidated flag overrides freshness. setQueryData writes straight into the same entries, so optimistic updates and server data live in one place.",
  },
};
