/**
 * The Privacy Policy promises that deleting an account removes the user's
 * learning, AI and activity data. This test is that promise in code: it seeds
 * data for two users, deletes one, and checks nothing of theirs survives while
 * the other user's data is untouched.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { deleteAccountService } from '../../services/accountService.js'

const PER_USER = [
  'userProgress', 'exam_attempts', 'examHistory', 'weakSpots', 'learnerMastery',
  'teach_back_sessions', 'mentor_teaching_log', 'agent_sessions', 'agent_usage',
  'challenge_attempts', 'challengeResults', 'savedLibraryResources',
  'usernameHistory', 'userEvents', 'refreshTokens', 'passwordResets',
]

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

const seedUser = async (email) => {
  const _id = new ObjectId()
  await db.collection('users').insertOne({
    _id,
    email,
    password: await bcrypt.hash('pw-123456', 4),
  })
  // Mix ObjectId and string ids, like the real collections do.
  for (const [i, name] of PER_USER.entries()) {
    await db.collection(name).insertOne({ userId: i % 2 ? _id : _id.toString() })
  }
  await db.collection('messages').insertOne({ senderId: _id.toString(), text: 'hi' })
  await db.collection('contact_messages').insertOne({ email, message: 'hello there' })
  return _id
}

describe('deleteAccountService', () => {
  it('removes every per-user collection and leaves other users alone', async () => {
    const doomed = await seedUser('doomed@example.com')
    const keeper = await seedUser('keeper@example.com')
    await db.collection('rooms').insertOne({ members: [doomed.toString(), keeper.toString()] })

    await deleteAccountService(db, doomed, 'doomed@example.com', 'pw-123456')

    const ids = [doomed, doomed.toString()]
    for (const name of PER_USER) {
      expect(await db.collection(name).countDocuments({ userId: { $in: ids } }), name).toBe(0)
      expect(
        await db.collection(name).countDocuments({ userId: { $in: [keeper, keeper.toString()] } }),
        `${name} (other user)`,
      ).toBe(1)
    }
    expect(await db.collection('users').countDocuments({ _id: doomed })).toBe(0)
    expect(await db.collection('messages').countDocuments({ senderId: doomed.toString() })).toBe(0)
    expect(await db.collection('contact_messages').countDocuments({ email: 'doomed@example.com' })).toBe(0)

    const room = await db.collection('rooms').findOne({})
    expect(room.members).toEqual([keeper.toString()])
  })
})
