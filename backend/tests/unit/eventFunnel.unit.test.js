import { describe, it, expect } from 'vitest'
import { computeFunnel } from '../../services/eventService.js'

const DAY = 24 * 60 * 60 * 1000
const T0 = new Date('2026-10-01T10:00:00Z')
const at = (days) => new Date(T0.getTime() + days * DAY)
const dayOf = (d) => d.toISOString().slice(0, 10)

const ev = (userId, type, days = 0, meta = {}) => {
  const createdAt = at(days)
  return { userId, type, meta, createdAt, ...(type === 'active_day' ? { day: dayOf(createdAt) } : {}) }
}

describe('computeFunnel', () => {
  it('counts each stage once per user', () => {
    const events = [
      ev('a', 'signup'), ev('a', 'path_selected'), ev('a', 'exam_started', 0, { path: 'backend', layer: 'l1' }),
      ev('a', 'exam_started', 0, { path: 'backend', layer: 'l1' }),
      ev('a', 'exam_submitted', 0, { passed: true }), ev('a', 'exam_submitted', 0, { passed: true }),
      ev('b', 'signup'), ev('b', 'path_selected'),
      ev('c', 'signup'),
    ]
    expect(computeFunnel(events)).toEqual({
      signedUp: 3, pathSelected: 2, examStarted: 1, examPassed: 1, returnedWithin7Days: 0, startedSecondLayer: 0,
    })
  })

  it('ignores users without a signup event (outside the cohort)', () => {
    expect(computeFunnel([ev('x', 'path_selected'), ev('x', 'exam_started')]).signedUp).toBe(0)
  })

  it('only counts a failed exam as started, not passed', () => {
    const f = computeFunnel([ev('a', 'signup'), ev('a', 'exam_started'), ev('a', 'exam_submitted', 0, { passed: false })])
    expect(f.examStarted).toBe(1)
    expect(f.examPassed).toBe(0)
  })

  it('counts a return only on a later day, within 7 days', () => {
    const f = computeFunnel([
      ev('same-day', 'signup'), ev('same-day', 'active_day', 0),
      ev('day-1', 'signup'), ev('day-1', 'active_day', 1),
      ev('day-7', 'signup'), ev('day-7', 'active_day', 7),
      ev('day-8', 'signup'), ev('day-8', 'active_day', 8),
    ])
    expect(f.returnedWithin7Days).toBe(2)
  })

  it('counts a second layer only for two distinct layers', () => {
    const f = computeFunnel([
      ev('a', 'signup'),
      ev('a', 'exam_started', 0, { path: 'backend', layer: 'l1' }),
      ev('a', 'exam_started', 2, { path: 'backend', layer: 'l2' }),
      ev('b', 'signup'),
      ev('b', 'exam_started', 0, { path: 'backend', layer: 'l1' }),
      ev('b', 'exam_started', 1, { path: 'backend', layer: 'l1' }),
    ])
    expect(f.startedSecondLayer).toBe(1)
  })
})
