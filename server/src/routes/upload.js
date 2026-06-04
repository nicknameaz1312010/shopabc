import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticate, adminOnly } from '../middleware/auth.js'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
})

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })
const router = Router()

router.post('/', authenticate, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

export default router
