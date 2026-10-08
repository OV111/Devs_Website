export default {
  slug: "resolve-module",
  trackId: "node-dev",
  layerId: "node-dev-2",
  type: "CODE",
  difficulty: "hard",
  title: "Resolve require() like Node",
  summary: "Implement CommonJS module resolution: relative paths, extensions, index files, package main, node_modules lookup.",
  description:
    "When you write <code>require('./util')</code> or <code>require('lodash')</code>, Node runs a precise search algorithm. Knowing it explains 'Cannot find module' errors, why <code>index.js</code> works, and how node_modules nesting behaves.",
  task:
    "Write <code>resolveModule(request, fromDir, files)</code> returning the resolved absolute path, or <code>null</code>. <code>fromDir</code> is the absolute directory of the requiring file. <code>files</code> is an object mapping absolute file paths to their text (only <code>package.json</code> contents matter).",
  constraints: [
    "Core modules (<code>fs, path, http, https, os, crypto, events, stream, util, url, zlib, child_process</code>) return <code>'node:' + name</code>; a <code>node:</code>-prefixed request is returned unchanged. Core modules win over node_modules.",
    "Requests starting with <code>./</code>, <code>../</code>, <code>/</code>, or equal to <code>.</code>/<code>..</code> are paths: resolve against <code>fromDir</code>, normalizing <code>.</code> and <code>..</code>.",
    "Path or package <code>X</code>: first try as a file (<code>X</code>, <code>X.js</code>, <code>X.json</code>, in that order), then as a directory.",
    "Directory: if <code>X/package.json</code> has a string <code>main</code>, resolve it (as a file, then as an index); if that fails or there is no main, try <code>X/index.js</code>, then <code>X/index.json</code>. Invalid JSON in package.json is ignored.",
    "Bare requests (<code>lodash</code>, <code>chalk/lib/x</code>): look in <code>node_modules</code> of <code>fromDir</code>, then each parent up to <code>/</code>; nearest hit wins. Skip a directory that is itself named <code>node_modules</code> (no <code>node_modules/node_modules</code>).",
  ],
  example: `resolveModule('./util', '/app/src', { '/app/src/util.js': '' }) // '/app/src/util.js'`,
  tags: ["commonjs","modules","require","algorithms"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "resolveModule.js",
      lang: "js",
      code: `// resolveModule.js
function resolveModule(request, fromDir, files) {
  // your code here
}

module.exports = resolveModule;`,
    },
  ],
  testFile: {
    name: "resolveModule_test.js",
    lang: "test",
    code: `const resolveModule = require('./resolveModule');

test('adds_js', () => {
  expect(resolveModule('./util', '/app', { '/app/util.js': '' })).toBe('/app/util.js');
});

test('core', () => {
  expect(resolveModule('fs', '/app', {})).toBe('node:fs');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write small helpers: <code>norm(path)</code> (collapse <code>.</code> and <code>..</code>), <code>asFile(x)</code>, <code>asIndex(x)</code>, <code>asDir(x)</code>, and <code>load(x) = asFile(x) ?? asDir(x)</code>." },
    { order: 2, cost: 5, text: "For a bare request, build the candidate list by walking <code>fromDir</code> upward: <code>/a/b/node_modules/req</code>, <code>/a/node_modules/req</code>, <code>/node_modules/req</code>; return the first <code>load()</code> that hits." },
    { order: 3, cost: 15, text: "Use <code>Object.prototype.hasOwnProperty.call(files, p)</code> to test existence, and wrap <code>JSON.parse</code> of package.json in try/catch." },
  ],
  hiddenTests: [
    { name: "relative_with_extension_search", code: `const files = { '/app/src/util.js': '', '/app/src/data.json': '{}' };
assert(resolveModule('./util', '/app/src', files) === '/app/src/util.js', '.js added');
assert(resolveModule('./util.js', '/app/src', files) === '/app/src/util.js', 'exact name');
assert(resolveModule('./data', '/app/src', files) === '/app/src/data.json', '.json added');
assert(resolveModule('./missing', '/app/src', files) === null, 'not found');` },
    { name: "exact_before_js_before_json", code: `const files = { '/a/x': '', '/a/x.js': '', '/a/x.json': '', '/a/y.js': '', '/a/y.json': '' };
assert(resolveModule('./x', '/a', files) === '/a/x', 'exact first');
assert(resolveModule('./y', '/a', files) === '/a/y.js', '.js before .json');` },
    { name: "parent_and_absolute_paths", code: `const files = { '/app/util.js': '', '/app/src/lib/a.js': '' };
assert(resolveModule('../util', '/app/src', files) === '/app/util.js', '..');
assert(resolveModule('../../util', '/app/src/lib', files) === '/app/util.js', 'two levels up');
assert(resolveModule('/app/util', '/somewhere/else', files) === '/app/util.js', 'absolute');
assert(resolveModule('./a/../util', '/app', files) === '/app/util.js', 'dots inside path');` },
    { name: "directory_index", code: `const files = { '/app/lib/index.js': '', '/app/conf/index.json': '{}' };
assert(resolveModule('./lib', '/app', files) === '/app/lib/index.js', 'index.js');
assert(resolveModule('./conf', '/app', files) === '/app/conf/index.json', 'index.json');
assert(resolveModule('.', '/app/lib', files) === '/app/lib/index.js', 'dot is the current directory');` },
    { name: "file_beats_directory", code: `const files = { '/a/foo.js': '', '/a/foo/index.js': '' };
assert(resolveModule('./foo', '/a', files) === '/a/foo.js', 'file wins');` },
    { name: "package_main", code: `const files = { '/app/pkg/package.json': '{"main":"./main.js"}', '/app/pkg/main.js': '', '/app/pkg/index.js': '', '/app/p2/package.json': '{"main":"lib/entry"}', '/app/p2/lib/entry.js': '' };
assert(resolveModule('./pkg', '/app', files) === '/app/pkg/main.js', 'main beats index');
assert(resolveModule('./p2', '/app', files) === '/app/p2/lib/entry.js', 'main without extension');` },
    { name: "package_main_fallbacks", code: `const files = {
  '/app/a/package.json': '{"main":"gone.js"}', '/app/a/index.js': '',
  '/app/b/package.json': '{ not json', '/app/b/index.js': '',
  '/app/c/package.json': '{"name":"c"}', '/app/c/index.js': '',
  '/app/d/package.json': '{"main":"lib"}', '/app/d/lib/index.js': '',
};
assert(resolveModule('./a', '/app', files) === '/app/a/index.js', 'missing main falls back to index');
assert(resolveModule('./b', '/app', files) === '/app/b/index.js', 'invalid json ignored');
assert(resolveModule('./c', '/app', files) === '/app/c/index.js', 'no main field');
assert(resolveModule('./d', '/app', files) === '/app/d/lib/index.js', 'main may point at a directory');` },
    { name: "bare_request_node_modules", code: `const files = { '/app/node_modules/lodash/index.js': '', '/app/node_modules/chalk/package.json': '{"main":"lib/chalk.js"}', '/app/node_modules/chalk/lib/chalk.js': '' };
assert(resolveModule('lodash', '/app/src', files) === '/app/node_modules/lodash/index.js', 'walks up from src');
assert(resolveModule('chalk', '/app', files) === '/app/node_modules/chalk/lib/chalk.js', 'package main');
assert(resolveModule('nope', '/app', files) === null, 'unknown package');` },
    { name: "bare_subpath", code: `const files = { '/app/node_modules/pkg/lib/util.js': '' };
assert(resolveModule('pkg/lib/util', '/app', files) === '/app/node_modules/pkg/lib/util.js', 'subpath with extension search');` },
    { name: "nearest_node_modules_wins", code: `const files = { '/app/src/node_modules/x/index.js': '', '/app/node_modules/x/index.js': '', '/node_modules/y/index.js': '' };
assert(resolveModule('x', '/app/src', files) === '/app/src/node_modules/x/index.js', 'closest first');
assert(resolveModule('x', '/app', files) === '/app/node_modules/x/index.js', 'from parent');
assert(resolveModule('y', '/app/src/deep/er', files) === '/node_modules/y/index.js', 'walks all the way to root');` },
    { name: "skips_node_modules_inside_node_modules", code: `const files = { '/x/node_modules/node_modules/a/index.js': '', '/x/node_modules/a/index.js': '' };
assert(resolveModule('a', '/x/node_modules/b', files) === '/x/node_modules/a/index.js', 'sibling package found');
const only = { '/x/node_modules/node_modules/a/index.js': '' };
assert(resolveModule('a', '/x/node_modules/b', only) === null, 'node_modules/node_modules is never searched');` },
    { name: "core_modules", code: `const files = { '/app/node_modules/fs/index.js': '' };
assert(resolveModule('fs', '/app', files) === 'node:fs', 'core beats node_modules');
assert(resolveModule('node:test', '/app', {}) === 'node:test', 'node: prefix passes through');
assert(resolveModule('path', '/app', {}) === 'node:path' && resolveModule('child_process', '/app', {}) === 'node:child_process', 'others');` },
  ],
  solution: {
    code: `function resolveModule(request, fromDir, files) {
  const core = ['fs', 'path', 'http', 'https', 'os', 'crypto', 'events', 'stream', 'util', 'url', 'zlib', 'child_process'];
  if (request.startsWith('node:')) return request;
  if (core.includes(request)) return 'node:' + request;

  const norm = (p) => {
    const out = [];
    for (const seg of p.split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') out.pop();
      else out.push(seg);
    }
    return '/' + out.join('/');
  };
  const has = (p) => Object.prototype.hasOwnProperty.call(files, p);
  const asFile = (x) => [x, x + '.js', x + '.json'].find(has) ?? null;
  const asIndex = (x) => [x + '/index.js', x + '/index.json'].find(has) ?? null;
  const asDir = (x) => {
    const pkgPath = norm(x + '/package.json');
    if (has(pkgPath)) {
      let main;
      try {
        main = JSON.parse(files[pkgPath]).main;
      } catch (err) {
        main = undefined;
      }
      if (typeof main === 'string' && main) {
        const target = norm(x + '/' + main);
        const hit = asFile(target) ?? asIndex(target);
        if (hit) return hit;
      }
    }
    return asIndex(norm(x));
  };
  const load = (x) => asFile(x) ?? asDir(x);

  const isPath = request.startsWith('./') || request.startsWith('../') || request.startsWith('/') || request === '.' || request === '..';
  if (isPath) {
    return load(norm(request.startsWith('/') ? request : fromDir + '/' + request));
  }

  const parts = norm(fromDir).split('/').filter(Boolean);
  for (let i = parts.length; i >= 0; i--) {
    if (i > 0 && parts[i - 1] === 'node_modules') continue;
    const hit = load(norm('/' + parts.slice(0, i).join('/') + '/node_modules/' + request));
    if (hit) return hit;
  }
  return null;
}

module.exports = resolveModule;`,
    explanation:
      "The algorithm is three tiny functions (as file, as index, as directory) composed in a fixed order. Bare names just repeat the same load() at every node_modules directory up the tree, and the nearest hit wins.",
  },
};
