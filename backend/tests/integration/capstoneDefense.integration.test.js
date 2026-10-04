/**
 * Capstone defense against a real MongoDB (in memory). GitHub and the model
 * are mocked. Each test drives an attempt to "defense" through the real
 * start → submit → review services first.
 *
 * The properties that matter:
 *  - the clock is the server's: late answers score 0, unanswered questions
 *    expire, and the next question's clock only starts when it is served;
 *  - one answer per question, one generation per session, under concurrency;
 *  - pass → attempt passed; fail → retake after cooldown; last fail → attempt failed;
 *  - a grading outage never loses answers; a crash between "session graded"
 *    and "attempt updated" heals on the next read.
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
  getFileText: vi.fn(),
}))
vi.mock('../../modules/capstone/services/reviewModel.js', () => ({
  runReviewModel: vi.fn(),
  runStructured: vi.fn(),
}))

const github = await import('../../modules/capstone/services/githubClient.js')
const { runReviewModel, runStructured } = await import('../../modules/capstone/services/reviewModel.js')
const { startAttemptService, getStatusService } = await import('../../modules/capstone/services/capstoneService.js')
const { submitService } = await import('../../modules/capstone/services/submissionService.js')
const { reviewService } = await import('../../modules/capstone/services/reviewService.js')
const defense = await import('../../modules/capstone/services/defenseService.js')
const { COOLDOWN_MS, DEFENSE_QUESTION_MS, MAX_DEFENSE_SESSIONS } = await import('../../modules/capstone/lib/constants.js')

let mongod
let client
let db

const TRACK = 'api-dev'
const ALICE = new ObjectId().toString()
const REPO = { owner: 'alice', repo: 'notes-api' }
const APP = Array.from({ length: 40 }, (_, i) => `// line ${i + 1}`).join('\n')

const brief = {
  trackId: TRACK, categoryId: 'backend', slug: 'api-dev-notes-service', version: 1, status: 'published',
  title: 'Notes API', summary: 's',
  requirements: [{ id: 'readme', text: 'README', check: { type: 'file', glob: 'README.md' } }],
  rubric: [
    { id: 'correctness', name: 'Correctness', description: 'd', weight: 60, layerId: 'api-dev-4' },
    { id: 'security', name: 'Security basics', description: 'd', weight: 40, layerId: 'api-dev-6' },
  ],
  twistPool: [{ id: 'a', text: 'twist a' }],
  passThresholds: { rubric: 0.7, defense: 0.6 },
}

// What the mocked model returns, per call kind.
let gradeScores // id → score
let generationCalls
const questionsJson = () =>
  JSON.stringify({
    questions: Array.from({ length: 5 }, (_, i) => ({
      text: `Question ${generationCalls}.${i + 1}: why is line ${i + 2} written this way?`,
      path: 'src/app.js', line: i + 2, focus: i % 2 ? 'security' : 'correctness',
      expectedPoints: ['a specific reason'],
    })),
  })

const sessions = () => db.collection('capstone_defenses').find({}).sort({ sessionNumber: 1 }).toArray()
const attemptOf = () => db.collection('capstone_attempts').findOne({ userId: new ObjectId(ALICE) })

/** start → submit → passing review, so the attempt is in "defense". */
const toDefense = async () => {
  await startAttemptService(db, ALICE, TRACK)
  await submitService(db, ALICE, TRACK, REPO)
  runReviewModel.mockResolvedValue({
    content: JSON.stringify({ summary: 's', criteria: [
      { id: 'correctness', score: 4, feedback: 'f', evidence: [] },
      { id: 'security', score: 3, feedback: 'f', evidence: [] },
    ] }),
    usage: null,
  })
  await reviewService(db, ALICE, TRACK)
  expect((await attemptOf()).status).toBe('defense')
}

/** Answer every remaining question with the given text. */
const answerAll = async (text = 'Because of X in my code') => {
  let r = await defense.getDefenseService(db, ALICE, TRACK)
  while (r.session.current) {
    r = await defense.answerDefenseService(db, ALICE, TRACK, {
      questionId: r.session.current.id, answer: text, integrity: { tabSwitches: 0, pasteEvents: 0 },
    })
  }
  return r
}

