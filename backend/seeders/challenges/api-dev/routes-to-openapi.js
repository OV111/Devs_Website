export default {
  slug: "routes-to-openapi",
  trackId: "api-dev",
  layerId: "api-dev-8",
  type: "CODE",
  difficulty: "med",
  title: "Generate an OpenAPI document from routes",
  summary: "Turn a list of Express-style routes into an OpenAPI 3.0 paths object.",
  description:
    "OpenAPI is the standard way to document a REST API, and tools like Swagger UI render it. Much of the document can be generated from the routes themselves.",
  task:
    "Write <code>buildOpenApi(info, routes)</code> returning <code>{ openapi: '3.0.3', info, paths }</code>. A route is <code>{ method, path, summary?, query?, responses? }</code>.",
  constraints: [
    "Convert <code>:id</code> in paths to <code>{id}</code> and add a path parameter <code>{ name, in: 'path', required: true, schema: { type: 'string' } }</code> for each.",
    "<code>query</code> is a list of <code>{ name, type?, required? }</code>; each becomes an <code>in: 'query'</code> parameter (type default 'string', required default false).",
    "<code>responses</code> is a map from status code to description, becoming <code>{ [code]: { description } }</code>; default is <code>{ 200: 'OK' }</code>.",
    "The method key is lowercase; routes sharing a path share one path item; <code>summary</code> defaults to <code>''</code>.",
    "Path parameters come before query parameters.",
  ],
  example: `buildOpenApi({ title: 'T', version: '1' }, [{ method: 'GET', path: '/users/:id' }]).paths['/users/{id}'].get.parameters[0].name // 'id'`,
  tags: ["openapi","swagger","documentation"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "buildOpenApi.js",
      lang: "js",
      code: `// buildOpenApi.js
function buildOpenApi(info, routes) {
  // your code here
}

module.exports = buildOpenApi;`,
    },
  ],
  testFile: {
    name: "buildOpenApi_test.js",
    lang: "test",
    code: `const buildOpenApi = require('./buildOpenApi');

test('path_conversion', () => {
  const d = buildOpenApi({}, [{ method: 'GET', path: '/u/:id' }]); expect(Object.keys(d.paths)).toEqual(['/u/{id}']);
});

test('version', () => {
  expect(buildOpenApi({}, []).openapi).toBe('3.0.3');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Use <code>path.replace(/:([A-Za-z0-9_]+)/g, '{$1}')</code> for the path and <code>matchAll</code> with the same pattern to find the parameter names." },
    { order: 2, cost: 5, text: "Build <code>parameters</code> as path params first, then the query params." },
    { order: 3, cost: 15, text: "Create <code>paths[openPath]</code> if missing, then add the lowercase method to it so two methods on one path merge." },
  ],
  hiddenTests: [
    { name: "envelope", code: `const d = buildOpenApi({ title: 'T', version: '1' }, []);
assert(d.openapi === '3.0.3' && d.info.title === 'T' && Object.keys(d.paths).length === 0, 'envelope');` },
    { name: "path_conversion_and_param", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/users/:id' }]);
const op = d.paths['/users/{id}'].get;
assert(op, 'converted path and lowercase method');
assert(op.parameters.length === 1 && op.parameters[0].name === 'id' && op.parameters[0].in === 'path' && op.parameters[0].required === true && op.parameters[0].schema.type === 'string', 'path parameter');` },
    { name: "multiple_path_params", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/u/:uid/posts/:pid' }]);
const names = d.paths['/u/{uid}/posts/{pid}'].get.parameters.map((p) => p.name).join(',');
assert(names === 'uid,pid', 'both params: ' + names);` },
    { name: "query_params_after_path_params", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/users/:id', query: [{ name: 'limit', type: 'integer' }, { name: 'q', required: true }] }]);
const p = d.paths['/users/{id}'].get.parameters;
assert(p.length === 3 && p[0].in === 'path', 'path first');
assert(p[1].name === 'limit' && p[1].in === 'query' && p[1].schema.type === 'integer' && p[1].required === false, 'typed optional');
assert(p[2].name === 'q' && p[2].schema.type === 'string' && p[2].required === true, 'default type, required');` },
    { name: "default_and_custom_responses", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/a' }, { method: 'POST', path: '/b', responses: { 201: 'Created', 400: 'Bad input' } }]);
assert(d.paths['/a'].get.responses['200'].description === 'OK', 'default 200');
const r = d.paths['/b'].post.responses;
assert(r['201'].description === 'Created' && r['400'].description === 'Bad input', 'custom');
assert(!('200' in r), 'no default when custom given');` },
    { name: "same_path_merges_methods", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/users' }, { method: 'POST', path: '/users', summary: 'Create' }]);
assert(Object.keys(d.paths).length === 1, 'one path item');
assert(d.paths['/users'].get && d.paths['/users'].post.summary === 'Create', 'both methods');` },
    { name: "summary_default", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/a' }]);
assert(d.paths['/a'].get.summary === '', 'empty string');` },
    { name: "static_route_has_empty_parameters", code: `const d = buildOpenApi({}, [{ method: 'GET', path: '/health' }]);
assert(Array.isArray(d.paths['/health'].get.parameters) && d.paths['/health'].get.parameters.length === 0, 'empty array');` },
  ],
  solution: {
    code: `function buildOpenApi(info, routes) {
  const paths = {};
  for (const r of routes) {
    const openPath = r.path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
    const parameters = [];
    for (const m of r.path.matchAll(/:([A-Za-z0-9_]+)/g)) {
      parameters.push({ name: m[1], in: 'path', required: true, schema: { type: 'string' } });
    }
    for (const q of r.query || []) {
      parameters.push({ name: q.name, in: 'query', required: !!q.required, schema: { type: q.type || 'string' } });
    }
    const responses = {};
    for (const [code, description] of Object.entries(r.responses || { 200: 'OK' })) {
      responses[code] = { description };
    }
    if (!paths[openPath]) paths[openPath] = {};
    paths[openPath][r.method.toLowerCase()] = { summary: r.summary || '', parameters, responses };
  }
  return { openapi: '3.0.3', info, paths };
}

module.exports = buildOpenApi;`,
    explanation:
      "The same regular expression is used twice: to rewrite :id into {id}, and to discover the path parameters. Path items are keyed by the converted path, so several methods on one URL merge naturally.",
  },
};
