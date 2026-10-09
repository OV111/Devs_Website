// Single source of truth for SEO. The build-time sitemap script and the
// <RouteSeo /> component both read from here, so a page cannot be in one
// and forgotten in the other.
//
// DRAFT COPY: titles/descriptions below are placeholders built from page names
// and the home-page tagline. Review and rewrite them (title < 60 chars,
// description < 155 chars) before expecting them to rank.

export const SITE_URL = "https://vahoha.com";
export const SITE_NAME = "Vahoha";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_META = {
  title: "Vahoha",
  description:
    "Pass a graded exam to unlock each step of your developer roadmap, with an AI mentor that knows your weak spots.",
};

const category = (label, slug) => ({
  [`/categories/${slug}`]: {
    title: `${label} Developer Roadmap | ${SITE_NAME}`,
    description: `Follow the ${label} roadmap on ${SITE_NAME}: pass graded exams to unlock each layer, with an AI mentor.`,
  },
});

// Public, indexable pages. Key = pathname.
export const PUBLIC_PAGES = {
  "/": DEFAULT_META,
  "/roadmaps": {
    title: `Developer Roadmaps | ${SITE_NAME}`,
    description:
      "Browse developer roadmaps and unlock each layer by passing a graded exam. Guests can explore every path.",
  },
  "/foundations": {
    title: `Programming Foundations | ${SITE_NAME}`,
    description: `Start with the fundamentals every developer needs before choosing a specialty on ${SITE_NAME}.`,
  },
  "/pricing": {
    title: `Pricing | ${SITE_NAME}`,
    description: `See what is free and what is included in ${SITE_NAME} Pro.`,
  },
  "/about": {
    title: `About | ${SITE_NAME}`,
    description: `Why ${SITE_NAME} exists and how it helps developers learn through graded exams and an AI mentor.`,
  },
  "/contact": {
    title: `Contact | ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team.`,
  },
  "/privacy": {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `How ${SITE_NAME} collects, uses and protects your data.`,
  },
  "/terms": {
    title: `Terms of Service | ${SITE_NAME}`,
    description: `The terms that apply when you use ${SITE_NAME}.`,
  },
  ...category("Full Stack", "fullstack"),
  ...category("Backend", "backend"),
  ...category("Mobile", "mobile"),
  ...category("AI & ML", "ai&ml"),
  ...category("DevOps", "devops"),
  ...category("Data Science", "datascience"),
  ...category("Game Development", "gamedev"),
  ...category("QA", "qa"),
  ...category("Programming Languages", "languages"),
};

// Pages that must never be indexed (account, auth, per-user, admin).
// Anything under these prefixes gets <meta name="robots" content="noindex">
// and a Disallow line in robots.txt.
export const PRIVATE_PREFIXES = [
  "/my-profile",
  "/users",
  "/get-started",
  "/forgot-password",
  "/reset-password",
  "/oauth-success",
  "/ai-agent",
  "/billing",
  "/progress",
  "/team",
  "/capstone",
  "/blogs",
  "/libs",
  "/coding-challenges",
  "/voice-review",
  "/roadmaps/exam",
];

export const isPrivatePath = (pathname) =>
  PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

// JSON-LD per page type. Uses only facts already on the page (name, description).
// The home page's WebSite + Organization graph lives in index.html.
export const jsonLdFor = ({ title, description, path }) => {
  if (path.startsWith("/categories/")) {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: title.replace(` | ${SITE_NAME}`, ""),
      description,
      url: `${SITE_URL}${path}`,
      provider: { "@id": `${SITE_URL}/#organization` },
    };
  }
  return null;
};
