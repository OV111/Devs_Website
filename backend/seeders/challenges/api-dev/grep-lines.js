export default {
  slug: "grep-lines",
  trackId: "api-dev",
  layerId: "api-dev-2",
  type: "CODE",
  difficulty: "easy",
  title: "Build a mini grep",
  summary: "Filter lines of text with a pattern, supporting -i, -v and -n.",
  description:
    "<code>grep</code> is the first tool you reach for when reading logs. At its heart it is: split into lines, test each against a pattern, print the matches.",
  task:
    "Write <code>grepLines(text, pattern, options)</code> returning an array of matching lines. <code>options</code>: <code>ignoreCase</code> (-i), <code>invert</code> (-v), <code>lineNumbers</code> (-n).",
  constraints: [
    "<code>pattern</code> is a regular expression source string.",
    "With <code>lineNumbers</code>, each result is <code>'N:line'</code> where N is the 1-based line number in the ORIGINAL text.",
    "A trailing newline does not create an extra empty line.",
    "All options default to false; no match returns <code>[]</code>.",
  ],
  example: `grepLines('a\\nERR x\\nb', 'err', { ignoreCase: true, lineNumbers: true })
// ['2:ERR x']`,
  tags: ["linux", "grep", "logs"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "grepLines.js",
      lang: "js",
      code: `// grepLines.js
function grepLines(text, pattern, options = {}) {
  // your code here
}

module.exports = grepLines;`,
    },
  ],
  testFile: {
    name: "grepLines_test.js",
    lang: "test",
    code: `const grepLines = require('./grepLines');

test('basic', () => {
  expect(grepLines('a\\nab\\nc', 'a')).toEqual(['a', 'ab']);
});

test('invert', () => {
  expect(grepLines('a\\nb', 'a', { invert: true })).toEqual(['b']);
});

test('line_numbers', () => {
  expect(grepLines('x\\ny', 'y', { lineNumbers: true })).toEqual(['2:y']);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Build one <code>RegExp</code> up front, adding the <code>'i'</code> flag when <code>ignoreCase</code> is set." },
    { order: 2, cost: 5, text: "Split on <code>\\n</code> and drop a final empty string if the text ended with a newline." },
    { order: 3, cost: 15, text: "A line is kept when <code>regex.test(line) !== invert</code>. Take the line number from the loop index, not from the filtered list." },
  ],
  hiddenTests: [
    { name: "plain_match", code: `const r = grepLines('error: a\\nok\\nerror: b', 'error');
assert(r.length === 2 && r[0] === 'error: a' && r[1] === 'error: b', 'two matches');` },
    { name: "regex_pattern", code: `const r = grepLines('error 1\\nan error\\nERROR', '^error');
assert(r.length === 1 && r[0] === 'error 1', 'anchored');` },
    { name: "ignore_case", code: `const r = grepLines('Error\\nok\\nERROR', 'error', { ignoreCase: true });
assert(r.length === 2, 'both cases');
assert(grepLines('Error', 'error').length === 0, 'case sensitive by default');` },
    { name: "invert", code: `const r = grepLines('a\\nb\\nc', 'b', { invert: true });
assert(r.length === 2 && r[0] === 'a' && r[1] === 'c', 'non-matching lines');` },
    { name: "line_numbers_are_original", code: `const r = grepLines('a\\nx\\nb\\nx', 'x', { lineNumbers: true });
assert(r[0] === '2:x' && r[1] === '4:x', 'numbers come from the original text');` },
    { name: "invert_and_numbers", code: `const r = grepLines('a\\nb\\nc', 'b', { invert: true, lineNumbers: true });
assert(r[0] === '1:a' && r[1] === '3:c', 'combined');` },
    { name: "trailing_newline", code: `const r = grepLines('a\\nb\\n', 'a', { invert: true });
assert(r.length === 1 && r[0] === 'b', 'no phantom empty line');` },
    { name: "no_match", code: `const r = grepLines('a\\nb', 'z');
assert(Array.isArray(r) && r.length === 0, 'empty array');` },
  ],
  solution: {
    code: `function grepLines(text, pattern, { ignoreCase = false, invert = false, lineNumbers = false } = {}) {
  const re = new RegExp(pattern, ignoreCase ? 'i' : '');
  const lines = text.split('\\n');
  if (lines[lines.length - 1] === '') lines.pop();
  const out = [];
  lines.forEach((line, i) => {
    if (re.test(line) !== invert) out.push(lineNumbers ? (i + 1) + ':' + line : line);
  });
  return out;
}

module.exports = grepLines;`,
    explanation:
      "Compile the pattern once, test each line, and keep it when the test result differs from the invert flag. The index gives the original line number.",
  },
};
