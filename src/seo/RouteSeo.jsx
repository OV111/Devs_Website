import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "./Seo";
import { PUBLIC_PAGES, isPrivatePath, jsonLdFor } from "./siteMeta";

// Mounted once in MainLayout. Public pages get their entry from PUBLIC_PAGES;
// private/unknown routes get noindex by default, so a new page is safe
// (not indexed) until it is added to the public list on purpose.
const RouteSeo = () => {
  const { pathname: rawPath } = useLocation();
  // "/pricing/" and "/pricing" are the same page; match and canonicalize without the slash.
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  // index.html / the build step ship static tags so crawlers that skip JS see
  // real metadata. Once React runs it owns the head, so drop the static copies
  // to avoid duplicate title/description/canonical tags.
  useEffect(() => {
    document.querySelectorAll("[data-seo-static]").forEach((el) => el.remove());
  }, []);
  const meta = PUBLIC_PAGES[pathname];
  if (isPrivatePath(pathname) || !meta) {
    return <Seo noindex path={pathname} title="Vahoha" />;
  }
  return <Seo {...meta} path={pathname} jsonLd={jsonLdFor({ ...meta, path: pathname })} />;
};

export default RouteSeo;
