export default {
  slug: "high-scores",
  trackId: "web-game",
  layerId: "web-game-4",
  type: "CODE",
  difficulty: "med",
  title: "High-score table with safe persistence",
  summary: "Insert scores into a capped leaderboard, sanitise arcade names, and load saved data from localStorage without trusting it.",
  description:
    "High scores usually live in <code>localStorage</code>: a plain string that players can edit, that older versions of your game wrote in a different shape, and that may simply be missing or corrupt. A leaderboard module has to insert correctly, keep a stable order for ties, and treat everything it reads back as untrusted.",
  task:
    "Write <code>sanitizeName(raw)</code>, <code>qualifies(table, score, max = 10)</code>, <code>addScore(table, entry, max = 10)</code>, <code>serialize(table)</code> and <code>deserialize(text, max = 10)</code>. A table is an array of <code>{ name, score, date }</code> sorted best first.",
  constraints: [
    "<code>sanitizeName</code>: upper-case, keep only <code>A-Z</code> and <code>0-9</code>, cut to 3 characters; if nothing is left (or the input is not a string) return <code>'AAA'</code>.",
    "<code>addScore(table, entry, max)</code> returns <code>{ table, rank }</code> without mutating the input. The score must be a finite number &gt;= 0 (otherwise throw <code>RangeError</code>) and is floored. The entry is inserted AFTER existing entries with an equal score (the earlier achiever keeps the better rank), the table is cut to <code>max</code>, and <code>rank</code> is the 1-based position or <code>null</code> if it did not make the cut. The name is sanitised; <code>date</code> defaults to <code>null</code>.",
    "<code>qualifies(table, score, max)</code> is true when the table has fewer than <code>max</code> entries or <code>score</code> is strictly greater than the last entry's score.",
    "<code>serialize(table)</code> returns <code>JSON.stringify({ v: 2, entries })</code> with entries of exactly <code>{ name, score, date }</code>.",
    "<code>deserialize(text, max)</code> never throws. It accepts the v2 format and the old v1 format (a bare array of <code>{ n, s }</code>), and returns <code>[]</code> for anything else (null, bad JSON, wrong shape). Each entry gets sanitised (name via <code>sanitizeName</code>, score floored, <code>date</code> kept only if it is a string, else <code>null</code>); entries whose score is not a finite number &gt;= 0 are dropped; the result is sorted by score descending (stable, so ties keep file order) and cut to <code>max</code>.",
  ],
  example: `addScore([{ name: 'ABC', score: 500, date: null }], { name: 'xyz!', score: 900 }) // rank 1`,
  tags: ["localstorage", "persistence", "validation", "leaderboard"],
  estimatedMins: 35,
  xp: 55,
  starterFiles: [
    {
      name: "highScores.js",
      lang: "js",
      code: `// highScores.js
function sanitizeName(raw) {
  // your code here
}

function qualifies(table, score, max = 10) {
  // your code here
}

function addScore(table, entry, max = 10) {
  // your code here
}

function serialize(table) {
  // your code here
}

function deserialize(text, max = 10) {
  // your code here
}

module.exports = { sanitizeName, qualifies, addScore, serialize, deserialize };`,
    },
  ],
  testFile: {
    name: "highScores_test.js",
    lang: "test",
    code: `const { sanitizeName, addScore } = require('./highScores');

test('sanitises names', () => {
  expect(sanitizeName('a-b_c d')).toBe('ABC');
  expect(sanitizeName('???')).toBe('AAA');
});

test('inserts in order', () => {
  const r = addScore([{ name: 'AAA', score: 100, date: null }], { name: 'bob', score: 200 });
  expect(r.rank).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "For insertion find the first index whose score is STRICTLY less than the new score; that automatically puts it after equal scores. Use <code>[...table]</code> + <code>splice</code>." },
    { order: 2, cost: 5, text: "<code>deserialize</code>: wrap everything in try/catch, then normalise v1 and v2 into one list of raw entries before the shared cleaning step." },
    { order: 3, cost: 15, text: "<code>Array.prototype.sort</code> is stable in modern engines, so sorting by score descending alone keeps ties in file order." },
  ],
  hiddenTests: [
    { name: "sanitize_name", code: `assert(sanitizeName('a-b_c d') === 'ABC', 'strips and cuts');
assert(sanitizeName('xy') === 'XY', 'short names stay short');
assert(sanitizeName('???') === 'AAA' && sanitizeName('') === 'AAA', 'empty falls back');
assert(sanitizeName(null) === 'AAA' && sanitizeName(42) === 'AAA' && sanitizeName(undefined) === 'AAA', 'non-strings');
assert(sanitizeName('a1b2c3') === 'A1B', 'digits are allowed');` },
    { name: "insert_keeps_the_table_sorted_and_reports_rank", code: `const t = [{ name: 'AAA', score: 300, date: null }, { name: 'BBB', score: 100, date: null }];
const r = addScore(t, { name: 'ccc', score: 200, date: '2026-01-01' });
assert(r.rank === 2, 'rank ' + r.rank);
assert(r.table.map((e) => e.score).join(',') === '300,200,100', 'order ' + r.table.map((e) => e.score));
assert(r.table[1].name === 'CCC' && r.table[1].date === '2026-01-01', 'entry stored sanitised');
assert(t.length === 2, 'input not mutated');` },
    { name: "ties_rank_below_existing_equal_scores", code: `const t = [{ name: 'OLD', score: 500, date: null }];
const r = addScore(t, { name: 'new', score: 500 });
assert(r.rank === 2 && r.table[0].name === 'OLD', 'earlier achiever keeps the better rank: ' + JSON.stringify(r));` },
    { name: "cap_cuts_the_table_and_rank_can_be_null", code: `let t = [];
for (let i = 1; i <= 3; i++) t = addScore(t, { name: 'P' + i, score: i * 100 }, 3).table;
assert(t.length === 3, 'full');
const low = addScore(t, { name: 'LOW', score: 50 }, 3);
assert(low.rank === null && low.table.length === 3 && low.table.every((e) => e.name !== 'LOW'), 'did not make the cut: ' + JSON.stringify(low));
const tie = addScore(t, { name: 'TIE', score: 100 }, 3);
assert(tie.rank === null, 'a tie with the last place does not displace it');
const top = addScore(t, { name: 'TOP', score: 999 }, 3);
assert(top.rank === 1 && top.table.length === 3 && top.table[2].score === 200, 'lowest is pushed out: ' + JSON.stringify(top.table));` },
    { name: "scores_are_validated_and_floored", code: `const bad = (v) => { try { addScore([], { name: 'A', score: v }); return false; } catch (e) { return e instanceof RangeError; } };
assert(bad(-1) && bad(NaN) && bad(Infinity) && bad('12') && bad(undefined), 'invalid scores throw RangeError');
assert(addScore([], { name: 'A', score: 12.9 }).table[0].score === 12, 'floored');
assert(addScore([], { name: 'A', score: 0 }).rank === 1, 'zero is allowed');` },
    { name: "qualifies", code: `const full = [{ name: 'A', score: 300, date: null }, { name: 'B', score: 200, date: null }];
assert(qualifies([], 0, 2) === true && qualifies(full.slice(0, 1), 1, 2) === true, 'room left');
assert(qualifies(full, 201, 2) === true, 'beats the last place');
assert(qualifies(full, 200, 2) === false && qualifies(full, 10, 2) === false, 'ties and lower do not qualify when full');` },
    { name: "serialize_format", code: `const text = serialize([{ name: 'ABC', score: 5, date: null, extra: 'dropped' }]);
const parsed = JSON.parse(text);
assert(parsed.v === 2 && parsed.entries.length === 1, 'versioned');
assert(JSON.stringify(parsed.entries[0]) === '{"name":"ABC","score":5,"date":null}', 'only known fields: ' + JSON.stringify(parsed.entries[0]));` },
    { name: "round_trip", code: `const table = addScore(addScore([], { name: 'aaa', score: 10, date: 'd1' }).table, { name: 'bbb', score: 20, date: 'd2' }).table;
const back = deserialize(serialize(table));
assert(JSON.stringify(back) === JSON.stringify(table), 'got ' + JSON.stringify(back));` },
    { name: "deserialize_never_throws_on_garbage", code: `const garbage = [null, undefined, '', 'not json', '{', '42', 'null', '"str"', '{}', '{"v":2}', '{"v":2,"entries":5}', '[1,2,3]', '{"entries":{}}'];
for (const g of garbage) {
  const r = deserialize(g);
  assert(Array.isArray(r), 'always an array for ' + JSON.stringify(g));
}
assert(deserialize('not json').length === 0 && deserialize(null).length === 0, 'empty on failure');` },
    { name: "deserialize_reads_the_old_v1_format", code: `const r = deserialize(JSON.stringify([{ n: 'old', s: 50 }, { n: 'top', s: 90 }]));
assert(r.length === 2 && r[0].name === 'TOP' && r[0].score === 90 && r[0].date === null, 'migrated and sorted: ' + JSON.stringify(r));` },
    { name: "deserialize_cleans_untrusted_entries", code: `const text = JSON.stringify({ v: 2, entries: [
  { name: 'ok!', score: 10.7, date: 5 },
  { name: 'neg', score: -1 },
  { name: 'str', score: '99' },
  { name: 'nan', score: null },
  null,
  'junk',
  { name: 'tie1', score: 10 },
  { name: 'tie2', score: 10 },
  { name: 'best', score: 100, date: '2026-02-02' },
] });
const r = deserialize(text);
assert(r.map((e) => e.name).join(',') === 'BES,OK,TIE,TIE', 'dropped bad rows, sorted, names cut to 3 and sanitised: ' + r.map((e) => e.name));
assert(r[1].score === 10 && r[1].date === null, 'score floored, non-string date nulled: ' + JSON.stringify(r[1]));
assert(r[2].name === 'TIE' && r[3].name === 'TIE', 'ties keep file order');` },
    { name: "deserialize_respects_max", code: `const entries = [];
for (let i = 0; i < 20; i++) entries.push({ name: 'P', score: i, date: null });
assert(deserialize(JSON.stringify({ v: 2, entries })).length === 10, 'default max is 10');
const r = deserialize(JSON.stringify({ v: 2, entries }), 3);
assert(r.length === 3 && r[0].score === 19, 'custom max keeps the best: ' + JSON.stringify(r));` },
  ],
  solution: {
    code: `function sanitizeName(raw) {
  if (typeof raw !== 'string') return 'AAA';
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  return cleaned || 'AAA';
}

function qualifies(table, score, max = 10) {
  return table.length < max || score > table[table.length - 1].score;
}

function addScore(table, entry, max = 10) {
  const { score } = entry;
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0) {
    throw new RangeError('score must be a finite number >= 0');
  }
  const record = {
    name: sanitizeName(entry.name),
    score: Math.floor(score),
    date: entry.date ?? null,
  };
  const next = [...table];
  let index = next.findIndex((e) => e.score < record.score);
  if (index === -1) index = next.length;
  next.splice(index, 0, record);
  const trimmed = next.slice(0, max);
  return { table: trimmed, rank: index < max ? index + 1 : null };
}

function serialize(table) {
  return JSON.stringify({
    v: 2,
    entries: table.map((e) => ({ name: e.name, score: e.score, date: e.date })),
  });
}

function deserialize(text, max = 10) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return [];
  }
  let raw;
  if (Array.isArray(data)) {
    raw = data.map((e) => (e && typeof e === 'object' ? { name: e.n, score: e.s, date: null } : null));
  } else if (data && typeof data === 'object' && data.v === 2 && Array.isArray(data.entries)) {
    raw = data.entries;
  } else {
    return [];
  }
  const entries = [];
  for (const e of raw) {
    if (!e || typeof e !== 'object') continue;
    if (typeof e.score !== 'number' || !Number.isFinite(e.score) || e.score < 0) continue;
    entries.push({
      name: sanitizeName(e.name),
      score: Math.floor(e.score),
      date: typeof e.date === 'string' ? e.date : null,
    });
  }
  entries.sort((a, b) => b.score - a.score);
  return entries.slice(0, max);
}

module.exports = { sanitizeName, qualifies, addScore, serialize, deserialize };`,
    explanation:
      "Everything coming out of localStorage is treated as hostile: parse inside try/catch, check the shape, and rebuild each entry field by field so stray properties and wrong types can't survive. A version number in the saved data is what lets you change the format later without breaking existing players; v1 is migrated on read. Inserting before the first strictly-lower score is the one-line way to get a stable tie order.",
  },
};
