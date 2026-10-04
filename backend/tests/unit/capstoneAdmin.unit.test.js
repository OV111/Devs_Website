import { describe, it, expect } from 'vitest'
import { isDefenseLive } from '../../modules/capstone/lib/liveDefense.js'
import { DEFENSE_GRACE_MS, DEFENSE_QUESTION_MS } from '../../modules/capstone/lib/constants.js'
import { adminListQuerySchema, overrideSchema, revokeSchema } from '../../modules/capstone/schemas/capstone.schemas.js'

const NOW = new Date('2026-10-03T12:00:00Z')
const ago = (ms) => new Date(NOW.getTime() - ms)
const session = (q, extra = {}) => ({ status: 'active', currentIndex: 0, questions: [q], ...extra })

describe('isDefenseLive', () => {
  it('is live while a served question is on the clock', () => {
    expect(isDefenseLive(session({ askedAt: ago(60_000) }), NOW)).toBe(true)
  })

  it('stays live through the network grace period, then stops', () => {
    expect(isDefenseLive(session({ askedAt: ago(DEFENSE_QUESTION_MS + DEFENSE_GRACE_MS) }), NOW)).toBe(true)
    expect(isDefenseLive(session({ askedAt: ago(DEFENSE_QUESTION_MS + DEFENSE_GRACE_MS + 1) }), NOW)).toBe(false)
  })

  it('is not live for an abandoned session, an unserved question, or a non-active session', () => {
    expect(isDefenseLive(session({ askedAt: ago(60 * 60_000) }), NOW)).toBe(false)
    expect(isDefenseLive(session({ askedAt: null }), NOW)).toBe(false)
    expect(isDefenseLive(session({ askedAt: ago(1000) }, { status: 'graded' }), NOW)).toBe(false)
    expect(isDefenseLive(session({ askedAt: ago(1000), answeredAt: ago(500) }), NOW)).toBe(false)
    expect(isDefenseLive(null, NOW)).toBe(false)
  })
})

describe('admin schemas', () => {
  it('requires a real reason for overrides and revocations', () => {
    expect(overrideSchema.safeParse({ outcome: 'passed', reason: 'ok' }).success).toBe(false)
    expect(overrideSchema.safeParse({ outcome: 'maybe', reason: 'x'.repeat(20) }).success).toBe(false)
    expect(overrideSchema.parse({ outcome: 'failed', reason: '  plagiarised from another repo  ' }).reason)
      .toBe('plagiarised from another repo')
    expect(revokeSchema.safeParse({ revoked: true, reason: 'short' }).success).toBe(false)
  })

  it('coerces and bounds the list query', () => {
    expect(adminListQuerySchema.parse({})).toEqual({ page: 1 })
    expect(adminListQuerySchema.parse({ page: '3', status: 'passed' })).toEqual({ page: 3, status: 'passed' })
    expect(adminListQuerySchema.safeParse({ status: 'whatever' }).success).toBe(false)
    expect(adminListQuerySchema.safeParse({ page: '0' }).success).toBe(false)
  })
})
