/**
 * Capstone admin + mentor integration against a real MongoDB (in memory),
 * including the HTTP gates (admin-only 404, mentor paused with 423).
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

let mongod
let client
let db
let server
let base

const { ensureIndexes } = await import('../../modules/capstone/services/capstoneData.js')
const admin = await import('../../modules/capstone/services/adminService.js')
const { getCapstoneMentorView, hasLiveDefense } = await import('../../modules/capstone/index.js')
const { executeTool } = await import('../../tools/agentTools.js')
const { createAccessToken } = await import('../../utils/jwtToken.js')

const learnerId = new ObjectId()
const adminId = new ObjectId()
const ids = {}

/** One learner with a full capstone history: attempt in defense, review, a graded failed session. */
const seed = async ({ status = 'defense', liveQuestion = false } = {}) => {
  ids.brief = new ObjectId()
  ids.attempt = new ObjectId()
  ids.submission = new ObjectId()
  ids.review = new ObjectId()
  await db.collection('users').insertMany([
    { _id: learnerId, username: 'learner', firstName: 'Lea', lastName: 'Rner', email: 'lea@example.com' },
    { _id: adminId, username: 'boss', role: 'admin' },
  ])
  await db.collection('roadmap_tracks').insertOne({ trackId: 'api-dev', title: 'API Developer' })
  await db.collection('capstone_briefs').insertOne({
    _id: ids.brief, trackId: 'api-dev', slug: 's', version: 1, status: 'published', title: 'Notes API',
    rubric: [{ id: 'security', name: 'Security basics', weight: 100, description: 'd', layerId: 'api-dev-6' }],
    twistPool: [{ id: 'sharing', text: 'Read-only sharing' }], requirements: [], passThresholds: { rubric: 0.7, defense: 0.6 },
  })
  await db.collection('capstone_attempts').insertOne({
    _id: ids.attempt, userId: learnerId, trackId: 'api-dev', briefId: ids.brief, briefVersion: 1, twistId: 'sharing',
    attemptNumber: 1, status, startedAt: new Date(), updatedAt: new Date(), cooldownUntil: null,
    submissionId: ids.submission, reviewId: ids.review,
  })
  await db.collection('capstone_submissions').insertOne({
    _id: ids.submission, attemptId: ids.attempt, userId: learnerId, passed: true,
    repo: { id: 1, fullName: 'learner/notes', htmlUrl: 'https://github.com/learner/notes' }, commitSha: 'abc',
    flags: [{ id: 'few-commits', detail: '1 commit(s)' }], submittedAt: new Date(),
  })
  await db.collection('capstone_reviews').insertOne({
    _id: ids.review, attemptId: ids.attempt, userId: learnerId, totalScore: 75, passed: true, summary: 'ok',
    criteria: [{ id: 'security', score: 3, feedback: 'hash with bcrypt', evidence: [] }],
    flags: [{ id: 'prompt-injection-suspected', detail: 'README.md' }], createdAt: new Date(),
  })
  await db.collection('capstone_defenses').insertOne({
    attemptId: ids.attempt, userId: learnerId, trackId: 'api-dev', sessionNumber: 1, status: liveQuestion ? 'active' : 'graded',
    currentIndex: 0,
    result: liveQuestion ? undefined : { score: 25, passed: false },
    questions: [{
      id: 'q1', text: 'Why bcrypt?', codeRef: { path: 'a.js', line: 1 }, focus: 'security',
      expectedPoints: ['SECRET-EXPECTED'], excerpt: 'SECRET-EXCERPT',
      askedAt: liveQuestion ? new Date() : new Date(Date.now() - 600_000), answeredAt: liveQuestion ? null : new Date(),
      answer: liveQuestion ? null : 'dunno', lateAnswer: liveQuestion ? undefined : 'late text',
      integrity: { tabSwitches: 2, pasteEvents: 3 }, score: liveQuestion ? undefined : 1, feedback: 'be specific',
    }],
  })
}

const http = (path, { token, method = 'GET', body } = {}) =>
  fetch(`${base}${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
  await ensureIndexes(db)
  const { createApp } = await import('../../app.js')
  server = createApp(db).listen(0)
  base = `http://127.0.0.1:${server.address().port}`
})

afterAll(async () => {
  server.close()
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  for (const c of ['users', 'roadmap_tracks', 'capstone_briefs', 'capstone_attempts', 'capstone_submissions', 'capstone_reviews', 'capstone_defenses', 'certificates', 'capstone_admin_actions']) {
    await db.collection(c).deleteMany({})
  }
})

