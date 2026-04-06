import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { createToken, verifyToken } from '../../utils/jwtToken.js'
import process from 'node:process'
// setup.js sets JWT_Secret before this file runs

const VALID_ID = '507f1f77bcf86cd799439011'

describe('createToken', () => {
  it('returns a three-part JWT string', () => {
    const token = createToken({ id: VALID_ID })
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('embeds the user id in the payload', () => {
    const token = createToken({ id: VALID_ID })
    const payload = verifyToken(token)
    expect(payload.id).toBe(VALID_ID)
  })

  it('produces tokens that expire in ~7 days', () => {
    const token = createToken({ id: VALID_ID })
    const payload = jwt.decode(token)
    const sevenDaysInSeconds = 7 * 24 * 60 * 60
    const diff = payload.exp - payload.iat
    expect(diff).toBe(sevenDaysInSeconds)
  })

  it('produces unique tokens for different user ids', () => {
    const t1 = createToken({ id: '507f1f77bcf86cd799439011' })
    const t2 = createToken({ id: '507f1f77bcf86cd799439012' })
    expect(t1).not.toBe(t2)
  })
})

describe('verifyToken', () => {
  it('returns the payload for a valid token', () => {
    const token = createToken({ id: VALID_ID })
    const result = verifyToken(token)
    expect(result).not.toBeNull()
    expect(result.id).toBe(VALID_ID)
  })

  it('returns null for a token signed with a different secret', () => {
    const foreign = jwt.sign({ id: VALID_ID }, 'wrong-secret')
    expect(verifyToken(foreign)).toBeNull()
  })

  it('returns null for a tampered token', () => {
    const token = createToken({ id: VALID_ID })
    const tampered = token.slice(0, -5) + 'XXXXX'
    expect(verifyToken(tampered)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(verifyToken('')).toBeNull()
  })

  it('returns null for a random non-JWT string', () => {
    expect(verifyToken('not.a.valid.token')).toBeNull()
  })

  it('returns null for an already-expired token', () => {
    const expired = jwt.sign(
      { id: VALID_ID, exp: Math.floor(Date.now() / 1000) - 10 },
      process.env.JWT_Secret,
    )
    expect(verifyToken(expired)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(verifyToken(undefined)).toBeNull()
  })
})
