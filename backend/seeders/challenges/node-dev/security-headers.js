export default {
  slug: "security-headers",
  trackId: "node-dev",
  layerId: "node-dev-6",
  type: "CODE",
  difficulty: "med",
  title: "Build security headers like helmet",
  summary: "Generate a Content-Security-Policy, HSTS and other protective headers, validating mistakes like unquoted keywords.",
  description:
    "Helmet sets a bundle of HTTP response headers that close common browser-side holes: CSP against XSS, HSTS to force HTTPS, nosniff, framing and referrer rules. The valuable part is not the string building but refusing invalid combinations.",
  task:
    "Write <code>helmetHeaders(options)</code> returning <code>{ headers, remove }</code> where <code>headers</code> maps header names to values and <code>remove</code> lists headers to delete.",
  constraints: [
    "Defaults (all on): <code>Content-Security-Policy</code> with directives <code>default-src 'self'; base-uri 'self'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'; frame-ancestors 'self'</code>; <code>Strict-Transport-Security: max-age=15552000; includeSubDomains</code>; <code>X-Content-Type-Options: nosniff</code>; <code>X-Frame-Options: SAMEORIGIN</code>; <code>Referrer-Policy: no-referrer</code>; <code>Cross-Origin-Opener-Policy: same-origin</code>; and <code>remove: ['X-Powered-By']</code>.",
    "<code>options.contentSecurityPolicy</code>: <code>false</code> disables it, or <code>{ directives }</code> overrides defaults per directive (replacing that directive; a value of <code>null</code>/<code>false</code> removes it; new directives are appended). Directive names may be camelCase (<code>scriptSrc</code> becomes <code>script-src</code>). Values are arrays of strings joined by spaces; directives joined by <code>'; '</code>.",
    "CSP validation: the keywords <code>self none unsafe-inline unsafe-eval strict-dynamic</code> must be single-quoted (<code>Error('CSP keyword must be quoted: self')</code>); <code>'none'</code> may not be combined with other sources in the same directive (<code>Error(\"'none' cannot be combined with other sources in object-src\")</code>, naming the directive); a directive value must be an array of strings (<code>Error('CSP directive must be an array: name')</code>).",
    "<code>options.hsts</code>: <code>false</code> disables, or <code>{ maxAge, includeSubDomains = true, preload = false }</code>; <code>maxAge</code> must be a non-negative integer (<code>Error('HSTS maxAge must be a non-negative integer')</code>); <code>preload: true</code> requires <code>maxAge &gt;= 31536000</code> and <code>includeSubDomains</code> (<code>Error('HSTS preload requires maxAge >= 31536000 and includeSubDomains')</code>) and appends <code>; preload</code>.",
    "<code>options.frameguard</code>: <code>false</code> or <code>{ action: 'deny' | 'sameorigin' }</code> (anything else throws <code>Error('Invalid frameguard action')</code>). <code>options.referrerPolicy</code>: a string or array (joined with <code>,</code>) from the standard policy names (<code>no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url</code>), else <code>Error('Invalid referrer policy: x')</code>; <code>false</code> disables. <code>noSniff</code>, <code>crossOriginOpenerPolicy</code> (or a string value) and <code>hidePoweredBy</code> (<code>false</code> gives an empty <code>remove</code>) can also be switched off with <code>false</code>.",
  ],
  example: `helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: ["'self'", 'https://cdn.example.com'] } } }).headers['Content-Security-Policy']`,
  tags: ["helmet","csp","hsts","security","headers"],
  estimatedMins: 40,
  xp: 45,
  starterFiles: [
    {
      name: "helmetHeaders.js",
      lang: "js",
      code: `// helmetHeaders.js
function helmetHeaders(options = {}) {
  // your code here
}

module.exports = helmetHeaders;`,
    },
  ],
  testFile: {
    name: "helmetHeaders_test.js",
    lang: "test",
    code: `const helmetHeaders = require('./helmetHeaders');

test('defaults', () => {
  const r = helmetHeaders(); expect(r.headers['X-Content-Type-Options']).toBe('nosniff'); expect(r.remove).toEqual(['X-Powered-By']);
});

test('unquoted', () => {
  expect(() => helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: ['self'] } } })).toThrow();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Start with a defaults object of directives (kebab-case keys) and merge the user's directives into a copy, converting camelCase with <code>replace(/[A-Z]/g, c =&gt; '-' + c.toLowerCase())</code>." },
    { order: 2, cost: 5, text: "Validate each directive's array: type check, then for each value test it against <code>/^(self|none|unsafe-inline|unsafe-eval|strict-dynamic)$/</code> (unquoted keyword is a mistake)." },
    { order: 3, cost: 15, text: "Build each header independently with an <code>if (option !== false)</code> block and only add it to <code>headers</code> when enabled." },
  ],
  hiddenTests: [
    { name: "default_headers_exactly", code: `const r = helmetHeaders();
const h = r.headers;
assert(h['Content-Security-Policy'] === "default-src 'self'; base-uri 'self'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'; frame-ancestors 'self'", 'csp: ' + h['Content-Security-Policy']);
assert(h['Strict-Transport-Security'] === 'max-age=15552000; includeSubDomains', 'hsts: ' + h['Strict-Transport-Security']);
assert(h['X-Content-Type-Options'] === 'nosniff' && h['X-Frame-Options'] === 'SAMEORIGIN', 'nosniff and framing');
assert(h['Referrer-Policy'] === 'no-referrer' && h['Cross-Origin-Opener-Policy'] === 'same-origin', 'referrer and COOP');
assert(r.remove.length === 1 && r.remove[0] === 'X-Powered-By', 'remove');` },
    { name: "csp_directive_overrides_replace_and_append", code: `const r = helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: ["'self'", 'https://cdn.example.com'], 'connect-src': ["'self'", 'https://api.example.com'] } } });
