export default {
  slug: "octal-to-symbolic",
  trackId: "api-dev",
  layerId: "api-dev-2",
  type: "CODE",
  difficulty: "easy",
  title: "chmod octal to rwx",
  summary: "Convert a Unix permission like 755 into the rwxr-xr-x string that ls -l shows.",
  description:
    "<code>chmod 755 file</code> sets permissions with three octal digits: owner, group, others. Each digit is a sum of read (4), write (2) and execute (1).",
  task:
    "Write <code>octalToSymbolic(mode)</code> that takes a 3-digit mode (string or number) and returns the 9-character string. Return <code>null</code> for anything invalid.",
  constraints: [
    "Valid input is exactly 3 digits, each 0-7.",
    "A missing permission is shown as <code>-</code>.",
  ],
  example: `octalToSymbolic(755)   // 'rwxr-xr-x'
octalToSymbolic('644') // 'rw-r--r--'
octalToSymbolic(789)   // null`,
  tags: ["linux", "permissions", "chmod"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "octalToSymbolic.js",
      lang: "js",
      code: `// octalToSymbolic.js
function octalToSymbolic(mode) {
  // your code here
}

module.exports = octalToSymbolic;`,
    },
  ],
  testFile: {
    name: "octalToSymbolic_test.js",
    lang: "test",
    code: `const f = require('./octalToSymbolic');

test('755', () => {
  expect(f(755)).toBe('rwxr-xr-x');
});

test('644_string', () => {
  expect(f('644')).toBe('rw-r--r--');
});

test('invalid_is_null', () => {
  expect(f(789)).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Convert the input to a string first, then validate it with a regular expression for exactly three octal digits." },
    { order: 2, cost: 5, text: "For each digit, test its bits: <code>n &amp; 4</code> is read, <code>n &amp; 2</code> write, <code>n &amp; 1</code> execute." },
    { order: 3, cost: 15, text: "Map each digit to a 3-character string and <code>join('')</code> the three results." },
  ],
  hiddenTests: [
    { name: "common_modes", code: `assert(octalToSymbolic(755) === 'rwxr-xr-x', '755');
assert(octalToSymbolic('644') === 'rw-r--r--', '644');
assert(octalToSymbolic(600) === 'rw-------', '600');` },
    { name: "extremes", code: `assert(octalToSymbolic(777) === 'rwxrwxrwx', '777');
assert(octalToSymbolic('000') === '---------', '000');` },
    { name: "mixed_bits", code: `assert(octalToSymbolic(421) === 'r---w---x', '421');
assert(octalToSymbolic(753) === 'rwxr-x-wx', '753');` },
    { name: "string_and_number_same", code: `assert(octalToSymbolic('640') === octalToSymbolic(640), 'same result');` },
    { name: "invalid_digits", code: `assert(octalToSymbolic(789) === null, '8 and 9 are not octal');
assert(octalToSymbolic('75a') === null, 'letters');` },
    { name: "invalid_length", code: `assert(octalToSymbolic(75) === null, 'too short');
assert(octalToSymbolic(7555) === null, 'too long');` },
    { name: "non_input", code: `assert(octalToSymbolic(undefined) === null, 'undefined');
assert(octalToSymbolic('') === null, 'empty');` },
  ],
  solution: {
    code: `function octalToSymbolic(mode) {
  const s = String(mode);
  if (!/^[0-7]{3}$/.test(s)) return null;
  return [...s]
    .map((d) => {
      const n = Number(d);
      return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
    })
    .join('');
}

module.exports = octalToSymbolic;`,
    explanation:
      "Each octal digit is three bits. Testing each bit gives r, w and x, and the three digits join into one 9-character string.",
  },
};
