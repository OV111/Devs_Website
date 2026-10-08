export default {
  slug: "load-config",
  trackId: "node-dev",
  layerId: "node-dev-2",
  type: "CODE",
  difficulty: "med",
  title: "Load and validate environment config",
  summary: "Turn process.env strings into typed config, apply defaults, and report ALL problems at once.",
  description:
    "Every value in <code>process.env</code> is a string, and a typo in one only fails later, in production. Good apps validate the environment once at startup (as envalid or Zod-based loaders do) and crash with a clear list of everything wrong.",
  task:
    "Write <code>loadConfig(env, schema)</code>. <code>schema</code> maps a variable name to <code>{ type, required?, default?, min?, max?, values? }</code> with <code>type</code> one of <code>'string' | 'number' | 'boolean' | 'enum'</code>. Return a frozen config object.",
  constraints: [
    "A variable that is missing or an empty string counts as unset.",
    "Unset: use <code>default</code> if the spec has the key <code>default</code> (not validated); else if <code>required</code>, it is a problem <code>'KEY is required'</code>; else the key is left out.",
    "<code>number</code>: must parse to a finite number (blank is invalid), then respect <code>min</code>/<code>max</code>. <code>boolean</code>: case-insensitive <code>true/1/yes/on</code> or <code>false/0/no/off</code>. <code>enum</code>: must be one of <code>values</code>. <code>string</code>: used as is.",
    "Collect EVERY problem; if there are any, throw an <code>Error</code> with <code>message = 'Invalid configuration: ' + problems.join('; ')</code> and a <code>problems</code> array. Each problem string starts with the variable name.",
    "Variables not in the schema are ignored. Return <code>Object.freeze(config)</code>.",
  ],
  example: `loadConfig({ PORT: '8080' }, { PORT: { type: 'number', default: 3000 }, DEBUG: { type: 'boolean', default: false } }) // { PORT: 8080, DEBUG: false }`,
  tags: ["config","env","validation","12-factor"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "loadConfig.js",
      lang: "js",
      code: `// loadConfig.js
function loadConfig(env, schema) {
  // your code here
}

module.exports = loadConfig;`,
    },
  ],
  testFile: {
    name: "loadConfig_test.js",
    lang: "test",
    code: `const loadConfig = require('./loadConfig');

test('default', () => {
  expect(loadConfig({}, { PORT: { type: 'number', default: 3000 } }).PORT).toBe(3000);
});

test('number', () => {
  expect(loadConfig({ PORT: '80' }, { PORT: { type: 'number' } }).PORT).toBe(80);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Loop over the schema (not over env) so unknown variables are ignored by construction." },
    { order: 2, cost: 5, text: "Push a message to a <code>problems</code> array and <code>continue</code> instead of throwing inside the loop; throw once at the end." },
    { order: 3, cost: 15, text: "Treat <code>undefined</code> and <code>''</code> identically as 'unset' before looking at the type." },
  ],
  hiddenTests: [
    { name: "parses_each_type", code: `const c = loadConfig({ PORT: '8080', DEBUG: 'true', NODE_ENV: 'production', NAME: 'api' },
  { PORT: { type: 'number' }, DEBUG: { type: 'boolean' }, NODE_ENV: { type: 'enum', values: ['development', 'production'] }, NAME: { type: 'string' } });
assert(c.PORT === 8080 && typeof c.PORT === 'number', 'number');
assert(c.DEBUG === true, 'boolean');
assert(c.NODE_ENV === 'production' && c.NAME === 'api', 'enum and string');` },
    { name: "defaults_for_unset_and_empty", code: `const schema = { PORT: { type: 'number', default: 3000 }, NAME: { type: 'string', default: 'app' } };
const c = loadConfig({ NAME: '' }, schema);
assert(c.PORT === 3000 && c.NAME === 'app', 'unset and empty both use the default');
assert(loadConfig({ PORT: '81' }, schema).PORT === 81, 'value beats default');` },
    { name: "optional_without_default_is_omitted", code: `const c = loadConfig({}, { X: { type: 'string' } });
assert(!('X' in c), 'key omitted');` },
    { name: "boolean_spellings", code: `const t = ['true', 'TRUE', '1', 'yes', 'On', ' true '];
const f = ['false', 'False', '0', 'no', 'OFF'];
for (const v of t) assert(loadConfig({ B: v }, { B: { type: 'boolean' } }).B === true, v + ' is true');
for (const v of f) assert(loadConfig({ B: v }, { B: { type: 'boolean' } }).B === false, v + ' is false');` },
    { name: "number_validation", code: `const spec = { N: { type: 'number', min: 1, max: 10 } };
assert(loadConfig({ N: '5' }, spec).N === 5 && loadConfig({ N: '1' }, spec).N === 1 && loadConfig({ N: '10' }, spec).N === 10, 'in range, inclusive');
for (const bad of ['abc', '  ', '0', '11', 'Infinity', 'NaN']) {
  let threw = false;
  try { loadConfig({ N: bad }, spec); } catch (e) { threw = true; }
  assert(threw, JSON.stringify(bad) + ' must be rejected');
}` },
    { name: "enum_and_boolean_errors", code: `let e1 = null; let e2 = null;
try { loadConfig({ E: 'staging' }, { E: { type: 'enum', values: ['dev', 'prod'] } }); } catch (e) { e1 = e; }
try { loadConfig({ B: 'maybe' }, { B: { type: 'boolean' } }); } catch (e) { e2 = e; }
assert(e1 && e1.problems[0].startsWith('E '), 'enum problem mentions E: ' + (e1 && e1.problems));
assert(e2 && e2.problems[0].startsWith('B '), 'boolean problem mentions B');` },
    { name: "required_missing", code: `let err = null;
try { loadConfig({ A: '' }, { A: { type: 'string', required: true }, B: { type: 'string', required: true } }); } catch (e) { err = e; }
assert(err instanceof Error, 'throws');
assert(err.problems.length === 2 && err.problems[0] === 'A is required' && err.problems[1] === 'B is required', 'problems: ' + (err && err.problems));` },
    { name: "required_with_default_is_fine", code: `const c = loadConfig({}, { A: { type: 'string', required: true, default: 'x' } });
assert(c.A === 'x', 'default satisfies required');` },
    { name: "reports_all_problems_at_once", code: `let err = null;
try {
  loadConfig({ PORT: 'abc', DEBUG: 'maybe' }, { PORT: { type: 'number' }, DEBUG: { type: 'boolean' }, DB: { type: 'string', required: true } });
} catch (e) { err = e; }
assert(err.problems.length === 3, 'three problems: ' + err.problems);
assert(err.message === 'Invalid configuration: ' + err.problems.join('; '), 'message format: ' + err.message);
assert(err.problems[0].startsWith('PORT') && err.problems[1].startsWith('DEBUG') && err.problems[2].startsWith('DB'), 'in schema order and starting with the name');` },
    { name: "ignores_unknown_variables_and_freezes", code: `const c = loadConfig({ PATH: '/bin', HOME: '/h', A: '1' }, { A: { type: 'string' } });
assert(Object.keys(c).join(',') === 'A', 'only schema keys');
assert(Object.isFrozen(c), 'config is frozen');` },
  ],
  solution: {
    code: `function loadConfig(env, schema) {
  const config = {};
  const problems = [];
  for (const [key, spec] of Object.entries(schema)) {
    const raw = env[key];
    if (raw === undefined || raw === '') {
      if ('default' in spec) config[key] = spec.default;
      else if (spec.required) problems.push(key + ' is required');
      continue;
    }
    if (spec.type === 'number') {
      const n = Number(raw);
      if (raw.trim() === '' || !Number.isFinite(n)) {
        problems.push(key + ' must be a number');
      } else if (spec.min !== undefined && n < spec.min) {
        problems.push(key + ' must be >= ' + spec.min);
      } else if (spec.max !== undefined && n > spec.max) {
        problems.push(key + ' must be <= ' + spec.max);
      } else {
        config[key] = n;
      }
    } else if (spec.type === 'boolean') {
      const v = raw.trim().toLowerCase();
      if (['true', '1', 'yes', 'on'].includes(v)) config[key] = true;
      else if (['false', '0', 'no', 'off'].includes(v)) config[key] = false;
      else problems.push(key + ' must be a boolean');
    } else if (spec.type === 'enum') {
      if (spec.values.includes(raw)) config[key] = raw;
      else problems.push(key + ' must be one of ' + spec.values.join(', '));
    } else {
      config[key] = raw;
    }
  }
  if (problems.length > 0) {
    const err = new Error('Invalid configuration: ' + problems.join('; '));
    err.problems = problems;
    throw err;
  }
  return Object.freeze(config);
}

module.exports = loadConfig;`,
    explanation:
      "Env values are always strings, so each is parsed per its schema type. Collecting problems instead of throwing on the first one means a misconfigured deploy shows every mistake at once, and freezing prevents code from changing config later.",
  },
};
