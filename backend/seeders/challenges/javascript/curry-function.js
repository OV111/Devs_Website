export default {
  slug: "curry-function",
  trackId: "javascript",
  layerId: "javascript-9",
  type: "CODE",
  difficulty: "easy",
  title: "curry() — partial application in any grouping",
  summary:
    "Turn a fixed-arity function into one that can be called with its arguments split across multiple calls.",
  description:
    "Lodash's curry, Ramda's curry — every functional JS library has one. The interesting part isn't calling fn(a)(b)(c), it's making fn(a,b)(c) and fn(a)(b,c) all work too, based on how many arguments fn actually declares.",
  task:
    "Write <code>curry(fn)</code>. The returned function must accept arguments across any number of calls, in any grouping, and only actually invoke <code>fn</code> once it has received at least <code>fn.length</code> arguments in total — at which point it calls <code>fn</code> with all of them and returns that result.",
  constraints: [
    "fn.length (its declared parameter count) determines how many total arguments are needed before invoking.",
    "Arguments can arrive one at a time, all at once, or in any mix of groupings — the end result must be identical to calling fn directly with all arguments in order.",
    "Once enough arguments have been supplied and fn is invoked, that's the final result — no further calls are expected on that particular chain.",
  ],
  example: `function add3(a, b, c) { return a + b + c; }
const curried = curry(add3);

curried(1)(2)(3);   // 6
curried(1, 2)(3);   // 6
curried(1)(2, 3);   // 6
curried(1, 2, 3);   // 6`,
  tags: ["closures", "functional-programming", "higher-order-functions"],
  estimatedMins: 20,
  xp: 30,
  starterFiles: [
    {
      name: "curry.js",
      lang: "js",
      code: `// curry.js
function curry(fn) {
  // your code here
}

module.exports = curry;`,
    },
  ],
  testFile: {
    name: "curry_test.js",
    lang: "test",
    code: `// curry_test.js
const curry = require('./curry');

test('curries_one_at_a_time', () => {
  const add = (a, b, c) => a + b + c;
  const curried = curry(add);
  expect(curried(1)(2)(3)).toBe(6);
});`,
  },
  hints: [
    {
      order: 1,
      cost: 0,
      text: "<code>fn.length</code> gives you the number of parameters a function declares (not counting default/rest params) — that's the target total argument count you're waiting for.",
    },
    {
      order: 2,
      cost: 5,
      text: "Write a recursive inner function that accumulates arguments seen so far. Each call checks: do I have enough yet? If yes, call fn. If no, return another function that continues accumulating.",
    },
    {
      order: 3,
      cost: 10,
      text: "The recursive step looks like: <code>function curried(...args) { const all = [...accumulated, ...args]; return all.length >= fn.length ? fn(...all) : (...more) => curried(...all, ...more); }</code> — adapt the accumulator threading to your own structure.",
    },
  ],
  hiddenTests: [
    {
      name: "one_argument_at_a_time",
      code: `const add3 = (a, b, c) => a + b + c;
const curried = curry(add3);
assert(curried(1)(2)(3) === 6, 'expected 1+2+3=6 called one argument at a time');`,
    },
    {
      name: "all_arguments_at_once",
      code: `const add3 = (a, b, c) => a + b + c;
const curried = curry(add3);
assert(curried(1, 2, 3) === 6, 'expected 6 when all arguments are supplied in a single call');`,
    },
    {
      name: "mixed_groupings",
      code: `const add4 = (a, b, c, d) => a + b + c + d;
const curried = curry(add4);
assert(curried(1, 2)(3)(4) === 10, 'expected 10 for (1,2)(3)(4)');
assert(curried(1)(2, 3, 4) === 10, 'expected 10 for (1)(2,3,4) on a fresh call');
assert(curried(1)(2)(3, 4) === 10, 'expected 10 for (1)(2)(3,4)');`,
    },
    {
      name: "works_with_a_two_argument_function",
      code: `const multiply = (a, b) => a * b;
const curried = curry(multiply);
assert(curried(3)(4) === 12, 'expected 3*4=12');
assert(curried(3, 4) === 12, 'expected 3*4=12 called directly too');`,
    },
    {
      name: "separate_partial_chains_do_not_interfere",
      code: `const add3 = (a, b, c) => a + b + c;
const curried = curry(add3);
const withOne = curried(1);
assert(withOne(2)(3) === 6, 'first chain: 1+2+3=6');
assert(withOne(10)(20) === 31, 'a fresh continuation from the same partial application must not carry over arguments from a previous completed chain');`,
    },
  ],
  solution: {
    code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...more) => curried(...args, ...more);
  };
}

module.exports = curry;`,
    explanation:
      "fn.length reports how many parameters the original function declared, which is the total argument count curried is waiting to collect. Each call to curried checks whether the arguments it has received so far (its own args, which already include everything threaded in from earlier partial calls) meet that threshold — if so, it invokes fn directly with all of them; if not, it returns a new function that, when called, recurses into curried again with the previous arguments plus whatever new ones just arrived. Because each partial application (like withOne = curried(1)) closes over its own args array at the point it was created, two different continuations from the same starting point never share or mutate each other's accumulated arguments — each recursive call spreads into a brand new array rather than mutating one in place.",
  },
};
