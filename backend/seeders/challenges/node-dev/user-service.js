export default {
  slug: "user-service",
  trackId: "node-dev",
  layerId: "node-dev-7",
  type: "CODE",
  difficulty: "med",
  title: "A layered service with injected dependencies",
  summary: "Sign-up and login business logic that depends only on interfaces (repo, hasher, mailer, clock), so it is testable without a database.",
  description:
    "Layered architecture keeps HTTP, business rules and data access separate. The service layer holds the rules (normalize the email, reject weak passwords, never reveal whether an email exists) and receives its collaborators as parameters, which is exactly what makes it unit-testable with fakes.",
  task:
    "Write <code>createUserService({ repo, hasher, mailer, clock })</code> returning <code>{ signUp, login }</code> (both async). <code>repo.findByEmail(email)</code> and <code>repo.create(data)</code> return promises; <code>hasher.hash(pw)</code> and <code>hasher.verify(pw, hash)</code>; <code>mailer.send(to, subject, body)</code>; <code>clock()</code> returns a Date.",
  constraints: [
    "<code>signUp({ email, password, name })</code> validates in this order and throws an <code>Error</code> with <code>name: 'ServiceError'</code> and a <code>code</code>: <code>INVALID_EMAIL</code> (after trimming and lowercasing, must look like <code>x@y.z</code>), <code>INVALID_NAME</code> (trimmed, non-empty string), <code>WEAK_PASSWORD</code> (string of at least 8 characters), then <code>EMAIL_TAKEN</code> if <code>repo.findByEmail</code> finds a user. No hashing, saving or mailing happens before all checks pass.",
    "Then hash the password (the raw password goes ONLY to <code>hasher.hash</code>), call <code>repo.create({ email, name, passwordHash, createdAt: clock() })</code> with the normalized email and trimmed name, and send a welcome email with subject <code>'Welcome'</code>. If <code>repo.create</code> throws an error with <code>code: 'P2002'</code> (a race with another sign-up), throw <code>EMAIL_TAKEN</code>; other errors propagate.",
    "If the mailer fails, the sign-up still succeeds. Return <code>{ user, welcomeEmailSent }</code> where <code>user</code> is the saved user WITHOUT <code>passwordHash</code>.",
    "<code>login({ email, password })</code> normalizes the email, loads the user and ALWAYS calls <code>hasher.verify</code> (against the dummy hash <code>'$dummy$'</code> when the user doesn't exist, to keep timing similar). It returns <code>{ ok: true, user }</code> (no <code>passwordHash</code>) or <code>{ ok: false, code: 'INVALID_CREDENTIALS' }</code>; an unknown email and a wrong password must be indistinguishable.",
  ],
  example: `const svc = createUserService({ repo, hasher, mailer, clock }); await svc.signUp({ email: ' Ann@X.io ', password: 'longpassword', name: 'Ann' });`,
  tags: ["architecture","dependency-injection","testing","services"],
  estimatedMins: 40,
  xp: 45,
  starterFiles: [
    {
      name: "createUserService.js",
      lang: "js",
      code: `// createUserService.js
function createUserService(deps) {
  // your code here
}

module.exports = createUserService;`,
    },
  ],
  testFile: {
    name: "createUserService_test.js",
    lang: "test",
    code: `const createUserService = require('./createUserService');

test('signs_up', () => {
  const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps } = makeDeps(); const svc = createUserService(deps); return svc.signUp({ email: 'A@X.io', password: 'longpassword', name: 'Ann' }).then((r) => { expect(r.user.email).toBe('a@x.io'); expect('passwordHash' in r.user).toBe(false); });
});

test('weak', () => {
  const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps } = makeDeps(); const svc = createUserService(deps); return svc.signUp({ email: 'a@x.io', password: 'short', name: 'A' }).then(() => expect(true).toBe(false), (e) => expect(e.code).toBe('WEAK_PASSWORD'));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Define a small <code>ServiceError</code> class (extends <code>Error</code>, sets <code>name</code> and <code>code</code>) and normalize the email once in a helper." },
    { order: 2, cost: 5, text: "Write the validations as early <code>throw</code>s in the order listed, before touching any dependency except <code>repo.findByEmail</code>." },
    { order: 3, cost: 15, text: "Wrap only the mailer call in <code>try/catch</code>, and the repo.create call in a separate <code>try/catch</code> that translates P2002." },
  ],
  hiddenTests: [
    { name: "signup_happy_path_stores_normalized_data", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
const r = await svc.signUp({ email: '  Ann@Example.COM ', password: 'correct horse', name: '  Ann Lee ' });
assert(calls.findByEmail.join() === 'ann@example.com', 'looked up the normalized email: ' + calls.findByEmail);
assert(calls.create.length === 1, 'one insert');
const c = calls.create[0];
assert(c.email === 'ann@example.com' && c.name === 'Ann Lee' && c.passwordHash === 'h:correct horse', 'stored fields: ' + JSON.stringify(c));
assert(c.createdAt.toISOString() === '2024-01-01T00:00:00.000Z', 'timestamp comes from the injected clock');
assert(Object.keys(c).sort().join() === 'createdAt,email,name,passwordHash', 'no extra fields: ' + Object.keys(c));
assert(r.user.id === 1 && r.user.email === 'ann@example.com' && r.user.name === 'Ann Lee', 'returned user');
assert(!('passwordHash' in r.user), 'the hash never leaves the service');
assert(r.welcomeEmailSent === true, 'welcome email sent flag');` },
    { name: "raw_password_only_reaches_the_hasher", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
const r = await svc.signUp({ email: 'a@x.io', password: 'sup3r-secret-pw', name: 'A' });
assert(calls.hash.length === 1 && calls.hash[0] === 'sup3r-secret-pw', 'hashed once');
assert(Object.values(calls.create[0]).every((v) => v !== 'sup3r-secret-pw'), 'never saved as plain text (only the hash is stored)');
assert(JSON.stringify(calls.send).indexOf('sup3r-secret-pw') === -1, 'never emailed');
assert(JSON.stringify(r).indexOf('sup3r-secret-pw') === -1, 'never returned');` },
    { name: "welcome_email", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
await svc.signUp({ email: 'A@x.io', password: 'longpassword', name: 'Ann' });
assert(calls.send.length === 1 && calls.send[0].to === 'a@x.io' && calls.send[0].subject === 'Welcome', 'one welcome email: ' + JSON.stringify(calls.send));
assert(calls.send[0].body.indexOf('Ann') !== -1, 'addresses the user by name');` },
    { name: "validation_errors_and_their_order", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
const ok = { email: 'a@x.io', password: 'longpassword', name: 'A' };
for (const bad of ['', '   ', 'plain', 'a@b', '@x.io', 'a b@x.io', undefined, null, 5]) {
  assert(await code(svc.signUp({ ...ok, email: bad })) === 'ServiceError:INVALID_EMAIL', 'email ' + JSON.stringify(bad));
}
for (const bad of ['', '   ', undefined, 5]) {
  assert(await code(svc.signUp({ ...ok, name: bad })) === 'ServiceError:INVALID_NAME', 'name ' + JSON.stringify(bad));
}
for (const bad of ['', 'short', '1234567', undefined, 12345678]) {
  assert(await code(svc.signUp({ ...ok, password: bad })) === 'ServiceError:WEAK_PASSWORD', 'password ' + JSON.stringify(bad));
}
assert(await code(svc.signUp({ ...ok, password: '12345678' })) === null, 'exactly 8 characters is fine');
assert(await code(svc.signUp({ email: 'bad', password: 'x', name: '' })) === 'ServiceError:INVALID_EMAIL', 'email is checked first');
assert(await code(svc.signUp({ email: 'b@x.io', password: 'x', name: '' })) === 'ServiceError:INVALID_NAME', 'then the name');` },
    { name: "no_side_effects_when_validation_fails", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
await code(svc.signUp({ email: 'a@x.io', password: 'short', name: 'A' }));
await code(svc.signUp({ email: 'nope', password: 'longpassword', name: 'A' }));
assert(calls.hash.length === 0 && calls.create.length === 0 && calls.send.length === 0, 'nothing hashed, saved or mailed');
assert(calls.findByEmail.length === 0, 'not even a lookup before the cheap checks pass');` },
    { name: "duplicate_email_is_rejected_before_any_work", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
await svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'A' });
calls.hash.length = 0; calls.send.length = 0; calls.create.length = 0;
assert(await code(svc.signUp({ email: 'A@X.IO ', password: 'anotherpass', name: 'B' })) === 'ServiceError:EMAIL_TAKEN', 'same email in a different case');
assert(calls.hash.length === 0 && calls.create.length === 0 && calls.send.length === 0, 'no hashing, saving or mailing for a duplicate');` },
    { name: "a_race_on_the_unique_index_becomes_email_taken", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps } = makeDeps({ repo: { async findByEmail() { return null; }, async create() { throw Object.assign(new Error('Unique constraint failed'), { code: 'P2002' }); } } });
const svc = createUserService(deps);
assert(await code(svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'A' })) === 'ServiceError:EMAIL_TAKEN', 'translated');` },
    { name: "other_repository_errors_propagate", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const boom = new Error('connection lost');
const { deps } = makeDeps({ repo: { async findByEmail() { return null; }, async create() { throw boom; } } });
const svc = createUserService(deps);
let got = null;
try { await svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'A' }); } catch (e) { got = e; }
assert(got === boom, 'the original error, not wrapped');` },
    { name: "mailer_failure_does_not_fail_signup", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, rows } = makeDeps({ mailer: { async send() { throw new Error('smtp down'); } } });
const svc = createUserService(deps);
const r = await svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'A' });
assert(r.welcomeEmailSent === false, 'flag says the email was not sent');
assert(r.user.email === 'a@x.io' && rows.length === 1, 'user was still created');` },
    { name: "login_success", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
await svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'Ann' });
const r = await svc.login({ email: '  A@X.io', password: 'longpassword' });
assert(r.ok === true && r.user.email === 'a@x.io' && r.user.name === 'Ann', JSON.stringify(r));
assert(!('passwordHash' in r.user), 'hash is not returned');
assert(calls.verify[0][0] === 'longpassword' && calls.verify[0][1] === 'h:longpassword', 'verified against the stored hash');` },
    { name: "login_failures_are_indistinguishable", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
await svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'Ann' });
const wrongPassword = await svc.login({ email: 'a@x.io', password: 'nope-nope' });
const unknownEmail = await svc.login({ email: 'ghost@x.io', password: 'longpassword' });
assert(JSON.stringify(wrongPassword) === JSON.stringify(unknownEmail), 'identical responses: ' + JSON.stringify([wrongPassword, unknownEmail]));
assert(wrongPassword.ok === false && wrongPassword.code === 'INVALID_CREDENTIALS' && !('user' in wrongPassword), 'shape');` },
    { name: "login_always_runs_the_hash_comparison", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps, calls } = makeDeps(); const svc = createUserService(deps);
