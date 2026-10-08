export default {
  slug: "resolve-path",
  trackId: "api-dev",
  layerId: "api-dev-2",
  type: "CODE",
  difficulty: "med",
  title: "Resolve a path like cd",
  summary: "Work out the absolute path that 'cd ../x' leads to from a current directory.",
  description:
    "The shell turns relative paths into absolute ones using <code>.</code>, <code>..</code> and <code>~</code>. Servers need the same logic when they serve files, and getting it wrong is how path-traversal bugs happen.",
  task:
    "Write <code>resolvePath(cwd, target, home = '/home/user')</code> returning the normalised absolute path.",
  constraints: [
    "An absolute <code>target</code> ignores <code>cwd</code>.",
    "<code>~</code> and <code>~/x</code> start from <code>home</code>.",
    "<code>.</code> is a no-op; <code>..</code> goes up one level, but never above <code>/</code>.",
    "Collapse repeated slashes; no trailing slash except for the root <code>/</code>.",
  ],
  example: `resolvePath('/home/a', '../b/./c') // '/home/b/c'
resolvePath('/x', '~/docs')        // '/home/user/docs'`,
  tags: ["linux", "paths", "security"],
  estimatedMins: 25,
  xp: 45,
  starterFiles: [
    {
      name: "resolvePath.js",
      lang: "js",
      code: `// resolvePath.js
function resolvePath(cwd, target, home = '/home/user') {
  // your code here
}

module.exports = resolvePath;`,
    },
  ],
  testFile: {
    name: "resolvePath_test.js",
    lang: "test",
    code: `const resolvePath = require('./resolvePath');

test('relative', () => {
  expect(resolvePath('/home/a', 'b')).toBe('/home/a/b');
});

test('parent', () => {
  expect(resolvePath('/home/a', '..')).toBe('/home');
});

test('absolute_ignores_cwd', () => {
  expect(resolvePath('/home/a', '/etc')).toBe('/etc');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "First turn the target into one full path string: expand <code>~</code>, or prepend <code>cwd + '/'</code> if it is not absolute." },
    { order: 2, cost: 5, text: "Split on <code>/</code> and walk the pieces with a stack (an array)." },
    { order: 3, cost: 15, text: "Skip empty and <code>.</code> pieces; on <code>..</code> call <code>pop()</code> (popping an empty array is harmless, which is why you never go above root); otherwise <code>push</code>." },
  ],
  hiddenTests: [
    { name: "relative_and_dot", code: `assert(resolvePath('/home/a', 'b/./c') === '/home/a/b/c', 'dot is no-op');` },
    { name: "parent_segments", code: `assert(resolvePath('/home/a/b', '../../x') === '/home/x', 'two levels up');
assert(resolvePath('/home/a', '..') === '/home', 'one level up');` },
    { name: "cannot_escape_root", code: `assert(resolvePath('/a', '../../../..') === '/', 'stay at root');
assert(resolvePath('/', '..') === '/', 'root parent is root');` },
    { name: "absolute_target", code: `assert(resolvePath('/home/a', '/etc/./nginx/../hosts') === '/etc/hosts', 'normalises absolute paths too');` },
    { name: "tilde", code: `assert(resolvePath('/x', '~') === '/home/user', 'bare ~');
assert(resolvePath('/x', '~/docs') === '/home/user/docs', '~/x');
assert(resolvePath('/x', '~', '/root') === '/root', 'custom home');` },
    { name: "repeated_and_trailing_slashes", code: `assert(resolvePath('/a', 'b//c/') === '/a/b/c', 'collapse and trim');` },
    { name: "empty_target_is_cwd", code: `assert(resolvePath('/home/a', '') === '/home/a', 'empty target');
assert(resolvePath('/home/a', '.') === '/home/a', 'dot');` },
    { name: "traversal_attempt", code: `assert(resolvePath('/srv/app/uploads', '../../../etc/passwd') === '/etc/passwd', 'resolved result is what you must then check against the allowed root');` },
  ],
  solution: {
    code: `function resolvePath(cwd, target, home = '/home/user') {
  let p = target;
  if (p === '~' || p.startsWith('~/')) p = home + p.slice(1);
  if (!p.startsWith('/')) p = cwd + '/' + p;
  const out = [];
  for (const seg of p.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') out.pop();
    else out.push(seg);
  }
  return '/' + out.join('/');
}

module.exports = resolvePath;`,
    explanation:
      "Build one full path string, then walk its segments with a stack: '..' pops, '.' and empty pieces are skipped. Popping an empty stack is a no-op, which stops it climbing above root.",
  },
};
