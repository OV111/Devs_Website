import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['backend/tests/websocket/**/*.test.js'],
    setupFiles: ['backend/tests/websocket/setup.js'],
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
})
