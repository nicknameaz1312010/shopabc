import jwt from 'jsonwebtoken'

const JWT_SECRET = 'shopabc_secret_key_2024'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'No token provided' })
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  next()
}

export { JWT_SECRET }
