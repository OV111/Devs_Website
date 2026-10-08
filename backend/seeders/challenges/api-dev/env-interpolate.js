export default {
  slug: "env-interpolate",
  trackId: "api-dev",
  layerId: "api-dev-10",
  type: "CODE",
  difficulty: "med",
  title: "Interpolate variables like Docker Compose",
  summary: "Expand ${VAR}, ${VAR:-default}, ${VAR:?error} and $$ in a config string.",
  description:
    "Docker Compose files and shell scripts substitute environment variables with defaults and required-checks. Writing the expander shows how a single regular expression and a replace callback do the whole job.",
  task:
    "Write <code>interpolate(template, env)</code> returning the expanded string.",
  constraints: [
    "<code>${VAR}</code> becomes the value, or an empty string if unset.",
    "<code>${VAR:-d}</code> uses <code>d</code> when VAR is unset OR empty; <code>${VAR-d}</code> only when unset.",
    "<code>${VAR:?msg}</code> throws an <code>Error(msg)</code> when VAR is unset or empty; <code>${VAR?msg}</code> only when unset. With no message, use <code>VAR is required</code>.",
    "<code>$$</code> becomes a literal <code>$</code>.",
    "Expansion is a single pass: a value containing <code>${...}</code> is not expanded again. Plain <code>$VAR</code> without braces is left alone.",
  ],
  example: `interpolate('port=\${PORT:-3000}', {}) // 'port=3000'`,
  tags: ["docker","config","parsing","env"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "interpolate.js",
      lang: "js",
      code: `// interpolate.js
function interpolate(template, env) {
  // your code here
}

module.exports = interpolate;`,
    },
  ],
  testFile: {
    name: "interpolate_test.js",
    lang: "test",
    code: `const interpolate = require('./interpolate');

test('plain', () => {
  expect(interpolate('hi $$', {})).toBe('hi $');
});

test('no_placeholders', () => {
  expect(interpolate('abc', { A: '1' })).toBe('abc');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "One regular expression with groups can match both <code>$$</code> and the braced forms: name, optional operator (<code>:-</code>, <code>-</code>, <code>:?</code>, <code>?</code>), optional argument up to <code>}</code>." },
    { order: 2, cost: 5, text: "Use <code>template.replace(regex, callback)</code>; one pass means substituted values are never re-scanned." },
    { order: 3, cost: 15, text: "Compute <code>unset = value === undefined</code> and <code>empty = unset || value === ''</code>; the colon variants test <code>empty</code>, the others test <code>unset</code>." },
  ],
  hiddenTests: [
    { name: "simple_substitution", code: `const S = '$' + '{';
assert(interpolate('host=' + S + 'HOST}:' + S + 'PORT}', { HOST: 'db', PORT: '5432' }) === 'host=db:5432', 'two variables');` },
    { name: "unset_is_empty_string", code: `const S = '$' + '{';
assert(interpolate('a' + S + 'MISSING}b', {}) === 'ab', 'empty');` },
    { name: "colon_dash_default_for_unset_or_empty", code: `const S = '$' + '{';
assert(interpolate(S + 'P:-3000}', {}) === '3000', 'unset');
assert(interpolate(S + 'P:-3000}', { P: '' }) === '3000', 'empty');
assert(interpolate(S + 'P:-3000}', { P: '80' }) === '80', 'set');` },
    { name: "dash_default_only_for_unset", code: `const S = '$' + '{';
assert(interpolate(S + 'P-3000}', {}) === '3000', 'unset');
assert(interpolate('[' + S + 'P-3000}]', { P: '' }) === '[]', 'empty stays empty');` },
    { name: "default_may_be_empty_or_contain_symbols", code: `const S = '$' + '{';
assert(interpolate('[' + S + 'P:-}]', {}) === '[]', 'empty default');
assert(interpolate(S + 'URL:-http://localhost:3000/x}', {}) === 'http://localhost:3000/x', 'symbols in default');` },
    { name: "required_with_message", code: `const S = '$' + '{';
let msg = null;
try { interpolate(S + 'DB:?set DB first}', {}); } catch (e) { msg = e.message; }
assert(msg === 'set DB first', 'message: ' + msg);
let msg2 = null;
try { interpolate(S + 'DB:?}', {}); } catch (e) { msg2 = e.message; }
assert(msg2 === 'DB is required', 'default message: ' + msg2);
let msg3 = null;
try { interpolate(S + 'DB:?x}', { DB: '' }); } catch (e) { msg3 = e.message; }
assert(msg3 === 'x', 'empty counts as missing for :?');` },
    { name: "question_variant_only_unset", code: `const S = '$' + '{';
let threw = false;
try { interpolate(S + 'DB?x}', {}); } catch (e) { threw = true; }
assert(threw, 'unset throws');
assert(interpolate('[' + S + 'DB?x}]', { DB: '' }) === '[]', 'empty is allowed for ?');
assert(interpolate(S + 'DB:?x}', { DB: 'ok' }) === 'ok', 'set passes');` },
    { name: "dollar_escape", code: `const S = '$' + '{';
assert(interpolate('cost: $$5', {}) === 'cost: $5', 'escaped dollar');
assert(interpolate('$$' + S + 'X}', { X: '1' }) === '$1', 'escape then variable');` },
    { name: "single_pass_and_bare_dollar", code: `const S = '$' + '{';
assert(interpolate(S + 'A}', { A: S + 'B}', B: 'no' }) === S + 'B}', 'no re-expansion');
assert(interpolate('$HOME and $1', { HOME: 'x' }) === '$HOME and $1', 'bare $VAR untouched');` },
  ],
  solution: {
    code: `function interpolate(template, env) {
  const pattern = /\\$(\\$|\\{([A-Za-z_][A-Za-z0-9_]*)(?:(:?[-?])([^}]*))?\\})/g;
  return template.replace(pattern, (match, escaped, name, op, arg) => {
    if (escaped === '$') return '$';
    const value = env[name];
    const unset = value === undefined;
    const empty = unset || value === '';
    if (op === ':-') return empty ? arg : value;
    if (op === '-') return unset ? arg : value;
    if (op === ':?' || op === '?') {
      if (op === ':?' ? empty : unset) throw new Error(arg || name + ' is required');
      return value;
    }
    return unset ? '' : value;
  });
}

module.exports = interpolate;`,
    explanation:
      "One global regex plus a replace callback does everything. The colon variants treat empty like unset; the plain ones only treat unset as missing. Because replace is a single left-to-right pass, substituted values are never scanned again.",
  },
};
