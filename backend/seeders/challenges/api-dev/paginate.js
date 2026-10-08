export default {
  slug: "paginate",
  trackId: "api-dev",
  layerId: "api-dev-4",
  type: "CODE",
  difficulty: "easy",
  title: "Offset pagination metadata",
  summary: "Compute page, offset, totals and next/prev flags for a list endpoint.",
  description:
    "Every list endpoint returns a page of results plus metadata so clients can build 'next' and 'previous' links.",
  task:
    "Write <code>paginate(total, { page = 1, limit = 20 })</code> returning <code>{ page, limit, totalPages, offset, hasNext, hasPrev }</code>.",
  constraints: [
    "<code>totalPages = max(1, ceil(total / limit))</code>.",
    "<code>limit</code> is clamped to 1..100; a non-number falls back to 20.",
    "<code>page</code> is clamped to 1..totalPages; a non-number falls back to 1.",
    "<code>offset = (page - 1) * limit</code>.",
  ],
  example: `paginate(95, { page: 2, limit: 10 }) // { page: 2, limit: 10, totalPages: 10, offset: 10, hasNext: true, hasPrev: true }`,
  tags: ["rest","pagination","api-design"],
  estimatedMins: 15,
  xp: 25,
  starterFiles: [
    {
      name: "paginate.js",
      lang: "js",
      code: `// paginate.js
function paginate(total, options = {}) {
  // your code here
}

module.exports = paginate;`,
    },
  ],
  testFile: {
    name: "paginate_test.js",
    lang: "test",
    code: `const paginate = require('./paginate');

test('basic', () => {
  const r = paginate(95, { page: 2, limit: 10 }); expect(r.offset).toBe(10); expect(r.totalPages).toBe(10);
});

test('flags', () => {
  const r = paginate(5, { page: 1, limit: 10 }); expect(r.hasNext).toBe(false); expect(r.hasPrev).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Normalise <code>limit</code> first, because <code>totalPages</code> depends on it." },
    { order: 2, cost: 5, text: "Use <code>Number.isFinite</code> to reject NaN and undefined, then clamp with <code>Math.min/Math.max</code>." },
    { order: 3, cost: 15, text: "Clamp <code>page</code> last, using the computed <code>totalPages</code>." },
  ],
  hiddenTests: [
    { name: "basic_numbers", code: `const r = paginate(95, { page: 2, limit: 10 });
assert(r.page === 2 && r.limit === 10 && r.totalPages === 10 && r.offset === 10, 'basic');
assert(r.hasNext === true && r.hasPrev === true, 'flags');` },
    { name: "defaults", code: `const r = paginate(100);
assert(r.page === 1 && r.limit === 20 && r.totalPages === 5 && r.offset === 0, 'defaults');` },
    { name: "zero_total_has_one_page", code: `const r = paginate(0, { page: 3 });
assert(r.totalPages === 1 && r.page === 1 && r.hasNext === false && r.hasPrev === false, 'empty list');` },
    { name: "page_clamped_high_and_low", code: `assert(paginate(25, { page: 99, limit: 10 }).page === 3, 'clamp high');
assert(paginate(25, { page: 0, limit: 10 }).page === 1, 'clamp low');
assert(paginate(25, { page: -4, limit: 10 }).page === 1, 'negative');` },
    { name: "limit_clamped", code: `assert(paginate(1000, { limit: 500 }).limit === 100, 'max 100');
assert(paginate(10, { limit: 0 }).limit === 1, 'min 1');` },
    { name: "non_numbers_use_defaults", code: `const r = paginate(100, { page: 'abc', limit: NaN });
assert(r.page === 1 && r.limit === 20, 'fallbacks');` },
    { name: "last_page_flags", code: `const r = paginate(25, { page: 3, limit: 10 });
assert(r.hasNext === false && r.hasPrev === true && r.offset === 20, 'last page');` },
  ],
  solution: {
    code: `function paginate(total, { page = 1, limit = 20 } = {}) {
  const lim = Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 20;
  const totalPages = Math.max(1, Math.ceil(total / lim));
  const p = Number.isFinite(page) ? Math.min(totalPages, Math.max(1, Math.floor(page))) : 1;
  return {
    page: p,
    limit: lim,
    totalPages,
    offset: (p - 1) * lim,
    hasNext: p < totalPages,
    hasPrev: p > 1,
  };
}

module.exports = paginate;`,
    explanation:
      "Limit is normalised first because totalPages depends on it; page is clamped last against totalPages.",
  },
};
