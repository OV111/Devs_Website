import { describe, it, expect, vi } from 'vitest'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import process from 'node:process'
import { getAuthToken, getFollowersData, getFollowingData } from '../../services/followService.js'

// setup.js sets JWT_Secret before this runs
const SECRET = process.env.JWT_Secret || 'test-secret-key-for-unit-tests-only'
const VALID_OID = '507f1f77bcf86cd799439011'
const OTHER_OID = '507f1f77bcf86cd799439022'

// ─── helpers ────────────────────────────────────────────────────────────────

const makeValidToken = (id = VALID_OID) =>
  jwt.sign({ id }, SECRET, { expiresIn: '1h' })

/**
 * Build a mock DB whose collections return the provided data.
 * Used by getFollowersData / getFollowingData which accept db as a param.
 */
const makeDb = ({
  followDocs = [],
  followersCount = 0,
  followingCount = 0,
  userDocs = [],
  statsDocs = [],
} = {}) => {
  const followsCollection = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue(followDocs),
    }),
    // first call → followersCount / followingCount (order depends on the function)
    countDocuments: vi.fn()
      .mockResolvedValueOnce(followersCount)
      .mockResolvedValueOnce(followingCount),
  }
  const usersCollection = {
    find: vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue(userDocs),
    }),
  }
  const usersStatsCollection = {
    find: vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue(statsDocs),
    }),
  }
  return {
    collection: vi.fn((name) => {
      if (name === 'follows') return followsCollection
      if (name === 'users') return usersCollection
      if (name === 'usersStats') return usersStatsCollection
    }),
  }
}

// ─────────────────────────────────────────────
// getAuthToken
// ─────────────────────────────────────────────
describe('getAuthToken', () => {
  it('returns 403 when authorization header is absent', () => {
    const result = getAuthToken(undefined)
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
  })

  it('returns 403 when authorization header is empty', () => {
    const result = getAuthToken('')
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
  })

  it('returns 403 when header does not start with "Bearer "', () => {
    const result = getAuthToken('Token some-token')
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
    expect(result.message).toMatch(/missing or invalid/i)
  })

  it('returns 403 when token after "Bearer " is empty', () => {
    const result = getAuthToken('Bearer ')
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
    expect(result.message).toMatch(/token is required/i)
  })

  it('returns 403 for an invalid JWT', () => {
    const result = getAuthToken('Bearer invalid.jwt.value')
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
    // verifyToken catches the error internally and returns null,
    // so getAuthToken hits the !payload?.id branch
    expect(result.message).toMatch(/invalid token payload/i)
  })

  it('returns 403 for an expired JWT', () => {
    const expired = jwt.sign(
      { id: VALID_OID, exp: Math.floor(Date.now() / 1000) - 10 },
      SECRET,
    )
    const result = getAuthToken(`Bearer ${expired}`)
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
  })

  it('returns 403 for a JWT signed with a different secret', () => {
    const foreign = jwt.sign({ id: VALID_OID }, 'wrong-secret')
    const result = getAuthToken(`Bearer ${foreign}`)
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
  })

  it('returns 403 when the JWT payload has no id field', () => {
    const noId = jwt.sign({ username: 'testuser' }, SECRET)
    const result = getAuthToken(`Bearer ${noId}`)
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
    expect(result.message).toMatch(/invalid token payload/i)
  })

  it('returns ok:true with userId and userObjectId for a valid JWT', () => {
    const token = makeValidToken(VALID_OID)
    const result = getAuthToken(`Bearer ${token}`)

    expect(result.ok).toBe(true)
    expect(result.status).toBe(200)
    expect(result.userId).toBe(VALID_OID)
    expect(result.userObjectId).toBeInstanceOf(ObjectId)
    expect(result.userObjectId.toString()).toBe(VALID_OID)
  })

  it('includes the full decoded payload in the result', () => {
    const token = makeValidToken(VALID_OID)
    const result = getAuthToken(`Bearer ${token}`)
    expect(result.payload).toMatchObject({ id: VALID_OID })
  })
})

// ─────────────────────────────────────────────
// getFollowersData — null / undefined userId guard
// ─────────────────────────────────────────────
describe('getFollowersData — null userId guard', () => {
  it('returns empty defaults when userId is null', async () => {
    const result = await getFollowersData({ userId: null, db: null, page: 1, limit: 10 })
    expect(result).toMatchObject({
      followers: [],
      followersCount: 0,
      followingCount: 0,
      page: 1,
      limit: 25,
      total: 0,
      hasMore: false,
    })
  })

  it('returns empty defaults when userId is undefined', async () => {
    const result = await getFollowersData({ userId: undefined, db: null })
    expect(result.followers).toEqual([])
    expect(result.hasMore).toBe(false)
  })
})

// ─────────────────────────────────────────────
// getFollowersData — pagination normalisation
// ─────────────────────────────────────────────
describe('getFollowersData — pagination normalisation', () => {
  const userId = new ObjectId(VALID_OID)

  it('normalises page 0 to 1', async () => {
    const db = makeDb()
    const result = await getFollowersData({ userId, db, page: 0, limit: 10 })
    expect(result.page).toBe(1)
  })

  it('normalises negative page to 1', async () => {
    const db = makeDb()
    const result = await getFollowersData({ userId, db, page: -5, limit: 10 })
    expect(result.page).toBe(1)
  })

  it('normalises non-numeric page to 1', async () => {
    const db = makeDb()
    const result = await getFollowersData({ userId, db, page: 'abc', limit: 10 })
    expect(result.page).toBe(1)
  })

  it('caps limit at 25', async () => {
    const db = makeDb()
    const result = await getFollowersData({ userId, db, page: 1, limit: 999 })
    expect(result.limit).toBe(25)
  })

  it('uses default limit of 25 when limit is not provided', async () => {
    const db = makeDb()
    const result = await getFollowersData({ userId, db, page: 1, limit: undefined })
    expect(result.limit).toBe(25)
  })
})

