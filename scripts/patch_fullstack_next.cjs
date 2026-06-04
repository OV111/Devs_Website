'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(
  __dirname,
  '../src/data/roadmaps/fullstack.json'
);

// ─── Patch data ────────────────────────────────────────────────────────────────

const patches = {
  'next-fullstack-1': {
    sideLeft: [
      {
        title: 'TypeScript Core Concepts',
        children: [
          {
            title: 'Types, interfaces, and type aliases',
            description:
              'TypeScript lets you annotate variables and function signatures with static types. Understanding the difference between type aliases and interfaces is key to writing maintainable code.',
            resources: [
              {
                label: 'TypeScript Handbook – Everyday Types',
                url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
                type: 'docs',
              },
              {
                label: 'TypeScript Handbook – Interfaces',
                url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Generics and utility types in TypeScript',
            description:
              'Generics allow you to write reusable, type-safe functions and components. Built-in utility types like Partial, Pick, and Omit reduce repetitive type definitions.',
            resources: [
              {
                label: 'TypeScript Handbook – Generics',
                url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
                type: 'docs',
              },
              {
                label: 'TypeScript Handbook – Utility Types',
                url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Union, intersection, and narrowing types',
            description:
              'Union types model values that can be one of several types, while type narrowing via guards lets TypeScript infer the correct shape at runtime. These patterns are essential for robust data handling.',
            resources: [
              {
                label: 'TypeScript Handbook – Narrowing',
                url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'React Component Model',
        children: [
          {
            title: 'Functional components, props, and composition',
            description:
              'React models UI as a tree of composable functions that receive props and return JSX. Understanding component composition patterns prevents prop drilling and keeps code modular.',
            resources: [
              {
                label: 'React – Describing the UI',
                url: 'https://react.dev/learn/describing-the-ui',
                type: 'docs',
              },
            ],
          },
          {
            title: 'State management with hooks and context',
            description:
              'useState, useReducer, and useContext are the foundational hooks for local and shared state. Knowing when to lift state versus use context keeps components predictable.',
            resources: [
              {
                label: 'React – Adding Interactivity',
                url: 'https://react.dev/learn/adding-interactivity',
                type: 'docs',
              },
              {
                label: 'React – Managing State',
                url: 'https://react.dev/learn/managing-state',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Effect hook and lifecycle understanding',
            description:
              'useEffect synchronizes a component with external systems and replaces class lifecycle methods. Correctly specifying the dependency array prevents stale closures and infinite loops.',
            resources: [
              {
                label: 'React – Synchronizing with Effects',
                url: 'https://react.dev/learn/synchronizing-with-effects',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'TypeScript Tooling Setup',
        children: [
          {
            title: 'Configure tsconfig for a Next.js project',
            description:
              'Next.js ships with a sensible tsconfig.json but you should understand strict mode, path aliases, and module resolution options. Correct configuration prevents hard-to-debug type errors.',
            resources: [
              {
                label: 'Next.js – TypeScript Configuration',
                url: 'https://nextjs.org/docs/app/building-your-application/configuring/typescript',
                type: 'docs',
              },
              {
                label: 'TypeScript – TSConfig Reference',
                url: 'https://www.typescriptlang.org/tsconfig',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Typing React event handlers and form inputs',
            description:
              'React events wrap native browser events and have their own generic types. Typing onChange, onClick, and form submit handlers prevents runtime errors in UI interactions.',
            resources: [
              {
                label: 'React TypeScript Cheatsheet – Events',
                url: 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Modern JS Patterns',
        children: [
          {
            title: 'Destructuring, spread, and optional chaining',
            description:
              'ES2020+ syntax like optional chaining (?.) and nullish coalescing (??) reduces boilerplate null checks. These patterns appear constantly in React props and API response handling.',
            resources: [
              {
                label: 'MDN – Optional Chaining',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Async/await and Promise handling patterns',
            description:
              'Nearly all data-fetching in Next.js uses async/await. Understanding Promise.all, error handling with try/catch, and avoiding sequential awaits in loops makes data fetching efficient.',
            resources: [
              {
                label: 'MDN – async function',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
                type: 'docs',
              },
            ],
          },
          {
            title: 'ES modules, imports, and barrel files',
            description:
              'Next.js uses ES module syntax throughout. Organizing exports via index barrel files and understanding named vs default exports keeps large codebases navigable.',
            resources: [
              {
                label: 'MDN – JavaScript Modules',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-2': {
    sideLeft: [
      {
        title: 'App Router Fundamentals',
        children: [
          {
            title: 'File-system routing and the app directory',
            description:
              'The Next.js App Router maps the file system directly to URL routes. Every folder with a page.tsx becomes a URL segment, making navigation structure instantly visible.',
            resources: [
              {
                label: 'Next.js – Routing Fundamentals',
                url: 'https://nextjs.org/docs/app/building-your-application/routing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nested layouts and shared UI segments',
            description:
              'layout.tsx files wrap all children in a segment and persist across navigations without re-mounting. This is how persistent sidebars, headers, and auth wrappers are built.',
            resources: [
              {
                label: 'Next.js – Layouts and Pages',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Dynamic routes and catch-all segments',
            description:
              '[param] folders create dynamic URL segments, while [...slug] catches all sub-paths. These patterns power product pages, blog posts, and any content-driven routing.',
            resources: [
              {
                label: 'Next.js – Dynamic Routes',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Navigation and Route Organization',
        children: [
          {
            title: 'Route groups for layout organisation',
            description:
              'Wrapping folders in (parentheses) creates route groups that do not affect the URL. This lets you apply different layouts to marketing pages versus authenticated dashboard routes.',
            resources: [
              {
                label: 'Next.js – Route Groups',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/route-groups',
                type: 'docs',
              },
            ],
          },
          {
            title: 'loading.tsx and error.tsx boundary files',
            description:
              'Placing loading.tsx and error.tsx alongside page.tsx automatically wraps that segment in Suspense and error boundaries. These files dramatically improve perceived performance and resilience.',
            resources: [
              {
                label: 'Next.js – Loading UI and Streaming',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming',
                type: 'docs',
              },
              {
                label: 'Next.js – Error Handling',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/error-handling',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Navigation in Practice',
        children: [
          {
            title: 'Link component and programmatic navigation',
            description:
              'The <Link> component prefetches routes and provides client-side navigation without a full page reload. useRouter from next/navigation enables imperative redirects after form submissions.',
            resources: [
              {
                label: 'Next.js – Link Component',
                url: 'https://nextjs.org/docs/app/api-reference/components/link',
                type: 'docs',
              },
              {
                label: 'Next.js – useRouter Hook',
                url: 'https://nextjs.org/docs/app/api-reference/functions/use-router',
                type: 'docs',
              },
            ],
          },
          {
            title: 'usePathname and active link highlighting',
            description:
              'usePathname returns the current URL path so you can apply active styles to navigation links. This pattern is used in every sidebar and top navigation component.',
            resources: [
              {
                label: 'Next.js – usePathname',
                url: 'https://nextjs.org/docs/app/api-reference/functions/use-pathname',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Parallel routes and intercepting routes',
            description:
              'Parallel routes render multiple pages in the same layout simultaneously (e.g. modals), while intercepting routes show a different UI on navigation without leaving the page.',
            resources: [
              {
                label: 'Next.js – Parallel Routes',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/parallel-routes',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Route Metadata and SEO',
        children: [
          {
            title: 'Metadata API for SEO and Open Graph',
            description:
              'Exporting a metadata object or generateMetadata function from any page sets title, description, and OG tags. Proper metadata is critical for search ranking and social sharing.',
            resources: [
              {
                label: 'Next.js – Metadata',
                url: 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata',
                type: 'docs',
              },
            ],
          },
          {
            title: 'generateStaticParams for static dynamic routes',
            description:
              'generateStaticParams pre-renders dynamic route segments at build time, producing static HTML for all known paths. This is essential for blog, product, and documentation sites.',
            resources: [
              {
                label: 'Next.js – generateStaticParams',
                url: 'https://nextjs.org/docs/app/api-reference/functions/generate-static-params',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-3': {
    sideLeft: [
      {
        title: 'Rendering Mental Models',
        children: [
          {
            title: 'Server vs client component boundary rules',
            description:
              "Server Components render only on the server and can access databases directly, while Client Components run in the browser and handle interactivity. The boundary is set by the 'use client' directive.",
            resources: [
              {
                label: 'Next.js – Server and Client Components',
                url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
                type: 'docs',
              },
              {
                label: 'React – Server Components',
                url: 'https://react.dev/reference/rsc/server-components',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Static vs dynamic rendering strategies',
            description:
              'A route is statically rendered at build time unless it uses dynamic functions like cookies() or headers(). Understanding this trade-off lets you choose the right caching strategy per route.',
            resources: [
              {
                label: 'Next.js – Static and Dynamic Rendering',
                url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Streaming and progressive page hydration',
            description:
              'Streaming lets the server send HTML in chunks as data becomes available, so users see content faster. Wrapping slow data-fetching components in <Suspense> enables this progressive loading.',
            resources: [
              {
                label: 'Next.js – Streaming with Suspense',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Caching and Revalidation Theory',
        children: [
          {
            title: 'Next.js caching layers and how they interact',
            description:
              "Next.js has four caching layers: Request Memoization, Data Cache, Full Route Cache, and Router Cache. Understanding each layer's scope prevents surprising stale data bugs.",
            resources: [
              {
                label: 'Next.js – Caching Overview',
                url: 'https://nextjs.org/docs/app/building-your-application/caching',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Time-based and on-demand revalidation concepts',
            description:
              "next: { revalidate } controls how often the Data Cache is refreshed, while revalidatePath and revalidateTag clear the cache on demand. These patterns enable a 'stale-while-revalidate' UX.",
            resources: [
              {
                label: 'Next.js – Revalidating Data',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Data Fetching Patterns',
        children: [
          {
            title: 'fetch in Server Components with caching options',
            description:
              'The extended fetch API in Server Components accepts a cache or next option to control memoization and revalidation. Fetching data directly in server components eliminates extra API round-trips.',
            resources: [
              {
                label: 'Next.js – Data Fetching and Caching',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Parallel data fetching with Promise.all',
            description:
              'Awaiting multiple independent fetches sequentially wastes time. Initiating them in parallel with Promise.all reduces total load time to the duration of the slowest fetch.',
            resources: [
              {
                label: 'Next.js – Parallel and Sequential Fetching',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching',
                type: 'docs',
              },
            ],
          },
          {
            title: 'use client directive and client-side fetching',
            description:
              "Adding 'use client' at the top of a file marks it as a Client Component. For client-side data fetching, TanStack Query provides caching, refetching, and loading state management.",
            resources: [
              {
                label: 'Next.js – Client Components',
                url: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components',
                type: 'docs',
              },
              {
                label: 'TanStack Query – Quick Start',
                url: 'https://tanstack.com/query/latest/docs/framework/react/quick-start',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Suspense and Skeleton UI',
        children: [
          {
            title: 'Suspense boundaries for incremental page loading',
            description:
              "Wrapping async Server Components in <Suspense fallback={<Skeleton />}> lets the rest of the page render immediately. This pattern transforms a blocked page into a progressively loaded experience.",
            resources: [
              {
                label: 'React – Suspense Reference',
                url: 'https://react.dev/reference/react/Suspense',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Error boundaries to gracefully handle fetch errors',
            description:
              'error.tsx files create React error boundaries that catch thrown errors in a segment and render a fallback UI. This prevents a single failed data fetch from crashing the whole page.',
            resources: [
              {
                label: 'Next.js – Error Handling',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/error-handling',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-4': {
    sideLeft: [
      {
        title: 'Prisma Schema Design',
        children: [
          {
            title: 'Defining models, fields, and scalar types',
            description:
              'The Prisma schema is a single source of truth for your database structure. Models map to tables, and scalar types like String, Int, DateTime map to database column types.',
            resources: [
              {
                label: 'Prisma – Data Model',
                url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/models',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Relations: one-to-many and many-to-many',
            description:
              'Prisma uses relation fields and foreign key attributes to express database relationships. Understanding @relation, implicit join tables, and relation scalar fields is essential for any real data model.',
            resources: [
              {
                label: 'Prisma – Relations',
                url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Migrations workflow and schema evolution',
            description:
              'prisma migrate dev generates SQL migrations from schema changes and applies them locally. Understanding migration history and how to handle data migrations prevents data loss during schema changes.',
            resources: [
              {
                label: 'Prisma – Migrate Dev',
                url: 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Query Patterns',
        children: [
          {
            title: 'Filtering, sorting, and pagination with Prisma',
            description:
              'Prisma Client provides type-safe where, orderBy, take, and skip options for every query. Cursor-based pagination is more efficient than offset for large datasets.',
            resources: [
              {
                label: 'Prisma – Filtering and Sorting',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting',
                type: 'docs',
              },
              {
                label: 'Prisma – Pagination',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/pagination',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nested writes and transactional operations',
            description:
              'Prisma supports nested create/connect/update in a single query, which keeps related records consistent. For multi-step operations, $transaction ensures atomicity.',
            resources: [
              {
                label: 'Prisma – Transactions',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/transactions',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Prisma Setup and Tooling',
        children: [
          {
            title: 'Install Prisma and configure database connection',
            description:
              'Prisma setup requires the prisma CLI and @prisma/client packages, and a DATABASE_URL in .env. Connecting to PostgreSQL locally with Docker is the standard development workflow.',
            resources: [
              {
                label: 'Prisma – Getting Started with Next.js',
                url: 'https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-nextjs',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Prisma Studio for visual database inspection',
            description:
              'prisma studio opens a browser-based GUI to browse and edit your database records. It is the fastest way to verify that your mutations and migrations are working correctly.',
            resources: [
              {
                label: 'Prisma – Prisma Studio',
                url: 'https://www.prisma.io/docs/orm/tools/prisma-studio',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Seeding the database with realistic test data',
            description:
              "A seed script populates your development database with consistent starting data. Prisma's seed configuration in package.json lets you run prisma db seed to reset state at any time.",
            resources: [
              {
                label: 'Prisma – Seeding',
                url: 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Prisma in Next.js',
        children: [
          {
            title: 'Singleton Prisma Client pattern in Next.js',
            description:
              'Hot reloading in development creates multiple Prisma Client instances, exhausting connection pools. The singleton pattern in lib/prisma.ts stores the client on the global object to prevent this.',
            resources: [
              {
                label: 'Prisma – Best Practices for Next.js',
                url: 'https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Type-safe CRUD with generated Prisma types',
            description:
              'Prisma Client generates TypeScript types from your schema, so every query result is fully typed. This eliminates entire categories of runtime errors when reading and writing data.',
            resources: [
              {
                label: 'Prisma – CRUD Operations',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/crud',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-5': {
    sideLeft: [
      {
        title: 'Server Actions Architecture',
        children: [
          {
            title: 'What server actions are and how they execute',
            description:
              "Server Actions are async functions marked with 'use server' that run on the server and can be called from client components or forms. They eliminate the need for separate API routes for form submissions.",
            resources: [
              {
                label: 'Next.js – Server Actions and Mutations',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Form submissions with the action prop',
            description:
              'Passing a Server Action to the HTML form action attribute submits the form directly to the server without JavaScript. This enables progressive enhancement and works even before hydration.',
            resources: [
              {
                label: 'React – useActionState',
                url: 'https://react.dev/reference/react/useActionState',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Revalidation and cache invalidation after mutations',
            description:
              'After a successful mutation, calling revalidatePath or revalidateTag clears the Next.js cache for the affected routes. Without this step, the UI will show stale data after writes.',
            resources: [
              {
                label: 'Next.js – revalidatePath',
                url: 'https://nextjs.org/docs/app/api-reference/functions/revalidatePath',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Validation and Error Handling',
        children: [
          {
            title: 'Schema validation with Zod in server actions',
            description:
              'Parsing incoming form data with a Zod schema validates types and shapes before they reach your database. Zod provides detailed error messages that can be returned to the client.',
            resources: [
              {
                label: 'Zod – Getting Started',
                url: 'https://zod.dev/?id=basic-usage',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Returning errors and success states from actions',
            description:
              'Server Actions can return objects with error or success fields rather than throwing, giving the client UI something meaningful to display. useActionState connects this return value to form state.',
            resources: [
              {
                label: 'Next.js – Error Handling in Server Actions',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#error-handling',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Route Handlers for APIs',
        children: [
          {
            title: 'Route handlers as REST API endpoints',
            description:
              'route.ts files in the app directory export named HTTP method handlers (GET, POST, etc.) to create API endpoints. These are used when you need a public API consumed by external clients.',
            resources: [
              {
                label: 'Next.js – Route Handlers',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reading request body and query parameters',
            description:
              'Route handlers receive a NextRequest object from which you can read JSON body, search params, and headers. Always validate external input before processing.',
            resources: [
              {
                label: 'Next.js – NextRequest API',
                url: 'https://nextjs.org/docs/app/api-reference/functions/next-request',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Optimistic UI and Pending States',
        children: [
          {
            title: 'useFormStatus for pending button states',
            description:
              'React\'s useFormStatus hook reads the pending state of the nearest form, letting you disable submit buttons and show spinners without manual state management.',
            resources: [
              {
                label: 'React – useFormStatus',
                url: 'https://react.dev/reference/react-dom/hooks/useFormStatus',
                type: 'docs',
              },
            ],
          },
          {
            title: 'useOptimistic for instant UI feedback',
            description:
              'useOptimistic immediately applies a predicted UI update before the server responds, then reconciles the real data. This pattern makes mutations feel instantaneous to users.',
            resources: [
              {
                label: 'React – useOptimistic',
                url: 'https://react.dev/reference/react/useOptimistic',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Zod form validation and client-side error display',
            description:
              'Running a Zod safeParse on form data before submission catches obvious errors immediately. Displaying field-level Zod error messages guides users to fix their input without a server round-trip.',
            resources: [
              {
                label: 'Zod – SafeParse',
                url: 'https://zod.dev/?id=safeparse',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-6': {
    sideLeft: [
      {
        title: 'Authentication Concepts',
        children: [
          {
            title: 'OAuth flow and credential-based authentication',
            description:
              'OAuth delegates authentication to a trusted provider like Google or GitHub, while credentials providers handle username/password directly. Understanding both flows lets you offer users multiple sign-in options.',
            resources: [
              {
                label: 'Auth.js – Providers Overview',
                url: 'https://authjs.dev/getting-started/authentication/oauth',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Sessions vs JWT token strategies',
            description:
              'Session strategy stores a reference in a server-side store and sends a session ID cookie, while JWT encodes the full session in a signed token. Each has different security and scalability trade-offs.',
            resources: [
              {
                label: 'Auth.js – Session Management',
                url: 'https://authjs.dev/concepts/session-strategies',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Protecting routes with middleware-based guards',
            description:
              'Next.js middleware runs at the edge before a request reaches any page, making it the ideal place to redirect unauthenticated users. This centralizes auth protection without duplicating checks per page.',
            resources: [
              {
                label: 'Auth.js – Middleware Protection',
                url: 'https://authjs.dev/getting-started/session-management/protecting',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Auth.js Integration Patterns',
        children: [
          {
            title: 'Prisma adapter for persisting sessions to database',
            description:
              'The Prisma adapter stores users, sessions, and accounts in your database, enabling user lookup and multi-device session management. It requires specific Prisma model definitions in your schema.',
            resources: [
              {
                label: 'Auth.js – Prisma Adapter',
                url: 'https://authjs.dev/getting-started/adapters/prisma',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reading session server-side and client-side',
            description:
              'auth() returns the session in Server Components and Server Actions, while useSession provides it in Client Components. Knowing which to use avoids unnecessary client-side session fetches.',
            resources: [
              {
                label: 'Auth.js – Getting the Session',
                url: 'https://authjs.dev/getting-started/session-management/get-session',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Auth.js Setup',
        children: [
          {
            title: 'Install and configure Auth.js with Next.js',
            description:
              'Auth.js (formerly NextAuth.js v5) is configured in a single auth.ts file that exports auth, signIn, and signOut. The route handler at app/api/auth/[...nextauth] handles all OAuth callbacks.',
            resources: [
              {
                label: 'Auth.js – Next.js Quick Start',
                url: 'https://authjs.dev/getting-started/installation',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Environment variables for OAuth credentials',
            description:
              'Each OAuth provider requires a client ID and secret obtained from their developer console. AUTH_SECRET must also be set as a random string for signing tokens.',
            resources: [
              {
                label: 'Auth.js – Environment Variables',
                url: 'https://authjs.dev/getting-started/deployment',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Route and Action Protection',
        children: [
          {
            title: 'Protecting server actions by checking session',
            description:
              'Calling auth() at the top of a Server Action and throwing if the session is null prevents unauthenticated mutations. Never rely solely on UI-level hiding to protect sensitive operations.',
            resources: [
              {
                label: 'Auth.js – Protecting Server Actions',
                url: 'https://authjs.dev/getting-started/session-management/protecting#server-actions',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Role-based access control with session callbacks',
            description:
              "The jwt and session callbacks in Auth.js let you attach custom fields like role to the session token. Checking session.user.role in middleware or server actions enforces permission levels.",
            resources: [
              {
                label: 'Auth.js – Callbacks',
                url: 'https://authjs.dev/guides/extending-the-session',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Configuring sign-in and sign-out UI flows',
            description:
              'Auth.js provides default sign-in pages, but custom pages are configured via the pages option in auth.ts. Combining signIn/signOut server actions with redirect keeps auth UX seamless.',
            resources: [
              {
                label: 'Auth.js – Custom Pages',
                url: 'https://authjs.dev/getting-started/session-management/login',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-7': {
    sideLeft: [
      {
        title: 'Tailwind CSS Fundamentals',
        children: [
          {
            title: 'Utility-first CSS and the Tailwind mental model',
            description:
              'Tailwind replaces custom CSS with composable utility classes applied directly in HTML. This approach eliminates naming fatigue and keeps styles co-located with the markup they affect.',
            resources: [
              {
                label: 'Tailwind CSS – Core Concepts',
                url: 'https://tailwindcss.com/docs/utility-first',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Responsive design with Tailwind breakpoints',
            description:
              'Tailwind uses mobile-first breakpoint prefixes (sm:, md:, lg:) that apply styles above a minimum width. This makes responsive layouts readable and avoids media query boilerplate.',
            resources: [
              {
                label: 'Tailwind CSS – Responsive Design',
                url: 'https://tailwindcss.com/docs/responsive-design',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Dark mode with Tailwind class strategy',
            description:
              'Setting darkMode: "class" in tailwind.config lets you toggle dark styles by adding a dark class to the html element. This enables user-controlled theme switching without CSS custom properties.',
            resources: [
              {
                label: 'Tailwind CSS – Dark Mode',
                url: 'https://tailwindcss.com/docs/dark-mode',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Accessible Component Design',
        children: [
          {
            title: 'Semantic HTML and ARIA patterns for accessibility',
            description:
              'Screen readers and assistive technology rely on semantic elements and ARIA attributes to understand UI structure. Building accessible components from the start is easier than retrofitting them.',
            resources: [
              {
                label: 'MDN – ARIA',
                url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Design tokens and consistent spacing scales',
            description:
              "Tailwind's default spacing scale (4, 8, 12, 16...) creates visual consistency when used systematically. Extending the config with custom design tokens keeps branding consistent across a project.",
            resources: [
              {
                label: 'Tailwind CSS – Customizing the Design System',
                url: 'https://tailwindcss.com/docs/theme',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'shadcn/ui Component Library',
        children: [
          {
            title: 'Installing and using shadcn/ui components',
            description:
              'shadcn/ui copies accessible Radix UI components styled with Tailwind directly into your codebase, so you own and can customise every component. This approach avoids dependency lock-in.',
            resources: [
              {
                label: 'shadcn/ui – Getting Started',
                url: 'https://ui.shadcn.com/docs/installation/next',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Building reusable UI with variant patterns',
            description:
              'The cva (class-variance-authority) library powers shadcn/ui variants and lets you define component size/color variants declaratively. This pattern keeps component APIs clean and type-safe.',
            resources: [
              {
                label: 'shadcn/ui – Components',
                url: 'https://ui.shadcn.com/docs/components/button',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Dialogs, toasts, and sheet components for UX',
            description:
              'Modal dialogs, toast notifications, and side sheets are essential feedback patterns. shadcn/ui provides accessible, animated versions of all three built on Radix primitives.',
            resources: [
              {
                label: 'shadcn/ui – Dialog',
                url: 'https://ui.shadcn.com/docs/components/dialog',
                type: 'docs',
              },
              {
                label: 'shadcn/ui – Toast',
                url: 'https://ui.shadcn.com/docs/components/toast',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Loading and Skeleton States',
        children: [
          {
            title: 'Skeleton screens for perceived performance',
            description:
              'Skeleton components mimic the shape of loading content to reduce perceived wait time. Combining them with Suspense boundaries makes the page feel responsive even on slow connections.',
            resources: [
              {
                label: 'shadcn/ui – Skeleton',
                url: 'https://ui.shadcn.com/docs/components/skeleton',
                type: 'docs',
              },
            ],
          },
          {
            title: 'cn utility for conditional Tailwind class merging',
            description:
              'The cn helper (combining clsx and tailwind-merge) safely merges conditional Tailwind classes without class conflicts. It is the standard pattern for dynamic styles in shadcn/ui components.',
            resources: [
              {
                label: 'Tailwind CSS – Functions and Directives',
                url: 'https://tailwindcss.com/docs/functions-and-directives',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-8': {
    sideLeft: [
      {
        title: 'Advanced Caching Theory',
        children: [
          {
            title: 'Request memoization within a single render pass',
            description:
              'Next.js automatically deduplicates identical fetch calls made during the same server render. This allows sibling server components to each fetch the data they need without network duplication.',
            resources: [
              {
                label: 'Next.js – Request Memoization',
                url: 'https://nextjs.org/docs/app/building-your-application/caching#request-memoization',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Data Cache vs Full Route Cache differences',
            description:
              "The Data Cache persists fetch results between requests, while the Full Route Cache stores rendered HTML. Knowing which layer is stale helps you apply revalidation in the right place.",
            resources: [
              {
                label: 'Next.js – Data Cache',
                url: 'https://nextjs.org/docs/app/building-your-application/caching#data-cache',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Tag-based cache invalidation for fine control',
            description:
              "fetch({ next: { tags: ['posts'] } }) associates a cache entry with a tag. Calling revalidateTag('posts') then invalidates only those entries, avoiding a full-route cache bust.",
            resources: [
              {
                label: 'Next.js – revalidateTag',
                url: 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Runtime Considerations',
        children: [
          {
            title: 'Edge runtime vs Node.js runtime trade-offs',
            description:
              'The Edge runtime starts faster and runs globally close to users, but lacks access to Node.js APIs like the file system. Choosing the right runtime per route optimises both latency and capability.',
            resources: [
              {
                label: 'Next.js – Edge and Node.js Runtimes',
                url: 'https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Avoiding stale data with cache: no-store',
            description:
              "Passing cache: 'no-store' to a fetch call opts it out of the Data Cache entirely, forcing a fresh request every time. This is necessary for routes that must always show the latest data.",
            resources: [
              {
                label: 'Next.js – Opting Out of Caching',
                url: 'https://nextjs.org/docs/app/building-your-application/caching#opting-out-1',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Client-Side Data Management',
        children: [
          {
            title: 'TanStack Query for client-side server state',
            description:
              'TanStack Query manages server state in client components with automatic background refetching, stale-time control, and cache invalidation. It is the standard complement to Next.js server components for interactive data.',
            resources: [
              {
                label: 'TanStack Query – Overview',
                url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Optimistic updates with useMutation',
            description:
              'TanStack Query\'s useMutation hook provides onMutate, onError, and onSettled callbacks for optimistic updates with rollback. This pattern gives users instant feedback while the server request completes.',
            resources: [
              {
                label: 'TanStack Query – Optimistic Updates',
                url: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Parallel and dependent queries with useQuery',
            description:
              'Multiple useQuery calls in a component run in parallel by default. Dependent queries use the enabled option to wait for a prerequisite query before fetching.',
            resources: [
              {
                label: 'TanStack Query – Dependent Queries',
                url: 'https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'ISR and On-demand Revalidation',
        children: [
          {
            title: 'Incremental Static Regeneration with revalidate option',
            description:
              'Exporting revalidate = 60 from a page opts it into ISR, regenerating the static HTML at most every 60 seconds. This delivers static performance with near-real-time freshness.',
            resources: [
              {
                label: 'Next.js – Incremental Static Regeneration',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration',
                type: 'docs',
              },
            ],
          },
          {
            title: 'On-demand revalidation via webhook route handler',
            description:
              'A secret-protected POST route handler calls revalidatePath or revalidateTag when a CMS publishes new content. This triggers an immediate cache refresh without redeploying.',
            resources: [
              {
                label: 'Next.js – On-demand Revalidation',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-9': {
    sideLeft: [
      {
        title: 'API Design Principles',
        children: [
          {
            title: 'REST conventions for route handler design',
            description:
              'Following REST conventions (GET for reads, POST for creates, PATCH for updates, DELETE for removes) makes your API predictable for other developers and third-party integrations.',
            resources: [
              {
                label: 'Next.js – Route Handlers',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Securing API keys and secrets on the server',
            description:
              'API keys must never be exposed to the browser. Using them only in Server Components, Server Actions, or Route Handlers ensures they stay in the server environment and out of client bundles.',
            resources: [
              {
                label: 'Next.js – Environment Variables',
                url: 'https://nextjs.org/docs/app/building-your-application/configuring/environment-variables',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Webhook signature verification to prevent spoofing',
            description:
              'Webhooks from Stripe and other services include a cryptographic signature header. Verifying it before processing the payload prevents attackers from sending fake webhook events.',
            resources: [
              {
                label: 'Stripe – Webhook Signatures',
                url: 'https://stripe.com/docs/webhooks#verify-official-libraries',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'External Integrations Theory',
        children: [
          {
            title: 'Stripe payment intents and checkout flow',
            description:
              'Stripe Payment Intents represent a payment attempt and track its lifecycle. Understanding the server-side intent creation and client-side confirmation split is essential for PCI compliance.',
            resources: [
              {
                label: 'Stripe – Payment Intents',
                url: 'https://stripe.com/docs/payments/payment-intents',
                type: 'docs',
              },
            ],
          },
          {
            title: 'File upload strategies and storage options',
            description:
              'Files should be streamed directly to object storage like S3 or Cloudflare R2 rather than through your server. Pre-signed upload URLs let the browser upload directly, bypassing your serverless functions.',
            resources: [
              {
                label: 'Vercel – File Uploads Guide',
                url: 'https://vercel.com/guides/how-to-upload-and-store-files-with-vercel',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Stripe Integration',
        children: [
          {
            title: 'Stripe Checkout and payment link setup',
            description:
              'Stripe Checkout handles the payment form entirely, including card validation and 3D Secure. Creating a Checkout Session from a Server Action and redirecting to the hosted page is the fastest integration path.',
            resources: [
              {
                label: 'Stripe – Checkout Quick Start',
                url: 'https://stripe.com/docs/checkout/quickstart',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Handling Stripe webhooks in a route handler',
            description:
              'Stripe sends webhook events for completed payments, subscription changes, and refunds. A POST route handler that verifies the Stripe-Signature header and updates your database is the standard pattern.',
            resources: [
              {
                label: 'Stripe – Fulfill Orders with Webhooks',
                url: 'https://stripe.com/docs/payments/checkout/fulfill-orders',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Environment Config and External APIs',
        children: [
          {
            title: 'Typed environment variables with Zod validation',
            description:
              'Parsing process.env through a Zod schema at startup catches missing or malformed environment variables before they cause runtime errors in production.',
            resources: [
              {
                label: 'Zod – Environment Variable Parsing',
                url: 'https://zod.dev/?id=strings',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Calling third-party APIs securely from server components',
            description:
              'Making external API calls from Server Components or Server Actions keeps API keys off the client. Using a shared SDK instance prevents opening a new connection per request.',
            resources: [
              {
                label: 'Next.js – Fetching Data on the Server',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#fetching-data-on-the-server-with-the-fetch-api',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Rate limiting and CORS for public route handlers',
            description:
              'Public-facing route handlers should enforce rate limits to prevent abuse and set CORS headers to restrict origins. Vercel Edge Config and upstash/ratelimit are common solutions.',
            resources: [
              {
                label: 'Vercel – Edge Config',
                url: 'https://vercel.com/docs/storage/edge-config',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'next-fullstack-10': {
    sideLeft: [
      {
        title: 'Testing Philosophy',
        children: [
          {
            title: 'Unit testing server and client logic with Vitest',
            description:
              'Vitest is a fast, Vite-native test runner compatible with the Jest API. Testing pure utility functions, Zod schemas, and server action logic in isolation catches regressions before they reach the browser.',
            resources: [
              {
                label: 'Vitest – Getting Started',
                url: 'https://vitest.dev/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Component testing with React Testing Library',
            description:
              'React Testing Library renders components in a virtual DOM and queries them by accessible roles and labels. This encourages testing behaviour rather than implementation details.',
            resources: [
              {
                label: 'Testing Library – React Introduction',
                url: 'https://testing-library.com/docs/react-testing-library/intro/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'End-to-end testing strategy with Playwright',
            description:
              'Playwright automates real browser interactions to verify critical user flows like sign-in, checkout, and form submission. E2E tests catch integration issues that unit tests miss.',
            resources: [
              {
                label: 'Playwright – Getting Started',
                url: 'https://playwright.dev/docs/intro',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Deployment Architecture',
        children: [
          {
            title: 'Vercel project structure and environment setup',
            description:
              'Connecting a Git repository to Vercel enables automatic deployments on every push. Production, preview, and development environment variables are managed separately in the Vercel dashboard.',
            resources: [
              {
                label: 'Vercel – Environment Variables',
                url: 'https://vercel.com/docs/projects/environment-variables',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Production database setup with connection pooling',
            description:
              'Serverless functions open a new database connection per invocation, exhausting PostgreSQL connection limits. PgBouncer or Prisma Accelerate provide connection pooling to solve this.',
            resources: [
              {
                label: 'Prisma – Accelerate Connection Pooling',
                url: 'https://www.prisma.io/docs/accelerate',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Testing Tooling',
        children: [
          {
            title: 'Writing and running Playwright E2E tests',
            description:
              "Playwright tests live in a tests/ directory and use page.goto, page.click, and expect(page).toHaveURL matchers. The codegen tool records browser interactions and generates test code automatically.",
            resources: [
              {
                label: 'Playwright – Writing Tests',
                url: 'https://playwright.dev/docs/writing-tests',
                type: 'docs',
              },
              {
                label: 'Playwright – Codegen',
                url: 'https://playwright.dev/docs/codegen',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Mocking modules and fetch calls in Vitest',
            description:
              "vi.mock lets you replace modules like Prisma Client or fetch with controlled test doubles. This isolates the code under test from external dependencies and makes tests deterministic.",
            resources: [
              {
                label: 'Vitest – Mocking',
                url: 'https://vitest.dev/guide/mocking.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Continuous integration with GitHub Actions',
            description:
              'Running vitest and playwright test in a GitHub Actions workflow on every pull request prevents broken code from reaching main. Caching node_modules keeps CI fast.',
            resources: [
              {
                label: 'Vitest – GitHub Actions Integration',
                url: 'https://vitest.dev/guide/reporters.html#github-actions-reporter',
                type: 'docs',
              },
              {
                label: 'Playwright – CI Configuration',
                url: 'https://playwright.dev/docs/ci',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Vercel Deployment',
        children: [
          {
            title: 'Preview deployments for pull request review',
            description:
              'Vercel creates a unique deployment URL for every pull request, making it easy to review UI changes before merging. Reviewers can test against production-like infrastructure without running the app locally.',
            resources: [
              {
                label: 'Vercel – Preview Deployments',
                url: 'https://vercel.com/docs/deployments/preview-deployments',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Vercel Analytics and Speed Insights monitoring',
            description:
              'Vercel Analytics tracks real user page view data, while Speed Insights reports Core Web Vitals like LCP and CLS. Both are enabled with a single package install and require no configuration.',
            resources: [
              {
                label: 'Vercel – Analytics',
                url: 'https://vercel.com/docs/analytics',
                type: 'docs',
              },
              {
                label: 'Vercel – Speed Insights',
                url: 'https://vercel.com/docs/speed-insights',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Main ───────────────────────────────────────────────────────────────────

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

const track = data['next-fullstack'];
if (!Array.isArray(track)) {
  console.error('ERROR: next-fullstack track not found in JSON');
  process.exit(1);
}

let applied = 0;

for (const layer of track) {
  const patch = patches[layer.id];
  if (!patch) continue;
  layer.sideLeft = patch.sideLeft;
  layer.sideRight = patch.sideRight;
  applied++;
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches`);
