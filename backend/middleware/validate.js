/**
 * Generic Zod validation middleware.
 *
 * Usage:
 *   router.post("/stream", authenticate, validate({ body: streamSchema }), stream)
 *
 * Why a middleware instead of parsing inside each controller: the controller
 * should be able to trust req.body. Validating at the route boundary means a
 * malformed payload is rejected before any service, DB call, or model call
 * runs — and it always fails as a 400, never as a 500 from a downstream throw.
 *
 * The parsed (and therefore trimmed/defaulted) result is written back onto the
 * request, so controllers read normalized values rather than raw input.
 */
export const validate =
  ({ body, params, query }) =>
  (req, res, next) => {
    const targets = [
      [body, "body"],
      [params, "params"],
      [query, "query"],
    ];

    for (const [schema, key] of targets) {
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        const issue = result.error.issues[0];
        return res.status(400).json({
          message: issue?.message ?? "Invalid request",
          field: issue?.path?.join(".") || undefined,
          issues: result.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        });
      }

      // req.query is a getter-only property on newer Express versions, so
      // assigning to it throws. Mutating in place keeps this safe for all three.
      Object.defineProperty(req, key, {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    next();
  };
