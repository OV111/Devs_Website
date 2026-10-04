import { describe, it, expect } from 'vitest'
import { nodeState } from '../../../src/features/capstone/lib/nodeState.js'

const entry = { trackId: 'api-dev', briefTitle: 'Notes API', summary: 'Build a notes API.', published: true }
const mine = (state, passed = 10, total = 10) => ({ state, eligibility: { passed, total } })

describe('roadmap capstone node', () => {
  it('is "coming soon" and closed for a track without a published capstone', () => {
    const s = nodeState({ entry: undefined, isMember: true, mine: null })
    expect(s).toMatchObject({ kind: 'coming_soon', interactive: false })
  })

  it('previews a capstone that exists but is not published yet: its own text, never openable', () => {
    const draft = { ...entry, published: false }
    for (const isMember of [false, true]) {
      const s = nodeState({ entry: draft, isMember, mine: mine('ready') })
      expect(s).toMatchObject({ kind: 'coming_soon', interactive: false, title: 'Notes API', hint: 'Build a notes API.' })
    }
  })

  it('is locked and closed for a guest', () => {
    expect(nodeState({ entry, isMember: false, mine: null })).toMatchObject({ kind: 'locked', interactive: false })
  })

  it('is closed for a member who has not passed every exam, and says how far they are', () => {
    const s = nodeState({ entry, isMember: true, mine: mine('locked', 7) })
    expect(s).toMatchObject({ kind: 'locked', interactive: false })
    expect(s.hint).toContain('7/10 layer exams passed')
  })

  it('stays closed while the learner\'s state has not loaded (or failed)', () => {
    expect(nodeState({ entry, isMember: true, mine: null })).toMatchObject({ kind: 'locked', interactive: false })
  })

  it.each(['ready', 'in_progress', 'passed', 'failed'])('opens once exams are passed: %s', (state) => {
    expect(nodeState({ entry, isMember: true, mine: mine(state) })).toMatchObject({ kind: state, interactive: true })
  })

  it('never opens without a published capstone, even for a learner who passed everything', () => {
    expect(nodeState({ entry: undefined, isMember: true, mine: mine('ready') }).interactive).toBe(false)
  })
})
