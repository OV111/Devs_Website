'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'roadmaps', 'fullstack.json');

const patches = {
  'django-react-1': {
    sideLeft: [
      {
        title: "Core Language Concepts",
        children: [
          {
            title: "Variables, Types, and Control Flow",
            description: "Python uses dynamic typing with built-in types like int, str, list, and dict. Control flow is expressed with if/elif/else, for, and while using indentation instead of braces.",
            resources: [
              { label: "Python Docs — Built-in Types", url: "https://docs.python.org/3/library/stdtypes.html", type: "docs" },
              { label: "Python Docs — Control Flow", url: "https://docs.python.org/3/tutorial/controlflow.html", type: "docs" }
            ]
          },
          {
            title: "Functions and Module System",
            description: "Functions are first-class objects in Python, supporting default arguments, *args, and **kwargs. Modules let you split code into reusable files importable with the import statement.",
            resources: [
              { label: "Python Docs — Functions", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions", type: "docs" },
              { label: "Python Docs — Modules", url: "https://docs.python.org/3/tutorial/modules.html", type: "docs" }
            ]
          },
          {
            title: "List Comprehensions and Dict Patterns",
            description: "Comprehensions provide concise syntax for creating lists, sets, and dicts from iterables. They are idiomatic Python and often replace explicit for loops.",
            resources: [
              { label: "Python Docs — List Comprehensions", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Object-Oriented Python and Error Handling",
        children: [
          {
            title: "Classes, Objects, and Inheritance",
            description: "Python classes use __init__ for construction and support single and multiple inheritance. Special dunder methods let you customise behaviour for operators and built-in functions.",
            resources: [
              { label: "Python Docs — Classes", url: "https://docs.python.org/3/tutorial/classes.html", type: "docs" }
            ]
          },
          {
            title: "Exception Handling with try/except",
            description: "Python uses try/except/finally blocks to handle runtime errors gracefully. You can raise custom exceptions by subclassing the built-in Exception class.",
            resources: [
              { label: "Python Docs — Errors and Exceptions", url: "https://docs.python.org/3/tutorial/errors.html", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Environment and Package Management",
        children: [
          {
            title: "Virtual Environments with venv",
            description: "venv creates isolated Python environments so project dependencies do not conflict. Activate the environment before installing packages to keep your global Python clean.",
            resources: [
              { label: "Python Docs — venv", url: "https://docs.python.org/3/library/venv.html", type: "docs" }
            ]
          },
          {
            title: "Installing Packages with pip",
            description: "pip is the standard Python package manager. Use pip install -r requirements.txt to reproduce an environment and pip freeze to capture current dependencies.",
            resources: [
              { label: "pip Documentation", url: "https://pip.pypa.io/en/stable/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Python Tooling",
        children: [
          {
            title: "Interactive REPL and Debugging",
            description: "The Python REPL lets you experiment with code instantly. Use the built-in breakpoint() function or pdb module to step through code and inspect state at runtime.",
            resources: [
              { label: "Python Docs — pdb Debugger", url: "https://docs.python.org/3/library/pdb.html", type: "docs" }
            ]
          },
          {
            title: "Code Style with PEP 8",
            description: "PEP 8 is the official Python style guide covering naming conventions, line length, and whitespace. Tools like flake8 and black automate style checking and formatting.",
            resources: [
              { label: "PEP 8 — Style Guide for Python", url: "https://peps.python.org/pep-0008/", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-2': {
    sideLeft: [
      {
        title: "Django Project Architecture",
        children: [
          {
            title: "Projects vs Apps in Django",
            description: "A Django project is the top-level configuration container; apps are self-contained modules of functionality. Good Django design keeps each app focused on a single domain.",
            resources: [
              { label: "Django Docs — Applications", url: "https://docs.djangoproject.com/en/stable/ref/applications/", type: "docs" }
            ]
          },
          {
            title: "URL Routing and Views",
            description: "Django's URL dispatcher maps URL patterns to view functions or class-based views. Views receive an HttpRequest, perform logic, and return an HttpResponse.",
            resources: [
              { label: "Django Docs — URL Dispatcher", url: "https://docs.djangoproject.com/en/stable/topics/http/urls/", type: "docs" },
              { label: "Django Docs — Views", url: "https://docs.djangoproject.com/en/stable/topics/http/views/", type: "docs" }
            ]
          },
          {
            title: "Request/Response Cycle in Django",
            description: "Every Django request passes through middleware, the URL resolver, and finally a view before returning a response. Understanding this cycle is key to debugging and extending behaviour.",
            resources: [
              { label: "Django Docs — Request and Response Objects", url: "https://docs.djangoproject.com/en/stable/ref/request-response/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Templates and Configuration",
        children: [
          {
            title: "Django Template Language Basics",
            description: "Django's template language uses {{ variables }} and {% tags %} to render dynamic HTML. Template inheritance via {% extends %} and {% block %} promotes code reuse.",
            resources: [
              { label: "Django Docs — Templates", url: "https://docs.djangoproject.com/en/stable/topics/templates/", type: "docs" }
            ]
          },
          {
            title: "Settings and Project Configuration",
            description: "settings.py controls databases, installed apps, middleware, and more. Use environment variables or django-environ to avoid hard-coding secrets.",
            resources: [
              { label: "Django Docs — Settings Reference", url: "https://docs.djangoproject.com/en/stable/ref/settings/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Static Files and Media",
        children: [
          {
            title: "Serving Static Files in Development",
            description: "Django's staticfiles app collects CSS, JS, and images during development. Configure STATIC_URL and STATICFILES_DIRS, then use {% load static %} in templates.",
            resources: [
              { label: "Django Docs — Static Files", url: "https://docs.djangoproject.com/en/stable/howto/static-files/", type: "docs" }
            ]
          },
          {
            title: "Django Admin Interface",
            description: "The Django admin provides an auto-generated CRUD UI for your models. Registering models with admin.site.register and customising ModelAdmin unlocks powerful data management.",
            resources: [
              { label: "Django Docs — Django Admin", url: "https://docs.djangoproject.com/en/stable/ref/contrib/admin/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Development Workflow",
        children: [
          {
            title: "Starting a Project with django-admin",
            description: "django-admin startproject and manage.py startapp scaffold the initial directory structure. Use manage.py runserver for the development server with auto-reload.",
            resources: [
              { label: "Django Docs — django-admin and manage.py", url: "https://docs.djangoproject.com/en/stable/ref/django-admin/", type: "docs" }
            ]
          },
          {
            title: "Middleware and the Django Pipeline",
            description: "Middleware are hooks that process requests before they reach views and responses before they leave. Django ships with middleware for sessions, CSRF, auth, and security headers.",
            resources: [
              { label: "Django Docs — Middleware", url: "https://docs.djangoproject.com/en/stable/topics/http/middleware/", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-3': {
    sideLeft: [
      {
        title: "Models and Relationships",
        children: [
          {
            title: "Defining Models and Field Types",
            description: "A Django model maps to a database table; each field corresponds to a column. Django provides CharField, IntegerField, DateTimeField, and many more with built-in validation.",
            resources: [
              { label: "Django Docs — Models", url: "https://docs.djangoproject.com/en/stable/topics/db/models/", type: "docs" },
              { label: "Django Docs — Model Field Reference", url: "https://docs.djangoproject.com/en/stable/ref/models/fields/", type: "docs" }
            ]
          },
          {
            title: "Relationships: ForeignKey, ManyToMany",
            description: "ForeignKey creates a many-to-one relationship stored as a database foreign key. ManyToManyField uses a join table and lets you query related objects from either side.",
            resources: [
              { label: "Django Docs — Model Relationships", url: "https://docs.djangoproject.com/en/stable/topics/db/examples/", type: "docs" }
            ]
          },
          {
            title: "Aggregations and Annotations",
            description: "Django ORM supports Count, Sum, Avg, and other SQL aggregates via annotate() and aggregate(). They execute in the database rather than Python for maximum performance.",
            resources: [
              { label: "Django Docs — Aggregation", url: "https://docs.djangoproject.com/en/stable/topics/db/aggregation/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "QuerySets and Database Queries",
        children: [
          {
            title: "QuerySet API: filter, exclude, order_by",
            description: "QuerySets are lazy; they only hit the database when evaluated. Chaining filter(), exclude(), and order_by() builds complex queries without writing raw SQL.",
            resources: [
              { label: "Django Docs — QuerySet API Reference", url: "https://docs.djangoproject.com/en/stable/ref/models/querysets/", type: "docs" }
            ]
          },
          {
            title: "Database Migrations Workflow",
            description: "makemigrations generates migration files from model changes; migrate applies them. Always review auto-generated migrations before running them in production.",
            resources: [
              { label: "Django Docs — Migrations", url: "https://docs.djangoproject.com/en/stable/topics/migrations/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "PostgreSQL Integration",
        children: [
          {
            title: "Connecting Django to PostgreSQL",
            description: "Install psycopg2 and set DATABASES in settings.py to use PostgreSQL. Use environment variables for credentials and never commit them to version control.",
            resources: [
              { label: "Django Docs — Databases", url: "https://docs.djangoproject.com/en/stable/ref/databases/", type: "docs" },
              { label: "psycopg2 Documentation", url: "https://www.psycopg.org/docs/", type: "docs" }
            ]
          },
          {
            title: "Raw SQL and Database Functions",
            description: "For complex queries, Django allows raw() and connection.execute(). Database functions like Coalesce, Cast, and Extract let you push logic to the database layer.",
            resources: [
              { label: "Django Docs — Database Functions", url: "https://docs.djangoproject.com/en/stable/ref/models/database-functions/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "ORM Tooling",
        children: [
          {
            title: "Django Shell for ORM Exploration",
            description: "manage.py shell opens a Python REPL with Django pre-configured. Use it to test queries, inspect data, and verify model behaviour before writing view code.",
            resources: [
              { label: "Django Docs — Shell", url: "https://docs.djangoproject.com/en/stable/ref/django-admin/#shell", type: "docs" }
            ]
          },
          {
            title: "django-extensions and Model Diagrams",
            description: "django-extensions adds shell_plus (auto-imports all models) and graph_models (generates entity-relationship diagrams). Both speed up ORM development significantly.",
            resources: [
              { label: "django-extensions Docs", url: "https://django-extensions.readthedocs.io/en/latest/", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-4': {
    sideLeft: [
      {
        title: "DRF Core Concepts",
        children: [
          {
            title: "Serializers and Data Validation",
            description: "DRF serializers convert querysets and model instances to Python dicts for JSON rendering and deserialise incoming data with validation. ModelSerializer auto-generates fields from a model.",
            resources: [
              { label: "DRF Docs — Serializers", url: "https://www.django-rest-framework.org/api-guide/serializers/", type: "docs" }
            ]
          },
          {
            title: "Views, ViewSets, and Generic Views",
            description: "APIView gives full control over HTTP method handling. Generic views like ListCreateAPIView reduce boilerplate for common patterns. ViewSets combine related views into a single class.",
            resources: [
              { label: "DRF Docs — Views", url: "https://www.django-rest-framework.org/api-guide/views/", type: "docs" },
              { label: "DRF Docs — ViewSets", url: "https://www.django-rest-framework.org/api-guide/viewsets/", type: "docs" }
            ]
          },
          {
            title: "Permissions and Authentication Classes",
            description: "DRF separates authentication (who are you?) from permissions (what can you do?). Built-in classes include IsAuthenticated, IsAdminUser, and per-object permission hooks.",
            resources: [
              { label: "DRF Docs — Permissions", url: "https://www.django-rest-framework.org/api-guide/permissions/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "API Design Patterns",
        children: [
          {
            title: "Pagination and Filtering Strategies",
            description: "DRF ships with PageNumberPagination, LimitOffsetPagination, and CursorPagination. django-filter integrates with DRF to add field-level query-param filtering.",
            resources: [
              { label: "DRF Docs — Pagination", url: "https://www.django-rest-framework.org/api-guide/pagination/", type: "docs" },
              { label: "DRF Docs — Filtering", url: "https://www.django-rest-framework.org/api-guide/filtering/", type: "docs" }
            ]
          },
          {
            title: "Throttling and Rate Limiting APIs",
            description: "DRF throttling limits how many requests a user or IP can make in a time window. AnonRateThrottle and UserRateThrottle can be configured globally or per view.",
            resources: [
              { label: "DRF Docs — Throttling", url: "https://www.django-rest-framework.org/api-guide/throttling/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Routing and Browsable API",
        children: [
          {
            title: "Routers and Auto URL Generation",
            description: "DRF Routers automatically generate URL patterns for ViewSets. DefaultRouter adds a browsable API root; SimpleRouter is lighter for production-only APIs.",
            resources: [
              { label: "DRF Docs — Routers", url: "https://www.django-rest-framework.org/api-guide/routers/", type: "docs" }
            ]
          },
          {
            title: "Browsable API for Development",
            description: "The browsable API renders HTML views of your endpoints in a browser, making manual testing fast. It also surfaces serializer validation errors in a readable format.",
            resources: [
              { label: "DRF Docs — Browsable API", url: "https://www.django-rest-framework.org/topics/browsable-api/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "API Documentation Tooling",
        children: [
          {
            title: "Auto-Generating OpenAPI Schemas",
            description: "DRF can generate OpenAPI 3 schemas with the generateschema command. Integrating drf-spectacular gives richer schema output and Swagger/ReDoc UI pages.",
            resources: [
              { label: "DRF Docs — Schema Generation", url: "https://www.django-rest-framework.org/api-guide/schemas/", type: "docs" },
              { label: "drf-spectacular Docs", url: "https://drf-spectacular.readthedocs.io/en/latest/", type: "docs" }
            ]
          },
          {
            title: "Testing DRF Endpoints with APIClient",
            description: "DRF's APIClient extends Django's test client with helpers for JSON requests and authentication. Use it in Django's TestCase or with pytest-django.",
            resources: [
              { label: "DRF Docs — Testing", url: "https://www.django-rest-framework.org/api-guide/testing/", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-5': {
    sideLeft: [
      {
        title: "React Component Model",
        children: [
          {
            title: "Components, Props, and Composition",
            description: "React UIs are trees of components. Props are immutable inputs passed from parent to child; composition lets you build complex UIs from small, focused pieces.",
            resources: [
              { label: "React Docs — Describing the UI", url: "https://react.dev/learn/describing-the-ui", type: "docs" }
            ]
          },
          {
            title: "State Management with useState and useEffect",
            description: "useState gives components local mutable state; useEffect synchronises components with external systems like APIs. Understanding the dependency array prevents stale closures.",
            resources: [
              { label: "React Docs — State: A Component's Memory", url: "https://react.dev/learn/state-a-components-memory", type: "docs" },
              { label: "React Docs — Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects", type: "docs" }
            ]
          },
          {
            title: "Client-Side Routing with React Router",
            description: "React Router maps URL paths to components without full page reloads. BrowserRouter, Routes, and Route form the core; useNavigate and useParams handle programmatic navigation.",
            resources: [
              { label: "React Router Documentation", url: "https://reactrouter.com/home", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Forms and Data Fetching",
        children: [
          {
            title: "Controlled Inputs and Form Handling",
            description: "Controlled components keep form values in React state, making validation and submission straightforward. Uncontrolled inputs via useRef are useful for file inputs and third-party integrations.",
            resources: [
              { label: "React Docs — Reacting to Input with State", url: "https://react.dev/learn/reacting-to-input-with-state", type: "docs" }
            ]
          },
          {
            title: "Fetching API Data with useEffect",
            description: "Calling fetch or Axios inside useEffect is the baseline pattern for loading remote data. Always handle loading and error states to provide a good user experience.",
            resources: [
              { label: "React Docs — You Might Not Need an Effect", url: "https://react.dev/learn/you-might-not-need-an-effect", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Project Structure and Tooling",
        children: [
          {
            title: "Scaffolding with Vite or Create React App",
            description: "Vite provides near-instant dev server startup and HMR via ES modules. It is the recommended choice for new projects over the older Create React App.",
            resources: [
              { label: "Vite Documentation", url: "https://vite.dev/guide/", type: "docs" }
            ]
          },
          {
            title: "Organising a React Codebase",
            description: "Group files by feature rather than type for scalability. Co-locate component, styles, and tests. Use an index.js barrel file per feature to simplify imports.",
            resources: [
              { label: "React Docs — Thinking in React", url: "https://react.dev/learn/thinking-in-react", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Developer Experience",
        children: [
          {
            title: "React DevTools Browser Extension",
            description: "React DevTools lets you inspect the component tree, view props and state, and profile render performance. It is essential for debugging complex component hierarchies.",
            resources: [
              { label: "React DevTools Overview", url: "https://react.dev/learn/react-developer-tools", type: "docs" }
            ]
          },
          {
            title: "ESLint and Prettier for React Projects",
            description: "eslint-plugin-react-hooks enforces the Rules of Hooks and detects missing dependencies. Prettier provides opinionated formatting and integrates with most editors.",
            resources: [
              { label: "eslint-plugin-react-hooks", url: "https://www.npmjs.com/package/eslint-plugin-react-hooks", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-6': {
    sideLeft: [
      {
        title: "Cross-Origin Communication",
        children: [
          {
            title: "CORS Configuration in Django",
            description: "Browsers block cross-origin requests by default. Install django-cors-headers and add CorsMiddleware to allow your React dev server's origin to reach the Django API.",
            resources: [
              { label: "django-cors-headers Docs", url: "https://github.com/adamchainz/django-cors-headers#readme", type: "docs" }
            ]
          },
          {
            title: "CSRF Tokens and API Safety",
            description: "When using session auth, Django requires a CSRF token on unsafe methods. DRF's SessionAuthentication enforces this; JWT-based APIs can disable it for stateless clients.",
            resources: [
              { label: "Django Docs — CSRF", url: "https://docs.djangoproject.com/en/stable/ref/csrf/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Handling Async State in React",
        children: [
          {
            title: "Loading and Error State Patterns",
            description: "Model async data with three states: loading, success, and error. Use useState flags or a unified status enum to drive conditional rendering and spinner/error components.",
            resources: [
              { label: "React Docs — Updating State Based on Previous State", url: "https://react.dev/learn/queueing-a-series-of-state-updates", type: "docs" }
            ]
          },
          {
            title: "Posting and Updating Data to APIs",
            description: "For POST, PUT, and PATCH requests set Content-Type: application/json and send a JSON body. On success, either refetch the list or merge the response into local state.",
            resources: [
              { label: "Axios Docs — Request Config", url: "https://axios-http.com/docs/req_config", type: "docs" }
            ]
          },
          {
            title: "Client-Side Pagination with APIs",
            description: "DRF pagination metadata (count, next, previous) lets the frontend render page controls. Track the current page in state and fetch the corresponding URL on navigation.",
            resources: [
              { label: "DRF Docs — Pagination", url: "https://www.django-rest-framework.org/api-guide/pagination/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Axios HTTP Client",
        children: [
          {
            title: "Creating an Axios Instance with Base URL",
            description: "Centralise API configuration by creating an Axios instance with baseURL and default headers. Export it from a single api.js file imported across your React features.",
            resources: [
              { label: "Axios Docs — Creating an Instance", url: "https://axios-http.com/docs/instance", type: "docs" }
            ]
          },
          {
            title: "Axios Interceptors for Error Handling",
            description: "Request interceptors can attach auth headers automatically; response interceptors can centralise error handling and token refresh logic before errors reach components.",
            resources: [
              { label: "Axios Docs — Interceptors", url: "https://axios-http.com/docs/interceptors", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Environment Configuration",
        children: [
          {
            title: "Environment Variables in Vite and Django",
            description: "Vite exposes variables prefixed with VITE_ via import.meta.env. Django reads from os.environ or a .env file via python-decouple. Never commit .env files to git.",
            resources: [
              { label: "Vite Docs — Env Variables", url: "https://vite.dev/guide/env-and-mode.html", type: "docs" },
              { label: "python-decouple Docs", url: "https://pypi.org/project/python-decouple/", type: "docs" }
            ]
          },
          {
            title: "Proxy Configuration for Local Development",
            description: "Vite's server.proxy setting can forward /api requests to Django during development, eliminating CORS issues entirely in the local environment.",
            resources: [
              { label: "Vite Docs — Server Proxy", url: "https://vite.dev/config/server-options.html#server-proxy", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-7': {
    sideLeft: [
      {
        title: "Token Authentication Concepts",
        children: [
          {
            title: "Token vs JWT Authentication",
            description: "DRF's built-in token auth stores tokens in the database; JWTs are self-contained and stateless. Simple JWT is the most popular library for JWT auth with DRF.",
            resources: [
              { label: "DRF Docs — Token Authentication", url: "https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication", type: "docs" },
              { label: "Simple JWT Docs", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/", type: "docs" }
            ]
          },
          {
            title: "Login and Registration API Endpoints",
            description: "A login endpoint validates credentials and returns a token. Registration creates a user and optionally returns a token for immediate login. Use DRF serializers for validation.",
            resources: [
              { label: "Simple JWT — Getting Tokens", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html", type: "docs" }
            ]
          },
          {
            title: "Protecting API Views with Permissions",
            description: "Set DEFAULT_AUTHENTICATION_CLASSES and DEFAULT_PERMISSION_CLASSES in DRF settings to enforce auth globally. Override per view with authentication_classes and permission_classes attributes.",
            resources: [
              { label: "DRF Docs — Authentication", url: "https://www.django-rest-framework.org/api-guide/authentication/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Token Lifecycle Management",
        children: [
          {
            title: "Access Tokens, Refresh Tokens, and Rotation",
            description: "Short-lived access tokens reduce exposure if stolen. Refresh tokens exchange for new access tokens; Simple JWT supports rotating refresh tokens for added security.",
            resources: [
              { label: "Simple JWT — Rotating Refresh Tokens", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html#rotate-refresh-tokens", type: "docs" }
            ]
          },
          {
            title: "Logout and Token Blacklisting",
            description: "JWTs cannot be invalidated until expiry without a blacklist. Simple JWT's blacklist app stores invalidated refresh tokens in the database to enable true logout.",
            resources: [
              { label: "Simple JWT — Blacklist App", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/blacklist_app.html", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "React Auth Implementation",
        children: [
          {
            title: "Storing Tokens: localStorage vs Cookies",
            description: "localStorage is simple but vulnerable to XSS. HttpOnly cookies protect tokens from JavaScript but require CSRF handling. Choose based on your threat model.",
            resources: [
              { label: "OWASP — HTML5 Security", url: "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html", type: "article" }
            ]
          },
          {
            title: "Auth Context and useContext Hook",
            description: "Wrap the app in an AuthContext provider that stores the current user and token. Components consume the context with useContext to conditionally render or redirect.",
            resources: [
              { label: "React Docs — Passing Data Deeply with Context", url: "https://react.dev/learn/passing-data-deeply-with-context", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Protected Routes and UX",
        children: [
          {
            title: "Protected Route Component Pattern",
            description: "Wrap private routes in a component that checks auth state and redirects to /login if unauthenticated. React Router v6's Outlet makes nested protected layouts clean.",
            resources: [
              { label: "React Router — Auth Examples", url: "https://reactrouter.com/start/framework/routing", type: "docs" }
            ]
          },
          {
            title: "Axios Interceptor for Token Refresh",
            description: "An Axios response interceptor catches 401 errors, calls the refresh endpoint, updates stored tokens, and retries the original request transparently to the calling code.",
            resources: [
              { label: "Axios Docs — Interceptors", url: "https://axios-http.com/docs/interceptors", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-8': {
    sideLeft: [
      {
        title: "Django Performance Patterns",
        children: [
          {
            title: "select_related and prefetch_related",
            description: "select_related reduces N+1 queries for ForeignKey/OneToOne by using SQL JOINs. prefetch_related uses separate queries with Python-side joining, suited for ManyToMany and reverse FK.",
            resources: [
              { label: "Django Docs — select_related", url: "https://docs.djangoproject.com/en/stable/ref/models/querysets/#select-related", type: "docs" },
              { label: "Django Docs — prefetch_related", url: "https://docs.djangoproject.com/en/stable/ref/models/querysets/#prefetch-related", type: "docs" }
            ]
          },
          {
            title: "Django Signals for Decoupled Logic",
            description: "Signals like post_save and pre_delete let you trigger side effects when models change without coupling the model to that logic. Use sparingly to avoid hidden control flow.",
            resources: [
              { label: "Django Docs — Signals", url: "https://docs.djangoproject.com/en/stable/topics/signals/", type: "docs" }
            ]
          },
          {
            title: "Custom Management Commands",
            description: "Subclass BaseCommand in a management/commands/ directory to add manage.py commands. Useful for data migrations, scheduled jobs, and admin utilities.",
            resources: [
              { label: "Django Docs — Custom Management Commands", url: "https://docs.djangoproject.com/en/stable/howto/custom-management-commands/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Background Processing",
        children: [
          {
            title: "Celery Task Queue Architecture",
            description: "Celery offloads time-consuming work (emails, image processing) to background workers. Tasks are functions decorated with @shared_task and dispatched via a message broker.",
            resources: [
              { label: "Celery Docs — First Steps with Django", url: "https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html", type: "docs" }
            ]
          },
          {
            title: "File and Media Upload Handling",
            description: "Django's FileField and ImageField manage uploads via MEDIA_ROOT and MEDIA_URL. Use django-storages for production uploads to S3 or other cloud storage.",
            resources: [
              { label: "Django Docs — Managing Files", url: "https://docs.djangoproject.com/en/stable/topics/files/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Caching with Redis",
        children: [
          {
            title: "Configuring Django Cache with Redis",
            description: "Set CACHES in settings.py to use django-redis as the backend. Cache expensive query results or rendered fragments with cache.set() and cache.get().",
            resources: [
              { label: "Django Docs — Cache Framework", url: "https://docs.djangoproject.com/en/stable/topics/cache/", type: "docs" },
              { label: "django-redis Docs", url: "https://github.com/jazzband/django-redis#readme", type: "docs" }
            ]
          },
          {
            title: "Redis Data Structures and Use Cases",
            description: "Redis lists and sorted sets are ideal for leaderboards and queues. Strings with expiry work for rate limiting and session storage alongside Django's cache framework.",
            resources: [
              { label: "Redis Docs — Data Types", url: "https://redis.io/docs/latest/develop/data-types/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Celery Tooling",
        children: [
          {
            title: "Celery Beat for Periodic Tasks",
            description: "Celery Beat is a scheduler that dispatches tasks on a cron or interval schedule. Store the schedule in the database with django-celery-beat for dynamic configuration.",
            resources: [
              { label: "Celery Docs — Periodic Tasks", url: "https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html", type: "docs" }
            ]
          },
          {
            title: "Monitoring Celery with Flower",
            description: "Flower is a real-time web dashboard for Celery that shows active tasks, worker status, and task history. Run it as a separate process alongside your workers.",
            resources: [
              { label: "Flower Docs", url: "https://flower.readthedocs.io/en/latest/", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-9': {
    sideLeft: [
      {
        title: "Server State Management",
        children: [
          {
            title: "React Query for Server State",
            description: "TanStack Query separates server state from UI state, handling caching, background refetching, and loading/error states automatically. useQuery and useMutation are its core hooks.",
            resources: [
              { label: "TanStack Query Docs — Overview", url: "https://tanstack.com/query/latest/docs/framework/react/overview", type: "docs" }
            ]
          },
          {
            title: "Cache Invalidation and Stale-While-Revalidate",
            description: "Query invalidation with queryClient.invalidateQueries refetches data after mutations. The staleTime option controls how long cached data is considered fresh before background refetching.",
            resources: [
              { label: "TanStack Query Docs — Query Invalidation", url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation", type: "docs" }
            ]
          },
          {
            title: "Optimistic Updates for Instant Feedback",
            description: "Optimistic updates apply changes to the cache immediately and roll back on error. This makes mutations feel instant and improves perceived performance on slow connections.",
            resources: [
              { label: "TanStack Query Docs — Optimistic Updates", url: "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Global State and Forms",
        children: [
          {
            title: "Global State with Zustand or Context",
            description: "For UI state shared across routes (modals, theme, auth), lightweight stores like Zustand avoid Redux boilerplate. Keep global state minimal; prefer React Query for server data.",
            resources: [
              { label: "Zustand Docs", url: "https://zustand.docs.pmnd.rs/getting-started/introduction", type: "docs" }
            ]
          },
          {
            title: "Schema Validation with Zod and React Hook Form",
            description: "React Hook Form minimises re-renders with uncontrolled inputs and a subscription model. Zod provides TypeScript-first schema validation that integrates via the @hookform/resolvers package.",
            resources: [
              { label: "React Hook Form Docs", url: "https://react-hook-form.com/get-started", type: "docs" },
              { label: "Zod Documentation", url: "https://zod.dev/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Accessible UI Patterns",
        children: [
          {
            title: "ARIA Roles and Keyboard Navigation",
            description: "Use semantic HTML first; add ARIA roles only when necessary. Ensure interactive components are keyboard-accessible with visible focus styles and correct tab order.",
            resources: [
              { label: "MDN — ARIA", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA", type: "docs" }
            ]
          },
          {
            title: "Accessible Component Libraries",
            description: "Headless UI libraries like Radix UI and Reach UI provide fully accessible, unstyled primitives for modals, dropdowns, and tooltips. Style them with Tailwind or CSS modules.",
            resources: [
              { label: "Radix UI Docs", url: "https://www.radix-ui.com/primitives/docs/overview/introduction", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Advanced React Patterns",
        children: [
          {
            title: "Code Splitting with React.lazy and Suspense",
            description: "React.lazy() and Suspense enable route-level code splitting, reducing initial bundle size. Vite automatically produces separate chunks for lazy-loaded components.",
            resources: [
              { label: "React Docs — Lazy Loading", url: "https://react.dev/reference/react/lazy", type: "docs" }
            ]
          },
          {
            title: "useMemo and useCallback for Performance",
            description: "useMemo caches expensive computed values; useCallback stabilises function references to prevent unnecessary child re-renders. Profile first with React DevTools before optimising.",
            resources: [
              { label: "React Docs — useMemo", url: "https://react.dev/reference/react/useMemo", type: "docs" }
            ]
          }
        ]
      }
    ]
  },

  'django-react-10': {
    sideLeft: [
      {
        title: "Testing Django and React",
        children: [
          {
            title: "Django Testing with pytest and pytest-django",
            description: "pytest-django provides fixtures like db and client for testing Django views, models, and APIs. Use APIClient for DRF endpoint tests with authentication helpers.",
            resources: [
              { label: "pytest-django Docs", url: "https://pytest-django.readthedocs.io/en/latest/", type: "docs" },
              { label: "pytest Docs", url: "https://docs.pytest.org/en/stable/", type: "docs" }
            ]
          },
          {
            title: "React Component Testing with Vitest",
            description: "Vitest runs in the same Vite pipeline as your app for fast unit and component tests. Use @testing-library/react to render components and assert on what the user sees.",
            resources: [
              { label: "Vitest Documentation", url: "https://vitest.dev/guide/", type: "docs" },
              { label: "Testing Library — React", url: "https://testing-library.com/docs/react-testing-library/intro/", type: "docs" }
            ]
          },
          {
            title: "Mocking API Calls with MSW",
            description: "Mock Service Worker intercepts network requests at the service worker level so tests and Storybook use the same mocks as production code without modifying application code.",
            resources: [
              { label: "MSW Docs", url: "https://mswjs.io/docs/", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Containerization",
        children: [
          {
            title: "Dockerizing Django and React",
            description: "Write a multi-stage Dockerfile for the React build and a separate one for Django/Gunicorn. Use docker-compose to orchestrate the app, database, Redis, and Nginx together.",
            resources: [
              { label: "Docker Docs — Multi-stage Builds", url: "https://docs.docker.com/build/building/multi-stage/", type: "docs" },
              { label: "Docker Compose Docs", url: "https://docs.docker.com/compose/", type: "docs" }
            ]
          },
          {
            title: "Environment Variables and Secrets in Docker",
            description: "Pass secrets via environment variables in docker-compose.yml or .env files. For production, use Docker secrets or a secrets manager like AWS Secrets Manager.",
            resources: [
              { label: "Docker Docs — Environment Variables", url: "https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: "Production Serving",
        children: [
          {
            title: "Gunicorn WSGI Server Configuration",
            description: "Gunicorn is the standard WSGI server for Django in production. Configure worker count (2×CPU+1), worker class, and timeout. Run it behind Nginx, never exposed directly.",
            resources: [
              { label: "Gunicorn Docs — Configuration", url: "https://docs.gunicorn.org/en/stable/configure.html", type: "docs" }
            ]
          },
          {
            title: "Nginx as Reverse Proxy and Static Server",
            description: "Nginx serves collected static files and React build output directly, and proxies /api requests to Gunicorn. This avoids Python touching static file requests entirely.",
            resources: [
              { label: "Nginx Beginner's Guide", url: "https://nginx.org/en/docs/beginners_guide.html", type: "docs" }
            ]
          }
        ]
      },
      {
        title: "Cloud Deployment",
        children: [
          {
            title: "collectstatic and WhiteNoise for Static Files",
            description: "Run manage.py collectstatic before deployment to gather all static files. WhiteNoise lets Django serve compressed static files without a dedicated CDN, simplifying deployment.",
            resources: [
              { label: "Django Docs — collectstatic", url: "https://docs.djangoproject.com/en/stable/ref/contrib/staticfiles/#collectstatic", type: "docs" },
              { label: "WhiteNoise Docs", url: "https://whitenoise.readthedocs.io/en/latest/", type: "docs" }
            ]
          },
          {
            title: "Deploying to a Cloud Platform",
            description: "Platforms like Railway, Render, and Fly.io can deploy a Docker Compose stack with minimal configuration. For AWS, use ECS with RDS and ElastiCache for a scalable setup.",
            resources: [
              { label: "Render Docs — Docker Deploy", url: "https://render.com/docs/docker", type: "docs" },
              { label: "AWS ECS Getting Started", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started.html", type: "docs" }
            ]
          }
        ]
      }
    ]
  }
};

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const track = data['django-react'];
if (!Array.isArray(track)) {
  console.error('django-react track not found');
  process.exit(1);
}

let count = 0;
for (const layer of track) {
  const patch = patches[layer.id];
  if (patch) {
    layer.sideLeft = patch.sideLeft;
    layer.sideRight = patch.sideRight;
    count++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${count} patches`);
