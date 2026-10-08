export default {
  slug: "parse-cache-control",
  trackId: "api-dev",
  layerId: "api-dev-1",
  type: "CODE",
  difficulty: "easy",
  title: "Parse a Cache-Control header",
  summary: "Turn 'public, max-age=3600, no-cache' into an object a cache can act on.",
  description:
    "HTTP headers carry the rules of the conversation. Cache-Control tells browsers and CDNs how long they may reuse a response.",
  task:
    "Write <code>parseCacheControl(header)</code> returning an object of directives.",
  constraints: [
    "Directive names are lowercase keys.",
    "A directive with no value (<code>no-cache</code>) becomes <code>true</code>.",
    "A purely numeric value becomes a number; a quoted value loses its quotes.",
    "Empty or missing header returns <code>{}</code>.",
  ],
  example: `parseCacheControl('public, max-age=3600')
// { public: true, 'max-age': 3600 }`,
  tags: ["http", "headers", "caching"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "parseCacheControl.js",
      lang: "js",
      code: `// parseCacheControl.js
function parseCacheControl(header) {
  // your code here
}

module.exports = parseCacheControl;`,
    },
  ],
  testFile: {
    name: "parseCacheControl_test.js",
    lang: "test",
    code: `const parse = require('./parseCacheControl');

test('flag_and_number', () => {
  expect(parse('public, max-age=60')).toEqual({ public: true, 'max-age': 60 });
});

test('empty_is_object', () => {
  expect(parse('')).toEqual({});
});

test('lowercases_names', () => {
  expect(parse('No-Cache')).toEqual({ 'no-cache': true });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Split on commas, trim each part, and skip empty ones." },
    { order: 2, cost: 5, text: "Use <code>indexOf('=')</code>: not found means a flag, found means name and value." },
    { order: 3, cost: 15, text: "Convert the value last: strip surrounding quotes, otherwise turn digit-only strings into numbers with a digits-only regex check." },
  ],
  hiddenTests: [
    { name: "flags_and_values", code: `const r = parseCacheControl('public, max-age=3600, no-cache');
assert(r.public === true && r['no-cache'] === true, 'flags');
assert(r['max-age'] === 3600, 'number value');` },
    { name: "empty_and_missing", code: `assert(Object.keys(parseCacheControl('')).length === 0, 'empty string');
assert(Object.keys(parseCacheControl(undefined)).length === 0, 'undefined');` },
    { name: "case_insensitive_names", code: `const r = parseCacheControl('Max-Age=10, NO-STORE');
assert(r['max-age'] === 10 && r['no-store'] === true, 'lowercase keys');` },
    { name: "spaces_tolerated", code: `const r = parseCacheControl('  public ,   max-age = 5 ');
assert(r.public === true && r['max-age'] === 5, 'extra whitespace');` },
    { name: "quoted_value", code: `const r = parseCacheControl('private="set-cookie"');
assert(r.private === 'set-cookie', 'strip quotes');` },
    { name: "non_numeric_stays_string", code: `const r = parseCacheControl('community=ui');
assert(r.community === 'ui', 'string value');` },
    { name: "trailing_comma", code: `const r = parseCacheControl('public,');
assert(r.public === true && Object.keys(r).length === 1, 'ignore empty part');` },
  ],
  solution: {
    code: `function parseCacheControl(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const i = p.indexOf('=');
    if (i === -1) { out[p.toLowerCase()] = true; continue; }
    const key = p.slice(0, i).trim().toLowerCase();
    let value = p.slice(i + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (/^\\d+$/.test(value)) value = Number(value);
    out[key] = value;
  }
  return out;
}

module.exports = parseCacheControl;`,
    explanation:
      "Split into directives, classify each as flag or key=value, then normalise the value. Quoted values stay strings; bare digits become numbers.",
  },
};
