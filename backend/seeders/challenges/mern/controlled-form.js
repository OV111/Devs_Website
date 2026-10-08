export default {
  slug: "controlled-form",
  trackId: "mern",
  layerId: "mern-3",
  type: "CODE",
  difficulty: "med",
  title: "Controlled form state with validation",
  summary: "Track values, touched fields, visible errors, dirty state and an async submit that blocks double-submits.",
  description:
    "Every React form library (Formik, React Hook Form) manages the same state: field values, which fields the user has touched, validation errors, and submission status. Showing errors only for touched fields (or after a submit attempt) is what keeps forms from yelling at users too early.",
  task:
    "Write <code>createForm({ initialValues, validate, onSubmit })</code> returning <code>{ getState, change, blur, reset, submit, subscribe }</code>.",
  constraints: [
    "<code>validate(values)</code> returns an object mapping field names to error messages; falsy messages are ignored. It is optional (no errors).",
    "<code>getState()</code> returns a fresh snapshot <code>{ values, touched, errors, visibleErrors, dirty, isValid, submitCount, isSubmitting, submitError }</code>: <code>errors</code> are ALL current errors; <code>visibleErrors</code> only those for touched fields; <code>dirty</code> is true if any value is not <code>Object.is</code>-equal to its initial value; <code>isValid</code> means no errors.",
    "<code>change(name, value)</code> sets a value (the state is replaced immutably). <code>blur(name)</code> marks the field touched. <code>reset()</code> restores initial values and clears touched, submitCount and submitError.",
    "<code>async submit()</code>: if already submitting return <code>{ ok: false, reason: 'already_submitting' }</code>; else increment <code>submitCount</code> and mark ALL initial fields touched. With errors, return <code>{ ok: false, reason: 'invalid', errors }</code> without calling <code>onSubmit</code>. Otherwise set <code>isSubmitting</code>, await <code>onSubmit(values copy)</code>, and return <code>{ ok: true }</code>; if it rejects set <code>submitError</code> to the error's message and return <code>{ ok: false, reason: 'failed', error }</code>. <code>isSubmitting</code> is always false again afterwards.",
    "<code>subscribe(fn)</code> returns an unsubscribe; <code>fn(state)</code> runs after every change: <code>change</code>, <code>blur</code>, <code>reset</code>, an invalid submit (once), and a real submit (once when it starts, once when it ends).",
  ],
  example: `const form = createForm({ initialValues: { email: '' }, validate: (v) => (v.email ? {} : { email: 'Required' }), onSubmit: save });`,
  tags: ["react","forms","validation","state"],
  estimatedMins: 40,
  xp: 45,
  starterFiles: [
    {
      name: "createForm.js",
      lang: "js",
      code: `// createForm.js
function createForm(options) {
  // your code here
}

module.exports = createForm;`,
    },
  ],
  testFile: {
    name: "createForm_test.js",
    lang: "test",
    code: `const createForm = require('./createForm');

test('errors_hidden_until_touched', () => {
  const f = createForm({ initialValues: { a: '' }, validate: (v) => (v.a ? {} : { a: 'req' }) }); expect(f.getState().errors.a).toBe('req'); expect(f.getState().visibleErrors).toEqual({}); f.blur('a'); expect(f.getState().visibleErrors.a).toBe('req');
});

test('dirty', () => {
  const f = createForm({ initialValues: { a: 1 } }); expect(f.getState().dirty).toBe(false); f.change('a', 2); expect(f.getState().dirty).toBe(true);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep <code>values</code>, <code>touched</code>, <code>submitCount</code>, <code>isSubmitting</code> and <code>submitError</code> as local variables, and compute errors, visible errors, dirty and validity fresh inside <code>getState()</code> rather than storing them." },
    { order: 2, cost: 5, text: "Replace objects instead of mutating them: <code>values = { ...values, [name]: value }</code>." },
    { order: 3, cost: 15, text: "In <code>submit</code>, use <code>try / catch / finally</code> around <code>await onSubmit(...)</code>, and call your <code>notify()</code> when the submit starts and again in <code>finally</code>." },
  ],
  hiddenTests: [
    { name: "initial_state", code: `const f = createForm({ initialValues: { name: 'Ann', age: 3 } });
const s = f.getState();
assert(s.values.name === 'Ann' && s.values.age === 3, 'values');
assert(s.dirty === false && s.isValid === true && s.submitCount === 0 && s.isSubmitting === false && s.submitError === null, 'flags');
assert(Object.keys(s.touched).length === 0 && Object.keys(s.errors).length === 0, 'no touched and no errors');` },
    { name: "snapshots_are_independent", code: `const f = createForm({ initialValues: { a: 1 } });
const s1 = f.getState();
f.change('a', 2);
const s2 = f.getState();
assert(s1.values.a === 1 && s2.values.a === 2 && s1 !== s2, 'old snapshots do not change');
s2.values.a = 99;
assert(f.getState().values.a === 2, 'mutating a snapshot does not change the form');` },
    { name: "change_and_dirty_tracking", code: `const f = createForm({ initialValues: { a: 'x', b: 1 } });
f.change('a', 'y');
assert(f.getState().values.a === 'y' && f.getState().dirty === true, 'dirty');
f.change('a', 'x');
assert(f.getState().dirty === false, 'back to the initial value is clean again');` },
    { name: "errors_visible_errors_and_validity", code: `const validate = (v) => ({ email: v.email.includes('@') ? '' : 'Invalid email', name: v.name ? null : 'Required' });
const f = createForm({ initialValues: { email: '', name: '' }, validate });
let s = f.getState();
assert(s.isValid === false && s.errors.email === 'Invalid email' && s.errors.name === 'Required', 'all errors');
assert(Object.keys(s.visibleErrors).length === 0, 'nothing visible before touching');
f.blur('email');
s = f.getState();
assert(s.visibleErrors.email === 'Invalid email' && !('name' in s.visibleErrors), 'only touched fields: ' + JSON.stringify(s.visibleErrors));
f.change('email', 'a@b.c'); f.change('name', 'Ann');
s = f.getState();
assert(s.isValid === true && Object.keys(s.errors).length === 0 && Object.keys(s.visibleErrors).length === 0, 'valid now');` },
    { name: "falsy_messages_are_not_errors", code: `const f = createForm({ initialValues: { a: 1 }, validate: () => ({ a: '', b: null, c: undefined, d: false }) });
assert(f.getState().isValid === true && Object.keys(f.getState().errors).length === 0, 'only truthy messages count');` },
    { name: "blur_marks_touched_and_reset_restores", code: `const f = createForm({ initialValues: { a: 1 }, validate: (v) => (v.a > 1 ? {} : { a: 'too small' }) });
f.change('a', 5); f.blur('a');
assert(f.getState().touched.a === true, 'touched');
f.reset();
const s = f.getState();
assert(s.values.a === 1 && s.dirty === false && Object.keys(s.touched).length === 0 && s.submitCount === 0, 'reset: ' + JSON.stringify(s));` },
    { name: "invalid_submit_touches_everything_and_does_not_call_onSubmit", code: `let called = 0;
const f = createForm({ initialValues: { a: '', b: '' }, validate: () => ({ a: 'A!' }), onSubmit: async () => { called++; } });
const r = await f.submit();
assert(r.ok === false && r.reason === 'invalid' && r.errors.a === 'A!', 'result: ' + JSON.stringify(r));
assert(called === 0, 'onSubmit not called');
const s = f.getState();
assert(s.touched.a === true && s.touched.b === true && s.submitCount === 1, 'all fields touched, counted');
assert(s.visibleErrors.a === 'A!' && s.isSubmitting === false, 'errors now visible');` },
    { name: "valid_submit_calls_onSubmit_with_a_copy", code: `let received = null;
const f = createForm({ initialValues: { a: 'x' }, onSubmit: async (values) => { received = values; values.a = 'tampered'; } });
const r = await f.submit();
assert(r.ok === true, 'ok');
assert(received.a === 'tampered' && f.getState().values.a === 'x', 'onSubmit receives a copy, form state unaffected');
assert(f.getState().submitCount === 1 && f.getState().isSubmitting === false, 'counted and finished');` },
    { name: "isSubmitting_while_pending_and_double_submit_is_blocked", code: `let calls = 0; let release;
const f = createForm({ initialValues: { a: 1 }, onSubmit: () => new Promise((r) => { calls++; release = r; }) });
const first = f.submit();
assert(f.getState().isSubmitting === true, 'submitting');
const second = await f.submit();
assert(second.ok === false && second.reason === 'already_submitting', 'blocked: ' + JSON.stringify(second));
assert(calls === 1 && f.getState().submitCount === 1, 'handler called once, only one counted');
release();
assert((await first).ok === true && f.getState().isSubmitting === false, 'finished');
const third = f.submit(); release(); await third;
assert(calls === 2, 'can submit again after finishing');` },
    { name: "failed_submit_records_the_error_and_recovers", code: `let fail = true;
const f = createForm({ initialValues: { a: 1 }, onSubmit: async () => { if (fail) throw new Error('Server said no'); } });
const r = await f.submit();
assert(r.ok === false && r.reason === 'failed' && r.error.message === 'Server said no', 'result');
assert(f.getState().submitError === 'Server said no' && f.getState().isSubmitting === false, 'state');
fail = false;
const ok = await f.submit();
assert(ok.ok === true && f.getState().submitError === null, 'error cleared by a successful submit');
assert(f.getState().submitCount === 2, 'two attempts counted');` },
    { name: "reset_clears_submit_error", code: `const f = createForm({ initialValues: { a: 1 }, onSubmit: async () => { throw new Error('x'); } });
await f.submit();
f.reset();
assert(f.getState().submitError === null && f.getState().submitCount === 0, 'cleared');` },
    { name: "subscribers_are_notified_exactly_when_things_change", code: `const f = createForm({ initialValues: { a: 1 }, validate: (v) => (v.a === 0 ? { a: 'zero' } : {}), onSubmit: async () => {} });
let n = 0; const states = [];
const off = f.subscribe((s) => { n++; states.push(s); });
f.change('a', 2); assert(n === 1, 'change');
f.blur('a'); assert(n === 2, 'blur');
f.reset(); assert(n === 3, 'reset');
await f.submit(); assert(n === 5, 'valid submit notifies at start and end: ' + n);
assert(states[3].isSubmitting === true && states[4].isSubmitting === false, 'start/end states');
f.change('a', 0);
await f.submit(); assert(n === 7, 'invalid submit notifies once (plus the change): ' + n);
off(); off();
f.change('a', 5); assert(n === 7, 'no notifications after unsubscribe');` },
    { name: "unknown_fields_can_be_changed", code: `const f = createForm({ initialValues: { a: 1 } });
f.change('extra', 'x');
assert(f.getState().values.extra === 'x' && f.getState().dirty === true, 'new field counts as a change');` },
  ],
  solution: {
    code: `function createForm({ initialValues, validate = () => ({}), onSubmit }) {
  let values = { ...initialValues };
  let touched = {};
  let submitCount = 0;
  let isSubmitting = false;
  let submitError = null;
  const subscribers = new Set();

  function computeErrors() {
    const raw = validate(values) || {};
    const errors = {};
    for (const [name, message] of Object.entries(raw)) {
      if (message) errors[name] = message;
    }
    return errors;
  }

  function getState() {
    const errors = computeErrors();
    const visibleErrors = {};
    for (const name of Object.keys(errors)) {
      if (touched[name]) visibleErrors[name] = errors[name];
    }
    return {
      values: { ...values },
      touched: { ...touched },
      errors,
      visibleErrors,
      dirty: Object.keys(values).some((name) => !Object.is(values[name], initialValues[name])),
      isValid: Object.keys(errors).length === 0,
      submitCount,
      isSubmitting,
      submitError,
    };
  }

  function notify() {
    for (const fn of [...subscribers]) fn(getState());
  }

  return {
    getState,
    change(name, value) {
      values = { ...values, [name]: value };
      notify();
    },
    blur(name) {
      touched = { ...touched, [name]: true };
      notify();
    },
    reset() {
      values = { ...initialValues };
      touched = {};
      submitCount = 0;
      submitError = null;
      notify();
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    async submit() {
      if (isSubmitting) return { ok: false, reason: 'already_submitting' };
      submitCount++;
      for (const name of Object.keys(initialValues)) touched = { ...touched, [name]: true };
      const errors = computeErrors();
      if (Object.keys(errors).length > 0) {
        notify();
        return { ok: false, reason: 'invalid', errors };
      }
      isSubmitting = true;
      submitError = null;
      notify();
      try {
        await onSubmit({ ...values });
        return { ok: true };
      } catch (error) {
        submitError = error.message;
        return { ok: false, reason: 'failed', error };
      } finally {
        isSubmitting = false;
        notify();
      }
    },
  };
}

module.exports = createForm;`,
    explanation:
      "Only the raw inputs (values, touched, counters) are stored; errors, dirty and validity are derived on demand so they can never go out of sync. The 'touched' rule is why visibleErrors exists, and the isSubmitting guard stops double submits from double-charging a card.",
  },
};
