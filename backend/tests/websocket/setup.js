// Shared env setup for WebSocket tests.
// Sets the JWT secret used by verifyToken so tokens minted in tests are valid.
import process from 'node:process'

process.env.JWT_Secret = 'test-secret-for-websocket-tests'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-websocket-tests'
