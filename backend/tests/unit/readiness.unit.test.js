import { describe, it, expect } from 'vitest'
import { computeReadiness } from '../../modules/readiness/lib/computeReadiness.js'

const none = { mergedPrs: 0, reviewsGiven: 0, defensesPassed: 0, capstonePassed: false, peerAverage: null, deploys: 0, incidentsFixed: 0, debugTasksPassed: 0 }

describe('computeReadiness', () => {
  it('starts at entry with nothing proven', () => {
    const r = computeReadiness(none)
    expect(r.overall).toBe('entry')
    expect(Object.values(r.spheres).every((l) => l === 'none')).toBe(true)
  })

  it('does not count a peer rating that is hidden (null) as collaboration proof', () => {
    expect(computeReadiness(none).spheres.collaboration).toBe('none')
  })

  it('reaches approaching-mid with build, judgment and collaboration shown', () => {
    const r = computeReadiness({ ...none, capstonePassed: true, defensesPassed: 1, reviewsGiven: 1 })
    expect(r.overall).toBe('approaching-mid')
  })

  it('cannot be mid-ready without any debug/ops proof', () => {
    const r = computeReadiness({ ...none, mergedPrs: 9, capstonePassed: true, defensesPassed: 3, reviewsGiven: 9, peerAverage: 4.8 })
    expect(r.spheres.debugOps).toBe('none')
    expect(r.overall).not.toBe('mid-ready')
  })

  it('is mid-ready with every sphere shown and three strong', () => {
    const r = computeReadiness({ mergedPrs: 6, reviewsGiven: 6, defensesPassed: 2, capstonePassed: true, peerAverage: 4.5, deploys: 1, incidentsFixed: 0, debugTasksPassed: 0 })
    expect(r.spheres.debugOps).toBe('shown')
    expect(r.overall).toBe('mid-ready')
  })

  it('derives ownership from the other spheres, not from its own data', () => {
    const r = computeReadiness({ ...none, mergedPrs: 1, defensesPassed: 1 })
    expect(r.spheres.ownership).toBe('shown')
  })
})
