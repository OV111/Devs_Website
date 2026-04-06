/**
 * Integration tests for getFollowersData and getFollowingData.
 *
 * Both functions accept `db` as a parameter so we pass a real MongoClient
 * directly — no need to go through connectDB's singleton.
 * We test actual MongoDB aggregation, cursor chains, and data merging.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import { getFollowersData, getFollowingData } from '../../services/followService.js'

let mongod
let client
let db

// ─────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────
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
  await db.collection('follows').deleteMany({})
  await db.collection('users').deleteMany({})
  await db.collection('usersStats').deleteMany({})
})

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const makeUser = (overrides = {}) => ({
  firstName: 'Test',
  lastName: 'User',
  username: `user_${Date.now()}_${Math.random()}`,
  email: `test_${Date.now()}_${Math.random()}@test.com`,
  ...overrides,
})

const makeStats = (userId, overrides = {}) => ({
  userId,
  followersCount: 0,
  followingsCount: 0,
  postsCount: 0,
  bio: '',
  ...overrides,
})

const insertUser = async (overrides = {}) => {
  const result = await db.collection('users').insertOne(makeUser(overrides))
  const stats = makeStats(result.insertedId)
  await db.collection('usersStats').insertOne(stats)
  return { _id: result.insertedId, ...makeUser(overrides), stats }
}

const insertFollow = (followerId, followingId) =>
  db.collection('follows').insertOne({ followerId, followingId, createdAt: new Date() })

// ─────────────────────────────────────────────
// getFollowersData — integration
// ─────────────────────────────────────────────
describe('getFollowersData — integration', () => {
  it('returns empty defaults when userId is null', async () => {
    const result = await getFollowersData({ userId: null, db, page: 1, limit: 10 })
    expect(result.followers).toEqual([])
    expect(result.followersCount).toBe(0)
    expect(result.hasMore).toBe(false)
  })

  it('returns empty followers when nobody follows the user', async () => {
    const user = await insertUser()
    const result = await getFollowersData({ userId: user._id, db, page: 1, limit: 10 })

    expect(result.followers).toEqual([])
    expect(result.followersCount).toBe(0)
    expect(result.hasMore).toBe(false)
  })

  it('returns the correct follower with merged stats', async () => {
    const target = await insertUser({ firstName: 'Target' })
    const follower = await insertUser({ firstName: 'Follower', username: 'follower_user' })
    await insertFollow(follower._id, target._id)

    const result = await getFollowersData({ userId: target._id, db, page: 1, limit: 10 })

    expect(result.followers).toHaveLength(1)
    expect(result.followersCount).toBe(1)

    const returnedFollower = result.followers[0]
    expect(returnedFollower._id.toString()).toBe(follower._id.toString())
    expect(returnedFollower.stats).not.toBeNull()
    // password must be excluded from the projection
    expect(returnedFollower.password).toBeUndefined()
  })

  it('counts multiple followers correctly', async () => {
    const target = await insertUser()
    const followers = await Promise.all([
      insertUser(),
      insertUser(),
      insertUser(),
    ])
    await Promise.all(followers.map((f) => insertFollow(f._id, target._id)))

    const result = await getFollowersData({ userId: target._id, db, page: 1, limit: 10 })
    expect(result.followersCount).toBe(3)
    expect(result.followers).toHaveLength(3)
  })

  it('returns correct followingCount (how many the target user follows)', async () => {
    const target = await insertUser()
    const other1 = await insertUser()
    const other2 = await insertUser()
    // target follows 2 people, 0 people follow target
    await insertFollow(target._id, other1._id)
    await insertFollow(target._id, other2._id)

    const result = await getFollowersData({ userId: target._id, db, page: 1, limit: 10 })
    expect(result.followersCount).toBe(0)   // nobody follows target
    expect(result.followingCount).toBe(2)   // target follows 2
  })

  it('paginates correctly — page 1 returns first N followers', async () => {
    const target = await insertUser()
    const followers = await Promise.all(Array.from({ length: 5 }, () => insertUser()))
    await Promise.all(followers.map((f) => insertFollow(f._id, target._id)))

    const result = await getFollowersData({ userId: target._id, db, page: 1, limit: 2 })
    expect(result.followers).toHaveLength(2)
    expect(result.total).toBe(5)
    expect(result.hasMore).toBe(true)
  })

  it('paginates correctly — last page sets hasMore:false', async () => {
    const target = await insertUser()
    const followers = await Promise.all(Array.from({ length: 3 }, () => insertUser()))
    await Promise.all(followers.map((f) => insertFollow(f._id, target._id)))

    // page 2 of limit 2 → returns 1 item out of 3 total
    const result = await getFollowersData({ userId: target._id, db, page: 2, limit: 2 })
    expect(result.followers).toHaveLength(1)
    expect(result.hasMore).toBe(false)
  })

  it('does not leak password field from user documents', async () => {
    const target = await insertUser()
    const follower = await insertUser()
    // Manually add a password to the follower doc to verify projection
    await db.collection('users').updateOne(
      { _id: follower._id },
      { $set: { password: 'secret_hash' } }
    )
    await insertFollow(follower._id, target._id)

    const result = await getFollowersData({ userId: target._id, db, page: 1, limit: 10 })
    expect(result.followers[0].password).toBeUndefined()
  })
})

// ─────────────────────────────────────────────
// getFollowingData — integration
// ─────────────────────────────────────────────
describe('getFollowingData — integration', () => {
  it('returns empty defaults when userId is null', async () => {
    const result = await getFollowingData({ userId: null, db, page: 1, limit: 10 })
    expect(result.following).toEqual([])
    expect(result.followingCount).toBe(0)
    expect(result.hasMore).toBe(false)
  })

  it('returns empty following when user follows nobody', async () => {
    const user = await insertUser()
    const result = await getFollowingData({ userId: user._id, db, page: 1, limit: 10 })

    expect(result.following).toEqual([])
    expect(result.followingCount).toBe(0)
    expect(result.hasMore).toBe(false)
  })

  it('returns the correct following user with merged stats', async () => {
    const actor = await insertUser({ firstName: 'Actor' })
    const target = await insertUser({ firstName: 'Target', username: 'target_user' })
    await insertFollow(actor._id, target._id)

    const result = await getFollowingData({ userId: actor._id, db, page: 1, limit: 10 })

    expect(result.following).toHaveLength(1)
    expect(result.followingCount).toBe(1)

    const returned = result.following[0]
    expect(returned._id.toString()).toBe(target._id.toString())
    expect(returned.stats).not.toBeNull()
    expect(returned.password).toBeUndefined()
  })

  it('counts multiple following correctly', async () => {
    const actor = await insertUser()
    const targets = await Promise.all([insertUser(), insertUser(), insertUser()])
    await Promise.all(targets.map((t) => insertFollow(actor._id, t._id)))

    const result = await getFollowingData({ userId: actor._id, db, page: 1, limit: 10 })
    expect(result.followingCount).toBe(3)
    expect(result.following).toHaveLength(3)
  })

  it('returns correct followersCount (how many follow the actor)', async () => {
    const actor = await insertUser()
    const follower1 = await insertUser()
    const follower2 = await insertUser()
    // 2 people follow actor, actor follows nobody
    await insertFollow(follower1._id, actor._id)
    await insertFollow(follower2._id, actor._id)

    const result = await getFollowingData({ userId: actor._id, db, page: 1, limit: 10 })
    expect(result.followingCount).toBe(0)  // actor follows nobody
    expect(result.followersCount).toBe(2)  // 2 people follow actor
  })

  it('paginates correctly — hasMore:true when more pages exist', async () => {
    const actor = await insertUser()
    const targets = await Promise.all(Array.from({ length: 6 }, () => insertUser()))
    await Promise.all(targets.map((t) => insertFollow(actor._id, t._id)))

    const result = await getFollowingData({ userId: actor._id, db, page: 1, limit: 3 })
    expect(result.following).toHaveLength(3)
    expect(result.total).toBe(6)
    expect(result.hasMore).toBe(true)
  })

  it('paginates correctly — last page sets hasMore:false', async () => {
    const actor = await insertUser()
    const targets = await Promise.all(Array.from({ length: 4 }, () => insertUser()))
    await Promise.all(targets.map((t) => insertFollow(actor._id, t._id)))

    // page 2 of limit 3 → returns 1 item out of 4 total
    const result = await getFollowingData({ userId: actor._id, db, page: 2, limit: 3 })
    expect(result.following).toHaveLength(1)
    expect(result.hasMore).toBe(false)
  })

  it('does not leak password field from user documents', async () => {
    const actor = await insertUser()
    const target = await insertUser()
    await db.collection('users').updateOne(
      { _id: target._id },
      { $set: { password: 'secret_hash' } }
    )
    await insertFollow(actor._id, target._id)

    const result = await getFollowingData({ userId: actor._id, db, page: 1, limit: 10 })
    expect(result.following[0].password).toBeUndefined()
  })

  it('mutual follow: both users show up in each other\'s respective lists', async () => {
    const userA = await insertUser()
    const userB = await insertUser()
    await insertFollow(userA._id, userB._id)
    await insertFollow(userB._id, userA._id)

    const aFollowing = await getFollowingData({ userId: userA._id, db, page: 1, limit: 10 })
    const bFollowing = await getFollowingData({ userId: userB._id, db, page: 1, limit: 10 })

    expect(aFollowing.following[0]._id.toString()).toBe(userB._id.toString())
    expect(bFollowing.following[0]._id.toString()).toBe(userA._id.toString())
  })
})
