/**
 * Unit tests for the deployment-hardening pieces: code-runner fail-closed
 * policy, the health check, graceful shutdown ordering, and the WebSocket
 * origin allow-list. All pure or dependency-injected — no server, no Mongo.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import process from 'node:process'
import { fallbackAllowed, runHiddenTests, describeRunner } from '../../modules/coding-challenges/services/runnerService.js'
import { checkHealth } from '../../utils/health.js'
import { createShutdown } from '../../utils/shutdown.js'
import { allowedOrigins, isOriginAllowed } from '../../websocket/origin.js'

describe('code runner: fail closed in production', () => {
  const saved = { NODE_ENV: process.env.NODE_ENV, ALLOW_UNSAFE_RUNNER: process.env.ALLOW_UNSAFE_RUNNER }
  afterEach(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
  })

  it('allows the weak fallback outside production (local dev keeps working)', () => {
    expect(fallbackAllowed({ NODE_ENV: 'development' })).toBe(true)
    expect(fallbackAllowed({})).toBe(true)
  })

  it('forbids the weak fallback in production by default', () => {
    expect(fallbackAllowed({ NODE_ENV: 'production' })).toBe(false)
  })

  it('only an explicit ALLOW_UNSAFE_RUNNER=true overrides it', () => {
    expect(fallbackAllowed({ NODE_ENV: 'production', ALLOW_UNSAFE_RUNNER: 'true' })).toBe(true)
    expect(fallbackAllowed({ NODE_ENV: 'production', ALLOW_UNSAFE_RUNNER: '1' })).toBe(false)
  })

  // On this machine isolated-vm is not usable (not built on Windows / no
  // --no-node-snapshot under vitest), which is exactly the production hazard.
  it.skipIf(describeRunner().hardened)(
    'refuses to execute submissions in production without the sandbox (503, not RCE)',
    async () => {
      process.env.NODE_ENV = 'production'
      delete process.env.ALLOW_UNSAFE_RUNNER

      await expect(
        runHiddenTests('module.exports = () => 1', 'solution', [{ name: 't', code: 'true' }]),
      ).rejects.toMatchObject({ status: 503 })
      expect(describeRunner()).toMatchObject({ backend: 'disabled', available: false })
    },
  )
})

describe('checkHealth', () => {
  it('is ok when the database answers a ping', async () => {
    const db = { command: vi.fn().mockResolvedValue({ ok: 1 }) }
    const out = await checkHealth(db)
    expect(out.ok).toBe(true)
    expect(out.body.status).toBe('ok')
    expect(db.command).toHaveBeenCalledWith({ ping: 1 })
  })

  it('is unavailable (and does not leak the error) when the ping fails', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const db = { command: vi.fn().mockRejectedValue(new Error('auth failed for user admin@cluster0')) }
    const out = await checkHealth(db)
    expect(out.ok).toBe(false)
    expect(JSON.stringify(out.body)).not.toContain('cluster0')
    err.mockRestore()
  })

  it('turns a hung database into a fast failure instead of hanging', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const db = { command: () => new Promise(() => {}) } // never settles
    const started = Date.now()
    const out = await checkHealth(db, { timeoutMs: 50 })
    expect(out.ok).toBe(false)
    expect(Date.now() - started).toBeLessThan(1000)
    err.mockRestore()
  })
})

describe('createShutdown', () => {
  const silent = { log: () => {}, error: () => {} }
  const fakeServer = () => ({ close: vi.fn((cb) => cb()) })

  it('stops HTTP first, then closes dependencies in the given order, then exits 0', async () => {
    const order = []
    const server = { close: vi.fn((cb) => { order.push('http'); cb() }) }
    const exit = vi.fn()
    const shutdown = createShutdown({
      server,
      exit,
      log: silent,
      closers: [
        ['worker', async () => order.push('worker')],
        ['redis', async () => order.push('redis')],
        ['mongo', async () => order.push('mongo')],
      ],
    })

    await shutdown('SIGTERM')

    expect(order).toEqual(['http', 'worker', 'redis', 'mongo'])
    expect(exit).toHaveBeenCalledWith(0)
  })

  it('closes open WebSockets with 1001 "going away" so clients reconnect', async () => {
    const a = { close: vi.fn() }
    const b = { close: vi.fn() }
    await createShutdown({ server: fakeServer(), wss: { clients: new Set([a, b]) }, exit: vi.fn(), log: silent })('SIGTERM')
    expect(a.close).toHaveBeenCalledWith(1001, expect.any(String))
    expect(b.close).toHaveBeenCalledWith(1001, expect.any(String))
  })

  it('keeps going when one dependency fails to close', async () => {
    const mongo = vi.fn()
    const exit = vi.fn()
    await createShutdown({
      server: fakeServer(),
      exit,
      log: silent,
      closers: [
        ['redis', async () => { throw new Error('already closed') }],
        ['mongo', async () => mongo()],
      ],
    })('SIGTERM')
    expect(mongo).toHaveBeenCalled()
    expect(exit).toHaveBeenCalledWith(0)
  })

  it('runs only once even if signalled twice', async () => {
    const server = fakeServer()
    const shutdown = createShutdown({ server, exit: vi.fn(), log: silent })
    await Promise.all([shutdown('SIGTERM'), shutdown('SIGINT')])
    expect(server.close).toHaveBeenCalledTimes(1)
  })

  it('forces exit(1) when something hangs past the deadline', async () => {
    vi.useFakeTimers()
    const exit = vi.fn()
    const server = { close: vi.fn() } // never calls back
    createShutdown({ server, exit, log: silent, timeoutMs: 1000 })('SIGTERM')
    await vi.advanceTimersByTimeAsync(1001)
    expect(exit).toHaveBeenCalledWith(1)
    vi.useRealTimers()
  })
})

describe('WebSocket origin allow-list', () => {
  it('allows the configured frontend (trailing slash tolerated)', () => {
    const allowed = allowedOrigins({ FRONTEND_URL: 'https://app.vahoha.dev/', NODE_ENV: 'production' })
    expect(isOriginAllowed('https://app.vahoha.dev', allowed)).toBe(true)
  })

  it('rejects any other website', () => {
    const allowed = allowedOrigins({ FRONTEND_URL: 'https://app.vahoha.dev', NODE_ENV: 'production' })
    expect(isOriginAllowed('https://evil.example', allowed)).toBe(false)
    expect(isOriginAllowed('https://app.vahoha.dev.evil.example', allowed)).toBe(false)
  })

  it('does not trust localhost in production', () => {
    const allowed = allowedOrigins({ FRONTEND_URL: 'https://app.vahoha.dev', NODE_ENV: 'production' })
    expect(isOriginAllowed('http://localhost:5173', allowed)).toBe(false)
  })

  it('allows the Vite dev server outside production', () => {
    expect(isOriginAllowed('http://localhost:5173', allowedOrigins({ NODE_ENV: 'development' }))).toBe(true)
  })

  it('accepts extra origins from WS_EXTRA_ORIGINS (e.g. a Vercel preview URL)', () => {
    const allowed = allowedOrigins({ NODE_ENV: 'production', WS_EXTRA_ORIGINS: 'https://a.vercel.app, https://b.vercel.app' })
    expect(isOriginAllowed('https://b.vercel.app', allowed)).toBe(true)
  })

  it('allows non-browser clients that send no Origin', () => {
    expect(isOriginAllowed(undefined, new Set())).toBe(true)
  })
})
