export default {
  slug: "event-bus-wildcards",
  trackId: "api-dev",
  layerId: "api-dev-9",
  type: "CODE",
  difficulty: "med",
  title: "Event bus with topic wildcards",
  summary: "Publish/subscribe with dot-separated topics where * matches one segment and # matches many.",
  description:
    "Event-driven systems decouple producers from consumers with topics like <code>order.created</code>. Brokers such as RabbitMQ add wildcards so one subscriber can listen to a whole family of events.",
  task:
    "Write <code>createBus()</code> returning <code>{ subscribe(pattern, fn), publish(topic, payload) }</code>.",
  constraints: [
    "Topics and patterns are dot-separated segments.",
    "In a pattern, <code>*</code> matches exactly one segment; <code>#</code> matches zero or more segments; other segments must match exactly.",
    "<code>subscribe</code> returns an unsubscribe function.",
    "<code>publish</code> calls every matching handler as <code>fn(payload, topic)</code> and returns how many ran.",
    "Handlers run in subscription order.",
  ],
  example: `bus.subscribe('order.*', log); bus.publish('order.created', { id: 1 }); // 1`,
  tags: ["events","pub-sub","architecture"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "createBus.js",
      lang: "js",
      code: `// createBus.js
function createBus() {
  // your code here
}

module.exports = createBus;`,
    },
  ],
  testFile: {
    name: "createBus_test.js",
    lang: "test",
    code: `const createBus = require('./createBus');

test('exact', () => {
  const b = createBus(); let got; b.subscribe('a.b', (p) => { got = p; }); b.publish('a.b', 5); expect(got).toBe(5);
});

test('star', () => {
  const b = createBus(); expect(b.subscribe('a.*', () => {}) !== undefined).toBe(true); expect(b.publish('a.x')).toBe(1);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Split both pattern and topic on <code>.</code> and write a recursive <code>match(patternParts, topicParts)</code>." },
    { order: 2, cost: 5, text: "For <code>#</code>, try matching the rest of the pattern against every possible suffix of the topic, including the empty one." },
    { order: 3, cost: 15, text: "Iterate over a copy of the subscription list in <code>publish</code> so an unsubscribe inside a handler is safe." },
  ],
  hiddenTests: [
    { name: "exact_match", code: `const b = createBus(); const got = [];
b.subscribe('user.created', (p, t) => got.push(p + ':' + t));
assert(b.publish('user.created', 1) === 1, 'one handler');
assert(b.publish('user.deleted', 2) === 0, 'no handler');
assert(got.join('|') === '1:user.created', 'payload and topic passed: ' + got);` },
    { name: "star_matches_one_segment", code: `const b = createBus(); let n = 0; b.subscribe('user.*', () => n++);
b.publish('user.created'); b.publish('user.deleted');
b.publish('user'); b.publish('user.a.b');
assert(n === 2, 'only exactly one extra segment, got ' + n);` },
    { name: "star_in_the_middle", code: `const b = createBus(); let n = 0; b.subscribe('a.*.c', () => n++);
b.publish('a.b.c'); b.publish('a.x.c'); b.publish('a.b.d'); b.publish('a.c');
assert(n === 2, 'middle star, got ' + n);` },
    { name: "hash_matches_many", code: `const b = createBus(); let n = 0; b.subscribe('user.#', () => n++);
b.publish('user'); b.publish('user.a'); b.publish('user.a.b.c'); b.publish('order.a');
assert(n === 3, 'zero or more segments, got ' + n);` },
    { name: "hash_alone_matches_everything", code: `const b = createBus(); let n = 0; b.subscribe('#', () => n++);
b.publish('a'); b.publish('a.b.c');
assert(n === 2, 'everything');` },
    { name: "leading_hash", code: `const b = createBus(); let n = 0; b.subscribe('#.error', () => n++);
b.publish('error'); b.publish('db.error'); b.publish('a.b.error'); b.publish('error.db');
assert(n === 3, 'ends with error, got ' + n);` },
    { name: "unsubscribe", code: `const b = createBus(); let n = 0; const off = b.subscribe('a', () => n++);
b.publish('a'); off(); off();
assert(b.publish('a') === 0 && n === 1, 'handler removed, double off is safe');` },
    { name: "several_subscribers_in_order", code: `const b = createBus(); const log = [];
b.subscribe('a.b', () => log.push('1')); b.subscribe('a.*', () => log.push('2')); b.subscribe('#', () => log.push('3'));
assert(b.publish('a.b') === 3, 'three handlers');
assert(log.join('') === '123', 'subscription order');` },
    { name: "unsubscribe_during_publish_is_safe", code: `const b = createBus(); const log = [];
const off = b.subscribe('a', () => { log.push('first'); off(); });
b.subscribe('a', () => log.push('second'));
b.publish('a');
assert(log.join(',') === 'first,second', 'second handler must still run: ' + log);` },
  ],
  solution: {
    code: `function createBus() {
  const subs = [];

  function match(p, t) {
    if (p.length === 0) return t.length === 0;
    if (p[0] === '#') {
      for (let i = 0; i <= t.length; i++) {
        if (match(p.slice(1), t.slice(i))) return true;
      }
      return false;
    }
    if (t.length === 0) return false;
    if (p[0] === '*' || p[0] === t[0]) return match(p.slice(1), t.slice(1));
    return false;
  }

  return {
    subscribe(pattern, fn) {
      const sub = { parts: pattern.split('.'), fn };
      subs.push(sub);
      return () => {
        const i = subs.indexOf(sub);
        if (i !== -1) subs.splice(i, 1);
      };
    },
    publish(topic, payload) {
      const parts = topic.split('.');
      let count = 0;
      for (const sub of [...subs]) {
        if (match(sub.parts, parts)) {
          sub.fn(payload, topic);
          count++;
        }
      }
      return count;
    },
  };
}

module.exports = createBus;`,
    explanation:
      "Matching is a small recursive function over segment lists. '#' tries every possible split point of the topic, which is why it can match zero or many segments.",
  },
};
