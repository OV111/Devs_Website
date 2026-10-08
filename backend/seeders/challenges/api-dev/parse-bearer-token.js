export default {
  slug: "parse-bearer-token",
  trackId: "api-dev",
  layerId: "api-dev-6",
  type: "CODE",
  difficulty: "easy",
  title: "Extract a Bearer token",
  summary: "Read the token out of an Authorization header, rejecting anything malformed.",
  description:
    "Protected routes read <code>Authorization: Bearer &lt;token&gt;</code>. Parsing it sloppily (split on space, take [1]) accepts garbage.",
  task:
    "Write <code>parseBearer(header)</code> returning the token string, or <code>null</code> if the header is not a valid Bearer header.",
  constraints: [
    "The scheme <code>Bearer</code> is case-insensitive.",
    "One or more spaces separate scheme and token; surrounding whitespace is ignored.",
    "The token must be non-empty and use only <code>A-Z a-z 0-9 - . _ ~ + /</code> optionally followed by <code>=</code> padding.",
    "Non-strings return <code>null</code>.",
  ],
  example: `parseBearer('Bearer abc.def.ghi') // 'abc.def.ghi'`,
  tags: ["auth","jwt","http"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "parseBearer.js",
      lang: "js",
      code: `// parseBearer.js
function parseBearer(header) {
  // your code here
}

module.exports = parseBearer;`,
    },
  ],
  testFile: {
    name: "parseBearer_test.js",
    lang: "test",
    code: `const parseBearer = require('./parseBearer');

test('valid', () => {
  expect(parseBearer('Bearer abc')).toBe('abc');
});

test('wrong_scheme', () => {
  expect(parseBearer('Basic abc')).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "A single anchored regular expression is the clearest way: scheme, spaces, token, end." },
    { order: 2, cost: 5, text: "Use the <code>i</code> flag for the scheme, and trim the header first." },
    { order: 3, cost: 15, text: "Check <code>typeof header === 'string'</code> before anything else." },
  ],
  hiddenTests: [
    { name: "valid_jwt_shape", code: `assert(parseBearer('Bearer aaa.bbb.ccc') === 'aaa.bbb.ccc', 'jwt');` },
    { name: "case_insensitive_scheme", code: `assert(parseBearer('bearer tok') === 'tok' && parseBearer('BEARER tok') === 'tok', 'scheme case');` },
    { name: "extra_whitespace", code: `assert(parseBearer('  Bearer    tok  ') === 'tok', 'trim and multiple spaces');` },
    { name: "wrong_scheme_or_missing_token", code: `assert(parseBearer('Basic abc') === null, 'basic');
assert(parseBearer('Bearer') === null && parseBearer('Bearer ') === null, 'no token');` },
    { name: "extra_parts_rejected", code: `assert(parseBearer('Bearer a b') === null, 'two tokens');` },
    { name: "bad_characters", code: `assert(parseBearer('Bearer a<b>') === null && parseBearer('Bearer a"b') === null, 'illegal characters');` },
    { name: "non_string", code: `assert(parseBearer(undefined) === null && parseBearer(null) === null && parseBearer(5) === null, 'not a string');` },
    { name: "padding_allowed", code: `assert(parseBearer('Bearer abc==') === 'abc==', 'base64 padding');` },
  ],
  solution: {
    code: `function parseBearer(header) {
  if (typeof header !== 'string') return null;
  const m = /^Bearer +([A-Za-z0-9\\-._~+\\/]+=*)$/i.exec(header.trim());
  return m ? m[1] : null;
}

module.exports = parseBearer;`,
    explanation:
      "One anchored regular expression defines the whole valid format, so anything that doesn't fit, including extra words or odd characters, is rejected.",
  },
};
