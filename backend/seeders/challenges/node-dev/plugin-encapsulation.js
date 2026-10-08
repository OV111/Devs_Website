export default {
  slug: "plugin-encapsulation",
  trackId: "node-dev",
  layerId: "node-dev-4",
  type: "CODE",
  difficulty: "hard",
  title: "Fastify-style plugins and encapsulation",
  summary: "Build a tiny app where plugins get their own scope: decorators, hooks and prefixes stay inside it.",
  description:
    "Encapsulation is Fastify's core idea. Each <code>register</code> creates a child scope that inherits its parent's decorators and hooks, but whatever the child adds stays invisible to its parent and siblings. That's how you keep a database plugin or an auth hook from leaking into unrelated routes.",
  task:
    "Write <code>createApp()</code> returning an app with <code>decorate, hasDecorator, addHook, route, get, post, register, ready, inject</code>.",
  constraints: [
    "<code>register(plugin, { prefix })</code> queues <code>plugin(instance, opts)</code> (may be async). <code>ready()</code> runs the queue in registration order, depth-first: a plugin and all of ITS children finish before its next sibling starts. <code>ready()</code> is idempotent; <code>register</code> after ready throws.",
    "Each plugin gets a new instance whose prefix is the parent's prefix plus <code>opts.prefix</code>. Routes are mounted at <code>prefix + url</code> (slashes normalized, no trailing slash except <code>/</code>).",
    "<code>decorate(name, value)</code> makes <code>instance[name]</code> available in that instance, its later children, and as <code>this</code> inside its handlers and hooks. It throws if the name is already visible (inherited, own, or an app method like <code>get</code>). <code>hasDecorator(name)</code> reports visibility.",
    "<code>addHook('onRequest' | 'preHandler', fn)</code> (anything else throws). A child starts with a COPY of its parent's hooks; hooks run for every route of that scope (wherever in the scope they were added): all <code>onRequest</code> hooks, then all <code>preHandler</code> hooks, each in order added, then the handler.",
    "<code>inject({ method, url, body })</code> (awaits ready) returns <code>{ status, body }</code>. Hooks and handlers are called as <code>fn.call(instance, req, reply)</code> with <code>req = { method, url, body }</code> and <code>reply = { status(code), send(body), sent }</code>; if a hook sends, the pipeline stops. A returned non-undefined handler value is sent with the current status (default 200). A thrown error gives <code>{ status: err.statusCode || 500, body: { error: err.message } }</code>. No matching route gives <code>404</code> with <code>{ error: 'Not Found' }</code>.",
  ],
  example: `app.register(async (api) => { api.decorate('db', db); api.get('/users', function () { return this.db.all(); }); }, { prefix: '/api' });`,
  tags: ["fastify","plugins","encapsulation","architecture"],
  estimatedMins: 60,
  xp: 70,
  starterFiles: [
    {
      name: "createApp.js",
      lang: "js",
      code: `// createApp.js
function createApp() {
  // your code here
}

module.exports = createApp;`,
    },
  ],
  testFile: {
    name: "createApp_test.js",
    lang: "test",
    code: `const createApp = require('./createApp');

test('route', () => {
  const app = createApp(); app.get('/hi', () => 'yo'); return app.inject({ method: 'GET', url: '/hi' }).then((r) => expect(r).toEqual({ status: 200, body: 'yo' }));
});

test('404', () => {
  return createApp().inject({ method: 'GET', url: '/x' }).then((r) => expect(r.status).toBe(404));
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Make a <code>makeContext(parent, prefix)</code> that builds an instance object plus private state (decorator Map, hooks arrays, queue of child plugins). A child copies its parent's decorator Map and hook arrays at creation." },
    { order: 2, cost: 5, text: "<code>ready()</code> calls an async <code>load(ctx)</code>: for each queued plugin, create the child context, <code>await plugin(child.instance, opts)</code>, then <code>await load(child)</code> to run ITS queue before moving to the next sibling." },
    { order: 3, cost: 15, text: "Store every route in one flat list with its context; at inject time run <code>[...ctx.hooks.onRequest, ...ctx.hooks.preHandler]</code> then the handler, checking <code>sent</code> after each step." },
  ],
  hiddenTests: [
    { name: "basic_routes_and_methods", code: `const app = createApp();
app.get('/a', () => 'get-a'); app.post('/a', () => 'post-a');
assert((await app.inject({ method: 'GET', url: '/a' })).body === 'get-a', 'GET');
assert((await app.inject({ method: 'post', url: '/a' })).body === 'post-a', 'POST, case-insensitive');
const r = await app.inject({ method: 'GET', url: '/nope' });
assert(r.status === 404 && r.body.error === 'Not Found', '404');` },
    { name: "reply_status_and_send_and_return", code: `const app = createApp();
app.get('/made', (req, reply) => { reply.status(201).send({ ok: true }); });
app.get('/returned', () => ({ n: 1 }));
const a = await app.inject({ method: 'GET', url: '/made' });
assert(a.status === 201 && a.body.ok === true, 'status and send');
const b = await app.inject({ method: 'GET', url: '/returned' });
assert(b.status === 200 && b.body.n === 1, 'return value is sent with 200');` },
    { name: "request_object_and_async_handlers", code: `const app = createApp();
app.post('/echo', async (req) => { await new Promise((r) => setTimeout(r, 2)); return { m: req.method, u: req.url, b: req.body }; });
const r = await app.inject({ method: 'POST', url: '/echo', body: { x: 1 } });
assert(r.body.m === 'POST' && r.body.u === '/echo' && r.body.b.x === 1, 'req: ' + JSON.stringify(r.body));` },
    { name: "prefix_and_nested_prefix", code: `const app = createApp();
app.register(async (api) => {
  api.get('/', () => 'root');
  api.get('/users', () => 'users');
  api.register(async (v1) => { v1.get('/ping', () => 'ping'); }, { prefix: '/v1' });
}, { prefix: '/api' });
app.get('/', () => 'top');
assert((await app.inject({ method: 'GET', url: '/api' })).body === 'root', '/api');
assert((await app.inject({ method: 'GET', url: '/api/users' })).body === 'users', '/api/users');
assert((await app.inject({ method: 'GET', url: '/api/v1/ping' })).body === 'ping', 'nested prefix');
assert((await app.inject({ method: 'GET', url: '/' })).body === 'top', 'root route');
assert((await app.inject({ method: 'GET', url: '/users' })).status === 404, 'not mounted without the prefix');` },
    { name: "plugins_run_in_order_depth_first_and_awaited", code: `const trace = []; const app = createApp();
app.register(async (a) => {
  trace.push('a:start');
  a.register(async () => { await new Promise((r) => setTimeout(r, 5)); trace.push('a1'); });
  a.register(async () => { trace.push('a2'); });
  trace.push('a:end');
});
app.register(async () => { trace.push('b'); });
await app.ready();
assert(trace.join(',') === 'a:start,a:end,a1,a2,b', 'order: ' + trace);` },
    { name: "ready_is_idempotent_and_register_after_ready_throws", code: `let runs = 0; const app = createApp();
app.register(async () => { runs++; });
await app.ready(); await app.ready(); await app.inject({ method: 'GET', url: '/x' });
assert(runs === 1, 'plugin ran once, ran ' + runs);
let threw = false;
try { app.register(async () => {}); } catch (e) { threw = true; }
assert(threw, 'register after ready throws');` },
    { name: "decorators_are_available_as_this_and_on_the_instance", code: `const app = createApp();
app.register(async (api) => {
  api.decorate('db', { find: () => 'row' });
  assert(api.db.find() === 'row' && api.hasDecorator('db') === true, 'on the instance');
  api.get('/x', function () { return this.db.find(); });
});
assert((await app.inject({ method: 'GET', url: '/x' })).body === 'row', 'this.db in handlers');` },
    { name: "decorators_are_inherited_by_children", code: `const app = createApp();
app.decorate('config', { env: 'test' });
app.register(async (child) => {
  assert(child.hasDecorator('config') === true && child.config.env === 'test', 'child sees parent decorator');
  child.register(async (grandchild) => {
    grandchild.get('/e', function () { return this.config.env; });
  });
});
assert((await app.inject({ method: 'GET', url: '/e' })).body === 'test', 'grandchild handler sees it too');` },
    { name: "decorators_do_not_leak_to_parent_or_siblings", code: `let parentSees = null; let siblingSees = null;
const app = createApp();
app.register(async (a) => { a.decorate('secret', 42); });
app.register(async (b) => { siblingSees = b.hasDecorator('secret'); b.get('/b', function () { return typeof this.secret; }); });
app.get('/root', function () { return typeof this.secret; });
await app.ready();
parentSees = app.hasDecorator('secret');
assert(parentSees === false, 'parent does not see child decorators');
assert(siblingSees === false, 'sibling does not either');
assert((await app.inject({ method: 'GET', url: '/b' })).body === 'undefined', 'sibling handler');
assert((await app.inject({ method: 'GET', url: '/root' })).body === 'undefined', 'root handler');` },
    { name: "duplicate_decorators_throw", code: `const app = createApp();
app.decorate('x', 1);
let e1 = false; let e2 = false; let e3 = false;
try { app.decorate('x', 2); } catch (e) { e1 = true; }
try { app.decorate('get', 2); } catch (e) { e2 = true; }
app.register(async (child) => { try { child.decorate('x', 3); } catch (e) { e3 = true; } });
await app.ready();
assert(e1 && e2 && e3, 'own, app-method and inherited collisions all throw: ' + [e1, e2, e3]);` },
    { name: "hook_order_onRequest_then_preHandler_then_handler", code: `const trace = []; const app = createApp();
app.addHook('preHandler', async () => { trace.push('pre1'); });
app.addHook('onRequest', async () => { trace.push('req1'); });
app.addHook('onRequest', async () => { trace.push('req2'); });
app.addHook('preHandler', async () => { trace.push('pre2'); });
app.get('/x', () => { trace.push('handler'); return 'ok'; });
await app.inject({ method: 'GET', url: '/x' });
assert(trace.join(',') === 'req1,req2,pre1,pre2,handler', 'order: ' + trace);` },
    { name: "parent_hooks_run_for_child_routes_first", code: `const trace = []; const app = createApp();
app.addHook('onRequest', async () => { trace.push('parent'); });
app.register(async (child) => {
  child.addHook('onRequest', async () => { trace.push('child'); });
  child.get('/c', () => 'c');
});
await app.inject({ method: 'GET', url: '/c' });
assert(trace.join(',') === 'parent,child', 'order: ' + trace);` },
    { name: "child_hooks_do_not_leak", code: `const trace = []; const app = createApp();
app.register(async (child) => {
  child.addHook('onRequest', async () => { trace.push('child-hook'); });
  child.get('/inside', () => 'in');
});
app.get('/outside', () => 'out');
app.register(async (sib) => { sib.get('/sibling', () => 'sib'); });
await app.inject({ method: 'GET', url: '/outside' });
await app.inject({ method: 'GET', url: '/sibling' });
assert(trace.length === 0, 'child hook ran for unrelated routes: ' + trace);
await app.inject({ method: 'GET', url: '/inside' });
assert(trace.join(',') === 'child-hook', 'but runs for its own route');` },
    { name: "hook_added_after_route_still_applies", code: `const trace = []; const app = createApp();
app.get('/x', () => 'x');
app.addHook('onRequest', async () => { trace.push('late-hook'); });
await app.inject({ method: 'GET', url: '/x' });
assert(trace.join(',') === 'late-hook', 'hooks apply to every route of the scope');` },
    { name: "hook_can_short_circuit", code: `const trace = []; const app = createApp();
app.addHook('onRequest', async (req, reply) => { trace.push('auth'); if (!req.body) reply.status(401).send({ error: 'no' }); });
app.addHook('preHandler', async () => { trace.push('pre'); });
app.post('/x', () => { trace.push('handler'); return 'ok'; });
const r = await app.inject({ method: 'POST', url: '/x' });
assert(r.status === 401 && r.body.error === 'no', 'reply from hook');
assert(trace.join(',') === 'auth', 'nothing else ran: ' + trace);
const ok = await app.inject({ method: 'POST', url: '/x', body: { a: 1 } });
assert(ok.status === 200 && ok.body === 'ok', 'passes when allowed');` },
    { name: "hooks_are_called_with_this_instance", code: `const app = createApp(); let seen = null;
app.register(async (api) => {
  api.decorate('user', 'ann');
  api.addHook('onRequest', async function () { seen = this.user; });
  api.get('/x', () => 'x');
});
await app.inject({ method: 'GET', url: '/x' });
assert(seen === 'ann', 'this.user in a hook');` },
    { name: "errors_become_responses", code: `const app = createApp();
app.get('/boom', () => { throw new Error('kaboom'); });
app.get('/teapot', async () => { const e = new Error('short and stout'); e.statusCode = 418; throw e; });
app.addHook('preHandler', async (req) => { if (req.url === '/hook-fail') throw new Error('from hook'); });
app.get('/hook-fail', () => 'never');
const a = await app.inject({ method: 'GET', url: '/boom' });
assert(a.status === 500 && a.body.error === 'kaboom', '500');
const b = await app.inject({ method: 'GET', url: '/teapot' });
assert(b.status === 418 && b.body.error === 'short and stout', 'statusCode honored');
const c = await app.inject({ method: 'GET', url: '/hook-fail' });
assert(c.status === 500 && c.body.error === 'from hook', 'errors in hooks too');` },
    { name: "unknown_hook_name_throws", code: `const app = createApp();
let threw = false;
try { app.addHook('onWhatever', () => {}); } catch (e) { threw = true; }
assert(threw, 'unknown hook');` },
  ],
  solution: {
    code: `function createApp() {
  const routes = [];
  let readyPromise = null;

  const join = (a, b) => {
    const joined = ('/' + [a, b].join('/')).replace(/\\/+/g, '/');
    return joined.length > 1 ? joined.replace(/\\/$/, '') : joined;
  };

  function makeContext(parent, prefix) {
    const ctx = {
      prefix,
      queue: [],
      decorators: new Map(parent ? parent.decorators : []),
      hooks: {
        onRequest: parent ? [...parent.hooks.onRequest] : [],
        preHandler: parent ? [...parent.hooks.preHandler] : [],
      },
    };
    const instance = {
      decorate(name, value) {
        if (ctx.decorators.has(name) || name in instance) {
          throw new Error('Decorator "' + name + '" already added');
        }
        ctx.decorators.set(name, value);
        Object.defineProperty(instance, name, { value, enumerable: true });
        return instance;
      },
      hasDecorator: (name) => ctx.decorators.has(name),
      addHook(name, fn) {
        if (!ctx.hooks[name]) throw new Error('Unknown hook: ' + name);
        ctx.hooks[name].push(fn);
        return instance;
      },
      route({ method, url, handler }) {
        routes.push({ method: method.toUpperCase(), path: join(ctx.prefix, url), handler, ctx, instance });
        return instance;
      },
      get: (url, handler) => instance.route({ method: 'GET', url, handler }),
      post: (url, handler) => instance.route({ method: 'POST', url, handler }),
      register(plugin, opts = {}) {
        if (readyPromise) throw new Error('Cannot register after ready');
        ctx.queue.push({ plugin, opts });
        return instance;
      },
    };
    for (const [name, value] of ctx.decorators) {
      Object.defineProperty(instance, name, { value, enumerable: true });
    }
    ctx.instance = instance;
    return ctx;
  }

  const root = makeContext(null, '');

  async function load(ctx) {
    for (const { plugin, opts } of ctx.queue) {
      const child = makeContext(ctx, join(ctx.prefix, opts.prefix || ''));
      await plugin(child.instance, opts);
      await load(child);
    }
  }

  const app = root.instance;
  app.ready = () => {
    if (!readyPromise) readyPromise = load(root);
    return readyPromise;
  };

  app.inject = async ({ method, url, body }) => {
    await app.ready();
    const path = join('', url.split('?')[0]);
    const route = routes.find((r) => r.method === method.toUpperCase() && r.path === path);
    if (!route) return { status: 404, body: { error: 'Not Found' } };

    const req = { method: method.toUpperCase(), url, body };
    let status = 200;
    let payload;
    let sent = false;
    const reply = {
      status(code) {
        status = code;
        return reply;
      },
      send(value) {
        payload = value;
        sent = true;
        return reply;
      },
      get sent() {
        return sent;
      },
    };

    try {
      for (const hook of [...route.ctx.hooks.onRequest, ...route.ctx.hooks.preHandler]) {
        await hook.call(route.instance, req, reply);
        if (sent) return { status, body: payload };
      }
      const result = await route.handler.call(route.instance, req, reply);
      if (!sent && result !== undefined) {
        payload = result;
        sent = true;
      }
      return { status, body: payload };
    } catch (err) {
      return { status: err.statusCode || 500, body: { error: err.message } };
    }
  };

  return app;
}

module.exports = createApp;`,
    explanation:
      "Each plugin gets its own context object holding private decorators, hooks and prefix, copied from the parent at creation. Because a child's additions go into its own copy, nothing can leak upward or sideways. The flat route list remembers which context each route belongs to, so inject can run exactly that scope's hooks.",
  },
};
