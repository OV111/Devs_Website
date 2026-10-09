import { DEFAULT_META, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./siteMeta";

// React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree
// into <head>, so no react-helmet is needed. Render <Seo /> in a page to
// override the route defaults from <RouteSeo />.
const Seo = ({
  title = DEFAULT_META.title,
  description = DEFAULT_META.description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd,
}) => {
  // In the build-time prerender, head tags are written by scripts/seoPostBuild.js
  // (a non-document render can't hoist them into <head>).
  if (import.meta.env.SSR) return null;
  const url = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={url} />
      )}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </>
  );
};

export default Seo;
