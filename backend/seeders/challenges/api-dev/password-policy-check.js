export default {
  slug: "password-policy-check",
  trackId: "api-dev",
  layerId: "api-dev-6",
  type: "CODE",
  difficulty: "med",
  title: "Check a password against a modern policy",
  summary: "Length, common passwords, personal info and low variety, in the spirit of NIST guidance.",
  description:
    "Old rules like 'must contain a symbol' push users to <code>Password1!</code>. Current NIST guidance favors length, blocking common passwords, and rejecting passwords built from the user's own details.",
  task:
    "Write <code>checkPassword(password, { minLength = 12, userInfo = [] })</code> returning <code>{ ok, problems }</code> where <code>problems</code> is an array of codes.",
  constraints: [
    "<code>'too_short'</code>: shorter than <code>minLength</code>.",
    "<code>'too_common'</code>: contains (case-insensitive) one of: password, 123456, qwerty, letmein, iloveyou, admin, welcome.",
    "<code>'contains_user_info'</code>: contains (case-insensitive) any <code>userInfo</code> string of at least 3 characters.",
    "<code>'low_variety'</code>: fewer than 5 distinct characters.",
    "<code>ok</code> is true only when there are no problems; codes appear in the order listed.",
  ],
  example: `checkPassword('correct horse battery', { userInfo: ['ann'] }) // { ok: true, problems: [] }`,
  tags: ["auth","passwords","nist"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "checkPassword.js",
      lang: "js",
      code: `// checkPassword.js
function checkPassword(password, options = {}) {
  // your code here
}

module.exports = checkPassword;`,
    },
  ],
  testFile: {
    name: "checkPassword_test.js",
    lang: "test",
    code: `const checkPassword = require('./checkPassword');

test('good', () => {
  expect(checkPassword('correct horse battery staple').ok).toBe(true);
});

test('short', () => {
  expect(checkPassword('abc').problems).toContain('too_short');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Lowercase the password once and test every rule against that copy." },
    { order: 2, cost: 5, text: "Put the common-password list inside the function; use <code>some</code> + <code>includes</code>." },
    { order: 3, cost: 15, text: "A <code>Set</code> of the characters gives the number of distinct characters via <code>.size</code>." },
  ],
  hiddenTests: [
    { name: "strong_password_ok", code: `const r = checkPassword('correct horse battery staple');
assert(r.ok === true && r.problems.length === 0, 'passphrase passes');` },
    { name: "too_short_uses_min_length", code: `assert(checkPassword('Abcdefgh1').problems.includes('too_short'), 'default 12');
assert(!checkPassword('Abcdefgh1', { minLength: 8 }).problems.includes('too_short'), 'custom min');` },
    { name: "too_common_substring", code: `assert(checkPassword('MyPassword2024xyz').problems.includes('too_common'), 'contains password');
assert(checkPassword('zzqwerty-horse-lamp').problems.includes('too_common'), 'contains qwerty');` },
    { name: "contains_user_info", code: `const r = checkPassword('ilovevahe-and-pizza', { userInfo: ['Vahe'] });
assert(r.problems.includes('contains_user_info'), 'case-insensitive name');` },
    { name: "short_user_info_ignored", code: `const r = checkPassword('some-long-unrelated-phrase', { userInfo: ['ab', ''] });
assert(!r.problems.includes('contains_user_info'), 'under 3 chars ignored');` },
    { name: "low_variety", code: `assert(checkPassword('aaaaaaaaaaaaaaaa').problems.includes('low_variety'), 'one char repeated');` },
    { name: "problem_order_and_ok", code: `const r = checkPassword('aaaa', { userInfo: ['aaa'] });
assert(r.ok === false, 'not ok');
assert(r.problems.join(',') === 'too_short,contains_user_info,low_variety', 'order: ' + r.problems);` },
  ],
  solution: {
    code: `function checkPassword(password, { minLength = 12, userInfo = [] } = {}) {
  const common = ['password', '123456', 'qwerty', 'letmein', 'iloveyou', 'admin', 'welcome'];
  const problems = [];
  const lower = password.toLowerCase();
  if (password.length < minLength) problems.push('too_short');
  if (common.some((c) => lower.includes(c))) problems.push('too_common');
  if (userInfo.some((u) => u && u.length >= 3 && lower.includes(u.toLowerCase()))) problems.push('contains_user_info');
  if (new Set(password).size < 5) problems.push('low_variety');
  return { ok: problems.length === 0, problems };
}

module.exports = checkPassword;`,
    explanation:
      "Each rule is an independent check that pushes a code; ok is simply 'no problems'. Length plus blocklists beats symbol-composition rules.",
  },
};
