import { z } from "zod";

export const CONTACT_TOPICS = [
  "General question",
  "Bug report",
  "Feature request",
  "Partnership",
  "Other",
];

/**
 * `website` is a honeypot: the field is hidden from humans, so only bots fill
 * it. It's accepted here (not rejected) so the bot gets a normal-looking
 * success and has no signal to adapt to — the controller just drops it.
 */
export const contactBodySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
    topic: z.enum(CONTACT_TOPICS, { errorMap: () => ({ message: "Pick a topic" }) }),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be 1000 characters or fewer"),
    website: z.string().max(200).optional().default(""),
  })
  .strict();
