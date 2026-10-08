export default {
  slug: "ssrf-guard",
  trackId: "node-dev",
  layerId: "node-dev-6",
  type: "CODE",
  difficulty: "hard",
  title: "Block SSRF in user-supplied URLs",
  summary: "Decide whether the server may fetch a URL: schemes, credentials, private and metadata IPs (including sneaky number formats), ports and host allow-lists.",
  description:
    "Server-Side Request Forgery (OWASP Top 10) lets an attacker make YOUR server fetch internal URLs like <code>http://169.254.169.254/</code> (cloud credentials) or <code>http://localhost:6379</code>. A guard must understand that <code>2130706433</code>, <code>0x7f000001</code> and <code>127.1</code> are all loopback.",
  task:
    "Write <code>isSafeUrl(url, { allowPrivate = false, allowedPorts = [80, 443], allowedHosts })</code> returning <code>{ safe: true }</code> or <code>{ safe: false, reason }</code>.",
  constraints: [
    "Only <code>http://</code> and <code>https://</code> (any case) are allowed; everything else (<code>file:</code>, <code>ftp:</code>, <code>gopher:</code>, <code>javascript:</code>, <code>data:</code>, scheme-relative <code>//host</code>, no scheme) is <code>'bad_scheme'</code>. Parse by hand; the authority is everything up to the first <code>/</code>, <code>?</code> or <code>#</code>.",
    "A <code>@</code> in the authority (userinfo) is <code>'credentials'</code>. Otherwise split <code>host[:port]</code> (a bracketed <code>[ipv6]</code> may contain colons); an empty host or a non-numeric port is <code>'bad_host'</code>. Lowercase the host and remove one trailing dot.",
    "A port other than the default for the scheme must be in <code>allowedPorts</code> (an explicit <code>:443</code> on http counts as 443; pass <code>null</code> to allow any), else <code>'port_not_allowed'</code>.",
    "Names <code>localhost</code>, <code>*.localhost</code>, <code>*.local</code> and <code>*.internal</code> are <code>'private_address'</code>. A host made only of numbers/hex parts separated by dots is an IPv4 address in the classic <code>inet_aton</code> forms: 1 to 4 parts, each decimal, <code>0x</code> hex or leading-<code>0</code> octal, the last part filling the remaining bytes (so <code>127.1</code>, <code>2130706433</code>, <code>0x7f000001</code>, <code>0177.0.0.1</code> are all 127.0.0.1). An out-of-range part is <code>'bad_host'</code>.",
    "These IPv4 ranges are <code>'private_address'</code> unless <code>allowPrivate</code> is true: 0.0.0.0/8, 10/8, 100.64/10, 127/8, 169.254/16, 172.16/12, 192.0.0/24, 192.168/16, 198.18/15, and everything from 224.0.0.0 up (multicast and reserved). IPv6 literals: <code>::1</code>, <code>::</code>, <code>fc..</code>/<code>fd..</code> (unique local) and <code>fe80</code>-<code>febf</code> (link-local) are private, and <code>::ffff:a.b.c.d</code> is judged by its IPv4 part; other IPv6 addresses are allowed.",
    "If <code>allowedHosts</code> is given, a (non-IP-literal or any) host must equal an entry or match <code>*.domain</code> as a proper subdomain, else <code>'host_not_allowed'</code>. Other hostnames are accepted (DNS resolution is out of scope).",
  ],
  example: `isSafeUrl('http://169.254.169.254/latest/meta-data') // { safe: false, reason: 'private_address' }`,
  tags: ["ssrf","owasp","security","networking"],
  estimatedMins: 60,
  xp: 70,
  starterFiles: [
    {
      name: "isSafeUrl.js",
      lang: "js",
      code: `// isSafeUrl.js
function isSafeUrl(url, options = {}) {
  // your code here
}

module.exports = isSafeUrl;`,
    },
  ],
  testFile: {
    name: "isSafeUrl_test.js",
    lang: "test",
    code: `const isSafeUrl = require('./isSafeUrl');

test('public', () => {
  expect(isSafeUrl('https://example.com/a').safe).toBe(true);
});

test('metadata', () => {
  expect(isSafeUrl('http://169.254.169.254/').reason).toBe('private_address');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Parse in stages with small checks that each return a reason: scheme regex, authority extraction, credentials, host/port split, then the address checks." },
    { order: 2, cost: 5, text: "Write <code>parseIPv4(host)</code> returning the 32-bit number, <code>null</code> (not an IP) or <code>'invalid'</code>. Parts must match <code>/^(0x[0-9a-f]+|\\d+)$/i</code>; every part except the last must be 0-255, and the last must fit the remaining bytes: <code>&lt; 256 ** (5 - parts)</code>." },
    { order: 3, cost: 15, text: "Check ranges numerically: <code>(ip &gt;&gt;&gt; (32 - bits)) === (base &gt;&gt;&gt; (32 - bits))</code>, or compare against <code>[start, end]</code> pairs; remember <code>&gt;&gt;&gt;</code> keeps numbers unsigned." },
  ],
  hiddenTests: [
    { name: "ordinary_public_urls_are_safe", code: `for (const u of ['https://example.com', 'http://example.com/a/b?x=1#y', 'https://api.example.co.uk:443/path', 'HTTPS://EXAMPLE.COM', 'http://8.8.8.8/', 'https://1.1.1.1', 'http://sub.domain.example.org:80/']) {
  assert(isSafeUrl(u).safe === true, 'should be safe: ' + u + ' -> ' + JSON.stringify(isSafeUrl(u)));
}` },
    { name: "only_http_and_https", code: `for (const u of ['file:///etc/passwd', 'ftp://example.com/x', 'gopher://example.com', 'javascript:alert(1)', 'data:text/plain,hi', '//example.com/x', 'example.com/x', '', 'httpx://example.com', 'ws://example.com']) {
  assert(isSafeUrl(u).reason === 'bad_scheme', 'should be bad_scheme: ' + JSON.stringify(u) + ' -> ' + JSON.stringify(isSafeUrl(u)));
}` },
    { name: "credentials_in_the_authority", code: `assert(isSafeUrl('http://user:pass@example.com').reason === 'credentials', 'user:pass@');
assert(isSafeUrl('https://example.com@evil.com/').reason === 'credentials', 'the classic host confusion');
assert(isSafeUrl('http://example.com/a@b').safe === true, 'an @ in the PATH is harmless');` },
    { name: "bad_hosts_and_ports", code: `assert(isSafeUrl('http://').reason === 'bad_host' && isSafeUrl('http:///path').reason === 'bad_host', 'empty host');
assert(isSafeUrl('http://example.com:abc/').reason === 'bad_host', 'non-numeric port');
assert(isSafeUrl('http://example.com:/').reason === 'bad_host', 'empty port');
assert(isSafeUrl('http://999.999.999.999/').reason === 'bad_host', 'out of range IPv4 parts');
assert(isSafeUrl('http://1.2.3.4.5/').safe === true, 'five dotted parts is not an IPv4, so it is treated as a hostname');` },
    { name: "localhost_and_internal_names", code: `for (const u of ['http://localhost', 'http://LOCALHOST:80', 'http://localhost./', 'http://app.localhost', 'http://printer.local', 'http://db.internal/x']) {
  assert(isSafeUrl(u).reason === 'private_address', 'should be private: ' + u + ' -> ' + JSON.stringify(isSafeUrl(u)));
}
assert(isSafeUrl('http://localhostile.com').safe === true && isSafeUrl('http://notlocalhost.com').safe === true, 'look-alike names are ordinary hosts');` },
    { name: "private_ipv4_ranges", code: `for (const ip of ['127.0.0.1', '127.255.255.254', '10.0.0.1', '10.255.255.255', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.169.254', '169.254.0.1', '0.0.0.0', '0.1.2.3', '100.64.0.1', '100.127.255.255', '192.0.0.1', '198.18.0.1', '198.19.255.255', '224.0.0.1', '255.255.255.255']) {
  assert(isSafeUrl('http://' + ip + '/').reason === 'private_address', ip + ' must be blocked: ' + JSON.stringify(isSafeUrl('http://' + ip + '/')));
}` },
    { name: "range_edges_just_outside_are_public", code: `for (const ip of ['172.15.255.255', '172.32.0.1', '11.0.0.1', '9.255.255.255', '100.63.255.255', '100.128.0.1', '169.253.1.1', '169.255.0.1', '192.167.1.1', '192.169.0.1', '198.17.0.1', '198.20.0.1', '223.255.255.255', '126.255.255.255', '128.0.0.1']) {
  assert(isSafeUrl('http://' + ip + '/').safe === true, ip + ' is public: ' + JSON.stringify(isSafeUrl('http://' + ip + '/')));
}` },
    { name: "obfuscated_ipv4_forms_of_loopback", code: `for (const h of ['127.1', '127.0.1', '2130706433', '0x7f000001', '0x7f.0.0.1', '0177.0.0.1', '017700000001', '0x7f.1', '127.0x0.0.1', '0.0.0.0x0']) {
  assert(isSafeUrl('http://' + h + '/').reason === 'private_address', h + ' is 127.0.0.1 or 0.0.0.0 in disguise: ' + JSON.stringify(isSafeUrl('http://' + h + '/')));
}
assert(isSafeUrl('http://2852039166/').reason === 'private_address', 'decimal form of 169.254.169.254');
assert(isSafeUrl('http://0xa9fea9fe/').reason === 'private_address', 'hex form of 169.254.169.254');
assert(isSafeUrl('http://3232235777/').reason === 'private_address', 'decimal 192.168.1.1');
assert(isSafeUrl('http://134744072/').safe === true, 'decimal form of 8.8.8.8 is public');` },
    { name: "invalid_numeric_hosts", code: `assert(isSafeUrl('http://4294967296/').reason === 'bad_host', 'one past 2^32-1');
assert(isSafeUrl('http://0xzz/').safe === true, 'not a numeric host at all, so just a name');
assert(isSafeUrl('http://089.0.0.1/').reason === 'bad_host', 'invalid octal digit');
assert(isSafeUrl('http://1.2.3.256/').reason === 'bad_host', 'last part too big for 4 parts');
assert(isSafeUrl('http://1.16777216/').reason === 'bad_host', 'last part too big for 2 parts (24 bits)');
assert(isSafeUrl('http://1.65536/').safe === true, 'but 65536 fits in 24 bits (1.1.0.0)');
assert(isSafeUrl('http://256.1.1.1/').reason === 'bad_host', 'first part too big');` },
    { name: "ipv6_literals", code: `for (const h of ['[::1]', '[::]', '[fd00::1]', '[fc00::1]', '[fe80::1]', '[FE80::1]', '[febf::1]', '[::ffff:127.0.0.1]', '[::ffff:10.0.0.1]', '[::ffff:169.254.169.254]']) {
  assert(isSafeUrl('http://' + h + '/').reason === 'private_address', h + ' must be blocked: ' + JSON.stringify(isSafeUrl('http://' + h + '/')));
}
for (const h of ['[2606:4700::1111]', '[2001:4860:4860::8888]', '[::ffff:8.8.8.8]', '[fec0::1]']) {
  assert(isSafeUrl('http://' + h + '/').safe === true, h + ' is public: ' + JSON.stringify(isSafeUrl('http://' + h + '/')));
}
assert(isSafeUrl('http://[::1]:8080/').reason === 'port_not_allowed' || isSafeUrl('http://[::1]:8080/').reason === 'private_address', 'ports after ipv6 literals are parsed');` },
    { name: "ports", code: `assert(isSafeUrl('http://example.com:8080/').reason === 'port_not_allowed', 'non-default port');
assert(isSafeUrl('https://example.com:443/').safe === true && isSafeUrl('http://example.com:80/').safe === true, 'defaults');
assert(isSafeUrl('http://example.com:443/').safe === true && isSafeUrl('https://example.com:80/').safe === true, 'either listed port is fine for either scheme');
assert(isSafeUrl('http://example.com:8080/', { allowedPorts: [8080] }).safe === true, 'custom allow-list');
assert(isSafeUrl('http://example.com:6379/', { allowedPorts: null }).safe === true, 'null allows any');
assert(isSafeUrl('http://example.com:22/').reason === 'port_not_allowed', 'ssh');` },
    { name: "allow_private_for_development", code: `assert(isSafeUrl('http://localhost/', { allowPrivate: true }).safe === true, 'localhost allowed');
assert(isSafeUrl('http://127.0.0.1/', { allowPrivate: true }).safe === true && isSafeUrl('http://10.0.0.5/', { allowPrivate: true }).safe === true, 'private IPs allowed');
assert(isSafeUrl('http://[::1]/', { allowPrivate: true }).safe === true, 'ipv6 loopback allowed');
assert(isSafeUrl('file:///etc/passwd', { allowPrivate: true }).reason === 'bad_scheme', 'but never other schemes');
assert(isSafeUrl('http://user@localhost/', { allowPrivate: true }).reason === 'credentials', 'nor credentials');` },
    { name: "host_allow_list", code: `const o = { allowedHosts: ['api.example.com', '*.partner.io'] };
assert(isSafeUrl('https://api.example.com/x', o).safe === true, 'exact');
assert(isSafeUrl('https://API.example.com/x', o).safe === true, 'case-insensitive');
assert(isSafeUrl('https://a.partner.io/x', o).safe === true && isSafeUrl('https://a.b.partner.io/x', o).safe === true, 'subdomains');
assert(isSafeUrl('https://partner.io/x', o).reason === 'host_not_allowed', 'wildcard is not the apex');
assert(isSafeUrl('https://evilpartner.io/x', o).reason === 'host_not_allowed', 'suffix trick');
assert(isSafeUrl('https://api.example.com.evil.com/x', o).reason === 'host_not_allowed', 'prefix trick');
assert(isSafeUrl('http://127.0.0.1/', o).reason === 'private_address', 'private addresses are rejected before the allow-list');` },
    { name: "checks_are_ordered_scheme_credentials_host_port", code: `assert(isSafeUrl('ftp://user@localhost:99/').reason === 'bad_scheme', 'scheme first');
assert(isSafeUrl('http://user@localhost:99/').reason === 'credentials', 'then credentials');
assert(isSafeUrl('http://localhost:99/').reason === 'port_not_allowed' || isSafeUrl('http://localhost:99/').reason === 'private_address', 'then host and port');` },
    { name: "authority_ends_at_path_query_or_fragment", code: `assert(isSafeUrl('http://example.com?x=http://127.0.0.1').safe === true, 'host ends at ?');
assert(isSafeUrl('http://example.com#@127.0.0.1').safe === true, 'host ends at #');
assert(isSafeUrl('http://127.0.0.1#.example.com').reason === 'private_address', 'real host is the part before #');
assert(isSafeUrl('http://127.0.0.1?.example.com').reason === 'private_address', 'real host is the part before ?');` },
  ],
  solution: {
    code: `function isSafeUrl(url, { allowPrivate = false, allowedPorts = [80, 443], allowedHosts } = {}) {
  const bad = (reason) => ({ safe: false, reason });

  function parseIPv4(host) {
    const parts = host.split('.');
    if (parts.length > 4 || !parts.every((p) => /^(0x[0-9a-f]+|\\d+)$/i.test(p))) return null;
    const nums = [];
    for (const p of parts) {
      if (/^0x/i.test(p)) nums.push(parseInt(p, 16));
      else if (/^0[0-7]+$/.test(p)) nums.push(parseInt(p, 8));
      else if (/^0\\d+$/.test(p)) return 'invalid';
      else nums.push(parseInt(p, 10));
    }
    const last = nums.pop();
    if (nums.some((n) => n > 255) || last >= 256 ** (4 - nums.length)) return 'invalid';
    let value = last;
    nums.forEach((n, i) => {
      value += n * 256 ** (3 - i);
    });
    return value;
  }

  function privateIPv4(ip) {
    const ranges = [
      [0x00000000, 0x00ffffff],
      [0x0a000000, 0x0affffff],
      [0x64400000, 0x647fffff],
      [0x7f000000, 0x7fffffff],
      [0xa9fe0000, 0xa9feffff],
      [0xac100000, 0xac1fffff],
      [0xc0000000, 0xc00000ff],
      [0xc0a80000, 0xc0a8ffff],
      [0xc6120000, 0xc613ffff],
      [0xe0000000, 0xffffffff],
    ];
    return ranges.some(([lo, hi]) => ip >= lo && ip <= hi);
  }

  const match = /^(https?):\\/\\/([^/?#]*)/i.exec(url);
  if (!match) return bad('bad_scheme');
  const scheme = match[1].toLowerCase();
  const authority = match[2];
  if (authority.includes('@')) return bad('credentials');

  let host;
  let portText = '';
  if (authority.startsWith('[')) {
    const end = authority.indexOf(']');
    if (end === -1) return bad('bad_host');
    host = authority.slice(0, end + 1);
    const rest = authority.slice(end + 1);
    if (rest !== '') {
      if (rest[0] !== ':') return bad('bad_host');
      portText = rest.slice(1);
      if (!/^\\d+$/.test(portText)) return bad('bad_host');
    }
  } else {
    const colon = authority.lastIndexOf(':');
    host = colon === -1 ? authority : authority.slice(0, colon);
    if (colon !== -1) {
      portText = authority.slice(colon + 1);
      if (!/^\\d+$/.test(portText)) return bad('bad_host');
    }
  }
  host = host.toLowerCase().replace(/\\.$/, '');
  if (host === '') return bad('bad_host');

  const port = portText === '' ? (scheme === 'https' ? 443 : 80) : Number(portText);
  const isDefault = portText === '' || port === (scheme === 'https' ? 443 : 80);

  let isPrivate = false;
  if (host.startsWith('[')) {
    const inner = host.slice(1, -1);
    const mapped = /^::ffff:(.+)$/.exec(inner);
    if (mapped) {
      const v4 = parseIPv4(mapped[1]);
      if (v4 === 'invalid') return bad('bad_host');
      isPrivate = typeof v4 === 'number' ? privateIPv4(v4) : false;
    } else {
      isPrivate = inner === '::1' || inner === '::' || /^f[cd]/.test(inner) || /^fe[89ab]/.test(inner);
    }
  } else if (host === 'localhost' || /\\.(localhost|local|internal)$/.test(host)) {
    isPrivate = true;
  } else {
    const ip = parseIPv4(host);
    if (ip === 'invalid') return bad('bad_host');
    if (ip !== null) isPrivate = privateIPv4(ip);
  }

  if (isPrivate && !allowPrivate) return bad('private_address');
  if (!isDefault && allowedPorts !== null && !allowedPorts.includes(port)) return bad('port_not_allowed');
  if (allowedHosts) {
    const ok = allowedHosts.some((entry) => {
      const e = entry.toLowerCase();
      return e.startsWith('*.') ? host.endsWith(e.slice(1)) && host.length > e.length - 1 : host === e;
    });
    if (!ok) return bad('host_not_allowed');
  }
  return { safe: true };
}

module.exports = isSafeUrl;`,
    explanation:
      "SSRF filters fail when they only compare strings: the same address has many spellings. Converting any numeric host to one 32-bit number first means every spelling is judged by the same range check. The private-address test runs before the allow-list so a mistaken allow-list entry can't open an internal address.",
  },
};