const csp = r.headers['Content-Security-Policy'];
assert(csp.includes("script-src 'self' https://cdn.example.com;"), 'camelCase converted and replaced in place: ' + csp);
assert(csp.startsWith("default-src 'self'; base-uri 'self'; img-src 'self' data:; object-src 'none'; script-src 'self' https://cdn.example.com; style-src"), 'position preserved: ' + csp);
assert(csp.endsWith("frame-ancestors 'self'; connect-src 'self' https://api.example.com"), 'new directive appended: ' + csp);` },
    { name: "csp_directives_can_be_removed", code: `const r = helmetHeaders({ contentSecurityPolicy: { directives: { imgSrc: null, styleSrc: false } } });
const csp = r.headers['Content-Security-Policy'];
assert(csp.indexOf('img-src') === -1 && csp.indexOf('style-src') === -1, 'removed: ' + csp);
assert(csp.indexOf('script-src') !== -1, 'others stay');` },
    { name: "csp_can_be_disabled", code: `const r = helmetHeaders({ contentSecurityPolicy: false });
assert(!('Content-Security-Policy' in r.headers), 'no CSP');
assert('X-Content-Type-Options' in r.headers, 'other headers remain');` },
    { name: "csp_keywords_must_be_quoted", code: `for (const kw of ['self', 'none', 'unsafe-inline', 'unsafe-eval', 'strict-dynamic']) {
  let msg = null;
  try { helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: [kw] } } }); } catch (e) { msg = e.message; }
  assert(msg === 'CSP keyword must be quoted: ' + kw, kw + ' -> ' + msg);
}
assert(helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: ["'self'", "'unsafe-inline'", "'strict-dynamic'", 'https://x.io', 'data:'] } } }).headers['Content-Security-Policy'].includes("script-src 'self' 'unsafe-inline' 'strict-dynamic' https://x.io data:"), 'quoted keywords and ordinary sources pass');` },
    { name: "none_cannot_be_combined", code: `let msg = null;
try { helmetHeaders({ contentSecurityPolicy: { directives: { objectSrc: ["'none'", "'self'"] } } }); } catch (e) { msg = e.message; }
assert(msg === "'none' cannot be combined with other sources in object-src", 'message: ' + msg);
assert(helmetHeaders({ contentSecurityPolicy: { directives: { objectSrc: ["'none'"] } } }).headers['Content-Security-Policy'].includes("object-src 'none'"), "a lone 'none' is fine");` },
    { name: "csp_values_must_be_arrays_of_strings", code: `let msg = null;
try { helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: "'self'" } } }); } catch (e) { msg = e.message; }
assert(msg === 'CSP directive must be an array: script-src', 'message: ' + msg);
let msg2 = null;
try { helmetHeaders({ contentSecurityPolicy: { directives: { scriptSrc: [5] } } }); } catch (e) { msg2 = e.message; }
assert(msg2 === 'CSP directive must be an array: script-src', 'non-string entries: ' + msg2);` },
    { name: "hsts_options", code: `assert(helmetHeaders({ hsts: { maxAge: 63072000 } }).headers['Strict-Transport-Security'] === 'max-age=63072000; includeSubDomains', 'custom max-age');
assert(helmetHeaders({ hsts: { maxAge: 100, includeSubDomains: false } }).headers['Strict-Transport-Security'] === 'max-age=100', 'no subdomains');
assert(helmetHeaders({ hsts: { maxAge: 31536000, preload: true } }).headers['Strict-Transport-Security'] === 'max-age=31536000; includeSubDomains; preload', 'preload');
assert(!('Strict-Transport-Security' in helmetHeaders({ hsts: false }).headers), 'disabled');
assert(helmetHeaders({ hsts: { maxAge: 0 } }).headers['Strict-Transport-Security'] === 'max-age=0; includeSubDomains', 'zero is allowed (it turns HSTS off in browsers)');` },
    { name: "hsts_validation", code: `const msg = (o) => { try { helmetHeaders({ hsts: o }); return null; } catch (e) { return e.message; } };
assert(msg({ maxAge: -1 }) === 'HSTS maxAge must be a non-negative integer', 'negative');
assert(msg({ maxAge: 1.5 }) === 'HSTS maxAge must be a non-negative integer', 'fraction');
assert(msg({ maxAge: '100' }) === 'HSTS maxAge must be a non-negative integer', 'string');
assert(msg({ maxAge: 1000, preload: true }) === 'HSTS preload requires maxAge >= 31536000 and includeSubDomains', 'preload with a short max-age');
assert(msg({ maxAge: 31536000, preload: true, includeSubDomains: false }) === 'HSTS preload requires maxAge >= 31536000 and includeSubDomains', 'preload without subdomains');` },
    { name: "frameguard", code: `assert(helmetHeaders({ frameguard: { action: 'deny' } }).headers['X-Frame-Options'] === 'DENY', 'deny');
assert(helmetHeaders({ frameguard: { action: 'sameorigin' } }).headers['X-Frame-Options'] === 'SAMEORIGIN', 'sameorigin');
assert(!('X-Frame-Options' in helmetHeaders({ frameguard: false }).headers), 'disabled');
let msg = null;
try { helmetHeaders({ frameguard: { action: 'allow-from' } }); } catch (e) { msg = e.message; }
assert(msg === 'Invalid frameguard action', 'message: ' + msg);` },
    { name: "referrer_policy", code: `assert(helmetHeaders({ referrerPolicy: 'same-origin' }).headers['Referrer-Policy'] === 'same-origin', 'string');
assert(helmetHeaders({ referrerPolicy: ['no-referrer', 'strict-origin-when-cross-origin'] }).headers['Referrer-Policy'] === 'no-referrer,strict-origin-when-cross-origin', 'array joined by comma');
assert(!('Referrer-Policy' in helmetHeaders({ referrerPolicy: false }).headers), 'disabled');
let msg = null;
try { helmetHeaders({ referrerPolicy: 'always' }); } catch (e) { msg = e.message; }
assert(msg === 'Invalid referrer policy: always', 'message: ' + msg);` },
    { name: "other_switches", code: `const off = helmetHeaders({ noSniff: false, crossOriginOpenerPolicy: false, hidePoweredBy: false });
assert(!('X-Content-Type-Options' in off.headers) && !('Cross-Origin-Opener-Policy' in off.headers), 'headers off');
assert(off.remove.length === 0, 'X-Powered-By is left alone');
assert(helmetHeaders({ crossOriginOpenerPolicy: 'same-origin-allow-popups' }).headers['Cross-Origin-Opener-Policy'] === 'same-origin-allow-popups', 'custom COOP value');
assert('Content-Security-Policy' in off.headers && 'Strict-Transport-Security' in off.headers, 'unrelated headers stay on');` },
    { name: "options_are_not_mutated_and_calls_are_independent", code: `const opts = { contentSecurityPolicy: { directives: { scriptSrc: ["'self'"] } } };
