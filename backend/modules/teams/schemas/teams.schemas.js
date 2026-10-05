import { z } from "zod";
import { TEAM_STATUSES } from "../services/teamsData.js";

const objectId = z.string().regex(/^[a-f0-9]{24}$/, "Invalid id");

export const teamParamSchema = z.object({ teamId: objectId });

// Public ids are 12 chars of base64url (randomBytes(9)).
export const publicIdParamSchema = z.object({
  publicId: z.string().regex(/^[A-Za-z0-9_-]{12}$/, "Invalid evidence id"),
});

// POST /api/teams (admin): team 1 is created by hand.
export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(60),
  trackId: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid track id")
    .max(40),
});

// POST /api/teams/:teamId/members (admin): the admin confirms the GitHub login.
export const addMemberSchema = z.object({
  userId: objectId,
  githubLogin: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/, "Invalid GitHub login"),
});

export const memberParamSchema = z.object({ teamId: objectId, userId: objectId });

// PUT /api/teams/:teamId/repo (admin)
export const setRepoSchema = z.object({ repoUrl: z.string().trim().min(1).max(200) });

// POST /api/teams/:teamId/defense/answer
export const defenseAnswerSchema = z.object({
  questionId: z.string().regex(/^q\d{1,2}$/, "Invalid question id"),
  // Empty is allowed: it is how a member skips a question (scored 0).
  answer: z.string().max(5000),
});

// PUT /api/teams/:teamId/ratings/:userId
export const ratingParamSchema = z.object({ teamId: objectId, userId: objectId });
export const ratingSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().trim().max(300).optional(),
});

// PUT /api/teams/:teamId/evidence/revocation (admin)
export const evidenceRevokeSchema = z.object({ revoked: z.boolean() });

// PUT /api/teams/:teamId/status (admin)
export const statusSchema = z.object({ status: z.enum(TEAM_STATUSES) });

// GET /api/teams/admin/users?q= (admin)
export const userSearchSchema = z.object({ q: z.string().trim().min(2).max(60) });
