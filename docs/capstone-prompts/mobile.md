You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (9 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/mobile/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "mobile" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "mobile". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "pubspec.yaml", "lib/**/*.dart" and "test/**/*_test.dart" for Flutter; "app.json" or "app.config.{js,ts}", "**/*.{js,jsx,ts,tsx}" and "**/*.{test,spec}.{js,jsx,ts,tsx}" for React Native / Expo; "Package.swift" or "**/project.pbxproj", "**/*.swift" and "**/*Tests.swift" for iOS / Swift (SwiftUI); "build.gradle.kts", "app/src/main/**/*.kt", "app/src/test/**/*.kt" and "app/src/main/AndroidManifest.xml" for Android / Kotlin; "**/*.csproj", "**/*.xaml", "**/*.cs" and "**/*Tests.cs" for .NET MAUI; "manifest.json" or "**/manifest.webmanifest" and "**/service-worker.{js,ts}" or "**/sw.js" for a PWA; "capacitor.config.{ts,json}" and "ionic.config.json" for Ionic. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.
11. MOBILE: the app must run on an emulator or simulator — no real device, no paid developer account, no app-store or TestFlight publishing, no real push-notification or payment credentials (use local stubs or a free backend). The automated tests must run WITHOUT a device or emulator (unit and widget tests, e.g. flutter test, Jest, XCTest, JUnit, xUnit), and CI must run them (an iOS project needs a macOS runner). Each brief needs at least one requirement about offline or local-data behaviour and one about loading, empty and error states in the UI.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### react-native — React Native Dev
  - rn-1 | JavaScript & React Prerequisites | topics: ES6+ — destructuring, spread, arrow functions, modules; Promises & async/await; React components & JSX; useState, useEffect, useRef, useCallback
  - rn-2 | React Native Core | topics: Expo vs bare React Native — when to use each; Core components — View, Text, Image, TextInput, ScrollView, FlatList; StyleSheet API — style objects, platform-specific styles; Flexbox in React Native — differences from web
  - rn-3 | Navigation | topics: React Navigation setup — native stack, dependencies; Stack Navigator — push, pop, goBack, params; Bottom Tabs Navigator — icons, badges; Drawer Navigator — gestures, custom drawer content
  - rn-4 | State Management | topics: Zustand — stores, actions, selectors; Redux Toolkit — createSlice, createAsyncThunk, RTK Query; Persisting state — AsyncStorage, MMKV; Optimistic updates and loading states
  - rn-5 | Networking & APIs | topics: Fetch API and Axios in React Native; TanStack Query — useQuery, useMutation, prefetching; Auth token storage — SecureStore (Expo) or Keychain; Interceptors for automatic token refresh
  - rn-6 | Native Device Features | topics: Permissions API — camera, location, notifications; expo-camera / react-native-vision-camera; Expo Notifications — local & push (FCM/APNs); expo-location & react-native-maps
  - rn-7 | Animations & Performance | topics: Reanimated 3 — useSharedValue, useAnimatedStyle, withTiming, withSpring; Gesture Handler — pan, pinch, tap gestures; Layout animations — entering/exiting presets; FlashList vs FlatList — performance differences
  - rn-8 | Testing & Publishing | topics: Jest setup for React Native; React Native Testing Library — render, fireEvent, waitFor; E2E testing with Detox or Maestro; EAS Build — managed vs bare workflow, build profiles
  - react-native-9 | Advanced Native Integration and New Architecture | topics: JSI fundamentals and synchronous native calls; Turbo Modules authoring for iOS and Android; Fabric renderer and concurrent rendering on mobile; Bridging third-party native SDKs into RN
  - react-native-10 | CI/CD, OTA Updates and Production Release Management | topics: EAS Build and EAS Submit for automated store uploads; OTA update channels and rollback strategies with EAS Update; Fastlane lanes for certificate and profile management; Crash reporting and source-map upload with Sentry

### flutter — Flutter Dev
  - flutter-1 | Dart Fundamentals | topics: Variables, types, null safety — ?, !, late; Functions — named params, arrow functions, closures; OOP — classes, inheritance, mixins, interfaces; Collections — List, Map, Set with generics
  - flutter-2 | Flutter UI Fundamentals | topics: Widget tree — StatelessWidget vs StatefulWidget; Layout — Row, Column, Stack, Flex, Expanded, Padding; Common widgets — Text, Container, Image, Icon, AppBar; MaterialApp, Scaffold, ThemeData
  - flutter-3 | State Management | topics: setState — when it's enough and when it's not; Provider — ChangeNotifier, Consumer, context.watch; Riverpod 2.0 — providers, notifiers, AsyncNotifier; StateNotifier vs AsyncNotifier
  - flutter-4 | Navigation & Routing | topics: Navigator 1.0 — push, pop, named routes; GoRouter — route definitions, path params, redirect guards; Nested navigation — ShellRoute, bottom tabs; Deep linking — Android intent filters, iOS URL schemes
  - flutter-5 | Networking & Firebase | topics: Dio — interceptors, timeouts, error handling; JSON serialization — json_serializable, Freezed; Firebase setup — FlutterFire CLI, platform config; Firebase Auth — email/password, Google Sign-In
  - flutter-6 | Local Storage & Native Features | topics: SharedPreferences for simple key-value storage; Hive or Isar for local structured data; image_picker — camera & gallery access; Firebase Cloud Messaging — push notifications
  - flutter-7 | Testing & Performance | topics: Unit tests — testing Riverpod providers, pure logic; Widget tests — pumpWidget, finder, tap, enter text; Integration tests with integration_test package; Golden tests — visual regression snapshots
  - flutter-8 | Publishing & CI/CD | topics: App icons, splash screens — flutter_native_splash; iOS — provisioning profiles, certificates, App Store Connect; Android — keystore, Play Console, aab build; Fastlane — match, gym, deliver, supply
  - flutter-9 | Advanced Flutter - Custom Rendering and Multi-Platform Targets | topics: Custom RenderObject and RenderBox from scratch; CustomPainter and Canvas API for complex graphics; Platform channels and MethodChannel for native SDK bridging; Flutter Web with CanvasKit vs HTML renderer trade-offs
  - flutter-10 | Production Flutter Apps - Analytics, A/B Testing and Store Optimization | topics: Crash reporting and stack trace symbolication with Firebase Crashlytics; Event analytics schema design and funnel tracking; A/B testing experiments with Firebase Remote Config; Shorebird code-push for Dart-layer OTA updates

### ios — iOS Dev
  - ios-1 | Swift Fundamentals | topics: Variables — let/var, type inference, optionals ?, !, guard let; Functions — default params, closures, trailing closure syntax; OOP — classes, structs, enums with associated values; Protocols & extensions — protocol-oriented programming
  - ios-2 | SwiftUI Fundamentals | topics: View protocol — body, ViewBuilder; State & data flow — @State, @Binding, @ObservedObject; Layout — HStack, VStack, ZStack, LazyVStack, Grid; Common views — Text, Image, Button, TextField, List, Form
  - ios-3 | Architecture — MVVM & Combine | topics: ObservableObject + @StateObject / @EnvironmentObject; @Observable macro — iOS 17+ simplified model; Combine — Publisher, Subscriber, operators, AnyCancellable; Repository pattern for data sources
  - ios-4 | Data Persistence — SwiftData & Core Data | topics: SwiftData — @Model, ModelContainer, @Query, relationships; Core Data — NSManagedObject, NSFetchRequest, NSPersistentContainer; Migrations — lightweight vs heavy migrations; CloudKit + Core Data for iCloud sync
  - ios-5 | Networking & Async | topics: URLSession — data(from:), URLRequest, HTTPURLResponse; Codable — Encodable/Decodable, CodingKeys, custom decoding; Generic networking layer — APIClient protocol; Alamofire — request, responseDecodable, interceptors
  - ios-6 | Navigation & Advanced SwiftUI | topics: NavigationStack — push/pop, NavigationPath; NavigationSplitView — sidebar/detail for iPad; Sheet, fullScreenCover, popover; Custom animations — withAnimation, .animation(), matchedGeometryEffect
  - ios-7 | Testing iOS Apps | topics: XCTest — XCTestCase, setUp/tearDown, XCTAssert; Swift Testing — @Test, @Suite, #expect, async tests; Testing ViewModels with mock repositories; XCUITest — UI testing, accessibility identifiers
  - ios-8 | App Store Publishing | topics: Code signing — certificates, provisioning profiles, Apple Developer; App capabilities — Push Notifications, iCloud, In-App Purchases; TestFlight — internal and external beta testing; Xcode Cloud — CI/CD built into Xcode
  - ios-9 | Advanced iOS - Extensions, Widgets and Background Tasks | topics: WidgetKit timeline providers and widget families; Lock Screen widgets and StandBy mode complications; App Clips entitlements, size limits, and invocation URLs; BGAppRefreshTask and BGProcessingTask scheduling
  - ios-10 | Production iOS - StoreKit 2, Analytics and App Store Optimization | topics: StoreKit 2 Transaction API and subscription lifecycle management; Server-side receipt verification with App Store Server API; Firebase Crashlytics dSYM upload and crash-free rate targets; Firebase A/B Testing with Remote Config parameters

### android — Android Dev
  - android-1 | Kotlin Fundamentals | topics: Variables — val/var, type inference, null safety ?, !!; Functions — default params, extension functions, lambdas; OOP — data classes, sealed classes, objects, companion; Collections — List, Map, Set, higher-order functions
  - android-2 | Jetpack Compose UI | topics: Composable functions — @Composable, recomposition; State — remember, mutableStateOf, State hoisting; Layouts — Column, Row, Box, LazyColumn; Modifiers — padding, size, clickable, clip
  - android-3 | Architecture — MVVM & Clean | topics: ViewModel — surviving configuration changes, viewModelScope; StateFlow & SharedFlow — collecting in Compose; Repository pattern — data source abstraction; Use cases — single-responsibility business logic
  - android-4 | Local Storage — Room & DataStore | topics: Room — @Entity, @Dao, @Database, TypeConverters; Room with Flow — reactive queries; Database migrations — Migration, fallbackToDestructiveMigration; DataStore Preferences — typed key-value store
  - android-5 | Networking with Retrofit & Coroutines | topics: Retrofit — @GET/@POST, suspend functions, interface; OkHttp interceptors — logging, auth headers; Kotlin Serialization — @Serializable, custom serializers; Sealed class Result<T> for API responses
  - android-6 | Navigation & Deep Links | topics: Navigation Compose — NavHost, composable destinations; Passing arguments — safeArgs, Parcelable, JSON; Nested navigation graphs; Bottom navigation bar with Navigation Compose
  - android-7 | Testing Android Apps | topics: JUnit 4/5 — unit testing ViewModels, use cases; MockK for Kotlin mocking; Turbine — testing StateFlow and Flow emissions; Compose UI testing — composeTestRule, semantics, actions
  - android-8 | Publishing to Google Play | topics: Gradle — build variants, product flavors, signing config; R8/ProGuard — code shrinking and obfuscation; App Bundle (AAB) vs APK; Google Play Console — internal, alpha, beta, production tracks
  - android-9 | Advanced Android - Background Processing and System Integration | topics: WorkManager chains, constraints, and expedited tasks; Notification channels, rich notifications, and bubbles; Foreground services and battery optimization compliance; App widgets with Glance and RemoteViews
  - android-10 | Production Android - Store Optimization, Billing and Feature Flags | topics: Play Billing Library 6 - subscriptions and one-time products; Purchase verification and server-side receipt validation; Firebase Crashlytics ANR and crash triage workflow; Remote Config feature flags and parameter hygiene

### kotlin-dev — Kotlin Developer
  - kotlin-dev-1 | Kotlin Fundamentals | topics: val, var & type inference; Basic types & string templates; Functions & default arguments; Control flow — if, when, ranges
  - kotlin-dev-2 | OOP & Null Safety | topics: Classes, constructors & properties; Data classes & destructuring; Sealed classes & enums; Interfaces & abstract classes
  - kotlin-dev-3 | Functional Kotlin & Collections | topics: Lambdas & higher-order functions; map, filter, reduce & fold; Scope functions — let, run, apply, also, with; Extension functions
  - kotlin-dev-4 | Coroutines & Concurrency | topics: Coroutines & suspend functions; launch, async & await; Structured concurrency & scopes; Dispatchers & context switching
  - kotlin-dev-5 | Flow & Async Streams | topics: Cold flows & flow builders; Operators — map, filter, transform; StateFlow & SharedFlow; Channels & producers
  - kotlin-dev-6 | Build Tooling with Gradle | topics: Gradle build lifecycle; Kotlin DSL (build.gradle.kts); Dependencies & version catalogs; Multi-module projects
  - kotlin-dev-7 | Backend with Ktor | topics: Ktor setup & application structure; Routing & request handling; Content negotiation & kotlinx.serialization; Plugins (features) & pipelines
  - kotlin-dev-8 | Data & Persistence | topics: Exposed DSL & DAO; Defining tables & schemas; CRUD & queries; Connection pooling with HikariCP
  - kotlin-dev-9 | Testing in Kotlin | topics: JUnit5 with Kotlin; Kotest assertions & specs; Mocking with MockK; Testing coroutines & flows
  - kotlin-dev-10 | Multiplatform & Deployment | topics: Kotlin Multiplatform overview; Sharing logic across JVM/JS/Native; Building a fat jar / native image; Dockerizing a Ktor app

### swift-dev — Swift Developer
  - swift-dev-1 | Swift Fundamentals | topics: let, var & type inference; Basic types & string interpolation; Functions & closures; Control flow — if, switch, loops
  - swift-dev-2 | Types, Optionals & Error Handling | topics: Optionals, binding & nil-coalescing; Structs vs classes; Enums with associated values; Pattern matching with switch
  - swift-dev-3 | Protocols, Generics & Value Semantics | topics: Protocols & protocol extensions; Protocol-oriented programming; Generics & associated types; Value vs reference semantics
  - swift-dev-4 | Memory & Modern Concurrency | topics: ARC & reference counting; Strong, weak & unowned references; Retain cycles & how to break them; async/await & structured concurrency
  - swift-dev-5 | SwiftUI Fundamentals | topics: Views & view composition; Stacks, spacers & layout; Modifiers & styling; Lists & navigation
  - swift-dev-6 | SwiftUI State & Data Flow | topics: @State & @Binding; @Observable & @Bindable; @Environment & dependency passing; Lists, forms & user input
  - swift-dev-7 | Combine & Reactive Programming | topics: Publishers & subscribers; Operators — map, filter, combineLatest; Subjects & @Published; Error handling & retry
  - swift-dev-8 | Networking & Persistence | topics: URLSession & async networking; Codable — encoding & decoding JSON; REST API clients; SwiftData models & queries
  - swift-dev-9 | Testing & Debugging | topics: XCTest & the Swift Testing framework; Unit testing models & logic; Testing async code; UI testing
  - swift-dev-10 | Swift Packages & Deployment | topics: Swift Package Manager; Building & publishing packages; Server-side Swift with Vapor; App distribution & TestFlight

### maui — .NET MAUI Dev
  - maui-1 | C# Fundamentals | topics: Variables, types & operators; Control flow & methods; The .NET CLR & SDK; Namespaces & assemblies
  - maui-2 | Object-Oriented C# & .NET | topics: Classes, properties & inheritance; Interfaces & abstract classes; Records & structs; Exception handling
  - maui-3 | Async & LINQ | topics: Tasks & async/await; Cancellation & exceptions in async; LINQ query & method syntax; Deferred execution
  - maui-4 | .NET MAUI Basics | topics: MAUI project structure; Single project, multi-platform; Pages & controls; The app lifecycle
  - maui-5 | XAML & UI Layout | topics: XAML syntax & markup extensions; Layouts — Grid, StackLayout, FlexLayout; Styles & resource dictionaries; Control templates
  - maui-6 | MVVM & Data Binding | topics: The MVVM pattern; Data binding & BindingContext; INotifyPropertyChanged; Commands & the CommunityToolkit.Mvvm
  - maui-7 | Navigation & Platform Features | topics: MAUI Shell & routing; Passing data between pages; Accessing device sensors & APIs; Permissions handling
  - maui-8 | Data & Networking | topics: HttpClient & REST consumption; Serialization & DTOs; Local storage with SQLite; Offline-first patterns
  - maui-9 | Testing & Debugging | topics: Unit testing with xUnit; Testing view models; Mocking services; Debugging on devices & emulators
  - maui-10 | Azure, Distribution & CI/CD | topics: Azure services for mobile (Functions, Storage); Push notifications; Code signing for iOS & Android; CI/CD with GitHub Actions / Azure DevOps

### pwa-dev — PWA Developer
  - pwa-dev-1 | Web Foundations | topics: Semantic HTML & accessibility; Modern CSS layout; HTTP, HTTPS & the request lifecycle; The browser rendering pipeline
  - pwa-dev-2 | Modern JavaScript | topics: ES modules & bundling; Promises & async/await; Fetch API & JSON; DOM & event handling
  - pwa-dev-3 | Responsive & App-Shell UI | topics: The app-shell architecture; Responsive & adaptive layout; Touch-friendly UX; Skeleton screens & perceived performance
  - pwa-dev-4 | The Web App Manifest | topics: manifest.json fields; Icons & maskable icons; Display modes & theme color; The install prompt (beforeinstallprompt)
  - pwa-dev-5 | Service Workers | topics: Registering a service worker; Install, activate & fetch events; The service worker lifecycle; Intercepting requests
  - pwa-dev-6 | Caching Strategies & Offline | topics: The Cache API; Cache-first, network-first & stale-while-revalidate; Precaching with Workbox; IndexedDB for structured data
  - pwa-dev-7 | Push Notifications & Background Sync | topics: The Notifications API; Push API & web-push; VAPID keys & subscriptions; Background Sync
  - pwa-dev-8 | Device & Web APIs | topics: Geolocation & device orientation; Camera & media capture; Web Share & clipboard; File System Access
  - pwa-dev-9 | Performance & Lighthouse | topics: Core Web Vitals — LCP, INP, CLS; Auditing with Lighthouse; Code splitting & lazy loading; Image & asset optimization
  - pwa-dev-10 | Packaging & Deployment | topics: Deploying to a CDN / static host; HTTPS & service worker hosting rules; Packaging for stores with PWABuilder / TWA; Versioning & update strategy

### ionic — Ionic Developer
  - ionic-1 | Web & TypeScript Foundations | topics: HTML & semantic markup; CSS & flexbox layout; TypeScript types & interfaces; Modules & tooling
  - ionic-2 | Angular Fundamentals | topics: Components & templates; Services & dependency injection; Angular Router; Observables & RxJS basics
  - ionic-3 | Ionic Framework & Components | topics: Ionic CLI & project setup; Core UI components; Platform-adaptive styling (iOS/MD); Theming with CSS variables
  - ionic-4 | Navigation & Routing | topics: Angular Router with Ionic; Tabs & nested routes; Modals, popovers & alerts; Passing & reading route params
  - ionic-5 | State Management | topics: Service-based state; RxJS subjects & stores; Angular signals; Caching & sharing data
  - ionic-6 | Native with Capacitor | topics: Capacitor architecture; Adding iOS & Android platforms; The native project bridge; Live reload on device
  - ionic-7 | Device APIs & Plugins | topics: Core Capacitor plugins; Camera & photo gallery; Geolocation & maps; Local notifications
  - ionic-8 | Data, HTTP & Storage | topics: Angular HttpClient & interceptors; REST API consumption; Local storage with Ionic Storage / SQLite; Authentication & token handling
  - ionic-9 | Testing & Debugging | topics: Unit testing with Jasmine & Karma; Testing components & services; End-to-end testing; Debugging with Chrome DevTools
  - ionic-10 | Building & Publishing | topics: Production builds & optimization; Code signing — iOS & Android; App store assets & metadata; Appflow / CI for Ionic
