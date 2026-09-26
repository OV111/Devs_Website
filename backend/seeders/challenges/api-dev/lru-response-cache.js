export default {
    slug: "lru-response-cache",
    trackId: "api-dev",
    layerId: "api-dev-7",
    type: "CODE",
    difficulty: "easy",
    title: "LRU cache for Express responses",
    summary:
      "Implement a bounded least-recently-used response cache as middleware.",
    description:
      "An unbounded cache is a memory leak with extra steps. Build one that evicts properly.",
    task:
      "Implement a least-recently-used cache as Express middleware. Bound memory, expire on TTL, key on URL + query, and invalidate cleanly.",
    constraints: [
      "Capacity is fixed — the least recently used entry is evicted first.",
      "Entries expire on TTL independently of eviction.",
      "Cache key must include the query string, not just the path.",
      "Reading an entry counts as using it — it must not be the next one evicted.",
    ],
    example: `const cache = lruCache({ capacity: 2, ttlMs: 60_000 });
cache.set('/a', 1);
cache.set('/b', 2);
cache.get('/a');       // touches '/a' — it's now the most recently used
cache.set('/c', 3);    // capacity exceeded — evicts '/b', not '/a'`,
    tags: ["caching", "perf", "data-structures"],
    estimatedMins: 29,
    xp: 45,
    starterFiles: [
      {
        name: "lruCache.js",
        lang: "js",
        code: `// lruCache.js
// Returns an object with get(key), set(key, value), and has(key).
// The Express-middleware wiring is a thin wrapper around this — the cache
// itself is a plain key/value store, which is what's tested here.
function lruCache({ capacity, ttlMs }) {
  // your code here
}

module.exports = lruCache;`,
      },
    ],
    testFile: {
      name: "lruCache_test.js",
      lang: "test",
      code: `// lruCache_test.js
const lruCache = require('./lruCache');

test('stores_and_retrieves', () => {
  const cache = lruCache({ capacity: 2, ttlMs: 60000 });
  cache.set('a', 1);
  expect(cache.get('a')).toBe(1);
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "A plain <code>Map</code> already preserves insertion order, and re-inserting a key moves it to the end — that's most of an LRU right there.",
      },
      {
        order: 2,
        cost: 5,
        text: "On a <code>get</code> that hits, delete and re-set the entry so it moves to the most-recently-used end. On eviction, delete the first key the Map's iterator yields — that's the least recently used one.",
      },
      {
        order: 3,
        cost: 10,
        text: "Store <code>{ value, expiresAt: Date.now() + ttlMs }</code> per entry. On <code>get</code>, check <code>expiresAt</code> before touching recency — an expired read is a miss, not a promotion.",
      },
    ],
    hiddenTests: [
      {
        name: "basic_set_and_get",
        code: `const cache = lruCache({ capacity: 3, ttlMs: 60000 });
cache.set('a', 1);
assert(cache.get('a') === 1, 'expected to read back what was set');
assert(cache.get('missing') === undefined, 'a missing key must return undefined');`,
      },
      {
        name: "evicts_least_recently_used",
        code: `const cache = lruCache({ capacity: 2, ttlMs: 60000 });
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
assert(cache.get('a') === undefined, 'a should have been evicted — capacity is 2 and a was inserted first');
assert(cache.get('b') === 2, 'b should still be present');
assert(cache.get('c') === 3, 'c should still be present');`,
      },
      {
        name: "reading_an_entry_protects_it_from_eviction",
        code: `const cache = lruCache({ capacity: 2, ttlMs: 60000 });
cache.set('a', 1);
cache.set('b', 2);
cache.get('a'); // touch a — b is now the least recently used
cache.set('c', 3);
assert(cache.get('a') === 1, 'a was just read, so it must survive the eviction');
assert(cache.get('b') === undefined, 'b should be the one evicted, not a');`,
      },
      {
        name: "cache_key_includes_query_string",
        code: `const cache = lruCache({ capacity: 5, ttlMs: 60000 });
cache.set('/items?page=1', 'page one');
cache.set('/items?page=2', 'page two');
assert(cache.get('/items?page=1') === 'page one', 'different query strings must be different cache entries');
assert(cache.get('/items?page=2') === 'page two', 'different query strings must be different cache entries');`,
      },
      {
        name: "entries_expire_on_ttl_independent_of_capacity",
        code: `const cache = lruCache({ capacity: 5, ttlMs: 20 });
cache.set('a', 1);
assert(cache.get('a') === 1, 'should be readable immediately after set');
await new Promise((r) => setTimeout(r, 40));
assert(cache.get('a') === undefined, 'entry should have expired after ttlMs elapsed, even though capacity was never exceeded');`,
      },
    ],
    solution: {
      code: `function lruCache({ capacity, ttlMs }) {
  const store = new Map();

  const isExpired = (entry) => Date.now() > entry.expiresAt;

  return {
    get(key) {
      if (!store.has(key)) return undefined;
      const entry = store.get(key);
      if (isExpired(entry)) {
        store.delete(key);
        return undefined;
      }
      store.delete(key);
      store.set(key, entry);
      return entry.value;
    },
    set(key, value) {
      if (store.has(key)) store.delete(key);
      else if (store.size >= capacity) {
        const oldestKey = store.keys().next().value;
        store.delete(oldestKey);
      }
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    has(key) {
      return this.get(key) !== undefined;
    },
  };
}

module.exports = lruCache;`,
      explanation:
        "A Map iterates in insertion order, and deleting-then-re-setting a key moves it to the end of that order — which is exactly the recency ordering an LRU needs, with no separate linked list required. get() promotes on a hit by doing that delete-and-reinsert; on eviction, the Map's own iterator gives up the oldest key first via store.keys().next().value. TTL is tracked per-entry as an absolute expiresAt timestamp rather than a relative counter, so it doesn't depend on eviction ever running — an expired entry is treated as a miss and deleted the moment it's read, independent of whether capacity was ever exceeded.",
    },
};
