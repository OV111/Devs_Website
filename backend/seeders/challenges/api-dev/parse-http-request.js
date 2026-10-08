export default {
  slug: "parse-http-request",
  trackId: "api-dev",
  layerId: "api-dev-1",
  type: "CODE",
  difficulty: "med",
  title: "Parse a raw HTTP request",
  summary: "Turn the text a browser sends over TCP into a method, path, query, headers and body.",
  description:
    "An HTTP request is just text: a request line, header lines, a blank line, then the body. Every web framework starts by parsing it.",
  task:
    "Write <code>parseRequest(raw)</code> that returns <code>{ method, path, query, headers, body }</code>. Lines are separated by <code>\\r\\n</code>; a blank line ends the headers.",
  constraints: [
    "Header names are returned lowercase; values are trimmed.",
    "Only split a header at its FIRST colon (<code>Host: a.com:8080</code> is valid).",
    "<code>query</code> is an object of decoded key/value strings, <code>{}</code> if there is none.",
    "<code>body</code> is the text after the blank line, or <code>''</code> if absent.",
  ],
  example: `parseRequest("GET /users?id=5 HTTP/1.1\\r\\nHost: a.com\\r\\n\\r\\n")
// { method: 'GET', path: '/users', query: { id: '5' },
//   headers: { host: 'a.com' }, body: '' }`,
  tags: ["http", "parsing", "fundamentals"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "parseRequest.js",
      lang: "js",
      code: `// parseRequest.js
function parseRequest(raw) {
  // your code here
}

module.exports = parseRequest;`,
    },
  ],
  testFile: {
    name: "parseRequest_test.js",
    lang: "test",
    code: `const parseRequest = require('./parseRequest');

test('parses_request_line', () => {
  const r = parseRequest("GET /a HTTP/1.1\\r\\nHost: x.com\\r\\n\\r\\n");
  expect(r.method).toBe('GET');
  expect(r.path).toBe('/a');
});

test('lowercases_headers', () => {
  const r = parseRequest("GET / HTTP/1.1\\r\\nContent-Type: text/plain\\r\\n\\r\\n");
  expect(r.headers['content-type']).toBe('text/plain');
});

test('reads_body', () => {
  const r = parseRequest("POST / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\nhello");
  expect(r.body).toBe('hello');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Split the head from the body at the first <code>\\r\\n\\r\\n</code> before doing anything else." },
    { order: 2, cost: 5, text: "For each header line use <code>indexOf(':')</code> rather than <code>split(':')</code>, so a port number in the value survives." },
    { order: 3, cost: 15, text: "Split the target on the first <code>?</code>; then split the rest on <code>&amp;</code> and <code>=</code> and run <code>decodeURIComponent</code>." },
  ],
  hiddenTests: [
    {
      name: "method_path_query",
      code: `const r = parseRequest("GET /users?id=5&name=a%20b HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n");
assert(r.method === 'GET' && r.path === '/users', 'method and path');
assert(r.query.id === '5' && r.query.name === 'a b', 'query must be decoded');`,
    },
    {
      name: "no_query_is_empty_object",
      code: `const r = parseRequest("GET /x HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n");
assert(JSON.stringify(r.query) === '{}', 'query should be {}');`,
    },
    {
      name: "headers_lowercase_and_trimmed",
      code: `const r = parseRequest("GET / HTTP/1.1\\r\\nContent-Type:   text/html  \\r\\nX-Id: 7\\r\\n\\r\\n");
assert(r.headers['content-type'] === 'text/html', 'trim value, lowercase name');
assert(r.headers['x-id'] === '7', 'second header');`,
    },
    {
      name: "colon_in_header_value",
      code: `const r = parseRequest("GET / HTTP/1.1\\r\\nHost: a.com:8080\\r\\n\\r\\n");
assert(r.headers.host === 'a.com:8080', 'only split at the first colon');`,
    },
    {
      name: "body_after_blank_line",
      code: `const r = parseRequest("POST /a HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n{\\"a\\":1}");
assert(r.body === '{"a":1}', 'body text');`,
    },
    {
      name: "body_may_contain_blank_lines",
      code: `const r = parseRequest("POST /a HTTP/1.1\\r\\nHost: x\\r\\n\\r\\nline1\\r\\n\\r\\nline2");
assert(r.body === 'line1\\r\\n\\r\\nline2', 'only the FIRST blank line ends the headers');`,
    },
    {
      name: "no_body_is_empty_string",
      code: `const r = parseRequest("GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n");
assert(r.body === '', 'missing body must be an empty string');`,
    },
  ],
  solution: {
    code: `function parseRequest(raw) {
  const sep = raw.indexOf('\\r\\n\\r\\n');
  const head = sep === -1 ? raw : raw.slice(0, sep);
  const body = sep === -1 ? '' : raw.slice(sep + 4);
  const [start, ...lines] = head.split('\\r\\n');
  const [method, target] = start.split(' ');
  const qi = target.indexOf('?');
  const path = qi === -1 ? target : target.slice(0, qi);
  const query = {};
  if (qi !== -1) {
    for (const pair of target.slice(qi + 1).split('&')) {
      if (!pair) continue;
      const [k, ...v] = pair.split('=');
      query[decodeURIComponent(k)] = decodeURIComponent(v.join('='));
    }
  }
  const headers = {};
  for (const line of lines) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return { method, path, query, headers, body };
}

module.exports = parseRequest;`,
    explanation:
      "Cut the text at the first blank line into head and body, then read the request line, then each header at its first colon. Cutting the head first is what lets a body contain blank lines or colons safely.",
  },
};