/** Move the open question's clock into the past. */
const ageCurrentQuestion = async (ms) => {
  const [s] = (await sessions()).slice(-1)
  const i = s.currentIndex
  await db.collection('capstone_defenses').updateOne(
    { _id: s._id },
    { $set: { [`questions.${i}.askedAt`]: new Date(Date.now() - ms) } },
  )
}

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
  for (const c of ['capstone_briefs', 'capstone_attempts', 'capstone_submissions', 'capstone_reviews', 'capstone_defenses', 'userEvents', 'weakSpots', 'certificates']) {
    await db.collection(c).deleteMany({})
  }
  await db.collection('capstone_briefs').insertOne({ ...brief })
  vi.clearAllMocks()

  const later = new Date(Date.now() + 60 * 60 * 1000)
  github.getRepo.mockResolvedValue({
    id: 7, fullName: 'alice/notes-api', htmlUrl: 'https://github.com/alice/notes-api',
    private: false, fork: false, sizeKb: 10, createdAt: later, defaultBranch: 'main',
  })
  github.getHeadCommit.mockResolvedValue({ sha: 'sha-1', treeSha: 'tree-1', committedAt: later })
  github.getCommitStats.mockResolvedValue({ count: 8, rootCommittedAt: later })
  const files = { 'README.md': '# Notes', 'src/app.js': APP }
  const entries = Object.entries(files).map(([path, text]) => ({ path, size: text.length }))
  github.getTree.mockResolvedValue({ truncated: false, paths: entries.map((e) => e.path), entries })
  github.getFileText.mockImplementation(async (_f, _s, path) => files[path] ?? null)

  gradeScores = { q1: 3, q2: 3, q3: 3, q4: 3, q5: 3 } // 15/20 = 75% → pass
  generationCalls = 0
  runStructured.mockImplementation(async (messages, schema, name) => {
    if (name === 'capstone_defense_questions') {
      generationCalls++
      return { content: questionsJson(), usage: null }
    }
    if (name === 'capstone_defense_grading') {
      const ids = schema.properties.grades.items.properties.id.enum
      return { content: JSON.stringify({ grades: ids.map((id) => ({ id, score: gradeScores[id], feedback: `fb ${id}` })) }), usage: null }
    }
    throw new Error(`unexpected model call ${name}`)
  })
})

describe('starting a defense', () => {
  it('refuses before the review has passed', async () => {
    await startAttemptService(db, ALICE, TRACK)
    await expect(defense.startDefenseService(db, ALICE, TRACK)).rejects.toMatchObject({ status: 409 })
  })

  it('generates five questions and serves only the first, with the clock running', async () => {
    await toDefense()
    const r = await defense.startDefenseService(db, ALICE, TRACK)

    expect(r.session).toMatchObject({ status: 'active', total: 5, answeredCount: 0 })
    expect(r.session.current).toMatchObject({ id: 'q1', number: 1 })
    expect(r.session.current.secondsLeft).toBeGreaterThan(170)
    expect(r.session.current.codeUrl).toBe('https://github.com/alice/notes-api/blob/sha-1/src/app.js#L2')
    expect(JSON.stringify(r)).not.toContain('expectedPoints')
    expect(JSON.stringify(r)).not.toContain('a specific reason')

    const [s] = await sessions()
    expect(s.questions[0].askedAt).toBeInstanceOf(Date)
    expect(s.questions[1].askedAt).toBeNull()
  })

  it('concurrent starts generate questions exactly once', async () => {
    await toDefense()
    runStructured.mockImplementationOnce(async () => {
      await new Promise((r) => setTimeout(r, 50))
      generationCalls++
      return { content: questionsJson(), usage: null }
    })
    const results = await Promise.allSettled(Array.from({ length: 4 }, () => defense.startDefenseService(db, ALICE, TRACK)))

    expect(generationCalls).toBe(1)
    expect(await db.collection('capstone_defenses').countDocuments()).toBe(1)
    expect(results.filter((r) => r.status === 'rejected').every((r) => r.reason.status === 409)).toBe(true)
  })

  it('a generation failure leaves nothing behind, and a retry works', async () => {
    await toDefense()
    runStructured.mockRejectedValueOnce(Object.assign(new Error('busy'), { status: 503 }))
    await expect(defense.startDefenseService(db, ALICE, TRACK)).rejects.toMatchObject({ status: 503 })
    expect(await db.collection('capstone_defenses').countDocuments()).toBe(0)

    const r = await defense.startDefenseService(db, ALICE, TRACK)
    expect(r.session.status).toBe('active')
  })

  it('a second start resumes the open session instead of creating one', async () => {
    await toDefense()
    const a = await defense.startDefenseService(db, ALICE, TRACK)
    const b = await defense.startDefenseService(db, ALICE, TRACK)
    expect(b.session.id).toBe(a.session.id)
    expect(generationCalls).toBe(1)
  })
})

