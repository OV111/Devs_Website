/**
 * HTTP contract tests for POST /api/contact, through the real router, real
 * validation and a real (in-memory) MongoDB. The email provider is mocked:
 * the contract is "the message is stored and a notification is attempted",
 * not "Resend is up".
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

vi.mock('../../utils/emailService.js', () => ({
  sendContactNotification: vi.fn().mockResolvedValue(undefined),
}))

const { sendContactNotification } = await import('../../utils/emailService.js')
const { default: contactRoutes } = await import('../../modules/contact/index.js')

let mongod
let client
let db
let app

const valid = {
  name: 'Ada',
  email: 'Ada@Example.com',
  topic: 'Bug report',
  message: 'The roadmap page does not load on Safari.',
}

const post = (body) => request(app).post('/api/contact').send(body)

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')

  app = express()
  app.use(express.json())
  app.locals.db = db
  app.use('/api/contact', contactRoutes)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  await db.collection('contact_messages').deleteMany({})
  sendContactNotification.mockClear()
})

describe('POST /api/contact', () => {
  it('stores a valid message and attempts a notification', async () => {
    const res = await post(valid)

    expect(res.status).toBe(202)
    const saved = await db.collection('contact_messages').findOne({})
    expect(saved).toMatchObject({ name: 'Ada', email: 'ada@example.com', topic: 'Bug report' })
    expect(sendContactNotification).toHaveBeenCalledOnce()
  })

  it('rejects invalid input with a 400 naming the field', async () => {
    const res = await post({ ...valid, email: 'not-an-email' })

    expect(res.status).toBe(400)
    expect(res.body.field).toBe('email')
    expect(await db.collection('contact_messages').countDocuments()).toBe(0)
  })

  it('rejects unknown keys instead of silently ignoring them', async () => {
    const res = await post({ ...valid, isAdmin: true })
    expect(res.status).toBe(400)
  })

  it('silently drops honeypot submissions (bots get a normal-looking 202)', async () => {
    const res = await post({ ...valid, website: 'http://spam.example' })

    expect(res.status).toBe(202)
    expect(await db.collection('contact_messages').countDocuments()).toBe(0)
    expect(sendContactNotification).not.toHaveBeenCalled()
  })

  it('still stores the message when the email provider fails', async () => {
    sendContactNotification.mockRejectedValueOnce(new Error('quota exceeded'))

    const res = await post(valid)

    expect(res.status).toBe(202)
    expect(await db.collection('contact_messages').countDocuments()).toBe(1)
  })
})
