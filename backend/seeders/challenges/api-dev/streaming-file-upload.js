export default {
    slug: "streaming-file-upload",
    trackId: "api-dev",
    layerId: "api-dev-3",
    type: "BUILD",
    difficulty: "med",
    title: "Streaming file-upload endpoint",
    summary:
      "Stream large uploads to a sink without buffering them in memory, respecting backpressure.",
    description:
      "Buffering an upload into memory works fine on a 2MB test file and falls over on a 2GB one. Build the handler the way production does it — and unit-test it without ever touching a real disk.",
    task:
      "Write <code>streamUpload(source, sink)</code>. <code>source</code> is an async iterable of Buffer chunks (stand-in for a request body). <code>sink</code> has <code>write(chunk)</code> — returns <code>true</code> if it accepted the chunk immediately, <code>false</code> if the caller must wait for a <code>'drain'</code> event before writing again — and <code>end()</code>. Write every chunk to the sink in order, respecting backpressure, then call <code>sink.end()</code>. If <code>source</code> throws mid-stream, call <code>sink.abort()</code> instead of <code>end()</code> and rethrow.",
    constraints: [
      "Must never buffer more than one pending chunk while waiting on backpressure.",
      "A thrown error from the source must call sink.abort(), not sink.end().",
      "Chunks must reach the sink in the same order they were read.",
      "No busy-waiting — waiting for drain must be event-driven.",
    ],
    example: `await streamUpload(chunksFromRequest(req), fileSink);
// fileSink is whatever the framework wires up — a real fs write stream in
// production, an in-memory fake in tests. streamUpload never knows the
// difference, which is exactly why it's testable without touching disk.`,
    tags: ["streams", "upload", "backpressure"],
    estimatedMins: 30,
    xp: 55,
    starterFiles: [
      {
        name: "streamUpload.js",
        lang: "js",
        code: `// streamUpload.js
async function streamUpload(source, sink) {
  // your code here
}

module.exports = streamUpload;`,
      },
    ],
    testFile: {
      name: "streamUpload_test.js",
      lang: "test",
      code: `// streamUpload_test.js
const streamUpload = require('./streamUpload');

test('writes_all_chunks_in_order', async () => {
  const written = [];
  const sink = { write: (c) => { written.push(c); return true; }, end: () => {}, abort: () => {} };
  async function* source() { yield 'a'; yield 'b'; yield 'c'; }
  await streamUpload(source(), sink);
  expect(written.join('')).toBe('abc');
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "This is dependency injection: the function never imports <code>fs</code> — it receives whatever writable-shaped object the caller hands it. That's what makes it unit-testable.",
      },
      {
        order: 2,
        cost: 5,
        text: "When <code>sink.write(chunk)</code> returns <code>false</code>, you must stop and wait for a <code>'drain'</code> event before writing the next chunk — treat <code>sink</code> as an EventEmitter.",
      },
      {
        order: 3,
        cost: 15,
        text: "Wrap the wait in a Promise: <code>await new Promise(resolve => sink.once('drain', resolve))</code> before continuing the loop.",
      },
    ],
    hiddenTests: [
      {
        name: "writes_all_chunks_in_order",
        code: `const written = [];
const sink = { write: (c) => { written.push(c); return true; }, end: () => { written.push('[END]'); }, abort: () => {} };
async function* source() { yield 'a'; yield 'b'; yield 'c'; }
await streamUpload(source(), sink);
assert(written.join('') === 'abc[END]', 'chunks must be written in order, then end() called');`,
      },
      {
        name: "respects_backpressure",
        code: `const EventEmitter = require('events');
const sink = new EventEmitter();
const written = [];
let blocked = false;
sink.write = (c) => { written.push(c); if (c === 'b') { blocked = true; return false; } return true; };
sink.end = () => { written.push('[END]'); };
sink.abort = () => {};
async function* source() { yield 'a'; yield 'b'; yield 'c'; }
const p = streamUpload(source(), sink);
await new Promise((r) => setTimeout(r, 10));
assert(blocked === true, 'the chunk after a false-returning write must not be written yet');
assert(written.join('') === 'ab', 'only a and b should have been written before drain');
sink.emit('drain');
await p;
assert(written.join('') === 'abc[END]', 'c should only be written after drain fires');`,
      },
      {
        name: "aborts_on_source_error",
        code: `let aborted = false, ended = false;
const sink = { write: () => true, end: () => { ended = true; }, abort: () => { aborted = true; } };
async function* source() { yield 'a'; throw new Error('disconnect'); }
let threw = false;
try { await streamUpload(source(), sink); } catch { threw = true; }
assert(threw === true, 'the error must propagate to the caller');
assert(aborted === true, 'sink.abort() must be called on a source error');
assert(ended === false, 'sink.end() must NOT be called when the stream errored');`,
      },
      {
        name: "handles_empty_source",
        code: `let ended = false;
const sink = { write: () => true, end: () => { ended = true; }, abort: () => {} };
async function* source() {}
await streamUpload(source(), sink);
assert(ended === true, 'an empty source must still call end()');`,
      },
      {
        name: "does_not_busy_wait",
        code: `const EventEmitter = require('events');
const sink = new EventEmitter();
let writeCalls = 0;
sink.write = () => { writeCalls++; return false; };
sink.end = () => {};
sink.abort = () => {};
async function* source() { yield 'a'; yield 'b'; }
const p = streamUpload(source(), sink);
await new Promise((r) => setTimeout(r, 20));
assert(writeCalls === 1, 'without a drain event, only the first chunk should ever be attempted — got ' + writeCalls + ' write calls');
sink.emit('drain');
await new Promise((r) => setTimeout(r, 20));
sink.emit('drain');
await p;`,
      },
    ],
    solution: {
      code: `async function streamUpload(source, sink) {
  try {
    for await (const chunk of source) {
      const ok = sink.write(chunk);
      if (!ok) {
        await new Promise((resolve) => sink.once('drain', resolve));
      }
    }
    sink.end();
  } catch (err) {
    sink.abort();
    throw err;
  }
}

module.exports = streamUpload;`,
      explanation:
        "The sink is injected rather than constructed inside the function, which is what makes this testable without a filesystem — production wires up a real write stream, tests wire up a plain object. The for-await loop consumes the async iterable chunk by chunk, so memory use stays flat regardless of total size. When write() signals backpressure by returning false, the loop suspends on a one-shot 'drain' listener instead of continuing to push — that's the difference between respecting backpressure and just hoping the sink keeps up. A source error is caught, routed to abort() instead of end() (so a partial file is never marked complete), and rethrown so the caller still sees the failure.",
    },
};
