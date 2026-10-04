import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Frontend unit tests: pure helpers + hooks, colocated as src/**/*.test.js.
// jsdom gives hooks a DOM; the "@" alias matches vite.config.js.
export default defineConfig({
  root,
  resolve: { alias: { '@': path.resolve(root, 'src') } },
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'jsdom',
  },
})