describe('admin services', () => {
  it('lists attempts with every integrity signal summarised', async () => {
    await seed()
    const { attempts, total } = await admin.listAttemptsService(db, { page: 1 })
    expect(total).toBe(1)
    expect(attempts[0]).toMatchObject({
      username: 'learner', status: 'defense', repo: 'learner/notes', reviewScore: 75,
      integrity: { tabSwitches: 2, pasteEvents: 3, lateAnswers: 1 },
    })
    expect(attempts[0].flags.sort()).toEqual(['few-commits', 'prompt-injection-suspected'])
  })

  it('detail exposes what learners never see', async () => {
    await seed()
    const d = await admin.getAttemptDetailService(db, ids.attempt.toString())
    expect(d.defenses[0].questions[0]).toMatchObject({ expectedPoints: ['SECRET-EXPECTED'], lateAnswer: 'late text' })
    expect(d.brief.twist.text).toBe('Read-only sharing')
    expect(d.user.email).toBe('lea@example.com')
  })

  it('override → passed issues the certificate and writes the audit log', async () => {
    await seed()
    const r = await admin.overrideAttemptService(db, adminId.toString(), ids.attempt.toString(), { outcome: 'passed', reason: 'Defense grader misread a correct answer' })
    expect(r.attempt.status).toBe('passed')
    expect(r.attempt.override).toMatchObject({ previousStatus: 'defense', reason: 'Defense grader misread a correct answer' })
    expect(r.certificate.publicId).toBeTruthy()
    expect(r.certificate.scores.defense).toBeNull() // passed before any passing defense
    const log = await db.collection('capstone_admin_actions').find({}).toArray()
    expect(log).toHaveLength(1)
    expect(log[0]).toMatchObject({ action: 'override', from: 'defense', to: 'passed' })
  })

  it('override → failed starts the cooldown and revokes an issued certificate', async () => {
    // A passed attempt with a live certificate — the case an admin reverses.
    await seed({ status: 'passed' })
    const { ensureCertificate } = await import('../../modules/capstone/services/certificateService.js')
    const cert = await ensureCertificate(db, learnerId.toString(), await db.collection('capstone_attempts').findOne({ _id: ids.attempt }))
    expect(cert.revokedAt).toBeNull()

    const before = Date.now()
    const r = await admin.overrideAttemptService(db, adminId.toString(), ids.attempt.toString(), { outcome: 'failed', reason: 'Code copied from a public tutorial' })
    expect(r.attempt.status).toBe('failed')
    expect(r.attempt.cooldownUntil.getTime()).toBeGreaterThan(before)
    const revoked = await db.collection('certificates').findOne({ attemptId: ids.attempt })
    expect(revoked.revokedReason).toMatch(/Code copied from a public tutorial/)
  })

  it('refuses unsafe overrides', async () => {
    await seed()
    // no review → cannot pass
    await db.collection('capstone_attempts').updateOne({ _id: ids.attempt }, { $unset: { reviewId: '' } })
    await expect(admin.overrideAttemptService(db, adminId.toString(), ids.attempt.toString(), { outcome: 'passed', reason: 'x'.repeat(12) }))
      .rejects.toMatchObject({ status: 409 })
    // a newer attempt exists → cannot touch the old one
    await db.collection('capstone_attempts').insertOne({ userId: learnerId, trackId: 'api-dev', attemptNumber: 2, status: 'started', updatedAt: new Date() })
    await expect(admin.overrideAttemptService(db, adminId.toString(), ids.attempt.toString(), { outcome: 'failed', reason: 'x'.repeat(12) }))
      .rejects.toMatchObject({ status: 409 })
    // unknown attempt
    await expect(admin.overrideAttemptService(db, adminId.toString(), new ObjectId().toString(), { outcome: 'failed', reason: 'x'.repeat(12) }))
      .rejects.toMatchObject({ status: 404 })
  })

  it('revokes and restores a certificate, but never restores one for a non-passed attempt', async () => {
    await seed({ status: 'passed' })
    const { ensureCertificate } = await import('../../modules/capstone/services/certificateService.js')
    const cert = await ensureCertificate(db, learnerId.toString(), await db.collection('capstone_attempts').findOne({ _id: ids.attempt }))

    const revoked = await admin.setCertificateRevokedService(db, adminId.toString(), cert.publicId, { revoked: true, reason: 'Identity could not be confirmed' })
    expect(revoked.revokedReason).toBe('Identity could not be confirmed')
    await expect(admin.setCertificateRevokedService(db, adminId.toString(), cert.publicId, { revoked: true, reason: 'again and again' }))
      .rejects.toMatchObject({ status: 409 })

    await db.collection('capstone_attempts').updateOne({ _id: ids.attempt }, { $set: { status: 'failed' } })
    await expect(admin.setCertificateRevokedService(db, adminId.toString(), cert.publicId, { revoked: false, reason: 'Appeal accepted ok' }))
      .rejects.toMatchObject({ status: 409 })

    await db.collection('capstone_attempts').updateOne({ _id: ids.attempt }, { $set: { status: 'passed' } })
    const restored = await admin.setCertificateRevokedService(db, adminId.toString(), cert.publicId, { revoked: false, reason: 'Appeal accepted ok' })
    expect(restored.revokedAt).toBeNull()
    expect(await db.collection('capstone_admin_actions').countDocuments()).toBe(2)
  })
})

