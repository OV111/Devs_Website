export default {
  slug: "build-config",
  trackId: "node-dev",
  layerId: "node-dev-7",
  type: "CODE",
  difficulty: "hard",
  title: "Layered configuration (defaults, file, env, CLI)",
  summary: "Merge four config sources with the right precedence, coerce env/CLI strings by the default's type, track where each value came from, and redact secrets.",
  description:
    "Real apps take config from several places: code defaults, a config file, environment variables and command-line flags, in increasing priority. Merging them correctly (deep objects, replaced arrays, typed values) and being able to print the result without leaking secrets are standard 12-factor chores.",
  task:
    "Write <code>buildConfig({ defaults, file, env, argv, envPrefix = 'APP_', secrets = [] })</code> returning <code>{ config, redacted, sources }</code>.",
  constraints: [
    "Precedence: defaults, then file, then env, then argv (later wins). Plain objects merge recursively; arrays and primitives are replaced. Inputs are never mutated, and the returned <code>config</code> is deeply frozen without freezing the caller's own objects.",
    "Env: only keys starting with <code>envPrefix</code> count. The rest of the name is split on <code>__</code> into path segments; each segment is lowercased and its <code>_x</code> becomes <code>X</code> (<code>APP_DB__HOST</code> becomes <code>db.host</code>, <code>APP_LOG_LEVEL</code> becomes <code>logLevel</code>). <code>undefined</code> env values are skipped.",
    "Argv (array of tokens): <code>--key=value</code>, <code>--key value</code>, <code>--flag</code> (true) and <code>--no-flag</code> (false). Keys use dots for nesting and kebab-case becomes camelCase (<code>--db.max-connections=5</code>). A value token never starts with <code>--</code>; tokens that are not options are ignored.",
    "Env and argv values are strings, so they are coerced to the type of the default at that path: number (must be numeric, else <code>Error('Invalid number for db.port: abc')</code>), boolean (<code>true/1/yes/on</code> and <code>false/0/no/off</code>, case-insensitive, else <code>Error('Invalid boolean for debug: maybe')</code>), array (a string is split on commas and trimmed, empties dropped), string (<code>String(value)</code>). Without a default, the value stays as given. Values from defaults and file are used as is.",
    "<code>sources</code> maps every leaf path (<code>'db.host'</code>) to the layer that supplied its final value: <code>'defaults'</code>, <code>'file'</code>, <code>'env'</code> or <code>'argv'</code>. <code>redacted</code> is a plain copy of the config where each path in <code>secrets</code> that exists is replaced by <code>'***'</code>.",
  ],
  example: `buildConfig({ defaults: { port: 3000 }, env: { APP_PORT: '8080' } }).config.port // 8080`,
  tags: ["config","12-factor","env","cli","architecture"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "buildConfig.js",
      lang: "js",
      code: `// buildConfig.js
function buildConfig(options) {
  // your code here
}

module.exports = buildConfig;`,
    },
  ],
  testFile: {
    name: "buildConfig_test.js",
    lang: "test",
    code: `const buildConfig = require('./buildConfig');

test('precedence', () => {
  const r = buildConfig({ defaults: { port: 1 }, file: { port: 2 }, env: { APP_PORT: '3' }, argv: ['--port=4'] }); expect(r.config.port).toBe(4); expect(r.sources.port).toBe('argv');
});

test('secrets', () => {
  const r = buildConfig({ defaults: { db: { password: 'x' } }, secrets: ['db.password'] }); expect(r.redacted.db.password).toBe('***'); expect(r.config.db.password).toBe('x');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Break every source into a list of <code>[pathArray, value]</code> leaves, then apply the lists to one result object in order, recording <code>sources[path.join('.')] = layerName</code> as you go." },
    { order: 2, cost: 5, text: "Write helpers <code>getAt(obj, path)</code> (to look up the default's type), <code>setAt(obj, path, value)</code> (creating objects on the way) and <code>leaves(obj)</code> (recursing into non-empty plain objects, treating arrays as leaves)." },
    { order: 3, cost: 15, text: "Clone leaf values that are arrays or objects before storing them, so freezing the result can't freeze the caller's input." },
  ],
  hiddenTests: [
    { name: "defaults_only_and_deep_freeze", code: `const defaults = { port: 3000, db: { host: 'localhost' }, tags: ['a'] };
const r = buildConfig({ defaults });
assert(r.config.port === 3000 && r.config.db.host === 'localhost' && r.config.tags[0] === 'a', 'values');
assert(Object.isFrozen(r.config) && Object.isFrozen(r.config.db) && Object.isFrozen(r.config.tags), 'deeply frozen');
assert(!Object.isFrozen(defaults) && !Object.isFrozen(defaults.db) && !Object.isFrozen(defaults.tags), 'the callers objects are not frozen');
assert(r.config !== defaults && r.config.db !== defaults.db, 'a copy');` },
    { name: "inputs_are_not_mutated", code: `const defaults = { a: 1, db: { host: 'h' } }; const file = { db: { host: 'f', port: 5 } }; const env = { APP_A: '9' }; const argv = ['--db.host=z'];
const snapshot = JSON.stringify([defaults, file, env, argv]);
buildConfig({ defaults, file, env, argv });
assert(JSON.stringify([defaults, file, env, argv]) === snapshot, 'unchanged');` },
    { name: "layer_precedence_with_sources", code: `const r = buildConfig({
  defaults: { a: 'd', b: 'd', c: 'd', d: 'd' },
  file: { b: 'f', c: 'f', d: 'f' },
  env: { APP_C: 'e', APP_D: 'e' },
  argv: ['--d=a'],
});
assert(r.config.a === 'd' && r.config.b === 'f' && r.config.c === 'e' && r.config.d === 'a', JSON.stringify(r.config));
assert(r.sources.a === 'defaults' && r.sources.b === 'file' && r.sources.c === 'env' && r.sources.d === 'argv', JSON.stringify(r.sources));` },
    { name: "objects_merge_deeply_and_arrays_are_replaced", code: `const r = buildConfig({
  defaults: { db: { host: 'localhost', port: 5432, pool: { min: 1, max: 5 } }, hosts: ['a', 'b'] },
  file: { db: { host: 'db.prod', pool: { max: 20 } }, hosts: ['c'] },
});
assert(r.config.db.host === 'db.prod' && r.config.db.port === 5432, 'siblings survive: ' + JSON.stringify(r.config.db));
assert(r.config.db.pool.min === 1 && r.config.db.pool.max === 20, 'deep merge');
assert(r.config.hosts.join() === 'c', 'arrays are replaced, not merged');
assert(r.sources['db.host'] === 'file' && r.sources['db.port'] === 'defaults' && r.sources['db.pool.max'] === 'file' && r.sources['db.pool.min'] === 'defaults', 'sources per leaf: ' + JSON.stringify(r.sources));
assert(r.sources.hosts === 'file', 'an array is one leaf');` },
    { name: "file_values_are_not_coerced", code: `const r = buildConfig({ defaults: { port: 1 }, file: { port: '8080' } });
assert(r.config.port === '8080', 'file layer keeps its own types');` },
    { name: "env_name_mapping", code: `const r = buildConfig({
  defaults: { port: 1, logLevel: 'info', db: { host: 'x', maxConnections: 5 } },
  env: { APP_PORT: '80', APP_LOG_LEVEL: 'debug', APP_DB__HOST: 'h', APP_DB__MAX_CONNECTIONS: '9', OTHER_PORT: '1', PATH: '/bin', APP_IGNORED: undefined },
});
assert(r.config.port === 80 && r.config.logLevel === 'debug', 'top level and camelCase: ' + JSON.stringify(r.config));
assert(r.config.db.host === 'h' && r.config.db.maxConnections === 9, 'nested via __: ' + JSON.stringify(r.config.db));
assert(!('other' in r.config) && !('path' in r.config) && !('ignored' in r.config), 'other prefixes and undefined values are ignored');
const custom = buildConfig({ defaults: { port: 1 }, env: { MYAPP_PORT: '7', APP_PORT: '8' }, envPrefix: 'MYAPP_' });
assert(custom.config.port === 7, 'custom prefix');` },
    { name: "argv_forms", code: `const r = buildConfig({
  defaults: { name: 'd', port: 1, debug: false, verbose: true, db: { host: 'x', maxConnections: 5 }, tags: [] },
  argv: ['node', 'app.js', '--name=bob', '--port', '8080', '--debug', '--no-verbose', '--db.host=h', '--db.max-connections=9', '--tags=a, b,,c', 'positional'],
});
const c = r.config;
assert(c.name === 'bob' && c.port === 8080 && c.debug === true && c.verbose === false, JSON.stringify(c));
assert(c.db.host === 'h' && c.db.maxConnections === 9, 'dotted and kebab: ' + JSON.stringify(c.db));
assert(c.tags.join('|') === 'a|b|c', 'comma list: ' + c.tags);
assert(r.sources.debug === 'argv' && r.sources['db.maxConnections'] === 'argv', 'sources');` },
    { name: "flag_followed_by_another_option_is_true", code: `const r = buildConfig({ defaults: { a: false, b: false }, argv: ['--a', '--b'] });
assert(r.config.a === true && r.config.b === true, 'flags do not swallow the next option');
const eq = buildConfig({ defaults: { name: '' }, argv: ['--name=a=b'] });
assert(eq.config.name === 'a=b', 'only the first = splits');` },
    { name: "argv_beats_env_beats_file", code: `const r = buildConfig({ defaults: { n: 0 }, file: { n: 1 }, env: { APP_N: '2' }, argv: ['--n=3'] });
assert(r.config.n === 3, 'argv');
const r2 = buildConfig({ defaults: { n: 0 }, file: { n: 1 }, env: { APP_N: '2' } });
assert(r2.config.n === 2, 'env over file');` },
    { name: "number_coercion_and_errors", code: `assert(buildConfig({ defaults: { n: 0 }, env: { APP_N: ' 42 ' } }).config.n === 42, 'whitespace is fine');
assert(buildConfig({ defaults: { n: 0 }, env: { APP_N: '1.5' } }).config.n === 1.5, 'floats');
for (const bad of ['abc', '', '  ', '12px']) {
  let msg = null;
  try { buildConfig({ defaults: { db: { port: 1 } }, env: { APP_DB__PORT: bad } }); } catch (e) { msg = e.message; }
  assert(msg === 'Invalid number for db.port: ' + bad, JSON.stringify(bad) + ' -> ' + msg);
}` },
    { name: "boolean_coercion_and_errors", code: `for (const t of ['true', 'TRUE', '1', 'yes', 'On']) assert(buildConfig({ defaults: { b: false }, env: { APP_B: t } }).config.b === true, t);
for (const f of ['false', 'False', '0', 'no', 'OFF']) assert(buildConfig({ defaults: { b: true }, env: { APP_B: f } }).config.b === false, f);
let msg = null;
try { buildConfig({ defaults: { debug: false }, env: { APP_DEBUG: 'maybe' } }); } catch (e) { msg = e.message; }
assert(msg === 'Invalid boolean for debug: maybe', 'message: ' + msg);` },
    { name: "string_and_unknown_keys", code: `const r = buildConfig({ defaults: { name: 'x' }, env: { APP_NAME: 'bob', APP_EXTRA: '5' }, argv: ['--other=7'] });
assert(r.config.name === 'bob', 'string default');
assert(r.config.extra === '5' && r.config.other === '7', 'keys without a default keep the raw string');
assert(r.sources.extra === 'env' && r.sources.other === 'argv', 'and still have sources');
const flag = buildConfig({ defaults: { label: 'x' }, argv: ['--label'] });
assert(flag.config.label === 'true', 'a bare flag for a string default becomes the string "true"');` },
    { name: "env_array_coercion", code: `const r = buildConfig({ defaults: { hosts: ['a'] }, env: { APP_HOSTS: 'x, y ,z' } });
assert(r.config.hosts.join('|') === 'x|y|z', 'split and trim: ' + r.config.hosts);` },
    { name: "secrets_are_redacted_in_a_copy", code: `const r = buildConfig({
  defaults: { port: 1, jwtSecret: 'abc', db: { host: 'h', password: 'pw' } },
  env: { APP_DB__PASSWORD: 'from-env' },
  secrets: ['jwtSecret', 'db.password', 'missing.key'],
});
assert(r.config.jwtSecret === 'abc' && r.config.db.password === 'from-env', 'the real config keeps secrets');
assert(r.redacted.jwtSecret === '***' && r.redacted.db.password === '***', 'redacted copy: ' + JSON.stringify(r.redacted));
assert(r.redacted.port === 1 && r.redacted.db.host === 'h', 'other values untouched');
assert(!('missing' in r.redacted), 'unknown secret paths are not created');
assert(!Object.isFrozen(r.redacted), 'redacted is a plain copy meant for printing');
assert(JSON.stringify(r.redacted).indexOf('from-env') === -1 && JSON.stringify(r.redacted).indexOf('abc') === -1, 'no secret values in the printable copy');` },
    { name: "no_arguments_and_empty_layers", code: `const r = buildConfig({});
assert(Object.keys(r.config).length === 0 && Object.keys(r.sources).length === 0, 'empty');
const r2 = buildConfig({ defaults: { a: 1 }, file: {}, env: {}, argv: [] });
assert(r2.config.a === 1 && r2.sources.a === 'defaults', 'empty layers change nothing');` },
  ],
  solution: {
    code: `function buildConfig({ defaults = {}, file = {}, env = {}, argv = [], envPrefix = 'APP_', secrets = [] } = {}) {
  const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const camel = (s) => s.toLowerCase().replace(/[-_]([a-z0-9])/g, (_, c) => c.toUpperCase());
  const clone = (v) => (v !== null && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v);

  const getAt = (obj, path) => path.reduce((o, key) => (isPlain(o) ? o[key] : undefined), obj);
  function setAt(obj, path, value) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!isPlain(current[path[i]])) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  }
  function leaves(obj, prefix = []) {
    const out = [];
    for (const [key, value] of Object.entries(obj)) {
      if (isPlain(value) && Object.keys(value).length > 0) out.push(...leaves(value, [...prefix, key]));
      else out.push([[...prefix, key], value]);
    }
    return out;
  }
  function deepFreeze(value) {
    if (value !== null && typeof value === 'object') {
      Object.values(value).forEach(deepFreeze);
      Object.freeze(value);
    }
    return value;
  }

  function coerce(value, template, label) {
    if (typeof template === 'number') {
      const n = Number(value);
      if (String(value).trim() === '' || Number.isNaN(n)) throw new Error('Invalid number for ' + label + ': ' + value);
      return n;
    }
    if (typeof template === 'boolean') {
      if (typeof value === 'boolean') return value;
      const v = String(value).toLowerCase();
      if (['true', '1', 'yes', 'on'].includes(v)) return true;
      if (['false', '0', 'no', 'off'].includes(v)) return false;
      throw new Error('Invalid boolean for ' + label + ': ' + value);
    }
    if (Array.isArray(template)) {
      return Array.isArray(value)
        ? value
        : String(value)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (typeof template === 'string') return String(value);
    return value;
  }

  const envLayer = [];
  for (const [key, raw] of Object.entries(env)) {
    if (!key.startsWith(envPrefix) || raw === undefined) continue;
    const path = key.slice(envPrefix.length).split('__').map(camel).filter(Boolean);
    if (path.length > 0) envLayer.push([path, raw]);
  }

  const argvLayer = [];
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const body = token.slice(2);
    const eq = body.indexOf('=');
    let key = eq === -1 ? body : body.slice(0, eq);
    let value = eq === -1 ? undefined : body.slice(eq + 1);
    if (value === undefined) {
      if (key.startsWith('no-')) {
        key = key.slice(3);
        value = false;
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        value = argv[++i];
      } else {
        value = true;
      }
    }
    argvLayer.push([key.split('.').map(camel), value]);
  }

  const result = {};
  const sources = {};
  function apply(name, entries, shouldCoerce) {
    for (const [path, value] of entries) {
      const label = path.join('.');
      setAt(result, path, shouldCoerce ? coerce(value, getAt(defaults, path), label) : clone(value));
      sources[label] = name;
    }
  }
  apply('defaults', leaves(defaults), false);
  apply('file', leaves(file), false);
  apply('env', envLayer, true);
  apply('argv', argvLayer, true);

  for (const label of Object.keys(sources)) {
    if (getAt(result, label.split('.')) === undefined) delete sources[label];
  }

  const redacted = JSON.parse(JSON.stringify(result));
  for (const secret of secrets) {
    const path = secret.split('.');
    if (getAt(redacted, path) !== undefined) setAt(redacted, path, '***');
  }

  return { config: deepFreeze(result), redacted, sources };
}

module.exports = buildConfig;`,
    explanation:
      "Every source becomes a flat list of [path, value] leaves, applied to one result in precedence order, so deep merging, arrays-replace and provenance all fall out of the same loop. Coercion looks at the type of the default for that path, which is the only place the app declares what type a setting should be.",
  },
};
