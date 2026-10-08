export default {
  slug: "coverage-gate",
  trackId: "node-dev",
  layerId: "node-dev-8",
  type: "CODE",
  difficulty: "med",
  title: "Coverage gate from an LCOV report",
  summary: "Parse LCOV output, compute line, function and branch coverage per file and in total, and fail CI under thresholds.",
  description:
    "Test runners emit coverage as LCOV text (<code>SF:</code> file records with <code>LF/LH</code>, <code>FNF/FNH</code>, <code>BRF/BRH</code> counters). CI turns it into a pass/fail gate. The details matter: files with nothing to cover count as 100%, and per-file floors catch one untested file hiding behind a good average.",
  task:
    "Write <code>evaluateCoverage(lcov, thresholds)</code> returning <code>{ total, files, failures, passed }</code>.",
  constraints: [
    "A record starts at <code>SF:&lt;path&gt;</code> and ends at <code>end_of_record</code>. Within it read <code>LF</code>/<code>LH</code> (lines found/hit), <code>FNF</code>/<code>FNH</code> (functions) and <code>BRF</code>/<code>BRH</code> (branches). Other lines (<code>DA</code>, <code>FN</code>, <code>TN</code>, blank, non-numeric values) are ignored. Several records for the same <code>SF</code> path are merged by adding their counters.",
    "<code>pct = found === 0 ? 100 : round(hit / found * 100, 2 decimals)</code>. <code>files</code> is sorted by path: <code>{ file, lines, functions, branches }</code> (percentages). <code>total</code> is <code>{ lines: { found, hit, pct }, functions: {...}, branches: {...} }</code> summed over all files.",
    "<code>thresholds</code> may contain <code>lines</code>, <code>functions</code>, <code>branches</code> (minimum total percentages) and <code>perFile</code> with the same keys (minimum for EACH file). A metric below its minimum (comparing the rounded percentage) is a failure <code>{ scope, metric, actual, required }</code> where <code>scope</code> is <code>'total'</code> or the file path.",
    "Failure order: total failures in the order lines, functions, branches; then per file in file order, each file's metrics in the same order. <code>passed</code> is true when there are no failures. Missing thresholds are not checked.",
  ],
  example: `evaluateCoverage(lcovText, { lines: 80, perFile: { lines: 50 } }).passed`,
  tags: ["testing","coverage","ci","lcov"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "evaluateCoverage.js",
      lang: "js",
      code: `// evaluateCoverage.js
function evaluateCoverage(lcov, thresholds) {
  // your code here
}

module.exports = evaluateCoverage;`,
    },
  ],
  testFile: {
    name: "evaluateCoverage_test.js",
    lang: "test",
    code: `const evaluateCoverage = require('./evaluateCoverage');

test('totals', () => {
  const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([{ file: 'a.js', fnf: 2, fnh: 1, lf: 10, lh: 8, brf: 4, brh: 2 }]), {}); expect(r.total.lines.pct).toBe(80); expect(r.passed).toBe(true);
});

test('fails', () => {
  const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([{ file: 'a.js', fnf: 0, fnh: 0, lf: 10, lh: 5, brf: 0, brh: 0 }]), { lines: 80 }); expect(r.passed).toBe(false); expect(r.failures[0].metric).toBe('lines');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Parse line by line with a <code>current</code> record: <code>SF:</code> creates or finds it in a Map (merging duplicates), <code>end_of_record</code> clears it, other lines are <code>KEY:number</code> pairs you add to the right counter." },
    { order: 2, cost: 5, text: "Write <code>pct(found, hit)</code> once and use it for files and totals; round with <code>Math.round(x * 100) / 100</code>." },
    { order: 3, cost: 15, text: "Build failures with two loops, total first and then per file, iterating the metric names in the fixed order <code>['lines', 'functions', 'branches']</code>." },
  ],
  hiddenTests: [
    { name: "single_file_percentages", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([{ file: 'src/a.js', fnf: 4, fnh: 3, lf: 10, lh: 9, brf: 8, brh: 2 }]));
assert(r.files.length === 1 && r.files[0].file === 'src/a.js', 'file');
assert(r.files[0].lines === 90 && r.files[0].functions === 75 && r.files[0].branches === 25, JSON.stringify(r.files[0]));
assert(JSON.stringify(r.total.lines) === '{"found":10,"hit":9,"pct":90}', JSON.stringify(r.total.lines));
assert(r.total.functions.found === 4 && r.total.functions.hit === 3 && r.total.branches.pct === 25, 'totals');` },
    { name: "totals_sum_found_and_hit_not_percentages", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([
  { file: 'small.js', fnf: 0, fnh: 0, lf: 2, lh: 2, brf: 0, brh: 0 },
  { file: 'big.js', fnf: 0, fnh: 0, lf: 98, lh: 49, brf: 0, brh: 0 },
]));
assert(r.total.lines.found === 100 && r.total.lines.hit === 51 && r.total.lines.pct === 51, 'weighted by size, not an average of 100 and 50: ' + r.total.lines.pct);` },
    { name: "rounding_to_two_decimals", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([{ file: 'a.js', fnf: 3, fnh: 2, lf: 3, lh: 1, brf: 7, brh: 3 }]));
assert(r.files[0].lines === 33.33 && r.files[0].functions === 66.67 && r.files[0].branches === 42.86, JSON.stringify(r.files[0]));` },
    { name: "nothing_to_cover_counts_as_100", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([{ file: 'types.js', fnf: 0, fnh: 0, lf: 0, lh: 0, brf: 0, brh: 0 }]));