describe('answering', () => {
  it('a full on-time defense above the pass mark passes the capstone', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    const r = await answerAll()

    expect(r.session.status).toBe('graded')
    expect(r.session.result).toEqual({ score: 75, passed: true })
    expect(r.session.answered[0]).toMatchObject({ score: 3, feedback: 'fb q1' })
    expect(r.attempt.status).toBe('passed')
    expect((await attemptOf()).defenseScore).toBe(75)
    expect(await db.collection('userEvents').countDocuments({ type: 'capstone_passed' })).toBe(1)
    // passing issues the certificate in the same request
    expect(await db.collection('certificates').countDocuments({ trackId: TRACK })).toBe(1)
  })

  it('serves the next question in the same response as an answer', async () => {
    await toDefense()
    const start = await defense.startDefenseService(db, ALICE, TRACK)
    const r = await defense.answerDefenseService(db, ALICE, TRACK, { questionId: start.session.current.id, answer: 'x', integrity: {} })
    expect(r.session.current).toMatchObject({ id: 'q2', number: 2 })
    expect(r.session.answered.map((a) => a.answer)).toEqual(['x'])
  })

  it('cannot answer a question twice, even concurrently', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    const results = await Promise.allSettled([
      defense.answerDefenseService(db, ALICE, TRACK, { questionId: 'q1', answer: 'first', integrity: {} }),
      defense.answerDefenseService(db, ALICE, TRACK, { questionId: 'q1', answer: 'second', integrity: {} }),
    ])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    expect(results.find((r) => r.status === 'rejected').reason.status).toBe(409)
    const [s] = await sessions()
    expect(s.currentIndex).toBe(1)
  })

  it('cannot answer a question that is not open', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    await expect(defense.answerDefenseService(db, ALICE, TRACK, { questionId: 'q3', answer: 'x', integrity: {} }))
      .rejects.toMatchObject({ status: 409 })
  })

  it('a late answer is kept for the admin but scores 0 and is not sent to the grader', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    await ageCurrentQuestion(DEFENSE_QUESTION_MS + 60_000)
    await defense.answerDefenseService(db, ALICE, TRACK, { questionId: 'q1', answer: 'too late', integrity: {} })
    const r = await answerAll()

    const [s] = await sessions()
    expect(s.questions[0]).toMatchObject({ expired: true, answer: '', lateAnswer: 'too late', score: 0 })
    const gradingCall = runStructured.mock.calls.find((c) => c[2] === 'capstone_defense_grading')
    expect(gradingCall[1].properties.grades.items.properties.id.enum).toEqual(['q2', 'q3', 'q4', 'q5'])
    // 0+3+3+3+3 = 12/20 → 60
    expect(r.session.result.score).toBe(60)
  })

  it('an unanswered question expires on the next read without starting the next clock', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    await ageCurrentQuestion(DEFENSE_QUESTION_MS + 60_000)

    // The read expires q1 and serves q2 fresh — q2's clock starts now, not when q1 ran out.
    const r = await defense.getDefenseService(db, ALICE, TRACK)
    expect(r.session.answered[0]).toMatchObject({ id: 'q1', expired: true })
    expect(r.session.current.id).toBe('q2')
    expect(r.session.current.secondsLeft).toBeGreaterThan(170)
  })
})

