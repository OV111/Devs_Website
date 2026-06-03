
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/roadmaps/languages.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const sides = {
"javascript-1":{
"sideLeft":[
{"title":"JS Engine Internals","children":[
{"title":"V8 JIT compilation","description":"V8 compiles hot functions to machine code at runtime — understanding this explains why the same code can be fast or slow depending on how predictable its types are.","resources":[{"label":"V8 Docs","url":"https://v8.dev/docs","type":"docs"},{"label":"JavaScript Engines — How Do They Even Work?","url":"https://www.valentinog.com/blog/engines/","type":"article"}]},
{"title":"Parsing and AST","description":"The engine parses your source into an Abstract Syntax Tree before execution — tools like ESLint and Babel operate directly on this tree.","resources":[{"label":"AST Explorer","url":"https://astexplorer.net","type":"article"},{"label":"Esprima — JS Parser","url":"https://esprima.org/demo/parse.html","type":"docs"}]}
]},
{"title":"Type Coercion","children":[
{"title":"== vs === and coercion rules","description":"Loose equality triggers implicit type conversion — knowing the rules prevents classic gotchas like `0 == false` being true.","resources":[{"label":"MDN — Equality comparisons","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness","type":"docs"},{"label":"JavaScript Equality Table","url":"https://dorey.github.io/JavaScript-Equality-Table/","type":"article"}]},
{"title":"Truthy and falsy values","description":"Only six values are falsy in JS — every other value coerces to true, which drives most conditional shorthand patterns.","resources":[{"label":"MDN — Falsy","url":"https://developer.mozilla.org/en-US/docs/Glossary/Falsy","type":"docs"},{"label":"JS Type Coercion Explained","url":"https://www.freecodecamp.org/news/js-type-coercion-explained-27ba3d9a2852/","type":"article"}]}
]}
],
"sideRight":[
{"title":"Dev Environment","children":[
{"title":"Node.js + nvm setup","description":"nvm lets you switch Node versions per project — essential when working across codebases that require different Node versions.","resources":[{"label":"nvm GitHub","url":"https://github.com/nvm-sh/nvm","type":"docs"},{"label":"Node.js Download","url":"https://nodejs.org/en/download","type":"docs"}]},
{"title":"ESLint + Prettier","description":"ESLint catches bugs and enforces patterns; Prettier handles formatting — using both together eliminates style debates and a class of runtime errors.","resources":[{"label":"ESLint Getting Started","url":"https://eslint.org/docs/latest/use/getting-started","type":"docs"},{"label":"Prettier Docs","url":"https://prettier.io/docs/en/install.html","type":"docs"}]}
]},
{"title":"Browser Tools","children":[
{"title":"Chrome DevTools Console","description":"The console is a live JS REPL attached to any page — use it to experiment with APIs and prototype solutions in real time.","resources":[{"label":"Chrome DevTools Console","url":"https://developer.chrome.com/docs/devtools/console/","type":"docs"},{"label":"DevTools Tips","url":"https://devtoolstips.org","type":"article"}]},
{"title":"Live Server extension","description":"Live Server auto-reloads the browser on file save, giving you instant feedback during static JS development without a build step.","resources":[{"label":"Live Server — VS Code","url":"https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer","type":"docs"},{"label":"VS Code for JavaScript","url":"https://code.visualstudio.com/docs/languages/javascript","type":"docs"}]}
]}
]
},
"javascript-2":{
"sideLeft":[
{"title":"Execution Context","children":[
{"title":"Call stack and hoisting","description":"Every function call creates a new execution context pushed onto the call stack — hoisting moves declarations to the top of their context before code runs.","resources":[{"label":"MDN — Hoisting","url":"https://developer.mozilla.org/en-US/docs/Glossary/Hoisting","type":"docs"},{"label":"JavaScript Visualized — Execution Context","url":"https://dev.to/lydiahallie/javascript-visualized-the-javascript-engine-4cdf","type":"article"}]},
{"title":"Lexical environment","description":"Each scope has a lexical environment that stores variable bindings — closures work by retaining a reference to the environment where they were defined.","resources":[{"label":"YDKJS — Scope and Closures","url":"https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures","type":"book"},{"label":"MDN — Closures","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures","type":"docs"}]}
]},
{"title":"Closure Mechanics","children":[
{"title":"Variable capture","description":"A closure captures a reference to the variable, not its value — this is why the classic loop-with-setTimeout bug occurs.","resources":[{"label":"MDN — Closures in depth","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#closure_scope_chain","type":"docs"},{"label":"Understanding JavaScript Closures","url":"https://www.digitalocean.com/community/tutorials/understanding-closures-in-javascript","type":"article"}]},
{"title":"Memory and closures","description":"Closures keep their enclosing scope alive in memory — accidentally capturing large objects in long-lived closures is a common memory leak pattern.","resources":[{"label":"Memory Management in JS","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management","type":"docs"},{"label":"JavaScript Memory Leaks","url":"https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/","type":"article"}]}
]}
],
"sideRight":[
{"title":"Practical Patterns","children":[
{"title":"IIFE pattern","description":"Immediately Invoked Function Expressions create a private scope on the spot — useful for encapsulating initialization logic without polluting the global namespace.","resources":[{"label":"MDN — IIFE","url":"https://developer.mozilla.org/en-US/docs/Glossary/IIFE","type":"docs"},{"label":"Essential JS Design Patterns","url":"https://www.patterns.dev/vanilla/classic-design-patterns/","type":"book"}]},
{"title":"Partial application","description":"Partial application fixes some arguments of a function and returns a new one — useful for creating specialized helpers from generic functions.","resources":[{"label":"Currying and Partials","url":"https://javascript.info/currying-partials","type":"article"},{"label":"Functional-Light JavaScript","url":"https://github.com/getify/Functional-Light-JS","type":"book"}]}
]},
{"title":"Debugging Scope","children":[
{"title":"DevTools Scope panel","description":"The Scope panel in Chrome DevTools shows every variable in every scope at a breakpoint — essential for understanding exactly what a closure has captured.","resources":[{"label":"Chrome DevTools — Debug JS","url":"https://developer.chrome.com/docs/devtools/javascript/","type":"docs"},{"label":"VS Code JS Debugging","url":"https://code.visualstudio.com/docs/nodejs/nodejs-debugging","type":"docs"}]},
{"title":"console.trace and groups","description":"console.trace prints the full call stack at any point; console.group nests related log output — both reduce print-debugging noise.","resources":[{"label":"MDN — console API","url":"https://developer.mozilla.org/en-US/docs/Web/API/console","type":"docs"},{"label":"Chrome DevTools Console Reference","url":"https://developer.chrome.com/docs/devtools/console/api/","type":"docs"}]}
]}
]
},
"javascript-3":{
"sideLeft":[
{"title":"Prototype Chain","children":[
{"title":"[[Prototype]] linkage","description":"Every JS object has an internal [[Prototype]] link to another object — property lookups walk this chain until they hit null, enabling inheritance without classes.","resources":[{"label":"MDN — Object prototypes","url":"https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes","type":"docs"},{"label":"YDKJS — this & Object Prototypes","url":"https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes","type":"book"}]},
{"title":"Object.create and delegation","description":"Object.create(proto) creates an object whose [[Prototype]] is proto — the purest form of prototypal delegation without constructor functions.","resources":[{"label":"MDN — Object.create","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create","type":"docs"},{"label":"Prototypal OO in JS","url":"https://medium.com/javascript-scene/the-two-pillars-of-javascript-ee6f3281e7f3","type":"article"}]}
]},
{"title":"Property Descriptors","children":[
{"title":"enumerable, writable, configurable","description":"Property descriptors control whether a property shows in for...in loops, can be reassigned, or deleted — Object.freeze uses these internally.","resources":[{"label":"MDN — Object.defineProperty","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty","type":"docs"},{"label":"JavaScript Property Descriptors","url":"https://www.digitalocean.com/community/tutorials/understanding-property-descriptors-in-javascript","type":"article"}]},
{"title":"Getters and setters","description":"Accessor properties run functions when read or written — useful for computed properties and validation logic without changing the call site API.","resources":[{"label":"MDN — getter/setter","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get","type":"docs"},{"label":"Property Accessors","url":"https://javascript.info/property-accessors","type":"article"}]}
]}
],
"sideRight":[
{"title":"OOP Patterns","children":[
{"title":"Factory functions vs classes","description":"Factory functions return objects without new, avoiding this binding issues — classes offer familiar syntax but introduce complexity around inheritance.","resources":[{"label":"Factory vs Constructor","url":"https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e","type":"article"},{"label":"MDN — Classes","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes","type":"docs"}]},
{"title":"Mixin pattern","description":"Mixins copy methods from multiple source objects onto a target — a pragmatic way to compose behaviours without deep class hierarchies.","resources":[{"label":"Real mixins with JS classes","url":"https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/","type":"article"},{"label":"MDN — Mixins","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins","type":"docs"}]}
]},
{"title":"this Binding","children":[
{"title":"Four binding rules","description":"this is determined at call time by four rules in priority: new, explicit (call/apply/bind), implicit (method call), and default — arrow functions skip all four and inherit lexically.","resources":[{"label":"MDN — this","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this","type":"docs"},{"label":"YDKJS — this All Makes Sense Now","url":"https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch2.md","type":"book"}]},
{"title":"Arrow functions and this","description":"Arrow functions capture this from their enclosing lexical scope at definition time — ideal for callbacks but wrong for object methods.","resources":[{"label":"MDN — Arrow functions","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions","type":"docs"},{"label":"Arrow vs regular function","url":"https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/","type":"article"}]}
]}
]
},
"javascript-4":{
"sideLeft":[
{"title":"Event Loop","children":[
{"title":"Call stack and task queue","description":"The event loop moves callbacks from the task queue to the call stack only when the stack is empty — this single-threaded model is why long synchronous code blocks the UI.","resources":[{"label":"What the heck is the event loop? — Philip Roberts","url":"https://www.youtube.com/watch?v=8aGhZQkoFbQ","type":"video"},{"label":"MDN — Event loop","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop","type":"docs"}]},
{"title":"Microtask queue","description":"Promises resolve through the microtask queue, which drains completely before the next task runs — giving Promise callbacks higher priority than setTimeout.","resources":[{"label":"JavaScript Visualized — Event Loop","url":"https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif","type":"article"},{"label":"MDN — Microtask guide","url":"https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide","type":"docs"}]}
]},
{"title":"Promise Internals","children":[
{"title":"Promise states","description":"A Promise is pending, fulfilled, or rejected — once settled it never changes, and handlers registered after settlement still fire asynchronously.","resources":[{"label":"MDN — Using Promises","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises","type":"docs"},{"label":"Understanding JS Promises","url":"https://www.digitalocean.com/community/tutorials/understanding-javascript-promises","type":"article"}]},
{"title":"Promise chaining vs nesting","description":"Returning a value from .then() wraps it in a resolved Promise and passes it forward — flat chaining avoids callback-pyramid nesting.","resources":[{"label":"JavaScript.info — Promises chaining","url":"https://javascript.info/promise-chaining","type":"article"},{"label":"MDN — Promise.prototype.then","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Async/Await Patterns","children":[
{"title":"async/await over raw promises","description":"async/await makes asynchronous code read like synchronous code and gives you try/catch for error handling — the underlying mechanics are identical to promise chains.","resources":[{"label":"MDN — async/await","url":"https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises","type":"docs"},{"label":"Async JS explained","url":"https://www.freecodecamp.org/news/asynchronous-javascript-explained/","type":"article"}]},
{"title":"Promise.all and Promise.race","description":"Promise.all runs multiple async operations in parallel and waits for all — Promise.race resolves as soon as any one settles, useful for timeouts.","resources":[{"label":"MDN — Promise.all","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all","type":"docs"},{"label":"JavaScript.info — Promise API","url":"https://javascript.info/promise-api","type":"article"}]}
]},
{"title":"Error Handling Async","children":[
{"title":"try/catch with async/await","description":"Wrapping await calls in try/catch catches both synchronous throws and rejected promises — unhandled rejections crash Node processes.","resources":[{"label":"MDN — try...catch","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch","type":"docs"},{"label":"Async Error Handling Patterns","url":"https://www.valentinog.com/blog/error/","type":"article"}]},
{"title":"AbortController for cancellation","description":"AbortController cancels in-flight fetch requests or any operation accepting an AbortSignal — essential for avoiding state updates after component unmount.","resources":[{"label":"MDN — AbortController","url":"https://developer.mozilla.org/en-US/docs/Web/API/AbortController","type":"docs"},{"label":"How to Cancel Fetch Requests","url":"https://javascript.info/fetch-abort","type":"article"}]}
]}
]
},
"javascript-5":{
"sideLeft":[
{"title":"DOM Tree","children":[
{"title":"Node types and traversal","description":"The DOM is a tree of Node objects — knowing traversal properties (parentNode, children vs childNodes) avoids bugs when walking the tree.","resources":[{"label":"MDN — DOM Introduction","url":"https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction","type":"docs"},{"label":"JavaScript.info — DOM tree","url":"https://javascript.info/dom-nodes","type":"article"}]},
{"title":"Reflow and repaint","description":"Reading layout properties after writing to the DOM forces a synchronous reflow — batching reads and writes avoids costly layout thrashing.","resources":[{"label":"Inside the browser — Google","url":"https://developer.chrome.com/blog/inside-browser-part3/","type":"article"},{"label":"FastDOM","url":"https://github.com/wilsonpage/fastdom","type":"docs"}]}
]},
{"title":"Event System","children":[
{"title":"Bubbling and capturing","description":"Events travel down from the root (capture phase) then bubble back up — stopPropagation halts travel while capture listeners fire before bubble listeners.","resources":[{"label":"MDN — Event bubbling","url":"https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling","type":"docs"},{"label":"JavaScript.info — Bubbling and capturing","url":"https://javascript.info/bubbling-and-capturing","type":"article"}]},
{"title":"Event delegation","description":"Attach one listener to a parent instead of many to children — this works because events bubble up and is more performant for dynamic lists.","resources":[{"label":"JavaScript.info — Event delegation","url":"https://javascript.info/event-delegation","type":"article"},{"label":"MDN — Event delegation guide","url":"https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling#event_delegation","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Modern DOM APIs","children":[
{"title":"querySelector and modern selectors","description":"querySelector/querySelectorAll accept any CSS selector — they replace most getElementById/getElementsByClassName usage.","resources":[{"label":"MDN — querySelector","url":"https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector","type":"docs"},{"label":"DOM Manipulation Guide","url":"https://www.digitalocean.com/community/tutorials/how-to-modify-the-dom","type":"article"}]},
{"title":"IntersectionObserver","description":"IntersectionObserver fires callbacks when an element enters or leaves the viewport — the right tool for lazy loading images and infinite scroll.","resources":[{"label":"MDN — IntersectionObserver","url":"https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API","type":"docs"},{"label":"Intersection Observer Tutorial","url":"https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/","type":"article"}]}
]},
{"title":"Performance","children":[
{"title":"DocumentFragment for batch inserts","description":"Building a DocumentFragment off-screen and inserting it once causes a single reflow instead of one per element — critical for large lists.","resources":[{"label":"MDN — DocumentFragment","url":"https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment","type":"docs"},{"label":"DOM Performance Tips","url":"https://developers.google.com/speed/articles/javascript-dom","type":"article"}]},
{"title":"requestAnimationFrame","description":"rAF schedules a callback before the next browser paint — the correct way to drive animations synced to the display refresh rate.","resources":[{"label":"MDN — requestAnimationFrame","url":"https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame","type":"docs"},{"label":"Animation Performance","url":"https://web.dev/articles/animations-guide","type":"article"}]}
]}
]
},
"javascript-6":{
"sideLeft":[
{"title":"TC39 Process","children":[
{"title":"Proposal stages 0–4","description":"TC39 advances features through 5 stages before they land in the spec — understanding stages helps you evaluate whether syntax is stable enough to use without a transpiler.","resources":[{"label":"TC39 Proposals","url":"https://github.com/tc39/proposals","type":"docs"},{"label":"The TC39 Process","url":"https://tc39.es/process-document/","type":"docs"}]},
{"title":"Reading the ECMAScript spec","description":"Reading the spec for a feature reveals edge cases and design decisions that MDN summaries often omit.","resources":[{"label":"ECMAScript Specification","url":"https://tc39.es/ecma262/","type":"docs"},{"label":"How to Read the ECMAScript Spec","url":"https://timothygu.me/es-howto/","type":"article"}]}
]},
{"title":"Runtime Semantics","children":[
{"title":"Optional chaining internals","description":"Optional chaining (?.) short-circuits and returns undefined on null/undefined — it evaluates the left side once, avoiding double evaluation.","resources":[{"label":"MDN — Optional chaining","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining","type":"docs"},{"label":"V8 — Optional Chaining","url":"https://v8.dev/features/optional-chaining","type":"article"}]},
{"title":"Nullish coalescing vs ||","description":"?? only falls through on null/undefined while || falls through on any falsy value — this prevents 0 or '' from accidentally triggering defaults.","resources":[{"label":"MDN — Nullish coalescing","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing","type":"docs"},{"label":"V8 — Nullish Coalescing","url":"https://v8.dev/features/nullish-coalescing","type":"article"}]}
]}
],
"sideRight":[
{"title":"ES2022+ Features in Practice","children":[
{"title":"Array.at(), Object.hasOwn(), structuredClone()","description":"These modern APIs replace older verbose patterns — at() for negative indexing, hasOwn() over hasOwnProperty, structuredClone() for deep copying.","resources":[{"label":"MDN — Array.prototype.at()","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at","type":"docs"},{"label":"New in ECMAScript 2022","url":"https://pawelgrzybek.com/whats-new-in-ecmascript-2022/","type":"article"}]},
{"title":"Top-level await","description":"Top-level await lets ES modules await at module level without wrapping in an async function — useful for dynamic imports and initialization logic.","resources":[{"label":"V8 — Top-level await","url":"https://v8.dev/features/top-level-await","type":"article"},{"label":"MDN — Top-level await","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#top_level_await","type":"docs"}]}
]},
{"title":"Transpilation","children":[
{"title":"Babel config","description":"Babel transforms modern JS to a target environment's supported syntax — configuring @babel/preset-env with a browserslist target is the standard approach.","resources":[{"label":"Babel Docs","url":"https://babeljs.io/docs/","type":"docs"},{"label":"Babel Config Guide","url":"https://babeljs.io/docs/configuration","type":"docs"}]},
{"title":"core-js polyfills","description":"core-js provides runtime polyfills for built-ins that transpilation can't handle — used alongside Babel to patch missing APIs in older environments.","resources":[{"label":"core-js GitHub","url":"https://github.com/zloirock/core-js","type":"docs"},{"label":"Browserslist","url":"https://browsersl.ist","type":"docs"}]}
]}
]
},
"javascript-7":{
"sideLeft":[
{"title":"Module Systems","children":[
{"title":"CommonJS vs ESM","description":"CommonJS (require/module.exports) is synchronous and built for Node; ESM (import/export) is the standard, supports tree shaking, and is now native in Node 12+.","resources":[{"label":"MDN — JavaScript modules","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules","type":"docs"},{"label":"CommonJS vs ESM comparison","url":"https://reflectoring.io/nodejs-modules-imports/","type":"article"}]},
{"title":"Circular dependencies","description":"ESM handles circular imports with partially-evaluated bindings; CommonJS returns the incomplete cached export — circular deps are a design smell worth eliminating.","resources":[{"label":"Node.js — Cycles","url":"https://nodejs.org/api/modules.html#cycles","type":"docs"},{"label":"Circular Dependencies in JS","url":"https://medium.com/swlh/mastering-javascript-module-circular-dependency-2020-1a4d1da7b5cf","type":"article"}]}
]},
{"title":"Bundler Internals","children":[
{"title":"Tree shaking","description":"Tree shaking removes unused exports at bundle time by statically analysing ES module imports — it only works with ESM, not CommonJS.","resources":[{"label":"Tree Shaking — Webpack","url":"https://webpack.js.org/guides/tree-shaking/","type":"docs"},{"label":"Tree Shaking Guide","url":"https://www.smashingmagazine.com/2021/05/tree-shaking-reference-guide/","type":"article"}]},
{"title":"Code splitting","description":"Code splitting breaks a bundle into chunks loaded on demand — dynamic import() is the trigger and bundlers handle the chunk graph automatically.","resources":[{"label":"Webpack — Code Splitting","url":"https://webpack.js.org/guides/code-splitting/","type":"docs"},{"label":"Vite — Code Splitting","url":"https://vitejs.dev/guide/features.html#dynamic-import","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Tooling","children":[
{"title":"Vite","description":"Vite uses native ESM in dev for instant HMR and Rollup for production builds — the fastest dev server available and the recommended choice for new projects.","resources":[{"label":"Vite Docs","url":"https://vitejs.dev/guide/","type":"docs"},{"label":"Why Vite","url":"https://vitejs.dev/guide/why.html","type":"docs"}]},
{"title":"npm scripts workflow","description":"package.json scripts are the standard way to define dev, build, test, and lint commands — no task runner needed for most projects.","resources":[{"label":"npm scripts docs","url":"https://docs.npmjs.com/cli/v10/using-npm/scripts","type":"docs"},{"label":"npm scripts guide","url":"https://www.freecodecamp.org/news/introduction-to-npm-scripts-1dbb2ae01633/","type":"article"}]}
]},
{"title":"npm Ecosystem","children":[
{"title":"Semantic versioning","description":"npm uses semver — ^ allows minor+patch updates, ~ allows patch only — understanding this prevents surprise breaking changes after npm install.","resources":[{"label":"Semantic Versioning","url":"https://semver.org","type":"docs"},{"label":"npm semver calculator","url":"https://semver.npmjs.com","type":"docs"}]},
{"title":"package-lock.json","description":"The lockfile pins exact dependency versions including transitive deps — committing it ensures every developer and CI environment installs identical packages.","resources":[{"label":"npm — package-lock.json","url":"https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json","type":"docs"},{"label":"Why you should commit lockfiles","url":"https://snyk.io/blog/why-you-should-commit-your-lockfiles/","type":"article"}]}
]}
]
},
"javascript-8":{
"sideLeft":[
{"title":"Error Types","children":[
{"title":"Error hierarchy","description":"JS has built-in error subclasses (TypeError, RangeError, SyntaxError) — throwing the appropriate subclass gives callers more information to handle errors correctly.","resources":[{"label":"MDN — Error types","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error","type":"docs"},{"label":"Custom Error Classes in JS","url":"https://javascript.info/custom-errors","type":"article"}]},
{"title":"Stack traces and source maps","description":"Source maps map minified production code back to original source — without them, error.stack points to unreadable minified code in production.","resources":[{"label":"Introduction to Source Maps","url":"https://web.dev/articles/source-maps","type":"article"},{"label":"MDN — Source maps","url":"https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map","type":"docs"}]}
]},
{"title":"Testing Theory","children":[
{"title":"Unit vs integration vs E2E","description":"Unit tests verify a single function in isolation; integration tests verify modules working together; E2E tests verify full user flows — a healthy project has all three.","resources":[{"label":"Testing Trophy — Kent C. Dodds","url":"https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications","type":"article"},{"label":"JavaScript Testing — freeCodeCamp","url":"https://www.freecodecamp.org/news/a-quick-introduction-to-test-driven-development-with-jest-cdc15d55e6b7/","type":"article"}]},
{"title":"Test doubles","description":"Stubs return preset values, mocks verify calls were made, spies observe real behaviour without replacing it — knowing the distinction prevents misuse.","resources":[{"label":"Test Doubles — Martin Fowler","url":"https://martinfowler.com/bliki/TestDouble.html","type":"article"},{"label":"Jest mocking guide","url":"https://jestjs.io/docs/mock-functions","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Testing Tools","children":[
{"title":"Vitest","description":"Vitest is Vite-native, uses the same config, and is dramatically faster than Jest for Vite projects — it also has a compatible Jest API so migration is simple.","resources":[{"label":"Vitest Docs","url":"https://vitest.dev/guide/","type":"docs"},{"label":"Vitest vs Jest","url":"https://vitest.dev/guide/comparisons.html","type":"docs"}]},
{"title":"Jest","description":"Jest is the most widely used JS testing framework — it includes a test runner, assertion library, mocking, and coverage out of the box.","resources":[{"label":"Jest Docs","url":"https://jestjs.io/docs/getting-started","type":"docs"},{"label":"Jest Cheat Sheet","url":"https://github.com/sapegin/jest-cheat-sheet","type":"article"}]}
]},
{"title":"Debugging","children":[
{"title":"Chrome DevTools breakpoints","description":"Conditional breakpoints, logpoints, and DOM mutation breakpoints let you pause execution precisely without adding console.log to your code.","resources":[{"label":"Chrome DevTools — Breakpoints","url":"https://developer.chrome.com/docs/devtools/javascript/breakpoints/","type":"docs"},{"label":"DevTools JavaScript Debugging","url":"https://developer.chrome.com/docs/devtools/javascript/","type":"docs"}]},
{"title":"VS Code debugger","description":"VS Code's built-in debugger attaches to Node.js processes or browsers — a launch.json config gives you full IDE debugging without leaving the editor.","resources":[{"label":"VS Code — Node.js debugging","url":"https://code.visualstudio.com/docs/nodejs/nodejs-debugging","type":"docs"},{"label":"VS Code Debugger Tutorial","url":"https://code.visualstudio.com/docs/editor/debugging","type":"docs"}]}
]}
]
},
"javascript-9":{
"sideLeft":[
{"title":"FP Theory","children":[
{"title":"Pure functions","description":"A pure function always returns the same output for the same input and has no side effects — trivially testable and safe to memoize or parallelize.","resources":[{"label":"Functional-Light JavaScript","url":"https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch5.md","type":"book"},{"label":"MDN — Pure function","url":"https://developer.mozilla.org/en-US/docs/Glossary/Pure_function","type":"docs"}]},
{"title":"Immutability patterns","description":"Never mutating data and always producing new objects makes state changes explicit and predictable — Immer makes immutable updates ergonomic.","resources":[{"label":"Immer — Immutable state made easy","url":"https://immerjs.github.io/immer/","type":"docs"},{"label":"Immutability in JS","url":"https://www.freecodecamp.org/news/immutability-in-javascript-with-examples/","type":"article"}]}
]},
{"title":"Function Composition","children":[
{"title":"compose and pipe","description":"Compose chains functions right-to-left; pipe left-to-right — both build complex transformations from small reusable functions without intermediate variables.","resources":[{"label":"Functional-Light JS — Composition","url":"https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch4.md","type":"book"},{"label":"Function composition in JS","url":"https://www.educative.io/blog/function-composition-javascript","type":"article"}]},
{"title":"Currying","description":"Currying transforms a function of N arguments into N unary functions — enables partial application and makes function composition more flexible.","resources":[{"label":"JavaScript.info — Currying","url":"https://javascript.info/currying-partials","type":"article"},{"label":"Ramda — Functional JS library","url":"https://ramdajs.com/docs/","type":"docs"}]}
]}
],
"sideRight":[
{"title":"FP with Array Methods","children":[
{"title":"map, filter, reduce","description":"map/filter/reduce are the FP foundation built into every JS array — chaining them replaces most imperative loops with readable transformation pipelines.","resources":[{"label":"MDN — Array.prototype.reduce()","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce","type":"docs"},{"label":"JavaScript Array Methods","url":"https://www.freecodecamp.org/news/javascript-array-methods-explained/","type":"article"}]},
{"title":"Transducers for performance","description":"Chained map/filter creates intermediate arrays — transducers compose transformations into a single pass, which matters for large data sets.","resources":[{"label":"Transducers Explained","url":"https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d","type":"article"},{"label":"Ramda — transduce","url":"https://ramdajs.com/docs/#transduce","type":"docs"}]}
]},
{"title":"FP Libraries","children":[
{"title":"Ramda","description":"Ramda is a practical FP library for JS — all functions are auto-curried and data-last, ideal for point-free composition pipelines.","resources":[{"label":"Ramda Docs","url":"https://ramdajs.com/docs/","type":"docs"},{"label":"Thinking in Ramda","url":"https://randycoulman.com/blog/categories/thinking-in-ramda/","type":"article"}]},
{"title":"lodash/fp","description":"lodash/fp is the auto-curried, immutable, data-last version of lodash — a lower-commitment entry point into FP for teams already using lodash.","resources":[{"label":"lodash/fp Guide","url":"https://github.com/lodash/lodash/wiki/FP-Guide","type":"docs"},{"label":"Lodash FP walkthrough","url":"https://www.yld.io/blog/using-lodash-fp/","type":"article"}]}
]}
]
},
"javascript-10":{
"sideLeft":[
{"title":"Performance Model","children":[
{"title":"V8 optimization tips","description":"V8 optimizes functions with stable object shapes and predictable types — mixing types in arrays or adding properties out of order triggers de-optimization.","resources":[{"label":"V8 — fast properties","url":"https://v8.dev/blog/fast-properties","type":"article"},{"label":"JavaScript Performance — web.dev","url":"https://web.dev/articles/efficiently-load-third-party-javascript","type":"article"}]},
{"title":"Memory leak patterns","description":"Common JS leaks: forgotten event listeners, closures retaining large objects, and detached DOM nodes held in variables — Chrome Memory DevTools identifies all three.","resources":[{"label":"Memory Leaks — Chrome DevTools","url":"https://developer.chrome.com/docs/devtools/memory-problems/","type":"docs"},{"label":"JS Memory Management","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management","type":"docs"}]}
]},
{"title":"Security","children":[
{"title":"XSS prevention","description":"Always use textContent instead of innerHTML for user-controlled content, and sanitize any HTML you must render — XSS is the most common client-side vulnerability.","resources":[{"label":"OWASP XSS Prevention Cheat Sheet","url":"https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html","type":"docs"},{"label":"DOMPurify — HTML sanitizer","url":"https://github.com/cure53/DOMPurify","type":"docs"}]},
{"title":"Content Security Policy","description":"CSP is an HTTP header that whitelists trusted content sources — the most effective defence against XSS in production applications.","resources":[{"label":"MDN — Content Security Policy","url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP","type":"docs"},{"label":"CSP Evaluator","url":"https://csp-evaluator.withgoogle.com","type":"article"}]}
]}
],
"sideRight":[
{"title":"Monitoring","children":[
{"title":"Sentry error tracking","description":"Sentry captures unhandled exceptions and promise rejections in production with full stack traces and user context — the standard first step for production observability.","resources":[{"label":"Sentry JavaScript Docs","url":"https://docs.sentry.io/platforms/javascript/","type":"docs"},{"label":"Sentry Getting Started","url":"https://docs.sentry.io/platforms/javascript/guides/react/","type":"docs"}]},
{"title":"Core Web Vitals","description":"CWV (LCP, INP, CLS) are Google's metrics for user experience — measuring them with the web-vitals library exposes performance issues that matter to real users.","resources":[{"label":"web.dev — Core Web Vitals","url":"https://web.dev/articles/vitals","type":"article"},{"label":"web-vitals library","url":"https://github.com/GoogleChrome/web-vitals","type":"docs"}]}
]},
{"title":"CI/CD","children":[
{"title":"GitHub Actions for JS","description":"A basic workflow runs lint, tests, and build on every PR — catching issues before merge without any external CI service.","resources":[{"label":"GitHub Actions — Node.js","url":"https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs","type":"docs"},{"label":"GitHub Actions quickstart","url":"https://docs.github.com/en/actions/quickstart","type":"docs"}]},
{"title":"npm publish workflow","description":"Using a GitHub Actions release workflow with provenance signing is the modern standard for publishing packages to npm.","resources":[{"label":"npm — publishing packages","url":"https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages","type":"docs"},{"label":"Automated npm publish with Actions","url":"https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages","type":"docs"}]}
]}
]
}
};

// Patch each layer
for (const layer of data["javascript"]) {
  if (sides[layer.id]) {
    layer.sideLeft = sides[layer.id].sideLeft;
    layer.sideRight = sides[layer.id].sideRight;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log("JS sides patched OK");
