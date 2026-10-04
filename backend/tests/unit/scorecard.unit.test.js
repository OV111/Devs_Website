import { describe, it, expect } from 'vitest'
import { buildHeadline, buildScorecard } from '../../modules/recruiter/services/scorecardService.js'

const user = { username: 'vahe', firstName: 'Vahe', lastName: 'O' }
const base = {
  user,
  progress: { xpTotal: 120, createdAt: new Date('2026-01-01'), lastActiveAt: new Date('2026-10-01') },
  exams: [
    { path: 'api-dev', layer: 'api-dev-1', layerTitle: 'HTTP', score: 80, passed: true, takenAt: new Date('2026-02-01') },
    { path: 'api-dev', layer: 'api-dev-1', layerTitle: 'HTTP', score: 95, passed: true, takenAt: new Date('2026-03-01') },
    { path: 'api-dev', layer: 'api-dev-2', layerTitle: 'Auth', score: 40, passed: false, takenAt: new Date('2026-04-01') },
  ],
  certificates: [
    { track: { id: 'api-dev', title: 'API' }, verifyPath: '/verify/a', scores: { review: 90, defense: 80 }, issuedAt: new Date(), revoked: false, testData: false },
    { track: { id: 'x', title: 'Revoked' }, verifyPath: '/verify/b', scores: {}, issuedAt: new Date(), revoked: true, testData: false },
    { track: { id: 'y', title: 'Seeded' }, verifyPath: '/verify/c', scores: {}, issuedAt: new Date(), revoked: false, testData: true },
  ],
  teams: [{ name: 'Team 1' }],
  mastery: [
    { title: 'Caching', status: 'solid' },
    { title: 'Race conditions', status: 'shaky' },
    { title: 'Indexes', status: 'developing' },
  ],
}
const all = { exams: true, capstone: true, teams: true, strengths: true }
const build = (show, openToWork = false) => buildScorecard({ ...base, settings: { show, openToWork } })

describe('buildScorecard', () => {
  it('keeps only the best passed score per layer and ignores failures', () => {
    const { exams } = build(all)
    expect(exams).toHaveLength(1)
    expect(exams[0].bestScore).toBe(95)
  })

  it('drops revoked and seeded test certificates', () => {
    const { capstones } = build(all)
    expect(capstones.map((c) => c.verifyPath)).toEqual(['/verify/a'])
  })

  it('lists only solid topics as strengths, never shaky or developing ones', () => {
    expect(build(all).strengths).toEqual(['Caching'])
  })

  it('returns null (not an empty list) for sections the developer hid', () => {
    const card = build({ exams: false, capstone: false, teams: false, strengths: false })
    expect(card.exams).toBeNull()
    expect(card.capstones).toBeNull()
    expect(card.teams).toBeNull()
    expect(card.strengths).toBeNull()
  })

  it('builds a headline only from the shared sections', () => {
    expect(build(all).headline).toBe('1 layer passed · 1 capstone passed · 1 team project')
    expect(build({ ...all, exams: false, teams: false }).headline).toBe('1 capstone passed')
    expect(build({ exams: false, capstone: false, teams: false, strengths: true }).headline).toBeNull()
  })

  it('pluralizes the headline', () => {
    expect(buildHeadline({ exams: [1, 2], capstones: [], teams: [] })).toBe('2 layers passed')
  })

  it('reports open-to-work only when the developer set it', () => {
    expect(build(all).openToWork).toBe(false)
    expect(build(all, true).openToWork).toBe(true)
  })

  it('never includes private account fields', () => {
    const json = JSON.stringify(build(all))
    expect(json).not.toMatch(/email|password|userId|_id/i)
  })
})
