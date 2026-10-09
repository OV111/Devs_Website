You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (14 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/languages/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example:

```js
/**
 * Capstone brief — dart track (dart), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * Shape notes:
 * - requirements[].check is for the stage-2 automated checks. `file` is a glob
 *   matched against the repo tree at the pinned commit. Requirements without a
 *   check are judged only by the AI rubric review.
 * - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
 *   back to the roadmap layer that teaches it, for weak-spot tracking.
 * - Bump `version` for any change that affects grading; never edit a
 *   published version in place (attempts point at the exact brief document).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "dart",
  categoryId: "languages",
  slug: "dart-async-data-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Reactive Asynchronous Data Streaming & Caching Library",
  summary:
    "Build a pure Dart asynchronous event processing and caching library. " +
    "You will leverage Dart sound null safety, non-blocking asynchronous Streams and Futures, " +
    "OOP inheritance with mixins, functional collection operations, and dynamic extension methods.",
  stack: ["Dart 3.0+", "pubspec", "test package", "Isolates"],

  requirements: [
    {
      id: "pubspec",
      text: "Repository contains a valid pubspec.yaml file defining package metadata.",
      check: { type: "file", glob: "pubspec.yaml" },
    },
    {
      id: "sound-null-safety",
      text: "Comply with Dart sound null safety; unhandled null assignment warnings or dynamic casts are forbidden.",
    },
    {
      id: "class-mixins",
      text: "Define domain abstractions using abstract classes, factory constructors, and reusable mixins.",
    },
    {
      id: "generics-extension",
      text: "Provide custom extension methods on dynamic generic collection types.",
    },
    {
      id: "async-streams",
      text: "Implement event pipelines using Futures, async/await, and StreamController transformation streams.",
    },
    {
      id: "isolates-concurrency",
      text: "Offload heavy background data serialization or encryption work to separate Dart Isolates.",
    },
    {
      id: "custom-exceptions",
      text: "Throw custom domain Exception types captured through try-catch-on blocks.",
    },
    {
      id: "dart-tests",
      text: "Unit test suite using package:test covering asynchronous Streams and Futures logic.",
      check: { type: "file", glob: "test/**/*_test.dart" },
    },
    {
      id: "readme",
      text: "README documents package setup, stream usage examples, isolate design, and test execution.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI executes dart analyze and dart test on every commit.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "async-streams",
      name: "Futures & Stream Pipelines",
      weight: 25,
      layerId: "dart-1",
      description:
        "Effective design of non-blocking async operations, StreamControllers, and stream transformers.",
    },
    {
      id: "sound-null-safety",
      name: "Null Safety & Type System",
      weight: 15,
      layerId: "dart-1",
      description:
        "Strict sound null safety adherence, proper late/required flags, and complete avoidance of untyped dynamic.",
    },
    {
      id: "isolates-concurrency",
      name: "Isolates & Concurrency",
      weight: 15,
      layerId: "dart-1",
      description:
        "Correct multi-threaded work processing via Isolate.spawn and receive/send ports.",
    },
    {
      id: "oop-mixins",
      name: "OOP, Mixins & Generics",
      weight: 15,
      layerId: "dart-1",
      description:
        "Clean class hierarchies using mixins, abstract interfaces, and generic constraints.",
    },
    {
      id: "testing",
      name: "Package Testing & Mocking",
      weight: 15,
      layerId: "dart-1",
      description:
        "Thorough unit testing of async Streams and Isolates using package:test.",
    },
    {
      id: "package-tooling",
      name: "Dart Tooling & Analysis",
      weight: 15,
      layerId: "dart-1",
      description:
        "Valid pubspec setup, zero dart analyze warnings, and complete setup docs.",
    },
  ],

  twistPool: [
    {
      id: "lru-cache-stream",
      text: "Add an in-memory LRU stream cache layer that replays recent stream events to new subscribers.",
    },
    {
      id: "circuit-breaker",
      text: "Implement an async Circuit Breaker stream transformer that halts execution on repetitive stream errors.",
    },
    {
      id: "file-persistence",
      text: "Persist stream snapshots to disk using dart:io File streaming with atomic write operations.",
    },
    {
      id: "debounce-transformer",
      text: "Build a custom StreamTransformer that debounces rapid event pushes by a configurable duration.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "languages". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### elixir — Elixir
  - elixir-1 | Elixir Syntax and Basics | topics: Basic types: integers, floats, atoms, strings, lists, tuples; Variables and immutability; iex interactive shell; Anonymous functions
  - elixir-2 | Pattern Matching and Control Flow | topics: Match operator =; Pattern matching in function heads; case and cond; Guards with when
  - elixir-3 | Recursion and the Enum Module | topics: Tail-call recursion; Enum.map, filter, reduce, sort; Stream for lazy evaluation; Comprehensions with for
  - elixir-4 | Mix and Project Structure | topics: mix new and project layout; mix.exs and dependency management; Hex packages; mix compile, mix run, mix test
  - elixir-5 | Processes and Message Passing | topics: Spawning processes with spawn and spawn_link; send and receive for messaging; Process mailboxes; Process.register and named processes
  - elixir-6 | OTP - GenServer, Supervisor, and Agent | topics: GenServer callbacks: init, handle_call, handle_cast; Supervisor strategies: one_for_one, rest_for_one; Dynamic supervisors; Agent for simple state
  - elixir-7 | Metaprogramming and Macros | topics: Elixir AST representation; quote and unquote; Writing a custom macro; use and __using__ macro
  - elixir-8 | Testing with ExUnit and Property Testing | topics: ExUnit assertions and setup; async tests; Mox for defining and verifying mocks; StreamData for property-based tests
  - elixir-9 | Distributed Elixir and ETS | topics: Node.connect and distributed messaging; Global process registration; ETS tables: types and access; ETS read/write performance
  - elixir-10 | Production Elixir - Phoenix, Releases, and Deployment | topics: Phoenix router, controllers, and views; Phoenix LiveView basics; mix release and runtime.exs; Clustering with libcluster

### scala — Scala
  - scala-1 | Scala Syntax and Basics | topics: val and var declarations; Basic types and type inference; Control flow: if, match, for, while; Functions and methods
  - scala-2 | OOP in Scala - Classes, Traits, and Objects | topics: Classes and primary constructors; Case classes and structural equality; Traits as mixins and interfaces; Companion objects and apply
  - scala-3 | Functional Programming - Collections and Higher-Order Functions | topics: Immutable collections: List, Vector, Map, Set; map, flatMap, filter, foldLeft; Option type and avoiding null; for-comprehensions
  - scala-4 | Pattern Matching and Algebraic Data Types | topics: match expressions; Sealed trait ADTs; Pattern guards; Extractors and unapply
  - scala-5 | Type Classes and Implicits | topics: Type class pattern; given instances and using parameters; Deriving type class instances; Context bounds
  - scala-6 | sbt Deep Dive and Project Structure | topics: build.sbt and project structure; Settings, tasks, and keys; Multi-module projects and aggregation; sbt plugins: scalafmt, scoverage
  - scala-7 | Concurrency - Futures and Akka | topics: Future and Promise; ExecutionContext configuration; Akka actor system and ActorRef; Message passing and ask pattern
  - scala-8 | Cats and Functional Effect Systems | topics: Functor, Monad, Applicative in Cats; IO type and referential transparency; Resource for safe resource management; Fiber for concurrency
  - scala-9 | Testing Scala with ScalaTest and ScalaCheck | topics: ScalaTest spec styles: FunSuite, WordSpec; Matchers and assertions; ScalaCheck Gen and Prop; Property-based testing patterns
  - scala-10 | Production Scala - HTTP4s, Doobie, and Deployment | topics: http4s routing and middleware; Doobie connection pool and queries; Circe JSON encoding/decoding; Configuration with PureConfig

### haskell — Haskell
  - haskell-1 | Haskell Syntax and GHCi | topics: Basic types: Int, Integer, Double, Bool, Char; Function definition and application; Guards and where clauses; Let expressions
  - haskell-2 | Lists, Recursion, and Pattern Matching | topics: List construction: cons : and empty []; Pattern matching on lists; Recursive list functions; List comprehensions
  - haskell-3 | Type Classes and Polymorphism | topics: Type class declaration and instance; Deriving standard instances; Eq, Ord, Show, Read, Enum; Num and Fractional hierarchies
  - haskell-4 | Algebraic Data Types and Maybe/Either | topics: Sum types with data and |; Product types and record syntax; Maybe for optional values; Either for error handling
  - haskell-5 | Functors, Applicatives, and Monads | topics: Functor and fmap; Applicative and <*>; Monad and >>= bind; do-notation desugaring
  - haskell-6 | IO Monad and Side Effects | topics: IO actions and main; do-notation for IO; Reading and writing files in IO; IORef for mutable cells
  - haskell-7 | Cabal, Stack, and the Haskell Ecosystem | topics: cabal init and .cabal file; Stack project structure and stack.yaml; Adding dependencies from Hackage; Library and executable targets
  - haskell-8 | Advanced Type System - GADTs and Type Families | topics: GADT syntax and uses; Type families: type and data families; DataKinds for type-level data; KindSignatures
  - haskell-9 | Concurrency and STM | topics: forkIO and lightweight threads; MVar for shared mutable state; STM and TVar; Composing transactions with atomically
  - haskell-10 | Production Haskell - Servant, Persistent, and Deployment | topics: Servant API type definitions; Handler implementation and server; Persistent models and migrations; Esqueleto for complex queries

### lua — Lua
  - lua-1 | Lua Syntax and Basics | topics: Variables: local and global; Basic types: nil, boolean, number, string; Control flow: if, while, repeat, for; Functions as first-class values
  - lua-2 | Tables - The Universal Data Structure | topics: Table constructors and indexing; Tables as arrays with # operator; Tables as dictionaries; ipairs vs pairs iteration
  - lua-3 | Functions, Closures, and Iterators | topics: Closures and upvalues; Variadic functions with ...; Custom stateful iterators; Coroutine-based iterators
  - lua-4 | Metatables and OOP | topics: Metatables and setmetatable; __index for method lookup; __newindex, __tostring, __add metamethods; Prototype-based inheritance
  - lua-5 | Coroutines | topics: coroutine.create, wrap, resume, yield; Producer-consumer patterns; Coroutine-based state machines; Error handling in coroutines
  - lua-6 | Modules and Package System | topics: require and module loading; package.path and package.cpath; Returning tables as modules; Preventing duplicate loading with package.loaded
  - lua-7 | File I/O and the Standard Library | topics: io.open, read, write, close; io.lines for file iteration; os.time, os.clock, os.date; string.find, match, gmatch, gsub
  - lua-8 | Embedding Lua and the C API | topics: lua_State and luaL_newstate; Lua stack: push, pop, and type checking; Calling Lua functions from C; Registering C functions in Lua
  - lua-9 | LuaJIT and Performance Optimization | topics: LuaJIT installation and compatibility; JIT compilation and traces; LuaJIT FFI for calling C; ffi.cdef and ffi.C
  - lua-10 | Production Lua - OpenResty, Testing, and Deployment | topics: OpenResty and nginx Lua directives; Shared memory dictionaries in OpenResty; Non-blocking I/O with cosocket; LuaRocks package management

### r — R
  - r-1 | R Syntax and Basics | topics: Vectors, lists, and atomic types; Control flow (if/for/while/repeat); Functions and scoping rules; Installing and loading packages
  - r-2 | Data Structures and Manipulation | topics: Matrices and array indexing; Named lists and nested structures; data.frame creation and subsetting; Factors and ordered factors
  - r-3 | Data Wrangling with tidyverse | topics: filter, select, mutate, arrange, summarise; group_by and grouped operations; pivot_longer and pivot_wider; Joining tables (left_join, inner_join)
  - r-4 | Data Visualization with ggplot2 | topics: aes mappings and geoms; Scales, axes, and color palettes; Faceting with facet_wrap and facet_grid; Themes and custom styling
  - r-5 | Statistical Analysis | topics: t-tests, chi-square, ANOVA; Linear regression with lm(); Logistic regression with glm(); Model diagnostics and residual plots
  - r-6 | Functional Programming in R | topics: map, map2, pmap and type-safe variants; walk for side effects; Function factories and closures; Partial application with partial()
  - r-7 | R Markdown and Reporting | topics: YAML front matter and output formats; Code chunk options (echo, eval, cache); Parameterized reports; Tables with knitr::kable and gt
  - r-8 | Machine Learning with R | topics: Recipes for feature engineering; Model specifications with parsnip; Cross-validation with rsample; Hyperparameter tuning with tune
  - r-9 | Shiny Web Applications | topics: ui and server structure; Reactive expressions and observers; Input and output widgets; Modules for reusable components
  - r-10 | R in Production – Packages, APIs, and Deployment | topics: R package structure (DESCRIPTION, NAMESPACE, R/); roxygen2 documentation; Unit testing with testthat; Building REST APIs with plumber

### julia — Julia
  - julia-1 | Julia Syntax and Basics | topics: Variables, types, and type annotations; Control flow (if/for/while/break/continue); Functions and multiple return values; Pkg.jl environments and Project.toml
  - julia-2 | Type System and Multiple Dispatch | topics: Abstract and concrete types; Composite types with struct; Parametric types; Multiple dispatch mechanics
  - julia-3 | Arrays and Linear Algebra | topics: Array construction, indexing, and slicing; Broadcasting with dot syntax; Matrix factorizations (LU, QR, SVD, Cholesky); Sparse matrices with SparseArrays
  - julia-4 | Data Analysis with DataFrames.jl | topics: Loading data with CSV.jl; Selecting, filtering, and transforming columns; GroupBy and aggregation; Joining DataFrames
  - julia-5 | Scientific Computing and Differential Equations | topics: ODE problem definition and solvers; Stiff vs non-stiff problem selection; Parameter estimation with SciML; Numerical integration with QuadGK
  - julia-6 | Machine Learning with Flux.jl | topics: Defining layers and models with Chain; Loss functions and optimizers; Automatic differentiation with Zygote; Training loops and callbacks
  - julia-7 | Performance and Profiling | topics: Benchmarking with @btime and @benchmark; Profiling with @profile and ProfileView; Type instability and @code_warntype; @inbounds and @simd annotations
  - julia-8 | Metaprogramming and Macros | topics: Expressions and the AST; quote and interpolation ($); Writing hygienic macros with @macro; Generated functions with @generated
  - julia-9 | Parallel and Distributed Computing | topics: Multi-threading with Threads.@threads; Thread safety and atomic operations; Distributed computing with @spawnat and @everywhere; SharedArrays and distributed data
  - julia-10 | Julia in Production – Packages, Testing, and Deployment | topics: Package structure and Project.toml; Unit testing with Test.jl; Continuous integration with GitHub Actions; Documentation with Documenter.jl

### zig — Zig
  - zig-1 | Zig Syntax and Basics | topics: Variables (const vs var), types, and integers; Control flow (if/while/for/switch); Functions and return types; zig build and build.zig
  - zig-2 | Memory Management and Allocators | topics: The Allocator interface; GeneralPurposeAllocator for development; ArenaAllocator for batch frees; FixedBufferAllocator for stack allocation
  - zig-3 | Pointers, Slices, and Arrays | topics: Single-item and many-item pointers; Slices (*T vs []T); Sentinel-terminated arrays and C strings; Optional pointers (?*T)
  - zig-4 | Comptime and Generics | topics: comptime variables and expressions; anytype parameters; Passing types as comptime arguments; Compile-time type reflection (@typeInfo)
  - zig-5 | Error Handling | topics: Error sets and error unions (!T); try for propagation; catch for local handling; errdefer for cleanup on failure
  - zig-6 | Standard Library and Data Structures | topics: std.ArrayList(T) operations; std.AutoHashMap and StringHashMap; std.BoundedArray for fixed-capacity; std.mem and std.fmt utilities
  - zig-7 | C Interoperability | topics: @cImport and @cInclude; Linking C libraries in build.zig; C calling convention with extern; zig translate-c for header conversion
  - zig-8 | Build System and Testing | topics: build.zig structure and steps; addExecutable, addStaticLibrary, addSharedLibrary; Cross-compilation targets; Unit tests with std.testing.expect
  - zig-9 | Async I/O and Concurrency | topics: async functions and suspend/resume; await and Frame types; nosuspend for sync call sites; Event loop and I/O scheduling
  - zig-10 | Systems Programming – OS, Embedded, and WebAssembly | topics: Freestanding targets (no libc); Linker scripts and custom entry points; Inline assembly with asm(); Compiling to WebAssembly with wasm32-freestanding

### bash — Bash
  - bash-1 | Shell Basics and Navigation | topics: Filesystem navigation (cd, ls, pwd, find); File operations (cp, mv, rm, mkdir, touch); Environment variables and PATH; stdin, stdout, stderr and redirection
  - bash-2 | Variables, Quoting, and Expansion | topics: Variable assignment and scope; Single vs double quoting; Command substitution $() vs backticks; Arithmetic expansion $(( ))
  - bash-3 | Control Flow and Functions | topics: if/elif/else and test expressions [[ ]]; for loops (C-style and over lists); while and until loops; case statements
  - bash-4 | Text Processing – grep, sed, awk | topics: grep with extended regex (-E) and context flags; sed substitutions, deletions, and in-place editing; awk field splitting, patterns, and actions; cut and paste for columnar data
  - bash-5 | File Operations and Permissions | topics: Permission bits and chmod (symbolic and octal); chown and chgrp; find with -exec and -print0 | xargs -0; Symbolic and hard links
  - bash-6 | Process Management | topics: Foreground/background jobs (&, fg, bg, jobs); Signals and kill/killall; trap for signal handling in scripts; nohup and disown for persistent processes
  - bash-7 | Regular Expressions in Bash | topics: Basic vs Extended Regular Expressions; Character classes, anchors, quantifiers; Capture groups with BASH_REMATCH; Lookaheads with grep -P (PCRE)
  - bash-8 | I/O, Here-docs, and String Manipulation | topics: Here-documents (<<EOF) and indented (<<-EOF); Here-strings (<<<); read for user input and line-by-line file parsing; printf vs echo for reliable formatting
  - bash-9 | Script Robustness and Debugging | topics: set -euo pipefail explained; ERR and EXIT traps; Debugging with bash -x and bash -n; ShellCheck for static analysis
  - bash-10 | Production Scripts – CI/CD, Automation, and Tooling | topics: Writing reusable script libraries with source; Parsing CLI arguments with getopts; cron job syntax and scheduling; Bash scripts in GitHub Actions workflows

### perl — Perl
  - perl-1 | Perl Syntax and Basics | topics: Scalars, arrays, and hashes; Context (scalar vs list); Control flow (if/unless/for/foreach/while/until); String operators and interpolation
  - perl-2 | Regular Expressions | topics: Match operator m// and modifiers (i, g, m, s, x); Substitution s/// and transliteration tr///; Capture groups and $1, $2, named captures (?<name>); Lookaheads, lookbehinds, and non-greedy
  - perl-3 | References and Data Structures | topics: Scalar, array, and hash references; Dereferencing with -> and sigil blocks; Anonymous constructors ([], {}); Nested data structure idioms
  - perl-4 | File I/O and Text Processing | topics: open(), close(), and three-argument open; Reading line-by-line with while (<FH>); In-place editing with -i; File::Find for recursive traversal
  - perl-5 | Object-Oriented Perl | topics: bless and package-based OOP; Inheritance with @ISA and SUPER::; Moose attributes, types, and roles; Moo for lightweight OOP
  - perl-6 | CPAN and Module System | topics: cpanm for fast module installation; Carton and cpanfile for reproducible deps; Writing your own module (Exporter, @EXPORT); Module::Build and Makefile.PL
  - perl-7 | Database Access with DBI | topics: DBI connect, prepare, execute, fetch; Placeholders and bind values; Transactions with begin_work and commit; Error handling with RaiseError
  - perl-8 | Web with Mojolicious | topics: Mojolicious::Lite route definitions; Templates with Embedded Perl (ep); Form handling and validation; Mojo::UserAgent for HTTP requests
  - perl-9 | Advanced Perl – Closures and Metaprogramming | topics: Closures and lexical variable capture; Dispatch tables with code refs; AUTOLOAD for method synthesis; Manipulating the symbol table with typeglobs
  - perl-10 | Modern Perl – Testing, Linting, and Best Practices | topics: use strict and use warnings always; Perl::Tidy for code formatting; Perl::Critic for policy enforcement; Test2::Suite for modern testing

### clojure — Clojure
  - clojure-1 | Clojure Syntax and the REPL | topics: S-expressions and prefix notation; def, defn, let, and do; Basic types (numbers, strings, keywords, symbols); REPL-driven development workflow
  - clojure-2 | Persistent Data Structures | topics: Vectors, maps, sets, and lists; conj, assoc, dissoc, update, merge; Nested updates with update-in and assoc-in; get-in for deep access
  - clojure-3 | Functional Programming and Higher-Order Functions | topics: map, filter, reduce, and keep; apply and juxt; comp and partial for function building; Threading macros (-> and ->>)
  - clojure-4 | Sequences and Laziness | topics: The sequence abstraction (seq, first, rest, next); lazy-seq and memoized laziness; range, iterate, repeat, cycle, and repeatedly; take, drop, take-while, drop-while
  - clojure-5 | Concurrency – Atoms, Refs, and Agents | topics: atom, swap!, reset!, compare-and-set!; refs and dosync transactions (STM); alter, commute, and ref-set; agents, send, send-off, and await
  - clojure-6 | Macros and Metaprogramming | topics: Quote (') vs syntax-quote (`); Unquote (~) and unquote-splicing (~@); defmacro basics; macroexpand and macroexpand-1 for debugging
  - clojure-7 | core.async – Communicating Sequential Processes | topics: Channels (chan), put (>!!/>!), and take (<!/<!!); go blocks and parking vs blocking; Buffered and transducer channels; alt! and alt!! for select
  - clojure-8 | ClojureScript and the Browser | topics: ClojureScript compilation with shadow-cljs; Interop with JavaScript (js/, .); Reagent components as Clojure functions; Re-frame events, effects, and subscriptions
  - clojure-9 | Web Development with Ring and Compojure | topics: Ring request/response maps and middleware; Compojure route definitions and destructuring; Hiccup for HTML generation; JSON APIs with Cheshire
  - clojure-10 | Production Clojure – Testing, Tooling, and Deployment | topics: clojure.test and deftest; kaocha for advanced test running; clj-kondo for static analysis; Spec for data validation (clojure.spec)

