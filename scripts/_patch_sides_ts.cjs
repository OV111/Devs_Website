
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "../src/data/roadmaps/languages.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const sides = {
"typescript-1":{
"sideLeft":[
{"title":"Type System Theory","children":[
{"title":"Structural typing","description":"TypeScript uses structural (duck) typing — if two types have the same shape, they're compatible, regardless of what they're called. This differs from nominal typing in Java/C#.","resources":[{"label":"TypeScript Handbook — Type Compatibility","url":"https://www.typescriptlang.org/docs/handbook/type-compatibility.html","type":"docs"},{"label":"Structural vs Nominal Typing","url":"https://medium.com/redox-techblog/structural-typing-in-typescript-4b89f21d6004","type":"article"}]},
{"title":"Type vs value space","description":"TypeScript has two worlds — types (erased at runtime) and values (kept at runtime). Confusing them leads to errors like using an interface as a value.","resources":[{"label":"TypeScript Handbook — Typeof","url":"https://www.typescriptlang.org/docs/handbook/2/typeof-types.html","type":"docs"},{"label":"Types vs Values in TypeScript","url":"https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html","type":"docs"}]}
]},
{"title":"Compiler Internals","children":[
{"title":"tsc pipeline","description":"tsc parses TS → type-checks → emits JS. Understanding each phase helps debug cryptic errors and configure the compiler correctly.","resources":[{"label":"How the TypeScript Compiler Works","url":"https://www.huy.rocks/everyday/04-01-2022-typescript-how-the-compiler-compiles","type":"article"},{"label":"TypeScript Compiler API","url":"https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API","type":"docs"}]},
{"title":"Type erasure","description":"All TypeScript type annotations are completely removed at compile time — at runtime, you have plain JavaScript with no type information remaining.","resources":[{"label":"TypeScript is a Compile-Time Tool","url":"https://www.typescriptlang.org/docs/handbook/2/basic-types.html","type":"docs"},{"label":"Type Erasure Explained","url":"https://fettblog.eu/typescript-type-erasure/","type":"article"}]}
]}
],
"sideRight":[
{"title":"Setup","children":[
{"title":"tsconfig.json essentials","description":"tsconfig controls strict mode, target JS version, module format, and path aliases — getting this right from the start prevents painful migrations later.","resources":[{"label":"tsconfig.json reference","url":"https://www.typescriptlang.org/tsconfig","type":"docs"},{"label":"TSConfig Cheat Sheet","url":"https://www.totaltypescript.com/tsconfig-cheat-sheet","type":"article"}]},
{"title":"ts-node for scripts","description":"ts-node runs TypeScript files directly without a build step — perfect for scripts, CLIs, and quick experimentation.","resources":[{"label":"ts-node docs","url":"https://typestrong.org/ts-node/docs/","type":"docs"},{"label":"tsx — faster ts-node alternative","url":"https://github.com/privatenumber/tsx","type":"docs"}]}
]},
{"title":"IDE Support","children":[
{"title":"VS Code TypeScript integration","description":"VS Code uses TypeScript's language server for autocomplete, refactoring, and inline errors — enabling strict mode maximises these benefits.","resources":[{"label":"VS Code — TypeScript","url":"https://code.visualstudio.com/docs/languages/typescript","type":"docs"},{"label":"TypeScript in 5 minutes","url":"https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html","type":"docs"}]},
{"title":"ESLint for TypeScript","description":"@typescript-eslint/eslint-plugin adds TS-aware lint rules that catch issues tsc doesn't — especially useful for enforcing naming conventions and banning unsafe patterns.","resources":[{"label":"typescript-eslint docs","url":"https://typescript-eslint.io/getting-started","type":"docs"},{"label":"typescript-eslint rules","url":"https://typescript-eslint.io/rules/","type":"docs"}]}
]}
]
},
"typescript-2":{
"sideLeft":[
{"title":"Interface vs Type Alias","children":[
{"title":"Declaration merging","description":"Interfaces can be declared multiple times and TypeScript merges them — type aliases cannot. This is why most library typings use interfaces.","resources":[{"label":"TypeScript Handbook — Declaration Merging","url":"https://www.typescriptlang.org/docs/handbook/declaration-merging.html","type":"docs"},{"label":"Interface vs Type — Matt Pocock","url":"https://www.totaltypescript.com/type-vs-interface-which-should-you-use","type":"article"}]},
{"title":"Extending types","description":"Interfaces use extends; type aliases use & (intersection). Both compose types, but intersection creates a new merged type while extends enforces compatibility.","resources":[{"label":"TypeScript Handbook — Interfaces","url":"https://www.typescriptlang.org/docs/handbook/2/objects.html","type":"docs"},{"label":"TypeScript Intersection Types","url":"https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types","type":"docs"}]}
]},
{"title":"Discriminated Unions","children":[
{"title":"Tagged unions","description":"Adding a literal type discriminant field to each union member lets TypeScript narrow precisely — the standard pattern for modelling state machines and API responses.","resources":[{"label":"TypeScript Handbook — Discriminated Unions","url":"https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions","type":"docs"},{"label":"Discriminated Unions in Practice","url":"https://www.totaltypescript.com/discriminated-unions-are-a-devs-best-friend","type":"article"}]},
{"title":"Enum alternatives","description":"const enums compile away entirely; string union literals (type Status = 'active' | 'inactive') are often more readable and debuggable than numeric enums.","resources":[{"label":"TypeScript Handbook — Enums","url":"https://www.typescriptlang.org/docs/handbook/enums.html","type":"docs"},{"label":"Enums considered harmful — TypeScript","url":"https://www.totaltypescript.com/why-i-dont-like-typescript-enums","type":"article"}]}
]}
],
"sideRight":[
{"title":"Typing API Responses","children":[
{"title":"Type-safe fetch wrappers","description":"Wrapping fetch with a generic function that accepts a return type and validates with Zod gives you end-to-end type safety from API to component.","resources":[{"label":"Zod — TypeScript-first schema validation","url":"https://zod.dev","type":"docs"},{"label":"Type-safe API calls in TypeScript","url":"https://www.totaltypescript.com/type-safe-api-calls","type":"article"}]},
{"title":"OpenAPI code generation","description":"Tools like openapi-typescript generate TypeScript types directly from OpenAPI specs — eliminating manual type maintenance for REST APIs.","resources":[{"label":"openapi-typescript","url":"https://openapi-ts.dev","type":"docs"},{"label":"Orval — OpenAPI client generator","url":"https://orval.dev","type":"docs"}]}
]},
{"title":"Patterns","children":[
{"title":"Type-safe config objects","description":"Typing configuration objects with interfaces catches typos and missing fields at compile time — much better than validating at runtime.","resources":[{"label":"TypeScript Handbook — Object Types","url":"https://www.typescriptlang.org/docs/handbook/2/objects.html","type":"docs"},{"label":"Typed Config Pattern","url":"https://kentcdodds.com/blog/define-function-overload-types-with-type-script","type":"article"}]},
{"title":"Readonly and const assertions","description":"Readonly<T> prevents mutation at the type level; as const infers the narrowest literal types — both make immutable data patterns type-safe.","resources":[{"label":"TypeScript Handbook — Readonly","url":"https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties","type":"docs"},{"label":"const assertions — TypeScript","url":"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions","type":"docs"}]}
]}
]
},
"typescript-3":{
"sideLeft":[
{"title":"Control Flow Analysis","children":[
{"title":"TypeScript's narrowing algorithm","description":"TypeScript tracks which type checks you've done (typeof, instanceof, in) and narrows the type in each branch — this is how type guards work automatically.","resources":[{"label":"TypeScript Handbook — Narrowing","url":"https://www.typescriptlang.org/docs/handbook/2/narrowing.html","type":"docs"},{"label":"TypeScript Narrowing Deep Dive","url":"https://fettblog.eu/typescript-union-types/","type":"article"}]},
{"title":"never in exhaustive checks","description":"Adding a default case that assigns to never ensures you handle every union member — the compiler errors if you add a new variant without updating the switch.","resources":[{"label":"Exhaustive Checks with never","url":"https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type","type":"docs"},{"label":"Exhaustive pattern matching in TS","url":"https://www.totaltypescript.com/exhaustive-matching-in-typescript","type":"article"}]}
]},
{"title":"Function Overloads","children":[
{"title":"Overload signatures","description":"Overload signatures let you declare multiple call signatures for a function — TypeScript picks the right one at the call site based on argument types.","resources":[{"label":"TypeScript Handbook — Overloads","url":"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads","type":"docs"},{"label":"Function Overloads in TS","url":"https://fettblog.eu/typescript-function-overloads/","type":"article"}]},
{"title":"Type predicate functions","description":"A function returning 'value is Type' acts as a user-defined type guard — TypeScript narrows the type in the if-branch when you call it.","resources":[{"label":"TypeScript — Type Predicates","url":"https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates","type":"docs"},{"label":"Type Guards and Predicates","url":"https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Practical Narrowing","children":[
{"title":"instanceof and in operator guards","description":"instanceof checks narrow class instances; the in operator narrows based on property presence — both work automatically with TypeScript's control flow analysis.","resources":[{"label":"MDN — instanceof","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof","type":"docs"},{"label":"TypeScript instanceof narrowing","url":"https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-instanceof-narrowing","type":"docs"}]},
{"title":"Assertion functions","description":"Functions that throw on invalid input can be typed as asserts — TypeScript then treats the value as the asserted type for the rest of the scope.","resources":[{"label":"TypeScript — Assertion Functions","url":"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions","type":"docs"},{"label":"Assertion Functions Guide","url":"https://fettblog.eu/typescript-assertion-functions/","type":"article"}]}
]},
{"title":"Utility Patterns","children":[
{"title":"Partial and Required","description":"Partial<T> makes all properties optional; Required<T> makes all mandatory — useful for update payloads and configuration merging patterns.","resources":[{"label":"TypeScript — Utility Types","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html","type":"docs"},{"label":"TypeScript Utility Types Cheat Sheet","url":"https://www.totaltypescript.com/typescript-utility-types","type":"article"}]},
{"title":"Pick and Omit","description":"Pick<T, Keys> selects a subset of properties; Omit<T, Keys> removes them — together they derive DTO types from domain models without duplication.","resources":[{"label":"TypeScript — Pick","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys","type":"docs"},{"label":"TypeScript — Omit","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys","type":"docs"}]}
]}
]
},
"typescript-4":{
"sideLeft":[
{"title":"Generic Theory","children":[
{"title":"Type parameters and inference","description":"TypeScript infers generic type parameters from arguments — explicit annotation is only needed when inference produces a too-wide type or you're defining a return-only generic.","resources":[{"label":"TypeScript Handbook — Generics","url":"https://www.typescriptlang.org/docs/handbook/2/generics.html","type":"docs"},{"label":"Understanding TypeScript Generics","url":"https://www.totaltypescript.com/typescript-generics","type":"article"}]},
{"title":"Variance","description":"A type is covariant if it can be substituted with a subtype — TypeScript's structural typing makes most positions covariant by default, which affects generic containers.","resources":[{"label":"Covariance and Contravariance in TypeScript","url":"https://dmitripavlutin.com/typescript-covariance-contravariance/","type":"article"},{"label":"TypeScript Variance","url":"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints","type":"docs"}]}
]},
{"title":"Constraints","children":[
{"title":"extends keyword in generics","description":"T extends SomeType constrains what can be passed as T — TypeScript then knows the shape of T inside the function, enabling property access without casting.","resources":[{"label":"TypeScript Handbook — Generic Constraints","url":"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints","type":"docs"},{"label":"Generic Constraints in Practice","url":"https://fettblog.eu/typescript-generics/","type":"article"}]},
{"title":"keyof and indexed access","description":"keyof T produces a union of T's property names — combined with T[K] (indexed access), you can type functions that read arbitrary properties safely.","resources":[{"label":"TypeScript — keyof","url":"https://www.typescriptlang.org/docs/handbook/2/keyof-types.html","type":"docs"},{"label":"TypeScript Indexed Access Types","url":"https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Generic Patterns","children":[
{"title":"Generic React components","description":"Typing React components with generic props enables reusable list/table/select components that preserve type information through the component boundary.","resources":[{"label":"React TypeScript Cheatsheet — Generics","url":"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/","type":"docs"},{"label":"Generic Components in React","url":"https://www.totaltypescript.com/generic-components-in-react","type":"article"}]},
{"title":"Generic API wrappers","description":"Wrapping fetch or axios in a generic function that takes a return type gives you full type inference from API call to consuming component.","resources":[{"label":"Typed fetch with generics","url":"https://www.totaltypescript.com/type-safe-api-calls","type":"article"},{"label":"Axios with TypeScript","url":"https://axios-http.com/docs/req_config","type":"docs"}]}
]},
{"title":"Built-in Generics","children":[
{"title":"Array<T>, Promise<T>, Map<K,V>","description":"All standard JS built-ins have generic TypeScript types — using them instead of any[] or Promise<any> preserves type safety throughout your codebase.","resources":[{"label":"TypeScript — Built-in generic types","url":"https://www.typescriptlang.org/docs/handbook/2/types-from-types.html","type":"docs"},{"label":"TypeScript lib.es5.d.ts","url":"https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts","type":"docs"}]},
{"title":"Record<K,V>","description":"Record<string, number> is shorthand for an object whose keys are strings and values are numbers — cleaner than { [key: string]: number } and works with keyof.","resources":[{"label":"TypeScript — Record","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type","type":"docs"},{"label":"Using Record in TypeScript","url":"https://dmitripavlutin.com/typescript-record/","type":"article"}]}
]}
]
},
"typescript-5":{
"sideLeft":[
{"title":"Class Semantics","children":[
{"title":"TypeScript vs JS classes","description":"TypeScript adds access modifiers (private, protected, readonly) and parameter properties — these are erased at runtime and enforced only at compile time.","resources":[{"label":"TypeScript Handbook — Classes","url":"https://www.typescriptlang.org/docs/handbook/2/classes.html","type":"docs"},{"label":"TypeScript Classes Deep Dive","url":"https://basarat.gitbook.io/typescript/future-javascript/classes","type":"book"}]},
{"title":"Abstract classes","description":"Abstract classes define a contract that subclasses must implement without being instantiable themselves — the right choice when you need shared implementation plus enforced interface.","resources":[{"label":"TypeScript — Abstract Classes","url":"https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members","type":"docs"},{"label":"Abstract vs Interface in TS","url":"https://betterprogramming.pub/abstract-classes-vs-interface-in-typescript-3b57ba5d3ad1","type":"article"}]}
]},
{"title":"Decorator Metadata","children":[
{"title":"reflect-metadata","description":"reflect-metadata enables storing and retrieving type metadata at runtime — required by decorator-heavy frameworks like NestJS and TypeORM.","resources":[{"label":"reflect-metadata npm","url":"https://www.npmjs.com/package/reflect-metadata","type":"docs"},{"label":"TypeScript Decorators + reflect-metadata","url":"https://blog.logrocket.com/a-practical-guide-to-typescript-decorators/","type":"article"}]},
{"title":"Decorator factories","description":"A decorator factory is a function that returns a decorator — this allows decorators to accept configuration arguments like @Column({ nullable: true }).","resources":[{"label":"TypeScript Handbook — Decorators","url":"https://www.typescriptlang.org/docs/handbook/decorators.html","type":"docs"},{"label":"TypeScript Decorator Patterns","url":"https://www.digitalocean.com/community/tutorials/how-to-use-decorators-in-typescript","type":"article"}]}
]}
],
"sideRight":[
{"title":"DI with Decorators","children":[
{"title":"NestJS decorators","description":"NestJS uses TypeScript decorators pervasively — @Injectable(), @Controller(), @Get() — understanding decorator factories helps you write custom NestJS decorators.","resources":[{"label":"NestJS Docs","url":"https://docs.nestjs.com","type":"docs"},{"label":"NestJS — Custom Decorators","url":"https://docs.nestjs.com/custom-decorators","type":"docs"}]},
{"title":"TypeORM entities","description":"TypeORM uses @Entity(), @Column(), @PrimaryGeneratedColumn() to map classes to database tables — decorators + metadata make the ORM mapping seamless.","resources":[{"label":"TypeORM Docs","url":"https://typeorm.io","type":"docs"},{"label":"TypeORM Entity Decorators","url":"https://typeorm.io/entities","type":"docs"}]}
]},
{"title":"Mixins","children":[
{"title":"Mixin pattern in TypeScript","description":"TypeScript's mixin pattern uses generic base classes and type intersections to simulate multiple inheritance without the diamond problem.","resources":[{"label":"TypeScript Handbook — Mixins","url":"https://www.typescriptlang.org/docs/handbook/mixins.html","type":"docs"},{"label":"TypeScript Mixins in Practice","url":"https://www.digitalocean.com/community/tutorials/typescript-mixins","type":"article"}]},
{"title":"Class decorators for cross-cutting concerns","description":"Class decorators apply logic (logging, caching, validation) to every method of a class without modifying the class itself — the AOP pattern in TypeScript.","resources":[{"label":"TypeScript Decorators — log decorator","url":"https://blog.logrocket.com/a-practical-guide-to-typescript-decorators/","type":"article"},{"label":"AOP with TypeScript Decorators","url":"https://medium.com/@antonyjsn/aop-in-typescript-with-decorators-4e2fc2e36f0c","type":"article"}]}
]}
]
},
"typescript-6":{
"sideLeft":[
{"title":"Mapped Types","children":[
{"title":"keyof and in operator","description":"Mapped types iterate over a union of keys with [K in keyof T] — this powers Partial<T>, Readonly<T>, and any transformation that applies uniformly to all properties.","resources":[{"label":"TypeScript Handbook — Mapped Types","url":"https://www.typescriptlang.org/docs/handbook/2/mapped-types.html","type":"docs"},{"label":"Mapped Types Deep Dive","url":"https://www.totaltypescript.com/mapped-types","type":"article"}]},
{"title":"Homomorphic mapped types","description":"A mapped type over keyof T preserves optional/readonly modifiers from the original — non-homomorphic mapped types (over arbitrary unions) don't.","resources":[{"label":"TypeScript — Homomorphic mapped types","url":"https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers","type":"docs"},{"label":"Understanding homomorphic types","url":"https://fettblog.eu/typescript-mapped-types/","type":"article"}]}
]},
{"title":"Conditional Types","children":[
{"title":"infer keyword","description":"infer inside conditional types extracts a type from another type — the mechanism behind ReturnType<T>, Parameters<T>, and many utility types.","resources":[{"label":"TypeScript Handbook — Conditional Types","url":"https://www.typescriptlang.org/docs/handbook/2/conditional-types.html","type":"docs"},{"label":"TypeScript infer keyword explained","url":"https://www.totaltypescript.com/typescript-infer-keyword","type":"article"}]},
{"title":"Distributive conditionals","description":"Conditional types distribute over union members automatically — T extends string ? 'yes' : 'no' applied to 'a' | 1 gives 'yes' | 'no'.","resources":[{"label":"TypeScript — Distributive Conditional Types","url":"https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types","type":"docs"},{"label":"Distributive Conditional Types Guide","url":"https://fettblog.eu/typescript-union-types/","type":"article"}]}
]}
],
"sideRight":[
{"title":"Utility Types","children":[
{"title":"ReturnType, Parameters, Awaited","description":"ReturnType<T> extracts a function's return type; Parameters<T> extracts its argument types; Awaited<T> unwraps nested Promises — all use infer internally.","resources":[{"label":"TypeScript — Utility Types","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html","type":"docs"},{"label":"TypeScript Utility Types in Practice","url":"https://www.totaltypescript.com/typescript-utility-types","type":"article"}]},
{"title":"Template literal types","description":"Template literal types combine string literal unions — type EventName = `on${Capitalize<string>}` — enabling precise string-pattern typing for event systems.","resources":[{"label":"TypeScript — Template Literal Types","url":"https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html","type":"docs"},{"label":"Template Literal Types Guide","url":"https://www.totaltypescript.com/template-literal-types","type":"article"}]}
]},
{"title":"Real-world Advanced Patterns","children":[
{"title":"Builder pattern with generics","description":"A fluent builder that accumulates type information as you chain calls — TypeScript tracks what's been set so far and prevents building incomplete objects.","resources":[{"label":"Builder Pattern in TypeScript","url":"https://refactoring.guru/design-patterns/builder/typescript/example","type":"article"},{"label":"Type-safe builder pattern","url":"https://www.totaltypescript.com/the-builder-pattern","type":"article"}]},
{"title":"Branded/nominal types","description":"Branding a primitive type (type UserId = string & { readonly __brand: 'UserId' }) prevents passing a plain string where a UserId is expected.","resources":[{"label":"Branded Types in TypeScript","url":"https://www.totaltypescript.com/branded-types","type":"article"},{"label":"Nominal Typing Techniques","url":"https://michalzalecki.com/nominal-typing-in-typescript/","type":"article"}]}
]}
]
},
"typescript-7":{
"sideLeft":[
{"title":"Module Resolution","children":[
{"title":"Node vs bundler resolution","description":"TypeScript's moduleResolution: 'bundler' matches how Vite/webpack resolve imports — using the wrong setting causes false errors for valid imports.","resources":[{"label":"TypeScript — Module Resolution","url":"https://www.typescriptlang.org/docs/handbook/modules/theory.html#module-resolution","type":"docs"},{"label":"TypeScript moduleResolution options","url":"https://www.typescriptlang.org/tsconfig#moduleResolution","type":"docs"}]},
{"title":"paths mapping","description":"The paths compiler option maps import aliases to real directories — the TypeScript counterpart to webpack/Vite alias config, required for @ path aliases.","resources":[{"label":"TypeScript — paths","url":"https://www.typescriptlang.org/tsconfig#paths","type":"docs"},{"label":"Path aliases in TypeScript","url":"https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping","type":"docs"}]}
]},
{"title":"Declaration Files","children":[
{"title":".d.ts structure","description":"Declaration files describe the shape of JS code without implementation — used by libraries to ship type information alongside their JS output.","resources":[{"label":"TypeScript — .d.ts files","url":"https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html","type":"docs"},{"label":"Writing .d.ts files","url":"https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html","type":"docs"}]},
{"title":"Ambient modules","description":"declare module 'some-lib' lets you type a library that ships no types — the minimal version silences errors; a full version gives you autocomplete.","resources":[{"label":"TypeScript — Ambient Modules","url":"https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules","type":"docs"},{"label":"DefinitelyTyped GitHub","url":"https://github.com/DefinitelyTyped/DefinitelyTyped","type":"docs"}]}
]}
],
"sideRight":[
{"title":"tsconfig Options","children":[
{"title":"strict mode flags","description":"strict enables eight checks at once — the most important are strictNullChecks (no implicit null) and noImplicitAny. Enable all of them from day one.","resources":[{"label":"TypeScript — strict","url":"https://www.typescriptlang.org/tsconfig#strict","type":"docs"},{"label":"TypeScript strict mode guide","url":"https://www.totaltypescript.com/tips/use-strict-in-typescript","type":"article"}]},
{"title":"target and lib","description":"target controls the emitted JS version; lib controls which built-in types are available — mismatching them causes type errors for APIs that exist at runtime.","resources":[{"label":"TypeScript — target","url":"https://www.typescriptlang.org/tsconfig#target","type":"docs"},{"label":"TypeScript — lib","url":"https://www.typescriptlang.org/tsconfig#lib","type":"docs"}]}
]},
{"title":"DefinitelyTyped","children":[
{"title":"@types packages","description":"@types/node, @types/react etc. are community-maintained declaration files on npm — install them as devDependencies to get types for untyped packages.","resources":[{"label":"DefinitelyTyped","url":"https://definitelytyped.org","type":"docs"},{"label":"TypeSearch — find @types","url":"https://www.typescriptlang.org/dt/search","type":"docs"}]},
{"title":"Writing your own .d.ts","description":"When a library has no @types package, writing a minimal .d.ts with only the APIs you use is faster than casting to any throughout your code.","resources":[{"label":"TypeScript — Creating .d.ts files","url":"https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html","type":"docs"},{"label":"TypeScript Declaration File Templates","url":"https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html","type":"docs"}]}
]}
]
},
"typescript-8":{
"sideLeft":[
{"title":"Async Type Flow","children":[
{"title":"Promise<T> inference","description":"async functions always return Promise<T> — TypeScript infers T from your return statement, so you rarely need to annotate the return type explicitly.","resources":[{"label":"TypeScript — async/await","url":"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html","type":"docs"},{"label":"Async TypeScript Patterns","url":"https://fettblog.eu/typescript-async-await-and-promises/","type":"article"}]},
{"title":"Awaited<T> type","description":"Awaited<T> recursively unwraps Promise types — useful for extracting the resolved value type from deeply nested or conditional async return types.","resources":[{"label":"TypeScript — Awaited","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype","type":"docs"},{"label":"TypeScript Awaited Utility Type","url":"https://www.totaltypescript.com/awaited","type":"article"}]}
]},
{"title":"Error Handling Types","children":[
{"title":"Error vs unknown in catch","description":"TypeScript 4+ types caught errors as unknown — you must narrow to Error before accessing .message, which forces proper error handling.","resources":[{"label":"TypeScript 4 — useUnknownInCatchVariables","url":"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#defaulting-to-the-unknown-type-in-catch-variables","type":"docs"},{"label":"Catching unknown errors in TypeScript","url":"https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript","type":"article"}]},
{"title":"Result/Either pattern","description":"Wrapping returns in { ok: true, value } | { ok: false, error } makes error handling explicit in the type system, preventing silent failures.","resources":[{"label":"neverthrow — Result type for TS","url":"https://github.com/supermacro/neverthrow","type":"docs"},{"label":"Error Handling with Result Type","url":"https://www.totaltypescript.com/monadic-error-handling-in-typescript","type":"article"}]}
]}
],
"sideRight":[
{"title":"Async Patterns","children":[
{"title":"Typed fetch wrappers","description":"A generic fetchJson<T>(url) that validates with Zod at runtime and returns T at compile time gives you the best of both worlds — type safety + runtime validation.","resources":[{"label":"Zod Docs","url":"https://zod.dev","type":"docs"},{"label":"Type-safe fetch with Zod","url":"https://www.totaltypescript.com/type-safe-api-calls","type":"article"}]},
{"title":"tRPC","description":"tRPC generates TypeScript types from your server router automatically — zero-config end-to-end type safety without a code generation step or shared types package.","resources":[{"label":"tRPC Docs","url":"https://trpc.io/docs","type":"docs"},{"label":"tRPC vs REST vs GraphQL","url":"https://trpc.io/docs/concepts","type":"docs"}]}
]},
{"title":"Libraries","children":[
{"title":"axios with TypeScript","description":"Axios's AxiosResponse<T> generic types the response data — combined with Zod validation on the response, you get reliable typed API clients.","resources":[{"label":"Axios TypeScript usage","url":"https://axios-http.com/docs/req_config","type":"docs"},{"label":"Typed Axios with TypeScript","url":"https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/#typescript","type":"article"}]},
{"title":"React Query with TypeScript","description":"TanStack Query's useQuery<TData, TError> generics type loading, error, and data states — combined with Zod parsing on the queryFn, you get full type safety.","resources":[{"label":"TanStack Query — TypeScript","url":"https://tanstack.com/query/latest/docs/framework/react/typescript","type":"docs"},{"label":"React Query TypeScript Guide","url":"https://tkdodo.eu/blog/react-query-and-type-script","type":"article"}]}
]}
]
},
"typescript-9":{
"sideLeft":[
{"title":"Type Testing","children":[
{"title":"tsd — type assertions in tests","description":"tsd lets you write type-level assertions (expectType, expectError) as part of your test suite — essential for testing utility types and type inference.","resources":[{"label":"tsd GitHub","url":"https://github.com/SamVerschueren/tsd","type":"docs"},{"label":"Testing TypeScript Types","url":"https://www.totaltypescript.com/how-to-test-your-types","type":"article"}]},
{"title":"expect-type","description":"expect-type provides Jest-compatible type assertions that fail the test if types don't match — the most ergonomic way to test types alongside runtime tests.","resources":[{"label":"expect-type GitHub","url":"https://github.com/mmkal/expect-type","type":"docs"},{"label":"Testing Types with expect-type","url":"https://fettblog.eu/testing-typescript-types-with-vitest/","type":"article"}]}
]},
{"title":"Mock Typing","children":[
{"title":"Partial mocks with Partial<T>","description":"Using Partial<T> for mock objects lets you specify only the properties relevant to a test — avoiding brittle full-object mocks that break when types change.","resources":[{"label":"TypeScript Partial in Tests","url":"https://kentcdodds.com/blog/how-to-write-a-react-component-in-typescript","type":"article"},{"label":"TypeScript — Partial","url":"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype","type":"docs"}]},
{"title":"jest.mocked helper","description":"jest.mocked(fn) types a mocked function with jest's mock type — eliminating casts when accessing .mockReturnValue or .mock.calls on typed functions.","resources":[{"label":"Jest — jest.mocked","url":"https://jestjs.io/docs/jest-object#jestmockedsource-options","type":"docs"},{"label":"Testing TypeScript with Jest","url":"https://basarat.gitbook.io/typescript/intro-1/jest","type":"book"}]}
]}
],
"sideRight":[
{"title":"Testing Setup","children":[
{"title":"Vitest + TypeScript config","description":"Vitest works natively with TypeScript via esbuild — add a vitest.config.ts and it picks up your tsconfig paths and aliases without additional setup.","resources":[{"label":"Vitest TypeScript Guide","url":"https://vitest.dev/guide/","type":"docs"},{"label":"Vitest Config Reference","url":"https://vitest.dev/config/","type":"docs"}]},
{"title":"Jest with ts-jest","description":"ts-jest transforms TypeScript files for Jest using the TypeScript compiler — ensures your tests and source use identical type resolution.","resources":[{"label":"ts-jest Docs","url":"https://kulshekhar.github.io/ts-jest/docs/","type":"docs"},{"label":"Jest TypeScript Setup","url":"https://jestjs.io/docs/getting-started#using-typescript","type":"docs"}]}
]},
{"title":"Test Patterns","children":[
{"title":"Typed test factories","description":"A typed factory function that accepts Partial<T> and fills defaults creates test fixtures without duplication and stays in sync with type changes.","resources":[{"label":"Test Data Builders","url":"https://www.natpryce.com/articles/000714.html","type":"article"},{"label":"Factory Pattern for Tests","url":"https://kentcdodds.com/blog/stop-mocking-fetch","type":"article"}]},
{"title":"Mock Service Worker","description":"MSW intercepts real network requests at the network level — type-safe handlers replace fetch mocking and work identically in tests and the browser.","resources":[{"label":"MSW Docs","url":"https://mswjs.io/docs/","type":"docs"},{"label":"MSW with TypeScript","url":"https://mswjs.io/docs/best-practices/typescript","type":"docs"}]}
]}
]
},
"typescript-10":{
"sideLeft":[
{"title":"Build Performance","children":[
{"title":"Project references","description":"TypeScript project references split a monorepo into sub-projects that compile independently — incremental compilation only rebuilds changed projects.","resources":[{"label":"TypeScript — Project References","url":"https://www.typescriptlang.org/docs/handbook/project-references.html","type":"docs"},{"label":"TypeScript Build Performance","url":"https://github.com/microsoft/TypeScript/wiki/Performance","type":"docs"}]},
{"title":"Incremental compilation","description":"composite: true + incremental: true writes a .tsbuildinfo file — subsequent builds only recheck files that changed, dramatically cutting CI type-check time.","resources":[{"label":"TypeScript — incremental","url":"https://www.typescriptlang.org/tsconfig#incremental","type":"docs"},{"label":"Faster TypeScript builds","url":"https://dev.to/nickytonline/speeding-up-your-typescript-build-with-incremental-compilation-4ja3","type":"article"}]}
]},
{"title":"Runtime Type Safety","children":[
{"title":"Zod schemas","description":"Zod validates data at runtime and infers TypeScript types from schemas — the standard way to parse API responses, env variables, and form data safely.","resources":[{"label":"Zod Docs","url":"https://zod.dev","type":"docs"},{"label":"Zod — TypeScript-first validation","url":"https://www.totaltypescript.com/zod-tutorial","type":"article"}]},
{"title":"io-ts","description":"io-ts uses the type system itself to define codecs that validate and decode data — a more functional approach to runtime validation with full type inference.","resources":[{"label":"io-ts GitHub","url":"https://github.com/gcanti/io-ts","type":"docs"},{"label":"io-ts — Runtime Types","url":"https://gcanti.github.io/io-ts/","type":"docs"}]}
]}
],
"sideRight":[
{"title":"Monorepo TypeScript","children":[
{"title":"TypeScript project references in monorepos","description":"Each package in a monorepo gets its own tsconfig with references to its dependencies — tsc --build then handles the correct build order automatically.","resources":[{"label":"TypeScript Monorepo Setup","url":"https://turbo.build/repo/docs/guides/tools/typescript","type":"docs"},{"label":"TypeScript in Monorepos","url":"https://nx.dev/recipes/tips-n-tricks/typescript-project-references","type":"article"}]},
{"title":"Turborepo + TypeScript","description":"Turborepo caches TypeScript build outputs across the monorepo — combined with project references, type checking a large monorepo becomes fast.","resources":[{"label":"Turborepo Docs","url":"https://turbo.build/repo/docs","type":"docs"},{"label":"Turborepo TypeScript Guide","url":"https://turbo.build/repo/docs/guides/tools/typescript","type":"docs"}]}
]},
{"title":"CI Type Checking","children":[
{"title":"tsc --noEmit in CI","description":"Running tsc --noEmit as a CI step catches type errors without producing output files — faster than a full build and the right gate before merging PRs.","resources":[{"label":"TypeScript — noEmit","url":"https://www.typescriptlang.org/tsconfig#noEmit","type":"docs"},{"label":"TypeScript CI Setup","url":"https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs","type":"docs"}]},
{"title":"Type coverage tools","description":"type-coverage measures what percentage of your code is typed vs any — useful for tracking progress when migrating a JS codebase to TypeScript.","resources":[{"label":"type-coverage GitHub","url":"https://github.com/plantain-00/type-coverage","type":"docs"},{"label":"Measuring TypeScript Coverage","url":"https://dev.to/nickytonline/measuring-type-coverage-in-your-typescript-project-1c3j","type":"article"}]}
]}
]
}
};

for (const layer of data["typescript"]) {
  if (sides[layer.id]) {
    layer.sideLeft = sides[layer.id].sideLeft;
    layer.sideRight = sides[layer.id].sideRight;
  }
}
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log("TS sides patched OK");
