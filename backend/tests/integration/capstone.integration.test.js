/**
 * Capstone start + submit against a real MongoDB (in memory).
 *
 * GitHub is mocked so the tests are deterministic and offline; the real client
 * is exercised separately. isPathComplete is mocked because the learner writes
 * it themselves — these tests cover everything around it.
 *
 * The properties that matter:
 *  - a double start creates one attempt, a double submit runs checks once;
 *  - a failed check or a GitHub outage never strands the attempt in "checking";
 *  - a failed check does not use up an attempt.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

vi.mock('../../modules/capstone/lib/pathCompletion.js', () => ({
  isPathComplete: vi.fn(async () => ({ complete: true, passed: 10, total: 10, missing: [] })),
}))
vi.mock('../../modules/capstone/services/githubClient.js', () => ({
  getRepo: vi.fn(),
  getHeadCommit: vi.fn(),
  getCommitStats: vi.fn(),
  getTree: vi.fn(),
}))

const github = await import('../../modules/capstone/services/githubClient.js')
const { isPathComplete } = await import('../../modules/capstone/lib/pathCompletion.js')
const { startAttemptService, getStatusService } = await import('../../modules/capstone/services/capstoneService.js')
const { submitService } = await import('../../modules/capstone/services/submissionService.js')
const { MAX_SUBMISSIONS_PER_DAY } = await import('../../modules/capstone/lib/constants.js')

let mongod
let client
let db

const TRACK = 'api-dev'
const ALICE = new ObjectId().toString()
const BOB = new ObjectId().toString()
const REPO = { owner: 'alice', repo: 'notes-api' }

const brief = {
  trackId: TRACK,
  slug: 'api-dev-notes-service',
  version: 1,
  status: 'published',
  title: 'Notes API',
  summary: 's',
  requirements: [
    { id: 'readme', text: 'README', check: { type: 'file', glob: 'README.md' } },
    { id: 'auth', text: 'Auth' },
  ],
  rubric: [{ id: 'c', name: 'C', description: 'd', weight: 100, layerId: 'api-dev-4' }],
  twistPool: [{ id: 'a', text: 'twist a' }, { id: 'b', text: 'twist b' }],
  passThresholds: { rubric: 0.7, defense: 0.6 },
}

// A GitHub that returns a healthy repo, created one hour in the future
// (so always "after the start").
const healthyGithub = ({ repoId = 111, paths = ['README.md', 'src/app.js'], treeSha = 'tree-1' } = {}) => {
  github.getRepo.mockResolvedValue({
    id: repoId,
    fullName: 'alice/notes-api',
    htmlUrl: 'https://github.com/alice/notes-api',
    private: false,
    fork: false,
    sizeKb: 200,
    createdAt: new Date(Date.now() + 60 * 60 * 1000),
    defaultBranch: 'main',
  })
  github.getHeadCommit.mockResolvedValue({ sha: 'sha-1', treeSha, committedAt: new Date() })
  github.getCommitStats.mockResolvedValue({ count: 9, rootCommittedAt: new Date(Date.now() + 60 * 60 * 1000) })
  github.getTree.mockResolvedValue({ truncated: false, paths })
}

const attemptOf = (userId) => db.collection('capstone_attempts').findOne({ userId: new ObjectId(userId) })

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
  // deleteMany, not drop: ensureIndexes caches its promise per process.
  for (const c of ['capstone_briefs', 'capstone_attempts', 'capstone_submissions', 'userEvents']) {
    await db.collection(c).deleteMany({})
  }
  await db.collection('capstone_briefs').insertOne({ ...brief })
  vi.clearAllMocks()
  isPathComplete.mockResolvedValue({ complete: true, passed: 10, total: 10, missing: [] })
  healthyGithub()
})

describe('startAttemptService', () => {
  it('creates one attempt with a twist and never leaks the pool', async () => {
    const r = await startAttemptService(db, ALICE, TRACK)
    expect(r.resumed).toBe(false)
    expect(r.attempt).toMatchObject({ attemptNumber: 1, status: 'started' })
    expect(['a', 'b']).toContain(r.attempt.twist.id)
    expect(JSON.stringify(r)).not.toContain('twistPool')
    expect(JSON.stringify(r)).not.toContain('weight')
  })

  it('a burst of concurrent starts creates exactly one attempt', async () => {
    const results = await Promise.all(Array.from({ length: 5 }, () => startAttemptService(db, ALICE, TRACK)))
    expect(await db.collection('capstone_attempts').countDocuments()).toBe(1)
    expect(new Set(results.map((r) => r.attempt.id)).size).toBe(1)
  })

  it('refuses when the path is not complete, listing the missing layers', async () => {
    isPathComplete.mockResolvedValue({ complete: false, passed: 9, total: 10, missing: ['api-dev-10'] })
    await expect(startAttemptService(db, ALICE, TRACK)).rejects.toMatchObject({
      status: 403,
      details: { missing: ['api-dev-10'] },
    })
  })

  it('404s for a track without a published brief', async () => {
    await expect(startAttemptService(db, ALICE, 'go-dev')).rejects.toMatchObject({ status: 404 })
  })
})

describe('submitService', () => {
  it('404s when there is no open attempt', async () => {
    await expect(submitService(db, ALICE, TRACK, REPO)).rejects.toMatchObject({ status: 404 })
  })

  it('a passing submission pins the commit and moves the attempt to "submitted"', async () => {
    await startAttemptService(db, ALICE, TRACK)
    const r = await submitService(db, ALICE, TRACK, REPO)

    expect(r.submission).toMatchObject({ passed: true, commitSha: 'sha-1' })
    expect(r.submission).not.toHaveProperty('flags')
    expect(r.attempt.status).toBe('submitted')

    const attempt = await attemptOf(ALICE)
    expect(attempt.status).toBe('submitted')
    expect(attempt).not.toHaveProperty('checkingSince')
    expect(await db.collection('userEvents').countDocuments({ type: 'capstone_submitted' })).toBe(1)
  })

  it('a failing check returns the attempt to "started" and does not use up an attempt', async () => {
    healthyGithub({ paths: ['src/app.js'] }) // no README
    await startAttemptService(db, ALICE, TRACK)
    const r = await submitService(db, ALICE, TRACK, REPO)

    expect(r.submission.passed).toBe(false)
    expect(r.submission.checks.find((c) => c.id === 'req:readme').passed).toBe(false)
    expect((await attemptOf(ALICE)).status).toBe('started')

    const status = await getStatusService(db, ALICE, TRACK)
    expect(status.attemptsUsed).toBe(0)
    expect(status.lastSubmission.passed).toBe(false)
  })

  it('a GitHub outage releases the attempt and records nothing', async () => {
    await startAttemptService(db, ALICE, TRACK)
    github.getRepo.mockRejectedValue(Object.assign(new Error('rate limited'), { status: 503 }))

    await expect(submitService(db, ALICE, TRACK, REPO)).rejects.toMatchObject({ status: 503 })
    expect((await attemptOf(ALICE)).status).toBe('started')
    expect(await db.collection('capstone_submissions').countDocuments()).toBe(0)
  })

  it('concurrent submits run the checks exactly once', async () => {
    await startAttemptService(db, ALICE, TRACK)
    const results = await Promise.allSettled(Array.from({ length: 4 }, () => submitService(db, ALICE, TRACK, REPO)))

    const ok = results.filter((r) => r.status === 'fulfilled')
    const rejected = results.filter((r) => r.status === 'rejected')
    expect(ok).toHaveLength(1)
    // losers see either "being checked" (409) or "already submitted" (409)
    expect(rejected.every((r) => r.reason.status === 409)).toBe(true)
    expect(await db.collection('capstone_submissions').countDocuments()).toBe(1)
  })

  it('a stale "checking" lock can be taken over', async () => {
    await startAttemptService(db, ALICE, TRACK)
    await db.collection('capstone_attempts').updateOne(
      { userId: new ObjectId(ALICE) },
      { $set: { status: 'checking', checkingSince: new Date(Date.now() - 10 * 60 * 1000) } },
    )
    const r = await submitService(db, ALICE, TRACK, REPO)
    expect(r.attempt.status).toBe('submitted')
  })

  it('a fresh "checking" lock is respected', async () => {
    await startAttemptService(db, ALICE, TRACK)
    await db.collection('capstone_attempts').updateOne(
      { userId: new ObjectId(ALICE) },
      { $set: { status: 'checking', checkingSince: new Date() } },
    )
    await expect(submitService(db, ALICE, TRACK, REPO)).rejects.toMatchObject({ status: 409 })
  })

  it('rejects a repository already submitted by another learner, and flags an identical tree', async () => {
    await startAttemptService(db, BOB, TRACK)
    await submitService(db, BOB, TRACK, REPO)

    await startAttemptService(db, ALICE, TRACK)
    const r = await submitService(db, ALICE, TRACK, REPO)
    expect(r.submission.passed).toBe(false)
    expect(r.submission.checks.find((c) => c.id === 'repo-unique').passed).toBe(false)

    const stored = await db.collection('capstone_submissions').findOne({ userId: new ObjectId(ALICE) })
    expect(stored.flags.map((f) => f.id)).toContain('duplicate-tree')
  })

  it('the same learner may resubmit the same repository', async () => {
    healthyGithub({ paths: ['src/app.js'] })
    await startAttemptService(db, ALICE, TRACK)
    await submitService(db, ALICE, TRACK, REPO)
    healthyGithub()
    const r = await submitService(db, ALICE, TRACK, REPO)
    expect(r.submission.passed).toBe(true)
  })

  it(`enforces ${MAX_SUBMISSIONS_PER_DAY} submissions per day`, async () => {
    healthyGithub({ paths: ['src/app.js'] }) // keep failing so the attempt stays open
    await startAttemptService(db, ALICE, TRACK)
    for (let i = 0; i < MAX_SUBMISSIONS_PER_DAY; i++) await submitService(db, ALICE, TRACK, REPO)
    await expect(submitService(db, ALICE, TRACK, REPO)).rejects.toMatchObject({ status: 429 })
  })

  it('refuses a second submission once the attempt is submitted', async () => {
    await startAttemptService(db, ALICE, TRACK)
    await submitService(db, ALICE, TRACK, REPO)
    await expect(submitService(db, ALICE, TRACK, REPO)).rejects.toMatchObject({ status: 409 })
  })
})
