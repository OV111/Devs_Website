import { describe, it, expect } from 'vitest'
import { ObjectId } from 'mongodb'
import { evaluateStart } from '../../modules/capstone/lib/startRules.js'
import { pickTwist, toPublicBrief, toPublicAttempt } from '../../modules/capstone/lib/publicView.js'
import { MAX_ATTEMPTS, COOLDOWN_MS } from '../../modules/capstone/lib/constants.js'

const NOW = new Date('2026-10-03T12:00:00Z')
const attempt = (attemptNumber, status, cooldownUntil = null) => ({ attemptNumber, status, cooldownUntil })

describe('evaluateStart', () => {
  it('allows a first attempt', () => {
    expect(evaluateStart([], NOW)).toEqual({ canStart: true, reason: null, retryAt: null, failedCount: 0 })
  })

  it('reports an open attempt before anything else', () => {
    const r = evaluateStart([attempt(2, 'defense'), attempt(1, 'failed')], NOW)
    expect(r.reason).toBe('open_attempt')
    expect(r.canStart).toBe(false)
  })

  it('blocks after a pass', () => {
    expect(evaluateStart([attempt(1, 'passed')], NOW).reason).toBe('already_passed')
  })

  it('blocks once every attempt is used, even after the cooldown', () => {
    const past = new Date(NOW.getTime() - COOLDOWN_MS)
    const used = Array.from({ length: MAX_ATTEMPTS }, (_, i) => attempt(i + 1, 'failed', past))
    expect(evaluateStart(used, NOW).reason).toBe('max_attempts')
  })

  it('enforces the cooldown of the LATEST failure only', () => {
    const later = new Date(NOW.getTime() + 60_000)
    const r = evaluateStart([attempt(1, 'failed', new Date(0)), attempt(2, 'failed', later)], NOW)
    expect(r).toMatchObject({ canStart: false, reason: 'cooldown', retryAt: later, failedCount: 2 })
  })

  it('allows a retry once the cooldown has passed', () => {
    expect(evaluateStart([attempt(1, 'failed', new Date(NOW.getTime() - 1))], NOW).canStart).toBe(true)
  })
})

describe('pickTwist', () => {
  const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

  it('never repeats a used twist while fresh ones remain', () => {
    // rand always picks index 0 of whatever pool it is handed
    expect(pickTwist(pool, ['a', 'b'], () => 0).id).toBe('c')
  })

  it('falls back to the full pool once all are used', () => {
    expect(pickTwist(pool, ['a', 'b', 'c'], () => 1).id).toBe('b')
  })

  it('rejects an empty pool', () => {
    expect(() => pickTwist([], [])).toThrow()
  })
})

describe('public projections', () => {
  const brief = {
    _id: new ObjectId(),
    trackId: 'api-dev',
    slug: 's',
    version: 1,
    title: 't',
    summary: 'x',
    requirements: [{ id: 'r', text: 'do it', check: { type: 'file', glob: 'README.md' } }],
    rubric: [{ id: 'c', name: 'C', description: 'd', weight: 40, layerId: 'api-dev-4' }],
    twistPool: [{ id: 'tw', text: 'secret twist' }, { id: 'other', text: 'other twist' }],
    passThresholds: { rubric: 0.7, defense: 0.6 },
  }

  it('never exposes weights, thresholds, checks or the twist pool', () => {
    const json = JSON.stringify(toPublicBrief(brief))
    for (const leaked of ['weight', 'passThresholds', 'twistPool', 'glob', 'layerId', 'secret twist']) {
      expect(json).not.toContain(leaked)
    }
  })

  it('shows only the learner’s own twist on the attempt', () => {
    const view = toPublicAttempt(
      { _id: new ObjectId(), attemptNumber: 1, status: 'started', briefVersion: 1, twistId: 'tw', startedAt: NOW },
      brief,
    )
    expect(view.twist).toEqual({ id: 'tw', text: 'secret twist' })
    expect(JSON.stringify(view)).not.toContain('other twist')
  })
})
