import { describe, it, expect, vi } from 'vitest'
import { ObjectId } from 'mongodb'
import { getUserProfileService, PUBLIC_USER_FIELDS } from '../../services/userService.js'

// Every collection the service touches answers "nothing found", except
// `users`, which returns the profile owner.
const makeDb = (target) => {
  const usersFindOne = vi.fn().mockResolvedValue(target)
  const empty = () => ({
    findOne: vi.fn().mockResolvedValue(null),
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
    }),
  })
  const cols = {}
  return {
    usersFindOne,
    db: {
      collection: (name) =>
        name === 'users' ? { findOne: usersFindOne } : (cols[name] ??= empty()),
    },
  }
}

describe('getUserProfileService — privacy', () => {
  const owner = { _id: new ObjectId(), username: 'vahe1', firstName: 'Vahe', lastName: 'O' }

  it('reads the profile owner with an explicit allow-list of public fields', async () => {
    const { db, usersFindOne } = makeDb(owner)
    await getUserProfileService(db, 'vahe1', new ObjectId())

    const [filter, options] = usersFindOne.mock.calls[0]
    expect(filter).toEqual({ username: 'vahe1' })
    expect(options.projection).toBe(PUBLIC_USER_FIELDS)
  })

  it('never includes private account fields in that allow-list', () => {
    for (const field of ['email', 'password', 'googleId', 'githubId', 'role', 'refreshToken']) {
      expect(PUBLIC_USER_FIELDS).not.toHaveProperty(field)
    }
    // An allow-list (inclusion projection), not a deny-list (exclusion).
    expect(Object.values(PUBLIC_USER_FIELDS).every((v) => v === 1)).toBe(true)
  })

  it('still returns the profile, its stats and certificates', async () => {
    const { db } = makeDb(owner)
    const result = await getUserProfileService(db, 'vahe1', new ObjectId())
    expect(result.targetUser.username).toBe('vahe1')
    expect(result).toHaveProperty('stats')
    expect(result.certificates).toEqual([])
  })
})
