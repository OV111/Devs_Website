export default {
  slug: "conditional-get",
  trackId: "api-dev",
  layerId: "api-dev-7",
  type: "CODE",
  difficulty: "med",
  title: "Conditional GET: ETag and Last-Modified",
  summary: "Decide between 200 and 304 from If-None-Match and If-Modified-Since.",
  description:
    "A 304 Not Modified response sends no body: the browser reuses its cached copy. It's one of the cheapest performance wins in HTTP, and it hinges on comparing validators correctly.",
  task:
    "Write <code>evaluateConditional(req, resource)</code> returning a status code. <code>req</code> is <code>{ method, headers }</code> (lowercase header names). <code>resource</code> is <code>{ etag, lastModified }</code> with <code>lastModified</code> in epoch milliseconds.",
  constraints: [
    "If <code>if-none-match</code> is present it decides everything: a comma-separated list of ETags (or <code>*</code>) that matches the resource's ETag gives <code>304</code> for GET/HEAD and <code>412</code> for other methods; no match gives <code>200</code>.",
    "ETag comparison is weak: ignore a leading <code>W/</code> and surrounding spaces.",
    "Only if <code>if-none-match</code> is absent, for GET/HEAD, use <code>if-modified-since</code>: <code>304</code> if the resource was NOT modified after that date, compared at whole-second precision; an unparseable date is ignored.",
    "Anything else is <code>200</code>.",
  ],
  example: `evaluateConditional({ method: 'GET', headers: { 'if-none-match': '"abc"' } }, { etag: '"abc"', lastModified: 0 }) // 304`,
  tags: ["http","caching","performance"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "evaluateConditional.js",
      lang: "js",
      code: `// evaluateConditional.js
function evaluateConditional(req, resource) {
  // your code here
}

module.exports = evaluateConditional;`,
    },
  ],
  testFile: {
    name: "evaluateConditional_test.js",
    lang: "test",
    code: `const evaluateConditional = require('./evaluateConditional');

test('etag_match', () => {
  expect(evaluateConditional({ method: 'GET', headers: { 'if-none-match': '"a"' } }, { etag: '"a"', lastModified: 0 })).toBe(304);
});

test('no_headers', () => {
  expect(evaluateConditional({ method: 'GET', headers: {} }, { etag: '"a"', lastModified: 0 })).toBe(200);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Handle <code>if-none-match</code> first and <code>return</code> from that branch, so <code>if-modified-since</code> is never consulted when it is present." },
    { order: 2, cost: 5, text: "Normalise tags with <code>trim()</code> and <code>replace(/^W\\//, '')</code> before comparing." },
    { order: 3, cost: 15, text: "Divide milliseconds by 1000 and <code>Math.floor</code> both sides; HTTP dates have only second precision." },
  ],
  hiddenTests: [
    { name: "etag_match_get", code: `const r = evaluateConditional({ method: 'GET', headers: { 'if-none-match': '"v1"' } }, { etag: '"v1"', lastModified: 0 });
assert(r === 304, '304 on match');` },
    { name: "etag_mismatch", code: `const r = evaluateConditional({ method: 'GET', headers: { 'if-none-match': '"v0"' } }, { etag: '"v1"', lastModified: 0 });
assert(r === 200, 'full response');` },
    { name: "list_weak_and_star", code: `const res = { etag: '"v1"', lastModified: 0 };
assert(evaluateConditional({ method: 'GET', headers: { 'if-none-match': '"a", "v1" , "b"' } }, res) === 304, 'in list');
assert(evaluateConditional({ method: 'GET', headers: { 'if-none-match': 'W/"v1"' } }, res) === 304, 'weak');
assert(evaluateConditional({ method: 'GET', headers: { 'if-none-match': '*' } }, res) === 304, 'star');` },
    { name: "unsafe_method_gets_412", code: `const r = evaluateConditional({ method: 'PUT', headers: { 'if-none-match': '"v1"' } }, { etag: '"v1"', lastModified: 0 });
assert(r === 412, '412 for PUT');` },
    { name: "if_modified_since_not_modified", code: `const d = new Date('2024-01-01T00:00:00Z').getTime();
const r = evaluateConditional({ method: 'GET', headers: { 'if-modified-since': new Date(d).toUTCString() } }, { etag: '"x"', lastModified: d });
assert(r === 304, 'same second means not modified');` },
    { name: "if_modified_since_modified", code: `const d = new Date('2024-01-01T00:00:00Z').getTime();
const r = evaluateConditional({ method: 'GET', headers: { 'if-modified-since': new Date(d - 5000).toUTCString() } }, { etag: '"x"', lastModified: d });
assert(r === 200, 'changed after the date');` },
    { name: "second_precision", code: `const d = new Date('2024-01-01T00:00:00Z').getTime();
const r = evaluateConditional({ method: 'GET', headers: { 'if-modified-since': new Date(d).toUTCString() } }, { etag: '"x"', lastModified: d + 700 });
assert(r === 304, 'sub-second differences are ignored');` },
    { name: "etag_takes_precedence", code: `const d = new Date('2024-01-01T00:00:00Z').getTime();
const r = evaluateConditional({ method: 'GET', headers: { 'if-none-match': '"other"', 'if-modified-since': new Date(d).toUTCString() } }, { etag: '"x"', lastModified: d });
assert(r === 200, 'if-none-match decides, if-modified-since is ignored');` },
    { name: "invalid_date_ignored", code: `const r = evaluateConditional({ method: 'GET', headers: { 'if-modified-since': 'not a date' } }, { etag: '"x"', lastModified: 0 });
assert(r === 200, 'invalid date');` },
  ],
  solution: {
    code: `function evaluateConditional(req, resource) {
  const h = req.headers || {};
  const safe = req.method === 'GET' || req.method === 'HEAD';
  const strip = (e) => e.trim().replace(/^W\\//, '');
  const inm = h['if-none-match'];
  if (inm !== undefined) {
    const tags = inm.split(',').map(strip);
    const hit = tags.includes('*') || tags.includes(strip(resource.etag));
    if (!hit) return 200;
    return safe ? 304 : 412;
  }
  const ims = h['if-modified-since'];
  if (safe && ims !== undefined) {
    const t = Date.parse(ims);
    if (!Number.isNaN(t) && Math.floor(resource.lastModified / 1000) <= Math.floor(t / 1000)) return 304;
  }
  return 200;
}

module.exports = evaluateConditional;`,
    explanation:
      "ETag is the stronger validator, so when it is present it alone decides. Last-Modified is the fallback, compared at whole-second precision because HTTP dates cannot express milliseconds.",
  },
};
