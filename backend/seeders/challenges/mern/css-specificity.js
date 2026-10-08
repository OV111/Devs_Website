export default {
  slug: "css-specificity",
  trackId: "mern",
  layerId: "mern-1",
  type: "CODE",
  difficulty: "med",
  title: "CSS specificity calculator",
  summary: "Compute the (ids, classes, types) specificity of a selector and decide which rule wins the cascade.",
  description:
    "When two CSS rules target the same element, the browser picks the one with the higher specificity, and the later rule wins a tie. Specificity is three separate counters, not one number: a thousand classes never beat a single id.",
  task:
    "Write <code>specificity(selector)</code> returning <code>[a, b, c]</code>, and <code>winner(selectors)</code> returning the index of the selector that wins the cascade (<code>-1</code> for an empty list). Selectors are single complex selectors with no top-level commas.",
  constraints: [
    "<code>a</code> counts id selectors (<code>#x</code>). <code>b</code> counts classes (<code>.x</code>), attribute selectors (<code>[href]</code>) and pseudo-classes (<code>:hover</code>, <code>:nth-child(2n+1)</code> counts once). <code>c</code> counts type selectors (<code>div</code>) and pseudo-elements (<code>::before</code>, plus the legacy single-colon <code>:before</code>, <code>:after</code>, <code>:first-line</code>, <code>:first-letter</code>).",
    "The universal selector <code>*</code> and combinators (space, <code>&gt;</code>, <code>+</code>, <code>~</code>) add nothing.",
    "<code>:is()</code>, <code>:not()</code> and <code>:has()</code> count as their most specific argument (arguments are comma separated, never nested) and the pseudo-class itself adds nothing. <code>:where()</code> always counts zero.",
    "<code>winner</code> compares <code>a</code>, then <code>b</code>, then <code>c</code>; there is no carry-over between counters. On a full tie the LATER selector wins.",
  ],
  example: `specificity('#nav .item a:hover') // [1, 2, 1]`,
  tags: ["css", "cascade", "parsing"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "cascade.js",
      lang: "js",
      code: `// cascade.js
function specificity(selector) {
  // your code here
}

function winner(selectors) {
  // your code here
}

module.exports = { specificity, winner };`,
    },
  ],
  testFile: {
    name: "cascade_test.js",
    lang: "test",
    code: `const { specificity, winner } = require('./cascade');

test('counts', () => {
  expect(specificity('#nav .item a')).toEqual([1, 1, 1]);
});

test('ties go to the later rule', () => {
  expect(winner(['.a', '.b'])).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Strip each kind of token out of the string as you count it (replace it with a space) so later patterns can't match the same characters twice." },
    { order: 2, cost: 5, text: "Handle <code>:is/:not/:has/:where</code> first: replace each with a space after adding the max of its arguments' specificity (recurse into <code>specificity</code>). Then attributes, ids, classes, pseudo-elements, and only then pseudo-classes." },
    { order: 3, cost: 15, text: "After everything else is removed, split on whitespace and combinators; every remaining token that starts with a letter is a type selector. Compare results as arrays element by element." },
  ],
  hiddenTests: [
    { name: "counts_ids_classes_types", code: `assert(JSON.stringify(specificity('#nav .item a')) === '[1,1,1]', 'got ' + JSON.stringify(specificity('#nav .item a')));
assert(JSON.stringify(specificity('ul li')) === '[0,0,2]', 'two types');
assert(JSON.stringify(specificity('.a.b#c')) === '[1,2,0]', 'compound selector');` },
    { name: "universal_and_combinators_add_nothing", code: `assert(JSON.stringify(specificity('*')) === '[0,0,0]', 'universal');
assert(JSON.stringify(specificity('h1 + h2 > h3 ~ h4')) === '[0,0,4]', 'combinators ignored, four types');
assert(JSON.stringify(specificity('* > p')) === '[0,0,1]', 'universal plus type');` },
    { name: "attributes_and_pseudo_classes_count_as_classes", code: `assert(JSON.stringify(specificity('a[href].btn:hover')) === '[0,3,1]', 'attr + class + pseudo-class');
assert(JSON.stringify(specificity('[type="text"]')) === '[0,1,0]', 'attribute only');
assert(JSON.stringify(specificity('li:nth-child(2n+1)')) === '[0,1,1]', 'nth-child counts once');` },
    { name: "pseudo_elements_count_as_types", code: `assert(JSON.stringify(specificity('p::first-line')) === '[0,0,2]', 'double colon');
assert(JSON.stringify(specificity('p:before')) === '[0,0,2]', 'legacy single colon is a pseudo-element');
assert(JSON.stringify(specificity('a:hover::after')) === '[0,1,2]', 'mixed');` },
    { name: "functional_pseudo_classes", code: `assert(JSON.stringify(specificity(':not(#a)')) === '[1,0,0]', 'not counts its argument');
assert(JSON.stringify(specificity(':is(.a, #b, p)')) === '[1,0,0]', 'is takes the most specific argument');
assert(JSON.stringify(specificity(':where(#a) p')) === '[0,0,1]', 'where is zero');
assert(JSON.stringify(specificity('li:has(> a.x)')) === '[0,1,2]', 'has counts its argument plus the element: ' + JSON.stringify(specificity('li:has(> a.x)')));` },
    { name: "winner_higher_specificity", code: `assert(winner(['.a', '#b', 'p']) === 1, 'id beats class and type');
assert(winner(['a b c', 'ul']) === 0, 'three types beat one');` },
    { name: "no_carry_over_between_counters", code: `const many = '.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p';
assert(winner([many, '#x']) === 1, 'one id beats any number of classes');
assert(winner(['a b c d e f g h', '.x']) === 1, 'one class beats any number of types');` },
    { name: "ties_go_to_the_later_rule", code: `assert(winner(['.a', '.b']) === 1, 'later wins');
assert(winner(['.a', '.b', 'p']) === 1, 'ties with a lower rule after');
assert(winner(['div', 'div']) === 1, 'identical selectors');` },
    { name: "empty_and_single", code: `assert(winner([]) === -1, 'empty list');
assert(winner(['p']) === 0, 'single selector');` },
  ],
  solution: {
    code: `function compare(x, y) {
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  }
  return 0;
}

