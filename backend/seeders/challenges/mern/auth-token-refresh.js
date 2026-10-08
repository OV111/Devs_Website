export default {
  slug: "auth-token-refresh",
  trackId: "mern",
  layerId: "mern-8",
  type: "CODE",
  difficulty: "hard",
  title: "Client auth: attach token, refresh once on 401",
  summary: "A fetch wrapper that sends the access token, and on 401 refreshes it a single time for all concurrent requests, then retries.",
  description:
    "Access tokens expire. A real client wrapper must attach the token, notice a 401, get a new token, and retry, without firing ten refresh calls when ten requests fail at once (refresh tokens are often single-use), and without looping forever.",
  task:
    "Write <code>createAuthFetch({ fetchFn, getToken, refreshToken, onLogout })</code> returning <code>request(url, options = {})</code>.",
  constraints: [
    "Call <code>fetchFn(url, { ...options, headers })</code> with <code>Authorization: 'Bearer ' + getToken()</code> merged into the given headers (no header at all if there is no token). Any response whose <code>status !== 401</code> is returned as is.",
    "On a 401: <code>refreshToken()</code> (async, returns the new token and stores it so <code>getToken()</code> returns it) is called ONCE no matter how many requests got a 401 at the same time. All of them wait for it, then retry their request once with the new token and return the retry's response, even if it is a 401 again (no loops).",
    "If, when a 401 arrives, <code>getToken()</code> already differs from the token that request was sent with (another request already refreshed), do not refresh again: just retry with the current token.",
    "If <code>refreshToken()</code> rejects: call <code>onLogout()</code> exactly once for that refresh, and reject every waiting request with <code>Error('Session expired')</code> whose <code>cause</code> is the refresh error.",
    "After a refresh settles (success or failure) a later 401 may trigger a new refresh.",
  ],
  example: `const api = createAuthFetch({ fetchFn: fetch, getToken, refreshToken, onLogout: () => router.push('/login') });`,
  tags: ["auth","jwt","refresh-tokens","concurrency"],
  estimatedMins: 50,
  xp: 70,
  starterFiles: [
    {
      name: "createAuthFetch.js",
      lang: "js",
      code: `// createAuthFetch.js
function createAuthFetch(options) {
  // your code here
}

module.exports = createAuthFetch;`,
    },
  ],
  testFile: {
    name: "createAuthFetch_test.js",
    lang: "test",
    code: `const createAuthFetch = require('./createAuthFetch');

test('attaches_token', () => {
  const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk((a) => a === 'Bearer t0'); return h.request('/x').then((r) => { expect(r.status).toBe(200); expect(h.calls[0]).toBe('Bearer t0'); });
});

test('refreshes', () => {
  const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk((a) => a === 'Bearer t1'); return h.request('/x').then((r) => { expect(r.status).toBe(200); expect(h.stats().refreshes).toBe(1); });
});`,
  },
  hints: [
    { order: 1, cost: 0, text: "Keep a module-level <code>refreshing</code> variable holding the in-flight refresh promise. A helper <code>refreshOnce()</code> creates it if null (and clears it in both the success and failure handlers) and otherwise returns the existing one." },
    { order: 2, cost: 5, text: "Remember which token each request used. After a 401, if <code>getToken()</code> is already a different token, skip the refresh and retry with the current one." },
    { order: 3, cost: 15, text: "Call <code>onLogout()</code> inside the shared refresh promise's rejection handler (so it runs once), and have each waiting request convert the failure into <code>Error('Session expired')</code> with the original error as <code>cause</code>." },
  ],
  hiddenTests: [
    { name: "adds_authorization_header_and_keeps_other_headers", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const seen = [];
const request = createAuthFetch({ fetchFn: async (url, o) => { seen.push(o); return { status: 200 }; }, getToken: () => 'abc', refreshToken: async () => 'x', onLogout() {} });
await request('/x', { method: 'POST', headers: { 'X-A': '1' }, body: 'b' });
assert(seen[0].headers.Authorization === 'Bearer abc' && seen[0].headers['X-A'] === '1', 'headers: ' + JSON.stringify(seen[0].headers));
assert(seen[0].method === 'POST' && seen[0].body === 'b', 'other options pass through');` },
    { name: "no_token_means_no_header", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const seen = [];
const request = createAuthFetch({ fetchFn: async (url, o) => { seen.push(o.headers); return { status: 200 }; }, getToken: () => null, refreshToken: async () => 'x', onLogout() {} });
await request('/x');
assert(!('Authorization' in (seen[0] || {})), 'no Authorization header');` },
    { name: "non_401_responses_pass_through_without_refresh", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk(() => true);
const r = await h.request('/x');
assert(r.status === 200 && h.stats().refreshes === 0, 'no refresh for success');
const request = createAuthFetch({ fetchFn: async () => ({ status: 500 }), getToken: () => 't', refreshToken: async () => { throw new Error('must not be called'); }, onLogout() {} });
assert((await request('/x')).status === 500, '500 is returned, not retried');` },
    { name: "refreshes_and_retries_with_the_new_token", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk((a) => a === 'Bearer t1');
const r = await h.request('/x');
assert(r.status === 200, 'retry succeeded');
assert(h.calls.join(',') === 'Bearer t0,Bearer t1', 'first with the old token, retry with the new: ' + h.calls);
assert(h.stats().refreshes === 1, 'one refresh');` },
    { name: "concurrent_401s_share_one_refresh", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk((a) => a === 'Bearer t1');
const results = await Promise.all([h.request('/a'), h.request('/b'), h.request('/c')]);
assert(results.every((r) => r.status === 200), 'all three succeed after the retry');
assert(h.stats().refreshes === 1, 'exactly one refresh for three failures, got ' + h.stats().refreshes);
assert(h.calls.filter((c) => c === 'Bearer t1').length === 3, 'each retried once with the new token: ' + h.calls);` },
    { name: "retry_that_is_still_401_is_returned_without_looping", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk(() => false);
const r = await h.request('/x');
assert(r.status === 401, 'the retried 401 is returned');
assert(h.stats().refreshes === 1 && h.calls.length === 2, 'one refresh and exactly two attempts: ' + h.calls.length);
assert(h.stats().logouts === 0, 'not a logout');` },
    { name: "late_401_with_an_outdated_token_does_not_refresh_again", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const calls = []; let token = 't0'; let refreshes = 0;
const fetchFn = async (url, o) => {
  const auth = o.headers.Authorization; calls.push(url + ':' + auth);
  await new Promise((r) => setTimeout(r, url === '/slow' ? 40 : 1));
  return { status: auth === 'Bearer t1' ? 200 : 401 };
};
const refreshToken = async () => { refreshes++; await new Promise((r) => setTimeout(r, 5)); token = 't1'; return 't1'; };
const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout() {} });
const [fast, slow] = await Promise.all([request('/fast'), request('/slow')]);
assert(fast.status === 200 && slow.status === 200, 'both end up fine');
assert(refreshes === 1, 'the slow request saw token t1 already in place, so no second refresh: ' + refreshes);
assert(calls.includes('/slow:Bearer t1'), 'and was retried with it: ' + calls);` },
    { name: "later_requests_use_the_new_token_directly", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk((a) => a === 'Bearer t1');
await h.request('/a');
const before = h.calls.length;
const r = await h.request('/b');
assert(r.status === 200 && h.calls.length === before + 1 && h.calls[before] === 'Bearer t1', 'no extra 401 round trip');
assert(h.stats().refreshes === 1, 'still one refresh');` },
    { name: "a_second_refresh_cycle_works_later", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
let valid = 'Bearer t1';
const h = mk((a) => a === valid);
await h.request('/a');
valid = 'Bearer t2';
const r = await h.request('/b');
assert(r.status === 200, 'second expiry handled');
assert(h.stats().refreshes === 2 && h.getToken() === 't2', 'refreshing flag was reset: ' + h.stats().refreshes);` },
    { name: "refresh_failure_logs_out_once_and_rejects_everyone", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
const h = mk(() => false, { refreshFails: true });
const results = await Promise.allSettled([h.request('/a'), h.request('/b'), h.request('/c')]);
assert(results.every((r) => r.status === 'rejected' && r.reason.message === 'Session expired'), 'all reject with Session expired');
assert(results[0].reason.cause && results[0].reason.cause.message === 'refresh denied', 'original error as cause');
assert(h.stats().refreshes === 1 && h.stats().logouts === 1, 'one refresh attempt, one logout: ' + JSON.stringify(h.stats()));` },
    { name: "can_recover_after_a_failed_refresh", code: `const mk = (isValid, opts = {}) => {
  let token = 't0'; let n = 0; let logouts = 0; let refreshes = 0; const calls = [];
  const fetchFn = async (url, o) => {
    const auth = o.headers && o.headers.Authorization;
    calls.push(auth);
    await new Promise((r) => setTimeout(r, 1));
    return { status: isValid(auth) ? 200 : 401, auth, url };
  };
  const refreshToken = async () => {
    refreshes++;
    await new Promise((r) => setTimeout(r, 5));
    if (opts.refreshFails) throw new Error('refresh denied');
    token = 't' + (++n);
    return token;
  };
  const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
  return { request, calls, stats: () => ({ refreshes, logouts }), getToken: () => token, setToken: (t) => { token = t; } };
};
let fail = true; let token = 't0'; let logouts = 0; let valid = 'Bearer t9';
const fetchFn = async (url, o) => ({ status: o.headers.Authorization === valid ? 200 : 401 });
const refreshToken = async () => { if (fail) throw new Error('down'); token = 't9'; return 't9'; };
const request = createAuthFetch({ fetchFn, getToken: () => token, refreshToken, onLogout: () => { logouts++; } });
let err = null;
try { await request('/x'); } catch (e) { err = e; }
assert(err && err.message === 'Session expired' && logouts === 1, 'first attempt fails');
fail = false;
const r = await request('/x');
assert(r.status === 200 && logouts === 1, 'a later refresh can still succeed');` },
  ],
  solution: {
    code: `function createAuthFetch({ fetchFn, getToken, refreshToken, onLogout }) {
  let refreshing = null;

  const send = (url, options, token) =>
    fetchFn(url, {
      ...options,
      headers: { ...(options.headers || {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    });

  function refreshOnce() {
    if (!refreshing) {
      refreshing = Promise.resolve()
        .then(refreshToken)
        .then(
          (token) => {
            refreshing = null;
            return token;
          },
          (err) => {
            refreshing = null;
            onLogout();
            throw err;
          },
        );
    }
    return refreshing;
  }

  return async function request(url, options = {}) {
    const usedToken = getToken();
    const response = await send(url, options, usedToken);
    if (response.status !== 401) return response;

    const latest = getToken();
    if (latest && latest !== usedToken) return send(url, options, latest);

    let token;
    try {
      token = await refreshOnce();
    } catch (err) {
      const expired = new Error('Session expired');
      expired.cause = err;
      throw expired;
    }
    return send(url, options, token);
  };
}

module.exports = createAuthFetch;`,
    explanation:
      "The shared refreshing promise is a single-flight lock: the first 401 starts the refresh and every other 401 awaits the same promise. Comparing the token a request used with the current one handles the late-arriving 401 case, and retrying exactly once prevents infinite loops.",
  },
};
