// Shared env setup for integration tests.
// MONGO_URI is NOT set here — each test file sets it via mongodb-memory-server
// in its own beforeAll so each file gets an isolated in-memory instance.
import process from 'node:process'
process.env.JWT_Secret = 'test-secret-key-for-integration-tests-only'
