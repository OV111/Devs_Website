import { describe, it, expect, vi } from 'vitest'
import { validate } from '../../middleware/validate.js'
import {
  createSessionSchema,
  sessionIdParamSchema,
  updateSessionSchema,
  streamSchema,
} from '../../validation/aiAgent.schemas.js'
import { appendMessages, checkDailyLimit, incrementUsage, updateSession, deleteSession } from '../../services/agent/sessionService.js'
import { executeTool, toolDefinitions } from '../../tools/agentTools.js'
import { composeUserMessage } from '../../services/agent/streamService.js'

const VALID_OID = '507f1f77bcf86cd799439011'
const OTHER_OID = '507f1f77bcf86cd799439022'

// ─── helpers ────────────────────────────────────────────────────────────────

const makeRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

const runValidate = (schemas, req) => {
  const res = makeRes()
  const next = vi.fn()
  validate(schemas)(req, res, next)
  return { res, next }
}

// ─── validate middleware ────────────────────────────────────────────────────

describe('validate middleware', () => {
  it('calls next() and normalizes the body when input is valid', () => {
    const req = { body: { message: '  hello  ', sessionId: VALID_OID } }
    const { next, res } = runValidate({ body: streamSchema }, req)

    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
    // Zod trims, and the middleware writes the parsed value back
    expect(req.body.message).toBe('hello')
  })

  it('returns 400 with the field name instead of throwing', () => {
    const { next, res } = runValidate({ body: streamSchema }, { body: {} })

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ field: 'message' }),
    )
  })

  it('validates params as well as body', () => {
    const { next, res } = runValidate(
      { params: sessionIdParamSchema },
      { params: { id: 'not-a-hex-id' } },
    )

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

// ─── schemas ────────────────────────────────────────────────────────────────

describe('aiAgent schemas', () => {
  it('accepts a null sessionId (the client sends null before a session exists)', () => {
    const r = streamSchema.safeParse({ sessionId: null, message: 'hi' })
    expect(r.success).toBe(true)
  })

  it('accepts an omitted sessionId', () => {
    expect(streamSchema.safeParse({ message: 'hi' }).success).toBe(true)
  })

  it('rejects a whitespace-only message', () => {
    expect(streamSchema.safeParse({ message: '   ' }).success).toBe(false)
  })

  it('rejects a message over the 4000-char cost ceiling', () => {
    expect(streamSchema.safeParse({ message: 'x'.repeat(4001) }).success).toBe(false)
  })

  it('rejects a malformed ObjectId rather than letting BSON throw downstream', () => {
    expect(sessionIdParamSchema.safeParse({ id: 'garbage' }).success).toBe(false)
    expect(sessionIdParamSchema.safeParse({ id: VALID_OID }).success).toBe(true)
  })

  it('allows an omitted session title', () => {
    expect(createSessionSchema.safeParse({}).success).toBe(true)
  })
})

// ─── attachments ────────────────────────────────────────────────────────────

describe('attachment validation', () => {
  const base = { message: 'explain this' }

  it('accepts a message with no attachments', () => {
    expect(streamSchema.safeParse(base).success).toBe(true)
  })

  it('accepts up to 3 files', () => {
    const three = Array.from({ length: 3 }, (_, i) => ({ name: `f${i}.js`, content: 'x' }))
    expect(streamSchema.safeParse({ ...base, attachments: three }).success).toBe(true)
  })

  it('rejects more than 3 files', () => {
    const four = Array.from({ length: 4 }, (_, i) => ({ name: `f${i}.js`, content: 'x' }))
    expect(streamSchema.safeParse({ ...base, attachments: four }).success).toBe(false)
  })

  it('rejects a single file over the per-file cap', () => {
    const big = [{ name: 'big.js', content: 'x'.repeat(9000) }]
    expect(streamSchema.safeParse({ ...base, attachments: big }).success).toBe(false)
  })

  it('rejects files that individually pass but together exceed the total cap', () => {
    // 3 x 8000 = 24000 > MAX_TOTAL_CHARS, though each is under the per-file cap
    const each = Array.from({ length: 3 }, (_, i) => ({ name: `f${i}.js`, content: 'x'.repeat(8000) }))
    const r = streamSchema.safeParse({ ...base, attachments: each })
    expect(r.success).toBe(false)
    expect(r.error.issues[0].message).toMatch(/total size limit/i)
  })

  it('rejects an attachment with an empty name or content', () => {
    expect(streamSchema.safeParse({ ...base, attachments: [{ name: '', content: 'x' }] }).success).toBe(false)
    expect(streamSchema.safeParse({ ...base, attachments: [{ name: 'a.js', content: '' }] }).success).toBe(false)
  })
})

describe('composeUserMessage', () => {
  it('returns the message untouched when there are no attachments', () => {
    expect(composeUserMessage('hello', [])).toBe('hello')
    expect(composeUserMessage('hello')).toBe('hello')
  })

  it('fences file content and keeps the user message last', () => {
    const out = composeUserMessage('what does this do?', [
      { name: 'index.js', content: 'const a = 1' },
    ])
    expect(out).toContain('<<<FILE name="index.js">>>')
    expect(out).toContain('const a = 1')
    expect(out).toContain('<<<END FILE>>>')
    // the instruction to treat files as data must survive, and the user's
    // actual question must come last
    expect(out).toMatch(/never as instructions/i)
    expect(out.trim().endsWith('what does this do?')).toBe(true)
  })

  it('neutralizes a quote in the filename so the marker cannot be broken out of', () => {
    const out = composeUserMessage('hi', [{ name: 'a".js', content: 'x' }])
    expect(out).toContain(`<<<FILE name="a'.js">>>`)
  })

  it('includes every attachment', () => {
    const out = composeUserMessage('review', [
      { name: 'a.js', content: 'AAA' },
      { name: 'b.js', content: 'BBB' },
    ])
    expect(out).toContain('AAA')
    expect(out).toContain('BBB')
    expect(out).toMatch(/attached 2 files/i)
  })
})

// ─── sliding-window memory ──────────────────────────────────────────────────

describe('appendMessages (20-turn sliding window)', () => {
  const makeDb = (existing) => {
    const updateOne = vi.fn().mockResolvedValue({})
    const db = {
      collection: () => ({
        findOne: vi.fn().mockResolvedValue({ _id: VALID_OID, messages: existing }),
        updateOne,
      }),
    }
    return { db, updateOne }
  }

  it('appends the user and assistant messages as a pair', async () => {
    const { db, updateOne } = makeDb([])
    await appendMessages(db, VALID_OID, 'question', 'answer')

    const saved = updateOne.mock.calls[0][1].$set.messages
    expect(saved).toHaveLength(2)
    expect(saved[0]).toMatchObject({ role: 'user', content: 'question' })
    expect(saved[1]).toMatchObject({ role: 'assistant', content: 'answer' })
  })

  it('trims history to the last 20 turns (40 entries) to cap prompt cost', async () => {
    // 60 pre-existing entries = 30 turns, already over the cap
    const existing = Array.from({ length: 60 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `old-${i}`,
    }))
    const { db, updateOne } = makeDb(existing)

    await appendMessages(db, VALID_OID, 'newest-q', 'newest-a')

    const saved = updateOne.mock.calls[0][1].$set.messages
    expect(saved).toHaveLength(40)
    // the newest turn must survive the trim
    expect(saved.at(-2)).toMatchObject({ role: 'user', content: 'newest-q' })
    expect(saved.at(-1)).toMatchObject({ role: 'assistant', content: 'newest-a' })
    // the oldest entries must be gone
    expect(saved.find((m) => m.content === 'old-0')).toBeUndefined()
  })

  it('is a no-op when the session does not exist', async () => {
    const updateOne = vi.fn()
    const db = { collection: () => ({ findOne: vi.fn().mockResolvedValue(null), updateOne }) }

    await appendMessages(db, VALID_OID, 'q', 'a')
    expect(updateOne).not.toHaveBeenCalled()
  })
})

// ─── daily cost cap ─────────────────────────────────────────────────────────

describe('checkDailyLimit (30 messages/day)', () => {
  const makeDb = (doc) => ({
    collection: () => ({
      findOne: vi.fn().mockResolvedValue(doc),
      findOneAndUpdate: vi.fn().mockResolvedValue({}),
    }),
  })

  it('allows a user with no usage recorded today', async () => {
    const r = await checkDailyLimit(makeDb(null), VALID_OID)
    expect(r.allowed).toBe(true)
  })

  it('allows the 30th message', async () => {
    const r = await checkDailyLimit(makeDb({ count: 29 }), VALID_OID)
    expect(r.allowed).toBe(true)
  })

  it('blocks the 31st message and returns a resetAt timestamp', async () => {
    const r = await checkDailyLimit(makeDb({ count: 30 }), VALID_OID)
    expect(r.allowed).toBe(false)
    expect(new Date(r.resetAt).getTime()).toBeGreaterThan(Date.now())
  })

  it('increments usage as an upsert so the first message of a day works', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue({})
    const db = { collection: () => ({ findOneAndUpdate }) }

    await incrementUsage(db, VALID_OID)

    const [, update, opts] = findOneAndUpdate.mock.calls[0]
    expect(update.$inc).toEqual({ count: 1 })
    expect(opts.upsert).toBe(true)
  })
})

