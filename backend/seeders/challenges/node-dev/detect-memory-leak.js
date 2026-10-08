export default {
  slug: "detect-memory-leak",
  trackId: "node-dev",
  layerId: "node-dev-9",
  type: "CODE",
  difficulty: "med",
  title: "Detect a memory leak from heap samples",
  summary: "Fit a line to heap-used samples, decide leak, stable or not enough data, and project when the process will hit its memory limit.",
  description:
    "A leaking Node process shows a heap that keeps climbing after garbage collection instead of leveling off. The signal is a sustained upward slope that fits a straight line well, not a single high number: healthy services have a sawtooth that rises and falls but stays around the same level.",
  task:
    "Write <code>analyzeHeap(samples, options)</code> where <code>samples</code> is <code>[{ t, heapUsedMb }]</code> (<code>t</code> in milliseconds). Return <code>{ status, slopeMbPerMin, r2, growthMb, projectedMinutesToLimit }</code>.",
  constraints: [
    "Options and defaults: <code>minSamples = 6</code>, <code>minSpanMinutes = 5</code>, <code>minSlopeMbPerMin = 1</code>, <code>minR2 = 0.8</code>, <code>minGrowthMb = 20</code>, <code>limitMb</code> (optional). Sort a COPY of the samples by <code>t</code>; never mutate the input.",
    "<code>'insufficient_data'</code> when there are fewer than <code>minSamples</code> samples OR the time span (last <code>t</code> minus first <code>t</code>) is shorter than <code>minSpanMinutes</code>. For that status the numeric fields are <code>null</code> (<code>projectedMinutesToLimit</code> too).",
    "Otherwise do an ordinary least-squares regression of <code>heapUsedMb</code> against time in MINUTES since the first sample: <code>slopeMbPerMin</code> and the coefficient of determination <code>r2</code> (<code>1 - SSres / SStot</code>, or <code>0</code> when all heap values are equal). Round <code>slopeMbPerMin</code> and <code>r2</code> to 4 decimals. <code>growthMb</code> is <code>last - first</code> heap value (actual samples), rounded to 2 decimals.",
    "<code>status</code> is <code>'leak'</code> when <code>slope &gt;= minSlopeMbPerMin</code> AND <code>r2 &gt;= minR2</code> AND <code>growthMb &gt;= minGrowthMb</code>; otherwise <code>'stable'</code>.",
    "<code>projectedMinutesToLimit</code>: if <code>limitMb</code> is given and the slope is positive, <code>(limitMb - lastHeap) / slope</code> minutes rounded to 1 decimal (never below 0); otherwise <code>null</code>.",
  ],
  example: `analyzeHeap(samples, { limitMb: 512 }) // { status: 'leak', slopeMbPerMin: 2, r2: 1, growthMb: 60, projectedMinutesToLimit: 120 }`,
  tags: ["memory-leaks","profiling","performance","statistics"],
  estimatedMins: 40,
  xp: 45,
  starterFiles: [
    {
      name: "analyzeHeap.js",
      lang: "js",
      code: `// analyzeHeap.js
function analyzeHeap(samples, options = {}) {
  // your code here
}

module.exports = analyzeHeap;`,
    },
  ],
  testFile: {
    name: "analyzeHeap_test.js",
    lang: "test",
    code: `const analyzeHeap = require('./analyzeHeap');

test('leak', () => {
  const s = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 5 })); expect(analyzeHeap(s).status).toBe('leak');
});

test('not_enough', () => {
  expect(analyzeHeap([{ t: 0, heapUsedMb: 1 }]).status).toBe('insufficient_data');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Convert each sample to <code>x = (t - t0) / 60000</code> minutes and compute <code>mean(x)</code>, <code>mean(y)</code>, then <code>slope = Σ(x-mx)(y-my) / Σ(x-mx)²</code>." },
    { order: 2, cost: 5, text: "<code>r2 = 1 - SSres / SStot</code> where <code>SSres = Σ(y - (intercept + slope·x))²</code> and <code>SStot = Σ(y - my)²</code>; guard the case <code>SStot === 0</code> (a flat line)." },
    { order: 3, cost: 15, text: "Return early with the <code>insufficient_data</code> object before doing any math, and round only at the end." },
  ],
  hiddenTests: [
    { name: "insufficient_samples_and_span", code: `const none = analyzeHeap([]);
assert(none.status === 'insufficient_data' && none.slopeMbPerMin === null && none.r2 === null && none.growthMb === null && none.projectedMinutesToLimit === null, JSON.stringify(none));
const few = Array.from({ length: 5 }, (_, i) => ({ t: i * 10 * 60000, heapUsedMb: 100 + i * 50 }));
assert(analyzeHeap(few).status === 'insufficient_data', 'five samples is too few even when the trend is dramatic');
const short = Array.from({ length: 10 }, (_, i) => ({ t: i * 20000, heapUsedMb: 100 + i * 50 }));
assert(analyzeHeap(short).status === 'insufficient_data', 'span of 3 minutes is too short');
const ok = Array.from({ length: 6 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 10 }));
assert(analyzeHeap(ok).status !== 'insufficient_data', 'exactly 6 samples over exactly 5 minutes is enough');` },
    { name: "perfectly_linear_growth_is_a_leak", code: `const s = Array.from({ length: 11 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 5 }));
