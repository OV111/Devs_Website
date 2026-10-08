export default {
  slug: "session-store",
  trackId: "node-dev",
  layerId: "node-dev-6",
  type: "CODE",
  difficulty: "med",
  title: "Server-side session store",
  summary: "Sessions with idle and absolute timeouts, ID regeneration against fixation, per-user limits and logout everywhere.",
  description:
    "Cookie sessions are simple and revocable, but only if done carefully: sessions must expire when idle, have a hard lifetime, get a fresh ID on login (session fixation), and be killable per user (password change, 'log out all devices').",
  task:
    "Write <code>createSessionStore({ idleTtlMs, absoluteTtlMs, maxPerUser = Infinity, now, generateId })</code> returning <code>{ create, get, regenerate, destroy, destroyAllForUser, countForUser }</code>.",
  constraints: [
    "Defaults: <code>idleTtlMs = 30 minutes</code>, <code>absoluteTtlMs = 12 hours</code>, <code>now = Date.now</code>, <code>generateId</code> returns <code>'sess_1'</code>, <code>'sess_2'</code>... (a counter).",
    "<code>create(userId, data = {})</code> stores a session <code>{ id, userId, data, createdAt, lastSeenAt }</code> (<code>data</code> copied) and returns the id. If the user already has <code>maxPerUser</code> live sessions, the one with the oldest <code>lastSeenAt</code> is removed first.",
    "<code>get(id, { touch = true })</code> returns a copy of the session, or <code>null</code> if unknown or expired. A session is expired when <code>now - lastSeenAt &gt;= idleTtlMs</code> OR <code>now - createdAt &gt;= absoluteTtlMs</code>; expired sessions are deleted when seen. With <code>touch</code>, <code>lastSeenAt</code> is set to now (sliding expiration); the absolute limit never slides.",
    "<code>regenerate(id)</code> gives a live session a new id (same data, user and <code>createdAt</code>, refreshed <code>lastSeenAt</code>), invalidates the old id and returns the new one, or <code>null</code> if the session is unknown/expired.",
    "<code>destroy(id)</code> returns whether a session was removed. <code>destroyAllForUser(userId)</code> returns how many were removed. <code>countForUser(userId)</code> counts LIVE sessions (expired ones don't count and are cleaned up).",
  ],
  example: `const id = store.create('u1', { cart: [] }); store.get(id).userId; // 'u1'`,
  tags: ["sessions","auth","security","cookies"],
  estimatedMins: 40,
  xp: 45,
  starterFiles: [
    {
      name: "createSessionStore.js",
      lang: "js",
      code: `// createSessionStore.js
function createSessionStore(options) {
  // your code here
}

module.exports = createSessionStore;`,
    },
  ],
  testFile: {
    name: "createSessionStore_test.js",
    lang: "test",
    code: `const createSessionStore = require('./createSessionStore');

test('create_get', () => {
  const s = createSessionStore({ now: () => 0 }); const id = s.create('u1', { a: 1 }); expect(s.get(id).userId).toBe('u1'); expect(s.get(id).data.a).toBe(1);
});

test('unknown', () => {
  expect(createSessionStore().get('nope')).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep sessions in a <code>Map</code> by id and write one <code>isExpired(session)</code> helper used everywhere." },
    { order: 2, cost: 5, text: "<code>get</code> returns <code>{ ...session, data: { ...session.data } }</code> so callers can't mutate stored state." },
    { order: 3, cost: 15, text: "For <code>maxPerUser</code>, find the user's live sessions, sort by <code>lastSeenAt</code>, and delete the oldest before inserting when the count is at the limit." },
  ],
  hiddenTests: [
    { name: "create_returns_sequential_ids_and_stores_fields", code: `let t = 1000; const s = createSessionStore({ now: () => t });
const a = s.create('u1', { cart: [1] }); const b = s.create('u2');
assert(a === 'sess_1' && b === 'sess_2', 'ids: ' + a + ',' + b);
const got = s.get(a);
assert(got.id === a && got.userId === 'u1' && got.data.cart[0] === 1 && got.createdAt === 1000 && got.lastSeenAt === 1000, JSON.stringify(got));
assert(JSON.stringify(s.get(b).data) === '{}', 'data defaults to an empty object');` },
    { name: "custom_id_generator", code: `let n = 0; const s = createSessionStore({ generateId: () => 'id-' + (++n), now: () => 0 });
assert(s.create('u') === 'id-1', 'uses the injected generator');` },
    { name: "copies_protect_the_store", code: `const s = createSessionStore({ now: () => 0 }); const input = { x: 1 };
const id = s.create('u', input);
input.x = 99;
const got = s.get(id);
assert(got.data.x === 1, 'later changes to the input do not leak in');
got.data.x = 5; got.userId = 'hacker';
assert(s.get(id).data.x === 1 && s.get(id).userId === 'u', 'changes to a returned copy do not leak in');` },
    { name: "idle_timeout_slides_with_activity", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 1000, absoluteTtlMs: 1e9, now: () => t });
const id = s.create('u');
t = 900; assert(s.get(id) !== null, 'alive at 900');
t = 1800; assert(s.get(id) !== null, 'the get at 900 reset the idle timer');
t = 2800; assert(s.get(id) === null, 'idle for exactly 1000 ms is expired');` },
    { name: "peek_without_touch_does_not_extend", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 1000, absoluteTtlMs: 1e9, now: () => t });
