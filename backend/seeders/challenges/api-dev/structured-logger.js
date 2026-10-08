export default {
  slug: "structured-logger",
  trackId: "api-dev",
  layerId: "api-dev-10",
  type: "CODE",
  difficulty: "hard",
  title: "Structured JSON logger",
  summary: "Log JSON lines with levels, child context and secret redaction, like pino.",
  description:
    "Production logs are JSON lines so tools can search and aggregate them. Loggers like pino add levels, per-request context (a request id on every line) and redaction so secrets never reach your log store.",
  task:
    "Write <code>createLogger({ level = 'info', base = {}, write, now, redact = [] })</code> returning <code>{ debug, info, warn, error, child }</code>. Each level method is <code>(msg, fields = {})</code>.",
  constraints: [
    "A log call calls <code>write(line)</code> with <code>JSON.stringify</code> of an object containing <code>level</code>, <code>time</code> (<code>now().toISOString()</code>), <code>msg</code>, plus the <code>base</code> fields and the call's <code>fields</code>.",
    "Levels rank <code>debug &lt; info &lt; warn &lt; error</code>; calls below the configured <code>level</code> write nothing.",
    "<code>level</code>, <code>time</code> and <code>msg</code> cannot be overridden by <code>base</code> or <code>fields</code>.",
    "<code>child(bindings)</code> returns a logger with <code>base</code> merged with <code>bindings</code> and everything else inherited.",
    "Any key listed in <code>redact</code>, at any depth, has its value replaced with <code>'[REDACTED]'</code>. <code>Error</code> values are serialized as <code>{ name, message }</code>.",
    "<code>write</code> defaults to <code>console.log</code> and <code>now</code> to <code>() =&gt; new Date()</code>.",
  ],
  example: `const log = createLogger({ base: { service: 'api' } }).child({ reqId: 'r1' }); log.info('paid', { userId: 7 });`,
  tags: ["logging","pino","observability","security"],
  estimatedMins: 45,
  xp: 70,
  starterFiles: [
    {
      name: "createLogger.js",
      lang: "js",
      code: `// createLogger.js
function createLogger(options = {}) {
  // your code here
}

module.exports = createLogger;`,
    },
  ],
  testFile: {
    name: "createLogger_test.js",
    lang: "test",
    code: `const createLogger = require('./createLogger');

test('writes_json', () => {
  const out = []; const l = createLogger({ write: (s) => out.push(s), now: () => new Date(0) }); l.info('hi'); expect(JSON.parse(out[0]).msg).toBe('hi');
});

test('level_filter', () => {
  const out = []; const l = createLogger({ level: 'warn', write: (s) => out.push(s) }); l.info('x'); expect(out.length).toBe(0);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a recursive <code>clean(value)</code> that redacts listed keys, converts <code>Error</code>s, and recurses into arrays and plain objects." },
    { order: 2, cost: 5, text: "Build the final object as <code>{ ...clean(base), ...clean(fields), level, time, msg }</code>: the reserved keys come last so they win." },
    { order: 3, cost: 15, text: "<code>child</code> can just call <code>createLogger</code> again with the merged <code>base</code>." },
  ],
  hiddenTests: [
    { name: "line_shape", code: `const out = []; const l = createLogger({ write: (s) => out.push(s), now: () => new Date('2024-01-01T00:00:00Z') });
l.info('started', { port: 3000 });
const e = JSON.parse(out[0]);
assert(e.level === 'info' && e.msg === 'started' && e.port === 3000, 'fields');
assert(e.time === '2024-01-01T00:00:00.000Z', 'ISO time from now()');` },
    { name: "all_four_levels_exist", code: `const out = []; const l = createLogger({ level: 'debug', write: (s) => out.push(JSON.parse(s).level) });
l.debug('a'); l.info('b'); l.warn('c'); l.error('d');
assert(out.join(',') === 'debug,info,warn,error', 'levels: ' + out);` },
    { name: "level_filtering", code: `const out = []; const l = createLogger({ level: 'warn', write: (s) => out.push(JSON.parse(s).level) });
l.debug('a'); l.info('b'); l.warn('c'); l.error('d');
assert(out.join(',') === 'warn,error', 'only warn and above: ' + out);` },
    { name: "default_level_is_info", code: `const out = []; const l = createLogger({ write: (s) => out.push(s) });
l.debug('hidden'); l.info('shown');
assert(out.length === 1, 'debug hidden by default');` },
    { name: "base_and_child", code: `const out = []; const base = createLogger({ base: { service: 'api' }, write: (s) => out.push(JSON.parse(s)) });
const child = base.child({ reqId: 'r1' });
child.info('x'); base.info('y');
assert(out[0].service === 'api' && out[0].reqId === 'r1', 'child has both');
assert(out[1].service === 'api' && !('reqId' in out[1]), 'parent unaffected');` },
    { name: "grandchild_accumulates_and_inherits", code: `const out = []; const l = createLogger({ level: 'debug', write: (s) => out.push(JSON.parse(s)) });
const g = l.child({ a: 1 }).child({ b: 2 });
g.debug('x');
assert(out[0].a === 1 && out[0].b === 2, 'bindings accumulate and level is inherited');` },
    { name: "redaction_any_depth", code: `const out = []; const l = createLogger({ redact: ['password', 'token'], write: (s) => out.push(JSON.parse(s)) });
l.info('login', { user: 'ann', password: 'hunter2', nested: { token: 'abc', keep: 1 }, list: [{ password: 'x' }] });
const e = out[0];
assert(e.password === '[REDACTED]', 'top level');
assert(e.nested.token === '[REDACTED]' && e.nested.keep === 1, 'nested');
assert(e.list[0].password === '[REDACTED]', 'inside arrays');
assert(e.user === 'ann', 'others untouched');` },
    { name: "redaction_applies_to_base", code: `const out = []; const l = createLogger({ base: { token: 'secret' }, redact: ['token'], write: (s) => out.push(JSON.parse(s)) });
l.info('x');
assert(out[0].token === '[REDACTED]', 'base too');` },
    { name: "errors_are_serialized", code: `const out = []; const l = createLogger({ write: (s) => out.push(JSON.parse(s)) });
l.error('failed', { err: new TypeError('bad input') });
assert(out[0].err.name === 'TypeError' && out[0].err.message === 'bad input', 'Error becomes {name, message}');` },
    { name: "reserved_keys_cannot_be_overridden", code: `const out = []; const l = createLogger({ write: (s) => out.push(JSON.parse(s)), now: () => new Date(0) });
l.info('real', { level: 'fake', msg: 'fake', time: 'fake' });
const e = out[0];
assert(e.level === 'info' && e.msg === 'real' && e.time === '1970-01-01T00:00:00.000Z', 'reserved keys win');` },
  ],
  solution: {
    code: `function createLogger({ level = 'info', base = {}, write = (line) => console.log(line), now = () => new Date(), redact = [] } = {}) {
  const rank = { debug: 10, info: 20, warn: 30, error: 40 };

  function clean(value) {
    if (value instanceof Error) return { name: value.name, message: value.message };
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === 'object') {
      const out = {};
      for (const [key, v] of Object.entries(value)) {
        out[key] = redact.includes(key) ? '[REDACTED]' : clean(v);
      }
      return out;
    }
    return value;
  }

  function log(lvl, msg, fields = {}) {
    if (rank[lvl] < rank[level]) return;
    write(JSON.stringify({ ...clean(base), ...clean(fields), level: lvl, time: now().toISOString(), msg }));
  }

  const logger = {
    child(bindings) {
      return createLogger({ level, base: { ...base, ...bindings }, write, now, redact });
    },
  };
  for (const lvl of Object.keys(rank)) {
    logger[lvl] = (msg, fields) => log(lvl, msg, fields);
  }
  return logger;
}

module.exports = createLogger;`,
    explanation:
      "One recursive clean() handles redaction and Error serialization at any depth. Placing level, time and msg last in the object means user fields can never forge them. child() is just the same factory with merged context.",
  },
};
