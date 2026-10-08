export default {
  slug: "mini-redis",
  trackId: "node-dev",
  layerId: "node-dev-9",
  type: "CODE",
  difficulty: "hard",
  title: "Build a mini Redis",
  summary: "Implement strings with expiry, counters, lists, hashes, sets and sorted sets behind an execute([COMMAND, ...args]) interface.",
  description:
    "Redis is more than a cache: its data structures solve rate limiting (INCR + EXPIRE), queues (lists), leaderboards (sorted sets) and sessions (hashes). Implementing the core commands shows why each structure fits its job and how WRONGTYPE errors and key expiry work.",
  task:
    "Write <code>createRedis({ now })</code> returning <code>{ execute(command) }</code>, where <code>command</code> is an array such as <code>['SET', 'k', 'v', 'EX', 10]</code>. Command names are case-insensitive; all arguments are converted to strings; stored values are strings.",
  constraints: [
    "<strong>Strings</strong>: <code>SET key value [EX s] [PX ms] [NX] [XX]</code> returns <code>'OK'</code> (or <code>null</code> when NX/XX blocks it; any other option is <code>Error('ERR syntax error')</code>); a plain SET replaces any type and clears the TTL. <code>GET</code> (string or null), <code>DEL k...</code> and <code>EXISTS k...</code> (counts), <code>INCR DECR INCRBY DECRBY</code> (return the new number; a missing key counts as 0; a non-integer value gives <code>Error('ERR value is not an integer or out of range')</code>; the TTL is kept).",
    "<strong>Expiry</strong>: a key is gone once <code>now() &gt;= expiresAt</code>, for every type. <code>EXPIRE key s</code> returns 1 (or 0 if missing; <code>s &lt;= 0</code> deletes the key and returns 1), <code>PERSIST</code> returns 1 if a TTL was removed else 0, <code>TTL</code> returns remaining seconds rounded UP (<code>-1</code> no expiry, <code>-2</code> missing), <code>PTTL</code> milliseconds the same way. <code>TYPE</code> returns <code>string list hash set zset</code> or <code>none</code>.",
    "<strong>Lists</strong>: <code>LPUSH/RPUSH key v...</code> (pushed one by one, return the length, so <code>LPUSH k a b c</code> gives <code>c b a</code>), <code>LPOP/RPOP</code> (value or null), <code>LRANGE key start stop</code> (inclusive, negative indices count from the end, out-of-range is clamped), <code>LLEN</code>. <strong>Hashes</strong>: <code>HSET key f v [f v...]</code> (returns the number of NEW fields), <code>HGET</code>, <code>HGETALL</code> (a plain object, <code>{}</code> if missing), <code>HDEL f...</code> (count), <code>HINCRBY key f n</code>.",
    "<strong>Sets</strong>: <code>SADD</code> (count added), <code>SMEMBERS</code> (insertion order), <code>SISMEMBER</code> (1/0), <code>SREM</code> (count), <code>SCARD</code>. <strong>Sorted sets</strong>: <code>ZADD key score member [...]</code> (count of NEW members; a non-numeric score is <code>Error('ERR value is not a valid float')</code>), <code>ZSCORE</code> (number or null), <code>ZINCRBY key n member</code> (new score), <code>ZRANGE/ZREVRANGE key start stop [WITHSCORES]</code> (members ordered by score then member name; with scores it is a flat <code>[member, score, ...]</code> with NUMERIC scores), <code>ZRANK</code> (0-based or null), <code>ZREM</code> (count), <code>ZCARD</code>. A list/hash/set/zset that becomes empty is deleted.",
    "Using a command on a key of another type throws <code>Error('WRONGTYPE Operation against a key holding the wrong kind of value')</code>. An unknown command throws <code>Error(\"ERR unknown command 'name'\")</code>; the wrong number of arguments throws <code>Error(\"ERR wrong number of arguments for 'name' command\")</code> (name in lower case).",
  ],
  example: `r.execute(['ZADD', 'scores', 100, 'ann', 250, 'bob']); r.execute(['ZREVRANGE', 'scores', 0, 0]); // ['bob']`,
  tags: ["redis","data-structures","caching","queues"],
  estimatedMins: 70,
  xp: 70,
  starterFiles: [
    {
      name: "createRedis.js",
      lang: "js",
      code: `// createRedis.js
function createRedis(options = {}) {
  // your code here
}

module.exports = createRedis;`,
    },
  ],
  testFile: {
    name: "createRedis_test.js",
    lang: "test",
    code: `const createRedis = require('./createRedis');

test('set_get', () => {
  const r = createRedis({ now: () => 0 }); expect(r.execute(['SET', 'k', 'v'])).toBe('OK'); expect(r.execute(['GET', 'k'])).toBe('v');
});

test('incr', () => {
  const r = createRedis({ now: () => 0 }); expect(r.execute(['INCR', 'n'])).toBe(1); expect(r.execute(['INCR', 'n'])).toBe(2);
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep one <code>Map</code> from key to <code>{ type, value, expiresAt }</code> and a helper <code>entry(key)</code> that deletes and hides expired entries. A second helper <code>typed(key, type, create)</code> returns the entry, throws WRONGTYPE on a mismatch, and optionally creates an empty structure." },
    { order: 2, cost: 5, text: "Use a table of <code>[minArgs, maxArgs]</code> per command for arity checks in <code>execute</code>, then a <code>commands</code> object of small functions." },
    { order: 3, cost: 15, text: "After removing items from a list, hash, set or sorted set, call a <code>cleanup(key)</code> that deletes the key if the structure is empty." },
  ],
  hiddenTests: [
    { name: "set_get_del_exists", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['GET', 'missing']) === null, 'missing key');
assert(r.execute(['SET', 'a', 'x']) === 'OK' && r.execute(['SET', 'b', 5]) === 'OK', 'set');
assert(r.execute(['GET', 'a']) === 'x' && r.execute(['GET', 'b']) === '5', 'numbers are stored as strings');
assert(r.execute(['EXISTS', 'a', 'b', 'nope', 'a']) === 3, 'EXISTS counts each argument');
assert(r.execute(['DEL', 'a', 'nope', 'b']) === 2, 'DEL counts removed keys');
assert(r.execute(['EXISTS', 'a']) === 0 && r.execute(['GET', 'b']) === null, 'gone');` },
    { name: "case_insensitive_commands", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['set', 'k', 'v']) === 'OK' && r.execute(['Get', 'k']) === 'v', 'any casing');` },
    { name: "set_nx_xx_and_overwrite", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['SET', 'k', '1', 'NX']) === 'OK', 'NX on a new key');
assert(r.execute(['SET', 'k', '2', 'NX']) === null && r.execute(['GET', 'k']) === '1', 'NX on an existing key does nothing');
assert(r.execute(['SET', 'k', '3', 'XX']) === 'OK' && r.execute(['GET', 'k']) === '3', 'XX on an existing key');
assert(r.execute(['SET', 'other', '1', 'XX']) === null && r.execute(['EXISTS', 'other']) === 0, 'XX on a missing key does nothing');
assert(r.execute(['SET', 'k', '9', 'nx']) === null, 'option names are case-insensitive');
r.execute(['LPUSH', 'list', 'a']);
assert(r.execute(['SET', 'list', 'now a string']) === 'OK' && r.execute(['TYPE', 'list']) === 'string', 'SET replaces any type');` },
    { name: "set_with_expiry_and_ttl", code: `let t = 0; const r = createRedis({ now: () => t });
r.execute(['SET', 'k', 'v', 'EX', 10]);
assert(r.execute(['TTL', 'k']) === 10 && r.execute(['PTTL', 'k']) === 10000, 'initial ttl');
t = 4000;
assert(r.execute(['TTL', 'k']) === 6 && r.execute(['PTTL', 'k']) === 6000, 'after 4s');
t = 4500;
assert(r.execute(['TTL', 'k']) === 6 && r.execute(['PTTL', 'k']) === 5500, 'TTL rounds up: ' + r.execute(['TTL', 'k']));
t = 9999; assert(r.execute(['GET', 'k']) === 'v', 'still there');
t = 10000;
assert(r.execute(['GET', 'k']) === null, 'expired exactly at the deadline');
assert(r.execute(['TTL', 'k']) === -2 && r.execute(['EXISTS', 'k']) === 0, 'gone');
r.execute(['SET', 'p', 'v', 'PX', 1500]);
assert(r.execute(['PTTL', 'p']) === 1500 && r.execute(['TTL', 'p']) === 2, 'PX');` },
    { name: "ttl_special_values", code: `const r = createRedis({ now: () => 0 });
r.execute(['SET', 'k', 'v']);
assert(r.execute(['TTL', 'k']) === -1 && r.execute(['PTTL', 'k']) === -1, 'no expiry is -1');
assert(r.execute(['TTL', 'nope']) === -2 && r.execute(['PTTL', 'nope']) === -2, 'missing is -2');` },
    { name: "expire_persist_and_set_clears_ttl", code: `let t = 0; const r = createRedis({ now: () => t });
r.execute(['SET', 'k', 'v']);
assert(r.execute(['EXPIRE', 'k', 30]) === 1 && r.execute(['TTL', 'k']) === 30, 'EXPIRE');
assert(r.execute(['EXPIRE', 'nope', 30]) === 0, 'EXPIRE on a missing key');
assert(r.execute(['PERSIST', 'k']) === 1 && r.execute(['TTL', 'k']) === -1, 'PERSIST');
assert(r.execute(['PERSIST', 'k']) === 0 && r.execute(['PERSIST', 'nope']) === 0, 'nothing to persist');
r.execute(['EXPIRE', 'k', 5]);
r.execute(['SET', 'k', 'new']);
assert(r.execute(['TTL', 'k']) === -1, 'a plain SET clears the TTL');
assert(r.execute(['EXPIRE', 'k', 0]) === 1 && r.execute(['EXISTS', 'k']) === 0, 'EXPIRE with 0 deletes');` },
    { name: "expiry_applies_to_every_type", code: `let t = 0; const r = createRedis({ now: () => t });
r.execute(['RPUSH', 'l', 'a']); r.execute(['HSET', 'h', 'f', 'v']); r.execute(['SADD', 's', 'm']); r.execute(['ZADD', 'z', 1, 'm']);
for (const k of ['l', 'h', 's', 'z']) r.execute(['EXPIRE', k, 1]);
assert(['l', 'h', 's', 'z'].every((k) => r.execute(['EXISTS', k]) === 1), 'alive');
t = 1000;
assert(['l', 'h', 's', 'z'].every((k) => r.execute(['EXISTS', k]) === 0 && r.execute(['TYPE', k]) === 'none'), 'all expired');` },
    { name: "counters", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['INCR', 'n']) === 1 && r.execute(['INCR', 'n']) === 2, 'INCR from missing');
