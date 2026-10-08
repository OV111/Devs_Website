export default {
  slug: "parse-url",
  trackId: "api-dev",
  layerId: "api-dev-1",
  type: "CODE",
  difficulty: "easy",
  title: "Parse a URL by hand",
  summary: "Split a URL into scheme, host, port, path, query and hash without the URL class.",
  description:
    "Before a request is sent, the client must work out where to connect: which host (DNS), which port, which path. That all comes from the URL.",
  task:
    "Write <code>parseUrl(url)</code> returning <code>{ scheme, host, port, path, query, hash }</code>, or <code>null</code> if the URL has no <code>scheme://</code>.",
  constraints: [
    "Do not use the <code>URL</code> class.",
    "<code>scheme</code> and <code>host</code> are lowercase.",
    "<code>port</code> is a number; default 80 for http, 443 for https, otherwise <code>null</code>.",
    "<code>path</code> defaults to <code>'/'</code>; <code>query</code> and <code>hash</code> exclude the <code>?</code> and <code>#</code> and default to <code>''</code>.",
  ],
  example: `parseUrl("https://Example.com/a/b?x=1#top")
// { scheme:'https', host:'example.com', port:443,
//   path:'/a/b', query:'x=1', hash:'top' }`,
  tags: ["http", "dns", "urls", "fundamentals"],
  estimatedMins: 20,
  xp: 25,
  starterFiles: [
    {
      name: "parseUrl.js",
      lang: "js",
      code: `// parseUrl.js
function parseUrl(url) {
  // your code here
}

module.exports = parseUrl;`,
    },
  ],
  testFile: {
    name: "parseUrl_test.js",
    lang: "test",
    code: `const parseUrl = require('./parseUrl');

test('basic_https', () => {
  const u = parseUrl('https://a.com/x');
  expect(u.scheme).toBe('https');
  expect(u.host).toBe('a.com');
  expect(u.port).toBe(443);
  expect(u.path).toBe('/x');
});

test('explicit_port', () => {
  expect(parseUrl('http://a.com:8080/').port).toBe(8080);
});

test('no_scheme_is_null', () => {
  expect(parseUrl('a.com/x')).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "A URL is <code>scheme://authority path ?query #hash</code>. Peel the parts off in that order." },
    { order: 2, cost: 5, text: "One regular expression with groups can capture every part; the authority ends at the first <code>/</code>, <code>?</code> or <code>#</code>." },
    { order: 3, cost: 15, text: "Split the authority into host and optional <code>:port</code> with a second small regex, then look up the default port by scheme." },
  ],
  hiddenTests: [
    { name: "full_url", code: `const u = parseUrl('https://Example.com/a/b?x=1#top');
assert(u.scheme === 'https' && u.host === 'example.com', 'scheme and lowercase host');
assert(u.port === 443 && u.path === '/a/b' && u.query === 'x=1' && u.hash === 'top', 'rest');` },
    { name: "default_ports", code: `assert(parseUrl('http://a.com').port === 80, 'http 80');
assert(parseUrl('https://a.com').port === 443, 'https 443');
assert(parseUrl('ftp://a.com').port === null, 'unknown scheme is null');` },
    { name: "explicit_port_is_number", code: `const u = parseUrl('http://a.com:3000/x');
assert(u.port === 3000 && typeof u.port === 'number', 'port must be a number');
assert(u.host === 'a.com', 'host excludes port');` },
    { name: "path_defaults_to_slash", code: `assert(parseUrl('http://a.com').path === '/', 'bare host');
assert(parseUrl('http://a.com?x=1').path === '/', 'query without path');` },
    { name: "query_and_hash_defaults", code: `const u = parseUrl('http://a.com/p');
assert(u.query === '' && u.hash === '', 'empty strings');` },
    { name: "hash_without_query", code: `const u = parseUrl('http://a.com/p#frag');
assert(u.query === '' && u.hash === 'frag', 'hash only');` },
    { name: "no_scheme_returns_null", code: `assert(parseUrl('a.com/x') === null, 'null');
assert(parseUrl('//a.com') === null, 'null');` },
  ],
  solution: {
    code: `function parseUrl(url) {
  const m = /^([a-z][a-z0-9+.-]*):\\/\\/([^/?#]*)([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$/i.exec(url);
  if (!m) return null;
  const scheme = m[1].toLowerCase();
  const pm = /^(.*?)(?::(\\d+))?$/.exec(m[2]);
  const defaults = { http: 80, https: 443 };
  return {
    scheme,
    host: pm[1].toLowerCase(),
    port: pm[2] ? Number(pm[2]) : (defaults[scheme] ?? null),
    path: m[3] || '/',
    query: m[4] ?? '',
    hash: m[5] ?? '',
  };
}

module.exports = parseUrl;`,
    explanation:
      "The first regex cuts the URL into scheme, authority, path, query and hash. The second splits the authority into host and port. The port falls back to the scheme's default.",
  },
};