await svc.login({ email: 'ghost@x.io', password: 'whatever1' });
assert(calls.verify.length === 1, 'verify runs even when the user does not exist (similar timing)');
assert(calls.verify[0][1] === '$dummy$', 'against a dummy hash: ' + JSON.stringify(calls.verify[0]));` },
    { name: "login_with_missing_fields_is_just_invalid_credentials", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const { deps } = makeDeps(); const svc = createUserService(deps);
const a = await svc.login({ email: undefined, password: undefined });
const b = await svc.login({});
assert(a.ok === false && b.ok === false && a.code === 'INVALID_CREDENTIALS', 'no crash on missing input');` },
    { name: "service_depends_only_on_the_injected_collaborators", code: `const makeDeps = (over = {}) => {
  const calls = { findByEmail: [], create: [], hash: [], verify: [], send: [] };
  const rows = [];
  const repo = {
    async findByEmail(email) { calls.findByEmail.push(email); return rows.find((r) => r.email === email) || null; },
    async create(data) { calls.create.push(data); const row = { id: rows.length + 1, ...data }; rows.push(row); return row; },
  };
  const hasher = {
    async hash(pw) { calls.hash.push(pw); return 'h:' + pw; },
    async verify(pw, hash) { calls.verify.push([pw, hash]); return hash === 'h:' + pw; },
  };
  const mailer = { async send(to, subject, body) { calls.send.push({ to, subject, body }); } };
  const clock = () => new Date('2024-01-01T00:00:00Z');
  return { deps: { repo, hasher, mailer, clock, ...over }, calls, rows };
};
const code = async (promise) => { try { await promise; return null; } catch (e) { return e.name + ':' + e.code; } };
const events = [];
const spyRepo = { async findByEmail(e) { events.push('find'); return null; }, async create(d) { events.push('create'); return { id: 9, ...d }; } };
const spyHasher = { async hash(p) { events.push('hash'); return 'H'; }, async verify() { return true; } };
const spyMailer = { async send() { events.push('mail'); } };
const svc = createUserService({ repo: spyRepo, hasher: spyHasher, mailer: spyMailer, clock: () => new Date(0) });
const r = await svc.signUp({ email: 'a@x.io', password: 'longpassword', name: 'A' });
assert(events.join() === 'find,hash,create,mail', 'the workflow order: ' + events);
assert(r.user.id === 9, 'uses what the repository returns');` },
  ],
  solution: {
    code: `class ServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }
}

function createUserService({ repo, hasher, mailer, clock = () => new Date() }) {
  const normalize = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
  const publicUser = (user) => {
    const { passwordHash, ...rest } = user;
    return rest;
  };

  return {
    async signUp({ email, password, name }) {
      const normalized = normalize(email);
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(normalized)) {
        throw new ServiceError('INVALID_EMAIL', 'A valid email is required');
      }
      const cleanName = typeof name === 'string' ? name.trim() : '';
      if (cleanName === '') throw new ServiceError('INVALID_NAME', 'Name is required');
      if (typeof password !== 'string' || password.length < 8) {
        throw new ServiceError('WEAK_PASSWORD', 'Password must be at least 8 characters');
      }
      if (await repo.findByEmail(normalized)) {
        throw new ServiceError('EMAIL_TAKEN', 'Email is already registered');
      }

      const passwordHash = await hasher.hash(password);
      let user;
      try {
        user = await repo.create({ email: normalized, name: cleanName, passwordHash, createdAt: clock() });
      } catch (err) {
        if (err && err.code === 'P2002') throw new ServiceError('EMAIL_TAKEN', 'Email is already registered');
        throw err;
      }

      let welcomeEmailSent = true;
      try {
        await mailer.send(normalized, 'Welcome', 'Hi ' + cleanName + ', welcome aboard!');
      } catch (err) {
        welcomeEmailSent = false;
      }
      return { user: publicUser(user), welcomeEmailSent };
    },

    async login({ email, password } = {}) {
      const user = await repo.findByEmail(normalize(email));
      const matches = await hasher.verify(typeof password === 'string' ? password : '', user ? user.passwordHash : '$dummy$');
      if (!user || !matches) return { ok: false, code: 'INVALID_CREDENTIALS' };
      return { ok: true, user: publicUser(user) };
    },
  };
}

module.exports = createUserService;`,
    explanation:
      "The service holds the rules and nothing else: it never imports a database or mail library, it is handed them. That makes every branch testable with tiny fakes. The login path does the same work whether or not the user exists, so neither the response nor the timing reveals which emails are registered.",
  },
};
