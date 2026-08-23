import process from 'node:process'
process.env.JWT_Secret = 'test-secret-key-for-concurrency-tests-only'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-concurrency-tests-only'
