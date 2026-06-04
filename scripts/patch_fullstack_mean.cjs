const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/data/roadmaps/fullstack.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const patches = [
  {
    "id": "mean-1",
    "sideLeft": [
      {
        "title": "JavaScript language internals used throughout MEAN",
        "children": [
          {
            "title": "The event loop: call stack, microtasks, and the task queue",
            "description": "JavaScript is single-threaded. The event loop processes the call stack first, then flushes all microtasks (Promise callbacks), then picks one macrotask (setTimeout). This ordering explains async sequencing bugs.",
            "resources": [
              { "label": "javascript.info — Event Loop", "url": "https://javascript.info/event-loop", "type": "article" }
            ]
          },
          {
            "title": "Closures and lexical scoping in JavaScript",
            "description": "A closure is a function that retains access to its outer scope after that scope has returned. They underpin Angular services, RxJS operators, and Node module patterns — understanding them prevents variable sharing bugs.",
            "resources": [
              { "label": "MDN — Closures", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Async patterns: Promises and async/await",
        "children": [
          {
            "title": "Promises: .then chaining, .catch, and Promise.all",
            "description": "Promise.then returns a new Promise, enabling chains. .catch at the end catches any rejection in the chain. Promise.all rejects immediately if any input rejects — use Promise.allSettled when you need all results.",
            "resources": [
              { "label": "javascript.info — Promises", "url": "https://javascript.info/promise-basics", "type": "docs" }
            ]
          },
          {
            "title": "async/await: syntactic sugar over Promises with try/catch",
            "description": "async functions always return a Promise. await suspends execution until the Promise settles. Wrap in try/catch to handle rejections — unhandled async errors will crash Node or cause silent failures in Angular.",
            "resources": [
              { "label": "MDN — async function", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "ES6+ syntax used across the MEAN stack",
        "children": [
          {
            "title": "Destructuring, spread, and rest in function arguments",
            "description": "Destructuring unpacks arrays and objects inline. Spread copies or merges collections. Rest parameters (...args) collect remaining arguments. All three appear constantly in Angular component code and Node handlers.",
            "resources": [
              { "label": "MDN — Destructuring Assignment", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", "type": "docs" }
            ]
          },
          {
            "title": "ES modules: import/export and their differences from CommonJS",
            "description": "ESM is statically analyzed at parse time; CommonJS require is dynamic. Angular uses ESM; older Node defaults to CommonJS. Understanding the boundary prevents interop errors when mixing packages.",
            "resources": [
              { "label": "MDN — JavaScript Modules", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "DOM manipulation and responsive layout basics",
        "children": [
          {
            "title": "DOM events, querySelector, and classList",
            "description": "querySelector returns the first matching element; querySelectorAll returns a NodeList. classList.toggle/add/remove drives state-based styling. These are the primitives Angular's renderer abstracts over.",
            "resources": [
              { "label": "javascript.info — DOM", "url": "https://javascript.info/dom-nodes", "type": "docs" }
            ]
          },
          {
            "title": "Flexbox and responsive layout with media queries",
            "description": "flex + items-center + justify-between handles most component-level layout. Mobile-first min-width media queries layer breakpoints upward. These apply whether you use plain CSS or Angular CDK layouts.",
            "resources": [
              { "label": "CSS-Tricks — Flexbox Guide", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", "type": "article" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-2",
    "sideLeft": [
      {
        "title": "TypeScript's type system for Angular development",
        "children": [
          {
            "title": "Structural typing and why shape matters more than name",
            "description": "TypeScript checks structure, not declared type names. An object with all required properties satisfies an interface regardless of how it was created. This is why Angular can inject any compatible class.",
            "resources": [
              { "label": "TypeScript Handbook — Type Compatibility", "url": "https://www.typescriptlang.org/docs/handbook/type-compatibility.html", "type": "docs" }
            ]
          },
          {
            "title": "Decorators: how Angular uses them to attach metadata",
            "description": "TypeScript decorators are functions that annotate classes, methods, or properties at design time. Angular's @Component, @Injectable, and @NgModule use decorators to register metadata the Angular compiler reads.",
            "resources": [
              { "label": "TypeScript Docs — Decorators", "url": "https://www.typescriptlang.org/docs/handbook/decorators.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Classes and access modifiers in TypeScript",
        "children": [
          {
            "title": "Public, private, protected, and readonly modifiers",
            "description": "private prevents access outside the class at compile time. readonly prevents reassignment after construction. Angular services use private for dependencies and public for template-accessible properties.",
            "resources": [
              { "label": "TypeScript Handbook — Classes", "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html", "type": "docs" }
            ]
          },
          {
            "title": "Generics in TypeScript: type-safe reusable code",
            "description": "Generics let one function or class work with multiple types. HttpClient.get<User[]>('/api/users') infers the response type. Without generics, you'd need a cast or accept 'any' everywhere.",
            "resources": [
              { "label": "TypeScript Handbook — Generics", "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "TypeScript tooling for an Angular project",
        "children": [
          {
            "title": "tsconfig.json: strict, target, and Angular-specific options",
            "description": "Angular projects set strict: true, target: ES2022, and experimentalDecorators: true in tsconfig.json. The Angular CLI generates this; understanding it prevents cryptic compiler errors when upgrading.",
            "resources": [
              { "label": "TypeScript Docs — tsconfig reference", "url": "https://www.typescriptlang.org/tsconfig", "type": "docs" }
            ]
          },
          {
            "title": "Utility types: Partial, Required, Pick, Omit, Record",
            "description": "Partial<User> makes all fields optional — useful for update DTOs. Omit<User, 'password'> creates a safe public type. Record<string, number> types a dictionary. These eliminate redundant type definitions.",
            "resources": [
              { "label": "TypeScript Handbook — Utility Types", "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Enums, interfaces, and module organization",
        "children": [
          {
            "title": "Interfaces for data shapes, enums for fixed value sets",
            "description": "Use interfaces for API response and domain object shapes. Use const enums for fixed value sets like TaskStatus or UserRole — they compile away to literal values with no runtime overhead.",
            "resources": [
              { "label": "TypeScript Handbook — Enums", "url": "https://www.typescriptlang.org/docs/handbook/enums.html", "type": "docs" }
            ]
          },
          {
            "title": "TypeScript module augmentation and declaration merging",
            "description": "Declaration merging lets you extend existing interfaces in separate files. Angular libraries use this to extend the global Window type or add properties to Express's Request interface.",
            "resources": [
              { "label": "TypeScript Handbook — Declaration Merging", "url": "https://www.typescriptlang.org/docs/handbook/declaration-merging.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-3",
    "sideLeft": [
      {
        "title": "Angular's architecture and change detection model",
        "children": [
          {
            "title": "Zone.js and how Angular knows when to run change detection",
            "description": "Zone.js monkey-patches async APIs (setTimeout, fetch, DOM events) to notify Angular when async work completes. Angular then runs change detection to update the view. Understanding this explains why some async code doesn't trigger updates.",
            "resources": [
              { "label": "Angular Docs — Change Detection", "url": "https://angular.dev/guide/change-detection", "type": "docs" }
            ]
          },
          {
            "title": "Dependency injection: the hierarchical injector tree",
            "description": "Angular's DI system resolves providers by walking up the injector tree — component → module → root. A service provided in root is a singleton; provided in a component it's scoped to that component's subtree.",
            "resources": [
              { "label": "Angular Docs — Dependency Injection", "url": "https://angular.dev/guide/di", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Component lifecycle hooks and template binding",
        "children": [
          {
            "title": "ngOnInit vs constructor: when to initialize versus inject",
            "description": "The constructor should only inject dependencies. ngOnInit runs after Angular sets input properties — put data fetching and initialization logic there. ngOnDestroy is the place to unsubscribe from Observables.",
            "resources": [
              { "label": "Angular Docs — Lifecycle Hooks", "url": "https://angular.dev/guide/components/lifecycle", "type": "docs" }
            ]
          },
          {
            "title": "Data binding: interpolation, property binding, event binding, two-way",
            "description": "{{ value }} interpolates text. [property]='value' sets DOM properties. (event)='handler()' listens for events. [(ngModel)]='value' is syntactic sugar for both together — two-way binding.",
            "resources": [
              { "label": "Angular Docs — Data Binding", "url": "https://angular.dev/guide/templates/binding", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Building Angular components and using directives",
        "children": [
          {
            "title": "Structural directives: *ngIf, *ngFor, and ng-template",
            "description": "*ngIf conditionally renders an element; *ngFor iterates an array. Both are syntactic sugar for <ng-template> with an implicit template reference. The asterisk prefix signals Angular to rewrite them.",
            "resources": [
              { "label": "Angular Docs — Built-in Directives", "url": "https://angular.dev/guide/directives", "type": "docs" }
            ]
          },
          {
            "title": "Angular CLI: generate, serve, build, and test commands",
            "description": "ng generate component my-comp creates the component, spec, and module entry. ng serve starts the dev server with HMR. ng build --configuration production produces an optimized output bundle.",
            "resources": [
              { "label": "Angular CLI Docs", "url": "https://angular.dev/tools/cli", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Services and the Angular router",
        "children": [
          {
            "title": "Creating and injecting services with @Injectable",
            "description": "@Injectable({ providedIn: 'root' }) makes the service a singleton available app-wide. Inject it via the constructor: constructor(private taskService: TaskService). Never new a service manually.",
            "resources": [
              { "label": "Angular Docs — Services", "url": "https://angular.dev/guide/di/creating-injectable-service", "type": "docs" }
            ]
          },
          {
            "title": "Angular Router: RouterModule, routes array, and routerLink",
            "description": "Define routes as { path: 'tasks', component: TaskListComponent } and configure RouterModule.forRoot(routes). Use [routerLink]='/tasks' for navigation and <router-outlet> as the render target.",
            "resources": [
              { "label": "Angular Docs — Router", "url": "https://angular.dev/guide/routing", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-4",
    "sideLeft": [
      {
        "title": "Reactive programming with RxJS Observables",
        "children": [
          {
            "title": "Observables versus Promises: lazy, cancellable, multi-value streams",
            "description": "A Promise executes immediately and resolves once. An Observable is lazy — it starts only when subscribed — and can emit multiple values over time. HTTP calls emit once; form valueChanges emits on every keystroke.",
            "resources": [
              { "label": "RxJS Docs — Observable", "url": "https://rxjs.dev/guide/observable", "type": "docs" }
            ]
          },
          {
            "title": "Hot versus cold Observables and multicasting with Subject",
            "description": "Cold Observables create a new execution per subscriber (HttpClient.get). Hot Observables share one execution across all subscribers. Subject is both an Observable and Observer — use it to bridge imperative code to reactive streams.",
            "resources": [
              { "label": "RxJS Docs — Subject", "url": "https://rxjs.dev/guide/subject", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "RxJS operators and stream composition",
        "children": [
          {
            "title": "Transformation operators: map, switchMap, mergeMap, and concatMap",
            "description": "switchMap cancels the previous inner Observable when a new source value arrives — ideal for search typeahead. mergeMap runs all inner Observables concurrently. concatMap queues them. Choosing wrong causes race conditions.",
            "resources": [
              { "label": "Learn RxJS — switchMap", "url": "https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap", "type": "docs" }
            ]
          },
          {
            "title": "Memory leaks from unsubscribed Observables",
            "description": "Observables that never complete (interval, Subject) leak memory if not unsubscribed. Use the async pipe in templates (auto-unsubscribes on destroy) or the takeUntil pattern with a destroy$ Subject.",
            "resources": [
              { "label": "RxJS Docs — Subscription", "url": "https://rxjs.dev/guide/subscription", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Using RxJS in Angular components and services",
        "children": [
          {
            "title": "The async pipe: automatic subscription and unsubscription in templates",
            "description": "{{ items$ | async }} subscribes to the Observable when the component renders and automatically unsubscribes when it destroys. It also triggers change detection when a new value arrives — no manual subscribe needed.",
            "resources": [
              { "label": "Angular Docs — AsyncPipe", "url": "https://angular.dev/api/common/AsyncPipe", "type": "docs" }
            ]
          },
          {
            "title": "BehaviorSubject for shared state in Angular services",
            "description": "BehaviorSubject holds a current value and emits it immediately to new subscribers. Use it in a service to share state across components: private state$ = new BehaviorSubject<Task[]>([]); expose state$.asObservable().",
            "resources": [
              { "label": "RxJS Docs — BehaviorSubject", "url": "https://rxjs.dev/api/index/class/BehaviorSubject", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Live search with debounce and distinctUntilChanged",
        "children": [
          {
            "title": "debounceTime and distinctUntilChanged for efficient search inputs",
            "description": "debounceTime(300) waits 300ms after the last keystroke before emitting. distinctUntilChanged suppresses emissions when the value hasn't changed. Together they reduce API calls on rapid typing.",
            "resources": [
              { "label": "Learn RxJS — debounceTime", "url": "https://www.learnrxjs.io/learn-rxjs/operators/filtering/debouncetime", "type": "docs" }
            ]
          },
          {
            "title": "Combining streams: combineLatest and forkJoin",
            "description": "combineLatest emits whenever any source emits, with the latest values from all sources. forkJoin waits for all Observables to complete and emits their last values — like Promise.all for Observables.",
            "resources": [
              { "label": "RxJS Docs — combineLatest", "url": "https://rxjs.dev/api/index/function/combineLatest", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-5",
    "sideLeft": [
      {
        "title": "Node.js runtime and Express middleware model",
        "children": [
          {
            "title": "Node's non-blocking I/O and why CPU-bound work blocks the event loop",
            "description": "Node's event loop handles I/O callbacks asynchronously, but synchronous CPU-bound code (parsing, encryption) blocks it for all requests. Offload heavy CPU work to worker threads or a separate service.",
            "resources": [
              { "label": "Node.js Docs — Don't Block the Event Loop", "url": "https://nodejs.org/en/guides/dont-block-the-event-loop", "type": "docs" }
            ]
          },
          {
            "title": "Express middleware execution order and error propagation with next()",
            "description": "Express processes middleware in registration order. Calling next() passes to the next handler; next(err) skips to error middleware. Route-specific middleware runs before the route handler.",
            "resources": [
              { "label": "Express Docs — Using Middleware", "url": "https://expressjs.com/en/guide/using-middleware.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "REST API conventions for a MEAN backend",
        "children": [
          {
            "title": "Resource-based URL design and correct HTTP verb semantics",
            "description": "URLs name resources (/tasks/42), not actions. GET reads without side effects, POST creates, PATCH partially updates, DELETE removes. Consistent semantics let Angular's HttpClient cache and retry correctly.",
            "resources": [
              { "label": "MDN — HTTP Methods", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", "type": "docs" }
            ]
          },
          {
            "title": "CORS configuration for Angular consuming an Express API",
            "description": "Angular runs on a different port than Express in development. Configure CORS with the origin set to the Angular dev server URL. In production, restrict it to the deployed frontend domain.",
            "resources": [
              { "label": "cors npm", "url": "https://www.npmjs.com/package/cors", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Structuring and running a MEAN Express API",
        "children": [
          {
            "title": "Router modules, controllers, and the service layer pattern",
            "description": "Keep routes thin: express.Router() handles routing, controller functions orchestrate, service functions contain business logic. This separation makes each layer independently testable.",
            "resources": [
              { "label": "Express Docs — Routing Guide", "url": "https://expressjs.com/en/guide/routing.html", "type": "docs" }
            ]
          },
          {
            "title": "Environment config with dotenv and startup validation",
            "description": "dotenv loads .env into process.env. Validate required variables at startup — fail fast with a clear error rather than a cryptic undefined crash at runtime hours later.",
            "resources": [
              { "label": "dotenv npm", "url": "https://www.npmjs.com/package/dotenv", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Input validation and error handling",
        "children": [
          {
            "title": "express-validator for route-level request body validation",
            "description": "Chain validators on routes: body('title').notEmpty().trim(). Call validationResult(req) and return 422 with the error array. This keeps validation co-located with the route it protects.",
            "resources": [
              { "label": "express-validator Docs", "url": "https://express-validator.github.io/docs/", "type": "docs" }
            ]
          },
          {
            "title": "Centralized error middleware and async error wrappers",
            "description": "Register (err, req, res, next) middleware last. Wrap async handlers in a catchAsync utility to forward rejected Promises to next(err) without try-catch in every route.",
            "resources": [
              { "label": "Express Docs — Error Handling", "url": "https://expressjs.com/en/guide/error-handling.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-6",
    "sideLeft": [
      {
        "title": "MongoDB document model and schema design",
        "children": [
          {
            "title": "Embedding versus referencing: choosing the right data model",
            "description": "Embed subdocuments when they are always read with the parent and are bounded in size (comments on a task). Reference with ObjectId when the related data is large, shared, or queried independently.",
            "resources": [
              { "label": "MongoDB Docs — Data Modeling", "url": "https://www.mongodb.com/docs/manual/data-modeling/", "type": "docs" }
            ]
          },
          {
            "title": "BSON types: ObjectId, Date, and Int64 beyond JSON",
            "description": "MongoDB stores BSON which includes types JSON lacks — ObjectId for IDs, Date for timestamps, Int32/Int64 for integers. ObjectId encodes a 4-byte timestamp, making documents sortable by insertion time.",
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
            "title": "Schema types, validators, required, and default values",
            "description": "Mongoose schemas define shape with type, required, unique, and default. Validation runs before save, giving an application-level data integrity layer on top of MongoDB's schemaless storage.",
            "resources": [
              { "label": "Mongoose Docs — SchemaTypes", "url": "https://mongoosejs.com/docs/schematypes.html", "type": "docs" }
            ]
          },
          {
            "title": "Pre/post hooks for cross-cutting concerns like password hashing",
            "description": "userSchema.pre('save', async function() { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12); }) hashes passwords automatically without callers remembering to do it.",
            "resources": [
              { "label": "Mongoose Docs — Middleware", "url": "https://mongoosejs.com/docs/middleware.html", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "CRUD and querying with Mongoose",
        "children": [
          {
            "title": "Model.find(), findById(), create(), findByIdAndUpdate()",
            "description": "These four methods cover most CRUD operations. findByIdAndUpdate with { new: true, runValidators: true } returns the updated document and runs schema validators. Always handle null returns for findById.",
            "resources": [
              { "label": "Mongoose Docs — Queries", "url": "https://mongoosejs.com/docs/queries.html", "type": "docs" }
            ]
          },
          {
            "title": "Query operators: $in, $gte, $regex, and $or for filtering",
            "description": "Task.find({ status: { $in: ['open', 'in-progress'] }, dueDate: { $lte: new Date() } }) uses MongoDB operators. Mongoose translates these into the MongoDB query language automatically.",
            "resources": [
              { "label": "MongoDB Docs — Query Operators", "url": "https://www.mongodb.com/docs/manual/reference/operator/query/", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Connections, indexes, and population",
        "children": [
          {
            "title": "mongoose.connect with connection event handling",
            "description": "Call mongoose.connect(MONGODB_URI) once at startup and listen for 'connected' and 'error' events. In production, set serverSelectionTimeoutMS and enable retry on failure for resilience.",
            "resources": [
              { "label": "Mongoose Docs — Connections", "url": "https://mongoosejs.com/docs/connections.html", "type": "docs" }
            ]
          },
          {
            "title": "Mongoose populate for resolving ObjectId references",
            "description": "Task.find().populate('assignee', 'name email') replaces the ObjectId with the referenced User document fields. This avoids manual joins while keeping documents normalized.",
            "resources": [
              { "label": "Mongoose Docs — Populate", "url": "https://mongoosejs.com/docs/populate.html", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-7",
    "sideLeft": [
      {
        "title": "Angular HttpClient and reactive HTTP patterns",
        "children": [
          {
            "title": "How HttpClient returns cold Observables for each request",
            "description": "HttpClient.get() returns a cold Observable — it doesn't make the HTTP request until subscribed. Each subscription triggers a new request. Use shareReplay(1) to multicast a single request to multiple subscribers.",
            "resources": [
              { "label": "Angular Docs — HttpClient", "url": "https://angular.dev/guide/http", "type": "docs" }
            ]
          },
          {
            "title": "HTTP interceptors for centralized auth header injection",
            "description": "An HttpInterceptor runs for every request. Implement intercept(req, next) to clone the request with an Authorization header and return next.handle(modifiedReq). Register it as a provider in the app.",
            "resources": [
              { "label": "Angular Docs — Interceptors", "url": "https://angular.dev/guide/http/interceptors", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Error handling in Observable-based HTTP calls",
        "children": [
          {
            "title": "catchError operator: handling HTTP errors in the service layer",
            "description": "pipe(catchError(err => { console.error(err); return throwError(() => err); })) intercepts errors in the Observable stream. Handle 401s globally in an interceptor; handle domain errors in the service.",
            "resources": [
              { "label": "RxJS Docs — catchError", "url": "https://rxjs.dev/api/operators/catchError", "type": "docs" }
            ]
          },
          {
            "title": "Environment-based API URL configuration in Angular",
            "description": "Angular's environment.ts / environment.prod.ts lets you define apiUrl per environment. The CLI swaps files at build time with --configuration production, keeping dev and prod URLs separate without runtime branching.",
            "resources": [
              { "label": "Angular Docs — Environments", "url": "https://angular.dev/tools/cli/environments", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Making typed HTTP calls with Angular HttpClient",
        "children": [
          {
            "title": "Typing HTTP responses with generics: HttpClient.get<Task[]>()",
            "description": "HttpClient methods accept a type parameter: this.http.get<Task[]>('/api/tasks') returns Observable<Task[]>. This gives you full TypeScript inference on the response without manual type assertions.",
            "resources": [
              { "label": "Angular Docs — Typed HTTP", "url": "https://angular.dev/guide/http/making-requests", "type": "docs" }
            ]
          },
          {
            "title": "Loading and error state management with the async pipe",
            "description": "Expose tasks$ = this.taskService.getTasks() and bind with *ngIf='tasks$ | async as tasks; else loading'. The async pipe subscribes, unwraps, and auto-unsubscribes — no manual subscribe or unsubscribe.",
            "resources": [
              { "label": "Angular Docs — AsyncPipe", "url": "https://angular.dev/api/common/AsyncPipe", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "HTTP retries and request cancellation",
        "children": [
          {
            "title": "retryWhen and retry operators for transient API failures",
            "description": "pipe(retry({ count: 3, delay: 1000 })) retries a failed HTTP request up to 3 times with a 1-second delay. Only retry idempotent requests (GET) — retrying a POST could create duplicates.",
            "resources": [
              { "label": "RxJS Docs — retry", "url": "https://rxjs.dev/api/operators/retry", "type": "docs" }
            ]
          },
          {
            "title": "takeUntilDestroyed for automatic unsubscription in Angular 16+",
            "description": "takeUntilDestroyed() automatically completes an Observable when the component is destroyed. It replaces the boilerplate destroy$ Subject / takeUntil pattern and integrates with Angular's DestroyRef.",
            "resources": [
              { "label": "Angular Docs — takeUntilDestroyed", "url": "https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-8",
    "sideLeft": [
      {
        "title": "JWT auth security: token structure and storage",
        "children": [
          {
            "title": "JWT header.payload.signature: what each part contains",
            "description": "The header specifies the algorithm (HS256). The payload holds claims (userId, role, exp). The signature is HMAC of both, using the server secret. Anyone can decode the payload — never put passwords or PII in it.",
            "resources": [
              { "label": "JWT.io — Introduction", "url": "https://jwt.io/introduction", "type": "docs" }
            ]
          },
          {
            "title": "Token storage: why memory > localStorage > HTTP-only cookie trade-offs",
            "description": "Memory (JS variable) is safest from XSS but lost on page refresh. HTTP-only cookies are immune to XSS but vulnerable to CSRF. localStorage is convenient but readable by any JS on the page. Choose based on your threat model.",
            "resources": [
              { "label": "OWASP — HTML5 Security", "url": "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html", "type": "article" }
            ]
          }
        ]
      },
      {
        "title": "Angular route guards for client-side protection",
        "children": [
          {
            "title": "CanActivate guard: redirecting unauthenticated users at the router level",
            "description": "A CanActivate guard checks auth state and returns true to allow navigation or a UrlTree to redirect. Inject the Router to create the redirect: return this.router.createUrlTree(['/login']).",
            "resources": [
              { "label": "Angular Docs — Route Guards", "url": "https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access", "type": "docs" }
            ]
          },
          {
            "title": "CanActivate is client-side only — server routes must always verify tokens",
            "description": "Route guards protect the UI experience but anyone can bypass them with DevTools. Every API endpoint must independently verify the JWT. Never rely solely on the Angular guard to protect data.",
            "resources": [
              { "label": "Angular Docs — Security", "url": "https://angular.dev/best-practices/security", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Implementing JWT auth on the Express backend",
        "children": [
          {
            "title": "Signing and verifying JWTs with jsonwebtoken",
            "description": "jwt.sign({ userId, role }, secret, { expiresIn: '15m' }) creates the token. jwt.verify(token, secret) validates it and returns the payload. Set short expiry on access tokens and use refresh tokens for longevity.",
            "resources": [
              { "label": "jsonwebtoken npm", "url": "https://www.npmjs.com/package/jsonwebtoken", "type": "docs" }
            ]
          },
          {
            "title": "Auth middleware: extract Bearer token and attach user to req",
            "description": "Split Authorization header on ' ', verify the second part, attach decoded payload to req.user, call next(). On verification failure, call next(new UnauthorizedError()) to reach error middleware.",
            "resources": [
              { "label": "Express Docs — Writing Middleware", "url": "https://expressjs.com/en/guide/writing-middleware.html", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Angular auth service and HTTP interceptor",
        "children": [
          {
            "title": "Auth service: storing token, exposing currentUser$, and signOut",
            "description": "Store the access token in a BehaviorSubject<string | null>. Expose isAuthenticated$ as currentUser$.pipe(map(Boolean)). The signOut method sets the subject to null and navigates to /login.",
            "resources": [
              { "label": "Angular Docs — Services", "url": "https://angular.dev/guide/di/creating-injectable-service", "type": "docs" }
            ]
          },
          {
            "title": "JWT interceptor: injecting the Authorization header on every request",
            "description": "In the interceptor's intercept method, read the token from AuthService, clone the request with headers: req.headers.set('Authorization', `Bearer ${token}`), and forward the cloned request.",
            "resources": [
              { "label": "Angular Docs — Interceptors", "url": "https://angular.dev/guide/http/interceptors", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-9",
    "sideLeft": [
      {
        "title": "Angular Reactive Forms internals",
        "children": [
          {
            "title": "FormControl, FormGroup, and FormArray: the form model tree",
            "description": "Reactive Forms represent form state as a tree of AbstractControl objects. FormControl tracks a single input, FormGroup tracks a set of controls, FormArray tracks a dynamic list. The tree mirrors the form's UI hierarchy.",
            "resources": [
              { "label": "Angular Docs — Reactive Forms", "url": "https://angular.dev/guide/forms/reactive-forms", "type": "docs" }
            ]
          },
          {
            "title": "Synchronous and async validators: how validation runs",
            "description": "Synchronous validators run on every value change and return a ValidationErrors object or null. Async validators (debounced API calls) return an Observable or Promise. Status transitions through PENDING while async validators run.",
            "resources": [
              { "label": "Angular Docs — Form Validation", "url": "https://angular.dev/guide/forms/form-validation", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Angular change detection and OnPush strategy",
        "children": [
          {
            "title": "OnPush change detection: only check on new inputs or events",
            "description": "Default change detection checks every component on every browser event. ChangeDetectionStrategy.OnPush only checks the component when an @Input reference changes, an Observable emits, or an event fires inside it. This dramatically reduces checks in large apps.",
            "resources": [
              { "label": "Angular Docs — Change Detection", "url": "https://angular.dev/best-practices/skipping-subtrees", "type": "docs" }
            ]
          },
          {
            "title": "Lazy loading feature modules to reduce the initial bundle",
            "description": "loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) defers loading the module until the route is visited. This reduces the initial bundle size and speeds up first paint.",
            "resources": [
              { "label": "Angular Docs — Lazy Loading", "url": "https://angular.dev/guide/ngmodules/lazy-loading", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Building reactive forms with validation in Angular",
        "children": [
          {
            "title": "FormBuilder service for concise form group creation",
            "description": "Inject FormBuilder and use fb.group({ title: ['', [Validators.required, Validators.maxLength(100)]], dueDate: [''] }) instead of manually constructing FormGroup and FormControl instances.",
            "resources": [
              { "label": "Angular Docs — FormBuilder", "url": "https://angular.dev/api/forms/FormBuilder", "type": "docs" }
            ]
          },
          {
            "title": "Displaying field errors: touched, dirty, and invalid flags",
            "description": "Show errors only when the field is touched (user has left the field) and invalid: *ngIf='form.get(\"title\").touched && form.get(\"title\").invalid'. This avoids showing errors on untouched fields.",
            "resources": [
              { "label": "Angular Docs — Validating Form Input", "url": "https://angular.dev/guide/forms/reactive-forms#validating-form-input", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Dynamic form arrays and state management patterns",
        "children": [
          {
            "title": "FormArray for dynamic subtask lists with add/remove controls",
            "description": "FormArray.push(fb.control('', Validators.required)) adds a new field at runtime. FormArray.removeAt(index) removes one. Iterate with formArray.controls in the template to render each control.",
            "resources": [
              { "label": "Angular Docs — FormArray", "url": "https://angular.dev/api/forms/FormArray", "type": "docs" }
            ]
          },
          {
            "title": "NgRx signals or BehaviorSubject for cross-component state",
            "description": "For state shared across multiple components, a service with a BehaviorSubject is the simplest solution. NgRx is warranted when state mutations become complex enough to need a reducer and action log.",
            "resources": [
              { "label": "NgRx Docs — Overview", "url": "https://ngrx.io/guide/store", "type": "docs" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "mean-10",
    "sideLeft": [
      {
        "title": "Testing Angular applications",
        "children": [
          {
            "title": "TestBed: Angular's testing module for component and service isolation",
            "description": "TestBed.configureTestingModule() creates an isolated Angular module for each test. It compiles components, provides mocks for services, and sets up the DI context without bootstrapping the full app.",
            "resources": [
              { "label": "Angular Docs — Testing", "url": "https://angular.dev/guide/testing", "type": "docs" }
            ]
          },
          {
            "title": "Jasmine spy objects for mocking Angular service dependencies",
            "description": "jasmine.createSpyObj('TaskService', ['getTasks', 'createTask']) creates a mock with spied methods. Use returnValue(of(mockData)) to return an Observable from the spy. This isolates the component from real HTTP calls.",
            "resources": [
              { "label": "Jasmine Docs — Spies", "url": "https://jasmine.github.io/tutorials/your_first_suite", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Deploying MEAN apps to production",
        "children": [
          {
            "title": "Angular production build: ng build and the dist/ output",
            "description": "ng build --configuration production runs the Angular compiler with optimizations: tree-shaking, minification, and Ahead-of-Time (AOT) compilation. The output in dist/ is static HTML/CSS/JS served by any web server.",
            "resources": [
              { "label": "Angular Docs — Deployment", "url": "https://angular.dev/tools/cli/deployment", "type": "docs" }
            ]
          },
          {
            "title": "MongoDB Atlas: managed clusters, IP allowlists, and connection strings",
            "description": "Atlas handles provisioning, backups, and scaling. Allowlist your server's IP (or 0.0.0.0/0 for dynamic IPs). The connection string goes in your Node app's env var — never hard-coded in source.",
            "resources": [
              { "label": "MongoDB Atlas Docs", "url": "https://www.mongodb.com/docs/atlas/", "type": "docs" }
            ]
          }
        ]
      }
    ],
    "sideRight": [
      {
        "title": "Writing Angular unit and integration tests",
        "children": [
          {
            "title": "Testing components: fixture, debugElement, and detectChanges",
            "description": "fixture.detectChanges() triggers Angular's change detection so the template reflects current state. Use fixture.debugElement.query(By.css('.task-list')) to find DOM elements in tests.",
            "resources": [
              { "label": "Angular Docs — Component Testing Scenarios", "url": "https://angular.dev/guide/testing/components-scenarios", "type": "docs" }
            ]
          },
          {
            "title": "HttpClientTestingModule and HttpTestingController for HTTP mocks",
            "description": "Import HttpClientTestingModule and inject HttpTestingController. Call controller.expectOne('/api/tasks') to assert the request was made, then flush mock data to resolve the Observable.",
            "resources": [
              { "label": "Angular Docs — HTTP Testing", "url": "https://angular.dev/guide/http/testing", "type": "docs" }
            ]
          }
        ]
      },
      {
        "title": "Deploying Node and Angular to production",
        "children": [
          {
            "title": "Serving the Angular dist/ from Express as a static SPA",
            "description": "app.use(express.static('dist/app-name')) serves the Angular build. Add a catch-all route: app.get('*', (req, res) => res.sendFile('index.html')) so Angular's router handles all non-API URLs.",
            "resources": [
              { "label": "Express Docs — Serving Static Files", "url": "https://expressjs.com/en/starter/static-files.html", "type": "docs" }
            ]
          },
          {
            "title": "PM2 for Node process management in production",
            "description": "PM2 keeps Node running after crashes, enables zero-downtime reloads (pm2 reload app), and provides log management. Use pm2 ecosystem.config.js to define app name, script path, and environment variables.",
            "resources": [
              { "label": "PM2 Docs", "url": "https://pm2.keymetrics.io/docs/usage/quick-start/", "type": "docs" }
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
