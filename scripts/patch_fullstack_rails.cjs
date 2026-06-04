'use strict';
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/roadmaps/fullstack.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const patches = {
  'rails-dev-1': {
    sideLeft: [
      {
        title: 'Core Ruby Language Concepts',
        children: [
          {
            title: 'Variables, methods, and blocks in Ruby',
            description: 'Ruby uses dynamic typing with local, instance, class, and global variables. Blocks are anonymous closures passed to methods using do...end or curly braces.',
            resources: [
              { label: 'Ruby-Doc: Core — Proc and Block', url: 'https://ruby-doc.org/core/Proc.html', type: 'docs' },
              { label: 'Ruby Language Official Docs', url: 'https://www.ruby-lang.org/en/documentation/', type: 'docs' }
            ]
          },
          {
            title: 'Arrays, hashes, and Enumerable module',
            description: 'Ruby arrays and hashes are first-class objects with rich APIs. The Enumerable module provides map, select, reduce, and dozens of iteration helpers.',
            resources: [
              { label: 'Ruby-Doc: Enumerable', url: 'https://ruby-doc.org/core/Enumerable.html', type: 'docs' },
              { label: 'Ruby-Doc: Hash', url: 'https://ruby-doc.org/core/Hash.html', type: 'docs' }
            ]
          },
          {
            title: 'Symbols, ranges, and exception handling',
            description: 'Symbols are immutable identifiers commonly used as hash keys. Ranges represent sequences and Ruby uses begin/rescue/ensure for structured exception handling.',
            resources: [
              { label: 'Ruby-Doc: Symbol', url: 'https://ruby-doc.org/core/Symbol.html', type: 'docs' },
              { label: 'Ruby-Doc: Range', url: 'https://ruby-doc.org/core/Range.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Object-Oriented Ruby',
        children: [
          {
            title: 'Classes, modules, and mixins pattern',
            description: 'Ruby classes support single inheritance while modules enable mixin behavior, allowing shared methods across unrelated class hierarchies without duplication.',
            resources: [
              { label: 'Ruby-Doc: Module', url: 'https://ruby-doc.org/core/Module.html', type: 'docs' },
              { label: 'Ruby-Doc: Class', url: 'https://ruby-doc.org/core/Class.html', type: 'docs' }
            ]
          },
          {
            title: 'Gems and Bundler dependency management',
            description: 'RubyGems is the package manager for Ruby libraries. Bundler manages gem dependencies via a Gemfile, ensuring consistent environments across machines.',
            resources: [
              { label: 'RubyGems.org — Getting Started', url: 'https://rubygems.org/pages/download', type: 'docs' },
              { label: 'Bundler.io Official Docs', url: 'https://bundler.io/docs.html', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Ruby Tooling and Environment',
        children: [
          {
            title: 'Installing Ruby with rbenv or RVM',
            description: 'rbenv and RVM are version managers that let you install and switch between multiple Ruby versions per project, preventing conflicts between applications.',
            resources: [
              { label: 'rbenv GitHub Repository', url: 'https://github.com/rbenv/rbenv', type: 'docs' },
              { label: 'RVM Official Site', url: 'https://rvm.io/', type: 'docs' }
            ]
          },
          {
            title: 'IRB interactive Ruby shell usage',
            description: 'IRB (Interactive Ruby) is the built-in REPL for experimenting with Ruby expressions, testing methods, and debugging code snippets quickly.',
            resources: [
              { label: 'Ruby-Doc: IRB', url: 'https://ruby-doc.org/stdlib/libdoc/irb/rdoc/IRB.html', type: 'docs' },
              { label: 'Ruby Official Getting Started', url: 'https://www.ruby-lang.org/en/documentation/quickstart/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Practical Ruby Patterns',
        children: [
          {
            title: 'Writing idiomatic Ruby with style guides',
            description: 'The RuboCop style guide enforces community-standard Ruby idioms. Following conventions like method naming, block usage, and guard clauses improves readability.',
            resources: [
              { label: 'RuboCop Ruby Style Guide', url: 'https://rubystyle.guide/', type: 'docs' },
              { label: 'RuboCop GitHub Repository', url: 'https://github.com/rubocop/rubocop', type: 'docs' }
            ]
          },
          {
            title: 'Debugging Ruby code with Pry and byebug',
            description: 'Pry is a powerful IRB alternative with syntax highlighting and introspection. byebug provides step-through debugging with breakpoints in any Ruby application.',
            resources: [
              { label: 'Pry GitHub Repository', url: 'https://github.com/pry/pry', type: 'docs' },
              { label: 'byebug GitHub Repository', url: 'https://github.com/deivid-rodriguez/byebug', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-2': {
    sideLeft: [
      {
        title: 'MVC Architecture and Rails Philosophy',
        children: [
          {
            title: 'Model-View-Controller pattern in Rails',
            description: 'Rails strictly enforces MVC separation: models handle data logic, controllers handle request flow, and views render HTML responses. This structure makes large codebases maintainable.',
            resources: [
              { label: 'Rails Guides: Getting Started with Rails', url: 'https://guides.rubyonrails.org/getting_started.html', type: 'docs' },
              { label: 'Rails Guides: Action Controller Overview', url: 'https://guides.rubyonrails.org/action_controller_overview.html', type: 'docs' }
            ]
          },
          {
            title: 'Convention over configuration Rails principle',
            description: 'Rails minimizes configuration by assuming sensible defaults. Naming conventions for files, classes, and database tables eliminate repetitive boilerplate setup code.',
            resources: [
              { label: 'Rails Guides: Rails Core Concepts', url: 'https://guides.rubyonrails.org/getting_started.html#what-is-rails-questionmark', type: 'docs' },
              { label: 'Rails API: Rails::Application', url: 'https://api.rubyonrails.org/classes/Rails/Application.html', type: 'docs' }
            ]
          },
          {
            title: 'Rails project directory structure overview',
            description: 'A Rails app is organized into app/, config/, db/, and lib/ directories. Understanding this layout helps you locate models, routes, views, and configuration quickly.',
            resources: [
              { label: 'Rails Guides: Directory Structure', url: 'https://guides.rubyonrails.org/getting_started.html#creating-the-blog-application', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Routing and Request Handling',
        children: [
          {
            title: 'Routes, controllers, and resourceful routing',
            description: 'config/routes.rb maps HTTP verbs and URLs to controller actions. RESTful resources routing generates the seven standard actions automatically with one declaration.',
            resources: [
              { label: 'Rails Guides: Routing from the Outside In', url: 'https://guides.rubyonrails.org/routing.html', type: 'docs' },
              { label: 'Rails API: ActionDispatch::Routing', url: 'https://api.rubyonrails.org/classes/ActionDispatch/Routing.html', type: 'docs' }
            ]
          },
          {
            title: 'Rails generators and scaffolding workflow',
            description: 'Rails generators automate creating models, controllers, views, and migrations. Scaffolding produces a full CRUD interface so you can prototype features rapidly.',
            resources: [
              { label: 'Rails Guides: Command Line — Generators', url: 'https://guides.rubyonrails.org/command_line.html#bin-rails-generate', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Rails Development Tools',
        children: [
          {
            title: 'Rails console for live app exploration',
            description: 'bin/rails console opens an IRB session with your full Rails environment loaded, allowing you to query the database, test methods, and inspect objects interactively.',
            resources: [
              { label: 'Rails Guides: Rails Console', url: 'https://guides.rubyonrails.org/command_line.html#bin-rails-console', type: 'docs' }
            ]
          },
          {
            title: 'Development server and request logging',
            description: 'bin/rails server starts the Puma web server locally. Rails logs every request with SQL queries and timing to help you trace issues during development.',
            resources: [
              { label: 'Rails Guides: Command Line Basics', url: 'https://guides.rubyonrails.org/command_line.html', type: 'docs' },
              { label: 'Puma Web Server GitHub', url: 'https://github.com/puma/puma', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Views and Template Rendering',
        children: [
          {
            title: 'ERB templates and layout inheritance',
            description: 'Rails uses ERB (Embedded Ruby) for HTML templates. Layouts define the shared structure and individual view templates are yielded inside them per action.',
            resources: [
              { label: 'Rails Guides: Layouts and Rendering', url: 'https://guides.rubyonrails.org/layouts_and_rendering.html', type: 'docs' },
              { label: 'Rails API: ActionView::Base', url: 'https://api.rubyonrails.org/classes/ActionView/Base.html', type: 'docs' }
            ]
          },
          {
            title: 'Flash messages and redirect patterns',
            description: 'Flash is a session-based mechanism for passing short messages between requests, typically used to show success or error notices after form submissions and redirects.',
            resources: [
              { label: 'Rails Guides: Flash Messages', url: 'https://guides.rubyonrails.org/action_controller_overview.html#the-flash', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-3': {
    sideLeft: [
      {
        title: 'Active Record Fundamentals',
        children: [
          {
            title: 'Models, migrations, and schema evolution',
            description: 'Active Record models map to database tables automatically by name convention. Migrations are Ruby classes that incrementally alter the schema in a version-controlled way.',
            resources: [
              { label: 'Rails Guides: Active Record Basics', url: 'https://guides.rubyonrails.org/active_record_basics.html', type: 'docs' },
              { label: 'Rails Guides: Active Record Migrations', url: 'https://guides.rubyonrails.org/active_record_migrations.html', type: 'docs' }
            ]
          },
          {
            title: 'Active Record associations and relationships',
            description: 'belongs_to, has_many, has_one, and has_many :through declare relationships between models. Rails auto-generates join queries and association helper methods.',
            resources: [
              { label: 'Rails Guides: Active Record Associations', url: 'https://guides.rubyonrails.org/association_basics.html', type: 'docs' },
              { label: 'Rails API: ActiveRecord::Associations', url: 'https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html', type: 'docs' }
            ]
          },
          {
            title: 'Model validations for data integrity',
            description: 'Active Record validations run before saving records, ensuring data meets requirements like presence, uniqueness, format, and custom conditions.',
            resources: [
              { label: 'Rails Guides: Active Record Validations', url: 'https://guides.rubyonrails.org/active_record_validations.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Querying and Database Patterns',
        children: [
          {
            title: 'Query interface and named scopes',
            description: 'Active Record provides a chainable query DSL: where, order, limit, joins, and includes. Named scopes encapsulate reusable query conditions as class methods.',
            resources: [
              { label: 'Rails Guides: Active Record Query Interface', url: 'https://guides.rubyonrails.org/active_record_querying.html', type: 'docs' },
              { label: 'Rails API: ActiveRecord::QueryMethods', url: 'https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html', type: 'docs' }
            ]
          },
          {
            title: 'CRUD operations with Active Record',
            description: 'Active Record provides create, read, update, and delete operations through methods like new, save, find, update, and destroy with automatic SQL generation.',
            resources: [
              { label: 'Rails Guides: CRUD with Active Record', url: 'https://guides.rubyonrails.org/active_record_basics.html#crud-reading-and-writing-data', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Database Configuration',
        children: [
          {
            title: 'Switching SQLite to PostgreSQL in Rails',
            description: 'Production Rails apps typically use PostgreSQL for its robustness and features. Switching requires updating the Gemfile, database.yml, and providing a connection string.',
            resources: [
              { label: 'Rails Guides: Configuring Databases', url: 'https://guides.rubyonrails.org/configuring.html#configuring-a-database', type: 'docs' },
              { label: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', type: 'docs' }
            ]
          },
          {
            title: 'Database seeds and test data setup',
            description: 'db/seeds.rb provides a standard location for populating the database with initial or sample data using Active Record create calls.',
            resources: [
              { label: 'Rails Guides: Seeding the Database', url: 'https://guides.rubyonrails.org/active_record_migrations.html#migrations-and-seed-data', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Active Record Tooling',
        children: [
          {
            title: 'Database console and schema inspection',
            description: 'bin/rails dbconsole opens the native database CLI. db/schema.rb is the authoritative source for current table structure generated from migrations.',
            resources: [
              { label: 'Rails Guides: Command Line dbconsole', url: 'https://guides.rubyonrails.org/command_line.html#bin-rails-dbconsole', type: 'docs' }
            ]
          },
          {
            title: 'Using PgHero and Bullet for query analysis',
            description: 'Bullet detects N+1 queries and missing eager loading during development. PgHero provides a web dashboard for inspecting PostgreSQL query performance and index usage.',
            resources: [
              { label: 'Bullet GitHub Repository', url: 'https://github.com/flyerhzm/bullet', type: 'docs' },
              { label: 'PgHero GitHub Repository', url: 'https://github.com/ankane/pghero', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-4': {
    sideLeft: [
      {
        title: 'Template and Layout Architecture',
        children: [
          {
            title: 'ERB syntax and view rendering lifecycle',
            description: 'ERB embeds Ruby expressions inside HTML using <%= %> and <% %>. Rails renders the action template first, then wraps it in the application layout via yield.',
            resources: [
              { label: 'Rails Guides: Action View Overview', url: 'https://guides.rubyonrails.org/action_view_overview.html', type: 'docs' },
              { label: 'Rails API: ERB Template', url: 'https://api.rubyonrails.org/classes/ActionView/Template.html', type: 'docs' }
            ]
          },
          {
            title: 'Partials and view helpers for reuse',
            description: 'Partials are reusable view fragments prefixed with underscore. Helper methods defined in app/helpers/ extract view logic into testable Ruby methods.',
            resources: [
              { label: 'Rails Guides: Partials', url: 'https://guides.rubyonrails.org/layouts_and_rendering.html#using-partials', type: 'docs' },
              { label: 'Rails Guides: Action View Helpers', url: 'https://guides.rubyonrails.org/action_view_helpers.html', type: 'docs' }
            ]
          },
          {
            title: 'Flash messages and user feedback patterns',
            description: 'Flash notices and alerts provide one-request messages after redirects. Rendering them in the layout ensures they appear after any form submission.',
            resources: [
              { label: 'Rails Guides: Flash Messages', url: 'https://guides.rubyonrails.org/action_controller_overview.html#the-flash', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Forms and Parameters',
        children: [
          {
            title: 'Form helpers and strong parameters security',
            description: 'form_with generates secure HTML forms tied to model objects. Strong parameters require explicit permit declarations to prevent mass assignment vulnerabilities.',
            resources: [
              { label: 'Rails Guides: Action View Form Helpers', url: 'https://guides.rubyonrails.org/form_helpers.html', type: 'docs' },
              { label: 'Rails Guides: Strong Parameters', url: 'https://guides.rubyonrails.org/action_controller_overview.html#strong-parameters', type: 'docs' }
            ]
          },
          {
            title: 'Nested forms and complex data submission',
            description: 'accepts_nested_attributes_for allows forms to create or update associated models in one submission. fields_for renders nested form fields for the association.',
            resources: [
              { label: 'Rails Guides: Nested Forms', url: 'https://guides.rubyonrails.org/form_helpers.html#nested-forms', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Asset Management',
        children: [
          {
            title: 'Rails asset pipeline with Sprockets',
            description: 'The asset pipeline concatenates, minifies, and fingerprints CSS, JavaScript, and image files. Sprockets handles dependency resolution and cache-busting digests.',
            resources: [
              { label: 'Rails Guides: The Asset Pipeline', url: 'https://guides.rubyonrails.org/asset_pipeline.html', type: 'docs' },
              { label: 'Sprockets GitHub Repository', url: 'https://github.com/rails/sprockets', type: 'docs' }
            ]
          },
          {
            title: 'Importing CSS with cssbundling-rails',
            description: 'cssbundling-rails integrates Sass, Tailwind CSS, or PostCSS into the asset pipeline. It runs a Node.js build step and outputs to app/assets/builds.',
            resources: [
              { label: 'cssbundling-rails GitHub', url: 'https://github.com/rails/cssbundling-rails', type: 'docs' },
              { label: 'Tailwind CSS with Rails Guide', url: 'https://guides.rubyonrails.org/working_with_javascript_in_rails.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Frontend Integration',
        children: [
          {
            title: 'importmap-rails for JavaScript modules',
            description: 'importmap-rails uses browser-native import maps to load JavaScript modules without a bundler. It pins gems and npm packages directly to CDN or local paths.',
            resources: [
              { label: 'importmap-rails GitHub', url: 'https://github.com/rails/importmap-rails', type: 'docs' }
            ]
          },
          {
            title: 'jsbundling-rails with esbuild or webpack',
            description: 'jsbundling-rails adds a JavaScript bundling step for projects needing npm packages. esbuild is the fastest option while webpack offers the most configuration.',
            resources: [
              { label: 'jsbundling-rails GitHub', url: 'https://github.com/rails/jsbundling-rails', type: 'docs' },
              { label: 'esbuild Official Docs', url: 'https://esbuild.github.io/', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-5': {
    sideLeft: [
      {
        title: 'Authentication Concepts',
        children: [
          {
            title: 'Sessions, cookies, and stateful authentication',
            description: 'Rails sessions store a signed, encrypted cookie on the client. The session hash persists data between requests, enabling login state without re-authentication each time.',
            resources: [
              { label: 'Rails Guides: Sessions', url: 'https://guides.rubyonrails.org/action_controller_overview.html#session', type: 'docs' },
              { label: 'Rails Guides: Cookies', url: 'https://guides.rubyonrails.org/action_controller_overview.html#cookies', type: 'docs' }
            ]
          },
          {
            title: 'Password hashing with bcrypt security',
            description: 'bcrypt is an adaptive hashing algorithm resistant to brute-force attacks. Rails has_secure_password uses bcrypt to hash passwords automatically before storage.',
            resources: [
              { label: 'Rails API: has_secure_password', url: 'https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html', type: 'docs' },
              { label: 'bcrypt-ruby GitHub', url: 'https://github.com/bcrypt-ruby/bcrypt-ruby', type: 'docs' }
            ]
          },
          {
            title: 'Authorization roles and permissions design',
            description: 'Authorization determines what authenticated users can do. Role-based access control assigns permissions to roles like admin and user, checked before sensitive actions.',
            resources: [
              { label: 'Pundit GitHub Repository', url: 'https://github.com/varvet/pundit', type: 'docs' },
              { label: 'Rails Guides: Security Guide', url: 'https://guides.rubyonrails.org/security.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Authentication Patterns',
        children: [
          {
            title: 'User signup, login, and logout flow',
            description: 'A typical Rails auth flow creates a user on signup, verifies credentials on login, stores the user ID in session, and destroys the session on logout.',
            resources: [
              { label: 'Rails Guides: Getting Started Authentication', url: 'https://guides.rubyonrails.org/getting_started.html#adding-some-validation', type: 'docs' }
            ]
          },
          {
            title: 'Protecting controller actions with before_action',
            description: 'before_action filters run before controller actions to enforce authentication. Redirecting unauthenticated users and halting the action prevents unauthorized access.',
            resources: [
              { label: 'Rails Guides: Filters', url: 'https://guides.rubyonrails.org/action_controller_overview.html#filters', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Authentication Libraries',
        children: [
          {
            title: 'Devise gem for full-featured authentication',
            description: 'Devise is a modular authentication solution providing sign-up, sign-in, password reset, email confirmation, and session timeout out of the box.',
            resources: [
              { label: 'Devise GitHub Repository', url: 'https://github.com/heartcombo/devise', type: 'docs' },
              { label: 'Devise Wiki', url: 'https://github.com/heartcombo/devise/wiki', type: 'docs' }
            ]
          },
          {
            title: 'OmniAuth for third-party OAuth providers',
            description: 'OmniAuth provides a standardized interface for OAuth2 with providers like Google, GitHub, and Facebook. Devise integrates via the devise-omniauth strategy.',
            resources: [
              { label: 'OmniAuth GitHub Repository', url: 'https://github.com/omniauth/omniauth', type: 'docs' },
              { label: 'omniauth-google-oauth2 GitHub', url: 'https://github.com/zquestz/omniauth-google-oauth2', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Authorization Libraries',
        children: [
          {
            title: 'Pundit policy objects for authorization',
            description: 'Pundit uses plain Ruby policy classes to define authorization rules per model. Controllers call authorize to check policies, keeping logic out of controllers.',
            resources: [
              { label: 'Pundit GitHub Repository', url: 'https://github.com/varvet/pundit', type: 'docs' }
            ]
          },
          {
            title: 'CanCanCan ability-based authorization',
            description: 'CanCanCan defines all permissions in a single Ability class using can and cannot rules. load_and_authorize_resource auto-loads and checks permissions for REST actions.',
            resources: [
              { label: 'CanCanCan GitHub Repository', url: 'https://github.com/CanCanCommunity/cancancan', type: 'docs' },
              { label: 'CanCanCan Wiki', url: 'https://github.com/CanCanCommunity/cancancan/wiki', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-6': {
    sideLeft: [
      {
        title: 'Hotwire Architecture Concepts',
        children: [
          {
            title: 'Turbo Drive for fast page navigation',
            description: 'Turbo Drive intercepts link clicks and form submissions, replacing only the page body over fetch requests. This eliminates full page reloads for a SPA-like feel.',
            resources: [
              { label: 'Turbo Handbook: Drive', url: 'https://turbo.hotwired.dev/handbook/drive', type: 'docs' },
              { label: 'Hotwire Official Site', url: 'https://hotwired.dev/', type: 'docs' }
            ]
          },
          {
            title: 'Turbo Frames for partial page updates',
            description: 'Turbo Frames wrap page sections so only that section updates on navigation. This enables tab switching, inline editing, and pagination without JavaScript.',
            resources: [
              { label: 'Turbo Handbook: Frames', url: 'https://turbo.hotwired.dev/handbook/frames', type: 'docs' },
              { label: 'Turbo Reference: Frame Element', url: 'https://turbo.hotwired.dev/reference/frames', type: 'docs' }
            ]
          },
          {
            title: 'Turbo Streams for server-pushed DOM updates',
            description: 'Turbo Streams deliver CRUD actions (append, prepend, replace, remove) from the server via HTTP responses or WebSocket broadcasts, updating multiple page targets.',
            resources: [
              { label: 'Turbo Handbook: Streams', url: 'https://turbo.hotwired.dev/handbook/streams', type: 'docs' },
              { label: 'Turbo Reference: Stream Actions', url: 'https://turbo.hotwired.dev/reference/streams', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Stimulus and Progressive Enhancement',
        children: [
          {
            title: 'Stimulus controllers and data attributes',
            description: 'Stimulus connects JavaScript controller classes to HTML elements via data-controller attributes. It adds behavior progressively without replacing server-rendered HTML.',
            resources: [
              { label: 'Stimulus Handbook: Hello Stimulus', url: 'https://stimulus.hotwired.dev/handbook/hello-stimulus', type: 'docs' },
              { label: 'Stimulus Reference: Controllers', url: 'https://stimulus.hotwired.dev/reference/controllers', type: 'docs' }
            ]
          },
          {
            title: 'Real-time features with Action Cable WebSockets',
            description: 'Action Cable integrates WebSockets into Rails using channels. Turbo Streams over Action Cable enables live broadcasting of DOM updates to multiple connected clients.',
            resources: [
              { label: 'Rails Guides: Action Cable Overview', url: 'https://guides.rubyonrails.org/action_cable_overview.html', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Hotwire Setup and Tooling',
        children: [
          {
            title: 'Installing Hotwire with turbo-rails gem',
            description: 'turbo-rails integrates the Turbo JavaScript library into the Rails asset pipeline and provides view helpers, tag builders, and Broadcastable model concern.',
            resources: [
              { label: 'turbo-rails GitHub Repository', url: 'https://github.com/hotwired/turbo-rails', type: 'docs' },
              { label: 'Turbo Installation Guide', url: 'https://turbo.hotwired.dev/handbook/installing', type: 'docs' }
            ]
          },
          {
            title: 'stimulus-rails gem and controller generation',
            description: 'stimulus-rails adds Stimulus to the importmap or bundler setup and provides rails generate stimulus to scaffold controller files in app/javascript/controllers.',
            resources: [
              { label: 'stimulus-rails GitHub Repository', url: 'https://github.com/hotwired/stimulus-rails', type: 'docs' },
              { label: 'Stimulus Official Site', url: 'https://stimulus.hotwired.dev/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Interactive UI Patterns',
        children: [
          {
            title: 'Inline editing with Turbo Frames workflow',
            description: 'Replace static content with an edit form in-place using a Turbo Frame wrapping both the display and edit states. The frame updates only the wrapped area on response.',
            resources: [
              { label: 'Turbo Frames Lazy Loading', url: 'https://turbo.hotwired.dev/handbook/frames#lazily-loading-frames', type: 'docs' }
            ]
          },
          {
            title: 'Broadcasting live updates from Active Record',
            description: 'The Broadcastable concern mixes into models to broadcast Turbo Stream messages on create, update, and destroy, pushing changes to all subscribed clients automatically.',
            resources: [
              { label: 'turbo-rails Broadcastable Docs', url: 'https://github.com/hotwired/turbo-rails/blob/main/app/models/concerns/turbo/broadcastable.rb', type: 'docs' },
              { label: 'Rails Guides: Action Cable with Turbo', url: 'https://guides.rubyonrails.org/action_cable_overview.html', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-7': {
    sideLeft: [
      {
        title: 'Background Job Concepts',
        children: [
          {
            title: 'Active Job abstraction and adapter pattern',
            description: 'Active Job provides a unified interface for background job processing. You define jobs in app/jobs/ and swap backend adapters (Sidekiq, Resque) without changing job code.',
            resources: [
              { label: 'Rails Guides: Active Job Basics', url: 'https://guides.rubyonrails.org/active_job_basics.html', type: 'docs' },
              { label: 'Rails API: ActiveJob::Base', url: 'https://api.rubyonrails.org/classes/ActiveJob/Base.html', type: 'docs' }
            ]
          },
          {
            title: 'Job retries, error handling, and dead queues',
            description: 'Active Job supports automatic retries with exponential backoff via retry_on. discard_on drops jobs that fail with specific errors that should not be retried.',
            resources: [
              { label: 'Rails Guides: Retrying Failed Jobs', url: 'https://guides.rubyonrails.org/active_job_basics.html#retrying-or-discarding-failed-jobs', type: 'docs' }
            ]
          },
          {
            title: 'Action Mailer email composition and delivery',
            description: 'Action Mailer creates mailer classes that generate HTML and plain-text emails. deliver_later enqueues email delivery as a background job through Active Job.',
            resources: [
              { label: 'Rails Guides: Action Mailer Basics', url: 'https://guides.rubyonrails.org/action_mailer_basics.html', type: 'docs' },
              { label: 'Rails API: ActionMailer::Base', url: 'https://api.rubyonrails.org/classes/ActionMailer/Base.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Email Templates and Testing',
        children: [
          {
            title: 'Email templates HTML and text multipart',
            description: 'Mailer views live in app/views/mailer_name/ and Rails renders both HTML and plain text versions. Multipart emails ensure compatibility with all email clients.',
            resources: [
              { label: 'Rails Guides: Mailer Views', url: 'https://guides.rubyonrails.org/action_mailer_basics.html#action-mailer-views', type: 'docs' }
            ]
          },
          {
            title: 'Mailer previews for development email testing',
            description: 'Action Mailer previews let you render emails in the browser at /rails/mailers without actually sending them, speeding up email template iteration.',
            resources: [
              { label: 'Rails Guides: Previewing Emails', url: 'https://guides.rubyonrails.org/action_mailer_basics.html#previewing-emails', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Sidekiq and Redis Setup',
        children: [
          {
            title: 'Sidekiq worker processes and Redis backend',
            description: 'Sidekiq uses Redis as a job queue store and runs multi-threaded worker processes. It processes significantly more jobs per second than thread-per-process alternatives.',
            resources: [
              { label: 'Sidekiq Official Wiki', url: 'https://github.com/sidekiq/sidekiq/wiki', type: 'docs' },
              { label: 'Sidekiq.org Getting Started', url: 'https://sidekiq.org/', type: 'docs' }
            ]
          },
          {
            title: 'Sidekiq Web UI for job monitoring',
            description: 'Sidekiq ships with a Rack-based web interface showing queue depths, processed counts, failed jobs, and retry queues. Mount it in routes.rb behind authentication.',
            resources: [
              { label: 'Sidekiq Web UI Documentation', url: 'https://github.com/sidekiq/sidekiq/wiki/Monitoring', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Job Scheduling and Reliability',
        children: [
          {
            title: 'Scheduling recurring jobs with sidekiq-cron',
            description: 'sidekiq-cron adds a cron-style scheduler to Sidekiq using a YAML schedule file. It integrates with the Sidekiq Web UI to show and manage scheduled jobs.',
            resources: [
              { label: 'sidekiq-cron GitHub Repository', url: 'https://github.com/ondrejbartas/sidekiq-cron', type: 'docs' }
            ]
          },
          {
            title: 'Email delivery with SendGrid and Postmark',
            description: 'Configure action_mailer.delivery_method with SMTP credentials from SendGrid or Postmark. Use environment variables to keep credentials out of the repository.',
            resources: [
              { label: 'SendGrid Rails Integration Docs', url: 'https://docs.sendgrid.com/for-developers/sending-email/rubyonrails', type: 'docs' },
              { label: 'Postmark Rails Gem GitHub', url: 'https://github.com/ActiveCampaign/postmark-rails', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-8': {
    sideLeft: [
      {
        title: 'API Design Principles',
        children: [
          {
            title: 'API-only Rails application architecture',
            description: 'rails new --api creates a slimmed-down Rails stack removing view layers and session middleware. Controllers inherit from ActionController::API for lightweight JSON responses.',
            resources: [
              { label: 'Rails Guides: Using Rails for API-only Apps', url: 'https://guides.rubyonrails.org/api_app.html', type: 'docs' },
              { label: 'Rails API: ActionController::API', url: 'https://api.rubyonrails.org/classes/ActionController/API.html', type: 'docs' }
            ]
          },
          {
            title: 'API versioning strategies and URL design',
            description: 'Versioning via URL namespaces (/api/v1/) or Accept headers prevents breaking changes for existing clients. Namespaced controllers in app/controllers/api/v1/ isolate versions.',
            resources: [
              { label: 'Rails Guides: Routing Namespaces', url: 'https://guides.rubyonrails.org/routing.html#controller-namespaces-and-routing', type: 'docs' }
            ]
          },
          {
            title: 'Token-based authentication for API endpoints',
            description: 'API token auth stores a secure random token on the user and validates it from the Authorization header. JWT (JSON Web Tokens) is a stateless alternative.',
            resources: [
              { label: 'Rails Guides: HTTP Token Authentication', url: 'https://guides.rubyonrails.org/action_controller_overview.html#http-token-authentication', type: 'docs' },
              { label: 'jwt-ruby GitHub Repository', url: 'https://github.com/jwt/ruby-jwt', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'API Security and Documentation',
        children: [
          {
            title: 'CORS configuration and rate limiting',
            description: 'rack-cors adds CORS headers to allow browser requests from other origins. rack-attack provides IP-based rate limiting, throttling, and blocklisting middleware.',
            resources: [
              { label: 'rack-cors GitHub Repository', url: 'https://github.com/cyu/rack-cors', type: 'docs' },
              { label: 'rack-attack GitHub Repository', url: 'https://github.com/rack/rack-attack', type: 'docs' }
            ]
          },
          {
            title: 'API documentation with Swagger and rswag',
            description: 'rswag generates OpenAPI (Swagger) documentation from RSpec request specs. The Swagger UI lets consumers explore and test API endpoints interactively.',
            resources: [
              { label: 'rswag GitHub Repository', url: 'https://github.com/rswag/rswag', type: 'docs' },
              { label: 'OpenAPI Specification', url: 'https://swagger.io/specification/', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'JSON Serialization',
        children: [
          {
            title: 'Serializing responses with jsonapi-serializer',
            description: 'jsonapi-serializer generates fast JSON:API-compliant responses from Active Record objects. Attributes, relationships, and meta fields are declared in serializer classes.',
            resources: [
              { label: 'jsonapi-serializer GitHub', url: 'https://github.com/jsonapi-serializer/jsonapi-serializer', type: 'docs' }
            ]
          },
          {
            title: 'Active Model Serializers for custom JSON shapes',
            description: 'ActiveModelSerializers allows custom JSON representations via adapter patterns. It integrates with Active Record associations for nested object serialization.',
            resources: [
              { label: 'ActiveModelSerializers GitHub', url: 'https://github.com/rails-api/active_model_serializers', type: 'docs' },
              { label: 'Rails API: as_json and to_json', url: 'https://api.rubyonrails.org/classes/ActiveModel/Serializers/JSON.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'API Testing and Client Tools',
        children: [
          {
            title: 'Testing APIs with request specs and Postman',
            description: 'RSpec request specs test full HTTP stack including routing, controllers, and serializers. Postman collections document and manually test API endpoints during development.',
            resources: [
              { label: 'RSpec Rails Request Specs', url: 'https://rspec.info/documentation/6.0/rspec-rails/#request-specs', type: 'docs' },
              { label: 'Postman API Testing Docs', url: 'https://learning.postman.com/docs/getting-started/overview/', type: 'docs' }
            ]
          },
          {
            title: 'GraphQL APIs with graphql-ruby gem',
            description: 'graphql-ruby implements a GraphQL server in Rails with type-safe schema definitions, query resolution, and mutation support for flexible API data fetching.',
            resources: [
              { label: 'graphql-ruby Official Docs', url: 'https://graphql-ruby.org/', type: 'docs' },
              { label: 'graphql-ruby GitHub', url: 'https://github.com/rmosolgo/graphql-ruby', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-9': {
    sideLeft: [
      {
        title: 'Performance Optimization Theory',
        children: [
          {
            title: 'N+1 queries and eager loading with includes',
            description: 'N+1 occurs when loading associations in a loop triggers one query per record. includes, preload, or eager_load fetches associations upfront in one or two queries.',
            resources: [
              { label: 'Rails Guides: Eager Loading Associations', url: 'https://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations', type: 'docs' },
              { label: 'Bullet Gem for N+1 Detection', url: 'https://github.com/flyerhzm/bullet', type: 'docs' }
            ]
          },
          {
            title: 'Fragment and Russian doll caching strategies',
            description: 'Fragment caching stores rendered HTML partials in a cache store. Russian doll caching nests cache keys so parent caches auto-expire when children change.',
            resources: [
              { label: 'Rails Guides: Caching with Rails', url: 'https://guides.rubyonrails.org/caching_with_rails.html', type: 'docs' },
              { label: 'Rails Guides: Russian Doll Caching', url: 'https://guides.rubyonrails.org/caching_with_rails.html#russian-doll-caching', type: 'docs' }
            ]
          },
          {
            title: 'Database indexing for query performance',
            description: 'Adding database indexes to foreign keys and frequently queried columns reduces full table scans. add_index in migrations creates indexes; EXPLAIN ANALYZE measures impact.',
            resources: [
              { label: 'Rails Guides: Migrations — Adding Indexes', url: 'https://guides.rubyonrails.org/active_record_migrations.html#adding-an-index', type: 'docs' },
              { label: 'PostgreSQL EXPLAIN Documentation', url: 'https://www.postgresql.org/docs/current/sql-explain.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Code Architecture Patterns',
        children: [
          {
            title: 'Service objects for complex business logic',
            description: 'Service objects are plain Ruby classes encapsulating a single business operation. They keep controllers thin and models focused on data concerns, improving testability.',
            resources: [
              { label: 'RubyCop: Service Object Patterns', url: 'https://rubystyle.guide/#single-responsibility', type: 'docs' }
            ]
          },
          {
            title: 'Concerns and modules for code reuse',
            description: 'ActiveSupport::Concern provides a clean way to extract shared model or controller behavior into modules. Concerns live in app/models/concerns/ and app/controllers/concerns/.',
            resources: [
              { label: 'Rails API: ActiveSupport::Concern', url: 'https://api.rubyonrails.org/classes/ActiveSupport/Concern.html', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Caching Infrastructure',
        children: [
          {
            title: 'Redis cache store configuration in Rails',
            description: 'Configure config.cache_store = :redis_cache_store with a Redis connection to get a fast, shared cache across multiple server instances with automatic expiration.',
            resources: [
              { label: 'Rails Guides: Cache Stores', url: 'https://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-store', type: 'docs' },
              { label: 'redis-rails GitHub', url: 'https://github.com/redis-store/redis-rails', type: 'docs' }
            ]
          },
          {
            title: 'HTTP caching with ETags and Last-Modified',
            description: 'fresh_when and stale? helpers set ETag and Last-Modified headers so browsers can cache responses and make conditional requests, reducing server load.',
            resources: [
              { label: 'Rails Guides: Conditional GET Support', url: 'https://guides.rubyonrails.org/caching_with_rails.html#conditional-get-support', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Monitoring and Profiling Tools',
        children: [
          {
            title: 'Application performance monitoring with Scout APM',
            description: 'Scout APM instruments Rails apps to trace slow requests, N+1 queries, and memory bloat. It provides transaction traces and endpoint performance breakdowns.',
            resources: [
              { label: 'Scout APM Ruby Docs', url: 'https://scoutapm.com/docs/ruby', type: 'docs' },
              { label: 'Skylight for Rails Performance', url: 'https://www.skylight.io/', type: 'docs' }
            ]
          },
          {
            title: 'rack-mini-profiler for request-level profiling',
            description: 'rack-mini-profiler injects a speed badge into pages showing SQL query counts, rendering time, and Ruby object allocations to identify bottlenecks in development.',
            resources: [
              { label: 'rack-mini-profiler GitHub', url: 'https://github.com/MiniProfiler/rack-mini-profiler', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'rails-dev-10': {
    sideLeft: [
      {
        title: 'Testing Philosophy and Strategies',
        children: [
          {
            title: 'RSpec model and request spec patterns',
            description: 'Model specs test validations, associations, and business logic in isolation. Request specs test the full HTTP stack end-to-end, verifying response codes and JSON bodies.',
            resources: [
              { label: 'RSpec Rails Official Docs', url: 'https://rspec.info/documentation/6.0/rspec-rails/', type: 'docs' },
              { label: 'RSpec Rails GitHub Repository', url: 'https://github.com/rspec/rspec-rails', type: 'docs' }
            ]
          },
          {
            title: 'System tests with Capybara and browser drivers',
            description: 'Capybara drives a real browser (via Selenium or Cuprite) to test full user workflows. System specs verify JavaScript interactions, form submissions, and Turbo navigation.',
            resources: [
              { label: 'Capybara GitHub Repository', url: 'https://github.com/teamcapybara/capybara', type: 'docs' },
              { label: 'Rails Guides: System Testing', url: 'https://guides.rubyonrails.org/testing.html#system-testing', type: 'docs' }
            ]
          },
          {
            title: 'FactoryBot for test data factories',
            description: 'FactoryBot replaces brittle fixtures with factories that build model instances with sensible defaults and trait overrides, making test setup readable and flexible.',
            resources: [
              { label: 'FactoryBot GitHub Repository', url: 'https://github.com/thoughtbot/factory_bot', type: 'docs' },
              { label: 'FactoryBot Rails GitHub', url: 'https://github.com/thoughtbot/factory_bot_rails', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'CI and Quality Gates',
        children: [
          {
            title: 'GitHub Actions CI pipeline for Rails',
            description: 'A GitHub Actions workflow installs Ruby, sets up a PostgreSQL service container, runs db:schema:load, and executes the full test suite on every pull request.',
            resources: [
              { label: 'GitHub Actions: Ruby Workflow', url: 'https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-ruby', type: 'docs' }
            ]
          },
          {
            title: 'Code coverage with SimpleCov reporting',
            description: 'SimpleCov generates line-by-line coverage reports after the test suite runs. Set a minimum coverage threshold to prevent merging code that reduces test coverage.',
            resources: [
              { label: 'SimpleCov GitHub Repository', url: 'https://github.com/simplecov-ruby/simplecov', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Containerization',
        children: [
          {
            title: 'Dockerfile for Rails production containers',
            description: 'Rails 7+ includes a generated Dockerfile using a multi-stage build with a slim Ruby image. The production image compiles assets, runs migrations, and starts Puma.',
            resources: [
              { label: 'Docker Official Ruby Image Docs', url: 'https://hub.docker.com/_/ruby', type: 'docs' },
              { label: 'Rails Dockerfile Reference', url: 'https://github.com/rails/rails/blob/main/railties/lib/rails/generators/rails/app/templates/Dockerfile.tt', type: 'docs' }
            ]
          },
          {
            title: 'Docker Compose for local development stack',
            description: 'Docker Compose orchestrates Rails, PostgreSQL, and Redis containers locally. Service definitions in compose.yml link containers and manage environment variables.',
            resources: [
              { label: 'Docker Compose Overview', url: 'https://docs.docker.com/compose/', type: 'docs' },
              { label: 'Docker Docs: Getting Started', url: 'https://docs.docker.com/get-started/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Cloud Deployment',
        children: [
          {
            title: 'Deploying Rails to Render or Railway',
            description: 'Render and Railway offer zero-config Rails deployments from a GitHub repo. They detect the Dockerfile or buildpacks, provision PostgreSQL, and run release commands.',
            resources: [
              { label: 'Render: Deploy a Rails App', url: 'https://render.com/docs/deploy-rails', type: 'docs' },
              { label: 'Railway Rails Deployment Guide', url: 'https://docs.railway.app/guides/ruby', type: 'docs' }
            ]
          },
          {
            title: 'Kamal for zero-downtime Rails deployment',
            description: 'Kamal (formerly MRSK) is the official Rails deployment tool. It builds Docker images, pushes to a registry, and rolls out to servers with health-checked zero-downtime deploys.',
            resources: [
              { label: 'Kamal Official Docs', url: 'https://kamal-deploy.org/', type: 'docs' },
              { label: 'Kamal GitHub Repository', url: 'https://github.com/basecamp/kamal', type: 'docs' }
            ]
          }
        ]
      }
    ]
  }
};

let patchCount = 0;

const track = data['rails-dev'];
if (!Array.isArray(track)) {
  console.error('rails-dev track not found in fullstack.json');
  process.exit(1);
}

for (const layer of track) {
  if (patches[layer.id]) {
    layer.sideLeft = patches[layer.id].sideLeft;
    layer.sideRight = patches[layer.id].sideRight;
    patchCount++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${patchCount} patches`);
