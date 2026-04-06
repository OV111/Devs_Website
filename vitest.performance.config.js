import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['backend/tests/performance/**/*.test.js'],
    setupFiles: ['backend/tests/performance/setup.js'],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
