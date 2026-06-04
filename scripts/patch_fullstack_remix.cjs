'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(
  __dirname,
  '../src/data/roadmaps/fullstack.json'
);

// ---------------------------------------------------------------------------
// Patch data: remix-dev-1 through remix-dev-10
// Each entry: { id, sideLeft: [group, group], sideRight: [group, group] }
// group: { title, children: [child, child, ?child] }
// child: { title, description, resources: [{ label, url, type }] }
// ---------------------------------------------------------------------------

const patches = [
  // ── 1 ── TypeScript and React Foundations ──────────────────────────────
  {
    id: 'remix-dev-1',
    sideLeft: [
      {
        title: 'TypeScript Type System',
        children: [
          {
            title: 'Types and interfaces for data shapes',
            description:
              'TypeScript types and interfaces let you describe the shape of objects and function signatures at compile time. They catch mismatches before code runs, making refactors safe and autocomplete accurate.',
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
            title: 'Generics for reusable typed logic',
            description:
              'Generics allow functions and types to operate over a variety of types while still retaining type safety. They are essential for building reusable utilities like hooks, API clients, and wrappers.',
            resources: [
              {
                label: 'TypeScript Handbook – Generics',
                url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Union, intersection, and utility types',
            description:
              'Union types model values that can be one of several types; utility types like Partial, Required, and Pick transform existing types. Understanding them removes the need for duplicate type definitions.',
            resources: [
              {
                label: 'TypeScript Handbook – Utility Types',
                url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
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
            title: 'Component composition and props design',
            description:
              'React applications are trees of components that pass data through props. Good composition means building small, focused components and combining them rather than creating monolithic ones.',
            resources: [
              {
                label: 'React – Passing Props to a Component',
                url: 'https://react.dev/learn/passing-props-to-a-component',
                type: 'docs',
              },
            ],
          },
          {
            title: 'State management with useState and useReducer',
            description:
              'useState manages simple local values; useReducer is better for complex state transitions. Choosing the right hook keeps components predictable and easy to test.',
            resources: [
              {
                label: 'React – Managing State',
                url: 'https://react.dev/learn/managing-state',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Typing React with TypeScript',
        children: [
          {
            title: 'Typing component props and event handlers',
            description:
              'Annotating props with interfaces and event handlers with React.ChangeEvent or React.MouseEvent gives you autocomplete and prevents runtime errors from wrong prop types.',
            resources: [
              {
                label: 'React TypeScript Cheatsheet – Basic Props',
                url: 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/',
                type: 'article',
              },
              {
                label: 'React – TypeScript usage',
                url: 'https://react.dev/learn/typescript',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Hooks with TypeScript return types',
            description:
              'Explicitly typing custom hook return values with tuples or interfaces prevents callers from misusing hook outputs and serves as living documentation for the hook\'s contract.',
            resources: [
              {
                label: 'TypeScript Handbook – Tuple Types',
                url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Modern JS and Tooling',
        children: [
          {
            title: 'ES modules, destructuring, and optional chaining',
            description:
              'Modern JavaScript features like optional chaining (?.), nullish coalescing (??), and destructuring reduce boilerplate and defensive null-checks throughout Remix route files.',
            resources: [
              {
                label: 'MDN – Optional chaining (?.)',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Async/await and Promise patterns',
            description:
              'Remix loaders and actions are async functions; solid async/await fluency including error handling with try/catch and Promise.all is required to write reliable data-fetching code.',
            resources: [
              {
                label: 'MDN – async function',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
                type: 'docs',
              },
              {
                label: 'MDN – Using Promises',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 2 ── Remix Basics and Routing ──────────────────────────────────────
  {
    id: 'remix-dev-2',
    sideLeft: [
      {
        title: 'Remix Mental Model',
        children: [
          {
            title: 'Web platform HTTP and form primitives',
            description:
              'Remix leans into the native Request/Response model and HTML forms rather than inventing abstractions. Understanding how browsers handle forms and navigation makes Remix patterns feel natural.',
            resources: [
              {
                label: 'Remix – Philosophy',
                url: 'https://remix.run/docs/en/main/pages/philosophy',
                type: 'docs',
              },
              {
                label: 'MDN – HTML Forms',
                url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nested routes and layout hierarchy',
            description:
              'Remix models your UI as nested route segments where each segment owns a slice of the URL, its data, and its portion of the layout. This enables precise revalidation and co-located data fetching.',
            resources: [
              {
                label: 'Remix – Routing Guide',
                url: 'https://remix.run/docs/en/main/guides/routing',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'File-Based Route Conventions',
        children: [
          {
            title: 'Route file naming and segment conventions',
            description:
              'Remix uses file names to define URL segments: dots create path separators, underscores create pathless layouts, and brackets denote dynamic params. Mastering the convention eliminates configuration.',
            resources: [
              {
                label: 'Remix – Route File Naming',
                url: 'https://remix.run/docs/en/main/file-conventions/routes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Outlet component and shared layouts',
            description:
              'Outlet renders the matched child route inside a parent layout component. This is the mechanism that lets navbars, sidebars, and shells persist across navigations without re-mounting.',
            resources: [
              {
                label: 'Remix – Outlet Component',
                url: 'https://remix.run/docs/en/main/components/outlet',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Navigation and Links',
        children: [
          {
            title: 'Link and NavLink for client navigation',
            description:
              'Remix\'s Link component prevents full-page reloads while NavLink adds active-state class support for nav menus. Both prefetch data on hover for instant perceived performance.',
            resources: [
              {
                label: 'Remix – Link Component',
                url: 'https://remix.run/docs/en/main/components/link',
                type: 'docs',
              },
              {
                label: 'Remix – NavLink Component',
                url: 'https://remix.run/docs/en/main/components/nav-link',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Dynamic route params and wildcard segments',
            description:
              'Params like $userId capture URL segments and are available in loaders and actions via params.userId. Splat routes catch all remaining segments for flexible catch-all pages.',
            resources: [
              {
                label: 'Remix – Dynamic Segments',
                url: 'https://remix.run/docs/en/main/file-conventions/routes#dynamic-segments',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Project Setup',
        children: [
          {
            title: 'Scaffolding a Remix app with Vite',
            description:
              'The official Remix + Vite template sets up TypeScript, ESLint, and HMR in one command. Understanding the generated file layout—app/, root.tsx, entry files—is the first step to productive development.',
            resources: [
              {
                label: 'Remix – Quick Start',
                url: 'https://remix.run/docs/en/main/start/quickstart',
                type: 'docs',
              },
            ],
          },
          {
            title: 'root.tsx, meta, and document structure',
            description:
              'root.tsx is the top-level layout that renders the HTML shell including Scripts, ScrollRestoration, and LiveReload. Customising it controls global meta tags, fonts, and error boundaries for the entire app.',
            resources: [
              {
                label: 'Remix – Root Route',
                url: 'https://remix.run/docs/en/main/file-conventions/root',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 3 ── Loaders and Data Loading ──────────────────────────────────────
  {
    id: 'remix-dev-3',
    sideLeft: [
      {
        title: 'Loader Fundamentals',
        children: [
          {
            title: 'Loader functions and the request object',
            description:
              'A loader is an exported async function that runs on the server before a route renders. It receives a Request object and params, and whatever it returns is passed to the component via useLoaderData.',
            resources: [
              {
                label: 'Remix – loader',
                url: 'https://remix.run/docs/en/main/route/loader',
                type: 'docs',
              },
            ],
          },
          {
            title: 'URL search params and query strings',
            description:
              'Loaders can read query parameters through new URL(request.url).searchParams, enabling server-side filtering, sorting, and pagination without client state.',
            resources: [
              {
                label: 'MDN – URLSearchParams',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
                type: 'docs',
              },
              {
                label: 'Remix – useSearchParams',
                url: 'https://remix.run/docs/en/main/hooks/use-search-params',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Error and Not-Found Handling',
        children: [
          {
            title: 'Throwing responses for 404 and error states',
            description:
              'Throwing a Response from a loader (e.g., throw new Response("Not Found", { status: 404 })) lets Remix route to the nearest ErrorBoundary rather than crashing the whole page.',
            resources: [
              {
                label: 'Remix – Throwing Responses',
                url: 'https://remix.run/docs/en/main/guides/not-found',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Deferred data and streaming with Suspense',
            description:
              'Remix\'s defer utility lets you send the page shell immediately and stream slow data later. Paired with React Suspense and Await, it dramatically improves perceived load time for heavy queries.',
            resources: [
              {
                label: 'Remix – Deferred Data',
                url: 'https://remix.run/docs/en/main/guides/streaming',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Type-Safe Loader Data',
        children: [
          {
            title: 'Typing useLoaderData with generics',
            description:
              'Passing your loader\'s return type to useLoaderData<typeof loader>() gives full TypeScript inference on the component side with zero runtime cost—the types are erased at build time.',
            resources: [
              {
                label: 'Remix – Type Safety',
                url: 'https://remix.run/docs/en/main/guides/data-loading#type-safety',
                type: 'docs',
              },
            ],
          },
          {
            title: 'json() helper and response utilities',
            description:
              'The json() helper serialises data and sets the Content-Type header in one call. It also accepts a second argument for status codes and custom headers, covering most loader response scenarios.',
            resources: [
              {
                label: 'Remix – json utility',
                url: 'https://remix.run/docs/en/main/utils/json',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Practical Data Fetching',
        children: [
          {
            title: 'Parallel data loading across nested routes',
            description:
              'Remix calls all loaders in a route tree in parallel, so nested routes do not waterfall. Structuring routes to co-locate their data needs is the primary performance lever in Remix.',
            resources: [
              {
                label: 'Remix – Data Loading Guide',
                url: 'https://remix.run/docs/en/main/guides/data-loading',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Fetching external APIs inside loaders',
            description:
              'Loaders run on the server, so you can call internal microservices or third-party REST/GraphQL APIs using fetch without exposing API keys to the client.',
            resources: [
              {
                label: 'MDN – fetch()',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 4 ── Actions, Forms, and Mutations ─────────────────────────────────
  {
    id: 'remix-dev-4',
    sideLeft: [
      {
        title: 'Action Functions',
        children: [
          {
            title: 'Action lifecycle and FormData parsing',
            description:
              'An action handles POST requests submitted to its route. It parses request.formData(), performs mutations (DB writes, API calls), and returns a redirect or JSON response.',
            resources: [
              {
                label: 'Remix – action',
                url: 'https://remix.run/docs/en/main/route/action',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Server-side validation with Zod',
            description:
              'Zod schemas validate and parse FormData on the server, returning typed objects or structured errors. Returning errors from the action and reading them with useActionData completes the form feedback loop.',
            resources: [
              {
                label: 'Zod – Getting Started',
                url: 'https://zod.dev/?id=basic-usage',
                type: 'docs',
              },
              {
                label: 'Remix – useActionData',
                url: 'https://remix.run/docs/en/main/hooks/use-action-data',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Pending States and Optimistic UI',
        children: [
          {
            title: 'useNavigation for submission state',
            description:
              'useNavigation exposes a state field ("idle" | "submitting" | "loading") so you can disable buttons or show spinners during form submission without any extra client state.',
            resources: [
              {
                label: 'Remix – useNavigation',
                url: 'https://remix.run/docs/en/main/hooks/use-navigation',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Optimistic UI with useOptimistic pattern',
            description:
              'Optimistic UI updates the component immediately using the submitted form values before the server responds. Remix\'s fetcher.formData enables this without custom state management.',
            resources: [
              {
                label: 'Remix – Optimistic UI',
                url: 'https://remix.run/docs/en/main/guides/optimistic-ui',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Form Component',
        children: [
          {
            title: 'Remix Form vs native HTML form',
            description:
              'Remix\'s Form component serialises the form and submits it via fetch rather than a full-page reload. It degrades gracefully to a native form when JavaScript hasn\'t loaded yet.',
            resources: [
              {
                label: 'Remix – Form Component',
                url: 'https://remix.run/docs/en/main/components/form',
                type: 'docs',
              },
            ],
          },
          {
            title: 'method, action, and encType attributes',
            description:
              'Setting method="post" routes to the action function; the action attribute targets a different route\'s action. Understanding encType="multipart/form-data" is needed for file uploads.',
            resources: [
              {
                label: 'MDN – form element attributes',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Revalidation After Mutations',
        children: [
          {
            title: 'Automatic revalidation and redirect patterns',
            description:
              'After an action completes Remix automatically re-runs all active loaders. Redirecting with redirect() after a successful mutation refreshes the page data without manual cache invalidation.',
            resources: [
              {
                label: 'Remix – redirect utility',
                url: 'https://remix.run/docs/en/main/utils/redirect',
                type: 'docs',
              },
            ],
          },
          {
            title: 'shouldRevalidate for selective reloading',
            description:
              'The shouldRevalidate export lets you skip loader re-runs when only unrelated parts of the URL change, reducing unnecessary database queries on large apps.',
            resources: [
              {
                label: 'Remix – shouldRevalidate',
                url: 'https://remix.run/docs/en/main/route/should-revalidate',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 5 ── Databases and Persistence ─────────────────────────────────────
  {
    id: 'remix-dev-5',
    sideLeft: [
      {
        title: 'Prisma Schema and Migrations',
        children: [
          {
            title: 'Defining models and relations in schema.prisma',
            description:
              'The Prisma schema file describes your database tables as models with typed fields and relation annotations. It is the single source of truth that drives migrations, the client, and type generation.',
            resources: [
              {
                label: 'Prisma – Data Modeling',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-schema/data-model',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Running and tracking migrations',
            description:
              'prisma migrate dev creates SQL migration files and applies them to the dev database. Each migration is tracked so Prisma can replay them on CI and production databases without drift.',
            resources: [
              {
                label: 'Prisma – Migrations',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-migrate',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Database Environment Management',
        children: [
          {
            title: 'DATABASE_URL and environment variables',
            description:
              'Prisma reads the DATABASE_URL env var at runtime to connect to the database. Keeping separate values for development, test, and production avoids accidental data corruption.',
            resources: [
              {
                label: 'Prisma – Connection URLs',
                url: 'https://www.prisma.io/docs/reference/database-reference/connection-urls',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Seeding data with Prisma seed scripts',
            description:
              'A seed script populates the database with initial or demo data. It runs via prisma db seed and is invaluable for local development and resetting state in CI environments.',
            resources: [
              {
                label: 'Prisma – Seeding',
                url: 'https://www.prisma.io/docs/guides/database/seed-database',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Querying in Loaders and Actions',
        children: [
          {
            title: 'CRUD operations with PrismaClient',
            description:
              'PrismaClient methods like findMany, create, update, and delete are called directly inside Remix loaders and actions, keeping database logic co-located with the routes that need it.',
            resources: [
              {
                label: 'Prisma – CRUD',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/crud',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Filtering, sorting, and pagination with Prisma',
            description:
              'Prisma\'s where, orderBy, take, and skip options map directly to URL search params in a loader, enabling server-side search and pagination with minimal code.',
            resources: [
              {
                label: 'Prisma – Filtering and Sorting',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Singleton Client Pattern',
        children: [
          {
            title: 'PrismaClient singleton for hot reload safety',
            description:
              'In development, Vite/Node module hot-reloads can create multiple PrismaClient instances and exhaust the connection pool. A global singleton pattern prevents this.',
            resources: [
              {
                label: 'Prisma – Best Practices with Next.js / Remix',
                url: 'https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Relation includes and nested queries',
            description:
              'Prisma\'s include option eagerly loads related models in one query, avoiding N+1 problems that occur when fetching relations in a loop inside a loader.',
            resources: [
              {
                label: 'Prisma – Select and Include',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/select-fields',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 6 ── Authentication and Sessions ───────────────────────────────────
  {
    id: 'remix-dev-6',
    sideLeft: [
      {
        title: 'Session-Based Authentication',
        children: [
          {
            title: 'Cookie sessions and createCookieSessionStorage',
            description:
              'Remix ships a first-class createCookieSessionStorage that signs, serialises, and parses session cookies on every request. No external session store is needed for most apps.',
            resources: [
              {
                label: 'Remix – Session Management',
                url: 'https://remix.run/docs/en/main/utils/sessions',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Login and signup route design patterns',
            description:
              'Auth routes typically export both a loader (redirect if already logged in) and an action (validate credentials, set session, redirect). Keeping this logic in one file simplifies the auth flow.',
            resources: [
              {
                label: 'Remix – Authentication Tutorial',
                url: 'https://remix.run/docs/en/main/tutorials/jokes#authentication',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Security Fundamentals',
        children: [
          {
            title: 'Password hashing with bcrypt',
            description:
              'Passwords must never be stored in plain text. bcryptjs hashes passwords with a configurable cost factor and provides a compare function for login verification.',
            resources: [
              {
                label: 'npm – bcryptjs',
                url: 'https://www.npmjs.com/package/bcryptjs',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Protecting loaders and actions from unauthenticated access',
            description:
              'Any loader or action can call a getUser() helper that reads the session and throws a redirect to /login if no session exists, enforcing authentication at the data layer.',
            resources: [
              {
                label: 'Remix – Protecting Routes',
                url: 'https://remix.run/docs/en/main/guides/redirects',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Reading User in Routes',
        children: [
          {
            title: 'requireUser helper shared across loaders',
            description:
              'A requireUser utility reads the session cookie, looks up the user in the database, and returns the user or throws a redirect. Sharing it across loaders avoids duplicate auth logic.',
            resources: [
              {
                label: 'Remix – Jokes App – requireUserId',
                url: 'https://remix.run/docs/en/main/tutorials/jokes#build-the-login-form',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Exposing user data to components via loader',
            description:
              'Loaders are the right place to load the current user: call requireUser, then return the user object. Components consume it via useLoaderData without any global auth state library.',
            resources: [
              {
                label: 'Remix – useLoaderData',
                url: 'https://remix.run/docs/en/main/hooks/use-loader-data',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Logout and Session Security',
        children: [
          {
            title: 'Logout action and session destruction',
            description:
              'A /logout route with an action that calls session.destroy() and redirects to /login is the idiomatic Remix logout pattern—no client-side state to clear.',
            resources: [
              {
                label: 'Remix – destroySession',
                url: 'https://remix.run/docs/en/main/utils/sessions#using-sessions',
                type: 'docs',
              },
            ],
          },
          {
            title: 'CSRF protection and secure cookie flags',
            description:
              'Setting httpOnly, secure, and sameSite=lax on session cookies prevents XSS and CSRF attacks. The remix-utils library provides a ready-made CSRF token helper for extra protection.',
            resources: [
              {
                label: 'MDN – Set-Cookie security attributes',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 7 ── Error Handling and Resilience ──────────────────────────────────
  {
    id: 'remix-dev-7',
    sideLeft: [
      {
        title: 'Error Boundary Architecture',
        children: [
          {
            title: 'ErrorBoundary export per route',
            description:
              'Each Remix route can export an ErrorBoundary component that renders when its loader, action, or component throws. This contains failures to the affected section without crashing the whole app.',
            resources: [
              {
                label: 'Remix – errorBoundary',
                url: 'https://remix.run/docs/en/main/route/error-boundary',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Nested error isolation and bubbling',
            description:
              'When a child route has no ErrorBoundary, the error bubbles to the nearest ancestor that does. Deliberately placing error boundaries at the right level limits the blast radius of failures.',
            resources: [
              {
                label: 'Remix – Error Boundaries Guide',
                url: 'https://remix.run/docs/en/main/guides/errors',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'HTTP Response Status Codes',
        children: [
          {
            title: 'Status codes and headers in loader responses',
            description:
              'Returning a Response with status 404, 403, or 500 from a loader sets the HTTP status correctly, which matters for CDN caching, SEO, and monitoring dashboards.',
            resources: [
              {
                label: 'MDN – HTTP response status codes',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Not-found handling with 404 responses',
            description:
              'Throwing a 404 Response from a loader when a record doesn\'t exist is preferable to rendering an empty state, because it signals the absence correctly to crawlers and CDNs.',
            resources: [
              {
                label: 'Remix – Not Found Handling',
                url: 'https://remix.run/docs/en/main/guides/not-found',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Logging and Observability',
        children: [
          {
            title: 'Server-side error logging strategies',
            description:
              'Remix loaders and actions run on the server, so errors should be logged with console.error or a structured logger before throwing a user-safe response. Never expose raw stack traces to clients.',
            resources: [
              {
                label: 'web.dev – Error handling best practices',
                url: 'https://web.dev/articles/errors-in-promise-chains',
                type: 'article',
              },
            ],
          },
          {
            title: 'Integrating Sentry for error tracking',
            description:
              'Sentry\'s Remix SDK wraps loaders and actions to capture exceptions automatically, associating them with the route and user session for easy debugging in production.',
            resources: [
              {
                label: 'Sentry – Remix SDK',
                url: 'https://docs.sentry.io/platforms/javascript/guides/remix/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Resilient UX Patterns',
        children: [
          {
            title: 'useRouteError hook for custom error UI',
            description:
              'useRouteError returns the thrown value inside an ErrorBoundary, letting you render different UI for 404 vs 500 errors or display user-friendly messages from thrown Response objects.',
            resources: [
              {
                label: 'Remix – useRouteError',
                url: 'https://remix.run/docs/en/main/hooks/use-route-error',
                type: 'docs',
              },
            ],
          },
          {
            title: 'isRouteErrorResponse for structured error handling',
            description:
              'isRouteErrorResponse narrows the error to a typed ErrorResponse object when a Response was thrown, giving you access to status and data without unsafe casting.',
            resources: [
              {
                label: 'Remix – isRouteErrorResponse',
                url: 'https://remix.run/docs/en/main/utils/is-route-error-response',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 8 ── Advanced Data Patterns ────────────────────────────────────────
  {
    id: 'remix-dev-8',
    sideLeft: [
      {
        title: 'Background Fetching with useFetcher',
        children: [
          {
            title: 'useFetcher for out-of-band data operations',
            description:
              'useFetcher lets you call loaders and actions without navigating. It is the right tool for like buttons, newsletter sign-ups, inline edits, and any mutation that shouldn\'t change the URL.',
            resources: [
              {
                label: 'Remix – useFetcher',
                url: 'https://remix.run/docs/en/main/hooks/use-fetcher',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Fetcher state and loading indicators',
            description:
              'fetcher.state mirrors useNavigation.state but scoped to the individual fetch. Checking fetcher.state === "submitting" lets you animate a single list item instead of the whole page.',
            resources: [
              {
                label: 'Remix – Fetcher State',
                url: 'https://remix.run/docs/en/main/hooks/use-fetcher#fetcherstate',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'HTTP Caching and Prefetching',
        children: [
          {
            title: 'Cache-Control headers from loaders',
            description:
              'Returning Cache-Control headers from a loader instructs CDNs and browsers to cache route data. This can eliminate loader calls entirely for mostly-static pages, dramatically reducing server load.',
            resources: [
              {
                label: 'Remix – HTTP Caching',
                url: 'https://remix.run/docs/en/main/guides/caching',
                type: 'docs',
              },
              {
                label: 'MDN – Cache-Control',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Link prefetch attribute for instant navigation',
            description:
              'Setting prefetch="intent" on a Link tells Remix to fetch the route\'s loader data when the user hovers or focuses the link, making navigation feel instant by front-loading the wait.',
            resources: [
              {
                label: 'Remix – Link prefetch',
                url: 'https://remix.run/docs/en/main/components/link#prefetch',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Resource Routes and API Endpoints',
        children: [
          {
            title: 'Resource routes for JSON and non-HTML responses',
            description:
              'A route that exports only a loader or action and no default component acts as a resource route—an API endpoint. It can return JSON, images, PDFs, or any Response object.',
            resources: [
              {
                label: 'Remix – Resource Routes',
                url: 'https://remix.run/docs/en/main/guides/resource-routes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Webhooks and background job handlers',
            description:
              'Resource routes are ideal for receiving webhook POSTs from Stripe, GitHub, or Twilio. They run on the server, can verify signatures, and trigger background jobs without exposing a separate API server.',
            resources: [
              {
                label: 'Remix – Resource Routes (advanced)',
                url: 'https://remix.run/docs/en/main/guides/resource-routes#handling-different-request-methods',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Pagination and Infinite Lists',
        children: [
          {
            title: 'Cursor and offset pagination in loaders',
            description:
              'Loaders read page or cursor search params to query the correct data slice from the database. Returning a nextCursor in loader data lets the client request the next page without re-fetching previous results.',
            resources: [
              {
                label: 'Prisma – Pagination',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/pagination',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Infinite scroll with useFetcher and load-more',
            description:
              'A load-more button triggers a fetcher.load() to the same route with an incremented cursor. The component appends fetcher.data to existing list items, building an infinite scroll without libraries.',
            resources: [
              {
                label: 'Remix – useFetcher examples',
                url: 'https://remix.run/docs/en/main/hooks/use-fetcher#examples',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 9 ── Styling and Performance ───────────────────────────────────────
  {
    id: 'remix-dev-9',
    sideLeft: [
      {
        title: 'Tailwind CSS Integration',
        children: [
          {
            title: 'Setting up Tailwind in a Remix Vite project',
            description:
              'Adding Tailwind requires installing the package, creating tailwind.config.ts with a content glob for app/**/*.{ts,tsx}, and importing the CSS file in root.tsx. Vite handles the rest.',
            resources: [
              {
                label: 'Tailwind CSS – Installation with Vite',
                url: 'https://tailwindcss.com/docs/installation/using-vite',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Responsive design and dark mode with Tailwind',
            description:
              'Tailwind\'s sm:, md:, lg: prefixes apply styles at breakpoints without media query boilerplate. Enabling class-based dark mode lets you toggle dark:bg-gray-900 classes via a data-theme attribute.',
            resources: [
              {
                label: 'Tailwind CSS – Responsive Design',
                url: 'https://tailwindcss.com/docs/responsive-design',
                type: 'docs',
              },
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
        title: 'Core Web Vitals and SEO',
        children: [
          {
            title: 'Core Web Vitals: LCP, CLS, and INP',
            description:
              'LCP measures load speed, CLS measures layout stability, and INP measures interaction responsiveness. Remix\'s server rendering and streaming directly improve LCP scores versus client-only SPAs.',
            resources: [
              {
                label: 'web.dev – Core Web Vitals',
                url: 'https://web.dev/explore/learn-core-web-vitals',
                type: 'article',
              },
            ],
          },
          {
            title: 'Meta function for SEO tags and Open Graph',
            description:
              'Remix\'s meta export returns an array of descriptor objects that render as <title>, <meta>, and <link> tags. Each route can override parent meta, enabling per-page SEO without a Helmet library.',
            resources: [
              {
                label: 'Remix – meta export',
                url: 'https://remix.run/docs/en/main/route/meta',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Reusable Styled Components',
        children: [
          {
            title: 'Class Variance Authority for component variants',
            description:
              'CVA maps variant props to Tailwind class sets, letting you build typed Button, Badge, or Input components without conditional string concatenation or a CSS-in-JS runtime.',
            resources: [
              {
                label: 'Class Variance Authority – Docs',
                url: 'https://cva.style/docs',
                type: 'docs',
              },
            ],
          },
          {
            title: 'shadcn/ui as accessible component primitives',
            description:
              'shadcn/ui copies Radix UI primitives pre-styled with Tailwind into your project. You own the code, so you can customise it freely—ideal for production Remix apps that need accessible, polished UI fast.',
            resources: [
              {
                label: 'shadcn/ui – Getting Started',
                url: 'https://ui.shadcn.com/docs',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Asset and Link Optimisation',
        children: [
          {
            title: 'links export for stylesheets and preloads',
            description:
              'The links export lets each route declare the CSS files and preload hints it needs. Remix injects them only when the route is active, preventing unused style loading on unrelated pages.',
            resources: [
              {
                label: 'Remix – links export',
                url: 'https://remix.run/docs/en/main/route/links',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Image optimisation and lazy loading',
            description:
              'Using loading="lazy" and proper width/height attributes on images prevents CLS and defers off-screen image fetches. Vite\'s asset pipeline fingerprints images for long-lived cache headers.',
            resources: [
              {
                label: 'web.dev – Lazy loading images',
                url: 'https://web.dev/articles/lazy-loading-images',
                type: 'article',
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 10 ── Testing and Deployment ───────────────────────────────────────
  {
    id: 'remix-dev-10',
    sideLeft: [
      {
        title: 'Unit and Integration Testing',
        children: [
          {
            title: 'Vitest for unit testing utilities and loaders',
            description:
              'Vitest is the recommended test runner for Vite-based projects. You can unit-test pure utility functions and even Remix loaders/actions by constructing a Request object and asserting the Response.',
            resources: [
              {
                label: 'Vitest – Getting Started',
                url: 'https://vitest.dev/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'React Testing Library for component tests',
            description:
              'React Testing Library renders components in a JSDOM environment and provides queries that mirror how users interact with the UI. It is the standard for testing React components in isolation.',
            resources: [
              {
                label: 'Testing Library – React',
                url: 'https://testing-library.com/docs/react-testing-library/intro/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'E2E Testing with Playwright',
        children: [
          {
            title: 'Playwright test setup for Remix apps',
            description:
              'Playwright launches a real browser and runs scenarios against a running Remix dev server. The webServer config option in playwright.config.ts starts the dev server automatically before the test suite.',
            resources: [
              {
                label: 'Playwright – Getting Started',
                url: 'https://playwright.dev/docs/intro',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Testing auth flows and form submissions end-to-end',
            description:
              'E2E tests for login, signup, and protected routes verify the full stack: from the browser form submission through the Remix action, database write, session cookie, and redirect.',
            resources: [
              {
                label: 'Playwright – Authentication',
                url: 'https://playwright.dev/docs/auth',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Deployment Targets',
        children: [
          {
            title: 'Deploying to Fly.io with Docker',
            description:
              'Fly.io is the most common Remix deployment target. Running flyctl launch generates a Dockerfile and fly.toml; flyctl deploy builds and deploys the container globally in minutes.',
            resources: [
              {
                label: 'Fly.io – Remix Deployment Guide',
                url: 'https://fly.io/docs/js/frameworks/remix/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Vercel and Netlify serverless adapters',
            description:
              'Remix ships official adapters for Vercel and Netlify that compile the app to serverless functions. Each platform auto-detects the Remix adapter and sets up routing with zero extra configuration.',
            resources: [
              {
                label: 'Remix – Deployment Guide',
                url: 'https://remix.run/docs/en/main/guides/deployment',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Production Configuration',
        children: [
          {
            title: 'Production DATABASE_URL and env var management',
            description:
              'Production secrets should be set via the deployment platform\'s secret store (fly secrets set, Vercel environment variables) rather than committed .env files. Prisma reads DATABASE_URL at runtime.',
            resources: [
              {
                label: 'Fly.io – Secrets Management',
                url: 'https://fly.io/docs/apps/secrets/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Preview deployments and monitoring setup',
            description:
              'PR preview deployments let you test changes against a real environment before merging. Pairing them with Sentry or Datadog alerts on error-rate spikes gives confidence in every deploy.',
            resources: [
              {
                label: 'Fly.io – Deploy Previews',
                url: 'https://fly.io/docs/launch/deploy/',
                type: 'docs',
              },
              {
                label: 'Sentry – Production Monitoring',
                url: 'https://docs.sentry.io/product/performance/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Apply patches
// ---------------------------------------------------------------------------

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

if (!Array.isArray(data['remix-dev'])) {
  console.error('ERROR: "remix-dev" key not found or is not an array.');
  process.exit(1);
}

let applied = 0;

for (const patch of patches) {
  const layer = data['remix-dev'].find((item) => item.id === patch.id);
  if (!layer) {
    console.warn(`WARNING: Layer "${patch.id}" not found, skipping.`);
    continue;
  }
  layer.sideLeft = patch.sideLeft;
  layer.sideRight = patch.sideRight;
  applied++;
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches.`);