const r = analyzeHeap(s);
assert(r.status === 'leak', 'status: ' + r.status);
assert(r.slopeMbPerMin === 5 && r.r2 === 1 && r.growthMb === 50, JSON.stringify(r));
assert(r.projectedMinutesToLimit === null, 'no limit given means null');` },
    { name: "slope_is_per_minute_regardless_of_sample_spacing", code: `const s = Array.from({ length: 12 }, (_, i) => ({ t: i * 30000, heapUsedMb: 200 + i * 3 }));
const r = analyzeHeap(s);
assert(r.slopeMbPerMin === 6 && r.r2 === 1, '3 MB every 30 s is 6 MB/min: ' + JSON.stringify(r));` },
    { name: "flat_heap_is_stable", code: `const s = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 150 }));
const r = analyzeHeap(s);
assert(r.status === 'stable' && r.slopeMbPerMin === 0 && r.r2 === 0 && r.growthMb === 0, JSON.stringify(r));` },
    { name: "sawtooth_around_a_constant_level_is_stable", code: `const saw = [100, 140, 105, 145, 100, 140, 105, 145, 100, 140, 105, 145];
const s = saw.map((v, i) => ({ t: i * 60000, heapUsedMb: v }));
const r = analyzeHeap(s);
assert(r.status === 'stable', 'GC sawtooth is normal: ' + JSON.stringify(r));
assert(r.r2 < 0.1, 'a poor linear fit: ' + r.r2);` },
    { name: "noisy_but_clearly_rising_is_a_leak", code: `const noise = [3, -2, 4, -4, 1, 2, -3, 5, -1, 0, 3, -2];
const s = noise.map((n, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 4 + n }));
const r = analyzeHeap(s);
assert(r.status === 'leak', JSON.stringify(r));
assert(r.slopeMbPerMin > 3.5 && r.slopeMbPerMin < 4.5 && r.r2 > 0.9 && r.r2 < 1, 'close to 4 MB/min with a good fit: ' + JSON.stringify(r));` },
    { name: "rising_but_below_thresholds_is_stable", code: `const slow = Array.from({ length: 20 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 0.5 }));
assert(analyzeHeap(slow).status === 'stable', 'slope 0.5 MB/min is under the default minimum of 1');
const small = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 1.5 }));
const r = analyzeHeap(small);
assert(r.slopeMbPerMin === 1.5 && r.growthMb === 13.5 && r.status === 'stable', 'growth of 13.5 MB is under the 20 MB minimum: ' + JSON.stringify(r));
assert(analyzeHeap(small, { minGrowthMb: 10 }).status === 'leak', 'options are respected');
assert(analyzeHeap(slow, { minSlopeMbPerMin: 0.4, minGrowthMb: 5 }).status === 'leak', 'a lower slope bar flips it');
const flatSpike = [100, 100, 100, 100, 100, 100, 100, 100, 100, 400].map((v, i) => ({ t: i * 60000, heapUsedMb: v }));
assert(analyzeHeap(flatSpike).status === 'stable', 'one spike is not a trend (poor fit): ' + JSON.stringify(analyzeHeap(flatSpike)));` },
    { name: "decreasing_heap_is_stable_with_negative_slope", code: `const s = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 300 - i * 10 }));
const r = analyzeHeap(s, { limitMb: 512 });
assert(r.status === 'stable' && r.slopeMbPerMin === -10 && r.r2 === 1 && r.growthMb === -90, JSON.stringify(r));
assert(r.projectedMinutesToLimit === null, 'no projection for a falling heap');` },
    { name: "projection_to_the_memory_limit", code: `const s = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 5 }));