### fsharp — F#
  - fsharp-1 | F# Syntax and Basics | topics: let bindings and immutability by default; Basic types and type inference; if/elif/else expressions; Functions as first-class values
  - fsharp-2 | Immutability and Pure Functions | topics: Pure functions and referential transparency; The pipe operator (|>) and function composition (>>); Currying and partial application; Point-free style
  - fsharp-3 | Pattern Matching | topics: match expressions with DU cases; Tuple, record, and list patterns; Wildcard and variable patterns; Guards with when
  - fsharp-4 | Collections and Sequences | topics: List, Array, and Seq modules; map, filter, fold, collect, zip; Lazy sequences with seq { }; Immutable Map and Set
  - fsharp-5 | Discriminated Unions and Type-Driven Design | topics: Discriminated unions for ADTs; Records as lightweight value types; Option<T> for nullable values; Result<T,E> for error handling
  - fsharp-6 | Computation Expressions | topics: async { } computation expression; Binding with let! and return!; Option and Result computation expressions; Custom builder types
  - fsharp-7 | Async and Task Programming | topics: Async.RunSynchronously and Async.Start; Async.Parallel and Async.Sequential; Interop between Async and Task; CancellationToken propagation
  - fsharp-8 | Domain Modeling with F# | topics: Value objects with single-case DUs; Aggregate roots and domain events; Constrained types for validation; Event sourcing patterns in F#
  - fsharp-9 | Web Development with Giraffe and SAFE Stack | topics: Giraffe HttpHandler model; Saturn for convention-based routing; Shared models between client and server; Fable for F# to JavaScript compilation
  - fsharp-10 | F# in Production – Testing, Tooling, and Deployment | topics: Unit testing with Expecto; Property-based testing with FsCheck; Code formatting with Fantomas; Paket for dependency management