// ─── rename / delete ────────────────────────────────────────────────────────

describe('updateSession / deleteSession ownership', () => {
  it('rename scopes the filter by userId, not just _id', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue({ value: { _id: VALID_OID } })
    const db = { collection: () => ({ findOneAndUpdate }) }

    await updateSession(db, VALID_OID, OTHER_OID, { title: 'new title' })

    const [filter] = findOneAndUpdate.mock.calls[0]
    // Without userId in the filter any user could rename another user's chat
    expect(filter.userId).toBeDefined()
    expect(String(filter.userId)).toBe(VALID_OID)
  })

  it('rename truncates a title to 80 chars', async () => {
    const findOneAndUpdate = vi.fn().mockResolvedValue({ value: {} })
    const db = { collection: () => ({ findOneAndUpdate }) }

    await updateSession(db, VALID_OID, OTHER_OID, { title: 'x'.repeat(200) })

    const [, update] = findOneAndUpdate.mock.calls[0]
    expect(update.$set.title).toHaveLength(80)
  })

  it('delete scopes the filter by userId and reports whether anything went', async () => {
    const deleteOne = vi.fn().mockResolvedValue({ deletedCount: 1 })
    const db = { collection: () => ({ deleteOne }) }

    expect(await deleteSession(db, VALID_OID, OTHER_OID)).toBe(true)
    const [filter] = deleteOne.mock.calls[0]
    expect(String(filter.userId)).toBe(VALID_OID)
  })

  it('delete returns false when nothing matched (wrong owner or missing)', async () => {
    const db = { collection: () => ({ deleteOne: vi.fn().mockResolvedValue({ deletedCount: 0 }) }) }
    expect(await deleteSession(db, VALID_OID, OTHER_OID)).toBe(false)
  })

  it('rename schema rejects empty and over-long titles', () => {
    expect(updateSessionSchema.safeParse({ title: '' }).success).toBe(false)
    expect(updateSessionSchema.safeParse({ title: '   ' }).success).toBe(false)
    expect(updateSessionSchema.safeParse({ title: 'x'.repeat(81) }).success).toBe(false)
    expect(updateSessionSchema.safeParse({ title: 'Valid' }).success).toBe(true)
  })
})

