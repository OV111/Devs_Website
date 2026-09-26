export default {
  slug: "object-pool",
  trackId: "web-game",
  layerId: "web-game-10",
  type: "CODE",
  difficulty: "med",
  title: "An object pool to stop bullets from triggering the GC",
  summary:
    "Reuse a fixed set of objects instead of allocating and discarding thousands per second.",
  description:
    "A bullet-hell game firing hundreds of projectiles a second, each `new Bullet()`-ed and thrown away on impact, creates enough garbage to cause a GC pause — which on a 60fps game is a visible stutter. Pooling is the standard fix.",
  task:
    "Write <code>createObjectPool(factory, reset, initialSize)</code>. <code>factory()</code> creates a new object; <code>reset(obj)</code> restores a returned object to a clean, reusable state. Pre-create <code>initialSize</code> objects up front. Return <code>{ acquire(), release(obj), size() }</code>. <code>acquire()</code> hands out an available object (creating a new one via <code>factory()</code> only if the pool is empty) and marks it as in-use. <code>release(obj)</code> resets it and returns it to the available pool. <code>size()</code> reports how many objects currently exist in the pool in total (available + in-use).",
  constraints: [
    "acquire() must never return an object that is already in use elsewhere — each active object is handed out to exactly one caller at a time.",
    "release() must call reset(obj) before the object becomes available again.",
    "The pool only grows past initialSize when acquire() is called with nothing available — it must not pre-allocate more than initialSize up front.",
    "Releasing an object not currently tracked as in-use by this pool must be a no-op, not a crash.",
  ],
  example: `const pool = createObjectPool(
  () => ({ x: 0, y: 0, active: false }),
  (b) => { b.x = 0; b.y = 0; b.active = false; },
  5,
);
const bullet = pool.acquire();
bullet.active = true;
bullet.x = 100;
// ...bullet hits something...
pool.release(bullet); // bullet.active is now false again, ready for reuse`,
  tags: ["performance", "memory", "game-architecture"],
  estimatedMins: 25,
  xp: 40,
  starterFiles: [
    {
      name: "createObjectPool.js",
      lang: "js",
      code: `// createObjectPool.js
function createObjectPool(factory, reset, initialSize) {
  // your code here
}

module.exports = createObjectPool;`,
    },
  ],
  testFile: {
    name: "createObjectPool_test.js",
    lang: "test",
    code: `// createObjectPool_test.js
const createObjectPool = require('./createObjectPool');

test('acquire_returns_an_object', () => {
  const pool = createObjectPool(() => ({ n: 0 }), (o) => { o.n = 0; }, 2);
  const obj = pool.acquire();
  expect(typeof obj).toBe('object');
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "Two arrays (or a Set for in-use) do the job: one for objects available to hand out, one to track which are currently in use — acquire moves an object from available to in-use, release does the reverse.",
    },
    {
      order: 2,
      cost: 5,
      text: "Pre-fill only the AVAILABLE list with <code>initialSize</code> factory-created objects up front. If acquire() is called and available is empty, call <code>factory()</code> right then to grow the pool by one.",
    },
    {
      order: 3,
      cost: 10,
      text: "For release() to safely ignore an object it isn't tracking, check whether the object is actually present in your in-use tracking structure before doing anything — a Set's <code>.has()</code> makes this a one-line guard.",
    },
  ],
  hiddenTests: [
    {
      name: "acquire_returns_a_usable_object",
      code: `const pool = createObjectPool(() => ({ n: 0 }), (o) => { o.n = 0; }, 2);
const obj = pool.acquire();
assert(obj && typeof obj === 'object', 'acquire() must return an object');`,
    },
    {
      name: "does_not_hand_out_the_same_object_twice",
      code: `const pool = createObjectPool(() => ({ n: 0 }), (o) => { o.n = 0; }, 2);
const a = pool.acquire();
const b = pool.acquire();
assert(a !== b, 'two acquire() calls without a release in between must return different objects');`,
    },
    {
      name: "release_resets_and_makes_reusable",
      code: `const pool = createObjectPool(() => ({ n: 0 }), (o) => { o.n = -1; }, 1);
const a = pool.acquire();
a.n = 999;
pool.release(a);
const b = pool.acquire();
assert(a === b, 'with initialSize 1, releasing the only object and acquiring again must return that same object');
assert(b.n === -1, 'release() must call reset() before the object is handed out again, got n=' + b.n);`,
    },
    {
      name: "grows_beyond_initialSize_only_when_needed",
      code: `let created = 0;
const pool = createObjectPool(() => { created++; return { n: 0 }; }, (o) => { o.n = 0; }, 1);
assert(created === 1, 'exactly initialSize (1) objects should be pre-created, got ' + created);
pool.acquire();
pool.acquire(); // pool was empty — must grow
assert(created === 2, 'the pool should grow by exactly one when acquire() is called with nothing available, got ' + created + ' total created');`,
    },
    {
      name: "size_reports_total_available_plus_in_use",
      code: `const pool = createObjectPool(() => ({ n: 0 }), (o) => { o.n = 0; }, 3);
assert(pool.size() === 3, 'size() right after creation should equal initialSize, got ' + pool.size());
pool.acquire();
pool.acquire();
assert(pool.size() === 3, 'size() must count in-use objects too — acquiring does not shrink the total, got ' + pool.size());
const extra = pool.acquire();
pool.acquire(); // this one forces growth (only 3 existed, all now in use)
assert(pool.size() === 4, 'after the pool grows by one to satisfy a 4th acquire, size() should be 4, got ' + pool.size());`,
    },
    {
      name: "releasing_an_untracked_object_is_a_no_op",
      code: `const pool = createObjectPool(() => ({ n: 0 }), (o) => { o.n = 0; }, 1);
const stranger = { n: 12345 };
let threw = false;
try { pool.release(stranger); } catch (e) { threw = true; }
assert(threw === false, 'releasing an object the pool never handed out must not throw');
assert(pool.size() === 1, 'releasing an untracked object must not change the pool size, got ' + pool.size());`,
    },
  ],
  solution: {
    code: `function createObjectPool(factory, reset, initialSize) {
  const available = [];
  const inUse = new Set();

  for (let i = 0; i < initialSize; i++) {
    available.push(factory());
  }

  function acquire() {
    const obj = available.length > 0 ? available.pop() : factory();
    inUse.add(obj);
    return obj;
  }

  function release(obj) {
    if (!inUse.has(obj)) return;
    inUse.delete(obj);
    reset(obj);
    available.push(obj);
  }

  function size() {
    return available.length + inUse.size;
  }

  return { acquire, release, size };
}

module.exports = createObjectPool;`,
    explanation:
      "The pool is really just two collections tracking which objects are where: available (a stack, since order doesn't matter — LIFO is simplest) and inUse (a Set, since membership checks are what release() needs, not order). Only available is pre-filled up front, which is why the pool starts at exactly initialSize rather than allocating extra headroom nobody asked for; growth only happens inside acquire() itself, and only on the specific call that finds available empty. release() checks inUse.has(obj) first specifically so handing it a stranger object is inert — that guard is what keeps a stray release() call from corrupting the pool's bookkeeping by adding an object it never tracked. reset() runs during release(), not during acquire(), so a caller always gets a clean object regardless of what the previous holder left in it, without needing to remember to clean up after themselves.",
  },
};
