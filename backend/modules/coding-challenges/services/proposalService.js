import { ObjectId } from "mongodb";
import { runHiddenTests } from "./runnerService.js";

/**
 * Community-submitted challenges.
 *
 * A proposal is just a `challenges` document with `status: "pending"` and a
 * `submittedBy`, so approving one is a status flip rather than a copy between
 * collections — nothing can drift out of sync.
 *
 * SECURITY NOTE. Approving a proposal means its `hiddenTests` will execute on
 * the server for every person who ever submits that challenge. That is the one
 * place in this feature where *someone else's* code runs on our machine. Two
 * things stand between a proposal and that: a human admin reading it, and the
 * self-check in `approveProposalService` below. Neither is a sandbox — see the
 * header of runnerService.js for what the live sandbox actually guarantees.
 */

const COL = "challenges";

const VALID_TYPES = ["CODE", "DEBUG", "BUILD", "SYSTEM_DESIGN"];
const VALID_DIFFICULTY = ["easy", "med", "hard"];

const fail = (status, message) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/**
 * Validate a submitted proposal. Hand-rolled to match the rest of the codebase
 * (no schema library in this project yet) and deliberately strict: the cost of
 * a malformed challenge is a broken arena page for every user who opens it.
 */
const validate = (body) => {
  const required = ["title", "summary", "description", "task", "trackId", "layerId"];
  for (const field of required) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      fail(400, `${field} is required`);
    }
  }

  if (!VALID_TYPES.includes(body.type)) {
    fail(400, `type must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!VALID_DIFFICULTY.includes(body.difficulty)) {
    fail(400, `difficulty must be one of: ${VALID_DIFFICULTY.join(", ")}`);
  }

  if (!Array.isArray(body.starterFiles) || body.starterFiles.length === 0) {
    fail(400, "at least one starter file is required");
  }
  for (const f of body.starterFiles) {
    if (typeof f?.name !== "string" || typeof f?.code !== "string") {
      fail(400, "each starter file needs a name and code");
    }
  }

  if (!Array.isArray(body.hiddenTests) || body.hiddenTests.length === 0) {
    fail(400, "at least one hidden test is required — they decide a pass");
  }
  for (const t of body.hiddenTests) {
    if (typeof t?.name !== "string" || typeof t?.code !== "string") {
      fail(400, "each hidden test needs a name and code");
    }
  }

  if (typeof body.solution?.code !== "string" || !body.solution.code.trim()) {
    fail(400, "a reference solution is required so the problem can be verified");
  }

  const xp = Number(body.xp);
  if (!Number.isInteger(xp) || xp < 0 || xp > 500) {
    fail(400, "xp must be a whole number between 0 and 500");
  }
};

export const submitProposalService = async (db, userId, body) => {
  validate(body);

  const layer = await db
    .collection("roadmap_layers")
    .findOne({ layerId: body.layerId }, { projection: { layerId: 1, trackId: 1 } });
  if (!layer) fail(400, `Unknown layer: ${body.layerId}`);

  // Derive the slug rather than accepting one, so a submitter can't collide
  // with (or impersonate) an existing challenge by choosing its slug.
  let slug = slugify(body.title);
  if (!slug) fail(400, "title must contain at least one letter or number");
  if (await db.collection(COL).findOne({ slug })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const doc = {
    slug,
    trackId: layer.trackId,
    layerId: layer.layerId,
    type: body.type,
    difficulty: body.difficulty,
    title: body.title.trim(),
    summary: body.summary.trim(),
    description: body.description,
    task: body.task,
    constraints: Array.isArray(body.constraints) ? body.constraints : [],
    example: typeof body.example === "string" ? body.example : "",
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 8) : [],
    estimatedMins: Number(body.estimatedMins) || 30,
    xp: Number(body.xp),
    starterFiles: body.starterFiles.map((f) => ({
      name: f.name,
      lang: f.lang ?? "js",
      code: f.code,
    })),
    testFile: body.testFile ?? null,
    hiddenTests: body.hiddenTests.map((t) => ({ name: t.name, code: t.code })),
    hints: Array.isArray(body.hints)
      ? body.hints.map((h, i) => ({
          order: i + 1,
          cost: Number(h.cost) || 0,
          text: String(h.text ?? ""),
        }))
      : [],
    solution: { code: body.solution.code, explanation: body.solution.explanation ?? "" },
    status: "pending",
    submittedBy: new ObjectId(userId),
    reviewedBy: null,
    reviewNote: null,
    stats: { solves: 0, attempts: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { insertedId } = await db.collection(COL).insertOne(doc);
  return { _id: insertedId, slug: doc.slug, status: doc.status };
};

/** Proposals awaiting review, newest first. */
export const listProposalsService = async (db, status = "pending") => {
  const items = await db
    .collection(COL)
    .find({ status, submittedBy: { $ne: null } })
    .project({
      slug: 1, title: 1, summary: 1, type: 1, difficulty: 1, xp: 1,
      trackId: 1, layerId: 1, submittedBy: 1, createdAt: 1,
      hiddenTests: 1, starterFiles: 1, solution: 1, reviewNote: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return { items, total: items.length };
};

/**
 * Approve a proposal — but only if it actually works.
 *
 * The reference solution is executed against the proposal's own hidden tests
 * first. A problem whose own solution fails its own tests is unsolvable, and
 * publishing it would hand every user an impossible challenge with no way to
 * tell whose fault it is. This catches that automatically, so the admin's job
 * is judging quality and safety, not debugging.
 */
export const approveProposalService = async (db, adminId, id) => {
  if (!ObjectId.isValid(id)) fail(404, "Proposal not found");

  const proposal = await db
    .collection(COL)
    .findOne({ _id: new ObjectId(id), status: "pending" });
  if (!proposal) fail(404, "Proposal not found");

  const source = proposal.starterFiles?.[0];
  const exportName = (source?.name ?? "solution").replace(/\.[^.]+$/, "");

  const run = await runHiddenTests(
    proposal.solution.code,
    exportName,
    proposal.hiddenTests,
  );
  const passedCount = run.results.filter((r) => r.passed).length;
  const verified = !run.fatal && passedCount === proposal.hiddenTests.length;

  if (!verified) {
    fail(
      422,
      `Refusing to publish: the reference solution passes only ${passedCount}/${proposal.hiddenTests.length} of its own hidden tests` +
        (run.error ? ` (${run.error})` : ""),
    );
  }

  await db.collection(COL).updateOne(
    { _id: proposal._id },
    {
      $set: {
        status: "published",
        reviewedBy: new ObjectId(adminId),
        reviewNote: null,
        updatedAt: new Date(),
      },
    },
  );

  return { slug: proposal.slug, status: "published", verifiedTests: passedCount };
};

export const rejectProposalService = async (db, adminId, id, note) => {
  if (!ObjectId.isValid(id)) fail(404, "Proposal not found");
  if (typeof note !== "string" || !note.trim()) {
    fail(400, "A rejection note is required — the submitter needs to know why");
  }

  const result = await db.collection(COL).findOneAndUpdate(
    { _id: new ObjectId(id), status: "pending" },
    {
      $set: {
        status: "rejected",
        reviewedBy: new ObjectId(adminId),
        reviewNote: note.trim(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after", projection: { slug: 1, status: 1, reviewNote: 1 } },
  );

  if (!result) fail(404, "Proposal not found");
  return result;
};

/** What the submitter can see about their own proposals. */
export const listMyProposalsService = async (db, userId) => {
  const items = await db
    .collection(COL)
    .find({ submittedBy: new ObjectId(userId) })
    .project({ slug: 1, title: 1, status: 1, reviewNote: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .toArray();

  return { items, total: items.length };
};
