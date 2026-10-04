You are a senior full-stack engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (13 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line, like:
FILE: backend/seeders/capstones/fullstack/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (the MERN brief):

```js
/**
 * Capstone brief — MERN Developer track (mern), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 *
 * ⚠ Do not publish until the MERN layer exams exist: a capstone unlocks only
 * after every layer exam of the track is passed, and as of 2026-10-03 the
 * mern track has no exam banks (examSeeder.js SEED_CONFIG has it commented out).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "mern",
  categoryId: "fullstack",
  slug: "mern-task-board",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Collaborative task board",
  summary:
    "Build a full-stack task board (boards, columns, cards) that a small team could actually use: a " +
    "React client talking to an Express API backed by MongoDB, with auth, real server state handling on " +
    "the client, and both halves tested and deployable.",
  stack: ["MongoDB", "Express", "React", "Node.js", "React Query"],

  requirements: [
    { id: "auth", text: "Users sign up and log in; tokens are refreshed without forcing a new login, and protected pages redirect when logged out." },
    { id: "boards", text: "Users create boards with columns and cards; cards can be edited, moved between columns and deleted." },
    { id: "ownership", text: "The API enforces that only board members can read or change a board — hiding buttons in the UI is not enough." },
    { id: "server-state", text: "The client fetches and mutates server data through React Query (or an equivalent cache), with loading and error states everywhere." },
    { id: "validation", text: "The API validates every request body and returns consistent JSON errors; the client shows them to the user." },
    { id: "client", text: "A React client lives in the repository.", check: { type: "file", glob: "{client,frontend,web}/**/*.{jsx,tsx}" } },
    { id: "server", text: "An Express API lives in the repository.", check: { type: "file", glob: "{server,backend,api}/**/*.{js,ts,mjs}" } },
    { id: "tests", text: "API tests and React Testing Library component tests cover auth, board access and moving a card.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, running both halves and the tests, and how it is deployed.", check: CHECKS.readme },
    { id: "ci", text: "CI runs lint and tests for client and server on every push.", check: CHECKS.ci },
    { id: "no-secrets", text: "No secrets committed; configuration from environment variables with an .env.example.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "mern-8", description: "The full flow works end to end, including your twist and its edge cases." },
    { id: "frontend", name: "Frontend quality", weight: 15, layerId: "mern-4", description: "Components, state and hooks are well structured; the UI handles loading, empty and error states." },
    { id: "backend", name: "Backend & data", weight: 15, layerId: "mern-6", description: "Clear API structure and a MongoDB model that fits the access patterns, with sensible indexes." },
    { id: "security", name: "Security basics", weight: 15, layerId: "mern-7", description: "Hashing, token handling, server-side membership checks, no secrets in the repository." },
    { id: "tests", name: "Tests", weight: 15, layerId: "mern-9", description: "Both halves are tested on real behaviour, including failure paths." },
    { id: "deploy", name: "Docs & deployment", weight: 15, layerId: "mern-10", description: "Someone new can run it locally and understands how it is deployed." },
  ],

  twistPool: [
    { id: "ordering", text: "Card order within a column is persisted; reordering many cards never rewrites every card in the column." },
    { id: "roles", text: "Boards are shared with viewer or editor roles; viewers can never change anything, enforced by the API." },
    { id: "activity", text: "Each board has an activity feed (who moved or edited which card, and when), paginated." },
    { id: "optimistic", text: "Moving a card updates the UI instantly and rolls back with a visible message if the server rejects the change." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "fullstack". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty (each learner gets one at random — one twist must never be much harder or easier than the others).
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Only use these shared checks (they are imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.jsTests, CHECKS.dockerfile. You MAY write a custom check as { type: "file", glob: "<glob>" } but only if a correct project for that stack would certainly contain a matching file (e.g. "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for Django, "**/*.svelte" for SvelteKit, "**/*.vue" for Nuxt, "**/*.astro" for Astro, "app/**/*.php" for Laravel). Globs match paths from the repo root; use **/ when the folder can vary. Never require a check on something optional.
5. Always include requirements (with checks) for: README, CI workflow, tests, and either .env.example or docker compose where that fits the stack.
6. Requirements must be concrete and testable ("only the owner can edit a post, enforced by the API"), never vague ("follows best practices", "clean code").
7. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be different from the other tracks (no two tracks get the same app idea).
8. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this warning line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
9. Plain JavaScript only: no TypeScript, no comments inside arrays, no trailing text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### pern — PERN Developer
  - pern-1 | Web Fundamentals | topics: HTML5 semantic elements & forms; CSS box model, flexbox & grid; Responsive design & media queries; JavaScript types, functions & scope
  - pern-2 | Modern JavaScript & TypeScript | topics: ES modules, destructuring & spread; Promises, async/await & the event loop; Array & object methods — map, filter, reduce; TypeScript types, interfaces & generics
  - pern-3 | React Fundamentals | topics: JSX, props & component composition; useState & useEffect; Conditional rendering & lists; Controlled forms & inputs
  - pern-4 | React Advanced & State | topics: React Router — nested routes & params; Global state with Zustand; Server state with TanStack Query; Custom hooks & reusability
  - pern-5 | Node.js & Express APIs | topics: Node runtime & module system; Express routing & controllers; Middleware — logging, validation, errors; RESTful API design & status codes
  - pern-6 | Relational Databases & SQL | topics: Tables, rows, columns & data types; SELECT, WHERE, ORDER BY, LIMIT; JOINs — inner, left, right, full; Aggregations & GROUP BY
  - pern-7 | PostgreSQL in Depth | topics: psql, roles & database administration; Indexes — B-tree, partial, composite; Transactions, ACID & isolation levels; JSONB & array columns
  - pern-8 | Data Access Layer | topics: node-postgres (pg) & connection pooling; Prisma schema, client & relations; Migrations & seeding; Parameterized queries & SQL injection
  - pern-9 | Auth, Security & Validation | topics: Password hashing with bcrypt; JWT issuance, refresh & protected routes; HTTP-only cookies vs localStorage; Input validation with Zod
  - pern-10 | Testing, CI/CD & Deployment | topics: Unit & integration tests with Vitest; API testing with Supertest; Dockerizing Node + PostgreSQL with Compose; GitHub Actions CI pipeline

### t3 — T3 Stack Dev
  - t3-1 | TypeScript and Modern JavaScript Foundations | topics: ES modules and modern syntax; Static types, interfaces, and type aliases; Generics and utility types; Discriminated unions and narrowing
  - t3-2 | React Fundamentals | topics: Components and props; State with useState; Effects with useEffect; Lists, keys, and conditional rendering
  - t3-3 | Next.js App Router | topics: File-based routing and layouts; Server and client components; Data fetching and caching; Route handlers
  - t3-4 | Styling with Tailwind CSS | topics: Utility classes and the box model; Responsive breakpoints; Flexbox and grid utilities; Theme configuration and tokens
  - t3-5 | End-to-End Type Safety with tRPC | topics: Routers and procedures; Queries and mutations; Input validation with Zod; Context and middleware
  - t3-6 | Database Modeling with Prisma | topics: Prisma schema and data model; Migrations and the database push; CRUD queries with the client; Relations and nested writes
  - t3-7 | Authentication and Sessions | topics: OAuth and credential providers; Session and JWT strategies; Prisma adapter for users; Protecting tRPC procedures
  - t3-8 | Advanced State and Data Fetching | topics: Query caching and invalidation; Optimistic updates and rollback; Infinite queries and pagination; Prefetching and hydration
  - t3-9 | Forms, Validation, and Reusable UI | topics: React Hook Form basics; Zod schemas shared with tRPC; Field errors and accessibility; Component composition patterns
  - t3-10 | Testing and Deployment | topics: Unit testing with Vitest; Component testing with Testing Library; End-to-end tests with Playwright; Environment variables and secrets

### fullstack-engineer — Full Stack Engineer
  - fullstack-engineer-1 | Web Fundamentals | topics: Semantic HTML structure; CSS layout with flexbox and grid; JavaScript variables and functions; DOM manipulation and events
  - fullstack-engineer-2 | Frontend with React | topics: Components, props, and state; Hooks and the effect lifecycle; Client-side routing; Lifting state and prop drilling
  - fullstack-engineer-3 | Backend with Node and Express | topics: Node runtime and modules; Express routing and middleware; Request and response handling; REST conventions and status codes
  - fullstack-engineer-4 | Relational Databases and SQL | topics: Tables, columns, and keys; SELECT, INSERT, UPDATE, DELETE; Joins and relationships; Indexes and constraints
  - fullstack-engineer-5 | Connecting Frontend and Backend | topics: CORS and cross-origin requests; Fetching and posting JSON; Loading and error states; API client organization
  - fullstack-engineer-6 | Authentication and Authorization | topics: Password hashing with bcrypt; JSON Web Tokens; Sessions versus tokens; Protected route middleware
  - fullstack-engineer-7 | API Design and Advanced Backend | topics: Input validation and sanitization; Service and repository layers; Query optimization and indexing; Caching strategies
  - fullstack-engineer-8 | Containers with Docker | topics: Images, containers, and layers; Writing a Dockerfile; Volumes and networking; Docker Compose for multi-service apps
  - fullstack-engineer-9 | Testing the Full Stack | topics: Unit tests with Jest; API tests with Supertest; React component testing; End-to-end tests with Playwright
  - fullstack-engineer-10 | Deployment and CI/CD | topics: CI pipelines with GitHub Actions; Building and pushing images; Deploying to a cloud host; Managed databases and secrets

### mean — MEAN Developer
  - mean-1 | JavaScript and Web Fundamentals | topics: Variables, functions, and scope; Arrays, objects, and iteration; DOM and events; Promises and async/await
  - mean-2 | TypeScript for Angular | topics: Types, interfaces, and enums; Classes and access modifiers; Generics; Decorators
  - mean-3 | Angular Fundamentals | topics: Components and templates; Data binding and directives; Services and dependency injection; The Angular router
  - mean-4 | Reactive Programming with RxJS | topics: Observables and observers; Common operators like map and filter; Subjects and behavior subjects; Combining streams
  - mean-5 | Node and Express Backend | topics: Express routing and middleware; REST endpoint design; Request parsing and responses; Environment configuration
  - mean-6 | MongoDB and Mongoose | topics: Documents and collections; Mongoose schemas and models; CRUD operations; Querying and projections
  - mean-7 | Connecting Angular to the API | topics: HttpClient and services; Observable-based data fetching; Error handling and retries; Interceptors
  - mean-8 | Authentication with JWT | topics: Password hashing; Issuing JSON Web Tokens; Express auth middleware; Angular route guards
  - mean-9 | Advanced Angular and Forms | topics: Reactive forms and validation; Form arrays and dynamic fields; State management patterns; Lazy loading modules
  - mean-10 | Testing and Deployment | topics: Unit testing Angular with Jasmine; Backend tests with Jest; End-to-end testing; Building Angular for production

### jamstack — JAMstack Developer
  - jamstack-1 | Web Foundations and the JAMstack Model | topics: Semantic HTML and CSS; JavaScript essentials; Static versus dynamic sites; What JAMstack means
  - jamstack-2 | React and Component Thinking | topics: Components and props; State and hooks; Conditional rendering and lists; Composition patterns
  - jamstack-3 | Static Sites with Next.js | topics: Pages and routing; Static generation; Incremental static regeneration; Image and font optimization
  - jamstack-4 | Gatsby and the Data Layer | topics: Gatsby pages and templates; GraphQL data queries; Source plugins; Programmatic page creation
  - jamstack-5 | Headless CMS with Contentful | topics: Content models and fields; The Content Delivery API; Querying with GraphQL; Rich text rendering
  - jamstack-6 | APIs and Serverless Functions | topics: Serverless function basics; Handling requests and responses; Calling external APIs securely; Environment variables and secrets
  - jamstack-7 | Authentication and Identity | topics: Identity providers and OAuth; Login and signup flows; JWT and session handling; Protecting routes and content
  - jamstack-8 | Performance and SEO | topics: Core Web Vitals; Image and asset optimization; Code splitting and lazy loading; Structured data and meta tags
  - jamstack-9 | E-commerce and Dynamic Data | topics: Product catalogs from a CMS; Cart state management; Stripe checkout integration; Serverless payment handling
  - jamstack-10 | Deployment and Continuous Delivery | topics: Connecting Git to Netlify; Build commands and environments; Deploy previews; Build hooks and CMS triggers

### django-react — Django + React Dev
  - django-react-1 | Python Fundamentals | topics: Variables, types, and control flow; Functions and modules; Lists, dicts, and comprehensions; Classes and objects
  - django-react-2 | Django Basics | topics: Projects and apps; URLs, views, and templates; The request and response cycle; Settings and configuration
  - django-react-3 | Django Models and the ORM | topics: Models and fields; Migrations; QuerySets and filtering; Relationships and foreign keys
  - django-react-4 | Building APIs with Django REST Framework | topics: Serializers; Views and viewsets; Routers and URLs; Pagination and filtering
  - django-react-5 | React Frontend | topics: Components and props; State and hooks; Routing; Fetching from the API
  - django-react-6 | Connecting React and Django | topics: CORS configuration; API client setup with Axios; Handling loading and errors; Posting and updating data
  - django-react-7 | Authentication with Tokens | topics: Token and JWT authentication; Login and registration endpoints; Protected API views; Storing tokens in React
  - django-react-8 | Advanced Django | topics: Query optimization and select_related; Caching with Redis; Background jobs with Celery; Signals
  - django-react-9 | Advanced React State and UX | topics: Server state with React Query; Caching and invalidation; Optimistic updates; Global state patterns
  - django-react-10 | Testing and Deployment | topics: Django tests with pytest; React component testing; Containerizing with Docker; Serving with Gunicorn and Nginx

### rails-dev — Ruby on Rails Dev
  - rails-dev-1 | Ruby Fundamentals | topics: Variables, methods, and blocks; Arrays, hashes, and enumerables; Classes, modules, and mixins; Symbols and ranges
  - rails-dev-2 | Rails Basics and MVC | topics: Rails project structure; Routes, controllers, and views; The MVC pattern; Convention over configuration
  - rails-dev-3 | Active Record and Databases | topics: Models and migrations; CRUD with Active Record; Associations; Validations
  - rails-dev-4 | Views, Forms, and Assets | topics: ERB templates and layouts; Partials and helpers; Form helpers and strong params; Flash messages
  - rails-dev-5 | Authentication and Authorization | topics: Sessions and cookies; User signup and login with Devise; Password security; Authorization with Pundit
  - rails-dev-6 | Interactivity with Hotwire | topics: Turbo Drive and navigation; Turbo Frames; Turbo Streams; Stimulus controllers
  - rails-dev-7 | Background Jobs and Mailers | topics: Active Job basics; Sidekiq and Redis; Scheduling and retries; Action Mailer
  - rails-dev-8 | Building APIs with Rails | topics: API-only controllers; Serializing JSON responses; Versioning endpoints; Token authentication
  - rails-dev-9 | Performance and Advanced Patterns | topics: N plus one queries and eager loading; Fragment and Russian doll caching; Database indexing; Service objects
  - rails-dev-10 | Testing and Deployment | topics: Model and request specs with RSpec; System tests with Capybara; Fixtures and factories; Continuous integration

### next-fullstack — Next.js Full Stack Dev
  - next-fullstack-1 | TypeScript and React Foundations | topics: TypeScript types and interfaces; React components and props; State and hooks; Typing props and events
  - next-fullstack-2 | Next.js App Router and Routing | topics: File-based routing; Nested layouts; Dynamic and catch-all routes; Linking and navigation
  - next-fullstack-3 | Server Components and Rendering | topics: Server versus client components; Static and dynamic rendering; Streaming and Suspense; Caching and revalidation
  - next-fullstack-4 | Database with Prisma | topics: Prisma schema and models; Migrations; Typed CRUD queries; Relations
  - next-fullstack-5 | Server Actions and Mutations | topics: Server actions basics; Form submissions; Revalidation after mutations; Route handlers for APIs
  - next-fullstack-6 | Authentication | topics: OAuth and credential providers; Sessions and JWT; Prisma adapter; Protecting server actions and routes
  - next-fullstack-7 | Styling and UI | topics: Tailwind utility styling; Responsive and dark mode; Accessible component primitives; Reusable design system parts
  - next-fullstack-8 | Advanced Data and Caching | topics: Request and data cache; Time and tag-based revalidation; Optimistic updates; Parallel and sequential fetching
  - next-fullstack-9 | API Routes and Integrations | topics: Route handlers and REST; Calling external APIs securely; Stripe payments; Webhooks and verification
  - next-fullstack-10 | Testing and Deployment to Vercel | topics: Unit testing with Vitest; End-to-end testing with Playwright; Environment variables in Vercel; Production database setup

### sveltekit-dev — SvelteKit Developer
  - sveltekit-dev-1 | JavaScript and TypeScript Foundations | topics: Modern JavaScript syntax; Modules and imports; Promises and async/await; TypeScript types and interfaces
  - sveltekit-dev-2 | Svelte Fundamentals | topics: Components and props; Reactivity and runes; Events and bindings; Conditional and list rendering
  - sveltekit-dev-3 | SvelteKit Routing and Pages | topics: File-based routing; Layouts and nesting; Dynamic route parameters; Navigation and links
  - sveltekit-dev-4 | Loading Data | topics: Page and layout load functions; Server versus universal load; Type-safe load data; Parameters and the fetch helper
  - sveltekit-dev-5 | Form Actions and Mutations | topics: Form actions; Progressive enhancement with enhance; Validation with Zod; Named actions
  - sveltekit-dev-6 | Databases and Persistence | topics: Prisma schema and models; Migrations; Querying in server code; Relations
  - sveltekit-dev-7 | Authentication and Hooks | topics: Server hooks and handle; Sessions and cookies; Login and signup flows; Protecting routes
  - sveltekit-dev-8 | Advanced UI and Stores | topics: Writable and derived stores; Context API; Transitions and animations; Actions and use directives
  - sveltekit-dev-9 | APIs and Advanced SvelteKit | topics: API routes with server endpoints; Request and response helpers; Prerendering and SSR control; Page options
  - sveltekit-dev-10 | Testing and Deployment | topics: Unit tests with Vitest; End-to-end tests with Playwright; Choosing an adapter; Environment variables in production

### nuxt-dev — Nuxt Developer
  - nuxt-dev-1 | JavaScript and TypeScript Foundations | topics: Modern JavaScript syntax; Modules and imports; Promises and async/await; TypeScript types and interfaces
  - nuxt-dev-2 | Vue 3 Fundamentals | topics: Template syntax and directives; Reactivity with ref and reactive; Components and props; Events and v-model
  - nuxt-dev-3 | Nuxt Basics and Routing | topics: Project structure; Pages and file-based routing; Layouts; Navigation with NuxtLink
  - nuxt-dev-4 | Data Fetching and Rendering | topics: useFetch and useAsyncData; Server-side rendering; Static generation; Caching and refresh
  - nuxt-dev-5 | Server Engine with Nitro | topics: Server routes and API handlers; Reading request data; Server utilities; Environment and runtime config
  - nuxt-dev-6 | Databases and Persistence | topics: Prisma schema and models; Migrations; Querying in server routes; Relations
  - nuxt-dev-7 | State and Authentication | topics: State with useState and Pinia; Server middleware for auth; Sessions and cookies; Login and signup
  - nuxt-dev-8 | Modules and Advanced Patterns | topics: Using official modules; Image and font optimization; Writing custom composables; Plugins
  - nuxt-dev-9 | Performance and SEO | topics: Core Web Vitals; Lazy loading and code splitting; Caching and ISR; Structured data and meta tags
  - nuxt-dev-10 | Testing and Deployment | topics: Unit testing with Vitest; Nuxt test utils; End-to-end tests with Playwright; Choosing a deployment preset

### astro-dev — Astro Developer
  - astro-dev-1 | Web and TypeScript Foundations | topics: Semantic HTML and CSS; Responsive layout; JavaScript essentials; TypeScript types and interfaces
  - astro-dev-2 | Astro Basics and Components | topics: Astro component syntax; Component script and template; Props and slots; Scoped and global styles
  - astro-dev-3 | Routing, Layouts, and Pages | topics: File-based routing; Layout components; Dynamic routes and params; getStaticPaths
  - astro-dev-4 | Content Collections and MDX | topics: Markdown and frontmatter; MDX with components; Content collections; Schema validation with Zod
  - astro-dev-5 | Islands and Interactivity | topics: Islands architecture; Framework integrations; Client directives; Hydration strategies
  - astro-dev-6 | Styling and Design Systems | topics: Tailwind integration; Responsive utilities; Dark mode; Reusable styled components
  - astro-dev-7 | Server Rendering and Endpoints | topics: Static versus server output; Adapters and SSR; API endpoints; Handling form submissions
  - astro-dev-8 | Data, CMS, and Integrations | topics: Fetching from external APIs; Connecting a headless CMS; Content loaders; Image handling and optimization
  - astro-dev-9 | Performance and SEO | topics: Core Web Vitals; Minimal JavaScript shipping; Image and asset optimization; Meta tags and structured data
  - astro-dev-10 | Testing and Deployment | topics: Unit testing with Vitest; End-to-end tests with Playwright; Choosing an adapter; Environment variables in production

### laravel-vue — Laravel + Vue Dev
  - laravel-vue-1 | PHP Fundamentals | topics: Variables, types, and control flow; Functions and arrays; Classes, interfaces, and traits; Namespaces and autoloading
  - laravel-vue-2 | Laravel Basics and Routing | topics: Project structure and Artisan; Routing and controllers; Blade templates; Request and response handling
  - laravel-vue-3 | Eloquent and Databases | topics: Migrations and schema; Eloquent models and CRUD; Relationships; Query builder
  - laravel-vue-4 | Validation, Forms, and Auth | topics: Form requests and validation; CSRF protection; Flash messages and old input; Laravel Breeze authentication
  - laravel-vue-5 | Vue 3 Fundamentals | topics: Template syntax and directives; Reactivity with ref and reactive; Components and props; Events and v-model
  - laravel-vue-6 | Building APIs with Laravel | topics: API routes and controllers; API resources and transformers; Pagination and filtering; Token auth with Sanctum
  - laravel-vue-7 | Connecting Vue to Laravel | topics: API calls with Axios; State management with Pinia; Vue Router; Handling auth tokens
  - laravel-vue-8 | Queues, Jobs, and Email | topics: Queues and workers; Jobs and dispatching; Scheduling tasks; Mailables and notifications
  - laravel-vue-9 | Advanced Patterns and Performance | topics: Eager loading and N plus one; Caching with Redis; Service classes and repositories; Database indexing
  - laravel-vue-10 | Testing and Deployment | topics: Feature and unit tests with Pest; Vue component testing; Database testing; Containerizing with Docker and Sail

### remix-dev — Remix Developer
  - remix-dev-1 | TypeScript and React Foundations | topics: TypeScript types and interfaces; React components and props; State and hooks; Typing props and events
  - remix-dev-2 | Remix Basics and Routing | topics: Project structure; File-based nested routes; Layouts and the Outlet; Links and navigation
  - remix-dev-3 | Loaders and Data Loading | topics: Loader functions; useLoaderData; Type-safe loader data; URL params and search params
  - remix-dev-4 | Actions, Forms, and Mutations | topics: Action functions; The Form component; Validation with Zod; useNavigation pending states
  - remix-dev-5 | Databases and Persistence | topics: Prisma schema and models; Migrations; Querying in loaders and actions; Relations
  - remix-dev-6 | Authentication and Sessions | topics: Cookie-based sessions; Login and signup flows; Password hashing; Protecting loaders and actions
  - remix-dev-7 | Error Handling and Resilience | topics: Error boundaries; Catch and thrown responses; Status codes and headers; Not-found handling
  - remix-dev-8 | Advanced Data Patterns | topics: useFetcher for background work; Optimistic UI patterns; HTTP caching headers; Prefetching
  - remix-dev-9 | Styling and Performance | topics: Tailwind integration; Responsive and dark mode; Reusable styled components; Asset and link optimization
  - remix-dev-10 | Testing and Deployment | topics: Unit testing with Vitest; End-to-end tests with Playwright; Choosing a deployment target; Environment variables in production
