'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(
  __dirname,
  '../src/data/roadmaps/fullstack.json'
);

// ---------------------------------------------------------------------------
// Patch data
// ---------------------------------------------------------------------------
const patches = {
  'laravel-vue-1': {
    sideLeft: [
      {
        title: 'Variables, Types, and Control Flow',
        children: [
          {
            title: 'PHP scalar types and type juggling rules',
            description:
              'PHP supports int, float, string, and bool scalars with loose comparison by default. Understanding strict vs loose typing prevents subtle bugs.',
            resources: [
              {
                label: 'PHP Manual — Types',
                url: 'https://www.php.net/manual/en/language.types.php',
                type: 'docs',
              },
              {
                label: 'PHP Manual — Type juggling',
                url: 'https://www.php.net/manual/en/language.types.type-juggling.php',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Conditionals, loops, and match expressions',
            description:
              'PHP offers if/else, switch, match, for, foreach, and while. The match expression provides strict, exhaustive branching added in PHP 8.',
            resources: [
              {
                label: 'PHP Manual — Control Structures',
                url: 'https://www.php.net/manual/en/language.control-structures.php',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Strict typing declarations and declare(strict_types=1)',
            description:
              'Enabling strict_types forces PHP to enforce declared parameter types, reducing runtime type coercion errors in larger codebases.',
            resources: [
              {
                label: 'PHP Manual — declare',
                url: 'https://www.php.net/manual/en/control-structures.declare.php',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Classes, Interfaces, and Traits',
        children: [
          {
            title: 'OOP principles: encapsulation and inheritance in PHP',
            description:
              'PHP classes support public/protected/private visibility, single inheritance, and abstract classes. These pillars underpin how Laravel is built.',
            resources: [
              {
                label: 'PHP Manual — Classes and Objects',
                url: 'https://www.php.net/manual/en/language.oop5.php',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Interfaces vs abstract classes for contract-based design',
            description:
              'Interfaces define contracts a class must fulfill; abstract classes share partial implementations. Both enable polymorphism and testable code.',
            resources: [
              {
                label: 'PHP Manual — Interfaces',
                url: 'https://www.php.net/manual/en/language.oop5.interfaces.php',
                type: 'docs',
              },
              {
                label: 'PHP Manual — Traits',
                url: 'https://www.php.net/manual/en/language.oop5.traits.php',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Functions, Arrays, and Error Handling',
        children: [
          {
            title: 'Array functions: map, filter, reduce, and sorting',
            description:
              'PHP ships with array_map, array_filter, array_reduce, usort, and many more. Fluent array manipulation reduces looping boilerplate.',
            resources: [
              {
                label: 'PHP Manual — Array Functions',
                url: 'https://www.php.net/manual/en/ref.array.php',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Named arguments and arrow functions in PHP 8',
            description:
              'Named arguments let you pass parameters by name, improving readability. Arrow functions provide concise closures that capture outer scope automatically.',
            resources: [
              {
                label: 'PHP Manual — Named Arguments',
                url: 'https://www.php.net/manual/en/functions.named-arguments.php',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Exception hierarchy and custom exception classes',
            description:
              'PHP exceptions extend Throwable; you can catch specific types with multiple catch blocks. Custom exception classes clarify application error domains.',
            resources: [
              {
                label: 'PHP Manual — Exceptions',
                url: 'https://www.php.net/manual/en/language.exceptions.php',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Composer and Namespaces',
        children: [
          {
            title: 'Composer dependency manager and autoloading PSR-4',
            description:
              'Composer manages PHP packages via composer.json and generates a PSR-4 autoloader. It is the foundation for every modern PHP project including Laravel.',
            resources: [
              {
                label: 'Composer — Getting Started',
                url: 'https://getcomposer.org/doc/00-intro.md',
                type: 'docs',
              },
            ],
          },
          {
            title: 'PHP namespaces for collision-free code organisation',
            description:
              'Namespaces group related classes and prevent naming conflicts across packages. Laravel uses PSR-4 namespaces extensively (App\\, Illuminate\\).',
            resources: [
              {
                label: 'PHP Manual — Namespaces',
                url: 'https://www.php.net/manual/en/language.namespaces.php',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-2': {
    sideLeft: [
      {
        title: 'Laravel Project Structure and Artisan',
        children: [
          {
            title: 'Laravel directory layout and request lifecycle overview',
            description:
              'Laravel follows a conventional directory structure (app/, routes/, resources/). Knowing where each concern lives speeds up every subsequent task.',
            resources: [
              {
                label: 'Laravel Docs — Directory Structure',
                url: 'https://laravel.com/docs/11.x/structure',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Artisan CLI for scaffolding and running commands',
            description:
              'Artisan is Laravel\'s built-in CLI providing code generators (make:controller, make:model) and utilities like php artisan serve and migrate.',
            resources: [
              {
                label: 'Laravel Docs — Artisan Console',
                url: 'https://laravel.com/docs/11.x/artisan',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Environment configuration with .env and config files',
            description:
              'Laravel reads .env for environment-specific values (DB credentials, API keys) and merges them into typed config files accessed via config().',
            resources: [
              {
                label: 'Laravel Docs — Configuration',
                url: 'https://laravel.com/docs/11.x/configuration',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Routing and Controllers',
        children: [
          {
            title: 'Named routes, route groups, and resource controllers',
            description:
              'Laravel routes are defined in routes/web.php and api.php. Resource controllers map CRUD actions to RESTful URL patterns with one command.',
            resources: [
              {
                label: 'Laravel Docs — Routing',
                url: 'https://laravel.com/docs/11.x/routing',
                type: 'docs',
              },
              {
                label: 'Laravel Docs — Controllers',
                url: 'https://laravel.com/docs/11.x/controllers',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Request and response objects in Laravel controllers',
            description:
              'Laravel injects an Illuminate\\Http\\Request containing all input, headers, and files. Returning Response objects or JSON gives full control over output.',
            resources: [
              {
                label: 'Laravel Docs — HTTP Requests',
                url: 'https://laravel.com/docs/11.x/requests',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Blade Templates and Middleware',
        children: [
          {
            title: 'Blade templating: layouts, components, and directives',
            description:
              'Blade compiles to plain PHP and provides @extends, @section, @component, and @foreach directives for building reusable server-side views.',
            resources: [
              {
                label: 'Laravel Docs — Blade Templates',
                url: 'https://laravel.com/docs/11.x/blade',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Blade components and anonymous components for UI reuse',
            description:
              'Blade components encapsulate HTML and PHP logic into reusable tags (x-button). They accept typed attributes and slots for flexible composition.',
            resources: [
              {
                label: 'Laravel Docs — Blade Components',
                url: 'https://laravel.com/docs/11.x/blade#components',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Middleware pipeline for cross-cutting concerns',
            description:
              'Middleware intercepts requests before they reach controllers — useful for auth guards, logging, and CORS. Laravel ships with a rich set of built-in middleware.',
            resources: [
              {
                label: 'Laravel Docs — Middleware',
                url: 'https://laravel.com/docs/11.x/middleware',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Flash Messages and Session Handling',
        children: [
          {
            title: 'Session storage drivers and session helper usage',
            description:
              'Laravel sessions can be stored in files, databases, or Redis. The session() helper and Session facade allow reading/writing across requests.',
            resources: [
              {
                label: 'Laravel Docs — HTTP Session',
                url: 'https://laravel.com/docs/11.x/session',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Flash data and redirects with old input retention',
            description:
              'Flash messages persist for a single request using withErrors() and with(). old() helper repopulates form fields after failed validation.',
            resources: [
              {
                label: 'Laravel Docs — Redirects',
                url: 'https://laravel.com/docs/11.x/responses#redirects',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-3': {
    sideLeft: [
      {
        title: 'Migrations and Eloquent Models',
        children: [
          {
            title: 'Database migrations as version-controlled schema changes',
            description:
              'Migrations define table structure in PHP code and run with php artisan migrate. They keep schema changes in sync across environments and teams.',
            resources: [
              {
                label: 'Laravel Docs — Migrations',
                url: 'https://laravel.com/docs/11.x/migrations',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Eloquent ORM: models, mass assignment, and CRUD',
            description:
              'Eloquent maps database rows to PHP objects. The $fillable guard protects against mass-assignment; create(), find(), update(), and delete() cover all CRUD needs.',
            resources: [
              {
                label: 'Laravel Docs — Eloquent Getting Started',
                url: 'https://laravel.com/docs/11.x/eloquent',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Eloquent relationships: one-to-many and many-to-many',
            description:
              'Relationships (hasMany, belongsTo, belongsToMany) define how models associate. Laravel auto-resolves foreign keys and pivot tables with minimal code.',
            resources: [
              {
                label: 'Laravel Docs — Eloquent Relationships',
                url: 'https://laravel.com/docs/11.x/eloquent-relationships',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Query Builder and Connecting MySQL',
        children: [
          {
            title: 'Fluent query builder for raw and complex queries',
            description:
              'Laravel\'s query builder provides a chainable API (DB::table()->where()->get()) for writing SQL without raw strings, reducing injection risk.',
            resources: [
              {
                label: 'Laravel Docs — Query Builder',
                url: 'https://laravel.com/docs/11.x/queries',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Connecting MySQL with .env and config/database.php',
            description:
              'Database connections are configured in config/database.php pulling from .env. Laravel Sail provides a Docker-powered MySQL setup for local development.',
            resources: [
              {
                label: 'Laravel Docs — Database Getting Started',
                url: 'https://laravel.com/docs/11.x/database',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Seeders and Factories',
        children: [
          {
            title: 'Model factories with Faker for realistic test data',
            description:
              'Factories define how to generate fake model instances using Faker. Running php artisan db:seed populates the database for development and testing.',
            resources: [
              {
                label: 'Laravel Docs — Eloquent Factories',
                url: 'https://laravel.com/docs/11.x/eloquent-factories',
                type: 'docs',
              },
            ],
          },
          {
            title: 'DatabaseSeeder for orchestrating seeder execution order',
            description:
              'DatabaseSeeder calls individual seeder classes in the correct dependency order. Seeders rely on factories to avoid duplicating fake data logic.',
            resources: [
              {
                label: 'Laravel Docs — Seeding',
                url: 'https://laravel.com/docs/11.x/seeding',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Scopes, accessors, and mutators on Eloquent models',
            description:
              'Local scopes chain reusable query constraints; accessors and mutators transform attribute values on get/set, keeping data formatting inside the model.',
            resources: [
              {
                label: 'Laravel Docs — Eloquent Mutators',
                url: 'https://laravel.com/docs/11.x/eloquent-mutators',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Schema Builder and Indexing',
        children: [
          {
            title: 'Schema builder column types, nullable, and defaults',
            description:
              'Blueprint methods (string, integer, timestamps, softDeletes) define columns declaratively. Nullable and default values protect against null constraint errors.',
            resources: [
              {
                label: 'Laravel Docs — Column Types',
                url: 'https://laravel.com/docs/11.x/migrations#available-column-types',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Adding indexes and foreign keys in migrations',
            description:
              'Adding index() and foreign() constraints in migrations enforces data integrity at the database level and improves query performance.',
            resources: [
              {
                label: 'Laravel Docs — Indexes',
                url: 'https://laravel.com/docs/11.x/migrations#creating-indexes',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-4': {
    sideLeft: [
      {
        title: 'Form Requests and Validation Rules',
        children: [
          {
            title: 'Form Request classes for encapsulated validation logic',
            description:
              'Form Requests extend FormRequest and define rules() and authorize(). Laravel auto-validates and redirects back on failure before the controller runs.',
            resources: [
              {
                label: 'Laravel Docs — Form Request Validation',
                url: 'https://laravel.com/docs/11.x/validation#form-request-validation',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Built-in validation rules: required, unique, confirmed',
            description:
              'Laravel ships with 90+ validation rules. Rules like unique:users and confirmed handle common scenarios without writing custom logic.',
            resources: [
              {
                label: 'Laravel Docs — Available Validation Rules',
                url: 'https://laravel.com/docs/11.x/validation#available-validation-rules',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Custom validation rules and rule objects',
            description:
              'Complex validation not covered by built-in rules can be encapsulated in a Rule object implementing passes() and message(), keeping controllers clean.',
            resources: [
              {
                label: 'Laravel Docs — Custom Validation Rules',
                url: 'https://laravel.com/docs/11.x/validation#custom-validation-rules',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Authentication Concepts and Gates',
        children: [
          {
            title: 'Authentication flow: guards, providers, and sessions',
            description:
              'Laravel\'s auth system uses guards (which drive authentication) and providers (which retrieve users). Understanding both makes it easy to add custom auth logic.',
            resources: [
              {
                label: 'Laravel Docs — Authentication',
                url: 'https://laravel.com/docs/11.x/authentication',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Authorization with gates and policies for resource access',
            description:
              'Gates define simple closures for ability checks; Policies group model-level authorization. Both integrate with @can Blade and the can() controller helper.',
            resources: [
              {
                label: 'Laravel Docs — Authorization',
                url: 'https://laravel.com/docs/11.x/authorization',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'CSRF and Breeze Starter Kit',
        children: [
          {
            title: 'CSRF token generation and @csrf Blade directive',
            description:
              'Laravel generates a CSRF token per session. The @csrf Blade directive injects a hidden input; VerifyCsrfToken middleware rejects mismatched tokens automatically.',
            resources: [
              {
                label: 'Laravel Docs — CSRF Protection',
                url: 'https://laravel.com/docs/11.x/csrf',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Laravel Breeze for rapid auth scaffolding',
            description:
              'Breeze generates registration, login, password reset, and email verification views. It is lightweight and exposes all generated code for easy customisation.',
            resources: [
              {
                label: 'Laravel Docs — Laravel Breeze',
                url: 'https://laravel.com/docs/11.x/starter-kits#laravel-breeze',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Password hashing with Bcrypt and Hash facade',
            description:
              'Laravel hashes passwords with Bcrypt via the Hash::make() facade. Hash::check() safely compares plain-text input without exposing stored hashes.',
            resources: [
              {
                label: 'Laravel Docs — Hashing',
                url: 'https://laravel.com/docs/11.x/hashing',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Sessions and Flash Messages in Practice',
        children: [
          {
            title: 'Storing and retrieving typed data from the session',
            description:
              'session()->put() stores any serialisable value; session()->get() retrieves it. Understanding session lifetime and drivers prevents data loss across deployments.',
            resources: [
              {
                label: 'Laravel Docs — Session',
                url: 'https://laravel.com/docs/11.x/session',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Displaying flash and validation errors in Blade views',
            description:
              '$errors MessageBag is auto-shared with every Blade view after failed validation. @error and @if($errors->has()) render targeted, accessible error messages.',
            resources: [
              {
                label: 'Laravel Docs — Displaying Validation Errors',
                url: 'https://laravel.com/docs/11.x/validation#displaying-the-validation-errors',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-5': {
    sideLeft: [
      {
        title: 'Vue 3 Reactivity System',
        children: [
          {
            title: 'ref() and reactive() for declaring reactive state',
            description:
              'ref() wraps primitives in a reactive container; reactive() creates a deep reactive proxy for objects. Choosing between them correctly prevents accidental loss of reactivity.',
            resources: [
              {
                label: 'Vue Docs — Reactivity Fundamentals',
                url: 'https://vuejs.org/guide/essentials/reactivity-fundamentals.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Computed properties for derived reactive values',
            description:
              'computed() memoises derived values, only recalculating when dependencies change. This keeps templates free of complex logic and improves performance.',
            resources: [
              {
                label: 'Vue Docs — Computed Properties',
                url: 'https://vuejs.org/guide/essentials/computed.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Watchers: watch() and watchEffect() for side effects',
            description:
              'watch() tracks a specific source reactively; watchEffect() auto-tracks all dependencies accessed. Both run side effects (API calls, logging) in response to state changes.',
            resources: [
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
        title: 'Components and Composition API',
        children: [
          {
            title: 'Single-File Components and <script setup> syntax',
            description:
              'SFCs combine template, script, and style in one .vue file. The <script setup> sugar eliminates boilerplate and exposes top-level bindings directly to the template.',
            resources: [
              {
                label: 'Vue Docs — Single File Components',
                url: 'https://vuejs.org/guide/scaling-up/sfc.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Composition API lifecycle hooks and composables',
            description:
              'onMounted, onUnmounted, and other hooks replace Options API lifecycle methods. Composables extract and share reusable stateful logic across components.',
            resources: [
              {
                label: 'Vue Docs — Composition API FAQ',
                url: 'https://vuejs.org/guide/extras/composition-api-faq.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Template Syntax and Directives',
        children: [
          {
            title: 'v-bind, v-if, v-for, and v-show directive usage',
            description:
              'Core directives bind attributes (v-bind), conditionally render (v-if/v-show), and repeat elements (v-for). Knowing their differences prevents unnecessary DOM nodes.',
            resources: [
              {
                label: 'Vue Docs — Template Syntax',
                url: 'https://vuejs.org/guide/essentials/template-syntax.html',
                type: 'docs',
              },
              {
                label: 'Vue Docs — List Rendering',
                url: 'https://vuejs.org/guide/essentials/list.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Event handling with v-on and component custom events',
            description:
              'v-on listens to DOM or component events. Components emit custom events with defineEmits; parents handle them with @eventName, decoupling child from parent.',
            resources: [
              {
                label: 'Vue Docs — Event Handling',
                url: 'https://vuejs.org/guide/essentials/event-handling.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'v-model for two-way binding on inputs and components',
            description:
              'v-model binds an input value and listens for changes simultaneously. On components it uses defineModel (Vue 3.4+) or the modelValue/update:modelValue pattern.',
            resources: [
              {
                label: 'Vue Docs — Form Input Bindings',
                url: 'https://vuejs.org/guide/essentials/forms.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Props and Component Communication',
        children: [
          {
            title: 'defineProps with runtime and TypeScript type validation',
            description:
              'Props pass data from parent to child. defineProps() validates type, required status, and defaults at runtime; TypeScript generics add compile-time safety.',
            resources: [
              {
                label: 'Vue Docs — Props',
                url: 'https://vuejs.org/guide/components/props.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Slots and scoped slots for flexible component layout',
            description:
              'Slots inject parent-provided markup into child component templates. Scoped slots expose child data back to the parent for render customisation.',
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
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-6': {
    sideLeft: [
      {
        title: 'API Routes and Resources',
        children: [
          {
            title: 'Defining API routes in routes/api.php with versioning',
            description:
              'API routes are registered in routes/api.php and automatically prefixed with /api. Version prefixes (/api/v1) allow backward-compatible evolution of the contract.',
            resources: [
              {
                label: 'Laravel Docs — API Routing',
                url: 'https://laravel.com/docs/11.x/routing#api-routes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Eloquent API Resources for response transformation',
            description:
              'API Resources transform Eloquent models into JSON responses, decoupling the DB schema from the API contract. ResourceCollection handles paginated lists.',
            resources: [
              {
                label: 'Laravel Docs — Eloquent API Resources',
                url: 'https://laravel.com/docs/11.x/eloquent-resources',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Consistent JSON error responses and exception handler',
            description:
              'Overriding the exception handler\'s render() method ensures all unhandled errors return structured JSON (code, message, errors), not HTML stack traces.',
            resources: [
              {
                label: 'Laravel Docs — Error Handling',
                url: 'https://laravel.com/docs/11.x/errors',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Pagination and Filtering',
        children: [
          {
            title: 'Eloquent paginate() and cursor pagination for large datasets',
            description:
              'paginate() produces offset-based pages; cursorPaginate() is more efficient for large tables. Both return JSON-serialisable objects with metadata links.',
            resources: [
              {
                label: 'Laravel Docs — Pagination',
                url: 'https://laravel.com/docs/11.x/pagination',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Query parameter filtering with Eloquent scopes',
            description:
              'Reading ?filter[name]= from request and passing to local scopes keeps filtering logic inside models rather than cluttering controller methods.',
            resources: [
              {
                label: 'Laravel Docs — Eloquent Scopes',
                url: 'https://laravel.com/docs/11.x/eloquent#query-scopes',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Sanctum Token Auth and Rate Limiting',
        children: [
          {
            title: 'Laravel Sanctum for SPA and API token authentication',
            description:
              'Sanctum issues personal access tokens for mobile/API clients and uses cookie-based sessions for SPAs. It is lighter than Passport and fits most use cases.',
            resources: [
              {
                label: 'Laravel Docs — Sanctum',
                url: 'https://laravel.com/docs/11.x/sanctum',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Rate limiting API routes with throttle middleware',
            description:
              'Laravel\'s RateLimiter facade defines named rate limits applied with the throttle middleware. This protects public APIs from abuse without extra packages.',
            resources: [
              {
                label: 'Laravel Docs — Rate Limiting',
                url: 'https://laravel.com/docs/11.x/routing#rate-limiting',
                type: 'docs',
              },
            ],
          },
          {
            title: 'API versioning strategy: route prefixes vs header negotiation',
            description:
              'Route prefixes (/v1, /v2) are simple and explicit. Header-based versioning (Accept: application/vnd.api+json;v=2) is more RESTful but harder to test in browsers.',
            resources: [
              {
                label: 'MDN — Content Negotiation',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'API Controllers and Testing Tooling',
        children: [
          {
            title: 'Invokable single-action controllers for focused endpoints',
            description:
              'Single-action controllers implement __invoke() and handle exactly one route. They keep each API action in its own class, improving readability and testability.',
            resources: [
              {
                label: 'Laravel Docs — Single Action Controllers',
                url: 'https://laravel.com/docs/11.x/controllers#single-action-controllers',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Testing APIs with Pest and assertJson assertions',
            description:
              'Pest\'s HTTP helpers (getJson, postJson) send test requests and fluent assertJson() assertions verify response shape without brittle string matching.',
            resources: [
              {
                label: 'Pest Docs — HTTP Testing',
                url: 'https://pestphp.com/docs/http-tests',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-7': {
    sideLeft: [
      {
        title: 'State Management with Pinia',
        children: [
          {
            title: 'Defining Pinia stores with state, getters, and actions',
            description:
              'Pinia stores replace Vuex with a simpler API: state holds reactive data, getters derive values, and actions mutate state or call APIs. Stores are tree-shakable.',
            resources: [
              {
                label: 'Pinia Docs — Defining a Store',
                url: 'https://pinia.vuejs.org/core-concepts/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Persisting auth tokens in Pinia with localStorage',
            description:
              'Storing tokens in a Pinia auth store and syncing to localStorage keeps the user logged in across page refreshes without relying on cookies for SPAs.',
            resources: [
              {
                label: 'Pinia Docs — Plugins',
                url: 'https://pinia.vuejs.org/core-concepts/plugins.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Composing multiple Pinia stores and cross-store actions',
            description:
              'Stores can import and call each other\'s actions, creating a clear domain separation (authStore, cartStore). Circular dependencies should be avoided.',
            resources: [
              {
                label: 'Pinia Docs — Composing Stores',
                url: 'https://pinia.vuejs.org/cookbook/composing-stores.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Vue Router for Client-Side Navigation',
        children: [
          {
            title: 'Defining routes, nested routes, and route parameters',
            description:
              'Vue Router maps URL paths to components. Nested routes mirror layout hierarchy; route params (:id) pass dynamic segments accessible via useRoute().',
            resources: [
              {
                label: 'Vue Router Docs — Getting Started',
                url: 'https://router.vuejs.org/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Navigation guards for protecting authenticated routes',
            description:
              'beforeEach guards check auth state before navigation completes. Meta fields (meta: { requiresAuth: true }) on route definitions allow DRY guard logic.',
            resources: [
              {
                label: 'Vue Router Docs — Navigation Guards',
                url: 'https://router.vuejs.org/guide/advanced/navigation-guards.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Axios API Integration',
        children: [
          {
            title: 'Axios instance configuration with base URL and interceptors',
            description:
              'Creating an Axios instance with baseURL and request interceptors that attach the Bearer token centralises API config and prevents duplication across composables.',
            resources: [
              {
                label: 'Axios Docs — Instance Defaults',
                url: 'https://axios-http.com/docs/instance',
                type: 'docs',
              },
              {
                label: 'Axios Docs — Interceptors',
                url: 'https://axios-http.com/docs/interceptors',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Handling Axios errors and 401 responses globally',
            description:
              'Response interceptors catch 401/403 errors and redirect to login or refresh tokens. Centralised handling avoids try/catch boilerplate in every composable.',
            resources: [
              {
                label: 'Axios Docs — Error Handling',
                url: 'https://axios-http.com/docs/handling_errors',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Loading and error state patterns in composables',
            description:
              'Wrapping Axios calls in a composable that exposes isLoading, data, and error refs provides consistent UI feedback and avoids duplicating state across components.',
            resources: [
              {
                label: 'Vue Docs — Composables',
                url: 'https://vuejs.org/guide/reusability/composables.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Protected Routes and Auth Flow',
        children: [
          {
            title: 'Token-based login flow: POST /login, store, redirect',
            description:
              'A login composable posts credentials, stores the returned Sanctum token in Pinia and localStorage, then redirects to the dashboard using Vue Router.',
            resources: [
              {
                label: 'Laravel Docs — Sanctum Token Issuance',
                url: 'https://laravel.com/docs/11.x/sanctum#issuing-mobile-api-tokens',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Lazy-loading route components to reduce initial bundle',
            description:
              'Defining routes with () => import(\'./Page.vue\') splits each page into its own chunk. The browser only downloads the chunk when that route is visited.',
            resources: [
              {
                label: 'Vue Router Docs — Lazy Loading Routes',
                url: 'https://router.vuejs.org/guide/advanced/lazy-loading.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-8': {
    sideLeft: [
      {
        title: 'Queues, Jobs, and Workers',
        children: [
          {
            title: 'Queue system architecture: connections, queues, workers',
            description:
              'Laravel queues defer time-consuming work (email, PDF) to background workers. Connections (database, Redis) define the transport; queues are named channels within a connection.',
            resources: [
              {
                label: 'Laravel Docs — Queues',
                url: 'https://laravel.com/docs/11.x/queues',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Creating and dispatching jobs with delay and chaining',
            description:
              'Jobs implement handle() and are dispatched with dispatch(). Delay defers execution; job chains execute sequentially, stopping on failure.',
            resources: [
              {
                label: 'Laravel Docs — Creating Jobs',
                url: 'https://laravel.com/docs/11.x/queues#creating-jobs',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Failed jobs: logging, retrying, and the failed_jobs table',
            description:
              'Failed jobs are stored in the failed_jobs table. php artisan queue:retry re-runs them; examining the exception column diagnoses production failures without re-triggering.',
            resources: [
              {
                label: 'Laravel Docs — Failed Jobs',
                url: 'https://laravel.com/docs/11.x/queues#dealing-with-failed-jobs',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Events and Listeners',
        children: [
          {
            title: 'Event/listener pattern for decoupled side effects',
            description:
              'Events broadcast that something happened (UserRegistered); listeners react independently (SendWelcomeEmail, ProvisionAccount). This decouples domain logic from side effects.',
            resources: [
              {
                label: 'Laravel Docs — Events',
                url: 'https://laravel.com/docs/11.x/events',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Queued listeners for async event processing',
            description:
              'Implementing ShouldQueue on a listener moves its handle() to a background worker. This prevents a slow email from blocking the HTTP response.',
            resources: [
              {
                label: 'Laravel Docs — Queued Event Listeners',
                url: 'https://laravel.com/docs/11.x/events#queued-event-listeners',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Mailables and Notifications',
        children: [
          {
            title: 'Mailable classes and Markdown email templates',
            description:
              'Mailables extend Mailable and define envelope(), content(), and attachments(). Markdown mail templates use pre-built components (mail::button) styled for email clients.',
            resources: [
              {
                label: 'Laravel Docs — Mail',
                url: 'https://laravel.com/docs/11.x/mail',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Notifications for multi-channel alerts (email, SMS, Slack)',
            description:
              'Notifications decouple the message from the channel. A single OrderShipped notification can deliver via email, Slack, or database with one dispatch call.',
            resources: [
              {
                label: 'Laravel Docs — Notifications',
                url: 'https://laravel.com/docs/11.x/notifications',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Mailtrap and Laravel Mailpit for local email testing',
            description:
              'Mailpit (bundled with Sail) captures outgoing mail in a local inbox. Mailtrap is the cloud equivalent. Both prevent real emails during development and testing.',
            resources: [
              {
                label: 'Laravel Docs — Mail Testing',
                url: 'https://laravel.com/docs/11.x/mail#testing-mailables',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Task Scheduling',
        children: [
          {
            title: 'Defining scheduled commands in the console kernel',
            description:
              'The schedule() method in routes/console.php chains cron expressions (->daily(), ->everyMinute()) onto Artisan commands, closures, or queued jobs.',
            resources: [
              {
                label: 'Laravel Docs — Task Scheduling',
                url: 'https://laravel.com/docs/11.x/scheduling',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Running the scheduler in production with a single cron entry',
            description:
              'A single cron line (php artisan schedule:run every minute) runs all scheduled tasks. This avoids editing crontab per task and keeps scheduling in version control.',
            resources: [
              {
                label: 'Laravel Docs — Running the Scheduler',
                url: 'https://laravel.com/docs/11.x/scheduling#running-the-scheduler',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-9': {
    sideLeft: [
      {
        title: 'Eager Loading and Caching Theory',
        children: [
          {
            title: 'N+1 problem: root cause and detection with Telescope',
            description:
              'N+1 occurs when code loads a collection then queries each item individually. Laravel Telescope highlights N+1 queries in the queries panel during development.',
            resources: [
              {
                label: 'Laravel Docs — Eager Loading',
                url: 'https://laravel.com/docs/11.x/eloquent-relationships#eager-loading',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Eager loading with with() and nested relationship loading',
            description:
              'with(\'author.profile\') instructs Eloquent to load related data in a second batched query instead of N queries. Nested dots load deeply nested relationships.',
            resources: [
              {
                label: 'Laravel Docs — Nested Eager Loading',
                url: 'https://laravel.com/docs/11.x/eloquent-relationships#nested-eager-loading',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Cache-aside pattern for reducing database round trips',
            description:
              'The cache-aside pattern tries the cache first, falling back to the database and storing the result. cache()->remember() implements this in one line in Laravel.',
            resources: [
              {
                label: 'Laravel Docs — Cache',
                url: 'https://laravel.com/docs/11.x/cache',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Service Classes and Repositories',
        children: [
          {
            title: 'Service layer pattern to encapsulate business logic',
            description:
              'Moving domain logic from fat controllers into dedicated Service classes keeps controllers thin, makes business rules unit-testable, and improves code reuse.',
            resources: [
              {
                label: 'Laravel Docs — Service Container',
                url: 'https://laravel.com/docs/11.x/container',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Repository pattern for abstracting database access',
            description:
              'Repositories wrap Eloquent queries behind an interface, making it possible to swap the data source in tests. Laravel\'s service container injects them automatically.',
            resources: [
              {
                label: 'Laravel Docs — Service Providers',
                url: 'https://laravel.com/docs/11.x/providers',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Redis Caching and Database Indexing',
        children: [
          {
            title: 'Configuring Redis as Laravel cache and queue driver',
            description:
              'Setting CACHE_DRIVER=redis and QUEUE_CONNECTION=redis in .env routes cache and queue operations to Redis, dramatically improving throughput over file/database drivers.',
            resources: [
              {
                label: 'Laravel Docs — Redis',
                url: 'https://laravel.com/docs/11.x/redis',
                type: 'docs',
              },
              {
                label: 'Redis Docs — Data Types',
                url: 'https://redis.io/docs/manual/data-types/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Adding composite and covering indexes for query speed',
            description:
              'Composite indexes on frequently filtered column combinations dramatically reduce full-table scans. EXPLAIN ANALYZE reveals missing indexes before they cause production slowdowns.',
            resources: [
              {
                label: 'Laravel Docs — Migration Indexes',
                url: 'https://laravel.com/docs/11.x/migrations#creating-indexes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Profiling queries with Laravel Debugbar and Telescope',
            description:
              'Laravel Debugbar overlays query counts and times on local responses. Telescope records all queries, jobs, and requests in a searchable UI for systematic profiling.',
            resources: [
              {
                label: 'Laravel Docs — Telescope',
                url: 'https://laravel.com/docs/11.x/telescope',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'API Resource Optimisation',
        children: [
          {
            title: 'Conditional relationship loading in API Resources',
            description:
              'whenLoaded() in API Resources omits a relationship key entirely if not eager-loaded. This prevents N+1 inside resources and keeps responses lean.',
            resources: [
              {
                label: 'Laravel Docs — Conditional Relationships',
                url: 'https://laravel.com/docs/11.x/eloquent-resources#conditional-relationships',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Response caching with HTTP cache headers and ETag',
            description:
              'Setting Cache-Control, ETag, and Last-Modified headers allows browsers and CDNs to cache API responses. Laravel\'s response macros simplify header management.',
            resources: [
              {
                label: 'MDN — HTTP Caching',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  'laravel-vue-10': {
    sideLeft: [
      {
        title: 'Testing with Pest and Database Testing',
        children: [
          {
            title: 'Pest feature tests for HTTP endpoints and responses',
            description:
              'Pest\'s it() and test() functions combined with Laravel\'s actingAs() and getJson() enable expressive feature tests that verify the full request/response cycle.',
            resources: [
              {
                label: 'Pest Docs — Writing Tests',
                url: 'https://pestphp.com/docs/writing-tests',
                type: 'docs',
              },
              {
                label: 'Laravel Docs — HTTP Tests',
                url: 'https://laravel.com/docs/11.x/http-tests',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Database testing with RefreshDatabase and factories',
            description:
              'RefreshDatabase wraps each test in a transaction that rolls back, keeping tests isolated. Factories seed the exact state needed without polluting other tests.',
            resources: [
              {
                label: 'Laravel Docs — Database Testing',
                url: 'https://laravel.com/docs/11.x/database-testing',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Unit testing service classes with mocked dependencies',
            description:
              'Unit tests target a single class, swapping Eloquent and external calls with Mockery or Pest\'s mock(). Fast, isolated unit tests catch logic errors before HTTP overhead.',
            resources: [
              {
                label: 'Pest Docs — Mocking',
                url: 'https://pestphp.com/docs/mocking',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Vue Component Testing',
        children: [
          {
            title: 'Testing Vue components with Vitest and Vue Test Utils',
            description:
              'Vitest runs Vue component tests at near-native speed using Vite. Vue Test Utils mount() renders a component into a JSDOM environment for assertions.',
            resources: [
              {
                label: 'Vue Test Utils Docs',
                url: 'https://test-utils.vuejs.org/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Testing user interactions: click, input, and async updates',
            description:
              'trigger(\'click\') and setValue() simulate user actions; await nextTick() waits for Vue reactivity to settle. Assertions on wrapper.text() verify rendered output.',
            resources: [
              {
                label: 'Vue Test Utils — User Interaction',
                url: 'https://test-utils.vuejs.org/guide/advanced/async-behavior.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Docker, Sail, and Production Build',
        children: [
          {
            title: 'Laravel Sail for Docker-powered local development',
            description:
              'Sail wraps docker-compose to provide PHP, MySQL, Redis, and Mailpit with one command. The sail script is a thin wrapper around Docker without requiring global PHP.',
            resources: [
              {
                label: 'Laravel Docs — Laravel Sail',
                url: 'https://laravel.com/docs/11.x/sail',
                type: 'docs',
              },
              {
                label: 'Docker Docs — Getting Started',
                url: 'https://docs.docker.com/get-started/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Writing a production Dockerfile for the Laravel app',
            description:
              'A multi-stage Dockerfile installs Composer dependencies in a build stage and copies only the output to a slim PHP-FPM runtime image, reducing the attack surface.',
            resources: [
              {
                label: 'Docker Docs — Multi-stage Builds',
                url: 'https://docs.docker.com/build/building/multi-stage/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Building Vue for production with Vite and asset optimisation',
            description:
              'npm run build runs Vite\'s production build: code splitting, tree-shaking, and asset hashing. The dist/ output is served as static files via Laravel\'s public/ directory.',
            resources: [
              {
                label: 'Vite Docs — Building for Production',
                url: 'https://vitejs.dev/guide/build.html',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Deploying to Cloud Platforms',
        children: [
          {
            title: 'Deploying Laravel to a VPS: Nginx, PHP-FPM, and queues',
            description:
              'A production VPS runs Nginx as a reverse proxy to PHP-FPM. Supervisor manages the queue worker process, restarting it automatically if it crashes.',
            resources: [
              {
                label: 'Laravel Docs — Deployment',
                url: 'https://laravel.com/docs/11.x/deployment',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Zero-downtime deployment with atomic symlinks or Envoyer',
            description:
              'Atomic symlink deployments swap a current/ symlink after running migrations and caches, preventing downtime. Laravel Envoyer automates this with hooks and rollbacks.',
            resources: [
              {
                label: 'Laravel Docs — Optimising for Production',
                url: 'https://laravel.com/docs/11.x/deployment#optimization',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Apply patches
// ---------------------------------------------------------------------------
const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

const track = data['laravel-vue'];
if (!Array.isArray(track)) {
  console.error('ERROR: laravel-vue track not found in JSON');
  process.exit(1);
}

let applied = 0;
for (const layer of track) {
  const patch = patches[layer.id];
  if (patch) {
    layer.sideLeft = patch.sideLeft;
    layer.sideRight = patch.sideRight;
    applied++;
  }
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches`);
