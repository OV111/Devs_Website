export default {
  slug: "closure-counter",
  trackId: "node-dev",
  layerId: "node-dev-1",
  type: "CODE",
  difficulty: "easy",
  title: "Private state with closures",
  summary: "Build a counter whose value can only be changed through its methods.",
  description:
    "A closure is a function that remembers the variables around it. It is the original way to get private state in JavaScript, and it's behind module patterns, factories and React hooks.",
  task:
    "Write <code>createCounter({ start = 0, step = 1 })</code> returning an object with <code>increment()</code>, <code>decrement()</code>, <code>reset()</code> and <code>value()</code>.",
  constraints: [
    "<code>increment</code> and <code>decrement</code> change the count by <code>step</code> and return the NEW value.",
    "<code>reset()</code> sets the count back to <code>start</code> and returns it.",
    "The count must be private: the returned object has exactly those four properties, and no data property such as <code>count</code>.",
    "Each call to <code>createCounter</code> has its own independent state.",
  ],
  example: `const c = createCounter({ start: 10, step: 5 }); c.increment(); // 15`,
  tags: ["closures","scope","javascript"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "createCounter.js",
      lang: "js",
      code: `// createCounter.js
function createCounter(options = {}) {
  // your code here
}

module.exports = createCounter;`,
    },
  ],
  testFile: {
    name: "createCounter_test.js",
    lang: "test",
    code: `const createCounter = require('./createCounter');

test('increments', () => {
  const c = createCounter(); c.increment(); expect(c.value()).toBe(1);
});

test('independent', () => {
  const a = createCounter(); const b = createCounter(); a.increment(); expect(b.value()).toBe(0);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Declare <code>let count = start</code> inside the function, outside the returned object." },
    { order: 2, cost: 5, text: "The methods are closures over <code>count</code>: they can read and write it, nobody else can." },
    { order: 3, cost: 15, text: "Return the new value from <code>increment</code>, <code>decrement</code> and <code>reset</code>." },
  ],
  hiddenTests: [
    { name: "defaults", code: `const c = createCounter();
assert(c.value() === 0, 'starts at 0');
assert(c.increment() === 1 && c.increment() === 2, 'step 1');` },
    { name: "start_and_step", code: `const c = createCounter({ start: 10, step: 5 });
assert(c.value() === 10, 'start');
assert(c.increment() === 15, 'up by step');
assert(c.decrement() === 10 && c.decrement() === 5, 'down by step');` },
    { name: "decrement_can_go_negative", code: `const c = createCounter();
assert(c.decrement() === -1, 'no floor');` },
    { name: "reset_returns_to_start", code: `const c = createCounter({ start: 3 });
c.increment(); c.increment();
assert(c.reset() === 3, 'reset returns start');
assert(c.value() === 3, 'and sets it');` },
    { name: "state_is_private", code: `const c = createCounter({ start: 7 });
assert(Object.keys(c).sort().join(',') === 'decrement,increment,reset,value', 'exactly four methods: ' + Object.keys(c));
c.count = 999; c.start = 999;
assert(c.value() === 7, 'writing properties cannot change the real count');` },
    { name: "instances_are_independent", code: `const a = createCounter(); const b = createCounter({ start: 100 });
a.increment(); a.increment();
assert(a.value() === 2 && b.value() === 100, 'separate closures');` },
    { name: "methods_work_detached", code: `const { increment, value } = createCounter();
increment(); increment();
assert(value() === 2, 'methods do not rely on this');` },
  ],
  solution: {
    code: `function createCounter({ start = 0, step = 1 } = {}) {
  let count = start;
  return {
    increment() {
      count += step;
      return count;
    },
    decrement() {
      count -= step;
      return count;
    },
    reset() {
      count = start;
      return count;
    },
    value() {
      return count;
    },
  };
}

module.exports = createCounter;`,
    explanation:
      "count lives in the scope of createCounter. The returned methods keep that scope alive, so they can use it while nothing outside can reach it. Methods that avoid 'this' also keep working when destructured.",
  },
};
