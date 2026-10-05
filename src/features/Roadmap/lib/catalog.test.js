import { describe, it, expect } from "vitest";
import { buildCatalog, countByDomain, filterCatalog } from "./catalog.js";

const domains = [
  { id: "fullstack", title: "Full Stack" },
  { id: "mobile", title: "Mobile" },
];
const tracks = {
  fullstack: [
    { id: "mern", title: "MERN Developer", techs: ["MongoDB", "React", "Node.js"] },
    { id: "t3", title: "T3 Stack Dev", techs: ["Next.js", "TypeScript"] },
  ],
  mobile: [{ id: "rn", title: "React Native", techs: ["React", "Expo"] }],
};
const catalog = buildCatalog(tracks, domains);

describe("buildCatalog", () => {
  it("flattens tracks in domain order and tags each with its domain", () => {
    expect(catalog.map((t) => t.id)).toEqual(["mern", "t3", "rn"]);
    expect(catalog[2].domain.id).toBe("mobile");
  });

  it("skips domains that have no tracks", () => {
    expect(buildCatalog({ fullstack: tracks.fullstack }, domains)).toHaveLength(2);
  });
});

describe("countByDomain", () => {
  it("counts tracks per domain", () => {
    expect(countByDomain(catalog)).toEqual({ fullstack: 2, mobile: 1 });
  });
});

describe("filterCatalog", () => {
  it("returns everything with no filters", () => {
    expect(filterCatalog(catalog)).toHaveLength(3);
  });

  it("filters by domain", () => {
    expect(filterCatalog(catalog, { domainId: "mobile" }).map((t) => t.id)).toEqual(["rn"]);
  });

  it("matches on title, tech or domain, ignoring case", () => {
    expect(filterCatalog(catalog, { query: "mongodb" }).map((t) => t.id)).toEqual(["mern"]);
    expect(filterCatalog(catalog, { query: "MOBILE" }).map((t) => t.id)).toEqual(["rn"]);
  });

  it("requires every word to match", () => {
    expect(filterCatalog(catalog, { query: "react node" }).map((t) => t.id)).toEqual(["mern"]);
    expect(filterCatalog(catalog, { query: "react   " })).toHaveLength(2);
  });

  it("combines domain and query", () => {
    expect(filterCatalog(catalog, { domainId: "fullstack", query: "react" }).map((t) => t.id)).toEqual(["mern"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterCatalog(catalog, { query: "cobol" })).toEqual([]);
  });
});
