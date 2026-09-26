export default {
    slug: "fix-long-running-memory-leak",
    trackId: "api-dev",
    layerId: "api-dev-3",
    type: "DEBUG",
    difficulty: "hard",
    title: "Fix a memory leak in a long-running service",
    summary:
      "A service bloats from 80MB to 2GB over six hours. Find the closure trap.",
    description:
      "You're handed heap snapshots from a Node service that grows steadily under normal load. Nothing looks wrong in the request path.",
    task: "Find and fix the closure-trap leak that keeps request-scoped objects alive.",
    constraints: [
      "The fix must not change the public behaviour of the module.",
      "Memory must stay flat across 10,000 simulated requests.",
      "Completed requests must actually be removable from the tracker.",
    ],
    example: `const tracker = require('./tracker');
tracker.trackRequest({ id: 'req-1' });
tracker.completeRequest('req-1'); // after this, nothing should still reference req-1`,
    tags: ["memory", "debug"],
    estimatedMins: 38,
    xp: 65,
    starterFiles: [
      {
        name: "tracker.js",
        lang: "js",
        code: `// tracker.js — this module leaks. Find out why, then fix it.
// Every call to trackRequest pushes a closure that captures the entire req
// object into an array that nothing ever removes from.
const listeners = [];

function trackRequest(req) {
  listeners.push(() => req.id);
}

function completeRequest(id) {
  // does nothing yet — this is the bug
}

module.exports = { trackRequest, completeRequest, listeners };`,
      },
    ],
    testFile: {
      name: "tracker_test.js",
      lang: "test",
      code: `// tracker_test.js
const tracker = require('./tracker');

test('completing_a_request_removes_it', () => {
  tracker.trackRequest({ id: 'req-1' });
  tracker.completeRequest('req-1');
  expect(tracker.listeners.length).toBe(0);
});`,
    },
    hints: [
      {
        order: 1,
        cost: 0,
        text: "The leak isn't in <code>trackRequest</code> — it's in what never happens after. Every pushed closure holds a reference to <code>req</code> forever unless something removes it from <code>listeners</code>.",
      },
      {
        order: 2,
        cost: 5,
        text: "You need a way to find and remove the right entry by id later — an array of bare closures with no id attached can't do that. Track the id alongside the closure.",
      },
      {
        order: 3,
        cost: 15,
        text: "Store <code>{ id, get: () => req.id }</code> objects instead of bare closures, and implement <code>completeRequest(id)</code> as a filter that drops the entry with that id.",
      },
    ],
    hiddenTests: [
      {
        name: "completing_removes_the_entry",
        code: `trackRequest({ id: 'req-1' });
completeRequest('req-1');
assert(listeners.length === 0, 'after completing the only tracked request, listeners must be empty — got length ' + listeners.length);`,
      },
      {
        name: "completing_one_does_not_remove_others",
        code: `trackRequest({ id: 'req-1' });
trackRequest({ id: 'req-2' });
completeRequest('req-1');
assert(listeners.length === 1, 'exactly one request should remain tracked');
const remainingIds = listeners.map((l) => (typeof l === 'function' ? l() : l.id));
assert(remainingIds.includes('req-2'), 'req-2 must still be tracked after only req-1 was completed');
completeRequest('req-2');`,
      },
      {
        name: "memory_stays_flat_across_many_requests",
        code: `for (let i = 0; i < 10000; i++) {
  trackRequest({ id: 'req-' + i, payload: new Array(100).fill('x') });
  completeRequest('req-' + i);
}
assert(listeners.length === 0, 'after tracking and completing 10000 requests one at a time, none should remain — got ' + listeners.length + ' still held');`,
      },
      {
        name: "completing_an_unknown_id_is_a_no_op",
        code: `trackRequest({ id: 'req-1' });
completeRequest('does-not-exist');
assert(listeners.length === 1, 'completing an id that was never tracked must not remove unrelated entries');`,
      },
    ],
    solution: {
      code: `const listeners = [];

function trackRequest(req) {
  listeners.push({ id: req.id, get: () => req.id });
}

function completeRequest(id) {
  const index = listeners.findIndex((entry) => entry.id === id);
  if (index !== -1) listeners.splice(index, 1);
}

module.exports = { trackRequest, completeRequest, listeners };`,
      explanation:
        "The original code pushes a bare closure that captures the whole req object, and nothing ever calls listeners.splice() to remove it — so every request tracked for the life of the process stays referenced by that array, which is the entire leak. The fix does two things: it tags each entry with the request's id so a later call can find it again (an anonymous closure can't be looked up), and it actually implements completeRequest to splice the matching entry out. Once an entry is spliced out, nothing in the module still references that req object, so the garbage collector can reclaim it on the next pass — that's what keeps memory flat over many requests instead of growing without bound.",
    },
};