describe('failing and retaking', () => {
  it('a failed defense waits for the cooldown and keeps the attempt open', async () => {
    gradeScores = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1 }
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    const r = await answerAll()

    expect(r.session.result.passed).toBe(false)
    expect(r.attempt.status).toBe('defense')
    expect(r.canStart).toBe(false)
    expect(new Date(r.retryAt).getTime()).toBeGreaterThan(Date.now() + COOLDOWN_MS - 5_000)
    await expect(defense.startDefenseService(db, ALICE, TRACK)).rejects.toMatchObject({ status: 429 })

    // weak spots for the low focus areas
    const spots = await db.collection('weakSpots').find({}).toArray()
    expect(spots.map((s) => s.topic).sort()).toEqual(['Correctness', 'Security basics'])
    expect((await getStatusService(db, ALICE, TRACK)).attemptsUsed).toBe(0) // not used up yet
  })

  it('a retake asks new questions and tells the model what was asked before', async () => {
    gradeScores = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 }
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    await answerAll()
    await db.collection('capstone_attempts').updateOne({}, { $set: { defenseRetryAt: new Date(Date.now() - 1) } })

    const r = await defense.startDefenseService(db, ALICE, TRACK)
    expect(r.session.sessionNumber).toBe(2)
    expect(r.session.current.text).toContain('Question 2.1')
    const secondGen = runStructured.mock.calls.filter((c) => c[2] === 'capstone_defense_questions')[1]
    expect(secondGen[0][1].content).toContain('Question 1.1')
  })

  it(`failing all ${MAX_DEFENSE_SESSIONS} sessions fails the attempt with a cooldown`, async () => {
    gradeScores = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 }
    await toDefense()
    let r
    for (let i = 0; i < MAX_DEFENSE_SESSIONS; i++) {
      await db.collection('capstone_attempts').updateOne({}, { $set: { defenseRetryAt: null } })
      await defense.startDefenseService(db, ALICE, TRACK)
      r = await answerAll('')
    }
    expect(r.attempt.status).toBe('failed')
    const status = await getStatusService(db, ALICE, TRACK)
    expect(status).toMatchObject({ attemptsUsed: 1, reason: 'cooldown' })
    expect(await db.collection('userEvents').countDocuments({ type: 'capstone_failed' })).toBe(1)
    // empty answers never reach the grader
    expect(runStructured.mock.calls.filter((c) => c[2] === 'capstone_defense_grading')).toHaveLength(0)
  })
})

describe('resilience', () => {
  it('a grading outage keeps the answers; grading can be retried', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    runStructured.mockImplementation(async (m, s, name) => {
      if (name === 'capstone_defense_grading') throw Object.assign(new Error('busy'), { status: 503 })
      generationCalls++
      return { content: questionsJson(), usage: null }
    })
    const r = await answerAll()
    expect(r.gradingError).toMatch(/capacity|busy|Try again/i)
    expect(r.session.status).toBe('answered')
    expect((await sessions())[0].questions.every((q) => q.answer)).toBe(true)

    runStructured.mockImplementation(async (m, schema) => ({
      content: JSON.stringify({ grades: schema.properties.grades.items.properties.id.enum.map((id) => ({ id, score: 4, feedback: '' })) }),
      usage: null,
    }))
    const graded = await defense.gradeDefenseService(db, ALICE, TRACK)
    expect(graded.session.result).toEqual({ score: 100, passed: true })
    expect(graded.attempt.status).toBe('passed')
  })

  it('heals an attempt whose graded result was never applied', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    await answerAll()
    // Simulate a crash after "session graded" but before "attempt updated".
    await db.collection('capstone_attempts').updateOne({}, { $set: { status: 'defense' }, $unset: { lastDefenseSessionId: '', finishedAt: '' } })
    await db.collection('userEvents').deleteMany({})

    const r = await defense.getDefenseService(db, ALICE, TRACK)
    expect(r.attempt.status).toBe('passed')
    // and it is applied exactly once
    await defense.getDefenseService(db, ALICE, TRACK)
    expect(await db.collection('userEvents').countDocuments({ type: 'capstone_passed' })).toBe(1)
  })

  it('grading twice is refused once the session is graded', async () => {
    await toDefense()
    await defense.startDefenseService(db, ALICE, TRACK)
    await answerAll()
    await expect(defense.gradeDefenseService(db, ALICE, TRACK)).rejects.toMatchObject({ status: 409 })
  })
})
