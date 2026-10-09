// Runs after `vite build` + the SSR build of src/entry-prerender.jsx.
// For every public route it writes dist/<route>/index.html containing:
//   - the page's real HTML (prerendered), so crawlers get content without JS
//   - its own <title>, description, canonical, Open Graph tags and JSON-LD
// It also writes sitemap.xml, robots.txt and 404.html.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  PUBLIC_PAGES,
  PRIVATE_PREFIXES,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  jsonLdFor,
} from "../src/seo/siteMeta.js";

// The app reads localStorage while modules load (e.g. the theme store).
// Node has none, so give the prerender an empty in-memory one.
const memoryStorage = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() {
      return m.size;
    },
  };
};
// Node 22+ defines a stub global localStorage that throws unless started with
// --localstorage-file, so replace it rather than only filling a gap.
for (const name of ["localStorage", "sessionStorage"]) {
  Object.defineProperty(globalThis, name, { value: memoryStorage(), configurable: true, writable: true });
}

const SSR_ENTRY = resolve("dist-ssr/entry-prerender.js");
const { render: renderPage } = await import(pathToFileURL(SSR_ENTRY).href);

const DIST = "dist";
const template = readFileSync(join(DIST, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Remove the generic tags from index.html (they carry data-seo-static).
const base = template.replace(/^[ \t]*<(meta|title)\b[^>]*data-seo-static[^>]*>(.*?<\/title>)?\r?\n?/gim, "");

const headTags = ({ title, description, path, noindex }) => {
  const url = `${SITE_URL}${path}`;
  const t = esc(title);
  const d = esc(description);
  const lines = [
    `<title data-seo-static>${t}</title>`,
    `<meta data-seo-static name="description" content="${d}" />`,
    noindex
      ? `<meta data-seo-static name="robots" content="noindex, nofollow" />`
      : `<link data-seo-static rel="canonical" href="${esc(url)}" />`,
    `<meta data-seo-static property="og:type" content="website" />`,
    `<meta data-seo-static property="og:site_name" content="Vahoha" />`,
    `<meta data-seo-static property="og:title" content="${t}" />`,
    `<meta data-seo-static property="og:description" content="${d}" />`,
    `<meta data-seo-static property="og:url" content="${esc(url)}" />`,
    `<meta data-seo-static property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta data-seo-static name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo-static name="twitter:title" content="${t}" />`,
    `<meta data-seo-static name="twitter:description" content="${d}" />`,
    `<meta data-seo-static name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  ];
  const ld = !noindex && jsonLdFor({ title, description, path });
  if (ld) lines.push(`<script data-seo-static type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\u003c")}</script>`);
  return lines.map((l) => `    ${l}`).join("\n") + "\n";
};

// Page HTML goes in #prerender, a sibling of #root. CSS in index.html hides
// #root while #prerender exists; the app removes #prerender once the live
// page has mounted (see PrerenderHandoff), so visitors never see a blank gap.
const render = (meta, bodyHtml = "") => {
  let html = base.replace("</head>", `${headTags(meta)}  </head>`);
  if (bodyHtml) html = html.replace('<div id="root"></div>', `<div id="prerender">${bodyHtml}</div>
    <div id="root"></div>`);
  return html;
};

for (const [path, meta] of Object.entries(PUBLIC_PAGES)) {
  const { html: body } = await renderPage(path);
  const html = render({ ...meta, path }, body);
  if (path === "/") {
    writeFileSync(join(DIST, "index.html"), html);
  } else {
    const dir = join(DIST, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
}

writeFileSync(
  join(DIST, "404.html"),
  render({ title: "Page not found | Vahoha", description: "This page does not exist.", path: "/404", noindex: true }),
);

const urls = Object.keys(PUBLIC_PAGES)
  .map((p) => `  <url>\n    <loc>${esc(SITE_URL + p)}</loc>\n  </url>`)
  .join("\n");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

const disallow = ["/api/", ...PRIVATE_PREFIXES.map((p) => `${p}/`), ...PRIVATE_PREFIXES]
  .map((p) => `Disallow: ${p}`)
  .join("\n");
writeFileSync(
  join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n${disallow}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

rmSync("dist-ssr", { recursive: true, force: true });

console.log(`SEO: ${Object.keys(PUBLIC_PAGES).length} pages, sitemap, robots, 404 written to ${DIST}/`);
