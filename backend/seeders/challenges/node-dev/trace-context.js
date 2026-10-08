export default {
  slug: "trace-context",
  trackId: "node-dev",
  layerId: "node-dev-10",
  type: "CODE",
  difficulty: "hard",
  title: "Distributed tracing with W3C traceparent",
  summary: "Parse and format the traceparent header, create spans that continue a trace across services, and build a span tree.",
  description:
    "OpenTelemetry follows a request across services by passing a <code>traceparent</code> header: <code>00-&lt;trace-id&gt;-&lt;parent-span-id&gt;-&lt;flags&gt;</code>. Every service creates child spans that share the trace id and point at their parent, which is how a tracing UI draws the waterfall.",
  task:
    "Write <code>createTracer({ now, randomHex })</code> returning <code>{ parseTraceparent, formatTraceparent, startSpan, inject, extract, finishedSpans, tree }</code>. <code>now()</code> returns milliseconds; <code>randomHex(bytes)</code> returns a lowercase hex string of <code>bytes * 2</code> characters (both injectable for tests).",
  constraints: [
    "<code>parseTraceparent(header)</code> returns <code>{ version, traceId, parentId, sampled }</code> or <code>null</code>. The header (trimmed) has at least 4 dash-separated fields: version (2 hex, not <code>ff</code>), trace id (32 hex, not all zeros), parent id (16 hex, not all zeros), flags (2 hex); only LOWERCASE hex is valid. Version <code>00</code> must have exactly 4 fields (other versions may have more). <code>sampled</code> is the lowest bit of the flags. Non-strings are <code>null</code>.",
    "<code>formatTraceparent({ traceId, spanId, sampled })</code> gives <code>'00-' + traceId + '-' + spanId + '-' + ('01' or '00')</code>. <code>inject(span, headers = {})</code> returns a copy of <code>headers</code> with <code>traceparent</code> set. <code>extract(headers)</code> finds <code>traceparent</code> case-insensitively and returns <code>{ traceId, spanId, sampled }</code> (the remote parent's context) or <code>null</code> if missing or invalid.",
    "<code>startSpan(name, { parent, attributes })</code>: <code>parent</code> is a span or an extracted context. A child shares its parent's <code>traceId</code> and <code>sampled</code> flag and has <code>parentSpanId = parent.spanId</code>; without a parent it starts a new trace (<code>traceId = randomHex(16)</code>, <code>parentSpanId = null</code>, <code>sampled = true</code>). <code>spanId = randomHex(8)</code>. Ids must never be all zeros: retry <code>randomHex</code> up to 10 times, then throw <code>Error('Could not generate a non-zero id')</code>.",
    "A span is <code>{ name, traceId, spanId, parentSpanId, sampled, startTime (now()), endTime: null, attributes (copy), events: [], status: 'unset' }</code> with methods <code>setAttribute(k, v)</code>, <code>recordException(err)</code> (adds an event <code>{ name: 'exception', attributes: { message, type } }</code> and sets status <code>'error'</code>), <code>end(status?)</code> and a <code>durationMs</code> getter (<code>null</code> until ended). <code>end</code> sets <code>endTime</code>; the status becomes the given one, else stays <code>'error'</code> if already an error, else <code>'ok'</code>. All of them return the span and do nothing once the span has ended (a second <code>end</code> changes nothing).",
    "<code>finishedSpans()</code> returns the ENDED spans that are <code>sampled</code>, in the order they ended (unsampled spans are never recorded). <code>tree()</code> builds <code>[{ name, durationMs, status, children }]</code> from the finished spans: roots are spans whose parent is not among them (or is null); children and roots are sorted by <code>startTime</code> then <code>name</code>.",
  ],
  example: `const root = tracer.startSpan('GET /users'); const headers = tracer.inject(root, {}); // call another service with headers`,
  tags: ["opentelemetry","tracing","observability","w3c"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "createTracer.js",
      lang: "js",
      code: `// createTracer.js
function createTracer(options = {}) {
  // your code here
}

module.exports = createTracer;`,
    },
  ],
  testFile: {
    name: "createTracer_test.js",
    lang: "test",
    code: `const createTracer = require('./createTracer');

test('parse', () => {
  const t = createTracer(); const r = t.parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'); expect(r.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736'); expect(r.sampled).toBe(true);
});

test('invalid', () => {
  expect(createTracer().parseTraceparent('nope')).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Parsing is a series of early <code>return null</code> checks, each with a small regex: <code>/^[0-9a-f]{2}$/</code>, <code>/^[0-9a-f]{32}$/</code>, <code>/^0+$/</code>." },
    { order: 2, cost: 5, text: "Build the span as an object literal whose methods close over <code>span</code> itself (<code>const span = { ..., end() {...} }</code>), guarding every mutator with <code>if (span.endTime === null)</code>." },
    { order: 3, cost: 15, text: "For <code>tree()</code>, index finished spans by <code>spanId</code>; a span is a root if <code>parentSpanId</code> is null OR not in the index (its parent lives in another process or wasn't sampled)." },
  ],
  hiddenTests: [
    { name: "parse_valid_headers", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const p = tracer.parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
assert(p.version === '00' && p.traceId === '4bf92f3577b34da6a3ce929d0e0e4736' && p.parentId === '00f067aa0ba902b7' && p.sampled === true, JSON.stringify(p));
const q = tracer.parseTraceparent('  00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00  ');
assert(q.sampled === false, 'flags 00 is not sampled, and whitespace is trimmed');
assert(tracer.parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-03').sampled === true, 'only the lowest bit is the sampled flag');
assert(tracer.parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-02').sampled === false, 'other flag bits do not mean sampled');` },
    { name: "parse_invalid_headers", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const T = '4bf92f3577b34da6a3ce929d0e0e4736'; const S = '00f067aa0ba902b7';
const bad = [undefined, null, 42, '', 'nope', '00-' + T + '-' + S, '00-' + T + '-' + S + '-01-extra', 'ff-' + T + '-' + S + '-01', '0-' + T + '-' + S + '-01',
  '00-' + T.slice(1) + '-' + S + '-01', '00-' + T + '0-' + S + '-01', '00-' + T + '-' + S.slice(1) + '-01', '00-' + T + '-' + S + '0-01',
  '00-' + '0'.repeat(32) + '-' + S + '-01', '00-' + T + '-' + '0'.repeat(16) + '-01', '00-' + T + '-' + S + '-1', '00-' + T + '-' + S + '-zz',
  '00-' + T.toUpperCase() + '-' + S + '-01', '00-' + T + '-' + S.toUpperCase() + '-01', 'GG-' + T + '-' + S + '-01'];
for (const b of bad) assert(tracer.parseTraceparent(b) === null, 'should be rejected: ' + JSON.stringify(b));` },
    { name: "future_versions_may_have_extra_fields", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const T = '4bf92f3577b34da6a3ce929d0e0e4736'; const S = '00f067aa0ba902b7';
const p = tracer.parseTraceparent('01-' + T + '-' + S + '-01-futurefield');
assert(p && p.version === '01' && p.traceId === T && p.sampled === true, 'a later version keeps the first four fields: ' + JSON.stringify(p));` },
    { name: "format_and_roundtrip", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const h = tracer.formatTraceparent({ traceId: '4bf92f3577b34da6a3ce929d0e0e4736', spanId: '00f067aa0ba902b7', sampled: true });
assert(h === '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01', h);
assert(tracer.formatTraceparent({ traceId: 'a'.repeat(32), spanId: 'b'.repeat(16), sampled: false }) === '00-' + 'a'.repeat(32) + '-' + 'b'.repeat(16) + '-00', 'unsampled');
const back = tracer.parseTraceparent(h);
assert(back.traceId === '4bf92f3577b34da6a3ce929d0e0e4736' && back.parentId === '00f067aa0ba902b7' && back.sampled === true, 'round trip');` },
    { name: "root_span", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const span = tracer.startSpan('GET /users', { attributes: { 'http.method': 'GET' } });
assert(span.name === 'GET /users' && span.parentSpanId === null && span.sampled === true, 'root span');
assert(/^[0-9a-f]{32}$/.test(span.traceId) && /^[0-9a-f]{16}$/.test(span.spanId), 'id formats: ' + span.traceId + ' ' + span.spanId);
assert(span.startTime === 1000 && span.endTime === null && span.status === 'unset' && span.durationMs === null, 'initial state');
assert(span.attributes['http.method'] === 'GET' && span.events.length === 0, 'attributes and events');
const other = tracer.startSpan('other');
assert(other.traceId !== span.traceId && other.spanId !== span.spanId, 'a new root starts a new trace');` },
    { name: "attributes_are_copied", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const attrs = { a: 1 };
const span = tracer.startSpan('s', { attributes: attrs });
attrs.a = 99;
assert(span.attributes.a === 1, 'the callers object is not shared');` },
    { name: "ids_are_never_all_zeros", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
let calls = 0;
const tracer = createTracer({ randomHex: (bytes) => { calls++; return calls <= 3 ? '0'.repeat(bytes * 2) : 'ab'.repeat(bytes); } });
const span = tracer.startSpan('s');
assert(/[1-9a-f]/.test(span.traceId) && /[1-9a-f]/.test(span.spanId), 'zero ids were retried: ' + span.traceId + ' ' + span.spanId);
const broken = createTracer({ randomHex: (bytes) => '0'.repeat(bytes * 2) });
let msg = null;
try { broken.startSpan('s'); } catch (e) { msg = e.message; }
assert(msg === 'Could not generate a non-zero id', 'gives up after 10 tries: ' + msg);` },
    { name: "child_spans_share_the_trace", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const root = tracer.startSpan('root');
const child = tracer.startSpan('child', { parent: root });
const grandchild = tracer.startSpan('grandchild', { parent: child });
assert(child.traceId === root.traceId && grandchild.traceId === root.traceId, 'same trace id');
assert(child.parentSpanId === root.spanId && grandchild.parentSpanId === child.spanId, 'parent links');
assert(new Set([root.spanId, child.spanId, grandchild.spanId]).size === 3, 'distinct span ids');` },
    { name: "end_duration_and_status", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer, tick } = mkTracer();
const a = tracer.startSpan('a'); tick(50);
assert(a.end() === a, 'chainable');
assert(a.endTime === 1050 && a.durationMs === 50 && a.status === 'ok', 'default status ok: ' + JSON.stringify([a.endTime, a.durationMs, a.status]));
const b = tracer.startSpan('b'); tick(5); b.end('error');
assert(b.status === 'error', 'explicit status');
tick(100); a.end('error');
assert(a.endTime === 1050 && a.durationMs === 50 && a.status === 'ok', 'a second end changes nothing');` },
    { name: "record_exception_and_attributes_lifecycle", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const span = tracer.startSpan('s');
assert(span.setAttribute('k', 'v') === span && span.attributes.k === 'v', 'setAttribute');
const err = new TypeError('bad input');
assert(span.recordException(err) === span, 'chainable');
assert(span.status === 'error' && span.events.length === 1 && span.events[0].name === 'exception' && span.events[0].attributes.message === 'bad input' && span.events[0].attributes.type === 'TypeError', JSON.stringify(span.events));
span.end();
assert(span.status === 'error', 'end() keeps an error status instead of overwriting it with ok');
span.setAttribute('late', 1); span.recordException(new Error('late'));
assert(!('late' in span.attributes) && span.events.length === 1, 'an ended span is immutable');` },
    { name: "finished_spans_are_in_end_order", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const a = tracer.startSpan('a'); const b = tracer.startSpan('b', { parent: a }); const c = tracer.startSpan('c', { parent: a });
assert(tracer.finishedSpans().length === 0, 'nothing ended yet');
c.end(); b.end(); a.end(); a.end();
assert(tracer.finishedSpans().map((s) => s.name).join() === 'c,b,a', 'end order, each recorded once: ' + tracer.finishedSpans().map((s) => s.name));` },
    { name: "inject_and_extract", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const span = tracer.startSpan('client');
const headers = tracer.inject(span, { accept: 'x' });
assert(headers.accept === 'x' && headers.traceparent === '00-' + span.traceId + '-' + span.spanId + '-01', JSON.stringify(headers));
const original = { a: 1 };
tracer.inject(span, original);
assert(!('traceparent' in original), 'the input headers are not mutated');
const ctx = tracer.extract({ Traceparent: headers.traceparent });
assert(ctx.traceId === span.traceId && ctx.spanId === span.spanId && ctx.sampled === true, 'extract is case-insensitive and returns the remote parent: ' + JSON.stringify(ctx));
assert(tracer.extract({}) === null && tracer.extract({ traceparent: 'garbage' }) === null, 'missing or invalid headers give null');` },
    { name: "a_trace_continues_in_another_service", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const client = mkTracer().tracer; const server = mkTracer().tracer;
const clientSpan = client.startSpan('call');
const wire = client.inject(clientSpan, {});
const serverSpan = server.startSpan('handle', { parent: server.extract(wire) });
assert(serverSpan.traceId === clientSpan.traceId, 'same trace id across services');
assert(serverSpan.parentSpanId === clientSpan.spanId, 'the server span points at the remote client span');
assert(serverSpan.sampled === true && serverSpan.spanId !== clientSpan.spanId, 'sampled flag inherited, new span id');` },
    { name: "sampling_decision_is_inherited_and_unsampled_spans_are_not_recorded", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const ctx = tracer.extract({ traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00' });
const span = tracer.startSpan('s', { parent: ctx });
assert(span.sampled === false && span.traceId === '4bf92f3577b34da6a3ce929d0e0e4736', 'inherits not sampled');
const child = tracer.startSpan('c', { parent: span });
span.end(); child.end();
assert(tracer.finishedSpans().length === 0, 'unsampled spans are dropped');
assert(tracer.inject(span, {}).traceparent.endsWith('-00'), 'and the flag is propagated downstream');` },
    { name: "tree_building", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer, tick } = mkTracer();
const root = tracer.startSpan('GET /orders'); tick(10);
const db = tracer.startSpan('db.query', { parent: root }); tick(30); db.end(); tick(5);
const cache = tracer.startSpan('cache.get', { parent: root }); tick(2); cache.end();
const inner = tracer.startSpan('serialize', { parent: db }); tick(1); inner.end();
tick(3); root.end();
const t = tracer.tree();
assert(t.length === 1 && t[0].name === 'GET /orders' && t[0].durationMs === 51 && t[0].status === 'ok', JSON.stringify(t.map((n) => [n.name, n.durationMs])));
assert(t[0].children.map((c) => c.name).join() === 'db.query,cache.get', 'children sorted by start time');
assert(t[0].children[0].durationMs === 30 && t[0].children[0].children.length === 1 && t[0].children[0].children[0].name === 'serialize', 'nested children');
assert(t[0].children[1].children.length === 0, 'leaf has an empty children array');
assert(Object.keys(t[0]).sort().join() === 'children,durationMs,name,status', 'node shape: ' + Object.keys(t[0]));` },
    { name: "tree_roots_orphans_and_ordering", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer, tick } = mkTracer();
const remote = tracer.extract({ traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' });
const a = tracer.startSpan('b-handler', { parent: remote }); a.end();
const b = tracer.startSpan('a-handler', { parent: remote }); b.end();
tick(10);
const c = tracer.startSpan('later'); c.end();
const t = tracer.tree();
assert(t.map((n) => n.name).join() === 'a-handler,b-handler,later', 'a span whose parent was not recorded is a root; ties by start time are ordered by name: ' + t.map((n) => n.name));
assert(tracer.tree().length === 3 && tracer.tree()[0] !== t[0], 'tree() builds fresh nodes each time');
const empty = createTracer();
assert(Array.isArray(empty.tree()) && empty.tree().length === 0, 'no spans');` },
    { name: "tree_only_contains_finished_spans", code: `let hexCounter = 0;
const mkTracer = (extra = {}) => {
  let time = 1000;
  const tick = (ms) => { time += ms; };
  const tracer = createTracer({ now: () => time, randomHex: (bytes) => (++hexCounter).toString(16).padStart(bytes * 2, '0'), ...extra });
  return { tracer, tick };
};
const { tracer } = mkTracer();
const root = tracer.startSpan('root'); const child = tracer.startSpan('child', { parent: root });
child.end();
let t = tracer.tree();
assert(t.length === 1 && t[0].name === 'child', 'the unfinished root is not shown, so the finished child is a root for now');
root.end();
t = tracer.tree();
assert(t.length === 1 && t[0].name === 'root' && t[0].children[0].name === 'child', 'once the parent ends, the real hierarchy appears');` },
  ],
  solution: {
    code: `function createTracer({ now = () => Date.now(), randomHex } = {}) {
  const generate =
    randomHex ||
    ((bytes) => {
      let out = '';
      for (let i = 0; i < bytes * 2; i++) out += '0123456789abcdef'[Math.floor(Math.random() * 16)];
      return out;
    });

  function nonZero(bytes) {
    for (let i = 0; i < 10; i++) {
      const hex = generate(bytes);
      if (/[1-9a-f]/.test(hex)) return hex;
    }
    throw new Error('Could not generate a non-zero id');
  }

  const finished = [];

  function parseTraceparent(header) {
    if (typeof header !== 'string') return null;
    const parts = header.trim().split('-');
    if (parts.length < 4) return null;
    const [version, traceId, parentId, flags] = parts;
    if (!/^[0-9a-f]{2}$/.test(version) || version === 'ff') return null;
    if (version === '00' && parts.length !== 4) return null;
    if (!/^[0-9a-f]{32}$/.test(traceId) || /^0+$/.test(traceId)) return null;
    if (!/^[0-9a-f]{16}$/.test(parentId) || /^0+$/.test(parentId)) return null;
    if (!/^[0-9a-f]{2}$/.test(flags)) return null;
    return { version, traceId, parentId, sampled: (parseInt(flags, 16) & 1) === 1 };
  }

  function formatTraceparent({ traceId, spanId, sampled }) {
    return '00-' + traceId + '-' + spanId + '-' + (sampled ? '01' : '00');
  }

  function startSpan(name, { parent, attributes = {} } = {}) {
    const span = {
      name,
      traceId: parent ? parent.traceId : nonZero(16),
      spanId: nonZero(8),
      parentSpanId: parent ? parent.spanId : null,
      sampled: parent ? parent.sampled : true,
      startTime: now(),
      endTime: null,
      attributes: { ...attributes },
      events: [],
      status: 'unset',
      setAttribute(key, value) {
        if (span.endTime === null) span.attributes[key] = value;
        return span;
      },
      recordException(err) {
        if (span.endTime === null) {
          span.events.push({ name: 'exception', attributes: { message: err.message, type: err.name } });
          span.status = 'error';
        }
        return span;
      },
      end(status) {
        if (span.endTime !== null) return span;
        span.endTime = now();
        if (status) span.status = status;
        else if (span.status === 'unset') span.status = 'ok';
        if (span.sampled) finished.push(span);
        return span;
      },
      get durationMs() {
        return span.endTime === null ? null : span.endTime - span.startTime;
      },
    };
    return span;
  }

  function extract(headers) {
    const key = Object.keys(headers || {}).find((k) => k.toLowerCase() === 'traceparent');
    if (key === undefined) return null;
    const parsed = parseTraceparent(headers[key]);
    return parsed ? { traceId: parsed.traceId, spanId: parsed.parentId, sampled: parsed.sampled } : null;
  }

  function tree() {
    const byId = new Map(finished.map((s) => [s.spanId, s]));
    const order = (a, b) => a.startTime - b.startTime || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    const toNode = (span) => ({
      name: span.name,
      durationMs: span.durationMs,
      status: span.status,
      children: finished
        .filter((s) => s.parentSpanId === span.spanId)
        .sort(order)
        .map(toNode),
    });
    return finished
      .filter((s) => s.parentSpanId === null || !byId.has(s.parentSpanId))
      .sort(order)
      .map(toNode);
  }

  return {
    parseTraceparent,
    formatTraceparent,
    startSpan,
    inject: (span, headers = {}) => ({ ...headers, traceparent: formatTraceparent(span) }),
    extract,
    finishedSpans: () => [...finished],
    tree,
  };
}

module.exports = createTracer;`,
    explanation:
      "The traceparent header carries just enough state (trace id, the caller's span id, a sampled bit) for the next service to continue the trace: its first span copies the trace id and records the remote span id as its parent. Building the tree afterwards is only grouping by parentSpanId, and a span whose parent isn't recorded becomes a root.",
  },
};
