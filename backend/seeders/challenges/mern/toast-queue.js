export default {
  slug: "toast-queue",
  trackId: "mern",
  layerId: "mern-8",
  type: "CODE",
  difficulty: "med",
  title: "Toast notification queue",
  summary: "Manage toasts with expiry, a visible limit, de-duplication with counts, and change subscriptions.",
  description:
    "Every app shows 'Saved!' and 'Network error' toasts. Behind the pretty animation is a small state machine: don't show 20 identical errors, cap what's on screen, and remove each toast when its time is up.",
  task:
    "Write <code>createToaster({ max = 3, now })</code> returning <code>{ add, dismiss, list, prune, subscribe }</code>.",
  constraints: [
    "<code>add(message, { type = 'info', duration = 4000 })</code> returns the toast id (1, 2, 3...). A toast is <code>{ id, message, type, count, expiresAt }</code> with <code>count</code> starting at 1 and <code>expiresAt = now() + duration</code> (<code>Infinity</code> for a <code>duration</code> of <code>Infinity</code>).",
    "If a visible toast has the same <code>message</code> AND <code>type</code>, do not add another: increment its <code>count</code>, reset its <code>expiresAt</code>, and return its id. A new id is never consumed by a duplicate.",
    "At most <code>max</code> toasts are visible; adding one beyond that removes the oldest first (by insertion).",
    "<code>prune()</code> removes toasts with <code>expiresAt &lt;= now()</code> and returns how many were removed; <code>list()</code> calls <code>prune()</code> and returns a copy of the visible toasts, oldest first.",
    "<code>dismiss(id)</code> returns true if a toast was removed. <code>subscribe(fn)</code> returns an unsubscribe function; <code>fn(list)</code> is called after every change (add, duplicate bump, dismiss, and a <code>prune</code> that removed something), but not when nothing changed.",
  ],
  example: `toaster.add('Saved'); toaster.add('Saved'); toaster.list(); // [{ id: 1, message: 'Saved', count: 2, ... }]`,
  tags: ["ui","notifications","state","react"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createToaster.js",
      lang: "js",
      code: `// createToaster.js
function createToaster(options = {}) {
  // your code here
}

module.exports = createToaster;`,
    },
  ],
  testFile: {
    name: "createToaster_test.js",
    lang: "test",
    code: `const createToaster = require('./createToaster');

test('add_and_list', () => {
  const t = createToaster({ now: () => 0 }); t.add('Saved'); expect(t.list()[0].message).toBe('Saved');
});

test('dedupe', () => {
  const t = createToaster({ now: () => 0 }); t.add('Hi'); t.add('Hi'); expect(t.list()[0].count).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep an array <code>toasts</code> and a <code>nextId</code> counter; <code>add</code> first looks for a visible toast with the same message and type (after pruning)." },
    { order: 2, cost: 5, text: "When the array is longer than <code>max</code> after pushing, <code>shift()</code> the oldest." },
    { order: 3, cost: 15, text: "Write a private <code>emit()</code> that calls each subscriber with <code>[...toasts]</code>, and call it only in code paths where something really changed." },
  ],
  hiddenTests: [
    { name: "add_returns_incrementing_ids_and_shape", code: `let t0 = 1000; const t = createToaster({ now: () => t0 });
const a = t.add('A'); const b = t.add('B', { type: 'error', duration: 500 });
assert(a === 1 && b === 2, 'ids: ' + a + ',' + b);
const [x, y] = t.list();
assert(x.id === 1 && x.message === 'A' && x.type === 'info' && x.count === 1 && x.expiresAt === 5000, 'defaults: ' + JSON.stringify(x));
assert(y.type === 'error' && y.expiresAt === 1500, 'custom: ' + JSON.stringify(y));` },
    { name: "list_returns_a_copy_oldest_first", code: `const t = createToaster({ now: () => 0 });
t.add('1'); t.add('2');
const l = t.list();
assert(l.map((x) => x.message).join('') === '12', 'order');
l.pop();
assert(t.list().length === 2, 'mutating the result does not change the toaster');` },
    { name: "toasts_expire", code: `let now = 0; const t = createToaster({ now: () => now });
t.add('short', { duration: 100 }); t.add('long', { duration: 1000 });
now = 99; assert(t.list().length === 2, 'both alive at 99');
now = 100; assert(t.list().map((x) => x.message).join() === 'long', 'expired exactly at expiresAt');
now = 1000; assert(t.list().length === 0, 'all gone');` },
    { name: "infinite_duration_never_expires", code: `let now = 0; const t = createToaster({ now: () => now });
t.add('sticky', { duration: Infinity });
now = 1e12;
assert(t.list().length === 1 && t.list()[0].expiresAt === Infinity, 'persistent');` },
    { name: "duplicates_bump_count_and_reset_expiry", code: `let now = 0; const t = createToaster({ now: () => now });
const a = t.add('Saved', { duration: 1000 });
now = 600;
const b = t.add('Saved', { duration: 1000 });
assert(b === a, 'same id returned');
const l = t.list();
assert(l.length === 1 && l[0].count === 2 && l[0].expiresAt === 1600, 'bumped: ' + JSON.stringify(l));
const c = t.add('Other');
assert(c === 2, 'duplicates do not consume ids, got ' + c);` },
    { name: "same_message_different_type_is_not_a_duplicate", code: `const t = createToaster({ now: () => 0 });
t.add('Oops', { type: 'error' }); t.add('Oops', { type: 'warning' });
assert(t.list().length === 2, 'type is part of identity');` },
    { name: "expired_toast_is_not_a_duplicate", code: `let now = 0; const t = createToaster({ now: () => now });
const a = t.add('Saved', { duration: 100 });
now = 200;
const b = t.add('Saved');
assert(b !== a && t.list()[0].count === 1, 'a fresh toast replaces the expired one');` },
    { name: "max_visible_drops_oldest", code: `const t = createToaster({ max: 2, now: () => 0 });
t.add('1'); t.add('2'); t.add('3');
assert(t.list().map((x) => x.message).join('') === '23', 'oldest dropped');
const d = createToaster({ now: () => 0 });
d.add('a'); d.add('b'); d.add('c'); d.add('d');
assert(d.list().length === 3, 'default max is 3');` },
    { name: "duplicate_does_not_count_against_max_or_reorder", code: `const t = createToaster({ max: 2, now: () => 0 });
t.add('1'); t.add('2'); t.add('1');
assert(t.list().map((x) => x.message).join('') === '12', 'no eviction and no reordering on a duplicate');` },
    { name: "dismiss", code: `const t = createToaster({ now: () => 0 });
const a = t.add('A'); t.add('B');
assert(t.dismiss(a) === true, 'removed');
assert(t.dismiss(a) === false && t.dismiss(999) === false, 'unknown ids');
assert(t.list().map((x) => x.message).join('') === 'B', 'B remains');` },
    { name: "prune_returns_number_removed", code: `let now = 0; const t = createToaster({ now: () => now });
t.add('a', { duration: 10 }); t.add('b', { duration: 10 }); t.add('c', { duration: 100 });
now = 50;
assert(t.prune() === 2, 'two expired');
assert(t.prune() === 0, 'nothing more');` },
    { name: "subscribe_notifies_on_changes_only", code: `let now = 0; const t = createToaster({ now: () => now }); const seen = [];
t.subscribe((list) => seen.push(list.map((x) => x.message + 'x' + x.count).join('|')));
t.add('A');
t.add('A');
t.add('B', { duration: 10 });
const id = t.add('C');
t.dismiss(id);
t.dismiss(id);
now = 20; t.prune();
t.prune();
assert(seen.join(' / ') === 'Ax1 / Ax2 / Ax2|Bx1 / Ax2|Bx1|Cx1 / Ax2|Bx1 / Ax2', 'notifications: ' + seen.join(' / '));` },
    { name: "unsubscribe_and_multiple_subscribers", code: `const t = createToaster({ now: () => 0 }); let a = 0; let b = 0;
const offA = t.subscribe(() => a++); t.subscribe(() => b++);
t.add('x');
offA(); offA();
t.add('y');
assert(a === 1 && b === 2, 'a=' + a + ' b=' + b);` },
    { name: "subscribers_get_copies", code: `const t = createToaster({ now: () => 0 }); let received;
t.subscribe((l) => { received = l; });
t.add('x');
received.pop();
assert(t.list().length === 1, 'internal state is protected');` },
  ],
  solution: {
    code: `function createToaster({ max = 3, now = () => Date.now() } = {}) {
  let toasts = [];
  let nextId = 1;
  const subscribers = new Set();

  const emit = () => {
    for (const fn of [...subscribers]) fn([...toasts]);
  };

  function prune() {
    const before = toasts.length;
    toasts = toasts.filter((t) => t.expiresAt > now());
    const removed = before - toasts.length;
    if (removed > 0) emit();
    return removed;
  }

  return {
    add(message, { type = 'info', duration = 4000 } = {}) {
      prune();
      const existing = toasts.find((t) => t.message === message && t.type === type);
      if (existing) {
        existing.count += 1;
        existing.expiresAt = now() + duration;
        emit();
        return existing.id;
      }
      const toast = { id: nextId++, message, type, count: 1, expiresAt: now() + duration };
      toasts.push(toast);
      while (toasts.length > max) toasts.shift();
      emit();
      return toast.id;
    },
    dismiss(id) {
      const before = toasts.length;
      toasts = toasts.filter((t) => t.id !== id);
      if (toasts.length === before) return false;
      emit();
      return true;
    },
    list() {
      prune();
      return toasts.map((t) => ({ ...t }));
    },
    prune,
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
}

module.exports = createToaster;`,
    explanation:
      "Expiry is lazy: instead of a timer per toast, every operation prunes first. Identity is message plus type, so repeats bump a counter on the existing toast rather than flooding the screen, and emit() is only called where something actually changed.",
  },
};
