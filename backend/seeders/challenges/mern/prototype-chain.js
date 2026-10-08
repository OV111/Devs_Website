export default {
  slug: "prototype-chain",
  trackId: "mern",
  layerId: "mern-2",
  type: "CODE",
  difficulty: "med",
  title: "Walk the prototype chain",
  summary: "Re-implement instanceof, property-owner lookup and classical inheritance by hand using Object.getPrototypeOf and Object.create.",
  description:
    "Every JavaScript object points to a prototype, and property lookups walk that chain until they find the key or hit <code>null</code>. <code>class</code> syntax, <code>instanceof</code> and inheritance are all built on that single mechanism. Implement them from the primitives.",
  task:
    "Write <code>instanceOf(value, Ctor)</code>, <code>findOwner(obj, key)</code>, <code>chainOf(obj)</code> and <code>extend(Child, Parent)</code>. Don't use the <code>instanceof</code> operator, <code>isPrototypeOf</code> or <code>class</code>/<code>extends</code>.",
  constraints: [
    "<code>instanceOf</code> is true when <code>Ctor.prototype</code> appears anywhere in the prototype chain of <code>value</code>. Primitives and <code>null</code> are always <code>false</code>. If <code>Ctor</code> is not a function, or has no object <code>prototype</code> (arrow functions), throw a <code>TypeError</code>.",
    "<code>findOwner</code> returns the object in <code>obj</code>'s chain (starting with <code>obj</code> itself) that has <code>key</code> as an OWN property, or <code>null</code> if none does. A <code>null</code>/<code>undefined</code> obj gives <code>null</code>.",
    "<code>chainOf</code> returns the array of prototypes above <code>obj</code>, nearest first, ending with the last non-null prototype (so <code>[]</code> for <code>Object.create(null)</code>).",
    "<code>extend(Child, Parent)</code> wires classical inheritance and returns <code>Child</code>: <code>Child.prototype</code> inherits from <code>Parent.prototype</code>, has a NON-enumerable, writable, configurable <code>constructor</code> pointing at <code>Child</code>, and static properties are inherited (<code>Child</code> itself inherits from <code>Parent</code>). <code>Parent.prototype</code> must never be modified.",
  ],
  example: `function Animal() {}; function Dog() {}; extend(Dog, Animal); instanceOf(new Dog(), Animal) // true`,
  tags: ["prototype", "inheritance", "objects", "instanceof"],
  estimatedMins: 30,
  xp: 50,
  starterFiles: [
    {
      name: "protoTools.js",
      lang: "js",
      code: `// protoTools.js
function instanceOf(value, Ctor) {
  // your code here
}

function findOwner(obj, key) {
  // your code here
}

function chainOf(obj) {
  // your code here
}

function extend(Child, Parent) {
  // your code here
}

module.exports = { instanceOf, findOwner, chainOf, extend };`,
    },
  ],
  testFile: {
    name: "protoTools_test.js",
    lang: "test",
    code: `const { instanceOf, findOwner, chainOf, extend } = require('./protoTools');

test('arrays are arrays and objects', () => {
  expect(instanceOf([], Array)).toBe(true);
  expect(instanceOf([], Object)).toBe(true);
});

test('finds the owner of toString', () => {
  expect(findOwner({}, 'toString')).toBe(Object.prototype);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "All four are loops around <code>Object.getPrototypeOf(current)</code> until it returns <code>null</code>." },
    { order: 2, cost: 5, text: "Use <code>Object.prototype.hasOwnProperty.call(o, key)</code> (not <code>key in o</code>, which already walks the chain) at each level in <code>findOwner</code>. Primitives: check <code>typeof</code> before walking (strings have a prototype too, but <code>'x' instanceof String</code> is false)." },
    { order: 3, cost: 15, text: "<code>extend</code>: <code>Child.prototype = Object.create(Parent.prototype, { constructor: { value: Child, writable: true, configurable: true } })</code> (enumerable defaults to false), then <code>Object.setPrototypeOf(Child, Parent)</code> for statics." },
  ],
  hiddenTests: [
    { name: "instanceof_basics", code: `function A() {} function B() {}
extend(B, A);
const b = new B();
assert(instanceOf(b, B) === true && instanceOf(b, A) === true && instanceOf(b, Object) === true, 'whole chain');
assert(instanceOf(new A(), B) === false, 'parent is not a child');
assert(instanceOf([], Array) === true && instanceOf([], Object) === true, 'arrays');
assert(instanceOf(() => {}, Function) === true, 'functions');` },
    { name: "instanceof_primitives_and_null_prototype", code: `assert(instanceOf('str', String) === false, 'primitive string');
assert(instanceOf(5, Number) === false, 'primitive number');
assert(instanceOf(null, Object) === false && instanceOf(undefined, Object) === false, 'nullish');
assert(instanceOf(Object.create(null), Object) === false, 'no prototype at all');
assert(instanceOf(new String('s'), String) === true, 'boxed string is an object');` },
    { name: "instanceof_throws_for_bad_constructors", code: `let e1 = null, e2 = null;
try { instanceOf({}, {}); } catch (e) { e1 = e; }
try { instanceOf({}, () => {}); } catch (e) { e2 = e; }
assert(e1 instanceof TypeError, 'plain object is not callable');
assert(e2 instanceof TypeError, 'arrow functions have no prototype');` },
    { name: "instanceof_follows_reassigned_prototype", code: `function F() {}
const obj = new F();
F.prototype = {};
assert(instanceOf(obj, F) === false, 'the old object is no longer in the chain of F.prototype');
assert(instanceOf(new F(), F) === true, 'a new instance is');` },
    { name: "find_owner", code: `const grand = { a: 1 }; const parent = Object.create(grand); parent.b = 2; const child = Object.create(parent); child.c = 3;
assert(findOwner(child, 'c') === child, 'own property');
assert(findOwner(child, 'b') === parent, 'one level up');
assert(findOwner(child, 'a') === grand, 'two levels up');
assert(findOwner(child, 'zzz') === null, 'missing');
assert(findOwner({}, 'toString') === Object.prototype, 'built-in methods live on Object.prototype');` },
    { name: "find_owner_edge_cases", code: `assert(findOwner(null, 'a') === null && findOwner(undefined, 'a') === null, 'nullish');
const shadow = Object.create({ x: 1 }); shadow.x = 2;
assert(findOwner(shadow, 'x') === shadow, 'shadowing: nearest owner wins');
assert(findOwner(Object.create(null), 'x') === null, 'no chain');` },
    { name: "chain_of", code: `function A() {} function B() {}
extend(B, A);
const chain = chainOf(new B());
assert(chain.length === 3, 'B.prototype, A.prototype, Object.prototype; got ' + chain.length);
assert(chain[0] === B.prototype && chain[1] === A.prototype && chain[2] === Object.prototype, 'nearest first');
assert(chainOf(Object.create(null)).length === 0, 'empty for null-prototype objects');
assert(chainOf([])[0] === Array.prototype, 'arrays');` },
    { name: "extend_wires_prototype_and_constructor", code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + ' makes a sound'; };
function Dog(name) { Animal.call(this, name); }
const ret = extend(Dog, Animal);
assert(ret === Dog, 'returns Child');
Dog.prototype.speak = function () { return Animal.prototype.speak.call(this) + ' (woof)'; };
const d = new Dog('Rex');
assert(d.speak() === 'Rex makes a sound (woof)', 'override calling parent: ' + d.speak());
assert(new Animal('Cat').speak() === 'Cat makes a sound', 'Parent.prototype untouched by Child overrides');
assert(Dog.prototype.constructor === Dog && d.constructor === Dog, 'constructor points at Child');` },
    { name: "extend_constructor_is_not_enumerable", code: `function P() {} function C() {}
extend(C, P);
assert(Object.keys(C.prototype).indexOf('constructor') === -1, 'constructor must not be enumerable');
const desc = Object.getOwnPropertyDescriptor(C.prototype, 'constructor');
assert(desc.writable === true && desc.configurable === true && desc.enumerable === false, 'descriptor ' + JSON.stringify(desc));
const keys = []; for (const k in new C()) keys.push(k);
assert(keys.length === 0, 'for-in over an instance lists nothing');` },
    { name: "extend_inherits_statics", code: `function P() {}
P.create = function () { return 'made'; };
function C() {}
extend(C, P);
assert(C.create() === 'made', 'static inherited');
P.later = 1;
assert(C.later === 1, 'live link to the parent, not a copy');
assert(Object.getPrototypeOf(C) === P, 'Child inherits from Parent');` },
  ],
  solution: {
    code: `function instanceOf(value, Ctor) {
  if (typeof Ctor !== 'function') throw new TypeError('Right-hand side is not callable');
  const target = Ctor.prototype;
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    throw new TypeError('Function has non-object prototype');
  }
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === target) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

function findOwner(obj, key) {
  let current = obj;
  while (current !== null && current !== undefined) {
    if (Object.prototype.hasOwnProperty.call(current, key)) return current;
    current = Object.getPrototypeOf(current);
  }
  return null;
}

function chainOf(obj) {
  const chain = [];
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}

function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype, {
    constructor: { value: Child, writable: true, configurable: true },
  });
  Object.setPrototypeOf(Child, Parent);
  return Child;
}

module.exports = { instanceOf, findOwner, chainOf, extend };`,
    explanation:
      "Everything is the same loop: take the prototype, compare, take its prototype, stop at null. hasOwnProperty is used in findOwner because 'key in obj' already walks the chain and would hide which level really owns the key. Object.create's second argument defaults enumerable to false, which is exactly what keeps 'constructor' out of for-in loops.",
  },
};
