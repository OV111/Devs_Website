export default {
  slug: "contract-check",
  trackId: "node-dev",
  layerId: "node-dev-8",
  type: "CODE",
  difficulty: "hard",
  title: "Consumer-driven contract matching",
  summary: "Compare a real response with a contract using type matchers ($like), regexes, array matchers and partial objects, and report mismatches with paths.",
  description:
    "Contract tests (Pact) make a consumer say exactly what it needs from an API. The contract uses matchers: 'this field must be a number', 'this must look like a UUID', 'this array has at least one item shaped like this'. The provider can add new fields freely, but must not remove or retype what consumers rely on.",
  task:
    "Write <code>checkContract(expected, actual, path = '$')</code> returning an array of mismatches <code>{ path, message }</code> (empty when the actual value satisfies the contract).",
  constraints: [
    "Plain objects in <code>expected</code> match partially: every key of <code>expected</code> must exist in <code>actual</code> (<code>message: 'missing'</code> at <code>path.key</code>) and match; EXTRA keys in <code>actual</code> are allowed. A non-object actual gives <code>'expected object, got &lt;type&gt;'</code>. Type names are <code>null array object string number boolean undefined</code>.",
    "Literal arrays must have the same length (<code>'expected N item(s), got M'</code>) and each present item must match (paths like <code>$.a[0]</code>). Literal primitives must be strictly equal: <code>'expected \"x\", got \"y\"'</code> using <code>JSON.stringify</code> for both.",
    "<code>{ $like: example }</code>: the actual value must have the same TYPE as <code>example</code> (<code>'expected number, got string'</code>); for objects, every key of the example must exist in actual and match <code>$like</code>-style recursively; for arrays, if the example is non-empty every actual item must match <code>$like</code> of the example's first item (an empty actual array is fine).",
    "<code>{ $regex: 'pattern', flags? }</code>: actual must be a string matching it (<code>'expected string matching /p/f, got &lt;type&gt;'</code> for non-strings, <code>'does not match /p/f'</code> otherwise).",
    "<code>{ $eachLike: template, min = 1 }</code>: actual must be an array (<code>'expected array, got &lt;type&gt;'</code>) with at least <code>min</code> items (<code>'expected at least N item(s), got M'</code>), each matched against <code>template</code> with the full rules (paths like <code>$.items[2].id</code>). Matchers can be nested anywhere, including inside literal objects and arrays.",
  ],
  example: `checkContract({ status: 200, body: { id: { $like: 1 }, tags: { $eachLike: { $like: 'x' } } } }, response) // []`,
  tags: ["testing","contract-testing","pact","api"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "checkContract.js",
      lang: "js",
      code: `// checkContract.js
function checkContract(expected, actual, path = '$') {
  // your code here
}

module.exports = checkContract;`,
    },
  ],
  testFile: {
    name: "checkContract_test.js",
    lang: "test",
    code: `const checkContract = require('./checkContract');

test('like', () => {
  expect(checkContract({ id: { $like: 1 } }, { id: 99, extra: true })).toEqual([]);
});

test('wrong_type', () => {
  expect(checkContract({ id: { $like: 1 } }, { id: 'x' })[0].message).toBe('expected number, got string');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a <code>typeOf</code> helper that separates <code>null</code> and arrays from objects, and one recursive <code>check(expected, actual, path)</code> that pushes into a shared <code>out</code> array." },
    { order: 2, cost: 5, text: "A matcher is a plain object containing a <code>$like</code>, <code>$regex</code> or <code>$eachLike</code> key; test for those BEFORE treating the object as a partial object." },
    { order: 3, cost: 15, text: "Write a separate <code>like(example, actual, path)</code> for the type-only recursion, since <code>$like</code> compares types, not values." },
  ],
  hiddenTests: [
    { name: "literal_values", code: `assert(checkContract(5, 5).length === 0 && checkContract('a', 'a').length === 0 && checkContract(null, null).length === 0 && checkContract(true, true).length === 0, 'equal literals');
const m = checkContract({ status: 200, name: 'a' }, { status: 201, name: 'a' });
assert(m.length === 1 && m[0].path === '$.status' && m[0].message === 'expected 200, got 201', JSON.stringify(m));
assert(checkContract('x', 'y')[0].message === 'expected "x", got "y"', 'strings are quoted');
assert(checkContract(1, '1')[0].message === 'expected 1, got "1"', 'strict equality, no coercion');
assert(checkContract(null, undefined)[0].message === 'expected null, got undefined', 'null vs undefined');` },
    { name: "objects_match_partially_and_extra_keys_are_fine", code: `assert(checkContract({ a: 1 }, { a: 1, b: 2, c: { d: 3 } }).length === 0, 'extra keys allowed');
const r = checkContract({ a: 1, b: { c: 2 } }, { a: 1 });
assert(r.length === 1 && r[0].path === '$.b' && r[0].message === 'missing', JSON.stringify(r));
const nested = checkContract({ a: { b: { c: 1 } } }, { a: { b: {} } });
assert(nested.length === 1 && nested[0].path === '$.a.b.c' && nested[0].message === 'missing', 'deep path: ' + JSON.stringify(nested));
assert(checkContract({}, { anything: 1 }).length === 0, 'an empty expected object accepts any object');` },
    { name: "non_object_actual_for_an_object_contract", code: `for (const [actual, name] of [[null, 'null'], [[], 'array'], ['s', 'string'], [5, 'number'], [undefined, 'undefined']]) {
  const r = checkContract({ a: 1 }, actual);
  assert(r.length === 1 && r[0].path === '$' && r[0].message === 'expected object, got ' + name, name + ': ' + JSON.stringify(r));
}` },
    { name: "all_mismatches_are_reported", code: `const r = checkContract({ a: 1, b: 2, c: 3 }, { a: 9, c: 8 });
assert(r.map((x) => x.path + ':' + x.message).join('|') === '$.a:expected 1, got 9|$.b:missing|$.c:expected 3, got 8', r.map((x) => x.path + ':' + x.message).join('|'));` },
    { name: "like_matches_by_type", code: `assert(checkContract({ $like: 1 }, 99).length === 0 && checkContract({ $like: 'x' }, 'anything').length === 0 && checkContract({ $like: true }, false).length === 0, 'primitives');
assert(checkContract({ $like: 1 }, 'x')[0].message === 'expected number, got string', 'number vs string');
assert(checkContract({ $like: 'x' }, null)[0].message === 'expected string, got null', 'null is its own type');
assert(checkContract({ $like: {} }, [])[0].message === 'expected object, got array', 'array is not an object');
assert(checkContract({ $like: 1 }, undefined)[0].message === 'expected number, got undefined', 'undefined');
assert(checkContract({ $like: null }, null).length === 0, 'null example matches null');` },
    { name: "like_recurses_into_objects_and_arrays", code: `const example = { $like: { id: 1, user: { name: 'a', tags: ['x'] } } };
assert(checkContract(example, { id: 5, user: { name: 'zed', tags: ['p', 'q'] }, extra: 1 }).length === 0, 'same shape, different values, extra keys fine');
const r = checkContract(example, { id: 'x', user: { tags: ['p', 7] } });
assert(r.map((x) => x.path + ':' + x.message).join('|') === '$.id:expected number, got string|$.user.name:missing|$.user.tags[1]:expected string, got number', r.map((x) => x.path + ':' + x.message).join('|'));
assert(checkContract({ $like: [1] }, []).length === 0, 'an empty array is fine for a non-empty example');
assert(checkContract({ $like: [{ id: 1 }] }, [{ id: 2 }, { id: 3 }]).length === 0, 'every item like the first example item');
assert(checkContract({ $like: [] }, [1, 'a']).length === 0, 'an empty example array accepts any items');` },
    { name: "regex_matcher", code: `assert(checkContract({ $regex: '^[0-9a-f]{8}-' }, '3f2504e0-4f89').length === 0, 'matches');
const no = checkContract({ $regex: '^\\\\d+$' }, 'abc');
assert(no.length === 1 && no[0].message === 'does not match /^\\\\d+$/', JSON.stringify(no));
assert(checkContract({ $regex: '^abc$', flags: 'i' }, 'ABC').length === 0, 'flags are honoured');
assert(checkContract({ $regex: 'x', flags: 'i' }, 'y')[0].message === 'does not match /x/i', 'flags in the message');
assert(checkContract({ $regex: '^1$' }, 1)[0].message === 'expected string matching /^1$/, got number', 'non-strings fail: ' + checkContract({ $regex: '^1$' }, 1)[0].message);
assert(checkContract({ $regex: 'x', flags: 'g' }, 'x').length === 0 && checkContract({ $regex: 'x', flags: 'g' }, 'x').length === 0, 'a global regex does not carry state between calls');` },
    { name: "eachLike_matcher", code: `const c = { $eachLike: { id: { $like: 1 } } };
assert(checkContract(c, [{ id: 1 }, { id: 2 }]).length === 0, 'ok');
assert(checkContract(c, [])[0].message === 'expected at least 1 item(s), got 0', 'default min is 1');
assert(checkContract({ $eachLike: { $like: 1 }, min: 0 }, []).length === 0, 'min 0 allows empty');
assert(checkContract({ $eachLike: { $like: 1 }, min: 3 }, [1, 2])[0].message === 'expected at least 3 item(s), got 2', 'custom min');
assert(checkContract(c, 'x')[0].message === 'expected array, got string', 'not an array');
assert(checkContract(c, { id: 1 })[0].message === 'expected array, got object', 'object is not an array');
const r = checkContract(c, [{ id: 1 }, { id: 'x' }, {}]);
assert(r.map((x) => x.path + ':' + x.message).join('|') === '$[1].id:expected number, got string|$[2].id:missing', r.map((x) => x.path + ':' + x.message).join('|'));` },
    { name: "literal_arrays", code: `assert(checkContract([1, 2], [1, 2]).length === 0, 'equal');
const r = checkContract([1, 2, 3], [1, 9]);
assert(r.map((x) => x.path + ':' + x.message).join('|') === '$:expected 3 item(s), got 2|$[1]:expected 2, got 9', r.map((x) => x.path + ':' + x.message).join('|'));
assert(checkContract([1], 'x')[0].message === 'expected array, got string', 'not an array');
assert(checkContract([{ $like: 1 }, { $regex: '^a' }], [5, 'abc']).length === 0, 'matchers inside literal arrays');
assert(checkContract([], [1])[0].message === 'expected 0 item(s), got 1', 'extra items are not allowed in literal arrays');` },
    { name: "a_realistic_response_contract", code: `const contract = {
  status: 201,
  headers: { 'content-type': { $regex: 'json' }, location: { $regex: '^/users/\\\\d+$' } },
  body: { id: { $like: 1 }, email: { $regex: '^[^@]+@[^@]+$' }, roles: { $eachLike: { $like: 'admin' }, min: 0 }, profile: { $like: { name: 'x', age: 1 } } },
};
const good = { status: 201, headers: { 'content-type': 'application/json; charset=utf-8', location: '/users/42', server: 'x' }, body: { id: 42, email: 'a@b.io', roles: [], profile: { name: 'Ann', age: 30, bio: 'hi' }, createdAt: 'now' } };
assert(checkContract(contract, good).length === 0, 'compatible response with extra fields passes');
const bad = { status: 200, headers: { 'content-type': 'text/html' }, body: { id: '42', email: 'nope', roles: ['a', 7], profile: { name: 'Ann' } } };
const paths = checkContract(contract, bad).map((x) => x.path).join(' ');
assert(paths === '$.status $.headers.content-type $.headers.location $.body.id $.body.email $.body.roles[1] $.body.profile.age', paths);` },
    { name: "matchers_nested_in_literals_and_custom_paths", code: `const r = checkContract({ list: [{ id: { $like: 1 } }] }, { list: [{ id: 'x' }] });
assert(r.length === 1 && r[0].path === '$.list[0].id', JSON.stringify(r));
const custom = checkContract({ a: 1 }, { a: 2 }, 'response.body');
assert(custom[0].path === 'response.body.a', 'the starting path is configurable: ' + custom[0].path);` },
    { name: "a_plain_object_with_dollar_like_keys_is_only_a_matcher_when_it_has_a_matcher_key", code: `assert(checkContract({ price: 5, $meta: 1 }, { price: 5, $meta: 1 }).length === 0, 'unrelated $ keys are ordinary keys');` },
    { name: "inputs_are_not_mutated", code: `const expected = { a: { $eachLike: { $like: 1 } } }; const actual = { a: [1, 2] };
const snap = JSON.stringify([expected, actual]);
checkContract(expected, actual);
assert(JSON.stringify([expected, actual]) === snap, 'unchanged');` },
  ],
  solution: {
    code: `function checkContract(expected, actual, path = '$') {
  const typeOf = (v) => {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;
  };
  const isMatcher = (v, key) => typeOf(v) === 'object' && key in v;
  const out = [];
  const add = (p, message) => out.push({ path: p, message });

  function like(example, value, p) {
    const expectedType = typeOf(example);
    const actualType = typeOf(value);
    if (expectedType !== actualType) {
      add(p, 'expected ' + expectedType + ', got ' + actualType);
      return;
    }
    if (expectedType === 'object') {
      for (const key of Object.keys(example)) {
        if (!(key in value)) add(p + '.' + key, 'missing');
        else like(example[key], value[key], p + '.' + key);
      }
    } else if (expectedType === 'array' && example.length > 0) {
      value.forEach((item, i) => like(example[0], item, p + '[' + i + ']'));
    }
  }

  function check(exp, act, p) {
    if (isMatcher(exp, '$like')) {
      like(exp.$like, act, p);
      return;
    }
    if (isMatcher(exp, '$regex')) {
      const label = '/' + exp.$regex + '/' + (exp.flags || '');
      if (typeof act !== 'string') add(p, 'expected string matching ' + label + ', got ' + typeOf(act));
      else if (!new RegExp(exp.$regex, exp.flags).test(act)) add(p, 'does not match ' + label);
      return;
    }
    if (isMatcher(exp, '$eachLike')) {
      if (!Array.isArray(act)) {
        add(p, 'expected array, got ' + typeOf(act));
        return;
      }
      const min = exp.min === undefined ? 1 : exp.min;
      if (act.length < min) add(p, 'expected at least ' + min + ' item(s), got ' + act.length);
      act.forEach((item, i) => check(exp.$eachLike, item, p + '[' + i + ']'));
      return;
    }
    if (typeOf(exp) === 'object') {
      if (typeOf(act) !== 'object') {
        add(p, 'expected object, got ' + typeOf(act));
        return;
      }
      for (const key of Object.keys(exp)) {
        if (!(key in act)) add(p + '.' + key, 'missing');
        else check(exp[key], act[key], p + '.' + key);
      }
      return;
    }
    if (Array.isArray(exp)) {
      if (!Array.isArray(act)) {
        add(p, 'expected array, got ' + typeOf(act));
        return;
      }
      if (act.length !== exp.length) add(p, 'expected ' + exp.length + ' item(s), got ' + act.length);
      exp.forEach((item, i) => {
        if (i < act.length) check(item, act[i], p + '[' + i + ']');
      });
      return;
    }
    if (exp !== act) add(p, 'expected ' + JSON.stringify(exp) + ', got ' + JSON.stringify(act));
  }

  check(expected, actual, path);
  return out;
}

module.exports = checkContract;`,
    explanation:
      "A contract is a tolerant description: objects match partially so the provider can add fields, $like checks only shapes, and arrays are described as 'each item looks like this'. Collecting every mismatch with a path (instead of stopping at the first) is what makes a failing contract test actionable.",
  },
};