const id = s.create('u');
t = 600; assert(s.get(id, { touch: false }) !== null, 'peek');
t = 1000; assert(s.get(id) === null, 'the peek did not slide the window');` },
    { name: "absolute_timeout_never_slides", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 1000, absoluteTtlMs: 5000, now: () => t });
const id = s.create('u');
for (t = 500; t < 5000; t += 500) assert(s.get(id) !== null, 'active at ' + t);
t = 5000;
assert(s.get(id) === null, 'hard limit reached despite constant activity');` },
    { name: "expired_sessions_are_removed", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 100, now: () => t });
const id = s.create('u');
t = 200;
assert(s.get(id) === null && s.countForUser('u') === 0, 'gone and not counted');
t = 0;
assert(s.get(id) === null, 'once expired, always gone (even if the clock goes back)');` },
    { name: "regenerate_prevents_fixation", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 1000, absoluteTtlMs: 5000, now: () => t });
const old = s.create('u1', { role: 'user' });
t = 400;
const fresh = s.regenerate(old);
assert(typeof fresh === 'string' && fresh !== old, 'new id');
assert(s.get(old) === null, 'old id is dead');
const got = s.get(fresh, { touch: false });
assert(got.userId === 'u1' && got.data.role === 'user', 'data and user carried over');
assert(got.createdAt === 0 && got.lastSeenAt === 400, 'createdAt kept, lastSeenAt refreshed: ' + JSON.stringify(got));
assert(s.countForUser('u1') === 1, 'still one session');` },
    { name: "regenerate_unknown_or_expired_returns_null", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 100, now: () => t });
assert(s.regenerate('nope') === null, 'unknown');
const id = s.create('u');
t = 500;
assert(s.regenerate(id) === null, 'expired');` },
    { name: "destroy", code: `const s = createSessionStore({ now: () => 0 });
const id = s.create('u');
assert(s.destroy(id) === true, 'removed');
assert(s.get(id) === null && s.destroy(id) === false && s.destroy('nope') === false, 'gone, and repeats are false');` },
    { name: "destroy_all_for_user_and_count", code: `const s = createSessionStore({ now: () => 0 });
s.create('u1'); s.create('u1'); const other = s.create('u2');
assert(s.countForUser('u1') === 2 && s.countForUser('u2') === 1 && s.countForUser('nobody') === 0, 'counts');
assert(s.destroyAllForUser('u1') === 2, 'two removed');
assert(s.countForUser('u1') === 0 && s.get(other) !== null, 'other users untouched');
assert(s.destroyAllForUser('u1') === 0, 'nothing left');` },
    { name: "count_ignores_expired_sessions", code: `let t = 0; const s = createSessionStore({ idleTtlMs: 100, now: () => t });
