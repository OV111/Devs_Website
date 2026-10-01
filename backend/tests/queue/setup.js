import process from 'node:process'

process.env.JWT_Secret = 'test-secret-for-queue-tests'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-queue-tests'
process.env.REDIS_HOST = '127.0.0.1'
process.env.REDIS_PORT = '6379'
// Force the worker on regardless of a developer's local backend/.env
// (REDIS_ENABLED=false there silently skipped `new Worker`, so every test
// failed with "processorRef.fn is not a function"). dotenv never overrides
// an already-set variable. bullmq and config/redis.js are mocked in the test,
// so no real Redis is needed.
process.env.REDIS_ENABLED = 'true'
