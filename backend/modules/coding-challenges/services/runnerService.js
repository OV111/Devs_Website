/**
 * Server-side code runner.
 *
 * This is the only place untrusted student code is executed on the server, so
 * the whole file is about containment.
 *
 * Two backends, selected at load time:
 *
 *   isolated-vm  — a real V8 isolate with a hard memory cap and a wall-clock
 *                  timeout per script. No access to `require`, `process`,
 *                  `fetch`, the filesystem, or anything else in the host realm,
 *                  because the isolate has a genuinely separate heap and global.
 *
 *   child process — fallback when isolated-vm isn't installed (it is a native
 *                  addon and does not always build on Windows). A short-lived
 *                  `node` process with the code on stdin, killed on timeout.
 *                  Weaker: the child *does* have Node's API surface. Acceptable
 *                  here because a user only ever runs their own code, but it is
 *                  NOT safe for running someone else's submission.
 *
 * `describeRunner()` reports which one is live so the rest of the app — and the
 * operator — can tell the difference rather than assuming the strong one.
 */

import { spawn } from "node:child_process";
import process from "process";

const MEMORY_LIMIT_MB = 64;
const TIMEOUT_MS = 5000;

// Sentinel separating the harness payload from anything the code logged.
const RESULT_MARKER = "__CHALLENGE_RESULT__";

let ivm = null;
try {
  ivm = (await import("isolated-vm")).default;
} catch {
  ivm = null;
}

export const describeRunner = () => ({
  backend: ivm ? "isolated-vm" : "child-process",
  hardened: Boolean(ivm),
  memoryLimitMb: MEMORY_LIMIT_MB,
  timeoutMs: TIMEOUT_MS,
});

/**
 * Build the program that runs inside the sandbox.
 *
 * The student's module is evaluated with a minimal CommonJS shim so
 * `module.exports = asyncHandler` works unchanged, then each hidden test runs
 * in sequence against the exported value. Results are collected rather than
 * thrown so one failing test never hides the others.
 *
 * The harness reports back by assigning JSON to a global the host reads, which
 * keeps the isolate boundary to a single string — no object marshalling.
 */
const buildProgram = (userCode, exportName, hiddenTests) => `
(async () => {
  const __results = [];

  function assert(cond, message) {
    if (!cond) throw new Error(message || "Assertion failed");
  }

  let __exported;
  try {
    const __module = { exports: {} };
    // The student's file is evaluated inside a function whose parameters
    // shadow the dangerous host globals, so a casual require('fs') or
    // process.env read resolves to undefined. This is defence in depth, not a
    // security boundary — see the header note on the child-process backend.
    const __load = new Function(
      "module", "exports", "require", "process", "global", "globalThis",
      "Buffer", "__dirname", "__filename", "fetch",
      ${JSON.stringify(`'use strict';\n${userCode}`)}
    );
    __load(__module, __module.exports);
    if (typeof __module.exports === "function") {
      __exported = __module.exports;
    } else if (__module.exports && typeof __module.exports === "object") {
      // A multi-export module (e.g. { trackRequest, completeRequest }) — bind
      // the whole object under the file's name AND spread its own keys as
      // bare identifiers, so hidden tests can call either
      // ${exportName}.trackRequest(...) or plain trackRequest(...), matching
      // however the challenge's tests were written.
      __exported = __module.exports;
      Object.assign(globalThis, __module.exports);
    }
  } catch (err) {
    __results.push({
      name: "module_loads",
      passed: false,
      ms: 0,
      message: "Your file threw while loading: " + (err && err.message),
    });
    __REPORT(JSON.stringify({ results: __results, fatal: true }));
    return;
  }

  // Bound in the outer scope so each test body can close over it. Declaring it
  // inside the try above would have been shadowed by the student's own
  // \`function ${exportName}\` declaration and left this undefined.
  const ${exportName} = __exported;

  if (typeof ${exportName} !== "function" && typeof ${exportName} !== "object") {
    __results.push({
      name: "module_exports_something_usable",
      passed: false,
      ms: 0,
      message: "Expected module.exports to be a function or an object, got " + typeof ${exportName} + ".",
    });
    __REPORT(JSON.stringify({ results: __results, fatal: true }));
    return;
  }

  const __tests = ${JSON.stringify(hiddenTests.map((t) => t.name))};
  const __bodies = [
    ${hiddenTests
      // A test whose code ends in a trailing "//" comment would otherwise
      // swallow the closing brace below into that comment, since it's
      // appended on the same line with no newline in between — this newline
      // is what makes that a syntax error in the test author's own code
      // instead of a silently broken script.
      .map((t) => `async () => {\n${t.code}\n}`)
      .join(", ")}
  ];

  for (let i = 0; i < __bodies.length; i++) {
    const started = Date.now();
    try {
      await __bodies[i]();
      __results.push({ name: __tests[i], passed: true, ms: Date.now() - started });
    } catch (err) {
      __results.push({
        name: __tests[i],
        passed: false,
        ms: Date.now() - started,
        message: (err && err.message) || String(err),
      });
    }
  }

  __REPORT(JSON.stringify({ results: __results, fatal: false }));
})();
`;

