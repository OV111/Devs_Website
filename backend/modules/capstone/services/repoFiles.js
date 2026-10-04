/**
 * Download the reviewable files of a submission at its pinned commit.
 * Shared by the rubric review and the defense question generator, so both
 * see exactly the same code.
 */

import process from "process";
import { numberedCode } from "../lib/codeView.js";
import { DEFAULT_REVIEW_MAX_CHARS, REVIEW_FETCH_CONCURRENCY, REVIEW_MIN_PARTIAL_CHARS } from "../lib/constants.js";
import { selectReviewFiles, topUpReviewFiles } from "../lib/reviewFiles.js";
import { clipFile } from "../lib/reviewPrompt.js";
import { getFileText, getTree } from "./githubClient.js";

const reviewBudget = () => {
  const fromEnv = Number(process.env.CAPSTONE_REVIEW_MAX_CHARS);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_REVIEW_MAX_CHARS;
};

/** Run `fn` over `items` with at most `limit` in flight; preserves order. */
const mapLimit = async (items, limit, fn) => {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

/** Download these files at the pinned commit; files that are gone or binary are dropped. */
const download = async (submission, selected) => {
  const texts = await mapLimit(selected, REVIEW_FETCH_CONCURRENCY, (f) =>
    getFileText(submission.repo.fullName, submission.commitSha, f.path),
  );
  return selected
    .map((f, i) => (texts[i] === null ? null : clipFile(f.path, texts[i], f.cap)))
    .filter(Boolean);
};

// What the file really costs once shown in the compact view.
const viewCost = (file) => numberedCode(file.text, file.path).length;

/**
 * @returns {Promise<{ files: {path, text, truncated, cap}[], omitted: string[] }>}
 */
export const loadSubmissionFiles = async (submission) => {
  const budget = reviewBudget();
  const [owner, repo] = submission.repo.fullName.split("/");
  const tree = await getTree(owner, repo, submission.treeSha);

  // Pass 1: choose from raw sizes, download.
  const first = selectReviewFiles(tree.entries, budget);
  const files = await download(submission, first.selected);

  // Pass 2: the compact view is smaller than the raw files, so some budget is
  // normally unspent. Give it to the next-best files instead of wasting it.
  const unspent = budget - files.reduce((sum, f) => sum + viewCost(f), 0);
  if (unspent >= REVIEW_MIN_PARTIAL_CHARS && first.rest.length) {
    const second = topUpReviewFiles(first.rest, unspent);
    files.push(...(await download(submission, second.selected)));
    return { files, omitted: second.omitted };
  }
  return { files, omitted: first.omitted };
};
