'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(
  __dirname,
  '../src/data/roadmaps/fullstack.json'
);

// ─── Patch data ────────────────────────────────────────────────────────────────

const patches = {
  'nuxt-dev-1': {
    sideLeft: [
      {
        title: 'Modern JavaScript Core Concepts',
        children: [
          {
            title: 'ES2015+ syntax and language features',
            description:
              'Arrow functions, destructuring, spread/rest, template literals, and optional chaining are the day-to-day syntax of modern JS. Fluency here is required before any framework work.',
            resources: [
              {
                label: 'MDN JavaScript Guide',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
                type: 'docs',
              },
              {
                label: 'javascript.info — The Modern JavaScript Tutorial',
                url: 'https://javascript.info/',
                type: 'article',
              },
            ],
          },
          {
            title: 'ES Modules imports and exports explained',
            description:
              'Named and default exports, dynamic import(), and how bundlers resolve module graphs underpin every Vue and Nuxt project. Understanding the module system prevents common "undefined" and circular-dependency bugs.',
            resources: [
              {
                label: 'MDN — JavaScript modules',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Promises, async/await, and error handling',
            description:
              'Almost all Nuxt data-fetching is asynchronous. A clear mental model of the microtask queue and try/catch around await calls prevents silent failures.',
            resources: [
              {
                label: 'MDN — Using Promises',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
                type: 'docs',
              },
              {
                label: 'javascript.info — Async/await',
                url: 'https://javascript.info/async-await',
                type: 'article',
              },
            ],
          },
        ],
      },
      {
        title: 'TypeScript Types and Interfaces',
        children: [
          {
            title: 'TypeScript primitive and object types',
            description:
              'Type annotations, union types, and interfaces let you catch mismatches at compile time. Nuxt ships full TypeScript support out of the box, so learning these saves debugging time.',
            resources: [
              {
                label: 'TypeScript Handbook — Everyday Types',
                url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Generics and utility types in TypeScript',
            description:
              'Generics enable reusable, type-safe functions and composables. Built-in utilities like Partial, Pick, and Record reduce boilerplate in Vue component props and API response types.',
            resources: [
              {
                label: 'TypeScript Handbook — Generics',
                url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Tooling and Package Management',
        children: [
          {
            title: 'npm and pnpm dependency management workflow',
            description:
              'Package managers install, version, and deduplicate project dependencies. pnpm is the recommended choice for Nuxt monorepos because of its efficient disk usage and strict hoisting.',
            resources: [
              {
                label: 'pnpm Documentation',
                url: 'https://pnpm.io/motivation',
                type: 'docs',
              },
              {
                label: 'npm Docs — Getting started',
                url: 'https://docs.npmjs.com/getting-started',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Vite dev server and build pipeline',
            description:
              'Vite powers Nuxt\'s development server with native ESM and HMR, and bundles production assets with Rollup. Understanding its config options helps you extend the build for custom transforms.',
            resources: [
              {
                label: 'Vite — Getting Started',
                url: 'https://vitejs.dev/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Browser DOM and Web APIs overview',
            description:
              'Even in SSR apps you interact with the DOM on the client. Knowing querySelectorAll, events, and fetch lets you write client-only code confidently inside Nuxt\'s onMounted hooks.',
            resources: [
              {
                label: 'MDN — Web APIs introduction',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Developer Environment Setup',
        children: [
          {
            title: 'Node.js version management with nvm',
            description:
              'Nuxt requires a specific Node.js range. nvm (or fnm) lets you switch versions per project without breaking global tools.',
            resources: [
              {
                label: 'nvm — Node Version Manager',
                url: 'https://github.com/nvm-sh/nvm',
                type: 'docs',
              },
            ],
          },
          {
            title: 'ESLint and Prettier code quality tools',
            description:
              'Automated linting and formatting enforce consistency across a team and catch common errors before runtime. Nuxt\'s ESLint module provides a zero-config setup.',
            resources: [
              {
                label: 'Nuxt ESLint module',
                url: 'https://eslint.nuxt.com/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-2': {
    sideLeft: [
      {
        title: 'Vue Template Syntax and Reactivity',
        children: [
          {
            title: 'Template directives v-if v-for v-bind',
            description:
              'Vue\'s declarative template system uses directives to bind data to the DOM without manual querySelector calls. Mastering them is the entry point to building any Vue UI.',
            resources: [
              {
                label: 'Vue Docs — Template Syntax',
                url: 'https://vuejs.org/guide/essentials/template-syntax.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reactive state with ref and reactive',
            description:
              'ref wraps primitives into reactive references while reactive unwraps objects deeply. Choosing correctly avoids reactivity loss and keeps component logic predictable.',
            resources: [
              {
                label: 'Vue Docs — Reactivity Fundamentals',
                url: 'https://vuejs.org/guide/essentials/reactivity-fundamentals.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Computed properties and watchers explained',
            description:
              'Computed properties cache derived values and only recompute when dependencies change. Watchers run side-effects in response to state changes, making them the right tool for async reactions.',
            resources: [
              {
                label: 'Vue Docs — Computed Properties',
                url: 'https://vuejs.org/guide/essentials/computed.html',
                type: 'docs',
              },
              {
                label: 'Vue Docs — Watchers',
                url: 'https://vuejs.org/guide/essentials/watchers.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Components and the Composition API',
        children: [
          {
            title: 'Props, emits, and component communication',
            description:
              'Props flow data downward while emits communicate events upward. Typing both in TypeScript with defineProps and defineEmits prevents interface drift between parent and child components.',
            resources: [
              {
                label: 'Vue Docs — Props',
                url: 'https://vuejs.org/guide/components/props.html',
                type: 'docs',
              },
              {
                label: 'Vue Docs — Events',
                url: 'https://vuejs.org/guide/components/events.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Composition API setup and composables',
            description:
              'The Composition API groups related logic together and makes it extractable into reusable composable functions. This pattern scales far better than the Options API for large components.',
            resources: [
              {
                label: 'Vue Docs — Composition API FAQ',
                url: 'https://vuejs.org/guide/extras/composition-api-faq.html',
                type: 'docs',
              },
              {
                label: 'Vue Docs — Composables',
                url: 'https://vuejs.org/guide/reusability/composables.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Two-Way Binding and Slots',
        children: [
          {
            title: 'v-model two-way binding in components',
            description:
              'v-model is syntactic sugar over a prop/emit pair. Implementing custom v-model on components enables reusable form controls that integrate naturally with parent state.',
            resources: [
              {
                label: 'Vue Docs — Component v-model',
                url: 'https://vuejs.org/guide/components/v-model.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Slots and scoped slots for flexible layouts',
            description:
              'Slots let parent components inject content into a child\'s template, enabling layout wrappers and compound components. Scoped slots pass data back to the parent for render-prop-like patterns.',
            resources: [
              {
                label: 'Vue Docs — Slots',
                url: 'https://vuejs.org/guide/components/slots.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Vue Single-File Components',
        children: [
          {
            title: 'SFC script setup syntax and benefits',
            description:
              'The <script setup> block is the recommended way to write Vue 3 components. It compiles to more efficient code, has top-level await support, and integrates with Volar for IDE type checking.',
            resources: [
              {
                label: 'Vue Docs — Script Setup',
                url: 'https://vuejs.org/api/sfc-script-setup.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Scoped styles and CSS modules in SFCs',
            description:
              'Scoped styles use attribute selectors to prevent leakage between components. CSS Modules offer stronger encapsulation with hashed class names when building design systems.',
            resources: [
              {
                label: 'Vue Docs — SFC CSS Features',
                url: 'https://vuejs.org/api/sfc-css-features.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Lifecycle hooks onMounted and onUnmounted',
            description:
              'Lifecycle hooks let you run code at specific moments in a component\'s life. onMounted is the safe place for DOM access and client-only APIs; onUnmounted prevents memory leaks.',
            resources: [
              {
                label: 'Vue Docs — Lifecycle Hooks',
                url: 'https://vuejs.org/guide/essentials/lifecycle.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-3': {
    sideLeft: [
      {
        title: 'Nuxt Project Structure and Configuration',
        children: [
          {
            title: 'Nuxt directory structure and conventions',
            description:
              'Nuxt uses a convention-over-configuration approach where folder names like pages/, components/, and server/ have automatic behaviour. Understanding the layout avoids fighting the framework.',
            resources: [
              {
                label: 'Nuxt Docs — Directory Structure',
                url: 'https://nuxt.com/docs/guide/directory-structure/nuxt',
                type: 'docs',
              },
            ],
          },
          {
            title: 'nuxt.config.ts application configuration reference',
            description:
              'nuxt.config.ts is the single source of truth for modules, runtime config, build options, and render strategy. Learning its key sections avoids hunting through the framework internals.',
            resources: [
              {
                label: 'Nuxt Docs — nuxt.config.ts',
                url: 'https://nuxt.com/docs/api/nuxt-config',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Layouts system for shared page shells',
            description:
              'Layouts wrap pages with persistent UI like navigation and footers. Multiple named layouts let you switch the shell per page without repeating markup.',
            resources: [
              {
                label: 'Nuxt Docs — Layouts',
                url: 'https://nuxt.com/docs/guide/directory-structure/layouts',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'File-Based Routing Concepts',
        children: [
          {
            title: 'Dynamic and catch-all route segments',
            description:
              'Nuxt maps filenames to URL segments: [id].vue creates a dynamic param and [...slug].vue catches any depth. Understanding how route params are typed prevents runtime mismatches.',
            resources: [
              {
                label: 'Nuxt Docs — Routing',
                url: 'https://nuxt.com/docs/getting-started/routing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nested routes with NuxtPage component',
            description:
              'A parent .vue file with <NuxtPage /> renders child routes inside it, enabling nested UIs like tabs and dashboards without custom router config.',
            resources: [
              {
                label: 'Nuxt Docs — Nested Routes',
                url: 'https://nuxt.com/docs/guide/directory-structure/pages#nested-routes',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Navigation and Auto-Imports',
        children: [
          {
            title: 'NuxtLink for client-side navigation',
            description:
              'NuxtLink extends <a> with prefetching and programmatic navigation via useRouter. Using it instead of plain anchors enables smooth SPA transitions inside SSR pages.',
            resources: [
              {
                label: 'Nuxt Docs — NuxtLink',
                url: 'https://nuxt.com/docs/api/components/nuxt-link',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Auto-imports for components and composables',
            description:
              'Nuxt scans the components/ and composables/ directories and makes exports available without import statements. Knowing the resolution order prevents name collisions.',
            resources: [
              {
                label: 'Nuxt Docs — Auto-imports',
                url: 'https://nuxt.com/docs/guide/concepts/auto-imports',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Route middleware for navigation guards',
            description:
              'Nuxt middleware runs before a page renders and can redirect unauthenticated users or load prerequisite data. Inline, named, and global middleware cover all use-case levels.',
            resources: [
              {
                label: 'Nuxt Docs — Middleware',
                url: 'https://nuxt.com/docs/guide/directory-structure/middleware',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'App Shell and Error Handling',
        children: [
          {
            title: 'app.vue root component customisation',
            description:
              'app.vue is the entry point rendered on every request. Adding providers, global components, and transition wrappers here avoids repeating them in every layout.',
            resources: [
              {
                label: 'Nuxt Docs — app.vue',
                url: 'https://nuxt.com/docs/guide/directory-structure/app',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Custom error.vue page for error states',
            description:
              'error.vue intercepts fatal SSR and client errors and renders a branded error page. It receives an error prop with status code and message for conditional messaging.',
            resources: [
              {
                label: 'Nuxt Docs — Error Handling',
                url: 'https://nuxt.com/docs/getting-started/error-handling',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-4': {
    sideLeft: [
      {
        title: 'Rendering Strategies Theory',
        children: [
          {
            title: 'SSR versus SSG versus CSR tradeoffs',
            description:
              'Server-side rendering delivers HTML on every request for freshness; static generation pre-renders at build time for speed; client-side rendering defers to the browser. Choosing the right mode per page drives both UX and hosting cost.',
            resources: [
              {
                label: 'Nuxt Docs — Rendering Modes',
                url: 'https://nuxt.com/docs/guide/concepts/rendering',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Hydration and the universal rendering lifecycle',
            description:
              'Universal rendering runs components on the server first, ships HTML, then re-runs Vue on the client to attach event listeners. Hydration mismatches cause subtle UI bugs that must be diagnosed through the Vue DevTools.',
            resources: [
              {
                label: 'Nuxt Docs — Universal Rendering',
                url: 'https://nuxt.com/docs/guide/concepts/rendering#universal-rendering',
                type: 'docs',
              },
            ],
          },
          {
            title: 'SEO and head management with useHead',
            description:
              'useHead and useSeoMeta let you set title, meta, and Open Graph tags reactively from any component. Proper head management is critical for search engine indexation of SSR apps.',
            resources: [
              {
                label: 'Nuxt Docs — SEO and Meta',
                url: 'https://nuxt.com/docs/getting-started/seo-meta',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Data Fetching Composable Concepts',
        children: [
          {
            title: 'useFetch and useAsyncData differences',
            description:
              'useFetch is a convenience wrapper that derives a key from the URL; useAsyncData offers more control with an explicit key and custom fetcher. Both deduplicate requests between server and client.',
            resources: [
              {
                label: 'Nuxt Docs — Data Fetching',
                url: 'https://nuxt.com/docs/getting-started/data-fetching',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Caching refresh and lazy data loading',
            description:
              'The default cache for useAsyncData prevents duplicate network calls on navigation. The lazy option defers the request until after hydration, enabling skeleton loaders without blocking rendering.',
            resources: [
              {
                label: 'Nuxt Docs — useAsyncData',
                url: 'https://nuxt.com/docs/api/composables/use-async-data',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Practical Data Fetching Patterns',
        children: [
          {
            title: 'Fetching from external REST APIs with useFetch',
            description:
              'Passing a URL string to useFetch is the fastest path to rendering remote data. The returned data, pending, and error refs wire directly to template conditionals for clean loading states.',
            resources: [
              {
                label: 'Nuxt Docs — useFetch',
                url: 'https://nuxt.com/docs/api/composables/use-fetch',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Transforming and picking response data',
            description:
              'The transform option strips unneeded fields before they enter the payload, reducing page size. pick achieves the same for simple key whitelisting without writing a transform function.',
            resources: [
              {
                label: 'Nuxt Docs — useAsyncData transform',
                url: 'https://nuxt.com/docs/api/composables/use-async-data#params',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Error handling with createError and showError',
            description:
              'createError throws a typed H3 error that Nuxt renders through error.vue. showError replaces the current page with the error UI without a full navigation, suitable for missing resource scenarios.',
            resources: [
              {
                label: 'Nuxt Docs — createError',
                url: 'https://nuxt.com/docs/api/utils/create-error',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Route-Level Rendering Control',
        children: [
          {
            title: 'definePageMeta for per-page render options',
            description:
              'definePageMeta lets you opt individual pages into static generation, set cache headers, or assign a layout at the file level without modifying nuxt.config. It keeps rendering decisions colocated with the page.',
            resources: [
              {
                label: 'Nuxt Docs — definePageMeta',
                url: 'https://nuxt.com/docs/api/utils/define-page-meta',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Hybrid rendering with route rules configuration',
            description:
              'routeRules in nuxt.config assigns SSR, ISR, SWR, or static to URL patterns, enabling a single app that renders different sections with the best strategy for each.',
            resources: [
              {
                label: 'Nuxt Docs — Hybrid Rendering',
                url: 'https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-5': {
    sideLeft: [
      {
        title: 'Nitro Server Engine Concepts',
        children: [
          {
            title: 'Nitro universal server runtime overview',
            description:
              'Nitro is the server engine underlying Nuxt that compiles to a single deployable bundle. It abstracts Node.js, edge runtimes, and serverless targets behind one API, making deployments portable.',
            resources: [
              {
                label: 'Nitro Docs — Introduction',
                url: 'https://nitro.unjs.io/guide',
                type: 'docs',
              },
            ],
          },
          {
            title: 'H3 event handler request response lifecycle',
            description:
              'Every Nitro route is an H3 event handler. Understanding how H3 reads query params, bodies, and headers, and how it sets status codes, is the foundation of writing correct API endpoints.',
            resources: [
              {
                label: 'Nitro Docs — Server Routes',
                url: 'https://nitro.unjs.io/guide/routing',
                type: 'docs',
              },
              {
                label: 'H3 Docs',
                url: 'https://h3.unjs.io/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Runtime config and environment variables',
            description:
              'runtimeConfig in nuxt.config separates public values (exposed to client) from private secrets (server-only). Environment variables prefixed NUXT_ override config values at runtime without a rebuild.',
            resources: [
              {
                label: 'Nuxt Docs — Runtime Config',
                url: 'https://nuxt.com/docs/guide/going-further/runtime-config',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Middleware and Plugin Concepts',
        children: [
          {
            title: 'Server middleware for cross-cutting concerns',
            description:
              'Nitro server middleware intercepts every request before route handlers. It is the right place for CORS headers, request logging, and attaching an authenticated user to the event context.',
            resources: [
              {
                label: 'Nuxt Docs — Server Middleware',
                url: 'https://nuxt.com/docs/guide/directory-structure/server#server-middleware',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nitro plugins for server-side lifecycle hooks',
            description:
              'Nitro plugins run once at startup and are the correct place to initialise database connections or global services, ensuring they are reused across requests rather than recreated.',
            resources: [
              {
                label: 'Nitro Docs — Plugins',
                url: 'https://nitro.unjs.io/guide/plugins',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Building API Endpoints',
        children: [
          {
            title: 'Creating REST API routes in server/api',
            description:
              'Files in server/api/ are automatically mapped to /api/** routes. Naming a file [id].get.ts restricts it to GET requests, giving you RESTful method routing with zero router configuration.',
            resources: [
              {
                label: 'Nuxt Docs — Server API Routes',
                url: 'https://nuxt.com/docs/guide/directory-structure/server',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reading body params and query strings',
            description:
              'readBody parses JSON request bodies; getQuery extracts URL query parameters. Both are H3 utilities that handle encoding edge cases so your handler focuses on business logic.',
            resources: [
              {
                label: 'Nitro Docs — Utils',
                url: 'https://nitro.unjs.io/guide/utils',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Response caching with Nitro cache API',
            description:
              'defineCachedEventHandler caches the response of a route for a configurable TTL. This turns expensive database reads or API calls into fast in-memory or Redis-backed responses.',
            resources: [
              {
                label: 'Nitro Docs — Cache',
                url: 'https://nitro.unjs.io/guide/cache',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Nitro Storage and Utilities',
        children: [
          {
            title: 'useStorage for key-value server persistence',
            description:
              'Nitro\'s built-in storage layer (powered by unstorage) provides a driver-agnostic key-value API. Swapping from memory to Redis or filesystem requires only a config change.',
            resources: [
              {
                label: 'Nitro Docs — Storage',
                url: 'https://nitro.unjs.io/guide/storage',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Scheduled tasks with Nitro tasks API',
            description:
              'Nitro 2.9+ ships a first-class tasks API for running background jobs on a schedule or on demand. This replaces cron-based workarounds for operations like cache warming and report generation.',
            resources: [
              {
                label: 'Nitro Docs — Tasks',
                url: 'https://nitro.unjs.io/guide/tasks',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-6': {
    sideLeft: [
      {
        title: 'Prisma Schema and Data Modelling',
        children: [
          {
            title: 'Prisma schema models fields and types',
            description:
              'The Prisma schema file is the single source of truth for your database shape. Defining models with correct field types and attributes generates both the migration SQL and the TypeScript client.',
            resources: [
              {
                label: 'Prisma Docs — Data Model',
                url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/models',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Relations one-to-many many-to-many in Prisma',
            description:
              'Prisma expresses foreign-key relationships through relation fields and the @relation attribute. Getting the relation direction right determines how the query API nests and joins data.',
            resources: [
              {
                label: 'Prisma Docs — Relations',
                url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Database migrations with Prisma Migrate',
            description:
              'prisma migrate dev generates and applies SQL migrations from schema diffs. The migration history is version-controlled, enabling safe rollouts and collaborative schema evolution.',
            resources: [
              {
                label: 'Prisma Docs — Migrations',
                url: 'https://www.prisma.io/docs/orm/prisma-migrate',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Querying and Data Access Patterns',
        children: [
          {
            title: 'CRUD operations with the Prisma Client',
            description:
              'The generated Prisma Client provides findMany, findUnique, create, update, and delete methods with full type safety. Autocompletion from the generated types eliminates most SQL errors.',
            resources: [
              {
                label: 'Prisma Docs — CRUD',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/crud',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Filtering sorting and pagination queries',
            description:
              'where clauses, orderBy, skip, and take combine to build paginated list endpoints. Understanding Prisma\'s nested filter syntax lets you replace complex raw SQL with composable JS objects.',
            resources: [
              {
                label: 'Prisma Docs — Filtering and Sorting',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Prisma in Nuxt Server Routes',
        children: [
          {
            title: 'Singleton PrismaClient for connection management',
            description:
              'Instantiating a new PrismaClient per request exhausts the database connection pool in development. A singleton pattern via a shared module prevents this common bug.',
            resources: [
              {
                label: 'Prisma Docs — Best Practices for Instantiation',
                url: 'https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Using Prisma inside Nitro server routes',
            description:
              'Importing the Prisma singleton inside server/api handlers keeps database access server-only. Nuxt\'s server bundling ensures the Prisma Client and its binary never reach the browser bundle.',
            resources: [
              {
                label: 'Nuxt Docs — Server Directory',
                url: 'https://nuxt.com/docs/guide/directory-structure/server',
                type: 'docs',
              },
              {
                label: 'Prisma Blog — Using Prisma with Nuxt',
                url: 'https://www.prisma.io/blog/nuxt-prisma-1-MnXIBBfMPt',
                type: 'article',
              },
            ],
          },
          {
            title: 'Seeding the database with prisma/seed.ts',
            description:
              'A seed script populates development and test databases with known data. Running it after each migration reset ensures a consistent baseline for local development and CI pipelines.',
            resources: [
              {
                label: 'Prisma Docs — Seeding',
                url: 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Advanced Database Patterns',
        children: [
          {
            title: 'Transactions for atomic multi-step operations',
            description:
              'prisma.$transaction executes multiple queries atomically, rolling back all if any fails. Interactive transactions handle complex cases where each step depends on the result of the previous.',
            resources: [
              {
                label: 'Prisma Docs — Transactions',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/transactions',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Prisma Studio for visual database exploration',
            description:
              'Prisma Studio is a browser-based GUI for browsing and editing records. It speeds up debugging by removing the need to write read-only queries to verify data during development.',
            resources: [
              {
                label: 'Prisma Docs — Prisma Studio',
                url: 'https://www.prisma.io/docs/orm/tools/prisma-studio',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-7': {
    sideLeft: [
      {
        title: 'State Management Theory',
        children: [
          {
            title: 'useState for simple SSR-safe shared state',
            description:
              'Nuxt\'s useState composable creates reactive state that is serialised into the server payload and hydrated on the client. Unlike module-level variables, it is safe to use in SSR because each request gets isolated state.',
            resources: [
              {
                label: 'Nuxt Docs — useState',
                url: 'https://nuxt.com/docs/api/composables/use-state',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Pinia store architecture and devtools',
            description:
              'Pinia is the official Vue store, replacing Vuex. Its modular store design, TypeScript-first API, and Vue DevTools integration make it the standard for complex client state in Nuxt apps.',
            resources: [
              {
                label: 'Pinia Docs — Introduction',
                url: 'https://pinia.vuejs.org/introduction.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Authentication flows and session concepts',
            description:
              'Session-based auth stores a signed identifier in a cookie; JWT auth encodes claims in a token. Understanding the tradeoffs between the two patterns guides the right implementation choice for a Nuxt app.',
            resources: [
              {
                label: 'web.dev — Sign-in form best practices',
                url: 'https://web.dev/articles/sign-in-form-best-practices',
                type: 'article',
              },
            ],
          },
        ],
      },
      {
        title: 'Authentication Implementation Concepts',
        children: [
          {
            title: 'Server middleware for route protection',
            description:
              'A Nuxt server middleware can read the session cookie on every request and attach the user to event.context. Route handlers can then access event.context.user without re-querying the database.',
            resources: [
              {
                label: 'Nuxt Docs — Server Middleware',
                url: 'https://nuxt.com/docs/guide/directory-structure/server#server-middleware',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Client-side route guards with definePageMeta',
            description:
              'A named middleware referenced in definePageMeta runs before each navigation. Reading auth state from a Pinia store enables redirect-on-unauthenticated without server involvement.',
            resources: [
              {
                label: 'Nuxt Docs — Route Middleware',
                url: 'https://nuxt.com/docs/guide/directory-structure/middleware',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Pinia in Practice',
        children: [
          {
            title: 'Defining Pinia stores with defineStore',
            description:
              'Pinia stores can be defined with options syntax (like Vuex) or setup syntax (like Composition API). The setup syntax is preferred in Nuxt because it aligns with <script setup> and enables better tree-shaking.',
            resources: [
              {
                label: 'Pinia Docs — Defining a Store',
                url: 'https://pinia.vuejs.org/core-concepts/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nuxt-Pinia SSR serialisation and hydration',
            description:
              '@pinia/nuxt handles serialising store state into the HTML payload and rehydrating it on the client. Without this module, stores initialised on the server would reset on hydration.',
            resources: [
              {
                label: 'Pinia Docs — Nuxt integration',
                url: 'https://pinia.vuejs.org/ssr/nuxt.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Cookies, Sessions, and Security',
        children: [
          {
            title: 'Secure HTTP-only cookies with H3 setCookie',
            description:
              'Setting HttpOnly and Secure flags on session cookies prevents JavaScript access and enforces HTTPS transmission, mitigating XSS and network interception attacks.',
            resources: [
              {
                label: 'MDN — Set-Cookie',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Password hashing with bcrypt in server routes',
            description:
              'Passwords must never be stored in plaintext. bcrypt adds a work factor and per-password salt so that even a database breach does not expose user credentials directly.',
            resources: [
              {
                label: 'npm — bcryptjs',
                url: 'https://www.npmjs.com/package/bcryptjs',
                type: 'docs',
              },
            ],
          },
          {
            title: 'CSRF protection and same-site cookie policy',
            description:
              'SameSite=Strict or Lax cookie attribute blocks cross-origin form submissions from exploiting authenticated sessions. Combining it with a CSRF token provides defence in depth for mutation endpoints.',
            resources: [
              {
                label: 'web.dev — CSRF protection',
                url: 'https://web.dev/articles/security-attacks#csrf',
                type: 'article',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-8': {
    sideLeft: [
      {
        title: 'Nuxt Modules and Plugin Architecture',
        children: [
          {
            title: 'Official Nuxt modules ecosystem overview',
            description:
              'The Nuxt module ecosystem provides plug-and-play integrations for image optimisation, PWA, auth, i18n, and more. Modules extend nuxt.config at build time without manual webpack or Vite configuration.',
            resources: [
              {
                label: 'Nuxt Modules Directory',
                url: 'https://nuxt.com/modules',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nuxt plugins for app-level side effects',
            description:
              'Plugins in the plugins/ directory run once per app instance, making them the right place to register global Vue directives, inject third-party libraries, or set up error tracking SDKs.',
            resources: [
              {
                label: 'Nuxt Docs — Plugins',
                url: 'https://nuxt.com/docs/guide/directory-structure/plugins',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Runtime hooks for extending Nuxt lifecycle',
            description:
              'Nuxt exposes hooks like app:created and page:finish that plugins and modules can subscribe to. They enable cross-cutting behaviours like analytics page-view tracking without modifying individual pages.',
            resources: [
              {
                label: 'Nuxt Docs — Lifecycle Hooks',
                url: 'https://nuxt.com/docs/api/advanced/hooks',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Nuxt Layers and Composable Patterns',
        children: [
          {
            title: 'Nuxt Layers for monorepo code sharing',
            description:
              'Layers extend Nuxt with additional pages, components, and config from a local directory or npm package. They are the official mechanism for sharing a design system or auth flow across multiple Nuxt apps.',
            resources: [
              {
                label: 'Nuxt Docs — Layers',
                url: 'https://nuxt.com/docs/getting-started/layers',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Advanced composables with provide and inject',
            description:
              'Vue\'s provide/inject crosses the composable/component boundary to share context without prop drilling. It is the basis of patterns like a toast notification system or a form validation context.',
            resources: [
              {
                label: 'Vue Docs — Provide and Inject',
                url: 'https://vuejs.org/guide/components/provide-inject.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Image and Font Optimisation',
        children: [
          {
            title: 'Nuxt Image module for responsive images',
            description:
              '@nuxt/image generates responsive srcset attributes and integrates with image CDNs like Cloudinary and Imgix. It prevents layout shift through automatic width/height injection and lazy loading.',
            resources: [
              {
                label: 'Nuxt Image Docs',
                url: 'https://image.nuxt.com/getting-started/installation',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Font optimisation with nuxt/fonts module',
            description:
              '@nuxt/fonts automatically injects font-display:swap and preload hints for Google, Bunny, and self-hosted fonts, eliminating the manual font optimisation checklist.',
            resources: [
              {
                label: 'Nuxt Fonts Docs',
                url: 'https://fonts.nuxt.com/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Icon loading with nuxt-icon module',
            description:
              'nuxt-icon bundles Iconify\'s large icon library and serves only the SVGs your pages use. Using it instead of icon fonts reduces unused CSS and improves render blocking scores.',
            resources: [
              {
                label: 'nuxt-icon on GitHub',
                url: 'https://github.com/nuxt/icon',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Build and Module Authoring',
        children: [
          {
            title: 'Building a local Nuxt module with defineNuxtModule',
            description:
              'defineNuxtModule provides the scaffolding for a Nuxt module including meta, defaults, and a setup hook. Writing even small modules teaches the build-time extension model used by the entire ecosystem.',
            resources: [
              {
                label: 'Nuxt Docs — Module Author Guide',
                url: 'https://nuxt.com/docs/guide/going-further/modules',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nuxt DevTools for visual debugging and inspection',
            description:
              'Nuxt DevTools surfaces pages, components, imports, server routes, and module contributions in a browser panel. Using it dramatically shortens debugging sessions compared to reading log output.',
            resources: [
              {
                label: 'Nuxt DevTools Docs',
                url: 'https://devtools.nuxt.com/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-9': {
    sideLeft: [
      {
        title: 'Core Web Vitals and Performance Theory',
        children: [
          {
            title: 'LCP FID and CLS explained for Nuxt apps',
            description:
              'Core Web Vitals measure loading (LCP), interactivity (INP), and visual stability (CLS). Nuxt\'s SSR gives LCP a head start, but client hydration and third-party scripts can still cause regressions.',
            resources: [
              {
                label: 'web.dev — Core Web Vitals',
                url: 'https://web.dev/explore/learn-core-web-vitals',
                type: 'article',
              },
            ],
          },
          {
            title: 'Code splitting and lazy loading strategies',
            description:
              'Nuxt automatically splits each page into its own chunk. Using defineAsyncComponent for heavy UI components and lazy: true on useFetch keeps the initial bundle small and time-to-interactive low.',
            resources: [
              {
                label: 'Nuxt Docs — Lazy Loading Components',
                url: 'https://nuxt.com/docs/guide/directory-structure/components#dynamic-imports',
                type: 'docs',
              },
              {
                label: 'web.dev — Code Splitting',
                url: 'https://web.dev/articles/code-splitting-suspense',
                type: 'article',
              },
            ],
          },
          {
            title: 'ISR and SWR caching for dynamic pages',
            description:
              'Incremental Static Regeneration re-renders pages in the background after a TTL expires. Stale-While-Revalidate serves cached content instantly and updates asynchronously, combining speed with freshness.',
            resources: [
              {
                label: 'Nuxt Docs — Caching',
                url: 'https://nuxt.com/docs/guide/concepts/rendering#incremental-static-generation',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'SEO Implementation Theory',
        children: [
          {
            title: 'Structured data and JSON-LD schema markup',
            description:
              'JSON-LD embedded in <head> communicates page semantics to search engines, enabling rich results like FAQ dropdowns, product prices, and event dates in SERPs.',
            resources: [
              {
                label: 'Google — Structured Data overview',
                url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Open Graph and Twitter Card meta tags',
            description:
              'OG tags control how URLs unfurl in social media previews. Setting og:title, og:description, and og:image with useSeoMeta ensures every page looks correct when shared.',
            resources: [
              {
                label: 'Nuxt Docs — useSeoMeta',
                url: 'https://nuxt.com/docs/api/composables/use-seo-meta',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Performance Tooling',
        children: [
          {
            title: 'Lighthouse auditing and scoring workflow',
            description:
              'Running Lighthouse in CI on every PR surfaces performance regressions before they reach production. The Lighthouse CLI can fail the build when scores drop below configured thresholds.',
            resources: [
              {
                label: 'Lighthouse Docs',
                url: 'https://developer.chrome.com/docs/lighthouse/overview',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Bundle analysis with nuxt analyze command',
            description:
              'nuxt analyze opens a visual treemap of the client bundle. It reveals which dependencies are bloating the bundle so you can replace them with lighter alternatives or move them server-side.',
            resources: [
              {
                label: 'Nuxt Docs — Commands — nuxt analyze',
                url: 'https://nuxt.com/docs/api/commands/analyze',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Web Vitals monitoring with Vercel Speed Insights',
            description:
              'Vercel Speed Insights collects real-user Core Web Vitals and surfaces p75 scores per page. Field data reveals issues that synthetic Lighthouse tests miss due to geographic and device variation.',
            resources: [
              {
                label: 'Vercel Speed Insights Docs',
                url: 'https://vercel.com/docs/speed-insights',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Sitemap and Crawlability',
        children: [
          {
            title: 'Dynamic sitemap generation with nuxt-simple-sitemap',
            description:
              'nuxt-simple-sitemap auto-generates a sitemap from Nuxt routes and can extend it with data from the database. A correct sitemap speeds up Google\'s discovery of new and updated pages.',
            resources: [
              {
                label: 'nuxt-simple-sitemap Docs',
                url: 'https://nuxtseo.com/sitemap/getting-started/installation',
                type: 'docs',
              },
            ],
          },
          {
            title: 'robots.txt configuration and crawl control',
            description:
              'The Nuxt robots module generates robots.txt from config rules, blocking crawlers from admin routes and staging environments without a static file that gets outdated.',
            resources: [
              {
                label: 'nuxt-robots Docs',
                url: 'https://nuxtseo.com/robots/getting-started/installation',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'nuxt-dev-10': {
    sideLeft: [
      {
        title: 'Testing Theory and Strategy',
        children: [
          {
            title: 'Testing pyramid unit integration and E2E',
            description:
              'A healthy test suite combines fast unit tests for logic, integration tests for API routes and composables, and a small number of E2E tests for critical user journeys. Nuxt provides utilities for all three levels.',
            resources: [
              {
                label: 'web.dev — Testing strategies',
                url: 'https://web.dev/articles/ta-strategies',
                type: 'article',
              },
            ],
          },
          {
            title: 'Vitest configuration for Nuxt projects',
            description:
              'Vitest is the recommended test runner for Nuxt, sharing the same Vite config for zero-overhead setup. The @nuxt/test-utils/config preset handles the environment and auto-import stubs automatically.',
            resources: [
              {
                label: 'Nuxt Docs — Testing',
                url: 'https://nuxt.com/docs/getting-started/testing',
                type: 'docs',
              },
              {
                label: 'Vitest Docs',
                url: 'https://vitest.dev/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'End-to-end testing concepts with Playwright',
            description:
              'Playwright drives a real browser against a running Nuxt server, validating complete user flows including navigation, form submission, and auth. It catches integration bugs that unit tests cannot surface.',
            resources: [
              {
                label: 'Playwright Docs — Getting Started',
                url: 'https://playwright.dev/docs/intro',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Deployment and Environment Concepts',
        children: [
          {
            title: 'Nuxt deployment presets for different targets',
            description:
              'Nuxt build output adapts to the target platform via presets: node-server for traditional hosting, vercel for Vercel edge functions, and cloudflare-pages for the edge. Selecting the right preset avoids runtime incompatibilities.',
            resources: [
              {
                label: 'Nuxt Docs — Deployment',
                url: 'https://nuxt.com/docs/getting-started/deployment',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Environment variables management in production',
            description:
              'Production secrets must live in platform environment variables, never in committed .env files. Nuxt\'s runtimeConfig bridges platform env vars into the app securely at runtime.',
            resources: [
              {
                label: 'Nuxt Docs — Runtime Config',
                url: 'https://nuxt.com/docs/guide/going-further/runtime-config',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Writing Tests Practically',
        children: [
          {
            title: 'Unit testing composables with mountSuspended',
            description:
              'mountSuspended from @nuxt/test-utils renders a component inside a Nuxt context so auto-imports and plugins are available. It is the standard way to test composables and components that rely on Nuxt internals.',
            resources: [
              {
                label: 'Nuxt Docs — Unit Testing',
                url: 'https://nuxt.com/docs/getting-started/testing#unit-testing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Testing server API routes with $fetch',
            description:
              '$fetch from @nuxt/test-utils makes HTTP requests to a test server instance, allowing you to assert API responses and side-effects without mocking the entire Nitro stack.',
            resources: [
              {
                label: 'Nuxt Docs — E2E Testing',
                url: 'https://nuxt.com/docs/getting-started/testing#end-to-end-testing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Playwright page object model for maintainable tests',
            description:
              'The Page Object Model encapsulates selectors and interactions behind a class, so when the UI changes only the page object needs updating rather than every test that touches that page.',
            resources: [
              {
                label: 'Playwright Docs — Page Object Model',
                url: 'https://playwright.dev/docs/pom',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Deployment and Monitoring',
        children: [
          {
            title: 'Zero-downtime deploys with Vercel or Netlify',
            description:
              'Platforms like Vercel perform atomic deployments with instant rollback. Connecting the git repo enables preview deployments on every PR, giving stakeholders a testable URL before merge.',
            resources: [
              {
                label: 'Vercel Docs — Deployments overview',
                url: 'https://vercel.com/docs/deployments/overview',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Error monitoring with Sentry Nuxt SDK',
            description:
              'The Sentry Nuxt SDK captures both server-side Nitro errors and client-side Vue exceptions in one project, attaching component stack traces and breadcrumbs for fast diagnosis in production.',
            resources: [
              {
                label: 'Sentry Docs — Nuxt',
                url: 'https://docs.sentry.io/platforms/javascript/guides/nuxt/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Patch logic ───────────────────────────────────────────────────────────────

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

if (!Array.isArray(data['nuxt-dev'])) {
  console.error('ERROR: nuxt-dev track not found in fullstack.json');
  process.exit(1);
}

let applied = 0;

for (const node of data['nuxt-dev']) {
  const patch = patches[node.id];
  if (patch) {
    node.sideLeft = patch.sideLeft;
    node.sideRight = patch.sideRight;
    applied++;
  }
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches`);
