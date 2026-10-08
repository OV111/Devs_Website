export default {
  slug: "http-client-interceptors",
  trackId: "mern",
  layerId: "mern-8",
  type: "CODE",
  difficulty: "hard",
  title: "Axios-style client with interceptors",
  summary: "Build an HTTP client with baseURL, request and response interceptors, and error handling for 4xx/5xx.",
  description:
    "Axios is popular because of interceptors: one place to attach auth headers, log requests, or turn error responses into something your UI understands. Underneath, it's a promise chain with a surprising ordering rule.",
  task:
    "Write <code>createClient({ baseURL = '', transport })</code>. <code>transport(config)</code> is an async function returning <code>{ status, data, headers }</code> (a fake <code>fetch</code>). The client has <code>request(config)</code>, <code>get</code>, <code>post</code>, <code>put</code>, <code>delete</code> and <code>interceptors.request / interceptors.response</code>, each with <code>use(onFulfilled, onRejected)</code> returning an id and <code>eject(id)</code>.",
  constraints: [
    "<code>config</code> is <code>{ method, url, headers, data }</code>; the method defaults to <code>'GET'</code>, headers to <code>{}</code>, and the method sent to the transport is upper-case.",
    "The final URL is <code>baseURL + '/' + url</code> with exactly one slash between them; an absolute <code>http(s)://</code> URL ignores <code>baseURL</code>.",
    "Request interceptors run in REVERSE order of registration (last added runs first, like Axios); response interceptors run in registration order. Interceptors may be async; each receives the previous one's result.",
    "A transport response with <code>status &gt;= 400</code> rejects with an <code>Error</code> that has <code>response</code> (the response) and <code>config</code> (the final config). A transport rejection (network error) passes through as is.",
    "Response interceptors behave like <code>.then(onFulfilled, onRejected)</code>: an <code>onRejected</code> that returns a value recovers the request; one that throws keeps it failing. Every resolved response has a <code>config</code> property with the final config.",
    "<code>get(url, config)</code>, <code>post(url, data, config)</code>, <code>put(url, data, config)</code>, <code>delete(url, config)</code> call <code>request</code> with the right method.",
  ],
  example: `api.interceptors.request.use((cfg) => ({ ...cfg, headers: { ...cfg.headers, Authorization: 'Bearer ' + token } }));`,
  tags: ["axios","interceptors","http","promises"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "createClient.js",
      lang: "js",
      code: `// createClient.js
function createClient(options) {
  // your code here
}

module.exports = createClient;`,
    },
  ],
  testFile: {
    name: "createClient_test.js",
    lang: "test",
    code: `const createClient = require('./createClient');

test('joins_base_url', () => {
  const calls = []; const c = createClient({ baseURL: 'http://api.x', transport: async (cfg) => { calls.push(cfg); return { status: 200, data: 1 }; } }); return c.get('/users').then(() => expect(calls[0].url).toBe('http://api.x/users'));
});

test('rejects_on_404', () => {
  const c = createClient({ transport: async () => ({ status: 404, data: null }) }); return c.get('/x').then(() => expect(true).toBe(false), (e) => expect(e.response.status).toBe(404));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Build the chain as an array of <code>[onFulfilled, onRejected]</code> pairs: request interceptors (iterated from last to first), then the <code>dispatch</code> function, then response interceptors (first to last); fold them with <code>promise = promise.then(f, r)</code>." },
    { order: 2, cost: 5, text: "<code>dispatch(config)</code> normalizes the config (uppercase method, joined URL), awaits <code>transport</code>, attaches <code>config</code> to the response and throws an Error with <code>response</code> and <code>config</code> when <code>status &gt;= 400</code>." },
    { order: 3, cost: 15, text: "Ejecting can simply set that slot of the interceptor array to <code>null</code>, and the chain builder skips nulls (so ids of the other interceptors stay valid)." },
  ],
  hiddenTests: [
    { name: "get_returns_the_response", code: `const calls = [];
const c = createClient({ transport: async (cfg) => { calls.push(cfg); return { status: 200, data: { ok: true }, headers: { a: 'b' } }; } });
const res = await c.get('/users');
assert(res.status === 200 && res.data.ok === true && res.headers.a === 'b', 'response passes through');
assert(calls[0].method === 'GET' && calls[0].url === '/users', 'config: ' + JSON.stringify(calls[0]));` },
    { name: "base_url_joining", code: `const urls = [];
const mkc = (baseURL) => createClient({ baseURL, transport: async (cfg) => { urls.push(cfg.url); return { status: 200 }; } });
await mkc('http://api.x').get('/users');
await mkc('http://api.x/').get('/users');
await mkc('http://api.x/').get('users');
await mkc('http://api.x//').get('//users');
await mkc('http://api.x').get('https://other.io/a');
await mkc('').get('/plain');
assert(urls.join(' ') === 'http://api.x/users http://api.x/users http://api.x/users http://api.x/users https://other.io/a /plain', urls.join(' '));` },
    { name: "methods_and_data", code: `const calls = [];
const c = createClient({ transport: async (cfg) => { calls.push(cfg); return { status: 200 }; } });
await c.post('/a', { x: 1 }); await c.put('/b', { y: 2 }); await c.delete('/c'); await c.request({ method: 'patch', url: '/d', data: 3 });
assert(calls.map((x) => x.method).join(',') === 'POST,PUT,DELETE,PATCH', 'methods: ' + calls.map((x) => x.method));
assert(calls[0].data.x === 1 && calls[1].data.y === 2 && calls[3].data === 3, 'data passed');
assert(typeof calls[2].headers === 'object', 'headers default to an object');` },
    { name: "request_interceptor_changes_config_async", code: `let seen;
const c = createClient({ transport: async (cfg) => { seen = cfg; return { status: 200 }; } });
c.interceptors.request.use(async (cfg) => { await null; return { ...cfg, headers: { ...cfg.headers, Authorization: 'Bearer t' } }; });
await c.get('/x', { headers: { 'X-A': '1' } });
assert(seen.headers.Authorization === 'Bearer t' && seen.headers['X-A'] === '1', 'headers merged: ' + JSON.stringify(seen.headers));` },
    { name: "request_interceptors_run_in_reverse", code: `const order = [];
const c = createClient({ transport: async () => ({ status: 200 }) });
c.interceptors.request.use((cfg) => { order.push('first-added'); return cfg; });
c.interceptors.request.use((cfg) => { order.push('second-added'); return cfg; });
c.interceptors.request.use((cfg) => { order.push('third-added'); return cfg; });
await c.get('/x');
assert(order.join(',') === 'third-added,second-added,first-added', 'order: ' + order);` },
    { name: "response_interceptors_run_in_order_and_transform", code: `const c = createClient({ transport: async () => ({ status: 200, data: 1 }) });
c.interceptors.response.use((res) => ({ ...res, data: res.data + 1 }));
c.interceptors.response.use((res) => ({ ...res, data: res.data * 10 }));
const res = await c.get('/x');
assert(res.data === 20, '(1+1)*10, got ' + res.data);` },
    { name: "error_status_rejects_with_response_and_config", code: `const c = createClient({ baseURL: 'http://a', transport: async () => ({ status: 500, data: { msg: 'boom' } }) });
let err = null;
try { await c.get('/x'); } catch (e) { err = e; }
assert(err instanceof Error, 'an Error');
assert(err.response.status === 500 && err.response.data.msg === 'boom', 'response attached');
assert(err.config.url === 'http://a/x' && err.config.method === 'GET', 'final config attached');
const ok = createClient({ transport: async () => ({ status: 399 }) });
assert((await ok.get('/x')).status === 399, 'below 400 resolves');` },
    { name: "response_error_interceptor_can_recover", code: `const c = createClient({ transport: async () => ({ status: 401, data: 'no' }) });
c.interceptors.response.use((r) => r, (err) => ({ status: 200, data: 'recovered from ' + err.response.status }));
const res = await c.get('/x');
assert(res.data === 'recovered from 401', 'recovered: ' + JSON.stringify(res));` },
    { name: "response_error_interceptor_can_rethrow_or_map", code: `const c = createClient({ transport: async () => ({ status: 403 }) });
c.interceptors.response.use((r) => r, (err) => { const mapped = new Error('Forbidden: please log in'); mapped.status = err.response.status; throw mapped; });
let got = null;
try { await c.get('/x'); } catch (e) { got = e; }
assert(got && got.message === 'Forbidden: please log in' && got.status === 403, 'mapped error reaches the caller');` },
    { name: "network_errors_pass_through", code: `const net = new Error('ECONNRESET');
const c = createClient({ transport: async () => { throw net; } });
let got = null;
try { await c.get('/x'); } catch (e) { got = e; }
assert(got === net, 'same error object');
let seen = null;
c.interceptors.response.use((r) => r, (err) => { seen = err; throw err; });
try { await c.get('/x'); } catch (e) {}
assert(seen === net, 'response onRejected also sees network errors');` },
    { name: "eject_removes_interceptors", code: `let calls = 0;
const c = createClient({ transport: async () => ({ status: 200 }) });
const id = c.interceptors.request.use((cfg) => { calls++; return cfg; });
const rid = c.interceptors.response.use((r) => { calls += 10; return r; });
await c.get('/x');
c.interceptors.request.eject(id); c.interceptors.response.eject(rid);
await c.get('/x');
assert(calls === 11, 'only the first request used them: ' + calls);` },
    { name: "eject_keeps_other_ids_valid", code: `const order = [];
const c = createClient({ transport: async () => ({ status: 200 }) });
const a = c.interceptors.request.use((cfg) => { order.push('a'); return cfg; });
const b = c.interceptors.request.use((cfg) => { order.push('b'); return cfg; });
c.interceptors.request.eject(a);
await c.get('/x');
c.interceptors.request.eject(b);
await c.get('/x');
assert(order.join('') === 'b', 'order: ' + order);` },
    { name: "resolved_response_carries_final_config", code: `const c = createClient({ baseURL: 'http://a', transport: async () => ({ status: 200 }) });
c.interceptors.request.use((cfg) => ({ ...cfg, url: '/rewritten' }));
const res = await c.get('/original');
assert(res.config.url === 'http://a/rewritten' && res.config.method === 'GET', 'config: ' + JSON.stringify(res.config));` },
    { name: "request_interceptor_error_rejects_without_calling_transport", code: `let sent = 0;
const c = createClient({ transport: async () => { sent++; return { status: 200 }; } });
c.interceptors.request.use(() => { throw new Error('blocked'); });
let got = null;
try { await c.get('/x'); } catch (e) { got = e; }
assert(got && got.message === 'blocked' && sent === 0, 'transport never called');` },
  ],
  solution: {
    code: `function createClient({ baseURL = '', transport }) {
  const requestList = [];
  const responseList = [];

  const manager = (list) => ({
    use(onFulfilled, onRejected) {
      list.push({ onFulfilled, onRejected });
      return list.length - 1;
    },
    eject(id) {
      list[id] = null;
    },
  });

  const join = (base, url) =>
    /^https?:\\/\\//i.test(url) || !base ? url : base.replace(/\\/+$/, '') + '/' + url.replace(/^\\/+/, '');

  async function dispatch(config) {
    const final = { ...config, method: config.method.toUpperCase(), url: join(baseURL, config.url) };
    const response = await transport(final);
    const result = { ...response, config: final };
    if (result.status >= 400) {
      const err = new Error('Request failed with status ' + result.status);
      err.response = result;
      err.config = final;
      throw err;
    }
    return result;
  }

  function request(config) {
    let promise = Promise.resolve({ method: 'GET', headers: {}, ...config });
    const chain = [];
    for (let i = requestList.length - 1; i >= 0; i--) {
      if (requestList[i]) chain.push(requestList[i].onFulfilled, requestList[i].onRejected);
    }
    chain.push(dispatch, undefined);
    for (const item of responseList) {
      if (item) chain.push(item.onFulfilled, item.onRejected);
    }
    for (let i = 0; i < chain.length; i += 2) {
      promise = promise.then(chain[i], chain[i + 1]);
    }
    return promise;
  }

  return {
    request,
    get: (url, config) => request({ ...config, method: 'GET', url }),
    post: (url, data, config) => request({ ...config, method: 'POST', url, data }),
    put: (url, data, config) => request({ ...config, method: 'PUT', url, data }),
    delete: (url, config) => request({ ...config, method: 'DELETE', url }),
    interceptors: { request: manager(requestList), response: manager(responseList) },
  };
}

module.exports = createClient;`,
    explanation:
      "Everything is one promise chain: request interceptors, then the real call, then response interceptors, each as a then(onFulfilled, onRejected) pair. That is why an onRejected can recover or rethrow, and why the odd 'request interceptors run in reverse' rule exists: they are unshifted onto the front of the chain.",
  },
};
