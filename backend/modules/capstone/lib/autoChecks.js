/**
 * Automated submission checks — pure, deterministic, no LLM cost.
 *
 * The service gathers facts from GitHub and Mongo; this module only judges
 * them, so every rule is unit-tested without a network.
 *
 * Two kinds of result:
 *  - checks: shown to the learner. Any failed check rejects the submission,
 *    but it does NOT use up an attempt — they fix it and resubmit.
 *  - flags:  integrity signals for the admin view only (stage 7). They never
 *    fail a submission on their own, because each has innocent explanations
 *    (git dates can be set by hand; a small project can have few commits).
 */

import picomatch from "picomatch";
import { MAX_REPO_FILES, MAX_REPO_SIZE_KB, MIN_COMMITS_BEFORE_FLAG } from "./constants.js";

const check = (id, label, passed, detail = null) => ({ id, label, passed, detail });

/**
 * @param {object} facts
 * @param {object|null} facts.repo          githubClient.getRepo result (null = missing/private)
 * @param {object|null} facts.head          githubClient.getHeadCommit result (null = empty repo)
 * @param {object|null} facts.stats         { count, rootCommittedAt }
 * @param {object|null} facts.tree          { truncated, paths }
 * @param {Date}        facts.firstStartedAt  when the learner FIRST started this capstone
 * @param {boolean}     facts.repoUsedByOtherUser
 * @param {boolean}     facts.treeSeenFromOtherUser
 * @param {Array}       facts.requirements  brief.requirements (only those with `check` are evaluated)
 * @returns {{ passed: boolean, checks: object[], flags: object[] }}
 */
export const evaluateSubmission = (facts) => {
  const { repo, head, stats, tree, requirements } = facts;
  // GitHub timestamps have whole-second precision; ours have milliseconds.
  // Flooring keeps a repo created in the same second as the start from failing.
  const firstStartedAt = new Date(Math.floor(facts.firstStartedAt.getTime() / 1000) * 1000);

  // Without a reachable, non-empty repo nothing else can be judged — stop early
  // with the one check that explains why.
  if (!repo || repo.private) {
    return {
      passed: false,
      checks: [check("repo-public", "Repository is public", false, "Not found, or it is private.")],
      flags: [],
    };
  }
  if (!head) {
    return {
      passed: false,
      checks: [check("repo-public", "Repository is public", true), check("not-empty", "Repository has commits", false)],
      flags: [],
    };
  }

  const checks = [
    check("repo-public", "Repository is public", true),
    check("not-empty", "Repository has commits", true),
    check("not-fork", "Repository is not a fork", !repo.fork, repo.fork ? "Forks are not accepted — create your own repository." : null),
    check(
      "created-after-start",
      "Repository was created after you started the capstone",
      repo.createdAt >= firstStartedAt,
      repo.createdAt >= firstStartedAt ? null : `Created ${repo.createdAt.toISOString()}, before you started.`,
    ),
    check(
      "repo-unique",
      "Repository has not been submitted by another learner",
      !facts.repoUsedByOtherUser,
    ),
    check(
      "size",
      `Repository is under ${MAX_REPO_SIZE_KB / 1024} MB`,
      repo.sizeKb <= MAX_REPO_SIZE_KB,
      repo.sizeKb <= MAX_REPO_SIZE_KB ? null : "Remove build output, dependencies or large assets.",
    ),
    check(
      "file-count",
      `Repository has at most ${MAX_REPO_FILES} files`,
      !tree.truncated && tree.paths.length <= MAX_REPO_FILES,
      !tree.truncated && tree.paths.length <= MAX_REPO_FILES ? null : "Is node_modules or a build folder committed?",
    ),
  ];

  // Requirement checks: each `file` check must match at least one path.
  // `glob` is a string or a LIST of globs (any one matching is enough). Use a
  // list rather than a brace alternation when the alternatives contain "**/":
  // picomatch mishandles those, e.g. "{docs/**/*.md,**/audit*.md}" misses a
  // root-level AUDIT.md, while ["docs/**/*.md", "**/audit*.md"] finds it.
  // dot: true so ".github/…" and ".env.example" match; nocase so README.md
  // and readme.md are both fine.
  for (const req of requirements) {
    if (req.check?.type !== "file") continue;
    const globs = [].concat(req.check.glob);
    const isMatch = picomatch(globs, { dot: true, nocase: true });
    const found = tree.paths.some((p) => isMatch(p));
    checks.push(check(`req:${req.id}`, req.text, found, found ? null : `No file matching ${globs.join(" or ")}.`));
  }

  const flags = [];
  if (stats.count < MIN_COMMITS_BEFORE_FLAG) {
    flags.push({ id: "few-commits", detail: `${stats.count} commit(s)` });
  }
  if (stats.rootCommittedAt && stats.rootCommittedAt < firstStartedAt) {
    flags.push({ id: "history-predates-start", detail: `First commit dated ${stats.rootCommittedAt.toISOString()}` });
  }
  if (facts.treeSeenFromOtherUser) {
    flags.push({ id: "duplicate-tree", detail: "Identical file tree was submitted by another learner" });
  }

  return { passed: checks.every((c) => c.passed), checks, flags };
};
