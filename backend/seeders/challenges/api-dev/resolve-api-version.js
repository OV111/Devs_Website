export default {
  slug: "resolve-api-version",
  trackId: "api-dev",
  layerId: "api-dev-4",
  type: "CODE",
  difficulty: "med",
  title: "Resolve the API version of a request",
  summary: "Pick the version from the URL prefix, a header, or the Accept header, in that order.",
  description:
    "Versioning keeps old clients working while the API evolves. A router first has to work out which version the client asked for.",
  task:
    "Write <code>resolveVersion(req, supported, defaultVersion)</code>, where <code>req</code> is <code>{ path, headers }</code> (header names lowercase). Return <code>{ version, path }</code> or <code>null</code> if the version isn't in <code>supported</code>.",
  constraints: [
    "Priority: URL prefix <code>/v2/...</code>, then <code>accept-version: 2</code>, then <code>accept: application/vnd.api.v2+json</code>, then <code>defaultVersion</code>.",
    "When the version comes from the URL, <code>path</code> is returned without the prefix (<code>/v2</code> alone becomes <code>/</code>). Otherwise it is unchanged.",
    "<code>/v2users</code> and <code>/vx/a</code> are not version prefixes.",
    "<code>version</code> is a number.",
  ],
  example: `resolveVersion({ path: '/v2/users', headers: {} }, [1, 2], 1) // { version: 2, path: '/users' }`,
  tags: ["rest","versioning","api-design"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "resolveVersion.js",
      lang: "js",
      code: `// resolveVersion.js
function resolveVersion(req, supported, defaultVersion) {
  // your code here
}

module.exports = resolveVersion;`,
    },
  ],
  testFile: {
    name: "resolveVersion_test.js",
    lang: "test",
    code: `const resolveVersion = require('./resolveVersion');

test('url_prefix', () => {
  expect(resolveVersion({ path: '/v2/users', headers: {} }, [1, 2], 1)).toEqual({ version: 2, path: '/users' });
});

test('default', () => {
  expect(resolveVersion({ path: '/users', headers: {} }, [1, 2], 1).version).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Try the URL first with a regular expression anchored at the start: a slash, <code>v</code>, digits, then either a slash-rest or the end." },
    { order: 2, cost: 5, text: "Use an <code>else if</code> chain so a higher-priority source wins and the others are not even looked at." },
    { order: 3, cost: 15, text: "Check <code>supported.includes(version)</code> once, after the version is decided." },
  ],
  hiddenTests: [
    { name: "url_prefix_strips_path", code: `const r = resolveVersion({ path: '/v2/users/5', headers: {} }, [1, 2], 1);
assert(r.version === 2 && r.path === '/users/5', 'strip prefix');` },
    { name: "bare_version_path_is_root", code: `const r = resolveVersion({ path: '/v2', headers: {} }, [1, 2], 1);
assert(r.version === 2 && r.path === '/', 'root');` },
    { name: "not_a_prefix", code: `assert(resolveVersion({ path: '/v2users', headers: {} }, [1, 2], 1).path === '/v2users', 'v2users');
assert(resolveVersion({ path: '/vx/a', headers: {} }, [1, 2], 1).path === '/vx/a', 'vx');` },
    { name: "header_version", code: `const r = resolveVersion({ path: '/users', headers: { 'accept-version': '2' } }, [1, 2], 1);
assert(r.version === 2 && r.path === '/users', 'header, number type');` },
    { name: "accept_header_version", code: `const r = resolveVersion({ path: '/users', headers: { accept: 'application/vnd.api.v3+json' } }, [1, 2, 3], 1);
assert(r.version === 3, 'vendor media type');` },
    { name: "url_beats_header", code: `const r = resolveVersion({ path: '/v1/a', headers: { 'accept-version': '2' } }, [1, 2], 2);
assert(r.version === 1, 'URL first');` },
    { name: "header_beats_accept", code: `const r = resolveVersion({ path: '/a', headers: { 'accept-version': '1', accept: 'application/vnd.api.v2+json' } }, [1, 2], 2);
assert(r.version === 1, 'header before accept');` },
    { name: "default_and_unsupported", code: `assert(resolveVersion({ path: '/a', headers: {} }, [1, 2], 2).version === 2, 'default');
assert(resolveVersion({ path: '/v9/a', headers: {} }, [1, 2], 1) === null, 'unsupported is null');` },
  ],
  solution: {
    code: `function resolveVersion(req, supported, defaultVersion) {
  const headers = req.headers || {};
  let version = null;
  let path = req.path;
  const m = /^\\/v(\\d+)(\\/.*)?$/.exec(req.path);
  if (m) {
    version = Number(m[1]);
    path = m[2] || '/';
  } else if (headers['accept-version']) {
    version = Number(headers['accept-version']);
  } else if (headers.accept) {
    const a = /vnd\\.api\\.v(\\d+)/.exec(headers.accept);
    if (a) version = Number(a[1]);
  }
  if (version === null) version = defaultVersion;
  if (!supported.includes(version)) return null;
  return { version, path };
}

module.exports = resolveVersion;`,
    explanation:
      "An else-if chain encodes the priority order. The URL case also rewrites the path; the supported check happens once at the end.",
  },
};
