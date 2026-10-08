export default {
  slug: "workflow-validate",
  trackId: "node-dev",
  layerId: "node-dev-10",
  type: "CODE",
  difficulty: "med",
  title: "Validate a GitHub Actions workflow",
  summary: "Check a parsed workflow object for missing fields, bad steps, unknown or circular needs, and unsafe practices; compute the parallel job stages.",
  description:
    "A broken or careless CI workflow fails at the worst moment, or worse, quietly runs untrusted third-party code with write access. A validator catches structural mistakes (missing runs-on, circular <code>needs</code>) and risky patterns (floating action versions, secrets pasted into scripts) before you push.",
  task:
    "Write <code>validateWorkflow(workflow)</code> where <code>workflow</code> is the parsed YAML object (<code>{ name, on, permissions, jobs }</code>). Return <code>{ errors, warnings, stages }</code>; errors and warnings are arrays of <code>{ code, path, message }</code>.",
  constraints: [
    "Errors: <code>missing_on</code> (no <code>on</code> key, path <code>'on'</code>); <code>missing_jobs</code> (no jobs object or empty, path <code>'jobs'</code>, and then stop with <code>stages: []</code>). Per job (<code>path = 'jobs.&lt;id&gt;'</code>): unless the job has <code>uses</code> (reusable workflow) it needs <code>runs-on</code> (<code>missing_runs_on</code>, path <code>...runs-on</code>) and a non-empty <code>steps</code> array (<code>missing_steps</code>, path <code>...steps</code>).",
    "Per step (<code>path = '...steps[i]'</code>): exactly one of string <code>uses</code> or string <code>run</code> (<code>invalid_step</code> otherwise); a repeated step <code>id</code> within a job is <code>duplicate_step_id</code> (path <code>...steps[i].id</code>); a <code>uses</code> value that is not local (<code>./</code>) or <code>docker://</code> and has no <code>@ref</code> is <code>missing_ref</code> (error, path <code>...uses</code>).",
    "<code>needs</code> (string or array): a name that is not a job is <code>unknown_need</code> (path <code>jobs.&lt;id&gt;.needs</code>). A cycle among known needs is one <code>needs_cycle</code> error (path <code>jobs.&lt;first job of the cycle&gt;</code>, message containing <code>a -&gt; b -&gt; a</code>).",
    "Warnings: <code>missing_permissions</code> (neither a top-level <code>permissions</code> nor one on the job; path is the job); <code>no_timeout</code> (job without <code>timeout-minutes</code> and without <code>uses</code>; path <code>...timeout-minutes</code>); <code>unpinned_action</code> (ref is <code>main</code>, <code>master</code>, <code>latest</code>, <code>head</code>, <code>develop</code> or <code>dev</code>, any case); <code>mutable_tag</code> (any other ref that is not a 40-hex commit SHA, when the owner is not <code>actions</code> or <code>github</code>); <code>inline_secret</code> (a <code>run</code> script containing <code>${{ secrets.X }}</code>, path <code>...run</code>).",
    "<code>stages</code> groups jobs for parallel execution: a job's level is 0 without needs, else 1 + the highest level among its needs; <code>stages[n]</code> lists the jobs of level n in declaration order. If there are <code>unknown_need</code> or <code>needs_cycle</code> errors, <code>stages</code> is <code>[]</code>.",
  ],
  example: `validateWorkflow({ on: 'push', jobs: { test: { 'runs-on': 'ubuntu-latest', steps: [{ run: 'npm test' }] } } }).errors // []`,
  tags: ["github-actions","ci-cd","devops","security"],
  estimatedMins: 50,
  xp: 45,
  starterFiles: [
    {
      name: "validateWorkflow.js",
      lang: "js",
      code: `// validateWorkflow.js
function validateWorkflow(workflow) {
  // your code here
}

module.exports = validateWorkflow;`,
    },
  ],
  testFile: {
    name: "validateWorkflow_test.js",
    lang: "test",
    code: `const validateWorkflow = require('./validateWorkflow');

test('valid', () => {
  const w = { on: 'push', permissions: {}, jobs: { test: { 'runs-on': 'ubuntu-latest', 'timeout-minutes': 5, steps: [{ run: 'npm test' }] } } }; const r = validateWorkflow(w); expect(r.errors).toEqual([]); expect(r.stages).toEqual([['test']]);
});

test('missing_on', () => {
  expect(validateWorkflow({ jobs: {} }).errors[0].code).toBe('missing_on');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Write small helpers <code>err(code, path, message)</code> and <code>warn(...)</code> that push into the two arrays, then walk jobs and steps once." },
    { order: 2, cost: 5, text: "Check <code>uses</code> with <code>lastIndexOf('@')</code>: no <code>@</code> is a missing ref; the owner is everything before the first <code>/</code>." },
    { order: 3, cost: 15, text: "For cycles use a DFS with a <code>stack</code> array (like a module loader); for stages compute <code>level(job)</code> recursively with a memo Map, only after confirming there are no unknown needs or cycles." },
  ],
  hiddenTests: [
    { name: "a_minimal_valid_workflow", code: `const w = { name: 'CI', on: { push: { branches: ['main'] } }, permissions: { contents: 'read' }, jobs: { test: { 'runs-on': 'ubuntu-latest', 'timeout-minutes': 10, steps: [{ uses: 'actions/checkout@v4' }, { run: 'npm ci' }, { run: 'npm test' }] } } };
const r = validateWorkflow(w);
assert(r.errors.length === 0 && r.warnings.length === 0, JSON.stringify(r));
assert(JSON.stringify(r.stages) === '[["test"]]', 'stages: ' + JSON.stringify(r.stages));` },
    { name: "result_shape", code: `const r = validateWorkflow({ on: 'push', jobs: { a: {} } });
assert(Array.isArray(r.errors) && Array.isArray(r.warnings) && Array.isArray(r.stages), 'arrays');
assert(r.errors.every((e) => typeof e.code === 'string' && typeof e.path === 'string' && typeof e.message === 'string' && e.message.length > 0), 'each error has code, path, message: ' + JSON.stringify(r.errors));` },
    { name: "missing_on_and_jobs", code: `const codes = (w) => validateWorkflow(w).errors.map((e) => e.code + '@' + e.path).join();
assert(codes({ jobs: { a: { 'runs-on': 'x', steps: [{ run: 'x' }] } } }) === 'missing_on@on', 'no trigger');
assert(codes({ on: 'push' }) === 'missing_jobs@jobs', 'no jobs');
assert(codes({ on: 'push', jobs: {} }) === 'missing_jobs@jobs', 'empty jobs');
assert(codes({}) === 'missing_on@on,missing_jobs@jobs', 'both');
assert(JSON.stringify(validateWorkflow({ on: 'push' }).stages) === '[]', 'no stages without jobs');
assert(validateWorkflow(null).errors.length >= 1 && validateWorkflow('x').errors.length >= 1, 'non-objects are reported, not thrown');` },
    { name: "jobs_need_runs_on_and_steps", code: `const errs = (job) => validateWorkflow({ on: 'push', permissions: {}, jobs: { j: job } }).errors.map((e) => e.code + '@' + e.path).join();
assert(errs({}) === 'missing_runs_on@jobs.j.runs-on,missing_steps@jobs.j.steps', 'both missing: ' + errs({}));
assert(errs({ 'runs-on': 'ubuntu-latest' }) === 'missing_steps@jobs.j.steps', 'no steps');
assert(errs({ 'runs-on': 'ubuntu-latest', steps: [] }) === 'missing_steps@jobs.j.steps', 'empty steps');
assert(errs({ steps: [{ run: 'x' }] }) === 'missing_runs_on@jobs.j.runs-on', 'no runs-on');
assert(errs({ 'runs-on': 'x', steps: 'not an array' }) === 'missing_steps@jobs.j.steps', 'steps must be an array');
assert(errs({ uses: './.github/workflows/reusable.yml' }) === '', 'a reusable workflow call needs neither');` },
    { name: "step_validation", code: `const errs = (steps) => validateWorkflow({ on: 'push', permissions: {}, jobs: { j: { 'runs-on': 'x', 'timeout-minutes': 1, steps } } }).errors.map((e) => e.code + '@' + e.path).join();
assert(errs([{ run: 'a' }, { name: 'nothing' }]) === 'invalid_step@jobs.j.steps[1]', 'neither uses nor run');
assert(errs([{ uses: 'actions/checkout@v4', run: 'x' }]) === 'invalid_step@jobs.j.steps[0]', 'both');
assert(errs([{ run: 5 }]) === 'invalid_step@jobs.j.steps[0]', 'non-string run');
assert(errs([{ id: 'build', run: 'a' }, { id: 'test', run: 'b' }, { id: 'build', run: 'c' }]) === 'duplicate_step_id@jobs.j.steps[2].id', 'duplicate ids: ' + errs([{ id: 'build', run: 'a' }, { id: 'test', run: 'b' }, { id: 'build', run: 'c' }]));
assert(errs([{ run: 'a' }, { run: 'b' }]) === '', 'steps without ids can repeat anything');` },
    { name: "uses_references", code: `const check = (uses) => validateWorkflow({ on: 'push', permissions: {}, jobs: { j: { 'runs-on': 'x', 'timeout-minutes': 1, steps: [{ uses }] } } });
const e = (uses) => check(uses).errors.map((x) => x.code + '@' + x.path).join();
const w = (uses) => check(uses).warnings.map((x) => x.code + '@' + x.path).join();
assert(e('actions/checkout') === 'missing_ref@jobs.j.steps[0].uses', 'no @ref is an error: ' + e('actions/checkout'));
assert(e('./local-action') === '' && w('./local-action') === '' && e('docker://alpine:3.19') === '' && w('docker://alpine:3.19') === '', 'local and docker actions are not refs');
assert(w('actions/checkout@v4') === '' && w('github/codeql-action/init@v3') === '' && w('actions/setup-node@v4.1.0') === '', 'version tags are fine for first-party owners');
assert(w('actions/checkout@' + 'a'.repeat(40)) === '' && w('thirdparty/deploy@' + '0123456789abcdef'.repeat(2) + '01234567') === '', '40-hex SHAs are the gold standard');
assert(w('thirdparty/deploy@v1') === 'mutable_tag@jobs.j.steps[0].uses' && w('thirdparty/deploy@v1.2.3') === 'mutable_tag@jobs.j.steps[0].uses', 'third-party tags can be moved');
for (const ref of ['main', 'master', 'latest', 'HEAD', 'Develop', 'dev']) {
  assert(w('actions/checkout@' + ref) === 'unpinned_action@jobs.j.steps[0].uses', ref + ' floats: ' + w('actions/checkout@' + ref));
  assert(w('thirdparty/x@' + ref) === 'unpinned_action@jobs.j.steps[0].uses', 'unpinned wins over mutable_tag for ' + ref);
}
assert(w('thirdparty/x@abc123') === 'mutable_tag@jobs.j.steps[0].uses', 'a short sha-like ref is not a full SHA');` },
    { name: "needs_unknown_jobs", code: `const w = { on: 'push', permissions: {}, jobs: {
  build: { 'runs-on': 'x', 'timeout-minutes': 1, steps: [{ run: 'a' }] },
  deploy: { 'runs-on': 'x', 'timeout-minutes': 1, needs: ['build', 'tset'], steps: [{ run: 'b' }] },
  lint: { 'runs-on': 'x', 'timeout-minutes': 1, needs: 'missing', steps: [{ run: 'c' }] },
} };
const r = validateWorkflow(w);
assert(r.errors.map((e) => e.code + '@' + e.path).join() === 'unknown_need@jobs.deploy.needs,unknown_need@jobs.lint.needs', JSON.stringify(r.errors));
assert(r.errors[0].message.indexOf('tset') !== -1, 'the message names the missing job: ' + r.errors[0].message);
assert(JSON.stringify(r.stages) === '[]', 'no stages when needs are broken');` },
    { name: "needs_cycles", code: `const job = (needs) => ({ 'runs-on': 'x', 'timeout-minutes': 1, needs, steps: [{ run: 'x' }] });
const cyc = (jobs) => validateWorkflow({ on: 'push', permissions: {}, jobs }).errors.filter((e) => e.code === 'needs_cycle');
const two = cyc({ a: job('b'), b: job('a') });
assert(two.length === 1 && two[0].path === 'jobs.a' && two[0].message.indexOf('a -> b -> a') !== -1, JSON.stringify(two));
const self = cyc({ a: job('a') });
assert(self.length === 1 && self[0].message.indexOf('a -> a') !== -1, 'self dependency: ' + JSON.stringify(self));
const three = cyc({ x: job([]), a: job('b'), b: job('c'), c: job('a') });
assert(three.length === 1 && three[0].message.indexOf('a -> b -> c -> a') !== -1 && three[0].path === 'jobs.a', 'only the cycle is reported: ' + JSON.stringify(three));
assert(cyc({ a: job([]), b: job('a'), c: job(['a', 'b']) }).length === 0, 'a diamond is not a cycle');
assert(JSON.stringify(validateWorkflow({ on: 'push', permissions: {}, jobs: { a: job('b'), b: job('a') } }).stages) === '[]', 'no stages with a cycle');` },
    { name: "stages_group_parallel_jobs_by_depth", code: `const job = (needs) => ({ 'runs-on': 'x', 'timeout-minutes': 1, ...(needs ? { needs } : {}), steps: [{ run: 'x' }] });
const r = validateWorkflow({ on: 'push', permissions: {}, jobs: {
  lint: job(), test: job(), build: job(['lint', 'test']), e2e: job('build'), docs: job(), deploy: job(['build', 'e2e']), notify: job('docs'),
} });
assert(r.errors.length === 0, JSON.stringify(r.errors));
assert(JSON.stringify(r.stages) === '[["lint","test","docs"],["build","notify"],["e2e"],["deploy"]]', 'stages: ' + JSON.stringify(r.stages));
const single = validateWorkflow({ on: 'push', permissions: {}, jobs: { only: job() } });
assert(JSON.stringify(single.stages) === '[["only"]]', 'one job, one stage');` },
    { name: "permissions_and_timeouts", code: `const base = (job, top) => validateWorkflow({ on: 'push', ...(top ? { permissions: top } : {}), jobs: { j: { 'runs-on': 'x', steps: [{ run: 'x' }], ...job } } }).warnings.map((w) => w.code + '@' + w.path).join();
assert(base({}) === 'missing_permissions@jobs.j,no_timeout@jobs.j.timeout-minutes', 'both warnings: ' + base({}));
assert(base({ 'timeout-minutes': 5 }, { contents: 'read' }) === '', 'top-level permissions cover every job');
assert(base({ 'timeout-minutes': 5, permissions: { contents: 'read' } }) === '', 'job-level permissions work too');
assert(base({ 'timeout-minutes': 5, permissions: {} }) === '', 'an empty permissions object is a deliberate choice (no permissions)');
assert(base({ 'timeout-minutes': 5 }, {}) === '', 'top-level empty permissions object too');
assert(validateWorkflow({ on: 'push', permissions: {}, jobs: { c: { uses: './.github/workflows/x.yml' } } }).warnings.length === 0, 'reusable workflow calls need no timeout');` },
    { name: "inline_secrets", code: `const warn = (run) => validateWorkflow({ on: 'push', permissions: {}, jobs: { j: { 'runs-on': 'x', 'timeout-minutes': 1, steps: [{ run }] } } }).warnings.map((w) => w.code + '@' + w.path).join();
assert(warn('curl -H "Authorization: \\\${{ secrets.TOKEN }}" https://x') === 'inline_secret@jobs.j.steps[0].run', 'inlined: ' + warn('curl -H "Authorization: \\\${{ secrets.TOKEN }}" https://x'));
assert(warn('echo \\\${{secrets.A}}') === 'inline_secret@jobs.j.steps[0].run' && warn('echo \\\${{   secrets.A   }}') === 'inline_secret@jobs.j.steps[0].run', 'spacing variations');
assert(warn('echo "$TOKEN"') === '' && warn('npm test') === '', 'normal scripts');
assert(warn('echo \\\${{ github.sha }}') === '' && warn('echo \\\${{ vars.NAME }}') === '', 'other contexts are fine');
const viaEnv = validateWorkflow({ on: 'push', permissions: {}, jobs: { j: { 'runs-on': 'x', 'timeout-minutes': 1, steps: [{ run: 'deploy.sh', env: { TOKEN: '\\\${{ secrets.TOKEN }}' } }] } } });
assert(viaEnv.warnings.length === 0, 'passing a secret through env is the recommended pattern');` },
    { name: "multiple_problems_are_all_reported", code: `const w = { jobs: { build: { steps: [{ uses: 'thirdparty/x@main' }, { run: 'echo \\\${{ secrets.K }}' }, {}] } } };
const r = validateWorkflow(w);
const errs = r.errors.map((e) => e.code + '@' + e.path).sort().join();
assert(errs === 'invalid_step@jobs.build.steps[2],missing_on@on,missing_runs_on@jobs.build.runs-on', 'errors: ' + errs);
const warns = r.warnings.map((e) => e.code + '@' + e.path).sort().join();
assert(warns === 'inline_secret@jobs.build.steps[1].run,missing_permissions@jobs.build,no_timeout@jobs.build.timeout-minutes,unpinned_action@jobs.build.steps[0].uses', 'warnings: ' + warns);` },
    { name: "input_is_not_mutated", code: `const w = { on: 'push', jobs: { a: { 'runs-on': 'x', needs: 'b', steps: [{ run: 'x' }] }, b: { 'runs-on': 'x', steps: [{ run: 'y' }] } } };
const snapshot = JSON.stringify(w);
validateWorkflow(w);
assert(JSON.stringify(w) === snapshot, 'unchanged');` },
  ],
  solution: {
    code: `function validateWorkflow(workflow) {
  const errors = [];
  const warnings = [];
  const err = (code, path, message) => errors.push({ code, path, message });
  const warn = (code, path, message) => warnings.push({ code, path, message });

  if (workflow === null || typeof workflow !== 'object' || Array.isArray(workflow)) {
    err('invalid_workflow', '', 'A workflow must be an object');
    return { errors, warnings, stages: [] };
  }

  if (!('on' in workflow)) err('missing_on', 'on', 'The workflow has no trigger (on)');
  const jobs = workflow.jobs;
  if (jobs === null || typeof jobs !== 'object' || Object.keys(jobs).length === 0) {
    err('missing_jobs', 'jobs', 'The workflow has no jobs');
    return { errors, warnings, stages: [] };
  }

  const topLevelPermissions = 'permissions' in workflow;
  const FLOATING = ['main', 'master', 'latest', 'head', 'develop', 'dev'];
  const needsOf = (job) => (job && job.needs !== undefined ? [].concat(job.needs) : []);
  let needsBroken = false;

  function checkUses(uses, path) {
    if (uses.startsWith('./') || uses.startsWith('docker://')) return;
    const at = uses.lastIndexOf('@');
    if (at === -1) {
      err('missing_ref', path, "'" + uses + "' has no @ref");
      return;
    }
    const ref = uses.slice(at + 1);
    const owner = uses.split('/')[0];
    if (/^[0-9a-f]{40}$/.test(ref)) return;
    if (FLOATING.includes(ref.toLowerCase())) {
      warn('unpinned_action', path, "'" + uses + "' follows a moving branch: pin a version tag or commit SHA");
    } else if (owner !== 'actions' && owner !== 'github') {
      warn('mutable_tag', path, "'" + uses + "' is a tag the owner can move: pin third-party actions to a commit SHA");
    }
  }

  for (const [id, job] of Object.entries(jobs)) {
    const path = 'jobs.' + id;
    const isCall = job && typeof job.uses === 'string';
    if (!isCall) {
      if (!job || !job['runs-on']) err('missing_runs_on', path + '.runs-on', "Job '" + id + "' has no runs-on");
      if (!job || !Array.isArray(job.steps) || job.steps.length === 0) {
        err('missing_steps', path + '.steps', "Job '" + id + "' has no steps");
      }
    }
    if (!topLevelPermissions && !(job && 'permissions' in job)) {
      warn('missing_permissions', path, "Job '" + id + "' has no permissions: set least-privilege permissions");
    }
    if (!isCall && !(job && job['timeout-minutes'] !== undefined)) {
      warn('no_timeout', path + '.timeout-minutes', "Job '" + id + "' has no timeout (the default is 6 hours)");
    }
    for (const needed of needsOf(job)) {
      if (!(needed in jobs)) {
        needsBroken = true;
        err('unknown_need', path + '.needs', "Job '" + id + "' needs unknown job '" + needed + "'");
      }
    }
    if (job && Array.isArray(job.steps)) {
      const seen = new Set();
      job.steps.forEach((step, i) => {
        const stepPath = path + '.steps[' + i + ']';
        const hasUses = step && typeof step.uses === 'string';
        const hasRun = step && typeof step.run === 'string';
        if (hasUses === hasRun) err('invalid_step', stepPath, 'A step needs exactly one of uses or run');
        if (step && step.id !== undefined) {
          if (seen.has(step.id)) err('duplicate_step_id', stepPath + '.id', "Step id '" + step.id + "' is used twice");
          seen.add(step.id);
        }
        if (hasUses) checkUses(step.uses, stepPath + '.uses');
        if (hasRun && /\\$\\{\\{\\s*secrets\\./.test(step.run)) {
          warn('inline_secret', stepPath + '.run', 'Pass secrets through env instead of inlining them in the script');
        }
      });
    }
  }

  const state = new Map();
  let cycleFound = false;
  function visit(id, stack) {
    if (cycleFound) return;
    if (state.get(id) === 'done') return;
    if (stack.includes(id)) {
      cycleFound = true;
      needsBroken = true;
      const cycle = [...stack.slice(stack.indexOf(id)), id];
      err('needs_cycle', 'jobs.' + cycle[0], 'Circular needs: ' + cycle.join(' -> '));
      return;
    }
    for (const needed of needsOf(jobs[id])) {
      if (needed in jobs) visit(needed, [...stack, id]);
    }
    state.set(id, 'done');
  }
  for (const id of Object.keys(jobs)) visit(id, []);

  if (needsBroken) return { errors, warnings, stages: [] };

  const levels = new Map();
  const levelOf = (id) => {
    if (levels.has(id)) return levels.get(id);
    const needed = needsOf(jobs[id]);
    const level = needed.length === 0 ? 0 : 1 + Math.max(...needed.map(levelOf));
    levels.set(id, level);
    return level;
  };
  const stages = [];
  for (const id of Object.keys(jobs)) {
    const level = levelOf(id);
    if (!stages[level]) stages[level] = [];
    stages[level].push(id);
  }
  return { errors, warnings, stages };
}

module.exports = validateWorkflow;`,
    explanation:
      "Most checks are independent rules over a parsed object, collected into two lists so one run reports every problem. Cycle detection and stage computation both walk the needs graph: the DFS stack gives the printable cycle, and a memoized 'longest path from a root' gives each job's level and therefore which jobs can run in parallel.",
  },
};
