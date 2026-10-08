export default {
  slug: "line-splitter",
  trackId: "node-dev",
  layerId: "node-dev-3",
  type: "CODE",
  difficulty: "med",
  title: "Transform stream: split chunks into lines",
  summary: "Turn arbitrary text chunks into complete lines, even when a line is split across chunks.",
  description:
    "Streams deliver data in chunks that don't respect your data's structure: a chunk can end in the middle of a line, or even between <code>\\r</code> and <code>\\n</code>. Every line-oriented transform (log parsers, CSV readers, NDJSON) has to buffer the incomplete tail.",
  task:
    "Write <code>createLineSplitter()</code> returning <code>{ push(chunk), flush() }</code>. <code>push</code> takes a string chunk and returns the array of lines completed by it; <code>flush</code> returns the remaining partial line (as a one-element array) when the stream ends.",
  constraints: [
    "Lines end with <code>\\n</code> or <code>\\r\\n</code>; the terminator is not part of the returned line.",
    "An incomplete last line is kept until a later chunk completes it.",
    "A <code>\\r\\n</code> pair split across two chunks must still count as one terminator.",
    "Empty lines are returned as <code>''</code>.",
    "<code>flush()</code> returns <code>[]</code> if nothing is buffered, otherwise the buffered text, and then resets the buffer.",
  ],
  example: `const s = createLineSplitter(); s.push('a\\nb'); // ['a']
s.push('c\\n'); // ['bc']`,
  tags: ["streams","transform","parsing","buffering"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createLineSplitter.js",
      lang: "js",
      code: `// createLineSplitter.js
function createLineSplitter() {
  // your code here
}

module.exports = createLineSplitter;`,
    },
  ],
  testFile: {
    name: "createLineSplitter_test.js",
    lang: "test",
    code: `const createLineSplitter = require('./createLineSplitter');

test('lines', () => {
  const s = createLineSplitter(); expect(s.push('a\\nb\\n')).toEqual(['a', 'b']);
});

test('split_chunk', () => {
  const s = createLineSplitter(); s.push('he'); expect(s.push('llo\\n')).toEqual(['hello']);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a <code>rest</code> string. On each push, work with <code>rest + chunk</code>." },
    { order: 2, cost: 5, text: "Split on <code>/\\r?\\n/</code>; the LAST element has no terminator yet, so <code>pop()</code> it back into <code>rest</code> and return the others." },
    { order: 3, cost: 15, text: "Because <code>rest</code> keeps a trailing <code>\\r</code>, a CRLF split across chunks automatically joins up on the next push." },
  ],
  hiddenTests: [
    { name: "complete_lines_in_one_chunk", code: `const s = createLineSplitter();
assert(s.push('a\\nb\\nc\\n').join('|') === 'a|b|c', 'three lines');
assert(s.flush().length === 0, 'nothing left');` },
    { name: "partial_line_is_buffered", code: `const s = createLineSplitter();
assert(s.push('hel').length === 0, 'no complete line yet');
assert(s.push('lo wor').length === 0, 'still none');
assert(s.push('ld\\nnext').join('|') === 'hello world', 'completed');
assert(s.flush().join('|') === 'next', 'tail on flush');` },
    { name: "crlf_terminators", code: `const s = createLineSplitter();
assert(s.push('a\\r\\nb\\r\\n').join('|') === 'a|b', 'CRLF removed');` },
    { name: "crlf_split_across_chunks", code: `const s = createLineSplitter();
assert(s.push('a\\r').length === 0, 'the \\\\r might be half a CRLF, so wait');
assert(s.push('\\nb\\n').join('|') === 'a|b', 'joined into one terminator, no stray \\\\r');` },
    { name: "empty_lines_preserved", code: `const s = createLineSplitter();
const out = s.push('a\\n\\n\\nb\\n');
assert(out.length === 4 && out[0] === 'a' && out[1] === '' && out[2] === '' && out[3] === 'b', 'empty lines: ' + JSON.stringify(out));` },
    { name: "flush_semantics", code: `const s = createLineSplitter();
assert(s.flush().length === 0, 'empty flush');
s.push('tail');
assert(s.flush().join('|') === 'tail', 'returns the partial line');
assert(s.flush().length === 0, 'then resets');
assert(s.push('x\\n').join('|') === 'x', 'usable after flush');` },
    { name: "empty_chunks_are_harmless", code: `const s = createLineSplitter();
assert(s.push('').length === 0, 'empty chunk');
s.push('ab');
assert(s.push('').length === 0, 'empty chunk keeps buffer');
assert(s.push('\\n').join('|') === 'ab', 'still there');` },
    { name: "one_char_at_a_time", code: `const s = createLineSplitter(); const lines = [];
for (const ch of 'one\\ntwo\\r\\nthree') lines.push(...s.push(ch));
lines.push(...s.flush());
assert(lines.join('|') === 'one|two|three', 'streaming byte by byte: ' + lines.join('|'));` },
    { name: "same_result_for_any_chunking", code: `const text = 'alpha\\nbeta\\r\\n\\ngamma\\ndelta';
const whole = (() => { const s = createLineSplitter(); return [...s.push(text), ...s.flush()]; })();
for (let size = 1; size <= 7; size++) {
  const s = createLineSplitter(); const out = [];
  for (let i = 0; i < text.length; i += size) out.push(...s.push(text.slice(i, i + size)));
  out.push(...s.flush());
  assert(out.join('|') === whole.join('|'), 'chunk size ' + size + ' gave ' + out.join('|'));
}` },
  ],
  solution: {
    code: `function createLineSplitter() {
  let rest = '';
  return {
    push(chunk) {
      const parts = (rest + chunk).split(/\\r?\\n/);
      rest = parts.pop();
      return parts;
    },
    flush() {
      const out = rest === '' ? [] : [rest];
      rest = '';
      return out;
    },
  };
}

module.exports = createLineSplitter;`,
    explanation:
      "Whatever follows the last terminator is incomplete, so it becomes the new rest and is prepended to the next chunk. Keeping a trailing \\r in rest is what makes a CRLF split across chunks work without special cases.",
  },
};
