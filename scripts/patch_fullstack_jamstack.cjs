'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'roadmaps', 'fullstack.json');

const patches = {
  'jamstack-1': {
    sideLeft: [
      {
        title: 'Web Foundations Theory',
        children: [
          {
            title: 'Semantic HTML elements and accessibility basics',
            description: 'Semantic elements like <article>, <nav>, and <section> communicate meaning to browsers and assistive technologies. Using them correctly improves SEO and screen-reader support.',
            resources: [
              { label: 'MDN: HTML elements reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', type: 'docs' },
              { label: 'MDN: Accessibility guides', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility', type: 'docs' }
            ]
          },
          {
            title: 'Static versus dynamic site rendering models',
            description: 'Static sites serve pre-built HTML from a CDN with no server computation at request time. Dynamic sites generate HTML on each request, adding latency but enabling personalisation.',
            resources: [
              { label: 'Jamstack.org: What is Jamstack?', url: 'https://jamstack.org/what-is-jamstack/', type: 'article' },
              { label: 'web.dev: Rendering on the Web', url: 'https://web.dev/rendering-on-the-web/', type: 'article' }
            ]
          },
          {
            title: 'JAMstack philosophy and the decoupled architecture',
            description: 'JAMstack decouples the front-end from the back-end by pre-rendering markup and using APIs for dynamic behaviour. This improves security, scalability, and developer experience.',
            resources: [
              { label: 'Jamstack.org: Best practices', url: 'https://jamstack.org/best-practices/', type: 'article' },
              { label: 'MDN: How the Web works', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'CDNs and Edge Delivery Concepts',
        children: [
          {
            title: 'How content delivery networks cache and serve assets',
            description: 'CDNs distribute copies of your static assets across globally located edge nodes so users fetch content from the nearest server. This drastically reduces time-to-first-byte.',
            resources: [
              { label: 'Cloudflare: What is a CDN?', url: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/', type: 'article' },
              { label: 'Netlify: Edge network overview', url: 'https://docs.netlify.com/platform/caching/', type: 'docs' }
            ]
          },
          {
            title: 'Working with third-party REST APIs in the browser',
            description: 'The browser Fetch API lets you request data from external services at runtime. Understanding JSON responses and async/await patterns is essential for enriching static pages.',
            resources: [
              { label: 'MDN: Using Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', type: 'docs' },
              { label: 'MDN: Working with JSON', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'HTML and CSS Tooling',
        children: [
          {
            title: 'CSS Flexbox and Grid layout systems hands-on',
            description: 'Flexbox handles one-dimensional layouts while Grid handles two-dimensional ones. Together they replace older float-based approaches and are supported universally.',
            resources: [
              { label: 'MDN: CSS Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox', type: 'docs' },
              { label: 'CSS-Tricks: A Complete Guide to Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'article' }
            ]
          },
          {
            title: 'Responsive design with media queries and fluid units',
            description: 'Media queries let you apply different styles at different viewport widths. Fluid units like rem, vw, and percentages reduce the number of breakpoints you need.',
            resources: [
              { label: 'MDN: Using media queries', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries', type: 'docs' },
              { label: 'web.dev: Responsive design patterns', url: 'https://web.dev/responsive-web-design-basics/', type: 'article' }
            ]
          }
        ]
      },
      {
        title: 'JavaScript Essentials Practice',
        children: [
          {
            title: 'ES6 features: arrow functions, destructuring, modules',
            description: 'Modern JavaScript syntax like arrow functions, template literals, and ES modules is used throughout every JAMstack framework. Mastering these reduces boilerplate significantly.',
            resources: [
              { label: 'MDN: JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'docs' },
              { label: 'javascript.info: Modern JavaScript Tutorial', url: 'https://javascript.info/', type: 'article' }
            ]
          },
          {
            title: 'Browser DevTools for debugging and network inspection',
            description: 'Chrome DevTools lets you inspect DOM, debug JS, and profile network requests. The Network tab is particularly useful for verifying API calls in JAMstack apps.',
            resources: [
              { label: 'Chrome DevTools overview', url: 'https://developer.chrome.com/docs/devtools/', type: 'docs' },
              { label: 'MDN: Firefox DevTools', url: 'https://developer.mozilla.org/en-US/docs/Tools', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-2': {
    sideLeft: [
      {
        title: 'React Core Concepts',
        children: [
          {
            title: 'Component model, props, and unidirectional data flow',
            description: 'React components are pure functions that accept props and return JSX. Data flows down from parent to child, making state changes predictable and traceable.',
            resources: [
              { label: 'react.dev: Your first component', url: 'https://react.dev/learn/your-first-component', type: 'docs' },
              { label: 'react.dev: Passing props to a component', url: 'https://react.dev/learn/passing-props-to-a-component', type: 'docs' }
            ]
          },
          {
            title: 'State management with useState and useReducer hooks',
            description: 'useState stores simple local state while useReducer suits more complex state transitions. Both trigger re-renders when values change, keeping the UI in sync.',
            resources: [
              { label: 'react.dev: useState reference', url: 'https://react.dev/reference/react/useState', type: 'docs' },
              { label: 'react.dev: useReducer reference', url: 'https://react.dev/reference/react/useReducer', type: 'docs' }
            ]
          },
          {
            title: 'Composition patterns and reusable component design',
            description: 'Composing small, focused components instead of large monolithic ones improves readability and reuse. Patterns like render props and compound components solve common composition challenges.',
            resources: [
              { label: 'react.dev: Thinking in React', url: 'https://react.dev/learn/thinking-in-react', type: 'docs' },
              { label: 'react.dev: Passing JSX as children', url: 'https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Hooks and Side Effects',
        children: [
          {
            title: 'useEffect for data fetching and lifecycle side effects',
            description: 'useEffect runs after render and is used to fetch data, subscribe to events, or synchronise with external systems. The dependency array controls when the effect re-runs.',
            resources: [
              { label: 'react.dev: useEffect reference', url: 'https://react.dev/reference/react/useEffect', type: 'docs' },
              { label: 'react.dev: Synchronizing with effects', url: 'https://react.dev/learn/synchronizing-with-effects', type: 'docs' }
            ]
          },
          {
            title: 'Custom hooks for encapsulating reusable stateful logic',
            description: 'Custom hooks are plain functions prefixed with "use" that can call other hooks. They let you extract and share stateful logic without changing your component hierarchy.',
            resources: [
              { label: 'react.dev: Reusing logic with custom hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'React Tooling and Setup',
        children: [
          {
            title: 'Setting up a React project with Vite or Create React App',
            description: 'Vite is the modern choice for fast hot-module replacement and lean builds. Create React App is the classic option with a batteries-included setup.',
            resources: [
              { label: 'Vite: Getting Started', url: 'https://vitejs.dev/guide/', type: 'docs' },
              { label: 'react.dev: Start a new React project', url: 'https://react.dev/learn/start-a-new-react-project', type: 'docs' }
            ]
          },
          {
            title: 'JSX syntax rules and conditional rendering patterns',
            description: 'JSX compiles to React.createElement calls and follows JavaScript expression rules inside curly braces. Conditional rendering uses ternary expressions or short-circuit evaluation.',
            resources: [
              { label: 'react.dev: Writing markup with JSX', url: 'https://react.dev/learn/writing-markup-with-jsx', type: 'docs' },
              { label: 'react.dev: Conditional rendering', url: 'https://react.dev/learn/conditional-rendering', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Data Fetching in React',
        children: [
          {
            title: 'Fetching API data with useEffect and handling loading states',
            description: 'A standard pattern loads data in useEffect, stores it in state, and renders a loading spinner until the response arrives. Always handle errors with a try-catch block.',
            resources: [
              { label: 'react.dev: Fetching data with Effects', url: 'https://react.dev/learn/synchronizing-with-effects#fetching-data', type: 'docs' },
              { label: 'MDN: Using Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', type: 'docs' }
            ]
          },
          {
            title: 'React project structure and file organisation conventions',
            description: 'Grouping files by feature rather than by type (components/, hooks/, utils/) scales better as projects grow. Co-locating tests and styles with their component reduces navigation overhead.',
            resources: [
              { label: 'react.dev: File structure recommendations', url: 'https://react.dev/learn/importing-and-exporting-components', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-3': {
    sideLeft: [
      {
        title: 'Next.js Rendering Strategies',
        children: [
          {
            title: 'Static generation versus server-side rendering trade-offs',
            description: 'Static generation (getStaticProps) builds pages at deploy time for maximum CDN cacheability. SSR (getServerSideProps) generates pages per-request for real-time data.',
            resources: [
              { label: 'Next.js: Data fetching overview', url: 'https://nextjs.org/docs/pages/building-your-application/data-fetching', type: 'docs' },
              { label: 'Next.js: getStaticProps', url: 'https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props', type: 'docs' }
            ]
          },
          {
            title: 'Incremental Static Regeneration revalidation concepts',
            description: 'ISR lets you update static pages after deploy without a full rebuild by setting a revalidate interval. Pages are regenerated in the background when stale, keeping content fresh.',
            resources: [
              { label: 'Next.js: Incremental Static Regeneration', url: 'https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration', type: 'docs' },
              { label: 'Vercel: ISR explained', url: 'https://vercel.com/docs/incremental-static-regeneration', type: 'docs' }
            ]
          },
          {
            title: 'Metadata API and SEO configuration in Next.js App Router',
            description: 'The App Router Metadata API lets you export a metadata object from any layout or page to control title, description, and Open Graph tags. Dynamic metadata supports per-page SEO.',
            resources: [
              { label: 'Next.js: Metadata', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata', type: 'docs' },
              { label: 'Next.js: generateMetadata', url: 'https://nextjs.org/docs/app/api-reference/functions/generate-metadata', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Routing and Page Architecture',
        children: [
          {
            title: 'File-system routing and dynamic route segments explained',
            description: 'Next.js maps files in the pages or app directory directly to URL routes. Square-bracket filenames like [slug].tsx define dynamic segments that receive URL params as props.',
            resources: [
              { label: 'Next.js: Routing fundamentals', url: 'https://nextjs.org/docs/app/building-your-application/routing', type: 'docs' },
              { label: 'Next.js: Dynamic routes', url: 'https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes', type: 'docs' }
            ]
          },
          {
            title: 'App Router layouts, loading, and error boundaries',
            description: 'Layouts in the App Router persist UI across navigations and can nest. loading.tsx and error.tsx files provide built-in streaming and error boundary support for each route segment.',
            resources: [
              { label: 'Next.js: Layouts and pages', url: 'https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates', type: 'docs' },
              { label: 'Next.js: Loading UI', url: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Next.js Optimisation Features',
        children: [
          {
            title: 'next/image component for automatic image optimisation',
            description: 'The next/image component automatically generates WebP, resizes for the viewport, and lazy-loads images. It avoids layout shift by requiring explicit width and height props.',
            resources: [
              { label: 'Next.js: Image optimisation', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/images', type: 'docs' },
              { label: 'Next.js: next/image API', url: 'https://nextjs.org/docs/app/api-reference/components/image', type: 'docs' }
            ]
          },
          {
            title: 'next/font for self-hosted Google Fonts without layout shift',
            description: 'next/font downloads Google Fonts at build time and serves them from your own domain, eliminating the extra DNS lookup and preventing font-induced layout shifts.',
            resources: [
              { label: 'Next.js: Font optimisation', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/fonts', type: 'docs' },
              { label: 'Next.js: next/font API', url: 'https://nextjs.org/docs/app/api-reference/components/font', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Data Fetching Patterns',
        children: [
          {
            title: 'Server Components data fetching with async/await',
            description: 'React Server Components allow direct async data fetching inside the component body without useEffect. The data is fetched on the server, reducing client-side JavaScript.',
            resources: [
              { label: 'Next.js: Fetching data', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching', type: 'docs' },
              { label: 'Next.js: Server Components', url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components', type: 'docs' }
            ]
          },
          {
            title: 'Caching and revalidation strategies with fetch options',
            description: 'Next.js extends the native fetch API with cache and next.revalidate options. Setting revalidate controls how often cached data is refreshed without a full redeploy.',
            resources: [
              { label: 'Next.js: Caching', url: 'https://nextjs.org/docs/app/building-your-application/caching', type: 'docs' },
              { label: 'Next.js: Revalidating data', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-4': {
    sideLeft: [
      {
        title: 'Gatsby Architecture Concepts',
        children: [
          {
            title: 'Gatsby build process and the data layer overview',
            description: 'Gatsby builds a GraphQL data layer at compile time by sourcing from files, CMSs, and APIs. Pages then query this layer statically, producing pre-rendered HTML for every route.',
            resources: [
              { label: 'Gatsby: How Gatsby works', url: 'https://www.gatsbyjs.com/docs/conceptual/gatsby-concepts/', type: 'docs' },
              { label: 'Gatsby: GraphQL data layer', url: 'https://www.gatsbyjs.com/docs/reference/graphql-data-layer/', type: 'docs' }
            ]
          },
          {
            title: 'Static queries versus page queries and their scope',
            description: 'Page queries receive variables from the page context and suit dynamic routes. Static queries via useStaticQuery hook work in any component but cannot accept variables.',
            resources: [
              { label: 'Gatsby: Page query', url: 'https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/', type: 'docs' },
              { label: 'Gatsby: useStaticQuery', url: 'https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/', type: 'docs' }
            ]
          },
          {
            title: 'Programmatic page creation with createPages API',
            description: 'The createPages API in gatsby-node.js lets you generate pages from data at build time. You provide a template component and inject context variables passed into the page query.',
            resources: [
              { label: 'Gatsby: Creating pages programmatically', url: 'https://www.gatsbyjs.com/docs/programmatically-create-pages-from-data/', type: 'docs' },
              { label: 'Gatsby: gatsby-node.js APIs', url: 'https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Source Plugins and Data Sourcing',
        children: [
          {
            title: 'How source plugins pull external data into Gatsby GraphQL',
            description: 'Source plugins fetch data from third-party services like CMSs or APIs and create GraphQL nodes. Gatsby provides official plugins for Contentful, WordPress, and the filesystem.',
            resources: [
              { label: 'Gatsby: Source plugins overview', url: 'https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/creating-a-source-plugin/', type: 'docs' },
              { label: 'Gatsby Plugin Library', url: 'https://www.gatsbyjs.com/plugins/', type: 'docs' }
            ]
          },
          {
            title: 'Writing GraphQL queries with Gatsby GraphiQL explorer',
            description: 'GraphiQL is an in-browser IDE available at localhost:8000/___graphql during development. It provides autocomplete and schema introspection to help you craft correct queries quickly.',
            resources: [
              { label: 'Gatsby: Using GraphiQL', url: 'https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/', type: 'docs' },
              { label: 'GraphQL.org: Introduction', url: 'https://graphql.org/learn/', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Gatsby Image and Build Tooling',
        children: [
          {
            title: 'gatsby-plugin-image for responsive image processing',
            description: 'gatsby-plugin-image generates multiple resolutions and formats at build time and ships the StaticImage and GatsbyImage components. Images are automatically lazy-loaded with blur-up placeholders.',
            resources: [
              { label: 'Gatsby: gatsby-plugin-image', url: 'https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/', type: 'docs' },
              { label: 'Gatsby: How-to guide for images', url: 'https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image/', type: 'docs' }
            ]
          },
          {
            title: 'Gatsby configuration with gatsby-config.js and plugins',
            description: 'gatsby-config.js defines site metadata, active plugins, and their options. The plugin order matters for transformer plugins that depend on source plugin output.',
            resources: [
              { label: 'Gatsby: gatsby-config.js API', url: 'https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/', type: 'docs' },
              { label: 'Gatsby: Using plugins', url: 'https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/using-a-plugin-in-your-site/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Templates and Dynamic Routes',
        children: [
          {
            title: 'Creating blog post templates with dynamic slug routing',
            description: 'A common Gatsby pattern creates a template component and loops over Markdown or CMS nodes in gatsby-node.js to generate one page per post. The slug comes from the node path or a custom field.',
            resources: [
              { label: 'Gatsby: Building a blog', url: 'https://www.gatsbyjs.com/docs/tutorial/getting-started/', type: 'docs' },
              { label: 'Gatsby: Creating pages from Markdown', url: 'https://www.gatsbyjs.com/docs/how-to/routing/adding-markdown-pages/', type: 'docs' }
            ]
          },
          {
            title: 'gatsby-transformer-remark for Markdown content parsing',
            description: 'gatsby-transformer-remark converts Markdown files sourced by gatsby-source-filesystem into queryable GraphQL nodes. You can extend it with remark plugins for syntax highlighting and more.',
            resources: [
              { label: 'Gatsby: gatsby-transformer-remark', url: 'https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-5': {
    sideLeft: [
      {
        title: 'Contentful Data Modelling',
        children: [
          {
            title: 'Content types, fields, and validation in Contentful',
            description: 'Content types define the schema for your content entries, similar to database tables. Each field has a type constraint and optional validations like required or unique.',
            resources: [
              { label: 'Contentful: Content modelling guide', url: 'https://www.contentful.com/developers/docs/concepts/data-model/', type: 'docs' },
              { label: 'Contentful: Content type API', url: 'https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types', type: 'docs' }
            ]
          },
          {
            title: 'Preview versus published environments and content workflow',
            description: 'Contentful separates preview and delivery API keys. The preview API returns draft entries, enabling staging previews before content is published to production.',
            resources: [
              { label: 'Contentful: Content Preview API', url: 'https://www.contentful.com/developers/docs/references/content-preview-api/', type: 'docs' },
              { label: 'Contentful: Environments', url: 'https://www.contentful.com/developers/docs/concepts/multiple-environments/', type: 'docs' }
            ]
          },
          {
            title: 'Rich text field rendering in React components',
            description: 'Rich text fields store structured content as a node tree. The @contentful/rich-text-react-renderer package converts this tree into React elements with customisable node renderers.',
            resources: [
              { label: 'Contentful: Rich text tutorial', url: 'https://www.contentful.com/blog/rendering-linked-assets-entries-in-contentful-rich-text/', type: 'article' },
              { label: 'Contentful: rich-text-react-renderer npm', url: 'https://www.npmjs.com/package/@contentful/rich-text-react-renderer', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Contentful API Concepts',
        children: [
          {
            title: 'Content Delivery API vs Content Management API differences',
            description: 'The CDA is a read-only, CDN-backed API for fetching published content in production. The CMA has write access and is used for migrations, seeding, and editorial tooling.',
            resources: [
              { label: 'Contentful: Content Delivery API', url: 'https://www.contentful.com/developers/docs/references/content-delivery-api/', type: 'docs' },
              { label: 'Contentful: Content Management API', url: 'https://www.contentful.com/developers/docs/references/content-management-api/', type: 'docs' }
            ]
          },
          {
            title: 'GraphQL API for typed content queries in Contentful',
            description: 'Contentful exposes a per-space GraphQL endpoint that mirrors your content types as strongly typed queries. This enables co-locating data requirements with components.',
            resources: [
              { label: 'Contentful: GraphQL API', url: 'https://www.contentful.com/developers/docs/references/graphql/', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Querying and Fetching Contentful',
        children: [
          {
            title: 'Fetching entries with the Contentful JS SDK',
            description: 'The contentful npm package wraps the CDA with typed methods like getEntries and getEntry. Filtering by content type and selecting specific fields reduces payload size.',
            resources: [
              { label: 'Contentful: JavaScript SDK', url: 'https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/', type: 'docs' },
              { label: 'Contentful: contentful npm package', url: 'https://www.npmjs.com/package/contentful', type: 'docs' }
            ]
          },
          {
            title: 'Querying linked assets and nested references from CDA',
            description: 'Contentful entries can reference other entries and assets. Setting the include depth parameter resolves linked entries inline, avoiding waterfall requests for nested content.',
            resources: [
              { label: 'Contentful: Links and includes', url: 'https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/links', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Assets, Media and Gatsby Integration',
        children: [
          {
            title: 'Contentful Image API for on-demand image transformation',
            description: 'Contentful assets are served through a CDN that accepts query parameters for width, height, format, and quality. This enables responsive images without a separate image service.',
            resources: [
              { label: 'Contentful: Images API', url: 'https://www.contentful.com/developers/docs/references/images-api/', type: 'docs' }
            ]
          },
          {
            title: 'gatsby-source-contentful plugin setup and configuration',
            description: 'gatsby-source-contentful pulls all published entries into the Gatsby GraphQL layer. You configure it with your space ID and access token in gatsby-config.js.',
            resources: [
              { label: 'Gatsby: gatsby-source-contentful', url: 'https://www.gatsbyjs.com/plugins/gatsby-source-contentful/', type: 'docs' },
              { label: 'Contentful: Gatsby integration guide', url: 'https://www.contentful.com/developers/docs/tutorials/general/get-started/', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-6': {
    sideLeft: [
      {
        title: 'Serverless Functions Concepts',
        children: [
          {
            title: 'Serverless execution model and cold start trade-offs',
            description: 'Serverless functions run in isolated, stateless containers spun up on demand. Cold starts add latency on the first invocation but the model eliminates server management entirely.',
            resources: [
              { label: 'Netlify: Serverless functions overview', url: 'https://docs.netlify.com/functions/overview/', type: 'docs' },
              { label: 'web.dev: Serverless explained', url: 'https://web.dev/serverless/', type: 'article' }
            ]
          },
          {
            title: 'HTTP request and response structure in serverless handlers',
            description: 'Netlify and Vercel functions receive an event object with headers, query params, and body. The handler returns a status code, headers, and body just like a standard HTTP server.',
            resources: [
              { label: 'Netlify: Function invocation', url: 'https://docs.netlify.com/functions/create/?fn-language=js', type: 'docs' },
              { label: 'Vercel: Serverless functions', url: 'https://vercel.com/docs/functions/serverless-functions', type: 'docs' }
            ]
          },
          {
            title: 'Environment variables and secrets management in functions',
            description: 'API keys must never be bundled into client-side code. Serverless functions access secrets through environment variables configured in the deployment platform dashboard.',
            resources: [
              { label: 'Netlify: Environment variables', url: 'https://docs.netlify.com/environment-variables/overview/', type: 'docs' },
              { label: 'Next.js: Environment variables', url: 'https://nextjs.org/docs/app/building-your-application/configuring/environment-variables', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Error Handling and Rate Limits',
        children: [
          {
            title: 'Rate limiting strategies and handling 429 API responses',
            description: 'External APIs enforce rate limits and return 429 Too Many Requests when exceeded. Implementing exponential backoff and request queuing prevents cascading failures.',
            resources: [
              { label: 'MDN: HTTP status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status', type: 'docs' },
              { label: 'Netlify: Function timeout and limits', url: 'https://docs.netlify.com/functions/limits/', type: 'docs' }
            ]
          },
          {
            title: 'CORS configuration for serverless function endpoints',
            description: 'Browser requests to serverless functions from a different origin require CORS headers. You must set Access-Control-Allow-Origin and handle the preflight OPTIONS request.',
            resources: [
              { label: 'MDN: CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', type: 'docs' },
              { label: 'Netlify: CORS with functions', url: 'https://docs.netlify.com/functions/cors/', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Calling External APIs Securely',
        children: [
          {
            title: 'Proxying third-party API calls through serverless functions',
            description: 'A serverless proxy function receives client requests, adds secret API keys from environment variables, and forwards the call. This keeps credentials off the client entirely.',
            resources: [
              { label: 'Netlify: Functions as API proxies', url: 'https://docs.netlify.com/functions/overview/#use-cases', type: 'docs' },
              { label: 'MDN: Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API', type: 'docs' }
            ]
          },
          {
            title: 'Form submission handling without a backend server',
            description: 'Serverless functions can receive form POST requests, validate input, and send emails via services like SendGrid or Mailgun. Netlify Forms provides zero-config form handling as an alternative.',
            resources: [
              { label: 'Netlify: Forms overview', url: 'https://docs.netlify.com/forms/overview/', type: 'docs' },
              { label: 'Netlify: Form handling with functions', url: 'https://docs.netlify.com/forms/setup/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Next.js API Routes and Edge Functions',
        children: [
          {
            title: 'Next.js Route Handlers as serverless API endpoints',
            description: 'Files in the app/api directory export named HTTP method handlers that become serverless functions on Vercel. They share the same Node.js environment as the rest of the app.',
            resources: [
              { label: 'Next.js: Route Handlers', url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers', type: 'docs' }
            ]
          },
          {
            title: 'Edge Functions for low-latency personalisation and middleware',
            description: 'Edge Functions run on the CDN edge, close to the user, in a lightweight V8 runtime. They are ideal for A/B testing, redirects, and auth checks with sub-millisecond overhead.',
            resources: [
              { label: 'Next.js: Edge runtime', url: 'https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes', type: 'docs' },
              { label: 'Netlify: Edge Functions', url: 'https://docs.netlify.com/edge-functions/overview/', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-7': {
    sideLeft: [
      {
        title: 'Authentication Concepts',
        children: [
          {
            title: 'OAuth 2.0 and OpenID Connect flows explained',
            description: 'OAuth 2.0 delegates authorisation to an identity provider while OpenID Connect adds an identity layer on top. The authorisation code flow with PKCE is the safest choice for SPAs.',
            resources: [
              { label: 'Auth0: OAuth 2.0 overview', url: 'https://auth0.com/intro-to-iam/what-is-oauth-2', type: 'article' },
              { label: 'MDN: HTTP authentication', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication', type: 'docs' }
            ]
          },
          {
            title: 'JWT structure, signing, and verification fundamentals',
            description: 'A JWT contains a base64-encoded header, payload, and signature. The server verifies the signature with a secret or public key, so no session lookup is needed per request.',
            resources: [
              { label: 'jwt.io: Introduction to JSON Web Tokens', url: 'https://jwt.io/introduction', type: 'article' },
              { label: 'Auth0: JWT explained', url: 'https://auth0.com/learn/json-web-tokens', type: 'article' }
            ]
          },
          {
            title: 'Session cookies versus token-based authentication comparison',
            description: 'Session cookies store a server-side session ID in a HttpOnly cookie; tokens are self-contained and stateless. Cookies provide better security defaults for web apps; tokens suit APIs and mobile clients.',
            resources: [
              { label: 'MDN: HTTP cookies', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies', type: 'docs' },
              { label: 'web.dev: Same-site cookies explained', url: 'https://web.dev/samesite-cookies-explained/', type: 'article' }
            ]
          }
        ]
      },
      {
        title: 'Roles and Access Control',
        children: [
          {
            title: 'Role-based access control and gated content patterns',
            description: 'RBAC assigns roles like admin or member to users, and each route or resource checks the role before granting access. Storing roles in JWT claims enables stateless authorisation.',
            resources: [
              { label: 'Auth0: RBAC overview', url: 'https://auth0.com/docs/manage-users/access-control/rbac', type: 'docs' },
              { label: 'Next.js: Middleware for auth', url: 'https://nextjs.org/docs/app/building-your-application/routing/middleware', type: 'docs' }
            ]
          },
          {
            title: 'Protecting serverless API routes from unauthenticated requests',
            description: 'Serverless functions must validate the JWT on every request since they are stateless. Libraries like jsonwebtoken verify the token and reject requests without a valid bearer token.',
            resources: [
              { label: 'Netlify: Identity-based access', url: 'https://docs.netlify.com/security/secure-access-to-builds/site-protection/', type: 'docs' },
              { label: 'Next.js: Server actions security', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Auth Providers and SDKs',
        children: [
          {
            title: 'NextAuth.js setup with GitHub and Google OAuth providers',
            description: 'NextAuth.js (Auth.js) integrates into the Next.js App Router with a single route handler. Configuring OAuth providers requires creating app credentials in the provider dashboard.',
            resources: [
              { label: 'Auth.js: Getting started', url: 'https://authjs.dev/getting-started/installation', type: 'docs' },
              { label: 'Auth.js: OAuth providers', url: 'https://authjs.dev/getting-started/providers/oauth-tutorial', type: 'docs' }
            ]
          },
          {
            title: 'Netlify Identity for zero-config JAMstack authentication',
            description: 'Netlify Identity provides sign-up, login, and JWT issuance with no backend code. The netlify-identity-widget handles the UI flow and exposes user data to serverless functions via context.',
            resources: [
              { label: 'Netlify: Identity documentation', url: 'https://docs.netlify.com/security/secure-access-to-builds/manage-team/', type: 'docs' },
              { label: 'Netlify: Identity widget on npm', url: 'https://www.npmjs.com/package/netlify-identity-widget', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Login Flows and Route Protection',
        children: [
          {
            title: 'Building login and signup forms with validation',
            description: 'Login forms send credentials to an auth endpoint and store the returned token in a cookie or memory. Client-side validation improves UX while server-side validation enforces security.',
            resources: [
              { label: 'react.dev: Forms', url: 'https://react.dev/reference/react-dom/components/input', type: 'docs' },
              { label: 'MDN: Client-side form validation', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation', type: 'docs' }
            ]
          },
          {
            title: 'Next.js Middleware for protecting authenticated routes',
            description: 'Middleware runs before every matched route and can redirect unauthenticated users to the login page. Checking a session cookie or verifying a JWT in middleware is the recommended pattern.',
            resources: [
              { label: 'Next.js: Middleware', url: 'https://nextjs.org/docs/app/building-your-application/routing/middleware', type: 'docs' },
              { label: 'Auth.js: Protecting routes', url: 'https://authjs.dev/getting-started/session-management/protecting', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-8': {
    sideLeft: [
      {
        title: 'Core Web Vitals Theory',
        children: [
          {
            title: 'LCP, CLS, and INP metrics and what affects them',
            description: 'Largest Contentful Paint measures loading, Cumulative Layout Shift measures visual stability, and Interaction to Next Paint measures responsiveness. Each has a specific good/needs improvement/poor threshold.',
            resources: [
              { label: 'web.dev: Core Web Vitals', url: 'https://web.dev/articles/vitals', type: 'article' },
              { label: 'web.dev: LCP', url: 'https://web.dev/articles/lcp', type: 'article' }
            ]
          },
          {
            title: 'Code splitting and lazy loading to reduce bundle size',
            description: 'Code splitting breaks JavaScript into smaller chunks loaded on demand. React.lazy and dynamic imports defer non-critical code, reducing the initial bundle and improving LCP.',
            resources: [
              { label: 'react.dev: lazy loading components', url: 'https://react.dev/reference/react/lazy', type: 'docs' },
              { label: 'Next.js: Dynamic imports', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading', type: 'docs' }
            ]
          },
          {
            title: 'SEO structured data with JSON-LD and schema.org markup',
            description: 'JSON-LD embedded in a <script type="application/ld+json"> tag signals content type to search engines. Schema.org types like Article, Product, and BreadcrumbList enable rich snippets.',
            resources: [
              { label: 'Google: Structured data introduction', url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data', type: 'docs' },
              { label: 'schema.org: Full type hierarchy', url: 'https://schema.org/docs/full.html', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'SEO Fundamentals',
        children: [
          {
            title: 'Sitemaps and robots.txt for crawl budget management',
            description: 'An XML sitemap lists every URL you want indexed and helps search engines discover new pages quickly. robots.txt controls which paths crawlers are allowed to visit.',
            resources: [
              { label: 'Google: Build and submit a sitemap', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap', type: 'docs' },
              { label: 'Google: robots.txt introduction', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro', type: 'docs' }
            ]
          },
          {
            title: 'Open Graph and Twitter Card meta tags for social sharing',
            description: 'Open Graph meta tags control how your pages appear when shared on Facebook, LinkedIn, and Slack. Twitter Card tags do the same for Twitter and require og:image to be at least 600px wide.',
            resources: [
              { label: 'Open Graph Protocol specification', url: 'https://ogp.me/', type: 'docs' },
              { label: 'Next.js: OpenGraph images', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata#opengraph-image-and-twitter-image', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Image and Asset Optimisation',
        children: [
          {
            title: 'Image formats WebP and AVIF for smaller file sizes',
            description: 'WebP provides roughly 30% smaller files than JPEG at equivalent quality, and AVIF compresses even further. next/image and gatsby-plugin-image generate both formats automatically.',
            resources: [
              { label: 'web.dev: Use modern image formats', url: 'https://web.dev/uses-optimized-images/', type: 'article' },
              { label: 'MDN: Image file type guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types', type: 'docs' }
            ]
          },
          {
            title: 'Preloading critical fonts and eliminating render-blocking resources',
            description: 'Fonts block rendering unless preloaded or loaded asynchronously. Using font-display: swap prevents invisible text and the next/font module handles preloading automatically.',
            resources: [
              { label: 'web.dev: Eliminate render-blocking resources', url: 'https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/', type: 'article' },
              { label: 'MDN: font-display', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Lighthouse and Performance Auditing',
        children: [
          {
            title: 'Running Lighthouse CI in GitHub Actions for regressions',
            description: 'Lighthouse CI runs automated audits on every pull request and fails the build if performance scores drop below a threshold. Configuration is defined in a lighthouserc.json file.',
            resources: [
              { label: 'Lighthouse CI: Getting started', url: 'https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md', type: 'docs' },
              { label: 'web.dev: Lighthouse CI', url: 'https://web.dev/lighthouse-ci/', type: 'article' }
            ]
          },
          {
            title: 'Chrome DevTools Performance panel for diagnosing bottlenecks',
            description: 'The Performance panel records a flame chart of JS execution, layout, and paint events. Long tasks blocking the main thread are the primary cause of poor INP scores.',
            resources: [
              { label: 'Chrome DevTools: Performance overview', url: 'https://developer.chrome.com/docs/devtools/performance/', type: 'docs' },
              { label: 'web.dev: Diagnose performance issues', url: 'https://web.dev/diagnose-performance-issues-in-the-field/', type: 'article' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-9': {
    sideLeft: [
      {
        title: 'E-commerce Architecture Concepts',
        children: [
          {
            title: 'Product catalogue modelling in a headless CMS',
            description: 'Product content types store name, description, price, and images as structured fields. Variants like size or colour can be modelled as nested entries or JSON fields depending on the CMS.',
            resources: [
              { label: 'Contentful: E-commerce content model', url: 'https://www.contentful.com/blog/e-commerce-content-model/', type: 'article' },
              { label: 'Stripe: Products and prices overview', url: 'https://stripe.com/docs/products-prices/overview', type: 'docs' }
            ]
          },
          {
            title: 'Cart state management with Context API or Zustand',
            description: 'Cart state must persist across route changes, so it lives above the router in a React Context or a lightweight store like Zustand. localStorage can hydrate the cart on page refresh.',
            resources: [
              { label: 'react.dev: useContext', url: 'https://react.dev/reference/react/useContext', type: 'docs' },
              { label: 'Zustand: Getting started', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction', type: 'docs' }
            ]
          },
          {
            title: 'Stripe payment intents and the checkout session flow',
            description: 'Stripe Checkout Sessions are server-created objects that produce a hosted payment page URL. On success, Stripe redirects to your success URL with a session ID for order confirmation.',
            resources: [
              { label: 'Stripe: Checkout overview', url: 'https://stripe.com/docs/payments/checkout', type: 'docs' },
              { label: 'Stripe: How Checkout works', url: 'https://stripe.com/docs/payments/checkout/how-checkout-works', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Webhooks and Order Processing',
        children: [
          {
            title: 'Stripe webhooks for reliable post-payment event processing',
            description: 'Webhooks send signed POST requests to your serverless function when payment events like checkout.session.completed occur. Verifying the Stripe-Signature header prevents spoofed events.',
            resources: [
              { label: 'Stripe: Webhooks overview', url: 'https://stripe.com/docs/webhooks', type: 'docs' },
              { label: 'Stripe: Verify webhook signatures', url: 'https://stripe.com/docs/webhooks/signatures', type: 'docs' }
            ]
          },
          {
            title: 'Order confirmation emails with serverless and SendGrid',
            description: 'After a successful payment webhook, a serverless function can trigger a transactional email via SendGrid or Resend. The email template includes order details from the Stripe session.',
            resources: [
              { label: 'SendGrid: Node.js quickstart', url: 'https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs', type: 'docs' },
              { label: 'Stripe: Fulfil orders with webhooks', url: 'https://stripe.com/docs/payments/checkout/fulfill-orders', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Stripe Integration Tooling',
        children: [
          {
            title: 'Stripe JS SDK and stripe-js client-side integration',
            description: 'The @stripe/stripe-js package loads Stripe.js asynchronously and exposes methods for creating payment elements. Always load it from Stripe CDN to satisfy PCI compliance.',
            resources: [
              { label: 'Stripe: stripe-js npm package', url: 'https://www.npmjs.com/package/@stripe/stripe-js', type: 'docs' },
              { label: 'Stripe: Stripe.js reference', url: 'https://stripe.com/docs/js', type: 'docs' }
            ]
          },
          {
            title: 'Stripe CLI for local webhook testing and event replay',
            description: 'stripe listen forwards live webhook events to your localhost serverless function. stripe trigger fires test events so you can verify your webhook handler without real payments.',
            resources: [
              { label: 'Stripe: CLI reference', url: 'https://stripe.com/docs/stripe-cli', type: 'docs' },
              { label: 'Stripe: Test webhooks locally', url: 'https://stripe.com/docs/webhooks/test', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Dynamic Data and Serverless Checkout',
        children: [
          {
            title: 'Creating Stripe Checkout Sessions in serverless functions',
            description: 'A serverless function uses the Stripe Node SDK to create a Checkout Session with line_items derived from the cart. The session URL is returned to the client for redirect.',
            resources: [
              { label: 'Stripe: Create a Checkout Session', url: 'https://stripe.com/docs/api/checkout/sessions/create', type: 'docs' },
              { label: 'Netlify: Functions with Stripe', url: 'https://docs.netlify.com/functions/examples/', type: 'docs' }
            ]
          },
          {
            title: 'Reading Stripe session data on the success page',
            description: 'The success URL can include {CHECKOUT_SESSION_ID} as a template variable. Your success page fetches this session ID from a serverless proxy to display the confirmed order details.',
            resources: [
              { label: 'Stripe: Retrieve a session', url: 'https://stripe.com/docs/api/checkout/sessions/retrieve', type: 'docs' }
            ]
          }
        ]
      }
    ]
  },

  'jamstack-10': {
    sideLeft: [
      {
        title: 'Continuous Delivery Concepts',
        children: [
          {
            title: 'Git-based deployments and trunk-based development workflow',
            description: 'Netlify and Vercel deploy automatically when you push to your configured branch. Trunk-based development keeps the main branch always deployable by using short-lived feature branches.',
            resources: [
              { label: 'Netlify: Git-based deployments', url: 'https://docs.netlify.com/site-deploys/create-deploys/', type: 'docs' },
              { label: 'Netlify: Deploy documentation', url: 'https://docs.netlify.com/site-deploys/overview/', type: 'docs' }
            ]
          },
          {
            title: 'Deploy previews for pull request review and testing',
            description: 'Deploy previews generate a unique URL for every pull request so stakeholders can review changes before merge. Each preview runs the full build pipeline in an isolated environment.',
            resources: [
              { label: 'Netlify: Deploy previews', url: 'https://docs.netlify.com/site-deploys/deploy-previews/', type: 'docs' },
              { label: 'Vercel: Preview deployments', url: 'https://vercel.com/docs/deployments/preview-deployments', type: 'docs' }
            ]
          },
          {
            title: 'Build hooks for triggering deploys from CMS content changes',
            description: 'A build hook is a unique URL that triggers a new deploy when called via HTTP POST. Contentful and Sanity webhooks can call this URL whenever content is published.',
            resources: [
              { label: 'Netlify: Build hooks', url: 'https://docs.netlify.com/configure-builds/build-hooks/', type: 'docs' },
              { label: 'Contentful: Webhooks for build triggers', url: 'https://www.contentful.com/developers/docs/tutorials/general/automate-site-builds-with-webhooks/', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Monitoring and Rollbacks',
        children: [
          {
            title: 'Instant rollbacks to previous deploys on Netlify',
            description: 'Netlify retains every previous deploy and lets you one-click restore any prior version. This provides a safety net if a new deploy introduces a regression caught after release.',
            resources: [
              { label: 'Netlify: Rollbacks', url: 'https://docs.netlify.com/site-deploys/manage-deploys/', type: 'docs' }
            ]
          },
          {
            title: 'Error monitoring with Sentry for production JAMstack apps',
            description: 'Sentry captures JavaScript exceptions and serverless function errors with full stack traces and context. Integrating source maps lets Sentry show the original TypeScript source of minified errors.',
            resources: [
              { label: 'Sentry: Next.js integration', url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/', type: 'docs' },
              { label: 'Netlify: Analytics overview', url: 'https://docs.netlify.com/monitor-sites/analytics/', type: 'docs' }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: 'Netlify Configuration and Build',
        children: [
          {
            title: 'netlify.toml build commands, publish directory, and plugins',
            description: 'netlify.toml defines your build command, publish directory, and environment-specific overrides. Netlify Build Plugins extend the build pipeline with hooks like onPreBuild and onPostBuild.',
            resources: [
              { label: 'Netlify: netlify.toml reference', url: 'https://docs.netlify.com/configure-builds/file-based-configuration/', type: 'docs' },
              { label: 'Netlify: Build plugins', url: 'https://docs.netlify.com/integrations/build-plugins/', type: 'docs' }
            ]
          },
          {
            title: 'Managing build environment variables per deploy context',
            description: 'Netlify supports different environment variable values per context (production, deploy-preview, branch-deploy). This lets you point staging deploys at a different CMS environment or API endpoint.',
            resources: [
              { label: 'Netlify: Environment variables per context', url: 'https://docs.netlify.com/environment-variables/overview/#deploy-contexts', type: 'docs' }
            ]
          }
        ]
      },
      {
        title: 'Custom Domains and HTTPS',
        children: [
          {
            title: 'Configuring a custom domain and automatic TLS on Netlify',
            description: 'Netlify provisions a free Let\'s Encrypt certificate automatically when you add a custom domain. You add a CNAME or A record in your DNS provider pointing to Netlify\'s load balancer.',
            resources: [
              { label: 'Netlify: Custom domains', url: 'https://docs.netlify.com/domains-https/custom-domains/', type: 'docs' },
              { label: 'Netlify: HTTPS setup', url: 'https://docs.netlify.com/domains-https/https-ssl/', type: 'docs' }
            ]
          },
          {
            title: 'Netlify redirect rules and _redirects file configuration',
            description: 'The _redirects file in your publish directory maps old URLs to new ones with optional HTTP status codes. Rules support wildcards and splats for flexible migration patterns.',
            resources: [
              { label: 'Netlify: Redirects and rewrites', url: 'https://docs.netlify.com/routing/redirects/', type: 'docs' },
              { label: 'Netlify: Redirect syntax', url: 'https://docs.netlify.com/routing/redirects/redirect-options/', type: 'docs' }
            ]
          }
        ]
      }
    ]
  }
};

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

let count = 0;
for (const track of Object.values(data)) {
  if (!Array.isArray(track)) continue;
  for (const layer of track) {
    if (patches[layer.id]) {
      Object.assign(layer, patches[layer.id]);
      count++;
    }
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${count} patches`);
