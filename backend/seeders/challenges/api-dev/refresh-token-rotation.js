export default {
  slug: "refresh-token-rotation",
  trackId: "api-dev",
  layerId: "api-dev-6",
  type: "CODE",
  difficulty: "hard",
  title: "Refresh token rotation with reuse detection",
  summary: "Issue refresh tokens, rotate them on use, and revoke the whole family if an old one is replayed.",
  description:
    "Refresh tokens are long-lived, so a stolen one is dangerous. Rotation gives each use a new token; if an already-used token shows up again, someone copied it, so every token from that login is revoked.",
  task:
    "Write <code>createTokenStore({ now, ttlMs })</code> returning <code>{ issue(userId), rotate(token) }</code>. <code>now</code> defaults to <code>() =&gt; Date.now()</code>, <code>ttlMs</code> to one hour.",
  constraints: [
    "<code>issue</code> starts a new family and returns a token string.",
    "<code>rotate(token)</code> returns <code>{ ok: true, token, userId }</code> with a fresh token in the same family; the old one is now used.",
    "Unknown token: <code>{ ok: false, reason: 'invalid' }</code>. Past its expiry: <code>'expired'</code>.",
    "Rotating an already-used token returns <code>'reuse_detected'</code> and revokes the whole family: every other token in it then returns <code>'invalid'</code>.",
    "Each token expires <code>ttlMs</code> after it was minted; tokens must be unique.",
  ],
  example: `const s = createTokenStore(); const t1 = s.issue('u1'); const r = s.rotate(t1); // r.ok === true; s.rotate(t1).reason === 'reuse_detected'`,
  tags: ["auth","jwt","security"],
  estimatedMins: 40,
  xp: 70,
  starterFiles: [
    {
      name: "createTokenStore.js",
      lang: "js",
      code: `// createTokenStore.js
function createTokenStore(options = {}) {
  // your code here
}

module.exports = createTokenStore;`,
    },
  ],
  testFile: {
    name: "createTokenStore_test.js",
    lang: "test",
    code: `const createTokenStore = require('./createTokenStore');

test('rotate_ok', () => {
  const s = createTokenStore(); const t = s.issue('u1'); const r = s.rotate(t); expect(r.ok).toBe(true); expect(r.userId).toBe('u1');
});

test('unknown', () => {
  expect(createTokenStore().rotate('nope').reason).toBe('invalid');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Store each token's record in a Map: its user, family id, expiry and a <code>used</code> flag. Keep a Set of revoked family ids." },
    { order: 2, cost: 5, text: "Check order in <code>rotate</code>: unknown, then already used (revoke family), then family revoked, then expired." },
    { order: 3, cost: 15, text: "A new token inherits the family of the one it replaces." },
  ],
  hiddenTests: [
    { name: "issue_and_rotate", code: `const s = createTokenStore(); const t1 = s.issue('u1'); const r = s.rotate(t1);
assert(r.ok === true && r.userId === 'u1' && typeof r.token === 'string' && r.token !== t1, 'new token');` },
    { name: "tokens_are_unique", code: `const s = createTokenStore(); const a = s.issue('u1'); const b = s.issue('u1');
assert(a !== b, 'unique');` },
    { name: "unknown_is_invalid", code: `const r = createTokenStore().rotate('nope');
assert(r.ok === false && r.reason === 'invalid', 'invalid');` },
    { name: "chain_of_rotations_works", code: `const s = createTokenStore(); let t = s.issue('u1');
for (let i = 0; i < 3; i++) { const r = s.rotate(t); assert(r.ok, 'rotation ' + i); t = r.token; }` },
    { name: "reuse_is_detected", code: `const s = createTokenStore(); const t1 = s.issue('u1'); s.rotate(t1);
const again = s.rotate(t1);
assert(again.ok === false && again.reason === 'reuse_detected', 'replay: ' + again.reason);` },
    { name: "reuse_revokes_the_family", code: `const s = createTokenStore(); const t1 = s.issue('u1');
const t2 = s.rotate(t1).token;
s.rotate(t1);
const r = s.rotate(t2);
assert(r.ok === false && r.reason === 'invalid', 'the newest token in the family is revoked too');` },
    { name: "other_families_unaffected", code: `const s = createTokenStore(); const a = s.issue('u1'); const b = s.issue('u2');
s.rotate(a); s.rotate(a);
assert(s.rotate(b).ok === true, 'a different login keeps working');` },
    { name: "expiry", code: `let t = 0; const s = createTokenStore({ now: () => t, ttlMs: 1000 });
const tok = s.issue('u1'); t = 1001;
const r = s.rotate(tok);
assert(r.ok === false && r.reason === 'expired', 'expired: ' + r.reason);` },
    { name: "new_token_gets_fresh_ttl", code: `let t = 0; const s = createTokenStore({ now: () => t, ttlMs: 1000 });
const t1 = s.issue('u1'); t = 900; const t2 = s.rotate(t1).token; t = 1800;
assert(s.rotate(t2).ok === true, 'new token expires 1000ms after it was minted');` },
  ],
  solution: {
    code: `function createTokenStore({ now = () => Date.now(), ttlMs = 60 * 60 * 1000 } = {}) {
  let counter = 0;
  const tokens = new Map();
  const revoked = new Set();
  function mint(userId, family) {
    const token = 'rt_' + (++counter);
    tokens.set(token, { userId, family, expiresAt: now() + ttlMs, used: false });
    return token;
  }
  return {
    issue(userId) {
      return mint(userId, 'fam_' + (counter + 1));
    },
    rotate(token) {
      const rec = tokens.get(token);
      if (!rec) return { ok: false, reason: 'invalid' };
      if (rec.used) {
        revoked.add(rec.family);
        return { ok: false, reason: 'reuse_detected' };
      }
      if (revoked.has(rec.family)) return { ok: false, reason: 'invalid' };
      if (now() > rec.expiresAt) return { ok: false, reason: 'expired' };
      rec.used = true;
      return { ok: true, token: mint(rec.userId, rec.family), userId: rec.userId };
    },
  };
}

module.exports = createTokenStore;`,
    explanation:
      "Each token is single-use. Seeing a used token again means two parties hold it, so the entire family is revoked and the real user has to log in again.",
  },
};
