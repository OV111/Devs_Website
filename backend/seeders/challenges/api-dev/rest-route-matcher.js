export default {
  slug: "rest-route-matcher",
  trackId: "api-dev",
  layerId: "api-dev-1",
  type: "CODE",
  difficulty: "med",
  title: "Match a REST route",
  summary: "Match /users/42/posts against /users/:id/posts and extract the params.",
  description:
    "REST puts resources in the URL path. A router's core job is to decide whether a path matches a pattern and pull out the variable parts.",
  task:
    "Write <code>matchRoute(pattern, path)</code>. Return an object of params if the path matches, otherwise <code>null</code>.",
  constraints: [
    "A segment starting with <code>:</code> is a parameter; every other segment must match exactly (case-sensitive).",
    "Segment counts must be equal.",
    "Ignore a trailing slash and any <code>?query</code> on the path.",
    "Param values are URL-decoded.",
  ],
  example: `matchRoute('/users/:id/posts', '/users/42/posts') // { id: '42' }
matchRoute('/users/:id', '/posts/42')             // null`,
  tags: ["rest", "routing", "fundamentals"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "matchRoute.js",
      lang: "js",
      code: `// matchRoute.js
function matchRoute(pattern, path) {
  // your code here
}

module.exports = matchRoute;`,
    },
  ],
  testFile: {
    name: "matchRoute_test.js",
    lang: "test",
    code: `const matchRoute = require('./matchRoute');

test('extracts_param', () => {
  expect(matchRoute('/users/:id', '/users/42')).toEqual({ id: '42' });
});

test('no_match_is_null', () => {
  expect(matchRoute('/users/:id', '/posts/42')).toBe(null);
});

test('different_length_is_null', () => {
  expect(matchRoute('/users/:id', '/users/42/x')).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Split both strings on <code>/</code> and drop empty pieces; that handles the leading and trailing slash for free." },
    { order: 2, cost: 5, text: "Strip anything after <code>?</code> from the path before splitting." },
    { order: 3, cost: 15, text: "Walk both segment arrays together: <code>:name</code> stores the decoded value, anything else must be equal or you return <code>null</code>." },
  ],
  hiddenTests: [
    { name: "multiple_params", code: `const r = matchRoute('/users/:uid/posts/:pid', '/users/1/posts/9');
assert(r && r.uid === '1' && r.pid === '9', 'two params');` },
    { name: "static_match_returns_empty_object", code: `const r = matchRoute('/health', '/health');
assert(r !== null && Object.keys(r).length === 0, 'matches with no params');` },
    { name: "static_mismatch", code: `assert(matchRoute('/users/:id/posts', '/users/1/likes') === null, 'last segment differs');` },
    { name: "length_mismatch", code: `assert(matchRoute('/users/:id', '/users') === null, 'too short');
assert(matchRoute('/users/:id', '/users/1/x') === null, 'too long');` },
    { name: "trailing_slash_and_query_ignored", code: `const r = matchRoute('/users/:id', '/users/7/?tab=a');
assert(r && r.id === '7', 'ignore trailing slash and query');` },
    { name: "decodes_values", code: `const r = matchRoute('/tags/:name', '/tags/a%20b');
assert(r && r.name === 'a b', 'decode the param');` },
    { name: "case_sensitive", code: `assert(matchRoute('/Users/:id', '/users/1') === null, 'static segments are case-sensitive');` },
    { name: "root", code: `const r = matchRoute('/', '/');
assert(r !== null && Object.keys(r).length === 0, 'root matches root');` },
  ],
  solution: {
    code: `function matchRoute(pattern, path) {
  const split = (s) => s.split('?')[0].split('/').filter(Boolean);
  const p = split(pattern);
  const u = split(path);
  if (p.length !== u.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(u[i]);
    else if (p[i] !== u[i]) return null;
  }
  return params;
}

module.exports = matchRoute;`,
    explanation:
      "Both strings become segment lists, so slashes and the query string stop mattering. Then it's a pairwise walk: parameter segments capture, static ones must be equal.",
  },
};