assert(r.execute(['INCRBY', 'n', 10]) === 12 && r.execute(['DECR', 'n']) === 11 && r.execute(['DECRBY', 'n', 20]) === -9, 'family');
assert(r.execute(['GET', 'n']) === '-9', 'stored as a string');
r.execute(['SET', 's', 'abc']);
let msg = null;
try { r.execute(['INCR', 's']); } catch (e) { msg = e.message; }
assert(msg === 'ERR value is not an integer or out of range', 'message: ' + msg);
r.execute(['SET', 'f', '1.5']);
let msg2 = null;
try { r.execute(['INCR', 'f']); } catch (e) { msg2 = e.message; }
assert(msg2 === 'ERR value is not an integer or out of range', 'floats are not integers');` },
    { name: "incr_keeps_the_ttl", code: `let t = 0; const r = createRedis({ now: () => t });
r.execute(['SET', 'n', '5', 'EX', 10]);
r.execute(['INCR', 'n']);
assert(r.execute(['GET', 'n']) === '6' && r.execute(['TTL', 'n']) === 10, 'TTL untouched by INCR');` },
    { name: "fixed_window_rate_limiter_pattern", code: `let t = 0; const r = createRedis({ now: () => t });
const hit = (key, limit, windowSec) => {
  const n = r.execute(['INCR', key]);
  if (n === 1) r.execute(['EXPIRE', key, windowSec]);
  return n <= limit;
};
assert(hit('rl:u1', 3, 60) && hit('rl:u1', 3, 60) && hit('rl:u1', 3, 60), 'three allowed');
assert(hit('rl:u1', 3, 60) === false, 'fourth blocked');
t = 59999; assert(hit('rl:u1', 3, 60) === false, 'still blocked inside the window');
t = 60000; assert(hit('rl:u1', 3, 60) === true, 'the key expired, so the counter restarted');` },
    { name: "type_and_wrongtype", code: `const r = createRedis({ now: () => 0 });
