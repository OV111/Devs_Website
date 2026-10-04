import { describe, it, expect } from 'vitest'
import { ObjectId } from 'mongodb'
import {
  buildGradingMessages,
  buildQuestionMessages,
  excerptAround,
  gradingJsonSchema,
  isOnTime,
  normalizeAnswer,
  parseGrades,
  parseQuestions,
  questionJsonSchema,
  scoreDefense,
} from '../../modules/capstone/lib/defense.js'
import { toPublicDefense } from '../../modules/capstone/lib/publicView.js'
import {
  DEFENSE_ANSWER_MAX_CHARS,
  DEFENSE_GRACE_MS,
  DEFENSE_QUESTION_COUNT,
  DEFENSE_QUESTION_MS,
} from '../../modules/capstone/lib/constants.js'
import { defenseAnswerSchema } from '../../modules/capstone/schemas/capstone.schemas.js'

const rubric = [
  { id: 'correctness', name: 'Correctness', weight: 60, description: 'd', layerId: 'api-dev-4' },
  { id: 'security', name: 'Security', weight: 40, description: 'd', layerId: 'api-dev-6' },
]
const fileText = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join('\n')
const fileTexts = new Map([['src/app.js', fileText]])

const q = (overrides = {}) => ({
  text: 'Why did you put the auth check in middleware here?',
  path: 'src/app.js',
  line: 25,
  focus: 'security',
  expectedPoints: ['runs before every handler', 'single place to change'],
  ...overrides,
})
const output = (questions) => JSON.stringify({ questions })
const five = (overrides) => Array.from({ length: DEFENSE_QUESTION_COUNT }, () => q(overrides))

describe('parseQuestions', () => {
  it('assigns ids, keeps the code reference and stores an excerpt around it', () => {
    const { questions } = parseQuestions(output(five()), rubric, fileTexts)
    expect(questions.map((x) => x.id)).toEqual(['q1', 'q2', 'q3', 'q4', 'q5'])
    expect(questions[0].codeRef).toEqual({ path: 'src/app.js', line: 25 })
    expect(questions[0].excerpt).toContain('25| line 25')
    expect(questions[0].excerpt.startsWith('5| line 5')).toBe(true) // radius 20
  })

  it('clamps an out-of-range line to 0 (file-level)', () => {
    const { questions } = parseQuestions(output(five({ line: 999 })), rubric, fileTexts)
    expect(questions[0].codeRef.line).toBe(0)
  })

  it.each([
    ['the wrong number of questions', output([q(), q()])],
    ['an unknown file', output(five({ path: 'src/invented.js' }))],
    ['an unknown focus', output(five({ focus: 'vibes' }))],
    ['no expected points', output(five({ expectedPoints: [] }))],
    ['invalid JSON', '{'],
  ])('rejects %s as invalid output', (_, raw) => {
    expect(() => parseQuestions(raw, rubric, fileTexts)).toThrow(expect.objectContaining({ invalidOutput: true }))
  })
})

describe('excerptAround', () => {
  it('numbers lines as in the original file and stays in bounds', () => {
    expect(excerptAround('a\nb\nc', 2, 1)).toBe('1| a\n2| b\n3| c')
    expect(excerptAround('a\nb\nc', 0, 1)).toBe('1| a\n2| b')
  })
})

describe('timer', () => {
  const askedAt = new Date('2026-10-03T12:00:00Z')
  it('accepts answers until the deadline plus grace, not after', () => {
    expect(isOnTime(askedAt, new Date(askedAt.getTime() + DEFENSE_QUESTION_MS + DEFENSE_GRACE_MS))).toBe(true)
    expect(isOnTime(askedAt, new Date(askedAt.getTime() + DEFENSE_QUESTION_MS + DEFENSE_GRACE_MS + 1))).toBe(false)
  })
})

describe('normalizeAnswer', () => {
  it('trims and caps', () => {
    expect(normalizeAnswer('  hi  ')).toBe('hi')
    expect(normalizeAnswer('x'.repeat(DEFENSE_ANSWER_MAX_CHARS + 10))).toHaveLength(DEFENSE_ANSWER_MAX_CHARS)
    expect(normalizeAnswer(undefined)).toBe('')
  })
})

describe('parseGrades', () => {
  const ids = ['q1', 'q2']
  const grades = (list) => JSON.stringify({ grades: list })

  it('returns one grade per question', () => {
    const r = parseGrades(grades([{ id: 'q2', score: 1, feedback: 'b' }, { id: 'q1', score: 4, feedback: 'a' }]), ids)
    expect(r.grades.get('q1')).toEqual({ score: 4, feedback: 'a' })
    expect(r.grades.get('q2')).toEqual({ score: 1, feedback: 'b' })
  })

  it.each([
    ['a skipped question', grades([{ id: 'q1', score: 4, feedback: '' }])],
    ['a duplicate', grades([{ id: 'q1', score: 4, feedback: '' }, { id: 'q1', score: 2, feedback: '' }, { id: 'q2', score: 1, feedback: '' }])],
    ['an unknown id', grades([{ id: 'q1', score: 4, feedback: '' }, { id: 'q2', score: 1, feedback: '' }, { id: 'q9', score: 4, feedback: '' }])],
    ['a score out of range', grades([{ id: 'q1', score: 7, feedback: '' }, { id: 'q2', score: 1, feedback: '' }])],
  ])('rejects %s', (_, raw) => {
    expect(() => parseGrades(raw, ids)).toThrow(expect.objectContaining({ invalidOutput: true }))
  })
})

