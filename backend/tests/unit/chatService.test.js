import { describe, it, expect, vi } from 'vitest'
import { getOrCreateRoomForMember, saveMessage } from '../../services/chatService.js'

// Minimal fake db: `rooms` holds at most one existing room.
const makeDb = (existingRoom = null) => {
  const rooms = {
    findOne: vi.fn().mockResolvedValue(existingRoom),
    insertOne: vi.fn().mockResolvedValue({}),
    updateOne: vi.fn().mockResolvedValue({}),
  }
  const messages = { insertOne: vi.fn().mockResolvedValue({ insertedId: 'm1' }) }
  return { rooms, messages, collection: (name) => ({ rooms, messages })[name] }
}

const room = { _id: 'r1', members: ['alice', 'bob'] }

describe('getOrCreateRoomForMember', () => {
  it('lets a member into an existing room', async () => {
    const db = makeDb(room)
    expect(await getOrCreateRoomForMember(db, { roomId: 'r1', userId: 'alice' })).toEqual({ room })
  })

  it('denies a non-member and never rewrites the member list', async () => {
    const db = makeDb(room)
    const result = await getOrCreateRoomForMember(db, { roomId: 'r1', userId: 'mallory', receiverId: 'alice' })
    expect(result).toEqual({ error: 'Access denied' })
    expect(db.rooms.updateOne).not.toHaveBeenCalled()
    expect(db.rooms.insertOne).not.toHaveBeenCalled()
  })

  it('refuses to create a room without a receiverId (groups go through REST)', async () => {
    const db = makeDb(null)
    expect(await getOrCreateRoomForMember(db, { roomId: 'r2', userId: 'alice' }))
      .toEqual({ error: 'Room does not exist' })
  })

  it('creates a direct room for the first DM', async () => {
    const db = makeDb(null)
    const { room: created } = await getOrCreateRoomForMember(db, { roomId: 'r2', userId: 'alice', receiverId: 'bob' })
    expect(created).toMatchObject({ _id: 'r2', type: 'direct', members: ['bob', 'alice'] })
    expect(db.rooms.insertOne).toHaveBeenCalledOnce()
  })
})

describe('saveMessage', () => {
  it('denies a non-member without writing anything', async () => {
    const db = makeDb(room)
    expect(await saveMessage(db, { roomId: 'r1', senderId: 'mallory', text: 'hi' }))
      .toEqual({ error: 'Access denied' })
    expect(db.messages.insertOne).not.toHaveBeenCalled()
  })

  it('stores a trimmed message and returns the members for notification fan-out', async () => {
    const db = makeDb(room)
    const result = await saveMessage(db, { roomId: 'r1', senderId: 'alice', text: '  hi  ' })
    expect(result.members).toEqual(['alice', 'bob'])
    expect(result.message).toMatchObject({ _id: 'm1', roomId: 'r1', senderId: 'alice', text: 'hi' })
    expect(db.rooms.updateOne).toHaveBeenCalledOnce()
  })
})