r.execute(['SET', 's', 'v']); r.execute(['LPUSH', 'l', 'a']); r.execute(['HSET', 'h', 'f', 'v']); r.execute(['SADD', 'st', 'm']); r.execute(['ZADD', 'z', 1, 'm']);
assert(['s', 'l', 'h', 'st', 'z', 'none'].map((k) => r.execute(['TYPE', k])).join() === 'string,list,hash,set,zset,none', 'types');
const WRONG = 'WRONGTYPE Operation against a key holding the wrong kind of value';
const msg = (cmd) => { try { r.execute(cmd); return null; } catch (e) { return e.message; } };
assert(msg(['GET', 'l']) === WRONG && msg(['INCR', 'l']) === WRONG, 'string commands on a list');
assert(msg(['LPUSH', 's', 'x']) === WRONG && msg(['LRANGE', 'h', 0, -1]) === WRONG, 'list commands on other types');
assert(msg(['HGET', 's', 'f']) === WRONG && msg(['SADD', 'z', 'x']) === WRONG && msg(['ZADD', 'st', 1, 'x']) === WRONG, 'hash, set, zset commands');
assert(msg(['GET', 'missing']) === null && msg(['LRANGE', 'missing', 0, -1]) === null, 'missing keys never raise');` },
    { name: "list_push_pop_order", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['LPUSH', 'l', 'a', 'b', 'c']) === 3, 'LPUSH returns the length');
assert(r.execute(['LRANGE', 'l', 0, -1]).join() === 'c,b,a', 'LPUSH a b c gives c b a');
assert(r.execute(['RPUSH', 'l', 'x', 'y']) === 5 && r.execute(['LRANGE', 'l', 0, -1]).join() === 'c,b,a,x,y', 'RPUSH appends');
assert(r.execute(['LPOP', 'l']) === 'c' && r.execute(['RPOP', 'l']) === 'y' && r.execute(['LLEN', 'l']) === 3, 'pops');
assert(r.execute(['LPOP', 'nope']) === null && r.execute(['RPOP', 'nope']) === null && r.execute(['LLEN', 'nope']) === 0, 'missing list');` },
    { name: "list_queue_pattern_and_empty_list_deletion", code: `const r = createRedis({ now: () => 0 });
r.execute(['RPUSH', 'jobs', 'j1', 'j2']);
assert(r.execute(['LPOP', 'jobs']) === 'j1' && r.execute(['LPOP', 'jobs']) === 'j2', 'FIFO queue: RPUSH to enqueue, LPOP to dequeue');
assert(r.execute(['LPOP', 'jobs']) === null, 'empty');
assert(r.execute(['EXISTS', 'jobs']) === 0 && r.execute(['TYPE', 'jobs']) === 'none', 'an emptied list is deleted');` },
    { name: "lrange_indexes", code: `const r = createRedis({ now: () => 0 });
r.execute(['RPUSH', 'l', 'a', 'b', 'c', 'd', 'e']);
const range = (s, e) => r.execute(['LRANGE', 'l', s, e]).join('');
assert(range(0, 1) === 'ab' && range(1, 3) === 'bcd', 'inclusive ends');
assert(range(-2, -1) === 'de' && range(0, -1) === 'abcde' && range(-3, -2) === 'cd', 'negative indexes');
assert(range(3, 100) === 'de' && range(-100, 1) === 'ab', 'clamped');
assert(range(3, 1) === '' && range(10, 20) === '' && range(0, -10) === '', 'empty ranges');` },
    { name: "hashes", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['HSET', 'u', 'name', 'Ann', 'age', 30]) === 2, 'two new fields');
