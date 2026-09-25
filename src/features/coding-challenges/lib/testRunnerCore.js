/**
 * testRunnerCore — the pure, environment-free half of the in-browser test
 * runner.
 *
 * It knows nothing about Web Workers: it takes the challenge's files
 * (`[{ name, lang, code }]`), executes the student module plus the test module
 * inside a tiny CommonJS + Jest shim, and resolves to plain result objects.
 * Keeping it worker-free is what lets the exact same code path be exercised
 * from plain Node in CI or a scratch script.
 */

/** How long a single async `test()` body may run before it is failed. */
const PER_TEST_TIMEOUT_MS = 2000;
/** How long the whole suite may run before the remaining tests are abandoned. */
export const RUN_BUDGET_MS = 5000;

// ── equality ──────────────────────────────────────────────────

/**
 * Structural equality used by `toBe`'s object cases and by
 * `toHaveBeenCalledWith`. Identity first (the seeded tests compare the very
 * same Error instance), then a shallow-recursive walk for plain data.
 */
function isEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (a instanceof Error && b instanceof Error)
    return a.name === b.name && a.message === b.message;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
    return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.hasOwn(b, k) && isEqual(a[k], b[k]));
}

function stringify(value) {
  if (value instanceof Error) return `Error: ${value.message}`;
  if (typeof value === "function") return value.name || "[Function]";
  if (typeof value === "bigint") return `${value}n`;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function formatArgs(args) {
  return args.map(stringify).join(", ");
}

// ── matchers ──────────────────────────────────────────────────

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

function callsOf(mock) {
  const calls = mock?.mock?.calls;
  if (!Array.isArray(calls))
    throw new AssertionError(
      "expected a jest.fn() mock, received " + stringify(mock),
    );
  return calls;
}

/**
 * Builds the matcher object for one `expect(received)`. `negated` flips the
 * pass condition, which is how `.not` is implemented without duplicating any
 * matcher body.
 */
function buildMatchers(received, negated) {
  const assert = (pass, message, negatedMessage) => {
    if (pass === negated) throw new AssertionError(negated ? negatedMessage : message);
  };

  return {
    toBe(expected) {
      assert(
        Object.is(received, expected),
        `expected ${stringify(expected)}, received ${stringify(received)}`,
        `expected value not to be ${stringify(expected)}`,
      );
    },
    toEqual(expected) {
      assert(
        isEqual(received, expected),
        `expected ${stringify(expected)}, received ${stringify(received)}`,
        `expected value not to equal ${stringify(expected)}`,
      );
    },
    toHaveBeenCalled() {
      const calls = callsOf(received);
      assert(
        calls.length > 0,
        "expected mock to have been called, but it was never called",
        `expected mock not to have been called, but it was called ${calls.length} time(s)`,
      );
    },
    toHaveBeenCalledTimes(n) {
      const calls = callsOf(received);
      assert(
        calls.length === n,
        `expected mock to have been called ${n} time(s), received ${calls.length}`,
        `expected mock not to have been called ${n} time(s)`,
      );
    },
    toHaveBeenCalledWith(...expected) {
      const calls = callsOf(received);
      const match = calls.some(
        (call) =>
          call.length === expected.length &&
          call.every((arg, i) => isEqual(arg, expected[i])),
      );
      assert(
        match,
        `expected mock to have been called with (${formatArgs(expected)}), received ` +
          (calls.length
            ? calls.map((c) => `(${formatArgs(c)})`).join(", ")
            : "no calls"),
        `expected mock not to have been called with (${formatArgs(expected)})`,
      );
    },
    toBeDefined() {
      assert(
        received !== undefined,
        "expected value to be defined",
        "expected value to be undefined",
      );
    },
    toBeTruthy() {
      assert(
        Boolean(received),
        `expected a truthy value, received ${stringify(received)}`,
        `expected a falsy value, received ${stringify(received)}`,
      );
    },
  };
}

function createExpect() {
  return function expect(received) {
    const matchers = buildMatchers(received, false);
    matchers.not = buildMatchers(received, true);
    return matchers;
  };
}

// ── jest.fn ───────────────────────────────────────────────────

/**
 * A minimal mock function: records every call and supports the four
 * `mock*` configurators the seeded tests rely on. Returns a real function so it
 * can be passed straight into student code as a route handler or `next`.
 */
function createMockFn(impl) {
  let implementation = impl;

  const mock = function (...args) {
    mock.mock.calls.push(args);
    const result = implementation ? implementation.apply(this, args) : undefined;
    mock.mock.results.push(result);
    return result;
  };

  mock.mock = { calls: [], results: [] };
  mock._isMockFunction = true;
  mock.mockImplementation = (fn) => ((implementation = fn), mock);
  mock.mockReturnValue = (value) => mock.mockImplementation(() => value);
  // Fresh promise per call so a rejection is only created when actually
  // awaited — pre-creating one would surface as an unhandled rejection.
  mock.mockResolvedValue = (value) =>
    mock.mockImplementation(() => Promise.resolve(value));
  mock.mockRejectedValue = (error) =>
    mock.mockImplementation(() => Promise.reject(error));
  mock.mockClear = () => {
    mock.mock.calls = [];
    mock.mock.results = [];
    return mock;
  };
  mock.mockReset = () => ((implementation = undefined), mock.mockClear());

  return mock;
}

// ── CommonJS shim ─────────────────────────────────────────────

/** `'./asyncHandler'`, `'./asyncHandler.js'`, `'asyncHandler'` → `asyncHandler`. */
function basename(request) {
  const last = String(request).split("/").pop();
  return last.replace(/\.(js|mjs|cjs|jsx)$/, "");
}

/**
 * Creates a `require` that resolves only within the supplied `files` array,
 * matching on basename. Modules execute at most once; the cache holds their
 * `module.exports`, exactly like Node's.
 */
function createRequire(files, globals) {
  const cache = new Map();

  function requireModule(request) {
    const key = basename(request);
    if (cache.has(key)) return cache.get(key).exports;

    const file = files.find((f) => basename(f.name) === key);
    if (!file)
      throw new Error(`Cannot find module '${request}' in this challenge`);

    const module = { exports: {} };
    // Seed the cache before executing so a circular require resolves to the
    // partially-filled exports object rather than looping forever.
    cache.set(key, module);

    const names = ["require", "module", "exports", ...Object.keys(globals)];
    const values = [requireModule, module, module.exports, ...Object.values(globals)];
    const factory = new Function(...names, `"use strict";\n${file.code}\n`);
    factory(...values);

    return module.exports;
  }

  return requireModule;
}

// ── runner ────────────────────────────────────────────────────

function withTimeout(promise, ms, label) {
  let timer;
  const guard = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new AssertionError(`${label} timed out after ${ms}ms`)),
      ms,
    );
  });
  return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
}

