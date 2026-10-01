import { describe, it, expect } from 'vitest'
import { shuffle, shuffleChoices } from '../../services/examEngineService.js'

describe('shuffleChoices', () => {
  const q = {
    id: 'q1',
    stem: 's',
    topic: 't',
    choices: ['right', 'w1', 'w2', 'w3'],
    answerIdx: 0,
  }

  it('keeps answerIdx pointing at the same choice text', () => {
    for (let i = 0; i < 200; i++) {
      const out = shuffleChoices(q)
      expect(out.choices[out.answerIdx]).toBe('right')
      expect([...out.choices].sort()).toEqual([...q.choices].sort())
    }
  })

  it('does not mutate the source question', () => {
    shuffleChoices(q)
    expect(q.choices).toEqual(['right', 'w1', 'w2', 'w3'])
    expect(q.answerIdx).toBe(0)
  })

  it('spreads the correct answer across all four positions', () => {
    const counts = [0, 0, 0, 0]
    const N = 4000
    for (let i = 0; i < N; i++) counts[shuffleChoices(q).answerIdx]++
    // expected 1000 each; ±20% is far outside normal variance (σ≈27)
    for (const c of counts) expect(c).toBeGreaterThan(800)
    for (const c of counts) expect(c).toBeLessThan(1200)
  })
})

describe('shuffle', () => {
  it('returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5]
    const out = shuffle(input)
    expect(input).toEqual([1, 2, 3, 4, 5])
    expect([...out].sort()).toEqual(input)
  })
})
