/**
 * Parse a learner-supplied GitHub repo URL into { owner, repo }.
 *
 * This is the SSRF guard: the server never fetches the URL the learner typed.
 * It extracts owner/repo with a strict pattern and builds api.github.com URLs
 * itself, so a value like "http://169.254.169.254/" can never be requested.
 *
 * Accepted: https://github.com/owner/repo, github.com/owner/repo, with an
 * optional "www.", trailing ".git" or trailing "/". Anything else (branches,
 * sub-paths, other hosts, query strings) is rejected rather than guessed at.
 */

// GitHub usernames: 1–39 chars, alphanumeric or single hyphens, no leading hyphen.
// Repo names: 1–100 chars of letters, digits, ".", "_", "-".
const REPO_URL =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100}?)(?:\.git)?\/?$/i;

export const parseRepoUrl = (input) => {
  if (typeof input !== "string") return null;
  const match = input.trim().match(REPO_URL);
  if (!match) return null;

  const [, owner, repo] = match;
  if (repo === "." || repo === "..") return null;
  return { owner, repo };
};