// ─────────────────────────────────────────────
// getFollowersData — data merging & hasMore
// ─────────────────────────────────────────────
describe('getFollowersData — data merging', () => {
  const userId = new ObjectId(VALID_OID)
  const followerOid = new ObjectId(OTHER_OID)

  it('returns empty followers array when no follow docs exist', async () => {
    const db = makeDb({ followDocs: [], followersCount: 0, followingCount: 0 })
    const result = await getFollowersData({ userId, db, page: 1, limit: 10 })
    expect(result.followers).toEqual([])
    expect(result.hasMore).toBe(false)
  })

  it('merges user data with stats correctly', async () => {
    const followerDoc = { followerId: followerOid }
    const userDoc = { _id: followerOid, username: 'followeruser' }
    const statsDoc = { userId: followerOid, followersCount: 3 }

    const db = makeDb({
      followDocs: [followerDoc],
      followersCount: 1,
      followingCount: 2,
      userDocs: [userDoc],
      statsDocs: [statsDoc],
    })

    const result = await getFollowersData({ userId, db, page: 1, limit: 10 })

    expect(result.followers).toHaveLength(1)
    expect(result.followers[0].username).toBe('followeruser')
    expect(result.followers[0].stats).toMatchObject({ followersCount: 3 })
    expect(result.followersCount).toBe(1)
    expect(result.followingCount).toBe(2)
  })

  it('sets hasMore:true when more pages exist', async () => {
    const ids = [new ObjectId(), new ObjectId()]
    const followDocs = ids.map((id) => ({ followerId: id }))
    const userDocs = ids.map((id) => ({ _id: id, username: `user_${id}` }))

    const db = makeDb({
      followDocs,
      followersCount: 10, // total 10, returned 2 → more pages
      followingCount: 0,
      userDocs,
      statsDocs: [],
    })

    const result = await getFollowersData({ userId, db, page: 1, limit: 2 })
    expect(result.hasMore).toBe(true)
  })

  it('sets hasMore:false on the last page', async () => {
    const id = new ObjectId()
    const db = makeDb({
      followDocs: [{ followerId: id }],
      followersCount: 1,
      followingCount: 0,
      userDocs: [{ _id: id, username: 'lastuser' }],
      statsDocs: [],
    })

    const result = await getFollowersData({ userId, db, page: 1, limit: 5 })
    expect(result.hasMore).toBe(false)
  })
})

// ─────────────────────────────────────────────
// getFollowingData — null userId guard
// ─────────────────────────────────────────────
describe('getFollowingData — null userId guard', () => {
  it('returns empty defaults when userId is null', async () => {
    const result = await getFollowingData({ userId: null, db: null, page: 1, limit: 10 })
    expect(result).toMatchObject({
      following: [],
      followersCount: 0,
      followingCount: 0,
      page: 1,
      limit: 25,
      total: 0,
      hasMore: false,
    })
  })
})

// ─────────────────────────────────────────────
// getFollowingData — pagination normalisation
// ─────────────────────────────────────────────
describe('getFollowingData — pagination normalisation', () => {
  const userId = new ObjectId(VALID_OID)

  it('normalises page 0 to 1', async () => {
    const db = makeDb()
    const result = await getFollowingData({ userId, db, page: 0, limit: 10 })
    expect(result.page).toBe(1)
  })

  it('caps limit at 25', async () => {
    const db = makeDb()
    const result = await getFollowingData({ userId, db, page: 1, limit: 100 })
    expect(result.limit).toBe(25)
  })
})

// ─────────────────────────────────────────────
// getFollowingData — data merging & hasMore
// ─────────────────────────────────────────────
describe('getFollowingData — data merging', () => {
  const userId = new ObjectId(VALID_OID)

  it('returns empty following array when no follow docs exist', async () => {
    const db = makeDb({ followDocs: [], followersCount: 0, followingCount: 0 })
    const result = await getFollowingData({ userId, db, page: 1, limit: 10 })
    expect(result.following).toEqual([])
    expect(result.hasMore).toBe(false)
  })

  it('merges user data with stats correctly', async () => {
    const followingOid = new ObjectId(OTHER_OID)
    const followDoc = { followingId: followingOid }
    const userDoc = { _id: followingOid, username: 'followinguser' }
    const statsDoc = { userId: followingOid, postsCount: 5 }

    const db = makeDb({
      followDocs: [followDoc],
      followersCount: 1,
      followingCount: 1,
      userDocs: [userDoc],
      statsDocs: [statsDoc],
    })

    const result = await getFollowingData({ userId, db, page: 1, limit: 10 })

    expect(result.following).toHaveLength(1)
    expect(result.following[0].username).toBe('followinguser')
    expect(result.following[0].stats).toMatchObject({ postsCount: 5 })
  })

  it('sets hasMore:true when more pages exist', async () => {
    const ids = [new ObjectId(), new ObjectId()]
    const followDocs = ids.map((id) => ({ followingId: id }))
    const userDocs = ids.map((id) => ({ _id: id, username: `user_${id}` }))

    // In getFollowingData, countDocuments order is: followingCount first, followersCount second.
    // makeDb's first mockResolvedValueOnce maps to the first countDocuments call.
    const db = makeDb({
      followDocs,
      followersCount: 20, // first countDocuments call → followingCount in getFollowingData
      followingCount: 0,  // second countDocuments call → followersCount in getFollowingData
      userDocs,
      statsDocs: [],
    })

    const result = await getFollowingData({ userId, db, page: 1, limit: 2 })
    expect(result.hasMore).toBe(true)
  })
})
