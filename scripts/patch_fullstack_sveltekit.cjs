'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(
  __dirname,
  '../src/data/roadmaps/fullstack.json'
);

// ---------------------------------------------------------------------------
// Patch data — sveltekit-dev-1 through sveltekit-dev-10
// Each entry: { id, sideLeft, sideRight }
// sideLeft  = conceptual / theory  (2 groups, 2-3 children each)
// sideRight = practical / tooling  (2 groups, 2-3 children each)
// ---------------------------------------------------------------------------

const patches = [
  // -------------------------------------------------------------------------
  // 1 — JavaScript and TypeScript Foundations
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-1',
    sideLeft: [
      {
        title: 'Modern JavaScript Core',
        children: [
          {
            title: 'Arrow functions and destructuring syntax',
            description:
              'ES6+ shorthand features that reduce boilerplate in component code. Svelte templates rely on these patterns throughout.',
            resources: [
              {
                label: 'MDN — Arrow functions',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
                type: 'docs',
              },
              {
                label: 'MDN — Destructuring assignment',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
                type: 'docs',
              },
            ],
          },
          {
            title: 'ES modules import and export system',
            description:
              'The native browser module system used by Vite and SvelteKit. Understanding named vs default exports prevents common import errors.',
            resources: [
              {
                label: 'MDN — JavaScript modules',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Promises and async/await control flow',
            description:
              'Async patterns are essential for data fetching in SvelteKit load functions. Knowing how to chain and handle errors prevents silent failures.',
            resources: [
              {
                label: 'MDN — Using Promises',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
                type: 'docs',
              },
              {
                label: 'MDN — async function',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'TypeScript Type System',
        children: [
          {
            title: 'Interfaces and type aliases in TypeScript',
            description:
              'TypeScript lets you describe the shape of objects and function signatures. SvelteKit generates types for routes automatically, making this knowledge essential.',
            resources: [
              {
                label: 'TypeScript Handbook — Interfaces',
                url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Generics and utility types overview',
            description:
              "Generics allow reusable, type-safe abstractions. SvelteKit's typed load helpers like PageLoad use generics extensively.",
            resources: [
              {
                label: 'TypeScript Handbook — Generics',
                url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
                type: 'docs',
              },
              {
                label: 'TypeScript Handbook — Utility Types',
                url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Vite Dev Server',
        children: [
          {
            title: 'Vite project structure and config file',
            description:
              'Vite is the build tool SvelteKit uses under the hood. Knowing vite.config.ts lets you add plugins and customize the dev experience.',
            resources: [
              {
                label: 'Vite — Configuring Vite',
                url: 'https://vitejs.dev/config/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Hot Module Replacement during development',
            description:
              "Vite's HMR pushes component changes to the browser without a full reload. Understanding it helps debug state loss during development.",
            resources: [
              {
                label: 'Vite — HMR API',
                url: 'https://vitejs.dev/guide/api-hmr.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'DOM and Browser APIs',
        children: [
          {
            title: 'DOM querying and event listener basics',
            description:
              'Svelte abstracts the DOM but sometimes you need raw API access. Lifecycle functions like onMount run in the browser where DOM APIs are available.',
            resources: [
              {
                label: 'MDN — Document interface',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Fetch API for HTTP requests',
            description:
              'The native Fetch API is the basis for all data loading in SvelteKit. The framework wraps it but knowing the raw API helps debug network issues.',
            resources: [
              {
                label: 'MDN — Fetch API',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2 — Svelte Fundamentals
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-2',
    sideLeft: [
      {
        title: 'Component Model',
        children: [
          {
            title: 'Single-file components and props declaration',
            description:
              'Svelte components live in .svelte files with script, markup, and style sections. Props are declared with $props() in Svelte 5 runes mode.',
            resources: [
              {
                label: 'Svelte Docs — Component fundamentals',
                url: 'https://svelte.dev/docs/svelte/overview',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reactivity with runes and $state',
            description:
              'Svelte 5 introduced runes — compiler signals like $state and $derived that replace the old reactive declarations. They make data flow explicit.',
            resources: [
              {
                label: 'Svelte Docs — Runes',
                url: 'https://svelte.dev/docs/svelte/what-are-runes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Slots and component composition patterns',
            description:
              'Slots let parent components project markup into children. They are the primary composition mechanism for building layout wrappers.',
            resources: [
              {
                label: 'Svelte Docs — Snippets (Svelte 5 slots)',
                url: 'https://svelte.dev/docs/svelte/snippet',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Template Directives',
        children: [
          {
            title: 'Conditional rendering with if and else blocks',
            description:
              '{#if} blocks conditionally include DOM nodes. Unlike framework virtual DOM diffing, Svelte creates and destroys real elements.',
            resources: [
              {
                label: 'Svelte Docs — {#if ...}',
                url: 'https://svelte.dev/docs/svelte/if',
                type: 'docs',
              },
            ],
          },
          {
            title: 'List rendering with each blocks and keys',
            description:
              '{#each} iterates arrays and renders repeated elements. Keys tell Svelte how to efficiently reconcile list changes.',
            resources: [
              {
                label: 'Svelte Docs — {#each ...}',
                url: 'https://svelte.dev/docs/svelte/each',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Events and Bindings',
        children: [
          {
            title: 'DOM event handling with onclick and on directives',
            description:
              'Svelte uses onclick={handler} shorthand in Svelte 5. Understanding event delegation vs direct listeners matters for performance.',
            resources: [
              {
                label: 'Svelte Docs — Event handling',
                url: 'https://svelte.dev/docs/svelte/event-handling',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Two-way binding with bind directive',
            description:
              'bind:value syncs form inputs directly to state variables. It eliminates boilerplate event handlers for common input patterns.',
            resources: [
              {
                label: 'Svelte Docs — bind:',
                url: 'https://svelte.dev/docs/svelte/bind',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Styles and Scoping',
        children: [
          {
            title: 'Scoped CSS and global style overrides',
            description:
              'Styles in a <style> block are scoped to the component by default. The :global() modifier breaks out of scoping when needed.',
            resources: [
              {
                label: 'Svelte Docs — Scoped styles',
                url: 'https://svelte.dev/docs/svelte/scoped-styles',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Class and style directives for dynamic styling',
            description:
              'class:active={isActive} conditionally applies classes without string concatenation. style:color={value} applies inline styles reactively.',
            resources: [
              {
                label: 'Svelte Docs — class: directive',
                url: 'https://svelte.dev/docs/svelte/class',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 3 — SvelteKit Routing and Pages
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-3',
    sideLeft: [
      {
        title: 'Routing Concepts',
        children: [
          {
            title: 'File-based routing and the src/routes directory',
            description:
              'SvelteKit maps the file system to URLs. A +page.svelte file inside a folder becomes the page for that route segment.',
            resources: [
              {
                label: 'SvelteKit Docs — Routing',
                url: 'https://svelte.dev/docs/kit/routing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Layouts and nested layout inheritance',
            description:
              '+layout.svelte wraps child routes with shared UI like navbars. Nested folders inherit parent layouts forming a layout tree.',
            resources: [
              {
                label: 'SvelteKit Docs — Layouts',
                url: 'https://svelte.dev/docs/kit/routing#layout',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Dynamic route parameters with bracket syntax',
            description:
              'A folder named [slug] creates a dynamic segment. The parameter value is available in load functions via params.slug.',
            resources: [
              {
                label: 'SvelteKit Docs — Route parameters',
                url: 'https://svelte.dev/docs/kit/routing#page-page-svelte',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Error and Navigation',
        children: [
          {
            title: 'Error pages with +error.svelte boundary',
            description:
              '+error.svelte catches errors thrown in load functions and renders a fallback. Nested error files scope the boundary to a subtree.',
            resources: [
              {
                label: 'SvelteKit Docs — Error pages',
                url: 'https://svelte.dev/docs/kit/routing#error',
                type: 'docs',
              },
            ],
          },
          {
            title: 'SvelteKit project folder structure overview',
            description:
              'src/routes, src/lib, static, and svelte.config.js each serve a distinct purpose. Understanding the layout prevents config confusion.',
            resources: [
              {
                label: 'SvelteKit Docs — Project structure',
                url: 'https://svelte.dev/docs/kit/project-structure',
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
            title: 'Client-side navigation with anchor tags',
            description:
              "Standard <a href> tags trigger SvelteKit's client-side router automatically. No special component is required unlike other frameworks.",
            resources: [
              {
                label: 'SvelteKit Docs — Navigation',
                url: 'https://svelte.dev/docs/kit/navigation',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Programmatic navigation with goto function',
            description:
              'The goto() helper navigates imperatively from event handlers or after form submissions. It supports push/replace and state options.',
            resources: [
              {
                label: 'SvelteKit Docs — goto',
                url: 'https://svelte.dev/docs/kit/$app-navigation',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Route Groups and Advanced Routing',
        children: [
          {
            title: 'Route groups to share layouts without URL segments',
            description:
              'Folders wrapped in (parentheses) are route groups. They apply a layout to a subset of routes without adding a URL segment.',
            resources: [
              {
                label: 'SvelteKit Docs — Advanced routing',
                url: 'https://svelte.dev/docs/kit/advanced-routing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Rest and optional route parameter patterns',
            description:
              '[...rest] captures multiple path segments. [[optional]] makes a segment optional. Both are useful for catch-all and i18n routes.',
            resources: [
              {
                label: 'SvelteKit Docs — Rest parameters',
                url: 'https://svelte.dev/docs/kit/advanced-routing#rest-parameters',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 4 — Loading Data
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-4',
    sideLeft: [
      {
        title: 'Load Function Concepts',
        children: [
          {
            title: 'Page and layout load functions explained',
            description:
              "+page.server.ts exports a load function that fetches data before the page renders. The returned object becomes the page's data prop.",
            resources: [
              {
                label: 'SvelteKit Docs — Loading data',
                url: 'https://svelte.dev/docs/kit/load',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Server-only vs universal load distinction',
            description:
              '+page.server.ts runs only on the server. +page.ts (universal) runs on both. Server loads can safely access databases; universal loads cannot.',
            resources: [
              {
                label: 'SvelteKit Docs — Universal vs server load',
                url: 'https://svelte.dev/docs/kit/load#universal-vs-server',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Type-safe data with generated PageData types',
            description:
              'SvelteKit auto-generates TypeScript types in .svelte-kit/types for each route. Importing PageData ensures load return types match component props.',
            resources: [
              {
                label: 'SvelteKit Docs — Type safety',
                url: 'https://svelte.dev/docs/kit/types',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Error and Redirect Handling',
        children: [
          {
            title: 'Throwing error and redirect inside load functions',
            description:
              "The error() and redirect() helpers from @sveltejs/kit are thrown inside load to abort rendering. They integrate with SvelteKit's error boundary.",
            resources: [
              {
                label: 'SvelteKit Docs — Errors',
                url: 'https://svelte.dev/docs/kit/errors',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Streaming data with deferred promises',
            description:
              'Returning a promise from load without awaiting it enables streaming. The browser receives HTML immediately while awaiting the remaining data.',
            resources: [
              {
                label: 'SvelteKit Docs — Streaming with promises',
                url: 'https://svelte.dev/docs/kit/load#streaming-with-promises',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Params and Fetch',
        children: [
          {
            title: 'Accessing route params inside the load event',
            description:
              'Load receives an event object with params, url, and cookies. Destructuring params gives you typed access to dynamic route segments.',
            resources: [
              {
                label: 'SvelteKit Docs — Load input',
                url: 'https://svelte.dev/docs/kit/load#making-fetch-requests',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Using the load event fetch helper safely',
            description:
              'The fetch provided to load is enhanced — it includes cookies on the server and can call internal endpoints with relative URLs.',
            resources: [
              {
                label: 'SvelteKit Docs — Making fetch requests',
                url: 'https://svelte.dev/docs/kit/load#making-fetch-requests',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Invalidation and Dependencies',
        children: [
          {
            title: 'invalidate and invalidateAll for re-running loads',
            description:
              'Calling invalidate(url) tells SvelteKit to re-run load functions that depend on that URL. It avoids full page navigations after mutations.',
            resources: [
              {
                label: 'SvelteKit Docs — invalidate',
                url: 'https://svelte.dev/docs/kit/$app-navigation#invalidate',
                type: 'docs',
              },
            ],
          },
          {
            title: 'depends() for manual load dependency tracking',
            description:
              'depends(\'custom:key\') registers a custom dependency in a load function. Calling invalidate(\'custom:key\') re-runs only those loads.',
            resources: [
              {
                label: 'SvelteKit Docs — depends',
                url: 'https://svelte.dev/docs/kit/load#rerunning-load-functions',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 5 — Form Actions and Mutations
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-5',
    sideLeft: [
      {
        title: 'Form Actions Concepts',
        children: [
          {
            title: 'Defining actions in plus page.server.ts files',
            description:
              'Exporting an actions object from +page.server.ts lets HTML forms POST to the same route. It keeps mutation logic co-located with the page.',
            resources: [
              {
                label: 'SvelteKit Docs — Form actions',
                url: 'https://svelte.dev/docs/kit/form-actions',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Named actions for multiple forms on one page',
            description:
              'action="?/create" and action="?/delete" route to different handlers in the same actions object. Useful when a page has several mutation concerns.',
            resources: [
              {
                label: 'SvelteKit Docs — Named actions',
                url: 'https://svelte.dev/docs/kit/form-actions#named-actions',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Returning validation errors from actions',
            description:
              'Returning fail(400, { errors }) from an action sends error data back to the form without a redirect. The page data receives it via form prop.',
            resources: [
              {
                label: 'SvelteKit Docs — Validation errors',
                url: 'https://svelte.dev/docs/kit/form-actions#validation-errors',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Schema Validation',
        children: [
          {
            title: 'Zod schema validation for form data',
            description:
              'Zod parses and validates form data against a typed schema inside an action. It provides human-readable errors without manual checks.',
            resources: [
              {
                label: 'Zod — Getting started',
                url: 'https://zod.dev/?id=basic-usage',
                type: 'docs',
              },
              {
                label: 'Zod — String validations',
                url: 'https://zod.dev/?id=strings',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Parsing FormData with Object.fromEntries',
            description:
              'FormData must be converted to a plain object before Zod can parse it. Understanding this conversion step prevents runtime type errors.',
            resources: [
              {
                label: 'MDN — FormData',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/FormData',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Progressive Enhancement',
        children: [
          {
            title: 'Enhance directive for JavaScript-enhanced forms',
            description:
              'use:enhance intercepts form submissions and handles them with fetch instead of a full page reload. Forms still work without JS.',
            resources: [
              {
                label: 'SvelteKit Docs — Progressive enhancement',
                url: 'https://svelte.dev/docs/kit/form-actions#progressive-enhancement',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Custom enhance callback for optimistic updates',
            description:
              'Passing a function to use:enhance gives full control over the submit/result lifecycle. It enables optimistic UI and custom redirect logic.',
            resources: [
              {
                label: 'SvelteKit Docs — Customizing use:enhance',
                url: 'https://svelte.dev/docs/kit/form-actions#progressive-enhancement-customising-use-enhance',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Invalidation After Mutations',
        children: [
          {
            title: 'Automatic data invalidation after action success',
            description:
              'By default, use:enhance re-runs all load functions after a successful action. This keeps displayed data fresh without manual refreshes.',
            resources: [
              {
                label: 'SvelteKit Docs — Form actions — invalidation',
                url: 'https://svelte.dev/docs/kit/form-actions#progressive-enhancement',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Redirect after POST to prevent duplicate submissions',
            description:
              'Throwing redirect(303, "/path") after a successful action follows the POST/Redirect/GET pattern. It prevents form resubmission on refresh.',
            resources: [
              {
                label: 'SvelteKit Docs — redirect helper',
                url: 'https://svelte.dev/docs/kit/load#redirects',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 6 — Databases and Persistence
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-6',
    sideLeft: [
      {
        title: 'Prisma Schema and Models',
        children: [
          {
            title: 'Defining models and fields in schema.prisma',
            description:
              'The Prisma schema file describes your database tables as models with typed fields. Running prisma generate creates a type-safe client from it.',
            resources: [
              {
                label: 'Prisma Docs — Data modeling',
                url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Model relations: one-to-many and many-to-many',
            description:
              'Prisma represents foreign keys as relation fields. Defining both sides of a relation enables nested include queries.',
            resources: [
              {
                label: 'Prisma Docs — Relations',
                url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Migrations and Seeding',
        children: [
          {
            title: 'Creating and applying database migrations',
            description:
              'prisma migrate dev generates SQL migration files from schema changes and applies them. This keeps the database in sync with the schema.',
            resources: [
              {
                label: 'Prisma Docs — Migrations',
                url: 'https://www.prisma.io/docs/orm/prisma-migrate',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Seeding the database with initial data',
            description:
              'A seed script populates the database with development data. Prisma runs it via prisma db seed after configuring the script in package.json.',
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
    ],
    sideRight: [
      {
        title: 'Querying in Server Code',
        children: [
          {
            title: 'CRUD operations with PrismaClient',
            description:
              'prisma.model.findMany(), create(), update(), and delete() cover the majority of data operations. All return typed objects matching the schema.',
            resources: [
              {
                label: 'Prisma Docs — CRUD operations',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/crud',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Filtering and selecting fields in queries',
            description:
              'where, select, and include control what Prisma fetches. Selecting only needed fields reduces payload size and prevents over-fetching.',
            resources: [
              {
                label: 'Prisma Docs — Select fields',
                url: 'https://www.prisma.io/docs/orm/prisma-client/queries/select-fields',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Environment Configuration',
        children: [
          {
            title: 'DATABASE_URL env variable setup for Prisma',
            description:
              'Prisma reads the connection string from DATABASE_URL in .env. SvelteKit exposes server env vars through $env/static/private.',
            resources: [
              {
                label: 'Prisma Docs — Connection URLs',
                url: 'https://www.prisma.io/docs/orm/reference/connection-urls',
                type: 'docs',
              },
              {
                label: 'SvelteKit Docs — Environment variables',
                url: 'https://svelte.dev/docs/kit/modules#$env-static-private',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Singleton PrismaClient pattern in SvelteKit',
            description:
              'Hot module reloading can create multiple PrismaClient instances. A module-level singleton stored in globalThis prevents connection pool exhaustion.',
            resources: [
              {
                label: 'Prisma Docs — Best practices for instantiating PrismaClient',
                url: 'https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 7 — Authentication and Hooks
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-7',
    sideLeft: [
      {
        title: 'Server Hooks',
        children: [
          {
            title: 'The handle hook and request interception',
            description:
              'Exporting handle from src/hooks.server.ts intercepts every server request. It is used to attach session data to event.locals before any load runs.',
            resources: [
              {
                label: 'SvelteKit Docs — Hooks',
                url: 'https://svelte.dev/docs/kit/hooks',
                type: 'docs',
              },
            ],
          },
          {
            title: 'event.locals for passing data to load functions',
            description:
              'locals is a per-request object populated in handle and readable in all load and action functions. It is the idiomatic place to store the current user.',
            resources: [
              {
                label: 'SvelteKit Docs — locals',
                url: 'https://svelte.dev/docs/kit/hooks#server-hooks-handle',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Session and Cookie Concepts',
        children: [
          {
            title: 'Sessions and HTTP cookies for authentication state',
            description:
              'Sessions persist login state between requests. The server stores session data and sends a session ID cookie to the browser.',
            resources: [
              {
                label: 'MDN — HTTP cookies',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Protecting routes by checking locals in load',
            description:
              'Calling redirect(302, "/login") from a load function when locals.user is null locks down authenticated pages without middleware libraries.',
            resources: [
              {
                label: 'SvelteKit Docs — Protecting routes',
                url: 'https://svelte.dev/docs/kit/load#cookies',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Auth Flows',
        children: [
          {
            title: 'Login and signup form actions with password hashing',
            description:
              'Registration and login are server actions that hash passwords with bcrypt and create sessions. Keeping these server-side protects credentials.',
            resources: [
              {
                label: 'Lucia Auth — Username and password tutorial',
                url: 'https://lucia-auth.com/tutorials/username-and-password/sveltekit',
                type: 'tutorial',
              },
            ],
          },
          {
            title: 'Logout action that clears session cookies',
            description:
              'Logout deletes the server-side session and sets the cookie to expire immediately. A server action is the correct place since it runs on the server.',
            resources: [
              {
                label: 'Lucia Auth — Sessions',
                url: 'https://lucia-auth.com/basics/sessions',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Security Practices',
        children: [
          {
            title: 'CSRF protection built into SvelteKit form actions',
            description:
              'SvelteKit form actions automatically validate the Origin header to prevent cross-site request forgery. Third-party fetch-based mutations must add tokens manually.',
            resources: [
              {
                label: 'SvelteKit Docs — CSRF protection',
                url: 'https://svelte.dev/docs/kit/form-actions#anatomy-of-an-action',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Secure and HttpOnly cookie flags explained',
            description:
              'HttpOnly prevents JavaScript from reading session cookies, mitigating XSS. Secure ensures cookies are only sent over HTTPS in production.',
            resources: [
              {
                label: 'MDN — Set-Cookie attributes',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 8 — Advanced UI and Stores
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-8',
    sideLeft: [
      {
        title: 'Svelte Stores',
        children: [
          {
            title: 'Writable and readable stores for shared state',
            description:
              'Svelte stores are observables that any component can subscribe to. Writable stores allow external updates; readable stores are read-only.',
            resources: [
              {
                label: 'Svelte Docs — Stores',
                url: 'https://svelte.dev/docs/svelte/stores',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Derived stores that compute from other stores',
            description:
              'derived() creates a store whose value is automatically computed from one or more source stores. It replaces manual subscription and calculation.',
            resources: [
              {
                label: 'Svelte Docs — derived',
                url: 'https://svelte.dev/docs/svelte/stores#derived',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Context API for component-tree scoped state',
            description:
              'setContext and getContext pass values down a component tree without prop drilling. Context is local to the tree unlike module-level stores.',
            resources: [
              {
                label: 'Svelte Docs — Context API',
                url: 'https://svelte.dev/docs/svelte/context',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Accessibility Patterns',
        children: [
          {
            title: 'ARIA attributes and semantic HTML in components',
            description:
              'Svelte warns about missing accessibility attributes at compile time. Using semantic elements and ARIA ensures screen reader compatibility.',
            resources: [
              {
                label: 'Svelte Docs — Accessibility warnings',
                url: 'https://svelte.dev/docs/svelte/compiler-warnings',
                type: 'docs',
              },
              {
                label: 'MDN — ARIA',
                url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Transitions and Animations',
        children: [
          {
            title: 'Built-in transitions like fade and slide',
            description:
              'The svelte/transition module provides declarative enter/leave animations. Applying transition:fade to an {#if} block animates DOM insertions and removals.',
            resources: [
              {
                label: 'Svelte Docs — Transitions',
                url: 'https://svelte.dev/docs/svelte/transition',
                type: 'docs',
              },
            ],
          },
          {
            title: 'The animate directive for list reordering',
            description:
              'animate:flip animates elements within an {#each} block when keys change position. It makes list reorders feel smooth without manual DOM work.',
            resources: [
              {
                label: 'Svelte Docs — animate:',
                url: 'https://svelte.dev/docs/svelte/animate',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Actions and Use Directives',
        children: [
          {
            title: 'Custom actions for reusable DOM behavior',
            description:
              'use:action attaches imperative DOM logic to an element. It is the correct escape hatch for third-party library integration and focus management.',
            resources: [
              {
                label: 'Svelte Docs — use: (actions)',
                url: 'https://svelte.dev/docs/svelte/use',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reusable component patterns with generics',
            description:
              'Svelte 5 supports generic components via <script generics="T">. This enables type-safe data table and list components that work with any item type.',
            resources: [
              {
                label: 'Svelte Docs — Generic components',
                url: 'https://svelte.dev/docs/svelte/generics',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 9 — APIs and Advanced SvelteKit
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-9',
    sideLeft: [
      {
        title: 'Server Endpoints',
        children: [
          {
            title: 'API routes with plus server.ts files',
            description:
              '+server.ts exports GET, POST, PATCH, DELETE handlers. They return a Response object and act as a REST endpoint alongside page routes.',
            resources: [
              {
                label: 'SvelteKit Docs — Server-only modules',
                url: 'https://svelte.dev/docs/kit/routing#server',
                type: 'docs',
              },
            ],
          },
          {
            title: 'json and error helpers for API responses',
            description:
              "SvelteKit's json() shortcut sets Content-Type and serializes the body. The error() helper produces structured error responses with correct status codes.",
            resources: [
              {
                label: 'SvelteKit Docs — RequestEvent helpers',
                url: 'https://svelte.dev/docs/kit/modules#sveltejs-kit',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Rendering Strategies',
        children: [
          {
            title: 'SSR, CSR, and prerendering page options',
            description:
              'Setting export const ssr = false disables server rendering per route. prerender = true generates static HTML at build time. Choosing correctly affects SEO and performance.',
            resources: [
              {
                label: 'SvelteKit Docs — Page options',
                url: 'https://svelte.dev/docs/kit/page-options',
                type: 'docs',
              },
            ],
          },
          {
            title: 'SvelteKit adapters for deployment targets',
            description:
              'Adapters transform the build output for a specific platform. adapter-node creates a Node.js server; adapter-static outputs a pure static site.',
            resources: [
              {
                label: 'SvelteKit Docs — Adapters',
                url: 'https://svelte.dev/docs/kit/adapters',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Environment and Config',
        children: [
          {
            title: 'Public vs private environment variables in SvelteKit',
            description:
              '$env/static/private exposes server-only vars. $env/static/public (prefixed PUBLIC_) is safe to expose to the browser. Mixing them leaks secrets.',
            resources: [
              {
                label: 'SvelteKit Docs — $env/static/private',
                url: 'https://svelte.dev/docs/kit/modules#$env-static-private',
                type: 'docs',
              },
              {
                label: 'SvelteKit Docs — $env/static/public',
                url: 'https://svelte.dev/docs/kit/modules#$env-static-public',
                type: 'docs',
              },
            ],
          },
          {
            title: 'svelte.config.js and kit configuration options',
            description:
              'svelte.config.js controls the adapter, path aliases, and Vite settings. Understanding it prevents build-time surprises when targeting different hosts.',
            resources: [
              {
                label: 'SvelteKit Docs — Configuration',
                url: 'https://svelte.dev/docs/kit/configuration',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Path Aliases and Module Resolution',
        children: [
          {
            title: '$lib path alias for shared utilities',
            description:
              'SvelteKit configures $lib to point to src/lib. Importing from $lib/server prevents circular deps and keeps utility imports short across the codebase.',
            resources: [
              {
                label: 'SvelteKit Docs — $lib',
                url: 'https://svelte.dev/docs/kit/modules#$lib',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Server-only modules with plus server restriction',
            description:
              'Files in $lib/server are restricted from being imported in client code. SvelteKit throws a build error if a browser bundle imports them, preventing data leaks.',
            resources: [
              {
                label: 'SvelteKit Docs — Server-only modules',
                url: 'https://svelte.dev/docs/kit/server-only-modules',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 10 — Testing and Deployment
  // -------------------------------------------------------------------------
  {
    id: 'sveltekit-dev-10',
    sideLeft: [
      {
        title: 'Unit Testing with Vitest',
        children: [
          {
            title: 'Vitest setup and test file conventions',
            description:
              'Vitest is Vite-native and shares its config. Test files named *.test.ts run automatically and support the same import aliases as the app.',
            resources: [
              {
                label: 'Vitest — Getting started',
                url: 'https://vitest.dev/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Testing pure utility functions and stores',
            description:
              'Svelte stores and helper modules are plain JS and can be tested without a DOM. Vitest runs these tests in Node for speed.',
            resources: [
              {
                label: 'Vitest — Testing',
                url: 'https://vitest.dev/guide/testing-types.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Mocking modules and environment variables in tests',
            description:
              'vi.mock() replaces module imports with test doubles. Mocking $env modules prevents tests from requiring real secrets.',
            resources: [
              {
                label: 'Vitest — Mocking',
                url: 'https://vitest.dev/guide/mocking.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Deployment Strategies',
        children: [
          {
            title: 'Choosing an adapter for your target platform',
            description:
              'adapter-vercel, adapter-netlify, and adapter-node each produce a different output. Matching the adapter to the hosting platform prevents runtime errors.',
            resources: [
              {
                label: 'SvelteKit Docs — Adapters',
                url: 'https://svelte.dev/docs/kit/adapters',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Environment variables in production deployments',
            description:
              'Production env vars are set in the hosting dashboard, not in .env files. The PUBLIC_ prefix convention controls which values are embedded in the client bundle.',
            resources: [
              {
                label: 'SvelteKit Docs — Environment variables',
                url: 'https://svelte.dev/docs/kit/modules#$env-dynamic-public',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'End-to-End Testing with Playwright',
        children: [
          {
            title: 'Playwright installation and browser setup',
            description:
              'Playwright drives real browsers (Chromium, Firefox, WebKit) from Node.js. It integrates with Vitest or runs standalone via the @playwright/test runner.',
            resources: [
              {
                label: 'Playwright — Installation',
                url: 'https://playwright.dev/docs/intro',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Writing page navigation and form interaction tests',
            description:
              'Playwright tests click buttons, fill forms, and assert URL and DOM state. Testing full user flows catches integration bugs that unit tests miss.',
            resources: [
              {
                label: 'Playwright — Writing tests',
                url: 'https://playwright.dev/docs/writing-tests',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Using Playwright fixtures and page object model',
            description:
              'Page Object Model encapsulates selectors and actions into reusable classes. Fixtures inject authenticated browser contexts to avoid repeating login steps.',
            resources: [
              {
                label: 'Playwright — Page Object Model',
                url: 'https://playwright.dev/docs/pom',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Monitoring and Previews',
        children: [
          {
            title: 'Preview deployments with adapter-vercel or Netlify',
            description:
              'Hosting platforms create preview URLs for every pull request. They run the production build against staging env vars for safe pre-merge testing.',
            resources: [
              {
                label: 'Vercel — Preview deployments',
                url: 'https://vercel.com/docs/deployments/preview-deployments',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Sourcemaps and error monitoring in production',
            description:
              'Uploading sourcemaps to a monitoring tool like Sentry maps minified stack traces back to original SvelteKit code, making production errors debuggable.',
            resources: [
              {
                label: 'Sentry — SvelteKit SDK',
                url: 'https://docs.sentry.io/platforms/javascript/guides/sveltekit/',
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
// Read, patch, write
// ---------------------------------------------------------------------------

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

const track = data['sveltekit-dev'];
if (!Array.isArray(track)) {
  console.error('ERROR: sveltekit-dev track not found in fullstack.json');
  process.exit(1);
}

let applied = 0;

for (const patch of patches) {
  const layer = track.find((l) => l.id === patch.id);
  if (!layer) {
    console.warn(`WARNING: layer ${patch.id} not found — skipping`);
    continue;
  }
  layer.sideLeft = patch.sideLeft;
  layer.sideRight = patch.sideRight;
  applied++;
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches`);
