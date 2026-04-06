/**
 * Minimal test Express application.
 *
 * Mirrors the routes in server.js but uses Express instead of raw http so that
 * supertest can make assertions against it.  Every route wires the REAL
 * controllers / services — no logic is duplicated here.
 *
 * This file is test infrastructure only and should never be imported by
 * production code.
 */
import express from 'express'
import { ObjectId } from 'mongodb'
import { signUp, login } from '../../controllers/authController.js'
import { verifyToken } from '../../utils/jwtToken.js'
import {
  getAuthToken,
  getFollowersData,
  getFollowingData,
} from '../../services/followService.js'

export function createApp(db) {
  const app = express()
  app.use(express.json())

  // ── POST /get-started ── register ──────────────────────────────────────────
  app.post('/get-started', async (req, res) => {
    const result = await signUp(req.body)
    // authController uses `status` for expected errors, `code` for catch-block
    const httpStatus = result.status ?? result.code ?? 500
    res.status(httpStatus).json(result)
  })

  // ── POST /login ─────────────────────────────────────────────────────────────
  app.post('/login', async (req, res) => {
    const result = await login(req.body)
    const httpStatus = result.status ?? result.code ?? 500
    res.status(httpStatus).json(result)
  })

  // ── GET /verify-token ───────────────────────────────────────────────────────
  app.get('/verify-token', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') ?? ''
    const valid = !!verifyToken(token)
    res.json({ valid })
  })

  // ── DELETE /log-out ─────────────────────────────────────────────────────────
  app.delete('/log-out', (_req, res) => {
    res.json({ message: 'Logged out succesfully', code: 200 })
  })

  // ── GET /my-profile ─────────────────────────────────────────────────────────
  app.get('/my-profile', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(403).json({ message: 'Forbidden: Invalid Token' })

    const verified = verifyToken(token)
    if (!verified) return res.status(403).json({ message: 'Forbidden: Invalid Token' })

    const userId = new ObjectId(verified.id)
    const [user, stats] = await Promise.all([
      db.collection('users').findOne({ _id: userId }),
      db.collection('usersStats').findOne({ userId }),
    ])

    if (!user) return res.status(404).json({ message: 'User Not Found!' })

    const { password: _pw, ...userWithoutPassword } = user
    res.json({ userWithoutPassword, stats })
  })

  // ── GET /my-profile/notifications ──────────────────────────────────────────
  app.get('/my-profile/notifications', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const verified = verifyToken(token)
    if (!verified) return res.status(401).json({ message: 'Unauthorized' })

    const targetUserId = new ObjectId(verified.id)
    const results = await db
      .collection('notifications')
      .find({ targetUserId: targetUserId.toString() })
      .sort({ createdAt: -1 })
      .toArray()

    res.json(results)
  })

  // ── GET /my-profile/followers ───────────────────────────────────────────────
  app.get('/my-profile/followers', async (req, res) => {
    const auth = getAuthToken(req.headers.authorization)
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message })

    const data = await getFollowersData({
      userId: auth.userObjectId,
      db,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 25,
    })
    res.json(data)
  })

  // ── GET /my-profile/following ───────────────────────────────────────────────
  app.get('/my-profile/following', async (req, res) => {
    const auth = getAuthToken(req.headers.authorization)
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message })

    const data = await getFollowingData({
      userId: auth.userObjectId,
      db,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 25,
    })
    res.json(data)
  })

  // ── GET /search/users ───────────────────────────────────────────────────────
  app.get('/search/users', async (req, res) => {
    const query = req.query.q?.trim() ?? ''
    if (!query) return res.json({ results: [] })

    const escapeRegex = (v = '') => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapeRegex(query), 'i')

    const users = await db
      .collection('users')
      .find(
        { $or: [{ username: regex }, { firstName: regex }, { lastName: regex }] },
        { projection: { password: 0 } },
      )
      .limit(10)
      .toArray()

    const results = users.map((u) => ({
      id: u._id,
      type: 'user',
      title: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username,
      username: u.username,
    }))

    res.json({ results })
  })

  return app
}
