/**
 * Integration tests for the coding-challenges progress reads.
 *
 * These cover the parts that are pure data-shape reasoning across four
 * collections — readiness, the leaderboard's scoring rule, and the
 * done/inProgress/hot decoration on the list — which is exactly where a
 * silent wrong-collection or wrong-field bug would otherwise ship looking
 * fine. Real MongoDB via mongodb-memory-server, so the aggregation pipeline
 * and $lookup joins are genuinely executed, not mocked.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import {
  getReadinessService,
  getLeaderboardService,
} from '../../modules/coding-challenges/services/progressService.js'
import { listChallengesService } from '../../modules/coding-challenges/services/challengeService.js'

let mongod
let client
let db

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  await Promise.all(
    [
      'challenges',
      'challengeResults',
      'challenge_attempts',
      'roadmap_layers',
      'userProgress',
      'weakSpots',
      'users',
      'usersStats',
    ].map((c) => db.collection(c).deleteMany({})),
  )
})

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const LAYER = 'api-dev-3'
const TRACK = 'api-dev'

const makeChallenge = (slug, overrides = {}) => ({
  slug,
  trackId: TRACK,
  layerId: LAYER,
  status: 'published',
  type: 'CODE',
  difficulty: 'med',
  title: `Title ${slug}`,
  summary: `Summary ${slug}`,
  tags: ['async'],
  estimatedMins: 25,
  xp: 45,
  stats: { solves: 0 },
  ...overrides,
})

const solveResult = (userId, slug, overrides = {}) => ({
  userId,
  challengeId: slug,
  path: TRACK,
  layer: LAYER,
  status: 'solved',
  xpEarned: 45,
  solvedAt: new Date(),
  ...overrides,
})

const seedLayer = () =>
  db.collection('roadmap_layers').insertOne({
    layerId: LAYER,
    trackId: TRACK,
    order: 3,
    title: 'Error handling',
  })

const seedProgress = (userId, overrides = {}) =>
  db.collection('userProgress').insertOne({
    userId,
    activePath: TRACK,
    currentLayer: 3,
    xpTotal: 0,
    ...overrides,
  })

const seedUser = async (username, overrides = {}) => {
  const { insertedId } = await db.collection('users').insertOne({
    username,
    firstName: username[0].toUpperCase() + username.slice(1),
    lastName: 'Tester',
    email: `${username}@test.com`,
    ...overrides,
  })
  return insertedId
}

// ─────────────────────────────────────────────
// Readiness
// ─────────────────────────────────────────────
describe('getReadinessService', () => {
  it('reports hasLayer:false when the user has no active path', async () => {
    const userId = new ObjectId()
    const result = await getReadinessService(db, userId.toString())
    expect(result).toEqual({ hasLayer: false })
  })

  it('reports hasLayer:false when the active path has no matching layer doc', async () => {
    const userId = new ObjectId()
    await seedProgress(userId) // no roadmap_layers seeded
    const result = await getReadinessService(db, userId.toString())
    expect(result.hasLayer).toBe(false)
  })

  it('computes percent/solved/toGo against the current layer only', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db
      .collection('challenges')
      .insertMany([
        makeChallenge('a'),
        makeChallenge('b'),
        makeChallenge('c'),
        makeChallenge('d'),
        // A different layer must not count toward this layer's readiness.
        makeChallenge('other', { layerId: 'api-dev-4' }),
      ])
    await db
      .collection('challengeResults')
      .insertMany([solveResult(userId, 'a'), solveResult(userId, 'b')])

    const result = await getReadinessService(db, userId.toString())

    expect(result.hasLayer).toBe(true)
    expect(result.total).toBe(4)
    expect(result.solved).toBe(2)
    expect(result.toGo).toBe(2)
    expect(result.percent).toBe(50)
    expect(result.layerId).toBe(LAYER)
    expect(result.layerOrder).toBe(3)
  })

  it('ignores another user\'s solves', async () => {
    const userId = new ObjectId()
    const otherId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db.collection('challenges').insertMany([makeChallenge('a'), makeChallenge('b')])
    await db.collection('challengeResults').insertMany([
      solveResult(otherId, 'a'),
      solveResult(otherId, 'b'),
    ])

    const result = await getReadinessService(db, userId.toString())
    expect(result.solved).toBe(0)
    expect(result.percent).toBe(0)
  })

  it('does not count an attempted-but-unsolved result as solved', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db.collection('challenges').insertMany([makeChallenge('a'), makeChallenge('b')])
    await db
      .collection('challengeResults')
      .insertOne(solveResult(userId, 'a', { status: 'attempted', solvedAt: null }))

    const result = await getReadinessService(db, userId.toString())
    expect(result.solved).toBe(0)
  })

  it('names an unresolved weak topic that still has unsolved challenges', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db
      .collection('challenges')
      .insertMany([makeChallenge('a', { tags: ['errors'] }), makeChallenge('b')])
    await db.collection('weakSpots').insertOne({
      userId,
      topic: 'ERRORS', // stored uppercase; tags are lowercase
      failCount: 3,
      resolvedAt: null,
    })

    const result = await getReadinessService(db, userId.toString())
    expect(result.message).toContain('errors')
  })

  it('reports 100% and an exam-ready message once every challenge is solved', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db.collection('challenges').insertMany([makeChallenge('a'), makeChallenge('b')])
    await db
      .collection('challengeResults')
      .insertMany([solveResult(userId, 'a'), solveResult(userId, 'b')])

    const result = await getReadinessService(db, userId.toString())
    expect(result.percent).toBe(100)
    expect(result.toGo).toBe(0)
    expect(result.message).toMatch(/exam-ready/)
  })

  it('does not divide by zero when the layer has no challenges', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)

    const result = await getReadinessService(db, userId.toString())
    expect(result.total).toBe(0)
    expect(result.percent).toBe(0)
    expect(result.toGo).toBe(0)
  })
})

// ─────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────
describe('getLeaderboardService', () => {
  it('ranks by XP earned from solves, highest first', async () => {
    const me = await seedUser('me')
    const rival = await seedUser('rival')
    await seedLayer()
    await seedProgress(me)

    await db.collection('challengeResults').insertMany([
      solveResult(me, 'a', { xpEarned: 50 }),
      solveResult(rival, 'b', { xpEarned: 120 }),
    ])

    const { rows } = await getLeaderboardService(db, me.toString())

    expect(rows.map((r) => r.name)).toEqual(['@rival', '@me'])
    expect(rows[0].rank).toBe(1)
    expect(rows[0].score).toBe(120)
    expect(rows[1].you).toBe(true)
    expect(rows[0].you).toBe(false)
  })

  it('sums multiple solves per user', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db.collection('challengeResults').insertMany([
      solveResult(me, 'a', { xpEarned: 30 }),
      solveResult(me, 'b', { xpEarned: 45 }),
    ])

    const { rows } = await getLeaderboardService(db, me.toString())
    expect(rows[0].score).toBe(75)
    expect(rows[0].solves).toBe(2)
  })

  it('excludes solves older than the window', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db.collection('challengeResults').insertOne(
      solveResult(me, 'old', {
        solvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      }),
    )

    const week = await getLeaderboardService(db, me.toString(), { range: '7d' })
    expect(week.rows).toHaveLength(0)

    // The same row is in range once the window widens — proving it was the
    // window that excluded it, not a broken match.
    const all = await getLeaderboardService(db, me.toString(), { range: 'all' })
    expect(all.rows).toHaveLength(1)
  })

  it('excludes solves from a different layer when layer-scoped', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db
      .collection('challengeResults')
      .insertOne(solveResult(me, 'a', { layer: 'api-dev-9' }))

    const scoped = await getLeaderboardService(db, me.toString(), { scope: 'layer' })
    expect(scoped.rows).toHaveLength(0)

    const global = await getLeaderboardService(db, me.toString(), { scope: 'global' })
    expect(global.rows).toHaveLength(1)
    expect(global.scope).toBe('global')
  })

  it('ignores attempted-but-unsolved results', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db
      .collection('challengeResults')
      .insertOne(solveResult(me, 'a', { status: 'attempted' }))

    const { rows } = await getLeaderboardService(db, me.toString())
    expect(rows).toHaveLength(0)
  })

  it('appends the user\'s own row when they place outside the top slice', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)

    // Six rivals all above the user, with a limit of 5.
    const rivals = []
    for (let i = 0; i < 6; i++) rivals.push(await seedUser(`rival${i}`))
    await db.collection('challengeResults').insertMany([
      ...rivals.map((id, i) => solveResult(id, `r${i}`, { xpEarned: 1000 + i })),
      solveResult(me, 'mine', { xpEarned: 10 }),
    ])

    const { rows } = await getLeaderboardService(db, me.toString(), { limit: 5 })

    expect(rows).toHaveLength(6) // 5 leaders + the user's own row
    const self = rows.at(-1)
    expect(self.you).toBe(true)
    expect(self.rank).toBe(7) // real rank, not a renumbered 6th
  })

  it('does not duplicate the user when they are already in the top slice', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db
      .collection('challengeResults')
      .insertOne(solveResult(me, 'a', { xpEarned: 99 }))

    const { rows } = await getLeaderboardService(db, me.toString(), { limit: 5 })
    expect(rows.filter((r) => r.you)).toHaveLength(1)
  })

  it('joins the avatar from usersStats', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db
      .collection('usersStats')
      .insertOne({ userId: me, profileImage: 'https://cdn/upload/me.png' })
    await db.collection('challengeResults').insertOne(solveResult(me, 'a'))

    const { rows } = await getLeaderboardService(db, me.toString())
    expect(rows[0].profileImage).toBe('https://cdn/upload/me.png')
  })

  it('falls back to an initial when there is no avatar', async () => {
    const me = await seedUser('me')
    await seedLayer()
    await seedProgress(me)
    await db.collection('challengeResults').insertOne(solveResult(me, 'a'))

    const { rows } = await getLeaderboardService(db, me.toString())
    expect(rows[0].profileImage).toBeNull()
    expect(rows[0].initial).toBe('M')
  })
})

// ─────────────────────────────────────────────
// List decoration: done / inProgress / hot
// ─────────────────────────────────────────────
describe('listChallengesService decoration', () => {
  const bySlug = (items, slug) => items.find((i) => i.slug === slug)

  it('marks solved challenges done, and never also hot', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db.collection('challenges').insertMany([makeChallenge('a'), makeChallenge('b')])
    await db.collection('challengeResults').insertOne(solveResult(userId, 'a'))

    const { items } = await listChallengesService(db, {}, userId.toString())

    expect(bySlug(items, 'a').done).toBe(true)
    // Solved work is never "recommended next" — that was the whole bug with
    // the old always-false hot flag being replaced by an always-true one.
    expect(bySlug(items, 'a').hot).toBe(false)
    expect(bySlug(items, 'b').done).toBe(false)
  })

  it('marks a started-but-unsolved challenge inProgress', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    const { insertedIds } = await db
      .collection('challenges')
      .insertMany([makeChallenge('a'), makeChallenge('b')])
    await db.collection('challenge_attempts').insertOne({
      userId,
      challengeId: insertedIds[0],
      challengeSlug: 'a',
      code: [],
      startedAt: new Date(),
    })

    const { items } = await listChallengesService(db, {}, userId.toString())

    expect(bySlug(items, 'a').inProgress).toBe(true)
    expect(bySlug(items, 'b').inProgress).toBe(false)
  })

  it('does not report a solved challenge as still in progress', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    const { insertedIds } = await db
      .collection('challenges')
      .insertMany([makeChallenge('a')])
    await db.collection('challenge_attempts').insertOne({
      userId,
      challengeId: insertedIds[0],
      challengeSlug: 'a',
      code: [],
      startedAt: new Date(),
    })
    await db.collection('challengeResults').insertOne(solveResult(userId, 'a'))

    const { items } = await listChallengesService(db, {}, userId.toString())
    expect(bySlug(items, 'a').done).toBe(true)
    expect(bySlug(items, 'a').inProgress).toBe(false)
  })

  it('flags unsolved challenges in the active layer as hot', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db.collection('challenges').insertMany([
      makeChallenge('current'),
      makeChallenge('elsewhere', { layerId: 'api-dev-7', tags: ['unrelated'] }),
    ])

    const { items } = await listChallengesService(db, {}, userId.toString())

    expect(bySlug(items, 'current').hot).toBe(true)
    expect(bySlug(items, 'elsewhere').hot).toBe(false)
  })

  it('flags a weak-topic match outside the active layer as hot', async () => {
    const userId = new ObjectId()
    await seedLayer()
    await seedProgress(userId)
    await db
      .collection('challenges')
      .insertMany([makeChallenge('far', { layerId: 'api-dev-7', tags: ['errors'] })])
    await db
      .collection('weakSpots')
      .insertOne({ userId, topic: 'ERRORS', failCount: 2, resolvedAt: null })

    const { items } = await listChallengesService(db, {}, userId.toString())
    expect(bySlug(items, 'far').hot).toBe(true)
  })

  it('leaves everything cold for a user with no roadmap progress', async () => {
    const userId = new ObjectId()
    await db.collection('challenges').insertMany([makeChallenge('a'), makeChallenge('b')])

    const { items } = await listChallengesService(db, {}, userId.toString())
    expect(items.every((i) => i.hot === false)).toBe(true)
  })

  it('never leaks solution or hiddenTests through the list projection', async () => {
    const userId = new ObjectId()
    await db.collection('challenges').insertOne(
      makeChallenge('secret', {
        solution: { code: 'the answer', explanation: 'because' },
        hiddenTests: [{ name: 't', code: 'expect(1).toBe(1)' }],
      }),
    )

    const { items } = await listChallengesService(db, {}, userId.toString())
    expect(items[0].solution).toBeUndefined()
    expect(items[0].hiddenTests).toBeUndefined()
  })
})
