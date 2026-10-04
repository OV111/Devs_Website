import { describe, it, expect } from "vitest";
import { FILTERS, displayName, isMutual, matchesQuery, timeAgo } from "./connections";

const user = (over = {}) => ({
  username: "lil99",
  firstName: "Lilit",
  lastName: "Ohanyan",
  youFollow: true,
  followsYou: true,
  ...over,
});

describe("isMutual", () => {
  it("needs both directions", () => {
    expect(isMutual(user())).toBe(true);
    expect(isMutual(user({ youFollow: false }))).toBe(false);
    expect(isMutual(user({ followsYou: false }))).toBe(false);
  });
});

describe("FILTERS", () => {
  const pick = (kind, id) => FILTERS[kind].find((f) => f.id === id).test;

  it("followers → 'pending' means people I haven't followed back", () => {
    expect(pick("followers", "pending")(user({ youFollow: false }))).toBe(true);
    expect(pick("followers", "pending")(user())).toBe(false);
  });

  it("following → 'pending' means people who don't follow me back", () => {
    expect(pick("following", "pending")(user({ followsYou: false }))).toBe(true);
    expect(pick("following", "pending")(user())).toBe(false);
  });
});

describe("displayName", () => {
  it("joins first and last name, falling back to the username", () => {
    expect(displayName(user())).toBe("Lilit Ohanyan");
    expect(displayName(user({ firstName: "", lastName: undefined }))).toBe("lil99");
  });
});

describe("matchesQuery", () => {
  it("matches name or username, case-insensitively; empty matches all", () => {
    expect(matchesQuery(user(), "lilit")).toBe(true);
    expect(matchesQuery(user(), "LIL99")).toBe(true);
    expect(matchesQuery(user(), "  ")).toBe(true);
    expect(matchesQuery(user(), "sona")).toBe(false);
  });
});

describe("timeAgo", () => {
  const now = new Date("2026-10-04T12:00:00Z").getTime();

  it("speaks in the largest whole unit", () => {
    expect(timeAgo("2026-10-01T12:00:00Z", now)).toBe("3 days ago");
    expect(timeAgo("2026-10-04T09:00:00Z", now)).toBe("3 hours ago");
    expect(timeAgo("2026-10-03T12:00:00Z", now)).toBe("yesterday");
  });

  it("says 'just now' under a minute and '' for missing/invalid dates", () => {
    expect(timeAgo("2026-10-04T11:59:40Z", now)).toBe("just now");
    expect(timeAgo(null, now)).toBe("");
    expect(timeAgo("not a date", now)).toBe("");
  });
});
