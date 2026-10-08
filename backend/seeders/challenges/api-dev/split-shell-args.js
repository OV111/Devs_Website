export default {
  slug: "split-shell-args",
  trackId: "api-dev",
  layerId: "api-dev-2",
  type: "CODE",
  difficulty: "med",
  title: "Split a command line into arguments",
  summary: "Tokenise a shell command the way bash does: spaces, quotes and backslashes.",
  description:
    "When you type <code>git commit -m \"fix bug\"</code>, the shell hands the program four arguments, not five. Splitting on spaces is wrong; this is the tokeniser that gets it right.",
  task:
    "Write <code>splitArgs(cmd)</code> returning an array of argument strings. Throw an <code>Error</code> if a quote is never closed.",
  constraints: [
    "Whitespace separates arguments, and extra whitespace is ignored.",
    "Single quotes keep everything literally; double quotes keep everything except that <code>\\\"</code> and <code>\\\\</code> are escapes.",
    "Outside quotes, a backslash makes the next character literal (so <code>a\\ b</code> is one argument).",
    "Adjacent pieces join into one argument; an empty quote pair <code>\"\"</code> is an empty-string argument.",
  ],
  example: `splitArgs('git commit -m "fix bug"')
// ['git', 'commit', '-m', 'fix bug']`,
  tags: ["linux", "shell", "parsing"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "splitArgs.js",
      lang: "js",
      code: `// splitArgs.js
function splitArgs(cmd) {
  // your code here
}

module.exports = splitArgs;`,
    },
  ],
  testFile: {
    name: "splitArgs_test.js",
    lang: "test",
    code: `const splitArgs = require('./splitArgs');

test('plain', () => {
  expect(splitArgs('ls -la /tmp')).toEqual(['ls', '-la', '/tmp']);
});

test('double_quotes', () => {
  expect(splitArgs('echo "hello world"')).toEqual(['echo', 'hello world']);
});

test('unclosed_throws', () => {
  expect(() => splitArgs('echo "oops')).toThrow();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Walk the string one character at a time, keeping a <code>current</code> token and a <code>quote</code> variable (null, <code>'</code> or <code>\"</code>)." },
    { order: 2, cost: 5, text: "Track whether you are 'inside a token' separately from <code>current.length</code>, so an empty <code>\"\"</code> still produces an argument." },
    { order: 3, cost: 15, text: "Whitespace outside quotes ends the token (if one is open). At the end, throw if a quote is still open, otherwise push the last token." },
  ],
  hiddenTests: [
    { name: "plain_and_extra_whitespace", code: `const r = splitArgs('  ls   -la  /tmp ');
assert(r.length === 3 && r[0] === 'ls' && r[1] === '-la' && r[2] === '/tmp', 'trim and collapse');` },
    { name: "double_and_single_quotes", code: `const r = splitArgs('echo "a b" \\'c d\\'');
assert(r.length === 3 && r[1] === 'a b' && r[2] === 'c d', 'quoted groups');` },
    { name: "adjacent_pieces_join", code: `const r = splitArgs('a"b c"d');
assert(r.length === 1 && r[0] === 'ab cd', 'one argument');` },
    { name: "empty_quotes_is_an_argument", code: `const r = splitArgs('echo ""');
assert(r.length === 2 && r[1] === '', 'empty string argument');` },
    { name: "backslash_escapes_space", code: `const r = splitArgs('cp my\\\\ file x');
assert(r.length === 3 && r[1] === 'my file', 'escaped space');` },
    { name: "escaped_quote_in_double_quotes", code: `const r = splitArgs('echo "say \\\\"hi\\\\""');
assert(r.length === 2 && r[1] === 'say "hi"', 'escaped inner quotes');` },
    { name: "quote_of_other_kind_is_literal", code: `const r = splitArgs('echo "it\\'s" \\'say "x"\\'');
assert(r[1] === "it's" && r[2] === 'say "x"', 'other quote kind is literal');` },
    { name: "unclosed_quote_throws", code: `let threw = false;
try { splitArgs('echo "oops'); } catch (e) { threw = true; }
assert(threw, 'must throw on an unclosed quote');` },
    { name: "empty_input", code: `assert(splitArgs('').length === 0 && splitArgs('   ').length === 0, 'no arguments');` },
  ],
  solution: {
    code: `function splitArgs(cmd) {
  const args = [];
  let cur = '';
  let inToken = false;
  let quote = null;
  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (quote) {
      if (c === quote) quote = null;
      else if (c === '\\\\' && quote === '"' && i + 1 < cmd.length && '"\\\\'.includes(cmd[i + 1])) cur += cmd[++i];
      else cur += c;
    } else if (c === '"' || c === "'") {
      quote = c;
      inToken = true;
    } else if (c === '\\\\' && i + 1 < cmd.length) {
      cur += cmd[++i];
      inToken = true;
    } else if (/\\s/.test(c)) {
      if (inToken) { args.push(cur); cur = ''; inToken = false; }
    } else {
      cur += c;
      inToken = true;
    }
  }
  if (quote) throw new Error('Unclosed quote');
  if (inToken) args.push(cur);
  return args;
}

module.exports = splitArgs;`,
    explanation:
      "A small state machine: the quote variable decides how each character is treated, and inToken records whether an argument has started, so an empty quote pair still counts.",
  },
};