### groovy — Groovy
  - groovy-1 | Groovy Syntax and Basics | topics: Optional typing and def keyword; String interpolation (GString); Ranges, lists, and maps literals; Default parameter values
  - groovy-2 | Closures | topics: Closure syntax and implicit it parameter; Closure delegation strategies; owner, delegate, and this; curry() and rcurry() for partial application
  - groovy-3 | Collections and GDK | topics: collect (map), findAll (filter), inject (fold); groupBy and countBy; sort and max/min with closures; Spread operator (*.) for collection methods
  - groovy-4 | Metaprogramming | topics: Adding methods to existing classes with metaClass; methodMissing and propertyMissing; AST transformations (@Canonical, @Immutable, @ToString); Traits for multiple inheritance
  - groovy-5 | Testing with Spock | topics: Specification and Feature methods; given/when/then/expect blocks; where: blocks for data-driven tests; Data tables and pipes
  - groovy-6 | Gradle Build Scripts | topics: Project and task model; Defining custom tasks; Plugins (java, application, shadow); Dependencies and configurations
  - groovy-7 | Jenkins Pipeline DSL | topics: Declarative vs Scripted Pipeline; Stages, steps, and post conditions; Parallel stages; Jenkins shared libraries
  - groovy-8 | Groovy for Scripting and Automation | topics: @Grab for inline dependency resolution; CliBuilder for command-line argument parsing; Groovy XML (XmlSlurper, MarkupBuilder); Groovy JSON (JsonSlurper, JsonBuilder)
  - groovy-9 | Grails Web Framework | topics: Grails project structure and conventions; Domain classes and GORM querying; Controllers, services, and dependency injection; GSP templates and tag libraries
  - groovy-10 | Production Groovy – Static Compilation and Best Practices | topics: @CompileStatic and @TypeChecked for type safety; Performance implications of static vs dynamic; CodeNarc for static code analysis; Groovydoc for API documentation

