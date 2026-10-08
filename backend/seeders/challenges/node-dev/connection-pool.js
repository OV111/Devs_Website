export default {
  slug: "connection-pool",
  trackId: "node-dev",
  layerId: "node-dev-5",
  type: "CODE",
  difficulty: "hard",
  title: "Database connection pool",
  summary: "Lend out a limited number of connections, queue waiters fairly, time out, discard broken ones, and shut down cleanly.",
  description:
    "Opening a database connection is slow and servers allow only a few hundred. Prisma and <code>pg</code> use a pool: a fixed set of reusable connections. When all are busy, requests wait in line (and eventually time out) instead of overwhelming the database.",
  task:
    "Write <code>createPool({ create, destroy, max = 3, acquireTimeoutMs = 1000 })</code> returning <code>{ acquire, release, discard, stats, end }</code>. <code>create()</code> and <code>destroy(resource)</code> are async.",
  constraints: [
    "<code>acquire()</code> resolves with a resource: reuse an idle one (oldest idle first); else create one if fewer than <code>max</code> exist (count it immediately so concurrent acquires never exceed <code>max</code>); else wait in a FIFO queue.",
    "A waiter that is not served within <code>acquireTimeoutMs</code> is removed from the queue and rejects with <code>Error('Timed out waiting for a connection')</code>.",
    "<code>release(resource)</code> hands the resource straight to the first waiter, or makes it idle. Releasing something not currently in use throws <code>Error('Resource not in use')</code>.",
    "<code>discard(resource)</code> (for a broken connection) removes it from the pool, calls <code>destroy</code>, and if someone is waiting creates a replacement for the first waiter. If <code>create</code> fails, <code>acquire</code> rejects with that error and the slot is freed.",
    "<code>stats()</code> is <code>{ total, idle, inUse, waiting }</code>. <code>end()</code> closes the pool: waiters reject with <code>Error('Pool is closed')</code>, idle resources are destroyed, in-use ones are destroyed when released, later <code>acquire</code> calls reject with <code>Error('Pool is closed')</code>, and the returned promise resolves once every resource is destroyed.",
  ],
  example: `const conn = await pool.acquire(); try { await conn.query('...'); } finally { pool.release(conn); }`,
  tags: ["pooling","postgres","prisma","concurrency"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "createPool.js",
      lang: "js",
      code: `// createPool.js
function createPool(options) {
  // your code here
}

module.exports = createPool;`,
    },
  ],
  testFile: {
    name: "createPool_test.js",
    lang: "test",
    code: `const createPool = require('./createPool');

test('reuses', () => {
  let n = 0; const p = createPool({ create: async () => ({ id: ++n }) }); return p.acquire().then((a) => { p.release(a); return p.acquire().then((b) => expect(b).toBe(a)); });
});

test('stats', () => {
  const p = createPool({ create: async () => ({}), max: 2 }); return p.acquire().then(() => expect(p.stats()).toEqual({ total: 1, idle: 0, inUse: 1, waiting: 0 }));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>idle</code> (array), <code>inUse</code> (Set), <code>waiters</code> (array of <code>{ resolve, reject, timer }</code>) and a <code>total</code> counter that you increment BEFORE awaiting <code>create()</code>." },
    { order: 2, cost: 5, text: "Waiting: return a promise, push the waiter, start a <code>setTimeout</code> that removes it from <code>waiters</code> and rejects. On <code>release</code>, <code>shift()</code> a waiter, <code>clearTimeout</code> its timer and resolve it with the resource." },
    { order: 3, cost: 15, text: "For <code>end()</code>, set a <code>closed</code> flag, reject all waiters, destroy idle ones, and if <code>total &gt; 0</code> wait on a promise that resolves when <code>total</code> reaches 0." },
  ],
  hiddenTests: [
    { name: "creates_lazily_up_to_max_and_reuses_idle", code: `let created = 0;
const p = createPool({ create: async () => ({ id: ++created }), max: 2 });
assert(p.stats().total === 0, 'nothing created yet');
const a = await p.acquire(); const b = await p.acquire();
assert(a !== b && created === 2, 'two connections created');
p.release(a);
const c = await p.acquire();
assert(c === a && created === 2, 'the idle one is reused, no third connection');` },
    { name: "idle_resources_are_reused_oldest_first", code: `let n = 0;
const p = createPool({ create: async () => ({ id: ++n }), max: 3 });
const a = await p.acquire(); const b = await p.acquire();
p.release(a); p.release(b);
assert((await p.acquire()) === a, 'oldest idle first');
assert((await p.acquire()) === b, 'then the next');` },
    { name: "never_exceeds_max_under_concurrency", code: `let created = 0;
const p = createPool({ create: async () => { created++; await new Promise((r) => setTimeout(r, 2)); return { id: created }; }, max: 3, acquireTimeoutMs: 500 });
const acquired = [];
const workers = Array.from({ length: 10 }, async () => {
  const c = await p.acquire();
  acquired.push(c);
  await new Promise((r) => setTimeout(r, 3));
  p.release(c);
});
await Promise.all(workers);
assert(created <= 3, 'at most max connections were created: ' + created);
assert(acquired.length === 10 && p.stats().total === created, 'everyone was served');` },
    { name: "waiters_are_served_fifo_when_resources_are_released", code: `const p = createPool({ create: async () => ({}), max: 1 });
const first = await p.acquire();
const order = [];
const w1 = p.acquire().then((c) => { order.push('w1'); return c; });
const w2 = p.acquire().then((c) => { order.push('w2'); return c; });
assert(p.stats().waiting === 2, 'two waiting');
p.release(first);
const c1 = await w1;
assert(order.join() === 'w1' && c1 === first, 'first waiter gets the released resource');
p.release(c1);
await w2;
assert(order.join() === 'w1,w2', 'then the second');
assert(p.stats().total === 1, 'still one connection');` },
    { name: "waiting_times_out_and_leaves_the_queue", code: `const p = createPool({ create: async () => ({}), max: 1, acquireTimeoutMs: 20 });
const held = await p.acquire();
let err = null; const t0 = Date.now();
try { await p.acquire(); } catch (e) { err = e; }
assert(err && err.message === 'Timed out waiting for a connection', 'message: ' + (err && err.message));
assert(Date.now() - t0 >= 15, 'waited about the timeout');
assert(p.stats().waiting === 0, 'removed from the queue');
p.release(held);
assert(p.stats().idle === 1 && p.stats().inUse === 0, 'released resource goes idle, not to the dead waiter');` },
    { name: "a_served_waiter_does_not_time_out_later", code: `const p = createPool({ create: async () => ({}), max: 1, acquireTimeoutMs: 30 });
const held = await p.acquire();
const waiting = p.acquire();
p.release(held);
const got = await waiting;
await new Promise((r) => setTimeout(r, 50));
assert(got === held && p.stats().inUse === 1, 'timer was cleared, nothing rejected');` },
    { name: "stats_track_every_state", code: `const p = createPool({ create: async () => ({}), max: 2, acquireTimeoutMs: 100 });
const a = await p.acquire(); const b = await p.acquire();
const waiting = p.acquire();
assert(JSON.stringify(p.stats()) === '{"total":2,"idle":0,"inUse":2,"waiting":1}', 'busy: ' + JSON.stringify(p.stats()));
p.release(a);
await waiting;
p.release(b);
assert(JSON.stringify(p.stats()) === '{"total":2,"idle":1,"inUse":1,"waiting":0}', 'after: ' + JSON.stringify(p.stats()));` },
    { name: "release_validation", code: `const p = createPool({ create: async () => ({}) });
const a = await p.acquire();
p.release(a);
let e1 = null; let e2 = null;
try { p.release(a); } catch (e) { e1 = e; }
try { p.release({}); } catch (e) { e2 = e; }
assert(e1 && e1.message === 'Resource not in use' && e2 && e2.message === 'Resource not in use', 'double release and foreign object');` },
    { name: "failed_create_rejects_and_frees_the_slot", code: `let fail = true; let n = 0;
const p = createPool({ create: async () => { if (fail) throw new Error('db down'); return { id: ++n }; }, max: 1 });
let err = null;
try { await p.acquire(); } catch (e) { err = e; }
assert(err && err.message === 'db down', 'rejects with the create error');
assert(p.stats().total === 0, 'slot freed');
fail = false;
assert((await p.acquire()).id === 1, 'can create afterwards');` },
    { name: "discard_destroys_and_allows_replacement", code: `const destroyed = []; let n = 0;
const p = createPool({ create: async () => ({ id: ++n }), destroy: async (r) => { destroyed.push(r.id); }, max: 1 });
const bad = await p.acquire();
await p.discard(bad);
assert(destroyed.join() === '1' && p.stats().total === 0, 'destroyed and gone');
const fresh = await p.acquire();
assert(fresh.id === 2, 'a new connection is created');` },
    { name: "discard_serves_a_waiter_with_a_new_connection", code: `let n = 0;
const p = createPool({ create: async () => ({ id: ++n }), max: 1, acquireTimeoutMs: 200 });
const bad = await p.acquire();
const waiting = p.acquire();
await p.discard(bad);
const replacement = await waiting;
assert(replacement.id === 2 && p.stats().total === 1 && p.stats().inUse === 1, 'waiter got a fresh one: ' + JSON.stringify(p.stats()));` },
    { name: "end_rejects_waiters_destroys_idle_and_waits_for_in_use", code: `const destroyed = []; let n = 0;
const p = createPool({ create: async () => ({ id: ++n }), destroy: async (r) => { destroyed.push(r.id); }, max: 2, acquireTimeoutMs: 500 });
const a = await p.acquire(); const b = await p.acquire();
p.release(b);
const c = await p.acquire();
const d = p.acquire();
void c;
let waiterErr = null;
d.catch((e) => { waiterErr = e; });
let ended = false;
const endPromise = p.end().then(() => { ended = true; });
await new Promise((r) => setTimeout(r, 10));
assert(waiterErr && waiterErr.message === 'Pool is closed', 'waiter rejected');
assert(ended === false, 'still waiting for in-use connections');
p.release(a); p.release(c);
await endPromise;
assert(ended === true && destroyed.length === 2, 'all destroyed: ' + destroyed);
assert(p.stats().total === 0, 'empty');` },
    { name: "acquire_after_end_rejects", code: `const p = createPool({ create: async () => ({}) });
await p.end();
let err = null;
try { await p.acquire(); } catch (e) { err = e; }
assert(err && err.message === 'Pool is closed', 'message: ' + (err && err.message));` },
  ],
  solution: {
    code: `function createPool({ create, destroy = async () => {}, max = 3, acquireTimeoutMs = 1000 }) {
  const idle = [];
  const inUse = new Set();
  const waiters = [];
  let total = 0;
  let closed = false;
  let closeWaiters = [];

  function maybeFinish() {
    if (closed && total === 0) {
      closeWaiters.forEach((resolve) => resolve());
      closeWaiters = [];
    }
  }

  async function spawn() {
    total++;
    try {
      return await create();
    } catch (err) {
      total--;
      throw err;
    }
  }

  return {
    async acquire() {
      if (closed) throw new Error('Pool is closed');
      if (idle.length > 0) {
        const resource = idle.shift();
        inUse.add(resource);
        return resource;
      }
      if (total < max) {
        const resource = await spawn();
        inUse.add(resource);
        return resource;
      }
      return new Promise((resolve, reject) => {
        const waiter = { resolve, reject, timer: null };
        waiter.timer = setTimeout(() => {
          const index = waiters.indexOf(waiter);
          if (index !== -1) waiters.splice(index, 1);
          reject(new Error('Timed out waiting for a connection'));
        }, acquireTimeoutMs);
        waiters.push(waiter);
      });
    },
    release(resource) {
      if (!inUse.has(resource)) throw new Error('Resource not in use');
      inUse.delete(resource);
      if (closed) {
        total--;
        Promise.resolve(destroy(resource)).then(maybeFinish, maybeFinish);
        return;
      }
      const waiter = waiters.shift();
      if (waiter) {
        clearTimeout(waiter.timer);
        inUse.add(resource);
        waiter.resolve(resource);
        return;
      }
      idle.push(resource);
    },
    async discard(resource) {
      if (!inUse.has(resource)) throw new Error('Resource not in use');
      inUse.delete(resource);
      total--;
      await destroy(resource);
      const waiter = closed ? undefined : waiters.shift();
      if (waiter) {
        clearTimeout(waiter.timer);
        try {
          const replacement = await spawn();
          inUse.add(replacement);
          waiter.resolve(replacement);
        } catch (err) {
          waiter.reject(err);
        }
      }
      maybeFinish();
    },
    stats() {
      return { total, idle: idle.length, inUse: inUse.size, waiting: waiters.length };
    },
    async end() {
      closed = true;
      for (const waiter of waiters.splice(0)) {
        clearTimeout(waiter.timer);
        waiter.reject(new Error('Pool is closed'));
      }
      for (const resource of idle.splice(0)) {
        total--;
        await destroy(resource);
      }
      if (total > 0) await new Promise((resolve) => closeWaiters.push(resolve));
    },
  };
}

module.exports = createPool;`,
    explanation:
      "A pool is three collections (idle, in use, waiting) plus a count. Counting a connection before awaiting its creation is what stops a burst of acquires from overshooting max, and handing a released resource directly to the next waiter keeps the queue fair without ever going through the idle list.",
  },
};
