export default {
  slug: "status-code-picker",
  trackId: "api-dev",
  layerId: "api-dev-1",
  type: "CODE",
  difficulty: "easy",
  title: "Pick the right status code",
  summary: "Map the outcome of an API call to the correct HTTP status code, with a fixed priority order.",
  description:
    "Status codes are how an API tells the client what happened. Picking 200 for everything is the most common beginner mistake.",
  task:
    "Write <code>statusFor(outcome)</code>. <code>outcome</code> has <code>action</code> ('create' | 'read' | 'update' | 'delete') and optional flags. Return the status code.",
  constraints: [
    "Flag defaults: <code>authenticated</code>, <code>authorized</code>, <code>valid</code>, <code>found</code> = true; <code>conflict</code>, <code>rateLimited</code>, <code>serverError</code> = false.",
    "Priority, first match wins: serverError 500, rateLimited 429, not authenticated 401, not authorized 403, not valid 400, not found 404 (never for 'create'), conflict 409.",
    "Success: create 201, delete 204, read and update 200.",
  ],
  example: `statusFor({ action: 'create' })                       // 201
statusFor({ action: 'read', found: false })           // 404
statusFor({ action: 'read', authenticated: false })   // 401`,
  tags: ["http", "status-codes", "fundamentals"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "statusFor.js",
      lang: "js",
      code: `// statusFor.js
function statusFor(outcome) {
  // your code here
}

module.exports = statusFor;`,
    },
  ],
  testFile: {
    name: "statusFor_test.js",
    lang: "test",
    code: `const statusFor = require('./statusFor');

test('create_is_201', () => {
  expect(statusFor({ action: 'create' })).toBe(201);
});

test('missing_is_404', () => {
  expect(statusFor({ action: 'read', found: false })).toBe(404);
});

test('unauthenticated_is_401', () => {
  expect(statusFor({ action: 'read', authenticated: false })).toBe(401);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Destructure the outcome with default values so a missing flag means the happy path." },
    { order: 2, cost: 5, text: "Write the checks as a chain of <code>if</code>s in exactly the priority order given; the order is the whole problem." },
    { order: 3, cost: 15, text: "401 means 'who are you?' (not logged in); 403 means 'I know you, but no.' Do not mix them up." },
  ],
  hiddenTests: [
    { name: "success_codes", code: `assert(statusFor({ action: 'create' }) === 201, 'create');
assert(statusFor({ action: 'delete' }) === 204, 'delete');
assert(statusFor({ action: 'read' }) === 200, 'read');
assert(statusFor({ action: 'update' }) === 200, 'update');` },
    { name: "server_error_wins", code: `assert(statusFor({ action: 'read', serverError: true, rateLimited: true, authenticated: false }) === 500, '500 beats everything');` },
    { name: "rate_limit_beats_auth", code: `assert(statusFor({ action: 'read', rateLimited: true, authenticated: false }) === 429, '429 before 401');` },
    { name: "401_vs_403", code: `assert(statusFor({ action: 'read', authenticated: false, authorized: false }) === 401, '401 before 403');
assert(statusFor({ action: 'update', authorized: false }) === 403, '403');` },
    { name: "invalid_is_400", code: `assert(statusFor({ action: 'create', valid: false }) === 400, '400');
assert(statusFor({ action: 'create', valid: false, conflict: true }) === 400, '400 before 409');` },
    { name: "not_found_never_for_create", code: `assert(statusFor({ action: 'create', found: false }) === 201, 'create ignores found');
assert(statusFor({ action: 'delete', found: false }) === 404, 'delete of nothing is 404');` },
    { name: "conflict_is_409", code: `assert(statusFor({ action: 'create', conflict: true }) === 409, '409');` },
  ],
  solution: {
    code: `function statusFor(outcome) {
  const {
    action, found = true, authenticated = true, authorized = true,
    valid = true, conflict = false, rateLimited = false, serverError = false,
  } = outcome;
  if (serverError) return 500;
  if (rateLimited) return 429;
  if (!authenticated) return 401;
  if (!authorized) return 403;
  if (!valid) return 400;
  if (!found && action !== 'create') return 404;
  if (conflict) return 409;
  if (action === 'create') return 201;
  if (action === 'delete') return 204;
  return 200;
}

module.exports = statusFor;`,
    explanation:
      "Errors are checked from most to least severe, and success only happens if none fired. The ordered ifs encode the priority table directly.",
  },
};
