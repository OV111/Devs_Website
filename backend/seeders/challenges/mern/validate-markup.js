export default {
  slug: "validate-markup",
  trackId: "mern",
  layerId: "mern-1",
  type: "CODE",
  difficulty: "med",
  title: "Validate HTML tag nesting",
  summary: "Find the first nesting error in a piece of HTML: unclosed, unexpected or mismatched tags, with void elements handled.",
  description:
    "Browsers silently repair broken HTML, so a missing closing tag shows up as a layout bug far away from its cause. A stack is all you need to catch it: push on open, pop on close, complain when they disagree.",
  task:
    "Write <code>validateMarkup(html)</code> returning <code>{ valid: true }</code> or <code>{ valid: false, error }</code> for the FIRST problem found, where <code>error</code> is <code>{ type, tag, index, expected? }</code> and <code>index</code> is the position of the offending tag in the string.",
  constraints: [
    "Error types: <code>'unexpected-close'</code> (closing tag with nothing open), <code>'mismatch'</code> (closing tag differs from the innermost open tag; include <code>expected</code>), <code>'void-close'</code> (a closing tag for a void element like <code>&lt;/br&gt;</code>), and <code>'unclosed'</code> (still open at the end; report the innermost open tag and where it started).",
    "Void elements (<code>area base br col embed hr img input link meta source track wbr</code>) and self-closing tags (<code>&lt;x /&gt;</code>) never need a closing tag and are never pushed.",
    "Tag names are case-insensitive and reported lower-cased. Comments and <code>&lt;!DOCTYPE&gt;</code> are ignored. A <code>&gt;</code> inside a quoted attribute value does not end the tag. A <code>&lt;</code> that is not followed by a letter or <code>/</code> is just text.",
  ],
  example: `validateMarkup('<div><p>Hi</div>') // { valid: false, error: { type: 'mismatch', tag: 'div', expected: 'p', index: 10 } }`,
  tags: ["html", "stack", "parsing"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "validateMarkup.js",
      lang: "js",
      code: `// validateMarkup.js
function validateMarkup(html) {
  // your code here
}

module.exports = validateMarkup;`,
    },
  ],
  testFile: {
    name: "validateMarkup_test.js",
    lang: "test",
    code: `const validateMarkup = require('./validateMarkup');

test('valid', () => {
  expect(validateMarkup('<div><p>Hi</p></div>')).toEqual({ valid: true });
});

test('unclosed', () => {
  expect(validateMarkup('<ul><li>a').error.type).toBe('unclosed');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "One regex with <code>matchAll</code> can find comments, doctypes and tags. Capture the slash, the tag name and the attribute text; quoted strings need their own alternative so a <code>&gt;</code> inside them is skipped: <code>(?:\"[^\"]*\"|'[^']*'|[^'\">])*</code>." },
    { order: 2, cost: 5, text: "Keep a stack of <code>{ tag, index }</code>. A start tag is a self-closing one if its attribute text ends in <code>/</code>." },
    { order: 3, cost: 15, text: "After the loop, if the stack isn't empty the error is the top entry, the innermost unclosed tag." },
  ],
  hiddenTests: [
    { name: "valid_nesting", code: `const r = validateMarkup('<div><p>Hi <b>x</b></p></div>');
assert(r.valid === true && r.error === undefined, 'got ' + JSON.stringify(r));
assert(validateMarkup('').valid === true, 'empty string is valid');
assert(validateMarkup('just text').valid === true, 'text only is valid');` },
    { name: "void_and_self_closing_tags", code: `const r = validateMarkup('<p>a<br>b<img src="x"><input/><hr /></p>');
assert(r.valid === true, 'got ' + JSON.stringify(r));` },
    { name: "mismatch", code: `const r = validateMarkup('<div><p>Hi</div>');
assert(r.valid === false && r.error.type === 'mismatch', 'type: ' + JSON.stringify(r));
assert(r.error.tag === 'div' && r.error.expected === 'p' && r.error.index === 10, 'details: ' + JSON.stringify(r.error));` },
    { name: "unclosed_reports_innermost", code: `const r = validateMarkup('<ul><li>a');
assert(r.valid === false && r.error.type === 'unclosed', 'type: ' + JSON.stringify(r));
assert(r.error.tag === 'li' && r.error.index === 4, 'innermost open tag: ' + JSON.stringify(r.error));` },
    { name: "unexpected_close", code: `const r = validateMarkup('a</p>');
assert(r.valid === false && r.error.type === 'unexpected-close', 'type: ' + JSON.stringify(r));
assert(r.error.tag === 'p' && r.error.index === 1, 'details: ' + JSON.stringify(r.error));
const s = validateMarkup('<b>x</b></b>');
assert(s.error.type === 'unexpected-close' && s.error.index === 8, 'second close: ' + JSON.stringify(s));` },
    { name: "void_close", code: `const r = validateMarkup('<br></br>');
assert(r.valid === false && r.error.type === 'void-close', 'type: ' + JSON.stringify(r));
assert(r.error.tag === 'br' && r.error.index === 4, 'details: ' + JSON.stringify(r.error));` },
    { name: "case_insensitive", code: `assert(validateMarkup('<DIV></div>').valid === true, 'mixed case matches');
const r = validateMarkup('<DIV><SPAN></DIV>');
assert(r.error.tag === 'div' && r.error.expected === 'span', 'reported lower-cased: ' + JSON.stringify(r.error));` },
    { name: "quoted_attribute_values_may_contain_angle_brackets", code: `assert(validateMarkup('<a title="a > b" data-x=\\'<i>\\'>x</a>').valid === true, 'quotes protect >');` },
    { name: "comments_doctype_and_stray_less_than", code: `assert(validateMarkup('<!DOCTYPE html><!-- <div> --><p>x</p>').valid === true, 'comment and doctype ignored');
assert(validateMarkup('<p>1 < 2 and 3 <4</p>').valid === true, 'bare < is text (but <4 is not a tag either)');` },
    { name: "first_error_wins", code: `const r = validateMarkup('</a></b>');
assert(r.error.type === 'unexpected-close' && r.error.tag === 'a' && r.error.index === 0, 'got ' + JSON.stringify(r));` },
  ],
  solution: {
    code: `const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

function validateMarkup(html) {
  const re = /<!--[\\s\\S]*?-->|<!doctype[^>]*>|<(\\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  const stack = [];
  for (const m of html.matchAll(re)) {
    if (!m[2]) continue;
    const tag = m[2].toLowerCase();
    const index = m.index;
    if (m[1]) {
      if (VOID.has(tag)) return { valid: false, error: { type: 'void-close', tag, index } };
      if (stack.length === 0) return { valid: false, error: { type: 'unexpected-close', tag, index } };
      const top = stack[stack.length - 1];
      if (top.tag !== tag) {
        return { valid: false, error: { type: 'mismatch', tag, expected: top.tag, index } };
      }
      stack.pop();
    } else if (!VOID.has(tag) && !m[3].trim().endsWith('/')) {
      stack.push({ tag, index });
    }
  }
  if (stack.length) {
    const top = stack[stack.length - 1];
    return { valid: false, error: { type: 'unclosed', tag: top.tag, index: top.index } };
  }
  return { valid: true };
}

module.exports = validateMarkup;`,
    explanation:
      "A stack mirrors the browser's open-element list: opening a tag pushes, closing pops, and the closing tag must match the top. The tag regex has a dedicated alternative for quoted strings so a '>' inside an attribute value can't end the tag early, and the regex's matchAll index gives each error its position for free.",
  },
};
