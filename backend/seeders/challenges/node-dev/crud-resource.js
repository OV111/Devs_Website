export default {
  slug: "crud-resource",
  trackId: "node-dev",
  layerId: "node-dev-4",
  type: "CODE",
  difficulty: "hard",
  title: "RESTful CRUD with the right status codes",
  summary: "Implement a /users resource: list, create, read, replace, patch and delete with correct HTTP semantics.",
  description:
    "'RESTful' mostly comes down to using the right method and status for each operation: 201 plus a <code>Location</code> header on create, 204 with no body on delete, 404 vs 400 vs 409, PUT as full replace and PATCH as partial update, and 405 with <code>Allow</code> for unsupported methods.",
  task:
    "Write <code>handleResource(store, req)</code> returning <code>{ status, headers, body }</code>. <code>store</code> is <code>{ items: Map, nextId: 1 }</code> (id to record); <code>req</code> is <code>{ method, path, body }</code>. Use <code>store.nextId++</code> for new ids and keep records in <code>store.items</code>.",
  constraints: [
    "A user is <code>{ id, name, email? }</code>; <code>name</code> must be a non-blank string, <code>email</code> (if present) a string. Unknown body keys are ignored. Ignore a trailing slash and any <code>?query</code> in the path.",
    "<code>GET /users</code>: 200 with the array. <code>POST /users</code>: invalid body gives 400 <code>{ error: 'invalid_body', field }</code> (field is <code>'name'</code>, <code>'email'</code> or <code>'body'</code>); an email already used gives 409 <code>{ error: 'email_taken' }</code>; success is 201 with the new user and header <code>Location: /users/&lt;id&gt;</code>. Other methods: 405, header <code>Allow: 'GET, POST'</code>.",
    "<code>/users/:id</code> (digits only; anything else is an unknown path): <code>GET</code> 200 or 404. <code>PUT</code> replaces the whole user (same validation as POST, so omitting email removes it), <code>PATCH</code> merges only the fields given (body needs at least one of name/email, each valid), <code>DELETE</code> gives 204 with <code>body: null</code>. Missing user is 404 BEFORE body validation. Email conflicts with ANOTHER user are 409 (keeping your own email is fine). Other methods: 405 with <code>Allow: 'DELETE, GET, PATCH, PUT'</code>.",
    "Errors use <code>{ error: 'not_found' }</code> for 404 and <code>{ error: 'method_not_allowed' }</code> for 405; unknown paths are 404. <code>headers</code> is always an object (empty when unused).",
  ],
  example: `handleResource(store, { method: 'POST', path: '/users', body: { name: 'Ann' } }) // { status: 201, headers: { Location: '/users/1' }, body: { id: 1, name: 'Ann' } }`,
  tags: ["rest","api-design","http","fastify"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "handleResource.js",
      lang: "js",
      code: `// handleResource.js
function handleResource(store, req) {
  // your code here
}

module.exports = handleResource;`,
    },
  ],
  testFile: {
    name: "handleResource_test.js",
    lang: "test",
    code: `const handleResource = require('./handleResource');

test('create', () => {
  const s = { items: new Map(), nextId: 1 }; const r = handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } }); expect(r.status).toBe(201); expect(r.headers.Location).toBe('/users/1');
});

test('missing', () => {
  const s = { items: new Map(), nextId: 1 }; expect(handleResource(s, { method: 'GET', path: '/users/9' }).status).toBe(404);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Normalize the path first (strip query and trailing slashes), then branch: <code>/users</code> collection, a regex <code>/^\\/users\\/(\\d+)$/</code> for one item, else 404." },
    { order: 2, cost: 5, text: "Write small helpers: <code>check(body, partial)</code> returning the failing field or null, and <code>emailTaken(email, exceptId)</code> scanning the other users." },
    { order: 3, cost: 15, text: "Order inside <code>/users/:id</code>: look up the user (404), then validate the body (400), then check conflicts (409), then write. PUT builds a fresh <code>{ id, ...fields }</code>; PATCH starts from a copy of the current user." },
  ],
  hiddenTests: [
    { name: "list_starts_empty", code: `const s = { items: new Map(), nextId: 1 };
const r = handleResource(s, { method: 'GET', path: '/users' });
assert(r.status === 200 && Array.isArray(r.body) && r.body.length === 0, 'empty list');
assert(typeof r.headers === 'object' && r.headers !== null, 'headers object');` },
    { name: "create_returns_201_location_and_user", code: `const s = { items: new Map(), nextId: 1 };
const r = handleResource(s, { method: 'POST', path: '/users', body: { name: 'Ann', email: 'a@x.io', isAdmin: true } });
assert(r.status === 201, '201');
assert(r.headers.Location === '/users/1', 'Location: ' + JSON.stringify(r.headers));
assert(r.body.id === 1 && r.body.name === 'Ann' && r.body.email === 'a@x.io', 'body');
assert(!('isAdmin' in r.body), 'unknown keys ignored');
assert(s.items.get(1).name === 'Ann' && s.nextId === 2, 'stored and id advanced');` },
    { name: "ids_increment_and_list_in_order", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } });
const r2 = handleResource(s, { method: 'POST', path: '/users', body: { name: 'B' } });
assert(r2.body.id === 2 && r2.headers.Location === '/users/2', 'second id');
const list = handleResource(s, { method: 'GET', path: '/users' }).body;
assert(list.map((u) => u.name).join('') === 'AB', 'order');` },
    { name: "create_validation_400", code: `const s = { items: new Map(), nextId: 1 };
const run = (body) => handleResource(s, { method: 'POST', path: '/users', body });
let r = run({}); assert(r.status === 400 && r.body.error === 'invalid_body' && r.body.field === 'name', 'missing name');
r = run({ name: '   ' }); assert(r.status === 400 && r.body.field === 'name', 'blank name');
r = run({ name: 5 }); assert(r.status === 400 && r.body.field === 'name', 'name type');
r = run({ name: 'A', email: 5 }); assert(r.status === 400 && r.body.field === 'email', 'email type');
for (const bad of [null, undefined, [], 'str']) { r = run(bad); assert(r.status === 400 && r.body.field === 'body', 'not an object: ' + JSON.stringify(bad)); }
assert(s.items.size === 0 && s.nextId === 1, 'nothing stored, id not consumed');` },
    { name: "duplicate_email_409", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A', email: 'a@x.io' } });
const r = handleResource(s, { method: 'POST', path: '/users', body: { name: 'B', email: 'a@x.io' } });
assert(r.status === 409 && r.body.error === 'email_taken', '409');
assert(s.items.size === 1 && s.nextId === 2, 'rejected create stores nothing and keeps the id');
const noEmail = handleResource(s, { method: 'POST', path: '/users', body: { name: 'C' } });
assert(noEmail.status === 201, 'users without email never conflict');` },
    { name: "get_one_and_not_found", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } });
const ok = handleResource(s, { method: 'GET', path: '/users/1' });
assert(ok.status === 200 && ok.body.name === 'A', 'found');
const miss = handleResource(s, { method: 'GET', path: '/users/99' });
assert(miss.status === 404 && miss.body.error === 'not_found', 'missing');` },
    { name: "bad_paths_are_404", code: `const s = { items: new Map(), nextId: 1 };
for (const p of ['/users/abc', '/users/1/posts', '/nope', '/']) {
  const r = handleResource(s, { method: 'GET', path: p });
  assert(r.status === 404 && r.body.error === 'not_found', p + ' is 404');
}` },
    { name: "trailing_slash_and_query_ignored", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users/', body: { name: 'A' } });
assert(handleResource(s, { method: 'GET', path: '/users/?page=2' }).body.length === 1, 'collection');
assert(handleResource(s, { method: 'GET', path: '/users/1/?x=1' }).status === 200, 'item');` },
    { name: "put_replaces_the_whole_resource", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A', email: 'a@x.io' } });
const r = handleResource(s, { method: 'PUT', path: '/users/1', body: { name: 'Z' } });
assert(r.status === 200 && r.body.id === 1 && r.body.name === 'Z' && !('email' in r.body), 'email removed: ' + JSON.stringify(r.body));
assert(!('email' in s.items.get(1)), 'stored copy replaced too');
assert(handleResource(s, { method: 'PUT', path: '/users/1', body: { email: 'x@y.z' } }).status === 400, 'PUT needs a full valid body');` },
    { name: "put_order_of_checks", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A', email: 'a@x.io' } });
handleResource(s, { method: 'POST', path: '/users', body: { name: 'B', email: 'b@x.io' } });
assert(handleResource(s, { method: 'PUT', path: '/users/9', body: {} }).status === 404, '404 before validation');
assert(handleResource(s, { method: 'PUT', path: '/users/1', body: { name: 'A2', email: 'b@x.io' } }).status === 409, 'taking another users email is 409');
assert(handleResource(s, { method: 'PUT', path: '/users/1', body: { name: 'A2', email: 'a@x.io' } }).status === 200, 'keeping your own email is fine');` },
    { name: "patch_merges_only_given_fields", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A', email: 'a@x.io' } });
const r = handleResource(s, { method: 'PATCH', path: '/users/1', body: { name: 'New' } });
assert(r.status === 200 && r.body.name === 'New' && r.body.email === 'a@x.io', 'email kept: ' + JSON.stringify(r.body));
const r2 = handleResource(s, { method: 'PATCH', path: '/users/1', body: { email: 'n@x.io' } });
assert(r2.body.name === 'New' && r2.body.email === 'n@x.io', 'name kept');` },
    { name: "patch_validation_and_404", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } });
