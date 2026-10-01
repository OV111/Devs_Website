/**
 * An error the client is allowed to see. `code` is a stable machine-readable
 * string the frontend can branch on ("ALREADY_SUBSCRIBED"), `status` the HTTP
 * status. Anything that is not a BillingError is an unexpected failure and is
 * reported as a generic 500 without leaking its message.
 */
export class BillingError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "BillingError";
    this.status = status;
    this.code = code;
  }
}