describe('scoreDefense', () => {
  it('averages on a 0–100 scale and passes at the mark', () => {
    // 3+3+3+2+1 = 12 of 20 → 60
    expect(scoreDefense([3, 3, 3, 2, 1], 0.6)).toEqual({ score: 60, passed: true })
    expect(scoreDefense([3, 3, 2, 2, 1], 0.6)).toEqual({ score: 55, passed: false })
  })
})

describe('prompts', () => {
  it('question prompt includes the repo in nonce delimiters and earlier questions', () => {
    const m = buildQuestionMessages({
      brief: { title: 'Notes', rubric },
      twist: { text: 'sharing' },
      review: { criteria: [{ id: 'security', score: 1, feedback: 'weak hashing' }] },
      files: [{ path: 'src/app.js', text: 'x' }],
      previousQuestions: ['Old question?'],
      nonce: 'abc',
    })
    expect(m[1].content).toContain('<<<FILE abc path="src/app.js">>>')
    expect(m[1].content).toContain('- Old question?')
    expect(m[1].content).toContain('security: 1/4 — weak hashing')
  })

  it('grading prompt fences each answer with the nonce', () => {
    const m = buildGradingMessages({
      questions: [{ id: 'q1', text: 'Why?', codeRef: { path: 'a.js', line: 3 }, excerpt: '3| x', expectedPoints: ['p'], answer: 'Because' }],
      nonce: 'n1',
    })
    expect(m[1].content).toContain('<<<ANSWER n1>>>\nBecause\n<<<END ANSWER n1>>>')
    expect(m[0].content).toMatch(/UNTRUSTED DATA/)
  })

  it('schemas pin ids and scores to enums', () => {
    expect(questionJsonSchema(['a']).properties.questions.items.properties.focus.enum).toEqual(['a'])
    expect(gradingJsonSchema(['q1']).properties.grades.items.properties.id.enum).toEqual(['q1'])
  })
})

describe('defenseAnswerSchema', () => {
  it('accepts an empty answer (a skip) and fills integrity defaults', () => {
    expect(defenseAnswerSchema.parse({ questionId: 'q1', answer: '' })).toEqual({
      questionId: 'q1', answer: '', integrity: { tabSwitches: 0, pasteEvents: 0 },
    })
  })

  it('neutralises junk integrity values instead of failing the answer', () => {
    const r = defenseAnswerSchema.parse({ questionId: 'q2', answer: 'x', integrity: { tabSwitches: -5, pasteEvents: 'lots' } })
    expect(r.integrity).toEqual({ tabSwitches: 0, pasteEvents: 0 })
  })

  it.each([{ questionId: 'x', answer: '' }, { questionId: 'q1', answer: 'x'.repeat(3001) }, { questionId: 'q1' }])(
    'rejects %j', (body) => {
      expect(defenseAnswerSchema.safeParse(body).success).toBe(false)
    },
  )
})

describe('toPublicDefense', () => {
  const askedAt = new Date('2026-10-03T12:00:00Z')
  const submission = { repo: { htmlUrl: 'https://github.com/a/b' }, commitSha: 'sha1' }
  const question = (i, extra = {}) => ({
    id: `q${i}`, text: `Q${i}?`, codeRef: { path: 'src/my file.js', line: 7 }, focus: 'security',
    expectedPoints: ['SECRET POINT'], excerpt: 'SECRET EXCERPT', integrity: { pasteEvents: 3 }, ...extra,
  })

  it('shows only the open question, with a server deadline and a pinned code link', () => {
    const v = toPublicDefense(
      { _id: new ObjectId(), sessionNumber: 1, status: 'active', currentIndex: 1, flags: [{ id: 'x' }],
        questions: [question(1, { answer: 'mine', askedAt }), question(2, { askedAt }), question(3, { askedAt: null })] },
      submission,
      new Date(askedAt.getTime() + 60_000),
    )
    expect(v.current).toMatchObject({ id: 'q2', number: 2, secondsLeft: 120 })
    expect(v.current.codeUrl).toBe('https://github.com/a/b/blob/sha1/src/my%20file.js#L7')
    expect(v.answered).toHaveLength(1)
    expect(v.answered[0]).not.toHaveProperty('score')
    expect(v.result).toBeNull()
    const json = JSON.stringify(v)
    for (const secret of ['SECRET POINT', 'SECRET EXCERPT', 'pasteEvents', 'flags', 'Q3?']) expect(json).not.toContain(secret)
  })

  it('reveals scores and feedback only once graded', () => {
    const v = toPublicDefense(
      { _id: new ObjectId(), sessionNumber: 1, status: 'graded', currentIndex: 1, result: { score: 75, passed: true },
        questions: [question(1, { answer: 'a', askedAt, score: 3, feedback: 'good' })] },
      submission,
    )
    expect(v.current).toBeNull()
    expect(v.answered[0]).toMatchObject({ score: 3, maxScore: 4, feedback: 'good' })
    expect(v.result).toEqual({ score: 75, passed: true })
  })

  it('handles a session that is still generating', () => {
    const v = toPublicDefense({ _id: new ObjectId(), sessionNumber: 1, status: 'generating' }, submission)
    expect(v).toMatchObject({ total: 0, current: null, answered: [], result: null })
  })
})