assert(analyzeHeap(s, { limitMb: 245 }).projectedMinutesToLimit === 20, 'last heap is 145, 100 MB to go at 5 MB/min: ' + analyzeHeap(s, { limitMb: 245 }).projectedMinutesToLimit);
assert(analyzeHeap(s, { limitMb: 150 }).projectedMinutesToLimit === 1, 'one minute left');
assert(analyzeHeap(s, { limitMb: 100 }).projectedMinutesToLimit === 0, 'already above the limit is 0, never negative');
assert(analyzeHeap(s, { limitMb: 512 }).projectedMinutesToLimit === 73.4, 'rounded to one decimal: ' + analyzeHeap(s, { limitMb: 512 }).projectedMinutesToLimit);
const flat = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 150 }));
assert(analyzeHeap(flat, { limitMb: 512 }).projectedMinutesToLimit === null, 'no growth means no projection');` },
    { name: "unsorted_input_is_sorted_and_not_mutated", code: `const base = Array.from({ length: 10 }, (_, i) => ({ t: i * 60000, heapUsedMb: 100 + i * 5 }));
const shuffled = [base[5], base[0], base[9], base[2], base[7], base[1], base[8], base[3], base[6], base[4]];
const snapshot = JSON.stringify(shuffled);
const r = analyzeHeap(shuffled);
assert(r.slopeMbPerMin === 5 && r.growthMb === 45 && r.status === 'leak', 'same answer as sorted data: ' + JSON.stringify(r));
assert(JSON.stringify(shuffled) === snapshot, 'input order untouched');` },
    { name: "timestamps_do_not_have_to_start_at_zero", code: `const t0 = 1700000000000;
const s = Array.from({ length: 10 }, (_, i) => ({ t: t0 + i * 60000, heapUsedMb: 80 + i * 4 }));
const r = analyzeHeap(s);
assert(r.slopeMbPerMin === 4 && r.r2 === 1 && r.status === 'leak', 'epoch timestamps: ' + JSON.stringify(r));` },
    { name: "rounding", code: `const s = [0, 1, 2, 3, 4, 5, 6].map((m, i) => ({ t: m * 60000, heapUsedMb: 100 + [0, 7, 9, 22, 25, 33, 41][i] }));
const r = analyzeHeap(s);
assert(String(r.slopeMbPerMin).length <= 7 && String(r.r2).length <= 7, 'at most 4 decimals: ' + r.slopeMbPerMin + ' ' + r.r2);
assert(r.slopeMbPerMin === Math.round(r.slopeMbPerMin * 10000) / 10000 && r.growthMb === 41, JSON.stringify(r));` },
  ],
  solution: {
    code: `function analyzeHeap(samples, { minSamples = 6, minSpanMinutes = 5, minSlopeMbPerMin = 1, minR2 = 0.8, minGrowthMb = 20, limitMb } = {}) {
  const insufficient = {
    status: 'insufficient_data',
    slopeMbPerMin: null,
    r2: null,
    growthMb: null,
    projectedMinutesToLimit: null,
  };
  const sorted = [...samples].sort((a, b) => a.t - b.t);
  if (sorted.length < minSamples) return insufficient;
  const spanMinutes = (sorted[sorted.length - 1].t - sorted[0].t) / 60000;
  if (spanMinutes < minSpanMinutes) return insufficient;

  const xs = sorted.map((s) => (s.t - sorted[0].t) / 60000);
  const ys = sorted.map((s) => s.heapUsedMb);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let sxy = 0;
  let sxx = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - meanX) * (ys[i] - meanY);
    sxx += (xs[i] - meanX) ** 2;
    sst += (ys[i] - meanY) ** 2;
  }
  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = meanY - slope * meanX;
  let ssr = 0;
  for (let i = 0; i < n; i++) ssr += (ys[i] - (intercept + slope * xs[i])) ** 2;
  const r2 = sst === 0 ? 0 : 1 - ssr / sst;

  const round = (value, places) => Math.round(value * 10 ** places) / 10 ** places;
  const slopeRounded = round(slope, 4);
  const r2Rounded = round(r2, 4);
  const growthMb = round(ys[n - 1] - ys[0], 2);
  const isLeak = slopeRounded >= minSlopeMbPerMin && r2Rounded >= minR2 && growthMb >= minGrowthMb;

  let projectedMinutesToLimit = null;
  if (limitMb !== undefined && slope > 0) {
    projectedMinutesToLimit = round(Math.max(0, (limitMb - ys[n - 1]) / slope), 1);
  }

  return {
    status: isLeak ? 'leak' : 'stable',
    slopeMbPerMin: slopeRounded,
    r2: r2Rounded,
    growthMb,
    projectedMinutesToLimit,
  };
}

module.exports = analyzeHeap;`,
    explanation:
      "A leak is a trend, not a level: least-squares gives the growth rate, and r-squared says how steady that growth is, which is what separates a leak from the sawtooth of normal garbage collection. Requiring all three signals (slope, fit, total growth) avoids alarms on slow drift or a single spike.",
  },
};
