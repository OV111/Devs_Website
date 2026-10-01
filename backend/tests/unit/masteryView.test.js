import { describe, it, expect } from 'vitest'
import { buildMasteryView, summarize } from '../../modules/mastery/lib/masteryView.js'

const topic = (over = {}) => ({
  slug: 'jwt-signature',
  title: 'JWT Signature',
  status: 'shaky',
  path: 'backend',
  layer: 'node-dev-6',
  examScore: 60,
  teachBackScore: 40,
  failCount: 2,
  misconceptions: [],
  lastEvidenceAt: new Date('2026-10-01T00:00:00Z'),
  ...over,
})

const reinforce = { action: 'reinforce', topicSlug: 'jwt-signature', title: 'JWT Signature', reason: 'Failed 2 time(s)' }

describe('summarize', () => {
  it('counts each status', () => {
    const s = summarize([
      topic({ status: 'solid' }),
      topic({ status: 'solid' }),
      topic({ status: 'shaky' }),
      topic({ status: 'developing' }),
      topic({ status: 'untested' }),
    ])
    expect(s).toMatchObject({ total: 5, solid: 2, shaky: 1, developing: 1, untested: 1 })
  })

  it('leaves untested topics out of percentSolid (not tested is not failed)', () => {
    // 2 solid of 4 tested = 50%, regardless of the untested one
    const s = summarize([
      topic({ status: 'solid' }),
      topic({ status: 'solid' }),
      topic({ status: 'shaky' }),
      topic({ status: 'developing' }),
      topic({ status: 'untested' }),
    ])
    expect(s.percentSolid).toBe(50)
  })

  it('is 0% (not NaN) with nothing tested yet', () => {
    expect(summarize([]).percentSolid).toBe(0)
    expect(summarize([topic({ status: 'untested' })]).percentSolid).toBe(0)
  })

  it('ignores an unknown status instead of crashing', () => {
    expect(summarize([topic({ status: 'weird' })])).toMatchObject({ total: 1, solid: 0 })
  })
})

describe('buildMasteryView — free vs Pro', () => {
  it('free (detail:false) gets the summary and next step but NO topic list', () => {
    const view = buildMasteryView({ topics: [topic(), topic({ slug: 'b' })], nextAction: reinforce, detail: false })

    expect(view.detail).toBe(false)
    expect(view.topics).toEqual([])
    expect(view.lockedTopicCount).toBe(2)
    expect(view.summary.total).toBe(2)
    expect(view.nextAction).toMatchObject({ action: 'reinforce', title: 'JWT Signature' })
  })

  it('free view leaks nothing topic-specific beyond the single next step', () => {
    const view = buildMasteryView({
      topics: [topic({ misconceptions: ['sig-encrypts'] }), topic({ slug: 'secret-topic', title: 'Secret Topic' })],
      nextAction: reinforce,
      detail: false,
    })
    const json = JSON.stringify(view)
    expect(json).not.toContain('Secret Topic')
    expect(json).not.toContain('sig-encrypts')
  })

  it('Pro (detail:true) gets every topic with scores and layer', () => {
    const view = buildMasteryView({ topics: [topic()], nextAction: reinforce, detail: true })
    expect(view.lockedTopicCount).toBe(0)
    expect(view.topics[0]).toMatchObject({
      slug: 'jwt-signature',
      status: 'shaky',
      examScore: 60,
      teachBackScore: 40,
      failCount: 2,
      layer: { id: 'node-dev-6' },
    })
  })
})

describe('buildMasteryView — joins', () => {
  it('adds layer titles from the layer map', () => {
    const layers = new Map([['node-dev-6', { title: 'Authentication & Security', trackId: 'node-dev', order: 6 }]])
    const view = buildMasteryView({ topics: [topic()], nextAction: null, detail: true, layers })
    expect(view.topics[0].layer).toEqual({
      id: 'node-dev-6',
      title: 'Authentication & Security',
      trackId: 'node-dev',
      order: 6,
    })
  })

  it('shows the wrong belief but NEVER the authored correction', () => {
    const concepts = new Map([
      [
        'jwt-signature',
        {
          misconceptions: [
            { id: 'sig-encrypts', description: 'The signature encrypts the payload', correction: 'It only proves integrity' },
          ],
        },
      ],
    ])
    const view = buildMasteryView({
      topics: [topic({ misconceptions: ['sig-encrypts'] })],
      nextAction: null,
      detail: true,
      concepts,
    })

    expect(view.topics[0].misconceptions).toEqual([
      { id: 'sig-encrypts', description: 'The signature encrypts the payload' },
    ])
    expect(JSON.stringify(view)).not.toContain('It only proves integrity')
  })

  it('keeps a misconception with no authored concept (description null) rather than dropping it', () => {
    const view = buildMasteryView({
      topics: [topic({ misconceptions: ['unknown-id'] })],
      nextAction: null,
      detail: true,
    })
    expect(view.topics[0].misconceptions).toEqual([{ id: 'unknown-id', description: null }])
  })

  it('tolerates a topic with no layer (e.g. confusion logged in mentor chat)', () => {
    const view = buildMasteryView({ topics: [topic({ layer: null, path: null })], nextAction: null, detail: true })
    expect(view.topics[0].layer).toBeNull()
  })
})

describe('buildMasteryView — next step target', () => {
  it('points at the layer exam when the focus topic has a layer', () => {
    const view = buildMasteryView({ topics: [topic()], nextAction: reinforce, detail: false })
    expect(view.nextAction.target).toEqual({ kind: 'exam', layerId: 'node-dev-6', path: 'backend' })
  })

  it('falls back to the mentor when the topic has no layer to test', () => {
    const view = buildMasteryView({
      topics: [topic({ layer: null, path: null })],
      nextAction: reinforce,
      detail: false,
    })
    expect(view.nextAction.target).toEqual({ kind: 'mentor' })
  })

  it.each(['start', 'advance'])('sends "%s" to the roadmap', (action) => {
    const view = buildMasteryView({ topics: [], nextAction: { action, title: null, reason: 'x' }, detail: true })
    expect(view.nextAction.target).toEqual({ kind: 'roadmap' })
  })

  it('handles no next action at all', () => {
    expect(buildMasteryView({ topics: [], nextAction: null, detail: true }).nextAction).toBeNull()
  })
})
