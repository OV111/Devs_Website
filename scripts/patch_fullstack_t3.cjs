const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/data/roadmaps/fullstack.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const patches = [
  {
    "id": "t3-1",
    "sideLeft": [
      {
        "title": "TypeScript's type system: structural typing and inference",
        "children": [
          {
            "title": "Structural typing: assignability is based on shape, not name",
            "description": "TypeScript checks whether an object has the required properties, not whether it was declared as a specific type. This means an object literal with the right fields satisfies an interface even without an explicit declaration.",
            "resources": [
              { "label": "TypeScript Handbook — Type Compatibility", "url": "https://www.typescriptlang.org/docs/handbook/type-compatibility.html", "type": "docs" }
            ]
          },
          {
            "title": "Discriminated unions and exhaustive type narrowing",
            "description": "A discriminated union uses a shared literal field (kind: 'success' | 'error') to let TypeScript narrow to the right variant in each branch. Combined with never in a default case, the compiler catches missing branches.",
            "resources": [
              { "label": "TypeScript Handbook — Narrowing", "url": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Generics, utility types, and async patterns",
        "children": [
          {
            "title": "Generic functions and the extends constraint",
            "description": "Generics let you write one function that works with many types. The extends keyword constrains what types are accepted: function getField<T extends { id: number }>(obj: T) guarantees T has an id.",
            "resources": [
              { "label": "TypeScript Handbook — Generics", "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html", "type": "docs" }
            ]
          },
          {
            "title": "Async/await, Promise types, and error handling with unknown",
            "description": "Async functions return Promise<T>. In TypeScript 4+, catch clause errors are typed as unknown rather than any, forcing you to narrow before using them. Use instanceof Error before accessing .message.",
            "resources": [
              { "label": "TypeScript Handbook — Handbook", "url": "https://www.typescriptlang.org/docs/handbook/intro.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "TypeScript tooling and tsconfig for a T3 project",
        "children": [
          {
            "title": "Key tsconfig options: strict, moduleResolution, and paths",
            "description": "strict enables all strictness flags including strictNullChecks. moduleResolution: bundler matches how Vite/Next resolve imports. paths aliases like @/* to src/* remove relative import chains.",
            "resources": [
              { "label": "TypeScript Docs — tsconfig reference", "url": "https://www.typescriptlang.org/tsconfig", "type": "docs" }
            ]
          },
          {
            "title": "Utility types: Partial, Omit, Pick, and ReturnType in practice",
            "description": "Partial<User> makes all fields optional for update DTOs. Omit<User, 'passwordHash'> creates a safe public user type. ReturnType<typeof myFn> extracts a function's return type without repeating it.",
            "resources": [
              { "label": "TypeScript Handbook — Utility Types", "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Modern JavaScript patterns used throughout T3",
        "children": [
          {
            "title": "ES modules, destructuring, and optional chaining",
            "description": "T3 uses ESM throughout. Destructuring extracts props cleanly in components; optional chaining (user?.profile?.avatar) prevents null reference errors when traversing nested objects from API responses.",
            "resources": [
              { "label": "MDN — Optional Chaining", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining", "type": "docs" }
            ]
          },
          {
            "title": "Node.js module system and package.json type field",
            "description": "Setting type: module in package.json makes .js files use ESM. The T3 stack uses this with .ts extensions and tsx for JSX. Understanding module resolution prevents import errors at build time.",
            "resources": [
              { "label": "Node.js Docs — ECMAScript Modules", "url": "https://nodejs.org/api/esm.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-2",
    "sideLeft": [
      {
        "title": "React's rendering model and the component lifecycle",
        "children": [
          {
            "title": "How React reconciles the virtual DOM and batches renders",
            "description": "React builds a virtual DOM, diffs it against the previous tree, and applies minimal DOM mutations. React 18 batches all state updates by default — even inside timeouts and native event handlers.",
            "resources": [
              { "label": "React Docs — Render and Commit", "url": "https://react.dev/learn/render-and-commit", "type": "docs" }
            ]
          },
          {
            "title": "Hooks rules: why they can't be called conditionally",
            "description": "React tracks hooks by call order on each render. Calling a hook inside an if-block would change the count between renders, corrupting the internal state array. The linter rule enforces this at dev time.",
            "resources": [
              { "label": "React Docs — Rules of Hooks", "url": "https://react.dev/reference/rules/rules-of-hooks", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "TypeScript integration with React components and hooks",
        "children": [
          {
            "title": "Typing component props with interfaces and React.FC",
            "description": "Define a props interface and annotate the component: function Card({ title }: CardProps). Avoid React.FC — it hides the return type and makes component typing less explicit.",
            "resources": [
              { "label": "React TypeScript Cheatsheet", "url": "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/", "type": "docs" }
            ]
          },
          {
            "title": "Typing useState, useRef, and event handlers",
            "description": "useState<User | null>(null) explicitly types nullable state. useRef<HTMLInputElement>(null) types the ref target. Event handlers use React.ChangeEvent<HTMLInputElement> for the event type.",
            "resources": [
              { "label": "React TypeScript Cheatsheet — Hooks", "url": "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Building components with hooks and controlled forms",
        "children": [
          {
            "title": "useState and useEffect: state updates, stale closures, and cleanup",
            "description": "Calling the setter doesn't change state until the next render. Effects that reference state values in their closure will see stale values unless listed in the dependency array.",
            "resources": [
              { "label": "React Docs — useState", "url": "https://react.dev/reference/react/useState", "type": "docs" }
            ]
          },
          {
            "title": "Controlled inputs and form handling in TypeScript React",
            "description": "A controlled input's value is driven by React state. Type the onChange handler as (e: React.ChangeEvent<HTMLInputElement>) => void and update state with e.target.value.",
            "resources": [
              { "label": "React Docs — Reacting to Input with State", "url": "https://react.dev/learn/reacting-to-input-with-state", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "List rendering, composition, and prop patterns",
        "children": [
          {
            "title": "Rendering lists with stable key props from entity IDs",
            "description": "Keys help React identify which items changed, added, or removed. Use entity IDs from the database, not array indices. Index-based keys break reconciliation when items are reordered.",
            "resources": [
              { "label": "React Docs — Rendering Lists", "url": "https://react.dev/learn/rendering-lists", "type": "docs" }
            ]
          },
          {
            "title": "Component composition with children and render props",
            "description": "Pass JSX as the children prop for layout components (Card, Modal, Layout). Render props pass a function as a prop to give the parent control over what gets rendered inside.",
            "resources": [
              { "label": "React Docs — Passing JSX as Children", "url": "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-3",
    "sideLeft": [
      {
        "title": "Next.js App Router rendering model",
        "children": [
          {
            "title": "Server components versus client components: execution boundary",
            "description": "Server components run only on the server — they can access databases and secrets directly but cannot use hooks or browser APIs. 'use client' marks the boundary where code runs in the browser.",
            "resources": [
              { "label": "Next.js Docs — Server and Client Components", "url": "https://nextjs.org/docs/app/building-your-application/rendering/server-components", "type": "docs" }
            ]
          },
          {
            "title": "Static rendering, dynamic rendering, and streaming with Suspense",
            "description": "Static routes are rendered at build time and cached. Dynamic routes opt out of caching (cookies, searchParams). Streaming with Suspense sends the static shell immediately and streams dynamic content as it resolves.",
            "resources": [
              { "label": "Next.js Docs — Rendering", "url": "https://nextjs.org/docs/app/building-your-application/rendering", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "File-based routing and the layout system",
        "children": [
          {
            "title": "How layout.tsx, page.tsx, and loading.tsx compose the route tree",
            "description": "layout.tsx wraps page.tsx for a route segment. Nested layouts compose without re-mounting parent layouts on navigation. loading.tsx automatically wraps page.tsx in a Suspense boundary.",
            "resources": [
              { "label": "Next.js Docs — Routing", "url": "https://nextjs.org/docs/app/building-your-application/routing", "type": "docs" }
            ]
          },
          {
            "title": "Data fetching in server components: fetch with cache control",
            "description": "In server components, fetch() extends the native API with cache: 'force-cache' (default static), 'no-store' (dynamic), or next: { revalidate: 60 } (ISR). This controls how Next.js caches the response.",
            "resources": [
              { "label": "Next.js Docs — Data Fetching", "url": "https://nextjs.org/docs/app/building-your-application/data-fetching/fetching", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Setting up and navigating a Next.js App Router project",
        "children": [
          {
            "title": "Dynamic routes with [slug] and catch-all [...slug] segments",
            "description": "A file named [id]/page.tsx matches /posts/123 and provides params.id. Catch-all segments [...slug] match any depth. generateStaticParams() pre-generates dynamic routes at build time.",
            "resources": [
              { "label": "Next.js Docs — Dynamic Routes", "url": "https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes", "type": "docs" }
            ]
          },
          {
            "title": "The Link component and useRouter for client-side navigation",
            "description": "<Link href='/about'> prefetches the route in the background and navigates without a full page reload. useRouter() from 'next/navigation' (not 'next/router') provides push, replace, and back in App Router.",
            "resources": [
              { "label": "Next.js Docs — Link", "url": "https://nextjs.org/docs/app/api-reference/components/link", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Metadata, error boundaries, and loading states",
        "children": [
          {
            "title": "Generating SEO metadata with the Metadata API",
            "description": "Export a metadata object or generateMetadata function from any layout.tsx or page.tsx to set title, description, and Open Graph tags. Dynamic metadata can fetch data server-side.",
            "resources": [
              { "label": "Next.js Docs — Metadata", "url": "https://nextjs.org/docs/app/building-your-application/optimizing/metadata", "type": "docs" }
            ]
          },
          {
            "title": "error.tsx and not-found.tsx for route-level error handling",
            "description": "error.tsx must be a client component ('use client') and receives error and reset props. not-found.tsx renders when notFound() is called from a server component. Both scope their UI to the nearest route segment.",
            "resources": [
              { "label": "Next.js Docs — Error Handling", "url": "https://nextjs.org/docs/app/building-your-application/routing/error-handling", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-4",
    "sideLeft": [
      {
        "title": "How Tailwind's utility-first model works",
        "children": [
          {
            "title": "Tailwind purges unused classes at build time via content scanning",
            "description": "Tailwind scans files listed in content: [] and removes any class not found in the source. This is why dynamically constructed class strings (bg-${color}-500) won't work — the scanner can't see them.",
            "resources": [
              { "label": "Tailwind Docs — Content Configuration", "url": "https://tailwindcss.com/docs/content-configuration", "type": "docs" }
            ]
          },
          {
            "title": "The cascade in Tailwind: last class wins within the same property",
            "description": "Tailwind classes are all single-purpose — each sets one CSS property. When two classes set the same property, the one that appears later in the stylesheet wins, which is determined by Tailwind's generated order, not your JSX order.",
            "resources": [
              { "label": "Tailwind Docs — Resolving Ambiguities", "url": "https://tailwindcss.com/docs/styling-with-utility-classes", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Design tokens and the theme system",
        "children": [
          {
            "title": "Customizing the theme: colors, spacing, and breakpoints",
            "description": "Extend the theme in tailwind.config.ts to add brand colors, custom spacing values, or additional breakpoints. Use extend: {} to add to the defaults rather than replace them entirely.",
            "resources": [
              { "label": "Tailwind Docs — Theme Configuration", "url": "https://tailwindcss.com/docs/theme", "type": "docs" }
            ]
          },
          {
            "title": "Dark mode with the class strategy and prefers-color-scheme",
            "description": "With darkMode: 'class', add dark: variants that only apply when a dark class is on the html element. Toggle it via JavaScript to implement a manual dark mode toggle independent of the OS setting.",
            "resources": [
              { "label": "Tailwind Docs — Dark Mode", "url": "https://tailwindcss.com/docs/dark-mode", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Tailwind layout and responsive design patterns",
        "children": [
          {
            "title": "Responsive breakpoints: mobile-first with sm, md, lg, xl prefixes",
            "description": "Tailwind is mobile-first — unprefixed classes apply at all sizes. sm:flex applies only at ≥640px. Build layouts for small screens first, then override with prefixed classes for larger viewports.",
            "resources": [
              { "label": "Tailwind Docs — Responsive Design", "url": "https://tailwindcss.com/docs/responsive-design", "type": "docs" }
            ]
          },
          {
            "title": "Flexbox and grid utilities: flex, grid, gap, col-span",
            "description": "flex + items-center + justify-between handles most one-dimensional layouts. grid grid-cols-3 gap-4 handles card grids. col-span-2 makes a cell span multiple columns.",
            "resources": [
              { "label": "Tailwind Docs — Flex", "url": "https://tailwindcss.com/docs/flex", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Reusable component patterns with Tailwind in T3",
        "children": [
          {
            "title": "Using clsx and tailwind-merge to compose conditional classes",
            "description": "clsx conditionally joins class strings. tailwind-merge (twMerge) deduplicates conflicting Tailwind classes — combine them in a cn() utility used throughout T3 and shadcn/ui projects.",
            "resources": [
              { "label": "tailwind-merge npm", "url": "https://www.npmjs.com/package/tailwind-merge", "type": "docs" }
            ]
          },
          {
            "title": "Applying variants with the group and peer modifiers",
            "description": "Add the group class to a parent, then use group-hover:text-white on children to style them on parent hover. peer lets adjacent siblings style each other — useful for checkbox-driven label styles.",
            "resources": [
              { "label": "Tailwind Docs — Hover, Focus, and Other States", "url": "https://tailwindcss.com/docs/hover-focus-and-other-states", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-5",
    "sideLeft": [
      {
        "title": "How tRPC eliminates the client-server type boundary",
        "children": [
          {
            "title": "tRPC's type inference: how server types flow to the client",
            "description": "tRPC exports the router's AppRouter type. The client imports it as a type-only import, so there's zero runtime cost. TypeScript infers input and output shapes from the router definition — no code generation needed.",
            "resources": [
              { "label": "tRPC Docs — Concepts", "url": "https://trpc.io/docs/concepts", "type": "docs" }
            ]
          },
          {
            "title": "Zod input schemas in tRPC procedures: parsing untrusted input",
            "description": "Every tRPC procedure with .input(schema) calls zod.parse() on the incoming data before your resolver runs. Invalid input throws a TRPCError with code BAD_REQUEST, which the client receives as a typed error.",
            "resources": [
              { "label": "tRPC Docs — Input and Output Validation", "url": "https://trpc.io/docs/server/validators", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "tRPC middleware and context for auth and request data",
        "children": [
          {
            "title": "Context: passing the session and database client to procedures",
            "description": "tRPC context is created per request (createContext) and injected into every procedure. Put the session and Prisma client in context so any procedure can access them without importing globals.",
            "resources": [
              { "label": "tRPC Docs — Context", "url": "https://trpc.io/docs/server/context", "type": "docs" }
            ]
          },
          {
            "title": "Protected procedures with tRPC middleware",
            "description": "A protectedProcedure wraps the base procedure with middleware that checks ctx.session and throws UNAUTHORIZED if missing. Composing protected procedures ensures auth is never forgotten on a mutation.",
            "resources": [
              { "label": "tRPC Docs — Middlewares", "url": "https://trpc.io/docs/server/middlewares", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Defining tRPC routers and procedures",
        "children": [
          {
            "title": "Queries versus mutations: when to use each in tRPC",
            "description": "Queries are for reading data (GET semantics); mutations are for writes (POST/PUT/DELETE semantics). TanStack Query treats them differently — queries are cached and refetched; mutations trigger manual invalidation.",
            "resources": [
              { "label": "tRPC Docs — Procedures", "url": "https://trpc.io/docs/server/procedures", "type": "docs" }
            ]
          },
          {
            "title": "Merging routers: splitting tRPC into feature-based sub-routers",
            "description": "Create separate routers for posts, users, comments and merge them into the root router. The client accesses them as trpc.posts.list.useQuery() — the nesting mirrors the router structure.",
            "resources": [
              { "label": "tRPC Docs — Routers", "url": "https://trpc.io/docs/server/routers", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Using tRPC on the client with TanStack Query",
        "children": [
          {
            "title": "useQuery and useMutation hooks generated by the tRPC client",
            "description": "trpc.post.list.useQuery() returns { data, isLoading, error } with full types. trpc.post.create.useMutation() returns { mutate, isPending }. These are thin wrappers around TanStack Query's hooks.",
            "resources": [
              { "label": "tRPC Docs — React Query Integration", "url": "https://trpc.io/docs/client/react", "type": "docs" }
            ]
          },
          {
            "title": "Cache invalidation after mutations with utils.invalidate()",
            "description": "After a mutation, call utils.post.list.invalidate() inside onSuccess to mark that query stale and trigger a background refetch. This keeps the UI consistent without a page reload.",
            "resources": [
              { "label": "tRPC Docs — Invalidation", "url": "https://trpc.io/docs/client/react/useUtils", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-6",
    "sideLeft": [
      {
        "title": "Prisma's schema-first approach and type generation",
        "children": [
          {
            "title": "How Prisma generates a typed client from schema.prisma",
            "description": "Running prisma generate reads schema.prisma and emits TypeScript types for every model, field, and relation. The client's methods are fully typed — autocomplete knows your field names and their types.",
            "resources": [
              { "label": "Prisma Docs — Prisma Client", "url": "https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client", "type": "docs" }
            ]
          },
          {
            "title": "Prisma relations: one-to-many and many-to-many in the schema",
            "description": "A one-to-many relation adds a foreign key field and a relation field on both models. Many-to-many uses an implicit join table (Prisma manages it) or explicit when the join table has extra fields.",
            "resources": [
              { "label": "Prisma Docs — Relations", "url": "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Prisma migrations and the development workflow",
        "children": [
          {
            "title": "prisma migrate dev: generating, naming, and applying migrations",
            "description": "prisma migrate dev computes the diff between your schema and the database, writes a migration SQL file, applies it, and regenerates the client. Each migration file is committed to source control.",
            "resources": [
              { "label": "Prisma Docs — Develop with Prisma Migrate", "url": "https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production", "type": "docs" }
            ]
          },
          {
            "title": "N+1 query problem and how to fix it with Prisma's include",
            "description": "Fetching a list of posts and then querying each post's author separately causes N+1 database queries. Prisma's include: { author: true } fetches all authors in a single JOIN query.",
            "resources": [
              { "label": "Prisma Docs — Select Fields", "url": "https://www.prisma.io/docs/orm/prisma-client/queries/select-fields", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Prisma CRUD operations in tRPC procedures",
        "children": [
          {
            "title": "findMany with where, orderBy, take, and skip for pagination",
            "description": "prisma.post.findMany({ where: { authorId }, orderBy: { createdAt: 'desc' }, take: 10, skip: page * 10 }) is the standard pagination pattern. Cursor-based pagination scales better for large tables.",
            "resources": [
              { "label": "Prisma Docs — Pagination", "url": "https://www.prisma.io/docs/orm/prisma-client/queries/pagination", "type": "docs" }
            ]
          },
          {
            "title": "Prisma transactions for multi-step atomic writes",
            "description": "prisma.$transaction([op1, op2]) runs both operations atomically. If either fails, both roll back. Use interactive transactions for conditional logic inside the transaction block.",
            "resources": [
              { "label": "Prisma Docs — Transactions", "url": "https://www.prisma.io/docs/orm/prisma-client/queries/transactions", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Prisma Studio and seeding for development",
        "children": [
          {
            "title": "Prisma Studio: browsing and editing data visually",
            "description": "npx prisma studio opens a web UI to browse tables, filter rows, and edit records. It's invaluable during development for inspecting the database state without writing SQL.",
            "resources": [
              { "label": "Prisma Docs — Prisma Studio", "url": "https://www.prisma.io/docs/orm/tools/prisma-studio", "type": "docs" }
            ]
          },
          {
            "title": "Writing an idempotent seed script with upsert",
            "description": "Use prisma.user.upsert({ where: { email }, update: {}, create: {...} }) in seed scripts so they can be run repeatedly without creating duplicate records. Register the script in package.json prisma.seed.",
            "resources": [
              { "label": "Prisma Docs — Seeding", "url": "https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-7",
    "sideLeft": [
      {
        "title": "OAuth flow and session management in NextAuth",
        "children": [
          {
            "title": "How OAuth 2.0 authorization code flow works with a provider",
            "description": "The user clicks login, gets redirected to the provider (GitHub/Google), grants permission, and the provider redirects back with an auth code. NextAuth exchanges the code for tokens server-side, hiding them from the browser.",
            "resources": [
              { "label": "NextAuth.js Docs — Concepts", "url": "https://next-auth.js.org/getting-started/introduction", "type": "docs" }
            ]
          },
          {
            "title": "JWT strategy versus database sessions: trade-offs",
            "description": "JWT sessions are stateless and don't need a sessions table — but you can't instantly revoke them. Database sessions are revocable immediately but add a DB query per request. T3 defaults to JWT with the Prisma adapter for OAuth tokens.",
            "resources": [
              { "label": "NextAuth.js Docs — Session Strategy", "url": "https://next-auth.js.org/configuration/options#session", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Protecting tRPC procedures and Next.js routes",
        "children": [
          {
            "title": "Reading the session in server components with getServerSession",
            "description": "getServerSession(authOptions) returns the session in a server component or API route without an HTTP round-trip. Use it in tRPC context creation and in server component layouts that need the user.",
            "resources": [
              { "label": "NextAuth.js Docs — Server Side", "url": "https://next-auth.js.org/configuration/nextjs#in-app-router", "type": "docs" }
            ]
          },
          {
            "title": "Role-based authorization in protected tRPC procedures",
            "description": "Extend the session type to include a role field via module augmentation in next-auth.d.ts. In protectedProcedure middleware, check ctx.session.user.role and throw FORBIDDEN for unauthorized roles.",
            "resources": [
              { "label": "NextAuth.js Docs — TypeScript", "url": "https://next-auth.js.org/getting-started/typescript", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Configuring NextAuth in a T3 app",
        "children": [
          {
            "title": "Setting up the Prisma adapter for user and session storage",
            "description": "The Prisma adapter creates Account, Session, User, and VerificationToken tables from the schema. Add the models from the NextAuth Prisma schema docs and run a migration to provision them.",
            "resources": [
              { "label": "NextAuth.js Docs — Prisma Adapter", "url": "https://authjs.dev/reference/adapter/prisma", "type": "docs" }
            ]
          },
          {
            "title": "Configuring GitHub and Google OAuth providers",
            "description": "Register an OAuth app in GitHub/Google to get a client ID and secret. Pass them to the providers array in authOptions. Store them as environment variables — never hard-code credentials.",
            "resources": [
              { "label": "NextAuth.js Docs — Providers", "url": "https://next-auth.js.org/providers/github", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Client-side session access and sign-in/out",
        "children": [
          {
            "title": "useSession hook for accessing session in client components",
            "description": "useSession() returns { data: session, status: 'loading' | 'authenticated' | 'unauthenticated' }. Wrap the app in SessionProvider to make useSession available to all client components.",
            "resources": [
              { "label": "NextAuth.js Docs — useSession", "url": "https://next-auth.js.org/getting-started/client#usesession", "type": "docs" }
            ]
          },
          {
            "title": "signIn and signOut functions and redirect behaviour",
            "description": "signIn('github', { callbackUrl: '/dashboard' }) initiates OAuth and redirects to /dashboard on success. signOut({ callbackUrl: '/' }) clears the session cookie and redirects to the homepage.",
            "resources": [
              { "label": "NextAuth.js Docs — signIn", "url": "https://next-auth.js.org/getting-started/client#signin", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-8",
    "sideLeft": [
      {
        "title": "TanStack Query's cache model and server state semantics",
        "children": [
          {
            "title": "staleTime, gcTime, and the background refetch lifecycle",
            "description": "staleTime determines how long a query result is fresh — during this window, no refetch happens. After staleTime, the cached data is served instantly while a background refetch runs. gcTime controls when unused cache entries are garbage-collected.",
            "resources": [
              { "label": "TanStack Query Docs — Important Defaults", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults", "type": "docs" }
            ]
          },
          {
            "title": "Query invalidation versus refetch: when to use each",
            "description": "invalidateQueries marks a query stale and triggers a background refetch if the query has active observers. refetchQueries forces an immediate refetch. Prefer invalidation after mutations — it's more surgical.",
            "resources": [
              { "label": "TanStack Query Docs — Invalidation", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Optimistic updates and rollback on error",
        "children": [
          {
            "title": "Optimistic updates: apply immediately, rollback on mutation failure",
            "description": "In onMutate, cancel in-flight queries, snapshot the current cache, and apply the optimistic change. In onError, restore the snapshot. In onSettled, invalidate to sync with the server's truth.",
            "resources": [
              { "label": "TanStack Query Docs — Optimistic Updates", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Advanced TanStack Query patterns in T3",
        "children": [
          {
            "title": "Infinite queries for cursor-based pagination with fetchNextPage",
            "description": "useInfiniteQuery provides fetchNextPage, hasNextPage, and isFetchingNextPage. The getNextPageParam function extracts the cursor from the last page. Intersect an invisible div with IntersectionObserver to trigger load-more.",
            "resources": [
              { "label": "TanStack Query Docs — Infinite Queries", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries", "type": "docs" }
            ]
          },
          {
            "title": "Prefetching data in server components for instant client hydration",
            "description": "Call queryClient.prefetchQuery in a server component and dehydrate the cache with dehydrate(queryClient). Pass it to HydrationBoundary on the client so the initial render has data without a loading state.",
            "resources": [
              { "label": "TanStack Query Docs — Server Rendering", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Global state versus server state in T3",
        "children": [
          {
            "title": "When to use Zustand for client-only global state",
            "description": "Use TanStack Query for anything from the server. Use Zustand for UI state that doesn't come from an API: modal open/closed, theme, sidebar expanded. Mixing them for server data leads to stale data bugs.",
            "resources": [
              { "label": "Zustand Docs", "url": "https://docs.pmnd.rs/zustand/getting-started/introduction", "type": "docs" }
            ]
          },
          {
            "title": "Mutation lifecycle callbacks: onMutate, onError, onSuccess, onSettled",
            "description": "TanStack Query mutations provide four lifecycle callbacks. onMutate runs before the request for optimistic updates. onError receives the error and rollback context. onSettled always runs — use it for final invalidation.",
            "resources": [
              { "label": "TanStack Query Docs — Mutations", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/mutations", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-9",
    "sideLeft": [
      {
        "title": "Shared Zod schemas across client and server",
        "children": [
          {
            "title": "Why sharing schemas eliminates client-server validation drift",
            "description": "Define one Zod schema and import it in both the tRPC procedure (server validation) and the React Hook Form resolver (client validation). Any constraint change propagates to both sides automatically.",
            "resources": [
              { "label": "Zod Docs — Basic Usage", "url": "https://zod.dev/", "type": "docs" }
            ]
          },
          {
            "title": "Zod's refinement and transform methods for complex validation",
            "description": "z.string().refine(val => isValidSlug(val), { message: 'Invalid slug' }) adds custom validators. z.string().transform(s => s.trim()) normalizes data during parsing. Both can be composed.",
            "resources": [
              { "label": "Zod Docs — Refinements", "url": "https://zod.dev/#refine", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "React Hook Form architecture: uncontrolled inputs with a single re-render",
        "children": [
          {
            "title": "Why RHF uses refs instead of state to avoid per-keystroke re-renders",
            "description": "React Hook Form stores input values in refs (not state), so typing doesn't trigger re-renders. The component only re-renders on submit or when watch() is used. This is significantly faster than controlled inputs for large forms.",
            "resources": [
              { "label": "React Hook Form Docs — Performance", "url": "https://react-hook-form.com/advanced-usage#FormProviderPerformance", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Wiring React Hook Form with Zod and tRPC",
        "children": [
          {
            "title": "zodResolver: connecting a Zod schema to useForm",
            "description": "Pass zodResolver(schema) as the resolver option to useForm. RHF will call schema.safeParse() on submit and populate errors from Zod's error map — no manual validation logic needed.",
            "resources": [
              { "label": "React Hook Form Docs — Resolvers", "url": "https://react-hook-form.com/get-started#SchemaValidation", "type": "docs" }
            ]
          },
          {
            "title": "register, handleSubmit, and formState.errors in practice",
            "description": "register('email') returns ref, onChange, onBlur, and name to spread on an input. handleSubmit(onSubmit) validates on submit and calls onSubmit with typed data. formState.errors contains Zod's error messages.",
            "resources": [
              { "label": "React Hook Form Docs — API", "url": "https://react-hook-form.com/docs/useform", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Accessible form UI and user feedback patterns",
        "children": [
          {
            "title": "Associating error messages with inputs for screen readers",
            "description": "Use aria-describedby on the input pointing to the error message's id. This ensures screen readers announce the error when the input receives focus, making form validation accessible.",
            "resources": [
              { "label": "MDN — aria-describedby", "url": "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby", "type": "docs" }
            ]
          },
          {
            "title": "Optimistic toast notifications with react-hot-toast",
            "description": "Show a loading toast when a mutation starts and replace it with success/error on settlement. toast.promise(mutateAsync(data), { loading, success, error }) handles all three states in one call.",
            "resources": [
              { "label": "react-hot-toast Docs", "url": "https://react-hot-toast.com/docs", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "t3-10",
    "sideLeft": [
      {
        "title": "Testing strategy for a T3 application",
        "children": [
          {
            "title": "Unit testing tRPC procedures with the caller API",
            "description": "tRPC exposes a createCaller API that lets you call procedures directly in tests without HTTP. Pass a mock context with a fake session and Prisma client to test procedure logic in isolation.",
            "resources": [
              { "label": "tRPC Docs — Server Side Calls", "url": "https://trpc.io/docs/server/server-side-calls", "type": "docs" }
            ]
          },
          {
            "title": "End-to-end testing with Playwright: browser automation concepts",
            "description": "Playwright controls a real browser and can test the full stack. It supports multiple browsers, auto-waits for elements, and captures traces on failure. Write E2E tests for critical user flows only — they're slow.",
            "resources": [
              { "label": "Playwright Docs — Getting Started", "url": "https://playwright.dev/docs/intro", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Production deployment concepts for Next.js on Vercel",
        "children": [
          {
            "title": "Vercel's build output: static, SSR, and Edge runtime",
            "description": "Vercel deploys statically generated pages to a CDN, SSR pages to serverless functions, and Edge runtime code to edge nodes. Understanding this guides caching decisions and cold start trade-offs.",
            "resources": [
              { "label": "Vercel Docs — Deployment", "url": "https://vercel.com/docs/deployments/overview", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing and running tests for a T3 project",
        "children": [
          {
            "title": "Vitest configuration for a Next.js project with path aliases",
            "description": "Configure vitest.config.ts with the alias entries from tsconfig paths. Use @vitejs/plugin-react for JSX support. Set environment: 'jsdom' for component tests that need the DOM.",
            "resources": [
              { "label": "Vitest Docs — Configuration", "url": "https://vitest.dev/config/", "type": "docs" }
            ]
          },
          {
            "title": "Testing React components with Testing Library and mock server",
            "description": "Use @testing-library/react to render components with createTRPCReact mocked via msw or a tRPC mock. Query by role, interact with userEvent, and assert on visible text rather than implementation details.",
            "resources": [
              { "label": "Testing Library Docs", "url": "https://testing-library.com/docs/react-testing-library/intro/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Deploying T3 to Vercel with a production database",
        "children": [
          {
            "title": "Environment variables in Vercel: build-time versus runtime",
            "description": "NEXT_PUBLIC_* variables are inlined at build time into the client bundle. Server-only variables (DATABASE_URL, NEXTAUTH_SECRET) are injected at runtime. Never expose server secrets with the NEXT_PUBLIC_ prefix.",
            "resources": [
              { "label": "Vercel Docs — Environment Variables", "url": "https://vercel.com/docs/projects/environment-variables", "type": "docs" }
            ]
          },
          {
            "title": "Running prisma migrate deploy in the Vercel build step",
            "description": "Add prisma migrate deploy to the Vercel build command before next build. This applies any pending migrations to the production database before the new code goes live.",
            "resources": [
              { "label": "Prisma Docs — Deploy with Vercel", "url": "https://www.prisma.io/docs/orm/more/deployment/deployment-guides/deploying-to-vercel", "type": "docs" }
            ]
          }
        ]
      }
    ]
  }
];

let applied = 0;
Object.keys(data).forEach(track => {
  data[track].forEach(layer => {
    const patch = patches.find(p => p.id === layer.id);
    if (patch) {
      layer.sideLeft = patch.sideLeft;
      layer.sideRight = patch.sideRight;
      applied++;
    }
  });
});

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches`);