assert(r.files[0].lines === 100 && r.files[0].functions === 100 && r.files[0].branches === 100, 'empty file is 100%');
assert(r.total.lines.pct === 100 && r.total.branches.pct === 100, 'and the totals');
const empty = evaluateCoverage('');
assert(empty.files.length === 0 && empty.total.lines.pct === 100 && empty.passed === true, 'empty report: ' + JSON.stringify(empty.total));` },
    { name: "files_are_sorted_by_path", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const f = (file) => ({ file, fnf: 1, fnh: 1, lf: 1, lh: 1, brf: 1, brh: 1 });
const r = evaluateCoverage(lcov([f('src/z.js'), f('src/a.js'), f('lib/m.js')]));
assert(r.files.map((x) => x.file).join() === 'lib/m.js,src/a.js,src/z.js', r.files.map((x) => x.file).join());` },
    { name: "duplicate_records_are_merged", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const r = evaluateCoverage(lcov([
  { file: 'a.js', fnf: 2, fnh: 1, lf: 10, lh: 4, brf: 0, brh: 0 },
  { file: 'a.js', fnf: 2, fnh: 2, lf: 10, lh: 6, brf: 0, brh: 0 },
]));
assert(r.files.length === 1 && r.files[0].lines === 50 && r.files[0].functions === 75, 'summed counters: ' + JSON.stringify(r.files[0]));
assert(r.total.lines.found === 20 && r.total.lines.hit === 10, 'totals counted once');` },
    { name: "other_lines_and_garbage_are_ignored", code: `const text = 'TN:\\nSF:a.js\\nFN:1,foo\\nFNDA:3,foo\\nFNF:1\\nFNH:1\\nDA:1,1\\nDA:2,0\\nLF:2\\nLH:1\\nBRDA:1,0,0,1\\nBRF:abc\\nBRH:\\nrandom noise\\nend_of_record\\nLH:99\\nSF:\\nend_of_record\\n';
const r = evaluateCoverage(text);
assert(r.files[0].file === 'a.js' && r.files[0].lines === 50 && r.files[0].functions === 100, JSON.stringify(r.files));
assert(r.files[0].branches === 100, 'non-numeric branch counters are ignored, leaving nothing to cover');
assert(r.total.lines.hit === 1, 'counters outside a record are ignored');` },
    { name: "crlf_and_whitespace", code: `const text = 'SF:a.js\\r\\nLF:4\\r\\nLH:2\\r\\nFNF:0\\r\\nFNH:0\\r\\nBRF:0\\r\\nBRH:0\\r\\nend_of_record\\r\\n';
const r = evaluateCoverage(text);
assert(r.files[0].file === 'a.js' && r.files[0].lines === 50, 'handles CRLF: ' + JSON.stringify(r.files[0]));` },
    { name: "total_thresholds", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const report = lcov([{ file: 'a.js', fnf: 10, fnh: 7, lf: 100, lh: 85, brf: 20, brh: 8 }]);
const ok = evaluateCoverage(report, { lines: 85, functions: 70, branches: 40 });
assert(ok.passed === true && ok.failures.length === 0, 'exactly at the minimum passes');
const bad = evaluateCoverage(report, { lines: 90, functions: 80, branches: 30 });
assert(bad.passed === false, 'fails');
assert(JSON.stringify(bad.failures) === '[{"scope":"total","metric":"lines","actual":85,"required":90},{"scope":"total","metric":"functions","actual":70,"required":80}]', JSON.stringify(bad.failures));` },
    { name: "rounded_percentage_is_compared", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const report = lcov([{ file: 'a.js', fnf: 0, fnh: 0, lf: 3, lh: 2, brf: 0, brh: 0 }]);
assert(evaluateCoverage(report, { lines: 66.67 }).passed === true, '66.666... rounds to 66.67, which meets 66.67');
assert(evaluateCoverage(report, { lines: 66.68 }).passed === false, 'and not 66.68');` },
    { name: "per_file_thresholds_catch_untested_files", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const report = lcov([
  { file: 'good.js', fnf: 0, fnh: 0, lf: 90, lh: 90, brf: 0, brh: 0 },
  { file: 'bad.js', fnf: 0, fnh: 0, lf: 10, lh: 0, brf: 0, brh: 0 },
]);
const r = evaluateCoverage(report, { lines: 80, perFile: { lines: 50 } });
assert(r.total.lines.pct === 90, 'the total looks fine: ' + r.total.lines.pct);
assert(r.passed === false && r.failures.length === 1, 'but one file is untested');
assert(JSON.stringify(r.failures[0]) === '{"scope":"bad.js","metric":"lines","actual":0,"required":50}', JSON.stringify(r.failures[0]));` },
    { name: "failure_order", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const report = lcov([
  { file: 'b.js', fnf: 1, fnh: 0, lf: 1, lh: 0, brf: 1, brh: 0 },
  { file: 'a.js', fnf: 1, fnh: 0, lf: 1, lh: 0, brf: 1, brh: 0 },
]);
const r = evaluateCoverage(report, { lines: 100, functions: 100, branches: 100, perFile: { lines: 100, branches: 100 } });
const order = r.failures.map((f) => f.scope + ':' + f.metric).join(' ');
assert(order === 'total:lines total:functions total:branches a.js:lines a.js:branches b.js:lines b.js:branches', order);` },
    { name: "missing_thresholds_are_not_checked", code: `const lcov = (files) => files.map((f) => ['SF:' + f.file, 'FNF:' + f.fnf, 'FNH:' + f.fnh, 'LF:' + f.lf, 'LH:' + f.lh, 'BRF:' + f.brf, 'BRH:' + f.brh, 'end_of_record'].join('\\n')).join('\\n') + '\\n';
const report = lcov([{ file: 'a.js', fnf: 1, fnh: 0, lf: 1, lh: 0, brf: 1, brh: 0 }]);
assert(evaluateCoverage(report).passed === true && evaluateCoverage(report, {}).passed === true && evaluateCoverage(report, { perFile: {} }).passed === true, 'no thresholds, no failures');
assert(evaluateCoverage(report, { lines: 0 }).passed === true, 'zero is a valid (trivial) threshold');
const only = evaluateCoverage(report, { branches: 50 });
assert(only.failures.length === 1 && only.failures[0].metric === 'branches', 'only the requested metric is checked');` },
  ],
  solution: {
    code: `function evaluateCoverage(lcov, thresholds = {}) {
  const METRICS = ['lines', 'functions', 'branches'];
  const FIELDS = { lines: ['LF', 'LH'], functions: ['FNF', 'FNH'], branches: ['BRF', 'BRH'] };
  const fresh = (file) => ({
    file,
    lines: { found: 0, hit: 0 },
    functions: { found: 0, hit: 0 },
    branches: { found: 0, hit: 0 },
  });

  const files = new Map();
  let current = null;
  for (const rawLine of lcov.split(/\\r?\\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('SF:')) {
      const name = line.slice(3);
      if (name === '') {
        current = null;
        continue;
      }
      current = files.get(name) || fresh(name);
      files.set(name, current);
    } else if (line === 'end_of_record') {
      current = null;
    } else if (current) {
      const colon = line.indexOf(':');
      if (colon === -1) continue;
      const key = line.slice(0, colon);
      const text = line.slice(colon + 1);
      const value = text === '' ? NaN : Number(text);
      if (!Number.isFinite(value)) continue;
      for (const metric of METRICS) {
        const [foundKey, hitKey] = FIELDS[metric];
        if (key === foundKey) current[metric].found += value;
        else if (key === hitKey) current[metric].hit += value;
      }
    }
  }

  const pct = (found, hit) => (found === 0 ? 100 : Math.round((hit / found) * 10000) / 100);
  const sorted = [...files.values()].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));

  const fileRows = sorted.map((f) => ({
    file: f.file,
    lines: pct(f.lines.found, f.lines.hit),
    functions: pct(f.functions.found, f.functions.hit),
    branches: pct(f.branches.found, f.branches.hit),
  }));

  const total = {};
  for (const metric of METRICS) {
    const found = sorted.reduce((sum, f) => sum + f[metric].found, 0);
    const hit = sorted.reduce((sum, f) => sum + f[metric].hit, 0);
    total[metric] = { found, hit, pct: pct(found, hit) };
  }

  const failures = [];
  for (const metric of METRICS) {
    if (thresholds[metric] !== undefined && total[metric].pct < thresholds[metric]) {
      failures.push({ scope: 'total', metric, actual: total[metric].pct, required: thresholds[metric] });
    }
  }
  const perFile = thresholds.perFile || {};
  for (const row of fileRows) {
    for (const metric of METRICS) {
      if (perFile[metric] !== undefined && row[metric] < perFile[metric]) {
        failures.push({ scope: row.file, metric, actual: row[metric], required: perFile[metric] });
      }
    }
  }

  return { total, files: fileRows, failures, passed: failures.length === 0 };
}

module.exports = evaluateCoverage;`,
    explanation:
      "The totals add up found and hit counters before computing a percentage, so a big file weighs more than a tiny one. Per-file thresholds exist because a healthy overall number can hide a completely untested file.",
  },
};
