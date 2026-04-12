import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['backend/tests/unit/**/*.test.js'],
    setupFiles: ['backend/tests/unit/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['backend/**/*.js'],
      exclude: [
        'backend/tests/**',
        'backend/seeders/**',
        'node_modules/**',
      ],
    },
  },
})
