export default {
  slug: "dockerfile-lint",
  trackId: "node-dev",
  layerId: "node-dev-10",
  type: "CODE",
  difficulty: "med",
  title: "Lint a Dockerfile",
  summary: "Parse instructions (with line continuations and stages) and flag common problems: root user, latest tags, secrets, ADD, cache-busting COPY, npm install and apt leftovers.",
  description:
    "A Dockerfile is easy to get working and easy to get subtly wrong: a container running as root, a base image that changes under you, <code>COPY . .</code> before <code>npm ci</code> so every code change reinstalls all dependencies, or a secret baked into a layer forever. Linters like hadolint catch these.",
  task:
    "Write <code>lintDockerfile(text)</code> returning an array of <code>{ rule, line, severity, message }</code> sorted by line then rule.",
  constraints: [
    "Parse instructions: skip blank and <code>#</code> comment lines; a line ending with <code>\\</code> continues onto the next line (the instruction's <code>line</code> is its FIRST line, numbered from 1). The command is the first word (case-insensitive). Stages start at each <code>FROM</code>. If there is no <code>FROM</code> the only finding is <code>{ rule: 'no-from', line: 1, severity: 'error', message }</code>.",
    "<code>unpinned-base-image</code> (warning, at the FROM): the image (ignoring <code>--flags</code> and <code>AS alias</code>) has no tag, or the tag is <code>latest</code>. Not flagged: <code>scratch</code>, images containing <code>$</code> (build args), digests (<code>@sha256:</code>), and references to an earlier stage alias. The registry port in <code>host:5000/img</code> is not a tag: look only at the last path segment.",
    "<code>run-as-root</code> (error): checking the FINAL stage only, no <code>USER</code> instruction (reported at that stage's FROM line) or the last USER is <code>root</code>/<code>0</code> (optionally <code>:group</code>), reported at that USER line. <code>no-healthcheck</code> (info, at the final FROM): no <code>HEALTHCHECK</code> in the final stage (<code>HEALTHCHECK NONE</code> counts as none).",
    "<code>prefer-copy</code> (warning): <code>ADD</code> with a source that is neither an <code>http(s)://</code> URL nor an archive (<code>.tar .tar.gz .tgz .tar.bz2 .tar.xz</code>); ignore flags like <code>--chown</code>; exec-form arrays are tokenized the same way. <code>secret-in-image</code> (error): an <code>ENV</code> or <code>ARG</code> whose key contains PASSWORD, PASSWD, SECRET, TOKEN, API_KEY/APIKEY or PRIVATE_KEY (any case) and which is assigned a non-empty value (<code>KEY=value</code>, quoted values count, or <code>ENV KEY value</code>); <code>ARG KEY</code> with no value is fine.",
    "In <code>RUN</code> commands (split into segments on <code>&amp;&amp;</code>, <code>;</code>, <code>||</code>): <code>npm-ci</code> (warning) for a segment that is just <code>npm install</code> or <code>npm i</code> optionally with <code>-</code>flags and no package names; <code>apt-cache</code> (warning) when <code>apt-get install</code> appears but the same RUN has no <code>rm -rf /var/lib/apt/lists</code>; <code>apt-recommends</code> (warning) when it lacks <code>--no-install-recommends</code>.",
    "<code>copy-before-install</code> (warning, at the COPY line, once per stage): a <code>COPY</code> (without <code>--from</code>) whose sources include <code>.</code> or <code>./</code> that comes before the first dependency install in the same stage (<code>npm ci/install/i</code>, <code>yarn</code> or <code>yarn install</code>, <code>pnpm install/i</code>, <code>pip/pip3 install</code>).",
  ],
  example: `lintDockerfile('FROM node\\nCOPY . .\\nRUN npm install\\n') // unpinned-base-image, copy-before-install, npm-ci, run-as-root, no-healthcheck`,
  tags: ["docker","devops","security","linting"],
  estimatedMins: 50,
  xp: 45,
  starterFiles: [
    {
      name: "lintDockerfile.js",
      lang: "js",
      code: `// lintDockerfile.js
function lintDockerfile(text) {
  // your code here
}

module.exports = lintDockerfile;`,
    },
  ],
  testFile: {
    name: "lintDockerfile_test.js",
    lang: "test",
    code: `const lintDockerfile = require('./lintDockerfile');

test('latest', () => {
  const r = lintDockerfile('FROM node:latest\\nUSER node\\nHEALTHCHECK CMD true\\n'); expect(r.length).toBe(1); expect(r[0].rule).toBe('unpinned-base-image');
});

test('clean', () => {
  expect(lintDockerfile('FROM node:20-alpine\\nUSER node\\nHEALTHCHECK CMD true\\n')).toEqual([]);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "First turn the text into a list of <code>{ cmd, args, line }</code> instructions, joining continuation lines, then group them into stages at each <code>FROM</code>." },
    { order: 2, cost: 5, text: "Most rules are small checks on one instruction; the two stage-level rules (<code>run-as-root</code>, <code>no-healthcheck</code>) look at the LAST stage's instruction list." },
    { order: 3, cost: 15, text: "For RUN rules split the command into segments on <code>/&amp;&amp;|;|\\|\\|/</code> and look at the first tokens of each segment." },
  ],
  hiddenTests: [
    { name: "clean_dockerfile_has_no_findings", code: `const df = 'FROM node:20-alpine AS build\\nWORKDIR /app\\nCOPY package*.json ./\\nRUN npm ci\\nCOPY . .\\nRUN npm run build\\n\\nFROM node:20-alpine\\nWORKDIR /app\\nCOPY --from=build /app/dist ./dist\\nUSER node\\nHEALTHCHECK CMD node healthcheck.js\\nCMD ["node", "dist/index.js"]\\n';
assert(lintDockerfile(df).length === 0, JSON.stringify(lintDockerfile(df)));` },
    { name: "no_from", code: `for (const t of ['', '# just a comment\\n', 'RUN echo hi\\n']) {
  const r = lintDockerfile(t);
  assert(r.length === 1 && r[0].rule === 'no-from' && r[0].line === 1 && r[0].severity === 'error', JSON.stringify(t) + ' -> ' + JSON.stringify(r));
}` },
    { name: "finding_shape_and_sorting", code: `const r = lintDockerfile('FROM node\\nCOPY . .\\nRUN npm install\\n');
assert(r.every((f) => typeof f.rule === 'string' && Number.isInteger(f.line) && ['error', 'warning', 'info'].includes(f.severity) && typeof f.message === 'string' && f.message.length > 0), 'shape: ' + JSON.stringify(r));
const keys = r.map((f) => f.line + ':' + f.rule);
const sorted = [...keys].sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || (a < b ? -1 : 1));
assert(keys.join() === sorted.join(), 'sorted by line then rule: ' + keys);` },
    { name: "base_image_tags", code: `const flagged = (from) => lintDockerfile(from + '\\nUSER x\\nHEALTHCHECK CMD true\\n').filter((f) => f.rule === 'unpinned-base-image').length;
assert(flagged('FROM node') === 1 && flagged('FROM node:latest') === 1 && flagged('FROM ubuntu AS base') === 1, 'untagged and latest');
assert(flagged('FROM node:20') === 0 && flagged('FROM node:20.11.1-alpine3.19') === 0, 'pinned versions');
assert(flagged('FROM scratch') === 0, 'scratch is fine');
assert(flagged('FROM node@sha256:abcdef0123456789') === 0 && flagged('FROM node:20@sha256:abcdef') === 0, 'digests are pinned');
assert(flagged('FROM node:\\\${VERSION}') === 0 && flagged('FROM \\\${BASE_IMAGE}') === 0, 'build args cannot be judged');
assert(flagged('FROM --platform=linux/amd64 node:20') === 0 && flagged('FROM --platform=linux/amd64 node') === 1, 'platform flags are skipped');
assert(flagged('FROM registry.local:5000/team/app') === 1, 'a registry port is not a tag');
assert(flagged('FROM registry.local:5000/team/app:1.2') === 0 && flagged('FROM registry.local:5000/team/app:latest') === 1, 'but the real tag still counts');
const f = lintDockerfile('FROM node\\n').find((x) => x.rule === 'unpinned-base-image');
assert(f.line === 1 && f.severity === 'warning', 'line and severity');` },
    { name: "stage_aliases_are_not_flagged", code: `const df = 'FROM node:20 AS build\\nRUN echo build\\nFROM build AS test\\nRUN echo test\\nFROM node:20-slim\\nCOPY --from=build /a /b\\nUSER node\\nHEALTHCHECK CMD true\\n';
assert(lintDockerfile(df).filter((f) => f.rule === 'unpinned-base-image').length === 0, 'FROM build refers to a stage, not an image');
const lower = 'FROM node:20 as Build\\nFROM build\\nUSER x\\nHEALTHCHECK NONE\\n';
assert(lintDockerfile(lower).filter((f) => f.rule === 'unpinned-base-image').length === 0, 'alias matching is case-insensitive and AS is case-insensitive');` },
    { name: "root_user_checks_only_the_final_stage", code: `const rootless = (df) => lintDockerfile(df).filter((f) => f.rule === 'run-as-root');
assert(rootless('FROM node:20\\nRUN echo hi\\n').length === 1, 'no USER at all');
const r = rootless('FROM node:20\\nRUN echo hi\\n')[0];
assert(r.line === 1 && r.severity === 'error', 'reported at the FROM line: ' + JSON.stringify(r));
assert(rootless('FROM node:20\\nUSER node\\n').length === 0, 'USER node');
assert(rootless('FROM node:20\\nUSER 1000:1000\\n').length === 0, 'numeric user and group');
const root = rootless('FROM node:20\\nRUN a\\nUSER root\\n');
assert(root.length === 1 && root[0].line === 3, 'USER root is reported at its own line: ' + JSON.stringify(root));
assert(rootless('FROM node:20\\nUSER 0\\n').length === 1 && rootless('FROM node:20\\nUSER root:root\\n').length === 1 && rootless('FROM node:20\\nUSER 0:0\\n').length === 1, 'root spelled as 0 or with a group');
assert(rootless('FROM node:20\\nUSER root\\nRUN setup\\nUSER app\\n').length === 0, 'only the LAST user matters');
assert(rootless('FROM node:20\\nUSER app\\nRUN x\\nUSER root\\n').length === 1, 'ending as root is flagged');
assert(rootless('FROM node:20 AS build\\nRUN build\\nFROM node:20\\nUSER app\\n').length === 0, 'the build stage may run as root');
assert(rootless('FROM node:20 AS build\\nUSER app\\nFROM node:20\\nRUN x\\n').length === 1, 'a USER in an earlier stage does not count: ' + JSON.stringify(rootless('FROM node:20 AS build\\nUSER app\\nFROM node:20\\nRUN x\\n')));
assert(rootless('FROM node:20 AS build\\nFROM node:20\\nRUN x\\n')[0].line === 2, 'the final stage FROM line');` },
    { name: "healthcheck", code: `const hc = (df) => lintDockerfile(df).filter((f) => f.rule === 'no-healthcheck');
assert(hc('FROM node:20\\nUSER a\\n').length === 1, 'missing');
const f = hc('FROM node:20\\nUSER a\\n')[0];
assert(f.line === 1 && f.severity === 'info', 'info at the FROM line: ' + JSON.stringify(f));
assert(hc('FROM node:20\\nUSER a\\nHEALTHCHECK CMD curl -f http://localhost/ || exit 1\\n').length === 0, 'present');
assert(hc('FROM node:20\\nUSER a\\nHEALTHCHECK NONE\\n').length === 1, 'HEALTHCHECK NONE disables it');
assert(hc('FROM node:20 AS a\\nHEALTHCHECK CMD true\\nFROM node:20\\nUSER a\\n').length === 1, 'only the final stage counts');` },
    { name: "add_vs_copy", code: `const add = (line) => lintDockerfile('FROM node:20\\nUSER a\\nHEALTHCHECK NONE\\n' + line + '\\n').filter((f) => f.rule === 'prefer-copy');
assert(add('ADD . /app').length === 1 && add('ADD package.json /app/').length === 1 && add('ADD src dest').length === 1, 'plain files');
assert(add('ADD https://example.com/file.zip /tmp/').length === 0, 'URLs are what ADD is for');
assert(add('ADD rootfs.tar.gz /').length === 0 && add('ADD a.tgz /').length === 0 && add('ADD a.tar /').length === 0 && add('ADD a.tar.xz /').length === 0 && add('ADD a.tar.bz2 /').length === 0, 'archives are extracted');
assert(add('ADD --chown=app:app app.tar.gz /app/').length === 0 && add('ADD --chown=app:app . /app/').length === 1, 'flags are ignored');
assert(add('ADD ["config.json", "/etc/"]').length === 1, 'exec form: ' + JSON.stringify(add('ADD ["config.json", "/etc/"]')));
assert(add('COPY . /app').length === 0, 'COPY is fine');
const f = add('ADD . /app')[0];
assert(f.line === 4 && f.severity === 'warning', 'line and severity: ' + JSON.stringify(f));` },
    { name: "secrets_in_env_and_arg", code: `const sec = (line) => lintDockerfile('FROM node:20\\nUSER a\\nHEALTHCHECK NONE\\n' + line + '\\n').filter((f) => f.rule === 'secret-in-image');
assert(sec('ENV DB_PASSWORD=hunter2').length === 1 && sec('ENV API_KEY=abc').length === 1 && sec('ENV APIKEY=abc').length === 1, 'assigned secrets');
assert(sec('ENV GITHUB_TOKEN abc123').length === 1, 'space-separated form');
assert(sec('ARG NPM_TOKEN=abc').length === 1 && sec('ENV client_secret="x y"').length === 1 && sec('ENV PRIVATE_KEY=-----BEGIN').length === 1 && sec('ENV db_passwd=x').length === 1, 'ARG, quotes, any case, PRIVATE_KEY, PASSWD');
assert(sec('ARG NPM_TOKEN').length === 0, 'an ARG without a value is the correct way to receive a secret at build time');
assert(sec('ENV DB_PASSWORD=').length === 0 && sec('ENV DB_PASSWORD=""').length === 0, 'empty values are not secrets');
assert(sec('ENV NODE_ENV=production').length === 0 && sec('ENV PORT=3000').length === 0 && sec('ENV TOKENIZER_MODE=fast').length === 1, 'ordinary variables are fine (and TOKEN anywhere in the name matches)');
assert(sec('ENV A=1 DB_PASSWORD=x B=2').length === 1, 'several pairs on one line');
const f = sec('ENV DB_PASSWORD=hunter2')[0];
assert(f.severity === 'error' && f.line === 4 && f.message.indexOf('DB_PASSWORD') !== -1, JSON.stringify(f));` },
    { name: "npm_install_vs_ci", code: `const npm = (cmd) => lintDockerfile('FROM node:20\\nUSER a\\nHEALTHCHECK NONE\\nRUN ' + cmd + '\\n').filter((f) => f.rule === 'npm-ci');
assert(npm('npm install').length === 1 && npm('npm i').length === 1 && npm('npm install --production').length === 1 && npm('npm install --omit=dev --no-audit').length === 1, 'plain installs');
assert(npm('npm ci').length === 0 && npm('npm run build').length === 0, 'ci and other scripts');
assert(npm('npm install express').length === 0 && npm('npm install -g pm2').length === 0, 'adding packages is a different thing');
assert(npm('cd app && npm install').length === 1 && npm('npm install; npm test').length === 1, 'inside command chains');
assert(npm('echo "npm install"').length === 0, 'a mention in a string is not a command');
assert(npm('npm install && npm install --global x').length === 1, 'one finding per RUN instruction');
assert(npm('["npm", "install"]').length === 1, 'exec form');` },
    { name: "apt_get_rules", code: `const apt = (cmd) => lintDockerfile('FROM debian:12\\nUSER a\\nHEALTHCHECK NONE\\nRUN ' + cmd + '\\n').map((f) => f.rule).filter((r) => r.indexOf('apt') === 0).sort().join();
assert(apt('apt-get update && apt-get install -y curl') === 'apt-cache,apt-recommends', 'both problems: ' + apt('apt-get update && apt-get install -y curl'));
assert(apt('apt-get update && apt-get install -y --no-install-recommends curl') === 'apt-cache', 'recommends fixed');
assert(apt('apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*') === '', 'fully clean');
assert(apt('apt-get install -y curl && rm -rf /var/lib/apt/lists/*') === 'apt-recommends', 'cache cleaned only');
assert(apt('apt-get update') === '' && apt('echo hello') === '', 'no install, no findings');
const two = lintDockerfile('FROM debian:12\\nUSER a\\nHEALTHCHECK NONE\\nRUN apt-get install -y a\\nRUN rm -rf /var/lib/apt/lists/*\\n').filter((f) => f.rule === 'apt-cache');
assert(two.length === 1 && two[0].line === 4, 'cleaning in a LATER RUN is too late (layers are immutable)');` },
    { name: "copy_before_install_cache_busting", code: `const cb = (df) => lintDockerfile('FROM node:20\\nUSER a\\nHEALTHCHECK NONE\\n' + df).filter((f) => f.rule === 'copy-before-install');
const bad = cb('COPY . .\\nRUN npm ci\\n');
assert(bad.length === 1 && bad[0].line === 4 && bad[0].severity === 'warning', 'reported at the COPY line: ' + JSON.stringify(bad));
assert(cb('COPY package*.json ./\\nRUN npm ci\\nCOPY . .\\n').length === 0, 'the cache-friendly order');
assert(cb('COPY . /app\\nRUN pip install -r req.txt\\n').length === 1 && cb('COPY ./ /app\\nRUN yarn\\n').length === 1 && cb('COPY . .\\nRUN pnpm install\\n').length === 1 && cb('COPY . .\\nRUN pip3 install x\\n').length === 1 && cb('COPY . .\\nRUN yarn install --frozen-lockfile\\n').length === 1, 'other package managers and spellings');
assert(cb('COPY . .\\nRUN npm run build\\n').length === 0, 'no install, nothing to cache');
assert(cb('COPY --from=build . /app\\nRUN npm ci\\n').length === 0, 'copying from another stage is unrelated');
assert(cb('COPY src/ ./src/\\nRUN npm ci\\n').length === 0, 'copying a subfolder is not the whole context');
assert(cb('COPY . .\\nCOPY . /other\\nRUN npm ci\\n').length === 1, 'reported once per stage');
assert(cb('RUN npm ci\\nCOPY . .\\n').length === 0, 'install first is fine');
const stages = lintDockerfile('FROM node:20 AS a\\nCOPY . .\\nRUN npm ci\\nFROM node:20 AS b\\nCOPY . .\\nRUN npm ci\\nUSER x\\nHEALTHCHECK NONE\\n').filter((f) => f.rule === 'copy-before-install');
assert(stages.map((f) => f.line).join() === '2,5', 'tracked per stage: ' + JSON.stringify(stages));` },
    { name: "line_continuations_comments_and_case", code: `const df = '# comment\\nfrom node\\n\\n  # indented comment\\nrun apt-get update \\\\\\n  && apt-get install -y \\\\\\n     curl\\nENV db_password=x\\n';
const r = lintDockerfile(df);
const byRule = Object.fromEntries(r.map((f) => [f.rule, f.line]));
assert(byRule['unpinned-base-image'] === 2, 'lowercase instructions work and comments do not count as lines to skip: ' + JSON.stringify(byRule));
assert(byRule['apt-cache'] === 5 && byRule['apt-recommends'] === 5, 'a continued RUN is reported at its first line: ' + JSON.stringify(byRule));
assert(byRule['secret-in-image'] === 8, 'line numbers keep counting after continuations: ' + JSON.stringify(byRule));
const crlf = lintDockerfile('FROM node\\r\\nRUN npm install\\r\\n');
assert(crlf.some((f) => f.rule === 'npm-ci' && f.line === 2), 'CRLF line endings');` },
    { name: "everything_at_once", code: `const df = 'FROM node\\nWORKDIR /app\\nCOPY . .\\nRUN npm install\\nADD data.json /app/\\nENV API_TOKEN=abc\\nRUN apt-get update && apt-get install -y git\\nCMD ["node", "index.js"]\\n';
const rules = lintDockerfile(df).map((f) => f.line + ':' + f.rule).join(' ');
assert(rules === '1:no-healthcheck 1:run-as-root 1:unpinned-base-image 3:copy-before-install 4:npm-ci 5:prefer-copy 6:secret-in-image 7:apt-cache 7:apt-recommends', 'all findings: ' + rules);` },
  ],
  solution: {
    code: `function lintDockerfile(text) {
  const findings = [];
  const add = (rule, line, severity, message) => findings.push({ rule, line, severity, message });

  const lines = text.split(/\\r?\\n/);
  const instructions = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\\s*(#.*)?$/.test(lines[i])) continue;
    const line = i + 1;
    let full = lines[i].trim();
    while (full.endsWith('\\\\') && i + 1 < lines.length) {
      full = full.slice(0, -1).trimEnd() + ' ' + lines[++i].trim();
    }
    const match = /^(\\w+)\\s*(.*)$/.exec(full);
    if (match) instructions.push({ cmd: match[1].toUpperCase(), args: match[2], line });
  }

  const stages = [];
  const aliases = new Set();
  for (const ins of instructions) {
    if (ins.cmd === 'FROM') {
      const tokens = ins.args.split(/\\s+/).filter((t) => t && !t.startsWith('--'));
      const image = tokens[0] || '';
      const alias = tokens[1] && tokens[1].toLowerCase() === 'as' ? tokens[2] : null;
      const isStageRef = aliases.has(image.toLowerCase());
      if (image && !isStageRef && image !== 'scratch' && !image.includes('$') && !image.includes('@sha256:')) {
        const name = image.slice(image.lastIndexOf('/') + 1);
        const tag = name.includes(':') ? name.split(':')[1] : null;
        if (tag === null) {
          add('unpinned-base-image', ins.line, 'warning', 'The base image has no tag and defaults to latest: pin a version');
        } else if (tag === 'latest') {
          add('unpinned-base-image', ins.line, 'warning', 'Do not use the latest tag: pin a version');
        }
      }
      if (alias) aliases.add(alias.toLowerCase());
      stages.push({ from: ins, items: [] });
    } else if (stages.length > 0) {
      stages[stages.length - 1].items.push(ins);
    }
  }

  if (stages.length === 0) {
    return [{ rule: 'no-from', line: 1, severity: 'error', message: 'The Dockerfile has no FROM instruction' }];
  }

  const words = (args) => args.replace(/[[\\],"]/g, ' ').split(/\\s+/).filter(Boolean);
  const SECRET = /(PASSWORD|PASSWD|SECRET|TOKEN|API_?KEY|PRIVATE_?KEY)/i;
  const ARCHIVE = /\\.(tar|tar\\.gz|tgz|tar\\.bz2|tar\\.xz)$/i;

  function installs(command) {
    return command.split(/&&|;|\\|\\|/).some((segment) => {
      const t = words(segment);
      if (t[0] === 'yarn') return t.length === 1 || t[1] === 'install';
      return ['npm', 'pnpm', 'pip', 'pip3'].includes(t[0]) && ['install', 'i', 'ci'].includes(t[1]);
    });
  }

  for (const stage of stages) {
    let copyAllLine = null;
    let reported = false;
    for (const ins of stage.items) {
      if (ins.cmd === 'ADD') {
        const sources = words(ins.args).filter((t) => !t.startsWith('--'));
        sources.pop();
        if (sources.some((s) => !/^https?:\\/\\//i.test(s) && !ARCHIVE.test(s))) {
          add('prefer-copy', ins.line, 'warning', 'Use COPY instead of ADD unless you need URL download or archive extraction');
        }
      } else if (ins.cmd === 'ENV' || ins.cmd === 'ARG') {
        const pairs = [];
        const re = /([A-Za-z_][A-Za-z0-9_]*)=("[^"]*"|'[^']*'|\\S*)/g;
        let m;
        while ((m = re.exec(ins.args)) !== null) pairs.push([m[1], m[2].replace(/^["']|["']$/g, '')]);
        if (pairs.length === 0 && ins.cmd === 'ENV') {
          const parts = ins.args.trim().split(/\\s+/);
          if (parts.length > 1) pairs.push([parts[0], parts.slice(1).join(' ')]);
        }
        for (const [key, value] of pairs) {
          if (SECRET.test(key) && value !== '') {
            add('secret-in-image', ins.line, 'error', 'Do not bake secrets into the image: ' + key);
          }
        }
      } else if (ins.cmd === 'COPY') {
        const parts = words(ins.args);
        const fromOtherStage = parts.some((t) => t.startsWith('--from'));
        const sources = parts.filter((t) => !t.startsWith('--'));
        sources.pop();
        if (!fromOtherStage && copyAllLine === null && sources.some((s) => s === '.' || s === './')) copyAllLine = ins.line;
      } else if (ins.cmd === 'RUN') {
        const command = ins.args;
        const segments = command.split(/&&|;|\\|\\|/).map((s) => words(s));
        if (segments.some((t) => t[0] === 'npm' && (t[1] === 'install' || t[1] === 'i') && t.slice(2).every((x) => x.startsWith('-')))) {
          add('npm-ci', ins.line, 'warning', 'Use npm ci for reproducible installs');
        }
        if (segments.some((t) => t[0] === 'apt-get' && t.includes('install'))) {
          if (!/rm\\s+-rf\\s+\\/var\\/lib\\/apt\\/lists/.test(command)) {
            add('apt-cache', ins.line, 'warning', 'Remove /var/lib/apt/lists in the same RUN to keep the layer small');
          }
          if (!command.includes('--no-install-recommends')) {
            add('apt-recommends', ins.line, 'warning', 'Use --no-install-recommends to avoid extra packages');
          }
        }
        if (copyAllLine !== null && !reported && installs(command)) {
          reported = true;
          add(
            'copy-before-install',
            copyAllLine,
            'warning',
            'COPY . . before installing dependencies invalidates the dependency cache on every change: copy the package files first',
          );
        }
      }
    }
  }

  const last = stages[stages.length - 1];
  const users = last.items.filter((i) => i.cmd === 'USER');
  if (users.length === 0) {
    add('run-as-root', last.from.line, 'error', 'There is no USER instruction, so the container runs as root');
  } else {
    const user = users[users.length - 1];
    const name = user.args.trim().split(':')[0];
    if (name === 'root' || name === '0') add('run-as-root', user.line, 'error', 'The final USER is root');
  }
  const health = last.items.filter((i) => i.cmd === 'HEALTHCHECK' && i.args.trim().toUpperCase() !== 'NONE');
  if (health.length === 0) {
    add('no-healthcheck', last.from.line, 'info', 'Add a HEALTHCHECK so the platform can detect a stuck container');
  }

  return findings.sort((a, b) => a.line - b.line || (a.rule < b.rule ? -1 : a.rule > b.rule ? 1 : 0));
}

module.exports = lintDockerfile;`,
    explanation:
      "Most of the lint is cheap text analysis on a list of parsed instructions. Two details need care: continued lines must be joined before looking at commands, and stage-level rules (user, healthcheck) apply only to the final stage because that's the image that actually ships.",
  },
};
