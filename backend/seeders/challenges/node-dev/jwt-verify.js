export default {
  slug: "jwt-verify",
  trackId: "node-dev",
  layerId: "node-dev-6",
  type: "CODE",
  difficulty: "hard",
  title: "Verify a JWT correctly",
  summary: "Decode a token, enforce the allowed algorithms, check the signature in constant time, then validate exp, nbf, iss and aud.",
  description:
    "JWT libraries have had serious CVEs from tiny verification mistakes: accepting <code>alg: none</code>, trusting the algorithm named in the token, or comparing signatures with <code>===</code>. Verification must check the structure, the algorithm, the signature and only then the claims.",
  task:
    "Write <code>verifyJwt(token, { secret, algorithms = ['HS256'], sign, now, issuer, audience, clockToleranceSec = 0 })</code> returning <code>{ valid: true, header, payload }</code> or <code>{ valid: false, reason }</code>. <code>sign(data, secret, alg)</code> is injected and returns the expected base64url signature (the HMAC); <code>now()</code> returns milliseconds.",
  constraints: [
    "A token is <code>header.payload.signature</code>, each part base64url. Decode header and payload yourself (UTF-8 aware, no <code>Buffer</code>/<code>atob</code>) and parse them as JSON objects. Anything else (not a string, wrong part count, illegal characters, bad JSON, header or payload not a plain object) is <code>'malformed'</code>.",
    "<code>header.alg</code> must be a string that is in <code>algorithms</code>; <code>none</code> (any case) is ALWAYS rejected. Otherwise <code>'alg_not_allowed'</code>. Never trust the token to choose its own algorithm.",
    "Compute the expected signature over <code>part0 + '.' + part1</code> with <code>sign(data, secret, header.alg)</code> and compare it to the token's signature with a constant-time comparison (no early exit on the first differing character). Mismatch is <code>'bad_signature'</code>, and this check happens BEFORE any claim check.",
    "Claims, checked in this order, with <code>nowSec = floor(now() / 1000)</code>: <code>exp</code> (number, expired when <code>nowSec &gt;= exp + tolerance</code> gives <code>'expired'</code>), <code>nbf</code> (number, <code>nowSec &lt; nbf - tolerance</code> gives <code>'not_yet_valid'</code>). A non-number <code>exp</code> or <code>nbf</code> is <code>'invalid_claims'</code>.",
    "If <code>issuer</code> is given, <code>payload.iss</code> must equal it (<code>'bad_issuer'</code>). If <code>audience</code> is given, <code>payload.aud</code> (a string or an array) must include it (<code>'bad_audience'</code>). Missing optional claims are fine when no expectation is set.",
  ],
  example: `verifyJwt(token, { secret, sign: hmacSha256Base64Url, audience: 'my-api' }) // { valid: true, payload: { sub: '42', ... } }`,
  tags: ["jwt","auth","security","base64url"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "verifyJwt.js",
      lang: "js",
      code: `// verifyJwt.js
function verifyJwt(token, options) {
  // your code here
}

module.exports = verifyJwt;`,
    },
  ],
  testFile: {
    name: "verifyJwt_test.js",
    lang: "test",
    code: `const verifyJwt = require('./verifyJwt');

test('valid', () => {
  const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const r = verifyJwt(make({ sub: '1' }), opts()); expect(r.valid).toBe(true); expect(r.payload.sub).toBe('1');
});

test('bad_sig', () => {
  const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
expect(verifyJwt(make({ sub: '1' }, { secret: 'other' }), opts()).reason).toBe('bad_signature');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write a <code>decode(part)</code> helper: validate the characters, then accumulate 6 bits per character into bytes, and turn the bytes into text with <code>decodeURIComponent('%xx...')</code> so UTF-8 works." },
    { order: 2, cost: 5, text: "Write <code>constantTimeEqual(a, b)</code>: compare lengths, then OR together <code>a.charCodeAt(i) ^ b.charCodeAt(i)</code> over ALL positions and check the result is 0." },
    { order: 3, cost: 15, text: "Keep the checks in the order the problem lists: structure, algorithm, signature, then exp, nbf, iss, aud. Return early with <code>{ valid: false, reason }</code>." },
  ],
  hiddenTests: [
    { name: "valid_token_returns_header_and_payload", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const r = verifyJwt(make({ sub: 'user-1', role: 'admin' }), opts());
assert(r.valid === true, 'valid: ' + JSON.stringify(r));
assert(r.header.alg === 'HS256' && r.header.typ === 'JWT', 'header');
assert(r.payload.sub === 'user-1' && r.payload.role === 'admin', 'payload');` },
    { name: "malformed_tokens", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const good = make({ a: 1 });
const [h, p, s] = good.split('.');
const cases = [undefined, null, 42, '', 'abc', 'a.b', 'a.b.c.d', h + '.' + p, h + '.!!!.' + s, h + '.' + b64('not json') + '.' + s, b64('[1]') + '.' + p + '.' + s, h + '.' + b64('"str"') + '.' + s, h + '.' + b64('null') + '.' + s];
for (const c of cases) assert(verifyJwt(c, opts()).reason === 'malformed', 'should be malformed: ' + JSON.stringify(c));` },
    { name: "alg_none_is_always_rejected", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const head = b64(JSON.stringify({ alg: 'none', typ: 'JWT' }));
const body = b64(JSON.stringify({ sub: 'admin' }));
const token = head + '.' + body + '.';
assert(verifyJwt(token, opts()).reason === 'alg_not_allowed', 'none rejected');
assert(verifyJwt(token, opts({ algorithms: ['none', 'HS256'] })).reason === 'alg_not_allowed', 'even if the caller lists none');
const upper = b64(JSON.stringify({ alg: 'NoNe' })) + '.' + body + '.';
assert(verifyJwt(upper, opts({ algorithms: ['NoNe'] })).reason === 'alg_not_allowed', 'any casing');` },
    { name: "algorithm_must_be_in_the_allow_list", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const rs = make({ sub: '1' }, { alg: 'RS256' });
assert(verifyJwt(rs, opts()).reason === 'alg_not_allowed', 'RS256 token against an HS256-only verifier');
assert(verifyJwt(rs, opts({ algorithms: ['RS256'] })).valid === true, 'allowed when listed');
const noAlg = b64(JSON.stringify({ typ: 'JWT' })) + '.' + b64('{}') + '.x';
assert(verifyJwt(noAlg, opts()).reason === 'alg_not_allowed', 'missing alg');
const numAlg = b64(JSON.stringify({ alg: 5 })) + '.' + b64('{}') + '.x';
assert(verifyJwt(numAlg, opts()).reason === 'alg_not_allowed', 'non-string alg');` },
    { name: "signature_is_checked_with_the_injected_signer", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
let args = null;
const spy = (data, secret, alg) => { args = [data, secret, alg]; return sign(data, secret, alg); };
const token = make({ sub: '1' });
const r = verifyJwt(token, opts({ sign: spy }));
assert(r.valid, 'valid');
const [h, p] = token.split('.');
assert(args[0] === h + '.' + p && args[1] === 'k' && args[2] === 'HS256', 'sign receives header.payload, the secret and the alg: ' + JSON.stringify(args));` },
    { name: "tampering_is_detected", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const good = make({ sub: '1', role: 'user' });
const [h, p, s] = good.split('.');
const forged = h + '.' + b64(JSON.stringify({ sub: '1', role: 'admin' })) + '.' + s;
assert(verifyJwt(forged, opts()).reason === 'bad_signature', 'changed payload');
assert(verifyJwt(h + '.' + p + '.' + s.slice(0, -1) + (s.slice(-1) === 'A' ? 'B' : 'A'), opts()).reason === 'bad_signature', 'changed last signature char');
assert(verifyJwt(h + '.' + p + '.', opts()).reason === 'bad_signature', 'empty signature');
assert(verifyJwt(h + '.' + p + '.' + s + 'x', opts()).reason === 'bad_signature', 'longer signature');
assert(verifyJwt(good, opts({ secret: 'wrong' })).reason === 'bad_signature', 'wrong secret');` },
    { name: "signature_is_compared_over_all_characters", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const good = make({ sub: '1' });
const [h, p, s] = good.split('.');
const wrongFirst = (s[0] === 'A' ? 'B' : 'A') + s.slice(1);
const wrongLast = s.slice(0, -1) + (s.slice(-1) === 'A' ? 'B' : 'A');
assert(verifyJwt(h + '.' + p + '.' + wrongFirst, opts()).reason === 'bad_signature', 'differs at the start');
assert(verifyJwt(h + '.' + p + '.' + wrongLast, opts()).reason === 'bad_signature', 'differs at the end');
` },
    { name: "exp_boundary_and_future", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const now = () => 1000 * 1000;
assert(verifyJwt(make({ exp: 1001 }), opts({ now })).valid === true, 'one second left');
assert(verifyJwt(make({ exp: 1000 }), opts({ now })).reason === 'expired', 'expired exactly at exp');
assert(verifyJwt(make({ exp: 5 }), opts({ now })).reason === 'expired', 'long expired');
assert(verifyJwt(make({ sub: 'no exp' }), opts({ now })).valid === true, 'no exp means no expiry');` },
    { name: "not_before", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const now = () => 1000 * 1000;
assert(verifyJwt(make({ nbf: 1000 }), opts({ now })).valid === true, 'valid exactly at nbf');
assert(verifyJwt(make({ nbf: 1001 }), opts({ now })).reason === 'not_yet_valid', 'one second early');` },
    { name: "clock_tolerance", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const now = () => 1000 * 1000;
assert(verifyJwt(make({ exp: 990 }), opts({ now, clockToleranceSec: 15 })).valid === true, 'recently expired is accepted within tolerance');
assert(verifyJwt(make({ exp: 985 }), opts({ now, clockToleranceSec: 15 })).reason === 'expired', 'tolerance boundary: now >= exp + tolerance');
assert(verifyJwt(make({ nbf: 1010 }), opts({ now, clockToleranceSec: 15 })).valid === true, 'slightly early is accepted');
assert(verifyJwt(make({ nbf: 1016 }), opts({ now, clockToleranceSec: 15 })).reason === 'not_yet_valid', 'too early');` },
    { name: "invalid_claim_types", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
assert(verifyJwt(make({ exp: '9999999999' }), opts()).reason === 'invalid_claims', 'string exp');
assert(verifyJwt(make({ nbf: 'soon' }), opts()).reason === 'invalid_claims', 'string nbf');
assert(verifyJwt(make({ exp: null }), opts()).reason === 'invalid_claims', 'null exp');` },
    { name: "issuer_and_audience", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
assert(verifyJwt(make({ iss: 'auth.example' }), opts({ issuer: 'auth.example' })).valid === true, 'issuer ok');
assert(verifyJwt(make({ iss: 'evil' }), opts({ issuer: 'auth.example' })).reason === 'bad_issuer', 'wrong issuer');
assert(verifyJwt(make({}), opts({ issuer: 'auth.example' })).reason === 'bad_issuer', 'missing issuer when one is required');
assert(verifyJwt(make({ aud: 'api' }), opts({ audience: 'api' })).valid === true, 'string audience');
assert(verifyJwt(make({ aud: ['web', 'api'] }), opts({ audience: 'api' })).valid === true, 'array audience');
assert(verifyJwt(make({ aud: ['web'] }), opts({ audience: 'api' })).reason === 'bad_audience', 'not included');
assert(verifyJwt(make({}), opts({ audience: 'api' })).reason === 'bad_audience', 'missing aud when required');
assert(verifyJwt(make({ iss: 'x', aud: 'y' }), opts()).valid === true, 'no expectations set, extra claims fine');` },
    { name: "claims_are_only_trusted_after_the_signature", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const expired = make({ exp: 1 });
const [h, p, s] = expired.split('.');
const forged = h + '.' + p + '.' + s.slice(0, -1) + (s.slice(-1) === 'A' ? 'B' : 'A');
assert(verifyJwt(forged, opts()).reason === 'bad_signature', 'signature failure is reported before expiry');
const wrongAlgExpired = make({ exp: 1 }, { alg: 'RS256' });
assert(verifyJwt(wrongAlgExpired, opts()).reason === 'alg_not_allowed', 'algorithm failure comes first too');` },
    { name: "claim_check_order", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const now = () => 1000 * 1000;
const t = make({ exp: 5, nbf: 99999, iss: 'x', aud: 'y' });
assert(verifyJwt(t, opts({ now, issuer: 'a', audience: 'b' })).reason === 'expired', 'exp first');
const t2 = make({ nbf: 99999, iss: 'x', aud: 'y' });
assert(verifyJwt(t2, opts({ now, issuer: 'a', audience: 'b' })).reason === 'not_yet_valid', 'then nbf');
const t3 = make({ iss: 'x', aud: 'y' });
assert(verifyJwt(t3, opts({ now, issuer: 'a', audience: 'b' })).reason === 'bad_issuer', 'then iss');` },
    { name: "utf8_payloads", code: `const B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const b64 = (str) => {
  let out = ''; let acc = 0; let bits = 0;
  for (let i = 0; i < str.length; i++) {
    acc = (acc << 8) | str.charCodeAt(i); bits += 8;
    while (bits >= 6) { bits -= 6; out += B[(acc >> bits) & 63]; acc &= (1 << bits) - 1; }
  }
  if (bits > 0) out += B[(acc << (6 - bits)) & 63];
  return out;
};
const utf8 = (s) => unescape(encodeURIComponent(s));
const sign = (data, secret, alg) => {
  let h = 7; const s = alg + '|' + secret + '|' + data;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return b64('sig' + h);
};
const make = (payload, o = {}) => {
  const alg = o.alg || 'HS256';
  const head = b64(JSON.stringify({ alg, typ: 'JWT' }));
  const body = b64(utf8(JSON.stringify(payload)));
  return head + '.' + body + '.' + sign(head + '.' + body, o.secret || 'k', alg);
};
const opts = (extra = {}) => ({ secret: 'k', sign, now: () => 1000000, ...extra });
const r = verifyJwt(make({ name: 'Zoë € 日本' }), opts());
assert(r.valid === true, 'valid');
assert(r.payload.name === 'Zoë € 日本', 'decoded as UTF-8: ' + JSON.stringify(r.payload));` },
  ],
  solution: {
    code: `function verifyJwt(token, { secret, algorithms = ['HS256'], sign, now = () => Date.now(), issuer, audience, clockToleranceSec = 0 }) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const fail = (reason) => ({ valid: false, reason });
  const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

  function decode(part) {
    if (!/^[A-Za-z0-9_-]*$/.test(part) || part.length % 4 === 1) throw new Error('bad base64url');
    const bytes = [];
    let acc = 0;
    let bits = 0;
    for (const ch of part) {
      acc = (acc << 6) | ALPHABET.indexOf(ch);
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((acc >> bits) & 0xff);
        acc &= (1 << bits) - 1;
      }
    }
    return decodeURIComponent(bytes.map((b) => '%' + b.toString(16).padStart(2, '0')).join(''));
  }

  function constantTimeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  if (typeof token !== 'string') return fail('malformed');
  const parts = token.split('.');
  if (parts.length !== 3) return fail('malformed');

  let header;
  let payload;
  try {
    header = JSON.parse(decode(parts[0]));
    payload = JSON.parse(decode(parts[1]));
  } catch (err) {
    return fail('malformed');
  }
  if (!isObject(header) || !isObject(payload)) return fail('malformed');

  if (typeof header.alg !== 'string' || header.alg.toLowerCase() === 'none' || !algorithms.includes(header.alg)) {
    return fail('alg_not_allowed');
  }

  const expected = sign(parts[0] + '.' + parts[1], secret, header.alg);
  if (!constantTimeEqual(expected, parts[2])) return fail('bad_signature');

  const nowSec = Math.floor(now() / 1000);
  if (payload.exp !== undefined) {
    if (typeof payload.exp !== 'number') return fail('invalid_claims');
    if (nowSec >= payload.exp + clockToleranceSec) return fail('expired');
  }
  if (payload.nbf !== undefined) {
    if (typeof payload.nbf !== 'number') return fail('invalid_claims');
    if (nowSec < payload.nbf - clockToleranceSec) return fail('not_yet_valid');
  }
  if (issuer !== undefined && payload.iss !== issuer) return fail('bad_issuer');
  if (audience !== undefined) {
    const aud = payload.aud === undefined ? [] : [].concat(payload.aud);
    if (!aud.includes(audience)) return fail('bad_audience');
  }
  return { valid: true, header, payload };
}

module.exports = verifyJwt;`,
    explanation:
      "The order is the security model: structure first, then the algorithm from YOUR allow-list (never the token's own claim), then the signature, and only then are the claims trusted. The constant-time compare avoids leaking how many leading characters of a forged signature were right.",
  },
};
