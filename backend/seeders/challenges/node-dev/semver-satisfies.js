export default {
  slug: "semver-satisfies",
  trackId: "node-dev",
  layerId: "node-dev-2",
  type: "CODE",
  difficulty: "hard",
  title: "Does this version satisfy the npm range?",
  summary: "Implement ^, ~, comparison operators, x-ranges, AND (space) and OR (||) from package.json.",
  description:
    "Every dependency in <code>package.json</code> is a range such as <code>^1.2.3</code> or <code>&gt;=2 &lt;3</code>. npm uses the same rules to decide which installed version is acceptable.",
  task:
    "Write <code>satisfies(version, range)</code> returning a boolean. <code>version</code> is <code>MAJOR.MINOR.PATCH</code>.",
  constraints: [
    "Alternatives are separated by <code>||</code>; within one, space-separated comparators must ALL match.",
    "Comparators: <code>^</code>, <code>~</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>=</code> or none, and <code>*</code>/empty for anything. The operators <code>&gt;= &lt;= &gt; &lt;</code> require a full <code>x.y.z</code> (else throw).",
    "Caret keeps the leftmost non-zero part: <code>^1.2.3</code> = <code>&gt;=1.2.3 &lt;2.0.0</code>, <code>^0.2.3</code> = <code>&gt;=0.2.3 &lt;0.3.0</code>, <code>^0.0.3</code> = <code>&gt;=0.0.3 &lt;0.0.4</code>. Tilde allows patch changes: <code>~1.2.3</code> = <code>&gt;=1.2.3 &lt;1.3.0</code>; <code>~1</code> = <code>&gt;=1.0.0 &lt;2.0.0</code>.",
    "Partial or wildcard versions (<code>1</code>, <code>1.2</code>, <code>1.x</code>, <code>1.2.*</code>) match the whole span: <code>1.2</code> = <code>&gt;=1.2.0 &lt;1.3.0</code>. Missing parts count as 0 for <code>^</code> and <code>~</code> lower bounds.",
    "A pre-release version (<code>1.2.3-beta</code>) never satisfies. Throw an <code>Error</code> for an invalid version or an unparseable range.",
  ],
  example: `satisfies('1.4.0', '^1.2.3') // true; satisfies('2.0.0', '^1.2.3') // false`,
  tags: ["npm","semver","package.json","parsing"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "satisfies.js",
      lang: "js",
      code: `// satisfies.js
function satisfies(version, range) {
  // your code here
}

module.exports = satisfies;`,
    },
  ],
  testFile: {
    name: "satisfies_test.js",
    lang: "test",
    code: `const satisfies = require('./satisfies');

test('caret', () => {
  expect(satisfies('1.4.0', '^1.2.3')).toBe(true);
});

test('caret_major', () => {
  expect(satisfies('2.0.0', '^1.2.3')).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Convert each comparator into a predicate over a <code>[major, minor, patch]</code> triple; write one <code>cmp(a, b)</code> that returns a negative, zero or positive number." },
    { order: 2, cost: 5, text: "Parse the version part into only its specified numbers (stop at the first missing or wildcard part): that array's length decides the upper bound for <code>^</code>, <code>~</code> and bare partial versions." },
    { order: 3, cost: 15, text: "Combine: <code>range.split('||').some(alt =&gt; alt.split(/\\s+/).every(token =&gt; predicate(token)(v)))</code>." },
  ],
  hiddenTests: [
    { name: "exact_and_equals", code: `assert(satisfies('1.2.3', '1.2.3') === true, 'exact');
assert(satisfies('1.2.4', '1.2.3') === false, 'other patch');
assert(satisfies('1.2.3', '=1.2.3') === true, 'equals sign');` },
    { name: "caret_rules", code: `assert(satisfies('1.2.3', '^1.2.3') && satisfies('1.9.9', '^1.2.3'), 'inside');
assert(!satisfies('1.2.2', '^1.2.3') && !satisfies('2.0.0', '^1.2.3'), 'outside');
assert(satisfies('0.2.9', '^0.2.3') && !satisfies('0.3.0', '^0.2.3'), '0.x locks the minor');
assert(satisfies('0.0.3', '^0.0.3') && !satisfies('0.0.4', '^0.0.3'), '0.0.x locks the patch');` },
    { name: "caret_with_partial_versions", code: `assert(satisfies('1.9.0', '^1.2') && !satisfies('2.0.0', '^1.2'), '^1.2');
assert(satisfies('1.9.0', '^1') && !satisfies('2.0.0', '^1'), '^1');
assert(satisfies('0.0.9', '^0.0') && !satisfies('0.1.0', '^0.0'), '^0.0');
assert(satisfies('0.9.9', '^0') && !satisfies('1.0.0', '^0'), '^0');` },
    { name: "tilde_rules", code: `assert(satisfies('1.2.9', '~1.2.3') && !satisfies('1.3.0', '~1.2.3'), '~1.2.3');
assert(satisfies('1.2.3', '~1.2') && !satisfies('1.3.0', '~1.2'), '~1.2');
assert(satisfies('1.9.9', '~1') && !satisfies('2.0.0', '~1'), '~1');
assert(!satisfies('1.2.2', '~1.2.3'), 'below the lower bound');` },
    { name: "comparison_operators", code: `assert(satisfies('1.2.3', '>=1.2.3') && !satisfies('1.2.2', '>=1.2.3'), '>=');
assert(satisfies('1.2.3', '<=1.2.3') && !satisfies('1.2.4', '<=1.2.3'), '<=');
assert(satisfies('1.2.4', '>1.2.3') && !satisfies('1.2.3', '>1.2.3'), '>');
assert(satisfies('1.2.2', '<1.2.3') && !satisfies('1.2.3', '<1.2.3'), '<');` },
    { name: "numeric_not_lexical", code: `assert(satisfies('1.10.0', '>=1.9.0') === true, '10 > 9');
assert(satisfies('1.2.10', '<1.2.9') === false, '10 is not < 9');` },
    { name: "and_and_or", code: `assert(satisfies('1.5.0', '>=1.2.0 <2.0.0') && !satisfies('2.0.0', '>=1.2.0 <2.0.0'), 'AND');
assert(satisfies('1.0.0', '^1.0.0 || ^3.0.0') && satisfies('3.2.0', '^1.0.0 || ^3.0.0') && !satisfies('2.5.0', '^1.0.0 || ^3.0.0'), 'OR');
assert(satisfies('2.0.0', '  >=1.0.0   <3.0.0  '), 'extra whitespace');` },
    { name: "wildcards_and_partials", code: `assert(satisfies('9.9.9', '*') && satisfies('0.0.1', '') && satisfies('1.2.3', 'x'), 'anything');
assert(satisfies('1.5.5', '1.x') && !satisfies('2.0.0', '1.x'), '1.x');
assert(satisfies('1.2.9', '1.2') && !satisfies('1.3.0', '1.2'), '1.2');
assert(satisfies('1.2.9', '1.2.*') && !satisfies('1.3.0', '1.2.x'), '1.2.*');
assert(satisfies('1.9.0', '1') && !satisfies('2.0.0', '1'), 'bare major');` },
    { name: "prerelease_versions_never_satisfy", code: `assert(satisfies('1.2.3-beta.1', '^1.2.0') === false, 'prerelease excluded');
assert(satisfies('1.2.3-beta.1', '*') === false, 'even for *');
assert(satisfies('1.2.3+build.5', '^1.2.0') === true, 'build metadata is fine');` },
    { name: "invalid_input_throws", code: `const bad = [['1.2', '^1.0.0'], ['v1.2.3', '^1.0.0'], ['1.2.3', '^a.b.c'], ['1.2.3', '>=1.2'], ['1.2.3', '>1'], ['1.2.3', '1.2.3.4']];
for (const [v, r] of bad) {
  let threw = false;
  try { satisfies(v, r); } catch (e) { threw = true; }
  assert(threw, 'should throw for ' + v + ' / ' + r);
}` },
  ],
  solution: {
    code: `function satisfies(version, range) {
  const vm = /^(\\d+)\\.(\\d+)\\.(\\d+)(-[0-9A-Za-z.-]+)?(\\+[0-9A-Za-z.-]+)?$/.exec(version);
  if (!vm) throw new Error('Invalid version: ' + version);
  if (vm[4]) return false;
  const v = [Number(vm[1]), Number(vm[2]), Number(vm[3])];

  const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  const isWild = (s) => s === undefined || s === '' || s === 'x' || s === 'X' || s === '*';

  function parsePartial(text) {
    const parts = text.split('.');
    if (parts.length > 3) throw new Error('Invalid range: ' + text);
    const nums = [];
    for (const p of parts) {
      if (isWild(p)) break;
      if (!/^\\d+$/.test(p)) throw new Error('Invalid range: ' + text);
      nums.push(Number(p));
    }
    return nums;
  }

  function comparator(token) {
    const m = /^(\\^|~|>=|<=|>|<|=)?(.*)$/.exec(token);
    const op = m[1] || '';
    const nums = parsePartial(m[2]);
    const lo = [nums[0] || 0, nums[1] || 0, nums[2] || 0];
    if (nums.length === 0) return () => true;

    if (op === '^') {
      let hi;
      if (nums[0] > 0 || nums.length === 1) hi = [nums[0] + 1, 0, 0];
      else if (nums[1] > 0 || nums.length === 2) hi = [0, nums[1] + 1, 0];
      else hi = [0, 0, nums[2] + 1];
      return (x) => cmp(x, lo) >= 0 && cmp(x, hi) < 0;
    }
    if (op === '~' || op === '' || op === '=') {
      if (nums.length === 3 && op !== '~') return (x) => cmp(x, lo) === 0;
      const hi = nums.length === 1 ? [nums[0] + 1, 0, 0] : [nums[0], nums[1] + 1, 0];
      return (x) => cmp(x, lo) >= 0 && cmp(x, hi) < 0;
    }
    if (nums.length !== 3) throw new Error('Operator ' + op + ' needs a full version: ' + token);
    if (op === '>=') return (x) => cmp(x, lo) >= 0;
    if (op === '<=') return (x) => cmp(x, lo) <= 0;
    if (op === '>') return (x) => cmp(x, lo) > 0;
    return (x) => cmp(x, lo) < 0;
  }

  return range.split('||').some((alt) => {
    const tokens = alt.trim().split(/\\s+/).filter(Boolean);
    return tokens.length === 0 || tokens.every((t) => comparator(t)(v));
  });
}

module.exports = satisfies;`,
    explanation:
      "Each comparator turns into a lower bound and (for ^, ~ and partials) an exclusive upper bound. Caret picks the upper bound by the leftmost non-zero part. Spaces are AND and || is OR, which is the whole grammar.",
  },
};
