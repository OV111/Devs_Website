export default {
    slug: "parse-multipart-form-data",
    trackId: "api-dev",
    layerId: "api-dev-4",
    type: "CODE",
    difficulty: "hard",
    title: "Parse multipart form-data without a library",
    summary: "Read the boundary, parse headers and binary content by hand.",
    description:
      "Every upload library you've used is doing this underneath. Do it once yourself and multipart stops being magic.",
    task:
      "Write <code>parseMultipart(buffer, boundary)</code>. <code>buffer</code> is a Node <code>Buffer</code> holding a full multipart/form-data body; <code>boundary</code> is the boundary string from the content-type header (without the leading <code>--</code>). Return an array of parts, each <code>{ name, filename, contentType, data }</code> — <code>filename</code>/<code>contentType</code> are <code>null</code> for plain fields, and <code>data</code> is a Buffer slice of that part's body.",
    constraints: [
      "No busboy, no multer, no multipart libraries — only Buffer instance methods.",
      "Binary content must survive intact — do not coerce part bodies to strings.",
      "Must handle the trailing boundary (the one suffixed with -- ) correctly and not emit a phantom empty part after it.",
    ],
    example: "",
    tags: ["streams", "parsing", "buffers"],
    estimatedMins: 42,
    xp: 70,
    starterFiles: [
      {
        name: "parseMultipart.js",
        lang: "js",
        code: `// parseMultipart.js
function parseMultipart(buffer, boundary) {
  // your code here
}

module.exports = parseMultipart;`,
      },
    ],
    testFile: {
      name: "parseMultipart_test.js",
      lang: "test",
      code: `// parseMultipart_test.js
const parseMultipart = require('./parseMultipart');

test('parses_a_single_field', () => {
  const boundary = 'X';
  const body = [
    '--X',
    'Content-Disposition: form-data; name="username"',
    '',
    'vahe',
    '--X--',
    '',
  ].join('\\r\\n');
  const parts = parseMultipart(Buffer.from(body), boundary);
  expect(parts.length).toBe(1);
  expect(parts[0].name).toBe('username');
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "Split the buffer on <code>--boundary</code> using <code>buffer.indexOf()</code> in a loop rather than converting the whole thing to a string first — that's what keeps binary content intact.",
      },
      {
        order: 2,
        cost: 5,
        text: "Each part looks like: headers, a blank line (<code>\\r\\n\\r\\n</code>), then raw body. Find that blank-line separator with <code>indexOf</code> to split headers from data within a part.",
      },
      {
        order: 3,
        cost: 15,
        text: "The <code>Content-Disposition</code> header holds <code>name=\"...\"</code> and, for files, <code>filename=\"...\"</code> — a regex on the header's string form (only the header slice, not the binary data) gets both out.",
      },
    ],
    hiddenTests: [
      {
        name: "parses_a_single_plain_field",
        code: `const boundary = 'X';
const body = ['--X','Content-Disposition: form-data; name="username"','','vahe','--X--',''].join('\\r\\n');
const parts = parseMultipart(Buffer.from(body), boundary);
assert(parts.length === 1, 'expected exactly one part, got ' + parts.length);
assert(parts[0].name === 'username', 'expected field name "username"');
assert(parts[0].data.toString() === 'vahe', 'expected field value "vahe"');
assert(parts[0].filename === null, 'a plain field must have filename === null');`,
      },
      {
        name: "parses_multiple_fields",
        code: `const boundary = 'X';
const body = [
  '--X','Content-Disposition: form-data; name="a"','','1',
  '--X','Content-Disposition: form-data; name="b"','','2',
  '--X--',''
].join('\\r\\n');
const parts = parseMultipart(Buffer.from(body), boundary);
assert(parts.length === 2, 'expected 2 parts, got ' + parts.length);
assert(parts[0].name === 'a' && parts[0].data.toString() === '1', 'first part should be a=1');
assert(parts[1].name === 'b' && parts[1].data.toString() === '2', 'second part should be b=2');`,
      },
      {
        name: "parses_a_file_part_with_content_type",
        code: `const boundary = 'X';
const body = [
  '--X',
  'Content-Disposition: form-data; name="avatar"; filename="pic.png"',
  'Content-Type: image/png',
  '',
  'BINARYDATA',
  '--X--',
  '',
].join('\\r\\n');
const parts = parseMultipart(Buffer.from(body), boundary);
assert(parts.length === 1, 'expected one part');
assert(parts[0].filename === 'pic.png', 'expected filename "pic.png", got ' + parts[0].filename);
assert(parts[0].contentType === 'image/png', 'expected contentType "image/png"');
assert(parts[0].data.toString() === 'BINARYDATA', 'expected the file body to survive intact');`,
      },
      {
        name: "no_phantom_part_after_trailing_boundary",
        code: `const boundary = 'X';
const body = ['--X','Content-Disposition: form-data; name="a"','','only','--X--',''].join('\\r\\n');
const parts = parseMultipart(Buffer.from(body), boundary);
assert(parts.length === 1, 'the closing --boundary-- must not produce a second, empty part — got ' + parts.length + ' parts');`,
      },
      {
        name: "binary_content_is_not_corrupted",
        code: `const boundary = 'X';
const binary = Buffer.from([0x00, 0xff, 0x0d, 0x0a, 0x10, 0x89, 0x50, 0x4e]);
const head = Buffer.from(['--X','Content-Disposition: form-data; name="f"; filename="x.bin"','Content-Type: application/octet-stream','',''].join('\\r\\n'));
const tail = Buffer.from('\\r\\n--X--\\r\\n');
const body = Buffer.concat([head, binary, tail]);
const parts = parseMultipart(body, boundary);
assert(parts.length === 1, 'expected one part');
assert(Buffer.compare(parts[0].data, binary) === 0, 'binary bytes must survive byte-for-byte, including 0x00 and 0x0d0x0a inside the payload');`,
      },
    ],
    solution: {
      code: `function parseMultipart(buffer, boundary) {
  const delimiter = '--' + boundary;
  const parts = [];

  const boundaryIndices = [];
  let searchFrom = 0;
  while (true) {
    const idx = buffer.indexOf(delimiter, searchFrom);
    if (idx === -1) break;
    boundaryIndices.push(idx);
    searchFrom = idx + delimiter.length;
  }

  for (let i = 0; i < boundaryIndices.length - 1; i++) {
    let start = boundaryIndices[i] + delimiter.length;
    const end = boundaryIndices[i + 1];

    // Skip the CRLF right after the boundary line, and stop before the
    // trailing "--" that marks the closing boundary.
    if (buffer.slice(start, start + 2).toString() === '--') continue;
    if (buffer[start] === 0x0d && buffer[start + 1] === 0x0a) start += 2;

    const partBuf = buffer.slice(start, end);
    const headerEnd = partBuf.indexOf('\\r\\n\\r\\n');
    if (headerEnd === -1) continue;

    const headerText = partBuf.slice(0, headerEnd).toString();
    // Trim the trailing CRLF that precedes the next boundary delimiter.
    let data = partBuf.slice(headerEnd + 4);
    if (data.length >= 2 && data[data.length - 2] === 0x0d && data[data.length - 1] === 0x0a) {
      data = data.slice(0, data.length - 2);
    }

    const nameMatch = headerText.match(/name="([^"]*)"/);
    const filenameMatch = headerText.match(/filename="([^"]*)"/);
    const contentTypeMatch = headerText.match(/Content-Type:\\s*([^\\r\\n]+)/i);

    parts.push({
      name: nameMatch ? nameMatch[1] : null,
      filename: filenameMatch ? filenameMatch[1] : null,
      contentType: contentTypeMatch ? contentTypeMatch[1].trim() : null,
      data,
    });
  }

  return parts;
}

module.exports = parseMultipart;`,
      explanation:
        "Splitting happens with Buffer.indexOf in a loop rather than converting to a string first, so multi-byte and null bytes inside a file's binary payload never get mangled by string decoding — only the small header slice of each part is ever turned into a string, since headers are always plain ASCII. Each part sits between two consecutive boundary occurrences; the trailing boundary is recognized by the '--' immediately following it and produces no output, which is what stops the loop from emitting a phantom empty final part. Within a part, the blank-line separator (\\r\\n\\r\\n) splits headers from the raw body, and the trailing CRLF that precedes the next boundary is trimmed off the data so it doesn't leak into the returned payload.",
    },
};
