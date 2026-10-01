import { z } from "zod";

/**
 * The client only ever says WHICH plan it wants. Price, product id, redirect
 * URLs and the customer identity all come from the server, so there is nothing
 * else here for a tampered request to bend.
 *
 * `.strict()` rejects unknown keys instead of silently ignoring them: a caller
 * sending `{ productId: "..." }` should get a 400, not a quiet success that
 * leaves them thinking it was honoured.
 */
export const checkoutBodySchema = z
  .object({ plan: z.enum(["pro"]).default("pro") })
  .strict()
  .default({});
