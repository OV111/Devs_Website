export default {
  slug: "media-query-match",
  trackId: "mern",
  layerId: "mern-1",
  type: "CODE",
  difficulty: "med",
  title: "Evaluate a CSS media query",
  summary: "Decide whether a media query string matches a given viewport: types, width/height/orientation features, and, not, commas.",
  description:
    "Responsive design hangs on <code>@media</code> queries. <code>window.matchMedia</code> parses the string and answers yes or no for the current viewport. Reimplement the useful subset.",
  task:
    "Write <code>matchesQuery(query, env)</code> where <code>env</code> is <code>{ width, height, type }</code> (<code>type</code> defaults to <code>'screen'</code>). Return a boolean.",
  constraints: [
    "A comma separates alternatives: the query matches if ANY alternative matches. An empty or blank query matches everything.",
    "An alternative is an optional <code>not</code> or <code>only</code> prefix, an optional media type (<code>screen</code>, <code>print</code>, <code>all</code>; omitted means <code>all</code>), then zero or more <code>(feature: value)</code> conditions joined with <code>and</code>. <code>not</code> negates the whole alternative; <code>only</code> does nothing.",
    "Supported features: <code>width</code>, <code>min-width</code>, <code>max-width</code>, <code>height</code>, <code>min-height</code>, <code>max-height</code> (min and max are inclusive) and <code>orientation: portrait|landscape</code> (portrait when <code>height &gt;= width</code>).",
    "Lengths accept <code>px</code>, <code>em</code> and <code>rem</code> (both = 16px); a unitless value is only valid when it is <code>0</code>.",
    "Everything is case-insensitive and whitespace-tolerant. An alternative containing an unknown feature, a bad value, or leftover junk never matches, even with <code>not</code>.",
  ],
  example: `matchesQuery('screen and (min-width: 600px) and (max-width: 900px)', { width: 700, height: 500 }) // true`,
  tags: ["css", "responsive", "parsing"],
  estimatedMins: 35,
  xp: 50,
  starterFiles: [
    {
      name: "matchesQuery.js",
      lang: "js",
      code: `// matchesQuery.js
function matchesQuery(query, env) {
  // your code here
}

module.exports = matchesQuery;`,
    },
  ],
  testFile: {
    name: "matchesQuery_test.js",
    lang: "test",
    code: `const matchesQuery = require('./matchesQuery');

test('min-width', () => {
  expect(matchesQuery('(min-width: 600px)', { width: 800, height: 600 })).toBe(true);
});

test('comma means or', () => {
  expect(matchesQuery('(max-width: 400px), (min-width: 1000px)', { width: 700, height: 600 })).toBe(false);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Lower-case the query, <code>split(',')</code>, and return true if any part's evaluation is true." },
    { order: 2, cost: 5, text: "Per part: peel off a leading <code>not</code>/<code>only</code>, then an optional media type (and a following <code>and</code>), then pull every <code>(name: value)</code> out with <code>matchAll</code>." },
    { order: 3, cost: 15, text: "After removing the matched conditions, the leftover string should contain only <code>and</code> words and whitespace; anything else means the part is malformed and must be false (before applying <code>not</code>)." },
  ],
  hiddenTests: [
    { name: "min_and_max_width_are_inclusive", code: `const env = { width: 600, height: 400 };
assert(matchesQuery('(min-width: 600px)', env) === true, 'min boundary');
assert(matchesQuery('(min-width: 601px)', env) === false, 'below min');
assert(matchesQuery('(max-width: 600px)', env) === true, 'max boundary');
assert(matchesQuery('(max-width: 599px)', env) === false, 'above max');
assert(matchesQuery('(width: 600px)', env) === true, 'exact');` },
    { name: "height_features", code: `const env = { width: 600, height: 400 };
assert(matchesQuery('(min-height: 400px)', env) === true, 'min-height');
assert(matchesQuery('(max-height: 399px)', env) === false, 'max-height');
assert(matchesQuery('(height: 400px)', env) === true, 'height');` },
    { name: "and_combines_conditions", code: `const q = '(min-width: 600px) and (max-width: 900px)';
assert(matchesQuery(q, { width: 700, height: 1 }) === true, 'inside');
assert(matchesQuery(q, { width: 950, height: 1 }) === false, 'above');
assert(matchesQuery(q, { width: 500, height: 1 }) === false, 'below');` },
    { name: "media_types", code: `assert(matchesQuery('screen', { width: 1, height: 1 }) === true, 'default type is screen');
assert(matchesQuery('print', { width: 1, height: 1 }) === false, 'print vs screen');
assert(matchesQuery('print', { width: 1, height: 1, type: 'print' }) === true, 'print env');
assert(matchesQuery('all', { width: 1, height: 1, type: 'print' }) === true, 'all');
assert(matchesQuery('screen and (min-width: 500px)', { width: 800, height: 1, type: 'print' }) === false, 'type must match too');
assert(matchesQuery('(min-width: 500px)', { width: 800, height: 1, type: 'print' }) === true, 'omitted type matches any');` },
    { name: "comma_is_or", code: `const q = '(max-width: 400px), (min-width: 1000px)';
assert(matchesQuery(q, { width: 300, height: 1 }) === true, 'first');
assert(matchesQuery(q, { width: 1200, height: 1 }) === true, 'second');
assert(matchesQuery(q, { width: 700, height: 1 }) === false, 'neither');` },
    { name: "not_negates_the_whole_alternative", code: `assert(matchesQuery('not screen', { width: 1, height: 1 }) === false, 'not screen on a screen');
assert(matchesQuery('not print', { width: 1, height: 1 }) === true, 'not print on a screen');
assert(matchesQuery('not screen and (min-width: 600px)', { width: 500, height: 1 }) === true, 'not (screen and false)');
assert(matchesQuery('not screen and (min-width: 600px)', { width: 700, height: 1 }) === false, 'not (screen and true)');
assert(matchesQuery('only screen and (min-width: 600px)', { width: 700, height: 1 }) === true, 'only is a no-op');` },
    { name: "em_and_rem_units", code: `assert(matchesQuery('(min-width: 40em)', { width: 640, height: 1 }) === true, '40em = 640px');
assert(matchesQuery('(min-width: 40em)', { width: 639, height: 1 }) === false, 'just under');
assert(matchesQuery('(max-width: 30rem)', { width: 480, height: 1 }) === true, 'rem');
assert(matchesQuery('(min-width: 0)', { width: 5, height: 1 }) === true, 'unitless zero is valid');` },
    { name: "orientation", code: `assert(matchesQuery('(orientation: landscape)', { width: 800, height: 600 }) === true, 'landscape');
assert(matchesQuery('(orientation: portrait)', { width: 800, height: 600 }) === false, 'not portrait');
assert(matchesQuery('(orientation: portrait)', { width: 600, height: 600 }) === true, 'square counts as portrait');` },
    { name: "case_and_whitespace_tolerant", code: `assert(matchesQuery('  SCREEN   AND ( MIN-WIDTH : 600PX )  ', { width: 700, height: 1 }) === true, 'messy but valid');` },
    { name: "invalid_alternatives_never_match", code: `const env = { width: 700, height: 500 };
assert(matchesQuery('(hover: hover)', env) === false, 'unknown feature');
assert(matchesQuery('(min-width: wide)', env) === false, 'bad value');
assert(matchesQuery('(min-width: 5)', env) === false, 'unitless non-zero');
assert(matchesQuery('not (hover: hover)', env) === false, 'not does not rescue a malformed part');
assert(matchesQuery('(hover: hover), (min-width: 600px)', env) === true, 'a valid alternative still matches');` },
    { name: "empty_query_matches_everything", code: `assert(matchesQuery('', { width: 1, height: 1 }) === true, 'empty');
assert(matchesQuery('   ', { width: 1, height: 1 }) === true, 'blank');` },
  ],
  solution: {
    code: `function toPx(value) {
  const m = /^(-?\\d*\\.?\\d+)(px|em|rem)?$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!m[2]) return n === 0 ? 0 : null;
  return m[2] === 'px' ? n : n * 16;
}

function matchPart(part, env) {
  let s = part.trim();
  let negate = false;
  if (/^not\\s/.test(s)) { negate = true; s = s.slice(3).trim(); }
  else if (/^only\\s/.test(s)) s = s.slice(4).trim();

  let type = 'all';
  const tm = /^(screen|print|all)\\b/.exec(s);
  if (tm) {
    type = tm[1];
    s = s.slice(type.length).trim();
    if (/^and\\b/.test(s)) s = s.slice(3).trim();
  }

  const conds = [...s.matchAll(/\\(\\s*([a-z-]+)\\s*(?::\\s*([^)]+?))?\\s*\\)/g)];
  const leftover = s.replace(/\\(\\s*[a-z-]+\\s*(?::\\s*[^)]+?)?\\s*\\)/g, ' ').replace(/\\band\\b/g, ' ').trim();
  if (leftover) return false;

  const { width, height } = env;
  const envType = env.type || 'screen';
  let ok = type === 'all' || type === envType;
  for (const [, feature, raw] of conds) {
    if (feature === 'orientation') {
      if (raw !== 'portrait' && raw !== 'landscape') return false;
      ok = ok && (raw === 'portrait') === (height >= width);
      continue;
    }
    const m = /^(min-|max-)?(width|height)$/.exec(feature);
    if (!m || raw === undefined) return false;
    const px = toPx(raw);
    if (px === null) return false;
    const actual = m[2] === 'width' ? width : height;
    if (m[1] === 'min-') ok = ok && actual >= px;
    else if (m[1] === 'max-') ok = ok && actual <= px;
    else ok = ok && actual === px;
  }
  return negate ? !ok : ok;
}

function matchesQuery(query, env) {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return q.split(',').some((part) => matchPart(part, env));
}

module.exports = matchesQuery;`,
    explanation:
      "Each comma part is parsed in the same order the grammar reads: prefix, media type, conditions. Subtracting the recognised conditions and the word 'and' from the string and checking nothing is left is a cheap way to reject malformed input without writing a full tokenizer. Validity is decided before 'not' is applied, which is why a broken part can never be rescued by negating it.",
  },
};
