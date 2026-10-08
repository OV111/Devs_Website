export default {
  slug: "request-tester",
  trackId: "node-dev",
  layerId: "node-dev-8",
  type: "CODE",
  difficulty: "hard",
  title: "Write a mini Supertest",
  summary: "A fluent request builder with chained expectations for status, headers and body, that runs when awaited.",
  description:
    "Supertest lets you test an API without opening a port: <code>await request(app).get('/users').expect(200).expect('Content-Type', /json/)</code>. The surprise is that the chain is lazy: nothing runs until <code>then</code> is called, which is why <code>await</code> triggers it.",
  task:
    "Write <code>request(app)</code>. <code>app(req)</code> is an async function taking <code>{ method, url, headers, body }</code> and returning <code>{ status, headers, body }</code>. The result has <code>get/post/put/patch/delete(url)</code> returning a thenable test with <code>set, query, send, expect</code>.",
  constraints: [
    "<code>set(name, value)</code> or <code>set({ ... })</code> adds request headers, stored with LOWERCASE names (values as strings). <code>query(obj)</code> appends <code>?a=1&amp;b=2</code> (or <code>&amp;</code> if the URL already has a <code>?</code>), URL-encoding names and values; array values repeat the name. <code>send(body)</code> sets the body; an object body adds <code>content-type: application/json</code> unless the caller set one. The method sent to <code>app</code> is upper-case.",
    "Nothing runs until the test is awaited (<code>then</code>/<code>catch</code>); the request runs ONCE even if awaited several times. It resolves with the response <code>{ status, headers (lowercased names), body, text }</code> where <code>text</code> is the body if it is a string, else its JSON.",
    "<code>expect(number)</code>: status. <code>expect(name, valueOrRegExp)</code>: response header (name case-insensitive). <code>expect(fn)</code>: custom check <code>fn(res)</code>; it fails by throwing, or by returning an <code>Error</code> or a non-empty string. <code>expect(objectOrString)</code>: the body must deep-equal it. Expectations run in the order added; the FIRST failure rejects.",
    "Failures are <code>Error</code>s with <code>name: 'AssertionError'</code> and a <code>response</code> property. Messages: status <code>expected 200 \"OK\", got 404 \"Not Found\"</code>; header <code>expected \"content-type\" header to equal \"text/html\", got \"application/json\"</code> or <code>to match /json/, got ...</code> (use <code>JSON.stringify</code> for the quoted parts, so a missing header shows <code>undefined</code>); body <code>expected body {...}, got {...}</code> (both JSON). Status texts: 200 OK, 201 Created, 204 No Content, 301 Moved Permanently, 302 Found, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error, otherwise <code>Unknown</code>.",
    "If <code>app</code> throws or rejects, the test rejects with that error (expectations are not evaluated).",
  ],
  example: `const res = await request(app).post('/users').send({ name: 'Ann' }).expect(201).expect('location', /\\/users\\/\\d+/);`,
  tags: ["testing","supertest","http","api"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "request.js",
      lang: "js",
      code: `// request.js
function request(app) {
  // your code here
}

module.exports = request;`,
    },
  ],
  testFile: {
    name: "request_test.js",
    lang: "test",
    code: `const request = require('./request');

test('ok', () => {
  const app = async () => ({ status: 200, body: { ok: true } }); return request(app).get('/x').expect(200).then((res) => expect(res.body.ok).toBe(true));
});

test('wrong_status', () => {
  const app = async () => ({ status: 404 }); return request(app).get('/x').expect(200).then(() => expect(true).toBe(false), (e) => expect(e.message).toBe('expected 200 "OK", got 404 "Not Found"'));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "The test object stores its configuration (headers, body, query, expectations) in closure state; <code>then(resolve, reject)</code> memoizes a single <code>execute()</code> promise and chains onto it." },
    { order: 2, cost: 5, text: "Normalize the app's response (lowercase header names, compute <code>text</code>) before running expectations, so header checks are case-insensitive." },
    { order: 3, cost: 15, text: "One <code>check(args, res)</code> function can dispatch on the argument types: number, function, string plus second argument, or body." },
  ],
  hiddenTests: [
    { name: "get_passes_method_url_and_headers_to_the_app", code: `let seen;
const app = async (req) => { seen = req; return { status: 200 }; };
await request(app).get('/users/1').set('X-Token', 'abc').set({ Accept: 'application/json', 'X-N': 5 });
assert(seen.method === 'GET' && seen.url === '/users/1', 'method and url');
assert(seen.headers['x-token'] === 'abc' && seen.headers.accept === 'application/json' && seen.headers['x-n'] === '5', 'lowercase header names and string values: ' + JSON.stringify(seen.headers));` },
    { name: "all_http_methods", code: `const methods = [];
const app = async (req) => { methods.push(req.method); return { status: 200 }; };
const r = request(app);
await r.get('/'); await r.post('/'); await r.put('/'); await r.patch('/'); await r.delete('/');
assert(methods.join() === 'GET,POST,PUT,PATCH,DELETE', methods.join());` },
    { name: "send_json_body_sets_content_type", code: `let seen;
const app = async (req) => { seen = req; return { status: 201 }; };
await request(app).post('/users').send({ name: 'Ann' });
assert(seen.body.name === 'Ann' && seen.headers['content-type'] === 'application/json', JSON.stringify(seen));
await request(app).post('/users').set('Content-Type', 'application/vnd.api+json').send({ a: 1 });
assert(seen.headers['content-type'] === 'application/vnd.api+json', 'a caller-supplied content type is kept');
await request(app).post('/raw').send('plain text');
assert(seen.body === 'plain text' && !('content-type' in seen.headers), 'string bodies are sent as they are');
await request(app).get('/nobody');
assert(seen.body === undefined, 'no body unless send() is called');` },
    { name: "query_strings", code: `const urls = [];
const app = async (req) => { urls.push(req.url); return { status: 200 }; };
await request(app).get('/users').query({ page: 2, q: 'a b&c' });
await request(app).get('/users?sort=name').query({ page: 1 });
await request(app).get('/users').query({ tag: ['x', 'y'] });
await request(app).get('/users').query({});
assert(urls[0] === '/users?page=2&q=a%20b%26c', urls[0]);
assert(urls[1] === '/users?sort=name&page=1', urls[1]);
assert(urls[2] === '/users?tag=x&tag=y', urls[2]);
assert(urls[3] === '/users', 'empty query adds nothing: ' + urls[3]);` },
    { name: "response_is_normalized", code: `const app = async () => ({ status: 200, headers: { 'Content-Type': 'application/json', 'X-Id': '7' }, body: { a: 1 } });
const res = await request(app).get('/');
assert(res.status === 200 && res.body.a === 1, 'status and body');
assert(res.headers['content-type'] === 'application/json' && res.headers['x-id'] === '7' && !('Content-Type' in res.headers), 'lowercased headers');
assert(res.text === '{"a":1}', 'text is the JSON body: ' + res.text);
const str = await request(async () => ({ status: 200, body: 'hello' })).get('/');
assert(str.text === 'hello' && str.body === 'hello', 'string body is its own text');
const none = await request(async () => ({ status: 204 })).get('/');
assert(none.headers && Object.keys(none.headers).length === 0, 'missing headers become an empty object');` },
    { name: "is_lazy_and_runs_once", code: `let calls = 0;
const app = async () => { calls++; return { status: 200 }; };
const t = request(app).get('/').expect(200);
assert(calls === 0, 'nothing runs until awaited');
await t; await t;
assert(calls === 1, 'awaiting twice does not repeat the request, calls=' + calls);
const viaThen = await new Promise((resolve) => request(app).get('/').then(resolve));
assert(viaThen.status === 200 && calls === 2, 'then() works directly');` },
    { name: "catch_is_supported", code: `let msg = null;
await request(async () => ({ status: 500 })).get('/').expect(200).catch((e) => { msg = e.name; });
assert(msg === 'AssertionError', 'catch receives the failure: ' + msg);` },
    { name: "status_expectation_messages", code: `const run = async (status, want) => { let err = null; try { await request(async () => ({ status })).get('/').expect(want); } catch (e) { err = e; } return err; };
const e1 = await run(404, 200);
assert(e1.name === 'AssertionError' && e1.message === 'expected 200 "OK", got 404 "Not Found"', e1.message);
assert((await run(500, 201)).message === 'expected 201 "Created", got 500 "Internal Server Error"', 'texts');
assert((await run(418, 204)).message === 'expected 204 "No Content", got 418 "Unknown"', 'unknown status text');
assert((await run(200, 200)) === null, 'passing status');
assert(e1.response.status === 404, 'the failure carries the response');` },
    { name: "header_expectations", code: `const app = async () => ({ status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Request-Id': 'r1' } });
const fail = async (build) => { try { await build(request(app).get('/')); return null; } catch (e) { return e.message; } };
assert(await fail((t) => t.expect('Content-Type', /json/).expect('x-request-id', 'r1')) === null, 'regex and string match, case-insensitive names');
assert(await fail((t) => t.expect('X-Request-Id', 'other')) === 'expected "x-request-id" header to equal "other", got "r1"', 'equality message');
assert(await fail((t) => t.expect('content-type', /html/)) === 'expected "content-type" header to match /html/, got "application/json; charset=utf-8"', 'regex message');
assert(await fail((t) => t.expect('x-missing', 'v')) === 'expected "x-missing" header to equal "v", got undefined', 'missing header');
assert(await fail((t) => t.expect('x-missing', /v/)) === 'expected "x-missing" header to match /v/, got undefined', 'missing header with a regex');` },
    { name: "body_expectations", code: `const app = async () => ({ status: 200, body: { id: 1, tags: ['a'] } });
const fail = async (b) => { try { await request(app).get('/').expect(b); return null; } catch (e) { return e.message; } };
assert(await fail({ id: 1, tags: ['a'] }) === null, 'deep equal passes');
assert(await fail({ id: 2, tags: ['a'] }) === 'expected body {"id":2,"tags":["a"]}, got {"id":1,"tags":["a"]}', 'message');
assert(await fail({ id: 1 }) !== null, 'extra keys in the response are a mismatch (exact body)');
const text = async (b) => { try { await request(async () => ({ status: 200, body: 'hi' })).get('/').expect(b); return null; } catch (e) { return e.message; } };
assert(await text('hi') === null && await text('bye') === 'expected body "bye", got "hi"', 'string body');` },
    { name: "custom_expectations", code: `const app = async () => ({ status: 200, body: { items: [1, 2, 3] } });
let seen;
await request(app).get('/').expect((res) => { seen = res.body.items.length; });
assert(seen === 3, 'receives the response');
const fail = async (fn) => { try { await request(app).get('/').expect(fn); return null; } catch (e) { return e; } };
const thrown = new Error('too few items');
assert(await fail(() => { throw thrown; }) === thrown, 'a thrown error is the failure as is');
assert((await fail(() => new Error('returned error'))).message === 'returned error', 'a returned Error fails');
assert((await fail(() => 'something is wrong')).message === 'something is wrong', 'a returned string fails');
assert(await fail(() => undefined) === null && await fail(() => '') === null, 'undefined or empty string passes');` },
    { name: "expectations_run_in_order_and_first_failure_wins", code: `const order = [];
const app = async () => ({ status: 404, headers: { 'x-a': '1' } });
let err = null;
try {
  await request(app).get('/')
    .expect(() => { order.push('first'); })
    .expect(200)
    .expect(() => { order.push('after-failure'); })
    .expect('x-a', 'wrong');
} catch (e) { err = e; }
assert(err.message === 'expected 200 "OK", got 404 "Not Found"', 'the status failure: ' + err.message);
assert(order.join() === 'first', 'later expectations never ran: ' + order);` },
    { name: "app_errors_reject_the_test", code: `const boom = new Error('app crashed');
let expectationRan = false;
let err = null;
try { await request(async () => { throw boom; }).get('/').expect(() => { expectationRan = true; }); } catch (e) { err = e; }
assert(err === boom && expectationRan === false, 'the original error and no expectations');
let syncErr = null;
try { await request(() => { throw new Error('sync'); }).get('/'); } catch (e) { syncErr = e; }
assert(syncErr && syncErr.message === 'sync', 'sync throws too');` },
    { name: "builder_methods_are_chainable_in_any_order", code: `let seen;
const app = async (req) => { seen = req; return { status: 201 }; };
const t = request(app).post('/x');
assert(t.set('a', '1') === t && t.query({ q: 1 }) === t && t.send({}) === t && t.expect(201) === t, 'every builder method returns the test');
await t;
assert(seen.url === '/x?q=1' && seen.headers.a === '1', JSON.stringify(seen));` },
    { name: "each_request_is_independent", code: `const seen = [];
const app = async (req) => { seen.push(req); return { status: 200 }; };
const r = request(app);
await r.get('/a').set('X-One', '1');
await r.get('/b');
assert(seen[0].headers['x-one'] === '1' && !('x-one' in seen[1].headers), 'headers do not leak between requests');` },
  ],
  solution: {
    code: `function request(app) {
  const STATUS_TEXT = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  };
  const statusText = (code) => STATUS_TEXT[code] || 'Unknown';

  function deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((key) => key in b && deepEqual(a[key], b[key]));
  }

  function fail(message, res) {
    const error = new Error(message);
    error.name = 'AssertionError';
    error.response = res;
    return error;
  }

  function check(args, res) {
    const [first, second] = args;
    if (typeof first === 'number') {
      if (res.status !== first) {
        throw fail(
          'expected ' + first + ' "' + statusText(first) + '", got ' + res.status + ' "' + statusText(res.status) + '"',
          res,
        );
      }
    } else if (typeof first === 'function') {
      const result = first(res);
      if (result instanceof Error) throw result;
      if (typeof result === 'string' && result !== '') throw new Error(result);
    } else if (typeof first === 'string' && second !== undefined) {
      const name = first.toLowerCase();
      const actual = res.headers[name];
      if (second instanceof RegExp) {
        if (typeof actual !== 'string' || !second.test(actual)) {
          throw fail('expected ' + JSON.stringify(name) + ' header to match ' + second + ', got ' + JSON.stringify(actual), res);
        }
      } else if (actual !== String(second)) {
        throw fail(
          'expected ' + JSON.stringify(name) + ' header to equal ' + JSON.stringify(second) + ', got ' + JSON.stringify(actual),
          res,
        );
      }
    } else if (!deepEqual(first, res.body)) {
      throw fail('expected body ' + JSON.stringify(first) + ', got ' + JSON.stringify(res.body), res);
    }
  }

  function makeTest(method, url) {
    const state = { headers: {}, body: undefined, query: null, expectations: [] };
    let promise = null;

    async function execute() {
      let target = url;
      if (state.query) {
        const qs = Object.entries(state.query)
          .flatMap(([key, value]) => [].concat(value).map((v) => encodeURIComponent(key) + '=' + encodeURIComponent(v)))
          .join('&');
        if (qs) target += (url.includes('?') ? '&' : '?') + qs;
      }
      const headers = { ...state.headers };
      if (state.body !== null && typeof state.body === 'object' && !headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
      const raw = await app({ method: method.toUpperCase(), url: target, headers, body: state.body });
      const responseHeaders = {};
      for (const [name, value] of Object.entries(raw.headers || {})) responseHeaders[name.toLowerCase()] = String(value);
      const res = {
        status: raw.status,
        headers: responseHeaders,
        body: raw.body,
        text: typeof raw.body === 'string' ? raw.body : raw.body === undefined ? '' : JSON.stringify(raw.body),
      };
      for (const args of state.expectations) check(args, res);
      return res;
    }

    const run = () => {
      if (!promise) promise = execute();
      return promise;
    };

    const test = {
      set(name, value) {
        const entries = typeof name === 'object' ? Object.entries(name) : [[name, value]];
        for (const [key, v] of entries) state.headers[key.toLowerCase()] = String(v);
        return test;
      },
      query(params) {
        state.query = params;
        return test;
      },
      send(body) {
        state.body = body;
        return test;
      },
      expect(...args) {
        state.expectations.push(args);
        return test;
      },
      then(resolve, reject) {
        return run().then(resolve, reject);
      },
      catch(reject) {
        return run().catch(reject);
      },
    };
    return test;
  }

  return {
    get: (url) => makeTest('GET', url),
    post: (url) => makeTest('POST', url),
    put: (url) => makeTest('PUT', url),
    patch: (url) => makeTest('PATCH', url),
    delete: (url) => makeTest('DELETE', url),
  };
}

module.exports = request;`,
    explanation:
      "The test object is a lazily executed description of a request plus a list of expectations. Implementing then() (and catch()) makes it a thenable, so await starts the single execution, and the first failing expectation turns into the rejection.",
  },
};
