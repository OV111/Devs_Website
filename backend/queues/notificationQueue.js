import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

// Uses the shared connection from config/redis.js. It used to build its own
// `{ host, port }` without the password or REDIS_URL, so against any
// password-protected Redis every enqueue failed while the worker (already on
// the shared connection) sat idle waiting for jobs that never arrived.
//
// REDIS_ENABLED=false (redisConnection === null) disables the queue without
// removing code: `add` becomes a no-op.
const notificationQueue = redisConnection
  ? new Queue("notifications", { connection: redisConnection })
  : { add: () => Promise.resolve(), close: () => Promise.resolve() };

export default notificationQueue;
