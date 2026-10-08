export default {
  slug: "match-routes",
  trackId: "mern",
  layerId: "mern-4",
  type: "CODE",
  difficulty: "med",
  title: "React Router v6 route ranking",
  summary: "Match a pathname against route patterns with params and splats, picking the best match the way React Router v6 does.",
  description:
    "React Router v6 dropped 'first match wins' for route ranking: <code>/users/new</code> beats <code>/users/:id</code> no matter which is declared first, and a splat is the last resort. Implement the matcher and the scoring behind it.",
  task:
    "Write <code>matchRoutes(routes, pathname)</code>. <code>routes</code> is an array of <code>{ path, ...anything }</code>. Return <code>{ route, params }</code> for the best match, or <code>null</code>.",
  constraints: [
    "Split patterns and pathnames on <code>/</code> and ignore empty segments, so trailing and doubled slashes don't matter and <code>'/'</code> has no segments.",
    "A <code>:name</code> segment matches exactly one segment and stores it in <code>params.name</code> via <code>decodeURIComponent</code>; if decoding throws, that route doesn't match. A <code>*</code> segment (last only) matches the rest, including nothing, stored as <code>params['*']</code> (segments re-joined with <code>/</code>). Static segments compare case-insensitively.",
    "Score each matching route: number of segments, plus 10 per static segment, plus 3 per <code>:param</code>, minus 2 for a <code>*</code> (the segment itself still counts 1 in the length). The highest score wins; on a tie the route that comes FIRST in the array wins.",
    "A route without a pattern segment count equal to the path (and no splat) does not match.",
  ],
  example: `matchRoutes([{ path: '/users/:id' }, { path: '/users/new' }], '/users/new').route.path // '/users/new'`,
  tags: ["react-router", "routing", "algorithms"],
  estimatedMins: 35,
  xp: 55,
  starterFiles: [
    {
      name: "matchRoutes.js",
      lang: "js",
      code: `// matchRoutes.js
function matchRoutes(routes, pathname) {
  // your code here
}

module.exports = matchRoutes;`,
    },
  ],
  testFile: {
    name: "matchRoutes_test.js",
    lang: "test",
    code: `const matchRoutes = require('./matchRoutes');

test('extracts params', () => {
  const m = matchRoutes([{ path: '/users/:id' }], '/users/42');
  expect(m.params).toEqual({ id: '42' });
});

test('static beats param', () => {
  const m = matchRoutes([{ path: '/users/:id' }, { path: '/users/new' }], '/users/new');
  expect(m.route.path).toBe('/users/new');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a helper that tries ONE route against the path segments and returns <code>{ params, score }</code> or <code>null</code>; then pick the best with a loop." },
    { order: 2, cost: 5, text: "Walk the pattern segments with an index <code>i</code>. On <code>*</code> grab <code>segs.slice(i)</code> and stop; otherwise require <code>i &lt; segs.length</code>. After the loop (no splat) the path must be fully consumed." },
    { order: 3, cost: 15, text: "Only replace the current best when the new score is STRICTLY greater: that keeps the earlier route on ties for free." },
  ],
  hiddenTests: [
    { name: "static_and_param_matching", code: `const routes = [{ path: '/' }, { path: '/about' }, { path: '/users/:id' }];
assert(matchRoutes(routes, '/').route.path === '/', 'root');
assert(matchRoutes(routes, '/about').route.path === '/about', 'static');
const m = matchRoutes(routes, '/users/42');
assert(m.route.path === '/users/:id' && m.params.id === '42', 'param: ' + JSON.stringify(m));` },
    { name: "no_match_returns_null", code: `assert(matchRoutes([{ path: '/a' }], '/b') === null, 'different');
assert(matchRoutes([{ path: '/a/:id' }], '/a') === null, 'too short');
assert(matchRoutes([{ path: '/a' }], '/a/b') === null, 'too long');
assert(matchRoutes([], '/') === null, 'no routes');` },
    { name: "slashes_and_case_are_forgiving", code: `const routes = [{ path: '/Users/List' }];
assert(matchRoutes(routes, '/users/list/') !== null, 'trailing slash and case');
assert(matchRoutes(routes, '//users//list') !== null, 'doubled slashes');
assert(matchRoutes([{ path: 'a/b' }], '/a/b') !== null, 'pattern without leading slash');` },
    { name: "params_are_decoded", code: `const m = matchRoutes([{ path: '/files/:name' }], '/files/my%20file.txt');
assert(m.params.name === 'my file.txt', 'got ' + (m && m.params.name));
assert(matchRoutes([{ path: '/files/:name' }], '/files/%E0%A4%A') === null, 'malformed escape does not match');` },
    { name: "static_beats_param_regardless_of_order", code: `const a = matchRoutes([{ path: '/users/:id' }, { path: '/users/new' }], '/users/new');
const b = matchRoutes([{ path: '/users/new' }, { path: '/users/:id' }], '/users/new');
assert(a.route.path === '/users/new' && b.route.path === '/users/new', 'both orders');` },
    { name: "param_beats_splat_and_splat_is_last_resort", code: `const routes = [{ path: '*' }, { path: '/docs/*' }, { path: '/docs/:page' }];
assert(matchRoutes(routes, '/docs/intro').route.path === '/docs/:page', 'param over splats');
assert(matchRoutes(routes, '/docs/a/b').route.path === '/docs/*', 'longer splat over bare *');
assert(matchRoutes(routes, '/zzz').route.path === '*', 'catch-all');` },
    { name: "splat_captures_the_rest", code: `const m = matchRoutes([{ path: '/files/*' }], '/files/a/b/c');
assert(m.params['*'] === 'a/b/c', 'got ' + m.params['*']);
const empty = matchRoutes([{ path: '/files/*' }], '/files');
assert(empty && empty.params['*'] === '', 'splat may be empty');` },
    { name: "ties_go_to_the_first_route", code: `const m = matchRoutes([{ path: '/:a', id: 1 }, { path: '/:b', id: 2 }], '/x');
assert(m.route.id === 1 && m.params.a === 'x', 'first wins: ' + JSON.stringify(m));` },
    { name: "route_objects_are_returned_untouched", code: `const route = { path: '/x', element: 'X' };
const m = matchRoutes([route], '/x');
assert(m.route === route, 'same object');` },
  ],
  solution: {
    code: `function segmentsOf(path) {
  return path.split('/').filter(Boolean);
}

function tryMatch(pattern, pathSegs) {
  const segs = segmentsOf(pattern);
  const params = {};
  let score = segs.length;
  let i = 0;
  for (; i < segs.length; i++) {
    const seg = segs[i];
    if (seg === '*') {
      params['*'] = pathSegs.slice(i).join('/');
      score -= 2;
      return { params, score };
    }
    if (i >= pathSegs.length) return null;
    if (seg.startsWith(':')) {
      try {
        params[seg.slice(1)] = decodeURIComponent(pathSegs[i]);
      } catch (e) {
        return null;
      }
      score += 3;
    } else {
      if (seg.toLowerCase() !== pathSegs[i].toLowerCase()) return null;
      score += 10;
    }
  }
  return i === pathSegs.length ? { params, score } : null;
}

function matchRoutes(routes, pathname) {
  const pathSegs = segmentsOf(pathname);
  let best = null;
  for (const route of routes) {
    const m = tryMatch(route.path, pathSegs);
    if (m && (best === null || m.score > best.score)) best = { route, params: m.params, score: m.score };
  }
  return best && { route: best.route, params: best.params };
}

module.exports = matchRoutes;`,
    explanation:
      "Ranking replaces declaration order with a score: every static segment is worth far more than a param, and a splat is penalised, so the most specific route always wins. Because only a strictly higher score replaces the best, ties fall back to declaration order without extra code. This is why React Router v6 lets you reorder routes freely.",
  },
};
