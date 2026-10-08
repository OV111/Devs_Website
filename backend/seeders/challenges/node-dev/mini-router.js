export default {
  slug: "mini-router",
  trackId: "node-dev",
  layerId: "node-dev-4",
  type: "CODE",
  difficulty: "hard",
  title: "Build a router with priorities and 405",
  summary: "Register routes with params and wildcards, match the most specific one, and tell 404 from 405.",
  description:
    "Fastify's speed comes from its router (find-my-way). Even a simple router has to answer three questions: which route matches, which one wins when several do (static beats <code>:param</code> beats <code>*</code>), and whether to answer 404 or 405.",
  task:
    "Write <code>createRouter()</code> returning <code>{ add(method, pattern, handler), find(method, url) }</code>.",
  constraints: [
    "<code>find</code> returns <code>{ found: true, handler, params }</code>, <code>{ found: false, status: 404 }</code>, or <code>{ found: false, status: 405, allow }</code>.",
    "Methods are case-insensitive (store uppercase). Segments starting with <code>:</code> are params (URL-decoded); a final <code>*</code> segment matches the rest of the path (zero or more segments) and is returned as <code>params['*']</code> joined with <code>/</code>.",
    "When several routes of the right method match, the most specific wins, compared segment by segment from the left: static &gt; param &gt; wildcard. Backtracking matters: <code>/users/me/posts</code> must find <code>/users/:id/posts</code> even though <code>/users/me</code> also exists.",
    "If no route has the requested method but at least one route matches the path with another method, return 405 with <code>allow</code> as a sorted, de-duplicated array of methods. Otherwise 404.",
    "Ignore a trailing slash and any <code>?query</code>. Adding the same method and pattern shape twice (param names don't matter) throws <code>Error('Duplicate route: METHOD pattern')</code>.",
  ],
  example: `r.add('GET', '/users/:id', h); r.find('GET', '/users/7') // { found: true, handler: h, params: { id: '7' } }`,
  tags: ["routing","fastify","http","algorithms"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "createRouter.js",
      lang: "js",
      code: `// createRouter.js
function createRouter() {
  // your code here
}

module.exports = createRouter;`,
    },
  ],
  testFile: {
    name: "createRouter_test.js",
    lang: "test",
    code: `const createRouter = require('./createRouter');

test('param', () => {
  const r = createRouter(); const h = () => {}; r.add('GET', '/u/:id', h); expect(r.find('GET', '/u/5').params).toEqual({ id: '5' });
});

test('not_found', () => {
  expect(createRouter().find('GET', '/x')).toEqual({ found: false, status: 404 });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Store each route as <code>{ method, segs, handler }</code> where <code>segs</code> is the pattern split on <code>/</code> with empty pieces removed." },
    { order: 2, cost: 5, text: "Write <code>match(route, parts)</code> that returns a params object or <code>null</code>. Collect ALL matching routes first, then filter by method and sort by specificity: this is what gives you backtracking." },
    { order: 3, cost: 15, text: "Rank a segment as static = 2, param = 1, wildcard = 0, missing = -1, and compare two routes position by position." },
  ],
  hiddenTests: [
    { name: "static_route", code: `const r = createRouter(); const h = () => {}; r.add('GET', '/health', h);
const f = r.find('GET', '/health');
assert(f.found === true && f.handler === h && Object.keys(f.params).length === 0, 'static match');` },
    { name: "params_are_extracted_and_decoded", code: `const r = createRouter(); const h = () => {}; r.add('GET', '/users/:uid/posts/:pid', h);
const f = r.find('GET', '/users/7/posts/a%20b');
assert(f.found && f.params.uid === '7' && f.params.pid === 'a b', 'params: ' + JSON.stringify(f.params));` },
    { name: "method_is_case_insensitive_and_separate", code: `const r = createRouter(); const g = () => 'g'; const p = () => 'p';
r.add('get', '/x', g); r.add('POST', '/x', p);
assert(r.find('GET', '/x').handler === g && r.find('post', '/x').handler === p, 'each method has its handler');` },
    { name: "not_found_404", code: `const r = createRouter(); r.add('GET', '/a/b', () => {});
const f = r.find('GET', '/a/c');
assert(f.found === false && f.status === 404, '404');
assert(r.find('GET', '/a').status === 404 && r.find('GET', '/a/b/c').status === 404, 'length mismatch is 404');` },
    { name: "method_not_allowed_405_with_sorted_allow", code: `const r = createRouter();
r.add('POST', '/x', () => {}); r.add('DELETE', '/x', () => {}); r.add('GET', '/x', () => {});
const f = r.find('PUT', '/x');
assert(f.found === false && f.status === 405, '405');
assert(f.allow.join(',') === 'DELETE,GET,POST', 'allow: ' + f.allow);` },
    { name: "405_collects_methods_from_param_routes_too", code: `const r = createRouter();
r.add('GET', '/u/:id', () => {}); r.add('PATCH', '/u/me', () => {});
const f = r.find('DELETE', '/u/me');
assert(f.status === 405 && f.allow.join(',') === 'GET,PATCH', 'allow: ' + f.allow);` },
    { name: "static_beats_param", code: `const r = createRouter(); const s = () => 's'; const p = () => 'p';
r.add('GET', '/users/:id', p); r.add('GET', '/users/me', s);
assert(r.find('GET', '/users/me').handler === s, 'static wins regardless of registration order');
assert(r.find('GET', '/users/42').handler === p, 'param for the rest');` },
    { name: "backtracks_to_param_route", code: `const r = createRouter(); const a = () => 'a'; const b = () => 'b';
r.add('GET', '/users/me', a); r.add('GET', '/users/:id/posts', b);
const f = r.find('GET', '/users/me/posts');
assert(f.found && f.handler === b && f.params.id === 'me', 'must fall back to the param route');` },
    { name: "wildcard", code: `const r = createRouter(); const h = () => {};
r.add('GET', '/files/*', h);
assert(r.find('GET', '/files/a/b/c.txt').params['*'] === 'a/b/c.txt', 'rest of the path');
assert(r.find('GET', '/files').found === true && r.find('GET', '/files').params['*'] === '', 'zero segments');
assert(r.find('GET', '/other/x').found === false, 'other prefix');` },
    { name: "param_beats_wildcard_static_beats_both", code: `const r = createRouter(); const w = () => 'w'; const p = () => 'p'; const s = () => 's';
r.add('GET', '/f/*', w); r.add('GET', '/f/:name', p); r.add('GET', '/f/readme', s);
assert(r.find('GET', '/f/readme').handler === s, 'static');
assert(r.find('GET', '/f/other').handler === p, 'param');
assert(r.find('GET', '/f/a/b').handler === w, 'wildcard for deeper paths');` },
    { name: "trailing_slash_and_query_ignored", code: `const r = createRouter(); const h = () => {};
r.add('GET', '/a/:id', h);
assert(r.find('GET', '/a/1/?x=2').params.id === '1', 'both ignored');
assert(r.find('GET', '/a/1?x=2').found === true, 'query only');` },
    { name: "root_route", code: `const r = createRouter(); const h = () => {}; r.add('GET', '/', h);
assert(r.find('GET', '/').handler === h && r.find('GET', '').found === true, 'root');` },
    { name: "duplicate_routes_throw", code: `const r = createRouter(); r.add('GET', '/users/:id', () => {});
let err = null;
try { r.add('GET', '/users/:uid', () => {}); } catch (e) { err = e; }
assert(err && err.message === 'Duplicate route: GET /users/:uid', 'message: ' + (err && err.message));
let ok = true;
try { r.add('POST', '/users/:id', () => {}); } catch (e) { ok = false; }
assert(ok, 'same pattern with another method is fine');` },
  ],
  solution: {
    code: `function createRouter() {
  const routes = [];
  const split = (s) => s.split('?')[0].split('/').filter(Boolean);
  const shape = (segs) => segs.map((s) => (s.startsWith(':') ? ':' : s)).join('/');
  const rank = (seg) => (seg === undefined ? -1 : seg === '*' ? 0 : seg.startsWith(':') ? 1 : 2);

  function match(route, parts) {
    const params = {};
    for (let i = 0; i < route.segs.length; i++) {
      const seg = route.segs[i];
      if (seg === '*') {
        params['*'] = parts.slice(i).map(decodeURIComponent).join('/');
        return params;
      }
      if (i >= parts.length) return null;
      if (seg.startsWith(':')) params[seg.slice(1)] = decodeURIComponent(parts[i]);
      else if (seg !== parts[i]) return null;
    }
    return route.segs.length === parts.length ? params : null;
  }

  function moreSpecificFirst(a, b) {
    const n = Math.max(a.segs.length, b.segs.length);
    for (let i = 0; i < n; i++) {
      const diff = rank(b.segs[i]) - rank(a.segs[i]);
      if (diff !== 0) return diff;
    }
    return 0;
  }

  return {
    add(method, pattern, handler) {
      const m = method.toUpperCase();
      const segs = split(pattern);
      if (routes.some((r) => r.method === m && shape(r.segs) === shape(segs))) {
        throw new Error('Duplicate route: ' + m + ' ' + pattern);
      }
      routes.push({ method: m, segs, handler });
    },
    find(method, url) {
      const m = method.toUpperCase();
      const parts = split(url);
      const hits = [];
      for (const route of routes) {
        const params = match(route, parts);
        if (params) hits.push({ route, params });
      }
      const sameMethod = hits
        .filter((h) => h.route.method === m)
        .sort((a, b) => moreSpecificFirst(a.route, b.route));
      if (sameMethod.length > 0) {
        return { found: true, handler: sameMethod[0].route.handler, params: sameMethod[0].params };
      }
      if (hits.length > 0) {
        return { found: false, status: 405, allow: [...new Set(hits.map((h) => h.route.method))].sort() };
      }
      return { found: false, status: 404 };
    },
  };
}

module.exports = createRouter;`,
    explanation:
      "Matching and choosing are separate steps. match() answers 'does this route fit and with which params'; the router collects every route that fits and only then filters by method and sorts by specificity, which is what makes backtracking work. 405 is just 'it fit, but not for this method'.",
  },
};
