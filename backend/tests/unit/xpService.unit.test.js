import { describe, it, expect } from 'vitest'
import { ObjectId } from 'mongodb'
import { awardXp, examXp, XP_AMOUNTS } from '../../services/xpService.js'

// Minimal in-memory stand-in for the two collections awardXp touches. It models
// the one behavior that matters here: the unique (userId, kind, sourceId) index.
const makeDb = ({ hasProgress = true } = {}) => {
  const awards = []
  const progress = hasProgress ? { xpTotal: 0 } : null
  const same = (a, b) => a.userId.equals(b.userId) && a.kind === b.kind && a.sourceId === b.sourceId
  const collections = {
    xpAwards: {
      createIndex: async () => {},
      insertOne: async (doc) => {
        if (awards.some((a) => same(a, doc))) throw Object.assign(new Error('dup'), { code: 11000 })
        awards.push({ _id: new ObjectId(), ...doc })
      },
      findOneAndUpdate: async (filter, update) => {
        const row = awards.find((a) => (filter._id ? a._id.equals(filter._id) : same(a, filter)) && a.applied === filter.applied)
        if (!row) return null
        const before = { ...row }
        Object.assign(row, update.$set)
        return before
      },
      updateOne: async (filter, update) => {
        const row = awards.find((a) => a._id.equals(filter._id))
        Object.assign(row, update.$set)
        for (const key of Object.keys(update.$unset ?? {})) delete row[key]
      },
    },
    userProgress: {
      updateOne: async (_filter, update) => {
        if (!progress) return { matchedCount: 0 }
        progress.xpTotal += update.$inc.xpTotal
        return { matchedCount: 1 }
      },
    },
  }
  return { db: { collection: (name) => collections[name] }, awards, progress }
}

const exam = { kind: 'exam', sourceId: 'api-dev:1', amount: 50 }

describe('examXp', () => {
  it('pays the base amount below 90 and a bonus from 90', () => {
    expect(examXp(80)).toBe(XP_AMOUNTS.exam)
    expect(examXp(90)).toBe(XP_AMOUNTS.exam + XP_AMOUNTS.examHighScoreBonus)
  })
})

describe('awardXp', () => {
  it('credits XP once and records the award', async () => {
    const { db, awards, progress } = makeDb()
    const userId = new ObjectId()
    expect(await awardXp(db, userId, exam)).toEqual({ awarded: true, amount: 50 })
    expect(progress.xpTotal).toBe(50)
    expect(awards).toHaveLength(1)
    expect(awards[0].applied).toBe(true)
  })

  it('awards nothing the second time for the same milestone', async () => {
    const { db, progress } = makeDb()
    const userId = new ObjectId()
    await awardXp(db, userId, exam)
    expect(await awardXp(db, userId.toString(), exam)).toEqual({ awarded: false, amount: 0 })
    expect(progress.xpTotal).toBe(50)
  })

  it('does not double-credit when two awards race', async () => {
    const { db, progress } = makeDb()
    const userId = new ObjectId()
    await Promise.all([awardXp(db, userId, exam), awardXp(db, userId, exam)])
    expect(progress.xpTotal).toBe(50)
  })

  it('treats a different layer as a new milestone', async () => {
    const { db, progress } = makeDb()
    const userId = new ObjectId()
    await awardXp(db, userId, exam)
    await awardXp(db, userId, { ...exam, sourceId: 'api-dev:2' })
    expect(progress.xpTotal).toBe(100)
  })

  it('releases the claim when there is no progress document, so a later call can finish', async () => {
    const { db, awards } = makeDb({ hasProgress: false })
    await expect(awardXp(db, new ObjectId(), exam)).rejects.toThrow('No userProgress')
    expect(awards[0].applied).toBe(false)
  })
})
