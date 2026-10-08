export default {
  slug: "wrap-text",
  trackId: "web-game",
  layerId: "web-game-4",
  type: "CODE",
  difficulty: "med",
  title: "Word-wrap text for game UI",
  summary: "Wrap dialogue and tooltips to a pixel width using a measure function: explicit newlines, over-long words and a max-lines ellipsis.",
  description:
    "Canvas and bitmap-font text don't wrap by themselves. Dialogue boxes, tooltips and menu descriptions all need a wrapper that asks the renderer how wide a string is (<code>ctx.measureText</code>, or a bitmap font's glyph widths) and breaks lines to fit.",
  task:
    "Write <code>wrapText(text, maxWidth, measure, options)</code> returning an array of lines. <code>measure(str)</code> returns the pixel width of a string and <code>options</code> is <code>{ maxLines, ellipsis = '…' }</code>.",
  constraints: [
    "Throw a <code>RangeError</code> if <code>maxWidth</code> is not greater than 0. Treat <code>\\r\\n</code> as <code>\\n</code>, split the text into paragraphs on <code>\\n</code>, and wrap each paragraph separately. An empty paragraph produces one empty line (blank lines are preserved), so <code>''</code> gives <code>['']</code>.",
    "Within a paragraph, words are separated by runs of spaces; extra, leading and trailing spaces are dropped and lines are joined with a single space. Greedy fit: add the next word to the current line if <code>measure(line + ' ' + word) &lt;= maxWidth</code>, otherwise start a new line.",
    "A word that is wider than <code>maxWidth</code> by itself is broken character by character into chunks that each fit (at least one character per chunk, even if that character alone is too wide). Any line already in progress is finished first; the last chunk becomes the current line so later words can continue after it.",
    "If <code>maxLines</code> is given and there are more lines, keep only the first <code>maxLines</code> and end the last kept line with <code>ellipsis</code>: remove characters from the end of that line until <code>measure(line + ellipsis) &lt;= maxWidth</code> (trim trailing spaces), and if even the ellipsis alone does not fit, the line is just the ellipsis. Nothing is added when the text already fits in <code>maxLines</code>.",
  ],
  example: `wrapText('the quick brown fox', 100, (s) => s.length * 10) // ['the quick', 'brown fox']`,
  tags: ["text", "ui", "canvas", "layout"],
  estimatedMins: 35,
  xp: 55,
  starterFiles: [
    {
      name: "wrapText.js",
      lang: "js",
      code: `// wrapText.js
function wrapText(text, maxWidth, measure, options = {}) {
  // your code here
}

module.exports = wrapText;`,
    },
  ],
  testFile: {
    name: "wrapText_test.js",
    lang: "test",
    code: `const wrapText = require('./wrapText');
const m = (s) => s.length * 10;

test('wraps greedily', () => {
  expect(wrapText('the quick brown fox', 100, m)).toEqual(['the quick', 'brown fox']);
});

test('keeps explicit newlines', () => {
  expect(wrapText('a\\nb', 100, m)).toEqual(['a', 'b']);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write <code>wrapParagraph(words)</code> first (a loop with a <code>line</code> string), then map it over the paragraphs and flatten." },
    { order: 2, cost: 5, text: "For a too-wide word: finish the current line, then build chunks with an inner loop that appends characters while <code>measure(chunk + ch) &lt;= maxWidth</code> (always take at least one)." },
    { order: 3, cost: 15, text: "Apply <code>maxLines</code> last, to the finished list of lines, so it also works with newlines and broken words." },
  ],
  hiddenTests: [
    { name: "greedy_wrap", code: `const m = (s) => s.length * 10;
const r = wrapText('the quick brown fox', 100, m);
assert(JSON.stringify(r) === '["the quick","brown fox"]', 'got ' + JSON.stringify(r));` },
    { name: "a_word_that_exactly_fits_stays_on_the_line", code: `const m = (s) => s.length * 10;
assert(JSON.stringify(wrapText('abcde fghij', 50, m)) === '["abcde","fghij"]', 'exact width is allowed');
assert(JSON.stringify(wrapText('abc de', 60, m)) === '["abc de"]', 'fits exactly');` },
    { name: "explicit_newlines_and_blank_lines", code: `const m = (s) => s.length * 10;
const r = wrapText('one\\n\\ntwo\\r\\nthree', 100, m);
assert(JSON.stringify(r) === '["one","","two","three"]', 'got ' + JSON.stringify(r));
assert(JSON.stringify(wrapText('', 100, m)) === '[""]', 'empty text gives one empty line');` },
    { name: "spaces_are_collapsed_and_trimmed", code: `const m = (s) => s.length * 10;
const r = wrapText('  hello    world  ', 200, m);
assert(JSON.stringify(r) === '["hello world"]', 'got ' + JSON.stringify(r));
assert(JSON.stringify(wrapText('   ', 100, m)) === '[""]', 'only spaces is an empty line');` },
    { name: "long_words_are_broken_into_chunks", code: `const m = (s) => s.length * 10;
const r = wrapText('abcdefghijkl', 50, m);
assert(JSON.stringify(r) === '["abcde","fghij","kl"]', 'got ' + JSON.stringify(r));` },
    { name: "later_words_continue_after_the_last_chunk", code: `const m = (s) => s.length * 10;
const r = wrapText('hi abcdefghijkl mn', 50, m);
assert(JSON.stringify(r) === '["hi","abcde","fghij","kl mn"]', 'got ' + JSON.stringify(r));` },
    { name: "a_single_character_wider_than_the_box_still_gets_a_line", code: `const r = wrapText('abc', 5, (s) => s.length * 10);
assert(JSON.stringify(r) === '["a","b","c"]', 'one character per line: ' + JSON.stringify(r));` },
    { name: "uses_the_measure_function_not_the_length", code: `const widths = { i: 2, w: 10 };
const m = (s) => [...s].reduce((sum, ch) => sum + (widths[ch] || 6), 0);
const r = wrapText('iiii iiii wwww', 40, m);
assert(JSON.stringify(r) === '["iiii iiii","wwww"]', 'narrow glyphs fit more: ' + JSON.stringify(r));
const r2 = wrapText('wwww wwww', 60, m);
assert(JSON.stringify(r2) === '["wwww","wwww"]', 'wide glyphs wrap sooner: ' + JSON.stringify(r2));` },
    { name: "max_lines_adds_an_ellipsis_that_fits", code: `const m = (s) => s.length * 10;
const r = wrapText('one two three four five six', 100, m, { maxLines: 2 });
assert(r.length === 2, 'two lines');
assert(r[0] === 'one two', 'first line untouched: ' + r[0]);
assert(r[1] === 'three fou…', 'last kept line is shortened to fit the ellipsis: ' + r[1]);
assert(m(r[1]) <= 100, 'fits');` },
    { name: "no_ellipsis_when_everything_fits", code: `const m = (s) => s.length * 10;
const exact = wrapText('one two three', 100, m, { maxLines: 2 });
assert(JSON.stringify(exact) === '["one two","three"]', 'exactly maxLines lines: ' + JSON.stringify(exact));
const roomy = wrapText('hi', 100, m, { maxLines: 5 });
assert(JSON.stringify(roomy) === '["hi"]', 'fewer lines than the limit');` },
    { name: "custom_ellipsis_trailing_spaces_and_tiny_boxes", code: `const m = (s) => s.length * 10;
const r = wrapText('hello world again', 80, m, { maxLines: 1, ellipsis: '...' });
assert(r.length === 1 && r[0] === 'hello...', 'trailing space trimmed before the ellipsis: ' + JSON.stringify(r));
const tiny = wrapText('abcdef ghi', 10, m, { maxLines: 1 });
assert(JSON.stringify(tiny) === '["…"]', 'only the ellipsis fits: ' + JSON.stringify(tiny));` },
    { name: "invalid_width_throws", code: `const m = (s) => s.length;
let e1 = null, e2 = null;
try { wrapText('x', 0, m); } catch (e) { e1 = e; }
try { wrapText('x', -5, m); } catch (e) { e2 = e; }
assert(e1 instanceof RangeError && e2 instanceof RangeError, 'RangeError');` },
  ],
  solution: {
    code: `function wrapText(text, maxWidth, measure, options = {}) {
  if (!(maxWidth > 0)) throw new RangeError('maxWidth must be greater than 0');
  const { maxLines, ellipsis = '…' } = options;

  const breakWord = (word) => {
    const chunks = [];
    let chunk = '';
    for (const ch of word) {
      if (chunk && measure(chunk + ch) > maxWidth) {
        chunks.push(chunk);
        chunk = ch;
      } else {
        chunk += ch;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  };

  const wrapParagraph = (paragraph) => {
    const words = paragraph.split(' ').filter(Boolean);
    if (words.length === 0) return [''];
    const lines = [];
    let line = '';
    for (const word of words) {
      if (line && measure(line + ' ' + word) <= maxWidth) {
        line += ' ' + word;
      } else if (!line && measure(word) <= maxWidth) {
        line = word;
      } else if (measure(word) <= maxWidth) {
        lines.push(line);
        line = word;
      } else {
        if (line) lines.push(line);
        const chunks = breakWord(word);
        line = chunks.pop();
        lines.push(...chunks);
      }
    }
    lines.push(line);
    return lines;
  };

  let lines = text.replace(/\\r\\n/g, '\\n').split('\\n').flatMap(wrapParagraph);

  if (maxLines !== undefined && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last && measure(last + ellipsis) > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = last.trimEnd() + ellipsis;
  }
  return lines;
}

module.exports = wrapText;`,
    explanation:
      "Greedy wrapping asks one question per word: does it still fit on this line? That question is answered by the injected measure function, which is why the same code works for a monospace test, canvas fonts, or bitmap glyph tables. Over-long words are the only case needing a fallback, handled by chunking characters, and truncation is applied last to the finished lines so newlines and broken words don't need special cases.",
  },
};
