import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['backend/tests/concurrency/**/*.test.js'],
    setupFiles: ['backend/tests/concurrency/setup.js'],
    // Concurrency tests must run sequentially — they intentionally stress
    // shared resources and parallel file execution would skew results
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
