/**
 * The capstone testing tools (seedTestReview.js, resetCapstone.js), run as the
 * real scripts against an in-memory MongoDB. They write to whatever MONGO_URI
 * points at, so every run asserts it hit the throwaway server and nothing else.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import connectDB, { closeDB } from '../../config/db.js'

// Only for the last test: the defense reads the repo from GitHub and asks the model.
vi.mock('../../modules/capstone/services/githubClient.js', () => ({
  getTree: vi.fn(async () => ({ truncated: false, paths: ['src/app.js'], entries: [{ path: 'src/app.js', size: 200 }] })),
  getFileText: vi.fn(async () => Array.from({ length: 30 }, (_, i) => `// line ${i + 1}`).join('\n')),
}))
vi.mock('../../modules/capstone/services/reviewModel.js', () => ({
  runStructured: vi.fn(async () => ({
    content: JSON.stringify({
      questions: Array.from({ length: 5 }, (_, i) => ({
        text: `Question ${i + 1}: why is line ${i + 2} written this way?`,
        path: 'src/app.js', line: i + 2, focus: i % 2 ? 'security' : 'correctness', expectedPoints: ['a reason'],
      })),
    }),
    usage: null,
  })),
  runReviewModel: vi.fn(),
}))

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
let mongod
let client
let db

const run = (script, ...args) => {
  const r = spawnSync(process.execPath, [`backend/scripts/${script}`, ...args], {
    cwd: ROOT,
    // stdin closed: a non-interactive child must not inherit an open stdin pipe
    // (on Windows that left the process hanging until the timeout).
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, MONGO_URI: mongod.getUri() },
    encoding: 'utf8',
    timeout: 60_000,
  })
  const out = `${r.stdout}${r.stderr}`
  // the scripts print the host they wrote to: it must be the throwaway server
  if (/mongodb\.net/.test(out)) throw new Error('SAFETY: a test script reached a real cluster')
  return { code: r.status, out }
}

const adminId = new ObjectId()
const learnerId = new ObjectId()
const briefId = new ObjectId()
const attemptId = new ObjectId()

const seed = async ({ withSubmission = true, status = 'started' } = {}) => {
  await db.collection('users').insertMany([
    { _id: adminId, username: 'tester', role: 'admin' },
    { _id: learnerId, username: 'realuser' },
  ])
  await db.collection('capstone_briefs').insertOne({
    _id: briefId, trackId: 'api-dev', version: 1, status: 'published', title: 'Notes API',
    rubric: [
      { id: 'correctness', name: 'Correctness', weight: 60, layerId: 'api-dev-4', description: 'd' },
      { id: 'security', name: 'Security', weight: 40, layerId: 'api-dev-6', description: 'd' },
    ],
    twistPool: [{ id: 't', text: 't' }], requirements: [], passThresholds: { rubric: 0.7, defense: 0.6 },
  })
  for (const userId of [adminId, learnerId]) {
    await db.collection('capstone_attempts').insertOne({
      _id: userId.equals(adminId) ? attemptId : new ObjectId(), userId, trackId: 'api-dev', briefId,
      attemptNumber: 1, status, twistId: 't', startedAt: new Date(), updatedAt: new Date(),
    })
  }
  if (withSubmission) {
    await db.collection('capstone_submissions').insertOne({
      attemptId, userId: adminId, trackId: 'api-dev', passed: false, checks: [{ id: 'x', passed: false }],
      repo: { id: 9, fullName: 'someone/some-repo', htmlUrl: 'https://github.com/someone/some-repo' },
      commitSha: 'abcdef1234567', treeSha: 'tree123', submittedAt: new Date(),
    })
  }
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
  // Create the app's indexes once, in-process. The scripts do this on every
  // connect; on a brand-new server the very first run can stall for a minute
  // doing it alongside the test's own connection, so warm it up here.
  process.env.MONGO_URI = mongod.getUri()
  await connectDB()
})
afterAll(async () => {
  await closeDB()
  await client.close()
  await mongod.stop()
})
beforeEach(async () => {
  for (const c of ['users', 'capstone_briefs', 'capstone_attempts', 'capstone_submissions', 'capstone_reviews', 'capstone_defenses', 'certificates']) {
    await db.collection(c).deleteMany({})
  }
})

describe('seedTestReview', () => {
  it('moves an open attempt to the defense with a seeded passing review and a borrowed repo', async () => {
    await seed()
    const r = run('seedTestReview.js', 'tester', 'api-dev', '--yes')
    expect(r.code, r.out).toBe(0)
    expect(r.out).toContain('DEFENSE')
    expect(r.out).toContain('someone/some-repo')

    const attempt = await db.collection('capstone_attempts').findOne({ _id: attemptId })
    expect(attempt.status).toBe('defense')

    const review = await db.collection('capstone_reviews').findOne({ _id: attempt.reviewId })
    expect(review).toMatchObject({ totalScore: 75, passed: true, seededForTesting: true, attemptId })
    expect(review.criteria.map((c) => c.id)).toEqual(['correctness', 'security'])
    expect(review.summary).toMatch(/^TEST DATA/)

    const sub = await db.collection('capstone_submissions').findOne({ _id: attempt.submissionId })
    expect(sub).toMatchObject({ passed: true, seededForTesting: true, commitSha: 'abcdef1234567', treeSha: 'tree123' })
    expect(sub.repo.fullName).toBe('someone/some-repo')
    // the original (failed) submission is untouched
    expect(await db.collection('capstone_submissions').countDocuments({ attemptId })).toBe(2)
  })

  it.each([
    ['without --yes', ['tester', 'api-dev'], /--yes/],
    ['for a non-admin account', ['realuser', 'api-dev', '--yes'], /not an admin/],
    ['for an unknown user', ['nobody', 'api-dev', '--yes'], /No user/],
    ['for a track with no attempt', ['tester', 'go-dev', '--yes'], /no go-dev capstone attempt/],
  ])('refuses %s', async (_, args, message) => {
    await seed()
    const r = run('seedTestReview.js', ...args)
    expect(r.code).toBe(1)
    expect(r.out).toMatch(message)
    expect((await db.collection('capstone_attempts').findOne({ _id: attemptId })).status).toBe('started')
    expect(await db.collection('capstone_reviews').countDocuments()).toBe(0)
  })

  it('refuses when there is no repo to borrow, or the attempt is not "started"', async () => {
    await seed({ withSubmission: false })
    expect(run('seedTestReview.js', 'tester', 'api-dev', '--yes').out).toMatch(/Submit any public repo/)

    await db.collection('capstone_attempts').updateOne({ _id: attemptId }, { $set: { status: 'failed' } })
    await db.collection('capstone_submissions').insertOne({ attemptId, repo: { fullName: 'a/b' }, treeSha: 't', commitSha: 'c' })
    expect(run('seedTestReview.js', 'tester', 'api-dev', '--yes').out).toMatch(/not "started"/)
    expect(await db.collection('capstone_reviews').countDocuments()).toBe(0)
  })
})

describe('resetCapstone', () => {
  it('previews by default and deletes only that user\'s data for that track with --yes', async () => {
    await seed()
    run('seedTestReview.js', 'tester', 'api-dev', '--yes')
    await db.collection('certificates').insertOne({ userId: adminId, trackId: 'api-dev', publicId: 'abc' })
    await db.collection('capstone_admin_actions').insertOne({ attemptId, action: 'override' })

    const dry = run('resetCapstone.js', 'tester', 'api-dev')
    expect(dry.code).toBe(0)
    expect(dry.out).toMatch(/would delete 1 attempts, 2 submissions, 1 reviews, 0 defenses, 1 certificates/)
    expect(await db.collection('capstone_attempts').countDocuments({ userId: adminId })).toBe(1)

    const real = run('resetCapstone.js', 'tester', 'api-dev', '--yes')
    expect(real.code, real.out).toBe(0)
    expect(await db.collection('capstone_attempts').countDocuments({ userId: adminId })).toBe(0)
    expect(await db.collection('capstone_submissions').countDocuments()).toBe(0)
    expect(await db.collection('capstone_reviews').countDocuments()).toBe(0)
    expect(await db.collection('certificates').countDocuments()).toBe(0)
    // other people's progress, accounts and the audit history are untouched
    expect(await db.collection('capstone_attempts').countDocuments({ userId: learnerId })).toBe(1)
    expect(await db.collection('users').countDocuments()).toBe(2)
    expect(await db.collection('capstone_admin_actions').countDocuments()).toBe(1)
  })
})

describe('the seeded state is a real defense', () => {
  it('the real defense service starts from it and serves the first question', async () => {
    await seed()
    expect(run('seedTestReview.js', 'tester', 'api-dev', '--yes').code).toBe(0)

    const { startDefenseService } = await import('../../modules/capstone/services/defenseService.js')
    const r = await startDefenseService(db, adminId.toString(), 'api-dev')
    expect(r.session).toMatchObject({ status: 'active', total: 5 })
    expect(r.session.current).toMatchObject({ id: 'q1', number: 1 })
    // the question links to the BORROWED repo at the borrowed commit
    expect(r.session.current.codeUrl).toBe('https://github.com/someone/some-repo/blob/abcdef1234567/src/app.js#L2')
  })
})

describe('reopenCapstone', () => {
  const seedFailed = async () => {
    await seed({ status: 'failed' })
    const startedAt = new Date('2026-10-03T16:39:20Z')
    await db.collection('capstone_attempts').updateOne(
      { _id: attemptId },
      { $set: { startedAt, cooldownUntil: new Date(Date.now() + 72 * 3_600_000), finishedAt: new Date(), reviewId: new ObjectId(), defenseScore: 10 } },
    )
    await db.collection('capstone_reviews').insertOne({ attemptId, userId: adminId, totalScore: 64, passed: false })
    await db.collection('capstone_defenses').insertOne({ attemptId, userId: adminId, sessionNumber: 1, status: 'graded' })
    await db.collection('capstone_submissions').insertOne({
      attemptId, userId: adminId, passed: true, repo: { fullName: 'someone/some-repo' }, commitSha: 'abc', treeSha: 't', submittedAt: new Date(),
    })
    return startedAt
  }

  it('reopens a failed attempt: same start time, no cooldown, old result gone, submissions kept', async () => {
    const startedAt = await seedFailed()
    const r = run('reopenCapstone.js', 'tester', 'api-dev', '--yes')
    expect(r.code, r.out).toBe(0)

    const attempt = await db.collection('capstone_attempts').findOne({ _id: attemptId })
    expect(attempt).toMatchObject({ status: 'started', cooldownUntil: null, attemptNumber: 1 })
    expect(attempt.startedAt.toISOString()).toBe(startedAt.toISOString()) // the "created after you started" baseline is untouched
    for (const gone of ['finishedAt', 'reviewId', 'defenseScore', 'submissionId']) expect(attempt, gone).not.toHaveProperty(gone)

    expect(await db.collection('capstone_reviews').countDocuments({ attemptId })).toBe(0)
    expect(await db.collection('capstone_defenses').countDocuments({ attemptId })).toBe(0)
    expect(await db.collection('capstone_submissions').countDocuments({ attemptId })).toBe(2) // history kept
  })

  it.each([
    ['without --yes', ['tester', 'api-dev'], /--yes/],
    ['for a non-admin account', ['realuser', 'api-dev', '--yes'], /not an admin/],
    ['for a track with no attempt', ['tester', 'go-dev', '--yes'], /no go-dev capstone attempt/],
  ])('refuses %s', async (_, args, message) => {
    await seedFailed()
    const r = run('reopenCapstone.js', ...args)
    expect(r.code).toBe(1)
    expect(r.out).toMatch(message)
    expect((await db.collection('capstone_attempts').findOne({ _id: attemptId })).status).toBe('failed')
  })

  it('refuses an attempt that did not fail, so a live attempt is never disturbed', async () => {
    await seed({ status: 'defense' })
    const r = run('reopenCapstone.js', 'tester', 'api-dev', '--yes')
    expect(r.code).toBe(1)
    expect(r.out).toMatch(/not "failed"/)
    expect((await db.collection('capstone_attempts').findOne({ _id: attemptId })).status).toBe('defense')
  })
})
