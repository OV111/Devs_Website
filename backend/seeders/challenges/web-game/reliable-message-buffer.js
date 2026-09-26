export default {
  slug: "reliable-message-buffer",
  trackId: "web-game",
  layerId: "web-game-8",
  type: "CODE",
  difficulty: "hard",
  title: "Reorder buffer for out-of-order network messages",
  summary:
    "Buffer sequence-numbered multiplayer packets and release them to the game in order, even when the network delivers them out of order.",
  description:
    "UDP-style multiplayer transport doesn't guarantee packets arrive in the order they were sent. A game applying player-position updates out of order looks like players teleporting backward. This is the buffer that fixes that.",
  task:
    "Write <code>createReorderBuffer(startSeq)</code>. It returns <code>{ push(seq, payload), drain() }</code>. <code>push</code> stores an incoming message by its sequence number, arriving in any order, including duplicates (which must be ignored). <code>drain()</code> returns, in order, every payload starting from the next expected sequence number (beginning at <code>startSeq</code>) for as long as there is an unbroken run — and removes those from the buffer. A gap in the sequence stops the drain, holding later messages until the gap is filled by a later <code>push</code>.",
  constraints: [
    "drain() must return payloads in sequence order, never skipping a gap.",
    "A duplicate push() of a sequence number already stored (or already drained) must be a no-op — not overwrite, not throw.",
    "Calling drain() with nothing new ready must return an empty array, not null/undefined.",
    "The 'next expected sequence' only advances past sequences that have actually been drained — a gap must be able to be filled later and drained correctly then.",
  ],
  example: `const buf = createReorderBuffer(0);
buf.push(0, 'a');
buf.push(2, 'c');   // arrives before seq 1 — held
buf.push(1, 'b');   // fills the gap
buf.drain();        // ['a', 'b', 'c'] — released in order once the gap closed`,
  tags: ["networking", "multiplayer", "data-structures"],
  estimatedMins: 35,
  xp: 60,
  starterFiles: [
    {
      name: "createReorderBuffer.js",
      lang: "js",
      code: `// createReorderBuffer.js
function createReorderBuffer(startSeq) {
  // your code here
}

module.exports = createReorderBuffer;`,
    },
  ],
  testFile: {
    name: "createReorderBuffer_test.js",
    lang: "test",
    code: `// createReorderBuffer_test.js
const createReorderBuffer = require('./createReorderBuffer');

test('drains_in_order_sequence', () => {
  const buf = createReorderBuffer(0);
  buf.push(0, 'a');
  buf.push(1, 'b');
  expect(buf.drain()).toEqual(['a', 'b']);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "A <code>Map</code> from sequence number to payload handles arbitrary arrival order naturally — you don't need to sort anything on push, only on drain.",
    },
    {
      order: 2,
      cost: 5,
      text: "Track the next sequence number you're waiting for as a separate counter, starting at <code>startSeq</code>. drain() should check the Map for that exact number, and only that number, in a loop.",
    },
    {
      order: 3,
      cost: 15,
      text: "drain()'s loop: while the map has an entry for <code>next</code>, pull it out, push its payload onto the result array, delete it from the map, and increment <code>next</code>. Stop the moment <code>next</code> isn't present — that's the gap.",
    },
  ],
  hiddenTests: [
    {
      name: "drains_already_in_order_messages",
      code: `const buf = createReorderBuffer(0);
buf.push(0, 'a');
buf.push(1, 'b');
buf.push(2, 'c');
const result = buf.drain();
assert(JSON.stringify(result) === JSON.stringify(['a', 'b', 'c']), 'expected [a,b,c], got ' + JSON.stringify(result));`,
    },
    {
      name: "holds_messages_until_a_gap_is_filled",
      code: `const buf = createReorderBuffer(0);
buf.push(0, 'a');
buf.push(2, 'c');
let result = buf.drain();
assert(JSON.stringify(result) === JSON.stringify(['a']), 'with seq 1 missing, only "a" should drain, got ' + JSON.stringify(result));
buf.push(1, 'b');
result = buf.drain();
assert(JSON.stringify(result) === JSON.stringify(['b', 'c']), 'filling the gap should release b and c in order, got ' + JSON.stringify(result));`,
    },
    {
      name: "duplicate_push_is_a_no_op",
      code: `const buf = createReorderBuffer(0);
buf.push(0, 'first');
buf.push(0, 'duplicate-should-be-ignored');
const result = buf.drain();
assert(JSON.stringify(result) === JSON.stringify(['first']), 'a duplicate push of an already-buffered sequence must not overwrite it, got ' + JSON.stringify(result));`,
    },
    {
      name: "duplicate_of_an_already_drained_sequence_is_ignored",
      code: `const buf = createReorderBuffer(0);
buf.push(0, 'a');
buf.drain();
buf.push(0, 'late-duplicate');
buf.push(1, 'b');
const result = buf.drain();
assert(JSON.stringify(result) === JSON.stringify(['b']), 'a duplicate of an already-drained sequence must not re-appear or block seq 1, got ' + JSON.stringify(result));`,
    },
    {
      name: "drain_with_nothing_ready_returns_empty_array",
      code: `const buf = createReorderBuffer(5);
const result = buf.drain();
assert(Array.isArray(result) && result.length === 0, 'draining an empty/not-ready buffer must return an empty array, not null or undefined');`,
    },
    {
      name: "respects_a_non_zero_starting_sequence",
      code: `const buf = createReorderBuffer(100);
buf.push(101, 'skip-me-not-ready');
buf.push(100, 'first');
const result = buf.drain();
assert(JSON.stringify(result) === JSON.stringify(['first', 'skip-me-not-ready']), 'must start draining from startSeq (100), not from 0, got ' + JSON.stringify(result));`,
    },
  ],
  solution: {
    code: `function createReorderBuffer(startSeq) {
  const buffered = new Map();
  let next = startSeq;

  function push(seq, payload) {
    if (seq < next) return; // already drained — ignore
    if (buffered.has(seq)) return; // duplicate — ignore
    buffered.set(seq, payload);
  }

  function drain() {
    const result = [];
    while (buffered.has(next)) {
      result.push(buffered.get(next));
      buffered.delete(next);
      next += 1;
    }
    return result;
  }

  return { push, drain };
}

module.exports = createReorderBuffer;`,
    explanation:
      "A Map keyed by sequence number lets push() accept messages in any arrival order for free — there's nothing to sort, since the Map just remembers whatever arrived, regardless of when. The `next` counter is the single source of truth for what's actually been released; push() checks it to reject not just exact duplicates but also late arrivals of sequences that already drained (seq < next), which is what keeps a straggling retransmission from corrupting already-consumed state. drain()'s loop is the reordering itself: it only ever looks for the one specific sequence number it's currently waiting on, pulls it out and advances next if present, and stops the instant that number is missing — that stopping point IS the gap, and later messages already sitting in the Map simply wait there untouched until a push() fills it and a later drain() call resumes from where it left off.",
  },
};
