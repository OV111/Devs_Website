import { describe, it, expect, vi } from 'vitest'
import { ObjectId } from 'mongodb'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  NOTIFICATION_LIMIT,
} from '../../services/notificationService.js'

const makeDb = ({ matched = 1, modified = 1, deleted = 1 } = {}) => {
  const col = {
    updateOne: vi.fn().mockResolvedValue({ matchedCount: matched }),
    updateMany: vi.fn().mockResolvedValue({ modifiedCount: modified }),
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: deleted }),
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
    }),
  }
  return { col, db: { collection: () => col } }
}

const me = new ObjectId()
const notifId = new ObjectId().toString()

describe('notification writes are scoped to the owner', () => {
  it('mark read filters on both the id AND the owner', async () => {
    const { db, col } = makeDb()
    await markNotificationRead(db, me, notifId)
    const [filter, update] = col.updateOne.mock.calls[0]
    expect(filter._id.toString()).toBe(notifId)
    expect(filter.targetUserId).toBe(me.toString())
    expect(update).toEqual({ $set: { read: true } })
  })

  it('delete filters on both the id AND the owner', async () => {
    const { db, col } = makeDb()
    await deleteNotification(db, me, notifId)
    const [filter] = col.deleteOne.mock.calls[0]
    expect(filter._id.toString()).toBe(notifId)
    expect(filter.targetUserId).toBe(me.toString())
  })

  it("reports false (→ 404) when the id isn't one of theirs", async () => {
    expect(await markNotificationRead(makeDb({ matched: 0 }).db, me, notifId)).toBe(false)
    expect(await deleteNotification(makeDb({ deleted: 0 }).db, me, notifId)).toBe(false)
  })

  it('rejects a malformed id without querying', async () => {
    const { db, col } = makeDb()
    expect(await markNotificationRead(db, me, 'not-an-id')).toBe(false)
    expect(await deleteNotification(db, me, '../../etc')).toBe(false)
    expect(col.updateOne).not.toHaveBeenCalled()
    expect(col.deleteOne).not.toHaveBeenCalled()
  })

  it('mark all read only touches the owner’s unread notifications', async () => {
    const { db, col } = makeDb({ modified: 3 })
    expect(await markAllNotificationsRead(db, me)).toBe(3)
    expect(col.updateMany.mock.calls[0][0]).toEqual({ targetUserId: me.toString(), read: false })
  })
})

describe('getNotifications', () => {
  it('caps the inbox', async () => {
    const { db, col } = makeDb()
    await getNotifications(db, me)
    const chain = col.find.mock.results[0].value
    expect(chain.limit).toHaveBeenCalledWith(NOTIFICATION_LIMIT)
  })
})