handleResource(s, { method: 'POST', path: '/users', body: { name: 'B', email: 'b@x.io' } });
assert(handleResource(s, { method: 'PATCH', path: '/users/9', body: {} }).status === 404, '404 first');
let r = handleResource(s, { method: 'PATCH', path: '/users/1', body: {} });
assert(r.status === 400 && r.body.field === 'body', 'empty patch is invalid');
r = handleResource(s, { method: 'PATCH', path: '/users/1', body: { name: '' } });
assert(r.status === 400 && r.body.field === 'name', 'blank name');
r = handleResource(s, { method: 'PATCH', path: '/users/1', body: { email: 3 } });
assert(r.status === 400 && r.body.field === 'email', 'bad email');
r = handleResource(s, { method: 'PATCH', path: '/users/1', body: { email: 'b@x.io' } });
assert(r.status === 409, 'conflict');
assert(s.items.get(1).email === undefined, 'failed patches changed nothing');` },
    { name: "delete_204_then_404", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } });
const r = handleResource(s, { method: 'DELETE', path: '/users/1' });
assert(r.status === 204 && r.body === null, '204 with null body');
assert(handleResource(s, { method: 'GET', path: '/users/1' }).status === 404, 'gone');
assert(handleResource(s, { method: 'DELETE', path: '/users/1' }).status === 404, 'second delete is 404');
const reuse = handleResource(s, { method: 'POST', path: '/users', body: { name: 'B' } });
assert(reuse.body.id === 2, 'ids are never reused');` },
    { name: "put_keeps_list_position", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } });
