export default {
  slug: "cursor-pagination",
  trackId: "api-dev",
  layerId: "api-dev-5",
  type: "CODE",
  difficulty: "med",
  title: "Cursor (keyset) pagination",
  summary: "Page through rows by 'everything after this id' instead of by offset.",
  description:
    "OFFSET pagination gets slow on big tables and skips or repeats rows when data changes between requests. Keyset pagination fixes both, and is what feeds and timelines use.",
  task:
    "Write <code>pageAfter(rows, { limit = 10, after = null })</code>. <code>rows</code> are objects with a numeric <code>id</code>, sorted ascending. Return <code>{ data, nextCursor }</code>.",
  constraints: [
    "Only rows with <code>id &gt; after</code> are considered (all rows when <code>after</code> is null).",
    "<code>data</code> has at most <code>limit</code> rows; <code>limit</code> is clamped to 1..100.",
    "<code>nextCursor</code> is the id of the last returned row if more rows remain, otherwise <code>null</code>.",
    "It must work when the <code>after</code> id no longer exists.",
  ],
  example: `pageAfter([{id:1},{id:2},{id:3}], { limit: 2 }) // { data: [{id:1},{id:2}], nextCursor: 2 }`,
  tags: ["pagination","databases","api-design"],
  estimatedMins: 20,
  xp: 45,
  starterFiles: [
    {
      name: "pageAfter.js",
      lang: "js",
      code: `// pageAfter.js
function pageAfter(rows, options = {}) {
  // your code here
}

module.exports = pageAfter;`,
    },
  ],
  testFile: {
    name: "pageAfter_test.js",
    lang: "test",
    code: `const pageAfter = require('./pageAfter');

test('first_page', () => {
  const r = pageAfter([{id:1},{id:2},{id:3}], { limit: 2 }); expect(r.nextCursor).toBe(2);
});

test('last_page', () => {
  const r = pageAfter([{id:1},{id:2}], { limit: 2 }); expect(r.nextCursor).toBe(null);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Filter with <code>r.id &gt; after</code> first, then slice." },
    { order: 2, cost: 5, text: "You know there are more rows if the filtered list is longer than <code>limit</code>." },
    { order: 3, cost: 15, text: "The cursor is the last row you returned, not the first row you didn't." },
  ],
  hiddenTests: [
    { name: "first_page", code: `const rows = [1,2,3,4,5].map((id) => ({ id }));
const r = pageAfter(rows, { limit: 2 });
assert(r.data.length === 2 && r.data[0].id === 1 && r.nextCursor === 2, 'first page');` },
    { name: "follow_the_cursor", code: `const rows = [1,2,3,4,5].map((id) => ({ id }));
const r = pageAfter(rows, { limit: 2, after: 2 });
assert(r.data[0].id === 3 && r.data[1].id === 4 && r.nextCursor === 4, 'second page');` },
    { name: "last_page_has_null_cursor", code: `const rows = [1,2,3].map((id) => ({ id }));
const r = pageAfter(rows, { limit: 2, after: 2 });
assert(r.data.length === 1 && r.nextCursor === null, 'end');` },
    { name: "exact_fit_has_no_next", code: `const rows = [1,2].map((id) => ({ id }));
assert(pageAfter(rows, { limit: 2 }).nextCursor === null, 'exactly limit rows left means no next page');` },
    { name: "deleted_cursor_row_is_fine", code: `const rows = [{ id: 1 }, { id: 3 }, { id: 4 }];
const r = pageAfter(rows, { limit: 5, after: 2 });
assert(r.data.length === 2 && r.data[0].id === 3, 'works although id 2 is gone');` },
    { name: "limit_clamped", code: `const rows = Array.from({ length: 300 }, (_, i) => ({ id: i + 1 }));
assert(pageAfter(rows, { limit: 1000 }).data.length === 100, 'max 100');
assert(pageAfter(rows, { limit: 0 }).data.length === 1, 'min 1');` },
    { name: "empty", code: `const r = pageAfter([], {});
assert(r.data.length === 0 && r.nextCursor === null, 'empty');` },
  ],
  solution: {
    code: `function pageAfter(rows, { limit = 10, after = null } = {}) {
  const lim = Math.min(100, Math.max(1, Math.floor(limit)));
  const rest = after === null ? rows : rows.filter((r) => r.id > after);
  const data = rest.slice(0, lim);
  const hasMore = rest.length > lim;
  return { data, nextCursor: hasMore ? data[data.length - 1].id : null };
}

module.exports = pageAfter;`,
    explanation:
      "Filtering on 'id greater than the cursor' needs no row count and survives inserts and deletes. Comparing the remaining length to the limit tells you whether to hand out another cursor.",
  },
};
