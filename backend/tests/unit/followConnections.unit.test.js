import { describe, it, expect, vi } from 'vitest'
import { ObjectId } from 'mongodb'
import { getFollowersData, getFollowingData } from '../../services/followService.js'

// A tiny fake: the page query (sorted/paged) and the relation query (a filter
// with `$in`) get different answers, like the real collection would give.
const makeDb = ({ pageDocs, edgeDocs = [], users, stats = [], counts = [0, 0] }) => {
  const usersFind = vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue(users) })
  const follows = {
    find: vi.fn((filter) => {
      const isEdgeQuery = filter.followingId?.$in || filter.followerId?.$in
      if (isEdgeQuery) return { toArray: vi.fn().mockResolvedValue(edgeDocs) }
      return {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue(pageDocs),
      }
    }),
    countDocuments: vi.fn().mockResolvedValueOnce(counts[0]).mockResolvedValueOnce(counts[1]),
  }
  const db = {
    collection: (name) =>
      ({
        follows,
        users: { find: usersFind },
        usersStats: { find: vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue(stats) }) },
      })[name],
  }
  return { db, usersFind, follows }
}

const me = new ObjectId()
const a = new ObjectId()
const b = new ObjectId()
const day = (n) => new Date(Date.UTC(2026, 0, n))

describe('connections — privacy', () => {
  it('asks the database for an explicit allow-list of user fields, never "everything but password"', async () => {
    const { db, usersFind } = makeDb({
      pageDocs: [{ followerId: a, createdAt: day(2) }],
      users: [{ _id: a, username: 'a' }],
      counts: [1, 0],
    })
    await getFollowersData({ userId: me, db, page: 1, limit: 10 })

    const [, options] = usersFind.mock.calls[0]
    expect(options.projection).toEqual({ firstName: 1, lastName: 1, username: 1 })
    expect(options.projection).not.toHaveProperty('password')
    expect(options.projection).not.toHaveProperty('email')
  })
})

describe('getFollowersData — relation flags', () => {
  it('marks who I follow back; everyone in the list follows me', async () => {
    const { db } = makeDb({
      pageDocs: [
        { followerId: a, createdAt: day(3) },
        { followerId: b, createdAt: day(2) },
      ],
      // I follow `a` but not `b`
      edgeDocs: [{ followerId: me, followingId: a }],
      users: [
        { _id: a, username: 'a' },
        { _id: b, username: 'b' },
      ],
      counts: [2, 1],
    })
    const { followers } = await getFollowersData({ userId: me, db, page: 1, limit: 10 })

    expect(followers.map((f) => [f.username, f.youFollow, f.followsYou])).toEqual([
      ['a', true, true], // mutual
      ['b', false, true], // follows me, I don't follow back
    ])
  })

  it('keeps the server order and exposes when each follow happened', async () => {
    const { db } = makeDb({
      pageDocs: [
        { followerId: b, createdAt: day(5) },
        { followerId: a, createdAt: day(1) },
      ],
      users: [
        { _id: a, username: 'a' },
        { _id: b, username: 'b' }, // DB returns users in a different order than the page
      ],
      counts: [2, 0],
    })
    const { followers } = await getFollowersData({ userId: me, db, page: 1, limit: 10 })

    expect(followers.map((f) => f.username)).toEqual(['b', 'a'])
    expect(followers[0].followedAt).toEqual(day(5))
  })

  it('skips the relation query entirely when the page is empty', async () => {
    const { db, follows } = makeDb({ pageDocs: [], users: [], counts: [0, 0] })
    await getFollowersData({ userId: me, db, page: 1, limit: 10 })
    const edgeQueries = follows.find.mock.calls.filter(([f]) => f.followingId?.$in || f.followerId?.$in)
    expect(edgeQueries).toHaveLength(0)
  })

  it('drops a follow edge whose user no longer exists instead of returning a blank row', async () => {
    const { db } = makeDb({
      pageDocs: [{ followerId: a, createdAt: day(1) }],
      users: [], // deleted account
      counts: [1, 0],
    })
    const { followers } = await getFollowersData({ userId: me, db, page: 1, limit: 10 })
    expect(followers).toEqual([])
  })
})

describe('getFollowingData — relation flags', () => {
  it('marks who follows me back; I follow everyone in the list', async () => {
    const { db } = makeDb({
      pageDocs: [
        { followingId: a, createdAt: day(3) },
        { followingId: b, createdAt: day(2) },
      ],
      // `b` follows me, `a` does not
      edgeDocs: [{ followerId: b, followingId: me }],
      users: [
        { _id: a, username: 'a' },
        { _id: b, username: 'b' },
      ],
      counts: [2, 1],
    })
    const { following } = await getFollowingData({ userId: me, db, page: 1, limit: 10 })

    expect(following.map((f) => [f.username, f.youFollow, f.followsYou])).toEqual([
      ['a', true, false],
      ['b', true, true], // mutual
    ])
  })
})
