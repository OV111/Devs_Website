/**
 * Recruiter scorecard, step 2: collect one developer's VERIFIED results into
 * one public object.
 *
 * Rules:
 * - Opt-in. No settings document, or `enabled: false`, answers 404, identical to
 *   an unknown username (a recruiter cannot tell "private" from "not here").
 * - Only sections the developer switched on are loaded at all, so a hidden
 *   section's data never even leaves the database.
 * - Only verified results: passed exams, non-revoked and non-test certificates,
 *   issued team evidence. XP is shown but small and last; it is never a sort key.
 * - "Strengths" lists only topics at status "solid". Weak spots and shaky topics
 *   are never part of the scorecard, whatever the settings say.
 *
 * `buildScorecard` is pure (no database) so it can be unit-tested directly.
 */

import { withLayerTitles } from "../../../services/examHistoryService.js";
import { getMastery } from "../../../services/learnerMasteryService.js";
import { listPublicCertificatesForUser } from "../../capstone/index.js";
import { TEAMS, TEAM_EVIDENCE } from "../../teams/services/teamsData.js";
import { DEFAULT_RECRUITER_SETTINGS, RECRUITER_SETTINGS, ensureIndexes, fail } from "./recruiterData.js";

const MAX_STRENGTHS = 8;
const EXAM_ROW_LIMIT = 200;

const displayName = (u) => [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username;

/** Best passed score per (path, layer), newest layers last. */
const summarizeExams = (rows) => {
  const best = new Map();
  for (const r of rows) {
    if (!r.passed) continue;
    const key = `${r.path}:${r.layer}`;
    const prev = best.get(key);
    if (!prev || r.score > prev.bestScore) {
      best.set(key, {
        path: r.path,
        layer: r.layer,
        layerTitle: r.layerTitle ?? null,
        bestScore: r.score,
        passedAt: r.takenAt,
      });
    }
  }
  return [...best.values()].sort((a, b) => new Date(a.passedAt) - new Date(b.passedAt));
};

const summarizeCapstones = (certificates) =>
  certificates
    .filter((c) => !c.revoked && !c.testData) // revoked and seeded-test certificates never reach a recruiter
    .map((c) => ({
      track: c.track,
      verifyPath: c.verifyPath,
      reviewScore: c.scores?.review ?? null,
      defenseScore: c.scores?.defense ?? null,
      humanReviewed: c.humanReviewed,
      issuedAt: c.issuedAt,
    }));

/** One line a recruiter reads first, built only from sections the developer shares. */
export const buildHeadline = ({ exams, capstones, teams }) => {
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const parts = [
    exams?.length ? `${plural(exams.length, "layer")} passed` : null,
    capstones?.length ? `${plural(capstones.length, "capstone")} passed` : null,
    teams?.length ? `${plural(teams.length, "team project")}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
};

const summarizeStrengths = (mastery) =>
  mastery
    .filter((t) => t.status === "solid")
    .slice(0, MAX_STRENGTHS)
    .map((t) => t.title);

/**
 * @param {object} input
 * @param {{username:string, firstName?:string, lastName?:string}} input.user
 * @param {{show: object}} input.settings
 * @param {object|null} input.progress
 * @param {object[]} input.exams  examHistory rows (with layerTitle)
 * @param {object[]} input.certificates  public certificate views
 * @param {object[]} input.teams  [{ name, trackId, evidencePath, stats }]
 * @param {object[]} input.mastery
 */
export const buildScorecard = ({ user, settings, progress, exams, certificates, teams, mastery }) => {
  const show = settings.show;
  // Sections the developer hid are null, not empty: the page must not
  // suggest "nothing here" when the truth is "not shared".
  const shown = {
    exams: show.exams ? summarizeExams(exams) : null,
    capstones: show.capstone ? summarizeCapstones(certificates) : null,
    teams: show.teams ? teams : null,
    strengths: show.strengths ? summarizeStrengths(mastery) : null,
  };
  return {
    username: user.username,
    name: displayName(user),
    headline: buildHeadline(shown),
    openToWork: Boolean(settings.openToWork),
    ...shown,
    activity: {
      memberSince: progress?.createdAt ?? null,
      lastActiveAt: progress?.lastActiveAt ?? null,
    },
    xpTotal: progress?.xpTotal ?? 0, // secondary signal, effort not proof
  };
};

/** Teams this developer belongs to that have a public (issued, not revoked) evidence page. */
const loadTeamEvidence = async (db, user) => {
  const teams = await db.collection(TEAMS).find({ "members.userId": user._id }).toArray();
  if (!teams.length) return [];
  const evidence = await db
    .collection(TEAM_EVIDENCE)
    .find({ teamId: { $in: teams.map((t) => t._id) }, revoked: false })
    .toArray();
  const evidenceByTeam = new Map(evidence.map((e) => [e.teamId.toString(), e]));

  return teams.flatMap((team) => {
    const ev = evidenceByTeam.get(team._id.toString());
    const login = team.members.find((m) => m.userId.equals(user._id))?.githubLogin;
    const me = ev?.snapshot.members.find((m) => m.githubLogin === login);
    if (!ev || !me) return [];
    return [
      {
        name: team.name,
        trackId: team.trackId,
        evidencePath: `/evidence/${ev.publicId}`,
        mergedPulls: me.mergedPulls,
        reviewsGiven: me.reviewsGiven,
        defense: me.defense?.passed ? me.defense : null, // verified results only
        peerRating: me.peerRating,
      },
    ];
  });
};

export const getScorecardService = async (db, username) => {
  await ensureIndexes(db);
  const user = await db
    .collection("users")
    .findOne({ username }, { projection: { username: 1, firstName: 1, lastName: 1 } });
  const stored = user ? await db.collection(RECRUITER_SETTINGS).findOne({ userId: user._id }) : null;
  if (!user || !stored?.enabled) fail(404, "Scorecard not found");

  const settings = { ...DEFAULT_RECRUITER_SETTINGS, ...stored, show: { ...DEFAULT_RECRUITER_SETTINGS.show, ...stored.show } };
  const { show } = settings;

  const [progress, exams, certificates, teams, mastery] = await Promise.all([
    db.collection("userProgress").findOne({ userId: user._id }),
    show.exams
      ? db
          .collection("examHistory")
          .find({ userId: user._id, passed: true })
          .sort({ takenAt: -1 })
          .limit(EXAM_ROW_LIMIT)
          .toArray()
          .then((rows) => withLayerTitles(db, rows))
      : [],
    show.capstone ? listPublicCertificatesForUser(db, user._id, user.username) : [],
    show.teams ? loadTeamEvidence(db, user) : [],
    show.strengths ? getMastery(db, user._id) : [],
  ]);

  return buildScorecard({ user, settings, progress, exams, certificates, teams, mastery });
};
