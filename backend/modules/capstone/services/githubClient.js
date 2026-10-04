/**
 * Minimal read-only GitHub REST client for capstone submissions.
 *
 * Only ever talks to api.github.com, with owner/repo that already passed
 * lib/githubUrl.js. Path segments are still URI-encoded as defence in depth.
 *
 * Error policy:
 *  - "not there" answers (404 repo, 409 empty repo) are returned as null so
 *    the caller can turn them into a failed check the learner can fix;
 *  - rate limiting becomes a 503 and anything else a 502. Those are OUR
 *    problem, not the learner's, so they never count as a failed submission.
 */

import process from "process";
import { GITHUB_TIMEOUT_MS } from "../lib/constants.js";

const API = "https://api.github.com";

const fail = (status, message) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

const headers = () => {
  const h = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "vahoha-capstone",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
};

const repoPath = (owner, repo) => `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

/** @returns {Promise<{ res: Response, body: any } | null>} null on 404/409 */
const request = async (path) => {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      headers: headers(),
      signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
    });
  } catch (err) {
    console.error("GitHub request failed:", path, err.message);
    fail(502, "Could not reach GitHub. Try again in a minute.");
  }

  if (res.status === 404 || res.status === 409) return null;

  const rateLimited =
    res.status === 429 || (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0");
  if (rateLimited) fail(503, "GitHub is rate limiting us. Try again in a few minutes.");

  if (!res.ok) {
    console.error("GitHub unexpected status:", res.status, path);
    fail(502, "GitHub returned an unexpected error. Try again later.");
  }

  return { res, body: await res.json() };
};

/** Public repo metadata, or null if it does not exist or is private. */
export const getRepo = async (owner, repo) => {
  const result = await request(repoPath(owner, repo));
  if (!result) return null;
  const r = result.body;
  return {
    id: r.id, // stable across renames and transfers — used for uniqueness
    fullName: r.full_name,
    htmlUrl: r.html_url,
    private: r.private,
    fork: r.fork,
    sizeKb: r.size,
    createdAt: new Date(r.created_at),
    defaultBranch: r.default_branch,
  };
};

/** The default branch's latest commit, or null for an empty repository. */
export const getHeadCommit = async (owner, repo) => {
  const result = await request(`${repoPath(owner, repo)}/commits/HEAD`);
  if (!result) return null;
  const c = result.body;
  return { sha: c.sha, treeSha: c.commit.tree.sha, committedAt: new Date(c.commit.committer.date) };
};

/**
 * Commit count and root commit reachable from `sha`, in two calls whatever
 * the history length: ask for one commit per page, read the last page number
 * from the Link header (= the count), then fetch that page (= the root).
 * For a merge-heavy history "root" is the oldest commit in GitHub's ordering,
 * which is what we want for an "is this history older than the attempt" flag.
 */
export const getCommitStats = async (owner, repo, sha) => {
  const base = `${repoPath(owner, repo)}/commits?sha=${encodeURIComponent(sha)}&per_page=1`;
  const first = await request(base);
  if (!first || !first.body.length) return { count: 0, rootCommittedAt: null };

  const link = first.res.headers.get("link") ?? "";
  const lastPage = Number(link.match(/[?&]page=(\d+)>;\s*rel="last"/)?.[1] ?? 1);

  const root = lastPage > 1 ? await request(`${base}&page=${lastPage}`) : first;
  const rootCommit = root?.body?.[0];
  return {
    count: lastPage,
    rootCommittedAt: rootCommit ? new Date(rootCommit.commit.committer.date) : null,
  };
};

/** Every file (path + size in bytes) at a tree, plus GitHub's own truncation flag. */
export const getTree = async (owner, repo, treeSha) => {
  const result = await request(`${repoPath(owner, repo)}/git/trees/${encodeURIComponent(treeSha)}?recursive=1`);
  if (!result) return { truncated: false, paths: [], entries: [] };
  const entries = result.body.tree
    .filter((e) => e.type === "blob")
    .map((e) => ({ path: e.path, size: e.size ?? 0 }));
  return { truncated: Boolean(result.body.truncated), paths: entries.map((e) => e.path), entries };
};

const RAW = "https://raw.githubusercontent.com";

/**
 * One file's text at a pinned commit, from raw.githubusercontent.com — a CDN
 * that does not count against the REST API rate limit. Content at a commit SHA
 * is immutable, so this is exactly what was submitted.
 * Returns null for a missing file or binary content (contains a NUL byte).
 */
export const getFileText = async (fullName, sha, path) => {
  const [owner, repo] = fullName.split("/");
  const url = `${RAW}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(sha)}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "vahoha-capstone" }, signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS) });
  } catch (err) {
    console.error("GitHub raw fetch failed:", path, err.message);
    fail(502, "Could not download your repository files from GitHub. Try again in a minute.");
  }
  if (res.status === 404) return null;
  if (res.status === 429) fail(503, "GitHub is rate limiting us. Try again in a few minutes.");
  if (!res.ok) fail(502, "GitHub returned an unexpected error. Try again later.");

  const text = await res.text();
  return text.includes(String.fromCharCode(0)) ? null : text;
};

const PULLS_PAGE_SIZE = 50;
const PULLS_MAX_PAGES = 5; // 250 closed PRs: bounds the API calls of one sync

/**
 * Merged pull requests, most recently updated first. GitHub's list has no
 * "merged" filter, so we page through CLOSED PRs (unmerged ones take up room too)
 * and keep those with merged_at. Returns null if the repo is missing or private.
 */
export const listMergedPulls = async (owner, repo) => {
  const merged = [];
  for (let page = 1; page <= PULLS_MAX_PAGES; page++) {
    const result = await request(
      `${repoPath(owner, repo)}/pulls?state=closed&sort=updated&direction=desc&per_page=${PULLS_PAGE_SIZE}&page=${page}`,
    );
    if (!result) return page === 1 ? null : merged;
    merged.push(
      ...result.body
        .filter((pr) => pr.merged_at)
        .map((pr) => ({
          number: pr.number,
          title: pr.title,
          authorLogin: pr.user?.login ?? null,
          mergedAt: new Date(pr.merged_at),
        })),
    );
    if (result.body.length < PULLS_PAGE_SIZE) break; // last page
  }
  return merged;
};

/** Changed files of one PR (max 100). `patch` is the diff text, absent for binary or huge files. */
export const getPullFiles = async (owner, repo, number) => {
  const result = await request(`${repoPath(owner, repo)}/pulls/${Number(number)}/files?per_page=100`);
  if (!result) return [];
  return result.body.map((f) => ({
    path: f.filename,
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch ?? null,
  }));
};

/** Logins of people who reviewed a PR, excluding its author. */
export const getPullReviewers = async (owner, repo, number, authorLogin) => {
  const result = await request(`${repoPath(owner, repo)}/pulls/${Number(number)}/reviews?per_page=100`);
  if (!result) return [];
  const logins = result.body.map((r) => r.user?.login).filter((l) => l && l !== authorLogin);
  return [...new Set(logins)];
};