function specificity(selector) {
  let a = 0, b = 0, c = 0;
  let s = selector;

  s = s.replace(/:(not|is|has|where)\\(([^()]*)\\)/g, (_, name, arg) => {
    if (name === 'where') return ' ';
    let best = [0, 0, 0];
    for (const part of arg.split(',')) {
      const sp = specificity(part.trim());
      if (compare(sp, best) > 0) best = sp;
    }
    a += best[0]; b += best[1]; c += best[2];
    return ' ';
  });
  s = s.replace(/\\[[^\\]]*\\]/g, () => { b++; return ' '; });
  s = s.replace(/#[\\w-]+/g, () => { a++; return ' '; });
  s = s.replace(/\\.[\\w-]+/g, () => { b++; return ' '; });
  s = s.replace(/::[\\w-]+/g, () => { c++; return ' '; });
  s = s.replace(/:(before|after|first-line|first-letter)\\b/g, () => { c++; return ' '; });
  s = s.replace(/:[\\w-]+(\\([^)]*\\))?/g, () => { b++; return ' '; });
  for (const token of s.split(/[\\s>+~]+/)) {
    if (/^[a-zA-Z]/.test(token)) c++;
  }
  return [a, b, c];
}

function winner(selectors) {
  let best = -1;
  let bestSpec = null;
  selectors.forEach((sel, i) => {
    const sp = specificity(sel);
    if (bestSpec === null || compare(sp, bestSpec) >= 0) {
      best = i;
      bestSpec = sp;
    }
  });
  return best;
}

module.exports = { specificity, winner };`,
    explanation:
      "Each token kind is counted and then replaced by a space, so a class name like .a can't also be counted as a type, and the id inside :not(#a) is handled by recursion. Specificity is a 3-tuple compared left to right, which is why many classes never overtake one id. Using >= when scanning makes the later rule win ties.",
  },
};
