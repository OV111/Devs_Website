export default {
  slug: "error-handler",
  trackId: "node-dev",
  layerId: "node-dev-7",
  type: "CODE",
  difficulty: "med",
  title: "Centralized error handling",
  summary: "Map any thrown value to a safe HTTP response: validation, Prisma/Postgres errors, JWT errors, custom status errors and hidden 500s in production.",
  description:
    "One error middleware at the end of the app is better than <code>try/catch</code> in every route. It decides the status and body for every kind of failure, logs only real server errors, and above all never leaks stack traces or database details to clients in production.",
  task:
    "Write <code>handleError(err, { isProd = false, requestId })</code> returning <code>{ status, headers, body, shouldLog }</code>. The body is <code>{ error: { code, message, details?, requestId?, stack? } }</code>.",
  constraints: [
    "Zod-style errors (<code>err.name === 'ZodError'</code> or an <code>issues</code> array): 400, code <code>VALIDATION_ERROR</code>, message <code>'Invalid request'</code>, <code>details</code> = <code>[{ path: 'a.b', message }]</code> (path joined with dots).",
    "Body parser errors (<code>err.type === 'entity.parse.failed'</code>): 400 <code>INVALID_JSON</code> 'Malformed JSON body'. JWT errors (<code>JsonWebTokenError</code>, <code>TokenExpiredError</code>): 401 <code>UNAUTHORIZED</code> 'Invalid or expired token'.",
    "Database errors by <code>err.code</code>: <code>P2002</code> or <code>23505</code>: 409 <code>CONFLICT</code> 'Resource already exists' (for P2002 also <code>details: { fields: err.meta.target }</code> when present); <code>P2025</code>: 404 <code>NOT_FOUND</code> 'Resource not found'; <code>23503</code>: 409 <code>CONFLICT</code> 'Related resource constraint violated'; <code>23502</code>: 400 <code>BAD_REQUEST</code> 'Missing required value'.",
    "Otherwise an error with an integer <code>statusCode</code> or <code>status</code> from 400-599 uses it, with <code>code</code> = <code>err.code</code> if it is a string, else a default (<code>BAD_REQUEST UNAUTHORIZED FORBIDDEN NOT_FOUND CONFLICT UNPROCESSABLE_ENTITY TOO_MANY_REQUESTS</code>, other 4xx <code>CLIENT_ERROR</code>, 5xx <code>INTERNAL_ERROR</code>), message <code>err.message</code>, and <code>details = err.details</code> for 4xx. A 429 with <code>err.retryAfter</code> adds header <code>Retry-After</code> (string). Anything else is a 500 <code>INTERNAL_ERROR</code>.",
    "For status &gt;= 500: in production the message is always <code>'Internal Server Error'</code> and there are no details or stack (unless <code>err.expose === true</code>, which keeps the message); in development the message is <code>err.message</code> (or <code>String(err)</code> for non-Errors, <code>'Unknown error'</code> for null/undefined) and <code>stack</code> is included when present. Include <code>requestId</code> in the error body when given. <code>shouldLog</code> is true exactly for status &gt;= 500.",
  ],
  example: `handleError(Object.assign(new Error('nope'), { statusCode: 404 })) // { status: 404, body: { error: { code: 'NOT_FOUND', message: 'nope' } }, ... }`,
  tags: ["errors","express","architecture","security"],
  estimatedMins: 45,
  xp: 45,
  starterFiles: [
    {
      name: "handleError.js",
      lang: "js",
      code: `// handleError.js
function handleError(err, options = {}) {
  // your code here
}

module.exports = handleError;`,
    },
  ],
  testFile: {
    name: "handleError_test.js",
    lang: "test",
    code: `const handleError = require('./handleError');

test('status_error', () => {
  const r = handleError(Object.assign(new Error('nope'), { statusCode: 404 })); expect(r.status).toBe(404); expect(r.body.error.code).toBe('NOT_FOUND');
});

test('hides_500_in_prod', () => {
  const r = handleError(new Error('db password is x'), { isProd: true }); expect(r.status).toBe(500); expect(r.body.error.message).toBe('Internal Server Error');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Use an if / else-if chain from most specific (Zod, parse errors, DB codes, JWT) to the generic <code>statusCode</code> case, with the 500 values as defaults you start from." },
    { order: 2, cost: 5, text: "Do the production-hiding step AFTER the chain, only when <code>status &gt;= 500</code>, so no code path can forget it." },
    { order: 3, cost: 15, text: "Build the body with conditional spreads: <code>...(details !== undefined &amp;&amp; { details })</code>." },
  ],
  hiddenTests: [
    { name: "validation_errors", code: `const err = { name: 'ZodError', issues: [{ path: ['user', 'email'], message: 'Invalid email' }, { path: [], message: 'Bad' }] };
const r = handleError(err);
assert(r.status === 400 && r.body.error.code === 'VALIDATION_ERROR' && r.body.error.message === 'Invalid request', JSON.stringify(r.body));
assert(r.body.error.details.length === 2 && r.body.error.details[0].path === 'user.email' && r.body.error.details[0].message === 'Invalid email' && r.body.error.details[1].path === '', 'details: ' + JSON.stringify(r.body.error.details));
assert(r.shouldLog === false, 'client errors are not logged');
const viaIssues = handleError({ issues: [{ path: ['a'], message: 'x' }] });
assert(viaIssues.status === 400, 'an issues array is enough');` },
    { name: "malformed_json_and_jwt", code: `const json = handleError(Object.assign(new SyntaxError('Unexpected token'), { type: 'entity.parse.failed' }));
assert(json.status === 400 && json.body.error.code === 'INVALID_JSON' && json.body.error.message === 'Malformed JSON body', JSON.stringify(json.body));
for (const name of ['JsonWebTokenError', 'TokenExpiredError']) {
  const e = new Error('jwt expired at 2024'); e.name = name;
  const r = handleError(e);
  assert(r.status === 401 && r.body.error.code === 'UNAUTHORIZED' && r.body.error.message === 'Invalid or expired token', name + ': ' + JSON.stringify(r.body));
}` },
    { name: "prisma_and_postgres_codes", code: `const mk = (code, extra) => Object.assign(new Error('internal db message with table names'), { code }, extra);
const dup = handleError(mk('P2002', { meta: { target: ['email'] } }));
assert(dup.status === 409 && dup.body.error.code === 'CONFLICT' && dup.body.error.message === 'Resource already exists', 'P2002');
assert(dup.body.error.details.fields.join() === 'email', 'conflicting fields are reported');
assert(handleError(mk('P2002')).body.error.details.fields.length === 0, 'missing meta gives an empty list');
const pg = handleError(mk('23505'));
assert(pg.status === 409 && pg.body.error.message === 'Resource already exists' && !('details' in pg.body.error), '23505');
const nf = handleError(mk('P2025'));
assert(nf.status === 404 && nf.body.error.code === 'NOT_FOUND' && nf.body.error.message === 'Resource not found', 'P2025');
const fk = handleError(mk('23503'));
assert(fk.status === 409 && fk.body.error.message === 'Related resource constraint violated', '23503');
const nn = handleError(mk('23502'));
assert(nn.status === 400 && nn.body.error.code === 'BAD_REQUEST' && nn.body.error.message === 'Missing required value', '23502');
for (const r of [dup, pg, nf, fk, nn]) assert(JSON.stringify(r.body).indexOf('table names') === -1, 'the raw database message is never exposed');` },
    { name: "errors_with_a_status", code: `const mk = (statusCode, message, extra) => Object.assign(new Error(message), { statusCode }, extra);
const cases = [[400, 'BAD_REQUEST'], [401, 'UNAUTHORIZED'], [403, 'FORBIDDEN'], [404, 'NOT_FOUND'], [409, 'CONFLICT'], [422, 'UNPROCESSABLE_ENTITY'], [429, 'TOO_MANY_REQUESTS'], [418, 'CLIENT_ERROR']];
for (const [status, c] of cases) {
  const r = handleError(mk(status, 'msg ' + status));
  assert(r.status === status && r.body.error.code === c && r.body.error.message === 'msg ' + status, status + ': ' + JSON.stringify(r.body));
  assert(r.shouldLog === false, 'not logged');
}
assert(handleError(Object.assign(new Error('x'), { status: 403 })).status === 403, 'status works as well as statusCode');` },
    { name: "custom_codes_and_details_for_client_errors", code: `const e = Object.assign(new Error('Out of stock'), { statusCode: 409, code: 'OUT_OF_STOCK', details: { sku: 'a1' } });
const r = handleError(e);
assert(r.body.error.code === 'OUT_OF_STOCK' && r.body.error.details.sku === 'a1', JSON.stringify(r.body));
const num = Object.assign(new Error('x'), { statusCode: 400, code: 12 });
assert(handleError(num).body.error.code === 'BAD_REQUEST', 'a non-string code is ignored');
const five = Object.assign(new Error('x'), { statusCode: 503, details: { secret: 1 } });
assert(!('details' in handleError(five, { isProd: false }).body.error), 'details are only copied for 4xx');` },
    { name: "rate_limit_headers", code: `const r = handleError(Object.assign(new Error('Slow down'), { statusCode: 429, retryAfter: 30 }));
assert(r.status === 429 && r.headers['Retry-After'] === '30', JSON.stringify(r.headers));
assert(Object.keys(handleError(new Error('x')).headers).length === 0, 'headers default to an empty object');
assert(Object.keys(handleError(Object.assign(new Error('x'), { statusCode: 429 })).headers).length === 0, 'no header without retryAfter');` },
    { name: "status_outside_400_to_599_is_ignored", code: `for (const s of [200, 302, 399, 600, 99, 'x', 404.5, null]) {
  const r = handleError(Object.assign(new Error('weird'), { statusCode: s }));
  assert(r.status === 500, 'statusCode ' + JSON.stringify(s) + ' must fall back to 500, got ' + r.status);
}` },
    { name: "unknown_errors_in_development_show_details", code: `const err = new Error('column "x" does not exist');
const r = handleError(err, { isProd: false });
assert(r.status === 500 && r.body.error.code === 'INTERNAL_ERROR', 'status and code');
assert(r.body.error.message === 'column "x" does not exist', 'dev shows the message');
assert(typeof r.body.error.stack === 'string' && r.body.error.stack.length > 0, 'and the stack');
assert(r.shouldLog === true, 'logged');` },
    { name: "unknown_errors_in_production_leak_nothing", code: `const err = new Error('connect ECONNREFUSED 10.0.0.5:5432');
const r = handleError(err, { isProd: true, requestId: 'req-1' });
assert(r.status === 500 && r.body.error.message === 'Internal Server Error' && r.body.error.code === 'INTERNAL_ERROR', 'generic');
assert(!('stack' in r.body.error) && !('details' in r.body.error), 'no stack or details');
assert(JSON.stringify(r.body).indexOf('10.0.0.5') === -1, 'internal addresses never leave the server');
assert(r.shouldLog === true, 'still logged on the server');` },
    { name: "five_hundred_with_status_in_prod_and_expose", code: `const e503 = Object.assign(new Error('replica lag 12s on db-3'), { statusCode: 503 });
const r = handleError(e503, { isProd: true });
assert(r.status === 503 && r.body.error.message === 'Internal Server Error' && r.body.error.code === 'INTERNAL_ERROR', 'hidden: ' + JSON.stringify(r.body));
const exposed = Object.assign(new Error('Service temporarily unavailable'), { statusCode: 503, expose: true });
const r2 = handleError(exposed, { isProd: true });
assert(r2.body.error.message === 'Service temporarily unavailable', 'expose keeps a deliberate message');
assert(r2.shouldLog === true, 'still a server error');
assert(handleError(e503, { isProd: false }).body.error.message === 'replica lag 12s on db-3', 'development shows it');` },
    { name: "non_error_values", code: `assert(handleError('just a string').body.error.message === 'just a string' && handleError('just a string').status === 500, 'string in dev');
assert(handleError(null).body.error.message === 'Unknown error' && handleError(undefined).body.error.message === 'Unknown error', 'null and undefined');
assert(handleError({ weird: true }, { isProd: true }).body.error.message === 'Internal Server Error', 'object in prod');
assert(handleError(42).status === 500, 'number');
assert(!('stack' in handleError('x').body.error), 'no stack for non-errors');` },
    { name: "request_id", code: `assert(handleError(new Error('x'), { requestId: 'abc-123' }).body.error.requestId === 'abc-123', '500');
assert(handleError(Object.assign(new Error('x'), { statusCode: 404 }), { requestId: 'r9' }).body.error.requestId === 'r9', '404');
assert(!('requestId' in handleError(new Error('x')).body.error), 'omitted when not given');` },
    { name: "body_shape_is_stable", code: `const r = handleError(Object.assign(new Error('nope'), { statusCode: 404 }));
assert(Object.keys(r).sort().join() === 'body,headers,shouldLog,status', 'result keys: ' + Object.keys(r));
assert(Object.keys(r.body).join() === 'error' && Object.keys(r.body.error).sort().join() === 'code,message', 'body keys: ' + JSON.stringify(r.body));` },
  ],
  solution: {
    code: `function handleError(err, { isProd = false, requestId } = {}) {
  const DEFAULT_CODES = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
  };
  const isObject = err !== null && typeof err === 'object';
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal Server Error';
  let details;
  const headers = {};

  const clientStatus = isObject ? err.statusCode || err.status : undefined;

  if (isObject && (err.name === 'ZodError' || Array.isArray(err.issues))) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request';
    details = err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
  } else if (isObject && err.type === 'entity.parse.failed') {
    status = 400;
    code = 'INVALID_JSON';
    message = 'Malformed JSON body';
  } else if (isObject && (err.code === 'P2002' || err.code === '23505')) {
    status = 409;
    code = 'CONFLICT';
    message = 'Resource already exists';
    if (err.code === 'P2002') details = { fields: (err.meta && err.meta.target) || [] };
  } else if (isObject && err.code === 'P2025') {
    status = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  } else if (isObject && err.code === '23503') {
    status = 409;
    code = 'CONFLICT';
    message = 'Related resource constraint violated';
  } else if (isObject && err.code === '23502') {
    status = 400;
    code = 'BAD_REQUEST';
    message = 'Missing required value';
  } else if (isObject && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    status = 401;
    code = 'UNAUTHORIZED';
    message = 'Invalid or expired token';
  } else if (Number.isInteger(clientStatus) && clientStatus >= 400 && clientStatus <= 599) {
    status = clientStatus;
    code = typeof err.code === 'string' ? err.code : DEFAULT_CODES[status] || (status >= 500 ? 'INTERNAL_ERROR' : 'CLIENT_ERROR');
    message = err.message;
    if (status < 500 && err.details !== undefined) details = err.details;
    if (status === 429 && err.retryAfter) headers['Retry-After'] = String(err.retryAfter);
  }

  let stack;
  if (status >= 500) {
    const expose = isObject && err.expose === true;
    if (isProd && !expose) {
      message = 'Internal Server Error';
      details = undefined;
    } else if (!isObject || !err.message) {
      message = err === null || err === undefined ? 'Unknown error' : String(err);
    } else {
      message = err.message;
    }
    if (!isProd && isObject && typeof err.stack === 'string') stack = err.stack;
    if (status >= 500 && !(isObject && Number.isInteger(clientStatus))) code = 'INTERNAL_ERROR';
  }

  const body = {
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
      ...(requestId && { requestId }),
      ...(stack && { stack }),
    },
  };
  return { status, headers, body, shouldLog: status >= 500 };
}

module.exports = handleError;`,
    explanation:
      "Known failure kinds are mapped explicitly to a status, a stable machine-readable code and a safe message. The production-hiding step is a single block after the mapping, applied to every 5xx, so no individual branch can leak a database message or stack trace by accident.",
  },
};
