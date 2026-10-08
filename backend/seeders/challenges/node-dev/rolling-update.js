export default {
  slug: "rolling-update",
  trackId: "node-dev",
  layerId: "node-dev-10",
  type: "CODE",
  difficulty: "med",
  title: "Plan a rolling deployment",
  summary: "Simulate a Kubernetes-style rolling update with maxSurge and maxUnavailable, and verify that capacity and availability limits hold.",
  description:
    "A rolling deployment replaces old instances with new ones gradually, so users never see downtime. Two knobs control the pace: <code>maxSurge</code> (how many EXTRA instances may exist) and <code>maxUnavailable</code> (how many may be missing). Understanding them explains why a deploy with <code>maxUnavailable: 0</code> is slow but safe, and why it needs spare capacity.",
  task:
    "Write <code>rollingUpdateSteps(replicas, { maxSurge = 1, maxUnavailable = 0 })</code> returning <code>{ steps, peakTotal, minAvailable }</code>. Each step is <code>{ old, new }</code>: the number of old instances left and ready new instances after that step.",
  constraints: [
    "<code>replicas</code> must be a positive integer (<code>RangeError('replicas must be a positive integer')</code>). <code>maxSurge</code>/<code>maxUnavailable</code> are non-negative integers or percentage strings like <code>'25%'</code> (anything else throws <code>RangeError('Invalid maxSurge')</code> / <code>RangeError('Invalid maxUnavailable')</code>). A percentage of <code>replicas</code> rounds UP for <code>maxSurge</code> and DOWN for <code>maxUnavailable</code>.",
    "If both resolve to 0: when either was given as a percentage use <code>maxUnavailable = 1</code> (so the rollout can progress), otherwise throw <code>Error('maxSurge and maxUnavailable cannot both be 0')</code>.",
    "Start with <code>old = replicas</code> and <code>ready = 0</code> new instances. Each step: <b>add</b> <code>max(0, min(replicas - ready, replicas + maxSurge - (old + ready)))</code> new instances (they become ready at the END of the step); <b>kill</b> <code>max(0, min(old, old + ready - (replicas - maxUnavailable)))</code> old instances (computed with <code>ready</code> BEFORE this step's new instances become ready); then <code>ready += add</code> and record <code>{ old, new: ready }</code>. Stop once <code>old === 0</code> and <code>ready === replicas</code>.",
    "<code>peakTotal</code> is the largest <code>old + ready + add</code> seen (before the kills of that step), starting from <code>replicas</code>; <code>minAvailable</code> is the smallest <code>old + ready</code> after the kills (with the previous <code>ready</code>), starting from <code>replicas</code>. Both limits must hold: <code>peakTotal &lt;= replicas + maxSurge</code> and <code>minAvailable &gt;= replicas - maxUnavailable</code>. If the rollout does not finish within <code>replicas * 4 + 10</code> steps throw <code>Error('Rollout cannot make progress')</code>.",
  ],
  example: `rollingUpdateSteps(3, { maxSurge: 1, maxUnavailable: 0 }).steps // [{old:3,new:1},{old:2,new:1},{old:2,new:2},{old:1,new:2},{old:1,new:3},{old:0,new:3}]`,
  tags: ["kubernetes","deployment","rolling-update","devops"],
  estimatedMins: 35,
  xp: 45,
  starterFiles: [
    {
      name: "rollingUpdateSteps.js",
      lang: "js",
      code: `// rollingUpdateSteps.js
function rollingUpdateSteps(replicas, options = {}) {
  // your code here
}

module.exports = rollingUpdateSteps;`,
    },
  ],
  testFile: {
    name: "rollingUpdateSteps_test.js",
    lang: "test",
    code: `const rollingUpdateSteps = require('./rollingUpdateSteps');

test('three_replicas', () => {
  const r = rollingUpdateSteps(3, { maxSurge: 1, maxUnavailable: 0 }); expect(r.steps[r.steps.length - 1]).toEqual({ old: 0, new: 3 }); expect(r.peakTotal).toBe(4);
});

test('both_zero', () => {
  expect(() => rollingUpdateSteps(3, { maxSurge: 0, maxUnavailable: 0 })).toThrow();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Resolve the two settings first (numbers or percentages with <code>Math.ceil</code> / <code>Math.floor</code>), then run a loop that applies the add and kill formulas exactly as given." },
    { order: 2, cost: 5, text: "Compute <code>add</code> and <code>kill</code> BEFORE changing <code>old</code> and <code>ready</code>: the kill formula uses the ready count from before this step's additions." },
    { order: 3, cost: 15, text: "Track <code>peakTotal</code> right after computing <code>add</code> (<code>old + ready + add</code>) and <code>minAvailable</code> right after applying the kill." },
  ],
  hiddenTests: [
    { name: "classic_surge_one_unavailable_zero", code: `const r = rollingUpdateSteps(3, { maxSurge: 1, maxUnavailable: 0 });
assert(JSON.stringify(r.steps) === '[{"old":3,"new":1},{"old":2,"new":1},{"old":2,"new":2},{"old":1,"new":2},{"old":1,"new":3},{"old":0,"new":3}]', JSON.stringify(r.steps));
assert(r.peakTotal === 4 && r.minAvailable === 3, 'one extra instance, never below full capacity: ' + JSON.stringify([r.peakTotal, r.minAvailable]));` },
    { name: "defaults_are_surge_one_unavailable_zero", code: `const a = rollingUpdateSteps(3);
const b = rollingUpdateSteps(3, { maxSurge: 1, maxUnavailable: 0 });
assert(JSON.stringify(a) === JSON.stringify(b), 'defaults');` },
    { name: "no_surge_one_unavailable", code: `const r = rollingUpdateSteps(3, { maxSurge: 0, maxUnavailable: 1 });
assert(JSON.stringify(r.steps) === '[{"old":2,"new":0},{"old":2,"new":1},{"old":1,"new":1},{"old":1,"new":2},{"old":0,"new":2},{"old":0,"new":3}]', JSON.stringify(r.steps));
assert(r.peakTotal === 3 && r.minAvailable === 2, 'no extra instances, one missing at a time: ' + JSON.stringify([r.peakTotal, r.minAvailable]));` },
    { name: "single_replica", code: `const r = rollingUpdateSteps(1, { maxSurge: 1, maxUnavailable: 0 });
assert(JSON.stringify(r.steps) === '[{"old":1,"new":1},{"old":0,"new":1}]', JSON.stringify(r.steps));
assert(r.peakTotal === 2 && r.minAvailable === 1, 'zero downtime needs a second instance for a moment');
const down = rollingUpdateSteps(1, { maxSurge: 0, maxUnavailable: 1 });
assert(JSON.stringify(down.steps) === '[{"old":0,"new":0},{"old":0,"new":1}]', 'without surge a single replica has downtime: ' + JSON.stringify(down.steps));
assert(down.minAvailable === 0, 'availability dips to zero');` },
    { name: "percentages_round_surge_up_and_unavailable_down", code: `const r = rollingUpdateSteps(4, { maxSurge: '25%', maxUnavailable: '25%' });
assert(JSON.stringify(r.steps) === '[{"old":3,"new":1},{"old":2,"new":2},{"old":1,"new":3},{"old":0,"new":4}]', JSON.stringify(r.steps));
assert(r.peakTotal === 5 && r.minAvailable === 3, JSON.stringify([r.peakTotal, r.minAvailable]));
const hundred = rollingUpdateSteps(100, { maxSurge: '25%', maxUnavailable: '25%' });
assert(JSON.stringify(hundred.steps) === '[{"old":75,"new":25},{"old":50,"new":50},{"old":25,"new":75},{"old":0,"new":100}]', JSON.stringify(hundred.steps));
assert(hundred.peakTotal === 125 && hundred.minAvailable === 75, 'limits: ' + JSON.stringify([hundred.peakTotal, hundred.minAvailable]));
const rounding = rollingUpdateSteps(10, { maxSurge: '25%', maxUnavailable: '25%' });
assert(rounding.peakTotal <= 10 + 3 && rounding.minAvailable >= 10 - 2, '25% of 10 is 2.5: surge rounds up to 3, unavailable rounds down to 2: ' + JSON.stringify([rounding.peakTotal, rounding.minAvailable]));` },
    { name: "percent_that_rounds_to_zero_gets_one_unavailable", code: `const r = rollingUpdateSteps(3, { maxSurge: 0, maxUnavailable: '10%' });
assert(r.steps[r.steps.length - 1].old === 0, 'it finishes');
assert(r.minAvailable === 2, 'maxUnavailable became 1 (10% of 3 rounds down to 0): ' + r.minAvailable);
const s = rollingUpdateSteps(3, { maxSurge: '10%', maxUnavailable: 0 });
assert(s.peakTotal === 4, '10% of 3 rounds UP to 1 surge, which is enough: ' + s.peakTotal);
const both = rollingUpdateSteps(2, { maxSurge: '0%', maxUnavailable: '0%' });
assert(both.minAvailable === 1, 'both percentages at zero: unavailable is forced to 1');` },
    { name: "both_zero_numbers_throw", code: `let msg = null;
try { rollingUpdateSteps(5, { maxSurge: 0, maxUnavailable: 0 }); } catch (e) { msg = e.message; }
assert(msg === 'maxSurge and maxUnavailable cannot both be 0', 'message: ' + msg);` },
    { name: "input_validation", code: `const msg = (fn) => { try { fn(); return null; } catch (e) { return e.constructor.name + ':' + e.message; } };
for (const bad of [0, -1, 1.5, '3', undefined, NaN]) assert(msg(() => rollingUpdateSteps(bad)) === 'RangeError:replicas must be a positive integer', 'replicas ' + String(bad) + ' -> ' + msg(() => rollingUpdateSteps(bad)));
for (const bad of [-1, 1.5, 'abc', '25', '%', '-5%', null]) assert(msg(() => rollingUpdateSteps(3, { maxSurge: bad })) === 'RangeError:Invalid maxSurge', 'maxSurge ' + String(bad) + ' -> ' + msg(() => rollingUpdateSteps(3, { maxSurge: bad })));
for (const bad of [-1, 0.5, 'x', '10', {}]) assert(msg(() => rollingUpdateSteps(3, { maxUnavailable: bad })) === 'RangeError:Invalid maxUnavailable', 'maxUnavailable ' + JSON.stringify(bad));
assert(msg(() => rollingUpdateSteps(3, { maxSurge: '12.5%' })) === null, 'fractional percentages are fine');` },
    { name: "limits_hold_for_many_combinations", code: `const failures = [];
for (const replicas of [1, 2, 3, 4, 5, 7, 10, 25, 100]) {
  for (const surge of [0, 1, 2, 3, 25, '10%', '25%', '50%', '100%']) {
    for (const unavailable of [0, 1, 2, 5, '10%', '25%', '50%']) {
      let result = null;
      try { result = rollingUpdateSteps(replicas, { maxSurge: surge, maxUnavailable: unavailable }); } catch (e) { if (e.message === 'maxSurge and maxUnavailable cannot both be 0') continue; failures.push(replicas + '/' + surge + '/' + unavailable + ' threw ' + e.message); continue; }
      const resolve = (v, round) => (typeof v === 'string' ? round(replicas * parseFloat(v) / 100) : v);
      let s = resolve(surge, Math.ceil); let u = resolve(unavailable, Math.floor);
      if (s === 0 && u === 0) u = 1;
      const last = result.steps[result.steps.length - 1];
      if (last.old !== 0 || last.new !== replicas) failures.push(replicas + '/' + surge + '/' + unavailable + ' did not finish');
      if (result.peakTotal > replicas + s) failures.push(replicas + '/' + surge + '/' + unavailable + ' peak ' + result.peakTotal);
      if (result.minAvailable < replicas - u) failures.push(replicas + '/' + surge + '/' + unavailable + ' available ' + result.minAvailable);
      for (const st of result.steps) if (st.old < 0 || st.new > replicas) failures.push(replicas + '/' + surge + '/' + unavailable + ' bad step ' + JSON.stringify(st));
    }
  }
}
assert(failures.length === 0, failures.slice(0, 3).join(' | '));` },
    { name: "steps_progress_monotonically", code: `const r = rollingUpdateSteps(10, { maxSurge: 2, maxUnavailable: 1 });
for (let i = 1; i < r.steps.length; i++) {
  assert(r.steps[i].old <= r.steps[i - 1].old && r.steps[i].new >= r.steps[i - 1].new, 'old never grows and new never shrinks at step ' + i);
}
assert(r.steps.every((s) => s.old + s.new <= 12), 'never more than replicas + surge after a step');
assert(Object.keys(r).sort().join() === 'minAvailable,peakTotal,steps', 'result keys: ' + Object.keys(r));` },
    { name: "more_surge_means_fewer_steps", code: `const slow = rollingUpdateSteps(10, { maxSurge: 1, maxUnavailable: 0 }).steps.length;
const fast = rollingUpdateSteps(10, { maxSurge: 5, maxUnavailable: 0 }).steps.length;
const fastest = rollingUpdateSteps(10, { maxSurge: '100%', maxUnavailable: '100%' }).steps.length;
assert(fast < slow && fastest <= fast, 'bigger budgets finish faster: ' + [slow, fast, fastest]);
const all = rollingUpdateSteps(4, { maxSurge: 0, maxUnavailable: 4 });
assert(JSON.stringify(all.steps) === '[{"old":0,"new":0},{"old":0,"new":4}]', 'maxUnavailable equal to replicas is a recreate deployment: ' + JSON.stringify(all.steps));
assert(all.minAvailable === 0 && all.peakTotal === 4, 'full downtime, no extra capacity');` },
  ],
  solution: {
    code: `function rollingUpdateSteps(replicas, { maxSurge = 1, maxUnavailable = 0 } = {}) {
  if (!Number.isInteger(replicas) || replicas < 1) throw new RangeError('replicas must be a positive integer');

  function resolve(value, round, label) {
    if (typeof value === 'string' && /^\\d+(\\.\\d+)?%$/.test(value)) {
      return { n: round((replicas * parseFloat(value)) / 100), percent: true };
    }
    if (Number.isInteger(value) && value >= 0) return { n: value, percent: false };
    throw new RangeError('Invalid ' + label);
  }

  const surgeSetting = resolve(maxSurge, Math.ceil, 'maxSurge');
  const unavailableSetting = resolve(maxUnavailable, Math.floor, 'maxUnavailable');
  const surge = surgeSetting.n;
  let unavailable = unavailableSetting.n;
  if (surge === 0 && unavailable === 0) {
    if (surgeSetting.percent || unavailableSetting.percent) unavailable = 1;
    else throw new Error('maxSurge and maxUnavailable cannot both be 0');
  }

  let old = replicas;
  let ready = 0;
  let peakTotal = replicas;
  let minAvailable = replicas;
  const steps = [];

  for (let guard = 0; guard < replicas * 4 + 10; guard++) {
    if (old === 0 && ready === replicas) return { steps, peakTotal, minAvailable };
    const add = Math.max(0, Math.min(replicas - ready, replicas + surge - (old + ready)));
    const kill = Math.max(0, Math.min(old, old + ready - (replicas - unavailable)));
    peakTotal = Math.max(peakTotal, old + ready + add);
    old -= kill;
    minAvailable = Math.min(minAvailable, old + ready);
    ready += add;
    steps.push({ old, new: ready });
  }
  if (old === 0 && ready === replicas) return { steps, peakTotal, minAvailable };
  throw new Error('Rollout cannot make progress');
}

module.exports = rollingUpdateSteps;`,
    explanation:
      "Each step first lets new instances start (limited by the surge budget) and kills old ones (limited by the availability floor), where the kill is decided before the new instances are ready. That is why a zero-unavailable rollout alternates between 'add one' and 'remove one'. The two invariants, total at most replicas plus surge and available at least replicas minus unavailable, always hold.",
  },
};
