export default {
  slug: "utf8-encode",
  trackId: "node-dev",
  layerId: "node-dev-2",
  type: "CODE",
  difficulty: "med",
  title: "Encode a string as UTF-8 bytes",
  summary: "Turn a JavaScript string into the byte array that Buffer.from(str, 'utf8') would produce.",
  description:
    "A Node Buffer holds bytes, a string holds characters, and one character can take 1 to 4 bytes. Mixing them up is why <code>str.length</code> is the wrong number for a Content-Length header.",
  task:
    "Write <code>utf8Encode(str)</code> returning an array of byte values (numbers 0-255). Do not use <code>Buffer</code> or <code>TextEncoder</code>.",
  constraints: [
    "Code points below 0x80 take 1 byte, below 0x800 take 2, below 0x10000 take 3, otherwise 4.",
    "Use the standard UTF-8 bit patterns: <code>110xxxxx 10xxxxxx</code>, <code>1110xxxx 10xxxxxx 10xxxxxx</code>, <code>11110xxx 10xxxxxx 10xxxxxx 10xxxxxx</code>.",
    "Characters outside the BMP (emoji) are surrogate pairs in a JS string but ONE code point; encode them as 4 bytes.",
    "A lone surrogate (unpaired) is encoded as the replacement character U+FFFD, bytes <code>[239, 191, 189]</code>.",
    "The empty string gives <code>[]</code>.",
  ],
  example: `utf8Encode('A\\u00e9') // [65, 195, 169]`,
  tags: ["buffers","encoding","unicode"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "utf8Encode.js",
      lang: "js",
      code: `// utf8Encode.js
function utf8Encode(str) {
  // your code here
}

module.exports = utf8Encode;`,
    },
  ],
  testFile: {
    name: "utf8Encode_test.js",
    lang: "test",
    code: `const utf8Encode = require('./utf8Encode');

test('ascii', () => {
  expect(utf8Encode('Hi')).toEqual([72, 105]);
});

test('two_bytes', () => {
  expect(utf8Encode('é')).toEqual([195, 169]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "<code>for (const ch of str)</code> iterates by code point, so a surrogate pair arrives as one character; get its number with <code>ch.codePointAt(0)</code>." },
    { order: 2, cost: 5, text: "Use shifts and masks: the first byte holds the high bits with a length marker, each continuation byte is <code>0x80 | (bits &amp; 0x3f)</code>." },
    { order: 3, cost: 15, text: "A lone surrogate comes through <code>for...of</code> as a single value in <code>0xD800-0xDFFF</code>; replace it with <code>0xFFFD</code> before encoding." },
  ],
  hiddenTests: [
    { name: "empty_and_ascii", code: `assert(utf8Encode('').length === 0, 'empty');
assert(utf8Encode('Az09 ~').join(',') === '65,122,48,57,32,126', 'ascii maps to itself');` },
    { name: "two_byte_characters", code: `assert(utf8Encode('é').join(',') === '195,169', 'e acute');
assert(utf8Encode('ß').join(',') === '195,159', 'sharp s');
assert(utf8Encode('߿').join(',') === '223,191', 'last two-byte code point');` },
    { name: "three_byte_characters", code: `assert(utf8Encode('€').join(',') === '226,130,172', 'euro sign');
assert(utf8Encode('ࠀ').join(',') === '224,160,128', 'first three-byte code point');
assert(utf8Encode('￿').join(',') === '239,191,191', 'last BMP code point');` },
    { name: "four_byte_characters_emoji", code: `assert(utf8Encode('\\u{1F600}').join(',') === '240,159,152,128', 'grinning face');
assert(utf8Encode('\\u{10000}').join(',') === '240,144,128,128', 'first astral code point');
assert(utf8Encode('\\u{10FFFF}').join(',') === '244,143,191,191', 'last code point');` },
    { name: "mixed_string", code: `assert(utf8Encode('aé€\\u{1F600}').join(',') === '97,195,169,226,130,172,240,159,152,128', 'mixed widths');` },
    { name: "length_is_not_byte_length", code: `const s = 'héllo';
assert(s.length === 5, 'chars');
assert(utf8Encode(s).length === 6, 'bytes');
assert('\\u{1F600}'.length === 2 && utf8Encode('\\u{1F600}').length === 4, 'surrogate pair is 2 UTF-16 units but 4 bytes');` },
    { name: "lone_surrogates_become_replacement", code: `assert(utf8Encode('\\ud800').join(',') === '239,191,189', 'lone high surrogate');
assert(utf8Encode('\\udc00').join(',') === '239,191,189', 'lone low surrogate');
assert(utf8Encode('a\\ud800b').join(',') === '97,239,191,189,98', 'in the middle of text');` },
    { name: "matches_textencoder_when_available", code: `if (typeof TextEncoder !== 'undefined') {
  const samples = ['hello', 'héllo wörld', '€100', '日本語', 'x\\u{1F600}y\\u{1F680}', 'café ☕'];
  for (const s of samples) {
    const expected = Array.from(new TextEncoder().encode(s)).join(',');
    assert(utf8Encode(s).join(',') === expected, 'differs from TextEncoder for ' + JSON.stringify(s));
  }
}` },
    { name: "returns_plain_array_of_bytes", code: `const r = utf8Encode('€');
assert(Array.isArray(r), 'array');
assert(r.every((b) => Number.isInteger(b) && b >= 0 && b <= 255), 'each is a byte');` },
  ],
  solution: {
    code: `function utf8Encode(str) {
  const bytes = [];
  for (const ch of str) {
    let cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) cp = 0xfffd;
    if (cp < 0x80) {
      bytes.push(cp);
    } else if (cp < 0x800) {
      bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    } else if (cp < 0x10000) {
      bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    } else {
      bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    }
  }
  return bytes;
}

module.exports = utf8Encode;`,
    explanation:
      "for...of walks code points, so surrogate pairs are already combined. The leading byte encodes the length in its top bits, and every continuation byte starts with 10. Unpaired surrogates aren't valid Unicode scalar values, so they become U+FFFD like Node does.",
  },
};
