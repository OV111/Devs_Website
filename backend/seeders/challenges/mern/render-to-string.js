export default {
  slug: "render-to-string",
  trackId: "mern",
  layerId: "mern-3",
  type: "CODE",
  difficulty: "hard",
  title: "Render JSX elements to an HTML string",
  summary: "Turn element objects (what JSX compiles to) into safe HTML: components, props, children, lists, conditionals and escaping.",
  description:
    "JSX is just <code>React.createElement(type, props, ...children)</code>, which builds plain objects. <code>renderToString</code> (server-side rendering) walks those objects and produces HTML. Writing it shows what components, props, children, keys, conditionals and lists really are.",
  task:
    "Write <code>renderToString(node)</code>. An element is <code>{ type, props, children }</code> (built by <code>h(type, props, ...children)</code>). <code>type</code> is a tag name, a component function, or <code>Symbol.for('react.fragment')</code>.",
  constraints: [
    "Strings and numbers become HTML-escaped text (<code>&amp; &lt; &gt; \" '</code>); <code>0</code> renders as <code>0</code>. <code>null</code>, <code>undefined</code>, <code>true</code> and <code>false</code> render nothing. Arrays (nested too) render their items in order.",
    "A component is called as <code>type({ ...props, children })</code> where <code>children</code> is the array of its children; it returns anything renderable. A fragment renders only its children.",
    "Tags: <code>&lt;tag attrs&gt;children&lt;/tag&gt;</code>. Void tags (<code>area base br col embed hr img input link meta source track wbr</code>) have no closing tag and ignore children.",
    "Attributes keep props order and values are escaped: <code>className</code> becomes <code>class</code>, <code>htmlFor</code> becomes <code>for</code>; <code>true</code> gives a bare attribute (<code>disabled</code>); <code>false</code>, <code>null</code>, <code>undefined</code> omit it. Never output <code>children</code>, <code>key</code>, <code>ref</code>, or <code>on*</code> handlers (like <code>onClick</code>).",
    "<code>style</code> objects become <code>style=\"prop-name:value;...\"</code> (camelCase to kebab-case); a non-zero number gets <code>px</code> unless the property is unitless (<code>opacity zIndex fontWeight lineHeight flex flexGrow flexShrink order</code>); null/false/empty values are skipped, and no style attribute is written if nothing is left.",
    "<code>dangerouslySetInnerHTML: { __html }</code> inserts the raw string as the element's content, unescaped.",
  ],
  example: `renderToString(h('ul', { className: 'list' }, items.map((i) => h('li', { key: i }, i)))) // '<ul class="list"><li>a</li>...</ul>'`,
  tags: ["react","jsx","ssr","components"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "renderToString.js",
      lang: "js",
      code: `// renderToString.js
function renderToString(node) {
  // your code here
}

module.exports = renderToString;`,
    },
  ],
  testFile: {
    name: "renderToString_test.js",
    lang: "test",
    code: `const renderToString = require('./renderToString');

test('tag_and_text', () => {
  const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
expect(renderToString(h('p', null, 'hi'))).toBe('<p>hi</p>');
});

test('escapes', () => {
  const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
expect(renderToString(h('p', null, '<b>'))).toBe('<p>&lt;b&gt;</p>');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write one recursive <code>render(n)</code>: handle primitives and arrays first, then fragments, components, and finally tags." },
    { order: 2, cost: 5, text: "Build the attribute string in a helper that loops over <code>Object.entries(props)</code> and skips <code>children/key/ref</code>, <code>/^on[A-Z]/</code> handlers and false-y values." },
    { order: 3, cost: 15, text: "A component is just a function call: <code>render(type({ ...props, children }))</code>. Whatever it returns goes back through <code>render</code>, which is how composition works." },
  ],
  hiddenTests: [
    { name: "tags_text_and_nesting", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('div', null, h('p', null, 'a'), h('p', null, 'b'))) === '<div><p>a</p><p>b</p></div>', 'nested');
assert(renderToString(h('div')) === '<div></div>', 'empty');
assert(renderToString('plain') === 'plain' && renderToString(42) === '42', 'bare primitives');` },
    { name: "text_is_escaped", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('p', null, 'a & b <i>"q"</i> \\'s\\'')) === '<p>a &amp; b &lt;i&gt;&quot;q&quot;&lt;/i&gt; &#39;s&#39;</p>', 'escape all five');` },
    { name: "nothing_values_and_zero", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('p', null, null, undefined, true, false)) === '<p></p>', 'null undefined booleans render nothing');
assert(renderToString(h('p', null, 0)) === '<p>0</p>', 'zero is rendered');
assert(renderToString(h('p', null, 'a', 1, 'b')) === '<p>a1b</p>', 'mixed text');` },
    { name: "conditional_rendering", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
const show = (flag) => h('div', null, flag && h('b', null, 'on'), flag ? 'yes' : 'no');
assert(renderToString(show(true)) === '<div><b>on</b>yes</div>', 'true');
assert(renderToString(show(false)) === '<div>no</div>', 'false short-circuit renders nothing');` },
    { name: "lists_and_nested_arrays", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
const items = ['a', 'b', 'c'];
assert(renderToString(h('ul', null, items.map((i) => h('li', { key: i }, i)))) === '<ul><li>a</li><li>b</li><li>c</li></ul>', 'map');
assert(renderToString(h('p', null, [['x', ['y']], 'z'])) === '<p>xyz</p>', 'arrays nest');` },
    { name: "attributes_basic_and_renamed", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('a', { href: '/x', className: 'btn primary', id: 'go' }, 't')) === '<a href="/x" class="btn primary" id="go">t</a>', 'order and class');
