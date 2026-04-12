import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['backend/tests/integration/**/*.test.js'],
    setupFiles: ['backend/tests/integration/setup.js'],
    // Sequential execution — integration tests share a DB and bcrypt is slow
    fileParallelism: false,
    // bcrypt (13 rounds) + mongodb-memory-server startup can take a few seconds
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
