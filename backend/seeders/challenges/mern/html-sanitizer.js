export default {
  slug: "html-sanitizer",
  trackId: "mern",
  layerId: "mern-1",
  type: "CODE",
  difficulty: "hard",
  title: "Allowlist HTML sanitizer",
  summary: "Strip everything from an HTML string except the tags and attributes you explicitly allow, and neutralise script injection.",
  description:
    "Rendering user-supplied HTML with <code>innerHTML</code> or <code>dangerouslySetInnerHTML</code> is how XSS happens. Libraries like DOMPurify work from an allowlist: anything not named is removed. Build the core of one on plain strings.",
  task:
    "Write <code>sanitizeHtml(html, allow)</code> where <code>allow</code> maps an allowed tag name to the list of attribute names it may keep, e.g. <code>{ a: ['href'], b: [] }</code>. Return the cleaned HTML string.",
  constraints: [
    "Tags not in <code>allow</code> are removed but their text content is kept. <code>&lt;script&gt;</code> and <code>&lt;style&gt;</code> elements are removed WITH their content (case-insensitive).",
    "Allowed tags are output lower-cased and keep only attributes listed for them (names compared case-insensitively). Attributes starting with <code>on</code> are always dropped, even if listed.",
    "For <code>href</code> and <code>src</code>, drop the attribute when the value (ignoring whitespace and control characters, case-insensitive) starts with <code>javascript:</code>, <code>vbscript:</code> or <code>data:</code>.",
    "Kept attributes are rewritten as <code>name=\"value\"</code> with double quotes, whatever quoting the input used; a double quote, <code>&lt;</code> or <code>&gt;</code> inside a value is escaped as <code>&amp;quot;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>. Valueless attributes get <code>=\"\"</code>.",
    "Closing tags of allowed tags are kept, others removed. Self-closing syntax (<code>&lt;br/&gt;</code>) is normalised to <code>&lt;br&gt;</code>. Comments are removed, and a stray <code>&lt;</code> that does not start a tag becomes <code>&amp;lt;</code>.",
  ],
  example: `sanitizeHtml('<a href="/x" onclick="evil()">go</a>', { a: ['href'] }) // '<a href="/x">go</a>'`,
  tags: ["html", "security", "xss", "parsing"],
  estimatedMins: 45,
  xp: 75,
  starterFiles: [
    {
      name: "sanitizeHtml.js",
      lang: "js",
      code: `// sanitizeHtml.js
function sanitizeHtml(html, allow) {
  // your code here
}

module.exports = sanitizeHtml;`,
    },
  ],
  testFile: {
    name: "sanitizeHtml_test.js",
    lang: "test",
    code: `const sanitizeHtml = require('./sanitizeHtml');

test('keeps allowed tags', () => {
  expect(sanitizeHtml('<p>Hi <b>x</b></p>', { p: [], b: [] })).toBe('<p>Hi <b>x</b></p>');
});

test('drops scripts with their content', () => {
  expect(sanitizeHtml('a<script>alert(1)</script>b', {})).toBe('ab');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "First remove <code>&lt;script&gt;...&lt;/script&gt;</code> and style blocks with one regex using a backreference (<code>/&lt;(script|style)\\b[^&gt;]*&gt;[\\s\\S]*?&lt;\\/\\1\\s*&gt;/gi</code>)." },
    { order: 2, cost: 5, text: "Tokenise the rest with one regex that matches a comment, a tag, a lone <code>&lt;</code>, or a run of text, in that order, then handle each token type." },
    { order: 3, cost: 15, text: "Parse a tag's attributes with a second regex that accepts double-quoted, single-quoted and unquoted values. Use <code>Object.prototype.hasOwnProperty.call(allow, tag)</code> so a tag called <code>constructor</code> isn't accidentally allowed." },
  ],
  hiddenTests: [
    { name: "keeps_allowed_tags", code: `assert(sanitizeHtml('<p>Hi <b>there</b></p>', { p: [], b: [] }) === '<p>Hi <b>there</b></p>', 'unchanged');` },
    { name: "removes_disallowed_tags_keeps_text", code: `assert(sanitizeHtml('<div>Hi <i>x</i></div>', {}) === 'Hi x', 'got ' + sanitizeHtml('<div>Hi <i>x</i></div>', {}));
assert(sanitizeHtml('<p>x</p></div>', { p: [] }) === '<p>x</p>', 'stray closing tag removed');` },
    { name: "script_and_style_removed_with_content", code: `assert(sanitizeHtml('a<script>alert(1)</script>b', {}) === 'ab', 'script');
assert(sanitizeHtml('<style>p{color:red}</style>x', {}) === 'x', 'style');
assert(sanitizeHtml('a<SCRIPT type="x">evil()</SCRIPT>b', {}) === 'ab', 'upper case');` },
    { name: "filters_attributes", code: `const out = sanitizeHtml('<a href="/x" onclick="evil()" class="c">go</a>', { a: ['href'] });
assert(out === '<a href="/x">go</a>', 'got ' + out);` },
    { name: "event_handlers_never_allowed", code: `const out = sanitizeHtml('<a onclick="x()" href="/y">go</a>', { a: ['href', 'onclick'] });
assert(out === '<a href="/y">go</a>', 'got ' + out);
assert(sanitizeHtml('<b ONMOUSEOVER="x()">t</b>', { b: ['onmouseover'] }) === '<b>t</b>', 'case-insensitive');` },
    { name: "dangerous_urls_dropped", code: `assert(sanitizeHtml('<a href="javascript:alert(1)">x</a>', { a: ['href'] }) === '<a>x</a>', 'plain');
assert(sanitizeHtml('<a href=" JaVa\\tScript:alert(1)">x</a>', { a: ['href'] }) === '<a>x</a>', 'obfuscated');
assert(sanitizeHtml('<img src="data:text/html;base64,AAAA">', { img: ['src'] }) === '<img>', 'data url');
assert(sanitizeHtml('<a href="https://ok.dev/a?b=1&c=2">x</a>', { a: ['href'] }) === '<a href="https://ok.dev/a?b=1&c=2">x</a>', 'safe url kept as written');` },
    { name: "attribute_quoting_is_normalised", code: `assert(sanitizeHtml("<a href='/a'>x</a>", { a: ['href'] }) === '<a href="/a">x</a>', 'single quotes');
assert(sanitizeHtml('<a href=/a>x</a>', { a: ['href'] }) === '<a href="/a">x</a>', 'unquoted');
assert(sanitizeHtml("<a title='say \\"hi\\"'>x</a>", { a: ['title'] }) === '<a title="say &quot;hi&quot;">x</a>', 'quote escaped');
assert(sanitizeHtml('<input disabled>', { input: ['disabled'] }) === '<input disabled="">', 'valueless attribute');` },
    { name: "comments_and_stray_less_than", code: `assert(sanitizeHtml('a<!-- hidden <b> -->b', { b: [] }) === 'ab', 'comment removed');
assert(sanitizeHtml('1 < 2', {}) === '1 &lt; 2', 'stray <');` },
    { name: "tag_case_and_self_closing", code: `assert(sanitizeHtml('<P>Hi</P>', { p: [] }) === '<p>Hi</p>', 'lower-cased');
assert(sanitizeHtml('a<br/>b', { br: [] }) === 'a<br>b', 'self-closing normalised');
assert(sanitizeHtml('a<br />b', { br: [] }) === 'a<br>b', 'with space');` },
    { name: "prototype_names_are_not_tags", code: `assert(sanitizeHtml('<constructor>x</constructor><toString>y</toString>', {}) === 'xy', 'inherited keys are not allowed tags');` },
  ],
  solution: {
    code: `function sanitizeHtml(html, allow) {
  const input = html.replace(/<(script|style)\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>/gi, '');
  const tokens = input.match(/<!--[\\s\\S]*?-->|<\\/?[a-zA-Z][^>]*>|<|[^<]+/g) || [];
  const esc = (v) => v.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let out = '';

  for (const tok of tokens) {
    if (tok.startsWith('<!--')) continue;
    if (tok === '<') { out += '&lt;'; continue; }
    if (tok[0] !== '<') { out += tok; continue; }

    const m = /^<(\\/?)([a-zA-Z][a-zA-Z0-9]*)([\\s\\S]*?)\\/?>$/.exec(tok);
    if (!m) continue;
    const tag = m[2].toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(allow, tag)) continue;
    if (m[1]) { out += '</' + tag + '>'; continue; }

    const permitted = allow[tag].map((a) => a.toLowerCase());
    let attrs = '';
    const re = /([^\\s=\\/"'>]+)(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+)))?/g;
    let a;
    while ((a = re.exec(m[3]))) {
      const name = a[1].toLowerCase();
      if (name.startsWith('on') || !permitted.includes(name)) continue;
      const value = a[2] ?? a[3] ?? a[4] ?? '';
      if ((name === 'href' || name === 'src') &&
          /^(javascript|vbscript|data):/i.test(value.replace(/[\\s\\u0000-\\u001f]/g, ''))) continue;
      attrs += ' ' + name + '="' + esc(value) + '"';
    }
    out += '<' + tag + attrs + '>';
  }
  return out;
}

module.exports = sanitizeHtml;`,
    explanation:
      "An allowlist is safer than a blocklist because anything you didn't think of is removed by default. Script and style blocks are cut first with a backreference regex so their text can't leak out as content. Every remaining token is then rebuilt from parsed parts (tag name, allowed attributes, re-escaped values) rather than copied, so odd quoting or casing can't smuggle anything through.",
  },
};