const before = JSON.stringify(opts);
helmetHeaders(opts);
assert(JSON.stringify(opts) === before, 'options untouched');
const a = helmetHeaders({ contentSecurityPolicy: { directives: { imgSrc: ['x.io'] } } });
const b = helmetHeaders();
assert(b.headers['Content-Security-Policy'].includes("img-src 'self' data:"), 'defaults are not changed by an earlier call: ' + b.headers['Content-Security-Policy']);
assert(a.headers['Content-Security-Policy'].includes('img-src x.io'), 'first call kept its override');` },
  ],
  solution: {
    code: `function helmetHeaders(options = {}) {
  const KEYWORDS = ['self', 'none', 'unsafe-inline', 'unsafe-eval', 'strict-dynamic'];
  const REFERRER = [
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
  ];
  const headers = {};
  const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

  if (options.contentSecurityPolicy !== false) {
    const directives = {
      'default-src': ["'self'"],
      'base-uri': ["'self'"],
      'img-src': ["'self'", 'data:'],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': ["'self'"],
      'frame-ancestors': ["'self'"],
    };
    const custom = (options.contentSecurityPolicy && options.contentSecurityPolicy.directives) || {};
    for (const [rawName, value] of Object.entries(custom)) {
      const name = kebab(rawName);
      if (value === null || value === false) {
        delete directives[name];
        continue;
      }
      if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
        throw new Error('CSP directive must be an array: ' + name);
      }
      for (const source of value) {
        if (KEYWORDS.includes(source)) throw new Error('CSP keyword must be quoted: ' + source);
      }
      if (value.includes("'none'") && value.length > 1) {
        throw new Error("'none' cannot be combined with other sources in " + name);
      }
      directives[name] = value;
    }
    headers['Content-Security-Policy'] = Object.entries(directives)
      .map(([name, values]) => [name, ...values].join(' '))
      .join('; ');
  }

  if (options.hsts !== false) {
    const { maxAge = 15552000, includeSubDomains = true, preload = false } = options.hsts || {};
    if (!Number.isInteger(maxAge) || maxAge < 0) throw new Error('HSTS maxAge must be a non-negative integer');
    if (preload && (maxAge < 31536000 || !includeSubDomains)) {
      throw new Error('HSTS preload requires maxAge >= 31536000 and includeSubDomains');
    }
    headers['Strict-Transport-Security'] =
      'max-age=' + maxAge + (includeSubDomains ? '; includeSubDomains' : '') + (preload ? '; preload' : '');
  }

  if (options.noSniff !== false) headers['X-Content-Type-Options'] = 'nosniff';

  if (options.frameguard !== false) {
    const action = (options.frameguard && options.frameguard.action) || 'sameorigin';
    if (action !== 'deny' && action !== 'sameorigin') throw new Error('Invalid frameguard action');
    headers['X-Frame-Options'] = action.toUpperCase();
  }

  if (options.referrerPolicy !== false) {
    const policies = [].concat(options.referrerPolicy === undefined ? 'no-referrer' : options.referrerPolicy);
    for (const policy of policies) {
      if (!REFERRER.includes(policy)) throw new Error('Invalid referrer policy: ' + policy);
    }
    headers['Referrer-Policy'] = policies.join(',');
  }

  if (options.crossOriginOpenerPolicy !== false) {
    headers['Cross-Origin-Opener-Policy'] =
      typeof options.crossOriginOpenerPolicy === 'string' ? options.crossOriginOpenerPolicy : 'same-origin';
  }

  return { headers, remove: options.hidePoweredBy === false ? [] : ['X-Powered-By'] };
}

module.exports = helmetHeaders;`,
    explanation:
      "Each header is built independently behind its own switch. The useful part is validation: an unquoted self is silently treated as a host name by browsers, so the policy would not protect anything. Failing loudly at startup beats shipping a broken CSP.",
  },
};
