import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken, verifyToken } from '../../utils/jwtToken.js'
import process from 'node:process'
// setup.js sets JWT_Secret and JWT_REFRESH_SECRET before this file runs

const VALID_ID = '507f1f77bcf86cd799439011'

describe('createAccessToken', () => {
  it('returns a three-part JWT string', () => {
    const token = createAccessToken({ id: VALID_ID })
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('embeds the user id and type:"access" in the payload', () => {
    const token = createAccessToken({ id: VALID_ID })
    const payload = verifyAccessToken(token)
    expect(payload.id).toBe(VALID_ID)
    expect(payload.type).toBe('access')
  })

  it('produces tokens that expire in ~15 minutes', () => {
    const token = createAccessToken({ id: VALID_ID })
    const payload = jwt.decode(token)
    const fifteenMinutesInSeconds = 15 * 60
    const diff = payload.exp - payload.iat
    expect(diff).toBe(fifteenMinutesInSeconds)
  })

  it('produces unique tokens for different user ids', () => {
    const t1 = createAccessToken({ id: '507f1f77bcf86cd799439011' })
    const t2 = createAccessToken({ id: '507f1f77bcf86cd799439012' })
    expect(t1).not.toBe(t2)
  })
})

describe('createRefreshToken', () => {
  it('returns a token plus a jti, and embeds type:"refresh"', () => {
    const { token, jti } = createRefreshToken({ id: VALID_ID })
    expect(typeof token).toBe('string')
    expect(typeof jti).toBe('string')
    const payload = verifyRefreshToken(token)
    expect(payload.id).toBe(VALID_ID)
    expect(payload.type).toBe('refresh')
    expect(payload.jti).toBe(jti)
  })

  it('produces tokens that expire in ~7 days', () => {
    const { token } = createRefreshToken({ id: VALID_ID })
    const payload = jwt.decode(token)
    const sevenDaysInSeconds = 7 * 24 * 60 * 60
    const diff = payload.exp - payload.iat
    expect(diff).toBe(sevenDaysInSeconds)
  })

  it('produces a different jti for each call, even for the same user', () => {
    const a = createRefreshToken({ id: VALID_ID })
    const b = createRefreshToken({ id: VALID_ID })
    expect(a.jti).not.toBe(b.jti)
    expect(a.token).not.toBe(b.token)
  })
})

describe('verifyAccessToken (aliased as verifyToken)', () => {
  it('returns the payload for a valid access token', () => {
    const token = createAccessToken({ id: VALID_ID })
    const result = verifyToken(token)
    expect(result).not.toBeNull()
    expect(result.id).toBe(VALID_ID)
  })

  it('returns null for a token signed with a different secret', () => {
    const foreign = jwt.sign({ id: VALID_ID, type: 'access' }, 'wrong-secret')
    expect(verifyToken(foreign)).toBeNull()
  })

  it('returns null for a tampered token', () => {
    const token = createAccessToken({ id: VALID_ID })
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
      { id: VALID_ID, type: 'access', exp: Math.floor(Date.now() / 1000) - 10 },
      process.env.JWT_Secret,
    )
    expect(verifyToken(expired)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(verifyToken(undefined)).toBeNull()
  })

  it('rejects a refresh token presented as an access token', () => {
    const { token } = createRefreshToken({ id: VALID_ID })
    expect(verifyAccessToken(token)).toBeNull()
  })
})

describe('verifyRefreshToken', () => {
  it('returns null for an access token presented as a refresh token', () => {
    const token = createAccessToken({ id: VALID_ID })
    expect(verifyRefreshToken(token)).toBeNull()
  })

  it('returns null for a token signed with the access secret', () => {
    const wrongSecretToken = jwt.sign(
      { id: VALID_ID, type: 'refresh', jti: 'x' },
      process.env.JWT_Secret,
    )
    expect(verifyRefreshToken(wrongSecretToken)).toBeNull()
  })
})