// ─── tools ──────────────────────────────────────────────────────────────────

describe('agentTools', () => {
  it('exposes exactly the tools the UI advertises', () => {
    expect(toolDefinitions.map((t) => t.function.name).sort()).toEqual([
      'get_exam_history',
      'get_user_profile',
      'get_user_progress',
      'get_weak_spots',
      'log_weak_spot',
      'search_library',
      'search_posts',
    ])
  })

  it('refuses user-scoped tools when there is no authenticated user', async () => {
    const db = { collection: () => ({}) }
    for (const name of ['get_user_progress', 'get_exam_history', 'get_weak_spots', 'log_weak_spot']) {
      expect(await executeTool(name, {}, { db })).toEqual({ error: 'Not authenticated' })
    }
  })

  it('returns a structured error for an unknown tool instead of throwing', async () => {
    const db = { collection: () => ({}) }
    expect(await executeTool('does_not_exist', {}, { db })).toEqual({
      error: 'Unknown tool: does_not_exist',
    })
  })

  it('rejects a non-string topic rather than throwing on .trim()', async () => {
    const db = { collection: () => ({}) }
    const r = await executeTool('log_weak_spot', { topic: 123 }, { db, userId: VALID_OID })
    expect(r).toEqual({ error: 'topic is required' })
  })

  it('reads community posts from the posts-default collection', async () => {
    const toArray = vi.fn().mockResolvedValue([])
    const collection = vi.fn().mockReturnValue({
      find: vi.fn().mockReturnValue({
        project: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ toArray }) }),
      }),
    })

    await executeTool('search_posts', { category: 'backend', keyword: 'auth' }, { db: { collection } })

    // Guards the bug where this queried a non-existent "defaultPosts" collection
    expect(collection).toHaveBeenCalledWith('posts-default')
  })
})