function pickTestFile(files) {
  return (
    files.find((f) => f.lang === "test") ??
    files.find((f) => /_?test\.js$|\.test\.js$|\.spec\.js$/.test(f.name ?? "")) ??
    null
  );
}

/**
 * Executes a challenge's files and returns one result per `test()`.
 *
 * Flow: collect phase (running the test module registers every `test()` into a
 * queue without executing any body), then run phase (each body runs in order,
 * timed, with its own try/catch so one failure never aborts the rest).
 *
 * @param {{name:string, lang?:string, code:string}[]} files
 * @returns {Promise<{name:string, passed:boolean, ms:number, message:string}[]>}
 */
export async function runTests(files) {
  const list = Array.isArray(files) ? files.filter((f) => f && typeof f.code === "string") : [];
  const testFile = pickTestFile(list);

  if (!testFile)
    return [
      { name: "suite", passed: false, ms: 0, message: "No test file found for this challenge." },
    ];

  const queue = [];
  const register = (name, fn) => {
    queue.push({ name: String(name), fn });
  };
  register.skip = (name) => queue.push({ name: String(name), fn: null, skipped: true });

  const globals = {
    test: register,
    it: register,
    expect: createExpect(),
    jest: { fn: createMockFn },
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
  };

  const requireModule = createRequire(list, globals);

  // Collect phase — a syntax error or a throw at module scope is a suite-level
  // failure, since no individual test has been registered yet.
  try {
    requireModule(testFile.name);
  } catch (err) {
    return [
      {
        name: testFile.name,
        passed: false,
        ms: 0,
        message: `Could not load the test file — ${err?.message ?? String(err)}`,
      },
    ];
  }

  const results = [];
  const startedAt = Date.now();

  for (const entry of queue) {
    if (Date.now() - startedAt > RUN_BUDGET_MS) {
      results.push({
        name: entry.name,
        passed: false,
        ms: 0,
        message: "Run budget exceeded — remaining tests were not executed.",
      });
      continue;
    }

    if (entry.skipped) {
      results.push({ name: entry.name, passed: false, ms: 0, message: "skipped" });
      continue;
    }

    const t0 = Date.now();
    try {
      const outcome = entry.fn();
      // Only pay for a timer when the body is actually thenable.
      if (outcome && typeof outcome.then === "function")
        await withTimeout(outcome, PER_TEST_TIMEOUT_MS, entry.name);
      results.push({ name: entry.name, passed: true, ms: Date.now() - t0, message: "" });
    } catch (err) {
      results.push({
        name: entry.name,
        passed: false,
        ms: Date.now() - t0,
        message: err?.message ?? String(err),
      });
    }
  }

  return results;
}
