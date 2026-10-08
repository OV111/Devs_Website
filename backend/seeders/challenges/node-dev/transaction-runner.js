export default {
  slug: "transaction-runner",
  trackId: "node-dev",
  layerId: "node-dev-5",
  type: "CODE",
  difficulty: "hard",
  title: "Transactions with rollback and unique constraints",
  summary: "An in-memory database whose $transaction commits on success and rolls back on error, with Prisma-style error codes.",
  description:
    "A transaction groups several writes so they succeed or fail together. Prisma's interactive <code>$transaction(async (tx) =&gt; ...)</code> commits when your callback returns and rolls back when it throws. Writing the mechanism shows isolation, atomic multi-step writes, and a surprising fact: auto-increment ids are not rolled back.",
  task:
    "Write <code>createDb({ tables })</code>, where <code>tables</code> maps a table name to <code>{ unique?: [fields] }</code>. The db has <code>create(table, values)</code>, <code>update(table, id, patch)</code>, <code>delete(table, id)</code>, <code>findById(table, id)</code>, <code>findMany(table, predicate?)</code> and <code>$transaction(fn)</code>.",
  constraints: [
    "<code>create</code> assigns <code>id</code> from a per-table counter starting at 1 and returns a COPY of the record; all reads and writes return copies so callers can't mutate the store.",
    "A write that would give two rows the same value in a <code>unique</code> field throws an <code>Error</code> with <code>code: 'P2002'</code> and <code>meta: { target: [field] }</code> (checked on create and on update against OTHER rows; <code>undefined</code> values are ignored). <code>update</code>/<code>delete</code> of a missing id throws an <code>Error</code> with <code>code: 'P2025'</code>.",
    "<code>findById</code> returns the record or <code>null</code>; <code>findMany</code> returns all rows (filtered by the optional predicate) in insertion order.",
    "<code>$transaction(fn)</code> calls <code>fn(tx)</code> where <code>tx</code> has the same CRUD methods working on a private copy of the data. If <code>fn</code> resolves, the copy becomes the committed data and its result is returned; if it throws or rejects, everything it did is discarded and the error is rethrown. Reads on the main <code>db</code> during a transaction see only committed data; <code>tx</code> sees its own writes.",
    "Transactions run one at a time in call order (a second <code>$transaction</code> waits for the first). Id counters are NOT rolled back: ids used inside a rolled-back transaction are never reused.",
  ],
  example: `await db.$transaction(async (tx) => { const u = tx.create('users', { email: 'a@x.io' }); tx.create('posts', { authorId: u.id }); });`,
  tags: ["prisma","transactions","postgres","acid"],
  estimatedMins: 55,
  xp: 70,
  starterFiles: [
    {
      name: "createDb.js",
      lang: "js",
      code: `// createDb.js
function createDb(options) {
  // your code here
}

module.exports = createDb;`,
    },
  ],
  testFile: {
    name: "createDb_test.js",
    lang: "test",
    code: `const createDb = require('./createDb');

test('create_and_find', () => {
  const db = createDb({ tables: { users: {} } }); const u = db.create('users', { name: 'A' }); expect(u.id).toBe(1); expect(db.findById('users', 1).name).toBe('A');
});

test('unique', () => {
  const db = createDb({ tables: { users: { unique: ['email'] } } }); db.create('users', { email: 'a' }); expect(() => db.create('users', { email: 'a' })).toThrow();
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep the committed data in one variable (<code>{ table: rows[] }</code>) and write a function <code>ops(getData)</code> that returns the CRUD methods bound to whichever data object you give it; the db uses the committed data, a transaction uses its clone." },
    { order: 2, cost: 5, text: "Id counters live OUTSIDE the data that gets cloned and restored, which is why rollbacks leave gaps (just like Postgres sequences)." },
    { order: 3, cost: 15, text: "Serialize transactions with a promise chain: <code>const run = tail.then(() =&gt; ...); tail = run.catch(() =&gt; {})</code>." },
  ],
  hiddenTests: [
    { name: "create_assigns_ids_per_table_and_returns_copies", code: `const db = createDb({ tables: { users: {}, posts: {} } });
const u1 = db.create('users', { name: 'A' }); const u2 = db.create('users', { name: 'B' }); const p1 = db.create('posts', { title: 'T' });
assert(u1.id === 1 && u2.id === 2 && p1.id === 1, 'counters are per table');
u1.name = 'tampered';
assert(db.findById('users', 1).name === 'A', 'mutating a returned record does not change the store');` },
    { name: "find_by_id_and_find_many", code: `const db = createDb({ tables: { users: {} } });
db.create('users', { name: 'A', age: 10 }); db.create('users', { name: 'B', age: 30 }); db.create('users', { name: 'C', age: 50 });
assert(db.findById('users', 2).name === 'B' && db.findById('users', 99) === null, 'findById');
assert(db.findMany('users').map((u) => u.name).join('') === 'ABC', 'all in insertion order');
assert(db.findMany('users', (u) => u.age > 20).map((u) => u.name).join('') === 'BC', 'predicate');` },
    { name: "update_and_delete", code: `const db = createDb({ tables: { users: {} } });
const u = db.create('users', { name: 'A', age: 1 });
const updated = db.update('users', u.id, { age: 2 });
assert(updated.age === 2 && updated.name === 'A' && updated.id === 1, 'patch merges, id preserved');
assert(db.findById('users', 1).age === 2, 'stored');
const gone = db.delete('users', 1);
assert(gone.name === 'A' && db.findById('users', 1) === null, 'deleted and returned');` },
    { name: "missing_records_throw_P2025", code: `const db = createDb({ tables: { users: {} } });
let e1 = null; let e2 = null;
try { db.update('users', 9, { a: 1 }); } catch (e) { e1 = e; }
try { db.delete('users', 9); } catch (e) { e2 = e; }
assert(e1 && e1.code === 'P2025' && e2 && e2.code === 'P2025', 'codes: ' + (e1 && e1.code) + ',' + (e2 && e2.code));` },
    { name: "unique_violations_throw_P2002", code: `const db = createDb({ tables: { users: { unique: ['email'] } } });
db.create('users', { email: 'a@x.io', name: 'A' });
let err = null;
try { db.create('users', { email: 'a@x.io', name: 'B' }); } catch (e) { err = e; }
assert(err && err.code === 'P2002' && err.meta.target.join() === 'email', 'create: ' + (err && err.code));
assert(db.findMany('users').length === 1, 'nothing was inserted');
const b = db.create('users', { email: 'b@x.io' });
let err2 = null;
try { db.update('users', b.id, { email: 'a@x.io' }); } catch (e) { err2 = e; }
assert(err2 && err2.code === 'P2002', 'update to an existing value');
assert(db.update('users', b.id, { email: 'b@x.io' }).email === 'b@x.io', 'keeping your own value is fine');
db.create('users', { name: 'no email' }); db.create('users', { name: 'also no email' });
assert(db.findMany('users').length === 4, 'missing unique values never collide');` },
    { name: "transaction_commit_returns_value_and_applies_changes", code: `const db = createDb({ tables: { users: {}, posts: {} } });
const result = await db.$transaction(async (tx) => {
  const u = tx.create('users', { name: 'A' });
  tx.create('posts', { authorId: u.id });
  return 'done:' + u.id;
});
assert(result === 'done:1', 'result: ' + result);
assert(db.findMany('users').length === 1 && db.findMany('posts').length === 1, 'both writes committed');` },
    { name: "transaction_rolls_back_everything_on_error", code: `const db = createDb({ tables: { users: {} } });
db.create('users', { name: 'existing' });
let err = null;
try {
  await db.$transaction(async (tx) => {
    tx.create('users', { name: 'new' });
    tx.update('users', 1, { name: 'changed' });
    tx.delete('users', 1);
    throw new Error('boom');
  });
} catch (e) { err = e; }
assert(err && err.message === 'boom', 'the original error is rethrown');
const rows = db.findMany('users');
assert(rows.length === 1 && rows[0].name === 'existing', 'create, update and delete were all discarded: ' + JSON.stringify(rows));` },
    { name: "failure_in_a_later_step_undoes_earlier_steps", code: `const db = createDb({ tables: { users: { unique: ['email'] }, profiles: {} } });
db.create('users', { email: 'taken@x.io' });
let err = null;
try {
  await db.$transaction(async (tx) => {
    tx.create('profiles', { bio: 'hello' });
    tx.create('users', { email: 'taken@x.io' });
  });
} catch (e) { err = e; }
assert(err && err.code === 'P2002', 'second write fails');
assert(db.findMany('profiles').length === 0, 'the first write was rolled back, so no orphan profile');` },
    { name: "transaction_sees_its_own_writes_but_outsiders_do_not", code: `const db = createDb({ tables: { users: {} } });
let outsideDuring = null; let insideDuring = null;
await db.$transaction(async (tx) => {
  const u = tx.create('users', { name: 'A' });
  insideDuring = tx.findById('users', u.id);
  await new Promise((r) => setTimeout(r, 5));
  outsideDuring = db.findMany('users').length;
});
assert(insideDuring && insideDuring.name === 'A', 'tx reads its own write');
assert(outsideDuring === 0, 'uncommitted data is invisible outside: ' + outsideDuring);
assert(db.findMany('users').length === 1, 'visible after commit');` },
    { name: "ids_are_not_reused_after_rollback", code: `const db = createDb({ tables: { users: {} } });
try { await db.$transaction(async (tx) => { tx.create('users', {}); tx.create('users', {}); throw new Error('x'); }); } catch (e) {}
const next = db.create('users', {});
assert(next.id === 3, 'ids 1 and 2 were consumed by the rolled-back transaction, got ' + next.id);` },
    { name: "concurrent_transactions_run_one_at_a_time", code: `const db = createDb({ tables: { counters: {} } });
db.create('counters', { n: 0 });
const increment = () => db.$transaction(async (tx) => {
  const c = tx.findById('counters', 1);
  await new Promise((r) => setTimeout(r, 2));
  tx.update('counters', 1, { n: c.n + 1 });
});
await Promise.all([increment(), increment(), increment(), increment(), increment()]);
assert(db.findById('counters', 1).n === 5, 'serialized read-modify-write, got ' + db.findById('counters', 1).n);` },
    { name: "a_failed_transaction_does_not_block_the_next", code: `const db = createDb({ tables: { users: {} } });
const p1 = db.$transaction(async () => { throw new Error('first fails'); });
const p2 = db.$transaction(async (tx) => { tx.create('users', { name: 'ok' }); return 'second'; });
let err = null;
try { await p1; } catch (e) { err = e; }
assert(err && err.message === 'first fails', 'first rejects');
assert(await p2 === 'second' && db.findMany('users').length === 1, 'second still runs and commits');` },
    { name: "transaction_copy_is_isolated_from_mutation", code: `const db = createDb({ tables: { users: {} } });
db.create('users', { name: 'A' });
await db.$transaction(async (tx) => {
  const u = tx.findById('users', 1);
  u.name = 'mutated locally';
});
assert(db.findById('users', 1).name === 'A', 'mutating a returned copy never writes through');` },
  ],
  solution: {
    code: `function createDb({ tables }) {
  const counters = {};
  let committed = {};
  for (const name of Object.keys(tables)) {
    committed[name] = [];
    counters[name] = 0;
  }
  let tail = Promise.resolve();

  const clone = (data) =>
    Object.fromEntries(Object.entries(data).map(([table, rows]) => [table, rows.map((r) => ({ ...r }))]));

  const fail = (code, message, meta) => {
    const err = new Error(message);
    err.code = code;
    if (meta) err.meta = meta;
    return err;
  };

  function ops(getData) {
    const checkUnique = (table, values, exceptId) => {
      for (const field of (tables[table] && tables[table].unique) || []) {
        if (values[field] === undefined) continue;
        const clash = getData()[table].some((r) => r.id !== exceptId && r[field] === values[field]);
        if (clash) {
          throw fail('P2002', 'Unique constraint failed on the fields: (' + field + ')', { target: [field] });
        }
      }
    };
    return {
      create(table, values) {
        checkUnique(table, values, undefined);
        const record = { ...values, id: ++counters[table] };
        getData()[table].push(record);
        return { ...record };
      },
      update(table, id, patch) {
        const row = getData()[table].find((r) => r.id === id);
        if (!row) throw fail('P2025', 'Record to update not found.');
        checkUnique(table, patch, id);
        Object.assign(row, patch, { id });
        return { ...row };
      },
      delete(table, id) {
        const rows = getData()[table];
        const index = rows.findIndex((r) => r.id === id);
        if (index === -1) throw fail('P2025', 'Record to delete does not exist.');
        const [removed] = rows.splice(index, 1);
        return { ...removed };
      },
      findById(table, id) {
        const row = getData()[table].find((r) => r.id === id);
        return row ? { ...row } : null;
      },
      findMany(table, predicate = () => true) {
        return getData()[table].filter(predicate).map((r) => ({ ...r }));
      },
    };
  }

  const db = ops(() => committed);
  db.$transaction = (fn) => {
    const run = tail.then(async () => {
      const working = clone(committed);
      const result = await fn(ops(() => working));
      committed = working;
      return result;
    });
    tail = run.catch(() => {});
    return run;
  };
  return db;
}

module.exports = createDb;`,
    explanation:
      "A transaction is just 'work on a copy, then swap it in if nothing threw'. Counters live outside the copied data, so rolled-back inserts leave gaps in ids, exactly like database sequences. Chaining transactions onto one promise keeps read-modify-write sequences from interleaving.",
  },
};
