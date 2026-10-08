export default {
  slug: "migration-planner",
  trackId: "node-dev",
  layerId: "node-dev-5",
  type: "CODE",
  difficulty: "med",
  title: "Plan database migrations",
  summary: "Compare applied migrations with migration files: find what is pending and detect modified, missing and out-of-order ones.",
  description:
    "<code>prisma migrate</code> stores each applied migration's name and checksum in the database. Before applying anything it compares that history with the files on disk. Editing an applied migration or adding an older one later is dangerous, and the tool must refuse.",
  task:
    "Write <code>planMigrations(applied, files)</code>. <code>applied</code> is <code>[{ name, checksum }]</code> (from the database), <code>files</code> is <code>[{ name, checksum }]</code> (on disk). Return <code>{ ok, pending, errors }</code>.",
  constraints: [
    "Migration names start with a timestamp, so plain string order is chronological. Files are considered in ascending name order, regardless of input order. A repeated file name throws <code>Error('Duplicate migration: name')</code>.",
    "<code>'missing'</code>: applied but no file. <code>'modified'</code>: applied, file exists, but the checksums differ. <code>'out_of_order'</code>: not applied, but its name sorts BEFORE the latest applied migration.",
    "<code>pending</code> lists not-yet-applied files with names AFTER the latest applied one (all files if none applied), in order. Migrations reported as errors are never pending.",
    "<code>errors</code> is an array of <code>{ type, name }</code> sorted by name, one per migration at most. <code>ok</code> is true when there are no errors.",
  ],
  example: `planMigrations([{ name: '001_init', checksum: 'a' }], [{ name: '001_init', checksum: 'a' }, { name: '002_users', checksum: 'b' }]) // { ok: true, pending: ['002_users'], errors: [] }`,
  tags: ["prisma","migrations","postgres","deployment"],
  estimatedMins: 30,
  xp: 45,
  starterFiles: [
    {
      name: "planMigrations.js",
      lang: "js",
      code: `// planMigrations.js
function planMigrations(applied, files) {
  // your code here
}

module.exports = planMigrations;`,
    },
  ],
  testFile: {
    name: "planMigrations_test.js",
    lang: "test",
    code: `const planMigrations = require('./planMigrations');

test('pending', () => {
  const r = planMigrations([{ name: '1', checksum: 'a' }], [{ name: '1', checksum: 'a' }, { name: '2', checksum: 'b' }]); expect(r.pending).toEqual(['2']); expect(r.ok).toBe(true);
});

test('modified', () => {
  const r = planMigrations([{ name: '1', checksum: 'a' }], [{ name: '1', checksum: 'CHANGED' }]); expect(r.errors[0].type).toBe('modified');
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Index both lists by name with Maps, and iterate over the sorted union of all names so errors come out sorted." },
    { order: 2, cost: 5, text: "The latest applied name is the maximum of the applied names (string comparison)." },
    { order: 3, cost: 15, text: "Decide per name with an if/else chain: applied-and-no-file, applied-and-checksum-differs, unapplied-and-older-than-latest, else pending." },
  ],
  hiddenTests: [
    { name: "nothing_applied_everything_pending_in_order", code: `const r = planMigrations([], [{ name: '20240102_b', checksum: 'b' }, { name: '20240101_a', checksum: 'a' }]);
assert(r.ok === true && r.pending.join() === '20240101_a,20240102_b', 'sorted: ' + r.pending);
assert(r.errors.length === 0, 'no errors');` },
    { name: "up_to_date", code: `const r = planMigrations([{ name: 'a', checksum: '1' }, { name: 'b', checksum: '2' }], [{ name: 'a', checksum: '1' }, { name: 'b', checksum: '2' }]);
assert(r.ok === true && r.pending.length === 0 && r.errors.length === 0, 'nothing to do');` },
    { name: "only_newer_files_are_pending", code: `const applied = [{ name: '001', checksum: 'a' }];
const files = [{ name: '001', checksum: 'a' }, { name: '002', checksum: 'b' }, { name: '003', checksum: 'c' }];
const r = planMigrations(applied, files);
assert(r.pending.join() === '002,003' && r.ok, 'pending: ' + r.pending);` },
    { name: "modified_applied_migration", code: `const r = planMigrations([{ name: '001', checksum: 'a' }, { name: '002', checksum: 'b' }], [{ name: '001', checksum: 'a' }, { name: '002', checksum: 'EDITED' }, { name: '003', checksum: 'c' }]);
assert(r.ok === false, 'not ok');
assert(r.errors.length === 1 && r.errors[0].type === 'modified' && r.errors[0].name === '002', 'error: ' + JSON.stringify(r.errors));
assert(r.pending.join() === '003', 'later migrations can still be listed as pending');` },
    { name: "missing_file_for_applied_migration", code: `const r = planMigrations([{ name: '001', checksum: 'a' }, { name: '002', checksum: 'b' }], [{ name: '001', checksum: 'a' }]);
assert(r.ok === false && r.errors.length === 1 && r.errors[0].type === 'missing' && r.errors[0].name === '002', JSON.stringify(r.errors));
assert(r.pending.length === 0, 'nothing pending');` },
    { name: "out_of_order_migration", code: `const applied = [{ name: '001', checksum: 'a' }, { name: '003', checksum: 'c' }];
const files = [{ name: '001', checksum: 'a' }, { name: '002', checksum: 'b' }, { name: '003', checksum: 'c' }];
const r = planMigrations(applied, files);
assert(r.ok === false && r.errors.length === 1 && r.errors[0].type === 'out_of_order' && r.errors[0].name === '002', JSON.stringify(r.errors));
assert(r.pending.length === 0, 'an out-of-order migration is an error, not pending');` },
    { name: "errors_are_sorted_by_name_one_per_migration", code: `const applied = [{ name: '001', checksum: 'a' }, { name: '002', checksum: 'b' }, { name: '005', checksum: 'e' }];
const files = [{ name: '005', checksum: 'e' }, { name: '001', checksum: 'CHANGED' }, { name: '003', checksum: 'c' }, { name: '006', checksum: 'f' }];
const r = planMigrations(applied, files);
assert(r.errors.map((e) => e.type + ':' + e.name).join() === 'modified:001,missing:002,out_of_order:003', 'errors: ' + JSON.stringify(r.errors));
assert(r.pending.join() === '006', 'pending: ' + r.pending);` },
    { name: "duplicate_file_names_throw", code: `let err = null;
try { planMigrations([], [{ name: 'x', checksum: 'a' }, { name: 'x', checksum: 'b' }]); } catch (e) { err = e; }
assert(err && err.message === 'Duplicate migration: x', 'message: ' + (err && err.message));` },
    { name: "inputs_are_not_mutated_and_order_independent", code: `const applied = [{ name: 'b', checksum: '2' }, { name: 'a', checksum: '1' }];
const files = [{ name: 'c', checksum: '3' }, { name: 'a', checksum: '1' }, { name: 'b', checksum: '2' }];
const before = JSON.stringify([applied, files]);
const r = planMigrations(applied, files);
assert(JSON.stringify([applied, files]) === before, 'unchanged inputs');
assert(r.ok && r.pending.join() === 'c', 'unsorted applied list is fine');` },
  ],
  solution: {
    code: `function planMigrations(applied, files) {
  const seen = new Set();
  for (const file of files) {
    if (seen.has(file.name)) throw new Error('Duplicate migration: ' + file.name);
    seen.add(file.name);
  }
  const fileByName = new Map(files.map((f) => [f.name, f]));
  const appliedByName = new Map(applied.map((a) => [a.name, a]));
  const lastApplied = applied.map((a) => a.name).sort().pop();

  const errors = [];
  const pending = [];
  const names = [...new Set([...fileByName.keys(), ...appliedByName.keys()])].sort();
  for (const name of names) {
    const file = fileByName.get(name);
    const done = appliedByName.get(name);
    if (done && !file) errors.push({ type: 'missing', name });
    else if (done && file.checksum !== done.checksum) errors.push({ type: 'modified', name });
    else if (!done && lastApplied !== undefined && name < lastApplied) errors.push({ type: 'out_of_order', name });
    else if (!done) pending.push(name);
  }
  return { ok: errors.length === 0, pending, errors };
}

module.exports = planMigrations;`,
    explanation:
      "Because names start with timestamps, ordering is just string comparison: anything unapplied but older than the newest applied migration means history changed under you. Checksums catch edits to migrations that already ran, which would otherwise make environments silently diverge.",
  },
};