### ocaml — OCaml
  - ocaml-1 | OCaml Syntax and Basics | topics: let bindings and expressions; Primitive types and type inference; if/then/else as expressions; Function definitions and application
  - ocaml-2 | Algebraic Types and Pattern Matching | topics: Variant types (sum types); Recursive types for trees and lists; Record types and field access; Pattern matching with match
  - ocaml-3 | Modules and Functors | topics: Module definitions and signatures; .mli interface files; Opening and aliasing modules; Functors as parameterized modules
  - ocaml-4 | Higher-Order Functions and the Standard Library | topics: List.map, filter, fold_left, fold_right; Array operations and mutation; Option for nullable values; Result for error handling
  - ocaml-5 | Mutable State and Imperative Style | topics: ref cells and the ! / := operators; Mutable record fields; for and while loops; Sequences and unit values
  - ocaml-6 | Error Handling and Exceptions | topics: Defining and raising exceptions; try/with for exception handling; Result.t and error propagation with bind; Option.bind for nullable chains
  - ocaml-7 | Concurrency with Lwt and Eio | topics: Lwt.t promise type and >>= bind; Lwt_list for concurrent collection operations; Lwt_unix for non-blocking file and network I/O; Eio fibers and structured concurrency
  - ocaml-8 | Build System with Dune | topics: dune and dune-project files; library and executable stanzas; Tests with (test) stanza and Alcotest; Cross-module dependencies
  - ocaml-9 | Jane Street Libraries and ppx | topics: Core for enhanced standard library; Core.String, Int, Float replacements; Sexplib and sexp serialization; ppx_sexp_conv, ppx_compare, ppx_hash
  - ocaml-10 | Production OCaml – Testing, CI, and Deployment | topics: Unit testing with Alcotest; Property-based testing with QCheck; opam-ci for reproducible builds; Packaging with opam files

