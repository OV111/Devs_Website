import { describe, it, expect } from 'vitest'
import { buildTimeline } from '../../modules/capstone/lib/timeline.js'

const t = (min) => new Date(Date.UTC(2026, 9, 3, 12, min))
const attempt = (extra = {}) => ({ attemptNumber: 1, startedAt: t(0), status: 'started', ...extra })

describe('buildTimeline', () => {
  it('is empty without an attempt', () => {
    expect(buildTimeline({ attempt: null })).toEqual([])
  })

  it('starts with the assignment, including the twist', () => {
    const [first] = buildTimeline({ attempt: attempt(), twistText: 'Read-only sharing' })
    expect(first).toMatchObject({ type: 'assign', action: 'Assigned' })
    expect(first.detail).toContain('Read-only sharing')
  })

  it('tells a failed submission from an accepted one, oldest first', () => {
    const events = buildTimeline({
      attempt: attempt({ status: 'submitted' }),
      submissions: [
        { passed: false, submittedAt: t(5), checks: [{ passed: false, label: 'README with setup instructions' }, { passed: true, label: 'x' }] },
        { passed: true, submittedAt: t(9), repo: { fullName: 'a/b' }, commitSha: 'abcdef1234' },
      ],
    })
    expect(events.map((e) => e.action)).toEqual(['Assigned', 'Sent back', 'Submitted', 'In review'])
    expect(events[1].detail).toBe('1 automated check failed — README with setup instructions')
    expect(events[2].detail).toContain('a/b · commit abcdef1')
  })

  it('records review, defense sessions and the certificate, ending with no live entry once passed', () => {
    const events = buildTimeline({
      attempt: attempt({ status: 'passed' }),
      submissions: [{ passed: true, submittedAt: t(5), repo: { fullName: 'a/b' }, commitSha: 'abc' }],
      review: { passed: true, totalScore: 81, createdAt: t(6) },
      defenses: [
        { sessionNumber: 1, result: { passed: false, score: 40 }, gradedAt: t(10) },
        { sessionNumber: 2, result: { passed: true, score: 80 }, gradedAt: t(20) },
      ],
      certificate: { issuedAt: t(21) },
    })
    expect(events.map((e) => [e.type, e.action])).toEqual([
      ['assign', 'Assigned'],
      ['submit', 'Submitted'],
      ['approve', 'Review passed'],
      ['reject', 'Defense not passed'],
      ['approve', 'Defense passed'],
      ['approve', 'Approved'],
    ])
  })

  it('shows an admin override with its reason', () => {
    const events = buildTimeline({
      attempt: attempt({ status: 'failed', override: { at: t(30), reason: 'Copied from a tutorial' } }),
    })
    expect(events.at(-1)).toMatchObject({ type: 'reject', action: 'Outcome set by a reviewer', detail: 'Copied from a tutorial' })
  })

  it('never shows a locked (billing) certificate as issued', () => {
    const events = buildTimeline({ attempt: attempt({ status: 'passed' }), certificate: { locked: true } })
    expect(events.some((e) => e.action === 'Approved')).toBe(false)
  })
})