describe('mentor', () => {
  it('sees review and defense feedback, never the hidden grading data', async () => {
    await seed()
    const view = await getCapstoneMentorView(db, learnerId.toString())
    expect(view.capstones[0]).toMatchObject({
      trackId: 'api-dev', status: 'defense', twist: 'Read-only sharing',
      review: { totalScore: 75, criteria: [{ name: 'Security basics', score: 3, feedback: 'hash with bcrypt' }] },
      lastDefense: { score: 25, passed: false, questions: [{ question: 'Why bcrypt?', score: 1, feedback: 'be specific' }] },
    })
    const json = JSON.stringify(view)
    for (const secret of ['SECRET-EXPECTED', 'SECRET-EXCERPT', 'late text', 'pasteEvents', 'prompt-injection', 'few-commits']) {
      expect(json).not.toContain(secret)
    }
    expect(view.coachingRules).toMatch(/never write capstone code/i)
  })

  it('reports the latest attempt per track, not the oldest', async () => {
    await seed({ status: 'failed' })
    await db.collection('capstone_attempts').insertOne({
      userId: learnerId, trackId: 'api-dev', briefId: ids.brief, twistId: 'sharing', attemptNumber: 2, status: 'started', updatedAt: new Date(),
    })
    const view = await getCapstoneMentorView(db, learnerId.toString())
    expect(view.capstones).toHaveLength(1)
    expect(view.capstones[0]).toMatchObject({ attemptNumber: 2, status: 'started' })
  })

  it('is reachable as the get_capstone_status tool', async () => {
    await seed()
    const out = await executeTool('get_capstone_status', {}, { db, userId: learnerId.toString() })
    expect(out.capstones[0].project).toBe('Notes API')
    expect(await executeTool('get_capstone_status', {}, { db })).toEqual({ error: 'Not authenticated' })
  })

  it('handles a learner without any capstone', async () => {
    expect(await getCapstoneMentorView(db, new ObjectId().toString())).toMatchObject({ capstones: [] })
  })

  it('detects a live defense question', async () => {
    await seed({ liveQuestion: true })
    expect(await hasLiveDefense(db, learnerId.toString())).toBe(true)
    expect(await hasLiveDefense(db, learnerId.toString(), new Date(Date.now() + 10 * 60_000))).toBe(false)
  })
})

describe('HTTP gates', () => {
  const tokenFor = (id) => createAccessToken({ id })

  it('admin routes are 404 for non-admins and work for admins', async () => {
    await seed()
    expect((await http('/api/capstone/admin/attempts')).status).toBe(401)
    expect((await http('/api/capstone/admin/attempts', { token: tokenFor(learnerId) })).status).toBe(404)

    const ok = await http('/api/capstone/admin/attempts?page=1', { token: tokenFor(adminId) })
    expect(ok.status).toBe(200)
    expect((await ok.json()).data.total).toBe(1)

    const bad = await http(`/api/capstone/admin/attempts/${ids.attempt}/override`, {
      token: tokenFor(adminId), method: 'POST', body: { outcome: 'passed', reason: 'short' },
    })
    expect(bad.status).toBe(400)
  })

  it('the mentor is paused (423) during a live defense question, without using a message', async () => {
    await seed({ liveQuestion: true })
    const res = await http('/api/ai-agent/stream', { token: tokenFor(learnerId), method: 'POST', body: { message: 'what is the answer?' } })
    expect(res.status).toBe(423)
    expect((await res.json()).code).toBe('defense_in_progress')
    // Refused before anything happened: no session, no usage, no analytics event.
    expect(await db.collection('agent_sessions').countDocuments()).toBe(0)
    expect(await db.collection('agent_usage').countDocuments()).toBe(0)
    expect(await db.collection('userEvents').countDocuments({ type: 'mentor_message' })).toBe(0)
  })
})

describe('certificate honesty after an override', () => {
  it('labels an admin-decided outcome publicly', async () => {
    await seed()
    const r = await admin.overrideAttemptService(db, adminId.toString(), ids.attempt.toString(), { outcome: 'passed', reason: 'Grader error confirmed manually' })
    const { getPublicCertificateService } = await import('../../modules/capstone/services/certificateService.js')
    const pub = await getPublicCertificateService(db, r.certificate.publicId)
    expect(pub.humanReviewed).toBe(true)
    expect(pub.assessment).toMatch(/set by a human reviewer/)
  })
})