assert(renderToString(h('label', { htmlFor: 'name' })) === '<label for="name"></label>', 'htmlFor');
assert(renderToString(h('input', { tabIndex: 3 })) === '<input tabIndex="3">', 'numbers become strings, other names kept');` },
    { name: "attribute_values_are_escaped", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('a', { title: 'say "hi" & <go>' })) === '<a title="say &quot;hi&quot; &amp; &lt;go&gt;"></a>', 'escaped');` },
    { name: "boolean_and_empty_attributes", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('button', { disabled: true, hidden: false, title: null, name: undefined }, 'x')) === '<button disabled>x</button>', 'true bare, others omitted');
assert(renderToString(h('input', { value: '', readOnly: true })) === '<input value="" readOnly>', 'empty string is kept');
assert(renderToString(h('p', { 'data-n': 0 })) === '<p data-n="0"></p>', 'zero is kept');` },
    { name: "handlers_key_ref_are_not_rendered", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('button', { onClick: () => {}, onChange: () => {}, key: 'k', ref: {}, type: 'button' }, 'x')) === '<button type="button">x</button>', 'only real attributes');
assert(renderToString(h('p', { once: 'yes' })) === '<p once="yes"></p>', 'a prop merely starting with on is kept');` },
    { name: "void_tags", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('br')) === '<br>' && renderToString(h('img', { src: 'a.png', alt: 'x' })) === '<img src="a.png" alt="x">', 'no closing tag');
