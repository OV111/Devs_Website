const pct = (n) => `${Math.round(n * 100)}%`;

export const summarize = (results) => {
  const byCategory = {};
  for (const r of results) {
    const b = (byCategory[r.category] ??= { n: 0, sum: 0, errors: 0 });
    // Errored cases (API failures) are reported, not scored: counting them as 0
    // would blame the mentor for an infrastructure problem.
    if (r.error) b.errors += 1;
    else {
      b.n += 1;
      b.sum += r.score;
    }
  }
  const rows = Object.entries(byCategory).map(([category, b]) => ({
    category,
    cases: b.n,
    errors: b.errors,
    score: b.n ? b.sum / b.n : null,
  }));
  const scored = results.filter((r) => !r.error);
  const overall = scored.length ? scored.reduce((s, r) => s + r.score, 0) / scored.length : null;
  return { rows, overall };
};

export const printReport = (results) => {
  const { rows, overall } = summarize(results);
  console.log("\nPer case:");
  for (const r of results) {
    console.log(`  ${r.error ? "ERR " : r.score === 1 ? "PASS" : "FAIL"}  ${r.id}  ${r.error ? r.error : pct(r.score)}`);
    for (const c of r.criteria ?? []) if (!c.pass) console.log(`        x ${c.criterion}\n          ${c.reason}`);
  }
  console.log("\nPer category:");
  console.table(rows.map((r) => ({ category: r.category, cases: r.cases, errors: r.errors, score: r.score === null ? "n/a" : pct(r.score) })));
  console.log(`Overall: ${overall === null ? "n/a" : pct(overall)}`);
  return overall;
};
