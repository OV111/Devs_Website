const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/data/roadmaps/fullstack.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const patches = [
  {
    "id": "pern-4",
    "sideLeft": [
      {
        "title": "How React Router v6 renders nested route trees",
        "children": [
          {
            "title": "Nested routes and the Outlet component for shared layouts",
            "description": "React Router v6 uses an <Outlet> placeholder inside a parent route's component to render the matched child route. This replaces the old switch-based approach and makes layout composition purely declarative.",
            "resources": [
              { "label": "React Router Docs — Outlet", "url": "https://reactrouter.com/en/main/components/outlet", "type": "docs" }
            ]
          },
          {
            "title": "TanStack Query cache model: staleTime, cacheTime, and invalidation",
            "description": "staleTime controls how long a query result is considered fresh before a background refetch. Calling queryClient.invalidateQueries() marks matching queries stale and triggers an immediate background fetch.",
            "resources": [
              { "label": "TanStack Query Docs — Caching", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/caching", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Zustand's subscription model versus React Context",
        "children": [
          {
            "title": "How Zustand avoids Context's re-render problem with selectors",
            "description": "Zustand components only re-render when the specific slice they select changes. Unlike Context where any value change re-renders every consumer, Zustand's selector pattern is surgical.",
            "resources": [
              { "label": "Zustand Docs — Getting Started", "url": "https://docs.pmnd.rs/zustand/getting-started/introduction", "type": "docs" }
            ]
          },
          {
            "title": "useMemo and useCallback: when memoization helps versus hurts",
            "description": "Memoization prevents recalculations and unnecessary child re-renders but adds comparison overhead. Only apply it when a React Profiler shows a measurable regression — premature memoization obscures code.",
            "resources": [
              { "label": "React Docs — useMemo", "url": "https://react.dev/reference/react/useMemo", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "React Router navigation APIs and protected routes",
        "children": [
          {
            "title": "useNavigate, useParams, and useSearchParams",
            "description": "useNavigate replaces the history object for programmatic navigation. useParams reads dynamic URL segments; useSearchParams reads and sets query strings. Both are typed with TypeScript generics in PERN.",
            "resources": [
              { "label": "React Router Docs — useNavigate", "url": "https://reactrouter.com/en/main/hooks/use-navigate", "type": "docs" }
            ]
          },
          {
            "title": "Building protected routes with an auth-checking wrapper",
            "description": "Wrap protected routes in a component that reads auth state and redirects unauthenticated users with <Navigate to='/login'>. Combine with Zustand or Context for a clean, reusable pattern.",
            "resources": [
              { "label": "React Router Docs — Auth Example", "url": "https://reactrouter.com/en/main/start/examples", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Custom hooks and code splitting",
        "children": [
          {
            "title": "Extracting shared logic into custom hooks",
            "description": "A custom hook is a function whose name starts with 'use' and that calls other hooks. Hooks like useFetch, useForm, or usePagination let you share stateful logic across pages without prop drilling.",
            "resources": [
              { "label": "React Docs — Reusing Logic with Custom Hooks", "url": "https://react.dev/learn/reusing-logic-with-custom-hooks", "type": "docs" }
            ]
          },
          {
            "title": "React.lazy and Suspense for route-level code splitting",
            "description": "Wrapping a dynamic import in React.lazy() defers loading that chunk until the route is visited. Suspense shows a fallback while the chunk loads, keeping initial bundle size small.",
            "resources": [
              { "label": "React Docs — lazy", "url": "https://react.dev/reference/react/lazy", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-5",
    "sideLeft": [
      {
        "title": "The Node.js event loop and non-blocking I/O model",
        "children": [
          {
            "title": "How libuv delegates I/O so Node can handle concurrent connections",
            "description": "Node offloads file system and network I/O to libuv's thread pool. The event loop picks up callbacks when they complete, letting a single thread serve thousands of concurrent HTTP connections.",
            "resources": [
              { "label": "Node.js Docs — The Node.js Event Loop", "url": "https://nodejs.org/en/guides/event-loop-timers-and-nexttick", "type": "docs" }
            ]
          },
          {
            "title": "Express middleware chain: how next() passes control",
            "description": "Every Express handler receives (req, res, next). Calling next() passes control to the next middleware in the stack; calling next(err) jumps to error-handling middleware. Middleware order is execution order.",
            "resources": [
              { "label": "Express Docs — Using Middleware", "url": "https://expressjs.com/en/guide/using-middleware.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "RESTful API design principles",
        "children": [
          {
            "title": "Resource-based URLs and correct HTTP verb semantics",
            "description": "REST URLs name resources (/posts/42), not actions (/getPost). GET reads, POST creates, PATCH partially updates, PUT replaces, DELETE removes. Correct verbs let clients predict behaviour and enable caching.",
            "resources": [
              { "label": "MDN — HTTP Methods", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", "type": "docs" }
            ]
          },
          {
            "title": "HTTP status codes: 2xx success, 4xx client error, 5xx server error",
            "description": "201 Created on POST success, 204 No Content on DELETE, 400 Bad Request for invalid input, 401 Unauthorized vs 403 Forbidden, 422 Unprocessable Entity for validation failures. Correct codes make APIs self-documenting.",
            "resources": [
              { "label": "MDN — HTTP Response Status Codes", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Structuring an Express application for a PERN project",
        "children": [
          {
            "title": "Router modules and controller separation by resource",
            "description": "express.Router() creates a mini-app. Mount separate routers for /users, /posts, /auth under their respective prefixes. Keep route files thin — delegate logic to controller functions.",
            "resources": [
              { "label": "Express Docs — Router", "url": "https://expressjs.com/en/4x/api.html#router", "type": "docs" }
            ]
          },
          {
            "title": "Environment configuration with dotenv and config validation",
            "description": "Load env vars with dotenv.config() before anything else. Validate required variables at startup with a schema (envalid or Zod) so the app fails fast with a clear error instead of crashing at runtime.",
            "resources": [
              { "label": "dotenv npm", "url": "https://www.npmjs.com/package/dotenv", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Input validation and centralized error handling",
        "children": [
          {
            "title": "Request body validation with express-validator",
            "description": "Chain validators on route definitions: body('email').isEmail(), body('age').isInt({min:0}). Call validationResult(req) at the top of the handler and return 422 if there are errors.",
            "resources": [
              { "label": "express-validator Docs", "url": "https://express-validator.github.io/docs/", "type": "docs" }
            ]
          },
          {
            "title": "Four-argument error middleware registered last in app.use()",
            "description": "Error middleware has signature (err, req, res, next). Register it after all routes. Call next(err) from anywhere in the chain to skip to it and return a consistent JSON error shape.",
            "resources": [
              { "label": "Express Docs — Error Handling", "url": "https://expressjs.com/en/guide/error-handling.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-6",
    "sideLeft": [
      {
        "title": "How relational databases model data",
        "children": [
          {
            "title": "Normalization: eliminating redundancy across 1NF, 2NF, 3NF",
            "description": "Normalization splits data into tables to eliminate redundancy. 1NF: atomic values; 2NF: no partial dependencies; 3NF: no transitive dependencies. Over-normalizing hurts read performance; under-normalizing hurts consistency.",
            "resources": [
              { "label": "PostgreSQL Tutorial — Normalization", "url": "https://www.postgresqltutorial.com/postgresql-tutorial/database-normalization/", "type": "article" }
            ]
          },
          {
            "title": "Primary keys, foreign keys, and referential integrity",
            "description": "Primary keys uniquely identify rows. Foreign keys enforce referential integrity — a foreign key value must exist in the referenced table or be NULL. Violating this raises a constraint error, not a silent bug.",
            "resources": [
              { "label": "PostgreSQL Docs — Constraints", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "SQL query execution model",
        "children": [
          {
            "title": "How the query planner executes JOIN operations",
            "description": "INNER JOIN returns only rows that match in both tables; LEFT JOIN returns all left rows with NULLs for unmatched right rows. The planner chooses hash join, merge join, or nested loop based on table sizes and indexes.",
            "resources": [
              { "label": "PostgreSQL Docs — Joins", "url": "https://www.postgresql.org/docs/current/tutorial-join.html", "type": "docs" }
            ]
          },
          {
            "title": "GROUP BY with aggregate functions: COUNT, SUM, AVG",
            "description": "GROUP BY collapses rows with the same value into one group. Aggregate functions then compute a value per group. HAVING filters groups after aggregation, unlike WHERE which filters before.",
            "resources": [
              { "label": "SQLBolt — Lesson 10: Aggregates", "url": "https://sqlbolt.com/lesson/select_queries_with_aggregates", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing SQL queries from scratch",
        "children": [
          {
            "title": "SELECT, WHERE, ORDER BY, LIMIT: the core query structure",
            "description": "Every SQL query starts with SELECT columns FROM table. Add WHERE to filter rows, ORDER BY to sort, and LIMIT/OFFSET for pagination. Logical order differs from execution order — WHERE runs before SELECT.",
            "resources": [
              { "label": "SQLBolt — Interactive SQL Tutorial", "url": "https://sqlbolt.com/", "type": "course" }
            ]
          },
          {
            "title": "INSERT, UPDATE, DELETE with WHERE clauses",
            "description": "Always include a WHERE clause in UPDATE and DELETE. An UPDATE without WHERE updates every row; a DELETE without WHERE empties the table. Wrap destructive operations in a transaction.",
            "resources": [
              { "label": "PostgreSQL Tutorial — CRUD", "url": "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Designing the blog schema for the PERN challenge",
        "children": [
          {
            "title": "Junction tables for many-to-many: posts_tags example",
            "description": "A post can have many tags; a tag can belong to many posts. Model this with a posts_tags junction table with foreign keys to both sides. Never store comma-separated IDs in a column.",
            "resources": [
              { "label": "PostgreSQL Docs — DDL", "url": "https://www.postgresql.org/docs/current/ddl.html", "type": "docs" }
            ]
          },
          {
            "title": "psql CLI basics: connecting, listing tables, and running queries",
            "description": "\\l lists databases, \\c dbname connects, \\dt lists tables, \\d tablename shows schema. Use psql for quick inspection and ad-hoc queries without a GUI client.",
            "resources": [
              { "label": "PostgreSQL Docs — psql", "url": "https://www.postgresql.org/docs/current/app-psql.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-7",
    "sideLeft": [
      {
        "title": "PostgreSQL internals: indexes and the query planner",
        "children": [
          {
            "title": "How B-tree indexes speed up equality and range queries",
            "description": "A B-tree index stores column values in a balanced tree, enabling O(log n) lookups instead of full table scans. Partial indexes (WHERE active = true) are smaller and faster for filtered queries.",
            "resources": [
              { "label": "PostgreSQL Docs — Indexes", "url": "https://www.postgresql.org/docs/current/indexes.html", "type": "docs" }
            ]
          },
          {
            "title": "EXPLAIN ANALYZE: reading cost estimates and actual timings",
            "description": "EXPLAIN shows the query plan with estimated costs; EXPLAIN ANALYZE executes the query and shows actual row counts and timings. Seq Scan on a large table is the signal to add an index.",
            "resources": [
              { "label": "PostgreSQL Docs — EXPLAIN", "url": "https://www.postgresql.org/docs/current/sql-explain.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "ACID transactions and isolation levels",
        "children": [
          {
            "title": "ACID properties: why atomicity and isolation matter for data integrity",
            "description": "Atomicity guarantees all or nothing; if one statement in a transaction fails, all changes roll back. Isolation levels control how concurrent transactions see each other's uncommitted changes.",
            "resources": [
              { "label": "PostgreSQL Docs — Transactions", "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html", "type": "docs" }
            ]
          },
          {
            "title": "JSONB columns for flexible semi-structured data",
            "description": "JSONB stores JSON as binary, allowing GIN-indexed queries on nested fields. Use it for metadata or user-defined attributes rather than adding columns to a rigid schema.",
            "resources": [
              { "label": "PostgreSQL Docs — JSON Types", "url": "https://www.postgresql.org/docs/current/datatype-json.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "PostgreSQL administration with psql",
        "children": [
          {
            "title": "Creating roles, databases, and granting privileges",
            "description": "CREATE ROLE appuser WITH LOGIN PASSWORD '...'; GRANT CONNECT ON DATABASE mydb TO appuser; GRANT USAGE ON SCHEMA public TO appuser. Least-privilege roles prevent an app bug from dropping tables.",
            "resources": [
              { "label": "PostgreSQL Docs — User Management", "url": "https://www.postgresql.org/docs/current/user-manag.html", "type": "docs" }
            ]
          },
          {
            "title": "Views and CTEs for reusable query logic",
            "description": "A VIEW stores a named query you can SELECT from like a table. A CTE (WITH clause) is a named subquery scoped to one statement. Both avoid duplicating complex joins across application code.",
            "resources": [
              { "label": "PostgreSQL Docs — Views", "url": "https://www.postgresql.org/docs/current/tutorial-views.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Window functions and query tuning",
        "children": [
          {
            "title": "Window functions: ROW_NUMBER, RANK, and LAG over partitions",
            "description": "Window functions compute values across a set of rows related to the current row without collapsing them into a group. ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) assigns a rank per user.",
            "resources": [
              { "label": "PostgreSQL Docs — Window Functions", "url": "https://www.postgresql.org/docs/current/tutorial-window.html", "type": "docs" }
            ]
          },
          {
            "title": "Index selection: composite versus partial indexes",
            "description": "Composite indexes (col_a, col_b) satisfy queries that filter on col_a alone or both columns, but not col_b alone. Partial indexes only index rows matching a condition, making them smaller and faster.",
            "resources": [
              { "label": "PostgreSQL Docs — Multicolumn Indexes", "url": "https://www.postgresql.org/docs/current/indexes-multicolumn.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-8",
    "sideLeft": [
      {
        "title": "How Prisma generates type-safe queries from your schema",
        "children": [
          {
            "title": "Prisma schema as the single source of truth for types and migrations",
            "description": "Prisma reads the schema.prisma file to generate both the TypeScript client and migration SQL. Changing a field in the schema generates a migration diff — you never write ALTER TABLE manually.",
            "resources": [
              { "label": "Prisma Docs — Schema", "url": "https://www.prisma.io/docs/orm/prisma-schema/overview", "type": "docs" }
            ]
          },
          {
            "title": "Connection pooling with node-postgres and why it matters",
            "description": "Creating a new PostgreSQL connection per request takes ~50ms and limits concurrency. A pool reuses connections. The pg Pool class manages min/max pool size and queues queries when all connections are in use.",
            "resources": [
              { "label": "node-postgres Docs — Pooling", "url": "https://node-postgres.com/features/pooling", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "SQL injection and parameterized queries",
        "children": [
          {
            "title": "Why string interpolation in SQL is a critical security vulnerability",
            "description": "Concatenating user input into a SQL string allows attackers to inject arbitrary SQL. Parameterized queries ($1, $2 in pg; Prisma's typed methods) send values separately from the query structure, preventing injection.",
            "resources": [
              { "label": "OWASP — SQL Injection Prevention", "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html", "type": "article" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Using Prisma in a Node/Express project",
        "children": [
          {
            "title": "Prisma CRUD: findMany, create, update, delete with filters",
            "description": "prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }) is fully typed. Prisma autocompletes field names and operators based on your schema.",
            "resources": [
              { "label": "Prisma Docs — CRUD", "url": "https://www.prisma.io/docs/orm/prisma-client/queries/crud", "type": "docs" }
            ]
          },
          {
            "title": "Nested writes: creating related records in one operation",
            "description": "Prisma nested writes let you create a post and its tags in a single call with prisma.post.create({ data: { tags: { create: [...] } } }). This runs as a transaction automatically.",
            "resources": [
              { "label": "Prisma Docs — Nested Writes", "url": "https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Migrations and seeding in a PERN project",
        "children": [
          {
            "title": "prisma migrate dev versus prisma migrate deploy",
            "description": "migrate dev generates and applies a migration locally; it also regenerates the Prisma client. migrate deploy applies pending migrations in production without generating new ones — use it in CI/CD pipelines.",
            "resources": [
              { "label": "Prisma Docs — Migrations", "url": "https://www.prisma.io/docs/orm/prisma-migrate/getting-started", "type": "docs" }
            ]
          },
          {
            "title": "Seeding the database with prisma/seed.ts",
            "description": "Add a seed script at prisma/seed.ts and register it in package.json prisma.seed field. Run prisma db seed to populate development data. Use upsert in seed scripts to keep them idempotent.",
            "resources": [
              { "label": "Prisma Docs — Seeding", "url": "https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-9",
    "sideLeft": [
      {
        "title": "Password hashing and JWT security internals",
        "children": [
          {
            "title": "bcrypt's adaptive work factor and per-password salting",
            "description": "bcrypt applies a salt to the password before hashing, meaning identical passwords produce different hashes. The work factor (cost) makes each hash computation intentionally slow, raising the cost of brute-force attacks.",
            "resources": [
              { "label": "OWASP — Password Storage Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "type": "article" }
            ]
          },
          {
            "title": "JWT structure: header.payload.signature and what to put in each",
            "description": "The signature is HMAC-SHA256(base64(header) + '.' + base64(payload), secret). The payload is not encrypted — anyone can decode it. Never store passwords, PII, or secrets in JWT payloads.",
            "resources": [
              { "label": "JWT.io — Introduction", "url": "https://jwt.io/introduction", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Web security: XSS, CSRF, and secure cookies",
        "children": [
          {
            "title": "HTTP-only cookies prevent XSS from stealing auth tokens",
            "description": "JavaScript cannot read HTTP-only cookies, so an XSS payload that injects a script cannot exfiltrate the auth token. Combine with Secure (HTTPS only) and SameSite=Strict for defense in depth.",
            "resources": [
              { "label": "OWASP — XSS Prevention Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", "type": "article" }
            ]
          },
          {
            "title": "Zod schema validation: parsing untrusted input at the boundary",
            "description": "Zod schemas define the expected shape and constraints. z.parse() throws on invalid input; z.safeParse() returns a result object. Define schemas once and share them between server validation and client forms.",
            "resources": [
              { "label": "Zod Docs", "url": "https://zod.dev/", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Implementing JWT auth in a PERN Express API",
        "children": [
          {
            "title": "Signing JWTs with jsonwebtoken and setting expiry",
            "description": "jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' }) creates a short-lived access token. Store the refresh token in an HTTP-only cookie and issue a new access token via a /refresh endpoint.",
            "resources": [
              { "label": "jsonwebtoken npm", "url": "https://www.npmjs.com/package/jsonwebtoken", "type": "docs" }
            ]
          },
          {
            "title": "Auth middleware: verify Bearer token and attach user to req",
            "description": "Read the Authorization header, strip 'Bearer ', call jwt.verify(), and attach the decoded payload to req.user. Apply this middleware to any router that requires authentication.",
            "resources": [
              { "label": "Express Docs — Writing Middleware", "url": "https://expressjs.com/en/guide/writing-middleware.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Security hardening with Zod, Helmet, and rate limiting",
        "children": [
          {
            "title": "helmet middleware for secure HTTP response headers",
            "description": "helmet sets Content-Security-Policy, X-Frame-Options, and other headers that defend against clickjacking, MIME sniffing, and XSS. Add it as the first middleware in your Express app.",
            "resources": [
              { "label": "Helmet.js Docs", "url": "https://helmetjs.github.io/", "type": "docs" }
            ]
          },
          {
            "title": "express-rate-limit to prevent brute-force on auth endpoints",
            "description": "Apply rate limiting specifically to /login and /register — not the whole API. Limit to 10 requests per 15 minutes per IP. Return 429 Too Many Requests with a Retry-After header.",
            "resources": [
              { "label": "express-rate-limit npm", "url": "https://www.npmjs.com/package/express-rate-limit", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-10",
    "sideLeft": [
      {
        "title": "Testing strategy for a full-stack PERN application",
        "children": [
          {
            "title": "Testing pyramid: unit tests fast, integration tests real, E2E minimal",
            "description": "Unit tests cover pure functions and isolated logic; integration tests hit the real database; E2E tests drive a real browser. Integration tests give the highest confidence per effort in a PERN app.",
            "resources": [
              { "label": "Vitest Docs — Getting Started", "url": "https://vitest.dev/guide/", "type": "docs" }
            ]
          },
          {
            "title": "Docker Compose for reproducible test environments",
            "description": "A docker-compose.yml with Node and PostgreSQL services makes the environment reproducible on any machine. Spin it up with docker compose up -d before running integration tests in CI.",
            "resources": [
              { "label": "Docker Docs — Compose", "url": "https://docs.docker.com/compose/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Container and CI/CD concepts",
        "children": [
          {
            "title": "Multi-stage Dockerfiles for lean Node production images",
            "description": "Use a build stage to install devDependencies and compile; copy only the dist folder and node_modules from a prod install into the final stage. This shrinks the image from GB to MB.",
            "resources": [
              { "label": "Docker Docs — Multi-Stage Builds", "url": "https://docs.docker.com/build/building/multi-stage/", "type": "docs" }
            ]
          },
          {
            "title": "GitHub Actions workflow: test, build, and deploy on merge",
            "description": "A workflow triggers on push to main, runs vitest, builds the Docker image, pushes to a registry, and deploys. Secrets are stored in repository settings and injected as environment variables.",
            "resources": [
              { "label": "GitHub Actions Docs — Workflow Syntax", "url": "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing tests for the PERN stack",
        "children": [
          {
            "title": "Vitest unit tests for utility functions and Zod schemas",
            "description": "Test pure helper functions (formatDate, paginateQuery) and Zod schema validation edge cases. These are fast, have no dependencies, and run in milliseconds.",
            "resources": [
              { "label": "Vitest Docs — Test API", "url": "https://vitest.dev/api/", "type": "docs" }
            ]
          },
          {
            "title": "Supertest integration tests for Express endpoints",
            "description": "Supertest binds your Express app to a random port and makes real HTTP requests in-process. Test the full request/response cycle including validation, auth middleware, and database writes.",
            "resources": [
              { "label": "Supertest GitHub", "url": "https://github.com/ladjs/supertest", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Deployment: React to Vercel, API to Railway, Postgres to managed host",
        "children": [
          {
            "title": "Vercel project settings, build output, and environment variables",
            "description": "Set the root directory to your frontend folder, output directory to dist (Vite) or build (CRA). Add environment variables in the Vercel dashboard — they're injected at build time for VITE_* prefixed vars.",
            "resources": [
              { "label": "Vercel Docs — Environment Variables", "url": "https://vercel.com/docs/projects/environment-variables", "type": "docs" }
            ]
          },
          {
            "title": "Running Prisma migrations in production deployments",
            "description": "Add a release command (Procfile or Railway start command) of prisma migrate deploy && node dist/index.js. This applies pending migrations before the new server version starts.",
            "resources": [
              { "label": "Prisma Docs — Deploy to Production", "url": "https://www.prisma.io/docs/orm/prisma-migrate/workflows/deploying-database-changes-with-prisma-migrate", "type": "docs" }
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