### assembly — Assembly
  - assembly-1 | Computer Architecture Fundamentals | topics: Fetch-decode-execute cycle; CPU registers and their roles; Von Neumann vs Harvard architecture; The memory hierarchy (registers, cache, RAM)
  - assembly-2 | x86-64 Registers and Instructions | topics: 64/32/16/8-bit register aliases (rax/eax/ax/al); MOV, MOVZX, MOVSX; Arithmetic: ADD, SUB, IMUL, IDIV; INC, DEC, NEG
  - assembly-3 | Memory and Addressing Modes | topics: Register indirect ([rax]); Base + displacement ([rbx + 8]); Scaled index ([rax + rcx*8]); RIP-relative addressing for position-independent code
  - assembly-4 | Control Flow | topics: RFLAGS register (CF, ZF, SF, OF, PF); CMP and TEST instructions; Unconditional JMP; Conditional jumps (JE, JNE, JL, JG, JLE, JGE, JA, JB)
  - assembly-5 | Stack and Calling Conventions | topics: CALL and RET mechanics; System V AMD64 ABI: integer arguments (rdi, rsi, rdx, rcx, r8, r9); Return values in rax; Caller-saved vs callee-saved registers
  - assembly-6 | System Calls | topics: syscall instruction and return in rax; Linux syscall numbers (write, read, open, close, exit); Syscall arguments in rdi, rsi, rdx, r10, r8, r9; Error handling (negative rax = -errno)
  - assembly-7 | SIMD – SSE and AVX | topics: XMM (128-bit) and YMM (256-bit) registers; Packed integer and float instructions; MOVAPS, MOVDQU, PADDD, ADDPS; Shuffle and permute operations
  - assembly-8 | Debugging with GDB | topics: GDB basics (break, run, step, next, continue); Examining registers (info registers); Inspecting memory (x command); Disassembly with disas and objdump
  - assembly-9 | Inline Assembly in C/C++ | topics: GCC extended asm syntax (asm volatile); Input/output operand constraints; Clobber lists; Named operands with symbolic names
  - assembly-10 | ARM Assembly | topics: ARM64 register file (x0–x30, sp, lr, pc); Load/store architecture vs x86 memory access; ARM64 instruction encoding and condition codes; Branch instructions and link register