s.create('u'); t = 50; s.create('u');
t = 120;
assert(s.countForUser('u') === 1, 'only the newer one is live');` },
    { name: "max_per_user_evicts_the_least_recently_used", code: `let t = 0; const s = createSessionStore({ maxPerUser: 2, idleTtlMs: 1e9, absoluteTtlMs: 1e9, now: () => t });
const a = s.create('u'); t = 10; const b = s.create('u');
t = 20; s.get(a);
t = 30; const c = s.create('u');
assert(s.get(b) === null, 'b was least recently used, so it was evicted');
assert(s.get(a) !== null && s.get(c) !== null, 'a and c remain');
assert(s.countForUser('u') === 2, 'limit holds');
const x = s.create('other'); const y = s.create('other');
assert(s.get(x) !== null && s.get(y) !== null, 'limits are per user');` },
    { name: "max_per_user_does_not_evict_for_expired", code: `let t = 0; const s = createSessionStore({ maxPerUser: 1, idleTtlMs: 100, now: () => t });
const a = s.create('u');
t = 500;
const b = s.create('u');
assert(s.get(b) !== null && s.countForUser('u') === 1, 'the expired one simply disappears');
void a;` },
  ],
  solution: {
    code: `function createSessionStore({
  idleTtlMs = 30 * 60 * 1000,
  absoluteTtlMs = 12 * 60 * 60 * 1000,
  maxPerUser = Infinity,
  now = () => Date.now(),
  generateId,
} = {}) {
  const sessions = new Map();
  let counter = 0;
  const nextId = generateId || (() => 'sess_' + ++counter);

  const isExpired = (s) => now() - s.lastSeenAt >= idleTtlMs || now() - s.createdAt >= absoluteTtlMs;
  const copy = (s) => ({ ...s, data: { ...s.data } });

  function liveSessionsFor(userId) {
    const live = [];
    for (const [id, s] of [...sessions]) {
      if (isExpired(s)) sessions.delete(id);
      else if (s.userId === userId) live.push(s);
    }
    return live;
  }

  return {
    create(userId, data = {}) {
      const live = liveSessionsFor(userId);
      if (live.length >= maxPerUser) {
        live.sort((a, b) => a.lastSeenAt - b.lastSeenAt);
        sessions.delete(live[0].id);
      }
      const id = nextId();
      sessions.set(id, { id, userId, data: { ...data }, createdAt: now(), lastSeenAt: now() });
      return id;
    },
    get(id, { touch = true } = {}) {
      const s = sessions.get(id);
      if (!s) return null;
      if (isExpired(s)) {
        sessions.delete(id);
        return null;
      }
      if (touch) s.lastSeenAt = now();
      return copy(s);
    },
    regenerate(id) {
      const s = sessions.get(id);
      if (!s) return null;
      if (isExpired(s)) {
        sessions.delete(id);
        return null;
      }
      sessions.delete(id);
      const newId = nextId();
      sessions.set(newId, { ...s, id: newId, lastSeenAt: now() });
      return newId;
    },
    destroy(id) {
      return sessions.delete(id);
    },
    destroyAllForUser(userId) {
      let removed = 0;
      for (const [id, s] of [...sessions]) {
        if (s.userId === userId) {
          sessions.delete(id);
          removed++;
        }
      }
      return removed;
    },
    countForUser(userId) {
      return liveSessionsFor(userId).length;
    },
  };
}

module.exports = createSessionStore;`,
    explanation:
      "Two clocks protect a session: the idle timer slides with activity, the absolute timer never does. Regenerating the id on login means an attacker who planted a known session id before login holds a dead id afterwards, which is what defeats session fixation.",
  },
};
