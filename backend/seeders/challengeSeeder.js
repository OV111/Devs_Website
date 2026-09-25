/**
 * Challenge Seeder — seeds the coding-challenges problem bank.
 *
 * Usage:
 *   MONGO_URI=... node backend/seeders/challengeSeeder.js
 *
 * Content is promoted from the frontend mocks (`constants/CodingChallenges.js`
 * and the MOCK_CHALLENGE in ChallengeArena.jsx) so the Arena can drop its mock
 * imports and read real data instead.
 *
 * Idempotent: upserts keyed on `slug`, so re-running never duplicates and never
 * wipes solve stats.
 *
 * Note on `layerId`: challenges point at a roadmap layer seeded by
 * roadmapSeeder.js. Run that first — this seeder verifies every referenced
 * layer exists and refuses to write orphans.
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import connectDB from "../config/db.js";

// ── Content ───────────────────────────────────────────────────

const challenges = [
  {
    slug: "async-error-wrapper",
    trackId: "api-dev",
    layerId: "api-dev-3",
    type: "CODE",
    difficulty: "med",
    title: "Async error wrapper for Express",
    summary:
      "Wrap async route handlers so rejected promises reach Express's error pipeline instead of crashing silently.",
    description:
      "You're building an Express API where every route handler is <code>async</code>. Right now, any error thrown inside an async handler escapes the framework's error pipeline and crashes silently.",
    task:
      "Write a function <code>asyncHandler(fn)</code> that takes an async route handler and returns a wrapped handler that catches any rejection and forwards it to Express's <code>next()</code>.",
    constraints: [
      "Must work with both async functions and functions returning Promises.",
      "Must not change the original function's signature.",
      "Synchronous handlers should still work if accidentally wrapped.",
      "No external libraries (the standard library is fine).",
    ],
    example: `const safeGet = asyncHandler(async (req, res) => {
  const data = await fetchData(req.params.id);
  res.json(data);
});
app.get('/data/:id', safeGet);`,
    tags: ["async", "errors", "middleware"],
    estimatedMins: 25,
    xp: 45,
    starterFiles: [
      {
        name: "asyncHandler.js",
        lang: "js",
        code: `// asyncHandler.js
// Wrap an async express handler so rejections reach next()

function asyncHandler(fn) {
  // your code here
}

module.exports = asyncHandler;`,
      },
    ],
    testFile: {
      name: "asyncHandler_test.js",
      lang: "test",
      code: `// asyncHandler_test.js
const asyncHandler = require('./asyncHandler');

test('resolved_promise_passes', async () => {
  const fn = jest.fn().mockResolvedValue(undefined);
  const handler = asyncHandler(fn);
  const req = {}, res = {}, next = jest.fn();
  await handler(req, res, next);
  expect(next).not.toHaveBeenCalled();
});

test('rejection_calls_next', async () => {
  const err = new Error('boom');
  const fn = jest.fn().mockRejectedValue(err);
  const handler = asyncHandler(fn);
  const next = jest.fn();
  await handler({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});

test('sync_throw_calls_next', () => {
  const err = new Error('sync');
  const fn = () => { throw err; };
  const handler = asyncHandler(fn);
  const next = jest.fn();
  handler({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});

test('does_not_mutate_fn', () => {
  const fn = async () => {};
  asyncHandler(fn);
  expect(fn.length).toBe(0);
});

test('preserves_arity', () => {
  const errorHandler = async (err, req, res, next) => {};
  const wrapped = asyncHandler(errorHandler);
  expect(wrapped.length).toBe(4);
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "Express decides whether a function is an error handler by reading <code>fn.length</code>. A plain wrapper always reports its own arity, not the wrapped function's.",
      },
      {
        order: 2,
        cost: 5,
        text: "Use <code>Object.defineProperty</code> on the wrapper to set its <code>length</code> to match <code>fn.length</code> before returning it.",
      },
      {
        order: 3,
        cost: 15,
        text: "Here's the key line: <code>Object.defineProperty(wrapper, 'length', { value: fn.length });</code>",
      },
    ],
    // Hidden tests decide a pass. They are never sent to the client, so a
    // student editing the visible test file cannot fake a green run. These
    // cover the same contract plus the edge cases the visible set leaves open.
    hiddenTests: [
      {
        name: "forwards_rejection_to_next",
        code: `const err = new Error('x');
const handler = asyncHandler(async () => { throw err; });
let got = null;
await handler({}, {}, (e) => { got = e; });
assert(got === err, 'next() should receive the thrown error');`,
      },
      {
        name: "sync_throw_forwarded",
        code: `const err = new Error('sync');
const handler = asyncHandler(() => { throw err; });
let got = null;
handler({}, {}, (e) => { got = e; });
assert(got === err, 'a synchronous throw must also reach next()');`,
      },
      {
        name: "success_path_does_not_call_next",
        code: `let called = false;
const handler = asyncHandler(async (req, res) => { res.ok = true; });
const res = {};
await handler({}, res, () => { called = true; });
assert(res.ok === true, 'the handler should still run');
assert(called === false, 'next() must not be called on success');`,
      },
      {
        name: "preserves_arity_for_error_handlers",
        code: `const wrapped = asyncHandler(async (err, req, res, next) => {});
assert(wrapped.length === 4, 'Express reads fn.length — a 4-arg handler must stay 4-arg');`,
      },
      {
        name: "preserves_arity_for_normal_handlers",
        code: `const wrapped = asyncHandler(async (req, res, next) => {});
assert(wrapped.length === 3, 'a 3-arg handler must stay 3-arg');`,
      },
      {
        name: "does_not_mutate_the_original",
        code: `const fn = async (req, res) => {};
const before = fn.length;
asyncHandler(fn);
assert(fn.length === before, 'the original function must not be modified');`,
      },
      {
        name: "works_with_plain_promise_returning_fn",
        code: `const err = new Error('p');
const handler = asyncHandler(() => Promise.reject(err));
let got = null;
await handler({}, {}, (e) => { got = e; });
assert(got === err, 'a non-async function returning a Promise must work too');`,
      },
    ],
    solution: {
      code: `function asyncHandler(fn) {
  const wrapper = function (req, res, next) {
    try {
      const result = fn.apply(this, arguments);
      if (result && typeof result.catch === 'function') result.catch(next);
    } catch (err) {
      next(err);
    }
  };
  Object.defineProperty(wrapper, 'length', { value: fn.length });
  return wrapper;
}

module.exports = asyncHandler;`,
      explanation:
        "The wrapper calls the handler, and if the return value is thenable it attaches next as the rejection handler. Synchronous throws are caught by the try/catch. The arity is copied onto the wrapper because Express inspects fn.length to distinguish a four-argument error handler from a normal three-argument one — without it, wrapped error handlers are silently treated as regular middleware.",
    },
  },
  {
    slug: "streaming-file-upload",
    trackId: "api-dev",
    layerId: "api-dev-3",
    type: "BUILD",
    difficulty: "med",
    title: "Streaming file-upload endpoint",
    summary:
      "Stream large uploads straight to disk without buffering them in memory.",
    description:
      "Buffering an upload into memory works fine on a 2MB test file and falls over on a 2GB one. Build the endpoint the way production does it.",
    task:
      "Build an upload endpoint that streams the request body to disk, handling client disconnects and partial writes without leaving corrupt files behind.",
    constraints: [
      "Memory use must stay flat regardless of file size.",
      "A disconnect mid-upload must not leave a partial file in place.",
      "Backpressure must be respected — do not ignore the write stream's drain signal.",
    ],
    example: `curl -X POST --data-binary @large.zip http://localhost:3000/upload`,
    tags: ["streams", "upload"],
    estimatedMins: 30,
    xp: 55,
    starterFiles: [
      {
        name: "upload.js",
        lang: "js",
        code: `// upload.js
const fs = require('fs');

function uploadHandler(req, res, next) {
  // your code here
}

module.exports = uploadHandler;`,
      },
    ],
    testFile: { name: "upload_test.js", lang: "test", code: "// tests are added when this challenge is authored in full" },
    hints: [],
    solution: null,
    status: "draft",
  },
  {
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
    ],
    example: `app.use(lruCache({ capacity: 100, ttlMs: 60_000 }));`,
    tags: ["caching", "perf", "data-structures"],
    estimatedMins: 29,
    xp: 45,
    starterFiles: [
      {
        name: "lruCache.js",
        lang: "js",
        code: `// lruCache.js
function lruCache({ capacity, ttlMs }) {
  // your code here
}

module.exports = lruCache;`,
      },
    ],
    testFile: { name: "lruCache_test.js", lang: "test", code: "// tests are added when this challenge is authored in full" },
    hints: [],
    solution: null,
    status: "draft",
  },
  {
    slug: "fix-long-running-memory-leak",
    trackId: "api-dev",
    layerId: "api-dev-3",
    type: "DEBUG",
    difficulty: "hard",
    title: "Fix a memory leak in a long-running service",
    summary:
      "A service bloats from 80MB to 2GB over six hours. Find the closure trap.",
    description:
      "You're handed heap snapshots from a Node service that grows steadily under normal load. Nothing looks wrong in the request path.",
    task: "Find and fix the closure-trap leak that keeps request-scoped objects alive.",
    constraints: [
      "The fix must not change the public behaviour of the module.",
      "Memory must stay flat across 10,000 simulated requests.",
    ],
    example: "",
    tags: ["memory", "debug"],
    estimatedMins: 38,
    xp: 65,
    starterFiles: [
      {
        name: "tracker.js",
        lang: "js",
        code: `// tracker.js — this module leaks. Find out why.
const listeners = [];

function trackRequest(req) {
  listeners.push(() => req.id);
}

module.exports = { trackRequest, listeners };`,
      },
    ],
    testFile: { name: "tracker_test.js", lang: "test", code: "// tests are added when this challenge is authored in full" },
    hints: [],
    solution: null,
    status: "draft",
  },
  {
    slug: "parse-multipart-form-data",
    trackId: "api-dev",
    layerId: "api-dev-4",
    type: "CODE",
    difficulty: "hard",
    title: "Parse multipart form-data without a library",
    summary: "Read the boundary, parse headers and binary content by hand.",
    description:
      "Every upload library you've used is doing this underneath. Do it once yourself and multipart stops being magic.",
    task:
      "Parse a multipart/form-data body: read the boundary from the content-type header, split parts, parse each part's headers, and return the fields and files.",
    constraints: [
      "No busboy, no multer, no multipart libraries.",
      "Binary content must survive intact — do not coerce buffers to strings.",
      "Must handle a trailing boundary correctly.",
    ],
    example: "",
    tags: ["streams", "parsing"],
    estimatedMins: 42,
    xp: 70,
    starterFiles: [
      {
        name: "parseMultipart.js",
        lang: "js",
        code: `// parseMultipart.js
function parseMultipart(buffer, boundary) {
  // your code here
}

module.exports = parseMultipart;`,
      },
    ],
    testFile: { name: "parseMultipart_test.js", lang: "test", code: "// tests are added when this challenge is authored in full" },
    hints: [],
    solution: null,
    status: "draft",
  },
];

// ── Write ─────────────────────────────────────────────────────

async function seed() {
  const db = await connectDB();
  const col = db.collection("challenges");

  // Guard: every challenge must point at a layer that actually exists.
  const referenced = [...new Set(challenges.map((c) => c.layerId))];
  const found = await db
    .collection("roadmap_layers")
    .find({ layerId: { $in: referenced } })
    .project({ layerId: 1 })
    .toArray();
  const known = new Set(found.map((l) => l.layerId));
  const missing = referenced.filter((id) => !known.has(id));

  if (missing.length > 0) {
    console.error(
      `Refusing to seed — these layerIds are not in roadmap_layers:\n  ${missing.join("\n  ")}\n` +
        `Run 'npm run seed:roadmap' first.`,
    );
    process.exit(1);
  }

  await Promise.all([
    col.createIndex({ slug: 1 }, { unique: true }),
    col.createIndex({ status: 1, trackId: 1, layerId: 1 }),
    col.createIndex({ status: 1, tags: 1 }),
    col.createIndex(
      { title: "text", summary: "text", tags: "text" },
      { name: "challenge_text_search" },
    ),
  ]);

  const ops = challenges.map((c) => ({
    updateOne: {
      filter: { slug: c.slug },
      update: {
        $set: {
          ...c,
          status: c.status ?? "published",
          hiddenTests: c.hiddenTests ?? [],
          submittedBy: null,
          updatedAt: new Date(),
        },
        // stats must survive a re-seed — never reset a solve count
        $setOnInsert: { createdAt: new Date(), stats: { solves: 0, attempts: 0 } },
      },
      upsert: true,
    },
  }));

  const result = await col.bulkWrite(ops, { ordered: false });
  const published = challenges.filter((c) => (c.status ?? "published") === "published").length;

  console.log(
    `challenges: ${challenges.length} seen, ${result.upsertedCount} inserted, ${result.modifiedCount} updated`,
  );
  console.log(`  ${published} published, ${challenges.length - published} draft (no tests authored yet)`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Challenge seed failed:", err);
  process.exit(1);
});
