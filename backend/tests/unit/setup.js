// Shared env setup for all unit tests.
// This file is loaded before every test file via vitest.config.js setupFiles.

process.env.JWT_Secret = 'test-secret-key-for-unit-tests-only'
process.env.MONGO_URI = 'mongodb://localhost:27017/test' // mocked — never actually connected
process.env.REDIS_HOST = '127.0.0.1'
process.env.REDIS_PORT = '6379'
