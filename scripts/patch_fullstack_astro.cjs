'use strict';

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(
  __dirname,
  '../src/data/roadmaps/fullstack.json'
);

// ---------------------------------------------------------------------------
// Patch data — astro-dev-1 through astro-dev-10
// ---------------------------------------------------------------------------
const patches = {
  'astro-dev-1': {
    sideLeft: [
      {
        title: 'Semantic HTML and CSS Fundamentals',
        children: [
          {
            title: 'Semantic HTML elements and document structure',
            description:
              'Elements like <article>, <nav>, <section>, and <main> give pages machine-readable meaning. They drive accessibility trees, SEO, and readable markup.',
            resources: [
              {
                label: 'MDN — HTML elements reference',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
                type: 'docs',
              },
            ],
          },
          {
            title: 'CSS box model, flexbox, and grid layout',
            description:
              'Every element is a box with margin, border, padding, and content. Flexbox and Grid are the two complementary layout systems that cover virtually every modern UI pattern.',
            resources: [
              {
                label: 'MDN — CSS Box Model',
                url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Responsive design with media queries',
            description:
              'Media queries let CSS adapt to viewport size, orientation, and color scheme. Combining them with fluid units creates layouts that work on any screen.',
            resources: [
              {
                label: 'web.dev — Responsive Design',
                url: 'https://web.dev/responsive-web-design-basics/',
                type: 'article',
              },
            ],
          },
        ],
      },
      {
        title: 'JavaScript Essentials and How Browsers Work',
        children: [
          {
            title: 'JS core concepts: closures, scope, and async',
            description:
              'Closures capture surrounding scope, async/await wraps Promises into readable flow. These patterns underpin every modern framework including Astro island scripts.',
            resources: [
              {
                label: 'javascript.info — The Modern JavaScript Tutorial',
                url: 'https://javascript.info/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Critical rendering path and browser pipeline',
            description:
              'Browsers parse HTML → DOM, CSS → CSSOM, combine into a render tree, then layout and paint. Understanding this explains why Astro ships zero JS by default.',
            resources: [
              {
                label: 'MDN — Critical Rendering Path',
                url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path',
                type: 'article',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'TypeScript Types and Interfaces',
        children: [
          {
            title: 'TypeScript types, interfaces, and generics',
            description:
              'TypeScript adds a static type layer over JavaScript. Types and interfaces describe shapes; generics let you write reusable, type-safe utilities used throughout Astro component props.',
            resources: [
              {
                label: 'TypeScript Handbook — Everyday Types',
                url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
                type: 'docs',
              },
            ],
          },
          {
            title: 'ES modules: import, export, and bundling basics',
            description:
              "ES modules are the native browser module system and the unit of code Astro's build pipeline operates on. Understanding named vs default exports prevents common import errors.",
            resources: [
              {
                label: 'MDN — JavaScript Modules',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Dev Tooling Setup',
        children: [
          {
            title: 'Node.js, npm/pnpm, and project scaffolding',
            description:
              'Node provides the runtime for Astro\'s CLI and build tools. Learning package managers and the node_modules resolution order is prerequisite to running `npm create astro@latest`.',
            resources: [
              {
                label: 'Node.js — Getting Started',
                url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
                type: 'docs',
              },
            ],
          },
          {
            title: 'VS Code extensions for Astro and TypeScript',
            description:
              'The official Astro VS Code extension adds syntax highlighting, IntelliSense, and error reporting inside .astro files. Pair it with the TypeScript extension for full IDE support.',
            resources: [
              {
                label: 'Astro Docs — Editor Setup',
                url: 'https://docs.astro.build/en/editor-setup/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-2': {
    sideLeft: [
      {
        title: 'Astro Component Concepts',
        children: [
          {
            title: 'Component script fence and template sections',
            description:
              'An .astro file splits into a code fence (---) for server-side JS/TS and a template below for HTML output. The fence runs at build time; its variables are available in the template.',
            resources: [
              {
                label: 'Astro Docs — Components',
                url: 'https://docs.astro.build/en/basics/astro-components/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Props: typing and passing data to components',
            description:
              "Props are declared with `Astro.props` and typed via TypeScript interfaces in the component's front-matter. Strong typing here catches mismatches at build time, not in production.",
            resources: [
              {
                label: 'Astro Docs — Component Props',
                url: 'https://docs.astro.build/en/basics/astro-components/#component-props',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Slots: default, named, and fallback content',
            description:
              'Slots let parent components inject markup into child components. Named slots allow multiple injection points; fallback content renders when no slot content is provided.',
            resources: [
              {
                label: 'Astro Docs — Slots',
                url: 'https://docs.astro.build/en/basics/astro-components/#slots',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Styles and Project Structure',
        children: [
          {
            title: 'Scoped styles vs global styles in Astro',
            description:
              'Styles in a <style> tag are automatically scoped to the component via a generated attribute selector. Using `is:global` opts out when you need page-wide selectors.',
            resources: [
              {
                label: 'Astro Docs — Styles and CSS',
                url: 'https://docs.astro.build/en/guides/styling/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Astro project directory conventions',
            description:
              'src/pages drives routing, src/components holds reusable UI, src/layouts wraps page shells, and public/ serves static assets untouched. Knowing this structure prevents misplaced files.',
            resources: [
              {
                label: 'Astro Docs — Project Structure',
                url: 'https://docs.astro.build/en/basics/project-structure/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Building and Importing Components',
        children: [
          {
            title: 'Importing and composing Astro components',
            description:
              'Components are imported with standard ES import syntax and used directly as HTML tags in templates. Astro resolves aliases like `@/components` configured in tsconfig.json.',
            resources: [
              {
                label: 'Astro Docs — Imports',
                url: 'https://docs.astro.build/en/guides/imports/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Using UI framework components inside Astro',
            description:
              'React, Vue, Svelte, and Solid components can be imported into .astro files. Without a client directive they render to static HTML; adding one activates the island.',
            resources: [
              {
                label: 'Astro Docs — Framework Components',
                url: 'https://docs.astro.build/en/guides/framework-components/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Tooling and Dev Server',
        children: [
          {
            title: 'Running the Astro dev server and HMR',
            description:
              'The `astro dev` command starts Vite-powered dev server with hot module replacement. Changes to .astro, styles, and scripts reflect in the browser without full reloads.',
            resources: [
              {
                label: 'Astro Docs — CLI Commands',
                url: 'https://docs.astro.build/en/reference/cli-reference/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'astro.config.mjs: integrations and aliases',
            description:
              'The config file is where you register integrations (Tailwind, React, Sitemap), set base/site URLs, and configure Vite plugins. It\'s the central control point for the build.',
            resources: [
              {
                label: 'Astro Docs — Configuration Reference',
                url: 'https://docs.astro.build/en/reference/configuration-reference/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-3': {
    sideLeft: [
      {
        title: 'Routing Concepts',
        children: [
          {
            title: 'File-based routing and page component rules',
            description:
              'Every .astro or .md file in src/pages becomes a URL. Index files map to the folder root; nested folders create path segments. Understanding this eliminates routing guesswork.',
            resources: [
              {
                label: 'Astro Docs — Routing',
                url: 'https://docs.astro.build/en/guides/routing/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Dynamic routes with bracket syntax and params',
            description:
              'Files named [slug].astro create dynamic segments. The segment value is available at build time via `Astro.params` and at runtime for SSR. Nested brackets enable catch-all routes.',
            resources: [
              {
                label: 'Astro Docs — Dynamic Routes',
                url: 'https://docs.astro.build/en/guides/routing/#dynamic-routes',
                type: 'docs',
              },
            ],
          },
          {
            title: 'getStaticPaths: generating pages at build time',
            description:
              'For static output, getStaticPaths returns every path Astro should pre-render. The returned `params` become URL segments and `props` are passed to the component.',
            resources: [
              {
                label: 'Astro Docs — getStaticPaths',
                url: 'https://docs.astro.build/en/reference/routing-reference/#getstaticpaths',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Layouts and Navigation',
        children: [
          {
            title: 'Layout components and the <slot /> pattern',
            description:
              'Layout files wrap page content with shared chrome (header, footer, SEO head). Pages declare a layout in frontmatter; the page body goes into the layout\'s default slot.',
            resources: [
              {
                label: 'Astro Docs — Layouts',
                url: 'https://docs.astro.build/en/basics/layouts/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Custom 404 and error pages in Astro',
            description:
              'A src/pages/404.astro file is automatically served for missing routes in both static and SSR modes. The 500.astro file handles server errors when using an SSR adapter.',
            resources: [
              {
                label: 'Astro Docs — Custom 404 Page',
                url: 'https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Navigation Tooling',
        children: [
          {
            title: 'View Transitions API for SPA-like navigation',
            description:
              "Astro's built-in View Transitions integration uses the browser's native API to animate between pages without a full reload. Adding `<ViewTransitions />` to your layout opts the site in.",
            resources: [
              {
                label: 'Astro Docs — View Transitions',
                url: 'https://docs.astro.build/en/guides/view-transitions/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Prefetching links for faster perceived navigation',
            description:
              'Astro can prefetch pages on hover or viewport entry via the prefetch integration. It keeps static output while closing the perceived speed gap with client-side routers.',
            resources: [
              {
                label: 'Astro Docs — Prefetch',
                url: 'https://docs.astro.build/en/guides/prefetch/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Pagination and Route Utilities',
        children: [
          {
            title: 'Pagination with paginate() helper',
            description:
              'The `paginate()` utility returned from getStaticPaths splits a data array into pages and injects page metadata (currentPage, lastPage, url.next) as props automatically.',
            resources: [
              {
                label: 'Astro Docs — Pagination',
                url: 'https://docs.astro.build/en/guides/routing/#pagination',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Redirect helpers and canonical URL management',
            description:
              'Astro.redirect() in SSR mode and static redirect configs let you manage moved routes. Canonical URLs prevent duplicate-content SEO penalties for paginated or aliased pages.',
            resources: [
              {
                label: 'Astro Docs — Redirects',
                url: 'https://docs.astro.build/en/guides/routing/#redirects',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-4': {
    sideLeft: [
      {
        title: 'Markdown and Frontmatter',
        children: [
          {
            title: 'Markdown pages with YAML frontmatter in Astro',
            description:
              'Markdown files in src/pages render as HTML pages. YAML frontmatter supplies structured data (title, date, tags) that layouts and components can consume as props.',
            resources: [
              {
                label: 'Astro Docs — Markdown and MDX',
                url: 'https://docs.astro.build/en/guides/markdown-content/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'MDX: embedding components inside Markdown',
            description:
              'MDX extends Markdown to allow JSX component imports. This lets you drop interactive demos, callout boxes, or charts inline in prose without custom shortcodes.',
            resources: [
              {
                label: 'MDX — Getting Started',
                url: 'https://mdxjs.com/docs/getting-started/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Content Collections: organizing structured content',
            description:
              'Content Collections group related Markdown/MDX/JSON files under src/content. They enforce a consistent frontmatter shape and expose a type-safe query API.',
            resources: [
              {
                label: 'Astro Docs — Content Collections',
                url: 'https://docs.astro.build/en/guides/content-collections/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Schema Validation with Zod',
        children: [
          {
            title: 'Defining collection schemas with Zod types',
            description:
              'Each collection exports a `defineCollection` with a Zod schema that validates every entry\'s frontmatter at build time. Invalid entries cause an informative build error rather than a runtime bug.',
            resources: [
              {
                label: 'Zod — Getting Started',
                url: 'https://zod.dev/?id=basic-usage',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reference fields: linking collections to each other',
            description:
              'The `reference()` helper creates a typed foreign-key relationship between collections (e.g., a blog post referencing an author). Astro resolves the reference at query time.',
            resources: [
              {
                label: 'Astro Docs — Collection References',
                url: 'https://docs.astro.build/en/guides/content-collections/#defining-collection-references',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Querying and Rendering Collections',
        children: [
          {
            title: 'getCollection and getEntry query APIs',
            description:
              '`getCollection("blog")` returns all entries with typed frontmatter. `getEntry` fetches a single entry by slug. Both are async and used in component front-matter or getStaticPaths.',
            resources: [
              {
                label: 'Astro Docs — Querying Collections',
                url: 'https://docs.astro.build/en/guides/content-collections/#querying-collections',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Rendering MDX entries with the <Content /> component',
            description:
              'Every collection entry exposes a `render()` method that returns the compiled `<Content />` component. Dropping it in a template outputs the full parsed MDX with all component substitutions applied.',
            resources: [
              {
                label: 'Astro Docs — Rendering Content',
                url: 'https://docs.astro.build/en/guides/content-collections/#rendering-content-in-templates',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'MDX Plugins and Remark/Rehype',
        children: [
          {
            title: 'Remark and rehype plugins for Markdown processing',
            description:
              'Remark transforms Markdown AST; rehype transforms HTML AST. Plugins like remark-gfm add GitHub-flavored tables and task lists, while rehype-pretty-code handles syntax highlighting.',
            resources: [
              {
                label: 'Astro Docs — Markdown Plugins',
                url: 'https://docs.astro.build/en/guides/markdown-content/#markdown-plugins',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Custom MDX components via components prop',
            description:
              'Pass a `components` map to `<Content />` to replace native Markdown elements with styled Astro/React components. This is how design-system typography is applied to prose content.',
            resources: [
              {
                label: 'MDX — Custom Components',
                url: 'https://mdxjs.com/docs/using-mdx/#components',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-5': {
    sideLeft: [
      {
        title: 'Islands Architecture Theory',
        children: [
          {
            title: 'What islands architecture is and why it matters',
            description:
              'Islands architecture renders the page as static HTML and hydrates only interactive UI "islands" independently. This dramatically reduces JS payload compared to full SPAs.',
            resources: [
              {
                label: 'Astro Docs — Islands Architecture',
                url: 'https://docs.astro.build/en/concepts/islands/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'When to use an island vs pure static markup',
            description:
              'An island is warranted when the component needs browser APIs, user events, or reactive state after page load. Static markup is always preferred for content that never changes after render.',
            resources: [
              {
                label: 'web.dev — Rendering Patterns',
                url: 'https://web.dev/rendering-on-the-web/',
                type: 'article',
              },
            ],
          },
          {
            title: 'Hydration strategies: eager vs lazy vs idle',
            description:
              'client:load hydrates immediately, client:visible waits until the element enters the viewport, and client:idle hydrates after the main thread is free — each trading interaction latency for initial JS cost.',
            resources: [
              {
                label: 'Astro Docs — Client Directives',
                url: 'https://docs.astro.build/en/reference/directives-reference/#client-directives',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Sharing State Between Islands',
        children: [
          {
            title: 'Nano Stores for cross-island reactive state',
            description:
              'Nano Stores is a tiny (~1 kB) framework-agnostic state library recommended by Astro. Atoms defined once can be imported and subscribed to by React, Svelte, or Vue islands on the same page.',
            resources: [
              {
                label: 'Astro Docs — Sharing State Between Islands',
                url: 'https://docs.astro.build/en/recipes/sharing-state-islands/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Custom events and the DOM as a message bus',
            description:
              'Vanilla custom events dispatched on `window` or a shared element let islands communicate without a shared store. This zero-dependency pattern works across any framework combination.',
            resources: [
              {
                label: 'MDN — CustomEvent',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Framework Integrations',
        children: [
          {
            title: 'Adding React to Astro with @astrojs/react',
            description:
              'The official React integration wires JSX transforms and React\'s runtime into the Astro build. After `npx astro add react`, .tsx components work anywhere in src/ with client directives.',
            resources: [
              {
                label: 'Astro Docs — React Integration',
                url: 'https://docs.astro.build/en/guides/integrations-guide/react/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Svelte and Vue integrations as lighter alternatives',
            description:
              'Svelte and Vue compile to smaller runtime bundles than React, making them attractive for islands where bundle size matters. Both are installed with a single `astro add` command.',
            resources: [
              {
                label: 'Astro Docs — Svelte Integration',
                url: 'https://docs.astro.build/en/guides/integrations-guide/svelte/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Client Directive Tooling',
        children: [
          {
            title: 'client:only for browser-only components',
            description:
              '`client:only="react"` skips SSR entirely for the component and hydrates it exclusively in the browser. Essential for components using APIs that do not exist in Node (e.g., localStorage, WebGL).',
            resources: [
              {
                label: 'Astro Docs — client:only Directive',
                url: 'https://docs.astro.build/en/reference/directives-reference/#clientonly',
                type: 'docs',
              },
            ],
          },
          {
            title: 'client:media for responsive island activation',
            description:
              '`client:media="(max-width: 768px)"` hydrates an island only when the media query matches. A hamburger-menu component, for example, never loads its JS on desktop.',
            resources: [
              {
                label: 'Astro Docs — client:media Directive',
                url: 'https://docs.astro.build/en/reference/directives-reference/#clientmedia',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-6': {
    sideLeft: [
      {
        title: 'Design Systems and Tokens',
        children: [
          {
            title: 'Design tokens: colors, spacing, and typography scales',
            description:
              'Design tokens are named constants for visual decisions. Encoding them as CSS custom properties (--color-primary) or Tailwind theme values makes the design system change in one place.',
            resources: [
              {
                label: 'web.dev — Design Tokens',
                url: 'https://web.dev/design-tokens/',
                type: 'article',
              },
            ],
          },
          {
            title: 'Dark mode strategy: class vs media-query approach',
            description:
              'The `class` strategy toggles a `.dark` class on <html> via JS, enabling user-controlled dark mode. The `media` strategy uses prefers-color-scheme and follows the OS automatically.',
            resources: [
              {
                label: 'Tailwind CSS — Dark Mode',
                url: 'https://tailwindcss.com/docs/dark-mode',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Typography and Reusable Components',
        children: [
          {
            title: 'Prose typography with @tailwindcss/typography plugin',
            description:
              'The Typography plugin adds the `prose` class that applies readable typographic defaults to arbitrary HTML content like rendered Markdown. It integrates directly with dark mode variants.',
            resources: [
              {
                label: 'Tailwind CSS — Typography Plugin',
                url: 'https://tailwindcss.com/docs/typography-plugin',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Building reusable styled Astro components',
            description:
              'Astro components with typed props and scoped styles form a component library. Combining Tailwind utility classes with a `class:list` directive keeps variants terse and readable.',
            resources: [
              {
                label: 'Astro Docs — class:list Directive',
                url: 'https://docs.astro.build/en/reference/directives-reference/#classlist',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Tailwind CSS Integration',
        children: [
          {
            title: 'Installing and configuring Tailwind in Astro',
            description:
              'Run `npx astro add tailwind` to scaffold the integration, tailwind.config.cjs, and global CSS import automatically. The config file is where you extend the theme and add plugins.',
            resources: [
              {
                label: 'Astro Docs — Tailwind Integration',
                url: 'https://docs.astro.build/en/guides/integrations-guide/tailwind/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Tailwind responsive utilities and breakpoint system',
            description:
              'Tailwind\'s mobile-first breakpoints (sm, md, lg, xl, 2xl) prefix any utility. Composing `md:flex hidden` reads as "hidden by default, flex from medium screens up."',
            resources: [
              {
                label: 'Tailwind CSS — Responsive Design',
                url: 'https://tailwindcss.com/docs/responsive-design',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Tailwind arbitrary values and the JIT engine',
            description:
              'JIT (Just-in-Time) compiles only the classes present in your source files, keeping CSS output minimal. Arbitrary values like `w-[327px]` let you escape the scale for one-off measurements.',
            resources: [
              {
                label: 'Tailwind CSS — Adding Custom Styles',
                url: 'https://tailwindcss.com/docs/adding-custom-styles',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'CSS Variables and Theming',
        children: [
          {
            title: 'CSS custom properties for runtime theming',
            description:
              'CSS custom properties cascade and can be read/written by JavaScript at runtime. Defining your design tokens as vars makes theme switching work without a page reload.',
            resources: [
              {
                label: 'MDN — CSS Custom Properties',
                url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Scoped Astro styles vs Tailwind: when to use each',
            description:
              "Scoped styles are ideal for structural, layout-specific rules in a single component. Tailwind utilities are better for atomic presentational rules applied across many components — they don't fight each other.",
            resources: [
              {
                label: 'Astro Docs — CSS Styling Guide',
                url: 'https://docs.astro.build/en/guides/styling/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-7': {
    sideLeft: [
      {
        title: 'Static vs Server Rendering Concepts',
        children: [
          {
            title: 'Static output vs server-side rendering trade-offs',
            description:
              'Static output pre-renders every page to HTML at build time — fast, cacheable, but data is stale until next build. SSR renders on every request — always fresh but requires a server and adds latency.',
            resources: [
              {
                label: 'Astro Docs — On-Demand Rendering',
                url: 'https://docs.astro.build/en/guides/on-demand-rendering/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Hybrid rendering: static pages with server routes',
            description:
              'Astro\'s hybrid mode lets you export `const prerender = false` from individual pages to opt them into SSR while the rest of the site stays static. This is the ideal approach for mostly-static sites with a few dynamic pages.',
            resources: [
              {
                label: 'Astro Docs — Hybrid Rendering',
                url: 'https://docs.astro.build/en/guides/on-demand-rendering/#opting-out-of-pre-rendering',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Reading request data: headers, cookies, and URL params',
            description:
              'In SSR mode, `Astro.request` is a standard Web Request object. `Astro.cookies` provides a type-safe cookie API. Understanding these lets you build auth guards and personalized responses.',
            resources: [
              {
                label: 'Astro Docs — Astro.request',
                url: 'https://docs.astro.build/en/reference/api-reference/#astrorequest',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Environment Variables and Secrets',
        children: [
          {
            title: 'Env vars: PUBLIC_ prefix and server-only secrets',
            description:
              'Variables prefixed `PUBLIC_` are inlined into client JS; all others are server-only. Keeping API keys without the prefix ensures they never appear in browser bundles.',
            resources: [
              {
                label: 'Astro Docs — Environment Variables',
                url: 'https://docs.astro.build/en/guides/environment-variables/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'astro:env typed environment variable schema',
            description:
              'Astro 4\'s `astro:env` feature lets you declare a schema for expected env vars with Zod-like types and context (client/server). Missing or malformed vars fail the build explicitly.',
            resources: [
              {
                label: 'Astro Docs — astro:env',
                url: 'https://docs.astro.build/en/guides/environment-variables/#type-safe-environment-variables',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Adapters and API Endpoints',
        children: [
          {
            title: 'SSR adapters: Node, Vercel, Netlify, Cloudflare',
            description:
              'Each deployment target needs an adapter that compiles Astro\'s server output to the platform\'s request format. `npx astro add vercel` installs and configures the adapter in one step.',
            resources: [
              {
                label: 'Astro Docs — Server-side Rendering',
                url: 'https://docs.astro.build/en/guides/on-demand-rendering/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'API endpoints: GET and POST route handlers',
            description:
              'Files in src/pages that export a GET or POST function become API route handlers instead of pages. They receive a standard Request and must return a Response, following the Web Fetch API.',
            resources: [
              {
                label: 'Astro Docs — Endpoints',
                url: 'https://docs.astro.build/en/guides/endpoints/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Handling form submissions with server actions',
            description:
              'Astro Actions (v4.8+) provide type-safe server functions callable from forms or client JS without manually wiring fetch. They handle validation, errors, and redirects ergonomically.',
            resources: [
              {
                label: 'Astro Docs — Actions',
                url: 'https://docs.astro.build/en/guides/actions/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Middleware',
        children: [
          {
            title: 'Astro middleware for auth and request rewriting',
            description:
              'src/middleware.ts exports an `onRequest` function that intercepts every request before the page renders. It\'s the right place for session checks, A/B routing, and setting shared locals.',
            resources: [
              {
                label: 'Astro Docs — Middleware',
                url: 'https://docs.astro.build/en/guides/middleware/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Locals: sharing data from middleware to components',
            description:
              '`context.locals` is a request-scoped object typed via `App.Locals`. Middleware populates it (e.g., `locals.user`) and pages/components read it, avoiding redundant database calls per page.',
            resources: [
              {
                label: 'Astro Docs — Middleware Locals',
                url: 'https://docs.astro.build/en/guides/middleware/#storing-data-in-locals',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-8': {
    sideLeft: [
      {
        title: 'External Data and CMS Concepts',
        children: [
          {
            title: 'Fetching from REST and GraphQL APIs at build time',
            description:
              'Top-level `await fetch()` in an Astro component\'s front-matter runs at build time. The fetched data is serialized into the static HTML — the API is never called from the browser.',
            resources: [
              {
                label: 'Astro Docs — Data Fetching',
                url: 'https://docs.astro.build/en/guides/data-fetching/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Headless CMS integration patterns with Astro',
            description:
              'Headless CMSes (Contentful, Sanity, Storyblok) expose content via API. Astro fetches and caches the data at build time or on-demand, completely decoupling the editing experience from the tech stack.',
            resources: [
              {
                label: 'Astro Docs — CMS Guides',
                url: 'https://docs.astro.build/en/guides/cms/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Content Loaders: extending Content Collections',
            description:
              'Content Loaders (Astro 5) allow a collection to be backed by any source — a remote API, a database, or a custom file format — not just local files, while keeping the same type-safe query API.',
            resources: [
              {
                label: 'Astro Docs — Content Loaders',
                url: 'https://docs.astro.build/en/reference/content-loader-reference/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Image Handling Concepts',
        children: [
          {
            title: 'Why image optimization matters for Core Web Vitals',
            description:
              'LCP (Largest Contentful Paint) is frequently an image. Serving correctly sized, next-gen formats (WebP, AVIF) and adding width/height to prevent CLS are the highest-ROI image practices.',
            resources: [
              {
                label: 'web.dev — Optimize Images',
                url: 'https://web.dev/fast/#optimize-your-images',
                type: 'article',
              },
            ],
          },
          {
            title: 'Remote images: authorization and allowed domains',
            description:
              "Astro's image service can optimize remote images from allowed domains listed in `image.domains`. Attempting to optimize an unlisted domain throws a build error to prevent unintended proxying.",
            resources: [
              {
                label: 'Astro Docs — Images from Remote Sources',
                url: 'https://docs.astro.build/en/guides/images/#authorizing-remote-images',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Integrations Tooling',
        children: [
          {
            title: 'Astro <Image /> and <Picture /> built-in components',
            description:
              'The built-in `<Image />` component auto-generates optimized output (WebP/AVIF, correct dimensions, lazy loading). `<Picture />` emits a <picture> element with multiple format sources for art direction.',
            resources: [
              {
                label: 'Astro Docs — Images',
                url: 'https://docs.astro.build/en/guides/images/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Using Astro integrations from the ecosystem',
            description:
              'The Astro integrations catalog covers analytics, sitemaps, auth (Lucia, Auth.js), Storybook, and more. Each is added with `astro add` or manual config entry and a single npm install.',
            resources: [
              {
                label: 'Astro Integrations Catalog',
                url: 'https://astro.build/integrations/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Secrets and API Security',
        children: [
          {
            title: 'Keeping API keys out of client bundles',
            description:
              'All fetch calls using secret keys must stay in server-only code: component front-matter, SSR pages, API endpoints, or middleware. The `PUBLIC_` prefix rule enforces this boundary.',
            resources: [
              {
                label: 'Astro Docs — Environment Variables',
                url: 'https://docs.astro.build/en/guides/environment-variables/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Rate limiting and caching remote data fetches',
            description:
              'Build-time fetches run every deployment; SSR fetches run every request. Caching responses (in-memory, KV, or stale-while-revalidate headers) reduces API costs and latency.',
            resources: [
              {
                label: 'MDN — HTTP caching',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-9': {
    sideLeft: [
      {
        title: 'Core Web Vitals and Performance Theory',
        children: [
          {
            title: 'Core Web Vitals: LCP, INP, and CLS explained',
            description:
              'Google\'s CWV measure real-user experience. LCP tracks load speed, INP measures interaction responsiveness, and CLS quantifies layout stability. All three affect Search ranking.',
            resources: [
              {
                label: 'web.dev — Core Web Vitals',
                url: 'https://web.dev/vitals/',
                type: 'article',
              },
            ],
          },
          {
            title: 'Why Astro ships minimal JS by default',
            description:
              "Astro's zero-JS-by-default approach eliminates the parse/execute cost of framework runtimes for static content. This directly improves TBT and INP without any manual optimization.",
            resources: [
              {
                label: 'Astro Docs — Why Astro',
                url: 'https://docs.astro.build/en/concepts/why-astro/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Resource hints: preload, prefetch, and preconnect',
            description:
              'Preload tells the browser to fetch a critical resource immediately; preconnect warms up a TCP/TLS connection to a third-party origin. Misusing them wastes bandwidth, so prioritize sparingly.',
            resources: [
              {
                label: 'web.dev — Resource Hints',
                url: 'https://web.dev/preload-scanner/',
                type: 'article',
              },
            ],
          },
        ],
      },
      {
        title: 'SEO Fundamentals',
        children: [
          {
            title: 'Meta tags, Open Graph, and structured data',
            description:
              'The <title>, meta description, and Open Graph tags control how pages appear in search results and social previews. JSON-LD structured data enables rich results like breadcrumbs and FAQ accordions.',
            resources: [
              {
                label: 'Google Search — Structured Data',
                url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Canonical URLs and duplicate content prevention',
            description:
              'A canonical link element tells search engines which URL is the authoritative version when multiple URLs serve equivalent content (pagination, query strings, www vs non-www).',
            resources: [
              {
                label: 'Google Search — Canonical URLs',
                url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'Sitemap, RSS, and Auditing Tools',
        children: [
          {
            title: 'Generating sitemap.xml with @astrojs/sitemap',
            description:
              'The official Sitemap integration auto-generates a standards-compliant sitemap.xml at build time, including all static pages. It respects `sitemap: false` frontmatter for pages you want excluded.',
            resources: [
              {
                label: 'Astro Docs — Sitemap Integration',
                url: 'https://docs.astro.build/en/guides/integrations-guide/sitemap/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Building an RSS feed with @astrojs/rss',
            description:
              'The RSS integration generates a valid RSS/Atom feed from any array of items. Subscribable feeds increase content reach and are a prerequisite for some podcast directories and aggregators.',
            resources: [
              {
                label: 'Astro Docs — RSS Feeds',
                url: 'https://docs.astro.build/en/guides/rss/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Lighthouse and Image Optimization',
        children: [
          {
            title: 'Running Lighthouse audits and reading the report',
            description:
              'Lighthouse scores Performance, Accessibility, Best Practices, and SEO. The "Opportunities" section gives actionable, estimated-impact fixes. Run it in Chrome DevTools or via CI with lighthouse-ci.',
            resources: [
              {
                label: 'Google — Lighthouse Overview',
                url: 'https://developers.google.com/web/tools/lighthouse',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Astro image formats: WebP and AVIF output',
            description:
              'Passing `format="avif"` or `format="webp"` to `<Image />` converts originals at build time. AVIF offers the best compression but slower encoding; WebP has near-universal support.',
            resources: [
              {
                label: 'Astro Docs — Image Optimization',
                url: 'https://docs.astro.build/en/guides/images/#image-optimization',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Font optimization with font-display and subsetting',
            description:
              'Loading web fonts blocks rendering if not handled carefully. `font-display: swap` shows fallback text immediately; subsetting removes unused glyph ranges, cutting font file size by up to 90%.',
            resources: [
              {
                label: 'web.dev — Font Best Practices',
                url: 'https://web.dev/font-best-practices/',
                type: 'article',
              },
            ],
          },
        ],
      },
    ],
  },

  'astro-dev-10': {
    sideLeft: [
      {
        title: 'Testing Concepts',
        children: [
          {
            title: 'Unit testing Astro utilities with Vitest',
            description:
              'Vitest is Vite-native and shares the same config as Astro. It is ideal for testing pure functions, content collection helpers, and server utilities without spinning up a browser.',
            resources: [
              {
                label: 'Vitest — Getting Started',
                url: 'https://vitest.dev/guide/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'E2E testing Astro pages with Playwright',
            description:
              'Playwright spins up a real browser to navigate pages, click elements, and assert on visible text. It is the right tool for testing routing, form submissions, and island interactivity end-to-end.',
            resources: [
              {
                label: 'Playwright — Getting Started',
                url: 'https://playwright.dev/docs/intro',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Accessibility testing with axe-core and Playwright',
            description:
              'Injecting `axe-core` into Playwright tests surfaces WCAG violations automatically on every page. This catches missing alt text, low contrast, and unlabeled form controls in CI.',
            resources: [
              {
                label: 'Playwright — Accessibility Testing',
                url: 'https://playwright.dev/docs/accessibility-testing',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Deployment Concepts',
        children: [
          {
            title: 'Choosing the right adapter for your deployment target',
            description:
              'Static sites need no adapter. Node, Vercel, Netlify, Cloudflare, and Deno adapters match their respective platforms. The wrong adapter causes runtime errors not caught in local dev.',
            resources: [
              {
                label: 'Astro Docs — Deployment Guides',
                url: 'https://docs.astro.build/en/guides/deploy/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Preview builds and pre-production environments',
            description:
              'Hosting platforms create per-branch preview URLs on every pull request. Sharing the preview URL is the fastest way to get stakeholder sign-off before merging to production.',
            resources: [
              {
                label: 'Netlify Docs — Deploy Previews',
                url: 'https://docs.netlify.com/site-deploys/deploy-previews/',
                type: 'docs',
              },
            ],
          },
        ],
      },
    ],
    sideRight: [
      {
        title: 'CI/CD and Production Tooling',
        children: [
          {
            title: 'GitHub Actions workflow for Astro build and test',
            description:
              'A typical workflow runs `npm ci`, `vitest run`, `playwright test`, then `astro build` in sequence. Failing any step blocks the PR merge, enforcing quality gates without manual checks.',
            resources: [
              {
                label: 'Astro Docs — GitHub Actions',
                url: 'https://docs.astro.build/en/guides/deploy/github/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Deploying to Netlify: static and SSR modes',
            description:
              'Netlify auto-detects Astro projects and runs `astro build` on every push to the default branch. Adding the `@astrojs/netlify` adapter enables SSR; without it only static output is supported.',
            resources: [
              {
                label: 'Netlify Docs — Astro on Netlify',
                url: 'https://docs.netlify.com/frameworks/astro/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Deploying to Vercel with zero-config Astro support',
            description:
              "Vercel's build system detects Astro automatically and selects the correct output directory. The `@astrojs/vercel` adapter unlocks Edge Functions and Image Optimization on Vercel's CDN.",
            resources: [
              {
                label: 'Astro Docs — Deploy to Vercel',
                url: 'https://docs.astro.build/en/guides/deploy/vercel/',
                type: 'docs',
              },
            ],
          },
        ],
      },
      {
        title: 'Monitoring and Env Vars in Production',
        children: [
          {
            title: 'Managing env vars across dev, preview, and production',
            description:
              'Each environment needs its own secret values (API keys, DB URLs). Netlify, Vercel, and Cloudflare all have a UI for setting env vars per branch scope, which Astro reads at runtime.',
            resources: [
              {
                label: 'Netlify Docs — Environment Variables',
                url: 'https://docs.netlify.com/environment-variables/overview/',
                type: 'docs',
              },
            ],
          },
          {
            title: 'Monitoring production Astro sites with analytics',
            description:
              'Astro integrates with Partytown to run analytics scripts in a web worker, keeping them off the main thread. Pair with a Real User Monitoring tool (Vercel Analytics, Sentry) to track CWV in production.',
            resources: [
              {
                label: 'Astro Docs — Partytown Integration',
                url: 'https://docs.astro.build/en/guides/integrations-guide/partytown/',
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
// Main
// ---------------------------------------------------------------------------
const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

if (!data['astro-dev']) {
  console.error('ERROR: "astro-dev" track not found in fullstack.json');
  process.exit(1);
}

let applied = 0;

data['astro-dev'] = data['astro-dev'].map((layer) => {
  const patch = patches[layer.id];
  if (patch) {
    applied++;
    return Object.assign({}, layer, patch);
  }
  return layer;
});

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${applied} patches`);
