export default {
  slug: "nested-routes",
  trackId: "mern",
  layerId: "mern-4",
  type: "CODE",
  difficulty: "hard",
  title: "Resolve nested routes for <Outlet>",
  summary: "Turn a nested route config and a URL into the chain of matched routes (layouts, children, index routes) with merged params.",
  description:
    "Nested routes are how React Router renders a layout around a page: each matched route in the chain renders its element, and the child appears wherever the parent puts an <code>&lt;Outlet /&gt;</code>. Before anything renders, the router resolves the URL into that ordered chain. Build the resolver.",
  task:
    "Write <code>resolveMatches(routes, pathname)</code> returning an array of <code>{ route, params, pathname }</code> from the outermost route to the innermost, or <code>null</code> if nothing matches the whole URL.",
  constraints: [
    "Route shape: <code>{ path?, index?, children? }</code>. Paths are relative to the parent (top-level ones may start with <code>/</code>); segments are split on <code>/</code> ignoring empty ones. <code>:name</code> matches one segment (decoded with <code>decodeURIComponent</code>), a final <code>*</code> takes the rest as <code>params['*']</code>, static segments are case-insensitive.",
    "A route with no <code>path</code> (a layout route) matches without consuming anything. An <code>index</code> route matches only when the URL is fully consumed by its ancestors.",
    "The whole URL must be consumed. A route that has <code>children</code> only counts as matched if one of its children matches the rest (there's no match for a bare layout path without an index child).",
    "Among sibling routes try the more specific one first: score by own segment count + 10 per static + 3 per param, and -2 for <code>*</code>; ties keep declaration order. Index and layout routes (no segments) score by the same rule.",
    "Each match's <code>params</code> is the merge of everything matched so far (parents included); <code>pathname</code> is the URL consumed so far (<code>'/'</code> if nothing).",
  ],
  example: `resolveMatches([{ path: '/', id: 'root', children: [{ index: true, id: 'home' }] }], '/').map((m) => m.route.id) // ['root', 'home']`,
  tags: ["react-router", "routing", "recursion", "nested-routes"],
  estimatedMins: 50,
  xp: 80,
  starterFiles: [
    {
      name: "resolveMatches.js",
      lang: "js",
      code: `// resolveMatches.js
function resolveMatches(routes, pathname) {
  // your code here
}

module.exports = resolveMatches;`,
    },
  ],
  testFile: {
    name: "resolveMatches_test.js",
    lang: "test",
    code: `const resolveMatches = require('./resolveMatches');

test('index route', () => {
  const routes = [{ path: '/', id: 'root', children: [{ index: true, id: 'home' }] }];
  expect(resolveMatches(routes, '/').map((m) => m.route.id)).toEqual(['root', 'home']);
});

test('no match', () => {
  expect(resolveMatches([{ path: '/a' }], '/b')).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a recursive <code>branch(routes, segs, i, params, base)</code> that returns an array of matches for the rest of the URL starting at segment <code>i</code>, or <code>null</code>." },
    { order: 2, cost: 5, text: "For each candidate route (sorted by score): consume its own segments from <code>i</code>; if it has children, recurse from the new index and prepend yourself on success; if it is a leaf, it only matches when it consumed everything." },
    { order: 3, cost: 15, text: "An <code>index</code> route has no segments of its own: it matches iff <code>i === segs.length</code>. Sort a COPY of each sibling list (keep the original index for tie-breaking)." },
  ],
  hiddenTests: [
    { name: "index_and_nested_chain", code: `const routes = [{ path: '/', id: 'root', children: [
  { index: true, id: 'home' },
  { path: 'users', id: 'users', children: [{ index: true, id: 'list' }, { path: ':id', id: 'detail' }] },
] }];
const ids = (p) => { const r = resolveMatches(routes, p); return r && r.map((m) => m.route.id).join('>'); };
assert(ids('/') === 'root>home', '/: ' + ids('/'));
assert(ids('/users') === 'root>users>list', '/users: ' + ids('/users'));
assert(ids('/users/42') === 'root>users>detail', '/users/42: ' + ids('/users/42'));` },
    { name: "params_merge_down_the_chain", code: `const routes = [{ path: 'orgs/:org', id: 'org', children: [{ path: 'repos/:repo', id: 'repo' }] }];
const r = resolveMatches(routes, '/orgs/acme/repos/api');
assert(r.length === 2, 'two matches');
assert(JSON.stringify(r[0].params) === '{"org":"acme"}', 'parent params: ' + JSON.stringify(r[0].params));
assert(r[1].params.org === 'acme' && r[1].params.repo === 'api', 'child sees both: ' + JSON.stringify(r[1].params));` },
    { name: "pathname_accumulates", code: `const routes = [{ path: '/', id: 'root', children: [{ path: 'a', id: 'a', children: [{ path: 'b', id: 'b' }] }] }];
const r = resolveMatches(routes, '/a/b');
assert(r[0].pathname === '/', 'root: ' + r[0].pathname);
assert(r[1].pathname === '/a', 'a: ' + r[1].pathname);
assert(r[2].pathname === '/a/b', 'b: ' + r[2].pathname);` },
    { name: "pathless_layout_routes", code: `const routes = [{ id: 'layout', children: [{ path: 'a', id: 'a' }, { path: 'b', id: 'b' }] }];
const r = resolveMatches(routes, '/b');
assert(r.map((m) => m.route.id).join('>') === 'layout>b', 'got ' + r.map((m) => m.route.id));
assert(r[0].pathname === '/', 'layout consumes nothing');` },
    { name: "static_siblings_beat_params", code: `const routes = [{ path: '/', children: [{ path: ':slug', id: 'slug' }, { path: 'new', id: 'new' }] }];
const r = resolveMatches(routes, '/new');
assert(r[1].route.id === 'new', 'got ' + r[1].route.id);
const s = resolveMatches(routes, '/other');
assert(s[1].route.id === 'slug' && s[1].params.slug === 'other', 'param fallback');` },
    { name: "splat_catch_all_inside_a_layout", code: `const routes = [{ path: '/', id: 'root', children: [{ index: true, id: 'home' }, { path: 'about', id: 'about' }, { path: '*', id: 'nf' }] }];
const r = resolveMatches(routes, '/nope/deeper');
assert(r.map((m) => m.route.id).join('>') === 'root>nf', 'got ' + r.map((m) => m.route.id));
assert(r[1].params['*'] === 'nope/deeper', 'splat value: ' + r[1].params['*']);` },
    { name: "whole_url_must_be_consumed", code: `const routes = [{ path: '/', children: [{ index: true, id: 'home' }, { path: 'a', id: 'a' }] }];
assert(resolveMatches(routes, '/a/extra') === null, 'leftover segments');
assert(resolveMatches(routes, '/zzz') === null, 'unknown');
const noIndex = [{ path: 'orgs/:org', children: [{ path: 'repos', id: 'repos' }] }];
assert(resolveMatches(noIndex, '/orgs/acme') === null, 'layout path without an index child does not match on its own');` },
    { name: "slashes_case_and_decoding", code: `const routes = [{ path: '/', children: [{ path: 'Files/:name', id: 'f' }] }];
const r = resolveMatches(routes, '/files/my%20doc/');
assert(r && r[1].params.name === 'my doc', 'forgiving: ' + JSON.stringify(r && r[1].params));
assert(resolveMatches(routes, '/files/%E0%A4%A') === null, 'malformed escape');` },
    { name: "backtracks_when_a_child_fails", code: `const routes = [
  { path: 'a', id: 'a1', children: [{ path: 'x', id: 'x' }] },
  { path: ':any', id: 'any', children: [{ path: 'y', id: 'y' }] },
];
const r = resolveMatches(routes, '/a/y');
assert(r && r.map((m) => m.route.id).join('>') === 'any>y', 'falls back to the param branch: ' + (r && r.map((m) => m.route.id)));
assert(r[0].params.any === 'a', 'param value');` },
    { name: "tie_goes_to_first_declared", code: `const routes = [{ path: ':a', id: 'one' }, { path: ':b', id: 'two' }];
const r = resolveMatches(routes, '/x');
assert(r[0].route.id === 'one', 'first declared');` },
  ],
  solution: {
    code: `function segmentsOf(path) {
  return path.split('/').filter(Boolean);
}

function ownScore(route) {
  if (route.index || !route.path) return 0;
  const segs = segmentsOf(route.path);
  let score = segs.length;
  for (const s of segs) {
    if (s === '*') score -= 2;
    else if (s.startsWith(':')) score += 3;
    else score += 10;
  }
  return score;
}

function branch(routes, segs, i, params, base) {
  const ordered = routes
    .map((route, idx) => ({ route, idx, score: ownScore(route) }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx);

  for (const { route } of ordered) {
    if (route.index) {
      if (i === segs.length) return [{ route, params: { ...params }, pathname: base || '/' }];
      continue;
    }

    const own = route.path ? segmentsOf(route.path) : [];
    const local = {};
    let j = i;
    let ok = true;
    for (let k = 0; k < own.length; k++) {
      const seg = own[k];
      if (seg === '*') {
        local['*'] = segs.slice(j).join('/');
        j = segs.length;
        break;
      }
      if (j >= segs.length) { ok = false; break; }
      if (seg.startsWith(':')) {
        try {
          local[seg.slice(1)] = decodeURIComponent(segs[j]);
        } catch (e) {
          ok = false;
          break;
        }
      } else if (seg.toLowerCase() !== segs[j].toLowerCase()) {
        ok = false;
        break;
      }
      j++;
    }
    if (!ok) continue;

    const merged = { ...params, ...local };
    const consumed = segs.slice(i, j).join('/');
    const pathname = consumed ? base + '/' + consumed : base;
    const self = { route, params: merged, pathname: pathname || '/' };

    if (route.children && route.children.length) {
      const sub = branch(route.children, segs, j, merged, pathname);
      if (sub) return [self, ...sub];
    } else if (j === segs.length) {
      return [self];
    }
  }
  return null;
}

function resolveMatches(routes, pathname) {
  return branch(routes, segmentsOf(pathname), 0, {}, '');
}

module.exports = resolveMatches;`,
    explanation:
      "The resolver is a depth-first search: each route consumes some segments and either recurses into its children or must finish the URL. Returning null from a failed branch makes the caller try the next sibling, which is the backtracking that lets /a/y fall through from the static 'a' branch to the ':any' branch. Sorting siblings by score first is what gives static routes priority without depending on declaration order.",
  },
};
