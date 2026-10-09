/**
 * Capstone brief — Dart track (dart), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "pubspec", text: "Repository contains a valid pubspec.yaml file defining package metadata.", check: { type: "file", glob: "pubspec.yaml" } },
    { id: "sound-null-safety", text: "Comply with Dart sound null safety; unhandled null assignment warnings or dynamic casts are forbidden." },
    { id: "class-mixins", text: "Define domain abstractions using abstract classes, factory constructors, and reusable mixins." },
    { id: "generics-extension", text: "Provide custom extension methods on dynamic generic collection types." },
    { id: "async-streams", text: "Implement event pipelines using Futures, async/await, and StreamController transformation streams." },
    { id: "isolates-concurrency", text: "Offload heavy background data serialization or encryption work to separate Dart Isolates." },
    { id: "custom-exceptions", text: "Throw custom domain Exception types captured through try-catch-on blocks." },
    { id: "dart-tests", text: "Unit test suite using package:test covering asynchronous Streams and Futures logic.", check: { type: "file", glob: "test/**/*_test.dart" } },
    { id: "readme", text: "README documents package setup, stream usage examples, isolate design, and test execution.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI executes dart analyze and dart test on every commit.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "async-streams", name: "Futures & Stream Pipelines", weight: 25, layerId: "dart-1", description: "Effective design of non-blocking async operations, StreamControllers, and stream transformers." },
    { id: "sound-null-safety", name: "Null Safety & Type System", weight: 15, layerId: "dart-1", description: "Strict sound null safety adherence, proper late/required flags, and complete avoidance of untyped dynamic." },
    { id: "isolates-concurrency", name: "Isolates & Concurrency", weight: 15, layerId: "dart-1", description: "Correct multi-threaded work processing via Isolate.spawn and receive/send ports." },
    { id: "oop-mixins", name: "OOP, Mixins & Generics", weight: 15, layerId: "dart-1", description: "Clean class hierarchies using mixins, abstract interfaces, and generic constraints." },
    { id: "testing", name: "Package Testing & Mocking", weight: 15, layerId: "dart-1", description: "Thorough unit testing of async Streams and Isolates using package:test." },
    { id: "package-tooling", name: "Dart Tooling & Analysis", weight: 15, layerId: "dart-1", description: "Valid pubspec setup, zero dart analyze warnings, and complete setup docs." },
  ],

  twistPool: [
    { id: "lru-cache-stream", text: "Add an in-memory LRU stream cache layer that replays recent stream events to new subscribers." },
    { id: "circuit-breaker", text: "Implement an async Circuit Breaker stream transformer that halts execution on repetitive stream errors." },
    { id: "file-persistence", text: "Persist stream snapshots to disk using dart:io File streaming with atomic write operations." },
    { id: "debounce-transformer", text: "Build a custom StreamTransformer that debounces rapid event pushes by a configurable duration." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Swift track (swift), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "swift",
  categoryId: "languages",
  slug: "swift-vapor-async-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Server-Side Swift Async Task & Notification Backend",
  summary:
    "Build a production-grade server-side REST API service using Vapor in modern Swift 5.10+/6. " +
    "You will harness modern Swift Concurrency (async/await, Actors, TaskGroups), model data using value semantics and protocol abstractions, " +
    "enforce strict optional handling, and package the project clean with Swift Package Manager (SPM).",
  stack: ["Swift 5.10+", "Vapor", "Swift Package Manager", "XCTest / Swift Testing"],

  requirements: [
    { id: "package-swift", text: "Project structured as a valid Swift package containing Package.swift manifest.", check: { type: "file", glob: "Package.swift" } },
    { id: "optionals-guard", text: "Safe handling of optionals using optional binding (if let), guard let early exits, and nil coalescing." },
    { id: "structs-classes", text: "Design model entities leveraging value semantics (structs) and explicit reference types (classes)." },
    { id: "protocols-generics", text: "Abstract data repositories using protocols, protocol extensions, and generic type constraints." },
    { id: "functional-collections", text: "Process data collections using functional operators (map, compactMap, filter, reduce)." },
    { id: "async-actors", text: "Process concurrent requests using async/await, TaskGroups, and Actor isolation to prevent data races." },
    { id: "vapor-routing", text: "Implement Vapor web routing middleware, request validation, and JSON Codable serialization." },
    { id: "swift-testing", text: "Comprehensive async unit tests written using XCTest or Swift Testing @Test macros.", check: { type: "file", glob: "Tests/**/*.swift" } },
    { id: "readme", text: "README details SPM build steps, Vapor execution instructions, and concurrency design choices.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI compiles and tests Swift package on Linux/macOS.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "async-concurrency", name: "Swift Concurrency & Actors", weight: 25, layerId: "swift-6", description: "Mastery of async/await, TaskGroup parallel processing, and actor-isolated shared state." },
    { id: "optionals-value-semantics", name: "Optionals & Value Semantics", weight: 15, layerId: "swift-2", description: "Safe unwrapping using guard/if let, proper choice of structs vs classes, and clean immutability." },
    { id: "protocols-generics", name: "Protocols & Generics", weight: 15, layerId: "swift-4", description: "Decoupled architecture utilizing protocol conformance, extensions, and generic bounds." },
    { id: "server-side-vapor", name: "Server-Side Swift & Vapor", weight: 15, layerId: "swift-10", description: "Clean Vapor controller routes, request middleware, async handlers, and Codable models." },
    { id: "testing", name: "Async Testing & XCTest", weight: 15, layerId: "swift-8", description: "Thorough async unit testing coverage utilizing protocol mocks and Swift Testing assertions." },
    { id: "package-spm", name: "SPM & Ecosystem", weight: 15, layerId: "swift-7", description: "Clean Package.swift setup, modular targets, and automated CI test execution." },
  ],

  twistPool: [
    { id: "custom-macro", text: "Add a custom Swift Attached Macro that automatically generates JSON validation methods for request DTOs." },
    { id: "actor-rate-limiter", text: "Implement an Actor-based sliding window rate-limiter protecting incoming API endpoint traffic." },
    { id: "event-stream", text: "Expose an AsyncStream endpoint streaming real-time status notifications to connected clients." },
    { id: "fluent-migration", text: "Integrate Fluent ORM with SQLite database migrations for persistent task history storage." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — C track (c), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "c",
  categoryId: "languages",
  slug: "c-networked-key-value-store",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Process Concurrent In-Memory Cache & Storage Server",
  summary:
    "Build a low-level concurrent network cache server in POSIX C. " +
    "You will implement custom dynamic dynamic array and hash table data structures, manage memory strictly via malloc/free, " +
    "handle multi-process process fork/exec calls, manage sockets with non-blocking I/O, and build automated Makefile targets.",
  stack: ["C11", "GCC / Clang", "POSIX Threads / Sockets", "Valgrind", "Make / CMake"],

  requirements: [
    { id: "makefile", text: "Project includes a Makefile or CMakeLists.txt with rules compiling with -Wall -Wextra flags.", check: { type: "file", glob: ["Makefile", "CMakeLists.txt"] } },
    { id: "manual-memory", text: "All dynamic allocations strictly managed with malloc/calloc/realloc/free; zero memory leaks reported by Valgrind." },
    { id: "custom-hashtable", text: "Implement a custom dynamic Hash Table with collision resolution (chaining or open addressing) using structs and function pointers." },
    { id: "string-manipulation", text: "Safe string parsing and buffer bounds checking using standard library functions without buffer overflows." },
    { id: "file-persistence", text: "Implement binary or text snapshot persistence using fopen, fwrite, and fread with complete error handling." },
    { id: "systems-sockets", text: "Implement a POSIX TCP socket server handling client requests via non-blocking sockets or fork worker processes." },
    { id: "signals-process", text: "Handle process termination signals (SIGINT, SIGTERM) gracefully to flush cache snapshots and clean up allocated memory." },
    { id: "tests", text: "C unit test suite covering dynamic data structures and command parser logic.", check: { type: "file", glob: "**/*.c" } },
    { id: "readme", text: "README documents compilation steps, socket protocols, memory verification commands, and Valgrind execution.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI compiles C project on Linux with GCC and executes test suite.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "memory-pointers", name: "Pointers & Memory Management", weight: 25, layerId: "c-2", description: "Zero memory leaks or dangling pointers verified via Valgrind memcheck; disciplined manual memory management." },
    { id: "systems-sockets", name: "Systems Programming & Sockets", weight: 20, layerId: "c-9", description: "Proper process controls (fork/exec/waitpid), signal handling, and robust TCP socket communication." },
    { id: "data-structures", name: "Dynamic Data Structures", weight: 15, layerId: "c-8", description: "Flawless implementation of pointers, dynamic memory arrays, and chaining hash tables." },
    { id: "c-stdlib-io", name: "Standard Library & File I/O", weight: 15, layerId: "c-5", description: "Robust file reading/writing, robust string manipulation, and error checking with errno." },
    { id: "build-debug", name: "Makefiles & Debugging", weight: 15, layerId: "c-7", description: "Clean build targets in Makefile/CMake, disciplined compiler warning flags, and debugging capabilities." },
    { id: "docs-testing", name: "Documentation & Testing", weight: 10, layerId: "c-6", description: "Clear modular design splitting .c and .h files, comprehensive test runner, and usage docs." },
  ],

  twistPool: [
    { id: "lru-eviction", text: "Implement LRU (Least Recently Used) cache eviction using a doubly linked list combined with the hash table." },
    { id: "epoll-multiplexing", text: "Refactor socket connection handling to use epoll / select I/O multiplexing instead of multi-processing." },
    { id: "shared-memory", text: "Implement shared memory buffers using mmap / shm_open to share cached data across fork child processes." },
    { id: "binary-protocol", text: "Implement a compact custom binary serialization wire format for client requests instead of plain text." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Kotlin track (kotlin), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "kotlin",
  categoryId: "languages",
  slug: "kotlin-ktor-reactive-backend",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Asynchronous Coroutine-Driven Ktor Web API",
  summary:
    "Build a production-ready asynchronous web service in Kotlin using Ktor framework. " +
    "You will harness Kotlin Coroutines and Flows for non-blocking execution, exploit extension functions and scope operators, " +
    "enforce strict null-safety, and manage dependency injection with Koin.",
  stack: ["Kotlin 1.9+", "Ktor", "Kotlin Coroutines", "Koin", "MockK"],

  requirements: [
    { id: "build-gradle", text: "Project uses Gradle with Kotlin DSL build script.", check: { type: "file", glob: "build.gradle.kts" } },
    { id: "null-safety", text: "Leverage Kotlin nullability features (safe calls, Elvis operator, smart casts) without forcing non-null assertion (!!) calls." },
    { id: "sealed-classes", text: "Model API responses and state hierarchies using Sealed Classes and Data Classes with destructuring." },
    { id: "scope-functions", text: "Use scope functions (let, run, with, apply, also) idiomaticaly across domain services." },
    { id: "coroutines-flow", text: "Implement asynchronous service calls using suspend functions, CoroutineScope, and reactive Flows." },
    { id: "extension-dsl", text: "Build custom domain extensions and higher-order builder DSL functions with dynamic receiver Lambdas." },
    { id: "ktor-koin", text: "Configure Ktor web server routes, JSON serialization, and Koin dependency injection modules." },
    { id: "kotlin-test", text: "Unit and coroutine test suites written with JUnit 5, MockK, and runTest coroutine testing harnesses.", check: { type: "file", glob: "src/test/**/*.kt" } },
    { id: "readme", text: "README explains setup instructions, routing structure, coroutine design choices, and test suite execution.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI pipeline builds project with Gradle and runs tests on JDK 17+.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "coroutines-async", name: "Coroutines & Structured Concurrency", weight: 25, layerId: "kotlin-6", description: "Proper usage of suspend functions, coroutine dispatchers, cancellation, and reactive Flow streams." },
    { id: "null-type-system", name: "Null Safety & Type System", weight: 15, layerId: "kotlin-2", description: "Clean usage of nullability tools, Elvis operator, smart casts, and complete avoidance of explicit !! casts." },
    { id: "ktor-di", name: "Ktor & Ecosystem Integration", weight: 15, layerId: "kotlin-10", description: "Effective Ktor plugin routing, kotlinx.serialization, and structured Koin dependency injection." },
    { id: "extensions-dsl", name: "Extensions & DSL Idioms", weight: 15, layerId: "kotlin-5", description: "Clean extension functions, infix notation, and intuitive lambda-with-receiver DSL patterns." },
    { id: "oop-functional", name: "OOP, Collections & Lambdas", weight: 15, layerId: "kotlin-4", description: "Effective collection pipelines (map, filter, flatMap), scope functions, and data class structures." },
    { id: "testing", name: "Testing with MockK & Coroutines", weight: 15, layerId: "kotlin-7", description: "Comprehensive test suite testing suspend functions reliably using runTest and MockK." },
  ],

  twistPool: [
    { id: "websocket-feed", text: "Add a real-time WebSocket route streaming live metric updates using Kotlin Coroutine Channels/Flows." },
    { id: "custom-plugin", text: "Implement a custom Ktor application feature plugin for request execution timing and header logging." },
    { id: "circuit-breaker", text: "Implement a coroutine-based Circuit Breaker state machine protecting external outgoing HTTP integration calls." },
    { id: "cache-delegate", text: "Create a property delegate storing dynamic computed properties in an expiring memory cache." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Kotlin track (kotlin), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "kotlin",
  categoryId: "languages",
  slug: "kotlin-ktor-reactive-backend",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Asynchronous Coroutine-Driven Ktor Web API",
  summary:
    "Build a production-ready asynchronous web service in Kotlin using Ktor framework. " +
    "You will harness Kotlin Coroutines and Flows for non-blocking execution, exploit extension functions and scope operators, " +
    "enforce strict null-safety, and manage dependency injection with Koin.",
  stack: ["Kotlin 1.9+", "Ktor", "Kotlin Coroutines", "Koin", "MockK"],

  requirements: [
    { id: "build-gradle", text: "Project uses Gradle with Kotlin DSL build script.", check: { type: "file", glob: "build.gradle.kts" } },
    { id: "null-safety", text: "Leverage Kotlin nullability features (safe calls, Elvis operator, smart casts) without forcing non-null assertion (!!) calls." },
    { id: "sealed-classes", text: "Model API responses and state hierarchies using Sealed Classes and Data Classes with destructuring." },
    { id: "scope-functions", text: "Use scope functions (let, run, with, apply, also) idiomaticaly across domain services." },
    { id: "coroutines-flow", text: "Implement asynchronous service calls using suspend functions, CoroutineScope, and reactive Flows." },
    { id: "extension-dsl", text: "Build custom domain extensions and higher-order builder DSL functions with dynamic receiver Lambdas." },
    { id: "ktor-koin", text: "Configure Ktor web server routes, JSON serialization, and Koin dependency injection modules." },
    { id: "kotlin-test", text: "Unit and coroutine test suites written with JUnit 5, MockK, and runTest coroutine testing harnesses.", check: { type: "file", glob: "src/test/**/*.kt" } },
    { id: "readme", text: "README explains setup instructions, routing structure, coroutine design choices, and test suite execution.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI pipeline builds project with Gradle and runs tests on JDK 17+.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "coroutines-async", name: "Coroutines & Structured Concurrency", weight: 25, layerId: "kotlin-6", description: "Proper usage of suspend functions, coroutine dispatchers, cancellation, and reactive Flow streams." },
    { id: "null-type-system", name: "Null Safety & Type System", weight: 15, layerId: "kotlin-2", description: "Clean usage of nullability tools, Elvis operator, smart casts, and complete avoidance of explicit !! casts." },
    { id: "ktor-di", name: "Ktor & Ecosystem Integration", weight: 15, layerId: "kotlin-10", description: "Effective Ktor plugin routing, kotlinx.serialization, and structured Koin dependency injection." },
    { id: "extensions-dsl", name: "Extensions & DSL Idioms", weight: 15, layerId: "kotlin-5", description: "Clean extension functions, infix notation, and intuitive lambda-with-receiver DSL patterns." },
    { id: "oop-functional", name: "OOP, Collections & Lambdas", weight: 15, layerId: "kotlin-4", description: "Effective collection pipelines (map, filter, flatMap), scope functions, and data class structures." },
    { id: "testing", name: "Testing with MockK & Coroutines", weight: 15, layerId: "kotlin-7", description: "Comprehensive test suite testing suspend functions reliably using runTest and MockK." },
  ],

  twistPool: [
    { id: "websocket-feed", text: "Add a real-time WebSocket route streaming live metric updates using Kotlin Coroutine Channels/Flows." },
    { id: "custom-plugin", text: "Implement a custom Ktor application feature plugin for request execution timing and header logging." },
    { id: "circuit-breaker", text: "Implement a coroutine-based Circuit Breaker state machine protecting external outgoing HTTP integration calls." },
    { id: "cache-delegate", text: "Create a property delegate storing dynamic computed properties in an expiring memory cache." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — PHP track (php), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "php",
  categoryId: "languages",
  slug: "php-restful-framework-core",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Modern PSR-Compliant REST API & Database Gateway",
  summary:
    "Build a lightweight, production-ready RESTful API service engine in modern PHP 8+. " +
    "You will implement PSR-4 autoloading with Composer, abstract database access using PDO with prepared statements, " +
    "enforce output escaping and password security, adopt PSR coding standards, and build background queue execution.",
  stack: ["PHP 8.2+", "Composer", "PDO / SQLite", "PHPUnit", "Docker"],

  requirements: [
    { id: "composer-setup", text: "Project uses Composer for dependency management and PSR-4 autoloading configuration.", check: { type: "file", glob: "composer.json" } },
    { id: "php8-syntax", text: "Utilize PHP 8 features including named arguments, union/intersection types, match expressions, and nullsafe operators." },
    { id: "pdo-gateway", text: "Database operations use PDO with prepared statements and parameter binding; raw string concatenation in SQL is strictly prohibited." },
    { id: "oop-traits", text: "Structure business logic using clean classes, interfaces, dynamic abstract methods, and shared traits." },
    { id: "psr-standards", text: "Follow PSR-12 coding guidelines and integrate a PSR-3 compatible logging wrapper." },
    { id: "security-basics", text: "Protect endpoints against XSS with output escaping, enforce CSRF protection where applicable, and hash passwords using bcrypt." },
    { id: "queue-worker", text: "Implement a background job processing queue leveraging database tables or lightweight Redis storage." },
    { id: "docker-fpm", text: "Provide Docker Compose configuration setting up PHP-FPM and Nginx environments.", check: CHECKS.compose },
    { id: "phpunit-tests", text: "PHPUnit test suite covering API response endpoints, data serialization, and authentication logic.", check: { type: "file", glob: "tests/**/*Test.php" } },
    { id: "readme", text: "README details Composer installation steps, environment settings, and test commands.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI workflow runs PHPUnit test suites on every pull request.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "php8-modern", name: "Modern PHP 8 Features", weight: 20, layerId: "php-8", description: "Effective usage of named arguments, typed properties, match expressions, and nullsafe navigation." },
    { id: "pdo-database", name: "PDO & Data Persistence", weight: 20, layerId: "php-5", description: "Secure database interactions using PDO prepared statements, parameter binding, and transactions." },
    { id: "security", name: "Security & Hashing", weight: 15, layerId: "php-9", description: "Proper password hashing via bcrypt, sanitization, XSS mitigation, and safe header usage." },
    { id: "architecture-psr", name: "PSR Standards & OOP", weight: 15, layerId: "php-6", description: "Adherence to PSR-4, PSR-12, PSR-3 standards, clean OOP abstractions, and traits usage." },
    { id: "testing", name: "PHPUnit Testing", weight: 15, layerId: "php-7", description: "Comprehensive PHPUnit tests using test doubles, assertions, and data providers." },
    { id: "ops-queues", name: "Queues & Docker Operations", weight: 15, layerId: "php-10", description: "Working background queue worker architecture, clean Docker containerization, and setup docs." },
  ],

  twistPool: [
    { id: "jwt-auth", text: "Implement JWT (JSON Web Token) authentication middleware with token revocation capabilities." },
    { id: "rate-limiter", text: "Add client rate-limiting middleware using IP address throttling stored in dynamic storage." },
    { id: "middleware-pipeline", text: "Implement a customizable PSR-7/PSR-15 style HTTP middleware pipeline for requests and responses." },
    { id: "content-negotiation", text: "Support automatic content negotiation output formatting JSON or XML based on the Accept header." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Ruby track (ruby), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "ruby",
  categoryId: "languages",
  slug: "ruby-background-job-processor",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Threaded Background Job Processing Library",
  summary:
    "Build an in-memory multi-threaded background job queue engine in idiomatic Ruby. " +
    "You will design custom DSLs using metaprogramming, build thread-safe worker pools, handle exceptions with retry policies, " +
    "and package the engine as a clean Ruby Gem with a comprehensive RSpec test suite.",
  stack: ["Ruby 3.2+", "RSpec", "Bundler", "Gemspec"],

  requirements: [
    { id: "gem-structure", text: "Project formatted as a valid Ruby Gem with a working .gemspec file.", check: { type: "file", glob: "**/*.gemspec" } },
    { id: "enumerable-collections", text: "Process job queues using advanced Enumerable methods (map, select, reduce) and yield custom blocks." },
    { id: "blocks-procs", text: "Accept job payloads as blocks, Procs, or Lambdas with dynamic parameter binding." },
    { id: "class-mixins", text: "Provide job capabilities via module mixins (include/extend) with custom class macros." },
    { id: "metaprogramming-dsl", text: "Implement a clean worker DSL using dynamic method evaluation (class_eval/instance_eval or define_method)." },
    { id: "concurrency-safety", text: "Process jobs concurrently across threads using Mutex synchronization to guarantee queue safety." },
    { id: "exception-handling", text: "Rescue job execution exceptions with configurable retry limits and backoff handling." },
    { id: "rspec-tests", text: "Comprehensive RSpec test suite with describe/it blocks testing job enqueueing and execution.", check: { type: "file", glob: "**/*_spec.rb" } },
    { id: "readme", text: "README documents DSL usage, gem setup, thread safety, and test commands.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI runs bundle exec rspec on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "dsl-metaprogramming", name: "Metaprogramming & DSL", weight: 25, layerId: "ruby-9", description: "Elegantly designed DSL using instance_eval, dynamic methods, and class macros without brittle hacks." },
    { id: "concurrency", name: "Concurrency & Thread Safety", weight: 15, layerId: "ruby-10", description: "Safe multi-threaded worker queue execution using Mutex or Thread abstractions." },
    { id: "blocks-enumerables", name: "Blocks, Procs & Enumerables", weight: 15, layerId: "ruby-3", description: "Mastery of blocks, yield syntax, Procs, Lambdas, and Enumerable composition." },
    { id: "oop-mixins", name: "OOP & Module Mixins", weight: 15, layerId: "ruby-4", description: "Clean class architecture using module mixins, access control, and clear encapsulation." },
    { id: "rspec-testing", name: "RSpec Testing", weight: 15, layerId: "ruby-8", description: "Thorough spec coverage utilizing matchers, before hooks, and let blocks." },
    { id: "packaging-gems", name: "Gems & Tooling", weight: 15, layerId: "ruby-7", description: "Proper Gemfile/gemspec setup, semantic versioning, and working CI automation." },
  ],

  twistPool: [
    { id: "cron-scheduler", text: "Add recurrent job scheduling support parsing simple cron expressions to enqueue jobs periodically." },
    { id: "job-middleware", text: "Implement a middleware pipeline mechanism allowing custom wrapper blocks around job execution." },
    { id: "rate-limiter", text: "Add worker concurrency rate-limiting based on maximum execution counters per queue." },
    { id: "web-dashboard", text: "Build a tiny Rack application endpoint displaying queue statistics and active thread status." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — C# track (csharp), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "csharp",
  categoryId: "languages",
  slug: "csharp-async-event-bus",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Throughput Async In-Memory Messaging Bus",
  summary:
    "Build a production-grade asynchronous in-memory pub/sub message broker in modern C# / .NET 8+. " +
    "You will implement async pipelines with System.Threading.Channels, Dependency Injection patterns, " +
    "advanced LINQ processing, modern records, and strict nullable reference type safety.",
  stack: [".NET 8+", "C# 12", "System.Threading.Channels", "xUnit", "Moq"],

  requirements: [
    { id: "project-file", text: "Project contains a valid .csproj file targeting modern .NET.", check: { type: "file", glob: "**/*.csproj" } },
    { id: "async-channels", text: "Implement message publishing and consuming using System.Threading.Channels with backpressure support." },
    { id: "dependency-injection", text: "Configure service registration with IServiceCollection supporting transient, scoped, and singleton lifetimes." },
    { id: "linq-expressions", text: "Implement dynamic message filtering and aggregation using LINQ queries and record types." },
    { id: "cancellation-tokens", text: "Pass CancellationToken parameters across all async execution signatures to support graceful shutdown." },
    { id: "nullable-safety", text: "Enable strict Nullable Reference Types with zero unhandled null reference warnings." },
    { id: "error-handling", text: "Implement custom exception types managed cleanly using try/catch/finally and IDisposable cleanup blocks." },
    { id: "xunit-tests", text: "xUnit test suite with Moq covering async channel processing and message subscription logic.", check: { type: "file", glob: "**/*.Tests*/*.cs" } },
    { id: "readme", text: "README covers architecture layout, setup guide, dotnet test execution, and channel configuration.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI pipeline compiles solution with dotnet build and runs xUnit tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "async-concurrency", name: "Async/Await & Channels", weight: 25, layerId: "csharp-5", description: "Non-blocking async pipelines built with Channels, Task APIs, and proper CancellationToken cancellation." },
    { id: "di-architecture", name: "Architecture & DI", weight: 15, layerId: "csharp-7", description: "Clean interface abstractions, repository pattern, and correct service lifetime registrations." },
    { id: "modern-csharp", name: "Modern C# & Safety", weight: 15, layerId: "csharp-9", description: "Strict Nullable Reference Type safety, modern Records, and high-performance Span/Memory usage where appropriate." },
    { id: "linq-functional", name: "LINQ & Functional Patterns", weight: 15, layerId: "csharp-6", description: "Advanced LINQ grouping, aggregation, and immutable object patterns." },
    { id: "testing", name: "xUnit & Moq Testing", weight: 15, layerId: "csharp-8", description: "Thorough unit tests with facts/theories and isolated mock verifications." },
    { id: "operability-tooling", name: "Ecosystem & Tooling", weight: 15, layerId: "csharp-10", description: "Clean .NET project structure, solution setup, and working CI automation." },
  ],

  twistPool: [
    { id: "dead-letter-queue", text: "Add a Dead Letter Queue (DLQ) channel to capture and inspect messages after max retry failures." },
    { id: "scheduled-messages", text: "Support delayed message publishing where messages become visible to consumers after a set TimeSpan." },
    { id: "message-deduplication", text: "Implement an sliding-window deduplication filter that discards identical message IDs within a time window." },
    { id: "benchmarks", text: "Integrate BenchmarkDotNet micro-benchmarks comparing channel throughput under varying worker pool sizes." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — C++ track (cpp), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "cpp",
  categoryId: "languages",
  slug: "cpp-high-performance-event-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Performance In-Memory Event Processing Engine",
  summary:
    "Build a modern C++20/23 multi-threaded in-memory event dispatching engine. " +
    "You will implement lock-free or fine-grained thread synchronization, smart pointer memory management, " +
    "STL algorithms with ranges, modern RAII resource encapsulation, and CMake build configuration.",
  stack: ["C++20/23", "CMake", "std::thread / std::atomic", "AddressSanitizer"],

  requirements: [
    { id: "cmake-build", text: "Project configured with modern CMake setup defining targets, compile flags, and include paths.", check: { type: "file", glob: "{CMakeLists.txt,**/CMakeLists.txt}" } },
    { id: "raii-management", text: "All system resources (threads, sockets, files) strictly encapsulated via RAII and move semantics." },
    { id: "smart-pointers", text: "Zero explicit new/delete operators; memory allocated strictly using std::unique_ptr, std::shared_ptr, and std::make_unique." },
    { id: "stl-ranges", text: "Process event sequences using modern C++ STL algorithms, std::optional, std::variant, and ranges." },
    { id: "templates-generics", text: "Implement generic event dispatch queues using C++ class and function templates with variadic expansion." },
    { id: "concurrency", text: "Manage worker processing threads safely using std::mutex, std::condition_variable, or std::atomic flags." },
    { id: "sanitizer-clean", text: "Code must compile with -Wall -Wextra and execute clean of memory errors under AddressSanitizer (ASan)." },
    { id: "tests", text: "Unit test suite exercises event pipeline execution and thread safety.", check: { type: "file", glob: "**/*.{cpp,cc,cxx}" } },
    { id: "readme", text: "README details CMake build commands, thread design, and profiling instructions.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI compiles project with CMake and runs test suites on Linux.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "modern-memory", name: "RAII & Smart Pointers", weight: 20, layerId: "cpp-6", description: "Flawless ownership semantics using smart pointers with explicit zero-leak RAII wrappers." },
    { id: "concurrency", name: "C++ Threading & Concurrency", weight: 20, layerId: "cpp-8", description: "Safe multi-threaded pipeline using mutexes, condition variables, and atomic operations without deadlocks." },
    { id: "classes-move-semantics", name: "Classes, OOP & Move Semantics", weight: 15, layerId: "cpp-3", description: "Clean move constructors, assignment operators, and RAII class encapsulations." },
    { id: "stl-modern-features", name: "STL, Lambdas & Ranges", weight: 15, layerId: "cpp-7", description: "Idiomatic modern C++ usage including ranges, structured bindings, std::optional, and lambdas." },
    { id: "templates", name: "Templates & Generics", weight: 15, layerId: "cpp-5", description: "Clean template abstraction allowing strongly typed event payload handlers." },
    { id: "build-tooling", name: "CMake & Sanitizers", weight: 15, layerId: "cpp-10", description: "Modern CMake targets, clean compiler warnings, ASan validation, and documentation." },
  ],

  twistPool: [
    { id: "lockfree-ringbuffer", text: "Implement a single-producer single-consumer lock-free ring buffer using std::atomic acquire/release semantics." },
    { id: "event-replay", text: "Add event logging and deterministic replay capability to recover system state from binary logs." },
    { id: "custom-allocator", text: "Implement a custom fixed-size memory pool allocator to avoid heap allocation overhead during event burst runs." },
    { id: "batching", text: "Implement dynamic event micro-batching to optimize thread wakeup frequency under high queue pressure." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Java track (java), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "java",
  categoryId: "languages",
  slug: "java-financial-ledger-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Threaded Financial Transaction Processing Engine",
  summary:
    "Build a production-grade multi-threaded financial ledger and audit service in modern Java 21+. " +
    "Process batch transactions using Streams API, modern Java Records, and Sealed Classes while handling concurrent account " +
    "updates safely via ExecutorService thread pools and custom design patterns.",
  stack: ["Java 21", "Maven / Gradle", "JUnit 5", "Mockito"],

  requirements: [
    { id: "build-tool", text: "Project includes Maven pom.xml or Gradle build script.", check: { type: "file", glob: ["pom.xml", "build.gradle", "build.gradle.kts"] } },
    { id: "records-sealed", text: "Model transaction records using modern Java Records and event hierarchies using Sealed Interfaces." },
    { id: "collections-generics", text: "Use generic repository data structures built on Java Collections (Map, Queue, Set)." },
    { id: "streams-lambdas", text: "Analyze transaction data and calculate financial summaries using Streams API and Collectors." },
    { id: "concurrency", text: "Execute parallel transaction audits safely using ExecutorService, Future, and synchronized balance blocks." },
    { id: "design-patterns", text: "Implement the Builder pattern for transaction requests and Factory pattern for processor creation." },
    { id: "custom-exceptions", text: "Implement checked/unchecked domain exception hierarchies managed with try-with-resources file logging." },
    { id: "junit-tests", text: "Comprehensive JUnit 5 unit and parameterized tests covering transaction processing logic.", check: { type: "file", glob: "src/test/**/*.java" } },
    { id: "readme", text: "README details project setup, JVM requirements, execution commands, and pattern documentation.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI workflow compiles and runs tests on JDK 21.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "modern-java", name: "Modern Java Features", weight: 20, layerId: "java-8", description: "Effective usage of Records, Sealed Classes, pattern matching, and modern language syntax." },
    { id: "concurrency", name: "Concurrency & Thread Safety", weight: 20, layerId: "java-6", description: "Safe execution across thread pools with robust lock synchronization and race protection." },
    { id: "streams-collections", name: "Streams & Collections API", weight: 15, layerId: "java-5", description: "Complex stream pipelines, collectors, and appropriate collection type choices." },
    { id: "patterns-oop", name: "Design Patterns & OOP", weight: 15, layerId: "java-7", description: "Clean implementation of Creational and Behavioral patterns in standard Java code." },
    { id: "testing", name: "JUnit 5 & Mockito Tests", weight: 15, layerId: "java-9", description: "Comprehensive parameterized unit tests and mock-based isolated integration tests." },
    { id: "build-packaging", name: "Build & Packaging", weight: 15, layerId: "java-10", description: "Proper Maven/Gradle setup, fat JAR packaging configuration, and CI execution." },
  ],

  twistPool: [
    { id: "virtual-threads", text: "Refactor concurrency execution to use Java 21 Virtual Threads (Loom) for high-concurrency throughput." },
    { id: "audit-observer", text: "Implement an Observer pattern event bus to publish ledger change notifications to multiple listeners." },
    { id: "file-exporter", text: "Add a file export pipeline writing structured ledger statements using NIO files and try-with-resources." },
    { id: "deadlock-detector", text: "Implement an account transfer verification check that detects and prevents potential deadlocks." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Rust track (rust), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "rust",
  categoryId: "languages",
  slug: "rust-kv-storage-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Thread-Safe Persistent Key-Value Storage Engine",
  summary:
    "Build a persistent, thread-safe key-value database engine in Rust. You will model storage structures, " +
    "enforce strict compile-time ownership and borrowing rules, implement custom iterator traits, write robust error types, " +
    "and build multi-threaded async command handling.",
  stack: ["Rust Edition 2021", "Cargo", "thiserror", "Tokio / Async"],

  requirements: [
    { id: "cargo-manifest", text: "Repository contains a valid Cargo.toml manifest file.", check: CHECKS.cargo },
    { id: "ownership-borrowing", text: "Storage reader/writer API enforces strict compile-time ownership and borrowing guarantees." },
    { id: "structs-enums", text: "Model commands and database entries using Rust enums with rich payload data and dynamic matching." },
    { id: "custom-iterator", text: "Implement the Iterator trait for key range scanning over database entries." },
    { id: "trait-generics", text: "Define storage backend traits to decouple memory storage from file disk storage." },
    { id: "error-handling", text: "Define custom error types using the thiserror crate and propagate failures with the ? operator." },
    { id: "concurrency", text: "Share state safely across thread and async task boundaries using Arc, Mutex/RwLock, or mpsc channels." },
    { id: "integration-tests", text: "Include integration test suites under the tests/ directory testing persistence and concurrent access.", check: { type: "file", glob: "tests/**/*.rs" } },
    { id: "readme", text: "README documents memory safety guarantees, benchmark instructions, and usage setup.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow executes cargo test, cargo clippy, and cargo fmt checks.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "ownership-lifetimes", name: "Ownership, Borrowing & Lifetimes", weight: 25, layerId: "rust-2", description: "Clean borrowing and lifetime mechanics without superfluous clones or unsafe hacks." },
    { id: "error-handling", name: "Error Systems & Propagation", weight: 15, layerId: "rust-6", description: "Idiomatic error handling using custom types, thiserror, and the ? operator." },
    { id: "traits-generics", name: "Traits & Generic Abstractions", weight: 15, layerId: "rust-5", description: "Elegantly designed traits and generics with clean bounds for storage drivers." },
    { id: "concurrency-async", name: "Concurrency & Async Rust", weight: 15, layerId: "rust-9", description: "Safe multi-threaded data sharing using Arc/Mutex and async runtime integration." },
    { id: "structs-enums-iters", name: "Types & Iterators", weight: 15, layerId: "rust-4", description: "Effective use of Enums, Option/Result pattern matching, and Iterator implementations." },
    { id: "testing-ecosystem", name: "Testing & Code Quality", weight: 15, layerId: "rust-10", description: "Thorough unit/integration tests, zero clippy warnings, and clean project structure." },
  ],

  twistPool: [
    { id: "wal-compaction", text: "Implement a log-structured append file with background log compaction to clean up stale key updates." },
    { id: "in-memory-lru", text: "Add an LRU cache layer around the persistent file engine using Rc/RefCell or Box smart pointers." },
    { id: "transactions", text: "Support atomic multi-key read-write transaction sessions with rollback capabilities upon error." },
    { id: "snapshots", text: "Provide a point-in-time snapshot export function that yields consistent point-in-time database views." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Go track (go), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "go",
  categoryId: "languages",
  slug: "go-concurrent-job-scheduler",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Throughput Concurrent Task Queue & Worker Pool Engine",
  summary:
    "Build a production-ready concurrent job execution engine in Go. The system handles task submission, " +
    "worker pool management, channel-based pipeline processing, graceful shutdown via context cancellation, " +
    "and real-time HTTP metrics monitoring using only standard Go library constructs.",
  stack: ["Go 1.22+", "net/http", "Goroutines & Channels", "sync/context"],

  requirements: [
    { id: "go-mod", text: "Project initialized with a valid go.mod file.", check: CHECKS.goModule },
    { id: "worker-pool", text: "Implement a configurable worker pool using goroutines and buffered channels for job dispatching." },
    { id: "interface-design", text: "Define clear interface contracts for job processors and custom error handlers." },
    { id: "context-cancellation", text: "Propagate context timeouts and cancellation signals across all active worker goroutines." },
    { id: "error-wrapping", text: "Implement custom error types using fmt.Errorf with %w, errors.Is, and errors.As for error classification." },
    { id: "http-metrics", text: "Expose HTTP endpoints using net/http to submit jobs, query status, and view metrics encoded as JSON." },
    { id: "generics-queue", text: "Implement a generic thread-safe queue data structure using Go generics and sync.RWMutex." },
    { id: "tests", text: "Table-driven unit tests cover worker pool lifecycle and concurrency edge cases.", check: CHECKS.goTests },
    { id: "readme", text: "README covers architecture layout, API usage, benchmark results, and run commands.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI workflow compiles code and executes go test -race on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "concurrency", name: "Goroutines & Channels", weight: 25, layerId: "go-5", description: "Correct channel synchronization, worker pool lifecycle, and zero race condition flags." },
    { id: "error-handling", name: "Error Architecture", weight: 15, layerId: "go-4", description: "Idiomatic error handling with custom wrapping, inspection, and error unwrapping." },
    { id: "interfaces", name: "Interface & Struct Design", weight: 15, layerId: "go-3", description: "Clean composition using struct embedding and small, focused interface abstractions." },
    { id: "generics-context", name: "Generics & Context", weight: 15, layerId: "go-9", description: "Proper context propagation and elegant generic data structure implementation." },
    { id: "testing", name: "Table-Driven Tests", weight: 15, layerId: "go-7", description: "Thorough table-driven unit tests with concurrency race testing enabled." },
    { id: "stdlib-operability", name: "Standard Library & Ops", weight: 15, layerId: "go-6", description: "Effective use of net/http, encoding/json, and clean go.mod module management." },
  ],

  twistPool: [
    { id: "priority-scheduling", text: "Add priority queue support where high-priority jobs jump ahead of low-priority tasks in worker channels." },
    { id: "persistent-wal", text: "Implement a simple write-ahead log file on disk to recover pending jobs across process restarts." },
    { id: "embedded-ui", text: "Embed static HTML/JS dashboard assets into the Go binary using go:embed for web metric visualizer." },
    { id: "pprof-profiling", text: "Expose pprof HTTP diagnostic endpoints and document memory/goroutine leak analysis." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — JavaScript track (javascript), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "javascript",
  categoryId: "languages",
  slug: "javascript-event-driven-dashboard",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Vanilla JS In-Browser Real-Time Analytics Engine",
  summary:
    "Build a framework-free browser dashboard for real-time data streaming and event analysis. " +
    "You will craft custom Web Components or class-based UI widgets, manage dynamic DOM updates without memory leaks, " +
    "implement asynchronous event emitters, and encapsulate state with closures.",
  stack: ["Vanilla JS (ES2022+)", "Browser APIs", "Node.js (for test runner)", "Jest/Vitest"],

  requirements: [
    { id: "state-management", text: "Implement an asynchronous central store using functional pub/sub pattern and immutable state updates." },
    { id: "dom-widgets", text: "Create modular dynamic UI widgets rendered purely via native DOM API manipulation and template fragments." },
    { id: "event-delegation", text: "Use event delegation on container elements to handle dynamic widget actions and interactions." },
    { id: "async-stream", text: "Stream mock metrics using Promises and async iterators/generators with abort signal support." },
    { id: "custom-errors", text: "Implement custom Error classes for network timeouts, schema validation, and rendering failures." },
    { id: "package-json", text: "Repository must contain a standard package.json file with run scripts.", check: { type: "file", glob: "package.json" } },
    { id: "tests", text: "Unit tests cover store logic, functional helpers, and event processing.", check: CHECKS.jsTests },
    { id: "readme", text: "README documents architecture, DOM delegation strategy, and setup commands.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow validates code linting and runs test suites on every pull request.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "async-patterns", name: "Async Control & Streams", weight: 20, layerId: "javascript-4", description: "Demonstrates mastery of Promises, async/await, and event stream pipelines without race conditions." },
    { id: "dom-browser", name: "DOM & Browser APIs", weight: 20, layerId: "javascript-5", description: "Efficient DOM manipulation using fragments, delegation, and clean element lifecycle management." },
    { id: "functional-patterns", name: "FP & Scope Isolation", weight: 15, layerId: "javascript-9", description: "Effective use of closures, pure functions, immutability, and higher-order composition." },
    { id: "error-handling", name: "Error Handling & Debugging", weight: 15, layerId: "javascript-8", description: "Proper usage of custom errors, try/catch traps, and asynchronous boundary protection." },
    { id: "oop-prototypes", name: "Class & Component Design", weight: 15, layerId: "javascript-3", description: "Clean class or factory patterns for widget UI entities with proper encapsulation." },
    { id: "docs-testing", name: "Testing & Documentation", weight: 15, layerId: "javascript-7", description: "Clear README setup instructions, proper NPM scripts, and passing test suite." },
  ],

  twistPool: [
    { id: "undo-redo", text: "Add state history support allowing users to undo and redo state actions using immutable snapshots." },
    { id: "offline-persistence", text: "Persist incoming stream data in IndexedDB/LocalStorage and sync back on reconnect events." },
    { id: "custom-virtual-list", text: "Build a light virtual scrolling list in vanilla JS to render thousands of streaming log events smoothly." },
    { id: "theme-engine", text: "Add a dynamic CSS custom property theme switcher using JS object descriptors and theme state persistence." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — TypeScript track (typescript), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "typescript",
  categoryId: "languages",
  slug: "typescript-type-safe-orm",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Type-Safe In-Memory Query Builder & ORM Core",
  summary:
    "Build a lightweight, strictly typed query builder and in-memory repository layer in TypeScript. " +
    "Leverage advanced mapped types, conditional types, template literals, and generics to ensure total compile-time " +
    "type safety for schema definitions, filtering, select projections, and query executions.",
  stack: ["TypeScript 5+", "Node.js", "Vitest", "tsconfig"],

  requirements: [
    { id: "schema-inference", text: "Infer model interfaces directly from schema field definitions using generic parameters and interfaces." },
    { id: "query-builder", text: "Construct a chainable query builder supporting typed select, where filtering, order, and limit methods." },
    { id: "type-narrowing", text: "Implement dynamic type guards and assertions to validate user input against defined entity types." },
    { id: "result-monad", text: "Return execution outputs using a type-safe Result<T, E> monad rather than throwing plain errors." },
    { id: "advanced-types", text: "Utilize mapped types, conditional infer types, and template literals for query property selection." },
    { id: "tsconfig", text: "Include strict tsconfig.json with explicit strict mode and module resolution flags enabled.", check: { type: "file", glob: "tsconfig.json" } },
    { id: "type-tests", text: "Provide type-level assertion unit tests validating that invalid query options trigger TypeScript compilation errors.", check: CHECKS.jsTests },
    { id: "readme", text: "README includes detailed API usage examples, type design choices, and build instructions.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow checks type compilation (tsc --noEmit) and runs test suites on every commit.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "advanced-type-system", name: "Type System Engineering", weight: 25, layerId: "typescript-6", description: "Effective usage of mapped types, conditional types, template literals, and infer keywords." },
    { id: "generics-design", name: "Generic Constraints & Inference", weight: 20, layerId: "typescript-4", description: "Design of reusable generic interfaces and functions that infer return shapes dynamically." },
    { id: "type-narrowing", name: "Narrowing & Safety", weight: 15, layerId: "typescript-3", description: "Proper deployment of custom type guards, discriminating unions, and safe runtime conversion." },
    { id: "async-error-patterns", name: "Async & Result Patterns", weight: 15, layerId: "typescript-8", description: "Clean async flow with strict typed error handling via Result/Option abstractions." },
    { id: "testing", name: "Type & Unit Testing", weight: 15, layerId: "typescript-9", description: "Tests verify runtime logic and validate compile-time type errors." },
    { id: "configuration", name: "Tooling & Config", weight: 10, layerId: "typescript-7", description: "Strict compiler settings, module exporting, and complete setup docs." },
  ],

  twistPool: [
    { id: "relation-joins", text: "Add support for 1-to-many relationship declarations and type-safe query inner join selections." },
    { id: "migrations", text: "Implement a typed schema diffing engine that computes required migration actions between two schemas." },
    { id: "event-hooks", text: "Add type-safe lifecycle hooks (beforeSave, afterUpdate) with event payload types derived from the entity schema." },
    { id: "validation-decorator", text: "Add field-level validation decorators using TS decorators to validate entity constraints at runtime." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Python track (python), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "python",
  categoryId: "languages",
  slug: "python-async-task-runner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Async Task Execution Engine & Dependency Pipeline",
  summary:
    "Build a robust asynchronous task execution engine in pure Python. The engine parses task dependency " +
    "graphs, manages concurrent execution using asyncio and worker threads, handles retries with backoff, " +
    "and streams execution state back to a CLI client.",
  stack: ["Python 3.11+", "asyncio", "pytest", "mypy"],

  requirements: [
    { id: "task-graph", text: "Parse and validate task definitions with dependency resolution using topological sorting; cycle detection must raise a custom exception." },
    { id: "execution-engine", text: "Execute independent tasks concurrently using asyncio tasks and thread worker pools for blocking I/O bound jobs." },
    { id: "retry-backoff", text: "Support configurable task retry limits with exponential backoff and jitter upon task failure." },
    { id: "context-manager", text: "Provide custom context managers for execution state, logging timing, resource allocation, and dynamic cleanup." },
    { id: "custom-generators", text: "Implement custom iterators/generators to yield real-time task status events during execution runs." },
    { id: "type-hints", text: "All public modules must pass strict static type analysis using mypy annotations, Generics, and Protocols." },
    { id: "pyproject", text: "Project uses standard packaging configuration with pyproject.toml.", check: { type: "file", glob: "pyproject.toml" } },
    { id: "tests", text: "Unit and integration tests written in pytest cover async execution, cycle failures, and retry behavior.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README provides architecture details, setup guide, and test execution instructions.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions CI pipeline runs pytest and mypy on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness & Concurrency", weight: 25, layerId: "python-8", description: "Does the engine correctly schedule task graphs concurrently without deadlocks, handling async tasks properly?" },
    { id: "architecture", name: "OOP & Protocols", weight: 15, layerId: "python-3", description: "Clean class structure, proper use of dunder methods, properties, and protocol types." },
    { id: "error-handling", name: "Error & Flow Control", weight: 15, layerId: "python-5", description: "Custom exception hierarchies and robust context management for execution resources." },
    { id: "type-safety", name: "Type System Usage", weight: 15, layerId: "python-9", description: "Comprehensive type annotations, correct use of Generics/Protocols, and clean mypy checks." },
    { id: "tests", name: "Testing Quality", weight: 15, layerId: "python-7", description: "Comprehensive pytest suite using fixtures, parametrization, and async test coverage." },
    { id: "docs-ops", name: "Packaging & Operability", weight: 15, layerId: "python-10", description: "Proper pyproject packaging setup, clear usage instructions, and working CI automation." },
  ],

  twistPool: [
    { id: "dynamic-caching", text: "Add task output caching using functools or custom persistent cache so duplicate inputs reuse prior run outputs." },
    { id: "rate-limiting", text: "Implement token-bucket rate limiting per task tag to throttle concurrent execution of resource-heavy tasks." },
    { id: "cancellation", text: "Support graceful cancellation of running and pending tasks when a single task fails in 'fail-fast' mode." },
    { id: "telemetry-export", text: "Export execution metrics (durations, memory use, failures) to JSON/CSV files using generator pipelines." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};