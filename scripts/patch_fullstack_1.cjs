const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/data/roadmaps/fullstack.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const patches = [
  {
    "id": "mern-1",
    "sideLeft": [
      {
        "title": "How browsers parse and render HTML/CSS",
        "children": [
          {
            "title": "The critical rendering path and render-blocking resources",
            "description": "Browsers parse HTML into a DOM, CSS into a CSSOM, then combine them into a render tree before painting. Understanding this tells you exactly why CSS in <head> and JS at end of body matters.",
            "resources": [
              { "label": "MDN — Critical Rendering Path", "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path", "type": "article" }
            ]
          },
          {
            "title": "Semantic HTML and the accessibility tree",
            "description": "Semantic elements like <nav>, <main>, and <article> create an accessibility tree that screen readers traverse. Choosing the right element is never just aesthetic — it determines keyboard navigability and ARIA roles.",
            "resources": [
              { "label": "MDN — HTML Elements Reference", "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "CSS layout models: flow, flexbox, and grid",
        "children": [
          {
            "title": "The box model: content, padding, border, and margin",
            "description": "Every element is a rectangular box. Knowing how box-sizing: border-box changes width calculations prevents the most common CSS layout bugs.",
            "resources": [
              { "label": "MDN — The Box Model", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model", "type": "article" }
            ]
          },
          {
            "title": "When to use flexbox versus CSS grid",
            "description": "Flexbox is one-dimensional (a row or column); grid is two-dimensional (rows and columns simultaneously). Knowing which to reach for prevents fighting the layout algorithm.",
            "resources": [
              { "label": "CSS-Tricks — Complete Guide to Flexbox", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", "type": "article" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Responsive design with media queries and units",
        "children": [
          {
            "title": "Mobile-first breakpoints with min-width media queries",
            "description": "Write base styles for small screens, then add breakpoints upward. This produces leaner CSS than desktop-first overrides.",
            "resources": [
              { "label": "MDN — Using Media Queries", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries", "type": "docs" }
            ]
          },
          {
            "title": "Browser DevTools: inspecting layout, styles, and the network tab",
            "description": "DevTools lets you live-edit CSS, inspect box models, and see every network request. It's the fastest feedback loop you have while building.",
            "resources": [
              { "label": "Chrome DevTools Docs", "url": "https://developer.chrome.com/docs/devtools/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "JavaScript DOM manipulation and events",
        "children": [
          {
            "title": "Selecting elements and modifying the DOM at runtime",
            "description": "querySelector, textContent, classList, and setAttribute let you read and rewrite the page from JavaScript. These are the primitives React abstracts over.",
            "resources": [
              { "label": "javascript.info — Document", "url": "https://javascript.info/document", "type": "docs" }
            ]
          },
          {
            "title": "Event bubbling, delegation, and removeEventListener",
            "description": "Events bubble up the DOM tree. Delegating a single listener on a parent instead of many on children is more performant and avoids memory leaks.",
            "resources": [
              { "label": "MDN — Event Bubbling", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling", "type": "article" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-2",
    "sideLeft": [
      {
        "title": "The JavaScript event loop and async execution model",
        "children": [
          {
            "title": "Call stack, task queue, and microtask queue ordering",
            "description": "The event loop processes the call stack first, then microtasks (Promise callbacks), then the macrotask queue (setTimeout). Knowing this order explains why Promise.then always runs before setTimeout(fn, 0).",
            "resources": [
              { "label": "javascript.info — Event Loop", "url": "https://javascript.info/event-loop", "type": "article" }
            ]
          },
          {
            "title": "How closures capture free variables in the scope chain",
            "description": "A closure is a function that retains references to its outer lexical scope even after that scope has returned. They enable module patterns, memoization, and React hooks' dependency semantics.",
            "resources": [
              { "label": "MDN — Closures", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Promises and the async/await desugaring",
        "children": [
          {
            "title": "Promise chaining versus async/await for sequential calls",
            "description": "async/await is syntactic sugar over Promises; each await suspends the function and resumes it in a microtask. Understanding this prevents bugs when mixing callbacks and Promises.",
            "resources": [
              { "label": "javascript.info — Async/Await", "url": "https://javascript.info/async-await", "type": "docs" }
            ]
          },
          {
            "title": "Promise.all, Promise.allSettled, and race conditions",
            "description": "Promise.all rejects immediately if any promise rejects; Promise.allSettled waits for all. Choosing the wrong combinator is a common source of dropped errors in parallel API calls.",
            "resources": [
              { "label": "MDN — Promise.all", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Modern ES6+ syntax patterns used in MERN codebases",
        "children": [
          {
            "title": "Destructuring, spread, and rest in function signatures",
            "description": "Destructuring unpacks arrays/objects inline; spread copies or merges them. Both appear constantly in React props, Redux reducers, and API response handling.",
            "resources": [
              { "label": "MDN — Destructuring Assignment", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", "type": "docs" }
            ]
          },
          {
            "title": "Array methods: map, filter, reduce, and their composition",
            "description": "These three methods replace most imperative loops. Composing them — filter then map — is how you transform API response arrays into what the UI needs.",
            "resources": [
              { "label": "javascript.info — Array Methods", "url": "https://javascript.info/array-methods", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Fetch API and error handling patterns",
        "children": [
          {
            "title": "fetch, Response.ok, and typed error handling",
            "description": "fetch only rejects on network failure, not on 4xx/5xx responses. You must check response.ok and throw manually — a mistake that causes silent failures.",
            "resources": [
              { "label": "MDN — Fetch API", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch", "type": "docs" }
            ]
          },
          {
            "title": "ES modules: import/export and the difference from CommonJS",
            "description": "ESM is static (analyzed at parse time); CommonJS is dynamic (require runs at runtime). MERN projects mix both, and understanding the boundary prevents bundler errors.",
            "resources": [
              { "label": "MDN — ES Modules Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-3",
    "sideLeft": [
      {
        "title": "React's component model and virtual DOM reconciliation",
        "children": [
          {
            "title": "How React diffs the virtual DOM and batches DOM updates",
            "description": "React creates a virtual DOM tree and compares it to the previous one on each render, applying only the minimal real DOM changes. This diffing algorithm (reconciliation) is why React is fast with many small updates.",
            "resources": [
              { "label": "React Docs — Rendering", "url": "https://react.dev/learn/render-and-commit", "type": "docs" }
            ]
          },
          {
            "title": "Unidirectional data flow: props down, events up",
            "description": "In React, data flows from parent to child via props, and children communicate back via callback props. Violating this pattern leads to the tangled state that Context and state managers solve.",
            "resources": [
              { "label": "React Docs — Thinking in React", "url": "https://react.dev/learn/thinking-in-react", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "useState and useEffect semantics",
        "children": [
          {
            "title": "Why state updates are asynchronous and batched",
            "description": "Calling setState doesn't immediately mutate state; React queues the update and re-renders. Relying on stale state in the same handler is the #1 React beginner bug.",
            "resources": [
              { "label": "React Docs — useState", "url": "https://react.dev/reference/react/useState", "type": "docs" }
            ]
          },
          {
            "title": "useEffect dependency array and cleanup functions",
            "description": "The dependency array controls when the effect re-runs; an empty array means run once on mount. Omitting the cleanup return causes memory leaks from subscriptions and timers.",
            "resources": [
              { "label": "React Docs — useEffect", "url": "https://react.dev/reference/react/useEffect", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "JSX syntax and component composition patterns",
        "children": [
          {
            "title": "JSX compiles to React.createElement calls",
            "description": "JSX is syntax sugar; <Button color='blue'>Click</Button> becomes React.createElement(Button, {color:'blue'}, 'Click'). Understanding this demystifies JSX restrictions like single root elements.",
            "resources": [
              { "label": "React Docs — Writing Markup with JSX", "url": "https://react.dev/learn/writing-markup-with-jsx", "type": "docs" }
            ]
          },
          {
            "title": "Rendering lists with key props and conditional rendering",
            "description": "Keys help React identify which list items changed, added, or removed. Using array index as key breaks reconciliation when items reorder — use stable unique IDs instead.",
            "resources": [
              { "label": "React Docs — Rendering Lists", "url": "https://react.dev/learn/rendering-lists", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Controlled forms and event handling in React",
        "children": [
          {
            "title": "Controlled inputs: value prop + onChange handler",
            "description": "A controlled input's value is driven by React state, not the DOM. This makes validation and programmatic clearing trivial but requires a handler for every keystroke.",
            "resources": [
              { "label": "React Docs — Reacting to Input with State", "url": "https://react.dev/learn/reacting-to-input-with-state", "type": "docs" }
            ]
          },
          {
            "title": "Synthetic events and event pooling in React",
            "description": "React wraps native events in SyntheticEvent for cross-browser compatibility. Accessing event properties asynchronously requires event.persist() or extracting values before the async call.",
            "resources": [
              { "label": "React Docs — Responding to Events", "url": "https://react.dev/learn/responding-to-events", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-4",
    "sideLeft": [
      {
        "title": "Context API internals and when it causes re-renders",
        "children": [
          {
            "title": "How Context propagates values and triggers consumer re-renders",
            "description": "Every component that calls useContext re-renders when the context value changes — even if it only uses part of the value. Splitting contexts by update frequency is how you avoid this.",
            "resources": [
              { "label": "React Docs — useContext", "url": "https://react.dev/reference/react/useContext", "type": "docs" }
            ]
          },
          {
            "title": "useReducer for state with multiple related sub-values",
            "description": "useReducer is preferable to useState when next state depends on complex logic across many fields. It also makes state transitions testable in pure functions.",
            "resources": [
              { "label": "React Docs — useReducer", "url": "https://react.dev/reference/react/useReducer", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "React Router v6 rendering model",
        "children": [
          {
            "title": "Nested routes and the Outlet component for shared layouts",
            "description": "In RRv6, nested route definitions render into the parent's <Outlet>. This replaces the old switch-based approach and makes layout composition declarative.",
            "resources": [
              { "label": "React Router Docs — Nested Routes", "url": "https://reactrouter.com/en/main/start/tutorial", "type": "docs" }
            ]
          },
          {
            "title": "useMemo and useCallback: when memoization helps and when it hurts",
            "description": "Memoization prevents unnecessary recalculations and child re-renders but adds overhead from the comparison itself. Only apply it when a profiler shows a real performance problem.",
            "resources": [
              { "label": "React Docs — useMemo", "url": "https://react.dev/reference/react/useMemo", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Custom hooks for reusable stateful logic",
        "children": [
          {
            "title": "Extracting stateful logic into custom hooks",
            "description": "A custom hook is just a function whose name starts with 'use' and that calls other hooks. It lets you share logic like useFetch or useForm across components without prop drilling.",
            "resources": [
              { "label": "React Docs — Custom Hooks", "url": "https://react.dev/learn/reusing-logic-with-custom-hooks", "type": "docs" }
            ]
          },
          {
            "title": "Code splitting with React.lazy and Suspense",
            "description": "React.lazy dynamically imports a component, and Suspense shows a fallback while it loads. This keeps the initial bundle small by deferring routes or heavy components.",
            "resources": [
              { "label": "React Docs — Lazy Loading", "url": "https://react.dev/reference/react/lazy", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "React Router navigation APIs",
        "children": [
          {
            "title": "useNavigate, useParams, and useSearchParams",
            "description": "useNavigate replaces the history object for programmatic navigation. useParams reads dynamic segments and useSearchParams reads query strings — both typed with TypeScript generics.",
            "resources": [
              { "label": "React Router Docs — API Reference", "url": "https://reactrouter.com/en/main/hooks/use-navigate", "type": "docs" }
            ]
          },
          {
            "title": "Protected routes using wrapper components and redirect",
            "description": "Wrapping routes in an auth-checking component that redirects unauthenticated users is the standard pattern. Combine with useContext auth state for a clean implementation.",
            "resources": [
              { "label": "React Router Docs — Auth Example", "url": "https://reactrouter.com/en/main/start/examples", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-5",
    "sideLeft": [
      {
        "title": "The Node.js runtime: event loop and the module system",
        "children": [
          {
            "title": "How Node.js handles I/O without blocking using libuv",
            "description": "Node delegates file I/O and network calls to libuv's thread pool; the event loop picks up callbacks when they complete. This is why a single-threaded Node server can handle thousands of concurrent connections.",
            "resources": [
              { "label": "Node.js Docs — About Node.js", "url": "https://nodejs.org/en/about", "type": "docs" }
            ]
          },
          {
            "title": "CommonJS require versus ES module import in Node",
            "description": "CommonJS loads synchronously; ESM is asynchronous and statically analyzable. Node supports both, but mixing them requires understanding .mjs/.cjs extensions and the 'type' package.json field.",
            "resources": [
              { "label": "Node.js Docs — Modules: CommonJS", "url": "https://nodejs.org/docs/latest/api/modules.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Express middleware chain execution model",
        "children": [
          {
            "title": "How Express routes and middleware compose with next()",
            "description": "Every Express handler receives (req, res, next). Calling next() passes control to the next middleware; calling next(err) skips to error middleware. The order of app.use() calls is the execution order.",
            "resources": [
              { "label": "Express Docs — Writing Middleware", "url": "https://expressjs.com/en/guide/writing-middleware.html", "type": "docs" }
            ]
          },
          {
            "title": "RESTful API design: resources, verbs, and status codes",
            "description": "REST maps HTTP verbs to CRUD: GET/read, POST/create, PUT-PATCH/update, DELETE/delete. Using the correct status codes (201, 204, 404, 422) makes your API self-documenting.",
            "resources": [
              { "label": "MDN — HTTP Response Status Codes", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Setting up and structuring an Express application",
        "children": [
          {
            "title": "Router modules for separating concerns by resource",
            "description": "express.Router() creates a mini-app with its own middleware stack. Mounting separate routers for /users, /posts, and /auth keeps each file focused on one resource.",
            "resources": [
              { "label": "Express Docs — Router", "url": "https://expressjs.com/en/4x/api.html#router", "type": "docs" }
            ]
          },
          {
            "title": "Environment variables with dotenv and the config pattern",
            "description": "Store secrets (DB URLs, JWT secrets) in .env files loaded by dotenv. Never commit .env — add it to .gitignore and document required variables in a .env.example.",
            "resources": [
              { "label": "dotenv npm docs", "url": "https://www.npmjs.com/package/dotenv", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Request validation and centralized error handling",
        "children": [
          {
            "title": "Input validation with express-validator or Joi",
            "description": "Never trust req.body. Validate shape, type, and constraints at the route level before hitting business logic or the database. express-validator chains directly on route definitions.",
            "resources": [
              { "label": "express-validator Docs", "url": "https://express-validator.github.io/docs/", "type": "docs" }
            ]
          },
          {
            "title": "Centralized error middleware with four-argument signature",
            "description": "Express error middleware has the signature (err, req, res, next). Register it last with app.use() and throw or call next(err) from anywhere in the chain to reach it.",
            "resources": [
              { "label": "Express Docs — Error Handling", "url": "https://expressjs.com/en/guide/error-handling.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-6",
    "sideLeft": [
      {
        "title": "NoSQL document model versus relational tables",
        "children": [
          {
            "title": "Embedding versus referencing documents in MongoDB",
            "description": "Embed related data (comments inside posts) when it's always read together; reference with ObjectId when the related data is large or shared. Choosing wrong is expensive to fix.",
            "resources": [
              { "label": "MongoDB Docs — Data Modeling", "url": "https://www.mongodb.com/docs/manual/data-modeling/", "type": "docs" }
            ]
          },
          {
            "title": "MongoDB BSON types and the ObjectId structure",
            "description": "MongoDB stores documents as BSON (binary JSON), which includes types like ObjectId, Date, and Int64 that JSON lacks. ObjectId encodes a timestamp, making it sortable by insertion order.",
            "resources": [
              { "label": "MongoDB Docs — BSON Types", "url": "https://www.mongodb.com/docs/manual/reference/bson-types/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Mongoose schema validation and middleware hooks",
        "children": [
          {
            "title": "Schema types, validators, and default values in Mongoose",
            "description": "Mongoose schemas define the shape of documents with type constraints, required fields, and defaults. This validation runs before save, giving you a data integrity layer above the raw driver.",
            "resources": [
              { "label": "Mongoose Docs — SchemaTypes", "url": "https://mongoosejs.com/docs/schematypes.html", "type": "docs" }
            ]
          },
          {
            "title": "Mongoose pre/post middleware for cross-cutting logic",
            "description": "pre('save') and post('find') hooks run before/after specific operations. Use them for hashing passwords, audit logging, or populating virtuals — logic that should always run regardless of caller.",
            "resources": [
              { "label": "Mongoose Docs — Middleware", "url": "https://mongoosejs.com/docs/middleware.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "MongoDB Atlas setup and connection management",
        "children": [
          {
            "title": "Connecting with mongoose.connect and handling connection events",
            "description": "Pass the Atlas connection string to mongoose.connect() and listen for 'connected' and 'error' events. In production, use connection pooling settings and retry logic.",
            "resources": [
              { "label": "Mongoose Docs — Connections", "url": "https://mongoosejs.com/docs/connections.html", "type": "docs" }
            ]
          },
          {
            "title": "CRUD operations with Mongoose model methods",
            "description": "Model.create(), .find(), .findById(), .findByIdAndUpdate(), .deleteOne() are the primary query methods. Always await them and handle the null case for find-by-ID lookups.",
            "resources": [
              { "label": "Mongoose Docs — Models", "url": "https://mongoosejs.com/docs/models.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Querying and indexing for performance",
        "children": [
          {
            "title": "MongoDB query operators: $eq, $in, $gte, $regex",
            "description": "MongoDB's query language uses operator objects inside filter documents. $in for array membership, $gte/$lte for ranges, and $regex for text search are the most commonly needed.",
            "resources": [
              { "label": "MongoDB Docs — Query Operators", "url": "https://www.mongodb.com/docs/manual/reference/operator/query/", "type": "docs" }
            ]
          },
          {
            "title": "Creating indexes to avoid full collection scans",
            "description": "Without an index, MongoDB scans every document. Add schema.index({ field: 1 }) in Mongoose or db.collection.createIndex() in Atlas for any field you filter or sort by frequently.",
            "resources": [
              { "label": "MongoDB Docs — Indexes", "url": "https://www.mongodb.com/docs/manual/indexes/", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-7",
    "sideLeft": [
      {
        "title": "Password security and cryptographic hashing",
        "children": [
          {
            "title": "Why bcrypt uses work factor and salting to resist brute force",
            "description": "bcrypt's adaptive cost factor makes hashing intentionally slow. Each password gets a random salt before hashing, so identical passwords produce different hashes and rainbow tables are useless.",
            "resources": [
              { "label": "OWASP — Password Storage Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "type": "article" }
            ]
          },
          {
            "title": "JWT structure: header, payload, and signature verification",
            "description": "A JWT is three Base64URL-encoded JSON objects separated by dots. The signature is computed from header+payload using a secret; the server verifies by re-computing it. Anyone can decode the payload — never put sensitive data in it.",
            "resources": [
              { "label": "JWT.io — Introduction", "url": "https://jwt.io/introduction", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "HTTP-only cookies versus localStorage for token storage",
        "children": [
          {
            "title": "Why XSS can steal localStorage tokens but not HTTP-only cookies",
            "description": "JavaScript cannot read HTTP-only cookies, so an XSS attack that injects a script can steal localStorage tokens but not cookie-stored ones. HTTP-only cookies are the safer choice for auth tokens.",
            "resources": [
              { "label": "OWASP — XSS Prevention Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", "type": "article" }
            ]
          },
          {
            "title": "CSRF attacks and SameSite cookie attribute as defense",
            "description": "CSRF tricks a logged-in browser into making requests to your API. SameSite=Strict prevents cookies from being sent on cross-origin requests, neutralizing most CSRF attacks.",
            "resources": [
              { "label": "MDN — SameSite Cookies", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Implementing JWT auth in Express",
        "children": [
          {
            "title": "Signing and verifying JWTs with jsonwebtoken",
            "description": "jwt.sign({userId}, secret, {expiresIn}) creates a token; jwt.verify(token, secret) validates it and returns the payload. Always set expiresIn and implement refresh token rotation.",
            "resources": [
              { "label": "jsonwebtoken npm docs", "url": "https://www.npmjs.com/package/jsonwebtoken", "type": "docs" }
            ]
          },
          {
            "title": "Auth middleware: extracting and verifying the Bearer token",
            "description": "Read the Authorization header, strip 'Bearer ', verify the JWT, attach the decoded user to req.user, then call next(). Attach this middleware only to routes that need protection.",
            "resources": [
              { "label": "Express Docs — Writing Middleware", "url": "https://expressjs.com/en/guide/writing-middleware.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "CORS and input sanitization",
        "children": [
          {
            "title": "Configuring cors middleware with an origin allowlist",
            "description": "The cors package sets Access-Control-Allow-Origin headers. Restrict the origin option to your front-end URL in production — never use '*' when credentials are involved.",
            "resources": [
              { "label": "cors npm docs", "url": "https://www.npmjs.com/package/cors", "type": "docs" }
            ]
          },
          {
            "title": "OWASP Top 10 essentials: injection, broken auth, and IDOR",
            "description": "The OWASP Top 10 catalogs the most critical web app vulnerabilities. Injection (SQL/NoSQL), broken authentication, and insecure direct object references are the three most likely to affect a MERN app.",
            "resources": [
              { "label": "OWASP Top 10", "url": "https://owasp.org/www-project-top-ten/", "type": "article" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-8",
    "sideLeft": [
      {
        "title": "Server state versus client state: why the distinction matters",
        "children": [
          {
            "title": "Why server state is async, shared, and can go stale",
            "description": "Server state (API data) is owned by the server; your local copy can be outdated the moment you fetch it. Libraries like React Query model this explicitly with cache, stale time, and background refetch.",
            "resources": [
              { "label": "TanStack Query Docs — Overview", "url": "https://tanstack.com/query/latest/docs/framework/react/overview", "type": "docs" }
            ]
          },
          {
            "title": "React Query cache: staleTime, cacheTime, and invalidation",
            "description": "staleTime controls how long data is considered fresh; cacheTime controls how long it's kept in memory after unmounting. queryClient.invalidateQueries() marks data stale and triggers a background refetch.",
            "resources": [
              { "label": "TanStack Query Docs — Caching", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/caching", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Zustand's subscription model versus Context re-renders",
        "children": [
          {
            "title": "How Zustand avoids the Context re-render problem with selectors",
            "description": "Zustand components only re-render when the specific slice they select changes, unlike Context where any value change re-renders all consumers. Use selector functions: useStore(s => s.count).",
            "resources": [
              { "label": "Zustand Docs", "url": "https://docs.pmnd.rs/zustand/getting-started/introduction", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Axios setup and interceptors for auth headers",
        "children": [
          {
            "title": "Creating an Axios instance with baseURL and interceptors",
            "description": "Create a single Axios instance with your API's base URL. Add a request interceptor to inject the Authorization header and a response interceptor to handle 401s and token refresh.",
            "resources": [
              { "label": "Axios Docs — Interceptors", "url": "https://axios-http.com/docs/interceptors", "type": "docs" }
            ]
          },
          {
            "title": "useMutation and optimistic updates in React Query",
            "description": "useMutation gives you mutateAsync, isPending, and onMutate for optimistic updates. In onMutate, cancel in-flight queries, snapshot old data, and apply the optimistic update immediately.",
            "resources": [
              { "label": "TanStack Query Docs — Mutations", "url": "https://tanstack.com/query/latest/docs/framework/react/guides/mutations", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Connecting React to Express in development and production",
        "children": [
          {
            "title": "Vite proxy configuration for local development",
            "description": "Set server.proxy in vite.config.ts to forward /api requests to your Express server. This avoids CORS issues in development and mirrors how reverse proxies work in production.",
            "resources": [
              { "label": "Vite Docs — Server Proxy", "url": "https://vitejs.dev/config/server-options.html#server-proxy", "type": "docs" }
            ]
          },
          {
            "title": "Handling auth tokens: storing and refreshing on the client",
            "description": "Store access tokens in memory (a module-level variable or Zustand), not localStorage. Store the refresh token in an HTTP-only cookie and hit a /refresh endpoint before expiry.",
            "resources": [
              { "label": "Auth0 Blog — Token Storage", "url": "https://auth0.com/docs/secure/security-guidance/data-security/token-storage", "type": "article" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-9",
    "sideLeft": [
      {
        "title": "Testing philosophy: unit, integration, and end-to-end",
        "children": [
          {
            "title": "The testing pyramid and where to invest testing effort",
            "description": "The testing pyramid recommends many unit tests, fewer integration tests, and few E2E tests. Unit tests are fastest and cheapest; E2E tests are slow but catch real user-facing bugs.",
            "resources": [
              { "label": "Martin Fowler — Test Pyramid", "url": "https://martinfowler.com/bliki/TestPyramid.html", "type": "article" }
            ]
          },
          {
            "title": "What to mock and what not to mock in unit tests",
            "description": "Mock external dependencies (HTTP calls, databases) in unit tests; test them for real in integration tests. Over-mocking makes tests pass even when integration is broken.",
            "resources": [
              { "label": "Jest Docs — Mock Functions", "url": "https://jestjs.io/docs/mock-functions", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "React Testing Library's guiding principle",
        "children": [
          {
            "title": "Query hierarchy: getByRole first, test IDs as last resort",
            "description": "RTL's query priority mirrors how users find UI: by role, label, placeholder, text, then test ID. Using getByRole catches accessibility regressions automatically.",
            "resources": [
              { "label": "Testing Library Docs — Queries", "url": "https://testing-library.com/docs/queries/about", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing Jest unit and integration tests",
        "children": [
          {
            "title": "describe/it blocks, beforeEach setup, and assertion matchers",
            "description": "Jest's describe groups related tests; beforeEach runs setup before each. Matchers like toEqual, toHaveBeenCalledWith, and toThrow cover most assertion needs.",
            "resources": [
              { "label": "Jest Docs — Getting Started", "url": "https://jestjs.io/docs/getting-started", "type": "docs" }
            ]
          },
          {
            "title": "Supertest for testing Express endpoints without a running server",
            "description": "Supertest wraps your Express app and makes real HTTP requests in-process. Use it to test route handlers, middleware, and response shapes without starting a server.",
            "resources": [
              { "label": "Supertest GitHub", "url": "https://github.com/ladjs/supertest", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Async testing and CI integration",
        "children": [
          {
            "title": "Testing async components with waitFor and findBy queries",
            "description": "findBy* queries return a promise that retries until the element appears. waitFor lets you assert on async state changes. Never use arbitrary timeouts — use these utilities instead.",
            "resources": [
              { "label": "Testing Library Docs — Async", "url": "https://testing-library.com/docs/dom-testing-library/api-async", "type": "docs" }
            ]
          },
          {
            "title": "Running jest with --coverage and integrating into GitHub Actions",
            "description": "jest --coverage generates a coverage report. Add a GitHub Actions workflow step to run tests on every push and fail the PR if coverage drops or tests fail.",
            "resources": [
              { "label": "GitHub Actions Docs — Node.js CI", "url": "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mern-10",
    "sideLeft": [
      {
        "title": "Docker containers and the image layer model",
        "children": [
          {
            "title": "How Docker images are built from layered filesystem snapshots",
            "description": "Each Dockerfile instruction adds a read-only layer on top of the previous one. Layers are cached; changing a lower instruction invalidates all layers above it. Order instructions to maximize cache hits.",
            "resources": [
              { "label": "Docker Docs — Best Practices for Dockerfiles", "url": "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", "type": "docs" }
            ]
          },
          {
            "title": "Multi-stage builds for lean production images",
            "description": "A multi-stage Dockerfile uses one stage to build (with dev dependencies) and a second stage to run (copying only the compiled output). This can reduce image size from 1GB to under 100MB.",
            "resources": [
              { "label": "Docker Docs — Multi-Stage Builds", "url": "https://docs.docker.com/build/building/multi-stage/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "CI/CD pipeline concepts",
        "children": [
          {
            "title": "Continuous integration versus continuous deployment distinctions",
            "description": "CI automatically runs tests on every commit to ensure the branch is always green. CD goes further and automatically deploys passing builds. GitHub Actions can handle both in a single workflow file.",
            "resources": [
              { "label": "GitHub Actions Docs — Understanding GitHub Actions", "url": "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Deploying MERN apps to cloud platforms",
        "children": [
          {
            "title": "Vercel deployment: project settings, env vars, and preview URLs",
            "description": "Connect your GitHub repo to Vercel; it deploys on every push and creates preview URLs for PRs. Add environment variables in the Vercel dashboard — never in the repo.",
            "resources": [
              { "label": "Vercel Docs — Deployments", "url": "https://vercel.com/docs/deployments/overview", "type": "docs" }
            ]
          },
          {
            "title": "Railway for deploying Express APIs with managed env vars",
            "description": "Railway auto-detects Node apps, injects a PORT env variable, and provisions databases in the same project. Connect MongoDB Atlas via a DATABASE_URL variable for the data layer.",
            "resources": [
              { "label": "Railway Docs", "url": "https://docs.railway.app/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "GitHub Actions workflow for a MERN project",
        "children": [
          {
            "title": "Writing a workflow that tests and deploys on merge to main",
            "description": "A workflow YAML defines triggers (push to main), jobs (test, build, deploy), and steps. Use actions/checkout, actions/setup-node, and run: npm test before any deploy step.",
            "resources": [
              { "label": "GitHub Actions Docs — Workflow Syntax", "url": "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions", "type": "docs" }
            ]
          },
          {
            "title": "Production environment variables and secret management",
            "description": "Store secrets in GitHub Actions Secrets (Settings → Secrets → Actions). Reference them as ${{ secrets.MY_SECRET }} in the workflow. Never echo secrets or log them.",
            "resources": [
              { "label": "GitHub Actions Docs — Encrypted Secrets", "url": "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-1",
    "sideLeft": [
      {
        "title": "How browsers render HTML, CSS, and JavaScript",
        "children": [
          {
            "title": "The critical rendering path and render-blocking resources",
            "description": "Browsers parse HTML into DOM and CSS into CSSOM, combine them, then layout and paint. Understanding this tells you why script placement and stylesheet ordering affect page speed.",
            "resources": [
              { "label": "MDN — Critical Rendering Path", "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path", "type": "article" }
            ]
          },
          {
            "title": "Semantic HTML elements and the accessibility tree",
            "description": "Semantic elements like <nav>, <main>, and <article> map to accessibility roles that screen readers and search engines use. Using <div> for everything makes your app inaccessible.",
            "resources": [
              { "label": "MDN — Semantics in HTML", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "CSS layout: the box model, flexbox, and grid",
        "children": [
          {
            "title": "box-sizing: border-box and why it simplifies layout math",
            "description": "By default, width excludes padding and border. border-box includes them, making width predictable. Setting * { box-sizing: border-box } is standard practice in every PERN project.",
            "resources": [
              { "label": "MDN — Box Sizing", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing", "type": "docs" }
            ]
          },
          {
            "title": "CSS Grid for two-dimensional page layouts",
            "description": "Grid lets you define rows and columns simultaneously with grid-template-areas. It's the right tool for page-level layout; use flexbox inside cells for one-dimensional component layout.",
            "resources": [
              { "label": "CSS-Tricks — Complete Guide to Grid", "url": "https://css-tricks.com/snippets/css/complete-guide-grid/", "type": "article" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "JavaScript DOM manipulation and events",
        "children": [
          {
            "title": "querySelector, textContent, and classList for DOM updates",
            "description": "These three APIs cover 80% of vanilla DOM manipulation. classList.toggle(), classList.add/remove() let you drive visual state changes from JavaScript without touching inline styles.",
            "resources": [
              { "label": "javascript.info — Document", "url": "https://javascript.info/document", "type": "docs" }
            ]
          },
          {
            "title": "Responsive design with media queries and relative units",
            "description": "Use rem for font sizes (scales with user preferences), % and vw/vh for layout, and min-width media queries for breakpoints. These make sites readable at any screen size.",
            "resources": [
              { "label": "MDN — Using Media Queries", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Browser DevTools for debugging HTML, CSS, and network",
        "children": [
          {
            "title": "Inspecting and live-editing styles in the Styles panel",
            "description": "The DevTools Styles panel lets you toggle CSS rules, add new declarations, and see which rule wins the cascade. Computed panel shows the final resolved value for any property.",
            "resources": [
              { "label": "Chrome DevTools — CSS Reference", "url": "https://developer.chrome.com/docs/devtools/css/", "type": "docs" }
            ]
          },
          {
            "title": "Network tab: reading request/response headers and timing",
            "description": "The Network tab records every HTTP request. Check status codes, headers, and the waterfall timing to diagnose slow pages or unexpected API calls.",
            "resources": [
              { "label": "Chrome DevTools — Network Reference", "url": "https://developer.chrome.com/docs/devtools/network/", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-2",
    "sideLeft": [
      {
        "title": "TypeScript's type system under the hood",
        "children": [
          {
            "title": "Structural typing: why TypeScript matches shapes, not names",
            "description": "TypeScript uses structural typing — if object A has all the properties of type T, A is assignable to T regardless of its declared type. This differs from nominal typing in Java/C#.",
            "resources": [
              { "label": "TypeScript Handbook — Type Compatibility", "url": "https://www.typescriptlang.org/docs/handbook/type-compatibility.html", "type": "docs" }
            ]
          },
          {
            "title": "Type narrowing with typeof, instanceof, and discriminated unions",
            "description": "TypeScript narrows types inside conditional branches. A discriminated union uses a shared literal field (type: 'success' | 'error') to let TypeScript know which shape you have in each branch.",
            "resources": [
              { "label": "TypeScript Handbook — Narrowing", "url": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "The JavaScript event loop and async semantics",
        "children": [
          {
            "title": "Promises, async/await, and the microtask queue",
            "description": "async/await is syntactic sugar over Promises. Each await suspends execution and resumes in a microtask when the promise settles. Uncaught Promise rejections become unhandledRejection events.",
            "resources": [
              { "label": "javascript.info — Async/Await", "url": "https://javascript.info/async-await", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "TypeScript syntax patterns in PERN projects",
        "children": [
          {
            "title": "Interfaces versus type aliases: when to use each",
            "description": "Interfaces are open (can be extended via declaration merging) and work well for object shapes. Type aliases are more flexible (can represent unions, primitives, tuples). In PERN, use interfaces for API shapes and types for unions.",
            "resources": [
              { "label": "TypeScript Handbook — Interfaces", "url": "https://www.typescriptlang.org/docs/handbook/2/objects.html", "type": "docs" }
            ]
          },
          {
            "title": "Generics for reusable API response and pagination types",
            "description": "Generic types like ApiResponse<T> or PaginatedResult<T> let you type API wrappers once and reuse them for every endpoint. This eliminates 'any' while keeping code DRY.",
            "resources": [
              { "label": "TypeScript Handbook — Generics", "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "tsconfig and TypeScript tooling",
        "children": [
          {
            "title": "Key tsconfig options: strict, target, module, and paths",
            "description": "strict enables all strictness flags including strictNullChecks. target sets the JS output version; module controls the module system. Paths lets you use @/components instead of relative imports.",
            "resources": [
              { "label": "TypeScript Docs — tsconfig reference", "url": "https://www.typescriptlang.org/tsconfig", "type": "docs" }
            ]
          },
          {
            "title": "Utility types: Partial, Required, Pick, Omit, and Record",
            "description": "TypeScript's built-in utility types transform existing types. Partial<T> makes all fields optional (useful for update DTOs); Omit<T, 'password'> creates a safe user type without sensitive fields.",
            "resources": [
              { "label": "TypeScript Handbook — Utility Types", "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pern-3",
    "sideLeft": [
      {
        "title": "React's rendering model and reconciliation",
        "children": [
          {
            "title": "How React diffs the virtual DOM to minimize real DOM changes",
            "description": "React builds a virtual DOM tree, compares it to the previous render, and applies only the minimal mutations to the real DOM. This diffing is the reason React is fast even with frequent state updates.",
            "resources": [
              { "label": "React Docs — Render and Commit", "url": "https://react.dev/learn/render-and-commit", "type": "docs" }
            ]
          },
          {
            "title": "Unidirectional data flow and why it simplifies debugging",
            "description": "Data flows down through props; child components communicate up via callback functions passed as props. This single direction makes state changes traceable and bugs easy to locate.",
            "resources": [
              { "label": "React Docs — Thinking in React", "url": "https://react.dev/learn/thinking-in-react", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "useState and useEffect internals",
        "children": [
          {
            "title": "Why state updates are asynchronous and stale closures occur",
            "description": "useState's setter is asynchronous — the new value isn't available until the next render. Using the state value in an effect or event handler may capture a stale closure; use the functional updater form to avoid this.",
            "resources": [
              { "label": "React Docs — useState", "url": "https://react.dev/reference/react/useState", "type": "docs" }
            ]
          },
          {
            "title": "useEffect dependencies and the cleanup pattern",
            "description": "The dependency array controls when effects re-run. Every reactive value used inside the effect must be listed. Return a cleanup function to cancel subscriptions, timers, or fetches on unmount.",
            "resources": [
              { "label": "React Docs — Synchronizing with Effects", "url": "https://react.dev/learn/synchronizing-with-effects", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "JSX, props, and component composition",
        "children": [
          {
            "title": "JSX compiles to React.createElement — implications for JSX rules",
            "description": "JSX transforms to function calls. A component must return a single root element (or Fragment) because a function can only return one value. Fragments avoid adding unnecessary DOM nodes.",
            "resources": [
              { "label": "React Docs — Writing Markup with JSX", "url": "https://react.dev/learn/writing-markup-with-jsx", "type": "docs" }
            ]
          },
          {
            "title": "Lifting state up to the nearest common ancestor",
            "description": "When two components need the same state, lift it to their lowest common parent and pass it down via props. This is the React way of sharing state before reaching for a state manager.",
            "resources": [
              { "label": "React Docs — Sharing State Between Components", "url": "https://react.dev/learn/sharing-state-between-components", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Fetching data from APIs in React",
        "children": [
          {
            "title": "Data fetching in useEffect: loading, data, and error states",
            "description": "Fetch data inside useEffect, track loading/error/data in state, and handle cleanup by aborting the fetch on unmount using AbortController. This pattern is what React Query automates.",
            "resources": [
              { "label": "React Docs — You Might Not Need an Effect", "url": "https://react.dev/learn/you-might-not-need-an-effect", "type": "docs" }
            ]
          },
          {
            "title": "Rendering lists with key props derived from stable IDs",
            "description": "Keys must be stable, unique, and not index-based when items can reorder. React uses keys to decide which list items changed, added, or removed during reconciliation.",
            "resources": [
              { "label": "React Docs — Rendering Lists", "url": "https://react.dev/learn/rendering-lists", "type": "docs" }
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