handleResource(s, { method: 'POST', path: '/users', body: { name: 'B' } });
handleResource(s, { method: 'PUT', path: '/users/1', body: { name: 'A2' } });
assert(handleResource(s, { method: 'GET', path: '/users' }).body.map((u) => u.name).join(',') === 'A2,B', 'order unchanged');` },
    { name: "405_with_allow_headers", code: `const s = { items: new Map(), nextId: 1 };
handleResource(s, { method: 'POST', path: '/users', body: { name: 'A' } });
const a = handleResource(s, { method: 'DELETE', path: '/users' });
assert(a.status === 405 && a.headers.Allow === 'GET, POST' && a.body.error === 'method_not_allowed', 'collection: ' + JSON.stringify(a));
const b = handleResource(s, { method: 'POST', path: '/users/1', body: { name: 'x' } });
assert(b.status === 405 && b.headers.Allow === 'DELETE, GET, PATCH, PUT', 'item: ' + JSON.stringify(b.headers));` },
  ],
  solution: {
    code: `function handleResource(store, req) {
  const path = req.path.split('?')[0].replace(/\\/+$/, '') || '/';
  const fail = (status, error, extra = {}) => ({ status, headers: {}, body: { error, ...extra } });
  const ok = (status, body, headers = {}) => ({ status, headers, body });
  const notAllowed = (allow) => ({ status: 405, headers: { Allow: allow }, body: { error: 'method_not_allowed' } });

  const asObject = (b) => (b !== null && typeof b === 'object' && !Array.isArray(b) ? b : null);

  function check(b, partial) {
    if (b === null) return 'body';
    if (partial && !('name' in b) && !('email' in b)) return 'body';
    if (!partial || 'name' in b) {
      if (typeof b.name !== 'string' || b.name.trim() === '') return 'name';
    }
    if ('email' in b && typeof b.email !== 'string') return 'email';
    return null;
  }

  const emailTaken = (email, exceptId) =>
    email !== undefined && [...store.items.values()].some((u) => u.email === email && u.id !== exceptId);

  const fields = (b) => {
    const out = { name: b.name };
    if (b.email !== undefined) out.email = b.email;
    return out;
  };

  if (path === '/users') {
    if (req.method === 'GET') return ok(200, [...store.items.values()]);
    if (req.method === 'POST') {
      const b = asObject(req.body);
      const bad = check(b, false);
      if (bad) return fail(400, 'invalid_body', { field: bad });
      if (emailTaken(b.email, null)) return fail(409, 'email_taken');
      const id = store.nextId++;
      const user = { id, ...fields(b) };
      store.items.set(id, user);
      return ok(201, user, { Location: '/users/' + id });
    }
    return notAllowed('GET, POST');
  }

  const m = /^\\/users\\/(\\d+)$/.exec(path);
  if (!m) return fail(404, 'not_found');
  const id = Number(m[1]);
  const current = store.items.get(id);

  switch (req.method) {
    case 'GET':
      return current ? ok(200, current) : fail(404, 'not_found');
    case 'PUT': {
      if (!current) return fail(404, 'not_found');
      const b = asObject(req.body);
      const bad = check(b, false);
      if (bad) return fail(400, 'invalid_body', { field: bad });
      if (emailTaken(b.email, id)) return fail(409, 'email_taken');
      const user = { id, ...fields(b) };
      store.items.set(id, user);
      return ok(200, user);
    }
    case 'PATCH': {
      if (!current) return fail(404, 'not_found');
      const b = asObject(req.body);
      const bad = check(b, true);
      if (bad) return fail(400, 'invalid_body', { field: bad });
      const next = { ...current };
      if ('name' in b) next.name = b.name;
      if ('email' in b) next.email = b.email;
      if (emailTaken(next.email, id)) return fail(409, 'email_taken');
      store.items.set(id, next);
      return ok(200, next);
    }
    case 'DELETE':
      if (!current) return fail(404, 'not_found');
      store.items.delete(id);
      return { status: 204, headers: {}, body: null };
    default:
      return notAllowed('DELETE, GET, PATCH, PUT');
  }
}

module.exports = handleResource;`,
    explanation:
      "Each status code has one job: 201+Location for creation, 204 for 'done, nothing to say', 400 for a bad body, 404 for a missing resource (checked first), 409 for a conflict with other data, 405 with Allow for an unsupported method. PUT builds a fresh record while PATCH starts from a copy, which is the whole replace-versus-merge difference.",
  },
};
