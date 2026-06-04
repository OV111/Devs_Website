const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/data/roadmaps/fullstack.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const patches = [
  {
    "id": "fullstack-engineer-1",
    "sideLeft": [
      {
        "title": "How browsers parse and render pages",
        "children": [
          {
            "title": "DOM, CSSOM, and the critical rendering path",
            "description": "Browsers parse HTML into a DOM tree and CSS into a CSSOM tree, merge them into a render tree, then layout and paint. Render-blocking CSS and JS delay the first paint — understanding this drives performance decisions.",
            "resources": [
              { "label": "MDN — Critical Rendering Path", "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path", "type": "article" }
            ]
          },
          {
            "title": "Semantic HTML and the accessibility tree",
            "description": "Semantic elements like <nav>, <main>, and <button> map directly to ARIA roles used by assistive technologies. Choosing semantically correct elements is a prerequisite for accessible web applications.",
            "resources": [
              { "label": "MDN — HTML Elements Reference", "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "CSS layout: box model, flexbox, and grid",
        "children": [
          {
            "title": "The box model and box-sizing: border-box",
            "description": "Every element is a box with content, padding, border, and margin. border-box makes width include padding and border, eliminating the most common layout arithmetic bugs.",
            "resources": [
              { "label": "MDN — The Box Model", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model", "type": "article" }
            ]
          },
          {
            "title": "Flexbox for one-dimensional layouts, Grid for two-dimensional",
            "description": "Flexbox handles a row or column of items; Grid handles both axes simultaneously. Using Grid for page layout and Flexbox inside components is the standard combination.",
            "resources": [
              { "label": "CSS-Tricks — Complete Guide to Flexbox", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", "type": "article" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Responsive design and JavaScript DOM manipulation",
        "children": [
          {
            "title": "Mobile-first media queries with min-width breakpoints",
            "description": "Write base styles for small screens and layer on breakpoints upward with min-width. This produces leaner CSS than desktop-first overrides and aligns with how most users first encounter web apps.",
            "resources": [
              { "label": "MDN — Using Media Queries", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries", "type": "docs" }
            ]
          },
          {
            "title": "DOM manipulation: querySelector, classList, and events",
            "description": "querySelector selects elements; classList.toggle/add/remove drives state-based styling; addEventListener binds user interaction. These are the primitives every framework compiles down to.",
            "resources": [
              { "label": "javascript.info — Document", "url": "https://javascript.info/document", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Browser DevTools and the Fetch API",
        "children": [
          {
            "title": "Network tab: inspecting requests, responses, and status codes",
            "description": "The Network tab shows every HTTP request made by the page. Inspect status codes, headers, payloads, and timing to debug API calls and catch unexpected requests.",
            "resources": [
              { "label": "Chrome DevTools — Network", "url": "https://developer.chrome.com/docs/devtools/network/", "type": "docs" }
            ]
          },
          {
            "title": "fetch() with async/await and proper error handling",
            "description": "fetch() only rejects on network failure — you must check response.ok for 4xx/5xx errors. Always await response.json() separately and handle both network and HTTP errors explicitly.",
            "resources": [
              { "label": "MDN — Fetch API", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-2",
    "sideLeft": [
      {
        "title": "React's virtual DOM and component model",
        "children": [
          {
            "title": "How React diffs the virtual DOM to minimize real DOM mutations",
            "description": "React maintains a virtual DOM tree and reconciles it with the previous render on each state change, applying only the minimal real DOM mutations. This diffing is what makes React fast with frequent updates.",
            "resources": [
              { "label": "React Docs — Render and Commit", "url": "https://react.dev/learn/render-and-commit", "type": "docs" }
            ]
          },
          {
            "title": "Unidirectional data flow: props down, callbacks up",
            "description": "React data flows in one direction — parent to child via props, child to parent via callback functions. This makes state changes traceable and avoids the tangled two-way bindings of older frameworks.",
            "resources": [
              { "label": "React Docs — Thinking in React", "url": "https://react.dev/learn/thinking-in-react", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "useState, useEffect, and the hooks model",
        "children": [
          {
            "title": "Why state updates are asynchronous and batched in React 18",
            "description": "React 18 batches all state updates — even inside setTimeout and native event handlers. Calling setState doesn't update state until the next render, so reading state immediately after setting it gives the old value.",
            "resources": [
              { "label": "React Docs — useState", "url": "https://react.dev/reference/react/useState", "type": "docs" }
            ]
          },
          {
            "title": "useEffect cleanup prevents memory leaks from subscriptions and timers",
            "description": "Return a cleanup function from useEffect to cancel any subscriptions, timers, or in-flight fetches when the component unmounts or the effect re-runs. Omitting cleanup is the most common React memory leak.",
            "resources": [
              { "label": "React Docs — useEffect", "url": "https://react.dev/reference/react/useEffect", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Building components with Vite and React",
        "children": [
          {
            "title": "Vite dev server: HMR, fast cold starts, and the build output",
            "description": "Vite uses native ES modules in development for instant HMR without bundling. The production build uses Rollup. Understanding the distinction explains why import.meta.env vars work only at build time.",
            "resources": [
              { "label": "Vite Docs — Why Vite", "url": "https://vitejs.dev/guide/why.html", "type": "docs" }
            ]
          },
          {
            "title": "Client-side routing with React Router v6",
            "description": "React Router v6 uses nested route definitions and <Outlet> for layout composition. <Link> navigates without a page reload; useNavigate handles programmatic navigation from event handlers.",
            "resources": [
              { "label": "React Router Docs", "url": "https://reactrouter.com/en/main/start/tutorial", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Fetching data in components",
        "children": [
          {
            "title": "Data fetching pattern in useEffect with loading and error state",
            "description": "Fetch in useEffect, track loading/data/error in useState, and cancel the request on unmount with AbortController. This manual pattern is what React Query and SWR automate.",
            "resources": [
              { "label": "React Docs — You Might Not Need an Effect", "url": "https://react.dev/learn/you-might-not-need-an-effect", "type": "docs" }
            ]
          },
          {
            "title": "Lifting state to the nearest common ancestor",
            "description": "When two sibling components need shared data, lift the state to their lowest common parent. Pass the data down as props and the updater function as a callback prop.",
            "resources": [
              { "label": "React Docs — Sharing State Between Components", "url": "https://react.dev/learn/sharing-state-between-components", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-3",
    "sideLeft": [
      {
        "title": "Node.js runtime and the Express request cycle",
        "children": [
          {
            "title": "Node's event loop: non-blocking I/O on a single thread",
            "description": "Node delegates I/O to libuv's thread pool and processes callbacks in the event loop. This lets a single Node process serve thousands of concurrent HTTP connections without threads.",
            "resources": [
              { "label": "Node.js Docs — About Node.js", "url": "https://nodejs.org/en/about", "type": "docs" }
            ]
          },
          {
            "title": "Express middleware chain: execution order and next()",
            "description": "Express processes middleware in registration order. Each function receives (req, res, next) — calling next() passes control forward; calling next(err) jumps to error-handling middleware registered last.",
            "resources": [
              { "label": "Express Docs — Writing Middleware", "url": "https://expressjs.com/en/guide/writing-middleware.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "REST API design principles",
        "children": [
          {
            "title": "Resource-based URLs, HTTP verbs, and idempotency",
            "description": "REST URLs name resources (/recipes/42), not actions. GET is idempotent and safe; POST is neither; PUT is idempotent but not safe; DELETE is idempotent. Correct semantics enable caching and retry logic.",
            "resources": [
              { "label": "MDN — HTTP Methods", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", "type": "docs" }
            ]
          },
          {
            "title": "HTTP status codes: choosing the right code for each response",
            "description": "200 OK for reads, 201 Created for POST success, 204 No Content for DELETE, 400 for bad input, 401 for missing auth, 403 for forbidden, 404 for not found, 422 for validation failures.",
            "resources": [
              { "label": "MDN — HTTP Status Codes", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Structuring an Express API",
        "children": [
          {
            "title": "Router modules: separating routes by resource",
            "description": "express.Router() creates a mini-app with its own middleware. Mount separate routers for /recipes, /users, and /auth. Keep route files thin — delegate business logic to controller functions.",
            "resources": [
              { "label": "Express Docs — Routing", "url": "https://expressjs.com/en/guide/routing.html", "type": "docs" }
            ]
          },
          {
            "title": "Centralized error middleware with the four-argument signature",
            "description": "Register (err, req, res, next) middleware after all routes. Call next(err) from anywhere in the chain — route handlers, async wrappers, or other middleware — to reach it and return a consistent error shape.",
            "resources": [
              { "label": "Express Docs — Error Handling", "url": "https://expressjs.com/en/guide/error-handling.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Environment configuration and async error handling",
        "children": [
          {
            "title": "dotenv for environment variables with .env.example documentation",
            "description": "Load secrets with dotenv.config() before importing other modules. Commit .env.example with placeholder values so teammates know what variables are required without exposing real secrets.",
            "resources": [
              { "label": "dotenv npm", "url": "https://www.npmjs.com/package/dotenv", "type": "docs" }
            ]
          },
          {
            "title": "Wrapping async route handlers to catch rejected promises",
            "description": "Express doesn't catch async errors automatically. Wrap handlers in a catchAsync(fn) utility that calls next(err) on rejection, forwarding errors to the error middleware without try-catch in every handler.",
            "resources": [
              { "label": "Node.js Docs — Error Handling", "url": "https://nodejs.org/en/guides/error-handling", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-4",
    "sideLeft": [
      {
        "title": "Relational data modeling and normalization",
        "children": [
          {
            "title": "Normalization: splitting data to eliminate redundancy",
            "description": "1NF requires atomic column values. 2NF removes partial dependencies on composite keys. 3NF removes transitive dependencies. Over-normalizing hurts read performance; under-normalizing causes update anomalies.",
            "resources": [
              { "label": "PostgreSQL Tutorial — Normalization", "url": "https://www.postgresqltutorial.com/postgresql-tutorial/database-normalization/", "type": "article" }
            ]
          },
          {
            "title": "Primary keys, foreign keys, and referential integrity constraints",
            "description": "Foreign keys enforce that a referenced row exists. ON DELETE CASCADE automatically removes child rows when the parent is deleted. ON DELETE RESTRICT prevents deletion when children exist.",
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
            "title": "How JOIN operations combine rows from multiple tables",
            "description": "INNER JOIN returns only rows with matching values in both tables. LEFT JOIN keeps all left rows, filling NULLs for unmatched right rows. The query planner chooses the join algorithm based on table size and indexes.",
            "resources": [
              { "label": "PostgreSQL Docs — Joins Between Tables", "url": "https://www.postgresql.org/docs/current/tutorial-join.html", "type": "docs" }
            ]
          },
          {
            "title": "GROUP BY with aggregate functions and the HAVING clause",
            "description": "GROUP BY collapses rows with the same value into one group. WHERE filters individual rows before grouping; HAVING filters groups after aggregation. Both can coexist in the same query.",
            "resources": [
              { "label": "SQLBolt — Aggregates", "url": "https://sqlbolt.com/lesson/select_queries_with_aggregates", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing SQL and connecting to PostgreSQL from Node",
        "children": [
          {
            "title": "SELECT, INSERT, UPDATE, DELETE with parameterized queries",
            "description": "Always use parameterized queries ($1, $2 in node-postgres) — never string interpolation. This prevents SQL injection and lets the database cache query plans for better performance.",
            "resources": [
              { "label": "node-postgres Docs — Queries", "url": "https://node-postgres.com/features/queries", "type": "docs" }
            ]
          },
          {
            "title": "Connection pooling with the pg Pool class",
            "description": "Creating a new connection per request takes ~50ms. pg.Pool reuses connections across requests and queues queries when the pool is full. Set max pool size to match your database's connection limit.",
            "resources": [
              { "label": "node-postgres Docs — Pooling", "url": "https://node-postgres.com/features/pooling", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Indexes and constraints for data integrity",
        "children": [
          {
            "title": "Creating indexes on columns used in WHERE and JOIN clauses",
            "description": "Without an index, PostgreSQL scans every row. CREATE INDEX ON recipes(category_id) speeds up queries that filter by category. Run EXPLAIN ANALYZE to confirm the index is being used.",
            "resources": [
              { "label": "PostgreSQL Docs — Indexes", "url": "https://www.postgresql.org/docs/current/indexes.html", "type": "docs" }
            ]
          },
          {
            "title": "UNIQUE and CHECK constraints for data integrity at the database level",
            "description": "UNIQUE constraints prevent duplicate emails or slugs. CHECK constraints enforce domain rules (price > 0) at the database level, catching bugs that slip past application validation.",
            "resources": [
              { "label": "PostgreSQL Docs — DDL Constraints", "url": "https://www.postgresql.org/docs/current/ddl-constraints.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-5",
    "sideLeft": [
      {
        "title": "HTTP and the browser's same-origin policy",
        "children": [
          {
            "title": "Why the browser blocks cross-origin requests by default",
            "description": "The same-origin policy prevents scripts on one origin from reading responses from another. CORS is the server-controlled mechanism that opts into allowing cross-origin requests with specific headers.",
            "resources": [
              { "label": "MDN — CORS", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", "type": "docs" }
            ]
          },
          {
            "title": "Preflight OPTIONS requests and the CORS negotiation flow",
            "description": "Non-simple requests (DELETE, PUT, custom headers) trigger a preflight OPTIONS request. The browser checks the server's CORS headers before sending the actual request. A missing or wrong header blocks the real call.",
            "resources": [
              { "label": "MDN — Preflight Request", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "API client organization and loading states",
        "children": [
          {
            "title": "Centralizing API calls in a services layer",
            "description": "Keeping fetch calls in dedicated service files (api/recipes.js) separates concerns and makes it easy to swap the HTTP client or add request interceptors without touching component code.",
            "resources": [
              { "label": "MDN — Fetch API", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", "type": "docs" }
            ]
          },
          {
            "title": "Pagination with query parameters: page, limit, and offset",
            "description": "Pass page and limit as query params (/recipes?page=2&limit=10). The server calculates offset = (page-1)*limit and returns total count alongside the data so the client can render a page count.",
            "resources": [
              { "label": "MDN — URL Search Params", "url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Connecting React to an Express API in development",
        "children": [
          {
            "title": "Vite proxy configuration to avoid CORS in development",
            "description": "Set server.proxy in vite.config.ts to forward /api requests to Express. This makes the browser think both apps are on the same origin, eliminating CORS issues without touching the production configuration.",
            "resources": [
              { "label": "Vite Docs — Server Proxy", "url": "https://vitejs.dev/config/server-options.html#server-proxy", "type": "docs" }
            ]
          },
          {
            "title": "cors middleware on Express: origin allowlist and credentials",
            "description": "Use the cors npm package with origin: 'https://yourfrontend.com'. Enable credentials: true when the frontend sends cookies or Authorization headers. Never use origin: '*' with credentials.",
            "resources": [
              { "label": "cors npm", "url": "https://www.npmjs.com/package/cors", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Managing async UI state: loading, error, and empty",
        "children": [
          {
            "title": "Modeling all four fetch states: idle, loading, success, error",
            "description": "A robust data-fetching component handles all four states. Use a status: 'idle' | 'loading' | 'success' | 'error' field in state to drive conditional rendering without boolean flag combinatorial explosion.",
            "resources": [
              { "label": "React Docs — State Structure", "url": "https://react.dev/learn/choosing-the-state-structure", "type": "docs" }
            ]
          },
          {
            "title": "Error boundaries for catching render errors in React subtrees",
            "description": "Error boundaries catch JavaScript errors in any child component and display a fallback UI instead of crashing the whole app. They must be class components but can be wrapped in a functional component helper.",
            "resources": [
              { "label": "React Docs — Error Boundaries", "url": "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-6",
    "sideLeft": [
      {
        "title": "Authentication fundamentals: sessions versus tokens",
        "children": [
          {
            "title": "Session-based auth: server stores state, cookie holds session ID",
            "description": "The server creates a session record and sends the session ID in a Set-Cookie header. On each request, the browser sends the cookie and the server looks up the session. Revocation is instant but requires a session store.",
            "resources": [
              { "label": "MDN — HTTP Cookies", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "type": "docs" }
            ]
          },
          {
            "title": "JWT-based auth: stateless tokens with HMAC signatures",
            "description": "JWTs encode the user identity in a signed token — no server-side storage needed. The server verifies the signature on every request. Revocation is harder; short expiry with refresh tokens is the standard mitigation.",
            "resources": [
              { "label": "JWT.io — Introduction", "url": "https://jwt.io/introduction", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Password security and token storage",
        "children": [
          {
            "title": "bcrypt's adaptive cost factor and per-password salting",
            "description": "bcrypt applies a random salt before hashing, making identical passwords produce different hashes. The cost factor (rounds) makes each hash deliberately slow, raising the cost of brute-force attacks.",
            "resources": [
              { "label": "OWASP — Password Storage", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "type": "article" }
            ]
          },
          {
            "title": "HTTP-only cookies prevent XSS from stealing auth tokens",
            "description": "JavaScript cannot read HTTP-only cookies, making them immune to XSS token theft. Combine with SameSite=Strict (CSRF protection) and Secure (HTTPS only) for a hardened cookie configuration.",
            "resources": [
              { "label": "OWASP — Session Management", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", "type": "article" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Implementing auth in Express and React",
        "children": [
          {
            "title": "bcrypt.hash and bcrypt.compare for password hashing",
            "description": "bcrypt.hash(password, 12) hashes with cost 12 — high enough to be slow without making login frustrating. bcrypt.compare(plain, hash) is timing-safe; never use === to compare passwords.",
            "resources": [
              { "label": "bcrypt npm", "url": "https://www.npmjs.com/package/bcrypt", "type": "docs" }
            ]
          },
          {
            "title": "JWT auth middleware: verify Bearer token and attach user to req",
            "description": "Read Authorization header, strip 'Bearer ', call jwt.verify(token, secret). Attach the decoded payload to req.user. Apply this middleware to protected routers, not globally.",
            "resources": [
              { "label": "jsonwebtoken npm", "url": "https://www.npmjs.com/package/jsonwebtoken", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Role-based access control and React route guards",
        "children": [
          {
            "title": "Express middleware for role-based authorization",
            "description": "After the auth middleware attaches req.user, add a requireRole('admin') middleware that checks req.user.role and calls next(new ForbiddenError()) if the role doesn't match.",
            "resources": [
              { "label": "Express Docs — Middleware", "url": "https://expressjs.com/en/guide/using-middleware.html", "type": "docs" }
            ]
          },
          {
            "title": "ProtectedRoute wrapper in React Router v6",
            "description": "Wrap protected routes in a component that reads auth state and returns <Navigate to='/login' replace> for unauthenticated users. Pass the desired URL as state so login can redirect back after success.",
            "resources": [
              { "label": "React Router Docs — Auth Example", "url": "https://reactrouter.com/en/main/start/examples", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-7",
    "sideLeft": [
      {
        "title": "API design: layered architecture and validation",
        "children": [
          {
            "title": "Service and repository layers for separation of concerns",
            "description": "Routes receive requests, controllers orchestrate logic, services hold business rules, repositories handle database queries. Each layer depends only on the layer below it, making unit testing and swapping implementations straightforward.",
            "resources": [
              { "label": "Express Docs — Best Practices", "url": "https://expressjs.com/en/advanced/best-practice-performance.html", "type": "docs" }
            ]
          },
          {
            "title": "Input validation at the API boundary prevents invalid data propagation",
            "description": "Validate every piece of incoming data before it reaches business logic or the database. A validation error at the boundary with a clear message is far easier to debug than a constraint violation deep in the stack.",
            "resources": [
              { "label": "OWASP — Input Validation", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html", "type": "article" }
            ]
          }
        ]
      },
      {
        "title": "Caching and query optimization",
        "children": [
          {
            "title": "HTTP caching: Cache-Control, ETag, and conditional requests",
            "description": "Cache-Control: max-age=3600 tells clients and proxies to cache the response for an hour. ETags let clients make conditional requests — if the resource hasn't changed, the server returns 304 Not Modified with no body.",
            "resources": [
              { "label": "MDN — HTTP Caching", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching", "type": "docs" }
            ]
          },
          {
            "title": "Database query optimization: indexes, EXPLAIN, and N+1 avoidance",
            "description": "Run EXPLAIN ANALYZE on slow queries to spot sequential scans on large tables. Add indexes on filtered and joined columns. Avoid N+1 by fetching related data in a single JOIN query instead of one query per row.",
            "resources": [
              { "label": "PostgreSQL Docs — EXPLAIN", "url": "https://www.postgresql.org/docs/current/sql-explain.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Input validation, rate limiting, and security headers",
        "children": [
          {
            "title": "express-validator for chained field validation on routes",
            "description": "Chain validators: body('email').isEmail().normalizeEmail(). Call validationResult(req) at the top of the handler and return 422 with the error array if validation failed.",
            "resources": [
              { "label": "express-validator Docs", "url": "https://express-validator.github.io/docs/", "type": "docs" }
            ]
          },
          {
            "title": "Helmet for security headers and express-rate-limit for brute-force protection",
            "description": "Helmet sets Content-Security-Policy, X-Frame-Options, and other defensive headers in one line. Rate-limit auth endpoints to 10 requests per 15 minutes to prevent credential stuffing.",
            "resources": [
              { "label": "Helmet.js Docs", "url": "https://helmetjs.github.io/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Logging and monitoring basics",
        "children": [
          {
            "title": "Structured logging with pino or morgan",
            "description": "Structured logs (JSON output) are machine-parseable by log aggregators like Datadog or CloudWatch. Use pino for high-performance structured logging in production; morgan for quick HTTP request logging in development.",
            "resources": [
              { "label": "pino Docs", "url": "https://getpino.io/", "type": "docs" }
            ]
          },
          {
            "title": "Process error handlers: uncaughtException and unhandledRejection",
            "description": "Listen for process.on('uncaughtException') and process.on('unhandledRejection') to log and gracefully shutdown rather than silently crash. Never resume execution after uncaughtException.",
            "resources": [
              { "label": "Node.js Docs — Process Events", "url": "https://nodejs.org/api/process.html#event-uncaughtexception", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-8",
    "sideLeft": [
      {
        "title": "Docker containers and the image layer model",
        "children": [
          {
            "title": "Images, containers, and the union filesystem layer model",
            "description": "A Docker image is a stack of read-only filesystem layers. Running an image creates a container with a thin writable layer on top. Sharing base layers across images means a node:20 base is pulled only once.",
            "resources": [
              { "label": "Docker Docs — Images", "url": "https://docs.docker.com/engine/storage/drivers/", "type": "docs" }
            ]
          },
          {
            "title": "Multi-stage Dockerfiles for lean production Node images",
            "description": "Use a build stage to install devDependencies and compile TypeScript. Copy only dist/ and a fresh npm ci --omit=dev into the final stage. This can reduce image size from 1GB+ to under 200MB.",
            "resources": [
              { "label": "Docker Docs — Multi-Stage Builds", "url": "https://docs.docker.com/build/building/multi-stage/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Docker Compose and multi-service networking",
        "children": [
          {
            "title": "Docker Compose service discovery via container name DNS",
            "description": "Services in the same Compose network reach each other by service name: DB_HOST=postgres works because Compose creates a DNS entry for the postgres service. No IP addresses needed.",
            "resources": [
              { "label": "Docker Docs — Compose Networking", "url": "https://docs.docker.com/compose/how-tos/networking/", "type": "docs" }
            ]
          },
          {
            "title": "Named volumes for persistent PostgreSQL data across container restarts",
            "description": "Without a volume, container data is lost when the container stops. A named volume mounts a host directory into the container, persisting the database even after docker compose down.",
            "resources": [
              { "label": "Docker Docs — Volumes", "url": "https://docs.docker.com/engine/storage/volumes/", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing a Dockerfile for a Node/Express app",
        "children": [
          {
            "title": "Dockerfile instruction order: COPY package.json before source code",
            "description": "Copy package.json and package-lock.json first, run npm ci, then copy source. This caches the npm install layer — it only re-runs when dependencies change, not on every code change.",
            "resources": [
              { "label": "Docker Docs — Dockerfile Best Practices", "url": "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", "type": "docs" }
            ]
          },
          {
            "title": "Using .dockerignore to exclude node_modules and .env",
            "description": "A .dockerignore file prevents node_modules, .env, and .git from being copied into the build context. Without it, the build context transfer is slow and your secrets end up in the image layer history.",
            "resources": [
              { "label": "Docker Docs — .dockerignore", "url": "https://docs.docker.com/build/concepts/context/#dockerignore-files", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Docker Compose for local full-stack development",
        "children": [
          {
            "title": "docker compose up, down, logs, and exec commands",
            "description": "docker compose up -d starts all services detached. docker compose logs -f api streams logs from the api service. docker compose exec postgres psql -U user db opens a database shell.",
            "resources": [
              { "label": "Docker Docs — Compose CLI Reference", "url": "https://docs.docker.com/compose/reference/", "type": "docs" }
            ]
          },
          {
            "title": "Health checks and depends_on for service startup ordering",
            "description": "depends_on with condition: service_healthy makes the API wait until the Postgres container's health check passes before starting, preventing connection-refused errors on cold start.",
            "resources": [
              { "label": "Docker Docs — Compose depends_on", "url": "https://docs.docker.com/reference/compose-file/services/#depends_on", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-9",
    "sideLeft": [
      {
        "title": "Testing philosophy and the testing pyramid",
        "children": [
          {
            "title": "Unit, integration, and E2E tests: cost versus confidence trade-offs",
            "description": "Unit tests are fast and cheap but test components in isolation. Integration tests hit the real database and give higher confidence. E2E tests drive a real browser and catch full-stack bugs but are slow and brittle.",
            "resources": [
              { "label": "Martin Fowler — Test Pyramid", "url": "https://martinfowler.com/bliki/TestPyramid.html", "type": "article" }
            ]
          },
          {
            "title": "What to mock and what to test for real",
            "description": "Mock external services (email, third-party APIs) in tests. Use a real test database for integration tests — mocking the database hides bugs at the SQL or ORM level that only appear in production.",
            "resources": [
              { "label": "Jest Docs — Mock Functions", "url": "https://jestjs.io/docs/mock-functions", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Playwright's browser automation model",
        "children": [
          {
            "title": "Playwright's auto-wait: how it retries assertions until stable",
            "description": "Playwright auto-waits for elements to be visible, enabled, and stable before interacting. This eliminates most flaky test sleeps — use expect(locator).toBeVisible() instead of arbitrary wait times.",
            "resources": [
              { "label": "Playwright Docs — Auto-waiting", "url": "https://playwright.dev/docs/actionability", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing tests for the full stack",
        "children": [
          {
            "title": "Jest unit tests: describe, it, beforeEach, and matchers",
            "description": "Group related tests with describe, set up shared state in beforeEach, and assert with matchers like toEqual, toThrow, and toHaveBeenCalledWith. Run jest --watch during development for instant feedback.",
            "resources": [
              { "label": "Jest Docs — Getting Started", "url": "https://jestjs.io/docs/getting-started", "type": "docs" }
            ]
          },
          {
            "title": "Supertest for Express endpoint integration tests",
            "description": "Supertest binds your Express app in-process and makes real HTTP requests. Test the full request pipeline including validation middleware, auth, and database writes against a test database.",
            "resources": [
              { "label": "Supertest GitHub", "url": "https://github.com/ladjs/supertest", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "React component testing and E2E with Playwright",
        "children": [
          {
            "title": "React Testing Library: query by role, interact with userEvent",
            "description": "RTL's getByRole mirrors how users and screen readers find UI. Use @testing-library/user-event for realistic interactions (type, click, keyboard) rather than firing synthetic events directly.",
            "resources": [
              { "label": "Testing Library Docs — Queries", "url": "https://testing-library.com/docs/queries/about", "type": "docs" }
            ]
          },
          {
            "title": "Playwright page object model for maintainable E2E tests",
            "description": "Encapsulate page interactions in a Page Object class (LoginPage, RecipePage). Tests become readable sequences of high-level actions; selector updates happen in one place when the UI changes.",
            "resources": [
              { "label": "Playwright Docs — Page Object Model", "url": "https://playwright.dev/docs/pom", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fullstack-engineer-10",
    "sideLeft": [
      {
        "title": "CI/CD pipeline concepts",
        "children": [
          {
            "title": "Continuous integration: automated testing on every push",
            "description": "CI runs tests automatically on every branch push and pull request. A green CI badge means the branch hasn't broken any tests — it's the gate before merging. GitHub Actions is the most common CI runtime.",
            "resources": [
              { "label": "GitHub Actions Docs — Understanding Actions", "url": "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions", "type": "docs" }
            ]
          },
          {
            "title": "Container registries: pushing and pulling images for deployment",
            "description": "Build the Docker image in CI, tag it with the git SHA, and push it to a registry (Docker Hub, ECR, GHCR). The deployment step pulls the exact versioned image, giving reproducible deployments.",
            "resources": [
              { "label": "Docker Docs — Registry", "url": "https://docs.docker.com/registry/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Cloud hosting and managed services",
        "children": [
          {
            "title": "Managed PostgreSQL versus self-hosted: operational trade-offs",
            "description": "Managed databases (RDS, Railway Postgres, Supabase) handle backups, patching, and replication. Self-hosting gives you control but requires operational expertise. For most full-stack projects, managed wins on cost and time.",
            "resources": [
              { "label": "AWS Docs — Amazon RDS", "url": "https://docs.aws.amazon.com/rds/index.html", "type": "docs" }
            ]
          },
          {
            "title": "Zero-downtime deployments with rolling updates",
            "description": "A rolling deployment starts new instances before draining old ones. The load balancer routes traffic only to healthy new instances. Run database migrations before deploying to ensure both versions are compatible.",
            "resources": [
              { "label": "AWS Docs — ECS Rolling Updates", "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "GitHub Actions workflow for a full-stack app",
        "children": [
          {
            "title": "Workflow triggers, jobs, and steps syntax",
            "description": "on: push: branches: [main] triggers on push. Jobs run in parallel by default; use needs: [test] to sequence them. Steps use actions (actions/checkout) or run: shell commands.",
            "resources": [
              { "label": "GitHub Actions Docs — Workflow Syntax", "url": "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions", "type": "docs" }
            ]
          },
          {
            "title": "Service containers in Actions: running PostgreSQL for integration tests",
            "description": "Use services: postgres: image: postgres in a workflow job to spin up a real PostgreSQL container for integration tests. Pass connection details as environment variables to your test runner.",
            "resources": [
              { "label": "GitHub Actions Docs — Service Containers", "url": "https://docs.github.com/en/actions/using-containerized-services/about-service-containers", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Deploying to a cloud host",
        "children": [
          {
            "title": "Environment variables and secrets in Vercel and Railway",
            "description": "Add environment variables in the platform dashboard — they're injected at build time (VITE_* for client) or runtime (server secrets). Never commit .env files; use .env.example for documentation.",
            "resources": [
              { "label": "Vercel Docs — Environment Variables", "url": "https://vercel.com/docs/projects/environment-variables", "type": "docs" }
            ]
          },
          {
            "title": "Monitoring with structured logs and health check endpoints",
            "description": "Expose a GET /healthz endpoint that checks DB connectivity and returns 200 or 503. Platform load balancers hit this to determine if the instance should receive traffic. Log structured JSON so alerts can query specific fields.",
            "resources": [
              { "label": "pino Docs", "url": "https://getpino.io/", "type": "docs" }
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
