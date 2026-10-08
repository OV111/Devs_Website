export default {
  slug: "parse-user-guard",
  trackId: "node-dev",
  layerId: "node-dev-1",
  type: "CODE",
  difficulty: "med",
  title: "Runtime type guard for JSON input",
  summary: "Parse JSON safely and narrow 'unknown' data into a validated User, like a TypeScript type guard.",
  description:
    "TypeScript types vanish at runtime: <code>JSON.parse</code> returns <code>any</code> and the compiler can't check what a client actually sent. A type guard validates the shape at the boundary, so everything after it can trust the type.",
  task:
    "Write <code>parseUser(text)</code> returning <code>{ ok: true, value }</code> or <code>{ ok: false, error }</code>.",
  constraints: [
    "Invalid JSON gives <code>'invalid_json'</code>; a non-object (null, array, string, number) gives <code>'not_an_object'</code>.",
    "Checks, in this order, with these error codes: <code>id</code> a positive integer (<code>'invalid_id'</code>); <code>name</code> a non-blank string (<code>'invalid_name'</code>); <code>email</code> a string containing <code>@</code> (<code>'invalid_email'</code>); optional <code>roles</code> an array containing only 'admin', 'editor' or 'viewer' (<code>'invalid_roles'</code>); optional <code>age</code> a finite number &gt;= 0 (<code>'invalid_age'</code>).",
    "The first failing check is the one reported.",
    "<code>value</code> contains only <code>id, name, email, roles</code> (default <code>[]</code>, a copy) and <code>age</code> when it was provided; unknown keys are dropped.",
  ],
  example: `parseUser('{"id":1,"name":"Ann","email":"a@b.c"}') // { ok: true, value: { id: 1, name: 'Ann', email: 'a@b.c', roles: [] } }`,
  tags: ["typescript","type-narrowing","validation","json"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "parseUser.js",
      lang: "js",
      code: `// parseUser.js
function parseUser(text) {
  // your code here
}

module.exports = parseUser;`,
    },
  ],
  testFile: {
    name: "parseUser_test.js",
    lang: "test",
    code: `const parseUser = require('./parseUser');

test('valid', () => {
  expect(parseUser('{"id":1,"name":"A","email":"a@b"}').ok).toBe(true);
});

test('bad_json', () => {
  expect(parseUser('{').error).toBe('invalid_json');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Wrap <code>JSON.parse</code> in <code>try/catch</code>, then check the object-ness first: <code>typeof null === 'object'</code> and arrays are objects too." },
    { order: 2, cost: 5, text: "Write the checks as a sequence of early returns, in the order the problem lists them." },
    { order: 3, cost: 15, text: "Build <code>value</code> explicitly from the validated fields rather than copying the input; that is what drops unknown keys." },
  ],
  hiddenTests: [
    { name: "valid_minimal", code: `const r = parseUser('{"id":1,"name":"Ann","email":"a@b.c"}');
assert(r.ok === true, 'ok');
assert(r.value.id === 1 && r.value.name === 'Ann' && r.value.email === 'a@b.c', 'fields');
assert(Array.isArray(r.value.roles) && r.value.roles.length === 0, 'roles default to []');
assert(!('age' in r.value), 'age absent when not provided');` },
    { name: "valid_full", code: `const r = parseUser('{"id":5,"name":"B","email":"b@c.d","roles":["admin","viewer"],"age":0}');
assert(r.ok && r.value.roles.join(',') === 'admin,viewer' && r.value.age === 0, 'roles and zero age are valid');` },
    { name: "invalid_json", code: `assert(parseUser('not json').error === 'invalid_json' && parseUser('').error === 'invalid_json', 'invalid_json');
assert(parseUser('not json').ok === false, 'ok false');` },
    { name: "not_an_object", code: `for (const t of ['null', '[]', '"str"', '42', 'true']) {
  assert(parseUser(t).error === 'not_an_object', t + ' is not an object');
}` },
    { name: "id_checks", code: `const mk = (id) => parseUser(JSON.stringify({ id, name: 'A', email: 'a@b' }));
assert(mk(0).error === 'invalid_id' && mk(-1).error === 'invalid_id', 'must be positive');
assert(mk(1.5).error === 'invalid_id' && mk('1').error === 'invalid_id', 'must be an integer number');
assert(parseUser('{"name":"A","email":"a@b"}').error === 'invalid_id', 'missing');` },
    { name: "name_and_email_checks", code: `assert(parseUser('{"id":1,"name":"  ","email":"a@b"}').error === 'invalid_name', 'blank name');
assert(parseUser('{"id":1,"name":5,"email":"a@b"}').error === 'invalid_name', 'name type');
assert(parseUser('{"id":1,"name":"A","email":"nope"}').error === 'invalid_email', 'no @');
assert(parseUser('{"id":1,"name":"A"}').error === 'invalid_email', 'missing email');` },
    { name: "roles_checks", code: `const mk = (roles) => parseUser(JSON.stringify({ id: 1, name: 'A', email: 'a@b', roles }));
assert(mk(['root']).error === 'invalid_roles', 'unknown role');
assert(mk('admin').error === 'invalid_roles', 'not an array');
assert(mk([]).ok === true, 'empty array fine');` },
    { name: "age_checks", code: `const mk = (age) => parseUser(JSON.stringify({ id: 1, name: 'A', email: 'a@b', age }));
assert(mk(-1).error === 'invalid_age' && mk('5').error === 'invalid_age', 'age rules');
assert(parseUser('{"id":1,"name":"A","email":"a@b","age":null}').error === 'invalid_age', 'null age is invalid, not absent');` },
    { name: "first_error_wins", code: `assert(parseUser('{"id":-1,"name":"","email":"x"}').error === 'invalid_id', 'id before name');
assert(parseUser('{"id":1,"name":"","email":"x"}').error === 'invalid_name', 'name before email');` },
    { name: "unknown_keys_dropped_and_roles_copied", code: `const input = '{"id":1,"name":"A","email":"a@b","isAdmin":true,"roles":["editor"]}';
const r = parseUser(input);
assert(!('isAdmin' in r.value), 'unknown key dropped');
assert(Object.keys(r.value).sort().join(',') === 'email,id,name,roles', 'exact keys: ' + Object.keys(r.value));` },
  ],
  solution: {
    code: `function parseUser(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    return { ok: false, error: 'invalid_json' };
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'not_an_object' };
  }
  if (!Number.isInteger(data.id) || data.id <= 0) return { ok: false, error: 'invalid_id' };
  if (typeof data.name !== 'string' || data.name.trim() === '') return { ok: false, error: 'invalid_name' };
  if (typeof data.email !== 'string' || !data.email.includes('@')) return { ok: false, error: 'invalid_email' };
  const allowed = ['admin', 'editor', 'viewer'];
  const roles = data.roles === undefined ? [] : data.roles;
  if (!Array.isArray(roles) || !roles.every((r) => allowed.includes(r))) {
    return { ok: false, error: 'invalid_roles' };
  }
  if (data.age !== undefined && (typeof data.age !== 'number' || !Number.isFinite(data.age) || data.age < 0)) {
    return { ok: false, error: 'invalid_age' };
  }
  const value = { id: data.id, name: data.name, email: data.email, roles: [...roles] };
  if (data.age !== undefined) value.age = data.age;
  return { ok: true, value };
}

module.exports = parseUser;`,
    explanation:
      "JSON.parse returns untyped data, so every property is checked before it is trusted. Building value from validated fields (instead of copying the input) is what guarantees the output has exactly the shape you promised.",
  },
};
