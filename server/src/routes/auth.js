import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { get, query, run } from '../db.js'
import { JWT_SECRET, authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/register', (req, res) => {
  const { username, email, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })
  try {
    const existing = get('SELECT id FROM users WHERE username = ?', [username])
    if (existing) return res.status(409).json({ error: 'Username already exists' })
    const hash = bcrypt.hashSync(password, 10)
    const result = run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email || '', hash])
    const user = { id: result.lastInsertRowid, username, email: email || '', role: 'user', phone: '' }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })
  try {
    const user = get('SELECT * FROM users WHERE username = ?', [username])
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' })
    const payload = { id: user.id, username: user.username, email: user.email, role: user.role, phone: user.phone }
    const token = jwt.sign(payload, JWT_SECRET)
    res.json({ user: payload, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', authenticate, (req, res) => {
  const user = get('SELECT id, username, email, phone, role FROM users WHERE id = ?', [req.user.id])
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user })
})

router.put('/me', authenticate, (req, res) => {
  const { email, phone } = req.body
  run('UPDATE users SET email = COALESCE(?, email), phone = COALESCE(?, phone) WHERE id = ?', [email || null, phone || null, req.user.id])
  const user = get('SELECT id, username, email, phone, role FROM users WHERE id = ?', [req.user.id])
  res.json({ user })
})

router.get('/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  const users = query('SELECT id, username, email, phone, role, createdAt FROM users ORDER BY id DESC')
  res.json({ users })
})

export default router
