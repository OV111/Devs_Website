export default {
  slug: "token-bucket-limiter",
  trackId: "api-dev",
  layerId: "api-dev-7",
  type: "CODE",
  difficulty: "med",
  title: "Token bucket rate limiter",
  summary: "Allow bursts up to a capacity while refilling at a steady rate, and tell the client when to retry.",
  description:
    "Rate limiting protects your API from abuse and accidents. The token bucket is the algorithm behind most real limiters: it allows short bursts but caps the long-run rate.",
  task:
    "Write <code>createTokenBucket({ capacity, refillPerSec, now })</code> returning <code>{ take(n = 1) }</code>. <code>take</code> returns <code>{ allowed, remaining, retryAfterMs }</code>.",
  constraints: [
    "The bucket starts full.",
    "Tokens refill continuously: <code>elapsedSeconds * refillPerSec</code>, never above <code>capacity</code>.",
    "If at least <code>n</code> tokens are available, subtract them: <code>allowed: true</code>, <code>retryAfterMs: 0</code>.",
    "Otherwise nothing is consumed: <code>allowed: false</code> and <code>retryAfterMs</code> is the time until <code>n</code> tokens exist, rounded up.",
    "<code>remaining</code> is the whole number of tokens left (rounded down). <code>now</code> defaults to <code>Date.now</code> and returns milliseconds.",
  ],
  example: `const b = createTokenBucket({ capacity: 2, refillPerSec: 1 }); b.take(); b.take(); b.take(); // third: { allowed: false, remaining: 0, retryAfterMs: 1000 }`,
  tags: ["rate-limiting","algorithms","redis"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createTokenBucket.js",
      lang: "js",
      code: `// createTokenBucket.js
function createTokenBucket(options) {
  // your code here
}

module.exports = createTokenBucket;`,
    },
  ],
  testFile: {
    name: "createTokenBucket_test.js",
    lang: "test",
    code: `const createTokenBucket = require('./createTokenBucket');

test('burst', () => {
  const b = createTokenBucket({ capacity: 2, refillPerSec: 1, now: () => 0 }); expect(b.take().allowed).toBe(true); expect(b.take().allowed).toBe(true); expect(b.take().allowed).toBe(false);
});

test('remaining', () => {
  const b = createTokenBucket({ capacity: 3, refillPerSec: 1, now: () => 0 }); expect(b.take().remaining).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Store <code>tokens</code> and the <code>last</code> timestamp; on every call add the elapsed refill first, then cap at capacity." },
    { order: 2, cost: 5, text: "Don't use timers: compute the refill lazily from the clock on each <code>take</code>." },
    { order: 3, cost: 15, text: "<code>retryAfterMs = Math.ceil((n - tokens) / refillPerSec * 1000)</code>." },
  ],
  hiddenTests: [
    { name: "starts_full_and_drains", code: `let t = 0; const b = createTokenBucket({ capacity: 3, refillPerSec: 1, now: () => t });
const r1 = b.take(); const r2 = b.take(); const r3 = b.take();
assert(r1.allowed && r2.allowed && r3.allowed, 'three allowed');
assert(r3.remaining === 0, 'empty after three');
assert(b.take().allowed === false, 'fourth denied');` },
    { name: "remaining_counts_down", code: `const b = createTokenBucket({ capacity: 5, refillPerSec: 1, now: () => 0 });
assert(b.take().remaining === 4 && b.take().remaining === 3, 'remaining');` },
    { name: "denied_reports_retry_after", code: `let t = 0; const b = createTokenBucket({ capacity: 2, refillPerSec: 1, now: () => t });
b.take(); b.take();
const r = b.take();
assert(r.allowed === false && r.retryAfterMs === 1000, 'retry in 1000ms, got ' + r.retryAfterMs);` },
    { name: "refills_over_time", code: `let t = 0; const b = createTokenBucket({ capacity: 2, refillPerSec: 1, now: () => t });
b.take(); b.take();
t = 1000;
assert(b.take().allowed === true, 'one token refilled after 1s');
assert(b.take().allowed === false, 'but only one');` },
    { name: "partial_refill", code: `let t = 0; const b = createTokenBucket({ capacity: 1, refillPerSec: 2, now: () => t });
b.take();
t = 250;
const r = b.take();
assert(r.allowed === false && r.retryAfterMs === 250, 'half a token so far; retry in 250ms, got ' + r.retryAfterMs);` },
    { name: "never_exceeds_capacity", code: `let t = 0; const b = createTokenBucket({ capacity: 2, refillPerSec: 10, now: () => t });
t = 60000;
assert(b.take().remaining === 1, 'capped at capacity');
b.take();
assert(b.take().allowed === false, 'no stockpiling beyond capacity');` },
    { name: "denied_does_not_consume", code: `let t = 0; const b = createTokenBucket({ capacity: 2, refillPerSec: 1, now: () => t });
b.take(2);
b.take(); b.take();
t = 1000;
assert(b.take().allowed === true, 'denials must not drain tokens');` },
    { name: "take_many", code: `const b = createTokenBucket({ capacity: 5, refillPerSec: 1, now: () => 0 });
assert(b.take(5).allowed === true, 'take all five');
assert(b.take(3).retryAfterMs === 3000, 'need three more tokens');` },
  ],
  solution: {
    code: `function createTokenBucket({ capacity, refillPerSec, now = () => Date.now() }) {
  let tokens = capacity;
  let last = now();
  return {
    take(n = 1) {
      const t = now();
      tokens = Math.min(capacity, tokens + ((t - last) / 1000) * refillPerSec);
      last = t;
      if (tokens >= n) {
        tokens -= n;
        return { allowed: true, remaining: Math.floor(tokens), retryAfterMs: 0 };
      }
      return {
        allowed: false,
        remaining: Math.floor(tokens),
        retryAfterMs: Math.ceil(((n - tokens) / refillPerSec) * 1000),
      };
    },
  };
}

module.exports = createTokenBucket;`,
    explanation:
      "No timers are needed: each take() adds the tokens earned since the last call (capped at capacity) and then spends them. Computing retryAfter from the missing tokens gives clients an honest Retry-After header.",
  },
};
