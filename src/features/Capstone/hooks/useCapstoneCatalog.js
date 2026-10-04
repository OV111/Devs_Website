import { useEffect, useState } from "react";
import { capstoneApi } from "../capstoneApi";

// One request per page load, shared by every caller (the roadmap re-renders
// often and switches tracks; the catalog only changes when a brief is published).
let cached = null;
const loadCatalog = () => {
  cached ??= capstoneApi.catalog().catch((err) => {
    cached = null; // don't cache a failure — the next caller retries
    throw err;
  });
  return cached;
};

/** Tracks that have a published capstone: [{ trackId, trackTitle, briefTitle }]. */
export default function useCapstoneCatalog() {
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let alive = true;
    loadCatalog()
      .then((c) => alive && setCatalog(c))
      .catch(() => alive && setCatalog([])); // no capstone node beats a broken roadmap
    return () => {
      alive = false;
    };
  }, []);

  return catalog;
}
