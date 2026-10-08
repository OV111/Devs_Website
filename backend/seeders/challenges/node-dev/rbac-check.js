export default {
  slug: "rbac-check",
  trackId: "node-dev",
  layerId: "node-dev-6",
  type: "CODE",
  difficulty: "hard",
  title: "Role-based access control with inheritance",
  summary: "Roles with inherited permissions, wildcards, ownership rules (:own) and explicit denies.",
  description:
    "RBAC answers 'may this user do this action?'. Real systems need role inheritance (admin includes editor), wildcards (<code>post:*</code>), ownership ('edit only YOUR posts') and explicit denies that beat any allow. The checks must run on the server for every request.",
  task:
    "Write <code>createRbac({ roles })</code> returning <code>{ can(user, permission, resource), permissionsFor(roleNames) }</code>. <code>roles[name] = { inherits?: [names], permissions?: [patterns] }</code>.",
  constraints: [
    "A permission looks like <code>'post:update'</code>. A role's patterns can be exact (<code>'post:update'</code>), a resource wildcard (<code>'post:*'</code>, which does NOT match <code>'postal:read'</code>), or <code>'*'</code> (everything).",
    "A pattern ending in <code>:own</code> (for example <code>'post:update:own'</code>) only applies when <code>resource.ownerId</code> is defined and equals <code>user.id</code>.",
    "A pattern starting with <code>!</code> is an explicit DENY. If any deny matches the requested permission (ownership suffix ignored) the answer is <code>false</code>, no matter what else the user's roles allow.",
    "Roles inherit permissions (including denies) transitively from the roles in <code>inherits</code>. <code>user.roles</code> is a list of role names; unknown role names grant nothing; no roles means no access.",
    "At creation, throw <code>Error('Unknown role: x')</code> for an <code>inherits</code> entry that doesn't exist and <code>Error('Role cycle: a -&gt; b -&gt; a')</code> for circular inheritance (the cycle only).",
    "<code>permissionsFor(roleNames)</code> returns the sorted, de-duplicated patterns granted by those roles including inherited ones (unknown roles ignored).",
  ],
  example: `rbac.can({ id: 7, roles: ['editor'] }, 'post:update', { ownerId: 7 }) // true when editor has 'post:update:own'`,
  tags: ["rbac","authorization","security","permissions"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "createRbac.js",
      lang: "js",
      code: `// createRbac.js
function createRbac(config) {
  // your code here
}

module.exports = createRbac;`,
    },
  ],
  testFile: {
    name: "createRbac_test.js",
    lang: "test",
    code: `const createRbac = require('./createRbac');

test('direct', () => {
  const r = createRbac({ roles: { viewer: { permissions: ['post:read'] } } }); expect(r.can({ id: 1, roles: ['viewer'] }, 'post:read')).toBe(true); expect(r.can({ id: 1, roles: ['viewer'] }, 'post:delete')).toBe(false);
});

test('own', () => {
  const r = createRbac({ roles: { e: { permissions: ['post:update:own'] } } }); expect(r.can({ id: 1, roles: ['e'] }, 'post:update', { ownerId: 1 })).toBe(true); expect(r.can({ id: 1, roles: ['e'] }, 'post:update', { ownerId: 2 })).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "At creation, resolve every role's full permission Set with a recursive <code>collect(name, stack)</code> that throws on cycles; cache results in a Map." },
    { order: 2, cost: 5, text: "Write <code>matches(pattern, permission)</code>: <code>'*'</code> matches all, exact equality, or a <code>':*'</code> pattern whose prefix (including the colon) the permission starts with." },
    { order: 3, cost: 15, text: "In <code>can</code>: check denies first (return false), then scan the allow patterns; an unconditional match returns true immediately, an <code>:own</code> match only counts if the ownership check passes." },
  ],
  hiddenTests: [
    { name: "direct_permissions_and_default_deny", code: `const r = createRbac({ roles: { viewer: { permissions: ['post:read', 'comment:read'] } } });
const u = { id: 1, roles: ['viewer'] };
assert(r.can(u, 'post:read') === true && r.can(u, 'comment:read') === true, 'granted');
assert(r.can(u, 'post:update') === false && r.can(u, 'user:read') === false, 'default deny');
assert(r.can({ id: 2, roles: [] }, 'post:read') === false && r.can({ id: 3 }, 'post:read') === false, 'no roles, no access');
assert(r.can({ id: 4, roles: ['ghost'] }, 'post:read') === false, 'unknown roles grant nothing');` },
    { name: "inheritance_is_transitive", code: `const r = createRbac({ roles: {
  viewer: { permissions: ['post:read'] },
  editor: { inherits: ['viewer'], permissions: ['post:create'] },
  admin: { inherits: ['editor'], permissions: ['user:delete'] },
} });
const admin = { id: 1, roles: ['admin'] };
assert(r.can(admin, 'post:read') && r.can(admin, 'post:create') && r.can(admin, 'user:delete'), 'admin has everything below');
assert(!r.can({ id: 2, roles: ['editor'] }, 'user:delete'), 'editor does not get what is above');
assert(!r.can({ id: 3, roles: ['viewer'] }, 'post:create'), 'viewer does not inherit upward');` },
    { name: "multiple_roles_union", code: `const r = createRbac({ roles: { a: { permissions: ['x:read'] }, b: { permissions: ['y:read'] } } });
const u = { id: 1, roles: ['a', 'b'] };
assert(r.can(u, 'x:read') && r.can(u, 'y:read'), 'union of both roles');` },
    { name: "resource_wildcards", code: `const r = createRbac({ roles: { mod: { permissions: ['post:*'] }, root: { permissions: ['*'] } } });
const mod = { id: 1, roles: ['mod'] };
assert(r.can(mod, 'post:read') && r.can(mod, 'post:delete') && r.can(mod, 'post:anything'), 'post:* covers every post action');
assert(!r.can(mod, 'user:read'), 'but not other resources');
assert(!r.can(mod, 'postal:read'), 'a prefix without the colon boundary must not match');
assert(r.can({ id: 2, roles: ['root'] }, 'anything:at:all'), '* matches everything');` },
    { name: "ownership_rules", code: `const r = createRbac({ roles: { author: { permissions: ['post:read', 'post:update:own', 'post:delete:own'] } } });
const u = { id: 7, roles: ['author'] };
assert(r.can(u, 'post:update', { ownerId: 7 }) === true, 'own resource');
assert(r.can(u, 'post:update', { ownerId: 8 }) === false, 'someone elses');
assert(r.can(u, 'post:update') === false && r.can(u, 'post:update', {}) === false, 'no resource or no owner means not owned');
assert(r.can(u, 'post:read') === true, 'unconditional permission unaffected');
assert(r.can(u, 'post:update:own', { ownerId: 7 }) === false, 'the :own suffix is part of the pattern, not of the request');` },
    { name: "unconditional_permission_beats_ownership_requirement", code: `const r = createRbac({ roles: { author: { permissions: ['post:update:own'] }, editor: { inherits: ['author'], permissions: ['post:update'] } } });
assert(r.can({ id: 1, roles: ['editor'] }, 'post:update', { ownerId: 99 }) === true, 'editors may update any post');
assert(r.can({ id: 1, roles: ['author'] }, 'post:update', { ownerId: 99 }) === false, 'authors only their own');` },
    { name: "wildcard_with_ownership", code: `const r = createRbac({ roles: { owner: { permissions: ['doc:*:own'] } } });
assert(r.can({ id: 1, roles: ['owner'] }, 'doc:edit', { ownerId: 1 }) === true, 'doc:*:own on own resource');
assert(r.can({ id: 1, roles: ['owner'] }, 'doc:edit', { ownerId: 2 }) === false, 'not on others');` },
    { name: "explicit_deny_beats_everything", code: `const r = createRbac({ roles: {
  admin: { permissions: ['*'] },
  restricted: { inherits: ['admin'], permissions: ['!user:delete', '!billing:*'] },
} });
const u = { id: 1, roles: ['restricted'] };
assert(r.can(u, 'post:read') === true, 'inherited wildcard allow still works');
assert(r.can(u, 'user:delete') === false, 'denied despite the wildcard');
assert(r.can(u, 'billing:read') === false && r.can(u, 'billing:refund') === false, 'denied by wildcard');
assert(r.can({ id: 2, roles: ['admin'] }, 'user:delete') === true, 'the parent role itself is unaffected');` },
    { name: "deny_from_one_role_beats_allow_from_another", code: `const r = createRbac({ roles: { writer: { permissions: ['post:*'] }, suspended: { permissions: ['!post:create'] } } });
const u = { id: 1, roles: ['writer', 'suspended'] };
assert(r.can(u, 'post:create') === false, 'denied');
assert(r.can(u, 'post:read') === true, 'rest still allowed');` },
    { name: "deny_ignores_ownership_suffix", code: `const r = createRbac({ roles: { a: { permissions: ['post:update:own'] }, b: { permissions: ['!post:update:own'] } } });
assert(r.can({ id: 1, roles: ['a', 'b'] }, 'post:update', { ownerId: 1 }) === false, 'a deny always wins, even for own resources');` },
    { name: "permissions_for", code: `const r = createRbac({ roles: { a: { permissions: ['z:read', 'x:read'] }, b: { inherits: ['a'], permissions: ['x:read', 'm:read'] } } });
assert(r.permissionsFor(['b']).join() === 'm:read,x:read,z:read', 'sorted unique: ' + r.permissionsFor(['b']));
assert(r.permissionsFor(['a', 'b', 'ghost']).join() === 'm:read,x:read,z:read', 'union, unknown ignored');
assert(r.permissionsFor([]).length === 0, 'empty');` },
    { name: "config_errors", code: `const msg = (cfg) => { try { createRbac(cfg); return null; } catch (e) { return e.message; } };
assert(msg({ roles: { a: { inherits: ['nope'] } } }) === 'Unknown role: nope', 'unknown parent: ' + msg({ roles: { a: { inherits: ['nope'] } } }));
assert(msg({ roles: { a: { inherits: ['b'] }, b: { inherits: ['a'] } } }) === 'Role cycle: a -> b -> a', 'cycle: ' + msg({ roles: { a: { inherits: ['b'] }, b: { inherits: ['a'] } } }));
assert(msg({ roles: { a: { inherits: ['a'] } } }) === 'Role cycle: a -> a', 'self cycle');
assert(msg({ roles: { x: {}, a: { inherits: ['b'] }, b: { inherits: ['c'] }, c: { inherits: ['b'] } } }) === 'Role cycle: b -> c -> b', 'only the cycle is reported');` },
    { name: "roles_without_permissions_and_config_is_not_mutated", code: `const cfg = { roles: { empty: {}, a: { inherits: ['empty'], permissions: ['x:read'] } } };
const before = JSON.stringify(cfg);
const r = createRbac(cfg);
assert(r.can({ id: 1, roles: ['empty'] }, 'x:read') === false, 'empty role grants nothing');
assert(r.can({ id: 1, roles: ['a'] }, 'x:read') === true, 'inherits from an empty role fine');
assert(JSON.stringify(cfg) === before, 'config untouched');` },
  ],
  solution: {
    code: `function createRbac({ roles }) {
  for (const def of Object.values(roles)) {
    for (const parent of def.inherits || []) {
      if (!roles[parent]) throw new Error('Unknown role: ' + parent);
    }
  }

  const resolved = new Map();
  function collect(name, stack) {
    if (stack.includes(name)) {
      throw new Error('Role cycle: ' + [...stack.slice(stack.indexOf(name)), name].join(' -> '));
    }
    if (resolved.has(name)) return resolved.get(name);
    const def = roles[name];
    const permissions = new Set(def.permissions || []);
    for (const parent of def.inherits || []) {
      for (const p of collect(parent, [...stack, name])) permissions.add(p);
    }
    resolved.set(name, permissions);
    return permissions;
  }
  for (const name of Object.keys(roles)) collect(name, []);

  const matches = (pattern, permission) =>
    pattern === '*' ||
    pattern === permission ||
    (pattern.endsWith(':*') && permission.startsWith(pattern.slice(0, -1)));

  function permissionsFor(roleNames) {
    const all = new Set();
    for (const role of roleNames) {
      if (resolved.has(role)) for (const p of resolved.get(role)) all.add(p);
    }
    return [...all].sort();
  }

  function can(user, permission, resource) {
    const patterns = permissionsFor(user.roles || []);
    for (const pattern of patterns) {
      if (!pattern.startsWith('!')) continue;
      const denied = pattern.slice(1).replace(/:own$/, '');
      if (matches(denied, permission)) return false;
    }
    let ownedMatch = false;
    for (const pattern of patterns) {
      if (pattern.startsWith('!')) continue;
      const own = pattern.endsWith(':own');
      const base = own ? pattern.slice(0, -4) : pattern;
      if (!matches(base, permission)) continue;
      if (!own) return true;
      if (resource && resource.ownerId !== undefined && resource.ownerId === user.id) ownedMatch = true;
    }
    return ownedMatch;
  }

  return { can, permissionsFor };
}

module.exports = createRbac;`,
    explanation:
      "Permissions are resolved once per role at creation (which is also where cycles are caught). A request is a two-step decision: any matching deny ends it, otherwise some allow must match, and :own patterns only count when the resource's owner is the current user.",
  },
};
