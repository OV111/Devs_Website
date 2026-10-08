export default {
  slug: "semver-compare",
  trackId: "api-dev",
  layerId: "api-dev-10",
  type: "CODE",
  difficulty: "med",
  title: "Compare semantic versions",
  summary: "Order versions like 1.10.0 and 1.0.0-beta.2 according to the SemVer 2.0 rules.",
  description:
    "Deploy tooling, package managers and API clients all compare versions. String comparison gets it wrong (<code>'1.10.0' &lt; '1.9.0'</code>), and pre-releases have their own rules.",
  task:
    "Write <code>compareSemver(a, b)</code> returning -1, 0 or 1. Throw an <code>Error</code> for an invalid version.",
  constraints: [
    "Format: <code>MAJOR.MINOR.PATCH</code> with optional <code>-prerelease</code> and <code>+build</code>. No leading <code>v</code>, exactly three numeric parts.",
    "Compare MAJOR, MINOR, PATCH numerically.",
    "A version with a pre-release is LOWER than the same version without one.",
    "Pre-release identifiers are compared one by one (split on dots): numeric ones numerically, others as strings; numeric identifiers are lower than non-numeric ones; if all shared identifiers are equal, the one with fewer identifiers is lower.",
    "Build metadata (<code>+...</code>) is ignored.",
  ],
  example: `compareSemver('1.0.0-alpha', '1.0.0') // -1`,
  tags: ["versioning","deployment","parsing"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "compareSemver.js",
      lang: "js",
      code: `// compareSemver.js
function compareSemver(a, b) {
  // your code here
}

module.exports = compareSemver;`,
    },
  ],
  testFile: {
    name: "compareSemver_test.js",
    lang: "test",
    code: `const compareSemver = require('./compareSemver');

test('numeric', () => {
  expect(compareSemver('1.10.0', '1.9.0')).toBe(1);
});

test('prerelease', () => {
  expect(compareSemver('1.0.0-rc.1', '1.0.0')).toBe(-1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Parse each version with one regular expression; capture the three numbers, the pre-release string, and ignore the build part." },
    { order: 2, cost: 5, text: "Compare the numbers first. Then handle the cases where one or both lack a pre-release." },
    { order: 3, cost: 15, text: "Walk the pre-release identifiers pairwise; decide numeric vs string per pair, and treat a missing identifier as lower." },
  ],
  hiddenTests: [
    { name: "major_minor_patch", code: `assert(compareSemver('2.0.0', '1.9.9') === 1, 'major');
assert(compareSemver('1.2.0', '1.3.0') === -1, 'minor');
assert(compareSemver('1.2.3', '1.2.4') === -1, 'patch');
assert(compareSemver('1.2.3', '1.2.3') === 0, 'equal');` },
    { name: "numeric_not_lexical", code: `assert(compareSemver('1.10.0', '1.9.0') === 1, '10 > 9');
assert(compareSemver('1.0.100', '1.0.20') === 1, '100 > 20');` },
    { name: "prerelease_is_lower_than_release", code: `assert(compareSemver('1.0.0-alpha', '1.0.0') === -1 && compareSemver('1.0.0', '1.0.0-alpha') === 1, 'prerelease lower');` },
    { name: "prerelease_does_not_beat_lower_version", code: `assert(compareSemver('1.0.1-alpha', '1.0.0') === 1, 'numbers decide first');` },
    { name: "semver_spec_ordering", code: `const order = ['1.0.0-alpha', '1.0.0-alpha.1', '1.0.0-alpha.beta', '1.0.0-beta', '1.0.0-beta.2', '1.0.0-beta.11', '1.0.0-rc.1', '1.0.0'];
for (let i = 0; i < order.length - 1; i++) {
  assert(compareSemver(order[i], order[i + 1]) === -1, order[i] + ' < ' + order[i + 1]);
  assert(compareSemver(order[i + 1], order[i]) === 1, order[i + 1] + ' > ' + order[i]);
}` },
    { name: "numeric_prerelease_identifiers", code: `assert(compareSemver('1.0.0-beta.2', '1.0.0-beta.11') === -1, '2 < 11 numerically');` },
    { name: "build_metadata_ignored", code: `assert(compareSemver('1.0.0+build.5', '1.0.0+other') === 0, 'equal ignoring build');
assert(compareSemver('1.0.0-rc.1+a', '1.0.0-rc.1') === 0, 'prerelease plus build');` },
    { name: "invalid_versions_throw", code: `for (const v of ['1.2', 'v1.2.3', '1.2.3.4', 'a.b.c', '', '1.2.x', '01.2.3x']) {
  let threw = false;
  try { compareSemver(v, '1.0.0'); } catch (e) { threw = true; }
  assert(threw, 'should throw for ' + JSON.stringify(v));
}
let threw2 = false;
try { compareSemver('1.0.0', 'nope'); } catch (e) { threw2 = true; }
assert(threw2, 'second argument is validated too');` },
  ],
  solution: {
    code: `function compareSemver(a, b) {
  const parse = (v) => {
    const m = /^(\\d+)\\.(\\d+)\\.(\\d+)(?:-([0-9A-Za-z.-]+))?(?:\\+[0-9A-Za-z.-]+)?$/.exec(v);
    if (!m) throw new Error('Invalid version: ' + v);
    return { nums: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] ? m[4].split('.') : [] };
  };
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < 3; i++) {
    if (x.nums[i] !== y.nums[i]) return x.nums[i] < y.nums[i] ? -1 : 1;
  }
  if (x.pre.length === 0 && y.pre.length === 0) return 0;
  if (x.pre.length === 0) return 1;
  if (y.pre.length === 0) return -1;
  const len = Math.max(x.pre.length, y.pre.length);
  for (let i = 0; i < len; i++) {
    const p = x.pre[i];
    const q = y.pre[i];
    if (p === undefined) return -1;
    if (q === undefined) return 1;
    const pNum = /^\\d+$/.test(p);
    const qNum = /^\\d+$/.test(q);
    if (pNum && qNum) {
      if (Number(p) !== Number(q)) return Number(p) < Number(q) ? -1 : 1;
    } else if (pNum) {
      return -1;
    } else if (qNum) {
      return 1;
    } else if (p !== q) {
      return p < q ? -1 : 1;
    }
  }
  return 0;
}

module.exports = compareSemver;`,
    explanation:
      "Numbers first, then the pre-release rules in the order SemVer defines them: release beats pre-release, identifiers compare pairwise (numeric below text), and a shorter list is lower when all shared parts tie.",
  },
};