assert(renderToString(h('input', { type: 'text' }, 'ignored')) === '<input type="text">', 'children ignored');
assert(renderToString(h('p', null, 'a', h('br'), 'b')) === '<p>a<br>b</p>', 'inline');` },
    { name: "style_objects", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('div', { style: { backgroundColor: 'red', fontSize: 12 } })) === '<div style="background-color:red;font-size:12px"></div>', 'kebab and px');
assert(renderToString(h('div', { style: { opacity: 0.5, zIndex: 3, lineHeight: 2, margin: 0 } })) === '<div style="opacity:0.5;z-index:3;line-height:2;margin:0"></div>', 'unitless and zero');
assert(renderToString(h('div', { style: { color: null, margin: false, padding: '' } })) === '<div></div>', 'nothing left, no attribute');
assert(renderToString(h('div', { style: { color: 'red', width: undefined } })) === '<div style="color:red"></div>', 'skips empty values');` },
    { name: "function_components_and_props", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
const Greeting = ({ name, excited }) => h('p', null, 'Hello, ', name, excited && '!');
assert(renderToString(h(Greeting, { name: 'Ann', excited: true })) === '<p>Hello, Ann!</p>', 'props');
assert(renderToString(h(Greeting, { name: 'Bob' })) === '<p>Hello, Bob</p>', 'missing prop');
assert(renderToString(h('div', null, h(Greeting, { name: 'A' }), h(Greeting, { name: 'B' }))) === '<div><p>Hello, A</p><p>Hello, B</p></div>', 'several');` },
    { name: "children_prop_and_composition", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
const Card = ({ title, children }) => h('section', { className: 'card' }, h('h2', null, title), h('div', null, children));
assert(renderToString(h(Card, { title: 'T' }, h('p', null, 'one'), h('p', null, 'two'))) === '<section class="card"><h2>T</h2><div><p>one</p><p>two</p></div></section>', 'children passed through');
assert(renderToString(h(Card, { title: 'T' })) === '<section class="card"><h2>T</h2><div></div></section>', 'no children');
let seen;
renderToString(h((props) => { seen = props; return null; }, { a: 1 }, 'x', 'y'));
assert(seen.a === 1 && Array.isArray(seen.children) && seen.children.length === 2, 'children is an array: ' + JSON.stringify(seen));` },
    { name: "components_can_nest_and_return_anything", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
const Item = ({ n }) => h('li', null, n);
const List = ({ items }) => h('ul', null, items.map((n) => h(Item, { key: n, n })));
assert(renderToString(h(List, { items: [1, 2] })) === '<ul><li>1</li><li>2</li></ul>', 'nested components');
assert(renderToString(h(() => null)) === '' && renderToString(h(() => 'text')) === 'text', 'null and string results');
assert(renderToString(h(() => ['a', h('b', null, 'c')])) === 'a<b>c</b>', 'array result');` },
    { name: "fragments", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h(Fragment, null, h('a'), 'x', h('b'))) === '<a></a>x<b></b>', 'fragment renders only children');
assert(renderToString(h('div', null, h(Fragment, null, 'a', 'b'), 'c')) === '<div>abc</div>', 'inside an element');` },
    { name: "dangerously_set_inner_html", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
assert(renderToString(h('div', { dangerouslySetInnerHTML: { __html: '<b>raw</b> & more' } })) === '<div><b>raw</b> & more</div>', 'raw');
assert(renderToString(h('div', { id: 'x', dangerouslySetInnerHTML: { __html: 'r' } })) === '<div id="x">r</div>', 'attributes still render');` },
    { name: "xss_attempt_is_neutralized", code: `const h = (type, props, ...children) => ({ type, props: props || {}, children });
const Fragment = Symbol.for('react.fragment');
const evil = '<script>alert(1)</script>';
assert(renderToString(h('div', null, evil)).indexOf('<script>') === -1, 'text');
assert(renderToString(h('a', { href: '" onmouseover="x' })).indexOf('" onmouseover="') === -1, 'attribute breakout');` },
  ],
  solution: {
    code: `function renderToString(node) {
  const VOID = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
  const UNITLESS = ['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order'];
  const NAMES = { className: 'class', htmlFor: 'for' };

  const escape = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

  function styleString(style) {
    return Object.entries(style)
      .filter(([, v]) => v !== null && v !== undefined && v !== false && v !== '')
      .map(([k, v]) => kebab(k) + ':' + (typeof v === 'number' && v !== 0 && !UNITLESS.includes(k) ? v + 'px' : v))
      .join(';');
  }

  function attributes(props) {
    let out = '';
    for (const [key, value] of Object.entries(props)) {
      if (['children', 'key', 'ref', 'dangerouslySetInnerHTML'].includes(key) || /^on[A-Z]/.test(key)) continue;
      if (value === null || value === undefined || value === false) continue;
      const name = NAMES[key] || key;
      if (value === true) {
        out += ' ' + name;
      } else if (key === 'style' && typeof value === 'object') {
        const css = styleString(value);
        if (css) out += ' style="' + escape(css) + '"';
      } else {
        out += ' ' + name + '="' + escape(value) + '"';
      }
    }
    return out;
  }

  function render(n) {
    if (n === null || n === undefined || typeof n === 'boolean') return '';
    if (Array.isArray(n)) return n.map(render).join('');
    if (typeof n === 'string' || typeof n === 'number') return escape(n);
    const { type, props = {}, children = [] } = n;
    if (type === Symbol.for('react.fragment')) return render(children);
    if (typeof type === 'function') return render(type({ ...props, children }));
    if (VOID.includes(type)) return '<' + type + attributes(props) + '>';
    const inner = props.dangerouslySetInnerHTML ? props.dangerouslySetInnerHTML.__html : render(children);
    return '<' + type + attributes(props) + '>' + inner + '</' + type + '>';
  }

  return render(node);
}

module.exports = renderToString;`,
    explanation:
      "Rendering is one recursive function with a case per kind of node. Components are just function calls whose result is rendered again, which is why composition works. Escaping every string and attribute value is what prevents injection, and dangerouslySetInnerHTML is named that way because it skips it.",
  },
};