assert(r.execute(['HSET', 'u', 'name', 'Anna', 'city', 'X']) === 1, 'one new, one updated');
assert(r.execute(['HGET', 'u', 'name']) === 'Anna' && r.execute(['HGET', 'u', 'age']) === '30' && r.execute(['HGET', 'u', 'zip']) === null && r.execute(['HGET', 'nope', 'f']) === null, 'HGET');
const all = r.execute(['HGETALL', 'u']);
assert(JSON.stringify(all) === '{"name":"Anna","age":"30","city":"X"}', JSON.stringify(all));
assert(JSON.stringify(r.execute(['HGETALL', 'nope'])) === '{}', 'missing is empty');
assert(r.execute(['HINCRBY', 'u', 'age', 5]) === 35 && r.execute(['HINCRBY', 'u', 'visits', 1]) === 1, 'HINCRBY');
assert(r.execute(['HDEL', 'u', 'city', 'nope']) === 1 && r.execute(['HGET', 'u', 'city']) === null, 'HDEL counts removed fields');
r.execute(['HDEL', 'u', 'name', 'age', 'visits']);
assert(r.execute(['EXISTS', 'u']) === 0, 'an emptied hash is deleted');
let msg = null;
try { r.execute(['HSET', 'x', 'f']); } catch (e) { msg = e.message; }
assert(msg === "ERR wrong number of arguments for 'hset' command", 'dangling field: ' + msg);` },
    { name: "sets", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['SADD', 's', 'a', 'b', 'a', 'c']) === 3, 'duplicates are ignored');
assert(r.execute(['SADD', 's', 'c', 'd']) === 1, 'only the new one counts');
assert(r.execute(['SMEMBERS', 's']).join() === 'a,b,c,d' && r.execute(['SCARD', 's']) === 4, 'members and size');
assert(r.execute(['SISMEMBER', 's', 'b']) === 1 && r.execute(['SISMEMBER', 's', 'z']) === 0 && r.execute(['SISMEMBER', 'nope', 'a']) === 0, 'membership');
assert(r.execute(['SREM', 's', 'a', 'zzz']) === 1 && r.execute(['SMEMBERS', 's']).join() === 'b,c,d', 'SREM');
assert(r.execute(['SMEMBERS', 'nope']).length === 0 && r.execute(['SCARD', 'nope']) === 0, 'missing set');
r.execute(['SREM', 's', 'b', 'c', 'd']);
assert(r.execute(['EXISTS', 's']) === 0, 'emptied set is deleted');` },
    { name: "sorted_set_leaderboard", code: `const r = createRedis({ now: () => 0 });
assert(r.execute(['ZADD', 'lb', 100, 'alice', 250, 'bob', 175, 'carol']) === 3, 'three new members');
assert(r.execute(['ZRANGE', 'lb', 0, -1]).join() === 'alice,carol,bob', 'ascending by score');
assert(r.execute(['ZREVRANGE', 'lb', 0, 1]).join() === 'bob,carol', 'top two');
assert(r.execute(['ZSCORE', 'lb', 'carol']) === 175 && r.execute(['ZSCORE', 'lb', 'nobody']) === null && r.execute(['ZSCORE', 'nope', 'x']) === null, 'ZSCORE returns a number or null');
assert(r.execute(['ZRANK', 'lb', 'alice']) === 0 && r.execute(['ZRANK', 'lb', 'bob']) === 2 && r.execute(['ZRANK', 'lb', 'nobody']) === null, 'ZRANK');
assert(r.execute(['ZCARD', 'lb']) === 3, 'ZCARD');
assert(r.execute(['ZINCRBY', 'lb', 100, 'alice']) === 200 && r.execute(['ZINCRBY', 'lb', 5, 'dave']) === 5, 'ZINCRBY updates or creates');
assert(r.execute(['ZREVRANGE', 'lb', 0, 0]).join() === 'bob' && r.execute(['ZRANGE', 'lb', 0, 0]).join() === 'dave', 'order follows scores');` },
    { name: "sorted_set_withscores_updates_and_ties", code: `const r = createRedis({ now: () => 0 });
r.execute(['ZADD', 'z', 5, 'b', 5, 'a', 1, 'z', 5, 'c']);
assert(r.execute(['ZRANGE', 'z', 0, -1]).join() === 'z,a,b,c', 'ties are ordered by member name');
const withScores = r.execute(['ZRANGE', 'z', 0, 1, 'WITHSCORES']);
assert(JSON.stringify(withScores) === '["z",1,"a",5]', 'flat member/score pairs with numeric scores: ' + JSON.stringify(withScores));
assert(JSON.stringify(r.execute(['ZREVRANGE', 'z', 0, 0, 'withscores'])) === '["c",5]', 'ZREVRANGE with scores');
assert(r.execute(['ZADD', 'z', 9, 'z', 2, 'new']) === 1, 'updating an existing member does not count as new');
assert(r.execute(['ZSCORE', 'z', 'z']) === 9 && r.execute(['ZRANGE', 'z', -1, -1]).join() === 'z', 'score updated and reordered');
assert(r.execute(['ZADD', 'f', 1.5, 'x']) === 1 && r.execute(['ZSCORE', 'f', 'x']) === 1.5, 'float scores');
assert(r.execute(['ZRANK', 'z', 'b']) === 2, 'rank before removal (new, a, b, c, z)');
assert(r.execute(['ZREM', 'z', 'a', 'nope']) === 1 && r.execute(['ZRANK', 'z', 'b']) === 1, 'ZREM then ranks shift');
r.execute(['ZREM', 'f', 'x']);
assert(r.execute(['EXISTS', 'f']) === 0, 'emptied zset is deleted');` },
    { name: "sorted_set_errors", code: `const r = createRedis({ now: () => 0 });
const msg = (cmd) => { try { r.execute(cmd); return null; } catch (e) { return e.message; } };
assert(msg(['ZADD', 'z', 'abc', 'm']) === 'ERR value is not a valid float', 'bad score: ' + msg(['ZADD', 'z', 'abc', 'm']));
assert(msg(['ZADD', 'z', 1, 'm', 2]) === 'ERR syntax error' || msg(['ZADD', 'z', 1, 'm', 2]) === "ERR wrong number of arguments for 'zadd' command", 'dangling score');
assert(r.execute(['EXISTS', 'z']) === 0, 'failed ZADD creates nothing');
r.execute(['ZADD', 'z', 1, 'm']);
assert(msg(['ZRANGE', 'z', 0, -1, 'SCORES']) === 'ERR syntax error', 'unknown option');` },
    { name: "unknown_commands_and_arity", code: `const r = createRedis({ now: () => 0 });
const msg = (cmd) => { try { r.execute(cmd); return null; } catch (e) { return e.message; } };
assert(msg(['FLY', 'x']) === "ERR unknown command 'FLY'", 'unknown: ' + msg(['FLY', 'x']));
assert(msg(['GET']) === "ERR wrong number of arguments for 'get' command", 'too few');
assert(msg(['GET', 'a', 'b']) === "ERR wrong number of arguments for 'get' command", 'too many');
assert(msg(['SET', 'a']) === "ERR wrong number of arguments for 'set' command", 'SET needs a value');
assert(msg(['LRANGE', 'l', 0]) === "ERR wrong number of arguments for 'lrange' command", 'LRANGE needs 3');
assert(msg(['DEL']) === "ERR wrong number of arguments for 'del' command", 'DEL needs a key');
assert(msg(['set', 'a', 'b', 'EX']) !== null, 'EX without a value is an error');` },
    { name: "a_failed_command_changes_nothing", code: `const r = createRedis({ now: () => 0 });
r.execute(['SET', 's', 'abc']);
try { r.execute(['INCR', 's']); } catch (e) {}
assert(r.execute(['GET', 's']) === 'abc', 'the value is untouched');
try { r.execute(['LPUSH', 's', 'x']); } catch (e) {}
assert(r.execute(['TYPE', 's']) === 'string', 'type unchanged');` },
    { name: "instances_are_independent", code: `const a = createRedis({ now: () => 0 }); const b = createRedis({ now: () => 0 });
a.execute(['SET', 'k', 'v']);
assert(b.execute(['GET', 'k']) === null, 'separate stores');` },
  ],
  solution: {
    code: `function createRedis({ now = () => Date.now() } = {}) {
  const WRONGTYPE = 'WRONGTYPE Operation against a key holding the wrong kind of value';
  const store = new Map();
  const fail = (message) => {
    throw new Error(message);
  };

  function entry(key) {
    const e = store.get(key);
    if (e && e.expiresAt !== null && now() >= e.expiresAt) {
      store.delete(key);
      return undefined;
    }
    return e;
  }

  function typed(key, type, create) {
    const e = entry(key);
    if (e) {
      if (e.type !== type) fail(WRONGTYPE);
      return e;
    }
    if (!create) return undefined;
    const value = type === 'list' ? [] : type === 'set' ? new Set() : new Map();
    const created = { type, value, expiresAt: null };
    store.set(key, created);
    return created;
  }

  function cleanup(key) {
    const e = store.get(key);
    if (!e || e.type === 'string') return;
    const empty = e.type === 'list' ? e.value.length === 0 : e.value.size === 0;
    if (empty) store.delete(key);
  }

  function int(text) {
    const n = Number(text);
    if (String(text).trim() === '' || !Number.isInteger(n)) fail('ERR value is not an integer or out of range');
    return n;
  }

  function incrBy(key, delta) {
    const e = typed(key, 'string', false);
    const next = (e ? int(e.value) : 0) + delta;
    if (e) e.value = String(next);
    else store.set(key, { type: 'string', value: String(next), expiresAt: null });
    return next;
  }

  function span(length, start, stop) {
    const s = Math.max(start < 0 ? length + start : start, 0);
    const e = Math.min(stop < 0 ? length + stop : stop, length - 1);
    return s > e ? [] : [s, e];
  }

  const byScore = (zset) =>
    [...zset].sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  function zrange(args, reverse) {
    const [key, start, stop, option] = args;
    if (option !== undefined && option.toUpperCase() !== 'WITHSCORES') fail('ERR syntax error');
    const e = typed(key, 'zset', false);
    if (!e) return [];
    const sorted = byScore(e.value);
    if (reverse) sorted.reverse();
    const range = span(sorted.length, int(start), int(stop));
    if (range.length === 0) return [];
    const slice = sorted.slice(range[0], range[1] + 1);
    return option === undefined ? slice.map(([m]) => m) : slice.flat();
  }

  const commands = {
    set([key, value, ...opts]) {
      let ttl = null;
      let nx = false;
      let xx = false;
      for (let i = 0; i < opts.length; i++) {
        const option = opts[i].toUpperCase();
        if (option === 'EX') ttl = int(opts[++i]) * 1000;
        else if (option === 'PX') ttl = int(opts[++i]);
        else if (option === 'NX') nx = true;
        else if (option === 'XX') xx = true;
        else fail('ERR syntax error');
      }
      const exists = entry(key) !== undefined;
      if ((nx && exists) || (xx && !exists)) return null;
      store.set(key, { type: 'string', value, expiresAt: ttl === null ? null : now() + ttl });
      return 'OK';
    },
    get([key]) {
      const e = typed(key, 'string', false);
      return e ? e.value : null;
    },
    del(keys) {
      return keys.filter((k) => entry(k) !== undefined && store.delete(k)).length;
    },
    exists(keys) {
      return keys.filter((k) => entry(k) !== undefined).length;
    },
    incr: ([key]) => incrBy(key, 1),
    decr: ([key]) => incrBy(key, -1),
    incrby: ([key, n]) => incrBy(key, int(n)),
    decrby: ([key, n]) => incrBy(key, -int(n)),
    expire([key, seconds]) {
      const e = entry(key);
      if (!e) return 0;
      const s = int(seconds);
      if (s <= 0) store.delete(key);
      else e.expiresAt = now() + s * 1000;
      return 1;
    },
    persist([key]) {
      const e = entry(key);
      if (!e || e.expiresAt === null) return 0;
      e.expiresAt = null;
      return 1;
    },
    ttl([key]) {
      const e = entry(key);
      if (!e) return -2;
      return e.expiresAt === null ? -1 : Math.ceil((e.expiresAt - now()) / 1000);
    },
    pttl([key]) {
      const e = entry(key);
      if (!e) return -2;
      return e.expiresAt === null ? -1 : e.expiresAt - now();
    },
    type([key]) {
      const e = entry(key);
      return e ? e.type : 'none';
    },
    lpush([key, ...values]) {
      const e = typed(key, 'list', true);
      for (const v of values) e.value.unshift(v);
      return e.value.length;
    },
    rpush([key, ...values]) {
      const e = typed(key, 'list', true);
      for (const v of values) e.value.push(v);
      return e.value.length;
    },
    lpop([key]) {
      const e = typed(key, 'list', false);
      if (!e) return null;
      const v = e.value.shift();
      cleanup(key);
      return v;
    },
    rpop([key]) {
      const e = typed(key, 'list', false);
      if (!e) return null;
      const v = e.value.pop();
      cleanup(key);
      return v;
    },
    lrange([key, start, stop]) {
      const e = typed(key, 'list', false);
      if (!e) return [];
      const range = span(e.value.length, int(start), int(stop));
      return range.length === 0 ? [] : e.value.slice(range[0], range[1] + 1);
    },
    llen([key]) {
      const e = typed(key, 'list', false);
      return e ? e.value.length : 0;
    },
    hset([key, ...pairs]) {
      if (pairs.length % 2 !== 0) fail("ERR wrong number of arguments for 'hset' command");
      const e = typed(key, 'hash', true);
      let added = 0;
      for (let i = 0; i < pairs.length; i += 2) {
        if (!e.value.has(pairs[i])) added++;
        e.value.set(pairs[i], pairs[i + 1]);
      }
      return added;
    },
    hget([key, field]) {
      const e = typed(key, 'hash', false);
      return e && e.value.has(field) ? e.value.get(field) : null;
    },
    hgetall([key]) {
      const e = typed(key, 'hash', false);
      return e ? Object.fromEntries(e.value) : {};
    },
    hdel([key, ...fields]) {
      const e = typed(key, 'hash', false);
      if (!e) return 0;
      const removed = fields.filter((f) => e.value.delete(f)).length;
      cleanup(key);
      return removed;
    },
    hincrby([key, field, delta]) {
      const e = typed(key, 'hash', true);
      const next = (e.value.has(field) ? int(e.value.get(field)) : 0) + int(delta);
      e.value.set(field, String(next));
      return next;
    },
    sadd([key, ...members]) {
      const e = typed(key, 'set', true);
      let added = 0;
      for (const m of members) {
        if (!e.value.has(m)) {
          e.value.add(m);
          added++;
        }
      }
      return added;
    },
    smembers([key]) {
      const e = typed(key, 'set', false);
      return e ? [...e.value] : [];
    },
    sismember([key, member]) {
      const e = typed(key, 'set', false);
      return e && e.value.has(member) ? 1 : 0;
    },
    srem([key, ...members]) {
      const e = typed(key, 'set', false);
      if (!e) return 0;
      const removed = members.filter((m) => e.value.delete(m)).length;
      cleanup(key);
      return removed;
    },
    scard([key]) {
      const e = typed(key, 'set', false);
      return e ? e.value.size : 0;
    },
    zadd([key, ...pairs]) {
      if (pairs.length % 2 !== 0) fail('ERR syntax error');
      for (let i = 0; i < pairs.length; i += 2) {
        if (pairs[i].trim() === '' || !Number.isFinite(Number(pairs[i]))) fail('ERR value is not a valid float');
      }
      const e = typed(key, 'zset', true);
      let added = 0;
      for (let i = 0; i < pairs.length; i += 2) {
        if (!e.value.has(pairs[i + 1])) added++;
        e.value.set(pairs[i + 1], Number(pairs[i]));
      }
      return added;
    },
    zscore([key, member]) {
      const e = typed(key, 'zset', false);
      return e && e.value.has(member) ? e.value.get(member) : null;
    },
    zincrby([key, delta, member]) {
      if (!Number.isFinite(Number(delta))) fail('ERR value is not a valid float');
      const e = typed(key, 'zset', true);
      const next = (e.value.get(member) || 0) + Number(delta);
      e.value.set(member, next);
      return next;
    },
    zrange: (args) => zrange(args, false),
    zrevrange: (args) => zrange(args, true),
    zrank([key, member]) {
      const e = typed(key, 'zset', false);
      if (!e || !e.value.has(member)) return null;
      return byScore(e.value).findIndex(([m]) => m === member);
    },
    zrem([key, ...members]) {
      const e = typed(key, 'zset', false);
      if (!e) return 0;
      const removed = members.filter((m) => e.value.delete(m)).length;
      cleanup(key);
      return removed;
    },
    zcard([key]) {
      const e = typed(key, 'zset', false);
      return e ? e.value.size : 0;
    },
  };

  const ARITY = {
    set: [2, Infinity], get: [1, 1], del: [1, Infinity], exists: [1, Infinity],
    incr: [1, 1], decr: [1, 1], incrby: [2, 2], decrby: [2, 2],
    expire: [2, 2], persist: [1, 1], ttl: [1, 1], pttl: [1, 1], type: [1, 1],
    lpush: [2, Infinity], rpush: [2, Infinity], lpop: [1, 1], rpop: [1, 1], lrange: [3, 3], llen: [1, 1],
    hset: [3, Infinity], hget: [2, 2], hgetall: [1, 1], hdel: [2, Infinity], hincrby: [3, 3],
    sadd: [2, Infinity], smembers: [1, 1], sismember: [2, 2], srem: [2, Infinity], scard: [1, 1],
    zadd: [3, Infinity], zscore: [2, 2], zincrby: [3, 3], zrange: [3, 4], zrevrange: [3, 4],
    zrank: [2, 2], zrem: [2, Infinity], zcard: [1, 1],
  };

  return {
    execute(command) {
      const [rawName, ...rest] = command;
      const name = String(rawName).toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(commands, name)) fail("ERR unknown command '" + rawName + "'");
      const [min, max] = ARITY[name];
      if (rest.length < min || rest.length > max) fail("ERR wrong number of arguments for '" + name + "' command");
      return commands[name](rest.map(String));
    },
  };
}

module.exports = createRedis;`,
    explanation:
      "Each Redis type is a different JavaScript structure inside one Map, with typed() enforcing WRONGTYPE. Expiry is lazy: every access goes through entry(), which deletes keys whose deadline has passed. INCR plus EXPIRE on a counter is the standard fixed-window rate limiter, and sorted sets keep a leaderboard ordered without any sorting code in the caller.",
  },
};
