export default {
  slug: "cors-origin-matcher",
  trackId: "api-dev",
  layerId: "api-dev-6",
  type: "CODE",
  difficulty: "med",
  title: "Match a CORS origin safely",
  summary: "Allow exact origins and *.example.com wildcards without letting look-alike domains through.",
  description:
    "A CORS allow-list that uses <code>endsWith('example.com')</code> also allows <code>evilexample.com</code>. Origin matching is a classic place for security bugs.",
  task:
    "Write <code>isOriginAllowed(origin, allowList)</code> returning true or false.",
  constraints: [
    "An entry is an exact origin (<code>https://app.example.com</code>), a wildcard (<code>https://*.example.com</code>), or <code>*</code>.",
    "A wildcard matches subdomains only, never the apex domain, and the subdomain part may only contain letters, digits, hyphens and dots.",
    "Scheme and port must match exactly; a missing, null or empty origin is never allowed.",
  ],
  example: `isOriginAllowed('https://a.example.com', ['https://*.example.com']) // true`,
  tags: ["security","cors","express"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "isOriginAllowed.js",
      lang: "js",
      code: `// isOriginAllowed.js
function isOriginAllowed(origin, allowList) {
  // your code here
}

module.exports = isOriginAllowed;`,
    },
  ],
  testFile: {
    name: "isOriginAllowed_test.js",
    lang: "test",
    code: `const isOriginAllowed = require('./isOriginAllowed');

test('exact', () => {
  expect(isOriginAllowed('https://a.com', ['https://a.com'])).toBe(true);
});

test('lookalike', () => {
  expect(isOriginAllowed('https://evilexample.com', ['https://*.example.com'])).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "For a wildcard entry, split it at <code>*.</code> into a prefix (the scheme) and a suffix (<code>.example.com</code>)." },
    { order: 2, cost: 5, text: "The origin must start with the prefix and end with the suffix; the part in between is the subdomain." },
    { order: 3, cost: 15, text: "Validate that middle part with a pattern like <code>^[a-z0-9-]+(\\.[a-z0-9-]+)*$</code>; this blocks tricks with <code>/</code> or <code>@</code>." },
  ],
  hiddenTests: [
    { name: "exact_match", code: `assert(isOriginAllowed('https://app.example.com', ['https://app.example.com']) === true, 'exact');
assert(isOriginAllowed('https://other.com', ['https://app.example.com']) === false, 'other');` },
    { name: "scheme_and_port_must_match", code: `assert(isOriginAllowed('http://app.example.com', ['https://app.example.com']) === false, 'scheme');
assert(isOriginAllowed('https://app.example.com:3000', ['https://app.example.com']) === false, 'port');` },
    { name: "wildcard_subdomain", code: `const l = ['https://*.example.com'];
assert(isOriginAllowed('https://a.example.com', l) === true, 'one label');
assert(isOriginAllowed('https://a.b.example.com', l) === true, 'two labels');` },
    { name: "wildcard_not_apex", code: `assert(isOriginAllowed('https://example.com', ['https://*.example.com']) === false, 'apex');` },
    { name: "lookalike_domains", code: `const l = ['https://*.example.com'];
assert(isOriginAllowed('https://evilexample.com', l) === false, 'suffix trick');
assert(isOriginAllowed('https://example.com.evil.com', l) === false, 'prefix trick');` },
    { name: "tricky_origins", code: `const l = ['https://*.example.com'];
assert(isOriginAllowed('https://evil.com/.example.com', l) === false, 'slash');
assert(isOriginAllowed('https://evil.com@x.example.com', l) === false, 'at sign');
assert(isOriginAllowed('https://.example.com', l) === false, 'empty label');` },
    { name: "star_allows_any", code: `assert(isOriginAllowed('https://anything.io', ['*']) === true, 'star');` },
    { name: "bad_origin_values", code: `assert(isOriginAllowed(undefined, ['*']) === false && isOriginAllowed(null, ['*']) === false && isOriginAllowed('', ['*']) === false, 'missing origin');` },
  ],
  solution: {
    code: `function isOriginAllowed(origin, allowList) {
  if (typeof origin !== 'string' || origin === '') return false;
  return allowList.some((entry) => {
    if (entry === '*') return true;
    const star = entry.indexOf('*.');
    if (star === -1) return entry === origin;
    const prefix = entry.slice(0, star);
    const suffix = entry.slice(star + 1);
    if (!origin.startsWith(prefix) || !origin.endsWith(suffix)) return false;
    const middle = origin.slice(prefix.length, origin.length - suffix.length);
    return /^[a-z0-9-]+(\\.[a-z0-9-]+)*$/i.test(middle);
  });
}

module.exports = isOriginAllowed;`,
    explanation:
      "Wildcards are matched by prefix and suffix, and the part in between must look like a plain subdomain. The suffix starts with a dot, so evilexample.com can't match.",
  },
};
