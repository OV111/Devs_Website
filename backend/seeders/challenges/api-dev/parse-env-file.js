export default {
  slug: "parse-env-file",
  trackId: "api-dev",
  layerId: "api-dev-2",
  type: "CODE",
  difficulty: "med",
  title: "Parse a .env file",
  summary: "Turn the text of a .env file into an object of environment variables.",
  description:
    "Every backend reads config from environment variables, and a <code>.env</code> file is how you set them locally. Libraries like dotenv are small parsers; write one.",
  task:
    "Write <code>parseEnv(text)</code> that returns an object of <code>KEY: value</code> strings.",
  constraints: [
    "Skip blank lines and lines starting with <code>#</code>; both <code>\\n</code> and <code>\\r\\n</code> line endings work.",
    "An optional <code>export </code> prefix is allowed.",
    "Split at the FIRST <code>=</code>; keys and unquoted values are trimmed.",
    "Matching single or double quotes around a value are removed; inside double quotes, the two characters <code>\\n</code> become a real newline.",
    "An unquoted value loses an inline comment (whitespace then <code>#</code>); a quoted value keeps its <code>#</code>.",
    "Lines without <code>=</code> are ignored; later duplicates win.",
  ],
  example: `parseEnv('PORT=3000\\n# db\\nexport DB="a b" # local')
// { PORT: '3000', DB: 'a b' }`,
  tags: ["env", "config", "parsing"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "parseEnv.js",
      lang: "js",
      code: `// parseEnv.js
function parseEnv(text) {
  // your code here
}

module.exports = parseEnv;`,
    },
  ],
  testFile: {
    name: "parseEnv_test.js",
    lang: "test",
    code: `const parseEnv = require('./parseEnv');

test('basic_pairs', () => {
  expect(parseEnv('A=1\\nB=two')).toEqual({ A: '1', B: 'two' });
});

test('skips_comments_and_blanks', () => {
  expect(parseEnv('# hi\\n\\nA=1')).toEqual({ A: '1' });
});

test('strips_quotes', () => {
  expect(parseEnv('A="x y"')).toEqual({ A: 'x y' });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Loop over lines; trim each; <code>continue</code> on blank or <code>#</code> lines." },
    { order: 2, cost: 5, text: "Use <code>indexOf('=')</code> so a value like a database URL with <code>=</code> in it survives." },
    { order: 3, cost: 15, text: "Check for quotes first. Only if the value is NOT quoted, strip a trailing <code>\\s+#.*</code> comment." },
  ],
  hiddenTests: [
    { name: "basic_pairs", code: `const r = parseEnv('A=1\\nB=two');
assert(r.A === '1' && r.B === 'two', 'two pairs');` },
    { name: "comments_and_blanks", code: `const r = parseEnv('# c\\n\\n  \\nA=1\\n#B=2');
assert(Object.keys(r).length === 1 && r.A === '1', 'only A');` },
    { name: "export_prefix", code: `assert(parseEnv('export A=1').A === '1', 'export is stripped');` },
    { name: "quotes_stripped", code: `const r = parseEnv('A="hello world"\\nB=\\'x y\\'');
assert(r.A === 'hello world' && r.B === 'x y', 'quotes removed');` },
    { name: "inline_comment", code: `const r = parseEnv('A=val # note\\nB="a # b"');
assert(r.A === 'val', 'unquoted comment stripped');
assert(r.B === 'a # b', 'quoted # kept');` },
    { name: "equals_in_value", code: `const r = parseEnv('URL=postgres://u:p@h/db?x=1');
assert(r.URL === 'postgres://u:p@h/db?x=1', 'split only at first =');` },
    { name: "double_quote_newline_escape", code: `const r = parseEnv('K="a\\\\nb"\\nL=\\'a\\\\nb\\'');
assert(r.K === 'a\\nb', 'double quotes expand \\\\n');
assert(r.L === 'a\\\\nb', 'single quotes stay literal');` },
    { name: "crlf_and_empty_and_duplicates", code: `const r = parseEnv('A=1\\r\\nEMPTY=\\r\\nA=2\\r\\nnoequals');
assert(r.A === '2', 'later wins');
assert(r.EMPTY === '', 'empty value');
assert(!('noequals' in r), 'line without = ignored');` },
  ],
  solution: {
    code: `function parseEnv(text) {
  const out = {};
  for (let line of text.split(/\\r?\\n/)) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();
    const i = line.indexOf('=');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    const q = value[0];
    if ((q === '"' || q === "'") && value.length >= 2 && value.endsWith(q)) {
      value = value.slice(1, -1);
      if (q === '"') value = value.replace(/\\\\n/g, '\\n');
    } else {
      value = value.replace(/\\s+#.*$/, '');
    }
    if (key) out[key] = value;
  }
  return out;
}

module.exports = parseEnv;`,
    explanation:
      "Each line is cleaned, split at its first =, then the value is treated differently depending on whether it is quoted. Quotes decide whether a # starts a comment.",
  },
};
