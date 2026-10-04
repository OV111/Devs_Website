/**
 * Capstone certificates against a real MongoDB (in memory).
 *
 * Seeds a PASSED attempt directly (the path to "passed" is covered by the
 * defense tests) and checks issuing, idempotency, self-healing, the billing
 * gate and the public view.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import process from 'node:process'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

vi.mock('../../modules/capstone/lib/pathCompletion.js', () => ({
  isPathComplete: vi.fn(async () => ({ complete: true, passed: 10, total: 10, missing: [] })),
}))

const {
  ensureCertificate,
  getPublicCertificateService,
  listMyCertificatesService,
} = await import('../../modules/capstone/services/certificateService.js')
const { getStatusService } = await import('../../modules/capstone/services/capstoneService.js')

let mongod
let client
let db

const TRACK = 'api-dev'
const userId = new ObjectId()
let attempt

const seedPassed = async () => {
  const briefId = new ObjectId()
  const submissionId = new ObjectId()
  const reviewId = new ObjectId()
  attempt = {
    _id: new ObjectId(), userId, trackId: TRACK, briefId, briefVersion: 1, twistId: 'sharing',
    attemptNumber: 1, status: 'passed', startedAt: new Date(), cooldownUntil: null,
    submissionId, reviewId, defenseScore: 75,
  }
  await Promise.all([
    db.collection('users').insertOne({ _id: userId, firstName: 'Ada', lastName: 'Lovelace', username: 'ada', email: 'ada@example.com' }),
    db.collection('roadmap_tracks').insertOne({ trackId: TRACK, title: 'API Developer' }),
    db.collection('capstone_briefs').insertOne({
      _id: briefId, trackId: TRACK, slug: 's', version: 1, status: 'published', title: 'Notes API',
      rubric: [{ id: 'correctness', name: 'Correctness', weight: 100, description: 'd', layerId: 'api-dev-4' }],
      twistPool: [{ id: 'sharing', text: 'Read-only sharing' }], requirements: [], passThresholds: { rubric: 0.7, defense: 0.6 },
    }),
    db.collection('capstone_submissions').insertOne({
      _id: submissionId, attemptId: attempt._id, userId,
      repo: { id: 1, fullName: 'ada/notes', htmlUrl: 'https://github.com/ada/notes' }, commitSha: 'abc123',
    }),
    db.collection('capstone_reviews').insertOne({
      _id: reviewId, attemptId: attempt._id, totalScore: 82.5, passed: true,
      criteria: [{ id: 'correctness', score: 3, feedback: 'f', evidence: [] }], createdAt: new Date(),
    }),
    db.collection('capstone_attempts').insertOne(attempt),
  ])
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
  // The unique indexes are what make issuing idempotent — create them as the app does.
  const { ensureIndexes } = await import('../../modules/capstone/services/capstoneData.js')
  await ensureIndexes(db)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  for (const c of ['users', 'roadmap_tracks', 'capstone_briefs', 'capstone_submissions', 'capstone_reviews', 'capstone_attempts', 'certificates', 'subscriptions']) {
    await db.collection(c).deleteMany({})
  }
  await seedPassed()
})

afterEach(() => {
  delete process.env.BILLING_ENFORCED
})

describe('ensureCertificate', () => {
  it('issues a snapshot of the passed capstone', async () => {
    const cert = await ensureCertificate(db, userId.toString(), attempt)
    expect(cert.publicId).toMatch(/^[A-Za-z0-9_-]{12}$/)
    expect(cert).toMatchObject({
      holderName: 'Ada Lovelace',
      trackTitle: 'API Developer',
      project: { title: 'Notes API', briefVersion: 1, twist: 'Read-only sharing' },
      repo: { fullName: 'ada/notes', commitSha: 'abc123' },
      scores: { review: 82.5, defense: 75, criteria: [{ name: 'Correctness', score: 3, maxScore: 4 }] },
      revokedAt: null,
    })
  })

  it('is idempotent, including under concurrency', async () => {
    const results = await Promise.all(Array.from({ length: 5 }, () => ensureCertificate(db, userId.toString(), attempt)))
    expect(new Set(results.map((c) => c.publicId)).size).toBe(1)
    expect(await db.collection('certificates').countDocuments()).toBe(1)
  })

  it('does nothing for an attempt that has not passed', async () => {
    expect(await ensureCertificate(db, userId.toString(), { ...attempt, status: 'defense' })).toBeNull()
    expect(await db.collection('certificates').countDocuments()).toBe(0)
  })

  it('is withheld (not issued) without Pro when billing is enforced, and issued once access exists', async () => {
    process.env.BILLING_ENFORCED = 'true'
    expect(await ensureCertificate(db, userId.toString(), attempt)).toEqual({ locked: true })
    expect(await db.collection('certificates').countDocuments()).toBe(0)

    delete process.env.BILLING_ENFORCED
    expect((await ensureCertificate(db, userId.toString(), attempt)).publicId).toBeTruthy()
  })
})

describe('status read', () => {
  it('self-heals: a passed attempt without a certificate gets one on the next read', async () => {
    const status = await getStatusService(db, userId.toString(), TRACK)
    expect(status.certificate.verifyPath).toMatch(/^\/verify\/[A-Za-z0-9_-]{12}$/)
    expect(await db.collection('certificates').countDocuments()).toBe(1)

    const again = await getStatusService(db, userId.toString(), TRACK)
    expect(again.certificate.publicId).toBe(status.certificate.publicId)
  })

  it('reports a locked certificate under enforced billing', async () => {
    process.env.BILLING_ENFORCED = 'true'
    expect((await getStatusService(db, userId.toString(), TRACK)).certificate).toEqual({ locked: true })
  })
})

describe('public verification', () => {
  it('returns the public record with no internal ids or contact details', async () => {
    const { publicId } = await ensureCertificate(db, userId.toString(), attempt)
    const pub = await getPublicCertificateService(db, publicId)

    expect(pub).toMatchObject({
      publicId,
      holder: { name: 'Ada Lovelace', username: 'ada', profilePath: '/users/ada' },
      track: { id: TRACK, title: 'API Developer' },
      repo: { commitUrl: 'https://github.com/ada/notes/tree/abc123' },
      revoked: false,
    })
    expect(pub.assessment).toMatch(/Not proctored/)
    const json = JSON.stringify(pub)
    for (const leak of [userId.toString(), attempt._id.toString(), 'ada@example.com', '"_id"']) {
      expect(json).not.toContain(leak)
    }
  })

  it('links to the holder\'s current username after a rename', async () => {
    const { publicId } = await ensureCertificate(db, userId.toString(), attempt)
    await db.collection('users').updateOne({ _id: userId }, { $set: { username: 'ada-l' } })
    expect((await getPublicCertificateService(db, publicId)).holder.profilePath).toBe('/users/ada-l')
  })

  it('shows a revoked certificate as revoked, with the reason', async () => {
    const { publicId } = await ensureCertificate(db, userId.toString(), attempt)
    await db.collection('certificates').updateOne({ publicId }, { $set: { revokedAt: new Date(), revokedReason: 'Plagiarism' } })
    expect(await getPublicCertificateService(db, publicId)).toMatchObject({ revoked: true, revokedReason: 'Plagiarism' })
  })

  it('404s for unknown or malformed ids', async () => {
    await expect(getPublicCertificateService(db, 'AAAAAAAAAAAA')).rejects.toMatchObject({ status: 404 })
    await expect(getPublicCertificateService(db, '{"$ne":null}')).rejects.toMatchObject({ status: 404 })
  })

  it('lists the learner\'s own certificates', async () => {
    await ensureCertificate(db, userId.toString(), attempt)
    const mine = await listMyCertificatesService(db, userId.toString())
    expect(mine).toHaveLength(1)
    expect(mine[0].track.title).toBe('API Developer')
  })
})

describe('certificates built on seeded test data', () => {
  it('are labelled as test data, publicly', async () => {
    await db.collection('capstone_reviews').updateMany({}, { $set: { seededForTesting: true } })
    const { publicId } = await ensureCertificate(db, userId.toString(), attempt)
    const pub = await getPublicCertificateService(db, publicId)
    expect(pub.testData).toBe(true)
    expect(pub.assessment).toMatch(/^TEST DATA/)
  })

  it('real certificates are not', async () => {
    const { publicId } = await ensureCertificate(db, userId.toString(), attempt)
    expect((await getPublicCertificateService(db, publicId)).testData).toBe(false)
  })
})
