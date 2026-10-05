import { TRACKS } from "../../../../constants/roadmapPaths.js";
import { CATEGORY_OPTIONS2 } from "../../../../constants/Categories.js";

// The roadmaps page browses ONE flat catalog of tracks (each tagged with the
// domain it belongs to) instead of two levels of pills. Filtering is plain
// array work: with ~170 items there is nothing to gain from indexing.

/** Flatten `{ domainId: [track] }` into `[{ ...track, domain }]`, in domain order. */
export const buildCatalog = (tracksByDomain = TRACKS, domains = CATEGORY_OPTIONS2) =>
  domains.flatMap((domain) =>
    (tracksByDomain[domain.id] ?? []).map((track) => ({ ...track, domain })),
  );

/** `{ [domainId]: number }` for the filter chips. */
export const countByDomain = (items) =>
  items.reduce((counts, { domain }) => {
    counts[domain.id] = (counts[domain.id] ?? 0) + 1;
    return counts;
  }, {});

const haystack = (track) =>
  [track.title, track.domain.title, ...(track.techs ?? [])].join(" ").toLowerCase();

/**
 * Narrow by domain and by a search query. Every word in the query must match
 * somewhere (title, domain or a tech), so "react node" finds MERN but not
 * a track that only has React.
 */
export const filterCatalog = (items, { domainId = "all", query = "" } = {}) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((track) => {
    if (domainId !== "all" && track.domain.id !== domainId) return false;
    if (words.length === 0) return true;
    const text = haystack(track);
    return words.every((word) => text.includes(word));
  });
};
