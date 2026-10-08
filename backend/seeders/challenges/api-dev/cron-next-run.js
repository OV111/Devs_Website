export default {
  slug: "cron-next-run",
  trackId: "api-dev",
  layerId: "api-dev-9",
  type: "CODE",
  difficulty: "hard",
  title: "Compute the next run of a cron expression",
  summary: "Parse a 5-field cron expression and find the next matching minute, in UTC.",
  description:
    "Scheduled jobs use cron expressions like <code>*/15 9-17 * * 1-5</code>. Libraries such as node-cron parse them and compute the next time to wake up.",
  task:
    "Write <code>nextRun(expr, from)</code> returning a <code>Date</code>: the first minute strictly after <code>from</code> that matches. Use UTC for all calendar math.",
  constraints: [
    "Fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6, 0 = Sunday).",
    "Each field supports <code>*</code>, a number, a range <code>a-b</code>, a list <code>a,b,c</code>, and steps <code>*/n</code>, <code>a-b/n</code>, <code>a/n</code> (from a to the field maximum).",
    "Seconds and milliseconds of the result are 0, and <code>from</code> is not mutated.",
    "If both day-of-month and day-of-week are restricted (not <code>*</code>), a day matches when EITHER matches (classic cron behavior); otherwise both must match.",
    "Throw an <code>Error</code> for the wrong number of fields, an out-of-range value, or a step below 1. Search at most 5 years ahead, then throw.",
  ],
  example: `nextRun('*/15 * * * *', new Date('2024-01-01T10:07:00Z')).toISOString() // '2024-01-01T10:15:00.000Z'`,
  tags: ["cron","scheduling","dates","parsing"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "nextRun.js",
      lang: "js",
      code: `// nextRun.js
function nextRun(expr, from) {
  // your code here
}

module.exports = nextRun;`,
    },
  ],
  testFile: {
    name: "nextRun_test.js",
    lang: "test",
    code: `const nextRun = require('./nextRun');

test('every_minute', () => {
  expect(nextRun('* * * * *', new Date('2024-01-01T10:00:30Z')).toISOString()).toBe('2024-01-01T10:01:00.000Z');
});

test('step', () => {
  expect(nextRun('*/15 * * * *', new Date('2024-01-01T10:07:00Z')).toISOString()).toBe('2024-01-01T10:15:00.000Z');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "First turn each of the 5 fields into a <code>Set</code> of allowed numbers (expand lists, ranges and steps), so matching later is just <code>set.has(n)</code>." },
    { order: 2, cost: 5, text: "Start at <code>from</code> with seconds zeroed plus one minute, then step forward one minute at a time until all fields match (a few million iterations at most is fine)." },
    { order: 3, cost: 15, text: "Day matching: if both day fields are restricted use OR, else use AND (an unrestricted field's set contains every value, so AND works for the other cases)." },
  ],
  hiddenTests: [
    { name: "every_minute_is_strictly_after", code: `const r = nextRun('* * * * *', new Date('2024-01-01T10:00:30Z'));
assert(r.toISOString() === '2024-01-01T10:01:00.000Z', r.toISOString());
const r2 = nextRun('* * * * *', new Date('2024-01-01T10:00:00Z'));
assert(r2.toISOString() === '2024-01-01T10:01:00.000Z', 'strictly after, even on an exact match');` },
    { name: "step_minutes", code: `assert(nextRun('*/15 * * * *', new Date('2024-01-01T10:07:00Z')).toISOString() === '2024-01-01T10:15:00.000Z', '*/15');
assert(nextRun('*/15 * * * *', new Date('2024-01-01T10:45:00Z')).toISOString() === '2024-01-01T11:00:00.000Z', 'rolls the hour');` },
    { name: "daily_at_nine", code: `assert(nextRun('0 9 * * *', new Date('2024-01-01T08:59:59Z')).toISOString() === '2024-01-01T09:00:00.000Z', 'same day');
assert(nextRun('0 9 * * *', new Date('2024-01-01T09:00:00Z')).toISOString() === '2024-01-02T09:00:00.000Z', 'next day');` },
    { name: "weekday", code: `const r = nextRun('30 14 * * 1', new Date('2024-01-01T15:00:00Z'));
assert(r.toISOString() === '2024-01-08T14:30:00.000Z', 'next Monday: ' + r.toISOString());` },
    { name: "day_of_month_and_month_rollover", code: `assert(nextRun('0 0 1 * *', new Date('2024-01-15T00:00:00Z')).toISOString() === '2024-02-01T00:00:00.000Z', 'first of next month');
assert(nextRun('0 0 1 1 *', new Date('2024-01-15T00:00:00Z')).toISOString() === '2025-01-01T00:00:00.000Z', 'next year');` },
    { name: "leap_day", code: `const r = nextRun('0 0 29 2 *', new Date('2023-03-01T00:00:00Z'));
assert(r.toISOString() === '2024-02-29T00:00:00.000Z', r.toISOString());` },
    { name: "lists_and_ranges", code: `const r = nextRun('0,30 9-10 * * *', new Date('2024-01-01T09:30:00Z'));
assert(r.toISOString() === '2024-01-01T10:00:00.000Z', r.toISOString());
const r2 = nextRun('0,30 9-10 * * *', new Date('2024-01-01T10:30:00Z'));
assert(r2.toISOString() === '2024-01-02T09:00:00.000Z', 'wraps to next day: ' + r2.toISOString());` },
    { name: "start_with_step", code: `assert(nextRun('10/20 * * * *', new Date('2024-01-01T10:00:00Z')).getUTCMinutes() === 10, '10');
assert(nextRun('10/20 * * * *', new Date('2024-01-01T10:10:00Z')).getUTCMinutes() === 30, '30');
assert(nextRun('10/20 * * * *', new Date('2024-01-01T10:50:00Z')).toISOString() === '2024-01-01T11:10:00.000Z', '50 -> next hour 10');` },
    { name: "dom_or_dow_when_both_restricted", code: `const r = nextRun('0 0 13 * 5', new Date('2024-01-01T00:00:00Z'));
assert(r.toISOString() === '2024-01-05T00:00:00.000Z', 'Friday the 5th comes before the 13th: ' + r.toISOString());` },
    { name: "does_not_mutate_from", code: `const from = new Date('2024-01-01T10:00:30Z'); const t = from.getTime();
nextRun('* * * * *', from);
assert(from.getTime() === t, 'input unchanged');` },
    { name: "invalid_expressions_throw", code: `const bad = ['61 * * * *', '* * *', '*/0 * * * *', 'a * * * *', '* 24 * * *', '* * 0 * *', '* * * 13 *', '5-1 * * * *', '* * * * * *'];
for (const e of bad) {
  let threw = false;
  try { nextRun(e, new Date('2024-01-01T00:00:00Z')); } catch (err) { threw = true; }
  assert(threw, 'should throw for: ' + e);
}` },
  ],
  solution: {
    code: `function nextRun(expr, from) {
  const bounds = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];
  const parts = expr.trim().split(/\\s+/);
  if (parts.length !== 5) throw new Error('Expected 5 fields');
  const sets = parts.map((part, i) => {
    const [min, max] = bounds[i];
    const set = new Set();
    for (const item of part.split(',')) {
      const [range, stepText] = item.split('/');
      const step = stepText === undefined ? 1 : Number(stepText);
      if (!Number.isInteger(step) || step < 1) throw new Error('Bad step');
      let lo;
      let hi;
      if (range === '*') {
        lo = min;
        hi = max;
      } else if (range.includes('-')) {
        [lo, hi] = range.split('-').map(Number);
      } else {
        lo = Number(range);
        hi = stepText === undefined ? lo : max;
      }
      if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo < min || hi > max || lo > hi) {
        throw new Error('Out of range: ' + item);
      }
      for (let v = lo; v <= hi; v += step) set.add(v);
    }
    return set;
  });
  const domRestricted = parts[2] !== '*';
  const dowRestricted = parts[4] !== '*';
  const t = new Date(from.getTime());
  t.setUTCSeconds(0, 0);
  t.setUTCMinutes(t.getUTCMinutes() + 1);
  for (let i = 0; i < 5 * 366 * 24 * 60; i++) {
    const domOk = sets[2].has(t.getUTCDate());
    const dowOk = sets[4].has(t.getUTCDay());
    const dayOk = domRestricted && dowRestricted ? domOk || dowOk : domOk && dowOk;
    if (sets[0].has(t.getUTCMinutes()) && sets[1].has(t.getUTCHours()) && sets[3].has(t.getUTCMonth() + 1) && dayOk) {
      return t;
    }
    t.setUTCMinutes(t.getUTCMinutes() + 1);
  }
  throw new Error('No run within 5 years');
}

module.exports = nextRun;`,
    explanation:
      "Each field becomes a Set of allowed values, so matching is a lookup. The search simply walks forward a minute at a time from just after 'from'. Real schedulers jump ahead smarter, but this is the correct definition.",
  },
};
