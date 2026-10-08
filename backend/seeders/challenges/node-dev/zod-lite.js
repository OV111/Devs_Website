export default {
  slug: "zod-lite",
  trackId: "node-dev",
  layerId: "node-dev-7",
  type: "CODE",
  difficulty: "hard",
  title: "Build a mini Zod",
  summary: "Chainable schemas (string, number, object, array, enum) with checks, optional/default, refine and path-aware errors.",
  description:
    "Zod validates data at the edge of your app and infers types from the schemas. Under the hood it's a set of immutable schema objects, each parsing a value and collecting issues with a path. Writing a small version teaches how one failing field reports its location without stopping the others.",
  task:
    "Write <code>createZ()</code> returning <code>z</code> with <code>z.string()</code>, <code>z.number()</code>, <code>z.boolean()</code>, <code>z.enum(values)</code>, <code>z.array(schema)</code>, <code>z.object(shape)</code>. Every schema has <code>parse(data)</code> (returns the value or throws) and <code>safeParse(data)</code> (returns <code>{ success: true, data }</code> or <code>{ success: false, error }</code>).",
  constraints: [
    "An issue is <code>{ path: [...], code, message }</code>. The error is an <code>Error</code> with <code>name: 'ZodError'</code>, an <code>issues</code> array, and <code>message</code> = issues joined by <code>'; '</code> where each is <code>'a.b: message'</code> (no prefix for an empty path).",
    "<code>undefined</code> on a non-optional schema: code <code>invalid_type</code>, message <code>'Required'</code>. <code>null</code> needs <code>.nullable()</code>, otherwise <code>invalid_type</code> with <code>'Expected &lt;kind&gt;, received null'</code>. A wrong type is one <code>invalid_type</code> issue <code>'Expected string, received number'</code> (type names: <code>null array nan string number boolean object</code>) and no further checks run on that value.",
    "Modifiers return NEW schemas (never mutate): <code>.optional()</code> (undefined allowed, key omitted from object output), <code>.nullable()</code>, <code>.default(valueOrFn)</code> (used when undefined, then validated), <code>.refine(fn, message = 'Invalid input')</code> (code <code>custom</code>, only runs when the schema had no other issues).",
    "String checks: <code>.min(n)</code> / <code>.max(n)</code> (<code>too_small</code>/<code>too_big</code>), <code>.email()</code>, <code>.regex(re)</code> (<code>invalid_string</code>). Number checks: <code>.int()</code> (<code>invalid_type</code>), <code>.min(n)</code>, <code>.max(n)</code>, <code>.positive()</code> (<code>too_small</code>/<code>too_big</code>); NaN is <code>invalid_type</code> 'received nan'. Array: <code>.min(n)</code> / <code>.max(n)</code>. Every check takes an optional custom message as its last argument, and ALL failing checks are reported.",
    "<code>z.enum</code> rejects other values with code <code>invalid_enum_value</code>. <code>z.object</code> checks the keys of its shape in order, strips unknown keys, collects issues from every field (paths like <code>['user','tags',1]</code>), and rejects non-objects (null, arrays, primitives) with <code>invalid_type</code> 'Expected object, received ...'. <code>z.array</code> validates each item with its index in the path.",
  ],
  example: `const User = z.object({ name: z.string().min(2), age: z.number().int().optional() }); User.parse({ name: 'Ann' }); // { name: 'Ann' }`,
  tags: ["zod","validation","schemas","typescript"],
  estimatedMins: 65,
  xp: 70,
  starterFiles: [
    {
      name: "createZ.js",
      lang: "js",
      code: `// createZ.js
function createZ() {
  // your code here
}

module.exports = createZ;`,
    },
  ],
  testFile: {
    name: "createZ_test.js",
    lang: "test",
    code: `const createZ = require('./createZ');

test('parses', () => {
  const z = createZ(); expect(z.string().parse('a')).toBe('a');
});

test('fails', () => {
  const z = createZ(); const r = z.number().safeParse('x'); expect(r.success).toBe(false); expect(r.error.issues[0].message).toBe('Expected number, received string');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep each schema as a plain <code>def</code> object (<code>{ kind, checks, refinements, optional, nullable, hasDefault, ... }</code>) and a <code>make(def)</code> that returns the schema with methods like <code>optional: () =&gt; make({ ...def, optional: true })</code>." },
    { order: 2, cost: 5, text: "Write one recursive <code>run(def, input, path, issues)</code> that pushes issues instead of throwing and returns the parsed value; objects and arrays call it for each child with an extended <code>path</code>." },
    { order: 3, cost: 15, text: "Remember the order: undefined/default/optional, null/nullable, type check (return early), kind-specific checks, then refinements only if no new issues appeared." },
  ],
  hiddenTests: [
    { name: "string_ok_and_type_errors", code: `const z = createZ();
assert(z.string().parse('hi') === 'hi', 'ok');
const r = z.string().safeParse(5);
assert(r.success === false && r.error.issues.length === 1, 'one issue');
assert(r.error.issues[0].code === 'invalid_type' && r.error.issues[0].message === 'Expected string, received number' && r.error.issues[0].path.length === 0, JSON.stringify(r.error.issues));
const names = [[null, 'null'], [[], 'array'], [NaN, 'nan'], [true, 'boolean'], [{}, 'object']].map(([v, n]) => [z.string().safeParse(v).error.issues[0].message, 'Expected string, received ' + n]);
for (const [got, want] of names) assert(got === want, got + ' !== ' + want);` },
    { name: "required_and_nullable", code: `const z = createZ();
const miss = z.string().safeParse(undefined);
assert(miss.error.issues[0].message === 'Required' && miss.error.issues[0].code === 'invalid_type', 'required');
assert(z.string().safeParse(null).error.issues[0].message === 'Expected string, received null', 'null rejected');
assert(z.string().nullable().parse(null) === null, 'nullable accepts null');
assert(z.string().nullable().safeParse(undefined).success === false, 'but not undefined');` },
    { name: "optional_and_default", code: `const z = createZ();
assert(z.string().optional().parse(undefined) === undefined, 'optional');
assert(z.string().default('x').parse(undefined) === 'x', 'default value');
assert(z.string().default('x').parse('y') === 'y', 'default not used when present');
let n = 0;
const lazy = z.number().default(() => ++n);
assert(lazy.parse(undefined) === 1 && lazy.parse(undefined) === 2, 'default function is called per parse');
assert(z.string().min(5).default('abc').safeParse(undefined).success === false, 'the default is validated too');
assert(z.string().default('x').safeParse(null).success === false, 'default does not cover null');` },
    { name: "string_checks_collect_every_failure", code: `const z = createZ();
const r = z.string().min(5).email().safeParse('ab');
const codes = r.error.issues.map((i) => i.code).join();
assert(codes === 'too_small,invalid_string', 'both reported in order: ' + codes);
assert(r.error.issues[0].message === 'String must contain at least 5 character(s)' && r.error.issues[1].message === 'Invalid email', 'default messages');
assert(z.string().max(2).safeParse('abc').error.issues[0].code === 'too_big', 'max');
assert(z.string().min(3).max(3).safeParse('abc').success === true, 'boundaries are inclusive');
assert(z.string().regex(/^\\d+$/).safeParse('12a').error.issues[0].code === 'invalid_string', 'regex');
assert(z.string().regex(/^\\d+$/).safeParse('123').success === true, 'regex ok');
assert(z.string().email().safeParse('a@b.co').success === true && z.string().email().safeParse('a@b').success === false && z.string().email().safeParse('a b@c.d').success === false, 'email shape');` },
    { name: "custom_messages", code: `const z = createZ();
assert(z.string().min(3, 'Too short!').safeParse('a').error.issues[0].message === 'Too short!', 'min');
assert(z.string().email('Not an email').safeParse('x').error.issues[0].message === 'Not an email', 'email');
assert(z.number().int('Whole numbers only').safeParse(1.5).error.issues[0].message === 'Whole numbers only', 'int');
assert(z.number().positive('Must be > 0').safeParse(0).error.issues[0].message === 'Must be > 0', 'positive');` },
    { name: "number_checks", code: `const z = createZ();
assert(z.number().parse(1.5) === 1.5 && z.number().parse(-3) === -3, 'ok');
assert(z.number().safeParse(NaN).error.issues[0].message === 'Expected number, received nan', 'NaN');
assert(z.number().safeParse('5').error.issues[0].message === 'Expected number, received string', 'string');
assert(z.number().int().safeParse(1.5).error.issues[0].code === 'invalid_type' && z.number().int().safeParse(2).success, 'int');
const r = z.number().min(1).max(10).safeParse(0);
assert(r.error.issues[0].code === 'too_small' && r.error.issues[0].message === 'Number must be greater than or equal to 1', 'min: ' + JSON.stringify(r.error.issues));
assert(z.number().max(10).safeParse(11).error.issues[0].code === 'too_big', 'max');
assert(z.number().min(1).max(10).safeParse(1).success && z.number().min(1).max(10).safeParse(10).success, 'inclusive');
assert(z.number().positive().safeParse(0).success === false && z.number().positive().safeParse(0.1).success === true, 'positive');
assert(z.number().int().min(1).safeParse(0.5).error.issues.length === 2, 'int and min both fail');` },
    { name: "boolean_and_enum", code: `const z = createZ();
assert(z.boolean().parse(false) === false, 'false is fine');
assert(z.boolean().safeParse('true').error.issues[0].message === 'Expected boolean, received string', 'boolean type');
const e = z.enum(['admin', 'user']);
assert(e.parse('admin') === 'admin', 'enum ok');
const bad = e.safeParse('root');
assert(bad.error.issues[0].code === 'invalid_enum_value', 'code');
assert(bad.error.issues[0].message === "Invalid enum value. Expected 'admin' | 'user', received 'root'", 'message: ' + bad.error.issues[0].message);
assert(e.safeParse(5).error.issues[0].code === 'invalid_type', 'non-string is a type error');` },
    { name: "objects_strip_unknown_keys_and_keep_valid_data", code: `const z = createZ();
const User = z.object({ name: z.string(), age: z.number() });
const r = User.parse({ name: 'Ann', age: 30, isAdmin: true });
assert(JSON.stringify(r) === '{"name":"Ann","age":30}', 'only schema keys: ' + JSON.stringify(r));
const input = { name: 'A', age: 1, extra: 1 };
User.parse(input);
assert('extra' in input, 'input untouched');` },
    { name: "object_issues_have_paths_in_shape_order", code: `const z = createZ();
const User = z.object({ name: z.string(), age: z.number(), email: z.string().email() });
const r = User.safeParse({ age: 'x', email: 'nope' });
const summary = r.error.issues.map((i) => i.path.join('.') + '|' + i.code).join(' ');
assert(summary === 'name|invalid_type age|invalid_type email|invalid_string', summary);
assert(r.error.issues[0].message === 'Required', 'missing key is Required');` },
    { name: "optional_keys_are_omitted_from_output", code: `const z = createZ();
const S = z.object({ a: z.string(), b: z.string().optional(), c: z.number().default(7), d: z.string().nullable() });
const r = S.parse({ a: 'x', d: null });
assert(JSON.stringify(r) === '{"a":"x","c":7,"d":null}', JSON.stringify(r));
assert(!('b' in r), 'b omitted');` },
    { name: "non_objects_are_rejected", code: `const z = createZ();
const S = z.object({});
for (const [v, name] of [[null, 'null'], [[], 'array'], ['s', 'string'], [5, 'number']]) {
  const r = S.safeParse(v);
  assert(r.error.issues[0].message === 'Expected object, received ' + name, name + ': ' + r.error.issues[0].message);
}
assert(S.safeParse(undefined).error.issues[0].message === 'Required', 'undefined is Required');` },
    { name: "nested_objects_and_arrays_report_deep_paths", code: `const z = createZ();
const Order = z.object({ id: z.number(), items: z.array(z.object({ sku: z.string(), qty: z.number().int().min(1) })), customer: z.object({ tags: z.array(z.string()) }) });
const r = Order.safeParse({ id: 1, items: [{ sku: 'a', qty: 2 }, { sku: 5, qty: 0 }], customer: { tags: ['x', 3] } });
const paths = r.error.issues.map((i) => JSON.stringify(i.path)).join(' ');
assert(paths === '["items",1,"sku"] ["items",1,"qty"] ["customer","tags",1]', 'paths: ' + paths);
const ok = Order.parse({ id: 1, items: [{ sku: 'a', qty: 2, junk: 1 }], customer: { tags: [] } });
assert(JSON.stringify(ok) === '{"id":1,"items":[{"sku":"a","qty":2}],"customer":{"tags":[]}}', 'nested stripping: ' + JSON.stringify(ok));` },
    { name: "array_checks", code: `const z = createZ();
assert(z.array(z.number()).parse([1, 2]).length === 2 && z.array(z.number()).parse([]).length === 0, 'ok');
assert(z.array(z.number()).safeParse('x').error.issues[0].message === 'Expected array, received string', 'type');
assert(z.array(z.number()).safeParse({}).error.issues[0].message === 'Expected array, received object', 'object is not an array');
const small = z.array(z.string()).min(2).safeParse(['a']);
assert(small.error.issues[0].code === 'too_small' && small.error.issues[0].message === 'Array must contain at least 2 element(s)', 'min: ' + JSON.stringify(small.error.issues));
assert(z.array(z.string()).max(1).safeParse(['a', 'b']).error.issues[0].code === 'too_big', 'max');
assert(z.array(z.string()).optional().parse(undefined) === undefined, 'optional arrays');` },
    { name: "refine", code: `const z = createZ();
const Pw = z.object({ password: z.string(), confirm: z.string() }).refine((v) => v.password === v.confirm, 'Passwords differ');
assert(Pw.safeParse({ password: 'a', confirm: 'a' }).success === true, 'passes');
const r = Pw.safeParse({ password: 'a', confirm: 'b' });
assert(r.error.issues.length === 1 && r.error.issues[0].code === 'custom' && r.error.issues[0].message === 'Passwords differ' && r.error.issues[0].path.length === 0, JSON.stringify(r.error.issues));
const even = z.number().refine((n) => n % 2 === 0);
assert(even.safeParse(3).error.issues[0].message === 'Invalid input', 'default message');
let calls = 0;
const guarded = z.string().min(3).refine(() => { calls++; return true; });
guarded.safeParse('ab');
assert(calls === 0, 'refinements do not run when earlier checks failed');
const inner = z.object({ n: z.number().refine((n) => n > 0, 'positive please') });
assert(inner.safeParse({ n: -1 }).error.issues[0].path.join('.') === 'n', 'refine on a field reports the field path');` },
    { name: "parse_throws_zod_errors_with_a_readable_message", code: `const z = createZ();
const S = z.object({ user: z.object({ name: z.string().min(2) }), n: z.number() });
let err = null;
try { S.parse({ user: { name: 'a' }, n: 'x' }); } catch (e) { err = e; }
assert(err instanceof Error && err.name === 'ZodError' && Array.isArray(err.issues) && err.issues.length === 2, 'error object');
assert(err.message === 'user.name: String must contain at least 2 character(s); n: Expected number, received string', 'message: ' + err.message);
let err2 = null;
try { z.string().parse(1); } catch (e) { err2 = e; }
assert(err2.message === 'Expected string, received number', 'no prefix for an empty path: ' + err2.message);` },
    { name: "safe_parse_result_shapes", code: `const z = createZ();
const good = z.number().safeParse(3);
assert(good.success === true && good.data === 3 && !('error' in good), 'success shape');
const bad = z.number().safeParse('3');
assert(bad.success === false && bad.error.name === 'ZodError' && !('data' in bad), 'failure shape');` },
    { name: "schemas_are_immutable_and_reusable", code: `const z = createZ();
const base = z.string();
const strict = base.min(5);
const opt = base.optional();
assert(base.safeParse('a').success === true, 'the base schema is unchanged by .min()');
assert(strict.safeParse('a').success === false, 'derived schema has the check');
assert(base.safeParse(undefined).success === false && opt.safeParse(undefined).success === true, 'optional did not leak into the base');
const a = base.min(2); const b = base.min(10);
assert(a.safeParse('abc').success === true && b.safeParse('abc').success === false, 'independent branches');
const shared = z.object({ n: z.number() });
assert(shared.safeParse({ n: 1 }).success && shared.safeParse({ n: 1 }).success, 'reusing a schema many times is fine');` },
    { name: "modifier_order_and_combinations", code: `const z = createZ();
const s = z.string().min(3).optional();
assert(s.safeParse(undefined).success === true && s.safeParse('ab').success === false, 'optional then check still applies when present');
const t = z.number().int().nullable().default(5);
assert(t.parse(undefined) === 5 && t.parse(null) === null && t.parse(2) === 2, 'default, nullable and checks together');
const u = z.string().optional().nullable();
assert(u.parse(null) === null && u.parse(undefined) === undefined && u.parse('x') === 'x', 'both');` },
  ],
  solution: {
    code: `function createZ() {
  const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const typeName = (v) => {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    if (typeof v === 'number' && Number.isNaN(v)) return 'nan';
    return typeof v;
  };

  function makeError(issues) {
    const message = issues.map((i) => (i.path.length ? i.path.join('.') + ': ' : '') + i.message).join('; ');
    const error = new Error(message);
    error.name = 'ZodError';
    error.issues = issues;
    return error;
  }

  function run(def, input, path, issues) {
    let value = input;
    if (value === undefined && def.hasDefault) {
      value = typeof def.defaultValue === 'function' ? def.defaultValue() : def.defaultValue;
    }
    if (value === undefined) {
      if (def.optional) return undefined;
      issues.push({ path, code: 'invalid_type', message: 'Required' });
      return undefined;
    }
    if (value === null) {
      if (def.nullable) return null;
      issues.push({ path, code: 'invalid_type', message: 'Expected ' + def.kind + ', received null' });
      return undefined;
    }

    const before = issues.length;
    const add = (code, message, custom) => issues.push({ path, code, message: custom || message });
    const wrongType = () => {
      add('invalid_type', 'Expected ' + def.kind + ', received ' + typeName(value));
      return undefined;
    };
    let out = value;

    if (def.kind === 'string') {
      if (typeof value !== 'string') return wrongType();
      for (const c of def.checks) {
        if (c.kind === 'min' && value.length < c.value) {
          add('too_small', 'String must contain at least ' + c.value + ' character(s)', c.message);
        } else if (c.kind === 'max' && value.length > c.value) {
          add('too_big', 'String must contain at most ' + c.value + ' character(s)', c.message);
        } else if (c.kind === 'email' && !EMAIL.test(value)) {
          add('invalid_string', 'Invalid email', c.message);
        } else if (c.kind === 'regex' && !c.value.test(value)) {
          add('invalid_string', 'Invalid', c.message);
        }
      }
    } else if (def.kind === 'number') {
      if (typeof value !== 'number' || Number.isNaN(value)) return wrongType();
      for (const c of def.checks) {
        if (c.kind === 'int' && !Number.isInteger(value)) {
          add('invalid_type', 'Expected integer, received float', c.message);
        } else if (c.kind === 'min' && value < c.value) {
          add('too_small', 'Number must be greater than or equal to ' + c.value, c.message);
        } else if (c.kind === 'max' && value > c.value) {
          add('too_big', 'Number must be less than or equal to ' + c.value, c.message);
        } else if (c.kind === 'positive' && !(value > 0)) {
          add('too_small', 'Number must be greater than 0', c.message);
        }
      }
    } else if (def.kind === 'boolean') {
      if (typeof value !== 'boolean') return wrongType();
    } else if (def.kind === 'enum') {
      if (typeof value !== 'string') {
        add('invalid_type', 'Expected string, received ' + typeName(value));
        return undefined;
      }
      if (!def.values.includes(value)) {
        const expected = def.values.map((v) => "'" + v + "'").join(' | ');
        add('invalid_enum_value', 'Invalid enum value. Expected ' + expected + ", received '" + value + "'");
      }
    } else if (def.kind === 'array') {
      if (!Array.isArray(value)) return wrongType();
      for (const c of def.checks) {
        if (c.kind === 'min' && value.length < c.value) {
          add('too_small', 'Array must contain at least ' + c.value + ' element(s)', c.message);
        } else if (c.kind === 'max' && value.length > c.value) {
          add('too_big', 'Array must contain at most ' + c.value + ' element(s)', c.message);
        }
      }
      out = value.map((item, i) => run(def.item, item, [...path, i], issues));
    } else if (def.kind === 'object') {
      if (typeof value !== 'object' || Array.isArray(value)) return wrongType();
      out = {};
      for (const key of Object.keys(def.shape)) {
        const parsed = run(def.shape[key]._def, value[key], [...path, key], issues);
        if (parsed !== undefined) out[key] = parsed;
      }
    }

    if (issues.length === before) {
      for (const refinement of def.refinements) {
        if (!refinement.fn(out)) add('custom', refinement.message);
      }
    }
    return issues.length === before ? out : undefined;
  }

  function make(def) {
    const withCheck = (kind, value, message) => make({ ...def, checks: [...def.checks, { kind, value, message }] });
    const schema = {
      _def: def,
      optional: () => make({ ...def, optional: true }),
      nullable: () => make({ ...def, nullable: true }),
      default: (value) => make({ ...def, hasDefault: true, defaultValue: value }),
      refine: (fn, message = 'Invalid input') => make({ ...def, refinements: [...def.refinements, { fn, message }] }),
      min: (n, message) => withCheck('min', n, message),
      max: (n, message) => withCheck('max', n, message),
      email: (message) => withCheck('email', undefined, message),
      regex: (re, message) => withCheck('regex', re, message),
      int: (message) => withCheck('int', undefined, message),
      positive: (message) => withCheck('positive', undefined, message),
      safeParse(data) {
        const issues = [];
        const parsed = run(def, data, [], issues);
        if (issues.length > 0) return { success: false, error: makeError(issues) };
        return { success: true, data: parsed };
      },
      parse(data) {
        const result = schema.safeParse(data);
        if (!result.success) throw result.error;
        return result.data;
      },
    };
    return schema;
  }

  const base = { checks: [], refinements: [] };
  return {
    string: () => make({ kind: 'string', ...base }),
    number: () => make({ kind: 'number', ...base }),
    boolean: () => make({ kind: 'boolean', ...base }),
    enum: (values) => make({ kind: 'enum', values, ...base }),
    array: (item) => make({ kind: 'array', item: item._def, ...base }),
    object: (shape) => make({ kind: 'object', shape, ...base }),
  };
}

module.exports = createZ;`,
    explanation:
      "Schemas are immutable definitions; parsing is one recursive run() that pushes issues (with the path so far) instead of throwing, so a single pass reports every problem. The order of steps inside run (missing, null, type, checks, refinements) is what makes messages predictable.",
  },
};