// ── isolated-vm backend ───────────────────────────────────────

const runInIsolate = async (program) => {
  const isolate = new ivm.Isolate({ memoryLimit: MEMORY_LIMIT_MB });
  try {
    const context = await isolate.createContext();
    const jail = context.global;
    await jail.set("global", jail.derefInto());

    // The isolate has its own heap and global object, so the only way results
    // cross the boundary is this one host callback, taking a single string.
    let payload = null;
    await jail.set(
      "__REPORT",
      new ivm.Callback((json) => {
        payload = json;
      }),
    );

    const script = await isolate.compileScript(program);
    await script.run(context, { timeout: TIMEOUT_MS, promise: true });

    if (!payload) {
      return { results: [], fatal: true, error: "The sandbox produced no result." };
    }
    return JSON.parse(payload);
  } catch (err) {
    const timedOut = /timed out/i.test(err.message);
    return {
      results: [],
      fatal: true,
      error: timedOut
        ? `Execution exceeded ${TIMEOUT_MS}ms — check for an infinite loop.`
        : err.message,
    };
  } finally {
    isolate.dispose();
  }
};

// ── child-process backend ─────────────────────────────────────

const runInChildProcess = (program) =>
  new Promise((resolve) => {
    const wrapped = `
      const MARKER = ${JSON.stringify(RESULT_MARKER)};
      globalThis.__REPORT = (json) => { process.stdout.write(MARKER + json); };
      ${program}
    `;

    const child = spawn(process.execPath, ["-e", wrapped], {
      stdio: ["ignore", "pipe", "pipe"],
      // Strip the parent's environment so the child cannot read secrets.
      env: { PATH: process.env.PATH },
      windowsHide: true,
    });

    let out = "";
    let err = "";
    let settled = false;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.kill("SIGKILL");
      resolve(value);
    };

    const timer = setTimeout(
      () =>
        finish({
          results: [],
          fatal: true,
          error: `Execution exceeded ${TIMEOUT_MS}ms — check for an infinite loop.`,
        }),
      TIMEOUT_MS,
    );

    child.stdout.on("data", (c) => (out += c));
    child.stderr.on("data", (c) => (err += c));

    child.on("close", () => {
      const marker = out.indexOf(RESULT_MARKER);
      if (marker === -1) {
        finish({
          results: [],
          fatal: true,
          error: err.split("\n")[0] || "The sandbox produced no result.",
        });
        return;
      }
      try {
        finish(JSON.parse(out.slice(marker + RESULT_MARKER.length)));
      } catch {
        finish({ results: [], fatal: true, error: "Malformed sandbox output." });
      }
    });

    child.on("error", (e) =>
      finish({ results: [], fatal: true, error: e.message }),
    );
  });

/**
 * Run the student's code against a challenge's hidden tests.
 *
 * @returns {{results: Array<{name,passed,ms,message?}>, fatal: boolean, error?: string}}
 */
export const runHiddenTests = async (userCode, exportName, hiddenTests) => {
  if (!Array.isArray(hiddenTests) || hiddenTests.length === 0) {
    return {
      results: [],
      fatal: true,
      error: "This challenge has no hidden tests yet.",
    };
  }

  const program = buildProgram(userCode, exportName, hiddenTests);
  return ivm ? runInIsolate(program) : runInChildProcess(program);
};
