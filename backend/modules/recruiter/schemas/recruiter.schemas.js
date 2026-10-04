import { z } from "zod";

// PUT /api/recruiter/settings (signed-in developer, their own settings only)
export const settingsSchema = z.object({
  enabled: z.boolean(),
  openToWork: z.boolean(),
  show: z.object({
    exams: z.boolean(),
    capstone: z.boolean(),
    teams: z.boolean(),
    strengths: z.boolean(),
  }),
});

// GET /api/recruiter/scorecards/:username (public)
export const usernameParamSchema = z.object({
  username: z.string().trim().min(1).max(40).regex(/^[A-Za-z0-9._-]+$/, "Invalid username"),
});
